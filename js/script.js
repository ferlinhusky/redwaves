/* 
	Title: Over red waves of sand
	Author: Graham Cranfield
*/

// Fix iOS Chrome nav bar issue
$('html, body').css('height', '2000px');
$('html, body').css('overflow', 'auto');
$(window).scrollTop(80);
setTimeout(function(){
	$('html, body').css('height', '100%');
	$('html, body').css('overflow', 'hidden');
	$(window).scrollTop(0);
}, 500);

// Start up
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