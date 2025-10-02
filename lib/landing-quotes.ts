import "server-only";

import path from "path";
import { promises as fs } from "fs";

export type LandingQuote = {
  text: string;
  source: string;
  href?: string;
};

const QUOTES_PATH = path.join(process.cwd(), "landing-page-quotes.md");

const stripOuterQuotes = (value: string) => {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith("\"") && trimmed.endsWith("\"")) ||
    (trimmed.startsWith("“") && trimmed.endsWith("”"))
  ) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
};

const SOURCE_LINKS: Record<string, string> = {
  "From Gemini": "/reviews/gemini",
  "From Codex": "/reviews/codex",
  Meta: "/appendix/echoes",
};

export const getLandingQuotes = async (): Promise<LandingQuote[]> => {
  try {
    const raw = await fs.readFile(QUOTES_PATH, "utf8");
    const lines = raw.split(/\r?\n/);
    const quotes: LandingQuote[] = [];
    let currentSource = "";

    for (const line of lines) {
      if (line.startsWith("### ")) {
        currentSource = line.replace("### ", "").trim();
        continue;
      }

      if (line.startsWith(">")) {
        const text = stripOuterQuotes(line.replace(/^>\s*/, ""));
        if (!text) continue;
        const sourceLabel = currentSource || "Unknown";
        quotes.push({
          text,
          source: sourceLabel,
          href: SOURCE_LINKS[sourceLabel] ?? undefined,
        });
      }
    }

    return quotes;
  } catch (error) {
    console.error("Error loading landing page quotes", error);
    return [];
  }
};
