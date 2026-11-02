import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function RegisterCustomer({ setCustomerUser }) {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (event) => {
    event.preventDefault();

    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (!/^\d{10}$/.test(mobile.trim())) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!address.trim()) {
      alert("Please enter your address.");
      return;
    }

    if (password.length < 6) {
      alert(
        "Password must contain at least 6 characters."
      );
      return;
    }

    /*
      Frontend account state only.

      The real customer account will later be
      created through the Express backend with
      secure password hashing.
    */

    setCustomerUser({
      name: name.trim(),
      mobile: mobile.trim(),
      address: address.trim(),
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

        <h1>Create your account</h1>

        <p className="customer-auth-description">
          Create an account to shop products and manage
          your Nirmal Enterprises services.
        </p>

        <form onSubmit={handleRegister}>
          <div className="customer-form-group">
            <label>Full Name</label>

            <input
              className="customer-form-input"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Your full name"
            />
          </div>

          <div
            className="customer-form-group"
            style={{ marginTop: "16px" }}
          >
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
            <label>Address</label>

            <textarea
              className="customer-form-textarea"
              value={address}
              onChange={(e) =>
                setAddress(e.target.value)
              }
              placeholder="Your address"
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
              placeholder="Minimum 6 characters"
            />
          </div>

          <button
            type="submit"
            className="customer-primary-button customer-auth-submit"
          >
            Create Account
          </button>
        </form>

        <p className="customer-auth-switch">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterCustomer;