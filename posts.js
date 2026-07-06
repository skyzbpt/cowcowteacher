/* ============================================
   牛牛老蘇補給站 — 文章資料層
   --------------------------------------------
   若 config.js 有填 Supabase 設定 → 文章存 Supabase
   （所有訪客同步看到）；否則退回 localStorage 本機模式。

   對外 API（皆為 async，請用 await）：
     niuGetPosts()      取得所有文章（新到舊）
     niuGetPost(id)     取得單篇
     niuSavePost(post)  新增或更新
     niuDeletePost(id)  刪除
     niuSeedDefault()   把預設文章寫入後端（限已登入管理者）
   ============================================ */

/* ---------- 後端偵測 ---------- */
function niuHasBackend() {
  return !!(window.NIU_CONFIG &&
            NIU_CONFIG.SUPABASE_URL &&
            NIU_CONFIG.SUPABASE_ANON_KEY &&
            window.supabase);
}

let _niuClient = null;
function niuGetClient() {
  if (!niuHasBackend()) return null;
  if (!_niuClient) {
    _niuClient = window.supabase.createClient(
      NIU_CONFIG.SUPABASE_URL,
      NIU_CONFIG.SUPABASE_ANON_KEY
    );
  }
  return _niuClient;
}

/* ---------- 預設文章（本機模式 / 匯入用） ---------- */
const NIU_DEFAULT_POSTS = [
  {
    id: "default-positive-parenting",
    emoji: "🌱",
    title: "什麼是正向教養？從「懲罰與溺愛之外」找到第三條路",
    date: "2026-07-06",
    excerpt: "孩子哭鬧、頂嘴、講不聽的時候，我們常在「兇一點」和「算了吧」之間拉扯。正向教養提供了第三條路：溫和而堅定。這篇文章帶你認識正向教養的核心觀念，以及三個今天就能開始練習的方法。",
    html: `
<p>「再不收玩具，我就把它全部丟掉！」<br>
「好啦好啦，媽媽幫你收，不要哭了。」</p>
<p>這兩句話，你是不是也覺得很熟悉？孩子鬧脾氣的時候，我們常常在「懲罰」和「溺愛」之間來回擺盪——兇完孩子後又自責，退讓之後又擔心把孩子寵壞。其實，教養不是只有這兩個選項。</p>

<h2>正向教養：溫和而堅定的第三條路</h2>
<p>正向教養（Positive Discipline）由美國教育學博士簡・尼爾森（Jane Nelsen）發展，理論基礎來自阿德勒心理學。它的核心只有一句話：</p>
<blockquote>對孩子溫和（Kind），對規範堅定（Firm）——兩者可以同時存在。</blockquote>
<p>溫和，代表尊重孩子的感受，理解行為背後的需求；堅定，代表界線清楚、說到做到。懲罰讓孩子因為「怕」而暫時聽話，正向教養則是讓孩子在被尊重的關係裡，長出自律與責任感。</p>

<h2>孩子的「不當行為」，其實是密碼</h2>
<p>阿德勒學派認為：一個行為不當的孩子，是一個失去信心的孩子。孩子打人、搗蛋、唱反調，往往不是「壞」，而是在用他唯一會的方式表達：</p>
<ul>
<li><strong>尋求關注</strong>：「看看我！我想要有存在感。」</li>
<li><strong>爭奪權力</strong>：「讓我自己決定，我想要有一點掌控感。」</li>
<li><strong>報復</strong>：「我受傷了，所以我也想讓你不好受。」</li>
<li><strong>自暴自棄</strong>：「反正我做不到，別再要求我了。」</li>
</ul>
<p>當我們讀懂行為背後的訊息，回應的方式就會完全不同——處理的不再是「症狀」，而是孩子真正的需求。這和我們看待孩子健康的方式一樣：不只看表面，而是找到根本原因。</p>

<h2>三個今天就能開始的練習</h2>

<h3>1. 先連結，再糾正</h3>
<p>孩子情緒上來的時候，大腦負責理智的部分是「斷線」的，講道理沒有用。先蹲下來、看著孩子的眼睛，說出他的感受：「你很生氣，因為積木倒了對不對？」等孩子平靜下來，再談剛剛發生的事。</p>

<h3>2. 給有限的選擇</h3>
<p>與其命令「快去刷牙！」，不如問：「你想先刷牙還是先換睡衣？」有限的選擇讓孩子擁有掌控感，也讓事情在你設定的界線內進行。權力之爭，往往就這樣化解了。</p>

<h3>3. 用「啟發式提問」代替說教</h3>
<p>把「你就是不小心才會打翻！」換成「打翻了，我們可以怎麼處理呢?」讓孩子自己想辦法、自己動手善後。錯誤是最好的學習機會——孩子從解決問題中長出能力，而不是從罪惡感中學會躲藏。</p>

<h2>寫在最後</h2>
<p>正向教養不是一套讓孩子「馬上聽話」的速效技巧，而是一種長期的相處姿態。改變需要時間，我們自己也會有做不好的時候——沒關係，跟孩子一樣，大人也是在錯誤中練習。</p>
<p>如果你在教養路上感到卡關，或發現孩子的情緒、睡眠、身體狀況彼此糾纏、找不到方向，歡迎<a href="https://calendar.app.google/aHmSeufa2iEQpDbY9" target="_blank" rel="noopener">預約 30 分鐘免費諮詢</a>，讓牛牛老蘇陪你一起，找到適合你們家的方法。</p>
`.trim()
  }
];

