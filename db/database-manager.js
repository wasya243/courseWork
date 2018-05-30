const Sequelize = require('sequelize');

class DatabaseManager {

    constructor(database, username, password, host, dialect) {
        this.database = database;
        this.username = username;
        this.password = password;
        this.host = host;
        this.dialect = dialect;
    }

    connect() {
        return new Sequelize(this.database, this.username, this.password, {
            host: this.host,
            dialect: this.dialect,
        });
    }
}

module.exports = {
    DatabaseManager,
};