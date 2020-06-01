import React, {useEffect, useState} from "react";
import Axios from 'axios';
import PaginationBox from './PaginationBox';
import { splitArray } from "../../utils";
import ReceiptPartial from "./ReceiptPartial";

export default function ReceiptSummary() {
    let prevBatchNumber = null;
    const [loading, setLoading] = useState(true);
    const [splittedBatNos, setSplittedBatNos] = useState([]);
    const [receipts, setReceipts] = useState([]);
    const [currentClickedPaginationBtn, setcurrentClickedPaginationBtn] = useState(1);

    useEffect(() => {
      Axios.get("../api/receipts?limit=10")
        .then((r) => {
          Axios.get("../api/receipts?batchnumbers=true")
          .then((r) => {
            console.log("Fetching batch numbers succeeded. data=", r.data);
            let splittedArray = splitArray(r.data, 10);
            setLoading(false);
            setSplittedBatNos(splittedArray);
            setcurrentClickedPaginationBtn(splittedArray.length);
          })
          .catch((e) => console.log("Error in fetching batch numbers. error=e", e));  
          console.log("Fetching receipts succeedded. data=", r);
          setReceipts(r.data instanceof Array ? r.data : []);
        })
        .catch((e) => console.log("Error when fetching receipts. error=", e));


    }, []);
    if (loading) {
      return <h3>Loading</h3>;
    }
    if (!receipts.length) {
      return <h3>There is no purchases</h3>;
    }
    return (
      <div>
        <PaginationBox
          qty={splittedBatNos.length}
          currentClicked={currentClickedPaginationBtn}
          onUserChange={v => setcurrentClickedPaginationBtn(v)}
        />
        <ReceiptPartial {...{splittedBatNos}} />
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
                  <td>{same ? null : 
                    <button 
                      onClick={e => {
                        if(window.confirm("Are you sure?")) {
                          remove(r.batch_number)
                        }
                      }}
                    >
                      Remove
                    </button>}
                  </td>
                  <td>{same ? null : 
                    <button 
                      onClick={e => {
                        if(window.confirm("Are you sure?")) {
                          
                        }
                      }}
                    >
                      Edit
                    </button>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
    
    function remove(batch_no) {
      Axios.delete(`../api/receipts?batch_no=${batch_no}`)
        .then(r => {
          console.log("delete success. result=", r)
          Axios.get("../api/receipts?limit=10")
          .then((r) => {
            console.log("Fetching receipts succeedded. data=", r);
            setLoading(false);
            setReceipts(r.data instanceof Array ? r.data : []);
          })
          .catch((e) => console.log("Error when fetching receipts. error=", e));  
        })
        .catch(e => console.log("Error in delete request. e=", e));
    }
  }