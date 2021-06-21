const socket = io("http://localhost:8888/");

socket.on("server-send-rooms", (rooms) => {
	const listRooms = JSON.parse(rooms);
	const roomsHTML = listRooms.map((room) => {
		return `<p class="line-room"> - ${room}</p>`;
	});
	$(".list-name-room").html("");
	$(".list-name-room").html(roomsHTML);
});

socket.on("server-send-current-room", (room) => {
	$("#currentRoom").html(room);
});

$(document).ready(() => {
	$("#btnCreateRoom").click(() => {
		let nameRoom = $("#txtRoom").val();
		if (nameRoom.length === 0) return;
		socket.emit("create-room", nameRoom);
	});
});
