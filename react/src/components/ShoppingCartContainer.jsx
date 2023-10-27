
import React from 'react';
import PurchaseConfirmation from './PurchaseConfirmation';

export default function ShoppingCartContainer({
  shoppingCart,
  onPurchase,
  emptyCart,
  handleBackToProducts,
  purchaseSuccess,
  setPurchaseSuccess
}) {

  // Calculate the total price
  const calculateTotalPrice = () => {
    let totalPrice = 0;

    if (shoppingCart.items) {
      for (const productId in shoppingCart.items) {
        if (shoppingCart.items.hasOwnProperty(productId)) {
          const product = shoppingCart.items[productId];
          const count = product.quantity;

          if (product) {
            const subtotal = product.price * count;
            totalPrice += subtotal;
          }
        }
      }
    }

    return totalPrice;
  };

  return (
    <div className="shopping-container">
      <h1>Shopping Cart</h1>
      {Object.keys(shoppingCart.items).length > 0 ? (
        Object.keys(shoppingCart.items).map((productId) => {
          const product = shoppingCart.items[productId];
          if (product) {
            return (
              <p key={productId} className='cart-list'>
                {`${product.name}-${product.quantity}st`}
              </p>
            );
          }
          return null;
        })
      ) : (
        <p>Your shopping cart is empty.</p>
      )}
      <h2 className="total-price">
        Total price: {calculateTotalPrice()} kr
      </h2>
      <button onClick={onPurchase} className='pay-button'>PAY</button>
      <button onClick={emptyCart} className='empty-button'>Empty Cart</button>

      {purchaseSuccess && (
        // –––––––––––––RENDER PURCHASE CONFIRMATION–––––––––––––––––
        <PurchaseConfirmation
          onBackToProducts={handleBackToProducts}
          setPurchaseSuccess={setPurchaseSuccess}
        />
      )}
    </div>
  );
}
