import React, { useRef, useState, useEffect } from "react";
import { Client } from '@stomp/stompjs';
import SockJS from "sockjs-client";
import { useSearchParams } from 'next/navigation';

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
export default function Home() {
    const searchParams = useSearchParams();
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const [data, setData] = useState<any>(null);

    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const pendingCandidatesRef = useRef<RTCIceCandidate[]>([]);

    const [connected, setConnected] = useState(false);
    const [stompClient, setStompClient] = useState<Client | null>(null);
    const [isStompConnected, setIsStompConnected] = useState(false);
    const [connectionState, setConnectionState] = useState<string>('new');

    useEffect(() => {
        const rawData = searchParams.get('data');
        if (rawData) {
            try {
                const parsedData = JSON.parse(decodeURIComponent(rawData));
                console.log("Parsed data:", parsedData);
                setData(parsedData.userId);
            } catch (e) {
                console.error('Failed to parse data', e);
            }
        }
    }, [searchParams]);

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

        // const pc = new RTCPeerConnection({ iceServers });
        const pc = new RTCPeerConnection({
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                {
                    urls: 'turn:relay.metered.ca:80',
                    username: 'openai',
                    credential: 'chatgpt'
                }
            ]
        });
        console.log("Created new peer connection");
        peerConnectionRef.current = pc;

        // Add local tracks to peer connection
        localStream.getTracks().forEach((track) => {
            console.log("Adding local track to peer connection:", track.kind);
            pc.addTrack(track, localStream);
        });

        // Handle remote track
        pc.ontrack = (event) => {
            console.log("Received remote track:", event.streams[0].getTracks().map(t => t.kind));
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0];
            }
        };

        // Handle ICE candidates
        pc.onicecandidate = (event) => {
            if (event.candidate && stompClient && isStompConnected) {
                console.log("Sending ICE candidate:", event.candidate);
                stompClient.publish({
                    destination: `/app/videochat/102`,
                    body: JSON.stringify({
                        chatRoomId: data,
                        chatType: "candidate",
                        candidate: JSON.stringify(event.candidate)
                    }),
                });
            }
        };

        // Handle ICE connection state
        pc.oniceconnectionstatechange = () => {
            console.log("ICE Connection State:", pc.iceConnectionState);
        };

        // Handle connection state changes
        pc.onconnectionstatechange = () => {
            console.log("Connection state changed:", pc.connectionState);
            setConnectionState(pc.connectionState);
            if (pc.connectionState === 'connected') {
                setConnected(true);
            } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
                setConnected(false);
            }
        };

        // Function to add pending candidates
        const addPendingCandidates = async () => {
            if (pendingCandidatesRef.current.length > 0) {
                console.log("Adding pending candidates:", pendingCandidatesRef.current.length);
                for (const candidate of pendingCandidatesRef.current) {
                    try {
                        await pc.addIceCandidate(candidate);
                    } catch (error) {
                        console.error("Error adding pending candidate:", error);
                    }
                }
                pendingCandidatesRef.current = [];
            }
        };

        (pc as any).addPendingCandidates = addPendingCandidates;

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
                
                const topic = `/topic/new-videocall/102`;
                console.log("Subscribing to topic:", topic);
                
                client.subscribe(topic, async (message) => {
                    if (!message.body) {
                        console.warn('Received empty message');
                        return;
                    }

                    const payload = JSON.parse(message.body);
                    console.log('Received message on topic', topic, ':', payload);

                    if (!peerConnectionRef.current) {
                        console.error("No peer connection available");
                        return;
                    }

                    try {
                        if (payload.chatType === "offer") {
                            console.log("Received offer");
                            await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription({
                                type: "offer",
                                sdp: payload.sdp
                            }));
                            console.log("Set remote description (offer)");
                            
                            const answer = await peerConnectionRef.current.createAnswer();
                            console.log("Created answer");
                            
                            await peerConnectionRef.current.setLocalDescription(answer);
                            console.log("Set local description (answer)");
                            
                            if ((peerConnectionRef.current as any).addPendingCandidates) {
                                await (peerConnectionRef.current as any).addPendingCandidates();
                            }
                            
                            if (isStompConnected) {
                                const destination = `/app/videochat/102`;
                                const answerPayload = {
                                    chatRoomId: data,
                                    chatType: "answer",
                                    sdp: answer.sdp,
                                    senderId: data, // Add sender ID
                                    receiverId: payload.senderId // Add receiver ID
                                };
                                console.log("Sending answer to", destination, ":", answerPayload);
                                
                                client.publish({
                                    destination,
                                    body: JSON.stringify(answerPayload),
                                });
                            }
                        } else if (payload.chatType === "answer") {
                            console.log("Received answer");
                            await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription({
                                type: "answer",
                                sdp: payload.sdp
                            }));
                            console.log("Set remote description (answer)");
                            
                            if ((peerConnectionRef.current as any).addPendingCandidates) {
                                await (peerConnectionRef.current as any).addPendingCandidates();
                            }
                        } else if (payload.chatType === "candidate") {
                            console.log("Received ICE candidate");
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
            
            const destination = `/app/videochat/102`;
            const offerPayload = {
                chatRoomId: data,
                chatType: "offer",
                sdp: offer.sdp,
                senderId: data, // Add sender ID
                receiverId: data // Add receiver ID (same as sender for testing)
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
                        <li>The other tab will automatically respond</li>
                    </ol>
                </div>
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
            </div>
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
                    <span className="w-32">Connection:</span>
                    <span className={`px-2 py-1 rounded ${
                        connected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                        {connected ? "Connected" : "Not connected"}
                    </span>
                </p>
            </div>
        </div>
    );
}
