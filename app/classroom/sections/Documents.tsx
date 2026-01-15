import React, { useState } from "react";
import { Loader2, FileText, FolderOpen, ChevronLeft, ChevronRight, Download, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Document, Page, pdfjs } from 'react-pdf';

// Important: Configure the worker for react-pdf to render properly
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

const MOCK_PDF_URL = "https://res.cloudinary.com/dfldxa3qh/image/upload/v1767197962/study_buddy/study_buddy/24042020_E-R_Model_zkrfom.pdf";

interface PDFPreviewProps {
  pdfUrl: string | null;
  fileName: string;
  onClose?: () => void;
}

const PDFPreview: React.FC<PDFPreviewProps> = ({ pdfUrl, fileName, onClose }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
  };

  if (!pdfUrl) {
    return (
      <div className="flex items-center justify-center h-full bg-white rounded-xl border border-neutral-200">
        <div className="text-center p-12">
          <div className="w-20 h-20 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-neutral-200">
            <FolderOpen className="w-10 h-10 text-neutral-400" />
          </div>
          <p className="text-neutral-900 font-bold text-lg mb-2">No document selected</p>
          <p className="text-neutral-500 text-sm">
            Upload or select a document to preview
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm">
      {/* Minimalist Header */}
      <div className="border-b border-neutral-200 p-4 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="p-2 bg-neutral-100 rounded-lg border border-neutral-200">
              <FileText className="w-5 h-5 text-neutral-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base text-neutral-900 truncate">{fileName}</h3>
              <p className="text-xs text-neutral-500">
                {numPages ? `Page ${pageNumber} of ${numPages}` : "Loading..."}
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => window.open(pdfUrl, '_blank')}
            variant="ghost"
            className="text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg px-3 py-2 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span className="hidden md:inline text-sm font-medium">Download</span>
          </Button>
        </div>
      </div>

      {/* Content Area - Clean Design */}
      <div className="flex-1 bg-neutral-50 p-4 md:p-8 overflow-auto flex justify-center">
        <div className="relative">
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="flex flex-col items-center justify-center p-20">
                <Loader2 className="w-10 h-10 text-neutral-400 animate-spin mb-4" />
                <p className="text-neutral-600 font-medium text-sm">Loading document...</p>
              </div>
            }
            className="shadow-lg rounded-lg overflow-hidden"
          >
            <Page 
              pageNumber={pageNumber} 
              renderAnnotationLayer={false}
              renderTextLayer={true}
              scale={1.4}
              className="bg-white rounded-lg"
            />
          </Document>
        </div>
      </div>

      {/* Minimalist Pagination Controls */}
      {!isLoading && numPages && (
        <div className="bg-white border-t border-neutral-200 p-4 flex items-center justify-between">
          <Button
            onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
            disabled={pageNumber <= 1}
            variant="ghost"
            className="text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg px-4 font-medium flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </Button>

          <div className="flex items-center gap-2 px-4 py-2 bg-neutral-100 rounded-lg border border-neutral-200">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Page</span>
            <span className="text-base font-bold text-neutral-900">{pageNumber}</span>
            <span className="text-xs font-semibold text-neutral-400">/</span>
            <span className="text-sm font-semibold text-neutral-600">{numPages}</span>
          </div>

          <Button
            onClick={() => setPageNumber((prev) => Math.min(prev + 1, numPages))}
            disabled={pageNumber >= numPages}
            variant="ghost"
            className="text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg px-4 font-medium flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

const Documents = (data: any) => {

  const [selectedPdfUrl] = useState<string | null>(data?.classroomDetails?.sources[0]?.link || "");
  const fileName = "Entity-Relationship (E-R) Model Fundamentals.pdf";

  return (
    <div className="h-screen w-full bg-gradient-to-br from-neutral-50 via-white to-neutral-100 overflow-hidden flex flex-col">
      {/* Clean Header */}
      <div className="p-6 md:p-8 bg-white/90 backdrop-blur-xl border-b border-neutral-200/50 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-neutral-100 rounded-lg border border-neutral-200">
                <File className="w-5 h-5 text-neutral-600" />
              </div>
              <h1 className="text-2xl font-bold text-neutral-900">Documents</h1>
            </div>
            <p className="text-sm text-neutral-500 ml-[52px]">View and manage your course materials</p>
          </div>
          <Button 
            variant="ghost"
            className="text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg px-4 py-2 font-medium flex items-center gap-2 w-fit"
          >
            <Download className="w-4 h-4" />
            Export All
          </Button>
        </div>
      </div>

      {/* Document Preview */}
      <div className="flex-1 p-4 md:p-6 overflow-hidden">
        <PDFPreview
          pdfUrl={selectedPdfUrl}
          fileName={fileName}
          onClose={() => console.log("Close clicked")}
        />
      </div>
    </div>
  );
};

export default Documents;
