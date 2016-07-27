//basic express server
var express = require('express');
var app = express();
var server=require('http').Server(app);
var io = require('socket.io')(server);
var port=process.env.PORT || 3000;

//database
var mysql = require('mysql');
var connection = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : 'qiangjinpei',
	port : 3306,
	database: 'mydata',
});


server.listen(port,function(){
	console.log('listening on *: %d',port);
});

//Database connection
connection.connect(function(err){
	if(err){
		console.log('Error connecting to DB');
		return;
	}	
	console.log('Database connection established');
});

//Rooting
app.use(express.static(__dirname+'/public'));

//Chatroom
io.on('connection',function(socket){

	socket.on('add user',function(username){
		socket.username = username;					
		console.log('username: '+ username);
		socket.emit('login',username);		
	});
	
	socket.on('history messages',function(username){
		connection.query('SELECT * FROM messages',function(err,rows){
			if(err) throw err;
			for(var i = 0; i<rows.length; i++){
				//console.log(rows[i]);
				var message = {
					username: rows[i].username,
					message: rows[i].message,
					time : rows[i].messagetime
				};
				socket.emit('show messages',message);
			}
		});
	});
	
	socket.on('new message',function(data){		
		var message = {
			username : socket.username,
			message : data.message,
			messagetime : data.time,			
		};
		connection.query('INSERT INTO messages SET ?', message, function(err,res){
			if(err) throw err;
			//console.log(message);
			console.log('message added succeed!');
		});		
		
		socket.broadcast.emit('new message',{
			username: socket.username,
			message: data.message,
			time: data.time
		})
	});
	
	socket.on('disconnect', function(){
		console.log(socket.username+"left!");
	})
});


