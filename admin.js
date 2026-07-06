/* ============================================
   牛牛老蘇補給站 — 後台登入驗證
   --------------------------------------------
   已接 Supabase → 用 Supabase Auth（伺服器端驗證，安全）。
   未接後端  → 退回本機密碼（僅前端檢查，方便未設定時使用）。
   ============================================ */

/* 未接後端時使用的本機密碼（接上 Supabase 後就不再使用） */
const NIU_ADMIN_PASSWORD = "mindy4400";
const NIU_AUTH_KEY = "niuniu_admin_auth";

/* 是否已登入（async） */
async function niuIsLoggedIn() {
  if (niuHasBackend()) {
    try {
      const c = niuGetClient();
      const { data } = await c.auth.getSession();
      return !!(data && data.session);
    } catch (e) {
      return false;
    }
  }
  return sessionStorage.getItem(NIU_AUTH_KEY) === "1";
}

/* 後端登入（email + 密碼） */
async function niuLoginBackend(email, password) {
  const c = niuGetClient();
  const { error } = await c.auth.signInWithPassword({ email: email, password: password });
  return !error ? { ok: true } : { ok: false, message: error.message };
}

/* 本機登入（僅密碼） */
function niuLoginLocal(pw) {
  if (pw === NIU_ADMIN_PASSWORD) {
    sessionStorage.setItem(NIU_AUTH_KEY, "1");
    return true;
  }
  return false;
}

/* 登出 */
async function niuLogout() {
  if (niuHasBackend()) {
    try { await niuGetClient().auth.signOut(); } catch (e) {}
  }
  sessionStorage.removeItem(NIU_AUTH_KEY);
  location.href = "admin.html";
}

/* 給受保護頁面（editor）呼叫：未登入就導回後台 */
async function niuRequireAuth() {
  if (!(await niuIsLoggedIn())) {
    const next = encodeURIComponent(location.pathname.split("/").pop() + location.search);
    location.replace("admin.html?next=" + next);
    return false;
  }
  return true;
}
