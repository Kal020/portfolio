/**
 * Logique applicative JavaScript de la plateforme de réservation
 * Gestion des filtres, de la carte Leaflet, des modals, des calculs de prix et du flux de réservation
 */

// État global de l'application
const RentalState = {
  properties: [...RENTAL_PROPERTIES],
  filteredProperties: [...RENTAL_PROPERTIES],
  selectedType: "all",
  selectedCategory: "all",
  searchQuery: "",
  guestCount: 1,
  adultCount: 1,
  childrenCount: 0,
  checkInDate: "",
  checkOutDate: "",
  showTaxes: false,
  showMap: false,
  currentListing: null,
  selectedRoom: null,
  wishlist: JSON.parse(localStorage.getItem("rental_wishlist") || "[]"),
  mapInstance: null,
  markersLayer: null
};

// Initialisation au chargement du DOM
document.addEventListener("DOMContentLoaded", () => {
  initDateDefaults();
  initCategories();
  initEventListeners();
  renderListings();
  updateWishlistCount();
});

/**
 * Initialise les dates par défaut (demain et +4 jours)
 */
function initDateDefaults() {
  const today = new Date();
  const checkIn = new Date(today);
  checkIn.setDate(today.getDate() + 3);

  const checkOut = new Date(today);
  checkOut.setDate(today.getDate() + 7);

  RentalState.checkInDate = checkIn.toISOString().split("T")[0];
  RentalState.checkOutDate = checkOut.toISOString().split("T")[0];

  const searchCheckIn = document.getElementById("search-checkin");
  const searchCheckOut = document.getElementById("search-checkout");
  if (searchCheckIn) searchCheckIn.value = RentalState.checkInDate;
  if (searchCheckOut) searchCheckOut.value = RentalState.checkOutDate;
}

/**
 * Rendu du carrousel de catégories
 */
function initCategories() {
  const container = document.getElementById("categories-list");
  if (!container) return;

  container.innerHTML = RENTAL_CATEGORIES.map(cat => `
    <div class="category-item ${cat.id === RentalState.selectedCategory ? 'active' : ''}" data-category="${cat.id}">
      <i class="fa-solid ${cat.icon}"></i>
      <span>${cat.label}</span>
    </div>
  `).join("");

  container.querySelectorAll(".category-item").forEach(item => {
    item.addEventListener("click", () => {
      container.querySelectorAll(".category-item").forEach(el => el.classList.remove("active"));
      item.classList.add("active");
      RentalState.selectedCategory = item.dataset.category;
      applyFilters();
    });
  });
}

/**
 * Initialisation de tous les écouteurs d'événements
 */
