import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import {grey200, grey600} from 'material-ui/styles/colors';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import RaisedButton from 'material-ui/RaisedButton';
import FlipMove from 'react-flip-move';
import {ItemsLibrary, ChampionsLibrary, SummonersLibrary} from './library.js';
import TextField from 'material-ui/TextField';
import {getItemImageFor, getChampionImageFor, getSummonerImageFor} from './res_helper.js';
import { Scrollbars } from 'react-custom-scrollbars';
import Build from './build.js';
import Measure from 'react-measure'
import FloatingActionButton from 'material-ui/FloatingActionButton';
import IconButton from 'material-ui/IconButton';
import { ToastContainer, toast } from 'react-toastify';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import ReactTooltip from 'react-tooltip'

const muiTheme = getMuiTheme({
  palette: {
    textColor: '#fff',
    alternateTextColor: '#000',
    primary1Color: '#0d2f35',
    accent1Color: '#c9ba9d',
    disabledColor: grey600,
    canvasColor: '#0d2f35',
  },
  appBar: {
    height: 50,
  },
});

const STAT_TYPE_DEFAULT = 0;
const STAT_TYPE_PERCENT = 1;

const STAT_DICT = {
  "FlatMovementSpeedMod": ["Movement speed", 0],
  "FlatCoolDownRedMod": ["Cooldown reduction", STAT_TYPE_PERCENT],
  "FlatMagicDamageMod": ["AP", 0],
  "PercentMovementSpeedMod": ["Movement speed modifier", STAT_TYPE_PERCENT],
  "FlatMPRegenMod": ["Increased mana regen. rate", STAT_TYPE_PERCENT],
  "FlatMPPoolMod": ["Mana", 0],
}

const textViewStyles = {
  underlineStyle: {
    borderColor: grey600,
  },
  underlineFocusStyle: {
    borderColor: muiTheme.palette.accent1Color,
  },
};

var getItemImage = function(item) {
  return getItemImageFor(parseInt(item.id));
}
var getChampionImage = function(championId) {
  if (championId["id"] != null) {
    championId = championId["id"];
  }
  return getChampionImageFor(parseInt(championId));
}
var getSummonerImage = function(sumId) {
  if (sumId["id"] != null) {
    sumId = sumId["id"];
  }
  return getSummonerImageFor(parseInt(sumId));
}
var updateUrl = function() {
  window.history.pushState(null, "", "/" + curBuild.toBase64());
}
var canBuildInto = function(item1, item2) {
  if (item1.id === item2.id) return true;
  if (item1.into == null || item1.into.length === 0) return false;
  
  for (let i = 0; i < item1.into.length; i++) {
    var nextItem = ItemsLibrary.getItem(item1.into[i]);
    if (canBuildInto(nextItem, item2)) {
      return true;
    }
  }
  return false;
}

function copyTextToClipboard(text) {
  var textArea = document.createElement("textarea");

  //
  // *** This styling is an extra step which is likely not required. ***
  //
  // Why is it here? To ensure:
  // 1. the element is able to have focus and selection.
  // 2. if element was to flash render it has minimal visual impact.
  // 3. less flakyness with selection and copying which **might** occur if
  //    the textarea element is not visible.
  //
  // The likelihood is the element won't even render, not even a flash,
  // so some of these are just precautions. However in IE the element
  // is visible whilst the popup box asking the user for permission for
  // the web page to copy to the clipboard.
  //

  // Place in top-left corner of screen regardless of scroll position.
  textArea.style.position = 'fixed';
  textArea.style.top = 0;
  textArea.style.left = 0;

  // Ensure it has a small width and height. Setting to 1px / 1em
  // doesn't work as this gives a negative w/h on some browsers.
  textArea.style.width = '2em';
  textArea.style.height = '2em';

  // We don't need padding, reducing the size if it does flash render.
  textArea.style.padding = 0;

  // Clean up any borders.
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';

  // Avoid flash of white box if rendered for any reason.
  textArea.style.background = 'transparent';


  textArea.value = text;

  document.body.appendChild(textArea);

  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Copying text command was ' + msg);
  } catch (err) {
    console.log('Oops, unable to copy');
  }

  document.body.removeChild(textArea);
}

var buildBin = window.location.href.substring(window.location.href.indexOf('/', 9) + 1);
var newBuild = false;

var curBuild;
if (buildBin.length > 0) {
  console.log(buildBin);
  curBuild = Build.fromBase64(buildBin);
} else {
  curBuild = new Build();
  newBuild = true;
}

