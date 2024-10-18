const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database("./db/recipes.db");

// Route to get all recipes
app.get("/", (req, res) => {
  db.all("SELECT * FROM recipes", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Route to get a specific recipe by ID
app.get("/recipes/:id", (req, res) => {
  const id = req.params.id;
  db.get("SELECT * FROM recipes WHERE id = ?", [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(row);
  });
});

app.get("/search", (req, res) => {
  const query = req.query.query; // Get the search term from query parameters
  if (!query) {
    return res.status(400).json({ error: "Search term is required" });
  }

  //search
  db.all(
    "SELECT * FROM recipes WHERE title LIKE ?",
    [`%${query}%`],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
});

// Route to add a new recipe
app.post("/recipes", (req, res) => {
  const { title, category, ingredients, instructions, author, image_url } =
    req.body;
  db.run(
    `INSERT INTO recipes (title, category, ingredients, instructions, author, image_url) VALUES (?, ?, ?, ?, ?, ?)`,
    [title, category, ingredients, instructions, author, image_url],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID });
    }
  );
});

// Route to update a recipe by ID
app.put("/recipes/:id", (req, res) => {
  const {
    title,
    category,
    ingredients,
    instructions,
    author,
    rating,
    image_url,
  } = req.body;
  const id = req.params.id;
  db.run(
    `UPDATE recipes SET title = ?, category = ?, ingredients = ?, instructions = ?, author = ?, rating = ?, image_url = ? WHERE id = ?`,
    [title, category, ingredients, instructions, author, rating, image_url, id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ changes: this.changes });
    }
  );
});

// Route to delete a recipe by ID
app.delete("/recipes/:id", (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM recipes WHERE id = ?", [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Recipe deleted" });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
