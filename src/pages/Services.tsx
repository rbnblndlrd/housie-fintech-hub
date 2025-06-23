
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ServicesPage from "@/components/ServicesPage";

const Services = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <ServicesPage />
    </div>
  );
};

export default Services;
