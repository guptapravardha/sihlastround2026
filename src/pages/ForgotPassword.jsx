import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  KeyRound,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [contact, setContact] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSendOTP = (e) => {
    e.preventDefault();

    // Temporary frontend simulation
    setStep(2);
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      alert("Please enter a 6-digit OTP.");
      return;
    }

    setStep(3);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setStep(4);
  };

  return (
    <div className="forgot-page">

      {/* Left Side */}
      <div className="forgot-visual">

        <div className="forgot-brand">
          <span>🌾</span>
          <div>
            <h2>Gram-Pragati AI</h2>
            <p>Business Partner for Rural India</p>
          </div>
        </div>

        <div className="forgot-illustration">
          <div className="big-icon">
            🔐
          </div>

          <h1>
            Your account,<br />
            your control.
          </h1>

          <p>
            Don't worry if you forgot your password.
            We'll help you securely get back into
            your Gram-Pragati account.
          </p>

          <div className="security-points">
            <div>
              <ShieldCheck size={20} />
              Secure verification
            </div>

            <div>
              <Mail size={20} />
              OTP verification
            </div>

            <div>
              <KeyRound size={20} />
              Create a new password
            </div>
          </div>
        </div>

      </div>

      {/* Right Side */}
      <div className="forgot-section">

        <div className="forgot-card">

          {/* STEP 1 */}
          {step === 1 && (
            <>
              <div className="forgot-icon">
                <Mail size={27} />
              </div>

              <h1>Forgot your password?</h1>

              <p className="forgot-description">
                Enter your registered email or mobile number
                and we'll send you a verification code.
              </p>

              <form onSubmit={handleSendOTP}>

                <div className="form-group">
                  <label>Email or Mobile Number</label>

                  <input
                    type="text"
                    placeholder="Enter email or mobile number"
                    value={contact}
                    onChange={(e) =>
                      setContact(e.target.value)
                    }
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="login-button"
                >
                  Send OTP
                  <ArrowRight size={19} />
                </button>

              </form>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <div className="forgot-icon">
                <ShieldCheck size={27} />
              </div>

              <h1>Verify OTP</h1>

              <p className="forgot-description">
                Enter the 6-digit verification code sent
                to <strong>{contact}</strong>.
              </p>

              <form onSubmit={handleVerifyOTP}>

                <div className="form-group">
                  <label>Verification Code</label>

                  <input
                    className="otp-input"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="000000"
                    value={otp}
                    onChange={(e) =>
                      setOtp(
                        e.target.value.replace(/\D/g, "")
                      )
                    }
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="login-button"
                >
                  Verify OTP
                  <ArrowRight size={19} />
                </button>

              </form>

              <button
                className="resend-button"
                onClick={() => alert("OTP resent!")}
              >
                Didn't receive the code? Resend OTP
              </button>
            </>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <>
              <div className="forgot-icon">
                <KeyRound size={27} />
              </div>

              <h1>Create new password</h1>

              <p className="forgot-description">
                Choose a strong password for your account.
              </p>

              <form onSubmit={handleResetPassword}>

                <div className="form-group">
                  <label>New Password</label>

                  <input
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Confirm Password</label>

                  <input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="login-button"
                >
                  Reset Password
                  <ArrowRight size={19} />
                </button>

              </form>
            </>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="success-state">

              <div className="success-icon">
                <CheckCircle size={55} />
              </div>

              <h1>Password updated!</h1>

              <p>
                Your password has been successfully changed.
                You can now login with your new password.
              </p>

              <button
                className="login-button"
                onClick={() => navigate("/login")}
              >
                Go to Login
                <ArrowRight size={19} />
              </button>

            </div>
          )}

          {step !== 4 && (
            <Link to="/login" className="back-login">
              <ArrowLeft size={17} />
              Back to Login
            </Link>
          )}

        </div>

      </div>

    </div>
  );
}