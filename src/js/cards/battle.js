Munchkin.Cards.battle = function(player) {
	var playerBanner, monsterBanner, done, data = new joRecord({monster:1,modifier:0});
	
	/** Methods **/
	function setupScroller(selection) {
		var dimensions = {"width":"80px","height":"100px"};
		var p = Munchkin.App.getPlayers().getData();
		var selectedPlayer; 
		var players = [];
		
		for(var i=0;i<p.length;i++) {
			var n = new Munchkin.Controls.Avatar(p[i]).setStyle(dimensions);
			players.push(n);
			
			if(p[i] === selection) {
				n.select(true);
				selectedPlayer = n;
			}
		}
		
		scroller.setData(new joContainer(players).setStyle({"width":(players.length*100) + "px","height":"120px"}));
		
		if(selectedPlayer) {
			scroller.moveTo(-selectedPlayer.getContainer().offsetLeft, 0);
		}
	}
	
	/** UI **/
	var card = new joCard([
		new joFlexcol([
			new joContainer([
				new joCaption().setClassName("players-label"),
				scroller = new joScroller().setClassName("h-scroller").setMode("horizontal")
			]).setClassName("player-scroller-row"),
			new joScroller([
				new joContainer([
					new joFlexrow([
						new joCaption(),
						playerBanner = new joCaption(player.getProperty("gear") + player.getProperty("level")).setClassName("battle-banner player"),
						new joCaption().setClassName("versus-text"),
						monsterBanner = new joCaption("0").setClassName("battle-banner monster"),
						new joCaption()
					]),
					new Munchkin.Controls.SliderRow("monster-label", data, "monster", 1, 50),
					new Munchkin.Controls.SliderRow("modifier-label", data, "modifier", -20, 50),
					done = new joButton("Done")
				])
			])
		])
	]).setClassName("card-battle").setTitle("Battle");
	
	setupScroller(player);
	
	/** Event Handlers **/
	done.selectEvent.subscribe(function() {
		Munchkin.App.back();
	});
	
	data.changeEvent.subscribe(function(property) {
		monsterBanner.setData(data.getProperty("monster") + data.getProperty("modifier"));
	})
	
	return card;
};
