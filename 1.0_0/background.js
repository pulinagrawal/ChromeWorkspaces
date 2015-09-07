// show thank you page upon first install
if (localStorage.after_install_shown !== "true") {
	localStorage.after_install_shown = "true";
	chrome.tabs.create({
		url : chrome.extension.getURL('after install.html'),
		selected : true
	});
}

///////////////////////////////////////////////////////
var __bgVars = new Object()
/////////////////////////////

//global vars init
//Open Named and Unnamed windows
var TabObj_from_tabId = new Object()//key = tabId, value = ptrs to TabClass objs; the same ptrs also in WinObj.TabsOpen
var WinObj_from_winId = new Object()//key = winId, value = ptrs to WinClass objs	//MAIN obj
var winId_from_tabId = new Object()//key = tabId, value = winId

//Open Named windows
var winId_from_winName = new Object()//key = winName, value = winId
var winName_from_winId = new Object()

//Open Named and Closed Named windows
//saveData vars; save to localStorage
var WinInfoObj_from_winName = new Object()
WinInfoObj_from_winName._orderOfNames = new Array()

//ptrs to bgVars
var data_1_WinObj_from_winId//TabsOpen	//TabsStored
var data_2_TabObj_from_tabId
var data_3_winId_from_tabId
var data_4_WinInfoObj_from_winName
var data_5_winId_from_winName
var data_6_winName_from_winId
var data_7_localStorage

data_1_WinObj_from_winId = WinObj_from_winId
data_2_TabObj_from_tabId = TabObj_from_tabId
data_3_winId_from_tabId = winId_from_tabId
data_4_WinInfoObj_from_winName = WinInfoObj_from_winName
data_5_winId_from_winName = winId_from_winName
data_6_winName_from_winId = winName_from_winId
data_7_localStorage = localStorage

//load data
var __on_load

function setDefaults() {

}

setDefaults()

var __parse_localStorage
if (localStorage['WinInfoObj_from_winName'] != undefined) {
	WinInfoObj_from_winName = parse(localStorage['WinInfoObj_from_winName'])
}

var __update_data_from_all_current_windows_on_load
//update TabObj_from_tabId, WinObj_from_winId, winId_from_tabId
chrome.windows.getAll({
	populate : true
}, function(windows) {
	//console.logg('start; got all windows = ', windows)
	for (var i in windows) {
		var window = windows[i]
		var winId = window.id

		//update bg Vars
		if (1) {
			//WinObj_from_winId
			//data_1 //WinObj_from_winId
			WinObj_from_winId[winId] = new WinClass()
			var WinObj = WinObj_from_winId[winId]
			WinObj.timeLastClosed = 0
			WinObj.timeLastModified = UNIXtime()
			WinObj.timeLastOpened = UNIXtime()

			//WinObj.TabsOpen
			for (var j in window.tabs) {
				var tab = window.tabs[j]
				var tabId = tab.id
				WinObj.TabsOpen[j] = new TabClass()
				var Tab = WinObj.TabsOpen[j]

				Tab.timeLastClosed = 0
				Tab.timeLastModified = UNIXtime()
				Tab.timeLastOpened = UNIXtime()
				Tab.id = tab.id
				Tab.label = ''
				Tab.title = tab.title
				Tab.url = tab.url
				//Tab.windowId = tab.windowId	//moved to winId_from_tabId

				//data_2 //TabObj_from_tabId
				TabObj_from_tabId[tabId] = Tab
				//data_3 //winId_from_tabId
				winId_from_tabId[tabId] = winId

			}//loop thru window.tabs
		}//update bg vars

	}//loop thru windows

	//open starred winNames
	for (var i in WinInfoObj_from_winName._orderOfNames) {
		var winName = WinInfoObj_from_winName._orderOfNames[i]
		if (WinInfoObj_from_winName[winName].starred && WinInfoObj_from_winName[winName].starred == 'starred') {
			//openWindow
			openWindow(winName)
		}
	}

})//chrome.windows.getAll
var __classes
function TabClass() {
	this.timeLastClosed = 0
	this.timeLastModified = 0
	this.timeLastOpened = 0
	this.id = 0
	this.label = ''
	this.title = ''
	this.url = ''
}

function WinClass() {
	this.timeLastClosed = 0
	this.timeLastModified = 0//UNIXtime()
	this.timeLastOpened = 0
	this.TabsOpen = new Array()//key = index, value = ref PTRs to TabClass objs; the same PTRs also in TabObj_from_tabId...
	this.TabsStored = new Array()	//key = index, value = ref PTRs to TabClass objs
}

function WinInfoClass() {//an easily stringified WinClass
	this.starred = ''
	this.timeLastClosed = 0
	this.timeLastModified = 0
	this.timeLastOpened = 0
	this.storageLastModified = 0//time accurate to millisec
	this.numberOfTabsOpen = 0
	this.numberOfTabsStored = 0//used for info in popup for closed named windows
}

