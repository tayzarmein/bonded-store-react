import React, { useState, useRef } from "react";
import ReactDOM from "react-dom";
import SaleReport from "./SaleReport";

export default function SaleReportsUI({ users }) {
  const [selectedUsers, setSelectedUsers] = useState(
    users.length ? [users[0].id] : []
  );
  const [selectedYear, setSelectedYear] = useState(
      (new Date()).getFullYear().toString()
    );
  const [selectedMonth, setSelectedMonth] = useState(
      ((new Date()).getMonth() + 1).toString()
  );

  const resultDiv = useRef();
  return (
    <div>
      <h3>Sales Report</h3>
      {generateUserList()}
      {generateYearsList()}
      {generateMonthList()}
      <button
        onClick={e => {
          ReactDOM.render(
            <SaleReport
             {...{selectedUsers, selectedYear, selectedMonth, users}}
            />,
            resultDiv.current
          );
        }}
      >Generate</button>
      <div ref={resultDiv}></div>
    </div>
  );

  function generateUserList() {
    if (!users || !users.length) {
      return <span>Please Add a User</span>;
    } else {
      return (
        <select
          multiple={true}
          value={selectedUsers}
          onChange={e =>{
            let options = e.target.options;
            let value = [];
            for (let i = 0; i < options.length; i++) {
                if(options[i].selected) {
                    value.push(options[i].value);
                }
            }
            setSelectedUsers(value);
            
          }}
        >
          {users.map((u) => {
            return (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            );
          })}
        </select>
      );
    }
  }

  function generateYearsList() {
      const currentYear = (new Date()).getFullYear();
      const years = [];
      for (let i = currentYear - 20; i <= currentYear; i++) {
        years.push(i.toString());
      }
      return (
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(e.target.value)}
          >
              {years.map(y => {
                  return (
                      <option value={y.toString()} key={y}>
                          {y}
                      </option>
                  );
              })}
          </select>
      )
  }

  function generateMonthList() {
    return (
        <select
          value={selectedMonth}
          onChange={e => setSelectedMonth(e.target.value)}
        >
            <option value="1">JAN</option>
            <option value="2">FEB</option>
            <option value="3">MAR</option>
            <option value="4">APR</option>
            <option value="5">MAY</option>
            <option value="6">JUN</option>
            <option value="7">JULY</option>
            <option value="8">AUG</option>
            <option value="9">SEP</option>
            <option value="10">OCT</option>
            <option value="11">NOV</option>
            <option value="12">DEC</option>
        </select>
    )   
  }
}
