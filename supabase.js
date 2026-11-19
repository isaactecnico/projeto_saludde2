
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://zkeycfvqegqhvhyrckyb.supabase.co";
const SUPABASE_KEY = "sb_publishable_9fidhr9SBKU4lqiJr3ph-A_D5WWA2XL";

export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
