/*!
 * ScriptName: common.js
 * Version: 3.0.8
 *
 * FoodConnection
 * http://foodconnection.jp/
 * http://foodconnection.vn/
 *
 */



/*
 * Catch errors
 *
 */

window.onerror = function(message, url, line, column, error) {
    if (message.indexOf("Script error.") > -1) return;

    if ($("html").hasClass("fc-debugger")) {
        var uid = md5(message + url + line + column),
            filename = url,
            consoleHTML = "",
            msg = "",
            total = 0,
            $blkConsole = $("#fc-console .console-main > .console-block:first-child[data-uid='" + uid + "']");

        consoleHTML += '<div id="fc-console">';
        consoleHTML += '<div class="console-title">FC Console</div>';
        consoleHTML += '<div class="console-clear">Clear</div>';
        consoleHTML += '<div class="console-main">';
        consoleHTML += '</div>';
        consoleHTML += '</div>';

        if ($("#fc-console").length < 1) $("body").append(consoleHTML);

        if (typeof url !== "undefined") {
            var fname = url.replace("\\", "/"); // correct slashes
            if (fname.lastIndexOf("/")) fname = fname.substr(fname.lastIndexOf("/") + 1);
            filename = fname.substr(0, fname.lastIndexOf(".")) + "." + fname.substr(fname.lastIndexOf(".") + 1);
            if (filename.length < 3) filename = url;
        }

        msg += '<div class="console-block" data-uid="' + uid + '" data-count="1">';
        msg += '<div class="console-message">' + message + '</div>';
        msg += '<div class="console-stacktrace">';
        msg += '<div class="console-file">Script: <a href="' + url + '" target="_blank">' + filename + '</a></div>';
        msg += '<div class="console-line">Line: <strong>' + line + '</strong></div>';
        msg += '<div class="console-column">Column: <strong>' + column + '</strong></div>';
        msg += '</div>';
        msg += '<div class="console-error">' + error + '</div>';
        msg += '</div>';

        if ($blkConsole.length > 0) {
            var count = $blkConsole.attr("data-count");
            if (count !== undefined && !isNaN(count) && Number(count) >= 0) {
                count = Number(count);
                count++;

                $blkConsole.attr("data-count", count);
            } else $blkConsole.attr("data-count", 1);
        } else $("#fc-console .console-main").prepend(msg);

        $("#fc-console .console-main > .console-block").each(function() {
            var count = $(this).attr("data-count");
            if (count !== undefined && !isNaN(count) && Number(count) >= 0) total += Number(count);
            else total++;
        });

        $("#fc-console .console-title").attr("data-total", total);
    }
};





/*
 * Switch fonts to Noto Serif
 *
 */

if ("ontouchstart" in document.documentElement || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0) { // remove all :hover stylesheets
    try { // prevent exception on browsers not supporting DOM styleSheets properly
        for (var si in document.styleSheets) {
            var styleSheet = document.styleSheets[si];

            if (!styleSheet.rules) continue;

            for (var ri = styleSheet.rules.length - 1; ri >= 0; ri--) {
                if (!styleSheet.rules[ri].cssText || !styleSheet.rules[ri].style || !styleSheet.rules[ri].style.fontFamily) continue;

                var fontFamily = styleSheet.rules[ri].style.fontFamily;
                if (/^\s*(游明朝|Yu-?Mincho|ヒラギノ明朝|Hiragino[\s|-]*Mincho|(MS|ＭＳ)[\s|-]*明朝)/i.test(fontFamily)) {
                    // styleSheet.rules[ri].style.fontFamily = fontFamily.replace(fontFamily, "'Noto Serif JP', " + fontFamily);
                    $(styleSheet.rules[ri].selectorText).css("font-family", "'Noto Serif JP', " + fontFamily);
                }
            }
        }
    } catch (ex) {}
}


+

function($) {
    "use strict";
    var transitionEnd = function() {
            var el = document.createElement("fcvndev");

            var transitionEndEventNames = {
                transition: "transitionend",
                OTransition: "oTransitionEnd",
                MozTransition: "transitionend",
                WebkitTransition: "webkitTransitionEnd"
            };

            for (var name in transitionEndEventNames) {
                if (el.style[name] !== undefined) {
                    return {
                        end: transitionEndEventNames[name]
                    };
                }
            }

            return false;
        },
        animationEnd = function() {
            var el = document.createElement("fcvndev");

            var animationEndEventNames = {
                animation: "animationend",
                OAnimation: "oAnimationEnd",
                MozAnimation: "animationend",
                WebkitAnimation: "webkitAnimationEnd"
            };

            for (var name in animationEndEventNames) {
                if (el.style[name] !== undefined) {
                    return {
                        end: animationEndEventNames[name]
                    };
                }
            }

            return false;
        };

    $(function() {
        $.support.transition = transitionEnd();

        $.support.animation = animationEnd();
    });
}(jQuery);

