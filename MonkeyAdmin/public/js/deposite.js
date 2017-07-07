$(document).ready(function(){
	$('#input').focus()
	$('#back').click(function(){
		self.location = 'index.html'
	})
	$('#custom,#deposite,#clear').click(function(){
		$('#input').focus()
	})
})