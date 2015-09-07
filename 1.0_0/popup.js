//global vars
//////////////////////////////////////////////
console.logg('localStorage = ', localStorage)
var __bg_vars

var bg = chrome.extension.getBackgroundPage()
var curWinId//set in chrome.windows.getCurrent callback

var __on_load
var _get_curWinId_and_run_windowsListPopulate
//chrome.windows.getCurrent(null, callback)		//for production
chrome.windows.getCurrent({
	populate : true
}, function(window) {
	console.logg("on load; window = ", window)
	curWinId = window.id

	//populate li's
	windowsListPopulate()

})
//////////////////////////////////////////

var
__user_event_listeners
/////////////////////////////////////////////////
$('#managerButton').on('click', managerButtonClicked)
$('#tabsButton').on('click', tabsButtonClicked)
$('#storeTabsButton').on('click', storeTabsButtonClicked)
$('#saveWindowForm').on('submit', saveWindow)
$('#saveWindowInput').on('blur', saveWindow)
$('.star').live('mouseenter', starMouseEntered)
$('.star').live('mouseleave', starMouseLeft)
$('.star').live('click', starClicked)
//$('body').on('mouseleave', function(){console.logg('mouseleave')})
////////////////////////////////////////////////////////

//logic
////////////////////////////////////////////////////////
var
__user_event_handlers
function managerButtonClicked(evt) {
	console.logg('managerButtonClicked; evt = ', evt, ' curWinId = ', curWinId)

	bg.managerButtonClicked(curWinId)
}//managerButtonClicked

function tabsButtonClicked(evt) {
	bg.tabsButtonClicked(curWinId)
}

function storeTabsButtonClicked(evt) {
	//put all tabs in current window in storage
	bg.storeTabsInCurrentWindow(curWinId)
}

