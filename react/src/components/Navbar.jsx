
import React from 'react';
import SearchForm from "./SearchForm";
import SortProducts from "./SortProducts";

export default function Navbar({ shoppingCart, shoppingCartCount, setShoppingCartCount, setSearchWord, onProductsClick, onCartClick, onSort }) {

  const handleCartClick = () => {
    onCartClick();
  };

  const handleProductsClick = () => {
    onProductsClick();
    setSearchWord('');
  };

  return (
    <div className="navbar">
      <div className="navigate-line">
        <button onClick={handleProductsClick} className="product-button">Products</button>
        <button onClick={handleCartClick} className="cart-button">Cart ({shoppingCartCount})</button>
      </div>

      <div className="search-form">

        {/* ––––––––––––––––RENDER SEARCH FORM–––––––––––––––––– */}
        <SearchForm
          setSearchWord={setSearchWord}
          onAddToCart={() => {
            const updatedShoppingCart = { ...shoppingCart };
            updatedShoppingCart.count += 1;
            setShoppingCartCount(updatedShoppingCart.count);
          }}
        />
      </div>

      {/* ––––––––––––––––––RENDER SORT PRODUCTS–––––––––––––––––––– */}
      <SortProducts onSort={onSort} />
    </div>
  );
}