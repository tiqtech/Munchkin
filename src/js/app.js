jo.load();
phoneGap = new PhoneGap();

joListItem = function(data, value) {
	joContainer.apply(this, arguments);
	this.container.setAttribute("index", value);
}

joListItem.extend(joContainer, {
	tagName:"jolistitem"
});

joIcon = function() {joControl.apply(this, arguments); }
joIcon.extend(joControl, {tagName:"joicon"});

joExpando.prototype.isOpen = function() {
	return this.container.className.match(/[\s|^o]pe[n\s|n$]/);
}

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
			var b, list, expandEvent;
			
			expandEvent = new joSubject(this);
			var card = new joCard([
				list = new joList(players),
				b = new joButton("Battle!")
			]).setTitle("Players").setClassName("main");
						
			list.formatItem = function(item, index) {
				var slider, strengthLabel, subLevel, addLevel, levelInput, classSelect, raceSelect, drawer, icon;
				var li = new joListItem([
					new joFlexrow([
						level = new joCaption(item.link("level")).setClassName("player-level"),
						new joCaption(item.link("name")).setClassName("player-name"),
						strengthLabel = new joCaption(item.link("strength")).setClassName("strength-label"),
						slider = new joSlider().setRange(0,30).setClassName("strength-slider"),
						icon = new joIcon()
					]),
					drawer = new joExpando([
						new joCaption().setClassName("hideme"),
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
							]).setClassName("class-row"),
							new joFlexrow([
								new joLabel("Race"),
								raceSelect = new joSelect(["Human", "Elf", "Dwarf"])
							]).setClassName("race-row")
						]).setClassName("player-details-wrapper")
					]).setClassName("player-details")
				], index);

				icon.selectEvent.subscribe(function() {
					joEvent.stop();
					list.setValue(index);
					drawer.toggle();
					
					if(drawer.isOpen()) {
						joDOM.addCSSClass(icon, "open");
						expandEvent.fire({
							icon: icon,
							drawer: drawer
						});
					}
				});
				
				drawer.closeEvent.subscribe(function() {
					joDOM.removeCSSClass(icon, "open"); 
				});
				expandEvent.subscribe(function(o) {
					if(o.drawer !== drawer && drawer.isOpen())	drawer.close()
				});
				
				function modifyLevel(value, source, modifier) {
					var v = (levelInput.getValue() || 1)+modifier;
					v = Math.max(Math.min(v,preferences.getProperty("maxLevel")), 1);
					
					levelInput.setValue(v);
				};
				subLevel.selectEvent.subscribe(modifyLevel, this, -1);
				addLevel.selectEvent.subscribe(modifyLevel, this, 1);
				
				classSelect.selectEvent.subscribe(function() {
					joEvent.stop();
				});
				
				levelInput.beforeChangeEvent.subscribe(function(e, source) {
					e.value = Math.max(Math.min(e.value,preferences.getProperty("maxLevel")), 1);
				});
				
				function updateStrength(value, source) {
					strengthLabel.setData(Math.round(value));	
				}
				
				slider.changeEvent.subscribe(updateStrength, this)
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
		if (window.PalmSystem) {
			window.PalmSystem.setWindowOrientation('free');
		}
		
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

joEvent.on(window, "load", function() {
	App.init();
	navigator.device.deviceReady();
});
