domvm.view.config({useRaf: false});

function DBMonView(vm, dbmon) {
	dbmon.vm = vm;

	return function() {
		return ["div",
			["table.table.table-striped.latest-data",
				["tbody",
					dbmon.data.map(function(db) {
						return [DBView, db, false];
					})
				]
			]
		];
	};
}

function DBView() {
	var oldDb = null;

	return function(vm, db) {
		if (db === oldDb)
			return false;

		oldDb = db;

		return ["tr",
			["td.dbname", db.dbname],
			["td.query-count",
				["span", { class: db.lastSample.countClassName }, db.lastSample.nbQueries]
			],
			db.lastSample.topFiveQueries.map(function(query) {
				return ["td.Query", { class: query.elapsedClassName },
					["span", query.formatElapsed],
					[".popover.left",
						[".popover-content", query.query],
						[".arrow"],
					]
				];
			})
		];
	};
}

function DBMon() {
	this.data = [];

	var self = this;

	this.to = null;

	this.update = function(loop) {
		this.data = ENV.generateData().toArray();

		Monitoring.renderRate.ping();

		this.vm && this.vm.redraw();

		if (loop)
			this.to = setTimeout(function() { self.update(loop); }, ENV.timeout);
	};

	this.stop = function() {
		clearTimeout(this.to);
	}

	this.update();
}

var instr = new DOMInstr(true);

var dbmon = new DBMon();

console.time("initial render");
	console.time("vtree build");
		var vw = domvm.view(DBMonView, dbmon);
	console.timeEnd("vtree build");
	console.time("mount");
		instr.start(true);
		vw.mount(document.getElementById("app"));
		console.log(instr.end());
	console.timeEnd("mount");
console.timeEnd("initial render");

/*
//	isomorphic test
var vw0 = domvm.view(DBMonView, dbmon);
var html = domvm.html(vw0.node);
var appEl = document.getElementById("app");
appEl.innerHTML = html;

var vw = domvm.view(DBMonView, dbmon);
vw.attach(appEl.firstChild);
*/

function step() {
	instr.start(true);
	dbmon.update();
	console.log(instr.end());
}

function loop() {
	dbmon.update(true);
}

function stop() {
	dbmon.stop();
}

// dbmon.update();