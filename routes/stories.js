const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')
const Story = require('../models/story')

// Show add story
// GET stories/add
router.get('/add', ensureAuth, (req, res) => {
    res.render('./stories/add');
})

// Process add form
// stories/post
router.post('/', ensureAuth, async(req, res) => {
    try {
        req.body.user = req.user.id;
        await Story.create(req.body);
        res.redirect('/dashboard');
    } catch (error) {
        console.error(error);
        res.render('error/500');
    }
})


// Show single story
// GET stories/:id
router.get('/:id', ensureAuth, async(req, res) => {
    try {
        let story = await Story.findById(req.params.id)
            .populate('user')
            .lean()

        if (!story) {
            return res.render('error/404')
        }

        res.render('stories/show', {
            story
        })
    } catch (error) {
        console.error(error)
        res.render('/error/404')
    }
})

// Show add stories
// GET stories
router.get('/', ensureAuth, async(req, res) => {
    try {
        const stories = await Story.find({ status: 'public' })
            .populate('user')
            .sort({ createdAt: 'desc' })
            .lean()

        res.render('stories/index', { stories })

    } catch (error) {
        console.error(error)
        res.render('error/500')
    }
})



// Show edit story
// GET stories/edit/:id
router.get('/edit/:id', ensureAuth, async(req, res) => {
    try {
        const story = await Story.findOne({
            _id: req.params.id
        }).lean()

        if (!story) {
            return res.render('error/404')
        }

        if (story.user != req.user.id) {
            res.redirect('/stories')
        } else {
            res.render('stories/edit', {
                story,
            })
        }
    } catch (error) {
        console.error(error)
        return res.render('error/500')
    }

})

// Update story
// put/ stories/:id
router.put('/:id', ensureAuth, async(req, res) => {
    try {
        let story = await Story.findById(req.params.id).lean()

        if (!story) {
            return res.render('error/404')
        }

        if (story.user != req.user.id) {
            res.redirect('/stories')
        } else {
            story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
                new: true,
                runValidators: true
            })

            res.redirect('/dashboard')
        }
    } catch (error) {
        console.error(error)
        return res.render('error/500')
    }

})


// Delete story
// delete stories/delete/:id
router.delete('/:id', ensureAuth, async(req, res) => {
    try {
        await Story.remove({ _id: req.params.id })
        res.redirect('/dashboard')
    } catch (error) {
        console.error(error)
        return res.render('error/500')
    }
})



// Show user story
// GET stories/user/:userid
router.get('/user/:userId', ensureAuth, async(req, res) => {
    try {
        const stories = await Story.find({
                user: req.params.userId,
                status: 'public'
            })
            .populate('user')
            .lean()

        res.render('stories/index', {
            stories
        })
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }
})



module.exports = router