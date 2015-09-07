var debug = false
if (debug == true) {
	console.logg = console.log
} else {
	console.logg = function donothing() {
	}
}