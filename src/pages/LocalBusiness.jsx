import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  TrendingUp,
  Users,
  Store,
  Lightbulb,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const demandData = [
  { name: "Dairy", demand: 85 },
  { name: "Grocery", demand: 72 },
  { name: "Poultry", demand: 68 },
  { name: "Food", demand: 78 },
  { name: "Repair", demand: 60 },
];

const businesses = [
  {
    name: "Dairy",
    icon: "🥛",
    demand: "High",
    competition: "Medium",
    opportunity: "Good",
  },
  {
    name: "Grocery Shop",
    icon: "🛒",
    demand: "High",
    competition: "High",
    opportunity: "Moderate",
  },
  {
    name: "Poultry",
    icon: "🐔",
    demand: "Medium",
    competition: "Low",
    opportunity: "Good",
  },
  {
    name: "Food Processing",
    icon: "🌾",
    demand: "High",
    competition: "Low",
    opportunity: "High",
  },
  {
    name: "Mobile Repair",
    icon: "📱",
    demand: "Medium",
    competition: "Medium",
    opportunity: "Moderate",
  },
];

function LocalBusiness() {
  const navigate = useNavigate();

  return (
    <div className="local-page">
      {/* Navbar */}
      <nav className="local-navbar">
        <button
          className="icon-button"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={22} />
        </button>

        <div className="local-logo">
          <span>🌱</span>
          <strong>Gram-Pragati AI</strong>
        </div>

        <div className="sample-badge">Sample Data</div>
      </nav>

      <main className="local-container">
        {/* Header */}
        <section className="local-header">
          <div className="location-title">
            <MapPin size={26} />
            <div>
              <p>Your Local Business Pulse</p>
              <h1>Understand your local market</h1>
            </div>
          </div>

          <p className="local-subtitle">
            See what people may need, what businesses already exist,
            and where potential opportunities could be.
          </p>
        </section>

        {/* Location Card */}
        <section className="location-card">
          <div className="location-icon">
            <MapPin size={25} />
          </div>

          <div>
            <span>Your Selected Location</span>
            <h3>Village / Town</h3>
            <p>District, State</p>
          </div>

          <button className="change-location">
            Change
          </button>
        </section>

        {/* Summary Cards */}
        <section className="pulse-grid">
          <div className="pulse-card">
            <div className="pulse-icon">
              <TrendingUp size={24} />
            </div>
            <span>Demand Trend</span>
            <h2>Growing</h2>
            <small>Sample indicator</small>
          </div>

          <div className="pulse-card">
            <div className="pulse-icon">
              <Users size={24} />
            </div>
            <span>Competition</span>
            <h2>Medium</h2>
            <small>Sample indicator</small>
          </div>

          <div className="pulse-card">
            <div className="pulse-icon">
              <Lightbulb size={24} />
            </div>
            <span>Opportunity Gaps</span>
            <h2>3 Found</h2>
            <small>Sample analysis</small>
          </div>
        </section>

        {/* Chart */}
        <section className="local-section">
          <div className="section-heading">
            <div>
              <h2>Estimated Demand by Business</h2>
              <p>Illustrative values for demonstration</p>
            </div>

            <span className="trust-label calculated">
              🟡 Calculated
            </span>
          </div>

          <div className="chart-box">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={demandData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="demand" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Business List */}
        <section className="local-section">
          <div className="section-heading">
            <div>
              <h2>Businesses Around You</h2>
              <p>Compare demand and competition</p>
            </div>

            <span className="trust-label sample">
              ⚪ Sample Data
            </span>
          </div>

          <div className="business-list">
            {businesses.map((business) => (
              <div className="business-card" key={business.name}>
                <div className="business-main">
                  <div className="business-emoji">
                    {business.icon}
                  </div>

                  <div>
                    <h3>{business.name}</h3>

                    <div className="business-details">
                      <span>
                        Demand: <strong>{business.demand}</strong>
                      </span>

                      <span>
                        Competition:{" "}
                        <strong>{business.competition}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="opportunity-tag">
                  {business.opportunity}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Opportunity Gaps */}
        <section className="local-section">
          <div className="section-heading">
            <div>
              <h2>Potential Opportunity Gaps</h2>
              <p>Areas worth exploring further</p>
            </div>

            <span className="trust-label ai">
              🔵 AI Suggestion
            </span>
          </div>

          <div className="gap-grid">
            <div className="gap-card">
              <div className="gap-icon">🌾</div>
              <div>
                <h3>Food Processing</h3>
                <p>
                  Sample data suggests higher demand with relatively
                  lower competition.
                </p>
              </div>
            </div>

            <div className="gap-card">
              <div className="gap-icon">🐔</div>
              <div>
                <h3>Poultry</h3>
                <p>
                  Could be explored where local demand exists and
                  supply is limited.
                </p>
              </div>
            </div>

            <div className="gap-card">
              <div className="gap-icon">🥛</div>
              <div>
                <h3>Dairy Products</h3>
                <p>
                  Potential opportunity if nearby demand and
                  distribution are suitable.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why this matters */}
        <section className="why-card">
          <div className="why-icon">
            <Store size={26} />
          </div>

          <div>
            <h2>Why does local demand matter?</h2>
            <p>
              A business idea may look profitable on paper but still
              struggle if enough customers are not available nearby.
              Gram-Pragati AI uses local information to help you
              evaluate the idea before investing money.
            </p>
          </div>
        </section>

        {/* Warning */}
        <div className="local-warning">
          <AlertCircle size={20} />

          <p>
            <strong>Important:</strong> The numbers shown on this
            page are sample values for the frontend demo. They are
            not actual village-level market data. Real local data
            will be connected through the backend later.
          </p>
        </div>

        {/* CTA */}
        <section className="local-cta">
          <div>
            <h2>Found something interesting?</h2>
            <p>
              Compare business ideas and see which one fits your
              resources.
            </p>
          </div>

          <button
            className="primary-button"
            onClick={() => navigate("/opportunity")}
          >
            Explore Opportunities
            <ArrowRight size={19} />
          </button>
        </section>
      </main>
    </div>
  );
}

export default LocalBusiness;