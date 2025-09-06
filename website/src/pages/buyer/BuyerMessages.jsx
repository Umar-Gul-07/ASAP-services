// BuyerMessages.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BuyerMessages = () => {
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const buyerId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  // On mount, load selected seller from localStorage
  useEffect(() => {
    const sellerId = localStorage.getItem('sellerId');
    console.log(sellerId)
    console.log(buyerId)
    if (!sellerId || !buyerId) return;

    const fetchSellerMessages = async () => {
      try {
        // Fetch seller info
        const sellerRes = await axios.get(
          `https://asap-nine-pi.vercel.app/getseller/${sellerId}`,
          { headers: { Authorization: token } }
        );
        setSelectedSeller(sellerRes.data);
console.log(sellerRes)
        // Fetch messages between buyer and this seller
        const msgRes = await axios.get(
          `https://asap-nine-pi.vercel.app/messages/${buyerId}/${sellerId}`,
          { headers: { Authorization: token } }
        );
        setMessages(msgRes.data || []);
      
        console.log('Loaded messages for seller:', sellerRes.data, msgRes.data);
      } catch (err) {
        console.error('Error loading messages:', err);
      }
    };

    fetchSellerMessages();
  }, [buyerId, token]);

  // Send new message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !buyerId || !selectedSeller?._id) return;

    try {
      const res = await axios.post(
        'https://asap-nine-pi.vercel.app/messages',
        {
          sender: buyerId,
          receiver: selectedSeller._id,
          message: newMessage.trim(),
        },
        { headers: { Authorization: token } }
      );

      if (res.status === 201) {
        setMessages(prev => [...prev, res.data]);
        setNewMessage('');
      }
      console.log('Message sent:', res.data);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-amber-50">
      {/* Chat Box */}
      <div className="flex-1 p-6 flex flex-col">
        <h2 className="text-2xl font-semibold mb-4 text-amber-900">
          Chat with{' '}
          <span className="font-bold">
            {selectedSeller ? selectedSeller.Name || selectedSeller.email : 'No Seller Selected'}
          </span>
        </h2>

        <div className="flex-1 overflow-y-auto border rounded-lg p-4 mb-4 bg-amber-100 shadow-inner">
          {messages.map((msg, index) => {
            const isBuyer = msg.sender === buyerId;
            return (
              <div
                key={index}
                className={`mb-2 p-3 rounded-lg max-w-md break-words ${
                  isBuyer
                    ? 'bg-amber-700 self-end text-amber-50'
                    : 'bg-amber-200 self-start text-amber-900'
                }`}
              >
                {msg.message}
              </div>
            );
          })}
          {messages.length === 0 && selectedSeller && (
            <p className="text-center text-gray-500 mt-4">No messages yet</p>
          )}
        </div>

        {selectedSeller && (
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 border border-amber-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="Type your message..."
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
            />
            <button
              onClick={handleSendMessage}
              className="bg-amber-700 text-amber-50 px-6 py-3 rounded-lg hover:bg-amber-800 transition-colors font-semibold"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerMessages;
