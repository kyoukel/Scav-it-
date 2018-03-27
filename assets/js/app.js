/* Set the width of the offcanvas-side-navigation to 250px and the left margin of the page content to 250px */
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    // document.getElementById("mainContent").style.marginLeft = "250px";
    // and add a black background color to body */
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    // document.getElementById("mainContent").style.marginLeft = "0";
    // and the background color of body to white */
    document.body.style.backgroundColor = "white";
}

// Initialize Firebase
var config = {
    apiKey: "AIzaSyCZm14n7D5AEnnVDJup3ptLIcijDlWSeZ0",
    authDomain: "muc-project1.firebaseapp.com",
    databaseURL: "https://muc-project1.firebaseio.com",
    projectId: "muc-project1",
    storageBucket: "muc-project1.appspot.com",
    messagingSenderId: "686942721307"
};

firebase.initializeApp(config);

// Create a reference the database
var database = firebase.database();
var games = {
    state: {},
    getState: function(state) {
        this.state = state
    },
    getCount: function(list) {
        // console.log(list)
        return Object.keys(list).length
    },
    getPlace: function(index) {
        return this.state.places[`place${index}`]
    },
    getPlaces: function() {
        return this.getCount(this.state.places)
    }
}

function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       if(query === ""){
           return false;
       }
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}


$('#nextClue').on('click', function() {
    // submit the form and grab the base64 encoded image

    database.ref("games").on("child_added", function(snapshot) {
        if (snapshot.val().name === "Balboa Park") {
            // log object to the console.
            console.log(snapshot.val());

            // for (var i = 0; i < games.getPlace(); i++)
            var place = games.getPlace();
            console.log(games.getPlace(0).clue);
            $("#clue").html(games.getPlace(0).clue);
        }
    });
});
//
// get data from Firebase
//
database.ref("games").on("child_added", function(snapshot) {
    if (snapshot.val().name === "Balboa Park") {
        // log object to the console.
        console.log(snapshot.val());
        games.getState(snapshot.val());
        var count = games.getCount(games.state.places);
        // var index = 0;
        // passing in the #, in this case 5 so 
        var urlQuery = getQueryVariable('clueId')
        var placeId = (urlQuery) ? urlQuery : "1";
        var place = games.getPlace(placeId);
        console.log(games, place);
        MUC.playerCurrentPlace = place;
        MUC.makeScavClue(place);
        console.log(games.getPlaces());

        // from locations.js we're writing the map here
        initMap(snapshot.val());

    }
    // console log errors
}, function(errorObject) {
    console.log("ERRORS: " + errorObject.code);
});

