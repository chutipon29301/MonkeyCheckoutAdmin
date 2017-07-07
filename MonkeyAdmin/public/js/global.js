const fs = require("fs");

//in future will read allconfig from config file
var allconfig = {
	studentfilelocation:''
}

//id and val can be string or int and withdraw by minus sign before val
function editbalance(barcode,val){
	fs.readFile(allconfig.studentfilelocation+barcode+'.csv', function (err, data) {
}