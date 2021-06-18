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

io.on("connection", (client) => {
	console.log("Co nguoi ket noi: ", client.id);

	client.on("handle-change-color", (data) => {
		io.sockets.emit("serve-send-color", data);
		// client.broadcast.emit("serve-send-color", data);
	});
});

app.get("/", (req, res) => {
	return res.render("baitap1");
});
