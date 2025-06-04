import React, { useRef, useState, useEffect } from "react";
import { Client } from '@stomp/stompjs';
import SockJS from "sockjs-client";
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import CallIcon from '@mui/icons-material/Call';
import CallEndIcon from '@mui/icons-material/CallEnd';
import { useDispatch } from 'react-redux';
import { setVideoCallActive, setVideoCallWindowId } from '@/store/slices/chatSlice';

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
    const [receiverId, setReceiverId] = useState<string>('');
    const [chatrommId, setChatrommId] = useState<string>('');
    const [senderId, setSenderId] = useState<string>('');
    const [isCaller, setIsCaller] = useState<boolean>(false);

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

    const dispatch = useDispatch();

    useEffect(() => {
        const rawData = searchParams.get('data');
        if (rawData) {
          try {
                const parsedData = JSON.parse(decodeURIComponent(rawData));
                console.log("Parsed data:", parsedData);
                setReceiverId(parsedData.receiverId);
                setSenderId(parsedData.senderId);
                setChatrommId(parsedData.chatRoomId);
                setIsCaller(parsedData.isCaller || false);
          } catch (e) {
            console.error('Failed to parse data', e);
          }
        }
    }, []);

    // Initialize WebSocket connection first
    useEffect(() => {
        if (!senderId) {
            console.log("Waiting for senderId before connecting to WebSocket...");
            return;
        }

        console.log("Connecting to WebSocket with senderId:", senderId);
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
                
                const userTopic = `/topic/new-videocall/${senderId}`;
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
                            // If we're not the caller and don't already have an incoming call
                            if (!isCaller && !incomingCall) {
                                setIncomingCall({
                                    from: payload.senderId,
                                    offer: {
                                        type: "offer",
                                        sdp: payload.sdp
                                    }
                                });
                            }
                        } else if (payload.chatType === "answer") {
                            console.log("Received answer from peer");
                            if (peerConnectionRef.current.signalingState === 'have-local-offer') {
                                console.log("Setting remote description with answer:", payload.sdp);
                                try {
                                    const remoteDesc = new RTCSessionDescription({
                                        type: "answer",
                                        sdp: payload.sdp
                                    });
                                    await peerConnectionRef.current.setRemoteDescription(remoteDesc);
                                    console.log("Set remote description (answer)");
                                    
                                    // Start gathering ICE candidates after setting remote description
                                    if (peerConnectionRef.current.iceGatheringState === 'new') {
                                        console.log("Starting ICE gathering after answer...");
                                        peerConnectionRef.current.restartIce();
                                    }
                                } catch (error) {
                                    console.error("Error setting remote description:", error);
                                }
                            } else {
                                console.warn("Cannot set remote answer in current state:", peerConnectionRef.current.signalingState);
                            }
                        } else if (payload.chatType === "candidate") {
                            console.log("Received ICE candidate from peer");
                            try {
                                const candidate = new RTCIceCandidate(JSON.parse(payload.candidate));
                                
                                if (peerConnectionRef.current.remoteDescription && peerConnectionRef.current.remoteDescription.type) {
                                    console.log("Adding ICE candidate immediately");
                                    await peerConnectionRef.current.addIceCandidate(candidate);
                                } else {
                                    console.log("Storing candidate for later");
                                    pendingCandidatesRef.current.push(candidate);
                                }
                            } catch (error) {
                                console.error("Error handling ICE candidate:", error);
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
    }, [senderId, isCaller, incomingCall]);

    // Initialize local stream
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

    // Initialize peer connection after local stream and WebSocket are ready
    useEffect(() => {
        if (!localStream || !senderId || !isStompConnected) {
            console.log("Waiting for localStream, senderId, and WebSocket connection...", { 
                hasLocalStream: !!localStream, 
                hasSenderId: !!senderId,
                isStompConnected 
            });
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
                }
            ],
            iceCandidatePoolSize: 10,
            bundlePolicy: 'max-bundle',
            rtcpMuxPolicy: 'require',
            iceTransportPolicy: 'all'
        });

        console.log("Created new peer connection");
        peerConnectionRef.current = pc;

        // Add local tracks to peer connection
        localStream.getTracks().forEach((track) => {
            console.log("Adding local track to peer connection:", track.kind);
            pc.addTrack(track, localStream);
        });

        // Set up event handlers
        pc.onicegatheringstatechange = () => {
            console.log("ICE gathering state:", pc.iceGatheringState);
            setIceGatheringState(pc.iceGatheringState);
        };

        pc.onicecandidate = (event) => {
            if (event.candidate && stompClient && isStompConnected) {
                console.log("Sending ICE candidate:", event.candidate);
                const candidatePayload = {
                    chatRoomId: chatrommId,
                    chatType: "candidate",
                    candidate: JSON.stringify(event.candidate),
                    senderId: senderId,
                    receiverId: isCaller ? receiverId : incomingCall?.from
                };
                
                stompClient.publish({
                    destination: `/app/videochat/${isCaller ? receiverId : incomingCall?.from}`,
                    body: JSON.stringify(candidatePayload),
                });
            }
        };

        pc.oniceconnectionstatechange = () => {
            console.log("ICE Connection State:", pc.iceConnectionState);
            if (pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'disconnected') {
                console.log("ICE connection failed/disconnected, attempting to recover...");
                handleReconnect();
            }
        };

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

        pc.ontrack = (event) => {
            console.log("Received remote track:", event.streams[0].getTracks().map(t => t.kind));
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0];
            }
        };

        // Add signaling state change handler
        pc.onsignalingstatechange = () => {
            console.log("Signaling state changed:", pc.signalingState);
            if (pc.signalingState === 'stable') {
                console.log("Signaling state is stable, checking connection state");
                if (pc.connectionState === 'new') {
                    console.log("Connection still new, attempting to establish connection");
                    // Force ICE gathering to start
                    pc.restartIce();
                }
            }
        };

        setPeerConnection(pc);

        // If we're the caller, start the call immediately
        if (isCaller) {
            console.log("We are the caller, starting call...");
            startCall();
        } else {
            // If we're the receiver, we need to wait for the offer
            console.log("We are the receiver, waiting for offer...");
        }

        return () => {
            if (pc) {
                console.log("Cleaning up peer connection on unmount");
                pc.close();
                peerConnectionRef.current = null;
            }
        };
    }, [localStream, senderId, isStompConnected, isCaller, receiverId, incomingCall]);

    // Handle incoming offer
    useEffect(() => {
        if (!isCaller && incomingCall && peerConnectionRef.current && stompClient && isStompConnected) {
            console.log("Received incoming call, handling offer...");
            handleAcceptCall();
        }
    }, [incomingCall, isCaller, peerConnectionRef.current, stompClient, isStompConnected]);

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
            console.log("Incoming offer:", incomingCall.offer);
            
            // Create a proper RTCSessionDescription object
            const remoteDesc = new RTCSessionDescription({
                type: "offer",
                sdp: incomingCall.offer.sdp
            });
            
            console.log("Setting remote description:", remoteDesc);
            await peerConnectionRef.current.setRemoteDescription(remoteDesc);
            console.log("Set remote description (offer)");
            
            // Create and set local description
            const answer = await peerConnectionRef.current.createAnswer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true
            });
            console.log("Created answer:", answer);
            
            await peerConnectionRef.current.setLocalDescription(answer);
            console.log("Set local description (answer)");
            
            // Send answer
            const answerPayload = {
                chatRoomId: chatrommId,
                chatType: "answer",
                sdp: answer.sdp,
                senderId: senderId,
                receiverId: incomingCall.from
            };
            
            console.log("Sending answer:", answerPayload);
            stompClient.publish({
                destination: `/app/videochat/${incomingCall.from}`,
                body: JSON.stringify(answerPayload),
            });

            // Send any pending ICE candidates
            while (pendingCandidatesRef.current.length > 0) {
                const candidate = pendingCandidatesRef.current.shift();
                if (candidate) {
                    stompClient.publish({
                        destination: `/app/videochat/${incomingCall.from}`,
                        body: JSON.stringify({
                            chatRoomId: chatrommId,
                            chatType: "candidate",
                            candidate: JSON.stringify(candidate),
                            senderId: senderId,
                            receiverId: incomingCall.from
                        }),
                    });
                }
            }

            // Force ICE gathering to start
            if (peerConnectionRef.current.iceGatheringState === 'new') {
                console.log("Starting ICE gathering after accepting call...");
                peerConnectionRef.current.restartIce();
            }
            
            setIncomingCall(null);
        } catch (error) {
            console.error("Error accepting call:", error);
            if (peerConnectionRef.current) {
                peerConnectionRef.current.restartIce();
            }
        }
    };

    const startCall = async () => {
        if (!peerConnectionRef.current || !stompClient || !isStompConnected) {
            console.error("Cannot start call: missing peer connection or STOMP client");
            return;
        }

        try {
            console.log("Creating offer...");
            const offer = await peerConnectionRef.current.createOffer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true
            });

            console.log("Setting local description...");
            await peerConnectionRef.current.setLocalDescription(offer);

            console.log("Sending offer...");
            const offerPayload = {
                chatRoomId: chatrommId,
                chatType: "offer",
                sdp: offer.sdp,
                senderId: senderId,
                receiverId: receiverId
            };

            stompClient.publish({
                destination: `/app/videochat/${receiverId}`,
                body: JSON.stringify(offerPayload),
            });

            console.log("Offer sent successfully");
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
                    speaker: senderId === senderId ? 'You' : 'Other'
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
                    const destination = `/app/videochat/${receiverId}`;
                    const offerPayload = {
                        chatRoomId: chatrommId,
                        chatType: "offer",
                        sdp: offer.sdp,
                        senderId: senderId,
                        receiverId: receiverId
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
                    const destination = `/app/videochat/${receiverId}`;
                    const answerPayload = {
                        chatRoomId: chatrommId,
                        chatType: "answer",
                        sdp: answer.sdp,
                        senderId: senderId,
                        receiverId: incomingCall?.from || receiverId
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
                            destination: `/app/videochat/${receiverId}`,
                            body: JSON.stringify({
                                chatRoomId: chatrommId,
                                chatType: "candidate",
                                candidate: JSON.stringify(event.candidate),
                                senderId: senderId,
                                receiverId: incomingCall?.from || receiverId
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

    // Add cleanup effect
    useEffect(() => {
        const handleBeforeUnload = () => {
            // Clean up peer connection
            if (peerConnectionRef.current) {
                peerConnectionRef.current.close();
                peerConnectionRef.current = null;
            }

            // Clean up media streams
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
            }
            if (remoteStream) {
                remoteStream.getTracks().forEach(track => track.stop());
            }

            // Clean up WebSocket connection
            if (stompClient) {
                stompClient.deactivate();
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
    }, [localStream, remoteStream, stompClient, dispatch]);

    return (
        <div className="p-4">
            <div className="mb-4">
                <h2 className="text-xl font-bold mb-2">Video Call</h2>
                {!isCaller && !incomingCall && (
                    <div className="bg-yellow-50 p-4 rounded mb-4">
                        <p>Waiting for incoming call...</p>
                    </div>
                )}
                {isCaller && !connected && (
                    <div className="bg-blue-50 p-4 rounded mb-4">
                        <p>Calling {receiverId}...</p>
                    </div>
                )}
                {connected && (
                    <div className="bg-green-50 p-4 rounded mb-4">
                        <p>Call connected!</p>
                    </div>
                )}
                <div className="flex gap-2">
                    {isCaller && !connected && (
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
                    )}
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
            {incomingCall && !isCaller && (
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
