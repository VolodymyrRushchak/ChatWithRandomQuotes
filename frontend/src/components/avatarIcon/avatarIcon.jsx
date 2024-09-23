import styles from './avatarIcon.module.css';


export default function AvatarIcon(props) {
    return ( 
        <img src={props.icon} alt='avatar icon' className={styles.avatarIcon}/>
    );
}