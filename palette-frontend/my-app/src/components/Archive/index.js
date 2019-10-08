import React from 'react';
import { connect } from 'react-redux';
import { signOut } from '../../actions';
import LongText from '../Home/PainList/LongText';
import toh from '../../apis/toh';
import history from '../../history';
import SinglePain from '../Home/PainList/SinglePain';
import {Event} from '../Tracking/index';


class Archive extends React.Component {
  state = {
    archive: [],
    loading: false,
    rageMeter: [
      'https://res.cloudinary.com/dwbg1zcql/image/upload/v1569568523/bwflame_1_g2xwdm.svg',
      'https://res.cloudinary.com/dwbg1zcql/image/upload/v1569568523/bwflame_2_peeey2.svg',
      'https://res.cloudinary.com/dwbg1zcql/image/upload/v1569568525/bwflame_3_emqh6h.svg',
      'https://res.cloudinary.com/dwbg1zcql/image/upload/v1569568523/bwflame_4_ssrosa.svg',
      'https://res.cloudinary.com/dwbg1zcql/image/upload/v1569568523/bwflame_5_jdxlhv.svg'
    ],
    offlineAndUncached: false,
    individual: false,
  }

  componentDidMount = async () => {
    if (!this.props.isSignedIn || !this.props.currentUser) {
      history.push('/');
    } else if (this.props.verified === "false") {
      history.push('/verify');
    }
    document.body.style.backgroundColor = "#f2f2f2";
    this.setState({ loading: true });
    const condition = navigator.onLine ? 'online' : 'offline';
    if (condition === 'online') {
      try{
        const response = await toh.get('/p/archived', {
          headers: {
            Authorization: 'Bearer ' + this.props.currentUser //the token is a variable which holds the token
          }
        });
        if (response.data.success) {
          await this.setState({ archive: response.data.data, loading: false });
          localStorage.setItem("archive", JSON.stringify(response.data.data));
        }
      }catch (e){
        console.log(e.response);
        if (e.response.status===401){
          this.props.signOut();
        }
      }
    } else if (condition === 'offline') {
      const localArchive = JSON.parse(localStorage.getItem("archive"));
      if (localArchive !== null) {
        await this.setState({ archive: localArchive, loading: false });
      } else {
        this.setState({ offlineAndUncached: true, loading: false });
      }
    }
    // outdated test cases below
    // const response = {
    //   data: [{ id: 0, created_at: 'December 17, 1995 03:24:00', content: 'Omg life sucks, why is this happening to me, sighs sighs sighs', sound: '', decibel: 68 },
    //   { id: 1, created_at: 'December 17, 1995 03:24:00', content: 'Omg life sucks, why is this happening to me, sighs sighs sighs. Omg life sucks, why is this happening to me, sighs sighs sighs.', audio_url: '', angry_score: 85 },
    //   { id: 2, created_at: 'December 10, 1995 03:24:00', content: 'Omg life sucks, why is this happening to me, sighs sighs sighs', audio_url: '', angry_score: 34 },
    //   { id: 3, created_at: 'December 21, 1995 03:24:00', content: 'Omg life sucks, why is this happening to me, sighs sighs sighs', audio_url: '', angry_score: 24 },
    //   { id: 4, created_at: 'December 12, 1995 03:24:00', content: 'Omg life sucks, why is this happening to me, sighs sighs sighs', audio_url: '', angry_score: 64 },
    //   { id: 5, created_at: 'December 13, 1995 03:24:00', content: 'Omg life sucks, why is this happening to me, sighs sighs sighs', audio_url: '', angry_score: 56 },
    //   { id: 6, created_at: 'November 17, 1995 03:24:00', content: 'Omg life sucks, why is this happening to me, sighs sighs sighs', audio_url: '', angry_score: 45 },
    //   { id: 7, created_at: 'November 27, 1995 03:24:00', content: 'Omg life sucks, why is this happening to me, sighs sighs sighs', souaudio_urlnd: '', angry_score: 24 },]
    // };
    // const response = { data: [] }; // empty test case
    this.sortArchive();
  }


  sortArchive = () => {
    let temp = this.state.archive.slice();
    temp.sort((a, b) => ((new Date(a.created_at)).getTime() > (new Date(b.created_at)).getTime()) ? -1 : 1);
    this.setState({ archive: temp });
  }

  rageMeter = (rage) => {
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
    return <div className="thumbnail">
      <img src={rageImg} className="img" alt="" />
      <p className="caption">{rage}</p>
    </div>
  }


  renderList = () => {
    if (this.state.offlineAndUncached) {
      return <div className="text-center p-3">
        <br /><h4>You are offline!</h4></div>
    }
    if (this.state.loading) {
      return <div className="text-center p-3">
        <br /><h4>Loading...</h4></div>
    }
    if (this.state.archive.length === 0) {
      return <div className="text-center p-3">
        <h3>You have no records in your archive.</h3>
        <p className="mb-0">Click the + button at the homescreen to get started</p>
      </div>
    }
    return this.state.archive.map(record => {
      let created_at = new Date(record.created_at);
      let month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

      let formattedDay = created_at.getDate();
      let formattedMonth = month[created_at.getMonth()].slice(0, 3);

      return (
        <li key={record.id} className="list-group-item item" onClick={() => this.toggleIndividual(record.id)}>
          <div className="row mb-2 pt-2">
            <div className="col-3 d-flex justify-content-center">
              {/* <h3 className="pain-content align-self-center mb-0" > */}
              {/* {parseInt(painPoint.angry_score)} */}
              {this.rageMeter(record.angry_score)}
              {/* </h3> */}
            </div>
            <div className="col-9 d-flex flex-column align-items-start justify-content-center" >
              <div style={{ minWidth: "100%" }}>
                <LongText content={record.content} limit={45} />
              </div>
              <div className="font-italic ">
                <small>Created on {formattedDay} {formattedMonth}</small>
              </div>
            </div>
          </div>
        </li>
      );
    })
  }


  toggleIndividual = (id) => {
    if (!this.state.individual) {
      this.setState({ individual: true, individual_id: id });
      Event("Post", "Individual retrieval", "");
    } else {
      if (id) {
        this.setState({ individual: false });
        window.location.reload();
      } else {
        this.setState({ individual: false });
      }
    }
  }

  render() {
    if (this.state.individual) {
      return (<div className="d-flex flex-column" style={{ height: "100%" }}>
        <div className="container">
          <div className="d-flex flex-column visible">
            <div className="d-flex justify-content-between align-items-center mt-3">
              <i onClick={() => this.toggleIndividual()} className="fas fa-chevron-left btn-icon-vent"></i>
              <img className="logo" src="https://res.cloudinary.com/dwbg1zcql/image/upload/v1569513124/logo_q9j2rj.svg" alt="Vent It Logo" />
              <i className="fas fa-cog btn-icon-vent" style={{ visibility: "hidden" }}></i>
            </div>
          </div>
        </div>
        {/* <PainList sortingType={this.state.sortingType} changeSorting={this.changeSorting} /> */}
        <SinglePain id={this.state.individual_id} untoggleIndividual={this.toggleIndividual} type={1} />
      </div>)
    } else {
      return (
        <div className="d-flex flex-column" style={{ height: "100%" }}>
          <div className="container">
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
          <div className="text-center pt-4 pb-2">
            <h4>Archive</h4></div>
          <ul className="list-group list-group-flush pain-list w-100 mw-100">
            {this.renderList()}
          </ul>
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

export default connect(mapStateToProps, {signOut})(Archive);