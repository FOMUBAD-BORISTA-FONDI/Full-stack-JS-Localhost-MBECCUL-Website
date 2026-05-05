export default function StatCard({ label, value, icon, color }) {
  return (
    <div
      style={{
        background: "white",
        border: "1px solid #E5E7EB",
        borderRadius: "12px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: "13px", color: "gray" }}>{label}</span>
        <span
          style={{
            color,
            background: color + "15",
            padding: "6px",
            borderRadius: "8px",
          }}
        >
          {icon}
        </span>
      </div>
      <span style={{ fontSize: "22px", fontWeight: "bold", color: "#1A1A2E" }}>
        {value}
      </span>
    </div>
  );
}
