#!/bin/bash

# Script pour optimiser les vidéos
# Usage: ./optimize-videos.sh

echo "🎬 Optimisation des vidéos..."

# Vérifier si ffmpeg est installé
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ Erreur: ffmpeg doit être installé"
    echo "Installez avec: brew install ffmpeg"
    exit 1
fi

# Créer le dossier pour les vidéos optimisées
mkdir -p assets/videos-optimized

# Fonction pour optimiser une vidéo
optimize_video() {
    local file="$1"
    local filename=$(basename "$file")
    local name="${filename%.*}"
    local ext="${filename##*.}"
    
    # Créer le chemin de sortie
    local output="assets/videos-optimized/${name}_optimized.mp4"
    
    echo "🔄 Optimisation de $filename..."
    
    # Optimiser la vidéo: réduire la résolution à 1080p et compresser
    ffmpeg -i "$file" \
        -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" \
        -c:v libx264 \
        -preset slow \
        -crf 28 \
        -maxrate 3M \
        -bufsize 6M \
        -c:a aac \
        -b:a 128k \
        -movflags +faststart \
        -y \
        "$output" 2>/dev/null
    
    if [ $? -eq 0 ]; then
        local original_size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
        local new_size=$(stat -f%z "$output" 2>/dev/null || stat -c%s "$output" 2>/dev/null)
        local reduction=$((100 - (new_size * 100 / original_size)))
        echo "✅ $filename → ${name}_optimized.mp4 (réduction: ~${reduction}%)"
        echo "   Taille originale: $(numfmt --to=iec-i --suffix=B $original_size 2>/dev/null || echo "$((original_size / 1024 / 1024))MB")"
        echo "   Taille optimisée: $(numfmt --to=iec-i --suffix=B $new_size 2>/dev/null || echo "$((new_size / 1024 / 1024))MB")"
    else
        echo "❌ Erreur lors de l'optimisation de $filename"
    fi
}

# Trouver et optimiser toutes les vidéos MP4
COUNT=0
TOTAL=$(find assets -type f -name "*.mp4" ! -path "*/videos-optimized/*" | wc -l | tr -d ' ')

find assets -type f -name "*.mp4" ! -path "*/videos-optimized/*" | while read file; do
    COUNT=$((COUNT + 1))
    optimize_video "$file"
    echo ""
done

echo "✨ Optimisation terminée! Vidéos optimisées dans: assets/videos-optimized/"
echo ""
echo "💡 Pour utiliser les vidéos optimisées, modifiez vos fichiers HTML pour utiliser:"
echo "   <source src='assets/videos-optimized/nom-video_optimized.mp4' type='video/mp4'>"

