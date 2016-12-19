import React, { Component } from 'react';
import { AppRegistry, TextInput } from 'react-native';

class inputField extends Component {
  constructor(props) {
    super(props);
    this.state = { text: 'Useless Placeholder' };
  }

  render() {
    return (
      <TextInput
        style={{height: 40, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(text) => this.setState({text})}
        value={this.state.text}
      />
    );
  }
}

// App registration and rendering
AppRegistry.registerComponent('AwesomeProject', () => inputField);
