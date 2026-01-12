import * as pdfjs from 'pdfjs-dist';
import mammoth from 'mammoth';

// Set up PDF.js worker using Vite-compatible URL pattern
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
).toString();

export const extractTextFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map((item: any) => item.str);
        fullText += strings.join(' ') + '\n';
    }

    return fullText;
};

export const extractTextFromDOCX = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
};

export const handleFileUpload = async (file: File): Promise<string> => {
    const extension = file.name.split('.').pop()?.toLowerCase();

    switch (extension) {
        case 'txt':
            return await file.text();
        case 'pdf':
            return await extractTextFromPDF(file);
        case 'docx':
            return await extractTextFromDOCX(file);
        default:
            throw new Error('Unsupported file format');
    }
};
