import React, { useState, useEffect } from "react";
import CategoryUI from "./CategoryUI";
import ProductUI from "./ProductUI";
import ROB from "./ROB";
import ReceiveUI from "./Receipts/ReceiveUI";
import axios from "axios";
import SalesUI from "./SalesUI";
import SaleReportsUI from "./SaleReportsUI";

export default function BondStore() {
  let [categories, setCategories] = useState([]);
  let [products, setProducts] = useState([]);
  let [rob, setRob] = useState([]);
  let [currentView, setCurrentView] = useState("rob");
  const [users, setUsers] = useState([]);

  //Initial Render
  async function fetchCategories() {
    // try {
    //   let r = await axios.get("../api/categories");
    //   console.log("fetched categories");
    //   setCategories(r.data);
    // } catch (error) {
    //   console.log("error fetching categories.");
    // }
  }
  async function fetchProducts() {
    // try {
    //   let r = await axios.get("../api/products");
    //   console.log("fetched products");
    //   setProducts(r.data);
    // } catch (error) {}
  }

  useEffect(() => {
    console.log("[effect called]. BondStore");
    let ignore = false;

    // console.log("fetching categories");
    // axios.get('../api/categories').then(
    //   r => {
    //     console.log("fetched categories");
    //     if(!ignore){
    //       console.log("setCategories Called with=", r.data);
    //       setCategories(r.data);
    //   }
    //  }
    // ).catch(error => {console.log("error fetching categories.")});

    // console.log("fetching products");
    // axios.get('../api/products').then(
    //   r => {
    //     console.log("fetched products");
    //     if(!ignore){
    //       console.log("setProducts Called with=", r.data);
    //       setProducts(r.data);
    //   }
    //  }
    // ).catch(error => {console.log("error fetching products.")});

    // console.log("fetching ROB");
    // axios.get('../api/ROB/now').then(
    //   r => {
    //     console.log("fetched ROB");
    //     if(!ignore){
    //       console.log("setRob Called with=", r.data.data);
    //       setRob(r.data.data);
    //   }
    //  }
    // ).catch(error => {console.log("error fetching ROB.")});

    (async function() {
      try {
        let r = await axios.get("../api/categories");
        console.log("fetched categories");
        if (!ignore) {
          console.log("[setState called]. setCategories Called with=", r.data);
          setCategories(r.data);
        }
      } catch (error) {
        console.log("error fetching categories.Error=", error);
      }
    })();

    (async function() {
      try {
        let r = await axios.get("../api/products");
        console.log("fetched products");
        if (!ignore) {
          console.log("[useState called]. setProducts Called with=", r.data);
          setProducts(r.data);
        }
      } catch (error) {}
    })();

    (async function() {
      try {
        let r = await axios.get("../api/ROB/now");
        console.log("Fetched ROB");
        if (!ignore) {
          console.log("[useState called]. setRob Called");
          setRob(r.data.data);
        }
      } catch (error) {
        console.log("Error fetching ROB");
      }
    })();

    (async function () {
      try {
        let result = await axios.get("../api/users");
        setUsers(result.data);
        // setTimeout(() => {
        //   setUsers([
        //     { id: 2, name: "user1" },
        //     { id: 3, name: "user2" }
        //   ]);
        // }, 8000);
      } catch (error) {}
    })();


    return () => {
      ignore = true;
    };
  }, []);


  console.log(
    "[rendered]BondedStore.",
    "categories=",
    categories,
    "products=",
    products,
    "rob=",
    rob,
    "currentView=",
    currentView
  );
  return (
    <div>
      <h3>Bonded Store</h3>
      <div>
        <button
          onClick={() => {
            console.log("[setState Called]. setCurrentView");
            setCurrentView("categories");
          }}
        >
          Manage Category
        </button>
        <button
          onClick={() => {
            console.log("[setState Called]. setCurrentView");
            setCurrentView("products");
          }}
        >
          Manage Products
        </button>
        <button
          onClick={() => {
            console.log("[setState Called]. setCurrentView");
            setCurrentView("purchases");
          }}
        >
          Manage Purchases
        </button>
        <button
          onClick={() => {
            console.log("[setState Called]. setCurrentView");
            setCurrentView("sales");
          }}
        >
          Manage Sales
        </button>
        <button
          onClick={() =>{
            console.log("[setState Called]. setCurrentView");
            setCurrentView("rob");          
          }}
        >
          Current ROB
        </button>
        <button
          onClick={() => {
            console.log("[setState Called]. setCurrentView");
            setCurrentView("saleReports");
          }}
        >
          Sale Reports
        </button>
      </div>
      {currentView === "categories" ? (
        <CategoryUI
          categories={categories}
          onChangeCategories={onChangeCategories}
        />
      ) : currentView === "products" ? (
        <ProductUI
          categories={categories}
          products={products}
          onChangeProducts={onChangeProducts}
        />
      ) : currentView === "purchases" ? (
        <ReceiveUI products={products} categories={categories} />
      ) : currentView === "sales" ? (
        <SalesUI
         categories={categories}
         products={products}
         rob={rob}
         users={users}
        />
      ) : currentView === "saleReports" ? (
        <SaleReportsUI
          users ={users}
        />
      ) :
       (
        <ROB rob={rob} />
      )}
    </div>
  );

  function onChangeProducts(method, data) {
    switch (method) {
      case "store":
        axios({
          method: "POST",
          url: "../api/products",
          data: data
        })
          .then(() => fetchProducts())
          .catch(e => window.alert("Something Wrong"));
        break;
      case "delete":
        axios
          .delete(`../api/products/${data.id}`)
          .then(() => fetchProducts())
          .catch(() => window.alert("something wrong"));
        break;
      default:
        break;
    }
    // setProducts(newProducts);
  }

  function onChangeCategories(method, data) {
    switch (method) {
      case "delete":
        axios({
          method: "delete",
          url: `../api/categories/${data}`
        })
          .then(function(r) {
            fetchCategories();
          })
          .catch(function(error) {
            // console.log("error.response",   error.response);
            // console.log("error.request=", error.request);
            // console.log("error.message=", error.message);
            window.alert("Sorry Something wrong");
          });
        break;
      case "store":
        axios({
          method: "post",
          url: `../api/categories`,
          data: data
        })
          .then(function(r) {
            fetchCategories();
          })
          .catch(function(error) {
            window.alert("Sorry Something Wrong");
          });
        break;

      default:
        break;
    }
  }
}
