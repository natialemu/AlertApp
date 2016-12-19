import { connect } from 'react-redux';
import { View, Text, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';
import React from 'react';
import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';
import AlertsAppManager from '../store/store';
import styles from '../../lib/resources/stylesheet';
import logo from '../../lib/resources/img/finalLogo.png';

function mapStateToProps(state) {
  return {
    versionNumber: state.appMetaData.get('versionNumber'),
    platform: state.appMetaData.get('platform'),
    appName: state.appMetaData.get('appName'),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getSessionToken: () => dispatch(AlertsAppManager.store.auth.actions.getSessionToken()),
    downloadData: () => dispatch(AlertsAppManager.store.downloader.actions.start(1, 1))
  };
}

const App = React.createClass({
  componentDidMount () {
        // Use a timer so App screen is displayed for 2.5 seconds
    this.setTimeout(
      () => {
        this.props.getSessionToken();
        this.props.downloadData();
        Actions.Tabbar();
      }, 2500);
  },
  render () {
    return (
      <View style={styles.specialContainer}>
        <Image
          style={{ width: 100, height: 90 }}
          source={logo}
        />
        <Text style={styles.header}>{this.props.appName} on {this.props.platform}</Text>
        <Text style={styles.subHeader}>{this.props.versionNumber}</Text>
        <Text style={styles.bodyText}>A COMP 322 App... </Text>
        <Text style={styles.icon1}>John Thompson</Text>
        <Text style={styles.icon2}>Tom Biju</Text>
        <Text style={styles.icon3}>Nathnael Alemu</Text>
      </View>
    );
  }
});

reactMixin(App.prototype, TimerMixin);

export default connect(mapStateToProps, mapDispatchToProps)(App);
