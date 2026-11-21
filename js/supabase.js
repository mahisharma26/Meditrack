/**
 * MediTrack – Supabase Cloud Authentication & Data Service
 * Supports Supabase Auth + PostgreSQL RLS when configured.
 * Seamlessly provides prototype-only fallback demo authentication when Supabase keys are not set.
 */

class SupabaseService {
  constructor() {
    this.client = null;
    this.url = null;
    this.anonKey = null;
    this.isDemoFallback = true;

    this.init();
  }

  init() {
    // 1. Try to read from environment or localStorage or config
    const storedConfig = this.getStoredConfig();
    this.url = storedConfig.url || (window.ENV && window.ENV.SUPABASE_URL) || (CONFIG && CONFIG.SUPABASE_URL) || '';
    this.anonKey = storedConfig.anonKey || (window.ENV && window.ENV.SUPABASE_ANON_KEY) || (CONFIG && CONFIG.SUPABASE_ANON_KEY) || '';

    // Check if valid URL (not placeholder)
    if (this.url && this.anonKey && !this.url.includes('your-project-id') && window.supabase) {
      try {
        this.client = window.supabase.createClient(this.url, this.anonKey, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
          }
        });
        this.isDemoFallback = false;
        console.log("MediTrack: Supabase Client initialized successfully!");
      } catch (e) {
        console.warn("Failed to initialize Supabase client, falling back to prototype auth:", e);
        this.isDemoFallback = true;
      }
    } else {
      this.isDemoFallback = true;
      console.log("MediTrack: Supabase credentials not set. Running in Prototype Demo Auth mode.");
    }
  }

  getStoredConfig() {
    try {
      const stored = localStorage.getItem('meditrack_supabase_config');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return {};
  }

  saveCustomConfig(url, anonKey) {
    try {
      localStorage.setItem('meditrack_supabase_config', JSON.stringify({ url, anonKey }));
      this.init();
      return true;
    } catch (e) {
      return false;
    }
  }

  isConfigured() {
    return !this.isDemoFallback && this.client !== null;
  }

  // Current session retrieval
  async getSession() {
    if (this.isConfigured()) {
      try {
        const { data, error } = await this.client.auth.getSession();
        if (error) throw error;
        if (data && data.session) {
          // Fetch profile
          const { data: profile } = await this.client
            .from('profiles')
            .select('*')
            .eq('id', data.session.user.id)
            .single();
          
          return {
            user: {
              id: data.session.user.id,
              email: data.session.user.email,
              name: profile ? profile.full_name : data.session.user.user_metadata?.full_name || 'User',
              role: profile ? profile.role : data.session.user.user_metadata?.role || 'patient'
            },
            isSupabase: true
          };
        }
      } catch (e) {
        console.warn("Supabase session check error:", e);
      }
    }

    // Prototype session fallback
    try {
      const demoSession = localStorage.getItem('meditrack_auth_session');
      if (demoSession) {
        return JSON.parse(demoSession);
      }
    } catch (e) {}

    return null;
  }

  // Sign in with Email and Password
  async signIn(email, password, roleHint = 'patient') {
    if (this.isConfigured()) {
      try {
        const { data, error } = await this.client.auth.signInWithPassword({
          email: email.trim(),
          password: password
        });

        if (error) throw error;

        // Fetch user profile from database
        let userRole = roleHint;
        let userName = email.split('@')[0];

        const { data: profile } = await this.client
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profile) {
          userRole = profile.role;
          userName = profile.full_name;
        }

        const sessionObj = {
          user: {
            id: data.user.id,
            email: data.user.email,
            name: userName,
            role: userRole
          },
          isSupabase: true,
          timestamp: new Date().toISOString()
        };

        localStorage.setItem('meditrack_auth_session', JSON.stringify(sessionObj));
        return { success: true, session: sessionObj };
      } catch (err) {
        return { success: false, error: err.message };
      }
    }

    // Prototype Demo Authentication Fallback
    return this.demoSignIn(email, password, roleHint);
  }

  // Demo Sign In
  demoSignIn(email, password, roleHint = 'patient') {
    const cleanEmail = email.toLowerCase().trim();
    let userObj = null;

    if (cleanEmail.includes('ramesh') || cleanEmail.includes('patient')) {
      userObj = {
        id: "pat-ramesh-01",
        email: email,
        name: "Ramesh Sharma",
        nameHindi: "रमेश शर्मा",
        role: "patient",
        age: 74,
        isDemo: true
      };
    } else if (cleanEmail.includes('priya') || cleanEmail.includes('guardian') || cleanEmail.includes('daughter')) {
      userObj = {
        id: "grd-priya-01",
        email: email,
        name: "Priya Sharma",
        nameHindi: "प्रिया शर्मा",
        role: "guardian",
        relationship: "Daughter",
        isDemo: true
      };
    } else if (cleanEmail.includes('admin') || cleanEmail.includes('doctor')) {
      userObj = {
        id: "adm-system-01",
        email: email,
        name: "Dr. Ananya Sen / Admin",
        nameHindi: "सिस्टम व्यवस्थापक",
        role: "admin",
        isDemo: true
      };
    } else {
      // General custom login
      userObj = {
        id: `usr-${Date.now()}`,
        email: email,
        name: email.split('@')[0],
        role: roleHint || 'patient',
        isDemo: true
      };
    }

    const sessionObj = {
      user: userObj,
      isSupabase: false,
      timestamp: new Date().toISOString()
    };

    localStorage.setItem('meditrack_auth_session', JSON.stringify(sessionObj));
    return { success: true, session: sessionObj };
  }

  // Sign up new account
  async signUp(email, password, metadata) {
    if (this.isConfigured()) {
      try {
        const { data, error } = await this.client.auth.signUp({
          email: email.trim(),
          password: password,
          options: {
            data: {
              full_name: metadata.fullName,
              role: metadata.role,
              phone: metadata.phone
            }
          }
        });

        if (error) throw error;

        // Create profile in profiles table
        if (data.user) {
          await this.client.from('profiles').insert({
            id: data.user.id,
            email: email,
            full_name: metadata.fullName,
            role: metadata.role,
            phone: metadata.phone,
            connection_code: metadata.role === 'patient' ? `MED-${Math.floor(1000 + Math.random() * 9000)}` : null
          });
        }

        return {
          success: true,
          message: "Account created! Please check your email for confirmation or sign in directly.",
          user: data.user
        };
      } catch (err) {
        return { success: false, error: err.message };
      }
    }

    // Prototype sign up
    const newDemoUser = {
      id: `usr-${Date.now()}`,
      email: email,
      name: metadata.fullName || email.split('@')[0],
      role: metadata.role || 'patient',
      phone: metadata.phone || '',
      isDemo: true
    };

    const sessionObj = {
      user: newDemoUser,
      isSupabase: false,
      timestamp: new Date().toISOString()
    };

    localStorage.setItem('meditrack_auth_session', JSON.stringify(sessionObj));
    return {
      success: true,
      message: "Account registered successfully (Prototype Mode).",
      session: sessionObj
    };
  }

  // Password Reset
  async resetPassword(email) {
    if (this.isConfigured()) {
      try {
        const { error } = await this.client.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: window.location.origin
        });
        if (error) throw error;
        return { success: true, message: `Password reset email sent to ${email}.` };
      } catch (err) {
        return { success: false, error: err.message };
      }
    }

    return {
      success: true,
      message: `Password reset instructions simulated for ${email} (Prototype Mode).`
    };
  }

  // Sign Out
  async signOut() {
    if (this.isConfigured()) {
      try {
        await this.client.auth.signOut();
      } catch (e) {
        console.warn("Supabase signOut error:", e);
      }
    }
    localStorage.removeItem('meditrack_auth_session');
    return true;
  }
}

const supabaseService = new SupabaseService();
window.supabaseService = supabaseService;
