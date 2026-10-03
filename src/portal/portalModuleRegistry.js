import tab1Module from '../portals/tab1/module';
import tab2Module from '../portals/tab2/module';
import tab3Module from '../portals/tab3/module';

const portalModules = {
  tab1: tab1Module,
  tab2: tab2Module,
  tab3: tab3Module,
};

export const getPortalModule = (portalSlug) =>
  portalModules[portalSlug] || { pages: {}, components: {} };

export const resolvePortalPage = (portalSlug, pageKey, SharedPage) =>
  getPortalModule(portalSlug).pages?.[pageKey] || SharedPage;

export const resolvePortalComponent = (
  portalSlug,
  componentKey,
  SharedComponent = null
) => getPortalModule(portalSlug).components?.[componentKey] || SharedComponent;
