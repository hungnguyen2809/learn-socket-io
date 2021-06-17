const express = require("express");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", "./views");

const server = require("http").createServer(app);
// const io = require("socket.io")(server, { cors: { origin: "*" } });
const io = new Server(server, { cors: { origin: "*" } });

server.listen(8888, () => {
	console.log("Server is runing port 8888");
});

io.on("connection", (client) => {
	console.log("Co nguoi ket noi: ", client.id);

	client.on("disconnect", () => {
		console.log(client.id + " da ngat ket noi");
	});

	client.on("client-send-data", (data) => {
		console.log(`Client ${client.id} send: `, data);

		//server trả về full cho toàn bộ client connect đến server.
		// io.sockets.emit(
		// 	"server-send-data",
		// 	`Hello Client, Data your send: ${data}`
		// );

		//server trả về cho duy nhất cho client nào gửi lên
		// client.emit("server-send-data", `Server send: ${data}`);

		//server trả về cho toàn bộ client connect đến trừ client gửi lên
		// client.broadcast.emit("server-send-data", `Server send: ${data}`);

		//Chỉ muốn gửi trả về cho một client nhất định
		// io.to(“id socket”).emit : dùng để emit riêng đến một client nào đó (1-1).
	});
});

app.get("/", (req, res) => {
	return res.render("home");
});
