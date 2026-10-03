import { DEFAULT_PORTAL_SLUG, getPortalBySlug } from './portalConfig';

const ACTIVE_PORTAL_KEY = 'kalyanKosh.activePortal';
const STORAGE_PREFIX = 'kalyanKosh.portal';
const LEGACY_AUTH_KEYS = ['authToken', 'user', 'loginDate'];

export const getPortalSlugFromPath = (pathname = window.location.pathname) => {
  const match = String(pathname || '').match(/^\/portal\/([^/]+)/i);
  const slug = match?.[1]?.toLowerCase();
  return getPortalBySlug(slug) ? slug : null;
};

export const getActivePortalSlug = () => {
  const routePortal = getPortalSlugFromPath();
  if (routePortal) return routePortal;

  const storedPortal = localStorage.getItem(ACTIVE_PORTAL_KEY);
  return getPortalBySlug(storedPortal) ? storedPortal : DEFAULT_PORTAL_SLUG;
};

export const setActivePortalSlug = (portalSlug) => {
  if (getPortalBySlug(portalSlug)) {
    localStorage.setItem(ACTIVE_PORTAL_KEY, portalSlug);
  }
};

export const getPortalStorageKey = (key, portalSlug = getActivePortalSlug()) =>
  `${STORAGE_PREFIX}.${portalSlug}.${key}`;

export const migrateLegacyTab1Storage = (portalSlug = getActivePortalSlug()) => {
  if (portalSlug !== DEFAULT_PORTAL_SLUG) return;

  LEGACY_AUTH_KEYS.forEach((key) => {
    const scopedKey = getPortalStorageKey(key, portalSlug);
    const legacyValue = localStorage.getItem(key);

    if (legacyValue !== null && localStorage.getItem(scopedKey) === null) {
      localStorage.setItem(scopedKey, legacyValue);
    }

    if (legacyValue !== null) {
      localStorage.removeItem(key);
    }
  });
};

export const getPortalLocalStorageItem = (key, portalSlug = getActivePortalSlug()) => {
  migrateLegacyTab1Storage(portalSlug);
  return localStorage.getItem(getPortalStorageKey(key, portalSlug));
};

export const setPortalLocalStorageItem = (
  key,
  value,
  portalSlug = getActivePortalSlug()
) => {
  localStorage.setItem(getPortalStorageKey(key, portalSlug), value);
};

export const removePortalLocalStorageItem = (
  key,
  portalSlug = getActivePortalSlug()
) => {
  localStorage.removeItem(getPortalStorageKey(key, portalSlug));
};

export const getPortalSessionStorageItem = (
  key,
  portalSlug = getActivePortalSlug()
) => sessionStorage.getItem(getPortalStorageKey(key, portalSlug));

export const setPortalSessionStorageItem = (
  key,
  value,
  portalSlug = getActivePortalSlug()
) => sessionStorage.setItem(getPortalStorageKey(key, portalSlug), value);

export const removePortalSessionStorageItem = (
  key,
  portalSlug = getActivePortalSlug()
) => sessionStorage.removeItem(getPortalStorageKey(key, portalSlug));

export const clearPortalSessionStorage = (portalSlug = getActivePortalSlug()) => {
  const prefix = `${STORAGE_PREFIX}.${portalSlug}.`;
  Object.keys(sessionStorage)
    .filter((key) => key.startsWith(prefix))
    .forEach((key) => sessionStorage.removeItem(key));
};

export const clearPortalAuthData = (portalSlug = getActivePortalSlug()) => {
  ['authToken', 'user', 'loginDate'].forEach((key) =>
    removePortalLocalStorageItem(key, portalSlug)
  );
  clearPortalSessionStorage(portalSlug);
};

export const buildPortalPath = (
  route = '/',
  portalSlug = getActivePortalSlug()
) => {
  const normalizedRoute = !route || route === '/'
    ? ''
    : `/${String(route).replace(/^\/+/, '')}`;

  return `/portal/${portalSlug}${normalizedRoute}`;
};
