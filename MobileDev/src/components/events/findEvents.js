import { connect } from 'react-redux';
import React, { Component } from 'react';
import { ListView, View } from 'react-native';
import AlertsAppManager from '../../store/store';
import Event from './event';
import { SearchHeader } from './eventListHeaders';
import styles from '../../../lib/resources/stylesheet';

const rowHasChanged = (r1, r2) => r1.id || r1 !== r2.id || r2;
const ds = new ListView.DataSource({ rowHasChanged });

const search = (v, t) => v.indexOf(t) > -1;
const prepEvents = (events) => ds.cloneWithRows(events);

function mapStateToProps(state) {
  return {
    events: AlertsAppManager.entities.event.selectors.tableDataJS(state)
  };
}

class FindEvents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      scopedEvents: prepEvents([]),
    };
  }
  doSearch(text) {
    this.setState({
      searchTerm: text,
      scopedEvents: prepEvents(this.props.events.filter(ev => search(ev.name, text))),
    });
  }
  renderRow(rowData) {
    return <Event content={rowData} />;
  }
  render() {
    return (
      <ListView
        enableEmptySections
        style={styles.listView}
        dataSource={this.state.scopedEvents}
        renderRow={this.renderRow}
        renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
        renderHeader={() => <SearchHeader text="Find Events" onChangeText={(text) => this.doSearch(text)} />}
      />
    );
  }
}

export default connect(mapStateToProps)(FindEvents);

