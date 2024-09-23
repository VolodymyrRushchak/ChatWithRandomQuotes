import Chat from '../chat/chat';
import ToggleButton from '../toggleButton/toggleButton';
import styles from './chatsList.module.css';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { API_URLS } from '../../apiUrls';


export default function ChatsList(props) {
    const isAuthenticated = useSelector((state) => state.isAuthenticated);

    const handleAutoMessaging = (isOn) => {
        const onOff = isOn ? 'on' : 'off';
        axios.post(API_URLS.AUTO_MESSAGING(onOff), {}, {
            withCredentials: true
        }).then((response) => {
            console.log(response.data);
        }).catch((error) => {
            console.error('Error toggling auto messaging:', error);
        });
    };

    return (
        <div className={styles.mainDiv}>
            <div className={styles.flexCont}>
                <p className={styles.title}>Chats</p>
                <div className={styles.flexCont}>
                    {isAuthenticated && (
                        <>
                        <p className={styles.autoMessages}>Automatic<br/> messages</p>
                        <ToggleButton onToggle={handleAutoMessaging} />
                        </>
                    )}
                </div>
                {isAuthenticated && <button onClick={() => props.openDialog(null)} className={styles.createBtn}>+ New chat</button>}
            </div>
            <div className={styles.chatList}>
                {props.displayedChats && isAuthenticated ? (
                    props.displayedChats.map((chatData) => 
                        <Chat key={chatData._id} 
                            chatData={chatData} 
                            setCurrentChat={props.setCurrentChat} 
                            currentChat={props.currentChat}
                            setChats={props.setChats}
                            chats={props.chats}
                            openDialog={props.openDialog}
                        />
                    )
                ) : (
                    isAuthenticated ? (
                        <p className={styles.userMessage}>No chats</p>
                    ) : (
                        <p className={styles.userMessage}>Please log in</p>
                    )
                )}
            </div>
        </div>
    );
}