// create pool to connect to Postgres database
const pg = require('pg');

const pool = new pg.Pool({
    user: 'dpwmynjx',
    host: 'mahmud.db.elephantsql.com',
    database: 'dpwmynjx',
    password: 'iUUNlJpIwUmwkfJMwsH6g8oCajiOyOHx',
    port: 5432, // default PostgreSQL port
});
pool.connect((err, client, release) =>
{
    if (err)
    {
        console.error('Error acquiring client', err.stack);
        return;
    }
    console.log('Connected to PostgreSQL database!');
    release(); // release the client back to the pool
});

const getLinks = (req, res) =>
{
    pool.query('SELECT * FROM favlinks ORDER BY id ASC'
        , (error, result) =>
        {
            if (error)
            {
                throw error
            }
            res.status(200).json(result.rows)
        })
}
const postLinks = (req, res) =>
{
    const { name, url } = req.body;
    pool.query('INSERT INTO favlinks (name, url) VALUES ($1, $2)', [name, url], (err, result) =>
    {
        if (err)
        {
            console.error(err);
            res.status(500).send('Error creating link');
        } else
        {
            res.status(201).send('Link created successfully');
        }
    });
}
const deleteLinks = (req, res) =>
{
    const id = req.params.id;
    console.log(id);
    pool.query('DELETE FROM favlinks WHERE id=$1', [id], (err, result) =>
    {
        if (err)
        {
            console.error(err);
            res.status(500).send('Error deleting link');
        } else if (result.rowCount === 0)
        {
            res.status(404).send('Link not found');
        } else
        {
            res.status(200).send('Link deleted successfully');
        }
    });
}
const updateLinks = (req, res) =>
{
    const id = req.params.id;
    const { name, url } = req.body;
    db.pool.query('UPDATE favlinks SET name=$1, url=$2 WHERE id=$3', [name, url, id], (err, result) =>
    {
        if (err)
        {
            console.error(err);
            res.status(500).send('Error updating link');
        } else if (result.rowCount === 0)
        {
            res.status(404).send('Link not found');
        } else
        {
            res.status(200).send('Link updated successfully');
        }
    });
}
const getLink = (req, res) =>
{
    const id = req.params.id;
    pool.query('SELECT * FROM favlinks WHERE id=$1', [id], (err, result) =>
    {
        if (err)
        {
            console.error(err);
            res.status(500).send('Error retrieving link from database');
        } else if (result.rows.length === 0)
        {
            res.status(404).send('Link not found');
        } else
        {
            res.status(200).json(result.rows[0]);
        }
    });
}

module.exports = {
    getLinks,
    pool,
    postLinks, getLink, updateLinks, deleteLinks

}