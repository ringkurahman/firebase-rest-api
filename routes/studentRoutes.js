const express = require('express')
const { addStudent, getAllStudents, getStudent, updateStudent, deleteStudent } = require('../controllers/studentController')


const router = express.Router()


router.post('/students', addStudent)
router.get('/students', getAllStudents)
router.get('/students/:id', getStudent)
router.put('/students/:id', updateStudent)
router.delete('/students/:id', deleteStudent)


module.exports = {
    routes: router
}