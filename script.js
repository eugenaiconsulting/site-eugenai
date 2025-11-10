// Scripts pour le site Eugenia

// ========================================
// GALLERY NAVIGATION WITH SLIDING
// ========================================

// Galerie interactive avec souris
(function() {
  const galleryContainer = document.getElementById('galleryImages');
  const gallerySection = document.querySelector('.gallery-section');
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  if (!galleryContainer || !gallerySection) return;

  // Configuration
  const itemWidth = 500 + 100; // largeur + gap
  const sensitivity = 1.8; // Sensibilité du mouvement (précise)
  const returnSpeed = 0.12; // Vitesse de retour à la position d'origine (plus fluide)
  
  let isMouseInGallery = false;
  let currentOffset = 0;
  let targetOffset = 0;
  let animationId = null;
  
  // Position d'origine pour centrer l'image 3 (index 2)
  // Calculer la position pour centrer l'image 3 sur l'écran
  const screenCenter = window.innerWidth / 2;
  const imageCenter = itemWidth / 2;
  const originalOffset = -(itemWidth * 2) + screenCenter - imageCenter;
  
  let currentHoveredItem = null;
  
  function updateGallery() {
    if (galleryContainer) {
      const translateX = originalOffset + currentOffset;
      galleryContainer.style.transform = `translateX(${translateX}px)`;
    }
  }
  
  function animate() {
    if (!isMouseInGallery) {
      // Retour doux à la position d'origine
      targetOffset = 0;
    }
    
    // Interpolation douce
    currentOffset += (targetOffset - currentOffset) * returnSpeed;
    
    updateGallery();
    
    // Animation continue
    animationId = requestAnimationFrame(animate);
  }
  
  function handleMouseMove(e) {
    if (!isMouseInGallery) return;
    
    const rect = galleryContainer.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const containerWidth = rect.width;
    
    // Calculer la position relative de la souris (-1 à 1)
    const relativeX = (mouseX / containerWidth) * 2 - 1;
    
    // Inverser la logique : souris droite = images gauche
    // Limiter le déplacement
    const maxOffset = itemWidth * 1.4; // Déplacement précis et fluide
    let newTargetOffset = -relativeX * maxOffset * sensitivity;
    
    // Limiter pour navigation optimale
    newTargetOffset = Math.max(-itemWidth * 1.4, Math.min(itemWidth * 1.4, newTargetOffset));
    
    targetOffset = newTargetOffset;
  }
  
  function handleMouseEnter() {
    isMouseInGallery = true;
  }
  
  function handleMouseLeave() {
    isMouseInGallery = false;
  }
  
  // Event listeners - uniquement sur le container des images
  galleryContainer.addEventListener('mousemove', handleMouseMove);
  galleryContainer.addEventListener('mouseenter', handleMouseEnter);
  galleryContainer.addEventListener('mouseleave', handleMouseLeave);
  
  // Ajouter hover sur chaque image individuellement
  galleryItems.forEach((item) => {
    item.addEventListener('mouseenter', function() {
      // Retirer active de toutes les images
      galleryItems.forEach(img => img.classList.remove('active'));
      // Ajouter active uniquement à cette image
      this.classList.add('active');
      currentHoveredItem = this;
    });
    
    item.addEventListener('mouseleave', function() {
      // Retirer active quand la souris sort
      this.classList.remove('active');
      if (currentHoveredItem === this) {
        currentHoveredItem = null;
      }
    });
  });
  
  // Initialisation
  currentOffset = 0;
  targetOffset = 0;
  updateGallery();
  
  // Démarrer l'animation immédiatement
  animationId = requestAnimationFrame(animate);
  
  // Masquer les boutons de navigation
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  if (prevBtn) prevBtn.style.display = 'none';
  if (nextBtn) nextBtn.style.display = 'none';
})();

// Scroll libre - Plus de blocage

