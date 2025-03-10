import React from 'react';
import { useGetOrderByEmailQuery, useDeleteOrderMutation } from '../../redux/features/orders/ordersApi';
import { useAuth } from '../../context/AuthContext';
import { getImgUrl } from '../../utils/getImgUrl';

const OrderPage = () => {
    const { currentUser } = useAuth();
    const { data: orders = [], isLoading, refetch } = useGetOrderByEmailQuery(currentUser.email);
    const [deleteOrder] = useDeleteOrderMutation();

    const handleDelete = async (orderId) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            try {
                await deleteOrder(orderId);
                refetch(); // Refresh orders after deletion
            } catch (error) {
                console.error('Failed to delete order:', error);
            }
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className='container mx-auto p-6'>
            <h2 className='text-2xl font-semibold mb-4'>Your Orders</h2>
            {orders.length === 0 ? (
                <div>No orders found!</div>
            ) : (
                <div>
                    {orders.map((order, index) => (
                        <div key={order._id} className="border-b mb-4 pb-4">
                            <p className='p-1 bg-secondary text-white w-10 rounded mb-1'># {index + 1}</p>
                            <h2 className="font-bold">Order ID: {order._id}</h2>
                            <p className="text-gray-600">Name: {order.name}</p>
                            <p className="text-gray-600">Email: {order.email}</p>
                            <p className="text-gray-600">Phone: {order.phone}</p>
                            <p className="text-gray-600">Total Price: ${order.totalPrice}</p>
                            <h3 className="font-semibold mt-2">Address:</h3>
                            <p>{order.address.city}, {order.address.state}, {order.address.country}, {order.address.zipcode}</p>
                            
                            <h3 className="font-semibold mt-2">Products:</h3>
                            <ul>
                                {order.products.map((product) => {
                                    if (!product.productId) return null; // Avoid errors when productId is missing

                                    return (
                                        <li key={product.productId._id} className="flex items-center gap-4 border-b py-2">
                                            {/* ✅ Ensure coverImage exists before accessing */}
                                            <img 
                                                src={product.productId.coverImage ? getImgUrl(product.productId.coverImage) : "/default-image.jpg"} 
                                                alt="Product Image" 
                                                className="w-16 h-16 object-cover rounded" 
                                            />
                                            <div>
                                                <p className="font-medium">Product ID: {product.productId._id}</p>
                                                <p>Product Name: {product.productId.title || "No Title"}</p>
                                                <p>Qty: {product.quantity}</p>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>

                            <button 
                                onClick={() => handleDelete(order._id)}
                                className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderPage;
