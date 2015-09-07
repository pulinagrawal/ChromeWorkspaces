var info
/*
 //example extensions
 -see tabs Manager extension... list of windows and the tabs under them
 -tabs saver has |> on popup list, to shown / hide tabs
 -simple window saver is really simple

 //chrome storage options
 ////////////////
 Unlimited storage for Offline APIs for chrome extension:
 App Cache
 File System
 IndexedDB ; can be unlimited; not chrome user synced? probably not

 chrome.storage (not just strings, no need for background page; transactional limits!, can be unlimited; onChanged listeners)

 chrome.storate.sync; only 102 kb total limit; 4kb per item; max items:512, max write per hour :1000; max write per minute: 10

 DOM Storage, localStorage API, window.localStorage (only strings, ~5mb persistently cached client-side; unsecure)
 //synced in chrome extension syncing?? not

 ////////////////////////////
 */

var doNext
/*
//////////////////////////////////////


	



    


-popup.js bug; cannot undelete MULTIPLE wins... but does not say so... 



-manager/explorer; ability to CLOSE open named window directly from explorer...??

-options page; import, export data, offline, online, to bookmarks...


-storedTabs html; limit amount of displayed tabs... can continue into next page if too many entries...



-explorer/manager; refresh is jarring, how about create new document and update as needed?




-explorer/manager; add 'suspended' yes/no column
-explorer/manager; hostname of suspended tabs of the great suspender/etc are resolved to extension foldername
	//change getHostname()
	
-explorer/manager; able to sort list items by domain!!


-suspend web pages!?? NO, leave to other extensions...
	//use location.search to get query string	//includes the ?
	//OR just use something like #url= like in The Great Suspender




-manager/explorer; when moving old tabs to a winName with new tabs; the older tabs are AFTER the newer tabs!!?
	//solution: auto OR manual sort of some sort at tabs page!?
	
	
-tabs page; manual sort buttons OR context menus



-tabs page; display domain name as first column! hostname?




-merge function!


-manager/explorer; can reorder tabs
	//a tab dragged onto another tab should swab the tabs order
	//a selection of tabs dragged onto another tab should move all those tabs to that position
	//change ALL time stamps too!!?? (groups are based on timeStamps)







-crash recovery! reopen last opened but NOT closed windows!





-opening many tabs at once= a lot of writes to localStorage, may crash chrome
	//need throttle to write to localStorage

-auto open last open storages in case of crash and then restart
-auto open last open storage

-bg; tabs title are not stored/updated when page is not done loading!!
	//fix: update data when tabs are 'loading'

-storedTabs page; add sort/group by domain; sort/group by date!!

-manager/explorer; do away with page refresh on blur...
	//update/redraw parts of pages instead

-background; auto database error repairs

-storedTabs page; draggable links to change tab groups
	//change date data....
	
-manager/explorer; sort tree items by Name!! Date last modified... last opened... etc...

-auto keep in order??


-manager/explorer; pretty dates

-manager/explorer; sort tree items by date?

-add suspend tabs!!


-backup/restore; can backup/download JSON file
	



-manager/explorer bug; double clicking on list items does nothing //should open tab if item is stored tab
	//closed named window open tab -> prompt choice to open WINDOW or open tab??
	//closed named window stored tab -> prompt choice to open WINDOW or open tab??


-use Page Visibility API??
	//document.hidden	//document.webkitHidden
	//document.visibilityState //document.webkitVisibilityState
	//document.addEventListener("webkitvisibilitychange", handleVisibilityChange, false);	//fires twice and does not fire when switching windows



-manager/explorer bug; when listItems have changed, html is outdated, error when moving them from one win to another!!
	//effect:
	//corrupts winName data
	//...
	//create/implement data autoupdate display 
	//solution: 
	//data-binding frameworks
	//angular.js //client side two way data-binding 
	//backbone.js //no data-binding---?
	//ember.js //highly recommended+++++ //no boiler-plate code //big, slow?
	//enyo.js
	//knockout.js, MVVM +++	//supposedly very fast
	//meteor.js------ //mix of client JS and server node js //need MongoDB server
	//mithril, Mithril is a client-side MVC framework - a tool to organize code in a way that is easy to think about and to maintain.	//fast
	//ractive.js //Ractive.js is a template-driven UI library, but unlike other tools that generate inert HTML, it transforms your templates into blueprints for apps that are interactive by default. //Two-way binding, animations, SVG support 
	//rivets.js //Lightweight and powerful data binding + templating solution for building modern web applications. //model-driven views (MDV) using declarative two-way data binding. 
	//Stapes.js //super tiny MVC framework //MVC //Class creation, custom events, and data methods. That's all it does

	






-manager/explorer bug; cannot delete list items when a closed named window turns into a open named window
	/even when explorer page is refreshed...
	//fix:
	//works if refreshed a few secs after window is completely opened...
	//add check to see if window status has changed...??




-manager/explorer; has change color themes??



-simplify code with just 1 SMART data updating routine...
	//handles data updating in ALL situations...





-manager/explorer; add close window option to tree item context menu


-store tabs; option to reverse order of tabs stored...



-manager/explorer; can change list item order
	//handle_list_item_drop



-manager/explorer; can search
-manager/explorer; has a ALL tree that accesses ALL tabs in ALL windows.....



-onetab; can import/export into onetab!!






	
-default winName; auto open 'default'++ or 'startup'-- named window on chrome startup

-default winName; auto store all tabs in 'default' if 'store tabs' is pressed in unnamed window...
	//change unnamed window to default if default is NOT open; otherwise switch to open default window ??


-manager; moving a STORED tab into a winName that has already been deleted(name is deleted...but window still open...) (via popup) produces error with cloned tab element hanging in middle of nowhere
	//correct behavior will be do delete/refresh list of wins
	//solution:
	//just refresh whole page if winName does not exist anymore
	




	
-data structure; change to use double stringify instead of a localStorage.WinInfoObj_from_winName and then localStoreage.winName









-storedTabs; sort by title	//permanently change TabsStored??
	//temporarily??

-storedTabs; sort by url

-storedTabs; sort by domain

-storedTabs; "Star" a tab to be it unDeletable
	//add star at end of title; away from deleteButton
	
-storedTabs; "Star" a tab to be it unDeletable	
	//can have MORE than 1 stars	//3 stars?? //5 stars??
	//starred tabLink Line will NOT have deleteButton But a STAR/unstar button instead??
	//add star features to option
	//starred tabs can be displayed on right half side of storedTabs page??	//split page??
	//custom context menu to star??


-storedTabs; time Group
	//add options/features to Restore, Delete all, Share, name tabgroup, lock tab group, star entire tab time group
	
-storedTabs; time group; star; can add star to whole time group	

-storedTabs; time group; movable; tab Links can be Movable like in OneTab
	//moving just changes the time to be...


-storedTabs; options; can change link colors


-storedTabs; tabs; undelete??


-storedTabs; options; add options div in upper right hand corner of page
	//fadeOrHide
	//time formats to sort by...
	//reloads page when options changed
	
-import/export	//generate a webpage of links
	//such an html can be saved offline, browsed, imported, shared...
	
	
-storedTabs; menu; add menu actions and menu div 



-storedTabs; startup; storedTabs page auto opens


-popup; store tabs button works even when Window/Subject is UNnamed
	//tabs are NOT stored but just removed
	//solve by autosave to a generated name
	//unnamed	//unnamed-1	//unnamed-2...
	//always open dafault subject...



-reject duplicate links
	

-bug: delete named window; does not delete TabsStored?? storedTabs webpage??
	//undelete...



-storedTabs; display domain name columns; make sortable??

-rename; Window names/Folder names to Subjects







-unnamed; store Unnamed window tabs in a default window??
	//no




-storedTabs; add features like those found in onetab





-popup; add close all windows button

-popup; add store All Tabs and Close All Windows button



-startup/crash; a tab auto opens to remedy the crash

-popup; floating tooltips
	//use title attribute

-manager; title should reflect name of an open NAMED window


-popup/startup; can STAR it so that folder/window will AUTO-load

-manager/list; favicons

-startup crash; auto?? reopen last open "folders"	"windows" in case of crash...

-startup crash/popup; button to 'restore' last open windows



-add sent current tab to storage to popup...



-design new logo; V of stars... or A with three stars, top star is biggest...

-popup; show unnamed windows, can switch to unnamed windows



-auto sort (into folders) by domain names

-implement one folder = one window = one folder of tabs with parking all tabs

10/6/13 aware of one-tab!! very good, like my last extension for firefox
very nice extension!!! stop development of this extension!!!?? no, one tab does not work nicely with tab suspenders...?? feels wrong, does not play nicely with the great suspender???
there's no sorting...

-a tab of tabs that updates automatically...	//displays only tabs of that session-window

-refresh/reload tabs manager TABS whenever 'relevent' information is changed...//use get / set??
//eg
//when a previously open unnamed window is NAMED/SAVED to be an open named window
//tab manager, when reloaded, should check for last 'folderOpen' and open that folder

-duplicate finder	//searches for duplicated urls in different sessions

-refresh/reload tabs manager when a new window is named.....

-mark current WINDOW in tab manager!!

-able to Rename window names in windows and tabs manager

-double click list items opens them

-tab manager pages auto refreshes wherever new window has finished loading...

-able to put tabs into storage when window is open And Saved
-able to put tabs into storage when window is closed and Saved

-save closed window data....??

-toolbar...
-top right refresh button

-able to create NEW empty window in windows manager

-context menus for tree items!!
//use jQuery-contextMenu by rodneyrehm OR https://github.com/arnklint/jquery-contextMenu by Jonas Arnklint
//delete, rename

-context menus for list items!!
//use jQuery-contextMenu by rodneyrehm OR https://github.com/arnklint/jquery-contextMenu by Jonas Arnklint

-tabs manager able to manipulate OPEN tabs AND windows in open unnamed windows...

-make list items sortable	//add /\ \/s
//jquery ui sortable NOT compatible with draggable behavior...
//code custom overlay, drag behaviors...

//jquery ui selectable completely NOT working when items are draggables
//code custom selecting behaviors

-manager able to switch columns!!!

-able to 'BACKUP' to cloud...

-make list items selectable

-highlight selected/open window

-recycle bin div!!
-expanable recycle bin div

-sort by hostname

-populateList()

-replace/close window if window is only 1 tab with homepage OR blank page!!

-nice ui design at http://www.jqwidgets.com/jquery-widgets-demo/demos/jqxsplitter/index.htm#demos/jqxsplitter/defaultfunctionality.htm

-add pageAction icons in address bar

-use jqwidgets? looks really nice

-integrate with chrome bookmarks!!

-fix bug with col resizers appearing at bottom... jQuery position wrapped around...

-able to remember column sizes
-able to remember windows and tabs manager dimensions

-able to switch columns
-click tree name to open list of tabs... in manager

-add resizing divs

-remove this.windowId from TabClass
-(55 , 20) instead of (55 / 75)

-prettify scrollbars

-change windows string format

-meta data

-'save to' in popup... where upon clicked, will list all WinNames available... on winName selected, previous winName tabs will all become 'inStorage' and the tabs current open will be the 'inWindow' tabs

-check if moving multiple tabs at the same time breaks anything

-auto save unnamed windows!! auto name as date +hour+min...?

-auto put suggested window name into popup

-shortcut to store tab... alt-s or shift-s; store all tabs... all tabs in all windows...

?max size/length of 1 string stored into localStorage...? even with unlimitedStorage??

-change browserAction tooltip to display something useful

-faviCon for tabStorage manager page

-create hidden doc tree in bg, then use jquery to search...?

-manager/organizer for named windows AND tabs

-list tags in tree area

-manager; able to rename named windows??	//just delete and resave is better??

-use jquery ui tabs?

-randomize badge text colors for saved named windows... or use/cycle preset?

-complete bookmark management system
-label website/domain... nsfw, comics, etc...

-put tabs into 'storage'

-most visited...
-recently visited...
-'ALL' tabs!! in windows and tabs manager

-the 'no tag' tag / lable
-auto tags; like in gmail /label

-gzip...? LZW?
//http://code.google.com/p/jslzjb/
//http://nmrugg.github.com/LZMA-JS/

-tag website, bookmarks!

-encryption; after compression...

-compressions!... for chrome.sync

-use chrome.storage or indexed DB instead of DOM localStorage API

-export/import data inside a textbox, json, like in tabs saver; user versioning INFO

-sync via bookmark!? max url length >2,000...; firefox urls > 100,000 characters.

-synetic bookmark with compressed and encrypted data!

-tab syncing?; chrome already supports tab syncing...

-save and search using indexed DB?

-floating button on top right corner OR top center OF webpage to 'store' the tab for later viewing

-tags!
-tag and close
-may or may NOT auto focus on tab open from tab manager

-preview panel right inside tab manager!!
-full previews as provided by chrome of currently open tabs

-use jQuery for searches; put stuff into DOM, then use jQuery //more efficient than case by case search of every string in localStorage?
-or use jQuery grep, map??

-search, tag with TaffyDB??

-AutoComplete search box? omnibox? in popup?

-sort by name, sort by date created, custom order in popup AND windows and tabs manager...

-REPLACE context menu; like in chrome bookmark manager

-use GOOGLE bookmarks!?? OAuth??

-search!!

-show folder path in search... in tab manager

-autoLoad Last closed session, option

-save unnamed session window?
-sort by date, sort by server... options...

-preview tabs?

-context menu to put tab into storage!

-user specific, one user cannot access another's...
-anon user
-non user specific, public bookmarks...

-recycle bin; deleted bookmarks goes into recycle bin
-add advertisements


-autosave last ten anon sessions

-merge sessions; via drag and drop... see and use Windows and Tabs manager...

*/

