import supabase from "../config/supabase.js";

export async function getInventory(req, res) {
  try {
    const { data, error } = await supabase
      .from("inventory")
      .select(`
        id,
        product_id,
        current_stock,
        minimum_stock,
        updated_at,
        products (
          id,
          name,
          category,
          price,
          is_active
        )
      `)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Get inventory error:", error.message);

      return res.status(500).json({
        success: false,
        message: "Unable to fetch inventory.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Inventory fetched successfully.",
      data,
    });
  } catch (error) {
    console.error("Inventory error:", error.message);

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
    });
  }
}
export async function updateInventory(req, res) {
  try {
    const { id } = req.params;
    const { current_stock, minimum_stock } = req.body;

    const updates = {};

    if (current_stock !== undefined) {
      if (!Number.isInteger(current_stock) || current_stock < 0) {
        return res.status(400).json({
          success: false,
          message: "current_stock must be a whole number, 0 or more.",
        });
      }
      updates.current_stock = current_stock;
    }

    if (minimum_stock !== undefined) {
      if (!Number.isInteger(minimum_stock) || minimum_stock < 0) {
        return res.status(400).json({
          success: false,
          message: "minimum_stock must be a whole number, 0 or more.",
        });
      }
      updates.minimum_stock = minimum_stock;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Send current_stock and/or minimum_stock to update.",
      });
    }

    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("inventory")
      .update(updates)
      .eq("id", id)
      .select("id, product_id, current_stock, minimum_stock, updated_at")
      .maybeSingle();

    if (error) {
      if (error.code === "22P02") {
        return res.status(400).json({
          success: false,
          message: "Invalid inventory id.",
        });
      }

      console.error("Update inventory error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Unable to update inventory.",
      });
    }

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Inventory record not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Inventory updated successfully.",
      data,
    });
  } catch (error) {
    console.error("Inventory error:", error.message);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
    });
  }
}

export async function createInventory(req, res) {
  try {
    const { product_id, current_stock, minimum_stock = 0 } = req.body;

    if (!product_id) {
      return res.status(400).json({
        success: false,
        message: "product_id is required.",
      });
    }

    if (!Number.isInteger(current_stock) || current_stock < 0) {
      return res.status(400).json({
        success: false,
        message: "current_stock must be a whole number, 0 or more.",
      });
    }

    if (!Number.isInteger(minimum_stock) || minimum_stock < 0) {
      return res.status(400).json({
        success: false,
        message: "minimum_stock must be a whole number, 0 or more.",
      });
    }

    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id")
      .eq("id", product_id)
      .maybeSingle();

    if (productError) {
      console.error("Product lookup error:", productError.message);
      return res.status(400).json({
        success: false,
        message: "Invalid product_id.",
      });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const { data, error } = await supabase
      .from("inventory")
      .insert({ product_id, current_stock, minimum_stock })
      .select("id, product_id, current_stock, minimum_stock, updated_at")
      .single();

    if (error) {
      if (error.code === "23505") {
        return res.status(409).json({
          success: false,
          message: "Inventory already exists for this product.",
        });
      }

      console.error("Create inventory error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Unable to create inventory.",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Inventory created successfully.",
      data,
    });
  } catch (error) {
    console.error("Inventory error:", error.message);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
    });
  }
}