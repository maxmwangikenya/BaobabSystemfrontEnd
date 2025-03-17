'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';

// Create a context
const AuthContext = createContext();

// Create a custom hook for easier access to the Auth context
export const useAuth = () => useContext(AuthContext);

// AuthProvider component
export const AuthProvider = ({ children }) => {
  // Set initial auth state to `true` by default
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Change to `true` for default auth state

  // You can add logic here to check for token or session if needed
  // useEffect(() => {
  //   // Logic to check if the user is authenticated (e.g., from localStorage or cookies)
  //   const storedAuthStatus = localStorage.getItem('authStatus');
  //   if (storedAuthStatus) {
  //     setIsAuthenticated(true);
  //   }
  // }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
