const socket = io("http://localhost:8888/");

let listMessages = [];

socket.on("server-send-register-fail", () => {
	alert("Tài khoản đã có người sử dụng");
});

socket.on("server-send-register-success", (data) => {
	alert("Đăng ký thành công");
	$("#txtUsername").val("");
	$(".login-form").hide(2000);
	$(".chat-form").show(1000);

	$("#currentUser").html(data);
});

socket.on("server-send-all-users", (data) => {
	const listUsers = JSON.parse(data);
	const htmlListUsers = listUsers.map((user) => {
		return `<p class="menber-online">${user}</p>`;
	});
	$("#listUsers").html(""); //Xóa trắng hết trước khi thêm
	$("#listUsers").html(htmlListUsers);
});

socket.on("server-send-logout-success", () => {
	$(".login-form").show();
	$(".chat-form").hide();
});

socket.on("server-send-message", (data) => {
	const mes = JSON.parse(data);
	listMessages.push(mes);

	const messagesHTML = listMessages.map((item) => {
		return `<p class="line-message">
    <span class="current-user-name">${item.username}: </span>
    <span>${item.message}</span>
    </p>`;
	});

	$("#listMessages").html("");
	$("#listMessages").html(messagesHTML);
});

$(document).ready(() => {
	$(".login-form").show();
	$(".chat-form").hide();

	$("#btnLogin").click(() => {
		let username = $("#txtUsername").val();
		if (username.length === 0) return;

		socket.emit("client-send-username", username);
	});

	$("#btnLogout").click(() => {
		if (confirm("Are you sure you want to logout ?")) {
			socket.emit("client-send-logout");
		}
	});

	$("#btnSend").click(() => {
		let mes = $("#txtMessage").val();
		if (mes.length === 0) return;

		socket.emit("user-send-message", mes);
		$("#txtMessage").val("");
	});

	$("#txtMessage").focusin(() => {
		socket.emit("user-typing-message");
	});

	$("#txtMessage").focusout(() => {
		socket.emit("user-stop-typing-message");
	});
});
