export default function StackFiLogo({ size = 64 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 18,
        background: "linear-gradient(135deg,#ff7e5f 0%,#ff5e84 50%,#7b61ff 100%)",
        boxShadow: "0 6px 28px rgba(124,58,237,0.18), inset 0 -4px 12px rgba(0,0,0,0.2)"
      }}
      aria-hidden
    >
      <span style={{ color: "white", fontWeight: 800, fontSize: size / 2.6, lineHeight: 1 }}>
        S
      </span>
    </div>
  );
}
