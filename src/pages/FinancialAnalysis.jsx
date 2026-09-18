import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  Calculator,
  TrendingUp,
  Wallet,
  Landmark,
  CircleDollarSign,
  Target,
  Users,
  Info,
  AlertTriangle,
  Activity,
  BarChart3,
  Percent,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import { useNavigate } from "react-router-dom";

const initialInputs = {
  revenue: 500000,
  cogs: 200000,
  operatingExpenses: 120000,

  depreciation: 20000,
  amortization: 10000,

  interestExpense: 15000,
  taxes: 10000,

  fixedCosts: 120000,
  variableCosts: 200000,

  sellingPricePerUnit: 500,
  variableCostPerUnit: 200,

  totalDebt: 150000,
  ownersEquity: 250000,

  cash: 50000,
  bankBalance: 75000,
  accountsReceivable: 80000,
  inventory: 100000,
  otherQuickAssets: 10000,
  otherCurrentAssets: 15000,
  currentLiabilities: 100000,

  totalInvestment: 300000,

  beginningEquity: 220000,
  endingEquity: 250000,

  beginningAssets: 380000,
  endingAssets: 500000,

  potentialCustomers: 10000,
  serviceableCustomers: 4000,
  averageAnnualSpend: 12000,
  targetMarketShare: 5,

  marketingCost: 30000,
  salesCost: 15000,
  newCustomers: 100,

  assetCost: 200000,
  salvageValue: 20000,
  usefulLife: 10,
};

