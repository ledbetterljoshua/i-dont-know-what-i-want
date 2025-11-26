import BookReader from "@/components/book-reader";
import { getBookDataByType } from "@/lib/content-loader";

const DEFAULT_SECTION = "ch1-i-know-you";

type PageProps = {
  searchParams?: Promise<{
    section?: string | string[];
  }>;
};

const OpusReaderPage = async (props: PageProps) => {
  const { content, tableOfContents, metadata } = await getBookDataByType('opus');
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
      basePath="/opus"
      theme="dark"
    />
  );
};

export default OpusReaderPage;
