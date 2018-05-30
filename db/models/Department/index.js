module.exports = (sequelize, type) => {
  return sequelize.define('departments', {
      name: {
          type: type.STRING,
          allowNull: false,
      }
  }, {
      underscored: true
  });
};