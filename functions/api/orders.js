/**
 * Cloudflare Pages Function: /api/orders
 * Handles saving and listing customer orders across all devices.
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json"
};

export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders });
}

export async function onRequestGet(context) {
  try {
    const kv = context.env.NAJ_STORE_KV;
    if (!kv) {
      return new Response(JSON.stringify({ success: false, orders: [] }), { headers: corsHeaders });
    }

    const raw = await kv.get("store_orders");
    const orders = raw ? JSON.parse(raw) : [];

    return new Response(JSON.stringify({ success: true, orders }), {
      headers: {
        ...corsHeaders,
        "Cache-Control": "no-cache, no-store, must-revalidate"
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message, orders: [] }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

export async function onRequestPost(context) {
  try {
    const kv = context.env.NAJ_STORE_KV;
    if (!kv) {
      return new Response(JSON.stringify({ success: false, error: "KV missing" }), { status: 500, headers: corsHeaders });
    }

    const body = await context.request.json();
    const newOrder = body.order;
    if (!newOrder) {
      return new Response(JSON.stringify({ success: false, error: "Order data missing" }), { status: 400, headers: corsHeaders });
    }

    const raw = await kv.get("store_orders");
    const orders = raw ? JSON.parse(raw) : [];

    // Prepend new order
    orders.unshift(newOrder);

    // Keep max 500 orders
    if (orders.length > 500) {
      orders.length = 500;
    }

    await kv.put("store_orders", JSON.stringify(orders));

    return new Response(JSON.stringify({ success: true, orderId: newOrder.orderId }), { headers: corsHeaders });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500, headers: corsHeaders });
  }
}

export async function onRequestPut(context) {
  try {
    const kv = context.env.NAJ_STORE_KV;
    const body = await context.request.json();
    const { orderId, status } = body;

    const raw = await kv.get("store_orders");
    const orders = raw ? JSON.parse(raw) : [];

    const found = orders.find(o => o.orderId === orderId);
    if (found) {
      found.status = status;
      await kv.put("store_orders", JSON.stringify(orders));
      return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
    }

    return new Response(JSON.stringify({ success: false, error: "Order not found" }), { status: 404, headers: corsHeaders });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500, headers: corsHeaders });
  }
}

export async function onRequestDelete(context) {
  try {
    const kv = context.env.NAJ_STORE_KV;
    const body = await context.request.json();
    const { orderId } = body;

    const raw = await kv.get("store_orders");
    const orders = raw ? JSON.parse(raw) : [];

    const filtered = orders.filter(o => o.orderId !== orderId);
    await kv.put("store_orders", JSON.stringify(filtered));

    return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500, headers: corsHeaders });
  }
}
