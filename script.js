function loadPDF() {
    let pdfName = document.getElementById('pdfName').value;
    let pdfPassword = document.getElementById('pdfPassword').value;
    let pdfViewer = document.getElementById('pdfViewer');

    if (pdfName == 'undefined' || pdfName == null || pdfName == "") {
        alert('Please enter student name');
    }

   /* if (pdfPassword == 'undefined' || pdfPassword == null || pdfPassword == "") {
        alert('Please enter PDF password');
    }*/
    // PDF.js logic to display the PDF
    //const loadingTask = pdfjsLib.getDocument({ url: `path/to/pdfs/${pdfName}.pdf`, password: pdfPassword });
    if (pdfName != 'undefined' && pdfName != "") {
        if (pdfName.lastIndexOf(".") != -1) {
            pdfName = pdfName.substring(0, pdfName.lastIndexOf("."));
        }
        viewPDFOnPage(pdfName.toUpperCase(), pdfPassword);
    }
}

function viewPDFOnPage(pdfName, pdfPassword) {
    const loadingTask = pdfjsLib.getDocument({ url: `${pdfName}.pdf`, password: pdfPassword });
    console.log('Loading PDF...');
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
        alert('PDF not found or password incorrect. Please try again.');
    });
}

function downloadPDF() {
    let pdfName = document.getElementById("pdfName").value;
    if (pdfName == 'undefined' || pdfName == null || pdfName == "") {
        alert('Please enter student name');
    }
    if (pdfName != 'undefined' && pdfName != "") {
        if (pdfName.lastIndexOf(".") != -1) {
            let ext = pdfName.substring(pdfName.lastIndexOf(".") + 1, pdfName.length);
            if ('pdf' == ext.toLowerCase()) {
                pdfName = pdfName.substring(0, pdfName.lastIndexOf("."));
            }
        }

        pdfName = pdfName.toUpperCase() + ".pdf";
        window.open(encodeURI(pdfName));
        /* const xHttp = new XMLHttpRequest();
         xHttp.onload = function () {
             const arrayBuffer = this.response;
             if (arrayBuffer) {
                 const byteArray = new Uint8Array(arrayBuffer);
                 byteArray.forEach((element, index) => {
 
                 });
                 let blob = new Blob([byteArray], { type: "application/pdf" });
                 let link = document.createElement('a');
                 link.href = window.URL.createObjectURL(blob);
                 link.download = pdfName;
                 link.click();
             }
         };
 
         xHttp.open('GET', pdfName, true);
         xHttp.send();
         xHttp.responseType = "arraybuffer";*/
    }
}

document.getElementById("pdfName").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("downloadpdf").click();
    }
});

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
            rowData.sort((a, b) => { return a.Names.toLowerCase() > b.Names.toLowerCase() ? 1 : -1; });
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

