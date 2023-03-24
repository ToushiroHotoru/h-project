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
    } catch (error) {
      return null;
    }
  }

  async saveToken(userId, newRefreshToken, oldRefreshToken) {
    try {
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
    } catch (error) {
      return null;
    }
  }

  async verifyAccessToken(token) {
    const tokenData = jwt.verify(token, jwtSecret);
    return tokenData;
  }

  async verifyRefreshToken(token) {
    const tokenData = jwt.verify(token, jwtSecretRefresh);
    return tokenData;
  }

  async removeRefreshToken(userId, token) {
    try {
      const tokenData = await Token.findOne({ user: userId });
      const newTokens = tokenData.tokens.filter((item) => {
        if (item !== token) return item;
      });

      tokenData.tokens = newTokens;
      await tokenData.save();
    } catch (error) {
      return null;
    }
  }

  async findToken(userId, refreshToken) {
    try {
      const tokenData = await Token.findOne({ user: userId });
      const token = tokenData.tokens.filter((item) => {
        if (item === refreshToken) return item;
      });

      return token;
    } catch (error) {
      return null;
    }
  }

  async refresh(params) {
    try {
      const newGeneratedTokens = this.generateTokens(params.payload);
      const tokenData = await Token.findOne({ user: params.user });
      const newTokens = tokenData.tokens.map((token) => {
        if (params.refreshToken === token)
          return newGeneratedTokens.refreshToken;
        else return token;
      });

      tokenData.tokens = newTokens;
      await tokenData.save();

      return {
        accessToken: newGeneratedTokens.accessToken,
        refreshToken: newGeneratedTokens.refreshToken,
      };
    } catch (error) {
      return null;
    }
  }
}

module.exports = new TokenService();
