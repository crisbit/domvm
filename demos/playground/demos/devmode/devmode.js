//	domvm.DEVMODE.mutations = false;
//	domvm.DEVMODE.warnings = false;
//	domvm.DEVMODE.verbose = false;

var el = domvm.defineElement,
	vw = domvm.defineView,
	sv = domvm.defineSvgElement;

var subView3 = true;

function View(vm) {
	function onclick() { var x = 1; }

	var attrs = {
		type: "text",
		value: "moo",
	};

	return function() {
		return el("div", [
			el("input"),
			el("input[name=x]"),
			el("div", {onmousedown: function() {}}, "Click me!"),
			el("div", {onclick: onclick}, "Click me 2!"),
			el("div", {onclick: subView3 ? onclick : [onclick]}, "Click me 3!"),
			el("svg"),
			sv("svg"),
			vw(View2, {}),
			vw(View2, {}, 'mooKey'),
			subView3 ? vw(View3) : null,
			vw(View4, {}),
			el("input", attrs),
		]);
	}
}

function View2() {
	return function() {
		return el("strong", "View2");
	}
}

function View3(vm) {
	setTimeout(function() {
		subView3 = false;
		vm.root().redraw();
		vm.redraw();
	}, 500);

	return function() {
		return el("em", "View3");
	}
}

function View4(vm, data) {
	return function() {
		return el("em", "View4");
	}
}

var vm = domvm.createView(View).mount(document.body);

var myDiv = document.createElement("div");

document.body.lastChild.appendChild(myDiv);