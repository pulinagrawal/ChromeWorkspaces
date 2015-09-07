var __bg_vars
var bg = chrome.extension.getBackgroundPage()
var curWinId//set in chrome.windows.getCurrent callback
var winName//set in chrome.windows.getCurrent callback after curWinId is gotten
var iLinksDeleted = new Array()//stores all the nominal i positions of links in TabsStored //used to calculate new actual i positions of future links to be deleted	//whenever a link is deleted before the another link, i is subtracted by 1; gtes actual i position by adding all previously deleted nominal link positions
var groupBy = 'timeLastClosed'

var __refresh_page_on_focus
var pageLastLoaded = bg.getTime()
$(window).on('focus', function() {
	console.logg('window focused');
	//location.reload()

	//reload page only when pageLastLoaded<bg.WinInfoObj_from_winName[winName].storageLastModified
	if (bg.WinInfoObj_from_winName[winName] && !bg.WinInfoObj_from_winName[winName].storageLastModified) {
		location.reload()
	}
	if (pageLastLoaded < bg.WinInfoObj_from_winName[winName].storageLastModified) {
		location.reload()
	}
})
var __get_current_winId_then_populate_page
var callback = function(window) {
	console.logg("window = ", window)
	curWinId = window.id
	winName = bg.winName_from_winId[curWinId]

	//change page title
	document.title = bg.winName_from_winId[window.id] + ' Tabs'
	//$('#titleDiv').prop('innerHTML', bg.winName_from_winId[curWinId])

	//totalNumberOfStoredTabs
	$('#totalNumberOfStoredTabs').prop('innerHTML', bg.winName_from_winId[curWinId] + " : " + bg.WinObj_from_winId[curWinId].TabsStored.length + " stored tabs")

	//dates format
	var sortBy = "timeLastClosed"//timeLastClosed++, timeLastModified, timeLastOpened
	var format = "toLocaleString"//toLocaleString++	//toUNIX for debug
	var dates = new Array()//all the dates
	var d = new Date()
	//d.toDateString() "Thu Jun 19 2014"	++
	//d.toGMTString() "Thu, 19 Jun 2014 13:32:51 GMT"
	//d.toISOString() "2014-06-19T13:32:51.903Z"
	//d.toJSON() "2014-06-19T13:32:51.903Z"
	//d.toLocaleDateString() "6/19/2014" +++
	//d.toLocaleString() "6/19/2014 9:32:51 AM" ++++
	//d.toLocaleTimeString() "9:32:51 AM"
	//d.toString() "Thu Jun 19 2014 09:32:51 GMT-0400 (Eastern Daylight Time)"
	//d.toTimeString() "09:32:51 GMT-0400 (Eastern Daylight Time)"
	//d.toUTCString() "Thu, 19 Jun 2014 13:32:51 GMT"

	//dates format
	if (sortBy == "timeLastClosed" && format == "toDateString") {
		for (var i in bg.WinObj_from_winId[window.id].TabsStored) {
			d.setTime((bg.WinObj_from_winId[window.id].TabsStored[i].timeLastClosed * 1 + 1356000000) * 1000)
			dates.push(d.toDateString())
		}
	} else if (sortBy == "timeLastClosed" && format == "toLocaleDateString") {
		for (var i in bg.WinObj_from_winId[window.id].TabsStored) {
			d.setTime((bg.WinObj_from_winId[window.id].TabsStored[i].timeLastClosed * 1 + 1356000000) * 1000)
			dates.push(d.toLocaleDateString() + "   " + d.toDateString().slice(0, 3))
		}
	} else if (sortBy == "timeLastClosed" && format == "toLocaleString") {
		for (var i in bg.WinObj_from_winId[window.id].TabsStored) {
			d.setTime((bg.WinObj_from_winId[window.id].TabsStored[i].timeLastClosed * 1 + 1356000000) * 1000)
			dates.push(d.toLocaleString())
		}
	} else if (sortBy == "timeLastClosed" && format == "toUNIX") {
		for (var i in bg.WinObj_from_winId[window.id].TabsStored) {
			dates.push(bg.WinObj_from_winId[window.id].TabsStored[i].timeLastClosed)
		}
	}
	console.logg("load callback; dates = ", dates)
	var lastTime//use to remember the lastTime in dates for compare
	var ptrToLastTabGroup
	var ptrToLastTimeLine

	//populate links
	//start at end
	for (var i = bg.WinObj_from_winId[window.id].TabsStored.length - 1; i >= 0; i--) {

		var TabObj = bg.WinObj_from_winId[window.id].TabsStored[i]//shorthand

		//same time
		if (dates[i] == lastTime) {
			console.logg("populate links; ptrToLastTimeLine = ", ptrToLastTimeLine)

		}

		//different time
		else if (dates[i] != lastTime) {//already includes start when lastTime == null

			//date
			lastTime = dates[i]//data //allows next tab to compare this new, different time

			//new tab group
			var newTabGroup = $('#tabGroupTemplate').clone()//data
			ptrToLastTabGroup = newTabGroup//data
			newTabGroup.numberOfTabs = 0//doesn't work, this is just javascript, does not affect html values
			$(newTabGroup).prop('numberOfTabs', 0)

			$('body').append(newTabGroup)//display

			//newTimeLine
			var newTimeLine = $('#timeLineTemplate').clone()//data
			ptrToLastTimeLine = newTimeLine//data
			$(newTabGroup).append(newTimeLine)//display

			//date format
			$($(newTimeLine).children()[1]).prop('innerHTML', " " + dates[i])//data
			$(newTimeLine).css('display', 'block')//display

		}
		//different time

		//TabGroupDiv	//numberOfTabs
		$(ptrToLastTabGroup).prop('numberOfTabs', $(ptrToLastTabGroup).prop('numberOfTabs') * 1 + 1)
		//console.logg("testsets, adasd", $(ptrToLastTabGroup).prop('numberOfTabs'))

		//TimeLineDiv //numberOfTabsInGroup
		//var numberOfTabsInGroup = $($(ptrToLastTabGroup).children()[0]).children()[0]
		//console.logg("numberOfTabsInGroup = ", numberOfTabsInGroup)
		//console.logg("ptrToLastTimeLine, ", $(ptrToLastTimeLine).children()[0])
		$(ptrToLastTimeLine).children()[0].innerHTML = $(ptrToLastTabGroup).prop('numberOfTabs') + " tabs"

		//TabLinkDiv
		var div = $('#tabLinkTemplate').clone()//data
		$(div).css('display', 'block')//display
		//$(div).css('visibility','visible')
		$(ptrToLastTabGroup).append(div)//display

		//DeleteButton
		var deleteButton = $(div).children()[0]//shorthand
		deleteButton.i = i//data
		$(deleteButton).on('click', deleteButtonClicked)//event
		//show delete button when hover on div
		//handled in css with .tabLinkDiv:hover > .deleteButton

		//Favicon
		var favicon = $(div).children()[1]
		//check for tabsuspenders
		var src = TabObj.url
		var srcSplits = src.split('suspended.html#url=')//The Great Suspender
		if (srcSplits.length > 1) {
			src = unescape(srcSplits[1])
		} else {
			src = unescape(srcSplits[0])
		}
		favicon.title = src.split('//')[1]//full url without the http:// or https://
		var urlSplits = src.split('/')
		favicon.src = 'http://www.google.com/s2/favicons?domain=' + urlSplits[2]

		//Domain

		//Title
		var title = $(div).children()[2]
		//helper data
		title.children[0].i = i//used in linkClicked...
		title.children[0].url = TabObj.url//used in linkClicked...
		//display data
		title.href = TabObj.url
		if (TabObj.title == '') {
			title.children[0].innerHTML = TabObj.url
		} else {
			title.children[0].innerHTML = TabObj.title
		}
		title.children[0].title = TabObj.url//or favicon.title
		//action
		$(title.children[0]).on('click', linkClicked)

	}//loop TabsStored

	//update badge
	bg.updateBadge(window.id)

}
chrome.windows.getCurrent({
	populate : false
}, callback)//for debug

