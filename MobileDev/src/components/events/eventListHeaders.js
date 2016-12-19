
import React from 'react';
import { View, TextInput, Text } from 'react-native';
import styles from '../../../lib/resources/stylesheet';

export const SearchHeader = (props) => (
  <View style={styles.listViewHeader}>
    <Text style={styles.header}>
      {props.text}
    </Text>
    <TextInput
      style={styles.input}
      placeholder="Search For Events"
      onChangeText={props.onChangeText}
    />
  </View>
);

export const Header = (props) => (
  <View style={styles.listViewHeader}>
    <Text style={styles.header}>
      {props.text}
    </Text>
  </View>
);
