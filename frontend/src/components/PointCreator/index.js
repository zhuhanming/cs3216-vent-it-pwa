import React from 'react';
import { connect } from 'react-redux';
import toh from '../../apis/toh';
import '../Main.css';
import TextEntry from './TextEntry';
import history from '../../history';
import SoundEntry from './SoundEntry';
import Confirmation from './Confirmation';

class PointCreator extends React.Component {
  state = {
    stage: 0,
    content: '',
    audioURL: null,
    audioBlob: null,
    decibels: null,
    created_at: null,
    expires_at: null,
    submit: false,
    warning: false,
    chars_left: 140,
    max_char: 140,
    offline: false,
  };

  componentDidMount = () => {
    if (!this.props.isSignedIn || !this.props.currentUser) {
      history.push('/');
    } else if (this.props.verified === 'false') {
      history.push('/verify');
    }
    document.body.style.backgroundColor = "#f2f2f2";
  };

  enterText = event => {
    const charCount = event.target.value.length;
    const maxChar = this.state.max_char;
    const charLength = maxChar - charCount;
    this.setState({
      content: event.target.value,
      chars_left: charLength
    });
  };

  recordSound = (blob, url) => {
    this.setState({ audioURL: url, audioBlob: blob });
  };

  recordDecibels = db => {
    this.setState({ decibels: db });
  };

  onSubmit = async () => {
    this.setState({ submit: true });
    const data = new FormData();
    const file = new File([this.state.audioBlob], 'filename.webm');
    data.append('audio', file);
    data.append('content', this.state.content);
    data.append('angry_score', this.state.decibels);
    try {
      await toh
        .post('/p/upload', data, {
          headers: {
            'Content-Type':
              'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW',
            Authorization: 'Bearer ' + this.props.currentUser //the token is a variable which holds the token
          },
          timeout: 30000
        })
        .then(data => {
          console.log(data);
        });
      history.push('/home');
    } catch (e) {
      console.log(e.response);
      if (e.response.status === 401) {
        this.props.signOut();
      }
    }
  };

  toggleBackward = () => {
    if (this.state.stage === 0) {
      history.push('/home');
    } else if (this.state.stage === 1) {
      this.setState({ stage: 0 });
    } else {
      this.setState({ stage: 1 });
    }
  };

  toggleForward = () => {
    if (this.state.stage === 0) {
      if (!this.state.content) {
        this.setState({ warning: true });
      } else {
        this.setState({ stage: 1 });
      }
    } else if (this.state.stage === 1) {
      this.setState({ stage: 2 });
    }
  };

  renderComponent = () => {
    if (!this.state.submit) {
      if (this.state.stage === 0) {
        return (
          <>
            <TextEntry
              enterText={this.enterText}
              content={this.state.content}
              toggleForward={this.toggleForward}
              characterCount={this.state.chars_left}
            />
            {this.state.warning ? (
              <p style={{ color: 'red' }}>You need to enter something!</p>
            ) : (
                <></>
              )}
          </>
        );
      } else if (this.state.stage === 1) {
        return (
          <SoundEntry
            recordSound={this.recordSound}
            recordDecibels={this.recordDecibels}
            toggleForward={this.toggleForward}
          />
        );
      } else if (this.state.stage === 2) {
        return (
          <Confirmation
            submit={this.onSubmit}
            toggleBackward={this.toggleBackward}
            audioURL={this.state.audioURL}
            content={this.state.content}
            decibels={this.state.decibels}
          />
        );
      }
    } else if (this.state.offline) {
      return <div>You're currently offline, but your vent will be added once you reconnect.</div>
    } else {
      return <div>Loading...</div>;
    }
  };

  render() {
    return (
      <div className="d-flex flex-column align-items-center">
        <div className="container pb-4">
          <div className="d-flex flex-column visible">
            <div className="d-flex justify-content-between align-items-center mt-3">
              <i
                onClick={() => this.toggleBackward()}
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

        {this.renderComponent()}
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

export default connect(mapStateToProps)(PointCreator);
