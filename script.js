// ============================================
// SCRIPT.JS - Save/Load & GitHub Publishing
// ============================================

// Compression helper
function compress(data) {
  return LZString.compress(JSON.stringify(data));
}

function decompress(data) {
  try {
    return JSON.parse(LZString.decompress(data));
  } catch (e) {
    console.error('Decompression failed:', e);
    return null;
  }
}

// IndexedDB setup
let db;
const request = indexedDB.open("PortfolioDB", 1);

request.onupgradeneeded = (event) => {
  db = event.target.result;
  if (!db.objectStoreNames.contains("portfolio")) {
    db.createObjectStore("portfolio", { keyPath: "id" });
  }
};

request.onsuccess = (event) => {
  db = event.target.result;
  loadContent();
  console.log('✅ Database ready');
};

request.onerror = (event) => {
  console.error('❌ Database error:', event.target.error);
};

// Save content to IndexedDB
function saveContent() {
  if (!db) {
    alert("❌ Database not ready");
    return;
  }

  try {
    const tx = db.transaction("portfolio", "readwrite");
    const store = tx.objectStore("portfolio");
    
    const data = {
      id: "main",
      homeTitle: document.getElementById("home-title")?.innerText || "",
      homeSubtitle: document.getElementById("home-subtitle")?.innerText || "",
      education: document.getElementById("education-container")?.innerHTML || "",
      experience: document.getElementById("experience-container")?.innerHTML || "",
      skills: document.getElementById("skills-container")?.innerHTML || "",
      projects: document.getElementById("projects-container")?.innerHTML || "",
      blogs: document.getElementById("blogs-container")?.innerHTML || "",
      contact: Array.from(document.querySelectorAll('.contact-value, .contact-link-input')).map(el => ({
        value: el.innerText || el.value || '',
        type: el.className
      })),
      profileImg: document.getElementById("profile-img")?.src || ""
    };
    
    store.put({ id: "main", content: compress(data) });
    
    tx.oncomplete = () => {
      alert("✅ Portfolio saved locally!");
      console.log('✅ Content saved');
    };
    
    tx.onerror = () => {
      alert("❌ Failed to save");
      console.error('❌ Save failed');
    };
  } catch (error) {
    console.error('Save error:', error);
    alert("❌ Error saving portfolio");
  }
}

// Load content from IndexedDB
function loadContent() {
  if (!db) return;

  try {
    const tx = db.transaction("portfolio", "readonly");
    const store = tx.objectStore("portfolio");
    const request = store.get("main");
    
    request.onsuccess = (e) => {
      const record = e.target.result;
      if (record && record.content) {
        const data = decompress(record.content);
        if (!data) return;
        
        // Restore content
        if (data.homeTitle) document.getElementById("home-title").innerText = data.homeTitle;
        if (data.homeSubtitle) document.getElementById("home-subtitle").innerText = data.homeSubtitle;
        if (data.education) document.getElementById("education-container").innerHTML = data.education;
        if (data.experience) document.getElementById("experience-container").innerHTML = data.experience;
        if (data.skills) document.getElementById("skills-container").innerHTML = data.skills;
        if (data.projects) document.getElementById("projects-container").innerHTML = data.projects;
        if (data.blogs) document.getElementById("blogs-container").innerHTML = data.blogs;
        if (data.profileImg) document.getElementById("profile-img").src = data.profileImg;
        
        // Restore contact info
        if (data.contact) {
          const contactElements = document.querySelectorAll('.contact-value, .contact-link-input');
          data.contact.forEach((item, index) => {
            if (contactElements[index]) {
              if (contactElements[index].tagName === 'INPUT') {
                contactElements[index].value = item.value;
              } else {
                contactElements[index].innerText = item.value;
              }
            }
          });
        }
        
        console.log('✅ Content loaded');
        
        // Re-attach event handlers after loading
        if (window.reattachHandlers) {
          window.reattachHandlers();
        }
      }
    };
    
    request.onerror = () => {
      console.error('❌ Failed to load content');
    };
  } catch (error) {
    console.error('Load error:', error);
  }
}

// Save button
const saveBtn = document.getElementById("save-btn");
if (saveBtn) {
  saveBtn.addEventListener("click", saveContent);
}

// Publish to GitHub
const publishBtn = document.getElementById("publish-btn");
if (publishBtn) {
  publishBtn.addEventListener("click", async () => {
    const token = prompt("⚠️ Enter your GitHub Personal Access Token:\n\n(Create one at: github.com/settings/tokens)");
    
    if (!token || token.trim() === '') {
      alert("❌ GitHub token is required");
      return;
    }
    
    const repo = "Mamata_Yadav.github.io";
    const username = "Mamatayadav1";
    const apiUrl = `https://api.github.com/repos/${username}/${repo}/contents/index.html`;
    
    try {
      publishBtn.disabled = true;
      publishBtn.innerHTML = '<span class="btn-icon">⏳</span><span>Publishing...</span>';
      
      // Get current file SHA
      const response = await fetch(apiUrl, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }
      
      const fileData = await response.json();
      const sha = fileData.sha;
      
      // Get full HTML
      const html = document.documentElement.outerHTML;
      const encoded = btoa(unescape(encodeURIComponent(html)));
      
      // Commit updated file
      const commitResponse = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify({
          message: `Updated portfolio - ${new Date().toLocaleString()}`,
          content: encoded,
          sha: sha,
        }),
      });
      
      if (commitResponse.ok) {
        alert("🚀 Portfolio published successfully!\n\nView at: https://" + username.toLowerCase() + ".github.io");
        console.log('✅ Published to GitHub');
      } else {
        const errorData = await commitResponse.json();
        throw new Error(errorData.message || 'Publishing failed');
      }
    } catch (error) {
      console.error('Publish error:', error);
      alert("❌ Failed to publish:\n\n" + error.message + "\n\nPlease check:\n- Your token has 'repo' permissions\n- Repository name is correct\n- You have write access");
    } finally {
      publishBtn.disabled = false;
      publishBtn.innerHTML = '<span class="btn-icon">🚀</span><span>Publish to GitHub</span>';
    }
  });
}

// Auto-save every 2 minutes
setInterval(() => {
  if (db) {
    saveContent();
    console.log('🔄 Auto-saved');
  }
}, 120000);

console.log('✅ Script loaded successfully!');
