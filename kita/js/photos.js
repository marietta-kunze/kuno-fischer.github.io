(function(){
	// TODO start/Stop-time to stop loading on slow connection

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
	
	function rotate(el, no) {
		console.info("rotate", el, no, _.gid(el))
		
		var kids = _.gid(el).childNodes;
		
		if (!no || no >= kids.length) {
			no = 0;
		}
		
		for (var i=0; i<kids.length; i++) {
			kids[i].style.zIndex = -2;
			if (i == no) {
				kids[i].style.zIndex = -1;
				console.log(kids[i], kids[i].style.zIndex)
			}
		}
		console.log("no", no)
		
		window.setTimeout(function(){rotate(el, no+1)}, 5000);
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
		
		// select a random subset of photos
		choose(photos, 5).forEach(function(photo){
			var src = "http://farm" + photo.farm + ".static.flickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_" + "b.jpg";
			var img = document.createElement("img");
				img.src = src;
			var li = document.createElement("li");
			    li.appendChild(img);
			pel.appendChild(li);
		});
		
		rotate(pel);
		
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

