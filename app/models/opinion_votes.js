module.exports = function(sequelize, DataTypes) {
  return sequelize.define("opinion_votes", {
    type: {
	    type     : DataTypes.ENUM('flawed', 'savage', 'debatable', 'convincing', 'intriguing'),
	    allowNull: false
	  }
  });
}