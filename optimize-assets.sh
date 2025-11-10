#!/bin/bash

# Script d'optimisation des assets
# Ce script nécessite FFmpeg et ImageMagick (optionnel)

echo "🚀 Début de l'optimisation des assets..."

# Vérifier si FFmpeg est installé
if ! command -v ffmpeg &> /dev/null; then
    echo "⚠️  FFmpeg n'est pas installé. Installez-le avec: brew install ffmpeg"
    echo "   Ou utilisez un outil en ligne comme HandBrake ou CloudConvert"
else
    echo "✅ FFmpeg détecté"
    
    # Créer un dossier pour les vidéos optimisées
    mkdir -p assets/optimized
    
    echo "📹 Compression des vidéos..."
    
    # Vidéo hero (si elle existe)
    if [ -f "assets/18069166-uhd_3840_2160_24fps.mp4" ]; then
        echo "  → Compression de la vidéo hero..."
        ffmpeg -i "assets/18069166-uhd_3840_2160_24fps.mp4" \
            -vf "scale=1920:1080" \
            -crf 28 \
            -preset slow \
            -movflags +faststart \
            -an \
            "assets/optimized/hero-video-optimized.mp4" 2>/dev/null
        
        if [ -f "assets/optimized/hero-video-optimized.mp4" ]; then
            ORIGINAL_SIZE=$(du -h "assets/18069166-uhd_3840_2160_24fps.mp4" | cut -f1)
            OPTIMIZED_SIZE=$(du -h "assets/optimized/hero-video-optimized.mp4" | cut -f1)
            echo "     ✅ Optimisé: $ORIGINAL_SIZE → $OPTIMIZED_SIZE"
        fi
    fi
    
    # Vidéo automatisation
    if [ -f "assets/Automatisation ia.mp4" ]; then
        echo "  → Compression de la vidéo automatisation..."
        ffmpeg -i "assets/Automatisation ia.mp4" \
            -vf "scale=1920:1080" \
            -crf 28 \
            -preset slow \
            -movflags +faststart \
            "assets/optimized/automatisation-optimized.mp4" 2>/dev/null
        
        if [ -f "assets/optimized/automatisation-optimized.mp4" ]; then
            ORIGINAL_SIZE=$(du -h "assets/Automatisation ia.mp4" | cut -f1)
            OPTIMIZED_SIZE=$(du -h "assets/optimized/automatisation-optimized.mp4" | cut -f1)
            echo "     ✅ Optimisé: $ORIGINAL_SIZE → $OPTIMIZED_SIZE"
        fi
    fi
    
    # Vidéo formation
    if [ -f "assets/formation et accompagnement.mp4" ]; then
        echo "  → Compression de la vidéo formation..."
        ffmpeg -i "assets/formation et accompagnement.mp4" \
            -vf "scale=1920:1080" \
            -crf 28 \
            -preset slow \
            -movflags +faststart \
            "assets/optimized/formation-optimized.mp4" 2>/dev/null
        
        if [ -f "assets/optimized/formation-optimized.mp4" ]; then
            ORIGINAL_SIZE=$(du -h "assets/formation et accompagnement.mp4" | cut -f1)
            OPTIMIZED_SIZE=$(du -h "assets/optimized/formation-optimized.mp4" | cut -f1)
            echo "     ✅ Optimisé: $ORIGINAL_SIZE → $OPTIMIZED_SIZE"
        fi
    fi
fi

# Vérifier si ImageMagick est installé
if ! command -v magick &> /dev/null; then
    echo "⚠️  ImageMagick n'est pas installé. Utilisez Squoosh.app ou TinyPNG pour optimiser les images"
    echo "   Installez avec: brew install imagemagick"
else
    echo "✅ ImageMagick détecté"
    echo "📸 Pour optimiser les images, utilisez plutôt Squoosh.app (plus efficace)"
    echo "   https://squoosh.app/"
fi

echo ""
echo "📊 Résumé:"
echo "  - Vidéos optimisées sont dans assets/optimized/"
echo "  - Remplacez les chemins dans les fichiers HTML si vous utilisez les versions optimisées"
echo "  - Pour les images, utilisez: https://squoosh.app/"
echo ""
echo "✅ Optimisation terminée !"
echo ""
echo "📋 Prochaines étapes:"
echo "  1. Testez les vidéos optimisées"
echo "  2. Si satisfait, remplacez les fichiers originaux"
echo "  3. Optimisez les images avec Squoosh.app"
echo "  4. Testez le site avec PageSpeed Insights"