function initEventListeners() {
  // Filtres par type d'hébergement dans la barre de nav (Tous, Appartements, Maisons, Hôtels)
  document.querySelectorAll(".nav-pill[data-type]").forEach(pill => {
    pill.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelectorAll(".nav-pill[data-type]").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      RentalState.selectedType = pill.dataset.type;
      applyFilters();
    });
  });

  // Recherche par texte / destination
  const searchDestination = document.getElementById("search-destination");
  if (searchDestination) {
    searchDestination.addEventListener("input", (e) => {
      RentalState.searchQuery = e.target.value.trim().toLowerCase();
    });
    searchDestination.addEventListener("keydown", (e) => {
      if (e.key === "Enter") applyFilters();
    });
  }

  // Bouton de recherche principal
  const btnSearchMain = document.getElementById("btn-search-main");
  if (btnSearchMain) {
    btnSearchMain.addEventListener("click", () => {
      closeAllDropdowns();
      applyFilters();
    });
  }

  // Dropdown du compteur de voyageurs
  const guestsToggle = document.getElementById("search-guests-section");
  const guestsDropdown = document.getElementById("guests-dropdown");
  if (guestsToggle && guestsDropdown) {
    guestsToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      guestsDropdown.classList.toggle("show");
    });

    guestsDropdown.addEventListener("click", (e) => e.stopPropagation());
  }

  // Compteurs adultes & enfants
  initCounter("adults", (val) => {
    RentalState.adultCount = val;
    updateGuestsDisplay();
  });
  initCounter("children", (val) => {
    RentalState.childrenCount = val;
    updateGuestsDisplay();
  });

  // Toggle Taxes
  const taxToggle = document.getElementById("toggle-taxes");
  if (taxToggle) {
    taxToggle.addEventListener("change", (e) => {
      RentalState.showTaxes = e.target.checked;
      renderListings();
    });
  }

  // Bouton flottant Carte / Liste
  const btnMapToggle = document.getElementById("btn-map-toggle");
  if (btnMapToggle) {
    btnMapToggle.addEventListener("click", toggleMapView);
  }

  // Modal Detail Listing - Fermeture
  const modalDetail = document.getElementById("listing-detail-modal");
  const modalDetailClose = document.getElementById("modal-detail-close");
  if (modalDetail && modalDetailClose) {
    modalDetailClose.addEventListener("click", () => closeModal(modalDetail));
    modalDetail.addEventListener("click", (e) => {
      if (e.target === modalDetail) closeModal(modalDetail);
    });
  }

  // Modal Checkout - Fermeture
  const modalCheckout = document.getElementById("checkout-modal");
  const modalCheckoutClose = document.getElementById("modal-checkout-close");
  if (modalCheckout && modalCheckoutClose) {
    modalCheckoutClose.addEventListener("click", () => closeModal(modalCheckout));
    modalCheckout.addEventListener("click", (e) => {
      if (e.target === modalCheckout) closeModal(modalCheckout);
    });
  }

  // Formulaire de paiement checkout
  const checkoutForm = document.getElementById("checkout-form");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", handleCheckoutSubmit);
  }

  // Modal Dashboard Hôte (Publier annonce)
  const btnOpenHost = document.getElementById("btn-open-host");
  const modalHost = document.getElementById("host-modal");
  const modalHostClose = document.getElementById("modal-host-close");
  const hostForm = document.getElementById("host-form");

  if (btnOpenHost && modalHost) {
    btnOpenHost.addEventListener("click", () => openModal(modalHost));
  }
  if (modalHost && modalHostClose) {
    modalHostClose.addEventListener("click", () => closeModal(modalHost));
    modalHost.addEventListener("click", (e) => {
      if (e.target === modalHost) closeModal(modalHost);
    });
  }
  if (hostForm) {
    hostForm.addEventListener("submit", handleHostFormSubmit);
  }

  // Fermeture des popups au clic extérieur
  document.addEventListener("click", () => {
    closeAllDropdowns();
  });

  // Touche Echap pour fermer les modals
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeAllModals();
      closeAllDropdowns();
    }
  });
}

function closeAllDropdowns() {
  const guestsDropdown = document.getElementById("guests-dropdown");
  if (guestsDropdown) guestsDropdown.classList.remove("show");
}

function openModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.remove("open");
  document.body.style.overflow = "";
}

function closeAllModals() {
  document.querySelectorAll(".modal-overlay").forEach(m => m.classList.remove("open"));
  document.body.style.overflow = "";
}

/**
 * Gestionnaire de compteurs (+ et -)
 */
function initCounter(name, onChange) {
  const btnDec = document.getElementById(`btn-${name}-dec`);
  const btnInc = document.getElementById(`btn-${name}-inc`);
  const numSpan = document.getElementById(`count-${name}`);
  if (!btnDec || !btnInc || !numSpan) return;

  let current = parseInt(numSpan.textContent, 10) || 0;
  const min = name === "adults" ? 1 : 0;

  btnDec.addEventListener("click", (e) => {
    e.stopPropagation();
    if (current > min) {
      current--;
      numSpan.textContent = current;
      btnDec.disabled = current <= min;
      onChange(current);
    }
  });

  btnInc.addEventListener("click", (e) => {
    e.stopPropagation();
    if (current < 16) {
      current++;
      numSpan.textContent = current;
      btnDec.disabled = false;
      onChange(current);
    }
  });
}

function updateGuestsDisplay() {
  const total = RentalState.adultCount + RentalState.childrenCount;
  RentalState.guestCount = total;
  const label = document.getElementById("display-guests-label");
  if (label) {
    label.textContent = total > 1 ? `${total} voyageurs` : "1 voyageur";
  }
}

