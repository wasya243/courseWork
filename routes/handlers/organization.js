const { Organization, Department } = require('../../db/models');

const organizationListGET = async (req, res, next) => {
    try {
        const organizationList = await Organization.findAll();
        res.send(organizationList);
    } catch (error) {
        next(error);
    }
};

const organizationCreatePOST = async (req, res, next) => {
    try {
        const organization = await Organization.create(req.body);
        res.send(organization);
    } catch(error) {
        next(error);
    }
};

const organizationByIdGET = async (req, res, next) => {
    try {
        const { id } = req.params;
        const organization = await Organization.findById(id);
        organization ? res.send(organization) : next();
    } catch (error) {
        next(error);
    }
};

const organizationUpdateById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [ affectedCount, affectedRows ]= await Organization.update(req.body, { where: { id } });
        if(affectedCount < 1) {
            return next();
        }
        const updatedOrganization = await Organization.findById(id);
        res.send(updatedOrganization);
    } catch (error) {
        next(error);
    }
};

const organizationByIdDelete = async (req, res, next) => {
    try {
        const { id } = req.params;
        const organizationToDelete = await Organization.findById(id);
        if (!organizationToDelete) {
            return next();
        }
        await organizationToDelete.destroy();
        res.send(organizationToDelete);
    }
    catch(error) {
        next(error);
    }
};

const departmentListByOrganizationIdGet = async (req, res, next) => {
    try {
        const { id } = req.params;
        const listOfDepartments = await Department.findAll({
            where: { departmentId: id }
        });
        res.send(listOfDepartments);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    departmentListByOrganizationIdGet,
    organizationByIdDelete,
    organizationByIdGET,
    organizationListGET,
    organizationUpdateById,
    organizationCreatePOST,
};
