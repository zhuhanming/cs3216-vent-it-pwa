import React from 'react';
import { connect } from 'react-redux';
import { signUp } from '../../actions';
// import ReactGA from 'react-ga';
import '../Main.css';
import history from '../../history';

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    window.scrollTo(0, 0);
  }

  state = {
    email: "",
    password: "",
    password_check: "",
    name: "",
    username: "",
    error: false,
    error_msg: null,
  }

  componentDidMount = () => {
    if (this.props.isSignedIn && this.props.currentUser) {
      history.push('/home');
    } else {
      document.body.style.backgroundColor = "#ffdcd2";
      new Image().src = "https://res.cloudinary.com/dwbg1zcql/image/upload/v1569568525/mascot_3_rvqjh1.svg".fileName;
      requestAnimationFrame(() => {
        // Firefox will sometimes merge changes that happened here
        requestAnimationFrame(() => {
          let curr = document.getElementById("signup");
          curr.classList.toggle("invisible");
        });
      });
    }
  }

  signUp = async () => {
    if (this.state.password === this.state.password_check) {
      let result = await this.props.signUp({
        email: this.state.email.toLowerCase(),
        password: this.state.password,
        name: this.state.name,
        username: this.state.username,
      });
      if (result) {
        if (result === "Error" || result === "User Already Exists") {
          this.setState({ error: true, error_msg: result });
        } else {
          history.push('/');
        }
      }
    } else {
      window.alert("Password does not match!")
    }
  }

  _handleKeyDown = async (e) => {
    if (e.key === 'Enter') {
      this.signUp();
    }
  }

  goBackToLogin = () => {
    let curr = document.getElementById("signup");
    curr.classList.toggle("invisible");
    setTimeout(
      () => history.push('/login'),
      500
    );
  }

  render() {
    return (
      <div className="container landing">
        <div id="signup" className="landing d-flex flex-column justify-content-center align-items-center visible invisible">
          <img src="https://res.cloudinary.com/dwbg1zcql/image/upload/v1569568525/mascot_3_rvqjh1.svg" className="img-fluid landing-img mt-4 mb-4" alt="Mascot" />
          <h5 className="landing-text mb-0">Faster leh.</h5>
          <br/>
          <div className="form-group vent-form">
            <input id="email" onChange={(e) => { this.setState({ email: e.target.value }) }} value={this.state.email} type="email" className="form-control" placeholder="Email" />
          </div>
          <div className="form-group vent-form">
            <input id="name" onChange={(e) => { this.setState({ name: e.target.value }) }} value={this.state.name} type="name" className="form-control" placeholder="Full Name" />
          </div>
          <div className="form-group vent-form">
            <input id="username" onChange={(e) => { this.setState({ username: e.target.value }) }} value={this.state.username} type="username" className="form-control" placeholder="Username" />
          </div>
          <div className="form-group vent-form">
            <input id="password" onChange={(e) => { this.setState({ password: e.target.value }) }} value={this.state.password} type="password" className="form-control" placeholder="Password" />
          </div>
          <div className="form-group vent-form">
            <input id="repeat-password" onChange={(e) => { this.setState({ password_check: e.target.value }) }} value={this.state.password_check} type="password" className="form-control" placeholder="Repeat Password" onKeyDown={this._handleKeyDown} />
          </div>
          <button onClick={this.signUp} type="button" className="btn btn-vent"><h5 className="pt-1">SIGN UP</h5></button>
          <small className="error-msg mt-2">{this.state.error === true ? this.state.error_msg : ''}</small>
          <a onClick={this.goBackToLogin} className="mt-3 mb-3 login-text">Already have an account?<br/>Login here</a>
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

export default connect(mapStateToProps, { signUp })(SignUp);
