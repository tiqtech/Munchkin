jo.load();
phoneGap = new PhoneGap();

Munchkin = {
	cards:{},
	controls:{}
};

var App = (function() {
	/** Variables **/
	var nav, screen, stack, cards, players, selectedPlayer, preferences;
	
	/** Setup **/
	players = new joDataSource([
		new joRecord({name:"Duffy", level:1, strength:0}),
		new joRecord({name:"Haas", level:1, strength:0}),
		new joRecord({name:"Rust", level:1, strength:0}),
		new joRecord({name:"Smith", level:1, strength:0})
	])
	
	preferences = new joRecord({
		maxLevel:10
	});
	
	
	/*** Methods ****/
	
	function animate(o) {
		joDOM.addCSSClass(o, "animate");
		joDefer(function() {joDOM.removeCSSClass(o, "animate");});
	}
	
	function init() {
		if (window.PalmSystem) {
			window.PalmSystem.setWindowOrientation('free');
		}
		
		for(var cardName in Munchkin.cards) {
			joCache.set(cardName, Munchkin.cards[cardName]);
		}
		
		screen = new joScreen(
			new joContainer([
				new joFlexcol([
					nav = new joNavbar(),
					stack = new joStackScroller()
				])
			]).setStyle({position: "absolute", top: "0", left: "0", bottom: "0", right: "0"})
		);
		
		nav.setStack(stack);
		navigate("main");
	}
	
	function navigate(card, event, param) {
		// assume single argument is from direct call (rather than event) so map to param
		if(arguments.length === 1) {
			param = card;
		}
		
		stack.push(joCache.get(param));
	};
	
	return {
		init:init
	}
})();

joEvent.on(window, "load", function() {
	App.init();
	navigator.device.deviceReady();
});
