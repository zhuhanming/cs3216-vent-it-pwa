import React from 'react';
import { connect } from 'react-redux';
import '../../Main.css';
import { ReactMic } from 'react-mic';
import Button from '../../Home/Button';
import Countdown from 'react-countdown-now';

class SoundEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      record: false,
      countdownApi: null,
      countdownTimer: Date.now() + 5000
    };
  }

  startRecording = () => {
    if (!this.state.record) {
      this.setState(
        {
          record: true
        },
        () => this.state.countdownApi && this.state.countdownApi.start()
      );
    }

    console.log('Start recording clicked');
    //setTimeout(() => this.stopRecording(), 5000); //TODO: dont delete this first.
  };

  stopRecording = () => {
    this.setState({
      record: false
    });
    console.log('stop recording clicked');
  };

  onStop = recordedBlob => {
    console.log('recordedBlob is: ', recordedBlob);
    getDecibels(recordedBlob.blob, this.recordDecibels);
    this.props.recordSound(recordedBlob, recordedBlob.blobURL);
    this.props.toggleForward();
  };

  recordDecibels = db => {
    this.props.recordDecibels(db);
    console.log('Max Decibels: ', db);
  };

  renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      return <span>00:00</span>;
    } else {
      return (
        <span>
          0{minutes}:0{seconds}
        </span>
      );
    }
  };

  setRef = countdown => {
    if (countdown) {
      this.setState({
        countdownApi: countdown.getApi()
      });
    }
  };

  render() {
    return (
      <div className="container pain-list d-flex flex-column">
        <div className="container card-orange d-flex flex-column justify-content-center align-items-center visible">
          <div className="mt-4 mb-4 sound-entry-text">
            <h2>TAP & SCREAM!</h2>
          </div>
          <div className="container card-white d-flex flex-column justify-content-center align-items-center visible">
            <img
              src="https://res.cloudinary.com/dwbg1zcql/image/upload/v1569568526/mascot_4_df4fth.svg"
              className="img-fluid sound-entry-img mt-4 mb-4"
              alt="Mascot"
            />
            <Countdown
              ref={this.setRef}
              autoStart={false}
              date={this.state.countdownTimer}
              renderer={this.renderer}
              onComplete={() => this.stopRecording()}
            />
            
            <ReactMic
              record={this.state.record}
              className="sound-wave"
              onStop={this.onStop}
              strokeColor="#000000"
              backgroundColor="#ffffff"
              mimeType="audio/wav"
            />
          </div>
        </div>

        <Button buttonStatus={2} buttonFunction={this.startRecording} />
      </div>
    );
  }
}

function getDecibels(recordedBlob, callbackFn) {
  // Calls callbackFn(decibel) once finished
  var blobReader = new FileReader();
  blobReader.onload = readLoadedData;
  blobReader.readAsArrayBuffer(recordedBlob);
  function readLoadedData() {
    var arrayBuffer = blobReader.result;
    var audioContext = new AudioContext();
    audioContext.decodeAudioData(arrayBuffer, processDecodedData);
  }
  function processDecodedData(decodedData) {
    var typedArray = new Float32Array(decodedData.length);
    var maxAmpl = 0;
    for (var i = 0; i < decodedData.numberOfChannels; i++) {
      typedArray = decodedData.getChannelData(i);
      typedArray.forEach(sample => {
        maxAmpl = Math.max(maxAmpl, Math.abs(sample));
      });
    }
    callbackFn(90*maxAmpl + 30);
  }
}

const mapStateToProps = state => {
  return {
    currentUser: state.auth.currentUser,
    isSignedIn: state.auth.isSignedIn,
    verified: state.auth.verified
  };
};

export default connect(mapStateToProps)(SoundEntry);
