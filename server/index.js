const path = require("path");
const express = require("express");
const app = express();
const cors = require('cors');
const db = require("./db")
app.use(
  express.static(
    path.join(__dirname, "../Full-Stack-React/favlinks-main", "build")
  )
);
app.use(express.static("public"));
app.use(cors());

app.get('/', (req, res) =>
{
  res.sendFile(
    path.join(
      __dirname,
      "../Full-Stack-React/favlinks-main",
      "build",
      "index.html"
    )
  );
})
app.use(express.json())

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }))



db.pool.query(`
  SELECT EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_name = 'favlinks'
  )
`, (err, res) =>
{
  if (err)
  {
    console.error('Failed to check if table exists:', err);
    return;
  }

  const tableExists = res.rows[0].exists;
  if (!tableExists)
  {
    db.pool.query(`
      CREATE TABLE favlinks (
        id SERIAL PRIMARY KEY,
        url VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL
      )
    `, (err, res) =>
    {
      if (err)
      {
        console.error('Failed to create table:', err);
        return;
      }

      console.log('Table created successfully!');
    });
  } else
  {
    console.log('Table already exists!');
  }
});



// GET: /favlinks
app.get('/api/links', db.getLinks);

// POST: /links
app.post('/api/links', db.postLinks);

// DELETE: /links/:id
app.post('/api/links/:id', db.deleteLinks);


// PUT: /links/:id
app.post('/api/links/:id', db.updateLinks);


// GET: /links/:id
app.get('/api/links/:id', db.getLink);

const port = 3000
app.listen(port, () =>
{
  console.log(`App running on port ${port}.`)
});
