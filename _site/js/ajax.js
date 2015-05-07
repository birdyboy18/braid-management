//my own ajax library because there are never any simple ones

var ajax = (function(){
	var ajax = {};
	var request = new XMLHttpRequest();

	ajax.get = function(url,callback) {
		var r = new XMLHttpRequest();
		r.responseType = 'text/json';

		r.onreadystatechange = function(e) {
			if (this.readyState == 4) { //Done
				callback(this.status,this.response);
			}
		}

		r.open("GET",url, true);
		r.send(null);

	};

	ajax.post = function(url, data, callback) {
		var r = new XMLHttpRequest();
		r.responseType = 'text/json';
		r.open('POST', url, true);
		r.setRequestHeader('Access-Control-Allow-Origin','*');
		r.setRequestHeader('Content-type','application/json; charset=utf-8');

		r.onreadystatechange = function(e) {
			if (this.readyState == 4) { //Done
				callback(this.status, this.response);
			}
		}
		r.send(data);
	};

	return ajax;

})();