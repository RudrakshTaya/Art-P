import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("loading"); // 'loading', 'success', 'error'
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(`http://localhost:5002/api/user/verify-email?token=${encodeURIComponent(token)}`);
        setStatus("success");
        setMessage(response.data.message);
        // Optionally redirect after success
        setTimeout(() => navigate("/"), 3000); // Redirect to login after 3 seconds
      } catch (error) {
        setStatus("error");
        setMessage(error.response?.data?.message || "Email verification failed. Please try again.");
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setStatus("error");
      setMessage("Invalid or missing token.");
    }
  }, [token, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Email Verification</h1>
      {status === "loading" && <p>Verifying your email...</p>}
      {status === "success" && <p style={{ color: "green" }}>{message}</p>}
      {status === "error" && (
        <div>
          <p style={{ color: "red" }}>{message}</p>
          {token && (
            <button onClick={() => window.location.reload()} style={{ marginTop: "10px", padding: "10px 20px", cursor: "pointer" }}>
              Retry Verification
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default VerifyEmail;
