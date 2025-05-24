import express from 'express';
import SSLCommerzPayment from 'sslcommerz-lts';
import Order from '../models/Order.js';
import { authenticate, authorizeStudent } from '../middleware/auth.js';

const router = express.Router();

// Initialize SSLCommerz
const store_id = process.env.SSLCOMMERZ_STORE_ID;
const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD;
const is_live = process.env.SSLCOMMERZ_IS_LIVE === 'true';

// Process payment
router.post('/process/:orderId', authenticate, authorizeStudent, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('user', 'name email phone')
      .populate('vendor', 'name');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Verify that the order belongs to this user
    if (order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to pay for this order' });
    }
    
    // Check if order is already paid
    if (order.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'This order is already paid' });
    }
    
    // Create unique transaction ID
    const transactionId = `SCORDER-${order._id}-${Date.now()}`;
    
    // SSLCommerz data
    const data = {
      total_amount: order.totalAmount,
      currency: 'BDT',
      tran_id: transactionId,
      success_url: `${process.env.CLIENT_URL}/payment/success/${order._id}`,
      fail_url: `${process.env.CLIENT_URL}/payment/fail/${order._id}`,
      cancel_url: `${process.env.CLIENT_URL}/payment/cancel/${order._id}`,
      shipping_method: 'NO',
      product_name: `Order from ${order.vendor.name}`,
      product_category: 'Food',
      product_profile: 'general',
      cus_name: order.user.name,
      cus_email: order.user.email,
      cus_add1: 'CUET Campus',
      cus_city: 'Chittagong',
      cus_country: 'Bangladesh',
      cus_phone: order.user.phone || '01700000000',
      value_a: order._id.toString(),
    };
    
    // Initialize payment
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const apiResponse = await sslcz.init(data);
    
    // Store transaction ID in order
    order.paymentId = transactionId;
    await order.save();
    
    // Check if payment initialization was successful
    if (apiResponse?.GatewayPageURL) {
      res.json({ url: apiResponse.GatewayPageURL });
    } else {
      res.status(400).json({
        message: 'Payment initialization failed',
        error: apiResponse
      });
    }
  } catch (error) {
    console.error('Payment process error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Payment success callback
router.post('/success', async (req, res) => {
  try {
    const { val_id, tran_id, value_a } = req.body;
    
    if (!val_id || !tran_id || !value_a) {
      return res.status(400).json({ message: 'Invalid payment data' });
    }
    
    // Validate payment with SSLCommerz
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const validation = await sslcz.validate({ val_id });
    
    if (validation.status !== 'VALID') {
      return res.status(400).json({ message: 'Payment validation failed' });
    }
    
    // Update order payment status
    const order = await Order.findById(value_a);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    order.paymentStatus = 'paid';
    await order.save();
    
    res.json({
      message: 'Payment successful',
      orderId: order._id
    });
  } catch (error) {
    console.error('Payment success callback error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Payment fail callback
router.post('/fail', async (req, res) => {
  try {
    const { tran_id, value_a } = req.body;
    
    if (!tran_id || !value_a) {
      return res.status(400).json({ message: 'Invalid payment data' });
    }
    
    // Update order payment status
    const order = await Order.findById(value_a);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    order.paymentStatus = 'failed';
    await order.save();
    
    res.json({
      message: 'Payment failed',
      orderId: order._id
    });
  } catch (error) {
    console.error('Payment fail callback error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Payment cancel callback
router.post('/cancel', async (req, res) => {
  try {
    const { tran_id, value_a } = req.body;
    
    if (!tran_id || !value_a) {
      return res.status(400).json({ message: 'Invalid payment data' });
    }
    
    res.json({
      message: 'Payment cancelled',
      orderId: value_a
    });
  } catch (error) {
    console.error('Payment cancel callback error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;