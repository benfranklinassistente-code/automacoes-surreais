#!/bin/bash
# OCR melhorado para ler imagens

IMG="$1"

if [ -z "$IMG" ]; then
  echo "Uso: ./ocr-melhorado.sh <imagem>"
  exit 1
fi

# Tentar diferentes modos PSM
for psm in 11 6 3 4; do
  RESULT=$(tesseract "$IMG" stdout -l por --psm $psm --oem 1 2>/dev/null | grep -v "^$" | head -10)
  if [ -n "$RESULT" ]; then
    echo "=== PSM $psm ==="
    echo "$RESULT"
    echo ""
  fi
done
