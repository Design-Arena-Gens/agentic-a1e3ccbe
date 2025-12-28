import { VideoAgent } from "@/components/VideoAgent";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(252,211,77,0.25),_transparent_45%),radial-gradient(circle_at_bottom,_rgba(59,130,246,0.25),_transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(236,72,153,0.15),_transparent_50%)] mix-blend-screen" />
      </div>
      <main className="relative mx-auto flex min-h-screen max-w-6xl flex-col gap-16 px-6 py-16 sm:px-10 lg:px-16">
        <VideoAgent />
      </main>
    </div>
  );
}
