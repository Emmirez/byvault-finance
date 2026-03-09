// controllers/paymentController.js
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';


export const getBTCAddress = async (req, res) => {
  try {
    console.log("Fetching BTC address for user:", req.user.id); // Debug log
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      console.log("User not found:", req.user.id);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log("User found, current btcDepositAddress:", user.btcDepositAddress);

    // If user doesn't have a BTC address, assign default
    if (!user.btcDepositAddress) {
      console.log("Assigning default BTC address to user");
      user.btcDepositAddress = 'bc1qyf5ae8kzuxh8y7axd9yxnmmyh3q3g4eqs3j9ag';
      await user.save();
      console.log("Address saved successfully");
    }

    res.json({
      success: true,
      address: user.btcDepositAddress
    });
  } catch (error) {
    console.error('Error getting BTC address:', error);
    console.error('Error stack:', error.stack); // Full error details
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


export const uploadPaymentProof = async (req, res) => {
  try {
    const { walletAddress, amount } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let imageUrl = '';
    let imagePublicId = '';

    try {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'payment-proofs',
        resource_type: 'image',
        transformation: [
          { width: 1000, crop: 'limit' },
          { quality: 'auto' }
        ]
      });
      
      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
      
      // Delete local file after uploading to Cloudinary
      fs.unlinkSync(req.file.path);
      
    } catch (cloudinaryError) {
      console.error('Cloudinary upload failed:', cloudinaryError);
      // Fallback to local storage
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const currentBalance = user.balanceBTC || 0;

    const transaction = new Transaction({
      user: user._id,
      type: 'deposit',
      currency: 'btc',
      amount: amount || 0,
      status: 'pending',
      balanceBefore: currentBalance,
      balanceAfter: currentBalance,
      description: 'BTC deposit pending verification',
      metadata: {
        walletAddress,
        paymentProof: imageUrl,
        paymentProofId: imagePublicId,
        confirmations: 0,
        uploadedAt: new Date()
      }
    });

    await transaction.save();

    res.status(201).json({
      success: true,
      message: 'Payment proof uploaded successfully',
      transaction: {
        id: transaction._id,
        status: transaction.status,
        amount: transaction.amount,
        createdAt: transaction.createdAt
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


export const getDepositHistory = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user.id,
      type: 'deposit',
      currency: 'btc'
    }).sort({ createdAt: -1 });

    const formattedHistory = transactions.map(tx => ({
      id: tx._id,
      amount: tx.amount,
      status: tx.status,
      date: tx.createdAt,
      proof: tx.metadata?.paymentProof,
      rejectionReason: tx.metadata?.rejectionReason
    }));

    res.json({
      success: true,
      history: formattedHistory
    });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ message: 'Server error' });
  }
};