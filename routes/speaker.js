const express = require('express');

const speakerController = require('../controllers/speaker');

const router = express.Router();

router.get('/speakers', speakerController.getSpeakers);

router.get('/speaker/:speakerId', speakerController.getSpeaker);

router.post('/create-speaker', speakerController.postSpeaker);

module.exports = router;
