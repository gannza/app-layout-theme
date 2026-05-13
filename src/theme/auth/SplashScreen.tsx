import MainLogo from '@/assets/icons/main-logo.png';

export function SplashScreen() {
  return (
    <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-white text-[#0f172a]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(72,116,255,0.18),_transparent_60%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(199,214,255,0.25)_0%,rgba(255,255,255,0.9)_65%,rgba(255,255,255,1)_100%)]" />
      <div className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-[#e4ecff] blur-3xl" />
      <div className="absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-[#f2f6ff] blur-3xl" />

      <div className="relative z-10 flex flex-col items-center gap-6 text-center">
        <div className="flex justify-between gap-4">
          <img src={MainLogo} alt="Logo" className="w-[350px]" />
        </div>
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#b7c7ff] border-t-[#1138d8]" />
        <p className="text-lg font-semibold tracking-wide text-[#0f172a]">
          Secure workspace
        </p>
      </div>
    </div>
  );
}
