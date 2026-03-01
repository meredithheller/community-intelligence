import UrlForm from "@/components/UrlForm";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-block mb-4 rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-semibold text-indigo-600 uppercase tracking-widest">
            AirOps
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Community Voice Intelligence
          </h1>
          <p className="text-gray-500 text-base leading-relaxed">
            Paste your brand URL and a social thread. Get a community
            intelligence summary and 3 channel-native comment options — in
            seconds.
          </p>
        </div>

        <UrlForm />

        <p className="mt-8 text-center text-xs text-gray-400">
          Reddit threads supported — LinkedIn, TikTok & YouTube coming soon
        </p>
      </div>
    </main>
  );
}
