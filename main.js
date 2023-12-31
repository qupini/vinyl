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
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/vinyl.html');
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


app.post('/tracks', async (req, res) => {
    try {
      // Предполагается, что req.body является массивом треков
      for (const track of req.body) {
        const { vinyl_id, track_title } = track;
  
        if (!vinyl_id || !track_title) {
          return res.status(400).send('Vinyl ID and track title are required');
        }
  
        // Вставляем трек в таблицу `tracks`
        const insertTrackText = 'INSERT INTO tracks (track_title) VALUES ($1) RETURNING track_id';
        const newTrack = await pool.query(insertTrackText, [track_title]);
  
        // Получаем ID только что добавленного трека
        const track_id = newTrack.rows[0].track_id;
  
        // Связываем трек с пластинкой в таблице `vinyls2tracks`
        const insertVinyl2TracksText = 'INSERT INTO vinyls2tracks (vinyl_id, track_id) VALUES ($1, $2)';
        await pool.query(insertVinyl2TracksText, [vinyl_id, track_id]);
      }
  
      res.json({ message: 'Tracks added successfully' }); 
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
  
  // Добавляем новый маршрут для деталей пластинки
app.get('/vinyl/:vinylId', async (req, res) => {
  try {
    const vinylId = req.params.vinylId;

    // Получаем информацию о пластинке
    const vinylQuery = 'SELECT * FROM vinyls WHERE vinyl_id = $1';
    const vinylResult = await pool.query(vinylQuery, [vinylId]);

    if (vinylResult.rows.length === 0) {
      return res.status(404).send("Vinyl not found");
    }
    const vinyl = vinylResult.rows[0];

    // Получаем список треков для пластинки
    const tracksQuery = 'SELECT tracks.track_title FROM tracks JOIN vinyls2tracks ON tracks.track_id = vinyls2tracks.track_id WHERE vinyls2tracks.vinyl_id = $1';
    const tracksResult = await pool.query(tracksQuery, [vinylId]);
    const tracks = tracksResult.rows;

    // Отправляем данные обратно клиенту
    res.render('vinyl_details', { vinyl: vinyl, tracks: tracks });

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});