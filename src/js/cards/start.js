Munchkin.Cards.start = function() {
	var card, newGame, splash, continueGame, about, t;
	
	function startNewGame() {
		Munchkin.App.getPlayers().setData([]);
		Munchkin.App.go("main");
	}
	
	function unblink() {
		joDOM.removeCSSClass(splash, "alt");
		t = joDefer(blink, this, 3000);
	}
	
	function blink() {
		joDOM.addCSSClass(splash, "alt");
		t = joDefer(unblink, this, 250);
	}
	
	card = new joCard([
		splash = new joCaption().setClassName("spash-image"),
		newGame = new joButton("New Game"),
		continueGame = new joButton("Continue Game"),
		about = new joButton("About")
	]).setClassName("card-start").setTitle("Munchkin Score!");
	
	card.activate = function() {
		var players = Munchkin.App.getPlayers();
		if(players.getData().length === 0) {
			continueGame.setStyle({"display":"none"});
		} else {
			continueGame.setStyle({"display":"block"});
		}
		
		if (!t) {
			blink();
		}
	}
	
	newGame.selectEvent.subscribe(startNewGame);
	continueGame.selectEvent.subscribe(Munchkin.App.go, Munchkin.App, "main");
	about.selectEvent.subscribe(Munchkin.App.go, Munchkin.App, "about");
	
	return card;
};

Munchkin.Cards.about = function() {
	var card;
	
	card = new joCard([
		new joScroller(
			new joContainer([
				new joCaption("<b>Munchkin Score!</b> is a game aid for Steven Jackson Games <A href=\"http://www.worldofmunchkin.com\" target=\"_blank\">Munchkin</a>.  Unlike other game aids, Munchkin Score allows you to keep track of your level and gear as well as everyone elses so you know exactly who to help and who to hurt."),
				new joCaption("Feedback").setClassName("header"),
				new joCaption("<ul><li><a href=\"http://twitter.com/tiqtech\" target=\"_blank\">@tiqTech</a> on Twitter</li><li><a href=\"mailto:support@tiqtech.com?subject=Munchkin Score Support\">support@tiqtech.com</a></li></ul>"),
				new joCaption("If you like this app, please <a href=\"http://developer.palm.com/appredirect/?packageid=com.tiqtech.munchkin\" target=\"_blank\">write a review</a> in the App Catalog.  You can support future development of this and other applications by donating via PayPal below."),
				new joFlexrow([new joCaption("<a href=\"https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=LK2LLP59AV4ML\" target=\"_blank\"><img src=\"images/donate.gif\" align=\"center\"></a>")]).setClassName("donate-button"),
				new joCaption("Legal Notices and Disclaimers").setClassName("header"),
				new joCaption("<A href=\"http://www.worldofmunchkin.com\" target=\"_blank\">Munchkin</a> is a trademark of Steve Jackson Games, and its rules and art are copyrighted by Steve Jackson Games . All rights are reserved by Steve Jackson Games. This game aid is the original creation of tiqTech.com and is released for free distribution, and not for resale, under the permissions granted in the <a href=\"http://www.sjgames.com/general/online_policy.html\" target=\"_blank\">Steve Jackson Games Online Policy</a>."),
				new joCaption().setClassName("footer")
			])
		)
	]).setClassName("card-about").setTitle("About Muchkin Score");
	
	return card;
}