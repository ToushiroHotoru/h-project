const { model, Schema } = require("mongoose");

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    preferencesTags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tags",
        required: true,
      },
    ],
    exceptionsTags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tags",
        required: true,
      },
    ],
    avatar: {
      avatarDefault: {
        type: Boolean,
        default: true,
      },
      avatarDefaultId: {
        type: Schema.Types.ObjectId,
      },
      avatarImage: {
        type: String,
      },
    },
    banner: { type: String },
    favorites: { type: Array },
    permissions: {
      showTags: { type: Boolean, default: true },
      showFavorites: { type: Boolean, default: true },
    },
    userType: { type: String, deafult: "notAdmin?" },
    passwordChangeUuid: { type: String, default: null },
  },
  { timestamps: true }
);

userSchema.statics.register = function (params) {
  return this.create({
    username: params.username,
    password: params.password,
    email: params.email,
  });
};

userSchema.statics.allUsers = function () {
  return this.find({}).populate("preferencesTags").exec();
};

userSchema.statics.setPreferencesTags = function (params) {
  return this.updateOne(
    { _id: params.id },
    { preferencesTags: params.preferencesTags },
    { runValidators: true }
  );
};

userSchema.statics.setExceptionsTags = function (params) {
  return this.updateOne(
    { _id: params.id },
    { exceptionsTags: params.exceptionsTags },
    { runValidators: true }
  );
};

userSchema.statics.setAvatar = function (params) {
  return this.updateOne(
    { _id: params.id },
    { avatar: params.avatar },
    { runValidators: true }
  );
};

module.exports = model("User", userSchema);
