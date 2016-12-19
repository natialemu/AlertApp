import { connect } from 'react-redux';
import React from 'react';
import { View, Text } from 'react-native';
import styles from '../../lib/resources/stylesheet';

const Notifications = React.createClass({
  render () {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Notifications</Text>
      </View>
    );
  }
});


export default connect()(Notifications);