class ItemView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isHovered: false
    };
  }

  render() {

    // var onHover = () => {
    //   TweenLite.to(logo, 1, {left:"632px"});
    // }

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


class ItemView2 extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isHovered: false
    };
  }

  render() {

    // var onHover = () => {
    //   TweenLite.to(logo, 1, {left:"632px"});
    // }
           
    return (
      <div 
        data-tip
        data-for={"item" + this.props.item.name}>
        <div 
          onMouseEnter={() => {this.setState({isHovered: true})}}
          onMouseLeave={() => {this.setState({isHovered: false})}}
          className="item-outer">

          <div className="item-img-container">
            <img src={getItemImage(this.props.item)}/>
          </div>
          <div 
            className={"a1 " + (this.state.isHovered ? "a1-hover" : "")}
            onClick={() => {this.props.onEditItemClicked()}}>
            <img src={require('./res/ic_edit_white_24px.svg')}/>
          </div>
          <div 
            className={"a2 " + (this.state.isHovered ? "a2-hover" : "")}
            onClick={() => {this.props.onDeleteItemClicked()}}>
            <img src={require('./res/ic_delete_white_24px.svg')}/>
          </div>
        </div>
        <ReactTooltip 
          id={"item" + this.props.item.name}
          effect="solid">
          <div className="rune-tip">{this.props.tip}</div>
        </ReactTooltip>
      </div>
    );
  }
}

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

class ItemPicker extends Component {
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
        <div className="side-panel item-picker">
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

class ChampionPicker extends Component {
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
        <div className={"side-panel " + (this.props.startScreen ? "start-panel " : "")}>
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

class SummonerPicker extends Component {
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
        <div className="side-panel">
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

class ItemBuildStats extends Component {

  getComponentsForStats(stats) {
    var elems = [];
              
    let i = 0;
    for (var key in stats) {
      var dictVal = STAT_DICT[key];
      var str = dictVal == null ? key : dictVal[0];
      var stat = stats[key];
      if (dictVal != null) {
        if (dictVal[1] === STAT_TYPE_PERCENT) {
          stat = (stat.toFixed(2) * 100) + "%";
        }
      }

      elems.push(
        <div className={"stat-row " + (i % 2 === 0 ? "even " : "odd ")} key={i++}>
          <span>{str}</span>
          <div className="spacer-1-flex"> </div>
          <span>{stat}</span>
        </div>
        );
    }
    return elems;
  }

  render() {
    var build = curBuild.getItemIds()[0].map((e) => {
      return ItemsLibrary.getItem(e[0]);
    });
    //console.dir(build);

    var stats = {};

    var trinket;
    var finalItems = [];

outer:
    for (let i = 0; i < build.length; i++) {
      var item = build[i];
      if (item.tags.includes("Trinket")) {
        trinket = item;
      } else {
        for (let j = 0; j < finalItems.length; j++) {
          if (canBuildInto(finalItems[j], item)) {
            finalItems.splice(j, 1);
            finalItems.push(item);
            continue outer;
          }
        }
        finalItems.push(item);
        if (finalItems.length > 6) {
          finalItems.splice(0, 1);
        }
      }
    }

    console.dir(finalItems);

    finalItems.forEach((e) => {
      if (e.stats == null) return;

      for (var key in e.stats) {
        if (stats[key] == null) {
          stats[key] = 0;
        }
        stats[key] += e.stats[key];
      }
    })
    console.dir(stats);

    return ( 
      <div className="side-panel">
        <header>
          <div className="section-header">
            <h2>Build stats</h2>

            <div className="spacer-1-flex"/>

            <IconButton onClick={this.props.onCloseClicked}>
              <img src={require('./res/ic_close_white_24px.svg')}/>
            </IconButton>
          </div>
        </header>
        <Scrollbars className="items-container">
          <div className="stats-container" duration={300} easing="ease-out">
            {this.getComponentsForStats(stats)}
            <h3>Final items</h3>
            <div className="final-items-container">
              {finalItems.map((e) => {
                return (
                  <ItemView 
                    item={e} 
                    key={e.id}
                    onClick={() => {console.dir(e);}}/>);
              })}
            </div>
          </div>
        </Scrollbars>
      </div>
      );
  }
}

class Settings extends Component {

