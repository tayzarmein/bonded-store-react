import React from "react";

export default function ROB({rob}) {
    let total = 0;
  console.log("[rendered]ROB", rob);
  if (rob.length) {
    return (
        
      <div>
          <h4>Current ROB</h4>
          <table>
            <tbody>
              <tr>
                <th>No.</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
              </tr>
              {getRobItems()}
              <tr>
                  <td colSpan="5"></td>
                  <td><strong>{total.toFixed(2)}</strong></td>
              </tr>
            </tbody>
          </table>
      </div>
    );
  } else {
    return <p> There is No Products</p>;
  }

  function getRobItems() {
    return rob.map((robItem, index) => {
        total += robItem.price * robItem.qty; 
      return (
          <tr key={index}>
              <td>{index + 1}</td>
              <td>{robItem.name}</td>
              <td>{robItem.category_name}</td>
              <td>{robItem.price}</td>
              <td>{robItem.qty}</td>
              <td>{(robItem.price * robItem.qty).toFixed(2)}</td>
          </tr>
      );
    });
  }

}
