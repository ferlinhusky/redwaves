/* 
	Title: Over red waves of sand
	Author: Graham Cranfield
*/

var MapWorld;
var Input = new Input();
var Statuss = new Statuss();

var Loading = new D_Loading();
    Loading.openMe("Loading...", LoadingAnim + "Building...");

var Map = new Map();
var World = new World();
var Party = new Party();

    Loading.closeMe();
    
Loadwelcome();