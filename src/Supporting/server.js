const express = require('express');
const request = require('request');

const app = express();

app.get('/image', (req, res) => {
  const imageUrl = 'https://drive.google.com/uc?id=1jbAZMWi1sMhhaoHZk-Oz8lbCgTDCoYGd';
  request.get(imageUrl).pipe(res);
});

app.listen(3001, () => {
  console.log('Server listening on port 3001');
});