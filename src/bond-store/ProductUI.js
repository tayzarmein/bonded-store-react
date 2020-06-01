import React, { useState, useRef } from "react";

export default function ProductUI({ categories, products, onChangeProducts }) {
  let [iProductName, setIProductName] = useState("");
  let [iProductCategoryID, setIProductCategoryID] = useState("");

  let oldCategoriesIDRef = useRef(null);

  //update default select when category change
  if (categories.length) {
    if (oldCategoriesIDRef.current !== categories[0].id) {
      setIProductCategoryID(categories[0].id);
    }
    oldCategoriesIDRef.current = categories[0].id;
  }

  return (
    <div>
      <h4>Products</h4>
      <table>
        <tbody>
          {categories.length ? (
            <React.Fragment>
              <tr>
                <th>Name</th>
                <th>Category</th>
              </tr>
              {products.map((product, index) => {
                return (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>
                      <button onClick={e => removeProduct(product.id)}>
                        -
                      </button>
                    </td>
                  </tr>
                );
              })}
            </React.Fragment>
          ) : (
            <tr>
              <td colSpan="3">
                There is no products why not adding new products
              </td>
            </tr>
          )}

          {categories.length ? (
            <tr>
              <td colSpan="3">
                Add a Product
                <input
                  value={iProductName}
                  onChange={e => setIProductName(e.target.value)}
                ></input>
                <select
                  value={iProductCategoryID}
                  onChange={e => setIProductCategoryID(e.target.value)}
                >
                  {getCategoryOptions()}{" "}
                </select>
                <button onClick={onClickAddButton}>Add</button>
              </td>
            </tr>
          ) : (
            <tr>
              <td colSpan="3">Add a category first</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  function getCategoryOptions() {
    return categories.map(category => (
      <option key={category.id} value={category.id}>
        {category.name}
      </option>
    ));
  }

  function onClickAddButton(e) {
    console.log("iProductCategory=", iProductCategoryID);
    if (window.confirm("Are You Sure?")) {
      // let newProducts = [...products];

      // newProducts.push({
      //   id: products.length ? +products[products.length - 1].id + 1 : 1,
      //   name: iProductName,
      //   category: iProductCategoryID
      // });
      console.log("iProductCategoryID=", iProductCategoryID);

      onChangeProducts("store", {
        name: iProductName,
        category_id: iProductCategoryID
      });
      setIProductName("");
    }
  }

  function removeProduct(id) {
    if (window.confirm("Are u sure")) {
      onChangeProducts("delete", { id });
      // let newProducts = [...products];

      // newProducts.shift(
      //   newProducts.findIndex(v => (v.id === id ? true : false)),
      //   1
      // );

      // onChangeProducts(newProducts);
    }
  }
}
