import React, { useState } from 'react';
import { FiShoppingCart } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { getImgUrl } from '../../utils/getImgUrl';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/features/cart/cartSlice';
import { useFetchProductByIdQuery } from '../../redux/features/products/productsApi';
import "../../Styles/StylesSingleProduct.css";

const SingleProduct = () => {
    const { id } = useParams();
    const { data: product, isLoading, isError } = useFetchProductByIdQuery(id);
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        dispatch(addToCart({ ...product, quantity }));
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading product info</div>;

    return (
        <div className="max-w-lg shadow-md p-5 card-product">
            <h1 className="text-2xl font-bold mb-6">{product.title}</h1>

            <div>
                <div>
                    <img
                        src={`${getImgUrl(product.coverImage)}`}
                        alt={product.title}
                        className="mb-8"
                    />
                </div>

                <div className='mb-5'>
                    <p className="text-gray-700 mb-4">
                        <strong>Published:</strong> {new Date(product?.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-gray-700 mb-4 capitalize">
                        <strong>Category:</strong> {product?.category}
                    </p>
                    <p className="text-gray-700"><strong>Description:</strong> {product.description}</p>
                </div>

                <div className="flex items-center mb-4">
                    <label className="mr-2 font-medium">Qty:</label>
                    <input 
                        type="number" 
                        min="1" 
                        value={quantity} 
                        onChange={(e) => setQuantity(Number(e.target.value))} 
                        className="border rounded px-2 w-16" 
                    />
                </div>

                <button
                    onClick={handleAddToCart}
                    className="btn-primary px-6 space-x-1 flex items-center gap-1 bg-gray-100 hover:bg-gray-700"
                >
                    <FiShoppingCart />
                    <span>Add to Cart</span>
                </button>
            </div>
        </div>
    );
};

export default SingleProduct;