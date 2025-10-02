import 'server-only';

import { cache } from 'react';
import path from 'path';
import { promises as fs } from 'fs';

import bookStructureJson from '@/lib/book-structure.json';
import bookStructureNewJson from '@/lib/book-structure-new.json';
import bookStructureSonnetJson from '@/lib/book-structure-sonnet.json';
import {
  type BookStructure,
  type BookContent,
  type BookMetadata,
  type TableOfContentsItem,
  type BookData,
} from '@/lib/types';

// Which book to display: 'original' | 'new' | 'sonnet'
const ACTIVE_BOOK = 'sonnet';

const bookStructures = {
  original: bookStructureJson,
  new: bookStructureNewJson,
  sonnet: bookStructureSonnetJson,
} as const;

const bookStructure = bookStructures[ACTIVE_BOOK] as BookStructure;

const CONTENT_ROOT = path.join(process.cwd(), 'public', 'content');

async function loadMarkdownContent(relativePath: string): Promise<string> {
  try {
    const fullPath = path.join(CONTENT_ROOT, relativePath);
    return await fs.readFile(fullPath, 'utf8');
  } catch (error) {
    console.error(`Error loading markdown file: ${relativePath}`, error);
    return `# Missing content\n\nUnable to load ${relativePath}.`;
  }
}

function extractContent(markdown: string): { title: string; content: string } {
  const lines = markdown.split('\n');
  const titleIndex = lines.findIndex((line) => line.startsWith('# '));

  if (titleIndex === -1) {
    return { title: '', content: markdown.trim() };
  }

  const title = lines[titleIndex].replace('# ', '').trim();
  const content = lines.slice(titleIndex + 1).join('\n').trim();

  return { title, content };
}

async function buildBookContent(): Promise<BookContent> {
  const content: BookContent = {};

  for (const section of bookStructure.sections) {
    if (section.type === 'single' && section.file) {
      const markdown = await loadMarkdownContent(section.file);
      const processed = extractContent(markdown);
      content[section.id] = {
        title: processed.title || section.title,
        content: processed.content,
      };
    }

    if (section.type === 'part' && section.chapters) {
      for (const chapter of section.chapters) {
        if (!chapter.file) continue;

        const markdown = await loadMarkdownContent(chapter.file);
        const processed = extractContent(markdown);
        content[chapter.id] = {
          title: processed.title || chapter.title,
          content: processed.content,
        };
      }
    }
  }

  return content;
}

function buildTableOfContents(): TableOfContentsItem[] {
  return bookStructure.sections.map((section) => {
    if (section.type === 'part') {
      return {
        id: section.id,
        title: section.title,
        type: section.type,
        chapters: section.chapters?.map((chapter) => ({
          id: chapter.id,
          title: chapter.title,
        })),
      } satisfies TableOfContentsItem;
    }

    return {
      id: section.id,
      title: section.title,
      type: section.type,
    } satisfies TableOfContentsItem;
  });
}

function getMetadata(): BookMetadata {
  return {
    title: bookStructure.title,
    subtitle: bookStructure.subtitle,
    author: bookStructure.author,
  };
}

export const getBookData = cache(async (): Promise<BookData> => {
  const [content, tableOfContents] = await Promise.all([
    buildBookContent(),
    Promise.resolve(buildTableOfContents()),
  ]);

  return {
    content,
    tableOfContents,
    metadata: getMetadata(),
  };
});
