import React from "react";

export default function PaginationBox(props) {
    let {
        qty,
        currentClicked,
        onUserChange,
    } = props;

    if(currentClicked === undefined) {
        currentClicked = qty;
    }
    return (
        <div>
            {generateBoxes(qty)}
        </div>
    )
    function generateBoxes(qty) {
        let buttons = [];
        for (let i = 0; i < qty; i++) {
            let btnNo = i + 1;
            if(btnNo === +currentClicked){
               buttons.push(<button key={btnNo} style={{color: "red"}}>{btnNo}</button>);
            } else{
                buttons.push(
                  <button key={btnNo} onClick={() => onUserChange(btnNo)}>{btnNo}</button>
                );
            }
            
        }
        return buttons;
    }
}