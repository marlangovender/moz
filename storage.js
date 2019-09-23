/**
 * Created by Marlan on 9/20/2019.
 */

'use strict'

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        const filename = file.originalname;
        const ext = path.extname(filename);
        cb(null, file.fieldname + '-' + Date.now() + ext)
    }
})



let upload = multer({ storage: storage })
//let upload.filename = filename;

module.exports = upload;