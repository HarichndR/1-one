//deleteuserbyemail, getall feedbacks last 20 days, number of registred users, by catgory, patch requirest for 
const User = require('../scheema/user');
const Product = require('../scheema/product');
const FeedBack = require('../scheema/fedaback');
const express = require('express');
const router = express.Router();

// Get dashboard statistics
router.get('/dashboard-stats', async (req, res) => {
    try {
        const users = await User.find();
        const products = await Product.find();
        const feedbacks = await FeedBack.find();
        
        const stats = {
            totalUsers: users.length,
            totalFarmers: users.filter(user => user.role === 'Farmer').length,
            totalBuyers: users.filter(user => user.role === 'Buyer').length,
            totalProducts: products.length,
            totalFeedbacks: feedbacks.length,
            unreadFeedbacks: feedbacks.filter(fb => !fb.read).length,
            recentUsers: users.slice(-5).map(user => ({
                name: user.fullName,
                email: user.email,
                role: user.role,
                joinedAt: user.createdAt
            }))
        };

        res.status(200).json(stats);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching dashboard stats', error: err.message });
    }
});

// Get all users with pagination
router.get('/users', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        
        const query = search 
            ? { 
                $or: [
                    { fullName: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            }
            : {};

        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await User.countDocuments(query);

        res.status(200).json({
            users,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users', error: err.message });
    }
});

// Delete user by email
router.delete('/removeuserByEmail', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role === 'Farmer') {
            await Product.deleteMany({ createdBy: user._id });
        }
        
        await User.deleteOne({ _id: user._id });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting user', error: err.message });
    }
});

// Get all feedbacks with pagination
router.get('/feedbacks', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const read = req.query.read === 'true';
        
        const query = { read };
        const feedbacks = await FeedBack.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await FeedBack.countDocuments(query);

        res.status(200).json({
            feedbacks,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching feedbacks', error: err.message });
    }
});

// Mark feedback as read
router.patch('/markAsReaded', async (req, res) => {
    try {
      const { id } = req.body;
  
      if (!id) {
            return res.status(400).json({ message: "ID is required" });
      }
  
      const updatedFeedback = await FeedBack.findByIdAndUpdate(
            id,
        { $set: { read: true } },
            { new: true }
      );
  
      if (!updatedFeedback) {
            return res.status(404).json({ message: "Feedback not found" });
        }

        res.status(200).json({ 
            message: "Feedback marked as read", 
            feedback: updatedFeedback 
        });
    } catch (err) {
        res.status(500).json({ message: 'Error updating feedback', error: err.message });
    }
});

// Get all products with pagination
router.get('/products', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        
        const query = search 
            ? { 
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ]
            }
            : {};

        const products = await Product.find(query)
            .populate('createdBy', 'fullName email')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Product.countDocuments(query);

        res.status(200).json({
            products,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching products', error: err.message });
    }
});
router.get('/unread-feedbacks', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const feedbacks = await FeedBack.find({ read: false })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await FeedBack.countDocuments({ read: false });

        res.status(200).json({
            feedbacks,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching unread feedbacks', error: err.message });
    }
});

// Get all read feedbacks with pagination
router.get('/read-feedbacks', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const feedbacks = await FeedBack.find({ read: true })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await FeedBack.countDocuments({ read: true });

        res.status(200).json({
            feedbacks,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching read feedbacks', error: err.message });
    }
  });
  
module.exports=router;