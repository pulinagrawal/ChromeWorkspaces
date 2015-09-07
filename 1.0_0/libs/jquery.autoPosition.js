//v1.6

//jQuery.autoPosition plugin

//Copyrighted by coderlau@gmail.com
//not for commerical usage

//Intro
//There is a need to easily position elements in relationships to other elements and KEEP that relationship!
//This jQuery plugin function is similar to jQuery UI's .position(), but with auto position/size updating, event propagations and other options
//Can save a LOT of hand coding when trying to position ELements in relation to other Elements
//	and have those relationships be maintained when one or more elements are repositioned or resized

//Setting-up
//load the code after jQuery v1.8+ is loaded

//Basic Usage
//Same Basic usage as jQuery UI's .position()
//eg. $(followerEL).autoPosition({my: "left top", at: "left top", of: leaderEL})
//*note: The follower elements will have css property 'position' set to 'absolute' to position it.
//**note: Any element that is moved by the user or something should trigger custom event 'moved.autoPosition'; eg. $('#divSplitterMovedByUser').trigger('moved.autoPosition')
//		  Then any element (follower) that FOLLOWS that element (leader) should also update its position/size accordingly.

//Basic Example
//eg. $('#div2').autoPosition({my:"left", at:"right", of:"#div1"})
//then div2 should follow div1 around even when div1 is being dragged around...
//*note: need div1 to fire event 'moved.autoPosition' while being dragged; see Propagation

//Advanced Usage
//$('#followerEl').autoPosition({
//	my : "top|right|bottom|left|centerX|centerY|center and any LOGICAL order and combinations there of",
//  at : "top|right|bottom|left|centerX|centerY|center and any LOGICAL order and combinations there of",
//	of : leaderEL OR '#leaderEl_id',
//	offset: {x:#, y:#}, //default = {x:0, y:0}
//  oppositeEdgeBehavior : staysAway (default) | staysPut | followsWhenCollapsed | leastEffect
//		//	staysAway ; opposite edges move in sync
//		//	staysPut ; opposite edges will never move; blocks follower's moving edge
//		//	followsWhenCollapsed ; opposite edges will only move (follows followerEdge) when the whole div is collapsed
//	propagate : true|false, //default = true
//		//set to false if you DON'T want the movement of followerEL to propagate events to registered ELs
//		//for example:
//		//$('#div2').autoPosition({my:"left", at:"right", of:"#div1", propagate:false})
//		//$('#div3').autoPosition({my:"left", at:"right", of:"#div2")
//		//div1 moving will only move div2; div3 will not be moved
//		//div3 will be moved if propagate is set to true
//	twoway : true|false		//default = false //set to true if you want leaderEL to follow followerEL back when followerEL moves
//})

//Propagation
//to have an element propagate it's position/size changes that are NOT changed by autoPosition
//for example; by dragging
//trigger the custom event moved.autoPosition at the end of the action
//for example:
//$('#div1').on('drag', function(evt, ui){
//	$('#div1').offset(ui.offset)
//	$('#div1').trigger('moved.autoPosition') OR $('#div1').trigger('moved.autoPosition',{movedBy:'drag'})	//the , {} is not essential
//})

