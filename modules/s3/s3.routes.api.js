const router = require('express').Router();
const busboy = require('busboy');
const Controller = require('../../services/aws');

// // List Buckets
router.get('/', async (q, r, n) => {
  Controller.listBuckets()
    .then(d => r.json(d))
    .catch(e => n(e));
});

// Get signed Url for Authorized Users to access the file
router.get('/getSignedUrl', async (q, r, n) => {
  const { key } = q.body;
  Controller.getPresignedUrl({ key })
    .then(d => r.json(d))
    .catch(e => n(e));
});

// S3 Upload using stream
router.post('/upload', (req, res, next) => {
  const bb = busboy({ headers: req.headers });
  bb.on('file', (name, file, info) => {
    const { filename } = info;
    const payload = {
      filename,
      file
    };
    Controller.sendFiletoAws({ payload, folder: 'client' })
      .then(d => res.json(d))
      .catch(e => next(e));
  });
  req.pipe(bb);
});

module.exports = router;
