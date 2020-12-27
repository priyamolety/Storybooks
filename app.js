const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const connectDB = require('./config/db')
const morgan = require('morgan')
const path = require('path')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)



//To load the config files
dotenv.config({ path: './config/config.env' });


// Passport Configuration
require('./config/passport')(passport)


// Callling the connectDB function
connectDB();



// Initialise the app with express
const app = express();


// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// Method override
app.use(methodOverride(function(req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        let method = req.body._method
        delete req.body._method
        return method
    }
}))


if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}


// Handlebar helpers
const { formatDate, stripTags, truncate, editIcon, select, } = require('./helpers/hbs')

// Handlebars
app.engine('.hbs', exphbs({ helpers: { formatDate, stripTags, truncate, editIcon, select }, defaultlayout: 'main', extname: '.hbs' }));
app.set('view engine', '.hbs');


// express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

// Passport's middleware
app.use(passport.initialize())
app.use(passport.session())


// Set global variable
// app.use(function(req, res, next) {
//     res.locals.user = req.user || null
//     next()
// })
app.use(function(req, res, next) {
    res.locals.user = req.user || null
    next()
})


// Static folder
app.use(express.static(path.join(__dirname, 'public')))


// Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))


const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));