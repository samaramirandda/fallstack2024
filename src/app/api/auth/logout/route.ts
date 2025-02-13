import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import config from "@/config";

export async function POST() {
  try {
    // deletes the auth cookie
    (await cookies()).delete({ name: config.cookies.auth.name });

    return NextResponse.json(
      { message: "Signout successfully" },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
