const firebase = require('firebase')
const config = require('../config/config')



const db = firebase.initializeApp(config.firebaseConfig)


module.exports = db 

