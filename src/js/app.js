jo.load();

joListItem = function(data, value) {
	joContainer.apply(this, arguments);
	this.container.setAttribute("index", value);
}

joListItem.extend(joContainer, {
	tagName:"jolistitem"
});

var App = (function App() {
	var nav, screen, stack, cards, players, selectedPlayer;
	
	/**** Setup ****/
	players = new joDataSource([
		{name:"Duffy", level:1, strength:0},
		{name:"Haas", level:1, strength:0},
		{name:"Rust", level:1, strength:0},
		{name:"Smith", level:1, strength:0}
	])
	
	function animate(o) {
		joDOM.addCSSClass(o, "animate");
		joDefer(function() {joDOM.removeCSSClass(o, "animate");});
	}
	
	/**** Cards ****/
	cards = {
		main:function() {
			var b, list;
			
			var card = new joCard([
				list = new joList(players),
				b = new joButton("Battle!")
			]).setTitle("Players").setClassName("main");
						
			list.formatItem = function(item, index) {
				var slider, sliderLabel, level, drawer;
				var li = new joListItem([
					new joFlexrow([
						level = new joCaption(item.level).setClassName("player-level"),
						new joCaption(item.name).setClassName("player-name"),
						slider = new joSlider().setRange(-10,30).setClassName("strength-slider"),
						sliderLabel = new joCaption(item.level+item.strength).setClassName("strength-label")
					]),
					drawer = new joContainer([
						new joFlexrow([
							new joLabel("Level"),
							new joButton("<"),
							new joInput(),
							new joButton(">")
						]),
						new joFlexrow([
							new joLabel("Class"),
							new joSelect(["Warrior", "Wizard", "Ranger"])
						])
					]).setClassName("player-details")
				], index);
				
				level.selectEvent.subscribe(function() {
					console.log("!!!!");
				});				
				
				slider.changeEvent.subscribe(function(value) {
					item.strength = Math.round(value);
					sliderLabel.setData(item.strength+item.level);
				})
				
				slider.slideEndEvent.subscribe(function(value) {
					item.strength = Math.round(value);
					list.select(index);	// TODO: this isn't working
				});
				
				joDefer(function() {
					animate(slider);
					slider.setValue(item.strength);
				});
				
				return li;
			};
			
			list.refresh();
			list.selectEvent.subscribe(function(index){
				b.enable();
				drawers = list.getContainer().querySelectorAll("jolist jocontainer.player-details");
				for(var i=0;i<drawers.length;i++) {
					if(i == index) {
						joDOM.toggleCSSClass(drawers[i], "show")
					} else {
						joDOM.removeCSSClass(drawers[i], "show")
					}
				}
			});
			
			b.disable();
			b.selectEvent.subscribe(function() {
				var index = list.getValue();
				if(index) {
					selectedPlayer = players.getData()[index];
					stack.push(cards.battle());
				}
			});
			
			return card;
		},
		battle:function() {
			var playerRow, playerSlider, playerLabel, monsterRow, monsterSlider, monsterLabel, done;
			
			var card = new joCard([
				playerRow = new joFlexrow([
					new joCaption(selectedPlayer.name).setClassName("player-name"),
					playerSlider = new joSlider().setRange(-10,30),
					playerLabel = new joCaption().setClassName("strength-label")
				]),
				monsterRow = new joFlexrow([
					new joCaption("Monster").setClassName("player-name"),
					monsterSlider = new joSlider().setRange(-10,30),
					monsterLabel = new joCaption().setClassName("strength-label")
				]),
				done = new joButton("Done")
			]).setTitle("Battle!").setClassName("battle");
			
			stack.popEvent.subscribe(function() {
				players.getData().forEach(function(p) {
					if(p.level === 10) {
						screen.alert("Winner!", p.name + " is the winner!");
					}
				})
			});
			
			function highlightLeader() {
				var p = Math.round(playerSlider.getValue());
				var m = Math.round(monsterSlider.getValue());
				
				joDOM.removeCSSClass(monsterRow, "leader");
				joDOM.removeCSSClass(playerRow, "leader");
				if(p > m) {
					joDOM.addCSSClass(playerRow, "leader");
				} else if(p < m) {
					joDOM.addCSSClass(monsterRow, "leader");
				}
			}
			
			function updateSliderLabel(value, source) {
				var label = (source === playerSlider) ? playerLabel : monsterLabel;
				label.setData(Math.round(value));
			}
			
			playerSlider.changeEvent.subscribe(updateSliderLabel, this);
			monsterSlider.changeEvent.subscribe(updateSliderLabel, this);
			
			playerSlider.slideEndEvent.subscribe(highlightLeader)
			monsterSlider.slideEndEvent.subscribe(highlightLeader)
			
			joDefer(function() {
				animate(playerSlider);
				animate(monsterSlider);
				playerSlider.setValue(selectedPlayer.strength+selectedPlayer.level);
				monsterSlider.setValue(0);
				highlightLeader();
			});
			
			done.selectEvent.subscribe(function() {
				var p = Math.round(playerSlider.getValue());
				var m = Math.round(monsterSlider.getValue());
				if(p > m) {
					selectedPlayer.level++;
					players.load(players.getData());
				}
				
				stack.pop();
			});
			
			return card;
		},
		about:function() {
			
		}
	}
	
	/*** Methods ****/
	function init() {
		for(var cardName in cards) {
			joCache.set(cardName, cards[cardName]);
		}
		
		screen = new joScreen(
			new joContainer([
				new joFlexcol([
					nav = new joNavbar(),
					stack = new joStackScroller()
				])
			]).setStyle({position: "absolute", top: "0", left: "0", bottom: "0", right: "0"})
		);
		
		nav.setStack(stack);
		navigate("main");
	}
	
	function navigate(card, event, param) {
		// assume single argument is from direct call (rather than event) so map to param
		if(arguments.length === 1) {
			param = card;
		}
		
		stack.push(joCache.get(param));
	};
	
	return {
		init:init
	}
})();

window.onload = App.init;