// Gestion de la vidéo principale - Stopper avant la fin noire
(function() {
  var video = document.querySelector('.video-bg');
  if (!video) return;
  
  var hasEnded = false;
  
  // Surveiller le temps de la vidéo
  video.addEventListener('timeupdate', function() {
    // Arrêter la vidéo juste avant la fin noire (par exemple à 95% de la durée)
    if (!hasEnded && video.duration > 0 && video.currentTime >= video.duration * 0.95) {
      hasEnded = true;
      video.pause();
      video.classList.add('video-ended');
      console.log('Vidéo arrêtée avant le fond noir - animation activée');
    }
  });
  
  // Désactiver la boucle
  video.loop = false;
})();

// Gestion de la vidéo d'intro
(function() {
  var introContainer = document.querySelector('.intro-video-container');
  var introVideo = document.querySelector('.intro-video');
  
  if (!introContainer || !introVideo) return;
  
  // Après 2.6 secondes, commencer la disparition
  setTimeout(function() {
    introContainer.classList.add('fade-out');
    
    // Supprimer complètement l'élément après la transition
    setTimeout(function() {
      introContainer.remove();
    }, 1500); // 1.5 secondes pour la transition
  }, 2600); // 2.6 secondes d'affichage
  
  // Optionnel : masquer la vidéo d'intro si elle se termine avant 4 secondes
  introVideo.addEventListener('ended', function() {
    introContainer.classList.add('fade-out');
    setTimeout(function() {
      introContainer.remove();
    }, 2000);
  });
})();

// Animation du texte quand il devient visible
(function() {
  var punchline = document.querySelector('.punchline');
  if (!punchline) return;
  
  var hasAnimated = false;
  
  function checkVisibility() {
    if (hasAnimated) return;
    
    var rect = punchline.getBoundingClientRect();
    var isVisible = rect.top < window.innerHeight && rect.bottom > 0;
    
    if (isVisible) {
      hasAnimated = true;
      punchline.classList.add('animate');
      console.log('Animation du texte déclenchée - texte visible');
    }
  }
  
  // Vérifier la visibilité au scroll
  window.addEventListener('scroll', checkVisibility);
  
  // Vérifier la visibilité au chargement
  window.addEventListener('load', checkVisibility);
  
  // Vérifier immédiatement
  checkVisibility();
})();


