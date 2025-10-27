import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Required setup line
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

function PDFViewer({ fileUrl }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1); // Current page
  const [goToPageInput, setGoToPageInput] = useState("1"); // Input field state

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
    setGoToPageInput("1"); // Reset input on new document
  }

  function changePage(offset) {
    const newPageNumber = pageNumber + offset;
    if (newPageNumber >= 1 && newPageNumber <= numPages) {
        setPageNumber(newPageNumber);
        setGoToPageInput(newPageNumber.toString()); // Update input field as well
    }
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  // --- NEW: Handler for the Go To Page input ---
  const handleGoToPageChange = (e) => {
    setGoToPageInput(e.target.value);
  };

  // --- NEW: Handler for the Go button ---
  const handleGoToPageSubmit = (e) => {
    e.preventDefault(); // Prevent form submission if wrapped in form
    const page = parseInt(goToPageInput, 10);
    // Validate the input
    if (!isNaN(page) && page >= 1 && page <= numPages) {
      setPageNumber(page);
    } else {
        // Optionally reset input or show an error if invalid
        setGoToPageInput(pageNumber.toString()); // Reset to current page number
        alert(`Please enter a page number between 1 and ${numPages}`);
    }
  };
  // --- END NEW ---


  return (
    <div className="pdf-viewer-container">
      <Document
        file={fileUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={(error) => {
          console.error('Error loading PDF:', error);
        }}
        loading={"Loading PDF..."}
      >
        <Page
           pageNumber={pageNumber}
           // Make width slightly smaller to fit controls better
           width={Math.min(window.innerWidth * 0.75, 750)} 
           renderTextLayer={false}
           renderAnnotationLayer={false}
        />
      </Document>

      {/* --- MODIFIED: Page Navigation Controls --- */}
      {numPages && (
        <div className="pdf-navigation">
          <button
            type="button"
            disabled={pageNumber <= 1}
            onClick={previousPage}
          >
            Previous
          </button>
          
          {/* Page X of Y text */}
          <span>
             Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
          </span>

          <button
            type="button"
            disabled={pageNumber >= numPages}
            onClick={nextPage}
          >
            Next
          </button>

          {/* Go to Page Input and Button */}
          <form onSubmit={handleGoToPageSubmit} style={{ display: 'inline-block', marginLeft: '15px' }}>
            <input
              type="number"
              value={goToPageInput}
              onChange={handleGoToPageChange}
              min="1"
              max={numPages}
              style={{ width: '60px', padding: '5px', marginRight: '5px', textAlign: 'center' }}
            />
            <button type="submit">
              Go
            </button>
          </form>
        </div>
      )}
      {/* --- END MODIFICATION --- */}
    </div>
  );
}

export default PDFViewer;