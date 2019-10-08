import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Landing from './components/Landing';
import Home from './components/Home';
import Auth from './components/Auth';
import PointCreator from './components/PointCreator';
import Archive from './components/Archive';
import Settings from './components/Settings';
import SignUp from './components/Auth/SignUp';
import VerifyEmail from './components/VerifyEmail';
import ResendEmail from './components/ResendEmail';
import Error404 from './components/Error404';
import history from '../src/history'
import { PageView, initGA } from './components/Tracking';



import { connect } from 'react-redux';



class App extends React.Component {
  state = {
    confirming: false,
  }
  componentDidMount = async () => {
    initGA('G-0MGFNHCZTY');
    PageView();

    // const condition = navigator.onLine ? 'online' : 'offline';
    // let queue = JSON.parse(localStorage.getItem('upload_queue'));
    // if (condition === 'online' && queue !== null){
    //   console.log(queue);
    //   queue.map(async(data) =>{
    //     await toh
    //     .post(`/p/upload`, data, {
    //       headers: {
    //         'Content-Type':
    //           'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW',
    //         Authorization: 'Bearer ' + this.props.currentUser //the token is a variable which holds the token
    //       },
    //       timeout: 30000
    //     })
    //     .then(data => {
    //       console.log(data);
    //     });
    //   });
    //   localStorage.removeItem('upload_queue');
    //   history.push('/home');
    // }
  }

  render() {
    return (
      <>
        <Router history={history}>
          <Switch>
            <Route path="/" exact component={Landing} />
            <Route path="/login" exact component={Auth} />
            <Route path="/signup" exact component={SignUp} />
            <Route path="/home" exact component={Home} />
            <Route path="/add" exact component={PointCreator} />
            <Route path="/archive" exact component={Archive} />
            <Route path="/settings" exact component={Settings} />
            <Route path="/verify" exact component={ResendEmail} />
            <Route path="/404" exact component={Error404} />
            <Route component={VerifyEmail} />
          </Switch>
        </Router>
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

export default connect(mapStateToProps)(App);
