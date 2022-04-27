const router = require('express').Router();

const api = require('../modules/s3/s3.routes.api');

router.use('/s3', api);

module.exports = router;
