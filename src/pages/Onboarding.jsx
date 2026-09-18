import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Wallet,
  BriefcaseBusiness,
  ArrowRight,
  ArrowLeft,
  Check,
} from "lucide-react";
import { api } from "../services/apiClient";

const steps = [
  {
    title: "Where are you from?",
    subtitle: "Tell us about your location",
    icon: MapPin,
  },
  {
    title: "What resources do you have?",
    subtitle: "Your budget and experience",
    icon: Wallet,
  },
  {
    title: "What do you want to do?",
    subtitle: "Choose your business interest",
    icon: BriefcaseBusiness,
  },
  {
    title: "You're all set!",
    subtitle: "Let's build your business plan",
    icon: Check,
  },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const [formData, setFormData] = useState({
    village: "",
    district: "",
    state: "",
    budget: "",
    experience: "",
    interest: "",
  });

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const nextStep = async () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
      return;
    }

    setSaving(true);
    setSaveError("");
    try {
      await api.updateBusinessProfile({
        village: formData.village,
        district: formData.district,
        state: formData.state,
        budgetRange: formData.budget,
        experience: formData.experience,
        interest: formData.interest,
        onboardingComplete: true,
      });
      navigate("/dashboard");
    } catch (err) {
      setSaveError(err.message || "Could not save your details. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const previousStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const Icon = steps[step].icon;

  return (
    <div className="onboarding-page">
      <div className="onboarding-container">

        {/* Header */}
        <div className="onboarding-header">
          <div className="brand-small">
            🌾 <span>Gram-Pragati AI</span>
          </div>

          <div className="progress-text">
            Step {step + 1} of {steps.length}
          </div>
        </div>

        {/* Progress */}
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${((step + 1) / steps.length) * 100}%`,
            }}
          />
        </div>

        {/* Main Card */}
        <div className="onboarding-card">

          <div className="step-icon">
            <Icon size={30} />
          </div>

          <h1>{steps[step].title}</h1>
          <p className="step-subtitle">{steps[step].subtitle}</p>

          {/* STEP 1 */}
          {step === 0 && (
            <div className="form-section">
              <label>Village / Town</label>
              <input
                type="text"
                placeholder="Enter your village"
                value={formData.village}
                onChange={(e) =>
                  updateField("village", e.target.value)
                }
              />

              <label>District</label>
              <input
                type="text"
                placeholder="Enter your district"
                value={formData.district}
                onChange={(e) =>
                  updateField("district", e.target.value)
                }
              />

              <label>State</label>
              <select
                value={formData.state}
                onChange={(e) =>
                  updateField("state", e.target.value)
                }
              >
                <option value="">Select state</option>
                <option>Madhya Pradesh</option>
                <option>Maharashtra</option>
                <option>Rajasthan</option>
                <option>Gujarat</option>
                <option>Uttar Pradesh</option>
                <option>Other</option>
              </select>
            </div>
          )}

          {/* STEP 2 */}
          {step === 1 && (
            <div className="form-section">
              <label>How much can you invest?</label>

              <div className="budget-grid">
                {[
                  "Below ₹20,000",
                  "₹20,000 - ₹50,000",
                  "₹50,000 - ₹1 Lakh",
                  "Above ₹1 Lakh",
                ].map((budget) => (
                  <button
                    key={budget}
                    className={`choice-button ${
                      formData.budget === budget ? "selected" : ""
                    }`}
                    onClick={() => updateField("budget", budget)}
                  >
                    {budget}
                  </button>
                ))}
              </div>

              <label>Your previous experience</label>

              <div className="budget-grid">
                {[
                  "No experience",
                  "Some experience",
                  "Experienced",
                ].map((experience) => (
                  <button
                    key={experience}
                    className={`choice-button ${
                      formData.experience === experience
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      updateField("experience", experience)
                    }
                  >
                    {experience}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 2 && (
            <div className="form-section">
              <label>What kind of business interests you?</label>

              <div className="interest-grid">
                {[
                  "🐄 Dairy",
                  "🌾 Agriculture",
                  "🥛 Food Processing",
                  "🏪 Retail Shop",
                  "🐔 Poultry",
                  "🧵 Handicrafts",
                  "💻 Digital Services",
                  "🤔 Not Sure",
                ].map((interest) => (
                  <button
                    key={interest}
                    className={`choice-button ${
                      formData.interest === interest
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      updateField("interest", interest)
                    }
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 3 && (
            <div className="success-onboarding">
              <div className="success-circle">
                <Check size={40} />
              </div>

              <h2>Welcome to Gram-Pragati AI 🌱</h2>

              <p>
                Your information will help us understand your
                situation and suggest suitable business
                opportunities.
              </p>

              <div className="summary-box">
                <div>
                  <span>📍 Location</span>
                  <strong>
                    {formData.village || "Not provided"}
                  </strong>
                </div>

                <div>
                  <span>💰 Budget</span>
                  <strong>
                    {formData.budget || "Not provided"}
                  </strong>
                </div>

                <div>
                  <span>💼 Interest</span>
                  <strong>
                    {formData.interest || "Not provided"}
                  </strong>
                </div>
              </div>
            </div>
          )}

          {/* Buttons */}
          {saveError && (
            <p style={{ color: "#b91c1c", fontSize: "14px", marginTop: "8px" }}>{saveError}</p>
          )}
          <div className="onboarding-actions">
            {step > 0 && (
              <button
                className="back-button"
                onClick={previousStep}
              >
                <ArrowLeft size={18} />
                Back
              </button>
            )}

            <button
              className="next-button"
              onClick={nextStep}
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : step === steps.length - 1
                ? "Go to Dashboard"
                : "Continue"}

              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <p className="onboarding-footer">
          Your information is used only to personalize your
          business guidance.
        </p>
      </div>
    </div>
  );
}