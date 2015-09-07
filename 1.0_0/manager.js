
//global vars
var __global_vars
var bg = chrome.extension.getBackgroundPage()
var settings
var curWinId
chrome.windows.getCurrent({
	populate : false
}, function(window) {
	curWinId = window.id
	$(document).ready(manager_run_at_ready())
})
var __load

function manager_run_at_ready() {

	//get settings
	var __get_managerSettings
	if (localStorage._managerSettings) {
		settings = bg.parse(localStorage._managerSettings)
	} else {
		settings = new Object()
		settings.splitterLeft = 0.33 * $(window).innerWidth()
		settings.treeColsWidths = new Object()
		settings.treeColsWidths['Name'] = 500
		settings.treeColsWidths['timeLastClosed'] = 100
		settings.treeColsWidths['timeLastModified'] = 100
		settings.treeColsWidths['timeLastOpened'] = 100
		settings.treeColsWidths['NumberOfTabsOpen'] = 100
		settings.treeColsWidths['NumberOfTabsStored'] = 100
		settings.listColsWidths = new Object()
		settings.listColsWidths['Title'] = 500
		settings.listColsWidths['Url'] = 300
		settings.listColsWidths['HostName'] = 100
		settings.listColsWidths['Label'] = 100
		settings.listColsWidths['timeLastClosed'] = 100
		settings.listColsWidths['timeLastModified'] = 100
		settings.listColsWidths['timeLastOpened'] = 100
		settings.listColsOrder = ['Title', 'HostName', 'Url', 'Label', 'timeLastClosed', 'timeLastModified', 'timeLastOpened']
		settings.treeColsOrder = ['Name', 'timeLastClosed', 'timeLastModified', 'timeLastOpened', 'NumberOfTabsOpen', 'NumberOfTabsStored']
		settings.openTabsOrder = 'leftFirst'//leftFirst, rightFirst
		settings.storedTabsOrder = 'latestFirst'//latestFirst, latestLast
		localStorage._managerSettings = bg.stringify(settings)
	}

	var __div3splitter_drag_listener_handler
	if (1) {
		$("#div3splitter").draggable()//init
		$("#div3splitter").draggable("option", "axis", "x")//sets axis
		$("#div3splitter").draggable("option", "opacity", 0.35)//does not work if clone
		$("#div3splitter").draggable("option", "helper", "clone")//possible values =  'original', 'clone'
		//div3splitter on drag
		$("#div3splitter").on("drag", function(event, ui) {
			event.stopPropagation()//important!!!

			//min
			if (ui.offset.left < 50) {
				$("#div3splitter").offset({
					left : 50
				})
			}
			//max
			else if (ui.offset.left > ($(window).width() - 50)) {
				$("#div3splitter").offset({
					left : ($(window).width() - 50)
				})
			} else {
				$("#div3splitter").offset({
					left : ui.offset.left
				})
			}

			$("#div3splitter").trigger('moved.autoPosition', {
				movedBy : "#div3splitter",
				evt : "splitter drag"
			})

			//save left as a setting to localStorage
			settings.splitterLeft = $("#div3splitter").offset().left
			localStorage._managerSettings = bg.stringify(settings)

		})//div3splitter on drag
	}

	//position components
	var __auto_position
	//canvas
	$(window).on('resize', function(evt) {
		$('#main').trigger('moved.autoPosition', {
			movedBy : $(window),
			evt : 'window resize'
		})	//so that window resizes affect the relevent elements
	})
	//main divs
	//div3
	$("#div3").autoPosition({
		my : "top",
		at : "bottom",
		of : "#div2"
	})
	$("#div3").autoPosition({
		my : "bottom",
		at : "top",
		of : "#div4",
		oppositeEdgeBehavior : "staysPut"
	})
	//div4
	$("#div4").autoPosition({
		my : "bottom",
		at : "top",
		of : "#div5",
		offset : {
			y : -1
		}//so that border shows
	})
	//div5
	$("#div5").autoPosition({
		my : "bottom",
		at : "bottom",
		of : "#main"
	})

	//sub divs
	//div3treeContainer
	$("#div3treeContainer").autoPosition({
		my : "left",
		at : "left",
		of : "#div3"
	})

	$("#div3treeContainer").autoPosition({
		my : "right",
		at : "left",
		of : "#div3splitter",
		oppositeEdgeBehavior : "staysPut"
	})

	//div3listContainer
	$("#div3listContainer").autoPosition({
		my : "left",
		at : "right",
		of : "#div3splitter",
		oppositeEdgeBehavior : "staysPut"

	})
	$("#div3listContainer").autoPosition({
		my : "top",
		at : "top",
		of : "#div3"
	})
	$("#div3listContainer").autoPosition({
		my : "right",
		at : "right",
		of : "#div3"
	})

	//populate
	var __populate
	createDisplay_tree_headers()
	createDisplay_list_headers()//before createDisplay_tree_items so that list items from restored winName from settings will show up AFTER the headers
	createDisplay_tree_items()

	//----------------------------------------------------

	//reinstate saved manager gui settings
	var __restorePositionalSettings
	if (1) {
		//splitter
		$("#div3splitter").offset({
			left : settings.splitterLeft
		})
		$("#div3splitter").trigger('moved.autoPosition', {
			movedBy : "#div3splitter",
			evt : "move position saved in localStorage"
		})

		//treeColumns
		for (var j in settings.treeColsOrder) {
			//console.logg('j = ', j, 'width =', settings.treeColsWidths[settings.treeColsOrder[j]])
			$('#div3treeCol' + j + 'Div').width(settings.treeColsWidths[settings.treeColsOrder[j]])
		}
		$('#div3tree').scroll()//triggers positional updates??

		//listColumns
		for (var j in settings.listColsOrder) {
			//console.logg('j = ', j, 'width =', settings.listColsWidths[settings.listColsOrder[j]])
			$('#div3listCol' + j + 'Div').width(settings.listColsWidths[settings.listColsOrder[j]])
		}
		$('#div3list').scroll()
	}

	var __droppableFix_with_mouseover
	if (1) {
		//fix for droppable dropping to elements 'underneath' another element
		//adds a 'mouseover' class to the element directly under the cursor //removes old class from old element
		$('*').live('mouseover', function(evt, ui) {
			evt.stopPropagation()
			//console.logg('mouseover; target = ', evt.target.id, 'evt = ', evt, ' , ui = ', ui)
			$('.mouseover').removeClass('mouseover')
			$(evt.target).addClass('mouseover')
			//console.logg("mousover", evt.target)
			return false
		})
		//does not work when an item is being dragged, the clone is underneath the cursor...
		//change draggable offset... to make this work
	}

	var __listItemsBehaviors
	listen_for_and_handle_list_items_select()
	listen_for_list_item_rename()
	listen_for_list_items_delete()

	var __treeItemsBehaviors
	listen_for_tree_item_delete()
	listen_for_tree_item_rename()

	var __fixNoBadge
	chrome.windows.getCurrent(null, function(window) {
		//bg.updateBadge(window.id)//does not fix no badge after opened tabs Manager from popup

		/*
		 setTimeout(function() {
		 bg.updateBadge(window.id)
		 }, 1000);
		 */

		console.logg("__fixNoBadge, winid = ", window.id)

	})
	//refresh tab on focus
	$(window).on('focus', function() {
		console.logg('window focused');
		location.reload()
	})
}//manager_run_at_ready

//1111111111111111111111111111111111111111111111111

var __tree
function createDisplay_tree_headers() {
	//add tree headers
	var __tree_headers
	for (var j in settings.treeColsOrder) {
		//header
		var li = document.createElement('div')
		li.innerText = settings.treeColsOrder[j]
		li.id = settings.treeColsOrder[j] + 'TreeHeader'
		$(li).addClass('headerClass')
		$(li).addClass('tree')
		$('#div3treeCol' + j + 'Div').append(li)
	}

	//add context menu for tree headers
	/*
	$('.tree.headerClass').contextMenu('context-menu-window-headers', {
	'Context Menu Item 1' : {
	click : function(element) {// element is the jquery obj clicked on when context menu launched
	alert('Menu item 1 clicked');
	},
	klass : "menu-item-1" // a custom css class for this menu item (usable for styling)
	},
	'Context Menu Item 2' : {
	click : function(element) {
	alert('second clicked');
	},
	klass : "second-menu-item"
	}
	})
	*/

	//add draggable to tree headers
	$('.tree.headerClass').draggable({
		appendTo : 'body',
		cursor : "default",
		cursorAt : {
			left : -5
		},
		helper : "clone",
		scroll : false
	})

	//add droppable handler to tree headers
	$('.tree.headerClass').droppable({
		hoverClass : "hover",
		drop : handle_tree_header_drop,
		tolerance : "pointer"
	})
}//createDisplay_tree_headers

function createDisplay_tree_items() {

	var __helper_functions_to_add_tree_items
	function printWinId(winId) {//for open unnamed window
		//fill out the columns
		for (var j in settings.treeColsOrder) {
			if (settings.treeColsOrder[j] == 'Name') {
				var li = document.createElement('div')
				$(li).addClass('tree')
				$(li).addClass('item')
				$(li).addClass('name')
				li.id = winId + 'TreeName'
				if (winId == curWinId) {
					li.innerText = 'unnamed win, id#' + winId + ' [current]'
				} else {
					li.innerText = 'unnamed win, id#' + winId + ' '
				}
				li.winId = winId
				li.winName = null
				$('#div3treeCol' + j + 'Div').append(li)
				$(li).on('click', handle_tree_item_clicked)
				$(li).on('dblclick', handle_tree_item_double_clicked)
				var __restore_last_clicked_winId
				if (winId == settings.lastClickedWinId) {
					$(li).click()
					$('#div3treeContainer').scrollTop($(li).position().top)
				}
			}
			if (settings.treeColsOrder[j] == 'timeLastClosed') {
				var li = document.createElement('div')
				$(li).addClass('tree')
				$(li).addClass('item')
				li.id = winId + 'TreetimeLastClosed'
				li.innerText = bg.UNIXtimeToLocaleString(bg.WinObj_from_winId[winId].timeLastClosed)
				$('#div3treeCol' + j + 'Div').append(li)
			}
			if (settings.treeColsOrder[j] == 'timeLastModified') {
				var li = document.createElement('div')
				$(li).addClass('tree')
				$(li).addClass('item')
				li.id = winId + 'TreetimeLastModified'
				li.innerText = bg.UNIXtimeToLocaleString(bg.WinObj_from_winId[winId].timeLastModified)
				$('#div3treeCol' + j + 'Div').append(li)
			}
			if (settings.treeColsOrder[j] == 'timeLastOpened') {
				var li = document.createElement('div')
				$(li).addClass('tree')
				$(li).addClass('item')
				li.id = winId + 'TreetimeLastOpened'
				li.innerText = bg.UNIXtimeToLocaleString(bg.WinObj_from_winId[winId].timeLastOpened)
				$('#div3treeCol' + j + 'Div').append(li)
			}
			if (settings.treeColsOrder[j] == 'NumberOfTabsOpen') {
				var li = document.createElement('div')
				$(li).addClass('tree')
				$(li).addClass('item')
				li.id = winId + 'TreeNumberOfTabsOpen'
				li.innerText = bg.WinObj_from_winId[winId].TabsOpen.length
				$('#div3treeCol' + j + 'Div').append(li)
			}
			if (settings.treeColsOrder[j] == 'NumberOfTabsStored') {
				var li = document.createElement('div')
				$(li).addClass('tree')
				$(li).addClass('item')
				li.id = winId + 'TreeNumberOfTabsStored'
				li.innerText = bg.WinObj_from_winId[winId].TabsStored.length
				$('#div3treeCol' + j + 'Div').append(li)
			}
		}//loop settings.treeColsOrder)
	}//printWinId

	function printWinName(winName) {
		//fill out the columns
		for (var j in settings.treeColsOrder) {
			if (settings.treeColsOrder[j] == 'Name') {
				var li = document.createElement('div')
				$(li).addClass('tree')
				$(li).addClass('item')
				$(li).addClass('name')
				li.id = winName + 'TreeName'

				if (bg.winId_from_winName[winName]) {

					li.winId = bg.winId_from_winName[winName]
					if (li.winId == curWinId) {
						li.innerText = winName + ' [current]'
					} else {
						li.innerText = winName + ' '
					}
				} else {
					li.innerText = winName
					li.winId = null
				}
				li.winName = winName
				$('#div3treeCol' + j + 'Div').append(li)
				$(li).on('click', handle_tree_item_clicked)
				$(li).on('dblclick', handle_tree_item_double_clicked)
				var __restore_last_clicked_winName
				if (winName == settings.lastClickedWinName) {
					$(li).click()
					$('#div3treeContainer').scrollTop($(li).position().top)	//scroll to element
				}
			}
			if (settings.treeColsOrder[j] == 'timeLastClosed') {
				var li = document.createElement('div')
				$(li).addClass('tree')
				$(li).addClass('item')
				li.id = winName + 'TreetimeLastClosed'
				li.innerText = bg.UNIXtimeToLocaleString(bg.WinInfoObj_from_winName[winName].timeLastClosed)
				$('#div3treeCol' + j + 'Div').append(li)
			}
			if (settings.treeColsOrder[j] == 'timeLastModified') {
				var li = document.createElement('div')
				$(li).addClass('tree')
				$(li).addClass('item')
				li.id = winName + 'TreetimeLastModified'
				li.innerText = bg.UNIXtimeToLocaleString(bg.WinInfoObj_from_winName[winName].timeLastModified)
				$('#div3treeCol' + j + 'Div').append(li)
			}
			if (settings.treeColsOrder[j] == 'timeLastOpened') {
				var li = document.createElement('div')
				$(li).addClass('tree')
				$(li).addClass('item')
				li.id = winName + 'TreetimeLastOpened'
				li.innerText = bg.UNIXtimeToLocaleString(bg.WinInfoObj_from_winName[winName].timeLastOpened)
				$('#div3treeCol' + j + 'Div').append(li)
			}
			if (settings.treeColsOrder[j] == 'NumberOfTabsOpen') {
				var li = document.createElement('div')
				$(li).addClass('tree')
				$(li).addClass('item')
				li.id = winName + 'TreeNumberOfTabsOpen'
				li.innerText = bg.WinInfoObj_from_winName[winName].numberOfTabsOpen
				$('#div3treeCol' + j + 'Div').append(li)
			}
			if (settings.treeColsOrder[j] == 'NumberOfTabsStored') {
				var li = document.createElement('div')
				$(li).addClass('tree')
				$(li).addClass('item')
				li.id = winName + 'TreeNumberOfTabsStored'
				li.innerText = bg.WinInfoObj_from_winName[winName].numberOfTabsStored
				$('#div3treeCol' + j + 'Div').append(li)
			}
		}//loop settings.treeColsOrder
	}//printWinName

	var __populate
	/*
	//open unnamed and named windows
	var openWinIds = bg.WinObj_from_winId
	for (var i in openWinIds) {
	var winId = i
	if (bg.winName_from_winId[winId]) {
	//open named window
	printWinName(bg.winName_from_winId[winId])//winId set to null
	$('.tree.item.name').last().prop('winId', winId)
	} else {
	//open unnamed window
	printWinId(winId)	//winName set to null
	}
	}
	//will NOT display correct order if winName is sorted, will always display via winId order...
	*/
	//open unnamed windows
	var openWinIds = bg.WinObj_from_winId
	for (var i in openWinIds) {
		var winId = i
		if (bg.winName_from_winId[winId]) {
			//open named window
			//printWinName(bg.winName_from_winId[winId])//winId set to null
			//$('.tree.item.name').last().prop('winId', winId)
		} else {
			//open unnamed window
			printWinId(winId)	//winName set to null
		}
	}
	//open names windows
	var openWinNames = new Array()
	for (var i in bg.WinInfoObj_from_winName._orderOfNames) {
		var winName = bg.WinInfoObj_from_winName._orderOfNames[i]
		if (bg.winId_from_winName[winName] != undefined) {//exits as open window, has winId
			openWinNames.push(winName)
		}
	}
	for (var i in openWinNames) {
		printWinName(openWinNames[i])
		$('.tree.item.name').last().prop('winId', bg.winId_from_winName[openWinNames[i]])
	}
	$('.tree.item').addClass('winOpen')//highlight all opened window items

	//closed named windows
	var names = bg.WinInfoObj_from_winName._orderOfNames
	for (var i in names) {
		if (bg.winId_from_winName[names[i]]) {
			//open named window...
			//skip, should already be handled above
		} else {
			//closed named window
			printWinName(names[i]) //winId set to null
		}
	}
	$('.tree.item').not('.winOpen').addClass('winClosed')

	//add col resizers to tree cols
	//resize heights to be the height of all the tree items + header height
	var __col_resizers
	if (1) {
		//after items population in case the column width is auto
		for (var j in settings.treeColsOrder) {
			//resizer
			var resizer = document.createElement('div')
			resizer.id = settings.treeColsOrder[j] + 'TreeResizer'
			$(resizer).addClass('tree')
			$(resizer).addClass('resizerClass')
			$(resizer).css('position', 'absolute')
			$(resizer).css('height', $('#div3treeCol' + j + 'Div').css('height'))
			$('#div3treeCol' + j + 'Div').append(resizer)

			//position onto column
			/*
			 $(resizer).position({
			 my : "right top",
			 at : "right top",
			 of : '#div3treeCol' + j + 'Div'
			 })
			 */
			$(resizer).autoPosition({//can be replaced with .position()
				my : "left top",
				at : "right top",
				of : '#div3treeCol' + j + 'Div'
			})

			//resizer //drag listener/handler
			$(resizer).draggable()//init
			$(resizer).draggable("option", "axis", "x")//sets axis
			$(resizer).draggable("option", "opacity", 0.35)//does not work if clone
			$(resizer).draggable("option", "helper", "clone")//possible values =  'original', 'clone'
			$(resizer).on("drag", function(event, ui) {//inside createDisplay_tree_items
				console.logg("drag, evt = ", event)
				var resizer = event.target//important

				//update resizer position
				$(resizer).offset({
					left : ui.offset.left
				})

				//update col
				var width = ui.offset.left - $(resizer).parent().offset().left
				$(resizer).parent().width(width)

				//update settings
				var n = $(resizer).parent().prop('id').split('div3treeCol')[1].split('Div')[0]
				settings.treeColsWidths[settings.treeColsOrder[n]] = width
				localStorage._managerSettings = bg.stringify(settings)

				//trigger moved
				//$(resizer).parent().trigger('moved.autoPosition')	//also works
				$(resizer).parent().trigger('moved.autoPosition', {
					movedBy : $(resizer),
					evt : 'resizer drag'
				})

				//update all resizer positions
				$('#div3tree').scroll()

			})
		}//loop settings.treeColsOrder

	}//col resizers

	//context menu for tree item names
	var __contextMenu

	$('.tree.item.name').contextMenu('tree name context menu', {
		//context menu item 1
		'Rename [F2/Enter]' : {
			click : function(element) {// element is the jquery obj clicked on when context menu launched
				//console.logg('Context Menu for Tree Item Name Rename clicked; element =', element)
				$('.lastClicked').removeClass('lastClicked')
				$(element).addClass('lastClicked')
				handle_tree_item_rename_start()
			},
			class : "whatever_doesnot_work_does_nothing" // a custom css class for this menu item (usable for styling)
		},
		//context menu item 2
		'Sort by Alphabet A-Z' : {
			click : function(element) {
				sort_winName_by_AZ();
			},
			class : "second-menu-item"
		},
		//context menu item 3
		'Sort by Time Last Modified (default)' : {
			click : function(element) {
				sort_winName_by_timeLastModified();
			},
			class : "third-menu-item"
		},
		//context menu item 4
		'Sort by Time Last Closed' : {
			click : function(element) {
				sort_winName_by_timeLastClosed();
			},
			class : "fourth-menu-item"
		},
		//context menu item 5
		'Sort by Time Last Opened' : {
			click : function(element) {
				sort_winName_by_timeLastOpened();
			},
			class : "fifth-menu-item"
		},
		//context menu item 6
		'Sort by Number of Tabs Open' : {
			click : function(element) {
				sort_winName_by_numberOfTabsOpen()
			},
			class : "sixth-menu-item"
		},
		//context menu item 7
		'Sort by Number of Tabs Stored (Not Open)' : {
			click : function(element) {
				sort_winName_by_numberOfTabsStored()
			},
			class : "seventh-menu-item"
		}
	})

	//draggable
	var __draggable
	$('.tree.item.name').draggable({
		appendTo : 'body',
		cursor : "default",
		cursorAt : {
			left : -5
		},
		helper : "clone",
		scroll : false
	})

	//droppable
	var __droppable
	$('.tree.item.name').droppable({
		hoverClass : "hover",
		drop : handle_tree_item_drop,
		tolerance : "pointer"
	})

}//createDisplay_tree_items

