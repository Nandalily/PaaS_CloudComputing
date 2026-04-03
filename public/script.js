const BASE_URL = ""; // same domain

async function signup() {
  const name = document.getElementById("signupName").value;
  const password = document.getElementById("signupPassword").value;

  const res = await fetch(BASE_URL + "/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, password }),
  });

  const data = await res.json();
  alert("Signup successful!");
}

async function login() {
  const name = document.getElementById("loginName").value;
  const password = document.getElementById("loginPassword").value;

  const res = await fetch(BASE_URL + "/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, password }),
  });

  const data = await res.json();

  if (data.token) {
    localStorage.setItem("token", data.token);
    window.location.href = "/dashboard.html";
  } else {
    alert("Login failed");
  }
}
