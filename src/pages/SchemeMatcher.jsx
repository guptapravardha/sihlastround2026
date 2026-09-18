import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { State, City } from "country-state-city";
import {
  ArrowLeft,
  Calculator,
  IndianRupee,
  MapPin,
  Search,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  Clock3,
  Building2,
  RefreshCw,
  Landmark,
} from "lucide-react";

const demoSchemes = [
  {
    id: "nsfdc-term",
    name: "NSFDC Term Loan Scheme",
    type: "Term Loan",
    minProject: 140000,
    maxProject: 5000000,
    maxLoan: 4500000,
    contribution: 10,
    interest: 8,
    tenure: "Up to 7 years",
    moratorium: "6 months",
    categories: [
      "Dairy",
      "Agriculture",
      "Retail",
      "Food Processing",
      "Poultry",
    ],
    beneficiary: ["SC"],
    source: "Official Government Source",
  },
  {
    id: "nsfdc-micro",
    name: "NSFDC Micro Finance Scheme",
    type: "Micro Finance",
    minProject: 0,
    maxProject: 140000,
    maxLoan: 125000,
    contribution: 10,
    interest: 6.5,
    tenure: "Up to 3 years",
    moratorium: "3 months",
    categories: [
      "Dairy",
      "Agriculture",
      "Retail",
      "Food Processing",
      "Poultry",
    ],
    beneficiary: ["SC"],
    source: "Official Government Source",
  },
  {
    id: "mudra",
    name: "PMMY / MUDRA",
    type: "Micro Enterprise Finance",
    minProject: 0,
    maxProject: 2000000,
    maxLoan: 2000000,
    contribution: null,
    interest: null,
    tenure: "Depends on lender",
    moratorium: "Depends on lender",
    categories: [
      "Dairy",
      "Agriculture",
      "Retail",
      "Food Processing",
      "Digital Services",
      "Poultry",
      "Mobile Repair",
    ],
    beneficiary: ["SC", "ST", "OBC", "General"],
    source: "Official Government Source",
  },
];

const businessOptions = [
  "Dairy",
  "Agriculture",
  "Food Processing",
  "Retail",
  "Poultry",
  "Handicrafts",
  "Digital Services",
  "Mobile Repair",
];

const beneficiaryOptions = ["SC", "ST", "OBC", "General"];

