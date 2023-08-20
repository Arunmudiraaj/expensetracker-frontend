import React, { useRef } from "react";
import styles from "../styles/buyPremium.module.scss";
import axios from "axios";

const AddExpense = (props) => {
  const url = "http://13.233.148.1:3000/purchase";
  const closeModalHandler = (e) => {
    if (e.target.id && e.target.id === "backdrop") {
      props.toggle();
    }
  };
  const paymentBtnHandler = async () => {
    const token = localStorage.getItem("token");
    const response = await axios(url + "/getpremium", {
      headers: { Authorization: token },
    });
    console.log(response);
    const options = {
      key: response.data.key_id,
      order_id: response.data.order.id,
      handler: async function (response) {
        console.log(response);
        await axios.post(
          url + "/updateorderstatus",
          {
            order_id: options.order_id,
            payment_id: response.razorpay_payment_id,
          },
          { headers: { Authorization: token } }
        );
        props.setIsPremium(true);
        alert("You are a premium user now!");
        props.toggle();
      },
    };
    const rzp = new Razorpay(options);
    rzp.open();

    rzp.on("payment.failed", (response) => {
      console.log(response);
      axios.post(
        url + "/paymentfailed",
        {
          order_id: options.order_id,
        },
        { headers: { Authorization: token } }
      );
      alert("Transaction failed");
    });
  };
  return (
    <div className={styles.backdrop} id="backdrop" onClick={closeModalHandler}>
      <div className={styles.modal}>
        <div className={styles.heading}>Become a premium user</div>
        <button onClick={props.toggle} className={styles.close}>
          X
        </button>
        <div className={styles.info}>
          Become a premium user and unlock all the exciting benifits with just
          rupees $100
        </div>
        <button className={styles.paymentBtn} onClick={paymentBtnHandler}>
          Go to Payments
        </button>
      </div>
    </div>
  );
};

export default AddExpense;