function sort_winName_by_AZ() {

	if (bg.WinInfoObj_from_winName._orderOfNames[0] > bg.WinInfoObj_from_winName._orderOfNames[bg.WinInfoObj_from_winName._orderOfNames.length - 1]) {
		bg.WinInfoObj_from_winName._orderOfNames.sort()
	} else {
		bg.WinInfoObj_from_winName._orderOfNames.sort()
		bg.WinInfoObj_from_winName._orderOfNames.reverse()
	}
	localStorage.WinInfoObj_from_winName = bg.stringify(bg.WinInfoObj_from_winName)
	location.reload()
}

function sort_winName_by_timeLastModified() {
	//from http://stackoverflow.com/questions/1069666/sorting-javascript-object-by-property-value
	var sortable = new Array()
	for (var i in bg.WinInfoObj_from_winName._orderOfNames) {
		var winName = bg.WinInfoObj_from_winName._orderOfNames[i]
		if (bg.WinInfoObj_from_winName[winName].timeLastModified == undefined) {
			bg.WinInfoObj_from_winName[winName].timeLastModified = 0
		}
		sortable.push([winName, bg.WinInfoObj_from_winName[winName].timeLastModified])
	}
	//sort, auto reverse
	if (sortable[0][1] > sortable[sortable.length-1][1]) {
		sortable.sort(function(a, b) {
			return a[1] - b[1]
		})
	} else {
		sortable.sort(function(a, b) {
			return b[1] - a[1]
		})
	}

	//debug
	/*
	var results = new Array()
	for (var i in sortable) {
	results.push(sortable[i][0])
	}
	console.logg(sortable)
	console.logg(results)
	*/

	//update bg
	for (var i in bg.WinInfoObj_from_winName._orderOfNames) {
		bg.WinInfoObj_from_winName._orderOfNames[i] = sortable[i][0]
	}

	//update localStorage
	localStorage.WinInfoObj_from_winName = bg.stringify(bg.WinInfoObj_from_winName)

	//reload
	location.reload()
}

function sort_winName_by_timeLastClosed() {
	//from http://stackoverflow.com/questions/1069666/sorting-javascript-object-by-property-value
	var sortable = new Array()
	for (var i in bg.WinInfoObj_from_winName._orderOfNames) {
		var winName = bg.WinInfoObj_from_winName._orderOfNames[i]
		if (bg.WinInfoObj_from_winName[winName].timeLastClosed == undefined) {
			bg.WinInfoObj_from_winName[winName].timeLastClosed = 0
		}
		sortable.push([winName, bg.WinInfoObj_from_winName[winName].timeLastClosed])
	}
	//sort, auto reverse
	if (sortable[0][1] > sortable[sortable.length-1][1]) {
		sortable.sort(function(a, b) {
			return a[1] - b[1]
		})
	} else {
		sortable.sort(function(a, b) {
			return b[1] - a[1]
		})
	}

	//debug
	/*
	var results = new Array()
	for (var i in sortable) {
	results.push(sortable[i][0])
	}
	console.logg(sortable)
	console.logg(results)
	*/

	//update bg
	for (var i in bg.WinInfoObj_from_winName._orderOfNames) {
		bg.WinInfoObj_from_winName._orderOfNames[i] = sortable[i][0]
	}

	//update localStorage
	localStorage.WinInfoObj_from_winName = bg.stringify(bg.WinInfoObj_from_winName)

	//reload
	location.reload()
}

function sort_winName_by_timeLastOpened() {
	//from http://stackoverflow.com/questions/1069666/sorting-javascript-object-by-property-value
	var sortable = new Array()
	for (var i in bg.WinInfoObj_from_winName._orderOfNames) {
		var winName = bg.WinInfoObj_from_winName._orderOfNames[i]
		if (bg.WinInfoObj_from_winName[winName].timeLastOpened == undefined) {
			bg.WinInfoObj_from_winName[winName].timeLastOpened = 0
		}
		sortable.push([winName, bg.WinInfoObj_from_winName[winName].timeLastOpened])
	}
	//sort, auto reverse
	if (sortable[0][1] > sortable[sortable.length-1][1]) {
		sortable.sort(function(a, b) {
			return a[1] - b[1]
		})
	} else {
		sortable.sort(function(a, b) {
			return b[1] - a[1]
		})
	}

	//debug
	/*
	var results = new Array()
	for (var i in sortable) {
	results.push(sortable[i][0])
	}
	console.logg(sortable)
	console.logg(results)
	*/

	//update bg
	for (var i in bg.WinInfoObj_from_winName._orderOfNames) {
		bg.WinInfoObj_from_winName._orderOfNames[i] = sortable[i][0]
	}

	//update localStorage
	localStorage.WinInfoObj_from_winName = bg.stringify(bg.WinInfoObj_from_winName)

	//reload
	location.reload()
}

function sort_winName_by_numberOfTabsOpen() {
	//from http://stackoverflow.com/questions/1069666/sorting-javascript-object-by-property-value
	var sortable = new Array()
	for (var i in bg.WinInfoObj_from_winName._orderOfNames) {
		var winName = bg.WinInfoObj_from_winName._orderOfNames[i]
		if (bg.WinInfoObj_from_winName[winName].numberOfTabsOpen == undefined) {
			bg.WinInfoObj_from_winName[winName].numberOfTabsOpen = 0
		}
		sortable.push([winName, bg.WinInfoObj_from_winName[winName].numberOfTabsOpen])
	}
	//sort, auto reverse
	if (sortable[0][1] > sortable[sortable.length-1][1]) {
		sortable.sort(function(a, b) {
			return a[1] - b[1]
		})
	} else {
		sortable.sort(function(a, b) {
			return b[1] - a[1]
		})
	}

	//debug
	/*
	var results = new Array()
	for (var i in sortable) {
	results.push(sortable[i][0])
	}
	console.logg(sortable)
	console.logg(results)
	*/

	//update bg
	for (var i in bg.WinInfoObj_from_winName._orderOfNames) {
		bg.WinInfoObj_from_winName._orderOfNames[i] = sortable[i][0]
	}

	//update localStorage
	localStorage.WinInfoObj_from_winName = bg.stringify(bg.WinInfoObj_from_winName)

	//reload
	location.reload()
}

function sort_winName_by_numberOfTabsStored() {
	//from http://stackoverflow.com/questions/1069666/sorting-javascript-object-by-property-value
	var sortable = new Array()
	for (var i in bg.WinInfoObj_from_winName._orderOfNames) {
		var winName = bg.WinInfoObj_from_winName._orderOfNames[i]
		if (bg.WinInfoObj_from_winName[winName].numberOfTabsStored == undefined) {
			bg.WinInfoObj_from_winName[winName].numberOfTabsStored = 0
		}
		sortable.push([winName, bg.WinInfoObj_from_winName[winName].numberOfTabsStored])
	}
	//sort, auto reverse
	if (sortable[0][1] > sortable[sortable.length-1][1]) {
		sortable.sort(function(a, b) {
			return a[1] - b[1]
		})
	} else {
		sortable.sort(function(a, b) {
			return b[1] - a[1]
		})
	}

	//debug
	/*
	var results = new Array()
	for (var i in sortable) {
	results.push(sortable[i][0])
	}
	console.logg(sortable)
	console.logg(results)
	*/

	//update bg
	for (var i in bg.WinInfoObj_from_winName._orderOfNames) {
		bg.WinInfoObj_from_winName._orderOfNames[i] = sortable[i][0]
	}

	//update localStorage
	localStorage.WinInfoObj_from_winName = bg.stringify(bg.WinInfoObj_from_winName)

	//reload
	location.reload()
}

function handle_tree_item_clicked(evt) {

	//check status of item	//reload if status changed
	var winId = evt.target.winId
	var winName = evt.target.winName
	if ((!winId && winName && bg.winId_from_winName[winName]) || (winId && winName && !bg.winId_from_winName[winName]) || (!winName && winId && bg.winName_from_winId[winId]) || (winName && winId && !bg.winName_from_winId[winId])) {
		//target element does not match bg var status
		//html is outdated
		location.reload()
	}

	//mark	//mark selected tree item
	$('.item.folderOpen').removeClass('folderOpen')
	$(evt.target).addClass('folderOpen')

	//mark //lastClicked element
	$(".lastClicked").removeClass("lastClicked")
	$(evt.target).addClass("lastClicked")

	//data	//remembers last clicked folder item
	if (evt.srcElement && evt.srcElement.winName) {
		console.logg('handle_tree_item_clicked; evt = ', evt, ' srcElement = ', evt.srcElement, ' winName =', evt.srcElement.winName)
		settings.lastClickedWinName = evt.srcElement.winName
		settings.lastClickedWinId = null
		localStorage._managerSettings = bg.stringify(settings)
	} else if (evt.srcElement && evt.srcElement.winId) {
		console.logg('handle_tree_item_clicked; evt = ', evt, ' srcElement = ', evt.srcElement, ' winId =', evt.srcElement.winId)
		settings.lastClickedWinName = null
		settings.lastClickedWinId = evt.srcElement.winId
		localStorage._managerSettings = bg.stringify(settings)
	}

	//display list
	createDisplay_list_items(evt)

}//handle_tree_item_clicked

function handle_tree_item_double_clicked(evt) {//focus to window if window is open; open window if window is closed
	console.logg('handle_tree_item_double_clicked; evt.target.winId = ', evt.target.winId, ' , evt.target.winName = ', evt.target.winName)

	//check status of item	//reload if status changed
	var winId = evt.target.winId
	var winName = evt.target.winName
	if ((!winId && winName && bg.winId_from_winName[winName]) || (winId && winName && !bg.winId_from_winName[winName]) || (!winName && winId && bg.winName_from_winId[winId]) || (winName && winId && !bg.winName_from_winId[winId])) {
		//target element does not match bg var status
		//html is outdated
		location.reload()
	}

	var __CASES
	if (winId) {
		//open window

		if (winName) {
			//A //open named window	//focus to open window

		} else {
			//B //open unnamed window

		}

		//focus to open window
		var winId = evt.target.winId * 1
		chrome.windows.update(winId, {
			focused : true
		})

	} else {

		//C //closed named window

		//open the closed named window
		bg.openWindow(winName)

		//reload
		//location.reload()	//will reset everything, make all following code useless
		/*
		chrome.tabs.getCurrent(function(tab) {
		setTimeout(function() {
		chrome.tabs.update(tab.id, {
		url : tab.url
		}, function(tab2) {
		})
		}, 3000)

		})*/	//works

		setTimeout(function() {
			location.reload()
		}, 3000)

	}//C //closed named window

}//end handle_tree_item_double_clicked

