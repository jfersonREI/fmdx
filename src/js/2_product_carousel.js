/*===================================================================================*/
/*  OWL CAROUSEL
/*===================================================================================*/


$(function() {
"use strict";
$('.product-carousel').owlCarousel({
    loop: false,
    margin: 20,
    nav: true,
    responsive:{
        0:{
            items:1
        },
        600:{
            items:2
        },
        768:{
            items:2
        },
        992:{
            items:3
        },
        1200:{
            items:4
        }
    }
});
});

