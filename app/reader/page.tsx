import BookReader from "@/components/book-reader";
import { getBookData } from "@/lib/content-loader";

const DEFAULT_SECTION = "introduction";

type PageProps = {
  searchParams?: Promise<{
    section?: string | string[];
  }>;
};

const ReaderPage = async (props: PageProps) => {
  const { content, tableOfContents, metadata } = await getBookData();
  const searchParams = await props.searchParams;

  const sectionParam = searchParams?.section;
  const requestedSection = Array.isArray(sectionParam)
    ? sectionParam[0]
    : sectionParam;

  const currentSection = requestedSection && content[requestedSection]
    ? requestedSection
    : DEFAULT_SECTION;

  return (
    <BookReader
      tableOfContents={tableOfContents}
      metadata={metadata}
      content={content}
      currentSection={currentSection}
      defaultSection={DEFAULT_SECTION}
    />
  );
};

export default ReaderPage;
