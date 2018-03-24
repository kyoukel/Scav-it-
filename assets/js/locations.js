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
        // infoWindow.setPosition(pos);
        // infoWindow.setContent('Location found.');
        // infoWindow.open(map);
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