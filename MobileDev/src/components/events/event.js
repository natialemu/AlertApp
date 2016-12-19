import React, { Component } from 'react';
import { View, Text } from 'react-native';
import styles from '../../../lib/resources/stylesheet';

class Event extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <View style={styles.eventRow}>
        <Text style={[styles.header, styles.eventContent]}>{this.props.content.name}</Text>
        <Text style={[styles.subHeader, styles.eventContent]}>{this.props.content.start_time} - {this.props.content.end_time}</Text>
        <Text style={[styles.bodyText, styles.eventContent]}>{this.props.content.description}</Text>
      </View>
    );
  }
}

export default Event;

