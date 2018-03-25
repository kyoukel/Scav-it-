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
    getState: function (state) {
        this.state = state
    },
    getCount: function (list) {
        console.log(list)
        return Object.keys(list).length
    },
    getPlace: function (index) {
        return this.state.places[`place${index}`]
    },
    getPlaces:function(){
        return this.getCount(this.state.places)
    }
}

//
// get data from Firebase
//
database.ref("games").on("child_added", function (snapshot) {
    if (snapshot.val().name === "Balboa Park") {
        // log object to the console.
        console.log(snapshot.val());
        games.getState(snapshot.val())
        var count = games.getCount(games.state.places)
        var place = games.getPlace(5)
        console.log(games, place)
        console.log(games.getPlaces())
    }
    // console log errors
    }, function (errorObject) {
        console.log("ERRORS: " + errorObject.code);
});

var MUC = {
    formData: {
        location: {},
        file: ''
    },
    attrs: { // this is PLACEHOLDER STUFF
        0: 'blue',
        1: 'cat',
        2: 'mammal',
        4: 'bike'
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

        $('#messenger-wrapper').slideUp().css('display', 'block');

        // this is set when the image is entered in a field.
        $('#base64').on('change', function(){
            // submit the form and grab the base64 encoded image
            MUC.submitForm($(this).val());
        })

        $('#predictions').on('change', function(){
            var parsedPredictions = JSON.parse($(this).val());
            // console.log(parsedPredictions);
            MUC.checkPredictions(parsedPredictions);
        });

        // make the data from the submitted image in the input
        $('#userImage').on('change', function(){
            // makes the data, then sets a ui element for another function call
            MUC.makeData();
        });
    },
    makePlayer: function( playerName ){
        // debugger;
        // Set player key, either playerA or player1
        
        var playerKey = firebase.database().ref('players/').push({
            name: playerName
        });

        document.cookie = `player=${playerKey}`;
        console.log('create a coockie wih this!' + playerKey);
        // somehow set a cookie to persist the current player

        $('#splash').slideToggle('slow');
        
    },
    clarifaiImg: function(img64){// this calls the clarfai app and resturns the list of predictors
        var app = new Clarifai.App({
            apiKey: 'de1dff9bec7a40438eacef4b649661b1'
        });

        var img_arr = img64.split(',');
        var index = (img_arr.length - 1);
        cl_image = img_arr[index];
        var image_for_clarifai = { base64: cl_image }

        console.log('clarifai image coming out!');
        console.log(image_for_clarifai);

        var predictors = app.models.predict(Clarifai.GENERAL_MODEL, image_for_clarifai ).then(
            function(response){
                // do stuff w/response
                // console.log(response.outputs[0].data.concepts);
                $('#predictions').val(JSON.stringify(response.outputs[0].data.concepts)).trigger('change');
                return response.outputs[0].data.concepts;
            },
            function(err){
                // there was an error!
                console.log(err);
            }
        )

        return predictors;
    },
    submitForm: function(image64){
        // console.log(formData);
        var predictions = MUC.clarifaiImg(image64);
    },
    checkPredictions: function(predictions){
        $.each( MUC.attrs, function(attrKey, attr){
            $.each( predictions, function(predKey, predProperties){
                if(predProperties.name === attr){
                    console.log( `We've got a ${attr} people!`);
                    
                }
            });
        });
    },
    messenger: function(mssg, mssgType ){
        // MAKE ME
        // <div class="alert alert-primary" role="alert">
        // This is a primary alert—check it out!
        // </div>
        var alertType = (mssgType !== 'good') ? 'alert-danger': 'alert-success';
        var styling = {
            class: 'alert ' + alertType
        }
        var text = '<h3>' + mssg + '</h3>';
        var $div = $("<div>").attr(styling).html(text);
        $('#messenger-wrapper').append($div);
        $('#messenger-wrapper').slideDown('fast', function(){
            // kill the messege in 4 sec
            setTimeout(function(){
                $('#messenger-wrapper').slideUp('fast').html('');
            }, 4000);
        });
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
                $('#base64').val(e.target.result).trigger('change');
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
}


MUC.init();

