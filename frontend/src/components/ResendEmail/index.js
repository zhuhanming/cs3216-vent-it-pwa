import React from 'react';
import toh from '../../apis/toh';
import { connect } from 'react-redux';
import { signOut } from '../../actions';
import history from '../../history';


class ResendEmail extends React.Component {
  state = {
    resending: false,
  }
  componentDidMount = () => {
    if (!this.props.currentUser || !this.props.isSignedIn) {
      history.push('/');
    } else if (this.props.verified === "true") {
      history.push('/home');
    } else {
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
  }

  resendEmail = async () => {
    try {
      const response = await toh.post('/auth/resend', {}, {
        headers: {
          Authorization: 'Bearer ' + this.props.currentUser //the token is a variable which holds the token
        }
      });
      if (response.data.success === true) {
        this.setState({ resending: true });
      }
    } catch (e) {
      console.log(e.response);
      if (e.response.status === 401) {
        this.props.signOut();
      }
    }
  }

  render() {
    return (
      <div className="container landing">
        <div id="message" className="landing d-flex flex-column justify-content-center align-items-center visible invisible text-center">
          <img src="https://res.cloudinary.com/dwbg1zcql/image/upload/v1569514447/mascot2_b6x4tv.svg" className="img-fluid landing-img mt-4 mb-4" alt="Mascot" />
          <h3>You have yet to verify your email!</h3>
          <p>Check your email to continue your venting.</p>
          <button className="btn btn-vent" onClick={() => this.resendEmail()}><h6>Can't find the email? <br />Click here to resend the email.</h6></button>
          <small onClick={() => this.props.signOut()} className="mt-1"> Not your account? Click here to sign out </small>
          <br />
          {this.state.resending ? <small>Email resent!</small> : <></>}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    currentUser: state.auth.currentUser,
    isSignedIn: state.auth.isSignedIn,
    verified: state.auth.verified,
  };
};

export default connect(mapStateToProps, { signOut })(ResendEmail);
