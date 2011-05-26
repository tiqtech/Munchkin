jo.load();
phoneGap = new PhoneGap();

Munchkin = {
	Cards:{},
	Controls:{}
};

Munchkin.App = (function() {
	/** Variables **/
	var nav, screen, stack, cards, players, selectedPlayer, preferences;
	
	/** Setup **/
	players = new joDataSource([]);	// have to include empty array otherwise getData() will return null later
	
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
		
		for(var cardName in Munchkin.Cards) {
			joCache.set(cardName, Munchkin.Cards[cardName]);
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
		
		if(param instanceof joView) {
			stack.push(param)
		} else {
			stack.push(joCache.get(param));
		}
	};
	
	return {
		init:init,
		go:navigate,
		back:function() { stack.pop() },
		getScreen:function() { return screen; },
		getPlayers:function() { return players; },
		getPreferences:function() { return preferences; }
	}
})();

joEvent.on(window, "load", function() {
	Munchkin.App.init();
	navigator.device.deviceReady();
});
