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