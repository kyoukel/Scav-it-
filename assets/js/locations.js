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
// initMap(citymap);

function initMap(citymap) {
    // Create the map.
    window.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16.2,
        center: {
            lat: citymap.lat,
            lng: citymap.lng
        },
        gestureHandling: 'greedy',
        mapTypeId: 'satellite'
    });

    var places = citymap.places;

    for (var placeKey in places) {

        var place = places[placeKey];

        var placeCenter = {// be careful, these are reversed!
            lat: place.lat,
            lng: place.lng
        };

        // console.log(placeCenter);

        // placeCenter = {
        //     lat: 32.731978,
        //     lng: -117.149235
        // };

        // Add the circle for each scav to the map.
        var cityCircle = new google.maps.Circle({
            strokeColor: '#FF69B4',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF69B4',
            fillOpacity: 0.65,
            map: map,
            center: placeCenter,
            radius: Math.sqrt(2) * 25
        });
    }
}
var getLocation = function(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            // var map = new google.maps.Map(document.getElementById('map'), {
            //     zoom: 14.2,
            //     center: {
            //         lat: position.coords.latitude,
            //         lng: position.coords.longitude
            //     },
            //     gestureHandling: 'greedy',
            //     mapTypeId: 'satellite'
            // });
            
            // update the center of the map
            window.map.setCenter(pos);
    
            var marker = new google.maps.Marker({
                position: {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                },
                map: map,
                title: 'Balboa Park'
            });

            // set the location into the form
            $('#userLat').val(position.coords.latitude);
            $('#userLong').val(position.coords.longitude);

            // infoWindow.setPosition(pos);
            // infoWindow.setContent('Location found.');
            // infoWindow.open(map);
            // map.setCenter(pos);
            //     }, function() {
            //         handleLocationError(true, infoWindow, map.getCenter());
        });
    }
}
// wait for the doc before trying to get location?
$(document).ready(function(){
    // get the location from geolocation
    getLocation();
});
// else {
//     // Browser doesn't support Geolocation
//     handleLocationError(false, infoWindow, map.getCenter());
// }



function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

//
// https://www.geodatasource.com/developers/javascript
//
function distance(lat1, lon1, lat2, lon2) {
    // console.log(lat1, lon1, lat2, lon2)
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

var rad = function(x) {
    return x * Math.PI / 180;
};

//   pLat1, pLng1, pLat2, pLng2
// var getDistance = function(p1, p2) {
//     var R = 6378137; // Earth’s mean radius in meter
//     var dLat = rad(p2.lat() - p1.lat());
//     var dLong = rad(p2.lng() - p1.lng());
//     var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//         Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) *
//         Math.sin(dLong / 2) * Math.sin(dLong / 2);
//     var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     var d = R * c;
//     return d; // returns the distance in meter
// };

function distance(lat1, lon1, lat2, lon2, unit) {
	var radlat1 = Math.PI * lat1/180
	var radlat2 = Math.PI * lat2/180
	var theta = lon1-lon2
	var radtheta = Math.PI * theta/180
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist)
	dist = dist * 180/Math.PI
	dist = dist * 60 * 1.1515
	if (unit=="K") { dist = (dist * 1.609344)/10 }
	if (unit=="N") { dist = dist * 0.8684 }
	return dist
}

//
// round long numbers
//
function precisionRound(number, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
}

//
// Convert degrees to radians
//
function toRad(deg) {
    return deg * Math.PI / 180;
}

//
// Convert radians to degrees
//
function toDeg(rad) {
    return rad * 180 / Math.PI;
}

//
// https://gist.github.com/felipeskroski/8aec22f01dabdbf8fb6b
//
function degToCard(deg) {
    if (deg > 11.25 && deg < 33.75) {
        return "NNE";
    } else if (deg > 33.75 && deg < 56.25) {
        return "ENE";
    } else if (deg > 56.25 && deg < 78.75) {
        return "E";
    } else if (deg > 78.75 && deg < 101.25) {
        return "ESE";
    } else if (deg > 101.25 && deg < 123.75) {
        return "ESE";
    } else if (deg > 123.75 && deg < 146.25) {
        return "SE";
    } else if (deg > 146.25 && deg < 168.75) {
        return "SSE";
    } else if (deg > 168.75 && deg < 191.25) {
        return "S";
    } else if (deg > 191.25 && deg < 213.75) {
        return "SSW";
    } else if (deg > 213.75 && deg < 236.25) {
        return "SW";
    } else if (deg > 236.25 && deg < 258.75) {
        return "WSW";
    } else if (deg > 258.75 && deg < 281.25) {
        return "W";
    } else if (deg>281.25 && deg < 303.75) {
        return "WNW";
    } else if (deg>303.75 && deg < 326.25) {
        return "NW";
    } else if (deg>326.25 && deg < 348.75) {
        return "NNW";
    } else {
        return "N"; 
    }
}
