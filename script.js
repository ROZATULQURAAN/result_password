function loadPDF() {
    console.log('Loading PDF...');
    const pdfName = document.getElementById('pdfName').value;
    const pdfPassword = document.getElementById('pdfPassword').value;
    const pdfViewer = document.getElementById('pdfViewer');

    // PDF.js logic to display the PDF
    //const loadingTask = pdfjsLib.getDocument({ url: `path/to/pdfs/${pdfName}.pdf`, password: pdfPassword });
    const loadingTask = pdfjsLib.getDocument({ url: `${pdfName}.pdf`, password: pdfPassword });

    loadingTask.promise.then(function (pdfDoc) {
        console.log('PDF loaded successfully:', pdfDoc);
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

const xHttp = new XMLHttpRequest();


xHttp.onload = function () {
    const arrayBuffer = this.response; // Note: not req.responseText
    if (arrayBuffer) {
        const byteArray = new Uint8Array(arrayBuffer);
        byteArray.forEach((element, index) => {
            // do something with each byte in the array
        });
        let fileData = byteArray;
        let workbook = XLSX.read(fileData, { type: "array" });
        workbook.SheetNames.forEach(sheet => {
            let rowData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet]);
            // Populate the datalist with suggestions
            var pdfSuggestionsList = document.getElementById('nameSuggestions');
            rowData.forEach(function (e) {
                var option = document.createElement('option');
                option.value = e.Names;
                pdfSuggestionsList.appendChild(option);
            });
        });
    }
};


xHttp.open('GET', 'student_list.xlsx', true);
xHttp.send();
xHttp.responseType = "arraybuffer";

