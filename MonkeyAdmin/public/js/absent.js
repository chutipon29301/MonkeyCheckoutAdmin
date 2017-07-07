const fs = require("fs");
$(document).ready(function(){
	$('#input').focus()
	$('#back').click(function(){
		self.location = 'index.html'
	})
	$('#cr,#fhb').click(function(){
		$('#input').focus()
	})
})