/**
 * Filtrage dynamique des hébergements
 */
function applyFilters() {
  RentalState.filteredProperties = RentalState.properties.filter(prop => {
    // 1. Filtre par type (Appartement, Maison, Hôtel)
    if (RentalState.selectedType !== "all" && prop.type !== RentalState.selectedType) {
      return false;
    }
    // 2. Filtre par catégorie (Bord de mer, Piscine, Luxe, etc.)
    if (RentalState.selectedCategory !== "all" && prop.category !== RentalState.selectedCategory) {
      return false;
    }
    // 3. Filtre par recherche textuelle (titre, ville, pays)
    if (RentalState.searchQuery) {
      const match = (
        prop.title.toLowerCase().includes(RentalState.searchQuery) ||
        prop.city.toLowerCase().includes(RentalState.searchQuery) ||
        prop.country.toLowerCase().includes(RentalState.searchQuery)
      );
      if (!match) return false;
    }
    // 4. Filtre par capacité de voyageurs
    if (prop.maxGuests < RentalState.guestCount) {
      return false;
    }

    return true;
  });

  renderListings();
  updateMapMarkers();
}

/**
 * Affichage des cartes d'annonces
 */
function renderListings() {
  const grid = document.getElementById("listings-grid");
  const countBadge = document.getElementById("results-count-badge");
  if (!grid) return;

  if (countBadge) {
    countBadge.textContent = `${RentalState.filteredProperties.length} logement${RentalState.filteredProperties.length > 1 ? 's' : ''}`;
  }

  if (RentalState.filteredProperties.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
        <i class="fa-solid fa-magnifying-glass" style="font-size: 3rem; color: var(--text-light); margin-bottom: 16px;"></i>
        <h3 style="font-size: 1.3rem; margin-bottom: 8px;">Aucun logement ne correspond à vos critères</h3>
        <p style="color: var(--text-muted); margin-bottom: 20px;">Essayez d'ajuster vos dates, votre destination ou réduisez vos filtres.</p>
        <button class="btn-search-main" style="margin: 0 auto;" onclick="resetAllFilters()">Réinitialiser les filtres</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = RentalState.filteredProperties.map(prop => {
    const isLiked = RentalState.wishlist.includes(prop.id);
    const taxRate = RentalState.showTaxes ? (1 + prop.serviceFeePercent + prop.taxesPercent) : 1;
    const displayPrice = Math.round(prop.pricePerNight * taxRate);
    const badgeTypeLabel = prop.type === 'hotel' ? `Hôtel ${prop.stars || 4}★` : (prop.type === 'house' ? 'Villa / Maison' : 'Appartement');

    return `
      <article class="property-card" data-id="${prop.id}">
        <div class="card-image-box">
          <div class="card-badge-top">
            ${prop.badge ? `<span class="badge-pill badge-guest-favorite"><i class="fa-solid fa-trophy" style="color:var(--star-gold); margin-right:4px;"></i>${prop.badge}</span>` : ''}
            <span class="badge-pill badge-property-type">${badgeTypeLabel}</span>
          </div>
          <button class="btn-like-heart ${isLiked ? 'liked' : ''}" data-heart-id="${prop.id}" title="Ajouter aux favoris">
            <i class="${isLiked ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
          </button>
          <div class="property-img-slider">
            <img src="${prop.images[0]}" alt="${prop.title}" loading="lazy" />
          </div>
        </div>

        <div class="card-details">
          <div class="card-header-row">
            <h3 class="card-title" title="${prop.title}">${prop.title}</h3>
            <div class="card-rating">
              <i class="fa-solid fa-star"></i>
              <span>${prop.rating}</span>
            </div>
          </div>
          <div class="card-location">${prop.location}</div>
          <div class="card-specs">Jusqu'à ${prop.maxGuests} voyageurs • ${prop.bedrooms} ch. • ${prop.bathrooms} sdb.</div>
          <div class="card-price-row">
            <span class="price-val">${displayPrice} €</span>
            <span class="price-unit">/ nuit</span>
            ${RentalState.showTaxes ? '<span style="font-size:0.75rem; color:var(--text-muted); margin-left:4px;">(taxes et frais incl.)</span>' : ''}
          </div>
        </div>
      </article>
    `;
  }).join("");

  // Écouteur sur chaque carte pour ouvrir la vue détaillée
  grid.querySelectorAll(".property-card").forEach(card => {
    card.addEventListener("click", (e) => {
      // Ignorer si on clique sur le cœur des favoris
      if (e.target.closest(".btn-like-heart")) return;
      const propId = card.dataset.id;
      openListingDetail(propId);
    });
  });

  // Écouteur sur les boutons de favoris
  grid.querySelectorAll(".btn-like-heart").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleWishlist(btn.dataset.heartId, btn);
    });
  });
}