// Animation du ruban d'images
(function() {
  var ribbon = document.querySelector('#imageRibbon');
  if (!ribbon) return;
  
  var currentOffset = 0;
  var targetOffset = 0;
  var isVisible = true;
  var isMobile = window.innerWidth <= 768;
  var animationId;
  var isMouseNear = false;
  
  // Calculer les dimensions
  var cardWidth = 500; // Largeur d'une carte
  var cardGap = 30; // Espacement entre les cartes
  var visibleWidth = (cardWidth + cardGap) * 3; // Largeur pour 3 images visibles
  var totalCards = 5; // Nombre total d'images
  var containerWidth = window.innerWidth;
  
  // Gestion de la visibilité
  function handleVisibilityChange() {
    isVisible = document.visibilityState === 'visible';
  }
  
  document.addEventListener('visibilitychange', handleVisibilityChange);
  
  // Détection mobile
  function handleResize() {
    isMobile = window.innerWidth <= 768;
    containerWidth = window.innerWidth;
  }
  
  window.addEventListener('resize', handleResize);
  
  // Animation principale
  function animate() {
    if (!isVisible) {
      animationId = requestAnimationFrame(animate);
      return;
    }
    
    // Calculer la position cible
    if (!isMobile && isMouseNear) {
      var mouseX = window.mouseX || containerWidth / 2;
      var normalizedPosition = mouseX / containerWidth; // 0 = gauche, 1 = droite
      
      // Position cible pour afficher 3 images :
      // - À gauche (0) : montrer les 3 premières images (images 1, 2, 3)
      // - Au milieu (0.5) : montrer les 3 images du milieu (images 2, 3, 4)
      // - À droite (1) : montrer les 3 dernières images (images 3, 4, 5)
      
      // Calculer l'offset pour centrer les 3 images visibles
      var maxOffset = (cardWidth + cardGap) * 2; // 2 images de décalage maximum
      targetOffset = (normalizedPosition - 0.5) * maxOffset;
    } else {
      // Revenir au centre si la souris n'est pas sur la zone (images 2, 3, 4)
      targetOffset = 0;
    }
    
    // Interpolation fluide vers la position cible
    var speed = 0.08; // Vitesse de transition
    currentOffset += (targetOffset - currentOffset) * speed;
    
    // Appliquer la transformation
    ribbon.style.transform = 'translate3d(' + currentOffset + 'px, 0, 0)';
    
    animationId = requestAnimationFrame(animate);
  }
  
  // Démarrer l'animation
  animationId = requestAnimationFrame(animate);
  
  // Gestion de la souris
  if (!isMobile) {
    document.addEventListener('mousemove', function(e) {
      window.mouseX = e.clientX;
      
      // Vérifier si la souris est proche du ruban
      var container = ribbon.parentElement;
      var rect = container.getBoundingClientRect();
      var mouseY = e.clientY;
      
      // Zone de proximité verticale plus précise (150px au-dessus et en-dessous)
      var verticalProximity = 150;
      var isMouseInVerticalRange = mouseY >= (rect.top - verticalProximity) && mouseY <= (rect.bottom + verticalProximity);
      
      // Zone de proximité horizontale (toute la largeur de l'écran)
      var isMouseInHorizontalRange = e.clientX >= 0 && e.clientX <= window.innerWidth;
      
      isMouseNear = isMouseInVerticalRange && isMouseInHorizontalRange;
    });
    
    // Arrêter l'animation quand la souris quitte la zone
    document.addEventListener('mouseleave', function() {
      isMouseNear = false;
    });
  }
})();

