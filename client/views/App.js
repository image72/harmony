import React from 'react'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as Actions from 'actions/common';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  componentWillMount() {
    // this.actions.getUser();
  }
  componentDidMount() {
    const isIframe = window.top != self;
    isIframe && document.body.classList.add('iframe');
  }
  render() {
    // const {user = {}, actions} = this.props;
    return (
      <p>App User page...</p>
    )
  }
}
const mapStateToProps = (state) => {
  // const { user } = state.common;
  // return { user };
  return {}
}
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
