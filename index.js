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

io.on("connection", (socket) => {
	console.log("Co nguoi ket noi: ", socket.id);

	socket.on("disconnect", () => {
		console.log(socket.id + " ngat ket noi");
	});
});

app.get("/", (req, res) => {
	return res.render("home");
});
