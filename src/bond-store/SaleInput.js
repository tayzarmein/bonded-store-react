import React from "react";

export default function SaleInput(props) {
  let {
    users,
    categories,
    selectedUserId,
    selectedCategory,
    selectedProduct,
    boughtQty,
    index,
    selectedPrice,
    rob,
    products,
    dispatch,
    dataForSaleInput,
  } = props;

  console.log("[rendered] SaleInput. props=", props);

  return (
    <div>
      <select
        value={selectedUserId}
        onChange={(e) => {
          // debugger;
          dispatch({
            type: "setUserId",
            payload: {
              userId: e.target.value,
              index: index,
            },
          });
        }}
      >
        {selectedUserId !== ""
          ? users.map((user) => {
              return (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              );
            })
          : null}
      </select>
      <select
        value={selectedCategory}
        onChange={(e) => {
          dispatch({
            type: "setCategoryId",
            payload: {
              categoryId: e.target.value,
              index: index,
            },
          });
        }}
      >
        {selectedCategory !== ""
          ? categories.map((category) => {
              return (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              );
            })
          : null}
      </select>
      <select
        value={selectedProduct}
        onChange={(e) => {
          dispatch({
            type: "setProductId",
            payload: {
              productId: e.target.value,
              index: index,
            },
          });
        }}
      >
        {selectedProduct !== ""
          ? products
              .filter((p) => p.category_id === +selectedCategory)
              .map((p) => {
                return (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                );
              })
          : null}
      </select>
      <select
        value={selectedPrice}
        onChange={(e) => {
          dispatch({
            type: "setPrice",
            payload: {
              price: e.target.value,
              index: index,
            },
          });
        }}
      >
        {selectedPrice !== ""
          ? rob
              .filter((r) => +r.product_id === +selectedProduct)
              .map((r, index) => {
                return (
                  <option key={index} value={r.price}>
                    {r.price}
                  </option>
                );
              })
          : null}
      </select>
      Available: {getAvailableQty()}
      <input
        className="small-width-input"
        placeholder="Qty"
        value={boughtQty}
        onChange={(e) => {
          if(e.target.value <= getAvailableQty()) {
            dispatch({
              type: "setInputQty",
              payload: {
                qty: e.target.value,
                index: index,
              },
            });
          }
        }}
      ></input>
      <button
        style={{ display: "inline-block", marginLeft: 10 }}
        onClick={() => {
          if (window.confirm("Are u sure")) {
            dispatch({
              type: "removeItem",
              payload: {
                index: index,
              },
            });
          }
        }}
      >
        Remove
      </button>
    </div>
  );

  function getAvailableQty() {
    console.log("called getAvailableQty. index=", index);
    let currentProductId = dataForSaleInput[index].selectedProductId;
    let currentPrice = dataForSaleInput[index].selectedPrice;
    if (index === 0) {
      return getInitialQty(
        dataForSaleInput[index].selectedProductId,
        dataForSaleInput[index].selectedPrice
      );
    } else {
      const initialQty = getInitialQty(currentProductId, currentPrice);
      let totalInputQty = 0;
      for (let i = 0; i < index; i++) {
        const obj = dataForSaleInput[i];
        if (
          obj.selectedProductId === currentProductId &&
          obj.selectedPrice === currentPrice
        ) {
          console.log("i=", i, "obj.inputQty=", obj.inputQty);
          totalInputQty += +obj.inputQty;
        }
      }
      console.log("initialQty =", initialQty, "totalInputQty=", totalInputQty);
      return initialQty - totalInputQty;
    }
  }

  function getInitialQty(pid, price) {
    console.log("Called GetInitial Qty. pid=", pid, "price=", price)
    if (
      rob.find((r) => {
        return +r.product_id === +pid && +r.price === +price;
      })
    ) {

      console.log("Found item in rob. returning qty");
      console.log(+rob.find((r) => {
        return +r.product_id === +pid && +r.price === +price;
      }).qty);

      return +rob.find((r) => {
        return +r.product_id === +pid && +r.price === +price;
      }).qty;
    } else {
      console.log("Item not found in rob. returning 0");
      return 0;
    }
  }
}
