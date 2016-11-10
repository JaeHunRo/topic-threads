module.exports = function(sequelize, DataTypes) {
  return sequelize.define("user", {
  	fb_id: {
  		type     : DataTypes.STRING(30),
  		allowNull: false
  	},
    username: {
	    type     : DataTypes.STRING(30),
	    allowNull: false
	  },
    admin: {
	    type     : DataTypes.BOOLEAN,
	    allowNull: false
	  }
  });
}