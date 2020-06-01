import React, { useEffect, useState } from "react";
import Axios from "axios";

export default function SaleReport({
  selectedUsers,
  selectedYear,
  selectedMonth,
  users,
}) {
  return (
    <div>
      <table>
        <tbody>
          <tr>
              <th>Username</th>
              <th>Date</th>
              <th>Product</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Total</th>
          </tr>
          {selectedUsers.map(u => {
              return (
                  <SaleReportEach
                    key={u}
                    selectedUser={u}
                    {...{selectedYear, selectedMonth, users}}
                  />
              )
          })}
        </tbody>
      </table>
    </div>
  );
}

function SaleReportEach({
    selectedUser,
    selectedYear,
    selectedMonth,
    users
 }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  useEffect(() => {
    if (
      !isNaN(parseInt(selectedUser)) &&
      !isNaN(parseInt(selectedMonth)) &&
      !isNaN(parseInt(selectedYear))
    )
      Axios.get(
        `../api/sale-reports/${selectedUser}?user=${selectedUser}&&period=${selectedMonth}&&year=${selectedYear}`
      )
        .then((v) => {
          setLoading(false);
          setData(v.data.tableData);
          setTotal(v.data.total);
          console.log("success. v=", v);
        })
        .catch((e) => console.log("error. e=", e));
  }, [selectedUser, selectedMonth, selectedYear]);
  if(loading) {
      return (
          <tr>
              <td colSpan="5">Loading</td>
          </tr>
      )
  }
  if(!data.length) {
      return (
          <tr>
              <td colSpan="5">There is no sale for that user</td>
          </tr>
      )
  }
  return (
    <React.Fragment>
      {data.map((d, i) => {
          return (
            <tr key={i}>
              <td>
                {i === 0
                  ? users.find((u) => u.id === +selectedUser).name
                  : null}
              </td>
              <td>{d[0]}</td>
              <td>{d[1]}</td>
              <td>{d[2]}</td>
              <td>{d[3]}</td>
              <td>{d[4]}</td>
            </tr>
          );
      })}
      <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td>
          <strong>{total[1]}</strong>
        </td>
      </tr>
    </React.Fragment>
  );
}
