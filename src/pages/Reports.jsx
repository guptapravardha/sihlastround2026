import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  ArrowLeft,
  Download,
  Printer,
  FileText,
  TrendingUp,
  IndianRupee,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Loader2,
  Building2,
  HelpCircle,
  Home,
  Mic,
  Lightbulb,
  User,
} from "lucide-react";
import { api } from "../services/apiClient";
function Reports() {
  const navigate = useNavigate();
  const reportRef = useRef();
  const [isDownloading, setIsDownloading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [summaryError, setSummaryError] = useState("");

  useEffect(() => {
    api
      .financialSummary()
      .then(setSummary)
      .catch((err) => setSummaryError(err.message || "Could not load financial data."));
  }, []);

  // PDF Generation Function
  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    const element = reportRef.current;
    
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("Gram_Pragati_Business_Report.pdf");
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const reportItems = [
    {
      title: "Local Business Analysis",
      description: "Demand, competition and opportunity overview",
      icon: <TrendingUp size={20} />,
      status: "Completed",
    },
    {
      title: "Business Simulation",
      description: "Estimated revenue, expenses and profit",
      icon: <IndianRupee size={20} />,
      status: "Completed",
    },
    {
      title: "Money Planning",
      description: "Investment, loan, EMI and repayment analysis",
      icon: <Building2 size={20} />,
      status: "Completed",
    },
    {
      title: "Government Scheme Matching",
      description: "Potential schemes based on your business profile",
      icon: <FileText size={20} />,
      status: "Review Required",
    },
  ];

  return (
    <div className="reports-page">
      {/* Navbar */}
      <nav className="reports-navbar">
        <div className="reports-brand">
          <div className="reports-logo">🌱</div>
          <div>
            <h2>Gram-Pragati AI</h2>
            <span>Business Partner for Rural India</span>
          </div>
        </div>

        <div className="reports-profile">
          <div className="reports-avatar">S</div>
          <span>Sandhya</span>
        </div>
      </nav>

      {/* Action Header */}
      <div className="reports-top-bar">
        <button className="reports-back" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="reports-actions">
          <button className="reports-print" onClick={() => window.print()}>
            <Printer size={16} />
            Print
          </button>

          <button
            className="reports-download"
            onClick={handleDownloadPdf}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Download size={16} />
            )}
            {isDownloading ? "Generating..." : "Download Report"}
          </button>
        </div>
      </div>

      {/* Downloadable Canvas Content */}
      <main className="reports-container" ref={reportRef}>
        {/* Document Title Header */}
        <header className="reports-header-card">
          <div className="reports-header-info">
            <span className="sample-badge">Sample Report</span>
            <h1>Small Dairy Business Report</h1>
            <p>Generated from your personalized financial plan inputs.</p>
          </div>
          <div className="reports-location-pill">
            <MapPin size={18} />
            <div>
              <span className="label">Location</span>
              <span className="val">Indore, Madhya Pradesh</span>
            </div>
          </div>
        </header>

        {/* Business Overview Grid */}
        <section className="report-overview-card">
          <div className="overview-item">
            <span>Business Type</span>
            <strong>Small Dairy Unit</strong>
          </div>
          <div className="overview-item">
            <span>Location</span>
            <strong>Indore, MP</strong>
          </div>
          <div className="overview-item">
            <span>Total Investment</span>
            <strong>₹50,000</strong>
          </div>
          <div className="overview-item">
            <span>Own Contribution</span>
            <strong>₹20,000</strong>
          </div>
        </section>

        {/* Report Sections Tracker */}
        <section className="report-section-block">
          <div className="section-heading">
            <h2>Report Sections</h2>
            <p>Review completed components of your business report.</p>
          </div>

          <div className="report-list">
            {reportItems.map((item, index) => (
              <div className="report-item" key={index}>
                <div className="report-item-left">
                  <div className="report-item-icon">{item.icon}</div>
                  <div className="report-item-content">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </div>

                <div
                  className={`report-status ${
                    item.status === "Completed" ? "completed" : "review"
                  }`}
                >
                  {item.status === "Completed" ? (
                    <CheckCircle2 size={14} />
                  ) : (
                    <AlertTriangle size={14} />
                  )}
                  {item.status}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Financial Metrics Snapshot */}
        <section className="report-section-block">
          <div className="section-heading-row">
            <div>
              <h2>Financial Snapshot</h2>
              <p>{summary ? "Based on your recorded sales, expenses and financial records" : "Estimated monthly financial projection breakdown"}</p>
            </div>
            <span className="calculated-badge">{summary ? "Your Data" : "Calculated Data"}</span>
          </div>

          {summaryError && <p style={{ color: "#b91c1c" }}>{summaryError}</p>}

          <div className="snapshot-grid">
            <div className="snapshot-card">
              <span>Total Revenue</span>
              <strong className="text-green">₹{(summary?.totalRevenue ?? 18000).toLocaleString("en-IN")}</strong>
            </div>

            <div className="snapshot-card">
              <span>Total Expenses</span>
              <strong className="text-red">₹{(summary?.totalExpenses ?? 11000).toLocaleString("en-IN")}</strong>
            </div>

            <div className="snapshot-card profit-card">
              <span>Net Profit</span>
              <strong>₹{(summary?.netProfit ?? 7000).toLocaleString("en-IN")}</strong>
            </div>

            <div className="snapshot-card">
              <span>Total Investment</span>
              <strong>₹{(summary?.totalInvestment ?? 20000).toLocaleString("en-IN")}</strong>
            </div>

            <div className="snapshot-card">
              <span>Total Loans</span>
              <strong>₹{(summary?.totalLoans ?? 30000).toLocaleString("en-IN")}</strong>
            </div>

            <div className="snapshot-card surplus-card">
              <span>Inventory Value</span>
              <strong>₹{(summary?.inventoryValue ?? 0).toLocaleString("en-IN")}</strong>
            </div>
          </div>
        </section>

        {/* AI Key Insights */}
        <section className="findings-card">
          <div className="section-heading-row">
            <div>
              <h2>Key Insights</h2>
              <p>Summary of automated business findings</p>
            </div>
            <span className="ai-badge">AI Insights</span>
          </div>

          <div className="finding-grid">
            <div className="finding-box">
              <span className="finding-num">01</span>
              <p>Local dairy demand appears strong based on regional sample analysis.</p>
            </div>

            <div className="finding-box">
              <span className="finding-num">02</span>
              <p>Estimated net monthly operating profit is ₹7,000 prior to debt service.</p>
            </div>

            <div className="finding-box">
              <span className="finding-num">03</span>
              <p>Monthly loan repayment (EMI) stays capped around ₹1,384.</p>
            </div>

            <div className="finding-box">
              <span className="finding-num">04</span>
              <p>Verify feed costs and direct buyer agreements prior to upfront capital outlays.</p>
            </div>
          </div>
        </section>

        {/* Disclaimer Notice */}
        <section className="reports-warning">
          <AlertTriangle size={24} className="warning-icon" />
          <div>
            <h3>Important Disclaimer</h3>
            <p>
              This report contains projections and sample estimates for planning
              purposes only. It does not constitute formal financial underwriting or guaranteed government funding.
            </p>
          </div>
        </section>

        {/* Trust Badges */}
        <div className="reports-trust">
          <span className="trust verified">🟢 Verified Source</span>
          <span className="trust ai">🔵 AI Generated</span>
          <span className="trust calculated">🟡 Auto-Calculated</span>
          <span className="trust sample">⚪ Sample Projection</span>
        </div>

        {/* CTA Banner */}
        <div className="reports-next">
          <div>
            <h2>Want to modify these projections?</h2>
            <p>Adjust assumptions to recalculate costs, loan limits, and expected revenues.</p>
          </div>
          <button onClick={() => navigate("/simulator")}>
            Open Simulator
            <ArrowRight size={18} />
          </button>
        </div>
      </main>

      {/* Mobile Navigation */}
      <nav className="reports-mobile-nav">
        <button onClick={() => navigate("/dashboard")}>
          <Home size={18} />
          <span>Home</span>
        </button>
        <button onClick={() => navigate("/voice-advisor")}>
          <Mic size={18} />
          <span>Advisor</span>
        </button>
        <button onClick={() => navigate("/opportunity")}>
          <Lightbulb size={18} />
          <span>Ideas</span>
        </button>
        <button onClick={() => navigate("/money-planner")}>
          <IndianRupee size={18} />
          <span>Money</span>
        </button>
        <button>
          <User size={18} />
          <span>Profile</span>
        </button>
      </nav>
    </div>
  );
}

export default Reports;