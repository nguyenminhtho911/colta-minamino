function fc_define(name, value) {
    Object.defineProperty(window, name, {
        get: function() {
            return value;
        },
        set: function() {
            throw (name + " is a constant and can't be redeclared.");
        }
    });
}
function fc_defined(name) {
    if (window[name]) return true;
    else return false;
}

fc_define("FCBase", {});

FCBase.isFunction = function(fn, checkEmpty) {
	// if (fn && fn.constructor == Function) return checkEmpty ? (fn.toString().trim().replace(/\s+/g, "").replace(/^function\s*[^(]*\(\)[ ]*{(.*)}$/gi, "").trim() !== "") : true;
	if (fn && fn.constructor == Function) return checkEmpty ? (fn.toString().replace(/(\/\*[\w\'\-\;\s\r\n\*]*\*\/)|(^\s*\/\/[^\n]*$\s*)|(^\s*<!--[^\-\-\>]*\s*-->\s*$\s*)/gim, "").replace(/\r*\n+/g, "").replace(/^function\s*[^(]*\([^\)]*\)\s*\{/gi, "").trim().replace(/\}$/, "").trim() !== "") : true;

	return false;
};

FCBase.device = {
	userAgent: function(lower) {
		return lower ? navigator.userAgent.toLowerCase() : navigator.userAgent;
	},
	iPhone: function() {
		return ((navigator.platform.indexOf("iPhone") != -1) || (navigator.platform.indexOf("iPod") != -1));
	},
	iPad: function () {
		return (navigator.platform.indexOf("iPad") != -1);
	},
	iOS: function() {
		return (this.iPhone() || this.iPad());
	},
	androidMobile: function() {
		return ((this.userAgent(true).indexOf("android") > -1) && this.userAgent(true).indexOf("mobile"));
	},
	androidTablet: function() {
		return ((this.userAgent(true).indexOf("android") > -1) && !(this.userAgent(true).indexOf("mobile")));
	},
	android: function() {
		return (this.androidMobile() || this.androidTablet());
	},
	blackBerry: function() {
		return (this.userAgent(true).indexOf("blackberry") > -1);
	},
	opera: function() {
		return (this.userAgent(true).indexOf("opera mini") > -1);
	},
	windows: function() {
		return (this.userAgent(true).indexOf("iemobile") > -1);
	},
	touch: function() {
		try {
			document.createEvent("TouchEvent");
			return true;
		}
		catch(e){
			return false;
		}
	},
	tablet: function() {
		return (this.iPad() || this.androidTablet());
	},
	mobile: function() {
		return (this.iOS() || this.android() || this.blackberry() || this.opera() || this.windows() || this.touch());
	},
	desktop: function() {
		return (!this.mobile());
	},
	portrait: function() {
		return (window.innerHeight > window.innerWidth);
	},
	landscape: function() {
		return ((window.orientation === 90) || (window.orientation === -90));
	}
};