///////////////////////////////////////////////////////////////////
var
done
/*
//
---------------------------//commit	2015/3/2	v0.1.7
-background.js; still storing a lot of empty non-existing empty new tabs as open tabs...3/2/15
	//wasn't like this for 2 years.... grr
	//eliminate empty new tabs in openWindow()

----------------------------//commit 2015/2/25	v0.1.6
-background.js; TabObj can get corrupted into 'undefined' and null...	2/25/15
 	//still cannot find out why TabsOpen gets corrupted, 
 	//maybe //TabObj_from_tabId[tabId] = null	//caused tab corruption???
 	//remove all = null instances

----------------------------//commit 2015/2/23 v0.1.5
-background.js; phantom tabs in TabsOpen
	//still cannot find out why there are phantom newtabs that do not get deleted in TabsOpen when the real browser tabs closed... where did these things come from? did not happen in two years of usage...
	createIfNoTabObj_from_tabId(tabId)??
	because of create new tab in storeTabsInCurrentWindow()??
	//caused by clicking on x to close tabs, sometimes it isn't closed and it causes a newtab event to be created but a tab does not actually exists and it also does not trigger a tab removed... a new browser bug 2/20/15
	probably caused by popup blocker trying to close popup? especially frequent on dm5.com
	//created a new closeTab() to be used in storeTabsInCurrentWindow, which is a copy of tabRemoved() to handle data update in case tabRemoved is NOT called because tabId is invalid
	

-----------------------------//commit 2015/2/21 v0.1.4
-popup; stash tabs not working...	2015/2/20
	//not closing the tabs... never happened before, despite using it for two years...
	//cannot be reproduced reliably...	
	//Unchecked runtime.lastError while running tabs.remove: No tab with id: 245.
    at Object.callback (chrome-extension://fnggjfjbfeokcbnjedofhamgpjpfhcog/background.js:868:15)
    //unhandled error... no tabs are closed at all... at chrome.tabs.remove(idsOfTabsToClose, function(args) {... inside storeTabsInCurrentWindow(winId)
    	//2015/2/21
	//Unchecked runtime.lastError while running tabs.remove: No tab with id: 471.
    at Object.callback (chrome-extension://fnggjfjbfeokcbnjedofhamgpjpfhcog/background.js:868:15)
    	//seems like tabs in tabsOpen is not being deleted on tabs removed event sometimes... especially when it is an empty tab...

	//temp solution:
	//make multiple remove calls instead of one big call with all the tabIds to remove...    	


-----------------------------//commit 2015/2/20 v0.1.3

-storedTabs html bug; x delete not working...	2015/2/20
	//relationships got messed up from converting links from div to right-clickable links

-----------------------------//commit 2015/2/20

-popup.js; undelete is not working... 2015/20/20
	//had var data_1_WinObj_from_winId = WinObj_from_winId in popup.js...
	//WinObj_from_winId is NOT defined in popup.js... even though it is defined in bg
	//fixed

---------------------------//commit 2015/2/20

-bug; serious; opening a window and then closing it FAST; while the tabs are still loading; messes up the localStorage data
	//solution: add erroring checking to update_localStorage() and use ONLY update_localStorage() to update localStorage


-------------------------//commit 2015/1/28
-explorer/manager; add sorting to winNames
sort winNames by winName
sort winNames by time...//timeLastClosed, timeLastModified, timeLastOpened
sort winNames by number of tabs open...
sort winNames by number of tabs stored...
//sort, change in bg.WinInfoObj_from_winName._orderOfNames; info in bg.WinInfoObj_from_winName.[winName]
//update localStorage.WinInfoObj_from_winName when done... or not, will get updated by many other events...


-------------------------//commit 2015/1/26

-bg.js; delay run updateBadge() inside windowFocusChanged()
-manager.js; changed getHostname() to parse suspended urls correctly 


-------------------------//commit 2015/1/21

-tabs page; cannot right click and open in new tab!!
	//reason: because the divs are not links!?
	//solution:
	//surround span div with <a> tags
-change favicons to use http://www.google.com/s2/favicons?domain=news.yahoo.com
-manager; fixed month Jan = month 0; added offset +1
------------------------------//commit
2015/1/21
-change favicons to NOT use http://g.etfv.co/ and to use http://www.domain.com/favicon.ico instead

-------------------------//commit
-tabs page; update,refresh tabs page only when timestamp of lastUpdated of page vs data doesn't match!
	//need more accurate time!
	//do away with UNIXtime() save byte operation!
	//would waste a lot of memory/space with tab links!?
	//solution: add a storageLastModified to WinInfoObj_from_winName that uses time accurate to milisecs
	//storageLastModified will need to be updated when WinInfoObj_from_winName[winName].numberOfTabsStored need to be updated
	//add	bg.WinInfoObj_from_winName[winName].storageLastModified = bg.getTime()
	//explorer/manager; removeListItem() 
	//or tabs page; deleteButtonClicked()
	//or stash tabs! => bg.storeTabsInCurrentWindow(curWinId)
	//check if storageLastModified exists; reload page if it does not exist
-----------------------------//commit

-throttle write to localStorage when new tabs are opened!!
	//need a queue and timer system! centralized update function!?
	//solution: update_localStorage() in bg.js
	
-manager/explorer bug; list items with no titles do not have a line...
	//solution: add ' - ' if li.innerText = ''



--------------------------//commit

-manager/explorer bug; moving tabs will fail for some in selection; messes things up
	//reason: $selected will sometimes have open tabs index 1, 3 ,5, 6 then stored tabs indices 354, 353, 352...
	//backward loops to handle deletions and insertions did NOT take into account the way the indices can be ordered differently
	//sort through list?? YES
	//solution: presort and combine $movableOpen and $movableStored into 1 $movable list

-------------------------//commit

-manager/explorer; renamed ALL funtions to be actionables; listener => listen_for; handler => handle_whatever

-------------------------//commit

-manager/explorer; display time in MM/DD/YY HH:MM:SS format

--------------------------//commit
-manager/explorer; switch tree items only swaps name element; other data elements (dates) are NOT swapped!
	//solution:
	//change handle_tree_item_drop

--------------------------//commit
-popup bug; delete no longer works
	//winName == null error	//why
	//prob problem:
	//lixClicked()
	//var winName = li.id
	//li.id = winId in some area and li.id = winName in other areas
	//li.id should just be winName	//need to override li.id inherited from template
	//solution:
	//var winName = li.winName in lixClicked()
	//
	//bug 2:
	//cannot resave window after delete!
	//cause:
	//window data for open unnamed window are all deleted!!
	//do not delete WinObj_from_winId in deleteNamedWindow in bg page
-----------------------//commit
-manager/explorer bug; rename tree item causes error; window not renamed; .item.tree.winClosed to NOT apply!!
	//when rename open unnamed window
	//prob problem:
	//handle_tree_item_rename_end
	//prob: previous fix made treeItemInEdit.winName = newWinName BEFORE case checking and affected case checking
	//solution: 
	//move  treeItemInEdit.winName = newWinName
	//BACK behind case checking
---------------------//commit
-manager/explorer bug; rename tree item causes error; window not renamed; .item.tree.winClosed to NOT apply!!
	//prob problem in:
	//handle_tree_item_rename_start	
	//treeEditInput.value = treeItemInEdit.innerText//copy old value to input
	//trouble arises when the innerText is NOT the winName!!
	//solution:
	//use winName instead of innerText!!

--------------------//commit
-popup icon; show 'none' or 'unnamed' for unnamed windows!
	//only 4 chars
--------------------//commit

-storedTabs; auto refresh on focus!?
-------------------//commit

-manager/explorer bug; double clicking on list items does nothing //should open tab if item is stored tab
	//open named window open tab -> focus
	//open unnamed window open tab -> focus
	//solution:
	//make tab active
	//make window focus

------------------//commit
-manager/explorer bug; double clicking on list items does nothing //should open tab if item is stored tab
	//open named window stored tab -> open tab, turn stored tab into open tab
	//open unnamed window stored tab -> open tab, turn stored tab into open tab
	//solution:
	//handle_list_item_double_clicked()

---------------//commit
-manager/explorer; label CURRENT window inside manager/explorer


-----------------//commit

-manager/explorer bug; when listItems have changed, html is outdated, error when moving them from one win to another!!
	//solution:
	//refresh page on window focus+++ or document focus
	

-------------------//commit

-manager/explorer; handle_list_items_delete did not take into account of list items' order being changable
	//problem:
	//tabIndex may be reversed... the order to delete/close tabs is important..., always close larger index first so smaller indexex are not affected
	//fix
	//added tabIndex dependent if loops

-------------------//commit

-manager/explorer; double clicking on stored window name opens mulitple instances...
	//need to check if winName is ALREADY opened before opening it...
	//fix:
	//check if window condition STILL holds true!!
	//fix:
	//fixed setTimeout reload in handle_tree_item_double_clicked
	//added 
	//______________________-------------------------
	//check status of item	//reload if status changed
	var winId = evt.target.winId
	var winName = evt.target.winName
	if ((!winId && winName && bg.winId_from_winName[winName]) || (winId && winName && !bg.winId_from_winName[winName]) || (!winName && winId && bg.winName_from_winId[winId]) || (winName && winId && !bg.winName_from_winId[winId])) {
		//target element does not match bg var status
		//html is outdated
		location.reload()
	}
	//________________________-------------------
	//to handle_tree_item_clicked and handle_tree_item_double_clicked
	
-------------------//commit
-manager/explorer; add delete to list item context menu

-------------------//commit
-manager/explorer; can change sorted order of list items
	//added settings.openTabsOrder, settings.storedTabsOrder
	//these can be changed via list item context menu


--------------------//commit

-manager/explorer bug; rename tree item with F2 and then end with F2 corrupts data
	//even if NO editing was done
	//cause
	//possible mix up with listeners with listen_for_tree_item_rename and listen_for_list_item_rename
	//NO
	//cause
	//probably caused by newWinName and oldWinName being the same
	//then data associated with newWinName was deleted when data associated with oldWinName were deleted



--------------------//commit
-manager/explorer; can change tree item order
	//bg.WinInfoObj_from_winName._orderOfNames only for closed named windows...
	//only works for closed named window //closed named window are populated from bg.WinInfoObj_from_winName._orderOfNames in createDisplay_tree_items
	//handle_tree_item_drop


--------------------//commit
-manager/exlorer; overhauled handle_tree_item_drop aka listItemMover

--------------------//commit
overhauled handle_list_items_delete
-bug; manager/explorer; delete storedTabs not working right
	//cause
	//handle_list_items_delete may have errors handling stored tabs AND open tabs at the same time
	//handle_list_items_delete realies on 

--------------------//commit

-bug; manager/explorer; delete CURRENT open unnamed window will NOT delete the data
	//window data still shows up in other explorer pages
	//bg.WinObj_from_winId still has data of closed window
	//cause
	//windowRemoved in background.js?
	//cannot set property 'timeLastClosed' of undefined
	//WinInfoObj_from_winName[winName].timeLastClosed = UNIXtime()
	//window may NOT have a winName... 
	
	
--------------------//commit
-bug manager/explorer; 
	//popup of an deleted open named window deleted to be an open unnamed window has error
	//still says 'this is' deleted winName
	//cause
	//handle_tree_item_delete bug
	//chrome.windows.get(curWinId, {
				populate : true
			},
	//curWinId inside manager.js malfunctions as manager tab can be in ANY window and delete ANY other window


--------------------//commit
-manager/explorer; rename winNames; 
	use contextMenu when tree item name is right-clicked

--------------------//commit
-manager/explorer; rename winNames; 
	use enter key when tree item name is selected, 
--------------------//commit

-manager; auto open /highlight last clicked on winName even when manager tab is opened/refreshed	
	//now works on open unnamed window as well
	
--------------------//commit

-manager/explorer; fixed bug with handle_tree_item_delete not working right
	//open named window on delete will lose even window info
	//solution
	//need to update the unnamed window's data in bg by 
			chrome.windows.get(curWinId, {
				populate : true
			}, function(window){
				bg.windowCreated(window)
				for (var i in window.tabs) {
					bg.tabCreated(window.tabs[i])
				}
			})
--------------------//commit

-popup; tabs button	//only show stored tabs page, not store the tabs

	
--------------------//commit

-bug; popup; tabs explorer/manager pressed in open unnamed window will not open an explorer tab
	//will then cause all future calls to be ignored, even in other named windows
	//cannot be fixed??, cannot call chrome.windows.getCurrent again after too soon
	//no
	//caused by making the explorer tab active in another window and NOT current window
	//especially if explorer tab is already active in another window
	//bug is with chrome's fault; chrome.windows.getCurrent does NOT work
	

--------------------//commit


-startup; 'STAR' a winName at popup to make it auto load when chrome starts


--------------------//commit

-manager; auto open /highlight last clicked on winName even when manager tab is opened/refreshed	



--------------------//commit

-manager; show stored tabs


--------------------//commit

-popup; recently opened Window Names will moved to the top

-----------------//commit
-storedTabs; number; number of tabs in group does not update when 1 tab is opened/removed
	//need to change html structure
	//added tabGroup div; parent to 1 timeLineDiv and parent to many tab link divs
	//enables many additional features

--------------------//commit

-storedTabs; time group; add #Number of tabs per sorted time group

-bug -store tabs in popup	//stored tabs that was LOADING when it was stored and removed will have different time than tabs that has finished loading when it was stored and removed	
	//has to do with tab updated and tab removed
	//solution
	//introduce timeLastClosed, replace timeCreated


-bug; popup; scroll bar does not display SOMETIMES, seems to be clipped...
	//added overflow:scroll; to body
	//changed to overflow:visible
	//solution:
	//caused by minWidth property... it is a unknow...
	//removed it... seems better... but scrollbar still hidden sometimes...
	//best!! solution::
	//added html {
	overflow:scroll;
}
	
	

-----------------//commit

-storedTabs; name; show Name of named window at top of page

-storedTabs; total number; show total number of stored tabs

-storedTabs; time groups; sort tabs by DAYs or HOURs or Time
	//add info line if different date...

-storedTabs; add favicons
	//use http://getfavicon.appspot.com/
	//usage http://g.etfv.co/http://www.google.com?defaulticon=http://en.wikipedia.org/favicon.ico
	//where default = default icon
	
	

-storedTabs; add delete x css button	//see OneTab for example



-storedTabs; fix link colors; NOT visited link color
	//use css a:visited — defines the style for visited links	//does not work
	//used a:-webkit-any-link {
	color: #234567;	#3397E8 or #0D80DE or #234567
} in css


-popup; add "store all tabs" "put all tabs into folder" or "file away all tabs" ON one line!!
	//created buttons with http://www.cssbuttongenerator.com/
	//


-popup; auto focus on save field when popup button is clicked if window is open unnamed window
	//added $('#saveWindowInput').focus()
	


-POPUP; show all OPEN folders before closed folders!!
-POPUP; show OPEN status of all OPEN "folders"/"windows" on popup menu




-frequent crashes... weird...
//add checks for WinObj, TabObj, WinLocalObj create new if now exists...
//seems to have fixed the problem; no idea what I did except cleaning up...

-fix bug: closing window did not delete Tabs info from bg var TabObj_from_tabId
//was using tabId filed when it was named id in TabClass()

-make tabs movable from 1 window to another!!
//open and closed statuses should stay the SAME!!! if possible!!!

-make tabs movable from 1 window to another!! 2/3 done
//open and closed statuses should stay the SAME!!! if possible!!!
-fix bug where open named windows are not keeping track of tabs...
//open a previously closed named window....
//stupid
//have 	isNamedWinId\[winId\]
//		isNamedWinId\(winId\)

-fix tree headers and list headers not highlighted when dropping/switching headers

-dbl click on tree items opens/focuses to that window
-fix no badge after opened tabs Manager from popup

-fix listen_for_list_items_delete to handle mixed OPEN and CLOSED tabs in OPEN window

-able to delete tree items/windows from open unnamed windows
-able to delete tree items/windows from open named windows
-able to delete tree items/windows from closed named windows

-able to delete list items/tabs from open unnamed windows
-able to delete list items/tabs from open named windows
-able to delete list items/tabs from closed named window

-fix bug with draggable clone helper being hidden by some elements... not on top
//chaning z-index would NOT help, as stacking context of div3list is still below that of div3splitter and other...
//need to change clone parent to higher order
//OR
//change ALL elements stacking order!!...??
//OR
//use...
//$('.list.item.title').draggable({
//appendTo: 'body', //THIS!!!

-make tree columns switchable and order auto save.....	//

-make list columns switchable and order auto save.....

-see OPENED and CLOSED windows directly in tabs (and windows) manager; named AND unnamed!!!

-make windows able to have same names!!??
OR
-make window save TO window with same name... combine...
OR
-make windows into sessions, with sessions able to have many windows...??
OR
-rename window when window with same name already exists or is in open status	//THIS!!!
//changes are inside bg.saveWindowWithLocalStorage()

-make list items editable

x-make list items editable AND then reflect changes to bg and SAVE changes to localStorage
///no need...
//tabStorage list items does not need to be editable..
//only window names need.

-make list items selectable

-bug, items are being dropped onto another item underneath...
//fundamental bug with droppable...?
//fix by
//1. coding own droppable OR
//2. use droppable's accept or scope
//3. fix droppable by using mouseover or hover...	//this option	//may be 'slow' ?
//4. use mouseup to trigger

-make headers and items draggable and droppable

-manager remember column widths!!!

-hostname

-jquery.autoPosition add options follower UpdateWhenFollowerMoved; UpdateWhenLeaderMoved; UpdateWhenParentScrolled, UpdateWhenWindowResized
//determines what kind of events leads to follower being updated!

-fix .autoPosition jquery Stack overflow errors whenever window resizes
//is fixed when added el checking to .on moved.autoPosition to filter out bubbling events...
//but still commented out $(window).on('resize'... section in eventRegister section
//MORE efficent; less wasted CPU cycles as $(window).on('resize'... affects EVERY single element that has ever Used .autoPosition
//use a #Main background div instead and trigger moved.autoPosition on #Main div when $(window).on('resize

-fix .autoPosition event bubbling BUG when propagating moved.autoPosition

-fix so that .autoPosition do NOT require movedBy... or moved or... evt...

-remove debug console.logs from .autoPosition

-change everything in manager into absolute position... and use jquery.autoPosition plugin

-list saved named windows in tree area
-able resize list columns in tree area

-fix bug where WinObj_from_winId's TabsOpen not properly deleting tabs SOMETIMEs... hmmm
//repeatable using Ctrl-W to close tabs rapidly...
//the 'index' in Tabs... do not update when Tabs are removed... using that index to
//changed tabRemoved to NOT use Tab.index; removed Tab.index altogether

-list how many tabs opened/stored in a named window at named windows list!!!

-change access/storage structure from Windows->Tabs to Sessions->Windows->Tabs ?? NO

-eliminate WinNamesSave... and WinNamesSaveClass...
//save metaInfo in WinFromWinName that uses the same WinClass as WinObj_from_winId instead??	//they even point to the same objs...??? NOd
//use WinInfoObj_from_winName instead...

-rework popup.js to work with TabObj_from_tabId, WinObj_from_winId, WinNamesSave, TabClass, WinClass bg vars

----------------------------------------------------------
-fix bug where new create tabs are not saved into localStorage...
-fix lixClicked and liUndeleteClicked

-----------------------------------------------------------

------------------------------------
-fixed bg.openWindow and bg.saveToLocalStorage to actually work from popup.js
-popup.js lixClicked and liUndeleteClicked still need work
-----------------------------------

----------------------------------
-changed BG vars to use TabObj_from_tabId and WinObj_from_winId to keep track of TabClass AND WinClass objs to keep track of tabs and windows...
-use WinNamesClass obj to keep track of saved named windows instead of name1//name2...
-reworked all functions in background.js to reflect above changes
-need to work on popup.js

----------------------------------

X-change localStorage['listOfWinNames'] from "name1//name2" to JSON strings...XX	//use meta data instead; preserve for order

-open manager jumps / focuses to manager tab if a manager tab is already open!

-fix bug with something making localStorage[''] entries and //// in listOfWinNames
//had	delete tabIdsFromWinId instead of delete tabIdsFromWinId[winId]...? ...fixed
//did Not have 	if(localStorage['listOfWinNames'] == ''){list = new Array()} ...fixed
//list.splice(list.indexOf(winName), 1) will delete if even winName is not found! ...fixed

-fix bug with save window error when localStorage['listOfWinNames'] is empty

-fix bug with not showing 'Save window as' in popup when localStorage['listOfWinNames'] is empty

-fix errors/bugs with bg global vars that keeps track of open saved named windows...
//error and weird behavior when saving a new named window
//bg.winId_from_winName all have the same winIds... wtf?
//error due to saveWindowWithLocalStorage() having been moved to bg and it ran chrome.windows.getCurrent()...?
//use chrome.window.get(winId.... instead

-update badge icon; grey star if window is not a saved named window... yellow star if window is a saved named window...

-fix error, "Uncaught SyntaxError: Unexpected token u " when clicked on li's text...

-update badge texts; saved named window name
//		chrome.browserAction.setBadgeText({
text : winName_from_winId[winId],
tabId : tabId
})
//for individual tabs does NOT work right... no idea why...

-move saveWindow and openWindow from popup.js to bg.js

-fix popup.html resizes to be really small when 'save as' is hidden; caused by resize width...hmm
//hack fix, added <br> after 'Save window as:'

-fix still showing 'save as' form even if window is already a saved named window!

-fix "save as" not marking window as saved...

-move 'This is windowName' to TOP of the list...

-delete and undelete saved named window from popup

-auto track windows and tabs closing, moving, creating, etc.

-restore saved named windows via popup.js

-list saved named windows in popup

-save named window via popup; using localStorage; JSON.stringify, JSON.parse; assume unlimited storage!!

*/
////////////////////////////////////////
/////////////////////////////////
var
notDo
/*
//

-startup; remember last opened named folder window and auto reopen it when chrome restarts?? or have a "default" startup folder??
	//superceded by star




-multi-windows sessions
	//NO
	//1 window = 1 session, easy
-multi-windows session AND session of only 1 window; both types of sessions at once?...
	//NO
	//1 window = 1 session, easy




-save named window via popup; using indexed DB; //too messy

 -save named window via popup; using chrome.storage.local, chrome.storage.sync
 //no need to stringify
 //5242880 quota even if set to unlimited...
 //automatically clears itself when extension is reloaded...bad
 */