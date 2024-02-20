const { model, Schema } = require("mongoose");

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    banner: { type: String, default: null },
    favorites: { type: Array, default: [] },
    preferencesTags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tags",
      },
    ],
    exceptionsTags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tags",
      },
    ],
    avatar: {
      type: Schema.Types.ObjectId,
      ref: "Avatar",
    },
    permissions: {
      showTags: { type: Boolean, default: true },
      showFavorites: { type: Boolean, default: true },
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      default: "65d4b4b5358e0d03d7ba7c7e",
    },
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
  return this.findByIdAndUpdate(
    params.id,
    { preferencesTags: params.preferencesTags },
    { runValidators: true }
  );
};

userSchema.statics.setExceptionsTags = function (params) {
  return this.findByIdAndUpdate(
    params.id,
    { exceptionsTags: params.exceptionsTags },
    { runValidators: true }
  );
};

userSchema.statics.setAvatar = function (params) {
  return this.findByIdAndUpdate(
    params.id,
    { avatar: params.avatar },
    { runValidators: true }
  );
};

module.exports = model("User", userSchema);
