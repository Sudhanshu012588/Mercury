import pymupdf
from pathlib import Path


def parsePDF(pdf_path: Path):
    pdf_path = Path(pdf_path).expanduser().resolve()
    doc = pymupdf.open(pdf_path)

    work_dir = pdf_path.parent
    images_dir = work_dir / "images"
    images_dir.mkdir(exist_ok=True)

    results = []

    for page_index, page in enumerate(doc):
        page_dict = page.get_text("dict")

        for block in page_dict.get("blocks", []):
            block_type = block.get("type")

            # -------- TEXT BLOCK --------
            if block_type == 0:
                text_content = ""
                for line in block.get("lines", []):
                    for span in line.get("spans", []):
                        text_content += span.get("text", "")

                if text_content.strip():
                    results.append({
                        "type": "text",
                        "page": page_index,
                        "content": text_content.strip()
                    })

            # -------- IMAGE BLOCK --------
            elif block_type == 1:
                img_data = block.get("image")

                # New PyMuPDF: image bytes
                if isinstance(img_data, (bytes, bytearray)):
                    pix = pymupdf.Pixmap(img_data)

                # Old PyMuPDF: xref id
                else:
                    pix = pymupdf.Pixmap(doc, img_data)

                # Normalize to RGB
                if pix.n - pix.alpha > 3:
                    pix = pymupdf.Pixmap(pymupdf.csRGB, pix)

                image_name = f"page_{page_index}_img_{len(results)}.png"
                image_path = images_dir / image_name
                pix.save(image_path)
                pix = None

                results.append({
                    "type": "image",
                    "page": page_index,
                    "path": str(image_path)
                })

    doc.close()

    txt_path = pdf_path.with_suffix(".txt")

    with open(txt_path, "w", encoding="utf-8") as f:
        for item in results:
            if item["type"] == "text":
                f.write(item["content"] + "\n\n")
            else:
                f.write(f"[IMAGE: {item['path']}]\n\n")

    return {
        "status": "success",
        "txt_path": str(txt_path),
        "images_dir": str(images_dir),
        "items_extracted": len(results)
    }
