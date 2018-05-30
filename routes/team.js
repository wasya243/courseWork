const router = require('express').Router();
const teamHandler = require('./handlers/team');

router.get('/teams', teamHandler.teamListGET);

router.get('/teams/:id', teamHandler.teamByIdGET);

router.post('/teams', teamHandler.teamCreatePOST);

//this route can be used for schedule linking as well. However it maybe should be patch.
router.put('/teams/:id', teamHandler.teamUpdateById);

router.delete('/teams/:id', teamHandler.teamByIdDelete);

router.get('/teams/:id/employees', teamHandler.employeeListByTeamIdGet);

module.exports = router;