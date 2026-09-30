import { ApiError } from '../utils/ApiError.js';

export const validateRequest = (validatorSchema) => {
  return (req, res, next) => {
    if (typeof validatorSchema === 'function') {
      const { isValid, errors } = validatorSchema(req.body);
      if (!isValid) {
        throw new ApiError(400, 'Validation Error', errors);
      }
    }
    next();
  };
};
