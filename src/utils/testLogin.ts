/**
 * Test complete login flow
 */

import AuthService from '../services/auth';

export async function testLogin(nickname: string, password: string) {
  console.log(`🧪 Testing complete login flow for: ${nickname}`);
  console.log('='.repeat(50));

  try {
    console.log(`\n📝 Attempting login...`);
    console.log(`   Nickname: ${nickname}`);
    console.log(`   Password: ${password}`);

    const result = await AuthService.loginPlayer(nickname, password);

    console.log('\n📊 Login Result:');
    console.log('   Success:', result.success);
    
    if (result.success) {
      console.log('   ✅ LOGIN SUCCESSFUL!');
      console.log('   Player Data:', result.data);
      
      // Check session
      const session = AuthService.getCurrentPlayerSession();
      console.log('\n🔐 Session Created:');
      console.log('   Session exists:', !!session);
      if (session) {
        console.log('   Player ID:', session.playerId);
        console.log('   Nickname:', session.nickname);
        console.log('   Login Time:', session.loginTime);
      }
    } else {
      console.log('   ❌ LOGIN FAILED');
      console.log('   Error:', result.error);
    }

    console.log('\n' + '='.repeat(50));
    return result;
  } catch (error: any) {
    console.error('❌ Exception during login:', error);
    return { success: false, error: error.message };
  }
}

// Make available in browser console
if (typeof window !== 'undefined') {
  (window as any).testLogin = testLogin;
}

export default testLogin;