//LISTENERS
var __browser_events
function windowCreated(window) {
	//console.logg('windowCreated; arguments = ', arguments)
	var winId = window.id

	//chk
	//createIfNoTabObj_from_tabId(tabId) //...run in tabCreated!!!
	createIfNoWinObj_from_winId(winId)
	createIfNoWinInfoObjObj_from_winName(getWinName(winId))

	//data_1 //WinObj_from_winId
	WinObj_from_winId[winId] = new WinClass()//created in createIfNoWinObj_from_winId
	var WinObj = WinObj_from_winId[winId]//shorthand
	WinObj.timeLastClosed = 0
	WinObj.timeLastModified = UNIXtime()
	WinObj.timeLastOpened = UNIXtime()
	//WinObj.TabsOpen	//will be updated in tabCreated!!!
	for (var i in window.tabs) {

		//tab data will be updated in tabCreated!!!
		/*
		 //data_1 //WinObj_from_winId
		 WinObj.TabsOpen[i] = new TabClass()
		 //data_2 //TabObj_from_tabId
		 TabObj_from_tabId[tabId] = WinObj.TabsOpen[i]

		 var tab = window.tabs[i]
		 var TabObj = WinObj.TabsOpen[i]
		 TabObj.timeLastClosed = 0
		 TabObj.timeLastModified = UNIXtime()
		 TabObj.timeLastOpened = UNIXtime()
		 TabObj.id = tab.id
		 TabObj.label = ''
		 TabObj.title = tab.title
		 TabObj.url = tab.url

		 //data_3 //winId_from_tabId
		 winId_from_tabId[tabId] = winId//Tab.windowId = tab.windowId
		 */

	}
	//WinObj.TabsStored
	//unchanged

	///*
	if (winName_from_winId[winId]) {
		var winName = winName_from_winId[winId]
		//data_4 //WinInfoObj_from_winName
		WinInfoObj_from_winName[winName].timeLastClosed = WinObj_from_winId[winId].timeLastClosed
		WinInfoObj_from_winName[winName].timeLastModified = WinObj_from_winId[winId].timeLastModified
		WinInfoObj_from_winName[winName].timeLastOpened = WinObj_from_winId[winId].timeLastOpened
		WinInfoObj_from_winName[winName].numberOfTabsOpen = WinObj_from_winId[winId].TabsOpen.length
		WinInfoObj_from_winName[winName].numberOfTabsStored
		//data_5 //winId_from_winName
		winId_from_winName[winName] = winId//redun?
		//data_6 //winName_from_winId
		//winName_from_winId[winId] = winName	//redun	//no way to get winName except from winName_from_winId[winId]
		//data_7 //localStorage
		update_localStorage('WinInfoObj_from_winName')
		update_localStorage('winName', winName, winId)
	}
	//*/
	//will overwrite important meta data before the meta data are copied to new WinObj obj in openWindow
	//let openWindow callback handle this

	//console.logg('windowCreated END')

	updateBadge(winId)
}//windowCreated


chrome.windows.onCreated.addListener(windowCreated)

var curFocusedWinId = 0//global var used in updateBadge

function windowFocusChanged(winId) {
	//console.logg('windowFocusChanged; arguments = ', arguments)

	updateBadge(winId)//will often ran too fast and before window is focused...

	//dalayed run
	curFocusedWinId = winId
	//setTimeout(updateBadge, 2000)	//does not work...
	//setTimeout(function(){updateBadge(winId)}, 1000)	//memory leak? creates another closure and winId var within that closure...	//NO, closure should be garbage collected...
	//setTimeout(function(){updateBadge(winId)}, 2000)	//memory leak? creates another closure and winId var within that closure...	//NO, closure should be garbage collected...
	//setTimeout(function(){updateBadge(winId)}, 5000)	//memory leak? creates another closure and winId var within that closure...	//NO, closure should be garbage collected...

}

chrome.windows.onFocusChanged.addListener(windowFocusChanged);

function windowRemoved(winId) {
	//shorthand
	var WinObj = WinObj_from_winId[winId]
	var winName = winName_from_winId[winId]
	//console.logg('windowRemoved; arguments = ', arguments, ' winId = ', winId, 'winName = ', winName, 'WinObj=', WinObj)

	if (!winName) {//open unnamed window
		//no winName

		//update data
		var data_1_WinObj_from_winId
		WinObj.timeLastClosed = UNIXtime()
		WinObj.timeLastModified
		WinObj.timeLastOpened
		var data_2_TabObj_from_tabId
		//handle in tabRemoved
		var data_3_winId_from_tabId
		//handle in tabRemoved
		var data_4_WinInfoObj_from_winName
		/*
		if (WinInfoObj_from_winName[winName]) {
		WinInfoObj_from_winName[winName].timeLastClosed = UNIXtime()
		}
		*///no winName
		var data_5_winId_from_winName
		//no change
		var data_6_winName_from_winId
		//no change
		var data_7_localStorage
		update_localStorage('WinInfoObj_from_winName')
		update_localStorage('winName', winName, winId)

		//delete data
		//data_2 //TabObj_from_tabId
		//data_3 //winId_from_tabId
		/*
		for (var i in WinObj_from_winId.TabsOpen) {
		var tabId = WinObj_from_winId.TabsOpen[i].id

		delete TabObj_from_tabId[tabId]//delete key to Tab

		delete winId_from_tabId[tabId]
		}
		*/ //handle in tabRemoved?

		//data_1 //WinObj_from_winId
		delete WinObj_from_winId[winId]
		//data_4 //WinInfoObj_from_winName
		//do NOT delete, needed even when window is removed!
		//data_5 //winId_from_winName
		//delete winId_from_winName[winName]
		//data_6 //winName_from_winId
		delete winName_from_winId[winId]	//useless
		//data_7 //localStorage
		//do not change local storage even when window is removed
	} else if (winName) {//open named window
		//update data
		var data_1_WinObj_from_winId
		WinObj.timeLastClosed = UNIXtime()
		WinObj.timeLastModified
		WinObj.timeLastOpened
		var data_2_TabObj_from_tabId
		//handle in tabRemoved
		var data_3_winId_from_tabId
		//handle in tabRemoved
		var data_4_WinInfoObj_from_winName
		WinInfoObj_from_winName[winName].timeLastClosed = UNIXtime()
		var data_5_winId_from_winName
		//no change
		var data_6_winName_from_winId
		//no change
		var data_7_localStorage
		update_localStorage('WinInfoObj_from_winName')
		update_localStorage('winName', winName, winId)

		//delete data
		//data_2 //TabObj_from_tabId
		//data_3 //winId_from_tabId
		/*
		for (var i in WinObj_from_winId.TabsOpen) {
		var tabId = WinObj_from_winId.TabsOpen[i].id

		delete TabObj_from_tabId[tabId]//delete key to Tab

		delete winId_from_tabId[tabId]
		}
		*/
		//handle in tabRemoved?
		//data_1 //WinObj_from_winId
		delete WinObj_from_winId[winId]
		//data_4 //WinInfoObj_from_winName
		//do NOT delete, needed even when window is removed!
		//data_5 //winId_from_winName
		delete winId_from_winName[winName]
		//data_6 //winName_from_winId
		delete winName_from_winId[winId]
		//data_7 //localStorage
		//do not change local storage even when window is removed
	}

	updateBadge(winId)

}//windowRemoved


