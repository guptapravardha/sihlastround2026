import { useState } from "react";
import { Eye, EyeOff, ArrowRight, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
    language: "English",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        mobile: form.mobile.trim(),
        language: form.language,
      });
      navigate("/onboarding");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="register-page">

      {/* Left Information */}
      <div className="register-info">

        <div className="register-brand">
          <span>🌾</span>
          <div>
            <h2>Gram-Pragati AI</h2>
            <p>Business Partner for Rural India</p>
          </div>
        </div>

        <div className="register-content">
          <h1>
            Start your<br />
            business journey.
          </h1>

          <p>
            Get practical AI-powered guidance to discover
            business opportunities, plan your finances and
            grow your rural business.
          </p>

          <div className="register-features">
            <div>🌱 Discover suitable business ideas</div>
            <div>📊 Understand local demand</div>
            <div>💰 Plan your money safely</div>
            <div>🏛️ Find relevant government schemes</div>
          </div>
        </div>

        <div className="register-bottom">
          Made for Rural India 🇮🇳
        </div>

      </div>

      {/* Form */}
      <div className="register-section">

        <div className="register-card">

          <div className="mobile-register-logo">
            🌾 Gram-Pragati AI
          </div>

          <div className="register-heading">
            <div className="register-icon">
              <UserPlus size={25} />
            </div>

            <h1>Create your account</h1>

            <p>
              Join Gram-Pragati AI and start building your
              business journey.
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            {error && (
              <div className="form-error" role="alert" style={{ color: "#b91c1c", marginBottom: "12px", fontSize: "14px" }}>
                {error}
              </div>
            )}

            {/* Name */}
            <div className="form-group">
              <label>Full Name</label>

              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Mobile */}
            <div className="form-group">
              <label>Mobile Number</label>

              <input
                type="tel"
                name="mobile"
                placeholder="Enter your mobile number"
                value={form.mobile}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label>Email</label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <label>Password</label>

              <div className="password-input">

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>

              </div>
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label>Confirm Password</label>

              <div className="password-input">

                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirm(!showConfirm)
                  }
                >
                  {showConfirm ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>

              </div>
            </div>

            {/* Language */}
            <div className="form-group">
              <label>Preferred Language</label>

              <select
                name="language"
                value={form.language}
                onChange={handleChange}
              >
                <option>English</option>
                <option>हिन्दी</option>
                <option>मराठी</option>
              </select>
            </div>

            {/* Terms */}
            <label className="terms">
              <input type="checkbox" required />

              <span>
                I agree to the Terms of Service and
                Privacy Policy.
              </span>
            </label>

            <button
              type="submit"
              className="login-button"
              disabled={submitting}
            >
              {submitting ? "Creating account..." : "Create Account"}
              <ArrowRight size={19} />
            </button>

          </form>

          <div className="register-text">
            Already have an account?

            <Link to="/login">
              {" "}Login
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}