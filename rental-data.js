/**
 * Base de données de démonstration réaliste pour la plateforme de réservation
 * Logements : Appartements, Maisons/Villas, et Hôtels
 */
const RENTAL_PROPERTIES = [
  {
    id: "apt-paris-01",
    type: "apartment",
    typeName: "Appartement de standing",
    category: "city",
    title: "Magnifique Haussmannien avec vue Tour Eiffel",
    location: "Paris, Île-de-France, France",
    city: "Paris",
    country: "France",
    coordinates: [48.8584, 2.2945],
    pricePerNight: 285,
    rating: 4.96,
    reviewCount: 142,
    badge: "Coup de cœur voyageurs",
    superhost: true,
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 1.5,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Niché au cœur du 7ème arrondissement, cet élégant appartement haussmannien allie le charme de l'ancien (moulures, parquet d'origine et cheminée) aux commodités ultra-modernes. Profitez d'une vue imprenable sur la Tour Eiffel depuis votre balcon privatif.",
    host: {
      name: "Claire de Montmirail",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      verified: true,
      superhost: true,
      joined: "Hôte depuis 4 ans"
    },
    amenities: [
      { id: "wifi", name: "Wi-Fi Très Haut Débit (Fibre)", icon: "wifi" },
      { id: "kitchen", name: "Cuisine gastronomique équipée", icon: "utensils" },
      { id: "tv", name: "Smart TV 4K avec Netflix", icon: "tv" },
      { id: "ac", name: "Climatisation réversible", icon: "snowflake" },
      { id: "washer", name: "Lave-linge & Sèche-linge", icon: "washing-machine" },
      { id: "elevator", name: "Ascenseur d'époque", icon: "arrow-up" },
      { id: "workspace", name: "Espace de travail dédié", icon: "laptop" }
    ],
    cleaningFee: 55,
    serviceFeePercent: 0.12,
    taxesPercent: 0.05
  },
  {
    id: "villa-bali-02",
    type: "house",
    typeName: "Villa d'architecte",
    category: "pool",
    title: "Villa Tropicale avec Piscine à Débordement",
    location: "Ubud, Bali, Indonésie",
    city: "Ubud",
    country: "Indonésie",
    coordinates: [-8.5069, 115.2625],
    pricePerNight: 390,
    rating: 4.98,
    reviewCount: 98,
    badge: "Luxe & Sérénité",
    superhost: true,
    maxGuests: 6,
    bedrooms: 3,
    beds: 4,
    bathrooms: 3,
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Véritable sanctuaire au milieu de la jungle luxuriante d'Ubud. Dotée d'une piscine à débordement suspendue au-dessus de la vallée, d'un pavillon de yoga en teck et d'un personnel dédié (petit-déjeuner balinais préparé tous les matins).",
    host: {
      name: "Wayan & Ketut",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      verified: true,
      superhost: true,
      joined: "Hôte depuis 6 ans"
    },
    amenities: [
      { id: "pool", name: "Piscine privée à débordement", icon: "waves" },
      { id: "breakfast", name: "Petit-déjeuner inclus", icon: "coffee" },
      { id: "wifi", name: "Wi-Fi Fibre", icon: "wifi" },
      { id: "ac", name: "Climatisation dans toutes les suites", icon: "snowflake" },
      { id: "parking", name: "Parking gratuit sur place", icon: "car" },
      { id: "garden", name: "Jardin tropical privé de 2000m²", icon: "tree" }
    ],
    cleaningFee: 40,
    serviceFeePercent: 0.10,
    taxesPercent: 0.08
  },
  {
    id: "hotel-nyc-03",
    type: "hotel",
    typeName: "Hôtel Boutique 5 Étoiles",
    category: "luxury",
    title: "The Grand SoHo Signature Hotel & Spa",
    location: "SoHo, New York City, États-Unis",
    city: "New York",
    country: "États-Unis",
    coordinates: [40.7233, -73.9985],
    pricePerNight: 440,
    rating: 4.92,
    reviewCount: 310,
    badge: "5 Étoiles Sélect",
    superhost: false,
    stars: 5,
    maxGuests: 4,
    bedrooms: 1,
    beds: 2,
    bathrooms: 1,
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Vivez l'expérience new-yorkaise ultime au cœur du quartier artistique de SoHo. Ce joyau 5 étoiles offre un rooftop bar avec vue panoramique sur la skyline de Manhattan, un spa de renommée mondiale et un service de conciergerie 24h/24.",
    hotelRooms: [
      { id: "deluxe", name: "Chambre Deluxe King", price: 440, bed: "1 lit King Size", capacity: 2 },
      { id: "suite", name: "Suite Exécutive Skyline", price: 680, bed: "1 lit King + 1 canapé convertible", capacity: 4 },
      { id: "penthouse", name: "Penthouse Rooftop Privé", price: 1250, bed: "2 lits King Size", capacity: 5 }
    ],
    host: {
      name: "Direction The Grand SoHo",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      verified: true,
      superhost: false,
      joined: "Établissement vérifié"
    },
    amenities: [
      { id: "spa", name: "Spa & Centre de bien-être", icon: "sparkles" },
      { id: "rooftop", name: "Rooftop Bar panoramique", icon: "glass-cheers" },
      { id: "gym", name: "Salle de sport ouverte 24/7", icon: "dumbbell" },
      { id: "concierge", name: "Conciergerie & Voiturier 24h/24", icon: "bell" },
      { id: "wifi", name: "Wi-Fi Premium haut débit", icon: "wifi" },
      { id: "restaurant", name: "Restaurant étoilé au Guide Michelin", icon: "utensils" }
    ],
    cleaningFee: 0,
    serviceFeePercent: 0.14,
    taxesPercent: 0.1475
  },
  {
    id: "chalet-alpes-04",
    type: "house",
    typeName: "Chalet d'Alpage de Luxe",
    category: "mountain",
    title: "Chalet Mont-Blanc avec Jacuzzi extérieur",
    location: "Chamonix-Mont-Blanc, Alpes, France",
    city: "Chamonix",
    country: "France",
    coordinates: [45.9237, 6.8694],
    pricePerNight: 510,
    rating: 4.97,
    reviewCount: 76,
    badge: "Ski aux pieds",
    superhost: true,
    maxGuests: 8,
    bedrooms: 4,
    beds: 5,
    bathrooms: 3.5,
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Chalet d'exception entièrement rénové en vieux bois et granit, situé face à la chaîne du Mont-Blanc. Départ ski aux pieds, grand salon cathédrale avec cheminée centrale en pierre, et jacuzzi chauffé sur la terrasse enneigée.",
    host: {
      name: "Jean-Marc & Sarah",
      avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80",
      verified: true,
      superhost: true,
      joined: "Hôte depuis 5 ans"
    },
    amenities: [
      { id: "jacuzzi", name: "Jacuzzi extérieur chauffé face au massif", icon: "hot-tub" },
      { id: "fireplace", name: "Cheminée à bois traditionnelle", icon: "fire" },
      { id: "ski", name: "Ski-room avec chauffe-chaussures", icon: "snowflake" },
      { id: "sauna", name: "Sauna finlandais privatif", icon: "thermometer-three-quarters" },
      { id: "parking", name: "Garage fermé pour 2 véhicules", icon: "car" },
      { id: "wifi", name: "Wi-Fi Fibre rapide", icon: "wifi" }
    ],
    cleaningFee: 90,
    serviceFeePercent: 0.11,
    taxesPercent: 0.05
  },
  {
    id: "apt-santorini-05",
    type: "apartment",
    typeName: "Suite Troglodyte Vue Caldera",
    category: "sea",
    title: "Penthouse Blanc Oia avec Piscine Privative",
    location: "Oia, Santorin, Grèce",
    city: "Santorin",
    country: "Grèce",
    coordinates: [36.4618, 25.3753],
    pricePerNight: 470,
    rating: 4.99,
    reviewCount: 204,
    badge: "Vue panoramique légendaire",
    superhost: true,
    maxGuests: 3,
    bedrooms: 1,
    beds: 2,
    bathrooms: 1,
    images: [
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Perché sur la falaise emblématique d'Oia, cette suite cycladique creusée dans la roche offre la vue la plus spectaculaire au monde sur le coucher de soleil et la mer Égée. Plongez dans votre bassin privé à débordement taillé dans la pierre.",
    host: {
      name: "Eleni Vassilakis",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
      verified: true,
      superhost: true,
      joined: "Hôte depuis 7 ans"
    },
    amenities: [
      { id: "pool", name: "Bassin privé chauffé sur la terrasse", icon: "waves" },
      { id: "sea", name: "Vue directe à 180° sur la Caldera", icon: "sun" },
      { id: "breakfast", name: "Petit-déjeuner grec gastronomique livré", icon: "coffee" },
      { id: "ac", name: "Climatisation intégrée", icon: "snowflake" },
      { id: "wifi", name: "Wi-Fi satellite ultra-rapide", icon: "wifi" }
    ],
    cleaningFee: 45,
    serviceFeePercent: 0.12,
    taxesPercent: 0.06
  },
  {
    id: "hotel-rome-06",
    type: "hotel",
    typeName: "Hôtel Particulier Renaissance 4 Étoiles",
    category: "city",
    title: "Palazzo Navona Heritage Hotel",
    location: "Piazza Navona, Rome, Italie",
    city: "Rome",
    country: "Italie",
    coordinates: [41.8992, 12.4731],
    pricePerNight: 320,
    rating: 4.89,
    reviewCount: 185,
    badge: "Élégance Historique",
    superhost: false,
    stars: 4,
    maxGuests: 3,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    images: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Demeure seigneuriale du XVIIe siècle restaurée avec soin, à quelques pas du Panthéon et de la Piazza Navona. Plafonds à caissons ornés de fresques, marbre de Carrare et terrasse avec bar à cocktails surplombant les toits romains.",
    hotelRooms: [
      { id: "classic", name: "Chambre Supérieure Charme", price: 320, bed: "1 lit Queen Size", capacity: 2 },
      { id: "prestige", name: "Suite Junior Fresques Historiques", price: 460, bed: "1 grand lit King Size", capacity: 2 },
      { id: "family", name: "Suite Familiale Palazzo", price: 620, bed: "1 lit King + 2 lits simples", capacity: 4 }
    ],
    host: {
      name: "Famille Colonna (Palazzo Navona)",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
      verified: true,
      superhost: false,
      joined: "Établissement historique"
    },
    amenities: [
      { id: "breakfast", name: "Buffet petit-déjeuner italien artisanal", icon: "coffee" },
      { id: "rooftop", name: "Terrasse Bar panoramique", icon: "glass-cheers" },
      { id: "ac", name: "Climatisation silencieuse", icon: "snowflake" },
      { id: "wifi", name: "Wi-Fi Fibre", icon: "wifi" },
      { id: "concierge", name: "Concierge et réservations musée VIP", icon: "ticket" }
    ],
    cleaningFee: 0,
    serviceFeePercent: 0.12,
    taxesPercent: 0.10
  },
  {
    id: "villa-cannes-07",
    type: "house",
    typeName: "Villa Contemporaine Côte d'Azur",
    category: "sea",
    title: "Villa Belle Époque avec Plage Privée",
    location: "Cannes, Provence-Alpes-Côte d'Azur, France",
    city: "Cannes",
    country: "France",
    coordinates: [43.5528, 7.0174],
    pricePerNight: 850,
    rating: 4.97,
    reviewCount: 62,
    badge: "Exclusivité Méditerranée",
    superhost: true,
    maxGuests: 10,
    bedrooms: 5,
    beds: 6,
    bathrooms: 5,
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Somptueuse propriété contemporaine les pieds dans l'eau sur la célèbre baie de Cannes. Piscine miroir chauffée, ponton d'amarrage privé pour bateaux, salle de cinéma privée et vue féerique sur les îles de Lérins.",
    host: {
      name: "Laurent & Virginie",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80",
      verified: true,
      superhost: true,
      joined: "Hôte depuis 8 ans"
    },
    amenities: [
      { id: "pool", name: "Piscine chauffée 15m à débordement", icon: "waves" },
      { id: "sea", name: "Accès privé direct à la mer", icon: "anchor" },
      { id: "cinema", name: "Salle de cinéma privée 4K Dolby Atmos", icon: "film" },
      { id: "parking", name: "Parking sécurisé pour 4 voitures", icon: "car" },
      { id: "ac", name: "Climatisation intégrale", icon: "snowflake" },
      { id: "wine", name: "Cave à vin de dégustation", icon: "wine-glass" }
    ],
    cleaningFee: 150,
    serviceFeePercent: 0.10,
    taxesPercent: 0.05
  },
  {
    id: "apt-tokyo-08",
    type: "apartment",
    typeName: "Loft Futuriste à Shibuya",
    category: "city",
    title: "Design Studio Zen avec Jardin Suspendu",
    location: "Shibuya, Tokyo, Japon",
    city: "Tokyo",
    country: "Japon",
    coordinates: [35.6595, 139.7005],
    pricePerNight: 210,
    rating: 4.94,
    reviewCount: 220,
    badge: "Coup de cœur design",
    superhost: true,
    maxGuests: 3,
    bedrooms: 1,
    beds: 2,
    bathrooms: 1,
    images: [
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1502005229762-ee1b2b8ab98f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Une oasis de calme et de minimalisme japonais au cœur du quartier vibrant de Shibuya. Matériaux nobles (bois de cèdre hinoki, tatamis traditionnels, bain japonais Ofuro) alliés à la domotique de pointe.",
    host: {
      name: "Kenji Sato",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
      verified: true,
      superhost: true,
      joined: "Hôte depuis 3 ans"
    },
    amenities: [
      { id: "bath", name: "Bain traditionnel japonais en bois (Ofuro)", icon: "bath" },
      { id: "wifi", name: "Pocket Wi-Fi illimité inclus pour la ville", icon: "wifi" },
      { id: "ac", name: "Climatisation & Purificateur d'air", icon: "wind" },
      { id: "kitchen", name: "Kitchenette équipée avec cuiseur à riz", icon: "utensils" },
      { id: "washer", name: "Lave-linge séchant automatique", icon: "washing-machine" }
    ],
    cleaningFee: 35,
    serviceFeePercent: 0.12,
    taxesPercent: 0.08
  }
];

// Catégories rapides pour le carrousel
const RENTAL_CATEGORIES = [
  { id: "all", label: "Tout afficher", icon: "fa-compass" },
  { id: "sea", label: "Bord de mer", icon: "fa-umbrella-beach" },
  { id: "pool", label: "Piscines d'exception", icon: "fa-water-ladder" },
  { id: "city", label: "Villes branchées", icon: "fa-city" },
  { id: "luxury", label: "Hôtels de Luxe", icon: "fa-crown" },
  { id: "mountain", label: "Au pied des pistes", icon: "fa-mountain" }
];
