

var pako = require('pako');

const DEFAULT_SKILL_SEQUENCE = [-1, -1, -1, -1, -1, 3, -1, -1, -1, -1, 3, -1, -1, -1, -1, 3, -1, -1];
const IDX_ITEM_ID = 0;

var getNewItemBuild = function() {
	return [[]];
}

class Build {
  constructor() {
  	this.json = {
      // itemIds is an array of array of 2 ints
      // example: [[[3174,1],[3004,2],[3109,3],[1029,4],[1028,5],[1001,6]]]
      // The outer array contains "build groups"
      // Each "build group" is an array containing items
      // Each item is an array of 2 ints, the first int is the item id
      // the second int is a unique key (unique to the entire build)
      // for now it's generated with a monotonically increasing counter
      // The key is used for the UI end (for reordering, etc).
  		itemIds: getNewItemBuild(),
  		championId: -1,
  		sums: [-1, -1],
  		skillSeq: DEFAULT_SKILL_SEQUENCE.slice(),
  		runes: [
  		-1, // main tree
  		-1,	// main tree - subnode
  		-1,	// main tree - subnode
  		-1,	// main tree - subnode
  		-1,	// main tree - subnode

  		-1, // sub tree
  		-1, // sub tree - subnode
  		-1, // sub tree - subnode
  		-1, // sub tree - subnode
  		],
  		counter: 0
  	}
  	this.lastSelectedRune = -1;
    this.listeners = [];
  }

  getMiniData() {
  	var data = [
  		this.json.itemIds,
  		this.json.championId,
  		this.json.sums,
  		this.json.skillSeq,
  		this.json.runes,
  		this.json.counter,
  	];
  	return data;
  }

  getJsonFromMiniData(data) {
  	return {
  		itemIds: data[0],
  		championId: data[1],
  		sums: data[2],
  		skillSeq: data[3],
  		runes: data[4],
  		counter: data[5],
  	}
  }

  toBase64() {
    var bytes = pako.deflate(JSON.stringify(this.getMiniData()));
    return new Buffer(bytes, 'binary').toString('base64');
  }

  addListener(l) {
    this.listeners.push(l);
  }

  getItemIds() {
    return this.json.itemIds;
  }

  addItemToCurrentGroup(item) {
    var curGroup = this.json.itemIds[this.json.itemIds.length - 1];
    var itemId = parseInt(item.id, 10);
    curGroup.push([itemId, this.json.counter++]);

    this.listeners.forEach(elem => elem.onItemsChanged());
  }

  modifyItem(group, index, item) {
  	this.json.itemIds[group][index][IDX_ITEM_ID] = parseInt(item.id, 10);

    this.listeners.forEach(elem => elem.onItemsChanged());
  }

  moveItem(group, oldIndex, newIndex) {
    if (oldIndex === newIndex) {
      return;
    }
    var itemToMove = this.json.itemIds[group][oldIndex];
    this.json.itemIds[group].splice(oldIndex, 1);
    if (oldIndex < newIndex) {
      newIndex -= 1;
    }
    this.json.itemIds[group].splice(newIndex, 0, itemToMove);

    this.listeners.forEach(elem => elem.onItemsChanged());
  }

  deleteItem(group, index) {
  	this.json.itemIds[group].splice(index, 1);

    this.listeners.forEach(elem => elem.onItemsChanged());
  }

  clearItems() {
  	this.json.itemIds = getNewItemBuild();

    this.listeners.forEach(elem => elem.onItemsChanged());
  }

  getSkillSequence() {
  	return this.json.skillSeq;
  }

  setSkillSequence(skillSeq) {
    this.json.skillSeq = skillSeq;
    console.log(skillSeq);

    this.listeners.forEach(elem => elem.onSkillSequenceChanged());
  }

  getRunes() {
  	return this.json.runes;
  }

  setRuneAt(index, value) {
  	if (this.json.runes[index] === value) return;
  	if (typeof value !== 'number') {
  		console.log("Given value was not a number");
  		console.dir(value);
  		return;
  	}

  	this.json.runes[index] = value;

  	// validate
  	if (this.json.runes[6] !== -1 && this.json.runes[7] !== -1 && this.json.runes[8] !== -1) {
  		// we need to remove one of the runes...
  		for (let i = 6; i < 9; i++) {
  			if (i === this.lastSelectedRune || i === index) continue;

  			this.json.runes[i] = -1;
  			break;
  		}
  	}
  	this.lastSelectedRune = index;

    this.listeners.forEach(elem => elem.onRunesChanged());
  }

  setRunes(runes) {
    this.json.runes = runes;

    this.listeners.forEach(elem => elem.onRunesChanged());
  }

  getSummonerIds() {
  	return this.json.sums;
  }

  setSummonerId(index, sumId) {
    if (this.json.sums[index] === sumId) return;
    this.json.sums[index] = sumId;

    this.listeners.forEach(elem => elem.onSummonersChanged());
  }

  getChampionId() {
  	return this.json.championId;
  }

  setChampionId(championId) {
  	championId = parseInt(championId, 10);
    if (this.json.championId === championId) return;
    this.json.championId = championId;

    this.listeners.forEach(elem => elem.onChampionChanged());
  }

  clear() {
  	this.json = {
  		itemIds: getNewItemBuild(),
  		championId: -1,
  		sums: [-1, -1],
  		skillSeq: DEFAULT_SKILL_SEQUENCE.slice(),
  		runes: [
  		-1, // main tree
  		-1,	// main tree - subnode
  		-1,	// main tree - subnode
  		-1,	// main tree - subnode
  		-1,	// main tree - subnode

  		-1, // sub tree
  		-1, // sub tree - subnode
  		-1, // sub tree - subnode
  		-1, // sub tree - subnode
  		],
  		counter: 0
  	}
  	this.lastSelectedRune = -1;

    this.listeners.forEach(elem => elem.onChampionChanged());
  }
}


Build.fromBase64 = function(binaryString) {
  var arr = new Buffer(binaryString, 'base64');
  console.dir(arr);
  var inflated = pako.inflate(arr, { to: 'string' });
  console.log("Inflated: " + inflated);
  var b = new Build();
  b.json = b.getJsonFromMiniData(JSON.parse(inflated));

  if (b.json.skillSeq == null) {
  	b.json.skillSeq = DEFAULT_SKILL_SEQUENCE;
  }
  return b;
}

export default Build;