var background
/*
//load
show thank you page
setDefaults()

//bg vars
TabObj_from_tabId = new Object
WinObj_from_winId = new Object
winId_from_tabId = new Object
winId_from_winName = new Object
load WinInfoObj_from_winName from localStorage	//WinInfoObj_from_winName = parse(localStorage['WinInfoObj_from_winName'])\
//ptrs to bgVars
__bgVars._data_1_WinObj_from_winId = WinObj_from_winId	//WinClass
__bgVars._data_2_TabObj_from_tabId = TabObj_from_tabId	//TabClass
__bgVars._data_3_winId_from_tabId = winId_from_tabId
__bgVars._data_4_WinInfoObj_from_winName = WinInfoObj_from_winName	//WinInfoClass
__bgVars._data_5_winId_from_winName = winId_from_winName 
__bgVars._data_6_winName_from_winId = winName_from_winId
__bgVars._data_7_localStorage = localStorage

//update at load
chrome.windows.getAll	//get ALL windows //update chrome state vars
	update WinObj_from_winId, TabObj_from_tabId, winId_from_tabId
	
//classes
TabClass()	//Tab
WinClass()	//Win
WinInfoClass()	//WinLocalObj

//browser events
windowCreated()
	createIfNoWinObj_from_winId(winId)
	createIfNoWinInfoObjObj_from_winName(getWinName(winId))
	update data 1
	winName_from_winId[winId]
		update data 4-7
	updateBadge(winId)

windowFocusChanged
	updateBadge(winId)
	
windowRemoved
	delete data 2,3,1,5,6

tabAttached()
	createIfNoTabObj_from_tabId(tabId)
	createIfNoWinObj_from_winId(winId)
	createIfNoWinInfoObjObj_from_winName(getWinName(winId))
	update data 1-3
	winName_from_winId[winId]
		updata data 4-7
	updateBadge(winId)
	
tabCreated()
	createIfNoTabObj_from_tabId(tabId)
	createIfNoWinObj_from_winId(winId)
	createIfNoWinInfoObjObj_from_winName(getWinName(winId))
	new TabClass()
	update data 1-3
	winName_from_winId[winId]
		updata data 4-7
	updateBadge(winId)

tabDetached()
	update data 1-3
	winName_from_winId[winId]
		updata data 4-7

tabMoved
	update data 1-3
	winName_from_winId[winId]
		updata data 4-7

tabRemoved
	//if windown closing
		//let windowRemoved handle this
	//if not closing
		update data 1-7
		updateBadge
	
tabSelectionChanged
	updateBadge(winId)
	
tabUpdated
	update data 1-3
	winName_from_winId[winId]
		updata data 4-7
	updateBadge(winId)

	
//user events
//save window as new folder	//called from popup
saveWindowWithLocalStorage(winId, winName)	//from popup
	chk if winName already exists
		if winName already exists
			generate newWinName
			saveWindowWithLocalStorage(winId, newWinName)
			return 0 to exit
		return 0 to exit
	chrome.windows.get(.....)
		update data 1-7
		updateBadge(winId)
		

openWindow(winName)	//called from popup
	WinFromStorage = parse(localStorage[winName])
	var urls = new Array()
		populate urls Array
	chrome.windows.create({	url: urls //THE ORDER is windowCreated, tabCreated,  tabSelectionChanged, openWindow callback, tabUpdated
		//callback
		createIfNoWinObj_from_winId(winId)
		createIfNoWinInfoObjObj_from_winName(getWinName(winId))
		update data 1-6
			createIfNoTabObj_from_tabId(tabId) inside WinObj.TabsOpen for loop
		updateBadge(winId)

storeTabsInCurrentWindow(winId)
	
*/




