
import React from 'react';

const CalendarHeader: React.FC = () => {
  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
        Calendrier
      </h1>
      <p className="text-gray-600">Gérez votre planning et vos rendez-vous</p>
    </div>
  );
};

export default CalendarHeader;
