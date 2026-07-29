#!/usr/bin/env bash
# md2audio.sh - Convierte archivos .md a audio usando edge-tts
# Uso: ./md2audio.sh [archivo.md]  → un archivo
#      ./md2audio.sh todo          → todas las guías (un audio c/u)
#      ./md2audio.sh all           → todas combinadas en un solo audio

set -euo pipefail

EDGE_TTS="$HOME/Library/Python/3.9/bin/edge-tts"
STRIPPY="$(dirname "$0")/strip_md.py"
OUTDIR="audiolibros"
VOICE="es-MX-DaliaNeural"

mkdir -p "$OUTDIR"

convertir() {
  local input="$1"
  local base
  base=$(basename "$input" .md)
  local output="$OUTDIR/$base.mp3"

  echo "📖 Procesando: $base..."

  local clean_text
  clean_text=$("$STRIPPY" < "$input")

  if [ -z "$clean_text" ]; then
    echo "   ⚠️  Vacío después de limpiar markdown, saltando"
    return
  fi

  echo "$clean_text" | "$EDGE_TTS" \
    --voice "$VOICE" \
    --rate "+10%" \
    -f /dev/stdin \
    --write-media "$output" \
    --write-subtitles "${output%.mp3}.srt" 2>&1 && \
    echo "   ✅ $output" || \
    echo "   ❌ Falló $base"
}

echo "🎧 Conversor de guías a estudio ENIGH"
echo "   Voz: $VOICE"
echo "=========================================="

if [ $# -eq 0 ] || [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
  echo ""
  echo "Uso:"
  echo "  $0 archivo.md       → convierte un .md"
  echo "  $0 todo             → todas las guías (un audio por guía)"
  echo "  $0 all              → todas combinadas en un solo audio"
  echo "  $0                  → muestra ayuda"
  echo ""
  echo "Archivos disponibles:"
  for f in *.md; do
    size=$(wc -c < "$f" | tr -d ' ')
    echo "  • $f  ($(echo "scale=1; $size/1024" | bc) KB)"
  done
  exit 0
fi

if [ "$1" = "todo" ]; then
  echo ""
  for f in *.md; do
    convertir "$f"
  done
elif [ "$1" = "all" ]; then
  echo ""
  echo "📚 Combinando todas las guías en un solo audio..."
  > /tmp/md2audio_all.txt
  for f in *.md; do
    "$STRIPPY" < "$f" >> /tmp/md2audio_all.txt
    echo "" >> /tmp/md2audio_all.txt
  done
  cat /tmp/md2audio_all.txt | "$EDGE_TTS" \
    --voice "$VOICE" \
    --rate "+10%" \
    -f /dev/stdin \
    --write-media "$OUTDIR/todas-las-guias.mp3" \
    --write-subtitles "$OUTDIR/todas-las-guias.srt" 2>&1 && \
    echo "   ✅ $OUTDIR/todas-las-guias.mp3"
else
  echo ""
  convertir "$1"
fi

echo ""
echo "✅ Listo. Archivos en: $OUTDIR/"
echo "   (también se generaron .srt con subtítulos sincronizados)"
