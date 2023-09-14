const express = require('express');
const router = express.Router();
const { requireUser, requiredNotSent } = require('./utils');
const { getAllReviews, getReviewById, getReviewByName, createReview, updateReview } = require('../db/reviews');

// GET /api/reviews
router.get('/', async (req, res, next) => {
    try {
        const reviews = await getAllReviews();
        res.send(reviews);
    } catch (error) {
        next(error)
    }
});

// GET /api/reviews/:id
router.get('/:id', async (req, res, next) => {
    try {
        const review = await getReviewById();
        res.send(review);
    } catch (error) {
        next(error)
    }
});

// POST /api/reviews
router.post('/', requireUser, requiredNotSent({requiredParams: ['name', 'content', 'rating']}), async (req, res, next) => {
    try {
      const {name, content, rating} = req.body;
      const existingReview = await getReviewByName(name);
      if(existingReview) {
        next({
          name: 'NotFound',
          message: `An review with name ${name} already exists`
        });
      } else {
        const createdReview = await createReview({name, content, rating});
        if(createdReview) {
          res.send(createdReview);
        } else {
          next({
            name: 'FailedToCreate',
            message: 'There was an error creating your review'
          })
        }
      }
    } catch (error) {
      next(error);
    }
});

// PATCH /api/reviews/:reviewId
router.patch('/:reviewId', requireUser, requiredNotSent({requiredParams: ['name', 'content', 'rating'], atLeastOne: true}), async (req, res, next) => {
    try {
      const {reviewId} = req.params;
      const existingReview = await getReviewById(reviewId);
      if(!existingReview) {
        next({
          name: 'NotFound',
          message: `No review by ID ${reviewId}`
        });
      } else {
        const {name, content, rating} = req.body;
        const updatedReview = await updateReview({id: reviewId, name, content, rating})
        if(updatedReview) {
          res.send(updatedReview);
        } else {
          next({
            name: 'FailedToUpdate',
            message: 'There was an error updating your review'
          })
        }
      }
    } catch (error) {
      next(error);
    }
});

module.exports = router;