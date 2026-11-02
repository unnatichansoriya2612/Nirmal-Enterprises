import supabase from "../config/supabase.js";
import supabaseAuth from "../config/supabaseAuth.js";

/**
 * Register a new customer
 * POST /api/auth/register
 */
export async function register(req, res) {
  try {
    const { name, full_name, email, mobile, phone, address, password } = req.body;

    const customerName = (full_name || name || "").trim();
    const customerPhone = (phone || mobile || "").trim();
    const customerAddress = (address || "").trim();
    const customerPassword = typeof password === "string" ? password : "";

    if (!customerName) {
      return res.status(400).json({
        success: false,
        message: "Full name is required.",
      });
    }

    if (!customerPassword || customerPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    // Determine email: if email is provided, use it. If not, construct one using phone number.
    let customerEmail = (email || "").trim().toLowerCase();
    if (!customerEmail) {
      if (!customerPhone) {
        return res.status(400).json({
          success: false,
          message: "Either email or a 10-digit mobile number is required.",
        });
      }
      customerEmail = `${customerPhone}@customer.nirmal.local`;
    }

    // Check if phone already registered in profiles
    if (customerPhone) {
      const { data: existingPhone } = await supabase
        .from("profiles")
        .select("id")
        .eq("phone", customerPhone)
        .maybeSingle();

      if (existingPhone) {
        return res.status(409).json({
          success: false,
          message: "An account with this mobile number already exists. Please login.",
        });
      }
    }

    // Check if email already registered in profiles
    const { data: existingEmail } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", customerEmail)
      .maybeSingle();

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists. Please login.",
      });
    }

    // Create auth user in Supabase with auto-confirmed email
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: customerEmail,
      password: customerPassword,
      email_confirm: true,
      user_metadata: {
        full_name: customerName,
        phone: customerPhone,
      },
    });

    if (authError || !authData?.user) {
      console.error("Supabase user creation failed:", authError?.message);
      return res.status(400).json({
        success: false,
        message: authError?.message || "Failed to create user account.",
      });
    }

    const userId = authData.user.id;

    // Upsert customer profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .upsert(
        {
          id: userId,
          full_name: customerName,
          email: customerEmail,
          phone: customerPhone || null,
          address: customerAddress || null,
          role: "customer",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      )
      .select("id, full_name, email, phone, address, role")
      .single();

    if (profileError) {
      console.error("Profile creation failed:", profileError.message);
      return res.status(500).json({
        success: false,
        message: "Account was created, but profile setup failed.",
      });
    }

    // Automatically sign them in so they get an immediate session token
    const { data: sessionData } = await supabaseAuth.auth.signInWithPassword({
      email: customerEmail,
      password: customerPassword,
    });

    return res.status(201).json({
      success: true,
      message: "Customer account registered successfully.",
      data: {
        user: {
          id: profile.id,
          fullName: profile.full_name,
          email: profile.email,
          phone: profile.phone,
          address: profile.address,
          role: profile.role,
        },
        session: sessionData?.session
          ? {
              access_token: sessionData.session.access_token,
              refresh_token: sessionData.session.refresh_token,
              expires_at: sessionData.session.expires_at,
              token_type: sessionData.session.token_type,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Register error:", error.message);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred during registration.",
    });
  }
}

/**
 * Login (supports both Email and Mobile Number)
 * POST /api/auth/login
 */
export async function login(req, res) {
  try {
    const rawIdentifier =
      typeof req.body.email === "string"
        ? req.body.email.trim()
        : typeof req.body.mobile === "string"
        ? req.body.mobile.trim()
        : typeof req.body.phone === "string"
        ? req.body.phone.trim()
        : "";

    const password =
      typeof req.body.password === "string"
        ? req.body.password
        : "";

    if (!rawIdentifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Email or mobile number, and password are required.",
      });
    }

    let targetEmail = rawIdentifier;

    // If identifier is a phone number (e.g. 10 digits without '@')
    if (!rawIdentifier.includes("@")) {
      const { data: profileByPhone } = await supabase
        .from("profiles")
        .select("email")
        .eq("phone", rawIdentifier)
        .maybeSingle();

      if (profileByPhone?.email) {
        targetEmail = profileByPhone.email;
      } else {
        targetEmail = `${rawIdentifier}@customer.nirmal.local`;
      }
    }

    // Ask Supabase Auth to verify credentials
    const { data, error } = await supabaseAuth.auth.signInWithPassword({
      email: targetEmail,
      password,
    });

    if (error || !data.user || !data.session) {
      return res.status(401).json({
        success: false,
        message: "Invalid login credentials. Please check your email/mobile and password.",
      });
    }

    // Load profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, full_name, email, phone, address, role")
      .eq("id", data.user.id)
      .maybeSingle();

    if (profileError) {
      console.error("Login profile lookup failed:", profileError.message);
      return res.status(500).json({
        success: false,
        message: "Unable to load your account profile.",
      });
    }

    if (!profile) {
      return res.status(403).json({
        success: false,
        message: "Your login exists, but its profile is missing. Please contact the administrator.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      data: {
        user: {
          id: profile.id,
          fullName: profile.full_name,
          email: profile.email,
          phone: profile.phone,
          address: profile.address,
          role: profile.role,
        },
        session: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at,
          token_type: data.session.token_type,
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({
      success: false,
      message: "An unexpected login error occurred.",
    });
  }
}

/**
 * Get all registered customers (Admin only)
 * GET /api/auth/customers
 */
export async function getCustomers(req, res) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, email, phone, address, role, created_at")
      .eq("role", "customer")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Get customers error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Unable to fetch customers.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Customers fetched successfully.",
      data: data || [],
    });
  } catch (error) {
    console.error("Get customers error:", error.message);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while fetching customers.",
    });
  }
}

/**
 * Update Customer Profile
 * PATCH /api/auth/profile
 */
export async function updateProfile(req, res) {
  try {
    const userId = req.user.id;
    const { full_name, phone, address } = req.body;

    const updates = {
      updated_at: new Date().toISOString(),
    };

    if (full_name !== undefined) updates.full_name = full_name.trim();
    if (phone !== undefined) updates.phone = phone.trim();
    if (address !== undefined) updates.address = address.trim();

    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select("id, full_name, email, phone, address, role")
      .single();

    if (error) {
      console.error("Update profile error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Failed to update profile.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data,
    });
  } catch (error) {
    console.error("Update profile error:", error.message);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred updating your profile.",
    });
  }
}
