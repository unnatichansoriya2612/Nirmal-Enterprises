import supabase from "../config/supabase.js";
import supabaseAuth from "../config/supabaseAuth.js";

export async function requireAuth(req, res, next) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const token = authorization.slice(7);

    const {
      data: { user },
      error: authError,
    } = await supabaseAuth.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired login session.",
      });
    }

    const { data: profile, error: profileError } =
      await supabase
        .from("profiles")
        .select("id, full_name, email, phone, address, role")
        .eq("id", user.id)
        .maybeSingle();

    if (profileError) {
      console.error(
        "Profile lookup failed:",
        profileError.message
      );

      return res.status(500).json({
        success: false,
        message: "Unable to verify account permissions.",
      });
    }

    if (!profile) {
      return res.status(403).json({
        success: false,
        message: "No profile exists for this account.",
      });
    }

    req.user = user;
    req.profile = profile;

    return next();
  } catch (error) {
    console.error("Authentication error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Authentication failed unexpectedly.",
    });
  }
}

export function requireAdmin(req, res, next) {
  if (!req.profile || req.profile.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin permission required.",
    });
  }

  return next();
}

export async function optionalAuth(req, res, next) {
  try {
    const authorization = req.headers.authorization;
    if (!authorization?.startsWith("Bearer ")) {
      return next();
    }

    const token = authorization.slice(7);
    const { data: { user } } = await supabaseAuth.auth.getUser(token);

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, full_name, email, phone, address, role")
        .eq("id", user.id)
        .maybeSingle();

      if (profile) {
        req.user = user;
        req.profile = profile;
      }
    }

    return next();
  } catch {
    return next();
  }
}
