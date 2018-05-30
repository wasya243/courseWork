const router = require('express').Router();
const organization = require('./handlers/organization');

router.get('/organizations', organization.organizationListGET);

router.get('/organizations/:id', organization.organizationByIdGET);

router.post('/organizations', organization.organizationCreatePOST);

router.put('/organizations/:id', organization.organizationUpdateById);

router.delete('/organizations/:id', organization.organizationByIdDelete);

router.get('/organizations/:id/departments', organization.departmentListByOrganizationIdGet);

module.exports = router;
