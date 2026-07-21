const UserNormalizer = require("../normalizers/user.normalizer");
const UserModel = require("../models/user.model");

class UserController {
    static async getUser(req, res) {
        try {
            const user = await UserModel.findOne({_id: req.user.id});

            if (!user) {
                return res.status(404)
                    .json({error: true, message: "Пользователь не найден"});
            }

            res.json(UserNormalizer.normalize(user, true));
        } catch (err) {
            console.error(err);
            res.status(500).json({error: true, message: "Внутренняя ошибка сервера"});
        }
    }
}

module.exports = UserController;