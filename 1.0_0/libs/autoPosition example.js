//*****should really set all twoway to false*********//
//set to true here is just for testing for bugs

var mode = 'followsWhenCollapsed'//staysAway, staysPut, followsWhenCollapsed

//div1
$('#div1').autoPosition({
	my : 'top',
	at : 'top',
	of : '#main',
	twoway : false
})
$('#div1').draggable()
$('#div1').on('drag', function(evt, ui) {
	//trigger custom evt
	$('#div1').trigger('moved.autoPosition')
})
//div2
$('#div2').autoPosition({
	my : 'top',
	at : 'bottom',
	of : '#div1',
	twoway : true
})
$('#div2').draggable()
$('#div2').on('drag', function(evt, ui) {
	//trigger custom evt
	$('#div2').trigger('moved.autoPosition')
})
//div3
$('#div3').autoPosition({
	my : 'top',
	at : 'bottom',
	of : '#div2',
	twoway : true	//div3 will move div2 if true
})
$('#div3').draggable()
$('#div3').on('drag', function(evt, ui) {
	//trigger custom evt
	$('#div3').trigger('moved.autoPosition')
})
//div3left
$('#div3left').autoPosition({
	my : 'left',
	at : 'left',
	of : '#div3',
	twoway : false, //div3left will move div3 if true
	oppositeEdgeBehavior : mode
})

$('#div3left').autoPosition({
	my : 'right',
	at : 'left',
	of : '#div3splitter',
	twoway : true//,
	//oppositeEdgeBehavior : mode
})

$('#div3left').draggable()
$('#div3left').on('drag', function(evt, ui) {
	//trigger custom evt
	$('#div3left').trigger('moved.autoPosition')
})
//div3splitter
$('#div3splitter').draggable()
$("#div3splitter").draggable("option", "axis", "y")//sets axis
$("#div3splitter").draggable("option", "opacity", 0.35)//does not work if clone
$("#div3splitter").draggable("option", "helper", "clone")//

$('#div3splitter').on('drag', function(evt, ui) {
	//constrainted movement

	var minLeft = 50
	var maxLeft = $(window).width() + 5000//- 100
	if (ui.offset.left < minLeft) {
		$('#div3splitter').offset({
			left : minLeft
		})
	} else if (ui.offset.left > maxLeft) {
		$('#div3splitter').offset({
			left : maxLeft
		})
	} else {
		$('#div3splitter').offset({
			left : ui.offset.left
		})
	}
	//trigger custom evt
	$('#div3splitter').trigger('moved.autoPosition')
})
//div3right
$('#div3right').autoPosition({
	my : 'right',
	at : 'right',
	of : '#div3',
	twoway : true,
	oppositeEdgeBehavior : mode
})
$('#div3right').autoPosition({
	my : 'left',
	at : 'right',
	of : '#div3splitter',
	twoway : true,
	oppositeEdgeBehavior : mode
})

//div4
$('#div4').autoPosition({
	my : 'top',
	at : 'bottom',
	of : '#div3',
	twoway : true
})
$('#div4').draggable()
$('#div4').on('drag', function(evt, ui) {
	//trigger custom evt
	$('#div4').trigger('moved.autoPosition')
})
//div5
$('#div5').autoPosition({
	my : 'top',
	at : 'bottom',
	of : '#div4',
	twoway : false
})
$('#div5').draggable()
$('#div5').on('drag', function(evt, ui) {
	//trigger custom evt
	$('#div5').trigger('moved.autoPosition')
})