function resetAllFilters() {
  RentalState.selectedType = "all";
  RentalState.selectedCategory = "all";
  RentalState.searchQuery = "";
  RentalState.guestCount = 1;
  RentalState.adultCount = 1;
  RentalState.childrenCount = 0;

  const searchDestination = document.getElementById("search-destination");
  if (searchDestination) searchDestination.value = "";

  document.querySelectorAll(".nav-pill[data-type]").forEach(p => p.classList.remove("active"));
  const allPill = document.querySelector(".nav-pill[data-type='all']");
  if (allPill) allPill.classList.add("active");

  const catContainer = document.getElementById("categories-list");
  if (catContainer) {
    catContainer.querySelectorAll(".category-item").forEach(el => el.classList.remove("active"));
    const allCat = catContainer.querySelector("[data-category='all']");
    if (allCat) allCat.classList.add("active");
  }

  updateGuestsDisplay();
  applyFilters();
}

/**
 * Gestion de la Wishlist (Favoris)
 */
function toggleWishlist(propId, btnElement) {
  const index = RentalState.wishlist.indexOf(propId);
  if (index > -1) {
    RentalState.wishlist.splice(index, 1);
    btnElement.classList.remove("liked");
    const icon = btnElement.querySelector("i");
    if (icon) {
      icon.classList.remove("fa-solid");
      icon.classList.add("fa-regular");
    }
  } else {
    RentalState.wishlist.push(propId);
    btnElement.classList.add("liked");
    const icon = btnElement.querySelector("i");
    if (icon) {
      icon.classList.remove("fa-regular");
      icon.classList.add("fa-solid");
    }
  }
  localStorage.setItem("rental_wishlist", JSON.stringify(RentalState.wishlist));
  updateWishlistCount();
}

function updateWishlistCount() {
  const badge = document.getElementById("wishlist-badge");
  if (badge) {
    badge.textContent = RentalState.wishlist.length;
  }
}

/**
 * Basculer la vue hybride (Carte interactive Leaflet)
 */
function toggleMapView() {
  RentalState.showMap = !RentalState.showMap;
  const layout = document.getElementById("main-layout");
  const btnMapToggle = document.getElementById("btn-map-toggle");

  if (!layout || !btnMapToggle) return;

  if (RentalState.showMap) {
    layout.classList.add("split-view");
    btnMapToggle.innerHTML = `<i class="fa-solid fa-list"></i> Masquer la carte`;
    initOrUpdateLeafletMap();
  } else {
    layout.classList.remove("split-view");
    btnMapToggle.innerHTML = `<i class="fa-solid fa-map-location-dot"></i> Afficher la carte`;
  }
}

/**
 * Initialisation de la carte Leaflet
 */
function initOrUpdateLeafletMap() {
  const mapElement = document.getElementById("rental-map");
  if (!mapElement) return;

  if (!RentalState.mapInstance) {
    // Crée la carte
    RentalState.mapInstance = L.map("rental-map", {
      center: [46.2276, 2.2137], // Centre France par défaut
      zoom: 5,
      zoomControl: true
    });

    // Tuiles élégantes CartoDB Positron
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>, &copy; OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(RentalState.mapInstance);

    RentalState.markersLayer = L.layerGroup().addTo(RentalState.mapInstance);
  }

  // Forcer le recalcul de la taille après l'affichage du conteneur
  setTimeout(() => {
    RentalState.mapInstance.invalidateSize();
    updateMapMarkers();
  }, 200);
}

/**
 * Mise à jour des marqueurs personnalisés (prix en pillules)
 */
