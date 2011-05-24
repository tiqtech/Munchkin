Munchkin.controls.Avatar = function(name) {
	/** Variables **/
	var control, button;
	
	/** UI **/
	control = new joFlexcol([
		new joContainer([
			new joCaption().setClassName("player-photo-spacer"),
			new joFlexrow([
				new joCaption("3").setClassName("player-level"),
				new joCaption(),
				new joCaption("8").setClassName("player-gear")
			]),
		]).setClassName("player-photo"),
		new joCaption(name).setClassName("player-name")
	]);
	
	/** Event Handlers **/
	joEvent.on(control, "click", function() {
		console.log("selected avatar");
	}, this);
	
	joContainer.call(this, control);
}

Munchkin.controls.Avatar.extend(joContainer, {
	tagName:"avatar"
});

