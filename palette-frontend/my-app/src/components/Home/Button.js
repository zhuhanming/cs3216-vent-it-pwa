import React from 'react';

function Button(props) {
  if (props.buttonStatus === 0) {
    return (
      <div className="d-flex justify-content-center pb-4 pt-3 button-footer">
        <button className="round-button btn" onClick={() => props.buttonFunction()}><i className="fas fa-plus"></i></button>
      </div>
    )
  } else if (props.buttonStatus===1){
    return (
      <div className="d-flex justify-content-center pb-4 pt-3 button-footer">
        <button className="round-button btn" onClick={() => props.buttonFunction()}><i className="fas fa-arrow-right"></i></button>
      </div>
    )
  } else if (props.buttonStatus===2){
    return (
      <div className="d-flex justify-content-center pb-4 pt-3 button-footer">
        <button className="round-button btn" onClick={() => props.buttonFunction()}><i className="far fa-circle"></i></button>
      </div>
    )
  } else if (props.buttonStatus===3){
    return (
      <div className="d-flex justify-content-center pb-4 pt-3 button-footer">
        <button className="round-button btn" onClick={() => props.buttonFunction()}><i className="fas fa-check"></i></button>
      </div>
    )
  }
}

export default Button;