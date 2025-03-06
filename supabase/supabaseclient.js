import { createClient } from "@supabase/supabase-js";


const SUPABASE_URL="https://mdvzprmkzksgeqzlatfw.supabase.co";
const SUPABASE_ANNON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kdnpwcm1remtzZ2VxemxhdGZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk2MzQ1MjMsImV4cCI6MjA1NTIxMDUyM30.ATTyi0KdguuKI7C9krGrQfeS8DkuOZWtjx_Ki2ObaBM"


const supabase=createClient(SUPABASE_URL,SUPABASE_ANNON_KEY);

export default supabase;