import React from "react";
import styles from "../styles/card.module.scss";
import dollar from "../assets/money-dollar-circle-fill.svg";
const Card = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <span className={styles.title}>{props.title}</span>
        {props.btn ? (
          <img className={styles.add} src={props.btn} onClick={props.action} />
        ) : (
          <span className={styles.value}>{props.value}</span>
        )}
      </div>
      <img src={props.img} />
    </div>
  );
};

export default Card;