function updateMapMarkers() {
  if (!RentalState.mapInstance || !RentalState.markersLayer) return;

  RentalState.markersLayer.clearLayers();
  const bounds = [];

  RentalState.filteredProperties.forEach(prop => {
    if (!prop.coordinates) return;

    bounds.push(prop.coordinates);

    // Icône personnalisée HTML pour afficher le prix
    const customIcon = L.divIcon({
      className: "leaflet-custom-div",
      html: `<div class="leaflet-price-marker" data-prop-id="${prop.id}">${prop.pricePerNight} €</div>`,
      iconSize: [60, 32],
      iconAnchor: [30, 16]
    });

    const marker = L.marker(prop.coordinates, { icon: customIcon });

    marker.on("click", () => {
      openListingDetail(prop.id);
    });

    RentalState.markersLayer.addLayer(marker);
  });

  if (bounds.length > 0) {
    RentalState.mapInstance.fitBounds(bounds, { padding: [40, 40] });
  }
}

/**
 * Ouverture de la fiche détaillée du logement
 */
function openListingDetail(propId) {
  const property = RentalState.properties.find(p => p.id === propId);
  if (!property) return;

  RentalState.currentListing = property;
  RentalState.selectedRoom = (property.hotelRooms && property.hotelRooms.length > 0) ? property.hotelRooms[0] : null;

  const modal = document.getElementById("listing-detail-modal");
  if (!modal) return;

  // Remplissage En-tête
  document.getElementById("detail-title").textContent = property.title;
  document.getElementById("detail-location").textContent = property.location;
  document.getElementById("detail-rating").textContent = property.rating;
  document.getElementById("detail-reviews").textContent = `${property.reviewCount} avis`;
  document.getElementById("detail-type-name").textContent = property.typeName;

  // Galerie photos (1 grande + 4 petites)
  const galleryBox = document.getElementById("detail-gallery");
  if (galleryBox) {
    galleryBox.innerHTML = `
      <img src="${property.images[0]}" alt="${property.title}" class="gallery-img-item gallery-lead" />
      <img src="${property.images[1] || property.images[0]}" alt="" class="gallery-img-item" />
      <img src="${property.images[2] || property.images[0]}" alt="" class="gallery-img-item" />
      <img src="${property.images[3] || property.images[0]}" alt="" class="gallery-img-item" />
      <img src="${property.images[4] || property.images[0]}" alt="" class="gallery-img-item" />
    `;
  }

  // Hôte et description
  document.getElementById("detail-host-name").textContent = `Logement proposé par ${property.host.name}`;
  document.getElementById("detail-host-status").textContent = `${property.host.joined} • ${property.host.superhost ? 'Superhôte reconnu' : 'Hôte vérifié'}`;
  document.getElementById("detail-host-avatar").src = property.host.avatar;
  document.getElementById("detail-description").textContent = property.description;
  document.getElementById("detail-specs-summary").textContent = `${property.maxGuests} voyageurs maximum • ${property.bedrooms} chambre(s) • ${property.beds} lit(s) • ${property.bathrooms} salle(s) de bain`;

  // Spécificité Hôtels (Chambres sélectionnables)
  const hotelSection = document.getElementById("detail-hotel-rooms-section");
  if (hotelSection) {
    if (property.type === "hotel" && property.hotelRooms) {
      hotelSection.style.display = "block";
      const roomsContainer = document.getElementById("detail-hotel-rooms-list");
      roomsContainer.innerHTML = property.hotelRooms.map((room, idx) => `
        <div class="room-option-card ${idx === 0 ? 'selected' : ''}" data-room-id="${room.id}">
          <div class="room-details">
            <h5>${room.name}</h5>
            <span>${room.bed} • Jusqu'à ${room.capacity} pers.</span>
          </div>
          <div class="room-price-tag">${room.price} € / nuit</div>
        </div>
      `).join("");

      roomsContainer.querySelectorAll(".room-option-card").forEach(card => {
        card.addEventListener("click", () => {
          roomsContainer.querySelectorAll(".room-option-card").forEach(c => c.classList.remove("selected"));
          card.classList.add("selected");
          const rId = card.dataset.roomId;
          RentalState.selectedRoom = property.hotelRooms.find(r => r.id === rId);
          updateBookingCalculations();
        });
      });
    } else {
      hotelSection.style.display = "none";
    }
  }

  // Équipements
  const amenitiesList = document.getElementById("detail-amenities-list");
  if (amenitiesList) {
    amenitiesList.innerHTML = property.amenities.map(am => `
      <div class="amenity-item">
        <i class="fa-solid fa-check"></i>
        <span>${am.name}</span>
      </div>
    `).join("");
  }

  // Configuration du widget de réservation
  const checkInInput = document.getElementById("book-checkin");
  const checkOutInput = document.getElementById("book-checkout");
  const guestsSelect = document.getElementById("book-guests");

  if (checkInInput) checkInInput.value = RentalState.checkInDate;
  if (checkOutInput) checkOutInput.value = RentalState.checkOutDate;

  // Remplissage du select des voyageurs
  if (guestsSelect) {
    guestsSelect.innerHTML = "";
    for (let i = 1; i <= property.maxGuests; i++) {
      const opt = document.createElement("option");
      opt.value = i;
      opt.textContent = `${i} voyageur${i > 1 ? 's' : ''}`;
      if (i === RentalState.guestCount) opt.selected = true;
      guestsSelect.appendChild(opt);
    }

    guestsSelect.onchange = () => {
      RentalState.guestCount = parseInt(guestsSelect.value, 10);
    };
  }

  if (checkInInput) {
    checkInInput.onchange = () => {
      RentalState.checkInDate = checkInInput.value;
      updateBookingCalculations();
    };
  }
  if (checkOutInput) {
    checkOutInput.onchange = () => {
      RentalState.checkOutDate = checkOutInput.value;
      updateBookingCalculations();
    };
  }

  // Bouton "Réserver"
  const btnBookCta = document.getElementById("btn-book-cta");
  if (btnBookCta) {
    btnBookCta.onclick = () => {
      closeModal(modal);
      openCheckoutModal(property);
    };
  }

  updateBookingCalculations();
  openModal(modal);
}

