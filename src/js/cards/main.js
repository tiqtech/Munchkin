joFade = function() {
	joView.call(this);
}

joFade.extend(joView, {
	tagName:"jofade",
	setPosition:function(position) {
		this.setClassName("fade-"+position);
		
		return this;
	}
});

Munchkin.Cards.main = function() {
	/** Variables **/	
	var mockPlayer = new joRecord({});							// data
	var scroller, players, addPlayer, selectedPlayer,			// controls
		nameRow, nameField, levelSlider, gearSlider, playerDetails;
		
	/** Methods **/
	function updateName(value) {
		this.setProperty("name", value);
	}
	
	function selectPlayer(player, source, data) {
		if(source !== selectedPlayer) {
			if(!!selectedPlayer) {
				selectedPlayer.select(false);
			}
			source.select(true);
			selectedPlayer = source;
			
			var record = selectedPlayer.getRecord();
			nameField.setValueSource(record.link("name"));
			levelSlider.setRecord(record);
			gearSlider.setRecord(record);
			
			var visible = {"visibility":"visible"};
			playerDetails.setStyle(visible);
			
			joFocus.set(nameField);
		}
	}
	
	function setupScroller(selection) {
		var dimensions = {"width":"80px","height":"100px"};
		var p = Munchkin.App.getPlayers().getData();
		players = [];
		selectedPlayer = null;	// clear selection when rebuilding controls
		
		for(var i=0;i<p.length;i++) {
			var n = new Munchkin.Controls.Avatar(p[i]).setStyle(dimensions);
			n.selectEvent.subscribe(selectPlayer, this);
			players.push(n);
			
			if(p[i] === selection) {
				n.selectEvent.fire(p[i]);
			}
		}
		
		players.push(addPlayer = new Munchkin.Controls.Avatar(new joRecord({"name":"Add ..."})).setClassName("add-player").setStyle(dimensions))
		
		scroller.setData(new joContainer(players).setStyle({"width":(players.length*100) + "px","height":"120px"}));
		addPlayer.selectEvent.subscribe(addNewPlayer);
		
		if(selectedPlayer) {
			scroller.moveTo(-selectedPlayer.getContainer().offsetLeft, 0);
		}
	}
	
	function addNewPlayer() {
		var p = Munchkin.App.getPlayers();
		var data = p.getData();
		var newPlayer = new joRecord({name:"New Player",level:1,gear:0,avatar:"images/avatar/" + (data.length+1) + ".jpg"});
		data.push(newPlayer)
		p.setData(data);
		
		setupScroller(newPlayer);
	}
	
	function removePlayer() {
		var p = Munchkin.App.getPlayers();
		var data = p.getData();
		var selected = selectedPlayer.getRecord();
		for(var i=0;i<data.length;i++) {
			if(data[i] === selected) {
				data.splice(i, 1);
			}
		}
		
		p.setData(data);
		playerDetails.setStyle({"visibility":"hidden"});
		setupScroller();
	}
	
	function startBattle() {
		if (selectedPlayer) {
			Munchkin.App.go(new Munchkin.Cards.battle(selectedPlayer.getRecord()));
		}
	}
	
	/** UI **/
	
	var card = new joCard([
		new joFlexcol([
			new joFlexrow([
				new joCaption("Players").setClassName("players-label"),
				scroller = new joScroller().setClassName("h-scroller").setMode("horizontal")
			]).setClassName("player-scroller-row"),
			playerDetails = new joScroller([
				new joContainer([
					nameRow = new joFlexrow([
						new joCaption().setClassName("player-details-label player-name-label"),
						nameField = new joInput(undefined, mockPlayer.link("name"))
					]).setClassName("player-name-row"),
					levelSlider = new Munchkin.Controls.SliderRow("player-level-label", mockPlayer, "level",1,Munchkin.App.getPreferences().getProperty("maxLevel")),
					gearSlider = new Munchkin.Controls.SliderRow("player-strength-label", mockPlayer, "gear",0,25),
					battle = new joButton("Battle"),
					removeButton = new joButton("Remove")
				]),
				new joFade().setPosition("top"),
				new joFade().setPosition("bottom")
			]).setClassName("player-details").setStyle({"visibility":"hidden"})
		])
	]).setTitle("Munchkin!");
	
	setupScroller();
	
	/** Event Handlers **/
	battle.selectEvent.subscribe(startBattle);
	removeButton.selectEvent.subscribe(removePlayer);
	
	return card;
};
