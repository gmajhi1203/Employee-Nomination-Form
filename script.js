const scriptURL = "https://script.google.com/macros/s/AKfycbxuTJYFh2820do8roWhyHKqzGU90vmJxtc2mq-2boU7PHAiabEw8pocxNqHDkoUvhYN/exec";

let userData = {};

function login() {
  const id = document.getElementById("employee-id").value.trim();
  if (!id) return showMessage("Please enter your Employee ID.");
  fetch(scriptURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "validateEmployee", id })
  })
  .then(r => r.json())
  .then(data => {
    if (!data.name) return showMessage("Invalid Employee ID.");
    userData = { id, ...data };
    document.getElementById("employee-name").textContent = data.name;
    document.getElementById("employee-department").textContent = data.department;
    toggleSections("confirm");
  });
}

function confirmDetails() {
  fetch(scriptURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "getNominees",
      department: userData.department,
      userName: userData.name
    })
  })
    .then(r => r.json())
    .then(nominees => {
      const sel = document.getElementById("nominee");
      sel.innerHTML = `<option value="">-- Select --</option>`;
      nominees.forEach(n => {
        sel.add(new Option(n, n));
      });
      toggleSections("nominate");
    });
}

function submitNomination() {
  const nominee = document.getElementById("nominee").value;
  if (!nominee) return showMessage("Please pick a nominee.");
  fetch(scriptURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "submitNomination",
      nominatorId: userData.id,
      nomineeName: nominee
    })
  })
    .then(r => r.json())
    .then(res => {
      showMessage(res.success
        ? "✅ Nomination submitted!"
        : `⚠️ ${res.message}`);
      if (res.success) toggleSections("done");
    });
}

function toggleSections(step) {
  document.getElementById("login-section").classList.toggle("hidden", step !== "login");
  document.getElementById("confirm-section").classList.toggle("hidden", step !== "confirm");
  document.getElementById("nominate-section").classList.toggle("hidden", step !== "nominate");
}

function showMessage(msg) {
  document.getElementById("message").textContent = msg;
}
