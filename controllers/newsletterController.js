const Newsletter = require('../models/Newsletter');
const { validationResult } = require('express-validator');

// Subscribe to newsletter
exports.subscribe = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email format' 
      });
    }

    const { email } = req.body;

    // Check if already subscribed
    const existingSubscriber = await Newsletter.findOne({ email });
    if (existingSubscriber) {
      return res.status(409).json({ 
        success: false, 
        message: 'Email already subscribed' 
      });
    }

    // Create new subscriber
    const subscriber = new Newsletter({ email });
    await subscriber.save();

    res.status(201).json({ 
      success: true, 
      message: 'Successfully subscribed to newsletter!' 
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Get all subscribers (admin only)
exports.getSubscribers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const subscribers = await Newsletter.find({ isActive: true })
      .sort({ subscribedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Newsletter.countDocuments({ isActive: true });

    res.status(200).json({
      success: true,
      count: subscribers.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: subscribers
    });
  } catch (error) {
    console.error('Get subscribers error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Delete subscriber
exports.deleteSubscriber = async (req, res) => {
  try {
    const { id } = req.params;

    const subscriber = await Newsletter.findByIdAndDelete(id);
    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Subscriber not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Subscriber deleted successfully'
    });
  } catch (error) {
    console.error('Delete subscriber error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Bulk delete subscribers
exports.bulkDeleteSubscribers = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subscriber IDs'
      });
    }

    const result = await Newsletter.deleteMany({ _id: { $in: ids } });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} subscribers deleted successfully`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Bulk delete error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Get newsletter stats
exports.getStats = async (req, res) => {
  try {
    const total = await Newsletter.countDocuments({ isActive: true });
    
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    const newThisMonth = await Newsletter.countDocuments({
      isActive: true,
      subscribedAt: { $gte: oneMonthAgo }
    });

    // Get subscription trends for last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyStats = await Newsletter.aggregate([
      {
        $match: {
          isActive: true,
          subscribedAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$subscribedAt' },
            month: { $month: '$subscribedAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        newThisMonth,
        monthlyStats
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};
