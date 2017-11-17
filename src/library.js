

class _ItemsLibrary {
	constructor() {
		this.rawItems = require('./res/raw/item.json');
		this.itemsArr = [];
		var data = this.rawItems.data;
	    for (var itemId in data) {
	      var item = data[itemId];
	      item.id = itemId;

	      this.itemsArr.push(item);
	    }

	    this.itemsArr = this.itemsArr.sort((a, b) => {
	      	return a["gold"]["total"] - b["gold"]["total"];
	    });
	}

	getItem(itemId) {
		return this.rawItems.data[itemId];
	}

	getAllItems() {
		return this.itemsArr;
	}
}

class _ChampionsLibrary {
	constructor() {
		this.rawChampions = require('./res/raw/champion.json');
		this.championsArr = [];
		this.championIdDict = {};
		var data = this.rawChampions.data;
	    for (var key in data) {
	      var champion = data[key];

	      this.championIdDict[champion.id] = champion;
	      this.championsArr.push(champion);
	    }

	    this.championsArr = this.championsArr.sort((a, b) => {
	      	return a["name"].localeCompare(b["name"]);
	    });
	}

	getChampion(id) {
		console.log(id.toString());
		console.dir(this.rawChampions);
		return this.championIdDict[id.toString()];
	}

	getAllChampions() {
		return this.championsArr;
	}
}

class _SummonersLibrary {
	constructor() {
		this.rawSummoners = require('./res/raw/summoner.json');
		this.summonerByKeyDict = {};
		this.summonersArr = [];
		var data = this.rawSummoners.data;
	    for (var key in data) {
	      var summoner = data[key];
	      this.summonerByKeyDict[summoner.id] = summoner;
	      this.summonersArr.push(summoner);
	    }
	}

	getSummoner(id) {
		return this.summonerByKeyDict.data[id];
	}

	getAllSummoners() {
		return this.summonersArr;
	}
}


export const ItemsLibrary = new _ItemsLibrary();
export const ChampionsLibrary = new _ChampionsLibrary();
export const SummonersLibrary = new _SummonersLibrary();

