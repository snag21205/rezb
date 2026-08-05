/**
 * Script lấy JWT token từ Supabase để test API
 * Chạy: npx ts-node scripts/get-token.ts
 */
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Thiếu SUPABASE_URL hoặc SUPABASE_ANON_KEY trong .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ⚡ Điền email và password của test user vào đây
const EMAIL = 'test1@gmail.com'
const PASSWORD = 'test1231212'

async function getToken() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: EMAIL,
    password: PASSWORD,
  })

  if (error) {
    console.error('❌ Lỗi:', error.message)
    return
  }

  console.log('\n✅ Token lấy thành công!\n')
  console.log('='.repeat(60))
  console.log('ACCESS TOKEN (copy cái này vào Postman):')
  console.log('='.repeat(60))
  console.log(data.session?.access_token)
  console.log('='.repeat(60))
  console.log(`\nUser ID: ${data.user?.id}`)
  console.log(`Expires at: ${new Date((data.session?.expires_at ?? 0) * 1000).toLocaleString()}`)
}

getToken()
