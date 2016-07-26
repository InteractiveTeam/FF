var indexImage = "",
    images = ["img/ax-large.png"];
//(function($){
    jQuery.noConflict();
    jQuery(document).ready(function($){
        initMap(event.lat,event.lng);
        var events = $('.ax-miniEvent .ax-eventLines').sort(function() {return 0.5-Math.random()});
        TweenMax.staggerTo(events,0.5,{scale:1,opacity:1, ease:Back.easeIn},0.1);
        
        TweenMax.staggerFrom('.ax-circle',0.7,{delay:0.5,scale:0, ease:Power2.easeOut},0.15);
        
        $(".ax-miniEvent").on('click',function(){
            indexImage = ($(this).data('index')) - 1;
            TweenLite.to('.ax-modal',0.7,{opacity:1,display:'block', ease:Power2.easeOut});
            // $(".ax-mainEvent").addClass('ax-mainEvent'+indexImage);
            detailEvent(indexImage);
        });
        $(".ax-close-modal").on('click',function(){
            // TweenMax.staggerFrom('.ax-detail-right p',0.7,{y:-20,opacity:1, ease:Power2.easeIn, force3D:true},-0.1);
            TweenMax.to('.ax-modal',0.7,{delay:0.4,display:'none',opacity:0, ease:Power2.easeOut});
            
            TweenMax.to('.ax-mainEvent li',0,{opacity:0});
            setTimeout(function() {
               $(".ax-mainEvent").removeClass('ax-mainEvent'+indexImage);
            }, 1000);
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
    jQuery(window).load(function ($) {
        preload = function (imageArray, index) {
            index = index || 0; 
            if (imageArray && imageArray.length > index) { 
                var img = new Image(); img.onload = function () { preload(imageArray, index + 1); }; img.src = images[index]; 
            }
        }

        preload(images);
    });    
//})(jQuery);


function detailEvent(i){
    var event = dataEvents[i];
    
    var eventName = document.getElementsByClassName('ax-text-event')[0],
        place = document.getElementsByClassName('ax-text-place')[0],
        date = document.getElementsByClassName('ax-text-date')[0],
        hour = document.getElementsByClassName('ax-text-hour')[0],
        title = document.getElementsByClassName('ax-tittle')[0];
    title.innerHTML = event.event;
    eventName.innerHTML = event.event;
    place.innerHTML = event.place;
    date.innerHTML = event.date;
    hour.innerHTML = event.hour;
    

    TweenMax.staggerFrom('.ax-detail-right p',0.5,{delay:0.2,y:15,opacity:0,ease:Power1.easeOut},0.15);
    TweenMax.from(title,0.8,{delay:0.4,opacity:0,ease:Power1.easeOut,onComplete:initMap,onCompleteParams:[event.lat,event.lng]});
//    TweenLite.from('.ax-mainEvent',0.7,{scale:1.1,delay:0.3,autoAlpha:0,ease:Power1.easeOut});
//    TweenLite.from('#map',0.9,{delay:1,autoAlpha:0,ease:Power1.easeOut});
        
//    TweenLite.to('.ax-mainEvent .ax-eventRow1',0.7,{delay:0.9,autoAlpha:1,backgroundPosition:'0 -533px',ease:Power1.easeOut});
//    TweenLite.to('.ax-mainEvent .ax-eventRow2',0.7,{delay:1.1,autoAlpha:1,backgroundPosition:'0 -1066px',ease:Power1.easeOut});
//    TweenLite.to('.ax-mainEvent .ax-eventRow3',0.7,{delay:1.3,autoAlpha:1,backgroundPosition:'0 -1599px',ease:Power1.easeOut});
    
    //TweenLite.to('.ax-mainEvent li',0,{width:800});
//    initMap(event.lat,event.lng);
}

function filter(){
    var strSelect = this.options[this.selectedIndex].value;
    var filter = jQuery(".ax-miniEvent").filter(function(i){
        var bandera = (jQuery(this).data('filter') === strSelect)?true:false;
        
        if(jQuery(this).data('filter') === 'todos')
            return jQuery(this)
        else
            if(bandera) return jQuery(this)
    });
    
    var filterSelection = function(data){        
        var filter = jQuery(".ax-miniEvent").filter(function(i){            
            if(jQuery(this).data('index') != data.data('index'))
                return jQuery(this)            
        });
        console.log(filter);
//        TweenMax.staggerTo(data.find('.ax-event'),0.7,{opacity:0},0.1);
        TweenMax.staggerTo(filter.find('.ax-event'),0.7,{opacity:0},0.1);
    }

    if(!filter.length){
        TweenMax.staggerTo(".ax-eventLines",0.8,{opacity:1},0.1);
//        TweenMax.staggerTo('.ax-miniEvent .ax-event',0.8,{opacity:0},0.1);
    }else{
//        TweenMax.staggerTo(".ax-miniEvent .ax-eventLines",0.8,{opacity:0},0.1);
        TweenMax.staggerTo(filter.find('.ax-event'),0.8,{opacity:1,onComplete:filterSelection,onCompleteParams:[filter]},0.1);
    }
}

function initMap(endLat,endLng) {
    // HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: 6.2208617,//position.coords.latitude,
                lng: -75.5610245//position.coords.longitude
            };

            var coords = new google.maps.LatLng(pos.lat, pos.lng);

            var directionsService = new google.maps.DirectionsService();
            var directionsDisplay = new google.maps.DirectionsRenderer();

            var mapOptions = {//Sets map options                             
                zoom: 13,  //Sets zoom level (0-21)
                center: coords //zoom in on users location                
            };

            /*
                Creates Map variable
                Creates a new map using the passed optional parameters in the mapOptions parameter.
            */
            map = new google.maps.Map( document.getElementById("map"), mapOptions);
            
            //directionsDisplay.setPanel(document.getElementById('panel')); //Show Info to Reach            
            var request = {
                origin: coords,
                destination: endLat + ' ' + endLng,
                travelMode: google.maps.TravelMode.TRANSIT,//google.maps.DirectionsTravelMode.TRANSIT,
                // transitOptions: {
                //     //departureTime : new Date(Date.now() + 654),
                //     modes: [google.maps.TransitMode.BUS],
                //     routingPreference: google.maps.TransitRoutePreference.FEWER_TRANSFERS
                // },
                // unitSystem: google.maps.UnitSystem.METRIC,
                provideRouteAlternatives: true
            };
            
            directionsService.route(request, function (response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setMap(map);
                                        
                    directionsDisplay.setDirections(response);
                                        
                    var distance  = response.routes[0].legs[0].distance.text;
                    var duration  = response.routes[0].legs[0].duration.text;

                    //$(".data").html('<p> Distancia => '+distance+'</p><br><p> Duration => '+duration+'</p>');
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