import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// This line is REQUIRED by the react-pdf library
// We'll use a reliable CDN for the worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function PDFViewer({ fileUrl }) {
  const [numPages, setNumPages] = useState(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  // Styles for the container
  const viewerStyle = {
    border: '1px solid #ccc',
    padding: '10px',
    marginTop: '20px',
    maxHeight: '80vh',
    overflowY: 'auto',
    background: '#f9f9f9',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  };

  return (
    <div style={viewerStyle}>
      <Document
        file={fileUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={(error) => console.error('Error loading PDF:', error)}
        loading="Loading PDF document..."
      >
        {/* This will render all pages of the PDF */}
        {Array.from(new Array(numPages), (el, index) => (
          <Page 
            key={`page_${index + 1}`} 
            pageNumber={index + 1}
            width={800} // You can change this width
            
            // These two lines prevent the CSS errors
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        ))}
      </Document>
    </div>
  );
}

export default PDFViewer;

