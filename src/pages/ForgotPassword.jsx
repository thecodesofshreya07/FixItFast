import { useState } from "react";
import { forgotPassword, resetPassword } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    try {
      setLoading(true);

      await forgotPassword({ email });

      show({
        type: "success",
        message: "OTP sent successfully"
      });

      setStep(2);
    } catch (err) {

      show({
        type: "error",
        message: err.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      setLoading(true);

      await resetPassword({
        email,
        otp,
        newPassword,
      });

show({
  type: "success",
  message: "Password updated successfully"
});
      navigate("/login");
    } catch (err) {
      show({
  type: "error",
  message: err.message
});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: "60px 20px" }}>
      <div className="card" style={{ maxWidth: 420, margin: "0 auto", padding: 30 }}>
        <h2 style={{ marginBottom: 20 }}>Forgot Password</h2>

        <div className="form-group">
          <label>Email</label>

          <input
            type="email"
            className="form-input"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        {step === 2 && (
          <>
            <div className="form-group">
              <label>OTP</label>

              <input
                type="text"
                className="form-input"
                value={otp}
                onChange={e => setOtp(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>New Password</label>

              <input
                type="password"
                className="form-input"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
            </div>
          </>
        )}

        {step === 1 ? (
          <button
            className="btn btn-primary"
            onClick={handleSendOtp}
            disabled={loading}
            style={{ width: "100%" }}
          >
            {loading ? "Sending..." : "Generate OTP"}
          </button>
        ) : (
          <button
            className="btn btn-primary"
            onClick={handleReset}
            disabled={loading}
            style={{ width: "100%" }}
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>
        )}
      </div>
    </div>
  );
}