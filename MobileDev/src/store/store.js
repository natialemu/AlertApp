import configureStore from '../../lib/store/moduleStore';
import entities from './schema';
import modules from './modules';
import persistance from './persist';

const moduleArray = (mods) => Object.keys(mods)
  .map(name => Object.assign({ name }, mods[name]));

const alertsAppManager = {
  entities,
  selectors: modules.selectors,
  store: configureStore(
    'alertsAppManager',
    moduleArray(modules.modules),
    persistance
  )(),
};

export default alertsAppManager;
