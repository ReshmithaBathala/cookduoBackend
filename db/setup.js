const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./db/recipes.db");

db.serialize(() => {
  // Create recipes table with an additional image_url column
  db.run(`CREATE TABLE IF NOT EXISTS recipes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        ingredients TEXT NOT NULL,
        instructions TEXT NOT NULL,
        author TEXT NOT NULL,
        rating INTEGER DEFAULT 0,
        image_url TEXT
    )`);

  // Insert sample recipes with image URLs
  const insert = db.prepare(
    `INSERT INTO recipes (title, category, ingredients, instructions, author, image_url) VALUES (?, ?, ?, ?, ?, ?)`
  );
  insert.run(
    "Spaghetti Carbonara",
    "Main Course",
    "Spaghetti, Eggs, Parmesan, Pancetta, Black Pepper",
    "Cook spaghetti, mix with eggs and cheese, add pancetta.",
    "Chef John",
    "https://www.cuisine-et-mets.com/wp-content/uploads/2017/07/Fotolia_133606277_Subscription_Monthly_XXL.jpg"
  );
  insert.run(
    "Caesar Salad",
    "Appetizers",
    "Romaine Lettuce, Croutons, Parmesan, Caesar Dressing",
    "Mix ingredients and serve cold.",
    "Chef Jane",
    "https://www.thespruceeats.com/thmb/Z6IWF7c9zywuU9maSIimGLbHoI4=/3000x2000/filters:fill(auto,1)/classic-caesar-salad-recipe-996054-Hero_01-33c94cc8b8e841ee8f2a815816a0af95.jpg"
  );
  insert.run(
    "Mojito",
    "Beverages",
    "Mint, Lime, Sugar, Rum, Soda Water",
    "Mix mint and lime, add sugar and rum, top with soda.",
    "Bartender Sam",
    "https://saborgourmet.com/wp-content/uploads/mojito-cubano.jpg"
  );
  insert.run(
    "Dosa",
    "Main Course",
    "2 cups rice, 1/2 cup urad dhal, 1/2 tsp fenugreek seeds, Filtered water, 1 tsp salt",
    "Soak, grind, ferment, and cook.",
    "Sharavani",
    "https://ranveerbrar.com/wp-content/uploads/2021/02/Masala-dosa-scaled.jpg"
  );
  insert.finalize();
});

db.close();
