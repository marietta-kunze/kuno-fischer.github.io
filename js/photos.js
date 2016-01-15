(function(){
	// TODO 
	// - start/Stop-time to stop loading on slow connection
	// - add controls
	// - add link to source collection
	// - add responsiveness: store chosen photos, (re)load different sizes depending on viewport width, reset only if thresholds for veiwport widths have been exceeded, create different styles (rect on mobile) that are independent of image sizes
	
	
	var now = new Date().getTime(), time = now-startload;
	console.log("startload", startload);
	console.log("now", now);
	console.log("load time", time);
	_.gid("dbg").innerHTML = "loading time: " + time + "ms";
	
	if (time > 3000) {
		return;
	}

	// by set
	var set_id = "72157641216022374";
	var api_key = "27d64da4e2b09b01ee477b37629fac67";
	var callback = "jsonFlickrCallback" + new Date().getTime();
	var url = "https://api.flickr.com/services/rest/?format=json&method=flickr.photosets.getPhotos&photoset_id=" + set_id + "&per_page=1000&page=1&api_key=" + api_key + "&jsoncallback=" + callback;

	// by user
	var user_id = "8431584@N06";
	var url = "https://api.flickr.com/services/rest/?format=json&method=flickr.people.getPhotos&user_id=" + user_id + "&per_page=1000&page=1&api_key=" + api_key + "&jsoncallback=" + callback;

	function choose(input, num) {
		num = Math.min(num, input.length);
		var output = [];
		while (num--) {
			output.push(input.splice(parseInt(input.length * Math.random()), 1)[0]);
		}
		return output;
	}
	
	var next = 0,
		to = null;
	
	function rotate(el, offset) {
		
		window.clearTimeout(to);
		
		var kids = _.gid(el).childNodes;
			
		next = next + (offset || 0);
			
		if (next >= kids.length) {
			next = 0;
		} else {
			if (next < 0) {
				next = kids.length - 1;
			}
		}
		
		for (var i=0; i<kids.length; i++) {
			kids[i].style.zIndex = -2;
			if (i == next) {
				kids[i].style.zIndex = -1;
			}
		}
		
		to = window.setTimeout(function(){rotate(el, 1)}, 5000);
	}

	function init(data){
		// check for photos
		var photos = false;;
		
		if (data) {
			// by user id
			if (data.photos && data.photos.photo) {
				photos = data.photos.photo;
			} 
			
			// by photoset
			else if (data.photoset && data.photoset.photo) {
				photos = data.photoset.photo;
			} 
		}
		
		// no data found
		if (!photos) {
			return false;
		}
		
		var pel = _.gid("photos");
		
		// apply css styles
		pel.className = pel.className + " ready";

		var ul = document.createElement("ul");
		
		var l = document.createElement("a");
		l.className="icn chleft";
		l.onclick = function(){rotate(ul, -1)};
		l.onmouseover = function(){window.clearTimeout(to)};
		l.onmouseout = function(){rotate(ul,0)};
		
		var r = document.createElement("a")
		r.className="icn chright";
		r.onclick = function(){rotate(ul, 1)};
		r.onmouseover = function(){window.clearTimeout(to)};
		r.onmouseout = function(){rotate(ul,0)};
		
			pel.appendChild(ul);
			pel.appendChild(l);
			pel.appendChild(r);
		
		// select a random subset of photos
		choose(photos, 5).forEach(function(photo){
			var src = "http://farm" + photo.farm + ".static.flickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_" + "c.jpg";
			var img = document.createElement("img");
				img.src = src;
			var li = document.createElement("li");
			    li.appendChild(img);
			ul.appendChild(li);
		});
		
		rotate(ul);
		
	} // init()
		
	_.ael("load", function(){
		// register callback
		window[callback] = init;
		
		// add jsonp script tag
		var script = document.createElement("script");
		script.src = url;
		document.body.appendChild(script);
	});
})();

