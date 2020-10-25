import React from 'react';
import Button from '../../Home/Button';

function TextEntry(props){
  
    return (
      <>
        <form className="container">
          <div className="form-group d-flex flex-column align-items-center">
            <div className="container card-orange">
              <textarea
                maxLength="140"
                onChange={e => {
                  props.enterText(e);
                }}

                className="form-control card-textarea"
                id="pain-point"
                type="text"
                placeholder="Start your rant here!"
                rows="5"
              >{props.content}</textarea>
            </div>

            <span>{props.characterCount} characters left</span>
          </div>
        </form>
        <Button buttonStatus={1} buttonFunction={props.toggleForward} />
      </>
    );
  }

export default TextEntry;