function listen_for_tree_item_delete() {
	var __listeners
	$(window).on("keydown", function(evt) {//inside listen_for_tree_item_delete
		//console.logg("listen_for_tree_item_delete; keydown; evt = ", evt)

		//Del Key
		if (evt.keyCode == 46) {
			//console.logg('	del keydown')

			//exit if there are ANY selected list items	//should be handled in listItem...
			if ($('.selected').length > 0) {
				return
			}

			//exit if cursor is not inside tree	//can skip
			/*
			 if ($('.mouseover').hasClass('tree') == false) {
			 //exit if the focus is not inside tree
			 return
			 }
			 */

			if ($('.lastClicked').hasClass('tree') == false) {
				//exit if lastClicked is NOT a tree item
				return
			}

			//else	//passed conditions for handle_tree_item_delete
			handle_tree_item_delete()
		}//del key pressed

	})
}//listen_for_tree_item_delete

function handle_tree_item_delete() {

	var winId = $('.folderOpen').prop('winId') * 1
	var winName = $('.folderOpen').prop('winName')

	//check what type of tree item it is
	//A //OPEN Named window
	//B //OPEN UNNamed window
	//C	//CLOSED Named window
	var CASE
	if (winId && winName) {
		CASE = 'A'
	} else if (winId && !winName) {
		CASE = 'B'
	} else if (!winId && winName) {
		CASE = 'C'
	}

	if (CASE == 'A') {
		var __A__open_named_window
		//turn open named window into open UNNamed window
		console.logg('handle_tree_item_delete; A  OPEN Named window')

		//confirm
		if (confirm('This will Delete the Data of the saved window \nAll stored/unopen tabs will be deleted\nbut the window will be left open. \n\nContinue?') == false) {
			return
		}

		//delete
		bg.deleteNamedWindow(winName)

		//will need to update, rescan unnamed window and update data...
		//re-update window data
		chrome.windows.get(winId, {
			populate : true
		}, function(window) {
			bg.windowCreated(window)
			for (var i in window.tabs) {
				bg.tabCreated(window.tabs[i])
			}
		})
	} else if (CASE == 'B') {
		var __B__open_unnamed_window
		console.logg('handle_tree_item_delete; B  OPEN UNNamed window')

		//confirm
		if (confirm('This will Close the window\n Unrecoverable.\n\nContinue?') == false) {
			return
		}

		//close open window
		chrome.windows.remove(winId, function() {
		})
	} else if (CASE == 'C') {
		var __C__closed_named_window
		console.logg('handle_tree_item_delete; C  CLOSED Named window')

		//confirm
		if (confirm('This will Delete the data of the saved window!\nUnrecoverable!\n\nContinue?') == false) {
			return
		}

		//delete saved data, but do not close window
		bg.deleteNamedWindow(winName)

	}

	//refresh whole manager/explorer page
	//need to give time for stuff to be done by browser
	//need to give time for tab to be closed and then trigger tabClosed event to delete the tab...
	setTimeout(function() {
		location.reload()
	}, 1000);

}//handle_tree_item_delete

function listen_for_tree_item_rename() {

	var __listeners
	$(window).on("keydown", function(evt) {//inside listen_for_tree_item_rename
		//console.logg("listen_for_tree_item_rename; keydown; evt = ", evt)

		//Enter Key and F2 key
		if (evt.keyCode == 13 || evt.keyCode == 113) {
			//console.logg('listen_for_tree_item_rename; enter or f2 keydown')

			//filter	//list item last clicked
			if ($('.lastClicked').hasClass('list') == true) {
				return
			}

			//filter	//not tree item last clicked
			if ($('.lastClicked').hasClass('tree') == false) {
				//exit if lastClicked is NOT a tree item
				return
			}

			//filter //list item(s) selected
			if ($('.selected').length > 0) {
				return
			}

			//filter	//tree item already in edit	//end edit
			if ($('.treeItemInEdit').hasClass('treeItemInEdit')) {//editing
				//end
				$('.treeEditInput').trigger('blur')
				return
			}

			//start or end
			try {
				if ($('.lastClicked').hasClass('tree') && $('.lastClicked').hasClass('name')) {
					//start
					handle_tree_item_rename_start()
				}

			} catch (err) {
				console.logg('listen_for_tree_item_rename; start or end err', err)
			}//catch

		}//Enter key || F2 key pressed

		//Esc key pressed	//cancel edit
		if (evt.keyCode == 27) {
			handle_tree_item_rename_cancel(evt)
		}

	}//window keydown handler
	)//window keydown on

	//blur bug: clicking on other elements does NOT trigger blur...
	//blur bug workaround
	$('*').live('click', function(evt) {//use mouseenter instead of click?
		//console.logg('listen_for_tree_item_rename ANY blur; evt', evt)
		if (evt.target.parentNode.parentNode.className == 'context-menu') {
			//console.logg('listen_for_tree_item_rename ANY element click blur SKIPPED; context-menu item clicked; evt.target.parentNode.parentNode', evt.target.parentNode.parentNode)
			return
		}

		evt.stopPropagation()

		$('.treeEditInput').trigger('blur')
	})
}//listen_for_tree_item_rename

function handle_tree_item_rename_start() {
	console.logg('handle_tree_item_rename_start')
	//return

	//item to edit
	//get last clicked item that is NOT inEdit as target for editing
	//works with $('.list.item.title, .list.item.label', .tree.item.name) because .lastClicked is only appended to these classes
	var treeItemInEdit = $(".lastClicked").not(".treeItemInEdit")[0]
	$(treeItemInEdit).addClass('treeItemInEdit')
	if (!treeItemInEdit) {//exit if no item
		return
	}

	//backup
	treeItemInEdit.oldInnerText = treeItemInEdit.innerText//store old value
	treeItemInEdit.oldWinName = treeItemInEdit.winName//store old value

	//input box
	var __input_box
	//replace content of with editable input box
	var treeEditInput = document.createElement('input')
	$(treeEditInput).addClass('treeEditInput')
	$(treeEditInput).height($(".lastClicked").height())
	treeEditInput.size = 5
	if (treeItemInEdit.winName == null) {
		treeEditInput.value = 'name'
	} else {
		treeEditInput.value = treeItemInEdit.winName//copy winNme to input
	}
	var __edit_ends_on_blur
	function treeEditInputBlurred(evt) {
		console.logg('treeEditInputBlurred; evt=', evt)
		handle_tree_item_rename_end(evt)
	}


	$(treeEditInput).on('blur', treeEditInputBlurred)

	//append
	treeItemInEdit.innerText = ""//blank it so that the input box will take up space of the original text
	treeItemInEdit.appendChild(treeEditInput)
	treeEditInput.focus()

}//handle_tree_item_rename_start

function handle_tree_item_rename_end(evt) {
	console.logg('handle_tree_item_rename_end')
	//return
	evt.stopPropagation()//?

	try {//suppressed error caused by deleting input node

		//shorthand
		var treeEditInput = $('.treeEditInput')[0]
		console.logg('handle_tree_item_rename_end; treeEditInput = ', treeEditInput)
		if (!treeEditInput) {//exit if input is already removed
			//return
		}
		var treeItemInEdit = $('.treeItemInEdit')[0]
		console.logg('handle_tree_item_rename_end; treeItemInEdit = ', treeItemInEdit)
		if (!treeItemInEdit) {//exit if inEdit status is already removed
			//return
		}
		var oldWinName = treeItemInEdit.oldWinName
		console.logg('handle_tree_item_rename_end; oldWinName = ', oldWinName)
		var oldInnerText = treeItemInEdit.oldInnerText
		var newWinName = treeEditInput.value
		console.logg('handle_tree_item_rename_end; newWinName = ', newWinName)

		//editing done
		//remove input
		$('.treeEditInput').remove()//will NOT trigger blur again
		//$('.treeEditInput').removeClass('treeEditInput')
		//remove in edit status
		$(".treeItemInEdit").removeClass("treeItemInEdit")

		//if empty OR same
		//reset page data
		if (newWinName == "" || newWinName == oldWinName) {
			treeItemInEdit.innerText = oldInnerText
			treeItemInEdit.winName = oldWinName
			return
		}

		//newName confirmed
		//update data
		//
		//

		//manager/explorer settings data
		settings.lastClickedWinName = newWinName
		settings.lastClickedWinId = treeItemInEdit.winId
		localStorage._managerSettings = bg.stringify(settings)

		//bg and localStorage data	//case checking
		var CASE
		//A	//open named window
		//B //open unnamed window
		//C //closed named window
		if ($(treeItemInEdit).prop('winId') != null && $(treeItemInEdit).prop('winName') != null) {
			CASE = 'A'
		} else if ($(treeItemInEdit).prop('winId') != null && $(treeItemInEdit).prop('winName') == null) {
			CASE = 'B'
		} else if ($(treeItemInEdit).prop('winId') == null && $(treeItemInEdit).prop('winName') != null) {
			CASE = 'C'
		}
		console.logg('handle_tree_item_rename_end; CASE = ', CASE)

		//page data
		treeItemInEdit.innerText = newWinName//will erase input box	//will trigger blur if input is NOT removed first; blur will trigger handle_tree_item_rename_end again...
		treeItemInEdit.winName = newWinName//set after case checking

		//bg and localStorage data
		if (CASE == 'A') {//open named window
			console.logg('A')

			var data_1_WinObj_from_winId//no change
			var data_2_TabObj_from_tabId//ignore
			var data_3_winId_from_tabId//ignore

			var data_4_WinInfoObj_from_winName
			var indexOfOldWinName = bg.WinInfoObj_from_winName._orderOfNames.indexOf(oldWinName)
			bg.WinInfoObj_from_winName._orderOfNames.splice(indexOfOldWinName, 1, newWinName)
			bg.WinInfoObj_from_winName[newWinName] = bg.WinInfoObj_from_winName[oldWinName]
			delete bg.WinInfoObj_from_winName[oldWinName]

			var data_5_winId_from_winName
			bg.winId_from_winName[newWinName] = bg.winId_from_winName[oldWinName]
			delete bg.winId_from_winName[oldWinName]

			var data_6_winName_from_winId
			var winId = bg.winId_from_winName[newWinName]
			bg.winName_from_winId[winId] = newWinName

			var data_7_localStorage
			localStorage[newWinName] = bg.stringify(bg.WinObj_from_winId[winId])
			delete localStorage[oldWinName]
			//localStorage['WinInfoObj_from_winName'] = bg.stringify(bg.WinInfoObj_from_winName)
			bg.update_localStorage('WinInfoObj_from_winName')

		} else if (CASE == 'B') {//open unnamed window
			console.logg('B')

			//save unnamed window
			var winId = $(treeItemInEdit).prop('winId') * 1
			console.logg('winId', winId, 'newWinName', newWinName)
			bg.saveWindowWithLocalStorage(winId, newWinName)

		} else if (CASE == 'C') {//closed named window
			console.logg('C')

			var data_1_WinObj_from_winId//unchanged
			var data_2_TabObj_from_tabId
			var data_3_winId_from_tabId
			var data_4_WinInfoObj_from_winName
			var indexOfOldWinName = bg.WinInfoObj_from_winName._orderOfNames.indexOf(oldWinName)
			bg.WinInfoObj_from_winName._orderOfNames.splice(indexOfOldWinName, 1, newWinName)
			bg.WinInfoObj_from_winName[newWinName] = bg.WinInfoObj_from_winName[oldWinName]
			delete bg.WinInfoObj_from_winName[oldWinName]
			var data_5_winId_from_winName
			//no winId
			//bg.winId_from_winName[newWinName] = bg.winId_from_winName[oldWinName]
			//delete bg.winId_from_winName[oldWinName]
			var data_6_winName_from_winId
			//no winId
			//var winId = bg.winId_from_winName[newWinName]
			//bg.winName_from_winId[winId] = newWinName
			var data_7_localStorage
			localStorage[newWinName] = localStorage[oldWinName]
			delete localStorage[oldWinName]
			//localStorage['WinInfoObj_from_winName'] = bg.stringify(bg.WinInfoObj_from_winName)
			bg.update_localStorage('WinInfoObj_from_winName')

		}
		//end CASE C

	} catch(err) {
		console.logg("handle_tree_item_rename_end; err = ", err)
	}

	//location.reload()
}//handle_tree_item_rename_end

function handle_tree_item_rename_cancel(evt) {
	console.logg('handle_tree_item_rename_cancel')
	//return
	evt.stopPropagation()//?

	try {//suppressed error caused by deleting input node

		//shorthand
		var treeEditInput = $('.treeEditInput')[0]
		console.logg('handle_tree_item_rename_cancel; treeEditInput = ', treeEditInput)
		var treeItemInEdit = $('.treeItemInEdit')[0]
		console.logg('handle_tree_item_rename_cancel; treeItemInEdit = ', treeItemInEdit)
		var oldWinName = treeItemInEdit.temp
		console.logg('handle_tree_item_rename_end; oldWinName = ', oldWinName)
		var newWinName = treeEditInput.value
		console.logg('handle_tree_item_rename_end; newWinName = ', newWinName)

		//editing done
		//remove input
		$('.treeEditInput').remove()//will NOT trigger blur again
		//$('.treeEditInput').removeClass('treeEditInput')
		//remove in edit status
		$(".treeItemInEdit").removeClass("treeItemInEdit")

		//restore
		treeItemInEdit.innerText = treeItemInEdit.oldInnerText
		treeItemInEdit.winName = treeItemInEdit.oldWinName
	} catch(err) {
		console.logg("handle_tree_item_rename_end; err = ", err)
	}

	//location.reload()
}//handle_tree_item_rename_cancel

var __list
function createDisplay_list_headers() {

	//add list headers
	for (var j in settings.listColsOrder) {
		//header
		var li = document.createElement('div')
		li.innerText = settings.listColsOrder[j]
		li.id = settings.listColsOrder[j] + 'ListHeader'
		$(li).addClass('list')
		$(li).addClass('headerClass')
		$('#div3listCol' + j + 'Div').append(li)
	}

	//context menu for list item headers
	$('.list.headerClass').contextMenu('context-menu-tab-headers', {
		'Context Menu Item 1' : {
			click : function(element) {// element is the jquery obj clicked on when context menu launched
				alert('tab 1 clicked');
			},
			klass : "menu-item-1" // a custom css class for this menu item (usable for styling)
		},
		'Context Menu Item 2' : {
			click : function(element) {
				alert('tab 2 clicked');
			},
			klass : "second-menu-item"
		}
	})

	//draggable
	$('.list.headerClass').draggable({
		appendTo : 'body',
		cursor : "default",
		cursorAt : {
			left : -5
		},
		helper : "clone",
		scroll : false
	})

	//droppable
	$('.list.headerClass').droppable({
		hoverClass : "hover",
		drop : handle_list_header_drop,
		tolerance : "pointer"
	})

}//createDisplay_list_headers

var selectedClosedWinObj//bg var to store a closed win's data

