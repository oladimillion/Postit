'use strict';

export default (sequelize, DataTypes) => {
  const Messages = sequelize.define('Messages', {
    messageId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Please provide the group id"
        },
        notNull: {
          msg: "Please provide the group id"
        }
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Please login first"
        },
        notNull: {
          msg: "Please login first"
        }
      }
    },
    message: {
      allowNull: false,
      type: DataTypes.STRING,
      notNull: {
        msg: "Message field cannot be empty"
      },
      validate: {
        messageLength: (msg) => {
          if (msg.length < 1) {
            throw new Error("Message field should contain character(s) betweeen 1 and 1000");
          }
        }
      }
    },

  }, {
    setterMethods: {
      setData: (username, message) => {
        this.username = username;
        this.message = message;
      }
    }
  });

  Messages.associate = (models) => {
    // 1 to many with board
    Messages.belongsTo(models.Groups, {
      foreignKey: 'groupId',
    });
  }

  return Messages;
}