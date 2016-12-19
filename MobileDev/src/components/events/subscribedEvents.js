import { connect } from 'react-redux';
import React, { Component } from 'react';
import { ListView, View } from 'react-native';
import AlertsAppManager from '../../store/store';
import Event from './event';
import { Header } from './eventListHeaders';
import styles from '../../../lib/resources/stylesheet';

const rowHasChanged = (r1, r2) => r1.id !== r2.id;

const ds = new ListView.DataSource({ rowHasChanged });

function mapStateToProps(state) {
  return {
    events: ds.cloneWithRows(AlertsAppManager.entities.event.selectors.tableDataJS(state))
  };
}

class SubscribedEvents extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  renderRow(rowData) {
    return <Event content={rowData} />;
  }
  render() {
    return (
      <ListView
        style={styles.listView}
        dataSource={this.props.events}
        renderRow={this.renderRow}
        renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
        renderHeader={() => <Header text="My Events" />}
      />
    );
  }
}

export default connect(mapStateToProps)(SubscribedEvents);

