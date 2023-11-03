import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { storage } from "@/lib/firebaseAdmin";
import prisma from "@/lib/prisma";

const schema = z.object({
  uploadId: z.string().uuid(),
});

interface StudentParams {
  params: {
    code: string;
  };
}

export async function POST(
  req: NextRequest,
  { params: { code } }: StudentParams
) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json(parsed.error, { status: 400 });

  const { uploadId } = parsed.data;
  const filename = `profile/${uploadId}`;

  // check if file exists
  const [exists] = await storage.bucket().file(filename).exists();
  if (!exists)
    return NextResponse.json({ error: "Invalid upload id" }, { status: 404 });

  const [meta] = await storage.bucket().file(filename).makePublic();

  // https://storage.googleapis.com/<bucket>/<object>
  const { bucket, object } = meta;
  const url = `https://storage.googleapis.com/${bucket}/${object}`;

  // TODO: remove old avatar if existent
  // ...file(filename).delete()

  // TODO: update authenticated user's avatar
  await prisma.student.update({
    where: { code },
    data: { image: url },
  });

  return NextResponse.json({ userCode: code, url });
}
