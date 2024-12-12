// config.js
const mongoose = require('mongoose');

const ConfigSchema = new mongoose.Schema({
  key: { 
    type: String, 
    unique: true, 
    required: true,
    validate: {
      validator: function(v) {
        return /^[a-zA-Z0-9_]+$/.test(v);
      },
      message: props => `${props.value} is not a valid key! Use only alphanumeric characters and underscores.`
    }
  },
  value: { 
    type: mongoose.Schema.Types.Mixed, 
    required: true 
  },
  description: {
    type: String,
    required: false
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  strict: false // Allows for flexible value types
});

// Add pre-save middleware to update lastUpdated
ConfigSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Add methods for type-safe value access
ConfigSchema.methods.getNumberValue = function() {
  return typeof this.value === 'number' ? this.value : parseInt(this.value);
};

ConfigSchema.methods.getStringValue = function() {
  return String(this.value);
};

ConfigSchema.methods.getBooleanValue = function() {
  return Boolean(this.value);
};

// Static method to safely update config
ConfigSchema.statics.updateConfig = async function(key, value, description = null) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const config = await this.findOneAndUpdate(
      { key },
      { 
        $set: { 
          value,
          description: description || undefined,
          lastUpdated: new Date()
        }
      },
      { 
        new: true, 
        upsert: true, 
        session,
        runValidators: true
      }
    );

    await session.commitTransaction();
    return config;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const Config = mongoose.model('Config', ConfigSchema);

module.exports = Config;