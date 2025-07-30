export default function SimpleApp() {
  return (
    <div style={{
      width: "100vw",
      height: "100vh", 
      backgroundColor: "#000000",
      color: "#00ff00",
      fontFamily: "monospace",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "3rem", marginBottom: "2rem" }}>Snake Game</h1>
        <p style={{ fontSize: "1.2rem", marginBottom: "2rem" }}>Simple Test Version</p>
        <button 
          style={{
            backgroundColor: "#00aa00",
            color: "#000000", 
            padding: "12px 24px",
            border: "none",
            borderRadius: "4px",
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: "pointer"
          }}
          onClick={() => alert("Button clicked!")}
        >
          Test Button
        </button>
      </div>
    </div>
  );
}