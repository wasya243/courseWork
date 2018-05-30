const router = require('express').Router();
const schedule = require('./handlers/schedule');

router.get('/schedules', schedule.scheduleListGET);

router.get('/schedules/:id', schedule.scheduleByIdGET);

router.post('/schedules', schedule.scheduleCreatePOST);

router.put('/schedules/:id', schedule.scheduleUpdateById);

router.delete('/schedules/:id', schedule.scheduleByIdDelete);

router.get('/schedules/:id/schedule-details', schedule.scheduleDetailsGET);

module.exports = router;