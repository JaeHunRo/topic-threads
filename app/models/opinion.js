module.exports = function(sequelize, DataTypes) {
  return sequelize.define("opinion", {
    content: {
	    type     : DataTypes.TEXT,
	    allowNull: false
	  }
  });
}