// Gestion du menu - Fonction universelle qui fonctionne sur toutes les pages
(function initMenu(){
  var menuInitialized = false;
  
  function setupMenu() {
    // Éviter la double initialisation
    if (menuInitialized) return;
    
    var btn = document.querySelector('.menu-btn');
    var panel = document.querySelector('.side-panel');
    var closeBtn = document.querySelector('.panel-close');
    var backdrop = document.querySelector('.backdrop');
    
    if (!btn || !panel || !backdrop) {
      // Retry si le DOM n'est pas encore prêt
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupMenu);
      } else {
        // Retry après un court délai si le DOM est prêt mais les éléments ne sont pas encore là
        setTimeout(setupMenu, 100);
      }
      return;
    }
    
    menuInitialized = true;
    
    // S'assurer que le bouton est visible et fonctionnel
    btn.style.display = 'inline-flex';
    btn.style.visibility = 'visible';
    btn.style.opacity = '1';
    btn.style.zIndex = '9999';
    btn.style.pointerEvents = 'auto';
    
    console.log('Menu initialisé avec succès');
    
    function setOpen(isOpen){
      panel.classList.toggle('open', isOpen);
      backdrop.classList.toggle('open', isOpen);
      btn.setAttribute('aria-expanded', String(isOpen));
      panel.setAttribute('aria-hidden', String(!isOpen));
      backdrop.setAttribute('aria-hidden', String(!isOpen));
      // Positionnement contextuel du bouton quand le menu est ouvert
      document.body.classList.toggle('menu-open', isOpen);
      // Quand le menu est ouvert, cacher le bouton menu - seul le X reste visible
      if (isOpen) {
        btn.style.visibility = 'hidden';
        btn.style.pointerEvents = 'none';
        btn.style.opacity = '0';
        btn.style.display = 'none';
      } else {
        btn.style.visibility = 'visible';
        btn.style.pointerEvents = 'auto';
        btn.style.opacity = '1';
        btn.style.display = 'inline-flex';
      }
    }
    
    function togglePanel(){ 
      setOpen(!panel.classList.contains('open')); 
    }
    
    // Ajouter les event listeners
    btn.addEventListener('click', togglePanel);
    backdrop.addEventListener('click', function(){ setOpen(false); });
    // bouton interne X (robuste, avec délégation au cas où)
    if (closeBtn) {
      closeBtn.addEventListener('click', function(){ setOpen(false); });
    }
    document.addEventListener('click', function(e){
      var closeEl = e.target && e.target.closest ? e.target.closest('.panel-close') : null;
      if (closeEl && panel.classList.contains('open')) {
        setOpen(false);
      }
    });
    
    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape' && panel.classList.contains('open')) { 
        setOpen(false); 
      }
    });
    
    // Gestion des sous-menus
    var categories = document.querySelectorAll('.nav-category');
    
    categories.forEach(function(category) {
      var mainCategory = category.querySelector('.main-category');
      var submenu = category.querySelector('.submenu');
      
      if (mainCategory && submenu) {
        // Ajouter l'event listener (permet plusieurs clics pour toggle)
        mainCategory.addEventListener('click', function(e) {
          var href = mainCategory.getAttribute('href');
          
          // Si c'est le lien SERVICES qui redirige vers #services
          if (href && (href.includes('#services') || href === '/#services' || href === '#services' || href === '/#services')) {
            e.preventDefault();
            setOpen(false);
            setTimeout(function() {
              if (href.includes('index.html')) {
                window.location.href = href;
              } else if (href.startsWith('#')) {
                // Si on est sur index.html, naviguer vers l'ancre
                if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
                  window.location.hash = href.replace('#', '');
                } else {
                  window.location.href = 'index.html' + href;
                }
              } else {
                window.location.href = href;
              }
            }, 400);
            return;
          }
          
          // Pour les liens avec # uniquement, toggle le sous-menu
          if (href === '#' || !href) {
            e.preventDefault();
            category.classList.toggle('active');
            
            // Fermer les autres catégories
            categories.forEach(function(otherCategory) {
              if (otherCategory !== category) {
                otherCategory.classList.remove('active');
              }
            });
          }
          // Pour les autres liens (pages), fermer le menu et laisser naviguer
          else if (href && !href.includes('#')) {
            setOpen(false);
            // Laisser le navigateur gérer la navigation normalement
          }
        });
      }
    });
    
    // Fermer le menu quand on clique sur n'importe quel lien de sous-menu
    var submenuLinks = document.querySelectorAll('.submenu-item');
    submenuLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        setOpen(false);
      });
    });
  }
  
  // Essayer de setup immédiatement si le DOM est déjà chargé
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupMenu);
  } else {
    setupMenu();
  }
})();

// ========================================
// ANIMATION RUBAN D'IMAGES INFINI
// ========================================

