import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  IndianRupee,
  Wallet,
  Calculator,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

function MoneyPlanner() {
  const navigate = useNavigate();

  const [projectCost, setProjectCost] = useState(50000);
  const [ownContribution, setOwnContribution] = useState(20000);
  const [monthlyProfit, setMonthlyProfit] = useState(7000);
  const [interestRate, setInterestRate] = useState(10);
  const [tenure, setTenure] = useState(24);

  const calculation = useMemo(() => {
    const loan = Math.max(projectCost - ownContribution, 0);

    const monthlyRate = interestRate / 100 / 12;
    const months = Number(tenure);

    let emi = 0;

    if (loan > 0 && monthlyRate > 0 && months > 0) {
      emi =
        (loan *
          monthlyRate *
          Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);
    } else if (loan > 0 && months > 0) {
      emi = loan / months;
    }

    const surplus = monthlyProfit - emi;

    let pressure = "Low";
    let pressureClass = "low";

    if (monthlyProfit <= 0) {
      pressure = "Very High";
      pressureClass = "high";
    } else if (emi > monthlyProfit * 0.5) {
      pressure = "High";
      pressureClass = "high";
    } else if (emi > monthlyProfit * 0.3) {
      pressure = "Moderate";
      pressureClass = "moderate";
    }

    return {
      loan,
      emi,
      surplus,
      pressure,
      pressureClass,
    };
  }, [
    projectCost,
    ownContribution,
    monthlyProfit,
    interestRate,
    tenure,
  ]);

  const formatMoney = (value) => {
    return `₹${Math.round(value).toLocaleString("en-IN")}`;
  };

  return (
    <div className="money-page">

      {/* Navbar */}
      <nav className="money-navbar">
        <div className="money-brand">
          <button
            className="money-back-btn"
            onClick={() => navigate("/simulator")}
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h2>Gram-Pragati AI</h2>
            <span>Safe Money Planner</span>
          </div>
        </div>

        <div className="money-user">
          <div className="money-avatar">S</div>
          <span>Sandhya</span>
        </div>
      </nav>

      <main className="money-container">

        {/* Header */}
        <section className="money-header">
          <div className="money-title-icon">
            <Wallet size={28} />
          </div>

          <div>
            <h1>Plan Your Money Safely</h1>
            <p>
              Understand your contribution, loan requirement,
              EMI and monthly cash surplus before borrowing.
            </p>
          </div>
        </section>

        {/* Trust labels */}
        <div className="money-trust-row">
          <span className="trust calculated">
            🟡 Calculated
          </span>

          <span className="trust sample">
            ⚪ Sample Data
          </span>
        </div>

        {/* Inputs */}
        <section className="money-card">

          <div className="money-card-heading">
            <Calculator size={21} />
            <div>
              <h2>Project & Finance Details</h2>
              <p>Change the numbers according to your situation.</p>
            </div>
          </div>

          <div className="money-form-grid">

            <div className="money-field">
              <label>Total Project Cost</label>

              <div className="money-input-wrap">
                <IndianRupee size={18} />
                <input
                  type="number"
                  min="0"
                  value={projectCost}
                  onChange={(e) =>
                    setProjectCost(Number(e.target.value))
                  }
                />
              </div>
            </div>

            <div className="money-field">
              <label>Your Own Contribution</label>

              <div className="money-input-wrap">
                <IndianRupee size={18} />
                <input
                  type="number"
                  min="0"
                  value={ownContribution}
                  onChange={(e) =>
                    setOwnContribution(Number(e.target.value))
                  }
                />
              </div>
            </div>

            <div className="money-field">
              <label>Estimated Monthly Profit</label>

              <div className="money-input-wrap">
                <IndianRupee size={18} />
                <input
                  type="number"
                  min="0"
                  value={monthlyProfit}
                  onChange={(e) =>
                    setMonthlyProfit(Number(e.target.value))
                  }
                />
              </div>
            </div>

            <div className="money-field">
              <label>Interest Rate (% yearly)</label>

              <div className="money-input-wrap">
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) =>
                    setInterestRate(Number(e.target.value))
                  }
                />
                <span>%</span>
              </div>
            </div>

            <div className="money-field">
              <label>Loan Tenure</label>

              <div className="money-input-wrap">
                <input
                  type="number"
                  min="1"
                  value={tenure}
                  onChange={(e) =>
                    setTenure(Number(e.target.value))
                  }
                />
                <span>months</span>
              </div>
            </div>

          </div>
        </section>

        {/* Loan requirement */}
        <section className="loan-requirement-card">

          <div>
            <span className="result-label">
              Required Loan
            </span>

            <h2>{formatMoney(calculation.loan)}</h2>

            <p>
              Project Cost − Your Own Contribution
            </p>
          </div>

          <div className="loan-icon">
            <IndianRupee size={30} />
          </div>

        </section>

        {/* Results */}
        <section className="money-results">

          <div className="money-result-card">
            <div className="result-icon">
              <IndianRupee size={22} />
            </div>

            <span>Estimated EMI</span>

            <strong>
              {formatMoney(calculation.emi)}
            </strong>

            <small>per month</small>
          </div>

          <div className="money-result-card">
            <div className="result-icon">
              <Wallet size={22} />
            </div>

            <span>Monthly Cash Surplus</span>

            <strong>
              {formatMoney(calculation.surplus)}
            </strong>

            <small>
              Estimated Profit − EMI
            </small>
          </div>

          <div
            className={`money-result-card pressure ${calculation.pressureClass}`}
          >
            <div className="result-icon">
              <TrendingDown size={22} />
            </div>

            <span>Illustrative Pressure</span>

            <strong>
              {calculation.pressure}
            </strong>

            <small>
              Based on current inputs
            </small>
          </div>

        </section>

        {/* Simple explanation */}
        <section className="money-explanation">

          <div className="explanation-heading">
            <CheckCircle2 size={21} />
            <h2>What does this mean?</h2>
          </div>

          <div className="explanation-list">

            <div>
              <span>1</span>
              <p>
                You need approximately{" "}
                <strong>
                  {formatMoney(calculation.loan)}
                </strong>{" "}
                from external financing.
              </p>
            </div>

            <div>
              <span>2</span>
              <p>
                Your estimated monthly EMI is{" "}
                <strong>
                  {formatMoney(calculation.emi)}
                </strong>.
              </p>
            </div>

            <div>
              <span>3</span>
              <p>
                After EMI, your estimated monthly cash
                surplus is{" "}
                <strong>
                  {formatMoney(calculation.surplus)}
                </strong>.
              </p>
            </div>

          </div>

        </section>

        {/* Warning */}
        <section className="money-warning">

          <AlertTriangle size={23} />

          <div>
            <h3>Important before taking a loan</h3>

            <p>
              Interest rates, eligibility, processing fees,
              repayment rules and loan limits can vary by
              lender and scheme. Verify the actual terms
              with the bank or official scheme source before
              making a financial decision.
            </p>
          </div>

        </section>

        {/* Next step */}
        <section className="money-next">

          <div>
            <h2>Check Government Schemes</h2>
            <p>
              Find schemes that may match your business
              and understand their eligibility and
              documentation requirements.
            </p>
          </div>

          <button
            onClick={() => navigate("/schemes")}
            className="money-next-btn"
          >
            Explore Schemes
            <ArrowRight size={19} />
          </button>

        </section>

        {/* Disclaimer */}
        <p className="money-disclaimer">
          🟡 Calculated values are based on the information
          entered by you. These are estimates, not guaranteed
          returns or loan offers.
        </p>

      </main>

      {/* Mobile Navigation */}
      <div className="money-mobile-nav">

        <button onClick={() => navigate("/dashboard")}>
          <span>⌂</span>
          Home
        </button>

        <button onClick={() => navigate("/voice-advisor")}>
          <span>🎙️</span>
          Advisor
        </button>

        <button onClick={() => navigate("/opportunity")}>
          <span>💡</span>
          Ideas
        </button>

        <button className="active">
          <span>₹</span>
          Money
        </button>

        <button>
          <span>👤</span>
          Profile
        </button>

      </div>

    </div>
  );
}

export default MoneyPlanner;