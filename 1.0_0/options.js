//global vars
////////////////////////////////////////////
var bg = chrome.extension.getBackgroundPage()



////////////////////////////////////////////////

//util
////////////////////////////////////////////////////
function printHTML(object) {
	var newSpan = document.createElement('span')
	newSpan.innerHTML = object
	document.body.appendChild(newSpan)

}
///////////////////////////////////////////////

//interface
////////////////////////////////////////////////

//buttonRestoreDefaults
//111111111111111111111111111111111
printHTML("<br><br>")

var buttonRestoreDefaults = document.createElement('button')
buttonRestoreDefaults.innerText = "Restore localStorage Defaults"
var buttonRestoreDefaultsOnClick = function() {
	//delete all prefs
	localStorage.clear()
	
	//restore defaults
	bg.setDefaults()
	
	//reload
	location.reload()	//reload the page
}
buttonRestoreDefaults.addEventListener("click", buttonRestoreDefaultsOnClick, false)

document.body.appendChild(buttonRestoreDefaults)
//1111111111111111111111111111111111

//delete localStorage
//1111111111111111111111111111111111111111111

var deleteALL = document.createElement('button')
document.body.appendChild(deleteALL)

deleteALL.innerText = "delete all localStorage data, includes all tabs info"
var deleteALLOnClick = function() {
	localStorage.clear()
	location.reload()	//reload the page
}
deleteALL.addEventListener("click", deleteALLOnClick, false)

//111111111111111111111111111111111111

//popup link
//111111111111111111111111111111111111111111111
var popupLink = document.createElement('a')
document.body.appendChild(popupLink)
popupLink.innerText = "popup html"
popupLink.href = chrome.extension.getURL("popup.html")

//11111111111111111111111111111111111