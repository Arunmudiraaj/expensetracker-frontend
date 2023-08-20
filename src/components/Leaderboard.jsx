import React, { useEffect, useState } from "react";
import styles from "../styles/leaderboard.module.scss";
import axios from "axios";
const Leaderboard = (props) => {
  const [userList, setUserList] = useState([]);
  const url = "http://13.233.148.1:3000/premium/getleaderboard";
  const closeModalHandler = (e) => {
    if (e.target.id && e.target.id === "backdrop") {
      props.toggle();
    }
  };

  useEffect(() => {
    const getData = async () => {
      const data = await axios(url);
      setUserList(data.data);
    };
    getData();
  }, []);

  return (
    <div className={styles.backdrop} id="backdrop" onClick={closeModalHandler}>
      <div className={styles.modal}>
        <div className={styles.heading}>Top Users</div>
        <button onClick={props.toggle} className={styles.close}>
          X
        </button>
        <table className={styles.leaderboardTable}>
          <thead>
            <tr>
              <th>Id</th>
              <th>Username</th>
              <th>Total Expenses</th>
            </tr>
          </thead>
          <tbody>
            {userList.map((item) => (
              <tr key={item.id} className="tr">
                <td>{item.id}</td>
                <td>{item.userName}</td>
                <td>💲{item.totalExpenses}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
