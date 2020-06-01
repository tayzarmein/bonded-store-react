import React, { useRef, useReducer } from "react";
import SaleInput from "./SaleInput";
import Axios from "axios";
import _ from "lodash";

function reducerDataForSaleInput(state, action) {
  let newState = _.cloneDeep(state);

  switch (action.type) {
    case "setSelectedUserIdsToEmpty":
      newState = newState.map((o) => {
        o.selectedUserId = "";
        return o;
      });
      console.log("updating new state. newState=", newState);
      return newState;

    case "setUserId":
      newState[action.payload.index].selectedUserId = action.payload.userId;
      return newState;

    case "setCategoryId":
      newState[action.payload.index].selectedCategoryId =
        action.payload.categoryId;
      return newState;

    case "setProductId":
      console.log('setProductId. action.payload=', action.payload);
      newState[action.payload.index].selectedProductId =
        action.payload.productId;
      return newState;

    case "setPrice":
      newState[action.payload.index].selectedPrice = action.payload.price;
      return newState;

    case "setInputQty":
      newState[action.payload.index].inputQty = action.payload.qty;
      return newState;

    case "addNewItem":
      let newRow =_.cloneDeep(newState[newState.length - 1]);
      newRow.inputQty = "";
      newState.push(newRow);
      return newState;

    case "removeItem":
      newState.splice(action.payload.index, 1);
      return newState;

    default:
      break;
  }
  return {};
}

function initDataForSaleInput({ categories, products, rob, users }) {
  let obj = {};

  obj.selectedUserId = users.length ? users[0].id.toString() : "";
  obj.selectedCategoryId = categories.length ? categories[0].id.toString() : "";
  obj.selectedProductId =
    obj.selectedCategoryId === ""
      ? ""
      : products.find(p => p.category_id === +obj.selectedCategoryId)
        ? products.find(p => p.category_id === +obj.selectedCategoryId).id.toString()
        : "";
  obj.selectedPrice =
    obj.selectedProductId !== ""
      ? rob.find(r => r.product_id === +obj.selectedProductId)
        ? rob.find(r => r.product_id === +obj.selectedProductId).price.toString()
        : ""
      : "";
  obj.inputQty = "";

  return [obj];
}