function createDisplay_list_items(evt) {//where evt.target is tree item clicked
	//debug
	//console.logg("createDisplay_list_items; evt = ", evt, ' , name = ', evt.target.innerText)

	//data //get Win
	var Win
	if (evt.target.winId != null) {
		//opened window; named OR unnamed
		Win = bg.WinObj_from_winId[evt.target.winId]
	} else {
		//closed window; named
		selectedClosedWinObj = bg.parse(localStorage[evt.target.winName])
		Win = selectedClosedWinObj
	}

	console.logg("createDisplay_list_items; Win = ", Win, 'evt = ', evt, 'evt.target=', evt.target, 'evt.target.winId=', evt.target.winId)

	//display //remove all existing list els
	$('.list.item').remove()

	//display //TabsOpen
	var __TabsOpen
	var Tabs = Win.TabsOpen
	function newOpenListItem(Tabs, i) {
		//fill out the columns
		for (var j in settings.listColsOrder) {
			if (settings.listColsOrder[j] == 'Title') {
				var li = document.createElement('div')
				$(li).addClass('list')
				$(li).addClass('item')
				$(li).addClass('open')
				$(li).addClass('title')
				li.timeLastClosed = Tabs[i].timeLastClosed * 1
				li.timeLastModified = Tabs[i].timeLastModified * 1
				li.timeLastOpened = Tabs[i].timeLastOpened * 1
				//li.id = Tabs[i].id //see tabId
				li.innerText = Tabs[i].title
				if (li.innerText == '' || Tabs[i].title == '') {
					li.innerText = ' - '
				}
				li.label = Tabs[i].label
				li.openOrStored = 'open'
				li.TabOpen = true
				li.tabIndex = i
				li.tabId = Tabs[i].id
				li.title = Tabs[i].title
				if (li.title == '') {
					li.title = '_'
				}
				li.url = Tabs[i].url
				li.winId = evt.target.winId
				li.winName = evt.target.winName
				$('#div3listCol' + j + 'Div').append(li)
				//on double click listener
				$(li).on('dblclick', handle_list_item_double_clicked)
			}
			if (settings.listColsOrder[j] == 'Url') {
				var li = document.createElement('div')
				$(li).addClass('list')
				$(li).addClass('item')
				$(li).addClass('open')
				li.innerText = Tabs[i].url
				li.TabOpen = true
				li.tabIndex = i
				$('#div3listCol' + j + 'Div').append(li)
			}
			if (settings.listColsOrder[j] == 'HostName') {
				var li = document.createElement('div')
				$(li).addClass('list')
				$(li).addClass('item')
				$(li).addClass('open')
				li.innerText = getHostname(Tabs[i].url)
				li.TabOpen = true
				li.tabIndex = i
				$('#div3listCol' + j + 'Div').append(li)
			}
			if (settings.listColsOrder[j] == 'Label') {
				var li = document.createElement('div')
				$(li).addClass('list')
				$(li).addClass('item')
				$(li).addClass('open')
				$(li).addClass('label')
				var text = Tabs[i].label
				if (text == '') {
					text = 'none'
				}
				li.innerText = text
				li.TabOpen = true
				li.tabIndex = i
				$('#div3listCol' + j + 'Div').append(li)
			}
			if (settings.listColsOrder[j] == 'timeLastClosed') {
				var li = document.createElement('div')
				$(li).addClass('list')
				$(li).addClass('item')
				$(li).addClass('open')
				li.innerText = bg.UNIXtimeToLocaleString(Tabs[i].timeLastClosed)
				li.TabOpen = true
				li.tabIndex = i
				$('#div3listCol' + j + 'Div').append(li)
			}
			if (settings.listColsOrder[j] == 'timeLastModified') {
				var li = document.createElement('div')
				$(li).addClass('list')
				$(li).addClass('item')
				$(li).addClass('open')
				li.innerText = bg.UNIXtimeToLocaleString(Tabs[i].timeLastModified)
				li.TabOpen = true
				li.tabIndex = i
				$('#div3listCol' + j + 'Div').append(li)
			}
			if (settings.listColsOrder[j] == 'timeLastOpened') {
				var li = document.createElement('div')
				$(li).addClass('list')
				$(li).addClass('item')
				$(li).addClass('open')
				li.innerText = bg.UNIXtimeToLocaleString(Tabs[i].timeLastOpened)
				li.TabOpen = true
				li.tabIndex = i
				$('#div3listCol' + j + 'Div').append(li)
			}
		}

	}//newOpenListItem

	if (settings.openTabsOrder == 'rightFirst') {
		var length = Tabs.length
		for (var i = length - 1; i >= 0; i--) {
			newOpenListItem(Tabs, i)
		}
	} else if (settings.openTabsOrder == 'leftFirst') {
		for (var i in Tabs) {
			newOpenListItem(Tabs, i)
		}//TabsOpen
	}

	//display //TabsStored
	var __TabsStored
	var Tabs = Win.TabsStored
	function newStoredListItem(Tabs, i) {
		//fill out the columns
		for (var j in settings.listColsOrder) {
			if (settings.listColsOrder[j] == 'Title') {
				var li = document.createElement('div')
				$(li).addClass('list')
				$(li).addClass('item')
				$(li).addClass('stored')
				$(li).addClass('title')
				li.timeLastClosed = Tabs[i].timeLastClosed * 1
				li.timeLastModified = Tabs[i].timeLastModified * 1
				li.timeLastOpened = Tabs[i].timeLastOpened * 1
				//li.id = Tabs[i].id//see tabId
				li.innerText = Tabs[i].title
				if (li.innerText == '' || Tabs[i].title == '') {
					li.innerText = ' - '
				}
				li.label = Tabs[i].label
				li.openOrStored = 'stored'
				li.TabOpen = false
				li.tabIndex = i
				//li.tabId = Tabs[i].id	//Tabs[i].id exists because //stored tabs should not have tabId
				li.title = Tabs[i].title
				if (li.title == '') {
					li.title = '_'
				}
				li.url = Tabs[i].url
				li.winId = evt.target.winId
				li.winName = evt.target.winName
				$('#div3listCol' + j + 'Div').append(li)
				//on double click listener
				$(li).on('dblclick', handle_list_item_double_clicked)
			}
			if (settings.listColsOrder[j] == 'Url') {
				var li = document.createElement('div')
				$(li).addClass('list')
				$(li).addClass('item')
				$(li).addClass('stored')
				li.innerText = Tabs[i].url
				li.TabOpen = false
				li.tabIndex = i
				$('#div3listCol' + j + 'Div').append(li)
			}
			if (settings.listColsOrder[j] == 'HostName') {
				var li = document.createElement('div')
				$(li).addClass('list')
				$(li).addClass('item')
				$(li).addClass('stored')
				li.innerText = getHostname(Tabs[i].url)
				li.TabOpen = false
				li.tabIndex = i
				$('#div3listCol' + j + 'Div').append(li)
			}
			if (settings.listColsOrder[j] == 'Label') {
				var li = document.createElement('div')
				$(li).addClass('list')
				$(li).addClass('item')
				$(li).addClass('stored')
				$(li).addClass('label')
				var text = Tabs[i].label
				if (text == '') {
					text = 'none'
				}
				li.innerText = text
				li.TabOpen = false
				li.tabIndex = i
				$('#div3listCol' + j + 'Div').append(li)
			}
			if (settings.listColsOrder[j] == 'timeLastClosed') {
				var li = document.createElement('div')
				$(li).addClass('list')
				$(li).addClass('item')
				$(li).addClass('stored')
				li.innerText = bg.UNIXtimeToLocaleString(Tabs[i].timeLastClosed)
				li.TabOpen = false
				li.tabIndex = i
				$('#div3listCol' + j + 'Div').append(li)
			}
			if (settings.listColsOrder[j] == 'timeLastModified') {
				var li = document.createElement('div')
				$(li).addClass('list')
				$(li).addClass('item')
				$(li).addClass('stored')
				li.innerText = bg.UNIXtimeToLocaleString(Tabs[i].timeLastModified)
				li.TabOpen = false
				li.tabIndex = i
				$('#div3listCol' + j + 'Div').append(li)
			}
			if (settings.listColsOrder[j] == 'timeLastOpened') {
				var li = document.createElement('div')
				$(li).addClass('list')
				$(li).addClass('item')
				$(li).addClass('stored')
				li.innerText = bg.UNIXtimeToLocaleString(Tabs[i].timeLastOpened)
				li.TabOpen = false
				li.tabIndex = i
				$('#div3listCol' + j + 'Div').append(li)
			}
		}
	}//newStoredListItem

	if (settings.storedTabsOrder == 'latestFirst') {
		var length = Tabs.length
		for (var i = length - 1; i >= 0; i--) {
			newStoredListItem(Tabs, i)
		}
	} else if (settings.storedTabsOrder == 'latestLast') {
		for (var i in Tabs) {
			newStoredListItem(Tabs, i)
		}//TabsStored
	}

	//add col resizers to list cols
	var __resizers
	for (var j in settings.listColsOrder) {
		//resizer
		var resizer = document.createElement('div')
		resizer.id = settings.listColsOrder[j] + 'ListResizer'
		$(resizer).addClass('list')
		$(resizer).addClass('resizerClass')
		$(resizer).css('position', 'absolute')
		$(resizer).css('height', $('#div3listCol' + j + 'Div').css('height'))
		$('#div3listCol' + j + 'Div').append(resizer)

		//position onto column
		/*
		 $(resizer).position({
		 my : "right top",
		 at : "right top",
		 of : '#div3listCol' + j + 'Div'
		 })
		 */
		$(resizer).autoPosition({//can be replaced with .position()
			my : "left top",
			at : "right top",
			of : '#div3listCol' + j + 'Div'
		})

		//drag
		$(resizer).draggable()//init
		$(resizer).draggable("option", "axis", "x")//sets axis
		$(resizer).draggable("option", "opacity", 0.35)//does not work if clone
		$(resizer).draggable("option", "helper", "clone")//possible values =  'original', 'clone'
		$(resizer).on("drag", function(event, ui) {//inside createDisplay_list_items
			console.logg("drag, evt = ", event)
			var resizer = event.target//important

			//update resizer position
			$(resizer).offset({
				left : ui.offset.left
			})

			//update col
			var width = ui.offset.left - $(resizer).parent().offset().left
			$(resizer).parent().width(width)

			//update settings
			var n = $(resizer).parent().prop('id').split('div3listCol')[1].split('Div')[0]
			settings.listColsWidths[settings.listColsOrder[n]] = width
			localStorage._managerSettings = bg.stringify(settings)

			//trigger moved
			//$(resizer).parent().trigger('moved.autoPosition')
			$(resizer).parent().trigger('moved.autoPosition', {
				movedBy : $(resizer),
				evt : 'resizer drag'
			})

			//update all resizers positions
			$('#div3list').scroll()

		})
	}//col resizers

	//context menu listener/handler for list item title elements
	var __contextMenu
	$('.list.item.title').contextMenu('context-menu-tabs', {
		'Display by Open Tabs Left First' : {
			click : function(element) {// element is the jquery obj clicked on when context menu launched
				//alert('Menu item 1 clicked');
				settings.openTabsOrder = 'leftFirst'//leftFirst, rightFirst
				localStorage._managerSettings = bg.stringify(settings)
				location.reload()
			},
			klass : "menu-item-1" // a custom css class for this menu item (usable for styling)
		},
		'Display by Open Tabs Right First' : {
			click : function(element) {// element is the jquery obj clicked on when context menu launched
				//alert('Menu item 1 clicked');
				settings.openTabsOrder = 'rightFirst'//leftFirst, rightFirst
				localStorage._managerSettings = bg.stringify(settings)
				location.reload()
			},
			klass : "menu-item-1" // a custom css class for this menu item (usable for styling)
		},
		'Display by Stored Tabs Latest First' : {
			click : function(element) {// element is the jquery obj clicked on when context menu launched
				//alert('Menu item 1 clicked');
				settings.storedTabsOrder = 'latestFirst'//latestFirst, latestLast
				localStorage._managerSettings = bg.stringify(settings)
				location.reload()
			},
			klass : "menu-item-1" // a custom css class for this menu item (usable for styling)
		},
		'Display by Stored Tabs Latest Last' : {
			click : function(element) {// element is the jquery obj clicked on when context menu launched
				//alert('Menu item 1 clicked');
				settings.storedTabsOrder = 'latestLast'//latestFirst, latestLast
				localStorage._managerSettings = bg.stringify(settings)
				location.reload()
			},
			klass : "menu-item-1" // a custom css class for this menu item (usable for styling)
		},
		'Delete Selected [Del]' : {
			click : function(element) {
				//alert('second clicked');
				$selected = $('.selected')
				if ($selected.length == 0) {
					$(element).addClass('selected')
					$('.lastClicked').removeClass('lastClicked')
					$(element).addClass('lastClicked')
				}

				handle_list_items_delete()
			},
			klass : "second-menu-item"
		}
	})

	//draggable listener for list item title elements
	var __draggable
	$('.list.item.title').draggable({
		appendTo : 'body',
		cursor : "default",
		cursorAt : {
			left : -5
		},
		helper : "clone",
		scroll : false
	})

	//droppable listener for list item title elements
	var __droppable
	$('.list.item.title').droppable({
		hoverClass : "hover",
		drop : handle_list_item_drop,
		tolerance : "pointer"
	})

}//createDisplay_list_items

//.div3listItem
//11111111111111111111111111111111111111111111
function listen_for_and_handle_list_items_select() {

	//remove selected class on click...
	//unselect
	//unselect all selected items when div1, div2, div3list, div4, div5 (whitespace) is clicked on
	$("#div1, #div2, #div3list, #div4, #div5").on("click", function(evt) {//inside listen_for_and_handle_list_items_select
		//filter bubbled evt; chk target
		//if($(this).hasClass("mouseover") == false){
		if ($(this)[0] != $(evt.target)[0]) {
			return
		}
		console.logg("div12345 clicked; evt.target = ", evt.target)

		//unselect
		$(".selected").removeClass("selected")
	})
	//add selected class on click...
	//select
	//list items selectable with click, or ctrlKey down and shift key down
	$('.list.item.title, .list.item.label').live("click", function(evt) {
		//filter bubbled evt; chk target
		//if($(this).hasClass("mouseover") == false){
		if ($(this)[0] != $(evt.target)[0]) {
			return
		}
		console.logg("listen_for_and_handle_list_items_select; list item title clicked; evt.target = ", evt.target)

		//no ctrl nor shift
		if (evt.ctrlKey == false && evt.shiftKey == false) {
			//unselect all
			$(".selected").removeClass("selected")
			//select this
			$(this).addClass("selected")
			//lastClicked
			$(".lastClicked").removeClass("lastClicked")
			$(this).addClass("lastClicked")
		}
		//ctrl only; add
		else if (evt.ctrlKey == true && evt.shiftKey == false) {
			//toggle selection
			$(this).toggleClass("selected")
			//lastClicked
			$(".lastClicked").removeClass("lastClicked")
			$(this).addClass("lastClicked")
		}
		//shift only;
		else if (evt.ctrlKey == false && evt.shiftKey == true) {
			//unselect all
			$(".selected").removeClass("selected")
			//select the items in between clicks
			var oldIndex = $(".list.item.lastClicked").parent().children().index($(".lastClicked"))
			var newIndex = $(this).parent().children().index($(this))
			var list = $(this).parent().children()
			if (newIndex >= oldIndex) {
				for (var i = oldIndex; i <= newIndex; i++) {
					$(list[i]).addClass("selected")
				}
			} else {
				for (var i = newIndex; i <= oldIndex; i++) {
					$(list[i]).addClass("selected")
				}
			}
			//lastClicked
			$(".lastClicked").removeClass("lastClicked")
			$(this).addClass("lastClicked")
		}
		//ctrl And shift;
		else if (evt.ctrlKey == true && evt.shiftKey == true) {
			//add selected Range to selection
			var oldIndex = $(".list.item.lastClicked").parent().children().index($(".lastClicked"))
			var newIndex = $(this).parent().children().index($(this))
			var list = $(this).parent().children()
			if (newIndex >= oldIndex) {
				for (var i = oldIndex; i <= newIndex; i++) {
					$(list[i]).addClass("selected")
				}
			} else {
				for (var i = newIndex; i <= oldIndex; i++) {
					$(list[i]).addClass("selected")
				}
			}
			//lastClicked
			$(".lastClicked").removeClass("lastClicked")
			$(this).addClass("lastClicked")
		}

	})//$('.list.item.title').live("click",
	//select list items

}//listen_for_and_handle_list_items_select

