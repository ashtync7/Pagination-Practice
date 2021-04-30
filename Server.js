const express = require("express");
const mongoose = require("mongoose")
const User = require("./Users")
const app = express()

mongoose.connect('mongodb://localhost/pagination', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.once('open', async () => {
    if (await User.countDocuments().exec() > 0) return

    Promise.all([
        User.create({ name: 'User 1' }),
        User.create({ name: 'User 2' }),
        User.create({ name: 'User 3' }),
        User.create({ name: 'User 4' }),
        User.create({ name: 'User 5' }),
        User.create({ name: 'User 6' }),
        User.create({ name: 'User 7' }),
        User.create({ name: 'User 8' }),
        User.create({ name: 'User 9' }),
        User.create({ name: 'User 10' })
    ]).then(() => console.log('Added Users'))
})

const users = [
    { id: 1, name: 'User 1' },
    { id: 2, name: 'User 2' },
    { id: 3, name: 'User 3' },
    { id: 4, name: 'User 4' },
    { id: 5, name: 'User 5' },
    { id: 6, name: 'User 6' },
    { id: 7, name: 'User 7' },
    { id: 8, name: 'User 8' },
    { id: 9, name: 'User 9' },
    { id: 10, name: 'User 10' }
]

const posts = [
    { id: 1, name: 'Post 1' },
    { id: 2, name: 'Post 2' },
    { id: 3, name: 'Post 3' },
    { id: 4, name: 'Post 4' },
    { id: 5, name: 'Post 5' },
    { id: 6, name: 'Post 6' },
    { id: 7, name: 'Post 7' },
    { id: 8, name: 'Post 8' },
    { id: 9, name: 'Post 9' },
    { id: 10, name: 'Post 10' }
]

app.get('/posts', paginatedResults(posts), (req, res) => {

})

app.get('/users', paginatedResults(User), (req, res) => {
    // const page = parseInt(req.query.page)
    // const limit = parseInt(req.query.limit)

    // const startIndex = (page - 1) * limit
    // const endIndex = page * limit

    // const results = {}

    // if (endIndex < users.length) {
    //     results.next = {
    //         page: page + 1,
    //         limit: limit
    //     }
    // }

    // if (startIndex > 0) {
    //     results.previous = {
    //         page: page - 1,
    //         limit: limit
    //     }
    // }

    // results.results = users.slice(startIndex, endIndex)
    // res.json(results)

    res.json(res.paginatedResults)
})

function paginatedResults(model) {
    return async (req, res, next) => {
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)

        const startIndex = (page - 1) * limit
        const endIndex = page * limit

        const results = {}

        if (endIndex < await model.countDocuments().exec()) {
            results.next = {
                page: page + 1,
                limit: limit
            }
        }

        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit
            }
        }
        try {
            results.results = await model.find().limit(limit).skip(startIndex).exec()
            res.paginatedResults = results
            next()
        } catch (e) {
            res.status(500).json({ message: e.message })
        }

        res.paginatedResults = results
        next()

    }
}

app.listen(4000)