export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-[#1e1e2f] via-[#0d0d15] to-[#111122] overflow-hidden">
      <div className="absolute w-[200%] h-[200%] animate-[spin_30s_linear_infinite] opacity-20 bg-[radial-gradient(circle_at_center,rgba(80,120,255,0.2),transparent_70%)]"></div>
    </div>
  );
}
