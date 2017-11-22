import React, { Component } from 'react';
import './App.css';
import $ from "jquery";

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import FlipMove from 'react-flip-move';
import {getItemImage, getChampionImage, getSummonerImage, PerksLibrary, ItemsLibrary, ChampionsLibrary, SummonersLibrary} from './library.js';
import { Scrollbars } from 'react-custom-scrollbars';
import Build from './build.js';
import Measure from 'react-measure'
import IconButton from 'material-ui/IconButton';
import { ToastContainer, toast } from 'react-toastify';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import ReactTooltip from 'react-tooltip'
import Util from './util';
import {ItemView, ItemPicker, ChampionPicker, SummonerPicker} from './picker';
import {MuiTheme} from './theme';
import {LeftAd, RightAd} from './ad';

const STAT_TYPE_PERCENT = 1;

const STAT_DICT = {}

var updateUrl = function() {
  window.history.pushState(null, "", "/?p=" + curBuild.toBase64());
}

var location = window.location;
console.dir(`location.pathname: ${location.pathname}`);

var startPos = window.location.href.indexOf('/?p=', 9);
var buildBin = startPos >= 0 ? window.location.href.substring(startPos + 4) : "";
var newBuild = false;

var curBuild;
if (buildBin.length > 0) {
  console.log(buildBin);
  curBuild = Build.fromBase64(buildBin);
} else {
  curBuild = new Build();
  newBuild = true;
}

