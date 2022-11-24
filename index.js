const express = require('express')
const app = express()
const cors = require('cors')
const pool = require('./db')

// - - - - - -   M I D D L E W A R E   - - - - - -
app.use(cors())
app.use(express.json()) // Allows us to use req.body

// - - - - - -   R O U T E S   - - - - - -

// - - - Create a todo - - -
app.post('/todos', async (req, res) => {
    try {
        const { description } = req.body
        const newTodo = await pool.query(
            // Use RETURNING * every time you are inserting, updating or deleting items
            "INSERT INTO todo (description) VALUES($1) RETURNING *",
            [description]
        )
        res.json(newTodo.rows[0])
    } catch (error) {
        console.error(error.message)
    }
})

// - - - Get all todos - - -
app.get('/todos', async (req, res) => {
    try {
        const getAllTodos = await pool.query("SELECT * FROM todo")
        res.json(getAllTodos.rows)
    } catch (error) {
        console.error(error.message)
    }
})

// - - - Get a specific todo - - -
app.get('/todos/:id', async(req, res) => {
    try {
        const { id } = req.params
        const getTodo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [id])
        res.json(getTodo.rows[0])
    } catch (error) {
        console.error(error.message)
    }
})

// - - - Update a todo - - -
app.put('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { description } = req.body
        const updateTodo = await pool.query("UPDATE todo SET description = $1 WHERE todo_id = $2", [description, id])
        res.json("Todo was updated!")
    } catch (error) {
        console.error(error.message)
    }
})

// - - - Delete a todo - - -
app.delete('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params
        const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [id])
        res.json("Todo was deleted!")
    } catch (error) {
        console.error(error.message)
    }
})

app.listen(5000, () => {
    console.log("Todo app server listenin on port 5000")
})