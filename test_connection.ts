// Test Supabase Connection
// Run this with: npx tsx test_connection.ts

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xdecako.supabase.co';
const supabaseKey = 'sb_publishable_UmAag0GJGmffqvCRILpXNA_7bc7Cvtf';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔍 Testing Supabase connection...\n');

  // Test 1: Check admins
  console.log('1️⃣ Testing admins table...');
  const { data: admins, error: adminError } = await supabase
    .from('admins')
    .select('username, display_name, role')
    .limit(5);
  
  if (adminError) {
    console.error('❌ Admin query failed:', adminError.message);
  } else {
    console.log('✅ Admins found:', admins?.length);
    console.log(admins);
  }

  // Test 2: Check players
  console.log('\n2️⃣ Testing players table...');
  const { data: players, error: playerError } = await supabase
    .from('players')
    .select('nickname, current_mmr')
    .limit(5);
  
  if (playerError) {
    console.error('❌ Player query failed:', playerError.message);
  } else {
    console.log('✅ Players found:', players?.length);
    console.log(players);
  }

  // Test 3: Check auctions
  console.log('\n3️⃣ Testing auctions table...');
  const { data: auctions, error: auctionError } = await supabase
    .from('auctions')
    .select('name, status, season')
    .limit(5);
  
  if (auctionError) {
    console.error('❌ Auction query failed:', auctionError.message);
  } else {
    console.log('✅ Auctions found:', auctions?.length);
    console.log(auctions);
  }

  // Test 4: Check captains
  console.log('\n4️⃣ Testing captains table...');
  const { data: captains, error: captainError } = await supabase
    .from('captains')
    .select('player_nickname, team_name, budget')
    .limit(5);
  
  if (captainError) {
    console.error('❌ Captain query failed:', captainError.message);
  } else {
    console.log('✅ Captains found:', captains?.length);
    console.log(captains);
  }

  console.log('\n✨ Connection test complete!');
}

testConnection();
