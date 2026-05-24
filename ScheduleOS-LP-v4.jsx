import { useState, useEffect, useRef } from "react";

const PURCHASE_URL = "#purchase";

function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function FadeIn({ children, delay = 0 }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(20px)",
      transition: `opacity .6s ease ${delay}s, transform .6s ease ${delay}s`
    }}>{children}</div>
  );
}

function Tag({ color, children }) {
  const colors = {
    green:  { bg: "#d1fae5", text: "#065f46", border: "#6ee7b7" },
    red:    { bg: "#fee2e2", text: "#9b2226", border: "#fca5a5" },
    blue:   { bg: "#dbeafe", text: "#1d4ed8", border: "#93c5fd" },
    purple: { bg: "#ede9fe", text: "#6d28d9", border: "#c4b5fd" },
    yellow: { bg: "#fef3c7", text: "#92400e", border: "#fcd34d" },
    gray:   { bg: "#f1f5f9", text: "#374151", border: "#cbd5e1" },
    pink:   { bg: "#fce7f3", text: "#9d174d", border: "#f9a8d4" },
  };
  const c = colors[color] || colors.gray;
  return (
    <span style={{ display: "inline-block", background: c.bg, color: c.text, border: `1px solid ${c.border}`, borderRadius: 5, padding: "2px 8px", fontSize: 11, fontWeight: 600, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
      {children}
    </span>
  );
}

// ===== 付箋イメージ説明図 =====
function StickyNoteExplainer() {
  const notes = [
    { col: "📋 スケジュール", color: "#d1fae5", border: "#6ee7b7", text: "#065f46", items: ["打ち合わせ14時〜", "在宅勤務", "有給休暇"] },
    { col: "✅ TODO", color: "#dbeafe", border: "#93c5fd", text: "#1d4ed8", items: ["見積書を送る", "資料を印刷", "上司に確認"] },
    { col: "🎯 イベント", color: "#ede9fe", border: "#c4b5fd", text: "#6d28d9", items: ["決算発表", "子供の運動会", "健康診断"] },
    { col: "💡 アイデア", color: "#fef3c7", border: "#fcd34d", text: "#92400e", items: ["新商品の企画", "副業のネタ", "ブログ記事"] },
    { col: "📝 メモ", color: "#f1f5f9", border: "#cbd5e1", text: "#374151", items: ["先方の要望メモ", "数字の確認", "連絡先控え"] },
  ];
  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: "32px 24px", border: "1.5px solid #e2e5ea", boxShadow: "0 8px 32px rgba(0,0,0,.08)" }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#1a56db", marginBottom: 8 }}>年間スケジュールに「付箋」を貼るイメージ</div>
        <div style={{ fontSize: 12, color: "#9ca3af" }}>思いついた瞬間に書く → あとで整理できる</div>
      </div>
      {/* スプレッドシートの列イメージ */}
      <div style={{ overflowX: "auto" }}>
        <div style={{ display: "flex", gap: 8, minWidth: 640 }}>
          {/* 日付列 */}
          <div style={{ flexShrink: 0, width: 56 }}>
            <div style={{ background: "#1e293b", color: "#94a3b8", fontSize: 10, fontWeight: 700, padding: "8px 6px", textAlign: "center", borderRadius: "6px 6px 0 0", marginBottom: 2 }}>日付</div>
            {["4/1（月）","4/2（火）","4/3（水）","4/4（木）","4/5（金）","4/6（土）","4/7（日）"].map((d, i) => (
              <div key={i} style={{ fontSize: 10, color: i===5?"#1d4ed8":i===6?"#b91c1c":"#6b7280", fontWeight: i>=5?700:400, padding: "10px 4px", textAlign: "center", background: i===5?"#eff6ff":i===6?"#fff1f2":i%2?"#f9fafb":"#fff", borderBottom: "1px solid #f0f0f0", height: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>{d}</div>
            ))}
          </div>
          {/* 各カテゴリ列 */}
          {notes.map((col, ci) => (
            <div key={ci} style={{ flex: 1, minWidth: 100 }}>
              <div style={{ background: col.color, color: col.text, fontSize: 10, fontWeight: 700, padding: "8px 8px", textAlign: "center", borderRadius: "6px 6px 0 0", marginBottom: 2, border: `1px solid ${col.border}`, borderBottom: "none" }}>
                {col.col}
              </div>
              {[0,1,2,3,4,5,6].map((row) => {
                const item = ci === 0 && row === 0 ? col.items[0]
                  : ci === 1 && row === 1 ? col.items[0]
                  : ci === 0 && row === 2 ? col.items[1]
                  : ci === 2 && row === 2 ? col.items[0]
                  : ci === 1 && row === 3 ? col.items[1]
                  : ci === 3 && row === 3 ? col.items[0]
                  : ci === 0 && row === 4 ? col.items[2]
                  : ci === 4 && row === 4 ? col.items[0]
                  : ci === 2 && row === 6 ? col.items[2]
                  : null;
                return (
                  <div key={row} style={{ padding: "6px 6px", background: row===5?"#eff6ff":row===6?"#fff1f2":row%2?"#f9fafb":"#fff", borderBottom: "1px solid #f0f0f0", height: 44, display: "flex", alignItems: "center" }}>
                    {item && (
                      <span style={{ background: col.color, color: col.text, border: `1px solid ${col.border}`, borderRadius: 4, padding: "2px 6px", fontSize: 10, fontWeight: 600, lineHeight: 1.4, display: "inline-block" }}>
                        {item}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      {/* 矢印と説明 */}
      <div style={{ textAlign: "center", margin: "20px 0 4px" }}>
        <div style={{ fontSize: 24, color: "#1a56db" }}>↓</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#1a56db" }}>これがカレンダーと日付検索に自動反映される</div>
      </div>
    </div>
  );
}

// ===== 年間スケジュール実画面モック（共感できる内容）=====
function AnnualScheduleMock() {
  const rows = [
    { date: "4/28", dow: "火", sched: "出社", hr: null, todo: "Q1振り返りレポート提出", event: "部署MTG 15時〜", crop: "新商品企画 アイデア整理", sun: false, sat: false },
    { date: "4/29", dow: "水祝", sched: "休", hr: null, todo: null, event: "昭和の日", crop: null, sun: false, sat: false, hol: true },
    { date: "5/1", dow: "金", sched: "在宅", hr: null, todo: "見積書を3社に送る\nA社フォローアップ電話", event: null, crop: null },
    { date: "5/2", dow: "土", sat: true, sched: null, hr: null, todo: "副業：クライアント提案書", event: "子供の参観日", crop: null },
    { date: "5/3", dow: "日", sun: true, sched: null, hr: null, todo: null, event: "憲法記念日", crop: null },
    { date: "5/7", dow: "木", sched: "出社", hr: null, todo: "上半期予算の見直し\n採用面接の日程調整", event: "部長との1on1 10時", crop: "競合調査まとめる" },
    { date: "5/9", dow: "土", sat: true, sched: null, hr: null, todo: "確定申告の書類整理\n副業売上の計算", event: null, crop: null },
    { date: "5/12", dow: "火", sched: "在宅", hr: null, todo: "メンバーへのフィードバック\nプロジェクト進捗確認", event: "オンライン勉強会 20時〜", crop: "来月のキャンペーン案" },
    { date: "5/14", dow: "木", sched: "出社", hr: null, todo: "健康診断の予約\n保険見直しの相談", event: "取引先訪問 14時", crop: null },
    { date: "5/16", dow: "土", sat: true, sched: null, hr: null, todo: "資格試験の勉強 2時間\nジム", event: "家族でBBQ", crop: null },
  ];

  return (
    <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", border: "1px solid #e2e5ea", boxShadow: "0 16px 48px rgba(0,0,0,.1)" }}>
      <div style={{ background: "#f3f4f6", padding: "8px 14px", display: "flex", alignItems: "center", gap: 6, borderBottom: "1px solid #e2e5ea" }}>
        <div style={{ display: "flex", gap: 5 }}>{["#f87171","#fbbf24","#34d399"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}</div>
        <div style={{ flex: 1, background: "#e9ebee", borderRadius: 4, padding: "3px 10px", fontSize: 10, color: "#6b7280", margin: "0 10px" }}>🌾 年間スケジュール — 思いつきをそのまま書き込む</div>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10.5, minWidth: 700 }}>
          <thead>
            <tr style={{ background: "#1e293b" }}>
              {["年月 ▼","曜 ▼","日付 ▼","スケジュール ▼","TODO・タスク ▼","イベント ▼","アイデア・メモ ▼"].map((h, i) => (
                <th key={h} style={{ padding: "7px 10px", color: ["#94a3b8","#94a3b8","#94a3b8","#6ee7b7","#93c5fd","#c4b5fd","#fcd34d"][i], fontWeight: 600, textAlign: "left", whiteSpace: "nowrap", fontSize: 10 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} style={{ background: r.hol||r.sun ? "#fff1f2" : r.sat ? "#eff6ff" : i%2===0 ? "#fff" : "#f9fafb", borderBottom: "1px solid #f0f0f0" }}>
                <td style={{ padding: "5px 10px", color: "#059669", fontSize: 9 }}>2026年{r.date.split("/")[0]}月</td>
                <td style={{ padding: "5px 6px", textAlign: "center", color: r.sun||r.hol ? "#ef4444" : r.sat ? "#3b82f6" : "#6b7280", fontWeight: 700, fontSize: 10 }}>{r.dow}</td>
                <td style={{ padding: "5px 8px", color: r.sun||r.hol ? "#ef4444" : r.sat ? "#3b82f6" : "#374151", fontWeight: r.sun||r.sat||r.hol ? 700 : 500, whiteSpace: "nowrap", fontSize: 11 }}>{r.date}</td>
                <td style={{ padding: "4px 8px", verticalAlign: "top" }}>{r.sched && <Tag color="green">{r.sched}</Tag>}</td>
                <td style={{ padding: "4px 8px", maxWidth: 200, verticalAlign: "top" }}>{r.todo && <Tag color="blue">{r.todo}</Tag>}</td>
                <td style={{ padding: "4px 8px", verticalAlign: "top" }}>{r.event && <Tag color="purple">{r.event}</Tag>}</td>
                <td style={{ padding: "4px 8px", maxWidth: 140, verticalAlign: "top" }}>{r.crop && <Tag color="yellow">{r.crop}</Tag>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ padding: "6px 14px", background: "#f9fafb", borderTop: "1px solid #e2e5ea", fontSize: 9, color: "#6b7280" }}>
        💡 列ヘッダーの ▼ でフィルタリング　|　ここに書いた内容がカレンダー・日付検索に自動反映
      </div>
    </div>
  );
}

// ===== カレンダーモック =====
function CalendarMock() {
  const months = [
    {
      label: "2026年 4月", weeks: [
        [null,null,1,2,3,4,5],[6,7,8,9,10,11,12],[13,14,15,16,17,18,19],
        [20,21,22,23,24,25,26],[27,28,29,30,null,null,null],
      ],
      events: { 29:"昭和の日" },
      data: {
        1:"📋 新年度スタート\n✅ チーム目標設定",
        7:"🎯 部署キックオフ",
        14:"✅ Q1レポート提出",
        21:"📋 在宅\n✅ 予算見直し",
        28:"📋 出社\n🎯 部署MTG",
      }
    },
    {
      label: "2026年 5月", weeks: [
        [null,null,null,null,1,2,3],[4,5,6,7,8,9,10],
        [11,12,13,14,15,16,17],[18,19,20,21,22,23,24],[25,26,27,28,29,30,31],
      ],
      events: { 3:"憲法記念日",4:"みどりの日",5:"こどもの日",6:"振替休日" },
      data: {
        1:"📋 在宅\n✅ 見積書3社",
        2:"✅ 副業：提案書\n🎯 参観日",
        7:"📋 出社\n🎯 1on1 10時\n💡 競合調査",
        9:"✅ 確定申告",
        12:"📋 在宅\n🎯 勉強会 20時",
        14:"📋 出社\n🎯 取引先訪問",
        16:"🎯 家族BBQ\n✅ 資格勉強",
        22:"✅ 半期レビュー\n🎯 全社会議",
        29:"📋 出社\n✅ 月末処理",
      }
    },
    {
      label: "2026年 6月", weeks: [
        [1,2,3,4,5,6,7],[8,9,10,11,12,13,14],
        [15,16,17,18,19,20,21],[22,23,24,25,26,27,28],[29,30,null,null,null,null,null],
      ],
      events: {},
      data: {
        1:"✅ 上半期目標確認",
        5:"🎯 健康診断\n💡 新企画アイデア",
        12:"📋 在宅\n✅ 資格試験申込",
        19:"🎯 家族旅行計画\n💡 副業ネタ整理",
        26:"✅ 下半期計画",
      }
    }
  ];
  return (
    <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", border: "1px solid #e2e5ea", boxShadow: "0 16px 48px rgba(0,0,0,.1)" }}>
      <div style={{ background: "#f3f4f6", padding: "8px 14px", display: "flex", alignItems: "center", gap: 6, borderBottom: "1px solid #e2e5ea" }}>
        <div style={{ display: "flex", gap: 5 }}>{["#f87171","#fbbf24","#34d399"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}</div>
        <div style={{ flex: 1, background: "#e9ebee", borderRadius: 4, padding: "3px 10px", fontSize: 10, color: "#6b7280", margin: "0 10px" }}>📅 年間カレンダー（縦）— 年間スケジュールの内容が自動反映</div>
      </div>
      <div style={{ background: "#1a1a2e", padding: "8px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ background: "#374151", border: "1.5px solid #f59e0b", borderRadius: 5, padding: "3px 12px", fontSize: 11, color: "#fcd34d", fontWeight: 700 }}>📋 スケジュール ▼</div>
        <div style={{ fontSize: 9, color: "#6b7280" }}>チェックボックスで複数項目を同時表示</div>
      </div>
      <div style={{ maxHeight: 500, overflowY: "auto" }}>
        {months.map((month, mi) => (
          <div key={mi}>
            <div style={{ background: "#1e6b4a", color: "#fff", padding: "6px 12px", fontSize: 12, fontWeight: 700, position: "sticky", top: 0, zIndex: 5 }}>　{month.label}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", background: "#f3f4f6", borderBottom: "1px solid #e2e5ea" }}>
              {["月","火","水","木","金","土","日"].map((d, i) => (
                <div key={d} style={{ padding: "4px 2px", textAlign: "center", fontSize: 10, fontWeight: 700, color: i===5?"#1d4ed8":i===6?"#b91c1c":"#4b5563" }}>{d}</div>
              ))}
            </div>
            {month.weeks.map((week, wi) => (
              <div key={wi} style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)" }}>
                {week.map((day, di) => {
                  const isSat=di===5, isSun=di===6;
                  const isHol = day && month.events[day];
                  const hasData = day && month.data[day];
                  return (
                    <div key={di} style={{ borderRight:"1px solid #e2e5ea", borderBottom:"1px solid #e2e5ea", minHeight: hasData?72:40, background: !day?"#f9fafb":isHol||isSun?"#fff1f2":isSat?"#eff6ff":"#fff" }}>
                      {day && (<>
                        <div style={{ padding:"3px 5px", fontSize:10, fontWeight:(isSat||isSun||isHol)?700:400, color:isSat?"#1d4ed8":(isSun||isHol)?"#b91c1c":"#374151" }}>
                          {day}{isHol?` ${month.events[day].slice(0,4)}`:""}
                        </div>
                        {hasData && <div style={{ padding:"0 4px 4px", fontSize:8, color:"#374151", lineHeight:1.5, whiteSpace:"pre-line" }}>{month.data[day]}</div>}
                      </>)}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== 日付検索モック =====
function DateSearchMock() {
  return (
    <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", border: "1px solid #e2e5ea", boxShadow: "0 16px 48px rgba(0,0,0,.1)" }}>
      <div style={{ background: "#f3f4f6", padding: "8px 14px", display: "flex", alignItems: "center", gap: 6, borderBottom: "1px solid #e2e5ea" }}>
        <div style={{ display: "flex", gap: 5 }}>{["#f87171","#fbbf24","#34d399"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}</div>
        <div style={{ flex: 1, background: "#e9ebee", borderRadius: 4, padding: "3px 10px", fontSize: 10, color: "#6b7280", margin: "0 10px" }}>🔍 日付検索 — 日付を入れるだけで全情報を一発表示</div>
      </div>
      <div style={{ padding: "16px" }}>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, color: "#fff", background: "#1e6b4a", borderRadius: "6px 6px 0 0", padding: "5px 12px", fontWeight: 700 }}>🗓 検索する日付</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "#fffbeb", border: "2px solid #f59e0b", borderTop: "none", borderRadius: "0 0 6px 6px" }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: "#1a1a2e" }}>2026/5/7</span>
            <span style={{ fontSize: 10, color: "#9ca3af" }}>← ここに日付を入力（例: 2026/5/7）</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, marginBottom: 14, padding: "8px 12px", background: "#f8fafc", border: "1px solid #e2e5ea", borderRadius: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 700 }}>2026年5月7日（木）</span>
          <span style={{ fontSize: 11, color: "#374151", fontWeight: 600 }}>平日</span>
        </div>
        {[
          { label:"スケジュール", icon:"📋", val:"出社", color:"green", border:"#6ee7b7" },
          { label:"TODO・タスク", icon:"✅", val:"上半期予算の見直し\n採用面接の日程調整\nメンバーへの目標フィードバック", color:"blue", border:"#93c5fd" },
          { label:"イベント", icon:"🎯", val:"部長との1on1 10時〜\n（準備：先月の振り返りを整理しておく）", color:"purple", border:"#c4b5fd" },
          { label:"アイデア・メモ", icon:"💡", val:"競合他社の動向まとめる\n→ 来週の戦略会議に活かす", color:"yellow", border:"#fcd34d" },
          { label:"フリーメモ", icon:"📝", val:"（データなし）", color:null, border:"#e2e5ea" },
        ].map((item, i) => {
          const bgMap = { green:"#d1fae5", blue:"#dbeafe", purple:"#ede9fe", yellow:"#fef3c7" };
          const textMap = { green:"#065f46", blue:"#1d4ed8", purple:"#6d28d9", yellow:"#92400e" };
          return (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ padding: "4px 10px", fontSize: 10, fontWeight: 700, background: item.color ? bgMap[item.color] : "#f3f4f6", color: item.color ? textMap[item.color] : "#6b7280", borderRadius: "5px 5px 0 0" }}>
                {item.icon} {item.label}
              </div>
              <div style={{ padding: "8px 12px", fontSize: 11, color: item.color ? "#1f2937" : "#9ca3af", lineHeight: 1.7, background: "#fff", border: `1px solid ${item.border}`, borderTop: "none", borderRadius: "0 0 5px 5px", borderLeft: `3px solid ${item.border}`, whiteSpace: "pre-line" }}>
                {item.val}
              </div>
            </div>
          );
        })}
        <div style={{ fontSize: 9, color: "#9ca3af", fontStyle: "italic" }}>💡 日付を変えると全項目が自動で切り替わります</div>
      </div>
    </div>
  );
}

// ===== タイムラインモック =====
function TimelineMock() {
  const rows = [
    { time:"08:00", main:true,  plan:"メール確認・Slackチェック", actual:"メール確認 完了" },
    { time:"08:30", main:false, plan:"企画書の修正作業", actual:"企画書修正（思ったより時間かかった）" },
    { time:"09:00", main:true,  plan:"チームの朝会 30分", actual:"朝会 完了（32分）" },
    { time:"09:30", main:false, plan:"企画書の続き", actual:"上司から急ぎの依頼が入る" },
    { time:"10:00", main:true,  plan:"部長との1on1", actual:"1on1 完了　→来月の目標を修正" },
    { time:"10:30", main:false, plan:"", actual:"急ぎの依頼対応" },
    { time:"11:00", main:true,  plan:"見積書作成・送付", actual:"見積書作成 完了" },
    { time:"12:00", main:true,  plan:"昼休憩", actual:"昼休憩" },
    { time:"13:00", main:true,  plan:"採用面接の日程調整", actual:"面接日程調整 完了" },
    { time:"14:00", main:true,  plan:"取引先と電話", actual:"取引先 電話 完了" },
    { time:"15:00", main:true,  plan:"企画書 最終仕上げ", actual:"※午前の遅れを取り戻し 完了" },
    { time:"16:00", main:true,  plan:"メンバーへフィードバック", actual:"フィードバック 完了" },
    { time:"17:00", main:true,  plan:"明日の準備・退勤", actual:"退勤 17:30（少し残業）" },
  ];
  return (
    <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", border: "1px solid #e2e5ea", boxShadow: "0 16px 48px rgba(0,0,0,.1)" }}>
      <div style={{ background: "#f3f4f6", padding: "8px 14px", display: "flex", alignItems: "center", gap: 6, borderBottom: "1px solid #e2e5ea" }}>
        <div style={{ display: "flex", gap: 5 }}>{["#f87171","#fbbf24","#34d399"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}</div>
        <div style={{ flex: 1, background: "#e9ebee", borderRadius: 4, padding: "3px 10px", fontSize: 10, color: "#6b7280", margin: "0 10px" }}>⏱ 予定 vs 実績タイムライン — 今日のズレを可視化する</div>
      </div>
      <div style={{ background: "#1a1a2e", padding: "8px 14px", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 11 }}>🗓 2026/5/7（木）— 仕事の振り返り</span>
        <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b", borderRadius: 5, padding: "3px 12px", fontSize: 11, fontWeight: 700, color: "#1a1a2e" }}>30分刻み</div>
        <div style={{ fontSize: 9, color: "#9ca3af" }}>F1=年 H1=月で自動切替</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "64px 1fr 1fr 36px", background: "#f8fafc", borderBottom: "1px solid #e2e5ea" }}>
        <div style={{ padding: "5px 8px", fontSize: 9, fontWeight: 700, color: "#374151", textAlign: "center" }}>時間</div>
        <div style={{ padding: "5px 8px", fontSize: 9, fontWeight: 700, color: "#1d4ed8", borderLeft: "1px solid #e2e5ea" }}>📋 予定（朝に立てた計画）</div>
        <div style={{ padding: "5px 8px", fontSize: 9, fontWeight: 700, color: "#c2410c", borderLeft: "1px solid #e2e5ea" }}>✅ 実績（実際にやったこと）</div>
        <div style={{ padding: "5px 4px", fontSize: 9, fontWeight: 700, color: "#374151", textAlign: "center", borderLeft: "1px solid #e2e5ea" }}>完了</div>
      </div>
      <div style={{ maxHeight: 360, overflowY: "auto" }}>
        {rows.map((row, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "64px 1fr 1fr 36px", borderBottom: `1px solid ${row.main?"#bfdbfe":"#f5f5f5"}`, minHeight: row.main?42:30 }}>
            <div style={{ padding: "3px 6px", textAlign: "center", fontSize: 10, fontWeight: row.main?700:400, background: row.main?"#1e6b4a":"#f9fafb", color: row.main?"#fff":"#9ca3af", display: "flex", alignItems: "center", justifyContent: "center" }}>{row.time}</div>
            <div style={{ padding: "3px 8px", background: row.plan?"#eff6ff":"#fafeff", borderLeft: "3px solid #93c5fd", fontSize: 10, color: "#1e3a5f", display: "flex", alignItems: "center" }}>{row.plan}</div>
            <div style={{ padding: "3px 8px", background: row.actual?"#fff7ed":"#fffcfa", borderLeft: "3px solid #fca67a", fontSize: 10, color: "#7c2d12", display: "flex", alignItems: "center" }}>{row.actual}</div>
            <div style={{ fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", borderLeft: "1px solid #e2e5ea", color: "#059669" }}>{row.plan&&row.actual?"✓":""}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: "6px 14px", background: "#f9fafb", borderTop: "1px solid #e2e5ea", fontSize: 9, color: "#6b7280" }}>
        予定通りにいかない日も記録に残る。振り返りが習慣になる。　|　5分・10分・15分・30分・1時間刻み 5パターン
      </div>
    </div>
  );
}

// ===== NAV =====
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, background:scrolled?"rgba(255,255,255,.97)":"transparent", backdropFilter:scrolled?"blur(12px)":"none", borderBottom:scrolled?"1px solid #e8eaed":"none", transition:"all .3s", padding:"0 24px" }}>
      <div style={{ maxWidth:1080, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", height:64 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:30, height:30, background:"#1a56db", borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ color:"#fff", fontSize:15 }}>🗓</span>
          </div>
          <span style={{ fontFamily:"'Georgia',serif", fontWeight:700, fontSize:17, color:"#111" }}>Schedule<span style={{ color:"#1a56db" }}>OS</span></span>
        </div>
        <a href={PURCHASE_URL} style={{ background:"#1a56db", color:"#fff", padding:"10px 22px", borderRadius:8, fontSize:14, fontWeight:700, textDecoration:"none", transition:"all .2s" }}
          onMouseEnter={e=>e.currentTarget.style.background="#1648c4"}
          onMouseLeave={e=>e.currentTarget.style.background="#1a56db"}
        >¥1,500 で購入する</a>
      </div>
    </nav>
  );
}

// ===== HERO =====
function Hero() {
  return (
    <section style={{ minHeight:"100vh", display:"flex", alignItems:"center", background:"linear-gradient(160deg,#f8faff 0%,#eef2ff 60%,#f0f4ff 100%)", padding:"120px 24px 80px", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(26,86,219,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(26,86,219,.05) 1px,transparent 1px)", backgroundSize:"48px 48px", maskImage:"radial-gradient(ellipse 80% 70% at 50% 40%,black,transparent)" }} />
      <div style={{ maxWidth:1080, margin:"0 auto", position:"relative", zIndex:1, width:"100%" }}>
        <div style={{ maxWidth:620, marginBottom:56 }}>
          <div style={{ marginBottom:18 }}>
            <span style={{ display:"inline-block", background:"#e8eeff", color:"#1a56db", padding:"5px 14px", borderRadius:100, fontSize:12, fontWeight:700, border:"1px solid rgba(26,86,219,.2)" }}>
              Excel テンプレート — 買い切り ¥1,500
            </span>
          </div>
          <h1 style={{ fontFamily:"'Georgia','Noto Serif JP',serif", fontSize:"clamp(34px,6vw,64px)", fontWeight:700, lineHeight:1.1, color:"#0a0f1e", letterSpacing:"-1.5px", marginBottom:18 }}>
            思いつきを、<br /><span style={{ color:"#1a56db" }}>消さない。</span>
          </h1>
          <p style={{ fontSize:"clamp(15px,2vw,18px)", color:"#4b5563", lineHeight:1.8, marginBottom:12 }}>
            年間スケジュールに付箋を貼るように書くだけ。<br />それが自動でカレンダーと日付検索に反映される。
          </p>
          <p style={{ fontSize:15, color:"#6b7280", lineHeight:1.7, marginBottom:40, maxWidth:480 }}>
            タスク・予定・メモが一元管理できる <strong style={{ color:"#111" }}>Excel スケジュール OS</strong>。<br />サブスク不要。買い切りで、ずっと使える。
          </p>
          <div style={{ display:"flex", gap:14, flexWrap:"wrap", alignItems:"center" }}>
            <a href={PURCHASE_URL} style={{ display:"inline-flex", alignItems:"center", gap:8, background:"#1a56db", color:"#fff", padding:"16px 36px", borderRadius:10, fontSize:16, fontWeight:700, textDecoration:"none", boxShadow:"0 4px 20px rgba(26,86,219,.3)", transition:"all .2s" }}
              onMouseEnter={e=>{e.currentTarget.style.background="#1648c4";e.currentTarget.style.transform="translateY(-2px)";}}
              onMouseLeave={e=>{e.currentTarget.style.background="#1a56db";e.currentTarget.style.transform="none";}}
            >今すぐ購入する →</a>
            <div style={{ fontSize:13, color:"#9ca3af", lineHeight:1.8 }}>✓ 買い切り ¥1,500<br />✓ Google スプレッドシート対応</div>
          </div>
        </div>
        {/* ヒーロー：付箋説明図 */}
        <FadeIn delay={.1}>
          <StickyNoteExplainer />
        </FadeIn>
        {/* ↓年間スケジュール実画面 */}
        <div style={{ marginTop:40 }}>
          <FadeIn delay={.2}>
            <div style={{ textAlign:"center", marginBottom:16 }}>
              <span style={{ background:"#1a56db", color:"#fff", padding:"4px 16px", borderRadius:100, fontSize:12, fontWeight:700 }}>実際の入力画面はこちら ↓</span>
            </div>
            <AnnualScheduleMock />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// ===== 使い方 =====
function HowItWorks() {
  return (
    <section style={{ padding:"100px 24px", background:"linear-gradient(180deg,#f0f4ff,#fafbff)" }}>
      <div style={{ maxWidth:1080, margin:"0 auto" }}>
        <FadeIn>
          <div style={{ textAlign:"center", marginBottom:64 }}>
            <span style={{ fontSize:11, fontWeight:700, letterSpacing:2, color:"#1a56db", textTransform:"uppercase" }}>使い方</span>
            <h2 style={{ fontFamily:"'Georgia',serif", fontSize:"clamp(26px,4vw,42px)", fontWeight:700, color:"#0a0f1e", marginTop:10, letterSpacing:"-1px" }}>
              年間で置いて、<span style={{ color:"#1a56db" }}>日別で動かす。</span>
            </h2>
          </div>
        </FadeIn>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:24 }}>
          {[
            { step:"01", icon:"✍️", color:"#1a56db", title:"年間スケジュールに書く", desc:"思いついたタスク、予定、アイデアを年間スケジュールの該当日に書き込む。仕事でも家庭でも副業でも、何でも書いておける。" },
            { step:"02", icon:"🔗", color:"#0891b2", title:"カレンダーに自動反映", desc:"書いた内容は年間カレンダーに自動で表示される。チェックボックスで表示したい項目をON/OFF。日付検索でその日の全情報を確認。" },
            { step:"03", icon:"📊", color:"#7c3aed", title:"予定と実績を比較する", desc:"タイムラインシートで今日の予定と実際にやったことを時間軸で並べて記録。何がズレたか一目でわかり、翌日に活かせる。" },
          ].map((item, i) => (
            <FadeIn key={i} delay={i*.1}>
              <div style={{ background:"#fff", borderRadius:14, padding:"32px 24px", border:"1px solid #e9ecef", boxShadow:"0 4px 20px rgba(0,0,0,.05)", position:"relative" }}>
                <div style={{ position:"absolute", top:-12, left:24, background:item.color, color:"#fff", fontSize:10, fontWeight:800, padding:"3px 10px", borderRadius:100 }}>STEP {item.step}</div>
                <div style={{ fontSize:32, marginBottom:14, marginTop:8 }}>{item.icon}</div>
                <h3 style={{ fontSize:17, fontWeight:700, color:"#0a0f1e", marginBottom:10 }}>{item.title}</h3>
                <p style={{ fontSize:13, color:"#6b7280", lineHeight:1.8 }}>{item.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== 全シート紹介 =====
function ProductShowcase() {
  const [active, setActive] = useState(0);
  const sheets = [
    { tab:"📋 年間スケジュール", title:"思いついたことを付箋のように書き込む", desc:"365日分を1シートで管理。仕事・家庭・副業・学習…何でもここに書く。フィルターで月・曜日・カテゴリを絞り込める。ここへの入力がすべてのシートに自動反映される。", mock:<AnnualScheduleMock /> },
    { tab:"📅 年間カレンダー", title:"書いた内容がカレンダーに即反映", desc:"年間スケジュールに入力した内容がグリッドカレンダーに自動表示。チェックボックスで複数項目を同時表示。1ヶ月ずつ俯瞰しながら、全体の流れを把握できる。", mock:<CalendarMock /> },
    { tab:"🔍 日付検索", title:"日付を入れるだけで全情報を確認", desc:"見たい日付を入力するだけで、その日のスケジュール・タスク・イベント・メモをすべて一覧表示。「あの日何してたっけ？」が一瞬でわかる。", mock:<DateSearchMock /> },
    { tab:"⏱ 予定 vs 実績", title:"予定と実績を時間軸で比較する", desc:"朝に立てた予定と、実際にやったことを時間軸で並べて管理。予定通りにいかない日も、記録に残すことで振り返りが習慣になる。", mock:<TimelineMock /> },
  ];
  return (
    <section style={{ padding:"100px 24px", background:"#fff" }}>
      <div style={{ maxWidth:1080, margin:"0 auto" }}>
        <FadeIn>
          <div style={{ textAlign:"center", marginBottom:44 }}>
            <span style={{ fontSize:11, fontWeight:700, letterSpacing:2, color:"#1a56db", textTransform:"uppercase" }}>全シート紹介</span>
            <h2 style={{ fontFamily:"'Georgia',serif", fontSize:"clamp(26px,4vw,42px)", fontWeight:700, color:"#0a0f1e", marginTop:10, letterSpacing:"-1px" }}>
              実際の画面を、<span style={{ color:"#1a56db" }}>そのまま確認。</span>
            </h2>
          </div>
        </FadeIn>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", justifyContent:"center", marginBottom:28 }}>
          {sheets.map((s, i) => (
            <button key={i} onClick={()=>setActive(i)} style={{ padding:"9px 16px", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer", background:active===i?"#1a56db":"#f3f4f6", color:active===i?"#fff":"#4b5563", border:active===i?"none":"1px solid #e2e5ea", transition:"all .2s" }}>{s.tab}</button>
          ))}
        </div>
        <FadeIn>
          <div style={{ background:"#f0f6ff", borderRadius:10, padding:"14px 20px", marginBottom:24, border:"1px solid #bfdbfe" }}>
            <div style={{ fontSize:15, fontWeight:700, color:"#1e3a5f", marginBottom:4 }}>{sheets[active].title}</div>
            <p style={{ fontSize:13, color:"#4b5563", lineHeight:1.7, margin:0 }}>{sheets[active].desc}</p>
          </div>
        </FadeIn>
        {sheets[active].mock}
      </div>
    </section>
  );
}

// ===== こんな人に =====
function Target() {
  return (
    <section style={{ padding:"100px 24px", background:"#f8faff" }}>
      <div style={{ maxWidth:1080, margin:"0 auto" }}>
        <FadeIn>
          <div style={{ textAlign:"center", marginBottom:56 }}>
            <span style={{ fontSize:11, fontWeight:700, letterSpacing:2, color:"#1a56db", textTransform:"uppercase" }}>こんな方におすすめ</span>
            <h2 style={{ fontFamily:"'Georgia',serif", fontSize:"clamp(26px,4vw,42px)", fontWeight:700, color:"#0a0f1e", marginTop:10, letterSpacing:"-1px" }}>
              あなたのための、<span style={{ color:"#1a56db" }}>スケジュール OS。</span>
            </h2>
          </div>
        </FadeIn>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))", gap:12 }}>
          {[
            "仕事・家庭・副業のタスクが混在して管理しきれない方",
            "Googleカレンダーだけでは予定・タスクが整理しきれない方",
            "Notionやアプリを試したが複雑すぎて続かなかった方",
            "思いついたことをメモしても、あとで見返せない方",
            "年間の流れと毎日の行動をつなげたい管理職・リーダーの方",
            "副業・学習・プロジェクトを並行して管理している方",
            "Excelに慣れており、自分に合った使い方をしたい方",
            "月額課金のサブスクを増やしたくない方",
          ].map((t, i) => (
            <FadeIn key={i} delay={i*.04}>
              <div style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"16px 18px", borderRadius:10, border:"1px solid #e9ecef", background:"#fff", transition:"all .2s" }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="#bfdbfe";e.currentTarget.style.background="#f0f6ff";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="#e9ecef";e.currentTarget.style.background="#fff";}}
              >
                <div style={{ width:20, height:20, borderRadius:"50%", background:"#1a56db", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>
                  <span style={{ color:"#fff", fontSize:11, fontWeight:900 }}>✓</span>
                </div>
                <span style={{ fontSize:13.5, color:"#374151", lineHeight:1.6 }}>{t}</span>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== 料金 =====
function Pricing() {
  return (
    <section id="purchase" style={{ padding:"100px 24px", background:"linear-gradient(180deg,#f0f4ff,#e8eeff)" }}>
      <div style={{ maxWidth:560, margin:"0 auto" }}>
        <FadeIn>
          <div style={{ textAlign:"center", marginBottom:40 }}>
            <span style={{ fontSize:11, fontWeight:700, letterSpacing:2, color:"#1a56db", textTransform:"uppercase" }}>料金</span>
            <h2 style={{ fontFamily:"'Georgia',serif", fontSize:"clamp(26px,4vw,42px)", fontWeight:700, color:"#0a0f1e", marginTop:10, letterSpacing:"-1px" }}>
              シンプルな、<span style={{ color:"#1a56db" }}>買い切り。</span>
            </h2>
          </div>
        </FadeIn>
        <FadeIn delay={.1}>
          <div style={{ background:"#fff", borderRadius:20, padding:"40px 32px", border:"2px solid #1a56db", boxShadow:"0 16px 48px rgba(26,86,219,.14)" }}>
            <div style={{ textAlign:"center", marginBottom:28 }}>
              <div style={{ display:"inline-block", background:"#e8eeff", color:"#1a56db", fontSize:12, fontWeight:700, padding:"3px 14px", borderRadius:100, marginBottom:16 }}>🎉 買い切り — 追加料金なし</div>
              <div style={{ fontFamily:"'Georgia',serif", fontSize:68, fontWeight:700, color:"#0a0f1e", lineHeight:1 }}>
                <sup style={{ fontSize:26, verticalAlign:"top", marginTop:14, display:"inline-block" }}>¥</sup>1,500
              </div>
              <p style={{ color:"#9ca3af", fontSize:13, marginTop:8 }}>一度の購入で永久利用。更新料なし。</p>
            </div>
            <div style={{ marginBottom:28 }}>
              {[
                "年間カレンダー × 2種（縦型・2ヶ月横並び型）",
                "年間スケジュール一覧（365日・フィルター付き）",
                "日付検索シート",
                "予定 vs 実績タイムライン × 5パターン",
                "Google スプレッドシートで即使える",
                "スマホ・PC 両対応",
                "項目名カスタマイズ自由（カレンダーに即反映）",
                "買い切り・更新料なし・永久利用",
              ].map((item, i, arr) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 0", borderBottom:i<arr.length-1?"1px solid #f0f0f0":"none" }}>
                  <div style={{ width:18, height:18, borderRadius:"50%", background:"#d1fae5", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <span style={{ color:"#059669", fontSize:10, fontWeight:900 }}>✓</span>
                  </div>
                  <span style={{ fontSize:13, color:"#374151" }}>{item}</span>
                </div>
              ))}
            </div>
            <a href={PURCHASE_URL} style={{ display:"block", width:"100%", background:"#1a56db", color:"#fff", padding:"18px", borderRadius:10, fontSize:17, fontWeight:700, textDecoration:"none", textAlign:"center", boxShadow:"0 4px 20px rgba(26,86,219,.3)", transition:"all .2s" }}
              onMouseEnter={e=>{e.currentTarget.style.background="#1648c4";e.currentTarget.style.transform="translateY(-2px)";}}
              onMouseLeave={e=>{e.currentTarget.style.background="#1a56db";e.currentTarget.style.transform="none";}}
            >今すぐ購入する →</a>
            <p style={{ textAlign:"center", fontSize:11, color:"#9ca3af", marginTop:14 }}>購入後すぐにテンプレートリンクをお届けします。<br />デジタル商品のため、購入後の返金はお受けできません。</p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ===== FAQ =====
function FAQ() {
  const [open, setOpen] = useState(null);
  const items = [
    { q:"どうやって使い始めますか？", a:"購入後に届くリンクを開き、「ファイル → コピーを作成」でご自身のGoogleドライブにコピーするだけです。すぐに入力を始められます。" },
    { q:"ExcelとGoogleスプレッドシート、どちらで使えますか？", a:"両方で使えます。Googleスプレッドシートを推奨していますが、Excel（.xlsx形式）でもほぼ同様にご利用いただけます。" },
    { q:"スマホでも使えますか？", a:"はい。GoogleスプレッドシートアプリをiOS・Androidでインストールすれば、スマホからも快適に使えます。縦スクロールで全体が見えるレイアウト設計です。" },
    { q:"項目名は自由に変えられますか？", a:"はい。「年間スケジュール」シートのヘッダー（列名）を変えるだけで、カレンダーや日付検索にも自動で反映されます。自分の仕事や生活に合わせてカスタマイズできます。" },
    { q:"複数人で共有できますか？", a:"Googleスプレッドシートの共有機能を使えば、チームでの共同利用も可能です。" },
    { q:"購入後にサポートはありますか？", a:"お問い合わせフォームよりご連絡ください。使い方に関するご質問にお答えします。" },
  ];
  return (
    <section style={{ padding:"100px 24px", background:"#fff" }}>
      <div style={{ maxWidth:680, margin:"0 auto" }}>
        <FadeIn>
          <div style={{ textAlign:"center", marginBottom:56 }}>
            <span style={{ fontSize:11, fontWeight:700, letterSpacing:2, color:"#1a56db", textTransform:"uppercase" }}>よくある質問</span>
            <h2 style={{ fontFamily:"'Georgia',serif", fontSize:"clamp(26px,4vw,42px)", fontWeight:700, color:"#0a0f1e", marginTop:10, letterSpacing:"-1px" }}>FAQ</h2>
          </div>
        </FadeIn>
        {items.map((item, i) => (
          <FadeIn key={i} delay={i*.04}>
            <div style={{ borderBottom:"1px solid #f0f0f0" }}>
              <button onClick={()=>setOpen(open===i?null:i)} style={{ width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center", padding:"20px 0", background:"none", border:"none", cursor:"pointer", textAlign:"left" }}>
                <span style={{ fontSize:15, fontWeight:600, color:"#1f2937" }}>Q. {item.q}</span>
                <span style={{ fontSize:20, color:"#1a56db", transition:"transform .2s", transform:open===i?"rotate(45deg)":"none" }}>+</span>
              </button>
              {open===i && <div style={{ paddingBottom:18 }}><p style={{ fontSize:13.5, color:"#6b7280", lineHeight:1.8 }}>A. {item.a}</p></div>}
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section style={{ padding:"100px 24px", background:"#1a56db", textAlign:"center" }}>
      <FadeIn>
        <p style={{ fontSize:11, color:"rgba(255,255,255,.7)", letterSpacing:2, textTransform:"uppercase", marginBottom:16, fontWeight:700 }}>今すぐ始める</p>
        <h2 style={{ fontFamily:"'Georgia',serif", fontSize:"clamp(26px,5vw,48px)", fontWeight:700, color:"#fff", letterSpacing:"-1px", lineHeight:1.2, marginBottom:16 }}>
          頭の中を空ける、<br />Excel スケジュール OS。
        </h2>
        <p style={{ color:"rgba(255,255,255,.8)", fontSize:16, marginBottom:44, maxWidth:400, margin:"0 auto 44px" }}>
          サブスク不要。買い切り ¥1,500。<br />一度購入すれば、ずっと使える。
        </p>
        <a href={PURCHASE_URL} style={{ display:"inline-flex", alignItems:"center", gap:8, background:"#fff", color:"#1a56db", padding:"18px 44px", borderRadius:10, fontSize:17, fontWeight:700, textDecoration:"none", boxShadow:"0 8px 28px rgba(0,0,0,.2)", transition:"all .2s" }}
          onMouseEnter={e=>e.currentTarget.style.transform="translateY(-3px)"}
          onMouseLeave={e=>e.currentTarget.style.transform="none"}
        >¥1,500 で購入する →</a>
      </FadeIn>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ background:"#0a0f1e", padding:"36px 24px", textAlign:"center" }}>
      <div style={{ fontFamily:"'Georgia',serif", fontWeight:700, fontSize:17, color:"#fff", marginBottom:16 }}>Schedule<span style={{ color:"#1a56db" }}>OS</span></div>
      <div style={{ display:"flex", gap:20, justifyContent:"center", flexWrap:"wrap", marginBottom:16 }}>
        {["特定商取引法に基づく表記","プライバシーポリシー","お問い合わせ"].map(l => (
          <a key={l} href="#" style={{ color:"#6b7280", fontSize:12, textDecoration:"none" }}>{l}</a>
        ))}
      </div>
      <p style={{ color:"#374151", fontSize:11 }}>© 2026 ScheduleOS. All rights reserved.</p>
    </footer>
  );
}

export default function App() {
  return (
    <div style={{ fontFamily:"'Noto Sans JP','Hiragino Kaku Gothic ProN',sans-serif", overflowX:"hidden" }}>
      <Nav />
      <Hero />
      <HowItWorks />
      <ProductShowcase />
      <Target />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}
