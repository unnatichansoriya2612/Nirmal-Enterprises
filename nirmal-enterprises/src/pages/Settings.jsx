function Settings() {
  return (
    <div className="admin-page">
      <section className="page-heading">
        <div>
          <p className="eyebrow">SYSTEM SETTINGS</p>
          <h2>Settings</h2>
          <p>
            Manage Nirmal Enterprises application settings.
          </p>
        </div>
      </section>

      <section className="settings-grid">
        <div className="settings-card">
          <h3>Business Information</h3>

          <div className="settings-row">
            <span>Business Name</span>
            <strong>Nirmal Enterprises</strong>
          </div>

          <div className="settings-row">
            <span>Business Type</span>
            <strong>RO Service &amp; Sales</strong>
          </div>

          <div className="settings-row">
            <span>Panel Access</span>
            <strong>Owner / Administrator</strong>
          </div>
        </div>

        <div className="settings-card">
          <h3>Communication</h3>

          <div className="settings-row">
            <span>WhatsApp Updates</span>
            <strong>Coming Later</strong>
          </div>

          <div className="settings-row">
            <span>SMS Updates</span>
            <strong>Coming Later</strong>
          </div>

          <div className="settings-row">
            <span>Customer Messages</span>
            <strong>Enabled</strong>
          </div>
        </div>

        <div className="settings-card">
          <h3>Notifications</h3>

          <div className="settings-row">
            <span>Order Notifications</span>
            <strong>Enabled</strong>
          </div>

          <div className="settings-row">
            <span>Service Notifications</span>
            <strong>Enabled</strong>
          </div>

          <div className="settings-row">
            <span>Low Stock Alerts</span>
            <strong>Enabled</strong>
          </div>
        </div>

        <div className="settings-card">
          <h3>Future Integrations</h3>

          <div className="settings-row">
            <span>Online Payments</span>
            <strong>Coming Later</strong>
          </div>

          <div className="settings-row">
            <span>WhatsApp Automation</span>
            <strong>Coming Later</strong>
          </div>

          <div className="settings-row">
            <span>SMS Automation</span>
            <strong>Coming Later</strong>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Settings;