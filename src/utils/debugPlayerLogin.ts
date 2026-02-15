/**
 * Debug utility to check player login issues
 */

import { supabase } from '../lib/supabase';

export async function debugPlayerLogin(nickname: string) {
  console.log(`🔍 Debugging login for: ${nickname}`);
  console.log('='.repeat(50));

  try {
    // Step 1: Check if player exists
    console.log('\n1️⃣ Checking if player exists...');
    const { data: player, error: playerError } = await supabase
      .from('players')
      .select('id, nickname')
      .ilike('nickname', nickname)
      .single();

    if (playerError || !player) {
      console.error('❌ Player not found in players table');
      console.error('Error:', playerError);
      return { success: false, error: 'Player not found' };
    }

    console.log('✅ Player found:');
    console.log('   - ID:', player.id);
    console.log('   - Nickname:', player.nickname);

    // Step 2: Check if password exists
    console.log('\n2️⃣ Checking if password exists...');
    const { data: passwordRecord, error: passwordError } = await supabase
      .from('user_passwords')
      .select('*')
      .eq('user_id', player.id)
      .single();

    if (passwordError || !passwordRecord) {
      console.error('❌ Password not found in user_passwords table');
      console.error('Error:', passwordError);
      console.log('\n💡 Solution: Run password migration again');
      return { success: false, error: 'Password not set' };
    }

    console.log('✅ Password record found:');
    console.log('   - User ID:', passwordRecord.user_id);
    console.log('   - User Type:', passwordRecord.user_type);
    console.log('   - Has Hash:', !!passwordRecord.password_hash);
    console.log('   - Created:', passwordRecord.created_at);
    console.log('   - Updated:', passwordRecord.updated_at);

    // Step 3: Test password verification
    console.log('\n3️⃣ Testing password verification...');
    const testPassword = 'Player123!';
    
    const { default: passwordService } = await import('../services/passwordService');
    const verification = await passwordService.verifyUserPassword(player.id, testPassword);

    if (verification.success) {
      console.log(`✅ Password "${testPassword}" is CORRECT!`);
    } else {
      console.error(`❌ Password "${testPassword}" is INCORRECT`);
      console.error('Error:', verification.error);
    }

    console.log('\n' + '='.repeat(50));
    console.log('🎯 Summary:');
    console.log(`   Player: ${player.nickname} (${player.id})`);
    console.log(`   Password Set: ${!!passwordRecord}`);
    console.log(`   Password Valid: ${verification.success}`);
    console.log('='.repeat(50));

    return {
      success: true,
      player,
      passwordRecord,
      passwordValid: verification.success
    };
  } catch (error: any) {
    console.error('❌ Error during debug:', error);
    return { success: false, error: error.message };
  }
}

// Make available in browser console
if (typeof window !== 'undefined') {
  (window as any).debugPlayerLogin = debugPlayerLogin;
}

export default debugPlayerLogin;
