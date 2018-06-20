const { PersonalSchedules } = require('../../db/models');

const personalScheduleListGET = async (req, res, next) => {
    try {
        const  personalScheduleList = await PersonalSchedules.findAll();
        res.send(personalScheduleList);
    } catch (error) {
        next(error);
    }
};

const personalScheduleCreatePOST = async (req, res, next) => {
    try {
        const  personalSchedule = await PersonalSchedules.create(req.body);
        res.send( personalSchedule);
    } catch(error) {
        next(error);
    }
};

const personalScheduleByIdGET = async (req, res, next) => {
    try {
        const { id } = req.params;
        const personalSchedule = await PersonalSchedules.findById(id);
        personalSchedule ? res.send(personalSchedule) : next();
    } catch (error) {
        next(error);
    }
};

const personalScheduleUpdateById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [ affectedCount, affectedRows ]= await PersonalSchedules.update(req.body, { where: { id } });
        if(affectedCount < 1) {
            return next();
        }
        const updatedPersonalSchedule = await PersonalSchedules.findById(id);
        res.send(updatedPersonalSchedule);
    } catch (error) {
        next(error);
    }
};

const personalScheduleDelete = async (req, res, next) => {
    try {
        const { id } = req.params;
        const personalScheduleToDelete = await PersonalSchedules.findById(id);
        if (!personalScheduleToDelete) {
            return next();
        }
        await personalScheduleToDelete.destroy();
        res.send(personalScheduleToDelete);
    }
    catch(error) {
        next(error);
    }
};


module.exports = {
    personalScheduleDelete,
    personalScheduleByIdGET,
    personalScheduleListGET,
    personalScheduleUpdateById,
    personalScheduleCreatePOST,
};
