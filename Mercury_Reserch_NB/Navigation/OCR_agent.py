import re
from pathlib import Path
from google.cloud import vision
from google.oauth2 import service_account


# ------------------------------------------------------------------
# Build Google Vision Client from credential path
# ------------------------------------------------------------------
def get_vision_client(creds_path: str):
    creds_path = Path(creds_path).expanduser().resolve()

    if not creds_path.exists():
        raise RuntimeError(f"Google credential file not found: {creds_path}")

    credentials = service_account.Credentials.from_service_account_file(str(creds_path))
    return vision.ImageAnnotatorClient(credentials=credentials)


# ------------------------------------------------------------------
# Pattern to detect [IMAGE: path]
# ------------------------------------------------------------------
IMAGE_PATTERN = re.compile(r"\[IMAGE:\s*(.*?)\s*\]")


# ------------------------------------------------------------------
# Run OCR
# ------------------------------------------------------------------
def ocr_image(image_path: str, client: vision.ImageAnnotatorClient) -> str:
    image_path = Path(image_path).expanduser().resolve()

    if not image_path.exists():
        return f"[OCR FAILED: Image not found: {image_path}]"

    try:
        with open(image_path, "rb") as f:
            content = f.read()

        image = vision.Image(content=content)
        response = client.document_text_detection(image=image)

        if response.error.message:
            return f"[OCR FAILED: {response.error.message}]"

        text = (response.full_text_annotation.text or "").strip()
        return text if text else "[NO TEXT FOUND]"

    except Exception as e:
        return f"[OCR FAILED: {str(e)}]"


# ------------------------------------------------------------------
# Process TXT → Replace [IMAGE: path] → Save _ocr.txt
# ------------------------------------------------------------------
def process_txt(txt_path: str, creds_path: str) -> str:
    txt_path = Path(txt_path).expanduser().resolve()
    if not txt_path.exists():
        raise FileNotFoundError(f"TXT file not found: {txt_path}")

    client = get_vision_client(creds_path)

    content = txt_path.read_text(encoding="utf-8")
    matches = re.findall(IMAGE_PATTERN, content)

    if not matches:
        print("No image references found in text file.")
        return str(txt_path)

    print(f"Found {len(matches)} image reference(s). Running OCR...")

    seen = {}

    for img_path in matches:
        img_path = img_path.strip()

        if img_path in seen:
            ocr_text = seen[img_path]
        else:
            print(f"OCR Processing: {img_path}")
            ocr_text = ocr_image(img_path, client)
            seen[img_path] = ocr_text

        replacement = (
            "\n===== OCR EXTRACTED TEXT FROM IMAGE =====\n"
            + ocr_text +
            "\n=========================================\n"
        )

        placeholder = f"[IMAGE: {img_path}]"
        content = content.replace(placeholder, replacement)

    output_path = txt_path.with_name(txt_path.stem + "_ocr.txt")
    output_path.write_text(content, encoding="utf-8")

    print(f"Done! Saved OCR text file → {output_path}")
    return str(output_path)


# ------------------------------------------------------------------
# CLI Support
# ------------------------------------------------------------------
if __name__ == "__main__":
    process_txt("yourfile.txt", "/absolute/path/to/service_account.json")
