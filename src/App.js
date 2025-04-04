import React, { useState, useEffect } from 'react';
import './index.css';

const PRODUCTS = [
  { id: 1, name: "Laptop", price: 500 },
  { id: 2, name: "Smartphone", price: 300 },
  { id: 3, name: "Headphones", price: 100 },
  { id: 4, name: "Smartwatch", price: 150 },
];

const FREE_GIFT = { id: 99, name: "Wireless Mouse", price: 0 };
const THRESHOLD = 1000;

function App() {
  const [cart, setCart] = useState([]);
  const [showGiftMessage, setShowGiftMessage] = useState(false);

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  useEffect(() => {
    const subtotal = calculateSubtotal();
    const hasFreeGift = cart.some(item => item.id === FREE_GIFT.id);

    if (subtotal >= THRESHOLD && !hasFreeGift) {
      setCart(prevCart => [...prevCart, { ...FREE_GIFT, quantity: 1 }]);
      setShowGiftMessage(true);
      setTimeout(() => setShowGiftMessage(false), 3000);
    } else if (subtotal < THRESHOLD && hasFreeGift) {
      setCart(prevCart => prevCart.filter(item => item.id !== FREE_GIFT.id));
    }
  }, [cart]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">Shopping Cart</h1>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-xl text-gray-700 mb-4">Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
              {PRODUCTS.map(product => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm p-4 flex flex-col">
                  <h3 className="font-medium text-gray-900">{product.name}</h3>
                  <p className="text-gray-600 mt-1">₹{product.price}</p>
                  <button
                    onClick={() => addToCart(product)}
                    className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white rounded py-2 px-4 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl text-gray-700 mb-4">Cart Summary</h2>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center border-b pb-4">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-gray-900 font-medium">₹{calculateSubtotal()}</span>
              </div>

              {calculateSubtotal() < THRESHOLD && (
                <div className="mt-4 bg-blue-50 text-blue-700 p-4 rounded-md">
                  Add ₹{THRESHOLD - calculateSubtotal()} more to get a FREE Wireless Mouse!
                </div>
              )}

              {showGiftMessage && (
                <div className="mt-4 bg-green-50 text-green-700 p-4 rounded-md">
                  Congratulations! Your free Wireless Mouse has been added to the cart!
                </div>
              )}

              {cart.length > 0 ? (
                <div className="mt-6 space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center py-3 border-b last:border-0">
                      <div>
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-500">₹{item.price} × {item.quantity}</p>
                      </div>
                      {item.id !== FREE_GIFT.id && (
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            -
                          </button>
                          <span className="text-gray-900">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="ml-4 text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-6 text-center text-gray-500">
                  <p>Your cart is empty</p>
                  <p className="text-sm mt-1">Add some products to see them here!</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default App; 
