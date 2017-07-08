const fs = require("fs");
var iniData = 'Date,Check In,Check Out,Increment,Decrement,Balance,\n0,0,0,0,0,0,\n'
var subject = ['Math','Physics']
var allconfig = {studentfilelocation:'C:\\Users\\Admin\\Desktop\\MonkeyCheckout\\studentData\\',
				statusfilelocation:'C:\\Users\\Admin\\Desktop\\MonkeyCheckout\\status\\',
				under2500filelocation:'C:\\Users\\Admin\\Desktop\\MonkeyCheckout\\under2500\\',
				timer:2000}
$(document).ready(function(){
	startup()
	$('#studentinput').focus()
	$('#warn').hide()
	$('#loading').hide()
	var id
	$('#studentinput[type=text]').on('keydown', function(e) {
		if (e.which == 13) {
			e.preventDefault();
			$('#btn').show()
			$('#total').hide()
			$('#loading').hide()
			id = $('#studentinput').val()
	    	$('#idstu').html('ID : '+$('#studentinput').val())
	    	$("#myModal").modal()
	    	$('#studentinput').val('')
	    	$('#studentinput').focus()
	    }
	});
	$('#studentpath').change(function(){
		$('#studentfilelocation').val(document.getElementById("studentpath").files[0].path+'\\')
	})
	$('#under2500path').change(function(){
		$('#under2500filelocation').val(document.getElementById("under2500path").files[0].path+'\\')
	})
	$('#statuspath').change(function(){
		$('#statusfilelocation').val(document.getElementById("statuspath").files[0].path+'\\')
	})
	$('#cr').click(function(){
		checkout(id,0)
	})
	$('#fhb').click(function(){
		checkout(id,800)		
	})
	$('#configbtn').click(function(){
		$('#config').modal()
	})
	$('#submit').click(function(){
		for(i in allconfig){
			allconfig[i] = $('#'+i).val()
		}
		fs.writeFileSync('config.json',JSON.stringify(allconfig));
		console.log('success')
	})
	$(window).click(function(){
		if(!($('#myModal').hasClass('in')) && !($('#config').hasClass('in'))){
			$('#studentinput').focus()
		}
	})
})
function checkout(barcode,fee){
	$('#loading').show()
	$('#btn').hide()
	$.post("https://www.monkey-monkey.com/post/studentProfile", {studentID : barcode.slice(0,barcode.length-1)}).then(function(data){
		if(data.err) {
			alert('ไม่สามารถ Checkout ได้ กรุณาติดต่อ Admin')
			$('#myModal').modal('hide') 
			$('#warn').hide()
			$('#studentinput').focus()
			throw data.err
		}
		return data
	}).then((studentProfile) => {
		var now = new Date()
		fs.readFile(allconfig.studentfilelocation+barcode+'.csv', function (err, data) {
			if (err) {
				var appendData = now.getDate()+'/'+now.getMonth()+'/'+now.getFullYear()+',No Check In,'+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds()+',,'+fee+','+(-1*fee)+',\n'
				iniData+=appendData
				fs.writeFileSync(allconfig.studentfilelocation+barcode+'.csv',iniData);
				var balance = 0
			}
			else{
			 	var temp = data.toString().split('\n')
			 	temp = temp[temp.length-2].split(',')
			 	var balance = temp[5]
				var appendData = now.getDate()+'/'+now.getMonth()+'/'+now.getFullYear()+',No Check In,'+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds()+',,'+fee+','+(parseInt(balance)-fee)+',\n'
			
			 	fs.appendFile(allconfig.studentfilelocation+barcode+'.csv', appendData , (err) => {
					if (err) throw err;
					console.log('The "data to append" was appended to file!');
				});
			}
			var thissubject = subject[parseInt(barcode.slice(barcode.length-1))-1]
			if(fee == 800){
				var crType = 'FHB'
			}
			else if(fee == 0){
				var crType = 'CR'
			}
			else{
				var crType = '-'
			}
			var status = barcode.slice(0,barcode.length-1)+','+studentProfile.firstname+'('+studentProfile.nickname+'),'+thissubject+','+now.getDate()+'/'+now.getMonth()+'/'+now.getFullYear()+','+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds()+',,'+crType+','+(parseInt(balance)-fee)+',\n'
			fs.appendFile(allconfig.statusfilelocation+'status.csv', status , (err) => {
				if (err) throw err;
				console.log('The "data to append" was appended to file!');
			});
			if (parseInt(balance)-fee <= 2500) {
				fs.appendFile(allconfig.under2500filelocation+'under2500.csv', status , (err) => {
					if (err) throw err;
					console.log('The "data to append" was appended to file!');
				});
			}
			$('#name').html(studentProfile.firstname+'('+studentProfile.nickname+')')
			$('#remain').html((parseInt(balance)-fee)+' บาท')
			$('#loading').hide()
			$('#total').show()
			console.log('get here')
			if(parseInt(balance)-fee <= 2500){
				$('#warn').show()
				console.log('do show')
			}
			setTimeout(function(){$('#myModal').modal('hide') 
				$('#warn').hide()},parseInt(allconfig.timer)
			)
			$('#studentinput').focus()
		});
	})
}

function startup(){
	fs.readFile('config.json','utf8',function (err, data) {
		if(err){
			alert("can't find config.json")
		}
		else{
			var config = JSON.parse(data.toString());
			for( i in allconfig ){
				allconfig[i] = config[i]
				$('#'+i).val(config[i])
			}
		}
	})
}