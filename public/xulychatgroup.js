const socket = io("http://localhost:8888/");

$(document).ready(() => {
	$("#btnCreate").click(() => {
		let nameRoom = $("#txtRoom").val();
		socket.emit("create-room", nameRoom);
	});
});
