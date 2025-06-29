import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { MeasurementSystem } from '@shared/schema';
import { useAuth } from '@/hooks/use-auth';

interface MeasurementContextType {
  system: MeasurementSystem;
  setSystem: (system: MeasurementSystem) => void;
  toggleSystem: () => void;
}

const MeasurementContext = createContext<MeasurementContextType | undefined>(undefined);

export function MeasurementProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [system, setSystem] = useState<MeasurementSystem>(
    user?.measurementSystem as MeasurementSystem || 'metric'
  );

  // Update if user changes
  useEffect(() => {
    if (user?.measurementSystem) {
      setSystem(user.measurementSystem as MeasurementSystem);
    }
  }, [user]);

  const toggleSystem = () => {
    const newSystem = system === 'metric' ? 'imperial' : 'metric';
    setSystem(newSystem);
    
    // We could update the user preference in the database here with an API call
    // if we want the preference to persist between sessions
  };

  return (
    <MeasurementContext.Provider value={{ system, setSystem, toggleSystem }}>
      {children}
    </MeasurementContext.Provider>
  );
}

export function useMeasurement() {
  const context = useContext(MeasurementContext);
  if (context === undefined) {
    throw new Error('useMeasurement must be used within a MeasurementProvider');
  }
  return context;
}