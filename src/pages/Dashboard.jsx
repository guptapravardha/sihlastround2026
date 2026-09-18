import { useNavigate } from "react-router-dom";
import {
  Mic,
  MapPin,
  Lightbulb,
  Wallet,
  Landmark,
  FileText,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  AlertCircle,
  Package,
  LogOut,
} from "lucide-react";

import { Calculator } from "lucide-react";
import { useAuth } from "../context/AuthContext";



export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const firstName = user?.name?.split(" ")[0] || "there";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-page">

      {/* TOP NAVBAR */}
      <header className="dashboard-navbar">
        <div className="dashboard-logo">
          🌾 <span>Gram-Pragati AI</span>
        </div>

        <div className="profile-mini" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="profile-avatar">{firstName.slice(0, 2).toUpperCase()}</div>
          <span>{firstName}</span>
          <button className="icon-button" title="Log out" onClick={handleLogout}>
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <main className="dashboard-container">

        {/* WELCOME */}
        <section className="welcome-section">
          <div>
            <p className="welcome-small">Good to see you 👋</p>
            <h1>Namaste, {firstName}!</h1>
            <p className="welcome-text">
              Let's find the right business opportunity for you.
            </p>
          </div>

          <div className="location-badge">
            <MapPin size={16} />
            Your Location
          </div>
        </section>

        {/* VOICE ADVISOR */}
        <section className="voice-card">
          <div className="voice-content">
            <div className="voice-icon">
              <Mic size={30} />
            </div>

            <div>
              <span className="card-label">AI BUSINESS ADVISOR</span>
              <h2>Ask Gram-Pragati</h2>
              <p>
                Speak naturally in Hindi, English or Marathi.
              </p>
            </div>
          </div>

          <button
            className="voice-button"
            onClick={() => navigate("/advisor")}
          >
            <Mic size={20} />
            Speak Now
          </button>
        </section>

        {/* DAILY ACTION */}
        <section className="daily-action">
          <div className="section-heading">
            <div>
              <span className="card-label">TODAY'S ACTION</span>
              <h2>What should I do today?</h2>
            </div>

            <CheckCircle size={26} />
          </div>

          <div className="action-item">
            <div className="action-number">1</div>

            <div>
              <strong>Check local demand</strong>
              <p>Explore what products people need nearby.</p>
            </div>

            <ArrowRight size={20} />
          </div>

          <div className="action-item">
            <div className="action-number">2</div>

            <div>
              <strong>Compare business ideas</strong>
              <p>See investment, income and risk estimates.</p>
            </div>

            <ArrowRight size={20} />
          </div>

          <div className="action-item">
            <div className="action-number">3</div>

            <div>
              <strong>Check available schemes</strong>
              <p>Find government support relevant to you.</p>
            </div>

            <ArrowRight size={20} />
          </div>
        </section>

        {/* FEATURE GRID */}
        <section className="dashboard-section">

          <div className="section-title">
            <h2>Explore Gram-Pragati</h2>
            <p>Tools to help you plan your business.</p>
          </div>

          <div className="feature-grid">

            {/* LOCAL PULSE */}
            <div
              className="feature-card"
              onClick={() => navigate("/local-business")}
            >
              <div className="feature-icon blue-icon">
                <MapPin />
              </div>

              <h3>Local Business Pulse</h3>

              <p>
                Understand local demand, competition and business gaps.
              </p>

              <span className="feature-link">
                Explore <ArrowRight size={16} />
              </span>
            </div>

            {/* OPPORTUNITY */}
            <div
              className="feature-card"
              onClick={() => navigate("/opportunity")}
            >
              <div className="feature-icon yellow-icon">
                <Lightbulb />
              </div>

              <h3>Business Opportunity</h3>

              <p>
                Discover business ideas based on your local situation.
              </p>

              <span className="feature-link">
                Find Ideas <ArrowRight size={16} />
              </span>
            </div>

            {/* SIMULATOR */}
            <div
              className="feature-card"
              onClick={() => navigate("/simulator")}
            >
              <div className="feature-icon green-icon">
                <TrendingUp />
              </div>

              <h3>Business Simulator</h3>

              <p>
                Compare investment, revenue, expenses and risk.
              </p>

              <span className="feature-link">
                Simulate <ArrowRight size={16} />
              </span>
            </div>

            {/* MONEY */}
            <div
              className="feature-card"
              onClick={() => navigate("/money-planner")}
            >
              <div className="feature-icon purple-icon">
                <Wallet />
              </div>

              <h3>Money Planner</h3>

              <p>
                Plan your own investment, loan, EMI and cash flow.
              </p>

              <span className="feature-link">
                Plan Money <ArrowRight size={16} />
              </span>
            </div>

            {/* INVENTORY */}
            <div
              className="feature-card"
              onClick={() => navigate("/inventory")}
            >
              <div className="feature-icon green-icon">
                <Package />
              </div>

              <h3>Inventory</h3>

              <p>
                Track stock, low-stock alerts and inventory value.
              </p>

              <span className="feature-link">
                Manage Stock <ArrowRight size={16} />
              </span>
            </div>

            {/* SCHEMES */}
            <div
              className="feature-card"
              onClick={() => navigate("/schemes")}
            >
              <div className="feature-icon orange-icon">
                <Landmark />
              </div>

              <h3>Government Schemes</h3>

              <p>
                Find schemes and check eligibility and documents.
              </p>

              <span className="feature-link">
                Check Schemes <ArrowRight size={16} />
              </span>
            </div>

            {/* APPLICATION */}
            <div
              className="feature-card"
              onClick={() => navigate("/reports")}
            >
              <div className="feature-icon red-icon">
                <FileText />
              </div>

              <h3>Application Summary</h3>

              <p>
                Prepare a simple business summary for applications.
              </p>

              <span className="feature-link">
                View Summary <ArrowRight size={16} />
              </span>
            </div>

          </div>
        </section>

        <div
  className="feature-card"
  onClick={() => navigate("/financial-analysis")}
