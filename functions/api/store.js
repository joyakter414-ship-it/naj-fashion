/**
 * Cloudflare Pages Function: /api/store
 * Handles global real-time catalog syncing (products, categories, size guide, auth).
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
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
      return new Response(JSON.stringify({ success: false, error: "KV binding missing" }), {
        status: 500,
        headers: corsHeaders
      });
    }

    const [productsRaw, categoriesRaw, sizeGuideRaw, authRaw] = await Promise.all([
      kv.get("store_products"),
      kv.get("store_categories"),
      kv.get("store_size_guide"),
      kv.get("store_auth")
    ]);

    const products = productsRaw ? JSON.parse(productsRaw) : null;
    const categories = categoriesRaw ? JSON.parse(categoriesRaw) : null;
    const sizeGuide = sizeGuideRaw ? JSON.parse(sizeGuideRaw) : null;
    const auth = authRaw ? JSON.parse(authRaw) : null;

    return new Response(JSON.stringify({
      success: true,
      products,
      categories,
      sizeGuide,
      authEmail: auth ? auth.email : null
    }), {
      headers: {
        ...corsHeaders,
        "Cache-Control": "no-cache, no-store, must-revalidate"
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

export async function onRequestPost(context) {
  try {
    const kv = context.env.NAJ_STORE_KV;
    if (!kv) {
      return new Response(JSON.stringify({ success: false, error: "KV binding missing" }), {
        status: 500,
        headers: corsHeaders
      });
    }

    const body = await context.request.json();
    const action = body.action || "sync_all";

    if (action === "save_products") {
      if (Array.isArray(body.products)) {
        await kv.put("store_products", JSON.stringify(body.products));
      }
    } else if (action === "save_categories") {
      if (Array.isArray(body.categories)) {
        await kv.put("store_categories", JSON.stringify(body.categories));
      }
    } else if (action === "save_size_guide") {
      if (Array.isArray(body.sizeGuide)) {
        await kv.put("store_size_guide", JSON.stringify(body.sizeGuide));
      }
    } else if (action === "update_credentials") {
      if (body.auth) {
        await kv.put("store_auth", JSON.stringify(body.auth));
      }
    } else if (action === "sync_all") {
      const promises = [];
      if (body.products) promises.push(kv.put("store_products", JSON.stringify(body.products)));
      if (body.categories) promises.push(kv.put("store_categories", JSON.stringify(body.categories)));
      if (body.sizeGuide) promises.push(kv.put("store_size_guide", JSON.stringify(body.sizeGuide)));
      if (body.auth) promises.push(kv.put("store_auth", JSON.stringify(body.auth)));
      await Promise.all(promises);
    }

    return new Response(JSON.stringify({
      success: true,
      message: "Data successfully synced to Cloudflare global edge network!"
    }), {
      headers: corsHeaders
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: corsHeaders
    });
  }
}
