// ChatPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:8001');

const Chat = () => {
  const { recipientId } = useParams();
  const [chat, setChat] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const startChat = async () => {
      const response = await axios.post(`http://localhost:8001/chat/start-chat/${recipientId}`);
      setChat(response.data);
      setMessages(response.data.messages);
      socket.emit('joinRoom', recipientId);
    };
    startChat();
  }, [recipientId]);

  useEffect(() => {
    socket.on('newMessage', (data) => {
      if (data.chatId === chat._id) {
        setMessages((prevMessages) => [...prevMessages, data.message]);
      }
    });
  }, [chat]);

  const sendMessage = async () => {
    const response = await axios.post(`http://localhost:8001/chat/send-message/${chat._id}`, { text: message });
    setMessages((prevMessages) => [...prevMessages, response.data]);
    setMessage('');
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender.name}</strong>: {msg.text}
          </div>
        ))}
      </div>
      <input value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
