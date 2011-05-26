Munchkin.Cards.main = function() {
	/** Variables **/	
	var mockPlayer = new joRecord({});							// data
	var scroller, players, addPlayer, selectedPlayer,			// controls
		nameRow, nameField, levelSlider, gearSlider;
		
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
			
			nameRow.setStyle({"visibility":"visible"});
			levelSlider.setStyle({"visibility":"visible"});
			gearSlider.setStyle({"visibility":"visible"});
			
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
		
		players.push(addPlayer = new Munchkin.Controls.Avatar(new joRecord({"name":"Add ..."})).setStyle(dimensions))
		
		scroller.setData(new joContainer(players).setStyle({"width":(players.length*100) + "px","height":"120px"}));
		addPlayer.selectEvent.subscribe(addNewPlayer);
	}
	
	function addNewPlayer() {
		var p = Munchkin.App.getPlayers();
		var data = p.getData();
		var newPlayer = new joRecord({name:"New Player",level:1,gear:0});
		data.push(newPlayer)
		p.setData(data);
		
		setupScroller(newPlayer);
	}
	
	/** UI **/
	
	var card = new joCard([
		new joFlexcol([
			new joFlexrow([
				new joCaption("Players").setClassName("players-label"),
				scroller = new joScroller().setClassName("h-scroller").setMode("horizontal")
			]),
			nameRow = new joFlexrow([
				new joCaption().setClassName("player-details-label player-name-label"),
				nameField = new joInput(undefined, mockPlayer.link("name"))
			]).setClassName("player-name-row").setStyle({"visibility":"hidden"}),
			levelSlider = new Munchkin.Controls.SliderRow("player-level-label", mockPlayer, "level",1,Munchkin.App.getPreferences().getProperty("maxLevel")).setStyle({"visibility":"hidden"}),
			gearSlider = new Munchkin.Controls.SliderRow("player-strength-label", mockPlayer, "gear",0,25).setStyle({"visibility":"hidden"}),
			// new joHTML("<div style=\"position:fixed;top:0px;left:0px;height:480px;width:320px;border:1px solid black\"></div>"),
			// new joHTML("<div style=\"position:fixed;top:0px;left:0px;height:400px;width:320px;border:1px solid black\"></div>"),
			// new joHTML("<div style=\"position:fixed;top:0px;left:0px;height:800px;width:480px;border:1px solid black\"></div>")
		])
	]).setTitle("Munchkin!");
	
	setupScroller();
	
	/** Event Handlers **/
	
	return card;
};
