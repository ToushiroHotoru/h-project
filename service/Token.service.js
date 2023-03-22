const jwt = require("jsonwebtoken");

const Token = require("../schemas/Token.schema");

const jwtSecret = "4HSmrFXgwSK5xFejb4nzwrzb";
const jwtSecretRefresh = "yTyctGvGELCMAGbGC7YrdKa9";

class TokenService {
  generateTokens(payload) {
    try {
      const accessToken = jwt.sign(payload, jwtSecret, {
        expiresIn: "30m",
      });
      const refreshToken = jwt.sign(payload, jwtSecretRefresh, {
        expiresIn: "90d",
      });
      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {}
  }
  async saveToken(userId, newRefreshToken, oldRefreshToken) {
    const tokenData = await Token.findOne({ user: userId });

    if (tokenData) {
      const newTokens = tokenData.tokens.map((token) => {
        if (oldRefreshToken === token) return newRefreshToken;
        else return token;
      });

      if (!newTokens.includes(newRefreshToken)) {
        newTokens.push(newRefreshToken);
      }

      tokenData.tokens = newTokens;
      return tokenData.save();
    }

    const token = Token.create({
      user: userId,
      tokens: newRefreshToken,
    });
    return token;
  }
}

module.exports = new TokenService();
