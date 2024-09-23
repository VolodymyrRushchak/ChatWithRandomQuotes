import styles from './chatInfoDialog.module.css';
import { useState } from 'react';
import aliceAvatar from '../../assets/images/Alice_avatar.png';
import josefinaAvatar from '../../assets/images/Josefina_avatar.png';
import velazquezAvatar from '../../assets/images/Velazquez_avatar.png';
import { API_URLS } from '../../apiUrls';
import axios from 'axios';


export default function ChatInfoDialog(props) {
    const [formData, setFormData] = useState({
        firstName: props.chatToEdit ? props.chatToEdit.firstName : '',
        lastName: props.chatToEdit ? props.chatToEdit.lastName : '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            if (!formData.firstName || !formData.lastName) {
                return;
            }
            let response = null;
            if (props.chatToEdit) {
                response = await axios.put(API_URLS.UPDATE_CHAT(props.chatToEdit._id), formData, {
                    withCredentials: true,
                });
            } else {
                response = await axios.post(API_URLS.CREATE_CHAT, formData, {
                    withCredentials: true,
                });
            }
    
            const result = await response.data;
            console.log('Success:', result);
            const avatars = [aliceAvatar, josefinaAvatar, velazquezAvatar];
            result.avatar = props.chatToEdit ? props.chatToEdit.avatar : avatars[props.chats.length % avatars.length];
            if (props.chatToEdit) {
                const updatedChats = props.chats.map((chat) => chat._id === result._id ? result : chat);
                props.setChats(updatedChats);
                if (props.currentChat && props.currentChat._id === result._id) {
                    props.setCurrentChat(result);
                }
            } else {
                props.setChats(props.chats ? [...props.chats, result] : [result]);
            }
        } catch (error) {
          console.error('Error:', error);
        }

        props.closeDialog();

    };


    return (
        <div className={styles.dialogOverlay}>
            <div className={styles.dialog}>
                {props.chatToEdit ? <h2>Edit Chat</h2> : <h2>Create New Chat</h2>}
                <form onSubmit={handleSubmit}>
                    <label>
                        First Name:
                        <input 
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required 
                        />
                    </label>
                    <br />
                    <label>
                        Last Name:
                        <input 
                            type="text" 
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required 
                        />
                    </label>
                    <br />
                        {props.chatToEdit ? <button type="submit">Update Chat</button> : <button type="submit">Create Chat</button>}
                        <button type="button" onClick={props.closeDialog}>
                            Close
                        </button>
                </form>
            </div>
        </div>
    );
}