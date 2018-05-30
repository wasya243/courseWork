const router = require('express').Router();
const jobTitles = require('./handlers/jobTitles');

router.get('/job-titles', jobTitles.jobTitleListGET);

router.get('/job-titles/:id', jobTitles.jobTitleByIdGET);

router.post('/job-titles', jobTitles.jobTitleCreatePOST);

router.put('/job-titles/:id', jobTitles.jobTitleUpdateById);

router.delete('/job-titles/:id', jobTitles.jobTitleByIdDelete);

module.exports = router;