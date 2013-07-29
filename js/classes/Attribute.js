var Attribute = Class.extend({
	init: function(name){
		this.name = name;
		this.v = 0;
		this.base = 0;
	},
	mod: function(){ return Math.floor((this.v - 10)/2); }
});

var STR = Attribute.extend({ init: function(){this._super("STR");} });
var CON = Attribute.extend({ init: function(){this._super("CON");} });
var CHA = Attribute.extend({ init: function(){this._super("CHA");} });
var WIS = Attribute.extend({ init: function(){this._super("WIS");} });
var INT = Attribute.extend({ init: function(){this._super("INT");} });
var DEX = Attribute.extend({ init: function(){this._super("DEX");} });