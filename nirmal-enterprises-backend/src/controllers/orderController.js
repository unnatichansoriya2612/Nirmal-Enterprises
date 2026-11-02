import supabase from "../config/supabase.js";

const ORDER_TYPES = ["online", "offline"];

export async function createOrder(req, res) {
  try {
    const { customer_id = null, order_type, items, notes = null, shipping_address = null } = req.body;

    const finalCustomerId = req.profile?.id || customer_id || null;

    if (!ORDER_TYPES.includes(order_type)) {
      return res.status(400).json({
        success: false,
        message: "order_type must be 'online' or 'offline'.",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "items must be a non-empty list.",
      });
    }

    for (const item of items) {
      if (!item.product_id || !Number.isInteger(item.quantity) || item.quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: "Each item needs a product_id and a whole-number quantity above 0.",
        });
      }
    }

    // Only send product_id and quantity; the price comes from the database
    const cleanItems = items.map((i) => ({
      product_id: i.product_id,
      quantity: i.quantity,
    }));

    const { data: orderId, error } = await supabase.rpc("create_order", {
      p_customer_id: finalCustomerId,
      p_order_type: order_type,
      p_items: cleanItems,
      p_notes: notes,
      p_shipping_address: shipping_address,
    });

    if (error) {
      const msg = error.message || "";

      if (msg.startsWith("INSUFFICIENT_STOCK")) {
        return res.status(409).json({
          success: false,
          message: `Not enough stock for: ${msg.split(":")[1]}`,
        });
      }
      if (msg.startsWith("PRODUCT_INACTIVE")) {
        return res.status(400).json({
          success: false,
          message: `Product is inactive: ${msg.split(":")[1]}`,
        });
      }
      if (msg.startsWith("PRODUCT_NOT_FOUND")) {
        return res.status(404).json({ success: false, message: "Product not found." });
      }
      if (msg.startsWith("INVALID_QUANTITY") || msg.startsWith("ITEMS_REQUIRED")) {
        return res.status(400).json({ success: false, message: "Invalid items." });
      }
      if (error.code === "22P02") {
        return res.status(400).json({ success: false, message: "Invalid id format." });
      }
      if (error.code === "23503") {
        return res.status(400).json({ success: false, message: "Customer not found." });
      }

      console.error("Create order error:", msg);
      return res.status(500).json({ success: false, message: "Unable to create order." });
    }

    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("*, order_items(id, product_id, quantity, unit_price, total_price)")
      .eq("id", orderId)
      .single();

    if (fetchError) {
      console.error("Fetch order error:", fetchError.message);
      return res.status(500).json({ success: false, message: "Order created but could not be loaded." });
    }

    return res.status(201).json({
      success: true,
      message: "Order created successfully.",
      data: order,
    });
  } catch (error) {
    console.error("Order error:", error.message);
    return res.status(500).json({ success: false, message: "An unexpected error occurred." });
  }
}

export async function getOrders(req, res) {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("id, order_number, order_type, status, total_amount, paid_amount, remaining_amount, payment_status, created_at, profiles(full_name, phone)")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error("Get orders error:", error.message);
      return res.status(500).json({ success: false, message: "Unable to fetch orders." });
    }

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully.",
      data,
    });
  } catch (error) {
    console.error("Order error:", error.message);
    return res.status(500).json({ success: false, message: "An unexpected error occurred." });
  }
}

export async function getOrderById(req, res) {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("orders")
      .select("*, profiles(full_name, phone, email), order_items(id, product_id, quantity, unit_price, total_price, products(name))")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      if (error.code === "22P02") {
        return res.status(400).json({ success: false, message: "Invalid order id." });
      }
      console.error("Get order error:", error.message);
      return res.status(500).json({ success: false, message: "Unable to fetch order." });
    }

    if (!data) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Order fetched successfully.",
      data,
    });
  } catch (error) {
    console.error("Order error:", error.message);
    return res.status(500).json({ success: false, message: "An unexpected error occurred." });
  }
}

export async function getMyOrders(req, res) {
  try {
    const customerId = req.profile.id;

    const { data, error } = await supabase
      .from("orders")
      .select("id, order_number, order_type, status, total_amount, paid_amount, payment_status, created_at, order_items(id, product_id, quantity, unit_price, total_price, products(name))")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Get my orders error:", error.message);
      return res.status(500).json({ success: false, message: "Unable to fetch orders." });
    }

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully.",
      data: data || [],
    });
  } catch (error) {
    console.error("My orders error:", error.message);
    return res.status(500).json({ success: false, message: "An unexpected error occurred." });
  }
}

export async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, payment_status, paid_amount } = req.body;

    const updates = {
      updated_at: new Date().toISOString(),
    };

    if (status !== undefined) updates.status = status;
    if (payment_status !== undefined) updates.payment_status = payment_status;
    if (paid_amount !== undefined) updates.paid_amount = Number(paid_amount);

    const { data, error } = await supabase
      .from("orders")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Update order error:", error.message);
      return res.status(500).json({ success: false, message: "Failed to update order status." });
    }

    return res.status(200).json({
      success: true,
      message: "Order updated successfully.",
      data,
    });
  } catch (error) {
    console.error("Update order error:", error.message);
    return res.status(500).json({ success: false, message: "An unexpected error occurred." });
  }
}