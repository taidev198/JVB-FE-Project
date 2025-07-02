/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { throttle } from 'lodash';
import SockJS from 'sockjs-client'; // Import SockJS for WebSocket fallback
import { Client } from '@stomp/stompjs';
import { useDispatch } from 'react-redux';
import { Avatar, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import MenuIcon from '@mui/icons-material/Menu';
import SendIcon from '@mui/icons-material/Send';
import { IconButton } from '@mui/material';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ReplyIcon from '@mui/icons-material/Reply';
import ImageIcon from '@mui/icons-material/Image';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useSwipeable } from 'react-swipeable';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import BrokenImageIcon from '@mui/icons-material/BrokenImage';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import AudioFileIcon from '@mui/icons-material/AudioFile';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import TableChartIcon from '@mui/icons-material/TableChart';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import CallIcon from '@mui/icons-material/Call';
import CallEndIcon from '@mui/icons-material/CallEnd';
import { setIncommingCallFrom, setIncommingCallOffer } from '@/store/slices/chatSlice';
import PopupConfirmAction from '@/components/Common/PopupConfirmAction';
import { ChatResponse } from '@/types/chatType';
import { useDeleteOneMessageMutation, useGetAllMessagesQuery } from '@/services/portalHomeApi';
import { BackdropType, setBackdrop } from '@/store/slices/global';
import { useAppSelector } from '@/store/hooks';
import { showSidebar } from '@/store/slices/global';

const MAX_IMAGE_SIZE = 800; // Maximum width/height in pixels
const QUALITY = 0.7; // JPEG quality (0.7 = 70% quality)

