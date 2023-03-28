import { z } from "zod";

export const idSchema = z.coerce
  .number({
    invalid_type_error: "Id must be an integer.",
    required_error: "Id is required."
  })
  .int("Id must be an integer.")
  .positive("Id must be positive.");