/**
 * Calcul dynamique et en temps réel des tarifs dans le widget
 */
function updateBookingCalculations() {
  const property = RentalState.currentListing;
  if (!property) return;

  const basePricePerNight = RentalState.selectedRoom ? RentalState.selectedRoom.price : property.pricePerNight;

  // Calcul du nombre de nuits
  const d1 = new Date(RentalState.checkInDate);
  const d2 = new Date(RentalState.checkOutDate);
  let nights = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
  if (isNaN(nights) || nights <= 0) nights = 1;

  const staySubtotal = basePricePerNight * nights;
  const cleaningFee = property.cleaningFee;
  const serviceFee = Math.round(staySubtotal * property.serviceFeePercent);
  const taxes = Math.round(staySubtotal * property.taxesPercent);
  const total = staySubtotal + cleaningFee + serviceFee + taxes;

  // Affichage dans le widget
  const priceDisplay = document.getElementById("book-price-display");
  if (priceDisplay) priceDisplay.textContent = `${basePricePerNight} €`;

  const labelNights = document.getElementById("book-breakdown-nights-label");
  if (labelNights) labelNights.textContent = `${basePricePerNight} € x ${nights} nuit${nights > 1 ? 's' : ''}`;

  const valNights = document.getElementById("book-breakdown-nights-val");
  if (valNights) valNights.textContent = `${staySubtotal} €`;

  const valCleaning = document.getElementById("book-breakdown-cleaning-val");
  if (valCleaning) valCleaning.textContent = `${cleaningFee} €`;

  const valService = document.getElementById("book-breakdown-service-val");
  if (valService) valService.textContent = `${serviceFee} €`;

  const valTaxes = document.getElementById("book-breakdown-taxes-val");
  if (valTaxes) valTaxes.textContent = `${taxes} €`;

  const valTotal = document.getElementById("book-breakdown-total-val");
  if (valTotal) valTotal.textContent = `${total} €`;
}

/**
 * Tunnel de réservation & Checkout
 */
