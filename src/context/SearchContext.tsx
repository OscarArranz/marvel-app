'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type SearchContextType = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  resultsAmount: number;
  setResultsAmount: (amount: number) => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

type SearchProviderProps = {
  children: ReactNode;
};

/**
 * Provider component for the search context.
 * Manages the search state and provides it to child components.
 */
export const SearchProvider = ({ children }: SearchProviderProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [resultsAmount, setResultsAmount] = useState(0);
  return (
    <SearchContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        resultsAmount,
        setResultsAmount,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

/**
 * Hook to use the search context.
 * Must be used within a SearchProvider.
 */
export const useSearch = () => {
  const context = useContext(SearchContext);

  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }

  return context;
};
