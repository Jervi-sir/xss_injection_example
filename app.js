const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

const dbPath = './db/sample.db';

app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

router.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/views/index.html'));
});


router.get('/createdb', function(req, res) {
  let db = new sqlite3.Database(dbPath);
  //db.run('CREATE TABLE comments(name text, comment text, is_infected bool)');
  //db.run("INSERT INTO comments (name, comment, is_infected) VALUES ('jervi', '<script>alert(1)</script>', true)");
  db.close();
  res.send('db created!');
});

router.get('/showdb', function(req, res) {
  let db = new sqlite3.Database(dbPath);
  let comments = "SELECT * from 'comments'";
  let response = [];

  db.all(comments, [], (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      let tempRow = {
        "name": row.name,
        "comment": row.comment,
        "is_infected": row.is_infected,
      };
      response.push(tempRow);
    });
    
    db.close();
    console.log(response);
    res.render('index', {
      title: 'Homepage',
      comments: response
    });

    
  });
});

//add the router
app.use('/', router);
app.listen(process.env.port || 3000);

console.log('Running at Port 3000');
