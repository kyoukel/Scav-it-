const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: 'de1dff9bec7a40438eacef4b649661b1'
})

app.models.predict(Clarifai.GENERAL_MODEL, "https://i.kinja-img.com/gawker-media/image/upload/s--Bn2VwpCz--/c_fill,fl_progressive,g_center,h_900,q_80,w_1600/zanbtgsvf9iqnxxhtt3v.jpg").then(
    function(response){
        // do stuff w/response
        console.log(response.outputs[0].data.concepts);
    },
    function(err){
        // there was an error!
        console.log(err);
    }
)