const express = require("express");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", "./views");

const server = require("http").createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

server.listen(8888, () => {
	console.log("Server is runing port 8888");
});

io.on("connection", (socket) => {
	console.log("Co nguoi ket noi: ", socket.id);

	//Hiển thị số lượng room đang có, mỗi một connect đến sẽ tạo ra 1 room mới
	//lấy tên theo id của socket đó
	// console.log("Room: ", socket.rooms);
	// console.log("Room ALL: ", io.sockets.adapter.rooms);

	// socket.on("create-room", (nameRoom) => {
	// 	// join dùng để join vào một room nào đó với tham số là tên room, nếu room tồn tại
	// 	// thì nó join vào còn nếu chưa tồn tại thì tạo room mới và đưa socket.id vào room đó.
	// 	// 1 socket.id có thể join nhiều hơn 1 room => 1 socket.id vào được room A, room B, ...
	// 	socket.join(nameRoom);
	// 	console.log("Room: ", socket.rooms);
	// 	console.log("Room ALL: ", io.sockets.adapter.rooms);
	// });

	// socket.on("leave-room", (nameRoom) => {
	// 	// rời bỏ một room, khi trong tự động xóa khi không có socket.id nào ở trong
	// 	socket.leave(nameRoom);
	// });

	// ----------------
	socket.on("create-room", (nameRoom) => {
		socket.join(nameRoom);
		socket.currentRoom = nameRoom;

		const listRooms = Array.from(io.sockets.adapter.rooms.keys());
		io.sockets.emit("server-send-rooms", JSON.stringify(listRooms));
		socket.emit("server-send-current-room", socket.currentRoom);
	});

	socket.on("user-send-message-chat", (data) => {
		// Gửi lại cho toàn bộ tất cả những người nào có trong room, với tên room trong in
		// socket.currentRoom => trả ra room hiện tại đang đứng khi tạo
		io.sockets.in(socket.currentRoom).emit("server-send-mes-room", data);
	});
});

app.get("/", (req, res) => {
	return res.render("chatgroup");
});
