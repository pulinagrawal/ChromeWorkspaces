//***********************

//by coderLau@gmail.com
//compresses text with a lot of repetitive words

//works well with CJSON
// to compress, call stringCompressor.comp
// to uncompress, call stringCompressor.uncomp

//not optimized code
//**********************



var stringCompressor = function() {

}

stringCompressor.debug = false

stringCompressor.base_convert = function(number, from_base, to_base) {
	return parseInt(number, from_base || 10).toString(to_base || 10);
}

stringCompressor.toUnicode = function toUnicode(theString) {
  var unicodeString = '';
  for (var i=0; i < theString.length; i++) {
    var theUnicode = theString.charCodeAt(i).toString(16).toUpperCase();
    while (theUnicode.length < 4) {
      theUnicode = '0' + theUnicode;
    }
    theUnicode = '\\u' + theUnicode;
    unicodeString += theUnicode;
  }
  return unicodeString;
}


//compress
//returns a New string
stringCompressor.comp = function(txt) {
	var newString = txt

	//rawLib
	// \b[a-zA-Z0-9_]+\b
	var wordReg = /\b[a-zA-Z0-9_.]+\b/g
	var rawLib = newString.match(wordReg)
	if(this.debug){console.logg("rawLib = ", rawLib)}

	//newLib
	var newLib = new Array()
	var newLibFreq = new Array()
	for (var i in rawLib) {
		var where = newLib.indexOf(rawLib[i])
		if (where < 0) {//not found in newLib
			newLib.push(rawLib[i])
			newLibFreq[newLibFreq.length] = 1
		} else {
			newLibFreq[where] = newLibFreq[where] + 1
		}
	}
	if(this.debug){console.logg("newLib = ", newLib, " newLibFreq = ", newLibFreq)}
	
	
	//filter out infrequent words
	var tempLib = newLib
	newLib = new Array()
	for (var i in tempLib) {
		if (newLibFreq[i] > 1) {
			newLib.push(tempLib[i])
		}
	}
	if(this.debug){console.logg("newLib after filter = ", newLib)}

	//filter out words shorter than 4 chars
	tempLib = newLib
	newLib = new Array()
	for (var i in tempLib) {
		if (tempLib[i].length >= 4) {
			newLib.push(tempLib[i])
		}
	}
	if(this.debug){console.logg("newLib after filter = ", newLib)}


	//sort lib words
	function sortWordListsLongestFirst(arr) {
		//var totalCompared = 0
		//var totalSwapped = 0
		for (var j = 0; j <= (arr.length - 2); j++) {
			//var swapped = 0
			for (var i = 0; i <= arr.length - 2 - j; i++) {
				if (arr[i].length < arr[i + 1].length) {
					//totalCompared++
					//totalSwapped++

					//swap
					var temp = arr[i]
					arr[i] = arr[i + 1]
					arr[i + 1] = temp
					//swapped = swapped + 1
				} else {
					//totalCompared++
				}
			}
			//if(swapped == 0){break}
		}
		//if(this.debug){console.logg("totalCompared = ", totalCompared, " totalSwapped = ", totalSwapped)}
	}

	sortWordListsLongestFirst(newLib)
	if(this.debug){console.logg("newLib after sort = ", newLib)}

	//word locations
	var newLibLocations = new Array()
	var index
	for (var i in newLib) {
		newLibLocations[i] = new Array()
		index = newString.indexOf(newLib[i])
		while (index > -1) {
			newLibLocations[i].push(index)
			newString = newString.replace(newLib[i], '')
			index = newString.indexOf(newLib[i])
		}
	}
	if(this.debug){console.logg("newLibLocations absolute = ", newLibLocations, " left over egString = ", egString)}

	//change newLibLocations from absolute to relative positions
	var newLibLocations2 = new Array()
	for (var i in newLibLocations) {
		newLibLocations2[i] = new Array()
		for (var j in newLibLocations[i]) {
			if (j == 0) {
				newLibLocations2[i][j] = newLibLocations[i][j]
			} else {
				newLibLocations2[i][j] = newLibLocations[i][j] - newLibLocations[i][j - 1]	//minus last value
			}

		}
	}
	if(this.debug){console.logg("newLibLocations2 relative = ", newLibLocations2)}

	//change from base 10 to base 36
	for (var i in newLibLocations) {
		for (var j in newLibLocations[i]) {
			newLibLocations2[i][j] = this.base_convert(newLibLocations2[i][j], 10, 36)
		}
	}
	if(this.debug){console.logg('newLibLocations2 relative base36 = ', newLibLocations2)}
	
	//change locs to string
	var locs = ''
	for (var i in newLibLocations2) {
		var s = newLibLocations2[i].join(' ')
		if(i == 0){
			locs = locs + s
		}else{
			locs = locs+'\''+s
		}
	}
	if(this.debug){console.logg('locs = ', locs, " locs.length = ", locs.length)}

	//output
	//var compString = newLib.join(' ') + JSON.stringify(newLibLocations2) + newString
	var compString = newLib.length.toString()+ ' ' + newLib.join(' ') + ' ' + locs.length + " " + locs + newString
	if(this.debug){console.logg('compString = ', compString)}
	if(this.debug){console.logg('ratio = ', compString.length / txt.length)}

	return compString
}


