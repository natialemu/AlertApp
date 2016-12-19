import 'babel-polyfill';
import { AppRegistry, StyleSheet, View, Text } from 'react-native';
import { Provider } from 'react-redux';
import { Router, Scene } from 'react-native-router-flux';
import React from 'react';
import AlertsAppManager from './store/store';
import App from './containers/app'; // splash screen and app init realated things
import Notifications from './containers/notificationsContainer';
import Events from './containers/eventsContainer';
import Profile from './containers/profileContainer';
import styles from '../lib/resources/stylesheet';

const VERSION_NUMBER = 'v0.1';
const APP_NAME = 'Alertz';

// import icons

// basic tab component
// TODO: move this to its own file
class TabIcon extends React.Component {
  render () {
    const color = this.props.selected ? '#D35400' : '#2B2B2B';
    return (
      <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', alignSelf: 'center' }}>
        <Text style={{ color }}>{this.props.title}</Text>
      </View>
     );
  }
}

export default function native (platform) {
  const AlertApp = React.createClass({
    render () {
      const store = AlertsAppManager.store;
      store.dispatch(AlertsAppManager.store.appMetaData.actions.setMetadataField('platform', platform));
      store.dispatch(AlertsAppManager.store.appMetaData.actions.setMetadataField('versionNumber', VERSION_NUMBER));
      store.dispatch(AlertsAppManager.store.appMetaData.actions.setMetadataField('appName', APP_NAME));

      return (
        <Provider store={store}>
          <Router sceneStyle={{ backgroundColor: '#ECECEC' }}>
            <Scene key="root" hideNavBar>
              <Scene
                key="App"
                component={App}
                type="replace"
                initial
              />

              <Scene
                key="Tabbar"
                tabs
                hideNavBar
                tabBarStyle={styles.tabBar}
                default="Main"
              >

                <Scene
                  key="Notifications"
                  title="Notifications"
                  icon={TabIcon}
                  hideNavBar
                  component={Notifications}
                  initial
                />

                <Scene
                  key="ManageEvents"
                  title="Events"
                  icon={TabIcon}
                  hideNavBar
                  component={Events}
                />

                <Scene
                  key="Profile"
                  title="Profile"
                  icon={TabIcon}
                  hideNavBar
                  component={Profile}
                />

              </Scene>
            </Scene>
          </Router>
        </Provider>
      );
    }
  });

  AppRegistry.registerComponent('mobileDev', () => AlertApp);
}

