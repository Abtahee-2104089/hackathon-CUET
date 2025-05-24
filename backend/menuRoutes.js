import express from 'express';
import MenuItem from '../models/MenuItem.js';
import Vendor from '../models/Vendor.js';
import { authenticate, authorizeVendor } from '../middleware/auth.js';

const router = express.Router();

// Get all menu items for a vendor
router.get('/vendor/:vendorId', async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ 
      vendor: req.params.vendorId,
      isAvailable: true
    }).sort({ category: 1, name: 1 });
    
    res.json(menuItems);
  } catch (error) {
    console.error('Get menu items error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all menu items for the logged-in vendor
router.get('/my-menu', authenticate, authorizeVendor, async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user._id });
    
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor profile not found' });
    }
    
    const menuItems = await MenuItem.find({ vendor: vendor._id })
      .sort({ category: 1, name: 1 });
    
    res.json(menuItems);
  } catch (error) {
    console.error('Get vendor menu error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add new menu item
router.post('/', authenticate, authorizeVendor, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      image,
      category,
      isAvailable,
      preparationTime,
      tags,
      isVeg,
      isSpicy
    } = req.body;
    
    const vendor = await Vendor.findOne({ user: req.user._id });
    
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor profile not found' });
    }
    
    const menuItem = new MenuItem({
      vendor: vendor._id,
      name,
      description,
      price,
      image,
      category,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      preparationTime,
      tags,
      isVeg,
      isSpicy
    });
    
    await menuItem.save();
    
    res.status(201).json({
      message: 'Menu item added successfully',
      menuItem
    });
  } catch (error) {
    console.error('Add menu item error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update menu item
router.put('/:id', authenticate, authorizeVendor, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      image,
      category,
      isAvailable,
      preparationTime,
      tags,
      isVeg,
      isSpicy
    } = req.body;
    
    const vendor = await Vendor.findOne({ user: req.user._id });
    
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor profile not found' });
    }
    
    let menuItem = await MenuItem.findById(req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    // Verify that the menu item belongs to this vendor
    if (menuItem.vendor.toString() !== vendor._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this menu item' });
    }
    
    // Update fields
    if (name) menuItem.name = name;
    if (description !== undefined) menuItem.description = description;
    if (price !== undefined) menuItem.price = price;
    if (image) menuItem.image = image;
    if (category) menuItem.category = category;
    if (isAvailable !== undefined) menuItem.isAvailable = isAvailable;
    if (preparationTime !== undefined) menuItem.preparationTime = preparationTime;
    if (tags) menuItem.tags = tags;
    if (isVeg !== undefined) menuItem.isVeg = isVeg;
    if (isSpicy !== undefined) menuItem.isSpicy = isSpicy;
    
    await menuItem.save();
    
    res.json({
      message: 'Menu item updated successfully',
      menuItem
    });
  } catch (error) {
    console.error('Update menu item error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete menu item
router.delete('/:id', authenticate, authorizeVendor, async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user._id });
    
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor profile not found' });
    }
    
    const menuItem = await MenuItem.findById(req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    // Verify that the menu item belongs to this vendor
    if (menuItem.vendor.toString() !== vendor._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this menu item' });
    }
    
    await MenuItem.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('Delete menu item error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Toggle menu item availability
router.patch('/toggle-availability/:id', authenticate, authorizeVendor, async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user._id });
    
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor profile not found' });
    }
    
    const menuItem = await MenuItem.findById(req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    // Verify that the menu item belongs to this vendor
    if (menuItem.vendor.toString() !== vendor._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this menu item' });
    }
    
    menuItem.isAvailable = !menuItem.isAvailable;
    await menuItem.save();
    
    res.json({
      message: `Menu item is now ${menuItem.isAvailable ? 'available' : 'unavailable'}`,
      isAvailable: menuItem.isAvailable
    });
  } catch (error) {
    console.error('Toggle menu item availability error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;