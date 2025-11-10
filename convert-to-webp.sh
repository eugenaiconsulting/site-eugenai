#!/bin/bash

# Script pour convertir toutes les images en WebP
# Usage: ./convert-to-webp.sh

echo "🖼️  Conversion des images en WebP..."

# Créer le dossier pour les images WebP si il n'existe pas
mkdir -p assets/webp

# Vérifier si ImageMagick ou cwebp est installé
if command -v cwebp &> /dev/null; then
    CONVERTER="cwebp"
elif command -v magick &> /dev/null; then
    CONVERTER="magick"
else
    echo "❌ Erreur: cwebp ou ImageMagick doit être installé"
    echo "Installez avec: brew install webp (pour cwebp)"
    echo "Ou: brew install imagemagick (pour magick)"
    exit 1
fi

# Compter les fichiers
TOTAL=$(find assets -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) ! -path "*/webp/*" | wc -l | tr -d ' ')
COUNT=0

# Fonction pour convertir une image
convert_image() {
    local file="$1"
    local filename=$(basename "$file")
    local name="${filename%.*}"
    local ext="${filename##*.}"
    
    # Créer le chemin de sortie
    local output="assets/webp/${name}.webp"
    
    # Convertir en WebP
    if [ "$CONVERTER" = "cwebp" ]; then
        cwebp -q 85 "$file" -o "$output" 2>/dev/null
    else
        magick "$file" -quality 85 "$output" 2>/dev/null
    fi
    
    if [ $? -eq 0 ]; then
        COUNT=$((COUNT + 1))
        local original_size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
        local new_size=$(stat -f%z "$output" 2>/dev/null || stat -c%s "$output" 2>/dev/null)
        local reduction=$((100 - (new_size * 100 / original_size)))
        echo "✅ [$COUNT/$TOTAL] $filename → ${name}.webp (réduction: ~${reduction}%)"
    else
        echo "❌ Erreur lors de la conversion de $filename"
    fi
}

# Convertir toutes les images
find assets -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) ! -path "*/webp/*" | while read file; do
    convert_image "$file"
done

echo ""
echo "✨ Conversion terminée! $COUNT images converties en WebP"
echo "📁 Les images WebP sont dans: assets/webp/"
echo ""
echo "💡 Pour utiliser les images WebP, modifiez vos fichiers HTML pour utiliser:"
echo "   <img src='assets/webp/nom-image.webp' alt='...'>"

