import React, { useEffect, useState } from 'react';

const SellerMessages = () => {
  const [buyers, setBuyers] = useState([]);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const sellerId = localStorage.getItem("sellerId");

  // Fetch buyers
useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('https://asap-nine-pi.vercel.app/users');
        const data = await res.json();
        const filteredBuyers = data.filter(user => user.userType === 'USER');
        setBuyers(filteredBuyers);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };
    fetchUsers();
  }, []);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedBuyer || !sellerId) return;

      try {
        const res = await fetch(
          `https://asap-nine-pi.vercel.app/messages?userId=${selectedBuyer._id}&sellerId=${sellerId}`
        );
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };
    fetchMessages();
  }, [selectedBuyer]);

  // Send message
const handleSendMessage = async () => {
  if (!newMessage.trim() || !sellerId || !selectedBuyer) {
    console.log('Cannot send: missing data', { newMessage, sellerId, selectedBuyer });
    return;
  }

  try {
    const res = await fetch('https://asap-nine-pi.vercel.app/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender: sellerId,
        receiver: selectedBuyer._id,
        message: newMessage.trim(),
      }),
    });

    console.log('Response status:', res.status);
    const data = await res.json();
    if (res.ok) {
      setMessages(prev => [...prev, data]);
      setNewMessage('');
    } else {
      console.error('Error sending message:', data);
    }
  } catch (err) {
    console.error('Error sending message:', err);
  }
};


  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-amber-50">
      {/* Buyers List */}
      <div className="w-full md:w-1/3 lg:w-1/4 bg-amber-900 text-amber-50 p-4 overflow-auto shadow-md">
        <h2 className="text-xl font-bold mb-4">Buyers</h2>
        {buyers.map(buyer => (
          <div
            key={buyer._id}
            onClick={() => setSelectedBuyer(buyer)}
            className={`cursor-pointer p-3 rounded mb-2 transition-colors ${
              selectedBuyer?._id === buyer._id
                ? 'bg-amber-700 font-semibold'
                : 'hover:bg-amber-800'
            }`}
          >
            {buyer.Name}
          </div>
        ))}
      </div>

      {/* Chat Box */}
      <div className="flex-1 p-6 flex flex-col">
        <h2 className="text-2xl font-semibold mb-4 text-amber-900">
          Chat with{' '}
          <span className="font-bold">
            {selectedBuyer ? selectedBuyer.Name : 'No Contact Selected'}
          </span>
        </h2>

        <div className="flex-1 overflow-y-auto border rounded-lg p-4 mb-4 bg-amber-100 shadow-inner">
          {messages.map((msg, index) => {
            const isUser = msg.sender === selectedBuyer?._id;
            return (
              <div
                key={index}
                className={`mb-2 p-3 rounded-lg max-w-md break-words ${
                  isUser
                    ? 'bg-amber-200 self-start text-amber-900'
                    : 'bg-amber-700 self-end text-amber-50'
                }`}
              >
                {msg.message}
              </div>
            );
          })}
        </div>

        {/* Input */}
        {selectedBuyer && (
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

export default SellerMessages;
