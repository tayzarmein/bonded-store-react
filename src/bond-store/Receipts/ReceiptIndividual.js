import React from "react";

export default function ReceiptIndividual({ products, input, dispatchUserInputs, index, setCurrentView }) {
    return (
      <div>
        <label>product: </label>
        <select
          value={input.selectedProduct}
          onChange={e => dispatchUserInputs({type: 'setProductId', payload: {productId: e.target.value, index}})}
        >
          {products.map((p) => {
            return (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            );
          })}
        </select>
        <label>price: </label>
        <input 
          className="small-width-input"
          onChange={e => dispatchUserInputs({type: 'setPrice', payload: {price: e.target.value, index}})}
          value={input.inputtedPrice}
        ></input>
        <label>qty: </label>
        <input
          className="small-width-input"
          onChange={e => dispatchUserInputs({type: 'setQty', payload: {qty: e.target.value, index}})}
          value={input.inputtedQty}
        ></input>
        <button
          style={{ display: "inline-block", marginLeft: "20px" }}
          onClick={e => {
            if(window.confirm()) {
              dispatchUserInputs({type: 'removeOne', payload: {index}});
            }
          }}
        >
          Remove
        </button>
      </div>
    );
  }