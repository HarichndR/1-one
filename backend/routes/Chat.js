const express = require('express');
const router = express.Router();
const Chat = require('../scheema/Chat');
const  checkForAuthenticationCookie  = require('../midelwear/autho');
const { io } = require('../server'); // Import Socket.io instance

// Start a new chat or retrieve existing one
router.post('/start-chat/:recipientId', checkForAuthenticationCookie, async (req, res) => {
  const { recipientId } = req.params;
  const userId = req.user._id;

  try {
    let chat = await Chat.findOne({ users: { $all: [userId, recipientId] } });

    if (!chat) {
      chat = new Chat({ users: [userId, recipientId], messages: [] });
      await chat.save();
    }

    res.json(chat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Send a message
router.post('/send-message/:chatId', checkForAuthenticationCookie, async (req, res) => {
  const { chatId } = req.params;
  const { text } = req.body;
  const senderId = req.user._id;

  try {
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    const newMessage = { sender: senderId, text, unread: true };
    chat.messages.push(newMessage);
    await chat.save();

    // Notify recipient
    const recipientId = chat.users.find(user => user.toString() !== senderId.toString());
    io.to(recipientId.toString()).emit('newMessage', { chatId, message: newMessage });

    res.json(newMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get chat history
router.get('/chat-history/:chatId', checkForAuthenticationCookie, async (req, res) => {
  const { chatId } = req.params;

  try {
    const chat = await Chat.findById(chatId).populate('users messages.sender');

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    res.json(chat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/hi", checkForAuthenticationCookie,(req , res)=>{
  res.json('hi');
})

module.exports = router;