  render() {

    return ( 
      <div className="side-panel">
        <header>
          <div className="section-header">
            <h2>Settings</h2>

            <div className="spacer-1-flex"/>

            <IconButton onClick={this.props.onCloseClicked}>
              <img src={require('./res/ic_close_white_24px.svg')}/>
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

class ItemBuild extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    var cost = 0;

    var startingItems = [];
    var items = [];

    this.props.items[0].forEach((itemModel, index) => {
      var item = ItemsLibrary.getItem(itemModel[0]);
      cost += item.gold.total;
      var isStartingItem = false;

      if (cost <= 500) {
        startingItems.push(
          <ItemView2
            tip={item.name}
            item={item} 
            key={itemModel[1]}
            onEditItemClicked={() => {this.props.onEditItemClicked(index)}}
            onDeleteItemClicked={() => {curBuild.deleteItem(0, index)}}/>
          );
      } else {
        items.push(
          <ItemView2
            tip={item.name}
            item={item} 
            key={itemModel[1]}
            onEditItemClicked={() => {this.props.onEditItemClicked(index)}}
            onDeleteItemClicked={() => {curBuild.deleteItem(0, index)}}/>
          );
      }
    })

    return (
      <FlipMove
        duration={250} easing="ease-out"
        className="item-build">

        {startingItems.length === 0 ? null : 
          <FlipMove
            duration={250} 
            easing="ease-out" 
            className="starting-items">
            {startingItems}
            <p>STARTING</p>
          </FlipMove>}

        {items}

        <div className="add-item-outer">
          <RaisedButton
            style={{height: 80, width: 80, 'min-width': 0}}
            primary={true} 
            icon={<img src={require('./res/ic_add_white_24px.svg')}/>}
            onClick={() => this.props.onAddItemClicked()}/>
        </div>
      </FlipMove>
      );
  }
}

class SkillBuild extends Component {

  constructor(props) {
    super(props);

    this.state = {
      dimensions: {
        width: -1,
        height: -1
      }
    };
    console.dir(props);
    this.props.skillSequence[0];
  }

  validateSkillSeq(skillSeq) {
    var totals = [0, 0, 0, 0];

    for (let i = 0; i < skillSeq.length; i++) {
        if (skillSeq[i] >= 0) {
          totals[skillSeq[i]]++;
        }
    }

    if (totals[0] > 5 || totals[1] > 5 || totals[2] > 5 || totals[3] > 3) {
      return "Invalid skill sequence";
    }

    return null;
  }

  makeElemWithWidth(width, error) {
    var skillSeq = this.props.skillSequence;

    var rows = 5;
    var columns = 19;

    width -= columns * 1; // 1 margin between items
    width = Math.floor(width / columns);

    var keys = ["q", "w", "e", "r"];

    var elems = [];
    var i;

    for (i = 0; i < rows*columns; i++) {
      var text = "";
      var onClickListener = null;
      let coord = {x: (i % columns - 1), y: (Math.floor(i / columns) - 1)};

      if (i % columns == 0 && i/columns > 0) {
        // first column
        text = keys[i/columns - 1];
      } else if (i !==0 && i < columns) {
        text = i + "";
      } else {
        onClickListener = function(e) {
          skillSeq[this.x] = this.y;
          curBuild.setSkillSequence(skillSeq);
        }.bind(coord);
      }

      let content = null;
      if (coord.x >= 0 && coord.y >= 0 && skillSeq[coord.x] === coord.y) {
        content = (
          <div className="skill-marked"/>
          );
      }

      var level = Math.floor(i % columns);
      var ultLevel = level === 6 || level === 11 || level === 16;

      elems.push(
        <div 
          className={"skill-cell " + (ultLevel ? "ult-cell " : "") + (error ? "error-cell " : "")}  
          key={i} 
          style={{width: width}} 
          onClick={onClickListener}>
          {text}
          {content}
        </div>
        );
    }

    return elems;
  }

  render() {
    var skillSeq = this.props.skillSequence;
    const { width, height } = this.state.dimensions

    var error = this.validateSkillSeq(skillSeq);

    var errorText;
    if (error) {
      errorText = (
        <span className="error">{error}</span>
      )
    }

    return (
      <FlipMove
        duration={250} easing="ease-out">

        <Measure
          bounds
          onResize={(contentRect) => {
            this.setState({ dimensions: contentRect.bounds })
          }}
        >
          {({ measureRef }) =>
            <div ref={measureRef} className="skill-build">
              {this.makeElemWithWidth(width, error)}
            </div>
          }
        </Measure>

        {errorText}
      </FlipMove>
      );
  }
}

class SummonerBuild extends Component {