export default function SalesUI({ categories, products, rob, users }) {
  console.log("[rendered] SaleUI");
  const [dataForSaleInput, dispatchDataForSaleInput] = useReducer(
    reducerDataForSaleInput,
    { categories, products, rob, users },
    initDataForSaleInput
  );

  let prevDataForSaleInputRef = useRef(dataForSaleInput);
  let prevDataForSaleInput = prevDataForSaleInputRef.current;
  let prevUsersRef = useRef(users);
  let prevUsers = prevUsersRef.current;
  let prevProductsRef = useRef(products);
  let prevProducts = prevProductsRef.current;
  let prevRobRef = useRef(rob);
  let prevRob = prevRobRef.current;
  let prevCategoriesRef = useRef(categories);
  let prevCategories = prevCategoriesRef.current;

  //users props changed
  if (users !== prevUsers) {
    console.log(
      "users Changed.",
      "users=",
      users,
      "prevUsers=",
      prevUsers
    );

    if (users.length) {
      let newData = dataForSaleInput;
      newData.forEach((obj, i) => {
        if (obj.selectedUserId === "") {
          dispatchDataForSaleInput({
            type: "setUserId",
            payload: {
              userId: users[0].id.toString(),
              index: i,
            },
          });
        } else if (!users.find((u) => u.id === +obj.selectedUserId)) {
          dispatchDataForSaleInput({
            type: "setUserId",
            payload: {
              userId: users[0].id,
              index: i,
            },
          });
        }
      });
    } else {
      dispatchDataForSaleInput({ type: "setSelectedUserIdsToEmpty" });
    }
  }

  //categories props changed
  if (categories !== prevCategories) {
    console.log("categories changed");

    dataForSaleInput.forEach((obj, i) => {
      if (categories.length === 0) {
        dispatchDataForSaleInput({
          type: "setCategoryId",
          payload: {
            categoryId: "",
            index: i,
          },
        });
      } else if (obj.selectedCategoryId === "") {
        dispatchDataForSaleInput({
          type: "setCategoryId",
          payload: {
            categoryId: categories[0].id,
            index: i,
          },
        });
      } else if (!categories.find((c) => c.id === +obj.selectedCategoryId)) {
        dispatchDataForSaleInput({
          type: "setCategoryId",
          payload: {
            categoryId: categories[0].id,
            index: i,
          },
        });
      }
    });
  }

  //products prop changed
  if (products !== prevProducts) {
    dataForSaleInput.forEach((obj, i) => {
      if(!products.length) {
        dispatchDataForSaleInput({
          type: 'setProductId',
          payload: {
            productId: '',
            index: i
          }
        });
      } else if(obj.selectedProductId === "") {
        dispatchDataForSaleInput({
          type: 'setProductId',
          payload: {
            productId: products[0].id,
            index: i
          }
        });
      } else if (!products.find(p => p.id === +obj.selectedProductId)) {
        dispatchDataForSaleInput({
          type: 'setProductId',
          payload: {
            productId: products[0].id,
            index:i
          }
        });
      }
    });
  }

  //rob pop changed
  if (rob !== prevRob) {
    dataForSaleInput.forEach((obj, i) => {
      if (
        !rob.length ||
        obj.selectedProductId === "" ||
        !rob.find((r) => r.product_id === +obj.selectedProductId)
      ) {
        dispatchDataForSaleInput({
          type: "setPrice",
          payload: {
            price: "",
            index: i,
          },
        });
      } else {
        dispatchDataForSaleInput({
          type: 'setPrice',
          payload: {
            price: rob.find(r => r.product_id === +obj.selectedProductId).price.toString(),
            index: i,
          }
        });
      }
    });
  }

  //user input state changed
  if (dataForSaleInput !== prevDataForSaleInput) {
    console.log(
      "State Changed.",
      "dataForSaleInput=",
      dataForSaleInput,
      "prevDataForSaleInput=",
      prevDataForSaleInput,
      "dataForSaleInput !== prevDataForSaleInput",
      dataForSaleInput !== prevDataForSaleInput
    );

    //this will exclude addition and removing of rows
    if (dataForSaleInput.length === prevDataForSaleInput.length) {
      let newData = dataForSaleInput;
      let oldData = prevDataForSaleInput;

      for (let i = 0; i < dataForSaleInput.length; i++) {
        //selectedCategoryIds Changed
        if (oldData[i].selectedCategoryId !== newData[i].selectedCategoryId) {
          if (newData[i].selectedCategoryId === "") {
            dispatchDataForSaleInput({
              type: "setProductId",
              payload: {
                productId: "",
                index: i,
              },
            });
          } else if (products.find(p => p.category_id === + newData[i].selectedCategoryId)) {
            dispatchDataForSaleInput({
              type: "setProductId",
              payload: {
                productId: products.find(
                  (p) => p.category_id === +newData[i].selectedCategoryId
                ).id,
                index: i,
              },
            });
          } else {
            dispatchDataForSaleInput({
              type: "setProductId",
              payload: {
                productId: "",
                index: i,
              },
            });
          }
        }

        //selectedProductIds Changed
        if (oldData[i].selectedProductId !== newData[i].selectedProductId) {
          console.log(
            "selectedProductIds changed",
            oldData[i].selectedProductId,
            newData[i].selectedProductId
          );
          let newProductId = newData[i].selectedProductId;

          if (newProductId === "") {
            dispatchDataForSaleInput({
              type: "setPrice",
              payload: {
                price: "",
                index: i,
              },
            });
          } else if (rob.find((r) => +r.product_id === +newProductId)) {
            dispatchDataForSaleInput({
              type: "setPrice",
              payload: {
                price: rob.find((r) => +r.product_id === +newProductId).price,
                index: i,
              },
            });
          } else {
            dispatchDataForSaleInput({
              type: "setPrice",
              payload: {
                price: "",
                index: i,
              },
            });
          }
        }
      }
    }
  }

  saveCurrentStateVariables();

  return (
    <div>
      <h4>Manage Sales</h4>
      {dataForSaleInput.map((data, index) => {
        return (
          <SaleInput
            key={index}
            dataForSaleInput={dataForSaleInput}
            dispatch={dispatchDataForSaleInput}
            selectedUserId={data.selectedUserId}
            selectedCategory={data.selectedCategoryId}
            selectedProduct={data.selectedProductId}
            categories={categories}
            products={products}
            boughtQty={data.inputQty}
            selectedPrice={data.selectedPrice}
            availableQty={null}
            rob={rob}
            users={users}
            index={index}
          />
        );
      })}
      <button
        onClick={(e) =>
          dispatchDataForSaleInput({
            type: "addNewItem",
          })
        }
      >
        Add Another Sale
      </button>
      <button onClick={onClickSaveButton}>Save</button>
    </div>
  );

  function saveCurrentStateVariables() {
    console.log("saving variables");
    prevDataForSaleInputRef.current = dataForSaleInput;
    prevUsersRef.current = users;
    prevProductsRef.current = products;
    prevRobRef.current = rob;
    prevCategoriesRef.current = categories;
  }

  function onClickSaveButton(e) {
    const data = dataForSaleInput.map((obj) => {
      return {
        product_id: obj.selectedProductId,
        price: obj.selectedPrice,
        qty: obj.inputQty,
        user_id: obj.selectedUserId,
      };
    });
    console.log("data=", {
      data
    });
    Axios.post("../api/outgoings", {data})
      .then((v) => {
        console.log("success post request. data=", v);
        window.alert("Saved Successfully. OK to reload");
        window.location.reload();
      })
      .catch((e) => console.log("error. e=", e));
  }
}
