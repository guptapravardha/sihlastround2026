import { Sprout } from "lucide-react";

export default function Logo() {
  return (
    <div className="logo">
      <div className="logo-icon">
        <Sprout size={24} strokeWidth={2.5} />
      </div>

      <div>
        <h2>Gram-Pragati AI</h2>
        <span>Your AI Business Partner</span>
      </div>
    </div>
  );
}