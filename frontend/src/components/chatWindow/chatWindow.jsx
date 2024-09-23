import styles from './chatWindow.module.css';
import AvatarIcon from '../avatarIcon/avatarIcon';
import Message from '../message/message';
import userAvatar from '../../assets/images/user_avatar.png';
import editImg from '../../assets/images/edit.png';
import { useEffect, useState } from 'react';
import { API_URLS } from '../../apiUrls';
import axios from 'axios';


export default function ChatWindow(props) {
    const [messageToEdit, setMessageToEdit] = useState(null);


    useEffect(() => {
        const messages = document.querySelector('.' + styles.messages);
        messages.scrollTop = messages.scrollHeight;
        const input = document.querySelector('.' + styles.messageInput);
        input.focus();
        input.value = '';
        setMessageToEdit(null);
    }, [props.currentChat]);

    useEffect(() => {
        const input = document.querySelector('.' + styles.messageInput);
        if (messageToEdit) {
            input.value = messageToEdit.text;
            input.focus();
        } else {
            input.value = '';
        }
    }, [messageToEdit]);


    const handleSend = async () => {
        const input = document.querySelector('.' + styles.messageInput);
        const message = input.value;
        if (message && props.currentChat) {
            try {
                const response = await axios.post(API_URLS.SEND_MESSAGE(props.currentChat._id), {text: message}, {
                    withCredentials: true,
                });
                const result = await response.data;
                const updatedChat = {...props.currentChat, messages: [...props.currentChat.messages, result]};
                props.setCurrentChat(updatedChat);
                props.setChats(props.chats.map((chat) => chat._id === updatedChat._id ? updatedChat : chat));
                input.value = '';
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    const handleEdit = async () => {
        const input = document.querySelector('.' + styles.messageInput);
        const newMessage = input.value;
        if (newMessage && messageToEdit) {
            try {
                console.log('Editing message:', messageToEdit._id);
                const response = await axios.put(API_URLS.EDIT_MESSAGE(props.currentChat._id, messageToEdit._id), {text: newMessage}, {
                    withCredentials: true,
                });
                const result = await response.data;
                const updatedMessages = props.currentChat.messages.map((message) => message._id === result._id ? result : message);
                const updatedChat = {...props.currentChat, messages: updatedMessages};
                // props.setCurrentChat(updatedChat);
                props.currentChat.messages = updatedMessages;
                setMessageToEdit(null);
                props.setChats(props.chats.map((chat) => chat._id === updatedChat._id ? updatedChat : chat));
                console.log('Success');
            } catch (error) {
                console.error('Error editing message:', error);
            }
        }
    };



    return (
        <div className={styles.chatWindow}>
            <div className={styles.chatHeader}>
                <AvatarIcon icon={props.currentChat ? props.currentChat.avatar : userAvatar }/>
                <div className={styles.chatName}>{props.currentChat ? props.currentChat.firstName + ' ' + props.currentChat.lastName : 'No chat is selected'}</div>
            </div>
            <div className={styles.messages}>
                {props.currentChat ? (
                    props.currentChat.messages.map((messageData, index) => 
                        <Message 
                            key={index} 
                            messageData={messageData} 
                            icon={props.currentChat.avatar}
                            setMessageToEdit={setMessageToEdit} />
                    )
                ) : (
                    <p></p>
                )}
            </div>
            { messageToEdit && 
                <div className={styles.editLedge}>
                    <img src={editImg} alt="edit" className={styles.editImg} />
                    <div>
                        <b>Edit message</b>
                        <p className={styles.editLedgeText}>{messageToEdit.text}</p>
                    </div>
                    <p onClick={()=>setMessageToEdit(null)} className={styles.closeBtn}>X</p>
                </div>
            }
            <div className={styles.inputSection}>
                <input onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                        if (messageToEdit)
                            handleEdit();
                        else
                            handleSend();
                    }
                }} type="text" placeholder='Type your message' className={styles.messageInput}/>
                {messageToEdit ? 
                    <button onClick={handleEdit} className={`${styles.sendButton} ${styles.editBtn}`}></button>
                    :
                    <button onClick={handleSend} className={styles.sendButton}></button>
                }
                
            </div>
        </div>
    );
}