(function() {
  // Images de démo
  const demoImages = [
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=400&fit=crop&crop=center'
  ];

  // Configuration
  const config = {
    rowHeight: 220,
    gap: 16,
    baseSpeed: 0.05,
    maxSpeed: 3,
    zones: 5
  };

  // Variables d'état
  let animationId;
  let offset = 0;
  let mouseX = 0;
  let isMouseOver = false;
  let isDragging = false;
  let dragStartX = 0;
  let dragOffset = 0;
  let lastTouchX = 0;
  let velocity = 0;
  let lastTime = 0;
  let zones = [];
  let cardStates = [];
  let isMobile = false;

  // Éléments DOM
  let ribbonContainer;
  let ribbonCards = [];

  // Initialisation
  function init() {
    ribbonContainer = document.getElementById('infiniteRibbon');
    if (!ribbonContainer) return;

    // Détection mobile
    isMobile = window.innerWidth < 768 || 'ontouchstart' in window;

    // Générer les cartes d'images
    generateRibbonCards();

    // Calculer les zones
    calculateZones();

    // Initialiser les états des cartes
    initializeCardStates();

    // Démarrer l'animation
    startAnimation();

    // Ajouter les événements
    addEventListeners();
  }

  // Générer les cartes du ruban
  function generateRibbonCards() {
    ribbonContainer.innerHTML = '';

    // Dupliquer les images pour le défilement infini
    const repeatedImages = [...demoImages, ...demoImages, ...demoImages];

    repeatedImages.forEach((imageSrc, index) => {
      const card = document.createElement('div');
      card.className = 'ribbon-card';
      card.style.left = index * (config.rowHeight + config.gap) + 'px';
      
      const img = document.createElement('img');
      img.src = imageSrc;
      img.alt = `Image ${index + 1}`;
      img.loading = 'lazy';
      img.decoding = 'async';
      
      card.appendChild(img);
      ribbonContainer.appendChild(card);
    });

    ribbonCards = Array.from(ribbonContainer.querySelectorAll('.ribbon-card'));
  }

  // Calculer les zones
  function calculateZones() {
    if (!ribbonContainer || isMobile) return;

    const containerRect = ribbonContainer.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const zoneWidth = containerWidth / config.zones;

    zones = [];
    for (let i = 0; i < config.zones; i++) {
      zones.push({
        left: containerRect.left + (i * zoneWidth),
        right: containerRect.left + ((i + 1) * zoneWidth),
        activeCardIndex: -1
      });
    }
  }

  // Initialiser les états des cartes
  function initializeCardStates() {
    cardStates = demoImages.map((_, index) => ({
      x: index * (config.rowHeight + config.gap),
      targetX: index * (config.rowHeight + config.gap),
      isActive: false,
      speed: config.baseSpeed
    }));
  }

  // Calculer la vitesse basée sur la position de la souris
  function calculateSpeed(mouseX, containerLeft, containerWidth) {
    const centerX = containerLeft + containerWidth / 2;
    const posNorm = (mouseX - centerX) / (containerWidth / 2);
    const clampedPosNorm = Math.max(-1, Math.min(1, posNorm));
    return config.baseSpeed + Math.abs(clampedPosNorm) * (config.maxSpeed - config.baseSpeed);
  }

  // Trouver la carte active dans une zone
  function findActiveCardInZone(zone, containerLeft) {
    if (!ribbonContainer) return -1;

    const containerWidth = ribbonContainer.getBoundingClientRect().width;
    const segmentWidth = (config.rowHeight + config.gap) * demoImages.length;
    const currentOffset = offset % segmentWidth;

    let closestCardIndex = -1;
    let minDistance = Infinity;

    for (let i = 0; i < demoImages.length; i++) {
      let cardX = (i * (config.rowHeight + config.gap) - currentOffset) % segmentWidth;
      if (cardX < 0) cardX += segmentWidth;

      const cardRight = cardX + config.rowHeight;
      const distance = Math.abs(cardRight - (zone.left - containerLeft));

      if (distance < minDistance) {
        minDistance = distance;
        closestCardIndex = i;
      }
    }

    return closestCardIndex;
  }

  // Animation principale
  function animate(timestamp) {
    if (!ribbonContainer || document.visibilityState !== 'visible') {
      animationId = requestAnimationFrame(animate);
      return;
    }

    const containerRect = ribbonContainer.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const segmentWidth = (config.rowHeight + config.gap) * demoImages.length;

    // Calculer la vitesse
    let currentSpeed = config.baseSpeed;
    if (isMouseOver && !isMobile) {
      currentSpeed = calculateSpeed(mouseX, containerRect.left, containerWidth);
    } else if (isDragging && isMobile) {
      currentSpeed = velocity;
    }

    // Mettre à jour l'offset
    offset += currentSpeed;

    // Recycling
    if (offset >= segmentWidth) {
      offset -= segmentWidth;
    } else if (offset < 0) {
      offset += segmentWidth;
    }

    // Mettre à jour les zones et cartes actives
    if (!isMobile && zones.length > 0) {
      zones.forEach((zone, zoneIndex) => {
        const activeCardIndex = findActiveCardInZone(zone, containerRect.left);

        if (activeCardIndex !== -1) {
          // Mettre à jour la carte active
          const cardState = cardStates[activeCardIndex];
          if (cardState) {
            cardState.isActive = true;
            cardState.targetX = Math.max(
              zone.left - containerRect.left + 20,
              Math.min(
                zone.right - containerRect.left - config.rowHeight - 20,
                mouseX - containerRect.left - config.rowHeight / 2
              )
            );

            // Lerp vers la position cible
            const k = 0.18;
            cardState.x += (cardState.targetX - cardState.x) * k;
          }

          // Désactiver les autres cartes de la zone
          cardStates.forEach((state, index) => {
            if (index !== activeCardIndex) {
              state.isActive = false;
              state.speed = currentSpeed * 0.6; // Parallax léger
            }
          });
        }
      });
    }

    // Appliquer les transformations
    ribbonCards.forEach((card, index) => {
      const cardState = cardStates[index % demoImages.length];
      if (cardState) {
        const baseX = (index * (config.rowHeight + config.gap) - offset) % segmentWidth;
        const finalX = cardState.isActive ? cardState.x : baseX;

        card.style.transform = `translate3d(${finalX}px, 0, 0)`;
      }
    });

    animationId = requestAnimationFrame(animate);
  }

  // Démarrer l'animation
  function startAnimation() {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    animationId = requestAnimationFrame(animate);
  }

  // Gestionnaires d'événements souris
  function handleMouseMove(e) {
    if (isMobile) return;
    mouseX = e.clientX;
    isMouseOver = true;
  }

  function handleMouseEnter() {
    if (isMobile) return;
    isMouseOver = true;
  }

  function handleMouseLeave() {
    if (isMobile) return;
    isMouseOver = false;
    isDragging = false;
  }

  // Gestionnaires tactiles
  function handleTouchStart(e) {
    if (!isMobile) return;
    isDragging = true;
    lastTouchX = e.touches[0].clientX;
    dragOffset = offset;
    velocity = 0;
    lastTime = performance.now();
  }

  function handleTouchMove(e) {
    if (!isMobile || !isDragging) return;
    e.preventDefault();

    const currentTouchX = e.touches[0].clientX;
    const currentTime = performance.now();
    const deltaX = lastTouchX - currentTouchX;
    const deltaTime = currentTime - lastTime;

    if (deltaTime > 0) {
      velocity = deltaX / deltaTime * 1000; // px/s
    }

    offset = dragOffset + deltaX;
    lastTouchX = currentTouchX;
    lastTime = currentTime;
  }

  function handleTouchEnd() {
    if (!isMobile) return;
    isDragging = false;
  }

  // Ajouter les événements
  function addEventListeners() {
    if (!ribbonContainer) return;

    // Événements souris
    ribbonContainer.addEventListener('mousemove', handleMouseMove);
    ribbonContainer.addEventListener('mouseenter', handleMouseEnter);
    ribbonContainer.addEventListener('mouseleave', handleMouseLeave);

    // Événements tactiles
    ribbonContainer.addEventListener('touchstart', handleTouchStart, { passive: false });
    ribbonContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
    ribbonContainer.addEventListener('touchend', handleTouchEnd);

    // Redimensionnement
    window.addEventListener('resize', () => {
      calculateZones();
    });
  }

  // Initialiser quand le DOM est prêt
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

// Animation de scroll pour les services
function initServicesScroll() {
  const serviceItems = document.querySelectorAll('.service-scroll-item');
  const servicesSection = document.querySelector('.services-scroll-section');
  
  if (!serviceItems.length || !servicesSection) return;
  
  let currentActiveIndex = -1;
  
  function updateServicesScroll() {
    const scrollTop = window.pageYOffset;
    const viewportHeight = window.innerHeight;
    
    // Déterminer quel service doit être actif basé sur la position de scroll
    let newActiveIndex = -1;
    
    serviceItems.forEach((item, index) => {
      const itemTop = item.offsetTop;
      const itemBottom = itemTop + item.offsetHeight;
      const scrollPosition = scrollTop + viewportHeight * 0.6; // 60% de la hauteur de l'écran
      
      if (scrollPosition >= itemTop && scrollPosition < itemBottom) {
        newActiveIndex = index;
      }
    });
    
    // Mettre à jour les classes si nécessaire
    if (newActiveIndex !== currentActiveIndex) {
      serviceItems.forEach((item, index) => {
        item.classList.remove('active', 'fade-out');
        
        if (index === newActiveIndex) {
          item.classList.add('active');
        } else if (index < newActiveIndex) {
          item.classList.add('fade-out');
        }
      });
      
      currentActiveIndex = newActiveIndex;
    }
  }
  
  // Écouter le scroll avec throttling pour de meilleures performances
  let ticking = false;
  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateServicesScroll);
      ticking = true;
      setTimeout(() => ticking = false, 16);
    }
  }
  
  window.addEventListener('scroll', requestTick);
  
  // Initialiser
  updateServicesScroll();
}

