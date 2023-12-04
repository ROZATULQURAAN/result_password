function loadPDF() {
    const pdfName = document.getElementById('pdfName').value;
    const pdfPassword = document.getElementById('pdfPassword').value;
    const pdfViewer = document.getElementById('pdfViewer');

    // PDF.js logic to display the PDF
    //const loadingTask = pdfjsLib.getDocument({ url: `path/to/pdfs/${pdfName}.pdf`, password: pdfPassword });
    const loadingTask = pdfjsLib.getDocument({ url: `${pdfName}.pdf`, password: pdfPassword });

    loadingTask.promise.then(function (pdfDoc) {
        // Set up the viewer
        const pdfViewer = document.getElementById('pdfViewer');
        pdfViewer.innerHTML = ''; // Clear previous content

        // Loop through each page in the PDF
        for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
            // Create a container for each page
            const pageContainer = document.createElement('div');
            pageContainer.className = 'page-container';

            // Append the container to the viewer
            pdfViewer.appendChild(pageContainer);

            // Render the page into the container
            pdfDoc.getPage(pageNum).then(function (pdfPage) {
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                pageContainer.appendChild(canvas);

                const viewport = pdfPage.getViewport({ scale: 1.5 });
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                const renderTask = pdfPage.render({ canvasContext: context, viewport: viewport });
                renderTask.promise.then(function () {
                    // Page rendered
                });
            });
        }
    }).catch(function (error) {
        console.error('Error loading PDF:', error);
        pdfViewer.innerHTML = 'PDF not found or password incorrect.';
    });
}