  render() {
    var sumIds = this.props.sums;
    var sum0Component;
    var sum1Component;

    if (sumIds[0] >= 0) {
      sum0Component = 
        <div className="selected-sum-container">
          <RaisedButton
            className="selected-sum"
            style={{width: 64, height: 64, 'min-width': 0}}
            primary={true} 
            icon={<img src={getSummonerImage(sumIds[0])} className="sum-icon"/>}
            onClick={() => this.props.onEditItemClicked(0)} />
        </div>
    } else {
      sum0Component = 
        <div className="selected-sum-container">
          <RaisedButton
            style={{width: 64, height: 64, 'min-width': 0}}
            primary={true} 
            icon={<img src={require('./res/ic_edit_white_24px.svg')}/>}
            onClick={() => this.props.onEditItemClicked(0)} />
        </div>
    }

    if (sumIds[1] >= 0) {
      sum1Component = 
        <div className="selected-sum-container">
          <RaisedButton
            className="selected-sum"
            style={{width: 64, height: 64, 'min-width': 0}}
            primary={true} 
            icon={<img src={getSummonerImage(sumIds[1])} className="sum-icon"/>}
            onClick={() => this.props.onEditItemClicked(1)} />
        </div>
    } else {
      sum1Component = 
        <div className="selected-sum-container">
          <RaisedButton
            style={{width: 64, height: 64, 'min-width': 0}}
            primary={true} 
            icon={<img src={require('./res/ic_edit_white_24px.svg')}/>}
            onClick={() => this.props.onEditItemClicked(1)} />
        </div>
    }

    return (
      <div class="sums-container">
        {sum0Component}
        <div style={{width: 16}}/>
        {sum1Component}
      </div>);
  }
}

const groupSizes = [5, 3, 3, 3, 3, 4, 3, 3, 3];
const treeTips = [
  [0, [<b>Precision</b>,<p>IMPROVED ATTACKS AND SUSTAINED DAMAGE</p>]],
  [1, [<b>Domination</b>,<p>BURST DAMAGE AND TARGET ACCESS</p>]],
  [2, [<b>Sorcery</b>,<p>EMPOWERED ABILITIES AND RESOURCE MANIPULATION</p>]],
  [3, [<b>Resolve</b>,<p>DURABILITY AND CROWD CONTROL</p>]],
  [4, [<b>Inspiration</b>,<p>CREATIVE TOOLS AND RULE BENDING</p>]],
  ];
const treeSubTips = [
  [
    [
      "Overheal",
      "Triumph",
      "Precense of Mind"
    ],
    [
      "Legend: Alacrity",
      "Legend: Tenacity",
      "Legend: Bloodline"
    ],
    [
      "Coup de Grace",
      "Cut Down",
      "Last Stand"
    ],
  ],
  [[],[],[]],
  [[],[],[]],
  [[],[],[]],
  [[],[],[]]
]
const runesTip = [
  [
    <span><b>Press the attack</b></span>,
    <span><b>Lethal tempo</b></span>,
    <span><b>Fleet footwork</b></span>
  ],
  [
    [], [], [], [], [], [], [], [],
  ],
  [
    [], [], [], [], [], [], [], [],
  ],
  [
    [], [], [], [], [], [], [], [],
  ],
  [
    <span><b>Unsealed Spellbook</b> - Get Summoner Shards and exchange 
    them at the shop to change your Summoner Spells during game. Your 
    Summoner Spells have reduced cooldown.</span>,
    <span><b>Glacial Augment</b> - Your first attack against an enemy champion 
    slows them (per unit cooldown). Slowing champions with active items 
    shoots a freeze ray at them, creating a lingering slow zone.</span>,
    <span><b>Kleptomancy</b> - Your first attack after using an ability 
    grants gold and sometimes consumables.</span>
  ]
];
class RunesBuild extends Component {
  constructor(props) {
    super(props);
  }

