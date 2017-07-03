var el = domvm.defineElement;

var idle = false;

function View(vm) {
	return {
		diff: function(vm) {
			return {idle: idle};
		},
		hooks: {
			didRedraw: function() {
				console.log("didRedraw");
			}
		},
		render: function(vm, model, o, n) {
			if (o && o.idle != n.idle) {
				if (n.idle)
					vm.node.patch({class: "yyy", style: "display: none;"});
				else
					vm.node.patch({class: "xxx", style: "display: block;"});

				return vm.node;
			}

			return el(".moo", "HI");
		}
	};
}

var vm = domvm.createView(View).mount(document.body);

setTimeout(function() {
	idle = true;
	vm.redraw();
}, 1000);

setTimeout(function() {
	idle = false;
	vm.redraw();
}, 3000);