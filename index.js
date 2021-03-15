const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('./passport')

// App configuration
const app = express(); 

// Mongoose configuration
const connexionOptions = {useNewUrlParser: true, useUnifiedTopology: true}
mongoose.connect('mongodb://localhost/projetcrud', connexionOptions);
mongoose.Promise = global.Promise;

// Body parse configuration
app.use(bodyParser.json());
app.use(cors({ origin : 'http://localhost:4200' }));

// Route configuration
app.use('/users', require('./routes/usersApi'))


// error handling middelwere
app.use(function(err, req, res, next){
    res.status(422).send({
        error: err.message
    });
});


// Server configuration
app.listen(process.env.port || 4000, function(){
    console.log('Serveur disponible au port numéro : 4000');
});