$(document).ready(function() {
    var UA = navigator.userAgent;
    if (UA.indexOf("iPhone") < 0 && UA.indexOf("Android") < 0) $(".telhref").contents().unwrap(); // remove link [tel] on desktop

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) $("html.mobile-no-animate").addClass("noanimated"); // to remove transition
    else $("html.mobile-no-animate").removeClass("noanimated");

    // fix bg parallax on mobile
    if (isMobile.any()) $(".bg-parallax").css("background-attachment", "inherit");
    else $(".bg-parallax").css("background-attachment", "");

    /*
    if ((UA.indexOf("iPad") > -1) || (UA.indexOf("iPhone") > -1) || (UA.indexOf("iPod") > -1)) { // iOS
    	window.onpageshow = function(e) {
    		if (e.persisted || window.performance && window.performance.navigation.type == 2) window.location.reload(); // go back by hit back button
    	};
    }
    */



    // forcing a page to reload when the back button is clicked
    window.onpageshow = function(event) {
        if (event.persisted && $("body").hasClass("reload-on-back")) window.location.reload();
    };
    /*
		if(navigator.userAgent.match(/Trident\/7\./)) {
		  $('body').on("mousewheel", function () {
			  event.preventDefault();
			  var wd = event.wheelDelta;
			  var csp = window.pageYOffset;
			  window.scrollTo(0, csp - wd);
		  });
		}
	*/
    var clipboardData = new ClipboardJS(".copy", {
        // container: $(".copy").get(0),
        text: function(trigger) {
            var _text_ = "{TITLE} {URL}",
                _viewport_ = $("meta[name='viewport']").last().attr("content");

            if ($(trigger).attr("data-copy") && $(trigger).attr("data-copy").length > 0) _text_ = $(trigger).attr("data-copy");

            // if (_viewport_ && /(?:user-scalable\s*=\s*yes)/i.test(_viewport_)) $("meta[name='viewport']").last().attr("content", _viewport_.replace(/(?:user-scalable\s*=\s*yes)/i, "user-scalable=no")); // disabled zoom
            if (_viewport_) { // disabled zoom
                var _vpt_ = _viewport_.replace(/(?:user-scalable\s*=\s*yes)/i, "user-scalable=no"),
                    _spt_ = _vpt_.split(","),
                    _arr_ = [];

                for (var i in _spt_) {
                    if (!/initial-scale/i.test(_spt_[i])) _arr_.push(_spt_[i].trim());
                }
                _arr_.push("initial-scale=1");

                $("meta[name='viewport']").last().attr("content", _arr_.join(", ")); // disabled zoom
            }

            if ($(trigger).attr("data-replace-text")) $(trigger).html($(trigger).attr("data-replace-text"));
            else if ($(trigger).attr("data-replace-image")) {
                var _imgReplace_ = $(trigger).attr("data-replace-image");

                if ($(trigger).children("picture").length > 0) {
                    $(trigger).children("picture").addClass("copy-change");
                    $(trigger).children("picture").children().each(function() {
                        if ($(this).prop("tagName").toLowerCase() == "img") $(this).attr("src", _imgReplace_).removeClass("btn");
                        else if ($(this).prop("tagName").toLowerCase() == "source") $(this).attr("srcset", $(this).attr("src-replace") ? $(this).attr("src-replace") : _imgReplace_);
                    });
                } else if ($(trigger).children("img").length > 0) {
                    if ($(trigger).children("img").hasClass("btn")) {
                        $(trigger).children("img").addClass("copy-change");

                        _imgReplace_ =
                            _imgReplace_
                            .replace(/^(.*?)(_on)?\.(.*?)$/, "$1_on.$3");
                    }

                    $(trigger).children("img").attr("src", _imgReplace_);
                } else $(trigger).html('<img src="' + _imgReplace_ + '" />');
            }

            $(trigger).addClass("copied");

            if (_viewport_) $("meta[name='viewport']").last().attr("content", _viewport_); // enabled zoom

            _text_ = _text_.replace("{TITLE}", document.title).replace("{URL}", location.href);

            return _text_;
        }
    });

    clipboardData
        .on("success", function() {
            var offsetX = window.scrollX || window.pageXOffset || window.document.documentElement.scrollLeft,
                offsetY = window.scrollY || window.pageYOffset || window.document.documentElement.scrollTop;

            // firefox jump - fixed
            window.scroll(offsetX, offsetY); // started

            setTimeout(function() { // step 1
                window.scroll(offsetX, offsetY);
            }, 20);

            setTimeout(function() { // step 2
                window.scroll(offsetX, offsetY);
            }, 15);

            setTimeout(function() { // step 3
                window.scroll(offsetX, offsetY);
            }, 10);

            setTimeout(function() { // step 4
                window.scroll(offsetX, offsetY);
            }, 5);

            setTimeout(function() { // step 5
                window.scroll(offsetX, offsetY);
            }, 0);

            window.scroll(offsetX, offsetY); // final
        })
        .on("error", function() {});

    $("body")
        .on("click", "#fc-console .console-title", function() {
            $(this).parents("#fc-console").toggleClass("active");
        })
        .on("click", "#fc-console .console-clear", function() {
            $("#fc-console").removeClass("active");
            $("#fc-console .console-main").empty();
            $("#fc-console .console-title").removeAttr("data-total");
        })
        .on("click", ".copy", function(e) {
            e.preventDefault();

            $(this).removeAttr("data-clipboard-text");
        })
        .on("click", ".hamburger", function(e) {
            e.preventDefault();

            if ($(this).hasClass("is-active")) {
                $("body").removeClass("nav--opened");
                $(this).removeClass("is-active");
            } else {
                $("body").addClass("nav--opened");
                $(this).addClass("is-active");
            }
        });

    // BEGIN: slide fading
    if ($(".slide-fade").length > 0) {
        $(".slide-fade").each(function() {
            var $this = $(this),
                __idx__ = $(".slide-fade").index($this),
                $duration = typeof $this.attr("data-duration") != "undefined" ? parseInt($this.attr("data-duration")) : 1000,
                $timer = typeof $this.attr("data-timer") != "undefined" ? parseInt($this.attr("data-timer")) : 4000,
                $delay = typeof $this.attr("data-delay") != "undefined" ? parseInt($this.attr("data-delay")) : false;

            if ($timer < $duration) $timer = $duration * 2;

            if (!$this.children(".active").length > 0) {
                $this.children().hide();
                $this.children().eq(0).show().addClass("active");

                if ($this.siblings(".slide-page").length > 0) $this.siblings(".slide-page").children().eq(0).addClass("active");
            } else {
                if ($this.siblings(".slide-page").length > 0) $this.siblings(".slide-page").children().eq($this.children(".active").index()).addClass("active");
            }

            if ($(this).siblings(".slide-page").length > 0) {
                $(this).siblings(".slide-page").children().each(function(i) {
                    $(this).attr("data", i);
                });
            }

            if (!$(this).hasClass("stop")) {
                // $slideFadeTimer[__idx__] = setInterval(function() {
                // slideFade($this, $duration);
                // }, $timer);

                $(this).parents(".slideParent").addClass("move-start").attr("data", $this.children(".active").index());

                if ($slideFadeTimer[__idx__]) clearTimeout($slideFadeTimer[__idx__]);
                $slideFadeTimer[__idx__] = setTimeout(function() {
                    slideFade($this, $duration);
                }, $delay ? $delay : $timer);
            }
        });

        /*
         * TODO:
         * --- removeClass/addClass
         * .move-next
         * .move-prev
         * .move-first
         * .move-last
         *
         */

        $("body").on("click", ".slide-btn > .slide-next", function() {
            var $btn = $(this),
                $this = $btn.parent().siblings(".slide-fade"),
                __idx__ = $(".slide-fade").index($this),
                $duration = typeof $this.attr("data-duration") != "undefined" ? parseInt($this.attr("data-duration")) : 1000,
                $timer = typeof $this.attr("data-timer") != "undefined" ? parseInt($this.attr("data-timer")) : 4000;

            if ($timer < $duration) $timer = $duration * 2;

            if (!$btn.hasClass("clicked") && !$this.hasClass("stop")) {
                // if ($slideFadeTimer[__idx__]) clearInterval($slideFadeTimer[__idx__]);
                if ($slideFadeTimer[__idx__]) clearTimeout($slideFadeTimer[__idx__]);

                $btn.addClass("clicked");

                $this.children(".active").stop().fadeOut($duration, function() {
                    $(this).removeClass("active").removeAttr("style").hide();
                });

                if ($this.children(".active").next().length) {
                    $this.children(".active").next().stop().fadeIn($duration, function() {
                        $(this).addClass("active").removeAttr("style").show();
                        $btn.removeClass("clicked");

                        // $slideFadeTimer[__idx__] = setInterval(function() {
                        $slideFadeTimer[__idx__] = setTimeout(function() {
                            $this.siblings(".slide-btn").children(".slide-next").click();
                        }, $timer);
                    });
                } else {
                    if (!$this.hasClass("once")) {
                        $this.children().eq(0).stop().fadeIn($duration, function() {
                            $(this).addClass("active").removeAttr("style").show();
                            $btn.removeClass("clicked");

                            // $slideFadeTimer[__idx__] = setInterval(function() {
                            $slideFadeTimer[__idx__] = setTimeout(function() {
                                $this.siblings(".slide-btn").children(".slide-next").click();
                            }, $timer);
                        });
                    }
                }
            }
        });
        $("body").on("click", ".slide-btn > .slide-prev", function() {
            var $btn = $(this),
                $this = $btn.parent().siblings(".slide-fade"),
                __idx__ = $(".slide-fade").index($this),
                $duration = typeof $this.attr("data-duration") != "undefined" ? parseInt($this.attr("data-duration")) : 1000,
                $timer = typeof $this.attr("data-timer") != "undefined" ? parseInt($this.attr("data-timer")) : 4000;

            if ($timer < $duration) $timer = $duration * 2;

            if (!$btn.hasClass("clicked") && !$this.hasClass("stop")) {
                // if ($slideFadeTimer[__idx__]) clearInterval($slideFadeTimer[__idx__]);
                if ($slideFadeTimer[__idx__]) clearTimeout($slideFadeTimer[__idx__]);

                $btn.addClass("clicked");

                $this.children(".active").stop().fadeOut($duration, function() {
                    $(this).removeClass("active").removeAttr("style").hide();
                });

                if ($this.children(".active").prev().length) {
                    $this.children(".active").prev().stop().fadeIn($duration, function() {
                        $(this).addClass("active").removeAttr("style").show();
                        $btn.removeClass("clicked");

                        // $slideFadeTimer[__idx__] = setInterval(function() {
                        $slideFadeTimer[__idx__] = setTimeout(function() {
                            $this.siblings(".slide-btn").children(".slide-next").click();
                        }, $timer);
                    });
                } else {
                    $this.children().last().stop().fadeIn($duration, function() {
                        $(this).addClass("active").removeAttr("style").show();
                        $btn.removeClass("clicked");

                        // $slideFadeTimer[__idx__] = setInterval(function() {
                        $slideFadeTimer[__idx__] = setTimeout(function() {
                            $this.siblings(".slide-btn").children(".slide-next").click();
                        }, $timer);
                    });
                }
            }
        });

        $("body").on("click", ".slide-page > *", function() {
            var $page = $(this).parent(),
                $idx = $(this).index(),
                $this = $(this).parents(".slideParent").length ? $(this).parents(".slideParent").find(".slide-fade") : $(this).siblings(".slide-fade"),
                __idx__ = $(".slide-fade").index($this),
                $duration = typeof $this.attr("data-duration") != "undefined" ? parseInt($this.attr("data-duration")) : 1000,
                $timer = typeof $this.attr("data-timer") != "undefined" ? parseInt($this.attr("data-timer")) : 4000;

            if ($timer < $duration) $timer = $duration * 2;

            if ($this.length) {
                if (!$page.hasClass("clicked") && !$this.hasClass("stop")) {
                    if ($(this).siblings(".active").length > 0) {
                        var idxOld = parseInt($(this).siblings(".active").attr("data")),
                            idxNew = parseInt($(this).attr("data")),
                            beside = idxOld - idxNew === 1 || idxNew - idxOld === 1;

                        $(this).parents(".slideParent").removeClass("move-start move-next move-prev move-first move-last");

                        if (idxNew > idxOld) {
                            $(this).parents(".slideParent").addClass("move-next").attr("data", idxNew);

                            if ($(this).is(":last-child")) $(this).parents(".slideParent").addClass("move-last");
                        } else {
                            $(this).parents(".slideParent").addClass("move-prev").attr("data", idxNew);

                            if ($(this).is(":first-child")) $(this).parents(".slideParent").addClass("move-first");
                        }
                    }

                    if ($this.children().eq($idx).length > 0) {
                        if ($slideFadeTimer[__idx__]) clearTimeout($slideFadeTimer[__idx__]);

                        $this.siblings(".slide-page").children(".active").removeClass("active");
                        $(this).addClass("active");

                        $page.addClass("clicked");

                        $this.children(".active").stop().fadeOut($duration, function() {
                            $(this).removeClass("active").removeAttr("style").hide();
                        });

                        $this.children().eq($idx).stop().fadeIn($duration, function() {
                            $(this).addClass("active").removeAttr("style").show();
                            $page.removeClass("clicked");

                            // $slideFadeTimer[__idx__] = setInterval(function() {
                            // slideFade($this, $duration);
                            // }, $timer);

                            $slideFadeTimer[__idx__] = setTimeout(function() {
                                slideFade($this, $duration);
                            }, $timer);
                        });
                    } else console.info("Slide not found");
                }
            } else console.info(".slideParent or .slide-fade not found!");
        });
    }
    // BEGIN: slide fading

    // navigation animate
    if ($(".nav-animate").length) {
        $(".nav-animate").each(function() {
            var $timerNav,
                $navNull = $(this).hasClass("nav-null"),
                $navWidth = $(this).find("li").first().outerWidth(),
                $navPosX = $navNull ? 0 : $(this).find("li").first().position().left,
                // $navML = 0,
                $navMR = 0;

            if ($(this).find("li.active").length) {
                $navWidth = $(this).find("li.active").outerWidth(),
                    $navPosX = $(this).find("li.active").position().left;

                // $navML = $(this).find("li.active").next().length ? parseInt($(this).find("li.active").next().css("margin-left"), 10),
                $navMR = $(this).find("li.active").prev().length ? parseInt($(this).find("li.active").prev().css("margin-right"), 10) : 0;
            } else {
                if (!$navNull) $(this).find("li").first().addClass("active");

                // $navML = parseInt($(this).find("li").first().css("margin-left"), 10),
                // $navMR = parseInt($(this).find("li").first().css("margin-right"), 10);
            }

            $navWidth += $navMR;
            $navPosX -= $navMR;

            $(this).children("span").css({
                width: $navWidth,
                left: $navPosX
            });

            if ($navNull) $(this).children("span").css("opacity", 0);

            $(this).find("li").mouseover(function() {
                var $navW = $(this).outerWidth(),
                    $navX = $(this).position().left,
                    // $nML = $(this).next().length ? parseInt($(this).next().css("margin-left"), 10),
                    $nMR = $(this).prev().length ? parseInt($(this).prev().css("margin-right"), 10) : 0;

                if ($navNull) {
                    clearTimeout($timerNav);

                    $navPosX = $navX - $nMR;

                    $(this).parents(".nav-animate").children("span").css("opacity", 1);
                    console.log($navPosX);
                }

                $(this).parents(".nav-animate").children("span").stop().animate({
                    width: $navW + $nMR,
                    left: $navX - $nMR
                }, "fast");
            }).mouseleave(function() {
                var $span = $(this).parents(".nav-animate").children("span");

                if ($navNull) {
                    clearTimeout($timerNav);
                    $timerNav = setTimeout(function() {
                        console.log($navPosX);
                        $span.stop().fadeOut(100, function() {
                            $(this).removeAttr("style").css({
                                opacity: 0,
                                width: $navWidth,
                                left: $navPosX
                            })
                        });
                    }, 500);
                } else {
                    $span.stop().animate({
                        width: $navWidth,
                        left: $navPosX
                    }, "fast");
                }
            });
        });
    }


    // BEGIN: toggle
    if ($(".toggle").length > 0) {
        $("body").on("click", ".toggle-link", function() {
            var $toggleDuration = 500,
                $toggleElm = $(this).parents(".toggle").first();

            if (typeof $toggleElm.attr("data-duration") != "undefined") {
                if ($.inArray($toggleElm.attr("data-duration"), ["slow", "normal", "fast"]) >= 0) $toggleDuration = $toggleElm.attr("data-duration");
                else $toggleDuration = parseInt($toggleElm.attr("data-duration"));
            }

            if ($(this).parents(".single").length > 0) {
                $(this).parents(".single").find(".toggle-main").stop().slideUp($toggleDuration, function() {
                    $(this).removeAttr("style");
                    $(this).parents(".toggle").first().removeClass("active");
                });
            }

            if ($(this).parents(".toggle").first().hasClass("active")) {
                $(this).siblings(".toggle-main").stop().slideUp($toggleDuration, function() {
                    $(this).removeAttr("style");
                    $(this).parents(".toggle").first().removeClass("active");
                });
            } else {
                $(this).siblings(".toggle-main").stop().slideDown($toggleDuration, function() {
                    $(this).removeAttr("style");
                    $(this).parents(".toggle").first().addClass("active");

                    // if ($(this).find("[class*=heightLine]").length) heightLine();

                    $(window).trigger("resize");
                });

                if ($(this).siblings(".toggle-main").find("[class*=heightLine]").length) heightLine();
            }
        });
    }
    // END: toggle

    // BEGIN: tabs - switch
    if ($(".tabs-switch").length) {
        $(".tabs-switch").each(function() {
            var $tabsSwitch = $(this),
                $tabLink = $tabsSwitch.find(".tab-link"),
                $tabContent = $tabsSwitch.find(".tab-content");

            $tabLink.children().each(function() {
                if ($(this).find("img").length > 0 && $(this).find("img").hasClass("btn")) {
                    $(this).data("src", $(this).find("img").attr("src"));

                    $(this).find("img").attr("src").match(/^(.*)(\.{1}.*)/g);
                    $(this).data("active", RegExp.$1 + "_on" + RegExp.$2);
                }
            });

            $tabContent.children().hide();

            if (!$tabsSwitch.hasClass("stop")) {
                $tabLink.each(function() {
                    // TODO: active by [data-active]
                    var hash = window.location.hash || location.hash;
                    if (hash) {
                        if ($(this).children("[data-tab-anchor='" + hash + "']").length) $(this).children("[data-tab-anchor='" + hash + "']").addClass("active");
                        else $(this).children().first().addClass("active");
                    } else if (!$(this).children(".active").length) $(this).children().first().addClass("active");

                    $(this).children(".active").find("img").attr("src", $(this).children(".active").data("active")).removeClass("btn");
                });

                if ($tabLink.children(".active").hasClass("all")) $tabContent.children().show();
                else $tabContent.children().eq($tabLink.children(".active").index()).show();
            }

            if ($(".bx-wrapper").length > 0) $(window).trigger("resize");
        });

        $("body").on("click", ".tabs-switch-close", function() {
            var $content = $(this).parents(".tab-content").first(),
                $switch = $(this).parents(".tabs-switch").first();

            if ($content.length > 0 && $switch.length > 0) {
                var $tabMode = $.inArray($switch.attr("data"), ["fade", "slide", "block"]) >= 0 ? $switch.attr("data") : "block",
                    $tabDuration = $switch.attr("data-duration") ? parseInt($switch.attr("data-duration")) : 300;

                if ($tabMode == "fade") $content.children().stop().fadeOut($tabDuration);
                else if ($tabMode == "slide") $content.children().stop().slideUp($tabDuration);
                else $content.children().stop().hide($tabDuration);
            }
        });

        $("body").on("click", ".tab-link .tab-item, .tab-link > *", function() {
            var $itemMode = $(this).hasClass("tab-item"),
                $this = $itemMode ? $(this, ".tab-item") : $(this),
                $idxAll = $this.parents(".tab-link").first().children(".all").length > 0 ? $this.parents(".tab-link").first().children(".all").index() : false,
                $idx = $itemMode ? $this.parents(".tab-link").first().find(".tab-item").index($this) : $this.parents(".tab-link").first().children().index($this),
                $act = $itemMode ? $this.parents(".tab-link").first().find(".tab-item.active") : $this.parents(".tab-link").first().children(".active"),
                $tabMode = $.inArray($this.parents(".tabs-switch").first().attr("data"), ["fade", "slide", "block"]) >= 0 ? $this.parents(".tabs-switch").first().attr("data") : "block",
                $tabDuration = $this.parents(".tabs-switch").first().attr("data-duration") ? parseInt($this.parents(".tabs-switch").first().attr("data-duration")) : 300,
                $tabContent = $this.parents(".tabs-switch").first().children(".tab-content"),
                $tabIdx = $this.attr("data-active") ? $this.attr("data-active") : false,
                $autoScroll = $.inArray($this.parents(".tabs-switch").first().attr("data-scroll"), ["true", "on", "enable", "enabled", "1"]) >= 0 ? true : false,
                $itself = $.inArray($this.parents(".tabs-switch").first().attr("data-toggle"), ["true", "on", "enable", "enabled", "1"]) >= 0 && $this.hasClass("active") ? true : false,
                $itHide = $tabContent.children().eq($idx).is(":hidden");

            if ($tabIdx) {
                $this.parents(".tabs-switch").first().find(".tab-link").each(function() {
                    var $tabBtn = $itemMode ? $(this).find(".tab-item[data-active='" + $tabIdx + "']") : $(this).children("[data-active='" + $tabIdx + "']"),
                        $elmActive = $itemMode ? $(this).find(".tab-item.active") : $(this).children(".active");

                    $elmActive.find("img").attr("src", $elmActive.data("src"));
                    $elmActive.removeClass("active");

                    if ($itself) {
                        if ($itHide) $tabBtn.addClass("active");
                        else $tabBtn.removeClass("active");
                    } else $tabBtn.addClass("active");

                    // if (!$tabBtn.find("img").hasClass("active")) $tabBtn.find("img").attr("src", $tabBtn.data("active"));
                    if ($tabBtn.find("img").hasClass("btn")) $tabBtn.find("img").attr("src", $tabBtn.data("active")).removeClass("btn");
                });
            } else {
                if (/^(.*?)_on\.(.*?)$/.test($act.find("img").attr("src"))) $act.find("img").addClass("btn");

                $act.find("img").attr("src", $act.data("src"));
                $act.removeClass("active");

                if ($itself) {
                    if ($itHide) $this.addClass("active");
                    else $this.removeClass("active");
                } else $this.addClass("active");

                // if (!$this.find("img").hasClass("active")) $this.find("img").attr("src", $this.data("active"));
                if ($this.find("img").hasClass("btn")) $this.find("img").attr("src", $this.data("active")).removeClass("btn");
            }

            if (!$this.parents(".tab-link").first().hasClass("clicked")) {
                $this.parents(".tab-link").first().addClass("clicked");

                if ($this.hasClass("all")) {
                    if ($tabMode == "fade") {
                        $tabContent.children().stop().fadeIn($tabDuration, function() {
                            $(this).removeAttr("style").show();

                            if ($(this).find("[class*=heightLine]").length) heightLine();

                            if ($this.children("a").length) $this.children("a").click();

                            $tabContent.css({
                                minHeight: ""
                            });

                            $(window).trigger("resize");

                            $this.parents(".tab-link").first().removeClass("clicked");
                        });
                    } else if ($tabMode == "slide") {
                        $tabContent.children().slideDown($tabDuration, function() {
                            $(this).removeAttr("style").show();

                            if ($(this).find("[class*=heightLine]").length) heightLine();

                            if ($this.children("a").length) $this.children("a").click();

                            $(window).trigger("resize");

                            $this.parents(".tab-link").first().removeClass("clicked");
                        });
                    } else {
                        $tabDuration = $(this).parents(".tabs-switch").first().attr("data-duration") ? parseInt($(this).parents(".tabs-switch").first().attr("data-duration")) : 0;

                        $tabContent.children().stop().show($tabDuration, function() {
                            $(this).removeAttr("style").show();

                            if ($(this).find("[class*=heightLine]").length) heightLine();

                            if ($this.children("a").length) $this.children("a").click();

                            $(window).trigger("resize");

                            $this.parents(".tab-link").first().removeClass("clicked");
                        });
                    }
                } else {
                    if ($idxAll !== false && $idxAll >= 0 && $idx >= $idxAll) $idx -= 1;

                    if ($tabMode == "fade") {
                        if ($itself) {
                            $tabContent.children().eq($idx).stop().fadeToggle($tabDuration, function() {
                                if ($itHide) $(this).removeAttr("style").show();
                                else $(this).removeAttr("style").hide();

                                if ($(this).find("[class*=heightLine]").length) heightLine();

                                if ($this.children("a").length) $this.children("a").click();

                                $tabContent.css({
                                    minHeight: ""
                                });

                                $(window).trigger("resize");

                                $this.parents(".tab-link").first().removeClass("clicked");
                            });
                        } else {
                            $tabContent.css({
                                minHeight: $tabContent.outerHeight()
                            });

                            $tabContent.children().stop().fadeOut($tabDuration, function() {
                                $(this).removeAttr("style").hide();
                            });
                            $tabContent.children().eq($idx).stop().delay($tabDuration).fadeIn($tabDuration, function() {
                                $(this).removeAttr("style").show();

                                if ($(this).find("[class*=heightLine]").length) heightLine();

                                if ($this.children("a").length) $this.children("a").click();

                                $tabContent.css({
                                    minHeight: ""
                                });

                                $(window).trigger("resize");

                                $this.parents(".tab-link").first().removeClass("clicked");
                            });
                        }
                    } else if ($tabMode == "slide") {
                        if ($itself) {
                            $tabContent.children().eq($idx).stop().slideToggle($tabDuration, function() {
                                if ($itHide) $(this).removeAttr("style").show();
                                else $(this).removeAttr("style").hide();

                                if ($(this).find("[class*=heightLine]").length) heightLine();

                                if ($this.children("a").length) $this.children("a").click();

                                $(window).trigger("resize");

                                $this.parents(".tab-link").first().removeClass("clicked");
                            });
                        } else {
                            $tabContent.children().stop().slideUp($tabDuration, function() {
                                $(this).removeAttr("style").hide();
                            }).siblings().eq($idx).stop().slideDown($tabDuration, function() {
                                $(this).removeAttr("style").show();

                                if ($(this).find("[class*=heightLine]").length) heightLine();

                                if ($this.children("a").length) $this.children("a").click();

                                $(window).trigger("resize");

                                $this.parents(".tab-link").first().removeClass("clicked");
                            });
                        }
                    } else {
                        $tabDuration = $this.parents(".tabs-switch").first().attr("data-duration") ? parseInt($this.parents(".tabs-switch").first().attr("data-duration")) : 0;

                        if ($itself) {
                            $tabContent.children().eq($idx).stop().toggle($tabDuration, function() {
                                if ($itHide) $(this).removeAttr("style").show();
                                else $(this).removeAttr("style").hide();

                                if ($(this).find("[class*=heightLine]").length) heightLine();

                                if ($this.children("a").length) $this.children("a").click();

                                $(window).trigger("resize");

                                $this.parents(".tab-link").first().removeClass("clicked");
                            });
                        } else {
                            $tabContent.children().stop().hide($tabDuration, function() {
                                $(this).removeAttr("style").hide();
                            }).siblings().eq($idx).stop().show($tabDuration, function() {
                                $(this).removeAttr("style").show();

                                if ($(this).find("[class*=heightLine]").length) heightLine();

                                if ($this.children("a").length) $this.children("a").click();

                                $(window).trigger("resize");

                                $this.parents(".tab-link").first().removeClass("clicked");
                            });
                        }
                    }
                }

                setTimeout(function() {
                    $this.parents(".tab-link").first().removeClass("clicked");
                }, $tabDuration);

                if ($(".slick-slider").length > 0) {
                    $(window).trigger("resize");
                }

                if ($(".bx-wrapper").length > 0) {
                    setTimeout(function() {
                        $(window).trigger("resize");
                    }, 1);
                }

                if ($autoScroll) {
                    var $offsetY = $tabContent.offset().top,
                        $navOffset = 0;

                    if ($(".nav-fixed").length) $navOffset = typeof $(".nav-fixed").attr("data-height") != "undefined" ? parseInt($(".nav-fixed").attr("data-height")) : $(".nav-fixed").outerHeight();

                    if ($(".nav-target").length) {
                        if ($(".nav-fixed").length) $navOffset = typeof $(".nav-fixed").attr("data-height") != "undefined" ? parseInt($(".nav-fixed").attr("data-height")) : $(".nav-fixed").outerHeight();

                        $("html, body").stop().animate({
                            scrollTop: $offsetY - $navOffset + 1
                        }, 500);
                    } else {
                        $("html, body").stop().animate({
                            scrollTop: $offsetY - $navOffset + 1
                        }, 500);
                    }
                }
            }
        });
    }
    // END: tabs - switch

    // BEGIN: gmap
    if (typeof gmap === "object" && isObjectVar(gmap)) {
        var _dialogs_ = [],
            _dialogsOpen_ = true;

        function init() {
            var errorsMap = {
                    mapDiv: false,
                    latLong: false
                },
                objData = {}; // single || multiMap || multiPoint


            // checking
            if (typeof gmap.maps != "undefined" && Object.keys(gmap.maps).length > 0) { // multi map
                if (typeof gmap.maps[0] == "undefined") { // associative array
                    if (typeof gmap.maps.mapDiv == "undefined" || gmap.maps.mapDiv == "") errorsMap.mapDiv = 1;
                    else if ((typeof gmap.maps.latitude == "undefined" && typeof gmap.maps.latitude != "number") || (typeof gmap.maps.longitude == "undefined" && typeof gmap.maps.longitude != "number")) errorsMap.latLong = 1;
                } else { // object
                    for (var s in gmap.maps) { // loop
                        if (typeof gmap.maps[s].mapDiv == "undefined" || gmap.maps[s].mapDiv == "") {
                            errorsMap.mapDiv = 2;
                            break;
                        } else if ((typeof gmap.maps[s].latitude == "undefined" && typeof gmap.maps[s].latitude != "number") || (typeof gmap.maps[s].longitude == "undefined" && typeof gmap.maps[s].longitude != "number")) {
                            errorsMap.latLong = 2;
                            break;
                        }
                    }
                }
            } else { // single map
                if (typeof gmap.mapDiv == "undefined" || gmap.mapDiv == "") errorsMap.mapDiv = 3;
                else if ((typeof gmap.latitude == "undefined" && typeof gmap.latitude != "number") || (typeof gmap.longitude == "undefined" || typeof gmap.longitude != "number")) errorsMap.latLong = 3;
            }


            if (errorsMap.mapDiv || errorsMap.latLong) {
                console.info("ERROR", errorsMap);
                return false;
            } else {
                // if ()
                var init = initMap(gmap);
                // console.log(init);
            }

            /*
             * initialize
             *
             */

            function initMap(data) {
                var dataMap = {
                    mapDiv: false,
                    latitude: false,
                    longitude: false,

                    center: false,

                    zoom: 17,
                    minZoom: 2,
                    zoomControl: true,
                    disableDoubleClickZoom: true,
                    mapTypeControl: true,
                    scaleControl: true,
                    scrollwheel: false,
                    panControl: true,
                    streetViewControl: true,
                    draggable: true,
                    overviewMapControl: true,

                    styles: false,
                    style: false,

                    name: false,
                    desc: false,
                    tel: false,
                    email: false,

                    url: false,
                    logo: false,
                    size: false,
                    scale: false,
                    origin: false,
                    anchor: false,
                    optimized: false,

                    clickable: false,
                    hover: false,
                    html: false,

                    multi: false
                };

                // BEGIN: configs default
                if (typeof data.zoom != "undefined" && typeof data.zoom == "number") dataMap.zoom = data.zoom;
                if (typeof data.minZoom != "undefined" && typeof data.minZoom == "number") dataMap.minZoom = data.minZoom;
                if (typeof data.zoomControl != "undefined" && typeof data.zoomControl == "boolean") dataMap.zoomControl = data.zoomControl;
                if (typeof data.disableDoubleClickZoom != "undefined" && typeof data.disableDoubleClickZoom == "boolean") dataMap.disableDoubleClickZoom = data.disableDoubleClickZoom;
                if (typeof data.mapTypeControl != "undefined" && typeof data.mapTypeControl == "boolean") dataMap.mapTypeControl = data.mapTypeControl;
                if (typeof data.scaleControl != "undefined" && typeof data.scaleControl == "boolean") dataMap.scaleControl = data.scaleControl;
                if (typeof data.scrollwheel != "undefined" && typeof data.scrollwheel == "boolean") dataMap.scrollwheel = data.scrollwheel;
                if (typeof data.panControl != "undefined" && typeof data.panControl == "boolean") dataMap.panControl = data.panControl;
                if (typeof data.streetViewControl != "undefined" && typeof data.streetViewControl == "boolean") dataMap.streetViewControl = data.streetViewControl;
                if (typeof data.draggable != "undefined" && typeof data.draggable == "boolean") dataMap.draggable = data.draggable;
                if (typeof data.overviewMapControl != "undefined" && typeof data.overviewMapControl == "boolean") dataMap.overviewMapControl = data.overviewMapControl;

                if (typeof data.name != "undefined" && data.name != "") dataMap.name = data.name;
                if (typeof data.desc != "undefined" && data.desc != "") dataMap.desc = data.desc;
                if (typeof data.tel != "undefined" && data.tel != "") dataMap.tel = data.tel;
                if (typeof data.email != "undefined" && data.email != "") dataMap.email = data.email;
                if (typeof data.url != "undefined" && data.url != "") dataMap.url = data.url;
                if (typeof data.logo != "undefined" && data.logo != "") dataMap.logo = data.logo;
                if (typeof data.size != "undefined" && typeof data.size.width != "undefined" && data.size.width != "") dataMap.sizeWidth = data.size.width;
                if (typeof data.size != "undefined" && typeof data.size.height != "undefined" && data.size.height != "") dataMap.sizeHeight = data.size.height;
                if (typeof data.scale != "undefined" && typeof data.scale.width != "undefined" && data.scale.width != "") dataMap.scaleWidth = data.scale.width;
                if (typeof data.scale != "undefined" && typeof data.scale.height != "undefined" && data.scale.height != "") dataMap.scaleHeight = data.scale.height;
                if (typeof data.origin != "undefined" && typeof data.origin.x != "undefined" && data.origin.x != "") dataMap.originX = data.origin.x;
                if (typeof data.origin != "undefined" && typeof data.origin.y != "undefined" && data.origin.y != "") dataMap.originY = data.origin.y;
                if (typeof data.anchor != "undefined" && typeof data.anchor.x != "undefined" && data.anchor.x != "") dataMap.anchorX = data.anchor.x;
                if (typeof data.anchor != "undefined" && typeof data.anchor.y != "undefined" && data.anchor.y != "") dataMap.anchorY = data.anchor.y;
                if (typeof data.optimized != "undefined" && data.optimized != "") dataMap.optimized = data.optimized;

                if (typeof data.clickable != "undefined" && data.clickable != "") dataMap.clickable = data.clickable;
                if (typeof data.html != "undefined" && data.html != "") dataMap.html = data.html;
                if (typeof data.hover != "undefined" && typeof data.hover == "boolean") dataMap.hover = data.hover;

                if (typeof data.multi != "undefined" && Object.keys(data.multi).length > 0) dataMap.multi = data.multi;

                if (typeof data.styles != "undefined") dataMap.styles = data.styles;
                else if (typeof data.style != "undefined") {
                    dataMap.style = {};
                    if (typeof data.style.hue != "undefined") dataMap.style.hue = data.style.hue;
                    if (typeof data.style.gamma != "undefined") dataMap.style.gamma = data.style.gamma;
                    if (typeof data.style.lightness != "undefined") dataMap.style.lightness = data.style.lightness;
                    if (typeof data.style.saturation != "undefined") dataMap.style.saturation = data.style.saturation;
                }
                // END: configs default

                dataMap.mapDiv = data.mapDiv;
                dataMap.latitude = data.latitude;
                dataMap.longitude = data.longitude;

                if (typeof data.maps != "undefined" && Object.keys(data.maps).length > 0) { // multi map
                    var objMap = {};
                    if (typeof data.maps[0] == "undefined") objMap[0] = data.maps; // object
                    else objMap = data.maps; // array

                    for (var g in objMap) { // loop
                        var obj = objMap[g];

                        // BEGIN: override configs
                        if (typeof obj.zoom != "undefined" && typeof obj.zoom == "number") dataMap.zoom = obj.zoom;
                        if (typeof obj.minZoom != "undefined" && typeof obj.minZoom == "number") dataMap.minZoom = obj.minZoom;
                        if (typeof obj.zoomControl != "undefined" && typeof obj.zoomControl == "boolean") dataMap.zoomControl = obj.zoomControl;
                        if (typeof obj.disableDoubleClickZoom != "undefined" && typeof obj.disableDoubleClickZoom == "boolean") dataMap.disableDoubleClickZoom = obj.disableDoubleClickZoom;
                        if (typeof obj.mapTypeControl != "undefined" && typeof obj.mapTypeControl == "boolean") dataMap.mapTypeControl = obj.mapTypeControl;
                        if (typeof obj.scaleControl != "undefined" && typeof obj.scaleControl == "boolean") dataMap.scaleControl = obj.scaleControl;
                        if (typeof obj.scrollwheel != "undefined" && typeof obj.scrollwheel == "boolean") dataMap.scrollwheel = obj.scrollwheel;
                        if (typeof obj.panControl != "undefined" && typeof obj.panControl == "boolean") dataMap.panControl = obj.panControl;
                        if (typeof obj.streetViewControl != "undefined" && typeof obj.streetViewControl == "boolean") dataMap.streetViewControl = obj.streetViewControl;
                        if (typeof obj.draggable != "undefined" && typeof obj.draggable == "boolean") dataMap.draggable = obj.draggable;
                        if (typeof obj.overviewMapControl != "undefined" && typeof obj.overviewMapControl == "boolean") dataMap.overviewMapControl = obj.overviewMapControl;

                        if (typeof obj.styles != "undefined") dataMap.styles = obj.styles;
                        else if (typeof obj.style != "undefined") {
                            dataMap.style = {};
                            if (typeof obj.style.hue != "undefined") dataMap.style.hue = obj.style.hue;
                            if (typeof obj.style.gamma != "undefined") dataMap.style.gamma = obj.style.gamma;
                            if (typeof obj.style.lightness != "undefined") dataMap.style.lightness = obj.style.lightness;
                            if (typeof obj.style.saturation != "undefined") dataMap.style.saturation = obj.style.saturation;
                        }

                        if (typeof obj.name != "undefined" && obj.name != "") dataMap.name = obj.name;
                        if (typeof obj.desc != "undefined" && obj.desc != "") dataMap.desc = obj.desc;
                        if (typeof obj.tel != "undefined" && obj.tel != "") dataMap.tel = obj.tel;
                        if (typeof obj.email != "undefined" && obj.email != "") dataMap.email = obj.email;
                        if (typeof obj.url != "undefined" && obj.url != "") dataMap.url = obj.url;
                        if (typeof obj.logo != "undefined" && obj.logo != "") dataMap.logo = obj.logo;
                        if (typeof obj.sizeWidth != "undefined" && obj.sizeWidth != "") dataMap.sizeWidth = obj.sizeWidth;
                        if (typeof obj.sizeHeight != "undefined" && obj.sizeHeight != "") dataMap.sizeHeight = obj.sizeHeight;
                        if (typeof obj.scaleWidth != "undefined" && obj.scaleWidth != "") dataMap.scaleWidth = obj.scaleWidth;
                        if (typeof obj.scaleHeight != "undefined" && obj.scaleHeight != "") dataMap.scaleHeight = obj.scaleHeight;
                        if (typeof obj.originX != "undefined" && obj.originX != "") dataMap.originX = obj.originX;
                        if (typeof obj.originY != "undefined" && obj.originY != "") dataMap.originY = obj.originY;
                        if (typeof obj.anchorX != "undefined" && obj.anchorX != "") dataMap.anchorX = obj.anchorX;
                        if (typeof obj.anchorY != "undefined" && obj.anchorY != "") dataMap.anchorY = obj.anchorY;
                        if (typeof obj.optimized != "undefined" && obj.optimized != "") dataMap.optimized = obj.optimized;
                        // END: override configs

                        if (typeof obj.clickable != "undefined" && obj.clickable != "") dataMap.clickable = obj.clickable;
                        if (typeof obj.html != "undefined" && obj.html != "") dataMap.html = obj.html;
                        if (typeof obj.hover != "undefined" && typeof obj.hover == "boolean") dataMap.hover = obj.hover;
                        if (typeof obj.multi != "undefined" && Object.keys(obj.multi).length > 0) dataMap.multi = obj.multi;

                        dataMap.mapDiv = obj.mapDiv;
                        dataMap.latitude = obj.latitude;
                        dataMap.longitude = obj.longitude;

                        if (typeof obj.center != "undefined") {
                            dataMap.center = {};
                            if (typeof obj.center.latitude != "undefined") dataMap.center.latitude = obj.center.latitude;
                            if (typeof obj.center.longitude != "undefined") dataMap.center.longitude = obj.center.longitude;
                        } else {
                            dataMap.center = {
                                latitude: obj.latitude,
                                longitude: obj.longitude
                            };
                        }

                        loadMap(dataMap);
                    }
                } else { // single map
                    if (typeof data.center != "undefined") {
                        dataMap.center = {};
                        if (typeof data.center.latitude != "undefined") dataMap.center.latitude = data.center.latitude;
                        if (typeof data.center.longitude != "undefined") dataMap.center.longitude = data.center.longitude;
                    } else {
                        dataMap.center = {
                            latitude: data.latitude,
                            longitude: data.longitude
                        };
                    }

                    loadMap(dataMap);
                }

                return dataMap;
            }

            function loadMap(data) {
                var elm = data.mapDiv;

                elm = elm.substring(0, 1) == "#" ? elm.substring(1) : elm; // remove hash

                var mapElement = document.getElementById(elm),
                    styleOptions = [],
                    mapOptions = {
                        center: new google.maps.LatLng(data.center.latitude, data.center.longitude),
                        zoom: data.zoom,
                        minZoom: data.minZoom,
                        zoomControl: data.zoomControl,
                        zoomControlOptions: {
                            style: google.maps.ZoomControlStyle.DEFAULT,
                        },
                        disableDoubleClickZoom: data.disableDoubleClickZoom,
                        scaleControl: data.scaleControl,
                        scrollwheel: data.scrollwheel,
                        panControl: data.panControl,
                        streetViewControl: data.streetViewControl,
                        draggable: data.draggable,
                        mapTypeControl: data.mapTypeControl,
                        mapTypeControlOptions: {
                            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                        },
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        overviewMapControl: data.overviewMapControl,
                        overviewMapControlOptions: {
                            opened: false,
                        }
                    },
                    googleMap = new google.maps.Map(mapElement, mapOptions);

                if (data.multi === false) {
                    var arr = {};

                    if (typeof data["name"] != "undefined") arr["name"] = data["name"];
                    if (typeof data["desc"] != "undefined") arr["desc"] = data["desc"];
                    if (typeof data["tel"] != "undefined") arr["tel"] = data["tel"];
                    if (typeof data["email"] != "undefined") arr["email"] = data["email"];
                    if (typeof data["url"] != "undefined") arr["url"] = data["url"];
                    if (typeof data["logo"] != "undefined") arr["logo"] = data["logo"];
                    if (typeof data["sizeWidth"] != "undefined") arr["sizeWidth"] = data["sizeWidth"];
                    if (typeof data["sizeHeight"] != "undefined") arr["sizeHeight"] = data["sizeHeight"];
                    if (typeof data["scaleWidth"] != "undefined") arr["scaleWidth"] = data["scaleWidth"];
                    if (typeof data["scaleHeight"] != "undefined") arr["scaleHeight"] = data["scaleHeight"];
                    if (typeof data["originX"] != "undefined") arr["originX"] = data["originX"];
                    if (typeof data["originY"] != "undefined") arr["originY"] = data["originY"];
                    if (typeof data["anchorX"] != "undefined") arr["anchorX"] = data["anchorX"];
                    if (typeof data["anchorY"] != "undefined") arr["anchorY"] = data["anchorY"];
                    if (typeof data["optimized"] != "undefined") arr["optimized"] = data["optimized"];
                    if (typeof data["clickable"] != "undefined") arr["clickable"] = data["clickable"];
                    if (typeof data["html"] != "undefined") arr["html"] = data["html"];
                    if (typeof data["hover"] != "undefined") arr["hover"] = data["hover"];

                    arr["longitude"] = data["longitude"];
                    arr["latitude"] = data["latitude"];

                    setMaps(arr, googleMap, data.center);
                } else {
                    for (var i = 0; i < Object.keys(data.multi).length; i++) {
                        var arr = data.multi[i];

                        if (typeof data["clickable"] != "undefined") arr["clickable"] = data.clickable;
                        if (typeof data["html"] != "undefined") arr["html"] = data.html;
                        if (typeof data["hover"] != "undefined") arr["hover"] = data.hover;

                        if (typeof arr["size"] != "undefined") {
                            if (typeof arr["size"]["width"] != "undefined") arr["sizeWidth"] = arr["size"]["width"];
                            if (typeof arr["size"]["height"] != "undefined") arr["sizeHeight"] = arr["size"]["height"];

                            delete arr["size"];
                        }
                        if (typeof arr["scale"] != "undefined") {
                            if (typeof arr["scale"]["width"] != "undefined") arr["scaleWidth"] = arr["scale"]["width"];
                            if (typeof arr["scale"]["height"] != "undefined") arr["scaleHeight"] = arr["scale"]["height"];

                            delete arr["scale"];
                        }
                        if (typeof arr["origin"] != "undefined") {
                            if (typeof arr["origin"]["x"] != "undefined") arr["originX"] = arr["origin"]["x"];
                            if (typeof arr["origin"]["y"] != "undefined") arr["originY"] = arr["origin"]["y"];

                            delete arr["origin"];
                        }
                        if (typeof arr["anchor"] != "undefined") {
                            if (typeof arr["anchor"]["x"] != "undefined") arr["anchorX"] = arr["anchor"]["x"];
                            if (typeof arr["anchor"]["y"] != "undefined") arr["anchorY"] = arr["anchor"]["y"];

                            delete arr["anchor"];
                        }
                        if (typeof arr["optimized"] != "undefined") arr["optimized"] = arr["optimized"];
                        setMaps(arr, googleMap, data.center);
                    }
                }

                // stylers
                if (data.styles !== false) styleOptions = data.styles;
                else if (data.style !== false) {
                    if (typeof data.style.hue != "undefined" || typeof data.style.gamma != "undefined" || typeof data.style.lightness != "undefined" || typeof data.style.saturation != "undefined") {
                        if (typeof styleOptions[0] == "undefined") styleOptions[0] = {};
                        if (typeof styleOptions[0].stylers == "undefined") styleOptions[0].stylers = [];
                    }

                    if (typeof data.style.hue != "undefined") {
                        styleOptions[0].stylers.push({
                            hue: data.style.hue
                        });
                    }
                    if (typeof data.style.gamma != "undefined") {
                        styleOptions[0].stylers.push({
                            gamma: data.style.gamma
                        });
                    }
                    if (typeof data.style.lightness != "undefined") {
                        styleOptions[0].stylers.push({
                            lightness: data.style.lightness
                        });
                    }
                    if (typeof data.style.saturation != "undefined") {
                        styleOptions[0].stylers.push({
                            saturation: data.style.saturation
                        });
                    }
                }

                var styledMapOptions = {
                        name: "MAP"
                    },
                    sampleType = new google.maps.StyledMapType(styleOptions, styledMapOptions);

                googleMap.mapTypes.set("sample", sampleType);
                googleMap.setMapTypeId("sample");

                // force reset
                googleMap.setZoom(data.zoom);
                googleMap.setCenter(new google.maps.LatLng(data.center.latitude, data.center.longitude));
            }

            function setMaps(obj, map, center) {
                var options = {};

                if (obj["html"] !== false) {
                    if (typeof obj["name"] != "undefined") options["title"] = obj["name"];
                    if (typeof obj["desc"] != "undefined") options["desc"] = obj["desc"];
                    if (typeof obj["tel"] != "undefined") options["tel"] = obj["tel"];
                    if (typeof obj["email"] != "undefined") options["email"] = obj["email"];
                    if (typeof obj["url"] != "undefined") options["web"] = obj["url"];
                }

                if (typeof obj["logo"] != "undefined") {
                    var optIcon = {};

                    optIcon["url"] = obj["logo"];

                    if (typeof obj["sizeWidth"] != "undefined" && typeof obj["sizeHeight"] != "undefined" && Number.isInteger(obj["sizeWidth"]) && Number.isInteger(obj["sizeHeight"])) optIcon["size"] = new google.maps.Size(obj["sizeWidth"], obj["sizeHeight"]);

                    if (typeof obj["scaleWidth"] != "undefined" && typeof obj["scaleHeight"] != "undefined" && Number.isInteger(obj["scaleWidth"]) && Number.isInteger(obj["scaleHeight"])) optIcon["scaledSize"] = new google.maps.Size(obj["scaleWidth"], obj["scaleHeight"]);

                    if (typeof obj["originX"] != "undefined" && typeof obj["originY"] != "undefined" && Number.isInteger(obj["originX"]) && Number.isInteger(obj["originY"])) optIcon["origin"] = new google.maps.Point(obj["originX"], obj["originY"]);

                    if (typeof obj["anchorX"] != "undefined" && typeof obj["anchorY"] != "undefined" && Number.isInteger(obj["anchorX"]) && Number.isInteger(obj["anchorY"])) optIcon["anchor"] = new google.maps.Point(obj["anchorX"], obj["anchorY"]);

                    if (typeof obj["optimized"] != "undefined") optIcon["optimized"] = obj["optimized"];

                    if (typeof optIcon["size"] != "undefined" && typeof optIcon["origin"] != "undefined" && typeof optIcon["anchor"] != "undefined") options["icon"] = optIcon;
                    else options["icon"] = obj["logo"] ? new google.maps.MarkerImage(obj["logo"]) : null;
                }

                options["position"] = new google.maps.LatLng(obj["latitude"], obj["longitude"]);
                options["map"] = map;

                var marker = new google.maps.Marker(options);
                gmarkers[gnum] = marker;
                gnum++;

                if (obj["clickable"] == "js") {
                    google.maps.event.addListener(marker, "click", function() {
                        if (obj["click"].constructor == Function) obj["click"].apply(this, [].concat(Array.prototype.slice.call(arguments)));
                    });
                }

                if (obj["html"] !== false) {
                    var dialog = new google.maps.InfoWindow(),
                        infoWindowVisible = (function() {
                            var currentlyVisible = false;
                            return function(visible) {
                                for (var z in visible) {
                                    if (/closure_uid/i.test(z)) {
                                        currentlyVisible = visible[z];

                                        break;
                                    }
                                }

                                return currentlyVisible;


                                if (visible !== undefined) currentlyVisible = visible;
                                return currentlyVisible;
                            };
                        }()),
                        dialogShow = (function() {
                            return function() {
                                var vCheck = infoWindowVisible(marker);
                                if (vCheck == _dialogsOpen_) {
                                    dialog.close();
                                    _dialogsOpen_ = true;
                                } else {
                                    var tpl = {};
                                    tpl["name"] = typeof obj["name"] != "undefined" ? obj["name"] : "";
                                    tpl["desc"] = typeof obj["desc"] != "undefined" ? obj["desc"] : "";
                                    tpl["tel"] = typeof obj["tel"] != "undefined" ? obj["tel"] : "";
                                    tpl["email"] = typeof obj["email"] != "undefined" ? obj["email"] : "";
                                    tpl["url"] = typeof obj["url"] != "undefined" ? obj["url"] : "";

                                    var html =
                                        obj["html"]
                                        .replace(/{name}/ig, tpl["name"])
                                        .replace(/{title}/ig, tpl["name"])

                                    .replace(/{txt}/ig, tpl["desc"])
                                        .replace(/{text}/ig, tpl["desc"])
                                        .replace(/{desc}/ig, tpl["desc"])
                                        .replace(/{description}/ig, tpl["desc"])

                                    .replace(/{tel}/ig, tpl["tel"])
                                        .replace(/{telephone}/ig, tpl["tel"])
                                        .replace(/{phone}/ig, tpl["tel"])
                                        .replace(/{moible}/ig, tpl["tel"])

                                    .replace(/{mail}/ig, tpl["email"])
                                        .replace(/{email}/ig, tpl["email"])

                                    .replace(/{url}/ig, tpl["url"])
                                        .replace(/{web}/ig, tpl["url"])
                                        .replace(/{website}/ig, tpl["url"]);

                                    _dialogs_.forEach(function(d, ix) {
                                        google.maps.event.trigger(d, "closeclick");
                                        d.close(map, marker);
                                    });

                                    dialog = new google.maps.InfoWindow({
                                        content: html
                                    });

                                    // reset
                                    _dialogs_ = [];
                                    _dialogs_.push(dialog);

                                    dialog.open(map, marker);
                                    _dialogsOpen_ = vCheck;
                                }
                            };
                        }());

                    // _dialogs_.push(dialog);

                    // events
                    google.maps.event.addListener(marker, "click", function() {
                        if (obj["clickable"] == "link" && typeof obj["url"] != "undefined" && obj["url"] != "") {
                            if (!isExternal(obj["url"]) && $(obj["url"]).length) {
                                $("html, body").stop().animate({
                                    scrollTop: $(obj["url"]).offset().top
                                }, 500);
                            } else window.open(obj["url"], "_parent");
                        } else if (obj["clickable"] == "popup" && isHTML(obj.html)) {
                            map.panTo(marker.getPosition());
                            dialogShow();
                        }
                    });
                    google.maps.event.addListener(dialog, "closeclick", function() {
                        infoWindowVisible(marker);
                    });

                    if (obj["hover"] === true && obj["clickable"] == "link") {
                        google.maps.event.addListener(marker, "mouseover", function() {
                            dialogShow();
                        });

                        google.maps.event.addListener(marker, "mouseout", function() {
                            dialog.close();
                            infoWindowVisible(false);
                        });
                    }
                }

                /*
                window.onresize = function(event) {
                	google.maps.event.trigger(map, "resize");
                	map.setCenter(new google.maps.LatLng(center.latitude, center.longitude));
                };
                */

                // always center
                google.maps.event.addDomListener(window, "resize", function() {
                    var center = map.getCenter();
                    google.maps.event.trigger(map, "resize");
                    // map.setCenter(new google.maps.LatLng(center.latitude, center.longitude));
                    map.setCenter(center);
                });

                google.maps.event.addListenerOnce(map, "idle", function() {
                    google.maps.event.trigger(map, "resize");
                    map.setCenter(new google.maps.LatLng(center.latitude, center.longitude));
                });

                // google.maps.event.trigger(map, "resize"); // onload

                $(window).resize(function() {
                    google.maps.event.trigger(map, "resize");
                });
            }
        }
        google.maps.event.addDomListener(window, "load", init);
    }
    // END: gmap

    // BEGIN: rollover button
    $("body").on({
        click: function() {
            $(this).parents(".bxSlider-pager").find("img.btn").trigger("mouseout");

            if ((UA.indexOf("iPad") < 0) && (UA.indexOf("iPhone") < 0) && (UA.indexOf("iPod") < 0)) $(this).trigger("mouseout").trigger("mouseover"); // not iOS
        },
        touchstart: function() {
            $(this).trigger("click");
        },
        mouseover: function() {
            if ((UA.indexOf("iPad") < 0) && (UA.indexOf("iPhone") < 0) && (UA.indexOf("iPod") < 0)) { // not iOS
                if (!$(this).data("src-original")) $(this).data("src-original", $(this).attr("src"));

                $(this).attr("src").match(/^(.*)(\.{1}.*)/g);

                var $src = RegExp.$1 + "_on" + RegExp.$2;

                $(this).attr("src", $src); // update src
            }
        },
        mouseout: function() {
            if ((UA.indexOf("iPad") < 0) && (UA.indexOf("iPhone") < 0) && (UA.indexOf("iPod") < 0)) { // not iOS
                if ($(this).hasClass("copy-change")) {
                    var _src_ = $(this).attr("src");

                    _src_ = _src_.replace(/^(.*?)_on\.(.*)$/, "$1.$2");

                    $(this)
                        .attr("src", _src_) // update src
                        .removeClass("copy-change");
                } else if ($(this).data("src-original")) $(this).attr("src", $(this).data("src-original")); // update src

                $(this).removeData("src-original");
            }
        }
    }, "img.btn");

    $("body").on({
        click: function() {
            $(this).parents(".bxSlider-pager").find("picture.btn").trigger("mouseout");

            $(this).trigger("mouseout").trigger("mouseover");
        },
        touchstart: function() {
            $(this).trigger("click");
        },
        mouseover: function() {
            $(this).children().each(function() {
                var _attr_ = false;
                if ($(this).prop("tagName").toLowerCase() == "img") _attr_ = "src";
                else if ($(this).prop("tagName").toLowerCase() == "source") _attr_ = "srcset";

                if (_attr_ && $(this).attr(_attr_)) {
                    if (!$(this).data("src-original")) $(this).data("src-original", $(this).attr(_attr_));

                    $(this).attr(_attr_).match(/^(.*)(\.{1}.*)/g);

                    var $src = RegExp.$1 + "_on" + RegExp.$2;

                    $(this).attr(_attr_, $src); // update src
                }
            });
        },
        mouseout: function() {
            var $picture = $(this);

            $picture.children().each(function() {
                var _attr_ = false;
                if ($(this).prop("tagName").toLowerCase() == "img") _attr_ = "src";
                else if ($(this).prop("tagName").toLowerCase() == "source") _attr_ = "srcset";

                if (_attr_ && $(this).attr(_attr_)) {
                    if ($picture.hasClass("copy-change")) {
                        var _src_ = $(this).attr(_attr_);

                        _src_ = _src_.replace(/^(.*?)_on\.(.*)$/, "$1.$2");

                        $(this)
                            .attr(_attr_, _src_) // update src
                            .removeClass("copy-change");
                    } else if ($(this).data("src-original")) $(this).attr(_attr_, $(this).data("src-original")); // update src

                    $(this).removeData("src-original");
                }
            });
        }
    }, "picture.btn");
    // END: rollover button

    // BEGIN: smooth scroll
    // $("body").on("click", "a[href*='#']:not([href='#'])", function(e) {
    // $("body").on("click", "a[*|href*='#']:not([href='#'])", function(e) {
    $("body").on("click", "a[href*='#']:not([href='#']), a[xlink\\:href*='#']:not([xlink\\:href='#'])", function(e) {
        var parseURL = function(url) {
                var tag = document.createElement("a");
                tag.href = url;

                return tag;
            },
            parser = null;

        if ($(this).attr("href")) parser = parseURL($(this).attr("href"));
        else if ($(this).attr("xlink:href")) parser = parseURL($(this).attr("xlink:href"));



        // .nav-fixed: elm sẽ cố định
        // .nav-target: tọa độ sẽ tính
        // .nav-pin: elm sẽ gắn .fixed
        if (parser && location.pathname.replace(/^\//, "") == parser.pathname.replace(/^\//, "") && location.hostname == parser.hostname && !$(this).hasClass("unsmooth")) {
            var _hash_ = this.hash || $(this).attr("href") || $(this).attr("xlink:href"),
                ptnHash = /([;?%&,+*~\':"!^$[\]()=>|\/@])/g, // [storage] FCBase.regex.trimHash
                trimHash = _hash_.replace(ptnHash, "\\$1"),
                $anchor = $(trimHash);

            $anchor = $anchor.length > 0 ? $anchor : $("[name=" + trimHash.slice(1) + "]");

            if ($anchor.length) {
                e.preventDefault();

                if ($anchor.parents(".tab-content").first().length > 0) $anchor = $anchor.parents(".tab-content").first();

                var $offsetY = $anchor.offset().top,
                    $navOffset = 0;

                if ($(".nav-fixed").length) $navOffset = typeof $(".nav-fixed").attr("data-height") != "undefined" ? parseInt($(".nav-fixed").attr("data-height")) : $(".nav-fixed").outerHeight();

                if ($(".tabs-switch").length) {
                    $(".tabs-switch").each(function() {
                        var $tabsSwitch = $(this),
                            $tabLink = $tabsSwitch.children(".tab-link");

                        if ($tabLink.children("[data-tab-anchor='" + trimHash + "']").length) $tabLink.children("[data-tab-anchor='" + trimHash + "']").click(); // trigger for set active tab
                    });
                }

                if ($(".nav-target").length) {
                    // $("html, body").stop().animate({
                    // scrollTop: $(".nav-target").offset().top + 10
                    // }, 100, function() {
                    if ($(".nav-fixed").length) $navOffset = typeof $(".nav-fixed").attr("data-height") != "undefined" ? parseInt($(".nav-fixed").attr("data-height")) : $(".nav-fixed").outerHeight();

                    $("html, body").stop().animate({
                        scrollTop: $offsetY - $navOffset + 1
                    }, 500);
                    // });
                } else {
                    $("html, body").stop().animate({
                        scrollTop: $offsetY - $navOffset + 1
                    }, 500);
                }

                // window.location.hash = trimHash; // update location

                return false;
            } else console.log("[smooth-scroll] Anchor element not found");
        }
    });
    // END: smooth scroll

    // BEGIN: scroll to top
    /*if ($(window).scrollTop() > 0) $("#pagetop").addClass("visible");
    else $("#pagetop").removeClass("visible");*/



    // BEGIN: text vertical
    $(".txt-vertical").each(function() {
        if (!$(this).hasClass("all-str")) {
            var $regex = /(\d{1,2})/g;

            if ($(this).hasClass("per-line")) $regex = /(\d)/g;

            $(this).html(function(idx, val) {
                return val.replace($regex, '<span class="int">$1</span>');
            });
        }

        if ($(this).children(".txt-normal").length) {
            $(this).children(".txt-normal").html(function(idx, val) {
                var $characters = $.trim(val).split("");
                return '<span class="int">' + $characters.join('</span><span class="int">') + '</span>';
            });
        }
    });
    $(".txt-vertical-x").each(function() {
        $(this).html($(this).text().replace(/(.)/g, "<span>$1</span>"));
    });
    // END: text vertical

    // BEGIN: social button
    var __socialsHTML__ = "",
        __socialsLang = $("html").attr("lang") !== undefined && $.trim($("html").attr("lang")).length == 2 ? $.trim($("html").attr("lang")).toLowerCase() : "ja",
        $socialsLine = "",
        $socialsTwitter = "",
        $socialsFacebook = "",
        locationURL = window.location.href || location.href;

    $socialsTwitter += '<div class="social-twitter">';
    $socialsTwitter += '<a href="https://twitter.com/share" class="twitter-share-button">Tweet</a>';
    $socialsTwitter += '<script type="text/javascript">!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="https://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>';
    $socialsTwitter += '</div>';

    $socialsFacebook += '<div class="social-facebook">';
    $socialsFacebook += '<div class="fb-like" data-layout="button_count" data-action="like" data-show-faces="false" data-share="false"></div>';
    $socialsFacebook += '</div>';

    $socialsLine += '<div class="social-line">';
    $socialsLine += '<div class="line-it-button" data-lang="' + __socialsLang + '" data-type="like" data-url="' + locationURL + '" data-share="true" style="display: none;">';
    $socialsLine += '<script src="https://d.line-scdn.net/r/web/social-plugin/js/thirdparty/loader.min.js" async="async" defer="defer"></script>';
    $socialsLine += '</div>';
    $socialsLine += '</div>';

    if ($("#socialbuttons").length) {
        var $socialsOrder = typeof $("#socialbuttons").attr("data") != "undefined" ? $("#socialbuttons").attr("data").split("") : false;

        if (typeof $socialsOrder == "object" && $socialsOrder.length) {
            for (var socialsType in $socialsOrder) {
                if ($.trim(socialsType).length > 0) {
                    socialsType = socialsType.toLowerCase();

                    if ($socialsOrder[socialsType].toLocaleLowerCase() === "f") __socialsHTML__ += $socialsFacebook;
                    else if ($socialsOrder[socialsType].toLocaleLowerCase() === "t") __socialsHTML__ += $socialsTwitter;
                    else if ($socialsOrder[socialsType].toLocaleLowerCase() === "l") __socialsHTML__ += $socialsLine;
                }
            }
        } else {
            __socialsHTML__ += $socialsTwitter;
            __socialsHTML__ += $socialsFacebook;
            __socialsHTML__ += $socialsLine;
        }

        $("#socialbuttons").html(__socialsHTML__);
    }
    // END: social button

    /* fix smoothscroll on IE - jumpy fixed background */
    if (navigator.userAgent.match(/MSIE 10/i) || navigator.userAgent.match(/Trident\/7\./) || navigator.userAgent.match(/Edge\/12\./)) {
        $("body.ie-smoothscroll")
            .on("mousewheel", function(e) {
                if (event.preventDefault) event.preventDefault();
                else event.returnValue = false;

                var delta = null,
                    offsetX = window.scrollX || window.pageXOffset || window.document.documentElement.scrollLeft,
                    offsetY = window.scrollY || window.pageYOffset || window.document.documentElement.scrollTop;

                if (e.wheelDelta) delta = e.wheelDelta;
                else if (e.originalEvent) {
                    if (e.originalEvent.wheelDelta) delta = e.originalEvent.wheelDelta;
                    else if (e.originalEvent.deltaY) delta = 0 - e.originalEvent.deltaY;
                    else if (e.originalEvent.detail) delta = e.originalEvent.detail * -40;
                } else if (event.originalEvent) {
                    if (event.originalEvent.wheelDelta) delta = event.originalEvent.wheelDelta;
                    else if (event.originalEvent.deltaY) delta = 0 - event.originalEvent.deltaY;
                    else if (event.originalEvent.detail) delta = event.originalEvent.detail * -40;
                }

                if (delta !== null) window.scrollTo(0, offsetY - delta);
            });
    }

    // scrollBefore(); // smoothscroll before page loaded

    $("body").on({
        mouseup: function() {
            // $("html").addClass("break-jump");
            $(this).removeClass("scrollable");
        },
        mousedown: function() {
            // $("html").addClass("break-jump");
            $(this).addClass("scrollable");
        },
        mouseleave: function() {
            // $("html").addClass("break-jump");
            $(this).removeClass("scrollable");
        }
    }, ".gmap");

    // BEGIN: .pagination
    $(".pagination").each(function() {
        initPager($(this));
    });

    $(".pagination")
        .on("click", ".page-link .page-first", function() {
            var $pagination = $(this).parents(".pagination").first(),
                $pageContent = $pagination.children(".page-content"),
                $pageLink = $pagination.children(".page-link"),
                mode = $pagination.attr("data-mode") !== "undefined" && $.inArray($pagination.attr("data-mode"), ["fade", "slide", "block"]) >= 0 ? $pagination.attr("data-mode") : "block",
                duration = typeof $pagination.attr("data-duration") !== "undefined" && $pagination.attr("data-duration").length > 0 ? parseInt($pagination.attr("data-duration"), 10) : (mode == "block" ? 0 : 300),
                scrollable = typeof $pagination.attr("data-scroll") !== "undefined" && $.inArray($pagination.attr("data-scroll"), ["true", "on", "enable", "enabled", "1"]) >= 0 ? true : false,
                navOffset = 0;

            if (!$pagination.hasClass("clicked")) {
                $pagination.addClass("clicked");

                if ($(".nav-fixed").length > 0) navOffset = typeof $(".nav-fixed").attr("data-height") != "undefined" ? parseInt($(".nav-fixed").attr("data-height")) : $(".nav-fixed").outerHeight();

                if (mode == "fade") {
                    if ($pageContent.children().length > 1) {
                        $pageContent.children().stop().fadeOut(duration, function() {
                            $(this).removeAttr("style").removeClass("active");
                        }).siblings().first().stop().delay(duration).fadeIn(duration, function() {
                            $(this).removeAttr("style").addClass("active");

                            if (scrollable) {
                                $("body, html").stop().animate({
                                    scrollTop: $pagination.offset().top - navOffset
                                }, 300);
                            }

                            $pagination.removeClass("clicked");
                        });
                    } else {
                        $pageContent.children().first().stop().fadeIn(duration, function() {
                            $(this).removeAttr("style").addClass("active");

                            if (scrollable) {
                                $("body, html").stop().animate({
                                    scrollTop: $pagination.offset().top - navOffset
                                }, 300);
                            }

                            $pagination.removeClass("clicked");
                        });
                    }
                } else if (mode == "slide") {
                    if ($pageContent.children().length > 1) {
                        $pageContent.children().stop().slideUp(duration, function() {
                            $(this).removeAttr("style").removeClass("active");
                        }).siblings().first().stop().delay(duration).slideDown(duration, function() {
                            $(this).removeAttr("style").addClass("active");

                            if (scrollable) {
                                $("body, html").stop().animate({
                                    scrollTop: $pagination.offset().top - navOffset
                                }, 300);
                            }

                            $pagination.removeClass("clicked");
                        });
                    } else {
                        $pageContent.children().first().stop().slideDown(duration, function() {
                            $(this).removeAttr("style").addClass("active");

                            if (scrollable) {
                                $("body, html").stop().animate({
                                    scrollTop: $pagination.offset().top - navOffset
                                }, 300);
                            }

                            $pagination.removeClass("clicked");
                        });
                    }
                } else {
                    if ($pageContent.children().length > 1) {
                        $pageContent.children().stop().hide(duration, function() {
                            $(this).removeAttr("style").removeClass("active");
                        }).siblings().first().stop().delay(duration).show(duration, function() {
                            $(this).removeAttr("style").addClass("active");

                            if (scrollable) {
                                $("body, html").stop().animate({
                                    scrollTop: $pagination.offset().top - navOffset
                                }, 300);
                            }

                            $pagination.removeClass("clicked");
                        });
                    } else {
                        $pageContent.children().first().stop().show(duration, function() {
                            $(this).removeAttr("style").addClass("active");

                            if (scrollable) {
                                $("body, html").stop().animate({
                                    scrollTop: $pagination.offset().top - navOffset
                                }, 300);
                            }

                            $pagination.removeClass("clicked");
                        });
                    }
                }

                $pageLink.find(".page-item.active").removeClass("active");
                $pageLink.each(function() {
                    $(this).find(".page-item").first().addClass("active");
                });
            }
        })
        .on("click", ".page-link .page-last", function() {
            var $pagination = $(this).parents(".pagination").first(),
                $pageContent = $pagination.children(".page-content"),
                $pageLink = $pagination.children(".page-link"),
                mode = $pagination.attr("data-mode") !== "undefined" && $.inArray($pagination.attr("data-mode"), ["fade", "slide", "block"]) >= 0 ? $pagination.attr("data-mode") : "block",
                duration = typeof $pagination.attr("data-duration") !== "undefined" && $pagination.attr("data-duration").length > 0 ? parseInt($pagination.attr("data-duration"), 10) : (mode == "block" ? 0 : 300),
                scrollable = typeof $pagination.attr("data-scroll") !== "undefined" && $.inArray($pagination.attr("data-scroll"), ["true", "on", "enable", "enabled", "1"]) >= 0 ? true : false,
                navOffset = 0;

            if (!$pagination.hasClass("clicked")) {
                $pagination.addClass("clicked");

                if ($(".nav-fixed").length > 0) navOffset = typeof $(".nav-fixed").attr("data-height") != "undefined" ? parseInt($(".nav-fixed").attr("data-height")) : $(".nav-fixed").outerHeight();

                if (mode == "fade") {
                    if ($pageContent.children().length > 1) {
                        $pageContent.children().stop().fadeOut(duration, function() {
                            $(this).removeAttr("style").removeClass("active");
                        }).siblings().last().stop().delay(duration).fadeIn(duration, function() {
                            $(this).removeAttr("style").addClass("active");

                            if (scrollable) {
                                $("body, html").stop().animate({
                                    scrollTop: $pagination.offset().top - navOffset
                                }, 300);
                            }

                            $pagination.removeClass("clicked");
                        });
                    } else {
                        $pageContent.children().last().stop().fadeIn(duration, function() {
                            $(this).removeAttr("style").addClass("active");

                            if (scrollable) {
                                $("body, html").stop().animate({
                                    scrollTop: $pagination.offset().top - navOffset
                                }, 300);
                            }

                            $pagination.removeClass("clicked");
                        });
                    }
                } else if (mode == "slide") {
                    if ($pageContent.children().length > 1) {
                        $pageContent.children().stop().slideUp(duration, function() {
                            $(this).removeAttr("style").removeClass("active");
                        }).siblings().last().stop().delay(duration).slideDown(duration, function() {
                            $(this).removeAttr("style").addClass("active");

                            if (scrollable) {
                                $("body, html").stop().animate({
                                    scrollTop: $pagination.offset().top - navOffset
                                }, 300);
                            }

                            $pagination.removeClass("clicked");
                        });
                    } else {
                        $pageContent.children().last().stop().slideDown(duration, function() {
                            $(this).removeAttr("style").addClass("active");

                            if (scrollable) {
                                $("body, html").stop().animate({
                                    scrollTop: $pagination.offset().top - navOffset
                                }, 300);
                            }

                            $pagination.removeClass("clicked");
                        });
                    }
                } else {
                    if ($pageContent.children().length > 1) {
                        $pageContent.children().stop().hide(duration, function() {
                            $(this).removeAttr("style").removeClass("active");
                        }).siblings().last().stop().delay(duration).show(duration, function() {
                            $(this).removeAttr("style").addClass("active");

                            if (scrollable) {
                                $("body, html").stop().animate({
                                    scrollTop: $pagination.offset().top - navOffset
                                }, 300);
                            }

                            $pagination.removeClass("clicked");
                        });
                    } else {
                        $pageContent.children().last().stop().show(duration, function() {
                            $(this).removeAttr("style").addClass("active");

                            if (scrollable) {
                                $("body, html").stop().animate({
                                    scrollTop: $pagination.offset().top - navOffset
                                }, 300);
                            }

                            $pagination.removeClass("clicked");
                        });
                    }
                }

                $pageLink.find(".page-item.active").removeClass("active");
                $pageLink.each(function() {
                    $(this).find(".page-item").last().addClass("active");
                });
            }
        })
        .on("click", ".page-link .page-next", function() {
            var $pagination = $(this).parents(".pagination").first(),
                navOffset = 0;

            if (!$pagination.hasClass("clicked")) {
                $pagination.addClass("clicked");

                if ($(".nav-fixed").length > 0) navOffset = typeof $(".nav-fixed").attr("data-height") != "undefined" ? parseInt($(".nav-fixed").attr("data-height")) : $(".nav-fixed").outerHeight();

                var $pageContent = $pagination.children(".page-content"),
                    $pageLink = $pagination.children(".page-link"),
                    mode = $pagination.attr("data-mode") !== "undefined" && $.inArray($pagination.attr("data-mode"), ["fade", "slide", "block"]) >= 0 ? $pagination.attr("data-mode") : "block",
                    duration = typeof $pagination.attr("data-duration") !== "undefined" && $pagination.attr("data-duration").length > 0 ? parseInt($pagination.attr("data-duration"), 10) : (mode == "block" ? 0 : 300),
                    scrollable = typeof $pagination.attr("data-scroll") !== "undefined" && $.inArray($pagination.attr("data-scroll"), ["true", "on", "enable", "enabled", "1"]) >= 0 ? true : false,
                    $pageCurrent = $pageLink.find(".page-item.active"),
                    $pageClone = $pageLink.clone(),
                    idx = 0;

                $pageClone.find(".page-first, .page-last, .page-next, .page-prev, .page-ellipse").remove();

                idx = $pageClone.find(".page-item.active").index();

                $pageLink.find(".page-item.active").removeClass("active");

                if ($pageClone.find(".page-item.active").next(".page-item").length > 0) {
                    if (mode == "fade") {
                        if ($pageContent.children().length > 1) {
                            $pageContent.children().stop().fadeOut(duration, function() {
                                $(this).removeAttr("style").removeClass("active");
                            }).siblings().eq(idx + 1).stop().delay(duration).fadeIn(duration, function() {
                                $(this).removeAttr("style").addClass("active");

                                if (scrollable) {
                                    $("body, html").stop().animate({
                                        scrollTop: $pagination.offset().top - navOffset
                                    }, 300);
                                }

                                $pagination.removeClass("clicked");
                            });
                        } else {
                            $pageContent.children().eq(idx + 1).stop().fadeIn(duration, function() {
                                $(this).removeAttr("style").addClass("active");

                                if (scrollable) {
                                    $("body, html").stop().animate({
                                        scrollTop: $pagination.offset().top - navOffset
                                    }, 300);
                                }

                                $pagination.removeClass("clicked");
                            });
                        }
                    } else if (mode == "slide") {
                        if ($pageContent.children().length > 1) {
                            $pageContent.children().stop().slideUp(duration, function() {
                                $(this).removeAttr("style").removeClass("active");
                            }).siblings().eq(idx + 1).stop().delay(duration).slideDown(duration, function() {
                                $(this).removeAttr("style").addClass("active");

                                if (scrollable) {
                                    $("body, html").stop().animate({
                                        scrollTop: $pagination.offset().top - navOffset
                                    }, 300);
                                }

                                $pagination.removeClass("clicked");
                            });
                        } else {
                            $pageContent.children().eq(idx + 1).stop().slideDown(duration, function() {
                                $(this).removeAttr("style").addClass("active");

                                if (scrollable) {
                                    $("body, html").stop().animate({
                                        scrollTop: $pagination.offset().top - navOffset
                                    }, 300);
                                }

                                $pagination.removeClass("clicked");
                            });
                        }
                    } else {
                        if ($pageContent.children().length > 1) {
                            $pageContent.children().stop().hide(duration, function() {
                                $(this).removeAttr("style").removeClass("active");
                            }).siblings().eq(idx + 1).stop().delay(duration).show(duration, function() {
                                $(this).removeAttr("style").addClass("active");

                                if (scrollable) {
                                    $("body, html").stop().animate({
                                        scrollTop: $pagination.offset().top - navOffset
                                    }, 300);
                                }

                                $pagination.removeClass("clicked");
                            });
                        } else {
                            $pageContent.children().eq(idx + 1).stop().show(duration, function() {
                                $(this).removeAttr("style").addClass("active");

                                if (scrollable) {
                                    $("body, html").stop().animate({
                                        scrollTop: $pagination.offset().top - navOffset
                                    }, 300);
                                }

                                $pagination.removeClass("clicked");
                            });
                        }
                    }

                    $pageCurrent.next(".page-item").addClass("active");
                } else {
                    if (mode == "fade") {
                        if ($pageContent.children().length > 1) {
                            $pageContent.children().stop().fadeOut(duration, function() {
                                $(this).removeAttr("style").removeClass("active");
                            }).siblings().first().stop().delay(duration).fadeIn(duration, function() {
                                $(this).removeAttr("style").addClass("active");

                                if (scrollable) {
                                    $("body, html").stop().animate({
                                        scrollTop: $pagination.offset().top - navOffset
                                    }, 300);
                                }

                                $pagination.removeClass("clicked");
                            });
                        } else {
                            $pageContent.children().first().stop().fadeIn(duration, function() {
                                $(this).removeAttr("style").addClass("active");

                                if (scrollable) {
                                    $("body, html").stop().animate({
                                        scrollTop: $pagination.offset().top - navOffset
                                    }, 300);
                                }

                                $pagination.removeClass("clicked");
                            });
                        }
                    } else if (mode == "slide") {
                        if ($pageContent.children().length > 1) {
                            $pageContent.children().stop().slideUp(duration, function() {
                                $(this).removeAttr("style").removeClass("active");
                            }).siblings().first().stop().delay(duration).slideDown(duration, function() {
                                $(this).removeAttr("style").addClass("active");

                                if (scrollable) {
                                    $("body, html").stop().animate({
                                        scrollTop: $pagination.offset().top - navOffset
                                    }, 300);
                                }

                                $pagination.removeClass("clicked");
                            });
                        } else {
                            $pageContent.children().first().stop().slideDown(duration, function() {
                                $(this).removeAttr("style").addClass("active");

                                if (scrollable) {
                                    $("body, html").stop().animate({
                                        scrollTop: $pagination.offset().top - navOffset
                                    }, 300);
                                }

                                $pagination.removeClass("clicked");
                            });
                        }
                    } else {
                        if ($pageContent.children().length > 1) {
                            $pageContent.children().stop().hide(duration, function() {
                                $(this).removeAttr("style").removeClass("active");
                            }).siblings().first().stop().delay(duration).show(duration, function() {
                                $(this).removeAttr("style").addClass("active");

                                if (scrollable) {
                                    $("body, html").stop().animate({
                                        scrollTop: $pagination.offset().top - navOffset
                                    }, 300);
                                }

                                $pagination.removeClass("clicked");
                            });
                        } else {
                            $pageContent.children().first().stop().show(duration, function() {
                                $(this).removeAttr("style").addClass("active");

                                if (scrollable) {
                                    $("body, html").stop().animate({
                                        scrollTop: $pagination.offset().top - navOffset
                                    }, 300);
                                }

                                $pagination.removeClass("clicked");
                            });
                        }
                    }

                    $pageLink.each(function() {
                        $(this).find(".page-item").first().addClass("active");
                    });
                }
            }
        })
        .on("click", ".page-link .page-prev", function() {
            var $pagination = $(this).parents(".pagination").first(),
                navOffset = 0;

            if (!$pagination.hasClass("clicked")) {
                $pagination.addClass("clicked");

                if ($(".nav-fixed").length > 0) navOffset = typeof $(".nav-fixed").attr("data-height") != "undefined" ? parseInt($(".nav-fixed").attr("data-height")) : $(".nav-fixed").outerHeight();

                var $pageContent = $pagination.children(".page-content"),
                    $pageLink = $pagination.children(".page-link"),
                    mode = $pagination.attr("data-mode") !== "undefined" && $.inArray($pagination.attr("data-mode"), ["fade", "slide", "block"]) >= 0 ? $pagination.attr("data-mode") : "block",
                    duration = typeof $pagination.attr("data-duration") !== "undefined" && $pagination.attr("data-duration").length > 0 ? parseInt($pagination.attr("data-duration"), 10) : (mode == "block" ? 0 : 300),
                    scrollable = typeof $pagination.attr("data-scroll") !== "undefined" && $.inArray($pagination.attr("data-scroll"), ["true", "on", "enable", "enabled", "1"]) >= 0 ? true : false,
                    $pageCurrent = $pageLink.find(".page-item.active"),
                    $pageClone = $pageLink.clone(),
                    idx = 0;

                $pageClone.find(".page-first, .page-last, .page-next, .page-prev, .page-ellipse").remove();

                idx = $pageClone.find(".page-item.active").index();

                $pageLink.find(".page-item.active").removeClass("active");

                if ($pageClone.find(".page-item.active").prev(".page-item").length > 0) {
                    if (mode == "fade") {
                        if ($pageContent.children().length > 1) {
                            $pageContent.children().stop().fadeOut(duration, function() {
                                $(this).removeAttr("style").removeClass("active");
                            }).siblings().eq(idx - 1).stop().delay(duration).fadeIn(duration, function() {
                                $(this).removeAttr("style").addClass("active");

                                if (scrollable) {
                                    $("body, html").stop().animate({
                                        scrollTop: $pagination.offset().top - navOffset
                                    }, 300);
                                }

                                $pagination.removeClass("clicked");
                            });
                        } else {
                            $pageContent.children().eq(idx - 1).stop().fadeIn(duration, function() {
                                $(this).removeAttr("style").addClass("active");

                                if (scrollable) {
                                    $("body, html").stop().animate({
                                        scrollTop: $pagination.offset().top - navOffset
                                    }, 300);
                                }

                                $pagination.removeClass("clicked");
                            });
                        }
                    } else if (mode == "slide") {
                        if ($pageContent.children().length > 1) {
                            $pageContent.children().stop().slideUp(duration, function() {
                                $(this).removeAttr("style").removeClass("active");
                            }).siblings().eq(idx - 1).stop().delay(duration).slideDown(duration, function() {
                                $(this).removeAttr("style").addClass("active");

                                if (scrollable) {
                                    $("body, html").stop().animate({
                                        scrollTop: $pagination.offset().top - navOffset
                                    }, 300);
                                }

                                $pagination.removeClass("clicked");
                            });
                        } else {
                            $pageContent.children().eq(idx - 1).stop().slideDown(duration, function() {
                                $(this).removeAttr("style").addClass("active");

                                if (scrollable) {
                                    $("body, html").stop().animate({
                                        scrollTop: $pagination.offset().top - navOffset
                                    }, 300);
                                }

                                $pagination.removeClass("clicked");
                            });
                        }
                    } else {
                        if ($pageContent.children().length > 1) {
                            $pageContent.children().stop().hide(duration, function() {
                                $(this).removeAttr("style").removeClass("active");
                            }).siblings().eq(idx - 1).stop().delay(duration).show(duration, function() {
                                $(this).removeAttr("style").addClass("active");

                                if (scrollable) {
                                    $("body, html").stop().animate({
                                        scrollTop: $pagination.offset().top - navOffset
                                    }, 300);
                                }

                                $pagination.removeClass("clicked");
                            });
                        } else {
                            $pageContent.children().eq(idx - 1).stop().show(duration, function() {
                                $(this).removeAttr("style").addClass("active");

                                if (scrollable) {
                                    $("body, html").stop().animate({
                                        scrollTop: $pagination.offset().top - navOffset
                                    }, 300);
                                }

                                $pagination.removeClass("clicked");
                            });
                        }
                    }

                    $pageCurrent.prev(".page-item").addClass("active");
                } else {
                    if (mode == "fade") {
                        if ($pageContent.children().length > 1) {
                            $pageContent.children().stop().fadeOut(duration, function() {
                                $(this).removeAttr("style").removeClass("active");
                            }).siblings().last().stop().delay(duration).fadeIn(duration, function() {
                                $(this).removeAttr("style").addClass("active");

                                if (scrollable) {
                                    $("body, html").stop().animate({
                                        scrollTop: $pagination.offset().top - navOffset
                                    }, 300);
                                }

                                $pagination.removeClass("clicked");
                            });
                        } else {
                            $pageContent.children().last().stop().fadeIn(duration, function() {
                                $(this).removeAttr("style").addClass("active");

                                if (scrollable) {
                                    $("body, html").stop().animate({
                                        scrollTop: $pagination.offset().top - navOffset
                                    }, 300);
                                }

                                $pagination.removeClass("clicked");
                            });
                        }
                    } else if (mode == "slide") {
                        if ($pageContent.children().length > 1) {
                            $pageContent.children().stop().slideUp(duration, function() {
                                $(this).removeAttr("style").removeClass("active");
                            }).siblings().last().stop().delay(duration).slideDown(duration, function() {
                                $(this).removeAttr("style").addClass("active");

                                if (scrollable) {
                                    $("body, html").stop().animate({
                                        scrollTop: $pagination.offset().top - navOffset
                                    }, 300);
                                }

                                $pagination.removeClass("clicked");
                            });
                        } else {
                            $pageContent.children().last().stop().slideDown(duration, function() {
                                $(this).removeAttr("style").addClass("active");

                                if (scrollable) {
                                    $("body, html").stop().animate({
                                        scrollTop: $pagination.offset().top - navOffset
                                    }, 300);
                                }

                                $pagination.removeClass("clicked");
                            });
                        }
                    } else {
                        if ($pageContent.children().length > 1) {
                            $pageContent.children().stop().hide(duration, function() {
                                $(this).removeAttr("style").removeClass("active");
                            }).siblings().last().stop().delay(duration).show(duration, function() {
                                $(this).removeAttr("style").addClass("active");

                                if (scrollable) {
                                    $("body, html").stop().animate({
                                        scrollTop: $pagination.offset().top - navOffset
                                    }, 300);
                                }

                                $pagination.removeClass("clicked");
                            });
                        } else {
                            $pageContent.children().last().stop().show(duration, function() {
                                $(this).removeAttr("style").addClass("active");

                                if (scrollable) {
                                    $("body, html").stop().animate({
                                        scrollTop: $pagination.offset().top - navOffset
                                    }, 300);
                                }

                                $pagination.removeClass("clicked");
                            });
                        }
                    }

                    $pageLink.each(function() {
                        $(this).find(".page-item").last().addClass("active");
                    });
                }
            }
        })
        .on("click", ".page-link .page-item", function() {
            var $pagination = $(this).parents(".pagination").first(),
                navOffset = 0;

            if (!$pagination.hasClass("clicked")) {
                $pagination.addClass("clicked");

                if ($(".nav-fixed").length > 0) navOffset = typeof $(".nav-fixed").attr("data-height") != "undefined" ? parseInt($(".nav-fixed").attr("data-height")) : $(".nav-fixed").outerHeight();

                $(this).addClass("current");

                var $pageContent = $pagination.children(".page-content"),
                    mode = $pagination.attr("data-mode") !== "undefined" && $.inArray($pagination.attr("data-mode"), ["fade", "slide", "block"]) >= 0 ? $pagination.attr("data-mode") : "block",
                    duration = typeof $pagination.attr("data-duration") !== "undefined" && $pagination.attr("data-duration").length > 0 ? parseInt($pagination.attr("data-duration"), 10) : (mode == "block" ? 0 : 300),
                    scrollable = typeof $pagination.attr("data-scroll") !== "undefined" && $.inArray($pagination.attr("data-scroll"), ["true", "on", "enable", "enabled", "1"]) >= 0 ? true : false,
                    $pageClone = $pagination.children(".page-link").find(".page-item.current").parents(".page-link").first().clone(),
                    idx = 0;

                $pageClone.find(".page-first, .page-last, .page-next, .page-prev, .page-ellipse").remove();

                idx = $pageClone.find(".page-item.current").index();

                if (mode == "fade") {
                    if ($pageContent.children().length > 1) {
                        $pageContent.children().stop().fadeOut(duration, function() {
                            $(this).removeAttr("style").removeClass("active");
                        }).siblings().eq(idx).stop().delay(duration).fadeIn(duration, function() {
                            $(this).removeAttr("style").addClass("active");

                            if (scrollable) {
                                $("body, html").stop().animate({
                                    scrollTop: $pagination.offset().top - navOffset
                                }, 300);
                            }

                            $pagination.removeClass("clicked");
                        });
                    } else {
                        $pageContent.children().eq(idx).stop().fadeIn(duration, function() {
                            $(this).removeAttr("style").addClass("active");

                            if (scrollable) {
                                $("body, html").stop().animate({
                                    scrollTop: $pagination.offset().top - navOffset
                                }, 300);
                            }

                            $pagination.removeClass("clicked");
                        });
                    }
                } else if (mode == "slide") {
                    if ($pageContent.children().length > 1) {
                        $pageContent.children().stop().slideUp(duration, function() {
                            $(this).removeAttr("style").removeClass("active");
                        }).siblings().eq(idx).stop().delay(duration).slideDown(duration, function() {
                            $(this).removeAttr("style").addClass("active");

                            if (scrollable) {
                                $("body, html").stop().animate({
                                    scrollTop: $pagination.offset().top - navOffset
                                }, 300);
                            }

                            $pagination.removeClass("clicked");
                        });
                    } else {
                        $pageContent.children().eq(idx).stop().slideDown(duration, function() {
                            $(this).removeAttr("style").addClass("active");

                            if (scrollable) {
                                $("body, html").stop().animate({
                                    scrollTop: $pagination.offset().top - navOffset
                                }, 300);
                            }

                            $pagination.removeClass("clicked");
                        });
                    }
                } else {
                    if ($pageContent.children().length > 1) {
                        $pageContent.children().stop().hide(duration, function() {
                            $(this).removeAttr("style").removeClass("active");
                        }).siblings().eq(idx).stop().delay(duration).show(duration, function() {
                            $(this).removeAttr("style").addClass("active");

                            if (scrollable) {
                                $("body, html").stop().animate({
                                    scrollTop: $pagination.offset().top - navOffset
                                }, 300);
                            }

                            $pagination.removeClass("clicked");
                        });
                    } else {
                        $pageContent.children().eq(idx).stop().show(duration, function() {
                            $(this).removeAttr("style").addClass("active");

                            if (scrollable) {
                                $("body, html").stop().animate({
                                    scrollTop: $pagination.offset().top - navOffset
                                }, 300);
                            }

                            $pagination.removeClass("clicked");
                        });
                    }
                }

                $pagination.children(".page-link").find(".page-item.current").removeClass("current");
                $pagination.children(".page-link").find(".page-item.active").removeClass("active");
                $pagination.children(".page-link").each(function() {
                    $(this).find(".page-item").eq(idx).addClass("active");
                });
            }
        })
        .on("click", ".page-link li.disabled", function() {});
    // END: .pagination
});

// user agents
var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

var fbTimer = null,
    fbCodes = {},
    fbPage = document.querySelectorAll(".fb-page");

if (fbPage.length > 0) {
    for (var i in fbPage) {
        if (fbPage[i].constructor === HTMLDivElement) fbCodes[i] = fbPage[i].outerHTML;
    }
}

$(window).resize(function() {
    // fix bg parallax on mobile
    if (isMobile.any()) $(".bg-parallax").css("background-attachment", "inherit");
    else $(".bg-parallax").css("background-attachment", "");

    $(".pagination").removeClass("clicked");

    if ($("#fb-root").attr("data-resize")) {
        if (fbTimer != null) clearTimeout(fbTimer);

        // delay for document is loaded
        fbTimer = setTimeout(function() {
            if (typeof FB !== "undefined") {
                $(".fb-page").each(function(i) {
                    if (fbCodes[i]) $(this).replaceWith(fbCodes[i]);
                });

                FB.XFBML.parse(document, function() {
                    if ($("#fb-root").attr("data-resize") == "once") $("#fb-root").removeAttr("data-resize");
                });
            }
        }, 1000);
    }
}).on("scroll resize", function() {
    /*if ($(this).scrollTop() > 0) $("#pagetop").addClass("visible");
    else $("#pagetop").removeClass("visible");*/

    if ($(".nav-fixed").length) {
        var $navPinY = $(".nav-target").length ? $(".nav-target").offset().top - $(".nav-fixed").outerHeight() - 1 : $(".nav-fixed").offset().top;
        if ($(this).scrollTop() > $navPinY || ($navPinY < 0 && $(this).scrollTop() > 0)) {
            if ($(".nav-pin").length) $(".nav-pin").addClass("fixed");
            else $(".nav-fixed").addClass("fixed");
        } else {
            if ($(".nav-pin").length) $(".nav-pin").removeClass("fixed");
            else $(".nav-fixed").removeClass("fixed");
        }
    }
}).on("load", function() {
    // scrollBefore();
});

var scrollBefore = function() {
    var hash = window.location.hash || location.hash,
        ptnHash = /([;?%&,+*~\':"!^$[\]()=>|\/@])/g;

    if (hash) {
        hash = hash.replace(ptnHash, "\\$1");
        if ($(hash).length > 0) {
            if ($(".tabs-switch").length > 0) {
                if ($(hash).length > 0 && $(hash).parents(".tab-content").first().length > 0) {
                    var tabChild = $(hash);
                    $(hash).parents().each(function() {
                        if ($(this).attr("class") !== undefined && $.inArray("tab-content", $(this).attr("class").split(" ")) >= 0) return false;
                        else tabChild = $(this);
                    });

                    setTimeout(function() {
                        tabChild.parents(".tabs-switch").first().children(".tab-link").children().eq(tabChild.index()).click(); // trigger tab in multiple dim
                    }, 10);
                } else {
                    $(".tabs-switch").each(function() {
                        var $tabLink = $(this).children(".tab-link");

                        if ($tabLink.children(hash).length > 0) {
                            setTimeout(function() {
                                $tabLink.children(hash).click(); // trigger for set active tab
                            }, 10);
                        }
                    });
                }
            }

            if ($(".bx-wrapper").length > 0) $(window).trigger("resize");

            setTimeout(function() {
                if ($(".nav-fixed").length > 0) {
                    var offsetY = $(hash).offset().top,
                        navHeight = typeof $(".nav-fixed").attr("data-height") != "undefined" ? parseInt($(".nav-fixed").attr("data-height"), 10) : $(".nav-fixed").outerHeight();

                    // if ($(".nav-pin").length > 0) offsetY -= $(".nav-pin").outerHeight();

                    window.scroll(0, offsetY - navHeight);

                    // re-updated offset
                    if ($(".nav-target").length > 0) {
                        var reupdated = true;
                        $(window).scroll(function() {
                            if (reupdated && $(this).scrollTop() >= $(".nav-target").offset().top) {
                                reupdated = false;

                                navHeight = typeof $(".nav-fixed").attr("data-height") != "undefined" ? parseInt($(".nav-fixed").attr("data-height"), 10) : $(".nav-fixed").outerHeight();

                                window.scroll(0, $(hash).offset().top - navHeight);
                            }
                        });
                    }
                } else window.scrollTo(0, $(hash).offset().top);
            }, 10);

            $("a[href='" + hash + "']").click();
        } // else window.scrollTo(0, _offsetY);
    }
};

scrollBefore(); // DOM loaded



/*
 * Plugins/Functions
 *
 */

// check object is variable or DOM elements
function isObjectVar(obj) {
    return ((typeof obj != "undefined") && (typeof obj === "object") && (obj.nodeType !== 1) && (typeof obj.ownerDocument !== "object"));
}

(function($) {
    // BEGIN: $.fcvScroll
    $.fn.fcvScroll = function(options) {
        var options = $.extend({
            selector: ".section", // selector
            delay: 50, // time delay (ms)
            duration: 400, // time duration (ms)
            reference: .9,
        }, options);

        if (options.selector) {
            var $wrapper = $(this),
                $offsetSelectors = [],
                $scrollDown = true,
                $scrollPos = $(window).scrollTop(),
                $scrollTimer = null;

            $wrapper.find(options.selector).each(function(i) {
                $offsetSelectors.push($(this).offset().top); // offsetY fined
            });

            $(window).scroll(function() {
                $scrollDown = $(window).scrollTop() >= $scrollPos;
                $scrollPos = $(window).scrollTop();

                clearTimeout($scrollTimer);

                if ($.inArray($(window).scrollTop(), $offsetSelectors) < 0) { // not in area fined
                    $scrollTimer = setTimeout(function() { // fcv-snap
                        var $scrollTop = $(window).scrollTop(),
                            $posY = $(window).height() * options.reference,
                            $position = 0,
                            $target;

                        if ($scrollDown) { // direction down
                            $position = $scrollTop + $posY - 1;
                            $wrapper.find(options.selector).each(function() {
                                var $offsetY = $(this).offset().top;
                                if (($offsetY > $scrollTop) && ($offsetY <= $position)) {
                                    $target = $(this);
                                    return false;
                                }
                            });
                        } else { // direction up
                            $position = $scrollTop - $posY + 1;
                            $wrapper.find(options.selector).each(function() {
                                var $offsetY = $(this).offset().top;
                                if (($offsetY < $scrollTop) && ($offsetY >= $position)) {
                                    $target = $(this);
                                    return false;
                                }
                            });
                        }

                        if ($target) {
                            $("html, body").stop().animate({
                                scrollTop: $target.offset().top
                            }, options.duration, function() {
                                clearTimeout($scrollTimer);
                            });
                        }
                    }, options.delay);
                }
            }).resize(function() {
                if ($(options.selector).hasClass("minHeight")) {
                    $(options.selector).css({
                        minHeight: $(window).height()
                    });
                } else {
                    $(options.selector).css({
                        height: $(window).height()
                    });
                }
            }).trigger("resize");
        } else console.error("Missing selector");

        return this;
    };
    // END: $.fcvScroll
})(jQuery);

var gmarkers = [],
    gnum = 0;



// BEGIN: heightLine
function heightLine() {
    this.className = "heightLine";
    this.parentClassName = "heightLineParent"
    reg = new RegExp(this.className + "-([a-zA-Z0-9-_]+)", "i");
    objCN = new Array();
    var objAll = document.getElementsByTagName ? document.getElementsByTagName("*") : document.all;
    for (var i = 0; i < objAll.length; i++) {
        if (typeof objAll[i].className == "string") {
            var eltClass = objAll[i].className.split(/\s+/);
            for (var j = 0; j < eltClass.length; j++) {
                if (eltClass[j] == this.className) {
                    if (!objCN["main CN"]) objCN["main CN"] = new Array();
                    objCN["main CN"].push(objAll[i]);
                    break;
                } else if (eltClass[j] == this.parentClassName) {
                    if (!objCN["parent CN"]) objCN["parent CN"] = new Array();
                    objCN["parent CN"].push(objAll[i]);
                    break;
                } else if (eltClass[j].match(reg)) {
                    var OCN = eltClass[j].match(reg)
                    if (!objCN[OCN]) objCN[OCN] = new Array();
                    objCN[OCN].push(objAll[i]);
                    break;
                }
            }
        }
    }

    //check font size
    var e = document.createElement("div");
    var s = document.createTextNode("S");
    e.appendChild(s);
    e.style.classname = "check-fontsize";
    e.style.visibility = "hidden";
    e.style.position = "absolute";
    e.style.top = "0";
    document.body.appendChild(e);
    var defHeight = e.offsetHeight;

    changeBoxSize = function() {
        for (var key in objCN) {
            if (objCN.hasOwnProperty(key)) {
                //parent type
                if (key == "parent CN") {
                    for (var i = 0; i < objCN[key].length; i++) {
                        var max_height = 0;
                        var CCN = objCN[key][i].childNodes;
                        for (var j = 0; j < CCN.length; j++) {
                            if (CCN[j] && CCN[j].nodeType == 1) {
                                CCN[j].style.height = "auto";
                                max_height = max_height > CCN[j].offsetHeight ? max_height : CCN[j].offsetHeight;
                            }
                        }
                        for (var j = 0; j < CCN.length; j++) {
                            if (CCN[j].style) {
                                var stylea = CCN[j].currentStyle || document.defaultView.getComputedStyle(CCN[j], '');
                                var newheight = max_height;
                                if (stylea.paddingTop) newheight -= stylea.paddingTop.replace("px", "");
                                if (stylea.paddingBottom) newheight -= stylea.paddingBottom.replace("px", "");
                                if (stylea.borderTopWidth && stylea.borderTopWidth != "medium") newheight -= stylea.borderTopWidth.replace("px", "");
                                if (stylea.borderBottomWidth && stylea.borderBottomWidth != "medium") newheight -= stylea.borderBottomWidth.replace("px", "");
                                CCN[j].style.height = newheight + "px";
                            }
                        }
                    }
                } else {
                    var max_height = 0;
                    for (var i = 0; i < objCN[key].length; i++) {
                        objCN[key][i].style.height = "auto";
                        max_height = max_height > objCN[key][i].offsetHeight ? max_height : objCN[key][i].offsetHeight;
                    }
                    for (var i = 0; i < objCN[key].length; i++) {
                        if (objCN[key][i].style) {
                            var stylea = objCN[key][i].currentStyle || document.defaultView.getComputedStyle(objCN[key][i], '');
                            var newheight = max_height;
                            if (stylea.paddingTop) newheight -= stylea.paddingTop.replace("px", "");
                            if (stylea.paddingBottom) newheight -= stylea.paddingBottom.replace("px", "");
                            if (stylea.borderTopWidth && stylea.borderTopWidth != "medium") newheight -= stylea.borderTopWidth.replace("px", "")
                            if (stylea.borderBottomWidth && stylea.borderBottomWidth != "medium") newheight -= stylea.borderBottomWidth.replace("px", "");
                            objCN[key][i].style.height = newheight + "px";
                        }
                    }
                }
            }
        }
    }

    checkBoxSize = function() {
        if (defHeight != e.offsetHeight) {
            changeBoxSize();
            defHeight = e.offsetHeight;
        }

        // var elm = document.querySelector(".check-fontsize");
        // if (elm) elm.parentNode.removeChild(elm);
    }
    changeBoxSize();
    setInterval(checkBoxSize, 1000)
    window.onresize = changeBoxSize;
}

function addEvent(elm, listener, fn) {
    try {
        elm.addEventListener(listener, fn, false);
    } catch (e) {
        elm.attachEvent("on" + listener, fn);
    }
}
addEvent(window, "load", heightLine);
// END: heightLine

(function() { // DOM loaded
    // facebook
    var fbRoot = document.getElementById("fb-root");
    if (fbRoot) {
        var fbScript = document.createElement("script"),
            fbScriptContent = "",
            fbVersion = fbRoot.getAttribute("data-version") ? fbRoot.getAttribute("data-version") : "v2.12",
            fbLanguage = fbRoot.getAttribute("data-language") ? fbRoot.getAttribute("data-language") : "ja_JP";

        fbVersion = fbVersion.substr(0, 1).toLowerCase() == "v" ? fbVersion.substr(1) : fbVersion;

        fbScriptContent += '(function(d, s, id) {';
        fbScriptContent += 'var js, fjs = d.getElementsByTagName(s)[0];';
        fbScriptContent += 'if (d.getElementById(id)) return;';
        fbScriptContent += 'js = d.createElement(s);';
        fbScriptContent += 'js.id = id;';
        fbScriptContent += 'js.src = "https://connect.facebook.net/' + fbLanguage + '/sdk.js#xfbml=1&version=v' + fbVersion + '";';
        fbScriptContent += 'fjs.parentNode.insertBefore(js, fjs);';
        fbScriptContent += '}(document, "script", "facebook-jssdk"));';

        fbScript.innerHTML = fbScriptContent;
        document.body.appendChild(fbScript);
    }

    // WOW js
    if (typeof window["WOW"] === "function") {
        var wowData = {
                boxClass: typeof $("body").attr("data-wow-box") != "undefined" ? $("body").attr("data-wow-box") : "wow",
                animateClass: typeof $("body").attr("data-wow-animate") != "undefined" ? $("body").attr("data-wow-animate") : "animated",
                offset: typeof $("body").attr("data-wow-offset") != "undefined" ? parseInt($("body").attr("data-wow-offset")) : 0,
                mobile: $.inArray($("body").attr("data-wow-mobile"), ["false", "off", "disable", "disabled", "0"]) >= 0 ? false : true,
                live: $.inArray($("body").attr("data-wow-live"), ["false", "off", "disable", "disabled", "0"]) >= 0 ? false : true,
                resetAnimation: $.inArray($("body").attr("data-wow-reset"), ["false", "off", "disable", "disabled", "0"]) >= 0 ? false : true,
                callback: function(box) {},
                scrollContainer: null
            },
            _wow_ = new WOW(wowData);

        _wow_.init();
    }
})();

// conflicts
if (!Object.keys) {
    Object.keys = (function() {
        "use strict";
        var hasOwnProperty = Object.prototype.hasOwnProperty,
            hasDontEnumBug = !({
                toString: null
            }).propertyIsEnumerable("toString"),
            dontEnums = [
                "toString",
                "toLocaleString",
                "valueOf",
                "hasOwnProperty",
                "isPrototypeOf",
                "propertyIsEnumerable",
                "constructor"
            ],
            dontEnumsLength = dontEnums.length;

        return function(obj) {
            if (typeof obj !== "object" && (typeof obj !== "function" || obj === null)) {
                throw new TypeError("Object.keys called on non-object");
            }

            var result = [],
                prop, i;

            for (prop in obj) {
                if (hasOwnProperty.call(obj, prop)) {
                    result.push(prop);
                }
            }

            if (hasDontEnumBug) {
                for (i = 0; i < dontEnumsLength; i++) {
                    if (hasOwnProperty.call(obj, dontEnums[i])) {
                        result.push(dontEnums[i]);
                    }
                }
            }
            return result;
        };
    }());
}

function isHTML(str) {
    var a = document.createElement("div");
    a.innerHTML = str;
    for (var child = a.childNodes, i = child.length; i--;) {
        if (child[i].nodeType == 1) return true;
    }
    return false;
}

// BEGIN: slide fading
var $slideFadeTimer = {};

function slideFadeStart(elm) {
    var $this = elm,
        __idx__ = $(".slide-fade").index($this),
        $duration = typeof $this.attr("data-duration") != "undefined" ? parseInt($this.attr("data-duration")) : 1000,
        $timer = typeof $this.attr("data-timer") != "undefined" ? parseInt($this.attr("data-timer")) : 4000,
        $delay = typeof $this.attr("data-delay") != "undefined" ? parseInt($this.attr("data-delay")) : false;

    if ($timer < $duration) $timer = $duration * 2;

    $this.removeClass("stop");
    if (!$this.children(".active").length) {
        $this.children().hide();
        $this.children().eq(0).show().addClass("active");

        if ($this.siblings(".slide-page").length) $this.siblings(".slide-page").children().eq(0).addClass("active");
    } else {
        if ($this.siblings(".slide-page").length) $this.siblings(".slide-page").children().eq($this.children(".active").index()).addClass("active");
    }

    // $slideFadeTimer[__idx__] = setInterval(function() {
    // slideFade($this, $duration);
    // }, $timer);

    $this.parents(".slideParent").addClass("move-start").attr("data", $this.children(".active").index());

    if ($slideFadeTimer[__idx__]) clearTimeout($slideFadeTimer[__idx__]);
    $slideFadeTimer[__idx__] = setTimeout(function() {
        slideFade($this, $duration);
    }, $delay ? $delay : $timer);
}

function slideFade(elm, duration) {
    var elmActive = elm.children(".active"),
        slideContinue = elm.hasClass("stop") || (elm.hasClass("once") && elmActive.next().length < 1) ? false : true;

    if (slideContinue) {
        var __idx__ = $(".slide-fade").index(elm),
            timer = typeof elm.attr("data-timer") != "undefined" ? parseInt(elm.attr("data-timer")) : 4000;

        if (elmActive.next().length) {
            if (typeof elmActive.next().attr("data-duration") != "undefined") duration = parseInt(elmActive.next().attr("data-duration"));
        } else {
            if (typeof elm.children().eq(0).attr("data-duration") != "undefined") duration = parseInt(elm.children().eq(0).attr("data-duration"));
        }

        if ($slideFadeTimer[__idx__]) clearTimeout($slideFadeTimer[__idx__]);

        elmActive.stop().fadeOut(duration, function() {
            $(this).removeClass("active").removeAttr("style").hide();
        });

        elm.parents(".slideParent").removeClass("move-start move-next move-prev move-first move-last");

        if (elmActive.next().length > 0) {
            if (typeof elmActive.next().attr("data-timer") != "undefined") timer = parseInt(elmActive.next().attr("data-timer"));
            if (timer < duration) timer = duration * 2;

            if (elm.siblings(".slide-page").length > 0) {
                elm.siblings(".slide-page").children(".active").removeClass("active");
                elm.siblings(".slide-page").children().eq(elmActive.next().index()).addClass("active");
            }

            elm.parents(".slideParent").addClass("move-next").attr("data", elmActive.next().index());
            if (elmActive.next().is(":last-child")) elm.parents(".slideParent").addClass("move-last");

            elmActive.next().stop().fadeIn(duration, function() {
                $(this).addClass("active").removeAttr("style").show();

                if (elm.siblings(".slide-btn").hasClass("clicked")) elm.siblings(".slide-btn.clicked").removeClass("clicked");
                if (elm.siblings(".slide-page").hasClass("clicked")) elm.siblings(".slide-page.clicked").removeClass("clicked");

                if ($(this).next().length < 1 && elm.hasClass("once")) elm.addClass("slide-finished");

                $slideFadeTimer[__idx__] = setTimeout(function() {
                    slideFade(elm, duration);
                }, timer);
            });
        } else {
            if (typeof elm.children().eq(0).attr("data-timer") != "undefined") timer = parseInt(elm.children().eq(0).attr("data-timer"));
            if (timer < duration) timer = duration * 2;

            if (elm.siblings(".slide-page").length > 0) {
                elm.siblings(".slide-page").children(".active").removeClass("active");
                elm.siblings(".slide-page").children().eq(0).addClass("active");
            }

            elm.parents(".slideParent").addClass("move-first").attr("data", 0);

            elm.children().eq(0).stop().fadeIn(duration, function() {
                $(this).addClass("active").removeAttr("style").show();

                if (elm.siblings(".slide-btn").hasClass("clicked")) elm.siblings(".slide-btn.clicked").removeClass("clicked");
                if (elm.siblings(".slide-page").hasClass("clicked")) elm.siblings(".slide-page.clicked").removeClass("clicked");

                if ($(this).next().length < 1 && elm.hasClass("once")) elm.addClass("slide-finished");

                $slideFadeTimer[__idx__] = setTimeout(function() {
                    slideFade(elm, duration);
                }, timer);
            });
        }
    } else elm.addClass("slide-finished");
}
// END: slide fading

// BEGIN: .pagination
function reloadPager(elm) {
    if (elm) {
        if (elm instanceof jQuery && elm.length > 0) {
            elm.each(function() {
                initPager($(this));
            });
        }
    } else {
        $(".pagination").each(function() {
            initPager($(this));
        });
    }
}

function initPager(elm) {
    // if (elm.children(".page-content").children().length > 0) {
    var $pagination = elm,
        $pageContent = $pagination.children(".page-content"),
        total = $pageContent.children().length;

    var dataPage = {
        first: typeof $pagination.attr("data-first") !== "undefined" && $pagination.attr("data-first").length > 0 ? $pagination.attr("data-first") : false,
        last: typeof $pagination.attr("data-last") !== "undefined" && $pagination.attr("data-last").length > 0 ? $pagination.attr("data-last") : false,
        next: typeof $pagination.attr("data-next") !== "undefined" && $pagination.attr("data-next").length > 0 ? $pagination.attr("data-next") : false,
        prev: typeof $pagination.attr("data-prev") !== "undefined" && $pagination.attr("data-prev").length > 0 ? $pagination.attr("data-prev") : false,
        active: typeof $pagination.attr("data-active") !== "undefined" && $pagination.attr("data-active").length > 0 ? parseInt($pagination.attr("data-active"), 10) : 1,
        max: typeof $pagination.attr("data-max") !== "undefined" && $pagination.attr("data-max").length > 0 ? parseInt($pagination.attr("data-max"), 10) : false,
        page: typeof $pagination.attr("data-page") !== "undefined" && $.inArray($pagination.attr("data-page"), ["top", "bottom", "both"]) >= 0 ? $pagination.attr("data-page") : false
    };

    if (dataPage.active > total) dataPage.active = 1;

    if (dataPage.max) { // && $pageContent.children().length > 0
        if ($pageContent.children(".page-wrap").length > 0) {
            if ($pageContent.children(".page-wrap").children().length > 0) $pageContent.children(".page-wrap").children().unwrap();
            else $pageContent.children(".page-wrap").remove();
        }

        $pageContent.children().not(".page-wrap").each(function(i) {
            if (i % dataPage.max === 0) $pageContent.append('<div class="page-wrap" />');

            $(this).appendTo($pageContent.children(".page-wrap").last());
        });

        total = $pageContent.children().length;
    }

    if ($pagination.children(".page-link").length > 0) $pagination.children(".page-link").remove();

    if (dataPage.page && total > 0) {
        if (dataPage.page == "top") $pagination.prepend('<div class="page-link" />');
        else if (dataPage.page == "bottom") $pagination.append('<div class="page-link" />');
        else {
            $pagination.prepend('<div class="page-link" />');
            $pagination.append('<div class="page-link" />');
        }

        $pagination.children(".page-link").each(function(p) {
            var $pageLink = $(this);

            var htmlItem = [];
            htmlItem.push('<ul>');
            if (dataPage.first) htmlItem.push('<li class="page-first">' + dataPage.first + '</li>');
            if (dataPage.prev) htmlItem.push('<li class="page-prev">' + dataPage.prev + '</li>');
            for (var i = 1; i <= total; i++) {
                // if (i == dataPage.active) htmlItem.push('<li class="page-item active">' + i + '</li>');
                // else htmlItem.push('<li class="page-item">' + i + '</li>');
                htmlItem.push('<li class="page-item">' + i + '</li>');
            }
            if (dataPage.next) htmlItem.push('<li class="page-next">' + dataPage.next + '</li>');
            if (dataPage.last) htmlItem.push('<li class="page-last">' + dataPage.last + '</li>');
            htmlItem.push('</ul>');

            htmlItem = htmlItem.join("\n");
            $pageLink.html(htmlItem);

            var scrollable = $pagination.attr("data-scroll"),
                duration = $pagination.attr("data-duration"),
                modeable = $pagination.attr("data-mode");

            $pagination.attr("data-scroll", false); // off scroll on first loaded
            $pagination.attr("data-duration", 0); // off duration on first loaded
            $pagination.attr("data-mode", false); // off mode on first loaded

            if (p >= $pagination.children(".page-link").length - 1) { // last
                setTimeout(function() {
                    $pageLink.find(".page-item").eq(dataPage.active - 1).click();
                }, 1);
            } // else $pageLink.find(".page-item").eq(dataPage.active - 1).addClass("active");
        });

        // re-setting for data-scroll
        if (typeof scrollable === "undefined") $pagination.removeAttr("data-scroll");
        else $pagination.attr("data-scroll", scrollable);

        // re-setting for data-duration
        if (typeof duration === "undefined") $pagination.removeAttr("data-duration");
        else $pagination.attr("data-duration", duration);

        // re-setting for data-mode
        if (typeof modeable === "undefined") $pagination.removeAttr("data-mode");
        else $pagination.attr("data-mode", modeable);
    } else {
        $pageContent.children(".page-wrap").first().addClass("active"); // show
    }
    // }
}
// END: .pagination

var checkDomain = function(url) {
    if (url.indexOf('//') === 0) url = location.protocol + url;
    return url.toLowerCase().replace(/([a-z])?:\/\//, "$1").split("/")[0];
};
var isExternal = function(url) {
    return ((url.indexOf(":") > -1 || url.indexOf("//") > -1) && checkDomain(location.href) !== checkDomain(url));
};