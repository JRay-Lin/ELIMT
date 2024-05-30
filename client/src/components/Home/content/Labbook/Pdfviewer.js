import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useDropzone } from "react-dropzone";
import { Grid, Typography, Paper, Button } from "@mui/material";

// PDF.js path
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.js",
    import.meta.url
).toString();

export default function PdfViewer({ onFileSelect }) {
    const [numPages, setNumPages] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    const { getRootProps, getInputProps } = useDropzone({
        accept: "application/pdf",
        onDrop: (acceptedFiles) => {
            const file = Object.assign(acceptedFiles[0], {
                preview: URL.createObjectURL(acceptedFiles[0]),
            });
            setPdfFile(file);
            onFileSelect(file); // 觸發回調函數，傳遞檔案給父組件
        },
    });

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
        setPageNumber(1);
    }

    function changePage(offset) {
        setPageNumber((prevPageNumber) => prevPageNumber + offset);
    }

    function previousPage() {
        changePage(-1);
    }
    function nextPage() {
        changePage(1);
    }

    return (
        <Paper className="paper" sx={{ color: "#1e1e1e" }}>
            <Grid
                {...getRootProps({ className: "dropzone" })}
                sx={{
                    width: "100%",
                    padding: 1,
                }}
            >
                <input {...getInputProps()} />
                <Typography
                    sx={{
                        fontWeight: "bold",
                        textAlign: "center",
                    }}
                >
                    拖放PDF檔案到這裡,或點擊選擇檔案
                </Typography>
                {pdfFile && (
                    <Document
                        file={pdfFile.preview}
                        onLoadSuccess={onDocumentLoadSuccess}
                    >
                        <Page pageNumber={pageNumber} />
                    </Document>
                )}
            </Grid>

            <Grid
                container
                spacing={1}
                alignItems="center"
                justifyContent="center"
            >
                <Button
                    type="button"
                    disabled={pageNumber <= 1}
                    onClick={previousPage}
                >
                    {"<"}
                </Button>
                <Typography>
                    {pageNumber || (numPages ? 1 : "--")} / {numPages || "--"}
                </Typography>
                <Button
                    type="button"
                    disabled={pageNumber >= numPages}
                    onClick={nextPage}
                >
                    {">"}
                </Button>
            </Grid>
        </Paper>
    );
}
