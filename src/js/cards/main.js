Munchkin.cards.main = function() {
	
	/** Methods **/
	
	/** UI **/
	var card = new joCard([
		new joFlexcol([
			new joCaption("Above"),
			new joFlexrow([
				new Munchkin.controls.Avatar("Ryan"),
				new Munchkin.controls.Avatar("Rust"),
				new Munchkin.controls.Avatar("Haas"),
				new Munchkin.controls.Avatar("Smith"),
			]),			
			new joCaption("Below")
		])
	]);
	
	/** Event Handlers **/
	
	return card;
};