>
  <div className="feature-icon">
    <Calculator size={24} />
  </div>

  <h3>
    {"Financial Analysis"}
  </h3>

  <p>
    {"FinancialAnalysis Description"}
  </p>

  <span className="feature-link">
    {"Analyze Finances"}
  </span>
</div>


        {/* TRUST LABELS */}
        <section className="trust-section">

          <div className="section-title">
            <h2>Understand our information</h2>
            <p>We clearly show where information comes from.</p>
          </div>

          <div className="trust-grid">

            <div className="trust-item">
              <span className="trust-dot verified"></span>
              <div>
                <strong>Verified</strong>
                <p>Checked from trusted sources.</p>
              </div>
            </div>

            <div className="trust-item">
              <span className="trust-dot suggestion"></span>
              <div>
                <strong>AI Suggestion</strong>
                <p>Generated by Gram-Pragati AI.</p>
              </div>
            </div>

            <div className="trust-item">
              <span className="trust-dot calculated"></span>
              <div>
                <strong>Calculated</strong>
                <p>Based on provided assumptions.</p>
              </div>
            </div>

            <div className="trust-item">
              <span className="trust-dot sample"></span>
              <div>
                <strong>Sample Data</strong>
                <p>Example information for demonstration.</p>
              </div>
            </div>

          </div>
        </section>

        {/* WARNING */}
        <div className="dashboard-warning">
          <AlertCircle size={20} />

          <p>
            Business income, expenses and profits shown by the
            simulator are estimates, not guarantees.
          </p>
        </div>

      </main>

      {/* MOBILE BOTTOM NAV */}
      <nav className="bottom-nav">

        <button className="active">
          🏠
          <span>Home</span>
        </button>

        <button onClick={() => navigate("/advisor")}>
          🎤
          <span>Advisor</span>
        </button>

        <button onClick={() => navigate("/simulator")}>
          💡
          <span>Ideas</span>
        </button>

        <button onClick={() => navigate("/money-planner")}>
          💰
          <span>Money</span>
        </button>

        <button>
          👤
          <span>Profile</span>
        </button>

      </nav>

    </div>
  );
}