
import React from 'react';
import { Shield, MapPin, Clock, Star, Users, CreditCard } from 'lucide-react';

const HousieFooter = () => {
  const features = [
    { icon: <Shield className="h-8 w-8" />, title: 'Verified Professionals', description: 'Background checked providers' },
    { icon: <MapPin className="h-8 w-8" />, title: 'Local Focus', description: 'Quebec-based service network' },
    { icon: <Clock className="h-8 w-8" />, title: 'Real-time Tracking', description: 'Live GPS and updates' },
    { icon: <Star className="h-8 w-8" />, title: 'Quality Ratings', description: 'Community-driven reviews' },
    { icon: <Users className="h-8 w-8" />, title: 'Trusted Network', description: 'Licensed and insured pros' },
    { icon: <CreditCard className="h-8 w-8" />, title: 'Secure Payments', description: 'Escrow protection included' }
  ];

  return (
    <footer className="bg-black text-white py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="text-white mb-3 flex justify-center">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-sm mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-xs">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Links Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-semibold mb-3">Get Help</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/help" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="/faq" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Services</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/services" className="hover:text-white transition-colors">Browse All</a></li>
              <li><a href="/services?category=cleaning" className="hover:text-white transition-colors">Cleaning</a></li>
              <li><a href="/services?category=maintenance" className="hover:text-white transition-colors">Maintenance</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Providers</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/auth" className="hover:text-white transition-colors">Sign Up</a></li>
              <li><a href="/provider-resources" className="hover:text-white transition-colors">Resources</a></li>
              <li><a href="/verification" className="hover:text-white transition-colors">Get Verified</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/competitive-advantage" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="/careers" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="/privacy" className="hover:text-white transition-colors">Privacy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <img 
              src="/lovable-uploads/a4e647f0-865a-42ef-a0cc-19226d5f0a35.png" 
              alt="HOUSIE" 
              className="h-8 w-auto mr-3"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling.style.display = 'inline';
              }}
            />
            <span className="hidden text-xl font-bold">HOUSIE</span>
          </div>
          
          <div className="text-sm text-gray-400">
            © 2025 HOUSIE. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default HousieFooter;
