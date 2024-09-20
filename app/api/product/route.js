import Product from "@/models/Product";
import { ObjectId } from 'mongodb';

export async function GET() {
  // Apply pagination

  const pno = request.nextUrl.searchParams.get("pno");

  if (pno) {
    const size = 3;
    const startIndex = (pno - 1) * size;
    const products = await Product.find().sort({ order: -1 }).skip(startIndex).limit(size);
    return Response.json(products);
  }

    const products = await Product.find().sort({ order: -1 });
    return Response.json(products);

}

export async function POST(request) {
  const body = await request.json();
  console.log(body)
  const product = new Product(body);
  await product.save();
  return Response.json(product);
}

export async function PUT(request) {
  const body = await request.json();
  const { _id, ...updateData } = body;
  const product = await Product.findByIdAndUpdate(new ObjectId(_id), updateData, { new: true });
  if (!product) {
    return new Response("Product not found", { status: 404 });
  }
  return Response.json(product);
}

export async function PATCH(request) {
  const body = await request.json();
  const { _id, ...updateData } = body;
  const product = await Product.findByIdAndUpdate(_id, updateData, { new: true });
  if (!product) {
    return new Response("Product not found", { status: 404 });
  }
  return Response.json(product);
}