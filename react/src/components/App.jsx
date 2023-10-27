import React, { useEffect, useState } from 'react';
import ShoppingCartContainer from './ShoppingCartContainer';
import Navbar from './Navbar';
import '../css/App.css';

export default function App() {
  const [products, setProducts] = useState([]); //holds an array of product objects retrieved from the backend.
  const [searchWord, setSearchWord] = useState(''); //holds the value of the search term entered by the user in the search bar.
  const [shoppingCart, setShoppingCart] = useState({ items: {}, count: 0 }); // holds an object that represents the current state of the shopping cart. It has two properties: `items` (an object that stores the items added to the cart along with their quantity) and `count` (represents the total number of items in the cart).
  const [currentPage, setCurrentPage] = useState('products'); //represents the current page being displayed in the application. It can have two possible values: `products` or `cart`, depending on which page the user is currently viewing.
  const [sortType, setSortType] = useState('asc'); //olds the current sorting type for the product list. It can have two possible values: `asc` or `desc`.
  const [purchaseSuccess, setPurchaseSuccess] = useState(false); //represents whether a purchase has been successfully completed or not. It is used to display a success message to the user after a purchase is made.

  //––––––––––––––––GET PRODUCT FROM THE BACKEND__________________  
  //used to fetch product data when the searchWord state changes. 

  async function getProducts() {

    const apiUrl = `http://localhost:3000/products?name=${searchWord}`;

    try {
      const res = await fetch(apiUrl);
      const data = await res.json();

      if (data.length === 0) {
        throw 'Error';
      } else {
        setProducts(data);

      }
    } catch (error) {
      console.log(error);

    }
  }
  //getProducts is called when the searchWord change
  useEffect(() => {
    getProducts();
  }, [searchWord]);


  //––––––––––––––––SEARCH FOR A PRODUCT––––––––––––––––––––––
  const filteredProducts = products.filter((product) => {
    return product.name.toLowerCase().includes(searchWord.toLowerCase());
  });


  //––––––––––––UPDATE DATE AT THE BACK END––––––––––––––––––
  const updateStockOnBackend = (product, newStock) => {
    console.log('Sending post request');
    fetch(`http://localhost:3000/products`, {

      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: product.name,
        newStock,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'Stock updated successfully') {

        }
      })
      .catch((error) => {
        console.error(error);

      });
  };

  //––––––––––––HANDLE ADD ITEM TO THE SHOPPING CART––––––––––––––
  const handleAddToCart = (product) => {
    const updatedShoppingCart = { ...shoppingCart };

    if (updatedShoppingCart.items[product.id]) {
      updatedShoppingCart.items[product.id].quantity += 1;
    } else {
      updatedShoppingCart.items[product.id] = { ...product, quantity: 1 };
    }

    product.stock -= 1;

    const totalQuantity = Object.values(updatedShoppingCart.items).reduce((acc, curr) => acc + curr.quantity, 0);
    updatedShoppingCart.count = totalQuantity;
    setShoppingCart(updatedShoppingCart);
  };


  //––––––––––––––––––HANDEL PURCHASE––––––––––––––––––––
  const handlePurchase = () => {
    for (const productId in shoppingCart.items) {
      if (shoppingCart.items.hasOwnProperty(productId)) {
        const product = shoppingCart.items[productId];
        const newStock = product.stock - product.quantity;
        // Make POST request to update the stock
        updateStockOnBackend(product, newStock);
      }
    }
    setPurchaseSuccess(true);
    emptyCart();
  };


  //–––––––––––––––EMPTY THE SHOPPING CART––––––––––––––––––
  const emptyCart = () => {
    const updatedShoppingCart = { items: {}, count: 0 };
    setShoppingCart(updatedShoppingCart);
  };

  //–––––––––––––––––HANDEL BACK TO THE PRODUCTS LIST–––––––––
  const handleBackToProducts = () => {
    setCurrentPage('products');
    setSearchWord('');
    setPurchaseSuccess(false);
  };


  //–––––––––––––––––HANDLE SORT PRODUCTS–––––––––––––––––––
  const handleSortProducts = (type) => {
    setSortType(type);
  };

  const sortedProducts = filteredProducts.slice().sort((a, b) => {
    if (sortType === 'asc') {
      return a.price - b.price;
    } else {
      return b.price - a.price;
    }
  });

  return (
    <div>
      {/* ––––––––––––––––––RENDER NAVBAR––––––––––––––––––––––  */}
      <Navbar
        shoppingCartCount={shoppingCart.count}
        setShoppingCartCount={(count) => {
          const updatedShoppingCart = { ...shoppingCart };
          updatedShoppingCart.count = count;
          setShoppingCart(updatedShoppingCart);
        }}

        onProductsClick={() => setCurrentPage('products')}
        onCartClick={() => setCurrentPage('cart')}
        setSearchWord={setSearchWord}
        setCurrentPage={setCurrentPage}
        onSort={handleSortProducts}
        handleBackToProducts={handleBackToProducts}
      />
      {/* –––––––––––––––––––RENDER PRODUCTS LIST–––––––––––––––––– */}
      {currentPage === 'products' && (
        <div className='product'>
          <div className="products">
            {sortedProducts.map((product) => (
              <div key={product.id}>
                <h3>{product.name}</h3>
                <img className="product-image" src={product.image} alt={product.name} />
                <p>Price: {product.price} kr</p>
                <div>
                  <p>Stock: {product.stock}</p>
                  {product.stock > 0 ? (
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock <= 0}
                    >
                      Add to Cart
                    </button>
                  ) : (
                    <p className="out-of-stock">Out of Stock</p>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      )}
      {/* ––––––––––––––––RENDER SHOPPING CART––––––––––––––– */}
      {currentPage === 'cart' && (
        <div className="cart">
          <ShoppingCartContainer
            shoppingCart={shoppingCart}
            onPurchase={handlePurchase}
            emptyCart={emptyCart}
            handleBackToProducts={handleBackToProducts}
            purchaseSuccess={purchaseSuccess}
            setPurchaseSuccess={setPurchaseSuccess}
          />
        </div>
      )}

    </div>
  );
}