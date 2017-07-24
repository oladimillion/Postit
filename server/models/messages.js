'use strict';

export default (sequelize, DataTypes) => {
  const Messages = sequelize.define('Messages', {
    messageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Please login in first"
        },
      },
    },
    message: {
      allowNull: false,
      type: DataTypes.TEXT,
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

  });

  // Messages.associate = (models) => {

  //   Messages.belongsToMany(models.Users, {
  //     through: "UserMessages"
  //   });

  //   // 1 to many with board
  //   Messages.belongsToMany(models.Groups, {
  //     through: "GroupMessages"
  //   });

  // }

  return Messages;
}