$(document).ready(function(){
	$('#deposite').click(function(){
		self.location = 'deposite.html'
	})
	$('#withdraw').click(function(){
		self.location = 'withdraw.html'
	})
	$('#absent').click(function(){
		self.location = 'absent.html'
	})
	$('#recheck').click(function(){
		self.location = 'recheck.html'
	})
	$('#configbtn').click(function(){
		$('#config').modal()
	})
})
