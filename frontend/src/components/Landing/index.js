import React from 'react';
import Page from './Page';

import { connect } from 'react-redux';


class Landing extends React.Component {
  componentDidMount = () =>{
    document.body.style.backgroundColor = "#ce3b27";
  }
  render() {
    return (
      <Page />
    );
  }
}

const mapStateToProps = state => {
  return {
    currentUser: state.auth.currentUser,
    isSignedIn: state.auth.isSignedIn,
    verified: state.auth.verified,
  };
};

export default connect(mapStateToProps)(Landing);