var __user_events

var fadeOrHide = 'hide'
function deleteButtonClicked(evt) {
	var deleteButton
	if ($(evt.srcElement).hasClass('tabTitle')) {//called from linkClicked
		var link = $(evt.srcElement).parent()
		deleteButton = $(link).parent().children()[0]
	} else {
		deleteButton = evt.srcElement
	}

	var tabLinkDiv = $(deleteButton).parent()//shorthand

	//fade or hide Link Element div
	if (fadeOrHide == 'fade') {
		$(tabLinkDiv).fadeTo(500, 0.1)
	} else {
		$(tabLinkDiv).hide()
	}

	//remove tab from TabsStored
	//need Actual i position of Tab obj in TabsStored that correspond to a link
	var nominalI = deleteButton.i * 1//
	var actualI = nominalI
	console.logg('linkClicked; actualI = ', actualI)
	if (iLinksDeleted.length > 0) {
		for (var i in iLinksDeleted) {
			if (iLinksDeleted[i] < nominalI) {
				actualI--
			}
		}
	}
	//got acutalI; update iLinksDeleted
	iLinksDeleted.push(nominalI)

	//update data
	//data_1 //WinObj_from_winId
	var WinObj = bg.WinObj_from_winId[curWinId]//shorthand
	WinObj.timeLastModified = bg.UNIXtime()
	WinObj.TabsStored.splice(actualI, 1)//delete ptr to Tab

	//data_2 //TabObj_from_tabId
	//unaffected	//new tab will be handled in tabCreated

	//data_3 //winId_from_tabId
	//unaffected	//new tab will be handled in tabCreated

	//data_4 //WinInfoObj_from_winName
	var winName = bg.winName_from_winId[curWinId]
	bg.WinInfoObj_from_winName[winName].timeLastModified = WinObj.timeLastModified
	bg.WinInfoObj_from_winName[winName].numberOfTabsOpen
	bg.WinInfoObj_from_winName[winName].numberOfTabsStored = WinObj.TabsStored.length
	bg.WinInfoObj_from_winName[winName].storageLastModified = bg.getTime()

	//data_5 //winId_from_winName
	//unchanged

	//data_6 //winName_from_winId
	//unchanged

	//data_7 //localStorage
	localStorage[winName] = bg.stringify(WinObj)
	//localStorage['WinInfoObj_from_winName'] = bg.stringify(bg.WinInfoObj_from_winName)
	bg.update_localStorage('WinInfoObj_from_winName')
	//totalNumberOfStoredTabs
	$('#totalNumberOfStoredTabs').prop('innerHTML', bg.winName_from_winId[curWinId] + " : " + bg.WinObj_from_winId[curWinId].TabsStored.length + " stored tabs")//display

	//numberOfTabsInGroup
	var tabGroupDiv = $(tabLinkDiv).parent()
	$(tabGroupDiv).prop('numberOfTabs', $(tabGroupDiv).prop('numberOfTabs') * 1 - 1)//data
	var timeLineDiv = $(tabGroupDiv).children()[0]
	console.logg("deleteButtonClicked; timeLineDiv = ", timeLineDiv)
	$(timeLineDiv).children()[0].innerHTML = $(tabGroupDiv).prop('numberOfTabs') + " tabs"	//display

}//deleteButtonClicked

function linkClicked(evt) {
	console.log('linkClicked; evt = ', evt)
	evt.preventDefault()//prevent tab from going to another url

	//open stored tab in new tab
	if (evt.srcElement.href) {
		chrome.tabs.create({
			url : evt.srcElement.href,
			selected : false
		})
	} else if (evt.srcElement.url) {
		chrome.tabs.create({
			url : evt.srcElement.url,
			selected : false
		})
	}

	deleteButtonClicked(evt)

}//linkClicked


console.logg('storedTabs script END')
