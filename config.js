/* ============================================
   牛牛老蘇補給站 — 後端設定
   --------------------------------------------
   填入你的 Supabase 專案資訊後，網站的文章就會
   改為存在 Supabase 資料庫（所有訪客同步看得到）。

   取得方式：Supabase 主控台 → Project Settings →
   API →「Project URL」與「anon public」金鑰。

   ⚠ anon key 是「公開」金鑰，放在前端是安全的。
     千萬不要把 service_role（服務端）金鑰放這裡！

   若這兩個欄位留空，網站會自動退回「本機儲存」模式
   （文章只存在你這台瀏覽器），方便你尚未設定時先使用。
   ============================================ */
window.NIU_CONFIG = {
  SUPABASE_URL: "",       // 例如：https://abcdefgh.supabase.co
  SUPABASE_ANON_KEY: "",  // 例如：eyJhbGciOiJIUzI1NiIsInR5cCI6...
  ADMIN_EMAIL: ""         // 後台管理者 email（登入畫面提示用，選填）
};
