import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "http://localhost:4000";

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());





// Route to render the main page
app.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/posts`);
    res.render("index.ejs", { posts: response.data });
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts" });
  }
});





//Route to get a specific post
app.get("/findPost", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/findPost`, {params: {id: req.query.id}});
    if (response.data) {
      res.render("index.ejs", { posts: [response.data] });
    } else {
      res.send('<h1 align="center">The post with that id was not found </h1>')
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching post" });
  }
})






// Route to render the create new page
app.get("/new", (req, res) => {
  res.render("modify.ejs", { heading: "New Post", submit: "Create Post" });
});



// Route to render the edit page
app.get("/edit/:id", async (req, res) => {
  try {
    const response = await axios.patch(`${API_URL}/posts/${req.params.id}`);
    
    res.render("modify.ejs", {
      heading: "Edit Post",
      submit: "Update Post" ,
      post: response.data,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching post" });
  }
});







// Create a new post
app.post("/api/posts", async (req, res) => {
  try {
    const response = await axios.post(`${API_URL}/posts`, req.body);
    console.log(response.data);
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error creating post" });
  }
});




app.post("/api/posts/:id", async (req, res) => {
  
  try {
    const response = await axios.patch(`${API_URL}/posts/${req.params.id}`, req.body);
    console.log(response);
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error updating post" });
  }
})





// Delete a post
app.get("/api/posts/delete/:id", async (req, res) => {
  try {
    await axios.delete(`${API_URL}/posts/${req.params.id}`);
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error deleting post" });
  }
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
