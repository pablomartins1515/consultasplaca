import React, { createContext, useState, ReactNode } from 'react';

interface AppContextProps {
  placa: string;
  setPlaca: (placa: string) => void;
  token: string;
  setToken: (token: string) => void;
}

export const AppContext = createContext<AppContextProps>({
  placa: '',
  setPlaca: () => {},
  token: '',
  setToken: () => {},
});

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [placa, setPlaca] = useState<string>('');
  const [token, setToken] = useState<string>('');

  return (
    <AppContext.Provider value={{ placa, setPlaca, token, setToken }}>
      {children}
    </AppContext.Provider>
  );
};
