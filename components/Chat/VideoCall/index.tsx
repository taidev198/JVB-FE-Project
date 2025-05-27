import React, { useRef, useState, useEffect } from "react";
import { Client } from '@stomp/stompjs';
import SockJS from "sockjs-client";
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import CallIcon from '@mui/icons-material/Call';
import CallEndIcon from '@mui/icons-material/CallEnd';

// const iceServers = [
//     // { urls: "stun:stun.1.google.com:19302" },
//     { urls: "stun:stun.l.google.com:19302" }
// ];

const iceServers = [
    {
      urls: 'stun:stun.l.google.com:19302'
    },
    {
      urls: 'turn:relay.metered.ca:80',
      username: 'openai',
      credential: 'chatgpt'
    }
  ];

interface Transcription {
  text: string;
  timestamp: number;
  speaker: string;
}

export default function Home() {
    const searchParams = useSearchParams();
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const [data, setData] = useState<any>(null);
    const [currentId, setCurrentId] = useState<any>(null);
    const [idAccount, setIdAccount] = useState<string>('');

    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const pendingCandidatesRef = useRef<RTCIceCandidate[]>([]);

    const [connected, setConnected] = useState(false);
    const [stompClient, setStompClient] = useState<Client | null>(null);
    const [isStompConnected, setIsStompConnected] = useState(false);
    const [connectionState, setConnectionState] = useState<string>('new');

    const [isRecording, setIsRecording] = useState(false);
    const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const transcriptionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const [incomingCall, setIncomingCall] = useState<{
        from: string;
        offer: RTCSessionDescriptionInit;
    } | null>(null);

    const [iceGatheringState, setIceGatheringState] = useState<string>('new');
    const [reconnectAttempts, setReconnectAttempts] = useState(0);
    const MAX_RECONNECT_ATTEMPTS = 3;
    const RECONNECT_DELAY = 2000; // 2 seconds

    useEffect(() => {
        const rawData = searchParams.get('data');
        if (rawData) {
            try {
                const parsedData = JSON.parse(decodeURIComponent(rawData));
                console.log("Parsed data:", parsedData);
                setData(parsedData.userId);
                setCurrentId(parsedData.currentId)
                setIdAccount(parsedData.userId);
            } catch (e) {
                console.error('Failed to parse data', e);
            }
        }
    }, []);
//step 1: get video from local stream
    useEffect(() => {
        async function startLocalStream() {
            try {
                console.log("Requesting media devices...");
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                console.log("Got local stream:", stream.getTracks().map(t => t.kind));
                setLocalStream(stream);
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error("Error accessing media devices", error);
            }
        }
        startLocalStream();
        return () => {
            localStream?.getTracks().forEach((t) => t.stop());
        }
    }, []);

    useEffect(() => {
        if (!localStream || !data) {
            console.log("Waiting for localStream and data...", { localStream: !!localStream, data });
            return;
        }

        console.log("Setting up peer connection...");
        
        // Cleanup existing peer connection if it exists
        if (peerConnectionRef.current) {
            console.log("Cleaning up existing peer connection");
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }

        const pc = new RTCPeerConnection({
            iceServers: [
                { urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'] },
                {
                    urls: 'turn:relay.metered.ca:80',
                    username: 'openai',
                    credential: 'chatgpt'
                },
                {
                    urls: 'turn:relay.metered.ca:443',
                    username: 'openai',
                    credential: 'chatgpt'
                },
                {
                    urls: 'turn:relay.metered.ca:443?transport=tcp',
                    username: 'openai',
                    credential: 'chatgpt'
                }
            ],
            iceCandidatePoolSize: 10,
            bundlePolicy: 'max-bundle',
            rtcpMuxPolicy: 'require',
            iceTransportPolicy: 'all'
        });

        remoteVideoRef.current.srcObject = new MediaStream();

        console.log("Created new peer connection");
        peerConnectionRef.current = pc;

        // Add local tracks to peer connection
        localStream.getTracks().forEach((track) => {
            console.log("Adding local track to peer connection:", track.kind);
            pc.addTrack(track, localStream);
        });

        // Handle ICE gathering state
        pc.onicegatheringstatechange = () => {
            console.log("ICE gathering state:", pc.iceGatheringState);
            setIceGatheringState(pc.iceGatheringState);
        };

        // Handle ICE candidates
        pc.onicecandidate = (event) => {
            if (event.candidate && stompClient && isStompConnected) {
                console.log("Sending ICE candidate:", event.candidate);
                const candidatePayload = {
                    chatRoomId: currentId,
                    chatType: "candidate",
                    candidate: JSON.stringify(event.candidate),
                    senderId: data,
                    receiverId: incomingCall?.from || currentId
                };
                
                // Store candidate if we're not connected yet
                if (!isStompConnected) {
                    pendingCandidatesRef.current.push(candidatePayload);
                } else {
                    stompClient.publish({
                        destination: `/app/videochat/${data}`,
                        body: JSON.stringify(candidatePayload),
                    });
                }
            }
        };

        // Handle ICE connection state
        pc.oniceconnectionstatechange = () => {
            console.log("ICE Connection State:", pc.iceConnectionState);
            if (pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'disconnected') {
                console.log("ICE connection failed/disconnected, attempting to recover...");
                handleReconnect();
            }
        };

        // Handle connection state changes
        pc.onconnectionstatechange = () => {
            console.log("Connection state changed:", pc.connectionState);
            setConnectionState(pc.connectionState);
            if (pc.connectionState === 'connected') {
                setConnected(true);
                setReconnectAttempts(0);
            } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
                setConnected(false);
                handleReconnect();
            }
        };

        // Handle signaling state changes
        pc.onsignalingstatechange = () => {
            console.log("Signaling state changed:", pc.signalingState);
            if (pc.signalingState === 'closed') {
                console.log("Signaling state closed, attempting to recover...");
                handleReconnect();
            }
        };

        // Handle remote track
        pc.ontrack = (event) => {
            console.log("Received remote track:", event.streams[0].getTracks().map(t => t.kind));
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0];
            }
        };

        setPeerConnection(pc);

        return () => {
            if (pc) {
                console.log("Cleaning up peer connection on unmount");
                pc.close();
                peerConnectionRef.current = null;
                pendingCandidatesRef.current = [];
            }
        };
    }, [localStream, data]);

    useEffect(() => {
        if (!data) {
            console.log("Waiting for data before connecting to WebSocket...");
            return;
        }

        console.log("Connecting to WebSocket with data:", data);
        const client = new Client({
            webSocketFactory: () => {
                const url = `${process.env.NEXT_PUBLIC_API_URL_CHAT}/ws/stomp`;
                console.log("Connecting to WebSocket URL:", url);
                return new SockJS(url);
            },
            onConnect: () => {
                console.log("Connected to WebSocket");
                setStompClient(client);
                setIsStompConnected(true);
                
                const userTopic = `/topic/new-videocall/${data}`;
                console.log("Subscribing to user topic:", userTopic);
                
                client.subscribe(userTopic, async (message) => {
                    if (!message.body) {
                        console.warn('Received empty message');
                        return;
                    }

                    const payload = JSON.parse(message.body);
                    console.log('Received message on topic', userTopic, ':', payload);

                    if (!peerConnectionRef.current) {
                        console.error("No peer connection available");
                        return;
                    }

                    try {
                        if (payload.chatType === "offer") {
                            console.log("Received offer from peer");
                            setIncomingCall({
                                from: payload.senderId,
                                offer: {
                                    type: "offer",
                                    sdp: payload.sdp
                                }
                            });
                        } else if (payload.chatType === "answer") {
                            console.log("Received answer from peer");
                            if (peerConnectionRef.current.signalingState === 'have-local-offer') {
                                await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription({
                                    type: "answer",
                                    sdp: payload.sdp
                                }));
                                console.log("Set remote description (answer)");
                            } else {
                                console.warn("Cannot set remote answer in current state:", peerConnectionRef.current.signalingState);
                            }
                        } else if (payload.chatType === "candidate") {
                            console.log("Received ICE candidate from peer");
                            const candidate = new RTCIceCandidate(JSON.parse(payload.candidate));
                            
                            if (peerConnectionRef.current.remoteDescription && peerConnectionRef.current.remoteDescription.type) {
                                console.log("Adding ICE candidate immediately");
                                await peerConnectionRef.current.addIceCandidate(candidate);
                            } else {
                                console.log("Storing candidate for later");
                                pendingCandidatesRef.current.push(candidate);
                            }
                        }
                    } catch (error) {
                        console.error("Error handling message:", error);
                    }
                });
            },
            onDisconnect: () => {
                console.log("Disconnected from WebSocket");
                setIsStompConnected(false);
            },
            onStompError: (frame) => {
                console.error('STOMP Error:', frame.headers['message']);
                console.error('Details:', frame.body);
                setIsStompConnected(false);
            },
        });

        client.activate();

        return () => {
            client.deactivate();
            setIsStompConnected(false);
        };
    }, [data]);

    const startCall = async () => {
        if (!peerConnectionRef.current || !stompClient || !isStompConnected) {
            console.error("Cannot start call:", {
                hasPeerConnection: !!peerConnectionRef.current,
                hasStompClient: !!stompClient,
                isStompConnected
            });
            return;
        }

        try {
            console.log("Creating offer...");
            const offer = await peerConnectionRef.current.createOffer();
            console.log("Offer created:", offer);
            
            await peerConnectionRef.current.setLocalDescription(offer);
            console.log("Local description set");
            remoteVideoRef.current.srcObject = new MediaStream();
            
            const destination = `/app/videochat/${data}`;
            const offerPayload = {
                chatRoomId: currentId,
                chatType: "offer",
                sdp: offer.sdp,
                senderId: data,
                receiverId: currentId // This will be replaced by the backend with the correct receiver ID
            };
            
            console.log("Sending offer to", destination, ":", offerPayload);
            stompClient.publish({
                destination,
                body: JSON.stringify(offerPayload),
            });
            console.log("Offer sent");
        } catch (error) {
            console.error("Error starting call:", error);
        }
    };

    // Function to start audio recording
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
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
            console.error('Error starting recording:', error);
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

            const response = await axios.post(
                'https://api.openai.com/v1/audio/transcriptions',
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.data.text) {
                const newTranscription: Transcription = {
                    text: response.data.text,
                    timestamp: Date.now(),
                    speaker: data === idAccount ? 'You' : 'Other'
                };

                setTranscriptions(prev => [...prev, newTranscription]);
            }
        } catch (error) {
            console.error('Error transcribing audio:', error);
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
        };
    }, []);

    const handleAcceptCall = async () => {
        if (!incomingCall || !peerConnectionRef.current || !stompClient || !isStompConnected) {
            console.error("Cannot accept call: missing required data", {
                hasIncomingCall: !!incomingCall,
                hasPeerConnection: !!peerConnectionRef.current,
                hasStompClient: !!stompClient,
                isStompConnected
            });
            return;
        }

        try {
            console.log("Accepting call from:", incomingCall.from);
            
            // Set remote description
            await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(incomingCall.offer));
            console.log("Set remote description (offer)");
            
            // Create and set local description
            const answer = await peerConnectionRef.current.createAnswer();
            console.log("Created answer");
            
            await peerConnectionRef.current.setLocalDescription(answer);
            console.log("Set local description (answer)");
            
            // Send answer
            const destination = `/app/videochat/${data}`;
            const answerPayload = {
                chatRoomId: currentId,
                chatType: "answer",
                sdp: answer.sdp,
                senderId: data,
                receiverId: incomingCall.from
            };
            
            console.log("Sending answer to", destination, ":", answerPayload);
            stompClient.publish({
                destination,
                body: JSON.stringify(answerPayload),
            });

            // Send any pending ICE candidates
            while (pendingCandidatesRef.current.length > 0) {
                const candidate = pendingCandidatesRef.current.shift();
                if (candidate) {
                    stompClient.publish({
                        destination: `/app/videochat/${data}`,
                        body: JSON.stringify(candidate),
                    });
                }
            }
            
            setIncomingCall(null);
        } catch (error) {
            console.error("Error accepting call:", error);
            if (peerConnectionRef.current) {
                peerConnectionRef.current.restartIce();
            }
        }
    };

    const handleRejectCall = () => {
        setIncomingCall(null);
    };

    const handleReconnect = async () => {
        if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
            console.log("Max reconnect attempts reached");
            return;
        }

        console.log(`Attempting to reconnect (attempt ${reconnectAttempts + 1}/${MAX_RECONNECT_ATTEMPTS})`);
        setReconnectAttempts(prev => prev + 1);

        try {
            if (!peerConnectionRef.current) {
                console.error("No peer connection available");
                return;
            }

            const pc = peerConnectionRef.current;
            console.log("Current signaling state:", pc.signalingState);

            // Only proceed if we're in a valid state for reconnection
            if (pc.signalingState === 'stable') {
                console.log("Connection is stable, creating new offer...");
                const offer = await pc.createOffer({
                    iceRestart: true
                });
                await pc.setLocalDescription(offer);
                
                if (stompClient && isStompConnected) {
                    const destination = `/app/videochat/${data}`;
                    const offerPayload = {
                        chatRoomId: currentId,
                        chatType: "offer",
                        sdp: offer.sdp,
                        senderId: data,
                        receiverId: currentId
                    };
                    
                    stompClient.publish({
                        destination,
                        body: JSON.stringify(offerPayload),
                    });
                }
            } else if (pc.signalingState === 'have-local-offer') {
                console.log("Have local offer, waiting for answer...");
                // Wait for answer
            } else if (pc.signalingState === 'have-remote-offer') {
                console.log("Have remote offer, creating answer...");
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                
                if (stompClient && isStompConnected) {
                    const destination = `/app/videochat/${data}`;
                    const answerPayload = {
                        chatRoomId: currentId,
                        chatType: "answer",
                        sdp: answer.sdp,
                        senderId: data,
                        receiverId: incomingCall?.from || currentId
                    };
                    
                    stompClient.publish({
                        destination,
                        body: JSON.stringify(answerPayload),
                    });
                }
            } else {
                console.log("Invalid signaling state for reconnection:", pc.signalingState);
                // Reset the connection
                pc.close();
                peerConnectionRef.current = null;
                
                // Create new peer connection
                const newPc = new RTCPeerConnection({
                    iceServers: [
                        { urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'] },
                        {
                            urls: 'turn:relay.metered.ca:80',
                            username: 'openai',
                            credential: 'chatgpt'
                        },
                        {
                            urls: 'turn:relay.metered.ca:443',
                            username: 'openai',
                            credential: 'chatgpt'
                        },
                        {
                            urls: 'turn:relay.metered.ca:443?transport=tcp',
                            username: 'openai',
                            credential: 'chatgpt'
                        }
                    ],
                    iceCandidatePoolSize: 10,
                    bundlePolicy: 'max-bundle',
                    rtcpMuxPolicy: 'require',
                    iceTransportPolicy: 'all'
                });

                // Add local tracks
                if (localStream) {
                    localStream.getTracks().forEach(track => {
                        newPc.addTrack(track, localStream);
                    });
                }

                // Set up event handlers
                newPc.onicecandidate = (event) => {
                    if (event.candidate && stompClient && isStompConnected) {
                        stompClient.publish({
                            destination: `/app/videochat/${data}`,
                            body: JSON.stringify({
                                chatRoomId: currentId,
                                chatType: "candidate",
                                candidate: JSON.stringify(event.candidate),
                                senderId: data,
                                receiverId: incomingCall?.from || currentId
                            }),
                        });
                    }
                };

                newPc.ontrack = (event) => {
                    if (remoteVideoRef.current) {
                        remoteVideoRef.current.srcObject = event.streams[0];
                    }
                };

                peerConnectionRef.current = newPc;
                setPeerConnection(newPc);

                // Start new call if we were the caller
                if (!incomingCall) {
                    startCall();
                }
            }
        } catch (error) {
            console.error("Error during reconnection:", error);
            // If we hit an error, try to create a new connection
            if (peerConnectionRef.current) {
                peerConnectionRef.current.close();
                peerConnectionRef.current = null;
            }
            // The useEffect will create a new connection
        }
    };

    return (
        <div className="p-4">
            <div className="mb-4">
                <h2 className="text-xl font-bold mb-2">Video Call</h2>
                <div className="bg-blue-50 p-4 rounded mb-4">
                    <h3 className="font-semibold mb-2">How to test:</h3>
                    <ol className="list-decimal list-inside space-y-1">
                        <li>Open this page in two different tabs</li>
                        <li>Wait for "WebSocket Connected" status in both tabs</li>
                        <li>Click "Start Call" in ONE tab only</li>
                        <li>The other tab will receive an incoming call notification</li>
                        <li>Accept or reject the call in the receiving tab</li>
                    </ol>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={startCall}
                        className={`px-4 py-2 rounded text-white ${
                            isStompConnected 
                                ? 'bg-blue-500 hover:bg-blue-600' 
                                : 'bg-gray-400 cursor-not-allowed'
                        }`}
                        disabled={!isStompConnected}
                    >
                        {isStompConnected ? "Start Call" : "Connecting..."}
                    </button>
                    <button
                        onClick={isRecording ? stopRecording : startRecording}
                        className={`px-4 py-2 rounded text-white ${
                            isRecording 
                                ? 'bg-red-500 hover:bg-red-600' 
                                : 'bg-green-500 hover:bg-green-600'
                        }`}
                    >
                        {isRecording ? 'Stop Transcription' : 'Start Transcription'}
                    </button>
                </div>
            </div>

            {/* Incoming Call Notification */}
            {incomingCall && (
                <div className="fixed top-4 right-4 bg-white rounded-lg shadow-lg p-4 z-50">
                    <div className="flex items-center gap-4">
                        <div className="animate-pulse">
                            <CallIcon className="text-green-500 text-3xl" />
                        </div>
                        <div>
                            <h3 className="font-semibold">Incoming Call</h3>
                            <p className="text-sm text-gray-600">From: {incomingCall.from}</p>
                        </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={handleAcceptCall}
                            className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center justify-center gap-2"
                        >
                            <CallIcon />
                            Accept
                        </button>
                        <button
                            onClick={handleRejectCall}
                            className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center justify-center gap-2"
                        >
                            <CallEndIcon />
                            Reject
                        </button>
                    </div>
                </div>
            )}

            <div className="flex gap-4">
                <div>
                    <h3 className="text-lg font-semibold mb-2">Local Video (You)</h3>
                    <video 
                        ref={localVideoRef} 
                        autoPlay 
                        playsInline 
                        muted
                        className="w-80 h-60 bg-black rounded"
                    />
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-2">Remote Video (Other Person)</h3>
                    <video 
                        ref={remoteVideoRef} 
                        autoPlay 
                        playsInline 
                        className="w-80 h-60 bg-black rounded"
                    />
                </div>
            </div>
            <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Live Transcription</h3>
                <div className="bg-white rounded-lg shadow p-4 max-h-60 overflow-y-auto">
                    {transcriptions.length === 0 ? (
                        <p className="text-gray-500 text-center">No transcriptions yet</p>
                    ) : (
                        <div className="space-y-2">
                            {transcriptions.map((transcription, index) => (
                                <div 
                                    key={index}
                                    className={`p-2 rounded ${
                                        transcription.speaker === 'You' 
                                            ? 'bg-blue-100 ml-4' 
                                            : 'bg-gray-100 mr-4'
                                    }`}
                                >
                                    <div className="text-sm font-semibold text-gray-600">
                                        {transcription.speaker}
                                    </div>
                                    <div className="text-sm">{transcription.text}</div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {new Date(transcription.timestamp).toLocaleTimeString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-4 space-y-2">
                <p className="flex items-center">
                    <span className="w-32">WebSocket:</span>
                    <span className={`px-2 py-1 rounded ${
                        isStompConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                        {isStompConnected ? "Connected" : "Disconnected"}
                    </span>
                </p>
                <p className="flex items-center">
                    <span className="w-32">WebRTC State:</span>
                    <span className={`px-2 py-1 rounded ${
                        connectionState === 'connected' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                        {connectionState}
                    </span>
                </p>
                <p className="flex items-center">
                    <span className="w-32">ICE Gathering:</span>
                    <span className={`px-2 py-1 rounded ${
                        iceGatheringState === 'complete' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                        {iceGatheringState}
                    </span>
                </p>
                <p className="flex items-center">
                    <span className="w-32">Connection:</span>
                    <span className={`px-2 py-1 rounded ${
                        connected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                        {connected ? "Connected" : "Not connected"}
                    </span>
                </p>
                {reconnectAttempts > 0 && (
                    <p className="flex items-center">
                        <span className="w-32">Reconnect:</span>
                        <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800">
                            Attempt {reconnectAttempts}/{MAX_RECONNECT_ATTEMPTS}
                        </span>
                    </p>
                )}
                {isTranscribing && (
                    <p className="flex items-center">
                        <span className="w-32">Transcribing:</span>
                        <span className="px-2 py-1 rounded bg-blue-100 text-blue-800">
                            Processing audio...
                        </span>
                    </p>
                )}
            </div>
        </div>
    );
}
