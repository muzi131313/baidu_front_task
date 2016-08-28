/**
  * 2016 JavaScript technology stack:
  * http://www.codeceo.com/article/2016-javascript-stack-state.html
  */
/**
  * article list:
  * http://www.codeceo.com/article/tag/javascript
  */
var Dom = {
	id: function (id) {
		return document.getElementById(id);	
	},
	claz: function (claz) {
		return document.querySelector(claz);	
	},
	name: function (name) {
		return document.getElementsByName(name);
	},
	html: function (dom, html) {
		dom.innerHTML = html;
	}
}, Event = {
	on: function (dom, type, callback) {
		if(dom.addEventListener) dom.addEventListener(type, callback);
		else if(dom.attachEvent) dom.attachEvent('on'+type, callback);
		else dom['on'+type] = callback;
	},
	event: function (event) {
		return event || window.event;	
	},
	target: function (event) {
		event = this.event(event);
		return event.target || event.srcElement;
	},
	preventDefault: function (event) {
		event = this.event(event);
		if(event.preventDefault) event.preventDefault();
		else event.returnValue = false;
	}
};