'use client'

import React, { createContext, useContext, useMemo, useCallback } from 'react'

const AppContext = createContext()

export function AppProvider({ children }) {
    const hasPermission = useCallback(() => true, []);
    const logout = useCallback(() => {}, []);
    const setIsCartOpen = useCallback(() => {}, []);

    const value = useMemo(() => ({
        user: { name: 'Admin', role: 'admin' },
        isAuthenticated: true,
        loading: false,
        hasPermission,
        logout,
        cartCount: 0,
        isCartOpen: false,
        setIsCartOpen,
    }), [hasPermission, logout, setIsCartOpen]);

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export function useAppContext() {
    const context = useContext(AppContext)
    if (!context) {
        // Return dummy values even if provider is missing to prevent crashes
        return {
            user: { name: 'Admin', role: 'admin' },
            isAuthenticated: true,
            loading: false,
            hasPermission: () => true,
            logout: () => {},
            cartCount: 0,
            isCartOpen: false,
            setIsCartOpen: () => {},
        }
    }
    return context
}
