import styles from './message.module.css';
import AvatarIcon from '../avatarIcon/avatarIcon';
import { formatTimestamp } from '../../utils';


export default function Message(props) {
    const isMyMessage = props.messageData.isMine;
    const handleEdit = () => {
        props.setMessageToEdit(props.messageData);
    };


    return (
        <div className={`${styles.message} ${isMyMessage ? styles.right : styles.left}`}>
            {props.messageData.isMine ? 
                <button onClick={handleEdit} className={styles.editBtn}>✏️</button>  
                : <AvatarIcon icon={props.icon}/>}
            <div className={styles.flex}>
                <div className={`${styles.textBox} ${isMyMessage ? styles.right : styles.left}`}>
                    {props.messageData.text}
                </div>
                <div className={styles.datetime}>
                    {formatTimestamp(props.messageData.timestamp, true)}
                </div>
            </div>
        </div>
    );
}