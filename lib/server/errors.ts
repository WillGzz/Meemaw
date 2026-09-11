export class ApiError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
export function field(value: unknown, label: string, min = 1, max = 200): string {
  if (typeof value !== "string" || value.trim().length < min || value.trim().length > max) {
    throw new ApiError(400, `${label} must be between ${min} and ${max} characters.`);
  }
  return value.trim();
}
