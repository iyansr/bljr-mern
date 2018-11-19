const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();

//body-parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//Connect to local mongoose
mongoose
.connect('mongodb://localhost:27017/devcon', {useNewUrlParser:true})
.then(()=> console.log('Mongodb Local Connected'))
.catch(err => console.log(err));


//connect to mlab mongoose
// DB Config
// const db = require('./config/keys.js').mongoURI;
// mongoose
//     .connect(db, {useNewUrlParser: true})
//     .then(()=> console.log('Mongod MLAB Connected'))
//     .catch(err => console.log(err));


app.get('/',(req,res)=>{
    res.send('Hello Kappa');
});



//Use Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