// Contrôle de la bannière fixe uniquement dans la section services
(function() {
  const servicesHeader = document.querySelector('.services-header');
  const servicesSection = document.querySelector('.services-scroll-section');
  
  if (!servicesHeader || !servicesSection) return;
  
  let isInServicesSection = false;
  let hasEnteredServicesSection = false;
  
  function updateHeaderPosition() {
    const scrollTop = window.pageYOffset;
    const servicesTop = servicesSection.offsetTop;
    const servicesBottom = servicesTop + servicesSection.offsetHeight;
    const headerHeight = servicesHeader.offsetHeight;
    
    // Vérifier si on est dans la section services
    const wasInServicesSection = isInServicesSection;
    isInServicesSection = scrollTop >= servicesTop - headerHeight && scrollTop < servicesBottom;
    
    // Marquer qu'on est entré dans la section services
    if (isInServicesSection && !hasEnteredServicesSection) {
      hasEnteredServicesSection = true;
    }
    
    // Sortir de la section services seulement si on dépasse complètement la section
    if (scrollTop >= servicesBottom) {
      hasEnteredServicesSection = false;
    }
    
    // Appliquer les styles selon la position
    if (hasEnteredServicesSection && !(scrollTop >= servicesBottom)) {
      servicesHeader.style.position = 'fixed';
      servicesHeader.style.top = '0';
      servicesHeader.style.left = '0';
      servicesHeader.style.right = '0';
      servicesHeader.style.zIndex = '1000';
    } else {
      servicesHeader.style.position = 'relative';
      servicesHeader.style.top = 'auto';
      servicesHeader.style.left = 'auto';
      servicesHeader.style.right = 'auto';
      servicesHeader.style.zIndex = 'auto';
    }
    
    // Ajouter/supprimer l'espacement du body seulement quand nécessaire
    if (hasEnteredServicesSection && !(scrollTop >= servicesBottom) && !wasInServicesSection) {
      document.body.style.paddingTop = headerHeight + 'px';
    } else if (!hasEnteredServicesSection || scrollTop >= servicesBottom) {
      document.body.style.paddingTop = '0';
    }
  }
  
  // Écouter le scroll avec throttling
  let ticking = false;
  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateHeaderPosition);
      ticking = true;
      setTimeout(() => ticking = false, 16);
    }
  }
  
  window.addEventListener('scroll', requestTick);
  
  // Initialiser
  updateHeaderPosition();
})();

// Initialisation du script
// ========================================
// GESTION DE LA VIDÉO D'ACCUEIL
// ========================================

// La vidéo se termine et l'image continue à bouger - géré par le script dans index.html

document.addEventListener('DOMContentLoaded', function() {
  initGallery();
  initMenu();
  initAboutUsSlide();
  initServicesScroll();
});