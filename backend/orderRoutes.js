import express from 'express';
import Order from '../models/Order.js';
import MenuItem from '../models/MenuItem.js';
import Vendor from '../models/Vendor.js';
import { authenticate, authorizeVendor, authorizeStudent } from '../middleware/auth.js';

const router = express.Router();

// Create new order
router.post('/', authenticate, authorizeStudent, async (req, res) => {
  try {
    const { vendorId, items, specialInstructions } = req.body;
    
    if (!vendorId || !items || items.length === 0) {
      return res.status(400).json({ message: 'Vendor ID and at least one item are required' });
    }
    
    // Check if vendor exists and is open
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    
    if (!vendor.isOpen) {
      return res.status(400).json({ message: 'This vendor is currently closed' });
    }
    
    // Validate and build order items
    const orderItems = [];
    let totalAmount = 0;
    
    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      
      if (!menuItem) {
        return res.status(404).json({ message: `Menu item with ID ${item.menuItemId} not found` });
      }
      
      if (!menuItem.isAvailable) {
        return res.status(400).json({ message: `${menuItem.name} is currently unavailable` });
      }
      
      const quantity = parseInt(item.quantity);
      if (isNaN(quantity) || quantity < 1) {
        return res.status(400).json({ message: 'Invalid quantity' });
      }
      
      const subtotal = menuItem.price * quantity;
      totalAmount += subtotal;
      
      orderItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity,
        subtotal
      });
    }
    
    // Create the order
    const order = new Order({
      user: req.user._id,
      vendor: vendor._id,
      items: orderItems,
      totalAmount,
      specialInstructions,
      status: 'pending',
      paymentStatus: 'pending'
    });
    
    await order.save();
    
    res.status(201).json({
      message: 'Order created successfully',
      order: {
        id: order._id,
        totalAmount: order.totalAmount,
        status: order.status,
        items: order.items
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get student's orders
router.get('/my-orders', authenticate, authorizeStudent, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('vendor', 'name location')
      .populate('items.menuItem', 'name price');
    
    res.json(orders);
  } catch (error) {
    console.error('Get student orders error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get vendor's orders
router.get('/vendor-orders', authenticate, authorizeVendor, async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user._id });
    
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor profile not found' });
    }
    
    const { status } = req.query;
    const filter = { vendor: vendor._id };
    
    // Add status filter if provided
    if (status && ['pending', 'preparing', 'ready', 'shipped', 'completed', 'cancelled'].includes(status)) {
      filter.status = status;
    }
    
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .populate('user', 'name email phone')
      .populate('items.menuItem', 'name price');
    
    res.json(orders);
  } catch (error) {
    console.error('Get vendor orders error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get order by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('vendor', 'name location contactPhone')
      .populate('user', 'name email phone')
      .populate('items.menuItem', 'name price image');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user is authorized to view this order
    const isVendor = req.user.role === 'vendor';
    const isAdmin = req.user.role === 'admin';
    const isOrderUser = req.user._id.toString() === order.user._id.toString();
    const isOrderVendor = isVendor && 
                        (await Vendor.findOne({ user: req.user._id }))?._id.toString() === 
                        order.vendor._id.toString();
    
    if (!isOrderUser && !isOrderVendor && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update order status (vendor only)
router.patch('/update-status/:id', authenticate, authorizeVendor, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['pending', 'preparing', 'ready', 'shipped', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Valid status is required' });
    }
    
    const vendor = await Vendor.findOne({ user: req.user._id });
    
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor profile not found' });
    }
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Verify that the order belongs to this vendor
    if (order.vendor.toString() !== vendor._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }
    
    order.status = status;
    await order.save();
    
    res.json({
      message: 'Order status updated successfully',
      status: order.status
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Cancel order (student only)
router.patch('/cancel/:id', authenticate, authorizeStudent, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Verify that the order belongs to this user
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }
    
    // Only allow cancellation if order is still pending
    if (order.status !== 'pending') {
      return res.status(400).json({ 
        message: 'Cannot cancel order. Order is already being processed'
      });
    }
    
    order.status = 'cancelled';
    await order.save();
    
    res.json({
      message: 'Order cancelled successfully',
      status: order.status
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;