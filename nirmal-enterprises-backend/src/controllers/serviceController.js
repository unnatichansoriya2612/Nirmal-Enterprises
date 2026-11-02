import supabase from "../config/supabase.js";

/**
 * 1. Book a new RO Service
 * POST /api/services
 * (Can be used by registered customers or guest users)
 */
export async function bookService(req, res) {
  try {
    const {
      customer_name,
      customer_phone,
      service_address,
      service_name,
      service_date,
      problem,
      notes,
      total_amount,
    } = req.body;

    // Basic Validation
    if (!customer_name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Customer name is required.",
      });
    }

    if (!customer_phone?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Customer phone number is required.",
      });
    }

    if (!service_address?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Service address is required.",
      });
    }

    if (!service_name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please select the service required (e.g. RO Servicing, Filter Replacement).",
      });
    }

    // Generate a human-readable ticket number (e.g. SRV-749281)
    const serviceNumber = "SRV-" + Math.floor(100000 + Math.random() * 900000);

    // If user is authenticated, attach their profile ID
    const customerId = req.profile?.id || null;

    const newBooking = {
      service_number: serviceNumber,
      customer_id: customerId,
      customer_name: customer_name.trim(),
      customer_phone: customer_phone.trim(),
      service_address: service_address.trim(),
      service_name: service_name.trim(),
      service_date: service_date || null,
      problem: problem?.trim() || "RO Service Request",
      notes: notes?.trim() || null,
      total_amount: Number(total_amount) || 0,
      paid_amount: 0,
      payment_status: "Unpaid",
      booking_status: "Pending",
      technician_name: null,
    };

    const { data, error } = await supabase
      .from("services")
      .insert(newBooking)
      .select()
      .single();

    if (error) {
      console.error("Booking creation error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Failed to save service booking.",
      });
    }

    return res.status(201).json({
      success: true,
      message: "RO service booked successfully!",
      data,
    });
  } catch (error) {
    console.error("Book service error:", error.message);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while booking the service.",
    });
  }
}

/**
 * 2. Get All Services (Admin only)
 * GET /api/services
 * Supports query filter: ?status=Pending or ?search=Sharma
 */
export async function getAllServices(req, res) {
  try {
    const { status, search } = req.query;

    let query = supabase
      .from("services")
      .select("*")
      .order("created_at", { ascending: false });

    if (status && status !== "All") {
      query = query.eq("booking_status", status);
    }

    if (search) {
      query = query.or(
        `customer_name.ilike.%${search}%,customer_phone.ilike.%${search}%,service_number.ilike.%${search}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error("Fetch all services error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch services.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Services fetched successfully.",
      count: data?.length || 0,
      data: data || [],
    });
  } catch (error) {
    console.error("Get all services error:", error.message);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred fetching services.",
    });
  }
}

/**
 * 3. Get My Services (Customer only)
 * GET /api/services/my-services
 */
export async function getMyServices(req, res) {
  try {
    const customerId = req.profile.id;
    const customerPhone = req.profile.phone;

    let query = supabase
      .from("services")
      .select("*")
      .order("created_at", { ascending: false });

    // Match either by customer_id OR by the customer's phone number
    if (customerPhone) {
      query = query.or(`customer_id.eq.${customerId},customer_phone.eq.${customerPhone}`);
    } else {
      query = query.eq("customer_id", customerId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Fetch my services error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch your service history.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Your service history fetched successfully.",
      data: data || [],
    });
  } catch (error) {
    console.error("Get my services error:", error.message);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
    });
  }
}

/**
 * 4. Update Service Ticket (Admin only)
 * PATCH /api/services/:id
 * Used to assign a technician, update status, record payment
 */
export async function updateService(req, res) {
  try {
    const { id } = req.params;
    const {
      booking_status,
      technician_name,
      payment_status,
      paid_amount,
      total_amount,
      notes,
      service_date,
    } = req.body;

    const updates = {
      updated_at: new Date().toISOString(),
    };

    if (booking_status !== undefined) updates.booking_status = booking_status;
    if (technician_name !== undefined) updates.technician_name = technician_name.trim();
    if (payment_status !== undefined) updates.payment_status = payment_status;
    if (paid_amount !== undefined) updates.paid_amount = Number(paid_amount);
    if (total_amount !== undefined) updates.total_amount = Number(total_amount);
    if (notes !== undefined) updates.notes = notes.trim();
    if (service_date !== undefined) updates.service_date = service_date;

    const { data, error } = await supabase
      .from("services")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Update service error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Failed to update service ticket.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Service ticket updated successfully.",
      data,
    });
  } catch (error) {
    console.error("Update service error:", error.message);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while updating the service.",
    });
  }
}
