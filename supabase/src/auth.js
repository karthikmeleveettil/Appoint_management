import { createClient } from "@supabase/supabase-js";

export const isAuthenticated = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return !!user; // Returns `true` if user exists
};


// Initialize Supabase client
const SUPABASE_URL="https://mdvzprmkzksgeqzlatfw.supabase.co";
const SUPABASE_ANNON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kdnpwcm1remtzZ2VxemxhdGZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk2MzQ1MjMsImV4cCI6MjA1NTIxMDUyM30.ATTyi0KdguuKI7C9krGrQfeS8DkuOZWtjx_Ki2ObaBM"


// Export only once
export const supabase = createClient(SUPABASE_URL,SUPABASE_ANNON_KEY);

// 🔹 Handle User Signup
export const handleSignup = async (fullName, email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { fullName } },
  });

  if (error) throw new Error(error.message);
  return data;
};

// 🔹 Handle User Login
export const handleLogin = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) throw new Error(error.message);
  return data;
};

// 🔹 Handle Logout
export const handleLogout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
};

// 🔹 Get Current User Session (Useful for checking if user is logged in)
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new Error(error.message);
  return data.session;
};
