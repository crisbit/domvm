var el = (tag, arg1, arg2, flags) => domvm.defineElement(tag, arg1, arg2, domvm.FIXED_BODY);

function View(vm, store) {
	return () => {
		var items = domvm.lazyList(store.items, {
			key:  item => item.id,
			diff: item => [store.selected === item.id, item.text],
		});

		return el("div", {_flags: domvm.KEYED_LIST | domvm.LAZY_LIST}, items.map(item =>
			el("p", {class: store.selected === item.id ? 'selected' : null, _key: item.id}, [		// items.key(item)
				el("em", item.text),
			])
		));
	}
}

var store = {
	selected: "b",
	items: [
		{id: "a", text: "A"},
		{id: "b", text: "B"},
		{id: "c", text: "C"},
	]
};

var vm = domvm.createView(View, store).mount(document.body);

setTimeout(function() {
	vm.redraw(true);
}, 1000);

setTimeout(function() {
	store.items = [];
	vm.redraw(true);
}, 2000);

setTimeout(function() {
	store.items = [
		{id: "a", text: "A"},
		{id: "b", text: "B"},
		{id: "c", text: "C"},
	];
	vm.redraw(true);
}, 3000);

setTimeout(function() {
	store.items[3] = {id: "x", text: "X"};
	vm.redraw(true);
}, 4000);

setTimeout(function() {
	store.items[1] = {id: "y", text: "Y"};
	vm.redraw(true);
}, 5000);

function View2(vm, store) {
	return () => {
		var items = domvm.lazyList(store.items, {
			key:  item => item.id,
			diff: item => [store.selected === item.id, item.text],
		});

		return el("div", {_flags: domvm.LAZY_LIST}, items.map(item =>
			el("p", {_data: item.id, class: store.selected === item.id ? 'selected' : null}, [		// items.key(item)
				el("em", item.text),
			])
		));
	}
}

var vm2 = domvm.createView(View2, store).mount(document.body);

setTimeout(function() {
	store.items[1] = {id: "y", text: "Y"};
	vm2.redraw(true);
}, 6000);