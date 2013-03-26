/* 
	Title: Over red waves of sand
	Author: Graham Cranfield
*/

var MapWorld;
var input = new Input();
var Statuss = new Statuss();

var Loading = new D_Loading();
    Loading.openMe("Loading...", LoadingAnim + "Building...");

var hero = new Hero();
var fighter = new Fighter();
var knight = new Knight();
var wizard = new Wizard();
var me = hero;

var Map = new Map();
var World = new World();

    Loading.closeMe();

oDialog.load('stories/introduction.html');
input.M_Dialog('welcome'); 