import ChatsList from '../chatsList/chatsList';
import Header from '../header/header';
import ChatWindow from '../chatWindow/chatWindow';
import ToastNotification from '../toastNotification/toastNotification';
import styles from './mainPage.module.css';
import { useState, useEffect } from 'react';
import ChatInfoDialog from '../chatInfoDialog/chatInfoDialog';
import aliceAvatar from '../../assets/images/Alice_avatar.png';
import josefinaAvatar from '../../assets/images/Josefina_avatar.png';
import velazquezAvatar from '../../assets/images/Velazquez_avatar.png';
import { API_URLS } from '../../apiUrls';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser, setIsAuthenticated } from "../../appSlice";
import axios from 'axios';


export default function MainPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [chatToEdit, setChatToEdit] = useState(null);
    const [chats, setChats] = useState(null);
    const [displayedChats, setDisplayedChats] = useState(null);
    const [currentChat, setCurrentChat] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [newMessage, setNewMessage] = useState(null);
    const [socket, setSocket] = useState(null);

    const isAuthenticated = useSelector((state) => state.isAuthenticated);
    const user = useSelector((state) => state.authUser);
    const dispatch = useDispatch();

    useEffect(() => {
        setDisplayedChats(chats);
    }, [chats]);

    const showNotification = (message) => {
        setNewMessage(message);
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
        }, 3000);
    };

    useEffect(() => {
        if (!isAuthenticated) {
            return;
        }

        const fetchData = async () => {
            try {
                const response = await axios.get(API_URLS.GET_CHATS, { withCredentials: true });
                const result = response.data;
                const avatars = [aliceAvatar, josefinaAvatar, velazquezAvatar];
                const chatsWithAvatars = result.map((chat, i) => {
                    return {...chat, avatar: avatars[i % avatars.length]};
                });
                setChats(chatsWithAvatars); 
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    console.log('Not properly authenticated');
                    dispatch(setIsAuthenticated(false));
                    dispatch(setAuthUser(null));
                } else {
                    console.error('Error fetching data:', error);
                }
            }
        };
        
        fetchData();
        if (socket) {
            socket.send(JSON.stringify({type: 'auth', payload: {userId: user._id}}));
        } else {
            console.error('No socket connection');
        }

    }, [isAuthenticated, user, socket, dispatch]);

    useEffect(() => {
        const socket = new WebSocket(API_URLS.WS);

        socket.onopen = () => {
            setSocket(socket);
            console.log('WebSocket connected');
        };

        socket.onclose = () => {
            console.log('WebSocket disconnected');
        };

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'status') {
                console.log('Status:', message.payload);
            } else if (message.type === 'message') {
                setChats(chats => chats.map((chat) => {
                    if (chat._id === message.chatId) {
                        return {...chat, messages: [...chat.messages, message.payload]};
                    } else {
                        return chat;
                    }
                }));
                setCurrentChat(currentChat => {
                    if (currentChat && currentChat._id === message.chatId) {
                        return {...currentChat, messages: [...currentChat.messages, message.payload]};
                    } else {
                        return currentChat;
                    }
                });
                showNotification({text: message.payload.text, chatId: message.chatId});
            }
        };

        return () => {
            socket.close();
            setSocket(null);
        };
    }, []);

    const openDialog = (chat) => {
        setChatToEdit(chat);
        setIsDialogOpen(true);
    };
    
    const closeDialog = () => {
        setIsDialogOpen(false);
    };

    return (
        <div className={styles.main}>
            <div className={styles.leftPart}>
                <Header
                    chats={chats} 
                    setChats={setChats}
                    setCurrentChat={setCurrentChat}
                    setDisplayedChats={setDisplayedChats}
                />
                <ChatsList
                    displayedChats={displayedChats} 
                    chats={chats} 
                    setChats={setChats}
                    openDialog={openDialog} 
                    currentChat={currentChat}
                    setCurrentChat={setCurrentChat}
                />
            </div>
            <ChatWindow 
                currentChat={currentChat}
                setCurrentChat={setCurrentChat}
                chats={chats}
                setChats={setChats}
            />
            {isDialogOpen && 
                <ChatInfoDialog 
                    closeDialog={closeDialog} 
                    chatToEdit={chatToEdit} 
                    chats={chats} 
                    setChats={setChats} 
                    currentChat={currentChat} 
                    setCurrentChat={setCurrentChat}
                />
            }
            {(showToast && (!currentChat || newMessage.chatId !== currentChat._id)) ? (
                <ToastNotification
                    message={newMessage}
                    chats={chats}
                    setCurrentChat={setCurrentChat}
                    onClose={() => setShowToast(false)}
                />
            ) : (
                null
            )}
        </div>
    );
}