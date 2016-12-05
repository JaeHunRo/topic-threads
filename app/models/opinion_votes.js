module.exports = function(sequelize, DataTypes) {
  return sequelize.define("opinion_votes", {
    type: {
	    type     : DataTypes.STRING(30),
	    allowNull: false
	  }
  });
}