 import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const schema = z.object({
  title: z.string().min(2),
  description: z.string().min(10).optional(),
  imageUrl: z.string().url(),
  amazonUrl: z.string().url(),
  price: z.number(),
  category: z.string().min(2),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const product = await prisma.affiliateProduct.create({
    data: {
      ...parsed.data,
      description: parsed.data.description ?? "",
    },
  });

  return NextResponse.json({ success: true, product });
}



export async function GET() {
  try {
    const products = await prisma.affiliateProduct.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Erreur de récupération" }, { status: 500 });
  }
}


export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    console.warn("Unauthorized access attempt", session);
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  let id: string | undefined;

  try {
    const body = await req.json();
    id = body.id;
  } catch (error) {
    console.error("Erreur lors de la lecture du corps de la requête :", error);
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "ID invalide" }, { status: 422 });
  }

  try {
    await prisma.affiliateProduct.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    return NextResponse.json(
      { error: "Erreur de suppression" },
      { status: 500 }
    );
  }
}



export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const updatedProduct = await prisma.affiliateProduct.update({
      where: { id: body.id },
      data: parsed.data,
    });
    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur de mise à jour" }, { status: 500 });
  }
}