chrome.windows.onRemoved.addListener(windowRemoved)

function tabAttached(tabId, info) {//info = {newPosition, newWindowId}
	//console.logg('tabAttached; arguments = ', arguments)
	var winId = info.newWindowId
	var index = info.newPosition

	//chk
	//createIfNoTabObj_from_tabId(tabId)
	createIfNoWinObj_from_winId(winId)
	createIfNoWinInfoObjObj_from_winName(getWinName(winId))

	//update data
	//data_1 //WinObj_from_winId
	//var TabObj = TabObj_from_tabId[tabId]
	var TabObj = createIfNoTabObj_from_tabId(tabId)
	WinObj_from_winId[winId].TabsOpen.splice(index, 0, TabObj)
	WinObj_from_winId[winId].timeLastModified = UNIXtime()
	//data_2 //TabObj_from_tabId
	//TabObj_from_tabId NOT changed	//only WHERE it is in WinObj is changed
	//data_3 //winId_from_tabId
	winId_from_tabId[tabId] = winId

	if (winName_from_winId[winId]) {
		//data_4 //WinInfoObj_from_winName
		var winName = winName_from_winId[winId]
		WinInfoObj_from_winName[winName].timeLastModified = WinObj_from_winId[winId].timeLastModified
		WinInfoObj_from_winName[winName].numberOfTabsOpen = WinObj_from_winId[winId].TabsOpen.length
		//data_5 //winId_from_winName
		//unchanged
		//data_6 //winName_from_winId
		//unchanged
		//data_7 //localStorage
		update_localStorage('WinInfoObj_from_winName')
		update_localStorage('winName', winName, winId)
	}

	updateBadge(winId)
}

chrome.tabs.onAttached.addListener(tabAttached)

function tabCreated(tab) {//tab.id, .index, .url, .title .windowId
	//console.logg('tabCreated; arguments = ', arguments)
	var winId = tab.windowId
	var tabId = tab.id
	var index = tab.index

	//chk
	//createIfNoTabObj_from_tabId(tabId)
	createIfNoWinObj_from_winId(winId)
	createIfNoWinInfoObjObj_from_winName(getWinName(winId))

	//new Tab
	//var Tab = new TabClass()
	var Tab = createIfNoTabObj_from_tabId(tabId)
	Tab.timeLastClosed = 0
	Tab.timeLastModified = UNIXtime()
	Tab.timeLastOpened = UNIXtime()
	Tab.id = tab.id
	Tab.label = ''
	Tab.title = tab.title
	Tab.url = tab.url

	//data_1 //WinObj_from_winId
	WinObj_from_winId[winId].timeLastModified = UNIXtime()
	WinObj_from_winId[winId].TabsOpen.splice(index, 0, Tab)
	//data_2 //TabObj_from_tabId
	TabObj_from_tabId[tabId] = Tab
	//data_3 //winId_from_tabId
	winId_from_tabId[tabId] = winId//Tab.windowId = tab.windowId

	//console.logg('tabCreated; winId = ', winId, ' , winName_from_winId=', winName_from_winId)

	if (winName_from_winId[winId]) {
		//console.logg('tabCreated; saving start!')
		var winName = winName_from_winId[winId]
		//data_4 //WinInfoObj_from_winName
		WinInfoObj_from_winName[winName].timeLastModified = WinObj_from_winId[winId].timeLastModified
		WinInfoObj_from_winName[winName].numberOfTabsOpen = WinObj_from_winId[winId].TabsOpen.length
		//data_5 //winId_from_winName
		//unchanged
		//data_6 //winName_from_winId
		//unchanged
		//data_7 //localStorage
		update_localStorage('WinInfoObj_from_winName')
		update_localStorage('winName', winName, winId)
	}

	updateBadge(winId)

}//tabCreated


chrome.tabs.onCreated.addListener(tabCreated)

function tabDetached(tabId, info) {//info = {oldPosition, oldWindowId}
	//console.logg('tabDetached; arguments = ', arguments)
	var winId = info.oldWindowId
	var index = info.oldPosition

	//data_1 //WinObj_from_winId
	WinObj_from_winId[winId].timeLastModified = UNIXtime()
	WinObj_from_winId[winId].TabsOpen.splice(index, 1)//remove Tab
	//data_2 //TabObj_from_tabId
	//not changed
	//data_3 //winId_from_tabId
	delete winId_from_tabId[tabId]//detached from win

	if (winName_from_winId[winId]) {//open named window
		var winName = winName_from_winId[winId]
		//data_4 //WinInfoObj_from_winName
		WinInfoObj_from_winName[winName].timeLastModified = WinObj_from_winId[winId].timeLastModified
		WinInfoObj_from_winName[winName].numberOfTabsOpen = WinObj_from_winId[winId].TabsOpen.length
		//data_5 //winId_from_winName
		//unchanged
		//data_6 //winName_from_winId	//winName^WinId
		//unchanged
		//data_7 //localStorage
		update_localStorage('WinInfoObj_from_winName')
		update_localStorage('winName', winName, winId)

	}

	updateBadge(winId)

}

chrome.tabs.onDetached.addListener(tabDetached)

