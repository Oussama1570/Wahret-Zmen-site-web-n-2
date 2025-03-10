import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getImgUrl } from '../../utils/getImgUrl';
import { clearCart, removeFromCart, updateQuantity } from '../../redux/features/cart/cartSlice';

const CartPage = () => {
    const cartItems = useSelector(state => state.cart.cartItems);
    const dispatch = useDispatch();

    const totalPrice = cartItems.reduce((acc, item) => acc + item.newPrice * item.quantity, 0).toFixed(2);

    const handleRemoveFromCart = (product) => {
        dispatch(removeFromCart(product));
    };

    const handleClearCart = () => {
        dispatch(clearCart());
    };

    const handleQuantityChange = (product, quantity) => {
        if (quantity > 0) {
            dispatch(updateQuantity({ _id: product._id, quantity }));
        }
    };

    return (
        <div className="flex mt-12 h-full flex-col overflow-hidden bg-white shadow-xl">
            <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                <div className="flex items-start justify-between">
                    <div className="text-lg font-medium text-gray-900">Shopping Cart</div>
                    <button onClick={handleClearCart} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700">Clear Cart</button>
                </div>

                <div className="mt-8">
                    {cartItems.length > 0 ? (
                        <ul role="list" className="-my-6 divide-y divide-gray-200">
                            {cartItems.map((product) => (
                                <li key={product._id} className="flex py-6">
                                    <div className="h-24 w-24 overflow-hidden rounded-md border">
                                        <img src={getImgUrl(product.coverImage)} alt={product.title} className="h-full w-full object-cover" />
                                    </div>

                                    <div className="ml-4 flex flex-1 flex-col">
                                        <div className="flex justify-between text-base font-medium">
                                            <h3><Link to='/'>{product.title}</Link></h3>
                                            <p>${(product.newPrice * product.quantity).toFixed(2)}</p>
                                        </div>
                                        <p className="text-sm text-gray-500">Category: {product.category}</p>
                                        <div className="flex items-center mt-2">
                                            <label className="mr-2">Qty:</label>
                                            <input type="number" min="1" value={product.quantity} onChange={(e) => handleQuantityChange(product, Number(e.target.value))} className="border rounded px-2 w-16" />
                                        </div>
                                        <button onClick={() => handleRemoveFromCart(product)} className="text-red-600 hover:text-red-800 mt-2">Remove</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (<p>No product found!</p>)}
                </div>
            </div>

            <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                <div className="flex justify-between text-base font-medium">
                    <p>Subtotal</p>
                    <p>${totalPrice}</p>
                </div>
                <Link to="/checkout" className="block text-center bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700">Checkout</Link>
            </div>
        </div>
    );
};

export default CartPage;