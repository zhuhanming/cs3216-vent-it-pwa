import React from 'react';
import { connect } from 'react-redux';
import { signOut } from '../../actions';
import history from '../../history';

class Settings extends React.Component {
  componentDidMount = () => {
    if (!this.props.isSignedIn || !this.props.currentUser) {
      history.push('/');
    } else if (this.props.verified === 'false') {
      history.push('/verify');
    }
    document.body.style.backgroundColor = '#f2f2f2';
    new Image().src = "https://res.cloudinary.com/dwbg1zcql/image/upload/v1569568526/mascot_4_df4fth.svg".fileName;
  };

  signOut = () => {
    this.props.signOut();
  };

  render() {
    return (
      <div className="container d-flex flex-column align-items-center">
        <div className="container pb-4">
          <div className="d-flex flex-column visible">
            <div className="d-flex justify-content-between align-items-center mt-3">
              <i
                onClick={() => history.push('/home')}
                className="fas fa-chevron-left btn-icon-vent"
              ></i>
              <img
                className="logo"
                src="https://res.cloudinary.com/dwbg1zcql/image/upload/v1569513124/logo_q9j2rj.svg"
                alt="Vent It Logo"
              />
              <i
                className="fas fa-cog btn-icon-vent"
                style={{ visibility: 'hidden' }}
              ></i>
            </div>
          </div>
        </div>

        <div className="container d-flex flex-column justify-content-center align-items-center visible text-center mt-5">
          <h5>Go ahead. Everyone just leaves anyway.</h5>
        </div>

        <img
          src="https://res.cloudinary.com/dwbg1zcql/image/upload/v1569568526/mascot_4_df4fth.svg"
          className="img-fluid archived-img mt-4 mb-4"
          alt="Mascot"
        />
        <button className="btn-vent" onClick={() => this.signOut()}>
          SIGN OUT
        </button>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentUser: state.auth.currentUser,
    isSignedIn: state.auth.isSignedIn,
    verified: state.auth.verified
  };
};

export default connect(
  mapStateToProps,
  { signOut }
)(Settings);
