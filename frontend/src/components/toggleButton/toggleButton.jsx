import React, { useState } from 'react';
import styles from './toggleButton.module.css';

export default function ToggleButton(props) {
  const [isOn, setIsOn] = useState(false);

  const toggleSwitch = () => {
    setIsOn(!isOn);
    props.onToggle(!isOn);
  };

  return (
    <div className={styles.toggleButton} onClick={toggleSwitch}>
        <div className={`${styles.switch} ${isOn ? styles.switchOn : ''}`}>
            <div className={styles.circle}></div>
        </div>
    </div>
  );
};


