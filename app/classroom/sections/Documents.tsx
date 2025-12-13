import React, {useState, useEffect} from "react";
import {Loader2, FileText, X} from "lucide-react";
import {Button} from "@/components/ui/button";
// Note: In a real project, replace the following line with your actual PDF viewer import
// import { Document, Page } from 'react-pdf';

// --- Color Definitions ---
const BG_DARK = "bg-black";
const BG_MEDIUM = "bg-[#252525]";
const NEON_TEXT = "text-[#eeffab]";
const NEON_BORDER = "border-[#eeffab]";
const NEON_HOVER = "hover:bg-[#eeffab] hover:text-black";

// --- Mock Data/State ---
// In a real application, this would be passed as a prop, e.g., pdfUrl
const MOCK_PDF_URL = "https://example.com/mock-os-threads.pdf";

interface PDFPreviewProps {
  pdfUrl: string | null;
  fileName: string;
  onClose?: () => void;
}

const PDFPreview: React.FC<PDFPreviewProps> = ({pdfUrl, fileName, onClose}) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time and success/failure
    if (pdfUrl) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
        setNumPages(5); // Simulate finding 5 pages
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
      setNumPages(null);
    }
  }, [pdfUrl]);

  const onDocumentLoadSuccess = ({numPages}: {numPages: number}) => {
    setNumPages(numPages);
    setIsLoading(false);
  };

  if (!pdfUrl) {
    return (
      <div
        className={`
                    flex flex-col items-center justify-center p-12 h-96
                    ${BG_MEDIUM} rounded-xl border-2 ${NEON_BORDER}
                    ${NEON_TEXT} opacity-70
                `}
      >
        <FileText className="w-10 h-10 mb-4" />
        <p>No document selected for preview.</p>
      </div>
    );
  }

  return (
    <div
      className={`
                ${BG_MEDIUM} p-4 rounded-xl shadow-2xl border-2 ${NEON_BORDER}
                max-w-4xl mx-auto
            `}
    >
      {/* Header and Controls */}
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#252525]">
        <div className="flex items-center gap-3">
          <FileText className={`w-5 h-5 ${NEON_TEXT}`} />
          <h2 className={`text-xl font-bold ${NEON_TEXT}`}>
            Preview: {fileName}
          </h2>
          {numPages && (
            <span className="text-sm opacity-60">({numPages} pages)</span>
          )}
        </div>
        {onClose && (
          <Button
            onClick={onClose}
            className={`p-2 h-auto ${BG_DARK} border ${NEON_BORDER} ${NEON_TEXT} ${NEON_HOVER}`}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Document Viewer Area */}
      <div
        className={`
                    w-full h-[600px] overflow-y-auto ${BG_DARK} p-4 rounded-lg 
                    border border-[#252525] flex flex-col items-center
                `}
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Loader2 className={`w-10 h-10 ${NEON_TEXT} animate-spin`} />
            <p className={`mt-4 ${NEON_TEXT} opacity-80`}>
              Loading document...
            </p>
          </div>
        ) : (
          // --- Placeholder for react-pdf output ---
          <div className="w-full text-center">
            <div
              className={`
                                mx-auto p-6 ${BG_MEDIUM} border ${NEON_BORDER} shadow-md
                                max-w-lg mb-4
                            `}
            >
              <p className={`${NEON_TEXT} mb-2`}>**PDF Viewer Placeholder**</p>
              <p className="text-xs opacity-70">
                (In a real app, 'react-pdf' would render pages here.)
              </p>
              <p className="text-xs opacity-70 mt-2 break-words">
                Source: {pdfUrl}
              </p>
            </div>

            {/* Pagination (if applicable) */}
            {numPages && (
              <div className="flex justify-center items-center space-x-4 mt-4">
                <Button
                  onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                  disabled={pageNumber <= 1}
                  className={`${BG_DARK} border ${NEON_BORDER} ${NEON_TEXT} ${NEON_HOVER}`}
                >
                  Previous
                </Button>
                <span className={`${NEON_TEXT} opacity-80`}>
                  Page {pageNumber} of {numPages}
                </span>
                <Button
                  onClick={() =>
                    setPageNumber((p) => Math.min(numPages, p + 1))
                  }
                  disabled={pageNumber >= numPages}
                  className={`${BG_DARK} border ${NEON_BORDER} ${NEON_TEXT} ${NEON_HOVER}`}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
          // --- END Placeholder ---
        )}
      </div>
    </div>
  );
};

// --- Example Wrapper for Demonstration ---

const Documents= () => {
  const [docUrl, setDocUrl] = useState<string | null>(MOCK_PDF_URL);

  return (
    <div className={`p-8 ${BG_DARK} min-h-screen`}>
      <h1 className={`text-3xl font-bold mb-8 ${NEON_TEXT}`}>
        Document Preview
      </h1>

      <PDFPreview
        pdfUrl={docUrl}
        fileName="Operating System Threads Explained.pdf"
        onClose={() => setDocUrl(null)}
      />

      {docUrl === null && (
        <div className="text-center mt-8">
          <Button
            onClick={() => setDocUrl(MOCK_PDF_URL)}
            className={`p-4 h-auto ${BG_MEDIUM} border ${NEON_BORDER} ${NEON_TEXT} ${NEON_HOVER}`}
          >
            Load Document
          </Button>
        </div>
      )}
    </div>
  );
};

export default Documents;
