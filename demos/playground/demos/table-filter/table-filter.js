var el = domvm.defineElement,
	vw = domvm.defineView;

function FilterableProductTable(allProducts, filterText, inStockOnly) {
	this.allProducts = allProducts;
	this.searchBar = new SearchBar(filterText, inStockOnly);
	this.productTable = new ProductTable(allProducts);

	this.filter();
}

FilterableProductTable.prototype = {
	filter: function() {
		var bar = this.searchBar;

		this.productTable.products = this.allProducts.filter(function(product) {
			return !(product.name.indexOf(bar.filterText) === -1 || (!product.stocked && bar.inStockOnly))
		});
	},
};

function FilterableProductTableView(vm, filtTable) {
	vm.config({
		onemit: {
			filterChange: function() {
				filtTable.filter();
				vm.redraw();
			}
		}
	});

	return function() {
		return el("div", [
			vw(SearchBarView, filtTable.searchBar),
			vw(ProductTableView, filtTable.productTable),
		]);
	};
}

function SearchBar(filterText, inStockOnly) {
	this.filterText = filterText || "";
	this.inStockOnly = inStockOnly || false;
}

function SearchBarView(vm, searchBar) {
	function syncAndEmitChange(e) {
		searchBar.inStockOnly = vm.refs.inStockOnly.el.checked;
		searchBar.filterText = vm.refs.filterText.el.value;
		vm.emit("filterChange");
	}

	return function() {
		return el("form", [
			el("input", {
				_ref: "filterText",
				type: "text",
				placeholder: "Search...",
				onkeyup: syncAndEmitChange,
				value: searchBar.filterText
			}),
			el("br"),
			el("input", {
				_ref: "inStockOnly",
				type: "checkbox",
				onchange: syncAndEmitChange,
				checked: searchBar.inStockOnly
			}),
			"Only show products in stock"
		]);
	};
}

function ProductTable(products) {
	this.products = products;
}

function ProductTableView(vm, prodTable) {
	return function() {
		var rows = [];
		var lastCategory = null;

		prodTable.products.forEach(function(product) {
			if (product.category !== lastCategory) {
				rows.push(el("tr", [
					el("th", {colspan: 2}, product.category)
				]));
			}

			rows.push(el("tr", [
				product.stocked
				? el("td", product.name)
				: el("td", [el("span", {style: {color: "red"}}, product.name)]),
				el("td", product.price)
			]));

			lastCategory = product.category;
		});

		return el("table", [
			el("thead", [
				el("tr", [
					el("th", "Name"),
					el("th", "Price"),
				])
			]),
			el("tbody", rows)
		]);
	};
}

var products = [
	{category: 'Sporting Goods', price: '$49.99', stocked: true, name: 'Football'},
	{category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball'},
	{category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball'},
	{category: 'Electronics', price: '$99.99', stocked: true, name: 'iPod Touch'},
	{category: 'Electronics', price: '$399.99', stocked: false, name: 'iPhone 5'},
	{category: 'Electronics', price: '$199.99', stocked: true, name: 'Nexus 7'}
];

// if you want, you can initialize the table with pre-defined filters
var filterText = "",
	inStockOnly = false;

var myTable = new FilterableProductTable(products, filterText, inStockOnly);

domvm.createView(FilterableProductTableView, myTable).mount(document.body);