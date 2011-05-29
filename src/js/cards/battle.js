Munchkin.Cards.battle = function(player) {
	var victory, defeat, data = new joRecord({monster:1,modifier:0});
	
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
		new joFlexrow([
			new joCaption("Players").setClassName("players-label"),
			scroller = new joScroller().setClassName("h-scroller").setMode("horizontal")
		]).setStyle({"border-bottom":"1px solid #222222"}),
		new Munchkin.Controls.SliderRow("monster-label", data, "monster", 1, 50),
		new Munchkin.Controls.SliderRow("modifier-label", data, "modifier", -20, 50),
		new joFlexrow([
			victory = new joButton("Victory"),
			defeat = new joButton("Defeat")
		])
	]).setTitle("Battle");
	
	setupScroller(player);
	
	/** Event Handlers **/
	victory.selectEvent.subscribe(function() {
		level = player.getProperty("level");
		player.setProperty("level", ++level);
		Munchkin.App.back();
	});
	
	defeat.selectEvent.subscribe(function() {
		Munchkin.App.back();
	});
	
	return card;
};
