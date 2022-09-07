const express = require('express');

const app = express();
const urlRoute = require('./src/routes/url');

const connection = require('./src/configs/db');
connection.once('open', () => console.log('DB Connected'));
connection.on('error', () => console.log('Error'));

app.use(
	express.json({
		extended: false,
	})
);
app.use(express.static('public'));
app.use(urlRoute);
app.get('/', function(req, res) {
    res.sendFile('./public/index.html', { root : __dirname})
});


const dotenv = require('dotenv');
dotenv.config();


const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server is running at Port ${PORT} `);
});
