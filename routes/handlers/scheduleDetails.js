const { ScheduleDetails } = require('../../db/models');

const scheduleDetailsListGET = async (req, res, next) => {
    try {
        const scheduleDetailsList = await ScheduleDetails.findAll();
        res.send(scheduleDetailsList);
    } catch (error) {
        next(error);
    }
};

const scheduleDetailsCreatePOST = async (req, res, next) => {
    try {
        const scheduleDetails = await ScheduleDetails.create(req.body);
        res.send(scheduleDetails);
    } catch(error) {
        next(error);
    }
};

const scheduleDetailsByIdGET = async (req, res, next) => {
    try {
        const { id } = req.params;
        const scheduleDetails = await ScheduleDetails.findById(id);
        scheduleDetails ? res.send(scheduleDetails) : next();
    } catch (error) {
        next(error);
    }
};

const scheduleDetailsUpdateById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const scheduleDetailsToUpdate = ScheduleDetails.findById(id);
        if (!scheduleDetailsToUpdate) {
            return next();
        }
        await scheduleDetailsToUpdate.update(req.body);
        res.send(scheduleDetailsToUpdate);
    } catch (error) {
        next(error);
    }
};

const scheduleDetailsByIdDelete = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [ affectedCount, affectedRows ]= await ScheduleDetails.update(req.body, { where: { id } });
        if(affectedCount < 1) {
            return next();
        }
        const updatedScheduleDetails = await ScheduleDetails.findById(id);
        res.send(updatedScheduleDetails);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    scheduleDetailsByIdDelete,
    scheduleDetailsByIdGET,
    scheduleDetailsListGET,
    scheduleDetailsUpdateById,
    scheduleDetailsCreatePOST,
};