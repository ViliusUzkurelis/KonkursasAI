var express = require('express');
var router = express.Router();
var axios = require('axios')

const route = '/api/image/generate'
const tokenStr = `7cf704db5e0e4c9bad9857d7e02142ad`
const body = {};

/* GET home page. */
router.get('/',async (req, res) => {
try {
  const request = await axios.post('http://172.16.50.58:5000/api/image/generate',  {
  'prompt': "it company"
  }, {
    headers: {
      'Authorization': 'Bearer 7cf704db5e0e4c9bad9857d7e02142ad'
    }
  }
) .then(function (response) {
  console.log(response);
  console.log("data", response.data.job_id)
  id =  response.data.job_id
}).catch(function (error) {
  console.log(error);
});
const requestImage = await axios.get(`http://172.16.50.58:5000/api/image/status/${id}`, {
  headers: {
    'Authorization': 'Bearer 7cf704db5e0e4c9bad9857d7e02142ad'
  }
})

res.render('index', {id: id})}

catch (error) {
  console.error('Error fetching data ', error);
  res.status(500).json({
      error: 'Failed to fetch weather data'
  });
}
})

module.exports = router;