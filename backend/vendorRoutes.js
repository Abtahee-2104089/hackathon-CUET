import express from 'express';
import Vendor from '../models/Vendor.js';
import { authenticate, authorizeVendor } from '../middleware/auth.js';

const router = express.Router();

// Get all vendors
router.get('/', async (req, res) => {
  try {
    const vendors = await Vendor.find({ isOpen: true }).select('-schedule -contactEmail');
    res.json(vendors);
  } catch (error) {
    console.error('Get vendors error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get vendor by ID
router.get('/:id', async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    
    res.json(vendor);
  } catch (error) {
    console.error('Get vendor error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get vendor profile (for vendor users)
router.get('/profile/me', authenticate, authorizeVendor, async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user._id });
    
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor profile not found' });
    }
    
    res.json(vendor);
  } catch (error) {
    console.error('Get vendor profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update vendor profile
router.put('/profile', authenticate, authorizeVendor, async (req, res) => {
  try {
    const {
      name,
      description,
      location,
      logo,
      contactPhone,
      contactEmail,
      schedule
    } = req.body;
    
    const vendor = await Vendor.findOne({ user: req.user._id });
    
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor profile not found' });
    }
    
    // Update fields
    if (name) vendor.name = name;
    if (description !== undefined) vendor.description = description;
    if (location) vendor.location = location;
    if (logo) vendor.logo = logo;
    if (contactPhone) vendor.contactPhone = contactPhone;
    if (contactEmail) vendor.contactEmail = contactEmail;
    if (schedule) vendor.schedule = schedule;
    
    await vendor.save();
    
    res.json({
      message: 'Vendor profile updated successfully',
      vendor
    });
  } catch (error) {
    console.error('Update vendor profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Toggle vendor availability
router.patch('/toggle-availability', authenticate, authorizeVendor, async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user._id });
    
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor profile not found' });
    }
    
    vendor.isOpen = !vendor.isOpen;
    await vendor.save();
    
    res.json({
      message: `Vendor is now ${vendor.isOpen ? 'open' : 'closed'}`,
      isOpen: vendor.isOpen
    });
  } catch (error) {
    console.error('Toggle availability error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;