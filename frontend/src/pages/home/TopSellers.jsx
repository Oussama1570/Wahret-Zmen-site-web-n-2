import React, { useEffect, useState } from 'react';
import ProductCard from '../products/ProductCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { useFetchAllProductsQuery } from '../../redux/features/products/productsApi';
import Selector from '../../components/Selector.jsx';

const categories = ["Choose a genre", "Kaftan", "Jebba", "Gandoura", "Safsari", "Chachia"];

const TopSellers = () => {
    const [selectedCategory, setSelectedCategory] = useState("Choose a genre");
    const { data: products = [] } = useFetchAllProductsQuery();

    const filteredProducts = selectedCategory === "Choose a genre" 
        ? products 
        : products.filter(product => product.category.toLowerCase() === selectedCategory.toLowerCase());

    return (
        <div className='py-10'>
           <h2 className='text-3xl text-gray-600 italic font-medium mb-6 text-center tracking-wide transition-all duration-300 ease-in-out'>
    Top Sellers
</h2>

            {/* Category Filtering */}
            <div className='mb-8 flex items-center'>
                <Selector options={categories} onSelect={setSelectedCategory} label="Category" />
            </div>

            <Swiper
                slidesPerView={1}
                spaceBetween={30}
                navigation={true}
                breakpoints={{
                    640: { slidesPerView: 1, spaceBetween: 20 },
                    768: { slidesPerView: 2, spaceBetween: 40 },
                    1024: { slidesPerView: 2, spaceBetween: 50 },
                    1180: { slidesPerView: 3, spaceBetween: 50 }
                }}
                modules={[Pagination, Navigation]}
                className="mySwiper"
            >
                {filteredProducts.length > 0 && filteredProducts.map((product, index) => (
                    <SwiperSlide key={index}>
                        <ProductCard product={product} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default TopSellers;