const ChatRight = () => {
  const [page, setPage] = useState<number>(1);
  const size = 20;
  const [chats, setChats] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [inputValue, setInputValue] = useState<string>('');
  const [stompClient, setStompClient] = useState(null);
  const [idDelete, setIdDelete] = useState(null);
  const [idReplyMes, setIdReplyMes] = useState(null);
  const { idRoom, namePartnerChat, receiverId } = useAppSelector(state => state.chat);
  const { idAccount } = useAppSelector(state => state.user);
  const [hoveredMessage, setHoveredMessage] = useState<number | null>(null);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobileAndTablet = useMediaQuery(theme.breakpoints.down('sm'));
  const scrollContainerRef = useRef(null);
  const previousDataRef = useRef<ChatResponse | undefined>(undefined);
  const showBackdrop = useAppSelector(state => state.global.backdropType);
  const [deleteOneMessage] = useDeleteOneMessageMutation();
  const [replyingTo, setReplyingTo] = useState(null);
  const [touchStartX, setTouchStartX] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [incomingCall, setIncomingCall] = useState<{
    from: string;
    offer: RTCSessionDescriptionInit;
  } | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  const handleTouchStart = e => {
    setTouchStartX(e.changedTouches[0].clientX);
  };

  const handleTouchEnd = (e, message) => {
    const touchEndX = e.changedTouches[0].clientX;
    const delta = touchEndX - touchStartX;
    if (delta > 50) {
      handleSwipeReply(message.content);
    }
  };

  const { data, isSuccess, refetch } = useGetAllMessagesQuery(
    { roomId: Number(idRoom), page, size },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  const refetchMessage = () => {
    if (data?.data?.content) {
      setChats(data.data.content);
      setPage(1);
      setHasMore(true);
      previousDataRef.current = undefined;
    }
  };

  useEffect(() => {
    refetchMessage();
    // if(chats?.length > 0 ) {
    //   chats.forEach((chat) => {
    //     console.log(chat);
    //     console.log('chat', chat?.sender?.id);
    //     console.log('idAccount', idAccount);
    //   }
    //   );
    // }
  }, [idRoom]);

  useEffect(() => {
    if (data && isSuccess && previousDataRef.current !== data) {
      if (!data?.data?.content.length) {
        setHasMore(false);
        return;
      }
      previousDataRef.current = data;
      // setChats(data.data.content);
      setChats(prevChats => [...prevChats, ...data.data.content]);
    }
  }, [data, isSuccess]);

  const handleScroll = useCallback(
    throttle(() => {
      if (!hasMore) return;

      const scrollContainer = scrollContainerRef.current;
      const scrollTop = scrollContainer.scrollTop;

      if (scrollTop <= 100) {
        setPage(prevPage => prevPage + 1);
      }
    }, 500),
    [hasMore]
  );

  const handleSwipeReply = (messageContent: string) => {
    setInputValue(`@${messageContent} `); // pre-fill the reply
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;
    scrollContainer.addEventListener('scroll', handleScroll);
    return () => {
      handleScroll.cancel();
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  // ---------------- TEST ------------------
  useEffect(() => {
    const connectToWebSocket = () => {
      const client = new Client({
        webSocketFactory: () => new SockJS(`${process.env.NEXT_PUBLIC_API_URL_CHAT}/ws/stomp`),
        onConnect: () => {
          setStompClient(client);
          setIsConnected(true);

          // Subscribe to chat room messages
          client.subscribe(`/topic/chatroom/${idRoom}`, message => {
            const newMessage = JSON.parse(message.body);
            console.log('Received new message:', newMessage);
            // Add new message to the beginning of the array since we're displaying in reverse
            setChats(prevChats => [newMessage, ...prevChats]);
            // Scroll to bottom when new message arrives
            if (bottomRef.current) {
              bottomRef.current.scrollIntoView({ behavior: 'smooth' });
            }
          });

          // Subscribe to message deletion
          client.subscribe(`/topic/chatroom/${idRoom}/delete-message`, () => {
            refetchMessage();
          });

          // Subscribe to video call topic
          const userTopic = `/topic/new-videocall/${idAccount}`;
          console.log('Subscribing to user topic:', userTopic);

          client.subscribe(userTopic, async message => {
            if (!message.body) {
              console.warn('Received empty message');
              return;
            }

            const payload = JSON.parse(message.body);
            console.log('Received message on topic', userTopic, ':', payload);

            try {
              if (payload.chatType === 'offer') {
                console.log('Received offer from peer');
                if (!payload.sdp || typeof payload.sdp !== 'string') {
                  console.error('Invalid SDP in offer:', payload.sdp);
                  return;
                }

                setIncomingCall({
                  from: payload.senderId,
                  offer: {
                    type: 'offer',
                    sdp: payload.sdp,
                  },
                });
              } else if (payload.chatType === 'answer') {
                console.log('Received answer from peer');
                if (peerConnectionRef.current) {
                  const remoteDesc = new RTCSessionDescription({
                    type: 'answer',
                    sdp: payload.sdp,
                  });
                  await peerConnectionRef.current.setRemoteDescription(remoteDesc);
                  console.log('Set remote description (answer)');
                }
              } else if (payload.chatType === 'candidate') {
                console.log('Received ICE candidate from peer');
                if (peerConnectionRef.current) {
                  const candidate = new RTCIceCandidate(JSON.parse(payload.candidate));
                  await peerConnectionRef.current.addIceCandidate(candidate);
                  console.log('Added ICE candidate');
                }
              }
            } catch (error) {
              console.error('Error handling message:', error);
            }
          });
        },
        onStompError: frame => {
          console.error('STOMP Error:', frame.headers['message']);
          console.error('Details:', frame.body);
        },
        onDisconnect: () => {
          if (client !== null) {
            client.deactivate();
            setIsConnected(false);
          }
          console.log('disconnect');
        },
      });

      client.activate();
      return client;
    };

    const client = connectToWebSocket();

    return () => {
      if (client) {
        client.deactivate();
        setIsConnected(false);
      }
    };
  }, [idRoom, idAccount]);
  // useEffect(() => {
  //   if (bottomRef.current) {
  //     bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  //   }
  // }, [chats]); // Run every time new messages are set

  const sendMessage = () => {
    if (stompClient && stompClient.connected) {
      const message = {
        chatRoomId: idRoom,
        senderId: idAccount,
        receiverId: receiverId,
        content: inputValue,
        referChatId: replyingTo?.id,
        chatType: 'TEXT',
        createAt: new Date().toISOString(),
      };

      stompClient.publish({
        destination: `/app/chatroom/${idRoom}`,
        body: JSON.stringify(message),
      });

      setReplyingTo(null); // Clear the replyingTo state after sending the message
      setInputValue('');

      // Scroll to bottom after sending message
      if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      console.error('STOMP client is not connected!');
    }
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleDelete = async () => {
    try {
      await deleteOneMessage({ chatRoomId: Number(idRoom), messageId: Number(idDelete) });
      setChats(prevChats => prevChats.filter(chat => chat.id !== idDelete));
      dispatch(setBackdrop(null));
      refetchMessage();
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };

  const handleVideoCallBtn = async () => {
    if (!stompClient || !stompClient.connected) {
      console.error('STOMP client is not connected!');
      return;
    }

    try {
      // Initialize peer connection and local stream only when starting a call
      if (!peerConnectionRef.current) {
        // Get local media stream
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);

        // Create peer connection
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

        // Add local tracks to peer connection
        stream.getTracks().forEach(track => {
          pc.addTrack(track, stream);
        });

        // Set up event handlers
        pc.onicegatheringstatechange = () => {
          console.log('ICE gathering state:', pc.iceGatheringState);
        };

        pc.onicecandidate = event => {
          if (event.candidate && stompClient?.connected) {
            console.log('Sending ICE candidate:', event.candidate);
            const candidatePayload = {
              chatRoomId: idRoom,
              chatType: 'candidate',
              candidate: JSON.stringify(event.candidate),
              senderId: idAccount,
              receiverId: receiverId,
            };

            stompClient.publish({
              destination: `/app/videochat/${receiverId}`,
              body: JSON.stringify(candidatePayload),
            });
          }
        };

        pc.oniceconnectionstatechange = () => {
          console.log('ICE Connection State:', pc.iceConnectionState);
        };

        pc.onconnectionstatechange = () => {
          console.log('Connection state changed:', pc.connectionState);
        };

        pc.ontrack = event => {
          console.log(
            'Received remote track:',
            event.streams[0].getTracks().map(t => t.kind)
          );
        };

        peerConnectionRef.current = pc;
      }

      // Create and send offer
      const offer = await peerConnectionRef.current.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
        iceRestart: true,
      });

      await peerConnectionRef.current.setLocalDescription(offer);
      console.log('Set local description (offer)');

      const destination = `/app/videochat/${receiverId}`;
      const offerPayload = {
        chatRoomId: idRoom,
        chatType: 'offer',
        sdp: offer.sdp,
        senderId: idAccount,
        receiverId: receiverId,
      };

      console.log('Sending video call offer:', offerPayload);
      stompClient.publish({
        destination,
        body: JSON.stringify(offerPayload),
      });

      // Open video call page for caller only
      const data = encodeURIComponent(
        JSON.stringify({
          chatRoomId: idRoom,
          senderId: idAccount,
          receiverId: receiverId,
          isCaller: true,
          offer: {
            type: 'offer',
            sdp: offer.sdp,
          },
        })
      );
      const windowFeatures = 'width=800,height=600,noopener,noreferrer';
      const url = `http://localhost:3000/portal/video-call?data=${data}`;
      window.open(url, '_blank', windowFeatures);
    } catch (error) {
      console.error('Error initiating video call:', error);
    }
  };

  const handleAcceptCall = async () => {
    if (!incomingCall || !stompClient || !stompClient.connected) {
      console.error('Cannot accept call: missing incoming call or STOMP client');
      return;
    }

    try {
      // Initialize peer connection and local stream only when accepting a call
      if (!peerConnectionRef.current) {
        // Get local media stream
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);

        // Create peer connection
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

        // Add local tracks to peer connection
        stream.getTracks().forEach(track => {
          pc.addTrack(track, stream);
        });

        // Set up event handlers
        pc.onicegatheringstatechange = () => {
          console.log('ICE gathering state:', pc.iceGatheringState);
        };

        pc.onicecandidate = event => {
          if (event.candidate && stompClient?.connected) {
            console.log('Sending ICE candidate:', event.candidate);
            const candidatePayload = {
              chatRoomId: idRoom,
              chatType: 'candidate',
              candidate: JSON.stringify(event.candidate),
              senderId: idAccount,
              receiverId: incomingCall.from,
            };

            stompClient.publish({
              destination: `/app/videochat/${incomingCall.from}`,
              body: JSON.stringify(candidatePayload),
            });
          }
        };

        pc.oniceconnectionstatechange = () => {
          console.log('ICE Connection State:', pc.iceConnectionState);
        };

        pc.onconnectionstatechange = () => {
          console.log('Connection state changed:', pc.connectionState);
        };

        pc.ontrack = event => {
          console.log(
            'Received remote track:',
            event.streams[0].getTracks().map(t => t.kind)
          );
        };

        peerConnectionRef.current = pc;
      }

      // First set the remote description (offer)
      const remoteDesc = new RTCSessionDescription({
        type: 'offer',
        sdp: incomingCall.offer.sdp,
      });
      await peerConnectionRef.current.setRemoteDescription(remoteDesc);
      console.log('Set remote description (offer)');

      // Then create and set local description (answer)
      const answer = await peerConnectionRef.current.createAnswer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
        iceRestart: true,
      });
      await peerConnectionRef.current.setLocalDescription(answer);
      console.log('Set local description (answer)');

      // Send answer
      const answerPayload = {
        chatRoomId: idRoom,
        chatType: 'answer',
        sdp: answer.sdp,
        senderId: idAccount,
        receiverId: incomingCall.from,
      };

      stompClient.publish({
        destination: `/app/videochat/${incomingCall.from}`,
        body: JSON.stringify(answerPayload),
      });

      // Open video call page for receiver only
      const data = encodeURIComponent(
        JSON.stringify({
          chatRoomId: idRoom,
          senderId: incomingCall.from,
          receiverId: idAccount,
          isCaller: false,
          offer: {
            type: 'offer',
            sdp: incomingCall.offer.sdp,
          },
          answer: {
            type: 'answer',
            sdp: answer.sdp,
          },
        })
      );
      const windowFeatures = 'width=800,height=600,noopener,noreferrer';
      const url = `http://localhost:3000/portal/video-call?data=${data}`;
      window.open(url, '_blank', windowFeatures);

      setIncomingCall(null);
    } catch (error) {
      console.error('Error accepting call:', error);
    }
  };

  const handleRejectCall = () => {
    setIncomingCall(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        handleImageSelect(file);
      }
    }
  };

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImageClick = (imageUrl: string) => {
    setPreviewImage(imageUrl);
  };

  const handleClosePreview = () => {
    setPreviewImage(null);
  };

  const getFileIcon = (fileType: string) => {
    if (fileType?.includes('pdf')) {
      return <PictureAsPdfIcon className="text-red-500" />;
    } else if (fileType?.includes('word') || fileType?.includes('doc')) {
      return <DescriptionIcon className="text-blue-500" />;
    } else if (fileType?.includes('excel') || fileType?.includes('sheet') || fileType?.includes('csv')) {
      return <TableChartIcon className="text-green-500" />;
    } else if (fileType?.includes('text')) {
      return <TextSnippetIcon className="text-gray-500" />;
    }
    return <InsertDriveFileIcon className="text-primary-main" />;
  };

  const getFileTypeName = (fileType: string) => {
    if (fileType?.includes('pdf')) {
      return 'PDF Document';
    } else if (fileType?.includes('word') || fileType?.includes('doc')) {
      return 'Word Document';
    } else if (fileType?.includes('excel') || fileType?.includes('sheet') || fileType?.includes('csv')) {
      return 'Excel Spreadsheet';
    } else if (fileType?.includes('text')) {
      return 'Text Document';
    }
    return 'File';
  };

  const handleFileSelect = (file: File) => {
    // Check if file type is allowed
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ];

    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid document file (PDF, Word, Excel, PowerPoint, or Text)');
      return;
    }

    setSelectedFile(file);
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL_CHAT}/api/chat/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.url; // Assuming the API returns the image URL
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = event => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_IMAGE_SIZE) {
              height = Math.round((height * MAX_IMAGE_SIZE) / width);
              width = MAX_IMAGE_SIZE;
            }
          } else {
            if (height > MAX_IMAGE_SIZE) {
              width = Math.round((width * MAX_IMAGE_SIZE) / height);
              height = MAX_IMAGE_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            blob => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                console.log('Original size:', file.size, 'bytes');
                console.log('Compressed size:', compressedFile.size, 'bytes');
                resolve(compressedFile);
              } else {
                reject(new Error('Failed to compress image'));
              }
            },
            'image/jpeg',
            QUALITY
          );
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const sendImage = async () => {
    if (!stompClient?.connected || !selectedImage || !idRoom || !idAccount || !receiverId) {
      console.error('Missing required data or connection');
      return;
    }

    try {
      setIsUploading(true);
      const imageUrl = await uploadImage(selectedImage);

      const message = {
        chatRoomId: idRoom,
        senderId: idAccount,
        receiverId: receiverId,
        content: imageUrl,
        referChatId: replyingTo?.id,
        chatType: 'IMAGE',
      };

      console.log('Sending image message:', {
        destination: `/app/chatroom/${idRoom}`,
        messageType: 'IMAGE',
        imageUrl,
      });

      stompClient.publish({
        destination: `/app/chatroom/${idRoom}`,
        body: JSON.stringify(message),
      });

      console.log('Image message sent successfully');
      setSelectedImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Error in sendImage:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const cancelImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

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

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const sendAudio = async () => {
    if (!stompClient?.connected || !audioBlob || !idRoom || !idAccount || !receiverId) {
      console.error('Missing required data or connection');
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.webm');

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL_CHAT}/api/chat/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const audioUrl = response.data.url;

      const message = {
        chatRoomId: idRoom,
        senderId: idAccount,
        receiverId: receiverId,
        content: audioUrl,
        referChatId: replyingTo?.id,
        chatType: 'AUDIO',
      };

      stompClient.publish({
        destination: `/app/chatroom/${idRoom}`,
        body: JSON.stringify(message),
      });

      setAudioBlob(null);
      setAudioUrl(null);
    } catch (error) {
      console.error('Error sending audio:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const cancelAudio = () => {
    setAudioBlob(null);
    setAudioUrl(null);
  };

  const handlePlayPause = (messageId: string) => {
    const audioElement = audioRefs.current[messageId];
    if (!audioElement) return;

    if (playingAudio === messageId) {
      audioElement.pause();
      setPlayingAudio(null);
    } else {
      // Stop any currently playing audio
      if (playingAudio && audioRefs.current[playingAudio]) {
        audioRefs.current[playingAudio].pause();
      }
      audioElement.play();
      setPlayingAudio(messageId);
    }
  };

  const handleAudioEnded = (messageId: string) => {
    setPlayingAudio(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatMessageTime = (timestamp: string | undefined) => {
    if (!timestamp) return '';
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return '';
      return formatDistanceToNow(date, { addSuffix: true, locale: vi });
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  const renderMessageContent = (message: any) => {
    if (message.type === 'IMAGE') {
      const imageUrl = message.content?.startsWith('http') ? message.content : null;

      if (!imageUrl) {
        return <p>Invalid image URL</p>;
      }

      return (
        <div className="group relative">
          <div className="relative h-[200px] w-[300px]">
            <img
              src={imageUrl}
              alt="Shared image"
              className="h-full w-full cursor-pointer rounded-lg object-contain"
              onClick={() => handleImageClick(imageUrl)}
            />
          </div>
          <div className="absolute inset-0 rounded-lg bg-black bg-opacity-0 transition-opacity group-hover:bg-opacity-10" />
        </div>
      );
    } else if (message.type === 'AUDIO') {
      return (
        <div className="flex min-w-[200px] items-center gap-2">
          <button
            onClick={() => handlePlayPause(message.id)}
            className={`flex h-8 w-8 items-center justify-center rounded-full ${message?.sender?.id === idAccount ? 'bg-white' : 'bg-gray-100'}`}>
            {playingAudio === message.id ? <PauseIcon className="text-primary-main" /> : <PlayArrowIcon className="text-primary-main" />}
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <VolumeUpIcon className="text-gray-500" />
              <div className="h-1 flex-1 rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-primary-main"
                  style={{
                    width: audioRefs.current[message.id]?.currentTime
                      ? `${(audioRefs.current[message.id].currentTime / audioRefs.current[message.id].duration) * 100}%`
                      : '0%',
                  }}
                />
              </div>
            </div>
            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>{audioRefs.current[message.id]?.currentTime ? formatTime(audioRefs.current[message.id].currentTime) : '0:00'}</span>
              <span>{audioRefs.current[message.id]?.duration ? formatTime(audioRefs.current[message.id].duration) : '0:00'}</span>
            </div>
          </div>
          <audio
            ref={el => {
              if (el) {
                audioRefs.current[message.id] = el;
              }
            }}
            src={message.content}
            onEnded={() => handleAudioEnded(message.id)}
            onTimeUpdate={() => {
              // Force re-render to update progress bar
              setPlayingAudio(prev => prev);
            }}
            className="hidden"
          />
        </div>
      );
    } else if (message.type === 'FILE') {
      return (
        <div className="flex min-w-[200px] items-center gap-2">
          {getFileIcon(message.fileType)}
          <div className="flex-1">
            <div className="truncate text-sm font-medium">{message.fileName}</div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">{getFileTypeName(message.fileType)}</span>
              <span className="text-xs text-gray-500">•</span>
              {/* <span className="text-xs text-gray-500">{formatFileSize(message.fileSize)}</span> */}
            </div>
          </div>
          <a href={message.content} download={message.fileName} target="_blank" rel="noopener noreferrer" className="rounded-full p-1 hover:bg-gray-100">
            <DownloadIcon className="text-primary-main" />
          </a>
        </div>
      );
    }
    return <p>{message.content}</p>;
  };

  const sendFile = async () => {
    if (!stompClient?.connected || !selectedFile || !idRoom || !idAccount || !receiverId) {
      console.error('Missing required data or connection');
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL_CHAT}/api/chat/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const fileUrl = response.data.url;

      const message = {
        chatRoomId: idRoom,
        senderId: idAccount,
        receiverId: receiverId,
        content: fileUrl,
        fileName: selectedFile.name,
        // fileSize: selectedFile.size,
        fileType: selectedFile.type,
        referChatId: replyingTo?.id,
        chatType: 'FILE',
      };

      stompClient.publish({
        destination: `/app/chatroom/${idRoom}`,
        body: JSON.stringify(message),
      });

      setSelectedFile(null);
    } catch (error) {
      console.error('Error sending file:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const cancelFile = () => {
    setSelectedFile(null);
  };

  // Add cleanup for peer connection and media stream
  useEffect(() => {
    return () => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        setLocalStream(null);
      }
    };
  }, []);

  return (
    <div className="flex h-screen flex-col">
      <div className="border-b bg-white py-4">
        <div className="flex h-10 items-center gap-3 px-5">
          {isMobileAndTablet && (
            <IconButton onClick={() => dispatch(showSidebar())}>
              <MenuIcon />
            </IconButton>
          )}
          <Avatar>G</Avatar>
          <p className="text-base font-medium text-gray-700">{namePartnerChat}</p>
          <IconButton onClick={handleVideoCallBtn}>
            <VideoCallIcon className="text-primary-main" />
          </IconButton>
        </div>
      </div>

      <div className="relative h-full overflow-y-auto bg-gray-50" onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
        {isDragging && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="rounded-lg bg-white p-4 text-center">
              <p>Drop your image here</p>
            </div>
          </div>
        )}
        <div ref={scrollContainerRef} className="h-[90%] space-y-2 overflow-y-auto p-8">
          {chats.length > 0 ? (
            chats
              .slice()
              .reverse()
              .map((message, index) => (
                <div key={index} onTouchStart={handleTouchStart} onTouchEnd={e => handleTouchEnd(e, message)}>
                  <div
                    className={`flex w-full ${message?.sender?.id === idAccount ? 'justify-end' : ''}`}
                    onMouseEnter={() => setHoveredMessage(message.id)}
                    onMouseLeave={() => setHoveredMessage(null)}>
                    <div className={`flex max-w-[60%] ${message?.sender?.id === idAccount ? 'justify-end ' : ''}`}>
                      <div className="relative my-1 flex flex-col">
                        <div className="relative flex justify-center gap-5">
                          {/* Replied to message block */}
                          {message.referChat && (
                            <div className="mb-1 rounded-md bg-gray-100 px-3 py-1 text-sm text-gray-600 shadow-inner">
                              Đang trả lời: {message?.referChat.content}
                            </div>
                          )}
                          <div
                            className={`flex rounded-bl-lg rounded-br-lg px-4 py-2 shadow-lg ${
                              message?.sender?.id === idAccount ? 'justify-end rounded-tl-lg bg-[#246AA3] text-white' : 'rounded-tr-lg bg-white'
                            } ${message.chatType === 'IMAGE' ? 'p-2' : ''}`}>
                            {renderMessageContent(message)}
                          </div>
                          {hoveredMessage === message.id && (
                            <div
                              className={`absolute flex flex-row flex-nowrap gap-1 ${
                                message?.sender?.id === idAccount ? 'right-full -translate-x-2' : 'left-full translate-x-2'
                              }`}>
                              {message?.sender?.id === idAccount && (
                                <div
                                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white text-lg shadow-lg"
                                  onClick={() => {
                                    dispatch(setBackdrop(BackdropType.AddModal));
                                    setIdDelete(message?.id);
                                  }}>
                                  <Tooltip title="Xóa tin nhắn" placement="top">
                                    <DeleteOutlineOutlinedIcon style={{ width: '20px', height: '20px' }} />
                                  </Tooltip>
                                </div>
                              )}
                              <div
                                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white text-lg shadow-lg"
                                onClick={() => {
                                  setIdReplyMes(message?.id);
                                  setReplyingTo(message);
                                  setInputValue(`@${message?.content} `);
                                }}>
                                <Tooltip title="Rep tin nhắn" placement="top">
                                  <ReplyIcon style={{ width: '20px', height: '20px' }} />
                                </Tooltip>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className={`flex items-center ${message?.sender?.id === idAccount ? 'justify-end' : 'justify-start'} gap-2`}>
                          <p className={`${message?.sender?.id === idAccount ? 'text-right' : 'text-left'} mt-1 text-xs text-[#4B465C]`}>
                            {formatMessageTime(message?.createAt)}
                          </p>
                          <p className={`${message?.sender?.id === idAccount ? 'text-right' : 'text-left'} mt-1 text-xs text-[#4B465C]`}>Đã xem</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {showBackdrop === BackdropType.AddModal && (
                    <PopupConfirmAction name="" text="Bạn có chắc chắn muốn xóa không" onClick={() => handleDelete()} />
                  )}
                </div>
              ))
          ) : (
            <p className="text-center">Hãy bắt đầu cuộc trò chuyện bằng một lời chào 😍</p>
          )}
          <div ref={bottomRef}></div>
        </div>
        {replyingTo && (
          <div className="border-b bg-gray-200 px-4 py-2 text-sm">
            <span>Đang trả lời: </span>
            <strong>{replyingTo?.content}</strong>
            <button onClick={() => setReplyingTo(null)} className="ml-2 text-red-500">
              Hủy
            </button>
          </div>
        )}
        {imagePreview && (
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 transform rounded-lg bg-white p-4 shadow-lg">
            <img src={imagePreview} alt="Preview" className="max-h-40 rounded" />
            <div className="mt-2 flex justify-end gap-2">
              <button onClick={cancelImage} className="rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300" disabled={isUploading}>
                Cancel
              </button>
              <button
                onClick={sendImage}
                className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600 disabled:bg-gray-400"
                disabled={!stompClient?.connected || isUploading}>
                {isUploading ? 'Uploading...' : 'Send'}
              </button>
            </div>
          </div>
        )}
        <div
          className={`${
            !idRoom ? 'cursor-not-allowed opacity-50' : ''
          } absolute bottom-5 left-1/2 flex w-[96%] -translate-x-1/2 transform items-center rounded-lg bg-white shadow-md`}>
          <input type="file" ref={fileInputRef} onChange={handleFileInputChange} accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.ppt,.pptx" className="hidden" />
          <IconButton disabled={!idRoom} className="!p-2" onClick={() => fileInputRef.current?.click()}>
            <ImageIcon className="text-primary-main" fontSize="medium" />
          </IconButton>
          <IconButton disabled={!idRoom} className="!p-2" onClick={handleFileClick}>
            <AttachFileIcon className="text-primary-main" fontSize="medium" />
          </IconButton>
          {!audioUrl ? (
            <IconButton disabled={!idRoom} className="!p-2" onClick={isRecording ? stopRecording : startRecording}>
              {isRecording ? <StopIcon className="text-red-500" fontSize="medium" /> : <MicIcon className="text-primary-main" fontSize="medium" />}
            </IconButton>
          ) : null}
          <textarea
            name=""
            id=""
            disabled={!idRoom}
            value={inputValue}
            onKeyDown={handleKeyDown}
            onChange={e => setInputValue(e.target.value)}
            className="h-5 w-full border-none focus:outline-none"
            style={{ boxShadow: 'none' }}
          />
          <IconButton disabled={!idRoom} className="!p-2" onClick={sendMessage}>
            <SendIcon className="text-primary-main" fontSize="medium" />
          </IconButton>
        </div>
      </div>

      {audioUrl && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 transform rounded-lg bg-white p-4 shadow-lg">
          <audio controls className="mb-2">
            <source src={audioUrl} type="audio/webm" />
            Your browser does not support the audio element.
          </audio>
          <div className="flex justify-end gap-2">
            <button onClick={cancelAudio} className="rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300" disabled={isUploading}>
              Cancel
            </button>
            <button
              onClick={sendAudio}
              className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600 disabled:bg-gray-400"
              disabled={!stompClient?.connected || isUploading}>
              {isUploading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      )}

      {selectedFile && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 transform rounded-lg bg-white p-4 shadow-lg">
          <div className="mb-2 flex items-center gap-2">
            {getFileIcon(selectedFile.type)}
            <div>
              <div className="max-w-[200px] truncate text-sm font-medium">{selectedFile.name}</div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">{getFileTypeName(selectedFile.type)}</span>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</span>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={cancelFile} className="rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300" disabled={isUploading}>
              Cancel
            </button>
            <button
              onClick={sendFile}
              className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600 disabled:bg-gray-400"
              disabled={!stompClient?.connected || isUploading}>
              {isUploading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      <Dialog open={!!previewImage} onClose={handleClosePreview} maxWidth="lg" fullWidth>
        <DialogContent className="relative p-0">
          <IconButton onClick={handleClosePreview} className="absolute right-2 top-2 z-10 bg-white/80 hover:bg-white">
            <CloseIcon />
          </IconButton>
          {previewImage && (
            <div className="flex min-h-[80vh] items-center justify-center">
              <img src={previewImage} alt="Preview" className="max-h-[80vh] max-w-full object-contain" />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Incoming Call Notification */}
      {incomingCall && (
        <div className="fixed right-4 top-4 z-50 rounded-lg bg-white p-4 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="animate-pulse">
              <CallIcon className="text-3xl text-green-500" />
            </div>
            <div>
              <h3 className="font-semibold">Incoming Call</h3>
              <p className="text-sm text-gray-600">From: {incomingCall.from}</p>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={handleAcceptCall}
              className="flex flex-1 items-center justify-center gap-2 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600">
              <CallIcon />
              Accept
            </button>
            <button
              onClick={handleRejectCall}
              className="flex flex-1 items-center justify-center gap-2 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600">
              <CallEndIcon />
              Reject
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatRight;
