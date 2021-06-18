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

let listUsers = [];

io.on("connection", (client) => {
	console.log("Co nguoi ket noi: ", client.id);

	client.on("client-send-username", (data) => {
		if (listUsers.indexOf(data) !== -1) {
			//Tài khoản đã có => fail
			client.emit("server-send-register-fail", "");
		} else {
			// Tài khoản khả dụng => success
			listUsers.push(data);
			// thêm mới key userName để lưu lại (cho phép thêm mới bất kỳ)
			client.userName = data;
			//Thông báo thành công
			client.emit("server-send-register-success", data);
			// Gửi lại toàn bộ danh sách user
			io.sockets.emit("server-send-all-users", JSON.stringify(listUsers));
		}
	});

	client.on("client-send-logout", () => {
		let indexUser = listUsers.findIndex((user) => user === client.userName);
		if (indexUser !== -1) {
			listUsers.splice(indexUser, 1);
		}
		client.emit("server-send-logout-success");
		client.broadcast.emit("server-send-all-users", JSON.stringify(listUsers));
	});

	client.on("user-send-message", (data) => {
		const mes = {
			username: client.userName,
			message: data,
		};
		io.sockets.emit("server-send-message", JSON.stringify(mes));
	});

	client.on("user-typing-message", () => {
		client.broadcast.emit("server-send-typing", client.userName);
	});

	client.on("user-stop-typing-message", () => {
		client.broadcast.emit("server-send-stop-typing", client.userName);
	});
});

app.get("/", (req, res) => {
	return res.render("chat");
});