function tabMoved(tabId, info) {//info = {fromIndex, toIndex, windowId}
	//console.logg('tabMoved; arguments = ', arguments)
	var winId = info.windowId
	var fromIndex = info.fromIndex
	var toIndex = info.toIndex
	var Tab = TabObj_from_tabId[tabId]

	//data_1 //WinObj_from_winId
	WinObj_from_winId[winId].timeLastModified = UNIXtime()
	WinObj_from_winId[winId].TabsOpen.splice(fromIndex, 1)//remove PTR
	WinObj_from_winId[winId].TabsOpen.splice(toIndex, 0, Tab)//add back PTR at the right position
	//data_2 //TabObj_from_tabId
	//unchanged
	//data_3 //winId_from_tabId
	winId_from_tabId[tabId] = winId//should really be unchanged; well, just to be safe

	//little changed; can skip
	if (winName_from_winId[winId]) {
		var winName = winName_from_winId[winId]
		//data_4 //WinInfoObj_from_winName
		WinInfoObj_from_winName[winName].timeLastModified = WinObj_from_winId[winId].timeLastModified
		WinInfoObj_from_winName[winName].numberOfTabsOpen = WinObj_from_winId[winId].TabsOpen.length
		//data_5 //winId_from_winName
		//unchanged
		//data_6 //winName_from_winId
		//unchanged
		//data_7 //localStorage
		update_localStorage('WinInfoObj_from_winName')
		update_localStorage('winName', winName, winId)

	}
	updateBadge(winId)
}

chrome.tabs.onMoved.addListener(tabMoved)

function tabRemoved(tabId, info) {//info = {isWindowClosing}
	//console.logg('tabRemoved; arguments = ', arguments)

	if (info.isWindowClosing == true) {
		//let windowRemoved handle this

	} else {
		//window is NOT closing
		//only tab is closing => delete Tab
		var Tab = TabObj_from_tabId[tabId]
		if (!Tab) {
			return
		}//may be handled by closeTab()
		var winId = winId_from_tabId[tabId]//Tab.windowId
		if (!winId) {
			return
		}//may be handled by closeTab()

		//update data
		//1
		var data_1_WinObj_from_winId
		var WinObj = WinObj_from_winId[winId]
		if (!WinObj) {
			return
		}//may be handled by closeTab()
		WinObj.timeLastModified = UNIXtime()
		//Tab will be deleted...
		//Tab.timeLastClosed = UNIXtime()//interferes with storeTabsInCurrentWindow??
		//Tab.timeLastModified
		//Tab.timeLastOpened
		//for (var i in WinObj.TabsOpen) {
		for (var i = WinObj.TabsOpen.length - 1; i >= 0; i--) {
			//if (WinObj.TabsOpen[i] == Tab) {//chk if ptrs are the same
			if (WinObj.TabsOpen[i].id == tabId) {
				WinObj.TabsOpen.splice(i, 1)//delete ptr to Tab
				//console.logg("tabRemoved; tab index = ", i)

				//2
				var data_2_TabObj_from_tabId
				delete TabObj_from_tabId[tabId]//delete key/ptr to Tab

				//3
				var data_3_winId_from_tabId
				delete winId_from_tabId[tabId]

				//4-7
				if (winName_from_winId[winId]) {
					var winName = winName_from_winId[winId]

					var data_4_WinInfoObj_from_winName
					WinInfoObj_from_winName[winName].timeLastModified = WinObj_from_winId[winId].timeLastModified
					WinInfoObj_from_winName[winName].numberOfTabsOpen = WinObj_from_winId[winId].TabsOpen.length
					var data_5_winId_from_winName
					//unchanged
					var data_6_winName_from_winId
					//unchanged
					var data_7_localStorage
					update_localStorage('WinInfoObj_from_winName')
					update_localStorage('winName', winName, winId)

				}

				break;
			}//if tabId matches
		}//end loop WinObj.TabsOpen

	}//if window is NOT closing; only tab is closed; delete the tab

	updateBadge(winId)
}//tabRemoved


chrome.tabs.onRemoved.addListener(tabRemoved)

function tabSelectionChanged(tabId, info) {//info = {windowId}
	//console.logg('tabSelectionChanged; arguments = ', arguments)
	var winId = info.windowId

	//updateBadge
	updateBadge(winId)
}

chrome.tabs.onSelectionChanged.addListener(tabSelectionChanged)

function tabUpdated(tabId, info, tab) {//info = {status, url}
	if (info.status != "loading")//loading or complete	//do not update at both stages??
	{
		//return	//exit?
	}
	//console.logg('tabUpdated; arguments = ', arguments)
	var winId = tab.windowId

	//data_1 //WinObj_from_winId
	WinObj_from_winId[winId].timeLastModified = UNIXtime()

	//data_2 //TabObj_from_tabId
	if (TabObj_from_tabId[tabId]) {//in case the TabObj hasn't been created because tabCreated is slow'
		var Tab = TabObj_from_tabId[tabId]
		Tab.timeLastClosed
		Tab.timeLastModified = UNIXtime()
		Tab.timeLastOpened
		Tab.id = tabId
		//Tab.label = ''
		Tab.title = tab.title
		Tab.url = tab.url
	}
	//data_3 //winId_from_tabId
	winId_from_tabId[tab.id] = winId//Tab.windowId = tab.windowId

	if (winName_from_winId[winId]) {
		var winName = winName_from_winId[winId]
		//data_4 //WinInfoObj_from_winName
		WinInfoObj_from_winName[winName].timeLastModified = WinObj_from_winId[winId].timeLastModified
		WinInfoObj_from_winName[winName].numberOfTabsOpen = WinObj_from_winId[winId].TabsOpen.length
		//data_5 //winId_from_winName
		//unchanged
		//data_6 //winName_from_winId
		//unchanged
		//data_7 //localStorage
		update_localStorage('WinInfoObj_from_winName')
		update_localStorage('winName', winName, winId)

	}

	updateBadge(winId)
}

