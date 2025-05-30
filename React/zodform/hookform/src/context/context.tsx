import { createContext, type ReactNode, useContext, useState } from "react";

interface GlobalContextType {
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
}

export const EmptyGlobalState: number = 0;

export const GlobalContext = createContext<GlobalContextType>({
  value: 0,
  setValue: () => {}
});

interface GlobalProps {
  children: ReactNode;
}

export const GlobalProvider = ({ children }: GlobalProps) => {
  const [value, setValue] = useState<number>(EmptyGlobalState);
   
  return (
    <GlobalContext.Provider value={{ value, setValue }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};