var manager
/*
//load
$(document).ready()
	ready()

run_at_ready()
	__get_managerSettings
		parse(localStorage._managerSettings)
	__div3splitter_drag_listener_handler
		initialize splitter //$("#div3splitter")...
	__auto_positions
		position divs using jquery autoposition plugin
		divs.autoPosition()
	__populate
		createDisplay_tree_headers()
		createDisplay_list_headers()
		createDisplay_tree_items()
	__restorePositionalSettings
		restore positional settings from localStorage
	__droppableFix
		$('*').live('mouseover'... to add class 'mouseover' to element just under cursor
	__listItemsBehaviors
		listen_for_and_handle_list_items_select()
		listen_for_list_item_rename()
		listen_for_list_items_delete()
	__treeItemsBehaviors
		listen_for_tree_item_delete()
		listen_for_tree_item_rename()
	__fixNoBadge
		chrome.windows.getCurrent
			bg.updateBadge(window.id)
	__open_folder_to_current_window
		

createDisplay_tree_items()	//called by run_at_ready()
	add tree headers
	add context menu for tree headers
	add draggable to tree headers
	add droppable handler to tree headers
		handle_tree_header_drop()
	__add_tree_items
	__populate_tree_with_winNames
		if open named window 
			printWinName()
		if open unnamed window
			printWinId()
		if closed named window
			printWinName()
				on tree item/WinName clicked
					handle_tree_item_clicked()	//populate list
				on tree item/WinName dblClicked 
					handle_tree_item_double_clicked()	//opens or focus on window
	add col resizers to tree cols
	add context menu for tree items/window names //$('.tree.item.name')
	add draggable to $('.tree.item.name')
	add droppable to $('.tree.item.name')
		handle_tree_item_drop()
end createDisplay_tree_items()	


createDisplay_tree_headers()  //called by ready()
	add list headers
	add col resizers to list cols
	add context menu to list headers
	add draggable to list headers
	add droppable to list headers //calls handle_list_header_drop()
end	

__user_event_handlers

createDisplay_list_items() //called by tree item/WinName clicked
	//mark tree item
	

listen_for_and_handle_list_items_select() //called by ready()
	remove selected class from selected when $("#div1, #div2, #div3list, #div4, #div5").on("click"
	add selected class on $('.list.item.title, .list.item.label').live("click" //with ctrl and shift keys
		add $(".lastClicked") to last clicked $('.list.item.title, .list.item.label')
end


listen_for_list_item_rename() //called by ready()
	enter key pressed => $('.editInput').trigger('blur')
	F2 key pressed => editListItem() //only for $('.list.item.title, .list.item.label') because of .lastClicked...
	editListItem()	//on F2 key pressed OR context menu
		//edits either $('.list.item.title, .list.item.label')
		inputEditFinished(evt) //on input blurred AND enter key pressed
		editInput blurred = > inputEditFinished(evt)
	edit over on blur bug workaround
		//trigger blur on editInput whenever * is clicked
end


//on elements dropped onto tree item name
handle_tree_item_drop() 
	//add tree headers


USER actions
	click
		tree item/WinName clicked => createDisplay_list_items()
	
	drop
		item dropped onto tree item => handle_tree_item_drop()	=> 
	
	enter	
		enter key pressed => $('.editInput').trigger('blur')
	
	F2
		F2 key pressed => editListItem() //only for $('.list.item.title, and label
	
	context menu sort (list items)
		change/update settings in memory
		store settings to localStorage
		refresh page
			page will display with new settings
	
	
	context menu sort (winName items)
		sort winNames; bg.WinInfoObj_from_winName._orderOfNames
		save/store to localStorage
	
	
*/


var popup

/*
//load
chrome.windows.getCurrent(null, callback)
	windowsListPopulate()
		for (var i in listOfWinNames){
			winName = listOfWinNames[i]
			li = $('#namedWindowTemplate').clone()
			append li
			//if winName is open
				add 'open' class
				//if winName is CURRENT window
					remove 'open' class
					add 'current' class
			li.onclick = liClicked

			
			
			

//saveWindowForm Input on submit or blur
saveWindow()
	bg.saveWindowWithLocalStorage()	

			
//liClicked

*/
	
	
	
	
	
	