Munchkin.Controls.Avatar = function(player) {
	/** Variables **/
	var control, button, remove, photo = player.getProperty("avatar");
	
	this.player = player;
	this.selectEvent = new joSubject(this);
	this.removeEvent = new joSubject(this);
	
	photo = photo || "shadow";
	
	/** UI **/
	control = new joFlexcol([
		new joContainer([
			new joContainer([
				remove = new joControl().setClassName("remove-button")
			]).setClassName("player-photo-spacer"),
			new joFlexrow([
				new joCaption(player.link("level")).setClassName("player-level"),
				new joCaption(),
				new joCaption(player.link("gear")).setClassName("player-gear")
			]),
		]).setClassName("player-photo").setStyle({"backgroundImage":"url('images/avatar/" + photo + ".jpg')"}),
		new joCaption(player.link("name")).setClassName("player-name")
	]);
	
	/** Event Handlers **/
	joEvent.on(control, "click", function() {
		this.selectEvent.fire(player);
	}, this);
	
	remove.selectEvent.subscribe(function() {
		this.removeEvent.fire(player);
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

