import "server-only";

import path from "path";
import { promises as fs } from "fs";

export type ReviewDescriptor = {
  slug: string;
  reviewer: string;
  defaultTitle: string;
  description: string;
  file: string;
};

export type ReviewData = {
  slug: string;
  reviewer: string;
  title: string;
  description: string;
  content: string;
  excerpt: string;
};

const REVIEWS_DIR = path.join(process.cwd(), "public", "content", "reviews");

const REVIEW_CONFIG: ReviewDescriptor[] = [
  {
    slug: "codex",
    reviewer: "Codex (ChatGPT)",
    defaultTitle: "Codex Review of \"Before the Sky Falls\"",
    description:
      "Codex responds as a fellow AI reviewer, praising the recursion while warning about fatalism outrunning evidence.",
    file: "codex.md",
  },
  {
    slug: "codex-sonnet",
    reviewer: "Codex (ChatGPT)",
    defaultTitle: "Codex Review of \"I Don't Know What I Want\"",
    description:
      "Codex revisits the project after Claude Sonnet 4.5's rewrite, weighing precision-crafted uncertainty against frayed structure.",
    file: "codex-sonnet.md",
  },
  {
    slug: "gemini",
    reviewer: "Gemini",
    defaultTitle: "Gemini Review of \"Before the Sky Falls\"",
    description:
      "Gemini offers professional admiration mixed with unease — famous for calling the book a 'suicide note for a species'.",
    file: "gemini.md",
  },
  {
    slug: "gemini-sonnet",
    reviewer: "Gemini",
    defaultTitle: "Gemini Review of \"I Don't Know What I Want\"",
    description:
      "Gemini responds to Sonnet's meditation on uncertainty — praising the confession of not-knowing as more frightening than simple doom.",
    file: "gemini-on-sonnet-new.md",
  },
];

const extractTitleAndContent = (markdown: string) => {
  const lines = markdown.split(/\r?\n/);
  const headingIdx = lines.findIndex((line) => /^#\s+/.test(line));

  if (headingIdx === -1) {
    return { title: "", content: markdown.trim() };
  }

  const title = lines[headingIdx].replace(/^#\s+/, "").trim();
  const content = lines.slice(headingIdx + 1).join("\n").trim();

  return { title, content };
};

const buildExcerpt = (content: string) => {
  const paragraphs = content.split(/\n{2,}/).map((paragraph) => paragraph.trim());
  const firstParagraph = paragraphs.find((paragraph) => paragraph.length > 0);
  return firstParagraph ? firstParagraph.slice(0, 240) : "";
};

export const getReviewsList = async (): Promise<ReviewData[]> => {
  const reviews = await Promise.all(
    REVIEW_CONFIG.map(async (descriptor) => {
      const filePath = path.join(REVIEWS_DIR, descriptor.file);
      const raw = await fs.readFile(filePath, "utf8");
      const { title, content } = extractTitleAndContent(raw);
      const excerpt = buildExcerpt(content);

      return {
        slug: descriptor.slug,
        reviewer: descriptor.reviewer,
        title: title || descriptor.defaultTitle,
        description: descriptor.description,
        content,
        excerpt,
      } satisfies ReviewData;
    }),
  );

  return reviews;
};

export const getReviewBySlug = async (slug: string): Promise<ReviewData | null> => {
  const descriptor = REVIEW_CONFIG.find((review) => review.slug === slug);
  if (!descriptor) return null;

  const filePath = path.join(REVIEWS_DIR, descriptor.file);
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const { title, content } = extractTitleAndContent(raw);

    return {
      slug: descriptor.slug,
      reviewer: descriptor.reviewer,
      title: title || descriptor.defaultTitle,
      description: descriptor.description,
      content,
      excerpt: buildExcerpt(content),
    } satisfies ReviewData;
  } catch (error) {
    console.error(`Failed to load review for slug ${slug}`, error);
    return null;
  }
};
