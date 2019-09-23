/**
 * displays file upload form
 *
 * Created by Marlan on 9/20/2019.
 */

'use strict'

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    //res.render('forms');
    res.sendFile(__dirname + '/index.html');
});

module.exports = router;