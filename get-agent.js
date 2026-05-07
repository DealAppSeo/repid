const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
db.from('repid_agents').select('id').limit(1).then(r => console.log(JSON.stringify(r.data)));
