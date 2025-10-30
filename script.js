// Compression helper
function compress(data) {
  return LZString.compress(JSON.stringify(data));
}
function decompress(data) {
  return JSON.parse(LZString.decompress(data));
}

// IndexedDB setup
let db;
const request = indexedDB.open("PortfolioDB", 1);
request.onupgradeneeded = (event) => {
  db = event.target.result;
  db.createObjectStore("portfolio", { keyPath: "id" });
};
request.onsuccess = (event) => {
  db = event.target.result;
  loadContent();
};

// Save content to IndexedDB
function saveContent() {
  const tx = db.transaction("portfolio", "readwrite");
  const store = tx.objectStore("portfolio");
  const data = {
    id: "main",
    homeTitle: document.getElementById("home-title").innerText,
    homeSubtitle: document.getElementById("home-subtitle").innerText,
    edu: document.getElementById("edu-text").innerText,
    exp: document.getElementById("exp-text").innerText,
    skills: document.getElementById("skills-list").innerHTML,
    projects: document.getElementById("projects-container").innerHTML,
    blogs: document.getElementById("blogs-container").innerHTML,
    profileImg: localStorage.getItem("profileImg"),
  };
  store.put({ id: "main", content: compress(data) });
  alert("✅ Saved locally!");
}

// Load content
function loadContent() {
  const tx = db.transaction("portfolio", "readonly");
  const store = tx.objectStore("portfolio");
  const request = store.get("main");
  request.onsuccess = (e) => {
    const record = e.target.result;
    if (record) {
      const data = decompress(record.content);
      document.getElementById("home-title").innerText = data.homeTitle;
      document.getElementById("home-subtitle").innerText = data.homeSubtitle;
      document.getElementById("edu-text").innerText = data.edu;
      document.getElementById("exp-text").innerText = data.exp;
      document.getElementById("skills-list").innerHTML = data.skills;
      document.getElementById("projects-container").innerHTML = data.projects;
      document.getElementById("blogs-container").innerHTML = data.blogs;
      if (data.profileImg) document.getElementById("profile-img").src = data.profileImg;
    }
  };
}

// Handle image upload
document.getElementById("profile-upload").addEventListener("change", function (e) {
  const reader = new FileReader();
  reader.onload = function (event) {
    const imgData = event.target.result;
    document.getElementById("profile-img").src = imgData;
    localStorage.setItem("profileImg", imgData);
  };
  reader.readAsDataURL(e.target.files[0]);
});

// Save button
document.getElementById("save-btn").addEventListener("click", saveContent);

// Publish to GitHub
document.getElementById("publish-btn").addEventListener("click", async () => {
  const token = prompt("Enter your GitHub token (safe use only):");
  if (!token) return alert("❌ Token missing");

  const repo = "Mamata_Yadav.github.io";
  const username = "mamatayadav1";
  const apiUrl = `https://api.github.com/repos/${username}/${repo}/contents/index.html`;

  const response = await fetch(apiUrl, { headers: { Authorization: `token ${token}` } });
  const fileData = await response.json();
  const sha = fileData.sha;

  const html = document.documentElement.outerHTML;
  const encoded = btoa(unescape(encodeURIComponent(html)));

  const commit = await fetch(apiUrl, {
    method: "PUT",
    headers: {
      Authorization: `token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "Updated portfolio via web editor",
      content: encoded,
      sha: sha,
    }),
  });

  if (commit.ok) alert("🚀 Published successfully!");
  else alert("⚠️ Failed to publish");
});
