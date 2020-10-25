import React from 'react';
import toh from '../../apis/toh'
import { connect } from 'react-redux';
import { signIn, signInWithFacebook } from '../../actions';
import '../Main.css';
import FacebookLogin from 'react-facebook-login';
import history from '../../../src/history';

class Auth extends React.Component {

  state = {
    email: "",
    password: "",
    logging_in: false,
    error: false,
  }

  componentDidMount = () => {
    if (this.props.currentUser && this.props.isSignedIn) {
      history.push('/home');
    }else{
      document.body.style.backgroundColor = "#ffdcd2";
      new Image().src = "https://res.cloudinary.com/dwbg1zcql/image/upload/v1569568525/mascot_3_rvqjh1.svg".fileName;
      requestAnimationFrame(() => {
        // Firefox will sometimes merge changes that happened here
        requestAnimationFrame(() => {
          let curr = document.getElementById("login");
          curr.classList.toggle("invisible");
        });
      });
    }
  }

  loginUser = async() => {
    this.setState({ logging_in: true })
    const response = await this.props.signIn({
      email: this.state.email.toLowerCase(),
      password: this.state.password,
    });
    console.log(response);
    if (response === "Error") {
      this.setState({ error: true, logging_in: false });
    }
  }

  toggleSignUp = () => {
    let curr = document.getElementById("login");
    curr.classList.toggle("invisible");
    setTimeout(
      () => history.push('/signup'),
      500
    );
  }

  _handleKeyDown = async(e) => {
    if (e.key === 'Enter') {
      this.loginUser();
    }
  }

  renderusernameSignIn = () => {
    return <>
      <br />
      <>
        <div className="form-group vent-form">
          <input id="email" onChange={(e) => { this.setState({ email: e.target.value }) }} value={this.state.email} type="email" className="form-control" placeholder="Email" />
        </div>
        <div className="form-group vent-form">
          <input id="password" onChange={(e) => { this.setState({ password: e.target.value }) }} value={this.state.password} type="password" className="form-control" placeholder="Password" onKeyDown={this._handleKeyDown} />
        </div>
        <button onClick={this.loginUser} type="button" className="btn btn-vent"><h5 className="pt-1">LOGIN</h5></button>
        <small className="mt-2">{this.state.logging_in ? 'Logging you in...' : ''}</small>
        <small className="error-msg mt-2">{this.state.error ? 'Invalid login' : ''}</small>
        <a onClick={this.toggleSignUp} className="mt-3 mb-3">No account? Sign up here.</a>
      </>
    </>
  }

  facebookResponse = async (response) => {
    console.log(response);
    //send me the access_token here.
    const rep = await toh.post('/auth/facebook', {
      access_token: response.accessToken,
    });
    this.props.signInWithFacebook(rep);
    // console.log(rep);
    // window.location.reload('/home');
  }

  render() {
    return (
      <div className="container landing">
        <div id="login" className="landing d-flex flex-column justify-content-center align-items-center visible invisible">
          <img src="https://res.cloudinary.com/dwbg1zcql/image/upload/v1569568525/mascot_3_rvqjh1.svg" className="img-fluid landing-img mt-4 mb-4" alt="Mascot" />
          <h5 className="landing-text mb-0">Faster leh.</h5>
          {this.renderusernameSignIn()}
          <FacebookLogin
            appId="2875158215837379"
            autoLoad={false}
            fields="name,email,picture"
            redirectUri={'https://ventit.xyz/login'}
            cssClass="fb-btn-vent btn btn-lg p-3"
            callback={this.facebookResponse} />
        </div>
      </div>
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

export default connect(mapStateToProps, { signIn, signInWithFacebook })(Auth);
