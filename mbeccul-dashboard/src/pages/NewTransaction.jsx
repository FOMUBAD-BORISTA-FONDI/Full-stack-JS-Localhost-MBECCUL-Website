import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBank } from "../context/BankContext";
export default function NewTransaction() {
  const navigate = useNavigate();
  const { accounts, deposit, withdraw, transfer } = useBank();
  const [form, setForm] = useState({
    type: "deposit",
    accountId: "",
    toAccountId: "",
    amount: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(form.amount);
    if (!form.accountId) return setError("Please select an account.");
    if (!amount || amount <= 0)
      return setError("Enter a valid amount greater than 0.");
    const account = accounts.find((a) => a.id === form.accountId);
    if (form.type === "deposit") {
      deposit({
        accountId: form.accountId,
        amount,
        description: form.description || "Deposit",
      });
    } else if (form.type === "withdrawal") {
      if (account.balance < amount)
        return setError(`Insufficient funds.
Balance: ${account.balance.toLocaleString()} XAF`);
      withdraw({
        accountId: form.accountId,
        amount,
        description: form.description || "Withdrawal",
      });
    } else if (form.type === "transfer") {
      if (!form.toAccountId) return setError("Select a destination account.");
      if (form.toAccountId === form.accountId)
        return setError(`Cannot
transfer to the same account.`);
      if (account.balance < amount)
        return setError(`Insufficient funds.
Balance: ${account.balance.toLocaleString()} XAF`);
      transfer({
        fromId: form.accountId,
        toId: form.toAccountId,
        amount,
        description: form.description,
      });
    }
    setSuccess(true);
    setTimeout(() => navigate("/transactions"), 1500);
  };
  const activeAccounts = accounts.filter((a) => a.status === "active");
  if (success) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
          fontFamily: "sans-serif",
        }}
      >
        <p style={{ fontSize: "48px", margin: 0 }}> </p>
        <h2>Transaction Successful!</h2>
        <p style={{ color: "gray" }}>Redirecting to transaction log...</p>
      </div>
    );
  }
  return (
    <div
      style={{ padding: "24px", maxWidth: "520px", fontFamily: "sans-serif" }}
    >
      <h2>New Transaction</h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        {/* Transaction type selector */}
        <div style={{ display: "flex", gap: "8px" }}>
          {["deposit", "withdrawal", "transfer"].map((t) => (
            <button
              key={t}
              onClick={() => setForm({ ...form, type: t })}
              style={{
                flex: 1,
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                cursor: "pointer",
                background: form.type === t ? "#1A1A2E" : "white",
                color: form.type === t ? "white" : "#1A1A2E",
                textTransform: "capitalize",
                fontWeight: form.type === t ? "bold" : "normal",
              }}
            >
              {t}
            </button>
          ))}
        </div>{" "}
        <select
          name="accountId"
          value={form.accountId}
          onChange={handleChange}
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        >
          <option value="">
            -- Select {form.type === "transfer" ? "source" : "destination"}{" "}
            account--
          </option>
          {activeAccounts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.memberName} ({a.id}) {a.balance.toLocaleString()} XAF
            </option>
          ))}
        </select>
        {form.type === "transfer" && (
          <select
            name="toAccountId"
            value={form.toAccountId}
            onChange={handleChange}
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          >
            <option value=""> --Select destination account-- </option>
            {activeAccounts
              .filter((a) => a.id !== form.accountId)
              .map((a) => (
                <option key={a.id} value={a.id}>
                  {a.memberName} ({a.id})
                </option>
              ))}
          </select>
        )}
        <input
          name="amount"
          type="number"
          placeholder="Amount (XAF)"
          min="1"
          value={form.amount}
          onChange={handleChange}
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
        <input
          name="description"
          type="text"
          placeholder="Description (optional) "
          value={form.description}
          onChange={handleChange}
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
        {error && (
          <p style={{ color: "red", fontSize: "13px", margin: 0 }}>{error}</p>
        )}
        <button
          onClick={handleSubmit}
          style={{
            padding: "12px",
            background: "#1A1A2E",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "15px",
            cursor: "pointer",
          }}
        >
          Confirm Transaction
        </button>
      </div>
    </div>
  );
}
