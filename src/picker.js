import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import { Scrollbars } from 'react-custom-scrollbars';
import {grey600} from 'material-ui/styles/colors';
import FlipMove from 'react-flip-move';
import ReactTooltip from 'react-tooltip'

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
        icon={<img alt="Edit" src={getSummonerImage(this.props.item)}/>}
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
        style={{width: 68, height: 68, minWidth: 0}}
        icon={<img alt="Add item" src={getItemImage(this.props.item)}/>}
        onClick={this.props.onClick}/>
      );
  }
}

export class ItemPicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: null,
      items: ItemsLibrary.getAllItems()
    };
    this.renderThumb = this.renderThumb.bind(this);
  }

  filter(filter) {
    filter = filter.toLowerCase();
    console.log("Fitlering: " + filter);
    this.setState({
      filter: filter,
      items: ItemsLibrary.getAllItems().filter((e) => {
        return e.name.toLowerCase().indexOf(filter) !== -1 || e.colloq.indexOf(filter) !== -1;
    })});
  }

  renderThumb({ style, ...props }) {
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

    var recommendationViews;
    var title;
    var recommendations = this.props.recommendations;
    if ((this.state.filter == null || this.state.filter.length === 0) && recommendations != null && recommendations.length > 0) {
      recommendationViews = recommendations.map((e) => {
        console.dir(e);
        var itemIds = e.itemIds;
        return (
          <div>
            <h5>{e.sectionTitle}</h5>
            <div
              className="items-container">
              {itemIds.map((itemId) => {
                var e = ItemsLibrary.getItem(itemId);
                if (e == null) return null;
                return (
                  <div
                    data-tip={e.name}>

                    <ItemView 
                      item={e} 
                      key={e.id} 
                      onClick={() => {this.props.onItemSelected(e)}}/>
                  </div>);
              })}
            </div>
          </div>
        );
      });
      title = 
        <div>
            <h5>All items</h5>
        </div>;
    }

    return (
        <div className="vertical-content item-picker">
          <header>
            <div className="section-header">
              <h2>Item picker</h2>

              <div className="spacer-1-flex"/>

              <IconButton onClick={this.props.onCloseClicked}>
                <img alt="Close" src={require('./res/ic_close_white_24px.svg')}/>
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
            autoHide
            autoHideTimeout={1000}
            autoHideDuration={300}
            renderThumbHorizontal={this.renderThumb}
            renderThumbVertical={this.renderThumb}
            {...this.props}>

            <div>
              {recommendationViews}
              {title}
              <div className="items-container" duration={300} easing="ease-out">
                {items.map((e) => {
                  return (
                  	<div
                    	data-tip={e.name}>

  	                  <ItemView 
  	                    item={e} 
  	                    key={e.id} 
  	                    onClick={() => {this.props.onItemSelected(e)}}/>
                    </div>);
                })}
              </div>
            </div>
          </Scrollbars>

          <ReactTooltip />
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
              <img alt="Close" src={require('./res/ic_close_white_24px.svg')}/>
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
              <img alt="Close" src={require('./res/ic_close_white_24px.svg')}/>
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