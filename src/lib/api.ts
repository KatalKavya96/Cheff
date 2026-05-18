import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ data }, init);
}

export function created<T>(data: T) {
  return ok(data, { status: 201 });
}

export function handleRouteError(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "Validation failed",
        issues: error.flatten()
      },
      { status: 400 }
    );
  }

  console.error(error);
  return NextResponse.json(
    {
      error:
        error instanceof Error
          ? error.message
          : "Something went wrong while processing the request."
    },
    { status: 500 }
  );
}