const formatCurrency = (value) => {
  if (!value || Number.isNaN(value)) return "₹0";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

const calculateEMI = (loan, annualRate, months) => {
  if (!loan || !annualRate || !months) return 0;

  const monthlyRate = annualRate / 12 / 100;

  return (
    (loan * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1)
  );
};

function SchemeMatcher() {
  const navigate = useNavigate();

  /*
    -------------------------------------------------------
    LOCATION DATA
    -------------------------------------------------------
    country-state-city uses ISO country code "IN".
  */

  const indiaStates = useMemo(() => {
    return State.getStatesOfCountry("IN");
  }, []);

  const [selectedStateCode, setSelectedStateCode] = useState("MP");

  const [selectedDistrict, setSelectedDistrict] = useState("Indore");

  const [selectedCity, setSelectedCity] = useState("");

  const selectedState = useMemo(() => {
    return indiaStates.find(
      (state) => state.isoCode === selectedStateCode
    );
  }, [indiaStates, selectedStateCode]);

  /*
    Get cities for selected state.
  */
  const cities = useMemo(() => {
    if (!selectedStateCode) return [];

    return City.getCitiesOfState("IN", selectedStateCode);
  }, [selectedStateCode]);

  /*
    -------------------------------------------------------
    FORM STATE
    -------------------------------------------------------
  */

  const [business, setBusiness] = useState("Dairy");

  const [marginMoney, setMarginMoney] = useState(100000);

  const [income, setIncome] = useState(300000);

  const [category, setCategory] = useState("SC");

  const [searched, setSearched] = useState(false);

  /*
    -------------------------------------------------------
    FINANCIAL CALCULATION
    -------------------------------------------------------
    
    Demo assumption:
    Beneficiary contribution = 10%
    
    Therefore:
    Project Cost = Margin Money / 10%
    Loan = Project Cost - Margin Money
  */

  const calculatedProjectCost =
    marginMoney > 0 ? marginMoney / 0.1 : 0;

  const calculatedLoan = Math.max(
    calculatedProjectCost - marginMoney,
    0
  );

  /*
    -------------------------------------------------------
    SCHEME MATCHING
    -------------------------------------------------------
  */

  const matchedSchemes = useMemo(() => {
    if (!searched) return [];

    return demoSchemes.filter((scheme) => {
      const projectMatch =
        calculatedProjectCost >= scheme.minProject &&
        calculatedProjectCost <= scheme.maxProject;

      const businessMatch = scheme.categories.includes(business);

      const beneficiaryMatch =
        scheme.beneficiary.includes(category);

      return projectMatch && businessMatch && beneficiaryMatch;
    });
  }, [
    searched,
    calculatedProjectCost,
    business,
    category,
  ]);

  /*
    -------------------------------------------------------
    STATE CHANGE
    -------------------------------------------------------
  */

  const handleStateChange = (e) => {
    const code = e.target.value;

    setSelectedStateCode(code);

    setSelectedDistrict("");
    setSelectedCity("");
  };

  /*
    -------------------------------------------------------
    FIND SCHEMES
    -------------------------------------------------------
  */

  const handleFindSchemes = () => {
    setSearched(true);

    setTimeout(() => {
      document
        .getElementById("scheme-results")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
  };

  /*
    -------------------------------------------------------
    RESET
    -------------------------------------------------------
  */

  const handleReset = () => {
    setSelectedStateCode("MP");
    setSelectedDistrict("Indore");
    setSelectedCity("");

    setBusiness("Dairy");
    setMarginMoney(100000);
    setIncome(300000);
    setCategory("SC");

    setSearched(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="smart-scheme-page">

      {/* ==================================================
          NAVBAR
      ================================================== */}

      <nav className="scheme-navbar">

        <div className="scheme-nav-left">

          <button
            className="scheme-back-btn"
            onClick={() => navigate("/dashboard")}
            aria-label="Back"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="scheme-brand">
            <div className="scheme-brand-icon">
              <Landmark size={21} />
            </div>

            <div>
              <h2>Gram-Pragati AI</h2>
              <span>Government Scheme Matcher</span>
            </div>
          </div>

        </div>

        <div className="scheme-nav-trust">
          <ShieldCheck size={17} />
          <span>Verified Sources</span>
        </div>

      </nav>

      {/* ==================================================
          HERO
      ================================================== */}

      <section className="scheme-hero">

        <div className="scheme-hero-content">

          <div className="scheme-hero-badge">
            <Calculator size={17} />
            Smart Financial Structuring
          </div>

          <h1>
            Find the Right Government Scheme
            <span> for Your Business</span>
          </h1>

          <p>
            Tell us about your location, business idea and
            available margin money. Gram-Pragati AI calculates
            a potential project structure and identifies
            matching schemes.
          </p>

        </div>

      </section>

      {/* ==================================================
          INPUT SECTION
      ================================================== */}

      <main className="scheme-main">

        <section className="scheme-input-card">

          <div className="scheme-section-heading">

            <div>
              <h2>Tell us about your business</h2>

              <p>
                These details help us calculate and route
                your application.
              </p>
            </div>

            <div className="location-heading-icon">
              <MapPin size={24} />
            </div>

          </div>

          <div className="scheme-form-grid">

            {/* STATE */}

            <div className="scheme-field">

              <label>
                State / Union Territory
                <span>*</span>
              </label>

              <div className="scheme-select-wrapper">

                <MapPin size={17} />

                <select
                  value={selectedStateCode}
                  onChange={handleStateChange}
                >
                  {indiaStates.map((state) => (
                    <option
                      key={state.isoCode}
                      value={state.isoCode}
                    >
                      {state.name}
                    </option>
                  ))}
                </select>

              </div>

            </div>

            {/* DISTRICT */}

            <div className="scheme-field">

              <label>
                District
                <span>*</span>
              </label>

              <div className="scheme-select-wrapper">

                <MapPin size={17} />

                <select
                  value={selectedDistrict}
                  onChange={(e) =>
                    setSelectedDistrict(e.target.value)
                  }
                >
                  <option value="">
                    Select District
                  </option>

                  {cities.map((city, index) => (
                    <option
                      key={`${city.name}-${index}`}
                      value={city.name}
                    >
                      {city.name}
                    </option>
                  ))}
                </select>

              </div>

              <small>
                Select the nearest available district/city
                from the location database.
              </small>

            </div>

            {/* CITY */}

            <div className="scheme-field">

              <label>
                City / Town / Village
              </label>

              <div className="scheme-select-wrapper">

                <Building2 size={17} />

                <select
                  value={selectedCity}
                  onChange={(e) =>
                    setSelectedCity(e.target.value)
                  }
                  disabled={!selectedStateCode}
                >

                  <option value="">
                    Select City / Town
                  </option>

                  {cities.map((city, index) => (
                    <option
                      key={`${city.name}-${index}`}
                      value={city.name}
                    >
                      {city.name}
                    </option>
                  ))}

                </select>

              </div>

              <small>
                Village-level master data can be connected
                through the backend later.
              </small>

            </div>

            {/* BUSINESS */}

            <div className="scheme-field">

              <label>
                Business Category
                <span>*</span>
              </label>

              <div className="scheme-select-wrapper">

                <Building2 size={17} />

                <select
                  value={business}
                  onChange={(e) =>
                    setBusiness(e.target.value)
                  }
                >

                  {businessOptions.map((item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  ))}

                </select>

              </div>

            </div>

            {/* BENEFICIARY */}

            <div className="scheme-field">

              <label>
                Beneficiary Category
                <span>*</span>
              </label>

              <div className="scheme-select-wrapper">

                <ShieldCheck size={17} />

                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value)
                  }
                >

                  {beneficiaryOptions.map((item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  ))}

                </select>

              </div>

            </div>

            {/* MARGIN MONEY */}

            <div className="scheme-field">

              <label>
                Available Margin Money
                <span>*</span>
              </label>

              <div className="scheme-input-wrapper">

                <IndianRupee size={17} />

                <input
                  type="number"
                  min="0"
                  value={marginMoney}
                  onChange={(e) =>
                    setMarginMoney(
                      Number(e.target.value)
                    )
                  }
                  placeholder="Example: 100000"
                />

              </div>

              <small>
                Amount you can contribute towards the
                proposed project.
              </small>

            </div>

            {/* INCOME */}

            <div className="scheme-field">

              <label>
                Annual Family Income
              </label>

              <div className="scheme-input-wrapper">

                <IndianRupee size={17} />

                <input
                  type="number"
                  min="0"
                  value={income}
                  onChange={(e) =>
                    setIncome(
                      Number(e.target.value)
                    )
                  }
                  placeholder="Example: 300000"
                />

              </div>

              <small>
                Used as an additional screening input
                where applicable.
              </small>

            </div>

          </div>

          {/* ==================================================
              LOCATION SUMMARY
          ================================================== */}

          <div className="scheme-location-summary">

            <MapPin size={18} />

            <div>

              <strong>
                Selected Location
              </strong>

              <span>
                {selectedCity || selectedDistrict || "Select location"}
                {selectedDistrict &&
                  selectedCity &&
                  selectedCity !== selectedDistrict
                  ? `, ${selectedDistrict}`
                  : ""}
                {selectedState
                  ? `, ${selectedState.name}`
                  : ""}
              </span>

            </div>

          </div>

        </section>

        {/* ==================================================
            CALCULATION PREVIEW
        ================================================== */}

        <section className="scheme-calculation-preview">

          <div className="preview-heading">

            <div className="preview-icon">
              <Calculator size={22} />
            </div>

            <div>

              <h2>Smart Financial Calculation</h2>

              <p>
                Your available margin money is used to
                estimate a possible project structure.
              </p>

            </div>

          </div>

          <div className="preview-grid">

            <div className="preview-box">

              <span>Your Margin Money</span>

              <strong>
                {formatCurrency(marginMoney)}
              </strong>

              <small>
                Your contribution
              </small>

            </div>

            <div className="preview-arrow">
              →
            </div>

            <div className="preview-box">

              <span>Contribution Assumption</span>

              <strong>10%</strong>

              <small>
                Demo calculation
              </small>

            </div>

            <div className="preview-arrow">
              →
            </div>

            <div className="preview-box highlight">

              <span>Potential Project Cost</span>

              <strong>
                {formatCurrency(
                  calculatedProjectCost
                )}
              </strong>

              <small>
                Calculated estimate
              </small>

            </div>

            <div className="preview-arrow">
              →
            </div>

            <div className="preview-box loan">

              <span>Potential Loan</span>

              <strong>
                {formatCurrency(calculatedLoan)}
              </strong>

              <small>
                Calculated estimate
              </small>

            </div>

          </div>

          <div className="calculation-note">

            <AlertCircle size={18} />

            <p>
              This calculation uses a 10% beneficiary
              contribution as a demonstration assumption.
              The actual contribution, loan amount and
              eligibility depend on the applicable scheme
              and official rules.
            </p>

          </div>

          <button
            className="find-schemes-btn"
            onClick={handleFindSchemes}
          >
            <Search size={19} />
            Find Matching Schemes
            <ArrowRight size={19} />
          </button>

        </section>

        {/* ==================================================
            RESULTS
        ================================================== */}

        {searched && (
          <section
            className="scheme-results-section"
            id="scheme-results"
          >

            <div className="scheme-results-header">

              <div>

                <div className="result-label">
                  SEARCH RESULTS
                </div>

                <h2>
                  Potential Scheme Matches
                </h2>

                <p>
                  Based on your selected location,
                  business category, beneficiary category
                  and calculated project cost.
                </p>

              </div>

              <button
                className="reset-scheme-btn"
                onClick={handleReset}
              >
                <RefreshCw size={17} />
                Reset
              </button>

            </div>

            {/* ==================================================
                FINANCIAL RESULT
            ================================================== */}

            <div className="financial-result">

              <div className="financial-result-title">

                <Calculator size={21} />

                <div>
                  <strong>
                    Your Financial Snapshot
                  </strong>

                  <span>
                    Calculated from the information you entered
                  </span>
                </div>

              </div>

              <div className="financial-result-grid">

                <div>
                  <span>Margin Money</span>
                  <strong>
                    {formatCurrency(marginMoney)}
                  </strong>
                </div>

                <div>
                  <span>Project Cost</span>
                  <strong>
                    {formatCurrency(
                      calculatedProjectCost
                    )}
                  </strong>
                </div>

                <div>
                  <span>Potential Loan</span>
                  <strong>
                    {formatCurrency(calculatedLoan)}
                  </strong>
                </div>

                <div>
                  <span>Annual Income</span>
                  <strong>
                    {formatCurrency(income)}
                  </strong>
                </div>

              </div>

            </div>

            {/* ==================================================
                MATCHED SCHEMES
            ================================================== */}

            {matchedSchemes.length > 0 ? (

              <div className="scheme-results-grid">

                {matchedSchemes.map((scheme) => {

                  const loanForEmi = Math.min(
                    calculatedLoan,
                    scheme.maxLoan
                  );

                  const months =
                    scheme.type === "Term Loan"
                      ? 84
                      : 36;

                  const emi =
                    scheme.interest
                      ? calculateEMI(
                          loanForEmi,
                          scheme.interest,
                          months
                        )
                      : 0;

                  return (
                    <article
                      className="scheme-result-card"
                      key={scheme.id}
                    >

                      {/* RECOMMENDED STRIP */}

                      <div className="recommended-strip">
                        <CheckCircle2 size={16} />
                        Potential Match
                      </div>

                      {/* CARD HEADER */}

                      <div className="scheme-card-header">

                        <div className="scheme-card-icon">
                          <Landmark size={24} />
                        </div>

                        <div>

                          <div className="official-badge">
                            <ShieldCheck size={13} />
                            {scheme.source}
                          </div>

                          <h3>
                            {scheme.name}
                          </h3>

                          <span>
                            {scheme.type}
                          </span>

                        </div>

                      </div>

                      {/* STATS */}

                      <div className="scheme-result-stats">

                        <div>
                          <span>
                            Project Cost
                          </span>

                          <strong>
                            {formatCurrency(
                              scheme.minProject
                            )}{" "}
                            –{" "}
                            {formatCurrency(
                              scheme.maxProject
                            )}
                          </strong>
                        </div>

                        <div>
                          <span>
                            Maximum Loan
                          </span>

                          <strong>
                            {formatCurrency(
                              scheme.maxLoan
                            )}
                          </strong>
                        </div>

                        <div>
                          <span>
                            Interest
                          </span>

                          <strong>
                            {scheme.interest
                              ? `${scheme.interest}% p.a.`
                              : "Depends on lender"}
                          </strong>
                        </div>

                        <div>
                          <span>
                            Repayment
                          </span>

                          <strong>
                            {scheme.tenure}
                          </strong>
                        </div>

                        <div>
                          <span>
                            Moratorium
                          </span>

                          <strong>
                            {scheme.moratorium}
                          </strong>
                        </div>

                      </div>

                      {/* EMI */}

                      {emi > 0 ? (

                        <div className="emi-box">

                          <div className="emi-icon">
                            <Clock3 size={19} />
                          </div>

                          <div>

                            <span>
                              Illustrative Monthly EMI
                            </span>

                            <strong>
                              {formatCurrency(emi)}
                            </strong>

                            <small>
                              Calculated on{" "}
                              {formatCurrency(
                                loanForEmi
                              )}{" "}
                              over {months} months
                            </small>

                          </div>

                        </div>

                      ) : (

                        <div className="emi-box">

                          <div className="emi-icon">
                            <Calculator size={19} />
                          </div>

                          <div>

                            <span>
                              Repayment Estimate
                            </span>

                            <strong>
                              Depends on lender
                            </strong>

                            <small>
                              Interest and tenure vary
                              by lender.
                            </small>

                          </div>

                        </div>

                      )}

                      {/* WHY MATCHED */}

                      <div className="match-reason">

                        <strong>
                          Why this appears
                        </strong>

                        <div>

                          <span>
                            <CheckCircle2 size={15} />
                            Business category matches
                          </span>

                          <span>
                            <CheckCircle2 size={15} />
                            Beneficiary category matches
                          </span>

                          <span>
                            <CheckCircle2 size={15} />
                            Project cost falls within
                            scheme range
                          </span>

                        </div>

                      </div>

                      {/* ACTIONS */}

                      <div className="result-card-actions">

                        <button
                          className="eligibility-btn"
                          onClick={() =>
                            alert(
                              "Eligibility verification will be connected to the backend and official scheme rules."
                            )
                          }
                        >
                          <CheckCircle2 size={17} />
                          Check Eligibility
                        </button>

                        <button
                          className="source-btn"
                          onClick={() =>
                            alert(
                              "Official source links will be connected in the backend."
                            )
                          }
                        >
                          Official Source
                          <ExternalLink size={16} />
                        </button>

                      </div>

                    </article>
                  );
                })}

              </div>

            ) : (

              /* ==================================================
                  NO MATCH
              ================================================== */

              <div className="no-match-card">

                <div className="no-match-icon">
                  <AlertCircle size={27} />
                </div>

                <div>

                  <h3>
                    No potential match found
                  </h3>

                  <p>
                    No scheme in the current demo rules
                    matches all your selected conditions.
                    This does <strong>not</strong> mean that
                    you are officially ineligible.
                  </p>

                  <p>
                    Try changing the business category,
                    beneficiary category or project size,
                    or connect the backend to the complete
                    government scheme database.
                  </p>

                </div>

              </div>

            )}

          </section>
        )}

        {/* ==================================================
            HOW IT WORKS
        ================================================== */}

        <section className="scheme-how">

          <div className="scheme-section-heading center">

            <div>

              <div className="result-label">
                HOW IT WORKS
              </div>

              <h2>
                How Gram-Pragati AI Routes Your Application
              </h2>

              <p>
                The system separates calculations,
                government rules and AI explanations.
              </p>

            </div>

          </div>

          <div className="how-steps">

            <div className="how-step">

              <div className="how-number">
                01
              </div>

              <MapPin size={22} />

              <h3>
                Collect
              </h3>

              <p>
                Collect your location, business,
                beneficiary category and financial details.
              </p>

            </div>

            <div className="how-step">

              <div className="how-number">
                02
              </div>

              <Calculator size={22} />

              <h3>
                Calculate
              </h3>

              <p>
                Calculate project cost, possible loan
                amount and repayment estimates.
              </p>

            </div>

            <div className="how-step">

              <div className="how-number">
                03
              </div>

              <CheckCircle2 size={22} />

              <h3>
                Match
              </h3>

              <p>
                Match your information against structured
                government scheme rules.
              </p>

            </div>

            <div className="how-step">

              <div className="how-number">
                04
              </div>

              <ShieldCheck size={22} />

              <h3>
                Explain
              </h3>

              <p>
                AI explains the result in simple
                Hindi or English.
              </p>

            </div>

          </div>

        </section>

        {/* ==================================================
            WARNING
        ================================================== */}

        <section className="scheme-warning">

          <AlertCircle size={21} />

          <div>

            <strong>
              Important: Verify before applying
            </strong>

            <p>
              Scheme availability, eligibility,
              contribution, interest rate, loan limits
              and repayment terms can vary according to
              official rules and the applicable channelizing
              agency or lender. This frontend currently
              uses demonstration rules. Production data
              should come from verified government sources.
            </p>

          </div>

        </section>

        {/* ==================================================
            TRUST LABELS
        ================================================== */}

        <div className="scheme-trust">

          <div>
            <ShieldCheck size={17} />
            Verified Source
          </div>

          <div>
            <Calculator size={17} />
            Calculated
          </div>

          <div>
            <Search size={17} />
            AI Explanation
          </div>

          <div>
            <AlertCircle size={17} />
            Demo Rules
          </div>

        </div>

        {/* ==================================================
            NEXT STEP
        ================================================== */}

        <section className="scheme-next">

          <div>

            <div className="scheme-next-icon">
              <ArrowRight size={22} />
            </div>

            <div>

              <h2>
                Ready to build your application summary?
              </h2>

              <p>
                Review your business, financial structure
                and potential scheme match in one place.
              </p>

            </div>

          </div>

          <button
            onClick={() =>
              navigate("/application-summary")
            }
          >
            View Application Summary
            <ArrowRight size={18} />
          </button>

        </section>

      </main>

      {/* ==================================================
          MOBILE NAV
      ================================================== */}

      <div className="scheme-mobile-nav">

        <button
          onClick={() => navigate("/dashboard")}
        >
          <Building2 size={19} />
          <span>Home</span>
        </button>

        <button
          onClick={() => navigate("/voice-advisor")}
        >
          <Search size={19} />
          <span>Advisor</span>
        </button>

        <button
          className="active"
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            })
          }
        >
          <Landmark size={19} />
          <span>Schemes</span>
        </button>

        <button
          onClick={() => navigate("/money-planner")}
        >
          <Calculator size={19} />
          <span>Money</span>
        </button>

      </div>

    </div>
  );
}

export default SchemeMatcher;