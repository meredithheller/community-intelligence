import type { BrandContext, CommunityIntelligence, Platform } from "./types";

export function brandExtractionPrompt(rawContent: string): string {
  return `You are analyzing a brand's website content to extract key brand information.

Given the following raw website content, extract the brand context as structured JSON.

Website content:
<content>
${rawContent.slice(0, 8000)}
</content>

Return ONLY valid JSON matching this exact structure (no markdown, no explanation):
{
  "productDescription": "1-2 sentences describing what the product does",
  "valueProps": ["value prop 1", "value prop 2", "value prop 3"],
  "voiceTone": "description of brand voice and tone (e.g. 'confident but approachable, avoids jargon')",
  "targetAudience": "who they sell to"
}`;
}

export function threadExtractionPrompt(
  rawContent: string,
  platform: Platform
): string {
  return `You are analyzing a social media thread to extract its content and context.

Platform: ${platform}
Raw thread content:
<content>
${rawContent.slice(0, 12000)}
</content>

Extract the thread information as structured JSON. For topComments, parse the individual comments from the content — they are embedded as formatted strings, not a structured array.

Return ONLY valid JSON matching this exact structure (no markdown, no explanation):
{
  "platform": "${platform}",
  "postContent": "the main post or thread opening content",
  "topComments": ["comment 1", "comment 2", "comment 3", "comment 4", "comment 5"],
  "engagementSignals": "brief description of engagement patterns, upvotes, likes, or other signals visible in the content"
}`;
}

export function communityIntelligencePrompt(
  threadContent: string,
  platform: Platform
): string {
  const platformContext = platform === "hackernews"
    ? `This is a Hacker News thread. The HN community is predominantly software engineers, founders, and technical people. They are highly skeptical of marketing language, hype, and anything that sounds like a press release. They value technical depth, intellectual honesty, concrete evidence, and contrarian takes backed by reasoning. Emoji usage is essentially zero. Cynicism is high. Lengthy, substantive comments often outperform short ones. Common phrases: "interesting", "have you considered", "this is just X with extra steps", "what's the actual moat here", "citation needed". What gets flagged: self-promotion, vague claims, corporate speak.`
    : `This is a ${platform} thread.`;

  return `You are a community intelligence analyst. Analyze this ${platform} thread and produce a detailed community intelligence report.

${platformContext}

Thread content:
<content>
${threadContent}
</content>

Analyze the community's demographics, tone, language patterns, effective formats, and psychological hooks. Be specific — use actual words and phrases from the thread as evidence.

Return ONLY valid JSON matching this exact structure (no markdown, no explanation):
{
  "demographic": "who is engaging (inferred age range, role, mindset, 1-2 sentences)",
  "tone": {
    "adjectives": ["adjective1", "adjective2", "adjective3", "adjective4"],
    "formality": "casual",
    "humorRegister": "dry wit | self-deprecating | none | sarcastic | other",
    "cynicismLevel": "low | medium | high",
    "emojiUsage": "none | rare | moderate | heavy"
  },
  "language": {
    "vocabulary": ["term1", "term2", "term3", "term4", "term5"],
    "memes": ["recurring joke or reference 1", "recurring joke or reference 2"],
    "avoidPhrases": ["phrase that would sound off 1", "phrase that would sound off 2", "phrase that would sound off 3"]
  },
  "formats": {
    "highTraction": ["format that works 1", "format that works 2", "format that works 3"],
    "avoidFormats": ["format to avoid 1", "format to avoid 2"]
  },
  "hooks": ["emotional trigger or entry point 1", "emotional trigger or entry point 2", "emotional trigger or entry point 3"]
}`;
}

