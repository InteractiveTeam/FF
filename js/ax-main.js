var indexImage = "",
    images = [
        "img/ax-large.png",
        "img/ax-close.png",
        "img/ax-flores-1.png",
        "img/ax-flores-2.png",        
        "img/ax-logo-metro.png",
        "img/ax-map.png",
        "img/ax-small.png",
        "img/background-text.png",
        "img/texture-home-flores-3.png",
        "img/texture-home-flores-1.png"
    ];
//(function($){
    jQuery.noConflict();
    jQuery(document).ready(function($){
        initMap(6.2709888,-75.5652386);
        
        $("body").animate({opacity:1},800);
        
        var events = $('.ax-miniEvent .ax-eventLines').sort(function() {return 0.5-Math.random()});
        TweenMax.staggerTo(events,0.6,{scale:1,opacity:1, ease:Back.easeIn},0.15);

        TweenMax.staggerFrom('.ax-circle',0.7,{delay:0.5,scale:0, ease:Power2.easeOut},0.15);
        
        $(".ax-miniEvent").on('click',function(){
            indexImage = ($(this).data('index')) - 1;
            
            $('.ax-modal').css({'z-index':10}).animate({opacity:1},700,function(){                
                $(".ax-mainEvent").addClass('ax-mainEvent'+indexImage);
                detailEvent(indexImage);
                
            });
            //TweenLite.to('.ax-modal',0.7,{css:{'z-index':10,opacity:1}, ease:Power2.easeOut});            
        });
        $(".ax-close-modal").on('click',function(){            
            //TweenMax.to('.ax-modal',0.7,{css:{'z-index':-3,opacity:0}, ease:Power2.easeOut});
            $('.ax-modal').animate({opacity:0},700,function(){
                $(this).css({'z-index':-3});
                $(".ax-mainEvent").removeClass('ax-mainEvent'+indexImage);
            })
            jQuery(".ax-eventRow1,.ax-eventRow2").removeAttr('style');
            jQuery(".ax-eventRow3").removeClass('papadear');
            
//            setTimeout(function() {
//               $(".ax-mainEvent").removeClass('ax-mainEvent'+indexImage);
//            }, 1000);
        });        
    });
    jQuery(window).load(function ($) {
        var select = document.getElementById("filterEvents");        
        var dataEvents = eventsData().sort(function(a, b) {
          return compareStrings(a.event, b.event);
        });
        
        select.addEventListener("change", filter,false);
        
        for (var i = 0; i<dataEvents.length; i++){
            var opt = document.createElement('option');
            opt.value = dataEvents[i].event;
            opt.innerHTML = dataEvents[i].event;
            select.appendChild(opt);
        }
        preload = function (imageArray, index) {
            index = index || 0; 
            if (imageArray && imageArray.length > index) { 
                var img = new Image(); img.onload = function () { preload(imageArray, index + 1); }; img.src = images[index]; 
            }
        }

        preload(images);
    });    
//})(jQuery);

function compareStrings(a, b) {
  // Assuming you want case-insensitive comparison
  a = a.toLowerCase();
  b = b.toLowerCase();

  return (a < b) ? -1 : (a > b) ? 1 : 0;
}

function detailEvent(i){
    var event = eventsData()[i];//dataEvents[i];
    
    var place = document.getElementsByClassName('ax-text-place')[0],
        date = document.getElementsByClassName('ax-text-date')[0],
        hour = document.getElementsByClassName('ax-text-hour')[0],
        title = document.getElementsByClassName('ax-tittle')[0];
    title.innerHTML = event.event;
    place.innerHTML = event.place;
    date.innerHTML = event.date;
    hour.innerHTML = event.hour;
    
    var addParpadear = function(){  
        jQuery(".ax-eventRow3").removeAttr('style');
        jQuery(".ax-eventRow3").addClass('papadear');
        initMap(event.lat,event.lng);
    };
    
    
    jQuery(title).animate({opacity:1},700,function(){
        addParpadear();
    });
    
    //TweenMax.staggerFrom('.ax-detail-left .ax-grid-6 p',0.4,{y:15,opacity:0,ease:Power1.easeOut},0.14);    
    //TweenLite.from(title,0.8,{opacity:0,ease:Power1.easeOut,onComplete:addParpadear},'-=0.16');
    
    
    
//    TweenLite.to('.ax-mainEvent .ax-eventRow1',0.7,{autoAlpha:1},'-=0.3');
//    TweenLite.to('.ax-mainEvent .ax-eventRow2',0.7,{autoAlpha:1},'-=0.3');//,onComplete:initMap,onCompleteParams:[event.lat,event.lng]
//    TweenLite.to('.ax-mainEvent .ax-eventRow3',0.7,{autoAlpha:1,ease:Power1.easeIn},'-=0.16');     
}

