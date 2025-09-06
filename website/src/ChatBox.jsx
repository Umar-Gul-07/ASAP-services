import React, { useEffect, useState } from 'react';

const ChatBox = ({ userId, userType }) => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Determine contact type
  const contactType = userType === 'SELLER' ? 'USER' : 'SELLER';

  // Fetch contacts
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await fetch('https://asap-nine-pi.vercel.app/users');
        const data = await res.json();
        const filteredContacts = data.filter(user => user.userType === contactType);
        setContacts(filteredContacts);
      } catch (err) {
        console.error('Error fetching contacts:', err);
      }
    };
    fetchContacts();
  }, [contactType]);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedContact || !userId) return;

      try {
        const res = await fetch(
          `https://asap-nine-pi.vercel.app/messages?userId=${userId}&sellerId=${userType === 'SELLER' ? selectedContact._id : selectedContact._id}`
        );
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };
    fetchMessages();
  }, [selectedContact, userId, userType]);

  // Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !userId || !selectedContact) return;

    try {
      const res = await fetch('https://asap-nine-pi.vercel.app/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: userId,
          receiver: selectedContact._id,
          message: newMessage.trim(),
        }),
      });

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
      {/* Contacts List */}
      <div className="w-full md:w-1/3 lg:w-1/4 bg-amber-900 text-amber-50 p-4 overflow-auto shadow-md">
        <h2 className="text-xl font-bold mb-4">
          {contactType === 'USER' ? 'Buyers' : 'Sellers'}
        </h2>
        {contacts.map(contact => (
          <div
            key={contact._id}
            onClick={() => setSelectedContact(contact)}
            className={`cursor-pointer p-3 rounded mb-2 transition-colors ${
              selectedContact?._id === contact._id
                ? 'bg-amber-700 font-semibold'
                : 'hover:bg-amber-800'
            }`}
          >
            {contact.Name}
          </div>
        ))}
      </div>

      {/* Chat Box */}
      <div className="flex-1 p-6 flex flex-col">
        <h2 className="text-2xl font-semibold mb-4 text-amber-900">
          Chat with{' '}
          <span className="font-bold">
            {selectedContact ? selectedContact.Name : 'No Contact Selected'}
          </span>
        </h2>

        <div className="flex-1 overflow-y-auto border rounded-lg p-4 mb-4 bg-amber-100 shadow-inner">
          {messages.map((msg, index) => {
            const isMe = msg.sender === userId;
            return (
              <div
                key={index}
                className={`mb-2 p-3 rounded-lg max-w-md break-words ${
                  isMe
                    ? 'bg-amber-700 self-end text-amber-50'
                    : 'bg-amber-200 self-start text-amber-900'
                }`}
              >
                {msg.message}
              </div>
            );
          })}
        </div>

        {/* Input */}
        {selectedContact && (
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

export default ChatBox;