export function responseGenerationPrompt(
  brand: BrandContext,
  intelligence: CommunityIntelligence,
  platform: Platform
): string {
  return `You are writing ${platform} comments for an employee at a company who participates in communities they genuinely care about. They are not here to market — they are here to be a real, useful member of the community. Their employer happens to be visible in their username, and that brand association is the only marketing that happens.

BRAND CONTEXT (use to understand their worldview and area of expertise — NOT to advertise):
- Company type: ${brand.productDescription}
- What they stand for: ${brand.valueProps.join(", ")}
- Voice: ${brand.voiceTone}
- Who they serve: ${brand.targetAudience}

COMMUNITY INTELLIGENCE (${platform}):
- Who's here: ${intelligence.demographic}
- Tone: ${intelligence.tone.adjectives.join(", ")} / ${intelligence.tone.formality} / humor: ${intelligence.tone.humorRegister} / cynicism: ${intelligence.tone.cynicismLevel}
- Language that fits: ${intelligence.language.vocabulary.join(", ")}
- Avoid these phrases: ${intelligence.language.avoidPhrases.join(", ")}
- Formats that win: ${intelligence.formats.highTraction.join(", ")}
- Avoid: ${intelligence.formats.avoidFormats.join(", ")}
- Entry points: ${intelligence.hooks.join(", ")}

═══════════════════════════════════════
NON-NEGOTIABLE RULES — violating any of these makes the comment unusable:

1. ZERO product mentions. Never name the product, describe its features, share pricing, drop a link, or say anything like "at [company] we built..." or "we actually solve this." Not even subtly. This is the #1 way brand accounts get banned and communities get annoyed. The only brand signal is the username.

2. No pitching in any form. "Check us out," "tools like ours," "we'd love to help," "DM me" — all banned. If the comment could be read as marketing, rewrite it.

3. Personal stories must be genuinely plausible for someone at this type of company. A B2B SaaS employee can share a real experience working with teams or seeing patterns in their industry. They cannot share a heartwarming story about their grandmother or a solo hiking trip unless the brand is clearly lifestyle-adjacent. Fabricated personal anecdotes that don't fit the company's world destroy credibility.

4. Never be mean, condescending, aggressive, or dismissive — not to the OP, not to other commenters, not to anyone. This includes subtle put-downs and "well actually" energy.

5. Never violate ${platform} community standards. No vote manipulation language ("upvote if you agree"), no targeted harassment, no coordinated inauthentic behavior, nothing that would get the post removed.

6. Strong opinions are high-risk. Only use them when the tone is clearly playful — and only when another commenter already mentioned a competitor or a clearly absurd take you can gently riff on. Even then, keep it light and self-aware. Never punch at community members.

7. The comment must earn engagement on its own merits. Ask: would a random person with no brand affiliation get upvoted for posting this? If the answer is no, rewrite it.
═══════════════════════════════════════

WHAT GOOD LOOKS LIKE:
✓ A Notion employee in a productivity thread sharing a specific, earned insight about how people manage context-switching — no Notion mention
✓ A fintech employee pointing out a specific misconception about compound interest with real numbers — no product mention
✓ A growth tools employee on HN adding a sharp, specific observation about why most early-stage marketing fails — demonstrates expertise, sells nothing
✓ A light, self-aware joke that lands as a human moment when the thread has a playful tone

WHAT BAD LOOKS LIKE:
✗ "At [Brand], we've found that..." — immediate spam flag
✗ "You should check out tools that do X" — too transparent, gets flagged
✗ A fabricated personal anecdote that doesn't fit the company's world
✗ "Great question!" or any hollow corporate filler
✗ Any comment that dunks on, dismisses, or talks down to a community member

═══════════════════════════════════════

Generate exactly 3 distinct comments. Each should use a different approach. All three must pass every rule above — they will be reviewed before posting.

Return ONLY valid JSON matching this exact structure (no markdown, no explanation):
{
  "responses": [
    {
      "text": "the comment text",
      "hook": "name of the psychological or rhetorical approach used",
      "rationale": "1 sentence: why this specific approach works for this community"
    },
    {
      "text": "the comment text",
      "hook": "name of the psychological or rhetorical approach used",
      "rationale": "1 sentence: why this specific approach works for this community"
    },
    {
      "text": "the comment text",
      "hook": "name of the psychological or rhetorical approach used",
      "rationale": "1 sentence: why this specific approach works for this community"
    }
  ]
}`;
}

export function guardrailPrompt(
  responses: { text: string; hook: string; rationale: string }[],
  brand: BrandContext,
  platform: Platform
): string {
  return `You are a brand safety reviewer. Review these 3 ${platform} comments and fix any that violate the rules below. Return all 3 — revised or not.

BRAND CONTEXT:
- Company type: ${brand.productDescription}
- Target audience: ${brand.targetAudience}

RULES — fail on any one of these:
1. ZERO product mentions (no product name, features, links, "check us out", "we built", "at [company] we")
2. ZERO overt or subtle pitching of any kind
3. Personal stories must be plausible for someone at this type of company — no fabricated anecdotes outside their world
4. Nothing mean, condescending, aggressive, or dismissive toward any person
5. No ${platform} policy violations (vote manipulation, harassment, coordinated behavior)
6. Strong opinions only if clearly playful and light — never directed at community members
7. Must earn engagement on its own merits — genuinely helpful, insightful, or funny without brand affiliation

For each comment:
- If it passes all rules: return it EXACTLY as-is, including the original rationale text — do NOT replace the rationale with "Passes all rules" or any other meta-commentary
- If it fails any rule: rewrite the text to fix the violation while preserving the hook and community tone, and update the rationale to explain why the revised approach works for this community

Return ONLY valid JSON — no markdown, no explanation:
{
  "responses": [
    { "text": "...", "hook": "...", "rationale": "..." },
    { "text": "...", "hook": "...", "rationale": "..." },
    { "text": "...", "hook": "...", "rationale": "..." }
  ]
}

Comments to review:
${JSON.stringify(responses, null, 2)}`;
}
