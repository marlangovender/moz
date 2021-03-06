/**
 * main app to provide routing endpoints for uploading and rendering chart
 *
 * Created by Marlan on 9/20/2019.
 */

'use strict'

const express = require('express');
const path = require('path');
const routes = require('./routes/index');
const bodyParser= require('body-parser')
const app = express();
const uploader = require('./storage');
const csv2es = require('./eshelper');
const uploadPath = path.join(__dirname, 'uploads');

app.use(bodyParser.urlencoded({extended: true}))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use('/', routes);

//POST endpoint to upload single file
app.post('/uploadfile', uploader.single('myFile'), async function (req, res, next) {
    const file = req.file
    var uploadStatus = "",
        filename = "";
    if (file) {
        filename = file.originalname;
        uploadStatus = filename + ' uploaded successfully';
        res.status(200);
        var ingestFile = await csv2es.ingest(path.join(uploadPath,file.filename));
        var showRender = await res.redirect(307, '/render');
    } else {
        console.log('No File Uploaded');
        filename = 'FILE NOT UPLOADED';
        uploadStatus = 'File Upload Failed';
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        res.send(uploadStatus)
    }
})

//POST endpoint to render chart
app.post('/render', function (req, res) {
    res.sendFile(__dirname + '/html/renderChart.html');
})

//GET endpoing to obtain chart data
app.get('/esQuery', async function (req, res){
    var queryEs = await csv2es.queryEs(req.query.Query, req.query.Size, req.query.Fields, req.query.Sort);
    res.send(queryEs);
})

module.exports = app;