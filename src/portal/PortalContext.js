import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { buildPortalPath, migrateLegacyTab1Storage, setActivePortalSlug } from './portalStorage';

const PortalContext = createContext(null);

export const PortalProvider = ({ portal, children }) => {
  useEffect(() => {
    setActivePortalSlug(portal.slug);
    migrateLegacyTab1Storage(portal.slug);
  }, [portal.slug]);

  const value = useMemo(
    () => ({
      portal,
      portalCode: portal.code,
      portalSlug: portal.slug,
      path: (route = '/') => buildPortalPath(route, portal.slug),
      isFeatureEnabled: (featureName) =>
        portal.features?.[featureName] !== false,
      isPortal: (portalSlug) => portal.slug === portalSlug,
    }),
    [portal]
  );

  return <PortalContext.Provider value={value}>{children}</PortalContext.Provider>;
};

export const usePortal = () => {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return context;
};
