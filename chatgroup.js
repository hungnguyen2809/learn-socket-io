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
	console.log("Room: ", socket.rooms);
	console.log("Room ALL: ", io.sockets.adapter.rooms);

	socket.on("create-room", (nameRoom) => {
		// join dùng để join vào một room nào đó với tham số là tên room, nếu room tồn tại
		// thì nó join vào còn nếu chưa tồn tại thì tạo room mới và đưa socket.id vào room đó.
		// 1 socket.id có thể join nhiều hơn 1 room => 1 socket.id vào được room A, room B, ...
		socket.join(nameRoom);
		console.log("Room: ", socket.rooms);
		console.log("Room ALL: ", io.sockets.adapter.rooms);
	});

	socket.on("leave-room", (nameRoom) => {
		// rời bỏ một room, khi trong tự động xóa khi không có socket.id nào ở trong
		socket.leave(nameRoom);
	});
});

app.get("/", (req, res) => {
	return res.render("chatgroup");
});
