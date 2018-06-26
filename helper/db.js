const mongoose = require('mongoose');

module.exports = () => {
    //mongoose.connect('mongodb://movie_user:abcd1234@ds139436.mlab.com:39436/movie-api');
    mongoose.connect('mongodb://localhost/myfirstdb');
    
    mongoose.connection.on('open',()=>{
        console.log('MongoDB Connected...');
    });

    mongoose.connection.on('error',(error)=>{
        console.log('MongoDB '+error);
    });
};