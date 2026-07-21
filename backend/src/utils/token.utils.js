const jwt = require("jsonwebtoken");
const config = require('../config/config');
const UserModel = require('../models/user.model');

class TokenUtils {
    static async generateTokens(user, rememberMe) {
        try {
            const payload = {id: user.id, email: user.email};

            const accessToken = jwt.sign(
                payload,
                config.secret,
                {expiresIn: rememberMe ? "10d" : "1d"}
            );
            const refreshToken = jwt.sign(
                payload,
                config.secret,
                {expiresIn: "30d"}
            );

            return Promise.resolve({accessToken, refreshToken});
        } catch (err) {
            return Promise.reject(err);
        }
    }

    static verifyRefreshToken(refreshToken) {
        return new Promise(async (resolve, reject) => {
            // Сначала проверяем валидность токена через JWT
            jwt.verify(refreshToken, config.secret, async (err, tokenDetails) => {
                if (err) {
                    return reject(new Error("Токен не валиден"));
                }
                
                // Затем проверяем, существует ли пользователь с таким токеном в БД
                try {
                    const user = await UserModel.findOne({refreshToken: refreshToken});
                    if (!user) {
                        return reject(new Error("Токен не валиден"));
                    }
                    
                    resolve({
                        tokenDetails,
                        error: false,
                        message: "Valid refresh token",
                    });
                } catch (dbError) {
                    return reject(new Error("Ошибка при проверке токена"));
                }
            });
        });
    }
}

module.exports = TokenUtils;