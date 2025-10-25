import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Required setup line
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

function PDFViewer({ fileUrl }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1); // Start on page 1

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1); // Reset to page 1 when new PDF loads
  }

  function changePage(offset) {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  }

  function previousPage() {
    if (pageNumber > 1) {
      changePage(-1);
    }
  }

  function nextPage() {
    if (pageNumber < numPages) {
      changePage(1);
    }
  }

  return (
    <div className="pdf-viewer-container">
      <Document
        file={fileUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={(error) => {
          console.error('Error loading PDF:', error);
          // Optionally display an error message to the user here
        }}
        // Add an explicit loading message
        loading={"Loading PDF..."} 
      >
        {/* Only render the current page */}
        <Page 
           pageNumber={pageNumber} 
           width={Math.min(window.innerWidth * 0.8, 800)} // Responsive width
           renderTextLayer={false} // Disable text layer for performance
           renderAnnotationLayer={false} // Disable annotation layer
        />
      </Document>
      
      {/* Page Navigation Controls */}
      {numPages && (
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <p>
            Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
          </p>
          <button
            type="button"
            disabled={pageNumber <= 1}
            onClick={previousPage}
            style={{ marginRight: '10px' }}
          >
            Previous
          </button>
          <button
            type="button"
            disabled={pageNumber >= numPages}
            onClick={nextPage}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default PDFViewer;