function money(value) {
  if (!Number.isFinite(value)) return "₹0";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function number(value, decimals = 2) {
  if (!Number.isFinite(value)) return "0";
  return value.toFixed(decimals);
}

function percentage(value) {
  if (!Number.isFinite(value)) return "0%";
  return `${number(value, 2)}%`;
}

function safeDivide(a, b) {
  if (!Number.isFinite(a) || !Number.isFinite(b) || b === 0) {
    return 0;
  }

  return a / b;
}

function MetricCard({
  icon: Icon,
  title,
  value,
  subtitle,
  formula,
  type = "normal",
}) {
  return (
    <div className={`finance-metric-card ${type}`}>
      <div className="finance-metric-top">
        <div className="finance-metric-icon">
          <Icon size={21} />
        </div>

        <span className="finance-metric-title">{title}</span>
      </div>

      <div className="finance-metric-value">{value}</div>

      {subtitle && (
        <div className="finance-metric-subtitle">{subtitle}</div>
      )}

      {formula && (
        <div className="finance-formula">
          <Info size={13} />
          {formula}
        </div>
      )}
    </div>
  );
}

function InputField({ label, value, onChange, prefix = "₹", step = "1" }) {
  return (
    <div className="finance-input-group">
      <label>{label}</label>

      <div className="finance-input-wrapper">
        {prefix && <span>{prefix}</span>}

        <input
          type="number"
          min="0"
          step={step}
          value={value}
          onChange={(e) =>
            onChange(Math.max(Number(e.target.value) || 0, 0))
          }
        />
      </div>
    </div>
  );
}

export default function FinancialAnalysis() {
  const navigate = useNavigate();

  const [inputs, setInputs] = useState(initialInputs);

  const updateInput = (key, value) => {
    setInputs((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const results = useMemo(() => {
    const {
      revenue,
      cogs,
      operatingExpenses,
      depreciation,
      amortization,
      interestExpense,
      taxes,
      fixedCosts,
      variableCosts,
      sellingPricePerUnit,
      variableCostPerUnit,
      totalDebt,
      ownersEquity,
      cash,
      bankBalance,
      accountsReceivable,
      inventory,
      otherQuickAssets,
      otherCurrentAssets,
      currentLiabilities,
      totalInvestment,
      beginningEquity,
      endingEquity,
      beginningAssets,
      endingAssets,
      potentialCustomers,
      serviceableCustomers,
      averageAnnualSpend,
      targetMarketShare,
      marketingCost,
      salesCost,
      newCustomers,
      assetCost,
      salvageValue,
      usefulLife,
    } = inputs;

    // -------------------------
    // PROFITABILITY
    // -------------------------

    const grossProfit = revenue - cogs;

    const grossProfitMargin = safeDivide(grossProfit, revenue) * 100;

    // Operating Profit = EBIT
    const ebit = grossProfit - operatingExpenses;

    const ebitMargin = safeDivide(ebit, revenue) * 100;

    // EBITDA
    const ebitda = ebit + depreciation + amortization;

    const ebitdaMargin = safeDivide(ebitda, revenue) * 100;

    // Net Profit
    const netProfit = ebit - interestExpense - taxes;

    const netProfitMargin = safeDivide(netProfit, revenue) * 100;

    // -------------------------
    // DEPRECIATION
    // -------------------------

    const calculatedDepreciation =
      usefulLife > 0
        ? (assetCost - salvageValue) / usefulLife
        : 0;

    // -------------------------
    // CONTRIBUTION MARGIN
    // -------------------------

    const contributionMargin = revenue - variableCosts;

    const contributionMarginRatio =
      safeDivide(contributionMargin, revenue) * 100;

    const contributionMarginPerUnit =
      sellingPricePerUnit - variableCostPerUnit;

    // -------------------------
    // BREAK EVEN
    // -------------------------

    const breakEvenQuantity =
      contributionMarginPerUnit > 0
        ? fixedCosts / contributionMarginPerUnit
        : 0;

    const breakEvenRevenue =
      breakEvenQuantity * sellingPricePerUnit;

    const currentEstimatedSales =
      sellingPricePerUnit > 0
        ? revenue / sellingPricePerUnit
        : 0;

    const distanceFromBreakEven =
      currentEstimatedSales - breakEvenQuantity;

    // -------------------------
    // FINANCIAL HEALTH
    // -------------------------

    const debtToEquity =
      safeDivide(totalDebt, ownersEquity);

    const interestCoverage =
      interestExpense > 0
        ? ebit / interestExpense
        : 0;

    const quickAssets =
      cash +
      bankBalance +
      accountsReceivable +
      otherQuickAssets;

    const quickRatio =
      safeDivide(quickAssets, currentLiabilities);

    const currentAssets =
      cash +
      bankBalance +
      accountsReceivable +
      inventory +
      otherCurrentAssets;

    const workingCapital =
      currentAssets - currentLiabilities;

    // -------------------------
    // RETURNS
    // -------------------------

    const roi =
      safeDivide(netProfit, totalInvestment) * 100;

    const averageEquity =
      beginningEquity > 0 && endingEquity > 0
        ? (beginningEquity + endingEquity) / 2
        : endingEquity;

    const roe =
      safeDivide(netProfit, averageEquity) * 100;

    const averageAssets =
      beginningAssets > 0 && endingAssets > 0
        ? (beginningAssets + endingAssets) / 2
        : endingAssets;

    const roa =
      safeDivide(netProfit, averageAssets) * 100;

    // -------------------------
    // MARKET SIZE
    // -------------------------

    const tam =
      potentialCustomers * averageAnnualSpend;

    const sam =
      serviceableCustomers * averageAnnualSpend;

    const som =
      sam * (targetMarketShare / 100);

    // -------------------------
    // CAC
    // -------------------------

    const cac =
      safeDivide(
        marketingCost + salesCost,
        newCustomers
      );

    return {
      grossProfit,
      grossProfitMargin,

      ebit,
      ebitMargin,

      ebitda,
      ebitdaMargin,

      netProfit,
      netProfitMargin,

      calculatedDepreciation,

      contributionMargin,
      contributionMarginRatio,
      contributionMarginPerUnit,

      breakEvenQuantity,
      breakEvenRevenue,
      currentEstimatedSales,
      distanceFromBreakEven,

      debtToEquity,
      interestCoverage,
      quickRatio,
      workingCapital,

      roi,
      roe,
      roa,

      tam,
      sam,
      som,

      cac,
    };
  }, [inputs]);

  const breakEvenData = useMemo(() => {
    const maxUnits = Math.max(
      Math.ceil(results.breakEvenQuantity * 1.8),
      Math.ceil(results.currentEstimatedSales * 1.3),
      10
    );

    const step = Math.max(Math.ceil(maxUnits / 8), 1);

    const data = [];

    for (let units = 0; units <= maxUnits; units += step) {
      const sales = units * inputs.sellingPricePerUnit;

      const totalCost =
        inputs.fixedCosts +
        units * inputs.variableCostPerUnit;

      data.push({
        units,
        sales,
        totalCost,
      });
    }

    return data;
  }, [
    results.breakEvenQuantity,
    results.currentEstimatedSales,
    inputs.sellingPricePerUnit,
    inputs.fixedCosts,
    inputs.variableCostPerUnit,
  ]);

  return (
    <div className="finance-page">

      {/* HEADER */}
      <div className="finance-header">

        <button
          className="finance-back-btn"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={19} />
          Back
        </button>

        <div>
          <h1>
            <Calculator size={28} />
            Financial Analysis
          </h1>

          <p>
            Understand your business profitability,
            financial health and market opportunity.
          </p>
        </div>

      </div>

      {/* SAMPLE DATA WARNING */}
      <div className="finance-warning">
        <AlertTriangle size={20} />

        <div>
          <strong>Sample / Estimated Data</strong>

          <p>
            The values shown are sample inputs for demonstration.
            Replace them with your actual business figures before
            making financial decisions.
          </p>
        </div>
      </div>

      {/* INPUT SECTION */}

      <section className="finance-section">

        <div className="finance-section-heading">
          <div className="finance-section-icon">
            <Wallet size={22} />
          </div>

          <div>
            <h2>Business Financial Inputs</h2>
            <p>
              Enter your business figures to calculate the metrics.
            </p>
          </div>
        </div>

        <div className="finance-input-grid">

          <InputField
            label="Annual Revenue / Sales"
            value={inputs.revenue}
            onChange={(v) => updateInput("revenue", v)}
          />

          <InputField
            label="Cost of Goods Sold (COGS)"
            value={inputs.cogs}
            onChange={(v) => updateInput("cogs", v)}
          />

          <InputField
            label="Operating Expenses"
            value={inputs.operatingExpenses}
            onChange={(v) =>
              updateInput("operatingExpenses", v)
            }
          />

          <InputField
            label="Depreciation"
            value={inputs.depreciation}
            onChange={(v) =>
              updateInput("depreciation", v)
            }
          />

          <InputField
            label="Amortization"
            value={inputs.amortization}
            onChange={(v) =>
              updateInput("amortization", v)
            }
          />

          <InputField
            label="Interest Expense"
            value={inputs.interestExpense}
            onChange={(v) =>
              updateInput("interestExpense", v)
            }
          />

          <InputField
            label="Taxes"
            value={inputs.taxes}
            onChange={(v) => updateInput("taxes", v)}
          />

          <InputField
            label="Fixed Costs"
            value={inputs.fixedCosts}
            onChange={(v) =>
              updateInput("fixedCosts", v)
            }
          />

          <InputField
            label="Variable Costs"
            value={inputs.variableCosts}
            onChange={(v) =>
              updateInput("variableCosts", v)
            }
          />

          <InputField
            label="Selling Price / Unit"
            value={inputs.sellingPricePerUnit}
            onChange={(v) =>
              updateInput("sellingPricePerUnit", v)
            }
          />

          <InputField
            label="Variable Cost / Unit"
            value={inputs.variableCostPerUnit}
            onChange={(v) =>
              updateInput("variableCostPerUnit", v)
            }
          />

          <InputField
            label="Total Investment"
            value={inputs.totalInvestment}
            onChange={(v) =>
              updateInput("totalInvestment", v)
            }
          />

        </div>

      </section>

      {/* PROFITABILITY */}

      <section className="finance-section">

        <div className="finance-section-heading">
          <div className="finance-section-icon">
            <TrendingUp size={22} />
          </div>

          <div>
            <h2>Profitability Analysis</h2>
            <p>
              Measure how efficiently your business generates profit.
            </p>
          </div>
        </div>

        <div className="finance-metric-grid">

          <MetricCard
            icon={CircleDollarSign}
            title="Gross Profit"
            value={money(results.grossProfit)}
            subtitle={`Margin: ${percentage(
              results.grossProfitMargin
            )}`}
            formula="Revenue − COGS"
            type="positive"
          />

          <MetricCard
            icon={TrendingUp}
            title="Operating Profit (EBIT)"
            value={money(results.ebit)}
            subtitle={`Margin: ${percentage(
              results.ebitMargin
            )}`}
            formula="Gross Profit − Operating Expenses"
          />

          <MetricCard
            icon={BarChart3}
            title="EBITDA"
            value={money(results.ebitda)}
            subtitle={`Margin: ${percentage(
              results.ebitdaMargin
            )}`}
            formula="EBIT + Depreciation + Amortization"
          />

          <MetricCard
            icon={CircleDollarSign}
            title="Net Profit"
            value={money(results.netProfit)}
            subtitle={`Margin: ${percentage(
              results.netProfitMargin
            )}`}
            formula="EBIT − Interest − Taxes"
            type="positive"
          />

        </div>

      </section>

      {/* BREAK EVEN */}

      <section className="finance-section">

        <div className="finance-section-heading">
          <div className="finance-section-icon">
            <Target size={22} />
          </div>

          <div>
            <h2>Break-Even & Cost Structure</h2>
            <p>
              Find the sales level where your business covers its costs.
            </p>
          </div>
        </div>

        <div className="finance-metric-grid">

          <MetricCard
            icon={Target}
            title="Break-Even Point"
            value={`${number(
              results.breakEvenQuantity
            )} units`}
            subtitle={`Revenue: ${money(
              results.breakEvenRevenue
            )}`}
            formula="Fixed Costs ÷ Contribution per Unit"
          />

          <MetricCard
            icon={Percent}
            title="Contribution Margin"
            value={money(results.contributionMargin)}
            subtitle={`${percentage(
              results.contributionMarginRatio
            )} of revenue`}
            formula="Revenue − Variable Costs"
          />

          <MetricCard
            icon={Calculator}
            title="Contribution / Unit"
            value={money(
              results.contributionMarginPerUnit
            )}
            formula="Selling Price − Variable Cost"
          />

          <MetricCard
            icon={Activity}
            title="Distance from Break-Even"
            value={`${number(
              results.distanceFromBreakEven
            )} units`}
            subtitle={
              results.distanceFromBreakEven >= 0
                ? "Above break-even"
                : "Below break-even"
            }
            type={
              results.distanceFromBreakEven >= 0
                ? "positive"
                : "warning"
            }
          />

        </div>

        <div className="finance-chart-card">

          <div className="finance-chart-title">
            <h3>Break-Even Visualization</h3>
            <p>
              Sales compared with total costs at different sales volumes.
            </p>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={breakEvenData}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="units"
                label={{
                  value: "Units Sold",
                  position: "insideBottom",
                  offset: -5,
                }}
              />

              <YAxis
                tickFormatter={(value) =>
                  `₹${Math.round(value / 1000)}k`
                }
              />

              <Tooltip
                formatter={(value) => money(value)}
              />

              <Legend />

              <Line
                type="monotone"
                dataKey="sales"
                name="Sales Revenue"
                strokeWidth={3}
                dot={false}
              />

              <Line
                type="monotone"
                dataKey="totalCost"
                name="Total Cost"
                strokeWidth={3}
                dot={false}
              />

              <ReferenceLine
                x={Math.round(
                  results.breakEvenQuantity
                )}
                strokeDasharray="5 5"
                label="Break-Even"
              />

            </LineChart>
          </ResponsiveContainer>

        </div>

      </section>

      {/* FINANCIAL HEALTH */}

      <section className="finance-section">

        <div className="finance-section-heading">
          <div className="finance-section-icon">
            <Landmark size={22} />
          </div>

          <div>
            <h2>Financial Health</h2>
            <p>
              Understand debt, liquidity and your ability to meet obligations.
            </p>
          </div>
        </div>

        <div className="finance-input-grid">

          <InputField
            label="Total Debt"
            value={inputs.totalDebt}
            onChange={(v) =>
              updateInput("totalDebt", v)
            }
          />

          <InputField
            label="Owners' Equity"
            value={inputs.ownersEquity}
            onChange={(v) =>
              updateInput("ownersEquity", v)
            }
          />

          <InputField
            label="Cash"
            value={inputs.cash}
            onChange={(v) =>
              updateInput("cash", v)
            }
          />

          <InputField
            label="Bank Balance"
            value={inputs.bankBalance}
            onChange={(v) =>
              updateInput("bankBalance", v)
            }
          />

          <InputField
            label="Accounts Receivable"
            value={inputs.accountsReceivable}
            onChange={(v) =>
              updateInput("accountsReceivable", v)
            }
          />

          <InputField
            label="Inventory"
            value={inputs.inventory}
            onChange={(v) =>
              updateInput("inventory", v)
            }
          />

          <InputField
            label="Current Liabilities"
            value={inputs.currentLiabilities}
            onChange={(v) =>
              updateInput("currentLiabilities", v)
            }
          />

        </div>

        <div className="finance-metric-grid">

          <MetricCard
            icon={Landmark}
            title="Debt-to-Equity Ratio"
            value={`${number(
              results.debtToEquity
            )} : 1`}
            subtitle="Debt relative to owners' equity"
            formula="Total Debt ÷ Owners' Equity"
          />

          <MetricCard
            icon={Activity}
            title="Interest Coverage Ratio"
            value={`${number(
              results.interestCoverage
            )}x`}
            subtitle="Ability to cover interest expense"
            formula="EBIT ÷ Interest Expense"
          />

          <MetricCard
            icon={Wallet}
            title="Quick Ratio"
            value={`${number(
              results.quickRatio
            )} : 1`}
            subtitle="Short-term liquidity"
            formula="Quick Assets ÷ Current Liabilities"
          />

          <MetricCard
            icon={Wallet}
            title="Working Capital"
            value={money(results.workingCapital)}
            subtitle="Current assets minus liabilities"
            formula="Current Assets − Current Liabilities"
          />

        </div>

      </section>

      {/* RETURNS */}

      <section className="finance-section">

        <div className="finance-section-heading">
          <div className="finance-section-icon">
            <Percent size={22} />
          </div>

          <div>
            <h2>Business Returns</h2>
            <p>
              Measure returns generated from investment, equity and assets.
            </p>
          </div>
        </div>

        <div className="finance-input-grid">

          <InputField
            label="Beginning Equity"
            value={inputs.beginningEquity}
            onChange={(v) =>
              updateInput("beginningEquity", v)
            }
          />

          <InputField
            label="Ending Equity"
            value={inputs.endingEquity}
            onChange={(v) =>
              updateInput("endingEquity", v)
            }
          />

          <InputField
            label="Beginning Assets"
            value={inputs.beginningAssets}
            onChange={(v) =>
              updateInput("beginningAssets", v)
            }
          />

          <InputField
            label="Ending Assets"
            value={inputs.endingAssets}
            onChange={(v) =>
              updateInput("endingAssets", v)
            }
          />

        </div>

        <div className="finance-metric-grid">

          <MetricCard
            icon={TrendingUp}
            title="Return on Investment (ROI)"
            value={percentage(results.roi)}
            subtitle="Return generated from investment"
            formula="Net Profit ÷ Total Investment × 100"
          />

          <MetricCard
            icon={Users}
            title="Return on Equity (ROE)"
            value={percentage(results.roe)}
            subtitle="Return generated on owners' equity"
            formula="Net Profit ÷ Average Equity × 100"
          />

          <MetricCard
            icon={BarChart3}
            title="Return on Assets (ROA)"
            value={percentage(results.roa)}
            subtitle="Return generated from assets"
            formula="Net Profit ÷ Average Assets × 100"
          />

          <MetricCard
            icon={Calculator}
            title="Annual Depreciation"
            value={money(
              results.calculatedDepreciation
            )}
            subtitle="Straight-line estimate"
            formula="(Asset Cost − Salvage Value) ÷ Useful Life"
          />

        </div>

      </section>

      {/* MARKET OPPORTUNITY */}

      <section className="finance-section">

        <div className="finance-section-heading">
          <div className="finance-section-icon">
            <Users size={22} />
          </div>

          <div>
            <h2>Market Opportunity</h2>
            <p>
              Estimate the potential size of your target market.
            </p>
          </div>
        </div>

        <div className="finance-input-grid">

          <InputField
            label="Potential Customers"
            value={inputs.potentialCustomers}
            onChange={(v) =>
              updateInput("potentialCustomers", v)
            }
            prefix=""
          />

          <InputField
            label="Serviceable Customers"
            value={inputs.serviceableCustomers}
            onChange={(v) =>
              updateInput("serviceableCustomers", v)
            }
            prefix=""
          />

          <InputField
            label="Average Annual Spend"
            value={inputs.averageAnnualSpend}
            onChange={(v) =>
              updateInput("averageAnnualSpend", v)
            }
          />

          <InputField
            label="Target Market Share"
            value={inputs.targetMarketShare}
            onChange={(v) =>
              updateInput("targetMarketShare", v)
            }
            prefix="%"
            step="0.1"
          />

        </div>

        <div className="finance-metric-grid">

          <MetricCard
            icon={Users}
            title="TAM"
            value={money(results.tam)}
            subtitle="Total Addressable Market"
            formula="Potential Customers × Average Annual Spend"
          />

          <MetricCard
            icon={Target}
            title="SAM"
            value={money(results.sam)}
            subtitle="Serviceable Available Market"
            formula="Serviceable Customers × Average Annual Spend"
          />

          <MetricCard
            icon={TrendingUp}
            title="SOM"
            value={money(results.som)}
            subtitle="Serviceable Obtainable Market"
            formula="SAM × Target Market Share"
          />

          <MetricCard
            icon={Users}
            title="Customer Acquisition Cost"
            value={money(results.cac)}
            subtitle="Estimated CAC"
            formula="Marketing + Sales Cost ÷ New Customers"
          />

        </div>

      </section>

      {/* FOOTER DISCLAIMER */}

      <div className="finance-disclaimer">

        <AlertTriangle size={19} />

        <div>
          <strong>Important:</strong>

          <p>
            These calculations are estimates based on the information
            entered by the user. Actual business performance, taxation,
            lending terms, depreciation rules and market size may vary.
            Use verified financial records and professional advice before
            making major financial decisions.
          </p>
        </div>

      </div>

    </div>
  );
}