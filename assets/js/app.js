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
<<<<<<< HEAD
    init: function() {
=======
    formData: {
        location: {},
        file: ''
    },
    init: function(){
>>>>>>> 81fe7838cd1e683f6e028d642b26b41566e810e9
        // When user clicks add player button
        $('#joinHunt').on('click', function(event) {
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
    makePlayer: function(playerName) {
        // debugger;
        // Set player key, either playerA or player1
<<<<<<< HEAD


=======
        
>>>>>>> 81fe7838cd1e683f6e028d642b26b41566e810e9
        var playerKey = firebase.database().ref('players/').push({
            name: playerName
        });
        console.log('create a cookie with this!' + playerKey);
        // somehow set a cookie to persist the current player

        $('#splash').slideToggle('slow');

    },
    clarifaiImg: function(img64) { // this calls the clarfai app and resturns the list of predictors
        var app = new Clarifai.App({
            apiKey: 'de1dff9bec7a40438eacef4b649661b1'
        });

        var predictors = app.models.predict(Clarifai.GENERAL_MODEL, img64).then(
            function(response) {
                // do stuff w/response
                console.log(response.outputs[0].data.concepts);
                return response.outputs[0].data.concepts;
            },
            function(err) {
                // there was an error!
                console.log(err);
            }
        )

        return predictors;
    },
<<<<<<< HEAD
    getLocation: function() {
            if (navigator.geolocation) {
                return navigator.geolocation.getCurrentPosition(showPosition);
            } else {
                console.log("ERROR: Geolocation is not supported by this browser.");
                return false;
            }
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
=======
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
>>>>>>> 81fe7838cd1e683f6e028d642b26b41566e810e9
        // determine if response from clarifai is good?
        // give the person a point ladies and gentleman
        // write the playerboard


}


var citymap = {

    BALBOAPARK: {
        center: {
            lat: 32.734148,
            lng: -117.144553
        },
    },
    ALCAZARGARDEN: {
        center: {
            lat: 32.731058,
            lng: -117.151769
        },
    },
    CALIFORNIATOWER: {
        center: {
            lat: 32.731628,
            lng: -117.152218
        },
    },
    FLEETSCIENCECENTER: {
        center: {
            lat: 32.730788,
            lng: -117.146964
        },
    },
    INTERNATIONALHOUSES: {
        center: {
            lat: 32.729153,
            lng: -117.152218
        },
    },
    LILYPOND: {
        center: {
            lat: 32.731978,
            lng: -117.149235
        },
    },
    AIRANDSPACEMUSEUM: {
        center: {
            lat: 32.726272,
            lng: -117.154293
        },
    },
    MUSEUMOFART: {
        center: {
            lat: 32.732152,
            lng: -117.150431
        },
    },
    RAILROADMUSEUM: {
        center: {
            lat: 32.731132,
            lng: -117.148611
        },
    },
    FRIENDGARDEN: {
        center: {
            lat: 32.730129,
            lng: -117.149958
        },
    },
    NAT: {
        center: {
            lat: 32.732103,
            lng: -117.147457
        },
    },
    SCULPTUREGARDEN: {
        center: {
            lat: 32.731787,
            lng: -117.151388
        },
        UCSDEXTENSION: {
            center: {
                lat: 32.853088,
                lng: -117.182885
            },
        },

        //hardcode more here, or replace center
    }
}
initMap();

function initMap() {
    // Create the map.
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14.2,
        center: {
            lat: 32.734148,
            lng: -117.144553
        },
        gestureHandling: 'greedy',
        mapTypeId: 'satellite'
    });



    for (var city in citymap) {
        // Add the circle for each scav to the map.
        var cityCircle = new google.maps.Circle({
            strokeColor: '#ff4d4d',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#ff4d4d',
            fillOpacity: 0.35,
            map: map,
            center: citymap[city].center,
            radius: Math.sqrt(2) * 25
        });
    }
}
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 14.2,
            center: {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            },
            gestureHandling: 'greedy',
            mapTypeId: 'satellite'
        });

        var marker = new google.maps.Marker({
            position: {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            },
            map: map,
            title: 'Hello World!'
        });
        infoWindow.setPosition(pos);
        infoWindow.setContent('Location found.');
        infoWindow.open(map);
        map.setCenter(pos);
    }, function() {
        handleLocationError(true, infoWindow, map.getCenter());
    });
} else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
}


function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}
MUC.init();