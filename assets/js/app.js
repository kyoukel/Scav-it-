/* Set the width of the offcanvas-side-navigation to 250px and the left margin of the page content to 250px */
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("mainContent").style.marginLeft = "250px";
    // and add a black background color to body */
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("mainContent").style.marginLeft = "0";
    // and the background color of body to white */
    document.body.style.backgroundColor = "white";
}    

var database = firebase.database();

var MUC = {
    formData: {
        location: {},
        file: ''
    },
    init: function(){
        // When user clicks add player button
        $('#joinHunt').on('click', function(event){
            event.preventDefault();
            var name = $('#yourName');
            MUC.makePlayer(name.val());
            name.val('');
            $('#splash').slideUp('slow');
        });

        // get geo every minute
        var getGeoData = setInterval(function(){
            if (navigator.geolocation) {
                // alert('test');
                navigator.geolocation.getCurrentPosition(MUC.makePosition, MUC.posError);
            }
        }, 30000);
        
        // get geo once
        navigator.geolocation.getCurrentPosition(MUC.makePosition);

        $('#userImage').on('change', function(){
            MUC.makeData();
            MUC.submitForm(MUC.formData);
        });
    },
    makePlayer: function( playerName ){
        // debugger;
        // Set player key, either playerA or player1
        
        var playerKey = firebase.database().ref('players/').push({
            name: playerName
        });
        console.log('create a coockie wih this!' + playerKey);
        // somehow set a cookie to persist the current player

        $('#splash').slideToggle('slow');
        
    },
    clarifaiImg: function(img64){// this calls the clarfai app and resturns the list of predictors
        var app = new Clarifai.App({
            apiKey: 'de1dff9bec7a40438eacef4b649661b1'
        });

        var predictors = app.models.predict(Clarifai.GENERAL_MODEL, img64 ).then(
            function(response){
                // do stuff w/response
                console.log(response.outputs[0].data.concepts);
                return response.outputs[0].data.concepts;
            },
            function(err){
                // there was an error!
                console.log(err);
            }
        )

        return predictors;
    },
    getLocation: function(){
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            console.log("ERROR: Geolocation is not supported by this browser.");
            return false;
        }
    },
    submitForm: function(formData){
        console.log(formData);
    },
    makeData: function() {
        
        // set the location    
        MUC.formData.location = {

        };
        var input = document.getElementById('userImage');

        if (input.files && input.files[0]) {
            var file = input.files[0];
            var file64 = '';
            var reader = new FileReader();
            // console.log(reader.readAsDataURL(file));
            reader.readAsDataURL(file);

            reader.onload = function (e) {
                MUC.formData.file = e.target.result;
                // console.log(e.target.result);
            }
        }
        
    },
    makePosition: function(position){
        
            MUC.formData.location = {
                lat: position.coords.latitude,
                long: position.coords.longitude
            };
        
    },
    posError: function(err){
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }
    // add player to firebase
    // player added? get the playerboard
    // player scored? get the playerboard
    // get scav clues
    // write scav clues (where are scav clues?)
    // get the playerboard
    // do navigation things
    // where is the player?
    // where is the point?
    // submit the image to clarifai
        // determine if response from clarifai is good?
        // give the person a point ladies and gentleman
    // write the playerboard
}


MUC.init();

//
// https://www.geodatasource.com/developers/javascript
//
function distance(lat1, lon1, lat2, lon2) {
    console.log(lat1, lon1, lat2, lon2)
	var radlat1 = Math.PI * lat1/180
	var radlat2 = Math.PI * lat2/180
	var theta = lon1-lon2
	var radtheta = Math.PI * theta/180
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist)
	dist = dist * 180/Math.PI
	dist = dist * 60 * 1.1515
    dist = dist * 5280 // convert miles to feet
    dist = precisionRound(dist, 0)
	return dist
}