function windowsListPopulate() {

	//Current Window is a open named window, display it First; at the top of the list
	if (bg.winName_from_winId[curWinId]) {//curWinId is found in the list of open named windows

		var winName = bg.winName_from_winId[curWinId]//shorthand

		//clone li
		var li = $('#namedWindowTemplate').clone()
		$(li).prop('id', winName)
		$(li).prop('winName', winName)
		$(li).children()[0].innerHTML = "This is " + winName.bold()
		var star = $(li).children()[1]
		$(star).prop('winName', winName)
		if (bg.WinInfoObj_from_winName[winName] && bg.WinInfoObj_from_winName[winName].starred && bg.WinInfoObj_from_winName[winName].starred == 'starred') {
			//yellow
			$(star).removeClass('grey')
			$(star).addClass('yellow')
			$(star).addClass('starred')
			$(star).prop('src', '\pics\\star16.png')	//show yellow star
		} else {
			$(star).removeClass('yellow')
			$(star).addClass('grey')
			$(star).prop('src', '\pics\\Star-16.png')	//show grey star
		}
		var numText = '  (' + bg.WinInfoObj_from_winName[winName].numberOfTabsOpen + ' of ' + (bg.WinInfoObj_from_winName[winName].numberOfTabsOpen + bg.WinInfoObj_from_winName[winName].numberOfTabsStored) + ') '
		$(li).children()[2].innerHTML = numText
		$($(li).children()[2]).css('color', 'grey')
		$('#namedWindowsList').append(li)

		//class
		$(li).addClass('current')//highlights the li

		//add hooks/listeners
		$($(li).children()[3]).on('click', lixClicked)
		$($(li).children()[4]).on('click', liUndeleteClicked)

	} else {
		//Current Window is open unnamed window
		//show 'save as'
		$('#saveWindowForm').css('display', 'block')
		$('#saveWindowInput').focus()
	}

	//populate unfocused open named windows
	//skip closed named windows
	for (var i in bg.WinInfoObj_from_winName._orderOfNames) {
		var winName = bg.WinInfoObj_from_winName._orderOfNames[i]

		///Current Window is a open named window
		//already handled above
		if (bg.winName_from_winId[curWinId] && winName == bg.winName_from_winId[curWinId]) {
			//skip
			continue
		}

		if (bg.winId_from_winName[winName]) {

			//clone li
			var li = $('#namedWindowTemplate').clone()
			$(li).prop('id', winName)
			$(li).prop('winName', winName)
			$(li).children()[0].innerHTML = winName
			var star = $(li).children()[1]
			$(star).prop('winName', winName)
			if (bg.WinInfoObj_from_winName[winName] && bg.WinInfoObj_from_winName[winName].starred && bg.WinInfoObj_from_winName[winName].starred == 'starred') {
				//yellow
				$(star).removeClass('grey')
				$(star).addClass('yellow')
				$(star).addClass('starred')
				$(star).prop('src', '\pics\\star16.png')	//show yellow star
			} else {
				$(star).removeClass('yellow')
				$(star).addClass('grey')
				$(star).prop('src', '\pics\\Star-16.png')	//show grey star
			}

			// (open of total) // (open / total)
			var numText = '  (' + bg.WinInfoObj_from_winName[winName].numberOfTabsOpen + ' of ' + (bg.WinInfoObj_from_winName[winName].numberOfTabsOpen + bg.WinInfoObj_from_winName[winName].numberOfTabsStored) + ') '
			// (open)(stored)
			//$(li).children()[0].innerText = winName + ' (' + bg.WinInfoObj_from_winName[winName].numberOfTabsOpen + ') (' + bg.WinInfoObj_from_winName[winName].numberOfTabsStored + ')'
			// (# open # stored)
			//$(li).children()[0].innerText = winName + ' (' + bg.WinInfoObj_from_winName[winName].numberOfTabsOpen + ' open ' + bg.WinInfoObj_from_winName[winName].numberOfTabsStored + ' stored)'
			$(li).children()[2].innerHTML = numText + ' open     '
			$($(li).children()[2]).css('color', 'grey')//useless //will be overrode by class open
			$('#namedWindowsList').append(li)

			//yes, it is currently opened
			//class
			$(li).addClass('open')

			//add hooks
			$(li).on('click', liClicked)
			$($(li).children()[3]).on('click', lixClicked)
			$($(li).children()[4]).on('click', liUndeleteClicked)

		} else {
			continue
		}

	}//populate unfocused open named windows

	//populate closed named windows
	for (var i in bg.WinInfoObj_from_winName._orderOfNames) {
		var winName = bg.WinInfoObj_from_winName._orderOfNames[i]

		///Current Window is a open named window
		//already handled
		if (bg.winName_from_winId[curWinId] && winName == bg.winName_from_winId[curWinId]) {
			//skip
			continue
		}

		//winName is an open named window
		if (bg.winId_from_winName[winName]) {
			//skip
			continue
		}

		//else
		//the rest:

		//clone li
		//update li data
		var li = $('#namedWindowTemplate').clone()
		$(li).prop('id', winName)
		$(li).prop('winName', winName)
		$(li).children()[0].innerHTML = winName
		var star = $(li).children()[1]
		$(star).prop('winName', winName)
		if (bg.WinInfoObj_from_winName[winName] && bg.WinInfoObj_from_winName[winName].starred && bg.WinInfoObj_from_winName[winName].starred == 'starred') {
			//yellow
			$(star).removeClass('grey')
			$(star).addClass('yellow')
			$(star).addClass('starred')
			$(star).prop('src', '\pics\\star16.png')	//show yellow star
		} else {
			$(star).removeClass('yellow')
			$(star).addClass('grey')
			$(star).prop('src', '\pics\\Star-16.png')	//show grey star
		}

		// (open / total)
		var numText = '  (' + bg.WinInfoObj_from_winName[winName].numberOfTabsOpen + ' of ' + (bg.WinInfoObj_from_winName[winName].numberOfTabsOpen + bg.WinInfoObj_from_winName[winName].numberOfTabsStored) + ') '
		$(li).children()[2].innerHTML = numText
		$($(li).children()[2]).css('color', 'grey')
		$('#namedWindowsList').append(li)

		//add hooks
		$(li).on('click', liClicked)
		$($(li).children()[3]).on('click', lixClicked)
		$($(li).children()[4]).on('click', liUndeleteClicked)
	}//populate closed named windows

	//fix disappearing scroll bar
	$('body').height($('body').height() + 5)

}//windowsListPopulate

