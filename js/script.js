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

    Loading.closeMe();
    
Loadwelcome();

// If arriving from email (passcode in URL)
if (passcode.length > 0) {
    $('#enter_passcode').text(passcode);
	/*$.ajax({
		url:'load.php?passcode='+passcode,
		dataType: 'json',
		success: function(data){
			if (data.error) {
				alert(data.error);
			} else {
				Input.loadgame(data);
			}
		},
		error: function(){
			alert("Error loading data. Sorry :(");
		}
	});*/
}