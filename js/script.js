var _ = (function(window){
	return {
		/**
		 * get element by id
		 */
		gid: function(x) {
			// if _.gid(...) below returned null or nothing was passed, return null
			if (!x) { 
				return null;
			}
			
			if (_.isS(x)) {
				return _.gid(document.getElementById(x));
			}
			
			// check if is already an object run through x
			// if ("function" != typeof(x._)) {
			//
			// 	// allows enriching elements
			// 	x._ = function(){};
			// }
			
			return x;
		},
		/**
		 * Add event listener to window
		 */
		ael: function(args){
			if(window.addEventListener) {
				window.addEventListener.apply(window, arguments);
			} else {
				window.attachEvent.apply(window, arguments);
			}
		},

		/**
		 * returns the dimensions of the viewport
		 */
		dvp: function() {
			var w=window,d=document,e=d.documentElement,g=d.getElementsByTagName('body')[0],
			    x=w.innerWidth||e.clientWidth||g.clientWidth,
				y=w.innerHeight||e.clientHeight||g.clientHeight;
			return {w:x, h:y}
		},
		
		/**
		 * returns the current scroll position;
		 * Creates a function that provides best support without checking each time called
		 */
		scp: (function(){
			
			// find best support
			// from https://developer.mozilla.org/en-US/docs/Web/API/Window.scrollY
			var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");
			if ("undefined" != typeof(window.pageYOffset)) {
				return function() { 
					return {
						top: window.pageYOffset,
						left: window.pageXOffset
					}
				}
			}
			
			if (isCSS1Compat) {
				return function() {
					return {
						top: document.documentElement.scrollLeft,
						left: document.documentElement.scrollTop
					}
				}
			}
			
			return function() {
				return {
					top: document.body.scrollLeft,
					left: document.body.scrollTop
				};
			}
		})(),
		
		/**
		 * compute absolute position in browser viewport
		 */			
		offset : function(el) {
		    var top = 0, left = 0, el = _.gid(el);
		    do {
		        top += el.offsetTop  || 0;
		        left += el.offsetLeft || 0;
		        el = el.offsetParent;
		    } while(el);

		    return {
		        top: top,
		        left: left
		    };
		},
		
		/**
		 * is number
		 */
		isN: function(x){
			return "number" == typeof(x);
		},
		
		/**
		 * make an array form a dom list
		 */
		toA: function(dl) {
			if (!dl) {
				return [];
			}
			return Array.prototype.map.call(dl, function(e){return e});
		},
		
		/**
		 * isString -- only works if an object is passed!
		 */
		isS: function(x) {
			return "function" == typeof(x.substr);
		},
		
		/**
		 * resizes a text (font-size) by the width 
		 * of its parent element or ratio of viewport width 
		 */
		fit: function(el, options) {
			var options = options || {},
				min = (_.isN(options.min) ? options.min : 0), // minimum font size
				max = (_.isN(options.max) ? options.max : Infinity), // maximum font size
				f = (_.isN(options.f) ? options.f : 1), // scale factor						
				w = (_.isN(options.w) ? options.w : false); // ratio of width of page (widht of parent element will be used if 0 or undefined)
				
			var c = function() {
				var e = _.gid(el),
				    s = Math.max(Math.min((w ? _.dvp().w*w : e.clientWidth) / (f*10), 
										parseFloat(max)), 
											parseFloat(min)) + 'px';
				e.style.fontSize = s;
			}
			
			_.ael("resize", c);
			_.ael("orientationchange", c);
			c();
		},
		
		encode: function (string){
			return string.split("").map(function(i){return (i.charCodeAt(0)+13)}).join("|");

		},

		decode: function (string) {
			return string.split("|").map(function(i){return String.fromCharCode(parseInt(i) - 13)}).join("");
		}
	}
})(window);