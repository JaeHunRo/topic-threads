module.exports = function(sequelize, DataTypes) {
  return sequelize.define("topic_votes", {
    isUp: {
	    type     : DataTypes.BOOLEAN,
	    allowNull: false
	  }
  });
}