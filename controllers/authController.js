const firebase = require('firebase')
const User = require('../models/Users')
const db = require('../db/db')
const firestore = db.firestore()



// @desc        Create user profile
// @route       POST /api/auth/register
// @access      Public
const createUserProfile = userProfile =>
    firestore.collection('profiles').doc(userProfile.uid).set(userProfile)



// @desc        Register user
// @route       POST /api/auth/register
// @access      Public
const register = async(req, res, next) => {
    try {
        const data = req.body
        const { email, password, username, avatar } = data
        
        if (!email || !password || !username) {
            res.status(400).send('Please provide an email, password and username')
        }

        const { user } = await firebase.auth().createUserWithEmailAndPassword(email, password)

        if (!user) {
            res.status(401).send('Invalid credentials')
        }

        const userProfile = { uid:user.uid, username, email, avatar, role:'user', joinedChats: [] }
        await createUserProfile(userProfile)

        res.status(200).json({
            success: true
        })

    } catch (err) {
        res.status(400).send(err.message)
    }
}


// @desc        Login user
// @route       POST /api/auth/login
// @access      Public
const login = async(req, res, next) => {
    try {
        const data = req.body
        const { email, password } = data

        if (!email || !password) {
            res.status(400).send('Please provide an email and password')
        }

        await firebase.auth().signInWithEmailAndPassword(email, password)

        res.status(200).json({
            success: true
        })

    } catch (err) {
        res.status(400).send(error.message)
    }
}


// @desc        Logout user
// @route       GET /api/auth/logout
// @access      Public
const logout = async(req, res, next) => {
    try {
        await firebase.auth().signOut()
        res.status(200).json({
            success: true,
            data: {}
        })

    } catch (err) {
        res.status(400).send(error.message)
    }
}


// @desc        Get single user profile
// @route       GET /api/auth/profiles/:id
// @access      Private
const getUserProfile = async (req, res, next) => {
    try {
        const id = req.params.id
        const user = await firestore.collection('profiles').doc(id)
        const data = await user.get()

        if(!data.exists) {
            res.status(404).send('User with the given ID not found')
        }else {
            res.status(200).json({
                success: true,
                data: data.data()
            })
        }
    } catch (error) {
        res.status(400).send(error.message)
    }
}


// @desc        Get all user profile
// @route       GET /api/auth/profiles
// @access      Private
const getAllUsersProfile = async (req, res, next) => {
    try {
        const users = await firestore.collection('profiles')
        const data = await users.get()
        const usersArray = []
        if(data.empty) {
            res.status(404).send('No user record found')
        }else {
            data.forEach(doc => {
                const user = new User(
                    doc.id,
                    doc.data().username,
                    doc.data().email,
                    doc.data().avatar,
                    doc.data().role
                )
                usersArray.push(user)
            })
            res.send(usersArray)
        }
    } catch (error) {
        res.status(400).send(error.message)
    }
}


// @desc        Update user profile
// @route       PUT /api/auth/update/:id
// @access      Private
const updateUserProfile = async (req, res, next) => {
    try {
        const id = req.params.id
        const data = req.body
        const user = await firestore.collection('profiles').doc(id)
        await user.update(data)
 
        res.status(200).json({
            success: true
        })
        
    } catch (error) {
        res.status(400).send(error.message)
    }
}


// @desc        Delete user profile
// @route       DELETE /api/auth/delete/:id
// @access      Private
const deleteUser = async (req, res, next) => {
    try {
        const id = req.params.id
        await firestore.collection('profiles').doc(id).delete()
        const user = firebase.auth().currentUser
        await user.delete()

        res.status(200).json({
            success: true
        })

    } catch (error) {
        res.status(400).send(error.message)
    }
}


// Manage logged in and logged out state
const onAuthStateChanges = onAuth =>
    firebase.auth().onIdTokenChanged(onAuth)



module.exports = { register, getUserProfile, login, logout, getAllUsersProfile, updateUserProfile, deleteUser, onAuthStateChanges }