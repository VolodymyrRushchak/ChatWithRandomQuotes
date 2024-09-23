import styles from './toastNotification.module.css';


export default function ToastNotification(props) {
    if (!props.chats){
        return null;
    }
    const chat = props.chats.find(chat => chat._id === props.message.chatId);
    const author = chat ? `${chat.firstName} ${chat.lastName}` : 'Unknown';
    const handleClick = () => {
        if (chat) {
            props.setCurrentChat(chat);
        }
        props.onClose();
    };

    return (
        <div onClick={handleClick} className={styles.toast}>
            <div>
                <p>{author}</p>
                <p className={styles.messageTextBox}>{props.message.text}</p>
            </div>
            <button onClick={(event) => {
                event.stopPropagation();
                props.onClose();
            }} className={styles.closeButton}>X</button>
        </div>
    );
}