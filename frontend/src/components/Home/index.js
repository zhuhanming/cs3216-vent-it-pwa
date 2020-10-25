import React from 'react';
import { connect } from 'react-redux';
import PainList from './PainList';
import history from '../../history';
import Button from './Button';
import SinglePain from './PainList/SinglePain';
import {Event} from '../Tracking/index';

class Home extends React.Component {
  state = {
    individual: false,
    individual_id: null,
  }

  componentDidMount = () => {
    if (!this.props.isSignedIn || !this.props.currentUser) {
      history.push('/');
    } else if (this.props.verified === "false") {
      history.push('/verify');
    } else {
      document.body.style.backgroundColor = "#f2f2f2";
      new Image().src = "https://res.cloudinary.com/dwbg1zcql/image/upload/v1569513124/logo_q9j2rj.svg".fileName;
      // requestAnimationFrame(() => {
      //   // Firefox will sometimes merge changes that happened here
      //   requestAnimationFrame(() => {
      //     let curr = document.getElementById("message");
      //     curr.classList.toggle("invisible");
      //   });
      // });
    }
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
        <SinglePain id={this.state.individual_id} untoggleIndividual={this.toggleIndividual} type={0}/>
        
      </div>)
    } else {
      return (
        <div className="d-flex flex-column" style={{ height: "100%" }}>
          <div className="container">
            <div className="d-flex flex-column visible">
              <div className="d-flex justify-content-between align-items-center mt-3">
                <i onClick={() => history.push('/archive')} className="far fa-clock btn-icon-vent"></i>
                <img className="logo" src="https://res.cloudinary.com/dwbg1zcql/image/upload/v1569513124/logo_q9j2rj.svg" alt="Vent It Logo" />
                <i onClick={() => history.push('/settings')} className="fas fa-cog btn-icon-vent"></i>
              </div>
            </div>
          </div>
          {/* <PainList sortingType={this.state.sortingType} changeSorting={this.changeSorting} /> */}
          <PainList toggleIndividual={this.toggleIndividual} individual={this.state.individual} individual_id={this.state.individual_id} />
          <Button buttonStatus={0} buttonFunction={() => history.push('/add')} />
        </div>
      );
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

export default connect(mapStateToProps)(Home);