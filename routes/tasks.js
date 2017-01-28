var express = require("express");
var router = express.Router();

var pg = require("pg");

var config = { database: "toDoList" };

// initialize connection Pool
var pool = new pg.Pool(config);

router.get("/", function(req, res) {

  pool.connect(function(err, client, done) {
    if (err) {
      console.log("Error connecting to DB", err);
      res.sendStatus(500);
      done();
    } else {

      client.query("SELECT * FROM tasks;", function(err, result) {
        done();
        if (err) {
          console.log("Error querying DB", err);
          res.sendStatus(500);
        } else {
          console.log("Got info from DB", result.rows);
          res.send(result.rows);
        }
      });
    }
  });
});

router.post("/", function(req, res) {

  pool.connect(function(err, client, done) {
    if (err) {
      console.log("Error connecting to DB", err);
      res.sendStatus(500);
      done();
    } else {

      client.query(
        "INSERT INTO tasks (task, created_on) VALUES ($1, $2) RETURNING *;",
        [ req.body.task, req.body.created_on],
        function(err, result) {
          done();
          if (err) {
            console.log("Error querying DB", err);
            res.sendStatus(500);
          } else {
            console.log("Got info into DB", result.rows);
            res.send(result.rows);
          }
        }
      );
    }
  });
});

router.put('/:id', function(req, res){
    pool.connect(function(err, client, done){
      if(err){
        console.log('Error connecting to DB', err);
        res.sendStatus(500);
        done();
      }else{
        var completed_on = req.body.completed_on;
        if(completed_on == 'Not Yet Completed'){
          completed_on = null;
        }
        client.query('UPDATE tasks SET task=$2, created_on=$3, completed_on=$4 WHERE id=$1 RETURNING *',
        [req.params.id, req.body.task, req.body.created_on, completed_on],
          function(err, result){
            done();
            if(err){
              console.log('Error updating book', err);
              res.sendStatus(500);
            }else{
              res.send(result.rows);
            }
          });
      }
    });
  });

router.delete('/:id', function(req, res){
  pool.connect(function(err, client, done){
    if(err){
      console.log('Error connecting to DB', err);
      res.sendStatus(500);
      done();
    }else{
      client.query('DELETE FROM tasks WHERE id = $1', [req.params.id],
        function(err, result){
          done();
          if(err){
            console.log('Error deleting book', err);
            res.sendStatus(500);
          }else{
            res.sendStatus(204);
          }
        });
    }
  });
});

module.exports = router;
