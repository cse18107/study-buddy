import React, { useState } from "react";
import { Loader2, FileText, FolderOpen, ChevronLeft, ChevronRight, Download, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Document, Page, pdfjs } from 'react-pdf';

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
      <div className="flex items-center justify-center h-full bg-white border-8 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
        <div className="text-center p-12 bg-primary border-4 border-black shadow-[8px_8px_0px_0px_black] rotate-[-2deg]">
          <FolderOpen className="w-20 h-20 text-black mx-auto mb-6" strokeWidth={3} />
          <p className="text-black font-black text-3xl uppercase leading-none">NO INTEL SELECTED</p>
          <p className="text-black font-bold uppercase text-xs mt-4">
             Upload a source document to initialize the link.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[85vh] bg-white border-8 border-black shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
      {/* Header */}
      <div className="bg-primary p-6 border-b-8 border-black text-black flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white border-4 border-black shadow-[4px_4px_0px_0px_black]">
            <FileText className="w-8 h-8 text-black" strokeWidth={3} />
          </div>
          <div>
            <h3 className="font-black text-2xl uppercase leading-none">{fileName}</h3>
            <p className="text-[10px] font-black uppercase mt-2 bg-black text-white px-2 py-0.5 inline-block">
              {numPages ? `SYNCED: ${pageNumber} / ${numPages}` : "DECRYPTING..."}
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => window.open(pdfUrl, '_blank')}
            className="neo-button bg-white text-black text-sm h-12 flex items-center justify-center"
          >
            <Download className="w-4 h-4 mr-2" strokeWidth={3} />
            EXPORT
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-black p-4 md:p-10 overflow-auto flex justify-center custom-scrollbar relative">
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative border-8 border-white shadow-[12px_12px_0px_0px_rgba(255,255,255,0.2)]">
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="flex flex-col items-center justify-center p-20 bg-white border-4 border-black">
                <Loader2 className="w-16 h-16 text-black animate-spin mb-4" strokeWidth={4} />
                <p className="text-black font-black uppercase">INITIALIZING TEXT LAYERS...</p>
              </div>
            }
          >
            <Page 
              pageNumber={pageNumber} 
              renderAnnotationLayer={false}
              renderTextLayer={true}
              scale={1.2}
              className="bg-white"
            />
          </Document>
        </div>
      </div>

      {/* Pagination Controls */}
      {!isLoading && numPages && (
        <div className="bg-white border-t-8 border-black p-6 flex items-center justify-between px-10 z-10">
          <button
            onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
            disabled={pageNumber <= 1}
            className="neo-button bg-white text-black disabled:opacity-30 disabled:shadow-none"
          >
            <ChevronLeft className="w-6 h-6" strokeWidth={4} />
            <span className="ml-2 uppercase text-xs">PREV</span>
          </button>

          <div className="flex items-center gap-4 border-4 border-black px-6 py-2 bg-secondary text-white shadow-[4px_4px_0px_0px_black] font-black uppercase text-xl italic">
            {pageNumber} / {numPages}
          </div>

          <button
            onClick={() => setPageNumber((prev) => Math.min(prev + 1, numPages))}
            disabled={pageNumber >= numPages}
            className="neo-button bg-white text-black disabled:opacity-30 disabled:shadow-none"
          >
            <span className="mr-2 uppercase text-xs">NEXT</span>
            <ChevronRight className="w-6 h-6" strokeWidth={4} />
          </button>
        </div>
      )}
    </div>
  );
};

const Documents = () => {
  const [selectedPdfUrl] = useState<string | null>(MOCK_PDF_URL);
  const fileName = "FUNDAMENTALS_ER_MODEL.PDF";

  return (
    <div className="h-screen w-full bg-[#FDFDFD] overflow-hidden flex flex-col p-8 md:p-12">
      {/* Header */}
      <div className="border-8 border-black bg-white p-8 mb-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden rotate-[-0.5deg]">
        <div className="absolute top-0 right-0 w-24 h-24 bg-info border-l-8 border-b-8 border-black"></div>
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          <div>
            <h1 className="text-4xl md:text-7xl font-black text-black flex items-center gap-4 font-heading uppercase leading-none">
              <FolderOpen className="w-12 h-12 text-black" strokeWidth={3} />
              THE VAULT
            </h1>
            <p className="text-black font-bold uppercase text-xs mt-2 border-l-4 border-secondary pl-3">Accessing high-value knowledge assets.</p>
          </div>
          <button className="neo-button bg-primary text-black flex items-center gap-3 uppercase h-16">
            <Download className="w-6 h-6" strokeWidth={3} />
            EXPORT PORTFOLIO
          </button>
        </div>
      </div>

      {/* Document Preview */}
      <div className="flex-1 overflow-hidden">
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
