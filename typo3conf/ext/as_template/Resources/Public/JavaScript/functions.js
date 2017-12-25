function mainPageSlider() {
    var containerMargin = parseFloat($('.container').css('margin-left'));
    var sliderItemWidth = $('.slider .slider__item.slick-active').width();
    var sliderWidth = $('.slider').width();
    var diff = sliderWidth - sliderItemWidth;
    if(sliderWidth > 1200) {
        $('.slider .dots').css({
            'left': $('.container').offset().left + 850
        });
        $('.slider .slider__wraper').css({
            'width': 'calc(100% + ' + Math.abs(diff - containerMargin*2 - 15) + 'px)',
            'left': '-' + Math.abs(diff - containerMargin*2 - 15) + 'px'
        });
    } else {
        $('.slider .slider__wraper').attr('style', '');
    }
}

jQuery.expr[":"].Contains = jQuery.expr.createPseudo(function(arg) {
    return function( elem ) {
        return jQuery(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
    };
});

$(function() {
    // -------------- Body map -------------- 
    var textRightArrow = $('.circle.dynamic + p').text();
    var toggle = false;
    $('img[usemap]').rwdImageMaps();
    $('img[usemap]').after(createSvg());

    function createSvg() {
        var svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
        var polygonPath = '';
        var shapesCount = $('.main-shape').length;
        var markersCount = [$("a.marker-women").length, $("a.marker-boy").length, $("a.marker-men").length];
        var classes = ["women", "boy", "men"];
        
        $(svg).css({
            "width": $("img[usemap]").width(),
            "height": $("img[usemap]").height()
        });
        $(svg).attr("viewBox", "0 0 "+$("img[usemap]").width()+" "+$("img[usemap]").height())
        $(svg).addClass("img-svg");

        for(var i = 0; i<shapesCount; i++) {
            var polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
            var path = $('.main-shape').eq(i).attr('coords').split(',');
            polygonPath = '';
            for(var j = 0; j<path.length - 2; j+=2) {
                polygonPath += path[j]+','+path[j+1]+' ';
            }
            $(polygon).attr("points", polygonPath);
            $(polygon).addClass(classes[i]);
            $(svg).append($(polygon));

            createMarkers(svg, i, markersCount[i], classes);
        }
        return svg;
    }

    function createMarkers(svgOb, start, end, classNames) {
        for(var k = 0; k<end; k++) {
            var group = document.createElementNS("http://www.w3.org/2000/svg", "g");
            var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            var innerCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            $(group).addClass('marker '+'marker-'+classNames[start]);
            $(group).attr("data-target", $('a.marker-'+classNames[start]).eq(k).attr("data-target"))
            $(circle).attr("cx", $('a.marker-'+classNames[start]).eq(k).attr("data-left"));
            $(circle).attr("cy", $('a.marker-'+classNames[start]).eq(k).attr("data-top"));
            $(circle).attr("r", "10");
            $(circle).attr("fill", "#5380bc");
            $(innerCircle).attr("cx", $('a.marker-'+classNames[start]).eq(k).attr("data-left"));
            $(innerCircle).attr("cy", $('a.marker-'+classNames[start]).eq(k).attr("data-top"));
            $(innerCircle).attr("r", "6");
            $(innerCircle).attr("stroke-width", "2");
            $(innerCircle).attr("stroke", "#ffffff");
            $(innerCircle).attr("fill", "transparent");
            $(group).append($(circle))
            $(group).append($(innerCircle))
            $(svgOb).append($(group));
        }
    }

    function createPopup(text) {
        var popupWraper = document.createElement('div');
        $(popupWraper).addClass('body-map-popup');
        var popupText = document.createElement('p');
        $(popupText).text(text);
        $(popupWraper).append($(popupText));
        $('body').append($(popupWraper));
    }

    function removePopup() {
        $('.body-map-popup').remove();
    }

    $('polygon').on('mouseover', function() {
        var selector = $(this).attr('class');
        $('.marker-'+selector).css({
            "opacity": "1"
        });
    });
    $('polygon').on('mouseleave', function() {
        $('.marker').attr("style", "");
        if($('.img-svg').hasClass('active')) {
            var selector = '';
            if($('.marker.active').hasClass('marker-women')) {
                selector = '.marker-women'
            } else if($('.marker.active').hasClass('marker-boy')) {
                selector = '.marker-boy'
            } else {
                selector = '.marker-men'
            }
            $(selector).css({
                "opacity": "1"
            });
        }
    });

    $('.marker').on('mouseenter', function() {
        $('.circle.dynamic').css({
            'transform': 'rotate(180deg)'
        });
        var markerType = ''
        if($(this).hasClass('marker-women')) {
            markerType = 'women'
        } else if($(this).hasClass('marker-boy')) {
            markerType = 'boy'
        } else {
            markerType = 'men'
        }
        $('polygon.'+markerType).css({
            "fill": "rgba(83,128,188, 0)"
        });
        $('.marker-'+markerType).css({
            "opacity": ".5"
        });
        $(this).css({
            "opacity": "1"
        });
        $('.circle.dynamic + p').text($(this).attr("data-target"));
        createPopup($(this).attr("data-target"));
        $('.body-map-popup').css({
            "top": $(this).offset().top - 10,
            "left": $(this).offset().left + 30
        });
    });
    $('.marker').on('mouseleave', function() {
        if(!$(this).hasClass('active')) {
            $('polygon').removeAttr('style');
            if($('.marker.active').length > 0) {
                $('.circle.dynamic + p').text($('.marker.active').attr('data-target'));
            } else {
                $('.circle.dynamic + p').removeAttr('style').text(textRightArrow);
                $('.circle.dynamic').attr("style", "");
            }
        }
        removePopup();
    });
    $('.marker').on('click', function() {
        $('.body-compass-lists ul').removeClass('reduced');
        $('.body-compass-lists ul li').removeAttr('style');
        if($(this).hasClass('active')) {
            $('.marker').removeClass('active');
        } else {
            $('.marker').removeClass('active');
            $(this).toggleClass('active');
        }
        if($('.marker.active').length > 0) {
            var target = $('.marker.active').attr('data-target');
            $('.img-svg').addClass('active');
            $('.body-compass-lists ul').addClass('reduced');
            $('.body-compass-lists ul.reduced').find('li[data-target="'+target+'"]').show(300);
            console.log(target);
        } else {
            $('.img-svg').removeClass('active');
            $('.circle.dynamic + p').removeAttr('style');
            $('.body-compass-lists ul').removeClass('reduced');
            $('.body-compass-lists ul li').removeAttr('style');

        }
    });
    // --------------------------------------

    $('.slider__wraper').slick('slickGoTo',[0, false]);
    mainPageSlider();
    $('.header .menu-items li, .burger-btn').on('click', function(e) {
        e.preventDefault();
        $(this).toggleClass('open');
        if($(this).hasClass('burger-btn')) {
            $('.header__main-nav').fadeToggle(300);
        }
    });
    $('.dropdown-title').on('click', function(e) {
        e.preventDefault();
        $(this).toggleClass('open');
    });
    $(window).resize(function() {
        setTimeout(mainPageSlider(), 500);
        if($(window).width() > 991) {
            $('.header__main-nav').css('display', 'block');
        }
        if($(window).width() < 992 && !$('.burger-btn').hasClass('open')) {
            $('.header__main-nav').css('display', 'none');
        }
        if($(window).width() > 768 && $(window).scrollTop() > 200) {
            $('#header').css({
                'position': 'static',
                'box-shadow': 'none'
            });
        }
        $(".img-svg").css({
            "width": $("img[usemap]").width(),
            "height": $("img[usemap]").height()
        });
        /* if($(window).width() > 991) {
            $('.header .menu-items').css({
                'height': $('.header .menu-items > li').height() + 40
            });
        } else {
            $('.header .menu-items').css({
            'height': 'auto'
            });
        } */

        if($(window).width() > 991) {
            $('.header .menu-items').css({
                'height': $('.header .menu-items > li').height()
            });
        } else {
            $('.header .menu-items').css({
                'height': 'auto'
            });
        }

        $('.fixed-nav .nav').css({
            'maxWidth': $('.fixed-nav').width()
        });
    });
    $(document).on('click', function(e) {
        var obj = $('#searchField, #searchFieldMobile');
        var target = $(e.target);
        if(target.attr('type') != 'text') {
            obj.collapse('hide');
        }

    });
    $('.fixed-nav a').on('click', function(e) {
        e.preventDefault();
        var id = $(this).attr('href');
        var top = $(id).offset().top;
        $('body, html').animate({
            scrollTop: top
        }, 1500);
    });
    $('.fixed-nav .nav').css({
        'maxWidth': $('.fixed-nav').width()
    });
    $('.scroll-top-btn').on('click', function(e) {
        e.preventDefault();
        $('body, html').animate({
            scrollTop: 0
        }, 1500);
    });
    $(window).scroll(function() {
        var scroll = $(this).scrollTop();
        if(scroll > 200) {
            $('.scroll-top-btn').fadeIn();
            if($(window).width() < 991) {
                $('#header').css({
                    'position': 'fixed',
                    'box-shadow': '0 0 10px rgba(0,0,0,.5)'
                });
            }
        } else {
            $('.scroll-top-btn').fadeOut();
            $('#header').css({
                'position': 'static',
                'box-shadow': 'none'
            });
        }
        if($(window).width() > 991) {
            if(scroll > $('#header').height()) {
                $('.breadcrumbs').addClass('fixed');
            } else {
                $('.breadcrumbs').removeClass('fixed');
            }
        }
    });

    /*if($(window).width() > 991) {
        $('.header .menu-items').css({
           'height': $('.header .menu-items > li').height() + 40
        });
    } else {
        $('.header .menu-items').css({
           'height': 'auto'
        });
    }*/

    if($(window).width() > 991) {
        $('.header .menu-items').css({
           'height': $('.header .menu-items > li').height()
        });
    } else {
        $('.header .menu-items').css({
           'height': 'auto'
        });
    }

    /*$('.header .menu-items li').on('mouseenter', function() {
        $(this).children('.header__main-nav__flyout').fadeIn(0);
        $(this).find('.b-thumbnail').css({
            'height': $(this).find('.flyout__wraper').height()
        });
    });
    $('.header .menu-items li').on('mouseleave', function() {
        $(this).children('.header__main-nav__flyout').fadeOut(0);
    });*/

	if (typeof $('.klinik-search-block input') != 'undefined' && $('.klinik-search-block input').length > 0) {
		$('.klinik-search-block input').keyup(function() {
			var search = $(this).val();
			var hits;

			function fadeParent(obj) {
				var parent = obj.parents('.klinik-line');

				if (parent.find('.team-item:visible').length == 0) {
					parent.find('.klinik-line__title').fadeOut();
					parent.css('padding-bottom', 0);
				} else {
					parent.find('.klinik-line__title').fadeIn();
					parent.css('padding-bottom', '');
				}
			}

			if (search.length == 0) {
				hits = $(this).parents('.klinik-search-block').parent().find('.team-item');
				hits.fadeIn(400, function() {
					fadeParent($(this))
				});

				return;
			}

			var hits = $(this).parents('.klinik-search-block').parent().find(".info:Contains('" + search + "')").parents('.team-item');
			var misses = $(this).parents('.klinik-search-block').parent().find(".info:not(:Contains('" + search + "'))").parents('.team-item');

			hits.fadeIn(400, function() {
				fadeParent($(this));
			});
			misses.fadeOut(400, function() {
				fadeParent($(this));
			});
		});
	}
});
