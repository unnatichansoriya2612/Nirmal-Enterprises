import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function CustomerLogin({ setCustomerUser }) {
  const navigate = useNavigate();

  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (event) => {
    event.preventDefault();

    if (!/^\d{10}$/.test(mobile.trim())) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!password) {
      alert("Please enter your password.");
      return;
    }

    /*
      Frontend account state only.

      Real authentication will be connected
      to the Express + database backend later.
    */

    setCustomerUser({
      mobile: mobile.trim(),
      loggedIn: true,
    });

    navigate("/");
  };

  return (
    <div className="customer-auth-page">
      <div className="customer-auth-card">
        <p className="customer-eyebrow">
          CUSTOMER ACCOUNT
        </p>

        <h1>Welcome back</h1>

        <p className="customer-auth-description">
          Login to manage your orders and service
          bookings.
        </p>

        <form onSubmit={handleLogin}>
          <div className="customer-form-group">
            <label>Mobile Number</label>

            <input
              className="customer-form-input"
              value={mobile}
              onChange={(e) =>
                setMobile(e.target.value)
              }
              placeholder="10-digit mobile number"
              maxLength={10}
            />
          </div>

          <div
            className="customer-form-group"
            style={{ marginTop: "16px" }}
          >
            <label>Password</label>

            <input
              type="password"
              className="customer-form-input"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            className="customer-primary-button customer-auth-submit"
          >
            Login
          </button>
        </form>

        <p className="customer-auth-switch">
          Don't have an account?{" "}
          <Link to="/register">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default CustomerLogin;