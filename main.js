// server.js
const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'vinyl',
  password: '1324',
  port: 5432,
});

app.use(express.json());
app.use(express.static('public')); // Предоставить статические файлы из папки public

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/vinyls', async (req, res) => {
  try {
    const vinyls = await pool.query('SELECT * FROM vinyls');
    res.json(vinyls.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.post('/vinyls', async (req, res) => {
  try {
    const {
      vinyl_title,
      vinyl_releaseyear,
      vinyl_catalog_num,
      vinyl_rpm,
      vinyl_manufacturer,
      vinyl_comments,
      vinyl_type
    } = req.body;

    const newVinyl = await pool.query(
      'INSERT INTO vinyls (vinyl_title, vinyl_releaseyear, vinyl_catalog_num, vinyl_rpm, vinyl_manufacturer, vinyl_comments, vinyl_type) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [
        vinyl_title,
        vinyl_releaseyear || null,
        vinyl_catalog_num || null,
        vinyl_rpm || null,
        vinyl_manufacturer || null,
        vinyl_comments || null,
        vinyl_type || null
      ]
    );

    res.json(newVinyl.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});