function liClicked(evt) {
	console.logg('liClicked; evt.srcElement = ', evt.srcElement)

	//skip if STAR srcElement is STAR img
	if (evt.srcElement.nodeName == "IMG") {
		return
	}

	//winName
	if (evt.target.winName) {
		var winName = evt.target.winName
	} else {
		var winName = evt.target.parentNode.winName
	}

	//debug
	console.logg("liClicked, evt = ", evt, ' winName = ', winName)

	//element clicked is current window
	if (bg.winId_from_winName[winName] == curWinId) {
		window.close()	//close popup
		return
	}

	//element clicked is open named window
	if (bg.winId_from_winName[winName]) {
		var winId = bg.winId_from_winName[winName]
		//named window already open
		console.logg('liClicked; window already open')

		//switch to that window
		chrome.windows.update(winId, {
			focused : true
		})

	}

	//closed named window
	else {
		bg.openWindow(winName)
	}

	//close popup!!
	window.close()

}

function lixClicked(evt) {//delete
	evt.preventDefault()
	evt.stopPropagation()
	console.logg('lixClicked, evt = ', evt, '$(evt.target).parent()[0] = ', $(evt.target).parent()[0])

	//display //add class
	var li = $(evt.target).parent()[0]
	$(li).addClass('deleted')

	//shorthand
	var winName = li.winName
	var winId = bg.winId_from_winName[winName]

	var __backup_for_undelete
	backupForUndelete(winName, winId)

	var __delete
	bg.deleteNamedWindow(winName)

	bg.updateBadge(winId)

}//lixClicked

function backupForUndelete(winName, winId) {
	var __init_backups
	undelete = new Object()
	undelete.WinObj_from_winId = new Object()
	undelete.TabObj_from_tabId = new Object()
	undelete.winId_from_tabId = new Object()
	undelete.WinInfoObj_from_winName = new Object()
	undelete.winId_from_winName = new Object()
	undelete.winName_from_winId = new Object()
	undelete.localStorage = new Object()

	var __backup
	var data_1_WinObj_from_winId
	//undelete.WinObj_from_winId[winId] = bg.WinObj_from_winId[winId]	//no need to backup	//NOT deleted
	var data_2_TabObj_from_tabId
	//not deleted
	var data_3_winId_from_tabId
	//not deleted
	var data_4_WinInfoObj_from_winName
	/*
	 undelete.WinInfoObj_from_winName[winName] = new bg.WinInfoClass()
	 undelete.WinInfoObj_from_winName[winName].starred = bg.WinInfoObj_from_winName[winName].starred
	 undelete.WinInfoObj_from_winName[winName].timeLastClosed = bg.WinInfoObj_from_winName[winName].timeLastClosed
	 undelete.WinInfoObj_from_winName[winName].timeLastModified = bg.WinInfoObj_from_winName[winName].timeLastModified
	 undelete.WinInfoObj_from_winName[winName].timeLastOpened = bg.WinInfoObj_from_winName[winName].timeLastOpened
	 undelete.WinInfoObj_from_winName[winName].numberOfTabsOpen = bg.WinInfoObj_from_winName[winName].numberOfTabsOpen
	 undelete.WinInfoObj_from_winName[winName].numberOfTabsStored = bg.WinInfoObj_from_winName[winName].numberOfTabsStored
	 */
	undelete.WinInfoObj_from_winName[winName] = bg.WinInfoObj_from_winName[winName]
	undelete.WinInfoObj_from_winName[winName].index = bg.WinInfoObj_from_winName._orderOfNames.indexOf(winName)
	var data_5_winId_from_winName
	undelete.winId_from_winName[winName] = bg.winId_from_winName[winName]
	var data_6_winName_from_winId
	undelete.winName_from_winId[winId] = bg.winName_from_winId[winId]
	var data_7_localStorage
	undelete.localStorage[winName] = localStorage[winName]

}