/* ============================================
   本機（localStorage）模式
   ============================================ */
const NIU_STORAGE_KEY = "niuniu_posts_v1";

function niuLocalStore() {
  try {
    return JSON.parse(localStorage.getItem(NIU_STORAGE_KEY)) || { posts: [], hidden: [], overrides: {} };
  } catch (e) {
    return { posts: [], hidden: [], overrides: {} };
  }
}
function niuLocalSaveStore(store) {
  localStorage.setItem(NIU_STORAGE_KEY, JSON.stringify(store));
}
function niuLocalGetPosts() {
  const store = niuLocalStore();
  const defaults = NIU_DEFAULT_POSTS
    .filter(p => !store.hidden.includes(p.id))
    .map(p => store.overrides[p.id] ? Object.assign({}, p, store.overrides[p.id]) : p);
  return defaults.concat(store.posts)
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));
}
function niuLocalGetPost(id) {
  return niuLocalGetPosts().find(p => p.id === id) || null;
}
function niuLocalSavePost(post) {
  const store = niuLocalStore();
  if (NIU_DEFAULT_POSTS.some(p => p.id === post.id)) {
    store.overrides[post.id] = post;
  } else {
    const idx = store.posts.findIndex(p => p.id === post.id);
    if (idx >= 0) store.posts[idx] = post;
    else store.posts.push(post);
  }
  niuLocalSaveStore(store);
}
function niuLocalDeletePost(id) {
  const store = niuLocalStore();
  if (NIU_DEFAULT_POSTS.some(p => p.id === id)) {
    if (!store.hidden.includes(id)) store.hidden.push(id);
    delete store.overrides[id];
  } else {
    store.posts = store.posts.filter(p => p.id !== id);
  }
  niuLocalSaveStore(store);
}

/* ============================================
   對外 API（自動選擇後端或本機）
   ============================================ */
async function niuGetPosts() {
  const c = niuGetClient();
  if (c) {
    try {
      const { data, error } = await c
        .from("posts")
        .select("id,emoji,title,html,excerpt,date")
        .order("date", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (e) {
      console.error("[牛牛] 讀取文章失敗，改用本機資料：", e.message || e);
      return niuLocalGetPosts();
    }
  }
  return niuLocalGetPosts();
}

async function niuGetPost(id) {
  const c = niuGetClient();
  if (c) {
    try {
      const { data, error } = await c.from("posts").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data || null;
    } catch (e) {
      console.error("[牛牛] 讀取文章失敗，改用本機資料：", e.message || e);
      return niuLocalGetPost(id);
    }
  }
  return niuLocalGetPost(id);
}

async function niuSavePost(post) {
  const c = niuGetClient();
  if (c) {
    const row = {
      id: post.id,
      emoji: post.emoji || "📝",
      title: post.title,
      html: post.html,
      excerpt: post.excerpt || "",
      date: post.date,
      updated_at: new Date().toISOString()
    };
    const { error } = await c.from("posts").upsert(row);
    if (error) throw error;
    return;
  }
  niuLocalSavePost(post);
}

async function niuDeletePost(id) {
  const c = niuGetClient();
  if (c) {
    const { error } = await c.from("posts").delete().eq("id", id);
    if (error) throw error;
    return;
  }
  niuLocalDeletePost(id);
}

/* 把預設文章寫入後端（限已登入的管理者，供後台「匯入」用） */
async function niuSeedDefault() {
  const c = niuGetClient();
  if (!c) return;
  const p = NIU_DEFAULT_POSTS[0];
  const { error } = await c.from("posts").upsert({
    id: p.id, emoji: p.emoji, title: p.title,
    html: p.html, excerpt: p.excerpt, date: p.date
  });
  if (error) throw error;
}

/* ---------- 工具 ---------- */
function niuMakeExcerpt(html, len) {
  const div = document.createElement("div");
  div.innerHTML = html;
  const text = (div.textContent || "").replace(/\s+/g, " ").trim();
  return text.length > len ? text.slice(0, len) + "…" : text;
}

function niuToday() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return d.getFullYear() + "-" + mm + "-" + dd;
}
