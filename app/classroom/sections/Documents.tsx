import React, { useState } from "react";
import { Loader2, FileText, FolderOpen, ChevronLeft, ChevronRight, Download } from "lucide-react";
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
      <div className="flex items-center justify-center h-full bg-indigo-50 rounded-2xl border-2 border-dashed border-indigo-300">
        <div className="text-center p-8">
          <FolderOpen className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
          <p className="text-indigo-700 font-semibold text-lg">No document selected</p>
          <p className="text-indigo-600 text-sm mt-2">
            Upload or select a document to preview
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[85vh] bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 text-white flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg">{fileName}</h3>
            <p className="text-xs opacity-80">
              {numPages ? `Page ${pageNumber} of ${numPages}` : "Analyzing structure..."}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => window.open(pdfUrl, '_blank')}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-0 rounded-xl px-4"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-slate-100  p-4 md:p-8 overflow-auto flex justify-center custom-scrollbar">
        <div className="relative">
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="flex flex-col items-center justify-center p-20">
                <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
                <p className="text-slate-600 font-bold">Rendering Document Elements...</p>
              </div>
            }
            className="shadow-2xl rounded-lg overflow-hidden"
          >
            <Page 
              pageNumber={pageNumber} 
              renderAnnotationLayer={false}
              renderTextLayer={true}
              scale={1.4}
              className="bg-white"
            />
          </Document>
        </div>
      </div>

      {/* Premium Pagination Controls */}
      {!isLoading && numPages && (
        <div className="bg-white border-t border-slate-200 p-4 flex items-center justify-between px-8 z-10">
          <Button
            onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
            disabled={pageNumber <= 1}
            variant="ghost"
            className="text-indigo-700 hover:bg-indigo-50 rounded-xl px-6 font-bold flex items-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </Button>

          <div className="flex items-center gap-2 px-6 py-2 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-sm font-bold text-slate-400">PAGE</span>
            <span className="text-lg font-black text-indigo-600">{pageNumber}</span>
            <span className="text-sm font-bold text-slate-300">/</span>
            <span className="text-sm font-bold text-slate-500">{numPages}</span>
          </div>

          <Button
            onClick={() => setPageNumber((prev) => Math.min(prev + 1, numPages))}
            disabled={pageNumber >= numPages}
            variant="ghost"
            className="text-indigo-700 hover:bg-indigo-50 rounded-xl px-6 font-bold flex items-center gap-2"
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );
};

const Documents = () => {
  const [selectedPdfUrl] = useState<string | null>(MOCK_PDF_URL);
  const fileName = "Entity-Relationship (E-R) Model Fundamentals.pdf";

  return (
    <div className="h-screen w-full bg-background overflow-hidden flex flex-col">
      {/* Colorful Top Bar */}
      <div className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-2"></div>
      
      {/* Header */}
      <div className="p-8 bg-white border-b border-slate-200 shadow-sm relative z-20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3 font-heading">
              <FolderOpen className="w-8 h-8 text-indigo-500" />
              Course Analytics & Study Vault
            </h1>
            <p className="text-slate-500 font-medium">Explore and interact with your academic resources</p>
          </div>
          <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl px-8 py-6 shadow-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98]">
            <Download className="w-5 h-5 mr-3" />
            Export Portfolio
          </Button>
        </div>
      </div>

      {/* Document Preview */}
      <div className="flex-1 p-2 md:p-4 overflow-hidden bg-slate-50">
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
