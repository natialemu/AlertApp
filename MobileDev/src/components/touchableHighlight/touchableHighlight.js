import React, { Component } from 'react';
import { TouchableHighlight, View, Text } from 'react-native';
import styles from '../../../lib/resources/stylesheet';

class THL extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <TouchableHighlight
        style={styles.navButton}
        onPress={this.props.onPress}
      >
        <View
          style={this.props.selected ? this.props.selectedStyle : this.props.defaultStyle}
        >
          <Text style={styles.touchableLabel}>{this.props.label}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

export default THL;
