const express = require('express');
const router = express.Router();
const { requireUser, requiredNotSent } = require('./utils');
const { getAllWebsites, getWebsiteById, getWebsiteByName, updateWebsite } = require('../db/wesbites');

// GET /api/websites
router.get('/', async (req, res, next) => {
    try {
        const websites = await getAllWebsites();
        res.send(websites);
    } catch (error) {
        next(error)
    }
});

// GET /api/websites/:id
router.get('/:id', async (req, res, next) => {
    try {
        const website = await getWebsiteById();
        res.send(website);
    } catch (error) {
        next(error)
    }
});

// POST /api/websites
router.post('/', requireUser, requiredNotSent({requiredParams: ['name', 'description', 'url', 'image']}), async (req, res, next) => {
    try {
      const {name, description, url, image} = req.body;
      const existingWebsite = await getWebsiteByName(name);
      if(existingWebsite) {
        next({
          name: 'NotFound',
          message: `An website with name ${name} already exists`
        });
      } else {
        const createdWebsite = await createWebsite({name, description, url, image});
        if(createdWebsite) {
          res.send(createdWebsite);
        } else {
          next({
            name: 'FailedToCreate',
            message: 'There was an error creating your website'
          })
        }
      }
    } catch (error) {
      next(error);
    }
});

// PATCH /api/websites/:websiteId
router.patch('/:websiteId', requireUser, requiredNotSent({requiredParams: ['name', 'description', 'url', 'image'], atLeastOne: true}), async (req, res, next) => {
    try {
      const {websiteId} = req.params;
      const existingWebsite = await getWebsiteById(websiteId);
      if(!existingWebsite) {
        next({
          name: 'NotFound',
          message: `No website by ID ${websiteId}`
        });
      } else {
        const {name, description, url, image} = req.body;
        const updatedWebsite = await updateWebsite({id: websiteId, name, description, url, image})
        if(updatedWebsite) {
          res.send(updatedWebsite);
        } else {
          next({
            name: 'FailedToUpdate',
            message: 'There was an error updating your website'
          })
        }
      }
    } catch (error) {
      next(error);
    }
});

module.exports = router;