import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  AlertCircle,
  TrendingUp,
  Lightbulb,
  IndianRupee,
  Users,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

function Opportunity() {
  const navigate = useNavigate();

  const opportunities = [
    {
      title: "Small Dairy Business",
      problem: "Local demand for fresh milk is higher than nearby supply.",
      data: "High local demand • Medium competition",
      investment: "₹20,000 – ₹50,000",
      risk: "Medium",
      potential: "Good",
      icon: "🥛",
    },
    {
      title: "Food Processing",
      problem: "Local agricultural products have limited value-added processing.",
      data: "High demand • Low competition",
      investment: "₹30,000 – ₹75,000",
      risk: "Medium",
      potential: "High",
      icon: "🌾",
    },
    {
      title: "Poultry Business",
      problem: "Nearby households and shops need regular poultry supply.",
      data: "Medium demand • Low competition",
      investment: "₹25,000 – ₹60,000",
      risk: "Medium",
      potential: "Good",
      icon: "🐔",
    },
  ];

  return (
    <div className="opportunity-page">

      {/* Navbar */}
      <nav className="dashboard-navbar">
        <div className="dashboard-brand">
          <div className="brand-icon">🌾</div>
          <div>
            <h2>Gram-Pragati AI</h2>
            <span>Your AI Business Partner</span>
          </div>
        </div>

        <div className="dashboard-profile">
          <div className="profile-avatar">S</div>
          <span>Sandhya</span>
        </div>
      </nav>

      <main className="opportunity-container">

        {/* Back */}
        <button
          className="back-button"
          onClick={() => navigate("/local-business")}
        >
          <ArrowLeft size={18} />
          Back to Local Business
        </button>

        {/* Header */}
        <section className="opportunity-header">
          <div className="opportunity-title-icon">
            💡
          </div>

          <div>
            <h1>Business Opportunity Gap</h1>
            <p>
              Find where local problems can become practical business
              opportunities.
            </p>
          </div>
        </section>

        {/* Location */}
        <div className="location-banner">
          <MapPin size={20} />
          <div>
            <strong>Your selected area</strong>
            <p>Indore, Madhya Pradesh</p>
          </div>
        </div>

        {/* How it works */}
        <section className="gap-flow">

          <div className="gap-step">
            <div className="gap-step-icon">⚠️</div>
            <h3>Problem</h3>
            <p>What local people need</p>
          </div>

          <div className="gap-arrow">→</div>

          <div className="gap-step">
            <div className="gap-step-icon">📊</div>
            <h3>Data</h3>
            <p>Demand & competition</p>
          </div>

          <div className="gap-arrow">→</div>

          <div className="gap-step">
            <div className="gap-step-icon">💡</div>
            <h3>Opportunity</h3>
            <p>Possible business idea</p>
          </div>

        </section>

        {/* Opportunity cards */}
        <section className="opportunity-section">

          <div className="section-heading">
            <div>
              <h2>Opportunities Found</h2>
              <p>Based on the sample local market data.</p>
            </div>

            <span className="sample-badge">
              Sample Data
            </span>
          </div>

          <div className="opportunity-grid">

            {opportunities.map((item, index) => (

              <div className="opportunity-card" key={index}>

                <div className="opportunity-card-top">
                  <div className="business-emoji">
                    {item.icon}
                  </div>

                  <div>
                    <h3>{item.title}</h3>
                    <span className="ai-badge">
                      <Lightbulb size={13} />
                      AI Suggestion
                    </span>
                  </div>
                </div>

                {/* Problem */}
                <div className="opportunity-info problem-box">
                  <div className="info-icon">
                    <AlertCircle size={18} />
                  </div>

                  <div>
                    <strong>Local Problem</strong>
                    <p>{item.problem}</p>
                  </div>
                </div>

                {/* Data */}
                <div className="opportunity-info">
                  <div className="info-icon">
                    <TrendingUp size={18} />
                  </div>

                  <div>
                    <strong>Market Signal</strong>
                    <p>{item.data}</p>
                  </div>
                </div>

                {/* Investment */}
                <div className="opportunity-info">
                  <div className="info-icon">
                    <IndianRupee size={18} />
                  </div>

                  <div>
                    <strong>Estimated Investment</strong>
                    <p>{item.investment}</p>
                  </div>
                </div>

                {/* Bottom stats */}
                <div className="opportunity-stats">

                  <div>
                    <span>Risk</span>
                    <strong>{item.risk}</strong>
                  </div>

                  <div>
                    <span>Potential</span>
                    <strong>{item.potential}</strong>
                  </div>

                </div>

                <button
                  className="opportunity-action"
                  onClick={() => navigate("/simulator")}
                >
                  Simulate This Business
                  <ArrowRight size={18} />
                </button>

              </div>

            ))}

          </div>
        </section>

        {/* Why this matters */}
        <section className="why-opportunity">

          <div className="why-icon">
            <Users size={25} />
          </div>

          <div>
            <h3>Why does the opportunity gap matter?</h3>

            <p>
              A business idea should not be based only on what sounds
              profitable. Local demand, existing competition, available
              resources and starting cost should also be considered.
            </p>
          </div>

        </section>

        {/* Trust information */}
        <section className="trust-box">

          <CheckCircle2 size={20} />

          <div>
            <strong>Important</strong>

            <p>
              The investment, demand, competition and potential values shown
              here are sample values for the frontend. They are not guaranteed
              profits or financial advice.
            </p>
          </div>

        </section>

      </main>

      {/* Mobile Navigation */}
      <div className="mobile-bottom-nav">

        <button onClick={() => navigate("/dashboard")}>
          🏠
          <span>Home</span>
        </button>

        <button onClick={() => navigate("/voice-advisor")}>
          🎙️
          <span>Advisor</span>
        </button>

        <button className="active">
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

      </div>

    </div>
  );
}

export default Opportunity;