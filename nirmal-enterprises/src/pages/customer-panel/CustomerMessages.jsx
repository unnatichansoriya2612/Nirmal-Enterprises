import { useState } from "react";
import { Link, Navigate } from "react-router-dom";

function CustomerMessages({ customerUser, conversations, setConversations, notifications, setNotifications }) {
  const [messageText, setMessageText] = useState("");

  if (!customerUser) {
    return <Navigate to="/login" />;
  }

  const userPhone = customerUser.mobile || customerUser.phone;
  
  // Find or mock the current conversation
  let conversation = conversations.find(c => c.customerMobile === userPhone);
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    const newMessage = {
      id: "msg-" + Date.now(),
      sender: "customer",
      text: messageText.trim()
    };

    if (conversation) {
      setConversations(conversations.map(c => 
        c.id === conversation.id 
          ? { ...c, messages: [...c.messages, newMessage], unread: true }
          : c
      ));
    } else {
      setConversations([...conversations, {
        id: "conv-" + Date.now(),
        customerName: customerUser.name,
        customerMobile: userPhone,
        unread: true,
        messages: [newMessage]
      }]);
    }

    // Add Admin Notification
    setNotifications([
      {
        id: "notif-" + Date.now(),
        type: "message",
        title: `New Message from ${customerUser.name}`,
        message: messageText.trim(),
        time: "Just now",
        read: false
      },
      ...notifications
    ]);

    setMessageText("");
  };

  return (
    <div className="customer-orders-page" style={{ width: 'min(800px, calc(100% - 40px))', margin: '40px auto 80px' }}>
      <Link to="/" className="customer-back-link">← Back to Home</Link>
      
      <p className="customer-eyebrow">COMMUNICATION</p>
      <h1 style={{ marginBottom: '20px' }}>Support Chat</h1>
      <p style={{ marginBottom: '30px', color: '#526b6d' }}>
        Chat directly with the Nirmal Enterprises support team.
      </p>

      <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '500px' }}>
        
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', background: '#fcfdfd' }}>
          {(!conversation || conversation.messages.length === 0) && (
            <div style={{ textAlign: 'center', color: '#888', marginTop: 'auto', marginBottom: 'auto' }}>
              Send a message to start the conversation!
            </div>
          )}

          {conversation?.messages.map(msg => {
            const isCustomer = msg.sender === 'customer';
            return (
              <div key={msg.id} style={{ 
                alignSelf: isCustomer ? 'flex-end' : 'flex-start',
                background: isCustomer ? '#245b63' : '#e6efee',
                color: isCustomer ? '#fff' : '#1f2933',
                padding: '12px 16px',
                borderRadius: '12px',
                borderBottomRightRadius: isCustomer ? '4px' : '12px',
                borderBottomLeftRadius: !isCustomer ? '4px' : '12px',
                maxWidth: '75%',
                lineHeight: '1.5'
              }}>
                {msg.text}
              </div>
            );
          })}
        </div>

        <form onSubmit={handleSendMessage} style={{ padding: '16px', borderTop: '1px solid #eee', display: 'flex', gap: '10px', background: '#fff' }}>
          <input 
            type="text" 
            placeholder="Type your message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            style={{ flex: 1, padding: '12px 16px', border: '1px solid #dce9e7', borderRadius: '8px', fontSize: '15px' }}
          />
          <button type="submit" className="customer-primary-button" style={{ padding: '0 24px' }}>
            Send
          </button>
        </form>

      </div>
    </div>
  );
}

export default CustomerMessages;
