const { DataTypes, Op } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  auth0_id: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'The user ID from Auth0'
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  display_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true
  },
  onboarding_completed: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {},
    comment: 'Additional user metadata from Auth0'
  },
  preferences: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {
      theme: 'light',
      notifications: true,
      email_notifications: true
    }
  }
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['auth0_id'],
      name: 'users_auth0_id'
    },
    {
      unique: true,
      fields: ['email'],
      name: 'users_email',
      where: {
        email: { [Op.ne]: null }
      }
    }
  ]
});

// Instance methods
User.prototype.updateLastLogin = async function() {
  this.last_login = new Date();
  return this.save();
};

// Class methods
User.findByAuth0Id = async function(auth0Id) {
  return User.findOne({
    where: { auth0_id: auth0Id }
  });
};

User.findOrCreateFromAuth0 = async function(auth0User) {
  const [user] = await User.findOrCreate({
    where: { auth0_id: auth0User.sub },
    defaults: {
      email: auth0User.email,
      username: auth0User.nickname || auth0User.email.split('@')[0],
      display_name: auth0User.name,
      avatar_url: auth0User.picture,
      metadata: {
        email_verified: auth0User.email_verified,
        locale: auth0User.locale,
        updated_at: auth0User.updated_at
      }
    }
  });

  // Update user info if it has changed in Auth0
  if (user.email !== auth0User.email ||
      user.display_name !== auth0User.name ||
      user.avatar_url !== auth0User.picture) {
    user.email = auth0User.email;
    user.display_name = auth0User.name;
    user.avatar_url = auth0User.picture;
    await user.save();
  }

  return user;
};

module.exports = User; 