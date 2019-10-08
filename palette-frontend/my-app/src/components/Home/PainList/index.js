import React from 'react';
import { connect } from 'react-redux';
import toh from '../../../apis/toh';
import '../../Main.css';
import LongText from './LongText';


class PainList extends React.Component {

  state = {
    sortingType: 0,
    painList: [],
    loading: false,
    time_mode: "hours",
    individual: false,
    individual_id: null,
    rageMeter: ['https://res.cloudinary.com/dwbg1zcql/image/upload/v1569568526/flame_1_y64ptx.svg', 'https://res.cloudinary.com/dwbg1zcql/image/upload/v1569568525/flame_2_reymoh.svg', 'https://res.cloudinary.com/dwbg1zcql/image/upload/v1569568523/flame_3_gboumg.svg', 'https://res.cloudinary.com/dwbg1zcql/image/upload/v1569568523/flame_4_hd8ra6.svg', 'https://res.cloudinary.com/dwbg1zcql/image/upload/v1569568525/flame_5_anyvwh.svg'],
    offlineAndUncached: false,
  }

  componentDidMount = async () => {
    this.setState({ loading: true });
    const condition = navigator.onLine ? 'online' : 'offline';
    if (condition === 'online') {
      try {
        const response = await toh.get('/u/feed?filter=time', {
          headers: {
            Authorization: 'Bearer ' + this.props.currentUser //the token is a variable which holds the token
          }
        });
        if (response.data.success) {
          await this.setState({ painList: response.data.data, loading: false });
          localStorage.setItem("pain_list", JSON.stringify(response.data.data));
        }
      } catch (e) {
        console.log(e.response);
        if (e.response.status === 401) {
          this.props.signOut();
        }
      }
    } else if (condition === 'offline') {
      const localPain = JSON.parse(localStorage.getItem("pain_list"));
      if (localPain !== null) {
        await this.setState({ painList: localPain, loading: false });
      } else {
        this.setState({ offlineAndUncached: true, loading: false });
      }
    }
    this.sortPainList();
  }

  sortPainList = () => {
    if (this.state.sortingType === 0) {
      let temp = this.state.painList.slice();
      temp.sort((a, b) => (parseInt(a.angry_score) > parseInt(b.angry_score)) ? -1 : 1);
      this.setState({ painList: temp });
    } else {
      let temp = this.state.painList.slice();
      temp.sort((a, b) => ((new Date(a.created_at)).getTime() > (new Date(b.created_at)).getTime()) ? -1 : 1);
      this.setState({ painList: temp });
    }
  }

  changeSort = async () => {
    if (this.state.sortingType === 0) {
      await this.setState({ sortingType: 1 })
    } else {
      await this.setState({ sortingType: 0 })
    }
    this.sortPainList();
  }

  toggleIndividual = (id) => {
    this.props.toggleIndividual(id);
  }

  buttonSelector = () => {
    if (this.state.sortingType === 0) {
      return <div className="d-flex flex-row justify-content-center mt-4 pb-2 top-bar-vent">
        <button className="btn btn-vent-2 active mr-2">RAGE</button>
        <button className="btn btn-vent-2 ml-2" style={{ backgroundColor: "#e2e2e2" }} onClick={() => this.changeSort()}>DATE</button>
      </div>
    } else {
      return <div className="d-flex flex-row justify-content-center mt-4 pb-2 top-bar-vent">
        <button className="btn btn-vent-2 mr-2" style={{ backgroundColor: "#e2e2e2" }} onClick={() => this.changeSort()}>RAGE</button>
        <button className="btn btn-vent-2 active ml-2">DATE</button>
      </div>
    }
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
    if (this.state.painList.length === 0) {
      return <div className="text-center p-3">
        <h3>You haven't added any pain points yet!</h3>
        <p className="mb-0">Click the + button below to get started</p>
      </div>
    }
    return (
      <>
        {this.state.painList.map(painPoint => {
          let created_at = new Date(painPoint.created_at);
          let expires_at = new Date(painPoint.time_remaining);
          // let month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

          // let formattedDay = created_at.getDate();
          let formattedExpiry = expires_at.getTime() - created_at.getTime();
          let formattedExpiryInDays = Math.ceil(formattedExpiry / (1000 * 3600 * 24));
          // let formattedMonth = month[created_at.getMonth()].slice(0, 3);

          return (
            <li key={painPoint.id} className="list-group-item item" onClick={() => this.toggleIndividual(painPoint.id)}>
              <div className="row mb-2 pt-2">
                <div className="col-3 d-flex justify-content-center">
                  {/* <h3 className="pain-content align-self-center mb-0" > */}
                  {/* {parseInt(painPoint.angry_score)} */}
                  {this.rageMeter(painPoint.angry_score)}
                  {/* </h3> */}
                </div>
                <div className="col-9 d-flex flex-column align-items-start justify-content-center" >
                  <div style={{ minWidth: "100%" }}>
                    <LongText content={painPoint.content} limit={45} />
                  </div>
                  <div className="font-italic ">
                    <small>{formattedExpiryInDays} days left</small>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </>)
  }

  render() {
    return (
      <>
        {this.buttonSelector()}
        <ul className="list-group list-group-flush pain-list w-100 mw-100">
          {this.renderList()}
        </ul>
      </>
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

export default connect(mapStateToProps)(PainList);