chrome.tabs.onUpdated.addListener(tabUpdated)

///////////////////////////////////

//callable funcs
var
__user_events
function saveWindowWithLocalStorage(winId, winName) {//saves objs as strings in DOM storage
	//used by popup's saveWindow
	//out in bg instead of popup because popup can die at anytime, thus causing errors before data is saved

	//debug
	//console.logg("saveWindowWithLocalStorage; winName = ", winName)

	//chk if winName entry already exists; exit if already exists, should have unique names
	if (WinInfoObj_from_winName[winName] != undefined) {
		//already exists
		//console.logg("saveWindowWithLocalStorage; window name already exists")

		//save in another name
		var newWinName
		for (var i = 2; i < 99999; i++) {
			if (WinInfoObj_from_winName[winName + '-' + i] == undefined) {
				//not exists; yay!
				newWinName = winName + '-' + i
				//console.logg("saveWindowWithLocalStorage; newWinName = ", newWinName)
				saveWindowWithLocalStorage(winId, newWinName)
				return
				break
			}
		}

		return
	}

	chrome.windows.get(winId, {
		populate : true
	}, function(window) {

		//update Tab's infos and rebuilt TabsOpen
		//data_1 //WinObj_from_winId
		WinObj_from_winId[winId].TabsOpen = new Array()//should skip this...
		for (var i in window.tabs) {
			var tab = window.tabs[i]
			var tabId = tab.id

			//update data in case...	//should be redun, useless	//can skip

			//data_1 //WinObj_from_winId
			var TabObj = TabObj_from_tabId[tabId]
			WinObj_from_winId[winId].TabsOpen[i] = TabObj//should skip this... useless??

			//data_2 //TabObj_from_tabId
			var TabObj = TabObj_from_tabId[tabId]
			TabObj.timeLastClosed//unchanged
			TabObj.timeLastModified//unchanged
			TabObj.timeLastOpened//unchanged
			TabObj.id = tab.id
			TabObj.label
			TabObj.title = tab.title
			TabObj.url = tab.url

			//data_3 //winId_from_tabId
			winId_from_tabId[tabId] = window.id
		}

		//data_4 //WinInfoObj_from_winName
		WinInfoObj_from_winName[winName] = new WinInfoClass()
		var WinLocalObj = WinInfoObj_from_winName[winName]//shorthand

		WinInfoObj_from_winName._orderOfNames.unshift(winName)//add to front of array
		WinLocalObj.timeLastClosed//unchanged
		WinLocalObj.timeLastModified = UNIXtime()
		WinLocalObj.timeLastOpened//unchanged

		var WinObj = WinObj_from_winId[winId]//shorthand

		WinLocalObj.numberOfTabsOpen = WinObj.TabsOpen.length
		WinLocalObj.numberOfTabsStored = WinObj.TabsStored.length
		//data_5 //winId_from_winName
		winId_from_winName[winName] = winId//from argument
		//data_6 //winName_from_winId
		winName_from_winId[winId] = winName//from argument
		//data_7 //localStorage
		update_localStorage('WinInfoObj_from_winName')
		update_localStorage('winName', winName, winId)

		updateBadge(winId)

	}//end callback
	)//chrome.windows.get
}//end saveWindowWithLocalStorage

function deleteNamedWindow(winName) {//used in explorer and popup
	var __delete
	var data_1_WinObj_from_winId
	//delete WinObj_from_winId[winId]	//do NOT delete	//will have no record of open unnamed window
	var data_2_TabObj_from_tabId
	var data_3_winId_from_tabId
	/*	//no harm in skipping this
	 for (var i in bg.WinObj_from_winId[winId].TabsOpen) {
	 var tabId = WinObj_from_winId[winId].TabsOpen[i].id
	 delete TabObj_from_tabId[tabId]
	 delete winId_from_tabId[tabId]
	 }
	 */
	var data_4_WinInfoObj_from_winName
	WinInfoObj_from_winName._orderOfNames.splice(WinInfoObj_from_winName._orderOfNames.indexOf(winName), 1)
	delete WinInfoObj_from_winName[winName]
	var data_6_winName_from_winId
	delete winName_from_winId[winId_from_winName[winName]]
	var data_5_winId_from_winName
	delete winId_from_winName[winName]
	var data_7_localStorage
	delete localStorage[winName]
	//localStorage['WinInfoObj_from_winName'] = stringify(WinInfoObj_from_winName)
	update_localStorage('WinInfoObj_from_winName')

}//deleteNamedWindow

