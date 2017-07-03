domvm.config({
	stream: {
		is:		s => flyd.isStream(s),
		val:	s => s(),
		sub:	(s, fn) => flyd.on(fn, s),
		unsub:	s => s.end(true),
	}
});

var el = domvm.defineElement;

function randColor() {
	return '#'+Math.floor(Math.random()*16777215).toString(16);
}

function View1(vm, pers) {
	return function() {
		return el("div", pers.age);
	}
}

function View2(vm, pers) {
	return function() {
		return el("strong", pers.age);
	}
}

function View3(vm, pers) {
	return function() {
		return el("#square", {style: {background: pers.background}}, pers.age);
	}
}

function View4(vm, pers) {
	return function() {
		return el("#style", {style: pers.style}, pers.age);
	}
}

function View5(vm, pers) {
	return function() {
		return el("input", {disabled: pers.disabled, placeholder: pers.disabled() ? "Disabled" : null}, pers.age);
	}
}

function View6(vm, pers) {
	function incrAge(e) {
		pers.age(pers.age() + 1)
	}

	return function() {
		return el("button", {onclick: incrAge}, "Age += 1");
	}
}

function View7(vm, pers) {
	return function() {
		return el("button", {onclick: [pers.age, 100]}, "Age = 100");
	}
}

function genStyle(p) {
	return {
		background: p.background(),
		border: "3px solid " + randColor(),
	};
}

var pers = {
	age: flyd.stream(0),
	background: flyd.stream(randColor()),
	style: flyd.stream(),
	disabled: flyd.stream(false),
};

pers.style(genStyle(pers));

domvm.createView(View1, pers).mount(document.body);
domvm.createView(View2, pers).mount(document.body);
domvm.createView(View3, pers).mount(document.body);
domvm.createView(View5, pers).mount(document.body);
domvm.createView(View4, pers).mount(document.body);
domvm.createView(View6, pers).mount(document.body);
domvm.createView(View7, pers).mount(document.body);

var factor = 1;

setInterval(function() {
	pers.age(pers.age() + 1);
}, factor * 1000);

setInterval(function() {
	pers.background(randColor());
}, factor * 1500);

setInterval(function() {
	pers.style(genStyle(pers));
}, factor * 500);

setInterval(function() {
	pers.disabled(!pers.disabled());
}, factor * 250);