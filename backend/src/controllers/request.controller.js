const RequestModel = require("../models/request.model");
const ValidationUtils = require("../utils/validation.utils");

class RequestController {
    static async makeRequest(req, res) {
        try {
            const {error} = ValidationUtils.makeRequestValidation(req.body);

            if (error) {
                console.log(error.details);
                return res.status(400).json({error: true, message: error.details[0].message});
            }

            let request = new RequestModel();
            request.name = req.body.name;
            request.phone = req.body.phone;
            if (req.body.service) {
                request.service = req.body.service;
            }
            request.date = new Date();
            request.type = req.body.type;

            await request.save();

            res.status(201).json({error: false, message: "Запрос успешно отправлен!"});
        } catch (err) {
            console.error(err);
            res.status(500).json({error: true, message: "Внутренняя ошибка сервера"});
        }
    }
}

module.exports = RequestController;