# 後端設定指南（Supabase）

這個網站的文章原本存在瀏覽器裡（只有你自己看得到）。接上 Supabase 之後，
文章會存到雲端資料庫，**所有訪客都能同步看到**，後台也改成**真正的登入驗證**。

在你完成下面設定之前，網站會自動維持「本機模式」（跟現在一樣可正常使用），
所以不用擔心中途會壞掉。

---

## 步驟一：建立 Supabase 專案
1. 到 <https://supabase.com> 註冊並登入（免費方案即可）。
2. 點「New project」，取一個名字、設定資料庫密碼、選離你最近的區域。
3. 等專案建立完成（約 1～2 分鐘）。

## 步驟二：建立資料表與權限
1. 左側選單 → **SQL Editor** → New query。
2. 打開本專案的 `supabase-schema.sql`，把內容整段貼上。
3. **重要**：把檔案裡三處的 `admin@example.com` 改成你要用來登入後台的 email。
4. 按 **Run** 執行。

## 步驟三：建立後台管理者帳號
1. 左側選單 → **Authentication** → **Users** → **Add user**。
2. 填入跟步驟二相同的 email，以及一組密碼（這就是你之後登入後台用的帳密）。
3. （建議）Authentication → Providers → Email，關閉「Allow new users to sign up」，
   避免其他人自行註冊。

## 步驟四：把金鑰填進網站
1. 左側選單 → **Project Settings** → **API**。
2. 複製 **Project URL** 與 **anon public** 金鑰。
3. 打開本專案的 `config.js`，填入：
   ```js
   window.NIU_CONFIG = {
     SUPABASE_URL: "https://你的專案.supabase.co",
     SUPABASE_ANON_KEY: "貼上 anon public 金鑰",
     ADMIN_EMAIL: "你的後台email"
   };
   ```
   > anon key 是「公開」金鑰，放在前端是安全的。
   > **絕對不要**把 `service_role` 金鑰放進來。

## 步驟五：上線與匯入預設文章
1. 把改好的 `config.js` commit 並 push（GitHub Pages 會自動更新）。
2. 打開 `admin.html` → 用步驟三的 email／密碼登入。
3. 若列表是空的，按 **「匯入預設文章」** 把正向教養那篇寫進資料庫。
4. 之後就能在後台新增／編輯／刪除文章，所有訪客都會同步看到。

---

## 常見問題
- **登入後還是不能存文章？** 檢查 `supabase-schema.sql` 三處 email 是否都改成你的登入 email。
- **想換密碼？** 到 Supabase → Authentication → Users 修改。
- **想多一位管理者？** 在 Users 再新增一位，並把該 email 也加進 SQL 政策。
- **金鑰填錯或留空？** 網站會自動退回本機模式，不會壞掉，修好再 push 即可。
