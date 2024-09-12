import statusService from '../services/status.js';

class statusController {
    async status(req, res, next) {
        try {
            const { userName } = req.query;

            const errors = req.errors;

            const result = await statusService.statusBooking(userName, errors);
            return res.json(result);
        } catch (error) {
            next(error);
        }
    }
}

export default new statusController();
