const { Team, Employee } = require('../../db/models');

const teamListGET = async (req, res, next) => {
    try {
        const teamList = await Team.findAll();
        res.send(teamList);
    } catch (error) {
        next(error);
    }
};

const teamCreatePOST = async (req, res, next) => {
    try {
        const team = await Team.create(req.body);
        res.send(team);
    } catch(error) {
        next(error);
    }
};

const teamByIdGET = async (req, res, next) => {
    try {
        const { id } = req.params;
        const team = await Team.findById(id);
        team ? res.send(team) : next();
    } catch (error) {
        next(error);
    }
};

const teamUpdateById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [ affectedCount, affectedRows ]= await Team.update(req.body, { where: { id } });
        if(affectedCount < 1) {
            return next();
        }
        const updatedTeam = await Team.findById(id);
        res.send(updatedTeam);
    } catch (error) {
        next(error);
    }
};

const teamByIdDelete = async (req, res, next) => {
    try {
        const { id } = req.params;
        const teamToDestroy = await Team.findById(id);
        if(!teamToDestroy) {
            return next();
        }
        await teamToDestroy.destroy();
        res.send(teamToDestroy);
    }
    catch(error) {
        next(error);
    }
};

const employeeListByTeamIdGet = async (req, res, next) => {
    try {
        const { id } = req.params;
        const listOfEmployees = await Employee.findAll({
            where: { team_id: id }
        });
        res.send(listOfEmployees);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    employeeListByTeamIdGet,
    teamByIdDelete,
    teamByIdGET,
    teamListGET,
    teamUpdateById,
    teamCreatePOST,
};