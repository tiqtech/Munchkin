Munchkin.Controls.Avatar = function(player) {
	/** Variables **/
	var control, button;
	
	this.player = player;
	this.selectEvent = new joSubject(this);
	
	/** UI **/
	control = new joFlexcol([
		new joContainer([
			new joCaption("photo!").setClassName("player-photo-spacer"),
			new joFlexrow([
				new joCaption(player.link("level")).setClassName("player-level"),
				new joCaption(),
				new joCaption(player.link("gear")).setClassName("player-gear")
			]),
		]).setClassName("player-photo"),
		new joCaption(player.link("name")).setClassName("player-name")
	]);
	
	/** Event Handlers **/
	joEvent.on(control, "click", function() {
		this.selectEvent.fire(player);
	}, this);
	
	joContainer.call(this, control, player);
}

Munchkin.Controls.Avatar.extend(joContainer, {
	tagName:"avatar",
	select: function(select) {
		if(!!!select) {
			joDOM.removeCSSClass(this.container, "selected");
		} else {
			joDOM.addCSSClass(this.container, "selected");
		}
	},
	getRecord:function() {
		return this.player;
	}
});

