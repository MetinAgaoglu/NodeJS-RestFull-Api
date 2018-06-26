const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
    director_id: Schema.ObjectId,
    title: {
        type:String,
        required: [true,'Başlık girilmesi zorunludur.'],
        maxlength: [15,'alanı 15 ten büyük olamaz'],
        minlength: [1,'çok küçük veri girdiniz']
    },
    category: String,
    country: String,
    year: Number,
    imdb_score: Number,
    created_at: {
        type:Date,
        default: Date.now
    }
});

module.exports = mongoose.model('moview',MovieSchema);