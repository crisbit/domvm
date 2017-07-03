var el = domvm.defineElement;

function randStr(len) {
	return Math.random().toString(36).substr(2,len);
}

function FeedView(vm, tweets) {
	var hooks = {
		didInsert: n => twttr.widgets.createTweet(n.data, n.el)
	};

	return () =>
		el("#feed", [
			randStr(10),
			tweets.map(tweetId =>
				el(".tweet", {_data: tweetId, _hooks: hooks})
			)
		])
}

var tweets = [
	'790139408573992961',
	'789311000163946497',
	'789024368575729664',
];

var vm = domvm.createView(FeedView, tweets).mount(document.body);

setInterval(vm.redraw.bind(vm), 100);