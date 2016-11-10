module.exports = function(sequelize, DataTypes) {
  return sequelize.define("topic", {
    title: {
	    type     : DataTypes.STRING(256),
	    allowNull: false
	  },
    category: {
	    type     : DataTypes.STRING(30),
	    allowNull: true
	  },
	  num_votes: {
	  	type     : DataTypes.INTEGER,
	    allowNull: true
	  }
  });
}