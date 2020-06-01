import React, {useReducer, useRef} from "react";
import Axios from "axios";
import ReceiptIndividual from './ReceiptIndividual';
import _ from 'lodash';


export default function ReceiptAdd({ products, setCurrentView }) {
    const [userInputs, dispatchUserInputs] = useReducer(reducerUserInputs, [
      {
        selectedProduct: products.length ? products[0].id.toString() : "",
        inputtedPrice: "",
        inputtedQty: "",
      }
    ])
    const prevUserInputs = usePrev(userInputs);
    let prevProductRef = useRef(products);
    let prevProducts = prevProductRef.current;
    
    if(products !== prevProducts) {
      console.log("product changed");
    }
  
    if (userInputs !== prevUserInputs) {
      console.log("user inputs changed");
    }
  
    return (
      <div>
        <h3>Add purchases</h3>
        {userInputs.map((input, i) => {
          return <ReceiptIndividual index={i} key={i} {...{ products, input, dispatchUserInputs, setCurrentView }} />;
        })}
        <button onClick={() => dispatchUserInputs({type: 'addOne'})}>Add another</button>
        <button onClick={onClickSave}>Save</button>
      </div>
    );
  
    function onClickSave(e) {
      if(window.confirm("Are You Sure?")) {
        console.log("clicked save. sending userInputs=", userInputs);
        (async function () {
          try {
            let axiosResult = await Axios.get('../api/receipts/get-current-batch');
            const lastBatchNo = axiosResult.data.data;
            const data = userInputs.map((input, index) => {
              return {
                pid: +input.selectedProduct,
                price: +input.inputtedPrice,
                qty: +input.inputtedQty,
                batch_number: +lastBatchNo + 1,
              }
            });
            axiosResult = await Axios.post('../api/receipts', data);
            if(axiosResult.status === 200) {
              window.alert("Save Success.");
              setCurrentView('default');
              console.log("post receipts succeeded.");
            }
          } catch (error) {
            console.log("Error in async function. error=", error);
            
          }
        })();
  
      }
    }
  }

  function usePrev(value) {
    const ref = useRef(value);
    const retVal = ref.current;
    ref.current = value;
  
    return retVal;
  }

  function reducerUserInputs(state, action) {
    let newState = _.cloneDeep(state);
    switch (action.type) {
      case 'setProductId':
        newState[action.payload.index].selectedProduct = action.payload.productId;
        return newState;
    
      case 'setPrice':
        newState[action.payload.index].inputtedPrice = action.payload.price;
        return newState;
  
      case 'setQty':
        newState[action.payload.index].inputtedQty = action.payload.qty;
        return newState;
  
      case 'addOne':
        newState.push(_.cloneDeep(newState[newState.length - 1]));
        return newState;
  
      case 'removeOne':
        delete newState[action.payload.index];
        return newState;
      
  
      default:
        break;
    }
  }