function handle_list_item_double_clicked(evt) {
	var __shorthands
	//console.logg('handle_list_item_double_clicked; evt = ', evt, 'target=', evt.target)
	var target = evt.target
	console.logg('handle_list_item_double_clicked; winId = ', target.winId, 'winName=', target.winName, 'openOrStored=', target.openOrStored, 'url=', target.url)
	var winName = target.winName
	var winId = target.winId * 1
	var openOrStored = target.openOrStored
	var url = target.url

	var CASE
	//1A //open named window open tab -> focus
	//1B //open named window stored tab -> open tab, turn stored tab into open tab
	//2A //open unnamed window open tab -> focus
	//2B //open unnamed window stored tab -> open tab, turn stored tab into open tab
	//3A //closed named window open tab -> prompt choice to open WINDOW or open tab??
	//3B //closed named window stored tab -> prompt choice to open WINDOW or open tab??
	if (winId && winName && openOrStored == 'open') {
		CASE = '1A'
	} else if (winId && winName && openOrStored == 'stored') {
		CASE = '1B'
	} else if (winId && !winName && openOrStored == 'open') {
		CASE = '2A'
	} else if (winId && !winName && openOrStored == 'stored') {
		CASE = '2B'
	} else if (!winId && winName && openOrStored == 'open') {
		CASE = '3A'
	} else if (!winId && winName && openOrStored == 'stored') {
		CASE = '3C'
	}
	console.logg('handle_list_item_double_clicked; case =', CASE)

	//1A //open named window open tab -> focus
	//2A //open unnamed window open tab -> focus
	if (CASE == '1A' || CASE == '2A') {

		chrome.tabs.update(target.tabId * 1, {
			active : true
		}, function callback() {
			chrome.windows.update(winId, {
				focused : true
			})
		})
	}//cases 1A, 2A

	//1B //open named window stored tab -> open tab, turn stored tab into open tab
	//2B //open unnamed window stored tab -> open tab, turn stored tab into open tab
	if (CASE == '1B' || CASE == '2B') {

		var $selected = $(target)
		removeListItem($selected, 0)

		chrome.tabs.create({
			windowId : winId,
			url : url,
			selected : false
		}, function callback() {
			console.logg('handle_list_item_double_clicked; tabs create callback')
			//refresh list
			setTimeout(function() {
				$('.folderOpen').trigger('click')
			}, 1000);

		})
	}//cases 1B, 2B

}//handle_list_item_double_clicked

function listen_for_list_item_rename() {

	var __listeners
	$(window).on("keydown", function(evt) {//inside listen_for_list_item_rename
		//console.logg("listen_for_list_item_rename; keydown; evt = ", evt)

		//filter	//lastClicked is NOT list item
		if ($('.lastClicked').hasClass('list') != true) {
			return
		}

		//F2 key
		var __starts_edit
		if (evt.keyCode == 113) {
			console.logg('listen_for_list_item_rename;	F2 keydown')

			//start edit
			handle_list_item_rename_start()

		}

		//Enter Key
		var __ends_edit
		if (evt.keyCode == 13) {
			console.logg('listen_for_list_item_rename;	enter keydown')

			//end editing by triggering blur
			$('.listEditInput').trigger('blur')
		}

	})//on window keydown
	//ends edit blur bug
	//for some reason, blur does not work when other list or tree items are clicked
	//blur bug workaround	//clicking ANYthing blurs $('.editInput')
	$('*').live('click', function(evt) {
		evt.stopPropagation()
		//console.logg('listen_for_list_item_rename; any item click blur triggered')
		$('.listEditInput').trigger('blur')
	})
}//listen_for_list_item_rename

function handle_list_item_rename_start() {
	console.logg('handle_list_item_rename_start')
	//return

	//get last clicked item that is NOT inEdit as target for editing
	//works with $('.list.item.title, .list.item.label', .tree.item.name) because .lastClicked is only appended to these classes
	var listItemInEdit = $(".lastClicked").not(".listItemInEdit")[0]
	$(listItemInEdit).addClass("listItemInEdit")
	listItemInEdit.temp = listItemInEdit.innerText//store div3listItem value
	if (!listItemInEdit) {//exit if no item in edit
		return
	}

	//input box
	var __input_box
	//replace content of listItemInEdit with editable input box
	var listEditInput = document.createElement('input')
	$(listEditInput).addClass('listEditInput')
	$(listEditInput).height($(".lastClicked").height())
	listEditInput.size = 5
	listEditInput.value = listItemInEdit.innerText//restore copied value to input
	var __ends_edit_on_blur
	function listEditInputBlurred(evt) {
		console.logg('listEditInputBlurred; evt=', evt)
		handle_list_item_rename_end(evt)
	}


	$(listEditInput).on('blur', listEditInputBlurred)

	//append input box
	listItemInEdit.innerHTML = ""//blank it
	listItemInEdit.appendChild(listEditInput)
	listEditInput.focus()

}//handle_list_item_rename_start

function handle_list_item_rename_end() {
	console.logg('handle_list_item_rename_end')
	//return

	try {//suppressed error caused by deleting input node

		//shorthand
		var listEditInput = $('.listEditInput')[0]
		console.logg('handle_list_item_rename_end; listEditInput = ', listEditInput)
		var listItemInEdit = $('.listItemInEdit')[0]
		console.logg('handle_list_item_rename_end; listItemInEdit = ', listItemInEdit)
		var oldName = listItemInEdit.temp
		console.logg('handle_list_item_rename_end; oldName = ', oldName)
		var newName = listEditInput.value
		console.logg('handle_list_item_rename_end; newName = ', newName)

		//editing done
		//remove input
		$('.listEditInput').remove()//will NOT trigger blur again
		//remove in edit status
		$(".listItemInEdit").removeClass("listItemInEdit")

		//dispay newName
		if (newName == "") {
			listItemInEdit.innerText = oldName
		} else {
			listItemInEdit.innerText = newName
		}

		//reflect changes in data/localStorage

	} catch(err) {
		console.logg("handle_list_item_rename_end; err = ", err)
	}
}//handle_list_item_rename_end

function listen_for_list_items_delete() {
	var __listeners
	$(window).on("keydown", function(evt) {//inside listen_for_list_items_delete
		//console.logg("listen_for_list_items_delete; keydown; evt = ", evt)

		//Del Key
		if (evt.keyCode == 46) {
			//console.logg('listen_for_list_items_delete;	del keydown; evt.target =', evt.target)

			//filter
			//exit if no list items selected
			$selected = $('.selected')//selected list items
			if ($selected.length == 0) {
				return
			} else {
				handle_list_items_delete()
			}
		}//Del key pressed

	})//on window key down
}//end listen_for_list_items_delete

function handle_list_items_delete(evt) {
	//debug
	//console.logg('handle_list_items_delete; $selected = ', $selected)

	var __confirm_before_delete
	if (confirm('This will Delete selected list items!\n This will also close the tabs if they are open!\n\nContinue?') == false) {
		//exit if cancelled
		return
	}

	var __loop_thru_selected_open_list_items//want to process those with large tabIndexes FIRST
	$selected = $('.selected.open')
	if ($selected.length == 0) {
		//do nothing
	} else if ($selected.length == 1) {
		removeListItem($selected, 0)
	} else if ($selected.length > 1) {
		if ($selected[0].tabIndex > $selected[$selected.length - 1].tabIndex) {
			//large tabIndex at front of array
			for (var i in $selected) {
				removeListItem($selected, i)
			}
		} else {
			//large tabIndex at back of array
			for (var i = $selected.length - 1; i >= 0; i--) {
				removeListItem($selected, i)
			}
		}
	}

	var __loop_thru_selected_stored_list_items
	$selected = $('.selected.stored')
	if ($selected.length == 0) {
		//do nothing
	} else if ($selected.length == 1) {
		removeListItem($selected, 0)
	} else if ($selected.length > 1) {
		if ($selected[0].tabIndex > $selected[$selected.length - 1].tabIndex) {
			//large tabIndex at front of array
			for (var i in $selected) {
				removeListItem($selected, i)
			}
		} else {
			//large tabIndex at back of array
			for (var i = $selected.length - 1; i >= 0; i--) {
				removeListItem($selected, i)
			}
		}
	}

	var __refresh_list
	setTimeout(function() {
		$('.folderOpen').trigger('click')
	}, 1000);
	//need to give time for tab to be closed data updated ?

}//handle_list_items_delete

var __drop_handlers

function handle_tree_header_drop(evt, ui) {//switch columns
	if ($(this).hasClass('mouseover') == false) {
		return
	}
	console.logg("handle_tree_header_drop; evt = ", evt, ' , ui = ', ui)
	console.logg("this = ", this, " , this.hasClass('mouseover') = ", $(this).hasClass('mouseover'))

	var $draggable = ui.draggable
	var $droppable = $(this)
	console.logg('handle_tree_header_drop ; $draggable = ', $draggable, ' $droppable = ', $droppable)

	//switch columns
	if ($draggable.hasClass('headerClass tree'))//only works if list class is added after headerClass
	{
		switchColumns($draggable.parent(), $droppable.parent())
	}
}

function removeListItem($selected, i) {//used in handle_list_items_delete, handle_list_item_double_clicked
	//shorthand
	var listItem = $selected[i]
	var winId = listItem.winId
	var winName = listItem.winName
	console.logg('handle_list_items_delete; listItem = ', listItem, 'winId =', winId, 'winName = ', winName, 'openOrStored =', listItem.openOrStored)

	//sort/check Which Scenario:
	//1A OPEN Named window open tab
	//1B OPEN Named window stored tab
	//2A OPEN UNnamed window open tab
	//2B OPEN UNnamed window stored tab
	//3A CLOSED Named window open tab
	//3B CLOSED Named window stored tab
	var CASE
	if (listItem.winId && listItem.winName) {
		if (listItem.openOrStored == 'open') {
			CASE = '1A'
		} else {
			CASE = '1B'
		}
	} else if (listItem.winId && !listItem.winName) {
		if (listItem.openOrStored == 'open') {
			CASE = '2A'
		} else {
			CASE = '2B'
		}

	} else if (!listItem.winId && listItem.winName) {
		if (listItem.openOrStored == 'open') {
			CASE = '3A'
		} else {
			CASE = '3B'
		}
	}
	console.logg('CASE = ', CASE)
	//CASE = 'debug'

	//action
	if (CASE == '1A' || CASE == '2A') {
		//1A OPEN Named window open tab //winId and winName
		//2A OPEN UNnamed window open tab //winId, no winName

		//delete selected
		//delete = close the tabs because items are OPEN tabs in an open window
		//closing the tab will mean that tabRemoved() will handle the rest
		var tabId = listItem.tabId
		console.logg("handle_list_items_delete; 1A or 2A; close tab; tabId =", tabId)
		chrome.tabs.remove(tabId)
	}//end if (CASE == '1A' || CASE == '2A')
	else if (CASE == '1B') {//1B OPEN Named window stored tab
		//winId and winName

		var data_1_WinObj_from_winId
		//delete tab from bgVar
		bg.WinObj_from_winId[winId].TabsStored.splice(listItem.tabIndex, 1)
		bg.WinObj_from_winId[winId].timeLastModified = bg.UNIXtime()

		var data_2_TabObj_from_tabId
		//stored tab, no tabId

		var data_3_winId_from_tabId
		//stored tab, no tabId

		var data_4_WinInfoObj_from_winName
		bg.WinInfoObj_from_winName[winName].numberOfTabsStored = bg.WinObj_from_winId[winId].TabsStored.length
		bg.WinInfoObj_from_winName[winName].storageLastModified = bg.getTime()
		bg.WinInfoObj_from_winName[winName].timeLastModified = bg.WinObj_from_winId[winId].timeLastModified

		var data_5_winId_from_winName
		//no change

		var data_6_winName_from_winId
		//no change

		var data_7_localStorage
		localStorage[winName] = bg.stringify(bg.WinObj_from_winId[winId])
		//localStorage['WinInfoObj_from_winName'] = bg.stringify(bg.WinInfoObj_from_winName)
		bg.update_localStorage('WinInfoObj_from_winName')

	}//end if (CASE == '1B')
	else if (CASE == '2A') {//2A OPEN UNnamed window open tab
		//already handled in if (CASE == '1A' || CASE == '2A')

	}//end 2A OPEN UNnamed window open tab
	else if (CASE == '2B') {//2B OPEN UNnamed window stored tab
		//no winName, only winId

		var data_1_WinObj_from_winId
		//delete tab from bgVar
		bg.WinObj_from_winId[winId].TabsStored.splice(listItem.tabIndex, 1)
		bg.WinObj_from_winId[winId].timeLastModified = bg.UNIXtime()

		var data_2_TabObj_from_tabId
		//storedTab, no tabId

		var data_3_winId_from_tabId
		//storedTab, no tabId

		var data_4_WinInfoObj_from_winName
		//no winName, only winId

		var data_5_winId_from_winName
		//no winName, only winId

		var data_6_winName_from_winId
		//no winName, only winId

		var data_7_localStorage
		//localStorage[winName] = bg.stringify(bg.WinObj_from_winId[winId])
		//no winName
		////localStorage['WinInfoObj_from_winName'] = bg.stringify(bg.WinInfoObj_from_winName)
		//bg.update_localStorage('WinInfoObj_from_winName')
		//no winName, no change

	}//2B OPEN UNnamed window open tab
	else if (CASE == '3A') {//3A CLOSED Named window open tab
		//no winId, only winName
		//WinObj should already be parsed in createDisplay_list_items
		var closedWin = selectedClosedWinObj

		var data_1_WinObj_from_winId
		//delete tab from bgVar
		closedWin.TabsOpen.splice(listItem.tabIndex, 1)
		closedWin.timeLastModified = bg.UNIXtime()

		var data_2_TabObj_from_tabId
		//no tabId

		var data_3_winId_from_tabId
		//no tabId

		var data_4_WinInfoObj_from_winName
		bg.WinInfoObj_from_winName[winName].numberOfTabsOpen = closedWin.TabsOpen.length
		bg.WinInfoObj_from_winName[winName].timeLastModified = closedWin.timeLastModified

		var data_5_winId_from_winName
		//no winId

		var data_6_winName_from_winId
		//no winId

		var data_7_localStorage
		localStorage[winName] = bg.stringify(closedWin)
		//localStorage['WinInfoObj_from_winName'] = bg.stringify(bg.WinInfoObj_from_winName)
		bg.update_localStorage('WinInfoObj_from_winName')

	}//if (CASE == '3A')
	else if (CASE == '3B') {//3B CLOSED Named window stored tab
		//no winId, only winName
		//WinObj should already be parsed in createDisplay_list_items
		var closedWin = selectedClosedWinObj

		var data_1_WinObj_from_winId
		//delete tab from bgVar
		closedWin.TabsStored.splice(listItem.tabIndex, 1)
		closedWin.timeLastModified = bg.UNIXtime()

		var data_2_TabObj_from_tabId
		//no tabId

		var data_3_winId_from_tabId
		//no tabId

		var data_4_WinInfoObj_from_winName
		bg.WinInfoObj_from_winName[winName].numberOfTabsStored = closedWin.TabsStored.length
		bg.WinInfoObj_from_winName[winName].storageLastModified = bg.getTime()
		bg.WinInfoObj_from_winName[winName].timeLastModified = closedWin.timeLastModified

		var data_5_winId_from_winName
		//no winId

		var data_6_winName_from_winId
		//no winId

		var data_7_localStorage
		localStorage[winName] = bg.stringify(closedWin)
		//localStorage['WinInfoObj_from_winName'] = bg.stringify(bg.WinInfoObj_from_winName)
		bg.update_localStorage('WinInfoObj_from_winName')

	}
	//end if (CASE == '3B')
}//removeListItem

