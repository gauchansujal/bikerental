// types/validation-error.ts
export class ValidationError extends Error {
  constructor(
    message: string,
    public issues: any[] = []
  ) {
    super(message);
    this.name = "ValidationError";
  }
}