Munchkin.Cards.battle = function(player) {
	var victory, defeat, data = new joRecord({monster:1,modifier:0});
	/** Methods **/
	
	/** UI **/
	var card = new joCard([
		nameRow = new joFlexrow([
			new joCaption(player.getProperty("name")),
			new joCaption(player.getProperty("gear") + player.getProperty("level"))
		]),
		new Munchkin.Controls.SliderRow("Monster", data, "monster", 1, 50),
		new Munchkin.Controls.SliderRow("Modifier", data, "modifier", -20, 50),
		new joFlexrow([
			victory = new joButton("Victory"),
			defeat = new joButton("Defeat")
		])
	]).setTitle("Battle");
	
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
