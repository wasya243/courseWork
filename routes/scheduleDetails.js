const router = require('express').Router();
const scheduleDetail = require('./handlers/scheduleDetails');

router.get('/schedule-details', scheduleDetail.scheduleDetailsListGET);

router.get('/schedule-details/:id', scheduleDetail.scheduleDetailsByIdGET);

router.post('/schedule-details', scheduleDetail.scheduleDetailsCreatePOST);

router.put('/schedule-details/:id', scheduleDetail.scheduleDetailsUpdateById);

router.delete('/schedule-details/:id', scheduleDetail.scheduleDetailsByIdDelete);

module.exports = router;