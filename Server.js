const express = require("express");
const mongoose = require("mongoose")
const User = require("./Users")
const app = express()

mongoose.connect('mongodb://localhost/pagination', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.once('open', async () => {
    if (await User.countDocuments().exec() > 0) return

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


app.get('/apps', async (req, res) => {
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    console.log(page, limit, "blah")

    let result = await User.find().sort({ "range.by.id": 1 }).skip((page - 1) * limit).limit(limit)
    res.json(result)
})

app.listen(4000)