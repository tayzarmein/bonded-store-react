import React, { useState } from "react";
import ReceiptSummary from './ReceiptSummary';
import ReceiptAdd from './ReceiptAdd';

export default function ReceiveUI({ products }) {
  const [currentView, setCurrentView] = useState("default");

  let selectedComponent;
  switch (currentView) {
    case "default":
      selectedComponent = <ReceiptSummary />;
      break;

    case "all":
      selectedComponent = <ReceiptAll />;
      break;

    case "add":
      selectedComponent = <ReceiptAdd {...{ products, setCurrentView }} />;
      break;

    default:
      selectedComponent = <ReceiptSummary {...{setCurrentView}} />;
      break;
  }

  return (
    <div>
      <h3>Purchases</h3>
      <button onClick={() => setCurrentView("all")}>Show All</button>
      <button onClick={() => setCurrentView("add")}>Add Purchase</button>
      {currentView !== "default" ? (
        <button onClick={() => setCurrentView("default")}>Show Summary</button>
      ) : null}
      {selectedComponent}
    </div>
  );
}

function ReceiptAll() {
  return <h3>Receipt All</h3>;
}




