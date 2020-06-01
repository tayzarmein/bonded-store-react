import React, { useState, useEffect } from "react";
import Axios from "axios";

export default function ReceiptPartial(props) {
  let { splittedBatNos, currentClickedBtn } = props;
  const [loading, setLoading] = useState(true);
  const [receipts, setReceipts] = useState([]);

  currentClickedBtn = 2;

  useEffect(() => {
    console.log("CurrentClickedBtn=",currentClickedBtn);

    if(splittedBatNos[currentClickedBtn]) {
      splittedBatNos[currentClickedBtn].forEach(batNo => {
      
        console.log("BatNo=", batNo);
        Axios.get(`../api/receipts?batchnumber=${batNo}`)
          .then((r) => {
            const data = r.data;
            console.log("batchNo=", batNo);
            console.log("data=", data);
  
          }).catch((e) => console.log("error in batchNo Req. E=", e));
      });
      }

  });

  let prevBatchNumber = null;

  if (loading) {
    return <h3>Loading</h3>;
  }
  

  return (
    <table>
      <tbody>
        <tr>
          <th>Batch</th>
          <th>Product</th>
          <th>Price</th>
          <th>Qty</th>
          <th>Purchase Date</th>
        </tr>
        {receipts.map((r, i) => {
          let same = r.batch_number === prevBatchNumber;
          prevBatchNumber = r.batch_number;
          return (
            <tr key={i}>
              <td>{same ? null : r.batch_number}</td>
              <td>{r.product}</td>
              <td>{r.price}</td>
              <td>{r.qty}</td>
              <td>{r.date}</td>
              <td>
                {same ? null : (
                  <button
                    onClick={(e) => {
                      if (window.confirm("Are you sure?")) {
                        remove(r.batch_number);
                      }
                    }}
                  >
                    Remove
                  </button>
                )}
              </td>
              <td>
                {same ? null : (
                  <button
                    onClick={(e) => {
                      if (window.confirm("Are you sure?")) {
                      }
                    }}
                  >
                    Edit
                  </button>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  function remove(batch_no) {
    Axios.delete(`../api/receipts?batch_no=${batch_no}`)
      .then((r) => {
        console.log("delete success. result=", r);
        Axios.get("../api/receipts?limit=10")
          .then((r) => {
            console.log("Fetching receipts succeedded. data=", r);
            setLoading(false);
            setReceipts(r.data instanceof Array ? r.data : []);
          })
          .catch((e) => console.log("Error when fetching receipts. error=", e));
      })
      .catch((e) => console.log("Error in delete request. e=", e));
  }
}