var MUC = {
    formData: {
        location: {},
        file: ''
    },
    updatePlace: function(currentPlace) {
        var nextPlace = currentPlace.split('place');
        nextPlace = parseInt(nextPlace[1]) ++;

        // TODO update user's next place as ${nextPlace}

    },
    userCurrentPlace: {},
    attrs: { // this is PLACEHOLDER STUFF
        0: 'blue',
        1: 'cat',
        2: 'mammal',
        4: 'bike'
    },
    playerId: '',
    playerName: '',
    playerCurrentPlace: {},
    init: function() {

        // this checks and starts actions to set a player
        MUC.checkPlayerId();

        // hide the messenger
        $('#messenger-wrapper').slideUp().css('display', 'block');

        // this is set when the image is entered in a field.
        $('#base64').on('change', function() {
            // submit the form and grab the base64 encoded image
            MUC.submitForm($(this).val());
        })

        $('#predictions').on('change', function() {
            var parsedPredictions = JSON.parse($(this).val());
            // console.log(parsedPredictions);
            if (MUC.checkPosition()) {
                MUC.checkPredictions(parsedPredictions);
            } else {
                MUC.messenger('Sorry, but you\'re not close enough to the clue\'s location', 'bad');
            }
        });

        // make the data from the submitted image in the input
        $('#userImage').on('change', function() {
            // makes the data, then sets a ui element for another function call
            MUC.makeData();
        });
    },
    setCurrentHunter: function(playerName){
        MUC.playerName = 'Hunter: ' + playerName;
        $('#hunter-name').text( MUC.playerName );
    },
    checkPlayerId: function() {
        if (document.cookie.split(';').indexOf('player=') >= 0 || document.cookie.split('=').indexOf('player') >= 0) {
            MUC.playerId = MUC.getPlayerCookie('player');
            firebase.database().ref('players/' + MUC.playerId ).once('value').then(function(snapshot) {
                var playerName = (snapshot.val() && snapshot.val().name) || 'None';
                MUC.setCurrentHunter(playerName);
            });

            console.log('player exists');
        }else{
            console.log("player does not exist");
            $('#splash').css('display', 'block');

            // bind click event to get new player
            // When user clicks add player button
            $('#joinHunt').on('click', function(event) {
                event.preventDefault();
                var name = $('#yourName');
                MUC.makePlayer(name.val());
                name.val('');
                $('#splash').slideUp('slow');
            });

        }
    },
    getPlayerCookie: function(name) {
        // get the cookie and split it up
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        // return the part with ${name}
        if (parts.length == 2) return parts.pop().split(";").shift();

    },
    makeScavClue: function(scavengePlace) { // this writes out a new scav clue when you pass it a place
        // scavengePlace is a place0 or somehting from fb
        var $clueDiv = $('<div>');
        var clueDivAttributes = {
            'data-attr': scavengePlace.attrs.toString(),
            'data-lat': scavengePlace.lat,
            'data-lng': scavengePlace.lng,
            class: 'clue-inner',
            id: 'scavData'
        }
        MUC.attrs = scavengePlace.attrs;
        $clueDiv.attr(clueDivAttributes).html(`You need to find a '${scavengePlace.clue}' <br>Near location: ${scavengePlace.name}`);
        $('.scav-clue').html($clueDiv);
    },
    makePlayer: function(playerName) {
        // debugger;
        // Set player key, either playerA or player1

        MUC.playerId = firebase.database().ref('players/').push({
            name: playerName
        }).key;

        document.cookie = `player=${MUC.playerId}`;
        console.log('create a coockie wih this! ' + document.cookie['player']);
        // somehow set a cookie to persist the current player
        // document.cookie = `gameCounter=0`;
        MUC.setCurrentHunter(playerName);

    },
    clarifaiImg: function(img64) { // this calls the clarfai app and resturns the list of predictors
        var app = new Clarifai.App({
            apiKey: 'de1dff9bec7a40438eacef4b649661b1'
        });

        var img_arr = img64.split(',');
        var index = (img_arr.length - 1);
        cl_image = img_arr[index];
        var image_for_clarifai = { base64: cl_image }

        console.log('clarifai image coming out!');
        console.log(image_for_clarifai);

        var predictors = app.models.predict(Clarifai.GENERAL_MODEL, image_for_clarifai).then(
            function(response) {
                // do stuff w/response
                // console.log(response.outputs[0].data.concepts);
                $('#predictions').val(JSON.stringify(response.outputs[0].data.concepts)).trigger('change');
                return response.outputs[0].data.concepts;
            },
            function(err) {
                // there was an error!
                console.log(err);
            }
        )

        return predictors;
    },
    submitForm: function(image64) {
        // console.log(formData);
        var predictions = MUC.clarifaiImg(image64);
    },
    checkPredictions: function(predictions) {
        var predictionFound = false;
        $.each(MUC.attrs, function(attrKey, attr) {
            $.each(predictions, function(predKey, predProperties) {
                if (predProperties.name === attr) {
                    console.log(`We've got a ${attr} people!`);
                    // check the location of the user?
                    // TODO or update the place to next one and tell the user good job?
                    predictionFound = true;
                    return;
                }
                return;
            });

        });
        // TODO Go to the next CLUE @christian
        //when the function loops back out and there is a truth, huray!
        if (predictionFound) {
            MUC.messenger('Congrads! You\'ve completed a clue!', 'good');
            gamecounter++;
        } else {
            MUC.messenger('Sorry! Try to find the clue item again.', 'bad');
        }
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

            reader.onload = function(e) {
                MUC.formData.file = e.target.result;
                // console.log(e.target.result);
                $('#base64').val(e.target.result).trigger('change');
            }
        }

    },
    checkPosition: function() {

        var userLong = $('#userLong').val();
        var userLat = $('#userLat').val();
        var poiLat = $('#scavData').attr('data-lat');
        var poiLong = $('#scavData').attr('data-lng');


        // use distance() from locations.js to determine success?
        if ( 45 > distance(userLat, userLong, poiLat, poiLong, 'K') ) {
            // they can scavenge the item
            console.log('in bounds! read to scav!');
            return true;
        } else {
            // you're out of bounds!
            console.log('out of bounds!');
            return false;
        }
    },
    posError: function(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    },
    messenger: function(mssg, mssgType) {
        // Tell the user differnt good or bad things
        // MAKE ME
        // <div class="alert alert-primary" role="alert">
        // This is a primary alert—check it out!
        // </div>
        var alertType = (mssgType !== 'good') ? 'alert-danger' : 'alert-success';
        var styling = {
            class: 'alert ' + alertType
        }
        var text = '<h3>' + mssg + '</h3>';
        var $div = $("<div>").attr(styling).html(text);
        $('#messenger-wrapper').html($div);
        $('#messenger-wrapper').slideDown('fast', function(){
            // kill the messege in 4 sec
            setTimeout(function() {
                $('#messenger-wrapper').slideUp('fast').html('');
            }, 8000);
        });
    }
}


MUC.init();