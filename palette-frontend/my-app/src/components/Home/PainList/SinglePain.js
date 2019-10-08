import React from 'react';
import { connect } from 'react-redux';
import toh from '../../../apis/toh';
import { Event } from '../../Tracking/index';

class SinglePain extends React.Component {
  state = {
    type: this.props.type,
    id: this.props.id,
    deleted: false,
    angry_score: null,
    content: null,
    created_at: null,
    time_remaining: null,
    sound: null,
    loading: false,
    offlineAndUncached: false,
    rageMeter: [
      'https://res.cloudinary.com/dwbg1zcql/image/upload/v1569568526/flame_1_y64ptx.svg',
      'https://res.cloudinary.com/dwbg1zcql/image/upload/v1569568525/flame_2_reymoh.svg',
      'https://res.cloudinary.com/dwbg1zcql/image/upload/v1569568523/flame_3_gboumg.svg',
      'https://res.cloudinary.com/dwbg1zcql/image/upload/v1569568523/flame_4_hd8ra6.svg',
      'https://res.cloudinary.com/dwbg1zcql/image/upload/v1569568525/flame_5_anyvwh.svg'
    ],
    archiveRageMeter: [
      'https://res.cloudinary.com/dwbg1zcql/image/upload/v1569568523/bwflame_1_g2xwdm.svg',
      'https://res.cloudinary.com/dwbg1zcql/image/upload/v1569568523/bwflame_2_peeey2.svg',
      'https://res.cloudinary.com/dwbg1zcql/image/upload/v1569568525/bwflame_3_emqh6h.svg',
      'https://res.cloudinary.com/dwbg1zcql/image/upload/v1569568523/bwflame_4_ssrosa.svg',
      'https://res.cloudinary.com/dwbg1zcql/image/upload/v1569568523/bwflame_5_jdxlhv.svg'
    ]
  };

  componentDidMount = async () => {
    this.setState({ loading: true });
    const condition = navigator.onLine ? 'online' : 'offline';
    if (condition === 'online') {
      try {
        const response = await toh.get('/p/' + this.state.id, {
          headers: {
            Authorization: 'Bearer ' + this.props.currentUser //the token is a variable which holds the token
          }
        });
        if (response.data.success) {
          await this.setState({
            angry_score: response.data.data[0].angry_score,
            content: response.data.data[0].content,
            created_at: response.data.data[0].created_at,
            time_remaining: response.data.data[0].time_remaining,
            sound: response.data.data[0].audio_url,
            loading: false
          });
        }
      } catch (e) {
        console.log(e.response);
        if (e.response.status === 401) {
          this.props.signOut();
        }
      }
    } else if (condition === 'offline') {
      const localPain = JSON.parse(localStorage.getItem('pain_list'));
      if (localPain !== null) {
        const response = localPain.filter(data => data.id === this.state.id);
        console.log(response);
        if (response !== null) {
          await this.setState({
            angry_score: response[0].angry_score,
            content: response[0].content,
            created_at: response[0].created_at,
            time_remaining: response[0].time_remaining,
            sound: response[0].audio_url,
            loading: false
          });
        } else {
          this.setState({ offlineAndUncached: true, loading: false });
        }
      } else {
        this.setState({ offlineAndUncached: true, loading: false });
      }
    }
  };

  playSound = sound => {
    // write function here.
    alert('playing sound');
  };

  deletePoint = async () => {
    try {
      const response = await toh.delete('/p/' + this.state.id, {
        headers: {
          Authorization: 'Bearer ' + this.props.currentUser //the token is a variable which holds the token
        }
      });
      if (response.data.success === true) {
        await this.setState({ deleted: true });
        Event("Post", "Deletion", "");
      }
    } catch (e) {
      console.log(e.response);
      if (e.response.status === 401) {
        this.props.signOut();
      }
    };
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
    if (this.state.type === 0) {
      rageImg = this.state.rageMeter[index];
    } else {
      rageImg = this.state.archiveRageMeter[index];
    }
    return (
      <div className="thumbnail">
        <img src={rageImg} className="img" alt="" />
        <p className="caption">{parseInt(rage)}</p>
      </div>
    );
  };

  renderComponent = () => {
    let created_at = new Date(this.state.created_at);
    let month = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];

    let formattedDay = created_at.getDate();
    let formattedMonth = month[created_at.getMonth()].slice(0, 3);

    return (
      <div className="d-flex flex-column">
        <div className="container d-flex flex-column justify-content-center align-items-center visible">
          <div className="row confirmation-card">
            <div className="col-3 d-flex justify-content-center align-self-center">
              {this.rageMeter(this.state.angry_score)}
            </div>
            <div className="col-9 d-flex flex-column align-items-start justify-content-center">
              <h6 className="card-subtitle mb-2 text-muted">
                Created on {formattedDay} {formattedMonth}
              </h6>
              <span>{this.state.content}</span>
            </div>
          </div>
          <div className="mt-4">
            <audio controls src={this.state.sound} />
          </div>

          <div className="mt-4 d-flex flex-column justify-content-center align-items-center visible">
            <img
              src="https://res.cloudinary.com/dwbg1zcql/image/upload/v1569514447/mascot2_b6x4tv.svg"
              className="img-fluid sound-entry-img mt-4 mb-4"
              alt="Mascot"
            />

            <h5>Do you need a chill pill?</h5>
            <h5>None for you.</h5>

            <span
              className="text-muted mt-5"
              onClick={() => {
                if (
                  window.confirm('Are you sure you wish to delete this item?')
                )
                  this.deletePoint();
              }}
            >
              delete me...?
            </span>
          </div>
        </div>
      </div>
    );
  };

  render() {
    if (this.state.loading) {
      return (
        <div className="pain-list">
          <br />
          <h4>Loading...</h4>
        </div>
      );
    } else if (this.state.deleted) {
      return (
        <div className="pain-list d-flex flex-column align-items-center justify-content-center">
          <p class="lead">You have deleted this post.</p>
        </div>
      );
    }
    return <>{this.renderComponent()}</>;
  }
}

const mapStateToProps = state => {
  return {
    currentUser: state.auth.currentUser,
    isSignedIn: state.auth.isSignedIn,
    verified: state.auth.verified
  };
};

export default connect(mapStateToProps)(SinglePain);
