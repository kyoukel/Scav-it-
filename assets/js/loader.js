var Loader = {
    init: function(){
        $('#userImage').on('click', function(){
            Loader.makeLoader();
        });
    },
    makeLoader: function(){
        var $loader = $('<div>');
        loaderBg = "background-image: url(./assets/images/puzzle-box.gif);";

        loaderAttrs = {
            class: 'puzzle-box',
            style: loaderBg,
        }

        $loader.attr(loaderAttrs);

        $('#messenger-wrapper').html($loader);
        $('#messenger-wrapper').slideDown('fast', function(){
            // kill the messege in 4 sec
            // setTimeout(function(){
            //     $('#messenger-wrapper').slideUp('fast').html('');
            // }, 8000);
            // messenger will swoop in soon...
        });
    }
}

Loader.init();