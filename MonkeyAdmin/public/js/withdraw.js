const fs = require("fs");
$(document).ready(function(){
	$('#input').focus()
	$('#back').click(function(){
		self.location = 'index.html'
	})
	$('#custom,#withdraw,#clear').click(function(){
		$('#input').focus()
	})
})