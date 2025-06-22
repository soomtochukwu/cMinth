// app/api/txnHash/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabaseClient";

// GET /api/txnHash?id=2
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get("id");

    if (!idParam) {
      return NextResponse.json(
        { error: "Missing id parameter" },
        { status: 400 }
      );
    }

    // Find record where key `idParam` exists in the `data` JSON object
    const { data, error } = await supabase.from("txnhashes").select("data");
    //   .filter(`data->>${idParam}`, "not.is", null); // JSON path filter
    console.log(data);
    const txn =
      data?.find((row) => row.data.id === idParam)?.data.txnHash || "omo";

    console.log(txn);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "Invalid id" }, { status: 404 });
    }

    const txnHash = data[0].data[idParam];

    return NextResponse.json({ txn });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error", details: String(error) },
      { status: 500 }
    );
  }
}

// POST /api/txnHash (body: { "2": "0xcc...xqw" })
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { error: "Body must be a key-value object" },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("txnhashes").insert([{ data: body }]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error", details: String(error) },
      { status: 500 }
    );
  }
}
