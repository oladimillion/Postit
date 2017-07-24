'use strict';

export default (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    username: {
      allowNull: false,
      unique: {
        msg: "Username already exist"
      },
      notNull: {
        msg: "Please provide username"
      },
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [6, 20],
          msg: "Username should be between 6 and 20"
        }
      }
    },
    phone: {
      allowNull: false,
      unique: {
        msg: "Phone number already exist"
      },
      notNull: {
        msg: "Please provide phone number"
      },
      type: DataTypes.STRING,
      validate: {
        testPhone: (phone) => {
          let re = /^([\d]){6,20}$/;;
          if (!re.test(phone)) {
            throw new Error("Phone no must be digits only," +
              " length should be between 6 and 20");
          }
        },
      }
    },
    email: {
      allowNull: false,
      unique: {
        msg: "Email already exist"
      },
      notNull: {
        msg: "Please provide email"
      },
      type: DataTypes.STRING,
      validate: {
        testEmail: (email) => {
          let re = new RegExp("^([A-Za-z0-9.!#$%'+=*\"^&{|}~()`\\?/><,.])" +
            "{2,}@[a-zA-Z0-9-]{2,}(?:\.[a-zA-Z0-9-]{2,})$");
          if (!re.test(email)) {
            throw new Error("Invalid email");
          }
        },
      }
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
      notNull: {
        msg: "Please provide password"
      },
      validate: {
        testPassword: (password) => {
          let re = /^([a-zA-Z0-9.!#$%'+=*"^&{|}~()`\\?/><,.]){4,30}$/;
          if (!re.test(password)) {
            throw new Error("Password must not be less than " +
              "four in length, can contain digit, alphabet " +
              "or special characters or all");
          }
        },
      }
    }
  });

  // Users.associate = (models) => {
  //   // 1 to many with board
  //   Users.hasMany(models.Messages, {
  //     foreignKey: 'messageId',
  //   });

  // Users.belongsToMany(models.Groups, {
  //   as: "member",
  //   foreignKey: 'userId',
  //   through: "UserGroups"
  // });


  return Users;
}