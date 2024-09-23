import styles from './chat.module.css';
import AvatarIcon from '../avatarIcon/avatarIcon';
import { API_URLS } from '../../apiUrls';
import axios from 'axios';
import { formatTimestamp } from '../../utils';


export default function Chat(props) {
    const handleEdit = (e) => {
        e.stopPropagation();
        props.openDialog(props.chatData);
    };

    const handleDelete = async (e) => {
        e.stopPropagation();

        const confirmDelete = window.confirm('Are you sure you want to delete this chat?');
        if (!confirmDelete) {
            return;
        }
        try {
            const response = await axios.delete(API_URLS.DELETE_CHAT(props.chatData._id), {
                withCredentials: true,
            });
            console.log('Success:', response.data);
            if (props.currentChat && props.currentChat._id === props.chatData._id) {
                props.setCurrentChat(null);
            }
            props.setChats(props.chats.filter(chat => chat._id !== props.chatData._id));
        } catch (error) {
            console.error('Error deleting chat:', error);
        }

    }

    return (
        <div onClick={() => props.setCurrentChat(props.chatData)} className={styles.chatBox}>
            <AvatarIcon icon={props.chatData.avatar}/>
            <div className={styles.chatData}>
                <div className={styles.name}>{props.chatData.firstName} {props.chatData.lastName}
                    <span> </span>
                    <button onClick={handleEdit} className={styles.editBtn}>✏️</button> 
                    <span> </span>
                    <button onClick={handleDelete} className={styles.editBtn}>❌</button> 
                </div>
                {props.chatData.messages.length > 0 ? (
                    <div className={styles.lastMessage}>{props.chatData.messages[props.chatData.messages.length-1].text}</div>
                ) : (
                    <div className={styles.lastMessage}>No messages yet</div>
                )}
            </div>
            {props.chatData.messages.length > 0 ? (
                <div className={styles.date}>{formatTimestamp(props.chatData.messages[props.chatData.messages.length-1].timestamp)}</div>
            ) : (
                <div className={styles.date}></div>
            )}
        </div>
    );
}