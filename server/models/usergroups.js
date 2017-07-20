export default (sequelize, DataTypes) => {
  const UserGroups = sequelize.define('UserGroups', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    username: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: "uniqueUserGroups",
      validate: {
        notEmpty: {
          msg: "Please login first"
        },
      }
    },
    groupId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      unique: "uniqueUserGroups"
    }
  });

  UserGroups.associate = (models) => {
    // 1 to many with board
    UserGroups.belongsTo(models.Groups, {
      foreignKey: 'groupId',
    });
  }

  return UserGroups;
}