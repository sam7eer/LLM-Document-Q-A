import os
from docx import Document

class DocumentProcessor:
    """Extracts raw text from various document formats, preserving page numbers where possible."""

    @staticmethod
    def parse_file(file_path: str, filename: str) -> list[dict]:
        """
        Parses a file and returns a list of dictionaries containing text and metadata.
        Returns: [{"text": "...", "metadata": {"page": 1}}]
        """
        ext = os.path.splitext(filename)[1].lower()

        if ext == ".pdf":
            return DocumentProcessor._parse_pdf(file_path)
        elif ext == ".docx":
            return DocumentProcessor._parse_docx(file_path)
        elif ext in [".txt", ".md"]:
            return DocumentProcessor._parse_txt(file_path)
        else:
            raise ValueError(f"Unsupported file extension: {ext}")

    @staticmethod
    def _parse_pdf(file_path: str) -> list[dict]:
        import pypdf
        pages = []
        with open(file_path, "rb") as f:
            reader = pypdf.PdfReader(f)
            for page_num in range(len(reader.pages)):
                page = reader.pages[page_num]
                text = page.extract_text()
                if text:
                    text = text.replace('\x00', '')
                    if text.strip():
                        pages.append({
                            "text": text,
                            "metadata": {"page": page_num + 1}
                        })
        return pages

    @staticmethod
    def _parse_docx(file_path: str) -> list[dict]:
        doc = Document(file_path)
        full_text = []
        for para in doc.paragraphs:
            if para.text.strip():
                full_text.append(para.text)
        
        # Word docs don't easily give us page numbers, so we treat it all as page 1
        return [{
            "text": "\n".join(full_text),
            "metadata": {"page": 1}
        }]

    @staticmethod
    def _parse_txt(file_path: str) -> list[dict]:
        with open(file_path, "r", encoding="utf-8") as f:
            text = f.read()
        return [{
            "text": text,
            "metadata": {"page": 1}
        }]
