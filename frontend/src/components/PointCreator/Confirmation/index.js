import React from 'react';
import { connect } from 'react-redux';
import '../../Main.css';
import Button from '../../Home/Button';
import {Event} from '../../Tracking/index';

class Confirmation extends React.Component {
  state = {
    rageMeter: [
      'https://res.cloudinary.com/dwbg1zcql/image/upload/v1569518169/zero_fktuzf.svg',
      'https://res.cloudinary.com/dwbg1zcql/image/upload/v1569518170/one_ecz3qe.svg',
      'https://res.cloudinary.com/dwbg1zcql/image/upload/v1569518170/two_lwbtpj.svg',
      'https://res.cloudinary.com/dwbg1zcql/image/upload/v1569518170/three_hkmb4s.svg',
      'https://res.cloudinary.com/dwbg1zcql/image/upload/v1569518170/four_zvdqlr.svg'
    ]
  };

  rageMeter = rage => {
    let rageImg;
    let index;
    if (rage <= 60) {
      index = 0;
    } else if (rage <= 70) {
      index = 1;
    } else if (rage <= 90) {
      index = 2;
    } else if (rage <= 100) {
      index = 3;
    } else {
      index = 4;
    }
    rageImg = this.state.rageMeter[index];
    return (
      <div className="thumbnail">
        <img src={rageImg} className="img" alt="" />
        <p className="caption">{parseInt(rage)}</p>
      </div>
    );
  };

  render() {
    return (
      <div className="d-flex flex-column">
        <div className="container d-flex flex-column justify-content-center align-items-center visible">
          <div className="row confirmation-card">
            
              <div className="col-3 d-flex justify-content-center align-self-center">
                {this.rageMeter(this.props.decibels)}
              </div>
              <div className="col-9 d-flex flex-column align-items-start justify-content-center">
                <span>{this.props.content}</span>
              </div>
          
          </div>
          <div className="mt-4">
            <audio controls src={this.props.audioURL} />
          </div>

          <div className="mt-4 d-flex flex-column justify-content-center align-items-center visible">
            <img
              src="https://res.cloudinary.com/dwbg1zcql/image/upload/v1569568525/mascot_5_fd5oix.svg"
              className="img-fluid sound-entry-img mt-4 mb-4"
              alt="Mascot"
            />

            <h5>Do you need a chill pill?</h5>
            <h5>None for you.</h5>
          </div>

          <Button buttonStatus={3} buttonFunction={() => {Event("Post", "Creation", "");this.props.submit();}} />
        </div>
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

export default connect(mapStateToProps)(Confirmation);
