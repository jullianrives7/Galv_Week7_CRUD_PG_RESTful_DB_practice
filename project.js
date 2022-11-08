const express = require("express");
const app = express();
const PORT = 3000;
const { Client } = require("pg");
app.use(express.json());

const connectionString =
  "postgresql://postgres:docker@127.0.0.1:5432/crud_practice_db";
const client = new Client({
  connectionString: connectionString,
});
client.connect();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/drums", (req, res) => {
  client
    .query("SELECT * FROM drums")
    .then((result) => {
      console.log(result.rows[0]);
      res.send(result.rows);
    })
    .catch((e) => console.error(e.stack));
});

app.get("/drums:id", (req, res) => {
  client
    .query(`SELECT * FROM drums WHERE id = ${req.params.id}`)
    .then((result) => {
      if (result.rows.length > 0) {
        res.send(result.rows);
      } else {
        res.status(404).sendStatus(404);
      }
    })
    .catch((e) => console.error(e.stack));
});

app.post("/drums/", (req, res) => {
  client
    .query(
      `INSERT INTO drums (manufacturer, model, finish, msrp) VALUES ('${req.body.manufacturer}', '${req.body.model}', '${req.body.finish}', ${req.body.msrp})`
    )
    .then((result) => {
      console.log("Added new drumset to table.");
      res.send(req.body);
    })
    .catch((e) => console.error(e.stack));
});

app.patch("/drums/:id", (req, res) => {
  client
    .query(
      `UPDATE drums SET msrp = ${req.body.msrp} WHERE id = ${req.params.id}`
    )
    .then((result) => {
      console.log(
        `Updated msrp for drumset at row id:${req.params.id} to ${req.body.msrp}.`
      );
      res.send(req.body);
    })
    .catch((e) => console.error(e.stack));
});

app.delete("/drums/:id", (req, res) => {
  client
    .query(`DELETE FROM drums WHERE id = '${req.params.id}'`)
    .then((result) => {
      console.log(`Deleted row where id=${req.params.id}.`);
      res.send("Row successfully removed.");
    })
    .catch((e) => console.error(e.stack));
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
