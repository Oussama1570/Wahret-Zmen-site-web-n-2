const mongoose = require('mongoose');
const express = require('express');
const Order = require('../orders/order.model');
const Product = require('../products/product.model');
const User = require('../users/user.model'); // ✅ Import User model

const router = express.Router();

// Function to calculate admin stats
router.get("/", async (req, res) => {
    try {
        // 1. Total number of orders
        const totalOrders = await Order.countDocuments();

        // 2. Total sales (sum of all totalPrice from orders)
        const totalSales = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: "$totalPrice" },
                }
            }
        ]);

        // 3. Total number of users
        const totalUsers = await User.countDocuments(); // ✅ Count total users

        // 4. Trending products statistics
        const trendingProductsCount = await Product.aggregate([
            { $match: { trending: true } },
            { $count: "trendingProductsCount" }
        ]);
        const trendingProducts = trendingProductsCount.length > 0
            ? trendingProductsCount[0].trendingProductsCount
            : 0;

        // 5. Total number of products
        const totalProducts = await Product.countDocuments();

        // 6. Monthly sales (group by month and sum total sales for each month)
        const monthlySales = await Order.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    totalSales: { $sum: "$totalPrice" },
                    totalOrders: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // 7. Send the response with all statistics
        res.status(200).json({
            totalOrders,
            totalSales: totalSales[0]?.totalSales || 0,
            trendingProducts,
            totalProducts,
            totalUsers, // ✅ Include in response
            monthlySales
        });

    } catch (error) {
        console.error("Error fetching admin stats:", error);
        res.status(500).json({ message: "Failed to fetch admin stats" });
    }
});

module.exports = router;
