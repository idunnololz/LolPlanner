import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import { Scrollbars } from 'react-custom-scrollbars';
import {grey200, grey600} from 'material-ui/styles/colors';
import FlipMove from 'react-flip-move';

import {MuiTheme} from './theme';
import {getItemImage, getChampionImage, getSummonerImage, ItemsLibrary, ChampionsLibrary, SummonersLibrary} from './library.js';

const textViewStyles = {
  underlineStyle: {
    borderColor: grey600,
  },
  underlineFocusStyle: {
    borderColor: MuiTheme.palette.accent1Color,
  },
};

class ChampionView extends Component {
  render() {
    return (
      <div className="champion-view-container">
        <div
          style={{backgroundImage: 'url(' + getChampionImage(this.props.item) + ')'}} 
          className="item"
          onClick={this.props.onClick}/>
      </div>
    );
  }
}

class SummonerView extends Component {
  render() {
    return (
      <RaisedButton 
        backgroundColor="#1A3C42"
        className="item"
        style={{width: '80px', height: '80px'}}
        icon={<img src={getSummonerImage(this.props.item)}/>}
        onClick={this.props.onClick}/>
    );
  }
}

export class ItemView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isHovered: false
    };
  }

  render() {
    return (
      <RaisedButton 
        backgroundColor="#1A3C42"
        className="item"
        style={{width: 68, height: 68, 'min-width': 0}}
        icon={<img src={getItemImage(this.props.item)}/>}
        onClick={this.props.onClick}/>
      );
  }
}

export class ItemPicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: ItemsLibrary.getAllItems()
    };
    this.renderThumb = this.renderThumb.bind(this);
  }

  filter(filter) {
    filter = filter.toLowerCase();
    console.log("Fitlering: " + filter);
    this.setState({items: ItemsLibrary.getAllItems().filter((e) => {
      return e.name.toLowerCase().indexOf(filter) !== -1 || e.colloq.indexOf(filter) !== -1;
    })});
  }

  renderThumb({ style, ...props }) {
      const { top } = this.state;
      const thumbStyle = {
          backgroundColor: '#c9ba9d'
      };
      return (
          <div
              style={{ ...style, ...thumbStyle }}
              {...props}/>
      );
  }

  render() {
    var items = this.state.items;

    return (
        <div className="vertical-content item-picker">
          <header>
            <div className="section-header">
              <h2>Item picker</h2>

              <div className="spacer-1-flex"/>

              <IconButton onClick={this.props.onCloseClicked}>
                <img src={require('./res/ic_close_white_24px.svg')}/>
              </IconButton>
            </div>
            <TextField
              underlineStyle={textViewStyles.underlineStyle}
              underlineFocusStyle={textViewStyles.underlineFocusStyle}
              hintText="Item name"
              onChange={(e, text) => {
                this.filter(text);
              }}
            />
          </header>
          <Scrollbars 
            className="items-container"
            autoHide
            autoHideTimeout={1000}
            autoHideDuration={300}
            renderThumbHorizontal={this.renderThumb}
            renderThumbVertical={this.renderThumb}
            {...this.props}>

            <div className="items-container" duration={300} easing="ease-out">
              {items.map((e) => {
                return (
                  <ItemView 
                    data-tip={e.name}
                    item={e} 
                    key={e.id} 
                    onClick={() => {this.props.onItemSelected(e)}}/>);
              })}
            </div>
          </Scrollbars>
        </div>
    );
  }
}

export class ChampionPicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      champions: ChampionsLibrary.getAllChampions()
    };
    this.renderThumb = this.renderThumb.bind(this);
  }

  filter(filter) {
    this.setState({champions: ChampionsLibrary.getAllChampions().filter((e) => {
      return e.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
    })});
  }

  renderThumb({ style, ...props }) {
      const { top } = this.state;
      const thumbStyle = {
          backgroundColor: '#c9ba9d'
      };
      return (
          <div
              style={{ ...style, ...thumbStyle }}
              {...props}/>
      );
  }

  render() {
    var champions = this.state.champions;

    var title = this.props.startScreen ? "Select a champion" : "Champion picker";

    return (
      <div className={"vertical-content " + (this.props.startScreen ? "start-panel " : "")}>
        <header>
          <div className="section-header">
            <h2>{title}</h2>

            <div className="spacer-1-flex"/>

            <IconButton onClick={this.props.onCloseClicked}>
              <img src={require('./res/ic_close_white_24px.svg')}/>
            </IconButton>
          </div>
          <TextField
            underlineStyle={textViewStyles.underlineStyle}
            underlineFocusStyle={textViewStyles.underlineFocusStyle}
            hintText="Champion name"
            onChange={(e, text) => {
              this.filter(text);
            }}
          />
        </header>
        <Scrollbars 
          className="items-container"
          autoHide
          autoHideTimeout={1000}
          autoHideDuration={300}
          renderThumbHorizontal={this.renderThumb}
          renderThumbVertical={this.renderThumb}
          {...this.props}>

          <FlipMove className="items-container" duration={300} easing="ease-out">
            {champions.map((e) => {
              return (
                <ChampionView 
                  item={e} 
                  key={e.id} 
                  onClick={() => this.props.onItemSelected(e)}/>)
            })}
          </FlipMove>
        </Scrollbars>
      </div>
    )
  }
}

export class SummonerPicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      summoners: SummonersLibrary.getAllSummoners()
    };
    this.renderThumb = this.renderThumb.bind(this);
  }

  filter(filter) {
    this.setState({summoners: SummonersLibrary.getAllSummoners().filter((e) => {
      return e.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
    })});
  }

  renderThumb({ style, ...props }) {
      const { top } = this.state;
      const thumbStyle = {
          backgroundColor: '#c9ba9d'
      };
      return (
          <div
              style={{ ...style, ...thumbStyle }}
              {...props}/>
      );
  }

  render() {
    var summoners = this.state.summoners;

    return (
      <div className="vertical-content">
        <header>
          <div className="section-header">
            <h2>Summoner picker</h2>

            <div className="spacer-1-flex"/>

            <IconButton onClick={this.props.onCloseClicked}>
              <img src={require('./res/ic_close_white_24px.svg')}/>
            </IconButton>
          </div>
          <TextField
            underlineStyle={textViewStyles.underlineStyle}
            underlineFocusStyle={textViewStyles.underlineFocusStyle}
            hintText="Summoner name"
            onChange={(e, text) => {
              this.filter(text);
            }}
          />
        </header>
        <Scrollbars 
          className="items-container"
          autoHide
          autoHideTimeout={1000}
          autoHideDuration={300}
          renderThumbHorizontal={this.renderThumb}
          renderThumbVertical={this.renderThumb}
          {...this.props}>

          <div className="items-container" duration={300} easing="ease-out">
            {summoners.map((e) => {
              return (
                <SummonerView 
                  item={e} 
                  key={e.id} 
                  onClick={() => {this.props.onItemSelected(this.props.index, e)}}/>);
            })}
          </div>
        </Scrollbars>
      </div>
    );
  }
}