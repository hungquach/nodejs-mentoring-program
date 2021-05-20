"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Utils {
    validateSchema(schema) {
        return (req, res, next) => {
            const { error } = schema.validate(req.body, {
                abortEarly: false,
                allowUnknown: false
            });
            if (error && error.isJoi) {
                res.status(400).json(this.errorResponse(error.details));
            }
            else {
                next();
            }
        };
    }
    errorResponse(schemaErrors) {
        const errors = schemaErrors.map(({ path, message }) => {
            return { path, message };
        });
        return {
            status: 'failed',
            errors,
        };
    }
}
exports.default = Utils;
