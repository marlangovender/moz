/**
 * Created by Marlan on 9/20/2019.
 */

'use strict'

const app = require('./app');
const storage = require('./storage');

const server = app.listen(3000, () => {
        console.log(`Express is running on port ${server.address().port}`);
});