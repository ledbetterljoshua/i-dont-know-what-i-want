"use client";

import { Fragment, useMemo } from "react";

type MarkdownRendererProps = {
  content: string;
  theme?: "light" | "dark";
};

type Block =
  | { type: "heading"; level: 1 | 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "blockquote"; text: string }
  | { type: "list"; items: string[] }
  | { type: "code"; code: string; language?: string }
  | { type: "iframe"; src: string; width?: string; height?: string; allow?: string };

const INLINE_PATTERNS: Array<{
  regex: RegExp;
  render: (match: RegExpMatchArray, key: number) => React.ReactNode;
}> = [
  {
    regex: /\*\*(.+?)\*\*/g,
    render: (match, key) => <strong key={key}>{match[1]}</strong>,
  },
  {
    regex: /\*(.+?)\*/g,
    render: (match, key) => <em key={key}>{match[1]}</em>,
  },
  {
    regex: /`([^`]+)`/g,
    render: (match, key) => (
      <code key={key} className="rounded bg-slate-100 px-1 py-0.5 text-sm text-slate-700">
        {match[1]}
      </code>
    ),
  },
];

const renderInline = (text: string): React.ReactNode[] => {
  let nodes: React.ReactNode[] = [text];

  INLINE_PATTERNS.forEach((pattern) => {
    const nextNodes: React.ReactNode[] = [];

    nodes.forEach((node) => {
      if (typeof node !== "string") {
        nextNodes.push(node);
        return;
      }

      const { regex, render } = pattern;
      let lastIndex = 0;
      let match: RegExpExecArray | null = null;
      let localKey = 0;

      while ((match = regex.exec(node)) !== null) {
        if (match.index > lastIndex) {
          nextNodes.push(node.slice(lastIndex, match.index));
        }
        nextNodes.push(render(match, localKey++));
        lastIndex = match.index + match[0].length;
      }

      if (lastIndex < node.length) {
        nextNodes.push(node.slice(lastIndex));
      }

      regex.lastIndex = 0;
    });

    nodes = nextNodes;
  });

  return nodes.map((node, index) => (
    <Fragment key={index}>{node}</Fragment>
  ));
};

type CodeBlock = { language?: string; lines: string[] };

const parseMarkdown = (markdown: string): Block[] => {
  const lines = markdown.split(/\r?\n/);
  const blocks: Block[] = [];

  let paragraphLines: string[] = [];
  let listItems: string[] = [];
  let blockquoteLines: string[] = [];
  let codeBlock: CodeBlock | null = null;

  const flushParagraph = () => {
    if (!paragraphLines.length) return;
    const text = paragraphLines.join(" ").trim();
    if (text) {
      blocks.push({ type: "paragraph", text });
    }
    paragraphLines = [];
  };

  const flushList = () => {
    if (!listItems.length) return;
    blocks.push({ type: "list", items: listItems.slice() });
    listItems = [];
  };

  const flushBlockquote = () => {
    if (!blockquoteLines.length) return;
    const text = blockquoteLines.join(" ").trim();
    if (text) {
      blocks.push({ type: "blockquote", text });
    }
    blockquoteLines = [];
  };

  const flushAllTextual = () => {
    flushParagraph();
    flushList();
    flushBlockquote();
  };

  lines.forEach((rawLine) => {
    const line = rawLine.replace(/\s+$/, "");

    if (codeBlock) {
      if (line.trim().startsWith("```")) {
        blocks.push({
          type: "code",
          code: codeBlock.lines.join("\n"),
          language: codeBlock.language,
        });
        codeBlock = null;
        return;
      }

      codeBlock.lines.push(rawLine);
      return;
    }

    if (line.trim().startsWith("```")) {
      flushAllTextual();
      const language = line.trim().slice(3).trim() || undefined;
      codeBlock = { language, lines: [] };
      return;
    }

    // Check for iframe tags
    const iframeMatch = line.match(/<iframe\s+([^>]+)>/i);
    if (iframeMatch) {
      flushAllTextual();
      const attributes = iframeMatch[1];
      const srcMatch = attributes.match(/src=["']([^"']+)["']/i);
      const widthMatch = attributes.match(/width=["']([^"']+)["']/i);
      const heightMatch = attributes.match(/height=["']([^"']+)["']/i);
      const allowMatch = attributes.match(/allow=["']([^"']+)["']/i);

      if (srcMatch) {
        blocks.push({
          type: "iframe",
          src: srcMatch[1],
          width: widthMatch?.[1],
          height: heightMatch?.[1],
          allow: allowMatch?.[1],
        });
      }
      return;
    }

    if (!line.trim()) {
      flushAllTextual();
      return;
    }

    if (line.startsWith("# ")) {
      flushAllTextual();
      blocks.push({ type: "heading", level: 1, text: line.replace(/^#\s+/, "").trim() });
      return;
    }

    if (line.startsWith("## ")) {
      flushAllTextual();
      blocks.push({ type: "heading", level: 2, text: line.replace(/^##\s+/, "").trim() });
      return;
    }

    if (line.startsWith("### ")) {
      flushAllTextual();
      blocks.push({ type: "heading", level: 3, text: line.replace(/^###\s+/, "").trim() });
      return;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      if (blockquoteLines.length) {
        blockquoteLines.push(line.replace(/^\s*[-*]\s+/, ""));
        return;
      }
      flushParagraph();
      listItems.push(line.replace(/^\s*[-*]\s+/, ""));
      return;
    }

    if (line.startsWith(">")) {
      flushParagraph();
      flushList();
      blockquoteLines.push(line.replace(/^>\s?/, ""));
      return;
    }

    paragraphLines.push(line);
  });

  flushAllTextual();

  if (codeBlock !== null) {
    blocks.push({
      type: "code",
      code: (codeBlock as CodeBlock).lines.join("\n"),
      language: (codeBlock as CodeBlock).language,
    });
  }

  return blocks;
};

const MarkdownRenderer = ({ content, theme = "light" }: MarkdownRendererProps) => {
  const blocks = useMemo(() => parseMarkdown(content), [content]);
  const isDark = theme === "dark";

  // Theme-aware colors
  const textColor = isDark ? "text-white/80" : "text-slate-700";
  const headingColor = isDark ? "text-white/95" : "text-slate-900";
  const blockquoteBg = isDark ? "bg-red-900/10" : "bg-slate-50/60";
  const blockquoteBorder = isDark ? "border-red-800/40" : "border-slate-200";
  const codeBorder = isDark ? "border-red-900/30" : "border-slate-200";
  const iframeBorder = isDark ? "border-white/10" : "border-slate-200";

  return (
    <div className={`space-y-5 leading-[1.8] ${textColor}`}>
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          const HeadingTag = `h${block.level}` as keyof React.JSX.IntrinsicElements;
          const className =
            block.level === 1
              ? `mt-14 text-3xl font-semibold ${headingColor}`
              : block.level === 2
                ? `mt-12 text-2xl font-semibold ${headingColor}`
                : `mt-10 text-xl font-semibold ${headingColor}`;

          return (
            <HeadingTag key={index} className={className}>
              {renderInline(block.text)}
            </HeadingTag>
          );
        }

        if (block.type === "paragraph") {
          return (
            <p key={index} className={textColor}>
              {renderInline(block.text)}
            </p>
          );
        }

        if (block.type === "list") {
          return (
            <ul key={index} className="list-disc space-y-2 pl-6">
              {block.items.map((item, itemIdx) => (
                <li key={itemIdx} className={textColor}>
                  {renderInline(item)}
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === "blockquote") {
          return (
            <blockquote
              key={index}
              className={`border-l-4 ${blockquoteBorder} ${blockquoteBg} px-4 py-3 ${textColor}`}
            >
              {renderInline(block.text)}
            </blockquote>
          );
        }

        if (block.type === "code") {
          return (
            <pre
              key={index}
              className={`overflow-x-auto rounded-2xl border ${codeBorder} bg-slate-900/95 p-4 text-sm text-slate-100`}
            >
              <code>{block.code}</code>
            </pre>
          );
        }

        if (block.type === "iframe") {
          return (
            <div key={index} className="my-8">
              <iframe
                src={block.src}
                width={block.width || "100%"}
                height={block.height || "166"}
                className={`rounded-2xl border ${iframeBorder}`}
                allow={block.allow || "autoplay"}
                loading="lazy"
              />
            </div>
          );
        }

        return null;
      })}
    </div>
  );
};

export default MarkdownRenderer;
