const express = require('express')
const { register, getUserProfile, login, logout, getAllUsersProfile, updateUserProfile, deleteUser } = require('../controllers/authController')


const router = express.Router()


router.post('/register', register)
router.post('/login', login)
router.get('/logout', logout)
router.get('/profiles', getAllUsersProfile)
router.get('/profiles/:id', getUserProfile)
router.put('/update/:id', updateUserProfile)
router.delete('/delete/:id', deleteUser)



module.exports = {
    routes: router
}