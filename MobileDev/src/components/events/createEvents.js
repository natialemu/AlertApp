import React from 'react';
import { View, TextInput, Text } from 'react-native';
import styles from '../../../lib/resources/stylesheet';

const CreateEvent = React.createClass({
  render () {
    return (
      <View style={styles.createEventForm}>
        <View style={styles.container}>
          <Text style={styles.header}>Create a New Event</Text>
        </View>
        <View style={styles.formInput} >
          <View style={styles.inputGroup} >
            <Text style={styles.label}>
              Name
            </Text>
            <TextInput
              style={styles.input}
              // onChangeText={props.onChangeText}
            />
          </View>
          <View style={styles.inputGroup} >
            <Text style={styles.label}>
              Description
            </Text>
            <TextInput
              style={styles.input}
              // onChangeText={props.onChangeText}
            />
          </View>
          <View style={styles.inputGroup} >
            <Text style={styles.label}>
              Start Date
            </Text>
            <TextInput
              style={styles.input}
              // onChangeText={props.onChangeText}
            />
          </View>
          <View style={styles.inputGroup} >
            <Text style={styles.label}>
              End Date
            </Text>
            <TextInput
              style={styles.input}
              // onChangeText={props.onChangeText}
            />
          </View>
        </View>
      </View>
    );
  }
});


export default CreateEvent;
