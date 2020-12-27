const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const story = require('../models/story')

// Login page
// GET/
router.get('/', ensureGuest, (req, res) => {
    res.render('Login', { layout: 'login' });
})


// dashboard page
// GET/dashboard
router.get('/dashboard', ensureAuth, async(req, res) => {
    try {
        const stories = await story.find({ user: req.user.id }).lean()
        res.render('Dashboard', {
            name: req.user.firstName,
            stories,
        })
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }


})


// Update story
// put/ stories/:id
router.put('/', ensureAuth, async(req, res) => {
    let story = await story.findById(req.params.id).lean()

    if (!story) {
        return res.render('error/404')
    }
})




module.exports = router