  makeGroup(index) {
    var runes = this.props.runes;
    var treeState = runes[0];
    var subTreeState = treeState >= 0 && runes[5] >= 0 ? treeTips.filter((e, i) => {return i != treeState})[runes[5]][0] : -1;

    console.log(`subTreeState: ${subTreeState}`)

    return [...Array(groupSizes[index]).keys()].map((e) => {
      var className = runes[index] === e ? "item-selected" : "item";
      var tip;
      if (index === 0) {
        tip = treeTips[e][1];
      } else if (index === 1) {
        if (treeState >= 0) {
          tip = runesTip[treeState][e];
        } else {
          tip = "Pick a primary rune";
        }
      } else if (index >= 2 && index <= 4) {
        if (treeState >= 0) {
          tip = treeSubTips[treeState][index - 2][e];
        } else {
          tip = "Pick a primary rune";
        }
        //console.log(`ts:${treeState} idx:${index} e:${e}`)
        //tip = treeState >= 0 ? runeTip[treeState][index - 1][e] : null;
      } else if (index === 5) {
        if (treeState >= 0) {
          tip = treeTips.filter((e, i) => {return i != treeState})[e][1];
        } else {
          tip = "Pick a primary rune";
        }
      } else if (index > 5) {
        if (subTreeState >= 0) {
          tip = treeSubTips[subTreeState][index - 6][e];
        } else {
          tip = "Pick a secondary rune";
        }
      } else {
        tip = "Rito pls";
      }
      return (
        <div>
          <div
            data-tip
            data-for={"a" + index + "b" + e}
            className={className} 
            onClick={() => curBuild.setRuneAt(index, e)}/>
          <ReactTooltip id={"a" + index + "b" + e}>
            <div className="rune-tip">{tip}</div>
          </ReactTooltip>
        </div>
        );
    })
  }

