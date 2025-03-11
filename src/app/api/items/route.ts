import connectToDatabase from "@/lib/mongodb";
import Items from "@/models/Item";
import { NextRequest } from "next/server";

export async function GET() {
  await connectToDatabase();
  try {
    const items = await Items.find();
    return new Response(JSON.stringify(items), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Failed to fetch the items:", err);
  }

  return new Response(JSON.stringify({ error: "Failed to fetch the items" }), {
    status: 500,
    headers: { "Content-Type": "application/json" },
  });
}

export async function PUT(request: NextRequest) {
  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  await connectToDatabase();

  if (type === "pin") {
    const { _id, pinnedBy } = await request.json();
    if (!_id || !pinnedBy) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    try {
      const updatedItem = await Items.findByIdAndUpdate(_id, {
        pinnedBy,
      });
      if (!updatedItem) {
        return new Response(JSON.stringify({ error: "Item not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify("Updated successfully"), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Failed to update item:", error);
    }
  } else if (type === "buy") {
    const { _id, boughtBy, cost } = await request.json();
    if (!_id || !boughtBy || !cost) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    try {
      const updatedItem = await Items.findByIdAndUpdate(_id, {
        boughtAt: Date.now(),
        boughtBy,
        cost,
      });
      if (!updatedItem) {
        return new Response(JSON.stringify({ error: "Item not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify("Updated successfully"), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Failed to update item:", error);
    }
  }
}

export async function POST(request: NextRequest) {
  await connectToDatabase();
  const { item } = await request.json();
  try {
    await Items.create({ item });
    return new Response(JSON.stringify("Item saved successfully"), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to save new item:", error);
  }
  return new Response(JSON.stringify({ error: "Failed to save new item" }), {
    status: 500,
    headers: { "Content-Type": "application/json" },
  });
}
