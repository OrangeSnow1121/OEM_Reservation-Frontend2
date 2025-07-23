
const backendURL = 'https://oem-reservation.onrender.com/api/auth';

document.getElementById("registerForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  const username = document.getElementById("regUsername").value;
  const password = document.getElementById("regPassword").value;
  const role = document.getElementById("role").value;

  const res = await fetch(backendURL + "/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, role })
  });

  const data = await res.json();
  document.getElementById("response").innerText = data.message || data.error;
});

document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch(backendURL + "/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  document.getElementById("response").innerText = data.token ? "Login successful!" : data.error;
});
