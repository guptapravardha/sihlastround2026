import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  IndianRupee,
  TrendingUp,
  Wallet,
  AlertTriangle,
  Calculator,
  ArrowRight,
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

function Simulator() {
  const navigate = useNavigate();

  const [business, setBusiness] = useState("Dairy");
  const [investment, setInvestment] = useState(30000);
  const [revenue, setRevenue] = useState(18000);
  const [expenses, setExpenses] = useState(11000);

  const profit = revenue - expenses;
  const yearlyProfit = profit * 12;

  const chartData = [
    {
      name: "Revenue",
      amount: revenue,
    },
    {
      name: "Expenses",
      amount: expenses,
    },
    {
      name: "Profit",
      amount: profit > 0 ? profit : 0,
    },
  ];

  return (
    <div className="simulator-page">

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

      <main className="simulator-container">

        {/* Back */}
        <button
          className="back-button"
          onClick={() => navigate("/opportunity")}
        >
          <ArrowLeft size={18} />
          Back to Opportunities
        </button>

        {/* Header */}
        <section className="simulator-header">

          <div className="simulator-icon">
            🧮
          </div>

          <div>
            <h1>Business Simulator</h1>

            <p>
              Change the numbers and see how your business could look.
            </p>
          </div>

        </section>

        {/* Business selector */}
        <section className="simulator-card">

          <div className="simulator-card-title">
            <Calculator size={20} />

            <div>
              <h2>Choose a Business</h2>
              <p>Select the business you want to simulate.</p>
            </div>
          </div>

          <select
            value={business}
            onChange={(e) => setBusiness(e.target.value)}
            className="business-select"
          >
            <option>Dairy</option>
            <option>Food Processing</option>
            <option>Poultry</option>
            <option>Grocery Shop</option>
            <option>Mobile Repair</option>
          </select>

        </section>

        {/* Input section */}
        <section className="simulator-card">

          <div className="simulator-card-title">

            <div className="simulator-business-icon">
              {business === "Dairy"
                ? "🥛"
                : business === "Poultry"
                ? "🐔"
                : business === "Food Processing"
                ? "🌾"
                : business === "Grocery Shop"
                ? "🏪"
                : "📱"}
            </div>

            <div>
              <h2>{business} Business</h2>

              <span className="calculated-badge">
                🟡 Calculated Estimate
              </span>
            </div>

          </div>

          <div className="simulator-input-grid">

            {/* Investment */}
            <div className="simulator-input-box">

              <label>
                <Wallet size={17} />
                Starting Investment
              </label>

              <div className="number-input">
                <span>₹</span>

                <input
                  type="number"
                  value={investment}
                  onChange={(e) =>
                    setInvestment(Number(e.target.value))
                  }
                />
              </div>

              <small>
                Money required to start the business.
              </small>

            </div>

            {/* Revenue */}
            <div className="simulator-input-box">

              <label>
                <TrendingUp size={17} />
                Monthly Revenue
              </label>

              <div className="number-input">
                <span>₹</span>

                <input
                  type="number"
                  value={revenue}
                  onChange={(e) =>
                    setRevenue(Number(e.target.value))
                  }
                />
              </div>

              <small>
                Estimated monthly sales/income.
              </small>

            </div>

            {/* Expenses */}
            <div className="simulator-input-box">

              <label>
                <IndianRupee size={17} />
                Monthly Expenses
              </label>

              <div className="number-input">
                <span>₹</span>

                <input
                  type="number"
                  value={expenses}
                  onChange={(e) =>
                    setExpenses(Number(e.target.value))
                  }
                />
              </div>

              <small>
                Estimated monthly operating expenses.
              </small>

            </div>

          </div>

        </section>

        {/* Result */}
        <section className="simulator-results">

          <div className="result-card">

            <div className="result-icon">
              💰
            </div>

            <span>Monthly Revenue</span>

            <strong>
              ₹{revenue.toLocaleString("en-IN")}
            </strong>

          </div>

          <div className="result-card">

            <div className="result-icon">
              💸
            </div>

            <span>Monthly Expenses</span>

            <strong>
              ₹{expenses.toLocaleString("en-IN")}
            </strong>

          </div>

          <div className="result-card highlight-result">

            <div className="result-icon">
              📈
            </div>

            <span>Estimated Monthly Profit</span>

            <strong>
              ₹{profit.toLocaleString("en-IN")}
            </strong>

          </div>

        </section>

        {/* Chart */}
        <section className="simulator-card chart-card">

          <div className="simulator-card-title">

            <div>
              <h2>Monthly Financial Picture</h2>

              <p>
                Estimated revenue, expenses and remaining amount.
              </p>
            </div>

            <span className="calculated-badge">
              Calculated
            </span>

          </div>

          <div className="simulator-chart">

            <ResponsiveContainer width="100%" height={300}>

              <BarChart data={chartData}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="name" />

                <YAxis />

                <Tooltip
                  formatter={(value) =>
                    `₹${Number(value).toLocaleString("en-IN")}`
                  }
                />

                <Bar
                  dataKey="amount"
                  radius={[8, 8, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </section>

        {/* Yearly estimate */}
        <section className="yearly-card">

          <div>
            <span>Estimated Yearly Profit</span>

            <h2>
              ₹{yearlyProfit.toLocaleString("en-IN")}
            </h2>
          </div>

          <div className="yearly-icon">
            📊
          </div>

        </section>

        {/* Risk */}
        <section className="risk-card">

          <div className="risk-icon">
            <AlertTriangle size={23} />
          </div>

          <div>
            <strong>Remember: This is an estimate</strong>

            <p>
              Actual income and expenses can change depending on local
              demand, prices, competition, season, production and other
              factors. Profit is not guaranteed.
            </p>
          </div>

        </section>

        {/* Continue */}
        <button
          className="continue-money-button"
          onClick={() => navigate("/money-planner")}
        >
          Plan Your Money
          <ArrowRight size={19} />
        </button>

      </main>

      {/* Mobile navigation */}
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

export default Simulator;