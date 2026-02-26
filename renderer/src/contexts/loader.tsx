export function Loader() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background relative">
      {/* Círculo girando */}
      <div className="absolute">
        <div className="w-28 h-28 border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      </div>

      {/* Logo */}
      <img
        src="/mindware.png"
        alt="Logo"
        className="w-20 h-20 z-10"
      />

      {/* Texto */}
      <div className="text-muted-foreground font-semibold mt-4">MINDGEST</div>
    </div>
  );
}