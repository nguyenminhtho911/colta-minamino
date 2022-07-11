/*!
 * ScriptName: shared.js
 */

// $(document).ready(function() {
// 	if ($('.nav-fixed[scroll-active]').length && $('.nav-fixed').attr('scroll-active') === "true")
// 		$(document).on('scroll', onScroll);
// 	$('.nav-fixed a[href*="#"]').on('click', function() {
// 		var e = $(this).attr('href');
// 		var h = $('.nav-fixed').outerHeight();
// 		var b = $(e).length ? $(e).offset().top : 0;
// 		$('html, body').animate({
// 			scrollTop: (b + 1 - h)
// 		}, 500);
// 	});
// });

// function onScroll(){
// 	var scroll = $(window).scrollTop();
// 	var header = $('.nav-fixed').outerHeight();
// 	$('.nav-fixed a[href^="#"]').each(function () {
// 		var el = $(this).attr('href');
// 		var offset = $(el).length ? $(el).offset().top : 0;
// 		if($(this).find('img').length){
// 			var _src_ = $(this).find('img').attr("src");
// 			_src_ = _src_.replace(/^(.*?)_on\.(.*)$/, "$1.$2");
// 			$(this).find('img').attr("src", _src_);
// 		}
// 		// $('.nav-fixed a[href^="#"]').removeClass('active');
// 		if((scroll + header) >= offset && ($(el).outerHeight() + offset) > (scroll + header)){
// 			$('.nav-fixed a[href^="#"]').removeClass('active');
// 			$(this).addClass('active');
// 			if($(this).find('img').length){
// 				$('.nav-fixed a[href^="#"] img').addClass('btn');
// 				$(this).find('img').removeClass('btn');
// 				$('.nav-fixed a[href^="#"] img').each(function(){
// 					var src = $(this).attr('src');
// 					var newSrc = src.replace('_on', '');
// 					$(this).attr('src', newSrc);
// 				})

// 				$(this).find('img').attr("src").match(/^(.*)(\.{1}.*)/g);
// 				var newSrc = RegExp.$1 + "_on" + RegExp.$2;

// 				$(this).find('img').attr("src", newSrc); // update src
// 			}
// 			// $(this).find('img').trigger('mouseout').trigger('mouseover')
// 		} else{
// 			$(this).removeClass('active');
// 		}
// 	})
// }
var lastScrollTop = 0;

$(window).scroll(function() {
	var st = $(this).scrollTop();
	var footerPos = $('#footer').offset().top;
	var footerH = $('#footer').height();
	if (lastScrollTop != 0) {
		if ((st < lastScrollTop) || (st >= footerPos - footerH) ) {
			$("#pagetop").addClass("visible");
			if (st < 10) {
				$("#pagetop").removeClass("visible");
			}
		} else {
			$("#pagetop").removeClass("visible");
		}
	}
	lastScrollTop = st;
});




$("body").on("click", "#pagetop", function() {
	if (!$(this).hasClass("in-scroll")) {
		$(this).addClass("in-scroll");

		var $scrollDuration = $.inArray($(this).attr("data-duration"), ["slow", "normal", "fast"]) >= 0 || parseInt($(this).attr("data-duration")) > 0 ? $(this).attr("data-duration") : "slow";

		$("html, body").stop().animate({
			scrollTop: 0
		}, $scrollDuration, function() {
			$("#pagetop").removeClass("in-scroll");
			$("#pagetop").removeClass("visible");
		});

	}
});
// END: scroll to top


$(document).ready(function() {
	$('body').removeClass('navOpen');
	$(".hamburger").click(function() {
		if ($('body').hasClass('navOpen')) {
			$('body').addClass('navClose');
			$('body').removeClass('navOpen');
			$('body').css({
				'position': 'static',
				'top': 'auto',
				'width': 'auto'
			});

		} else {
			$('body').addClass('navOpen');
			$('body').removeClass('navClose');

						// offsetY = window.pageYOffset;
						// $('body').css({
						//  position: 'fixed',
						//  'top': -offsetY + 'px',
						//  width: '100%'
						// });

					}
				});

	$(".close_btn,#menu_toggle a").click(function() {
		$('body').removeClass('navOpen');
		$('body').addClass('navClose');
		$('body').css({
			'position': 'static',
			'top': 'auto',
			'width': 'auto'
		});

	});
});

$(document).ready(function() {

	$(".close_btn, #menu_toggle a").click(function() {
		$('body').removeClass('nav--opened');
		$('.hamburger').removeClass('is-active');
	});
});


$(document).ready(function() {
	var TargetPos = $('section.block').offset().top;
	$(window).scroll(function() {
				////console.log(TargetPos);
				var ScrollPos = $(window).scrollTop();
				if (ScrollPos > TargetPos) {
					$("body").addClass('has_nav');
				} else {
					$("body").removeClass('has_nav');
				}
			});
});



// BEGIN: fix scroll iOS
var overflowIsHidden = function(node) {
	var style = getComputedStyle(node);
	return style.overflow === "hidden" || style.overflowX === "hidden" || style.overflowY === "hidden";
}

var isItScrollableWithoutVisibleScrollbars = function(el) {
	if (el === null) return false;

	var isScrollable = false,
	hasScrollbars = false;

		isScrollable = el.scrollHeight > el.offsetHeight ? true : false; // first, lets find out if it has scrollable content
		// isScrollable = el.scrollHeight + 1 > el.clientHeight ? true : false; // first, lets find out if it has scrollable content

		if (isScrollable) hasScrollbars = (el.offsetWidth > el.scrollWidth) ? true : false; // if it's scrollable, let's see if it likely has scrollbars
		// if (isScrollable) hasScrollbars = (el.offsetWidth > el.scrollWidth - 1) ? true : false; // if it's scrollable, let's see if it likely has scrollbars

		if (isScrollable && !hasScrollbars && !overflowIsHidden(el)) return true;
		else return false;
	};

	document.addEventListener("touchmove", function(e) {
		if (document.body.classList.contains("nav--opened")) {
			if ($(e.target).parents("#menu_toggle").length < 1) e.preventDefault();
			else if (!isItScrollableWithoutVisibleScrollbars(document.getElementById("menu_toggle"))) e.preventDefault();
		}
	}, {
		passive: false
	});

	window.addEventListener("resize", function() {
		var _event_ = new Event("touchmove");

		document.dispatchEvent(_event_); // trigger
	}, {
		passive: false
	});
// END: fix scroll iOS