function openCheckoutModal(property) {
  const modal = document.getElementById("checkout-modal");
  if (!modal) return;

  // Réinitialiser les états
  document.getElementById("checkout-form-container").style.display = "block";
  document.getElementById("checkout-success-container").style.display = "none";

  const basePrice = RentalState.selectedRoom ? RentalState.selectedRoom.price : property.pricePerNight;
  const d1 = new Date(RentalState.checkInDate);
  const d2 = new Date(RentalState.checkOutDate);
  let nights = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
  if (isNaN(nights) || nights <= 0) nights = 1;

  const subtotal = basePrice * nights;
  const total = subtotal + property.cleaningFee + Math.round(subtotal * property.serviceFeePercent) + Math.round(subtotal * property.taxesPercent);

  // Remplir le récapitulatif
  document.getElementById("checkout-thumb").src = property.images[0];
  document.getElementById("checkout-title").textContent = property.title;
  document.getElementById("checkout-room-info").textContent = RentalState.selectedRoom ? `Chambre : ${RentalState.selectedRoom.name}` : property.typeName;
  document.getElementById("checkout-dates").textContent = `Du ${RentalState.checkInDate} au ${RentalState.checkOutDate} (${nights} nuits)`;
  document.getElementById("checkout-total-price").textContent = `${total} €`;

  openModal(modal);
}

function handleCheckoutSubmit(e) {
  e.preventDefault();
  const btnSubmit = document.getElementById("btn-confirm-payment");
  btnSubmit.disabled = true;
  btnSubmit.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Traitement sécurisé...`;

  setTimeout(() => {
    btnSubmit.disabled = false;
    btnSubmit.innerHTML = `Confirmer et Payer`;

    document.getElementById("checkout-form-container").style.display = "none";
    const successBox = document.getElementById("checkout-success-container");
    successBox.style.display = "block";

    // Générer un code de réservation unique
    const bookingRef = "RES-" + Math.floor(100000 + Math.random() * 900000);
    document.getElementById("confirmed-booking-id").textContent = bookingRef;
  }, 1200);
}

/**
 * Publication d'une nouvelle annonce par un hôte
 */
function handleHostFormSubmit(e) {
  e.preventDefault();

  const title = document.getElementById("host-title").value.trim();
  const type = document.getElementById("host-type").value;
  const city = document.getElementById("host-city").value.trim();
  const country = document.getElementById("host-country").value.trim();
  const price = parseInt(document.getElementById("host-price").value, 10);
  const maxGuests = parseInt(document.getElementById("host-guests").value, 10);
  const bedrooms = parseInt(document.getElementById("host-bedrooms").value, 10);
  const description = document.getElementById("host-desc").value.trim();

  const newProperty = {
    id: `prop-${Date.now()}`,
    type: type,
    typeName: type === 'hotel' ? 'Chambre d\'Hôtel Boutique' : (type === 'house' ? 'Maison / Villa' : 'Appartement de standing'),
    category: "city",
    title: title,
    location: `${city}, ${country}`,
    city: city,
    country: country,
    coordinates: [48.8566 + (Math.random() - 0.5) * 4, 2.3522 + (Math.random() - 0.5) * 4],
    pricePerNight: price,
    rating: 5.0,
    reviewCount: 1,
    badge: "Nouvelle annonce",
    superhost: false,
    maxGuests: maxGuests,
    bedrooms: bedrooms,
    beds: bedrooms,
    bathrooms: 1,
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80"
    ],
    description: description || "Superbe hébergement disponible pour vos vacances.",
    host: {
      name: "Vous (Nouveau propriétaire)",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
      verified: true,
      superhost: false,
      joined: "Membre depuis aujourd'hui"
    },
    amenities: [
      { id: "wifi", name: "Wi-Fi Haut Débit", icon: "wifi" },
      { id: "ac", name: "Climatisation", icon: "snowflake" }
    ],
    cleaningFee: 35,
    serviceFeePercent: 0.12,
    taxesPercent: 0.05
  };

  RentalState.properties.unshift(newProperty);
  RentalState.filteredProperties.unshift(newProperty);

  closeModal(document.getElementById("host-modal"));
  e.target.reset();

  renderListings();
  updateMapMarkers();

  alert("🎉 Félicitations ! Votre annonce a été mise en ligne avec succès.");
}