function filter(){
    var strSelect = this.options[this.selectedIndex].value;
    var filter = jQuery(".ax-miniEvent").filter(function(i){
        var bandera = (jQuery(this).data('filter') === strSelect)?true:false;
        
        //if(jQuery(this).data('filter') === 'todos')
        if(strSelect === 'todos'){            
            return jQuery(this)
        }else{
            if(bandera) return jQuery(this)
        }
    });
    
    var filterSelection = function(data){
        var filter = jQuery(".ax-miniEvent").filter(function(i){            
            if(jQuery(this).data('index') != data.data('index'))
                return jQuery(this)
        });        
        TweenMax.to(filter.find('.ax-event'),0.3,{opacity:0,ease:Power1.easeOut});
    }

    if(filter.length == 13){
        var selectAll = function(filter){
            TweenMax.staggerTo(filter.find(".ax-event"),0.3,{opacity:1,ease:Power1.easeOut},0.1);
            TweenMax.staggerTo(filter.find(".ax-event"),0.3,{delay:0.7,opacity:0,ease:Power1.easeOut},0.1);
        }
        TweenMax.to('.ax-miniEvent .ax-event',0,{opacity:0,onComplete:selectAll,onCompleteParams:[filter]});        
    }else{
        //TweenMax.staggerTo(filter.find('.ax-event'),0.4,{opacity:1,onComplete:filterSelection,onCompleteParams:[filter]},0.1);
        TweenMax.staggerTo(filter.find('.ax-event'),0.3,{opacity:1,onComplete:filterSelection,onCompleteParams:[filter]},0.1);
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
                    
                    //duration
                    var distance  = response.routes[0].legs[0].distance.text;
                    var duration  = response.routes[0].legs[0].duration.text;

                    jQuery(".ax-text-duration").html(duration.replace('hour','hora'));
                    jQuery(".ax-text-distance").html(distance);
                }
            });
        }, function() {
            //handleLocationError(true, infoWindow, map.getCenter());
            jQuery('.ax-message-map').css('display','block');
        });
    } else {
        // Browser doesn't support Geolocation
        jQuery('.ax-message-map').css('display','block');
        //handleLocationError(false, infoWindow, map.getCenter());
    }
}


function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    if(browserHasGeolocation){
        alert('Lo sentimos debes aceptar la localización');
    }else{
        alert('Lo sentimos tu navegador soporte la geolocalicación');
    }
}

function enableUbi(){
    var data = eventsData()[indexImage];
    initMap(data.lat,data.lng);
}

function eventsData(){
    var dataEvents = [
    {
        event:'Inauguración oficial-Festival de Orquestas',
        date:'Julio 29',
        hour:'6:00 p.m. a 1:00 a.m',
        place:'Obelisco',
        lat:6.2570995,
        lng:-75.5943526
    },
    {
        event:'Festival de la trova',
        date:'Julio 29 a agosto 5',
        hour:'6:00 p.m. a 1:00 a.m.',
        place:'Parque Pies Descalzos',
        lat:6.24499,
        lng:-75.57738
    },
    {
        event:'Parque Cultural Nocturno',
        date:'Julio 31 a agosto 5',
        hour:'6:00 p.m. a 1:00 a.m.',
        place:'Plaza Gardel',
        lat:6.2181482,
        lng:-75.5869389
    },
    {
        event:'La feria a ritmo de bicicleta',
        date:'Julio 30',
        hour:'2:00 p.m',
        place:'Parque de las Luces',
        lat:6.2458201,
        lng:-75.5722863
    },
    {
        event:'Desfile de Silleteritos',
        date:'Julio 30',
        hour:'Hora: 10:00 a.m. a 1:00 p.m.',
        place:'Barrio La Floresta',
        lat:6.257766,
        lng:-75.598715
    },
    {
        event:'Caminata canina y de mascotas',
        date:'Julio 31',
        hour:'8:00 a.m',
        place:'Salida desde la estación Estadio',
        lat:6.2531633,
        lng:-75.588918
    },
    {
        event:'Parque cultural. Noches con lo mejor del bolero, la música afro, colombiana y tropical',
        date:'julio 31 y agosto 1 al 5',
        hour:'N/A',
        place:'Plaza Gardel',
        lat:6.2181482,
        lng:-75.5869389
    },
    {
        event:'Plaza de Flores. Muestra de cultura paisa con gastronomía, artesanía, música y juegos tradicionales',
        date:'Agosto 2 al 6',
        hour:'Martes y miércoles: 12 m. a 10 p.m. <br>Jueves y sábado de 12 m. a 12 p.m.',
        place:'Contiguo al Mamm (estación Industriales)',
        lat:6.2243422,
        lng:-75.574462
    },
    {
        event:'Gospel Park',
        date:'Julio 31',
        hour:'1:00 a 11:00 p. m.',
        place:'Parque de los Deseos (Estación Universidad)',
        lat:6.2686003,
        lng:-75.5665116
    },
    {
        event:'Zona que Suena. Parque temático de naturaleza fantástica para los niños',
        date:'Julio 30 y 31',
        hour:'11:00 a.m. a 6:00 p.m.',
        place:'Parque Norte (Estación Universidad)',
        lat:6.2727881,
        lng:-75.5703963
    },
    {
        event:'Desfile de autos clásicos y antiguos',
        date:'Julio 29',
        hour:'6:00 p.m. a 1:00 a.m',
        place:'Salida de la sede del periódico El Colombiano',
        lat:6.1776305,
        lng:-75.591847
    },
    {
        event:'Desfile de Silleteros',
        date:'Agosto 7',
        hour:'2:00 p.m.',
        place:'Av. Guayabal-Calle 10- Plaza Gardel',
        lat:6.2181482,
        lng:-75.5869389
    },
    {
        event:'Orquídeas, Pájaros y Flores',
        date:'Agosto 3 al 7',
        hour:'8:00 a. m. a 8:00 p. m',
        place:'Jardín Botánico',
        lat:6.2709888,
        lng:-75.5652386
    }
]
    return dataEvents;
}