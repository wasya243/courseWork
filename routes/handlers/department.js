const { Department, Team } = require('../../db/models');

const departmentListGET = async (req, res, next) => {
    try {
        const departmentList = await Department.findAll();
        res.send(departmentList);
    } catch (error) {
        next(error);
    }
};

const departmentCreatePOST = async (req, res, next) => {
    try {
        const department = await Department.create(req.body);
        res.send(department);
    } catch(error) {
        next(error);
    }
};

const departmentByIdGET = async (req, res, next) => {
    try {
        const { id } = req.params;
        const department = await Department.findById(id);
        department ? res.send(department) : next();
    } catch (error) {
        next(error);
    }
};

const departmentUpdateById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [ affectedCount, affectedRows ]= await Department.update(req.body, { where: { id } });
        if(affectedCount < 1) {
            return next();
        }
        const updatedDepartment = await Department.findById(id);
        res.send(updatedDepartment);
    } catch (error) {
        next(error);
    }
};

const departmentByIdDelete = async (req, res, next) => {
    try {
        const { id } = req.params;
        const departmentToDelete = await Department.findById(id);
        if (!departmentToDelete) {
            return next();
        }
        await departmentToDelete.destroy();
        res.send(departmentToDelete);
    }
    catch(error) {
        next(error);
    }
};

const teamListByDepartmentIdGet = async (req, res, next) => {
    try {
        const { id } = req.params;
        const listOfTeams = await Team.findAll({
            where: { department_id: id }
        });
        res.send(listOfTeams);
    } catch (error) {
        next(error);
    }
};


module.exports = {
    teamListByDepartmentIdGet,
    departmentByIdDelete,
    departmentByIdGET,
    departmentListGET,
    departmentUpdateById,
    departmentCreatePOST,
};
