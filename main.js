var http = require("http");
var {Tray,app,Menu,dialog} = require("electron");
var nircmdPath = `"utils/nircmd.exe"`;
app.on("ready",() => {
	tray = new Tray('icon.ico');
	tray.setToolTip('Gvbvdxx Scratch 2.0 Extension')
	
	tray.setContextMenu( Menu.buildFromTemplate([
	{
		label:"Exit",
		click:function () {
			process.exit();
		}
	}
	]))
var fs = require("fs");
var waits = [];
var charstring = "abcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*()`~-_=+\"\\/[{]}<>?><,.:;'\";: ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var htmlerror = function(){};
function fixText(text) {
	var fixedtext = "";
	for (var letter of text) {
		if (charstring.indexOf(letter) > -1) {
			fixedtext += letter;
		} else {
			if (letter == "\n") {
				fixedtext += " ";
			}
		}
	}
	return fixedtext.replaceAll("\n"," ").replaceAll("\r","");
}

function addWait(wid) {
	waits.push(wid);
}
function removeWait(wid) {
	var newwaits = [];
	for (var waitid of waits) {
		if (!(waitid == wid)) {
			newwaits.push(wid);
		}
	}
	waits = newwaits;
}
var polldata = [
	[],
	["filedata",""],
	["response",""],
	["fileexists","false"],
	["dailogresponse",""]
];
function parseURLData(info) {
	return info
	.replaceAll("%2F","/")
	.replaceAll("%5C","\\")
	.replaceAll("%20"," ")
	.replaceAll("%40","@")
	.replaceAll("%23","#")
	.replaceAll("%24","$")
	.replaceAll("%25","%")
	.replaceAll("%5E","^")
	.replaceAll("%26","&")
	.replaceAll("%2F","/")
	.replaceAll("%2B","+")
	.replaceAll("%3D","/")
	.replaceAll("%60","`")
	.replaceAll("%3E",">")
	.replaceAll("%3C","<")
	.replaceAll("%2C",",")
	.replaceAll("%3F","?")
	.replaceAll("%3A",":")
	.replaceAll("%3B",";")
	.replaceAll("%22","\"")
	.replaceAll("%7B","{")
	.replaceAll("%5B","[")
	.replaceAll("%5D","]")
	.replaceAll("%7D","}");
}
function alertTerminal(){
  process.stdout.write('\x07');
}
function handleRequest(req,res,data) {
	var urlarray = req.url.split("/");
	if (req.url == "/poll") {
		var waitString = "";
		for (var waitid of waits) {
			waitString += "_busy " + waitid + "\n";
		}
		var stringdata = "";
		for (var poll of  polldata) {
			for (var pstring of poll) {
				stringdata += pstring+" ";
			}
			stringdata += "\n";
		}
		res.end(waitString+"\n"+stringdata);
		return;
	}
	if (urlarray[1] == "beep") {
		var exec = require("child_process").exec;
		exec(nircmdPath+" stdbeep",() => {})
		res.end("");
		return;
	}
	if (urlarray[1] == "pclogoff") {
		var exec = require("child_process").exec;
		exec(nircmdPath+" exitwin logoff",() => {})
		res.end("");
		return;
	}
	if (urlarray[1] == "pcpoweroff") {
		var exec = require("child_process").exec;
		exec(nircmdPath+" exitwin poweroff",() => {})
		res.end("");
		return;
	}
	if (urlarray[1] == "restartpc") {
		var exec = require("child_process").exec;
		exec(nircmdPath+" exitwin reboot",() => {})
		res.end("");
		return;
	}

	if (urlarray[1] == "displaydialouge") {
		addWait(urlarray[2]);
		res.end("");
		
		dialog.showMessageBox({
			icon:"icon.ico",
			title:parseURLData(urlarray[3]),
			message:parseURLData(urlarray[4]),
			buttons:["Ok"]
		}).then(() => {
			removeWait(urlarray[2]);
		});
		
		return;
	}
	if (urlarray[1] == "askfile") {
		addWait(urlarray[2]);
		res.end("");
		
		var response = dialog.showOpenDialogSync({properties: ['openFile']});
		if (response[0]) {
			polldata[4] = ["dailogresponse",response[0]];
		} else {
			polldata[4] = ["dailogresponse",""];
		}
		removeWait(urlarray[2]);
		
		return;
	}
	if (urlarray[1] == "checkfileexists") {
		polldata[3] = ["fileexists","false"];
		try{
			console.log(fs.existsSync(parseURLData(urlarray[2])));
			if (fs.existsSync(parseURLData(urlarray[2]))) {
				polldata[3] = ["fileexists","true"];
			}
		}catch(e){
			console.log(e);
		}
		res.end("");
		return;
	}
	if (urlarray[1] == "speaktext") {
		try{
			var exec = require("child_process").exec;
			exec(nircmdPath+" speak text \""+parseURLData(urlarray[2]).replaceAll("\"","\\\"")+"\"",() => {})
		}catch(e){}
		res.end("");
		return;
	}
	if (urlarray[1] == "movemouseto") {
		try{
		var x = Number(parseURLData(urlarray[2]));
		var y = Number(parseURLData(urlarray[3]));
		if (isNaN(x)) {
			x = 0;
		}
		if (isNaN(y)) {
			y = 0;
		}
		var exec = require("child_process").exec;
		exec(nircmdPath+" setcursor "+x+" "+y,() => {})
		}catch(e){
		}
		res.end("");
		return;
	}
	if (urlarray[1] == "createfile") {
		try{
			fs.writeFileSync(parseURLData(urlarray[2]),parseURLData(urlarray[3]),{encoding:"UTF-8"});
		}catch(e){
			
		}
		res.end("");
		return;
	}
	if (urlarray[1] == "standbymode") {
		var exec = require("child_process").exec;
		exec(nircmdPath+" standby",()=>{})
		res.end("");
		return;
	}
	if (urlarray[1] == "openscreensaver") {
		var exec = require("child_process").exec;
		exec(nircmdPath+" screensaver",()=>{})
		res.end("");
		return;
	}
	if (urlarray[1] == "setsystemvolume") {
		try{
			var vol = Number(parseURLData(urlarray[2]));
			if (isNaN(vol)) {
				vol = 50;
			}
			if (vol > 100) {
				vol = 100;
			}
			if (vol < 0) {
				vol = 0;
			}
			var volvalue = (Math.round(vol)/100)*65535;
			var exec = require("child_process").exec;
			if (Math.round(vol) == 0) {
				exec(nircmdPath+" mutesysvolume "+1+"",() => {})
			} else {
				exec(nircmdPath+" mutesysvolume "+0+"",() => {})
			}
		exec(nircmdPath+" setsysvolume "+volvalue+"",() => {})
		}catch(e){
			console.log(e);
		}
		res.end("");
		return;
	}
	if (urlarray[1] == "openthing") {
		var exec = require("child_process").exec;
		addWait(urlarray[2]);
		setInterval(() => {removeWait(urlarray[2])},700);
		exec("start \""+parseURLData(urlarray[3]).replaceAll("\"","\\\"")+"\"",() => {
			
		})
		res.end("");
		return;
	}
	if (urlarray[1] == "reset_all") {
		waits = [];
		return;
	}
	if (urlarray[1] == "readfile") {
		try{
			var filedata = fs.readFileSync(parseURLData(urlarray[2])).toString();
			polldata[1] = ["filedata",fixText(fs.readFileSync(parseURLData(urlarray[2])).toString())];
		}catch(e){
			polldata[1] = ["filedata","ERROR"];
			//console.log(e);
		}
		res.end("");
		return;
	}
	if (urlarray[1] == "httpget") {
	(async function () {
		addWait(urlarray[2]);
		htmlerror = function () {
					removeWait(urlarray[2]);
					htmlerror = null;
				}
			try{
			http.get(parseURLData(urlarray[3]),function (res) {
				var chunks = "";
				res.on("data",(chunk) => {chunks += chunk;});
				res.on("end",() => {
					polldata[2] = ["response",fixText(chunks)];
					removeWait(urlarray[2]);
				});
			});
			} catch(e) {
				polldata[2] = ["response","ERROR "+fixText(e.toString().replaceAll("\n"," "))];
				
				setTimeout(() => {
				removeWait(urlarray[2]);
				},700)
			}
		
	})();
	res.end("");
		return;
	}
	
	
	
	
	console.log(`${req.url} ${req.method} ${data}`);
	res.end("");
}
function serverDataRecived(req,res) {
	var data = ""
	if (req.method == "POST") {
		req.on("data",function (chunk) {
			data += chunk;
		});
		req.on("end",function () {
			handleRequest(req,res,data);
		});
	} else {
		handleRequest(req,res,"");
	}
}
var serv = http.createServer(serverDataRecived);
serv.listen(3500);
console.log("Server running");
process.on('uncaughtException', function (err) {
      // handle the error safely
	  
      console.log("Weird huh... I caught an error! \n"+err);
	  console.log("Dont worry alot, the program will still run.");
	  if (htmlerror) {
		  htmlerror();
	  }
    });
});