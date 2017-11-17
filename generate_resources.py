import json
from pprint import pprint

with open('src/res/raw/item.json') as data_file:    
    data = json.load(data_file);

str = ""

for key, value in data["data"].items():
	str += "case %s: return require('./res/item_thumb/%s'); \n" % (key, value["image"]); 

str += "default: console.log('Invalid id: ${id}'); return null;\n"

template = """
export function getItemImageFor(id) {
	switch(id) {
	%s
	}
}
""" % str

############################## champions

with open('src/res/raw/champion.json') as data_file:    
    data = json.load(data_file);

str = ""

for key, value in data["data"].items():
	str += "case %s: return require('./res/champions_thumb/%s'); \n" % (value["id"], key + ".png"); 

str += "default: console.log('Invalid id: ${id}'); return null;\n"

template += """
export function getChampionImageFor(id) {
	switch(id) {
	%s
	}
}
""" % str

############################### summoners

with open('src/res/raw/summoner.json') as data_file:    
    data = json.load(data_file);

str = ""

for key, value in data["data"].items():
	str += "case %s: return require('./res/summoner/%s'); \n" % (value["id"], key + ".png"); 

str += "default: console.log('Invalid id: ${id}'); return null;\n"

template += """
export function getSummonerImageFor(id) {
	switch(id) {
	%s
	}
}
""" % str

# write generated code to file
text_file = open("src/res_helper.js", "w");
text_file.write(template)
text_file.close()
