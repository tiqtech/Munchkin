Munchkin.Controls.SliderRow = function(captionClass, record, property, min, max) {
	/** Variables **/
	var control;
	this.property = property;
	this.record = record;	// not calling setRecord since controls aren't set up yet
	this.sliderSetup = false;
	this.min = min;
	this.max = max;
	
	// this.selectEvent = new joSubject(this);
	
	/** UI **/
	control = new joFlexrow([
		this.caption = new joCaption().setClassName("player-details-label " + captionClass),
		this.doubleMinus = new joCaption().setClassName("button double minus"),
		this.minus = new joCaption().setClassName("button minus"),
		this.currentValue = new joCaption(record.link(property)).setClassName("player-details-value"),
		this.plus = new joCaption().setClassName("button plus"),
		this.doublePlus = new joCaption().setClassName("button double plus"),
	])
	
	/** Event Handlers **/
	this.doubleMinus.selectEvent.subscribe(this.updateValue, this, -3);
	this.minus.selectEvent.subscribe(this.updateValue, this, -1);
	this.doublePlus.selectEvent.subscribe(this.updateValue, this, 3);
	this.plus.selectEvent.subscribe(this.updateValue, this, 1);
	
	joContainer.call(this, control);
}

Munchkin.Controls.SliderRow.extend(joContainer, {
	tagName:"sliderrow",
	updateValue:function(v, source, data) {
		var p = this.record.getProperty(this.property);
		p = Math.min(Math.max(this.min, p+data), this.max);
		this.record.setProperty(this.property, p);
		joDOM.addCSSClass(source, "selected");
		joDefer(function() {
			joDOM.removeCSSClass(source, "selected");
		}, 5000);
	},
	setRecord:function(record) {
		this.record = record;
		this.currentValue.setDataSource(this.record.link(this.property));
	},
	getRecord:function() {
		return this.record;
	}
});