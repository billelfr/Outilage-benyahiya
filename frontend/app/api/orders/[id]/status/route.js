import { NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/adminAuthServer";
import { updateOrderRecordStatus } from "@/lib/orderServer";

export async function PATCH(request, { params }) {
  try {
    await requireAdminRequest(request);
    const { id } = await params;  // ← await params
    const payload = await request.json();
    const order = await updateOrderRecordStatus(id, payload.status, request.headers.get("authorization"));

    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json({ message: error.message || "Could not update order status." }, { status: 400 });
  }
}
   