class ItemView2 extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isHovered: false
    };
  }

  render() {
    var padding = 8;
    var w = this.props.width != null ? this.props.width : 80;
    var h = this.props.height != null ? this.props.height : 80;

    var innerW = w - padding * 2;
    var innerH = h - padding * 2;

    return (
      <div 
        onMouseEnter={() => {this.setState({isHovered: true})}}
        onMouseLeave={() => {this.setState({isHovered: false})}}
        className={"item-outer " + this.props.className}
        style={{padding: padding}}>

        <div 
          className="item-img-container"
          style={{width: innerW, height: innerH}}>
          <img 
            alt={this.props.item.name}
            src={getItemImage(this.props.item)}
            style={{width: innerW + 4, height: innerH + 4}}/>
        </div>
        <div 
          className={"a1 " + (this.state.isHovered ? "a1-hover" : "")}
          onClick={() => {this.props.onEditItemClicked()}}
          style={{width: w, height: h/2}}>
          <img
            alt="Edit" 
            src={require('./res/ic_edit_white_24px.svg')}/>
        </div>
        <div 
          className={"a2 " + (this.state.isHovered ? "a2-hover" : "")}
          onClick={() => {this.props.onDeleteItemClicked()}}
          style={{width: w, height: h/2}}>
          <img 
            alt="Delete"
            src={require('./res/ic_delete_white_24px.svg')}/>
        </div>
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

    var stats = {};

    var finalItems = [];

    for (let i = 0; i < build.length; i++) {
      var item = build[i];
      if (item.tags.includes("Consumable")) continue;
      if (item.id === 2010) continue; // biscuit (for some reason it's not listed as a consumable)
      if (item.tags.includes("Trinket")) continue;

      let toCheck = [item.id];
      while (toCheck.length !== 0) {
        let itemId = toCheck.shift();
        let itemInfo = ItemsLibrary.getItem(itemId);
        if (itemInfo == null) continue;

        let fromItemIds = itemInfo.from;

        if (fromItemIds == null || fromItemIds.length === 0) {
            continue;
        }

        fromItemIds.forEach((itemId) => {
          var index = -1;
          for (let i = 0; i < finalItems.length; i++) {
            if (itemId === finalItems[i].id) {
              index = i;
              break;
            }
          }

          if (index > -1) {
            finalItems.splice(index, 1);
          } else {
            toCheck.push(itemId);
          }
        });
      }

      // If we are going to add boots to the build, remove any boots already in the build
      if (item.tags.includes("Boots")) {
        finalItems = finalItems.filter((item) => {
          return !item.tags.includes("Boots");
        });
      }

      finalItems.push(item);
      if (finalItems.length > 6) {
        finalItems.splice(0, 1);
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
      <div className="vertical-content">
        <header>
          <div className="section-header">
            <h2>Build stats</h2>

            <div className="spacer-1-flex"/>

            <IconButton onClick={this.props.onCloseClicked}>
              <img alt="Close" src={require('./res/ic_close_white_24px.svg')}/>
            </IconButton>
          </div>
        </header>
        <Scrollbars className="items-container">
          <div className="stats-container" duration={300} easing="ease-out">
            {this.getComponentsForStats(stats)}
            <h3>Final items</h3>
            <div className="final-items-container">
              {finalItems.map((e, index) => {
                return (
                  <ItemView 
                    item={e} 
                    key={index}
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

class ItemBuild extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isDragging: false,
      dropTarget: null,
      dropItemIndex: -1,
      dragIndex: -1,

      dimensions: {
        width: -1,
        height: -1
      }
    }

    this.dragStartHandler = (index, event) => {
      this.setState({dragIndex: index, isDragging: true});
    }
    this.dragEndHandler = (event) => {
      if (!this.props.reorderItems) {
        return;
      }

      this.setState({dragIndex: -1, isDragging: false});

      var dropTarget = this.state.dropTarget;
      if (dropTarget != null) {
        var $dropTarget = $(dropTarget);
        if ($dropTarget.outerWidth() / 2 + $dropTarget.offset().left > event.pageX) {
          // drop to the left of this item...
          console.log(`Dragging item from ${this.state.dragIndex} to ${this.state.dropItemIndex}`);
          curBuild.moveItem(0, this.state.dragIndex, this.state.dropItemIndex);
        } else {
          console.log(`Dragging item from ${this.state.dragIndex} to ${this.state.dropItemIndex + 1}`);
          curBuild.moveItem(0, this.state.dragIndex, this.state.dropItemIndex + 1);
        }
      }
    }

    this.mouseEnterHandler = (index, event) => {
      if (this.state.isDragging) {
        this.setState({dropTarget: event.target, dropItemIndex: index});
      }
    }

    this.mouseLeaveHandler = (event) => {
      if (this.state.isDragging) {
        this.setState({dropTarget: null, dropItemIndex: -1});
      }      
    }
  }

  componentDidMount() {
    ReactTooltip.rebuild();
  }

  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  render() {
    var cost = 0;

    var startingItems = [];
    var items = [];
    var tooltips = [];

    const { width } = this.state.dimensions;

    const minItemSize = 70;
    var itemSize = width / Math.floor(width / minItemSize);

    this.props.items[0].forEach((itemModel, index) => {
      var item = ItemsLibrary.getItem(itemModel[0]);
      cost += item.gold.total;

      if (cost <= 500 && startingItems.length < 6) {
        startingItems.push(
          <div
            draggable="true"
            onDragEnter={this.mouseEnterHandler.bind(null, index)}
            onDragExit={this.mouseLeaveHandler}
            onDragStart={this.dragStartHandler.bind(null, index)}
            onDragEnd={this.dragEndHandler}
            key={itemModel[1]}
            data-tip
            data-for={item.name}>
            
            <ItemView2
              width={itemSize}
              height={itemSize}
              className={(this.props.reorderItems ? "reorder" : "editable")}
              item={item} 
              onEditItemClicked={() => {this.props.onEditItemClicked(index)}}
              onDeleteItemClicked={() => {curBuild.deleteItem(0, index)}}/>
          </div>);
      } else { 
        items.push(
          <div
            draggable={this.state.reorderItems ? true : false}
            onDragEnter={this.mouseEnterHandler.bind(null, index)}
            onDragExit={this.mouseLeaveHandler}
            onDragStart={this.dragStartHandler.bind(null, index)}
            onDragEnd={this.dragEndHandler}
            key={itemModel[1]}
            data-tip
            data-for={item.name}>

            <ItemView2
              width={itemSize}
              height={itemSize}
              onDragStart={this.dragStartHandler}
              className={(this.props.reorderItems ? "reorderable" : "editable")}
              item={item} 
              onEditItemClicked={() => {this.props.onEditItemClicked(index)}}
              onDeleteItemClicked={() => {curBuild.deleteItem(0, index)}}/>
          </div>);
      }

      tooltips.push(
        <ReactTooltip id={item.name} effect='solid' key={index}>
          <div><span><b>{item.name}</b></span></div>
        </ReactTooltip>
        );
    })

    var addItemElem;
    if (!this.props.reorderItems) {
      addItemElem = (
        <div className="add-item-outer">
          <RaisedButton
            style={{height: itemSize, width: itemSize, minWidth: 0}}
            primary={true} 
            icon={<img alt="Add item" src={require('./res/ic_add_white_24px.svg')}/>}
            onClick={() => this.props.onAddItemClicked()}/>
        </div>)
    }

    return (
      <Measure
        bounds
        onResize={(contentRect) => {
          this.setState({ dimensions: contentRect.bounds })
        }}>
        {({ measureRef }) =>
          <div ref={measureRef}>
            <FlipMove
              duration={250} 
              easing="ease-out"
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

              {addItemElem}

              {tooltips}
            </FlipMove>
          </div>
        }
      </Measure>
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

      if (i % columns === 0 && i/columns > 0) {
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
          className={"skill-cell " 
            + (ultLevel ? "ult-cell " : "") 
            + (error ? "error-cell " : "") 
            + (onClickListener ? "clickable " : "")}  
          key={i} 
          style={{width: width}} 
          onClick={onClickListener}>
          {text}
          {content}
        </div>);
    }

    return elems;
  }

  render() {
    var skillSeq = this.props.skillSequence;
    const { width } = this.state.dimensions

    var error = this.validateSkillSeq(skillSeq);

    var errorElem;
    if (error) {
      errorElem = (
        <div>
          <span className="error">{error}</span>
        </div>
      )
    }

    return (
      <FlipMove
        duration={250} easing="ease-out">

        <Measure
          bounds
          onResize={(contentRect) => {
            this.setState({ dimensions: contentRect.bounds })
          }}>
          {({ measureRef }) =>
            <div ref={measureRef} className="skill-build">
              {this.makeElemWithWidth(width, error)}
            </div>
          }
        </Measure>

        {errorElem}
      </FlipMove>);
  }
}

class SummonerBuild extends Component {
  render() {
    var sumIds = this.props.sums;

    var sumElems = sumIds.map((sumId, index) => {
      var imgElem = 
        <img 
          alt="Edit summoner"
          src={sumId >= 0 ? getSummonerImage(sumId) : require('./res/ic_edit_white_24px.svg')} 
          className={sumId >= 0 ? "sum-icon" : ""}/>;
      return ( 
        <div className="selected-sum-container">
          <RaisedButton
            className={sumId >= 0 ? "selected-sum" : ""}
            style={{width: 64, height: 64, minWidth: 0}}
            primary={true} 
            icon={imgElem}
            onClick={() => this.props.onEditItemClicked(index)} />
        </div>);
    });

    return (
      <div className="sums-container">
        {sumElems[0]}
        <div style={{width: 16}}/>
        {sumElems[1]}
      </div>);
  }
}

const groupSizes = [5, 3, 3, 3, 3, 4, 3, 3, 3];
class RunesBuild extends Component {
  makeGroup(rowIndex) {
    var runes = this.props.runes;
    var treeState = runes[0];
    var primaryTreeId = treeState >= 0 ? PerksLibrary.getTreeNodes()[treeState] : -1;
    var subTreeState = treeState >= 0 && runes[5] >= 0 ? runes[5] : -1;
    var subTreeId = subTreeState >= 0 ? PerksLibrary.getTreeNodes().filter(e => {return e !== primaryTreeId})[subTreeState] : -1;

    return [...Array(groupSizes[rowIndex]).keys()].map((e) => {
      var className = runes[rowIndex] === e ? "item-selected" : "";

      var perk;
      if (rowIndex === 0) {
        perk = PerksLibrary.getPerk(PerksLibrary.getTreeNodes()[e]);
      } else if (rowIndex >= 1 && rowIndex <= 4) {
        if (primaryTreeId >= 0) {
          perk = PerksLibrary.getPerk(PerksLibrary.getTree(primaryTreeId)[rowIndex][e]);
        } else {
          perk = -1;
        }
      } else if (rowIndex === 5) {
        if (primaryTreeId >= 0) {
          perk = PerksLibrary.getPerk(PerksLibrary.getTreeNodes().filter(e => {return e !== primaryTreeId})[e]);
        } else {
          perk = -1;
        }
      } else if (rowIndex > 5) {
        if (subTreeId >= 0) {
          perk = PerksLibrary.getPerk(PerksLibrary.getTree(subTreeId)[rowIndex - 4][e]);
        } else {
          perk = -2;
        }
      }

      var tip;
      if (perk === -1) {
        tip = <span>Pick a <b>primary style</b></span>
      } else if (perk === -2) {
        tip = <span>Pick a <b>secondary style</b></span>
      } else {
        tip = <div><b>{perk.name}</b><br/><div dangerouslySetInnerHTML={{__html: perk.desc}} /></div>
      }

      return (
        <div key={rowIndex + "-" + e}>
          <div
            data-tip
            data-for={"a" + rowIndex + "b" + e}
            className={"item " +className} 
            onClick={() => curBuild.setRuneAt(rowIndex, e)}/>
          <ReactTooltip id={"a" + rowIndex + "b" + e}>
            <div className="rune-tip">{tip}</div>
          </ReactTooltip>
        </div>);
    })
  }

  render() {
    return (
      <div className="runes-container">
        <div className="runes-container-row">
          <div>{this.makeGroup(0)}</div>
          <div className="divider"/>
          <div>{this.makeGroup(1)}</div>
          <div className="divider"/>
          <div>{this.makeGroup(2)}</div>
          <div className="divider"/>
          <div>{this.makeGroup(3)}</div>
          <div className="divider"/>
          <div>{this.makeGroup(4)}</div>
        </div>

        <div style={{width: 8}}/>
        <div className="vertical-divider"/>
        <div style={{width: 8}}/>

        <div className="runes-container-row">
          <div>{this.makeGroup(5)}</div>
          <div className="divider"/>
          <div>{this.makeGroup(6)}</div>
          <div className="divider"/>
          <div>{this.makeGroup(7)}</div>
          <div className="divider"/>
          <div>{this.makeGroup(8)}</div>
        </div>
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      panelToShow: this.getPanelBasedOnUrl(),
      build: curBuild,
      editingItem: -1,
      confirmDeleteDialogOpen: false,
      confirmClearItemsDialogOpen: false,
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

    window.onpopstate = () => {
      this.setState({panelToShow: this.getPanelBasedOnUrl()});
    }
  }

  getPanelBasedOnUrl() {
    console.log('updateStateBasedOnUrl');
    switch (location.pathname) {
      case "/about":
        return 100;
      case "/how-this-works":
        return 101;
      default:
        return 0;
    }
  }

  renderThumb({ style, ...props }) {
      const thumbStyle = {
          backgroundColor: '#c9ba9d'
      };
      return (
        <div
          style={{ ...style, ...thumbStyle }}
          {...props}/>);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.panelToShow !== prevState.panelToShow 
      && this.state.panelToShow >= 100) {
      this.scrollView.scrollToTop();
    }
  }

  render() {
    var picker;

    var onCloseHandler = () => {
      this.setState({panelToShow: -1});
    }

    var pickerClass = "";
    var mainPicker;

    if (this.state.panelToShow === 4) {
      picker = 
        <ItemPicker
          onItemSelected={(item) => {curBuild.modifyItem(0, this.state.editingItem, item); this.setState({panelToShow: -1})}} 
          onCloseClicked={onCloseHandler}/>
    } else if (this.state.panelToShow === 1) {
      picker = 
        <ItemPicker
          onItemSelected={(e) => {curBuild.addItemToCurrentGroup(e);}}
          onCloseClicked={onCloseHandler}/>
    } else if (this.state.panelToShow === 2) {
      picker = 
        <ChampionPicker 
          onItemSelected={(e) => {curBuild.setChampionId(e.id); this.setState({panelToShow: -1})}}
          onCloseClicked={onCloseHandler}/>;
    } else if (this.state.panelToShow === 3) {
      picker = 
        <SummonerPicker 
          onItemSelected={(index, e) => {curBuild.setSummonerId(index, e.id); this.setState({panelToShow: -1})}}
          onCloseClicked={onCloseHandler}
          index={this.state.index}/>;
    } else if (this.state.panelToShow === 5) {
      picker = 
        <ItemBuildStats 
          onCloseClicked={onCloseHandler}/>;
    } else if (this.state.panelToShow === 6) {
      picker = 
        <Settings 
          onCloseClicked={onCloseHandler}/>;
    } else if (this.state.panelToShow === 100) {
      mainPicker =
        <div className="picker-main about">
          <div className="section-header">
            <h2>About</h2>

            <div className="spacer-1-flex"/>

            <IconButton 
              key="10" 
              onClick={() => {
                updateUrl();
                this.setState({panelToShow: 0});
                }}>
              <img alt="Close" src={require('./res/ic_close_white_24px.svg')}/>
            </IconButton>
          </div>
          <p style={{marginTop: 0}}>
          Hassle free build creation and sharing for the popular 
          <a href="https://en.wikipedia.org/wiki/Multiplayer_online_battle_arena"> MOBA</a> game, 
          <a href="https://leagueoflegends.com"> League of Legends</a>.
          </p>

          <p>League of Legends Build Planner is aimed to deliver the world's best build creation/sharing experience. 
          To achieve this, our Build Planner requires no sign up/sign ins, we offer a very simple interface to create 
          builds and all links generated by this site are permanent links to your build and can be shared with anyone.
          </p>

          <h4>Disclaimer</h4>
          <p>League of Legends Build Planner isn't endorsed by Riot Games and doesn't reflect the views or opinions 
          of Riot Games or anyone officially involved in producing or managing League of Legends. League of Legends 
          and Riot Games are trademarks or registered trademarks of Riot Games, Inc. League of Legends © Riot Games, 
          Inc.</p>
        </div>
    } else if (this.state.panelToShow === 101) {
      mainPicker =
        <div className="picker-main about">
          <div className="section-header">
            <h2>How this works</h2>

            <div className="spacer-1-flex"/>

            <IconButton 
              key="10" 
              onClick={() => {
                updateUrl();
                this.setState({panelToShow: 0});
                }}>
              <img alt="Close" src={require('./res/ic_close_white_24px.svg')}/>
            </IconButton>
          </div>
          <p style={{marginTop: 0}}>
            Your build, built right into the url.
          </p>
          <p>
            To offer players the very best experience when it comes to build sharing, we've made the sharing logic 
            as simple and as fool proof as possible. To accomplish this, we encode your build into the link itself.
          </p>
          <p>
            This means that every detail of your build is actually stored right into the url. The url 
            itself stores the item build order, champion, summoners taken, rune information and more. The url is
            also always kept up to date. (Try changing your build and pay attention to the address bar of your
              browser). 
          </p>
          <p>
            Urls generated by this app will thus be a permanent link to your build and will never expire as long 
            as this site is kept alive. This also means that you can simply copy the url at any point to get a 
            share-able link to your build. This also means that anyone can edit a build that is shared without
            changing the original build or the original url.
          </p>
        </div>
    }

    if (picker == null) {
      pickerClass += " side-panel-collapsed";
    } else {
      pickerClass += " side-panel-expanded";
    }

    var championComponent;
    if (this.state.build.getChampionId() !== -1) {
      championComponent = (
        <div className="selected-champion-container">
          <RaisedButton 
            className="selected-champion"
            style={{height: '114px'}}
            primary={true} 
            icon={<img alt="" src={getChampionImage(this.state.build.getChampionId())}/>}
            onClick={() => this.setState({panelToShow: 2})} />
        </div>);
    } else {
      championComponent = (
        <div className="edit-champion-container">
          <RaisedButton
            style={{height: 96, width: 96}}
            primary={true} 
            icon={<img alt="Pick champion" src={require('./res/ic_edit_white_24px.svg')}/>}
            onClick={() => this.setState({panelToShow: 2})} />
        </div>);
    }

    const clearBuildDialogActions = [
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

    const clearItemBuildDialogActions = [
      <FlatButton
        label="Cancel"
        onClick={() => this.setState({confirmClearItemsDialogOpen: false})}
      />,
      <FlatButton
        label="Clear items"
        onClick={() => {
          curBuild.clearItems();
          this.setState({confirmClearItemsDialogOpen: false});
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
      overlay = null;
    }

    var buildItems = this.state.build.getItemIds();
    var itemSectionButtons;
    if (this.state.reorderItems) {
      itemSectionButtons = [
          <IconButton key="10" onClick={() => {this.setState({reorderItems: false})}}>
            <img alt="Close" src={require('./res/ic_close_white_24px.svg')}/>
          </IconButton>
        ];
    } else {
      var disableReorder = buildItems == null || buildItems.length === 0 || buildItems[0] == null || buildItems[0].length <= 1;
      var disableAnalyze = buildItems == null || buildItems.length === 0 || buildItems[0] == null || buildItems[0].length < 1;
      itemSectionButtons = [
          <IconButton 
            key="0" 
            onClick={() => this.setState({reorderItems: true})}
            disabled={disableReorder}
            style={{opacity: disableReorder ? .33 : 1}}>
            <img alt="Reorder" src={require('./res/ic_reorder_white_24px.svg')}/>
          </IconButton>,
          <IconButton 
            key="1" 
            onClick={() => this.setState({panelToShow: 5})}
            disabled={disableAnalyze}
            style={{opacity: disableAnalyze ? .33 : 1}}>
            <img alt="Build stats" src={require('./res/ic_pie_chart_white_24px.svg')}/>
          </IconButton>,
          <IconButton key="2" onClick={() => this.setState({confirmClearItemsDialogOpen: true})}>
            <img alt="Clear" src={require('./res/ic_delete_white_24px.svg')}/>
          </IconButton>
        ];
    }

    var onInternalLinkClick = (e) => {
      console.dir(e.target.attributes.href);
      window.history.pushState(null, "", e.target.attributes.href.value);
      this.setState({panelToShow: this.getPanelBasedOnUrl()});
      e.preventDefault(); 
      return false;
    };

    //var shouldHideMain = this.state.panelToShow >= 100;


    return (
      <MuiThemeProvider muiTheme={MuiTheme}>
        <div className="root">
          <Dialog
            actions={clearBuildDialogActions}
            modal={false}
            open={this.state.confirmDeleteDialogOpen}
            onRequestClose={() => this.setState({confirmDeleteDialogOpen: false})}>
            Clear build?
          </Dialog>
          <Dialog
            actions={clearItemBuildDialogActions}
            modal={false}
            open={this.state.confirmClearItemsDialogOpen}
            onRequestClose={() => this.setState({confirmClearItemsDialogOpen: false})}>
            Clear items?
          </Dialog>
          <div
            className="App">

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
              ref={(input) => { this.scrollView = input; }}
              {...this.props}>

              <div className="main-outer">

                <LeftAd />

                <div className="main">
                  <div className="section-header">
                    <h1 className="App-title">Build Planner</h1>

                    <div className="spacer-1-flex"/>

                    <IconButton onClick={
                        () => {
                          Util.copyTextToClipboard(window.location.href); 
                          toast("Copied to clipboard!");
                      }}>
                      <img alt="Copy link" src={require('./res/ic_link_white_24px.svg')}/>
                    </IconButton>

                    <IconButton style={{display: 'none'}} onClick={() => this.setState({panelToShow: 6})}>
                      <img alt="Settings" src={require('./res/ic_settings_white_24px.svg')}/>
                    </IconButton>

                    <IconButton onClick={() => this.setState({confirmDeleteDialogOpen: true})}>
                      <img alt="Clear" src={require('./res/ic_clear_white_24px.svg')}/>
                    </IconButton>
                  </div>

                  <div className="champion-sums-container">
                    {championComponent}

                    <div style={{width: 16}}/>

                    <SummonerBuild sums={this.state.build.getSummonerIds()} onEditItemClicked={(index) => this.setState({panelToShow: 3, index: index})}/>
                  </div>
                  
                  <div style={{height: 8}}/>

                  <div className={"item-build-section-container" + (this.state.reorderItems ? " reorder" : "")}>
                    <FlipMove
                      duration={250} easing="ease-out"
                      className="section-header">
                      <h3>{this.state.reorderItems ? "DRAG & DROP TO REORDER" : "ITEMS"}</h3>

                      <div className="spacer-1-flex"/>

                      {itemSectionButtons}
                    </FlipMove>
                    <div className="content-container">
                      <ItemBuild 
                        reorderItems={this.state.reorderItems}
                        onAddItemClicked={() => this.setState({panelToShow: 1})} 
                        onEditItemClicked={(index) => this.setState({editingItem: index, panelToShow: 4})}
                        items={this.state.build.getItemIds()}/>
                    </div>
                  </div>

                  <div style={{height: 8}}/>

                  <div className="section-header">
                    <h3>SKILL ORDER</h3>
                  </div>
                  <div className="content-container">
                    <SkillBuild skillSequence={this.state.build.getSkillSequence()}/>
                  </div>

                  <div style={{height: 8}}/>
                  
                  <div className="section-header">
                    <h3>RUNES</h3>
                  </div>
                  <div className="content-container">
                    <RunesBuild runes={this.state.build.getRunes()}/>
                  </div>

                  <div style={{height: 100}}/>

                  {mainPicker}
                </div>

                <RightAd />
                
                <div className="footer-outer">
                  <div className="footer">
                    <span>
                      <a
                        href="/how-this-works" 
                        className="footer-item"
                        onClick={onInternalLinkClick}>
                        How this works
                      </a>
                      |
                      <a 
                        href="/about" 
                        className="footer-item" 
                        onClick={onInternalLinkClick}>
                        About
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            </Scrollbars>
            <div className={"side-panel" + pickerClass}>
              {picker}
            </div>
          </div>

          {overlay}
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
