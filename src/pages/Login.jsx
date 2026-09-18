import { useState } from "react";
import { Eye, EyeOff, ArrowRight, Mail, Lock, Sprout } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import LoginRuralHero from "../components/LoginRuralHero";
import VillageStrip from "../components/VillageStrip";
import LanguageToggle from "../components/LanguageToggle";
import { useAuth } from "../context/AuthContext";

const FEATURES = [
  { icon: "🌱", title: "Manage", subtitle: "Your Business" },
  { icon: "📈", title: "Plan", subtitle: "Your Finances" },
  { icon: "🏛️", title: "Discover", subtitle: "Government Schemes" },
  { icon: "🤖", title: "Get Expert Advice", subtitle: "with AI Advisor" },
];

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [socialNotice, setSocialNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form.email.trim().toLowerCase(), form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSocialClick = (provider) => {
    setSocialNotice(`${provider} sign-in isn't set up yet — please log in with email for now.`);
  };

  return (
    <div className="login-page">
      {/* LEFT: brand + rural storytelling panel */}
      <div className="login-visual">
        <LoginRuralHero />

        <div className="login-visual-content">
          <div className="visual-brand">
            <div className="visual-brand-mark" aria-hidden="true">
              <Sprout size={30} strokeWidth={2.25} />
            </div>
            <p className="visual-brand-name">Gram-Pragati AI</p>
            <p className="visual-brand-hindi">गाँव से विकास की ओर</p>
            <p className="visual-brand-tagline">
              Your Business. Our Guidance. A Brighter Tomorrow.
            </p>
          </div>

          <ul className="visual-features">
            {FEATURES.map((f) => (
              <li key={f.title}>
                <span className="visual-feature-icon">{f.icon}</span>
                <span className="visual-feature-text">
                  {f.title}
                  <br />
                  {f.subtitle}
                </span>
              </li>
            ))}
          </ul>

          <blockquote className="visual-quote">
            "छोटे कारोबार की बड़ी उड़ान,
            <br />
            अब हर गाँव बने आत्मनिर्भर।"
          </blockquote>
        </div>
      </div>

      {/* RIGHT: login form */}
      <div className="login-section">
        <div className="login-topbar">
          <LanguageToggle />
        </div>

        <div className="login-card">
          <div className="login-heading">
            <p className="login-welcome">Welcome to</p>
            <h1>Gram-Pragati AI</h1>
            <p className="login-subtext">
              Login to manage your business, plan better and grow with the
              right guidance.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="form-error" role="alert">
                {error}
              </div>
            )}

            {socialNotice && (
              <div className="form-notice" role="status">
                {socialNotice}
              </div>
            )}

            <div className="form-group icon-field">
              <Mail size={18} className="field-icon" aria-hidden="true" />
              <input
                type="email"
                placeholder="Email address"
                autoComplete="email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group icon-field password-input">
              <Lock size={18} className="field-icon" aria-hidden="true" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                autoComplete="current-password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
              />
              <button
                type="button"
                className="toggle-visibility"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>

            <div className="login-row">
              <label className="remember">
                <input
                  type="checkbox"
                  checked={form.rememberMe}
                  onChange={(e) =>
                    setForm({ ...form, rememberMe: e.target.checked })
                  }
                />
                <span>Keep me signed in</span>
              </label>

              <Link to="/forgot-password" className="forgot-link">
                Forgot password?
              </Link>
            </div>

            <button className="login-button" type="submit" disabled={submitting}>
              {submitting ? "Logging in..." : "Login"}
              <ArrowRight size={19} />
            </button>
          </form>

          <div className="login-divider">
            <span>OR</span>
          </div>

          <div className="social-buttons">
            <button
              type="button"
              className="social-button"
              onClick={() => handleSocialClick("Google")}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62z" />
                <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.83.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.98v2.33A9 9 0 0 0 9 18z" />
                <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.98A9 9 0 0 0 0 9c0 1.45.35 2.83.98 4.03l2.97-2.33z" />
                <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.9 11.43 0 9 0A9 9 0 0 0 .98 4.97l2.97 2.33C4.66 5.17 6.65 3.58 9 3.58z" />
              </svg>
              Continue with Google
            </button>

            <button
              type="button"
              className="social-button"
              onClick={() => handleSocialClick("Microsoft")}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <rect x="0" y="0" width="8.5" height="8.5" fill="#F25022" />
                <rect x="9.5" y="0" width="8.5" height="8.5" fill="#7FBA00" />
                <rect x="0" y="9.5" width="8.5" height="8.5" fill="#00A4EF" />
                <rect x="9.5" y="9.5" width="8.5" height="8.5" fill="#FFB900" />
              </svg>
              Continue with Microsoft
            </button>
          </div>

          <div className="register-text">
            Don't have an account?
            <Link to="/register"> Sign up</Link>
          </div>
        </div>

        <div className="login-village-strip">
          <VillageStrip />
          <p className="village-strip-caption">
            Empowered Villages&nbsp;|&nbsp;Stronger Businesses&nbsp;|&nbsp;A Prosperous India
          </p>
        </div>
      </div>
    </div>
  );
}
