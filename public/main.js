$(function(){
	
	var username;
	var connected = false;
	var socket=io();
	
	$(".submitUsername").click(function(){
		
		username = $(".usernameInput").val();
		$(".loginPage").hide();
		$(".chatPage").show();
		
		socket.emit('add user',username);
		socket.emit('history messages',username);
	});
	
	$(".submitMessage").click(function(){
		
		var message = $(".inputMessage").val();
		var date = new Date();
		var time = date.toLocaleString();
		if(message && connected){
			$(".inputMessage").val('');
			addChatMessage({
				username: "me",
				message: message,
				time: time
			});
			socket.emit("new message", {
				message : message,
				time : time
			});
		}
		
	});
	
	function addChatMessage(data){
		var $usernameDiv = $('<span class = "username"/>')
		  .text(data.username);
		var $messageTimeDiv = $('<span class = "messageTime">')
		  .text(data.time);
		var $messageBodyDiv = $('<span class = "messageBody">')
		  .text(data.message);
		var $messageDiv = $('<li class = "message"/>')
		  .data('username',data.username)
		  .append($usernameDiv,$messageTimeDiv,$messageBodyDiv);
		
		$(".messages").append($messageDiv);
	}
	
	
	socket.on('login',function(data){
		connected = true;
		var message = "Welcome to 18652 chat room, "+data+" !";
		$(".messages").append($('<li class="welcome">').text(message));
	});
	
	socket.on('show messages',function(data){
		addChatMessage(data);
	});
	
	socket.on('new message', function(data){
		addChatMessage(data);
	});
	
	
	
});