import { connect } from 'react-redux';
import React from 'react';
import EventManager from '../components/eventManager';

const Events = React.createClass({
  render () {
    return (
      <EventManager />
    );
  }
});


export default connect()(Events);
