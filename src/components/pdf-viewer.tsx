import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { Button } from './ui/button';
import { ArrowLeft, ArrowRight, FileX2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

interface PdfViewerProps {
    pdfUrl: string;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ pdfUrl }) => {
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);

    const [error, setError] = useState<string | null>(null);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setPageNumber(1);
    };

    const onDocumentLoadError = (error: Error) => {
        toast.error(`PDF Load Error: ${(error as any)?.message}`);
        setError('Gagal memuat dokumen PDF. Silakan periksa koneksi atau format file.');
    };

    return (
        <div className={cn("flex flex-col items-center gap-15 rounded-md p-10", error ? 'bg-gray-100' : 'bg-gray-300')}>
            <div className="w-full flex justify-center">
                <div className="w-full">
                    {
                        error ? (
                            <div className="h-[200px] flex flex-col items-center justify-center text-red-600 text-center text-base gap-4 font-semibold">
                                <FileX2 className='h-10 w-10' />
                                {error}
                            </div>
                        ) : (
                            <Document
                                loading={
                                    <div className="bg-transparent h-[200px] flex flex-col items-center justify-center text-gray-600 text-center text-base gap-4 font-semibold">
                                        <Loader2 className="animate-spin h-10 w-10" />
                                        Memuat dokumen...
                                    </div>
                                }
                                file={pdfUrl}
                                onLoadSuccess={onDocumentLoadSuccess}
                                onLoadError={onDocumentLoadError}
                                onSourceError={onDocumentLoadError}
                                className="w-full flex justify-center"
                            >
                                <Page pageNumber={pageNumber} width={900} />
                            </Document>
                        )}
                </div>
            </div>

            {
                !error && (
                    <div className="flex items-center justify-center gap-10">
                        <Button
                            qa='pdf-view-prev'
                            variant='primary'
                            type='button'
                            onClick={() => setPageNumber(p => Math.max(p - 1, 1))}
                            disabled={pageNumber <= 1}
                            className="w-[130px] disabled:opacity-50 gap-2"
                        >
                            <ArrowLeft className='h-4 w-4 -ml-2' />
                            Previous
                        </Button>
                        <div className="text-sm font-medium flex items-center gap-1">
                            <span>Page:</span>
                            <input
                                value={pageNumber}
                                qa-input='input-change-page-pdf'
                                type="number"
                                min="1"
                                max={numPages}
                                onChange={(e) => {
                                    let inputValue = Number(e.target.value);

                                    if (isNaN(inputValue)) return;

                                    const maxPages = numPages || 1;

                                    // Clamp value between 1 and maxPages
                                    if (inputValue < 1) inputValue = 1;
                                    if (inputValue > maxPages) inputValue = maxPages;

                                    setPageNumber(inputValue);
                                }}

                                className="border p-1 rounded w-10 text-center bg-white"
                            />
                            <span>of</span>
                            <span>{numPages}</span>
                        </div>
                        <Button
                            qa='pdf-view-next'
                            variant='primary'
                            type='button'
                            onClick={() => setPageNumber(p => Math.min(p + 1, numPages))}
                            disabled={pageNumber >= numPages}
                            className="w-[130px] disabled:opacity-50 gap-2"
                        >
                            Next
                            <ArrowRight className='h-4 w-4 -mr-2' />
                        </Button>
                    </div>
                )
            }
        </div>
    );
};

export default PdfViewer;
