const { model, Schema } = require("mongoose");

const userSchema = new Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
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
    banner: { type: String, default: null },
    favorites: { type: Array, default: [] },
    permissions: {
      showTags: { type: Boolean, default: true },
      showFavorites: { type: Boolean, default: true },
    },
    userType: { type: String, deafult: "notAdmin" },
    passwordChangeUuid: { type: String, default: null },
    tokens: { type: Array, default: [] },
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
