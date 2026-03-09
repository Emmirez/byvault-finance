// src/models/ChatSession.js
import mongoose from 'mongoose';

const chatSessionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    default: 'Guest'
  },
  userEmail: String,
  socketId: String,
  status: {
    type: String,
    enum: ['active', 'ended', 'waiting'],
    default: 'active'
  },
  lastMessage: String,
  lastActivity: {
    type: Date,
    default: Date.now
  },
  startedAt: Date,
  endedAt: Date,
  metadata: {
    ip: String,
    userAgent: String,
    page: String
  }
}, { timestamps: true });

export default mongoose.model('ChatSession', chatSessionSchema);