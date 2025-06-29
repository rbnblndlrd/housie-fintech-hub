
import React from 'react';
import { Navigate } from 'react-router-dom';

const KanbanBoard: React.FC = () => {
  // Redirect to the new bookings page
  return <Navigate to="/bookings" replace />;
};

export default KanbanBoard;
