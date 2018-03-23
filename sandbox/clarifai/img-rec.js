const app = new Clarifai.App({
    apiKey: 'de1dff9bec7a40438eacef4b649661b1'
})

var predictor = function( screenshot ){
    app.models.predict(Clarifai.GENERAL_MODEL, screenshot ).then(
        function(response){
            // do stuff w/response
            console.log(response.outputs[0].data.concepts);
        },
        function(err){
            // there was an error!
            console.log(err);
        }
    )
}