////////////////////////////////////////////
function openWindow(winName) {
	var WinFromStorage = parse(localStorage[winName])
	var urls = new Array()

	//error correction loop
	for (var i in WinFromStorage.TabsOpen) {

		//error correction; eliminate null, undefined, new tab
		if (WinFromStorage.TabsOpen[i] == null || WinFromStorage.TabsOpen[i] == undefined || WinFromStorage.TabsOpen[i].url == 'chrome://newtab/') {
			WinFromStorage.TabsOpen.splice(i, 1)
		}

	}

	//loop thru TabsOpen for urls to open
	if (WinFromStorage.TabsOpen.length > 0) {
		for (var i in WinFromStorage.TabsOpen) {

			//add url
			urls.push(WinFromStorage.TabsOpen[i].url)
		}
	}
	//if case no url left to open after all problem tabs have been eliminated
	else if (WinFromStorage.TabsOpen.length == 0) {
		urls.push(chrome.extension.getURL("/storedTabs.html"))
	}

	//open named window
	chrome.windows.create({
		url : urls
	}, function(window) {
		//THE ORDER is windowCreated, tabCreated,  tabSelectionChanged, openWindow callback, tabUpdated
		//console.logg("openWindow callback, window = ", window)

		var winId = window.id

		//chk
		createIfNoWinObj_from_winId(winId)
		createIfNoWinInfoObjObj_from_winName(getWinName(winId))

		//data_1 //WinObj_from_winId
		var WinObj = WinObj_from_winId[winId]
		//copy OLD info from WinFromStorage to new WinObj
		WinObj.timeLastClosed = WinFromStorage.timeLastClosed
		WinObj.timeLastModified//unchanged	//= WinFromStorage.timeLastModified
		WinObj.timeLastOpened = UNIXtime()

		//data_1 //WinObj.TabsOpen
		if (WinFromStorage.TabsOpen.length > 0 && WinObj.TabsOpen.length > 0 && WinObj.TabsOpen.length == window.tabs.length) {
			for (var i in WinObj.TabsOpen) {//or in window.tabs??
				var tab = window.tabs[i]
				var tabId = tab.id
				var newTabObj = WinObj.TabsOpen[i]//assumes tabCreated already created TabClassObj
				var oldTabObj = WinFromStorage.TabsOpen[i]

				//data_2 //TabObj_from_tabId
				newTabObj.timeLastClosed = oldTabObj.timeLastClosed
				newTabObj.timeLastModified = oldTabObj.timeLastModified
				newTabObj.timeLastOpened = UNIXtime()
				newTabObj.id = tab.id
				newTabObj.label = oldTabObj.label
				newTabObj.title = tab.title//do not copy old title??
				newTabObj.url = tab.url//do not copy old url	//url may be bad or updated or...

				//data_3 //winId_from_tabId
				winId_from_tabId[tabId] = winId

			}//end WinObj.TabsOpen
		}//WinObj.TabsOpen.length > 0
		else {//WinObj.TabsOpen.length == 0
			for (var i in window.tabs) {
				var tab = window.tabs[i]
				var tabId = tab.id
				var newTabObj = WinObj.TabsOpen[i]//assumes tabCreated already created TabClassObj

				//data_2 //TabObj_from_tabId
				newTabObj.timeLastClosed = 0
				newTabObj.timeLastModified = UNIXtime()
				newTabObj.timeLastOpened = UNIXtime()
				newTabObj.id = tab.id
				newTabObj.label = ''
				newTabObj.title = tab.title//do not copy old title??
				newTabObj.url = tab.url//do not copy old url	//url may be bad or updated or...

				//data_3 //winId_from_tabId
				winId_from_tabId[tabId] = winId
			}
		}//WinObj.TabsOpen.length == 0
		//data_1 //WinObj.TabsStored
		WinObj.TabsStored = WinFromStorage.TabsStored//copy verbatim

		//data_4 //WinInfoObj_from_winName
		//move recently opened winName to Front of list
		//list.splice(list.indexOf('bb'),1) //example
		WinInfoObj_from_winName._orderOfNames.splice(WinInfoObj_from_winName._orderOfNames.indexOf(winName), 1)//remove
		WinInfoObj_from_winName._orderOfNames.unshift(winName)//add to front of array
		WinInfoObj_from_winName[winName].timeLastOpened = UNIXtime()
		//data_5 //winId_from_winName
		winId_from_winName[winName] = winId
		//data_6 //winName_from_winId
		winName_from_winId[winId] = winName
		//data_7 //localStorage
		update_localStorage('WinInfoObj_from_winName')
		//update_localStorage('winName',winName,winId)	//unchanged

		updateBadge(winId)

		//console.logg("openWindow callback END")
	})//chrome.windows.create
}//openWindow

function storeTabsInCurrentWindow(winId) {
	//console.logg("storeTabsInCurrentWindow; winId = ", winId)

	var WinObj = WinObj_from_winId[winId]//shorthand

	//create empty new tab for use as Stored Tabs html stand-in
	chrome.tabs.create({
		url : chrome.extension.getURL("/empty.html")
	}, function(tab) {
		//callback

		//loop through open tabs and
		//copy the last of the open tabs first to the end of stored tabs
		var idsOfTabsToClose = new Array()
		var homeUrl = chrome.extension.getURL("/")
		var time1 = UNIXtime()
		for (var i = WinObj.TabsOpen.length - 1; i >= 0; i--) {

			//error correction
			if (WinObj.TabsOpen[i] == null || WinObj.TabsOpen[i] == undefined) {
				WinObj.TabsOpen.splice(i, 1)
				continue
			}

			//do NOT store if tab is ANY chrome page??
			/*
			if(WinObj.TabsOpen[i].url.search('chrome') == 0){
			continue
			}
			*/

			//do NOT store if tab is THIS ext's webpages
			if (WinObj.TabsOpen[i].url.search(homeUrl) == 0) {
				//but close the tab anyways...
				idsOfTabsToClose.push(WinObj.TabsOpen[i].id)//tabIds
				continue
			}

			//do not store if it is a blank tab
			if (WinObj.TabsOpen[i].url.search("chrome://newtab/") == 0) {
				//but close the tab anyways...
				idsOfTabsToClose.push(WinObj.TabsOpen[i].id)//tabIds
				continue
			}

			//otherwise
			else {

				var data_1_WinObj_from_winId
				WinObj.TabsOpen[i].timeLastClosed = time1
				//move from TabsOpen to TabsStored
				WinObj.TabsStored.push(WinObj.TabsOpen[i])

				var data_2_TabObj_from_tabId
				//should be handled in tabRemoved...
				var data_3_winId_from_tabId
				//should be handled in tabRemoved...
				var data_4_WinInfoObj_from_winName
				//should be handled in tabRemoved...
				var data_5_winId_from_winName
				//unchanged
				var data_6_winName_from_winId
				//unchanged
				var data_7_localStorage
				//should be handled in tabRemoved...

				//to close
				idsOfTabsToClose.push(WinObj.TabsOpen[i].id)//tabIds

			}
		}//end loop thru WinObj.OpenTabs

		//multiple chrome.tabs.remove calls
		for (var i in idsOfTabsToClose) {
			if (idsOfTabsToClose[i] != tab.id) {//don't close newly opened tab, used to display TabStorage
				closeTab(winId, idsOfTabsToClose[i])
			}
		}

		//update newly opened tab into storedTabs page
		chrome.tabs.update(tab.id, {
			url : chrome.extension.getURL("/storedTabs.html")
		}, function(args) {
			//callback
		})
	}//chrome.tabs.create call back
	)//chrome.tabs.create
}//storeTabsInCurrentWindow

