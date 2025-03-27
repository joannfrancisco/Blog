const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Middleware
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Function to read blog data from JSON file
function readPosts() {
    const data = fs.readFileSync("posts.json", "utf-8");
    return JSON.parse(data);
}

// Function to write blog data to JSON file
function writePosts(posts) {
    fs.writeFileSync("posts.json", JSON.stringify(posts, null, 2), "utf-8");
}

// Home Route - Show all blogs
app.get("/", (req, res) => {
    const posts = readPosts();
    res.render("index", { posts });
});

// Show form to create a new blog post
app.get("/new", (req, res) => {
    res.render("new");
});

// Create new blog post
app.post("/blogs", (req, res) => {
    const posts = readPosts();
    const newPost = {
        id: Date.now(),
        title: req.body.title,
        content: req.body.content
    };
    posts.push(newPost);
    writePosts(posts);
    res.redirect("/");
});

// Show a single blog post
app.get("/blogs/:id", (req, res) => {
    const posts = readPosts();
    const post = posts.find(p => p.id == req.params.id);
    if (!post) return res.send("Post not found.");
    res.render("show", { post });
});

// Show edit form
app.get("/blogs/:id/edit", (req, res) => {
    const posts = readPosts();
    const post = posts.find(p => p.id == req.params.id);
    if (!post) return res.send("Post not found.");
    res.render("edit", { post });
});

// Update blog post
app.post("/blogs/:id/update", (req, res) => {
    const posts = readPosts();
    const postIndex = posts.findIndex(p => p.id == req.params.id);
    if (postIndex === -1) return res.send("Post not found.");

    posts[postIndex].title = req.body.title;
    posts[postIndex].content = req.body.content;
    writePosts(posts);

    res.redirect("/");
});

// Delete blog post
app.post("/blogs/:id/delete", (req, res) => {
    let posts = readPosts();
    posts = posts.filter(p => p.id != req.params.id);
    writePosts(posts);
    res.redirect("/");
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