function liUndeleteClicked(evt) {//undelete
	evt.preventDefault()
	evt.stopPropagation()

	//remove class
	var li = $(evt.target).parent()[0]
	$(li).removeClass('deleted')

	//undelete, restore
	//11111111111111111111111111111111111111111
	var winName = li.winName
	var winId = undelete.winId_from_winName[winName]

	var data_1_WinObj_from_winId
	//bg.WinObj_from_winId[winId] = undelete.WinObj_from_winId[winId]	//not deleted
	var data_2_TabObj_from_tabId
	var data_3_winId_from_tabId
	var data_4_WinInfoObj_from_winName
	bg.WinInfoObj_from_winName._orderOfNames.splice(undelete.WinInfoObj_from_winName[winName].index, 0, winName)
	bg.WinInfoObj_from_winName[winName] = undelete.WinInfoObj_from_winName[winName]
	var data_5_winId_from_winName
	bg.winId_from_winName[winName] = undelete.winId_from_winName[winName]
	var data_6_winName_from_winId
	bg.winName_from_winId[winId] = undelete.winName_from_winId[winId]
	var data_7_localStorage
	localStorage[winName] = undelete.localStorage[winName]
	//localStorage['WinInfoObj_from_winName'] = bg.stringify(bg.WinInfoObj_from_winName)
	bg.update_localStorage('WinInfoObj_from_winName')

	var __delete_undelete
	delete undelete

	var __update_badge
	bg.updateBadge(winId)
}

function saveWindow(evt) {//called by on submit and blur
	evt.preventDefault()
	evt.stopPropagation()

	//winName
	var winName = $('#saveWindowInput').prop('value')
	$('#saveWindowInput').prop('value', '')

	if (winName == '') {
		return
	} else {
		bg.saveWindowWithLocalStorage(curWinId, winName)
	}

	//reload
	location.reload()
}

function starMouseEntered(evt) {

}

function starMouseLeft(evt) {

}

function starClicked(evt) {
	evt.stopPropagation()//prevent li from being clicked
	evt.preventDefault()
	console.logg('starClicked; evt.srcElement =', evt.srcElement, 'starred = ', evt.srcElement.starred)

	//shorthand
	var star = $(evt.srcElement)
	var winName = $(star).prop('winName')
	console.logg('starClicked; winName = ', winName)

	if ($(star).hasClass('starred') == true) {
		//data
		bg.WinInfoObj_from_winName[winName].starred = 'not starred'
		//localStorage['WinInfoObj_from_winName'] = bg.stringify(bg.WinInfoObj_from_winName)
		bg.update_localStorage('WinInfoObj_from_winName')

		//grey
		$(star).removeClass('yellow')
		$(star).removeClass('starred')
		$(star).addClass('grey')
		$(star).prop('src', '\pics\\Star-16.png')	//show grey star
	} else {
		//data
		bg.WinInfoObj_from_winName[winName].starred = 'starred'
		//localStorage['WinInfoObj_from_winName'] = bg.stringify(bg.WinInfoObj_from_winName)
		bg.update_localStorage('WinInfoObj_from_winName')

		//display //yellow
		$(star).removeClass('grey')
		$(star).addClass('yellow')
		$(star).addClass('starred')
		$(star).prop('src', '\pics\\star16.png')	//show yellow star

	}

}

//////////////////////////////////////////////////

