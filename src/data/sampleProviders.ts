
export const sampleProviders = [
  {
    business_name: "Marie Nettoyage",
    description: "Service de nettoyage résidentiel professionnel avec 8 ans d'expérience à Montréal",
    years_experience: 8,
    hourly_rate: 30,
    service_radius_km: 25,
    verified: true,
    average_rating: 4.8,
    total_bookings: 127,
    user_data: {
      full_name: "Marie Dubois",
      city: "Montréal",
      province: "QC",
      phone: "(514) 555-0123",
      email: "marie.nettoyage@example.com"
    },
    services: [
      {
        title: "Nettoyage résidentiel complet",
        description: "Nettoyage en profondeur de votre domicile: cuisine, salle de bain, chambres, salon. Produits écologiques inclus.",
        category: "cleaning",
        subcategory: "residential",
        pricing_type: "hourly",
        base_price: 30
      },
      {
        title: "Grand ménage post-déménagement",
        description: "Service de nettoyage après déménagement ou rénovation. Remise à neuf complète.",
        category: "cleaning",
        subcategory: "post_move",
        pricing_type: "flat",
        base_price: 180
      }
    ]
  },
  {
    business_name: "Jean Paysagiste",
    description: "Expert en aménagement paysager et entretien de terrain depuis 12 ans",
    years_experience: 12,
    hourly_rate: 35,
    service_radius_km: 30,
    verified: true,
    average_rating: 4.9,
    total_bookings: 89,
    user_data: {
      full_name: "Jean-Pierre Lavoie",
      city: "Montréal",
      province: "QC", 
      phone: "(514) 555-0187",
      email: "jean.paysagiste@example.com"
    },
    services: [
      {
        title: "Tonte de pelouse professionnelle",
        description: "Tonte, bordures et ramassage des résidus. Service hebdomadaire ou ponctuel disponible.",
        category: "lawn_care",
        subcategory: "mowing",
        pricing_type: "flat",
        base_price: 75
      },
      {
        title: "Aménagement paysager complet",
        description: "Conception et installation d'aménagements paysagers sur mesure: plates-bandes, arbustes, éclairage.",
        category: "lawn_care",
        subcategory: "landscaping",
        pricing_type: "hourly",
        base_price: 35
      }
    ]
  },
  {
    business_name: "Sophie Entretien",
    description: "Services d'entretien ménager et maintenance résidentielle personnalisés",
    years_experience: 6,
    hourly_rate: 28,
    service_radius_km: 20,
    verified: true,
    average_rating: 4.7,
    total_bookings: 94,
    user_data: {
      full_name: "Sophie Martin",
      city: "Montréal", 
      province: "QC",
      phone: "(514) 555-0156",
      email: "sophie.entretien@example.com"
    },
    services: [
      {
        title: "Entretien ménager régulier",
        description: "Service d'entretien hebdomadaire ou bi-hebdomadaire. Aspirateur, serpillière, surfaces.",
        category: "cleaning",
        subcategory: "maintenance",
        pricing_type: "hourly",
        base_price: 28
      },
      {
        title: "Nettoyage de bureaux",
        description: "Nettoyage professionnel d'espaces de travail. Disponible en soirée et week-ends.",
        category: "cleaning",
        subcategory: "commercial",
        pricing_type: "hourly",
        base_price: 32
      }
    ]
  }
];
