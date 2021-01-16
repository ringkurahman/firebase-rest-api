const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const studentRoutes = require('./routes/studentRoutes')
const authRoutes = require('./routes/authRoutes')
const chatRoutes = require('./routes/chatRoutes')

const dotenv = require('dotenv')
dotenv.config({ path: './.env' })
const morgan = require('morgan')
const colors = require('colors')
const { notFound, errorHandler } = require('./middlewares/errorMiddleware')


const app = express()


// Middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use(express.json())
app.use(cors())
app.use(bodyParser.json())


app.use('/api', studentRoutes.routes)
app.use('/api/auth', authRoutes.routes)
app.use('/api/chats', chatRoutes.routes)


// Handle 404 error
app.use(notFound)
// handle error message into json format
app.use(errorHandler)

const PORT = process.env.PORT || 5000

const server = app.listen( 
    PORT, console.log(`Server listening in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
)

// Handle unhandled rejection from database
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red)
    // Close server and exit process
    server.close(() => process.exit(1))
})

