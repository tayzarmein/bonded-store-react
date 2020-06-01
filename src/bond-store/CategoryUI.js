import React, { useState } from "react";

export default function CategoryUI({categories, onChangeCategories}) {
  let [iCategory, setiCategory] = useState("");

  let categoriesElements = categories.map(category => {
    return (
      <React.Fragment key={category.id}>
        <li>
          {category.name}{" "}
          <button name={category.id} onClick={onClickRemoveButton}>
            -
          </button>
        </li>
      </React.Fragment>
    );
  });

  return (
    <div>
      <h4>Categories</h4>
      {categories.length ? categoriesElements : <p>No categories yet. Why not create a category</p>}
      Add Category=
      <input value={iCategory} onChange={e => setiCategory(e.target.value)}></input>
      <button onClick={onClick}>Add</button>
    </div>
  );

  function onClick(e) {
    let prevId = categories.length ? categories[categories.length - 1].id : 0;

    // onChangeCategories([
    //   ...categories,
    //   {
    //     id: prevId + 1,
    //     name: iCategory
    //   }
    // ]);

    onChangeCategories("store", {
      name: iCategory,
    });

    setiCategory('');

  }

  function onClickRemoveButton(e) {
    if(window.confirm("Are U Sure to Remove")) {
        // let arr = [...categories];

        // arr.splice(
        //   arr.findIndex(cat => cat.id === +e.target.name),
        //   1
        // );
        // onChangeCategories(arr);

        let id = +e.target.name;
        onChangeCategories('delete', id);
    
    }
  }
}
