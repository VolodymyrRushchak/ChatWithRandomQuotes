import React, { useEffect } from "react";
import styles from "./loginSuccess.module.css";


export function LoginSuccess() {
  useEffect(() => {
    setTimeout(() => {
      window.close();
    }, 1000);
  }, []);

  return <div className={styles.message}>Thanks for logging in!</div>;
}