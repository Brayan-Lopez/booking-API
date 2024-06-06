const { DataTypes } = require('sequelize');
const sequelize = require('../utils/connection');

const City = sequelize.define('city', {
  name: {
      type: DataTypes.STRING(70),
      allowNull: false
  },
  country: {
    type: DataTypes.STRING(70),
    allowNull: false
  },
  countryId: {
    type: DataTypes.STRING(10),
    allowNull: false
  }
});

module.exports = City;