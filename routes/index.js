var express = require('express');
var router = express.Router();
var axios = require('axios');
var session = require('express-session')
const mysql = require('mysql')

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: null,
  database: 'konkursas'
})

router.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

var sess = {
  loggedIn: false,
  UserId: null
}


const { response } = require('../app');

const route = '/api/image/generate'
const tokenStr = `7cf704db5e0e4c9bad9857d7e02142ad`
const body = {};

/* GET home page. */


router.get('/login', function(req, res) {
try {
  const query = `SELECT * FROM vartotojai`;

connection.query(query, (err, vartotojai,) => {
  console.log('data', vartotojai,)
})

  
  res.render('login')
  } catch(error) {
console.log(error)
  }
});




router.post('/api/v1/login', async (req, res) => {
  password = req.body.password;
  names = req.body.name;
  console.log(names, password, sess)
 const query = `SELECT Id FROM vartotojai WHERE name="${names}" AND password="${password}"`

connection.query(query, (err, vartotojai) => {
  console.log('data', vartotojai)
  if (vartotojai.length == 1) {
    sess = {
      loggedIn: true,
      UserId: Number(vartotojai[0].Id)
    }
    res.redirect('/')
  } else {
    res.status(401).send("incorrect data")
  }
  return;
})


});

router.get('/',async (req, res) => {

  if ( sess.loggedIn == false) {
    res.redirect('login')
  }
  console.log(sess.loggedIn)

    res.render('index')
    console.log(sess)
 
});

router.post('/api/v1/list',async (req, res) => {
  submit = req.body.submit

  try {
    const request = await axios.post('http://172.16.50.58:5000/api/image/generate',  {
    'prompt': submit
    }, {
      headers: {
        'Authorization': 'Bearer 7cf704db5e0e4c9bad9857d7e02142ad'
      }
    }
  ).then(function (response) {
    console.log("data", response.data.job_id)
    id =  response.data.job_id;
    setTimeout(check, 2000)
  }).catch(function (error) {
    console.log(error);
  });
  
  async function check() {
  
  const requestImage = await axios.get(`http://172.16.50.58:5000/api/image/status/${id}`, {
    headers: {
      'Authorization': 'Bearer 7cf704db5e0e4c9bad9857d7e02142ad'
    }
  }).then(function (response) {
    console.log("data", response)
    if(response.data.job_running == true) {
      setTimeout(check, 2000)
    } else {
      const photo = response.data.job_download_url;
      console.log("photos", response.data.job_download_url)
      res.render('display', {id: id, photo: photo})
    }
  }).catch(function (error) {
    console.log(error);
  });
  }
  }
  
  catch (error) {
    console.error('Error fetching data ', error);
    res.status(500).json({
        error: 'Failed to fetch data'
    });
  }
  })

  router.get('/api/v1/:logo-id',async (req, res) => {

    const urlId = req.params.logo-id

    if ( sess.loggedIn == false) {
      res.redirect('login')
    }
    console.log(sess.loggedIn)
  
    res.render('display', {id: id, photo: photo[urlId]})
      console.log(sess)
   
  });


router.post('/api/v1/:logo/add', async (req, res) => {
  const url = req.body.url;
  

  const query = `INSERT INTO favorites(url, User_id) VALUES ('${url}','${Number(sess.UserId)}')`

console.log('success', url, sess.UserId, query)

  connection.query(query, (err, vartotojai) => {
    if (err) throw err
    console.log('data', vartotojai)
    res.status(200).send("sekmingai prideta")
    return;
  })

})



module.exports = router;