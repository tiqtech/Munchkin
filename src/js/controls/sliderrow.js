Munchkin.Controls.SliderRow = function(captionClass, record, property, min, max) {
	/** Variables **/
	var control;
	this.property = property;
	this.record = record;	// not calling setRecord since controls aren't set up yet
	this.sliderSetup = false;
	
	// this.selectEvent = new joSubject(this);
	
	/** UI **/
	control = new joFlexrow([
		this.caption = new joCaption().setClassName("player-details-label " + captionClass),
		this.currentValue = new joCaption(record.link(property)).setClassName("player-details-value"),
		this.slider = new joSlider().setRange(min, max, 1).setClassName("player-details-slider")
	])
	
	// HACK: joSlider doesn't position thumb for initial value correctly
	joDefer(function() {
		this.slider.setValue(this.getRecord().getProperty(this.property), true);	// pass silent flag to prevent changeEvent fire
		this.slider.draw();
		this.sliderSetup = true;
	}, this);
	
	// HACK: linking record to slider causes thumb to disappear
	this.slider.changeEvent.subscribe(function(value) {
		if(this.sliderSetup) {
			this.getRecord().setProperty(property, value);
		}
	}, this);
	
	/** Event Handlers **/
	// joEvent.on(control, "click", function() {
		// this.selectEvent.fire(player);
	// }, this);
	
	joContainer.call(this, control);
}

Munchkin.Controls.SliderRow.extend(joContainer, {
	tagName:"sliderrow",
	setRecord:function(record) {
		this.record = record;
		this.slider.setValue(this.record.getProperty(this.property));
		this.currentValue.setDataSource(this.record.link(this.property));
	},
	getRecord:function() {
		return this.record;
	}
});