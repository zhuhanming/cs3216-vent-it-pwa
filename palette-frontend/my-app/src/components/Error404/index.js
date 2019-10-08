import React from 'react';
import history from '../../history';

class Error404 extends React.Component {
  componentDidMount = () =>{
    document.body.style.backgroundColor = "#ce3b27";
  }
  render() {
    return (
      <div className="container h-100 d-flex flex-column justify-content-center align-self-center text-center">
        <h4>
          Error 404: When even venting is difficult...</h4>
          <br/>
          <a style={{textDecoration:"underline"}} onClick={() => history.push('/')}>Click here to return home</a>
      </div>
    )
  }

}

export default Error404;