function handle_tree_item_drop(evt, ui) {//listeners added in createDisplay_tree_items //move tabItems from one window to another

	//exit if NOT mouseovered //this = treeItem element
	if ($(this).hasClass('mouseover') == false) {
		return
	}

	//debug
	//console.logg("handle_tree_item_drop; evt = ", evt, ' , ui = ', ui)
	console.logg("handle_tree_item_drop; this = ", this, " , this.hasClass('mouseover') = ", $(this).hasClass('mouseover'))

	//vars
	var $dragged = ui.draggable
	var $droppable = $(this)
	console.logg('handle_tree_item_drop ; $draggable = ', $dragged, ' $droppable = ', $droppable)

	var __dragged_is_tree_item_begin//tree item dropped onto tree item //switch tree items
	//MOVE tree item
	if ($dragged.hasClass('tree item')) {
		console.logg('tree item dropped onto tree item; $dragged.winName =', $($dragged).prop('winName'), '$dragged.winId=', $($dragged).prop('winId'), '$droppable.winName=', this.winName, '$droppable.winId=', this.winId)

		//update bg data!
		var draggedWinName = $($dragged).prop('winName')
		var droppableWinName = this.winName

		function switchPlaces(arr, el1, el2) {//switch places of array elements
			var index1 = arr.indexOf(el1)
			var index2 = arr.indexOf(el2)
			var temp = el1

			//move el2 to where el1 was
			arr.splice(index1, 1, arr[index2])
			//copy el1 to where el2 was
			arr.splice(index2, 1, temp)
		}

		if (draggedWinName && droppableWinName) {
			//update bg data!
			switchPlaces(bg.WinInfoObj_from_winName._orderOfNames, draggedWinName, droppableWinName)
			//update localStorage data!
			localStorage.WinInfoObj_from_winName = bg.stringify(bg.WinInfoObj_from_winName)
		}

		var __reload_page_after_tree_item_swapped
		/*
		setTimeout(function() {
		location.reload()
		}, 800);
		*/	//switch actual elements instead...

		var __swap_tree_item_column_elements
		//update display!
		function swapElements(elm1, elm2) {//http://stackoverflow.com/questions/8034918/jquery-switch-elements-in-dom
			var parent1, next1, parent2, next2;

			parent1 = elm1.parentNode;
			next1 = elm1.nextSibling;
			parent2 = elm2.parentNode;
			next2 = elm2.nextSibling;

			parent1.insertBefore(elm2, next1);
			parent2.insertBefore(elm1, next2);
		}//swapElements

		var indexDragged = $('.tree.item.name').index($dragged[0])
		var indexDroppable = $('.tree.item.name').index($droppable[0])
		console.logg('handle_tree_item_drop; indexDragged=', indexDragged, 'indexDropped=', indexDroppable)
		//console.logg('swapElements, $dragged =', $dragged[0], '$droppable = ', $droppable[0])

		//swap tree item name only
		//swapElements($dragged[0], $droppable[0])

		//swap elements in all columns
		var columns = $('.tree.column')
		for (var i = 0; i <= columns.length - 1; i++) {
			var columnChildren = $(columns[i]).children()
			swapElements(columnChildren[indexDragged + 1], columnChildren[indexDroppable + 1])	//+1 is for header offset
		}

	}//tree item dropped onto tree item
	var __dragged_is_tree_item_end

	var __dragged_are_list_items_begin
	//MOVE list items
	if ($dragged.hasClass('list item')) {
		//dragged item(s) dropped onto tree item is a list item

		var $movable = new Array()
		//if dragged item is a part of $('.selected')... //move selected instead of dragged
		//if dragged item is NOT a part of $('.selected')... //move dragged instead of selected
		if ($($dragged[0]).hasClass('selected')) {//dragged IS a part of selection!

			//$movable = $('.selected').not('.ui-draggable-dragging')	//not so simple //can be out of order!
			$movableOpen = $('.selected.open').not('.ui-draggable-dragging')
			$movableStored = $('.selected.stored').not('.ui-draggable-dragging')

			//add items to $movable depending on tabIndex
			//$movableOpen
			if ($movableOpen.length == 1) {
				$movable.push($movableOpen[0])
			} else if ($movableOpen.length > 1) {
				if ($movableOpen[0].tabIndex < $movableOpen[$movableOpen.length - 1].tabIndex) {
					for (var i = 0; i <= $movableOpen.length - 1; i++) {
						$movable.push($movableOpen[i])
					}
				} else {
					for (var i = $movableOpen.length - 1; i >= 0; i--) {
						$movable.push($movableOpen[i])
					}
				}
			}
			//$movableStored
			if ($movableStored.length == 1) {
				$movable.push($movableStored[0])
			} else if ($movableStored.length > 1) {
				if ($movableStored[0].tabIndex < $movableStored[$movableStored.length - 1].tabIndex) {
					for (var i = 0; i <= $movableStored.length - 1; i++) {
						$movable.push($movableStored[i])
					}
				} else {
					for (var i = $movableStored.length - 1; i >= 0; i--) {
						$movable.push($movableStored[i])
					}
				}
			}
		} else {//dragged is NOT a part of selection!
			$movable = $($dragged[0]) //fix bug where the last item is a drag helper clone
		}
		console.logg("handle_tree_item_drop; $movable = ", $movable)

		var __CASES
		//winIds, winNames
		var fromWinId = $($movable[0]).prop('winId')//null*1 = 0... null+1 = 0
		if (fromWinId) {
			fromWinId = fromWinId * 1
		}
		var fromWinName = $($movable[0]).prop('winName')
		var toWinId = $droppable.prop('winId')//null*1 =0... null+1 = 0
		if (toWinId) {
			toWinId = toWinId * 1
		}
		var toWinName = $droppable.prop('winName')
		console.logg("handle_tree_item_drop; fromWinId= ", fromWinId, ', fromWinName = ', fromWinName, ',toWinId = ', toWinId, ',toWinName=', toWinName)

		var CASE
		//0 //fromWin == toWin
		//1A //fromWin open named win, toWin open named win
		//1B //fromWin open named win, toWin open unnamed win
		//1C //fromWin open named win, toWin closed named win
		//2A //fromWin open unnamed win, toWin open named win
		//2B //fromWin open unnamed win, toWin open unnamed win
		//2C //fromWin open unnamed win, toWin closed named win
		//3A //fromWin closed named win, toWin open named win
		//3B //fromWin closed named win, toWin open unnamed win
		//3C //fromWin closed named win, toWin closed named win

		if (fromWinId == toWinId && fromWinName == toWinName) {
			//tabs to be moved already in dropped window tree item/name
			CASE = '0'

			//do nothing
			//console.logg("handle_tree_item_drop; fromWinId == toWindId; exit")
			return
		} else if (fromWinId && fromWinName) {
			if (toWinId && toWinName) {
				CASE = '1A'
			} else if (toWinId && !toWinName) {
				CASE = '1B'
			} else if (!toWinId && toWinName) {
				CASE = '1C'
			}
		} else if (fromWinId && !fromWinName) {
			if (toWinId && toWinName) {
				CASE = '2A'
			} else if (toWinId && !toWinName) {
				CASE = '2B'
			} else if (!toWinId && toWinName) {
				CASE = '2C'
			}
		} else if (!fromWinId && fromWinName) {
			if (toWinId && toWinName) {
				CASE = '3A'
			} else if (toWinId && !toWinName) {
				CASE = '3B'
			} else if (!toWinId && toWinName) {
				CASE = '3C'
			}
		}
		console.logg('handle_tree_item_drop; CASE = ', CASE)

		var __CASE_1A
		if (CASE == '1A') {//1A //fromWin open named win, toWin open named win
			var fromWin = bg.WinObj_from_winId[fromWinId]
			var toWin = bg.WinObj_from_winId[toWinId]

			var __CASE_1A_update_data

			//forward loop thru $movable
			for (var i = 0; i <= $movable.length - 1; i++) {
				if ($movable[i].TabOpen == true) {
					//open tab

					var data_1_WinObj_from_winId
					//open tab, fromWin
					//open tab, toWin

					//move the tab
					chrome.tabs.move($movable[i].tabId, {
						windowId : toWinId,
						index : -1
					}, function(tab) {
					})
					//will trigger tabDetached, then tabAttached

				} else {
					//stored tab

					var data_1_WinObj_from_winId
					//stored tab, toWin

					//copy tab ptr from fromWin to toWin
					toWin.TabsStored.push(fromWin.TabsStored[$movable[i].tabIndex * 1])
					toWin.timeLastModified = bg.UNIXtime()
				}
			}//loop thru $movable

			//backward loop thru $movable to remove data
			for (var i = $movable.length - 1; i >= 0; i--) {
				if ($movable[i].TabOpen == true) {
					//open tab

				} else {
					//stored tab

					var data_1_WinObj_from_winId
					//stored tab, fromWin

					//delete tab ptr from fromWin
					fromWin.TabsStored.splice($movable[i].tabIndex, 1)
					fromWin.timeLastModified = toWin.timeLastModified
				}
			}//end backward loop thru $movable

			var data_1_WinObj_from_winId//TabsOpen	//TabsStored
			//see above loops
			var data_2_TabObj_from_tabId
			//open tab, fromWin, not changed
			//open tab, toWin, not changed
			//stored tab, fromWin, no tabId
			//stored tab, toWin, no tabId
			var data_3_winId_from_tabId
			//open tab, fromWin, handled in tabDetached
			//open tab, toWin, handled in tabAttached
			//stored tab, fromWin, no tabId
			//stored tab, toWin, no tabId
			var data_4_WinInfoObj_from_winName
			//open tab, fromWin
			//stored tab, fromWin
			bg.WinInfoObj_from_winName[fromWinName].timeLastModified = fromWin.timeLastModified
			bg.WinInfoObj_from_winName[fromWinName].numberOfTabsOpen = fromWin.TabsOpen.length
			bg.WinInfoObj_from_winName[fromWinName].numberOfTabsStored = fromWin.TabsStored.length
			//open tab, toWin
			//stored tab, toWin
			bg.WinInfoObj_from_winName[toWinName].timeLastModified = toWin.timeLastModified
			bg.WinInfoObj_from_winName[toWinName].numberOfTabsOpen = toWin.TabsOpen.length
			bg.WinInfoObj_from_winName[toWinName].numberOfTabsStored = toWin.TabsStored.length
			var data_5_winId_from_winName
			//not affected
			var data_6_winName_from_winId
			//not affected
			var data_7_localStorage
			//all
			localStorage[fromWinName] = bg.stringify(fromWin)
			localStorage[toWinName] = bg.stringify(toWin)
			//localStorage['WinInfoObj_from_winName'] = bg.stringify(bg.WinInfoObj_from_winName)
			bg.update_localStorage('WinInfoObj_from_winName')

		}//1A //fromWin open named win, toWin open named win

		var __CASE_1B
		if (CASE == '1B') {//1B //fromWin open named win, toWin open unnamed win
			var fromWin = bg.WinObj_from_winId[fromWinId]
			var toWin = bg.WinObj_from_winId[toWinId]

			var __update_data

			//loop thru $movable
			for (var i = 0; i <= $movable.length - 1; i++) {
				if ($movable[i].TabOpen == true) {
					//open tab

					var data_1_WinObj_from_winId
					//open tab, fromWin
					//open tab, toWin

					//move the tab
					chrome.tabs.move($movable[i].tabId, {
						windowId : toWinId,
						index : -1
					}, function(tab) {
					})
					//will trigger tabDetached, then tabAttached

				} else {
					//stored tab

					var data_1_WinObj_from_winId
					//stored tab, toWin

					//copy tab ptr from fromWin to toWin
					toWin.TabsStored.push(fromWin.TabsStored[$movable[i].tabIndex * 1])
					toWin.timeLastModified = bg.UNIXtime()
				}
			}//loop thru $movable

			//backward loop thru $movable to remove data
			for (var i = $movable.length - 1; i >= 0; i--) {
				if ($movable[i].TabOpen == true) {
					//open tab

				} else {
					//stored tab

					var data_1_WinObj_from_winId
					//stored tab, fromWin

					//delete tab ptr from fromWin
					fromWin.TabsStored.splice($movable[i].tabIndex, 1)
					fromWin.timeLastModified = toWin.timeLastModified
				}
			}//end backward loop thru $movable

			var data_1_WinObj_from_winId//TabsOpen	//TabsStored
			//see above loops
			var data_2_TabObj_from_tabId
			//open tab, fromWin, only moved => not changed
			//open tab, toWin, only moved => not changed
			//stored tab, fromWin, stored tab => no tabId
			//stored tab, toWin, stored tab => no tabId
			var data_3_winId_from_tabId
			//open tab, fromWin, handled in tabDetached
			//open tab, toWin, handled in tabAttached
			//stored tab, fromWin, no tabId
			//stored tab, toWin, no tabId
			var data_4_WinInfoObj_from_winName
			//open tab, fromWin, handled in tabDetached
			//open tab, toWin, handled in tabAttached
			//stored tab, fromWin
			bg.WinInfoObj_from_winName[fromWinName].timeLastModified = fromWin.timeLastModified
			bg.WinInfoObj_from_winName[fromWinName].numberOfTabsOpen = fromWin.TabsOpen.length
			bg.WinInfoObj_from_winName[fromWinName].numberOfTabsStored = fromWin.TabsStored.length
			//stored tab, toWin
			//bg.WinInfoObj_from_winName[toWinName].timeLastModified = toWin.timeLastModified
			//bg.WinInfoObj_from_winName[toWinName].numberOfTabsOpen = toWin.TabsOpen.length
			//bg.WinInfoObj_from_winName[toWinName].numberOfTabsStored = toWin.TabsStored.length
			//no toWinName
			var data_5_winId_from_winName
			//not affected
			var data_6_winName_from_winId
			//not affected
			var data_7_localStorage
			//all
			localStorage[fromWinName] = bg.stringify(fromWin)
			//localStorage[toWinName] = bg.stringify(toWin)	//no toWinName
			//localStorage['WinInfoObj_from_winName'] = bg.stringify(bg.WinInfoObj_from_winName)
			bg.update_localStorage('WinInfoObj_from_winName')

		}//1B //fromWin open named win, toWin open unnamed win

		var __CASE_1C
		if (CASE == '1C') {//1C //fromWin open named win, toWin closed named win
			//toWin no winName, no winId
			var fromWin = bg.WinObj_from_winId[fromWinId]
			var toWin = bg.parse(localStorage[this.winName])

			var __update_data
			var idsOfTabsToClose = new Array()

			//loop thru $movable
			for (var i = 0; i <= $movable.length - 1; i++) {
				if ($movable[i].TabOpen == true) {
					//open tab

					var data_1_WinObj_from_winId
					//open tab, toWin

					//copy tab ptr from fromWin to toWin
					toWin.TabsOpen.push(fromWin.TabsOpen[$movable[i].tabIndex * 1])
					toWin.timeLastModified = bg.UNIXtime()

					//to close the tabs
					idsOfTabsToClose.push($movable[i].tabId)

				} else {
					//stored tab

					var data_1_WinObj_from_winId
					//stored tab, toWin

					//copy tab ptr from fromWin to toWin
					toWin.TabsStored.push(fromWin.TabsStored[$movable[i].tabIndex * 1])
					toWin.timeLastModified = bg.UNIXtime()
				}
			}//loop thru $movable

			//backward loop thru $movable to remove data
			for (var i = $movable.length - 1; i >= 0; i--) {
				if ($movable[i].TabOpen == true) {
					//open tab

					var data_1_WinObj_from_winId
					//open tab, fromWin

					//delete tab ptr from fromWin
					fromWin.TabsOpen.splice($movable[i].tabIndex, 1)//should be handled in tabRemoved... oh well... better safe...
					fromWin.timeLastModified = toWin.timeLastModified

					var data_2_TabObj_from_tabId
					//open tab, fromWin
					delete bg.TabObj_from_tabId[$movable[i].tabId]

					var data_3_winId_from_tabId
					//open tab, fromWin
					delete bg.winId_from_tabId[$movable[i].tabId]

				} else {
					//stored tab

					var data_1_WinObj_from_winId
					//stored tab, fromWin

					//delete tab ptr from fromWin
					fromWin.TabsStored.splice($movable[i].tabIndex, 1)
					fromWin.timeLastModified = toWin.timeLastModified
				}
			}//end backward loop thru $movable

			var data_1_WinObj_from_winId//TabsOpen	//TabsStored
			//see above loops
			var data_2_TabObj_from_tabId
			//open tab, fromWin; see above loop
			//open tab, toWin, no winId, no tabId
			//stored tab, fromWin, no tabId
			//stored tab, toWin, no winId, no tabId
			var data_3_winId_from_tabId
			//open tab, fromWin; see above loop
			//open tab, toWin, no winId, no tabId
			//stored tab, fromWin, no tabId
			//stored tab, toWin, no winId, no tabId
			var data_4_WinInfoObj_from_winName
			//open tab, fromWin
			//stored tab, fromWin
			bg.WinInfoObj_from_winName[fromWinName].numberOfTabsOpen = fromWin.TabsOpen.length
			bg.WinInfoObj_from_winName[fromWinName].numberOfTabsStored = fromWin.TabsStored.length
			bg.WinInfoObj_from_winName[fromWinName].timeLastModified = fromWin.timeLastModified
			//open tab, toWin
			//stored tab, toWin
			bg.WinInfoObj_from_winName[toWinName].numberOfTabsOpen = toWin.TabsOpen.length
			bg.WinInfoObj_from_winName[toWinName].numberOfTabsStored = toWin.TabsStored.length
			bg.WinInfoObj_from_winName[toWinName].timeLastModified = toWin.timeLastModified
			var data_5_winId_from_winName
			//not affected
			var data_6_winName_from_winId
			//not affected
			var data_7_localStorage
			//all
			localStorage[fromWinName] = bg.stringify(fromWin)
			localStorage[toWinName] = bg.stringify(toWin)
			//localStorage['WinInfoObj_from_winName'] = bg.stringify(bg.WinInfoObj_from_winName)
			bg.update_localStorage('WinInfoObj_from_winName')

			//close the actual tabs
			chrome.tabs.remove(idsOfTabsToClose, function(args) {
			})
		}//1C //fromWin open named win, toWin closed named win

		var __CASE_2A
		if (CASE == '2A') {//2A //fromWin open unnamed win, toWin open named win
			//no fromWinName

			var fromWin = bg.WinObj_from_winId[fromWinId]
			var toWin = bg.WinObj_from_winId[toWinId]

			var __update_data

			//loop thru $movable
			for (var i = 0; i <= $movable.length - 1; i++) {
				if ($movable[i].TabOpen == true) {
					//open tab

					var data_1_WinObj_from_winId//TabsOpen
					//open tab, fromWin
					//open tab, toWin

					//move the tab
					chrome.tabs.move($movable[i].tabId, {
						windowId : toWinId,
						index : -1
					}, function(tab) {
					})
					//will trigger tabDetached, then tabAttached

				} else {
					//stored tab

					var data_1_WinObj_from_winId//TabsStored
					//stored tab, toWin

					//copy tab ptr from fromWin to toWin
					toWin.TabsStored.push(fromWin.TabsStored[$movable[i].tabIndex * 1])
					toWin.timeLastModified = bg.UNIXtime()
				}
			}//loop thru $movable

			//backward loop thru $movable to remove data
			for (var i = $movable.length - 1; i >= 0; i--) {
				if ($movable[i].TabOpen == true) {
					//open tab

				} else {
					//stored tab

					var data_1_WinObj_from_winId//TabsStored
					//stored tab, fromWin

					//delete tab ptr from fromWin
					fromWin.TabsStored.splice($movable[i].tabIndex, 1)
					fromWin.timeLastModified = toWin.timeLastModified
				}
			}//end backward loop thru $movable

			var data_1_WinObj_from_winId//TabsOpen	//TabsStored
			//see above loops
			var data_2_TabObj_from_tabId
			//open tab, fromWin, not changed
			//open tab, toWin, not changed
			//stored tab, fromWin, no tabId
			//stored tab, toWin, no tabId
			var data_3_winId_from_tabId
			//open tab, fromWin, handled in tabDetached
			//open tab, toWin, handled in tabAttached
			//stored tab, fromWin, no tabId
			//stored tab, toWin, no tabId
			var data_4_WinInfoObj_from_winName
			//open tab, fromWin, handled in tabDetached
			//stored tab, fromWin
			/*
			bg.WinInfoObj_from_winName[fromWinName].timeLastModified = fromWin.timeLastModified
			bg.WinInfoObj_from_winName[fromWinName].numberOfTabsOpen = fromWin.TabsOpen.length
			bg.WinInfoObj_from_winName[fromWinName].numberOfTabsStored = fromWin.TabsStored.length
			*/		//no fromWinName
			//open tab, toWin, handled in tabAttached
			//stored tab, toWin
			bg.WinInfoObj_from_winName[toWinName].timeLastModified = toWin.timeLastModified
			bg.WinInfoObj_from_winName[toWinName].numberOfTabsOpen = toWin.TabsOpen.length
			bg.WinInfoObj_from_winName[toWinName].numberOfTabsStored = toWin.TabsStored.length
			var data_5_winId_from_winName
			//open tab, fromWin, no change
			//open tab, toWin, no change
			//stored tab, fromWin, no change
			//stored tab, toWin, no change
			var data_6_winName_from_winId
			//open tab, fromWin, no change
			//open tab, toWin, no change
			//stored tab, fromWin, no change
			//stored tab, toWin, no change
			var data_7_localStorage
			//all
			//localStorage[fromWinName] = bg.stringify(fromWin)	//no fromWinName
			localStorage[toWinName] = bg.stringify(toWin)
			//localStorage['WinInfoObj_from_winName'] = bg.stringify(bg.WinInfoObj_from_winName)
			bg.update_localStorage('WinInfoObj_from_winName')

		}//2A //fromWin open unnamed win, toWin open named win

		var __CASE_2B
		if (CASE == '2B') {//2B //fromWin open unnamed win, toWin open unnamed win
			//no fromWinName, no toWinName

			var fromWin = bg.WinObj_from_winId[fromWinId]
			var toWin = bg.WinObj_from_winId[toWinId]

			var __update_data

			//loop thru $movable
			for (var i = 0; i <= $movable.length - 1; i++) {
				if ($movable[i].TabOpen == true) {
					//open tab

					var data_1_WinObj_from_winId
					//open tab, fromWin
					//open tab, toWin

					//move the tab
					chrome.tabs.move($movable[i].tabId, {
						windowId : toWinId,
						index : -1
					}, function(tab) {
					})
					//will trigger tabDetached, then tabAttached

				} else {
					//stored tab

					var data_1_WinObj_from_winId
					//stored tab, toWin

					//copy tab ptr from fromWin to toWin
					toWin.TabsStored.push(fromWin.TabsStored[$movable[i].tabIndex * 1])
					toWin.timeLastModified = bg.UNIXtime()
				}
			}//loop thru $movable

			//backward loop thru $movable to remove data
			for (var i = $movable.length - 1; i >= 0; i--) {
				if ($movable[i].TabOpen == true) {
					//open tab

				} else {
					//stored tab

					var data_1_WinObj_from_winId
					//stored tab, fromWin

					//delete tab ptr from fromWin
					fromWin.TabsStored.splice($movable[i].tabIndex, 1)
					fromWin.timeLastModified = toWin.timeLastModified
				}
			}//end backward loop thru $movable

			var data_2_TabObj_from_tabId
			//open tab, fromWin, tabId not changed
			//open tab, toWin, tabId not changed
			//stored tab, fromWin, tabId not changed
			//stored tab, toWin, tabId not changed
			var data_3_winId_from_tabId
			//open tab, fromWin, handled in tabDetached
			//open tab, toWin, handled in tabAttached
			//stored tab, fromWin; stored tab no tabId
			//stored tab, toWin; stored tab no tabId
			var data_4_WinInfoObj_from_winName
			//open tab, fromWin, handled in tabDetached
			//open tab, toWin, handled in tabAttached
			//stored tab, fromWin
			/*
			bg.WinInfoObj_from_winName[fromWinName].timeLastModified = fromWin.timeLastModified
			bg.WinInfoObj_from_winName[fromWinName].numberOfTabsOpen = fromWin.TabsOpen.length
			bg.WinInfoObj_from_winName[fromWinName].numberOfTabsStored = fromWin.TabsStored.length
			*/		//no fromWinName
			//stored tab, toWin
			/*
			bg.WinInfoObj_from_winName[toWinName].timeLastModified = toWin.timeLastModified
			bg.WinInfoObj_from_winName[toWinName].numberOfTabsOpen = toWin.TabsOpen.length
			bg.WinInfoObj_from_winName[toWinName].numberOfTabsStored = toWin.TabsStored.length
			*/		//no toWinName
			var data_5_winId_from_winName
			//open tab, fromWin, no change
			//open tab, toWin, no change
			//stored tab, fromWin, no change
			//stored tab, toWin, no change
			//no fromWinName, no toWinName
			var data_6_winName_from_winId
			//open tab, fromWin, no change
			//open tab, toWin, no change
			//stored tab, fromWin, no change
			//stored tab, toWin, no change
			//no fromWinName, no toWinName
			var data_7_localStorage
			//all
			//localStorage[fromWinName] = bg.stringify(fromWin)	//no fromWinName
			//localStorage[toWinName] = bg.stringify(toWin) //no toWinName
			////localStorage['WinInfoObj_from_winName'] = bg.stringify(bg.WinInfoObj_from_winName)
			//bg.update_localStorage('WinInfoObj_from_winName')

		}//2B //fromWin open unnamed win, toWin open unnamed win

		var __CASE_2C
		if (CASE == '2C') {//2C //fromWin open unnamed win, toWin closed named win
			//yes fromWinId
			//no fromWinName
			//no toWinId
			//yes toWinName

			var fromWin = bg.WinObj_from_winId[fromWinId]
			var toWin = bg.parse(localStorage[toWinName])

			var __update_data
			var idsOfTabsToClose = new Array()

			//loop thru $movable
			for (var i = 0; i <= $movable.length - 1; i++) {
				if ($movable[i].TabOpen == true) {
					//open tab

					var data_1_WinObj_from_winId
					//open tab, toWin

					//copy tab ptr from fromWin to toWin
					toWin.TabsOpen.push(fromWin.TabsOpen[$movable[i].tabIndex * 1])
					toWin.timeLastModified = bg.UNIXtime()

					//to close the tabs
					idsOfTabsToClose.push($movable[i].tabId)

				} else {
					//stored tab

					var data_1_WinObj_from_winId
					//stored tab, toWin

					//copy tab ptr from fromWin to toWin
					toWin.TabsStored.push(fromWin.TabsStored[$movable[i].tabIndex * 1])
					toWin.timeLastModified = bg.UNIXtime()
				}
			}//loop thru $movable

			//backward loop thru $movable to remove data
			for (var i = $movable.length - 1; i >= 0; i--) {
				if ($movable[i].TabOpen == true) {
					//open tab

					var data_1_WinObj_from_winId
					//open tab, fromWin

					//delete tab ptr from fromWin
					fromWin.TabsOpen.splice($movable[i].tabIndex, 1)//should be handled in tabRemoved... oh well... better safe...
					fromWin.timeLastModified = toWin.timeLastModified

					var data_2_TabObj_from_tabId
					//open tab, fromWin
					delete bg.TabObj_from_tabId[$movable[i].tabId]

					var data_3_winId_from_tabId
					//open tab, fromWin
					delete bg.winId_from_tabId[$movable[i].tabId]

				} else {
					//stored tab

					var data_1_WinObj_from_winId
					//stored tab, fromWin

					//delete tab ptr from fromWin
					fromWin.TabsStored.splice($movable[i].tabIndex, 1)
					fromWin.timeLastModified = toWin.timeLastModified
				}
			}//end backward loop thru $movable

			var data_2_TabObj_from_tabId
			//open tab, fromWin
			//see inside loop $movable
			//open tab, toWin, no winId, no tabId
			//stored tab, fromWin, no tabId
			//stored tab, toWin, no winId, no tabId
			var data_3_winId_from_tabId
			//open tab, fromWin
			//see inside loop $movable
			//open tab, toWin, no winId, no tabId
			//stored tab, fromWin, no tabId
			//stored tab, toWin, no winId, no tabId
			var data_4_WinInfoObj_from_winName
			//open tab, fromWin
			//stored tab, fromWin
			/*
			bg.WinInfoObj_from_winName[fromWinName].numberOfTabsOpen = fromWin.TabsOpen.length
			bg.WinInfoObj_from_winName[fromWinName].numberOfTabsStored = fromWin.TabsStored.length
			bg.WinInfoObj_from_winName[fromWinName].timeLastModified = fromWin.timeLastModified
			*/ //no fromWinName
			//open tab, toWin
			//stored tab, toWin
			bg.WinInfoObj_from_winName[toWinName].numberOfTabsOpen = toWin.TabsOpen.length
			bg.WinInfoObj_from_winName[toWinName].numberOfTabsStored = toWin.TabsStored.length
			bg.WinInfoObj_from_winName[toWinName].timeLastModified = toWin.timeLastModified
			var data_5_winId_from_winName
			//open tab, fromWin, no change, no winName
			//open tab, toWin, no change, no winId
			//stored tab, fromWin, no change, no winName
			//stored tab, toWin, no change, no winId
			var data_6_winName_from_winId
			//open tab, fromWin, no change, no winName
			//open tab, toWin, no change, no winId
			//stored tab, fromWin, no change, no winName
			//stored tab, toWin, no change, no winId
			var data_7_localStorage
			//all
			//localStorage[fromWinName] = bg.stringify(fromWin) //no fromWinName
			localStorage[toWinName] = bg.stringify(toWin)
			//localStorage['WinInfoObj_from_winName'] = bg.stringify(bg.WinInfoObj_from_winName)
			bg.update_localStorage('WinInfoObj_from_winName')

			//close the actual tabs
			chrome.tabs.remove(idsOfTabsToClose, function(args) {
			})
		}//2C //fromWin open unnamed win, toWin closed named win

		var __CASE_3A
		if (CASE == '3A') {//3A //fromWin closed named win, toWin open named win
			//no fromWinId
			//yes fromWinName
			//yes toWinId
			//yes toWinName

			var fromWin = bg.parse(localStorage[fromWinName])
			var toWin = bg.WinObj_from_winId[toWinId]

			var __update_data

			//loop thru $movable
			for (var i = 0; i <= $movable.length - 1; i++) {
				if ($movable[i].TabOpen == true) {
					//open tab

					var data_1_WinObj_from_winId//TabsOpen
					//open tab, toWin
					//handled by tabCreated, then the callback

					//MAKE new tab in toWin; because there is REAL tab in closed named window for moving
					chrome.tabs.create({
						windowId : toWinId,
						url : $movable[i].url,
						active : false
					}, function(tab) {

						//copy over old metadata
						var Tab = bg.TabObj_from_tabId[tab.id]
						console.logg('handle_tree_item_drop case 3A debug; Tab = ', Tab, 'tab = ', tab)
						Tab.timeLastClosed = $movable[i].timeLastClosed//copy
						//Tab.timeLastModified = bg.UNIXtime()	//handled in tabCreated
						//Tab.timeLastOpened = bg.UNIXtime()	//handled in tabCreated
						//Tab.id = tab.id //handled in tabCreated
						Tab.label = $movable[i].label//copy
						//Tab.title = $movable[i].title //do not copy, may have updated
						//Tab.url = $movable[i].url //do not copy, may have updated

						toWin.timeLastModified = bg.UNIXtime()
					})//tabs create
				} else {
					//stored tab

					var data_1_WinObj_from_winId//TabsStored
					//stored tab, toWin

					//copy tab ptr from fromWin to toWin
					toWin.TabsStored.push(fromWin.TabsStored[$movable[i].tabIndex * 1])
					toWin.timeLastModified = bg.UNIXtime()
				}
			}//loop thru $movable

			//backward loop thru $movable to remove data
			for (var i = $movable.length - 1; i >= 0; i--) {
				if ($movable[i].TabOpen == true) {
					//open tab

					var data_1_WinObj_from_winId//TabsOpen
					//open tab, fromWin

					fromWin.TabsOpen.splice($movable[i].tabIndex, 1)
					fromWin.timeLastModified = toWin.timeLastModified

				} else {
					//stored tab

					var data_1_WinObj_from_winId//TabsStored
					//stored tab, fromWin

					fromWin.TabsStored.splice($movable[i].tabIndex, 1)
					fromWin.timeLastModified = toWin.timeLastModified
				}
			}//end backward loop thru $movable

			var data_1_WinObj_from_winId//TabsOpen	//TabsStored
			//see above loops
			var data_2_TabObj_from_tabId
			//open tab, fromWin, closed win => no tabId
			//open tab, toWin, handled in tabCreated
			//stored tab, fromWin, closed win => no tabId
			//stored tab, toWin, stored tab => not tabId
			var data_3_winId_from_tabId
			//open tab, fromWin, closed win => no tabId
			//open tab, toWin, handled in tabCreated
			//stored tab, fromWin, closed win => no tabId
			//stored tab, toWin, stored tab => not tabId
			var data_4_WinInfoObj_from_winName
			//open tab, fromWin
			//stored tab, fromWin
			bg.WinInfoObj_from_winName[fromWinName].timeLastModified = fromWin.timeLastModified
			bg.WinInfoObj_from_winName[fromWinName].numberOfTabsOpen = fromWin.TabsOpen.length
			bg.WinInfoObj_from_winName[fromWinName].numberOfTabsStored = fromWin.TabsStored.length
			//open tab, toWin
			//stored tab, toWin
			bg.WinInfoObj_from_winName[toWinName].timeLastModified = toWin.timeLastModified
			bg.WinInfoObj_from_winName[toWinName].numberOfTabsOpen = toWin.TabsOpen.length
			bg.WinInfoObj_from_winName[toWinName].numberOfTabsStored = toWin.TabsStored.length
			var data_5_winId_from_winName
			//not affected
			var data_6_winName_from_winId
			//not affected
			var data_7_localStorage
			//all
			localStorage[fromWinName] = bg.stringify(fromWin)
			localStorage[toWinName] = bg.stringify(toWin)
			//localStorage['WinInfoObj_from_winName'] = bg.stringify(bg.WinInfoObj_from_winName)
			bg.update_localStorage('WinInfoObj_from_winName')

		}//3A //fromWin closed named win, toWin open named win

		var __CASE_3B
		if (CASE == '3B') {//3B //fromWin closed named win, toWin open unnamed win
			//no fromWinId
			//yes fromWinName
			//yes toWinId
			//no toWinName

			var fromWin = bg.parse(localStorage[fromWinName])
			var toWin = bg.WinObj_from_winId[toWinId]

			var __update_data

			//forward loop thru $movable
			for (var i = 0; i <= $movable.length - 1; i++) {
				if ($movable[i].TabOpen == true) {
					//open tab

					var data_1_WinObj_from_winId//TabsOpen
					//open tab, toWin
					//handled by tabCreated, then the callback

					//MAKE new tab in toWin; because there is REAL tab in closed named window for moving
					chrome.tabs.create({
						windowId : toWinId,
						url : $movable[i].url,
						active : false
					}, function(tab) {

						//copy over old metadata
						var Tab = bg.TabObj_from_tabId[tab.id]
						console.logg('handle_tree_item_drop case 3A debug; Tab = ', Tab, 'tab = ', tab)
						Tab.timeLastClosed = $movable[i].timeLastClosed//copy
						//Tab.timeLastModified = bg.UNIXtime()	//handled in tabCreated
						//Tab.timeLastOpened = bg.UNIXtime()	//handled in tabCreated
						//Tab.id = tab.id //handled in tabCreated
						Tab.label = $movable[i].label//copy
						//Tab.title = $movable[i].title //do not copy, may have updated
						//Tab.url = $movable[i].url //do not copy, may have updated

						toWin.timeLastModified = bg.UNIXtime()
					})//tabs create
				} else {
					//stored tab

					var data_1_WinObj_from_winId//TabsStored
					//stored tab, toWin

					//copy tab ptr from fromWin to toWin
					toWin.TabsStored.push(fromWin.TabsStored[$movable[i].tabIndex * 1])
					toWin.timeLastModified = bg.UNIXtime()
				}
			}//loop thru $movable

			//backward loop thru $movable to remove data
			for (var i = $movable.length - 1; i >= 0; i--) {
				if ($movable[i].TabOpen == true) {
					//open tab

					var data_1_WinObj_from_winId//TabsOpen
					//open tab, fromWin

					fromWin.TabsOpen.splice($movable[i].tabIndex, 1)
					fromWin.timeLastModified = toWin.timeLastModified

				} else {
					//stored tab

					var data_1_WinObj_from_winId//TabsStored
					//stored tab, fromWin

					fromWin.TabsStored.splice($movable[i].tabIndex, 1)
					fromWin.timeLastModified = toWin.timeLastModified
				}
			}//end backward loop thru $movable

			var data_1_WinObj_from_winId//TabsOpen	//TabsStored
			//see above loops
			var data_2_TabObj_from_tabId
			//open tab, fromWin, closed win => no tabId
			//open tab, toWin, handled in tabCreated
			//stored tab, fromWin, closed win => no tabId
			//stored tab, toWin, stored tab => not tabId
			var data_3_winId_from_tabId
			//open tab, fromWin, closed win => no tabId
			//open tab, toWin, handled in tabCreated
			//stored tab, fromWin, closed win => no tabId
			//stored tab, toWin, stored tab => not tabId
			var data_4_WinInfoObj_from_winName
			//open tab, fromWin
			//stored tab, fromWin
			bg.WinInfoObj_from_winName[fromWinName].timeLastModified = fromWin.timeLastModified
			bg.WinInfoObj_from_winName[fromWinName].numberOfTabsOpen = fromWin.TabsOpen.length
			bg.WinInfoObj_from_winName[fromWinName].numberOfTabsStored = fromWin.TabsStored.length
			//open tab, toWin
			//stored tab, toWin
			/*
			bg.WinInfoObj_from_winName[toWinName].timeLastModified = toWin.timeLastModified
			bg.WinInfoObj_from_winName[toWinName].numberOfTabsOpen = toWin.TabsOpen.length
			bg.WinInfoObj_from_winName[toWinName].numberOfTabsStored = toWin.TabsStored.length
			*/ //open unnamed window => no toWinName
			var data_5_winId_from_winName
			//not affected
			var data_6_winName_from_winId
			//not affected
			var data_7_localStorage
			//all
			localStorage[fromWinName] = bg.stringify(fromWin)
			//localStorage[toWinName] = bg.stringify(toWin) //open unnamed window => no toWinName
			//localStorage['WinInfoObj_from_winName'] = bg.stringify(bg.WinInfoObj_from_winName)
			bg.update_localStorage('WinInfoObj_from_winName')

		}//3B //fromWin closed named win, toWin open unnamed win

		var __CASE_3C
		if (CASE == '3C') {//3C //fromWin closed named win, toWin closed named win
			//no fromWinId
			//yes fromWinName
			//no toWinId
			//yes toWinName

			var fromWin = bg.parse(localStorage[fromWinName])
			var toWin = bg.parse(localStorage[toWinName])

			var __update_data

			//push data from fromWin to toWin

			//forward loop thru $movable to copy data
			for (var i = 0; i <= $movable.length - 1; i++) {
				if ($movable[i].TabOpen == true) {
					//case: open tab, fromWin

					var data_1_WinObj_from_winId//TabsOpen
					//data: open tab, toWin

					//copy tab ptr from fromWin to toWin
					toWin.TabsOpen.push(fromWin.TabsOpen[$movable[i].tabIndex * 1])
					toWin.timeLastModified = bg.UNIXtime()

				} else {
					//case: stored tab, fromWin

					var data_1_WinObj_from_winId//TabsStored
					//data: stored tab, toWin

					//copy tab ptr from fromWin to toWin
					toWin.TabsStored.push(fromWin.TabsStored[$movable[i].tabIndex * 1])
					toWin.timeLastModified = bg.UNIXtime()
				}
			}//loop thru $movable

			//backward loop thru $movable to remove data
			for (var i = $movable.length - 1; i >= 0; i--) {
				if ($movable[i].TabOpen == true) {
					//case: open tab

					var data_1_WinObj_from_winId//TabsOpen
					//data: open tab, fromWin

					//delete tab ptr from fromWin
					fromWin.TabsOpen.splice($movable[i].tabIndex, 1)
					fromWin.timeLastModified = toWin.timeLastModified

				} else {
					//case: stored tab

					var data_1_WinObj_from_winId//TabsStored
					//data: stored tab, fromWin

					//delete tab ptr from fromWin
					fromWin.TabsStored.splice($movable[i].tabIndex, 1)
					fromWin.timeLastModified = toWin.timeLastModified
				}
			}//end backward loop thru $movable

			var data_2_TabObj_from_tabId
			//open tab, fromWin  //no winId, no tabId
			//open tab, toWin //no winId, no tabId
			//stored tab, fromWin	//no tabId
			//stored tab, toWin	//no winId, no tabId
			var data_3_winId_from_tabId
			//open tab, fromWin	//no winId
			//open tab, toWin  //no winId
			//stored tab, fromWin //no winId
			//stored tab, toWin //no winId
			var data_4_WinInfoObj_from_winName
			//open tab, fromWin
			//stored tab, fromWin
			bg.WinInfoObj_from_winName[fromWinName].numberOfTabsOpen = fromWin.TabsOpen.length
			bg.WinInfoObj_from_winName[fromWinName].numberOfTabsStored = fromWin.TabsStored.length
			bg.WinInfoObj_from_winName[fromWinName].timeLastModified = fromWin.timeLastModified
			//open tab, toWin
			//stored tab, toWin
			bg.WinInfoObj_from_winName[toWinName].numberOfTabsOpen = toWin.TabsOpen.length
			bg.WinInfoObj_from_winName[toWinName].numberOfTabsStored = toWin.TabsStored.length
			bg.WinInfoObj_from_winName[toWinName].timeLastModified = toWin.timeLastModified
			var data_5_winId_from_winName
			//open tab, fromWin //no winId
			//open tab, toWin //no winId
			//stored tab, fromWin //no winId
			//stored tab, toWin //no winId
			var data_6_winName_from_winId
			//open tab, fromWin //no winId
			//open tab, toWin //no winId
			//stored tab, fromWin //no winId
			//stored tab, toWin //no winId; unchanged even if there is winId
			var data_7_localStorage
			//all
			localStorage[fromWinName] = bg.stringify(fromWin)
			localStorage[toWinName] = bg.stringify(toWin)
			//localStorage['WinInfoObj_from_winName'] = bg.stringify(bg.WinInfoObj_from_winName)
			bg.update_localStorage('WinInfoObj_from_winName')

		}//3C //fromWin closed named win, toWin closed named win

		var __update_save
		/*
		fromWin.timeLastModified = bg.UNIXtime()
		toWin.timeLastModified = bg.UNIXtime()
		if (bg.isNamedWinName(fromWinName)) {
		bg.WinInfoObj_from_winName[fromWinName].numberOfTabsOpen = fromWin.TabsOpen.length
		bg.WinInfoObj_from_winName[fromWinName].numberOfTabsStored = fromWin.TabsStored.length
		localStorage[fromWinName] = bg.stringify(fromWin)
		}
		if (bg.isNamedWinName(toWinName)) {
		bg.WinInfoObj_from_winName[toWinName].numberOfTabsOpen = toWin.TabsOpen.length
		bg.WinInfoObj_from_winName[toWinName].numberOfTabsStored = toWin.TabsStored.length
		localStorage[toWinName] = bg.stringify(toWin)
		}
		localStorage.WinInfoObj_from_winName = bg.stringify(bg.WinInfoObj_from_winName)
		*/
		//already saved inside CASE blocks

		var __reload_list_after_list_items_moved
		setTimeout(function() {
			$('.folderOpen').trigger('click')
		}, 100);

	}

	var __dragged_are_list_items_end

}//end handle_tree_item_drop()

