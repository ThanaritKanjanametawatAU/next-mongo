import Category from "@/models/Category";

// export async function GET() {
//   const categories = await Category.find().sort({name:1})
//   return Response.json( categories)
// }

export async function GET(request) { 

  // console.log('GET /api/category',request.nextUrl.searchParams.get("pno")) 

  const pno = request.nextUrl.searchParams.get("pno") 

  if (pno) { 

    const size = 3
    const startIndex = (pno - 1) * size
    const categories = await Category.find().sort({order:-1}).skip(startIndex).limit(size)
    return Response.json(categories) 

  } 

  const categories = await Category.find().sort({ order: -1 })
  return Response.json(categories) 

}





export async function POST(request) {
  const body = await request.json()
  const category = new Category(body)
  await category.save()
  return Response.json(category)
}


export async function PUT(request) {
  const body = await request.json()
  const category = await Category.findByIdAndUpdate(body._id, body)
  return Response.json(category)
}
 