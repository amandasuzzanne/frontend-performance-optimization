import React from "react";

// React.memo prevents rerendering unless props change
function TransactionRow({ t }) {
  return (
    <div className="row">
      <div>{t.merchant}</div>
      <div>KES {Number(t.amount).toLocaleString()}</div>
      <div>{t.date}</div>
    </div>
  );
}

export default React.memo(TransactionRow);
