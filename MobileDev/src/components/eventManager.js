import React, { Component } from 'react';
import { View } from 'react-native';
import styles from '../../lib/resources/stylesheet';
import TouchableHightlight from './touchableHighlight/touchableHighlight';
import SubscribedEvents from './events/subscribedEvents';
import CreateEvents from './events/createEvents';
import FindEvents from './events/findEvents';

const SubscribedEventsInstance = (() => <SubscribedEvents />);
const CreateEventsInstance = (() => <CreateEvents />);
const FindEventsInstance = (() => <FindEvents />);

// TODO
// All componts should be refactored to use es6 classes like below
class EventManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedComponent: SubscribedEventsInstance(),
      subbed: true,
      create: false,
      find: false,
    };
  }
  updateSelection(selectedKey) {
    switch (selectedKey) {
      case ('subbedEvents'):
        this.showSubscribedEvents();
        break;
      case ('createEvents'):
        this.showCreateEvents();
        break;
      case ('findEvents'):
        this.showFindEvents();
        break;
      default:
        break;
    }
  }
  showSubscribedEvents() {
    this.setState({
      selectedComponent: SubscribedEventsInstance(),
      subbed: true,
      create: false,
      find: false,
    });
  }
  showCreateEvents() {
    this.setState({
      selectedComponent: CreateEventsInstance(),
      subbed: false,
      create: true,
      find: false,
    });
  }
  showFindEvents() {
    this.setState({
      selectedComponent: FindEventsInstance(),
      selection: 'findEvents',
      subbed: false,
      create: false,
      find: true,
    });
  }
  render() {
    return (
      <View>
        {this.state.selectedComponent}
        <View style={styles.highlightBar}>
          <TouchableHightlight
            selected={this.state.subbed}
            selectedStyle={styles.selectedTouchable}
            defaultStyle={styles.defaultTouchable}
            label="S"
            onPress={() => this.updateSelection('subbedEvents')}
          />
          <TouchableHightlight
            selected={this.state.create}
            selectedStyle={styles.selectedTouchable}
            defaultStyle={styles.defaultTouchable}
            label="C"
            onPress={() => this.updateSelection('createEvents')}
          />
          <TouchableHightlight
            selected={this.state.find}
            selectedStyle={styles.selectedTouchable}
            defaultStyle={styles.defaultTouchable}
            label="F"
            onPress={() => this.updateSelection('findEvents')}
          />
        </View>
      </View>
    );
  }
}


export default EventManager;
