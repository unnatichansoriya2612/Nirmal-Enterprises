import supabase from "../config/supabase.js";

const PRODUCT_FIELDS =
  "id, name, category, description, specifications, price, is_active, created_at, updated_at";

export async function getProducts(req, res) {
  try {
    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim()
        : "";

    const category =
      typeof req.query.category === "string"
        ? req.query.category.trim()
        : "";

    const limit = Number(req.query.limit ?? 20);
    const offset = Number(req.query.offset ?? 0);

    if (
      !Number.isInteger(limit) ||
      limit < 1 ||
      limit > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Limit must be between 1 and 100.",
      });
    }

    if (!Number.isInteger(offset) || offset < 0) {
      return res.status(400).json({
        success: false,
        message: "Offset must be zero or greater.",
      });
    }

    let query = supabase
      .from("products")
      .select(PRODUCT_FIELDS, { count: "exact" })
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    if (category) {
      query = query.eq("category", category);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Get products error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Unable to retrieve products.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Products retrieved successfully.",
      data,
      pagination: {
        limit,
        offset,
        total: count ?? 0,
      },
    });
  } catch (error) {
    console.error("Get products error:", error.message);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
    });
  }
}

export async function getProductById(req, res) {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_FIELDS)
      .eq("id", id)
      .eq("is_active", true)
      .maybeSingle();

    if (error) {
      console.error("Get product detail error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Unable to retrieve this product.",
      });
    }

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product retrieved successfully.",
      data,
    });
  } catch (error) {
    console.error("Get product detail error:", error.message);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
    });
  }
}

export async function createProduct(req, res) {
  try {
    const {
      name,
      category,
      description = null,
      specifications = null,
      price,
    } = req.body ?? {};

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof category !== "string" ||
      !category.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Product name and category are required.",
      });
    }

    if (
      description !== null &&
      typeof description !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Description must be text.",
      });
    }

    if (
      specifications !== null &&
      typeof specifications !== "string" &&
      (typeof specifications !== "object" ||
        Array.isArray(specifications))
    ) {
      return res.status(400).json({
        success: false,
        message: "Specifications must be text or an object.",
      });
    }

    const parsedPrice = Number(price);

    if (
      price === undefined ||
      price === null ||
      price === "" ||
      !Number.isFinite(parsedPrice) ||
      parsedPrice < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Price must be a valid non-negative number.",
      });
    }

    const { data, error } = await supabase
      .from("products")
      .insert({
        name: name.trim(),
        category: category.trim(),
        description,
        specifications,
        price: parsedPrice,
        is_active: true,
      })
      .select(PRODUCT_FIELDS)
      .single();

    if (error) {
      console.error("Create product error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Unable to create product.",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Product created successfully.",
      data,
    });
  } catch (error) {
    console.error("Create product error:", error.message);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
    });
  }
}

export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const body = req.body ?? {};
    const updates = {};

    const allowedFields = [
      "name",
      "category",
      "description",
      "specifications",
      "price",
    ];

    const providedFields = allowedFields.filter(
      (field) =>
        Object.prototype.hasOwnProperty.call(body, field)
    );

    if (providedFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one product field to update.",
      });
    }

    for (const field of providedFields) {
      const value = body[field];

      if (field === "name" || field === "category") {
        if (typeof value !== "string" || !value.trim()) {
          return res.status(400).json({
            success: false,
            message: `${field} must be a non-empty string.`,
          });
        }

        updates[field] = value.trim();
      } else if (field === "description") {
        if (value !== null && typeof value !== "string") {
          return res.status(400).json({
            success: false,
            message: "Description must be text or null.",
          });
        }

        updates[field] = value;
      } else if (field === "specifications") {
        if (
          value !== null &&
          typeof value !== "string" &&
          (typeof value !== "object" || Array.isArray(value))
        ) {
          return res.status(400).json({
            success: false,
            message: "Specifications must be text, an object, or null.",
          });
        }

        updates[field] = value;
      } else if (field === "price") {
        const parsedPrice = Number(value);

        if (
          value === null ||
          value === "" ||
          !Number.isFinite(parsedPrice) ||
          parsedPrice < 0
        ) {
          return res.status(400).json({
            success: false,
            message: "Price must be a non-negative number.",
          });
        }

        updates.price = parsedPrice;
      }
    }

    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", id)
      .eq("is_active", true)
      .select(PRODUCT_FIELDS)
      .maybeSingle();

    if (error) {
      console.error("Update product error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Unable to update product.",
      });
    }

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Active product not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      data,
    });
  } catch (error) {
    console.error("Update product error:", error.message);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
    });
  }
}

export async function deactivateProduct(req, res) {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("products")
      .update({
        is_active: false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("is_active", true)
      .select("id, name, is_active, updated_at")
      .maybeSingle();

    if (error) {
      console.error("Deactivate product error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Unable to deactivate product.",
      });
    }

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Active product not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deactivated successfully.",
      data,
    });
  } catch (error) {
    console.error("Deactivate product error:", error.message);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
    });
  }
}
