import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import styles from "../styles/expenses.module.scss";

const Expenses = (props) => {
  const url = "http://13.233.148.1:3000/expenses";
  const numbersArray = Array.from({ length: 45 }, (_, i) => i + 6);
  const [expensesState, setExpensesState] = useState({
    page: 1,
    maxPage: null,
    expensesData: [],
    limit: localStorage.getItem("itemsperpage") || 5,
  });

  const nextPage = () => {
    if (expensesState.page === expensesState.maxPage) {
      setExpensesState((pre) => {
        return { ...pre, page: 1 };
      });
    } else {
      setExpensesState((pre) => {
        return { ...pre, page: pre.page + 1 };
      });
    }
  };
  const prevPage = () => {
    if (expensesState.page === 1) {
      return;
    }
    setExpensesState((pre) => {
      return { ...pre, page: pre.page - 1 };
    });
  };

  const deleteExpenseHandler = (id) => {
    const toBeDeleted = expensesState.expensesData.find((i) => i.id === id);
    props.reduceTotalBy(toBeDeleted.amount);

    setExpensesState((pre) => {
      const newData = pre.expensesData.filter((item) => item.id !== id);
      return { ...pre, expensesData: newData };
    });
  };

  const deleteHandler = (id) => {
    console.log(id);
    axios
      .delete(url + "/delete/" + id, {
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then((res) => {
        deleteExpenseHandler(id);
      })
      .catch((err) => {
        console.log(err);
        alert(err.response.data.message);
      });
  };

  const pageLimitHandler = (e) => {
    const limitExp = Number(e.target.value);
    localStorage.setItem("itemsperpage", limitExp);
    setExpensesState({ ...expensesState, limit: limitExp });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const itemsPerPage = localStorage.getItem("itemsperpage") || 5;
    const getData = async () => {
      console.log("Page changed");
      try {
        const res = await axios(
          `${url}/page/${expensesState.page}/${itemsPerPage}`,
          { headers: { Authorization: token } }
        );
        console.log(res);
        if (
          expensesState.maxPage &&
          expensesState.page > expensesState.maxPage
        ) {
          setExpensesState(() => {
            return {
              expensesData: res.data.expenses,
              page: 1,
              maxPage: res.data.lastPage,
              limit: res.data.itemsPerPage,
            };
          });
        } else {
          setExpensesState(() => {
            return {
              expensesData: res.data.expenses,
              page: res.data.currentpage,
              maxPage: res.data.lastPage,
              limit: res.data.itemsPerPage,
            };
          });
        }
      } catch (err) {
        console.log(err);
      }
    };

    getData();
  }, [expensesState.page, expensesState.limit]);

  return (
    <div>
      <div className={styles.selectPage}>
        <label htmlFor="numberSelect">Select Expenses per page</label>
        <select
          id="numberSelect"
          className={styles.numberSelect}
          name="numberSelect"
          onChange={pageLimitHandler}
          defaultValue={expensesState.limit || 5}
        >
          <option value="5">5</option>
          {/* Generate options for numbers in the array */}
          {numbersArray.map((number) => (
            <option key={number} value={number}>
              {number}
            </option>
          ))}
        </select>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Description</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {expensesState.expensesData.map((item) => (
            <tr key={item.id} className="tr">
              <td>{item.desc}</td>
              <td>💲{item.amount}</td>
              <td>{item.category}</td>
              <td>
                <button
                  className={styles.deleteBtn}
                  onClick={() => {
                    console.log(item.id);
                    deleteHandler(item.id);
                  }}
                >
                  X
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.navDiv}>
        <button className={styles.navBtn} onClick={() => prevPage()}>
          {"<"}
        </button>
        <p className={styles.navInfo}>
          <span className={styles.navNum}>{expensesState.page}</span> of{" "}
          <span className={styles.navNum}>{expensesState.maxPage}</span>
        </p>
        <button className={styles.navBtn} onClick={() => nextPage()}>
          {">"}
        </button>
      </div>
    </div>
  );
};

export default Expenses;
