import { NextRequest, NextResponse } from "next/server";

import { HttpError } from "@/types/HttpError";
import getStudentHistory from "@/lib/getStudentHistory";
import getServerSession from "@/services/getServerSession";

interface StudentParams {
  params: Promise<{
    code: string;
  }>;
}

export async function GET(_: NextRequest, props: StudentParams) {
  const params = await props.params;

  const { code } = params;

  const session = await getServerSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const history = await getStudentHistory(code);

  if (history instanceof HttpError)
    return NextResponse.json(history.message, { status: history.status });

  return NextResponse.json(history);
}
