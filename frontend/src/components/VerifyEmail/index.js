import React from 'react';
import { connect } from 'react-redux';
import { verifyEmail, signOut } from '../../actions';
import history from '../../history';
import queryString from 'query-string';



class VerifyEmail extends React.Component {
  state = {
    loading: true,
    error: false,
  }

  componentDidMount = async () => {
    if (this.props.location.pathname !=="/confirm"){
      history.push('/404');
    }
    const val = queryString.parse(this.props.location.search);
    let response = await this.props.verifyEmail(val.code);
    console.log(response);
    if (response.status === 401||response.success===false) {
      this.setState({ error: true });
    } else {
      this.setState({ loading: false });
    }
    document.body.style.backgroundColor = "#ce3b27";
    new Image().src = "https://res.cloudinary.com/dwbg1zcql/image/upload/v1569514447/mascot2_b6x4tv.svg".fileName;
    requestAnimationFrame(() => {
      // Firefox will sometimes merge changes that happened here
      requestAnimationFrame(() => {
        let curr = document.getElementById("message");
        curr.classList.toggle("invisible");
      });
    });
  }

  signOutAndLogOut = () =>{
    history.push('/login');
    this.props.signOut();
  }

  render() {
    if (this.state.loading) {
      if (this.state.error) {
        return (
          <div className="container landing">
            <div id="message" className="landing d-flex flex-column justify-content-center align-items-center visible invisible text-center">
              <img src="https://res.cloudinary.com/dwbg1zcql/image/upload/v1569514447/mascot2_b6x4tv.svg" className="img-fluid landing-img mt-4 mb-4" alt="Mascot" />
              You have either already verified your email or your verification link has expired.
            <button onClick={() => this.signOutAndLogOut()} className="btn btn-vent mt-2">Click here to return to login</button>
            </div>
          </div>
        )
      } else {
        return (
          <div className="container landing">
            <div id="message" className="landing d-flex flex-column justify-content-center align-items-center visible invisible text-center">
              <img src="https://res.cloudinary.com/dwbg1zcql/image/upload/v1569514447/mascot2_b6x4tv.svg" className="img-fluid landing-img mt-4 mb-4" alt="Mascot" />
              Verifying Email...
            </div>
          </div>
        )
      }
    } else {
      return (
        <div className="container landing">
            <div id="message" className="landing d-flex flex-column justify-content-center align-items-center visible invisible text-center">
              <img src="https://res.cloudinary.com/dwbg1zcql/image/upload/v1569514447/mascot2_b6x4tv.svg" className="img-fluid landing-img mt-4 mb-4" alt="Mascot" />
          <p>Email Verified!</p>
          <button onClick={() => this.signOutAndLogOut()} className="btn btn-vent mt-2">Click here to get started!</button>
        </div>
        </div>
      )
    }
  }
}

const mapStateToProps = state => {
  return {
    currentUser: state.auth.currentUser,
    isSignedIn: state.auth.isSignedIn,
    verified: state.auth.verified,
  };
};

export default connect(mapStateToProps, { verifyEmail, signOut })(VerifyEmail);
