import React, { useRef, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import CallIcon from '@mui/icons-material/Call';
import CallEndIcon from '@mui/icons-material/CallEnd';
import { useDispatch } from 'react-redux';
import { setVideoCallActive, setVideoCallWindowId } from '@/store/slices/chatSlice';

interface Transcription {
  text: string;
  timestamp: number;
  speaker: string;
}

export default function Home() {
  const searchParams = useSearchParams();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [receiverId, setReceiverId] = useState<string>('');
  const [chatrommId, setChatrommId] = useState<string>('');
  const [senderId, setSenderId] = useState<string>('');
  const [isCaller, setIsCaller] = useState<boolean>(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [connected, setConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const transcriptionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dispatch = useDispatch();

  // Add state display
  const [connectionState, setConnectionState] = useState<string>('new');
  const [iceGatheringState, setIceGatheringState] = useState<string>('new');
  const [iceConnectionState, setIceConnectionState] = useState<string>('new');
  const [signalingState, setSignalingState] = useState<string>('new');
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);

  useEffect(() => {
    const rawData = searchParams.get('data');
    if (rawData) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(rawData));
        //console.log('Parsed data:', parsedData);
        setReceiverId(parsedData.receiverId);
        setSenderId(parsedData.senderId);
        setChatrommId(parsedData.chatRoomId);
        setIsCaller(parsedData.isCaller || false);

        // Create peer connection if not exists
        if (!peerConnection) {
          const pc = new RTCPeerConnection({
            iceServers: [
              { urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'] },
              {
                urls: 'turn:relay.metered.ca:80',
                username: 'openai',
                credential: 'chatgpt',
              },
              {
                urls: 'turn:relay.metered.ca:443',
                username: 'openai',
                credential: 'chatgpt',
              },
              {
                urls: 'turn:relay.metered.ca:443?transport=tcp',
                username: 'openai',
                credential: 'chatgpt',
              },
            ],
            iceCandidatePoolSize: 10,
            bundlePolicy: 'max-bundle',
            rtcpMuxPolicy: 'require',
            iceTransportPolicy: 'all',
          });

          // Set up event handlers
          pc.onicegatheringstatechange = () => {
            //console.log('ICE gathering state:', pc.iceGatheringState);
            setIceGatheringState(pc.iceGatheringState);
          };

          pc.oniceconnectionstatechange = () => {
            //console.log('ICE Connection State:', pc.iceConnectionState);
            setIceConnectionState(pc.iceConnectionState);
          };

          pc.onconnectionstatechange = () => {
            //console.log('Connection state changed:', pc.connectionState);
            setConnectionState(pc.connectionState);
            if (pc.connectionState === 'connected') {
              setConnected(true);
            }
          };

          pc.onsignalingstatechange = () => {
            //console.log('Signaling state changed:', pc.signalingState);
            setSignalingState(pc.signalingState);
          };

          pc.ontrack = event => {
            // console.log(
            //   'Received remote track:',
            //   event.streams[0].getTracks().map(t => t.kind)
            // );
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = event.streams[0];
            }
          };

          setPeerConnection(pc);

          // Handle offer/answer from URL data
          if (parsedData.offer) {
            //console.log('Setting remote description (offer) from URL data');
            pc.setRemoteDescription(new RTCSessionDescription(parsedData.offer))
              .then(() => {
                if (parsedData.answer) {
                  return pc.setLocalDescription(new RTCSessionDescription(parsedData.answer));
                } else if (isCaller) {
                  return pc
                    .createOffer({
                      offerToReceiveAudio: true,
                      offerToReceiveVideo: true,
                      iceRestart: true,
                    })
                    .then(offer => pc.setLocalDescription(offer));
                }
              })
              .catch(error => {
                //console.error('Error setting descriptions:', error);
              });
          }
        }
      } catch (e) {
        //console.error('Failed to parse data', e);
      }
    }
  }, []);

  // Initialize local stream
  useEffect(() => {
    async function startLocalStream() {
      try {
        // console.log('Requesting media devices...');
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        // console.log(
        //   'Got local stream:',
        //   stream.getTracks().map(t => t.kind)
        // );
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Add local tracks to peer connection
        if (peerConnection) {
          stream.getTracks().forEach(track => {
            peerConnection.addTrack(track, stream);
          });
        }
      } catch (error) {
        //console.error('Error accessing media devices', error);
      }
    }
    startLocalStream();
    return () => {
      localStream?.getTracks().forEach(t => t.stop());
    };
  }, [peerConnection]);

  // Function to start audio recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await transcribeAudio(audioBlob);
      };

      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);

      // Set up periodic transcription
      transcriptionTimeoutRef.current = setInterval(async () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
          mediaRecorderRef.current.start(1000);
        }
      }, 10000); // Transcribe every 10 seconds
    } catch (error) {
      //console.error('Error starting recording:', error);
    }
  };

  // Function to stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      if (transcriptionTimeoutRef.current) {
        clearInterval(transcriptionTimeoutRef.current);
      }
    }
  };

  // Function to transcribe audio using Whisper API
  const transcribeAudio = async (audioBlob: Blob) => {
    if (isTranscribing) return;

    try {
      setIsTranscribing(true);
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.webm');
      formData.append('model', 'whisper-1');

      const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.text) {
        const newTranscription: Transcription = {
          text: response.data.text,
          timestamp: Date.now(),
          speaker: senderId === senderId ? 'You' : 'Other',
        };

        setTranscriptions(prev => [...prev, newTranscription]);
      }
    } catch (error) {
      //console.error('Error transcribing audio:', error);
    } finally {
      setIsTranscribing(false);
    }
  };

  // Cleanup function
  useEffect(() => {
    return () => {
      stopRecording();
      if (transcriptionTimeoutRef.current) {
        clearInterval(transcriptionTimeoutRef.current);
      }
      if (peerConnection) {
        peerConnection.close();
      }
    };
  }, [peerConnection]);

  // Add cleanup effect
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Clean up media streams
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      if (remoteStream) {
        remoteStream.getTracks().forEach(track => track.stop());
      }
      if (peerConnection) {
        peerConnection.close();
      }

      // Reset video call state
      dispatch(setVideoCallActive(false));
      dispatch(setVideoCallWindowId(null));
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      handleBeforeUnload();
    };
  }, [localStream, remoteStream, peerConnection, dispatch]);

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="mb-2 text-xl font-bold">Video Call</h2>
        {!isCaller && !connected && (
          <div className="mb-4 rounded bg-yellow-50 p-4">
            <p>Waiting for incoming call...</p>
          </div>
        )}
        {isCaller && !connected && (
          <div className="mb-4 rounded bg-blue-50 p-4">
            <p>Calling {receiverId}...</p>
          </div>
        )}
        {connected && (
          <div className="mb-4 rounded bg-green-50 p-4">
            <p>Call connected!</p>
          </div>
        )}
        <div className="flex gap-2">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`rounded px-4 py-2 text-white ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}>
            {isRecording ? 'Stop Transcription' : 'Start Transcription'}
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        <div>
          <h3 className="mb-2 text-lg font-semibold">Local Video (You)</h3>
          <video ref={localVideoRef} autoPlay playsInline muted className="h-60 w-80 rounded bg-black" />
        </div>
        <div>
          <h3 className="mb-2 text-lg font-semibold">Remote Video (Other Person)</h3>
          <video ref={remoteVideoRef} autoPlay playsInline className="h-60 w-80 rounded bg-black" />
        </div>
      </div>

      {/* Add state display */}
      <div className="mt-4 space-y-2">
        <p className="flex items-center">
          <span className="w-32">Connection State:</span>
          <span className={`rounded px-2 py-1 ${connectionState === 'connected' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {connectionState}
          </span>
        </p>
        <p className="flex items-center">
          <span className="w-32">ICE Gathering:</span>
          <span className={`rounded px-2 py-1 ${iceGatheringState === 'complete' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {iceGatheringState}
          </span>
        </p>
        <p className="flex items-center">
          <span className="w-32">ICE Connection:</span>
          <span className={`rounded px-2 py-1 ${iceConnectionState === 'connected' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {iceConnectionState}
          </span>
        </p>
        <p className="flex items-center">
          <span className="w-32">Signaling State:</span>
          <span className={`rounded px-2 py-1 ${signalingState === 'stable' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {signalingState}
          </span>
        </p>
        {isTranscribing && (
          <p className="flex items-center">
            <span className="w-32">Transcribing:</span>
            <span className="rounded bg-blue-100 px-2 py-1 text-blue-800">Processing audio...</span>
          </p>
        )}
      </div>

      <div className="mt-4">
        <h3 className="mb-2 text-lg font-semibold">Live Transcription</h3>
        <div className="max-h-60 overflow-y-auto rounded-lg bg-white p-4 shadow">
          {transcriptions.length === 0 ? (
            <p className="text-center text-gray-500">No transcriptions yet</p>
          ) : (
            <div className="space-y-2">
              {transcriptions.map((transcription, index) => (
                <div key={index} className={`rounded p-2 ${transcription.speaker === 'You' ? 'ml-4 bg-blue-100' : 'mr-4 bg-gray-100'}`}>
                  <div className="text-sm font-semibold text-gray-600">{transcription.speaker}</div>
                  <div className="text-sm">{transcription.text}</div>
                  <div className="mt-1 text-xs text-gray-500">{new Date(transcription.timestamp).toLocaleTimeString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
