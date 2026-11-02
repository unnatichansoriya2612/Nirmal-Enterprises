import { useState } from "react";
import { Navigate } from "react-router-dom";
import "./CustomerSettings.css";

function CustomerSettings({ customerUser, setCustomerUser }) {
  const [activeTab, setActiveTab] = useState("profile");

  // Local state for forms
  const [formData, setFormData] = useState({
    name: customerUser?.name || "",
    email: customerUser?.email || "",
    phone: customerUser?.phone || customerUser?.mobile || "",
    address: customerUser?.address || "",
    currentPassword: "",
    newPassword: "",
  });

  const [message, setMessage] = useState("");

  if (!customerUser) {
    return <Navigate to="/login" />;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (setCustomerUser) {
      setCustomerUser({ ...customerUser, ...formData });
    }
    setMessage("Settings saved successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="customer-settings-page">
      <aside className="settings-sidebar">
        <button 
          className={`settings-tab ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          My Profile
        </button>
        <button 
          className={`settings-tab ${activeTab === "security" ? "active" : ""}`}
          onClick={() => setActiveTab("security")}
        >
          Password & Security
        </button>
      </aside>

      <main className="settings-content">
        {activeTab === "profile" && (
          <form onSubmit={handleSave}>
            <h2>Personal Information</h2>
            <p className="settings-desc">Update your personal details and delivery address.</p>
            
            <div className="settings-form-group">
              <label>Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            
            <div className="settings-form-group">
              <label>Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="settings-form-group">
              <label>Phone Number</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
            </div>

            <div className="settings-form-group">
              <label>Delivery Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} required />
            </div>

            {message && <p style={{ color: '#2b8a3e', fontSize: '14px', fontWeight: 'bold' }}>{message}</p>}

            <div className="settings-actions">
              <button type="submit" className="customer-primary-button save-btn">Save Changes</button>
            </div>
          </form>
        )}

        {activeTab === "security" && (
          <form onSubmit={handleSave}>
            <h2>Change Password</h2>
            <p className="settings-desc">Keep your account secure by using a strong password.</p>
            
            <div className="settings-form-group">
              <label>Current Password</label>
              <input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleChange} />
            </div>
            
            <div className="settings-form-group">
              <label>New Password</label>
              <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} />
            </div>

            {message && <p style={{ color: '#2b8a3e', fontSize: '14px', fontWeight: 'bold' }}>{message}</p>}

            <div className="settings-actions">
              <button type="submit" className="customer-primary-button save-btn">Update Password</button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}

export default CustomerSettings;
