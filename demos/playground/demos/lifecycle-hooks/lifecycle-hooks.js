var el = domvm.defineElement,
	vw = domvm.defineView;

function repaint(node) {
	node && node.el && node.el.offsetHeight;
}

function View1(vm, data) {
	// DOM node/template level hooks
	var hooks = {
		willInsert: function(node) {
		//	console.log("willInsert", node);
			node.patch({class: "inserted"});
		},
		didInsert: function(node) {
		//	console.log("didInsert", node);
			node.patch({class: ""});
		},
		willRecycle: function(oldNode, newNode) {
		//	console.log("willRecycle", oldNode, newNode);
			// DIY diff to detect changes
			if (oldNode.body !== newNode.body) {
				oldNode.patch({class: "reused changed"});
				repaint(oldNode);
			}
		},
		didRecycle: function(oldNode, newNode) {
		//	console.log("didRecycle", oldNode, newNode);
			if (oldNode.body !== newNode.body)
				newNode.patch({class: ""});
		},
		willReinsert: function(node) {
		//	console.log("willReinsert", node);
			node.patch({class: "moved"});
		},
		didReinsert: function(node) {
		//	console.log("didReinsert", node);
			node.patch({class: ""});
		},
		willRemove: function(node) {
		//	console.log("willRemove", node);
			return new Promise(function(resolve, reject) {
				node.patch({class: "removing"});
				repaint(node);
				node.patch({class: "removed"});
				node.el.addEventListener("transitionend", resolve);
			});
		},
		didRemove: function(node) {
		//	console.log("didRemove", node);
		},
	};

	return function() {
		return (
			el(".view1", [
				el("ul", data.map(function(word) {
					return el("li", {_hooks: hooks, _key: word.substr(0,1)}, word);
				})),
				vw(View2),
			])
		);
	};
}

function View2(vm) {
	vm.config({hooks: {
		willRedraw:	function() { /*console.log("willRedraw", vm);		*/},
		didRedraw:	function() { /*console.log("didRedraw", vm);		*/},
		willMount:	function() { /*console.log("willMount", vm);		*/},
		didMount:	function() { /*console.log("didMount", vm);			*/},
		willUnmount:function() { /*console.log("willUnmount", vm);		*/},
		didUnmount:	function() { /*console.log("didUnmount", vm);		*/},
	}});

	return function() {
		return el("p.view2", "Hello World");
	};
}

var data = [
	"0.cat",
	"1.dog",
];

var vm = domvm.createView(View1, data);

// view-level hooks
vm.config({hooks: {
	willRedraw: function(vm) {
	//	console.log("willRedraw", vm);
	},
	didRedraw: function(vm) {
	//	console.log("didRedraw", vm);
		vm.node.patch({class: "redrawn"});
		repaint(vm.node);
		vm.node.patch({class: ""});
	},
	willMount: function(vm) {
	//	console.log("willMount", vm);
	},
	didMount: function(vm) {
	//	console.log("didMount", vm);
		vm.node.patch({class: "mounted"});
		repaint(vm.node);
		vm.node.patch({class: ""});
	},
	willUnmount: function(vm) {
	//	console.log("willUnmount", vm);
		return new Promise(function(resolve, reject) {
			vm.node.patch({class: "unmounting"});
			repaint(vm.node);
			vm.node.patch({class: "unmounted"});
			node.el.addEventListener("transitionend", resolve);
		});
	},
	didUnmount: function(vm) {
	//	console.log("didUnmount", vm);
	},
}});

vm.mount(document.body);

var factor = 1.04;		// todo: investigate why exact transitionend

setTimeout(function() {
	data.pop();
	vm.redraw();
}, factor * 1000);

setTimeout(function() {
	data.push("2.foo","3.bar");
	vm.redraw();
}, factor * 2000);

setTimeout(function() {
	data.unshift(data.pop());
	vm.redraw();
}, factor * 3000);

setTimeout(function() {
	data.splice(2, 0, "4.cookie");
	data.splice(0, 1, "5.butter");
	vm.redraw();
}, factor * 4000);

setTimeout(function() {
	data[0] += "-mod";
	data[2] += "-mod";
	vm.redraw();
}, factor * 5000);

/*
setTimeout(function() {
	vm.unmount();
}, 6000);
*/