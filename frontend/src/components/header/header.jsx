import styles from './header.module.css';
import userAvatar from '../../assets/images/user_avatar.png';
import AvatarIcon from '../avatarIcon/avatarIcon';
import { API_URLS } from '../../apiUrls';
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser, setIsAuthenticated } from "../../appSlice";


export default function Header(props) {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state) => state.isAuthenticated);
    const user = useSelector((state) => state.authUser);


    const fetchAuthUser = async () => {
        const response = await axios
            .get(API_URLS.USER, { 
                withCredentials: true 
            })
            .catch((err) => {
                console.log("Not properly authenticated");
                dispatch(setIsAuthenticated(false));
                dispatch(setAuthUser(null));
            });
    
        if (response && response.data) {
            dispatch(setIsAuthenticated(true));
            dispatch(setAuthUser(response.data));
        }
    };

    const redirectToGoogleSSO = async () => {
        if (isAuthenticated) {
            console.log('You must log out first');
            return;
        }
        let timer = null;
        const newWindow = window.open(
            API_URLS.GOOGLE_AUTH,
            "_blank",
            "width=500,height=600"
        );

        if (newWindow) {
            timer = setInterval(() => {
                if (newWindow.closed) {
                    fetchAuthUser();
                    if (timer) clearInterval(timer);
                }
            }, 500);
        }
    };

    const handleLogout = async () => {  
        try {
            const response = await axios.get(API_URLS.LOGOUT, {
                withCredentials: true,
            });
            if (response.status === 200) {
                console.log('Successfully logged out');
                dispatch(setIsAuthenticated(false));
                dispatch(setAuthUser(null));
                props.setChats(null);
                props.setCurrentChat(null);
            } else {
                console.error('Error logging out:', response);
            }
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const handleInputChange = (e) => {
        if (!props.chats) {
            return;
        }
        props.setDisplayedChats(props.chats.filter(chat => {
            let fullName = chat.firstName + ' ' + chat.lastName;
            return fullName.toLowerCase().includes(e.target.value.toLowerCase())
        }));
    };


    return (
        <div className={styles.header}>
            <div className={styles.upperHalf}>
                <AvatarIcon icon={isAuthenticated ? user.user_image : userAvatar}/>
                <div className={styles.buttons}>
                    {isAuthenticated ? 
                        <button onClick={handleLogout} className={styles.loginLogout}><b>Log out</b></button>
                      : <button onClick={redirectToGoogleSSO} className={styles.loginLogout}><b>Log in</b></button>}
                </div>
            </div>
            <input 
                type="text" 
                placeholder='Search or start new chat' 
                onChange={handleInputChange}
                className={styles.searchBar}/>
        </div>
    );
}