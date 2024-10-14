import { RequestHandler } from "express";
import * as yup from "yup";

export const validate = (schema: yup.ObjectSchema<any>): RequestHandler => {
  return async (req, res, next) => {
    if (!req.body) {
      return res.status(422).json({ error: "Empty body is not accepted" });
    }

    const schemaToValidate = yup.object({
      body: schema,
    });

    try {
      // Validate the request body using the schema
      await schemaToValidate.validate(
        { body: req.body },
        { abortEarly: true }  // Stops after the first validation error
      );

      // If validation passes, proceed to the next middleware
      next();
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        // Send a 400 response for validation errors
        return res.status(422).json({
          error: error.message,
        });
      }

      // If any other error occurs, pass it to the error handler
      next(error);
    }
  };
};