function closeTab(winId, tabId) {
	chrome.tabs.remove(tabId, function(args) {
		//callback

		//should be handled in tabRemoved()
		//but in case tabId is invalid...

		//update data
		//1
		var data_1_WinObj_from_winId//TabsOpen	//TabsStored
		var WinObj = WinObj_from_winId[winId]
		if (!WinObj) {
			return
		}
		//in case tabRemoved() was not successfully called because the tabId is invalid
		//for (var i in WinObj.TabsOpen) {
		for (var i = WinObj.TabsOpen.length - 1; i >= 0; i--) {
			if (WinObj.TabsOpen[i].id == tabId) {
				WinObj.TabsOpen.splice(i, 1)//delete ptr to Tab

				//2
				var data_2_TabObj_from_tabId
				delete TabObj_from_tabId[tabId]//delete key/ptr to Tab

				//3
				var data_3_winId_from_tabId
				delete winId_from_tabId[tabId]

				//data 4-7
				if (winName_from_winId[winId]) {
					var winName = winName_from_winId[winId]

					var data_4_WinInfoObj_from_winName
					WinInfoObj_from_winName[winName].timeLastModified = WinObj_from_winId[winId].timeLastModified
					WinInfoObj_from_winName[winName].numberOfTabsOpen = WinObj_from_winId[winId].TabsOpen.length
					var data_5_winId_from_winName
					//unchanged
					var data_6_winName_from_winId
					//unchanged
					var data_7_localStorage
					update_localStorage('WinInfoObj_from_winName')
					update_localStorage('winName', winName, winId)

				}

				break;
			}//if tabId matches
		}//end loop WinObj.TabsOpen

	}//end chrome.tabs.remove callback
	)//end chrome.tabs.remove
}//end closeTab

function managerButtonClicked(curWinId) {

	//check if manager tab is already opened in current window
	/*	//bug
	 chrome.windows.getCurrent({
	 populate : true
	 },
	 */
	chrome.windows.get(curWinId, {
		populate : true
	}, function(window) {
		var url = chrome.extension.getURL("/manager.html")
		for (var i in window.tabs) {
			if (window.tabs[i].url == url) {
				//found

				//focus; make active
				chrome.tabs.update(window.tabs[i].id, {
					active : true
				}, null)

				//make active and reload
				/*
				 chrome.tabs.update(window.tabs[i].id, {
				 active : true,
				 url : chrome.extension.getURL("/manager.html")
				 }, null)

				 */

				updateBadge(window.id)

				//exit
				return
			}
		}
		//not found

		//open new manager tab
		chrome.tabs.create({
			url : chrome.extension.getURL("/manager.html")
		}, function(tab) {

			setTimeout(function() {//does not fix no badge after opened tabs Manager from popup
				//set text per window
				updateBadge(tab.id)//does not work??
				//set text per tab
				chrome.browserAction.setBadgeText({
					text : winName_from_winId[winId_from_tabId[tab.id]],
					tabId : tab.id	//bug with setting text per tab
				})
			}, 1000);

			//console.logg("managerButtonClicked, new manager tab opened, Tab = ", tab)
		})
	}//chrome.windows.getCurrent callback
	)//chrome.windows.getCurrent
}//managerButtonClicked

function tabsButtonClicked(curWinId) {

	//check if manager tab is already opened in current window
	/*	//bug
	 chrome.windows.getCurrent({
	 populate : true
	 },
	 */
	chrome.windows.get(curWinId, {
		populate : true
	}, function(window) {
		var url = chrome.extension.getURL("/storedTabs.html")
		for (var i in window.tabs) {
			if (window.tabs[i].url == url) {
				//found

				//focus; make active
				chrome.tabs.update(window.tabs[i].id, {
					active : true
				}, null)

				//make active and reload
				/*
				 chrome.tabs.update(window.tabs[i].id, {
				 active : true,
				 url : chrome.extension.getURL("/manager.html")
				 }, null)

				 */

				updateBadge(window.id)

				//exit
				return
			}
		}
		//not found

		//open new manager tab
		chrome.tabs.create({
			url : chrome.extension.getURL("/storedTabs.html")
		}, function(tab) {

			if (winName_from_winId[winId_from_tabId[tab.id]]) {
				setTimeout(function() {//does not fix no badge after opened tabs Manager from popup
					//set text per window
					updateBadge(tab.id)//does not work??
					//set text per tab
					chrome.browserAction.setBadgeText({
						text : winName_from_winId[winId_from_tabId[tab.id]],
						tabId : tab.id	//bug with setting text per tab
					})
				}, 1000);
			}
			//console.logg("tabsButtonClicked, new storedTabs tab opened, Tab = ", tab)
		})
	}//chrome.windows.getCurrent callback
	)//chrome.windows.getCurrent
}//tabsButtonClicked

////////////////////////////////////////////////

////////////////////////////////////////////
var
__funcs

var update_localStorage_timeStamps = {}
var toUpdate_localStorage_timeStamps = {}//time to update in future by setTimeouts
var timeTimeout = 1000//millisecs	//update_localStorage() throttle
var timeToPass = 1000//millisecs	//update_localStorage() throttle

