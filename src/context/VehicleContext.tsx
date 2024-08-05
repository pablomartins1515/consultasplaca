import React, { createContext, useState, useContext, ReactNode } from 'react';
import { VehicleData } from './types'; // Importe a interface

interface VehicleContextProps {
  vehicleData: VehicleData | null;
  setVehicleData: (data: VehicleData | null) => void;
}

const VehicleContext = createContext<VehicleContextProps | undefined>(undefined);

export const VehicleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [vehicleData, setVehicleData] = useState<VehicleData | null>(null);

  return (
    <VehicleContext.Provider value={{ vehicleData, setVehicleData }}>
      {children}
    </VehicleContext.Provider>
  );
};

export const useVehicleContext = (): VehicleContextProps => {
  const context = useContext(VehicleContext);
  if (!context) {
    throw new Error('useVehicleContext must be used within a VehicleProvider');
  }
  return context;
};
