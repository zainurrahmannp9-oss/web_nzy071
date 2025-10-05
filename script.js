let editingPostId = null;

document.addEventListener("DOMContentLoaded", () => {
  loadPosts();
  loadProfile();
});

function showSection(id) {
  document.querySelectorAll("section").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function toggleMode() {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
  document.querySelector(".mode-btn").textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
}
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark-mode");
  document.querySelector(".mode-btn").textContent = "☀️";
}

document.getElementById("postForm").addEventListener("submit", e => {
  e.preventDefault();
  const title = document.getElementById("postTitle").value;
  const content = document.getElementById("postContent").value;
  const imageInput = document.getElementById("postImage");
  if (imageInput.files.length > 0) {
    const reader = new FileReader();
    reader.onload = ev => savePost(title, content, ev.target.result);
    reader.readAsDataURL(imageInput.files[0]);
  } else {
    savePost(title, content, "");
  }
});

function savePost(title, content, imageUrl) {
  let posts = JSON.parse(localStorage.getItem("posts")) || [];
  if (editingPostId) {
    posts = posts.map(p => p.id === editingPostId ? {...p, title, content, imageUrl: imageUrl || p.imageUrl, date:new Date().toLocaleString()} : p);
    editingPostId = null;
  } else {
    const newPost = {id: Date.now(), title, content, imageUrl, date:new Date().toLocaleString()};
    posts.push(newPost);
  }
  localStorage.setItem("posts", JSON.stringify(posts));
  loadPosts();
  document.getElementById("postForm").reset();
  document.getElementById("editPostFormSection").style.display="none";
}

function loadPosts() {
  const container = document.getElementById("postsContainer");
  container.innerHTML = "";
  const posts = JSON.parse(localStorage.getItem("posts")) || [];
  posts.forEach(post => {
    const card = document.createElement("div");
    card.className = "post-card";
    card.innerHTML = `
      <h3>${post.title}</h3>
      ${post.imageUrl ? `<img src="${post.imageUrl}"/>` : ""}
      <p>${post.content}</p>
      <p><small>${post.date}</small></p>
      <div class="watermark">My Blog</div>
      <button onclick="sharePost(${post.id})">🔗 Share</button>
      <button onclick="startEdit(${post.id})">✏️ Edit</button>
    `;
    container.appendChild(card);
  });
}

function sharePost(id) {
  const url = window.location.origin + window.location.pathname + "?post=" + id;
  navigator.clipboard.writeText(url);
  alert("Link postingan disalin: " + url);
}

function startEdit(id) {
  const posts = JSON.parse(localStorage.getItem("posts")) || [];
  const post = posts.find(p => p.id === id);
  if (post) {
    editingPostId = id;
    document.getElementById("editPostFormSection").style.display="block";
    document.getElementById("editPostTitle").value = post.title;
    document.getElementById("editPostContent").value = post.content;
  }
}

document.getElementById("editPostForm").addEventListener("submit", e => {
  e.preventDefault();
  const title = document.getElementById("editPostTitle").value;
  const content = document.getElementById("editPostContent").value;
  const imageInput = document.getElementById("editPostImage");
  if (imageInput.files.length > 0) {
    const reader = new FileReader();
    reader.onload = ev => savePost(title, content, ev.target.result);
    reader.readAsDataURL(imageInput.files[0]);
  } else {
    savePost(title, content, null);
  }
});

function cancelEdit() {
  editingPostId = null;
  document.getElementById("editPostFormSection").style.display="none";
}

function editProfile() {
  document.getElementById("editProfileForm").style.display="flex";
}

document.getElementById("editProfileForm").addEventListener("submit", e => {
  e.preventDefault();
  const profile = {
    name: document.getElementById("editName").value,
    class: document.getElementById("editClass").value,
    prodi: document.getElementById("editProdi").value,
    nim: document.getElementById("editNIM").value,
    email: document.getElementById("editEmail").value,
  };
  localStorage.setItem("profile", JSON.stringify(profile));
  loadProfile();
  document.getElementById("editProfileForm").reset();
  document.getElementById("editProfileForm").style.display="none";
});

function loadProfile() {
  const profile = JSON.parse(localStorage.getItem("profile"));
  if (profile) {
    document.getElementById("profileName").textContent = profile.name;
    document.getElementById("profileClass").textContent = profile.class;
    document.getElementById("profileProdi").textContent = profile.prodi;
    document.getElementById("profileNIM").textContent = profile.nim;
    document.getElementById("profileEmail").textContent = profile.email;
  }
}