function update_localStorage() {
	//usage 1: update_localStorage('WinInfoObj_from_winName')
	//usage 2: update_localStorage('winName',winName,winId)

	//usage 1:
	if (arguments[0] == 'WinInfoObj_from_winName') {
		//check update_localStorage_timeStamps
		if (!update_localStorage_timeStamps['WinInfoObj_from_winName'] || ((getTime() - update_localStorage_timeStamps['WinInfoObj_from_winName']) >= timeToPass)) {//timeStamp no exist yet OR time difference > timeToPass
			localStorage['WinInfoObj_from_winName'] = stringify(WinInfoObj_from_winName)
			update_localStorage_timeStamps['WinInfoObj_from_winName'] = getTime()
		} else if (toUpdate_localStorage_timeStamps['WinInfoObj_from_winName'] && (getTime() < toUpdate_localStorage_timeStamps['WinInfoObj_from_winName'])) {
			//now hasn't passed toUpdate yet

			//do nothing
			//will be updated soon in the future
		} else {//schedule update_localStorage with setTimeOut
			toUpdate_localStorage_timeStamps['WinInfoObj_from_winName'] = getTime() + timeTimeout
			setTimeout(function() {
				update_localStorage('WinInfoObj_from_winName')
			}, timeTimeout)
		}
	}//WinInfoObj_from_winName

	//usage 2:
	if (arguments[0] == 'winName') {
		var winName = arguments[1]
		var winId = arguments[2]
		//check update_localStorage_timeStamps
		if (!update_localStorage_timeStamps[winName] || ((getTime() - update_localStorage_timeStamps[winName]) >= timeToPass)) {//timeStamp no exist yet OR time difference > timeToPass
			var data = stringify(WinObj_from_winId[winId])
			if (data == undefined || data == 'undefined') {//try to prevent overwriting valid data with garbage
				return
			}
			localStorage[winName] = data
			update_localStorage_timeStamps[winName] = getTime()
		} else if (toUpdate_localStorage_timeStamps[winName] && (getTime() < toUpdate_localStorage_timeStamps[winName])) {
			//do nothing
			//will be updated soon in the future
		} else {//schedule update_localStorage with setTimeOut
			toUpdate_localStorage_timeStamps[winName] = getTime() + timeTimeout
			setTimeout(function() {
				update_localStorage('winName', winName, winId)
			}, timeTimeout)
		}
	}//winName

}//update_localStorage

function updateBadge(winId) {
	//console.logg("updateBadge; winId = ", winId, ' winName = ', winName_from_winId[winId])

	//update badge on a tab by tab basis
	/*
	for (var i in tabIdsFromWinId[winId]) {
	var tabId = tabIdsFromWinId[winId][i]
	//console.logg("updateBadge, tabId = ", tabId)
	chrome.browserAction.setBadgeText({
	text : winName_from_winId[winId],
	tabId : tabId
	})
	}
	*/
	//chrome.browserAction.setBadgeText for individual tabs does NOT work right... no idea why...

	//delayed run
	if (!winId) {
		updateBadge(curFocusedWinId)
	}

	//switch to update on tabUpdated or selectionChanged instead of on windowOpened
	if (winName_from_winId[winId]) {
		//open named window
		chrome.browserAction.setBadgeBackgroundColor({
			color : '#1E960E'	//green
		})
		chrome.browserAction.setBadgeText({
			text : winName_from_winId[winId]
		})
		chrome.browserAction.setIcon({
			path : chrome.extension.getURL("/pics/star32.png")
		})
	} else {
		//open unnamed window
		chrome.browserAction.setBadgeBackgroundColor({
			color : '#F55FC8'	//pink
		})
		chrome.browserAction.setBadgeText({
			text : 'none'
		})
		chrome.browserAction.setIcon({
			path : chrome.extension.getURL("/pics/Star-32.png")
		})
	}

}//updateBadge

function getTime() {
	return (new Date()).getTime()
}

function UNIXtime() {
	return Math.round((new Date()).getTime() / 1000) - 1356000000//UNIX time in secs instead of millisecs
}

function UNIXtimeToLocaleString(UNIXtime) {
	if (!UNIXtime) {
		return " - "
	}

	var date = new Date()
	date.setTime((UNIXtime + 1356000000) * 1000)
	return date.getMonth() + 1 + "/" + date.getDate() + "/" + (date.getFullYear() - 2000) + " " + date.toLocaleTimeString()
}

function parse(string) {//uses JSON.parse for now, can change use decompression if stringify uses compression
	return JSON.parse(string)
}

function stringify(obj) {//can use compression
	return JSON.stringify(obj)
}

function createIfNoTabObj_from_tabId(tabId) {
	if (TabObj_from_tabId[tabId] == undefined || TabObj_from_tabId[tabId] == null) {
		TabObj_from_tabId[tabId] = new TabClass()
	}
	return TabObj_from_tabId[tabId]
}

function createIfNoWinObj_from_winId(winId) {//create WinObj_from_winId if it does not exist
	if (WinObj_from_winId[winId] == undefined || WinObj_from_winId[winId] == null)
		WinObj_from_winId[winId] = new WinClass()
	return WinObj_from_winId[winId]
}

function createIfNoWinInfoObjObj_from_winName(winName) {//use as createIfNoWinInfoObjObj_from_winName(getWinName(winId))
	if (!winName) {
		return
	}
	if (winName == '') {
		return
	}
	if (WinInfoObj_from_winName[winName] == undefined || WinInfoObj_from_winName[winName] == null)
		WinInfoObj_from_winName[winName] = new WinClass()
	return WinInfoObj_from_winName[winName]
}

function getWinName(winId) {//handles cases in createIfNoWinInfoObjObj_from_winName(winName) for cases where winName does not exist
	if (winName_from_winId[winId] == undefined || winName_from_winId[winId] == null) {
		return ""
	} else {
		return winName_from_winId[winId]
	}
}
