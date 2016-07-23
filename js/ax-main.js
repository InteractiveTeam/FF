var indexImage = "";
$(document).ready(function(){
    var events = $('.ax-miniEvent .ax-event').sort(function() {return 0.5-Math.random()});
    TweenMax.staggerTo(events,0.5,{scale:1,opacity:1, ease:Back.easeIn},0.1);
    
    $(".ax-miniEvent").on('click',function(){
        indexImage = $(this).data('index');
        TweenMax.to('.ax-modal',0.7,{display:'block',opacity:1, ease:Power2.easeOut});
        $(".ax-mainEvent").addClass('ax-mainEvent'+indexImage);
        detailEvent(indexImage);
    });
    $(".ax-close-modal").on('click',function(){
        $(".ax-mainEvent").removeClass('ax-mainEvent'+indexImage);
        TweenMax.to('.ax-modal',0.7,{display:'none',opacity:0, ease:Power2.easeOut});
    });
    
    var select = document.getElementById("filterEvents");    
    select.addEventListener("change", filter,false);
    
    for (var i = 0; i<dataEvents.length; i++){
        var opt = document.createElement('option');
        opt.value = dataEvents[i].event;
        opt.innerHTML = dataEvents[i].event;
        select.appendChild(opt);
    }
});

function detailEvent(i){
    var event = dataEvents[i];
    initMap(event.lat,event.lng);
}

function filter(){
    var strSelect = this.options[this.selectedIndex].value;
    var filter = $(".ax-miniEvent").filter(function(i){
        var bandera = ($(this).data('filter') === strSelect)?true:false;
        
        if($(this).data('filter') === 'todos')
            return $(this)
        else
            if(bandera) return $(this)        
    });
    
    var filterSelection = function(data){
//        console.log(data);
        TweenMax.staggerTo(data.find('.ax-event'),0.7,{opacity:1},0.1);
        TweenMax.staggerTo(data.find('.ax-event .ax-eventLines'),0.7,{opacity:0},0.1);
    }
    
    if(!filter.length){
        TweenMax.staggerTo(".ax-miniEvent .ax-event",0.8,{opacity:1},0.1);
        TweenMax.staggerTo('.ax-eventLines',0.8,{opacity:0},0.1);
    }else{        
        TweenMax.staggerTo(".ax-miniEvent .ax-event",0.8,{opacity:0},0.1);
        TweenMax.staggerTo('.ax-eventLines',0.8,{opacity:1,onComplete:filterSelection,onCompleteParams:[filter]},0.1);
    }
}

function initMap(endLat,endLng) {
    // HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            var coords = new google.maps.LatLng(pos.lat, pos.lng);

            var directionsService = new google.maps.DirectionsService();
            var directionsDisplay = new google.maps.DirectionsRenderer();

            var mapOptions = {//Sets map options                             
                zoom: 14,  //Sets zoom level (0-21)
                center: coords, //zoom in on users location
                mapTypeControlOptions: {
                  mapTypeIds: ['coordinate', google.maps.MapTypeId.TRANSIT],
                  style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
                },
                mapTypeControl: true, //allows you to select map type eg. map or satellite
//                navigationControlOptions: {
//                    style: google.maps.NavigationControlStyle.SMALL //sets map controls size eg. zoom
//                },
                mapTypeId: google.maps.MapTypeId.ROADMAP //sets type of map Options:ROADMAP, SATELLITE, HYBRID, TERRIAN
            };

            /*
                Creates Map variable
                Creates a new map using the passed optional parameters in the mapOptions parameter.
            */
            map = new google.maps.Map( document.getElementById("map"), mapOptions);
            
            //directionsDisplay.setPanel(document.getElementById('panel')); //Show Info to Reach
            console.log(google.maps.TransitRoutePreference);
            var request = {
                origin: coords,
                destination: endLat + ' ' + endLng,
                travelMode: google.maps.TravelMode.TRANSIT,//google.maps.DirectionsTravelMode.TRANSIT,
                transitOptions: {                    
                    modes: [google.maps.TransitMode.BUS],
                    routingPreference: google.maps.TransitRoutePreference.FEWER_TRANSFERS
                },
                unitSystem: google.maps.UnitSystem.IMPERIAL
            };
            
          
            
            directionsService.route(request, function (response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setMap(map);
                    
                    //Setting the transit layer if you need 
                    var transitLayer = new google.maps.TransitLayer();
                    transitLayer.setMap(map);
                    
                    //directionsDisplay.setDirections(response);
                    display.setDirections(response);
                    
                    var distance  = response.routes[0].legs[0].distance.text;
                    var duration  = response.routes[0].legs[0].duration.text;

                    $(".data").html('<p> Distancia => '+distance+'</p><br><p> Duration => '+duration+'</p>');
                }
            });             
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}


function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    if(browserHasGeolocation){
        alert('Lo sentimos debes aceptar la localización');
    }else{
        alert('Lo sentimos tu navegador soporte la geolocalicación');
    }
}