//uncompress
//returns a New string
stringCompressor.uncomp = function(txt) {

	//extract lib
	var split = txt.split(' ')
	if(this.debug){console.logg("uncomp; string.split = ", split)}
	var lib = new Array()
	for(var i = 0; i <= split[0] - 1 ; i++){
		lib.push(split[i+1])
	}
	if(this.debug){console.logg("uncomp; lib = ", lib)}
	
	//extract locsTxt
	txt = split.slice(lib.length+2).join(' ')
	if(this.debug){console.logg("uncomp; txt after extracted lib = ", txt)}
	var locsTxt = txt.slice(0, split[lib.length+1]) //split[lib.length+1] is the locs.length in .comp
	if(this.debug){console.logg("uncomp; locsTxt = ", locsTxt)}
	
	//locsTxt to array
	split = locsTxt.split('\'')
	var locsArr = new Array()
	for(var i in split){
		var split2 = split[i].split(' ')
		locsArr[i] = new Array()
		for(var j in split2){
			locsArr[i][j] = split2[j]
		}
	}
	if(this.debug){console.logg("locsArr base 36 and relative = ", locsArr)}
	
	//convert from base 36 back to base 10
	for (var i in locsArr) {
		for (var j in locsArr[i]) {
			locsArr[i][j] = this.base_convert(locsArr[i][j], 36, 10)
		}
	}
	if(this.debug){console.logg('locsArr base 10 and relative = ', locsArr)}
	
	//convert from relative to absolute
	for (var i in locsArr) {
		for (var j in locsArr[i]) {
			if (j == 0) {
				locsArr[i][j] = locsArr[i][j]*1
			}else{
				locsArr[i][j] = locsArr[i][j]*1+locsArr[i][j-1]
			}
		}
	}
	if(this.debug){console.logg('locsArr base 10 and absolute = ', locsArr)}

	//extract leftovers
	var leftover = txt.replace(locsTxt, '')
	if(this.debug){console.logg("uncomp; leftover = ", leftover, ' length = ', leftover.length)}


	//rebuilt... uncompress
	var rebuiltString = leftover
	for (var i = lib.length - 1; i >= 0; i--) {
		for ( j = locsArr[i].length - 1; j >= 0; j--) {
			rebuiltString = rebuiltString.slice(0, locsArr[i][j]) + lib[i] + rebuiltString.slice(locsArr[i][j])
		}
	}
	if(this.debug){console.logg("rebuiltString = ", rebuiltString)}

	
	return rebuiltString 
}

