import 'server-only';

import { cache } from 'react';
import path from 'path';
import { promises as fs } from 'fs';

import bookStructureJson from '@/lib/book-structure.json';
import bookStructureNewJson from '@/lib/book-structure-new.json';
import bookStructureSonnetJson from '@/lib/book-structure-sonnet.json';
import bookStructureOpusJson from '@/lib/book-structure-opus.json';
import {
  type BookStructure,
  type BookContent,
  type BookMetadata,
  type TableOfContentsItem,
  type BookData,
} from '@/lib/types';

export type BookType = 'original' | 'new' | 'sonnet' | 'opus';

const bookStructures: Record<BookType, BookStructure> = {
  original: bookStructureJson as BookStructure,
  new: bookStructureNewJson as BookStructure,
  sonnet: bookStructureSonnetJson as BookStructure,
  opus: bookStructureOpusJson as BookStructure,
};

// Default book for backward compatibility
const DEFAULT_BOOK: BookType = 'sonnet';

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

async function buildBookContent(bookType: BookType): Promise<BookContent> {
  const bookStructure = bookStructures[bookType];
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

function buildTableOfContents(bookType: BookType): TableOfContentsItem[] {
  const bookStructure = bookStructures[bookType];
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

function getMetadata(bookType: BookType): BookMetadata {
  const bookStructure = bookStructures[bookType];
  return {
    title: bookStructure.title,
    subtitle: bookStructure.subtitle,
    author: bookStructure.author,
  };
}

// Default export for backward compatibility
export const getBookData = cache(async (): Promise<BookData> => {
  return getBookDataByType(DEFAULT_BOOK);
});

// New export for specific book types
export const getBookDataByType = cache(async (bookType: BookType): Promise<BookData> => {
  const [content, tableOfContents] = await Promise.all([
    buildBookContent(bookType),
    Promise.resolve(buildTableOfContents(bookType)),
  ]);

  return {
    content,
    tableOfContents,
    metadata: getMetadata(bookType),
  };
});
