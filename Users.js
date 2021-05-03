const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

    range: {
        by: {
            id: {
                type: Number,
                required: true
            },
            name: {
                type: String,
                required: true
            }
        }
    }
})

module.exports = mongoose.model('User', userSchema)