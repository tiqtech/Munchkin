jo.load();

joListItem = function(data, value) {
	joContainer.apply(this, arguments);
	this.container.setAttribute("index", value);
}

joListItem.extend(joContainer, {
	tagName:"jolistitem"
});

joIcon = function() {joView.apply(this, arguments); }
joIcon.extend(joView, {tagName:"joicon"});

var App = (function App() {
	var nav, screen, stack, cards, players, selectedPlayer, preferences;
	
	/**** Setup ****/
	players = new joDataSource([
		new joRecord({name:"Duffy", level:1, strength:0}),
		new joRecord({name:"Haas", level:1, strength:0}),
		new joRecord({name:"Rust", level:1, strength:0}),
		new joRecord({name:"Smith", level:1, strength:0})
	])
	
	preferences = new joRecord({
		maxLevel:10
	});
	
	function animate(o) {
		joDOM.addCSSClass(o, "animate");
		joDefer(function() {joDOM.removeCSSClass(o, "animate");});
	}
	
	/**** Cards ****/
	cards = {
		main:function() {
			var b, list, lastExpando;
			
			var card = new joCard([
				list = new joList(players),
				b = new joButton("Battle!")
			]).setTitle("Players").setClassName("main");
						
			list.formatItem = function(item, index) {
				var slider, subLevel, addLevel, levelInput, classSelect, drawer;
				var li = new joListItem([
					drawer = new joExpando([
						new joFlexrow([
							level = new joCaption(item.link("level")).setClassName("player-level"),
							new joCaption(item.link("name")).setClassName("player-name"),
							new joCaption(item.link("strength")).setClassName("strength-label"),
							slider = new joSlider().setRange(0,30).setClassName("strength-slider"),
							new joIcon()
						]),
						new joExpandoContent([
							new joFlexrow([
								new joLabel("Level"),
								subLevel = new joButton("<"),
								levelInput = new joInput(item.link("level")),
								addLevel = new joButton(">"),
								new joCaption()
							]).setClassName("level-row"),
							new joFlexrow([
								new joLabel("Class"),
								classSelect = new joSelect(["Warrior", "Wizard", "Ranger"])
							]).setClassName("class-row")
						]).setClassName("player-details-wrapper")
					]).setClassName("player-details")
				], index);
				
				// drawer.openEvent.subscribe(function() {
					// lastExpando = drawer;
				// });
				
				function modifyLevel(value, source, modifier) {
					var v = (levelInput.getValue() || 1)+modifier;
					v = Math.max(Math.min(v,preferences.getProperty("maxLevel")), 1);
					
					levelInput.setValue(v);
				};
				subLevel.selectEvent.subscribe(modifyLevel, this, -1);
				addLevel.selectEvent.subscribe(modifyLevel, this, 1);
				
				classSelect.selectEvent.subscribe(function() {
					console.log("selectEvent");
					joEvent.stop();
				});
				
				levelInput.beforeChangeEvent.subscribe(function(e, source) {
					e.value = Math.max(Math.min(e.value,preferences.getProperty("maxLevel")), 1);
				});
				
				function updateStrength(value) {
					item.setProperty("strength", Math.round(value));
				}
				slider.changeEvent.subscribe(updateStrength)
				slider.slideStartEvent.subscribe(function() {
					joEvent.stop();
					list.setValue(index);
				});
				
				joDefer(function() {
					animate(slider);
					slider.setValue(item.getProperty("strength"));
				});
				
				return li;
			};
			
			list.refresh();
			list.selectEvent.subscribe(function(index) {
				if(lastExpando) {
					lastExpando.close();
				}
				b.enable();
			})
			
			b.disable();
			b.selectEvent.subscribe(function() {
				var index = list.getValue();
				if(typeof index !== "undefined") {
					selectedPlayer = players.getData()[index];
					stack.push(cards.battle());
				}
			});
			
			return card;
		},
		battle:function() {
			var playerRow, modifierRow, playerLabel, monsterRow, monsterSlider, monsterLabel, done;
			
			var card = new joCard([
				playerRow = new joFlexrow([
					new joCaption(selectedPlayer.getProperty("name")).setClassName("player-name"),
					new joCaption(selectedPlayer.getProperty("strength")+selectedPlayer.getProperty("level")).setClassName("strength-label")
				]),
				monsterRow = new joFlexrow([
					new joCaption("Monster"),
					monsterSlider = new joSlider().setRange(0,30),
					monsterLabel = new joCaption().setClassName("strength-label")
				]),
				modifierRow = new joFlexrow([
					new joCaption("Modifier"),
					modifierSlider = new joSlider().setRange(-30,30),
					modifierLabel = new joCaption().setClassName("strength-label")
				]),
				done = new joButton("Done")
			]).setTitle("Battle!").setClassName("battle");
			
			joDefer(function() {
				animate(monsterSlider);
				monsterSlider.setValue(0);
				modifierSlider.setValue(0);
			});
			
			stack.popEvent.subscribe(function() {
				players.getData().forEach(function(p) {
					if(p.level === 10) {
						screen.alert("Winner!", p.name + " is the winner!");
					}
				})
			});
					
			function updateSliderLabel(value, source) {
				var label = (source === modifierSlider) ? modifierLabel : monsterLabel;
				label.setData(Math.round(value));
			}
			
			modifierSlider.changeEvent.subscribe(updateSliderLabel, this);
			monsterSlider.changeEvent.subscribe(updateSliderLabel, this);
						
			done.selectEvent.subscribe(function() {
				var modifier = Math.round(modifierSlider.getValue());
				var monster = Math.round(monsterSlider.getValue());
				
				var level = selectedPlayer.getProperty("level");
				var p = selectedPlayer.getProperty("strength") + level 
				if(p > monster + modifier) {
					selectedPlayer.setProperty("level", level+1);
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
