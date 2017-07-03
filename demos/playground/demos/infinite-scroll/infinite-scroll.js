var el = domvm.defineElement;

const itemsToLoad = 20;

function ItemListView(vm, model) {
	const itemHeight = 30;
	const windowHeight = 300;
	const loadWhenNumFromBottom = 5;

	function calcLoadLine(scrollHeight) {
		return scrollHeight - (itemHeight * loadWhenNumFromBottom);
	}

	var loadLine = calcLoadLine(itemsToLoad * itemHeight);

	var onscroll = function(e) {
		var winBottom = e.target.scrollTop + windowHeight;
		if (winBottom >= loadLine) {
			model.loadMoar();
			vm.redraw();
			loadLine = calcLoadLine(e.target.scrollHeight);
		}
	};

	// this is render() and is called on every redraw() to regen the template
	return function() {
		var props = {
			style: {height: windowHeight+"px", overflowY: "scroll"},
			onscroll: onscroll,
		};

		var kids = model.items.map(function(item) {
			return el("div", {style: {color: item.color, height: itemHeight+"px"}}, item.color);
		});

		return el("#win", props, kids);
	}
}

function randColor() {
	return '#'+Math.floor(Math.random()*16777215).toString(16);
}

var model = {
	loadMoar: function() {
		for (var i = itemsToLoad; i > 0; i--)
			model.items.push({color: randColor()});
	},
	items: [],
};

// load initial items
model.loadMoar();

domvm.createView(ItemListView, model).mount(document.body);