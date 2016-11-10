if (!global.hasOwnProperty('db')) {
  var Sequelize = require('sequelize')
    , sequelize = null

  if (process.env.HEROKU_POSTGRESQL_BRONZE_URL) {
    // the application is executed on Heroku ... use the postgres database
    sequelize = new Sequelize(process.env.HEROKU_POSTGRESQL_BRONZE_URL, {
      dialect:  'postgres',
      protocol: 'postgres',
      port:     match[4],
      host:     match[3],
      logging:  true //false
    })
  } else {
    // the application is executed on the local machine ... use mysql
    var DATABASE_URL = 'YOUR_POSTGRES_URL_HERE';
    var match = DATABASE_URL.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/)
    sequelize = new Sequelize(match[5], match[1], match[2], {
        dialect:  'postgres',
        protocol: 'postgres',
        port:     match[4],
        host:     match[3],
        logging: false,
        dialectOptions: {
            ssl: true
        }
    });
  }

  /*
    Set up models  
  */

  var User = sequelize.import(__dirname + '/user');
  var Topic = sequelize.import(__dirname + '/topic');
  var Opinion = sequelize.import(__dirname + '/opinion');
  var Comment = sequelize.import(__dirname + '/comment');

  /*
    Associations defined here:
  */
  User.hasMany(Topic, {
    foreignKey: {
      name: 'created_by',
      allowNull: false
    }
  });

  User.hasMany(Opinion, {
    foreignKey: {
      name: 'created_by',
      allowNull: false
    }
  });

  User.hasMany(Comment, {
    foreignKey: {
      name: 'created_by',
      allowNull: false
    }
  });

  Topic.hasMany(Opinion, {
    foreignKey: {
      name: 'topic_id',
      allowNull: false
    }
  });

  Topic.hasMany(Comment, {
    foreignKey: {
      name: 'topic_id',
      allowNull: false
    }
  });

  Opinion.hasMany(Comment, {
    foreignKey: {
      name: 'opinion_id',
      allowNull: false
    }
  });

  global.db = {
    Sequelize: Sequelize,
    sequelize: sequelize,
    User:      User,
    Topic:     Topic,
    Opinion:   Opinion,
    Comment:   Comment
  }

}

module.exports = global.db