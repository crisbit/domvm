var el = domvm.defineElement,
	vw = domvm.defineView;

var App = {
	render: function(vm, data) {
		return el(".app", [
			vw(View, data, "a"),
			vw(View, data, "b"),
		]);
	}
};

var View = {
	init: function(vm, data, key, opts) {
		console.log(vm, data, key, opts);
	},
	render: function(vm, data) {
		return el(".moo", data.value + " " + Math.random())
	}
};

var data = {value: "hi"};

var vm = domvm.createView(App, data).mount(document.body);

setInterval(function() {
	vm.redraw();
}, 1000);