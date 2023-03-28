import { json, type TypedResponse } from "@remix-run/node";
import type { typeToFlattenedError, z } from "zod";

export function validationErrorResponse<T>(err: z.ZodError<T>) {
  return json(
    { success: false, message: "Validation failed.", validationErrors: err.flatten() } as ErrorResponse,
    { status: 400 }
  )
}

export function validateZodSchema<T>(schema: z.ZodSchema<T>, data: unknown) {
  const res = schema.safeParse(data);
  if (res.success) {
    if (!res.data) {
      return Err(errorResponse("Validation failed.", 400));
    }
    return Ok<T>(res.data as T);
  } else {
    return Err(validationErrorResponse(res.error));
  }
}


/**
 * A result object that if errored, returns a response that could be returned from a loader/action
 */
export type APIResult<T, E> = ResultSuccess<T> | ResultError<E> 
export type ResultSuccess<T> = { 
  success: true, 
  data: T
}
export type ResultError<T> = { 
  success: false, 
  response: TypedResponse<T>
}

/**
 * Creates a {@link ResultError}
 * @param response The response to be sent
 */
export function Err<T>(response: TypedResponse<T>): ResultError<T> {
  return { success: false, response: response }
}

/**
 * Creates a {@link ResultSuccess} 
 * @param data The data of a success
 */
export function Ok<T>(data: T): ResultSuccess<T> {
  return { success: true, data: data }
}

export type PostResponse = {
  success: true
} | ErrorResponse

export interface ErrorResponse {
  success: false,
  message: string,
  validationErrors?: typeToFlattenedError<any>
}

export const errorResponse = (message: string, status?: number) => json<ErrorResponse>({ success: false, message: message }, { status: status });