let posts = [];
let users = [];
let currentUser = null;

document.addEventListener("DOMContentLoaded", async function() {
    await fetchData();
    loadNav();
    loadHome();
});

async function fetchData() {
    try {
        const usersResponse = await fetch('https://mockend.com/api/Suzanne_blog/users/posts');
        const postsResponse = await fetch('https://mockend.com/api/Suzanne_blog/posts/posts');

        users = await usersResponse.json();
        posts = await postsResponse.json();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function loadNav() {
    const navLinks = document.getElementById('nav-links');
    navLinks.innerHTML = `
        <li class="nav-item"><a class="nav-link" href="#" onclick="loadHome()">Home</a></li>
        ${currentUser ? `
        <li class="nav-item"><a class="nav-link" href="#" onclick="createPost()">Create Post</a></li>
        <li class="nav-item"><a class="nav-link" href="#" onclick="logout()">Logout</a></li>
        ` : `
        <li class="nav-item"><a class="nav-link" href="#" onclick="loadLogin()">Login</a></li>
        <li class="nav-item"><a class="nav-link" href="#" onclick="loadSignup()">Signup</a></li>
        `}
    `;
}

function loadHome() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `<h1>Latest Posts</h1>`;
    posts.forEach(post => {
        mainContent.innerHTML += `
            <div class="row ">
                <div class="card mb-3 ">
                    <div class="card-body">
                        <h2 class="card-title">${post.title}</h2>
                        ${post.image ? `<img src="${post.image}" class="img-fluid mb-3" alt="Post Image">` : ''}
                        <p class="card-text">${post.content}</p>
                        <button class="btn btn-primary" onclick="viewPost(${post.id})">Read More</button>
                        ${currentUser && currentUser.username === post.author ? `
                        <button class="btn btn-warning" onclick="editPost(${post.id})">Edit</button>
                        <button class="btn btn-danger" onclick="deletePost(${post.id})">Delete</button>
                        ` : ''}
                    </div>
                <div class="card-footer text-muted">
                    Posted by ${post.author}
                </div>
            </div>
            </div>
        `;
    });
}


function viewPost(postId) {
    const post = posts.find(p => p.id === postId);
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <h1>${post.title}</h1>
        <p>${post.content}</p>
        <p><strong>Author:</strong> ${post.author}</p>
        <button class="btn btn-secondary" onclick="loadHome()">Back</button>
    `;
}

function createPost() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <h1>Create Post</h1>
        <form onsubmit="savePost(event)">
            <div class="mb-3">
                <label for="title" class="form-label">Title</label>
                <input type="text" class="form-control" id="title" required>
            </div>
            <div class="mb-3">
                <label for="content" class="form-label">Content</label>
                <textarea class="form-control" id="content" rows="5" required></textarea>
            </div>
            <div class="mb-3">
                <label for="image" class="form-label">Upload Image</label>
                <input type="file" class="form-control" id="image" accept="image/*">
            </div>
            <button type="submit" class="btn btn-primary">Save</button>
        </form>
    `;
}

function savePost(event) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const imageInput = document.getElementById('image');
    
    if (imageInput.files && imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageDataUrl = e.target.result;
            const newPost = {
                id: posts.length + 1,
                title: title,
                content: content,
                image: imageDataUrl,
                author: currentUser.username
            };
            posts.push(newPost);
            loadHome();
        };
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        const newPost = {
            id: posts.length + 1,
            title: title,
            content: content,
            author: currentUser.username
        };
        posts.push(newPost);
        loadHome();
    }
}


function editPost(postId) {
    const post = posts.find(p => p.id === postId);
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <h1>Edit Post</h1>
        <form onsubmit="updatePost(event, ${postId})">
            <div class="mb-3">
                <label for="title" class="form-label">Title</label>
                <input type="text" class="form-control" id="title" value="${post.title}" required>
            </div>
            <div class="mb-3">
                <label for="content" class="form-label">Content</label>
                <textarea class="form-control" id="content" rows="5" required>${post.content}</textarea>
            </div>
            <div class="mb-3">
                <label for="image" class="form-label">Upload New Image</label>
                <input type="file" class="form-control" id="image" accept="image/*">
                ${post.image ? `<img src="${post.image}" class="img-fluid mt-3" alt="Post Image">` : ''}
            </div>
            <button type="submit" class="btn btn-primary">Update</button>
        </form>
    `;
}

function updatePost(event, postId) {
    event.preventDefault();
    const post = posts.find(p => p.id === postId);
    post.title = document.getElementById('title').value;
    post.content = document.getElementById('content').value;

    const imageInput = document.getElementById('image');
    if (imageInput.files && imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            post.image = e.target.result;
            loadHome();
        };
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        loadHome();
    }
}


function deletePost(postId) {
    posts = posts.filter(p => p.id !== postId);
    loadHome();
}

function loadLogin() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <h1>Login</h1>
        <form onsubmit="login(event)">
            <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input type="text" class="form-control" id="username" required>
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" required>
            </div>
            <button type="submit" class="btn btn-primary">Login</button>
        </form>
    `;
}

function login(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        currentUser = user;
        loadNav();
        loadHome();
    } else {
        alert('Invalid login credentials');
    }
}

function loadSignup() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <h1>Signup</h1>
        <form onsubmit="signup(event)">
            <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input type="text" class="form-control" id="username" required>
            </div>
                        <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" required>
            </div>
            <button type="submit" class="btn btn-primary">Signup</button>
        </form>
    `;
}

function signup(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
        alert('Username already exists');
    } else {
        const newUser = {
            id: users.length + 1,
            username: username,
            password: password,
            isAdmin: false
        };
        users.push(newUser);
        alert('Signup successful! Please log in.');
        loadLogin();
    }
}

function logout() {
    currentUser = null;
    loadNav();
    loadHome();
}


function saveToLocalStorage() {
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('posts', JSON.stringify(posts));
}


function savePost(event) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const imageInput = document.getElementById('image');

    if (imageInput.files && imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageDataUrl = e.target.result;
            const newPost = {
                id: posts.length + 1,
                title: title,
                content: content,
                image: imageDataUrl,
                author: currentUser.username
            };
            posts.push(newPost);
            saveToLocalStorage();  // Save the data to localStorage
            loadHome();
        };
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        const newPost = {
            id: posts.length + 1,
            title: title,
            content: content,
            author: currentUser.username
        };
        posts.push(newPost);
        saveToLocalStorage();  // Save the data to localStorage
        loadHome();
    }
}

function loadFromLocalStorage() {
    const storedUsers = localStorage.getItem('users');
    const storedPosts = localStorage.getItem('posts');
    if (storedUsers) users = JSON.parse(storedUsers);
    if (storedPosts) posts = JSON.parse(storedPosts);
}

// Call this function at the start of your app
loadFromLocalStorage();

function downloadDataAsJSON() {
    const data = {
        users: users,
        posts: posts
    };
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "blog_data.json";
    a.click();
    URL.revokeObjectURL(url);
}


// Call loadFromLocalStorage when the app starts
loadFromLocalStorage();

