export interface BookChapter {
  id: string;
  title: string;
  file?: string;
}

export interface BookPart {
  id: string;
  title: string;
  type: 'part';
  chapters: BookChapter[];
}

export interface BookSingle {
  id: string;
  title: string;
  type: 'single';
  file?: string;
}

export interface BookSong {
  id: string;
  title: string;
  type: 'song';
  file?: string;
  audioPath: string;
  coverArt: string;
}

export type BookSection = BookPart | BookSingle | BookSong;

export interface BookStructure {
  title: string;
  subtitle: string;
  author: string;
  sections: BookSection[];
}

export interface TableOfContentsItem {
  id: string;
  title: string;
  type: 'single' | 'part' | 'song';
  chapters?: Array<{ id: string; title: string }>;
}

export interface BookContentEntry {
  title: string;
  content: string;
  type?: 'single' | 'song';
  audioPath?: string;
  coverArt?: string;
}

export type BookContent = Record<string, BookContentEntry>;

export interface BookMetadata {
  title: string;
  subtitle: string;
  author: string;
}

export interface BookData {
  content: BookContent;
  tableOfContents: TableOfContentsItem[];
  metadata: BookMetadata;
}
