import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import IconButton from 'material-ui/IconButton';
import { toast } from 'react-toastify';

export class Settings extends Component {
  render() {
    return ( 
      <div className="vertical-content">
        <header>
          <div className="section-header">
            <h2>Settings</h2>

            <div className="spacer-1-flex"/>

            <IconButton onClick={this.props.onCloseClicked}>
              <img alt="Close" src={require('./res/ic_close_white_24px.svg')}/>
            </IconButton>
          </div>
        </header>
        <Scrollbars className="items-container">
          <div className="settings-container" duration={300} easing="ease-out">
            <a onClick={() => toast("Please contact the Make a Wish foundation.")}>Unleash level 9000 teemo</a>
            <a>About</a>
          </div>
        </Scrollbars>
      </div>
      );
  }
}