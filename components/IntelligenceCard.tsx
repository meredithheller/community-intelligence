import type { CommunityIntelligence } from "@/lib/types";

interface Props {
  intelligence: CommunityIntelligence;
}

export default function IntelligenceCard({ intelligence }: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm divide-y divide-gray-100">
      {/* Demographic */}
      <div className="px-6 py-5">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
          Who&apos;s in this community
        </h3>
        <p className="text-gray-800 text-sm leading-relaxed">
          {intelligence.demographic}
        </p>
      </div>

      {/* Tone */}
      <div className="px-6 py-5">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
          Tone
        </h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {intelligence.tone.adjectives.map((adj) => (
            <span
              key={adj}
              className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700"
            >
              {adj}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
          <span>
            <span className="font-medium text-gray-700">Formality:</span>{" "}
            {intelligence.tone.formality}
          </span>
          <span>
            <span className="font-medium text-gray-700">Humor:</span>{" "}
            {intelligence.tone.humorRegister}
          </span>
          <span>
            <span className="font-medium text-gray-700">Cynicism:</span>{" "}
            {intelligence.tone.cynicismLevel}
          </span>
          <span>
            <span className="font-medium text-gray-700">Emoji:</span>{" "}
            {intelligence.tone.emojiUsage}
          </span>
        </div>
      </div>

      {/* Language */}
      <div className="px-6 py-5">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
          Language
        </h3>
        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium text-gray-500 mb-2">
              Vocabulary
            </p>
            <div className="flex flex-wrap gap-2">
              {intelligence.language.vocabulary.map((term) => (
                <span
                  key={term}
                  className="inline-block rounded border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs text-gray-700 font-mono"
                >
                  {term}
                </span>
              ))}
            </div>
          </div>
          {intelligence.language.avoidPhrases.length > 0 && (
            <div>
              <p className="text-xs font-medium text-red-400 mb-2">
                Avoid
              </p>
              <div className="flex flex-wrap gap-2">
                {intelligence.language.avoidPhrases.map((phrase) => (
                  <span
                    key={phrase}
                    className="inline-block rounded border border-red-100 bg-red-50 px-2 py-0.5 text-xs text-red-600"
                  >
                    {phrase}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Formats */}
      <div className="px-6 py-5">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
          Formats that get traction
        </h3>
        <ul className="space-y-1">
          {intelligence.formats.highTraction.map((fmt) => (
            <li key={fmt} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-400" />
              {fmt}
            </li>
          ))}
        </ul>
      </div>

      {/* Hooks */}
      <div className="px-6 py-5">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
          Entry points &amp; hooks
        </h3>
        <ul className="space-y-1">
          {intelligence.hooks.map((hook) => (
            <li key={hook} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-400" />
              {hook}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
