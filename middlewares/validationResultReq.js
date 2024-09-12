import { query, validationResult } from 'express-validator';

const validationResultReq = (req, res, next) => {
    [
        // Xác thực và làm sạch chuỗi userName
        query('userName')
            .trim() // Loại bỏ khoảng trắng đầu và cuối
            .isLength({ min: 3, max: 50 }) // Đảm bảo độ dài của chuỗi từ 3 đến 50 ký tự
            .withMessage('User name must be between 3 and 50 characters long')
            .customSanitizer((value) => value.replace(/[^a-zA-Z0-9\s]/g, '')), // Loại bỏ tất cả ký tự không phải chữ cái, số, và khoảng trắng
    ];
    const errors = validationResult(req);
    req.errors = errors;

    next();
};

export default validationResultReq;
