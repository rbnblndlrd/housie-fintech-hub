
export const sampleProviderProfiles = [
  {
    id: '1',
    businessName: 'Montreal Shine Cleaning',
    fullName: 'Marie Dubois',
    description: 'Professional residential and commercial cleaning services with over 8 years of experience. We use eco-friendly products and guarantee satisfaction on every job. Our team is fully trained, insured, and background-checked.',
    profileImage: '/api/placeholder/150/150',
    phone: '(514) 555-0123',
    email: 'marie@montrealshine.ca',
    city: 'Montréal',
    province: 'QC',
    serviceAreas: ['Montréal', 'Laval', 'Longueuil'],
    yearsExperience: 8,
    responseTime: '2-4 hours',
    emergencyService: true,
    certifications: ['Eco-Certified', 'Commercial Grade'],
    insurance: true,
    backgroundCheck: true,
    verified: true,
    averageRating: 4.8,
    totalReviews: 127,
    totalBookings: 203,
    hourlyRate: 32,
    services: [
      {
        id: 's1',
        title: 'Deep House Cleaning',
        description: 'Complete deep cleaning service including kitchen, bathrooms, bedrooms, and living areas. We clean inside appliances, baseboards, light fixtures, and all surfaces.',
        basePrice: 150,
        pricingType: 'fixed' as const,
        category: 'residential',
        responseTime: '2-4 hours',
        emergency: false,
        images: ['/api/placeholder/400/300', '/api/placeholder/400/300']
      },
      {
        id: 's2',
        title: 'Regular Maintenance Cleaning',
        description: 'Weekly or bi-weekly cleaning service to keep your home spotless. Includes dusting, vacuuming, mopping, and sanitizing all common areas.',
        basePrice: 32,
        pricingType: 'hourly' as const,
        category: 'residential',
        responseTime: 'Same day',
        emergency: false
      },
      {
        id: 's3',
        title: 'Post-Construction Cleanup',
        description: 'Specialized cleaning after renovations or construction work. We handle dust removal, debris cleanup, and make your space move-in ready.',
        basePrice: 45,
        pricingType: 'hourly' as const,
        category: 'commercial',
        responseTime: 'Next day',
        emergency: false
      }
    ],
    reviews: [
      {
        id: 'r1',
        customerName: 'Sophie Tremblay',
        rating: 5,
        comment: 'Marie and her team did an absolutely amazing job cleaning my 3-bedroom condo. Every surface was spotless, and they even organized my closets without being asked. The eco-friendly products left everything smelling fresh. Highly recommend!',
        date: '2024-01-15',
        service: 'Deep House Cleaning',
        helpfulCount: 8,
        verified: true
      },
      {
        id: 'r2',
        customerName: 'Jean-Pierre Bouchard',
        rating: 5,
        comment: 'Professional, reliable, and thorough. Marie has been cleaning our office monthly for 6 months and never disappoints. Always on time and pays attention to details.',
        date: '2024-01-10',
        service: 'Commercial Cleaning',
        helpfulCount: 5,
        verified: true
      },
      {
        id: 'r3',
        customerName: 'Catherine Laurent',
        rating: 4,
        comment: 'Great service overall. The deep cleaning was very thorough, though it took a bit longer than expected. Marie was very communicative and professional throughout.',
        date: '2024-01-05',
        service: 'Deep House Cleaning',
        helpfulCount: 3,
        verified: true
      }
    ]
  },
  {
    id: '2',
    businessName: 'Longueuil Pro Plumbing',
    fullName: 'Robert Gagnon',
    description: 'Licensed master plumber serving the South Shore for over 15 years. Specializing in emergency repairs, bathroom renovations, and commercial plumbing installations. Available 24/7 for urgent issues.',
    profileImage: '/api/placeholder/150/150',
    phone: '(450) 555-0187',
    email: 'robert@longueuilplumbing.ca',
    city: 'Longueuil',
    province: 'QC',
    serviceAreas: ['Longueuil', 'Brossard', 'Saint-Lambert', 'Greenfield Park'],
    yearsExperience: 15,
    responseTime: '30-60 minutes',
    emergencyService: true,
    certifications: ['Master Plumber License', 'Gas Fitting Certified'],
    insurance: true,
    backgroundCheck: true,
    verified: true,
    averageRating: 4.9,
    totalReviews: 89,
    totalBookings: 156,
    hourlyRate: 85,
    services: [
      {
        id: 's4',
        title: 'Emergency Plumbing Repair',
        description: '24/7 emergency plumbing services for burst pipes, major leaks, sewer backups, and no hot water situations. Fast response guaranteed.',
        basePrice: 125,
        pricingType: 'hourly' as const,
        category: 'emergency',
        responseTime: '30-60 minutes',
        emergency: true
      },
      {
        id: 's5',
        title: 'Bathroom Renovation',
        description: 'Complete bathroom renovation including fixture installation, tiling preparation, and all plumbing connections. Project management included.',
        basePrice: 95,
        pricingType: 'hourly' as const,
        category: 'renovation',
        responseTime: '1-2 days',
        emergency: false
      },
      {
        id: 's6',
        title: 'Drain Cleaning & Unclogging',
        description: 'Professional drain cleaning using modern equipment. We clear kitchen sinks, bathroom drains, floor drains, and main sewer lines.',
        basePrice: 180,
        pricingType: 'fixed' as const,
        category: 'maintenance',
        responseTime: '2-4 hours',
        emergency: false
      }
    ],
    reviews: [
      {
        id: 'r4',
        customerName: 'Michelle Roy',
        rating: 5,
        comment: 'Robert saved the day when our basement started flooding at 2 AM. He arrived within 45 minutes, quickly identified the issue, and had it fixed in under 2 hours. Professional and fairly priced for emergency work.',
        date: '2024-01-20',
        service: 'Emergency Plumbing Repair',
        helpfulCount: 12,
        verified: true
      },
      {
        id: 'r5',
        customerName: 'Daniel Leblanc',
        rating: 5,
        comment: 'Excellent work on our bathroom renovation. Robert coordinated everything perfectly and the plumbing work was flawless. Highly recommend for any major plumbing project.',
        date: '2024-01-18',
        service: 'Bathroom Renovation',
        helpfulCount: 7,
        verified: true
      }
    ]
  },
  {
    id: '3',
    businessName: 'Laval Handyman Services',
    fullName: 'Pierre-Alexandre Moreau',
    description: 'Your reliable handyman for all home improvement needs. From minor repairs to major projects, I handle electrical, carpentry, painting, and general maintenance with attention to detail and fair pricing.',
    profileImage: '/api/placeholder/150/150',
    phone: '(450) 555-0156',
    email: 'pierre@lavalhandyman.ca',
    city: 'Laval',
    province: 'QC',
    serviceAreas: ['Laval', 'Montréal-Nord', 'Saint-Laurent'],
    yearsExperience: 12,
    responseTime: '1-2 days',
    emergencyService: false,
    certifications: ['Electrical Permit', 'Carpentry Certificate'],
    insurance: true,
    backgroundCheck: true,
    verified: true,
    averageRating: 4.7,
    totalReviews: 94,
    totalBookings: 128,
    hourlyRate: 65,
    services: [
      {
        id: 's7',
        title: 'Home Repairs & Maintenance',
        description: 'General home repairs including fixing doors, windows, drywall, flooring, and minor electrical issues. Perfect for your honey-do list.',
        basePrice: 65,
        pricingType: 'hourly' as const,
        category: 'maintenance',
        responseTime: '1-2 days',
        emergency: false
      },
      {
        id: 's8',
        title: 'Furniture Assembly',
        description: 'Professional assembly of IKEA furniture, gym equipment, office furniture, and any other flat-pack items. Tools and expertise included.',
        basePrice: 80,
        pricingType: 'fixed' as const,
        category: 'assembly',
        responseTime: 'Same day',
        emergency: false
      },
      {
        id: 's9',
        title: 'Interior Painting',
        description: 'Quality interior painting services for rooms, hallways, and trim work. Includes surface preparation, primer, and cleanup.',
        basePrice: 55,
        pricingType: 'hourly' as const,
        category: 'painting',
        responseTime: '2-3 days',
        emergency: false
      }
    ],
    reviews: [
      {
        id: 'r6',
        customerName: 'Anne-Marie Côté',
        rating: 5,
        comment: 'Pierre-Alexandre painted our entire main floor and did beautiful work. Very professional, clean, and finished ahead of schedule. The price was very reasonable too.',
        date: '2024-01-22',
        service: 'Interior Painting',
        helpfulCount: 6,
        verified: true
      },
      {
        id: 'r7',
        customerName: 'Marc Lefebvre',
        rating: 4,
        comment: 'Good handyman service. Fixed several issues around the house efficiently. Communication could be better, but the work quality was solid.',
        date: '2024-01-16',
        service: 'Home Repairs & Maintenance',
        helpfulCount: 4,
        verified: true
      }
    ]
  }
];
