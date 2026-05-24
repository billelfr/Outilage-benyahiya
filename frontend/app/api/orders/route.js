import { NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/adminAuthServer";
import { createOrderRecord, listOrderRecords } from "@/lib/orderServer";
import { sendTelegramOrderNotification } from "@/lib/telegram";

export async function POST(request) {
  try {
    const payload = await request.json();
    const order = await createOrderRecord(payload);

    try {
      await sendTelegramOrderNotification(order);
    } catch (notificationError) {
      console.error(notificationError);
    }

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message || "Could not create order." }, { status: 400 });
  }
}

export async function GET(request) {
  try {
    await requireAdminRequest(request);
    const orders = await listOrderRecords(request.headers.get("authorization"));

    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json({ message: error.message || "Could not load orders." }, { status: 401 });
  }
}
