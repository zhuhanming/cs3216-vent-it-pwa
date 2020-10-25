import React from 'react';
import '../Main.css';
import { connect } from 'react-redux';
import history from '../../history';
import {Event} from '../Tracking/index';

class Page extends React.Component {
  state = {
    stage: 0,
  }

  componentDidMount = () => {
    new Image().src = "https://res.cloudinary.com/dwbg1zcql/image/upload/v1569514447/mascot2_b6x4tv.svg".fileName;
    new Image().src = "https://res.cloudinary.com/dwbg1zcql/image/upload/v1569514446/eye_qbu5er.svg".fileName;
    new Image().src = "https://res.cloudinary.com/dwbg1zcql/image/upload/v1569568527/mascot_2_uqednc.svg".fileName;
    requestAnimationFrame(() => {
      // Firefox will sometimes merge changes that happened here
      requestAnimationFrame(() => {
        let curr = document.getElementById("stage0");
        curr.classList.toggle("invisible");
      });
    });

  }

  welcomeBack = () => {
    return <div id="stage0" className="landing d-flex flex-column justify-content-center align-items-center visible invisible">
      <img src="https://res.cloudinary.com/dwbg1zcql/image/upload/v1569514447/mascot2_b6x4tv.svg" className="img-fluid landing-img mt-4 mb-4" alt="Mascot" />
      <h5 className="landing-text mb-5">
        You're already logged in. Click below to resume your session.
      </h5>
      <button onClick={() => {Event('User','Login','Resume session');this.nextPage();}} className="btn btn-vent pr-4 pl-4 pt-1 pb-1"><h2>RESUME VENT</h2></button>
    </div>
  }

  nextPage = () => {
    let currEle = "stage" + this.state.stage;
    let curr = document.getElementById(currEle);
    curr.classList.toggle("invisible");
    const nextPageNo = this.state.stage + 1;
    if (nextPageNo === 3 || (this.props.currentUser && this.props.isSignedIn)) {
      setTimeout(
        () => history.push('/login'),
        500
      );
    } else {
      setTimeout(
        () => this.renderNextPage(nextPageNo),
        500
      );
    }

  }

  renderNextPage = async (nextPageNo) => {
    await this.setState({ stage: nextPageNo });
    let currEle = "stage" + this.state.stage;
    let curr = document.getElementById(currEle);
    curr.classList.toggle("invisible");
  }

  renderPage = () => {
    if (this.props.currentUser && this.props.isSignedIn) {
      document.body.style.backgroundColor = "#ffdcd2";
      return <>{this.welcomeBack()}</>
    } else {
      switch (this.state.stage) {
        case 0:
          return <div id="stage0" className="landing d-flex flex-column justify-content-center align-items-center visible invisible">
            <img src="https://res.cloudinary.com/dwbg1zcql/image/upload/v1569514446/eye_qbu5er.svg" alt="Vent Eye" className="img-fluid eye-img mb-2" />
            <h1 className="landing-text">I see</h1>
            <button onClick={() => this.nextPage()} className="btn btn-vent pr-4 pl-4 pt-1 pb-1"><h1 className="pt-1">RED</h1></button>
            <small className="mt-2">&lt;&lt;press RED to get started!&gt;&gt;</small>
          </div>
        case 1:
          document.body.style.backgroundColor = "#ffdcd2";
          return <div id="stage1" className="landing d-flex flex-column justify-content-center align-items-center visible invisible">
            <h5 className="landing-text">
              Name's Red.
              <br />
              Why'd you wake me.
              <br />
              Argh....
            </h5>
            <img src="https://res.cloudinary.com/dwbg1zcql/image/upload/v1569514447/mascot2_b6x4tv.svg" className="img-fluid landing-img mt-4 mb-5" alt="Mascot" />
            <button onClick={() => this.nextPage()} className="btn btn-vent pr-4 pl-4 pt-1 pb-1"><h2 className="pt-1">I WANNA VENT</h2></button>
          </div>
        case 2:
          document.body.style.backgroundColor = "#ffdcd2";
          return <div id="stage2" className="landing d-flex flex-column justify-content-center align-items-center visible invisible">
            <img src="https://res.cloudinary.com/dwbg1zcql/image/upload/v1569568527/mascot_2_uqednc.svg" className="img-fluid landing-img mt-4 mb-4" alt="Mascot" />
            <h5 className="landing-text mb-5">
              Click below to vent out your deepest frustrations with a scream. I should seriously get paid for this.
            </h5>
            <button onClick={() => this.nextPage()} className="btn btn-vent pr-4 pl-4 pt-1 pb-1"><h2 className="pt-1">LET'S VENT</h2></button>
          </div>
        default:
          return <></>
      }
    }
  }
  render() {
    return (
      <div className="container landing">
        {this.renderPage()}
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

export default connect(mapStateToProps)(Page);