function handle_list_header_drop(evt, ui) {//switch columns
	if ($(this).hasClass('mouseover') == false) {
		return
	}
	console.logg("handle_list_header_drop; evt = ", evt, ' , ui = ', ui)
	console.logg("this = ", this, " , this.hasClass('mouseover') = ", $(this).hasClass('mouseover'))

	var $draggable = ui.draggable
	var $droppable = $(this)
	console.logg('handle_list_header_drop ; $draggable = ', $draggable, ' $droppable = ', $droppable)

	//switch columns
	if ($draggable.hasClass('headerClass list'))//only works if list class is added after headerClass
	{
		switchColumns($draggable.parent(), $droppable.parent())
	}

}//handle_list_header_drop

function handle_list_item_drop(evt, ui) {//switch listItems if one list item drops onto another list item
	if ($(this).hasClass('mouseover') == false) {
		return
	}
	console.logg("handle_list_item_drop; evt = ", evt, ' , ui = ', ui)
	console.logg("this = ", this, " , this.hasClass('mouseover') = ", $(this).hasClass('mouseover'))

	var $draggable = ui.draggable
	var $droppable = $(this)
	console.logg('handle_list_item_drop ; $draggable = ', $draggable, ' $droppable = ', $droppable)

}

function switchColumns(col1, col2) {//used in handle_tree_header_drop, handle_list_header_drop

	//props
	if ($(col1).hasClass('tree')) {
		var props = ['class', 'innerText']
	} else {
		var props = ['class', 'innerText', 'TabOpen', 'tabIndex', 'windowName']
	}
	//don't switch id, may mess up autoPosition...?

	//childrens
	var childrens1 = $(col1).children()
	var childrens2 = $(col2).children()

	//switch contents; contents only
	var tempProp
	for (var i = 0; i <= childrens2.length - 1; i++) {//if childrens1, will copy temp cloned draggable helper?
		for (var j in props) {
			tempProp = $(childrens2[i]).prop(props[j])
			$(childrens2[i]).prop(props[j], $(childrens1[i]).prop(props[j]))
			$(childrens1[i]).prop(props[j], tempProp)
		}
	}

	//switch widths
	tempProp = $(col1).width()
	$(col1).width($(col2).width())
	$(col2).width(tempProp)
	//update all resizers positions
	if ($(col1).hasClass('tree')) {
		$('#div3tree').scroll()
	} else {
		$('#div3list').scroll()
	}
	//switch order in settings
	if ($(col1).hasClass('tree')) {
		var index1 = settings.treeColsOrder.indexOf($(col1).children()[0].innerText)
		var index2 = settings.treeColsOrder.indexOf($(col2).children()[0].innerText)
		tempProp = settings.treeColsOrder[index1]
		settings.treeColsOrder[index1] = settings.treeColsOrder[index2]
		settings.treeColsOrder[index2] = tempProp
	} else {
		var index1 = settings.listColsOrder.indexOf($(col1).children()[0].innerText)
		var index2 = settings.listColsOrder.indexOf($(col2).children()[0].innerText)
		tempProp = settings.listColsOrder[index1]
		settings.listColsOrder[index1] = settings.listColsOrder[index2]
		settings.listColsOrder[index2] = tempProp
	}

	//save settings
	localStorage._managerSettings = bg.stringify(settings)

}//switchColumns

//1111111111111111111111111111111111111111111111111111
var __helperFunctions

function getHostname(url) {
	//localhost url
	if (url.indexOf('///') >= 0) {
		return 'localHost'
	}

	//suspended url
	//eg great suspender url chrome-extension://klbibkeccnjlkjkiokjodocebajanakg/suspended.html#url=http%3A%2F%2Fwww.dm5.com%2Fm188243%2F
	//if(url.indexOf('/suspended.html#url=')){
	if (url.indexOf('chrome-extension') == 0) {//optimize?
		var splits = url.split('/suspended.html#url=')
		if (splits.length > 1) {
			url = unescape(splits[1])
			//nor url is a normal url; leave resolution to...
		}
	}

	//normal url
	var arr = url.split("//")
	arr = arr[1].split("/")
	if (arr[0].indexOf("www.") == 0) {
		arr = arr[0].split("www.")
		return arr[1]
	} else {
		return arr[0]
	}

}
