// main.js

const API_URL = "https://oem-reservation.onrender.com/api"; // Replace with your actual backend URL

const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const logoutBtn = document.getElementById("logout-btn");
const reservationGrid = document.getElementById("reservation-grid");
const loginSection = document.getElementById("login-section");
const registerSection = document.getElementById("register-section");
const mainSection = document.getElementById("main-section");

let token = localStorage.getItem("token") || null;
let currentUserRole = null;

function showSection(section) {
  loginSection.style.display = "none";
  registerSection.style.display = "none";
  mainSection.style.display = "none";
  section.style.display = "block";
}

function showLogin() {
  showSection(loginSection);
}

function showRegister() {
  showSection(registerSection);
}

function showMain() {
  showSection(mainSection);
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (res.ok) {
      token = data.token;
      localStorage.setItem("token", token);
      const payload = JSON.parse(atob(token.split(".")[1]));
      currentUserRole = payload.role;
      showMain();
      fetchReservations();
    } else {
      alert(`❌ Login failed: ${data.error || "Unknown error"}`);
    }
  } catch (err) {
    console.error(err);
    alert("❌ Network or server error during login.");
  }
});

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("register-username").value;
  const password = document.getElementById("register-password").value;
  const role = document.getElementById("register-role").value;

  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, role }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("✅ Registration successful! You can now log in.");
      registerForm.reset();
      showLogin();
    } else {
      alert(`❌ Registration failed: ${data.error || "Unknown error"}`);
    }
  } catch (err) {
    console.error(err);
    alert("❌ Network or server error during registration.");
  }
});

logoutBtn.addEventListener("click", () => {
  token = null;
  localStorage.removeItem("token");
  showLogin();
});

function createTimeSlot(slotData) {
  const slot = document.createElement("div");
  slot.classList.add("time-slot");
  if (slotData.reserved) {
    slot.classList.add("reserved");
    slot.innerText = currentUserRole === "admin" ? slotData.note || "Reserved" : "Reserved";
  } else {
    slot.innerText = "Available";
  }
  return slot;
}

async function fetchReservations() {
  try {
    const res = await fetch(`${API_URL}/reservations`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const reservations = await res.json();
    reservationGrid.innerHTML = "";
    reservations.forEach((r) => reservationGrid.appendChild(createTimeSlot(r)));
  } catch (err) {
    console.error("Failed to fetch reservations", err);
  }
}

// Initialize UI based on token
if (token) {
  const payload = JSON.parse(atob(token.split(".")[1]));
  currentUserRole = payload.role;
  showMain();
  fetchReservations();
} else {
  showLogin();
}
