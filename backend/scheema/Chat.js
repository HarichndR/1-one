const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: 'User' },
  text: String,
  timestamp: { type: Date, default: Date.now },
  unread: { type: Boolean, default: true },
});

const chatSchema = new Schema({
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Two users in each chat
  messages: [messageSchema],
});

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;
