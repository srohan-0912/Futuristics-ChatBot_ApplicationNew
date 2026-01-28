const socket = io(window.location.origin, {
  transports: ["websocket","polling"]
});

/* 🔽 always ask for name */
let username = prompt("Enter your name");
while (!username || !username.trim()) {
  username = prompt("Enter your name");
}
username = username.trim();
localStorage.setItem("username", username);
/* 🔼 END */

document.getElementById("displayName").textContent = username;
socket.emit("new user",{ username, avatar: "" });

// Send message
function sendMessage() {
  const input = document.getElementById("messageInput");
  if (input.value.trim()) {
    socket.emit("chat message", { text: input.value });
    input.value = "";
  }
}

document.getElementById("sendBtn").onclick = sendMessage;
document.getElementById("messageInput").addEventListener("keydown", e => {
  if (e.key === "Enter") sendMessage();
});

// Receive messages
socket.on("chat message", msg => {
  const li = document.createElement("li");
  li.textContent = msg.username + ": " + msg.text;
  document.getElementById("messages").appendChild(li);
  li.scrollIntoView();
});

socket.on("system message", msg => {
  const li = document.createElement("li");
  li.className = "system";
  li.textContent = msg;
  document.getElementById("messages").appendChild(li);
});

// Online users
socket.on("user list", users => {
  const ul = document.getElementById("userList");
  ul.innerHTML = "";
  users.forEach(u => {
    const li = document.createElement("li");
    li.textContent = u.username;
    ul.appendChild(li);
  });
});

// Emoji insert + send
document.querySelectorAll(".emoji").forEach(e => {
  e.onclick = () => {
    document.getElementById("messageInput").value += e.textContent;
  };
  e.ondblclick = () => {
    socket.emit("chat message", { text: e.textContent });
  };
});

// Theme toggle
const themeToggle = document.getElementById("themeToggle");
themeToggle.onclick = () => {
  document.body.classList.toggle("light-theme");
  themeToggle.textContent =
    document.body.classList.contains("light-theme") ? "☀️" : "🌙";
};

// Edit name
function editName() {
  const newName = prompt("Enter new name", username);
  if (newName && newName.trim()) {
    username = newName.trim();
    localStorage.setItem("username", username);
    document.getElementById("displayName").textContent = username;
    socket.emit("edit name", { username, avatar: "" });
  }
}
