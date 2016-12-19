import React from 'react';
import { Button } from 'react-native';
import { globals } from '../../../lib/resources/stylesheet';

const Btn = React.createClass({
  render () {
    return (
      <Button
        onPress={this.props.action}
        title={this.props.name}
        color={globals.ORANGE}
        accessibilityLabel={this.props.accessibilityLabel}
      />
    );
  }
});


export default Btn;
