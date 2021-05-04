const express = require("express");
const mongoose = require("mongoose")
const User = require("./Users")
const app = express()

mongoose.connect('mongodb://localhost/pagination', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.once('open', async () => {
    if (await User.find() > 0) return

    Promise.all([
        User.create({ range: { by: { id: 1, name: "my-app-001" } } }),
        User.create({ range: { by: { id: 2, name: "my-app-002" } } }),
        User.create({ range: { by: { id: 3, name: "my-app-003" } } }),
        User.create({ range: { by: { id: 4, name: "my-app-004" } } }),
        User.create({ range: { by: { id: 5, name: "my-app-005" } } }),
        User.create({ range: { by: { id: 6, name: "my-app-006" } } }),
        User.create({ range: { by: { id: 7, name: "my-app-007" } } }),
        User.create({ range: { by: { id: 8, name: "my-app-008" } } }),
        User.create({ range: { by: { id: 9, name: "my-app-009" } } }),
        User.create({ range: { by: { id: 10, name: "my-app-010" } } }),
        User.create({ range: { by: { id: 11, name: "my-app-011" } } }),
        User.create({ range: { by: { id: 12, name: "my-app-012" } } }),
        User.create({ range: { by: { id: 13, name: "my-app-013" } } }),
        User.create({ range: { by: { id: 14, name: "my-app-014" } } }),
        User.create({ range: { by: { id: 15, name: "my-app-015" } } })
    ]).then(() => console.log('Added Users'))
})

// const users = [
//     { id: 1, name: 'User 1' },
//     { id: 2, name: 'User 2' },
//     { id: 3, name: 'User 3' },
//     { id: 4, name: 'User 4' },
//     { id: 5, name: 'User 5' },
//     { id: 6, name: 'User 6' },
//     { id: 7, name: 'User 7' },
//     { id: 8, name: 'User 8' },
//     { id: 9, name: 'User 9' },
//     { id: 10, name: 'User 10' }
// ]

// const posts = [
//     { id: 1, name: 'Post 1' },
//     { id: 2, name: 'Post 2' },
//     { id: 3, name: 'Post 3' },
//     { id: 4, name: 'Post 4' },
//     { id: 5, name: 'Post 5' },
//     { id: 6, name: 'Post 6' },
//     { id: 7, name: 'Post 7' },
//     { id: 8, name: 'Post 8' },
//     { id: 9, name: 'Post 9' },
//     { id: 10, name: 'Post 10' }
// ]

// app.get('/posts', paginatedResults(posts), (req, res) => {

// })

// middleware function VVVV
app.get('/apps', paginatedResults(User), (req, res) => {
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

        if (endIndex < await model.find()) {
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
            results.results = await model.find()
            results.results.slice(startIndex, startIndex + limit)
            return results.results.sort()
            res.paginatedResults = results

            next()
        } catch (e) {
            res.status(500).json({ message: e.message })
        }
    }
}

app.listen(4000)