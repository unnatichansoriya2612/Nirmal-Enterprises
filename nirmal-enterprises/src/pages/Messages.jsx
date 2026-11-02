import { useState } from "react";

function Messages({ conversations, setConversations }) {
  const [selectedConversationId, setSelectedConversationId] = useState(
    conversations.length > 0 ? conversations[0].id : null
  );

  const [messageText, setMessageText] = useState("");

  const selectedConversation = conversations.find(
    (conversation) => conversation.id === selectedConversationId
  );

  const handleSelectConversation = (id) => {
    setSelectedConversationId(id);

    setConversations((previousConversations) =>
      previousConversations.map((conversation) =>
        conversation.id === id
          ? {
              ...conversation,
              unread: false,
            }
          : conversation
      )
    );
  };

  const handleSendMessage = () => {
    if (messageText.trim() === "") {
      return;
    }

    setConversations((previousConversations) =>
      previousConversations.map((conversation) => {
        if (conversation.id !== selectedConversationId) {
          return conversation;
        }

        return {
          ...conversation,
          messages: [
            ...conversation.messages,
            {
              id: crypto.randomUUID(),
              sender: "owner",
              text: messageText.trim(),
            },
          ],
        };
      })
    );

    setMessageText("");
  };

  return (
    <div className="admin-page">
      <section className="page-heading">
        <div>
          <p className="eyebrow">CUSTOMER SUPPORT</p>

          <h2>Messages</h2>

          <p>
            Communicate directly with customers from
            Nirmal Enterprises.
          </p>
        </div>
      </section>

      <section className="messages-layout">
        <aside className="conversation-list">
          <div className="messages-panel-heading">
            <strong>Conversations</strong>
          </div>

          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              className={`conversation-item ${
                selectedConversationId ===
                conversation.id
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                handleSelectConversation(
                  conversation.id
                )
              }
            >
              <div className="conversation-avatar">
                {conversation.customerName.charAt(0)}
              </div>

              <div className="conversation-info">
                <strong>
                  {conversation.customerName}
                </strong>

                <span>
                  {conversation.customerMobile}
                </span>
              </div>

              {conversation.unread && (
                <span className="unread-dot"></span>
              )}
            </button>
          ))}
        </aside>

        <div className="chat-panel">
          {selectedConversation ? (
            <>
              <div className="chat-header">
                <div>
                  <strong>
                    {selectedConversation.customerName}
                  </strong>

                  <span>
                    {selectedConversation.customerMobile}
                  </span>
                </div>
              </div>

              <div className="chat-messages">
                {selectedConversation.messages.map(
                  (message) => (
                    <div
                      key={message.id}
                      className={`chat-message ${
                        message.sender === "owner"
                          ? "owner-message"
                          : "customer-message"
                      }`}
                    >
                      <p>{message.text}</p>
                    </div>
                  )
                )}
              </div>

              <div className="chat-input-area">
                <input
                  type="text"
                  placeholder="Type your reply..."
                  value={messageText}
                  onChange={(e) =>
                    setMessageText(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage();
                    }
                  }}
                />

                <button
                  className="primary-button"
                  onClick={handleSendMessage}
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <h3>Select a conversation</h3>

              <p>
                Choose a customer conversation to
                start messaging.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Messages;