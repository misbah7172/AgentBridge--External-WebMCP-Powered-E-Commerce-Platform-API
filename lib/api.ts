import { NextResponse } from "next/server";

export const success = <T>(data: T, status = 200) => NextResponse.json({ success: true, data }, { status });

export const failure = (code: string, message: string, status = 400) =>
  NextResponse.json({ success: false, error: { code, message } }, { status });