  render() {
    var runes = this.props.runes;

    return (
      <div className="runes-container">
        <div>
          <div>
            {this.makeGroup(0)}
          </div>
          <div className="divider"/>
          <div>
            {this.makeGroup(1)}
          </div>
          <div className="divider"/>
          <div>
            {this.makeGroup(2)}
          </div>
          <div className="divider"/>
          <div>
            {this.makeGroup(3)}
          </div>
          <div className="divider"/>
          <div>
            {this.makeGroup(4)}
          </div>
        </div>


        <div style={{width: 16}}/>


        <div>
          <div>
            {this.makeGroup(5)}
          </div>
          <div className="divider"/>
          <div>
            {this.makeGroup(6)}
          </div>
          <div className="divider"/>
          <div>
            {this.makeGroup(7)}
          </div>
          <div className="divider"/>
          <div>
            {this.makeGroup(8)}
          </div>
        </div>
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      panelToShow: 0,
      build: curBuild,
      editingItem: -1,
      confirmDeleteDialogOpen: false,
      newBuild: newBuild
    };

    this.itemPicker = null;

    this.renderThumb = this.renderThumb.bind(this);

    curBuild.addListener({
      onItemsChanged: () => {
        this.setState({build: curBuild});
        updateUrl();
      },
      onSkillSequenceChanged: () => {
        this.setState({build: curBuild});
        updateUrl();
      },
      onRunesChanged: () => {
        this.setState({build: curBuild});
        updateUrl();
      },
      onSummonersChanged: () => {
        this.setState({build: curBuild});
        updateUrl();
      },
      onChampionChanged: () => {
        this.setState({build: curBuild});
        updateUrl();
      }})
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
    var picker;
    var itemPicker;

    var onCloseHandler = () => {
      this.setState({panelToShow: -1});
    }

    if (this.state.panelToShow == 4) {
        picker = 
          <ItemPicker
            onItemSelected={(item) => {curBuild.modifyItem(0, this.state.editingItem, item); this.setState({panelToShow: -1})}} 
            onCloseClicked={onCloseHandler}/>
    } else if (this.state.panelToShow == 1) {
        picker = 
          <ItemPicker
            onItemSelected={(e) => {curBuild.addItemToCurrentGroup(e);}}
            onCloseClicked={onCloseHandler}/>
    } else if (this.state.panelToShow == 2) {
      picker = 
        <ChampionPicker 
          onItemSelected={(e) => {curBuild.setChampionId(e.id); this.setState({panelToShow: -1})}}
          onCloseClicked={onCloseHandler}/>;
    } else if (this.state.panelToShow == 3) {
      picker = 
        <SummonerPicker 
          onItemSelected={(index, e) => {curBuild.setSummonerId(index, e.id); this.setState({panelToShow: -1})}}
          onCloseClicked={onCloseHandler}
          index={this.state.index}/>;
    } else if (this.state.panelToShow == 5) {
      picker = 
        <ItemBuildStats 
          onCloseClicked={onCloseHandler}/>;
    } else if (this.state.panelToShow == 6) {
      picker = 
        <Settings 
          onCloseClicked={onCloseHandler}/>;
    }

    var championComponent;
    if (this.state.build.getChampionId() !== -1) {
      championComponent = (
        <div className="selected-champion-container">
          <RaisedButton 
            className="selected-champion"
            style={{height: '114px'}}
            primary={true} 
            icon={<img src={getChampionImage(this.state.build.getChampionId())}/>}
            onClick={() => this.setState({panelToShow: 2})} />
        </div>);
    } else {
      championComponent = (
        <div className="edit-champion-container">
          <RaisedButton
            style={{height: 100, width: 100}}
            primary={true} 
            icon={<img src={require('./res/ic_edit_white_24px.svg')}/>}
            onClick={() => this.setState({panelToShow: 2})} />
        </div>);
    }

    const actions = [
      <FlatButton
        label="Cancel"
        onClick={() => this.setState({confirmDeleteDialogOpen: false})}
      />,
      <FlatButton
        label="Clear build"
        onClick={() => {
          curBuild.clear();
          this.setState({confirmDeleteDialogOpen: false});
        }}
      />,
    ];

    var overlay;
    if (this.state.newBuild) {
      overlay = (
        <div className="start-flow">
          <div className="start-flow-inner">
            <ChampionPicker 
              startScreen={true}
              onItemSelected={(e) => {curBuild.setChampionId(e.id); this.setState({newBuild: false})}}
              onCloseClicked={(e) => {this.setState({newBuild: false})}}/>
          </div>
        </div>
        );
    }

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <Dialog
          actions={actions}
          modal={false}
          open={this.state.confirmDeleteDialogOpen}
          onRequestClose={() => this.setState({confirmDeleteDialogOpen: false})}>
          Clear build?
        </Dialog>
        <FlipMove
          duration={250} easing="ease-out"
          className="App">

          <ReactTooltip 
            effect="solid"/>

          <ToastContainer 
            toastClassName="dark-toast"
            progressClassName="transparent-progress" 
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            pauseOnHover/>

          <Scrollbars 
            autoHide
            autoHideTimeout={1000}
            autoHideDuration={300}
            className="main-scroll-view"
            renderThumbHorizontal={this.renderThumb}
            renderThumbVertical={this.renderThumb}
            {...this.props}>

            <div className="main">
              <div className="section-header">
                <h1 className="App-title">Build Planner</h1>

                <div className="spacer-1-flex"/>

                <IconButton onClick={
                    () => {
                      copyTextToClipboard(window.location.href); 
                      toast("Copied to clipboard!");
                  }}>
                  <img src={require('./res/ic_link_white_24px.svg')}/>
                </IconButton>

                <IconButton onClick={
                    () => {
                      this.setState({panelToShow: 6});
                    }
                  }>
                  <img src={require('./res/ic_settings_white_24px.svg')}/>
                </IconButton>

                <IconButton onClick={() => {
                  this.setState({confirmDeleteDialogOpen: true})}
                  }>
                  <img src={require('./res/ic_clear_white_24px.svg')}/>
                </IconButton>
              </div>

              <div className="champion-sums-container">
                {championComponent}

                <div style={{width: 16}}/>

                <SummonerBuild sums={this.state.build.getSummonerIds()} onEditItemClicked={(index) => this.setState({panelToShow: 3, index: index})}/>
              </div>
              
              <div style={{height: 16}}/>

              <div className="section-header">
                <h3>ITEMS</h3>

                <div className="spacer-1-flex"/>

                <IconButton onClick={() => {this.setState({panelToShow: 5})}}>
                  <img src={require('./res/ic_pie_chart_white_24px.svg')}/>
                </IconButton>

                <IconButton onClick={() => {curBuild.clearItems();}}>
                  <img src={require('./res/ic_delete_white_24px.svg')}/>
                </IconButton>
              </div>
              <ItemBuild 
                onAddItemClicked={() => this.setState({panelToShow: 1})} 
                onEditItemClicked={(index) => this.setState({editingItem: index, panelToShow: 4})}
                items={this.state.build.getItemIds()}/>
              <div style={{height: 16}}/>

              <h3>SKILL ORDER</h3>
              <SkillBuild skillSequence={this.state.build.getSkillSequence()}/>
              <div style={{height: 16}}/>
              
              <h3>RUNES</h3>
              <RunesBuild runes={this.state.build.getRunes()}/>
            </div>
          </Scrollbars>
          {picker}
        </FlipMove>

        {overlay}
      </MuiThemeProvider>
    );
  }
}

export default App;
