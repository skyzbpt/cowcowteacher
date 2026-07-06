/* ============================================
   牛牛老蘇補給站 — 後台登入驗證
   ⚠ 注意：這是純前端（靜態網站）的簡易保護，
   密碼與驗證都在瀏覽器端執行，僅能擋住一般訪客，
   無法達到伺服器等級的安全性。請勿存放機密資料。
   ============================================ */

/* 後台密碼——請自行修改成你要的密碼 */
const NIU_ADMIN_PASSWORD = "mindy4400";

const NIU_AUTH_KEY = "niuniu_admin_auth";

function niuIsLoggedIn() {
  return sessionStorage.getItem(NIU_AUTH_KEY) === "1";
}

function niuLogin(pw) {
  if (pw === NIU_ADMIN_PASSWORD) {
    sessionStorage.setItem(NIU_AUTH_KEY, "1");
    return true;
  }
  return false;
}

function niuLogout() {
  sessionStorage.removeItem(NIU_AUTH_KEY);
  location.href = "admin.html";
}

/* 給受保護頁面（editor）呼叫：未登入就導回後台 */
function niuRequireAuth() {
  if (!niuIsLoggedIn()) {
    const next = encodeURIComponent(location.pathname.split("/").pop() + location.search);
    location.replace("admin.html?next=" + next);
  }
}
