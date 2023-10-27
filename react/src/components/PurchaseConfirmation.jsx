import React from 'react';

export default function PurchaseConfirmation({ onBackToProducts, setPurchaseSuccess }) {
  return (
    <div className="purchase-confirmation">
      <h2>Purchase successful!</h2>
      <p>Thank you for shopping with us.</p>
      <button onClick={() => { onBackToProducts(); setPurchaseSuccess(false); }} className="purchase-confirm-button">Back to Products</button>
    </div>
  );
}