(function($) {
	var debug = false

	$.fn.autoPosition = function(arg) {
		if (debug == true) {
			console.logg("autoPosition")
		}

		//arg
		//1111111111111111111111111111111111111111111111111111111111111111111
		var __arg//section bookmark

		//get ELs
		//where follower and leader are either PTRs to the ELs or '#id'
		var follower = this[0]
		var leader = $(arg.of)[0]

		//set position to absolute
		$(follower).css('position', 'absolute')
		if (arg.twoway == true) {
			$(leader).css('position', 'absolute')
		}

		//get terms
		var followerEdges = arg.my.split(" ")
		var leaderEdges = arg.at.split(" ")

		//length == 1
		//2222222222222222222222222222222222222
		//replace 'center' with 'center center'
		if (followerEdges.length == 1 && followerEdges[0] == 'center') {
			followerEdges = ['center', 'center']
		}
		if (leaderEdges.length == 1 && leaderEdges[0] == 'center') {
			leaderEdges = ['center', 'center']
		}

		//add 'whatever'
		function addWhatever(arr) {
			if (arr.length == 1) {
				arr.push('whatever')
			}
		}

		addWhatever(followerEdges)
		addWhatever(leaderEdges)
		//222222222222222222222222222222222222222222

		//bubble sort	//X first, left, right, centerX //Y later, top, bottom, centerY
		//eg. center top //top center	//center bottom	//bottom center
		function sort(arr) {//arr = ptr to followerEdges or leaderEdges
			if (arr.length > 1 && (arr[0] == 'top' || arr[0] == 'bottom' || arr[0] == 'centerY')) {
				//switch
				var temp = arr[1]
				arr[1] = arr[0]
				arr[0] = temp
			}
		}

		sort(followerEdges)
		sort(leaderEdges)

		//replace 'center with either centerX or centerY
		function centerReplace(arr) {
			for (var i in arr) {
				if (arr[i] == 'center') {
					if (i == 0) {
						arr[i] = 'centerX'
					} else {
						arr[i] = 'centerY'
					}
				}
			}
		}

		centerReplace(followerEdges)
		centerReplace(leaderEdges)

		if (debug == true) {
			console.logg('autoPosition; arg section; followerEdges=', followerEdges)
		}
		if (debug == true) {
			console.logg('autoPosition; arg section; leaderEdges=', leaderEdges)
		}

		//111111111111111111111111111111111111111111111111
		//arg end

		//options
		//111111111111111111111111111111111111111111111
		//where options = {
		//	offset:int
		//	oppositeEdgeBehavior:staysAway|staysPut|followsWhenCollapsed|leastEffect,
		//	propagate:bool
		//	twoway:bool}
		//where oppositeEdgeBehavior = staysAway | staysPut ( blocks) | followsWhenCollapsed | leastEffect
		//	staysAway ; opposite edges move in sync
		//	staysPut ; opposite edges will never move
		//	followsWhenCollapsed ; opposite edges will only move (follows followerEdge) when the whole div is collapsed
		//	leastEffect ; top and left moves so that height and width stay the same
		//	leastEffect ; right and bottoms moves so that left and top stay the same
		var __options//section bookmark
		//defaults options
		var options = arg
		if (options == null || options == undefined) {
			options = new Object()
		}
		if (options.offset == null || options.offset == undefined) {
			options.offset = {
				x : 0,
				y : 0
			}
		}
		if (options.offset.x == null || options.offset.x == undefined) {
			options.offset.x = 0
		}
		if (options.offset.y == null || options.offset.y == undefined) {
			options.offset.y = 0
		}
		if (options.oppositeEdgeBehavior == null || options.oppositeEdgeBehavior == undefined) {//behavior as relates to followerEdge

			options.oppositeEdgeBehavior = 'staysAway'
		}
		if (options.propagate == null || options.propagate == undefined) {
			options.propagate = true
		}
		if (options.twoway == null || options.twoway == undefined) {
			options.twoway = false
		}
		if (options.moveWhenLeaderMoved == null || options.moveWhenLeaderMoved == undefined) {
			options.moveWhenLeaderMoved = true
		}
		if (options.moveWhenFollowerMoved == null || options.moveWhenFollowerMoved == undefined) {
			options.moveWhenFollowerMoved = false
		}
		if (options.triggerLeaderWhenLeaderParentScrolled == null || options.triggerLeaderWhenLeaderParentScrolled == undefined) {
			options.triggerLeaderWhenLeaderParentScrolled = true
		}
		if (options.triggerLeaderWhenWindowResized == null || options.triggerLeaderWhenWindowResized == undefined) {
			options.triggerLeaderWhenWindowResized = true
		}

		//11111111111111111111111111111111111111111
		//options end

		//helper funcs
		//1111111111111111111111111111111111111111111111
		var __helperFunctions
		function setRight(el, newRight, moveLeftToRight) {
			//moveLeftToRight
			//determines behavior when right is to the left of left

			//moveLeft
			if (moveLeftToRight == null || moveLeftToRight == undefined) {
				moveLeftToRight = false
			}

			//normal
			var oldLeft = $(el).offset().left
			if (newRight >= oldLeft) {
				$(el).width(newRight - oldLeft)
			}

			//right is to the left of left
			if (newRight < oldLeft) {
				if (moveLeftToRight == true) {
					$(el).width(newRight - oldLeft)//will make it 0
					$(el).offset({
						left : newRight
					})
				}
				if (moveLeftToRight == false) {
					$(el).width(newRight - oldLeft) //will make it 0
				}
			}

		}//setRight

		function setBottom(el, newBottom, moveTopToBottom) {
			//moveTopToBottom:bool
			//determines behavior when bottom is higher than top

			//moveTop
			if (moveTopToBottom == null || moveTopToBottom == undefined) {
				moveTopToBottom = true
			}

			//normal
			var oldTop = $(el).offset().top
			if (newBottom >= oldTop) {
				//top	//unchanged
				//bottom
				$(el).height(newBottom - oldTop)
			}

			//bottom is higher than top
			if (newBottom < oldTop) {
				if (moveTopToBottom == true) {
					//top
					$(el).offset({
						top : newBottom
					})
					//bottom
					$(el).height(newBottom - oldTop)//will make it 0

				}
				if (moveTopToBottom == false) {
					$(el).height(newBottom - oldTop) //will make it 0
				}
			}

		}//setBottom

		//moves an element
		//contains NO event firing and other stuff
		//returns hasMoved:bool
		function move(follower, followerEdge, leader, leaderEdge, options) {
			if (followerEdge == 'whatever' || leaderEdge == 'whatever') {
				return false
			}

			//vars
			var leaderEdgeValue
			var hasMoved = false

			//leaderEdgeValue
			if (leaderEdge == 'top') {
				leaderEdgeValue = $(leader).offset().top
			} else if (leaderEdge == 'right') {
				leaderEdgeValue = $(leader).offset().left + $(leader).width()
			} else if (leaderEdge == 'bottom') {
				leaderEdgeValue = $(leader).offset().top + $(leader).height()
			} else if (leaderEdge == 'left') {
				leaderEdgeValue = $(leader).offset().left
			} else if (leaderEdge == 'centerX') {
				leaderEdgeValue = $(leader).offset().left + $(leader).width() / 2
			} else if (leaderEdge == 'centerY') {
				leaderEdgeValue = $(leader).offset().top + $(leader).height() / 2
			}

			//add offset
			leaderEdgeValue = leaderEdgeValue + options.offset

			//staysAway
			var __staysAway
			////////////////////////////////////////////
			if (options.oppositeEdgeBehavior == 'staysAway') {
				if (followerEdge == 'top') {
					//move top; height unchanged
					if ($(follower).offset().top == leaderEdgeValue) {
						//no need to move
					} else {
						//top
						$(follower).offset({
							top : leaderEdgeValue
						})
						//bottom	//no need	//bottom auto stays away as height is not changed
						hasMoved = true
					}
				} else if (followerEdge == 'right') {
					//move left; width unchanged....
					var right = $(follower).offset().left + $(follower).width()
					if (right == leaderEdgeValue) {
						//no need to move
					} else {
						//left
						var newLeft = leaderEdgeValue - $(follower).width()
						$(follower).offset({
							left : newLeft
						})
						//right //no need  //right auto stays away as width is not changed
						hasMoved = true
					}
				} else if (followerEdge == 'bottom') {
					//move top; height unchanged
					var bottom = $(follower).offset().top + $(follower).height()
					if (bottom == leaderEdgeValue) {
						//no need to move
					} else {
						//top
						var newTop = leaderEdgeValue - $(follower).height()
						$(follower).offset({
							top : newTop
						})
						//bottom //no need	//bottom auto stays away as height is not changed
						//changes top instead
						hasMoved = true
					}

				} else if (followerEdge == 'left') {
					//move left; width unchanged
					if ($(follower).offset().left == leaderEdgeValue) {
						//no need to move
					} else {
						//left
						$(follower).offset({
							left : leaderEdgeValue
						})
						//right	//no need  //right auto stays away as width is not changed
						//changes left position instead
						hasMoved = true
					}
				} else if (followerEdge == 'centerX') {
					var oldCenter = $(follower).offset().left + $(follower).width() / 2
					var newCenter = leaderEdgeValue
					if (oldCenter == newCenter) {
						//no need to move
					} else {
						//left
						var newLeft = newCenter - $(follower).width() / 2
						$(follower).offset({
							left : newLeft
						})
						//right	//no need

						hasMoved = true
					}
				} else if (followerEdge == 'centerY') {
					var oldCenter = $(follower).offset().top + $(follower).height() / 2
					var newCenter = leaderEdgeValue
					if (oldCenter == newCenter) {
						//no need to move
					} else {
						//top
						var newTop = newCenter - $(follower).height() / 2
						$(follower).offset({
							top : newTop
						})
						//bottom //no need
						hasMoved = true
					}

				}
			}//staysAway

			//staysPut
			var __staysPut
			////////////////////////////////////////////////
			if (options.oppositeEdgeBehavior == 'staysPut') {
				if (followerEdge == 'top') {
					var newTop = leaderEdgeValue
					//move top to leading edge; height stretches so that bottom stays put;
					if ($(follower).offset().top == newTop) {
						//no need to move
					} else {
						var newTop = leaderEdgeValue
						var oldBottom = $(follower).offset().top + $(follower).height()
						//top
						$(follower).offset({
							top : newTop
						})
						//bottom
						setBottom($(follower), oldBottom, true)

						hasMoved = true
					}
				} else if (followerEdge == 'right') {
					//left stay put; width stretches so that right is at leading edge
					var oldRight = $(follower).offset().left + $(follower).width()
					var newRight = leaderEdgeValue
					if (oldRight == newRight) {
						//no need to move
					} else {
						//left	//unchanged
						//right
						setRight($(follower), newRight, false)

						hasMoved = true

					}
				} else if (followerEdge == 'bottom') {
					//top stay put; height stretches so that bottom is at leading edge
					var bottom = $(follower).offset().top + $(follower).height()
					var newBottom = leaderEdgeValue
					if (bottom == newBottom) {
						//no need to move
					} else {
						//top	//unchanged
						//bottom
						setBottom($(follower), newBottom, false)

						hasMoved = true
					}
				} else if (followerEdge == 'left') {
					//left moves to leading edge; width stretches so that right stays put
					var newLeft = leaderEdgeValue
					if ($(follower).offset().left == newLeft) {
						//no need to move
					} else {
						var oldRight = $(follower).offset().left + $(follower).width()
						if (debug == true) {
							console.logg("oldRIght = ", oldRight, 'newLeft = ', newLeft)
						}
						//left
						$(follower).offset({
							left : newLeft
						})//moves right value
						//right
						setRight($(follower), oldRight, true)

					}
				} else if (followerEdge == 'centerX') {
					//differs from staysAway	//right stretches
					//
					var oldCenter = $(follower).offset().left + $(follower).width() / 2
					var newCenter = leaderEdgeValue
					if (oldCenter == newCenter) {
						//no need to move
					} else {
						//left
						var newLeft = newCenter - $(follower).width() / 2
						$(follower).offset({
							left : newLeft
						})
						//right
						var newRight = newCenter + $(follower).width() / 2
						setRight($(follower), newRight, false)

						hasMoved = true

					}
				} else if (followerEdge == 'centerY') {
					var oldCenter = $(follower).offset().top + $(follower).height() / 2
					var newCenter = leaderEdgeValue
					if (oldCenter == newCenter) {
						//no need to move
					} else {
						//top
						var newTop = newCenter - $(follower).height() / 2
						$(follower).offset({
							top : newTop
						})

						//bottom
						var newBottom = newCenter + $(follower).height() / 2
						setBottom($(follower), newBottom, false)

						hasMoved = true
					}
				}
			}//staysPut

			//followsWhenCollapsed
			var __followsWhenCollapsed
			////////////////////////////////////////////////
			if (options.oppositeEdgeBehavior == 'followsWhenCollapsed') {
				if (followerEdge == 'top') {
					var newTop = leaderEdgeValue
					//move top to leading edge; height stretches so that bottom stays put;
					if ($(follower).offset().top == newTop) {
						//no need to move
					} else {
						var newTop = leaderEdgeValue
						var oldBottom = $(follower).offset().top + $(follower).height()
						//top
						$(follower).offset({
							top : newTop
						})
						//bottom
						setBottom($(follower), oldBottom, false)

						hasMoved = true
					}
				} else if (followerEdge == 'right') {
					//left stay put; width stretches so that right is at leading edge
					var oldRight = $(follower).offset().left + $(follower).width()
					var newRight = leaderEdgeValue
					if (oldRight == newRight) {
						//no need to move
					} else {
						//left	//unchanged
						//right
						setRight($(follower), newRight, true)

						hasMoved = true

					}
				} else if (followerEdge == 'bottom') {
					//top stay put; height stretches so that bottom is at leading edge
					var bottom = $(follower).offset().top + $(follower).height()
					var newBottom = leaderEdgeValue
					if (bottom == newBottom) {
						//no need to move
					} else {
						//top	//unchanged
						//bottom
						setBottom($(follower), newBottom, true)

						hasMoved = true
					}
				} else if (followerEdge == 'left') {
					//left moves to leading edge; width stretches so that right stays put
					var newLeft = leaderEdgeValue
					if ($(follower).offset().left == newLeft) {
						//no need to move
					} else {
						var oldRight = $(follower).offset().left + $(follower).width()
						//left
						$(follower).offset({
							left : newLeft
						})//moves right value
						//right
						setRight($(follower), oldRight, false)

					}
				} else if (followerEdge == 'centerX') {
					var oldCenter = $(follower).offset().left + $(follower).width() / 2
					var newCenter = leaderEdgeValue
					if (oldCenter == newCenter) {
						//no need to move
					} else {
						//left
						var newLeft = newCenter - $(follower).width() / 2
						$(follower).offset({
							left : newLeft
						})
						//right
						var newRight = newCenter + $(follower).width() / 2
						setRight($(follower), newRight, true)

						hasMoved = true

					}
				} else if (followerEdge == 'centerY') {
					var oldCenter = $(follower).offset().top + $(follower).height() / 2
					var newCenter = leaderEdgeValue
					if (oldCenter == newCenter) {
						//no need to move
					} else {
						//top
						var newTop = newCenter - $(follower).height() / 2
						$(follower).offset({
							top : newTop
						})
						//bottom
						var newRight = newCenter + $(follower).height() / 2
						setBottom($(follower), newBottom, true)

						hasMoved = true
					}
				}

			}//followsWhenCollapsed

			var __return
			return hasMoved

		}//move

		//11111111111111111111111111111111111111111111111
		//helper funcs end

		function moveAndTrigger(leader, follower, arg1) {
			if (debug == true) {
				console.logg("  moveAndTrigger CALLED;")
				//console.logg("moveAndTrigger CALLED; 	leader = ", $(leader).prop('id'), ' , follower = ', $(follower).prop('id'), ' , arg1 = ', arg1, ' this = ')
			}
			//x
			var hasMoved1 = move(follower, followerEdges[0], leader, leaderEdges[0], {
				offset : options.offset.x,
				oppositeEdgeBehavior : options.oppositeEdgeBehavior
			})
			//y
			var hasMoved2 = move(follower, followerEdges[1], leader, leaderEdges[1], {
				offset : options.offset.y,
				oppositeEdgeBehavior : options.oppositeEdgeBehavior
			})

			//hasMoved
			if ((hasMoved1 || hasMoved2) && options.propagate == true) {
				if (debug == true) {
					console.logg("	follower MOVED and trigger its own moved.autoPosition")
				}

				$(follower).trigger('moved.autoPosition', {
					movedBy : $(leader),
					evt : 'target was moved by movedBy in moveAndTrigger'
				})

			} else {
				if (debug == true) {
					console.logg("	follower NOT moved")
				}
			}

		}

		moveAndTrigger(leader, follower, {
			movedBy : $(leader),
			evt : 'autoPosition init'
		})

		var __eventRegister//bookmark
		//use $._data($('#div1').get(0), "events") to see binded events
		//use .on('click.namespace.class', function)
		//use .off('.class') or .off('.namespace.class') or .off('click.namespace') or .off('click.class')

		//register custom events

		//1
		if (options.moveWhenLeaderMoved) {
			$(leader).on('moved.autoPosition', function(evt, arg1, arg2) {
				evt.stopPropagation()

				//arg1
				if (arg1 == undefined || arg1 == null) {
					arg1 = {
						movedBy : $(leader),
						evt : 'leader moved by itself ?'
					}
				}

				//debug
				if (debug == true) {
					console.logg('moved.autoPosition Leader MOVED; 	evt leader = ', $(leader).prop('id'), " , evt follower = ", $(follower).prop('id'), " , evt target = ", $(evt.target).prop('id'), " , arg1.evt =", arg1.evt)
				}

				//filter out bubbled events
				if ($(leader)[0] != $(evt.target)[0]) {
					if (debug == true) {
						console.logg('	not the right target; this is bubbling;	exit')
					}
					return false
				}

				//break loop
				if (arg1.movedBy != undefined && $(arg1.movedBy)[0] == $(follower)[0]) {//need the [0]... weird
					//leader was moved by the follower and then the leader/target is now moving the follower again...
					//break cycle
					if (debug == true) {
						console.logg(" 	movedBy == follower; break cycle")
					}
					return false
				}

				//moveAndTrigger
				else {
					if (debug == true) {
						console.logg(" 	movedBy != follower; call moveAndTrigger; movedBy = ", $(arg1.movedBy).prop('id'))
					}
					moveAndTrigger($(leader), $(follower), arg1)
				}

			})//$(leader).on('moved.autoPosition'
		}//if(moveWhenLeaderMoved)

		//2
		if (options.moveWhenFollowerMoved) {
			$(follower).on('moved.autoPosition', function(evt, arg1, arg2) {
				evt.stopPropagation()

				//arg1
				if (arg1 == undefined || arg1 == null) {
					arg1 = {
						movedBy : $(follower),
						evt : 'follower moved by itself?'
					}
				}

				//debug
				if (debug == true) {
					console.logg('moved.autoPosition Follower MOVED; 	evt leader = ', $(leader).prop('id'), " , evt follower = ", $(follower).prop('id'), " , evt target = ", $(evt.target).prop('id'), " , arg1.evt =", arg1.evt)
				}

				//filter out bubbled events
				if ($(follower)[0] != $(evt.target)[0]) {
					if (debug == true) {
						console.logg('	not the right target; this is bubbling;	exit')
					}
					return false
				}

				//break loop
				if (arg1.movedBy != undefined && $(arg1.movedBy)[0] == $(follower)[0]) {//need the [0]... weird
					//follower was moved by the follower and then the follower is now moving the follower again...
					//break cycle
					if (debug == true) {
						console.logg(" 	movedBy == follower; break cycle")
					}
					return false
				}

				//moveAndTrigger
				else {
					if (debug == true) {
						console.logg(" 	movedBy != follower; call moveAndTrigger; movedBy = ", $(arg1.movedBy).prop('id'))
					}
					moveAndTrigger($(leader), $(follower), arg1)
				}

			})//$(follower).on('moved.autoPosition'
		}//if (moveWhenFollowerMoved)

		//3
		if (options.triggerLeaderWhenLeaderParentScrolled) {
			$(leader).parent().on('scroll', function(evt, arg1, arg2) {
				evt.stopPropagation()

				//arg1
				if (arg1 == undefined || arg1 == null) {
					arg1 = {
						movedBy : $(leader).parent(),
						evt : 'target(leader parent) scrolled'
					}
				}

				//debug
				if (debug == true) {
					console.logg('moved.autoPosition Leader Parent SCROLLED; 	evt leader = ', $(leader).prop('id'), " , evt follower = ", $(follower).prop('id'), " , evt target = ", $(evt.target).prop('id'), " , arg1.evt =", arg1.evt)
				}

				//filter out bubbled events
				if ($(leader).parent()[0] != $(evt.target)[0]) {
					if (debug == true) {
						console.logg('	not the right target; this is bubbling;	exit')
					}
					return false
				}

				//trigger leader
				$(leader).trigger('moved.autoPosition', {
					movedBy : $(leader).parent(),
					evt : 'leader parent scroll'
				})
			})
		}//if (triggerLeaderWhenLeaderParentScrolled)

		//4
		if (options.triggerLeaderWhenWindowResized) {
			$(window).on('resize', function(evt, arg1, arg2) {
				evt.stopPropagation()
				$(leader).trigger('moved.autoPosition', {
					movedBy : $(window),
					evt : 'window resize'
				})
			})
		}

		//twoway
		var __twoway//bookmark
		if (options.twoway == true) {
			//set options.twoway = false to prevent loop
			//reverse $('#follower').autoPosition({my:"center", at:"left top", of:"#leader"})
			$(leader).autoPosition({
				my : options.at,
				at : options.my,
				of : $(follower),
				offset : options.offset,
				oppositeEdgeBehavior : options.oppositeEdgeBehavior,
				propagate : options.propagate,
				twoway : false
			})
		}

	}//autoPosition
})(jQuery)

//changelog
/*

 //v1.6
 -jquery.autoPosition add options moveWhenLeaderMoved, moveWhenFollowerMoved, UpdateWhenLeaderParentScrolled, UpdateWhenWindowResized
 //determines what kind of events leads to follower being updated!

 //v1.5
 -fix .autoPosition jquery Stack overflow errors whenever window resizes
 //is fixed when added el checking to .on moved.autoPosition to filter out bubbling events...
 //but still commented out $(window).on('resize'... section in eventRegister section
 //MORE efficent; less wasted CPU cycles as $(window).on('resize'... affects EVERY single element that has ever Used .autoPosition
 //use a #Main background div instead and trigger moved.autoPosition on #Main div when $(window).on('resize

 //v1.4
 -fix .autoPosition event bubbling BUG when moved.autoPosition propagating

 */