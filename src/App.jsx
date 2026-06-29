import React, { useState, useRef, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
// jsPDF is intentionally NOT statically imported here. A static import bundles its ~360KB straight
// into the main app file, so the whole app (including people who never download anything that day)
// has to load and parse that extra weight before it even opens — that's the "feels a bit slow" you
// noticed. Loading it with import() below makes Vite split it into its own small file, served from
// your own domain (still no CDN, still no network race) and fetched once, right after the app opens.
var _sb=createClient("https://lthqbzpbldqthvgdwjrm.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0aHFienBibGRxdGh2Z2R3anJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4Njc2MjgsImV4cCI6MjA5MjQ0MzYyOH0.tai_EmQIPZBdHmyXfeYOlc3tThqc3CGBbSlzumaL1vE");

var h=React.createElement;

// Theme palettes — light is default. setTheme() swaps these in place.
var IND="#1E40AF",GRN="#059669",RED="#DC2626",AMB="#D97706",TEL="#0D9488",PUR="#7C3AED",SKY="#0EA5E9";
var THEMES={
  light:{GRY:"#64748B",BDR:"#E2E8F0",NVY:"#0F172A",SFT:"#F8FAFF",CARD:"#FFFFFF",PAGE:"#F1F5F9",MUTED:"#94A3B8",HOVER:"#F1F5FF",ACCENT:"#0F172A",ACCENT_FG:"#FFFFFF",ACCENT_SOFT:"#EEF2FF",
    INPUT_BG:"#F8FAFF",AUTH_BG:"#F1F5F9",AUTH_CARD:"#FFFFFF",AUTH_INPUT_BG:"#F8FAFF",AUTH_INPUT_BDR:"#E2E8F0",AUTH_INPUT_TEXT:"#0F172A",AUTH_LABEL:"#64748B",AUTH_TEXT:"#0F172A",AUTH_SUB:"#64748B",AUTH_LINK:"#0F172A",AUTH_BTN_BG:"#0F172A",AUTH_BTN_TEXT:"#FFFFFF",AUTH_OTP_BG:"#FFFFFF",AUTH_OTP_BDR:"#0F172A",AUTH_OTP_TEXT:"#0F172A",
    PILL_DANGER_BG:"#FEE2E2",PILL_DANGER_SOFT:"#FEF2F2",PILL_WARN_BG:"#FEF3C7",PILL_WARN_SOFT:"#FFFBEB",PILL_OK_BG:"#DCFCE7",PILL_INFO_BG:"#EEF2FF",PILL_SKY_BG:"#F0F9FF",
    CHIP_INFO:"#EEF2FF",CHIP_BORDER:"#C7D2FE",HEADER_BG:"#FFFFFF",DIVIDER:"#F1F5F9",
    SHADOW:"0 2px 8px rgba(15,23,42,.06)",SHADOW_LG:"0 8px 24px rgba(15,23,42,.10)",SHADOW_NAV:"0 -4px 14px rgba(15,23,42,.06)"},
  dark:{GRY:"#9a9a9a",BDR:"#403f3f",NVY:"#FFFFFF",SFT:"#2a2929",CARD:"#2e2d2d",PAGE:"#242323",MUTED:"#8a8a8a",HOVER:"#3a3939",ACCENT:"#FFFFFF",ACCENT_FG:"#1a1a1a",ACCENT_SOFT:"#3a3a3a",
    INPUT_BG:"#2a2929",AUTH_BG:"#242323",AUTH_CARD:"#2e2d2d",AUTH_INPUT_BG:"#2e2d2d",AUTH_INPUT_BDR:"#3a3939",AUTH_INPUT_TEXT:"#FFFFFF",AUTH_LABEL:"#8a8a8a",AUTH_TEXT:"#FFFFFF",AUTH_SUB:"#8a8a8a",AUTH_LINK:"#FFFFFF",AUTH_BTN_BG:"#FFFFFF",AUTH_BTN_TEXT:"#242323",AUTH_OTP_BG:"#2e2d2d",AUTH_OTP_BDR:"#FFFFFF",AUTH_OTP_TEXT:"#FFFFFF",
    PILL_DANGER_BG:"#3a2727",PILL_DANGER_SOFT:"#332626",PILL_WARN_BG:"#3a3322",PILL_WARN_SOFT:"#332e22",PILL_OK_BG:"#1f3328",PILL_INFO_BG:"#262838",PILL_SKY_BG:"#22323a",
    CHIP_INFO:"#262838",CHIP_BORDER:"#3a3a55",HEADER_BG:"#2e2d2d",DIVIDER:"#3a3939",
    SHADOW:"0 2px 8px rgba(0,0,0,.25)",SHADOW_LG:"0 8px 24px rgba(0,0,0,.40)",SHADOW_NAV:"0 -4px 14px rgba(0,0,0,.25)"}
};
// Active theme (mutable - swapped on toggle). Default to light.
var T=Object.assign({},THEMES.light);
var GRY=T.GRY,BDR=T.BDR,NVY=T.NVY,SFT=T.SFT,CARD=T.CARD,PAGE=T.PAGE;
var ACCENT=T.ACCENT,ACCENT_FG=T.ACCENT_FG,ACCENT_SOFT=T.ACCENT_SOFT;
function applyTheme(mode){
  var src=THEMES[mode]||THEMES.light;
  Object.keys(src).forEach(function(k){T[k]=src[k];});
  GRY=T.GRY;BDR=T.BDR;NVY=T.NVY;SFT=T.SFT;CARD=T.CARD;PAGE=T.PAGE;
  ACCENT=T.ACCENT;ACCENT_FG=T.ACCENT_FG;ACCENT_SOFT=T.ACCENT_SOFT;
  ATC.unmarked=GRY;
  try{localStorage.setItem("hr_theme",mode);}catch(e){}
}
var fmt=function(n){return "\u20B9"+Number(n||0).toLocaleString("en-IN");};
var MOS=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
// showT is a toast function that depends on React state (setToast) inside the App component.
// All the make*PDF generators below are top-level functions outside the component, so they
// can't see a component-local showT — this module-level binding gets pointed at the real
// implementation once App() renders (see "showT=function..." inside App), so every call site
// — inside or outside the component — keeps working unchanged.
var showT=function(msg,type){console.log("[toast before app ready]",msg);};
var DEPT_MAP={
  "IT / Software":["Engineering","Product","Design","QA / Testing","DevOps","HR","Sales","Finance","Operations","Marketing","Support"],
  "Institute / Education":["Teaching","Administration","Examination","Library","Sports","Hostel","Transport","Accounts","HR","IT Support","Security"],
  "Manufacturing":["Production","Quality Control","Maintenance","Engineering","Procurement","Stores / Warehouse","HR","Finance","Sales","Dispatch","Safety"],
  "Healthcare":["Doctor / Physician","Nursing","Pharmacy","Lab / Diagnostics","Radiology","Administration","Accounts","HR","Housekeeping","Security","Reception"],
  "Retail":["Sales Floor","Inventory / Store","Billing / Cashier","HR","Accounts","Marketing","Logistics","Security","Customer Service","Management"],
  "Finance":["Accounts","Audit","Compliance","Investment","Loans","HR","Operations","IT","Customer Service","Management"],
  "Logistics":["Operations","Fleet / Transport","Warehouse","Delivery","HR","Finance","Customer Service","IT","Safety","Management"],
  "NGO":["Program","Field Operations","Accounts","HR","Communications","Fundraising","IT","Admin","Research","Management"],
  "Other":["HR","Finance","Operations","Admin","Sales","Marketing","IT","Management","Support","Other"]
};
var ROLE_MAP={
  "IT / Software":["Software Engineer","Frontend Developer","Backend Developer","Full Stack Developer","Mobile Developer","QA Engineer","DevOps Engineer","Product Manager","UI/UX Designer","Data Analyst","Project Manager","Scrum Master","HR Executive","Sales Executive","Accounts Executive","Team Lead","Senior Engineer","Intern"],
  "Institute / Education":["Teacher / Lecturer","Professor","Principal","Vice Principal","HOD","Lab Assistant","Librarian","Peon / Attender","Sports Coach","Hostel Warden","Driver","Security Guard","Accountant","HR Executive","Admin Staff","Exam Controller","Counsellor"],
  "Manufacturing":["Production Worker","Machine Operator","Quality Inspector","Maintenance Engineer","Supervisor","Foreman","Store Keeper","Purchase Officer","Safety Officer","Production Manager","Plant Manager","Accountant","HR Executive","Driver","Security Guard","Peon"],
  "Healthcare":["Doctor","Nurse","Pharmacist","Lab Technician","Radiologist","Receptionist","Ward Boy","Housekeeping Staff","Security Guard","Accountant","HR Executive","Admin Officer","Ambulance Driver","Dietitian"],
  "Retail":["Sales Associate","Store Manager","Cashier","Inventory Manager","Visual Merchandiser","Security Guard","Delivery Executive","Customer Service Rep","HR Executive","Accountant","Area Manager","Store Keeper"],
  "Finance":["Accountant","Auditor","Loan Officer","Investment Analyst","Compliance Officer","Relationship Manager","HR Executive","IT Support","Customer Service","Branch Manager","Clerk","Peon"],
  "Logistics":["Delivery Executive","Driver","Warehouse Executive","Fleet Manager","Operations Executive","HR Executive","Accountant","Customer Service","Safety Officer","Branch Manager","Peon"],
  "NGO":["Program Officer","Field Worker","Accountant","HR Executive","Communications Officer","Fundraising Executive","Data Entry Operator","Research Analyst","Admin Staff","Peon"],
  "Other":["Manager","Executive","Supervisor","Associate","Officer","Assistant","Coordinator","Analyst","Specialist","Director","Intern","Other"]
};
function getDepts(orgType){return DEPT_MAP[orgType]||DEPT_MAP["Other"];}
function getRoles(orgType){return ROLE_MAP[orgType]||ROLE_MAP["Other"];}
var DEPTS=DEPT_MAP["IT / Software"];
var COLS=["#6366F1","#EC4899","#F59E0B","#10B981","#8B5CF6","#0D9488","#DC2626","#2563EB"];
var OT=["IT / Software","Institute / Education","Manufacturing","Healthcare","Retail","Finance","Logistics","NGO","Other"];
var ATC={present:GRN,absent:RED,half:AMB,paid:PUR,unpaid:IND,holiday:SKY,unmarked:GRY};
var ATL={present:"Present",absent:"Absent",half:"Half Day",paid:"Paid Leave",unpaid:"Unpaid Leave",holiday:"Holiday",unmarked:"Not Marked"};
var ATO=["present","absent","half","paid","unpaid","holiday","unmarked"];
var HO=["ID Card","Laptop","Access Card","Office Keys","Company Phone","Uniform","Documents","Other"];
function buildCSS(){return "*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;-webkit-tap-highlight-color:rgba(0,0,0,0)}html{-webkit-tap-highlight-color:transparent}button,a,div,span{-webkit-tap-highlight-color:transparent;outline:none}button:focus,div:focus,span:focus,a:focus{outline:none}::-webkit-scrollbar{width:0}@keyframes fU{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}@keyframes sU{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}@keyframes blinkBorder{0%,100%{border-color:#FCD34D;box-shadow:0 0 0 2px #FCD34D44}50%{border-color:#F59E0B;box-shadow:0 0 0 4px #F59E0B33}}@keyframes blinkBg{0%,100%{background:rgba(253,211,77,.12)}50%{background:rgba(253,211,77,.22)}}@keyframes ticker{0%{transform:translateX(0%)}100%{transform:translateX(-50%)}}@keyframes pulse{0%,100%{opacity:.5}50%{opacity:1}}@keyframes hrIconPulse{0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(255,255,255,.25)}50%{transform:scale(1.08);box-shadow:0 0 0 6px rgba(255,255,255,.08)}}@keyframes shineSweep{0%{transform:translateX(-120%) skewX(-18deg)}100%{transform:translateX(220%) skewX(-18deg)}}@keyframes iconFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}@keyframes iconSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}@keyframes zzzFloat{0%{opacity:0;transform:translateY(2px)}30%{opacity:1;transform:translateY(0)}70%{opacity:1;transform:translateY(-3px)}100%{opacity:0;transform:translateY(-7px)}}.fd{animation:fU .25s ease}.rh:hover{background:"+T.HOVER+"!important}input{color:"+T.NVY+"!important}textarea{color:"+T.NVY+"!important}select{background:"+T.CARD+";border:1.5px solid "+T.BDR+";border-radius:10px;padding:10px 12px;font-size:13px;color:"+T.NVY+";width:100%;font-family:inherit;outline:none;margin-bottom:10px}select option{background:"+T.CARD+";color:"+T.NVY+"}input::placeholder{color:"+T.MUTED+"}textarea::placeholder{color:"+T.MUTED+"}";}var CSS=buildCSS();
var SVG_ICONS={
"emoji_add":"<path d=\"M21 12a9 9 0 1 1-9-9c.9 0 1.77.13 2.59.37\"/><path d=\"M16 5h6\"/><path d=\"M19 2v6\"/><path d=\"M9 9h.01\"/><path d=\"M15 9h.01\"/><path d=\"M8.5 14a4 4 0 0 0 7 0\"/>",
"book":"<path d=\"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20\"/>",
"star":"<polygon points=\"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2\"/>",
"arrow_back":"<path d=\"m12 19-7-7 7-7\"/><path d=\"M19 12H5\"/>",
"calendar_today":"<rect width=\"18\" height=\"18\" x=\"3\" y=\"4\" rx=\"2\" ry=\"2\"/><line x1=\"16\" x2=\"16\" y1=\"2\" y2=\"6\"/><line x1=\"8\" x2=\"8\" y1=\"2\" y2=\"6\"/><line x1=\"3\" x2=\"21\" y1=\"10\" y2=\"10\"/>",
"cancel":"<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"m15 9-6 6\"/><path d=\"m9 9 6 6\"/>",
"chat_bubble":"<path d=\"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z\"/>",
"description":"<path d=\"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z\"/><path d=\"M14 2v4a2 2 0 0 0 2 2h4\"/><path d=\"M16 13H8\"/><path d=\"M16 17H8\"/><path d=\"M10 9H8\"/>",
"event_busy":"<rect width=\"18\" height=\"18\" x=\"3\" y=\"4\" rx=\"2\" ry=\"2\"/><line x1=\"16\" x2=\"16\" y1=\"2\" y2=\"6\"/><line x1=\"8\" x2=\"8\" y1=\"2\" y2=\"6\"/><line x1=\"3\" x2=\"21\" y1=\"10\" y2=\"10\"/><path d=\"m14 14-4 4\"/><path d=\"m10 14 4 4\"/>",
"event_note":"<rect width=\"18\" height=\"18\" x=\"3\" y=\"4\" rx=\"2\" ry=\"2\"/><line x1=\"16\" x2=\"16\" y1=\"2\" y2=\"6\"/><line x1=\"8\" x2=\"8\" y1=\"2\" y2=\"6\"/><line x1=\"3\" x2=\"21\" y1=\"10\" y2=\"10\"/><path d=\"M8 14h8\"/><path d=\"M8 18h5\"/>",
"help":"<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3\"/><path d=\"M12 17h.01\"/>",
"info":"<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M12 16v-4\"/><path d=\"M12 8h.01\"/>",
"manage_accounts":"<path d=\"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2\"/><circle cx=\"9\" cy=\"7\" r=\"4\"/><circle cx=\"19\" cy=\"11\" r=\"2\"/><path d=\"M19 8v1\"/><path d=\"M19 13v1\"/><path d=\"m21.6 9.5-.87.5\"/><path d=\"m17.27 12-.87.5\"/><path d=\"m21.6 12.5-.87-.5\"/><path d=\"m17.27 10-.87-.5\"/>",
"person":"<path d=\"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2\"/><circle cx=\"12\" cy=\"7\" r=\"4\"/>",
"receipt":"<path d=\"M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z\"/><path d=\"M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8\"/><path d=\"M12 17.5v-11\"/>",
"receipt_long":"<path d=\"M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z\"/><path d=\"M8 7h8\"/><path d=\"M8 11h8\"/><path d=\"M8 15h5\"/>",
"upload":"<path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\"/><polyline points=\"17 8 12 3 7 8\"/><line x1=\"12\" x2=\"12\" y1=\"3\" y2=\"15\"/>",
"upload_file":"<path d=\"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z\"/><path d=\"M14 2v4a2 2 0 0 0 2 2h4\"/><path d=\"M12 18v-6\"/><path d=\"m9 15 3-3 3 3\"/>",
"smartphone":"<rect width=\"14\" height=\"20\" x=\"5\" y=\"2\" rx=\"2\" ry=\"2\"/><path d=\"M12 18h.01\"/>",
"warning":"<path d=\"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z\"/><line x1=\"12\" x2=\"12\" y1=\"9\" y2=\"13\"/><line x1=\"12\" x2=\"12.01\" y1=\"17\" y2=\"17\"/>",
"clock":"<circle cx=\"12\" cy=\"12\" r=\"10\"/><polyline points=\"12 6 12 12 16 14\"/>",
"group":"<path d=\"M18 21a8 8 0 0 0-16 0\"/><circle cx=\"10\" cy=\"8\" r=\"5\"/><path d=\"M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3\"/>",
"groups":"<path d=\"M18 21a8 8 0 0 0-16 0\"/><circle cx=\"10\" cy=\"8\" r=\"5\"/><path d=\"M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3\"/>",
"how_to_reg":"<path d=\"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2\"/><circle cx=\"9\" cy=\"7\" r=\"4\"/><polyline points=\"16 11 18 13 22 9\"/>",
"check_circle":"<path d=\"M22 11.08V12a10 10 0 1 1-5.93-9.14\"/><polyline points=\"22 4 12 14.01 9 11.01\"/>",
"currency_rupee":"<path d=\"M6 3h12\"/><path d=\"M6 8h12\"/><path d=\"m6 13 8.5 8\"/><path d=\"M6 13h3\"/><path d=\"M9 13c6.667 0 6.667-10 0-10\"/>",
"trending_up":"<polyline points=\"22 7 13.5 15.5 8.5 10.5 2 17\"/><polyline points=\"16 7 22 7 22 13\"/>",
"calendar_month":"<rect width=\"18\" height=\"18\" x=\"3\" y=\"4\" rx=\"2\" ry=\"2\"/><line x1=\"16\" x2=\"16\" y1=\"2\" y2=\"6\"/><line x1=\"8\" x2=\"8\" y1=\"2\" y2=\"6\"/><line x1=\"3\" x2=\"21\" y1=\"10\" y2=\"10\"/>",
"download":"<path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\"/><polyline points=\"7 10 12 15 17 10\"/><line x1=\"12\" x2=\"12\" y1=\"15\" y2=\"3\"/>",
"chat":"<path d=\"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z\"/>",
"edit":"<path d=\"M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7\"/><path d=\"M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z\"/>",
"delete":"<path d=\"M3 6h18\"/><path d=\"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2\"/><line x1=\"10\" x2=\"10\" y1=\"11\" y2=\"17\"/><line x1=\"14\" x2=\"14\" y1=\"11\" y2=\"17\"/>",
"account_circle":"<circle cx=\"12\" cy=\"12\" r=\"10\"/><circle cx=\"12\" cy=\"10\" r=\"3\"/><path d=\"M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662\"/>",
"add":"<path d=\"M5 12h14\"/><path d=\"M12 5v14\"/>",
"chevron_right":"<path d=\"m9 18 6-6-6-6\"/>",
"lock":"<rect width=\"18\" height=\"11\" x=\"3\" y=\"11\" rx=\"2\" ry=\"2\"/><path d=\"M7 11V7a5 5 0 0 1 10 0v4\"/>",
"light_mode":"<circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 2v2\"/><path d=\"M12 20v2\"/><path d=\"m4.93 4.93 1.41 1.41\"/><path d=\"m17.66 17.66 1.41 1.41\"/><path d=\"M2 12h2\"/><path d=\"M20 12h2\"/><path d=\"m6.34 17.66-1.41 1.41\"/><path d=\"m19.07 4.93-1.41 1.41\"/>",
"dark_mode":"<path d=\"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z\"/>",
"dashboard":"<rect width=\"7\" height=\"9\" x=\"3\" y=\"3\" rx=\"1\"/><rect width=\"7\" height=\"5\" x=\"14\" y=\"3\" rx=\"1\"/><rect width=\"7\" height=\"9\" x=\"14\" y=\"12\" rx=\"1\"/><rect width=\"7\" height=\"5\" x=\"3\" y=\"16\" rx=\"1\"/>",
"settings":"<path d=\"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/>",
"payments":"<rect width=\"20\" height=\"14\" x=\"2\" y=\"5\" rx=\"2\"/><line x1=\"2\" x2=\"22\" y1=\"10\" y2=\"10\"/>",
"save":"<path d=\"M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z\"/><polyline points=\"17 21 17 13 7 13 7 21\"/><polyline points=\"7 3 7 8 15 8\"/>",
"search":"<circle cx=\"11\" cy=\"11\" r=\"8\"/><path d=\"m21 21-4.3-4.3\"/>",
"close":"<path d=\"M18 6 6 18\"/><path d=\"m6 6 12 12\"/>",
"notifications":"<path d=\"M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9\"/><path d=\"M10.3 21a1.94 1.94 0 0 0 3.4 0\"/>",
"cake":"<path d=\"M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8\"/><path d=\"M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1\"/><path d=\"M2 21h20\"/><path d=\"M7 8v3\"/><path d=\"M12 8v3\"/><path d=\"M17 8v3\"/><path d=\"M7 4h.01\"/><path d=\"M12 4h.01\"/><path d=\"M17 4h.01\"/>",
"workspace_premium":"<circle cx=\"12\" cy=\"8\" r=\"6\"/><path d=\"M15.477 12.89 17 22l-5-3-5 3 1.523-9.11\"/>",
"briefcase":"<rect width=\"20\" height=\"14\" x=\"2\" y=\"7\" rx=\"2\" ry=\"2\"/><path d=\"M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16\"/>",
"target":"<circle cx=\"12\" cy=\"12\" r=\"10\"/><circle cx=\"12\" cy=\"12\" r=\"6\"/><circle cx=\"12\" cy=\"12\" r=\"2\"/>",
"arrow_right":"<path d=\"M5 12h14\"/><path d=\"m12 5 7 7-7 7\"/>",
"delete_forever":"<path d=\"M3 6h18\"/><path d=\"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2\"/><line x1=\"10\" x2=\"10\" y1=\"11\" y2=\"17\"/><line x1=\"14\" x2=\"14\" y1=\"11\" y2=\"17\"/>",
"bolt":"<polygon points=\"13 2 3 14 12 14 11 22 21 10 12 10 13 2\"/>",
"pending_actions":"<rect width=\"8\" height=\"4\" x=\"8\" y=\"2\" rx=\"1\" ry=\"1\"/><path d=\"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2\"/><path d=\"m9 14 2 2 4-4\"/>",
"task_alt":"<path d=\"M22 11.08V12a10 10 0 1 1-5.93-9.14\"/><polyline points=\"22 4 12 14.01 9 11.01\"/>",
"assignment":"<rect width=\"8\" height=\"4\" x=\"8\" y=\"2\" rx=\"1\" ry=\"1\"/><path d=\"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2\"/><path d=\"M12 11h4\"/><path d=\"M12 16h4\"/><path d=\"M8 11h.01\"/><path d=\"M8 16h.01\"/>",
"forum":"<path d=\"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z\"/>",
"send":"<path d=\"m22 2-7 20-4-9-9-4Z\"/><path d=\"M22 2 11 13\"/>",
"refresh":"<path d=\"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8\"/><path d=\"M21 3v5h-5\"/><path d=\"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16\"/><path d=\"M3 21v-5h5\"/>",
"cases":"<rect width=\"20\" height=\"14\" x=\"2\" y=\"7\" rx=\"2\" ry=\"2\"/><path d=\"M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16\"/>",
"paid":"<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8\"/><path d=\"M12 18V6\"/>",
"local_atm":"<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8\"/><path d=\"M12 18V6\"/>",
"business_center":"<rect width=\"20\" height=\"14\" x=\"2\" y=\"7\" rx=\"2\" ry=\"2\"/><path d=\"M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16\"/>",
"whatsapp":"<path d=\"M17.6 6.32A8.78 8.78 0 0 0 11.38 3.7c-4.85 0-8.8 3.95-8.8 8.8 0 1.55.4 3.06 1.18 4.4L2.5 21.3l4.5-1.18a8.78 8.78 0 0 0 4.2 1.07h.01c4.85 0 8.8-3.95 8.8-8.8a8.74 8.74 0 0 0-2.4-6.07M11.39 19.7a7.3 7.3 0 0 1-3.72-1.02l-.27-.16-2.77.73.74-2.7-.17-.28a7.3 7.3 0 0 1-1.12-3.9c0-4.03 3.28-7.3 7.32-7.3a7.27 7.27 0 0 1 7.3 7.32c0 4.03-3.27 7.31-7.3 7.31m4.01-5.47c-.22-.11-1.3-.64-1.5-.72-.2-.07-.35-.11-.5.11-.14.22-.56.72-.69.87-.13.14-.25.16-.47.05-.22-.11-.93-.34-1.77-1.09-.65-.58-1.1-1.3-1.22-1.52-.13-.22-.01-.34.1-.45.1-.1.22-.25.33-.38.11-.13.14-.22.22-.36.07-.15.04-.27-.02-.38-.06-.11-.5-1.2-.68-1.65-.18-.43-.36-.37-.5-.38l-.42-.01a.81.81 0 0 0-.59.27c-.2.22-.77.76-.77 1.84s.79 2.13.9 2.28c.11.15 1.55 2.37 3.76 3.32.53.23.94.36 1.26.46.53.17 1.01.15 1.39.09.42-.06 1.3-.53 1.48-1.05.18-.51.18-.95.13-1.04-.05-.1-.2-.15-.42-.26\"/>",
"forward_to_inbox":"<rect width=\"20\" height=\"16\" x=\"2\" y=\"4\" rx=\"2\"/><path d=\"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7\"/>",
"play_arrow":"<polygon points=\"6 3 20 12 6 21 6 3\"/>",
"business":"<path d=\"M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z\"/><path d=\"M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2\"/><path d=\"M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2\"/><path d=\"M10 6h4\"/><path d=\"M10 10h4\"/><path d=\"M10 14h4\"/><path d=\"M10 18h4\"/>",
"language":"<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20\"/><path d=\"M2 12h20\"/>",
"edit_calendar":"<rect width=\"18\" height=\"18\" x=\"3\" y=\"4\" rx=\"2\" ry=\"2\"/><line x1=\"16\" x2=\"16\" y1=\"2\" y2=\"6\"/><line x1=\"8\" x2=\"8\" y1=\"2\" y2=\"6\"/><line x1=\"3\" x2=\"21\" y1=\"10\" y2=\"10\"/><path d=\"m14 16-3 3 3 3\"/>",
"logout":"<path d=\"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4\"/><polyline points=\"16 17 21 12 16 7\"/><line x1=\"21\" x2=\"9\" y1=\"12\" y2=\"12\"/>",
"mail":"<rect width=\"20\" height=\"16\" x=\"2\" y=\"4\" rx=\"2\"/><path d=\"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7\"/>",
"phone":"<path d=\"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z\"/>",
"verified":"<path d=\"M12 2 4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5Z\"/><path d=\"m9 12 2 2 4-4\"/>",
"add_task":"<path d=\"M22 11.08V12a10 10 0 1 1-5.93-9.14\"/><polyline points=\"22 4 12 14.01 9 11.01\"/>",
"insights":"<path d=\"M3 3v16a2 2 0 0 0 2 2h16\"/><path d=\"m19 9-5 5-4-4-3 3\"/>",
"account_balance_wallet":"<path d=\"M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1\"/><path d=\"M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4\"/>",
"event_available":"<rect width=\"18\" height=\"18\" x=\"3\" y=\"4\" rx=\"2\" ry=\"2\"/><line x1=\"16\" x2=\"16\" y1=\"2\" y2=\"6\"/><line x1=\"8\" x2=\"8\" y1=\"2\" y2=\"6\"/><line x1=\"3\" x2=\"21\" y1=\"10\" y2=\"10\"/><path d=\"m9 16 2 2 4-4\"/>",
"expand_more":"<path d=\"m6 9 6 6 6-6\"/>",
"expand_less":"<path d=\"m18 15-6-6-6 6\"/>",
"table_view":"<path d=\"M12 3v18\"/><rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\"/><path d=\"M3 9h18\"/><path d=\"M3 15h18\"/>",
"check":"<path d=\"M20 6 9 17l-5-5\"/>",
"fact_check":"<path d=\"M11 12H3\"/><path d=\"M16 6H3\"/><path d=\"M16 18H3\"/><path d=\"m17 12 2 2 4-4\"/>",
"savings":"<path d=\"M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2V5z\"/><path d=\"M2 9v1c0 1.1.9 2 2 2h1\"/><path d=\"M16 11h.01\"/>",
"account_balance":"<line x1=\"3\" x2=\"21\" y1=\"22\" y2=\"22\"/><line x1=\"6\" x2=\"6\" y1=\"18\" y2=\"11\"/><line x1=\"10\" x2=\"10\" y1=\"18\" y2=\"11\"/><line x1=\"14\" x2=\"14\" y1=\"18\" y2=\"11\"/><line x1=\"18\" x2=\"18\" y1=\"18\" y2=\"11\"/><polygon points=\"12 2 20 7 4 7\"/>",
"price_check":"<path d=\"M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8\"/><path d=\"M12 18V6\"/><circle cx=\"12\" cy=\"12\" r=\"10\"/>",
"supervisor_account":"<path d=\"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2\"/><circle cx=\"9\" cy=\"7\" r=\"4\"/><path d=\"M22 21v-2a4 4 0 0 0-3-3.87\"/><path d=\"M16 3.13a4 4 0 0 1 0 7.75\"/>",
"sync_alt":"<path d=\"m18 8 4 4-4 4\"/><path d=\"M2 12h20\"/><path d=\"m6 16-4-4 4-4\"/>",
"cloud_upload":"<path d=\"M12 13v8\"/><path d=\"M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242\"/><path d=\"m8 17 4-4 4 4\"/>",
"people_alt":"<path d=\"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2\"/><circle cx=\"9\" cy=\"7\" r=\"4\"/><path d=\"M22 21v-2a4 4 0 0 0-3-3.87\"/><path d=\"M16 3.13a4 4 0 0 1 0 7.75\"/>",
"monitoring":"<path d=\"M3 3v16a2 2 0 0 0 2 2h16\"/><path d=\"m19 9-5 5-4-4-3 3\"/>",
"wallet":"<path d=\"M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1\"/><path d=\"M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4\"/>",
"badge":"<path d=\"M3 11h.01\"/><rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\"/><circle cx=\"12\" cy=\"10\" r=\"2\"/><path d=\"M8 18a4 4 0 0 1 8 0\"/>",
"monetization_on":"<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8\"/><path d=\"M12 18V6\"/>",
"contract_edit":"<path d=\"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h6\"/><path d=\"M14 2v4a2 2 0 0 0 2 2h4\"/><path d=\"M8 13h4\"/><path d=\"M8 17h2\"/><path d=\"m20.4 14.5-5.9 5.9-3 .7.7-3 5.9-5.9a1.5 1.5 0 0 1 2.3 2.3Z\"/>",
"home":"<path d=\"m3 9.5 9-7 9 7\"/><path d=\"M19 9.5V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V9.5\"/><path d=\"M9 21v-8h6v8\"/>",
"sunrise":"<path d=\"M12 3v5\"/><path d=\"m5.6 8.6 1.4 1.4\"/><path d=\"m18.4 8.6-1.4 1.4\"/><path d=\"M7.5 19a4.5 4.5 0 0 1 9 0\"/><path d=\"M2 19h20\"/>",
"sunmid":"<circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 3v2\"/><path d=\"M12 19v2\"/><path d=\"M3 12h2\"/><path d=\"M19 12h2\"/><path d=\"m5.6 5.6 1.4 1.4\"/><path d=\"m17 17 1.4 1.4\"/><path d=\"m18.4 5.6-1.4 1.4\"/><path d=\"m7 17-1.4 1.4\"/>",
"moonstars":"<path d=\"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z\"/><path d=\"M19 4v2\"/><path d=\"M18 5h2\"/><path d=\"M16 14.5v1.7\"/><path d=\"M15.2 15.3h1.6\"/>",
"gpp_good":"<path d=\"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z\"/><path d=\"m9 12 2 2 4-4\"/>",
"assignment_turned_in":"<rect width=\"8\" height=\"4\" x=\"8\" y=\"2\" rx=\"1\" ry=\"1\"/><path d=\"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2\"/><path d=\"m9 14 2 2 4-4\"/>",
"person_search":"<circle cx=\"10\" cy=\"7\" r=\"4\"/><path d=\"M10.3 15H7a4 4 0 0 0-4 4v2\"/><circle cx=\"17\" cy=\"17\" r=\"3\"/><path d=\"m21 21-1.9-1.9\"/>",
"gavel":"<path d=\"m14.5 12.5-8 8a2.119 2.119 0 1 1-3-3l8-8\"/><path d=\"m16 16 6-6\"/><path d=\"m8 8 6-6\"/><path d=\"m9 7 8 8\"/><path d=\"m21 11-8-8\"/>",
"chevron_left":"<path d=\"m15 18-6-6 6-6\"/>"
};
var ICONS={
  team:"group",check:"check_circle",rupee:"currency_rupee",trend:"trending_up",
  cal:"calendar_month",dl:"download",wa:"whatsapp",mail:"mail",edit:"edit",
  del:"delete",user:"account_circle",plus:"add",chev:"chevron_right",
  lock:"lock",sun:"light_mode",grid:"dashboard",set:"settings",work:"insights",
  pay:"payments",save:"save"
};
function ic(name,color,size){
  var s=size||20;
  var markup=SVG_ICONS[name]||SVG_ICONS["check"];
  if(name==="whatsapp"){
    return h("svg",{viewBox:"0 0 24 24",width:s,height:s,style:{display:"inline-block",verticalAlign:"middle",flexShrink:0},fill:color||"currentColor",stroke:"none",dangerouslySetInnerHTML:{__html:markup}});
  }
  return h("svg",{viewBox:"0 0 24 24",width:s,height:s,style:{display:"inline-block",verticalAlign:"middle",flexShrink:0},fill:"none",stroke:color||"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round",dangerouslySetInnerHTML:{__html:markup}});
}
// A colourful, gradient-filled sun/moon for the dashboard greeting card. ic() always renders
// stroke-only single-colour icons, so this bypasses it entirely with hand-built, multi-colour SVG —
// verified by rendering each design standalone before wiring it in, same as every other custom icon here.
function greetIconSVG(hr,min){
  var t=hr*60+(min||0);
  var state=t<330?"sleep":t<540?"sunrise":t<1080?"hot":"evening"; // 12-5:30am / 5:30-9am / 9am-6pm / 6pm-12am
  var SIZE=58;
  if(state==="sunrise"||state==="hot"){
    var sr=state==="sunrise";
    var stops=sr?["#FFFEF0","#FDE047","#F97316","#EA580C"]:["#FFFEF0","#FDE047","#F59E0B","#EA580C"];
    var glowC=sr?"#FB923C":"#FDE047",rayC="#F59E0B",gid=sr?"sunGradDashA":"sunGradDashB";
    var rOuter=sr?21:22,rMid=sr?16.5:18,rInner=sr?13:14.5,rCore=sr?11.5:12.5,rayLen1=sr?15:16.5,rayLen2=sr?20:22,rayW=sr?2.6:3;
    var rays=[0,45,90,135,180,225,270,315].map(function(a){
      var rad=a*Math.PI/180,x1=24+Math.cos(rad)*rayLen1,y1=24+Math.sin(rad)*rayLen1,x2=24+Math.cos(rad)*rayLen2,y2=24+Math.sin(rad)*rayLen2;
      return h("line",{key:a,x1:x1,y1:y1,x2:x2,y2:y2,stroke:rayC,strokeWidth:rayW,strokeLinecap:"round"});
    });
    return h("div",{style:{animation:"iconFloat 4s ease-in-out infinite"}},
      h("svg",{viewBox:"0 0 48 48",width:SIZE,height:SIZE,style:{display:"block"}},
        h("defs",null,h("radialGradient",{id:gid,cx:"50%",cy:"50%",r:"50%"},
          h("stop",{offset:"0%",stopColor:stops[0]}),h("stop",{offset:sr?"35%":"30%",stopColor:stops[1]}),h("stop",{offset:sr?"75%":"70%",stopColor:stops[2]}),h("stop",{offset:"100%",stopColor:stops[3]})
        )),
        h("circle",{cx:24,cy:24,r:rOuter,fill:glowC,opacity:.10}),
        h("circle",{cx:24,cy:24,r:rMid,fill:glowC,opacity:.14}),
        h("circle",{cx:24,cy:24,r:rInner,fill:"#FDBA74",opacity:.18}),
        h("g",{style:{animation:"iconSpin 18s linear infinite",transformOrigin:"24px 24px"}},rays),
        h("circle",{cx:24,cy:24,r:rCore,fill:"url(#"+gid+")"}),
        h("circle",{cx:20,cy:20,r:sr?3:3.2,fill:"#FFFFFF",opacity:sr?.35:.4})
      )
    );
  }
  var isSleep=state==="sleep";
  return h("div",{style:{animation:"iconFloat 4s ease-in-out infinite",position:"relative"}},
    h("svg",{viewBox:"0 0 48 48",width:SIZE,height:SIZE,style:{display:"block"}},
      h("defs",null,h("linearGradient",{id:"moonGradDash",x1:"10%",y1:"0%",x2:"90%",y2:"100%"},
        h("stop",{offset:"0%",stopColor:"#F0EBFF"}),h("stop",{offset:"40%",stopColor:"#C4B5FD"}),h("stop",{offset:"75%",stopColor:"#8B5CF6"}),h("stop",{offset:"100%",stopColor:"#6D28D9"})
      )),
      h("circle",{cx:18,cy:isSleep?26:24,r:21,fill:"#8B5CF6",opacity:.09}),
      h("circle",{cx:18,cy:isSleep?26:24,r:17,fill:"#8B5CF6",opacity:.13}),
      h("path",{fill:"url(#moonGradDash)",d:"M24 6a12 12 0 0 0 18 18 18 18 0 1 1-18-18Z",transform:isSleep?"translate(-4,2)":undefined}),
      h("circle",{cx:isSleep?10:14,cy:isSleep?19:17,r:2.4,fill:"#FFFFFF",opacity:.3}),
      !isSleep?h("g",{fill:"#FDE68A"},h("circle",{cx:38,cy:12,r:1.7}),h("circle",{cx:34,cy:22,r:1.1}),h("circle",{cx:41,cy:25,r:1.3})):null,
      !isSleep?h("g",{stroke:"#FDE68A",strokeWidth:1.1,strokeLinecap:"round"},h("line",{x1:38,y1:9,x2:38,y2:15}),h("line",{x1:35,y1:12,x2:41,y2:12})):null,
      isSleep?h("g",{fontFamily:"sans-serif",fontWeight:700,fill:"#FDE68A"},
        h("text",{x:29,y:15,fontSize:8,style:{animation:"zzzFloat 2.6s ease-in-out infinite"}},"z"),
        h("text",{x:35,y:9.5,fontSize:6,opacity:.75,style:{animation:"zzzFloat 2.6s ease-in-out infinite .4s"}},"z"),
        h("text",{x:39,y:6,fontSize:4.3,opacity:.55,style:{animation:"zzzFloat 2.6s ease-in-out infinite .8s"}},"z")
      ):null
    )
  );
}


// Returns the RAW ANNUAL tax (with 4% cess applied, before dividing into months) for a given
// annual taxable salary and regime. This is the figure both the monthly TDS estimate and the
// one-time bonus/OT incremental-tax calculation are built from — keeping one source of truth
// instead of two slightly different copies of the slab logic.
function calcTaxAnnual(annual,regime){
  var isOld=regime==="old";
  var stdDed=isOld?50000:75000;
  var sl=isOld?
    [{a:0,b:250000,r:0},{a:250000,b:500000,r:.05},{a:500000,b:1000000,r:.20},{a:1000000,b:Infinity,r:.30}]:
    [{a:0,b:400000,r:0},{a:400000,b:800000,r:.05},{a:800000,b:1200000,r:.10},{a:1200000,b:1600000,r:.15},{a:1600000,b:2000000,r:.20},{a:2000000,b:2400000,r:.25},{a:2400000,b:Infinity,r:.30}];
  var t=Math.max(0,annual-stdDed),x=0;
  for(var i=0;i<sl.length;i++){var s=sl[i];if(t>s.a)x+=(Math.min(t,s.b)-s.a)*s.r;}
  // Rebate u/s 87A: Old regime - full rebate (up to Rs.12,500) if taxable income <= Rs.5L.
  // New regime - full rebate (up to Rs.60,000) if taxable income <= Rs.12L (current slab structure).
  if(isOld){if(t<=500000)x=Math.max(0,x-Math.min(x,12500));}
  else{if(t<=1200000)x=Math.max(0,x-Math.min(x,60000));}
  return x>0?x*1.04:0; // 4% Health & Education cess
}
function calcTax(annual,regime){
  return Math.round(calcTaxAnnual(annual,regime)/12);
}
function brkSal(ctc){var basic=Math.round(ctc*.5),hra=Math.round(ctc*.2);return{basic:basic,hra:hra,allow:ctc-basic-hra};}
function calcEMI(principal,annualRate,tenureMonths){
  if(!principal||!tenureMonths)return 0;
  if(!annualRate||annualRate===0)return Math.round(principal/tenureMonths);
  var r=annualRate/12/100;
  var emi=principal*r*Math.pow(1+r,tenureMonths)/(Math.pow(1+r,tenureMonths)-1);
  return Math.round(emi);
}
function calcLoanDeduction(empId,empLoans,year,month){
  // Returns total EMI deduction for this employee in given month
  if(!empLoans||!empLoans.length)return 0;
  var total=0;
  empLoans.forEach(function(l){
    if(l.status==="closed"||l.status==="cleared")return;
    if(!l.startDate)return;
    var start=new Date(l.startDate+"T00:00:00");
    var startY=start.getFullYear(),startM=start.getMonth();
    // Check if this loan is active in the given month
    var loanMonthIdx=(year-startY)*12+(month-startM);
    var tenure=l.tenure||0;
    if(loanMonthIdx<0||loanMonthIdx>=tenure)return;
    // Check if already fully paid
    if(l.paidInstallments>=tenure)return;
    total+=l.emi||l.monthlyDeduction||l.monthly_deduction||0;
  });
  return Math.round(total);
}
function calcPay(e,absent,half,unpaid,inc,shiftAllow,workingDays,prorataActive,prorataTotal){
  absent=absent||0;half=half||0;unpaid=unpaid||0;inc=inc||0;shiftAllow=shiftAllow||0;
  var wDays=workingDays||26; // working days passed from attendance calculation
  // Proration: if employee was active only part of the month (joined/left mid-month)
  var prorate=1;
  if(prorataActive!=null&&prorataTotal!=null&&prorataTotal>0){
    prorate=Math.max(0,Math.min(1,prorataActive/prorataTotal));
  }
  shiftAllow=shiftAllow*prorate;
  var isFixed=e.salaryType==="fixed";
  var fixedAmt=Number(e.fixedSalary)||Number(e.monthlyCTC)||0;
  // For fixed salary: full amount is the base, no HRA/allowance split
  // For split salary: use existing basic/hra/allow fields
  var ctcFallback=Number(e.monthlyCTC||e.fixedSalary||0);
  var basicBase=(isFixed?fixedAmt:(Number(e.basic)||Math.round(ctcFallback*0.5)))*prorate;
  var hraVal=(isFixed?0:(Number(e.hra)||Math.round(ctcFallback*0.2)))*prorate;
  var allowVal=(isFixed?0:(Number(e.allow)||Math.round(ctcFallback*0.3)))*prorate;
  var pd=basicBase/wDays; // per day rate based on actual working days
  var ad=absent*pd,hd=half*(pd/2),ud=unpaid*pd;
  var eb=Math.max(0,basicBase-ad-hd-ud);
  var gr=isFixed?(eb+inc+shiftAllow):(eb+hraVal+allowVal+inc+shiftAllow);
  // PF: on basic (capped at 15000 if mode=capped)
  var pfB=e.pf?(e.pfMode==="actual"?eb:Math.min(eb,15000)):0;
  var pfE=Math.round(pfB*.12),pfR=Math.round(pfB*.12);
  // ESI: on gross if <=21000
  var esiE=(e.esi&&gr<=21000)?Math.round(gr*.0075):0,esiR=(e.esi&&gr<=21000)?Math.round(gr*.0325):0;
  var pt2=e.pt?(gr>=15000?200:0):0,tds=e.tds!==false?calcTax(gr*12,e.taxRegime):0,hi=e.hi||0;
  var cd=(e.customs||[]).reduce(function(a,c){return a+(Number(c.amt)||0);},0);
  return{gr:Math.round(gr),eb:Math.round(eb),ad:Math.round(ad),hd:Math.round(hd),ud:Math.round(ud),pfE:pfE,pfR:pfR,esiE:esiE,esiR:esiR,pt:pt2,tds:tds,hi:hi,cd:cd,net:Math.round(gr-pfE-esiE-pt2-tds-hi-cd),loanDed:0,pfMode:e.pfMode||"capped",inc:inc,shiftAllow:shiftAllow,wDays:wDays,isFixed:isFixed,basicBase:Math.round(basicBase),basic:Math.round(basicBase),hra:Math.round(hraVal),allow:Math.round(allowVal),pd:Math.round(pd),prorate:prorate};
}
// ── Employment period helpers (join date / exit date awareness) ──
function parseDateSafe(ds){
  if(!ds)return null;
  var d=new Date(ds+"T00:00:00");
  return isNaN(d.getTime())?null:d;
}
function empActiveRangeInMonth(emp,year,month){
  // Returns {startDay,endDay,activeDays,fullDays,joinedMidMonth,exitedMidMonth,notYetJoined,alreadyLeft}
  var daysInMonth=new Date(year,month+1,0).getDate();
  var monthStart=new Date(year,month,1);
  var monthEnd=new Date(year,month,daysInMonth);
  var joinD=parseDateSafe(emp&&emp.joined);
  var exitD=(emp&&(emp.status==="terminated"||emp.status==="resigned"))?parseDateSafe(emp.resignDate):null;
  var startDay=1,endDay=daysInMonth,notYetJoined=false,alreadyLeft=false,joinedMidMonth=false,exitedMidMonth=false;
  if(joinD){
    if(joinD>monthEnd){notYetJoined=true;return{startDay:0,endDay:0,activeDays:0,fullDays:daysInMonth,joinedMidMonth:false,exitedMidMonth:false,notYetJoined:true,alreadyLeft:false};}
    if(joinD>=monthStart&&joinD<=monthEnd){startDay=joinD.getDate();joinedMidMonth=joinD.getDate()>1;}
  }
  if(exitD){
    if(exitD<monthStart){alreadyLeft=true;return{startDay:0,endDay:0,activeDays:0,fullDays:daysInMonth,joinedMidMonth:false,exitedMidMonth:false,notYetJoined:false,alreadyLeft:true};}
    if(exitD>=monthStart&&exitD<=monthEnd){endDay=exitD.getDate();exitedMidMonth=exitD.getDate()<daysInMonth;}
  }
  var activeDays=Math.max(0,endDay-startDay+1);
  return{startDay:startDay,endDay:endDay,activeDays:activeDays,fullDays:daysInMonth,joinedMidMonth:joinedMidMonth,exitedMidMonth:exitedMidMonth,notYetJoined:false,alreadyLeft:false};
}
function isEmployedOnDay(emp,year,month,day){
  var r=empActiveRangeInMonth(emp,year,month);
  if(r.notYetJoined||r.alreadyLeft)return false;
  return day>=r.startDay&&day<=r.endDay;
}
function getWorkingDays(att,empId,year,month){
  // Count days in month minus holidays from attendance records
  var daysInMonth=new Date(year,month+1,0).getDate();
  var holidays=0;
  for(var d=1;d<=daysInMonth;d++){
    var ds=year+"-"+String(month+1).padStart(2,"0")+"-"+String(d).padStart(2,"0");
    var s=att[ds+"_"+empId];
    if(s==="holiday")holidays++;
  }
  return Math.max(1,daysInMonth-holidays);
}
function esc(s){return(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
function openHTML(html,filename){
  var win=window.open("","_blank");
  if(win){win.document.write(html);win.document.close();}
  else{
    var blob=new Blob([html],{type:"text/html"});
    downloadBlob(blob,filename.replace(/[^a-z0-9]/gi,"-")+".html");
  }
}
function pdfAppHeader(orgName,orgEmail,orgPos,logoSrc){
  var logoHtml=logoSrc
    ?"<img src='"+logoSrc+"' width='32' height='32' style='border-radius:7px;display:block;flex-shrink:0'/>"
    :"<div style='background:#FCD34D;border-radius:7px;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:900;color:#0F172A;flex-shrink:0'>A</div>";
  return "<div style='background:#0F172A;padding:10px 16px;display:flex;justify-content:space-between;align-items:center;margin-bottom:0'>"
    +"<div style='display:flex;align-items:center;gap:10px'>"
      +logoHtml
      +"<div><div style='font-size:13px;font-weight:800;color:#fff;letter-spacing:-.2px'>Admin<span style=\"color:#FCD34D\">HR</span></div><div style='font-size:8px;color:rgba(255,255,255,.5);margin-top:1px'>Smart HR for Indian Businesses</div></div>"
    +"</div>"
    +"<div style='text-align:right'>"
      +"<div style='font-size:11px;font-weight:700;color:#fff'>"+esc(orgName)+"</div>"
      +"<div style='font-size:8.5px;color:rgba(255,255,255,.6);margin-top:1px'>"+esc(orgPos)+" &bull; "+esc(orgEmail)+"</div>"
    +"</div>"
  +"</div>";
}
function pdfAppFooter(orgName,orgEmail){
  return "<div style='border-top:1px solid #E2E8F0;padding:8px 16px;display:flex;justify-content:space-between;align-items:center;background:#F8FAFF'>"
    +"<div style='font-size:8px;color:#94A3B8'>"+esc(orgName)+" &bull; "+esc(orgEmail)+"</div>"
    +"<div style='font-size:8px;font-weight:700;color:#94A3B8;letter-spacing:.3px'>Generated by AdminHR</div>"
  +"</div>";
}
function baseStyle(){
  return "<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Segoe UI',Arial,sans-serif;background:#F8FAFF;color:#0F172A;min-height:100vh;padding:0}.wrap{max-width:620px;margin:0 auto;background:#fff;border-radius:0;overflow:hidden;box-shadow:0 4px 24px rgba(15,23,42,.10)}.body{padding:20px 24px}.section-title{font-size:11px;font-weight:700;color:#94A3B8;letter-spacing:1.2px;text-transform:uppercase;margin:20px 0 10px}.row{display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid #F1F5F9}.row:last-child{border-bottom:none}.row .label{font-size:12px;color:#64748B}.row .val{font-size:12px;font-weight:600;color:#0F172A}.net-box{background:#0F172A;padding:16px 20px;display:flex;justify-content:space-between;align-items:center;margin:16px 0}.net-label{font-size:13px;font-weight:700;color:rgba(255,255,255,.75)}.net-val{font-size:24px;font-weight:800;color:#4ADE80}@media print{body{background:#fff}.wrap{box-shadow:none}}</style>";
}
function buildPayslipHTML(emp,d,m,y,orgName,orgEmail,orgPos,logoSrc){
  var deductTotal=d.pfE+d.esiE+d.pt+d.tds+d.hi+d.cd+d.ad+d.hd+d.ud;
  var company=orgName||"Your Company";
  function R(n){return "Rs."+Number(n||0).toLocaleString("en-IN");}
  function tr(label,val,color,bg,bold){return "<tr style='background:"+(bg||"#fff")+"'><td style='padding:5px 10px;font-size:9.5px;color:#64748B;width:55%'>"+(bold?"<b>":"")+esc(label)+(bold?"</b>":"")+"</td><td style='padding:5px 10px;font-size:9.5px;font-weight:700;color:"+(color||"#0F172A")+";text-align:right'>"+(bold?"<b>":"")+esc(val)+(bold?"</b>":"")+"</td></tr>";}
  return "<!DOCTYPE html><html><head><meta charset=utf-8><title>Payslip - "+esc(company)+"</title><style>*{box-sizing:border-box;margin:0;padding:0}@page{size:A4 portrait;margin:10mm 12mm}body{font-family:Arial,sans-serif;color:#0F172A;font-size:10px;background:#fff}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}.emp-bar{background:#F8FAFF;border:1px solid #E2E8F0;border-radius:6px;padding:10px 14px;display:flex;justify-content:space-between;margin:10px 0}.cols{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px}.tbl{width:100%;border-collapse:collapse;border:1px solid #E2E8F0;overflow:hidden}.tbl-head{background:#0F172A;color:#fff;padding:6px 10px;font-size:9px;letter-spacing:.8px;text-align:left}.tbl tr{border-bottom:1px solid #F1F5F9}.net{background:#0F172A;padding:12px 16px;display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}.er-tbl{width:100%;border-collapse:collapse;border:1px solid #E2E8F0;overflow:hidden;margin-bottom:10px}</style></head><body>"
  +pdfAppHeader(company,orgEmail||"",orgPos||"")
  +"<div style='background:#0F172A;padding:8px 16px;display:flex;justify-content:space-between;align-items:center;border-top:1px solid rgba(255,255,255,.1)'><div style='font-size:14px;font-weight:700;color:#fff'>SALARY PAYSLIP</div><div style='font-size:9px;color:rgba(255,255,255,.6)'>"+esc(MOS[m]+" "+y)+" &bull; "+new Date().toLocaleDateString("en-IN")+"</div></div>"
  +"<div class='emp-bar'><div><div style='font-size:13px;font-weight:700'>"+esc(emp.name)+"</div><div style='font-size:9px;color:#64748B;margin-top:2px'>"+esc(emp.role||"")+(emp.dept?" &bull; "+esc(emp.dept):"")+"</div></div><div style='text-align:right;font-size:9px;color:#64748B;line-height:1.8'>"+(emp.eid?"EMP: <b>"+esc(emp.eid)+"</b><br>":"")+(emp.pan?"PAN: <b>"+esc(emp.pan)+"</b><br>":"")+(emp.uan?"UAN: <b>"+esc(emp.uan)+"</b>":"")+"</div></div>"
  +"<div class='cols'><table class='tbl'><tr><td class='tbl-head' colspan='2'>EARNINGS</td></tr>"+tr("Basic Salary",R(d.eb))+tr("HRA",R(emp.hra||0))+tr("Allowances",R(emp.allow||0))+(d.shiftAllow>0?tr("Shift Allowance",R(d.shiftAllow),"#0D9488"):"")+( d.inc>0?tr("Incentive",R(d.inc),"#059669"):"")+tr("Gross Earnings",R(d.gr),"#059669","#F0FDF4",true)+"</table>"
  +"<table class='tbl'><tr><td class='tbl-head' colspan='2'>DEDUCTIONS</td></tr>"+(d.ad>0?tr("Absent","-"+R(d.ad),"#DC2626"):"")+(d.hd>0?tr("Half Day","-"+R(d.hd),"#D97706"):"")+(d.ud>0?tr("Unpaid Leave","-"+R(d.ud),"#DC2626"):"")+(d.pfE>0?tr(d.pfMode==="actual"?"PF (Employee 12%)":"PF (12% of Rs.15,000 cap)","-"+R(d.pfE)):"")+(d.esiE>0?tr("ESI (Emp 0.75%)","-"+R(d.esiE),"#0D9488"):"")+(d.pt>0?tr("Professional Tax","-"+R(d.pt),"#D97706"):"")+(d.tds>0?tr("TDS","-"+R(d.tds),"#DC2626"):"")+(d.hi>0?tr("Health Insurance","-"+R(d.hi),"#EC4899"):"")+(d.cd>0?tr("Custom","-"+R(d.cd)):"")+tr("Total Deductions","-"+R(deductTotal),"#DC2626","#FEF2F2",true)+"</table></div>"
  +"<div class='net'><div style='font-size:10px;color:rgba(255,255,255,.65);font-weight:600'>NET TAKE HOME &bull; "+esc(MOS[m]+" "+y)+"</div><div style='font-size:22px;font-weight:700;color:#4ADE80'>"+esc(R(d.net))+"</div></div>"
  +"<table class='er-tbl'><tr><td class='tbl-head' colspan='2'>EMPLOYER CONTRIBUTIONS &mdash; not deducted from salary</td></tr>"+tr("PF (Employer 12%)",R(d.pfR))+tr("ESI (Employer 3.25%)",R(d.esiR))+tr("Total CTC",R(d.gr+d.pfR+d.esiR),"#D97706","#FFFBEB",true)+"</table>"
  +pdfAppFooter(company,orgEmail||"")
  +"</body></html>";
}
function buildAttHTML(name,y,m,recs,orgName,orgEmail,orgPos,logoSrc){
  var ATColors={present:"#059669",absent:"#DC2626",half:"#D97706",paid:"#7C3AED",unpaid:"#4F46E5",holiday:"#0EA5E9",unmarked:"#94A3B8"};
  var rows=Object.entries(recs).sort().map(function(kv){var s=kv[1];return "<div style='display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid #F1F5F9'><span style='font-size:12px;color:#64748B'>"+esc(kv[0])+"</span><span style='color:"+(ATColors[s]||"#0F172A")+";background:"+(ATColors[s]||"#94A3B8")+"18;padding:2px 10px;border-radius:20px;font-size:11px;font-weight:600'>"+esc(ATL[s]||s)+"</span></div>";}).join("");
  var counts={present:0,absent:0,half:0,paid:0,unpaid:0,holiday:0};
  Object.values(recs).forEach(function(v){if(counts[v]!==undefined)counts[v]++;});
  var summary="<div style='display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px'>"+[["P",counts.present,"#059669"],["A",counts.absent,"#DC2626"],["H",counts.half,"#D97706"],["PL",counts.paid,"#7C3AED"],["UL",counts.unpaid,"#4F46E5"],["Hol",counts.holiday,"#0EA5E9"]].map(function(i){return "<div style='background:"+i[2]+"14;border:1px solid "+i[2]+"44;border-radius:8px;padding:8px 14px;text-align:center'><div style='font-size:16px;font-weight:800;color:"+i[2]+"'>"+i[1]+"</div><div style='font-size:9px;color:#64748B;font-weight:600'>"+i[0]+"</div></div>";}).join("")+"</div>";
  return "<!DOCTYPE html><html><head><meta charset=utf-8><title>Attendance - "+esc(name)+"</title>"+baseStyle()+"</head><body><div class='wrap'>"+pdfAppHeader(orgName||"",orgEmail||"",orgPos||"",logoSrc)+"<div class='body'><div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:14px'><div><div style='font-size:15px;font-weight:800;color:#0F172A'>Attendance Record</div><div style='font-size:11px;color:#64748B;margin-top:2px'>"+esc(name)+" &bull; "+esc(MOS[m]+" "+y)+"</div></div></div>"+summary+rows+"</div>"+pdfAppFooter(orgName||"",orgEmail||"")+"</div></body></html>";
}
function pdfHeader(doc,W,mg,logoSrc,orgName,orgPos,orgEmail,title,subtitle,orgAddress,companyLogo,orgContact){
  var logoW=0;
  if(companyLogo&&companyLogo.startsWith("data:")){
    try{
      // Draw rounded rect clip mask for logo
      doc.setFillColor(255,255,255);
      doc.roundedRect(mg,5,18,18,3,3,"F");
      doc.addImage(companyLogo,"PNG",mg,5,18,18,undefined,"FAST");
      logoW=22;
    }catch(e){}
  }
  doc.setFontSize(13);doc.setFont("helvetica","bold");doc.setTextColor(15,23,42);
  doc.text(orgName||"",mg+logoW,11);

  var infoY=17;
  if(orgAddress){
    var addrLines=(orgAddress||"").split("\n").map(function(s){return s.trim();}).filter(Boolean).slice(0,2);
    addrLines.forEach(function(line,i){
      doc.setFontSize(7.5);doc.setTextColor(71,85,105);
      doc.text(line,mg+logoW,infoY+i*4);
    });
    if(addrLines.length)infoY+=addrLines.length*4;
  }
  // Contact line — phone, website, email (only the parts that exist)
  var contactParts=[];
  if(orgContact&&orgContact.phone)contactParts.push(orgContact.phone);
  if(orgContact&&orgContact.website)contactParts.push(orgContact.website);
  if(orgEmail)contactParts.push(orgEmail);
  if(contactParts.length){
    doc.setFontSize(7.5);doc.setTextColor(71,85,105);
    doc.text(contactParts.join("   |   "),mg+logoW,infoY);
    infoY+=4;
  }
  doc.setFontSize(13);doc.setFont("helvetica","bold");doc.setTextColor(15,23,42);
  doc.text(title,W-mg,11,{align:"right"});
  doc.setFontSize(8.5);doc.setFont("helvetica","normal");doc.setTextColor(71,85,105);
  doc.text(subtitle||"",W-mg,17,{align:"right"});
  var lineY=Math.max(29,infoY+5);
  doc.setDrawColor(180,195,215);doc.setLineWidth(0.5);doc.line(mg,lineY,W-mg,lineY);
  return lineY+5;
}
// Builds a single "phone | website | email" line for letterheads (skips parts that are empty)
function orgContactLine(org){
  var parts=[];
  if(org.phone)parts.push(org.phone);
  if(org.website)parts.push(org.website);
  var em=org.contactEmail||org.email;
  if(em)parts.push(em);
  return parts.join("   |   ");
}
function pdfFooter(doc,W,mg,H,orgName,orgEmail,appLogoSrc,authPos,authSign){
  doc.setFontSize(7.5);doc.setFont("helvetica","italic");doc.setTextColor(120,130,148);
  doc.text("This is a computer generated document. No signature required.",W/2,H-17,{align:"center"});
  doc.setDrawColor(180,195,215);doc.setLineWidth(0.3);doc.line(mg,H-12,W-mg,H-12);
  doc.setFontSize(7.5);doc.setFont("helvetica","normal");doc.setTextColor(71,85,105);
  doc.text(orgName||"",mg,H-6);
  doc.text("Generated by Admin HR",W-mg,H-6,{align:"right"});
}


// ── Shared PDF table helper ──────────────────────────────────────
// ── Shared grouped-employee table ──────────────────────────────────────────
// Used by every bulk report (PF/ESI, Salary Register, Employee Records, Attendance
// Summary monthly/yearly, Payroll Report) so they all follow one convention: employees
// grouped under a department title (not a repeated department column), departments and
// employees both alphabetical, and an identity cell showing Name (bold) with Role - ID
// underneath — same pattern used by the Dept Payroll and Detailed Attendance reports.
function drawGroupedEmployeeTable(doc,mg,cw,H,ry,headerCols,headerCws,empRows,opts){
  opts=opts||{};
  var identityW=opts.identityW||50;
  var rowH=opts.rowH||13;
  var fontSize=opts.fontSize||8;
  var headerColor=opts.headerColor||[26,35,73];
  var dataCw=headerCws.reduce(function(a,b){return a+b;},0);
  var scale=(cw-identityW)/dataCw;
  var cws=headerCws.map(function(w){return w*scale;});
  var cx=[mg+identityW];for(var i=0;i<cws.length-1;i++)cx.push(cx[i]+cws[i]);

  function drawHeader(){
    doc.setFillColor(headerColor[0],headerColor[1],headerColor[2]);doc.rect(mg,ry,cw,9,"F");
    doc.setFontSize(7.5);doc.setFont("helvetica","bold");doc.setTextColor(255,255,255);
    doc.text("EMPLOYEE",mg+3,ry+6);
    headerCols.forEach(function(c,i){
      var tx=c.align==="r"?cx[i]+cws[i]-3:cx[i]+3;
      doc.text(c.label,tx,ry+6,{align:c.align==="r"?"right":"left"});
    });
    ry+=9;
  }
  drawHeader();

  var depts={};
  empRows.forEach(function(r){var dp=r.emp.dept||"Unassigned";(depts[dp]=depts[dp]||[]).push(r);});
  var deptNames=Object.keys(depts).sort(function(a,b){return a.localeCompare(b);});

  deptNames.forEach(function(deptName){
    if(ry>H-20){doc.addPage();ry=14;drawHeader();}
    doc.setFillColor(238,242,250);doc.rect(mg,ry,cw,7,"F");
    doc.setFontSize(8.5);doc.setFont("helvetica","bold");doc.setTextColor(26,35,73);
    doc.text(deptName,mg+3,ry+5);
    ry+=7;
    var deptRows=depts[deptName].slice().sort(function(a,b){return (a.emp.name||"").localeCompare(b.emp.name||"");});
    deptRows.forEach(function(r,ei){
      if(ry+rowH>H-18){doc.addPage();ry=14;drawHeader();}
      if(ei%2===0){doc.setFillColor(248,250,253);doc.rect(mg,ry,cw,rowH,"F");}
      doc.setDrawColor(225,230,240);doc.setLineWidth(.2);doc.line(mg,ry+rowH,mg+cw,ry+rowH);
      doc.line(mg+identityW,ry,mg+identityW,ry+rowH);
      // Identity cell — name bold, role - ID underneath
      doc.setFontSize(8.3);doc.setFont("helvetica","bold");doc.setTextColor(15,23,42);
      doc.text((r.emp.name||"").substring(0,26),mg+3,ry+rowH/2-1);
      doc.setFontSize(6.3);doc.setFont("helvetica","normal");doc.setTextColor(71,85,105);
      var sub=(r.emp.role||"-")+(r.emp.eid?" - "+r.emp.eid:"");
      doc.text(sub.substring(0,40),mg+3,ry+rowH/2+3.5);
      // Data cells
      r.cells.forEach(function(cell,i){
        var val=cell&&cell.val!==undefined?cell.val:cell;
        var bold=cell&&cell.bold;
        var color=cell&&cell.color;
        doc.setFontSize(fontSize);doc.setFont("helvetica",bold?"bold":"normal");
        if(color)doc.setTextColor(color[0],color[1],color[2]);else doc.setTextColor(15,23,42);
        var align=headerCols[i]&&headerCols[i].align==="r"?"right":"left";
        var tx=align==="right"?cx[i]+cws[i]-3:cx[i]+3;
        doc.text(String(val),tx,ry+rowH/2+1.3,{align:align});
      });
      ry+=rowH;
    });
  });

  if(opts.totalsCells){
    if(ry+rowH>H-18){doc.addPage();ry=14;drawHeader();}
    doc.setDrawColor(headerColor[0],headerColor[1],headerColor[2]);doc.setLineWidth(.6);doc.line(mg,ry,mg+cw,ry);
    doc.setFontSize(8.3);doc.setFont("helvetica","bold");doc.setTextColor(15,23,42);
    doc.text("TOTAL",mg+3,ry+rowH/2+1.3);
    opts.totalsCells.forEach(function(cell,i){
      var val=cell&&cell.val!==undefined?cell.val:cell;
      var color=cell&&cell.color;
      doc.setFontSize(fontSize);doc.setFont("helvetica","bold");
      if(color)doc.setTextColor(color[0],color[1],color[2]);else doc.setTextColor(15,23,42);
      var align=headerCols[i]&&headerCols[i].align==="r"?"right":"left";
      var tx=align==="right"?cx[i]+cws[i]-3:cx[i]+3;
      doc.text(String(val),tx,ry+rowH/2+1.3,{align:align});
    });
    ry+=rowH;
  }
  return ry;
}
function pdfTable(doc,ry,mg,cols,cws,rows,opts){
  // cols: array of {label,align:"l"/"r"/"c"}
  // cws: column widths array (must sum to cw)
  // rows: array of arrays, each cell {val,bold,color}
  // opts: {rowH,fontSize,headerColor,altRow,totalsRow}
  var o=Object.assign({rowH:9.5,fontSize:8,headerColor:[45,55,72],altRow:true},opts||{});
  var cx=[mg];
  for(var i=0;i<cws.length-1;i++)cx.push(cx[i]+cws[i]);
  var cw=cws.reduce(function(a,b){return a+b;},0);
  var padX=1.8;

  // Truncates text with an ellipsis so it never bleeds into the next column.
  // Must be called AFTER setFontSize/setFont for the cell, so the width measurement matches what's drawn.
  function fitText(text,maxWidth){
    text=String(text===null||text===undefined?"":text);
    if(doc.getTextWidth(text)<=maxWidth)return text;
    var t=text;
    while(t.length>1&&doc.getTextWidth(t+"...")>maxWidth)t=t.slice(0,-1);
    return t+"...";
  }
  // Draws the vertical grid lines for one row band.
  function vLines(y,h){
    doc.setDrawColor(222,228,238);
    doc.setLineWidth(0.25);
    for(var v=1;v<cx.length;v++)doc.line(cx[v],y,cx[v],y+h);
    doc.line(mg,y,mg,y+h); // left border
    doc.line(mg+cw,y,mg+cw,y+h); // right border
  }

  // Header row — no solid fill; bold colored text with a bold rule underneath to set it apart
  doc.setFontSize(o.fontSize-0.5);doc.setFont("helvetica","bold");doc.setTextColor(o.headerColor[0],o.headerColor[1],o.headerColor[2]);
  cols.forEach(function(col,i){
    var x=cx[i]+cws[i]/2;
    doc.text(fitText(col.label,cws[i]-padX*2),x,ry+o.rowH*0.65,{align:"center"});
  });
  vLines(ry,o.rowH);
  doc.setDrawColor(o.headerColor[0],o.headerColor[1],o.headerColor[2]);doc.setLineWidth(0.7);
  doc.line(mg,ry+o.rowH,mg+cw,ry+o.rowH);
  ry+=o.rowH;

  // Data rows
  rows.forEach(function(row,ri){
    var isTotals=ri===rows.length-1&&opts&&opts.totalsRow;
    if(isTotals){
      // No fill — a bold rule above sets the totals row apart instead
      doc.setDrawColor(o.headerColor[0],o.headerColor[1],o.headerColor[2]);doc.setLineWidth(0.7);
      doc.line(mg,ry,mg+cw,ry);
    } else if(o.altRow&&ri%2===0){
      doc.setFillColor(238,242,249);doc.rect(mg,ry,cw,o.rowH,"F"); // stronger banding so alternating rows are easy to tell apart
    }
    doc.setDrawColor(205,213,228);doc.setLineWidth(0.3);
    doc.line(mg,ry+o.rowH,mg+cw,ry+o.rowH);

    row.forEach(function(cell,i){
      var val=cell&&cell.val!==undefined?cell.val:cell;
      var bold=cell&&cell.bold;
      var color=cell&&cell.color;
      if(isTotals)color=color||o.headerColor;
      doc.setFontSize(o.fontSize);
      doc.setFont("helvetica",bold||isTotals?"bold":"normal");
      if(color)doc.setTextColor(color[0],color[1],color[2]);
      else doc.setTextColor(15,23,42);
      var x=cx[i]+cws[i]/2;
      doc.text(fitText(val,cws[i]-padX*2),x,ry+o.rowH*0.65,{align:"center"});
    });
    vLines(ry,o.rowH);
    ry+=o.rowH;
    if(ry>270){doc.addPage();ry=14;}
  });
  return ry;
}


// ── Combined Expense & Payroll Summary PDF (Company Expenses + Salary Summary + Staff Claims) ──
function makeExpenseSummaryPDF(data,org,authPos2,authSign2){
  loadJsPDFGlobal(function(JsPDF){
    var doc=new JsPDF({orientation:"portrait",unit:"mm",format:"a4"});
    var W=210,mg=14;
    var ry=pdfHeader(doc,W,mg,null,org.name,org.position,org.contactEmail||org.email,"EXPENSE & PAYROLL SUMMARY",data.periodLabel,org.address||"",org.logo||"",{phone:org.phone,website:org.website});

    // Subtle section marker — colored tag + heading + neutral rule
    function sectionTab(label,rgb){
      doc.setFillColor(rgb[0],rgb[1],rgb[2]);
      doc.roundedRect(mg,ry-4.7,3.4,3.4,1,1,"F");
      doc.setFontSize(11);doc.setFont("helvetica","bold");doc.setTextColor(15,23,42);
      doc.text(label,mg+6.5,ry);
      doc.setDrawColor(225,230,238);doc.setLineWidth(0.4);
      doc.line(mg,ry+3,W-mg,ry+3);
      ry+=9;
    }

    var AMBER=[200,138,40],BLUE=[70,110,200],PURPLE=[140,100,200],GRNc=[16,140,90];
    var NEUTRAL_HEAD=[71,85,105]; // same restrained slate used for headers across the app's other PDFs
    var totalOutflow=(data.expTotal||0)+(data.salaryNet||0);

    // ── Executive Overview — the one band that answers "what did this period cost, total?" ──
    doc.setFontSize(7.5);doc.setFont("helvetica","bold");doc.setTextColor(71,85,105);doc.text("OVERVIEW - "+data.periodLabel.toUpperCase(),mg,ry);ry+=5;
    var ovItems=[["Company Expenses",data.expTotal,AMBER],["Payroll (Net Paid)",data.salaryNet,BLUE],["Total Outflow",totalOutflow,GRNc]];
    var ovW=(W-mg*2-2*5)/3;
    ovItems.forEach(function(it,i){
      var x=mg+i*(ovW+5);
      doc.setDrawColor(225,230,238);doc.setLineWidth(0.4);doc.roundedRect(x,ry,ovW,20,2,2);
      doc.setFillColor(it[2][0],it[2][1],it[2][2]);doc.roundedRect(x,ry,2.2,20,1,1,"F");
      doc.setFontSize(7);doc.setFont("helvetica","bold");doc.setTextColor(71,85,105);doc.text(it[0].toUpperCase(),x+6,ry+7.5);
      doc.setFontSize(12.5);doc.setFont("helvetica","bold");doc.setTextColor(15,23,42);doc.text(fmtIN(it[1]||0),x+6,ry+15.5);
    });
    ry+=27;

    // ── Section 1: Company Expenses (table + category breakdown) ──
    sectionTab("Company Expenses",AMBER);
    if(!data.expenses||data.expenses.length===0){
      doc.setFontSize(8.5);doc.setFont("helvetica","normal");doc.setTextColor(71,85,105);doc.text("No company expenses recorded for this period.",mg,ry+2);ry+=10;
    } else {
      // Category breakdown — horizontal bars, biggest category first (this data existed before but was never shown)
      if(data.catList&&data.catList.length){
        doc.setFontSize(8);doc.setFont("helvetica","bold");doc.setTextColor(71,85,105);doc.text("By Category",mg,ry);ry+=5;
        var barColors=[AMBER,BLUE,PURPLE,GRNc,[200,90,60],[90,140,160]];
        var maxCat=data.catList[0][1]||1;
        var barX=mg+44,barAreaW=W-mg*2-86; // leaves clear space for the label (left) and amount/pct (right) so the bar never runs under the text
        data.catList.slice(0,6).forEach(function(c,i){
          var col=barColors[i%barColors.length];
          var pct=data.expTotal>0?Math.round(c[1]*100/data.expTotal):0;
          doc.setFontSize(8);doc.setFont("helvetica","normal");doc.setTextColor(15,23,42);
          doc.text(String(c[0]).substring(0,20),mg,ry+3.2);
          doc.setFillColor(238,242,248);doc.roundedRect(barX,ry,barAreaW,4.2,1,1,"F");
          var bw=Math.max(2,barAreaW*(c[1]/maxCat));
          doc.setFillColor(col[0],col[1],col[2]);doc.roundedRect(barX,ry,bw,4.2,1,1,"F");
          doc.setFontSize(8);doc.setFont("helvetica","bold");doc.setTextColor(15,23,42);
          doc.text(fmtNum(c[1])+"  ("+pct+"%)",W-mg,ry+3.2,{align:"right"});
          ry+=7.5;
        });
        ry+=4;
      }
      doc.setFontSize(8);doc.setFont("helvetica","bold");doc.setTextColor(71,85,105);doc.text("All Transactions",mg,ry);ry+=4;
      var expCols=[{label:"DATE",align:"l"},{label:"CATEGORY",align:"l"},{label:"VENDOR",align:"l"},{label:"MODE",align:"l"},{label:"AMOUNT (Rs.)",align:"r"}];
      var expCws=[24,42,52,30,34];
      var expRows=data.expenses.map(function(e){
        var catName=e.category==="custom"?(e.customCategory||"Other"):(data.catLabels[e.category]||e.category);
        return [
          new Date(e.date+"T00:00:00").toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}),
          catName,
          e.vendor||"-",
          data.modeLabels[e.paymentMode]||e.paymentMode||"-",
          {val:fmtNum(e.amount||0),align:"r"}
        ];
      });
      expRows.push([{val:"TOTAL",bold:true},"","","",{val:fmtNum(data.expTotal),bold:true}]);
      ry=pdfTable(doc,ry,mg,expCols,expCws,expRows,{rowH:8.5,fontSize:8,totalsRow:true,headerColor:NEUTRAL_HEAD});
      ry+=10;
    }

    // ── Section 2: Salary Summary ──
    if(ry>235){doc.addPage();ry=14;}
    sectionTab("Salary Summary",BLUE);
    doc.setFontSize(7.5);doc.setFont("helvetica","normal");doc.setTextColor(71,85,105);doc.text(data.periodLabel+" - "+data.staffCount+" employees",mg,ry+1);ry+=6;
    var statCols=[["Total Gross",data.salaryGross],["Total Net Pay",data.salaryNet],["PF (Employee+Employer)",data.salaryPF],["Total Staff",data.staffCount+" employees"]];
    var statW=(W-mg*2-3*4)/4;
    statCols.forEach(function(s,i){
      var x=mg+i*(statW+4);
      doc.setDrawColor(225,230,238);doc.setLineWidth(0.4);doc.roundedRect(x,ry,statW,17.5,1.5,1.5);
      doc.setFillColor(BLUE[0],BLUE[1],BLUE[2]);doc.roundedRect(x,ry,2,17.5,1,1,"F");
      doc.setFontSize(6.5);doc.setFont("helvetica","bold");doc.setTextColor(71,85,105);doc.text(s[0].toUpperCase(),x+5,ry+7);
      doc.setFontSize(9.5);doc.setFont("helvetica","bold");doc.setTextColor(15,23,42);
      doc.text(typeof s[1]==="number"?fmtIN(s[1]):String(s[1]),x+5,ry+14);
    });
    ry+=27;

    // ── Section 3: Staff Claims ──
    if(ry>235){doc.addPage();ry=14;}
    sectionTab("Staff Claims",PURPLE);
    if(!data.claims||data.claims.length===0){
      doc.setFontSize(8.5);doc.setFont("helvetica","normal");doc.setTextColor(71,85,105);doc.text("No staff claims recorded for this period.",mg,ry+2);ry+=10;
    } else {
      var claimCols=[{label:"EMPLOYEE",align:"l"},{label:"CATEGORY",align:"l"},{label:"PAYROLL MONTH",align:"l"},{label:"DESCRIPTION",align:"l"},{label:"AMOUNT (Rs.)",align:"r"}];
      var claimCws=[40,28,30,50,34];
      var claimRows=data.claims.map(function(c){
        return [
          c.employeeName||"-",
          data.claimCatLabels[c.category]||c.category||"-",
          data.mosLabels[c.month]+" "+c.year,
          c.description||"-",
          {val:fmtNum(c.amount||0),align:"r"}
        ];
      });
      claimRows.push([{val:"TOTAL",bold:true},"","","",{val:fmtNum(data.claimsTotal),bold:true}]);
      ry=pdfTable(doc,ry,mg,claimCols,claimCws,claimRows,{rowH:8.5,fontSize:8,totalsRow:true,headerColor:NEUTRAL_HEAD});
      ry+=6;
      doc.setFontSize(7.5);doc.setFont("helvetica","italic");doc.setTextColor(71,85,105);
      doc.text("Note: Staff claims are paid out as part of the Net Pay shown in Salary Summary above - they are not an additional outflow.",mg,ry);
    }

    pdfFooter(doc,W,mg,doc.internal.pageSize.getHeight(),org.name,org.email,null,authPos2,authSign2);
    downloadPDF(doc.output("blob"),"Expense-Summary-"+data.periodLabel.replace(/\s+/g,"-")+".pdf");
    showT("Expense summary downloaded");
  },function(){showT("PDF library error","err");});
}

function makeOfferLetterPDF(emp,org,authPos2,authSign2){
  loadJsPDFGlobal(function(JsPDF){
    var doc=new JsPDF({orientation:"portrait",unit:"mm",format:"a4"});
    var W=210,mg=22,ry=18;
    var NVYC=[15,23,42],MUT=[71,85,105],RULE=[210,218,230];
    // Letterhead — logo (if set) + org name/address/contact
    var logoW=0;
    if(org.logo&&String(org.logo).indexOf("data:")===0){
      try{doc.setFillColor(255,255,255);doc.roundedRect(mg,ry-6,18,18,3,3,"F");doc.addImage(org.logo,"PNG",mg,ry-6,18,18,undefined,"FAST");logoW=22;}catch(e){}
    }
    doc.setFontSize(16);doc.setFont("helvetica","bold");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);doc.text(org.name||"Company",mg+logoW,ry);
    doc.setFontSize(8.5);doc.setFont("helvetica","normal");doc.setTextColor(MUT[0],MUT[1],MUT[2]);
    var addrShown=false;
    if(org.address){var addrL=org.address.split("\n")[0];doc.text(addrL,mg+logoW,ry+5.5);addrShown=true;}
    var contactLine=orgContactLine(org);
    if(contactLine)doc.text(contactLine,mg+logoW,ry+(addrShown?10:5.5));
    doc.setFontSize(9);doc.text(new Date().toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"}),W-mg,ry,{align:"right"});
    ry+=(addrShown&&contactLine?15.5:(addrShown||contactLine?11:6));doc.setDrawColor(RULE[0],RULE[1],RULE[2]);doc.setLineWidth(0.6);doc.line(mg,ry,W-mg,ry);ry+=12;
    doc.setFontSize(14);doc.setFont("helvetica","bold");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);doc.text("OFFER LETTER",W/2,ry,{align:"center"});ry+=2;
    doc.setDrawColor(NVYC[0],NVYC[1],NVYC[2]);doc.setLineWidth(0.8);doc.line(W/2-16,ry+2,W/2+16,ry+2);ry+=14;
    doc.setFontSize(11);doc.setFont("helvetica","normal");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);doc.text("Dear "+emp.name+",",mg,ry);ry+=8;
    doc.setFontSize(10.5);doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);
    var openLines=doc.splitTextToSize("We are pleased to offer you the position of "+(emp.role||"Employee")+" at "+(org.name||"our organization")+". This letter confirms the terms of your employment.",W-mg*2);
    doc.text(openLines,mg,ry);ry+=openLines.length*5.5+8;
    var rows2=[["Position",emp.role||"-"],["Department",emp.dept||"-"],["Date of Joining",emp.joined?new Date(emp.joined+"T00:00:00").toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"}):"-"],["Employee ID",emp.eid||"To be assigned"],["Monthly CTC",fmtIN(Number(emp.fixedSalary||emp.monthlyCTC||0))],["Annual CTC",fmtIN(Number(emp.fixedSalary||emp.monthlyCTC||0)*12)],["Employment Type","Full-Time, Permanent"],["Probation Period","3 months from date of joining"],["Leave Entitlement",emp.leaveEntitlement?emp.leaveEntitlement+" days paid leave per year":"As per company policy"]];
    doc.setFontSize(8.5);doc.setFont("helvetica","bold");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);doc.text("TERMS OF EMPLOYMENT",mg,ry);ry+=2;
    doc.setDrawColor(RULE[0],RULE[1],RULE[2]);doc.setLineWidth(0.4);doc.line(mg,ry+1.5,W-mg,ry+1.5);ry+=7;
    rows2.forEach(function(row){doc.setFont("helvetica","normal");doc.setTextColor(MUT[0],MUT[1],MUT[2]);doc.setFontSize(8.5);doc.text(row[0],mg,ry+3.5);doc.setFont("helvetica","bold");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);doc.text(String(row[1]),mg+85,ry+3.5);doc.setDrawColor(235,239,245);doc.setLineWidth(0.3);doc.line(mg,ry+6.5,W-mg,ry+6.5);ry+=7;});
    ry+=10;var sigY=Math.max(ry,228);
    doc.setDrawColor(180,188,202);doc.setLineWidth(0.4);doc.line(mg,sigY,mg+60,sigY);doc.line(W-mg-60,sigY,W-mg,sigY);
    doc.setFontSize(8.5);doc.setFont("helvetica","bold");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);doc.text(authSign2||org.name||"Authorised Signatory",mg,sigY+5);doc.text(emp.name,W-mg-60,sigY+5);
    doc.setFont("helvetica","normal");doc.setTextColor(MUT[0],MUT[1],MUT[2]);doc.text(authPos2||"Authorised Signatory",mg,sigY+9);doc.text("Employee Signature",W-mg-60,sigY+9);
    doc.setDrawColor(RULE[0],RULE[1],RULE[2]);doc.setLineWidth(0.4);doc.line(mg,283,W-mg,283);
    doc.setFontSize(7.5);doc.setTextColor(MUT[0],MUT[1],MUT[2]);doc.text((org.name||""),mg,288);doc.text("Generated by Admin HR",W-mg,288,{align:"right"});
    downloadPDF(doc.output("blob"),"Offer-Letter-"+(emp.name||"Employee").replace(/s/g,"-")+".pdf");showT("Offer letter downloaded");
  },function(){showT("PDF library error","err");});
}


function makeExperienceLetterPDF(emp,org,authPos2,authSign2){
  loadJsPDFGlobal(function(JsPDF){
    var doc=new JsPDF({orientation:"portrait",unit:"mm",format:"a4"});
    var W=210,mg=22,ry=18;
    var NVYC=[15,23,42],MUT=[71,85,105],RULE=[210,218,230];
    var logoW=0;
    if(org.logo&&String(org.logo).indexOf("data:")===0){
      try{doc.setFillColor(255,255,255);doc.roundedRect(mg,ry-6,18,18,3,3,"F");doc.addImage(org.logo,"PNG",mg,ry-6,18,18,undefined,"FAST");logoW=22;}catch(e){}
    }
    doc.setFontSize(16);doc.setFont("helvetica","bold");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);doc.text(org.name||"Company",mg+logoW,ry);
    doc.setFontSize(8.5);doc.setFont("helvetica","normal");doc.setTextColor(MUT[0],MUT[1],MUT[2]);
    var addrShown=false;
    if(org.address){var addrL=org.address.split("\n")[0];doc.text(addrL,mg+logoW,ry+5.5);addrShown=true;}
    var contactLine=orgContactLine(org);
    if(contactLine)doc.text(contactLine,mg+logoW,ry+(addrShown?10:5.5));
    doc.setFontSize(9);doc.text(new Date().toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"}),W-mg,ry,{align:"right"});
    ry+=(addrShown&&contactLine?15.5:(addrShown||contactLine?11:6));doc.setDrawColor(RULE[0],RULE[1],RULE[2]);doc.setLineWidth(0.6);doc.line(mg,ry,W-mg,ry);ry+=12;
    doc.setFontSize(14);doc.setFont("helvetica","bold");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);doc.text("EXPERIENCE CERTIFICATE",W/2,ry,{align:"center"});ry+=2;
    doc.setDrawColor(NVYC[0],NVYC[1],NVYC[2]);doc.setLineWidth(0.8);doc.line(W/2-22,ry+2,W/2+22,ry+2);ry+=14;
    doc.setFontSize(11);doc.setFont("helvetica","normal");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);doc.text("To Whomsoever It May Concern,",mg,ry);ry+=10;
    var joined=emp.joined?new Date(emp.joined+"T00:00:00").toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"}):"-";
    var relieved=new Date().toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"});
    var body="This is to certify that "+emp.name+" (Employee ID: "+(emp.eid||"N/A")+") was employed with "+
      (org.name||"our organization")+" as "+( emp.role||"Employee")+
      (emp.dept?" in the "+emp.dept+" department":"")+
      " from "+joined+" to "+relieved+".";
    doc.setFontSize(10.5);doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);
    var lines=doc.splitTextToSize(body,W-mg*2);doc.text(lines,mg,ry);ry+=lines.length*5.5+6;
    var body2="During the tenure, "+emp.name+" has shown dedication, professionalism and commitment to work. We found "+emp.name+" to be a sincere and hardworking individual. We wish "+(emp.name)+" all the best in future endeavours.";
    var lines2=doc.splitTextToSize(body2,W-mg*2);doc.text(lines2,mg,ry);ry+=lines2.length*5.5+22;
    // Two signature blocks: Authorised Signatory (left) + HR Department (right)
    doc.setDrawColor(180,188,202);doc.setLineWidth(0.4);
    doc.line(mg,ry,mg+62,ry);doc.line(W-mg-62,ry,W-mg,ry);
    doc.setFontSize(8.5);doc.setFont("helvetica","bold");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);
    doc.text(authSign2||"Authorised Signatory",mg,ry+5);doc.text("HR Department",W-mg-62,ry+5);
    doc.setFont("helvetica","normal");doc.setTextColor(MUT[0],MUT[1],MUT[2]);
    doc.text(authPos2||"Authorised Signatory",mg,ry+9);doc.text(org.name||"",W-mg-62,ry+9);
    doc.setDrawColor(RULE[0],RULE[1],RULE[2]);doc.setLineWidth(0.4);doc.line(mg,283,W-mg,283);
    doc.setFontSize(7.5);doc.setTextColor(MUT[0],MUT[1],MUT[2]);doc.text((org.name||""),mg,288);doc.text("Generated by Admin HR",W-mg,288,{align:"right"});
    downloadPDF(doc.output("blob"),"Experience-Certificate-"+(emp.name||"").replace(/s/g,"-")+".pdf");showT("Experience letter downloaded");
  },function(){showT("PDF error","err");});
}

function makeRelievingLetterPDF(emp,org,authPos2,authSign2){
  loadJsPDFGlobal(function(JsPDF){
    var doc=new JsPDF({orientation:"portrait",unit:"mm",format:"a4"});
    var W=210,mg=22,ry=18;
    var NVYC=[15,23,42],MUT=[71,85,105],RULE=[210,218,230];
    var logoW=0;
    if(org.logo&&String(org.logo).indexOf("data:")===0){
      try{doc.setFillColor(255,255,255);doc.roundedRect(mg,ry-6,18,18,3,3,"F");doc.addImage(org.logo,"PNG",mg,ry-6,18,18,undefined,"FAST");logoW=22;}catch(e){}
    }
    doc.setFontSize(16);doc.setFont("helvetica","bold");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);doc.text(org.name||"Company",mg+logoW,ry);
    doc.setFontSize(8.5);doc.setFont("helvetica","normal");doc.setTextColor(MUT[0],MUT[1],MUT[2]);
    var addrShown=false;
    if(org.address){var addrL=org.address.split("\n")[0];doc.text(addrL,mg+logoW,ry+5.5);addrShown=true;}
    var contactLine=orgContactLine(org);
    if(contactLine)doc.text(contactLine,mg+logoW,ry+(addrShown?10:5.5));
    doc.setFontSize(9);doc.text(new Date().toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"}),W-mg,ry,{align:"right"});
    ry+=(addrShown&&contactLine?15.5:(addrShown||contactLine?11:6));doc.setDrawColor(RULE[0],RULE[1],RULE[2]);doc.setLineWidth(0.6);doc.line(mg,ry,W-mg,ry);ry+=12;
    doc.setFontSize(14);doc.setFont("helvetica","bold");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);doc.text("RELIEVING LETTER",W/2,ry,{align:"center"});ry+=2;
    doc.setDrawColor(NVYC[0],NVYC[1],NVYC[2]);doc.setLineWidth(0.8);doc.line(W/2-18,ry+2,W/2+18,ry+2);ry+=14;
    doc.setFontSize(11);doc.setFont("helvetica","normal");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);doc.text("Dear "+emp.name+",",mg,ry);ry+=10;
    var relievedDate=new Date().toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"});
    var joined=emp.joined?new Date(emp.joined+"T00:00:00").toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"}):"-";
    var body="This is to confirm that your resignation has been accepted and you have been officially relieved from the position of "+
      (emp.role||"Employee")+(emp.dept?" - "+emp.dept+" Department":"")+
      " effective "+relievedDate+". You joined "+( org.name||"our organization")+" on "+joined+".";
    doc.setFontSize(10.5);doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);
    var lines=doc.splitTextToSize(body,W-mg*2);doc.text(lines,mg,ry);ry+=lines.length*5.5+6;
    var body2="We confirm that you have completed all required handover procedures and have no dues outstanding with the organization. We appreciate your contributions and wish you success in your future endeavours.";
    var lines2=doc.splitTextToSize(body2,W-mg*2);doc.text(lines2,mg,ry);ry+=lines2.length*5.5+22;
    // Two signature blocks: Authorised Signatory (left) + HR Department (right)
    doc.setDrawColor(180,188,202);doc.setLineWidth(0.4);
    doc.line(mg,ry,mg+62,ry);doc.line(W-mg-62,ry,W-mg,ry);
    doc.setFontSize(8.5);doc.setFont("helvetica","bold");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);
    doc.text(authSign2||"Authorised Signatory",mg,ry+5);doc.text("HR Department",W-mg-62,ry+5);
    doc.setFont("helvetica","normal");doc.setTextColor(MUT[0],MUT[1],MUT[2]);
    doc.text(authPos2||"Authorised Signatory",mg,ry+9);doc.text(org.name||"",W-mg-62,ry+9);
    doc.setDrawColor(RULE[0],RULE[1],RULE[2]);doc.setLineWidth(0.4);doc.line(mg,283,W-mg,283);
    doc.setFontSize(7.5);doc.setTextColor(MUT[0],MUT[1],MUT[2]);doc.text((org.name||""),mg,288);doc.text("Generated by Admin HR",W-mg,288,{align:"right"});
    downloadPDF(doc.output("blob"),"Relieving-Letter-"+(emp.name||"").replace(/s/g,"-")+".pdf");showT("Relieving letter downloaded");
  },function(){showT("PDF error","err");});
}

// ── Confirmation Letter — issued when probation period is successfully completed ──
function makeConfirmationLetterPDF(emp,org,authPos2,authSign2,probationMonths){
  loadJsPDFGlobal(function(JsPDF){
    var doc=new JsPDF({orientation:"portrait",unit:"mm",format:"a4"});
    var W=210,mg=22,ry=18;
    var NVYC=[15,23,42],MUT=[71,85,105],RULE=[210,218,230];
    var logoW=0;
    if(org.logo&&String(org.logo).indexOf("data:")===0){
      try{doc.setFillColor(255,255,255);doc.roundedRect(mg,ry-6,18,18,3,3,"F");doc.addImage(org.logo,"PNG",mg,ry-6,18,18,undefined,"FAST");logoW=22;}catch(e){}
    }
    doc.setFontSize(16);doc.setFont("helvetica","bold");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);doc.text(org.name||"Company",mg+logoW,ry);
    doc.setFontSize(8.5);doc.setFont("helvetica","normal");doc.setTextColor(MUT[0],MUT[1],MUT[2]);
    var addrShown=false;
    if(org.address){var addrL=org.address.split("\n")[0];doc.text(addrL,mg+logoW,ry+5.5);addrShown=true;}
    var contactLine=orgContactLine(org);
    if(contactLine)doc.text(contactLine,mg+logoW,ry+(addrShown?10:5.5));
    doc.setFontSize(9);doc.text(new Date().toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"}),W-mg,ry,{align:"right"});
    ry+=(addrShown&&contactLine?15.5:(addrShown||contactLine?11:6));doc.setDrawColor(RULE[0],RULE[1],RULE[2]);doc.setLineWidth(0.6);doc.line(mg,ry,W-mg,ry);ry+=12;
    doc.setFontSize(14);doc.setFont("helvetica","bold");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);doc.text("LETTER OF CONFIRMATION",W/2,ry,{align:"center"});ry+=2;
    doc.setDrawColor(NVYC[0],NVYC[1],NVYC[2]);doc.setLineWidth(0.8);doc.line(W/2-26,ry+2,W/2+26,ry+2);ry+=14;
    doc.setFontSize(11);doc.setFont("helvetica","normal");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);doc.text("Dear "+emp.name+",",mg,ry);ry+=8;
    var joined=emp.joined?new Date(emp.joined+"T00:00:00").toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"}):"-";
    var today=new Date().toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"});
    var pm=probationMonths||3;
    var body="We are pleased to inform you that you have successfully completed your probation period of "+pm+" month(s), which commenced on "+joined+". Your performance and conduct during this period have been found satisfactory.";
    doc.setFontSize(10.5);doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);
    var lines=doc.splitTextToSize(body,W-mg*2);doc.text(lines,mg,ry);ry+=lines.length*5.5+6;
    var body2="We are happy to confirm your services with "+(org.name||"our organization")+" as "+(emp.role||"Employee")+(emp.dept?" in the "+emp.dept+" department":"")+", effective "+today+". You will continue to be governed by the company's policies and service rules applicable to confirmed employees.";
    var lines2=doc.splitTextToSize(body2,W-mg*2);doc.text(lines2,mg,ry);ry+=lines2.length*5.5+6;
    var body3="We take this opportunity to congratulate you and look forward to your continued contribution to the organization.";
    var lines3=doc.splitTextToSize(body3,W-mg*2);doc.text(lines3,mg,ry);ry+=lines3.length*5.5+22;
    // Two signature blocks: Authorised Signatory (left) + HR Department (right)
    doc.setDrawColor(180,188,202);doc.setLineWidth(0.4);
    doc.line(mg,ry,mg+62,ry);doc.line(W-mg-62,ry,W-mg,ry);
    doc.setFontSize(8.5);doc.setFont("helvetica","bold");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);
    doc.text(authSign2||"Authorised Signatory",mg,ry+5);doc.text("HR Department",W-mg-62,ry+5);
    doc.setFont("helvetica","normal");doc.setTextColor(MUT[0],MUT[1],MUT[2]);
    doc.text(authPos2||"Authorised Signatory",mg,ry+9);doc.text(org.name||"",W-mg-62,ry+9);
    doc.setDrawColor(RULE[0],RULE[1],RULE[2]);doc.setLineWidth(0.4);doc.line(mg,283,W-mg,283);
    doc.setFontSize(7.5);doc.setTextColor(MUT[0],MUT[1],MUT[2]);doc.text((org.name||""),mg,288);doc.text("Generated by Admin HR",W-mg,288,{align:"right"});
    downloadPDF(doc.output("blob"),"Confirmation-Letter-"+(emp.name||"").replace(/s/g,"-")+".pdf");showT("Confirmation letter downloaded");
  },function(){showT("PDF error","err");});
}

// ── No Objection Certificate (NOC) — issued for a stated purpose (loan, visa, passport, etc.) ──
function makeNOCPDF(emp,org,authPos2,authSign2,purpose){
  loadJsPDFGlobal(function(JsPDF){
    var doc=new JsPDF({orientation:"portrait",unit:"mm",format:"a4"});
    var W=210,mg=22,ry=18;
    var NVYC=[15,23,42],MUT=[71,85,105],RULE=[210,218,230];
    var logoW=0;
    if(org.logo&&String(org.logo).indexOf("data:")===0){
      try{doc.setFillColor(255,255,255);doc.roundedRect(mg,ry-6,18,18,3,3,"F");doc.addImage(org.logo,"PNG",mg,ry-6,18,18,undefined,"FAST");logoW=22;}catch(e){}
    }
    doc.setFontSize(16);doc.setFont("helvetica","bold");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);doc.text(org.name||"Company",mg+logoW,ry);
    doc.setFontSize(8.5);doc.setFont("helvetica","normal");doc.setTextColor(MUT[0],MUT[1],MUT[2]);
    var addrShown=false;
    if(org.address){var addrL=org.address.split("\n")[0];doc.text(addrL,mg+logoW,ry+5.5);addrShown=true;}
    var contactLine=orgContactLine(org);
    if(contactLine)doc.text(contactLine,mg+logoW,ry+(addrShown?10:5.5));
    doc.setFontSize(9);doc.text(new Date().toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"}),W-mg,ry,{align:"right"});
    ry+=(addrShown&&contactLine?15.5:(addrShown||contactLine?11:6));doc.setDrawColor(RULE[0],RULE[1],RULE[2]);doc.setLineWidth(0.6);doc.line(mg,ry,W-mg,ry);ry+=12;
    doc.setFontSize(14);doc.setFont("helvetica","bold");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);doc.text("NO OBJECTION CERTIFICATE",W/2,ry,{align:"center"});ry+=2;
    doc.setDrawColor(NVYC[0],NVYC[1],NVYC[2]);doc.setLineWidth(0.8);doc.line(W/2-28,ry+2,W/2+28,ry+2);ry+=14;
    doc.setFontSize(11);doc.setFont("helvetica","normal");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);doc.text("To Whomsoever It May Concern,",mg,ry);ry+=10;
    var joined=emp.joined?new Date(emp.joined+"T00:00:00").toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"}):"-";
    var purposeText=purpose&&purpose.trim()?purpose.trim():"personal purposes";
    var body="This is to certify that "+emp.name+" (Employee ID: "+(emp.eid||"N/A")+"), "+(emp.role||"Employee")+(emp.dept?" in the "+emp.dept+" department":"")+", has been employed with "+(org.name||"our organization")+" since "+joined+".";
    doc.setFontSize(10.5);doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);
    var lines=doc.splitTextToSize(body,W-mg*2);doc.text(lines,mg,ry);ry+=lines.length*5.5+6;
    var body2=(org.name||"This organization")+" has no objection to "+emp.name+" applying for / obtaining "+purposeText+".";
    var lines2=doc.splitTextToSize(body2,W-mg*2);doc.text(lines2,mg,ry);ry+=lines2.length*5.5+6;
    var body3="This certificate is issued at the request of the employee for the purpose stated above.";
    var lines3=doc.splitTextToSize(body3,W-mg*2);doc.text(lines3,mg,ry);ry+=lines3.length*5.5+22;
    // Two signature blocks: Authorised Signatory (left) + HR Department (right)
    doc.setDrawColor(180,188,202);doc.setLineWidth(0.4);
    doc.line(mg,ry,mg+62,ry);doc.line(W-mg-62,ry,W-mg,ry);
    doc.setFontSize(8.5);doc.setFont("helvetica","bold");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);
    doc.text(authSign2||"Authorised Signatory",mg,ry+5);doc.text("HR Department",W-mg-62,ry+5);
    doc.setFont("helvetica","normal");doc.setTextColor(MUT[0],MUT[1],MUT[2]);
    doc.text(authPos2||"Authorised Signatory",mg,ry+9);doc.text(org.name||"",W-mg-62,ry+9);
    doc.setDrawColor(RULE[0],RULE[1],RULE[2]);doc.setLineWidth(0.4);doc.line(mg,283,W-mg,283);
    doc.setFontSize(7.5);doc.setTextColor(MUT[0],MUT[1],MUT[2]);doc.text((org.name||""),mg,288);doc.text("Generated by Admin HR",W-mg,288,{align:"right"});
    downloadPDF(doc.output("blob"),"NOC-"+(emp.name||"").replace(/s/g,"-")+".pdf");showT("NOC downloaded");
  },function(){showT("PDF error","err");});
}

// ── Employment Verification Letter — confirms CURRENT employment (unlike Experience Certificate, which is for past/ending employment) ──
function makeEmploymentVerificationPDF(emp,org,authPos2,authSign2){
  loadJsPDFGlobal(function(JsPDF){
    var doc=new JsPDF({orientation:"portrait",unit:"mm",format:"a4"});
    var W=210,mg=22,ry=18;
    var NVYC=[15,23,42],MUT=[71,85,105],RULE=[210,218,230];
    var logoW=0;
    if(org.logo&&String(org.logo).indexOf("data:")===0){
      try{doc.setFillColor(255,255,255);doc.roundedRect(mg,ry-6,18,18,3,3,"F");doc.addImage(org.logo,"PNG",mg,ry-6,18,18,undefined,"FAST");logoW=22;}catch(e){}
    }
    doc.setFontSize(16);doc.setFont("helvetica","bold");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);doc.text(org.name||"Company",mg+logoW,ry);
    doc.setFontSize(8.5);doc.setFont("helvetica","normal");doc.setTextColor(MUT[0],MUT[1],MUT[2]);
    var addrShown=false;
    if(org.address){var addrL=org.address.split("\n")[0];doc.text(addrL,mg+logoW,ry+5.5);addrShown=true;}
    var contactLine=orgContactLine(org);
    if(contactLine)doc.text(contactLine,mg+logoW,ry+(addrShown?10:5.5));
    doc.setFontSize(9);doc.text(new Date().toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"}),W-mg,ry,{align:"right"});
    ry+=(addrShown&&contactLine?15.5:(addrShown||contactLine?11:6));doc.setDrawColor(RULE[0],RULE[1],RULE[2]);doc.setLineWidth(0.6);doc.line(mg,ry,W-mg,ry);ry+=12;
    doc.setFontSize(14);doc.setFont("helvetica","bold");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);doc.text("EMPLOYMENT VERIFICATION LETTER",W/2,ry,{align:"center"});ry+=2;
    doc.setDrawColor(NVYC[0],NVYC[1],NVYC[2]);doc.setLineWidth(0.8);doc.line(W/2-34,ry+2,W/2+34,ry+2);ry+=14;
    doc.setFontSize(11);doc.setFont("helvetica","normal");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);doc.text("To Whomsoever It May Concern,",mg,ry);ry+=10;
    var joined=emp.joined?new Date(emp.joined+"T00:00:00").toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"}):"-";
    var ctc=Number(emp.fixedSalary||emp.monthlyCTC||0);
    var body="This is to certify that "+emp.name+" (Employee ID: "+(emp.eid||"N/A")+") is currently employed with "+(org.name||"our organization")+" as "+(emp.role||"Employee")+(emp.dept?" in the "+emp.dept+" department":"")+", since "+joined+". This employment is active as of the date of this letter.";
    doc.setFontSize(10.5);doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);
    var lines=doc.splitTextToSize(body,W-mg*2);doc.text(lines,mg,ry);ry+=lines.length*5.5+8;
    var rows2=[["Employee Name",emp.name||"-"],["Designation",emp.role||"-"],["Department",emp.dept||"-"],["Date of Joining",joined],["Current Monthly CTC",ctc?fmtIN(ctc):"-"],["Employment Status","Active / Currently Employed"]];
    doc.setFontSize(8.5);doc.setFont("helvetica","bold");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);doc.text("VERIFICATION DETAILS",mg,ry);ry+=2;
    doc.setDrawColor(RULE[0],RULE[1],RULE[2]);doc.setLineWidth(0.4);doc.line(mg,ry+1.5,W-mg,ry+1.5);ry+=7;
    rows2.forEach(function(row){doc.setFont("helvetica","normal");doc.setTextColor(MUT[0],MUT[1],MUT[2]);doc.setFontSize(8.5);doc.text(row[0],mg,ry+3.5);doc.setFont("helvetica","bold");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);doc.text(String(row[1]),mg+85,ry+3.5);doc.setDrawColor(235,239,245);doc.setLineWidth(0.3);doc.line(mg,ry+6.5,W-mg,ry+6.5);ry+=7;});
    ry+=10;
    var body2="This letter is issued at the request of the employee for verification purposes.";
    var lines2=doc.splitTextToSize(body2,W-mg*2);doc.text(lines2,mg,ry);ry+=lines2.length*5.5+16;
    // Two signature blocks: Authorised Signatory (left) + HR Department (right)
    var sigY=Math.max(ry,228);
    doc.setDrawColor(180,188,202);doc.setLineWidth(0.4);
    doc.line(mg,sigY,mg+62,sigY);doc.line(W-mg-62,sigY,W-mg,sigY);
    doc.setFontSize(8.5);doc.setFont("helvetica","bold");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);
    doc.text(authSign2||"Authorised Signatory",mg,sigY+5);doc.text("HR Department",W-mg-62,sigY+5);
    doc.setFont("helvetica","normal");doc.setTextColor(MUT[0],MUT[1],MUT[2]);
    doc.text(authPos2||"Authorised Signatory",mg,sigY+9);doc.text(org.name||"",W-mg-62,sigY+9);
    doc.setDrawColor(RULE[0],RULE[1],RULE[2]);doc.setLineWidth(0.4);doc.line(mg,283,W-mg,283);
    doc.setFontSize(7.5);doc.setTextColor(MUT[0],MUT[1],MUT[2]);doc.text((org.name||""),mg,288);doc.text("Generated by Admin HR",W-mg,288,{align:"right"});
    downloadPDF(doc.output("blob"),"Employment-Verification-"+(emp.name||"").replace(/s/g,"-")+".pdf");showT("Employment verification letter downloaded");
  },function(){showT("PDF error","err");});
}

// ── Termination Letter (for cause) — distinct from Relieving Letter, which uses resignation-acceptance language ──
function makeTerminationLetterPDF(emp,org,authPos2,authSign2,reason,lastDay,note){
  loadJsPDFGlobal(function(JsPDF){
    var doc=new JsPDF({orientation:"portrait",unit:"mm",format:"a4"});
    var W=210,mg=22,ry=18;
    var NVYC=[15,23,42],MUT=[71,85,105],RULE=[210,218,230];
    var logoW=0;
    if(org.logo&&String(org.logo).indexOf("data:")===0){
      try{doc.setFillColor(255,255,255);doc.roundedRect(mg,ry-6,18,18,3,3,"F");doc.addImage(org.logo,"PNG",mg,ry-6,18,18,undefined,"FAST");logoW=22;}catch(e){}
    }
    doc.setFontSize(16);doc.setFont("helvetica","bold");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);doc.text(org.name||"Company",mg+logoW,ry);
    doc.setFontSize(8.5);doc.setFont("helvetica","normal");doc.setTextColor(MUT[0],MUT[1],MUT[2]);
    var addrShown=false;
    if(org.address){var addrL=org.address.split("\n")[0];doc.text(addrL,mg+logoW,ry+5.5);addrShown=true;}
    var contactLine=orgContactLine(org);
    if(contactLine)doc.text(contactLine,mg+logoW,ry+(addrShown?10:5.5));
    doc.setFontSize(9);doc.text(new Date().toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"}),W-mg,ry,{align:"right"});
    ry+=(addrShown&&contactLine?15.5:(addrShown||contactLine?11:6));doc.setDrawColor(RULE[0],RULE[1],RULE[2]);doc.setLineWidth(0.6);doc.line(mg,ry,W-mg,ry);ry+=12;
    doc.setFontSize(14);doc.setFont("helvetica","bold");doc.setTextColor(180,30,30);doc.text("TERMINATION OF EMPLOYMENT",W/2,ry,{align:"center"});ry+=2;
    doc.setDrawColor(180,30,30);doc.setLineWidth(0.8);doc.line(W/2-38,ry+2,W/2+38,ry+2);ry+=14;
    doc.setFontSize(11);doc.setFont("helvetica","normal");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);doc.text("Dear "+emp.name+",",mg,ry);ry+=8;
    var lastDayFmt=lastDay?new Date(lastDay+"T00:00:00").toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"}):new Date().toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"});
    var body="This letter is to formally notify you that your employment with "+(org.name||"our organization")+" as "+(emp.role||"Employee")+(emp.dept?" in the "+emp.dept+" department":"")+" is terminated with effect from "+lastDayFmt+", for the following reason(s):";
    doc.setFontSize(10.5);doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);
    var lines=doc.splitTextToSize(body,W-mg*2);doc.text(lines,mg,ry);ry+=lines.length*5.5+6;
    doc.setFont("helvetica","bold");
    var reasonLines=doc.splitTextToSize(reason||"As per company policy and conduct standards.",W-mg*2);doc.text(reasonLines,mg,ry);ry+=reasonLines.length*5.5+8;
    doc.setFont("helvetica","normal");
    var body2="You are required to complete all handover formalities and return any company property in your possession on or before the last working day. Your full and final settlement will be processed as per company policy, subject to completion of exit formalities and clearance.";
    var lines2=doc.splitTextToSize(body2,W-mg*2);doc.text(lines2,mg,ry);ry+=lines2.length*5.5+6;
    if(note){
      var lines3=doc.splitTextToSize(note,W-mg*2);doc.text(lines3,mg,ry);ry+=lines3.length*5.5+6;
    }
    ry+=14;
    // Two signature blocks: Authorised Signatory (left) + HR Department (right)
    var sigY=Math.max(ry,228);
    doc.setDrawColor(180,188,202);doc.setLineWidth(0.4);
    doc.line(mg,sigY,mg+62,sigY);doc.line(W-mg-62,sigY,W-mg,sigY);
    doc.setFontSize(8.5);doc.setFont("helvetica","bold");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);
    doc.text(authSign2||"Authorised Signatory",mg,sigY+5);doc.text("HR Department",W-mg-62,sigY+5);
    doc.setFont("helvetica","normal");doc.setTextColor(MUT[0],MUT[1],MUT[2]);
    doc.text(authPos2||"Authorised Signatory",mg,sigY+9);doc.text(org.name||"",W-mg-62,sigY+9);
    doc.setDrawColor(RULE[0],RULE[1],RULE[2]);doc.setLineWidth(0.4);doc.line(mg,283,W-mg,283);
    doc.setFontSize(7.5);doc.setTextColor(MUT[0],MUT[1],MUT[2]);doc.text((org.name||""),mg,288);doc.text("Generated by Admin HR",W-mg,288,{align:"right"});
    downloadPDF(doc.output("blob"),"Termination-Letter-"+(emp.name||"").replace(/s/g,"-")+".pdf");showT("Termination letter downloaded");
  },function(){showT("PDF error","err");});
}

// ── Full & Final Settlement Statement — itemized payout at offboarding (pending salary, leave encashment, gratuity, less dues) ──
function makeFnFSettlementPDF(emp,org,authPos2,authSign2,data){
  loadJsPDFGlobal(function(JsPDF){
    var doc=new JsPDF({orientation:"portrait",unit:"mm",format:"a4"});
    var W=210,mg=22,ry=18;
    var NVYC=[15,23,42],MUT=[71,85,105],RULE=[210,218,230];
    var logoW=0;
    if(org.logo&&String(org.logo).indexOf("data:")===0){
      try{doc.setFillColor(255,255,255);doc.roundedRect(mg,ry-6,18,18,3,3,"F");doc.addImage(org.logo,"PNG",mg,ry-6,18,18,undefined,"FAST");logoW=22;}catch(e){}
    }
    doc.setFontSize(16);doc.setFont("helvetica","bold");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);doc.text(org.name||"Company",mg+logoW,ry);
    doc.setFontSize(8.5);doc.setFont("helvetica","normal");doc.setTextColor(MUT[0],MUT[1],MUT[2]);
    var addrShown=false;
    if(org.address){var addrL=org.address.split("\n")[0];doc.text(addrL,mg+logoW,ry+5.5);addrShown=true;}
    var contactLine=orgContactLine(org);
    if(contactLine)doc.text(contactLine,mg+logoW,ry+(addrShown?10:5.5));
    doc.setFontSize(9);doc.text(new Date().toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"}),W-mg,ry,{align:"right"});
    ry+=(addrShown&&contactLine?15.5:(addrShown||contactLine?11:6));doc.setDrawColor(RULE[0],RULE[1],RULE[2]);doc.setLineWidth(0.6);doc.line(mg,ry,W-mg,ry);ry+=12;
    doc.setFontSize(14);doc.setFont("helvetica","bold");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);doc.text("FULL & FINAL SETTLEMENT STATEMENT",W/2,ry,{align:"center"});ry+=2;
    doc.setDrawColor(NVYC[0],NVYC[1],NVYC[2]);doc.setLineWidth(0.8);doc.line(W/2-44,ry+2,W/2+44,ry+2);ry+=14;

    var lwdFmt=data.lwd?new Date(data.lwd+"T00:00:00").toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"}):"-";
    var joined=emp.joined?new Date(emp.joined+"T00:00:00").toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"}):"-";
    var infoRows=[["Employee Name",emp.name||"-"],["Employee ID",emp.eid||"-"],["Department",emp.dept||"-"],["Date of Joining",joined],["Last Working Day",lwdFmt]];
    doc.setFontSize(8.5);doc.setFont("helvetica","bold");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);doc.text("EMPLOYEE DETAILS",mg,ry);ry+=2;
    doc.setDrawColor(RULE[0],RULE[1],RULE[2]);doc.setLineWidth(0.4);doc.line(mg,ry+1.5,W-mg,ry+1.5);ry+=7;
    infoRows.forEach(function(row){doc.setFont("helvetica","normal");doc.setTextColor(MUT[0],MUT[1],MUT[2]);doc.setFontSize(8.5);doc.text(row[0],mg,ry+3.5);doc.setFont("helvetica","bold");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);doc.text(String(row[1]),mg+85,ry+3.5);doc.setDrawColor(235,239,245);doc.setLineWidth(0.3);doc.line(mg,ry+6.5,W-mg,ry+6.5);ry+=7;});
    ry+=10;

    doc.setFontSize(8.5);doc.setFont("helvetica","bold");doc.setTextColor(5,120,80);doc.text("AMOUNTS PAYABLE",mg,ry);ry+=2;
    doc.setDrawColor(RULE[0],RULE[1],RULE[2]);doc.setLineWidth(0.4);doc.line(mg,ry+1.5,W-mg,ry+1.5);ry+=7;
    var payRows=[["Pending Salary (last working month)",fmtIN(data.pendingSalary||0)],["Leave Encashment ("+(data.leaveBal||0)+" day(s))",fmtIN(data.leaveEncash||0)]];
    if(data.gratuity&&data.gratuity.eligible)payRows.push(["Gratuity ("+data.gratuity.roundedYears+" yrs service)",fmtIN(data.gratuity.amount||0)]);
    payRows.forEach(function(row,i){if(i%2===0){doc.setFillColor(248,250,253);doc.rect(mg,ry-1,W-mg*2,7,"F");}doc.setFont("helvetica","normal");doc.setTextColor(MUT[0],MUT[1],MUT[2]);doc.setFontSize(8.5);doc.text(row[0],mg+2,ry+4);doc.setFont("helvetica","bold");doc.setTextColor(5,120,80);doc.text(row[1],W-mg-2,ry+4,{align:"right"});ry+=7;});
    var totalPayable=(data.pendingSalary||0)+(data.leaveEncash||0)+((data.gratuity&&data.gratuity.eligible)?data.gratuity.amount:0);
    ry+=2;doc.setDrawColor(180,195,215);doc.setLineWidth(0.4);doc.line(mg,ry,W-mg,ry);ry+=6;
    doc.setFontSize(9);doc.setFont("helvetica","bold");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);doc.text("Total Payable",mg+2,ry);doc.setTextColor(5,120,80);doc.text(fmtIN(totalPayable),W-mg-2,ry,{align:"right"});ry+=12;

    doc.setFontSize(8.5);doc.setFont("helvetica","bold");doc.setTextColor(180,30,30);doc.text("DEDUCTIONS / DUES",mg,ry);ry+=2;
    doc.setDrawColor(RULE[0],RULE[1],RULE[2]);doc.setLineWidth(0.4);doc.line(mg,ry+1.5,W-mg,ry+1.5);ry+=7;
    doc.setFillColor(248,250,253);doc.rect(mg,ry-1,W-mg*2,7,"F");
    doc.setFont("helvetica","normal");doc.setTextColor(MUT[0],MUT[1],MUT[2]);doc.setFontSize(8.5);doc.text("Outstanding Loans / Advances / Other Dues",mg+2,ry+4);
    doc.setFont("helvetica","bold");doc.setTextColor(180,30,30);doc.text("-"+fmtIN(data.dues||0),W-mg-2,ry+4,{align:"right"});ry+=7;
    ry+=2;doc.setDrawColor(180,195,215);doc.setLineWidth(0.4);doc.line(mg,ry,W-mg,ry);ry+=6;

    var net=Math.max(0,totalPayable-(data.dues||0));
    doc.setFillColor(232,248,240);doc.roundedRect(mg,ry,W-mg*2,14,2,2,"F");
    doc.setFontSize(11);doc.setFont("helvetica","bold");doc.setTextColor(5,120,80);
    doc.text("NET SETTLEMENT AMOUNT",mg+5,ry+9);
    doc.text(fmtIN(net),W-mg-5,ry+9,{align:"right"});
    ry+=14+18;

    if(ry>228){doc.addPage();ry=20;}
    // Two signature blocks: Authorised Signatory (left) + HR Department (right)
    doc.setDrawColor(180,188,202);doc.setLineWidth(0.4);
    doc.line(mg,ry,mg+62,ry);doc.line(W-mg-62,ry,W-mg,ry);
    doc.setFontSize(8.5);doc.setFont("helvetica","bold");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);
    doc.text(authSign2||"Authorised Signatory",mg,ry+5);doc.text("HR Department",W-mg-62,ry+5);
    doc.setFont("helvetica","normal");doc.setTextColor(MUT[0],MUT[1],MUT[2]);
    doc.text(authPos2||"Authorised Signatory",mg,ry+9);doc.text(org.name||"",W-mg-62,ry+9);
    doc.setDrawColor(RULE[0],RULE[1],RULE[2]);doc.setLineWidth(0.4);doc.line(mg,283,W-mg,283);
    doc.setFontSize(7.5);doc.setTextColor(MUT[0],MUT[1],MUT[2]);doc.text((org.name||""),mg,288);doc.text("Generated by Admin HR",W-mg,288,{align:"right"});
    downloadPDF(doc.output("blob"),"FnF-Settlement-"+(emp.name||"").replace(/s/g,"-")+".pdf");showT("Settlement statement downloaded");
  },function(){showT("PDF error","err");});
}

// ── Appointment Letter — issued post-joining once the employee ID is assigned; distinct from the conditional, pre-joining Offer Letter ──
function makeAppointmentLetterPDF(emp,org,authPos2,authSign2){
  loadJsPDFGlobal(function(JsPDF){
    var doc=new JsPDF({orientation:"portrait",unit:"mm",format:"a4"});
    var W=210,mg=22,ry=18;
    var NVYC=[15,23,42],MUT=[71,85,105],RULE=[210,218,230];
    var logoW=0;
    if(org.logo&&String(org.logo).indexOf("data:")===0){
      try{doc.setFillColor(255,255,255);doc.roundedRect(mg,ry-6,18,18,3,3,"F");doc.addImage(org.logo,"PNG",mg,ry-6,18,18,undefined,"FAST");logoW=22;}catch(e){}
    }
    doc.setFontSize(16);doc.setFont("helvetica","bold");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);doc.text(org.name||"Company",mg+logoW,ry);
    doc.setFontSize(8.5);doc.setFont("helvetica","normal");doc.setTextColor(MUT[0],MUT[1],MUT[2]);
    var addrShown=false;
    if(org.address){var addrL=org.address.split("\n")[0];doc.text(addrL,mg+logoW,ry+5.5);addrShown=true;}
    var contactLine=orgContactLine(org);
    if(contactLine)doc.text(contactLine,mg+logoW,ry+(addrShown?10:5.5));
    doc.setFontSize(9);doc.text(new Date().toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"}),W-mg,ry,{align:"right"});
    ry+=(addrShown&&contactLine?15.5:(addrShown||contactLine?11:6));doc.setDrawColor(RULE[0],RULE[1],RULE[2]);doc.setLineWidth(0.6);doc.line(mg,ry,W-mg,ry);ry+=12;
    doc.setFontSize(14);doc.setFont("helvetica","bold");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);doc.text("APPOINTMENT LETTER",W/2,ry,{align:"center"});ry+=2;
    doc.setDrawColor(NVYC[0],NVYC[1],NVYC[2]);doc.setLineWidth(0.8);doc.line(W/2-30,ry+2,W/2+30,ry+2);ry+=14;
    doc.setFontSize(11);doc.setFont("helvetica","normal");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);doc.text("Dear "+emp.name+",",mg,ry);ry+=8;
    doc.setFontSize(10.5);doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);
    var openLines=doc.splitTextToSize("Further to your having joined "+(org.name||"our organization")+", we are pleased to confirm your appointment on the following terms and conditions of employment.",W-mg*2);
    doc.text(openLines,mg,ry);ry+=openLines.length*5.5+8;
    var rows2=[["Employee ID",emp.eid||"-"],["Position",emp.role||"-"],["Department",emp.dept||"-"],["Date of Joining",emp.joined?new Date(emp.joined+"T00:00:00").toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"}):"-"],["Monthly CTC",fmtIN(Number(emp.fixedSalary||emp.monthlyCTC||0))],["Annual CTC",fmtIN(Number(emp.fixedSalary||emp.monthlyCTC||0)*12)],["Employment Type","Full-Time, Permanent"],["Leave Entitlement",emp.leaveEntitlement?emp.leaveEntitlement+" days paid leave per year":"As per company policy"]];
    doc.setFontSize(8.5);doc.setFont("helvetica","bold");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);doc.text("TERMS OF APPOINTMENT",mg,ry);ry+=2;
    doc.setDrawColor(RULE[0],RULE[1],RULE[2]);doc.setLineWidth(0.4);doc.line(mg,ry+1.5,W-mg,ry+1.5);ry+=7;
    rows2.forEach(function(row){doc.setFont("helvetica","normal");doc.setTextColor(MUT[0],MUT[1],MUT[2]);doc.setFontSize(8.5);doc.text(row[0],mg,ry+3.5);doc.setFont("helvetica","bold");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);doc.text(String(row[1]),mg+85,ry+3.5);doc.setDrawColor(235,239,245);doc.setLineWidth(0.3);doc.line(mg,ry+6.5,W-mg,ry+6.5);ry+=7;});
    ry+=8;
    var body2="You will be governed by the service rules, policies and code of conduct of "+(org.name||"the organization")+", as amended from time to time. Please sign and return a copy of this letter as a token of your acceptance of the above terms.";
    var lines2=doc.splitTextToSize(body2,W-mg*2);doc.text(lines2,mg,ry);ry+=lines2.length*5.5+8;
    ry+=2;var sigY=Math.max(ry,228);
    doc.setDrawColor(180,188,202);doc.setLineWidth(0.4);doc.line(mg,sigY,mg+60,sigY);doc.line(W-mg-60,sigY,W-mg,sigY);
    doc.setFontSize(8.5);doc.setFont("helvetica","bold");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);doc.text(authSign2||org.name||"Authorised Signatory",mg,sigY+5);doc.text(emp.name,W-mg-60,sigY+5);
    doc.setFont("helvetica","normal");doc.setTextColor(MUT[0],MUT[1],MUT[2]);doc.text(authPos2||"Authorised Signatory",mg,sigY+9);doc.text("Employee Signature (Acceptance)",W-mg-60,sigY+9);
    doc.setDrawColor(RULE[0],RULE[1],RULE[2]);doc.setLineWidth(0.4);doc.line(mg,283,W-mg,283);
    doc.setFontSize(7.5);doc.setTextColor(MUT[0],MUT[1],MUT[2]);doc.text((org.name||""),mg,288);doc.text("Generated by Admin HR",W-mg,288,{align:"right"});
    downloadPDF(doc.output("blob"),"Appointment-Letter-"+(emp.name||"Employee").replace(/s/g,"-")+".pdf");showT("Appointment letter downloaded");
  },function(){showT("PDF error","err");});
}

// ── Increment / Promotion Letter ──
function makeIncrementLetterPDF(emp,org,authPos2,authSign2,newRole,newCTC,effDate,reason){
  loadJsPDFGlobal(function(JsPDF){
    var doc=new JsPDF({orientation:"portrait",unit:"mm",format:"a4"});
    var W=210,mg=22,ry=18;
    var NVYC=[15,23,42],MUT=[71,85,105],RULE=[210,218,230];
    var logoW=0;
    if(org.logo&&String(org.logo).indexOf("data:")===0){
      try{doc.setFillColor(255,255,255);doc.roundedRect(mg,ry-6,18,18,3,3,"F");doc.addImage(org.logo,"PNG",mg,ry-6,18,18,undefined,"FAST");logoW=22;}catch(e){}
    }
    doc.setFontSize(16);doc.setFont("helvetica","bold");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);doc.text(org.name||"Company",mg+logoW,ry);
    doc.setFontSize(8.5);doc.setFont("helvetica","normal");doc.setTextColor(MUT[0],MUT[1],MUT[2]);
    var addrShown=false;
    if(org.address){var addrL=org.address.split("\n")[0];doc.text(addrL,mg+logoW,ry+5.5);addrShown=true;}
    var contactLine=orgContactLine(org);
    if(contactLine)doc.text(contactLine,mg+logoW,ry+(addrShown?10:5.5));
    doc.setFontSize(9);doc.text(new Date().toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"}),W-mg,ry,{align:"right"});
    ry+=(addrShown&&contactLine?15.5:(addrShown||contactLine?11:6));doc.setDrawColor(RULE[0],RULE[1],RULE[2]);doc.setLineWidth(0.6);doc.line(mg,ry,W-mg,ry);ry+=12;
    var isPromo=newRole&&newRole.trim()&&newRole.trim()!==(emp.role||"");
    doc.setFontSize(14);doc.setFont("helvetica","bold");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);doc.text(isPromo?"PROMOTION LETTER":"INCREMENT LETTER",W/2,ry,{align:"center"});ry+=2;
    doc.setDrawColor(NVYC[0],NVYC[1],NVYC[2]);doc.setLineWidth(0.8);doc.line(W/2-30,ry+2,W/2+30,ry+2);ry+=14;
    doc.setFontSize(11);doc.setFont("helvetica","normal");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);doc.text("Dear "+emp.name+",",mg,ry);ry+=8;
    var oldCTC=Number(emp.fixedSalary||emp.monthlyCTC||0);
    var effFmt=effDate?new Date(effDate+"T00:00:00").toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"}):new Date().toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"});
    var body=isPromo
      ?"We are pleased to inform you that, in recognition of your performance and contribution, you have been promoted from "+(emp.role||"your current role")+" to "+newRole+", effective "+effFmt+". Your compensation has also been revised as detailed below."
      :"We are pleased to inform you that, in recognition of your performance and contribution, your compensation has been revised effective "+effFmt+", as detailed below.";
    doc.setFontSize(10.5);doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);
    var lines=doc.splitTextToSize(body,W-mg*2);doc.text(lines,mg,ry);ry+=lines.length*5.5+8;
    var rows2=[["Designation",isPromo?newRole:(emp.role||"-")],["Previous Monthly CTC",fmtIN(oldCTC)],["Revised Monthly CTC",fmtIN(Number(newCTC||0))],["Increase",fmtIN(Math.max(0,Number(newCTC||0)-oldCTC))],["Effective From",effFmt]];
    doc.setFontSize(8.5);doc.setFont("helvetica","bold");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);doc.text("REVISED TERMS",mg,ry);ry+=2;
    doc.setDrawColor(RULE[0],RULE[1],RULE[2]);doc.setLineWidth(0.4);doc.line(mg,ry+1.5,W-mg,ry+1.5);ry+=7;
    rows2.forEach(function(row){doc.setFont("helvetica","normal");doc.setTextColor(MUT[0],MUT[1],MUT[2]);doc.setFontSize(8.5);doc.text(row[0],mg,ry+3.5);doc.setFont("helvetica","bold");doc.setTextColor(5,120,80);doc.text(String(row[1]),mg+85,ry+3.5);doc.setDrawColor(235,239,245);doc.setLineWidth(0.3);doc.line(mg,ry+6.5,W-mg,ry+6.5);ry+=7;});
    ry+=8;
    if(reason&&reason.trim()){
      var rLines=doc.splitTextToSize(reason.trim(),W-mg*2);doc.text(rLines,mg,ry);ry+=rLines.length*5.5+6;
    }
    var body2="All other terms and conditions of your employment remain unchanged. We congratulate you and look forward to your continued contribution.";
    var lines2=doc.splitTextToSize(body2,W-mg*2);doc.text(lines2,mg,ry);ry+=lines2.length*5.5+18;
    ry+=2;var sigY=Math.max(ry,228);
    doc.setDrawColor(180,188,202);doc.setLineWidth(0.4);doc.line(mg,sigY,mg+62,sigY);doc.line(W-mg-62,sigY,W-mg,sigY);
    doc.setFontSize(8.5);doc.setFont("helvetica","bold");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);doc.text(authSign2||"Authorised Signatory",mg,sigY+5);doc.text("HR Department",W-mg-62,sigY+5);
    doc.setFont("helvetica","normal");doc.setTextColor(MUT[0],MUT[1],MUT[2]);doc.text(authPos2||"Authorised Signatory",mg,sigY+9);doc.text(org.name||"",W-mg-62,sigY+9);
    doc.setDrawColor(RULE[0],RULE[1],RULE[2]);doc.setLineWidth(0.4);doc.line(mg,283,W-mg,283);
    doc.setFontSize(7.5);doc.setTextColor(MUT[0],MUT[1],MUT[2]);doc.text((org.name||""),mg,288);doc.text("Generated by Admin HR",W-mg,288,{align:"right"});
    downloadPDF(doc.output("blob"),(isPromo?"Promotion-":"Increment-")+"Letter-"+(emp.name||"").replace(/s/g,"-")+".pdf");showT((isPromo?"Promotion":"Increment")+" letter downloaded");
  },function(){showT("PDF error","err");});
}

// ── Salary Revision Letter — pure CTC change outside a promotion cycle ──
function makeSalaryRevisionLetterPDF(emp,org,authPos2,authSign2,newCTC,effDate,reason){
  loadJsPDFGlobal(function(JsPDF){
    var doc=new JsPDF({orientation:"portrait",unit:"mm",format:"a4"});
    var W=210,mg=22,ry=18;
    var NVYC=[15,23,42],MUT=[71,85,105],RULE=[210,218,230];
    var logoW=0;
    if(org.logo&&String(org.logo).indexOf("data:")===0){
      try{doc.setFillColor(255,255,255);doc.roundedRect(mg,ry-6,18,18,3,3,"F");doc.addImage(org.logo,"PNG",mg,ry-6,18,18,undefined,"FAST");logoW=22;}catch(e){}
    }
    doc.setFontSize(16);doc.setFont("helvetica","bold");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);doc.text(org.name||"Company",mg+logoW,ry);
    doc.setFontSize(8.5);doc.setFont("helvetica","normal");doc.setTextColor(MUT[0],MUT[1],MUT[2]);
    var addrShown=false;
    if(org.address){var addrL=org.address.split("\n")[0];doc.text(addrL,mg+logoW,ry+5.5);addrShown=true;}
    var contactLine=orgContactLine(org);
    if(contactLine)doc.text(contactLine,mg+logoW,ry+(addrShown?10:5.5));
    doc.setFontSize(9);doc.text(new Date().toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"}),W-mg,ry,{align:"right"});
    ry+=(addrShown&&contactLine?15.5:(addrShown||contactLine?11:6));doc.setDrawColor(RULE[0],RULE[1],RULE[2]);doc.setLineWidth(0.6);doc.line(mg,ry,W-mg,ry);ry+=12;
    doc.setFontSize(14);doc.setFont("helvetica","bold");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);doc.text("SALARY REVISION LETTER",W/2,ry,{align:"center"});ry+=2;
    doc.setDrawColor(NVYC[0],NVYC[1],NVYC[2]);doc.setLineWidth(0.8);doc.line(W/2-34,ry+2,W/2+34,ry+2);ry+=14;
    doc.setFontSize(11);doc.setFont("helvetica","normal");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);doc.text("Dear "+emp.name+",",mg,ry);ry+=8;
    var oldCTC=Number(emp.fixedSalary||emp.monthlyCTC||0);
    var effFmt=effDate?new Date(effDate+"T00:00:00").toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"}):new Date().toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"});
    var body="This letter is to inform you that your monthly compensation with "+(org.name||"our organization")+" has been revised effective "+effFmt+", as detailed below.";
    doc.setFontSize(10.5);doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);
    var lines=doc.splitTextToSize(body,W-mg*2);doc.text(lines,mg,ry);ry+=lines.length*5.5+8;
    var diff=Number(newCTC||0)-oldCTC;
    var rows2=[["Previous Monthly CTC",fmtIN(oldCTC)],["Revised Monthly CTC",fmtIN(Number(newCTC||0))],[diff>=0?"Increase":"Decrease",fmtIN(Math.abs(diff))],["Effective From",effFmt]];
    doc.setFontSize(8.5);doc.setFont("helvetica","bold");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);doc.text("REVISED COMPENSATION",mg,ry);ry+=2;
    doc.setDrawColor(RULE[0],RULE[1],RULE[2]);doc.setLineWidth(0.4);doc.line(mg,ry+1.5,W-mg,ry+1.5);ry+=7;
    rows2.forEach(function(row){doc.setFont("helvetica","normal");doc.setTextColor(MUT[0],MUT[1],MUT[2]);doc.setFontSize(8.5);doc.text(row[0],mg,ry+3.5);doc.setFont("helvetica","bold");doc.setTextColor(diff>=0?5:180,diff>=0?120:30,diff>=0?80:30);doc.text(String(row[1]),mg+85,ry+3.5);doc.setDrawColor(235,239,245);doc.setLineWidth(0.3);doc.line(mg,ry+6.5,W-mg,ry+6.5);ry+=7;});
    ry+=8;
    if(reason&&reason.trim()){
      var rLines=doc.splitTextToSize(reason.trim(),W-mg*2);doc.text(rLines,mg,ry);ry+=rLines.length*5.5+6;
    }
    var body2="All other terms and conditions of your employment remain unchanged.";
    var lines2=doc.splitTextToSize(body2,W-mg*2);doc.text(lines2,mg,ry);ry+=lines2.length*5.5+18;
    ry+=2;var sigY=Math.max(ry,228);
    doc.setDrawColor(180,188,202);doc.setLineWidth(0.4);doc.line(mg,sigY,mg+62,sigY);doc.line(W-mg-62,sigY,W-mg,sigY);
    doc.setFontSize(8.5);doc.setFont("helvetica","bold");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);doc.text(authSign2||"Authorised Signatory",mg,sigY+5);doc.text("HR Department",W-mg-62,sigY+5);
    doc.setFont("helvetica","normal");doc.setTextColor(MUT[0],MUT[1],MUT[2]);doc.text(authPos2||"Authorised Signatory",mg,sigY+9);doc.text(org.name||"",W-mg-62,sigY+9);
    doc.setDrawColor(RULE[0],RULE[1],RULE[2]);doc.setLineWidth(0.4);doc.line(mg,283,W-mg,283);
    doc.setFontSize(7.5);doc.setTextColor(MUT[0],MUT[1],MUT[2]);doc.text((org.name||""),mg,288);doc.text("Generated by Admin HR",W-mg,288,{align:"right"});
    downloadPDF(doc.output("blob"),"Salary-Revision-Letter-"+(emp.name||"").replace(/s/g,"-")+".pdf");showT("Salary revision letter downloaded");
  },function(){showT("PDF error","err");});
}

// ── HR Policy document PDF — same letterhead language as the other formal letters ──
function makePolicyPDF(policyDef,fields,org,authPos2,authSign2,customTerms){
  loadJsPDFGlobal(function(JsPDF){
    var doc=new JsPDF({orientation:"portrait",unit:"mm",format:"a4"});
    var W=210,H=297,mg=20,ry=18;
    var NVYC=[15,23,42],MUT=[71,85,105],RULE=[210,218,230];
    var accent=hexToRgbArr(policyDef.color)||[15,23,42];

    function letterhead(){
      var logoW=0;
      if(org.logo&&String(org.logo).indexOf("data:")===0){
        try{doc.setFillColor(255,255,255);doc.roundedRect(mg,ry-6,18,18,3,3,"F");doc.addImage(org.logo,"PNG",mg,ry-6,18,18,undefined,"FAST");logoW=22;}catch(e){}
      }
      doc.setFontSize(16);doc.setFont("helvetica","bold");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);doc.text(org.name||"Company",mg+logoW,ry);
      doc.setFontSize(8.5);doc.setFont("helvetica","normal");doc.setTextColor(MUT[0],MUT[1],MUT[2]);
      var addrShown=false;
      if(org.address){var addrL=org.address.split("\n")[0];doc.text(addrL,mg+logoW,ry+5.5);addrShown=true;}
      var contactLine=orgContactLine(org);
      if(contactLine)doc.text(contactLine,mg+logoW,ry+(addrShown?10:5.5));
      doc.setFontSize(9);doc.text(new Date().toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"}),W-mg,ry,{align:"right"});
      ry+=(addrShown&&contactLine?15.5:(addrShown||contactLine?11:6));doc.setDrawColor(RULE[0],RULE[1],RULE[2]);doc.setLineWidth(0.6);doc.line(mg,ry,W-mg,ry);ry+=12;
    }
    letterhead();
    doc.setFontSize(15);doc.setFont("helvetica","bold");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);doc.text(policyDef.label.toUpperCase(),W/2,ry,{align:"center"});ry+=2;
    doc.setDrawColor(accent[0],accent[1],accent[2]);doc.setLineWidth(0.9);doc.line(W/2-28,ry+2,W/2+28,ry+2);ry+=8;
    doc.setFontSize(8.5);doc.setFont("helvetica","italic");doc.setTextColor(MUT[0],MUT[1],MUT[2]);doc.text("Effective Date: "+new Date().toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})+"   |   Applicable to: All Employees",W/2,ry,{align:"center"});ry+=11;

    var clauses=policyDef.build(fields,org);
    if(customTerms&&customTerms.trim())clauses=clauses.concat([{h:(clauses.length+1)+". Additional Company-Specific Terms",b:customTerms.trim()}]);
    clauses.forEach(function(cl){
      if(ry>260){doc.addPage();ry=20;}
      doc.setFontSize(10);doc.setFont("helvetica","bold");doc.setTextColor(accent[0],accent[1],accent[2]);
      doc.text(cl.h,mg,ry);ry+=5.5;
      doc.setFontSize(10);doc.setFont("helvetica","normal");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);
      var lines=doc.splitTextToSize(cl.b,W-mg*2);
      lines.forEach(function(line){
        if(ry>270){doc.addPage();ry=20;}
        doc.text(line,mg,ry);ry+=5.3;
      });
      ry+=4.5;
    });

    if(ry>258){doc.addPage();ry=20;}
    ry+=8;
    doc.setDrawColor(180,188,202);doc.setLineWidth(0.4);
    doc.line(mg,ry,mg+62,ry);doc.line(W-mg-62,ry,W-mg,ry);
    doc.setFontSize(8.5);doc.setFont("helvetica","bold");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);
    doc.text(authSign2||org.name||"Authorised Signatory",mg,ry+5);doc.text("HR Department",W-mg-62,ry+5);
    doc.setFont("helvetica","normal");doc.setTextColor(MUT[0],MUT[1],MUT[2]);
    doc.text(authPos2||"Authorised Signatory",mg,ry+9);doc.text(org.name||"",W-mg-62,ry+9);

    // Footer on every page
    var pageCount=doc.internal.getNumberOfPages();
    for(var p=1;p<=pageCount;p++){
      doc.setPage(p);
      doc.setDrawColor(RULE[0],RULE[1],RULE[2]);doc.setLineWidth(0.4);doc.line(mg,H-12,W-mg,H-12);
      doc.setFontSize(7.5);doc.setTextColor(MUT[0],MUT[1],MUT[2]);
      doc.text((org.name||"")+" - "+policyDef.label,mg,H-6);
      doc.text("Page "+p+" of "+pageCount,W-mg,H-6,{align:"right"});
    }

    downloadPDF(doc.output("blob"),policyDef.label.replace(/[^\w]+/g,"-")+"-"+(org.name||"Company").replace(/[^\w]+/g,"-")+".pdf");
    showT(policyDef.label+" downloaded");
  },function(){showT("PDF error","err");});
}
function hexToRgbArr(hex){
  if(!hex)return null;
  var m=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m?[parseInt(m[1],16),parseInt(m[2],16),parseInt(m[3],16)]:null;
}

// ── Combined Employee Handbook — every created policy in one document, continuous flow ──
function makeHandbookPDF(entries,org,authPos2,authSign2){
  loadJsPDFGlobal(function(JsPDF){
    var doc=new JsPDF({orientation:"portrait",unit:"mm",format:"a4"});
    var W=210,H=297,mg=20;
    var NVYC=[15,23,42],MUT=[71,85,105],RULE=[210,218,230];

    function letterhead(ry){
      var logoW=0;
      if(org.logo&&String(org.logo).indexOf("data:")===0){
        try{doc.setFillColor(255,255,255);doc.roundedRect(mg,ry-6,18,18,3,3,"F");doc.addImage(org.logo,"PNG",mg,ry-6,18,18,undefined,"FAST");logoW=22;}catch(e){}
      }
      doc.setFontSize(16);doc.setFont("helvetica","bold");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);doc.text(org.name||"Company",mg+logoW,ry);
      doc.setFontSize(8.5);doc.setFont("helvetica","normal");doc.setTextColor(MUT[0],MUT[1],MUT[2]);
      var addrShown=false;
      if(org.address){var addrL=org.address.split("\n")[0];doc.text(addrL,mg+logoW,ry+5.5);addrShown=true;}
      var contactLine=orgContactLine(org);
      if(contactLine)doc.text(contactLine,mg+logoW,ry+(addrShown?10:5.5));
      doc.setFontSize(9);doc.text(new Date().toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"}),W-mg,ry,{align:"right"});
      var ry2=ry+(addrShown&&contactLine?15.5:(addrShown||contactLine?11:6));doc.setDrawColor(RULE[0],RULE[1],RULE[2]);doc.setLineWidth(0.6);doc.line(mg,ry2,W-mg,ry2);
      return ry2+12;
    }

    // ── Cover / Table of Contents ──
    var ry=letterhead(18);
    doc.setFontSize(19);doc.setFont("helvetica","bold");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);doc.text("EMPLOYEE HANDBOOK",W/2,ry+10,{align:"center"});
    doc.setFontSize(10);doc.setFont("helvetica","normal");doc.setTextColor(MUT[0],MUT[1],MUT[2]);doc.text(org.name||"Company",W/2,ry+18,{align:"center"});
    ry+=32;
    doc.setFontSize(9.5);doc.setFont("helvetica","bold");doc.setTextColor(MUT[0],MUT[1],MUT[2]);doc.text("CONTENTS",mg,ry);ry+=2;
    doc.setDrawColor(RULE[0],RULE[1],RULE[2]);doc.setLineWidth(0.4);doc.line(mg,ry+1.5,W-mg,ry+1.5);ry+=9;
    entries.forEach(function(en,i){
      var accent=hexToRgbArr(en.def.color)||[15,23,42];
      doc.setFillColor(accent[0],accent[1],accent[2]);doc.roundedRect(mg,ry-3.2,3,3,1,1,"F");
      doc.setFontSize(10.5);doc.setFont("helvetica","normal");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);
      doc.text((i+1)+".  "+en.def.label,mg+6,ry);
      ry+=8;
    });
    ry+=6;
    doc.setFontSize(8.5);doc.setFont("helvetica","italic");doc.setTextColor(MUT[0],MUT[1],MUT[2]);
    var coverNote=doc.splitTextToSize("This handbook brings together "+org.name+"'s current HR policies for easy reference. For statutory matters (such as the POSH policy, where included) we recommend periodic review with a legal professional.",W-mg*2);
    doc.text(coverNote,mg,ry);

    // ── Each policy, continuous flow (no forced page break between policies) ──
    doc.addPage();ry=20; // cover/TOC gets its own page; policies then flow continuously from here
    entries.forEach(function(en,idx){
      var def=en.def,fields=en.fields,customTerms=en.customTerms;
      var accent=hexToRgbArr(def.color)||[15,23,42];
      // Only start a fresh page if the heading would otherwise be orphaned near the bottom
      if(ry>250){doc.addPage();ry=20;} else if(idx>0){ry+=10;}
      doc.setFontSize(14);doc.setFont("helvetica","bold");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);doc.text((idx+1)+".  "+def.label.toUpperCase(),mg,ry);ry+=2;
      doc.setDrawColor(accent[0],accent[1],accent[2]);doc.setLineWidth(0.9);doc.line(mg,ry+2,mg+50,ry+2);ry+=12;

      var clauses=def.build(fields,org);
      if(customTerms&&customTerms.trim())clauses=clauses.concat([{h:(clauses.length+1)+". Additional Company-Specific Terms",b:customTerms.trim()}]);
      clauses.forEach(function(cl){
        if(ry>260){doc.addPage();ry=20;}
        doc.setFontSize(10);doc.setFont("helvetica","bold");doc.setTextColor(accent[0],accent[1],accent[2]);
        doc.text(cl.h,mg,ry);ry+=5.5;
        doc.setFontSize(10);doc.setFont("helvetica","normal");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);
        var lines=doc.splitTextToSize(cl.b,W-mg*2);
        lines.forEach(function(line){
          if(ry>270){doc.addPage();ry=20;}
          doc.text(line,mg,ry);ry+=5.3;
        });
        ry+=4.5;
      });
    });

    // ── One signature block at the very end of the handbook ──
    if(ry>255){doc.addPage();ry=20;}
    ry+=10;
    doc.setDrawColor(180,188,202);doc.setLineWidth(0.4);
    doc.line(mg,ry,mg+62,ry);doc.line(W-mg-62,ry,W-mg,ry);
    doc.setFontSize(8.5);doc.setFont("helvetica","bold");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);
    doc.text(authSign2||org.name||"Authorised Signatory",mg,ry+5);doc.text("HR Department",W-mg-62,ry+5);
    doc.setFont("helvetica","normal");doc.setTextColor(MUT[0],MUT[1],MUT[2]);
    doc.text(authPos2||"Authorised Signatory",mg,ry+9);doc.text(org.name||"",W-mg-62,ry+9);

    // Footer on every page
    var pageCount=doc.internal.getNumberOfPages();
    for(var p=1;p<=pageCount;p++){
      doc.setPage(p);
      doc.setDrawColor(RULE[0],RULE[1],RULE[2]);doc.setLineWidth(0.4);doc.line(mg,H-12,W-mg,H-12);
      doc.setFontSize(7.5);doc.setTextColor(MUT[0],MUT[1],MUT[2]);
      doc.text((org.name||"")+" - Employee Handbook",mg,H-6);
      doc.text("Page "+p+" of "+pageCount,W-mg,H-6,{align:"right"});
    }

    downloadPDF(doc.output("blob"),"Employee-Handbook-"+(org.name||"Company").replace(/[^\w]+/g,"-")+".pdf");
    showT("Employee Handbook downloaded");
  },function(){showT("PDF error","err");});
}


function makePayslipPDF(emp,d,m,y,orgName,orgEmail,orgPos,logoSrc,showEmployer,orgAddress,companyLogo,authPos,authSign,onDoc,bonusList,claimTotal,orgPhone,orgWebsite,loanDed,attSummary){
  loadJsPDFGlobal(function(JsPDF){
    var doc=new JsPDF({orientation:"portrait",unit:"mm",format:"a4"});
    var W=210,H=297,mg=16,cw=W-mg*2;
    var nd=new Date();
    var ry=pdfHeader(doc,W,mg,logoSrc,orgName,orgPos,orgEmail,"SALARY PAYSLIP",MOS[m]+" "+y+" | Generated "+nd.getDate()+"/"+(nd.getMonth()+1)+"/"+nd.getFullYear(),orgAddress||"",companyLogo||"",{phone:orgPhone,website:orgWebsite});
    doc.setFillColor(244,247,252);doc.roundedRect(mg,ry,cw,20,3,3,"F");
    doc.setDrawColor(210,220,235);doc.roundedRect(mg,ry,cw,20,3,3,"S");
    doc.setFontSize(12);doc.setFont("helvetica","bold");doc.setTextColor(15,23,42);
    doc.text(emp.name||"",mg+4,ry+8);
    doc.setFontSize(9);doc.setFont("helvetica","normal");doc.setTextColor(71,85,105);
    doc.text((emp.role||"")+(emp.dept?" - "+emp.dept:""),mg+4,ry+14.5);
    if(emp.eid)doc.text("ID: "+emp.eid,W-mg-4,ry+8,{align:"right"});
    if(emp.pan)doc.text("PAN: "+emp.pan,W-mg-4,ry+14.5,{align:"right"});
    ry+=26;
    // ── Attendance summary — compact stat boxes, one per status the app tracks ──
    if(attSummary){
      var attStats=[["Present",attSummary.present||0,[5,120,80]],["Absent",attSummary.absent||0,[180,30,30]],["Half Day",attSummary.half||0,[180,100,0]],["Paid Leave",attSummary.paid||0,[70,100,180]],["Unpaid Leave",attSummary.unpaid||0,[140,90,200]],["Holiday",attSummary.holiday||0,[15,23,42]]];
      var aBoxW=(cw-5*1.5)/6,aBoxH=15;
      attStats.forEach(function(s,i){
        var ax=mg+i*(aBoxW+1.5);
        doc.setFillColor(248,250,253);doc.roundedRect(ax,ry,aBoxW,aBoxH,1.5,1.5,"F");
        doc.setDrawColor(222,228,238);doc.setLineWidth(0.3);doc.roundedRect(ax,ry,aBoxW,aBoxH,1.5,1.5,"S");
        doc.setFontSize(10);doc.setFont("helvetica","bold");doc.setTextColor(s[2][0],s[2][1],s[2][2]);
        doc.text(String(s[1]),ax+aBoxW/2,ry+7,{align:"center"});
        doc.setFontSize(5.8);doc.setFont("helvetica","normal");doc.setTextColor(80,95,115);
        doc.text(s[0],ax+aBoxW/2,ry+11.8,{align:"center"});
      });
      ry+=aBoxH+6;
    }
    var cw2=cw/2-2,rh=8.5;
    function colHead(x,y,w,label,col){
      doc.setFillColor(col[0],col[1],col[2]);doc.roundedRect(x,y,w,rh,1,1,"F");
      doc.setFontSize(8.5);doc.setFont("helvetica","bold");doc.setTextColor(255,255,255);
      doc.text(label,x+4,y+5.8);
    }
    function colRow(x,y,w,label,val,valCol,shade){
      if(shade){doc.setFillColor(248,250,253);doc.rect(x,y,w,rh,"F");}
      doc.setFontSize(8.5);doc.setFont("helvetica","normal");doc.setTextColor(80,95,115);
      doc.text(label,x+4,y+5.8);
      doc.setTextColor(valCol?valCol[0]:15,valCol?valCol[1]:23,valCol?valCol[2]:42);
      doc.setFont("helvetica","bold");doc.text(val,x+w-4,y+5.8,{align:"right"});
    }
    function colTotal(x,y,w,label,val,bg,tc){
      doc.setFillColor(bg[0],bg[1],bg[2]);doc.rect(x,y,w,rh,"F");
      doc.setFontSize(8.5);doc.setFont("helvetica","bold");doc.setTextColor(tc[0],tc[1],tc[2]);
      doc.text(label,x+4,y+5.8);doc.text(val,x+w-4,y+5.8,{align:"right"});
    }
    var c1x=mg,c2x=mg+cw2+2;
    colHead(c1x,ry,cw2,"EARNINGS",[15,23,42]);
    var er=ry+rh;
    // NOTE: use d.basic (full entitlement for the days employed this month) here, NOT d.eb (which is
    // already reduced for absent/half/unpaid days). The attendance deduction is shown once, explicitly,
    // in the DEDUCTIONS column below — showing it baked into Basic/Fixed Salary AND listed again as a
    // deduction would silently subtract it twice from the reader's perspective.
    var earns=d.isFixed?[["Fixed Salary (includes all allowances)",fmtIN(d.basic||0)]]:[["Basic Salary",fmtIN(d.basic||0)],["HRA",fmtIN(d.hra||0)],["Allowances",fmtIN(d.allow||0)]];
    if(d.shiftAllow>0)earns.push(["Shift Allowance",fmtIN(d.shiftAllow)]);
    if(d.inc>0)earns.push(["Incentive",fmtIN(d.inc)]);
    var bonusSum=0;
    if(bonusList&&bonusList.length){bonusList.forEach(function(b){bonusSum+=(b.amount||0);earns.push([(b.note||b.type||"Bonus"),fmtIN(b.amount||0)]);});}
    var claimSum=Number(claimTotal||0);
    if(claimSum>0)earns.push(["Reimbursement",fmtIN(claimSum)]);
    earns.forEach(function(r,i){colRow(c1x,er+i*rh,cw2,r[0],r[1],null,i%2===0);});
    // Gross Earnings here = full pre-deduction entitlement, so that Gross − Total Deductions (which
    // includes the attendance deduction below) equals Net Take Home exactly, with nothing double-counted.
    var grossFull=(d.basic||0)+(d.hra||0)+(d.allow||0)+(d.inc||0)+(d.shiftAllow||0)+bonusSum+claimSum;
    var gr_y=er+earns.length*rh;
    colTotal(c1x,gr_y,cw2,"Gross Earnings",fmtIN(grossFull),[232,248,240],[5,120,80]);
    colHead(c2x,ry,cw2,"DEDUCTIONS",[180,30,30]);
    var dr=ry+rh,deds=[];
    if(d.ad>0)deds.push(["Absent Deduction","-"+fmtIN(d.ad)]);
    if(d.hd>0)deds.push(["Half Day Deduction","-"+fmtIN(d.hd)]);
    if(d.ud>0)deds.push(["Unpaid Leave","-"+fmtIN(d.ud)]);
    if(d.pfE>0)deds.push([d.pfMode==="actual"?"PF (Employee 12%)":"PF (12% of Rs.15,000 cap)","-"+fmtIN(d.pfE)]);
    if(d.esiE>0)deds.push(["ESI (Employee 0.75%)","-"+fmtIN(d.esiE)]);
    if(d.pt>0)deds.push(["Professional Tax","-"+fmtIN(d.pt)]);
    if(d.tds>0)deds.push(["TDS","-"+fmtIN(d.tds)]);
    if(d.hi>0)deds.push(["Health Insurance","-"+fmtIN(d.hi)]);
    if(d.cd>0)deds.push(["Custom Deduction","-"+fmtIN(d.cd)]);
    var loanDedN=Number(loanDed||0);
    if(loanDedN>0)deds.push(["Loan/Advance EMI","-"+fmtIN(loanDedN)]);
    if(deds.length===0)deds.push(["No Deductions","Nil"]);
    deds.forEach(function(r,i){colRow(c2x,dr+i*rh,cw2,r[0],r[1],[200,30,30],i%2===0);});
    var dt_y=dr+deds.length*rh;
    var totDed=d.pfE+d.esiE+d.pt+d.tds+d.hi+d.cd+d.ad+d.hd+d.ud+loanDedN;
    colTotal(c2x,dt_y,cw2,"Total Deductions","-"+fmtIN(totDed),[254,236,236],[180,30,30]);
    var net_y=Math.max(gr_y,dt_y)+rh+5;
    doc.setDrawColor(180,195,215);doc.setLineWidth(0.5);doc.line(mg,net_y,mg+cw,net_y);net_y+=5;
    doc.setFontSize(10);doc.setFont("helvetica","bold");doc.setTextColor(15,23,42);
    doc.text("NET TAKE HOME  -  "+MOS[m]+" "+y,mg+4,net_y+5);
    doc.setFontSize(15);doc.setFont("helvetica","bold");doc.setTextColor(5,120,80);
    doc.text(fmtIN(Math.max(0,d.net+bonusSum+claimSum-loanDedN)),W-mg-4,net_y+6,{align:"right"});
    net_y+=14;doc.setDrawColor(180,195,215);doc.line(mg,net_y,mg+cw,net_y);
    if(showEmployer){
      var ec_y=net_y+23;
      doc.setFillColor(250,252,255);doc.roundedRect(mg,ec_y,cw,rh*3+rh,2,2,"F");
      doc.setDrawColor(215,225,240);doc.roundedRect(mg,ec_y,cw,rh*3+rh,2,2,"S");
      doc.setFontSize(8.5);doc.setFont("helvetica","bold");doc.setTextColor(15,23,42);
      doc.text("EMPLOYER CONTRIBUTIONS (not deducted from salary)",mg+4,ec_y+6);
      colRow(mg,ec_y+rh,cw,"PF (Employer 12%)",fmtIN(d.pfR),[70,100,180],false);
      colRow(mg,ec_y+rh*2,cw,"ESI (Employer 3.25%)",fmtIN(d.esiR),[70,100,180],true);
      colTotal(mg,ec_y+rh*3,cw,"Total Cost to Company (CTC)",fmtIN(d.gr+d.pfR+d.esiR),[255,248,230],[160,100,0]);
    }
    pdfFooter(doc,W,mg,H,orgName,orgEmail,logoSrc,authPos,authSign);
    var suffix=showEmployer?"-Employer":"-Employee";
    if(typeof onDoc==="function"){onDoc(doc);}else{downloadPDF(doc.output("blob"),"Payslip-"+(emp.name||"").replace(/ /g,"-")+suffix+"-"+MOS[m]+"-"+y+".pdf");}
  },function(){alert("PDF library failed to load.");});
}
function makePayrollPDF(emps,m,y,payFn,orgName,orgEmail,orgPos,logoSrc,showEmployer,orgAddress,companyLogo,authPos,authSign,orgPhone,orgWebsite){
  loadJsPDFGlobal(function(JsPDF){
    var doc=new JsPDF({orientation:"portrait",unit:"mm",format:"a4"});
    var W=210,H=297,mg=12;
    var nd=new Date();
    var ry=pdfHeader(doc,W,mg,logoSrc,orgName,orgPos,orgEmail,showEmployer?"PAYROLL REPORT (EMPLOYER)":"PAYROLL REPORT",MOS[m]+" "+String(y)+" - Generated "+nd.getDate()+"/"+(nd.getMonth()+1)+"/"+nd.getFullYear(),orgAddress||"",companyLogo||"",{phone:orgPhone,website:orgWebsite});
    doc.setFontSize(7.5);doc.setFont("helvetica","italic");doc.setTextColor(71,85,105);doc.text("All amounts in Rs.",mg,ry-1);

    var cols=showEmployer?[
      {label:"GROSS",align:"r"},
      {label:"DEDUCT.",align:"r"},
      {label:"NET PAY",align:"r"},
      {label:"ER PF",align:"r"},
      {label:"ER ESI",align:"r"},
      {label:"TOTAL CTC",align:"r"},
    ]:[
      {label:"GROSS EARNINGS (Rs.)",align:"r"},
      {label:"DEDUCTIONS",align:"r"},
      {label:"NET PAY (Rs.)",align:"r"},
    ];

    var cws=showEmployer?[18,20,20,18,18,22]:[34,30,38];

    var empRows=[];
    var tG=0,tN=0,tD=0,tPR=0,tER=0;

    emps.forEach(function(emp){
      var mp=payFn(emp,y,m),d=mp.d;
      var ded=d.gr-d.net;
      tG+=d.gr;tN+=d.net;tD+=ded;tPR+=d.pfR;tER+=d.esiR;
      if(showEmployer){
        empRows.push({emp:emp,cells:[
          {val:fmtNum(d.gr),color:[60,80,180]},
          {val:fmtNum(ded),color:[200,40,40]},
          {val:fmtNum(d.net),bold:true,color:[5,140,90]},
          {val:fmtNum(d.pfR),color:[80,100,200]},
          {val:fmtNum(d.esiR),color:[5,140,90]},
          {val:fmtNum(d.gr+d.pfR+d.esiR),bold:true,color:[160,100,0]},
        ]});
      } else {
        empRows.push({emp:emp,cells:[
          {val:fmtNum(d.gr),color:[60,80,180]},
          {val:fmtNum(ded),color:[200,40,40]},
          {val:fmtNum(d.net),bold:true,color:[5,140,90]},
        ]});
      }
    });

    var totalsCells=showEmployer?[
      {val:fmtNum(tG),color:[60,80,180]},
      {val:fmtNum(tD),color:[200,40,40]},
      {val:fmtNum(tN),color:[5,140,90]},
      {val:fmtNum(tPR),color:[60,80,180]},
      {val:fmtNum(tER),color:[5,140,90]},
      {val:fmtNum(tG+tPR+tER),color:[180,100,0]},
    ]:[
      {val:fmtNum(tG),color:[60,80,180]},
      {val:fmtNum(tD),color:[200,40,40]},
      {val:fmtNum(tN),color:[5,140,90]},
    ];

    ry=drawGroupedEmployeeTable(doc,mg,W-mg*2,H,ry,cols,cws,empRows,{totalsCells:totalsCells});
    ry+=8;

    // Summary line
    doc.setFontSize(8);doc.setFont("helvetica","normal");doc.setTextColor(71,85,105);
    doc.text("Total Gross: "+fmtIN(tG)+"   Total Deductions: "+fmtIN(tD)+"   Total Net: "+fmtIN(tN)+(showEmployer?"   Total CTC: "+fmtIN(tG+tPR+tER):""),mg,ry);

    pdfFooter(doc,W,mg,H,orgName,orgEmail,logoSrc,authPos,authSign);
    var suffix=showEmployer?"-Employer":"-Employee";
    downloadPDF(doc.output("blob"),"Payroll"+suffix+"-"+MOS[m]+"-"+String(y)+".pdf");
  },function(){alert("PDF library failed to load.");});
}


function makeAttPDF(name,y,m,recs,orgName,orgEmail,orgPos,logoSrc,orgAddress,companyLogo,authPos,authSign,orgPhone,orgWebsite){
  loadJsPDFGlobal(function(JsPDF){
    var doc=new JsPDF({orientation:"portrait",unit:"mm",format:"a4"});
    var W=210,H=297,mg=16,cw=W-mg*2;
    var titleName=name||"All Employees";
    var ry=pdfHeader(doc,W,mg,logoSrc,orgName,orgPos,orgEmail,"ATTENDANCE RECORD",titleName+" | "+MOS[m]+" "+y,orgAddress||"",companyLogo||"",{phone:orgPhone,website:orgWebsite});
    var counts={present:0,absent:0,half:0,paid:0,unpaid:0,holiday:0};
    var recEntries=recs?Object.entries(recs):[];
    recEntries.forEach(function(kv){if(counts[kv[1]]!==undefined)counts[kv[1]]++;});
    var chips=[["Present",counts.present,[5,150,105]],["Absent",counts.absent,[220,38,38]],["Half Day",counts.half,[217,119,6]],["Paid Leave",counts.paid,[124,58,237]],["Unpaid",counts.unpaid,[79,70,229]],["Holiday",counts.holiday,[14,165,233]]];
    var chipW=(cw-10)/6,chipH=14,chipGap=2;
    chips.forEach(function(c,i){
      var cx=mg+i*(chipW+chipGap);
      doc.setFillColor(c[2][0],c[2][1],c[2][2]);
      doc.setGState(new doc.GState({opacity:0.1}));
      doc.roundedRect(cx,ry,chipW,chipH,2,2,"F");
      doc.setGState(new doc.GState({opacity:1}));
      doc.setDrawColor(c[2][0],c[2][1],c[2][2]);
      doc.setLineWidth(0.3);
      doc.roundedRect(cx,ry,chipW,chipH,2,2,"S");
      doc.setFontSize(12);doc.setFont("helvetica","bold");doc.setTextColor(c[2][0],c[2][1],c[2][2]);
      doc.text(String(c[1]),cx+chipW/2,ry+7,{align:"center"});
      doc.setFontSize(6.5);doc.setFont("helvetica","normal");doc.setTextColor(71,85,105);
      doc.text(c[0],cx+chipW/2,ry+12,{align:"center"});
    });
    ry+=chipH+6;
    ry=drawAttDayTable(doc,W,mg,cw,H,ry,recs);
    pdfFooter(doc,W,mg,H,orgName,orgEmail,logoSrc,authPos,authSign);
    var fname=name?"Attendance-"+name.replace(/ /g,"-"):"Attendance-All";
    downloadPDF(doc.output("blob"),fname+"-"+MOS[m]+"-"+y+".pdf");
  },function(){alert("PDF library failed to load.");});
}
// Shared day-by-day attendance table — used by both the single-employee detailed PDF
// (makeAttPDF, with its count-chips header) and the multi-employee Detailed Report
// (makeAttDetailedPDF, without chips), so the two never drift apart in formatting.
function drawAttDayTable(doc,W,mg,cw,H,ry,recs){
  var rh=9;
  var ATColors={present:[5,150,105],absent:[220,38,38],half:[217,119,6],paid:[124,58,237],unpaid:[79,70,229],holiday:[14,165,233],unmarked:[148,163,184]};
  var ATL_FULL={present:"Present",absent:"Absent",half:"Half Day",paid:"Paid Leave",unpaid:"Unpaid Leave",holiday:"Holiday",unmarked:"Not Marked"};
  var days=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  doc.setDrawColor(180,195,215);doc.setLineWidth(0.4);doc.line(mg,ry,mg+cw,ry);ry+=1;
  doc.setFontSize(8.5);doc.setFont("helvetica","bold");doc.setTextColor(71,85,105);
  doc.text("DATE",mg+4,ry+5.5);
  doc.text("DAY",mg+55,ry+5.5);
  doc.text("STATUS",W-mg-4,ry+5.5,{align:"right"});
  ry+=rh;
  doc.setDrawColor(180,195,215);doc.line(mg,ry,mg+cw,ry);ry+=1;
  var recEntries=recs?Object.entries(recs):[];
  recEntries.sort(function(a,b){return a[0]>b[0]?1:-1;}).forEach(function(kv,i){
    var s=kv[1],col=ATColors[s]||[148,163,184];
    var dateObj=new Date(kv[0]);
    var dayName=isNaN(dateObj)?"":(days[dateObj.getDay()]||"");
    if(i%2===0){doc.setFillColor(247,249,252);doc.rect(mg,ry,cw,rh,"F");}
    doc.setFontSize(9);doc.setFont("helvetica","normal");doc.setTextColor(25,35,50);
    doc.text(kv[0],mg+4,ry+6.2);
    doc.setTextColor(71,85,105);doc.text(dayName,mg+55,ry+6.2);
    doc.setFillColor(col[0],col[1],col[2]);
    doc.setGState(new doc.GState({opacity:0.15}));
    doc.roundedRect(W-mg-40,ry+1.5,38,rh-3,1.5,1.5,"F");
    doc.setGState(new doc.GState({opacity:1}));
    doc.setFontSize(8.5);doc.setFont("helvetica","bold");doc.setTextColor(col[0],col[1],col[2]);
    doc.text(ATL_FULL[s]||s,W-mg-4,ry+6.2,{align:"right"});
    ry+=rh;
    if(ry>H-16){doc.addPage();ry=16;}
  });
  return ry;
}
// Detailed Attendance Report — every active employee, day-by-day, continuous flow.
// Same per-day table as the single-employee PDF, just without the count-chips section
// at the top (per the requested layout) and looped across the whole team.
// Detailed Attendance Report — a month grid (one column per day) for every active employee,
// grouped under department section titles (not a repeated department column), departments and
// employees both alphabetical — same grouping convention as the Salary Register / Dept Payroll
// reports elsewhere in the app. Reuses the same attendance % formula as the Summary PDF.
function makeAttDetailedPDF(emps,att,y,m,orgName,orgEmail,orgPos,logoSrc,orgAddress,companyLogo,authPos,authSign,orgPhone,orgWebsite){
  loadJsPDFGlobal(function(JsPDF){
    var doc=new JsPDF({orientation:"landscape",unit:"mm",format:"a4"});
    var W=297,H=210,mg=10,cw=W-mg*2;
    var daysInMonth=new Date(y,m+1,0).getDate();
    var STATUS_META=[["present","P",[5,150,105]],["absent","A",[220,38,38]],["paid","PL",[124,58,237]],["unpaid","UL",[79,70,229]],["half","HD",[217,119,6]],["holiday","H",[14,165,233]]];
    var STATUS_BY_KEY={};STATUS_META.forEach(function(s){STATUS_BY_KEY[s[0]]=s;});
    // Working days = calendar days minus days the whole active team is marked holiday — same definition the Summary PDF uses.
    var holidaysCount=0;
    for(var dd=1;dd<=daysInMonth;dd++){
      var ds=y+"-"+String(m+1).padStart(2,"0")+"-"+String(dd).padStart(2,"0");
      if(emps.every(function(e){return att[ds+"_"+e.id]==="holiday";}))holidaysCount++;
    }
    var workingDays=daysInMonth-holidaysCount;

    var ry=pdfHeader(doc,W,mg,logoSrc,orgName,orgPos,orgEmail,"DETAILED ATTENDANCE REPORT",MOS[m]+" "+y,orgAddress||"",companyLogo||"",{phone:orgPhone,website:orgWebsite});

    // ── Legend ──
    doc.setFontSize(7.5);doc.setFont("helvetica","normal");doc.setTextColor(15,23,42);
    var legendX=mg;
    STATUS_META.forEach(function(s){
      doc.setFillColor(s[2][0],s[2][1],s[2][2]);doc.setGState(new doc.GState({opacity:.18}));
      doc.roundedRect(legendX,ry-3.2,4,4,1,1,"F");doc.setGState(new doc.GState({opacity:1}));
      doc.setDrawColor(s[2][0],s[2][1],s[2][2]);doc.setLineWidth(.3);doc.roundedRect(legendX,ry-3.2,4,4,1,1,"S");
      var label={present:"Present (P)",absent:"Absent (A)",paid:"Paid Leave (PL)",unpaid:"Unpaid Leave (UL)",half:"Half Day (HD)",holiday:"Holiday (H)"}[s[0]];
      doc.text(label,legendX+5.5,ry);
      legendX+=5.5+doc.getTextWidth(label)+7;
    });
    ry+=7;
    doc.setDrawColor(210,218,230);doc.setLineWidth(.3);doc.line(mg,ry,mg+cw,ry);ry+=5;

    // ── Column layout ──
    var empColW=44;
    var totColW=9.2,totColsN=6,totColsW=totColW*totColsN;
    var dayColW=(cw-empColW-totColsW)/daysInMonth;
    var headerH=9,rowH=10.5,deptRowH=7;
    var dayNames=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

    function drawGridHeader(){
      doc.setFillColor(26,35,73);doc.rect(mg,ry,cw,headerH,"F");
      doc.setFontSize(7);doc.setFont("helvetica","bold");doc.setTextColor(255,255,255);
      doc.text("EMPLOYEE",mg+3,ry+headerH/2+1.2);
      for(var dd=1;dd<=daysInMonth;dd++){
        var dx=mg+empColW+(dd-1)*dayColW;
        var wd=new Date(y,m,dd).getDay();
        doc.setFontSize(6.2);doc.setFont("helvetica","bold");
        doc.text(String(dd),dx+dayColW/2,ry+4,{align:"center"});
        doc.setFontSize(4.6);doc.setFont("helvetica","normal");
        doc.text(dayNames[wd],dx+dayColW/2,ry+7.3,{align:"center"});
      }
      var totLabels=["P","A","PL","UL","HD","H"];
      totLabels.forEach(function(lb,i){
        doc.setFontSize(7);doc.setFont("helvetica","bold");
        doc.text(lb,mg+empColW+daysInMonth*dayColW+i*totColW+totColW/2,ry+headerH/2+1.2,{align:"center"});
      });
      ry+=headerH;
    }
    drawGridHeader();

    // ── Group by department (alphabetical), employees alphabetical within ──
    var depts={};
    emps.forEach(function(e){var dp=e.dept||"Unassigned";(depts[dp]=depts[dp]||[]).push(e);});
    var deptNames=Object.keys(depts).sort(function(a,b){return a.localeCompare(b);});

    deptNames.forEach(function(deptName){
      if(ry>H-20){doc.addPage();ry=14;drawGridHeader();}
      // Department title row — once per department, not a repeated per-employee column
      doc.setFillColor(238,242,250);doc.rect(mg,ry,cw,deptRowH,"F");
      doc.setFontSize(8);doc.setFont("helvetica","bold");doc.setTextColor(26,35,73);
      doc.text(deptName,mg+3,ry+deptRowH/1.5);
      ry+=deptRowH;

      var deptEmps=depts[deptName].slice().sort(function(a,b){return (a.name||"").localeCompare(b.name||"");});
      deptEmps.forEach(function(emp,ei){
        if(ry+rowH>H-18){doc.addPage();ry=14;drawGridHeader();}
        var counts={present:0,absent:0,paid:0,unpaid:0,half:0,holiday:0};
        var cellStatus=[];
        for(var d2=1;d2<=daysInMonth;d2++){
          var ds2=y+"-"+String(m+1).padStart(2,"0")+"-"+String(d2).padStart(2,"0");
          var v=att[ds2+"_"+emp.id]||"";
          if(counts[v]!==undefined)counts[v]++;
          cellStatus.push(v);
        }
        var pct=workingDays>0?Math.round((counts.present+counts.half*0.5+counts.paid)*100/workingDays):0;
        if(ei%2===0){doc.setFillColor(248,250,253);doc.rect(mg,ry,cw,rowH,"F");}
        doc.setDrawColor(225,230,240);doc.setLineWidth(.2);doc.line(mg,ry+rowH,mg+cw,ry+rowH);
        doc.line(mg+empColW,ry,mg+empColW,ry+rowH);
        doc.line(mg+empColW+daysInMonth*dayColW,ry,mg+empColW+daysInMonth*dayColW,ry+rowH);
        // Employee cell — name, then role / ID / attendance % stacked below
        doc.setFontSize(7.3);doc.setFont("helvetica","bold");doc.setTextColor(15,23,42);
        doc.text((emp.name||"").substring(0,24),mg+3,ry+4);
        doc.setFontSize(5.6);doc.setFont("helvetica","normal");doc.setTextColor(71,85,105);
        var subLine=(emp.role||"-")+(emp.eid?" - "+emp.eid:"");
        doc.text(subLine.substring(0,38),mg+3,ry+7.2);
        doc.setFont("helvetica","bold");doc.setTextColor(pct>=95?5:pct>=80?180:200,pct>=95?140:pct>=80?100:40,pct>=95?90:pct>=80?0:40);
        doc.text(pct+"%",mg+empColW-3,ry+rowH/2+1,{align:"right"});
        // Day cells
        for(var d3=1;d3<=daysInMonth;d3++){
          var st=cellStatus[d3-1];
          if(!st||!STATUS_BY_KEY[st])continue;
          var meta=STATUS_BY_KEY[st],dx2=mg+empColW+(d3-1)*dayColW;
          doc.setFillColor(meta[2][0],meta[2][1],meta[2][2]);doc.setGState(new doc.GState({opacity:.16}));
          doc.rect(dx2+0.3,ry+1,dayColW-0.6,rowH-2,"F");doc.setGState(new doc.GState({opacity:1}));
          doc.setFontSize(5.6);doc.setFont("helvetica","bold");doc.setTextColor(meta[2][0],meta[2][1],meta[2][2]);
          doc.text(meta[1],dx2+dayColW/2,ry+rowH/2+1.3,{align:"center"});
        }
        // Totals columns
        var totVals=[counts.present,counts.absent,counts.paid,counts.unpaid,counts.half,counts.holiday];
        var totColColors=[[5,140,90],[200,40,40],[124,58,237],[79,70,229],[180,100,0],[14,120,165]];
        totVals.forEach(function(v,i){
          var tx=mg+empColW+daysInMonth*dayColW+i*totColW;
          doc.setFontSize(7.2);doc.setFont("helvetica","bold");doc.setTextColor(totColColors[i][0],totColColors[i][1],totColColors[i][2]);
          doc.text(v>0?String(v):"-",tx+totColW/2,ry+rowH/2+1.3,{align:"center"});
        });
        ry+=rowH;
      });
    });

    // ── Footer — explicitly no signature required for a computer-generated report ──
    doc.setFontSize(7.5);doc.setFont("helvetica","italic");doc.setTextColor(71,85,105);
    doc.text("This is computer generated file, no signature required.",mg,H-12);
    doc.setDrawColor(210,218,230);doc.setLineWidth(0.4);doc.line(mg,H-8,W-mg,H-8);
    doc.setFontSize(7.5);doc.setFont("helvetica","normal");doc.setTextColor(71,85,105);
    doc.text(orgName||"",mg,H-3.5);
    doc.text("Generated by Admin HR",W-mg,H-3.5,{align:"right"});

    downloadPDF(doc.output("blob"),"Detailed-Attendance-"+MOS[m]+"-"+y+".pdf");
  },function(){alert("PDF library failed to load.");});
}
function makeAttSummaryPDF(emps,att,m,y,orgName,orgEmail,orgPos,logoSrc,orgAddress,companyLogo,authPos,authSign,orgPhone,orgWebsite){
  loadJsPDFGlobal(function(JsPDF){
    var doc=new JsPDF({orientation:"portrait",unit:"mm",format:"a4"});
    var W=210,H=297,mg=12;
    var ry=pdfHeader(doc,W,mg,logoSrc,orgName,orgPos,orgEmail,"ATTENDANCE SUMMARY",MOS[m]+" "+String(y),orgAddress||"",companyLogo||"",{phone:orgPhone,website:orgWebsite});

    var daysInMonth=new Date(y,m+1,0).getDate();
    // Count holidays (days where all emps marked holiday)
    var holidays=0;
    for(var dd=1;dd<=daysInMonth;dd++){
      var ds=y+"-"+String(m+1).padStart(2,"0")+"-"+String(dd).padStart(2,"0");
      var allHol=emps.filter(function(e){return e.status==="active";}).every(function(e){return att[ds+"_"+e.id]==="holiday";});
      if(allHol)holidays++;
    }
    var workingDays=daysInMonth-holidays;

    doc.setFontSize(7.5);doc.setFont("helvetica","normal");doc.setTextColor(80,100,140);
    doc.text("Working Days: "+workingDays+"  |  Calendar Days: "+daysInMonth+(holidays>0?"  |  Holidays: "+holidays:""),mg,ry+4);
    ry+=10;

    var cols=[
      {label:"WORKING DAYS",align:"r"},
      {label:"PRESENT",align:"r"},
      {label:"ABSENT",align:"r"},
      {label:"HALF DAY",align:"r"},
      {label:"LEAVE",align:"r"},
      {label:"HOLIDAY",align:"r"},
      {label:"ATT %",align:"r"},
    ];
    var cws=[22,18,16,16,16,16,14];

    var empRows=[];
    var totP=0,totA=0,totH=0,totL=0,totHol=0;

    emps.filter(function(e){return e.status==="active";}).forEach(function(emp){
      var p=0,a=0,hd=0,l=0,hol=0;
      for(var dd=1;dd<=daysInMonth;dd++){
        var ds=y+"-"+String(m+1).padStart(2,"0")+"-"+String(dd).padStart(2,"0");
        var v=att[ds+"_"+emp.id]||"unmarked";
        if(v==="present")p++;
        else if(v==="absent")a++;
        else if(v==="half")hd++;
        else if(v==="paid"||v==="unpaid")l++;
        else if(v==="holiday")hol++;
      }
      var rate=workingDays>0?Math.round((p+hd*0.5+l)*100/workingDays):0;
      totP+=p;totA+=a;totH+=hd;totL+=l;totHol+=hol;
      empRows.push({emp:emp,cells:[
        {val:workingDays},
        {val:p,color:[5,140,90]},
        {val:a>0?a:"-",color:a>0?[200,40,40]:[120,130,145]},
        {val:hd>0?hd:"-",color:hd>0?[200,110,0]:[120,130,145]},
        {val:l>0?l:"-",color:l>0?[120,80,200]:[120,130,145]},
        {val:hol>0?hol:"-",color:[95,105,120]},
        {val:rate+"%",bold:true,color:rate>=95?[5,140,90]:rate>=80?[200,110,0]:[200,40,40]},
      ]});
    });

    var totalsCells=[
      {val:""},
      {val:totP,color:[5,140,90]},
      {val:totA,color:[200,40,40]},
      {val:totH,color:[180,100,0]},
      {val:totL,color:[120,80,200]},
      {val:totHol,color:[60,80,180]},
      {val:""},
    ];

    ry=drawGroupedEmployeeTable(doc,mg,W-mg*2,H,ry,cols,cws,empRows,{totalsCells:totalsCells});
    pdfFooter(doc,W,mg,H,orgName,orgEmail,logoSrc,authPos,authSign);
    downloadPDF(doc.output("blob"),"Attendance-Summary-"+MOS[m]+"-"+String(y)+".pdf");
  },function(){alert("PDF library failed to load.");});
}


function makeAttSummaryYearPDF(emps,att,y,orgName,orgEmail,orgPos,logoSrc,orgAddress,companyLogo,authPos,authSign,orgPhone,orgWebsite){
  loadJsPDFGlobal(function(JsPDF){
    var doc=new JsPDF({orientation:"landscape",unit:"mm",format:"a4"});
    var W=297,H=210,mg=10;
    var ry=pdfHeader(doc,W,mg,logoSrc,orgName,orgPos,orgEmail,"ANNUAL ATTENDANCE SUMMARY","Year "+String(y),orgAddress||"",companyLogo||"",{phone:orgPhone,website:orgWebsite});

    var monthCols=["APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC","JAN","FEB","MAR"];
    var months=[3,4,5,6,7,8,9,10,11,0,1,2];
    var years=months.map(function(m){return m<3?y+1:y;});

    var cols=[];
    monthCols.forEach(function(mn){cols.push({label:mn,align:"r"});});
    cols.push({label:"TOTAL P",align:"r"});
    cols.push({label:"TOTAL A",align:"r"});
    cols.push({label:"RATE",align:"r"});

    var baseCws=[];
    months.forEach(function(){baseCws.push(14);});
    baseCws.push(14);baseCws.push(14);baseCws.push(14);

    var empRows=[];
    emps.filter(function(e){return e.status==="active";}).forEach(function(emp){
      var cells=[];
      var totP=0,totA=0,totWork=0;
      months.forEach(function(m,mi){
        var yr=years[mi];
        var daysInMo=new Date(yr,m+1,0).getDate();
        var p=0,a=0;
        for(var d=1;d<=daysInMo;d++){
          var ds=yr+"-"+String(m+1).padStart(2,"0")+"-"+String(d).padStart(2,"0");
          var v=att[ds+"_"+emp.id]||"unmarked";
          if(v==="present")p++;
          else if(v==="absent")a++;
        }
        totP+=p;totA+=a;totWork+=daysInMo;
        cells.push({val:p>0?String(p):"-",color:p>0?[5,140,90]:[150,160,175]});
      });
      var rate=totWork>0?Math.round(totP*100/totWork):0;
      cells.push({val:totP,bold:true,color:[5,140,90]});
      cells.push({val:totA>0?totA:"-",color:totA>0?[200,40,40]:[120,130,145]});
      cells.push({val:rate+"%",bold:true,color:rate>=90?[5,140,90]:rate>=75?[200,110,0]:[200,40,40]});
      empRows.push({emp:emp,cells:cells});
    });

    ry=drawGroupedEmployeeTable(doc,mg,W-mg*2,H,ry,cols,baseCws,empRows,{rowH:11,fontSize:7,identityW:42});
    pdfFooter(doc,W,mg,H,orgName,orgEmail,logoSrc,authPos,authSign);
    downloadPDF(doc.output("blob"),"Annual-Attendance-"+String(y)+"-"+(String(y+1)).slice(2)+".pdf");
  },function(){alert("PDF library failed to load.");});
}


function makeEmpPDF(emps,orgName,orgEmail,orgPos,logoSrc,orgAddress,companyLogo,authPos,authSign,orgPhone,orgWebsite){
  loadJsPDFGlobal(function(JsPDF){
    var doc=new JsPDF({orientation:"landscape",unit:"mm",format:"a4"});
    var W=297,H=210,mg=14,cw=W-mg*2;
    var nd=new Date();
    var ry=pdfHeader(doc,W,mg,logoSrc,orgName,orgPos,orgEmail,"EMPLOYEE RECORDS",emps.length+" Employees | "+nd.getDate()+"/"+(nd.getMonth()+1)+"/"+nd.getFullYear(),orgAddress||"",companyLogo||"",{phone:orgPhone,website:orgWebsite});
    var cols=[{label:"MOBILE",align:"l"},{label:"EMAIL",align:"l"},{label:"DATE OF JOINING",align:"l"},{label:"PAN",align:"l"},{label:"MONTHLY CTC",align:"r"},{label:"STATUS",align:"r"}];
    var cws=[28,42,26,22,28,22];
    var empRows=emps.map(function(emp){
      var joinedFmt=emp.joined?new Date(emp.joined+"T00:00:00").toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}):"-";
      return {emp:emp,cells:[
        {val:emp.mob||"-"},
        {val:emp.email||"-"},
        {val:joinedFmt},
        {val:emp.pan||"-"},
        {val:fmtIN(emp.monthlyCTC),bold:true,color:[5,140,90]},
        {val:emp.status==="active"?"Active":"Offboarded",bold:true,color:emp.status==="active"?[5,140,90]:[200,40,40]},
      ]};
    });
    ry=drawGroupedEmployeeTable(doc,mg,cw,H,ry,cols,cws,empRows,{identityW:50});
    pdfFooter(doc,W,mg,H,orgName,orgEmail,logoSrc,authPos,authSign);
    downloadPDF(doc.output("blob"),"Employees-"+nd.getFullYear()+".pdf");
  },function(){alert("PDF library failed to load. Check internet connection.");});
}

// ── MINIMUM WAGE DATA (major Indian states, 2024-25) ──────────────────────
var MIN_WAGE={
  "Andhra Pradesh":{skilled:18000,semi:16000,unskilled:14000},
  "Bihar":{skilled:12000,semi:10000,unskilled:9000},
  "Delhi":{skilled:20903,semi:19279,unskilled:17494},
  "Gujarat":{skilled:16000,semi:14000,unskilled:12000},
  "Haryana":{skilled:18000,semi:16000,unskilled:14000},
  "Karnataka":{skilled:17000,semi:15000,unskilled:13000},
  "Kerala":{skilled:20000,semi:18000,unskilled:16000},
  "Madhya Pradesh":{skilled:14000,semi:12000,unskilled:10000},
  "Maharashtra":{skilled:19000,semi:17000,unskilled:15000},
  "Punjab":{skilled:16000,semi:14000,unskilled:12000},
  "Rajasthan":{skilled:14000,semi:12000,unskilled:10000},
  "Tamil Nadu":{skilled:17000,semi:15000,unskilled:13000},
  "Telangana":{skilled:18000,semi:16000,unskilled:14000},
  "Uttar Pradesh":{skilled:13000,semi:11000,unskilled:9000},
  "West Bengal":{skilled:14000,semi:12000,unskilled:10000}
};

// ── LEAVE ENTITLEMENT HELPERS ─────────────────────────────────────────────
function getLeaveEntitlement(emp){return emp.leaveEntitlement||12;}
function getLeaveUsed(emp,att,year){
  var used=0;
  Object.entries(att).forEach(function(kv){
    if(kv[0].endsWith("_"+emp.id)&&kv[0].startsWith(year+"-")&&kv[1]==="paid")used++;
  });
  return used;
}
function getLeaveBalance(emp,att,year){
  return Math.max(0,getLeaveEntitlement(emp)-getLeaveUsed(emp,att,year));
}
function getLeaveEncashment(emp,att,year){
  var bal=getLeaveBalance(emp,att,year);
  var daily=(emp.basic||0)/26;
  return Math.round(bal*daily);
}

// ── MINIMUM WAGE CHECK ───────────────────────────────────────────────────
function checkMinWage(salary,state,category){
  var st=MIN_WAGE[state];if(!st)return null;
  var min=st[category]||st.unskilled;
  return {ok:salary>=min,min:min,state:state,category:category};
}

// ── PF/ESI SUMMARY PDF ───────────────────────────────────────────────────
function makePFESIPDF(emps,m,y,payFn,orgName,orgEmail,orgPos,logoSrc,orgAddress,companyLogo,authPos,authSign,orgPhone,orgWebsite){
  loadJsPDFGlobal(function(JsPDF){
    var doc=new JsPDF({orientation:"portrait",unit:"mm",format:"a4"});
    var W=210,H=297,mg=12,cw=W-mg*2;
    var ry=pdfHeader(doc,W,mg,logoSrc,orgName,orgPos,orgEmail,"PF / ESI SUMMARY",MOS[m]+" "+String(y),orgAddress||"",companyLogo||"",{phone:orgPhone,website:orgWebsite});
    // Info note
    doc.setFontSize(7.5);doc.setFont("helvetica","normal");doc.setTextColor(80,100,140);
    doc.text("PF wage ceiling: Rs.15,000  |  ESI applicable if gross <= Rs.21,000  |  PF: 12%+12%  |  ESI: 0.75%+3.25%",mg,ry+4);
    ry+=10;

    var eligible=emps.filter(function(e){return e.status==="active"&&e.pf;});
    if(eligible.length===0){
      doc.setFontSize(10);doc.setTextColor(200,40,40);
      doc.text("No employees with PF enabled found.",mg,ry+10);
      pdfFooter(doc,W,mg,H,orgName,orgEmail,logoSrc,authPos,authSign);
      downloadPDF(doc.output("blob"),"PF-ESI-Summary-"+MOS[m]+"-"+String(y)+".pdf");
      return;
    }

    var cols=[
      {label:"UAN",align:"l"},
      {label:"GROSS (Rs.)",align:"r"},
      {label:"PF WAGES",align:"r"},
      {label:"EMP PF",align:"r"},
      {label:"ER PF",align:"r"},
      {label:"EMP ESI",align:"r"},
      {label:"ER ESI",align:"r"},
      {label:"TOTAL (Rs.)",align:"r"},
    ];
    var cws=[26,16,18,16,16,16,16,18];

    var empRows=[];
    var totGross=0,totPFW=0,totEmpPF=0,totErPF=0,totEmpESI=0,totErESI=0,totAll=0;

    eligible.forEach(function(emp){
      var mp=payFn(emp,y,m),d=mp.d;
      var pfWage=emp.pfMode==="actual"?d.eb:Math.min(d.eb,15000);
      var total=d.pfE+d.pfR+(d.esiE||0)+(d.esiR||0);
      totGross+=d.gr;totPFW+=pfWage;totEmpPF+=d.pfE;totErPF+=d.pfR;
      totEmpESI+=d.esiE||0;totErESI+=d.esiR||0;totAll+=total;
      empRows.push({emp:emp,cells:[
        {val:emp.uan||"-",color:[95,105,120]},
        {val:fmtNum(d.gr)},
        {val:fmtNum(pfWage),color:[60,80,180]},
        {val:fmtNum(d.pfE),color:[60,80,180]},
        {val:fmtNum(d.pfR),color:[60,80,180]},
        {val:fmtNum(d.esiE||0),color:[5,140,90]},
        {val:fmtNum(d.esiR||0),color:[5,140,90]},
        {val:fmtNum(total),bold:true,color:[180,100,0]},
      ]});
    });

    var totalsCells=[
      {val:""},
      {val:fmtNum(totGross)},
      {val:fmtNum(totPFW)},
      {val:fmtNum(totEmpPF),color:[60,80,180]},
      {val:fmtNum(totErPF),color:[60,80,180]},
      {val:fmtNum(totEmpESI),color:[5,140,90]},
      {val:fmtNum(totErESI),color:[5,140,90]},
      {val:fmtNum(totAll),color:[180,100,0]},
    ];

    doc.setFontSize(7.5);doc.setFont("helvetica","italic");doc.setTextColor(71,85,105);doc.text("All amounts in the table below are in Rs.",mg,ry-1);
    ry=drawGroupedEmployeeTable(doc,mg,cw,H,ry,cols,cws,empRows,{totalsCells:totalsCells});
    ry+=10;

    // Challan summary — 3 clean boxes
    var bw=(cw-8)/3;
    function box(x,label,emp2,er2,total2,r,g,b){
      doc.setDrawColor(r,g,b);doc.setLineWidth(0.5);doc.rect(x,ry,bw,20,"S");
      doc.setFontSize(8);doc.setFont("helvetica","bold");doc.setTextColor(r,g,b);
      doc.text(label,x+bw/2,ry+6,{align:"center"});
      doc.setFontSize(7.5);doc.setFont("helvetica","normal");doc.setTextColor(80,95,115);
      doc.text("Employee: "+fmtIN(emp2),x+3,ry+11);
      doc.text("Employer: "+fmtIN(er2),x+3,ry+15.5);
      doc.setFontSize(9);doc.setFont("helvetica","bold");doc.setTextColor(r,g,b);
      doc.text(fmtIN(total2),x+bw-3,ry+15.5,{align:"right"});
    }
    box(mg,"PF CHALLAN",totEmpPF,totErPF,totEmpPF+totErPF,60,80,200);
    box(mg+bw+4,"ESI CHALLAN",totEmpESI,totErESI,totEmpESI+totErESI,5,140,90);
    box(mg+bw*2+8,"GRAND TOTAL",totEmpPF+totEmpESI,totErPF+totErESI,totAll,150,80,0);

    pdfFooter(doc,W,mg,H,orgName,orgEmail,logoSrc,authPos,authSign);
    downloadPDF(doc.output("blob"),"PF-ESI-Summary-"+MOS[m]+"-"+String(y)+".pdf");
  },function(){alert("PDF library failed to load.");});
}


// ── ECR FILE GENERATOR (EPFO ECR 2.0 format) ─────────────────────────────
function generateECR(emps,m,y,payFn){
  // ECR 2.0 format: UAN#MEMBER_NAME#GROSS_WAGES#EPF_WAGES#EPS_WAGES#EDLI_WAGES#EPF_CONTRI#EPS_CONTRI#EPF_EPS_DIFF_REMITTED#NCP_DAYS#REFUNDS
  var eligible=emps.filter(function(e){return e.status==="active"&&e.pf&&e.uan;});
  if(eligible.length===0){
    showT("No employees with UAN + PF enabled. Edit employees to add UAN and enable PF, then try again.","err");
    return;
  }
  var lines=["#~#"];
  eligible.forEach(function(emp){
    var mp=payFn(emp,y,m),d=mp.d,ma=mp.ma;
    var pfWage=emp.pfMode==="actual"?d.eb:Math.min(d.eb,15000);
    var epsWage=Math.min(pfWage,15000);
    var epfContri=d.pfE;
    var epsContri=Math.round(epsWage*0.0833);
    var epfEpsDiff=epfContri-epsContri;
    var ncpDays=ma.absent+ma.unpaid;
    lines.push([
      emp.uan,
      (emp.name||"").toUpperCase(),
      Math.round(d.gr),
      Math.round(pfWage),
      Math.round(epsWage),
      Math.round(pfWage),
      Math.round(epfContri),
      Math.round(epsContri),
      Math.max(0,Math.round(epfEpsDiff)),
      Math.round(ncpDays),
      0
    ].join("#~#"));
  });
  lines.push("#~#");
  var content=lines.join("\n");
  var blob=new Blob([content],{type:"text/plain"});
  downloadBlob(blob,"ECR-"+MOS[m]+"-"+y+".txt");
  return eligible.length;
}

// ── SALARY REGISTER PDF (Statutory format) ────────────────────────────────
function makeSalaryRegisterPDF(emps,m,y,payFn,orgName,orgEmail,orgPos,logoSrc,orgAddress,companyLogo,authPos,authSign,orgPhone,orgWebsite){
  loadJsPDFGlobal(function(JsPDF){
    var doc=new JsPDF({orientation:"landscape",unit:"mm",format:"a4"});
    var W=297,H=210,mg=10;
    var ry=pdfHeader(doc,W,mg,logoSrc,orgName,orgPos,orgEmail,"SALARY REGISTER",MOS[m]+" "+String(y)+" - Payment of Wages Act",orgAddress||"",companyLogo||"",{phone:orgPhone,website:orgWebsite});
    doc.setFontSize(7);doc.setFont("helvetica","normal");doc.setTextColor(80,100,140);
    doc.text("Statutory salary register. Maintain for minimum 3 years as per Payment of Wages Act, 1936. All money columns are in Rs.",mg,ry+4);
    doc.setFontSize(6.3);doc.setFont("helvetica","italic");doc.setTextColor(71,85,105);
    doc.text("Bonus and Overtime are excluded here (not part of fixed wages) - see the Payroll Report for total compensation paid.",mg,ry+8);
    ry+=12;

    var cols=[
      {label:"WORK",align:"r"},
      {label:"PAID",align:"r"},
      {label:"BASIC",align:"r"},
      {label:"HRA",align:"r"},
      {label:"ALLOW",align:"r"},
      {label:"GROSS (Rs.)",align:"r"},
      {label:"PF",align:"r"},
      {label:"ESI",align:"r"},
      {label:"PT",align:"r"},
      {label:"TDS",align:"r"},
      {label:"TOTAL DED",align:"r"},
      {label:"NET PAY (Rs.)",align:"r"},
      {label:"SIGN",align:"c"},
    ];
    var cws=[13,11,18,15,15,20,15,14,13,14,17,21,13];

    var empRows=[];
    var totW=0,totD=0,totB=0,totH=0,totA=0,totG=0,totPF=0,totESI=0,totPT=0,totTDS=0,totDed=0,totNet=0;

    emps.filter(function(e){return e.status==="active";}).forEach(function(emp){
      var mp=payFn(emp,y,m),d=mp.d,ma=mp.ma;
      // Days Worked = physically present (excludes leave, includes holiday if worked)
      var daysWork=Math.round((ma.present||0)+(ma.half||0)*0.5+(ma.holiday||0));
      // Days Paid = entitled to pay (present + half + paid leave + holiday)
      var daysPaid=Math.round((ma.present||0)+(ma.half||0)*0.5+(ma.paid||0)+(ma.holiday||0));
      var totalDed=d.pfE+d.esiE+d.pt+d.tds+d.hi+d.cd+d.ad+d.hd+d.ud;
      totW+=daysWork;totD+=daysPaid;totB+=d.eb;totH+=d.hra;
      totA+=d.allow;totG+=d.gr;totPF+=d.pfE;totESI+=d.esiE;
      totPT+=d.pt;totTDS+=d.tds;totDed+=totalDed;totNet+=d.net;
      empRows.push({emp:emp,cells:[
        {val:daysWork},
        {val:daysPaid},
        {val:fmtNum(d.eb),color:[60,80,180]},
        {val:fmtNum(d.hra)},
        {val:fmtNum(d.allow)},
        {val:fmtNum(d.gr),bold:true},
        {val:d.pfE>0?fmtNum(d.pfE):"-",color:[70,100,200]},
        {val:d.esiE>0?fmtNum(d.esiE):"-",color:[5,140,90]},
        {val:d.pt>0?fmtNum(d.pt):"-",color:[200,110,0]},
        {val:d.tds>0?fmtNum(d.tds):"-",color:[200,40,40]},
        {val:fmtNum(totalDed),bold:true,color:[200,40,40]},
        {val:fmtNum(d.net),bold:true,color:[5,140,90]},
        {val:""},
      ]});
    });

    var totalsCells=[
      {val:""},
      {val:""},
      {val:fmtNum(totB),color:[60,80,180]},
      {val:fmtNum(totH),color:[60,80,180]},
      {val:fmtNum(totA),color:[60,80,180]},
      {val:fmtNum(totG)},
      {val:fmtNum(totPF),color:[60,80,180]},
      {val:fmtNum(totESI),color:[5,140,90]},
      {val:fmtNum(totPT),color:[180,100,0]},
      {val:fmtNum(totTDS),color:[200,40,40]},
      {val:fmtNum(totDed),color:[200,40,40]},
      {val:fmtNum(totNet),color:[5,140,90]},
      {val:""},
    ];

    ry=drawGroupedEmployeeTable(doc,mg,W-mg*2,H,ry,cols,cws,empRows,{rowH:11,fontSize:7,totalsCells:totalsCells});
    ry+=8;

    // Certification
    doc.setFontSize(7.5);doc.setFont("helvetica","normal");doc.setTextColor(71,85,105);
    doc.text("Certified that the wages shown above are correct and have been paid to the employees for "+MOS[m]+" "+String(y)+".",mg,ry);
    ry+=10;

    pdfFooter(doc,W,mg,H,orgName,orgEmail,logoSrc,authPos,authSign);
    downloadPDF(doc.output("blob"),"Salary-Register-"+MOS[m]+"-"+String(y)+".pdf");
  },function(){alert("PDF library failed to load.");});
}

// ── Department-wise Payroll Register — same depth as the Salary Register, grouped by department ──
function makeDeptPayrollPDF(deptGroups,m,y,payFn,orgName,orgEmail,orgPos,logoSrc,orgAddress,companyLogo,authPos,authSign,orgPhone,orgWebsite){
  // deptGroups: array of {dept, emps} — only the departments currently visible on screen
  loadJsPDFGlobal(function(JsPDF){
    var doc=new JsPDF({orientation:"landscape",unit:"mm",format:"a4"});
    var W=297,H=210,mg=10;
    var ry=pdfHeader(doc,W,mg,logoSrc,orgName,orgPos,orgEmail,"DEPARTMENT-WISE PAYROLL REGISTER",MOS[m]+" "+String(y),orgAddress||"",companyLogo||"",{phone:orgPhone,website:orgWebsite});
    doc.setFontSize(7);doc.setFont("helvetica","normal");doc.setTextColor(80,100,140);
    doc.text("Detailed payroll, grouped by department. All money columns are in Rs. Bonus and Overtime are excluded (see Payroll Report for total compensation).",mg,ry+4);
    ry+=11;

    var cols=[
      {label:"WORK",align:"r"},
      {label:"PAID",align:"r"},
      {label:"BASIC",align:"r"},
      {label:"HRA",align:"r"},
      {label:"ALLOW",align:"r"},
      {label:"GROSS (Rs.)",align:"r"},
      {label:"PF",align:"r"},
      {label:"ESI",align:"r"},
      {label:"PT",align:"r"},
      {label:"TDS",align:"r"},
      {label:"TOTAL DED",align:"r"},
      {label:"ER PF",align:"r"},
      {label:"ER ESI",align:"r"},
      {label:"NET PAY (Rs.)",align:"r"},
    ];
    var identityW=46;
    var cw=W-mg*2;
    var cwSum=cols.reduce(function(a,c,i){return a+[12,11,17,14,14,19,14,13,12,13,16,14,14,20][i];},0);
    var rawCws=[12,11,17,14,14,19,14,13,12,13,16,14,14,20];
    var scale=(cw-identityW)/rawCws.reduce(function(a,b){return a+b;},0);
    var cws=rawCws.map(function(w){return w*scale;});
    var cx=[mg+identityW];for(var ci=0;ci<cws.length-1;ci++)cx.push(cx[ci]+cws[ci]);
    var rowH=11.5;

    function drawDeptHeader(){
      doc.setFillColor(26,35,73);doc.rect(mg,ry,cw,9,"F");
      doc.setFontSize(7.5);doc.setFont("helvetica","bold");doc.setTextColor(255,255,255);
      doc.text("EMPLOYEE",mg+3,ry+6);
      cols.forEach(function(c,i){
        var tx=c.align==="r"?cx[i]+cws[i]-3:cx[i]+3;
        doc.text(c.label,tx,ry+6,{align:c.align==="r"?"right":"left"});
      });
      ry+=9;
    }

    var grandG=0,grandDed=0,grandN=0,grandCTC=0;

    deptGroups.forEach(function(grp,gi){
      if(ry>225){doc.addPage();ry=14;} else if(gi>0){ry+=8;}
      doc.setFontSize(11);doc.setFont("helvetica","bold");doc.setTextColor(15,23,42);
      doc.text(grp.dept,mg,ry);
      var deptNameW=doc.getTextWidth(grp.dept);
      doc.setFontSize(8);doc.setFont("helvetica","normal");doc.setTextColor(71,85,105);
      doc.text("("+grp.emps.length+" employee"+(grp.emps.length===1?"":"s")+")",mg+deptNameW+5,ry);
      ry+=2;
      doc.setDrawColor(180,138,40);doc.setLineWidth(0.8);doc.line(mg,ry+2,mg+40,ry+2);
      ry+=9;
      drawDeptHeader();

      var totW=0,totD=0,totG=0,totH=0,totA=0,totPF=0,totESI=0,totPT=0,totTDS=0,totDed=0,totErPF=0,totErESI=0,totNet=0;
      var sortedEmps=grp.emps.slice().sort(function(a,b){return (a.name||"").localeCompare(b.name||"");});
      sortedEmps.forEach(function(emp,ei){
        if(ry+rowH>H-18){doc.addPage();ry=14;drawDeptHeader();}
        var mp=payFn(emp,y,m),d=mp.d,ma=mp.ma;
        var daysWork=Math.round((ma.present||0)+(ma.half||0)*0.5+(ma.holiday||0));
        var daysPaid=Math.round((ma.present||0)+(ma.half||0)*0.5+(ma.paid||0)+(ma.holiday||0));
        var totalDed=d.pfE+d.esiE+d.pt+d.tds+d.hi+d.cd+d.ad+d.hd+d.ud;
        totW+=daysWork;totD+=daysPaid;totG+=d.gr;totH+=d.hra;totA+=d.allow;
        totPF+=d.pfE;totESI+=d.esiE;totPT+=d.pt;totTDS+=d.tds;totDed+=totalDed;
        totErPF+=d.pfR;totErESI+=d.esiR;totNet+=d.net;
        if(ei%2===0){doc.setFillColor(248,250,253);doc.rect(mg,ry,cw,rowH,"F");}
        doc.setDrawColor(225,230,240);doc.setLineWidth(.2);doc.line(mg,ry+rowH,mg+cw,ry+rowH);
        doc.line(mg+identityW,ry,mg+identityW,ry+rowH);
        doc.setFontSize(8.2);doc.setFont("helvetica","bold");doc.setTextColor(15,23,42);
        doc.text((emp.name||"").substring(0,24),mg+3,ry+rowH/2-1);
        doc.setFontSize(6.2);doc.setFont("helvetica","normal");doc.setTextColor(71,85,105);
        doc.text(((emp.role||"-")+(emp.eid?" - "+emp.eid:"")).substring(0,38),mg+3,ry+rowH/2+3.5);
        var cellVals=[
          {val:daysWork},{val:daysPaid},
          {val:fmtNum(d.eb),color:[60,80,180]},{val:fmtNum(d.hra)},{val:fmtNum(d.allow)},
          {val:fmtNum(d.gr),bold:true},
          {val:d.pfE>0?fmtNum(d.pfE):"-",color:[70,100,200]},
          {val:d.esiE>0?fmtNum(d.esiE):"-",color:[5,140,90]},
          {val:d.pt>0?fmtNum(d.pt):"-",color:[200,110,0]},
          {val:d.tds>0?fmtNum(d.tds):"-",color:[200,40,40]},
          {val:fmtNum(totalDed),bold:true,color:[200,40,40]},
          {val:d.pfR>0?fmtNum(d.pfR):"-",color:[71,85,105]},
          {val:d.esiR>0?fmtNum(d.esiR):"-",color:[71,85,105]},
          {val:fmtNum(d.net),bold:true,color:[5,140,90]},
        ];
        cellVals.forEach(function(cell,i){
          doc.setFontSize(7.3);doc.setFont("helvetica",cell.bold?"bold":"normal");
          doc.setTextColor.apply(doc,cell.color||[15,23,42]);
          var align=cols[i].align==="r"?"right":"left";
          var tx=align==="right"?cx[i]+cws[i]-3:cx[i]+3;
          doc.text(String(cell.val),tx,ry+rowH/2+1.3,{align:align});
        });
        ry+=rowH;
      });
      // Department subtotal row
      doc.setDrawColor(26,35,73);doc.setLineWidth(.6);doc.line(mg,ry,mg+cw,ry);
      doc.setFontSize(8.2);doc.setFont("helvetica","bold");doc.setTextColor(15,23,42);
      doc.text("TOTAL",mg+3,ry+rowH/2+1.3);
      var subVals=[
        {val:""},{val:""},
        {val:fmtNum(totG-totH-totA),color:[60,80,180]},{val:fmtNum(totH),color:[60,80,180]},{val:fmtNum(totA),color:[60,80,180]},
        {val:fmtNum(totG)},
        {val:fmtNum(totPF),color:[60,80,180]},{val:fmtNum(totESI),color:[5,140,90]},
        {val:fmtNum(totPT),color:[180,100,0]},{val:fmtNum(totTDS),color:[200,40,40]},
        {val:fmtNum(totDed),color:[200,40,40]},
        {val:fmtNum(totErPF),color:[71,85,105]},{val:fmtNum(totErESI),color:[71,85,105]},
        {val:fmtNum(totNet),color:[5,140,90]},
      ];
      subVals.forEach(function(cell,i){
        doc.setFontSize(7.3);doc.setFont("helvetica","bold");
        doc.setTextColor.apply(doc,cell.color||[15,23,42]);
        var align=cols[i].align==="r"?"right":"left";
        var tx=align==="right"?cx[i]+cws[i]-3:cx[i]+3;
        doc.text(String(cell.val),tx,ry+rowH/2+1.3,{align:align});
      });
      ry+=rowH;
      grandG+=totG;grandDed+=totDed;grandN+=totNet;grandCTC+=totG+totErPF+totErESI;
    });

    // ── Grand summary across all included departments ──
    if(ry>148){doc.addPage();ry=20;}
    ry+=8;
    doc.setFontSize(9.5);doc.setFont("helvetica","bold");doc.setTextColor(15,23,42);doc.text("GRAND TOTAL - ALL DEPARTMENTS SHOWN",mg,ry);ry+=2;
    doc.setDrawColor(210,218,230);doc.setLineWidth(0.4);doc.line(mg,ry+2,W-mg,ry+2);ry+=9;
    var boxW=(cw-12)/4;
    [["Gross",grandG],["Total Deductions",grandDed],["Net Pay",grandN],["Total CTC (incl. Employer PF/ESI)",grandCTC]].forEach(function(b,i){
      var x=mg+i*(boxW+4);
      doc.setDrawColor(225,230,238);doc.setLineWidth(0.4);doc.roundedRect(x,ry,boxW,17,1.5,1.5);
      doc.setFontSize(7);doc.setFont("helvetica","bold");doc.setTextColor(71,85,105);doc.text(b[0].toUpperCase(),x+5,ry+7);
      doc.setFontSize(10.5);doc.setFont("helvetica","bold");doc.setTextColor(15,23,42);doc.text(fmtIN(b[1]),x+5,ry+13.5);
    });

    pdfFooter(doc,W,mg,H,orgName,orgEmail,logoSrc,authPos,authSign);
    downloadPDF(doc.output("blob"),"Department-Payroll-"+MOS[m]+"-"+String(y)+".pdf");
  },function(){alert("PDF library failed to load.");});
}



function makePayrollCSV(emps,m,y,payFn){
  var header=["Name","Dept","Gross","Absent Ded","Half Ded","Unpaid Ded","PF Emp","ESI Emp","Prof Tax","TDS","Health Ins","Custom","Net Pay","Er PF","Er ESI","Total CTC"];
  var rows=emps.map(function(emp){
    var d=payFn(emp,y,m).d;
    return [emp.name,emp.dept||"",d.gr,d.ad,d.hd,d.ud,d.pfE,d.esiE,d.pt,d.tds,d.hi,d.cd,d.net,d.pfR,d.esiR,d.gr+d.pfR+d.esiR];
  });
  var csv=[header].concat(rows).map(function(r){return r.map(function(c){return '"'+String(c).replace(/"/g,'""')+'"';}).join(",");}).join("\n");
  dlCSV(csv,"Payroll-"+MOS[m]+"-"+y+".csv");
}
function makeEmpCSV(emps){
  var header=["Name","EmpID","Role","Dept","Mobile","Email","PAN","UAN","Monthly CTC","Basic","HRA","Allowance","PF","ESI","PT","TDS","Status","Joined"];
  var rows=emps.map(function(e){return[e.name,e.eid||"",e.role||"",e.dept||"",e.mob||"",e.email||"",e.pan||"",e.uan||"",e.monthlyCTC,e.basic,e.hra,e.allow,e.pf?"Yes":"No",e.esi?"Yes":"No",e.pt?"Yes":"No",e.tds?"Yes":"No",e.status||"active",e.joined||""];});
  var csv=[header].concat(rows).map(function(r){return r.map(function(c){return '"'+String(c).replace(/"/g,'""')+'"';}).join(",");}).join("\n");
  dlCSV(csv,"Employees-"+new Date().toISOString().split("T")[0]+".csv");
}
function makeAttCSV(att,emps){
  var header=["Date","Employee","EmpID","Status"];
  var rows=[];
  Object.entries(att).forEach(function(kv){
    var parts=kv[0].split("_"),date=parts[0],empId=Number(parts[1]);
    var emp=emps.find(function(e){return e.id===empId;});
    if(emp)rows.push([date,emp.name,emp.eid||"",ATL[kv[1]]||kv[1]]);
  });
  rows.sort(function(a,b){return a[0].localeCompare(b[0])||a[1].localeCompare(b[1]);});
  var csv=[header].concat(rows).map(function(r){return r.map(function(c){return '"'+String(c).replace(/"/g,'""')+'"';}).join(",");}).join("\n");
  dlCSV(csv,"Attendance-All-"+new Date().toISOString().split("T")[0]+".csv");
}
function dlCSV(csv,filename){
  var blob=new Blob([csv],{type:"text/csv"});
  downloadBlob(blob,filename);
}

function calcGratuity(emp,asOfDate){
  if(!emp.joined)return{eligible:false,years:0,months:0,amount:0,totalMonths:0};
  var joinDate=new Date(emp.joined);
  var toDate=asOfDate?new Date(asOfDate):new Date();
  var totalMonths=(toDate.getFullYear()-joinDate.getFullYear())*12+(toDate.getMonth()-joinDate.getMonth());
  if(totalMonths<0)totalMonths=0;
  var years=Math.floor(totalMonths/12);
  var remMonths=totalMonths%12;
  // Round up: 6+ months in last year counts as full year
  var roundedYears=remMonths>=6?years+1:years;
  var basic=emp.basic||0;
  var amount=Math.round(basic*(15/26)*roundedYears);
  return{eligible:years>=5,years:years,months:remMonths,totalMonths:totalMonths,roundedYears:roundedYears,amount:amount};
}
var SHIFT_TYPES=["General","Morning","Afternoon","Evening","Night","Rotational"];

// ── HR Policy templates ──────────────────────────────────────────────────────
// Each policy: a short list of fields the owner fills in, and a "build" function
// that turns those fields (+ org info) into clause paragraphs for the PDF.
// Written to reflect standard, sensible Indian SME practice — NOT a substitute
// for legal review, especially for POSH (statutory) and Termination (notice/severance
// rules can vary by state Shops & Establishments Act).
var POLICY_DEFS={
  leave:{
    label:"Leave Policy",icon:"event_available",color:"#0EA5E9",
    blurb:"Casual, sick & earned leave entitlement and how to apply.",
    customPlaceholder:"e.g. Female employees are entitled to an additional 2 days of leave for medical reasons.",
    learnMore:"Sets out how many paid days off employees get each year and how to request them. Having this in writing avoids disputes about how many leaves someone has left or whether unused leave carries over.",
    fields:[
      {key:"casualLeave",label:"Casual Leave (days/year)",type:"number",def:12},
      {key:"sickLeave",label:"Sick Leave (days/year)",type:"number",def:6},
      {key:"earnedLeave",label:"Earned/Privilege Leave (days/year)",type:"number",def:15},
      {key:"carryForward",label:"Unused leave can be carried to next year",type:"select",options:["Yes","No"],def:"Yes"},
      {key:"maxCarryForward",label:"Maximum days that can be carried forward",type:"number",def:15},
      {key:"noticeDays",label:"Advance notice needed for planned leave (days)",type:"number",def:3},
      {key:"weeklyOff",label:"Weekly off day(s)",type:"text",def:"Sunday"},
    ],
    build:function(f,org){
      var orgName=org.name||"the Company";
      return [
        {h:"1. Purpose",b:"This policy sets out the leave entitlement available to employees of "+orgName+" and the process for applying for and approving leave. It applies to all confirmed and probationary employees unless stated otherwise."},
        {h:"2. Leave Entitlement",b:"Employees are entitled to "+f.casualLeave+" days of Casual Leave, "+f.sickLeave+" days of Sick Leave, and "+f.earnedLeave+" days of Earned/Privilege Leave per calendar year, credited on a pro-rata basis for employees joining mid-year. The weekly off is "+f.weeklyOff+"."},
        {h:"3. Applying for Leave",b:"Planned leave (Casual or Earned) must be applied for at least "+f.noticeDays+" day(s) in advance and is subject to approval by the reporting manager, considering business needs and team availability. Sick Leave may be informed on the day of absence and, where the absence exceeds 2 consecutive days, a medical certificate may be requested."},
        {h:"4. Carry Forward",b:f.carryForward==="Yes"?"Unused leave at the end of the calendar year may be carried forward to the following year, subject to a maximum of "+f.maxCarryForward+" days. Leave beyond this limit will lapse and is not encashed unless required by applicable state law.":"Unused leave at the end of the calendar year will lapse and is not carried forward or encashed, except where required by applicable state law."},
        {h:"5. Unauthorised Absence",b:"Absence from work without prior approval and without satisfactory explanation will be treated as unauthorised leave and may be marked as Loss of Pay (LOP). Repeated unauthorised absence may lead to disciplinary action as per the Code of Conduct."},
        {h:"6. Public Holidays",b:"In addition to the leave entitlement above, employees are eligible for public holidays as per the holiday calendar published annually by "+orgName+", in line with applicable national and state holidays."},
      ];
    }
  },
  attendance:{
    label:"Attendance & Working Hours",icon:"clock",color:"#7C3AED",
    blurb:"Working hours, grace period and how attendance is recorded.",
    customPlaceholder:"e.g. Field staff are exempt from biometric marking and must report their location every morning via WhatsApp.",
    learnMore:"Defines working hours and how lateness or absence is tracked. Useful for setting clear expectations, and as a reference if attendance becomes a recurring issue with someone.",
    fields:[
      {key:"workStart",label:"Working hours start at",type:"text",def:"9:30 AM"},
      {key:"workEnd",label:"Working hours end at",type:"text",def:"6:30 PM"},
      {key:"graceMinutes",label:"Grace period for late arrival (minutes)",type:"number",def:10},
      {key:"halfDayHours",label:"Minimum hours present to avoid Half Day marking",type:"number",def:4},
      {key:"markingMethod",label:"How attendance is recorded",type:"text",def:"Biometric / manual register"},
    ],
    build:function(f,org){
      var orgName=org.name||"the Company";
      return [
        {h:"1. Purpose",b:"This policy defines standard working hours and the process for recording attendance at "+orgName+", to ensure fairness and consistency for all employees."},
        {h:"2. Working Hours",b:"Standard working hours are from "+f.workStart+" to "+f.workEnd+", with a break as advised by the reporting manager. A grace period of "+f.graceMinutes+" minutes is allowed for late arrival; arrivals beyond this may be marked late at management's discretion."},
        {h:"3. Half Day & Absence",b:"An employee present for fewer than "+f.halfDayHours+" hours in a day will ordinarily be marked Half Day. Employees who do not report for work and have not informed their manager will be marked absent for that day."},
        {h:"4. Recording Attendance",b:"Attendance is recorded via "+f.markingMethod+". Employees are responsible for ensuring their attendance is correctly marked each working day; discrepancies should be reported to HR within 3 working days."},
        {h:"5. Repeated Late Coming",b:"Frequent late arrival or early departure without approval may affect performance review outcomes and, if persistent, may lead to disciplinary action as per the Code of Conduct."},
      ];
    }
  },
  conduct:{
    label:"Code of Conduct",icon:"verified",color:"#DC2626",
    blurb:"Expected workplace behaviour and disciplinary process.",
    customPlaceholder:"e.g. Employees visiting client sites must wear their company ID card at all times.",
    learnMore:"Lays out expected behaviour at work and what happens if it is not followed. This is usually the document you point to when taking disciplinary action, so it protects you if a dismissal is ever challenged.",
    fields:[
      {key:"dressCode",label:"Dress code",type:"text",def:"Neat, business-casual attire"},
      {key:"deviceUse",label:"Personal phone/device use during work",type:"text",def:"Limited to breaks, except for urgent matters"},
    ],
    build:function(f,org){
      var orgName=org.name||"the Company";
      return [
        {h:"1. Purpose",b:"This Code of Conduct sets the standard of professional behaviour expected from every employee of "+orgName+", to maintain a respectful, safe and productive workplace."},
        {h:"2. Professional Behaviour",b:"Employees are expected to act with honesty, courtesy and professionalism towards colleagues, customers and vendors at all times, and to perform their duties with diligence and care."},
        {h:"3. Respect & Non-Discrimination",b:orgName+" does not tolerate discrimination, harassment, or unfair treatment of any employee on the basis of gender, religion, caste, disability, or any other protected characteristic. Concerns should be raised with HR or the reporting manager."},
        {h:"4. Confidentiality",b:"Employees must not disclose confidential business information, customer data, or trade information to any third party, during or after their employment, except as required in the course of their duties."},
        {h:"5. Dress Code & Workplace Conduct",b:"Employees are expected to maintain "+f.dressCode+" during working hours. Use of personal phones/devices is expected to be "+f.deviceUse+"."},
        {h:"6. Conflict of Interest",b:"Employees must avoid situations where personal interest conflicts with the interest of "+orgName+", including accepting gifts or favours from vendors/customers that could influence business decisions."},
        {h:"7. Disciplinary Process",b:"Breach of this Code may result in disciplinary action proportionate to the conduct concerned — typically progressing through a verbal warning, written warning, final warning, and, for serious or repeated misconduct, termination of employment."},
      ];
    }
  },
  posh:{
    label:"POSH / Anti-Harassment Policy",icon:"lock",color:"#BE185D",
    blurb:"Statutory policy against sexual harassment at the workplace.",
    customPlaceholder:"e.g. Complaints may also be raised anonymously via the suggestion box at reception.",
    learnMore:"A legal requirement in India for any business with 10 or more employees. It explains how harassment complaints are handled and who the Internal Committee is. Skipping this is not just a policy gap, it is a compliance risk.",
    fields:[
      {key:"icPresiding",label:"Internal Committee (IC) Presiding Officer name",type:"text",def:""},
      {key:"icMembers",label:"Other IC members (names, comma separated)",type:"text",def:""},
      {key:"complaintContact",label:"Complaint contact (email or phone)",type:"text",def:""},
    ],
    build:function(f,org){
      var orgName=org.name||"the Company";
      return [
        {h:"1. Statement of Commitment",b:orgName+" is committed to providing a safe workplace, free from sexual harassment, for all employees, in accordance with the Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013 (\"the POSH Act\"). This policy applies to all employees, regardless of gender, and to all visitors and contractors on Company premises."},
        {h:"2. What Constitutes Sexual Harassment",b:"Sexual harassment includes any unwelcome act or behaviour, whether directly or by implication, such as physical contact or advances, a demand or request for sexual favours, sexually coloured remarks, showing pornography, or any other unwelcome physical, verbal or non-verbal conduct of a sexual nature, as defined under the POSH Act."},
        {h:"3. Internal Committee (IC)",b:"As required under the POSH Act, "+orgName+" has constituted an Internal Committee to receive and inquire into complaints."+(f.icPresiding?" Presiding Officer: "+f.icPresiding+".":" An employer with 10 or more employees is legally required to constitute an IC with a senior woman employee as Presiding Officer and at least one external member from an NGO or with relevant legal knowledge; please confirm this composition before finalising.")+(f.icMembers?" Other Members: "+f.icMembers+".":"")},
        {h:"4. Filing a Complaint",b:"Any employee who experiences or witnesses sexual harassment at the workplace may file a written complaint with the Internal Committee within 3 months of the incident (extendable by the IC for reasons recorded in writing)."+(f.complaintContact?" Complaints may be addressed to: "+f.complaintContact+".":"")},
        {h:"5. Inquiry Process & Confidentiality",b:"The IC will complete its inquiry within 90 days of the complaint, maintaining strict confidentiality of the identities of the complainant, respondent and witnesses throughout the process, as mandated under the Act."},
        {h:"6. Protection Against Retaliation",b:orgName+" strictly prohibits retaliation against any employee who, in good faith, files a complaint or participates in an inquiry under this policy. Any act of retaliation will itself be treated as misconduct."},
        {h:"Legal Note",b:"This is a statutory policy. Businesses with 10 or more employees are legally required to constitute an Internal Committee and file an annual report. We strongly recommend having this document, and your IC composition, reviewed by a legal professional to ensure full compliance with the POSH Act."},
      ];
    }
  },
  probation:{
    label:"Probation & Confirmation",icon:"pending_actions",color:"#0D9488",
    blurb:"Probation duration and the path to confirmation.",
    customPlaceholder:"e.g. Sales roles carry an extended 6-month probation period due to seasonal performance cycles.",
    learnMore:"Explains the trial period for new hires before they are confirmed permanent, and what happens if performance is not up to mark. Helps you exit a bad hire cleanly within the probation window.",
    fields:[
      {key:"probationMonths",label:"Probation period (months)",type:"number",def:3},
      {key:"extendable",label:"Probation can be extended if needed",type:"select",options:["Yes","No"],def:"Yes"},
      {key:"noticeProbation",label:"Notice period during probation (days)",type:"number",def:7},
    ],
    build:function(f,org){
      var orgName=org.name||"the Company";
      return [
        {h:"1. Purpose",b:"This policy explains the probation period applicable to new employees joining "+orgName+", and the process leading to confirmation of employment."},
        {h:"2. Probation Period",b:"Every new employee will be on probation for "+f.probationMonths+" month(s) from their date of joining, during which their performance, conduct and fit for the role will be assessed."},
        {h:"3. Extension of Probation",b:f.extendable==="Yes"?"Where performance has not been fully satisfactory, "+orgName+" may, at its discretion, extend the probation period by a further period to allow additional time for improvement, with reasons communicated to the employee in writing.":"The probation period is not ordinarily extended; a confirmation or separation decision will be made at the end of the stated probation period."},
        {h:"4. Confirmation",b:"On satisfactory completion of probation, the employee will receive a written confirmation letter. Confirmed employees become eligible for benefits applicable to permanent staff as per company policy."},
        {h:"5. Notice Period During Probation",b:"During probation, either party may end the employment by providing "+f.noticeProbation+" day(s) written notice, or pay in lieu thereof, shorter than the notice period applicable to confirmed employees."},
      ];
    }
  },
  termination:{
    label:"Termination & Notice Period",icon:"logout",color:"#92400E",
    blurb:"Resignation, termination, notice period and full & final settlement.",
    customPlaceholder:"e.g. Field staff must complete equipment handover within 3 days of their last working day.",
    learnMore:"Covers notice periods, resignation process, and final settlement timelines for both sides. Reduces back-and-forth disputes when someone leaves the company.",
    fields:[
      {key:"noticeDays",label:"Notice period for confirmed employees (days)",type:"number",def:30},
      {key:"fnfDays",label:"Full & Final settlement completed within (days)",type:"number",def:45},
    ],
    build:function(f,org){
      var orgName=org.name||"the Company";
      return [
        {h:"1. Resignation",b:"An employee wishing to resign must submit written resignation to their reporting manager and HR, serving a notice period of "+f.noticeDays+" days, or as mutually agreed in writing. "+orgName+" may, at its discretion, relieve the employee earlier or require pay in lieu of the unserved notice period."},
        {h:"2. Termination by the Company",b:"Employment may be terminated by "+orgName+" by providing equivalent notice or pay in lieu, except in cases of proven misconduct, where employment may be terminated with immediate effect following due process."},
        {h:"3. Full & Final Settlement",b:"On separation, all dues — including pending salary, leave encashment (where applicable) and any other amounts payable — will be settled within "+f.fnfDays+" days of the last working day, subject to completion of exit formalities and clearance."},
        {h:"4. Return of Company Property",b:"The employee must return all company property — including ID card, laptop, access devices and documents — before their last working day. Pending dues may be adjusted against the value of any property not returned."},
        {h:"5. Exit Formalities",b:"An exit interview and handover of pending work/responsibilities to a designated colleague is expected before the last working day, to ensure a smooth transition."},
      ];
    }
  },
  reimbursement:{
    label:"Reimbursement & Expense Policy",icon:"receipt_long",color:"#16A34A",
    blurb:"Eligible expenses, bill submission and approval process.",
    customPlaceholder:"e.g. Fuel reimbursement for two-wheelers is capped at Rs.2,000 per month.",
    learnMore:"Sets rules for what business expenses get reimbursed and how to claim them. Keeps expense claims consistent and avoids awkward case-by-case negotiations.",
    fields:[
      {key:"submitDays",label:"Bills must be submitted within (days of expense)",type:"number",def:30},
      {key:"approver",label:"Who approves claims",type:"text",def:"Reporting Manager"},
      {key:"payoutCycle",label:"Reimbursement is paid out",type:"text",def:"with the next payroll cycle"},
    ],
    build:function(f,org){
      var orgName=org.name||"the Company";
      return [
        {h:"1. Purpose",b:"This policy explains which business expenses are eligible for reimbursement at "+orgName+", and the process for claiming them."},
        {h:"2. Eligible Expenses",b:"Reasonable, pre-approved business expenses — such as local travel, client meeting expenses, and approved purchases made on behalf of the Company — are eligible for reimbursement, supported by valid bills/receipts."},
        {h:"3. Submitting a Claim",b:"Original bills/receipts, along with a brief description of the business purpose, must be submitted within "+f.submitDays+" days of incurring the expense. Claims submitted after this window may not be processed."},
        {h:"4. Approval",b:"All claims require approval from the "+f.approver+" before processing. "+orgName+" reserves the right to query or decline any claim that is not adequately supported or does not appear to be a legitimate business expense."},
        {h:"5. Payment",b:"Approved claims are reimbursed "+f.payoutCycle+", through the same payment method as regular salary unless otherwise specified."},
        {h:"6. Non-Reimbursable Items",b:"Personal expenses, fines/penalties, and any expense not connected to official Company business are not eligible for reimbursement under this policy."},
      ];
    }
  },
  wfh:{
    label:"Work From Home Policy",icon:"home",color:"#2563EB",
    blurb:"Eligibility, approval and expectations for remote work.",
    customPlaceholder:"e.g. WFH is not available during an employee's first 3 months of employment.",
    learnMore:"If you allow remote work even occasionally, this sets expectations around availability and data security. Optional if your business is fully on-site.",
    fields:[
      {key:"daysPerMonth",label:"WFH days allowed per month",type:"number",def:4},
      {key:"eligibility",label:"Who is eligible",type:"text",def:"Confirmed employees, role-dependent"},
      {key:"coreHours",label:"Core availability hours expected",type:"text",def:"10:00 AM - 5:00 PM"},
    ],
    build:function(f,org){
      var orgName=org.name||"the Company";
      return [
        {h:"1. Purpose",b:"This policy sets the framework for working from home (WFH) at "+orgName+", balancing flexibility for employees with business and operational needs."},
        {h:"2. Eligibility",b:"WFH is available to "+f.eligibility+", subject to the nature of the role and approval from the reporting manager. Roles requiring physical presence (e.g. production, on-site support) may not be eligible."},
        {h:"3. Frequency & Approval",b:"Employees may avail up to "+f.daysPerMonth+" WFH day(s) per month, requested in advance and approved by their reporting manager based on workload and team coverage."},
        {h:"4. Availability & Expectations",b:"While working from home, employees are expected to be reachable and responsive during core hours of "+f.coreHours+", and to maintain the same standard of output and responsiveness as when working from office."},
        {h:"5. Equipment & Data Security",b:"Employees are responsible for safeguarding any company data, devices and login credentials used while working remotely, and must not access company systems over unsecured public networks."},
      ];
    }
  }
};

// ── Recruit hub — pre-joining documents (Offer/Appointment) that aren't tied to an existing employee record,
// since the candidate isn't an employee in the system yet. Same pattern as POLICY_DEFS above.
var RECRUIT_DEFS={
  offer:{
    label:"Offer Letter",icon:"mail",color:"#4F46E5",
    blurb:"Pre-joining offer with role, CTC and joining date.",
    learnMore:"Sent to a candidate before they join, confirming the role and compensation being offered. This is conditional — the candidate hasn't joined yet, so no employee ID or signed acceptance is expected at this stage.",
    fields:[
      {key:"name",label:"Candidate Name",type:"text",def:"",required:true},
      {key:"role",label:"Position / Designation",type:"text",def:""},
      {key:"dept",label:"Department",type:"text",def:""},
      {key:"joined",label:"Proposed Joining Date",type:"date",def:""},
      {key:"monthlyCTC",label:"Monthly CTC (Rs.)",type:"number",def:""},
      {key:"leaveEntitlement",label:"Leave Entitlement (days/year, optional)",type:"number",def:""}
    ],
    generate:function(form,org,authPos,authSign){
      makeOfferLetterPDF({name:form.name,role:form.role,dept:form.dept,joined:form.joined,fixedSalary:Number(form.monthlyCTC||0),leaveEntitlement:Number(form.leaveEntitlement||0)},org,authPos,authSign);
    }
  },
  appointment:{
    label:"Appointment Letter",icon:"assignment_turned_in",color:"#2563EB",
    blurb:"Issued once the candidate has joined and accepted.",
    learnMore:"Issued after the candidate has actually joined, confirming the final terms of employment along with their assigned Employee ID. Meant to be signed by both the company and the new employee as acceptance.",
    fields:[
      {key:"name",label:"Employee Name",type:"text",def:"",required:true},
      {key:"eid",label:"Employee ID",type:"text",def:""},
      {key:"role",label:"Position / Designation",type:"text",def:""},
      {key:"dept",label:"Department",type:"text",def:""},
      {key:"joined",label:"Date of Joining",type:"date",def:""},
      {key:"monthlyCTC",label:"Monthly CTC (Rs.)",type:"number",def:""},
      {key:"leaveEntitlement",label:"Leave Entitlement (days/year, optional)",type:"number",def:""}
    ],
    generate:function(form,org,authPos,authSign){
      makeAppointmentLetterPDF({name:form.name,eid:form.eid,role:form.role,dept:form.dept,joined:form.joined,fixedSalary:Number(form.monthlyCTC||0),leaveEntitlement:Number(form.leaveEntitlement||0)},org,authPos,authSign);
    }
  }
};

function lsGet(key,def){try{var v=localStorage.getItem(key);return v!==null?JSON.parse(v):def;}catch(e){return def;}}
function lsSet(key,val){try{localStorage.setItem(key,JSON.stringify(val));}catch(e){}}
// jsPDF is bundled into the app (no CDN), but loaded as its own small chunk via import() instead of
// being baked into the main file — keeps the app itself fast to open. The chunk is fetched once and
// cached in this module-level variable; every later call (and every call while it's still loading)
// resolves from that same cache/promise, so there's no repeat-fetch and no dropped-callback race.
var _jspdfModPromise=null;
function loadJsPDFGlobal(cb,onErr){
  if(!_jspdfModPromise)_jspdfModPromise=import("jspdf");
  _jspdfModPromise.then(function(mod){
    try{ cb(mod.jsPDF); }
    catch(e){ if(typeof showT==="function")showT("PDF error: "+e.message,"err"); if(onErr)onErr(); }
  }).catch(function(e){
    _jspdfModPromise=null; // allow a retry on the next call instead of staying broken forever
    if(typeof showT==="function")showT("Could not load PDF engine: "+e.message,"err");
    if(onErr)onErr();
  });
}
// Single hardened download path used by EVERY file export in the app (PDF, CSV, ECR txt, HTML, JSON
// backup). Centralised so the device-compatibility handling lives in exactly one place.
function downloadBlob(blob,filename){
  var url=URL.createObjectURL(blob);
  var a=document.createElement("a");
  var canDownload="download" in a; // false on some in-app / installed-PWA webviews
  if(canDownload){
    a.href=url;a.download=filename;a.style.display="none";a.rel="noopener";
    document.body.appendChild(a);
    try{a.click();}catch(e){try{window.open(url,"_blank");}catch(e2){}}
    document.body.removeChild(a);
  }else{
    // Device can't honour the download attribute — open in the viewer so the person can Save/Share.
    try{window.open(url,"_blank");}catch(e){}
  }
  setTimeout(function(){URL.revokeObjectURL(url);},30000);
}
function downloadPDF(blob,filename){ downloadBlob(blob,filename); }
function fmtIN(n){var v=Math.round(Number(n||0));if(v<1000)return "Rs."+v;var s=String(v);var last3=s.slice(-3);var rest=s.slice(0,-3);var grouped=rest.replace(/\B(?=(\d{2})+(?!\d))/g,",");return "Rs."+(grouped?grouped+","+last3:last3);}
// Plain comma-grouped number, no currency prefix — used inside PDF table cells (the unit is stated once in the title/header instead).
function fmtNum(n){var v=Math.round(Number(n||0));if(v<1000)return String(v);var s=String(v);var last3=s.slice(-3);var rest=s.slice(0,-3);var grouped=rest.replace(/\B(?=(\d{2})+(?!\d))/g,",");return grouped?grouped+","+last3:last3;}

// navBtn2 and helpers use module-level color vars (ACCENT, GRY etc) set by applyTheme
var EMPS=[];
function navBtn2(id,label,ico,tab,setTab,setSelE,setEditE,setSheetE,setOffE,setEditPayE){
  var active=tab===id;
  return h("button",{onClick:function(){setTab(id);setSelE(null);setEditE(null);setSheetE(null);setOffE(null);setEditPayE(null);},style:{flex:1,background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:"6px 0",color:active?ACCENT:GRY,transition:"color .15s"}},
    h("div",{style:{padding:"5px 14px",borderRadius:14,background:active?ACCENT_SOFT:"transparent",transition:"background .15s",display:"flex",alignItems:"center",justifyContent:"center"}},ic(ICONS[ico],active?ACCENT:GRY,22)),
    h("div",{style:{fontSize:10,fontWeight:active?700:500,letterSpacing:.2}},label)
  );
}
function card(children,mb){return h("div",{style:{background:CARD,border:"1px solid "+BDR,borderRadius:14,padding:16,marginBottom:mb===undefined?12:mb,boxShadow:T.SHADOW}},children);}
function lbl(t){return h("div",{style:{fontSize:11,color:GRY,marginBottom:4,fontWeight:600,letterSpacing:.4}},t);}
function row(l,v,vc){return h("div",{key:l,style:{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid "+BDR}},h("span",{style:{fontSize:12,color:GRY}},l),h("span",{style:{fontSize:12,fontWeight:600,color:vc||NVY}},v));}
// Sentinel marking "Other was tapped but nothing typed yet" — lets the custom text box
// appear immediately on tap, without needing a separate piece of state per field.
var CHIP_CUSTOM_SENTINEL="\u0000CUSTOM\u0000";
// The real popup component: a field-style trigger button that, when tapped, opens a
// bottom-sheet listing every option (icon-free rows, checkmark on the selected one) —
// same overlay/sheet pattern already used elsewhere in this app (dim backdrop, rounded
// top corners, slides up from the bottom), just colored with our own accent, not borrowed.
function ChipSelect(props){
  var value=props.value,onChange=props.onChange,opts=props.opts,opts2=props.opts2||{};
  var allowCustom=!!opts2.allowCustom;
  var sOpen=useState(false),open=sOpen[0],setOpen=sOpen[1];
  var sPending=useState(value),pending=sPending[0],setPending=sPending[1]; // working choice until Save is tapped
  var rawVals=opts.map(function(o){return o&&typeof o==="object"&&o.v!==undefined?o.v:o;});
  var isCustom=allowCustom&&(value===CHIP_CUSTOM_SENTINEL||(!!value&&rawVals.indexOf(value)===-1));
  var idx=rawVals.indexOf(value);
  var selectedLabel=isCustom?(value===CHIP_CUSTOM_SENTINEL?"":value):(idx===-1?"":(function(){var o=opts[idx];return o&&typeof o==="object"&&o.l!==undefined?o.l:o;})());
  function openPopup(){setPending(value);setOpen(true);}
  function commit(){onChange(pending);setOpen(false);}
  var pendingIsCustom=allowCustom&&(pending===CHIP_CUSTOM_SENTINEL||(!!pending&&rawVals.indexOf(pending)===-1));
  return h("div",{style:Object.assign({marginBottom:10},props.wrapStyle||{})},
    h("button",{type:"button",onClick:openPopup,
      style:Object.assign({width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,
        background:SFT,border:"1.5px solid "+BDR,borderRadius:10,padding:"10px 13px",fontSize:13,
        color:selectedLabel?NVY:GRY,cursor:"pointer",fontFamily:"inherit",textAlign:"left",boxSizing:"border-box"},props.triggerStyle||{})},
      h("span",{style:{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}},selectedLabel||opts2.placeholder||"Select..."),
      ic("expand_more",GRY,16)
    ),
    open?h("div",{onClick:function(){setOpen(false);},style:{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:20}},
      h("div",{onClick:function(e){e.stopPropagation();},style:{background:CARD,borderRadius:16,width:"100%",maxWidth:380,maxHeight:"80vh",display:"flex",flexDirection:"column",border:"2px solid "+ACCENT,boxShadow:"0 12px 40px rgba(0,0,0,.35)",overflow:"hidden"}},
        // Header — the question for this specific field
        h("div",{style:{padding:"16px 18px 12px",borderBottom:"1px solid "+BDR,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}},
          h("div",{style:{fontSize:14.5,fontWeight:700,color:NVY}},opts2.question||"Select an option"),
          h("button",{type:"button",onClick:function(){setOpen(false);},style:{background:"none",border:"none",padding:4,cursor:"pointer",display:"flex"}},ic("close",GRY,18))
        ),
        // Scrollable option list
        h("div",{style:{overflowY:"auto",flex:1,padding:"6px 0"}},
          opts.map(function(o){
            var ov=o&&typeof o==="object"&&o.v!==undefined?o.v:o;
            var ol=o&&typeof o==="object"&&o.l!==undefined?o.l:o;
            var on=pending===ov;
            return h("div",{key:String(ov),onClick:function(){setPending(ov);},
              style:{display:"flex",alignItems:"center",gap:11,padding:"12px 18px",cursor:"pointer",background:on?ACCENT_SOFT:"transparent"}},
              h("div",{style:{width:18,height:18,borderRadius:"50%",border:"2px solid "+(on?ACCENT:BDR),display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}},
                on?h("div",{style:{width:9,height:9,borderRadius:"50%",background:ACCENT}}):null
              ),
              h("span",{style:{fontSize:14,color:on?ACCENT:NVY,fontWeight:on?700:500}},ol)
            );
          }),
          allowCustom?h("div",{onClick:function(){setPending(pendingIsCustom?(pending===CHIP_CUSTOM_SENTINEL?"":pending):CHIP_CUSTOM_SENTINEL);},
            style:{display:"flex",alignItems:"center",gap:11,padding:"12px 18px",cursor:"pointer",background:pendingIsCustom?ACCENT_SOFT:"transparent"}},
            h("div",{style:{width:18,height:18,borderRadius:"50%",border:"2px solid "+(pendingIsCustom?ACCENT:BDR),display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}},
              pendingIsCustom?h("div",{style:{width:9,height:9,borderRadius:"50%",background:ACCENT}}):null
            ),
            h("span",{style:{fontSize:14,color:pendingIsCustom?ACCENT:NVY,fontWeight:pendingIsCustom?700:500}},"Other (type your own)")
          ):null,
          pendingIsCustom?h("input",{type:"text",value:pending===CHIP_CUSTOM_SENTINEL?"":pending,
            onChange:function(e){setPending(e.target.value===""?CHIP_CUSTOM_SENTINEL:e.target.value);},
            placeholder:opts2.customPlaceholder||"Type your own...",autoFocus:true,
            style:{width:"calc(100% - 36px)",margin:"4px 18px 8px",background:SFT,border:"1.5px solid "+ACCENT,borderRadius:8,padding:"9px 10px",
              fontSize:13,color:NVY,outline:"none",fontFamily:"inherit",boxSizing:"border-box",display:"block"}}):null
        ),
        // Footer — Save / OK commits the pending choice
        h("div",{style:{padding:"12px 18px",borderTop:"1px solid "+BDR,flexShrink:0}},
          h("button",{type:"button",onClick:commit,disabled:pendingIsCustom&&pending===CHIP_CUSTOM_SENTINEL,
            style:{width:"100%",background:ACCENT,border:"none",borderRadius:10,padding:"11px",color:ACCENT_FG,fontSize:13.5,fontWeight:700,
              cursor:"pointer",opacity:(pendingIsCustom&&pending===CHIP_CUSTOM_SENTINEL)?.5:1}},opts2.btnLabel||"Save")
        )
      )
    ):null
  );
}
// Thin wrapper so every existing call site (chipSelect(value,onChange,opts,opts2)) keeps working unchanged.
function chipSelect(value,onChange,opts,opts2){opts2=opts2||{};return h(ChipSelect,{value:value,onChange:onChange,opts:opts,opts2:opts2,triggerStyle:opts2.triggerStyle,wrapStyle:opts2.wrapStyle});}
// chipSelectScroll's narrow inline use-case now just becomes the same popup with a slimmer trigger.
function chipSelectScroll(value,onChange,opts,style){return h(ChipSelect,{value:value,onChange:onChange,opts:opts,opts2:{},triggerStyle:style});}

// ── Unified themed Modal — every fixed-overlay popup in the app should be built with this, so they all
// look/feel identical: rounded card, 2px accent border, header with title+close, scrollable body, footer.
function Modal(props){
  return h("div",{onClick:props.onClose,style:{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:props.zIndex||500,display:"flex",alignItems:"center",justifyContent:"center",padding:20}},
    h("div",{onClick:function(e){e.stopPropagation();},style:Object.assign({background:CARD,borderRadius:16,width:"100%",maxWidth:380,maxHeight:"85vh",display:"flex",flexDirection:"column",border:"2px solid "+ACCENT,boxShadow:"0 12px 40px rgba(0,0,0,.35)",overflow:"hidden"},props.cardStyle||{})},
      h("div",{style:{padding:"16px 18px 12px",borderBottom:"1px solid "+BDR,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}},
        h("div",{style:{fontSize:14.5,fontWeight:700,color:NVY}},props.title||""),
        h("button",{type:"button",onClick:props.onClose,style:{background:"none",border:"none",padding:4,cursor:"pointer",display:"flex"}},ic("close",GRY,18))
      ),
      h("div",{style:{overflowY:"auto",flex:1,padding:props.bodyPad!==undefined?props.bodyPad:"14px 18px"}},props.children),
      props.footer?h("div",{style:{padding:"12px 18px",borderTop:"1px solid "+BDR,flexShrink:0}},props.footer):null
    )
  );
}

// ── Unified themed DatePicker — replaces every native <input type="date"> in the app with one consistent calendar popup.
function DatePickerPop(props){
  var sOpen=useState(false),open=sOpen[0],setOpen=sOpen[1];
  function initView(){var d=props.value?new Date(props.value+"T00:00:00"):new Date();if(isNaN(d.getTime()))d=new Date();return {y:d.getFullYear(),m:d.getMonth()};}
  var sView=useState(initView),view=sView[0],setView=sView[1];
  var sPending=useState(props.value||""),pending=sPending[0],setPending=sPending[1];
  function pad(n){return String(n).padStart(2,"0");}
  function openPopup(){setView(initView());setPending(props.value||"");setOpen(true);}
  function commit(){if(pending)props.onChange(pending);setOpen(false);}
  function fmtDisp(v){if(!v)return "";var d=new Date(v+"T00:00:00");if(isNaN(d.getTime()))return v;return d.toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"});}
  var firstDow=new Date(view.y,view.m,1).getDay();
  var totalDays=new Date(view.y,view.m+1,0).getDate();
  var cells=[];for(var i=0;i<firstDow;i++)cells.push(null);for(var d2=1;d2<=totalDays;d2++)cells.push(d2);
  var t0=new Date();var todayKey=t0.getFullYear()+"-"+pad(t0.getMonth()+1)+"-"+pad(t0.getDate());
  return h("div",{style:Object.assign({marginBottom:10},props.wrapStyle||{})},
    h("button",{type:"button",onClick:openPopup,
      style:Object.assign({width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,
        background:SFT,border:"1.5px solid "+BDR,borderRadius:10,padding:"10px 13px",fontSize:13,
        color:props.value?NVY:GRY,cursor:"pointer",fontFamily:"inherit",textAlign:"left",boxSizing:"border-box"},props.triggerStyle||{})},
      h("span",{style:{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}},props.value?fmtDisp(props.value):(props.placeholder||"Select date...")),
      ic("calendar_month",GRY,16)
    ),
    open?h(Modal,{title:props.question||"Select date",onClose:function(){setOpen(false);},zIndex:600,cardStyle:{maxWidth:330},bodyPad:"12px 16px",footer:h("div",{style:{display:"flex",gap:8}},
        h("button",{type:"button",onClick:function(){var t=new Date();var k=t.getFullYear()+"-"+pad(t.getMonth()+1)+"-"+pad(t.getDate());setPending(k);setView({y:t.getFullYear(),m:t.getMonth()});},style:{flex:1,background:SFT,border:"1px solid "+BDR,borderRadius:10,padding:"10px",color:NVY,fontSize:12.5,fontWeight:600,cursor:"pointer"}},"Today"),
        h("button",{type:"button",onClick:commit,disabled:!pending,style:{flex:1,background:ACCENT,border:"none",borderRadius:10,padding:"10px",color:ACCENT_FG,fontSize:12.5,fontWeight:700,cursor:"pointer",opacity:pending?1:.5}},"Done")
      )},
      h("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}},
        h("button",{type:"button",onClick:function(){setView(function(v){var m=v.m-1,y=v.y;if(m<0){m=11;y--;}return {y:y,m:m};});},style:{background:SFT,border:"1px solid "+BDR,borderRadius:8,width:30,height:30,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}},ic("chevron_left",NVY,16)),
        h("div",{style:{fontSize:13,fontWeight:700,color:NVY}},MOS[view.m]+" "+view.y),
        h("button",{type:"button",onClick:function(){setView(function(v){var m=v.m+1,y=v.y;if(m>11){m=0;y++;}return {y:y,m:m};});},style:{background:SFT,border:"1px solid "+BDR,borderRadius:8,width:30,height:30,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}},ic("chevron_right",NVY,16))
      ),
      h("div",{style:{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,marginBottom:4}},
        ["S","M","T","W","T","F","S"].map(function(d3,i){return h("div",{key:i,style:{textAlign:"center",fontSize:10,fontWeight:700,color:GRY,padding:"4px 0"}},d3);})
      ),
      h("div",{style:{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3}},
        cells.map(function(d4,i){
          if(d4===null)return h("div",{key:i});
          var key=view.y+"-"+pad(view.m+1)+"-"+pad(d4);
          var sel=pending===key;var isToday=key===todayKey;
          return h("button",{key:i,type:"button",onClick:function(){setPending(key);},style:{aspectRatio:"1",background:sel?ACCENT:"transparent",border:isToday&&!sel?"1.5px solid "+ACCENT:"1.5px solid transparent",borderRadius:8,color:sel?ACCENT_FG:NVY,fontSize:12,fontWeight:sel?700:500,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}},d4);
        })
      )
    ):null
  );
}
function datePick(value,onChange,opts2){opts2=opts2||{};return h(DatePickerPop,{value:value,onChange:onChange,question:opts2.question,placeholder:opts2.placeholder,triggerStyle:opts2.triggerStyle,wrapStyle:opts2.wrapStyle});}

function dlBtn(label,onClick){return h("button",{onClick:onClick,style:{display:"flex",alignItems:"center",justifyContent:"center",gap:6,width:"100%",background:NVY,border:"none",borderRadius:12,padding:"12px",color:CARD,fontSize:13,fontWeight:600,cursor:"pointer",marginBottom:10}},ic(ICONS.dl,CARD,16),label);}
function dlPair(label,onPDF,onCSV,mb){
  return h("div",{style:{marginBottom:mb===undefined?10:mb}},
    h("div",{style:{display:"flex",gap:7}},
      h("button",{onClick:onPDF,style:{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:5,background:NVY,border:"none",borderRadius:10,padding:"11px 8px",color:CARD,fontSize:12,fontWeight:700,cursor:"pointer"}},ic(ICONS.dl,CARD,14),label+" PDF"),
      h("button",{onClick:onCSV,style:{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:5,background:SFT,border:"1px solid "+BDR,borderRadius:10,padding:"11px 8px",color:NVY,fontSize:12,fontWeight:700,cursor:"pointer"}},ic("table_view",NVY,14),label+" CSV")
    )
  );
}
function togEl(label,note,on,setOn){
  return h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:"1px solid "+BDR}},
    h("div",null,h("div",{style:{fontSize:13,fontWeight:600,color:NVY}},label),note?h("div",{style:{fontSize:11,color:GRY}},note):null),
    h("button",{onClick:function(){setOn(function(v){return !v;});},style:{width:44,height:24,borderRadius:12,background:on?NVY:BDR,border:"none",cursor:"pointer",position:"relative",flexShrink:0}},
      h("div",{style:{width:18,height:18,borderRadius:9,background:"#fff",position:"absolute",top:3,left:on?23:3,transition:"left .2s"}})
    )
  );
}
function shareRow(wa){
  return h("div",{style:{display:"flex",gap:8,marginTop:8}},
    h("button",{onClick:wa,style:{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:5,background:SFT,border:"1px solid "+BDR,borderRadius:9,padding:"8px",fontSize:11,fontWeight:700,color:NVY,cursor:"pointer"}},ic(ICONS.wa,NVY,14),"Share via WhatsApp")
  );
}
function av(emp,s){s=s||42;return h("div",{style:{width:s,height:s,borderRadius:Math.round(s*.26),background:SFT,border:"1px solid "+BDR,display:"flex",alignItems:"center",justifyContent:"center",fontSize:Math.round(s*.31),fontWeight:600,color:NVY,flexShrink:0}},emp.av);}
function dInp(ref,ph,type,onChange){return h("input",{ref:ref,type:type||"text",autoComplete:"off",placeholder:ph,defaultValue:"",onChange:onChange,style:{width:"100%",background:T.AUTH_INPUT_BG,border:"1.5px solid "+T.AUTH_INPUT_BDR,borderRadius:12,padding:"13px 14px",fontSize:13,color:T.AUTH_TEXT,outline:"none",fontFamily:"inherit",marginBottom:12}});}
function inpEl(ref,ph,type){return h("input",{ref:ref,type:type||"text",autoComplete:"off",placeholder:ph,defaultValue:"",style:{width:"100%",background:SFT,border:"1.5px solid "+BDR,borderRadius:11,padding:"11px 13px",fontSize:13,color:NVY,outline:"none",fontFamily:"inherit",marginBottom:10}});}
export default function App(){
  var today=new Date();
  var todayStr=today.getFullYear()+"-"+String(today.getMonth()+1).padStart(2,"0")+"-"+String(today.getDate()).padStart(2,"0");
  var curY=today.getFullYear(),curM=today.getMonth();
  var st=useState,sr=useRef,se=useEffect,uc=useCallback;



  // Theme — load from localStorage, default to light
  var initTheme="light";try{var saved=localStorage.getItem("hr_theme");if(saved==="dark"||saved==="light")initTheme=saved;}catch(e){}
  var sTh=st(initTheme),themeMode=sTh[0],setThemeMode=sTh[1];
  applyTheme(themeMode);  // Sync module-level colors to current theme on every render
  var CSS_SPIN="@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}"; var CSS_LIVE=buildCSS(); // Rebuild CSS string for current theme

  var sS=st(function(){var gu=lsGet("hr_guser",null);return gu&&gu.email?"app":"login";}),screen=sS[0],setScreen=sS[1];
  // Unified question/input popup — replaces window.prompt() everywhere with one themed modal.
  // Call askForm(question, fields, onSubmit) anywhere instead of window.prompt; see renderAskModal() for the UI.
  var sAsk=st(null),askModal=sAsk[0],setAskModal=sAsk[1];
  function askForm(question,fields,onSubmit,opts){
    var vals={};fields.forEach(function(f){vals[f.key]=f.def!==undefined?f.def:"";});
    setAskModal({question:question,fields:fields,onSubmit:onSubmit,values:vals,submitLabel:(opts&&opts.submitLabel)||"Continue"});
  }
  var sSessionChecked=st(false),sessionChecked=sSessionChecked[0],setSessionChecked=sSessionChecked[1];
  var sUPD=st(false),showUpdate=sUPD[0],setShowUpdate=sUPD[1];
  var sRPW=st(false),showResetPw=sRPW[0],setShowResetPw=sRPW[1];
  var sREM=st(""),resetEmail=sREM[0],setResetEmail=sREM[1];
  var sRES=st(""),resetSent=sRES[0],setResetSent=sRES[1];
  var sNPW=st(""),newPwd=sNPW[0],setNewPwd=sNPW[1];
  var sNPW2=st(""),newPwd2=sNPW2[0],setNewPwd2=sNPW2[1];
  var sNPWE=st(""),newPwdErr=sNPWE[0],setNewPwdErr=sNPWE[1];
  var sNPWS=st(false),showNewPw=sNPWS[0],setShowNewPw=sNPWS[1];
  var sIsReset=st(false),isPasswordReset=sIsReset[0],setIsPasswordReset=sIsReset[1];
  var sSyncing=st(false),isSyncing=sSyncing[0],setIsSyncing=sSyncing[1];
  var sLastSync=st(null),lastSync=sLastSync[0],setLastSync=sLastSync[1];
  var sLoginTime=st(lsGet("hr_login_time",null)),loginTime=sLoginTime[0],setLoginTime=sLoginTime[1];
  var sDashFresh=st(false),dashFresh=sDashFresh[0],setDashFresh=sDashFresh[1]; // true once Supabase data load (not just localStorage cache) has resolved — gates Dashboard stat numbers to avoid showing stale cached values
  var sADM=st(false),isAdmin=sADM[0],setIsAdmin=sADM[1];
  var sADMUSERS=st([]),adminUsers=sADMUSERS[0],setAdminUsers=sADMUSERS[1];
  var sADMTAB=st("users"),adminTab=sADMTAB[0],setAdminTab=sADMTAB[1];
  var sShowAdmin=st(false),showAdmin=sShowAdmin[0],setShowAdmin=sShowAdmin[1];
  var sAdmSrch=st(""),adminSearch=sAdmSrch[0],setAdminSearch=sAdmSrch[1];
  var sEditExp=st(null),editExpEmail=sEditExp[0],setEditExpEmail=sEditExp[1];
  var sExpInp=st(""),expInput=sExpInp[0],setExpInput=sExpInp[1];
  var sAdmSort=st("newest"),adminSort=sAdmSort[0],setAdminSort=sAdmSort[1];
  var sAdmExp=st(null),adminExpanded=sAdmExp[0],setAdminExpanded=sAdmExp[1];
  var sAdmBlocking=st(null),adminBlocking=sAdmBlocking[0],setAdminBlocking=sAdmBlocking[1];
  se(function(){
    if(!("serviceWorker" in navigator))return;
    navigator.serviceWorker.addEventListener("message",function(e){
      if(e.data&&e.data.type==="NEW_VERSION")setShowUpdate(true);
    });
    // Refresh plan every time user comes back to the app
    window.addEventListener("focus",function(){
      navigator.serviceWorker.getRegistrations().then(function(regs){
        regs.forEach(function(reg){reg.update();});
      });
      // Re-fetch plan from Supabase silently
      _sb.auth.getUser().then(function(res){
        if(!res.data||!res.data.user)return;
        var email=res.data.user.email;
        // Refresh plan AND data from Supabase on focus
        Promise.all([
          _sb.from("user_plans").select("plan,emp_limit,expires_on").eq("email",email).maybeSingle(),
          _sb.from("user_data").select("*").eq("email",email).maybeSingle()
        ]).then(function(results){
          var planRes=results[0],dataRes=results[1];
          if(planRes.data){
            setOrg(function(o){
              var updated=Object.assign({},o,{
                plan:planRes.data.plan||"free",
                emp_limit:(planRes.data.emp_limit!=null)?planRes.data.emp_limit:null,
                expires_on:planRes.data.expires_on||null
              });
              lsSet("hr_org_"+email,updated);
              return updated;
            });
          }
          // Also refresh HR data from Supabase
          if(dataRes.data){
            try{
              var sbUpdated=new Date(dataRes.data.updated_at).getTime();
              var lsUpdated=lsGet("hr_last_sync",null)?new Date(lsGet("hr_last_sync",null)).getTime():0;
              // Only override if Supabase has newer data
              if(sbUpdated>lsUpdated){
                setEmps(JSON.parse(dataRes.data.emps_json||"[]"));
                setAtt(JSON.parse(dataRes.data.att_json||"{}"));
                setIncentives(JSON.parse(dataRes.data.inc_json||"{}"));
                setShifts(JSON.parse(dataRes.data.shifts_json||"{}"));
                setReminders(JSON.parse(dataRes.data.reminders_json||"[]"));
                setNotices(JSON.parse(dataRes.data.notices_json||"[]"));
                setRevisions(JSON.parse(dataRes.data.revisions_json||"{}"));
                try{setTasks(JSON.parse(dataRes.data.tasks_json||"[]"));}catch(e){}
                lsSet("hr_last_sync",dataRes.data.updated_at);
              }
            }catch(e){}
          }
        });
      });
    });
  },[]);
  var sT=st("dashboard"),tab=sT[0],setTab=sT[1];
  var sE=st(function(){var gu=lsGet("hr_guser",null);return gu&&gu.email?lsGet("hr_emps_"+gu.email,[]):[];}),emps=sE[0],setEmps=sE[1];
  var sA=st({}),att=sA[0],setAtt=sA[1];
  var sI=st({}),incentives=sI[0],setIncentives=sI[1];
  var sSE=st(null),selE=sSE[0],setSelE=sSE[1];
  var sEE=st(null),editE=sEE[0],setEditE=sEE[1];
  var sEP=st(null),editPayE=sEP[0],setEditPayE=sEP[1];
  var sPM=st(curM),payM=sPM[0],setPayM=sPM[1];
  var sPY=st(curY),payY=sPY[0],setPayY=sPY[1];
  var sAM=st(curM),attM=sAM[0],setAttM=sAM[1];
  var sAY=st(curY),attY=sAY[0],setAttY=sAY[1];
  var sShowAttDl=st(false),showAttDl=sShowAttDl[0],setShowAttDl=sShowAttDl[1];
  var sShowPayDl=st(false),showPayDl=sShowPayDl[0],setShowPayDl=sShowPayDl[1];
  var sPayDlM=st(curM),payDlM=sPayDlM[0],setPayDlM=sPayDlM[1];
  var sPayDlY=st(curY),payDlY=sPayDlY[0],setPayDlY=sPayDlY[1];
  var sPayDlType=st("emp"),payDlType=sPayDlType[0],setPayDlType=sPayDlType[1];
  var sShowPFDl=st(false),showPFDl=sShowPFDl[0],setShowPFDl=sShowPFDl[1];
  var sShowSalRegDl=st(false),showSalRegDl=sShowSalRegDl[0],setShowSalRegDl=sShowSalRegDl[1];
  var sShowECRDl=st(false),showECRDl=sShowECRDl[0],setShowECRDl=sShowECRDl[1];
  var sAttDlM=st(curM),attDlM=sAttDlM[0],setAttDlM=sAttDlM[1];
  var sAttDlY=st(curY),attDlY=sAttDlY[0],setAttDlY=sAttDlY[1];
  var sAttDlAll=st(false),attDlAll=sAttDlAll[0],setAttDlAll=sAttDlAll[1];
  var sAO=st(false),addOpen=sAO[0],setAddOpen=sAO[1];
  var sST=st(1),step=sST[0],setStep=sST[1];
  var sRV=st("emp"),repV=sRV[0],setRepV=sRV[1];
  var sPR=st(false),prof=sPR[0],setProf=sPR[1];
  var sRM=st(false),showRep=sRM[0],setShowRep=sRM[1];
  var sBkup=st(function(){
    var day=new Date().getDate();
    if(day<1||day>3)return false;
    var dismissed=lsGet("hr_bkup_dismissed","");
    var thisMonth=new Date().getFullYear()+"-"+(new Date().getMonth()+1);
    return dismissed!==thisMonth;
  }),showBkup=sBkup[0],setShowBkup=sBkup[1];
  var sSH=st(null),sheetE=sSH[0],setSheetE=sSH[1];
  var sTO=st(null),toast=sTO[0],setToast=sTO[1];
  var sSTab=st("account"),settTab=sSTab[0],setSettTab=sSTab[1];
  var sAuthPos=st(lsGet("hr_auth_pos","")),authPos=sAuthPos[0],setAuthPos=sAuthPos[1];
  var sAuthSign=st(lsGet("hr_auth_sign","")),authSign=sAuthSign[0],setAuthSign=sAuthSign[1];
  var sWaOfficial=st(lsGet("hr_wa_official","")),waOfficial=sWaOfficial[0],setWaOfficial=sWaOfficial[1];
  var sAuthEdit=st(false),authEditMode=sAuthEdit[0],setAuthEditMode=sAuthEdit[1]; // true while editing Authorised Signatory + WhatsApp section
  var sLoans=st([]),loans=sLoans[0],setLoans=sLoans[1];
  var sExpenses=st([]),expenses=sExpenses[0],setExpenses=sExpenses[1];
  var sWarnings=st([]),warnings=sWarnings[0],setWarnings=sWarnings[1];
  var sExpFilt=st("pending"),expFilt=sExpFilt[0],setExpFilt=sExpFilt[1];
  var sShowExpForm=st(false),showExpForm=sShowExpForm[0],setShowExpForm=sShowExpForm[1];
  var sExpEmpId=st(""),expEmpId=sExpEmpId[0],setExpEmpId=sExpEmpId[1];
  var sExpTitle=st(""),expTitle=sExpTitle[0],setExpTitle=sExpTitle[1];
  var sExpAmt=st(""),expAmt=sExpAmt[0],setExpAmt=sExpAmt[1];
  var sExpCat=st("travel"),expCat=sExpCat[0],setExpCat=sExpCat[1];
  var sExpDesc=st(""),expDesc=sExpDesc[0],setExpDesc=sExpDesc[1];
  var sLoanAmt=st(""),loanAmt=sLoanAmt[0],setLoanAmt=sLoanAmt[1];
  var sLoanPurpose=st(""),loanPurpose=sLoanPurpose[0],setLoanPurpose=sLoanPurpose[1];
  var sLoanMon=st(""),loanMon=sLoanMon[0],setLoanMon=sLoanMon[1];
  var sPayAmt=st(""),payAmt=sPayAmt[0],setPayAmt=sPayAmt[1];
  var sShowLoanForm=st(false),showLoanForm=sShowLoanForm[0],setShowLoanForm=sShowLoanForm[1];
  var sLoanKind=st("loan"),loanKind=sLoanKind[0],setLoanKind=sLoanKind[1];
  var sLoanType=st("personal"),loanType=sLoanType[0],setLoanType=sLoanType[1];
  var sLoanInterest=st(""),loanInterest=sLoanInterest[0],setLoanInterest=sLoanInterest[1];
  var sLoanDate=st(""),loanDate=sLoanDate[0],setLoanDate=sLoanDate[1];
  var sShowWarnForm=st(false),showWarnForm=sShowWarnForm[0],setShowWarnForm=sShowWarnForm[1];
  // Inline dropdown-style forms for letters that need a few details — these expand in place under
  // their button instead of opening a full-screen popup.
  var sNocOpen=st(false),nocOpen=sNocOpen[0],setNocOpen=sNocOpen[1];
  var sNocPurpose=st(""),nocPurpose=sNocPurpose[0],setNocPurpose=sNocPurpose[1];
  var sIncOpen=st(false),incOpen=sIncOpen[0],setIncOpen=sIncOpen[1];
  var sIncRole=st(""),incRole=sIncRole[0],setIncRole=sIncRole[1];
  var sIncCTC=st(""),incCTC=sIncCTC[0],setIncCTC=sIncCTC[1];
  var sIncDate=st(""),incDate=sIncDate[0],setIncDate=sIncDate[1];
  var sIncReason=st(""),incReason=sIncReason[0],setIncReason=sIncReason[1];
  var sRevOpen=st(false),revOpen=sRevOpen[0],setRevOpen=sRevOpen[1];
  var sRevCTC=st(""),revCTC=sRevCTC[0],setRevCTC=sRevCTC[1];
  var sRevDate=st(""),revDate=sRevDate[0],setRevDate=sRevDate[1];
  var sRevReason=st(""),revReason=sRevReason[0],setRevReason=sRevReason[1];
  var sConfMenuOpen=st(false),confMenuOpen=sConfMenuOpen[0],setConfMenuOpen=sConfMenuOpen[1];
  var sConfDateEdit=st(false),confDateEdit=sConfDateEdit[0],setConfDateEdit=sConfDateEdit[1];
  var sConfNewDate=st(""),confNewDate=sConfNewDate[0],setConfNewDate=sConfNewDate[1];
  var sWarnIncident=st(""),warnIncident=sWarnIncident[0],setWarnIncident=sWarnIncident[1];
  var sWarnDate=st(""),warnDate=sWarnDate[0],setWarnDate=sWarnDate[1];
  var sWarnAction=st(""),warnAction=sWarnAction[0],setWarnAction=sWarnAction[1];
  var sWarnType=st("written"),warnType=sWarnType[0],setWarnType=sWarnType[1];
  var sAttRptRange=st("day"),attRptRange=sAttRptRange[0],setAttRptRange=sAttRptRange[1];
  var sAttView=st("calendar"),attView=sAttView[0],setAttView=sAttView[1];
  var sHolidays=st([]),holidays2=sHolidays[0],setHolidays2=sHolidays[1];
  var sShowHolForm=st(false),showHolForm=sShowHolForm[0],setShowHolForm=sShowHolForm[1];
  var sHolName=st(""),holName=sHolName[0],setHolName=sHolName[1];
  var sHolDate=st(""),holDate=sHolDate[0],setHolDate=sHolDate[1];
  var sOnboard=st(function(){return lsGet("hr_onboard_done",false);}),onboardDone=sOnboard[0],setOnboardDone=sOnboard[1];
  var sSalRevisions=st([]),salRevisions=sSalRevisions[0],setSalRevisions=sSalRevisions[1];
  var sOvertime=st([]),overtime=sOvertime[0],setOvertime=sOvertime[1];
  var sOtMode=st("amount"),otMode=sOtMode[0],setOtMode=sOtMode[1];
  var sOtHours=st(""),otHours=sOtHours[0],setOtHours=sOtHours[1];
  var sOtRate=st(""),otRate=sOtRate[0],setOtRate=sOtRate[1];
  var sOtAmount=st(""),otAmount=sOtAmount[0],setOtAmount=sOtAmount[1];
  var sOtDay=st(""),otDay=sOtDay[0],setOtDay=sOtDay[1];
  var sShiftOtTab=st("shift"),shiftOtTab=sShiftOtTab[0],setShiftOtTab=sShiftOtTab[1];
  var sOtDateMode=st("today"),otDateMode=sOtDateMode[0],setOtDateMode=sOtDateMode[1];
  var sOtPickedDate=st(""),otPickedDate=sOtPickedDate[0],setOtPickedDate=sOtPickedDate[1];
  var sOtMarkMode=st("hours"),otMarkMode=sOtMarkMode[0],setOtMarkMode=sOtMarkMode[1];
  var sAttStatsOpen=st(false),attStatsOpen=sAttStatsOpen[0],setAttStatsOpen=sAttStatsOpen[1];
  var sAttSortDept=st(true),attSortDept=sAttSortDept[0],setAttSortDept=sAttSortDept[1]; // default ON — group attendance list by department A-Z
  var sPaySortDept=st(true),paySortDept=sPaySortDept[0],setPaySortDept=sPaySortDept[1]; // default ON — group payroll list by department A-Z
  var sDeptExpEmp=st(null),deptExpEmp=sDeptExpEmp[0],setDeptExpEmp=sDeptExpEmp[1]; // which employee's row is expanded inside the Payroll Dept tab
  var sBonuses=st([]),bonuses=sBonuses[0],setBonuses=sBonuses[1];
  var sShowBonusForm=st(false),showBonusForm=sShowBonusForm[0],setShowBonusForm=sShowBonusForm[1];
  var sShowIncForm=st(false),showIncForm=sShowIncForm[0],setShowIncForm=sShowIncForm[1];
  var sBonusEmpId=st(""),bonusEmpId=sBonusEmpId[0],setBonusEmpId=sBonusEmpId[1];
  var sBonusAmt=st(""),bonusAmt=sBonusAmt[0],setBonusAmt=sBonusAmt[1];
  var sBonusPayM=st(-1),bonusPayM=sBonusPayM[0],setBonusPayM=sBonusPayM[1];
  var sBonusPayY=st(-1),bonusPayY=sBonusPayY[0],setBonusPayY=sBonusPayY[1];
  var sBonusType=st("festival"),bonusType=sBonusType[0],setBonusType=sBonusType[1];
  var sBonusNote=st(""),bonusNote=sBonusNote[0],setBonusNote=sBonusNote[1];
  var sBonusDate=st(""),bonusDate=sBonusDate[0],setBonusDate=sBonusDate[1];
  var sCoExp=st([]),coExp=sCoExp[0],setCoExp=sCoExp[1];
  var sClaims=st([]),claims=sClaims[0],setClaims=sClaims[1];
  var sClaimEmp=st(""),claimEmp=sClaimEmp[0],setClaimEmp=sClaimEmp[1];
  var sClaimCat=st("travel"),claimCat=sClaimCat[0],setClaimCat=sClaimCat[1];
  var sClaimAmt=st(""),claimAmt=sClaimAmt[0],setClaimAmt=sClaimAmt[1];
  var sClaimDate=st(""),claimDate=sClaimDate[0],setClaimDate=sClaimDate[1];
  var sClaimDesc=st(""),claimDesc=sClaimDesc[0],setClaimDesc=sClaimDesc[1];
  var sShowClaimForm=st(false),showClaimForm=sShowClaimForm[0],setShowClaimForm=sShowClaimForm[1];
  var sShowCoExpForm=st(false),showCoExpForm=sShowCoExpForm[0],setShowCoExpForm=sShowCoExpForm[1];
  var sCoExpCat=st("rent"),coExpCat=sCoExpCat[0],setCoExpCat=sCoExpCat[1];
  var sCoExpCustomCat=st(""),coExpCustomCat=sCoExpCustomCat[0],setCoExpCustomCat=sCoExpCustomCat[1];
  var sCoExpAmt=st(""),coExpAmt=sCoExpAmt[0],setCoExpAmt=sCoExpAmt[1];
  var sCoExpDate=st(""),coExpDate=sCoExpDate[0],setCoExpDate=sCoExpDate[1];
  var sCoExpVendor=st(""),coExpVendor=sCoExpVendor[0],setCoExpVendor=sCoExpVendor[1];
  var sCoExpDesc=st(""),coExpDesc=sCoExpDesc[0],setCoExpDesc=sCoExpDesc[1];
  var sCoExpMode=st("cash"),coExpMode=sCoExpMode[0],setCoExpMode=sCoExpMode[1];
  var sCoExpView=st("month"),coExpView=sCoExpView[0],setCoExpView=sCoExpView[1];
  var sCoExpM=st(new Date().getMonth()),coExpM=sCoExpM[0],setCoExpM=sCoExpM[1];
  var sCoExpY=st(new Date().getFullYear()),coExpY=sCoExpY[0],setCoExpY=sCoExpY[1];
  var sLandSlide=st(0);
    var sEditRevId=st(null),editRevId=sEditRevId[0],setEditRevId=sEditRevId[1];
  var sEditRevDate=st(""),editRevDate=sEditRevDate[0],setEditRevDate=sEditRevDate[1];
  var sEditRevReason=st(""),editRevReason=sEditRevReason[0],setEditRevReason=sEditRevReason[1];
  var sShowRevForm=st(false),showRevForm=sShowRevForm[0],setShowRevForm=sShowRevForm[1];
  var sRevNewDate=st(""),revNewDate=sRevNewDate[0],setRevNewDate=sRevNewDate[1];
  var sRevNewOldCtc=st(""),revNewOldCtc=sRevNewOldCtc[0],setRevNewOldCtc=sRevNewOldCtc[1];
  var sRevNewCtc=st(""),revNewCtc=sRevNewCtc[0],setRevNewCtc=sRevNewCtc[1];
  var sRevNewReason=st(""),revNewReason=sRevNewReason[0],setRevNewReason=sRevNewReason[1];
  var sEmpSections=st({joined:false,personal:false,salary:false,leave:false,loans:false,gratuity:false,history:false,warnings:false,bonus:false,letters:false,shift:false});
  var empSections=sEmpSections[0],setEmpSections=sEmpSections[1];
  var sAnnEmpId=st(""),annEmpId=sAnnEmpId[0],setAnnEmpId=sAnnEmpId[1];
  var curFY2=new Date().getMonth()>=3?new Date().getFullYear():new Date().getFullYear()-1;
  var sAnnFY=st(curFY2),annFY=sAnnFY[0],setAnnFY=sAnnFY[1];
  var sProTab=st("kpi"),proTab=sProTab[0],setProTab=sProTab[1];
  var sET=st("active"),empTab=sET[0],setEmpTab=sET[1];
  var sEmpSalFilter=st("all"),empSalFilter=sEmpSalFilter[0],setEmpSalFilter=sEmpSalFilter[1];
  var sOE=st(null),offE=sOE[0],setOffE=sOE[1];
  var sOS=st(1),offStep=sOS[0],setOffStep=sOS[1];
  var sOD=st({reason:"",type:"resigned",handover:[],note:"",resignDate:""}),offData=sOD[0],setOffData=sOD[1];
  var sOffExpand=st(null),offExpandId=sOffExpand[0],setOffExpandId=sOffExpand[1]; // which offboarded employee's full details are expanded
  var sNW=st(new Date()),now=sNW[0],setNow=sNW[1];
  var sBR=st([]),bRemind=sBR[0],setBRemind=sBR[1];
  var sSB=st([]),skipB=sSB[0],setSkipB=sSB[1];
  var sAR=st([]),annivRemind=sAR[0],setAnnivRemind=sAR[1];
  var sESort=st(""),empSort=sESort[0],setEmpSort=sESort[1]; // no ordering criterion active by default — only Group by Dept is on
  var sTeamGroupDept=st(true),teamGroupDept=sTeamGroupDept[0],setTeamGroupDept=sTeamGroupDept[1]; // default ON — group Team list by department, independent of A-Z/Seniority/Salary ordering
  var sESDir=st("asc"),empSortDir=sESDir[0],setEmpSortDir=sESDir[1];
  // ── Pro features state ──
  var sRole=st("owner"),userRole=sRole[0],setUserRole=sRole[1]; // owner/manager/employee
  var sIsEmp=st(false),isEmployeeSignup=sIsEmp[0],setIsEmployeeSignup=sIsEmp[1];
  var sEmpLimit=st(5),empLimit=sEmpLimit[0],setEmpLimit=sEmpLimit[1]; // set by admin per employer
  var sInvCode=st(""),signupInviteCode=sInvCode[0],setSignupInviteCode=sInvCode[1];
  var sEmpDT=st("profile"),empDashTab=sEmpDT[0],setEmpDashTab=sEmpDT[1]; // employee dashboard tab — starts at profile
  var sEmpData=st(null),empData=sEmpData[0],setEmpData=sEmpData[1]; // full employee record from emps
  var sEmpPayMonth=st(new Date().getMonth()),empPayMonth=sEmpPayMonth[0],setEmpPayMonth=sEmpPayMonth[1];
  var sEmpPayYear=st(new Date().getFullYear()),empPayYear=sEmpPayYear[0],setEmpPayYear=sEmpPayYear[1];
  var sEmpSelTask=st(null),empSelTask=sEmpSelTask[0],setEmpSelTask=sEmpSelTask[1];
  var sEmpTaskComment=st(""),empTaskComment=sEmpTaskComment[0],setEmpTaskComment=sEmpTaskComment[1];
  var sEmpLeaveType=st("CL"),empLeaveType=sEmpLeaveType[0],setEmpLeaveType=sEmpLeaveType[1];
  var sEmpLeaveFrom=st(""),empLeaveFrom=sEmpLeaveFrom[0],setEmpLeaveFrom=sEmpLeaveFrom[1];
  var sEmpLeaveTo=st(""),empLeaveTo=sEmpLeaveTo[0],setEmpLeaveTo=sEmpLeaveTo[1];
  var sEmpLeaveReason=st(""),empLeaveReason=sEmpLeaveReason[0],setEmpLeaveReason=sEmpLeaveReason[1];
  var sEmpShowLeave=st(false),empShowLeave=sEmpShowLeave[0],setEmpShowLeave=sEmpShowLeave[1];
  var sEmpEmail=st(""),empEmployerEmail=sEmpEmail[0],setEmpEmployerEmail=sEmpEmail[1];
  var sTasks=st([]),tasks=sTasks[0],setTasks=sTasks[1];
  var sTaskComments=st({}),taskComments=sTaskComments[0],setTaskComments=sTaskComments[1];
  var sSelTask=st(null),selTask=sSelTask[0],setSelTask=sSelTask[1];
  var sShowNewTask=st(false),showNewTask=sShowNewTask[0],setShowNewTask=sShowNewTask[1];
  var sTaskTitle=st(""),taskTitle=sTaskTitle[0],setTaskTitle=sTaskTitle[1];
  var sTaskDesc=st(""),taskDesc=sTaskDesc[0],setTaskDesc=sTaskDesc[1];
  var sTaskAssignType=st("individual"),taskAssignType=sTaskAssignType[0],setTaskAssignType=sTaskAssignType[1];
  var sTaskAssignTarget=st(""),taskAssignTarget=sTaskAssignTarget[0],setTaskAssignTarget=sTaskAssignTarget[1];
  var sTaskPriority=st("medium"),taskPriority=sTaskPriority[0],setTaskPriority=sTaskPriority[1];
  var sTaskDeadline=st(""),taskDeadline=sTaskDeadline[0],setTaskDeadline=sTaskDeadline[1];
  var sTaskComment=st(""),taskComment=sTaskComment[0],setTaskComment=sTaskComment[1];
  var sTaskStatusInput=st(""),taskStatusInput=sTaskStatusInput[0],setTaskStatusInput=sTaskStatusInput[1];
  var sLeaveReqs=st([]),leaveReqs=sLeaveReqs[0],setLeaveReqs=sLeaveReqs[1];
  var sSelLeave=st(null),selLeave=sSelLeave[0],setSelLeave=sSelLeave[1];
  var sShowLeaveForm=st(false),showLeaveForm=sShowLeaveForm[0],setShowLeaveForm=sShowLeaveForm[1];
  var sLeaveType=st("CL"),leaveType=sLeaveType[0],setLeaveType=sLeaveType[1];
  var sLeaveFrom=st(""),leaveFrom=sLeaveFrom[0],setLeaveFrom=sLeaveFrom[1];
  var sLeaveTo=st(""),leaveTo=sLeaveTo[0],setLeaveTo=sLeaveTo[1];
  var sLeaveReason=st(""),leaveReason=sLeaveReason[0],setLeaveReason=sLeaveReason[1];
  var sLeaveReply=st(""),leaveReply=sLeaveReply[0],setLeaveReply=sLeaveReply[1];
  var sNotifs=st([]),notifs=sNotifs[0],setNotifs=sNotifs[1];
  var sUnreadNotifs=st(0),unreadNotifs=sUnreadNotifs[0],setUnreadNotifs=sUnreadNotifs[1];
  var sShowNotifs=st(false),showNotifs=sShowNotifs[0],setShowNotifs=sShowNotifs[1];
  var sShowInvite=st(false),showInvite=sShowInvite[0],setShowInvite=sShowInvite[1];
  var sInviteEmail=st(""),inviteEmail=sInviteEmail[0],setInviteEmail=sInviteEmail[1];
  var sInviteCode=st(""),inviteCode=sInviteCode[0],setInviteCode=sInviteCode[1];
  var sShowInviteCode=st(false),showInviteCode=sShowInviteCode[0],setShowInviteCode=sShowInviteCode[1];
  var sInviteEmpId=st(null),inviteEmpId=sInviteEmpId[0],setInviteEmpId=sInviteEmpId[1]; // employee record being invited
  var sKpis=st([]),kpis=sKpis[0],setKpis=sKpis[1];
  var sKpiUpdates=st([]),kpiUpdates=sKpiUpdates[0],setKpiUpdates=sKpiUpdates[1]; // review/update history entries
  var sShowKpiForm=st(false),showKpiForm=sShowKpiForm[0],setShowKpiForm=sShowKpiForm[1];
  var sKpiName=st(""),kpiName=sKpiName[0],setKpiName=sKpiName[1];
  var sKpiTarget=st(""),kpiTarget=sKpiTarget[0],setKpiTarget=sKpiTarget[1];
  var sKpiUnit=st("Tasks"),kpiUnit=sKpiUnit[0],setKpiUnit=sKpiUnit[1];
  var sKpiStartDate=st(""),kpiStartDate=sKpiStartDate[0],setKpiStartDate=sKpiStartDate[1];
  var sKpiDueDate=st(""),kpiDueDate=sKpiDueDate[0],setKpiDueDate=sKpiDueDate[1];
  var sKpiAssignType=st("individual"),kpiAssignType=sKpiAssignType[0],setKpiAssignType=sKpiAssignType[1];
  var sKpiAssignTarget=st(""),kpiAssignTarget=sKpiAssignTarget[0],setKpiAssignTarget=sKpiAssignTarget[1];
  var sKpiExpandId=st(null),kpiExpandId=sKpiExpandId[0],setKpiExpandId=sKpiExpandId[1]; // which KPI's full details are expanded
  var sKpiUpdateOpenId=st(null),kpiUpdateOpenId=sKpiUpdateOpenId[0],setKpiUpdateOpenId=sKpiUpdateOpenId[1]; // which KPI's "update progress" form is open
  var sKpiProgressInput=st(""),kpiProgressInput=sKpiProgressInput[0],setKpiProgressInput=sKpiProgressInput[1];
  var sKpiRemarkInput=st(""),kpiRemarkInput=sKpiRemarkInput[0],setKpiRemarkInput=sKpiRemarkInput[1];
  var sTaskTab=st("all"),taskTab=sTaskTab[0],setTaskTab=sTaskTab[1];
  var sLeaveTab=st("pending"),leaveTab=sLeaveTab[0],setLeaveTab=sLeaveTab[1];
  var sAttTab=st("mark"),attTab=sAttTab[0],setAttTab=sAttTab[1];
  var sProTab=st("kpi"),proTab=sProTab[0],setProTab=sProTab[1];
  var sEChg=st(false),showEmailChange=sEChg[0],setShowEmailChange=sEChg[1];
  var sNewEm=st(""),newEmailVal=sNewEm[0],setNewEmailVal=sNewEm[1];
  var sEmStp=st(1),emailChangeStep=sEmStp[0],setEmailChangeStep=sEmStp[1];
  var sEmErr=st(""),emailChangeErr=sEmErr[0],setEmailChangeErr=sEmErr[1];
  var sEmLd=st(false),emailChangeLoading=sEmLd[0],setEmailChangeLoading=sEmLd[1];
  var sOR=st(function(){var gu=lsGet("hr_guser",null);return gu&&gu.email?lsGet("hr_org_"+gu.email,{name:"",type:"",email:"",position:"",plan:"free",address:"",logo:""}):{};}),org=sOR[0],setOrg=sOR[1];
  var sOL=st(function(){var gu=lsGet("hr_guser",null);if(!gu||!gu.email)return "";var o=lsGet("hr_org_"+gu.email,{});return o.logo||"";}),orgLogo=sOL[0],setOrgLogo=sOL[1];
  var sOA=st(function(){var gu=lsGet("hr_guser",null);if(!gu||!gu.email)return "";var o=lsGet("hr_org_"+gu.email,{});return o.address||"";}),orgAddr=sOA[0],setOrgAddr=sOA[1];
  var sOPh=st(function(){var gu=lsGet("hr_guser",null);if(!gu||!gu.email)return "";var o=lsGet("hr_org_"+gu.email,{});return o.phone||"";}),orgPhone=sOPh[0],setOrgPhone=sOPh[1];
  var sOWb=st(function(){var gu=lsGet("hr_guser",null);if(!gu||!gu.email)return "";var o=lsGet("hr_org_"+gu.email,{});return o.website||"";}),orgWebsite=sOWb[0],setOrgWebsite=sOWb[1];
  var sOCE=st(function(){var gu=lsGet("hr_guser",null);if(!gu||!gu.email)return "";var o=lsGet("hr_org_"+gu.email,{});return o.contactEmail||"";}),orgContactEmail=sOCE[0],setOrgContactEmail=sOCE[1];
  var sSettReview=st(false),settReviewMode=sSettReview[0],setSettReviewMode=sSettReview[1]; // shows a review/confirm step before Company Details actually saves
  var sSQ=st(""),searchQ=sSQ[0],setSearchQ=sSQ[1];
  var sPW=st(""),pwd=sPW[0],setPwd=sPW[1];
  var sPW2=st(""),pwd2=sPW2[0],setPwd2=sPW2[1];
  var sDept=st(""),dept=sDept[0],setDept=sDept[1];
  var sPF=st(true),pf=sPF[0],setPf=sPF[1];
  var sPFM=st("capped"),pfMode=sPFM[0],setPfMode=sPFM[1];
  var sESI=st(false),esi=sESI[0],setEsi=sESI[1];
  var sPT=st(true),pt=sPT[0],setPt=sPT[1];
  var sTDS=st(true),tds=sTDS[0],setTds=sTDS[1];
  var sTaxRegime=st("new"),taxRegime=sTaxRegime[0],setTaxRegime=sTaxRegime[1];
  var sCU=st([]),customs=sCU[0],setCustoms=sCU[1];
  var sED=st(""),eDept=sED[0],setEDept=sED[1];
  var sEPF=st(true),ePf=sEPF[0],setEPf=sEPF[1];
  var sEPM=st("capped"),ePfM=sEPM[0],setEPfM=sEPM[1];
  var sEES=st(false),eEsi=sEES[0],setEEsi=sEES[1];
  var sEPT=st(true),ePt=sEPT[0],setEPt=sEPT[1];
  var sETD=st(true),eTds=sETD[0],setETds=sETD[1];
  var sETaxRegime=st("new"),eTaxRegime=sETaxRegime[0],setETaxRegime=sETaxRegime[1];
  var sGU=st(function(){return lsGet("hr_guser",null);}),gUser=sGU[0],setGUser=sGU[1];
  var sAEM=st(lsGet("hr_last_email","")),authEmail=sAEM[0],setAuthEmail=sAEM[1];
  var sAPW=st(""),authPwd=sAPW[0],setAuthPwd=sAPW[1];
  var sAPW2=st(""),authPwd2=sAPW2[0],setAuthPwd2=sAPW2[1];
  var sAMD=st("landing"),authMode=sAMD[0],setAuthMode=sAMD[1];
  var sOTP=st(""),authOtp=sOTP[0],setAuthOtp=sOTP[1];
  var sOTPSent=st(false),otpSent=sOTPSent[0],setOtpSent=sOTPSent[1];
  // Signup form fields
  var sSUName=st(""),suName=sSUName[0],setSuName=sSUName[1];
  var sSUOrg=st(""),suOrg=sSUOrg[0],setSuOrg=sSUOrg[1];
  var sSUType=st(""),suType=sSUType[0],setSuType=sSUType[1];
  var sSUPos=st(""),suPos=sSUPos[0],setSuPos=sSUPos[1];
  var sSUEmp=st(""),suEmpRange=sSUEmp[0],setSuEmpRange=sSUEmp[1];
  var sSUAgreed=st(false),suAgreed=sSUAgreed[0],setSuAgreed=sSUAgreed[1];
  var sAER=st(""),authErr=sAER[0],setAuthErr=sAER[1];
  var sALD=st(false),authLoading=sALD[0],setAuthLoading=sALD[1];
  var sShowPw=st(false),showPw=sShowPw[0],setShowPw=sShowPw[1];
  var sSetup=st(false),setupDone=sSetup[0],setSetupDone=sSetup[1];
  var sCN=st(""),setupCompany=sCN[0],setSetupCompany=sCN[1];
  var sPOS=st(""),setupPosition=sPOS[0],setSetupPosition=sPOS[1];
  var sSOT=st(""),setupOrgType=sSOT[0],setSetupOrgType=sSOT[1];
  var sSST=st(""),setupState=sSST[0],setSetupState=sSST[1];
  var sEI=st(""),editPayInc=sEI[0],setEditPayInc=sEI[1];
  var sREV=st(function(){return lsGet("hr_revisions",{});}),revisions=sREV[0],setRevisions=sREV[1];
  var sNT=st(function(){return lsGet("hr_notices",[]);}),notices=sNT[0],setNotices=sNT[1];
  var sRevOpen=st(false),revOpen=sRevOpen[0],setRevOpen=sRevOpen[1];
  var sNotOpen=st(false),notOpen=sNotOpen[0],setNotOpen=sNotOpen[1];
  var sNotTxt=st(""),notTxt=sNotTxt[0],setNotTxt=sNotTxt[1];
  var sREM=st(function(){return lsGet("hr_reminders",[]);}),reminders=sREM[0],setReminders=sREM[1];
  var sRemTxt=st(""),remTxt=sRemTxt[0],setRemTxt=sRemTxt[1];
  var sRemDate=st(""),remDate=sRemDate[0],setRemDate=sRemDate[1];
  var sRemOpen=st(false),remOpen=sRemOpen[0],setRemOpen=sRemOpen[1];
  var sPolicies=st(function(){return lsGet("hr_policies",{});}),policies=sPolicies[0],setPolicies=sPolicies[1];
  var sShowPolicyHub=st(false),showPolicyHub=sShowPolicyHub[0],setShowPolicyHub=sShowPolicyHub[1];
  var sShowRecruitHub=st(false),showRecruitHub=sShowRecruitHub[0],setShowRecruitHub=sShowRecruitHub[1];
  var sRecruitSel=st(null),recruitSel=sRecruitSel[0],setRecruitSel=sRecruitSel[1];
  var sRecruitForm=st({}),recruitForm=sRecruitForm[0],setRecruitForm=sRecruitForm[1];
  var sPolicySel=st(null),policySel=sPolicySel[0],setPolicySel=sPolicySel[1]; // which policy type's form is open, null=list view
  var sPolicyForm=st({}),policyForm=sPolicyForm[0],setPolicyForm=sPolicyForm[1]; // working copy of the field values for the open form
  var sPolicyInfoOpen=st(null),policyInfoOpen=sPolicyInfoOpen[0],setPolicyInfoOpen=sPolicyInfoOpen[1]; // which policy's "Learn more" is expanded in the list
  var sPayFilt=st("all"),payFilt=sPayFilt[0],setPayFilt=sPayFilt[1];
  var sPayDept=st(""),payDept=sPayDept[0],setPayDept=sPayDept[1];
  var sTdsInfoOpen=st(null),tdsInfoOpen=sTdsInfoOpen[0],setTdsInfoOpen=sTdsInfoOpen[1]; // which employee's TDS calculation breakdown is expanded
  var sShowAttExportMenu=st(false),showAttExportMenu=sShowAttExportMenu[0],setShowAttExportMenu=sShowAttExportMenu[1]; // Detailed/Summary choice for the attendance report
  var sSHIFTS=st(function(){return lsGet("hr_shifts",{});}),shifts=sSHIFTS[0],setShifts=sSHIFTS[1];
  var sShiftTab=st("list"),shiftTab=sShiftTab[0],setShiftTab=sShiftTab[1];
  var sShiftOpen=st(false),shiftOpen=sShiftOpen[0],setShiftOpen=sShiftOpen[1];


  // Add employee form - controlled state (refs lost on re-render)
  var sFSalType=st("split"),fSalType=sFSalType[0],setFSalType=sFSalType[1]; // split or fixed
  var sFFixed=st(""),fFixed=sFFixed[0],setFFixed=sFFixed[1]; // fixed salary amount
  var sN1=st(""),fName=sN1[0],setFName=sN1[1];
  var sN2=st(""),fDob=sN2[0],setFDob=sN2[1];
  var sN3=st(""),fMob=sN3[0],setFMob=sN3[1];
  var sN4=st(""),fEmail=sN4[0],setFEmail=sN4[1];
  var sN5=st(""),fJoin=sN5[0],setFJoin=sN5[1];
  var sE1=st(""),fEid=sE1[0],setFEid=sE1[1];
  var sE2=st(""),fRole=sE2[0],setFRole=sE2[1];
  var sE3=st(""),fCtc=sE3[0],setFCtc=sE3[1];
  var sId1=st(""),fAadhar=sId1[0],setFAadhar=sId1[1];
  var sId2=st(""),fPan=sId2[0],setFPan=sId2[1];
  var sId3=st(""),fUan=sId3[0],setFUan=sId3[1];
  var sHi=st(""),fHi=sHi[0],setFHi=sHi[1];
  var sFLv=st(""),fLeave=sFLv[0],setFLeave=sFLv[1];
  var cnR=sr(null),caR=sr(null);
  var revCtcR=sr(null),revDateR=sr(null),revNoteR=sr(null);
  var edn=sr(null),edm=sr(null),edem=sr(null),edei=sr(null),edro=sr(null),edctc=sr(null),edhi=sr(null),edpa=sr(null),edua=sr(null);

  
  // ── System back button handler ──
  // Steps back through in-app sub-screens one at a time (innermost first), then through the
  // bottom-nav tabs back to Dashboard, and only offers to exit the app once already on the
  // Dashboard root with nothing else open — never exits straight from a sub-page.
  se(function(){
    if(screen!=="app")return;
    var lastBackTime=0;
    function handleBack(e){
      if(policySel){setPolicySel(null);history.pushState(null,"",location.href);return;}
      if(recruitSel){setRecruitSel(null);history.pushState(null,"",location.href);return;}
      if(showPolicyHub){setShowPolicyHub(false);history.pushState(null,"",location.href);return;}
      if(showRecruitHub){setShowRecruitHub(false);history.pushState(null,"",location.href);return;}
      if(sheetE){setSheetE(null);history.pushState(null,"",location.href);return;}
      if(selE){setSelE(null);setEditE(null);setOffE(null);history.pushState(null,"",location.href);return;}
      if(editE){setEditE(null);history.pushState(null,"",location.href);return;}
      if(offE){setOffE(null);history.pushState(null,"",location.href);return;}
      if(tab!=="dashboard"){setTab("dashboard");history.pushState(null,"",location.href);return;}
      // Already on Dashboard root with nothing else open — require a second back press to exit
      var now=Date.now();
      if(now-lastBackTime<2000){window.history.back();return;}
      lastBackTime=now;
      showT("Press back again to exit","info");
      history.pushState(null,"",location.href);
    }
    history.pushState(null,"",location.href);
    window.addEventListener("popstate",handleBack);
    return function(){window.removeEventListener("popstate",handleBack);};
  },[screen,tab,selE,editE,offE,sheetE,showPolicyHub,policySel,showRecruitHub,recruitSel]);
  se(function(){if(screen!=="app")return;var t=setInterval(function(){setNow(new Date());},1000);return function(){clearInterval(t);};},[screen]);
  // Preload jsPDF in the background as soon as the app is open, so by the time someone taps a
  // letter/report button the library is already cached — avoids a known mobile-browser issue
  // where a download triggered after an async script load (instead of directly inside the tap)
  // gets silently blocked, even though our own code still shows a "downloaded" toast.
  se(function(){if(screen==="app")loadJsPDFGlobal(function(){},function(){});},[screen]);
  se(function(){if(window.__hideSplash)window.__hideSplash(LOGO_SRC);},[]);
  se(function(){
    if(selE){setEmpSections({salary:false,leave:false,loans:false,gratuity:false,history:false,warnings:false,bonus:false,letters:false,shift:false});
      setNocOpen(false);setNocPurpose("");setIncOpen(false);setIncRole("");setIncCTC("");setIncDate("");setIncReason("");
      setRevOpen(false);setRevCTC("");setRevDate("");setRevReason("");setConfMenuOpen(false);setConfDateEdit(false);setConfNewDate("");}
  },[selE&&selE.id]);
  /* ── Auto-count EMIs monthly ── */
  se(function(){
    if(!gUser||!loans||!loans.length)return;
    var now=new Date();
    var curMo=now.getMonth(),curYr=now.getFullYear();
    var changed=false;
    var newLoans=loans.map(function(l){
      if(l.status==="closed"||l.status==="cleared")return l;
      if(!l.startDate||!l.tenure||!l.emi)return l;
      var start=new Date(l.startDate+"T00:00:00");
      var monthsElapsed=(curYr-start.getFullYear())*12+(curMo-start.getMonth())+1;
      var expected=Math.min(Math.max(0,monthsElapsed),l.tenure);
      if(expected>l.paidInstallments){
        changed=true;
        var newPaid=expected;
        var totalPaid=Math.round(newPaid*l.emi);
        var ns=newPaid>=l.tenure?"closed":"active";
        var closedDate=ns==="closed"?new Date().toISOString().split("T")[0]:null;
        _sb.from("loans").update({paid_installments:newPaid,total_paid:totalPaid,status:ns,closed_date:closedDate}).eq("id",String(l.id)).then(function(r){if(r&&r.error)showT("Loan update failed to save: "+r.error.message,"err");});
        return Object.assign({},l,{paidInstallments:newPaid,totalPaid:totalPaid,status:ns,closedDate:closedDate});
      }
      return l;
    });
    if(changed)setLoans(newLoans);
  },[loans&&loans.length,gUser&&gUser.email]);




  se(function(){

    function loadUserData(user){
      var em=user.email;
      if(_lastAuthEmail.current===em)return; // already loaded this session — avoid full re-fetch
      _lastAuthEmail.current=em;
      setDashFresh(false); // re-arm the dashboard loading skeleton for THIS login — otherwise a 2nd+ login skips the mask and shows stale cached stats briefly
      setGUser({name:em.split("@")[0],email:em,photo:""});
      lsSet("hr_guser",{name:em.split("@")[0],email:em,photo:""});
      Promise.all([
        _sb.from("user_plans").select("*").eq("email",em).maybeSingle(),
        _sb.from("user_orgs").select("*").eq("email",em).maybeSingle(),
        _sb.from("user_data").select("*").eq("email",em).maybeSingle()
      ]).then(function(results){
        var planRes=results[0],orgRes=results[1],dataRes=results[2];
        var plan=(planRes.data&&planRes.data.plan)||"free";
        var isBlocked=(planRes.data&&planRes.data.is_blocked)||false;
        // emp_limit is set by admin — use it directly, fallback to 5 for free
        var rawLimit=(planRes.data&&planRes.data.emp_limit!=null)?Number(planRes.data.emp_limit):(plan==="paid"?999:5);
        setEmpLimit(rawLimit);
        if(isBlocked){
          _sb.auth.signOut();
          setScreen("login");setAuthMode("landing");
          setTimeout(function(){showT("Your account has been suspended. Contact support.","err");},500);
          return;
        }
        setIsAdmin((planRes.data&&planRes.data.is_admin)||false);
        var role=(planRes.data&&planRes.data.role)||"owner";
        var employerEmail=(planRes.data&&planRes.data.employer_email)||"";
        var terminatedAt=(planRes.data&&planRes.data.terminated_at)||null;
        setUserRole(role);
        setEmpEmployerEmail(employerEmail);

        // ── Check terminated employee — 10 day access window ──
        if(role==="terminated_employee"){
          if(terminatedAt){
            var termDate=new Date(terminatedAt);
            var daysSince=Math.floor((new Date()-termDate)/86400000);
            if(daysSince>10){
              // Access expired — block
              _sb.auth.signOut();
              setScreen("login");setAuthMode("landing");
              setTimeout(function(){showT("Your access period has ended. Contact your employer.","err");},500);
              return;
            }
          }
          // Within 10 days — treat as read-only employee
          role="terminated_employee";
          setUserRole("terminated_employee");
        }

        // ── Employee: load employer's data ──────────────────────────────
        if(role==="employee"||role==="terminated_employee"){
          if(!employerEmail){setScreen("app");return;}
          // Set display name from user_orgs full_name
          var empFullName=(orgRes.data&&orgRes.data.full_name)||em.split("@")[0];
          setGUser({name:empFullName,email:em,photo:""});
          lsSet("hr_guser",{name:empFullName,email:em,photo:""});
          setSuName(empFullName); // used in employee dashboard greeting
          // Load employer's org info (company name, logo)
          Promise.all([
            _sb.from("user_orgs").select("org_name,logo_base64,address,phone,website,contact_email").eq("email",employerEmail).maybeSingle(),
            _sb.from("user_data").select("emps_json,att_json,inc_json,tasks_json").eq("email",employerEmail).maybeSingle(),
            _sb.from("user_plans").select("plan,emp_limit").eq("email",employerEmail).maybeSingle()
          ]).then(function(empResults){
            var empOrg=empResults[0].data,empData=empResults[1].data,empPlan=empResults[2].data;
            // Set org to employer's org for display in employee header
            setOrg({
              name:(empOrg&&empOrg.org_name)||"",
              logo:(empOrg&&empOrg.logo_base64)||"",
              address:(empOrg&&empOrg.address)||"",
              phone:(empOrg&&empOrg.phone)||"",
              contactEmail:(empOrg&&empOrg.contact_email)||"",
              website:(empOrg&&empOrg.website)||"",
              email:employerEmail,
              plan:(empPlan&&empPlan.plan)||"free",
              emp_limit:(empPlan&&empPlan.emp_limit)||null
            });
            // Load employer's employee data
            if(empData){try{
              setEmps(JSON.parse(empData.emps_json||"[]"));
              setAtt(JSON.parse(empData.att_json||"{}"));
              setIncentives(JSON.parse(empData.inc_json||"{}"));
              try{setTasks(JSON.parse(empData.tasks_json||"[]"));}catch(e2){}
            }catch(e){}}
            _dataLoaded.current=false;
            setDashFresh(true);
            setScreen("app"); // routes to renderEmployeeDashboard() via userRole check
          }).catch(function(){setDashFresh(true);setScreen("app");});
          return;
        }

        // ── Owner/Admin flow ─────────────────────────────────────────────
        if(orgRes.data&&orgRes.data.org_name){
          var o={
            name:orgRes.data.org_name,email:em,
            position:orgRes.data.position||"",type:orgRes.data.org_type||"",plan:plan,
            emp_limit:(planRes.data&&planRes.data.emp_limit!=null)?planRes.data.emp_limit:null,
            expires_on:(planRes.data&&planRes.data.expires_on)||null,
            address:(orgRes.data&&orgRes.data.address)||"",
            logo:(orgRes.data&&orgRes.data.logo_base64)||"",
            phone:(orgRes.data&&orgRes.data.phone)||"",
            website:(orgRes.data&&orgRes.data.website)||"",
            contactEmail:(orgRes.data&&orgRes.data.contact_email)||""
          };
          lsSet("hr_org_"+em,o);setOrg(o);
          // Load Authorised Signatory + Higher Official WhatsApp from Supabase (synced across devices)
          setAuthSign(orgRes.data.auth_sign||"");lsSet("hr_auth_sign",orgRes.data.auth_sign||"");
          setAuthPos(orgRes.data.auth_pos||"");lsSet("hr_auth_pos",orgRes.data.auth_pos||"");
          setWaOfficial(orgRes.data.wa_official||"");lsSet("hr_wa_official",orgRes.data.wa_official||"");
          if(dataRes.data){try{
            setEmps(JSON.parse(dataRes.data.emps_json||"[]"));
            setAtt(JSON.parse(dataRes.data.att_json||"{}"));
            setIncentives(JSON.parse(dataRes.data.inc_json||"{}"));
            setShifts(JSON.parse(dataRes.data.shifts_json||"{}"));
            setReminders(JSON.parse(dataRes.data.reminders_json||"[]"));
            setNotices(JSON.parse(dataRes.data.notices_json||"[]"));
            setRevisions(JSON.parse(dataRes.data.revisions_json||"{}"));
                try{setTasks(JSON.parse(dataRes.data.tasks_json||"[]"));}catch(e){}
            lsSet("hr_last_sync",dataRes.data.updated_at);
          }catch(e){}}
          _dataLoaded.current=false;
          setDashFresh(true);
          setScreen("app");
        } else {
          setScreen("setup");
        }
      }).catch(function(){
        var cached=lsGet("hr_org_"+em,null);
        if(cached&&cached.name){setOrg(cached);setDashFresh(true);setScreen("app");} // network failure — fall back to cached data rather than an endless loading state
        else setScreen("setup");
      });
    }

    // Single listener — INITIAL_SESSION is the first event, handles everything
    var loaded=false;
    var sub=_sb.auth.onAuthStateChange(function(event,session){
      if((event==="INITIAL_SESSION"||event==="SIGNED_IN")&&session&&session.user){
        if(loaded)return; // prevent double-load on app open
        // Don't interfere if employee OTP flow is handling it
        if(authMode==="emp-otp")return;
        loaded=true;
        loadUserData(session.user);
        // Reset after 3s so next OTP login works
        setTimeout(function(){loaded=false;},3000);
      }
      if(event==="INITIAL_SESSION"&&!session){
        setScreen("login");setAuthMode("landing");
      }
      if(event==="SIGNED_OUT"){
        loaded=false;_lastAuthEmail.current=null;
        setGUser(null);lsSet("hr_guser",null);
        setEmps([]);setAtt({});setIncentives({});setRevisions({});setReminders([]);setShifts({});setNotices([]);
        setOrg({name:"",type:"",email:"",position:"",plan:"free",address:"",logo:""});
        setScreen("login");setAuthMode("landing");
      }
      if(event==="PASSWORD_RECOVERY"){setIsPasswordReset(true);setScreen("login");}
    });
    return function(){
      try{sub.data&&sub.data.subscription&&sub.data.subscription.unsubscribe();}catch(e){}
    };
  },[]);


  
  se(function(){
    if(!gUser||!gUser.email){_lastLoadedEmail.current=null;return;}
    var em=gUser.email;
    if(_lastLoadedEmail.current===em)return;
    _lastLoadedEmail.current=em;
    var safe=function(t,c,v){try{return _sb.from(t).select("*").eq(c,v).then(function(r){if(r&&r.error){console.error("Load failed for "+t+":",r.error);return null;}return r.data||[];}).catch(function(e){console.error("Load failed for "+t+":",e);return null;});}catch(e){return Promise.resolve(null);}};
    Promise.all([safe("loans","employer_email",em),safe("expenses","employer_email",em),safe("warnings","employer_email",em),safe("holidays","employer_email",em),safe("company_expenses","employer_email",em),safe("salary_revisions","employer_email",em),safe("bonuses","employer_email",em),safe("staff_claims","employer_email",em),safe("overtime","employer_email",em),safe("kpis","employer_email",em),safe("kpi_updates","employer_email",em)]).then(function(res){
      // null means the fetch itself failed (network/server error) — keep whatever's already in
      // state rather than overwriting real data with an empty list just because of a blip.
      try{if(res[0]!==null)setLoans((res[0]||[]).map(function(l){return {id:l.id,employerEmail:l.employer_email,employeeId:l.employee_id,employee_id:l.employee_id,employeeName:l.employee_name,amount:l.amount,purpose:l.purpose,date:l.date,kind:l.kind||"loan",loanType:l.loan_type||"personal",advanceType:l.advance_type||"salary",interestRate:Number(l.interest_rate||0),tenure:Number(l.tenure||0),emi:Number(l.emi||0),startDate:l.start_date||l.date,endDate:l.end_date,paidInstallments:Number(l.paid_installments||0),totalPaid:Number(l.total_paid||0),closedDate:l.closed_date,monthlyDeduction:l.monthly_deduction,monthly_deduction:l.monthly_deduction,paidAmount:l.paid_amount,paid_amount:l.paid_amount,status:l.status,createdAt:l.created_at};}));}catch(e){}
      try{if(res[1]!==null)setExpenses((res[1]||[]).map(function(ex){return {id:ex.id,employerEmail:ex.employer_email,employeeId:ex.employee_id,employeeName:ex.employee_name,title:ex.title,amount:ex.amount,category:ex.category,description:ex.description,status:ex.status,month:ex.month,year:ex.year,createdAt:ex.created_at};}));}catch(e){}
      try{if(res[7]!==null)setClaims((res[7]||[]).map(function(c){return{id:c.id,employeeId:c.employee_id,employeeName:c.employee_name,category:c.category,amount:Number(c.amount),date:c.date,description:c.description,status:c.status||"approved",month:Number(c.month),year:Number(c.year)};}));}catch(e){}
      try{if(res[6]!==null)setBonuses((res[6]||[]).map(function(b){return{id:b.id,employeeId:b.employee_id,employeeName:b.employee_name,amount:Number(b.amount),type:b.type,note:b.note,date:b.date,payMonth:b.pay_month!=null?Number(b.pay_month):-1,payYear:b.pay_year!=null?Number(b.pay_year):-1};}));}catch(e){}
      try{if(res[8]!==null)setOvertime((res[8]||[]).map(function(o){return{id:o.id,employeeId:o.employee_id,employeeName:o.employee_name,month:Number(o.month),year:Number(o.year),day:o.day!=null?Number(o.day):null,mode:o.ot_mode||"amount",hours:Number(o.ot_hours||0),rate:Number(o.ot_rate||0),amount:Number(o.ot_amount||0),note:o.note};}));}catch(e){}
      try{if(res[5]!==null)setSalRevisions((res[5]||[]).map(function(r){return{id:r.id,employeeId:r.employee_id,employeeName:r.employee_name,effectiveDate:r.effective_date,oldCtc:Number(r.old_ctc),newCtc:Number(r.new_ctc),reason:r.reason};}));}catch(e){}
      try{if(res[4]!==null)setCoExp((res[4]||[]).map(function(e){return{id:e.id,date:e.date,category:e.category,customCategory:e.custom_category,amount:Number(e.amount),vendor:e.vendor,description:e.description,paymentMode:e.payment_mode,month:e.month,year:e.year};}));}catch(e){}
      try{if(res[3]!==null)setHolidays2((res[3]||[]).map(function(h2){return{id:h2.id,name:h2.name,date:h2.date};}));}catch(e){}
      try{if(res[2]!==null)setWarnings((res[2]||[]).map(function(w){return {id:w.id,employerEmail:w.employer_email,employeeId:w.employee_id,employee_id:w.employee_id,employeeName:w.employee_name,incidentDate:w.incident_date,incident:w.incident,actionRequired:w.action_required,warningType:w.warning_type,acknowledged:w.acknowledged,createdAt:w.created_at};}));}catch(e){}
      try{if(res[9]!==null)setKpis((res[9]||[]).map(function(k){return {id:k.id,employerEmail:k.employer_email,assignType:k.assign_type,assignTarget:k.assign_target,title:k.title,name:k.title,targetValue:Number(k.target_value||0),target:Number(k.target_value||0),currentProgress:Number(k.current_progress||0),unit:k.unit,startDate:k.start_date,dueDate:k.due_date,status:k.status,followUpRemarks:k.follow_up_remarks||"",createdAt:k.created_at};}));}catch(e){}
      try{if(res[10]!==null)setKpiUpdates((res[10]||[]).map(function(u){return {id:u.id,kpiId:u.kpi_id,progress:Number(u.progress||0),remark:u.remark||"",createdAt:u.created_at};}));}catch(e){}
    }).catch(function(){});
  },[gUser&&gUser.email]);

  se(function(){
    lsSet("hr_org",org); // cache org for offline/fast-load — safe to do on every change
  },[org]);
  // Whenever the employee list loads/changes, settle anyone whose scheduled last working date
  // has now passed — moves them from "still active, offboard pending" to actually offboarded.
  // Self-limiting: settleOffboards only calls setEmps when something genuinely needs settling,
  // so this can't loop.
  se(function(){
    if(emps&&emps.length>0)settleOffboards();
  },[emps.length]);
  // Hydrate the editable Settings form fields from org ONLY once per login (not on every org change),
  // so a background org refresh (e.g. after saving, or a Supabase round-trip) can never clobber an
  // in-progress edit — this was the root cause of the logo (and occasionally address/phone) disappearing.
  se(function(){
    if(org.logo!==undefined)setOrgLogo(org.logo||"");
    if(org.address!==undefined)setOrgAddr(org.address||"");
    if(org.phone!==undefined)setOrgPhone(org.phone||"");
    if(org.website!==undefined)setOrgWebsite(org.website||"");
    if(org.contactEmail!==undefined)setOrgContactEmail(org.contactEmail||"");
  },[gUser&&gUser.email]);

  // ── Auto-sync to Supabase on any data change (debounced 2s) ──
  var _syncTimer=React.useRef(null);
  var _dataLoaded=React.useRef(false);
  var _lastLoadedEmail=React.useRef(null);
  var _lastAuthEmail=React.useRef(null);
  se(function(){
    if(!gUser||!gUser.email)return;
    // Skip first render — data hasn't loaded from Supabase yet
    if(!_dataLoaded.current){_dataLoaded.current=true;return;}
    var _em=gUser.email;
    lsSet("hr_emps_"+_em,emps);
    lsSet("hr_att_"+_em,att);
    lsSet("hr_inc_"+_em,incentives);
    if(_syncTimer.current)clearTimeout(_syncTimer.current);
    _syncTimer.current=setTimeout(function(){
      if(!gUser||!gUser.email)return;
      syncToSupabase(emps,att,incentives,shifts,reminders,notices,revisions);
    },1500);
    return function(){if(_syncTimer.current)clearTimeout(_syncTimer.current);};
  },[emps,att,incentives,shifts,reminders,notices,revisions]);

  // Debounced task sync (separate from main sync) — persists tasks_json
  var _taskSyncTimer=React.useRef(null);
  var _tasksLoaded=React.useRef(false);
  se(function(){
    if(!gUser||!gUser.email)return;
    // Skip first render — tasks haven't loaded yet
    if(!_tasksLoaded.current){_tasksLoaded.current=true;return;}
    if(_taskSyncTimer.current)clearTimeout(_taskSyncTimer.current);
    _taskSyncTimer.current=setTimeout(function(){
      syncTasks(tasks);
    },1200);
    return function(){if(_taskSyncTimer.current)clearTimeout(_taskSyncTimer.current);};
  },[tasks]);




  se(function(){
    var td=new Date(),tdDate=new Date(td.getFullYear(),td.getMonth(),td.getDate());
    // Birthdays within 30 days
    var upcoming=emps.filter(function(e){return e.status==="active"&&e.dob&&!skipB.includes(e.id);}).filter(function(e){
      var dob=new Date(e.dob),bday=new Date(td.getFullYear(),dob.getMonth(),dob.getDate());
      if(bday<tdDate)bday.setFullYear(td.getFullYear()+1);
      var diff=Math.ceil((bday-tdDate)/86400000);
      return diff<=30;
    });
    setBRemind(upcoming);
    // Work anniversaries within 30 days
    var annivs=emps.filter(function(e){return e.status==="active"&&e.joined;}).map(function(e){
      var doj=new Date(e.joined);
      var anniv=new Date(td.getFullYear(),doj.getMonth(),doj.getDate());
      if(anniv<tdDate)anniv.setFullYear(td.getFullYear()+1);
      var diff=Math.ceil((anniv-tdDate)/86400000);
      var years=anniv.getFullYear()-doj.getFullYear();
      return {emp:e,diff:diff,years:years,anniv:anniv};
    }).filter(function(a){return a.diff<=30&&a.years>0;});
    setAnnivRemind(annivs);
  },[emps,skipB]);


  showT=function(msg,type){setToast({msg:msg,type:type||"ok"});setTimeout(function(){setToast(null);},2500);};
  function pastMonths(y){var r=[];for(var m2=0;m2<=(y===curY?curM:11);m2++)r.push(m2);return r;}
  function pastYears(){var r=[];for(var y=2020;y<=curY;y++)r.push(y);return r;}
  function ak(date,id){return date+"_"+id;}
  function getAtt(date,id){return att[ak(date,id)]||"unmarked";}
  function getTAtt(id){return getAtt(todayStr,id);}

  var mAtt=uc(function(id,y,m2){
    var pfx=y+"-"+String(m2+1).padStart(2,"0");
    var a=0,h2=0,p=0,pl=0,ul=0,hl=0;
    Object.entries(att).forEach(function(kv){var k=kv[0],v=kv[1];if(k.startsWith(pfx)&&k.endsWith("_"+id)){if(v==="absent")a++;else if(v==="half")h2++;else if(v==="present")p++;else if(v==="paid")pl++;else if(v==="unpaid")ul++;else if(v==="holiday")hl++;}});
    return{absent:a,half:h2,present:p,paid:pl,unpaid:ul,holiday:hl};
  },[att]);

  var proRata=uc(function(e,y,m2){
    var r=empActiveRangeInMonth(e,y,m2);
    return {active:r.activeDays,total:r.fullDays,partial:r.joinedMidMonth||r.exitedMidMonth,notYetJoined:r.notYetJoined,alreadyLeft:r.alreadyLeft,range:r};
  },[]);
  var getInc=uc(function(id,y,m2){return incentives[id+"_"+y+"_"+m2]||0;},[incentives]);

  var OWNER_EMAIL="authorhalik@gmail.com";
  var isPaid=org.plan==="paid";
  var isFree=!isPaid;
  var EMP_LIMIT=org.emp_limit||(isPaid?org.emp_limit||999:5); // free=5, paid=set by admin
  function needPaid(){showT("This feature requires Paid Plan. Upgrade to access.","err");}
  var actEmps=emps.filter(function(e){return e.status==="active";});
    // In payroll — only process employees within plan limit
    var actEmpsForPayroll=(function(){
      var lim=empLimit||5;
      var sorted=actEmps.slice().sort(function(a,b){return new Date(a.joined||0)-new Date(b.joined||0);});
      return sorted.slice(0,lim);
    })();
  var trmEmps=emps.filter(function(e){return e.status==="terminated"||e.status==="resigned";});
  var tGross=actEmps.reduce(function(a,e){var mp=getMonthPay(e,curY,curM);return mp.isActive?a+mp.d.gr:a;},0);
  var tNet=actEmps.reduce(function(a,e){var mp=getMonthPay(e,curY,curM);return mp.isActive?a+mp.netFinal:a;},0);

  function addOTEntry(emp,m2,y){
    // Determine the day from date mode (today or picked date)
    var day;
    if(otDateMode==="today"){
      var td=new Date();
      if(td.getFullYear()!==y||td.getMonth()!==m2)return showT("Today is not in the viewed month — use Pick Date","err");
      day=td.getDate();
    }else{
      if(!otPickedDate)return showT("Pick a date first","err");
      var pd=new Date(otPickedDate+"T00:00:00");
      if(pd.getFullYear()!==y||pd.getMonth()!==m2)return showT("Pick a date within "+MOS[m2]+" "+y,"err");
      day=pd.getDate();
    }
    if(!isEmployedOnDay(emp,y,m2,day))return showT("Employee not employed on that day","err");
    // Use the chosen mark mode (hourly or flat) with the employee's saved rates
    var otType=otMarkMode;
    var empRate=Number(emp.otRate||0);
    var empFlat=Number(emp.otFlat||0);
    if(otType==="hours"){
      if(!empRate)return showT("No hourly rate set — add it in the Shift + OT tab","err");
      if(!otHours)return showT("Enter overtime hours","err");
    }else{
      if(!empFlat)return showT("No flat amount set — add it in the Shift + OT tab","err");
    }
    var dup=getOTEntries(emp.id,m2,y).find(function(o){return o.day===day;});
    var rec={
      id:dup?dup.id:String(Date.now())+"_"+day,
      employeeId:String(emp.id),employeeName:emp.name,
      month:m2,year:y,day:day,mode:otType,
      hours:otType==="hours"?Number(otHours||0):0,
      rate:otType==="hours"?empRate:0,
      amount:otType==="amount"?empFlat:0,
      note:""
    };
    setOvertime(function(p){var others=(p||[]).filter(function(o){return o.id!==rec.id;});return others.concat([rec]);});
    _sb.from("overtime").upsert({id:rec.id,employer_email:gUser.email,employee_id:rec.employeeId,employee_name:rec.employeeName,month:m2,year:y,day:day,ot_mode:rec.mode,ot_hours:rec.hours,ot_rate:rec.rate,ot_amount:rec.amount,note:""}).then(function(r){if(r&&r.error)showT("Error saving OT","err");else showT(dup?"OT updated for day "+day:"OT added for day "+day);});
    setOtHours("");setOtPickedDate("");
  }
  function deleteOTEntry(entryId){
    setOvertime(function(p){return (p||[]).filter(function(o){return o.id!==entryId;});});
    _sb.from("overtime").delete().eq("id",entryId).then(function(){showT("OT entry removed");});
  }
  function cycleAtt(date,id){
    var realToday=new Date();
    var realTodayStr=realToday.getFullYear()+"-"+String(realToday.getMonth()+1).padStart(2,"0")+"-"+String(realToday.getDate()).padStart(2,"0");
    if(date>realTodayStr)return showT("Can't mark attendance for a future date","err");
    var cur=getAtt(date,id),nxt=ATO[(ATO.indexOf(cur)+1)%ATO.length];
    setAtt(function(v){var o=Object.assign({},v);o[ak(date,id)]=nxt;return o;});
    var emp=emps.find(function(e){return e.id===id;});
    showT((emp?emp.name:"")+": "+ATL[nxt]);
  }
  function markHolidayAll(date){
    var now2=new Date();
    var todayStr2=now2.getFullYear()+"-"+String(now2.getMonth()+1).padStart(2,"0")+"-"+String(now2.getDate()).padStart(2,"0");
    if(date>todayStr2)return showT("Can't mark attendance for a future date","err");
    setAtt(function(v){var o=Object.assign({},v);actEmps.forEach(function(e){o[ak(date,e.id)]="holiday";});return o;});
    showT("Holiday marked for all");
  }

  function checkEmpLimit(){
    var limit=gUser&&gUser.email===OWNER_EMAIL?999:(org.emp_limit!=null?Number(org.emp_limit):(isPaid?999:3));
    if(actEmps.length>=limit){
      showT("Employee limit reached ("+limit+" max). "+(isPaid?"Contact support to increase.":"Upgrade to Paid for more."),"err");
      return false;
    }
    return true;
  }
  function saveEmp(){
    if(!checkEmpLimit())return;
    var name=fName.trim();if(!name)return showT("Name required","err");
    var ctc=Number(fCtc)||0;if(!ctc)return showT("Monthly CTC required","err");
    var roleClean=fRole===CHIP_CUSTOM_SENTINEL?"":fRole;
    var deptClean=dept===CHIP_CUSTOM_SENTINEL?"":dept;
    var bd=brkSal(ctc);
    var isFixed=fSalType==="fixed";
    var fixedAmt=isFixed?Number(fFixed)||ctc:0;
    var emp={id:Date.now(),name:name,dob:fDob,mob:fMob,email:fEmail,eid:fEid,role:roleClean,dept:deptClean,
      salaryType:fSalType,
      monthlyCTC:isFixed?fixedAmt:ctc,
      fixedSalary:isFixed?fixedAmt:0,
      basic:isFixed?fixedAmt:bd.basic,
      hra:isFixed?0:bd.hra,
      allow:isFixed?0:bd.allow,
      joined:fJoin||todayStr,pan:fPan,uan:fUan,aadhar:fAadhar,leaveEntitlement:Number(fLeave)||12,
      pf:pf,pfMode:pfMode,esi:esi,pt:pt,tds:tds,taxRegime:taxRegime,hi:Number(fHi)||0,customs:customs,
      av:name.split(" ").map(function(w){return w[0];}).join("").slice(0,2).toUpperCase(),
      col:COLS[emps.length%COLS.length],status:"active"};
    setEmps(function(p){return p.concat([emp]);});
    setFName("");setFDob("");setFMob("");setFEmail("");setFJoin("");
    setFEid("");setFRole("");setFCtc("");setFAadhar("");setFPan("");setFUan("");setFHi("");setFLeave("");
    setDept("");setPf(true);setPfMode("capped");setEsi(false);setPt(true);setTds(true);setCustoms([]);
    setStep(1);setAddOpen(false);showT(name+" added!");
  }
  function openEdit(emp){
    setEditE(Object.assign({},emp));
    setEDept(emp.dept||"");
    setEPf(emp.pf);
    setEPfM(emp.pfMode||"capped");
    setEEsi(emp.esi);
    setEPt(emp.pt);
    setETds(emp.tds!==false);
    setETaxRegime(emp.taxRegime||"new");
  }
  function saveEdit(){
    var ctc=Number(editE.monthlyCTC)||0;if(!ctc)return showT("CTC required","err");
    var bd=brkSal(ctc);
    var roleClean=editE.role===CHIP_CUSTOM_SENTINEL?"":editE.role;
    var deptClean=(eDept===CHIP_CUSTOM_SENTINEL?"":eDept)||(editE.dept===CHIP_CUSTOM_SENTINEL?"":editE.dept)||"";
    var updated=Object.assign({},editE,{leaveEntitlement:Number(editE.leaveEntitlement)||0,
      monthlyCTC:ctc,basic:bd.basic,hra:bd.hra,allow:bd.allow,
      hi:Number(editE.hi)||0,pf:ePf,pfMode:ePfM,esi:eEsi,pt:ePt,tds:eTds,taxRegime:eTaxRegime,
      role:roleClean,dept:deptClean
    });
    var newEmps=emps.map(function(e){return e.id===editE.id?updated:e;});
    var em=gUser&&gUser.email?gUser.email:lsGet("hr_last_email","");
    // Record salary revision if CTC changed
    if(editE.id){
      var oldEmp=emps.find(function(e){return e.id===editE.id;});
      var oldCtc2=Number(oldEmp&&(oldEmp.monthlyCTC||oldEmp.fixedSalary)||0);
      var newCtc2=ctc;
      if(oldCtc2>0&&oldCtc2!==newCtc2){
        var rev={id:Date.now(),employeeId:String(editE.id),employeeName:editE.name||"",effectiveDate:new Date().toISOString().split("T")[0],oldCtc:oldCtc2,newCtc:newCtc2,reason:""};
        setSalRevisions(function(p){return [rev].concat(p||[]);});
        _sb.from("salary_revisions").insert({id:String(rev.id),employer_email:em,employee_id:rev.employeeId,employee_name:rev.employeeName,effective_date:rev.effectiveDate,old_ctc:rev.oldCtc,new_ctc:rev.newCtc,reason:rev.reason}).then(function(){});
      }
    }
    setEmps(newEmps);
    lsSet("hr_emps_"+(em||""),newEmps);
    setEditE(null);setSelE(null);
    showT("Saved!");
    syncToSupabase(newEmps,att,incentives,shifts,reminders,notices,revisions,em);
  }
  function confirmOff(){
    if(!offData.reason)return showT("Enter reason","err");
    var isFuture=offData.resignDate&&offData.resignDate>todayStr; // last working date hasn't happened yet
    var newEmps=emps.map(function(e){
      if(e.id!==offE.id)return e;
      if(isFuture){
        // Stay active until the last working date actually passes — settleOffboards() flips
        // this automatically once today >= resignDate, so the employee keeps appearing
        // normally in Attendance/Payroll/Team until their real last day.
        return Object.assign({},e,{pendingOffboard:Object.assign({},offData)});
      }
      return Object.assign({},e,{status:offData.type,terminatedOn:todayStr,resignDate:offData.resignDate,terminationData:Object.assign({},offData),pendingOffboard:null});
    });
    var em=gUser&&gUser.email?gUser.email:lsGet("hr_last_email","");
    setEmps(newEmps);
    lsSet("hr_emps_"+(em||""),newEmps);
    setOffE(null);setOffStep(1);setOffData({reason:"",type:"resigned",handover:[],note:"",resignDate:""});setSelE(null);
    showT(isFuture?"Scheduled — will offboard automatically on "+offData.resignDate:"Offboarded. Employee app access will end in 10 days.");
    syncToSupabase(newEmps,att,incentives,shifts,reminders,notices,revisions,em);
    if(isFuture)return; // don't touch employee app access yet — they're still genuinely employed
    // Find employee app account by email and update to terminated_employee
    var offEmp=newEmps.find(function(e){return e.id===offE.id;});
    if(offEmp&&offEmp.email){
      _sb.from("user_plans")
        .update({role:"terminated_employee",terminated_at:todayStr})
        .eq("employer_email",em)
        .eq("email",offEmp.email)
      .then(function(r){
        if(!r.error)console.log("Employee app access set to terminate in 10 days");
      });
    }
  }
  // Runs once per load: settles anyone whose scheduled last working date has now passed,
  // flipping them from "still active, offboarding pending" to actually offboarded.
  function settleOffboards(){
    var changed=false;
    var newEmps=emps.map(function(e){
      if(e.pendingOffboard&&e.pendingOffboard.resignDate&&e.pendingOffboard.resignDate<=todayStr){
        changed=true;
        return Object.assign({},e,{status:e.pendingOffboard.type,terminatedOn:e.pendingOffboard.resignDate,resignDate:e.pendingOffboard.resignDate,terminationData:Object.assign({},e.pendingOffboard),pendingOffboard:null});
      }
      return e;
    });
    if(!changed)return;
    var em=gUser&&gUser.email?gUser.email:lsGet("hr_last_email","");
    setEmps(newEmps);
    lsSet("hr_emps_"+(em||""),newEmps);
    syncToSupabase(newEmps,att,incentives,shifts,reminders,notices,revisions,em);
    newEmps.filter(function(e,i){return e.status!==emps[i].status;}).forEach(function(offEmp){
      if(offEmp.email){
        _sb.from("user_plans").update({role:"terminated_employee",terminated_at:todayStr}).eq("employer_email",em).eq("email",offEmp.email).then(function(){});
      }
    });
  }
  // Brings a previously-offboarded employee back to active status — clears the termination record.
  function rejoinEmp(empId){
    var newEmps=emps.map(function(e){return e.id===empId?Object.assign({},e,{status:"active",terminatedOn:null,resignDate:null,terminationData:null,pendingOffboard:null}):e;});
    var em=gUser&&gUser.email?gUser.email:lsGet("hr_last_email","");
    setEmps(newEmps);
    lsSet("hr_emps_"+(em||""),newEmps);
    syncToSupabase(newEmps,att,incentives,shifts,reminders,notices,revisions,em);
    var rejoinedEmp=newEmps.find(function(e){return e.id===empId;});
    if(rejoinedEmp&&rejoinedEmp.email){
      _sb.from("user_plans").update({role:"employee",terminated_at:null}).eq("employer_email",em).eq("email",rejoinedEmp.email).then(function(){});
    }
    showT(rejoinedEmp.name+" rejoined — active again");
  }
  // Termination Letter — only meaningful for involuntary exits; reuses the reason/last-day already captured during offboarding
  function issueTermination(e){
    var lastDay=e.resignDate||e.terminatedOn||todayStr;
    var note=(e.terminationData&&e.terminationData.note)||"";
    if(e.terminationData&&e.terminationData.reason){
      makeTerminationLetterPDF(e,org,authPos,authSign,e.terminationData.reason,lastDay,note);
    }else{
      askForm("Termination Letter",[{key:"reason",label:"Reason for termination",type:"textarea",placeholder:"e.g. Repeated policy violations despite warnings",required:true}],function(vals){
        makeTerminationLetterPDF(e,org,authPos,authSign,vals.reason,lastDay,note);
      },{submitLabel:"Download Letter"});
    }
  }
  // Full & Final Settlement — pulls last drawn basic, leave encashment and gratuity automatically; HR fills in pending salary + dues
  function issueFnFSettlement(e){
    var lwd=e.resignDate||e.terminatedOn||todayStr;
    var lwdDate=new Date(lwd+"T00:00:00");
    if(isNaN(lwdDate.getTime()))lwdDate=new Date();
    var eEff=getEffectiveEmp(e,lwdDate.getFullYear(),lwdDate.getMonth());
    var g=calcGratuity(eEff,lwd);
    var leaveBal=getLeaveBalance(e,att,lwdDate.getFullYear());
    var leaveEncash=getLeaveEncashment(e,att,lwdDate.getFullYear());
    var loanBalance=(loans||[]).filter(function(l){return (String(l.employeeId)===String(e.id)||String(l.employee_id)===String(e.id))&&l.status==="active";}).reduce(function(s,l){
      var tenure=Number(l.tenure||0),paid=Number(l.paidInstallments||0),emiV=Number(l.emi||0);
      var bal=tenure>0?Math.max(0,Math.round((tenure-paid)*emiV)):Math.max(0,(l.amount||0)-(l.paidAmount||l.paid_amount||0));
      return s+bal;
    },0);
    askForm("Full & Final Settlement",[
      {key:"pendingSalary",label:"Pending salary (last working month)",type:"number",def:"0",placeholder:"0"},
      {key:"dues",label:"Other dues / loan deductions",type:"number",def:String(loanBalance||0),placeholder:"0"}
    ],function(vals){
      var data={lwd:lwd,pendingSalary:Number(vals.pendingSalary||0),leaveBal:leaveBal,leaveEncash:leaveEncash,gratuity:g,dues:Number(vals.dues||0)};
      makeFnFSettlementPDF(e,org,authPos,authSign,data);
    },{submitLabel:"Download Statement"});
  }
  function handleEmailChange(){
    var newEm=newEmailVal.trim().toLowerCase();
    if(!newEm)return setEmailChangeErr("Enter new email address");
    if(newEm===(gUser&&gUser.email))return setEmailChangeErr("This is already your current email");
    setEmailChangeLoading(true);setEmailChangeErr("");
    _sb.auth.updateUser({email:newEm}).then(function(res){
      setEmailChangeLoading(false);
      if(res.error){setEmailChangeErr(res.error.message);return;}
      setEmailChangeStep(2);
      showT("Confirmation sent to "+newEm);
    }).catch(function(e){setEmailChangeErr(e.message||"Failed");setEmailChangeLoading(false);});
  }
  function cancelEmailChange(){
    setShowEmailChange(false);setNewEmailVal("");setEmailChangeStep(1);setEmailChangeErr("");
  }
  function loadAdminUsers(){
    _sb.from("admin_user_overview").select("*")
    .then(function(res){
      if(res.error){showT("Load error: "+res.error.message,"err");return;}
      Promise.all([
        _sb.from("user_orgs").select("email,org_name,org_type,position,full_name,emp_count_range,phone,website"),
        _sb.from("user_plans").select("email,is_blocked,emp_limit,expires_on,plan,role,employer_email")
      ]).then(function(results){
        var orgsMap={},plansMap={},empsByEmployer={};
        (results[0].data||[]).forEach(function(o){orgsMap[o.email]=o;});
        (results[1].data||[]).forEach(function(p){
          plansMap[p.email]=p;
          // Group employees by employer
          if(p.role==="employee"&&p.employer_email){
            if(!empsByEmployer[p.employer_email])empsByEmployer[p.employer_email]=[];
            empsByEmployer[p.employer_email].push(p);
          }
        });
        // Only show employer accounts (role=owner or null/undefined, not employee)
        var enriched=(res.data||[])
          .filter(function(u){
            var p=plansMap[u.email]||{};
            return p.role!=="employee"; // show only owners/employers
          })
          .map(function(u){
            var o=orgsMap[u.email]||{};
            var p=plansMap[u.email]||{};
            return Object.assign({},u,{
              org_name:o.org_name||"",org_type:o.org_type||"",
              position:o.position||"",full_name:o.full_name||"",
              emp_count_range:o.emp_count_range||"",
              phone:o.phone||"",website:o.website||"",
              is_blocked:p.is_blocked||false,
              emp_limit:p.emp_limit||u.emp_limit,
              expires_on:p.expires_on||u.expires_on,
              app_employees:empsByEmployer[u.email]||[] // employees who joined app
            });
          });
        setAdminUsers(enriched);
      });
    });
  }
  function setUserPlan(email,plan,extraData){
    var payload=Object.assign({email:email,plan:plan,activated_on:plan==="paid"?new Date().toISOString().split("T")[0]:null},extraData||{});
    _sb.from("user_plans").upsert(payload,{onConflict:"email"})
    .then(function(res){
      if(res.error){showT("Error: "+res.error.message,"err");return;}
      loadAdminUsers();
      showT(email.split("@")[0]+" set to "+plan);
      // If updating own account, update local org state immediately
      if(gUser&&email===gUser.email){
        setOrg(function(o){
          var updated=Object.assign({},o,Object.assign({plan:plan},extraData||{}));
          lsSet("hr_org_"+gUser.email,updated);
          return updated;
        });
      }
    });
  }
  function blockUser(email,block){
    setAdminBlocking(email);
    _sb.from("user_plans").update({is_blocked:block}).eq("email",email)
    .then(function(res){
      setAdminBlocking(null);
      if(res.error){showT("Error: "+res.error.message,"err");return;}
      loadAdminUsers();
      showT(email.split("@")[0]+" "+(block?"blocked":"unblocked"));
    });
  }
  // ── DATA SYNC ──────────────────────────────────────────────────────────────
  function syncToSupabase(empData,attData,incData,shiftsData,remData,notData,revData,emailOverride){
    var email=(emailOverride)||(gUser&&gUser.email)||lsGet("hr_last_email","");
    if(!email)return;
    setIsSyncing(true);
    var payload={
      email:email,
      emps_json:JSON.stringify(empData||[]),
      att_json:JSON.stringify(attData||{}),
      inc_json:JSON.stringify(incData||{}),
      shifts_json:JSON.stringify(shiftsData||{}),
      reminders_json:JSON.stringify(remData||[]),
      notices_json:JSON.stringify(notData||[]),
      revisions_json:JSON.stringify(revData||{})
    };
    _sb.from("user_data").upsert(payload,{onConflict:"email"})
    .then(function(res){
      setIsSyncing(false);
      if(!res.error){setLastSync(new Date());lsSet("hr_last_sync",new Date().toISOString());}
    }).catch(function(){setIsSyncing(false);});
  }

  // Persist tasks to Supabase (tasks_json column on user_data) — owner only
  function syncTasks(tasksData){
    var email=(gUser&&gUser.email)||lsGet("hr_last_email","");
    if(!email)return;
    // Only the owner/employer persists the task list
    if(userRole&&userRole!=="owner"&&userRole!=="admin")return;
    _sb.from("user_data").upsert({email:email,tasks_json:JSON.stringify(tasksData||[])},{onConflict:"email"}).then(function(){}).catch(function(){});
  }

  function loadFromSupabase(email,cb){
    _sb.from("user_data").select("*").eq("email",email).maybeSingle()
    .then(function(res){
      if(res.data){
        try{
          var d={
            emps:JSON.parse(res.data.emps_json||"[]"),
            att:JSON.parse(res.data.att_json||"{}"),
            inc:JSON.parse(res.data.inc_json||"{}"),
            shifts:JSON.parse(res.data.shifts_json||"{}"),
            reminders:JSON.parse(res.data.reminders_json||"[]"),
            notices:JSON.parse(res.data.notices_json||"[]"),
            revisions:JSON.parse(res.data.revisions_json||"{}"),
            updated_at:res.data.updated_at
          };
          if(cb)cb(d);
        }catch(e){if(cb)cb(null);}
      } else {if(cb)cb(null);}
    }).catch(function(){if(cb)cb(null);});
  }

  function downloadBackup(){
    var backup={
      version:2,exported:new Date().toISOString(),email:gUser?gUser.email:"",
      org:org,emps:emps,att:att,incentives:incentives,
      shifts:shifts,reminders:reminders,notices:notices,revisions:revisions,
      loans:loans,expenses:expenses,warnings:warnings,
      holidays2:holidays2,coExp:coExp,salRevisions:salRevisions,bonuses:bonuses
    };
    var blob=new Blob([JSON.stringify(backup,null,2)],{type:"application/json"});
    downloadBlob(blob,"AdminHR-Backup-"+(new Date().toISOString().split("T")[0])+".json");
    showT("Backup downloaded!");
  }

  function uploadBackup(file){
    var reader=new FileReader();
    reader.onload=function(e){
      try{
        var data=JSON.parse(e.target.result);
        if(!data.emps)return showT("Invalid backup file","err");
        if(window.confirm("This will REPLACE all current data with the backup. Continue?")){
          if(data.emps)setEmps(data.emps);
          if(data.att)setAtt(data.att);
          if(data.incentives)setIncentives(data.incentives);
          if(data.shifts)setShifts(data.shifts);
          if(data.reminders)setReminders(data.reminders);
          if(data.notices)setNotices(data.notices);
          if(data.revisions)setRevisions(data.revisions);
          if(data.loans)setLoans(data.loans);
          if(data.expenses)setExpenses(data.expenses);
          if(data.warnings)setWarnings(data.warnings);
          if(data.holidays2)setHolidays2(data.holidays2);
          if(data.coExp)setCoExp(data.coExp);
          if(data.salRevisions)setSalRevisions(data.salRevisions);
          if(data.bonuses)setBonuses(data.bonuses);
          showT("Backup restored successfully!");
          syncToSupabase(data.emps,data.att,data.incentives,data.shifts,data.reminders,data.notices,data.revisions);
        }
      }catch(ex){showT("Could not read backup file","err");}
    };
    reader.readAsText(file);
  }

  function handleResetPassword(){
    if(!resetEmail.trim())return showT("Enter your email","err");
    _sb.auth.resetPasswordForEmail(resetEmail.trim().toLowerCase(),{
      redirectTo:"https://admin-hr-28l1.vercel.app"
    }).then(function(res){
      if(res.error){showT(res.error.message,"err");return;}
      setResetSent("Password reset link sent to "+resetEmail+". Check your email!");
    });
  }

  function handleSetNewPassword(){
    if(!newPwd)return setNewPwdErr("Enter new password");
    if(newPwd.length<6)return setNewPwdErr("Minimum 6 characters");
    if(newPwd!==newPwd2)return setNewPwdErr("Passwords do not match");
    setNewPwdErr("");
    _sb.auth.updateUser({password:newPwd}).then(function(res){
      if(res.error){setNewPwdErr(res.error.message);return;}
      setIsPasswordReset(false);showT("Password updated! Please sign in.");
      _sb.auth.signOut();setGUser(null);lsSet("hr_guser",null);setScreen("login");
    });
  }

  function removeEmp(id){setEmps(function(p){return p.filter(function(e){return e.id!==id;});});showT("Deleted.");}

  function sharePayslip(emp,d,m2,y){
    // Just redirects to the employee's WhatsApp chat with the payslip summary text.
    // No PDF download — use the "Download Payslip" action separately if a PDF is needed.
    var mName=MOS[m2]+" "+y;
    var totalDed=(d.ad||0)+(d.hd||0)+(d.ud||0)+(d.pfE||0)+(d.esiE||0)+(d.pt||0)+(d.tds||0)+(d.hi||0)+(d.cd||0);
    var text="*Payslip Summary*\n"+
      "```\n"+
      "Employee : "+emp.name+"\n"+
      "Month    : "+mName+"\n"+
      "------------------\n"+
      "Gross Pay  : "+fmtIN(d.gr||0)+"\n"+
      "Deductions : "+fmtIN(totalDed)+"\n"+
      "Net Pay    : "+fmtIN(d.net||0)+"\n"+
      "------------------\n"+
      "```\n"+
      "Thank you for your work and dedication.\n"+
      "Any clarification feel free to ask.\n\n"+
      "Regards,\n"+(org.name||"HR Team");
    if(!emp.mob){showT("No mobile number saved for "+emp.name,"err");return;}
    window.open("https://wa.me/"+waNum(emp)+"?text="+encodeURIComponent(text),"_blank");
  }



  function getOTEntries(empId,m2,y){
    return (overtime||[]).filter(function(o){return o.employeeId===String(empId)&&o.month===m2&&o.year===y;}).sort(function(a,b){return (a.day||0)-(b.day||0);});
  }
  function otEntryAmount(o){
    if(!o)return 0;
    return o.mode==="hours"?Math.round((o.hours||0)*(o.rate||0)):(o.amount||0);
  }
  function getOTAmount(empId,m2,y){
    return getOTEntries(empId,m2,y).reduce(function(s,o){return s+otEntryAmount(o);},0);
  }
  function getOTHoursTotal(empId,m2,y){
    return getOTEntries(empId,m2,y).reduce(function(s,o){return s+(o.mode==="hours"?Number(o.hours||0):0);},0);
  }
  function getExtraPay(empId,m2,y){
    var b=(bonuses||[]).filter(function(x){return x.employeeId===String(empId)&&x.payMonth===m2&&x.payYear===y;}).reduce(function(s,x){return s+(x.amount||0);},0);
    var c=(claims||[]).filter(function(x){return x.employeeId===String(empId)&&x.status==="approved"&&x.month===m2&&x.year===y;}).reduce(function(s,x){return s+(x.amount||0);},0);
    var ot=getOTAmount(empId,m2,y);
    return b+c+ot;
  }

  function getEmpBonuses(empId,m2,y){
    return (bonuses||[]).filter(function(b){return b.employeeId===String(empId)&&b.payMonth===m2&&b.payYear===y;});
  }
  function getEmpBonusesWithOT(empId,m2,y){
    var list=(bonuses||[]).filter(function(b){return b.employeeId===String(empId)&&b.payMonth===m2&&b.payYear===y;}).slice();
    var ot=getOTAmount(empId,m2,y);
    if(ot>0)list.push({note:"Overtime",type:"overtime",amount:ot});
    return list;
  }
  function getEmpClaimTotal(empId,m2,y){
    return (claims||[]).filter(function(c){return c.employeeId===String(empId)&&c.status==="approved"&&c.month===m2&&c.year===y;}).reduce(function(s,c){return s+(c.amount||0);},0);
  }
  function getEmpLoanDed(empId){
    return (loans||[]).filter(function(l){return (l.employeeId===String(empId)||l.employee_id===String(empId))&&l.status==="active";}).reduce(function(s,l){return s+(l.emi||l.monthlyDeduction||0);},0);
  }

  function waNum(emp){
    var cc=(emp.ccode||"91").replace(/\D/g,"");
    var mob=String(emp.mob||"").replace(/\D/g,"");
    return cc+mob;
  }

  function shareAtt(emp){
    if(!isPaid){showT("WhatsApp share is a paid feature","info");window.open("https://wa.me/918072293384?text="+encodeURIComponent("Hi, I would like to subscribe to Admin HR paid features"),"_blank");return;}
    if(!emp.mob){showT("No mobile number saved","err");return;}
    var ma=mAtt(emp.id,attY,attM);
    var mName2=MOS[attM]+" "+attY;
    var text="*Attendance Summary*\n"+
      "```\n"+
      "Employee : "+emp.name+"\n"+
      "Month    : "+mName2+"\n"+
      "------------------\n"+
      "Present    : "+ma.present+" days\n"+
      "Absent     : "+ma.absent+" days\n"+
      "Half Day   : "+ma.half+" days\n"+
      "Paid Leave : "+ma.paid+" days\n"+
      "Unpaid     : "+ma.unpaid+" days\n"+
      "Holiday    : "+ma.holiday+" days\n"+
      "------------------\n"+
      "```\n"+
      "Any clarification feel free to ask.\n\n"+
      "Regards,\n"+(org.name||"HR Team");
    window.open("https://wa.me/"+waNum(emp)+"?text="+encodeURIComponent(text),"_blank");
  }

  var timeStr=now.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",second:"2-digit"});
  function getShiftAllow(empId,y,m){
    var es=shifts[empId];if(!es)return 0;
    var key=y+"-"+(m+1<10?"0":"")+(m+1);
    var entry=(es.log||[]).find(function(l){return l.month===key;});
    return Number((entry?entry.allowance:es.allowance)||0);
  }

  // Resolve an employee's salary fields as of a given year/month, using salary revision history.
  // Picks the latest revision whose effective date is on/before the target month; falls back to the
  // employee's own record if no revision applies yet. Returns a patched copy of the employee object
  // so calcPay() and everything downstream automatically uses the right-for-that-month salary.
  function getEffectiveEmp(emp,y,m){
    if(!emp)return emp;
    var revs=(salRevisions||[]).filter(function(r){return String(r.employeeId)===String(emp.id);});
    if(!revs.length)return emp;
    var targetKey=y+"-"+(m+1<10?"0":"")+(m+1);
    // Keep only revisions effective on/before the target month, pick the most recent one
    var applicable=revs.filter(function(r){
      if(!r.effectiveDate)return false;
      var d=String(r.effectiveDate);
      var revKey=d.slice(0,7); // "YYYY-MM"
      return revKey<=targetKey;
    }).sort(function(a,b){return String(b.effectiveDate).localeCompare(String(a.effectiveDate));});
    if(!applicable.length)return emp;
    var newCtc=Number(applicable[0].newCtc)||0;
    if(!newCtc)return emp;
    var bd=brkSal(newCtc);
    return Object.assign({},emp,{monthlyCTC:newCtc,basic:bd.basic,hra:bd.hra,allow:bd.allow});
  }
  // ── SINGLE SOURCE OF TRUTH for an employee's full pay breakdown in a given month ──
  // Every screen (Dashboard, Payroll's 4 tabs, PDFs, exports) should call this instead of
  // re-deriving mAtt/getInc/getWorkingDays/proRata/calcPay by hand — that hand-copying is
  // exactly how Dashboard vs Payroll vs Dept tab ended up disagreeing on the same employee's pay.
  function getMonthPay(emp,y,m){
    var pr=proRata(emp,y,m);
    var eEff=getEffectiveEmp(emp,y,m);
    var ma=mAtt(emp.id,y,m);
    var inc=getInc(emp.id,y,m);
    var wD=getWorkingDays(att,emp.id,y,m);
    var shiftAllow=getShiftAllow(emp.id,y,m);
    var notActive=pr.notYetJoined||pr.alreadyLeft;
    var d=notActive?calcPay(eEff,0,0,0,0,0,wD,0,1):calcPay(eEff,ma.absent,ma.half,ma.unpaid,inc,shiftAllow,wD,pr.active,pr.total);
    var bonusTotal=(bonuses||[]).filter(function(b){return b.employeeId===String(emp.id)&&b.payMonth===m&&b.payYear===y;}).reduce(function(s,b){return s+(b.amount||0);},0);
    var claimTotal=(claims||[]).filter(function(c){return c.employeeId===String(emp.id)&&c.status==="approved"&&c.month===m&&c.year===y;}).reduce(function(s,c){return s+(c.amount||0);},0);
    var otTotal=getOTAmount(emp.id,m,y);
    var loanDed=(loans||[]).filter(function(l){return (l.employeeId===String(emp.id)||l.employee_id===String(emp.id))&&l.status==="active";}).reduce(function(s,l){return s+(l.emi||l.monthlyDeduction||0);},0);
    // Bonus and Overtime ARE taxable salary income under Sec.17(1) of the Income Tax Act, even
    // though they're correctly excluded from PF/ESI wages. Tax them at the employee's marginal
    // slab rate, withheld entirely in the month they're actually paid (not spread over the year,
    // since the payment itself isn't recurring). Reimbursement claims are excluded — they're an
    // expense repayment, not salary income, so they're not taxable.
    var taxableExtra=bonusTotal+otTotal;
    var incrTds=0,baseTds=d.tds;
    if(!notActive&&eEff.tds!==false&&taxableExtra>0){
      var baseAnnual=d.gr*12;
      incrTds=Math.round(calcTaxAnnual(baseAnnual+taxableExtra,eEff.taxRegime)-calcTaxAnnual(baseAnnual,eEff.taxRegime));
      if(incrTds>0){
        d=Object.assign({},d,{tds:d.tds+incrTds,net:Math.max(0,d.net-incrTds)});
      } else incrTds=0;
    }
    var extraPay=bonusTotal+claimTotal+otTotal;
    var attDed=d.ad+d.hd+d.ud;
    var statDed=d.pfE+d.esiE+d.pt+d.tds+d.hi+d.cd;
    var totalDed=attDed+statDed;
    var netFinal=Math.max(0,d.net+extraPay-loanDed); // the ONE true take-home figure — use this everywhere "net pay" is shown
    return {emp:emp,eEff:eEff,ma:ma,inc:inc,wD:wD,shiftAllow:shiftAllow,pr:pr,d:d,isActive:!notActive,
      bonusTotal:bonusTotal,claimTotal:claimTotal,otTotal:otTotal,loanDed:loanDed,extraPay:extraPay,
      attDed:attDed,statDed:statDed,totalDed:totalDed,netFinal:netFinal,incrTds:incrTds,baseTds:baseTds};
  }
  // Renders the "how was this TDS worked out" breakdown — tap the TDS line, this shows the
  // actual annual estimate, regime, slab tax, rebate and cess that produced the monthly figure,
  // plus the bonus/OT incremental tax for that month if any. Shared by every screen that shows TDS.
  function tdsCalcRows(mp){
    var regime=mp.eEff.taxRegime==="old"?"old":"new";
    var grossThisMonth=mp.d.gr+mp.bonusTotal+mp.otTotal; // what the employee actually earns this month, including variable pay
    var annualBaseSalary=mp.d.gr*12; // recurring salary only — the figure the annual tax estimate is built on
    var stdDed=regime==="old"?50000:75000;
    var taxableIncome=Math.max(0,annualBaseSalary-stdDed);
    var annualTaxBase=calcTaxAnnual(annualBaseSalary,regime);
    var rows=[
      ["Gross Earnings This Month","income",fmt(grossThisMonth)],
      ["Tax Regime","info",regime==="old"?"Old Regime":"New Regime (Default)"],
      ["Taxable Salary (Annualised Base)","tax",fmt(annualBaseSalary)],
      ["Standard Deduction","tax",fmt(stdDed)],
      ["Net Taxable Income","tax",fmt(taxableIncome)],
      ["Annual Tax (incl. 4% cess)","tax",fmt(Math.round(annualTaxBase))],
      ["Monthly TDS (Base Salary)","tax",fmt(mp.baseTds)]
    ];
    if(mp.incrTds>0){
      rows.push(["Bonus + Overtime Paid This Month","extra",fmt(mp.bonusTotal+mp.otTotal)]);
      rows.push(["Additional Tax on That Amount","extra",fmt(mp.incrTds)]);
    }
    rows.push(["Total TDS This Month","total",fmt(mp.d.tds)]);
    return rows;
  }
  function renderTdsBreakdown(mp){
    var rows=tdsCalcRows(mp);
    return h("div",{style:{background:"rgba(0,0,0,.03)",borderRadius:9,padding:"9px 11px",marginTop:4,marginBottom:4,border:"1px solid "+BDR}},
      h("div",{style:{fontSize:9,fontWeight:700,color:GRY,letterSpacing:.6,marginBottom:5}},"HOW THIS TDS WAS CALCULATED"),
      h("div",{style:{fontSize:9.5,color:GRY,lineHeight:1.4,marginBottom:7,fontStyle:"italic"}},
        "Rule: TDS is estimated on this employee's annualised recurring salary. Any bonus or overtime paid this month is taxed separately, at the same marginal rate, and withheld in full in this month only - it is not added into the annualised salary above."
      ),
      rows.map(function(r,i){
        var isTotal=r[1]==="total",isExtra=r[1]==="extra";
        return h("div",{key:r[0],style:{display:"flex",justifyContent:"space-between",padding:"3px 0",borderTop:i===0?"none":"1px solid "+BDR+"44"}},
          h("span",{style:{fontSize:10,color:isTotal?NVY:isExtra?AMB:GRY,fontWeight:isTotal?700:isExtra?600:500}},r[0]),
          h("span",{style:{fontSize:10,fontWeight:isTotal?800:600,color:isTotal?RED:isExtra?AMB:NVY}},r[2])
        );
      }),
      h("div",{style:{fontSize:9,color:GRY,marginTop:7,lineHeight:1.4,borderTop:"1px dashed "+BDR,paddingTop:6}},
        "PF and ESI are calculated separately and shown above in this same Deductions section - they are not part of this TDS estimate."
      ),
      mp.eEff.taxRegime==="old"?h("div",{style:{fontSize:9,color:GRY,marginTop:5,lineHeight:1.4}},"Old regime estimate uses the standard deduction and slabs only - it does not account for HRA exemption, 80C or other deductions."):null
    );
  }
  function renderAttDedBreakdown(mp){
    var ma=mp.ma,d=mp.d;
    var rows=[];
    if(ma.absent>0)rows.push(["Absent days",ma.absent+" day"+(ma.absent>1?"s":"")+" \u00d7 "+fmt(d.pd)+"/day",fmt(d.ad)]);
    if(ma.half>0)rows.push(["Half days",ma.half+" day"+(ma.half>1?"s":"")+" \u00d7 "+fmt(Math.round(d.pd/2))+"/day",fmt(d.hd)]);
    if(ma.unpaid>0)rows.push(["Unpaid leave",ma.unpaid+" day"+(ma.unpaid>1?"s":"")+" \u00d7 "+fmt(d.pd)+"/day",fmt(d.ud)]);
    return h("div",{style:{background:"rgba(0,0,0,.03)",borderRadius:9,padding:"9px 11px",marginTop:4,marginBottom:4,border:"1px solid "+BDR}},
      h("div",{style:{fontSize:9,fontWeight:700,color:GRY,letterSpacing:.6,marginBottom:5}},"HOW THIS DEDUCTION WAS CALCULATED"),
      h("div",{style:{fontSize:9.5,color:GRY,lineHeight:1.4,marginBottom:7,fontStyle:"italic"}},
        "Per-day rate = Basic (and HRA/Allowance for split salary) \u00f7 "+(d.wDays||26)+" working days this month."
      ),
      rows.map(function(r,i){
        return h("div",{key:r[0],style:{display:"flex",justifyContent:"space-between",padding:"3px 0",borderTop:i===0?"none":"1px solid "+BDR+"44"}},
          h("span",{style:{fontSize:10,color:GRY}},r[0]+" - "+r[1]),
          h("span",{style:{fontSize:10,fontWeight:700,color:AMB}},"-"+r[2])
        );
      }),
      h("div",{style:{display:"flex",justifyContent:"space-between",padding:"4px 0",borderTop:"1px solid "+BDR}},
        h("span",{style:{fontSize:10,fontWeight:700,color:NVY}},"Total Attendance Deduction"),
        h("span",{style:{fontSize:10,fontWeight:800,color:AMB}},"-"+fmt(mp.attDed))
      )
    );
  }
  var darkGrad="linear-gradient(155deg,#0F172A 0%,#1E1B4B 55%,#312E81 100%)";

  // ── RENDER - pure createElement, zero JSX ──────────────────────
  // Brand logo - actual image embedded as base64
  var LOGO_SRC="data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAYbBhsDASIAAhEBAxEB/8QAHQABAQADAQEBAQEAAAAAAAAAAAgGBwkFBAMBAv/EAFQQAQABAwICBAcMBgYJAgUFAAABAgMEBQYIEQcSITcTMUFRYXXBFBUYMlZxdIGVsbPTIkJSYpGhFiNygpKTJTM0Q1VjorLRCXMkU6PC8ERkg8Ph/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AJqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/2Q==";
  var logoSVG=function(size){var s=size||64;return h("img",{src:LOGO_SRC,alt:"Logo",width:s,height:s,draggable:false,onContextMenu:function(e){e.preventDefault();},style:{display:"block",borderRadius:Math.round(s*0.22),userSelect:"none",WebkitUserSelect:"none",WebkitTouchCallout:"none",pointerEvents:"none"}});};

  // Simple password hash (djb2) — good enough for localStorage auth
  function hashPwd(str){var h=5381;for(var i=0;i<str.length;i++)h=((h<<5)+h)^str.charCodeAt(i);return String(h>>>0);}


  // ── OTP: Send OTP for SIGNUP ─────────────────────────────────────────────
  // ── OTP: Send OTP for SIGNUP ─────────────────────────────────────────────
  function handleSignupSendOTP(){
    var email=authEmail.trim().toLowerCase();
    if(!suName.trim())return setAuthErr("Enter your full name");
    if(!suOrg.trim())return setAuthErr("Enter organization name");
    if(!suType||suType===CHIP_CUSTOM_SENTINEL)return setAuthErr("Select organization type");
    if(!suPos.trim()||suPos===CHIP_CUSTOM_SENTINEL)return setAuthErr("Enter your role/position");
    if(!suEmpRange)return setAuthErr("Select employee count range");
    if(!email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return setAuthErr("Enter a valid email");
    if(!suAgreed)return setAuthErr("Please confirm the email warning");
    setAuthLoading(true);setAuthErr("");
    _sb.from("user_plans").select("email").eq("email",email).maybeSingle()
    .then(function(res){
      if(res.data){setAuthErr("Account already exists. Please Sign In.");setAuthLoading(false);return;}
      return _sb.auth.signInWithOtp({email:email,options:{shouldCreateUser:true}})
      .then(function(r){
        setAuthLoading(false);
        if(r.error){setAuthErr(r.error.message);return;}
        setOtpSent(true);setAuthMode("signup-otp");
        lsSet("hr_last_email",email);
      });
    }).catch(function(e){setAuthErr(e.message||"Error");setAuthLoading(false);});
  }

  // ── OTP: Send OTP for SIGNIN ─────────────────────────────────────────────
  function handleSendOTP(){
    var email=authEmail.trim().toLowerCase();
    if(!email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return setAuthErr("Enter a valid email");
    setAuthLoading(true);setAuthErr("");
    // Just send OTP — don't block on user_plans check (old accounts may not have a row)
    _sb.auth.signInWithOtp({email:email,options:{shouldCreateUser:false,emailRedirectTo:null}})
    .then(function(r){
      setAuthLoading(false);
      if(r.error){
        // If user doesn't exist in auth at all, show clear message
        if(r.error.message&&r.error.message.toLowerCase().includes("not found")){
          setAuthErr("No account found. Please Sign Up first.");
        } else {
          setAuthErr(r.error.message);
        }
        return;
      }
      setOtpSent(true);setAuthMode("otp");
      lsSet("hr_last_email",email);
    }).catch(function(e){setAuthErr(e.message||"Error");setAuthLoading(false);});
  }

  // ── OTP: Verify OTP ──────────────────────────────────────────────────────
  function handleVerifyOTP(){
    var email=authEmail.trim().toLowerCase();
    var token=authOtp.trim();
    if(!token||token.length<6)return setAuthErr("Enter the OTP from your email");
    setAuthLoading(true);setAuthErr("");
    var isSignup=authMode==="signup-otp";
    _sb.auth.verifyOtp({email:email,token:token,type:"email"})
    .then(function(res){
      if(res.error){setAuthErr("Invalid or expired OTP. Try again.");setAuthLoading(false);return;}
      if(!res.data.user){setAuthErr("Verification failed. Try again.");setAuthLoading(false);return;}
      var user=res.data.user;
      // Clear stale data
      ["hr_emps","hr_att","hr_inc","hr_revisions","hr_reminders","hr_shifts","hr_notices","hr_org","hr_last_sync"].forEach(function(k){try{localStorage.removeItem(k);}catch(e){}});
      setEmps([]);setAtt({});setIncentives({});setRevisions({});setReminders([]);setShifts({});setNotices([]);
      setOrg({name:"",type:"",email:"",position:"",plan:"free",address:"",logo:""});
      if(isSignup){
        // Save org details first, THEN load — avoids race with onAuthStateChange
        _sb.from("user_orgs").upsert({
          email:user.email,org_name:suOrg.trim(),org_type:suType,
          position:suPos.trim(),full_name:suName.trim(),emp_count_range:suEmpRange
        },{onConflict:"email"}).then(function(){
          setAuthLoading(false);
          // Don't rely on onAuthStateChange here — call loadUserData directly
          setGUser({name:user.email.split("@")[0],email:user.email,photo:""});
          lsSet("hr_guser",{name:user.email.split("@")[0],email:user.email,photo:""});
          setOrg({name:suOrg.trim(),type:suType,position:suPos.trim(),email:user.email,plan:"free",address:"",logo:""});
          lsSet("hr_org_"+user.email,{name:suOrg.trim(),type:suType,position:suPos.trim(),email:user.email,plan:"free",address:"",logo:""});
          setScreen("app");
          showT("Welcome to Admin HR!");
        }).catch(function(){
          setAuthLoading(false);setAuthErr("Failed to save details. Try again.");
        });
      } else {
        setAuthLoading(false);
        // onAuthStateChange SIGNED_IN handles signin
      }
    }).catch(function(e){setAuthErr(e.message||"Verification failed");setAuthLoading(false);});
  }


  // ── AUTH SCREENS ────────────────────────────────────────────────────────
  var ELEVEN_LOGO="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCATiBOIDASIAAhEBAxEB/8QAHQABAAICAwEBAAAAAAAAAAAAAAIDAQgGBwkFBP/EAFcQAQABAwIDAwUMBwYDBQMNAQABAgMEBREGBxIIITFBUWFxgRMWGCIyVVeRlKLR0hQVI0JSYqFDcoKSscEJM7IkU2OTwhc0wyY3RFRzdoOjpLO04fDx/8QAGwEBAQEAAwEBAAAAAAAAAAAAAAECBAUHAwb/xAA0EQEAAQIEAwYFAwQDAQAAAAAAAQIRAwQFEgYhMRQiQVFxgRNhkcHRFTKxM4Kh4SNCcrL/2gAMAwEAAhEDEQA/ANMgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//9k=";
  var makeInIndiaBadge=h("div",{style:{textAlign:"center",padding:"0 0 20px",marginTop:"auto"}},
    h("div",{style:{fontSize:9,color:T.AUTH_LABEL,letterSpacing:.8}},
      "Proudly built in India \u2022 Made for Indian Businesses"
    )
  );
  var authWrap=function(inner,scroll){return h("div",{style:{minHeight:"100vh",background:T.AUTH_BG,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:scroll?"flex-start":"center",padding:scroll?"24px 24px 0":"32px 24px 0",overflowY:scroll?"auto":"hidden"}},
    h("div",{style:{width:"100%",maxWidth:380,flex:1,display:"flex",flexDirection:"column",justifyContent:scroll?"flex-start":"center",paddingTop:scroll?8:0}},inner),
    h("div",{style:{width:"100%",maxWidth:380}},makeInIndiaBadge)
  );};

  var inp=function(type,val,onChange,placeholder,err){
    return h("input",{type:type||"text",value:val,onChange:onChange,placeholder:placeholder,
      style:{width:"100%",background:T.AUTH_INPUT_BG,border:"1.5px solid "+(err?RED:T.AUTH_INPUT_BDR),
        borderRadius:10,padding:"11px 13px",fontSize:13,color:T.AUTH_TEXT,outline:"none",
        fontFamily:"inherit",marginBottom:err?4:10,boxSizing:"border-box"}});
  };
  var sel=function(val,onChange,opts,placeholder,err,allowCustom,question){
    return h("div",{style:{marginBottom:err?4:0}},
      !val?h("div",{style:{fontSize:11,color:err?RED:T.AUTH_LABEL,marginBottom:6}},placeholder):null,
      chipSelect(val,function(v){onChange({target:{value:v}});},opts,{allowCustom:allowCustom,customPlaceholder:"Type your own...",question:question||placeholder})
    );
  };
  var authLbl=function(txt){return h("div",{style:{fontSize:10,fontWeight:700,color:T.AUTH_LABEL,letterSpacing:1,marginBottom:4}},txt);};
  var authBtn=function(txt,onClick,secondary){return h("button",{onClick:onClick,disabled:authLoading,
    style:{width:"100%",background:secondary?T.AUTH_INPUT_BG:T.AUTH_BTN_BG,
      border:secondary?"1.5px solid "+T.AUTH_INPUT_BDR:"none",
      borderRadius:12,padding:"13px",color:secondary?T.AUTH_TEXT:T.AUTH_BTN_TEXT,
      fontSize:14,fontWeight:700,cursor:authLoading?"not-allowed":"pointer",
      opacity:authLoading?.8:1,marginBottom:secondary?0:8}},txt);};
  var authErr2=function(){return authErr?h("div",{style:{background:RED+"15",border:"1px solid "+RED+"44",borderRadius:8,padding:"8px 12px",marginBottom:10,fontSize:12,color:RED,fontWeight:500}},authErr):null;};

  // ── Landing screen ──
  var landingScreen=(function(){
    /* ── inject CSS once ── */
    if(!document.getElementById("ahr-css")){
      var _s=document.createElement("style");_s.id="ahr-css";
      _s.textContent=
        "@keyframes mltr{from{transform:translateX(0)}to{transform:translateX(-50%)}}" +
        ".mltr{display:flex;width:max-content;animation:mltr 26s linear infinite}" +
        ".mwrap{overflow:hidden;-webkit-mask:linear-gradient(90deg,transparent,black 40px,black calc(100% - 40px),transparent);mask:linear-gradient(90deg,transparent,black 40px,black calc(100% - 40px),transparent)}" +
        "@keyframes glow-pulse{0%,100%{opacity:.4}50%{opacity:.75}}";
      document.head.appendChild(_s);
    }
    var isDark=themeMode==="dark";
    /* App theme colors — entire screen uses these */
    var BG =isDark?"#242323":"#F1F5F9";
    var CRD=isDark?"#2e2d2d":"#FFFFFF";
    var NV =isDark?"#FFFFFF":"#0F172A";
    var GR =isDark?"#9a9a9a":"#64748B";
    var BD =isDark?"#3a3939":"#E2E8F0";
    var SF =isDark?"#2a2929":"#F8FAFF";
    var ACC=isDark?"#FFFFFF":"#0F172A"; /* accent = app primary */

    /* Pricing state */
    var pSlide=sLandSlide[0]%3,setSlide=sLandSlide[1];
    var touchX=st(null);
    var plans=[
      {n:"Free",  monthly:"₹0",      yearly:"₹0",       sub:"Up to 5 employees",  tag:"",
       features:["Attendance marking","Basic payroll","View payslips on screen","Up to 5 employees"],
       locked:["PDF downloads","Loans & advance","Warning letters","PF/ESI reports","Offer letter","Annual statement"],
       glow:"rgba(255,255,255,.08)",card:"#1E293B"},
      {n:"Pro",   monthly:"₹499/mo", yearly:"₹4,999/yr",sub:"Up to 25 employees", tag:"Most Popular",
       features:["Everything in Free","All PDF downloads","Loans & advance","Warning letters","PF/ESI reports","Offer letter PDF","Annual statement","Holiday calendar","Leave balance","WhatsApp sharing"],
       locked:[],glow:"rgba(99,102,241,.25)",card:"#0F172A"},
      {n:"Business",monthly:"₹999/mo",yearly:"₹9,999/yr",sub:"Up to 50 employees",tag:"Best Value",
       features:["Everything in Pro","Up to 50 employees","HR Policy Builder & Handbook","Priority WhatsApp support","Multi-dept reports","Advanced compliance PDFs"],
       locked:[],glow:"rgba(139,92,246,.25)",card:"#1a1040"},
    ];
    var cur=plans[pSlide];

    var feats=[
      {icon:"calendar_month",title:"Attendance",brief:"One-tap daily marking"},
      {icon:"payments",title:"Payroll",brief:"PF, ESI, PT automated"},
      {icon:"fact_check",title:"Compliance",brief:"Every statutory PDF"},
      {icon:"account_balance",title:"PF & ESI",brief:"Challan in one click"},
      {icon:"workspace_premium",title:"Gratuity",brief:"Auto calculated"},
      {icon:"description",title:"Offer Letter",brief:"PDF in seconds"},
      {icon:"cloud_upload",title:"Cloud Sync",brief:"Auto backup, any device"},
    ];
    function tile(f,key){
      return h("div",{key:key,style:{flexShrink:0,width:108,background:"#1E293B",border:"1px solid #334155",borderRadius:14,padding:"12px 10px",display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center",gap:5,marginRight:10}},
        h("div",{style:{width:32,height:32,borderRadius:9,background:"rgba(255,255,255,0.08)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:2}},ic(f.icon,"rgba(255,255,255,0.85)",16)),
        h("div",{style:{fontSize:11,fontWeight:800,color:"#FFFFFF",lineHeight:1.2}},f.title),
        h("div",{style:{fontSize:9,color:"rgba(255,255,255,0.50)",lineHeight:1.3}},f.brief)
      );
    }
    var d1=feats.concat(feats);
    var segments=[
      {icon:"bolt",l:"Startups",s:"5–20 emp",clr:"#F59E0B"},
      {icon:"briefcase",l:"Retail",s:"Any scale",clr:"#3B82F6"},
      {icon:"business",l:"Manufacturing",s:"10–50 emp",clr:"#8B5CF6"},
      {icon:"people_alt",l:"Any Business",s:"Pays salaries",clr:"#10B981"},
    ];

    return h("div",{style:{position:"fixed",inset:0,background:BG,display:"flex",flexDirection:"column",maxWidth:430,margin:"0 auto",overflow:"hidden"}},

      /* ════ HERO — uses app BG, no dark overlay ════ */
      h("div",{style:{flexShrink:0,background:BG,display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center",padding:"22px 24px 18px",position:"relative"}},
        /* Subtle glow — decorative, matches theme */
        h("div",{style:{position:"absolute",top:"20%",left:"50%",transform:"translate(-50%,-50%)",width:200,height:200,borderRadius:"50%",background:"radial-gradient(circle,"+(isDark?"rgba(99,102,241,.12)":"rgba(99,102,241,.06)")+" 0%,transparent 70%)",pointerEvents:"none",animation:"glow-pulse 3s ease-in-out infinite"}}),
        h("div",{style:{position:"relative",zIndex:1,display:"flex",flexDirection:"column",alignItems:"center",width:"100%"}},
          logoSVG(48),
          /* ADMIN HR — themed */
          h("div",{style:{marginTop:10,marginBottom:6}},
            h("div",{style:{fontSize:22,fontWeight:900,color:NV,letterSpacing:2,textTransform:"uppercase"}},
              "ADMIN",h("span",{style:{color:GR}}," HR")
            )
          ),
          h("div",{style:{fontSize:12,color:GR,lineHeight:1.65,maxWidth:255,marginBottom:18}},
            "Smart HR for Indian businesses. Attendance, payroll & compliance in one app."),
          /* Buttons — use app accent */
          h("div",{style:{display:"flex",gap:10,width:"100%",maxWidth:250}},
            h("button",{onClick:function(){setAuthErr("");setAuthMode("signup");},style:{flex:1,background:ACC,border:"none",borderRadius:10,padding:"12px",fontSize:13,fontWeight:800,color:isDark?"#0F172A":"#FFFFFF",cursor:"pointer"}},"Start Free"),
            h("button",{onClick:function(){setAuthErr("");setAuthMode("signin");},style:{flex:1,background:CRD,border:"1.5px solid "+BD,borderRadius:10,padding:"12px",fontSize:13,fontWeight:600,color:NV,cursor:"pointer"}},"Sign In")
          )
        )
      ),

      /* ════ SCROLLING ROW ════ */
      h("div",{style:{flexShrink:0,padding:"8px 0",background:BG}},
        h("div",{className:"mwrap"},h("div",{className:"mltr",style:{paddingLeft:14}},d1.map(function(f,i){return tile(f,"t"+i);})))
      ),

      /* ════ BUILT FOR ════ */
      h("div",{style:{flexShrink:0,padding:"0 14px 8px"}},
        h("div",{style:{background:CRD,borderRadius:14,border:"1px solid "+BD,padding:"10px 12px"}},
          h("div",{style:{fontSize:9,fontWeight:700,color:GR,letterSpacing:1.6,marginBottom:8,textAlign:"center"}},"BUILT FOR"),
          h("div",{style:{display:"flex",gap:6}},
            segments.map(function(t){
              return h("div",{key:t.l,style:{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:"8px 4px",background:t.clr+"10",borderRadius:10,border:"1px solid "+t.clr+"30",position:"relative",overflow:"hidden"}},
                h("div",{style:{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:40,height:18,background:t.clr,opacity:.12,borderRadius:"0 0 40px 40px",filter:"blur(5px)"}}),
                h("div",{style:{width:28,height:28,borderRadius:8,background:t.clr+"18",display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid "+t.clr+"33",position:"relative",zIndex:1}},ic(t.icon,t.clr,14)),
                h("div",{style:{fontSize:9,fontWeight:700,color:NV,textAlign:"center",lineHeight:1.2,position:"relative",zIndex:1}},t.l),
                h("div",{style:{fontSize:7,color:GR,textAlign:"center",position:"relative",zIndex:1}},t.s)
              );
            })
          )
        )
      ),

      /* ════ PRICING — swipeable, no arrows ════ */
      h("div",{style:{flexShrink:0,padding:"0 14px 8px"}},
        h("div",{style:{background:CRD,borderRadius:14,border:"1px solid "+BD,padding:"10px 12px"}},
          /* Header: label + dots */
          h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}},
            h("div",{style:{fontSize:9,fontWeight:700,color:GR,letterSpacing:1.6}},"PRICING"),
            h("div",{style:{display:"flex",gap:5,alignItems:"center"}},
              [0,1,2].map(function(i){return h("div",{key:i,onClick:function(){setSlide(i);},style:{width:i===pSlide?18:6,height:6,borderRadius:99,background:i===pSlide?ACC:BD,cursor:"pointer",transition:"all .25s"}});})
            )
          ),
          /* Swipeable plan card */
          h("div",{
            onTouchStart:function(e){touchX[1](e.touches[0].clientX);},
            onTouchEnd:function(e){
              if(touchX[0]===null)return;
              var dx=touchX[0]-e.changedTouches[0].clientX;
              if(Math.abs(dx)>40){setSlide(function(n){return dx>0?(n+1)%3:(n+2)%3;});}
              touchX[1](null);
            },
            onClick:function(){setSlide(function(n){return (n+1)%3;});},
            style:{background:cur.card,borderRadius:10,padding:"12px",position:"relative",overflow:"hidden",cursor:"pointer",userSelect:"none",WebkitUserSelect:"none"}
          },
            /* Glow */
            h("div",{style:{position:"absolute",top:-20,right:-20,width:90,height:90,borderRadius:"50%",background:cur.glow,filter:"blur(22px)",pointerEvents:"none"}}),
            /* Plan name row */
            h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8,position:"relative",zIndex:1}},
              h("div",null,
                h("div",{style:{display:"flex",alignItems:"center",gap:6,marginBottom:3}},
                  h("div",{style:{fontSize:15,fontWeight:900,color:"#FFFFFF"}},cur.n),
                  cur.tag?h("div",{style:{fontSize:7,fontWeight:600,background:"rgba(255,255,255,.15)",color:"rgba(255,255,255,0.75)",borderRadius:20,padding:"2px 8px",letterSpacing:.3}},cur.tag):null
                ),
                h("div",{style:{fontSize:9,color:"rgba(255,255,255,0.5)"}},cur.sub)
              ),
              h("div",{style:{textAlign:"right"}},
                h("div",{style:{fontSize:16,fontWeight:900,color:"#FFFFFF",letterSpacing:-.3}},cur.monthly),
                h("div",{style:{fontSize:9,color:"rgba(255,255,255,0.45)",marginTop:1}},pSlide===0?"forever":cur.yearly+" billed yearly")
              )
            ),
            /* Features grid — 2 columns */
            h("div",{style:{background:"rgba(255,255,255,.06)",borderRadius:8,padding:"7px 8px",position:"relative",zIndex:1}},
              h("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"3px 6px"}},
                cur.features.map(function(f,i){
                  return h("div",{key:i,style:{display:"flex",alignItems:"center",gap:3,padding:"2px 0",fontSize:9,color:"rgba(255,255,255,.85)"}},
                    ic("check_circle","#10B981",9),h("span",{style:{lineHeight:1.3}},f));
                })
              ),
              cur.locked.length>0?h("div",{style:{marginTop:4,paddingTop:4,borderTop:"1px solid rgba(255,255,255,.1)",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"3px 6px"}},
                cur.locked.map(function(f,i){
                  return h("div",{key:i,style:{display:"flex",alignItems:"center",gap:3,padding:"2px 0",fontSize:9,color:"rgba(255,255,255,.3)"}},
                    ic("lock","rgba(255,255,255,.3)",9),h("span",{style:{lineHeight:1.3}},f));
                })
              ):null
            ),
            /* Tap hint */
            h("div",{style:{textAlign:"center",marginTop:6,fontSize:8,color:"rgba(255,255,255,.25)",position:"relative",zIndex:1}},"Tap or swipe to see other plans")
          )
        )
      ),

      /* ════ CONTACT + QUOTE ════ */
      h("div",{style:{flex:1,display:"flex",flexDirection:"column",justifyContent:"flex-end",padding:"0 14px 12px"}},
        h("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginBottom:8}},
          h("span",{style:{fontSize:11,color:GR}},"Need help?"),
          h("span",{style:{fontSize:11,color:GR}},"—"),
          h("span",{style:{display:"flex",alignItems:"center",gap:4,fontSize:12,fontWeight:700,color:"#25D366",cursor:"pointer"},onClick:function(){window.open("https://wa.me/918072293384","_blank");}},
            ic("whatsapp","#25D366",14),"Contact Support"
          )
        ),
        h("div",{style:{textAlign:"center"}},
          h("div",{style:{fontSize:11,fontStyle:"italic",color:GR,lineHeight:1.6,marginBottom:3}},"“Your employees are your greatest asset.”"),
          h("div",{style:{fontSize:9,letterSpacing:1.2,color:GR,fontWeight:700}},"PROUDLY BUILT IN INDIA — BY ELEVEN.11")
        )
      )
    );
  })();
  // ── Sign In screen ──
  var signinScreen=authWrap(h("div",{key:"signin"},
    h("div",{style:{display:"flex",alignItems:"center",gap:10,marginBottom:24}},
      h("button",{onClick:function(){setAuthMode("landing");setAuthErr("");},style:{background:"none",border:"none",cursor:"pointer",color:T.AUTH_LABEL,fontSize:20,padding:0,lineHeight:1}},"\u2190"),
      h("div",null,
        h("div",{style:{fontSize:20,fontWeight:800,color:T.AUTH_TEXT}},"Sign In"),
        h("div",{style:{fontSize:12,color:T.AUTH_LABEL}},"Welcome back")
      )
    ),
    authLbl("EMAIL ADDRESS"),
    inp("email",authEmail,function(e){setAuthEmail(e.target.value);setAuthErr("");},
      "you@company.com",!!authErr),
    authErr2(),
    authBtn(authLoading?"Sending OTP...":"Get OTP",handleSendOTP),
    h("div",{style:{textAlign:"center",fontSize:12,color:T.AUTH_LABEL,marginTop:8}},
      "New to Admin HR? ",
      h("span",{style:{color:TEL,cursor:"pointer",fontWeight:700},onClick:function(){setAuthErr("");setAuthMode("signup");}},"Create Account")
    )
  ));

  // ── Sign Up screen ──
  var signupScreen=authWrap(h("div",{key:"signup"},
    h("div",{style:{display:"flex",alignItems:"center",gap:10,marginBottom:20}},
      h("button",{onClick:function(){setAuthMode("landing");setAuthErr("");},style:{background:"none",border:"none",cursor:"pointer",color:T.AUTH_LABEL,fontSize:20,padding:0,lineHeight:1}},"\u2190"),
      h("div",null,
        h("div",{style:{fontSize:20,fontWeight:800,color:T.AUTH_TEXT}},"Create Account"),
        h("div",{style:{fontSize:12,color:T.AUTH_LABEL}},"Set up your HR workspace")
      )
    ),
    authLbl("FULL NAME"),
    inp("text",suName,function(e){setSuName(e.target.value);setAuthErr("");},"Your full name"),
    authLbl("ORGANIZATION NAME"),
    inp("text",suOrg,function(e){setSuOrg(e.target.value);setAuthErr("");},"Company / Business name"),
    authLbl("ORGANIZATION TYPE"),
    sel(suType,function(e){setSuType(e.target.value);setAuthErr("");},
      ["IT / Software","Retail","Manufacturing","Healthcare","Education","Finance","Construction","Logistics","Hospitality"],
      "Select type",null,true,"Choose your organization type"),
    authLbl("YOUR ROLE / POSITION"),
    sel(suPos,function(e){setSuPos(e.target.value);setAuthErr("");},
      ["Business Owner","HR Manager","HR Executive","Director","CEO / MD","Finance Manager","Admin Manager"],
      "Select your role",null,true,"Choose your role"),
    authLbl("TEAM SIZE"),
    sel(suEmpRange,function(e){setSuEmpRange(e.target.value);setAuthErr("");},
      ["1 - 10","11 - 50","51 - 200","201 - 500","500+"],
      "Select team size"),
    authLbl("WORK EMAIL"),
    inp("email",authEmail,function(e){setAuthEmail(e.target.value);setAuthErr("");},"you@company.com",!!authErr),
    // Warning checkbox
    h("div",{style:{background:suAgreed?AMB+"18":T.AUTH_INPUT_BG,border:"2px solid "+(suAgreed?AMB:NVY),borderRadius:10,padding:"10px 12px",marginBottom:10,display:"flex",gap:10,alignItems:"flex-start",cursor:"pointer",transition:"all .2s"},
      onClick:function(){setSuAgreed(function(v){return !v;});}},
      h("div",{style:{width:20,height:20,borderRadius:5,border:"2.5px solid "+(suAgreed?AMB:NVY),background:suAgreed?AMB:"transparent",flexShrink:0,marginTop:1,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s"}},
        suAgreed?h("div",{style:{color:"#fff",fontSize:13,fontWeight:900}},"\u2713"):null
      ),
      h("div",{style:{fontSize:11,color:T.AUTH_LABEL,lineHeight:1.5}},
        h("span",{style:{color:suAgreed?AMB:NVY,fontWeight:700}},"Important: "),
        "This email will be your permanent login ID. It cannot be changed later. Please use a professional long-term email."
      )
    ),
    authErr2(),
    authBtn(authLoading?"Sending OTP...":"Continue",handleSignupSendOTP),
    h("div",{style:{textAlign:"center",fontSize:12,color:T.AUTH_LABEL,marginTop:4}},
      "Already have an account? ",
      h("span",{style:{color:TEL,cursor:"pointer",fontWeight:700},onClick:function(){setAuthErr("");setAuthMode("signin");}},"Sign In")
    )
  ),true);

  // ── OTP screen (shared for signin and signup) ──
  var otpScreen=authWrap(h("div",{key:"otp",style:{textAlign:"center"}},
    h("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",marginBottom:28}},
      logoSVG(52),
      h("div",{style:{fontSize:20,fontWeight:800,color:T.AUTH_TEXT,marginTop:14}},
        authMode==="signup-otp"?"Verify Your Email":"Check Your Email"),
      h("div",{style:{fontSize:12,color:T.AUTH_LABEL,marginTop:5}},"OTP sent to"),
      h("div",{style:{fontSize:13,fontWeight:700,color:T.AUTH_TEXT,marginTop:3}},authEmail),
      authMode==="signup-otp"?h("div",{style:{background:"#4F46E518",borderRadius:8,padding:"6px 12px",marginTop:8,fontSize:11,color:"#4F46E5",fontWeight:600}},
        "Almost there! Verify to complete signup"
      ):null
    ),
    authLbl("ENTER OTP FROM EMAIL"),
    h("input",{
      type:"number",value:authOtp,
      onChange:function(e){setAuthOtp(e.target.value.slice(0,8));setAuthErr("");},
      onKeyDown:function(e){if(e.key==="Enter")handleVerifyOTP();},
      placeholder:"••••••",
      style:{width:"100%",background:T.AUTH_INPUT_BG,border:"1.5px solid "+(authErr?RED:T.AUTH_INPUT_BDR),
        borderRadius:12,padding:"14px",fontSize:28,color:T.AUTH_TEXT,outline:"none",
        fontFamily:"monospace",textAlign:"center",letterSpacing:10,marginBottom:10}
    }),
    authErr2(),
    authBtn(authLoading?"Verifying...":"Verify & "+( authMode==="signup-otp"?"Create Account":"Sign In"),handleVerifyOTP),
    h("div",{style:{marginTop:14,fontSize:12,color:T.AUTH_LABEL,textAlign:"center"}},
      h("span",{style:{color:TEL,cursor:"pointer",fontWeight:600},
        onClick:function(){setAuthMode(authMode==="signup-otp"?"signup":"signin");setAuthOtp("");setAuthErr("");setOtpSent(false);}},
        "\u2190 Go back"),
      " \u2022 ",
      h("span",{style:{color:TEL,cursor:"pointer",fontWeight:600},
        onClick:function(){setAuthOtp("");setAuthErr("");authMode==="signup-otp"?handleSignupSendOTP():handleSendOTP();}},
        "Resend OTP")
    ),
    h("div",{style:{fontSize:10,color:T.AUTH_LABEL,marginTop:6}},"OTP expires in 10 minutes \u2022 Check spam if not received")
  ));

  // ── Setup screen (for existing OTP users who have no org yet) ──
  var setupScreen=authWrap(h("div",{key:"setup"},
    h("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",marginBottom:24}},
      logoSVG(52),
      h("div",{style:{fontSize:20,fontWeight:800,color:T.AUTH_TEXT,marginTop:14}},"Set Up Your Workspace"),
      h("div",{style:{fontSize:12,color:T.AUTH_LABEL,marginTop:3,textAlign:"center"}},"Tell us about your organization")
    ),
    authLbl("ORGANIZATION NAME"),
    inp("text",suOrg,function(e){setSuOrg(e.target.value);setAuthErr("");},"Company / Business name"),
    authLbl("ORGANIZATION TYPE"),
    sel(suType,function(e){setSuType(e.target.value);setAuthErr("");},
      ["IT / Software","Retail","Manufacturing","Healthcare","Education","Finance","Construction","Logistics","Hospitality"],
      "Select type",null,true,"Choose your organization type"),
    authLbl("YOUR ROLE"),
    sel(suPos,function(e){setSuPos(e.target.value);setAuthErr("");},
      ["Business Owner","HR Manager","HR Executive","Director","CEO / MD","Finance Manager","Admin Manager"],
      "Select your role",null,true,"Choose your role"),
    authLbl("TEAM SIZE"),
    sel(suEmpRange,function(e){setSuEmpRange(e.target.value);setAuthErr("");},
      ["1 - 10","11 - 50","51 - 200","201 - 500","500+"],
      "Select team size"),
    authErr2(),
    authBtn(authLoading?"Saving...":"Get Started",function(){
      if(!suOrg.trim())return setAuthErr("Enter organization name");
      if(!suType||suType===CHIP_CUSTOM_SENTINEL)return setAuthErr("Select organization type");
      if(!suPos||suPos===CHIP_CUSTOM_SENTINEL)return setAuthErr("Select your role");
      if(!suEmpRange)return setAuthErr("Select team size");
      var em=gUser&&gUser.email?gUser.email:"";
      setAuthLoading(true);
      _sb.from("user_orgs").upsert({
        email:em,org_name:suOrg.trim(),org_type:suType,
        position:suPos,emp_count_range:suEmpRange
      },{onConflict:"email"}).then(function(){
        setAuthLoading(false);
        var o=Object.assign({},org,{name:suOrg.trim(),type:suType,position:suPos,email:em,plan:"free"});
        setOrg(o);lsSet("hr_org_"+em,o);
        setScreen("app");showT("Welcome to Admin HR!");
      }).catch(function(e){setAuthErr(e.message||"Error");setAuthLoading(false);});
    })
  ),true);

  // ── Employee signup screen ──
  var empSignupScreen=authWrap(h("div",{key:"empsignup"},
    h("div",{style:{display:"flex",alignItems:"center",gap:10,marginBottom:24}},
      h("button",{onClick:function(){setAuthMode("landing");setAuthErr("");},style:{background:"none",border:"none",cursor:"pointer",color:T.AUTH_LABEL,fontSize:20,padding:0,lineHeight:1}},"\u2190"),
      h("div",null,
        h("div",{style:{fontSize:20,fontWeight:800,color:T.AUTH_TEXT}},"Join Organisation"),
        h("div",{style:{fontSize:12,color:T.AUTH_LABEL,marginTop:2}},"Enter the invite code from your employer")
      )
    ),
    h("div",{style:{background:ACCENT+"10",border:"1px solid "+ACCENT+"33",borderRadius:12,padding:"10px 14px",marginBottom:16,display:"flex",gap:8,alignItems:"flex-start"}},
      ic("info",ACCENT,16),
      h("div",{style:{fontSize:12,color:T.AUTH_TEXT,lineHeight:1.5}},"Your employer must invite you first and share a 6-digit code with you.")
    ),
    authLbl("YOUR FULL NAME"),
    inp("text",suName,function(e){setSuName(e.target.value);setAuthErr("");},"Your full name"),
    authLbl("YOUR WORK EMAIL"),
    inp("email",authEmail,function(e){setAuthEmail(e.target.value);setAuthErr("");},"you@company.com",!!authErr),
    authLbl("6-DIGIT INVITE CODE"),
    h("input",{type:"number",value:signupInviteCode,onChange:function(e){setSignupInviteCode(e.target.value.slice(0,6));setAuthErr("");},placeholder:"000000",style:{width:"100%",background:T.AUTH_INPUT_BG,border:"1.5px solid "+(authErr?RED:T.AUTH_INPUT_BDR),borderRadius:10,padding:"13px",fontSize:24,color:T.AUTH_TEXT,outline:"none",fontFamily:"monospace",textAlign:"center",letterSpacing:8,marginBottom:10,boxSizing:"border-box"}}),
    authErr2(),
    authBtn(authLoading?"Verifying code...":"Continue",handleEmployeeSignupSendOTP),
    h("div",{style:{textAlign:"center",fontSize:12,color:T.AUTH_LABEL,marginTop:8}},
      "Are you an employer? ",
      h("span",{style:{color:TEL,cursor:"pointer",fontWeight:700},onClick:function(){setAuthErr("");setAuthMode("signup");}},"Create Account")
    )
  ));

  var setPasswordScreen=authWrap(h("div",{key:"setpw",style:{textAlign:"center"}},

    h("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",marginBottom:28}},
      logoSVG(52),
      h("div",{style:{fontSize:20,fontWeight:800,color:T.AUTH_TEXT,marginTop:14}},"Set New Password"),
      h("div",{style:{fontSize:12,color:T.AUTH_LABEL,marginTop:3}},"Choose a strong password")
    ),
    h("div",{style:{fontSize:11,color:T.AUTH_LABEL,letterSpacing:1,marginBottom:5,fontWeight:600,textAlign:"left"}},"NEW PASSWORD"),
    h("div",{style:{position:"relative",marginBottom:10}},
      h("input",{type:showNewPw?"text":"password",value:newPwd,onChange:function(e){setNewPwd(e.target.value);setNewPwdErr("");},placeholder:"Min. 6 characters",style:{width:"100%",background:T.AUTH_INPUT_BG,border:"1.5px solid "+T.AUTH_INPUT_BDR,borderRadius:12,padding:"13px 44px 13px 14px",fontSize:13,color:T.AUTH_TEXT,outline:"none",fontFamily:"inherit"}}),
      h("button",{onClick:function(){setShowNewPw(function(v){return !v;});},style:{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:T.AUTH_LABEL,fontSize:11,padding:2}},showNewPw?"Hide":"Show")
    ),
    h("div",{style:{fontSize:11,color:T.AUTH_LABEL,letterSpacing:1,marginBottom:5,fontWeight:600,textAlign:"left"}},"CONFIRM PASSWORD"),
    h("input",{type:showNewPw?"text":"password",value:newPwd2,onChange:function(e){setNewPwd2(e.target.value);setNewPwdErr("");},placeholder:"Re-enter password",style:{width:"100%",background:T.AUTH_INPUT_BG,border:"1.5px solid "+(newPwdErr&&newPwd!==newPwd2?RED:T.AUTH_INPUT_BDR),borderRadius:12,padding:"13px 14px",fontSize:13,color:T.AUTH_TEXT,outline:"none",fontFamily:"inherit",marginBottom:10}}),
    newPwdErr?h("div",{style:{background:RED+"15",border:"1px solid "+RED+"44",borderRadius:8,padding:"8px 12px",marginBottom:10,fontSize:12,color:RED,fontWeight:500}},newPwdErr):null,
    h("button",{onClick:handleSetNewPassword,style:{width:"100%",background:T.AUTH_BTN_BG,border:"none",borderRadius:12,padding:"14px",color:T.AUTH_BTN_TEXT,fontSize:14,fontWeight:700,cursor:"pointer",marginTop:6}},"Update Password")
  ));



  // ── Pro: Notification helpers ──────────────────────────────────────────
  function addNotif(toEmail,fromEmail,type,title,message,refId,refType){
    var n={id:Date.now(),to:toEmail,from:fromEmail,type:type,title:title,message:message,refId:refId||"",refType:refType||"general",read:false,createdAt:new Date().toISOString()};
    setNotifs(function(p){return [n].concat(p);});
    setUnreadNotifs(function(c){return c+1;});
  }

  // ── Pro: Task functions ─────────────────────────────────────────────────
  function saveTask(){
    if(!taskTitle.trim())return showT("Enter task title","err");
    if(!taskAssignTarget)return showT("Select assignment target","err");
    if(!taskDeadline)return showT("Select deadline","err");
    var task={
      id:Date.now(),
      createdBy:gUser.email,
      employerEmail:gUser.email,
      assignType:taskAssignType,
      assignTarget:taskAssignTarget,
      title:taskTitle.trim(),
      description:taskDesc.trim(),
      priority:taskPriority,
      deadline:taskDeadline,
      status:"assigned",
      completionNote:"",
      rejectionReason:"",
      createdAt:new Date().toISOString(),
      updatedAt:new Date().toISOString()
    };
    setTasks(function(p){return [task].concat(p);});
    setTaskTitle("");setTaskDesc("");setTaskAssignTarget("");setTaskDeadline("");setTaskPriority("medium");setTaskAssignType("individual");
    setShowNewTask(false);
    addNotif(taskAssignTarget,gUser.email,"task_assigned","New task assigned","You have a new task: "+task.title,String(task.id),"task");
    showT("Task assigned!");
  }

  function updateTaskStatus(taskId,status,note){
    setTasks(function(p){return p.map(function(t){
      if(t.id!==taskId)return t;
      var updated=Object.assign({},t,{status:status,updatedAt:new Date().toISOString()});
      if(note&&status==="completed")updated.completionNote=note;
      if(note&&status==="rejected")updated.rejectionReason=note;
      return updated;
    });});
    var task=tasks.find(function(t){return t.id===taskId;});
    if(!task)return;
    if(status==="completed"){
      addNotif(task.employerEmail,gUser.email,"task_completed","Task completed",gUser.email.split("@")[0]+" completed: "+task.title,String(taskId),"task");
    }
    if(status==="verified"){
      addNotif(task.assignTarget,gUser.email,"task_verified","Task verified","Your task was verified: "+task.title,String(taskId),"task");
    }
    if(status==="rejected"){
      addNotif(task.assignTarget,gUser.email,"task_rejected","Task rejected","Your task needs revision: "+task.title,String(taskId),"task");
    }
    showT(status==="verified"?"Task verified!":status==="rejected"?"Task sent back":"Status updated");
  }

  // Add a typed status update to the task's history
  function addStatusUpdate(taskId){
    var txt=taskStatusInput.trim();
    if(!txt)return showT("Type a status update","err");
    var entry={id:Date.now(),text:txt,by:gUser.email,at:new Date().toISOString()};
    setTasks(function(p){return p.map(function(t){
      if(t.id!==taskId)return t;
      var hist=(t.statusHistory||[]).concat([entry]);
      return Object.assign({},t,{statusHistory:hist,updatedAt:new Date().toISOString()});
    });});
    var task=tasks.find(function(t){return t.id===taskId;});
    if(task){
      var toEmail=gUser.email===task.employerEmail?task.assignTarget:task.employerEmail;
      addNotif(toEmail,gUser.email,"task_status","Task status update",gUser.email.split("@")[0]+": "+txt,String(taskId),"task");
    }
    setTaskStatusInput("");
    showT("Status updated");
  }

  // Share the latest status to the assigned employee via WhatsApp (with deadline reminder)
  function shareTaskStatusWA(task,statusText){
    var assignedEmp=emps.find(function(e){return e.email===task.assignTarget||e.name===task.assignTarget;});
    if(!assignedEmp||!assignedEmp.mob){showT("No mobile number for this employee","err");return;}
    var name=assignedEmp.name||task.assignTarget||"";
    var msg="Hi "+name+",\n\nUpdate on your task: \""+task.title+"\"\n";
    if(statusText)msg+="\nStatus: "+statusText+"\n";
    if(task.deadline)msg+="\nDeadline: "+task.deadline+" (please complete on time)\n";
    msg+="\n- "+((org&&org.name)||"Admin HR");
    window.open("https://wa.me/"+waNum(assignedEmp)+"?text="+encodeURIComponent(msg),"_blank");
  }

  function addTaskComment(taskId){
    if(!taskComment.trim())return;
    var comment={id:Date.now(),taskId:taskId,fromEmail:gUser.email,message:taskComment.trim(),createdAt:new Date().toISOString()};
    setTaskComments(function(p){var o=Object.assign({},p);o[taskId]=(o[taskId]||[]).concat([comment]);return o;});
    var task=tasks.find(function(t){return t.id===taskId;});
    if(task){
      var toEmail=gUser.email===task.employerEmail?task.assignTarget:task.employerEmail;
      addNotif(toEmail,gUser.email,"task_comment","New comment",gUser.email.split("@")[0]+": "+taskComment.trim(),String(taskId),"task");
    }
    setTaskComment("");showT("Comment sent");
  }

  // ── Pro: Leave functions ────────────────────────────────────────────────
  var LEAVE_TYPES={
    CL:{name:"Casual Leave",paid:true,needsReason:false},
    SL:{name:"Sick Leave",paid:true,needsReason:true},
    PL:{name:"Paid Leave",paid:true,needsReason:false},
    UL:{name:"Unpaid Leave",paid:false,needsReason:true},
    EL:{name:"Emergency Leave",paid:true,needsReason:true},
    CO:{name:"Compensatory Off",paid:true,needsReason:false},
    ML:{name:"Maternity Leave",paid:true,needsReason:false},
    PTL:{name:"Paternity Leave",paid:true,needsReason:false}
  };

  function applyLeave(){
    if(!leaveFrom||!leaveTo)return showT("Select date range","err");
    if(LEAVE_TYPES[leaveType].needsReason&&!leaveReason.trim())return showT("Reason required for "+LEAVE_TYPES[leaveType].name,"err");
    var req={id:Date.now(),employeeEmail:gUser.email,employerEmail:empEmployerEmail,leaveType:leaveType,fromDate:leaveFrom,toDate:leaveTo,reason:leaveReason.trim(),status:"pending",adminReply:"",createdAt:new Date().toISOString()};
    setLeaveReqs(function(p){return [req].concat(p);});
    setLeaveFrom("");setLeaveTo("");setLeaveReason("");setShowLeaveForm(false);
    addNotif(empEmployerEmail,gUser.email,"leave_requested","Leave request",gUser.email.split("@")[0]+" applied for "+LEAVE_TYPES[leaveType].name,String(req.id),"leave");
    showT("Leave request sent!");
  }

  function approveLeave(reqId){
    setLeaveReqs(function(p){return p.map(function(r){
      if(r.id!==reqId)return r;
      // Auto-mark attendance
      var d=new Date(r.fromDate),end=new Date(r.toDate);
      var attKey=LEAVE_TYPES[r.leaveType].paid?"pl":"ul";
      setAtt(function(a){
        var o=Object.assign({},a);
        while(d<=end){
          var ds=d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
          // find employee id
          var emp=emps.find(function(e){return e.email===r.employeeEmail||e.name.toLowerCase()===r.employeeEmail.split("@")[0].toLowerCase();});
          if(emp)o[ds+"_"+emp.id]=attKey;
          d.setDate(d.getDate()+1);
        }
        return o;
      });
      return Object.assign({},r,{status:"approved"});
    });});
    var req=leaveReqs.find(function(r){return r.id===reqId;});
    if(req)addNotif(req.employeeEmail,gUser.email,"leave_approved","Leave approved","Your "+LEAVE_TYPES[req.leaveType].name+" has been approved",String(reqId),"leave");
    showT("Leave approved! Attendance auto-marked.");
  }

  function rejectLeave(reqId,reply){
    setLeaveReqs(function(p){return p.map(function(r){return r.id===reqId?Object.assign({},r,{status:"rejected",adminReply:reply||""}):r;});});
    var req=leaveReqs.find(function(r){return r.id===reqId;});
    if(req)addNotif(req.employeeEmail,gUser.email,"leave_rejected","Leave rejected","Your leave request was not approved",String(reqId),"leave");
    showT("Leave rejected.");
  }

  // ── Pro: Invite functions ───────────────────────────────────────────────
  function generateInviteCode(){
    if(!inviteEmail.trim()||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteEmail.trim()))return showT("Enter valid email","err");
    var code=String(Math.floor(100000+Math.random()*900000));
    setInviteCode(code);
    setShowInviteCode(true);
    var empEmail=inviteEmail.trim().toLowerCase();
    // Find employee record ID for this email
    var empRecord=inviteEmpId?emps.find(function(e){return e.id===inviteEmpId;}):emps.find(function(e){return e.email&&e.email.toLowerCase()===empEmail;});
    _sb.from("invite_codes").insert({
      code:code,
      employer_email:gUser.email,
      employee_email:empEmail,
      employee_id:empRecord?String(empRecord.id):null
    }).then(function(r){
      if(r.error)showT("Code generated! Share with employee.");
      else showT("Invite code ready! Share "+code+" with employee.");
    });
  }

  // ── Pro: KPI functions ──────────────────────────────────────────────────
  function saveKpi(){
    if(!kpiName.trim())return showT("Enter KPI title","err");
    if(!kpiTarget)return showT("Enter target value","err");
    if(!kpiAssignTarget)return showT("Select assignment target","err");
    var kpi={id:String(Date.now()),employerEmail:gUser.email,assignType:kpiAssignType,assignTarget:kpiAssignTarget,
      title:kpiName.trim(),name:kpiName.trim(),targetValue:Number(kpiTarget),target:Number(kpiTarget),
      currentProgress:0,unit:kpiUnit,startDate:kpiStartDate||todayStr,dueDate:kpiDueDate||"",
      status:"not_started",followUpRemarks:"",createdAt:new Date().toISOString()};
    setKpis(function(p){return p.concat([kpi]);});
    _sb.from("kpis").insert({
      id:kpi.id,employer_email:gUser.email,assign_type:kpi.assignType,assign_target:kpi.assignTarget,
      title:kpi.title,target_value:kpi.targetValue,current_progress:0,unit:kpi.unit,
      start_date:kpi.startDate||null,due_date:kpi.dueDate||null,status:kpi.status,follow_up_remarks:""
    }).then(function(r){
      if(r&&r.error){showT("Could not save KPI: "+r.error.message,"err");setKpis(function(p){return p.filter(function(x){return x.id!==kpi.id;});});}
    });
    setKpiName("");setKpiTarget("");setKpiUnit("Tasks");setKpiStartDate("");setKpiDueDate("");setKpiAssignTarget("");setShowKpiForm(false);
    showT("KPI created!");
  }

  function getEmpKpis(empEmail,empDept,empRole){
    return kpis.filter(function(k){
      return k.employerEmail===gUser.email&&(
        (k.assignType==="individual"&&k.assignTarget===empEmail)||
        (k.assignType==="department"&&k.assignTarget===empDept)||
        (k.assignType==="role"&&k.assignTarget===empRole)
      );
    });
  }

  // Status is derived automatically from progress vs target vs due date — never set by hand,
  // so it can never silently go stale the way a manually-picked status field would.
  function computeKpiStatus(k){
    var prog=Number(k.currentProgress||0),target=Number(k.targetValue||k.target||0);
    if(target>0&&prog>=target)return "achieved";
    if(k.dueDate&&k.dueDate<todayStr&&prog<target)return "missed";
    if(prog>0)return "in_progress";
    return "not_started";
  }
  var KPI_STATUS_META={
    not_started:{label:"Not Started",color:GRY,bg:T.PILL_NEUTRAL_BG||SFT},
    in_progress:{label:"In Progress",color:TEL,bg:T.PILL_INFO_BG||TEL+"15"},
    achieved:{label:"Achieved",color:GRN,bg:T.PILL_OK_BG},
    missed:{label:"Missed",color:RED,bg:T.PILL_DANGER_BG}
  };
  function getKpiHistory(kpiId){
    return (kpiUpdates||[]).filter(function(u){return u.kpiId===kpiId;}).sort(function(a,b){return new Date(b.createdAt||0)-new Date(a.createdAt||0);});
  }
  // Logs a new progress entry (kept in full history) and updates the KPI's running progress/status.
  function addKpiUpdate(kpi,newProgress,remark){
    var upd={id:String(Date.now()),kpiId:kpi.id,progress:Number(newProgress)||0,remark:remark||"",createdAt:new Date().toISOString()};
    setKpiUpdates(function(p){return [upd].concat(p||[]);});
    var updatedKpi=Object.assign({},kpi,{currentProgress:upd.progress,followUpRemarks:remark||kpi.followUpRemarks});
    updatedKpi.status=computeKpiStatus(updatedKpi);
    setKpis(function(p){return p.map(function(k){return k.id===kpi.id?updatedKpi:k;});});
    _sb.from("kpi_updates").insert({id:upd.id,kpi_id:kpi.id,employer_email:gUser.email,progress:upd.progress,remark:upd.remark}).then(function(r){
      if(r&&r.error)showT("Could not save update: "+r.error.message,"err");
    });
    _sb.from("kpis").update({current_progress:updatedKpi.currentProgress,status:updatedKpi.status,follow_up_remarks:updatedKpi.followUpRemarks,updated_at:new Date().toISOString()}).eq("id",kpi.id).then(function(r){
      if(r&&r.error)showT("Could not save KPI progress: "+r.error.message,"err");
    });
    showT("Progress updated!");
  }
  function deleteKpi(kpiId){
    setKpis(function(p){return p.filter(function(k){return k.id!==kpiId;});});
    setKpiUpdates(function(p){return (p||[]).filter(function(u){return u.kpiId!==kpiId;});});
    _sb.from("kpis").delete().eq("id",kpiId).then(function(){});
    _sb.from("kpi_updates").delete().eq("kpi_id",kpiId).then(function(){});
    showT("KPI deleted");
  }

  function needsPro(){
    showT("Admin HR Pro feature. Contact us to upgrade.","err");
  }

  function renderPolicyHub(){
    var policyKeys=Object.keys(POLICY_DEFS);

    function openPolicy(key){
      var existing=policies[key];
      var defaults={};
      POLICY_DEFS[key].fields.forEach(function(f){defaults[f.key]=existing&&existing.fields&&existing.fields[f.key]!==undefined?existing.fields[f.key]:f.def;});
      defaults._customTerms=existing&&existing.customTerms?existing.customTerms:"";
      setPolicyForm(defaults);
      setPolicySel(key);
    }
    function savePolicy(generate){
      if(generate&&!isPaid){
        showT("HR Policies downloads are a Business plan feature","info");
        window.open("https://wa.me/918072293384?text="+encodeURIComponent("Hi, I want to upgrade to Admin HR Business plan for the HR Policy tool"),"_blank");
        return;
      }
      var key=policySel;
      var def=POLICY_DEFS[key];
      var fields={};
      def.fields.forEach(function(f){fields[f.key]=policyForm[f.key]!==undefined&&policyForm[f.key]!==""?policyForm[f.key]:f.def;});
      var customTerms=(policyForm._customTerms||"").trim();
      var updated=Object.assign({},policies,{});
      updated[key]={fields:fields,customTerms:customTerms,updatedAt:new Date().toISOString()};
      setPolicies(updated);
      lsSet("hr_policies",updated);
      showT("Policy saved");
      if(generate)makePolicyPDF(def,fields,org,authPos,authSign,customTerms);
    }
    function downloadHandbook(){
      if(!isPaid){
        showT("HR Policies downloads are a Business plan feature","info");
        window.open("https://wa.me/918072293384?text="+encodeURIComponent("Hi, I want to upgrade to Admin HR Business plan for the HR Policy tool"),"_blank");
        return;
      }
      var created=policyKeys.filter(function(k){return policies[k];});
      if(created.length===0)return showT("Create at least one policy first","err");
      makeHandbookPDF(created.map(function(k){return {def:POLICY_DEFS[k],fields:policies[k].fields,customTerms:policies[k].customTerms};}),org,authPos,authSign);
    }

    // ── Form view ──
    if(policySel){
      var def=POLICY_DEFS[policySel];
      return h("div",{className:"fd"},
        h("div",{style:{display:"flex",alignItems:"center",gap:10,marginBottom:14}},
          h("button",{onClick:function(){setPolicySel(null);},style:{background:SFT,border:"1px solid "+BDR,borderRadius:9,width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}},ic("arrow_back",NVY,17)),
          h("div",null,
            h("div",{style:{fontSize:15,fontWeight:700,color:NVY}},def.label),
            h("div",{style:{fontSize:11,color:GRY}},def.blurb)
          )
        ),
        card(h("div",null,
          h("div",{style:{fontSize:11,fontWeight:700,color:GRY,letterSpacing:.5,marginBottom:10}},"FILL IN THE DETAILS"),
          def.fields.map(function(f){
            return h("div",{key:f.key,style:{marginBottom:12}},
              h("div",{style:{fontSize:11.5,color:NVY,fontWeight:600,marginBottom:5}},f.label),
              f.type==="select"?chipSelect(policyForm[f.key]!==undefined?policyForm[f.key]:f.def,function(v){setPolicyForm(Object.assign({},policyForm,{[f.key]:v}));},f.options):h("input",{type:f.type==="number"?"number":"text",value:policyForm[f.key]!==undefined?policyForm[f.key]:f.def,onChange:function(e){setPolicyForm(Object.assign({},policyForm,{[f.key]:f.type==="number"?Number(e.target.value):e.target.value}));},style:{width:"100%",background:CARD,border:"1.5px solid "+BDR,borderRadius:8,padding:"9px 10px",fontSize:12.5,color:NVY,outline:"none",fontFamily:"inherit"}})
            );
          }),
          h("div",{style:{marginTop:4,marginBottom:12,paddingTop:12,borderTop:"1px dashed "+BDR}},
            h("div",{style:{fontSize:11.5,color:NVY,fontWeight:600,marginBottom:3}},"Additional Company-Specific Terms"),
            h("div",{style:{fontSize:10,color:GRY,marginBottom:6}},"Optional. Anything specific to your business that isn't covered above will be added as a final clause."),
            h("textarea",{value:policyForm._customTerms||"",onChange:function(e){setPolicyForm(Object.assign({},policyForm,{_customTerms:e.target.value}));},rows:3,placeholder:def.customPlaceholder||"e.g. A specific rule your business follows that isn't covered above.",style:{width:"100%",background:CARD,border:"1.5px solid "+BDR,borderRadius:8,padding:"9px 10px",fontSize:12.5,color:NVY,outline:"none",fontFamily:"inherit",resize:"vertical"}})
          ),
          h("div",{style:{display:"flex",gap:8,marginTop:6}},
            h("button",{onClick:function(){savePolicy(false);},style:{flex:1,background:SFT,border:"1px solid "+BDR,borderRadius:10,padding:"11px",color:NVY,fontSize:12.5,fontWeight:700,cursor:"pointer"}},"Save"),
            h("button",{onClick:function(){savePolicy(true);},style:{flex:1.4,display:"flex",alignItems:"center",justifyContent:"center",gap:6,background:ACCENT,border:"none",borderRadius:10,padding:"11px",color:ACCENT_FG,fontSize:12.5,fontWeight:700,cursor:"pointer"}},ic(isPaid?"download":"lock",ACCENT_FG,15),isPaid?"Save & Download PDF":"Save & Download (Business plan)")
          )
        )),
        policyKeys.indexOf(policySel)===2?h("div",{style:{background:AMB+"12",border:"1px solid "+AMB+"35",borderRadius:10,padding:"10px 12px",fontSize:11,color:AMB,marginTop:2}},
          ic("info",AMB,13),"  This is a statutory policy. We recommend having a legal professional review your Internal Committee composition before circulating this document."
        ):null
      );
    }

    // ── List view ──
    return h("div",{className:"fd"},
      h("div",{style:{display:"flex",alignItems:"center",gap:10,marginBottom:4}},
        h("button",{onClick:function(){setShowPolicyHub(false);},style:{background:SFT,border:"1px solid "+BDR,borderRadius:9,width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}},ic("arrow_back",NVY,17)),
        h("div",null,
          h("div",{style:{fontSize:16,fontWeight:700,color:NVY}},"HR Policies"),
          h("div",{style:{fontSize:11,color:GRY}},"Create or update your company's HR policy documents")
        )
      ),
      h("div",{style:{margin:"14px 0"}},
        policyKeys.map(function(key){
          var def=POLICY_DEFS[key];
          var created=policies[key];
          var infoOpen=policyInfoOpen===key;
          return h("div",{key:key,style:{background:CARD,border:"1px solid "+BDR,borderRadius:14,marginBottom:9,boxShadow:T.SHADOW,overflow:"hidden"}},
            h("div",{onClick:function(){openPolicy(key);},style:{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",cursor:"pointer"}},
              h("div",{style:{width:40,height:40,borderRadius:11,background:def.color+"16",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}},ic(def.icon,def.color,20)),
              h("div",{style:{flex:1,minWidth:0}},
                h("div",{style:{display:"flex",alignItems:"center",gap:5}},
                  h("div",{style:{fontSize:13,fontWeight:700,color:NVY}},def.label),
                  h("button",{onClick:function(e){e.stopPropagation();setPolicyInfoOpen(infoOpen?null:key);},style:{background:"none",border:"none",padding:0,cursor:"pointer",display:"flex",alignItems:"center",flexShrink:0}},ic("info",infoOpen?ACCENT:GRY,14))
                ),
                h("div",{style:{fontSize:10.5,color:GRY,marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}},def.blurb)
              ),
              h("div",{style:{textAlign:"right",flexShrink:0}},
                created?h("div",{style:{fontSize:9,fontWeight:700,color:GRN,background:GRN+"14",borderRadius:8,padding:"3px 8px",marginBottom:2}},"CREATED"):h("div",{style:{fontSize:9,fontWeight:700,color:GRY,background:SFT,borderRadius:8,padding:"3px 8px",marginBottom:2}},"NOT CREATED"),
                created?h("div",{style:{fontSize:9,color:GRY}},new Date(created.updatedAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})):null
              )
            ),
            infoOpen?h("div",{style:{padding:"0 14px 12px 14px",background:SFT}},
              h("div",{style:{fontSize:11,color:NVY,lineHeight:1.55,paddingTop:10,borderTop:"1px dashed "+BDR}},def.learnMore)
            ):null
          );
        })
      ),
      policyKeys.some(function(k){return policies[k];})?h("button",{onClick:downloadHandbook,style:{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:7,background:"#3B1F63",border:"none",borderRadius:12,padding:"13px",color:"#fff",fontSize:12.5,fontWeight:700,cursor:"pointer",marginBottom:12}},ic(isPaid?"download":"lock","#fff",16),isPaid?"Download All as Employee Handbook":"Download Handbook (Business plan)"):null,
      h("div",{style:{fontSize:10.5,color:GRY,lineHeight:1.5,padding:"4px 4px 10px"}},
        "These documents follow standard Indian SME practice. For statutory policies (like POSH) or anything that will be legally binding, we recommend a quick review by a legal professional before circulating to your team."
      )
    );
  }

  // ── Recruit hub — Offer/Appointment letters generated from a one-off form, not tied to an existing employee record.
  function renderRecruitHub(){
    var recruitKeys=Object.keys(RECRUIT_DEFS);

    function openRecruit(key){
      var defaults={};
      RECRUIT_DEFS[key].fields.forEach(function(f){defaults[f.key]=f.def;});
      setRecruitForm(defaults);
      setRecruitSel(key);
    }
    function generateRecruitDoc(){
      var def=RECRUIT_DEFS[recruitSel];
      var missing=def.fields.find(function(f){return f.required&&!String(recruitForm[f.key]||"").trim();});
      if(missing)return showT("Please fill: "+missing.label,"err");
      try{
        def.generate(recruitForm,org,authPos,authSign);
      }catch(ex){
        showT("PDF error: "+ex.message,"err");
      }
    }

    // ── Form view ──
    if(recruitSel){
      var def=RECRUIT_DEFS[recruitSel];
      return h("div",{className:"fd"},
        h("div",{style:{display:"flex",alignItems:"center",gap:10,marginBottom:14}},
          h("button",{onClick:function(){setRecruitSel(null);},style:{background:SFT,border:"1px solid "+BDR,borderRadius:9,width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}},ic("arrow_back",NVY,17)),
          h("div",null,
            h("div",{style:{fontSize:15,fontWeight:700,color:NVY}},def.label),
            h("div",{style:{fontSize:11,color:GRY}},def.blurb)
          )
        ),
        card(h("div",null,
          h("div",{style:{fontSize:11,fontWeight:700,color:GRY,letterSpacing:.5,marginBottom:10}},"FILL IN THE DETAILS"),
          def.fields.map(function(f){
            return h("div",{key:f.key,style:{marginBottom:12}},
              h("div",{style:{fontSize:11.5,color:NVY,fontWeight:600,marginBottom:5}},f.label+(f.required?" *":"")),
              f.type==="date"?datePick(recruitForm[f.key],function(v){setRecruitForm(Object.assign({},recruitForm,{[f.key]:v}));},{question:"Choose "+f.label,wrapStyle:{marginBottom:0}})
              :h("input",{type:f.type==="number"?"number":"text",value:recruitForm[f.key]!==undefined?recruitForm[f.key]:f.def,onChange:function(e){setRecruitForm(Object.assign({},recruitForm,{[f.key]:e.target.value}));},style:{width:"100%",background:CARD,border:"1.5px solid "+BDR,borderRadius:8,padding:"9px 10px",fontSize:12.5,color:NVY,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}})
            );
          }),
          h("button",{onClick:generateRecruitDoc,style:{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:6,background:ACCENT,border:"none",borderRadius:10,padding:"12px",color:ACCENT_FG,fontSize:12.5,fontWeight:700,cursor:"pointer",marginTop:6}},ic("download",ACCENT_FG,16),"Download PDF")
        ))
      );
    }

    // ── List view ──
    return h("div",{className:"fd"},
      h("div",{style:{display:"flex",alignItems:"center",gap:10,marginBottom:4}},
        h("button",{onClick:function(){setShowRecruitHub(false);},style:{background:SFT,border:"1px solid "+BDR,borderRadius:9,width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}},ic("arrow_back",NVY,17)),
        h("div",null,
          h("div",{style:{fontSize:16,fontWeight:700,color:NVY}},"Recruit"),
          h("div",{style:{fontSize:11,color:GRY}},"Pre-joining documents for candidates and new joiners")
        )
      ),
      h("div",{style:{margin:"14px 0"}},
        recruitKeys.map(function(key){
          var def=RECRUIT_DEFS[key];
          return h("div",{key:key,style:{background:CARD,border:"1px solid "+BDR,borderRadius:14,marginBottom:9,boxShadow:T.SHADOW,overflow:"hidden"}},
            h("div",{onClick:function(){openRecruit(key);},style:{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",cursor:"pointer"}},
              h("div",{style:{width:40,height:40,borderRadius:11,background:def.color+"16",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}},ic(def.icon,def.color,20)),
              h("div",{style:{flex:1,minWidth:0}},
                h("div",{style:{fontSize:13,fontWeight:700,color:NVY}},def.label),
                h("div",{style:{fontSize:10.5,color:GRY,marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}},def.blurb)
              ),
              ic(ICONS.chev,GRY,18)
            )
          );
        })
      ),
      h("div",{style:{fontSize:10.5,color:GRY,lineHeight:1.5,padding:"4px 4px 10px"}},
        "These don't create or change any employee record — they're standalone documents you fill in and download. Once someone has actually joined, manage their ongoing documents from their employee profile instead."
      )
    );
  }

  function renderDashboard(){
    if(showPolicyHub)return renderPolicyHub();
    if(showRecruitHub)return renderRecruitHub();

    function expiryCountdown(){
      if(!org.expires_on||!isPaid)return null;
      var now=new Date();
      var end=new Date(org.expires_on);
      end.setHours(23,59,59,999);
      var diff=end-now;
      var isExp=diff<=0;
      var dd=Math.max(0,Math.floor(diff/86400000));
      var hh=Math.max(0,Math.floor((diff%86400000)/3600000));
      var mm=Math.max(0,Math.floor((diff%3600000)/60000));
      var ss=Math.max(0,Math.floor((diff%60000)/1000));
      var color=isExp?RED:dd<=3?RED:dd<=7?AMB:GRN;
      var bg=isExp?RED+"15":dd<=3?RED+"12":dd<=7?AMB+"12":GRN+"12";
      return h("div",{style:{background:bg,border:"1px solid "+color+"44",borderRadius:12,padding:"10px 14px",marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center"}},
        h("div",null,
          h("div",{style:{fontSize:10,color:color,fontWeight:700,letterSpacing:.5}},"SUBSCRIPTION "+(isExp?"EXPIRED":"EXPIRES IN")),
          h("div",{style:{fontSize:11,color:GRY,marginTop:1}},isExp?"Please contact support to renew":new Date(org.expires_on).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}))
        ),
        isExp
          ?h("div",{style:{fontSize:12,fontWeight:800,color:RED}},"EXPIRED")
          :h("div",{style:{fontFamily:"monospace",fontSize:14,fontWeight:800,color:color,letterSpacing:1}},
            String(dd).padStart(2,"0")+":"+String(hh).padStart(2,"0")+":"+String(mm).padStart(2,"0")+":"+String(ss).padStart(2,"0")
          ),
          h("div",{style:{fontSize:8,color:color,textAlign:"right",letterSpacing:.5,marginTop:1}},dd>0?"DD:HH:MM:SS":"HH:MM:SS")
      );
    }

    function confirmationBanner(){
      var due=actEmps.filter(function(e){var p=getProbationInfo(e);return p&&!p.confirmed&&(p.due||p.overdue);});
      if(due.length===0)return null;
      var anyOverdue=due.some(function(e){return getProbationInfo(e).overdue;});
      var color=anyOverdue?RED:AMB;
      return h("div",{style:{background:color+"10",border:"1px solid "+color+"33",borderRadius:12,padding:"10px 14px",marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"},onClick:function(){setTab("employees");setSelE(due[0]);}},
        h("div",null,
          h("div",{style:{fontSize:10,color:color,fontWeight:700,letterSpacing:.5}},"CONFIRMATION "+(anyOverdue?"OVERDUE":"DUE SOON")),
          h("div",{style:{fontSize:11,color:GRY,marginTop:1}},due.length+" employee"+(due.length>1?"s":"")+" — "+due.slice(0,3).map(function(e){return e.name;}).join(", ")+(due.length>3?" +"+(due.length-3)+" more":""))
        ),
        ic("chevron_right",color,18)
      );
    }
    var presentCount=actEmps.filter(function(e){return getTAtt(e.id)==="present";}).length;
    var absentCount=actEmps.filter(function(e){return getTAtt(e.id)==="absent";}).length;
    var statCards=[
      {l:"Total Team",v:actEmps.length,ico:"groups",bg:"#EEF2FF",ic:"#4F46E5",s:trmEmps.length>0?trmEmps.length+" offboarded":"All active",big:false,nav:{tab:"employees",icon:"manage_accounts"}},
      {l:"Present Today",v:presentCount,ico:"event_available",bg:"#ECFDF5",ic:"#059669",s:absentCount+" absent today",big:false,nav:{tab:"attendance",icon:"fact_check"}},
      {l:"Gross Payroll",v:fmt(tGross),ico:"business_center",bg:"#FFFBEB",ic:"#D97706",s:MOS[curM]+" "+curY,big:true},
      {l:"Net Payable",v:fmt(tNet),ico:"account_balance_wallet",bg:"#F0F9FF",ic:"#0284C7",s:"after deductions",big:true},
    ];
    var hr=now.getHours(),greet=hr<12?"Good Morning":hr<17?"Good Afternoon":"Good Evening";
    // Pre-compute reminder urgency
    var activeRems=reminders.filter(function(r){return !r.done;});
    var doneRems=reminders.filter(function(r){return r.done;});
    var urgentRems=activeRems.filter(function(r){if(!r.date)return false;var diff=Math.ceil((new Date(r.date)-now)/86400000);return diff<=1;});
    var bdayUrgent=bRemind.some(function(e){var dob=new Date(e.dob),tdDate=new Date(now.getFullYear(),now.getMonth(),now.getDate()),bday=new Date(now.getFullYear(),dob.getMonth(),dob.getDate());if(bday<tdDate)bday.setFullYear(now.getFullYear()+1);return Math.ceil((bday-tdDate)/86400000)<=1;});
    var showRemSection=true; // Always show reminder card so user can add reminders
    return h("div",{className:"fd"},
      !onboardDone?renderOnboarding():null,
      h("div",{style:{background:NVY,borderRadius:18,padding:"18px 18px 20px",marginBottom:14,position:"relative",overflow:"hidden",boxShadow:T.SHADOW_LG}},
        h("div",{style:{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)"}},greetIconSVG(hr,now.getMinutes())),
        h("div",{style:{fontSize:11,color:CARD,opacity:.65,marginBottom:3,fontWeight:500,maxWidth:"75%",display:"flex",gap:6,alignItems:"baseline"}},
          h("span",null,now.toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long"})),
          h("span",{style:{opacity:.7,fontVariantNumeric:"tabular-nums"}},timeStr)
        ),
        h("div",{style:{fontSize:22,fontWeight:600,color:CARD,letterSpacing:-.3,maxWidth:"75%"}},greet),
        h("div",{style:{fontSize:11,color:CARD,opacity:.7,marginTop:3,fontWeight:500,maxWidth:"75%"}},org.position+" \u2022 "+org.name)
      ),
      expiryCountdown(),
      confirmationBanner(),
      h("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}},
        statCards.map(function(s,i){
          return h("div",{key:i,style:{
            background:CARD,
            border:"1px solid "+BDR,
            borderRadius:9,
            padding:s.big?"6px 8px":(s.nav?"6px 32px 5px 8px":"6px 8px 5px"),
            boxShadow:themeMode==="light"?"0 1px 4px rgba(15,23,42,.04)":"0 1px 3px rgba(0,0,0,.15)",
            position:"relative",overflow:"hidden"
          }},
            s.nav?h("button",{onClick:function(){setTab(s.nav.tab);},style:{position:"absolute",top:"50%",right:6,transform:"translateY(-50%)",width:26,height:26,borderRadius:8,background:SFT,border:"1px solid "+BDR,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",padding:0}},ic(s.nav.icon,GRY,15)):null,
            s.big?[
              h("div",{key:"r",style:{display:"flex",alignItems:"center",gap:4,marginBottom:3}},
                h("div",{style:{width:22,height:22,borderRadius:6,background:s.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}},ic(s.ico,s.ic,11)),
                h("div",{style:{fontSize:8,fontWeight:700,color:GRY,letterSpacing:.4,lineHeight:1.2}},s.l.toUpperCase())
              ),
              !dashFresh?h("div",{key:"v",style:{height:22,width:"60%",borderRadius:4,background:SFT,marginBottom:3,animation:"pulse 1.2s ease-in-out infinite"}}):h("div",{key:"v",style:{fontSize:22,fontWeight:900,color:NVY,letterSpacing:-.5,lineHeight:1,marginBottom:3,marginLeft:5,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}},s.v),
              h("div",{key:"s",style:{fontSize:9,color:GRY,fontWeight:500}},s.s)
            ]:[
              h("div",{key:"r",style:{display:"flex",alignItems:"center",gap:6,marginBottom:2}},
                h("div",{style:{width:20,height:20,borderRadius:6,background:s.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}},ic(s.ico,s.ic,10)),
                !dashFresh?h("div",{style:{height:14,width:"40%",borderRadius:4,background:SFT,animation:"pulse 1.2s ease-in-out infinite"}}):h("div",{style:{fontSize:15,fontWeight:900,color:NVY,letterSpacing:-.5,lineHeight:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}},s.v)
              ),
              h("div",{key:"l",style:{fontSize:8,fontWeight:700,color:GRY,letterSpacing:.4,lineHeight:1.2,marginBottom:2}},s.l.toUpperCase()),
              h("div",{key:"s",style:{fontSize:9,color:GRY,fontWeight:500}},s.s)
            ]
          );
        })
      ),
      h("div",{style:{display:"flex",gap:10,marginBottom:12}},
        h("div",{onClick:function(){setShowPolicyHub(true);},style:{flex:1,background:NVY,borderRadius:14,padding:"12px 13px",display:"flex",alignItems:"center",gap:9,cursor:"pointer",boxShadow:"0 4px 18px rgba(0,0,0,.3)",position:"relative",overflow:"hidden",border:"1px solid "+(themeMode==="light"?"rgba(255,255,255,.12)":"rgba(0,0,0,.12)")}},
          h("div",{style:{position:"absolute",top:0,bottom:0,width:"35%",background:"linear-gradient(90deg,transparent,"+(themeMode==="light"?"rgba(255,255,255,.18)":"rgba(0,0,0,.10)")+",transparent)",animation:"shineSweep 3.2s ease-in-out infinite",pointerEvents:"none"}}),
          h("div",{style:{width:34,height:34,borderRadius:10,background:themeMode==="light"?"rgba(255,255,255,.14)":"rgba(0,0,0,.08)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,position:"relative"}},
            ic("contract_edit",CARD,17)
          ),
          h("div",{style:{flex:1,minWidth:0,position:"relative"}},
            h("div",{style:{fontSize:12.5,fontWeight:700,color:CARD}},"HR Policies"),
            h("div",{style:{fontSize:9,color:CARD,opacity:.6,marginTop:1,lineHeight:1.25}},isPaid?"Create or update policies":"Business plan")
          )
        ),
        h("div",{onClick:function(){setShowRecruitHub(true);},style:{flex:1,background:NVY,borderRadius:14,padding:"12px 13px",display:"flex",alignItems:"center",gap:9,cursor:"pointer",boxShadow:"0 4px 18px rgba(0,0,0,.3)",position:"relative",overflow:"hidden",border:"1px solid "+(themeMode==="light"?"rgba(255,255,255,.12)":"rgba(0,0,0,.12)")}},
          h("div",{style:{position:"absolute",top:0,bottom:0,width:"35%",background:"linear-gradient(90deg,transparent,"+(themeMode==="light"?"rgba(255,255,255,.18)":"rgba(0,0,0,.10)")+",transparent)",animation:"shineSweep 3.2s ease-in-out infinite",pointerEvents:"none"}}),
          h("div",{style:{width:34,height:34,borderRadius:10,background:themeMode==="light"?"rgba(255,255,255,.14)":"rgba(0,0,0,.08)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,position:"relative"}},
            ic("person_search",CARD,17)
          ),
          h("div",{style:{flex:1,minWidth:0,position:"relative"}},
            h("div",{style:{fontSize:12.5,fontWeight:700,color:CARD}},"Recruit"),
            h("div",{style:{fontSize:9,color:CARD,opacity:.6,marginTop:1,lineHeight:1.25}},"Offer & Appointment letters")
          )
        )
      ),
      showRemSection?h("div",{style:{marginBottom:12}},
        bRemind.length>0?h("div",{style:{borderRadius:12,padding:12,marginBottom:8,border:"1.5px solid #FCD34D",animation:bdayUrgent?"blinkBorder 1.2s ease-in-out infinite":"none",background:T.PILL_WARN_SOFT}},
          h("div",{style:{display:"flex",alignItems:"center",gap:6,marginBottom:8}},
            ic("cake",AMB,15),
            h("div",{style:{fontSize:12,fontWeight:700,color:NVY}},"Upcoming Birthdays")
          ),
          bRemind.map(function(emp){
            var dob=new Date(emp.dob),tdDate=new Date(now.getFullYear(),now.getMonth(),now.getDate()),bday=new Date(now.getFullYear(),dob.getMonth(),dob.getDate());
            if(bday<tdDate)bday.setFullYear(now.getFullYear()+1);
            var diff=Math.ceil((bday-tdDate)/86400000);
            var urgent=diff<=1;
            return h("div",{key:emp.id,style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0",borderBottom:"1px solid "+BDR,animation:urgent?"blinkBg 1.2s ease-in-out infinite":"none",borderRadius:urgent?6:0,paddingLeft:urgent?6:0}},
              h("div",{style:{display:"flex",alignItems:"center",gap:7}},
                av(emp,26),
                h("div",null,
                  h("div",{style:{fontSize:12,fontWeight:600,color:NVY}},emp.name),
                  h("div",{style:{fontSize:10,fontWeight:600,color:urgent?RED:AMB}},diff===0?"Today! \uD83C\uDF82":diff===1?"Tomorrow!":dob.toLocaleDateString("en-IN",{day:"numeric",month:"short"})+" ("+diff+"d)")
                )
              ),
              h("button",{onClick:function(){setSkipB(function(p){return p.concat([emp.id]);});},style:{background:"none",border:"1px solid "+BDR,borderRadius:6,padding:"2px 8px",fontSize:10,color:GRY,cursor:"pointer"}},"Skip")
            );
          })
        ):null,
        annivRemind.length>0?h("div",{style:{borderRadius:12,padding:12,marginBottom:8,border:"1.5px solid #A5B4FC",background:"#EEF2FF"}},
          h("div",{style:{display:"flex",alignItems:"center",gap:6,marginBottom:8}},
            ic("workspace_premium","#4F46E5",15),
            h("div",{style:{fontSize:12,fontWeight:700,color:NVY}},"Work Anniversaries")
          ),
          annivRemind.map(function(a){
            var urgent=a.diff<=1;
            return h("div",{key:a.emp.id,style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0",borderBottom:"1px solid #C7D2FE",animation:urgent?"blinkBg 1.2s ease-in-out infinite":"none",borderRadius:urgent?6:0,paddingLeft:urgent?6:0}},
              h("div",{style:{display:"flex",alignItems:"center",gap:7}},
                av(a.emp,26),
                h("div",null,
                  h("div",{style:{fontSize:12,fontWeight:600,color:NVY}},a.emp.name),
                  h("div",{style:{fontSize:10,fontWeight:600,color:urgent?RED:"#4F46E5"}},
                    a.years+" year"+(a.years>1?"s":"")+" \u2022 "+(a.diff===0?"Today! \uD83C\uDF89":a.diff===1?"Tomorrow!":a.anniv.toLocaleDateString("en-IN",{day:"numeric",month:"short"})+" ("+a.diff+"d)")
                  )
                )
              )
            );
          })
        ):null,
        bRemind.length===0&&annivRemind.length===0?h("div",{style:{background:SFT,borderRadius:12,padding:"10px 14px",marginBottom:8,border:"1px solid "+BDR,display:"flex",alignItems:"center",gap:8}},
          ic("event_available",GRY,15),
          h("div",{style:{fontSize:12,color:GRY}},"No upcoming birthdays or anniversaries in the next 30 days")
        ):null,
        h("div",{style:{background:CARD,border:"1.5px solid "+(urgentRems.length>0?RED:BDR),borderRadius:12,padding:12,animation:urgentRems.length>0?"blinkBorder 1.2s ease-in-out infinite":"none"}},
          h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:activeRems.length>0||remOpen?10:0}},
            h("div",{style:{display:"flex",alignItems:"center",gap:6}},
              ic("notifications",urgentRems.length>0?RED:NVY,15),
              h("div",{style:{fontSize:12,fontWeight:700,color:NVY}},"Reminders"+(activeRems.length>0?" ("+activeRems.length+")":""))
            ),
            h("button",{onClick:function(){setRemOpen(function(v){return !v;});},style:{background:remOpen?ACCENT:SFT,border:"1px solid "+BDR,borderRadius:7,padding:"3px 9px",fontSize:11,color:remOpen?ACCENT_FG:NVY,fontWeight:600,cursor:"pointer"}},remOpen?"Cancel":"+ Add")
          ),
          remOpen?h("div",{style:{marginBottom:10,background:SFT,borderRadius:9,padding:10}},
            h("input",{value:remTxt,onChange:function(e){setRemTxt(e.target.value);},placeholder:"Reminder text...",style:{width:"100%",background:CARD,border:"1.5px solid "+BDR,borderRadius:8,padding:"8px 10px",fontSize:12,color:NVY,outline:"none",fontFamily:"inherit",marginBottom:7}}),
            h("div",{style:{display:"flex",gap:7}},
              datePick(remDate,function(v){setRemDate(v);},{question:"Reminder date",wrapStyle:{flex:1,marginBottom:0}}),
              h("button",{onClick:function(){
                if(!remTxt.trim())return showT("Enter reminder text","err");
                setReminders(function(p){return p.concat([{id:Date.now(),text:remTxt.trim(),date:remDate||"",done:false}]);});
                setRemTxt("");setRemDate("");setRemOpen(false);showT("Reminder added!");
              },style:{background:NVY,border:"none",borderRadius:8,padding:"8px 14px",color:CARD,fontSize:12,fontWeight:700,cursor:"pointer"}},"Add")
            )
          ):null,
          activeRems.length===0&&!remOpen?h("div",{style:{textAlign:"center",padding:"8px 0",color:GRY,fontSize:11}},"No active reminders"):null,
          activeRems.map(function(r){
            var rdiff=r.date?Math.ceil((new Date(r.date)-now)/86400000):null;
            var rurgent=rdiff!==null&&rdiff<=1;
            return h("div",{key:r.id,style:{display:"flex",alignItems:"flex-start",gap:8,padding:"7px 0",borderBottom:"1px solid "+BDR,animation:rurgent?"blinkBg 1.2s ease-in-out infinite":"none",borderRadius:rurgent?6:0,paddingLeft:rurgent?4:0}},
              h("button",{onClick:function(){setReminders(function(p){return p.map(function(x){return x.id===r.id?Object.assign({},x,{done:true}):x;});});},title:"Mark done",style:{width:18,height:18,borderRadius:4,border:"2px solid "+BDR,background:"none",cursor:"pointer",flexShrink:0,marginTop:1,display:"flex",alignItems:"center",justifyContent:"center"}}),
              h("div",{style:{flex:1}},
                h("div",{style:{fontSize:12,color:NVY,fontWeight:500,lineHeight:1.4}},r.text),
                r.date?h("div",{style:{fontSize:10,fontWeight:600,color:rurgent?RED:GRY,marginTop:2}},rdiff===0?"Today!":rdiff===1?"Tomorrow!":rdiff<0?"Overdue by "+Math.abs(rdiff)+"d":r.date):null
              ),
              h("button",{onClick:function(){if(window.confirm("Delete this reminder?"))setReminders(function(p){return p.filter(function(x){return x.id!==r.id;});});},style:{background:"none",border:"none",cursor:"pointer",padding:0,flexShrink:0}},ic("close",GRY,14))
            );
          }),
          doneRems.length>0?h("div",{style:{marginTop:8,paddingTop:6,borderTop:"1px dashed "+BDR}},
            h("div",{style:{fontSize:10,color:GRY,fontWeight:600,marginBottom:4}},"COMPLETED ("+doneRems.length+")"),
            doneRems.map(function(r){
              return h("div",{key:r.id,style:{display:"flex",alignItems:"center",gap:8,padding:"4px 0",opacity:.55}},
                h("div",{style:{width:18,height:18,borderRadius:4,background:GRN,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}},ic("check","#fff",12)),
                h("div",{style:{flex:1,fontSize:11,color:GRY,textDecoration:"line-through"}},r.text),
                h("button",{onClick:function(){setReminders(function(p){return p.filter(function(x){return x.id!==r.id;});});},style:{background:"none",border:"none",cursor:"pointer",padding:0}},ic("close",GRY,12))
              );
            })
          ):null
        )
      ):null,
      card(h("div",null,
        h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:9}},
          h("div",{style:{fontSize:12,fontWeight:700,color:NVY}},"Statutory Summary"),
          h("button",{onClick:function(){setTab("settings");setSettTab("tax");},style:{fontSize:11,color:NVY,background:SFT,border:"1px solid "+BDR,borderRadius:6,padding:"3px 8px",cursor:"pointer",fontWeight:600}},"Tax Slabs")
        ),
        (function(){var tot=actEmps.reduce(function(a,e){var ma=mAtt(e.id,curY,curM),inc=getInc(e.id,curY,curM),payWD=getWorkingDays(att,e.id,curY,curM),d=calcPay(getEffectiveEmp(e,curY,curM),ma.absent,ma.half,ma.unpaid,inc,getShiftAllow(e.id,curY,curM),payWD,proRata(e,curY,curM).active,proRata(e,curY,curM).total);a.pf+=d.pfE+d.pfR;a.esi+=d.esiE+d.esiR;a.pt+=d.pt;a.td+=d.tds;return a;},{pf:0,esi:0,pt:0,td:0});
          var nowD2=new Date();
          var eligCount=actEmps.filter(function(e){return calcGratuity(getEffectiveEmp(e,nowD2.getFullYear(),nowD2.getMonth())).eligible;}).length;
          var totalGrat=actEmps.reduce(function(a,e){return a+calcGratuity(getEffectiveEmp(e,nowD2.getFullYear(),nowD2.getMonth())).amount;},0);
          return[["PF (Emp+Er)",fmt(tot.pf),NVY],["ESI (Emp+Er)",fmt(tot.esi),TEL],["Prof. Tax",fmt(tot.pt),AMB],["TDS",fmt(tot.td),RED],["Gratuity Accrued",fmt(totalGrat)+(eligCount>0?" ("+eligCount+" eligible)":""),GRN]].map(function(item){return row(item[0],item[1],item[2]);});
        })()
      ),0),
      renderComplianceCard()
    );
  }


  function renderEmployees(){
    if(selE&&!editE&&!offE)return renderEmpDetail();
    if(editE)return renderEditEmp();
    if(offE)return renderOffboard();
    var q=searchQ.trim().toLowerCase();
    var filteredEmps=(q?actEmps.filter(function(e){return(e.name||"").toLowerCase().includes(q)||(e.role||"").toLowerCase().includes(q)||(e.dept||"").toLowerCase().includes(q)||(e.eid||"").toLowerCase().includes(q);}):actEmps).filter(function(e){return empSalFilter==="all"?true:e.salaryType===empSalFilter||(empSalFilter==="split"&&!e.salaryType);});
    // ── Over-limit: sort active emps by join date, last added = suspended first ──
    var activeLimit=empLimit||5;
    var sortedActive=actEmps.slice().sort(function(a,b){return new Date(a.joined||0)-new Date(b.joined||0);});
    var allowedEmpIds=sortedActive.slice(0,activeLimit).map(function(e){return e.id;});
    function isOverLimit(e){return actEmps.length>activeLimit&&allowedEmpIds.indexOf(e.id)===-1;}
    var empCountLabel=filteredEmps.length+(q?" found":" MEMBERS");
    return h("div",{className:"fd"},
      h("div",{style:{background:CARD,border:"1px solid "+BDR,borderRadius:11,padding:3,display:"flex",gap:3,marginBottom:11}},
        [["active","Active"],["terminated","Offboarded"]].map(function(item){return h("button",{key:item[0],onClick:function(){setEmpTab(item[0]);},style:{flex:1,background:empTab===item[0]?ACCENT:"transparent",border:"none",borderRadius:9,padding:"8px",color:empTab===item[0]?ACCENT_FG:GRY,fontSize:12,fontWeight:600,cursor:"pointer"}},item[1]);})
      ),
      empTab==="active"?h("div",null,
        /* Salary type filter */
        h("div",{style:{display:"flex",gap:6,marginBottom:10}},
          [["all","All"],["split","Split"],["fixed","Fixed"]].map(function(f){
            var active=empSalFilter===f[0];
            return h("button",{key:f[0],onClick:function(){setEmpSalFilter(f[0]);},
              style:{background:active?NVY:SFT,border:"1px solid "+(active?NVY:BDR),borderRadius:20,padding:"5px 12px",fontSize:10,fontWeight:active?700:500,color:active?CARD:GRY,cursor:"pointer"}},f[1]);
          })
        ),
        // Over-limit warning
        actEmps.length>(empLimit||5)?h("div",{style:{background:RED+"10",border:"1px solid "+RED+"33",borderRadius:12,padding:"10px 14px",marginBottom:10,display:"flex",gap:8,alignItems:"flex-start"}},
          ic("warning",RED,16),
          h("div",null,
            h("div",{style:{fontSize:12,fontWeight:700,color:RED}},actEmps.length+" employees — Plan limit: "+(empLimit||5)),
            h("div",{style:{fontSize:11,color:GRY,marginTop:2}},"Last "+(actEmps.length-(empLimit||5))+" employee(s) suspended. Contact us to upgrade your limit.")
          )
        ):null,
        h("div",{style:{display:"flex",gap:9,marginBottom:11}},
          h("div",{style:{flex:1,background:CARD,border:"1px solid "+BDR,borderRadius:12,padding:"11px 14px",display:"flex",gap:8,alignItems:"center",boxShadow:T.SHADOW}},
            ic("search",GRY,16),
            h("input",{value:searchQ,onChange:function(ev){setSearchQ(ev.target.value);},placeholder:"Search by name, role, dept...",style:{flex:1,fontSize:13,color:NVY,border:"none",background:"transparent",outline:"none",fontFamily:"inherit"}}),
            searchQ?h("button",{onClick:function(){setSearchQ("");},style:{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",padding:0}},ic("close",GRY,16)):null
          ),
          h("button",{onClick:function(){setAddOpen(true);setStep(1);},style:{background:NVY,border:"none",borderRadius:12,padding:"0 14px",color:CARD,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}},ic(ICONS.plus,CARD,22)),
null
        ),
        // ── Sort bar — A-Z/Seniority/Salary ordering, plus an independent Group-by-Department toggle ──
        h("div",{style:{display:"flex",gap:5,marginBottom:8,overflowX:"auto"}},
          [["name","A–Z"],["joined","Seniority"],["monthlyCTC","Salary"]].map(function(item){
            var active=empSort===item[0];
            return h("button",{key:item[0],onClick:function(){
              if(active)setEmpSortDir(function(d){return d==="asc"?"desc":"asc";});
              else{setEmpSort(item[0]);setEmpSortDir("asc");}
            },style:{flexShrink:0,display:"flex",alignItems:"center",gap:3,background:active?ACCENT:CARD,border:"1px solid "+(active?ACCENT:BDR),borderRadius:20,padding:"4px 10px",color:active?ACCENT_FG:GRY,fontSize:11,fontWeight:active?700:500,cursor:"pointer",whiteSpace:"nowrap"}},
              item[1],
              active?h("span",{style:{fontSize:10}},empSortDir==="asc"?"↑":"↓"):null
            );
          }),
          h("div",{style:{width:1,background:BDR,flexShrink:0,margin:"3px 2px"}}),
          h("button",{onClick:function(){setTeamGroupDept(!teamGroupDept);},style:{flexShrink:0,display:"flex",alignItems:"center",gap:4,background:teamGroupDept?ACCENT:CARD,border:"1px solid "+(teamGroupDept?ACCENT:BDR),borderRadius:20,padding:"4px 10px",color:teamGroupDept?ACCENT_FG:GRY,fontSize:11,fontWeight:teamGroupDept?700:500,cursor:"pointer",whiteSpace:"nowrap"}},ic("groups",teamGroupDept?ACCENT_FG:GRY,12),"Group by Dept")
        ),
        h("div",{style:{fontSize:11,color:GRY,marginBottom:9,fontWeight:500,letterSpacing:.3}},empCountLabel),
        q&&filteredEmps.length===0?h("div",{style:{textAlign:"center",padding:32,color:GRY,fontSize:13}},'No results for "'+searchQ+'"'):null,
        (function(){
          var sorted=filteredEmps.slice().sort(function(a,b){
            var av2,bv2;
            // Group-by-Department takes priority when ON — departments are always A-Z, then the chosen ordering applies within each
            if(teamGroupDept){
              var ad=(a.dept||"No Department").toLowerCase(),bd=(b.dept||"No Department").toLowerCase();
              if(ad!==bd)return ad.localeCompare(bd);
            }
            if(empSort==="name"){av2=(a.name||"").toLowerCase();bv2=(b.name||"").toLowerCase();return empSortDir==="asc"?av2.localeCompare(bv2):bv2.localeCompare(av2);}
            if(empSort==="joined"){av2=a.joined||"9999";bv2=b.joined||"9999";return empSortDir==="asc"?av2.localeCompare(bv2):bv2.localeCompare(av2);}
            if(empSort==="monthlyCTC"){av2=Number(a.monthlyCTC)||0;bv2=Number(b.monthlyCTC)||0;return empSortDir==="asc"?av2-bv2:bv2-av2;}
            return 0;
          });
          return sorted;
        })().map(function(e,idx,arr){
          var ma=mAtt(e.id,curY,curM),inc=getInc(e.id,curY,curM),payWD=getWorkingDays(att,e.id,curY,curM),d=calcPay(getEffectiveEmp(e,curY,curM),ma.absent,ma.half,ma.unpaid,inc,getShiftAllow(e.id,curY,curM),payWD,proRata(e,curY,curM).active,proRata(e,curY,curM).total);
          var overLim=isOverLimit(e);
          // When sorted by Dept, show a department header whenever the department changes
          var deptHeader=null;
          if(teamGroupDept){
            var curDept=e.dept||"No Department";
            var prevDept=idx>0?(arr[idx-1].dept||"No Department"):null;
            if(curDept!==prevDept){
              var deptCount=arr.filter(function(x){return (x.dept||"No Department")===curDept;}).length;
              deptHeader=h("div",{key:"hdr-"+curDept,style:{display:"flex",alignItems:"center",gap:8,margin:idx===0?"0 0 8px":"16px 0 8px"}},
                h("div",{style:{fontSize:11,fontWeight:700,color:NVY,letterSpacing:.3}},curDept),
                h("div",{style:{flex:1,height:1,background:BDR}}),
                h("div",{style:{fontSize:10,color:GRY,fontWeight:600,background:SFT,borderRadius:10,padding:"2px 8px"}},deptCount)
              );
            }
          }
          return h(React.Fragment,{key:e.id},deptHeader,h("div",{className:"rh",onClick:function(){if(!overLim)setSelE(e);},style:{background:overLim?SFT:CARD,border:"1px solid "+(overLim?RED+"33":BDR),borderRadius:14,padding:"11px 13px",display:"flex",gap:11,alignItems:"center",marginBottom:8,boxShadow:T.SHADOW,cursor:overLim?"default":"pointer",opacity:overLim?.65:1}},
            av(e,40),
            h("div",{style:{flex:1,minWidth:0}},
              h("div",{style:{fontSize:14,fontWeight:600,color:NVY,letterSpacing:-.1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}},e.name),
              overLim?h("div",{style:{display:"flex",alignItems:"center",gap:5,marginTop:3}},
                h("div",{style:{fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:10,background:RED+"15",color:RED}},"Suspended — Plan limit reached"),
                ic("lock",RED,11)
              ):h("div",{style:{fontSize:11,color:GRY,marginTop:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}},e.role||"No designation")
            ),
            overLim?null:h("div",{style:{display:"flex",gap:6,alignItems:"center"}},
              e.mob?h("button",{onClick:function(ev){ev.stopPropagation();window.location.href="tel:"+e.mob;},style:{width:34,height:34,borderRadius:9,background:"#10B98112",border:"1px solid #10B98125",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}},ic("phone","#10B981",15)):null,
              e.mob?h("button",{onClick:function(ev){ev.stopPropagation();window.open("https://wa.me/91"+String(e.mob).replace(/\D/g,""),"_blank");},style:{width:34,height:34,borderRadius:9,background:"#25D36612",border:"1px solid #25D36625",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}},ic("whatsapp","#25D366",19)):null,
              e.email?h("button",{onClick:function(ev){ev.stopPropagation();window.location.href="mailto:"+e.email;},style:{width:34,height:34,borderRadius:9,background:"#2563EB12",border:"1px solid #2563EB25",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}},ic("mail","#2563EB",15)):null,
              h("div",{style:{width:24,height:24,display:"flex",alignItems:"center",justifyContent:"center"}},ic(ICONS.chev,GRY,16))
            )
          ));
        })
      ):h("div",null,
        // ── Scheduled to leave — still active, will auto-offboard on their last working date ──
        (function(){
          var pending=emps.filter(function(e){return e.status==="active"&&e.pendingOffboard&&e.pendingOffboard.resignDate;});
          if(pending.length===0)return null;
          return h("div",{style:{marginBottom:14}},
            h("div",{style:{fontSize:11,fontWeight:700,color:AMB,marginBottom:8}},pending.length+" scheduled to leave (still active until their last day)"),
            pending.map(function(e){
              return h("div",{key:e.id,style:{background:AMB+"0D",border:"1px solid "+AMB+"35",borderRadius:13,padding:"12px 13px",marginBottom:8}},
                h("div",{style:{display:"flex",gap:10,alignItems:"center"}},
                  av(e),
                  h("div",{style:{flex:1}},
                    h("div",{style:{fontSize:13,fontWeight:700,color:NVY}},e.name),
                    h("div",{style:{fontSize:11,color:GRY}},e.role+" | "+e.dept),
                    h("div",{style:{fontSize:10,color:AMB,marginTop:1}},"Last working day: "+e.pendingOffboard.resignDate)
                  ),
                  h("div",{style:{fontSize:9,fontWeight:700,padding:"3px 8px",borderRadius:14,background:T.PILL_WARN_BG,color:AMB}},"Active")
                )
              );
            })
          );
        })(),
        h("div",{style:{fontSize:11,color:GRY,marginBottom:8}},trmEmps.length+" offboarded"),
        trmEmps.length===0?h("div",{style:{textAlign:"center",padding:28,color:GRY,fontSize:13}},"No offboarded employees"):null,
        trmEmps.map(function(e){
          var expanded=offExpandId===e.id;
          return h("div",{key:e.id,style:{background:CARD,border:"1px solid "+BDR,borderRadius:13,padding:"12px 13px",marginBottom:8}},
            h("div",{onClick:function(){setOffExpandId(expanded?null:e.id);},style:{display:"flex",gap:10,alignItems:"center",marginBottom:7,cursor:"pointer"}},
              av(e),
              h("div",{style:{flex:1}},h("div",{style:{fontSize:13,fontWeight:700,color:NVY}},e.name),h("div",{style:{fontSize:11,color:GRY}},e.role+" | "+e.dept),h("div",{style:{fontSize:10,color:RED,marginTop:1}},(e.status==="resigned"?"Resigned":"Terminated")+" - "+e.terminatedOn),e.resignDate?h("div",{style:{fontSize:10,color:GRY}},"Last day: "+e.resignDate):null),
              h("div",{style:{fontSize:9,fontWeight:700,padding:"3px 8px",borderRadius:14,background:e.status==="resigned"?T.PILL_WARN_BG:T.PILL_DANGER_BG,color:e.status==="resigned"?AMB:RED}},e.status),
              ic(expanded?"expand_less":"expand_more",GRY,18)
            ),
            expanded?h("div",{style:{background:SFT,borderRadius:8,padding:"10px 11px",marginBottom:8,fontSize:11,color:GRY,lineHeight:1.6}},
              h("div",null,h("b",{style:{color:NVY}},"Employee ID: "),e.eid||"-"),
              h("div",null,h("b",{style:{color:NVY}},"Joined: "),e.joined||"-"),
              h("div",null,h("b",{style:{color:NVY}},"Monthly CTC: "),fmt(e.monthlyCTC||0)),
              e.terminationData?h("div",null,h("b",{style:{color:NVY}},"Reason: "),e.terminationData.reason):null,
              e.terminationData&&e.terminationData.note?h("div",null,h("b",{style:{color:NVY}},"Note: "),e.terminationData.note):null,
              e.terminationData&&e.terminationData.handover&&e.terminationData.handover.length>0?h("div",null,h("b",{style:{color:NVY}},"Handover: "),e.terminationData.handover.join(", ")):null,
              e.mob?h("div",null,h("b",{style:{color:NVY}},"Mobile: "),e.mob):null,
              e.email?h("div",null,h("b",{style:{color:NVY}},"Email: "),e.email):null
            ):null,
            h("div",{style:{display:"flex",gap:6,marginBottom:6}},
              e.status==="terminated"?h("button",{onClick:function(){issueTermination(e);},style:{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:5,background:T.PILL_DANGER_BG,border:"1px solid "+RED,borderRadius:8,padding:"7px",color:RED,fontSize:11.5,fontWeight:700,cursor:"pointer"}},ic("gavel",RED,12),"Termination Letter"):null,
              h("button",{onClick:function(){issueFnFSettlement(e);},style:{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:5,background:"#0D9488"+"12",border:"1px solid #0D948850",borderRadius:8,padding:"7px",color:"#0D9488",fontSize:11.5,fontWeight:700,cursor:"pointer"}},ic("receipt_long","#0D9488",12),"F&F Settlement")
            ),
            h("div",{style:{display:"flex",gap:6}},
              h("button",{onClick:function(){if(window.confirm(e.name+" will be marked active again and removed from the offboarded list. Continue?"))rejoinEmp(e.id);},style:{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:5,background:T.PILL_OK_BG,border:"1px solid "+GRN,borderRadius:8,padding:"7px",color:GRN,fontSize:12,fontWeight:700,cursor:"pointer"}},ic("refresh",GRN,13),"Rejoin"),
              h("button",{onClick:function(){if(window.confirm("Delete permanently?"))removeEmp(e.id);},style:{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:5,background:T.PILL_DANGER_BG,border:"1px solid "+RED,borderRadius:8,padding:"7px",color:RED,fontSize:12,fontWeight:700,cursor:"pointer"}},ic(ICONS.del,RED,13),"Delete")
            )
          );
        })
      )
    );
  }


  function renderEmpDetail(){
    var ma=mAtt(selE.id,curY,curM),inc=getInc(selE.id,curY,curM),d=calcPay(getEffectiveEmp(selE,curY,curM),ma.absent,ma.half,ma.unpaid,inc,getShiftAllow(selE.id,curY,curM),getWorkingDays(att,selE.id,curY,curM),proRata(selE,curY,curM).active,proRata(selE,curY,curM).total);
    var leaveUsed=getLeaveUsed(selE,att,curY);
    var leaveEnt=getLeaveEntitlement(selE);
    var leaveBal=Math.max(0,leaveEnt-leaveUsed);
    var minWageWarn=checkMinWage(selE.monthlyCTC,org.state||"Tamil Nadu","unskilled");
    var empRevs=(salRevisions||[]).filter(function(r){return r.employeeId===String(selE.id);});
    var empWarns=(warnings||[]).filter(function(w){return String(w.employeeId)===String(selE.id)||String(w.employee_id)===String(selE.id);});
    var empBonuses2=(bonuses||[]).filter(function(b){return b.employeeId===String(selE.id);});
    var empLoansAll=(loans||[]).filter(function(l){return String(l.employeeId)===String(selE.id)||String(l.employee_id)===String(selE.id);});
    var activeLoans=empLoansAll.filter(function(l){return l.status==="active";});
    var loanDedTotal=activeLoans.reduce(function(s,l){return s+(l.emi||l.monthlyDeduction||0);},0);
    var claimTotal=(claims||[]).filter(function(c){return c.employeeId===String(selE.id)&&c.status==="approved"&&c.month===curM&&c.year===curY;}).reduce(function(s,c){return s+(c.amount||0);},0);
    var bonusTotal=(bonuses||[]).filter(function(b){return b.employeeId===String(selE.id)&&b.payMonth===curM&&b.payYear===curY;}).reduce(function(s,b){return s+(b.amount||0);},0);
    var otTotalSel=getOTAmount(selE.id,curM,curY);
    var bonusListSel=(bonuses||[]).filter(function(b){return b.employeeId===String(selE.id)&&b.payMonth===curM&&b.payYear===curY;});
    var loanOutstanding=activeLoans.reduce(function(s,l){var paid=l.paidInstallments||0,tenure=l.tenure||0,emi=l.emi||0;return s+Math.max(0,Math.round((tenure-paid)*emi));},0);
    var bonusTotal=empBonuses2.reduce(function(s,b){return s+(b.amount||0);},0);
    var empShiftData=(function(){
      var es=shifts[selE.id];if(!es)return {type:"General",allowance:0};
      var key=curY+"-"+(curM+1<10?"0":"")+(curM+1);
      var entry=(es.log||[]).find(function(l){return l.month===key;});
      return {type:(entry?entry.shift:es.type)||"General",allowance:Number((entry?entry.allowance:es.allowance)||0)};
    })();

    function toggle(key){setEmpSections(function(prev){var n=Object.assign({},prev);n[key]=!n[key];return n;});}

    function accSection(key,icon,iconColor,title,summary,renderContent){
      var open=empSections[key];
      return h("div",{style:{background:CARD,borderRadius:13,border:"1px solid "+BDR,marginBottom:8,overflow:"hidden"}},
        h("div",{onClick:function(){toggle(key);},style:{display:"flex",alignItems:"center",gap:10,padding:"11px 14px",cursor:"pointer",background:open?SFT:CARD,borderBottom:open?"1px solid "+BDR:"none"}},
          h("div",{style:{width:32,height:32,borderRadius:9,background:iconColor+"15",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}},ic(icon,iconColor,16)),
          h("div",{style:{flex:1,minWidth:0}},
            h("div",{style:{fontSize:12,fontWeight:700,color:NVY}},title),
            h("div",{style:{fontSize:10,color:GRY,marginTop:1}},summary)
          ),
          h("div",{style:{transform:open?"rotate(180deg)":"rotate(0deg)",transition:"transform .25s"}},ic("expand_more",GRY,18))
        ),
        open?h("div",{style:{padding:"12px 14px"}},renderContent()):null
      );
    }

    return h("div",{className:"fd"},
      h("button",{onClick:function(){setSelE(null);},style:{background:SFT,border:"1px solid "+BDR,borderRadius:7,padding:"5px 10px",color:NVY,fontSize:11,fontWeight:600,cursor:"pointer",marginBottom:10}},"← Back"),
      minWageWarn&&!minWageWarn.ok?h("div",{style:{background:AMB+"15",border:"1px solid "+AMB+"44",borderRadius:10,padding:"10px 12px",marginBottom:10,display:"flex",alignItems:"center",gap:8}},ic("warning",AMB,16),h("div",null,h("div",{style:{fontSize:12,fontWeight:700,color:AMB}},"Below Minimum Wage"),h("div",{style:{fontSize:10,color:GRY}},"Min: "+fmtIN(minWageWarn.min)+" | Current: "+fmtIN(selE.monthlyCTC)))):null,
      /* Profile - compact */
      h("div",{style:{background:NVY,borderRadius:14,padding:13,marginBottom:8,position:"relative",overflow:"hidden"}},
        h("div",{style:{position:"absolute",right:-7,top:-7,width:54,height:54,borderRadius:"50%",background:"rgba(255,255,255,.04)"}}),
        h("div",{style:{display:"flex",alignItems:"center",gap:11}},
          h("div",{style:{width:42,height:42,borderRadius:11,background:"rgba(255,255,255,.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:600,color:CARD,flexShrink:0}},selE.av),
          h("div",{style:{flex:1,minWidth:0}},
            h("div",{style:{fontSize:15,fontWeight:700,color:CARD,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}},selE.name),
            h("div",{style:{fontSize:10.5,color:CARD,opacity:.7,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}},[selE.role,selE.dept].filter(Boolean).join(" - ")||"No designation"),
            h("div",{style:{display:"flex",gap:10,marginTop:3,flexWrap:"wrap"}},
              selE.eid?h("div",{style:{fontSize:9.5,color:CARD,opacity:.55}},"ID: "+selE.eid):null,
              selE.joined?h("div",{style:{fontSize:9.5,color:CARD,opacity:.55}},"Joined: "+selE.joined):null
            )
          ),
          (selE.mob||selE.email)?h("div",{style:{display:"flex",gap:6,alignItems:"center",flexShrink:0}},
            selE.mob?h("button",{onClick:function(){window.location.href="tel:"+selE.mob;},style:{width:30,height:30,borderRadius:8,background:"#fff",border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}},ic("phone","#10B981",14)):null,
            selE.mob?h("button",{onClick:function(){window.open("https://wa.me/"+(selE.ccode||"91").replace(/\D/g,"")+String(selE.mob).replace(/\D/g,""),"_blank");},style:{width:30,height:30,borderRadius:8,background:"#fff",border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}},ic("whatsapp","#25D366",17)):null,
            selE.email?h("button",{onClick:function(){window.location.href="mailto:"+selE.email;},style:{width:30,height:30,borderRadius:8,background:"#fff",border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}},ic("mail","#2563EB",14)):null
          ):null
        )
      ),

      /* Action buttons */
      h("div",{style:{display:"flex",gap:6,marginBottom:8}},
        h("button",{onClick:function(){openEdit(selE);},style:{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:5,background:NVY,border:"none",borderRadius:10,padding:"10px",color:CARD,fontSize:12,fontWeight:700,cursor:"pointer"}},ic(ICONS.edit,CARD,13),"Edit"),
        h("button",{onClick:function(){setOffE(selE);setOffStep(1);setOffData({reason:"",type:"resigned",handover:[],note:"",resignDate:""});},style:{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:5,background:CARD,border:"1.5px solid "+RED,borderRadius:10,padding:"10px",color:RED,fontSize:12,fontWeight:700,cursor:"pointer"}},ic(ICONS.del,RED,13),"Offboard")
      ),

      /* Joined Details */
      accSection("joined","emoji_add","#2563EB","Joined Details","Joining date & package",function(){
        var isFixed2=selE.salaryType==="fixed";
        var currentMonthly=isFixed2?Number(selE.fixedSalary||selE.monthlyCTC||0):(Number(selE.basic||0)+Number(selE.hra||0)+Number(selE.allow||0));
        // Current package = latest salary revision newCtc if any, else current monthly
        var empRevs=(salRevisions||[]).filter(function(r){return String(r.employeeId)===String(selE.id);}).sort(function(a,b){return new Date(b.effectiveDate||0)-new Date(a.effectiveDate||0);});
        var currentPkg=empRevs.length>0?Number(empRevs[0].newCtc||currentMonthly):currentMonthly;
        // Joining package = oldest revision oldCtc (salary before first raise), else current
        var oldestRev=empRevs.length>0?empRevs[empRevs.length-1]:null;
        var joiningPkg=oldestRev?Number(oldestRev.oldCtc||currentMonthly):currentMonthly;
        var joiningAnnual=joiningPkg*12,currentAnnual=currentPkg*12;
        function lpaFmt(n){return (n/100000).toFixed(2)+" LPA";}
        return h("div",null,
          h("div",{style:{display:"flex",gap:8,marginBottom:8}},
            h("div",{style:{flex:1,background:SFT,borderRadius:10,padding:"11px 12px"}},
              h("div",{style:{fontSize:9,fontWeight:700,color:GRY,letterSpacing:.5,marginBottom:3}},"DATE OF JOINING"),
              h("div",{style:{fontSize:13,fontWeight:800,color:NVY}},selE.joined?new Date(selE.joined+"T00:00:00").toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}):"Not set")
            ),
            h("div",{style:{flex:1,background:"#2563EB10",borderRadius:10,padding:"11px 12px",border:"1px solid #2563EB22"}},
              h("div",{style:{fontSize:9,fontWeight:700,color:"#2563EB",letterSpacing:.5,marginBottom:3}},"TENURE"),
              h("div",{style:{fontSize:13,fontWeight:800,color:"#2563EB"}},(function(){if(!selE.joined)return "-";var dj=new Date(selE.joined+"T00:00:00"),nw=new Date();var mo=(nw.getFullYear()-dj.getFullYear())*12+(nw.getMonth()-dj.getMonth());if(mo<0)mo=0;var y=Math.floor(mo/12),mm=mo%12;return (y>0?y+"y ":"")+mm+"m";})())
            )
          ),
          h("div",{style:{background:selE.confirmed?GRN+"10":SFT,borderRadius:10,padding:"11px 12px",marginBottom:8,border:"1px solid "+(selE.confirmed?GRN+"25":BDR),display:"flex",alignItems:"center",gap:8}},
            ic(selE.confirmed?"check_circle":"hourglass_empty",selE.confirmed?GRN:GRY,16),
            h("div",null,
              h("div",{style:{fontSize:9,fontWeight:700,color:selE.confirmed?GRN:GRY,letterSpacing:.5}},"CONFIRMATION STATUS"),
              h("div",{style:{fontSize:12,fontWeight:700,color:selE.confirmed?GRN:GRY,marginTop:1}},selE.confirmed?("Confirmed on "+(selE.confirmedDate?new Date(selE.confirmedDate+"T00:00:00").toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}):"-")):"Not yet confirmed")
            )
          ),
          /* Joining package */
          h("div",{style:{background:SFT,borderRadius:10,padding:"12px 13px",marginBottom:8,border:"1px solid "+BDR}},
            h("div",{style:{fontSize:9,fontWeight:700,color:GRY,letterSpacing:.5,marginBottom:4}},"JOINING PACKAGE"),
            h("div",{style:{display:"flex",alignItems:"baseline",gap:8}},
              h("div",{style:{fontSize:18,fontWeight:900,color:NVY}},lpaFmt(joiningAnnual)),
              h("div",{style:{fontSize:10,color:GRY}},fmt(joiningPkg)+" / month")
            )
          ),
          /* Current package - live */
          h("div",{style:{background:GRN+"10",borderRadius:10,padding:"13px 14px",border:"1px solid "+GRN+"25"}},
            h("div",{style:{display:"flex",alignItems:"center",gap:6,marginBottom:4}},
              h("div",{style:{fontSize:9,fontWeight:700,color:GRN,letterSpacing:.5}},"CURRENT PACKAGE"),
              empRevs.length>0?h("div",{style:{fontSize:8,fontWeight:700,color:GRN,background:GRN+"1E",borderRadius:5,padding:"1px 5px"}},"REVISED"):null
            ),
            h("div",{style:{display:"flex",alignItems:"baseline",gap:8}},
              h("div",{style:{fontSize:22,fontWeight:900,color:GRN}},lpaFmt(currentAnnual)),
              h("div",{style:{fontSize:11,color:GRY}},"(\u20b9"+currentAnnual.toLocaleString("en-IN")+" / year)")
            ),
            h("div",{style:{fontSize:11,color:GRY,marginTop:3}},fmt(currentPkg)+" per month \u00b7 "+(isFixed2?"Fixed":"Split")+" structure")
          )
        );
      }),

      /* Personal Details */
      accSection("personal","book","#7C3AED","Personal Details","Contact & identity info",function(){
        var rows=[
          ["Full Name",selE.name],
          ["Mobile",selE.mob?("+"+(selE.ccode||"91")+" "+selE.mob):null],
          ["Email",selE.email],
          ["Nationality",selE.nationality],
          ["Date of Birth",selE.dob?new Date(selE.dob+"T00:00:00").toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}):null],
          ["Employee ID",selE.eid],
          ["PAN Number",selE.pan],
          ["UAN Number",selE.uan],
          ["Aadhaar Number",selE.aadhar]
        ].filter(function(r){return r[1];});
        return h("div",null,
          rows.length===0?h("div",{style:{textAlign:"center",padding:"14px 0",fontSize:11,color:GRY}},"No personal details added. Edit the employee to add them."):
          rows.map(function(r,i){return h("div",{key:i,style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:i<rows.length-1?"1px solid "+BDR:"none"}},
            h("span",{style:{fontSize:11,color:GRY}},r[0]),
            h("span",{style:{fontSize:12,fontWeight:600,color:NVY,textAlign:"right",maxWidth:"60%",wordBreak:"break-word"}},r[1])
          );})
        );
      }),

      /* 1. Salary & Pay */
      accSection("salary","payments","#059669","Salary & Pay",
        "Net: "+fmt(Math.max(0,d.net+bonusTotal+claimTotal+otTotalSel-loanDedTotal))+(loanDedTotal>0?" · EMI: "+fmt(loanDedTotal):""),
        function(){
          return h("div",null,
            h("div",{style:{fontSize:10,fontWeight:700,color:GRY,letterSpacing:1,marginBottom:6}},"EARNINGS"),
            selE.salaryType==="fixed"?
              h("div",{style:{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid "+BDR}},h("span",{style:{fontSize:12,color:GRY}},"Fixed Salary"),h("span",{style:{fontSize:12,fontWeight:700,color:NVY}},fmt(d.gr))):
              [["Basic",d.basic],["HRA",d.hra],["Allowance",d.allow]].map(function(r,i){return h("div",{key:i,style:{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid "+BDR}},h("span",{style:{fontSize:12,color:GRY}},r[0]),h("span",{style:{fontSize:12,fontWeight:600,color:NVY}},fmt(r[1])));})
            ,
            inc>0?h("div",{style:{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid "+BDR}},h("span",{style:{fontSize:12,color:GRY}},"Incentive"),h("span",{style:{fontSize:12,fontWeight:600,color:GRN}},fmt(inc))):null,
            claimTotal>0?h("div",{style:{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid "+BDR}},h("span",{style:{fontSize:12,color:GRY}},"Reimbursement"),h("span",{style:{fontSize:12,fontWeight:600,color:GRN}},"+"+fmt(claimTotal))):null,
            bonusListSel.map(function(b,i){return h("div",{key:"bn"+i,style:{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid "+BDR}},h("span",{style:{fontSize:12,color:GRY}},b.note||b.type||"Bonus"),h("span",{style:{fontSize:12,fontWeight:600,color:AMB}},"+"+fmt(b.amount||0)));}),
            otTotalSel>0?h("div",{style:{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid "+BDR}},h("span",{style:{fontSize:12,color:GRY}},"Overtime"),h("span",{style:{fontSize:12,fontWeight:600,color:TEL}},"+"+fmt(otTotalSel))):null,
            (ma.absent>0||ma.half>0||ma.unpaid>0||d.pfE>0||d.esiE>0||d.pt>0||loanDedTotal>0)?h("div",{style:{marginTop:8}},
              h("div",{style:{fontSize:10,fontWeight:700,color:GRY,letterSpacing:1,marginBottom:6}},"DEDUCTIONS"),
              [ma.absent>0?["Absent ("+ma.absent+"d)",d.ad]:null,ma.half>0?["Half Day ("+ma.half+"d)",d.hd]:null,ma.unpaid>0?["Unpaid ("+ma.unpaid+"d)",d.ud]:null,d.pfE>0?["PF (Employee)",d.pfE]:null,d.esiE>0?["ESI (Employee)",d.esiE]:null,d.pt>0?["Prof. Tax",d.pt]:null,d.tds>0?["TDS",d.tds]:null,loanDedTotal>0?["Loan/Advance EMI",loanDedTotal]:null].filter(Boolean).map(function(r,i){return h("div",{key:i,style:{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid "+BDR}},h("span",{style:{fontSize:12,color:GRY}},r[0]),h("span",{style:{fontSize:12,fontWeight:600,color:RED}},"-"+fmt(r[1])));})
            ):null,
            h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0 0",borderTop:"2px solid "+BDR,marginTop:8}},h("span",{style:{fontSize:13,fontWeight:800,color:NVY}},"Net Take Home"),h("span",{style:{fontSize:16,fontWeight:900,color:GRN}},fmt(Math.max(0,d.net+bonusTotal+claimTotal+otTotalSel-loanDedTotal)))),
            h("div",{style:{background:SFT,borderRadius:9,padding:"8px 12px",marginTop:10}},
              h("div",{style:{fontSize:9,fontWeight:700,color:GRY,letterSpacing:.5,marginBottom:4}},"EMPLOYER COST"),
              h("div",{style:{display:"flex",justifyContent:"space-between"}},h("span",{style:{fontSize:11,color:GRY}},"PF (Employer)"),h("span",{style:{fontSize:11,fontWeight:600,color:NVY}},fmt(d.pfR))),
              d.esiR>0?h("div",{style:{display:"flex",justifyContent:"space-between",marginTop:2}},h("span",{style:{fontSize:11,color:GRY}},"ESI (Employer)"),h("span",{style:{fontSize:11,fontWeight:600,color:NVY}},fmt(d.esiR))):null,
              h("div",{style:{display:"flex",justifyContent:"space-between",marginTop:4,paddingTop:4,borderTop:"1px solid "+BDR}},h("span",{style:{fontSize:11,fontWeight:700,color:NVY}},"Total CTC"),h("span",{style:{fontSize:12,fontWeight:800,color:NVY}},fmt(d.net+d.pfR+d.esiR)))
            ),
            h("button",{onClick:function(){if(!isPaid){showT("Download payslip is a paid feature","info");window.open("https://wa.me/918072293384?text="+encodeURIComponent("Hi, I would like to subscribe to Admin HR paid features"),"_blank");return;}makePayslipPDF(selE,d,curM,curY,org.name,org.contactEmail||org.email,org.pos,org.logo,false,org.address,null,authPos,authSign,null,getEmpBonusesWithOT(selE.id,curM,curY),getEmpClaimTotal(selE.id,curM,curY),org.phone,org.website,getEmpLoanDed(selE.id),ma);},style:{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:6,background:NVY,border:"none",borderRadius:10,padding:"10px",fontSize:12,fontWeight:700,color:CARD,cursor:"pointer",marginTop:10}},ic(isPaid?"download":"lock",CARD,14),"Download Payslip")
          );
        }
      ),

      /* 2. Shift */
      accSection("shift","clock","#0D9488","Shift + OT",
        (empShiftData.type||"General")+(empShiftData.allowance>0?" \u00b7 "+fmt(empShiftData.allowance)+"/mo":"")+((selE.otRate||selE.otFlat)?" \u00b7 OT set":""),
        function(){
          var curKey=curY+"-"+(curM+1<10?"0":"")+(curM+1);
          var es=shifts[selE.id]||{};
          var curEntry=(es.log||[]).find(function(l){return l.month===curKey;})||{};
          var curType=empShiftData.type||"General";
          function saveShift(type,allow){
            var newEntry=Object.assign({},curEntry,{shift:type,allowance:Number(allow||0),month:curKey});
            var newLog=(es.log||[]).filter(function(l){return l.month!==curKey;}).concat([newEntry]);
            var ns=Object.assign({},es,{type:type,allowance:Number(allow||0),log:newLog,empId:selE.id});
            setShifts(function(p){var o=Object.assign({},p);o[selE.id]=ns;return o;});
            showT("Shift saved");
          }
          function saveOTConfig(){
            var rateInp=document.getElementById("otRateInp");
            var flatInp=document.getElementById("otFlatInp");
            var rate=rateInp?Number(rateInp.value||0):Number(selE.otRate||0);
            var flat=flatInp?Number(flatInp.value||0):Number(selE.otFlat||0);
            if(!rate&&!flat)return showT("Enter at least one OT rate","err");
            var upd=Object.assign({},selE,{otRate:rate,otFlat:flat,otConfigured:true});
            setEmps(function(p){return p.map(function(e){return e.id===selE.id?upd:e;});});
            setSelE(upd);
            _sb.from("user_data").upsert({employer_email:gUser.email,employees:JSON.stringify(emps.map(function(e){return e.id===selE.id?upd:e;}))}).then(function(){});
            showT("Overtime pay saved");
          }
          return h("div",null,
            /* Inner toggle: Shift | Overtime */
            h("div",{style:{display:"flex",gap:6,marginBottom:13,background:SFT,borderRadius:10,padding:4}},
              [["shift","Shift"],["ot","Overtime Pay"]].map(function(t){
                var on=shiftOtTab===t[0];
                return h("button",{key:t[0],onClick:function(){setShiftOtTab(t[0]);},style:{flex:1,background:on?CARD:"transparent",border:on?"1px solid "+BDR:"1px solid transparent",borderRadius:8,padding:"8px",fontSize:11.5,fontWeight:700,color:on?NVY:GRY,cursor:"pointer"}},t[1]);
              })
            ),
            shiftOtTab==="shift"?h("div",null,
              /* Current tiles */
              h("div",{style:{display:"flex",gap:8,marginBottom:12}},
                h("div",{style:{flex:1,background:ACCENT_SOFT,borderRadius:8,padding:"8px 10px"}},
                  h("div",{style:{fontSize:10,color:GRY,marginBottom:2}},"Current Shift"),
                  h("div",{style:{fontSize:13,fontWeight:700,color:NVY}},curType)
                ),
                h("div",{style:{flex:1,background:AMB+"12",borderRadius:8,padding:"8px 10px"}},
                  h("div",{style:{fontSize:10,color:GRY,marginBottom:2}},"Allowance"),
                  h("div",{style:{fontSize:13,fontWeight:700,color:empShiftData.allowance>0?AMB:GRY}},
                    empShiftData.allowance>0?fmt(empShiftData.allowance)+"/mo":"None")
                )
              ),
              lbl("SHIFT TYPE"),
              h("div",{style:{display:"flex",flexWrap:"wrap",gap:6,marginBottom:12}},
                SHIFT_TYPES.map(function(s){
                  var active=curType===s;
                  return h("button",{key:s,onClick:function(){saveShift(s,empShiftData.allowance);},
                    style:{background:active?NVY:SFT,border:"1px solid "+(active?NVY:BDR),
                    borderRadius:8,padding:"6px 12px",fontSize:11,fontWeight:active?700:500,
                    color:active?CARD:GRY,cursor:"pointer"}},s);
                })
              ),
              lbl("ALLOWANCE (\u20b9/MO)"),
              h("div",{style:{display:"flex",gap:8}},
                h("input",{type:"number",id:"shiftAllowInp",key:"sa"+selE.id+curKey,defaultValue:String(empShiftData.allowance||0),
                  placeholder:"0",style:{flex:1,background:SFT,border:"1px solid "+BDR,borderRadius:8,
                  padding:"8px 10px",fontSize:12,fontWeight:600,color:NVY,outline:"none",fontFamily:"inherit"}}),
                h("button",{onClick:function(){
                  var v=document.getElementById("shiftAllowInp");
                  saveShift(curType,v?v.value:0);
                },style:{background:NVY,border:"none",borderRadius:8,padding:"8px 16px",
                  fontSize:12,fontWeight:700,color:CARD,cursor:"pointer"}},"Save")
              )
            ):h("div",null,
              /* Overtime Pay setup - both rates, editable */
              h("div",{style:{fontSize:11,color:GRY,lineHeight:1.5,marginBottom:12}},"Set overtime pay for "+selE.name+". Both rates are saved \u2014 you choose hourly or flat when marking OT on the attendance sheet."),
              h("div",{style:{display:"flex",gap:8,marginBottom:10}},
                h("div",{style:{flex:1}},
                  h("div",{style:{fontSize:9,fontWeight:700,color:GRY,letterSpacing:.4,marginBottom:4}},"HOURLY RATE (\u20b9/HR)"),
                  h("input",{type:"number",id:"otRateInp",key:"otr"+selE.id,defaultValue:String(selE.otRate||0),placeholder:"e.g. 150",style:{width:"100%",background:SFT,border:"1px solid "+BDR,borderRadius:8,padding:"10px",fontSize:13,fontWeight:600,color:NVY,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}})
                ),
                h("div",{style:{flex:1}},
                  h("div",{style:{fontSize:9,fontWeight:700,color:GRY,letterSpacing:.4,marginBottom:4}},"FLAT (\u20b9/DAY)"),
                  h("input",{type:"number",id:"otFlatInp",key:"otf"+selE.id,defaultValue:String(selE.otFlat||0),placeholder:"e.g. 500",style:{width:"100%",background:SFT,border:"1px solid "+BDR,borderRadius:8,padding:"10px",fontSize:13,fontWeight:600,color:NVY,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}})
                )
              ),
              h("button",{onClick:function(){saveOTConfig();},style:{width:"100%",background:TEL,border:"none",borderRadius:9,padding:"11px",fontSize:12,fontWeight:700,color:"#fff",cursor:"pointer"}},(selE.otRate||selE.otFlat)?"Update Overtime Pay":"Save Overtime Pay"),
              (selE.otRate||selE.otFlat)?h("div",{style:{marginTop:10,background:TEL+"0E",borderRadius:8,padding:"10px 12px"}},
                h("div",{style:{fontSize:9,fontWeight:700,color:TEL,letterSpacing:.4,marginBottom:4}},"SAVED RATES"),
                h("div",{style:{display:"flex",gap:14}},
                  h("div",null,h("span",{style:{fontSize:11,color:GRY}},"Hourly: "),h("span",{style:{fontSize:12,fontWeight:700,color:NVY}},selE.otRate?fmt(selE.otRate)+"/hr":"\u2014")),
                  h("div",null,h("span",{style:{fontSize:11,color:GRY}},"Flat: "),h("span",{style:{fontSize:12,fontWeight:700,color:NVY}},selE.otFlat?fmt(selE.otFlat)+"/day":"\u2014"))
                )
              ):null
            )
          );
        }
      ),
      /* 3. Leave Balance */
      accSection("leave","event_available","#10B981","Leave Balance",
        leaveEnt>0?leaveBal+" of "+leaveEnt+" days left":"Tap to set entitlement",
        function(){
          var usePct=leaveEnt>0?Math.min(Math.round(leaveUsed*100/leaveEnt),100):0;
          var balColor=leaveBal>leaveEnt*0.5?"#10B981":leaveBal>leaveEnt*0.25?AMB:RED;
          var circ=2*Math.PI*34;
          return h("div",null,
            /* Hero ring + remaining */
            leaveEnt>0?h("div",{style:{display:"flex",alignItems:"center",gap:16,background:SFT,borderRadius:12,padding:"14px 16px",marginBottom:10}},
              h("div",{style:{position:"relative",width:80,height:80,flexShrink:0}},
                h("svg",{width:80,height:80,viewBox:"0 0 80 80",style:{transform:"rotate(-90deg)"}},
                  h("circle",{cx:40,cy:40,r:34,fill:"none",stroke:BDR,strokeWidth:7}),
                  h("circle",{cx:40,cy:40,r:34,fill:"none",stroke:balColor,strokeWidth:7,strokeLinecap:"round",strokeDasharray:circ,strokeDashoffset:circ*(usePct/100)})
                ),
                h("div",{style:{position:"absolute",top:0,left:0,width:80,height:80,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}},
                  h("div",{style:{fontSize:20,fontWeight:900,color:balColor,lineHeight:1}},leaveBal%1===0?leaveBal:leaveBal.toFixed(1)),
                  h("div",{style:{fontSize:8,color:GRY,fontWeight:600,marginTop:1}},"LEFT")
                )
              ),
              h("div",{style:{flex:1}},
                h("div",{style:{display:"flex",justifyContent:"space-between",padding:"3px 0"}},h("span",{style:{fontSize:11,color:GRY}},"Used"),h("span",{style:{fontSize:11,fontWeight:700,color:NVY}},(leaveUsed%1===0?leaveUsed:leaveUsed.toFixed(1))+" days")),
                h("div",{style:{display:"flex",justifyContent:"space-between",padding:"3px 0",borderTop:"1px solid "+BDR,marginTop:3}},h("span",{style:{fontSize:11,color:GRY}},"Entitled"),h("span",{style:{fontSize:11,fontWeight:700,color:NVY}},(leaveEnt||0)+" days/yr")),
                h("div",{style:{fontSize:9,color:GRY,marginTop:5}},usePct+"% of annual quota used")
              )
            ):h("div",{style:{textAlign:"center",padding:"10px 0 14px"}},
              h("div",{style:{fontSize:12,color:GRY}},"No annual leave entitlement set yet.")
            ),
            /* Clean entitlement setter */
            h("div",{style:{fontSize:9,fontWeight:700,color:GRY,letterSpacing:.8,marginBottom:6}},"ANNUAL ENTITLEMENT"),
            h("div",{style:{display:"flex",gap:8,alignItems:"center",marginBottom:8}},
              h("button",{onClick:function(){var inp=document.getElementById("lvEntInp");if(inp)inp.value=String(Math.max(0,Number(inp.value||0)-1));},style:{width:38,height:42,background:SFT,border:"1px solid "+BDR,borderRadius:9,fontSize:20,fontWeight:700,color:NVY,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}},"\u2212"),
              h("input",{type:"number",id:"lvEntInp",defaultValue:String(leaveEnt||0),style:{flex:1,background:SFT,border:"1.5px solid "+BDR,borderRadius:9,padding:"10px",fontSize:18,fontWeight:900,color:NVY,outline:"none",fontFamily:"inherit",textAlign:"center"}}),
              h("button",{onClick:function(){var inp=document.getElementById("lvEntInp");if(inp)inp.value=String(Number(inp.value||0)+1);},style:{width:38,height:42,background:SFT,border:"1px solid "+BDR,borderRadius:9,fontSize:20,fontWeight:700,color:NVY,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}},"+")
            ),
            h("button",{onClick:function(){
              var inp=document.getElementById("lvEntInp");
              var n=Number(inp?inp.value:leaveEnt);
              if(isNaN(n)||n<0)return showT("Enter valid days","err");
              var upd=Object.assign({},selE,{leaveEntitlement:n});
              setEmps(function(p){return p.map(function(e){return e.id===selE.id?upd:e;});});
              _sb.from("user_data").upsert({employer_email:gUser.email,employees:JSON.stringify(emps.map(function(e){return e.id===selE.id?upd:e;}))}).then(function(){});
              showT("Leave entitlement saved");
            },style:{width:"100%",background:"#10B981",border:"none",borderRadius:9,padding:"11px",fontSize:12,fontWeight:700,color:"#fff",cursor:"pointer"}},"Save Entitlement")
          );
        }
      ),

      /* 4. Loans & Advances */
      accSection("loans","account_balance","#2563EB","Loans & Advances",
        activeLoans.length>0?activeLoans.length+" active · Outstanding: "+fmt(loanOutstanding):"No active records",
        function(){return renderLoanSection(selE);}
      ),

      /* 5. Gratuity */
      accSection("gratuity","workspace_premium","#8B5CF6","Gratuity Calculator",
        (function(){if(!selE.joined)return "Join date not set";var ms=new Date()-new Date(selE.joined+"T00:00:00");var y=Math.floor(ms/(1000*60*60*24*365.25));var m=Math.floor((ms%(1000*60*60*24*365.25))/(1000*60*60*24*30.44));return y+"y "+m+"m · "+(y>=5?"Eligible":"Not eligible yet");}()),
        function(){return renderGratuityCard(selE);}
      ),

      /* 6. Salary History */
      (function(){
        var open=empSections["history"];
        var empRevs2=(salRevisions||[])
          .filter(function(r){return r.employeeId===String(selE.id);})
          .sort(function(a,b){return (b.effectiveDate||"").localeCompare(a.effectiveDate||"");});
        var lastCtc=empRevs2.length>0?(empRevs2[0].newCtc||0):(selE.monthlyCTC||selE.fixedSalary||0);
        var summary=empRevs2.length>0
          ?empRevs2.length+" revision"+(empRevs2.length>1?"s":"")+" · Current: "+fmt(lastCtc)+"/mo"
          :"No revisions · Tap to add";

        function toggleHist(){setEmpSections(function(p){var n=Object.assign({},p);n.history=!n.history;return n;});}

        function doAddRev(){
          var oldInp=document.getElementById("revOldCtc");
          var newInp=document.getElementById("revNewCtc");
          var moInp=document.getElementById("revMonth");
          var rsInp=document.getElementById("revReason");
          if(!newInp||!moInp)return;
          var oldC=Number(oldInp?oldInp.value:0)||lastCtc;
          var newC=Number(newInp.value)||0;
          var moRaw=moInp.value;
          var rs=rsInp?rsInp.value:"";
          if(!newC)return showT("Enter new salary","err");
          if(!moRaw)return showT("Select month","err");
          var mo=moRaw.length===7?moRaw+"-01":moRaw; // normalize "YYYY-MM" to a full date for Postgres
          var newId=String(Date.now());
          var rev={id:newId,employeeId:String(selE.id),employeeName:selE.name,effectiveDate:mo,oldCtc:oldC,newCtc:newC,reason:rs};
          setSalRevisions(function(p){return [rev].concat(p||[]);});
          _sb.from("salary_revisions").insert({id:newId,employer_email:gUser.email,employee_id:String(selE.id),employee_name:selE.name,effective_date:mo,old_ctc:oldC,new_ctc:newC,reason:rs})
            .then(function(r){if(r&&r.error)showT("Error: "+r.error.message,"err");else showT("Revision saved");});
          setShowRevForm(false);
        }

        function doEditRev(r){
          var di=document.getElementById("eRevMo_"+r.id);
          var ri=document.getElementById("eRevRs_"+r.id);
          var moRaw=di?di.value:r.effectiveDate;
          var rs=ri?ri.value:r.reason;
          if(!moRaw)return showT("Select month","err");
          var mo=moRaw.length===7?moRaw+"-01":moRaw; // normalize "YYYY-MM" to a full date for Postgres
          setSalRevisions(function(p){return (p||[]).map(function(x){return x.id===r.id?Object.assign({},x,{effectiveDate:mo,reason:rs}):x;});});
          _sb.from("salary_revisions").update({effective_date:mo,reason:rs}).eq("id",String(r.id)).then(function(){});
          setEditRevId(null);showT("Updated");
        }

        function doDelRev(r){
          if(!window.confirm("Delete this revision?"))return;
          setSalRevisions(function(p){return (p||[]).filter(function(x){return x.id!==r.id;});});
          _sb.from("salary_revisions").delete().eq("id",String(r.id)).then(function(){});
          showT("Deleted");
        }

        function fmtMonth(m){
          if(!m)return "";
          var parts=m.split("-");
          if(parts.length<2)return m;
          var months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
          return months[Number(parts[1])-1]+" "+parts[0];
        }

        return h("div",{style:{background:CARD,borderRadius:13,border:"1px solid "+BDR,marginBottom:8,overflow:"hidden"}},
          h("div",{onClick:toggleHist,style:{display:"flex",alignItems:"center",gap:10,padding:"11px 14px",cursor:"pointer",background:open?SFT:CARD,borderBottom:open?"1px solid "+BDR:"none"}},
            h("div",{style:{width:32,height:32,borderRadius:9,background:"#2563EB15",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}},ic("trending_up","#2563EB",16)),
            h("div",{style:{flex:1,minWidth:0}},
              h("div",{style:{fontSize:12,fontWeight:700,color:NVY}},"Salary History"),
              h("div",{style:{fontSize:10,color:GRY,marginTop:1}},summary)
            ),
            h("div",{style:{transform:open?"rotate(180deg)":"rotate(0deg)",transition:"transform .25s"}},ic("expand_more",GRY,18))
          ),
          open?h("div",{style:{padding:"12px 14px"}},
            /* Header row */
            h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}},
              h("div",{style:{fontSize:11,fontWeight:700,color:NVY}},empRevs2.length+" Revision"+(empRevs2.length!==1?"s":"")),
              h("button",{onClick:function(e){e.stopPropagation();setShowRevForm(!showRevForm);},
                style:{background:showRevForm?SFT:NVY,border:showRevForm?"1px solid "+BDR:"none",
                borderRadius:8,padding:"5px 12px",fontSize:11,fontWeight:700,
                color:showRevForm?GRY:CARD,cursor:"pointer"}},
                showRevForm?"✕ Cancel":"+ Add")
            ),
            /* Add form */
            showRevForm?h("div",{style:{background:SFT,borderRadius:10,border:"1px solid "+BDR,padding:"10px",marginBottom:10}},
              /* Old → New salary row */
              h("div",{style:{display:"flex",gap:8,marginBottom:8}},
                h("div",{style:{flex:1}},
                  lbl("OLD SALARY /MO"),
                  h("input",{type:"number",id:"revOldCtc",defaultValue:String(lastCtc),
                    style:{width:"100%",background:CARD,border:"1px solid "+BDR,borderRadius:8,padding:"8px 10px",fontSize:12,fontWeight:600,color:NVY,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}})
                ),
                h("div",{style:{alignSelf:"flex-end",paddingBottom:8,color:GRY,fontSize:14}},"→"),
                h("div",{style:{flex:1}},
                  lbl("NEW SALARY /MO"),
                  h("input",{type:"number",id:"revNewCtc",placeholder:"e.g. 25000",
                    style:{width:"100%",background:CARD,border:"1px solid #2563EB55",borderRadius:8,padding:"8px 10px",fontSize:12,fontWeight:600,color:NVY,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}})
                )
              ),
              /* Month + Reason */
              h("div",{style:{display:"flex",gap:8,marginBottom:8}},
                h("div",{style:{flex:1}},
                  lbl("EFFECTIVE MONTH"),
                  h("input",{type:"month",id:"revMonth",
                    style:{width:"100%",background:CARD,border:"1px solid "+BDR,borderRadius:8,padding:"8px 10px",fontSize:12,color:NVY,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}})
                ),
                h("div",{style:{flex:1}},
                  lbl("REASON"),
                  h("input",{type:"text",id:"revReason",placeholder:"e.g. Annual hike",
                    style:{width:"100%",background:CARD,border:"1px solid "+BDR,borderRadius:8,padding:"8px 10px",fontSize:12,color:NVY,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}})
                )
              ),
              h("button",{onClick:doAddRev,
                style:{width:"100%",background:NVY,border:"none",borderRadius:8,padding:"10px",fontSize:12,fontWeight:700,color:CARD,cursor:"pointer"}},
                "Save Revision")
            ):null,
            /* Empty state */
            empRevs2.length===0&&!showRevForm?h("div",{style:{textAlign:"center",padding:"12px 0",color:GRY,fontSize:11}},"No revisions yet"):null,
            /* List */
            empRevs2.map(function(r,i){
              var diff=r.newCtc-r.oldCtc;
              var pct=r.oldCtc>0?Math.round(Math.abs(diff)*100/r.oldCtc):0;
              var up=diff>=0;
              var isEditing=editRevId===r.id;
              return h("div",{key:r.id,style:{borderTop:i===0?"none":"1px solid "+BDR,paddingTop:i===0?0:8,marginTop:i===0?0:8}},
                h("div",{style:{display:"flex",alignItems:"center",gap:8}},
                  /* Stat tile */
                  h("div",{style:{flex:1,background:up?"#10B98110":RED+"10",borderRadius:8,padding:"7px 10px",border:"1px solid "+(up?"#10B98125":RED+"25")}},
                    h("div",{style:{display:"flex",alignItems:"center",gap:6,marginBottom:2}},
                      h("div",{style:{fontSize:12,fontWeight:700,color:NVY}},fmt(r.oldCtc)+" → "+fmt(r.newCtc)),
                      h("div",{style:{fontSize:9,fontWeight:700,background:up?"#10B98115":RED+"15",color:up?"#10B981":RED,borderRadius:12,padding:"1px 6px"}},(up?"+":"-")+pct+"%")
                    ),
                    h("div",{style:{fontSize:10,color:GRY}},fmtMonth(r.effectiveDate)+(r.reason?" · "+r.reason:""))
                  ),
                  /* Edit/Del buttons */
                  !isEditing?h("div",{style:{display:"flex",flexDirection:"column",gap:4,flexShrink:0}},
                    h("button",{onClick:function(){setEditRevId(r.id);},
                      style:{background:SFT,border:"1px solid "+BDR,borderRadius:6,padding:"4px 8px",fontSize:9,fontWeight:700,color:NVY,cursor:"pointer"}},"Edit"),
                    h("button",{onClick:function(){doDelRev(r);},
                      style:{background:RED+"10",border:"1px solid "+RED+"22",borderRadius:6,padding:"4px 8px",fontSize:9,fontWeight:700,color:RED,cursor:"pointer"}},"Del")
                  ):null
                ),
                /* Inline edit */
                isEditing?h("div",{style:{display:"flex",gap:6,marginTop:6}},
                  h("input",{type:"month",id:"eRevMo_"+r.id,defaultValue:r.effectiveDate||"",
                    style:{flex:1,background:CARD,border:"1px solid "+BDR,borderRadius:7,padding:"6px 8px",fontSize:11,color:NVY,outline:"none",fontFamily:"inherit"}}),
                  h("input",{type:"text",id:"eRevRs_"+r.id,defaultValue:r.reason||"",placeholder:"Reason",
                    style:{flex:1,background:CARD,border:"1px solid "+BDR,borderRadius:7,padding:"6px 8px",fontSize:11,color:NVY,outline:"none",fontFamily:"inherit"}}),
                  h("button",{onClick:function(){doEditRev(r);},
                    style:{background:NVY,border:"none",borderRadius:7,padding:"6px 10px",fontSize:11,fontWeight:700,color:CARD,cursor:"pointer"}},"Save"),
                  h("button",{onClick:function(){setEditRevId(null);},
                    style:{background:SFT,border:"1px solid "+BDR,borderRadius:7,padding:"6px 8px",fontSize:11,color:GRY,cursor:"pointer"}},"✕")
                ):null
              );
            })
          ):null
        );
      })(),

      /* 7. Warning Letters */
      accSection("warnings","pending_actions",RED,"Warning Letters",
        empWarns.length>0?empWarns.length+" warning"+(empWarns.length>1?"s":"")+" issued":"No warnings issued",
        function(){return renderWarningSection(selE);}
      ),

      /* 8. Bonus & One-Time Pay */
      accSection("bonus","star",AMB,"Bonus & One-Time Pay",
        empBonuses2.length>0?"Total: "+fmt(bonusTotal)+" · "+empBonuses2.length+" record"+(empBonuses2.length>1?"s":""):"No bonuses recorded",
        function(){return renderBonusSection(selE);}
      ),

      /* 9. Letters & Documents */
      accSection("letters","description",ACCENT,"Letters & Documents",
        "Confirmation · Increment · Experience · Verification · NOC · Relieving",
        function(){
          var pInfo=getProbationInfo(selE);
          var pm=(policies&&policies.probation&&policies.probation.fields&&policies.probation.fields.probationMonths)||3;
          function downloadConfirmation(useDate){
            try{
              var e2=useDate?Object.assign({},selE,{confirmedDate:useDate}):selE;
              if(useDate){setEmps(function(p){return p.map(function(x){return x.id===selE.id?e2:x;});});setSelE(e2);}
              makeConfirmationLetterPDF(e2,org,authPos,authSign,pm);
              if(!selE.confirmed){
                var upd=Object.assign({},e2,{confirmed:true,confirmedDate:e2.confirmedDate||new Date().toISOString().slice(0,10)});
                setEmps(function(p){return p.map(function(x){return x.id===selE.id?upd:x;});});
                setSelE(upd);
              }
              setConfMenuOpen(false);setConfDateEdit(false);
            }catch(ex){showT("PDF error: "+ex.message,"err");}
          }
          function toggleBtn(label,icon,onToggle,isOpen){
            return h("button",{onClick:onToggle,style:{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:5,background:isOpen?ACCENT:ACCENT+"12",border:"1.5px solid "+ACCENT+"30",borderRadius:10,padding:"11px",color:isOpen?ACCENT_FG:ACCENT,fontSize:12,fontWeight:600,cursor:"pointer"}},ic(icon,isOpen?ACCENT_FG:ACCENT,13),label,ic(isOpen?"expand_less":"expand_more",isOpen?ACCENT_FG:ACCENT,13));
          }
          function panel(children){
            return h("div",{style:{background:SFT,border:"1px solid "+BDR,borderRadius:10,padding:11,display:"flex",flexDirection:"column",gap:8,marginTop:-2}},children);
          }
          return h("div",{style:{display:"flex",flexDirection:"column",gap:8}},
            pInfo&&!pInfo.confirmed?h("div",{style:{background:(pInfo.overdue?RED:pInfo.due?AMB:SFT)+(pInfo.overdue||pInfo.due?"12":""),border:"1px solid "+(pInfo.overdue?RED+"33":pInfo.due?AMB+"33":BDR),borderRadius:10,padding:"8px 10px",fontSize:10.5,color:pInfo.overdue?RED:pInfo.due?AMB:GRY,marginBottom:2}},
              pInfo.overdue?"Probation ended "+Math.abs(pInfo.daysLeft)+" day(s) ago — confirmation letter pending."
                :pInfo.due?"Probation ends in "+pInfo.daysLeft+" day(s) — issue confirmation letter when ready."
                :"Probation ends "+pInfo.endDate.toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})+"."
            ):null,
            pInfo&&pInfo.confirmed?h("div",{style:{background:GRN+"10",border:"1px solid "+GRN+"33",borderRadius:10,padding:"8px 10px",fontSize:10.5,color:GRN,marginBottom:2}},
              ic("check_circle",GRN,12)," Confirmed on "+(selE.confirmedDate?new Date(selE.confirmedDate).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}):"-")
            ):null,

            // ── Confirmation ──
            h("div",{style:{display:"flex",gap:8}},
              toggleBtn("Confirmation","how_to_reg",function(){
                if(!selE.confirmed){downloadConfirmation(null);return;}
                setConfMenuOpen(!confMenuOpen);setConfDateEdit(false);
              },confMenuOpen),
              h("button",{onClick:function(){try{makeExperienceLetterPDF(selE,org,authPos,authSign);}catch(ex){showT("PDF error: "+ex.message,"err");}},style:{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:5,background:ACCENT+"12",border:"1.5px solid "+ACCENT+"30",borderRadius:10,padding:"11px",color:ACCENT,fontSize:12,fontWeight:600,cursor:"pointer"}},ic("workspace_premium",ACCENT,13),"Experience")
            ),
            confMenuOpen?panel(
              confDateEdit?[
                h("div",{key:"l"},lbl("CONFIRMATION DATE"),datePick(confNewDate||selE.confirmedDate||todayStr,function(v){setConfNewDate(v);},{question:"Confirmation date",wrapStyle:{marginBottom:0}})),
                h("button",{key:"b",onClick:function(){downloadConfirmation(confNewDate||selE.confirmedDate||todayStr);},style:{width:"100%",background:ACCENT,border:"none",borderRadius:9,padding:"10px",color:ACCENT_FG,fontSize:12,fontWeight:700,cursor:"pointer"}},"Save & Download")
              ]:[
                h("div",{key:"t",style:{fontSize:11,color:GRY}},"Already confirmed on "+(selE.confirmedDate?new Date(selE.confirmedDate).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}):"-")+". What would you like to do?"),
                h("div",{key:"b",style:{display:"flex",gap:8}},
                  h("button",{onClick:function(){downloadConfirmation(null);},style:{flex:1,background:ACCENT,border:"none",borderRadius:9,padding:"10px",color:ACCENT_FG,fontSize:11.5,fontWeight:700,cursor:"pointer"}},"Re-download PDF"),
                  h("button",{onClick:function(){setConfDateEdit(true);setConfNewDate(selE.confirmedDate||todayStr);},style:{flex:1,background:CARD,border:"1px solid "+BDR,borderRadius:9,padding:"10px",color:NVY,fontSize:11.5,fontWeight:700,cursor:"pointer"}},"Change Date")
                )
              ]
            ):null,

            // ── Verification / NOC ──
            h("div",{style:{display:"flex",gap:8}},
              h("button",{onClick:function(){try{makeEmploymentVerificationPDF(selE,org,authPos,authSign);}catch(ex){showT("PDF error: "+ex.message,"err");}},style:{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:5,background:ACCENT+"12",border:"1.5px solid "+ACCENT+"30",borderRadius:10,padding:"11px",color:ACCENT,fontSize:12,fontWeight:600,cursor:"pointer"}},ic("fact_check",ACCENT,13),"Verification"),
              toggleBtn("NOC","gpp_good",function(){setNocOpen(!nocOpen);},nocOpen)
            ),
            nocOpen?panel([
              h("div",{key:"l"},lbl("PURPOSE OF NOC"),h("input",{value:nocPurpose,onChange:function(e){setNocPurpose(e.target.value);},placeholder:"e.g. Bank Loan, Passport, Visa, Vehicle Loan",style:{width:"100%",background:CARD,border:"1.5px solid "+BDR,borderRadius:8,padding:"9px 10px",fontSize:12.5,color:NVY,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}})),
              h("button",{key:"b",onClick:function(){
                if(!nocPurpose.trim())return showT("Enter the purpose of NOC","err");
                try{makeNOCPDF(selE,org,authPos,authSign,nocPurpose);setNocOpen(false);setNocPurpose("");}catch(ex){showT("PDF error: "+ex.message,"err");}
              },style:{width:"100%",background:ACCENT,border:"none",borderRadius:9,padding:"10px",color:ACCENT_FG,fontSize:12,fontWeight:700,cursor:"pointer"}},"Download NOC")
            ]):null,

            // ── Increment / Salary Revision ──
            h("div",{style:{display:"flex",gap:8}},
              toggleBtn("Increment/Promotion","trending_up",function(){
                if(!incOpen){setIncRole(selE.role||"");setIncCTC(String(Number(selE.fixedSalary||selE.monthlyCTC||0)));setIncDate(todayStr);setIncReason("");}
                setIncOpen(!incOpen);
              },incOpen),
              toggleBtn("Salary Revision","payments",function(){
                if(!revOpen){setRevCTC(String(Number(selE.fixedSalary||selE.monthlyCTC||0)));setRevDate(todayStr);setRevReason("");}
                setRevOpen(!revOpen);
              },revOpen)
            ),
            incOpen?panel([
              h("div",{key:"role"},lbl("NEW DESIGNATION (LEAVE UNCHANGED IF PURE INCREMENT)"),h("input",{value:incRole,onChange:function(e){setIncRole(e.target.value);},style:{width:"100%",background:CARD,border:"1.5px solid "+BDR,borderRadius:8,padding:"9px 10px",fontSize:12.5,color:NVY,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}})),
              h("div",{key:"ctc"},lbl("NEW MONTHLY CTC (RS.) *"),h("input",{type:"number",value:incCTC,onChange:function(e){setIncCTC(e.target.value);},style:{width:"100%",background:CARD,border:"1.5px solid "+BDR,borderRadius:8,padding:"9px 10px",fontSize:12.5,color:NVY,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}})),
              h("div",{key:"date"},lbl("EFFECTIVE DATE"),datePick(incDate,function(v){setIncDate(v);},{question:"Effective date",wrapStyle:{marginBottom:0}})),
              h("div",{key:"reason"},lbl("REASON / NOTE (OPTIONAL)"),h("textarea",{value:incReason,onChange:function(e){setIncReason(e.target.value);},rows:2,style:{width:"100%",background:CARD,border:"1.5px solid "+BDR,borderRadius:8,padding:"9px 10px",fontSize:12.5,color:NVY,outline:"none",fontFamily:"inherit",resize:"vertical",boxSizing:"border-box"}})),
              h("button",{key:"b",onClick:function(){
                if(!Number(incCTC))return showT("Enter a valid amount","err");
                try{makeIncrementLetterPDF(selE,org,authPos,authSign,incRole,incCTC,incDate,incReason||"");setIncOpen(false);}catch(ex){showT("PDF error: "+ex.message,"err");}
              },style:{width:"100%",background:ACCENT,border:"none",borderRadius:9,padding:"10px",color:ACCENT_FG,fontSize:12,fontWeight:700,cursor:"pointer"}},"Download Letter")
            ]):null,
            revOpen?panel([
              h("div",{key:"ctc"},lbl("REVISED MONTHLY CTC (RS.) *"),h("input",{type:"number",value:revCTC,onChange:function(e){setRevCTC(e.target.value);},style:{width:"100%",background:CARD,border:"1.5px solid "+BDR,borderRadius:8,padding:"9px 10px",fontSize:12.5,color:NVY,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}})),
              h("div",{key:"date"},lbl("EFFECTIVE DATE"),datePick(revDate,function(v){setRevDate(v);},{question:"Effective date",wrapStyle:{marginBottom:0}})),
              h("div",{key:"reason"},lbl("REASON / NOTE (OPTIONAL)"),h("textarea",{value:revReason,onChange:function(e){setRevReason(e.target.value);},rows:2,style:{width:"100%",background:CARD,border:"1.5px solid "+BDR,borderRadius:8,padding:"9px 10px",fontSize:12.5,color:NVY,outline:"none",fontFamily:"inherit",resize:"vertical",boxSizing:"border-box"}})),
              h("button",{key:"b",onClick:function(){
                if(!Number(revCTC))return showT("Enter a valid amount","err");
                try{makeSalaryRevisionLetterPDF(selE,org,authPos,authSign,revCTC,revDate,revReason||"");setRevOpen(false);}catch(ex){showT("PDF error: "+ex.message,"err");}
              },style:{width:"100%",background:ACCENT,border:"none",borderRadius:9,padding:"10px",color:ACCENT_FG,fontSize:12,fontWeight:700,cursor:"pointer"}},"Download Letter")
            ]):null,

            h("button",{onClick:function(){try{makeRelievingLetterPDF(selE,org,authPos,authSign);}catch(ex){showT("PDF error: "+ex.message,"err");}},style:{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:5,background:ACCENT+"12",border:"1.5px solid "+ACCENT+"30",borderRadius:10,padding:"11px",color:ACCENT,fontSize:12,fontWeight:600,cursor:"pointer"}},ic("logout",ACCENT,13),"Relieving Letter")
          );
        }
      )
    );
  }

  function renderEditEmp(){
    if(!editE)return null;
    function setField(key,val){setEditE(function(prev){var n=Object.assign({},prev);n[key]=val;return n;});}
  
  function ccFlag(code){
    var map={"91":"\ud83c\uddee\ud83c\uddf3","1":"\ud83c\uddfa\ud83c\uddf8","44":"\ud83c\uddec\ud83c\udde7","971":"\ud83c\udde6\ud83c\uddea","966":"\ud83c\uddf8\ud83c\udde6","65":"\ud83c\uddf8\ud83c\uddec","60":"\ud83c\uddf2\ud83c\uddfe","61":"\ud83c\udde6\ud83c\uddfa","64":"\ud83c\uddf3\ud83c\uddff","94":"\ud83c\uddf1\ud83c\uddf0","880":"\ud83c\udde7\ud83c\udde9","977":"\ud83c\uddf3\ud83c\uddf5","974":"\ud83c\uddf6\ud83c\udde6","968":"\ud83c\uddf4\ud83c\uddf2","965":"\ud83c\uddf0\ud83c\uddfc","973":"\ud83c\udde7\ud83c\udded","49":"\ud83c\udde9\ud83c\uddea","33":"\ud83c\uddeb\ud83c\uddf7","81":"\ud83c\uddef\ud83c\uddf5","86":"\ud83c\udde8\ud83c\uddf3"};
    return map[code]||"\ud83c\udf0d";
  }

  function edInp(key,type,ph){
      return h("input",{type:type||"text",value:editE[key]||"",onChange:function(e){setField(key,e.target.value);},placeholder:ph||"",style:{width:"100%",background:SFT,border:"1.5px solid "+BDR,borderRadius:11,padding:"11px 13px",fontSize:13,color:NVY,outline:"none",fontFamily:"inherit",marginBottom:10}});
    }
    var inpStyle={width:"100%",background:SFT,border:"1.5px solid "+BDR,borderRadius:11,padding:"11px 13px",fontSize:13,color:NVY,fontFamily:"inherit",outline:"none",marginBottom:10};
    return h("div",{className:"fd"},
      h("button",{onClick:function(){setEditE(null);},style:{background:SFT,border:"1px solid "+BDR,borderRadius:7,padding:"5px 10px",color:NVY,fontSize:11,fontWeight:600,cursor:"pointer",marginBottom:10}},"Cancel"),
      h("div",{style:{fontSize:14,fontWeight:800,color:NVY,marginBottom:13}},"Edit — "+editE.name),
      card(h("div",null,
        h("div",{style:{fontSize:11,fontWeight:700,color:NVY,marginBottom:9}},"Personal"),
        lbl("FULL NAME"),edInp("name","text","Full name"),
        lbl("MOBILE"),
        h("div",{style:{display:"flex",gap:8,marginBottom:10}},
          h("div",{style:{width:92,flexShrink:0}},
            h("div",{style:{display:"flex",alignItems:"center",background:SFT,border:"1.5px solid "+BDR,borderRadius:11,padding:"0 8px",height:"100%"}},
              h("span",{style:{fontSize:14,marginRight:4}},ccFlag(editE.ccode||"91")),
              h("span",{style:{fontSize:13,color:NVY,fontWeight:600,marginRight:2}},"+"),
              h("input",{type:"tel",value:editE.ccode||"91",onChange:function(e){var v=e.target.value.replace(/\D/g,"").slice(0,4);setField("ccode",v);},placeholder:"91",style:{width:"100%",background:"transparent",border:"none",fontSize:13,color:NVY,outline:"none",fontFamily:"inherit",padding:"11px 0"}})
            )
          ),
          h("input",{type:"tel",value:editE.mob||"",onChange:function(e){var v=e.target.value.replace(/\D/g,"").slice(0,10);setField("mob",v);},placeholder:"10-digit number",maxLength:10,style:{flex:1,background:SFT,border:"1.5px solid "+BDR,borderRadius:11,padding:"11px 13px",fontSize:13,color:NVY,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}})
        ),
        lbl("NATIONALITY"),
        h("input",{type:"text",value:editE.nationality||"",onChange:function(e){setEditE(function(p){return Object.assign({},p,{nationality:e.target.value});});},placeholder:"e.g. Indian",style:{width:"100%",background:SFT,border:"1px solid "+BDR,borderRadius:9,padding:"9px 10px",fontSize:12,color:NVY,outline:"none",fontFamily:"inherit",marginBottom:12,boxSizing:"border-box"}}),
        lbl("EMAIL"),edInp("email","email","Email address"),
        lbl("EMPLOYEE ID"),edInp("eid","text","e.g. EMP006"),
        lbl("DATE OF BIRTH"),edInp("dob","date",""),
        lbl("DATE OF JOINING"),edInp("joined","date",""),
        lbl("PAN NUMBER"),edInp("pan","text","ABCDE1234F"),
        lbl("UAN NUMBER"),edInp("uan","text","UAN for PF filing"),
        lbl("AADHAR NUMBER"),edInp("aadhar","text","12-digit Aadhar"),
        lbl("ROLE / DESIGNATION"),
        chipSelect(editE.role||"",function(v){setField("role",v);},getRoles(org.type),{allowCustom:true,customPlaceholder:"Type the role...",question:"Choose the role"}),
        lbl("DEPARTMENT"),
        chipSelect(eDept||"",function(v){setEDept(v);},getDepts(org.type),{allowCustom:true,customPlaceholder:"Type the department...",question:"Choose the department"})
      )),
      card(h("div",null,
        h("div",{style:{fontSize:11,fontWeight:700,color:NVY,marginBottom:9}},"Salary"),
        lbl("SALARY TYPE"),
        h("div",{style:{display:"flex",background:SFT,borderRadius:10,padding:3,marginBottom:8,gap:3}},
          h("button",{onClick:function(){setEditE(function(p){return Object.assign({},p,{salaryType:"split"});});},style:{flex:1,background:(editE.salaryType||"split")==="split"?CARD:"transparent",border:(editE.salaryType||"split")==="split"?"1px solid "+BDR:"none",borderRadius:7,padding:"7px",color:(editE.salaryType||"split")==="split"?NVY:GRY,fontSize:11,fontWeight:600,cursor:"pointer"}},"Split"),
          h("button",{onClick:function(){setEditE(function(p){return Object.assign({},p,{salaryType:"fixed"});});},style:{flex:1,background:editE.salaryType==="fixed"?CARD:"transparent",border:editE.salaryType==="fixed"?"1px solid "+BDR:"none",borderRadius:7,padding:"7px",color:editE.salaryType==="fixed"?NVY:GRY,fontSize:11,fontWeight:600,cursor:"pointer"}},"Fixed")
        ),
        editE.salaryType==="fixed"?h("div",null,
          lbl("FIXED MONTHLY SALARY (Rs.)"),
          h("input",{type:"number",value:editE.fixedSalary||editE.monthlyCTC||"",onChange:function(e){setEditE(function(p){return Object.assign({},p,{fixedSalary:e.target.value,monthlyCTC:e.target.value,basic:e.target.value,hra:0,allow:0});});},placeholder:"e.g. 20000",style:{width:"100%",background:SFT,border:"1.5px solid "+BDR,borderRadius:10,padding:"10px 12px",fontSize:13,color:NVY,outline:"none",fontFamily:"inherit",marginBottom:10}})
        ):h("div",null,
        lbl("MONTHLY CTC (Rs.)"),
        h("input",{type:"number",value:editE.monthlyCTC||"",onChange:function(ev){
          var v=Number(ev.target.value)||0;
          setEditE(function(p){return Object.assign({},p,{
            monthlyCTC:String(v),
            basic:Math.round(v*0.5),
            hra:Math.round(v*0.2),
            allow:Math.round(v*0.3)
          });});
        },placeholder:"e.g. 50000",style:{width:"100%",background:SFT,border:"1.5px solid "+BDR,borderRadius:10,padding:"10px 12px",fontSize:13,color:NVY,outline:"none",fontFamily:"inherit",marginBottom:6}}),
        h("div",{style:{background:ACCENT_SOFT,borderRadius:8,padding:"7px 10px",marginBottom:4,fontSize:10,color:"#4F46E5"}},"Auto-split: 50% Basic · 20% HRA · 30% Allowance"),
        editE.monthlyCTC?h("div",{style:{display:"flex",gap:6,marginBottom:10}},
          [["Basic",Math.round(Number(editE.monthlyCTC)*0.5)],["HRA",Math.round(Number(editE.monthlyCTC)*0.2)],["Allow",Math.round(Number(editE.monthlyCTC)*0.3)]].map(function(x){
            return h("div",{key:x[0],style:{flex:1,background:SFT,borderRadius:8,padding:"6px 8px",textAlign:"center",border:"1px solid "+BDR}},
              h("div",{style:{fontSize:9,color:GRY,marginBottom:1}},x[0]),
              h("div",{style:{fontSize:11,fontWeight:700,color:NVY}},"Rs."+x[1].toLocaleString())
            );
          })
        ):null
        ),
        lbl("LEAVE ENTITLEMENT (days/year)"),edInp("leaveEntitlement","number","e.g. 12"),
        lbl("HEALTH INS. (Rs./mo)"),edInp("hi","number","e.g. 500")
      )),
      card(h("div",null,
        h("div",{style:{fontSize:11,fontWeight:700,color:NVY,marginBottom:9}},"Statutory"),
        togEl("EPF/PF","12% emp+employer",ePf,setEPf),
        ePf?h("div",{style:{padding:"8px 0",borderBottom:"1px solid "+BDR}},lbl("PF Mode"),h("div",{style:{display:"flex",gap:7}},[["capped","Capped Rs.1800"],["actual","Actual Basic"]].map(function(item){return h("button",{key:item[0],onClick:function(){setEPfM(item[0]);},style:{flex:1,background:ePfM===item[0]?ACCENT:SFT,border:"1.5px solid "+(ePfM===item[0]?ACCENT:BDR),borderRadius:9,padding:"8px",color:ePfM===item[0]?ACCENT_FG:GRY,fontSize:11,fontWeight:600,cursor:"pointer"}},item[1]);}))
        ):null,
        togEl("ESI","0.75% if gross up to Rs.21K",eEsi,setEEsi),
        togEl("Professional Tax","Rs.200/mo if above Rs.15K",ePt,setEPt),
        togEl("TDS","FY 2025-26 new regime",eTds,setETds),
        eTds?h("div",{style:{padding:"8px 0 0"}},
          lbl("TAX REGIME"),
          chipSelect(eTaxRegime,function(v){setETaxRegime(v);},[{v:"new",l:"New (Default)"},{v:"old",l:"Old Regime"}],{question:"Choose the tax regime"}),
          h("div",{style:{fontSize:9.5,color:GRY,lineHeight:1.4,marginTop:-2}},"Old regime here applies the standard Rs.50,000 deduction and slab rates only - it does not model HRA exemption, 80C or other deductions. For an employee with significant old-regime deductions, treat this as an estimate and verify with a tax professional.")
        ):null
      ),0),
      h("div",{style:{height:10}}),
      h("button",{onClick:saveEdit,style:{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:7,background:GRN,border:"none",borderRadius:12,padding:"13px",color:CARD,fontSize:14,fontWeight:700,cursor:"pointer"}},ic(ICONS.save,CARD,18),"Save Changes")
    );
  }


  function renderOffboard(){
    return h("div",{className:"fd"},
      h("button",{onClick:function(){setOffE(null);},style:{background:T.PILL_DANGER_BG,border:"none",borderRadius:7,padding:"5px 10px",color:RED,fontSize:11,fontWeight:600,cursor:"pointer",marginBottom:10}},"Cancel"),
      h("div",{style:{fontSize:14,fontWeight:800,color:NVY,marginBottom:3}},"Offboard Employee"),
      h("div",{style:{fontSize:11,color:GRY,marginBottom:12}},offE.name+" - "+offE.role),
      h("div",{style:{display:"flex",alignItems:"center",gap:5,marginBottom:14}},
        [1,2,3].map(function(s){return h("div",{key:s,style:{display:"flex",alignItems:"center",gap:5,flex:s<3?1:"auto"}},h("div",{style:{width:24,height:24,borderRadius:12,background:offStep>=s?RED:BDR,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:offStep>=s?CARD:GRY,flexShrink:0}},s),s<3?h("div",{style:{flex:1,height:2,background:offStep>s?RED:BDR,borderRadius:1}}):null);})
      ),
      offStep===1?card(h("div",null,
        h("div",{style:{fontSize:12,fontWeight:700,color:NVY,marginBottom:10}},"Step 1: Type and Reason"),
        h("div",{style:{marginBottom:11}},
          lbl("TYPE"),
          h("div",{style:{display:"flex",gap:7}},[["resigned","Resigned"],["terminated","Terminated"]].map(function(item){return h("button",{key:item[0],onClick:function(){setOffData(function(p){return Object.assign({},p,{type:item[0]});});},style:{flex:1,background:offData.type===item[0]?RED:SFT,border:"1.5px solid "+(offData.type===item[0]?RED:BDR),borderRadius:9,padding:"9px",color:offData.type===item[0]?CARD:GRY,fontSize:12,fontWeight:600,cursor:"pointer"}},item[1]);}))
        ),
        lbl("REASON *"),
        h("textarea",{value:offData.reason,onChange:function(e){setOffData(function(p){return Object.assign({},p,{reason:e.target.value});});},placeholder:"Enter reason...",rows:3,style:{width:"100%",background:SFT,border:"1.5px solid "+BDR,borderRadius:10,padding:"10px 12px",fontSize:12,color:NVY,outline:"none",fontFamily:"inherit",resize:"none",marginBottom:9}}),
        lbl("LAST WORKING DATE"),
        datePick(offData.resignDate,function(v){setOffData(function(p){return Object.assign({},p,{resignDate:v});});},{question:"Last working date"}),
        lbl("NOTE"),
        h("textarea",{value:offData.note,onChange:function(e){setOffData(function(p){return Object.assign({},p,{note:e.target.value});});},placeholder:"Additional notes...",rows:2,style:{width:"100%",background:SFT,border:"1.5px solid "+BDR,borderRadius:10,padding:"10px 12px",fontSize:12,color:NVY,outline:"none",fontFamily:"inherit",resize:"none"}})
      )):null,
      offStep===2?card(h("div",null,
        h("div",{style:{fontSize:12,fontWeight:700,color:NVY,marginBottom:10}},"Step 2: Property Handover"),
        h("div",{style:{display:"flex",flexWrap:"wrap",gap:7}},
          HO.map(function(item){var sel=offData.handover.includes(item);return h("button",{key:item,onClick:function(){setOffData(function(p){return Object.assign({},p,{handover:sel?p.handover.filter(function(i){return i!==item;}):p.handover.concat([item])});});},style:{background:sel?ACCENT:SFT,border:"1.5px solid "+(sel?ACCENT:BDR),borderRadius:18,padding:"6px 13px",fontSize:11,fontWeight:600,color:sel?ACCENT_FG:GRY,cursor:"pointer"}},(sel?"✓ ":"")+item);})
        )
      )):null,
      offStep===3?card(h("div",null,
        h("div",{style:{fontSize:12,fontWeight:700,color:NVY,marginBottom:10}},"Step 3: Confirm"),
        [["Employee",offE.name],["Type",offData.type],["Reason",offData.reason],["Last Day",offData.resignDate||"-"],["Handover",offData.handover.join(", ")||"None"],["Note",offData.note||"-"]].map(function(i){return row(i[0],i[1]);}),
        (function(){
          var resD=offData.resignDate||todayStr;
          var resDate=new Date(resD);
          var g=calcGratuity(getEffectiveEmp(offE,resDate.getFullYear(),resDate.getMonth()),resD);
          return g.eligible?h("div",{style:{background:T.PILL_OK_BG,border:"1px solid "+GRN+"44",borderRadius:9,padding:"10px 12px",marginTop:10}},
            h("div",{style:{fontSize:12,fontWeight:700,color:GRN,marginBottom:4}},"Gratuity Payable"),
            h("div",{style:{fontSize:11,color:GRY}},g.years+"y "+g.months+"m service ("+g.roundedYears+" rounded years)"),
            h("div",{style:{fontSize:18,fontWeight:800,color:GRN,marginTop:3}},fmt(g.amount)),
            h("div",{style:{fontSize:9,color:GRY,marginTop:2}},"Tax-free up to Rs.20L")
          ):h("div",{style:{background:SFT,borderRadius:8,padding:"8px 11px",marginTop:10,fontSize:11,color:GRY}},"Gratuity not applicable (less than 5 years of service)");
        })(),
        h("div",{style:{background:T.PILL_DANGER_SOFT,borderRadius:8,padding:"9px 11px",marginTop:10,fontSize:11,color:RED}},"This moves the employee to offboarded section.")
      )):null,
      h("div",{style:{display:"flex",gap:8,marginTop:3}},
        offStep>1?h("button",{onClick:function(){setOffStep(function(s){return s-1;});},style:{flex:1,background:SFT,border:"1px solid "+BDR,borderRadius:10,padding:11,color:GRY,fontSize:12,cursor:"pointer"}},"Back"):null,
        h("button",{onClick:function(){if(offStep<3)setOffStep(function(s){return s+1;});else confirmOff();},style:{flex:2,background:"linear-gradient(135deg,"+RED+",#B91C1C)",border:"none",borderRadius:10,padding:11,color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer"}},offStep===3?"Confirm Offboard":"Next")
      )
    );
  }

  function renderAttendance(){
    if(sheetE)return renderAttSheet();
    var todayDate=attY+"-"+String(attM+1).padStart(2,"0")+"-"+String(new Date().getDate()).padStart(2,"0");
    return h("div",{className:"fd"},
      h("div",{style:{display:"flex",background:SFT,borderRadius:12,padding:3,marginBottom:14,gap:3}},
        h("button",{onClick:function(){setAttView("calendar");},style:{flex:1,background:attView==="calendar"?CARD:"transparent",border:attView==="calendar"?"1px solid "+BDR:"none",borderRadius:9,padding:"9px",color:attView==="calendar"?NVY:GRY,fontSize:11,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5}},
          ic("calendar_month",attView==="calendar"?ACCENT:GRY,15),"Attendance"
        ),
        h("button",{onClick:function(){setAttView("report");},style:{flex:1,background:attView==="report"?CARD:"transparent",border:attView==="report"?"1px solid "+BDR:"none",borderRadius:9,padding:"9px",color:attView==="report"?NVY:GRY,fontSize:11,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5}},
          ic("insights",attView==="report"?ACCENT:GRY,15),"Report"
        ),
        h("button",{onClick:function(){setAttView("holidays");},style:{flex:1,background:attView==="holidays"?CARD:"transparent",border:attView==="holidays"?"1px solid "+BDR:"none",borderRadius:9,padding:"9px",color:attView==="holidays"?NVY:GRY,fontSize:11,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5}},
          ic("event_available",attView==="holidays"?ACCENT:GRY,15),"Holidays"
        )
      ),
      attView==="report"?renderAttendanceReport():attView==="holidays"?renderHolidayCalendar():h("div",null,
        h("div",{style:{display:"flex",gap:7,marginBottom:10,alignItems:"center"}},
          chipSelect(attY,function(v){var y=Number(v);setAttY(y);if(y===curY&&attM>curM)setAttM(curM);},pastYears().reverse(),{question:"Choose the year",btnLabel:"Okay",triggerStyle:{width:"auto",flex:"0 0 auto"},wrapStyle:{marginBottom:0}}),
          h("div",{style:{display:"flex",gap:5,flex:1,overflowX:"auto"}},
            pastMonths(attY).map(function(m2){return h("button",{key:m2,onClick:function(){setAttM(m2);},style:{flexShrink:0,background:attM===m2?ACCENT:CARD,border:"1px solid "+(attM===m2?ACCENT:BDR),borderRadius:15,padding:"4px 10px",color:attM===m2?ACCENT_FG:GRY,fontSize:11,fontWeight:600,cursor:"pointer"}},MOS[m2]);})
          )
        ),
      (function(){
        var statItems=[["Present",GRN,"present"],["Absent",RED,"absent"],["Half Day",AMB,"half"],["Paid Leave",PUR,"paid"],["Unpaid",IND,"unpaid"],["Holiday",SKY,"holiday"]];
        var counts=statItems.map(function(item){return actEmps.filter(function(e){return getAtt(todayDate,e.id)===item[2];}).length;});
        var marked=counts.reduce(function(a,b){return a+b;},0);
        return h("div",{style:{marginBottom:6}},
          /* Highlighted dropdown toggle */
          h("button",{onClick:function(){setAttStatsOpen(!attStatsOpen);},style:{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",background:ACCENT_SOFT,border:"1px solid "+ACCENT+"22",borderRadius:11,padding:"10px 13px",cursor:"pointer"}},
            h("div",{style:{display:"flex",alignItems:"center",gap:8}},
              h("div",{style:{width:28,height:28,borderRadius:8,background:ACCENT==="#FFFFFF"?"rgba(255,255,255,.12)":ACCENT+"16",display:"flex",alignItems:"center",justifyContent:"center"}},ic("insights",ACCENT==="#FFFFFF"?NVY:ACCENT,15)),
              h("div",{style:{textAlign:"left"}},
                h("div",{style:{fontSize:12,fontWeight:700,color:NVY}},"Today's Attendance"),
                h("div",{style:{fontSize:9.5,color:GRY}},marked+" of "+actEmps.length+" marked")
              )
            ),
            h("div",{style:{transform:attStatsOpen?"rotate(180deg)":"rotate(0deg)",transition:"transform .2s",display:"flex"}},ic("expand_more",GRY,18))
          ),
          /* Collapsible stats grid */
          attStatsOpen?h("div",{style:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginTop:8}},
            statItems.map(function(item,i){return h("div",{key:item[0],style:{background:CARD,border:"1px solid "+BDR,borderRadius:10,padding:"8px 4px",textAlign:"center"}},h("div",{style:{fontSize:16,fontWeight:800,color:item[1]}},counts[i]),h("div",{style:{fontSize:9,color:GRY,marginTop:1}},item[0]));})
          ):null
        );
      })(),
      h("div",{style:{background:SFT,border:"1px solid "+BDR,borderRadius:9,padding:"7px 10px",marginBottom:10,fontSize:11,color:GRY}},"Tap to cycle status. Paid Leave = no deduction."),
      h("div",{style:{display:"flex",gap:7,marginBottom:9}},
        h("button",{onClick:function(){
          var rt=new Date();var rts=rt.getFullYear()+"-"+String(rt.getMonth()+1).padStart(2,"0")+"-"+String(rt.getDate()).padStart(2,"0");
          if(todayDate>rts)return showT("Can't mark attendance for a future date","err");
          setAtt(function(v){var o=Object.assign({},v);actEmps.forEach(function(e){o[todayDate+"_"+e.id]="present";});return o;});showT("All marked Present");
        },style:{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,background:GRN+"14",border:"1px solid "+GRN+"55",borderRadius:10,padding:"9px",color:GRN,fontSize:12,fontWeight:700,cursor:"pointer"}},ic("check_circle",GRN,15),"Mark All Present"),
        h("button",{onClick:function(){markHolidayAll(todayDate);},style:{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,background:AMB+"14",border:"1px solid "+AMB+"55",borderRadius:10,padding:"9px",color:AMB,fontSize:12,fontWeight:700,cursor:"pointer"}},ic(ICONS.sun,AMB,15),"Mark All Holiday")
      ),
      isPaid?dlBtn("Download Attendance Report",function(){setShowAttExportMenu(true);}):h("button",{onClick:needPaid,style:{display:"flex",alignItems:"center",justifyContent:"center",gap:6,width:"100%",background:GRY,border:"none",borderRadius:12,padding:"12px",color:CARD,fontSize:12,fontWeight:600,cursor:"pointer",marginBottom:10}},ic("lock",CARD,16),"Download Attendance Report — Paid Plan"),
      showAttExportMenu?h(Modal,{title:"Choose Report Type",onClose:function(){setShowAttExportMenu(false);},bodyPad:14},
          h("button",{onClick:function(){setShowAttExportMenu(false);makeAttDetailedPDF(actEmps,att,attY,attM,org.name,org.contactEmail||org.email,org.position,LOGO_SRC,org.address||"",org.logo||"",authPos,authSign,org.phone,org.website);},style:{width:"100%",display:"flex",alignItems:"center",gap:11,background:SFT,border:"1px solid "+BDR,borderRadius:10,padding:"12px 13px",cursor:"pointer",marginBottom:9,textAlign:"left"}},
            ic("table_view",ACCENT,18),
            h("div",null,h("div",{style:{fontSize:12.5,fontWeight:700,color:NVY}},"Detailed"),h("div",{style:{fontSize:10,color:GRY,marginTop:1}},"Day-by-day attendance for every employee"))
          ),
          h("button",{onClick:function(){setShowAttExportMenu(false);makeAttSummaryPDF(actEmps,att,attM,attY,org.name,org.contactEmail||org.email,org.position,LOGO_SRC,org.address||"",org.logo||"",authPos,authSign,org.phone,org.website);},style:{width:"100%",display:"flex",alignItems:"center",gap:11,background:SFT,border:"1px solid "+BDR,borderRadius:10,padding:"12px 13px",cursor:"pointer",textAlign:"left"}},
            ic("insights",ACCENT,18),
            h("div",null,h("div",{style:{fontSize:12.5,fontWeight:700,color:NVY}},"Summary"),h("div",{style:{fontSize:10,color:GRY,marginTop:1}},"One row per employee with totals for the month"))
          )
      ):null,
      card(h("div",null,
        h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}},
          h("button",{onClick:function(){setAttSortDept(!attSortDept);},style:{display:"flex",alignItems:"center",gap:4,background:attSortDept?ACCENT:SFT,border:"1px solid "+(attSortDept?ACCENT:BDR),borderRadius:20,padding:"4px 10px",color:attSortDept?ACCENT_FG:GRY,fontSize:10.5,fontWeight:700,cursor:"pointer"}},ic("groups",attSortDept?ACCENT_FG:GRY,12),"Dept A\u2013Z"),
          h("div",{style:{fontSize:11,color:GRY,fontWeight:600}},String(today.getDate()).padStart(2,"0")+"."+String(today.getMonth()+1).padStart(2,"0")+"."+today.getFullYear()+" \u2022 "+today.toLocaleDateString("en-IN",{weekday:"short"}))
        ),
        (attSortDept?actEmps.slice().sort(function(a,b){return (a.dept||"No Department").toLowerCase().localeCompare((b.dept||"No Department").toLowerCase())||(a.name||"").localeCompare(b.name||"");}):actEmps).map(function(e,i,arr){
          var deptHeader=null;
          if(attSortDept){
            var curDept=e.dept||"No Department";
            var prevDept=i>0?(arr[i-1].dept||"No Department"):null;
            if(curDept!==prevDept){
              var deptCount=arr.filter(function(x){return (x.dept||"No Department")===curDept;}).length;
              deptHeader=h("div",{key:"hdr-"+curDept,style:{display:"flex",alignItems:"center",gap:8,margin:i===0?"0 0 8px":"14px 0 8px"}},
                h("div",{style:{fontSize:11,fontWeight:700,color:NVY,letterSpacing:.3}},curDept),
                h("div",{style:{flex:1,height:1,background:BDR}}),
                h("div",{style:{fontSize:10,color:GRY,fontWeight:600,background:SFT,borderRadius:10,padding:"2px 8px"}},deptCount)
              );
            }
          }
          var s=getAtt(todayDate,e.id),ma=mAtt(e.id,attY,attM);
          // Per-employee working days = marked days EXCLUDING holidays
          var daysInMo2=new Date(attY,attM+1,0).getDate();
          var empWorkingDays=0,empPresentDays=0,empAbsent=0,empHalf=0;
          for(var dd=1;dd<=daysInMo2;dd++){
            var ds3=attY+"-"+String(attM+1).padStart(2,"0")+"-"+String(dd).padStart(2,"0");
            var v3=att[ds3+"_"+e.id];
            // Working days = any status EXCEPT unmarked and holiday
            if(v3&&v3!=="unmarked"&&v3!=="holiday"){
              empWorkingDays++;
              if(v3==="present"){empPresentDays++;} 
              else if(v3==="half"){empHalf++;empPresentDays+=0.5;}
              else if(v3==="absent"){empAbsent++;}
            }
          }
          var empAttRate=empWorkingDays>0?Math.round(empPresentDays*100/empWorkingDays):0;
          var attRateCol=empAttRate>=95?"#10B981":empAttRate>=80?AMB:empAttRate>0?RED:GRY;
          // Display: "18.5 / 22 days" where half day = 0.5
          var presentDisplay=empHalf>0?(empPresentDays%1===0?empPresentDays:empPresentDays.toFixed(1)):empPresentDays;
          return h(React.Fragment,{key:e.id},deptHeader,h("div",{onClick:function(){setSheetE(e);},style:{borderBottom:i<arr.length-1?"1px solid "+BDR:"none",paddingBottom:8,marginBottom:8,cursor:"pointer"}},
            h("div",{className:"rh",style:{display:"flex",alignItems:"center",gap:9,borderRadius:6,padding:"2px 2px"}},
              av(e,36),
              h("div",{style:{flex:1,minWidth:0}},
                h("div",{style:{fontSize:12,fontWeight:600,color:NVY}},e.name),
                h("div",{style:{fontSize:10,color:GRY}},e.role||"No designation"),
                empWorkingDays>0?h("div",{style:{fontSize:10,fontWeight:600,color:attRateCol,marginTop:3}},
                  presentDisplay+" / "+empWorkingDays+" days"+(empHalf>0?" (incl. "+empHalf+" half)":"")
                ):h("div",{style:{fontSize:10,color:GRY,marginTop:3}},"No days marked")
              ),
              (function(){
                var dParts=todayDate.split("-");
                var empOnDay=isEmployedOnDay(e,Number(dParts[0]),Number(dParts[1])-1,Number(dParts[2]));
                if(!empOnDay){
                  return h("div",{onClick:function(ev){ev.stopPropagation();},style:{fontSize:10,fontWeight:700,padding:"7px 13px",borderRadius:16,background:SFT,color:GRY,border:"1px dashed "+BDR,flexShrink:0,userSelect:"none"}},"Not joined");
                }
                return h("div",{onClick:function(ev){ev.stopPropagation();cycleAtt(todayDate,e.id);},style:{fontSize:11.5,fontWeight:700,padding:"7px 13px",borderRadius:16,background:ATC[s]+"14",color:ATC[s],border:"1px solid "+ATC[s]+"35",flexShrink:0,cursor:"pointer",userSelect:"none",WebkitUserSelect:"none"}},ATL[s]);
              })()
            )
          ));
        })
      ),0)
      )
    );
  }

  function renderLeavesTab(){
    var filtered=leaveTab==="all"?leaveReqs:leaveReqs.filter(function(r){return r.status===leaveTab;});
    return h("div",null,
      h("div",{style:{display:"flex",gap:5,marginBottom:12,overflowX:"auto"}},
        [["pending","Pending"],["approved","Approved"],["rejected","Rejected"],["all","All"]].map(function(item){
          var cnt=item[0]==="pending"?leaveReqs.filter(function(r){return r.status==="pending";}).length:0;
          return h("button",{key:item[0],onClick:function(){setLeaveTab(item[0]);},style:{flexShrink:0,display:"flex",alignItems:"center",gap:4,background:leaveTab===item[0]?ACCENT:CARD,border:"1px solid "+(leaveTab===item[0]?ACCENT:BDR),borderRadius:15,padding:"5px 12px",color:leaveTab===item[0]?ACCENT_FG:GRY,fontSize:11,fontWeight:600,cursor:"pointer"}},
            item[1],
            cnt>0?h("span",{style:{background:"rgba(255,255,255,0.3)",borderRadius:10,padding:"0 5px",fontSize:9,color:"#fff"}},cnt):null
          );
        })
      ),
      filtered.length===0?h("div",{style:{textAlign:"center",padding:"32px 0",color:GRY}},
        ic("event_available",GRY,32),
        h("div",{style:{fontSize:13,marginTop:8}},leaveTab==="pending"?"No pending leave requests":"No leave records")
      ):
      filtered.map(function(r){
        var emp=emps.find(function(e){return e.email===r.employeeEmail;});
        return h("div",{key:r.id,style:{background:CARD,borderRadius:14,padding:"12px 14px",marginBottom:8,boxShadow:"0 2px 8px rgba(0,0,0,0.06)",borderLeft:"3px solid "+(r.status==="approved"?"#10B981":r.status==="rejected"?RED:AMB)}},
          h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}},
            h("div",{style:{display:"flex",alignItems:"center",gap:8}},
              emp?av(emp,30):h("div",{style:{width:30,height:30,borderRadius:"50%",background:SFT,display:"flex",alignItems:"center",justifyContent:"center"}},ic("person",GRY,16)),
              h("div",null,
                h("div",{style:{fontSize:12,fontWeight:700,color:NVY}},emp?emp.name:r.employeeEmail.split("@")[0]),
                h("div",{style:{fontSize:10,color:GRY,marginTop:1}},LEAVE_TYPES[r.leaveType].name)
              )
            ),
            h("div",{style:{fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:20,background:r.status==="approved"?"#D1FAE5":r.status==="rejected"?"#FEE2E2":"#FEF3C7",color:r.status==="approved"?"#065F46":r.status==="rejected"?"#991B1B":"#92400E"}},
              r.status.charAt(0).toUpperCase()+r.status.slice(1)
            )
          ),
          h("div",{style:{display:"flex",gap:12,marginBottom:r.reason?6:0}},
            h("div",{style:{fontSize:11,color:GRY,display:"flex",alignItems:"center",gap:4}},ic("calendar_today",GRY,11),r.fromDate+(r.toDate!==r.fromDate?" \u2192 "+r.toDate:"")),
            h("div",{style:{fontSize:11,color:GRY}},LEAVE_TYPES[r.leaveType].paid?"\u2022 Paid":"\u2022 Unpaid")
          ),
          r.reason?h("div",{style:{fontSize:11,color:GRY,marginBottom:6,fontStyle:"italic"}},"\""+r.reason+"\""):null,
          r.adminReply?h("div",{style:{background:RED+"10",borderRadius:7,padding:"5px 8px",fontSize:11,color:RED,marginBottom:6}},"Reply: "+r.adminReply):null,
          r.status==="pending"&&isPaid?h("div",{style:{display:"flex",gap:8,marginTop:8}},
            h("button",{onClick:function(){approveLeave(r.id);},style:{flex:1,background:"#10B981",border:"none",borderRadius:9,padding:"8px",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5}},ic("check_circle","#fff",14),"Approve"),
            h("button",{onClick:function(){askForm("Reject Leave Request",[{key:"reply",label:"Rejection reason",type:"textarea",placeholder:"Shown to employee"}],function(vals){rejectLeave(r.id,vals.reply);},{submitLabel:"Reject"});},style:{flex:1,background:RED,border:"none",borderRadius:9,padding:"8px",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5}},ic("cancel","#fff",14),"Reject")
          ):null
        );
      })
    );
  }

  function renderAttSheet(){
    var ma=mAtt(sheetE.id,attY,attM),attWD=getWorkingDays(att,sheetE.id,attY,attM),attPR=proRata(sheetE,attY,attM),effSheetE=getEffectiveEmp(sheetE,attY,attM),d=(attPR.notYetJoined||attPR.alreadyLeft)?calcPay(effSheetE,0,0,0,0,0,attWD,0,1):calcPay(effSheetE,ma.absent,ma.half,ma.unpaid,0,getShiftAllow(sheetE.id,attY,attM),attWD,attPR.active,attPR.total);
    var yr=attY,mo=attM;
    var hasDeduct=ma.absent>0||ma.half>0||ma.unpaid>0;
    return h("div",{className:"fd"},
      h("button",{onClick:function(){setSheetE(null);},style:{background:SFT,border:"1px solid "+BDR,borderRadius:7,padding:"5px 10px",color:NVY,fontSize:11,fontWeight:600,cursor:"pointer",marginBottom:10}},"Back"),
      h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}},
        h("div",null,h("div",{style:{fontSize:14,fontWeight:800,color:NVY}},sheetE.name),h("div",{style:{fontSize:11,color:GRY}},MOS[mo]+" "+yr)),
        h("div",{style:{display:"flex",gap:5}},
          h("button",{onClick:function(){shareAtt(sheetE);},style:{display:"flex",alignItems:"center",gap:4,background:SFT,border:"1px solid "+BDR,borderRadius:7,padding:"6px 10px",fontSize:11,color:NVY,fontWeight:700,cursor:"pointer"}},ic(isPaid?"whatsapp":"lock",isPaid?"#25D366":GRY,13),"WhatsApp")
        )
      ),
      (function(){
        var pr=proRata(sheetE,yr,mo);
        if(pr.notYetJoined){
          return h("div",{style:{background:T.PILL_INFO_BG||ACCENT_SOFT,border:"1px solid "+ACCENT+"33",borderRadius:12,padding:"16px",marginBottom:12,display:"flex",gap:11,alignItems:"center"}},
            h("div",{style:{width:38,height:38,borderRadius:10,background:ACCENT+"18",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}},ic("calendar_today",ACCENT==="#FFFFFF"?NVY:ACCENT,18)),
            h("div",null,
              h("div",{style:{fontSize:12.5,fontWeight:700,color:NVY,marginBottom:2}},"No records for this period"),
              h("div",{style:{fontSize:11,color:GRY,lineHeight:1.5}},sheetE.name+" joined on "+(sheetE.joined||"-")+". There is nothing to show before the joining date.")
            )
          );
        }
        if(pr.alreadyLeft){
          return h("div",{style:{background:T.PILL_DANGER_SOFT||RED+"10",border:"1px solid "+RED+"33",borderRadius:12,padding:"16px",marginBottom:12,display:"flex",gap:11,alignItems:"center"}},
            h("div",{style:{width:38,height:38,borderRadius:10,background:RED+"18",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}},ic("event_busy",RED,18)),
            h("div",null,
              h("div",{style:{fontSize:12.5,fontWeight:700,color:NVY,marginBottom:2}},"No records for this period"),
              h("div",{style:{fontSize:11,color:GRY,lineHeight:1.5}},sheetE.name+" left on "+(sheetE.resignDate||"-")+". There is nothing to show after the last working date.")
            )
          );
        }
        return null;
      })(),
      h("div",{style:{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:5,marginBottom:8}},
        [["P",ma.present,GRN],["A",ma.absent,RED],["H",ma.half,AMB],["PL",ma.paid,PUR],["UL",ma.unpaid,IND]].map(function(item){return h("div",{key:item[0],style:{background:item[2]+"12",borderRadius:8,padding:"7px 3px",textAlign:"center"}},h("div",{style:{fontSize:15,fontWeight:800,color:item[2]}},item[1]),h("div",{style:{fontSize:8,color:GRY}},item[0]));})
      ),
      h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",background:SFT,borderRadius:8,padding:"6px 10px",marginBottom:10}},
        h("span",{style:{fontSize:11,color:GRY}},"Working days this month"),
        h("span",{style:{fontSize:11,fontWeight:700,color:NVY}},attWD+" days")
      ),
      hasDeduct?h("div",{style:{background:T.PILL_DANGER_SOFT,borderRadius:7,padding:"5px 9px",fontSize:11,color:RED,marginBottom:10}},"Total deducted: "+fmt(d.ad+d.hd+d.ud)):null,
      card(h("div",null,
        h("div",{style:{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4}},
          (function(){
            var cells=[["Su","Mo","Tu","We","Th","Fr","Sa"].map(function(d2){return h("div",{key:d2,style:{fontSize:9,color:GRY,textAlign:"center",fontWeight:600,paddingBottom:4}},d2);})];
            var fd=new Date(yr,mo,1).getDay(),days=new Date(yr,mo+1,0).getDate();
            for(var xi=0;xi<fd;xi++)cells.push(h("div",{key:"x"+xi}));
            for(var day=1;day<=days;day++){
              var ds=yr+"-"+String(mo+1).padStart(2,"0")+"-"+String(day).padStart(2,"0");
              var k2=ds+"_"+sheetE.id,s=att[k2]||"unmarked",isTd=ds===todayStr,dayNum=day;
              var employed=isEmployedOnDay(sheetE,yr,mo,day);
              var isFuture=ds>todayStr; // cannot mark attendance for a day that hasn't happened yet
              if(!employed){
                cells.push(h("div",{key:day,style:{aspectRatio:"1",borderRadius:6,background:"transparent",border:"1px dashed "+BDR,display:"flex",alignItems:"center",justifyContent:"center",opacity:.4}},h("div",{style:{fontSize:11,fontWeight:400,color:GRY}},dayNum)));
                continue;
              }
              if(isFuture){
                cells.push(h("div",{key:day,onClick:function(){showT("Can't mark attendance for a future date","err");},style:{aspectRatio:"1",borderRadius:6,background:"transparent",border:"1px dashed "+BDR,display:"flex",alignItems:"center",justifyContent:"center",opacity:.35,cursor:"not-allowed"}},h("div",{style:{fontSize:11,fontWeight:400,color:GRY}},dayNum)));
                continue;
              }
              cells.push(h("div",{key:day,onClick:(function(kk){return function(){var cur=att[kk]||"unmarked",nxt=ATO[(ATO.indexOf(cur)+1)%ATO.length];setAtt(function(p){var o=Object.assign({},p);o[kk]=nxt;return o;});};})(k2),style:{aspectRatio:"1",borderRadius:6,background:s==="unmarked"?SFT:ATC[s]+"1C",border:isTd?"2px solid "+NVY:"1px solid "+(s==="unmarked"?BDR:ATC[s]+"35"),display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer"}},h("div",{style:{fontSize:11,fontWeight:isTd?800:500,color:s==="unmarked"?NVY:ATC[s]}},dayNum),s!=="unmarked"?h("div",{style:{fontSize:6,color:ATC[s],fontWeight:700}},ATL[s].slice(0,2)):null));
            }
            return cells;
          })()
        ),
        h("div",{style:{display:"flex",flexWrap:"wrap",gap:6,marginTop:9}},
          Object.entries(ATL).filter(function(kv){return kv[0]!=="unmarked";}).map(function(kv){return h("div",{key:kv[0],style:{display:"flex",alignItems:"center",gap:3}},h("div",{style:{width:8,height:8,borderRadius:2,background:ATC[kv[0]]}}),h("span",{style:{fontSize:9,color:GRY}},kv[1]));})
        )
      ),0),
      // ── Overtime marking card (day-wise) ──
      (proRata(sheetE,yr,mo).notYetJoined||proRata(sheetE,yr,mo).alreadyLeft)?null:card((function(){
        var entries=getOTEntries(sheetE.id,mo,yr);
        var otTotal=getOTAmount(sheetE.id,mo,yr);
        var otHrs=getOTHoursTotal(sheetE.id,mo,yr);
        return h("div",null,
          h("div",{style:{display:"flex",alignItems:"center",gap:8,marginBottom:11}},
            h("div",{style:{width:30,height:30,borderRadius:8,background:TEL+"15",display:"flex",alignItems:"center",justifyContent:"center"}},ic("clock",TEL,15)),
            h("div",{style:{flex:1}},
              h("div",{style:{fontSize:12,fontWeight:700,color:NVY}},"Overtime \u2014 "+MOS[mo]+" "+yr),
              otTotal>0?h("div",{style:{fontSize:10,color:TEL,fontWeight:600}},entries.length+" day"+(entries.length>1?"s":"")+(otHrs>0?" \u00b7 "+otHrs+" hrs":"")+" \u00b7 "+fmt(otTotal)):h("div",{style:{fontSize:10,color:GRY}},"No overtime recorded")
            )
          ),
          entries.length>0?h("div",{style:{marginBottom:11}},entries.map(function(o){
            return h("div",{key:o.id,style:{display:"flex",alignItems:"center",gap:9,padding:"8px 10px",background:SFT,borderRadius:9,marginBottom:5}},
              h("div",{style:{width:30,height:30,borderRadius:7,background:TEL+"18",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0}},
                h("div",{style:{fontSize:12,fontWeight:800,color:TEL,lineHeight:1}},o.day),
                h("div",{style:{fontSize:6,color:TEL,fontWeight:600}},MOS[mo].slice(0,3).toUpperCase())
              ),
              h("div",{style:{flex:1,minWidth:0}},
                h("div",{style:{display:"flex",alignItems:"center",gap:5,marginBottom:1}},
                  h("div",{style:{fontSize:8,fontWeight:800,letterSpacing:.3,color:o.mode==="hours"?"#2563EB":AMB,background:(o.mode==="hours"?"#2563EB":AMB)+"18",borderRadius:4,padding:"1px 5px"}},o.mode==="hours"?"HOURLY":"FLAT"),
                  h("div",{style:{fontSize:11.5,fontWeight:600,color:NVY}},o.mode==="hours"?(o.hours+" hrs \u00d7 "+fmt(o.rate)):"Flat amount")
                ),
                h("div",{style:{fontSize:9.5,color:GRY}},o.mode==="hours"?"Overtime pay":"Fixed overtime pay")
              ),
              h("div",{style:{fontSize:12.5,fontWeight:800,color:TEL,flexShrink:0}},fmt(otEntryAmount(o))),
              h("button",{onClick:function(){deleteOTEntry(o.id);},style:{background:"none",border:"none",cursor:"pointer",padding:2,flexShrink:0,display:"flex"}},ic("delete",RED,13))
            );
          })):null,
          (function(){
            var empRate=Number(sheetE.otRate||0);
            var empFlat=Number(sheetE.otFlat||0);
            if(!empRate&&!empFlat){
              return h("div",{style:{background:AMB+"12",border:"1px solid "+AMB+"30",borderRadius:10,padding:"13px 14px",display:"flex",gap:10,alignItems:"center"}},
                ic("info",AMB,18),
                h("div",null,
                  h("div",{style:{fontSize:11.5,fontWeight:700,color:NVY,marginBottom:2}},"OT pay not set up"),
                  h("div",{style:{fontSize:10.5,color:GRY,lineHeight:1.5}},"Set "+sheetE.name+"'s overtime rates in their profile \u2192 Shift + OT tab, then add overtime here.")
                )
              );
            }
            var todayStr2=new Date().toLocaleDateString("en-IN",{day:"numeric",month:"short"});
            return h("div",{style:{background:SFT,borderRadius:10,padding:11}},
              h("div",{style:{fontSize:9,fontWeight:700,color:GRY,letterSpacing:.6,marginBottom:8}},"ADD OVERTIME"),
              /* Date: Today / Pick */
              h("div",{style:{display:"flex",gap:6,marginBottom:7}},
                h("button",{onClick:function(){setOtDateMode("today");},style:{flex:1,background:otDateMode==="today"?TEL:CARD,border:"1px solid "+(otDateMode==="today"?TEL:BDR),borderRadius:8,padding:"8px",fontSize:11,fontWeight:700,color:otDateMode==="today"?"#fff":GRY,cursor:"pointer"}},"Today"),
                h("button",{onClick:function(){setOtDateMode("pick");},style:{flex:1,background:otDateMode==="pick"?TEL:CARD,border:"1px solid "+(otDateMode==="pick"?TEL:BDR),borderRadius:8,padding:"8px",fontSize:11,fontWeight:700,color:otDateMode==="pick"?"#fff":GRY,cursor:"pointer"}},"Pick Date")
              ),
              otDateMode==="pick"?datePick(otPickedDate,function(v){setOtPickedDate(v);},{question:"Choose date",wrapStyle:{marginBottom:7}}):h("div",{style:{fontSize:10,color:GRY,marginBottom:7}},"For today, "+todayStr2),
              /* Hourly / Flat toggle */
              h("div",{style:{display:"flex",gap:6,marginBottom:8,background:CARD,borderRadius:9,padding:3}},
                [["hours","Hourly"],["amount","Flat"]].map(function(t){
                  var on=otMarkMode===t[0];
                  var dis=t[0]==="hours"?!empRate:!empFlat;
                  return h("button",{key:t[0],onClick:function(){if(!dis)setOtMarkMode(t[0]);},style:{flex:1,background:on?TEL:"transparent",border:"none",borderRadius:7,padding:"8px",fontSize:11,fontWeight:700,color:dis?BDR:(on?"#fff":GRY),cursor:dis?"not-allowed":"pointer"}},t[1]+(t[0]==="hours"&&empRate?" \u00b7 "+fmt(empRate)+"/hr":"")+(t[0]==="amount"&&empFlat?" \u00b7 "+fmt(empFlat):""));
                })
              ),
              /* Hours input only when hourly */
              otMarkMode==="hours"?h("div",{style:{marginBottom:8}},
                h("input",{type:"number",value:otHours,onChange:function(e){setOtHours(e.target.value);},placeholder:"Enter hours, e.g. 3",style:{width:"100%",background:CARD,border:"1px solid "+BDR,borderRadius:8,padding:"9px 10px",fontSize:13,color:NVY,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}})
              ):null,
              /* Preview */
              otMarkMode==="hours"&&otHours?h("div",{style:{fontSize:11,color:TEL,fontWeight:600,marginBottom:8,textAlign:"center"}},otHours+" hrs \u00d7 "+fmt(empRate)+" = "+fmt(Math.round(Number(otHours)*empRate))):null,
              otMarkMode==="amount"?h("div",{style:{fontSize:11,color:TEL,fontWeight:600,marginBottom:8,textAlign:"center"}},"Flat overtime: "+fmt(empFlat)):null,
              h("button",{onClick:function(){addOTEntry(sheetE,mo,yr);},style:{width:"100%",background:TEL,border:"none",borderRadius:9,padding:"10px",fontSize:12,fontWeight:700,color:"#fff",cursor:"pointer"}},"+ Add Overtime")
            );
          })()
        );
      })(),0)
    );
  }

  function renderPayroll(){
    var depts=[""].concat(getDepts(org.type).filter(function(d){return actEmps.some(function(e){return e.dept===d;});}));
    var filtEmpsRaw=payFilt==="dept"&&payDept?actEmpsForPayroll.filter(function(e){return e.dept===payDept;}):actEmpsForPayroll;
    // One pay computation per employee — every number on this page derives from this single array,
    // so Gross/Absent/Tax/Bonus/Loan/Net are guaranteed to add up exactly (no separately-recalculated figures to drift apart).
    var filtPayData=filtEmpsRaw.map(function(e){return getMonthPay(e,payY,payM);});
    var filtActivePD=filtPayData.filter(function(mp){return mp.isActive;});
    var filtEmps=filtActivePD.map(function(mp){return mp.emp;});
    var hiddenCount=filtEmpsRaw.length-filtEmps.length;
    var filtGross=filtActivePD.reduce(function(a,mp){return a+mp.d.basic+mp.d.hra+mp.d.allow+mp.d.inc+mp.d.shiftAllow;},0); // full entitlement for active days, before absent/half-day deduction
    var filtAttDed=filtActivePD.reduce(function(a,mp){return a+mp.attDed;},0);
    var filtTaxDed=filtActivePD.reduce(function(a,mp){return a+mp.statDed;},0);
    var filtBonus=filtActivePD.reduce(function(a,mp){return a+mp.extraPay;},0); // bonus + reimbursement + OT
    var filtLoanDed=filtActivePD.reduce(function(a,mp){return a+mp.loanDed;},0);
    var filtNet=filtActivePD.reduce(function(a,mp){return a+mp.netFinal;},0);
    var filtDed=filtGross-filtNet;
    return h("div",{className:"fd"},
      h("div",{style:{display:"flex",gap:7,marginBottom:10,alignItems:"center"}},
        chipSelect(payY,function(v){var y=Number(v);setPayY(y);if(y===curY&&payM>curM)setPayM(curM);},pastYears().reverse(),{question:"Choose the year",btnLabel:"Okay",triggerStyle:{width:"auto",flex:"0 0 auto"},wrapStyle:{marginBottom:0}}),
        h("div",{style:{display:"flex",gap:5,flex:1,overflowX:"auto"}},
          pastMonths(payY).map(function(m2){return h("button",{key:m2,onClick:function(){setPayM(m2);},style:{flexShrink:0,background:payM===m2?ACCENT:CARD,border:"1px solid "+(payM===m2?ACCENT:BDR),borderRadius:15,padding:"4px 10px",color:payM===m2?ACCENT_FG:GRY,fontSize:11,fontWeight:600,cursor:"pointer"}},MOS[m2]);})
        )
      ),
      // ── Summary card — formula, theme-matched to the dashboard greeting card ──
      h("div",{style:{background:NVY,borderRadius:18,padding:"16px",marginBottom:11,boxShadow:T.SHADOW_LG,border:"1px solid "+(themeMode==="light"?"rgba(255,255,255,.06)":"rgba(0,0,0,.08)")}},
        h("div",{style:{fontSize:11,color:CARD,opacity:.55,marginBottom:10,letterSpacing:.3}},MOS[payM]+" "+payY+" • "+filtEmps.length+" Employee"+(filtEmps.length===1?"":"s")+(hiddenCount>0?" • "+hiddenCount+" not in this period":"")),
        // formula row — every term here is pulled from the same getMonthPay() data, so it always reconciles to NET PAY exactly
        (function(){
          var negC=themeMode==="light"?"#FCA5A5":"#DC2626";
          var posC=themeMode==="light"?"#FCD34D":"#B45309";
          var finalC=themeMode==="light"?"#4ADE80":"#059669";
          var mutedC=themeMode==="light"?"rgba(255,255,255,.4)":"rgba(0,0,0,.45)";
          var sepC=themeMode==="light"?"rgba(255,255,255,.3)":"rgba(0,0,0,.3)";
          // Order: GROSS, then additions (Bonus/OT), then deductions (Absent, Tax/Ded, Loan), then = NET PAY
          var terms=[
            {l:"GROSS",v:fmt(filtGross),op:null,c:CARD},
            filtBonus>0?{l:"BONUS/OT",v:fmt(filtBonus),op:"+",c:posC}:null,
            {l:"ABSENT",v:filtAttDed>0?fmt(filtAttDed):"Nil",op:"\u2212",c:negC},
            {l:"TAX/DED",v:filtTaxDed>0?fmt(filtTaxDed):"Nil",op:"\u2212",c:negC},
            filtLoanDed>0?{l:"LOAN/EMI",v:fmt(filtLoanDed),op:"\u2212",c:negC}:null,
            {l:"NET PAY",v:fmt(filtNet),op:"=",c:finalC}
          ].filter(Boolean);
          var tight=terms.length>4;
          var fs=terms.length>=6?10:terms.length>4?11.5:14;
          return h("div",{style:{display:"flex",alignItems:"flex-start",justifyContent:"center",gap:tight?4:8,marginBottom:14,flexWrap:"wrap",rowGap:10}},
            terms.map(function(t,i){
              return h("div",{key:"t"+i,style:{display:"flex",alignItems:"center",gap:tight?4:8,flex:"0 1 auto"}},
                t.op?h("div",{style:{color:sepC,fontSize:tight?14:18,fontWeight:300,flexShrink:0}},t.op):null,
                h("div",{style:{textAlign:"center",minWidth:58}},
                  h("div",{style:{fontSize:8.5,fontWeight:700,color:mutedC,letterSpacing:.5,marginBottom:4}},t.l),
                  h("div",{style:{fontSize:fs,fontWeight:800,color:t.c,whiteSpace:"nowrap"}},t.v)
                )
              );
            })
          );
        })(),
        h("div",{style:{height:1,background:themeMode==="light"?"rgba(255,255,255,.08)":"rgba(0,0,0,.10)",marginBottom:10}}),
        h("div",{style:{textAlign:"center"}},
          h("div",{style:{fontSize:10,color:CARD,opacity:.45,marginBottom:3}},"TOTAL TRANSFER THIS MONTH"),
          h("div",{style:{fontSize:21,fontWeight:900,color:themeMode==="light"?"#4ADE80":"#059669",letterSpacing:-.5}},fmt(filtNet))
        )
      ),
      h("div",{style:{background:CARD,border:"1px solid "+BDR,borderRadius:11,padding:3,display:"flex",gap:3,marginBottom:8}},
        [["emp","Employee"],["dept","Dept"],["er","Employer"],["annual","Annual"]].map(function(item){return h("button",{key:item[0],onClick:function(){setRepV(item[0]);},style:{flex:1,background:repV===item[0]?ACCENT:"transparent",border:"none",borderRadius:9,padding:"7px",color:repV===item[0]?ACCENT_FG:GRY,fontSize:11,fontWeight:600,cursor:"pointer"}},item[1]);})
      ),
      repV==="dept"?h("div",null,
        h("div",{style:{display:"flex",gap:7,marginBottom:11,alignItems:"center"}},
          chipSelect(payDept,function(v){setPayDept(v);},[{v:"",l:"All Departments"}].concat(getDepts(org.type).filter(function(d){return actEmps.some(function(e){return e.dept===d;});}).map(function(d){return {v:d,l:d};})),{question:"Choose the department",btnLabel:"Okay",wrapStyle:{flex:1,marginBottom:0}}),
          h("button",{onClick:function(){
            if(!isPaid){showT("PDF download is a Pro feature","info");window.open("https://wa.me/918072293384?text="+encodeURIComponent("Hi, I want to upgrade to Admin HR Pro for PDF downloads"),"_blank");return;}
            var deptListPdf=payDept?[payDept]:getDepts(org.type).filter(function(d){return actEmps.some(function(e){return e.dept===d;});});
            var deptGroups=deptListPdf.map(function(d){return {dept:d,emps:actEmps.filter(function(e){return e.dept===d;})};}).filter(function(g){return g.emps.length>0;});
            if(deptGroups.length===0)return showT("No employees to include","err");
            makeDeptPayrollPDF(deptGroups,payM,payY,getMonthPay,org.name,org.contactEmail||org.email,org.position,LOGO_SRC,org.address||"",org.logo||"",authPos,authSign,org.phone,org.website);
          },style:{flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",gap:5,background:isPaid?ACCENT:SFT,border:"1px solid "+(isPaid?ACCENT:BDR),borderRadius:9,padding:"9px 12px",color:isPaid?ACCENT_FG:GRY,fontSize:11.5,fontWeight:700,cursor:"pointer"}},ic(isPaid?"download":"lock",isPaid?ACCENT_FG:GRY,14),"PDF")
        ),
        (function(){
          var deptList=payDept?[payDept]:getDepts(org.type).filter(function(d){return actEmps.some(function(e){return e.dept===d;});});
          return h("div",null,deptList.map(function(dept){
            var dEmps=actEmps.filter(function(e){return e.dept===dept;});
            var dPD=dEmps.map(function(e){return {emp:e,mp:getMonthPay(e,payY,payM)};}); // one computation per employee — same source as Employee tab
            var dTot=dPD.reduce(function(a,x){a.gross+=x.mp.d.basic+x.mp.d.hra+x.mp.d.allow+x.mp.d.inc+x.mp.d.shiftAllow;a.attDed+=x.mp.attDed;a.statDed+=x.mp.statDed;a.bonus+=x.mp.extraPay;a.loan+=x.mp.loanDed;a.net+=x.mp.netFinal;return a;},{gross:0,attDed:0,statDed:0,bonus:0,loan:0,net:0});
            var dDed=dTot.attDed+dTot.statDed+dTot.loan;
            return card(h("div",null,
              h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:9}},
                h("div",{style:{fontSize:13,fontWeight:700,color:NVY}},dept),
                h("div",{style:{textAlign:"right"}},h("div",{style:{fontSize:13,fontWeight:800,color:GRN}},fmt(dTot.net)),h("div",{style:{fontSize:9,color:GRY}},dEmps.length+" employee"+(dEmps.length===1?"":"s")))
              ),
              h("div",{style:{display:"flex",gap:6,marginBottom:10}},
                h("div",{style:{flex:1,minWidth:0,overflow:"hidden",background:ACCENT_SOFT,borderRadius:8,padding:"6px 8px"}},h("div",{style:{fontSize:9,color:GRY}},"Gross"),h("div",{style:{fontSize:11,fontWeight:700,color:NVY,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}},fmt(dTot.gross))),
                h("div",{style:{flex:1,minWidth:0,overflow:"hidden",background:RED+"12",borderRadius:8,padding:"6px 8px"}},h("div",{style:{fontSize:9,color:GRY}},"Deductions"),h("div",{style:{fontSize:11,fontWeight:700,color:RED,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}},fmt(dDed))),
                dTot.bonus>0?h("div",{style:{flex:1,minWidth:0,overflow:"hidden",background:AMB+"14",borderRadius:8,padding:"6px 8px"}},h("div",{style:{fontSize:9,color:GRY}},"Bonus"),h("div",{style:{fontSize:11,fontWeight:700,color:AMB,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}},fmt(dTot.bonus))):null
              ),
              dPD.map(function(x,i){
                var e=x.emp,mp=x.mp,d2=mp.d,isOd=deptExpEmp===(dept+"_"+e.id);
                return h("div",{key:e.id,style:{borderTop:"1px solid "+BDR}},
                  h("div",{onClick:function(){setDeptExpEmp(isOd?null:(dept+"_"+e.id));},style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",cursor:"pointer"}},
                    h("div",{style:{display:"flex",alignItems:"center",gap:7}},av(e,28),h("div",null,h("div",{style:{fontSize:11,fontWeight:600,color:NVY}},e.name),h("div",{style:{fontSize:9,color:GRY}},e.role||(mp.isActive?"":"Not active this month")))),
                    h("div",{style:{display:"flex",alignItems:"center",gap:4}},
                      h("div",{style:{textAlign:"right"}},h("div",{style:{fontSize:11,fontWeight:700,color:GRN}},fmt(mp.netFinal)),h("div",{style:{fontSize:9,color:RED}},(mp.attDed+mp.statDed+mp.loanDed)>0?"-"+fmt(mp.attDed+mp.statDed+mp.loanDed):"No deductions")),
                      ic(isOd?"expand_less":"expand_more",GRY,16)
                    )
                  ),
                  isOd?h("div",{style:{background:"rgba(0,0,0,0.03)",borderRadius:10,padding:"10px",border:"1px solid "+BDR,marginBottom:8}},
                    h("div",{style:{fontSize:9,fontWeight:700,color:GRY,letterSpacing:1,marginBottom:4}},"EARNINGS"),
                    [
                      d2.isFixed?["Fixed Salary",fmt(d2.basic),NVY]:["Basic",fmt(d2.basic),NVY],
                      d2.isFixed?null:["HRA",fmt(d2.hra),NVY],
                      d2.isFixed?null:["Allowances",fmt(d2.allow),NVY],
                      d2.inc>0?["Incentive",fmt(d2.inc),"#059669"]:null,
                      d2.shiftAllow>0?["Shift Allow.",fmt(d2.shiftAllow),TEL]:null,
                    ].filter(Boolean).map(function(item){return h("div",{key:item[0],style:{display:"flex",justifyContent:"space-between",padding:"3px 0",borderBottom:"1px solid "+BDR+"44"}},h("span",{style:{fontSize:10.5,color:GRY}},item[0]),h("span",{style:{fontSize:10.5,fontWeight:600,color:item[2]}},item[1]));}),
                    mp.attDed>0?h("div",{onClick:function(){setTdsInfoOpen(tdsInfoOpen===("deptatt_"+e.id)?null:"deptatt_"+e.id);},style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"3px 0",borderBottom:"1px solid "+BDR+"44",cursor:"pointer"}},h("span",{style:{fontSize:10.5,color:GRY,display:"flex",alignItems:"center",gap:3}},"Absent/Half",ic(tdsInfoOpen===("deptatt_"+e.id)?"expand_less":"expand_more",GRY,12)),h("span",{style:{fontSize:10.5,fontWeight:600,color:AMB}},"-"+fmt(mp.attDed))):null,
                    mp.attDed>0&&tdsInfoOpen===("deptatt_"+e.id)?renderAttDedBreakdown(mp):null,
                    h("div",{style:{display:"flex",justifyContent:"space-between",padding:"4px 0",marginBottom:6}},h("span",{style:{fontSize:10.5,fontWeight:600,color:NVY}},"Effective Gross"),h("span",{style:{fontSize:10.5,fontWeight:800,color:NVY}},fmt(d2.gr))),
                    mp.statDed>0?h("div",null,
                      h("div",{style:{fontSize:9,fontWeight:700,color:GRY,letterSpacing:1,marginBottom:4}},"DEDUCTIONS"),
                      [
                        d2.pfE>0?[d2.pfMode==="actual"?"PF (Emp 12%)":"PF (12% capped)","-"+fmt(d2.pfE),NVY]:null,
                        d2.esiE>0?["ESI (Emp 0.75%)","-"+fmt(d2.esiE),TEL]:null,
                        d2.pt>0?["Prof. Tax","-"+fmt(d2.pt),AMB]:null,
                      ].filter(Boolean).map(function(item){return h("div",{key:item[0],style:{display:"flex",justifyContent:"space-between",padding:"3px 0",borderBottom:"1px solid "+BDR+"44"}},h("span",{style:{fontSize:10.5,color:GRY}},item[0]),h("span",{style:{fontSize:10.5,fontWeight:600,color:item[2]}},item[1]));}),
                      d2.tds>0?h("div",{onClick:function(){setTdsInfoOpen(tdsInfoOpen===("dept_"+e.id)?null:"dept_"+e.id);},style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"3px 0",borderBottom:"1px solid "+BDR+"44",cursor:"pointer"}},
                        h("span",{style:{fontSize:10.5,color:GRY,display:"flex",alignItems:"center",gap:3}},"TDS",ic(tdsInfoOpen===("dept_"+e.id)?"expand_less":"expand_more",GRY,12)),
                        h("span",{style:{fontSize:10.5,fontWeight:600,color:RED}},"-"+fmt(d2.tds))
                      ):null,
                      d2.tds>0&&tdsInfoOpen===("dept_"+e.id)?renderTdsBreakdown(mp):null,
                      [
                        d2.hi>0?["Health Ins.","-"+fmt(d2.hi),"#EC4899"]:null,
                        d2.cd>0?["Other","-"+fmt(d2.cd),GRY]:null,
                      ].filter(Boolean).map(function(item){return h("div",{key:item[0],style:{display:"flex",justifyContent:"space-between",padding:"3px 0",borderBottom:"1px solid "+BDR+"44"}},h("span",{style:{fontSize:10.5,color:GRY}},item[0]),h("span",{style:{fontSize:10.5,fontWeight:600,color:item[2]}},item[1]));}),
                      h("div",{style:{display:"flex",justifyContent:"space-between",padding:"4px 0",marginBottom:6}},h("span",{style:{fontSize:10.5,fontWeight:600,color:NVY}},"Total Deductions"),h("span",{style:{fontSize:10.5,fontWeight:800,color:RED}},"-"+fmt(mp.statDed)))
                    ):null,
                    mp.claimTotal>0?h("div",{style:{display:"flex",justifyContent:"space-between",padding:"3px 0",borderBottom:"1px solid "+BDR+"44"}},h("span",{style:{fontSize:10.5,color:GRY}},"Reimbursement"),h("span",{style:{fontSize:10.5,fontWeight:600,color:"#10B981"}},"+"+fmt(mp.claimTotal))):null,
                    mp.otTotal>0?h("div",{style:{display:"flex",justifyContent:"space-between",padding:"3px 0",borderBottom:"1px solid "+BDR+"44"}},h("span",{style:{fontSize:10.5,color:GRY}},"Overtime"),h("span",{style:{fontSize:10.5,fontWeight:600,color:TEL}},"+"+fmt(mp.otTotal))):null,
                    mp.bonusTotal>0?h("div",{style:{display:"flex",justifyContent:"space-between",padding:"3px 0",borderBottom:"1px solid "+BDR+"44"}},h("span",{style:{fontSize:10.5,color:GRY}},"Bonus"),h("span",{style:{fontSize:10.5,fontWeight:600,color:AMB}},"+"+fmt(mp.bonusTotal))):null,
                    mp.loanDed>0?h("div",{style:{display:"flex",justifyContent:"space-between",padding:"3px 0",borderBottom:"1px solid "+BDR+"44"}},h("span",{style:{fontSize:10.5,color:GRY}},"Loan/Advance EMI"),h("span",{style:{fontSize:10.5,fontWeight:600,color:RED}},"-"+fmt(mp.loanDed))):null,
                    h("div",{style:{background:"#0F172A",borderRadius:9,padding:"8px 12px",display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:6}},
                      h("span",{style:{fontSize:11,fontWeight:600,color:"rgba(255,255,255,.6)"}},"Net Take Home"),
                      h("span",{style:{fontSize:14,fontWeight:800,color:"#4ADE80"}},fmt(mp.netFinal))
                    )
                  ):null
                );
              })
            ));
          }));
        })()
      ):repV==="emp"?card(h("div",null,
        h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:11}},
          h("div",{style:{fontSize:12,fontWeight:700,color:NVY}},"Individual Payslips"),
          h("button",{onClick:function(){setPaySortDept(!paySortDept);},style:{display:"flex",alignItems:"center",gap:4,background:paySortDept?ACCENT:SFT,border:"1px solid "+(paySortDept?ACCENT:BDR),borderRadius:20,padding:"4px 10px",color:paySortDept?ACCENT_FG:GRY,fontSize:10.5,fontWeight:700,cursor:"pointer"}},ic("groups",paySortDept?ACCENT_FG:GRY,12),"Dept A\u2013Z")
        ),
        (paySortDept?actEmps.slice().sort(function(a,b){return (a.dept||"No Department").toLowerCase().localeCompare((b.dept||"No Department").toLowerCase())||(a.name||"").localeCompare(b.name||"");}):actEmps).map(function(e,i,arr){
          var deptHeader=null;
          if(paySortDept){
            var curDept=e.dept||"No Department";
            var prevDept=i>0?(arr[i-1].dept||"No Department"):null;
            if(curDept!==prevDept){
              var deptCount=arr.filter(function(x){return (x.dept||"No Department")===curDept;}).length;
              deptHeader=h("div",{key:"hdr-"+curDept,style:{display:"flex",alignItems:"center",gap:8,margin:i===0?"0 0 8px":"14px 0 8px"}},
                h("div",{style:{fontSize:11,fontWeight:700,color:NVY,letterSpacing:.3}},curDept),
                h("div",{style:{flex:1,height:1,background:BDR}}),
                h("div",{style:{fontSize:10,color:GRY,fontWeight:600,background:SFT,borderRadius:10,padding:"2px 8px"}},deptCount)
              );
            }
          }
          var isFixed=e.salaryType==="fixed"; // declare here so it's in scope for Details section
          var mp=getMonthPay(e,payY,payM);
          var eEff=mp.eEff,d=mp.d,isO=editPayE&&editPayE.id===e.id;
          var attDed=mp.attDed,statDed=mp.statDed,totalDed=mp.totalDed;
          var extraPay=mp.extraPay;
          var netWithExtra=mp.netFinal; // = gross − absent − stat.ded + bonus/claim/OT − loan EMI (same figure shown when expanded)
          return h(React.Fragment,{key:e.id},deptHeader,h("div",{style:{borderBottom:i<arr.length-1?"1px solid "+BDR:"none",paddingBottom:12,marginBottom:12}},
            // Row 1: avatar + name + salary type + NET PAY — tap anywhere to expand/collapse details
            h("div",{onClick:function(){setEditPayE(isO?null:e);setEditPayInc(String(getInc(e.id,payY,payM)));},style:{display:"flex",alignItems:"center",gap:9,marginBottom:isO?8:0,cursor:"pointer"}},
              av(e,38),
              h("div",{style:{flex:1}},
                h("div",{style:{fontSize:13,fontWeight:700,color:NVY}},e.name),
                h("div",{style:{fontSize:10,color:GRY,marginTop:1}},[e.role,paySortDept?null:e.dept].filter(Boolean).join(" \u2022 ")||"No designation"),
                h("div",{style:{display:"flex",gap:5,alignItems:"center",marginTop:3,flexWrap:"wrap"}},
                  h("div",{style:{fontSize:9,fontWeight:700,display:"inline-block",padding:"1px 6px",borderRadius:8,background:isFixed?"#FEF3C7":"#EFF6FF",color:isFixed?"#92400E":"#1E40AF"}},isFixed?"Fixed Salary":"Split Salary"),
                  (function(){var prc=proRata(e,payY,payM);return prc.partial?h("div",{style:{fontSize:9,fontWeight:700,display:"inline-block",padding:"1px 6px",borderRadius:8,background:AMB+"1E",color:AMB}},"Prorated · "+prc.range.activeDays+"/"+prc.range.fullDays+"d"):null;})()
                )
              ),
              h("div",{style:{textAlign:"right",flexShrink:0,display:"flex",alignItems:"center",gap:6}},
                h("div",null,
                  h("div",{style:{fontSize:9,color:GRY,letterSpacing:.5,marginBottom:1}},"TO PAY"),
                  h("div",{style:{fontSize:16,fontWeight:800,color:"#10B981"}},fmt(netWithExtra))
                ),
                h("div",{style:{display:"flex",alignItems:"center",justifyContent:"center"}},ic(isO?"expand_less":"expand_more",GRY,18))
              )
            ),
            isO?h("div",{style:{background:"rgba(0,0,0,0.03)",borderRadius:12,padding:"12px",border:"1px solid "+BDR,marginTop:4}},
              h("div",{style:{display:"flex",gap:5,marginBottom:12}},
                isPaid?h("button",{onClick:function(){makePayslipPDF(e,d,payM,payY,org.name,org.contactEmail||org.email,org.position,LOGO_SRC,false,org.address||"",org.logo||"",authPos,authSign,null,getEmpBonusesWithOT(e.id,payM,payY),getEmpClaimTotal(e.id,payM,payY),org.phone,org.website,getEmpLoanDed(e.id),mp.ma);},style:{flex:1,minWidth:0,display:"flex",alignItems:"center",justifyContent:"center",gap:3,background:NVY,border:"none",borderRadius:8,padding:"7px 4px",color:CARD,fontSize:10,fontWeight:700,cursor:"pointer"}},ic(ICONS.dl,CARD,12),"Emp PDF"):null,
                isPaid?h("button",{onClick:function(){makePayslipPDF(e,d,payM,payY,org.name,org.contactEmail||org.email,org.position,LOGO_SRC,true,org.address||"",org.logo||"",authPos,authSign,null,getEmpBonusesWithOT(e.id,payM,payY),getEmpClaimTotal(e.id,payM,payY),org.phone,org.website,getEmpLoanDed(e.id),mp.ma);},style:{flex:1,minWidth:0,display:"flex",alignItems:"center",justifyContent:"center",gap:3,background:SFT,border:"1px solid "+BDR,borderRadius:8,padding:"7px 4px",color:NVY,fontSize:10,fontWeight:700,cursor:"pointer"}},ic(ICONS.dl,NVY,12),"Er PDF"):null,
                !isPaid?h("button",{onClick:needPaid,style:{flex:1,minWidth:0,display:"flex",alignItems:"center",justifyContent:"center",gap:4,background:GRY,border:"none",borderRadius:8,padding:"7px 4px",color:CARD,fontSize:11,fontWeight:600,cursor:"pointer"}},ic("lock",CARD,13),"PDF"):null,
                h("button",{onClick:function(){if(!isPaid){showT("WhatsApp share is a Pro feature","info");window.open("https://wa.me/918072293384?text="+encodeURIComponent("Hi, I want to upgrade to Admin HR Pro for WhatsApp payslip sharing"),"_blank");return;}sharePayslip(e,d,payM,payY);},style:{flex:1,minWidth:0,display:"flex",alignItems:"center",justifyContent:"center",gap:4,background:SFT,border:"1px solid "+BDR,borderRadius:8,padding:"7px 4px",color:isPaid?NVY:GRY,fontSize:11,fontWeight:700,cursor:"pointer"}},ic(isPaid?ICONS.wa:"lock",isPaid?"#25D366":GRY,13),"WhatsApp")
              ),
              // ── ADD TO THIS MONTH'S PAY — Incentive and Bonus/One-time Pay, side by side ──
              (function(){
                var empBonuses2=(bonuses||[]).filter(function(b){return b.employeeId===String(e.id)&&b.payMonth===payM&&b.payYear===payY;});
                var BTYPES={festival:"Festival Bonus",performance:"Performance Bonus",annual:"Annual Bonus",advance:"Advance Payment",other:"Other"};
                var bColors={festival:AMB,performance:"#2563EB",annual:"#10B981",advance:"#7C3AED",other:GRY};
                var bonusSum2=empBonuses2.reduce(function(s,b){return s+(b.amount||0);},0);
                function miniBox(accent,icon,label,valueText,onClick){
                  return h("div",{onClick:onClick,style:{flex:1,background:accent+"10",border:"1px solid "+accent+"30",borderRadius:8,padding:"7px 9px",cursor:"pointer"}},
                    h("div",{style:{display:"flex",alignItems:"center",gap:4,marginBottom:3}},ic(icon,accent,11),h("span",{style:{fontSize:8.5,fontWeight:700,color:accent,letterSpacing:.3}},label)),
                    h("div",{style:{fontSize:12,fontWeight:800,color:valueText?NVY:accent}},valueText||"+ Add")
                  );
                }
                return h("div",{style:{marginBottom:8}},
                  h("div",{style:{display:"flex",gap:6,marginBottom:showIncForm||(showBonusForm&&bonusPayM===payM&&bonusPayY===payY)?6:0}},
                    miniBox("#059669","trending_up","INCENTIVE",d.inc>0?fmt(d.inc):"",function(){var open=!showIncForm;setShowIncForm(open);if(open){setShowBonusForm(false);setBonusPayM(-1);setBonusPayY(-1);}setEditPayInc(d.inc>0?String(d.inc):"");}),
                    miniBox(AMB,"star","BONUS/ONE-TIME",bonusSum2>0?fmt(bonusSum2)+(empBonuses2.length>1?" ("+empBonuses2.length+")":""):"",function(){var open=!(showBonusForm&&bonusPayM===payM&&bonusPayY===payY);if(open){setShowIncForm(false);setBonusPayM(payM);setBonusPayY(payY);}else{setBonusPayM(-1);setBonusPayY(-1);}setShowBonusForm(open);setBonusAmt("");setBonusNote("");})
                  ),
                  // ── Incentive form — same structure/sizing as Bonus form below ──
                  showIncForm?h("div",{style:{background:"#05966910",border:"1px solid #05966935",borderRadius:8,padding:8,marginBottom:6}},
                    h("div",{style:{display:"flex",alignItems:"center",gap:5,marginBottom:6}},ic("trending_up","#059669",12),h("span",{style:{fontSize:9.5,fontWeight:700,color:"#059669",letterSpacing:.3}},"INCENTIVE (Rs.)")),
                    h("input",{type:"number",value:editPayInc,onChange:function(ev){setEditPayInc(ev.target.value);},placeholder:"Amount ₹",autoFocus:true,style:{width:"100%",background:CARD,border:"1px solid "+BDR,borderRadius:7,padding:"7px 8px",fontSize:11,color:NVY,outline:"none",fontFamily:"inherit",marginBottom:6,boxSizing:"border-box"}}),
                    h("div",{style:{display:"flex",gap:6}},
                      h("button",{onClick:function(){var k=e.id+"_"+payY+"_"+payM;setIncentives(function(p){var o=Object.assign({},p);o[k]=Number(editPayInc)||0;return o;});setShowIncForm(false);showT("Saved!");},style:{flex:2,background:NVY,border:"none",borderRadius:7,padding:"8px",fontSize:11,fontWeight:700,color:CARD,cursor:"pointer"}},"Add to Payroll"),
                      h("button",{onClick:function(){setShowIncForm(false);},style:{flex:1,background:SFT,border:"1px solid "+BDR,borderRadius:7,padding:"8px",fontSize:11,color:GRY,cursor:"pointer"}},"Cancel")
                    )
                  ):null,
                  // ── Bonus form ──
                  showBonusForm&&bonusPayM===payM&&bonusPayY===payY?h("div",{style:{background:AMB+"10",borderRadius:8,padding:8,border:"1px solid "+AMB+"35",marginBottom:6}},
                    h("div",{style:{display:"flex",alignItems:"center",gap:5,marginBottom:6}},ic("star",AMB,12),h("span",{style:{fontSize:9.5,fontWeight:700,color:AMB,letterSpacing:.3}},"ADD BONUS")),
                    h("div",{style:{display:"flex",gap:6,marginBottom:6}},
                      h("div",{style:{flex:1,minWidth:0}},chipSelectScroll(bonusType,function(v){setBonusType(v);},Object.entries(BTYPES).map(function(t){return {v:t[0],l:t[1]};}))),
                      h("input",{type:"number",value:bonusAmt,onChange:function(ev){setBonusAmt(ev.target.value);},placeholder:"Amount ₹",style:{flex:1,background:CARD,border:"1px solid "+BDR,borderRadius:7,padding:"7px 8px",fontSize:11,color:NVY,outline:"none",fontFamily:"inherit"}})
                    ),
                    h("input",{type:"text",value:bonusNote,onChange:function(ev){setBonusNote(ev.target.value);},placeholder:"Specific name e.g. Diwali Bonus, Pongal Bonus",style:{width:"100%",background:CARD,border:"1px solid "+BDR,borderRadius:7,padding:"7px 8px",fontSize:11,color:NVY,outline:"none",fontFamily:"inherit",marginBottom:6,boxSizing:"border-box"}}),
                    h("div",{style:{display:"flex",gap:6}},
                      h("button",{onClick:function(){
                        if(!bonusAmt)return showT("Enter amount","err");
                        var b={id:Date.now(),employeeId:String(e.id),employeeName:e.name,amount:Number(bonusAmt),type:bonusType,note:bonusNote,date:new Date().toISOString().split("T")[0],payMonth:payM,payYear:payY};
                        setBonuses(function(p){return [b].concat(p||[]);});
                        _sb.from("bonuses").insert({id:String(b.id),employer_email:gUser.email,employee_id:String(e.id),employee_name:e.name,amount:b.amount,type:b.type,note:b.note,date:b.date,pay_month:payM,pay_year:payY}).then(function(r){if(r&&r.error)showT("Error","err");else showT("Bonus added to payroll!");});
                        setBonusAmt("");setBonusNote("");setShowBonusForm(false);setBonusPayM(-1);setBonusPayY(-1);
                      },style:{flex:2,background:NVY,border:"none",borderRadius:7,padding:"8px",fontSize:11,fontWeight:700,color:CARD,cursor:"pointer"}},"Add to Payroll"),
                      h("button",{onClick:function(){setShowBonusForm(false);setBonusPayM(-1);setBonusPayY(-1);setBonusAmt("");},style:{flex:1,background:SFT,border:"1px solid "+BDR,borderRadius:7,padding:"8px",fontSize:11,color:GRY,cursor:"pointer"}},"Cancel")
                    )
                  ):null,
                  /* Existing bonus entries, manageable here */
                  empBonuses2.map(function(b){
                    return h("div",{key:b.id,style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 8px",background:(bColors[b.type]||GRY)+"10",borderRadius:7,marginBottom:3,marginTop:3,border:"1px solid "+(bColors[b.type]||GRY)+"25"}},
                      h("span",{style:{fontSize:10,fontWeight:600,color:NVY}},b.note||(BTYPES[b.type]||b.type)),
                      h("div",{style:{display:"flex",alignItems:"center",gap:6}},
                        h("span",{style:{fontSize:10.5,fontWeight:700,color:bColors[b.type]||GRY}},fmt(b.amount)),
                        h("button",{onClick:function(){if(!window.confirm("Remove this bonus?"))return;setBonuses(function(p){return p.filter(function(x){return x.id!==b.id;});});_sb.from("bonuses").delete().eq("id",String(b.id)).then(function(){});showT("Removed");},style:{background:"none",border:"none",cursor:"pointer",padding:0,display:"flex"}},ic("delete",RED,10))
                      )
                    );
                  })
                );
              })(),
              // ── EARNINGS ──
              h("div",{style:{fontSize:9,fontWeight:700,color:GRY,letterSpacing:1,marginBottom:4}},"EARNINGS"),
              [
                isFixed?["Fixed Salary",fmt(Number(eEff.fixedSalary||eEff.monthlyCTC||0)),NVY]:["Basic",fmt(eEff.basic||0),NVY],
                isFixed?null:["HRA",fmt(eEff.hra||0),NVY],
                isFixed?null:["Allowances",fmt(eEff.allow||0),NVY],
                d.shiftAllow>0?["Shift Allow.",fmt(d.shiftAllow),TEL]:null,
                d.inc>0?["Incentive",fmt(d.inc),"#059669"]:null,
              ].filter(Boolean).map(function(item){
                return h("div",{key:item[0],style:{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid "+BDR+"44"}},
                  h("span",{style:{fontSize:11,color:GRY}},item[0]),
                  h("span",{style:{fontSize:11,fontWeight:600,color:item[2]}},item[1])
                );
              }),
              attDed>0?h("div",{onClick:function(){setTdsInfoOpen(tdsInfoOpen===("att_"+e.id)?null:"att_"+e.id);},style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 0",borderBottom:"1px solid "+BDR+"44",cursor:"pointer",marginTop:4}},
                h("span",{style:{fontSize:11,color:GRY,display:"flex",alignItems:"center",gap:3}},"Absent/Half",ic(tdsInfoOpen===("att_"+e.id)?"expand_less":"expand_more",GRY,13)),
                h("span",{style:{fontSize:11,fontWeight:600,color:AMB}},"-"+fmt(attDed))
              ):null,
              attDed>0&&tdsInfoOpen===("att_"+e.id)?renderAttDedBreakdown(mp):null,
              h("div",{style:{display:"flex",justifyContent:"space-between",padding:"5px 0",marginBottom:8}},
                h("span",{style:{fontSize:11,fontWeight:600,color:NVY}},"Effective Gross"),
                h("span",{style:{fontSize:11,fontWeight:800,color:NVY}},fmt(d.gr))
              ),
              // ── DEDUCTIONS (statutory + loan — everything subtracted) ──
              (statDed>0||mp.loanDed>0)?h("div",null,
                h("div",{style:{fontSize:9,fontWeight:700,color:GRY,letterSpacing:1,marginBottom:4}},"DEDUCTIONS"),
                [
                  d.pfE>0?[d.pfMode==="actual"?"PF (Emp 12%)":"PF (12% capped)","-"+fmt(d.pfE),NVY]:null,
                  d.esiE>0?["ESI (Emp 0.75%)","-"+fmt(d.esiE),TEL]:null,
                  d.pt>0?["Prof. Tax","-"+fmt(d.pt),AMB]:null,
                ].filter(Boolean).map(function(item){
                  return h("div",{key:item[0],style:{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid "+BDR+"44"}},
                    h("span",{style:{fontSize:11,color:GRY}},item[0]),
                    h("span",{style:{fontSize:11,fontWeight:600,color:item[2]}},item[1])
                  );
                }),
                d.tds>0?h("div",{onClick:function(){setTdsInfoOpen(tdsInfoOpen===("emp_"+e.id)?null:"emp_"+e.id);},style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 0",borderBottom:"1px solid "+BDR+"44",cursor:"pointer"}},
                  h("span",{style:{fontSize:11,color:GRY,display:"flex",alignItems:"center",gap:3}},"TDS",ic(tdsInfoOpen===("emp_"+e.id)?"expand_less":"expand_more",GRY,13)),
                  h("span",{style:{fontSize:11,fontWeight:600,color:RED}},"-"+fmt(d.tds))
                ):null,
                d.tds>0&&tdsInfoOpen===("emp_"+e.id)?renderTdsBreakdown(mp):null,
                [
                  d.hi>0?["Health Ins.","-"+fmt(d.hi),"#EC4899"]:null,
                  d.cd>0?["Other","-"+fmt(d.cd),GRY]:null,
                  mp.loanDed>0?["Loan/Advance EMI","-"+fmt(mp.loanDed),RED]:null,
                ].filter(Boolean).map(function(item){
                  return h("div",{key:item[0],style:{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid "+BDR+"44"}},
                    h("span",{style:{fontSize:11,color:GRY}},item[0]),
                    h("span",{style:{fontSize:11,fontWeight:600,color:item[2]}},item[1])
                  );
                }),
                h("div",{style:{display:"flex",justifyContent:"space-between",padding:"5px 0",marginBottom:8}},
                  h("span",{style:{fontSize:11,fontWeight:600,color:NVY}},"Total Deductions"),
                  h("span",{style:{fontSize:11,fontWeight:800,color:RED}},"-"+fmt(statDed+mp.loanDed))
                )
              ):null,
              // ── ADDITIONS (added back on top of net) ──
              (function(){
                var empClaimTotal=mp.claimTotal,empBonusTotal=mp.bonusTotal,empOT=mp.otTotal,finalNet=mp.netFinal;
                return h("div",null,
                  (empClaimTotal>0||empOT>0||empBonusTotal>0)?h("div",{style:{fontSize:9,fontWeight:700,color:GRY,letterSpacing:1,marginBottom:4,marginTop:4}},"ADDITIONS"):null,
                  empClaimTotal>0?h("div",{style:{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid "+BDR+"44"}},h("span",{style:{fontSize:11,color:GRY}},"Reimbursement"),h("span",{style:{fontSize:11,fontWeight:600,color:"#10B981"}},"+"+fmt(empClaimTotal))):null,
                  empOT>0?h("div",{style:{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid "+BDR+"44"}},h("span",{style:{fontSize:11,color:GRY}},"Overtime"),h("span",{style:{fontSize:11,fontWeight:600,color:TEL}},"+"+fmt(empOT))):null,
                  empBonusTotal>0?h("div",{style:{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid "+BDR+"44",marginBottom:8}},h("span",{style:{fontSize:11,color:GRY}},"Bonus"),h("span",{style:{fontSize:11,fontWeight:600,color:AMB}},"+"+fmt(empBonusTotal))):null,
                  // ── Working days + Net Take Home ──
                  h("div",{style:{fontSize:10,color:GRY,marginBottom:8,marginTop:(empClaimTotal>0||empOT>0||empBonusTotal>0)?0:4}},"Working days: "+(d.wDays||26)+" \u2022 Per day rate: "+fmt(d.pd||0)),
                  h("div",{style:{background:"#0F172A",borderRadius:10,padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:6}},
                    h("span",{style:{fontSize:12,fontWeight:600,color:"rgba(255,255,255,.6)"}},"Net Take Home"),
                    h("span",{style:{fontSize:16,fontWeight:800,color:"#4ADE80"}},fmt(finalNet))
                  )
                );
              })()
            ):null
          ));
        })
      ),0):repV==="annual"?renderAnnualStatement():h("div",null,
        card(h("div",null,
          h("div",{style:{fontSize:12,fontWeight:700,color:NVY,marginBottom:10}},"Employer Cost - "+MOS[payM]+" "+payY),
          actEmps.map(function(e,i){var d=getMonthPay(e,payY,payM).d;return h("div",{key:e.id,style:{padding:"9px 0",borderBottom:i<actEmps.length-1?"1px solid "+BDR:"none"}},
            h("div",{style:{display:"flex",alignItems:"center",gap:8,marginBottom:5}},av(e,31),h("div",{style:{flex:1}},h("div",{style:{fontSize:12,fontWeight:700,color:NVY}},e.name),h("div",{style:{fontSize:10,color:GRY}},e.dept)),h("div",{style:{textAlign:"right"}},h("div",{style:{fontSize:12,fontWeight:800,color:AMB}},fmt(d.gr+d.pfR+d.esiR)),h("div",{style:{fontSize:9,color:GRY}},"CTC/mo"))),
            h("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:5}},
              [["Gross",fmt(d.gr),NVY],["Er PF",fmt(d.pfR),"#374151"],["Er ESI",fmt(d.esiR),TEL]].map(function(item){return h("div",{key:item[0],style:{background:item[2]+"18",borderRadius:7,padding:"6px",textAlign:"center",minWidth:0,overflow:"hidden"}},h("div",{style:{fontSize:11,fontWeight:700,color:item[2],whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}},item[1]),h("div",{style:{fontSize:9,color:GRY}},item[0]));})
            )
          );}),
          (function(){var tot=actEmps.reduce(function(a,e){var d=getMonthPay(e,payY,payM).d;a.g+=d.gr;a.p+=d.pfR;a.e+=d.esiR;return a;},{g:0,p:0,e:0});return h("div",{style:{background:AMB+"14",border:"1px solid "+AMB+"38",borderRadius:11,padding:11,marginTop:9}},[["Total Gross",fmt(tot.g),false],["Employer PF",fmt(tot.p),false],["Employer ESI",fmt(tot.e),false],["Total CTC",fmt(tot.g+tot.p+tot.e),true]].map(function(item){return h("div",{key:item[0],style:{display:"flex",justifyContent:"space-between",padding:"3px 0",borderBottom:"1px dashed "+BDR}},h("span",{style:{fontSize:11,color:GRY}},item[0]),h("span",{style:{fontSize:11,fontWeight:700,color:item[2]?AMB:NVY}},item[1]));}))})())) , 
        isPaid?h("div",{style:{display:"flex",gap:8,marginBottom:10}},
              h("button",{onClick:function(){makePayrollPDF(actEmps,payM,payY,getMonthPay,org.name,org.contactEmail||org.email,org.position,LOGO_SRC,false,org.address||"",org.logo||"",authPos,authSign,org.phone,org.website);},style:{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:5,background:NVY,border:"none",borderRadius:12,padding:"11px",color:CARD,fontSize:12,fontWeight:700,cursor:"pointer"}},ic(ICONS.dl,CARD,15),"Employee Copy"),
              h("button",{onClick:function(){makePayrollPDF(actEmps,payM,payY,getMonthPay,org.name,org.contactEmail||org.email,org.position,LOGO_SRC,true,org.address||"",org.logo||"",authPos,authSign,org.phone,org.website);},style:{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:5,background:SFT,border:"1.5px solid "+BDR,borderRadius:12,padding:"11px",color:NVY,fontSize:12,fontWeight:700,cursor:"pointer"}},ic(ICONS.dl,NVY,15),"Employer Copy")
            ):h("button",{onClick:needPaid,style:{display:"flex",alignItems:"center",justifyContent:"center",gap:6,width:"100%",background:GRY,border:"none",borderRadius:12,padding:"12px",color:CARD,fontSize:13,fontWeight:600,cursor:"pointer",marginBottom:10}},ic("lock",CARD,16),"Payroll PDF — Paid Plan Only")
      )
    );
  }

  function renderSettings(){
    // ── helpers ──────────────────────────────────────────────────────────
    function sectionTitle(t){
      return h("div",{style:{fontSize:11,fontWeight:700,color:GRY,letterSpacing:1,marginBottom:8,marginTop:4}},t);
    }
    function divider(){
      return h("div",{style:{height:1,background:BDR,margin:"2px 0 12px"}});
    }
    function infoRow(label,value){
      return h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid "+BDR}},
        h("div",{style:{fontSize:12,color:GRY}},label),
        h("div",{style:{fontSize:12,fontWeight:600,color:NVY}},value)
      );
    }

    // ── tab pill bar ──────────────────────────────────────────────────────
    var tabs=[["company","Business"],["account","Account"],["data","Data & Tax"]];
    var tabBar=h("div",{style:{display:"flex",background:SFT,borderRadius:12,padding:3,gap:2,marginBottom:16}},
      tabs.map(function(t){
        var on=settTab===t[0];
        return h("button",{key:t[0],onClick:function(){setSettTab(t[0]);},style:{
          flex:1,padding:"8px 4px",borderRadius:9,
          border:on?"1px solid "+BDR:"1px solid transparent",
          background:on?CARD:"transparent",
          color:on?NVY:GRY,
          fontSize:12,fontWeight:on?700:500,
          cursor:"pointer",
          boxShadow:on?T.SHADOW:"none",
          transition:"all .15s"
        }},t[1]);
      })
    );

    // ════════════════════════════════════════════════════════════════════
    // COMPANY TAB
    // ════════════════════════════════════════════════════════════════════
    var companyTab=settTab==="company"?h("div",null,
      card(h("div",null,
        // ── Company logo + name header ──
        h("div",{style:{display:"flex",alignItems:"center",gap:14,marginBottom:16,paddingBottom:14,borderBottom:"1px solid "+BDR}},
          orgLogo
            ?h("img",{src:orgLogo,style:{width:56,height:56,borderRadius:12,objectFit:"contain",border:"1px solid "+BDR,background:"#fff",padding:3,flexShrink:0}})
            :h("div",{style:{width:56,height:56,borderRadius:12,background:NVY,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:800,color:CARD,flexShrink:0}},(org.name||"?").charAt(0).toUpperCase()),
          h("div",{style:{flex:1,minWidth:0}},
            h("div",{style:{fontSize:16,fontWeight:800,color:NVY,marginBottom:2}},org.name||""),
            h("div",{style:{fontSize:11,color:GRY}},org.type||""),
            h("div",{style:{display:"inline-flex",alignItems:"center",gap:4,marginTop:4,background:isPaid?"#ECFDF5":"#F1F5F9",borderRadius:20,padding:"2px 10px"}},
              h("div",{style:{width:6,height:6,borderRadius:"50%",background:isPaid?GRN:GRY}}),
              h("div",{style:{fontSize:10,fontWeight:700,color:isPaid?GRN:GRY}},isPaid?"Premium Plan":"Free Plan")
            )
          )
        ),

        // ── Locked fields ──
        sectionTitle("ORGANISATION INFO"),
        infoRow("Organisation Name",org.name||"—"),
        infoRow("Organisation Type",org.type||"—"),
        h("div",{style:{padding:"10px 0",borderBottom:"1px solid "+BDR,display:"flex",justifyContent:"space-between",alignItems:"center"}},
          h("div",{style:{fontSize:12,color:GRY}},"Email"),
          h("div",{style:{fontSize:12,fontWeight:600,color:NVY}},org.email||"—")
        ),
        h("div",{style:{height:14}}),

        !settReviewMode?h("div",null,
          // ── Editable: Address ──
          sectionTitle("COMPANY ADDRESS — SHOWN ON PDFs"),
          h("textarea",{
            value:orgAddr,
            onChange:function(e){setOrgAddr(e.target.value);},
            placeholder:"e.g. 123, Anna Salai, Chennai - 600002, Tamil Nadu",
            rows:3,
            style:{width:"100%",background:SFT,border:"1.5px solid "+BDR,borderRadius:10,padding:"10px 12px",fontSize:12,color:NVY,outline:"none",fontFamily:"inherit",resize:"none",marginBottom:14,boxSizing:"border-box"}
          }),

          // ── Editable: Logo ──
          sectionTitle("COMPANY LOGO — SHOWN ON PDFs"),
          h("div",{style:{display:"flex",gap:12,alignItems:"center",marginBottom:16}},
            orgLogo
              ?h("img",{src:orgLogo,style:{width:64,height:64,borderRadius:10,objectFit:"contain",border:"1.5px solid "+BDR,background:"#fff",padding:4,flexShrink:0}})
              :h("div",{style:{width:64,height:64,borderRadius:10,border:"1.5px dashed "+BDR,background:SFT,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,flexShrink:0}},
                ic("add",GRY,18),
                h("div",{style:{fontSize:9,color:GRY,textAlign:"center"}},"No logo")
              ),
            h("div",{style:{flex:1}},
              h("label",{style:{display:"flex",alignItems:"center",justifyContent:"center",gap:6,background:SFT,border:"1.5px solid "+BDR,borderRadius:9,padding:"9px 14px",fontSize:12,fontWeight:600,color:NVY,cursor:"pointer",marginBottom:7}},
                ic("upload",NVY,14),"Upload Logo",
                h("input",{type:"file",accept:"image/*",style:{display:"none"},onChange:function(e){
                  var file=e.target.files[0];if(!file)return;
                  if(file.size>500000){showT("Logo too large. Use max 500KB.","err");return;}
                  var reader=new FileReader();
                  reader.onload=function(ev){setOrgLogo(ev.target.result);};
                  reader.readAsDataURL(file);
                }})
              ),
              orgLogo
                ?h("button",{onClick:function(){setOrgLogo("");},style:{display:"flex",alignItems:"center",gap:4,background:"none",border:"none",fontSize:11,color:RED,cursor:"pointer",padding:0,marginBottom:4}},ic("delete",RED,12),"Remove logo")
                :null,
              h("div",{style:{fontSize:10,color:GRY}},"PNG or JPG · Max 500 KB")
            )
          ),

          // ── Editable: Contact details ──
          sectionTitle("CONTACT DETAILS — SHOWN ON PDFs"),
          h("input",{type:"tel",value:orgPhone,onChange:function(e){setOrgPhone(e.target.value);},placeholder:"e.g. +91 98765 43210",style:{width:"100%",background:SFT,border:"1.5px solid "+BDR,borderRadius:10,padding:"10px 12px",fontSize:12,color:NVY,outline:"none",fontFamily:"inherit",marginBottom:8,boxSizing:"border-box"}}),
          h("input",{type:"url",value:orgWebsite,onChange:function(e){setOrgWebsite(e.target.value);},placeholder:"e.g. www.yourcompany.com",style:{width:"100%",background:SFT,border:"1.5px solid "+BDR,borderRadius:10,padding:"10px 12px",fontSize:12,color:NVY,outline:"none",fontFamily:"inherit",marginBottom:8,boxSizing:"border-box"}}),
          h("input",{type:"email",value:orgContactEmail,onChange:function(e){setOrgContactEmail(e.target.value);},placeholder:"e.g. contact@yourcompany.com",style:{width:"100%",background:SFT,border:"1.5px solid "+BDR,borderRadius:10,padding:"10px 12px",fontSize:12,color:NVY,outline:"none",fontFamily:"inherit",marginBottom:14,boxSizing:"border-box"}}),
          h("button",{onClick:function(){
            if(!orgAddr.trim()&&!orgPhone.trim()&&!orgWebsite.trim()&&!orgContactEmail.trim()&&!orgLogo){return showT("Enter at least one detail","err");}
            setSettReviewMode(true);
          },style:{width:"100%",background:NVY,border:"none",borderRadius:10,padding:"12px",color:CARD,fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:7}},
            ic("fact_check",CARD,16),"Review & Save")
        ):h("div",null,
          // ── Review step — make sure everything looks right before it goes on every PDF ──
          sectionTitle("REVIEW BEFORE SAVING"),
          h("div",{style:{fontSize:11,color:GRY,marginBottom:10}},"These details appear on every payslip, report and letter you download. Please check them carefully."),
          h("div",{style:{background:SFT,border:"1px solid "+BDR,borderRadius:12,padding:14,marginBottom:14}},
            h("div",{style:{display:"flex",gap:12,alignItems:"center",marginBottom:12,paddingBottom:12,borderBottom:"1px solid "+BDR}},
              orgLogo?h("img",{src:orgLogo,style:{width:48,height:48,borderRadius:9,objectFit:"contain",border:"1px solid "+BDR,background:"#fff",padding:3,flexShrink:0}}):h("div",{style:{width:48,height:48,borderRadius:9,border:"1.5px dashed "+BDR,background:CARD,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}},ic("business",GRY,18)),
              h("div",{style:{flex:1,minWidth:0}},
                h("div",{style:{fontSize:13,fontWeight:700,color:NVY}},org.name||"—"),
                h("div",{style:{fontSize:10,color:GRY}},orgLogo?"Logo set":"No logo uploaded")
              )
            ),
            [["Address",orgAddr],["Phone",orgPhone],["Website",orgWebsite],["Email",orgContactEmail]].map(function(row){
              return h("div",{key:row[0],style:{display:"flex",justifyContent:"space-between",gap:10,padding:"6px 0",fontSize:12}},
                h("div",{style:{color:GRY,flexShrink:0}},row[0]),
                h("div",{style:{color:row[1]?NVY:GRY,fontWeight:row[1]?600:400,textAlign:"right"}},row[1]||"Not set")
              );
            })
          ),
          h("div",{style:{display:"flex",gap:8}},
            h("button",{onClick:function(){setSettReviewMode(false);},style:{flex:1,background:SFT,border:"1.5px solid "+BDR,borderRadius:10,padding:"12px",color:NVY,fontSize:13,fontWeight:700,cursor:"pointer"}},"Back to Edit"),
            h("button",{onClick:function(){
              var updated=Object.assign({},org,{address:orgAddr,logo:orgLogo,phone:orgPhone,website:orgWebsite,contactEmail:orgContactEmail});
              setOrg(updated);
              lsSet("hr_org_"+(gUser?gUser.email:""),updated);
              _sb.from("user_orgs").upsert({
                email:gUser?gUser.email:"",
                org_name:org.name,
                org_type:org.type,
                position:org.position,
                address:orgAddr,
                logo_base64:orgLogo,
                phone:orgPhone,
                website:orgWebsite,
                contact_email:orgContactEmail
              },{onConflict:"email"}).then(function(res){
                if(res&&res.error){showT("Could not save — please try again","err");return;}
                setSettReviewMode(false);
                showT("Company details saved!");
              }).catch(function(){showT("Could not save — check your connection","err");});
            },style:{flex:1,background:NVY,border:"none",borderRadius:10,padding:"12px",color:CARD,fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}},ic("check",CARD,15),"Confirm & Save")
          )
        )
      ))
    ):null;

    // ════════════════════════════════════════════════════════════════════
    // ACCOUNT TAB
    // ════════════════════════════════════════════════════════════════════
    var accountTab=settTab==="account"?h("div",null,

      // ── User card ──
      card(h("div",null,
        h("div",{style:{display:"flex",alignItems:"center",gap:14,marginBottom:14,paddingBottom:14,borderBottom:"1px solid "+BDR}},
          h("div",{style:{width:52,height:52,borderRadius:"50%",background:NVY,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:800,color:CARD,flexShrink:0}},
            gUser?(gUser.email||"U").charAt(0).toUpperCase():"U"
          ),
          h("div",{style:{flex:1,minWidth:0}},
            h("div",{style:{fontSize:14,fontWeight:700,color:NVY,marginBottom:2}},org.position||gUser&&gUser.name||""),
            h("div",{style:{fontSize:11,color:GRY,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}},gUser?gUser.email:"")
          )
        ),
        h("div",{style:{height:10}}),
        sectionTitle("PLAN"),
        h("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid "+BDR}},
          h("div",null,
            h("div",{style:{fontSize:12,fontWeight:700,color:NVY}},isPaid?"Premium Plan":"Free Plan"),
            h("div",{style:{fontSize:10,color:GRY,marginTop:2}},isPaid?"Unlimited employees · All features":"Up to 3 employees · Basic features")
          ),
          isPaid
            ?h("div",{style:{background:"#ECFDF5",borderRadius:20,padding:"4px 12px",fontSize:11,fontWeight:700,color:GRN}},"Active")
            :h("button",{onClick:function(){window.open("https://wa.me/918072293384?text="+encodeURIComponent("Hi, I want to upgrade my Admin HR account. Email: "+(gUser?gUser.email:"")),"_blank");},style:{background:AMB,border:"none",borderRadius:20,padding:"5px 14px",fontSize:11,fontWeight:700,color:"#fff",cursor:"pointer"}},"Upgrade")
        ),
        h("div",{style:{height:14}}),
        sectionTitle("SUPPORT"),
        h("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid "+BDR}},
          h("div",null,
            h("div",{style:{fontSize:12,fontWeight:600,color:NVY}},"WhatsApp Support"),
            h("div",{style:{fontSize:10,color:GRY,marginTop:2}},"Mon–Fri · 10 AM – 6 PM")
          ),
          h("button",{onClick:function(){window.open("https://wa.me/918072293384?text="+encodeURIComponent("Hi, I need support for Admin HR. My account: "+(gUser?gUser.email:"")),"_blank");},style:{display:"flex",alignItems:"center",gap:5,background:GRN+"15",border:"1px solid "+GRN+"44",borderRadius:8,padding:"6px 12px",fontSize:11,fontWeight:700,color:GRN,cursor:"pointer"}},
            ic(ICONS.wa,GRN,13),"Chat")
        ),
        h("div",{style:{height:14}}),
        sectionTitle("AUTHORISED SIGNATORY"),
        (authEditMode||(!authSign&&!authPos))?h("div",null,
          h("div",{style:{fontSize:11,color:GRY,marginBottom:8}},"Name and position appear on payslips, payroll reports and all downloaded PDFs."),
          h("input",{type:"text",value:authSign,onChange:function(e){setAuthSign(e.target.value);},placeholder:"Your full name",style:{width:"100%",background:SFT,border:"1.5px solid "+BDR,borderRadius:10,padding:"10px 12px",fontSize:12,color:NVY,outline:"none",fontFamily:"inherit",marginBottom:8,boxSizing:"border-box"}}),
          h("input",{type:"text",value:authPos,onChange:function(e){setAuthPos(e.target.value);},placeholder:"Your designation e.g. Managing Director",style:{width:"100%",background:SFT,border:"1.5px solid "+BDR,borderRadius:10,padding:"10px 12px",fontSize:12,color:NVY,outline:"none",fontFamily:"inherit",marginBottom:14,boxSizing:"border-box"}}),
          h("button",{onClick:function(){
            if(!authSign.trim()&&!authPos.trim())return showT("Enter at least one detail","err");
            lsSet("hr_auth_sign",authSign);lsSet("hr_auth_pos",authPos);
            _sb.from("user_orgs").upsert({email:gUser?gUser.email:"",org_name:org.name,org_type:org.type,position:org.position,auth_sign:authSign,auth_pos:authPos},{onConflict:"email"}).then(function(){
              setAuthEditMode(false);showT("Saved!");
            }).catch(function(){showT("Could not save — try again","err");});
          },style:{width:"100%",background:NVY,border:"none",borderRadius:10,padding:"11px",color:CARD,fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginBottom:14}},ic("save",CARD,14),"Save Details")
        ):h("div",{style:{background:SFT,border:"1px solid "+BDR,borderRadius:12,padding:"12px 14px",marginBottom:14}},
          h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}},
            h("div",{style:{flex:1,minWidth:0}},
              authSign?h("div",{style:{fontSize:13,fontWeight:700,color:NVY,marginBottom:1}},authSign):null,
              authPos?h("div",{style:{fontSize:11,color:GRY}},authPos):null
            ),
            h("button",{onClick:function(){setAuthEditMode(true);},style:{display:"flex",alignItems:"center",gap:4,background:ACCENT_SOFT,border:"none",borderRadius:8,padding:"6px 10px",fontSize:11,fontWeight:700,color:NVY,cursor:"pointer",flexShrink:0}},ic("edit",NVY,12),"Edit")
          )
        ),
        sectionTitle("APPEARANCE"),
        h("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 0",borderBottom:"1px solid "+BDR}},
          h("div",{style:{display:"flex",alignItems:"center",gap:10}},
            h("div",{style:{width:36,height:36,borderRadius:10,background:themeMode==="dark"?"#1E293B":"#F1F5F9",display:"flex",alignItems:"center",justifyContent:"center"}},
              ic(themeMode==="dark"?"dark_mode":"light_mode",themeMode==="dark"?"#94A3B8":AMB,18)
            ),
            h("div",null,
              h("div",{style:{fontSize:13,fontWeight:600,color:NVY}},themeMode==="dark"?"Dark Mode":"Light Mode"),
              h("div",{style:{fontSize:11,color:GRY,marginTop:2}},"Tap to switch theme")
            )
          ),
          h("button",{onClick:function(){var nx=themeMode==="light"?"dark":"light";setThemeMode(nx);showT(nx.charAt(0).toUpperCase()+nx.slice(1)+" mode");},style:{width:48,height:28,borderRadius:14,background:themeMode==="dark"?ACCENT:"#CBD5E1",border:"none",cursor:"pointer",position:"relative",transition:"background .25s",flexShrink:0}},
            h("div",{style:{position:"absolute",top:4,left:themeMode==="dark"?22:4,width:20,height:20,borderRadius:"50%",background:"#fff",transition:"left .25s",boxShadow:"0 1px 4px rgba(0,0,0,0.2)"}})
          )
        ),
        h("div",{style:{height:14}}),

        // ── Account Activity Notice ──
        h("div",{style:{background:AMB+"18",border:"2px solid "+AMB,borderRadius:10,padding:"12px 14px",marginBottom:12}},
          h("div",{style:{display:"flex",gap:10,alignItems:"flex-start"}},
            h("div",{style:{width:22,height:22,borderRadius:6,background:AMB,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}},ic("warning","#fff",13)),
            h("div",null,
              h("div",{style:{fontSize:12,fontWeight:700,color:AMB,marginBottom:4}},"Account Activity Notice"),
              h("div",{style:{fontSize:11,color:GRY,lineHeight:1.6}},"Accounts inactive for more than 90 days may be suspended or permanently deleted. All HR data will be lost."),
              h("div",{style:{fontSize:11,fontWeight:700,color:AMB,marginTop:5}},"Download your records monthly from Data & Tax \u2192 Data Downloads to keep a safe backup.")
            )
          )
        ),
        h("button",{onClick:function(){
          syncToSupabase(emps,att,incentives,shifts,reminders,notices,revisions);
          setAuthPwd("");setAuthPwd2("");
          setTimeout(function(){
            var _email=gUser&&gUser.email?gUser.email:"";
            _sb.auth.signOut();
            ["hr_emps","hr_att","hr_inc","hr_revisions","hr_reminders","hr_shifts","hr_notices","hr_org","hr_last_sync","hr_guser","hr_login_time"].forEach(function(k){try{localStorage.removeItem(k);}catch(e){}});
            if(_email)["hr_emps_","hr_att_","hr_inc_"].forEach(function(k){try{localStorage.removeItem(k+_email);}catch(e){}});
            setGUser(null);setEmps([]);setAtt({});setIncentives({});setRevisions({});setReminders([]);setShifts({});setNotices([]);
            setOrg({name:"",type:"",email:"",position:"",plan:"free",address:"",logo:""});
            lsSet("hr_login_time",null);setScreen("login");
          },800);
          showT("Signing out...");
        },style:{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:7,background:RED+"12",border:"1.5px solid "+RED+"33",borderRadius:10,padding:"11px",fontSize:13,fontWeight:700,color:RED,cursor:"pointer"}},
          ic("logout",RED,16),"Sign Out")
      ))
    ):null;

    // ════════════════════════════════════════════════════════════════════
    // DATA & TAX TAB
    // ════════════════════════════════════════════════════════════════════
    var dataTab=settTab==="data"?h("div",null,

      // ── Statutory compliance ──
      card(h("div",null,
        sectionTitle("STATUTORY COMPLIANCE"),
        h("div",{style:{display:"flex",flexDirection:"column",gap:8}},
          // PF/ESI
          h("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 12px",background:SFT,borderRadius:10}},
            h("div",{style:{display:"flex",alignItems:"center",gap:10}},
              h("div",{style:{width:34,height:34,borderRadius:9,background:"#4F46E515",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}},ic("account_balance","#4F46E5",16)),
              h("div",null,
                h("div",{style:{fontSize:12,fontWeight:600,color:NVY}},"PF / ESI Summary"),
                h("div",{style:{fontSize:10,color:GRY,marginTop:1}},"Monthly compliance report")
              )
            ),
            h("button",{onClick:isPaid?function(){makePFESIPDF(actEmps,curM,curY,getMonthPay,org.name,org.contactEmail||org.email,org.position,LOGO_SRC,org.address||"",org.logo||"",authPos,authSign,org.phone,org.website);}:needPaid,
              style:{display:"flex",alignItems:"center",gap:4,background:isPaid?NVY:GRY,border:"none",borderRadius:7,padding:"6px 12px",color:CARD,fontSize:11,fontWeight:700,cursor:"pointer"}},
              ic(isPaid?ICONS.dl:"lock","#fff",12),isPaid?"PDF":"Paid")
          ),
          // Salary Register
          h("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 12px",background:SFT,borderRadius:10}},
            h("div",{style:{display:"flex",alignItems:"center",gap:10}},
              h("div",{style:{width:34,height:34,borderRadius:9,background:"#ECFDF5",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}},ic("fact_check","#059669",16)),
              h("div",null,
                h("div",{style:{fontSize:12,fontWeight:600,color:NVY}},"Salary Register"),
                h("div",{style:{fontSize:10,color:GRY,marginTop:1}},"Payment of Wages Act format")
              )
            ),
            h("button",{onClick:isPaid?function(){try{makeSalaryRegisterPDF(actEmps,curM,curY,getMonthPay,org.name,org.contactEmail||org.email,org.position,LOGO_SRC,org.address||"",org.logo||"",authPos,authSign,org.phone,org.website);}catch(ex){showT("PDF error: "+ex.message,"err");}}:needPaid,
              style:{display:"flex",alignItems:"center",gap:4,background:isPaid?NVY:GRY,border:"none",borderRadius:7,padding:"6px 12px",color:CARD,fontSize:11,fontWeight:700,cursor:"pointer"}},
              ic(isPaid?ICONS.dl:"lock","#fff",12),isPaid?"PDF":"Paid")
          ),
          // ECR
          h("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 12px",background:SFT,borderRadius:10}},
            h("div",{style:{display:"flex",alignItems:"center",gap:10}},
              h("div",{style:{width:34,height:34,borderRadius:9,background:"#FFFBEB",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}},ic("upload_file","#D97706",16)),
              h("div",null,
                h("div",{style:{fontSize:12,fontWeight:600,color:NVY}},"EPF ECR File"),
                h("div",{style:{fontSize:10,color:GRY,marginTop:1}},"Upload to epfindia.gov.in")
              )
            ),
            h("button",{onClick:isPaid?function(){setPayDlM(curM);setPayDlY(curY);setShowECRDl(true);}:needPaid,
              style:{display:"flex",alignItems:"center",gap:4,background:isPaid?"#D97706":GRY,border:"none",borderRadius:7,padding:"6px 12px",color:CARD,fontSize:11,fontWeight:700,cursor:"pointer"}},
              ic(isPaid?ICONS.dl:"lock","#fff",12),isPaid?".txt":"Paid")
          )
        )
      )),

      // ── JSON Backup ──
      card(h("div",null,
        sectionTitle("DATA BACKUP"),
        h("div",{style:{fontSize:10,color:GRY,marginBottom:12}},"Download a full JSON backup of all your data — employees, attendance, payroll, loans, holidays, expenses and more. Use it to restore later."),
        h("div",{style:{display:"flex",gap:8,marginBottom:8}},
          h("button",{onClick:downloadBackup,style:{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,background:NVY,border:"none",borderRadius:10,padding:"11px",fontSize:12,fontWeight:700,color:CARD,cursor:"pointer"}},
            ic("download",CARD,15),"Download Backup (.json)"),
          h("label",{style:{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,background:SFT,border:"1.5px solid "+BDR,borderRadius:10,padding:"11px",fontSize:12,fontWeight:700,color:NVY,cursor:"pointer"}},
            ic("cloud_upload",NVY,15),"Upload & Restore",
            h("input",{type:"file",accept:".json",style:{display:"none"},onChange:function(e){if(e.target.files&&e.target.files[0])uploadBackup(e.target.files[0]);}})
          )
        ),
        h("div",{style:{background:AMB+"10",borderRadius:8,padding:"8px 10px",border:"1px solid "+AMB+"22",fontSize:10,color:AMB,fontWeight:600}},
          "Uploading a backup will replace ALL current data. Make sure you have a recent backup before restoring.")
      )),

      // ── Tax info ──
      card(h("div",null,
        sectionTitle("TAX CONFIG — FY 2025-26 (NEW REGIME)"),
        [["PF Employee","12% · capped ₹15,000 basic"],["PF Employer","12% · capped ₹15,000 basic"],["ESI Employee","0.75% if gross ≤ ₹21,000"],["ESI Employer","3.25% if gross ≤ ₹21,000"],["Professional Tax","₹0 or ₹200/month"],["Standard Deduction","₹75,000/year"],["Rebate u/s 87A","Zero tax if taxable ≤ ₹12L"],["Cess","4% on income tax"]].map(function(r){return infoRow(r[0],r[1]);}),
        h("div",{style:{height:12}}),
        sectionTitle("INCOME TAX SLABS — FY 2025-26"),
        [["Up to ₹4L","Nil"],["₹4L – ₹8L","5%"],["₹8L – ₹12L","10%"],["₹12L – ₹16L","15%"],["₹16L – ₹20L","20%"],["₹20L – ₹24L","25%"],["Above ₹24L","30%"]].map(function(r){return infoRow(r[0],r[1]);})
      )),

      // ── Danger zone ──
      card(h("div",null,
        sectionTitle("DANGER ZONE"),
        h("button",{onClick:function(){
          if(window.confirm("RESET ALL DATA? This will permanently delete all employees, attendance, payroll and revision records. This cannot be undone.")){
            var keys=["hr_emps","hr_att","hr_inc","hr_revisions","hr_reminders","hr_shifts","hr_notices","hr_bkup_dismissed"];
            keys.forEach(function(k){try{localStorage.removeItem(k);}catch(e){}});
            setEmps([]);setAtt({});setIncentives({});setRevisions({});setReminders([]);setShifts({});setNotices([]);
            showT("All data cleared!");
          }
        },style:{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:7,background:RED+"10",border:"1.5px solid "+RED+"33",borderRadius:10,padding:"11px",fontSize:12,fontWeight:700,color:RED,cursor:"pointer"}},
          ic("delete_forever",RED,16),"Clear All Data (Cannot be undone)")
      ),0)

    ):null;

    return h("div",{className:"fd"},
      tabBar,
      companyTab,
      accountTab,
      dataTab
    );
  }



  // ── Employee signup — verify invite code and link to employer ──────────
  function handleEmployeeSignupSendOTP(){
    var email=authEmail.trim().toLowerCase();
    if(!suName.trim())return setAuthErr("Enter your full name");
    if(!email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return setAuthErr("Enter a valid email");
    if(!signupInviteCode.trim()||signupInviteCode.trim().length!==6)return setAuthErr("Enter the 6-digit invite code from your employer");
    setAuthLoading(true);setAuthErr("");
    // Verify invite code in Supabase
    _sb.from("invite_codes")
      .select("*")
      .eq("code",signupInviteCode.trim())
      .eq("employee_email",email)
      .eq("used",false)
      .maybeSingle()
    .then(function(res){
      if(!res.data){
        setAuthErr("Invalid invite code. Please check and try again.");
        setAuthLoading(false);return;
      }
      if(new Date(res.data.expires_at)<new Date()){
        setAuthErr("This invite code has expired. Ask your employer to generate a new one.");
        setAuthLoading(false);return;
      }
      // Verify email matches (or allow if employer entered different email)
      if(res.data.employee_email&&res.data.employee_email!==email){
        setAuthErr("This invite code was sent to a different email ("+res.data.employee_email+"). Use that email or ask employer to resend.");
        setAuthLoading(false);return;
      }
      // Code valid — check email not already registered
      return _sb.from("user_plans").select("email").eq("email",email).maybeSingle()
      .then(function(planRes){
        if(planRes.data){setAuthErr("This email is already registered. Please Sign In.");setAuthLoading(false);return;}
        // Send OTP
        return _sb.auth.signInWithOtp({email:email,options:{shouldCreateUser:true}})
        .then(function(r){
          setAuthLoading(false);
          if(r.error){setAuthErr(r.error.message);return;}
          setOtpSent(true);setAuthMode("emp-otp");
          lsSet("hr_last_email",email);
          lsSet("hr_emp_invite",JSON.stringify({code:signupInviteCode.trim(),employerEmail:res.data.employer_email}));
        });
      });
    }).catch(function(e){setAuthErr(e.message||"Error");setAuthLoading(false);});
  }

  function handleEmployeeVerifyOTP(){
    var email=authEmail.trim().toLowerCase();
    var token=authOtp.trim();
    if(!token||token.length<6)return setAuthErr("Enter the OTP from your email");
    setAuthLoading(true);setAuthErr("");
    var inviteData=JSON.parse(lsGet("hr_emp_invite","null")||"null");
    if(!inviteData){setAuthErr("Session expired. Please start again.");setAuthLoading(false);return;}
    _sb.auth.verifyOtp({email:email,token:token,type:"email"})
    .then(function(res){
      if(res.error){setAuthErr("Invalid or expired OTP. Try again.");setAuthLoading(false);return;}
      var user=res.data.user;
      var empName=suName.trim()||user.email.split("@")[0];
      // Save employee to Supabase — user_plans + user_orgs + mark invite used
      return Promise.all([
        _sb.from("user_plans").upsert({
          email:user.email,plan:"free",role:"employee",
          employer_email:inviteData.employerEmail,is_admin:false
        },{onConflict:"email"}),
        _sb.from("user_orgs").upsert({
          email:user.email,full_name:empName,
          org_name:"",org_type:"",position:""
        },{onConflict:"email"}),
        _sb.from("invite_codes").update({used:true}).eq("code",inviteData.code)
      ]).then(function(){
        // Now load employer's data so employee dashboard has everything
        return Promise.all([
          _sb.from("user_orgs").select("org_name,logo_base64,address,phone,website,contact_email").eq("email",inviteData.employerEmail).maybeSingle(),
          _sb.from("user_data").select("emps_json,att_json,inc_json,tasks_json").eq("email",inviteData.employerEmail).maybeSingle(),
          _sb.from("user_plans").select("plan,emp_limit").eq("email",inviteData.employerEmail).maybeSingle()
        ]).then(function(empResults){
          var empOrg=empResults[0].data,empData=empResults[1].data,empPlan=empResults[2].data;
          setAuthLoading(false);
          localStorage.removeItem("hr_emp_invite");
          // Set all state immediately — bypass onAuthStateChange
          setUserRole("employee");
          setEmpEmployerEmail(inviteData.employerEmail);
          setSuName(empName);
          setGUser({name:empName,email:user.email,photo:""});
          lsSet("hr_guser",{name:empName,email:user.email,photo:""});
          // Set employer org details
          setOrg({
            name:(empOrg&&empOrg.org_name)||"",
            logo:(empOrg&&empOrg.logo_base64)||"",
            address:(empOrg&&empOrg.address)||"",
            phone:(empOrg&&empOrg.phone)||"",
            contactEmail:(empOrg&&empOrg.contact_email)||"",
            website:(empOrg&&empOrg.website)||"",
            email:inviteData.employerEmail,
            plan:(empPlan&&empPlan.plan)||"free",
            emp_limit:(empPlan&&empPlan.emp_limit)||null
          });
          // Load employer's employee list so employee can find their own record
          if(empData){try{
            setEmps(JSON.parse(empData.emps_json||"[]"));
            setAtt(JSON.parse(empData.att_json||"{}"));
            setIncentives(JSON.parse(empData.inc_json||"{}"));
            try{setTasks(JSON.parse(empData.tasks_json||"[]"));}catch(e2){}
          }catch(e){}}
          _dataLoaded.current=false;
          setDashFresh(true);
          setScreen("app");
          showT("Welcome to Admin HR, "+empName+"!");
        });
      });
    }).catch(function(e){setAuthErr(e.message||"Error");setAuthLoading(false);});
  }

  // ── Employee dashboard ──────────────────────────────────────────────────
  function renderEmployeeDashboard(){
    var myEmail=gUser&&gUser.email?gUser.email:"";
    var myRecord=emps.find(function(e){
      return (e.email&&e.email.toLowerCase()===myEmail.toLowerCase())||
             e.name.toLowerCase()===myEmail.split("@")[0].toLowerCase();
    });
    var myTasks=tasks.filter(function(t){
      return t.assignTarget===myEmail||
        (myRecord&&(t.assignTarget===myRecord.name||t.assignTarget===myRecord.email))||
        (myRecord&&(t.assignType==="department"&&t.assignTarget===myRecord.dept))||
        (myRecord&&(t.assignType==="role"&&t.assignTarget===myRecord.role));
    });
    var myDirectTasks=myTasks.filter(function(t){return t.assignType==="individual";});
    var myTeamTasks=myTasks.filter(function(t){return t.assignType!=="individual";});
    var myLeaves=leaveReqs.filter(function(r){return r.employeeEmail===myEmail;});
    var myNotifs=notifs.filter(function(n){return n.to===myEmail;});
    var unread=myNotifs.filter(function(n){return !n.read;}).length;

    // ── Auto KPI ──
    var yr=curY,mo=curM,daysInMonth=new Date(yr,mo+1,0).getDate();
    var holidays=0,present=0,halfDays=0;
    if(myRecord){
      for(var d=1;d<=daysInMonth;d++){
        var ds=yr+"-"+String(mo+1).padStart(2,"0")+"-"+String(d).padStart(2,"0");
        var s=att[ds+"_"+myRecord.id]||"unmarked";
        if(s==="holiday")holidays++;
        else if(s==="present")present++;
        else if(s==="half")halfDays+=0.5;
      }
    }
    var workDays=daysInMonth-holidays;
    var attPct=workDays>0?Math.round((present+halfDays)/workDays*100):0;
    var completedThisMonth=myDirectTasks.filter(function(t){
      return t.status==="verified"&&t.updatedAt&&
        new Date(t.updatedAt).getMonth()===mo&&new Date(t.updatedAt).getFullYear()===yr;
    }).length;
    var activeTasks=myDirectTasks.filter(function(t){return t.status==="assigned"||t.status==="in_progress"||t.status==="rejected";});
    var leaveEntitlement=myRecord?Number(myRecord.leaveEntitlement||12):12;
    var leavesUsed=myLeaves.filter(function(r){return r.status==="approved";}).length;
    var leaveLeft=Math.max(0,leaveEntitlement-leavesUsed);

    // ── Nav helper ──
    function empNav(id,label,icon){
      var active=empDashTab===id;
      var badge=id==="home"&&unread>0?unread:0;
      return h("button",{onClick:function(){setEmpDashTab(id);setEmpSelTask(null);},
        style:{flex:1,background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"6px 0",color:active?ACCENT:GRY,position:"relative"}},
        h("div",{style:{padding:"4px 14px",borderRadius:14,background:active?ACCENT_SOFT:"transparent",position:"relative",display:"flex",alignItems:"center",justifyContent:"center"}},
          ic(icon,active?ACCENT:GRY,22),
          badge>0?h("div",{style:{position:"absolute",top:-3,right:3,width:14,height:14,borderRadius:"50%",background:RED,display:"flex",alignItems:"center",justifyContent:"center"}},
            h("div",{style:{fontSize:8,fontWeight:700,color:"#fff"}},badge>9?"9+":badge)
          ):null
        ),
        h("div",{style:{fontSize:10,fontWeight:active?700:500}},label)
      );
    }

    // ── Home tab ──
    function empHome(){
      var now=new Date();
      var todayKey=todayStr+"_"+(myRecord?myRecord.id:"");
      var todayAtt=myRecord?(att[todayKey]||"unmarked"):"unmarked";
      var attColors={"present":"#10B981","absent":RED,"half":AMB,"pl":"#4F46E5","ul":GRY,"holiday":"#7C3AED","unmarked":GRY};
      var attLabels={"present":"Present","absent":"Absent","half":"Half Day","pl":"Paid Leave","ul":"Unpaid Leave","holiday":"Holiday","unmarked":"Not marked"};
      var urgentTask=activeTasks.find(function(t){return t.priority==="high";});
      urgentTask=urgentTask||activeTasks[0];
      return h("div",null,
        // Greeting card
        h("div",{style:{background:"linear-gradient(135deg,#4F46E5 0%,#7C3AED 100%)",borderRadius:20,padding:"18px 16px 16px",marginBottom:14,color:"#fff",position:"relative",overflow:"hidden"}},
          h("div",{style:{position:"absolute",top:-20,right:-20,width:100,height:100,borderRadius:"50%",background:"rgba(255,255,255,0.08)"}}),
          h("div",{style:{position:"absolute",bottom:-30,right:20,width:80,height:80,borderRadius:"50%",background:"rgba(255,255,255,0.05)"}}),
          h("div",{style:{fontSize:12,opacity:.75,marginBottom:3}},now.getHours()<12?"Good morning":now.getHours()<17?"Good afternoon":"Good evening"),
          h("div",{style:{fontSize:22,fontWeight:800,marginBottom:12,lineHeight:1.2}},suName||(myRecord&&myRecord.name)||"Employee"),
          h("div",{style:{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(255,255,255,0.15)",borderRadius:10,padding:"6px 12px"}},
            h("div",{style:{width:8,height:8,borderRadius:"50%",background:attColors[todayAtt]||"#fff",flexShrink:0}}),
            h("div",{style:{fontSize:12,fontWeight:600}},attLabels[todayAtt]||"Unknown"),
            h("div",{style:{fontSize:11,opacity:.7}},"\u2022 Today")
          )
        ),
        // Stats row
        h("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}},
          h("div",{style:{background:CARD,borderRadius:14,padding:"12px 8px",textAlign:"center",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}},
            h("div",{style:{fontSize:22,fontWeight:800,color:"#10B981"}},present+(halfDays>0?"+":"")),
            h("div",{style:{fontSize:9,color:GRY,marginTop:2,lineHeight:1.3}},"Days\nPresent")
          ),
          h("div",{style:{background:CARD,borderRadius:14,padding:"12px 8px",textAlign:"center",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}},
            h("div",{style:{fontSize:22,fontWeight:800,color:leaveLeft>3?ACCENT:RED}},leaveLeft),
            h("div",{style:{fontSize:9,color:GRY,marginTop:2,lineHeight:1.3}},"Leaves\nRemaining")
          )
        ),
        // Performance snapshot
        h("div",{style:{background:CARD,borderRadius:16,padding:"14px",marginBottom:14,boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}},
          h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}},
            h("div",{style:{fontSize:12,fontWeight:700,color:NVY,display:"flex",alignItems:"center",gap:6}},ic("insights","#D97706",15),"Performance — "+MOS[mo]),
            h("div",{style:{fontSize:11,fontWeight:700,color:attPct>=90?"#10B981":attPct>=70?ACCENT:RED}},attPct+"%")
          ),
          h("div",{style:{height:6,background:SFT,borderRadius:3,overflow:"hidden",marginBottom:8}},
            h("div",{style:{height:"100%",background:attPct>=90?"#10B981":attPct>=70?ACCENT:RED,borderRadius:3,width:attPct+"%",transition:"width 0.8s"}})
          ),
          h("div",{style:{display:"flex",justifyContent:"space-between",fontSize:10,color:GRY}},
            h("span","Attendance "+attPct+"%"),
            h("span",completedThisMonth+" tasks done this month")
          )
        ),
        // Notifications
        unread>0?h("div",{style:{background:CARD,borderRadius:16,padding:"14px",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}},
          h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}},
            h("div",{style:{fontSize:12,fontWeight:700,color:NVY,display:"flex",alignItems:"center",gap:6}},
              ic("notifications",ACCENT,15),"Notifications",
              h("span",{style:{background:RED,color:"#fff",fontSize:9,fontWeight:700,borderRadius:10,padding:"0 6px",marginLeft:4}},unread)
            )
          ),
          myNotifs.slice(0,3).map(function(n){
            return h("div",{key:n.id,onClick:function(){setNotifs(function(p){return p.map(function(x){return x.id===n.id?Object.assign({},x,{read:true}):x;});});setUnreadNotifs(function(c){return Math.max(0,c-1);});},style:{display:"flex",gap:8,padding:"6px 0",borderBottom:"1px solid "+BDR,cursor:"pointer",alignItems:"flex-start"}},
              h("div",{style:{width:6,height:6,borderRadius:"50%",background:n.read?"transparent":ACCENT,flexShrink:0,marginTop:5}}),
              h("div",{style:{flex:1}},
                h("div",{style:{fontSize:12,fontWeight:600,color:NVY}},n.title),
                h("div",{style:{fontSize:11,color:GRY,marginTop:1}},n.message)
              )
            );
          })
        ):null
      );
    }

    // ── Attendance tab (read-only calendar) ──
    function empAttendance(){
      var sAttY=empPayYear,sAttM=empPayMonth;
      return h("div",null,
        h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}},
          h("div",{style:{fontSize:15,fontWeight:700,color:NVY}},MOS[sAttM]+" "+sAttY),
          h("div",{style:{fontSize:11,color:GRY}},today.toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"short"}))
        ),
        h("div",{style:{display:"flex",gap:6,marginBottom:12,overflowX:"auto"}},
          MOS.map(function(m,i){
            return h("button",{key:i,onClick:function(){setEmpPayMonth(i);},style:{flexShrink:0,background:sAttM===i?ACCENT:CARD,border:"1px solid "+(sAttM===i?ACCENT:BDR),borderRadius:15,padding:"4px 10px",color:sAttM===i?ACCENT_FG:GRY,fontSize:11,fontWeight:600,cursor:"pointer"}},m);
          })
        ),
        h("div",{style:{background:CARD,borderRadius:16,padding:"14px",boxShadow:"0 2px 8px rgba(0,0,0,0.06)",marginBottom:12}},
          h("div",{style:{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,marginBottom:8}},
            ["Su","Mo","Tu","We","Th","Fr","Sa"].map(function(d){return h("div",{key:d,style:{fontSize:9,color:GRY,textAlign:"center",fontWeight:700,paddingBottom:3}},d);}),
            (function(){
              var cells=[];
              var fd=new Date(sAttY,sAttM,1).getDay();
              var days=new Date(sAttY,sAttM+1,0).getDate();
              for(var xi=0;xi<fd;xi++)cells.push(h("div",{key:"x"+xi}));
              for(var day=1;day<=days;day++){
                var ds=sAttY+"-"+String(sAttM+1).padStart(2,"0")+"-"+String(day).padStart(2,"0");
                var s=myRecord?(att[ds+"_"+myRecord.id]||"unmarked"):"unmarked";
                var isTd=ds===todayStr;
                cells.push(h("div",{key:day,style:{aspectRatio:"1",borderRadius:6,background:s==="unmarked"?SFT:ATC[s]+"18",border:isTd?"2px solid "+ACCENT:"1px solid "+(s==="unmarked"?BDR:ATC[s]+"33"),display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}},
                  h("div",{style:{fontSize:11,fontWeight:isTd?800:500,color:s==="unmarked"?NVY:ATC[s]}},day),
                  s!=="unmarked"&&s!=="unmarked"?h("div",{style:{fontSize:6,color:ATC[s],fontWeight:700}},ATL[s]?ATL[s].slice(0,2):""):null
                ));
              }
              return cells;
            })()
          ),
          h("div",{style:{display:"flex",flexWrap:"wrap",gap:6,paddingTop:8,borderTop:"1px solid "+BDR}},
            Object.entries(ATL).filter(function(kv){return kv[0]!=="unmarked";}).map(function(kv){
              return h("div",{key:kv[0],style:{display:"flex",alignItems:"center",gap:3}},
                h("div",{style:{width:8,height:8,borderRadius:2,background:ATC[kv[0]]}}),
                h("span",{style:{fontSize:9,color:GRY}},kv[1])
              );
            })
          )
        ),
        // Summary
        myRecord?h("div",{style:{background:CARD,borderRadius:16,padding:"14px",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}},
          h("div",{style:{fontSize:12,fontWeight:700,color:NVY,marginBottom:10}},"Monthly Summary"),
          h("div",{style:{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}},
            (function(){
              var p2=0,a2=0,h2=0,l2=0;
              var dInM=new Date(sAttY,sAttM+1,0).getDate();
              for(var d2=1;d2<=dInM;d2++){
                var ds2=sAttY+"-"+String(sAttM+1).padStart(2,"0")+"-"+String(d2).padStart(2,"0");
                var s2=att[ds2+"_"+myRecord.id]||"unmarked";
                if(s2==="present")p2++;
                else if(s2==="absent")a2++;
                else if(s2==="half")h2++;
                else if(s2==="pl"||s2==="ul"||s2==="sl"||s2==="cl")l2++;
              }
              return [["Present",p2,"#10B981"],["Absent",a2,RED],["Half",h2,AMB],["Leave",l2,ACCENT]];
            })().map(function(item){
              return h("div",{key:item[0],style:{background:item[2]+"10",borderRadius:10,padding:"10px",textAlign:"center"}},
                h("div",{style:{fontSize:20,fontWeight:800,color:item[2]}},item[1]),
                h("div",{style:{fontSize:10,color:GRY,marginTop:2}},item[0])
              );
            })
          )
        ):null
      );
    }

    // ── Tasks tab ──
    function empTasks(){
      var taskInnerTab=empDashTab==="tasks"?"mine":empTab;
      var showMine=true;
      if(empSelTask){
        var t=empSelTask;
        var tComments=taskComments[t.id]||[];
        return h("div",{className:"fd"},
          h("button",{onClick:function(){setEmpSelTask(null);},style:{display:"flex",alignItems:"center",gap:6,background:"none",border:"none",cursor:"pointer",color:ACCENT,fontSize:13,fontWeight:600,padding:"0 0 14px"}},
            ic("arrow_back",ACCENT,16),"Back"
          ),
          h("div",{style:{background:CARD,borderRadius:16,padding:"14px",boxShadow:"0 2px 12px rgba(0,0,0,0.08)",marginBottom:8}},
            h("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:6}},
              h("div",{style:{fontSize:15,fontWeight:700,color:NVY,flex:1,marginRight:8,lineHeight:1.4}},t.title),
              h("div",{style:{fontSize:9,fontWeight:700,padding:"3px 9px",borderRadius:20,flexShrink:0,background:t.priority==="high"?"#FEE2E2":t.priority==="medium"?"#FEF3C7":"#D1FAE5",color:t.priority==="high"?"#991B1B":t.priority==="medium"?"#92400E":"#065F46"}},t.priority.toUpperCase())
            ),
            t.description?h("div",{style:{fontSize:12,color:GRY,marginBottom:10,lineHeight:1.6,paddingBottom:10,borderBottom:"1px solid "+BDR}},t.description):null,
            // Status steps
            h("div",{style:{display:"flex",alignItems:"center",marginBottom:12}},
              ["assigned","in_progress","completed","verified"].map(function(s,i){
                var states=["assigned","in_progress","completed","verified"];
                var curIdx=states.indexOf(t.status);
                var isDone=i<=curIdx;var isCur=i===curIdx;
                return [
                  h("div",{key:s,style:{display:"flex",flexDirection:"column",alignItems:"center",gap:2}},
                    h("div",{style:{width:22,height:22,borderRadius:"50%",background:isDone?(isCur?ACCENT:"#10B981"):"#E2E8F0",display:"flex",alignItems:"center",justifyContent:"center"}},
                      isDone&&!isCur?ic("check","#fff",11):h("div",{style:{width:7,height:7,borderRadius:"50%",background:isCur?"#fff":"#94A3B8"}})
                    ),
                    h("div",{style:{fontSize:7,color:isCur?ACCENT:GRY,fontWeight:isCur?700:400,textAlign:"center",maxWidth:38,marginTop:2}},s.replace("_"," "))
                  ),
                  i<3?h("div",{key:s+"l",style:{flex:1,height:2,background:i<curIdx?"#10B981":"#E2E8F0",borderRadius:1,margin:"0 2px",marginBottom:14}}):null
                ];
              })
            ),
            h("div",{style:{display:"flex",gap:16}},
              h("div",null,h("div",{style:{fontSize:9,color:GRY,letterSpacing:1}},"DEADLINE"),h("div",{style:{fontSize:12,fontWeight:600,color:t.deadline&&new Date(t.deadline)<new Date()&&t.status!=="verified"?RED:NVY,marginTop:2}},t.deadline||"—")),
              h("div",null,h("div",{style:{fontSize:9,color:GRY,letterSpacing:1}},"TYPE"),h("div",{style:{fontSize:12,fontWeight:600,color:NVY,marginTop:2}},t.assignType==="individual"?"Direct":t.assignType==="department"?"Team ("+t.assignTarget+")":"Role ("+t.assignTarget+")")))
          ),
          t.rejectionReason?h("div",{style:{background:RED+"10",borderRadius:12,padding:"10px 14px",marginBottom:8,display:"flex",gap:8}},
            ic("cancel",RED,16),
            h("div",null,h("div",{style:{fontSize:11,fontWeight:700,color:RED}},"Revision needed"),h("div",{style:{fontSize:11,color:RED,marginTop:2}},t.rejectionReason))
          ):null,
          t.status==="assigned"?h("button",{onClick:function(){updateTaskStatus(t.id,"in_progress");setEmpSelTask(Object.assign({},t,{status:"in_progress"}));showT("Started!");},style:{width:"100%",background:ACCENT,border:"none",borderRadius:12,padding:"12px",color:ACCENT_FG,fontSize:13,fontWeight:700,cursor:"pointer",marginBottom:10,display:"flex",alignItems:"center",justifyContent:"center",gap:8}},ic("play_arrow",ACCENT_FG,18),"Start Task"):null,
          (t.status==="in_progress"||t.status==="rejected")&&t.assignType==="individual"?h("button",{onClick:function(){askForm("Mark Task Complete",[{key:"note",label:"Completion note (optional)",type:"textarea",placeholder:"Optional"}],function(vals){var note=vals.note||"";updateTaskStatus(t.id,"completed",note);setEmpSelTask(Object.assign({},t,{status:"completed",completionNote:note}));showT("Marked complete!");},{submitLabel:"Mark Complete"});},style:{width:"100%",background:"#10B981",border:"none",borderRadius:12,padding:"12px",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",marginBottom:10,display:"flex",alignItems:"center",justifyContent:"center",gap:8}},ic("task_alt","#fff",18),"Mark Complete"):null,
          h("div",{style:{background:CARD,borderRadius:16,padding:"14px",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}},
            h("div",{style:{fontSize:12,fontWeight:700,color:NVY,marginBottom:10,display:"flex",alignItems:"center",gap:6}},ic("forum",NVY,15),"Status Updates ("+((t.statusHistory||[]).length)+")"),
            h("div",{style:{maxHeight:200,overflowY:"auto",marginBottom:10}},
              (!t.statusHistory||t.statusHistory.length===0)?h("div",{style:{textAlign:"center",padding:"16px 0",color:GRY,fontSize:12}},"No status updates yet."):
              t.statusHistory.map(function(s){
                var isMe=s.by===gUser.email;
                return h("div",{key:s.id,style:{marginBottom:9,paddingBottom:9,borderBottom:"1px solid "+BDR}},
                  h("div",{style:{fontSize:9,color:GRY,fontWeight:600,marginBottom:3}},(isMe?"You":s.by.split("@")[0])+" \u00b7 "+new Date(s.at).toLocaleDateString("en-IN",{day:"numeric",month:"short"})+" "+new Date(s.at).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})),
                  h("div",{style:{fontSize:12,color:NVY,lineHeight:1.45}},s.text)
                );
              })
            ),
            h("div",{style:{display:"flex",gap:8}},
              h("input",{type:"text",value:taskStatusInput,onChange:function(e){setTaskStatusInput(e.target.value);},onKeyDown:function(e){if(e.key==="Enter"){addStatusUpdate(t.id);}},placeholder:"Type status update...",style:{flex:1,background:SFT,border:"1px solid "+BDR,borderRadius:"50px",padding:"10px 16px",fontSize:13,color:NVY,outline:"none",fontFamily:"inherit"}}),
              h("button",{onClick:function(){addStatusUpdate(t.id);},style:{width:40,height:40,background:ACCENT,border:"none",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}},ic("send",ACCENT_FG,16))
            )
          )
        );
      }

      var taskFilter=empTaskComment?"all":"all"; // using taskTab for filter
      var showMineTab=!empTaskComment||empTaskComment==="_mine";
      var mineActive=empSelTask===null&&empDashTab==="tasks";
      var displayTasks=myDirectTasks;
      var teamDisplay=myTeamTasks;

      return h("div",{className:"fd"},
        h("div",{style:{display:"flex",background:SFT,borderRadius:12,padding:3,marginBottom:12,gap:3}},
          h("button",{onClick:function(){setEmpTaskComment("_mine");},style:{flex:1,background:empTaskComment!=="team"?CARD:"transparent",border:empTaskComment!=="team"?"1px solid "+BDR:"none",borderRadius:9,padding:"8px",color:empTaskComment!=="team"?NVY:GRY,fontSize:12,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5}},
            ic("person",empTaskComment!=="team"?ACCENT:GRY,14),"My Tasks",
            displayTasks.filter(function(t){return t.status==="assigned"||t.status==="in_progress";}).length>0?h("span",{style:{background:RED,color:"#fff",fontSize:9,fontWeight:700,borderRadius:10,padding:"0 5px"}},displayTasks.filter(function(t){return t.status==="assigned"||t.status==="in_progress";}).length):null
          ),
          h("button",{onClick:function(){setEmpTaskComment("team");},style:{flex:1,background:empTaskComment==="team"?CARD:"transparent",border:empTaskComment==="team"?"1px solid "+BDR:"none",borderRadius:9,padding:"8px",color:empTaskComment==="team"?NVY:GRY,fontSize:12,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5}},
            ic("groups",empTaskComment==="team"?ACCENT:GRY,14),"Team Tasks",
            teamDisplay.filter(function(t){return t.status==="assigned"||t.status==="in_progress";}).length>0?h("span",{style:{background:AMB+"40",color:AMB,fontSize:9,fontWeight:700,borderRadius:10,padding:"0 5px"}},teamDisplay.filter(function(t){return t.status==="assigned"||t.status==="in_progress";}).length):null
          )
        ),
        (function(){
          var list=empTaskComment==="team"?teamDisplay:displayTasks;
          var active=list.filter(function(t){return t.status==="assigned"||t.status==="in_progress"||t.status==="rejected";});
          var done=list.filter(function(t){return t.status==="completed"||t.status==="verified";});
          return h("div",null,
            list.length===0?h("div",{style:{textAlign:"center",padding:"48px 0",color:GRY}},
              ic("assignment",GRY,48),
              h("div",{style:{fontSize:14,marginTop:12,fontWeight:600}},empTaskComment==="team"?"No team tasks":"No tasks assigned yet")
            ):null,
            active.length>0?h("div",{style:{marginBottom:16}},
              h("div",{style:{fontSize:11,fontWeight:700,color:GRY,letterSpacing:1,marginBottom:8}},"ACTIVE"),
              active.map(function(t){
                var isOverdue=t.deadline&&new Date(t.deadline)<new Date();
                return h("div",{key:t.id,onClick:function(){setEmpSelTask(t);},style:{background:CARD,borderRadius:14,padding:"12px 14px",marginBottom:8,boxShadow:"0 2px 8px rgba(0,0,0,0.06)",cursor:"pointer",borderLeft:"3px solid "+(t.status==="rejected"?RED:t.priority==="high"?RED:t.priority==="medium"?AMB:"#10B981")}},
                  h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:5}},
                    h("div",{style:{fontSize:12,fontWeight:700,color:NVY,flex:1,marginRight:8}},t.title),
                    t.status==="rejected"?h("div",{style:{fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:20,background:"#FEE2E2",color:"#991B1B"}},"Revision"):
                    h("div",{style:{fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:20,background:"#FEF9C3",color:"#713F12"}},t.status==="in_progress"?"Active":"New")
                  ),
                  h("div",{style:{display:"flex",gap:10,alignItems:"center"}},
                    h("div",{style:{fontSize:10,color:isOverdue?RED:GRY,display:"flex",alignItems:"center",gap:3,fontWeight:isOverdue?700:400}},
                      ic("calendar_today",isOverdue?RED:GRY,10),
                      t.deadline?(isOverdue?"Overdue: ":"Due: ")+t.deadline:"No deadline"
                    ),
                    ((t.statusHistory||[]).length)>0?h("div",{style:{fontSize:10,color:GRY,display:"flex",alignItems:"center",gap:2}},ic("forum",GRY,10),(t.statusHistory||[]).length):null
                  )
                );
              })
            ):null,
            done.length>0?h("div",null,
              h("div",{style:{fontSize:11,fontWeight:700,color:GRY,letterSpacing:1,marginBottom:8}},"COMPLETED"),
              done.map(function(t){
                return h("div",{key:t.id,onClick:function(){setEmpSelTask(t);},style:{background:CARD,borderRadius:14,padding:"12px 14px",marginBottom:8,boxShadow:"0 2px 8px rgba(0,0,0,0.06)",cursor:"pointer",opacity:.7,borderLeft:"3px solid "+(t.status==="verified"?"#10B981":ACCENT)}},
                  h("div",{style:{display:"flex",justifyContent:"space-between"}},
                    h("div",{style:{fontSize:12,fontWeight:600,color:NVY}},t.title),
                    h("div",{style:{fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:20,background:t.status==="verified"?"#D1FAE5":"#EFF6FF",color:t.status==="verified"?"#065F46":"#1E40AF"}},t.status==="verified"?"Verified":"Submitted")
                  )
                );
              })
            ):null
          );
        })()
      );
    }

    // ── Leave tab ──
    function empLeave(){
      var entitlement=myRecord?Number(myRecord.leaveEntitlement||12):12;
      var leaveByType={};
      Object.keys(LEAVE_TYPES).forEach(function(lt){
        var used=myLeaves.filter(function(r){return r.leaveType===lt&&r.status==="approved";}).length;
        var total=lt==="CL"?Math.round(entitlement*0.4):lt==="SL"?Math.round(entitlement*0.2):lt==="PL"?Math.round(entitlement*0.3):lt==="EL"?2:0;
        leaveByType[lt]={total:total,used:used,left:Math.max(0,total-used)};
      });
      return h("div",{className:"fd"},
        h("div",{style:{background:CARD,borderRadius:16,padding:"16px",marginBottom:14,boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}},
          h("div",{style:{fontSize:12,fontWeight:700,color:NVY,marginBottom:12,display:"flex",alignItems:"center",gap:6}},ic("event_available",ACCENT,15),"Leave Balance"),
          h("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}},
            [["CL","Casual Leave"],["SL","Sick Leave"],["PL","Paid Leave"],["EL","Emergency"]].map(function(item){
              var lb=leaveByType[item[0]]||{total:0,used:0,left:0};
              var pct=lb.total>0?Math.round(lb.left/lb.total*100):0;
              return h("div",{key:item[0],style:{background:SFT,borderRadius:12,padding:"12px"}},
                h("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:6}},
                  h("div",{style:{fontSize:10,color:GRY,fontWeight:600}},item[1]),
                  h("div",{style:{fontSize:11,fontWeight:700,color:lb.left>0?ACCENT:RED}},lb.left+"/"+lb.total)
                ),
                h("div",{style:{height:5,background:BDR,borderRadius:3,overflow:"hidden"}},
                  h("div",{style:{height:"100%",background:lb.left>0?ACCENT:RED,borderRadius:3,width:pct+"%"}})
                )
              );
            })
          )
        ),
        empShowLeave?h("div",{style:{background:CARD,borderRadius:16,padding:"16px",marginBottom:14,boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}},
          h("div",{style:{fontSize:13,fontWeight:700,color:NVY,marginBottom:14,display:"flex",alignItems:"center",gap:8}},ic("edit_calendar",ACCENT,16),"Apply for Leave"),
          lbl("LEAVE TYPE"),
          chipSelect(empLeaveType,function(v){setEmpLeaveType(v);},Object.keys(LEAVE_TYPES).map(function(lt){return {v:lt,l:LEAVE_TYPES[lt].name};}),{question:"Choose the leave type"}),
          h("div",{style:{display:"flex",gap:8,marginBottom:8}},
            h("div",{style:{flex:1}},lbl("FROM"),datePick(empLeaveFrom,function(v){setEmpLeaveFrom(v);},{question:"Leave from"})),
            h("div",{style:{flex:1}},lbl("TO"),datePick(empLeaveTo,function(v){setEmpLeaveTo(v);},{question:"Leave to"}))
          ),
          LEAVE_TYPES[empLeaveType]&&LEAVE_TYPES[empLeaveType].needsReason?h("div",null,
            lbl("REASON"),
            h("textarea",{value:empLeaveReason,onChange:function(e){setEmpLeaveReason(e.target.value);},placeholder:"Enter reason...",style:{width:"100%",height:60,background:SFT,border:"1px solid "+BDR,borderRadius:10,padding:"10px 12px",fontSize:12,color:NVY,outline:"none",fontFamily:"inherit",resize:"none",marginBottom:8}})
          ):null,
          h("div",{style:{display:"flex",gap:8}},
            h("button",{onClick:function(){
              if(!empLeaveFrom||!empLeaveTo)return showT("Select dates","err");
              if(LEAVE_TYPES[empLeaveType]&&LEAVE_TYPES[empLeaveType].needsReason&&!empLeaveReason.trim())return showT("Enter reason","err");
              var req={id:Date.now(),employeeEmail:myEmail,employerEmail:empEmployerEmail,leaveType:empLeaveType,fromDate:empLeaveFrom,toDate:empLeaveTo,reason:empLeaveReason.trim(),status:"pending",adminReply:"",createdAt:new Date().toISOString()};
              setLeaveReqs(function(p){return [req].concat(p);});
              addNotif(empEmployerEmail,myEmail,"leave_requested","Leave request",(gUser?gUser.email.split("@")[0]:""+" applied for "+LEAVE_TYPES[empLeaveType].name),String(req.id),"leave");
              setEmpLeaveFrom("");setEmpLeaveTo("");setEmpLeaveReason("");setEmpShowLeave(false);
              showT("Leave request sent!");
            },style:{flex:2,background:ACCENT,border:"none",borderRadius:10,padding:"12px",color:ACCENT_FG,fontSize:13,fontWeight:700,cursor:"pointer"}},"Submit"),
            h("button",{onClick:function(){setEmpShowLeave(false);},style:{flex:1,background:SFT,border:"1px solid "+BDR,borderRadius:10,padding:"12px",color:NVY,fontSize:12,cursor:"pointer"}},"Cancel")
          )
        ):h("button",{onClick:function(){setEmpShowLeave(true);},style:{width:"100%",background:ACCENT,border:"none",borderRadius:14,padding:"13px",color:ACCENT_FG,fontSize:13,fontWeight:700,cursor:"pointer",marginBottom:14,display:"flex",alignItems:"center",justifyContent:"center",gap:8}},
          ic("add",ACCENT_FG,18),"Apply for Leave"
        ),
        myLeaves.length>0?h("div",null,
          h("div",{style:{fontSize:11,fontWeight:700,color:GRY,letterSpacing:1,marginBottom:8}},"LEAVE HISTORY"),
          myLeaves.map(function(r){
            return h("div",{key:r.id,style:{background:CARD,borderRadius:14,padding:"12px 14px",marginBottom:8,boxShadow:"0 2px 8px rgba(0,0,0,0.06)",borderLeft:"3px solid "+(r.status==="approved"?"#10B981":r.status==="rejected"?RED:AMB)}},
              h("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:4}},
                h("div",{style:{fontSize:12,fontWeight:700,color:NVY}},LEAVE_TYPES[r.leaveType]?LEAVE_TYPES[r.leaveType].name:r.leaveType),
                h("div",{style:{fontSize:10,fontWeight:700,padding:"2px 9px",borderRadius:20,background:r.status==="approved"?"#D1FAE5":r.status==="rejected"?"#FEE2E2":"#FEF3C7",color:r.status==="approved"?"#065F46":r.status==="rejected"?"#991B1B":"#92400E"}},r.status.charAt(0).toUpperCase()+r.status.slice(1))
              ),
              h("div",{style:{fontSize:11,color:GRY}},r.fromDate+" \u2192 "+r.toDate),
              r.reason?h("div",{style:{fontSize:11,color:GRY,marginTop:3,fontStyle:"italic"}},"\u201c"+r.reason+"\u201d"):null,
              r.adminReply?h("div",{style:{fontSize:11,color:RED,marginTop:4}},"Reply: "+r.adminReply):null
            );
          })
        ):null
      );
    }

    // ── Profile tab ──
    function empProfile(){
      var emp=myRecord;
      var payMp=emp?getMonthPay(emp,empPayYear,empPayMonth):null;
      var payData=payMp?payMp.d:null;
      return h("div",{className:"fd"},
        h("div",{style:{background:"linear-gradient(135deg,#0F172A,#1E293B)",borderRadius:20,padding:"20px 16px",marginBottom:14,textAlign:"center",position:"relative",overflow:"hidden"}},
          h("div",{style:{position:"absolute",top:-30,right:-30,width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,0.04)"}}),
          h("div",{style:{width:72,height:72,borderRadius:"50%",background:"linear-gradient(135deg,"+ACCENT+",#7C3AED)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px",fontSize:28,fontWeight:800,color:"#fff"}},
            (emp?emp.name:(suName||gUser.email.split("@")[0]))[0].toUpperCase()
          ),
          h("div",{style:{fontSize:20,fontWeight:800,color:"#fff"}},emp?emp.name:(suName||gUser.email.split("@")[0])),
          h("div",{style:{fontSize:12,color:"rgba(255,255,255,0.6)",marginTop:4}},emp?(emp.role||"")+(emp.dept?" • "+emp.dept:""):"Employee"),
          emp&&emp.joined?h("div",{style:{fontSize:11,color:"rgba(255,255,255,0.5)",marginTop:4}},"Joined: "+emp.joined):null
        ),
        emp?h("div",{style:{background:CARD,borderRadius:16,padding:"14px",marginBottom:12,boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}},
          h("div",{style:{fontSize:11,fontWeight:700,color:GRY,letterSpacing:1,marginBottom:10}},"PERSONAL DETAILS"),
          [
            emp.eid?["Employee ID",emp.eid]:null,
            emp.mob?["Mobile",emp.mob]:null,
            emp.email?["Email",emp.email]:null,
            emp.pan?["PAN",emp.pan.slice(0,3)+"XXXXX"+emp.pan.slice(-2)]:null,
            emp.uan?["UAN",emp.uan.slice(0,3)+"XXXXX"+emp.uan.slice(-2)]:null,
            emp.aadhar?["Aadhaar","XXXX XXXX "+emp.aadhar.slice(-4)]:null,
          ].filter(Boolean).map(function(item){
            return h("div",{key:item[0],style:{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid "+BDR}},
              h("span",{style:{fontSize:12,color:GRY}},item[0]),
              h("span",{style:{fontSize:12,fontWeight:600,color:NVY}},item[1])
            );
          })
        ):null,
        h("div",{style:{background:CARD,borderRadius:16,padding:"14px",marginBottom:12,boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}},
          h("div",{style:{display:"flex",alignItems:"center",gap:10,marginBottom:org.phone||org.website?10:0}},
            org.logo?h("img",{src:org.logo,style:{width:40,height:40,borderRadius:10,objectFit:"contain",flexShrink:0}}):
            h("div",{style:{width:40,height:40,borderRadius:10,background:ACCENT+"15",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}},ic("business",ACCENT,22)),
            h("div",null,
              h("div",{style:{fontSize:13,fontWeight:700,color:NVY}},org.name||"Your Company"),
              org.address?h("div",{style:{fontSize:11,color:GRY,marginTop:2}},org.address):null
            )
          ),
          org.phone?h("div",{style:{display:"flex",gap:6,alignItems:"center",fontSize:12,color:GRY,marginTop:8,paddingTop:8,borderTop:"1px solid "+BDR}},ic("phone",GRY,13),org.phone):null,
          h("div",{style:{marginTop:8,paddingTop:8,borderTop:"1px solid "+BDR,display:"flex",gap:6,alignItems:"center",fontSize:11,color:GRY}},
            ic("mail",GRY,13),"Employer: "+empEmployerEmail
          )
        ),
        emp&&payData?h("div",{style:{background:CARD,borderRadius:16,padding:"16px",marginBottom:12,boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}},
          h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}},
            h("div",{style:{fontSize:13,fontWeight:700,color:NVY,display:"flex",alignItems:"center",gap:6}},ic("payments",ACCENT,15),"Salary"),
            h("div",{style:{display:"flex",gap:5}},
              h("select",{value:empPayMonth,onChange:function(e){setEmpPayMonth(Number(e.target.value));},style:{fontSize:10,background:SFT,border:"1px solid "+BDR,borderRadius:6,padding:"3px 6px",color:NVY,outline:"none"}},
                MOS.map(function(m,i){return h("option",{key:i,value:i},m);})),
              h("select",{value:empPayYear,onChange:function(e){setEmpPayYear(Number(e.target.value));},style:{fontSize:10,background:SFT,border:"1px solid "+BDR,borderRadius:6,padding:"3px 6px",color:NVY,outline:"none"}},
                [curY-1,curY].map(function(y){return h("option",{key:y,value:y},y);}))
            )
          ),
          // ── Formula row ──
          h("div",{style:{display:"flex",alignItems:"stretch",gap:4,marginBottom:14}},
            h("div",{style:{flex:1,background:ACCENT_SOFT,borderRadius:10,padding:"10px 8px",textAlign:"center"}},
              h("div",{style:{fontSize:9,color:GRY,letterSpacing:.5,marginBottom:2}},"GROSS"),
              h("div",{style:{fontSize:15,fontWeight:800,color:NVY}},fmt(payData.gr))
            ),
            (payData.pfE+payData.esiE+payData.pt+payData.tds)>0?h("div",{style:{display:"flex",alignItems:"center",padding:"0 3px",color:GRY,fontSize:16}},["\u2212"]):null,
            (payData.pfE+payData.esiE+payData.pt+payData.tds)>0?h("div",{style:{flex:1,background:RED+"10",borderRadius:10,padding:"10px 8px",textAlign:"center"}},
              h("div",{style:{fontSize:9,color:GRY,letterSpacing:.5,marginBottom:2}},"DEDUCTIONS"),
              h("div",{style:{fontSize:15,fontWeight:800,color:RED}},fmt(payData.pfE+payData.esiE+payData.pt+payData.tds))
            ):null,
            h("div",{style:{display:"flex",alignItems:"center",padding:"0 3px",color:GRY,fontSize:16}},"="),
            h("div",{style:{flex:1,background:"#10B981"+"12",borderRadius:10,padding:"10px 8px",textAlign:"center"}},
              h("div",{style:{fontSize:9,color:GRY,letterSpacing:.5,marginBottom:2}},"NET PAY"),
              h("div",{style:{fontSize:15,fontWeight:800,color:"#10B981"}},fmt(payMp.netFinal))
            )
          ),
          // ── Earnings breakdown ──
          h("div",{style:{fontSize:9,fontWeight:700,color:GRY,letterSpacing:1,marginBottom:5}},"EARNINGS"),
          (emp.salaryType==="fixed"?[["Fixed Salary",fmt(payData.basic),NVY]]:
            [["Basic",fmt(payData.basic),NVY],["HRA",fmt(payData.hra),NVY],["Allowances",fmt(payData.allow),NVY]])
          .concat(payData.inc>0?[["Incentive",fmt(payData.inc),"#059669"]]:[])
          .concat(payData.shiftAllow>0?[["Shift Allowance",fmt(payData.shiftAllow),"#0284C7"]]:[])
          .concat((payData.ad+payData.hd+payData.ud)>0?[["Absent/Half Day","-"+fmt(payData.ad+payData.hd+payData.ud),AMB]]:[])
          .map(function(item){
            return h("div",{key:item[0],style:{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid "+BDR}},
              h("span",{style:{fontSize:12,color:GRY}},item[0]),h("span",{style:{fontSize:12,fontWeight:600,color:item[2]}},item[1])
            );
          }),
          h("div",{style:{display:"flex",justifyContent:"space-between",padding:"5px 0",marginBottom:10}},
            h("span",{style:{fontSize:12,fontWeight:700,color:NVY}},"Gross"),
            h("span",{style:{fontSize:12,fontWeight:800,color:"#10B981"}},fmt(payData.gr))
          ),
          // ── Deductions breakdown ──
          (payData.pfE+payData.esiE+payData.pt+payData.tds)>0?h("div",null,
            h("div",{style:{fontSize:9,fontWeight:700,color:GRY,letterSpacing:1,marginBottom:5}},"DEDUCTIONS"),
            [
              payData.pfE>0?["PF — Employee (12%)","-"+fmt(payData.pfE),RED]:null,
              payData.esiE>0?["ESI — Employee (0.75%)","-"+fmt(payData.esiE),RED]:null,
              payData.pt>0?["Professional Tax","-"+fmt(payData.pt),AMB]:null,
              payData.tds>0?["TDS","-"+fmt(payData.tds),RED]:null,
            ].filter(Boolean).map(function(item){
              return h("div",{key:item[0],style:{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid "+BDR}},
                h("span",{style:{fontSize:12,color:GRY}},item[0]),h("span",{style:{fontSize:12,fontWeight:600,color:item[2]}},item[1])
              );
            })
          ):h("div",{style:{fontSize:11,color:GRY,padding:"4px 0",marginBottom:8}},"No deductions"),
          // ── Bonus / Reimbursement / OT / Loan ──
          payMp.bonusTotal>0?h("div",{style:{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid "+BDR}},h("span",{style:{fontSize:12,color:GRY}},"Bonus"),h("span",{style:{fontSize:12,fontWeight:600,color:AMB}},"+"+fmt(payMp.bonusTotal))):null,
          payMp.claimTotal>0?h("div",{style:{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid "+BDR}},h("span",{style:{fontSize:12,color:GRY}},"Reimbursement"),h("span",{style:{fontSize:12,fontWeight:600,color:"#10B981"}},"+"+fmt(payMp.claimTotal))):null,
          payMp.otTotal>0?h("div",{style:{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid "+BDR}},h("span",{style:{fontSize:12,color:GRY}},"Overtime"),h("span",{style:{fontSize:12,fontWeight:600,color:TEL}},"+"+fmt(payMp.otTotal))):null,
          payMp.loanDed>0?h("div",{style:{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid "+BDR}},h("span",{style:{fontSize:12,color:GRY}},"Loan/Advance EMI"),h("span",{style:{fontSize:12,fontWeight:600,color:RED}},"-"+fmt(payMp.loanDed))):null,
          // ── Working days ──
          h("div",{style:{fontSize:10,color:GRY,padding:"4px 0",marginBottom:10,borderTop:"1px dashed "+BDR,marginTop:4,paddingTop:6}},
            "Working days: "+(payData.wDays||26)+" \u2022 Per day: "+fmt(payData.pd||Math.round(payData.gr/(payData.wDays||26)))
          ),
          // ── Net take home ──
          h("div",{style:{background:"#0F172A",borderRadius:14,padding:"14px 16px",marginTop:4,display:"flex",justifyContent:"space-between",alignItems:"center"}},
            h("div",{style:{fontSize:13,color:"rgba(255,255,255,0.65)"}},"Net Take Home"),
            h("div",{style:{fontSize:22,fontWeight:800,color:"#4ADE80"}},fmt(payMp.netFinal))
          ),
          isPaid?h("button",{onClick:function(){showT("Generating payslip...");},style:{width:"100%",background:NVY,border:"none",borderRadius:12,padding:"11px",color:CARD,fontSize:13,fontWeight:700,cursor:"pointer",marginTop:12,display:"flex",alignItems:"center",justifyContent:"center",gap:8}},ic("download",CARD,16),"Download Payslip"):
          h("div",{style:{background:AMB+"12",borderRadius:10,padding:"10px",marginTop:10,fontSize:11,color:AMB,textAlign:"center"}},"Payslip download available for Pro employers")
        ):h("div",{style:{background:SFT,borderRadius:14,padding:"20px",textAlign:"center",color:GRY,fontSize:12,marginBottom:12}},"Salary details not available yet.\nContact your employer."),
        h("button",{onClick:function(){
          _sb.auth.signOut();
          ["hr_emps","hr_att","hr_inc","hr_revisions","hr_reminders","hr_shifts","hr_notices","hr_org","hr_last_sync","hr_guser","hr_login_time"].forEach(function(k){try{localStorage.removeItem(k);}catch(e){}});
          setGUser(null);setEmps([]);setAtt({});setScreen("login");setAuthMode("landing");
        },style:{width:"100%",background:RED+"12",border:"1.5px solid "+RED+"33",borderRadius:12,padding:"12px",color:RED,fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}},
          ic("logout",RED,16),"Sign Out"
        )
      );
    }

    var isTerminated=userRole==="terminated_employee";
    return h("div",{style:{display:"flex",flexDirection:"column",height:"100vh",background:T.BG,overflow:"hidden"}},
      isTerminated?h("div",{style:{background:RED,padding:"10px 16px",display:"flex",gap:8,alignItems:"center",flexShrink:0}},
        ic("warning","#fff",16),
        h("div",{style:{color:"#fff",fontSize:12,fontWeight:600,flex:1}},"Your employment has ended. Read-only access — 10 days only. Download your payslips before access expires."),
        h("button",{onClick:function(){setEmpDashTab("profile");},style:{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:6,padding:"4px 8px",color:"#fff",fontSize:11,cursor:"pointer"}},"View Payslip")
      ):null,
      h("div",{style:{background:CARD,padding:"12px 16px 10px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid "+BDR,flexShrink:0}},
        h("div",null,
          h("div",{style:{fontSize:11,color:GRY,fontWeight:500}},org.name||"Admin HR"),
          h("div",{style:{fontSize:17,fontWeight:800,color:NVY}},
            empDashTab==="home"?"Dashboard":empDashTab==="attendance"?"Attendance":empDashTab==="tasks"?"Tasks":empDashTab==="leave"?"Leave":"Profile"
          )
        ),
        h("button",{onClick:function(){setShowNotifs(true);},style:{position:"relative",background:"none",border:"none",cursor:"pointer",padding:4}},
          ic("notifications",unread>0?ACCENT:GRY,24),
          unread>0?h("div",{style:{position:"absolute",top:0,right:0,width:16,height:16,borderRadius:"50%",background:RED,display:"flex",alignItems:"center",justifyContent:"center"}},
            h("div",{style:{fontSize:9,fontWeight:700,color:"#fff"}},unread>9?"9+":String(unread))
          ):null
        )
      ),
      h("div",{style:{flex:1,overflowY:"auto",padding:"14px 16px",WebkitOverflowScrolling:"touch"}},
        isTerminated?
          (empDashTab==="attendance"?empAttendance():empProfile()):
        empDashTab==="home"?empHome():
        empDashTab==="attendance"?empAttendance():
        empDashTab==="tasks"?empTasks():
        empDashTab==="leave"?empLeave():
        empProfile()
      ),
      h("div",{style:{display:"flex",background:CARD,borderTop:"0.5px solid "+BDR,padding:"6px 0 2px",flexShrink:0}},
        isTerminated?null:empNav("home","Home","grid"),
        empNav("attendance","Attend","cal"),
        isTerminated?null:empNav("leave","Leave","event_available"),
        empNav("profile","Profile","user")
      ),
      renderNotifPanel(),
      renderInviteModal()
    );
  }

  function renderNotifPanel(){
    if(!showNotifs)return null;
    var myNotifs=notifs.filter(function(n){return n.to===gUser.email;});
    return h("div",{style:{position:"fixed",top:0,left:0,right:0,bottom:0,zIndex:999,background:"rgba(0,0,0,0.4)"},onClick:function(){setShowNotifs(false);}},
      h("div",{style:{position:"absolute",top:56,right:8,width:320,maxHeight:"70vh",background:CARD,borderRadius:16,border:"1px solid "+BDR,overflow:"hidden",boxShadow:"0 8px 32px rgba(0,0,0,.15)"},onClick:function(e){e.stopPropagation();}},
        h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 14px",borderBottom:"1px solid "+BDR}},
          h("div",{style:{fontSize:13,fontWeight:700,color:NVY}},"Notifications"),
          myNotifs.some(function(n){return !n.read;})?h("button",{onClick:function(){setNotifs(function(p){return p.map(function(n){return Object.assign({},n,{read:true});});});setUnreadNotifs(0);},style:{background:"none",border:"none",fontSize:11,color:TEL,cursor:"pointer",fontWeight:600}},"Mark all read"):null
        ),
        h("div",{style:{overflowY:"auto",maxHeight:"calc(70vh - 48px)"}},
          myNotifs.length===0?h("div",{style:{padding:"24px",textAlign:"center",color:GRY,fontSize:12}},"No notifications yet"):
          myNotifs.map(function(n){
            var iconMap={task_assigned:"assignment",task_completed:"task_alt",task_verified:"verified",task_rejected:"cancel",task_comment:"chat_bubble",leave_requested:"event_busy",leave_approved:"event_available",leave_rejected:"event_busy",kpi_scored:"insights"};
            var colorMap={task_assigned:"#4F46E5",task_completed:"#10B981",task_verified:"#10B981",task_rejected:"#EF4444",task_comment:"#4F46E5",leave_requested:"#F59E0B",leave_approved:"#10B981",leave_rejected:"#EF4444",kpi_scored:"#D97706"};
            return h("div",{key:n.id,style:{display:"flex",gap:10,padding:"10px 14px",borderBottom:"1px solid "+BDR,background:n.read?"transparent":ACCENT+"08",cursor:"pointer"},
              onClick:function(){setNotifs(function(p){return p.map(function(x){return x.id===n.id?Object.assign({},x,{read:true}):x;});});setUnreadNotifs(function(c){return Math.max(0,c-1);});setShowNotifs(false);if(n.refType==="task")setTab("pro");if(n.refType==="leave")setTab("pro");}},
              h("div",{style:{width:34,height:34,borderRadius:"50%",background:(colorMap[n.type]||TEL)+"18",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}},
                ic(iconMap[n.type]||"notifications",colorMap[n.type]||TEL,16)
              ),
              h("div",{style:{flex:1}},
                h("div",{style:{fontSize:12,fontWeight:600,color:NVY}},n.title),
                h("div",{style:{fontSize:11,color:GRY,marginTop:2,lineHeight:1.4}},n.message),
                h("div",{style:{fontSize:10,color:GRY,marginTop:3}},new Date(n.createdAt).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"}))
              ),
              !n.read?h("div",{style:{width:8,height:8,borderRadius:"50%",background:ACCENT,flexShrink:0,marginTop:4}}):null
            );
          })
        )
      )
    );
  }

  // ── Pro: Tasks screen ───────────────────────────────────────────────────
  function renderTasks(){
    if(!isPaid)return h("div",{style:{padding:24,textAlign:"center"}},
      h("div",{style:{fontSize:48,marginBottom:12}},"⭐"),
      h("div",{style:{fontSize:18,fontWeight:700,color:NVY,marginBottom:8}},"Admin HR Pro"),
      h("div",{style:{fontSize:13,color:GRY,marginBottom:20,lineHeight:1.6}},"Task management, KPI tracking, employee portal and more — unlock with Admin HR Pro."),
      h("div",{style:{background:SFT,borderRadius:12,padding:16,marginBottom:20,textAlign:"left"}},
        ["Assign and track tasks","Employee self-service portal","KPI & performance tracking","Leave apply & approve workflow","In-app notifications"].map(function(f){
          return h("div",{key:f,style:{display:"flex",gap:8,alignItems:"center",padding:"5px 0"}},
            ic("arrow_right",ACCENT,18),
            h("div",{style:{fontSize:12,color:NVY}},f)
          );
        })
      ),
      h("button",{onClick:function(){window.open("https://wa.me/918072293384?text="+encodeURIComponent("Hi, I want to upgrade to Admin HR Pro"),"_blank");},style:{width:"100%",background:NVY,border:"none",borderRadius:12,padding:"14px",color:CARD,fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}},
        ic("whatsapp","#25D366",18),"Contact to Upgrade"
      )
    );

    var myTasks=tasks;
    var filteredTasks=taskTab==="all"?myTasks:myTasks.filter(function(t){return t.status===taskTab;});
    var pendingLeaves=leaveReqs.filter(function(r){return r.status==="pending";});

    if(selTask){
      var t=selTask;
      var tComments=taskComments[t.id]||[];
      var assignedEmp=emps.find(function(e){return e.email===t.assignTarget||e.name===t.assignTarget;});
      return card(h("div",null,
        h("button",{onClick:function(){setSelTask(null);},style:{background:"none",border:"none",cursor:"pointer",color:TEL,fontSize:12,fontWeight:600,padding:0,marginBottom:12,display:"flex",alignItems:"center",gap:4}},ic("arrow_back",TEL,14),"Back to tasks"),
        h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}},
          h("div",{style:{fontSize:15,fontWeight:700,color:NVY,flex:1,marginRight:8}},t.title),
          h("div",{style:{fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:20,background:t.priority==="high"?"#FEE2E2":t.priority==="medium"?"#FEF3C7":"#D1FAE5",color:t.priority==="high"?"#991B1B":t.priority==="medium"?"#92400E":"#065F46"}},t.priority.toUpperCase())
        ),
        t.description?h("div",{style:{fontSize:12,color:GRY,marginBottom:10,lineHeight:1.5}},t.description):null,
        h("div",{style:{display:"flex",gap:16,marginBottom:10}},
          h("div",null,h("div",{style:{fontSize:9,color:GRY,letterSpacing:1}},"ASSIGNED TO"),h("div",{style:{fontSize:12,fontWeight:600,color:NVY,marginTop:2}},assignedEmp?assignedEmp.name:t.assignTarget)),
          h("div",null,h("div",{style:{fontSize:9,color:GRY,letterSpacing:1}},"DEADLINE"),h("div",{style:{fontSize:12,fontWeight:600,color:new Date(t.deadline)<new Date()&&t.status!=="verified"?RED:NVY,marginTop:2}},t.deadline)),
          h("div",null,h("div",{style:{fontSize:9,color:GRY,letterSpacing:1}},"STATUS"),h("div",{style:{fontSize:11,fontWeight:700,color:t.status==="verified"?"#10B981":t.status==="rejected"?RED:t.status==="completed"?TEL:AMB,marginTop:2}},t.status.charAt(0).toUpperCase()+t.status.slice(1)))
        ),
        t.completionNote?h("div",{style:{background:"#ECFDF5",borderRadius:8,padding:"8px 10px",marginBottom:8,fontSize:11,color:"#065F46"}},h("span",{style:{fontWeight:600}},"Completion note: "),t.completionNote):null,
        t.status==="completed"?h("div",{style:{display:"flex",gap:8,marginBottom:10}},
          h("button",{onClick:function(){updateTaskStatus(t.id,"verified");setSelTask(null);},style:{flex:1,background:"#10B981",border:"none",borderRadius:9,padding:"9px",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer"}},"Verify Complete"),
          h("button",{onClick:function(){askForm("Reject Task",[{key:"r",label:"Rejection reason",type:"textarea",placeholder:"Optional"}],function(vals){if(vals.r)updateTaskStatus(t.id,"rejected",vals.r);setSelTask(null);},{submitLabel:"Reject"});},style:{flex:1,background:RED,border:"none",borderRadius:9,padding:"9px",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer"}},"Reject")
        ):null,
        h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}},
          h("div",{style:{fontSize:11,fontWeight:700,color:GRY,letterSpacing:1}},"STATUS UPDATES"),
          (t.statusHistory&&t.statusHistory.length>0)?h("button",{onClick:function(){var last=t.statusHistory[t.statusHistory.length-1];shareTaskStatusWA(t,last?last.text:"");},style:{display:"flex",alignItems:"center",gap:4,background:"#25D366",border:"none",borderRadius:8,padding:"5px 9px",fontSize:10,fontWeight:700,color:"#fff",cursor:"pointer"}},ic("whatsapp",NVY==="#FFFFFF"?"#fff":"#fff",12),"Share"):null
        ),
        /* History list */
        h("div",{style:{background:SFT,borderRadius:10,padding:10,marginBottom:8,maxHeight:200,overflowY:"auto"}},
          (!t.statusHistory||t.statusHistory.length===0)?h("div",{style:{fontSize:11,color:GRY,textAlign:"center",padding:12}},"No status updates yet"):
          t.statusHistory.map(function(s){
            var isMe=s.by===gUser.email;
            return h("div",{key:s.id,style:{marginBottom:9,paddingBottom:9,borderBottom:"1px solid "+BDR}},
              h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}},
                h("div",{style:{fontSize:9,color:GRY,fontWeight:600}},(isMe?"You":s.by.split("@")[0])+" \u00b7 "+new Date(s.at).toLocaleDateString("en-IN",{day:"numeric",month:"short"})+" "+new Date(s.at).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})),
                h("button",{onClick:function(){shareTaskStatusWA(t,s.text);},style:{display:"flex",alignItems:"center",gap:3,background:"none",border:"none",cursor:"pointer",color:"#25D366",fontSize:9,fontWeight:700,padding:0}},ic("whatsapp",TEL,11),"Send")
              ),
              h("div",{style:{fontSize:12,color:NVY,lineHeight:1.45}},s.text)
            );
          })
        ),
        /* Type a new status */
        h("div",{style:{display:"flex",gap:8}},
          h("input",{type:"text",value:taskStatusInput,onChange:function(e){setTaskStatusInput(e.target.value);},onKeyDown:function(e){if(e.key==="Enter")addStatusUpdate(t.id);},placeholder:"Type status update...",style:{flex:1,background:SFT,border:"1px solid "+BDR,borderRadius:9,padding:"9px 11px",fontSize:12,color:NVY,outline:"none",fontFamily:"inherit"}}),
          h("button",{onClick:function(){addStatusUpdate(t.id);},style:{background:NVY,border:"none",borderRadius:9,padding:"9px 14px",color:CARD,fontSize:12,fontWeight:700,cursor:"pointer"}},"Update")
        )
      ),0);
    }

    return h("div",null,
      // Leave requests panel
      pendingLeaves.length>0?h("div",{style:{background:AMB+"12",border:"1.5px solid "+AMB+"44",borderRadius:12,padding:12,marginBottom:12}},
        h("div",{style:{display:"flex",alignItems:"center",gap:6,marginBottom:8}},
          ic("event_busy",AMB,15),
          h("div",{style:{fontSize:12,fontWeight:700,color:NVY}},"Leave requests ("+pendingLeaves.length+" pending)")
        ),
        pendingLeaves.map(function(r){
          var emp=emps.find(function(e){return e.email===r.employeeEmail;});
          return h("div",{key:r.id,style:{background:CARD,borderRadius:9,padding:"9px 11px",marginBottom:6,border:"1px solid "+BDR}},
            h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}},
              h("div",null,
                h("div",{style:{fontSize:12,fontWeight:600,color:NVY}},emp?emp.name:r.employeeEmail.split("@")[0]),
                h("div",{style:{fontSize:10,color:GRY,marginTop:2}},LEAVE_TYPES[r.leaveType].name+" • "+r.fromDate+" to "+r.toDate),
                r.reason?h("div",{style:{fontSize:10,color:GRY,marginTop:2}},"Reason: "+r.reason):null
              )
            ),
            h("div",{style:{display:"flex",gap:6}},
              h("button",{onClick:function(){approveLeave(r.id);},style:{flex:1,background:"#10B981",border:"none",borderRadius:7,padding:"6px",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer"}},"Approve"),
              h("button",{onClick:function(){askForm("Reject Leave Request",[{key:"reply",label:"Rejection reason",type:"textarea",placeholder:"Optional"}],function(vals){rejectLeave(r.id,vals.reply||"");},{submitLabel:"Reject"});},style:{flex:1,background:RED,border:"none",borderRadius:7,padding:"6px",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer"}},"Reject")
            )
          );
        })
      ):null,

      // Task filter tabs
      h("div",{style:{display:"flex",gap:5,marginBottom:10,overflowX:"auto"}},
        [["all","All"],["assigned","Assigned"],["in_progress","In Progress"],["completed","Done"],["verified","Verified"]].map(function(item){
          return h("button",{key:item[0],onClick:function(){setTaskTab(item[0]);},style:{flexShrink:0,background:taskTab===item[0]?ACCENT:CARD,border:"1px solid "+(taskTab===item[0]?ACCENT:BDR),borderRadius:15,padding:"4px 10px",color:taskTab===item[0]?ACCENT_FG:GRY,fontSize:11,fontWeight:600,cursor:"pointer"}},item[1]);
        })
      ),

      filteredTasks.length===0?h("div",{style:{textAlign:"center",padding:"32px 0",color:GRY,fontSize:13}},"No tasks in this category"):null,

      filteredTasks.map(function(t){
        var tCommentCount=(t.statusHistory||[]).length;
        return h("div",{key:t.id,onClick:function(){setSelTask(t);},style:{background:CARD,border:"1px solid "+(t.status==="completed"?TEL:t.status==="verified"?"#10B981":t.status==="rejected"?RED:BDR),borderRadius:12,padding:"11px 12px",marginBottom:8,cursor:"pointer"}},
          h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:5}},
            h("div",{style:{fontSize:12,fontWeight:600,color:NVY,flex:1,marginRight:8}},t.title),
            h("div",{style:{fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:20,background:t.priority==="high"?"#FEE2E2":t.priority==="medium"?"#FEF3C7":"#D1FAE5",color:t.priority==="high"?"#991B1B":t.priority==="medium"?"#92400E":"#065F46",flexShrink:0}},t.priority.toUpperCase())
          ),
          h("div",{style:{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}},
            h("div",{style:{fontSize:10,fontWeight:600,padding:"2px 8px",borderRadius:20,background:t.status==="verified"?"#D1FAE5":t.status==="completed"?"#EFF6FF":t.status==="rejected"?"#FEE2E2":"#FEF3C7",color:t.status==="verified"?"#065F46":t.status==="completed"?"#1E40AF":t.status==="rejected"?"#991B1B":"#92400E"}},t.status.replace("_"," ")),
            h("div",{style:{fontSize:10,color:GRY,display:"flex",alignItems:"center",gap:3}},ic("calendar_today",GRY,10),t.deadline),
            tCommentCount>0?h("div",{style:{fontSize:10,color:GRY,display:"flex",alignItems:"center",gap:3}},ic("chat_bubble",GRY,10),tCommentCount+" updates"):null
          ),
          h("div",{style:{fontSize:10,color:GRY,marginTop:4}},
            t.assignType==="individual"?("Assigned to: "+(emps.find(function(e){return e.email===t.assignTarget;})||{name:t.assignTarget}).name):
            (t.assignType==="department"?"Dept: "+t.assignTarget:"Role: "+t.assignTarget)
          )
        );
      }),

      showNewTask?card(h("div",null,
        h("div",{style:{fontSize:13,fontWeight:700,color:NVY,marginBottom:12}},"New Task"),
        lbl("ASSIGN TO"),
        chipSelect(taskAssignType,function(v){setTaskAssignType(v);setTaskAssignTarget("");},["individual","department","role"].map(function(v){return {v:v,l:v.charAt(0).toUpperCase()+v.slice(1)};}),{question:"Assign this task to"}),
        taskAssignType==="individual"?h("select",{value:taskAssignTarget,onChange:function(e){setTaskAssignTarget(e.target.value);},style:{width:"100%",marginBottom:8,background:SFT,border:"1px solid "+BDR,borderRadius:9,padding:"9px 11px",fontSize:12,color:NVY,outline:"none",fontFamily:"inherit"}},
          [h("option",{key:"",value:""},"Select employee")].concat(emps.filter(function(e){return e.status==="active";}).map(function(e){return h("option",{key:e.id,value:e.email||e.name},e.name);}))
        ):taskAssignType==="department"?h("select",{value:taskAssignTarget,onChange:function(e){setTaskAssignTarget(e.target.value);},style:{width:"100%",marginBottom:8,background:SFT,border:"1px solid "+BDR,borderRadius:9,padding:"9px 11px",fontSize:12,color:NVY,outline:"none",fontFamily:"inherit"}},
          [h("option",{key:"",value:""},"Select department")].concat([...new Set(emps.map(function(e){return e.dept;}).filter(Boolean))].map(function(d){return h("option",{key:d,value:d},d);}))
        ):h("select",{value:taskAssignTarget,onChange:function(e){setTaskAssignTarget(e.target.value);},style:{width:"100%",marginBottom:8,background:SFT,border:"1px solid "+BDR,borderRadius:9,padding:"9px 11px",fontSize:12,color:NVY,outline:"none",fontFamily:"inherit"}},
          [h("option",{key:"",value:""},"Select role")].concat([...new Set(emps.map(function(e){return e.role;}).filter(Boolean))].map(function(r){return h("option",{key:r,value:r},r);}))
        ),
        lbl("TASK TITLE"),
        h("input",{type:"text",value:taskTitle,onChange:function(e){setTaskTitle(e.target.value);},placeholder:"Task title",style:{width:"100%",marginBottom:8,background:SFT,border:"1px solid "+BDR,borderRadius:9,padding:"9px 11px",fontSize:12,color:NVY,outline:"none",fontFamily:"inherit"}}),
        lbl("DESCRIPTION (OPTIONAL)"),
        h("textarea",{value:taskDesc,onChange:function(e){setTaskDesc(e.target.value);},placeholder:"Task details...",style:{width:"100%",height:60,marginBottom:8,background:SFT,border:"1px solid "+BDR,borderRadius:9,padding:"9px 11px",fontSize:12,color:NVY,outline:"none",fontFamily:"inherit",resize:"none"}}),
        h("div",{style:{display:"flex",gap:8,marginBottom:12}},
          h("div",{style:{flex:1}},lbl("PRIORITY"),chipSelect(taskPriority,function(v){setTaskPriority(v);},["high","medium","low"].map(function(v){return {v:v,l:v.charAt(0).toUpperCase()+v.slice(1)};}),{question:"Choose the priority"})),
          h("div",{style:{flex:1}},lbl("DEADLINE"),datePick(taskDeadline,function(v){setTaskDeadline(v);},{question:"Task deadline"}))
        ),
        h("div",{style:{display:"flex",gap:8}},
          h("button",{onClick:saveTask,style:{flex:2,background:ACCENT,border:"none",borderRadius:9,padding:"10px",color:ACCENT_FG,fontSize:12,fontWeight:700,cursor:"pointer"}},"Assign Task"),
          h("button",{onClick:function(){setShowNewTask(false);},style:{flex:1,background:SFT,border:"1px solid "+BDR,borderRadius:9,padding:"10px",color:NVY,fontSize:12,cursor:"pointer"}},"Cancel")
        )
      ),0):
      h("button",{onClick:function(){setShowNewTask(true);},style:{width:"100%",background:ACCENT,border:"none",borderRadius:12,padding:"13px",color:ACCENT_FG,fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}},
        ic("add_task",ACCENT_FG,18),"Assign New Task"
      )
    );
  }

  // ── Pro: KPI screen ─────────────────────────────────────────────────────
  function renderKpiCard(k){
    var status=computeKpiStatus(k);
    var meta=KPI_STATUS_META[status];
    var target=Number(k.targetValue||k.target||0);
    var prog=Number(k.currentProgress||0);
    var pct=target>0?Math.min(100,Math.round(prog*100/target)):0;
    var expanded=kpiExpandId===k.id;
    var updating=kpiUpdateOpenId===k.id;
    var history=getKpiHistory(k.id);
    return h("div",{key:k.id,style:{background:CARD,border:"1px solid "+BDR,borderRadius:12,padding:"11px 12px",marginBottom:8}},
      h("div",{onClick:function(){setKpiExpandId(expanded?null:k.id);},style:{cursor:"pointer"}},
        h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}},
          h("div",{style:{flex:1,minWidth:0}},
            h("div",{style:{fontSize:12.5,fontWeight:700,color:NVY}},k.title||k.name),
            h("div",{style:{fontSize:10,color:GRY,marginTop:1}},k.assignType==="individual"?"Individual":k.assignType==="department"?"Dept: "+k.assignTarget:"Role: "+k.assignTarget)
          ),
          h("div",{style:{display:"flex",alignItems:"center",gap:6,flexShrink:0}},
            h("div",{style:{fontSize:9,fontWeight:700,padding:"3px 9px",borderRadius:20,background:meta.bg,color:meta.color}},meta.label),
            ic(expanded?"expand_less":"expand_more",GRY,16)
          )
        ),
        h("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:3}},
          h("div",{style:{fontSize:10.5,color:GRY}},prog+" / "+target+" "+k.unit),
          h("div",{style:{fontSize:10.5,fontWeight:700,color:meta.color}},pct+"%")
        ),
        h("div",{style:{height:6,background:SFT,borderRadius:3,overflow:"hidden"}},
          h("div",{style:{height:"100%",background:meta.color,borderRadius:3,width:pct+"%",transition:"width .3s"}})
        )
      ),
      expanded?h("div",{style:{borderTop:"1px solid "+BDR,marginTop:10,paddingTop:10}},
        h("div",{style:{display:"flex",gap:14,marginBottom:8,flexWrap:"wrap"}},
          h("div",null,h("div",{style:{fontSize:9,color:GRY,fontWeight:700,letterSpacing:.3}},"START DATE"),h("div",{style:{fontSize:11,color:NVY,fontWeight:600,marginTop:2}},k.startDate||"-")),
          h("div",null,h("div",{style:{fontSize:9,color:GRY,fontWeight:700,letterSpacing:.3}},"DUE DATE"),h("div",{style:{fontSize:11,color:NVY,fontWeight:600,marginTop:2}},k.dueDate||"-")),
          h("div",null,h("div",{style:{fontSize:9,color:GRY,fontWeight:700,letterSpacing:.3}},"UNIT"),h("div",{style:{fontSize:11,color:NVY,fontWeight:600,marginTop:2}},k.unit))
        ),
        k.followUpRemarks?h("div",{style:{background:SFT,borderRadius:8,padding:"8px 10px",marginBottom:8,fontSize:11,color:GRY}},h("b",{style:{color:NVY}},"Latest remark: "),k.followUpRemarks):null,
        // ── Update progress ──
        updating?h("div",{style:{background:TEL+"0D",border:"1px solid "+TEL+"35",borderRadius:9,padding:10,marginBottom:10}},
          h("div",{style:{fontSize:10,fontWeight:700,color:TEL,marginBottom:6,letterSpacing:.3}},"LOG PROGRESS UPDATE"),
          h("input",{type:"number",value:kpiProgressInput,onChange:function(ev){setKpiProgressInput(ev.target.value);},placeholder:"Current progress ("+k.unit+")",autoFocus:true,style:{width:"100%",background:CARD,border:"1px solid "+BDR,borderRadius:7,padding:"8px 9px",fontSize:12,color:NVY,outline:"none",fontFamily:"inherit",marginBottom:6,boxSizing:"border-box"}}),
          h("input",{type:"text",value:kpiRemarkInput,onChange:function(ev){setKpiRemarkInput(ev.target.value);},placeholder:"Follow-up remark (optional)",style:{width:"100%",background:CARD,border:"1px solid "+BDR,borderRadius:7,padding:"8px 9px",fontSize:12,color:NVY,outline:"none",fontFamily:"inherit",marginBottom:6,boxSizing:"border-box"}}),
          h("div",{style:{display:"flex",gap:6}},
            h("button",{onClick:function(){
              if(kpiProgressInput===""||isNaN(Number(kpiProgressInput)))return showT("Enter a progress value","err");
              addKpiUpdate(k,kpiProgressInput,kpiRemarkInput);
              setKpiUpdateOpenId(null);setKpiProgressInput("");setKpiRemarkInput("");
            },style:{flex:2,background:NVY,border:"none",borderRadius:7,padding:"8px",fontSize:11,fontWeight:700,color:CARD,cursor:"pointer"}},"Save Update"),
            h("button",{onClick:function(){setKpiUpdateOpenId(null);},style:{flex:1,background:SFT,border:"1px solid "+BDR,borderRadius:7,padding:"8px",fontSize:11,color:GRY,cursor:"pointer"}},"Cancel")
          )
        ):h("button",{onClick:function(){setKpiUpdateOpenId(k.id);setKpiProgressInput(String(prog));setKpiRemarkInput("");},style:{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:5,background:TEL+"12",border:"1px solid "+TEL+"33",borderRadius:8,padding:"7px",fontSize:11,fontWeight:700,color:TEL,cursor:"pointer",marginBottom:8}},ic("edit",TEL,12),"Update Progress"),
        // ── Review/update history ──
        history.length>0?h("div",{style:{marginBottom:8}},
          h("div",{style:{fontSize:9,fontWeight:700,color:GRY,letterSpacing:.3,marginBottom:5}},"UPDATE HISTORY"),
          history.map(function(u){
            return h("div",{key:u.id,style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"5px 0",borderBottom:"1px solid "+BDR+"44"}},
              h("div",{style:{flex:1}},
                h("div",{style:{fontSize:10.5,fontWeight:600,color:NVY}},u.progress+" "+k.unit+(u.remark?" - "+u.remark:"")),
                h("div",{style:{fontSize:9,color:GRY,marginTop:1}},new Date(u.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})+" "+new Date(u.createdAt).toLocaleTimeString("en-IN",{hour:"numeric",minute:"2-digit"}))
              )
            );
          })
        ):h("div",{style:{fontSize:10.5,color:GRY,marginBottom:8}},"No updates logged yet."),
        h("button",{onClick:function(){if(window.confirm("Delete this KPI permanently?"))deleteKpi(k.id);},style:{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:5,background:T.PILL_DANGER_BG,border:"1px solid "+RED,borderRadius:8,padding:"7px",color:RED,fontSize:11,fontWeight:700,cursor:"pointer"}},ic(ICONS.del,RED,12),"Delete KPI")
      ):null
    );
  }
  function renderKPI(){
    if(!isPaid)return null;
    var actEmpsKpi=emps.filter(function(e){return e.status==="active";});
    return h("div",null,
      h("div",{style:{fontSize:13,fontWeight:700,color:NVY,marginBottom:12}},"KPI & Performance — "+MOS[curM]+" "+curY),
      actEmpsKpi.map(function(e){
        var empKpis=getEmpKpis(e.email||e.name,e.dept,e.role);
        return h("div",{key:e.id,style:{marginBottom:10}},
          h("div",{style:{display:"flex",alignItems:"center",gap:10,marginBottom:8}},
            av(e,32),
            h("div",{style:{flex:1}},
              h("div",{style:{fontSize:12,fontWeight:600,color:NVY}},e.name),
              h("div",{style:{fontSize:10,color:GRY}},e.role||e.dept||"")
            ),
            h("button",{onClick:function(){setKpiAssignType("individual");setKpiAssignTarget(e.email||e.name);setShowKpiForm(true);},style:{background:"none",border:"none",color:TEL,fontSize:11,fontWeight:600,cursor:"pointer",padding:0}},"+ Add KPI")
          ),
          empKpis.length>0?empKpis.map(function(k){return renderKpiCard(k);}):h("div",{style:{fontSize:10.5,color:GRY,paddingLeft:42,marginBottom:4}},"No KPIs set")
        );
      }),
      showKpiForm?card(h("div",null,
        h("div",{style:{fontSize:13,fontWeight:700,color:NVY,marginBottom:12}},"New KPI"),
        lbl("ASSIGN TO"),
        chipSelect(kpiAssignType,function(v){setKpiAssignType(v);setKpiAssignTarget("");},["individual","department","role"].map(function(v){return {v:v,l:v.charAt(0).toUpperCase()+v.slice(1)};}),{question:"Assign this KPI to"}),
        kpiAssignType==="individual"?chipSelect(kpiAssignTarget,function(v){setKpiAssignTarget(v);},emps.filter(function(e){return e.status==="active";}).map(function(e){return {v:e.email||e.name,l:e.name};}),{question:"Choose the employee",placeholder:"Select employee"}):null,
        kpiAssignType==="department"?chipSelect(kpiAssignTarget,function(v){setKpiAssignTarget(v);},getDepts(org.type),{question:"Choose the department",placeholder:"Select department"}):null,
        kpiAssignType==="role"?h("input",{type:"text",value:kpiAssignTarget,onChange:function(e){setKpiAssignTarget(e.target.value);},placeholder:"e.g. Sales Executive",style:{width:"100%",marginBottom:10,background:SFT,border:"1px solid "+BDR,borderRadius:9,padding:"9px 11px",fontSize:12,color:NVY,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}):null,
        lbl("KPI TITLE"),
        h("input",{type:"text",value:kpiName,onChange:function(e){setKpiName(e.target.value);},placeholder:"e.g. Monthly Sales Target",style:{width:"100%",marginBottom:8,background:SFT,border:"1px solid "+BDR,borderRadius:9,padding:"9px 11px",fontSize:12,color:NVY,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}),
        h("div",{style:{display:"flex",gap:8,marginBottom:8}},
          h("div",{style:{flex:1}},lbl("TARGET VALUE"),h("input",{type:"number",value:kpiTarget,onChange:function(e){setKpiTarget(e.target.value);},placeholder:"100",style:{width:"100%",background:SFT,border:"1px solid "+BDR,borderRadius:9,padding:"9px 11px",fontSize:12,color:NVY,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}})),
          h("div",{style:{flex:1}},lbl("UNIT"),chipSelect(kpiUnit,function(v){setKpiUnit(v);},["Tasks","Sales","Calls","Attendance %","%","Number","Rs."],{question:"Choose the KPI unit",allowCustom:true,customPlaceholder:"Type your own unit..."}))
        ),
        h("div",{style:{display:"flex",gap:8,marginBottom:12}},
          h("div",{style:{flex:1}},lbl("START DATE"),datePick(kpiStartDate,function(v){setKpiStartDate(v);},{question:"KPI start date"})),
          h("div",{style:{flex:1}},lbl("DUE DATE"),datePick(kpiDueDate,function(v){setKpiDueDate(v);},{question:"KPI due date"}))
        ),
        h("div",{style:{display:"flex",gap:8}},
          h("button",{onClick:saveKpi,style:{flex:2,background:ACCENT,border:"none",borderRadius:9,padding:"10px",color:ACCENT_FG,fontSize:12,fontWeight:700,cursor:"pointer"}},"Save KPI"),
          h("button",{onClick:function(){setShowKpiForm(false);},style:{flex:1,background:SFT,border:"1px solid "+BDR,borderRadius:9,padding:"10px",color:NVY,fontSize:12,cursor:"pointer"}},"Cancel")
        )
      ),0):null
    );
  }

  // ── Pro: Invite employee ────────────────────────────────────────────────
  function renderInviteModal(){
    if(!showInvite)return null;
    var invEmp=inviteEmpId?emps.find(function(e){return e.id===inviteEmpId;}):null;
    return h("div",{style:{position:"fixed",top:0,left:0,right:0,bottom:0,zIndex:998,background:"rgba(0,0,0,0.4)",display:"flex",alignItems:"center",justifyContent:"center",padding:16},onClick:function(){setShowInvite(false);}},
      h("div",{style:{background:CARD,borderRadius:16,padding:20,width:"100%",maxWidth:360,border:"1px solid "+BDR},onClick:function(e){e.stopPropagation();}},
        h("div",{style:{display:"flex",alignItems:"center",gap:10,marginBottom:14}},
          h("div",{style:{width:40,height:40,borderRadius:12,background:ACCENT+"15",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}},
            ic("forward_to_inbox",ACCENT,20)
          ),
          h("div",null,
            h("div",{style:{fontSize:14,fontWeight:700,color:NVY}},invEmp?"Invite "+invEmp.name:"Invite Employee"),
            h("div",{style:{fontSize:11,color:GRY,marginTop:1}},invEmp?invEmp.role||"":"Share invite code to let them join")
          )
        ),
        !showInviteCode?h("div",null,
          lbl("EMPLOYEE EMAIL"),
          h("input",{type:"email",value:inviteEmail,onChange:function(e){setInviteEmail(e.target.value);},placeholder:"employee@company.com",style:{width:"100%",marginBottom:4,background:SFT,border:"1px solid "+BDR,borderRadius:9,padding:"10px 12px",fontSize:12,color:NVY,outline:"none",fontFamily:"inherit"}}),
          h("div",{style:{fontSize:10,color:GRY,marginBottom:12}},"The employee must use this exact email to join."),
          h("button",{onClick:generateInviteCode,style:{width:"100%",background:ACCENT,border:"none",borderRadius:10,padding:"12px",color:ACCENT_FG,fontSize:13,fontWeight:700,cursor:"pointer"}},"Generate Invite Code")
        ):h("div",{style:{textAlign:"center"}},
          h("div",{style:{fontSize:12,color:GRY,marginBottom:6}},"Share this code with "+(invEmp?invEmp.name:inviteEmail)),
          h("div",{style:{fontSize:42,fontWeight:800,letterSpacing:10,color:ACCENT,fontFamily:"monospace",margin:"12px 0"}},inviteCode),
          h("div",{style:{background:AMB+"12",border:"1px solid "+AMB+"33",borderRadius:8,padding:"8px 12px",marginBottom:12,fontSize:11,color:AMB,textAlign:"left"}},
            "\u26a0 Expires in 48 hours \u2022 One-time use only\nEmployee must use email: "+inviteEmail
          ),
          h("button",{onClick:function(){try{navigator.clipboard.writeText(inviteCode);}catch(e){}showT("Code copied!");},style:{width:"100%",background:ACCENT,border:"none",borderRadius:10,padding:"11px",color:ACCENT_FG,fontSize:13,fontWeight:700,cursor:"pointer",marginBottom:8}},"Copy Code"),
          h("button",{onClick:function(){setShowInviteCode(false);setInviteCode("");},style:{width:"100%",background:"none",border:"1px solid "+BDR,borderRadius:10,padding:"10px",color:GRY,fontSize:12,cursor:"pointer"}},"Generate New Code")
        ),
        h("button",{onClick:function(){setShowInvite(false);setInviteEmail("");setShowInviteCode(false);setInviteCode("");setInviteEmpId(null);},style:{width:"100%",background:"none",border:"none",color:GRY,fontSize:12,cursor:"pointer",marginTop:10}},"Close")
      )
    );
  }

  // ── Pro: Main Pro screen ────────────────────────────────────────────────
  function renderCompanyExpenses(){
    var cats={rent:"Rent",utilities:"Utilities",internet:"Internet/Phone",vendor:"Vendor/Supplier",equipment:"Equipment",travel:"Travel",stationery:"Stationery",software:"Software",misc:"Miscellaneous",custom:"Other (Custom)"};
    var modes={cash:"Cash",bank:"Bank Transfer",upi:"UPI",cheque:"Cheque"};
    var MOS2=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    var now2=new Date();

    // Filter expenses by selected period
    var filtered=(coExp||[]).filter(function(e){
      if(coExpView==="year")return e.year===coExpY;
      return e.month===coExpM&&e.year===coExpY;
    });
    var total=filtered.reduce(function(s,e){return s+(e.amount||0);},0);

    // Category breakdown
    var catTotals={};
    filtered.forEach(function(e){
      var k=e.category==="custom"?(e.customCategory||"Other"):cats[e.category]||e.category;
      catTotals[k]=(catTotals[k]||0)+(e.amount||0);
    });
    var catList=Object.entries(catTotals).sort(function(a,b){return b[1]-a[1];});

    // Salary summary from payroll
    var salaryTotal=actEmps.reduce(function(s,e){return s+getMonthPay(e,coExpY,coExpM).d.gr;},0);
    var netTotal=actEmps.reduce(function(s,e){return s+getMonthPay(e,coExpY,coExpM).netFinal;},0);
    var pfTotal=actEmps.reduce(function(s,e){var d=getMonthPay(e,coExpY,coExpM).d;return s+d.pfE+d.pfR;},0);

    function saveCoExp(){
      if(!coExpAmt||!coExpDate)return showT("Enter amount and date","err");
      var cat=coExpCat==="custom"?coExpCustomCat||"Other":coExpCat;
      var d=new Date(coExpDate+"T00:00:00");
      var ex={id:Date.now(),date:coExpDate,category:coExpCat,customCategory:coExpCustomCat,amount:Number(coExpAmt),vendor:coExpVendor,description:coExpDesc,paymentMode:coExpMode,month:d.getMonth(),year:d.getFullYear()};
      setCoExp(function(p){return [ex].concat(p||[]);});
      _sb.from("company_expenses").insert({id:String(ex.id),employer_email:gUser.email,date:coExpDate,category:coExpCat,custom_category:coExpCustomCat,amount:ex.amount,vendor:coExpVendor,description:coExpDesc,payment_mode:coExpMode,month:ex.month,year:ex.year}).then(function(){});
      setCoExpAmt("");setCoExpDate("");setCoExpVendor("");setCoExpDesc("");setShowCoExpForm(false);
      showT("Expense recorded");
    }
    function deleteCoExp(id){
      if(!window.confirm("Delete this expense?"))return;
      setCoExp(function(p){return (p||[]).filter(function(e){return e.id!==id;});});
      _sb.from("company_expenses").delete().eq("id",String(id)).then(function(){});
      showT("Deleted");
    }
    function downloadExpenseSummary(){
      var periodLabel=coExpView==="year"?String(coExpY):MOS2[coExpM]+" "+coExpY;
      var filteredClaims=(claims||[]).filter(function(c){
        if(coExpView==="year")return c.year===coExpY;
        return c.month===coExpM&&c.year===coExpY;
      });
      var claimsTotal=filteredClaims.reduce(function(s,c){return s+(c.amount||0);},0);
      makeExpenseSummaryPDF({
        periodLabel:periodLabel,
        expenses:filtered,
        catLabels:cats,
        modeLabels:modes,
        expTotal:total,
        catList:catList,
        salaryGross:salaryTotal,
        salaryNet:netTotal,
        salaryPF:pfTotal,
        staffCount:actEmps.length,
        claims:filteredClaims,
        claimsTotal:claimsTotal,
        claimCatLabels:{travel:"Travel",food:"Food",medical:"Medical",accommodation:"Stay",stationery:"Stationery",other:"Other"},
        mosLabels:MOS2
      },org,authPos,authSign);
    }

    return h("div",{className:"fd"},
      /* Section A: Company Expenses */
      h("div",{style:{marginBottom:16}},
        /* Header */
        h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}},
          h("div",null,
            h("div",{style:{fontSize:13,fontWeight:800,color:NVY}},"Company Expenses"),
            h("div",{style:{fontSize:10,color:GRY,marginTop:1}},"Operational & business costs")
          ),
          h("div",{style:{display:"flex",gap:6}},
            h("button",{onClick:downloadExpenseSummary,style:{display:"flex",alignItems:"center",gap:5,background:SFT,border:"1px solid "+BDR,borderRadius:9,padding:"6px 11px",fontSize:11,fontWeight:700,color:NVY,cursor:"pointer"}},ic("download",NVY,13),"PDF"),
            h("button",{onClick:function(){setShowCoExpForm(!showCoExpForm);},style:{background:showCoExpForm?SFT:ACCENT,border:showCoExpForm?"1.5px solid "+BDR:"none",borderRadius:9,padding:"6px 12px",fontSize:11,fontWeight:700,color:showCoExpForm?NVY:ACCENT_FG,cursor:"pointer"}},showCoExpForm?"Cancel":"+ Add")
          )
        ),
        /* Period selector */
        h("div",{style:{display:"flex",gap:6,marginBottom:10,alignItems:"center"}},
          h("div",{style:{display:"flex",background:SFT,borderRadius:8,padding:2,gap:2}},
            h("button",{onClick:function(){setCoExpView("month");},style:{background:coExpView==="month"?CARD:"transparent",border:coExpView==="month"?"1px solid "+BDR:"none",borderRadius:7,padding:"5px 10px",fontSize:10,fontWeight:coExpView==="month"?700:500,color:coExpView==="month"?NVY:GRY,cursor:"pointer"}},"Month"),
            h("button",{onClick:function(){setCoExpView("year");},style:{background:coExpView==="year"?CARD:"transparent",border:coExpView==="year"?"1px solid "+BDR:"none",borderRadius:7,padding:"5px 10px",fontSize:10,fontWeight:coExpView==="year"?700:500,color:coExpView==="year"?NVY:GRY,cursor:"pointer"}},"Year")
          ),
          coExpView==="month"?chipSelect(coExpM,function(v){setCoExpM(Number(v));},MOS2.map(function(m,i){return {v:i,l:m};}),{question:"Choose the month",btnLabel:"Okay",triggerStyle:{width:"auto",flex:"0 0 auto",padding:"5px 8px",fontSize:10},wrapStyle:{marginBottom:0}}):null,
          chipSelect(coExpY,function(v){setCoExpY(Number(v));},[now2.getFullYear(),now2.getFullYear()-1,now2.getFullYear()-2],{question:"Choose the year",btnLabel:"Okay",triggerStyle:{width:"auto",flex:"0 0 auto",padding:"5px 8px",fontSize:10},wrapStyle:{marginBottom:0}})
        ),
        /* Total tile */
        h("div",{style:{background:"#242323",borderRadius:12,padding:"12px 14px",marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center",boxShadow:"0 4px 18px rgba(0,0,0,.35)",border:"1px solid rgba(255,255,255,.06)"}},
          h("div",null,
            h("div",{style:{fontSize:10,color:"rgba(255,255,255,.5)",letterSpacing:.5,marginBottom:3}},"TOTAL "+( coExpView==="year"?String(coExpY):MOS2[coExpM]+" "+coExpY).toUpperCase()),
            h("div",{style:{fontSize:24,fontWeight:900,color:"#fff",letterSpacing:-.5}},fmt(total)),
            h("div",{style:{fontSize:10,color:"rgba(255,255,255,.5)",marginTop:2}},filtered.length+" transactions")
          ),
          catList.length>0?h("div",{style:{textAlign:"right"}},
            catList.slice(0,3).map(function(c,i){
              return h("div",{key:i,style:{fontSize:10,color:"rgba(255,255,255,.65)",marginBottom:2}},c[0]+": "+fmt(c[1]));
            })
          ):null
        ),
        /* Add form */
        showCoExpForm?h("div",{style:{background:SFT,borderRadius:14,padding:12,border:"1px solid "+BDR,marginBottom:10}},
          h("div",{style:{display:"flex",gap:8,marginBottom:8}},
            h("div",{style:{flex:1}},
              lbl("DATE"),
              datePick(coExpDate,function(v){setCoExpDate(v);},{question:"Expiry date",wrapStyle:{marginBottom:0}})
            ),
            h("div",{style:{flex:1}},
              lbl("AMOUNT (RS.)"),
              h("input",{type:"number",value:coExpAmt,onChange:function(e){setCoExpAmt(e.target.value);},placeholder:"0",style:{width:"100%",background:CARD,border:"1px solid "+BDR,borderRadius:8,padding:"8px 10px",fontSize:11,color:NVY,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}})
            )
          ),
          h("div",{style:{display:"flex",gap:8,marginBottom:8}},
            h("div",{style:{flex:1}},
              lbl("CATEGORY"),
              chipSelect(coExpCat,function(v){setCoExpCat(v);},Object.entries(cats).map(function(c){return {v:c[0],l:c[1]};}),{question:"Choose the expense category"})
            ),
            h("div",{style:{flex:1}},
              lbl("PAYMENT MODE"),
              chipSelect(coExpMode,function(v){setCoExpMode(v);},Object.entries(modes).map(function(m){return {v:m[0],l:m[1]};}),{question:"Choose the payment mode"})
            )
          ),
          coExpCat==="custom"?h("div",{style:{marginBottom:8}},
            lbl("CUSTOM CATEGORY"),
            h("input",{type:"text",value:coExpCustomCat,onChange:function(e){setCoExpCustomCat(e.target.value);},placeholder:"e.g. Maintenance",style:{width:"100%",background:CARD,border:"1px solid "+BDR,borderRadius:8,padding:"8px 10px",fontSize:11,color:NVY,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}})
          ):null,
          lbl("VENDOR / PAYEE (OPTIONAL)"),
          h("input",{type:"text",value:coExpVendor,onChange:function(e){setCoExpVendor(e.target.value);},placeholder:"e.g. Reliance JIO, ABC Landlord",style:{width:"100%",background:CARD,border:"1px solid "+BDR,borderRadius:8,padding:"8px 10px",fontSize:11,color:NVY,outline:"none",fontFamily:"inherit",marginBottom:8,boxSizing:"border-box"}}),
          lbl("DESCRIPTION (OPTIONAL)"),
          h("input",{type:"text",value:coExpDesc,onChange:function(e){setCoExpDesc(e.target.value);},placeholder:"Brief note",style:{width:"100%",background:CARD,border:"1px solid "+BDR,borderRadius:8,padding:"8px 10px",fontSize:11,color:NVY,outline:"none",fontFamily:"inherit",marginBottom:10,boxSizing:"border-box"}}),
          h("button",{onClick:saveCoExp,style:{width:"100%",background:NVY,border:"none",borderRadius:9,padding:"10px",fontSize:12,fontWeight:700,color:CARD,cursor:"pointer"}},"Save Expense")
        ):null,
        /* Expense list */
        filtered.length===0?h("div",{style:{textAlign:"center",padding:"20px 0",color:GRY}},
          ic("account_balance_wallet",GRY,28),
          h("div",{style:{fontSize:12,fontWeight:600,color:NVY,marginTop:8}},"No expenses recorded"),
          h("div",{style:{fontSize:10,color:GRY,marginTop:3}},"Tap + Add to record a business expense")
        ):filtered.sort(function(a,b){return (b.date||"").localeCompare(a.date||"");}).map(function(ex){
          var catLabel=ex.category==="custom"?(ex.customCategory||"Other"):cats[ex.category]||ex.category;
          var d=new Date((ex.date||"")+"T00:00:00");
          return h("div",{key:ex.id,style:{background:CARD,borderRadius:11,padding:"10px 12px",marginBottom:6,border:"1px solid "+BDR}},
            h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}},
              h("div",{style:{flex:1,minWidth:0}},
                h("div",{style:{display:"flex",alignItems:"center",gap:6,marginBottom:2}},
                  h("div",{style:{fontSize:11,fontWeight:700,color:NVY}},catLabel),
                  h("div",{style:{fontSize:9,fontWeight:600,background:ACCENT+"12",color:ACCENT,borderRadius:10,padding:"1px 6px"}},modes[ex.paymentMode]||ex.paymentMode)
                ),
                h("div",{style:{fontSize:10,color:GRY}},
                  (ex.vendor?ex.vendor+" • ":"")+
                  (ex.date?d.toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}):"")
                ),
                ex.description?h("div",{style:{fontSize:9,color:GRY,fontStyle:"italic",marginTop:2}},ex.description):null
              ),
              h("div",{style:{display:"flex",alignItems:"center",gap:6,flexShrink:0}},
                h("div",{style:{fontSize:13,fontWeight:800,color:NVY}},fmt(ex.amount||0)),
                h("button",{onClick:function(){deleteCoExp(ex.id);},style:{background:RED+"10",border:"1px solid "+RED+"22",borderRadius:6,width:24,height:24,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}},ic("delete",RED,11))
              )
            )
          );
        })
      ),

      /* Divider */
      h("div",{style:{height:1,background:BDR,marginBottom:16}}),

      /* Section B: Salary Summary */
      h("div",null,
        h("div",{style:{fontSize:13,fontWeight:800,color:NVY,marginBottom:4}},"Salary Summary"),
        h("div",{style:{fontSize:10,color:GRY,marginBottom:10}},"Payroll outflow for "+MOS2[coExpM]+" "+coExpY+" • "+actEmps.length+" employees"),
        h("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}},
          [{l:"Total Gross",v:fmt(salaryTotal),c:"#2563EB",bg:"#EFF6FF"},
           {l:"Total Net Pay",v:fmt(netTotal),c:"#059669",bg:"#F0FDF4"},
           {l:"PF (Emp+Er)",v:fmt(pfTotal),c:"#7C3AED",bg:"#F5F3FF"},
           {l:"Total Staff",v:actEmps.length+" emp",c:"#D97706",bg:"#FFFBEB"},
          ].map(function(s,i){
            return h("div",{key:i,style:{background:CARD,borderRadius:11,padding:"10px 12px",border:"1px solid "+BDR}},
              h("div",{style:{fontSize:9,color:GRY,fontWeight:600,letterSpacing:.5,marginBottom:4}},s.l.toUpperCase()),
              h("div",{style:{fontSize:16,fontWeight:900,color:s.c}},s.v)
            );
          })
        ),
        h("div",{style:{background:SFT,borderRadius:10,padding:"8px 12px",border:"1px solid "+BDR,fontSize:10,color:GRY}},"Salary data pulled from payroll for "+MOS2[coExpM]+" "+coExpY+". Change month using selector above.")
      ),

      /* ── Staff Claims ── */
      h("div",{style:{marginTop:8}},
        h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10,paddingTop:14,borderTop:"1px solid "+BDR}},
          h("div",null,
            h("div",{style:{fontSize:13,fontWeight:800,color:NVY}},"Staff Claims"),
            h("div",{style:{fontSize:10,color:GRY,marginTop:1}},"Auto-added to payroll as reimbursement")
          ),
          h("button",{onClick:function(){setShowClaimForm(!showClaimForm);},style:{background:showClaimForm?SFT:NVY,border:showClaimForm?"1px solid "+BDR:"none",borderRadius:9,padding:"6px 12px",fontSize:11,fontWeight:700,color:showClaimForm?GRY:CARD,cursor:"pointer"}},showClaimForm?"Cancel":"+ Add")
        ),
        showClaimForm?h("div",{style:{background:SFT,borderRadius:12,border:"1px solid "+BDR,padding:12,marginBottom:12}},
          h("div",{style:{display:"flex",gap:8,marginBottom:8}},
            h("div",{style:{flex:1}},lbl("EMPLOYEE"),chipSelect(claimEmp,function(v){setClaimEmp(v);},actEmps.map(function(e){return {v:String(e.id),l:e.name+(e.eid?" ("+e.eid+")":"")};}),{question:"Choose the employee",btnLabel:"Okay",placeholder:"Select employee"})),
            h("div",{style:{flex:1}},lbl("CATEGORY"),chipSelect(claimCat,function(v){setClaimCat(v);},[["travel","Travel"],["food","Food & Meals"],["medical","Medical"],["accommodation","Accommodation"],["stationery","Stationery"],["other","Other"]].map(function(c){return {v:c[0],l:c[1]};}),{question:"Choose the claim category"}))
          ),
          h("div",{style:{display:"flex",gap:8,marginBottom:8}},
            h("div",{style:{flex:1}},lbl("AMOUNT (RS.)"),h("input",{type:"number",value:claimAmt,onChange:function(e){setClaimAmt(e.target.value);},placeholder:"e.g. 500",style:{width:"100%",background:CARD,border:"1px solid "+BDR,borderRadius:8,padding:"9px 10px",fontSize:12,color:NVY,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}})),
            h("div",{style:{flex:1}},lbl("CREDIT TO SALARY MONTH"),
              (function(){
                var parts=claimDate?claimDate.split("-"):["",""];
                var cdY=parts[0]?Number(parts[0]):now2.getFullYear();
                var cdM=parts[1]?Number(parts[1])-1:now2.getMonth();
                function setClaimYM(y,m){setClaimDate(y+"-"+String(m+1).padStart(2,"0"));}
                return h("div",{style:{display:"flex",gap:6}},
                  chipSelect(cdM,function(v){setClaimYM(cdY,Number(v));},MOS2.map(function(m,i){return {v:i,l:m};}),{question:"Choose the month",btnLabel:"Okay",wrapStyle:{flex:1,marginBottom:0}}),
                  chipSelect(cdY,function(v){setClaimYM(Number(v),cdM);},[now2.getFullYear()-1,now2.getFullYear(),now2.getFullYear()+1],{question:"Choose the year",btnLabel:"Okay",wrapStyle:{flex:1,marginBottom:0}})
                );
              })()
            )
          ),
          lbl("DESCRIPTION (OPTIONAL)"),
          h("input",{type:"text",value:claimDesc,onChange:function(e){setClaimDesc(e.target.value);},placeholder:"e.g. Client visit travel",style:{width:"100%",background:CARD,border:"1px solid "+BDR,borderRadius:8,padding:"9px 10px",fontSize:12,color:NVY,outline:"none",fontFamily:"inherit",marginBottom:10,boxSizing:"border-box"}}),
          h("div",{style:{background:ACCENT_SOFT,borderRadius:8,padding:"7px 10px",marginBottom:10,fontSize:10,color:"#4F46E5",display:"flex",alignItems:"center",gap:5}},ic("info","#4F46E5",11)," Auto-added as Reimbursement to that month payslip"),
          h("button",{onClick:function(){
            if(!claimEmp||!claimAmt||!claimDate)return showT("Fill all required fields","err");
            var emp2=actEmps.find(function(e){return String(e.id)===claimEmp;});
            if(!emp2)return showT("Select employee","err");
            var parts=claimDate.split("-");
            var cm=Number(parts[1])-1,cy=Number(parts[0]);
            var dateStr=claimDate+"-01";
            var c={id:Date.now(),employeeId:claimEmp,employeeName:emp2.name,category:claimCat,amount:Number(claimAmt),date:dateStr,description:claimDesc,status:"approved",month:cm,year:cy};
            setClaims(function(p){return [c].concat(p||[]);});
            _sb.from("staff_claims").insert({id:String(c.id),employer_email:gUser.email,employee_id:claimEmp,employee_name:emp2.name,category:claimCat,amount:c.amount,date:dateStr,description:claimDesc,status:"approved",month:cm,year:cy}).then(function(r){if(r&&r.error)showT("Error: "+r.error.message,"err");else showT("Claim added to payroll!");});
            setClaimEmp("");setClaimAmt("");setClaimDate("");setClaimDesc("");setShowClaimForm(false);
          },style:{width:"100%",background:NVY,border:"none",borderRadius:9,padding:"11px",fontSize:12,fontWeight:700,color:CARD,cursor:"pointer"}},"Add to Payroll")
        ):null,
        (function(){
          var cats2={travel:"Travel",food:"Food",medical:"Medical",accommodation:"Stay",stationery:"Stationery",other:"Other"};
          var clrMap={travel:"#2563EB",food:"#10B981",medical:"#DC2626",accommodation:"#7C3AED",stationery:"#D97706",other:"#64748B"};
          var ms=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
          var all=(claims||[]).sort(function(a,b){return (b.date||"").localeCompare(a.date||"");});
          if(!all.length)return h("div",{style:{textAlign:"center",padding:"12px 0",fontSize:10,color:GRY}},"No claims yet. Tap + Add.");
          return h("div",null,all.map(function(c){
            var clr=clrMap[c.category]||GRY;
            return h("div",{key:c.id,style:{background:CARD,borderRadius:10,border:"1px solid "+BDR,marginBottom:6,overflow:"hidden"}},
              h("div",{style:{background:clr,padding:"6px 12px",display:"flex",justifyContent:"space-between",alignItems:"center"}},
                h("div",{style:{display:"flex",alignItems:"center",gap:6}},h("div",{style:{fontSize:11,fontWeight:700,color:"#fff"}},cats2[c.category]||c.category),h("div",{style:{fontSize:9,background:"rgba(255,255,255,.2)",color:"#fff",borderRadius:10,padding:"1px 6px"}},c.employeeName)),
                h("div",{style:{fontSize:13,fontWeight:900,color:"#fff"}},fmt(c.amount))
              ),
              h("div",{style:{padding:"6px 12px",display:"flex",justifyContent:"space-between",alignItems:"center"}},
                h("div",null,h("div",{style:{fontSize:10,color:GRY}},"Payroll: "+ms[c.month]+" "+c.year),c.description?h("div",{style:{fontSize:9,color:GRY,fontStyle:"italic"}},c.description):null),
                h("div",{style:{display:"flex",alignItems:"center",gap:5}},
                  h("div",{style:{fontSize:9,fontWeight:700,background:"#10B98110",color:"#10B981",borderRadius:5,padding:"2px 6px"}},"IN PAYROLL"),
                  h("button",{onClick:function(){if(!window.confirm("Remove?"))return;setClaims(function(p){return p.filter(function(x){return x.id!==c.id;});});_sb.from("staff_claims").delete().eq("id",String(c.id)).then(function(){});showT("Removed");},style:{background:RED+"10",border:"1px solid "+RED+"22",borderRadius:5,width:20,height:20,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}},ic("delete",RED,10))
                )
              )
            );
          }));
        })()
      )
    );
  }

  function renderPro(){
    if(!isPaid)return h("div",{style:{padding:"40px 20px",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center"}},
      h("div",{style:{width:88,height:88,borderRadius:"50%",background:ACCENT+"12",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20}},
        ic("lock","#4F46E5",42)
      ),
      h("div",{style:{fontSize:18,fontWeight:800,color:NVY,marginBottom:8}},"This is a paid feature"),
      h("div",{style:{fontSize:13,color:GRY,marginBottom:24,lineHeight:1.6,maxWidth:280}},"The Insight section includes task management, KPI tracking, employee self-service, leave approvals and notifications. Subscribe to unlock."),
      h("button",{onClick:function(){window.open("https://wa.me/918072293384?text="+encodeURIComponent("Hi, I would like to subscribe to the paid features of Admin HR"),"_blank");},style:{background:NVY,border:"none",borderRadius:12,padding:"13px 28px",color:CARD,fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10}},
        ic("whatsapp","#25D366",18),"Contact to Subscribe"
      )
    );

    if(selTask){
      var t=selTask;
      var tComments=taskComments[t.id]||[];
      var assignedEmp=emps.find(function(e){return e.email===t.assignTarget||e.name===t.assignTarget;});
      return h("div",{className:"fd"},
        h("button",{onClick:function(){setSelTask(null);},style:{display:"flex",alignItems:"center",gap:6,background:"none",border:"none",cursor:"pointer",color:ACCENT,fontSize:13,fontWeight:600,padding:"0 0 12px",marginBottom:4}},
          ic("arrow_back",ACCENT,16),"Back"
        ),
        h("div",{style:{background:CARD,borderRadius:16,padding:"14px 16px",boxShadow:"0 2px 12px rgba(0,0,0,0.07)",marginBottom:8}},
          h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}},
            h("div",{style:{fontSize:15,fontWeight:700,color:NVY,flex:1,marginRight:10,lineHeight:1.4}},t.title),
            h("div",{style:{fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:20,flexShrink:0,background:t.priority==="high"?"#FEE2E2":t.priority==="medium"?"#FEF3C7":"#D1FAE5",color:t.priority==="high"?"#991B1B":t.priority==="medium"?"#92400E":"#065F46"}},t.priority.toUpperCase())
          ),
          t.description?h("div",{style:{fontSize:12,color:GRY,marginBottom:10,lineHeight:1.6,paddingBottom:10,borderBottom:"1px solid "+BDR}},t.description):null,
          h("div",{style:{display:"flex",alignItems:"center",marginBottom:10}},
            ["assigned","in_progress","completed","verified"].map(function(s,i){
              var states=["assigned","in_progress","completed","verified"];
              var curIdx=states.indexOf(t.status);
              var isDone=i<=curIdx;
              var isCur=i===curIdx;
              return [
                h("div",{key:s,style:{display:"flex",flexDirection:"column",alignItems:"center",gap:3}},
                  h("div",{style:{width:24,height:24,borderRadius:"50%",background:isDone?(isCur?ACCENT:"#10B981"):"#E2E8F0",display:"flex",alignItems:"center",justifyContent:"center"}},
                    isDone&&!isCur?ic("check","#fff",12):h("div",{style:{width:8,height:8,borderRadius:"50%",background:isCur?"#fff":"#94A3B8"}})
                  ),
                  h("div",{style:{fontSize:8,color:isDone?NVY:GRY,fontWeight:isCur?700:400,textAlign:"center",maxWidth:40}},s.replace("_"," "))
                ),
                i<3?h("div",{key:s+"l",style:{flex:1,height:2,background:i<curIdx?"#10B981":"#E2E8F0",borderRadius:1,margin:"0 2px",marginBottom:14}}):null
              ];
            })
          ),
          h("div",{style:{display:"flex",gap:16}},
            assignedEmp?h("div",null,h("div",{style:{fontSize:9,color:GRY,letterSpacing:1}},"ASSIGNED TO"),h("div",{style:{fontSize:12,fontWeight:600,color:NVY,marginTop:2}},assignedEmp.name)):null,
            h("div",null,h("div",{style:{fontSize:9,color:GRY,letterSpacing:1}},"DEADLINE"),h("div",{style:{fontSize:12,fontWeight:600,color:new Date(t.deadline)<new Date()&&t.status!=="verified"?RED:NVY,marginTop:2}},t.deadline))
          )
        ),
        t.completionNote?h("div",{style:{background:"#ECFDF5",borderRadius:12,padding:"10px 14px",marginBottom:8,display:"flex",gap:8}},
          ic("arrow_right",ACCENT,18),
          h("div",null,h("div",{style:{fontSize:11,fontWeight:700,color:"#065F46"}},"Completion note"),h("div",{style:{fontSize:11,color:"#065F46",marginTop:2}},t.completionNote))
        ):null,
        t.status==="completed"?h("div",{style:{display:"flex",gap:8,marginBottom:12}},
          h("button",{onClick:function(){updateTaskStatus(t.id,"verified");setSelTask(null);},style:{flex:1,background:"#10B981",border:"none",borderRadius:12,padding:"12px",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}},ic("verified","#fff",16),"Verify Complete"),
          h("button",{onClick:function(){askForm("Send Back Task",[{key:"r",label:"Reason",type:"textarea",placeholder:"Optional",required:true}],function(vals){updateTaskStatus(t.id,"rejected",vals.r);setSelTask(null);},{submitLabel:"Send Back"});},style:{flex:1,background:RED,border:"none",borderRadius:12,padding:"12px",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}},ic("cancel","#fff",16),"Send Back")
        ):null,
        h("div",{style:{background:CARD,borderRadius:16,padding:"14px 16px",boxShadow:"0 2px 12px rgba(0,0,0,0.07)"}},
          h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}},
            h("div",{style:{fontSize:12,fontWeight:700,color:NVY,display:"flex",alignItems:"center",gap:6}},ic("forum",NVY,15),"Status Updates ("+((t.statusHistory||[]).length)+")"),
            (t.statusHistory&&t.statusHistory.length>0)?h("button",{onClick:function(){var last=t.statusHistory[t.statusHistory.length-1];shareTaskStatusWA(t,last?last.text:"");},style:{display:"flex",alignItems:"center",gap:4,background:"#25D366",border:"none",borderRadius:8,padding:"5px 9px",fontSize:10,fontWeight:700,color:"#fff",cursor:"pointer"}},ic("whatsapp","#fff",12),"Share"):null
          ),
          h("div",{style:{maxHeight:200,overflowY:"auto",marginBottom:10}},
            (!t.statusHistory||t.statusHistory.length===0)?h("div",{style:{textAlign:"center",padding:"16px 0",color:GRY,fontSize:12}},"No status updates yet."):
            t.statusHistory.map(function(s){
              var isMe=s.by===gUser.email;
              return h("div",{key:s.id,style:{marginBottom:9,paddingBottom:9,borderBottom:"1px solid "+BDR}},
                h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}},
                  h("div",{style:{fontSize:9,color:GRY,fontWeight:600}},(isMe?"You":s.by.split("@")[0])+" \u00b7 "+new Date(s.at).toLocaleDateString("en-IN",{day:"numeric",month:"short"})+" "+new Date(s.at).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})),
                  h("button",{onClick:function(){shareTaskStatusWA(t,s.text);},style:{display:"flex",alignItems:"center",gap:3,background:"none",border:"none",cursor:"pointer",color:"#25D366",fontSize:9,fontWeight:700,padding:0}},ic("whatsapp",TEL,11),"Send")
                ),
                h("div",{style:{fontSize:12,color:NVY,lineHeight:1.45}},s.text)
              );
            })
          ),
          h("div",{style:{display:"flex",gap:8}},
            h("input",{type:"text",value:taskStatusInput,onChange:function(e){setTaskStatusInput(e.target.value);},onKeyDown:function(e){if(e.key==="Enter")addStatusUpdate(t.id);},placeholder:"Type status update...",style:{flex:1,background:SFT,border:"1px solid "+BDR,borderRadius:22,padding:"10px 14px",fontSize:12,color:NVY,outline:"none",fontFamily:"inherit"}}),
            h("button",{onClick:function(){addStatusUpdate(t.id);},style:{background:NVY,border:"none",borderRadius:22,padding:"10px 16px",color:CARD,fontSize:12,fontWeight:700,cursor:"pointer"}},"Update")
          )
        )
      );
    }

    var filteredTasks=taskTab==="all"?tasks:tasks.filter(function(t){return t.status===taskTab;});
    var pendingLeaves=leaveReqs.filter(function(r){return r.status==="pending";});

    return h("div",{className:"fd"},
      // ── Work inner tabs ──
      h("div",{style:{display:"flex",background:SFT,borderRadius:12,padding:3,marginBottom:14,gap:3}},
h("button",{onClick:function(){setProTab("kpi");},style:{flex:1,background:proTab==="kpi"?CARD:"transparent",border:proTab==="kpi"?"1px solid "+BDR:"1px solid transparent",borderRadius:9,padding:"9px",color:proTab==="kpi"?NVY:GRY,fontSize:11,fontWeight:proTab==="kpi"?700:500,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5,boxShadow:proTab==="kpi"?T.SHADOW:"none"}},
          ic("insights",proTab==="kpi"?(ACCENT==="#FFFFFF"?NVY:ACCENT):GRY,14),"KPI"
        ),
        h("button",{onClick:function(){setProTab("expenses");},style:{flex:1,background:proTab==="expenses"?CARD:"transparent",border:proTab==="expenses"?"1px solid "+BDR:"1px solid transparent",borderRadius:9,padding:"9px",color:proTab==="expenses"?NVY:GRY,fontSize:11,fontWeight:proTab==="expenses"?700:500,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5,boxShadow:proTab==="expenses"?T.SHADOW:"none"}},
          ic("account_balance_wallet",proTab==="expenses"?(ACCENT==="#FFFFFF"?NVY:ACCENT):GRY,14),"Expenses"
        )
      ),
      proTab==="expenses"?renderCompanyExpenses():renderKpiSection());
  }

  function renderKpiSection(){
    return h("div",{className:"fd"},
      h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}},
        h("div",null,
          h("div",{style:{fontSize:15,fontWeight:700,color:NVY}},"KPI & Performance"),
          h("div",{style:{fontSize:11,color:GRY,marginTop:2}},MOS[curM]+" "+curY+" reviews")
        ),
        h("button",{onClick:function(){setShowKpiForm(true);setKpiAssignTarget("");},style:{background:"#D97706"+"15",border:"1px solid #D97706"+"44",borderRadius:10,padding:"8px 14px",color:"#D97706",fontSize:11,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:5}},
          ic("add","#D97706",14),"Add KPI"
        )
      ),
      emps.filter(function(e){return e.status==="active";}).map(function(e){
        var empKpiList=getEmpKpis(e.email||e.name,e.dept,e.role);
        return h("div",{key:e.id,style:{marginBottom:10}},
          h("div",{style:{display:"flex",alignItems:"center",gap:10,marginBottom:8}},
            av(e,36),
            h("div",{style:{flex:1}},
              h("div",{style:{fontSize:12,fontWeight:700,color:NVY}},e.name),
              h("div",{style:{fontSize:10,color:GRY,marginTop:1}},e.role||e.dept||"")
            )
          ),
          empKpiList.length>0?empKpiList.map(function(k){return renderKpiCard(k);}):h("button",{onClick:function(){setKpiAssignType("individual");setKpiAssignTarget(e.email||e.name);setShowKpiForm(true);},style:{background:"none",border:"1px dashed "+BDR,borderRadius:9,padding:"7px",width:"100%",color:GRY,fontSize:11,cursor:"pointer"}},"+ Set KPI targets")
        );
      }),
      showKpiForm?h("div",{style:{background:CARD,borderRadius:14,padding:16,boxShadow:"0 4px 16px rgba(0,0,0,0.08)",marginTop:8}},
        h("div",{style:{fontSize:13,fontWeight:700,color:NVY,marginBottom:14}},"Add KPI"),
        lbl("ASSIGN TO"),
        chipSelect(kpiAssignType,function(v){setKpiAssignType(v);setKpiAssignTarget("");},["individual","department","role"].map(function(v){return {v:v,l:v.charAt(0).toUpperCase()+v.slice(1)};}),{question:"Assign this KPI to"}),
        kpiAssignType==="individual"?chipSelect(kpiAssignTarget,function(v){setKpiAssignTarget(v);},emps.filter(function(e){return e.status==="active";}).map(function(e){return {v:e.email||e.name,l:e.name};}),{question:"Choose the employee",placeholder:"Select employee"}):null,
        kpiAssignType==="department"?chipSelect(kpiAssignTarget,function(v){setKpiAssignTarget(v);},getDepts(org.type),{question:"Choose the department",placeholder:"Select department"}):null,
        kpiAssignType==="role"?h("input",{type:"text",value:kpiAssignTarget,onChange:function(e){setKpiAssignTarget(e.target.value);},placeholder:"e.g. Sales Executive",style:{width:"100%",marginBottom:10,background:SFT,border:"1px solid "+BDR,borderRadius:10,padding:"10px 12px",fontSize:12,color:NVY,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}):null,
        lbl("KPI TITLE"),
        h("input",{type:"text",value:kpiName,onChange:function(e){setKpiName(e.target.value);},placeholder:"e.g. Monthly sales",style:{width:"100%",marginBottom:8,background:SFT,border:"1px solid "+BDR,borderRadius:10,padding:"10px 12px",fontSize:12,color:NVY,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}),
        h("div",{style:{display:"flex",gap:8,marginBottom:8}},
          h("div",{style:{flex:1}},lbl("TARGET"),h("input",{type:"number",value:kpiTarget,onChange:function(e){setKpiTarget(e.target.value);},placeholder:"100",style:{width:"100%",background:SFT,border:"1px solid "+BDR,borderRadius:10,padding:"10px 12px",fontSize:12,color:NVY,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}})),
          h("div",{style:{flex:1}},lbl("UNIT"),chipSelect(kpiUnit,function(v){setKpiUnit(v);},["Tasks","Sales","Calls","Attendance %","%","Number","Rs."],{question:"Choose the KPI unit",allowCustom:true,customPlaceholder:"Type your own unit..."}))
        ),
        h("div",{style:{display:"flex",gap:8,marginBottom:12}},
          h("div",{style:{flex:1}},lbl("START DATE"),datePick(kpiStartDate,function(v){setKpiStartDate(v);},{question:"KPI start date"})),
          h("div",{style:{flex:1}},lbl("DUE DATE"),datePick(kpiDueDate,function(v){setKpiDueDate(v);},{question:"KPI due date"}))
        ),
        h("div",{style:{display:"flex",gap:8}},
          h("button",{onClick:saveKpi,style:{flex:2,background:"#D97706",border:"none",borderRadius:10,padding:"11px",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer"}},"Save KPI"),
          h("button",{onClick:function(){setShowKpiForm(false);},style:{flex:1,background:SFT,border:"1px solid "+BDR,borderRadius:10,padding:"11px",color:NVY,fontSize:12,cursor:"pointer"}},"Cancel")
        )
      ):null
    );
  }


  function renderAddModal(){
    if(!addOpen)return null;
    return h("div",{style:{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:200,display:"flex",alignItems:"flex-end"}},
      h("div",{style:{background:CARD,borderRadius:"20px 20px 0 0",padding:20,width:"100%",maxWidth:430,margin:"0 auto",maxHeight:"91vh",overflowY:"auto"}},
        h("div",{style:{display:"flex",alignItems:"center",gap:5,marginBottom:14}},
          [1,2,3,4].map(function(s){return h("div",{key:s,style:{display:"flex",alignItems:"center",gap:5,flex:s<4?1:"auto"}},h("div",{style:{width:24,height:24,borderRadius:12,background:step>=s?NVY:BDR,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:step>=s?CARD:GRY,flexShrink:0}},s),s<4?h("div",{style:{flex:1,height:2,background:step>s?NVY:BDR,borderRadius:1}}):null);})
        ),
        h("div",{style:{fontSize:14,fontWeight:800,color:NVY,marginBottom:1}},step===1?"Personal":step===2?"Employment":step===3?"Identity":"Tax and Deductions"),
        h("div",{style:{fontSize:11,color:GRY,marginBottom:13}},"Step "+step+" of 4"),
        step===1?h("div",null,lbl("FULL NAME *"),h("input",{value:fName,onChange:function(e){setFName(e.target.value);},placeholder:"e.g. Priya Sharma",style:{width:"100%",background:SFT,border:"1.5px solid "+BDR,borderRadius:11,padding:"11px 13px",fontSize:13,color:NVY,outline:"none",fontFamily:"inherit",marginBottom:10}}),lbl("DATE OF BIRTH"),datePick(fDob,function(v){setFDob(v);},{question:"Date of birth",wrapStyle:{marginBottom:10}}),lbl("MOBILE"),h("input",{type:"tel",value:fMob,onChange:function(e){setFMob(e.target.value);},placeholder:"10-digit",style:{width:"100%",background:SFT,border:"1.5px solid "+BDR,borderRadius:11,padding:"11px 13px",fontSize:13,color:NVY,outline:"none",fontFamily:"inherit",marginBottom:10}}),lbl("EMAIL"),h("input",{type:"email",value:fEmail,onChange:function(e){setFEmail(e.target.value);},placeholder:"emp@company.com",style:{width:"100%",background:SFT,border:"1.5px solid "+BDR,borderRadius:11,padding:"11px 13px",fontSize:13,color:NVY,outline:"none",fontFamily:"inherit",marginBottom:10}}),lbl("JOINING DATE"),datePick(fJoin,function(v){setFJoin(v);},{question:"Joining date",wrapStyle:{marginBottom:10}})):null,
        step===2?h("div",null,
          lbl("EMPLOYEE ID"),h("input",{value:fEid,onChange:function(e){setFEid(e.target.value);},placeholder:"e.g. EMP006",style:{width:"100%",background:SFT,border:"1.5px solid "+BDR,borderRadius:11,padding:"11px 13px",fontSize:13,color:NVY,outline:"none",fontFamily:"inherit",marginBottom:10}}),
          lbl("ROLE / DESIGNATION *"),
          chipSelect(fRole,function(v){setFRole(v);},getRoles(org.type),{allowCustom:true,customPlaceholder:"Type the role...",question:"Choose the role"}),
          lbl("DEPARTMENT"),
          chipSelect(dept,function(v){setDept(v);},getDepts(org.type),{allowCustom:true,customPlaceholder:"Type the department...",question:"Choose the department"}),
          lbl("SALARY TYPE"),
          h("div",{style:{display:"flex",background:SFT,borderRadius:11,padding:3,marginBottom:10,gap:3}},
            h("button",{onClick:function(){setFSalType("split");},style:{flex:1,background:fSalType==="split"?CARD:"transparent",border:fSalType==="split"?"1px solid "+BDR:"none",borderRadius:8,padding:"8px",color:fSalType==="split"?NVY:GRY,fontSize:11,fontWeight:600,cursor:"pointer"}},"\uD83C\uDFE6 Split (Basic+HRA+Allow)"),
            h("button",{onClick:function(){setFSalType("fixed");},style:{flex:1,background:fSalType==="fixed"?CARD:"transparent",border:fSalType==="fixed"?"1px solid "+BDR:"none",borderRadius:8,padding:"8px",color:fSalType==="fixed"?NVY:GRY,fontSize:11,fontWeight:600,cursor:"pointer"}},"\uD83D\uDCB0 Fixed Salary")
          ),
          fSalType==="fixed"?h("div",null,
            lbl("FIXED MONTHLY SALARY (Rs.) *"),
            h("input",{type:"number",value:fFixed,onChange:function(e){setFFixed(e.target.value);setFCtc(e.target.value);},placeholder:"e.g. 20000",style:{width:"100%",background:SFT,border:"1.5px solid "+BDR,borderRadius:11,padding:"11px 13px",fontSize:13,color:NVY,outline:"none",fontFamily:"inherit",marginBottom:6}}),
            h("div",{style:{fontSize:10,color:GRY,marginBottom:10}},"No Basic/HRA breakdown. Full amount used for attendance deduction & PF/ESI calculation.")
          ):h("div",null,
          lbl("MONTHLY CTC (Rs.) *"),h("input",{type:"number",value:fCtc,onChange:function(e){setFCtc(e.target.value);},placeholder:"e.g. 50000",style:{width:"100%",background:SFT,border:"1.5px solid "+BDR,borderRadius:11,padding:"11px 13px",fontSize:13,color:NVY,outline:"none",fontFamily:"inherit",marginBottom:10}}),
          h("div",{style:{background:SFT,borderRadius:8,padding:"7px 10px",marginBottom:10,fontSize:11,color:GRY}},"Auto-split: 50% Basic, 20% HRA, 30% Allowance"),
          fCtc&&org.state?h("div",null,(function(){var w=checkMinWage(Number(fCtc),org.state,"skilled");return w?h("div",{style:{background:RED+"15",border:"1px solid "+RED+"33",borderRadius:8,padding:"7px 10px",fontSize:11,color:RED,fontWeight:600}},"⚠️ "+w):h("div",{style:{background:GRN+"15",border:"1px solid "+GRN+"33",borderRadius:8,padding:"7px 10px",fontSize:11,color:GRN,fontWeight:600}},"✓ Above minimum wage for "+org.state);})()):null
          ),
        ):null,
        step===3?h("div",null,lbl("PAN"),h("input",{value:fPan,onChange:function(e){setFPan(e.target.value);},placeholder:"ABCDE1234F",style:{width:"100%",background:SFT,border:"1.5px solid "+BDR,borderRadius:11,padding:"11px 13px",fontSize:13,color:NVY,outline:"none",fontFamily:"inherit",marginBottom:10}}),lbl("UAN (PF Account)"),h("input",{value:fUan,onChange:function(e){setFUan(e.target.value);},placeholder:"Universal Account No.",style:{width:"100%",background:SFT,border:"1.5px solid "+BDR,borderRadius:11,padding:"11px 13px",fontSize:13,color:NVY,outline:"none",fontFamily:"inherit",marginBottom:10}}),lbl("AADHAR"),h("input",{value:fAadhar,onChange:function(e){setFAadhar(e.target.value);},placeholder:"XXXX-XXXX-XXXX",style:{width:"100%",background:SFT,border:"1.5px solid "+BDR,borderRadius:11,padding:"11px 13px",fontSize:13,color:NVY,outline:"none",fontFamily:"inherit",marginBottom:10}})):null,
        step===4?h("div",null,
          togEl("EPF / PF","12% emp + 12% employer",pf,setPf),
          pf?h("div",{style:{padding:"8px 0",borderBottom:"1px solid "+BDR}},lbl("PF Mode"),h("div",{style:{display:"flex",gap:7}},[["capped","Capped Rs.1800"],["actual","Actual Basic"]].map(function(item){return h("button",{key:item[0],onClick:function(){setPfMode(item[0]);},style:{flex:1,background:pfMode===item[0]?NVY:SFT,border:"1.5px solid "+(pfMode===item[0]?NVY:BDR),borderRadius:9,padding:"8px",color:pfMode===item[0]?CARD:GRY,fontSize:11,fontWeight:600,cursor:"pointer"}},item[1]);}))):null,
          togEl("ESI","0.75% emp if gross up to Rs.21K",esi,setEsi),
          togEl("Professional Tax","Rs.200/mo if above Rs.15K",pt,setPt),
          togEl("TDS","FY 2025-26 new regime",tds,setTds),
          tds?h("div",{style:{padding:"8px 0 0"}},
            lbl("TAX REGIME"),
            chipSelect(taxRegime,function(v){setTaxRegime(v);},[{v:"new",l:"New (Default)"},{v:"old",l:"Old Regime"}],{question:"Choose the tax regime"}),
            h("div",{style:{fontSize:9.5,color:GRY,lineHeight:1.4,marginTop:-2}},"Old regime here applies the standard Rs.50,000 deduction and slab rates only - it does not model HRA exemption, 80C or other deductions. For an employee with significant old-regime deductions, treat this as an estimate and verify with a tax professional.")
          ):null,
          h("div",{style:{marginTop:11}},lbl("ANNUAL PAID LEAVE ENTITLEMENT (days)"),h("input",{type:"number",value:fLeave||"",onChange:function(e){setFLeave(e.target.value);},placeholder:"Default: 12 days",style:{width:"100%",background:SFT,border:"1.5px solid "+BDR,borderRadius:11,padding:"11px 13px",fontSize:13,color:NVY,outline:"none",fontFamily:"inherit",marginBottom:10}}),
          lbl("HEALTH INSURANCE (Rs./mo)"),h("input",{type:"number",value:fHi,onChange:function(e){setFHi(e.target.value);},placeholder:"e.g. 500",style:{width:"100%",background:SFT,border:"1.5px solid "+BDR,borderRadius:11,padding:"11px 13px",fontSize:13,color:NVY,outline:"none",fontFamily:"inherit",marginBottom:10}})),
          h("div",null,
            h("div",{style:{fontSize:11,color:GRY,marginBottom:6,fontWeight:600}},"CUSTOM DEDUCTIONS"),
            customs.map(function(c2,i){return h("div",{key:i,style:{display:"flex",justifyContent:"space-between",alignItems:"center",background:SFT,borderRadius:7,padding:"5px 9px",marginBottom:5}},h("span",{style:{fontSize:12,color:NVY}},c2.name),h("div",{style:{display:"flex",gap:7,alignItems:"center"}},h("span",{style:{fontSize:12,fontWeight:600,color:RED}},fmt(c2.amt)),h("button",{onClick:function(){setCustoms(function(p){return p.filter(function(_,j){return j!==i;});});},style:{background:T.PILL_DANGER_BG,border:"none",borderRadius:5,padding:"2px 6px",color:RED,fontSize:10,cursor:"pointer"}},"X")));})  ,
            h("div",{style:{display:"flex",gap:7,marginTop:3}},
              h("input",{ref:cnR,placeholder:"Name e.g. Loan EMI",autoComplete:"off",style:{flex:2,background:SFT,border:"1.5px solid "+BDR,borderRadius:8,padding:"9px 10px",fontSize:13,color:NVY,outline:"none",fontFamily:"inherit"}}),
              h("input",{ref:caR,placeholder:"Rs.",type:"number",style:{flex:1,background:SFT,border:"1.5px solid "+BDR,borderRadius:8,padding:"9px 8px",fontSize:13,color:NVY,outline:"none",fontFamily:"inherit"}}),
              h("button",{onClick:function(){if(!cnR.current||!cnR.current.value||!caR.current||!caR.current.value)return;setCustoms(function(p){return p.concat([{name:cnR.current.value,amt:Number(caR.current.value)}]);});cnR.current.value="";caR.current.value="";},style:{background:NVY,border:"none",borderRadius:8,padding:"9px 10px",color:CARD,fontSize:11,fontWeight:700,cursor:"pointer"}},"Add")
            )
          )
        ):null,
        h("div",{style:{display:"flex",gap:8,marginTop:14}},
          h("button",{onClick:function(){if(step>1)setStep(function(s){return s-1;});else{setAddOpen(false);setStep(1);setFName("");setFDob("");setFMob("");setFEmail("");setFJoin("");setFEid("");setFRole("");setFCtc("");setFAadhar("");setFPan("");setFUan("");setFHi("");setFLeave("");setDept("");}},style:{flex:1,background:SFT,border:"1px solid "+BDR,borderRadius:10,padding:11,color:GRY,fontSize:12,cursor:"pointer"}},step===1?"Cancel":"Back"),
          h("button",{onClick:function(){if(step===1&&!fName.trim())return showT("Name required","err");if(step===2&&!fCtc)return showT("CTC required","err");if(step<4)setStep(function(s){return s+1;});else saveEmp();},style:{flex:2,background:NVY,border:"none",borderRadius:10,padding:11,color:CARD,fontSize:12,fontWeight:600,cursor:"pointer"}},step===4?"Save Employee":"Next")
        )
      )
    );
  }

  var loadingScreen=h("div",{style:{minHeight:"100vh",background:T.AUTH_BG,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16}},
    logoSVG(52),
    h("div",{style:{display:"flex",gap:6,marginTop:8}},
      [0,1,2].map(function(i){return h("div",{key:i,style:{width:7,height:7,borderRadius:"50%",background:NVY,opacity:.35,animation:"dot 1.2s "+(i*0.2)+"s infinite"}});})
    )
  );

  try{if(window.__hideSplash)window.__hideSplash("");}catch(e){}
  var appContent;
  if(screen==="loading")appContent=loadingScreen;
  else if(screen==="login")appContent=isPasswordReset?setPasswordScreen:
    (authMode==="otp"||authMode==="signup-otp")?otpScreen:
    authMode==="emp-otp"?h("div",{key:"empotp",style:{minHeight:"100vh",background:T.AUTH_BG,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px 24px 0"}},
      h("div",{style:{width:"100%",maxWidth:380,textAlign:"center"}},
        logoSVG(52),
        h("div",{style:{fontSize:20,fontWeight:800,color:T.AUTH_TEXT,marginTop:14}},"Verify Your Email"),
        h("div",{style:{fontSize:12,color:T.AUTH_LABEL,marginTop:5}},"OTP sent to "+authEmail),
        h("div",{style:{marginTop:16}},
          authLbl("ENTER OTP"),
          h("input",{type:"number",value:authOtp,onChange:function(e){setAuthOtp(e.target.value.slice(0,8));setAuthErr("");},placeholder:"\u2022\u2022\u2022\u2022\u2022\u2022",style:{width:"100%",background:T.AUTH_INPUT_BG,border:"1.5px solid "+(authErr?RED:T.AUTH_INPUT_BDR),borderRadius:12,padding:"14px",fontSize:28,color:T.AUTH_TEXT,outline:"none",fontFamily:"monospace",textAlign:"center",letterSpacing:10,marginBottom:10}}),
          authErr2(),
          authBtn(authLoading?"Verifying...":"Verify & Join",handleEmployeeVerifyOTP),
          h("div",{style:{marginTop:12,fontSize:12,color:T.AUTH_LABEL}},
            h("span",{style:{color:TEL,cursor:"pointer",fontWeight:600},onClick:function(){setAuthMode("emp-signup");setAuthOtp("");setAuthErr("");}},"\u2190 Go back")
          )
        )
      )
    ):
    authMode==="emp-signup"?empSignupScreen:
    authMode==="signup"?signupScreen:
    authMode==="signin"?signinScreen:
    landingScreen;
  else if(screen==="setup")appContent=setupScreen;
  // ── Route to employee dashboard if role is employee ──
  else if(showAdmin)appContent=renderAdminPanel();
  else if(screen==="loading")appContent=loadingScreen;
  else{
    var tabContent;
    if(tab==="dashboard")tabContent=renderDashboard();
    else if(tab==="employees")tabContent=renderEmployees();
    else if(tab==="attendance")tabContent=renderAttendance();
    else if(tab==="payroll")tabContent=renderPayroll();
    else if(tab==="pro")tabContent=renderPro();
    else tabContent=renderSettings();

    appContent=h("div",null,
      h("div",{style:{background:CARD,padding:"14px 16px 12px",borderBottom:"1px solid "+BDR,position:"sticky",top:0,zIndex:50}},
        h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"}},
          h("div",{style:{display:"flex",alignItems:"center",gap:11}},
            h("div",{onClick:function(){
              var OWNER_EMAIL="authorhalik@gmail.com";
              if(gUser&&gUser.email===OWNER_EMAIL){
                setShowAdmin(true);loadAdminUsers();setTab("settings");
              }
            },style:{cursor:"pointer"}},logoSVG(38)),
            h("div",null,
              h("div",{style:{fontSize:9,color:GRY,letterSpacing:1.8,textTransform:"uppercase",fontWeight:600}},"Admin HR"),
              h("div",{style:{fontSize:18,fontWeight:700,color:NVY,marginTop:1,letterSpacing:-.2}},tab==="dashboard"?"Dashboard":tab==="employees"?"Team":tab==="attendance"?"Attendance":tab==="payroll"?"Payroll":tab==="pro"?"Insight":"Settings")
            )
          ),
          h("div",{style:{display:"flex",alignItems:"center",gap:8,position:"relative"}},
            h("button",{onClick:function(){syncToSupabase(emps,att,incentives,shifts,reminders,notices,revisions);showT("Saving to cloud...");},title:"Save to cloud",style:{width:38,height:38,borderRadius:11,background:SFT,border:"1px solid "+BDR,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",position:"relative"}},
              isSyncing
                ?h("div",{style:{width:16,height:16,border:"2px solid "+BDR,borderTop:"2px solid "+TEL,borderRadius:"50%",animation:"spin .8s linear infinite"}}):
                ic("cloud_upload",lastSync?GRN:GRY,18),
              lastSync?h("div",{style:{position:"absolute",top:4,right:4,width:6,height:6,borderRadius:"50%",background:GRN,border:"1px solid "+CARD}}):null
            ),
            h("button",{onClick:function(){setTab("settings");setSettTab("account");},title:"Settings",style:{width:38,height:38,borderRadius:11,background:SFT,border:"1px solid "+BDR,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}},
              ic("settings",NVY,19)),
            h("div",{style:{position:"relative",flexShrink:0}},
              h("button",{onClick:function(){setProf(function(v){return !v;});},style:{width:38,height:38,borderRadius:11,background:NVY,border:isPaid?"2.5px solid #FCD34D":"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",overflow:"hidden",padding:0,boxShadow:isPaid?"0 0 8px #FCD34D88":"none"}},
                gUser&&gUser.photo?h("img",{src:gUser.photo,width:38,height:38,style:{borderRadius:9,display:"block"}}):ic(ICONS.user,CARD,19)
              ),
              isPaid?h("div",{style:{position:"absolute",bottom:-4,right:-4,width:16,height:16,borderRadius:"50%",background:"linear-gradient(135deg,#FCD34D,#FF9900)",display:"flex",alignItems:"center",justifyContent:"center",border:"1.5px solid "+CARD,zIndex:2}},
                h("svg",{width:9,height:9,viewBox:"0 0 24 24",fill:"#0F172A"},
                  h("path",{d:"M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"})
                )
              ):null
            ),
            prof?h("div",{style:{position:"absolute",top:42,right:0,background:CARD,border:"1px solid "+BDR,borderRadius:13,padding:6,minWidth:185,boxShadow:T.SHADOW_LG,zIndex:200}},
              h("div",{style:{padding:"7px 11px",borderBottom:"1px solid "+BDR,marginBottom:3}},h("div",{style:{fontSize:12,fontWeight:700,color:NVY}},gUser?gUser.name:org.position),h("div",{style:{fontSize:11,color:GRY}},org.name),h("div",{style:{fontSize:10,color:GRY}},gUser?gUser.email:"")),

              isAdmin?h("button",{onClick:function(){setShowAdmin(true);loadAdminUsers();setTab("settings");setTab("settings");},style:{width:"100%",background:"none",border:"none",borderRadius:7,padding:"7px 11px",textAlign:"left",fontSize:12,fontWeight:700,color:AMB,cursor:"pointer"}},"Admin Panel"):null,
              h("button",{onClick:function(){window.open("https://wa.me/918072293384?text="+encodeURIComponent("Hi, I need support for Admin HR. My account: "+(gUser?gUser.email:"")),"_blank");setProf(false);},style:{width:"100%",background:"none",border:"none",borderRadius:7,padding:"7px 11px",textAlign:"left",fontSize:12,fontWeight:500,color:TEL,cursor:"pointer",display:"flex",alignItems:"center",gap:6}},ic(ICONS.wa,TEL,14),"Contact Support"),
              h("div",{style:{borderTop:"1px solid "+BDR,marginTop:3,paddingTop:3}},
                h("button",{onClick:function(){syncToSupabase(emps,att,incentives,shifts,reminders,notices,revisions);setAuthPwd("");setAuthPwd2("");setTimeout(function(){_sb.auth.signOut();var _email=gUser&&gUser.email?gUser.email:"";["hr_emps","hr_att","hr_inc","hr_revisions","hr_reminders","hr_shifts","hr_notices","hr_org","hr_last_sync","hr_guser","hr_login_time"].forEach(function(k){try{localStorage.removeItem(k);}catch(e){}});if(_email)["hr_emps_","hr_att_","hr_inc_"].forEach(function(k){try{localStorage.removeItem(k+_email);}catch(e){}});setGUser(null);setEmps([]);setAtt({});setIncentives({});setRevisions({});setReminders([]);setShifts({});setNotices([]);setOrg({name:"",type:"",email:"",position:"",plan:"free",address:"",logo:""});lsSet("hr_login_time",null);setScreen("login");setProf(false);},800);showT("Signing out...");},style:{width:"100%",background:"none",border:"none",borderRadius:7,padding:"7px 11px",textAlign:"left",fontSize:12,fontWeight:500,color:RED,cursor:"pointer"}},"Sign Out")
              )
            ):null
          )
        )
      ),
      h("div",{style:{padding:14,paddingBottom:110,overflowY:"auto"},onClick:function(){if(prof)setProf(false);}},tabContent),
      h("div",{style:{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:CARD,borderTop:"1px solid "+BDR,display:"flex",padding:"6px 0 16px",boxShadow:T.SHADOW_NAV,zIndex:50}},
        navBtn2("dashboard","Home","grid",tab,setTab,setSelE,setEditE,setSheetE,setOffE,setEditPayE),
        navBtn2("employees","Team","team",tab,setTab,setSelE,setEditE,setSheetE,setOffE,setEditPayE),
        navBtn2("attendance","Attend","cal",tab,setTab,setSelE,setEditE,setSheetE,setOffE,setEditPayE),
        navBtn2("payroll","Payroll","pay",tab,setTab,setSelE,setEditE,setSheetE,setOffE,setEditPayE),
        h("button",{onClick:function(){setTab("pro");setSelE(null);setEditE(null);setSheetE(null);setOffE(null);setEditPayE(null);},style:{flex:1,background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:"6px 0",color:tab==="pro"?ACCENT:GRY,transition:"color .15s"}},
          h("div",{style:{position:"relative",padding:"5px 14px",borderRadius:14,background:tab==="pro"?ACCENT_SOFT:"transparent",transition:"background .15s",display:"flex",alignItems:"center",justifyContent:"center"}},
            ic(ICONS.work,tab==="pro"?ACCENT:GRY,22),
            !isPaid?h("div",{style:{position:"absolute",top:1,right:5,width:11,height:11,borderRadius:"50%",background:"#64748B",border:"1.5px solid "+CARD,display:"flex",alignItems:"center",justifyContent:"center"}},ic("lock","#fff",7)):null,
            (leaveReqs.filter(function(r){return r.status==="pending";}).length+tasks.filter(function(t){return t.status==="completed";}).length+unreadNotifs)>0&&isPaid?h("div",{style:{position:"absolute",top:1,right:5,width:7,height:7,borderRadius:"50%",background:RED,border:"1px solid "+CARD}}):null
          ),
          h("div",{style:{fontSize:10,fontWeight:tab==="pro"?700:500,letterSpacing:.2}},"Insight")
        )
      ),
      toast?h("div",{style:{position:"fixed",top:18,left:"50%",transform:"translateX(-50%)",background:toast.type==="err"?RED:toast.type==="info"?AMB:(themeMode==="light"?"#0F172A":"#fff"),color:toast.type==="err"?"#fff":toast.type==="info"?"#fff":(themeMode==="light"?"#fff":"#0F172A"),padding:"10px 20px",borderRadius:30,fontSize:13,fontWeight:600,zIndex:999,whiteSpace:"nowrap",boxShadow:T.SHADOW_LG,animation:"fU .2s ease"}},toast.msg):null,
      showBkup?h(Modal,{title:"Monthly Backup Reminder",onClose:function(){
          var thisMonth=new Date().getFullYear()+"-"+(new Date().getMonth()+1);
          lsSet("hr_bkup_dismissed",thisMonth);setShowBkup(false);
        },bodyPad:"14px 18px"},
          h("div",{style:{background:themeMode==="light"?"#FFFBEB":"#3a3322",border:"1px solid #FCD34D66",borderRadius:10,padding:"11px 13px",marginBottom:14,display:"flex",alignItems:"center",gap:10}},
            ic("smartphone",AMB,20),
            h("div",null,
              h("div",{style:{fontSize:12,fontWeight:700,color:themeMode==="light"?"#92400E":AMB}},"Your mobile is your database"),
              h("div",{style:{fontSize:11,color:themeMode==="light"?"#B45309":GRY,marginTop:2}},"No cloud. No server. Data lives only on this device.")
            )
          ),
          h("div",{style:{fontSize:12,color:GRY,lineHeight:1.6,marginBottom:14}},"It's the start of "+MOS[curM]+". Download last month's records now to keep your data safe."),
          h("button",{onClick:function(){
            var thisMonth=new Date().getFullYear()+"-"+(new Date().getMonth()+1);
            lsSet("hr_bkup_dismissed",thisMonth);
            makeEmpCSV(emps);
            makeAttCSV(att,emps);
            makePayrollCSV(actEmps,curM,curY,getMonthPay);
            setShowBkup(false);
            showT("Downloading all 3 reports...");
          },style:{width:"100%",background:NVY,border:"none",borderRadius:12,padding:"13px",color:CARD,fontSize:13,fontWeight:700,cursor:"pointer",marginBottom:8,display:"flex",alignItems:"center",justifyContent:"center",gap:7}},
            ic("download",CARD,15),"Download All Reports Now"
          ),
          h("button",{onClick:function(){
            var thisMonth=new Date().getFullYear()+"-"+(new Date().getMonth()+1);
            lsSet("hr_bkup_dismissed",thisMonth);setShowBkup(false);
          },style:{width:"100%",background:"none",border:"1px solid "+BDR,borderRadius:12,padding:"10px",color:GRY,fontSize:12,cursor:"pointer"}},"Remind me next month")
      ):null,
      renderAddModal()
    );
  }


  function renderExpenses(){
    var cats={travel:"Travel",food:"Food",purchase:"Purchase",medical:"Medical",other:"Other"};
    var allExp=(expenses||[]).sort(function(a,b){return (b.createdAt||"").localeCompare(a.createdAt||"");});

    function addExpense(){
      if(!expEmpId||!expTitle||!expAmt)return showT("Fill all required fields","err");
      var emp=emps.find(function(e){return String(e.id)===expEmpId;});
      if(!emp)return;
      var exp={id:Date.now(),employerEmail:gUser.email,employeeId:emp.id,employeeName:emp.name,
        title:expTitle,amount:Number(expAmt),category:expCat,description:expDesc,
        status:"approved",month:curM,year:curY,createdAt:new Date().toISOString()};
      setExpenses(function(p){return [exp].concat(p||[]);});
      _sb.from("expenses").insert({id:String(exp.id),employer_email:gUser.email,employee_id:emp.id,
        employee_name:emp.name,title:expTitle,amount:exp.amount,category:expCat,
        description:expDesc,status:"approved",month:curM,year:curY}).then(function(){});
      setExpEmpId("");setExpTitle("");setExpAmt("");setExpDesc("");setShowExpForm(false);
      showT("Expense recorded");
    }

    function deleteExpense(id){
      if(!window.confirm("Delete this expense record?"))return;
      setExpenses(function(p){return (p||[]).filter(function(e){return e.id!==id;});});
      _sb.from("expenses").delete().eq("id",String(id)).then(function(){});
      showT("Deleted");
    }

    var total=allExp.reduce(function(s,e){return s+(e.amount||0);},0);

    return h("div",{className:"fd"},
      // Header
      h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}},
        h("div",null,
          h("div",{style:{fontSize:14,fontWeight:700,color:NVY}},"Expense Records"),
          h("div",{style:{fontSize:10,color:GRY,marginTop:2}},allExp.length+" records  —  Total: "+fmt(total))
        ),
        h("button",{onClick:function(){setShowExpForm(!showExpForm);},
          style:{background:showExpForm?SFT:ACCENT,border:showExpForm?"1.5px solid "+BDR:"none",borderRadius:9,padding:"7px 14px",fontSize:11,fontWeight:700,color:showExpForm?NVY:ACCENT_FG,cursor:"pointer"}},
          showExpForm?"Cancel":"+ Add Expense")
      ),

      // Add form
      showExpForm?h("div",{style:{background:SFT,borderRadius:14,padding:14,border:"1px solid "+BDR,marginBottom:14}},
        h("div",{style:{fontSize:11,fontWeight:700,color:NVY,marginBottom:10}},"Record Expense Reimbursement"),
        lbl("EMPLOYEE"),
        h("select",{value:expEmpId,onChange:function(e){setExpEmpId(e.target.value);},
          style:{width:"100%",background:CARD,border:"1px solid "+BDR,borderRadius:9,padding:"9px 11px",fontSize:12,color:NVY,outline:"none",fontFamily:"inherit",marginBottom:10,boxSizing:"border-box"}},
          h("option",{value:""},"Select employee"),
          emps.filter(function(e){return e.status==="active";}).map(function(e){return h("option",{key:e.id,value:String(e.id)},e.name);})
        ),
        lbl("EXPENSE TITLE"),
        h("input",{value:expTitle,onChange:function(e){setExpTitle(e.target.value);},placeholder:"e.g. Client visit travel",
          style:{width:"100%",background:CARD,border:"1px solid "+BDR,borderRadius:9,padding:"9px 11px",fontSize:12,color:NVY,outline:"none",fontFamily:"inherit",marginBottom:10,boxSizing:"border-box"}}),
        h("div",{style:{display:"flex",gap:10,marginBottom:10}},
          h("div",{style:{flex:1}},
            lbl("AMOUNT (Rs.)"),
            h("input",{type:"number",value:expAmt,onChange:function(e){setExpAmt(e.target.value);},placeholder:"0",
              style:{width:"100%",background:CARD,border:"1px solid "+BDR,borderRadius:9,padding:"9px 11px",fontSize:12,color:NVY,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}})
          ),
          h("div",{style:{flex:1}},
            lbl("CATEGORY"),
            chipSelect(expCat,function(v){setExpCat(v);},Object.entries(cats).map(function(c){return {v:c[0],l:c[1]};}),{question:"Choose the expense category"})
          )
        ),
        lbl("DESCRIPTION (OPTIONAL)"),
        h("input",{value:expDesc,onChange:function(e){setExpDesc(e.target.value);},placeholder:"Additional details",
          style:{width:"100%",background:CARD,border:"1px solid "+BDR,borderRadius:9,padding:"9px 11px",fontSize:12,color:NVY,outline:"none",fontFamily:"inherit",marginBottom:12,boxSizing:"border-box"}}),
        h("button",{onClick:addExpense,
          style:{width:"100%",background:NVY,border:"none",borderRadius:10,padding:"11px",fontSize:12,fontWeight:700,color:CARD,cursor:"pointer"}},
          "Save Expense Record")
      ):null,

      // Expense list
      allExp.length===0?h("div",{style:{textAlign:"center",padding:"32px 0",color:GRY}},
        ic("receipt",GRY,36),
        h("div",{style:{fontSize:13,marginTop:10,fontWeight:600,color:NVY}},"No expense records yet"),
        h("div",{style:{fontSize:11,color:GRY,marginTop:4}},"Tap + Add Expense to record a reimbursement")
      ):
      allExp.map(function(ex){
        var cat=cats[ex.category]||ex.category||"Other";
        var dt=ex.createdAt?new Date(ex.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}):"";
        return h("div",{key:ex.id,style:{background:CARD,borderRadius:12,padding:"11px 13px",marginBottom:8,border:"1px solid "+BDR}},
          h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}},
            h("div",{style:{flex:1,minWidth:0}},
              h("div",{style:{fontSize:13,fontWeight:700,color:NVY,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}},ex.title),
              h("div",{style:{fontSize:10,color:GRY,marginTop:2}},ex.employeeName+" — "+cat+(dt?" — "+dt:""))
            ),
            h("div",{style:{display:"flex",alignItems:"center",gap:8,flexShrink:0}},
              h("div",{style:{fontSize:14,fontWeight:800,color:NVY}},fmt(ex.amount||0)),
              h("button",{onClick:function(){deleteExpense(ex.id);},
                style:{background:RED+"10",border:"1px solid "+RED+"22",borderRadius:7,width:26,height:26,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}},
                ic("delete",RED,13))
            )
          ),
          ex.description?h("div",{style:{fontSize:10,color:GRY,fontStyle:"italic"}},ex.description):null
        );
      })
    );
  }

  function renderAttendanceReport(){
    var today2=new Date();
    var todayStr=today2.getFullYear()+"-"+String(today2.getMonth()+1).padStart(2,"0")+"-"+String(today2.getDate()).padStart(2,"0");
    var rng=["day","week","month","year"].indexOf(attRptRange)>=0?attRptRange:"day";

    // ── Build date list ──
    function buildDates(){
      var dates=[],label="";
      if(rng==="day"){
        return {dates:[todayStr],label:"Today  —  "+today2.toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long",year:"numeric"}),single:true};
      } else if(rng==="week"){
        var s=new Date(today2);s.setDate(today2.getDate()-today2.getDay()+1);
        var e=new Date(s);e.setDate(s.getDate()+6);
        label="This Week  ("+s.toLocaleDateString("en-IN",{day:"numeric",month:"short"})+" – "+e.toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})+")";
        for(var d2=new Date(s);d2<=e&&d2<=today2;d2.setDate(d2.getDate()+1))
          dates.push(d2.getFullYear()+"-"+String(d2.getMonth()+1).padStart(2,"0")+"-"+String(d2.getDate()).padStart(2,"0"));
      } else if(rng==="month"){
        label=MOS[curM]+" "+curY;
        var dm=new Date(curY,curM+1,0).getDate();
        for(var di=1;di<=dm;di++){
          var ds=curY+"-"+String(curM+1).padStart(2,"0")+"-"+String(di).padStart(2,"0");
          if(ds<=todayStr)dates.push(ds);
        }
      } else {
        label="Year "+curY;
        for(var mo=0;mo<12;mo++){
          var dm2=new Date(curY,mo+1,0).getDate();
          for(var di2=1;di2<=dm2;di2++){
            var ds2=curY+"-"+String(mo+1).padStart(2,"0")+"-"+String(di2).padStart(2,"0");
            if(ds2<=todayStr)dates.push(ds2);
          }
        }
      }
      return {dates:dates,label:label,single:false};
    }

    var range=buildDates();
    var totalEmps=actEmps.length;
    if(totalEmps===0)return h("div",{style:{textAlign:"center",padding:32,color:GRY,fontSize:13}},"No active employees.");

    // ── Working days = dates NOT marked as holiday for all employees ──
    function isHoliday(ds){
      if(actEmps.length===0)return false;
      return actEmps.every(function(e){return att[ds+"_"+e.id]==="holiday";});
    }
    var workingDates=range.single?range.dates:range.dates.filter(function(ds){return !isHoliday(ds);});
    var totalWorkingDays=workingDates.length;
    var holidayDays=range.dates.length-totalWorkingDays;
    var holidayPct=range.dates.length>0?Math.round(holidayDays*100/range.dates.length):0;

    // ── Per-employee stats (only over working days) ──
    var empStats=actEmps.map(function(emp){
      var p=0,a=0,hd=0,l=0,u=0;
      workingDates.forEach(function(ds){
        var v=att[ds+"_"+emp.id]||"unmarked";
        if(v==="present")p++;
        else if(v==="absent")a++;
        else if(v==="half")hd++;
        else if(v==="paid"||v==="unpaid")l++;
        else u++;
      });
      var attRate=totalWorkingDays>0?Math.round((p+hd*0.5)*100/totalWorkingDays):0;
      return {id:emp.id,name:emp.name,dept:emp.dept||"General",p:p,a:a,h:hd,l:l,u:u,attRate:attRate};
    });

    // ── Today groupings ──
    var gr_present=empStats.filter(function(e){return e.p>0;});
    var gr_absent=empStats.filter(function(e){return e.a>0;});
    var gr_half=empStats.filter(function(e){return e.h>0;});
    var gr_leave=empStats.filter(function(e){return e.l>0;});
    var gr_unmarked=empStats.filter(function(e){return e.p===0&&e.a===0&&e.h===0&&e.l===0;});

    // ── Multi-day ──
    var sorted_absent=empStats.filter(function(e){return e.a>0;}).sort(function(a,b){return b.a-a.a;});
    var sorted_present=empStats.filter(function(e){return e.p>0;}).sort(function(a,b){return b.p-a.p;});
    var sorted_low=empStats.filter(function(e){return e.attRate<80&&totalWorkingDays>2;}).sort(function(a,b){return a.attRate-b.attRate;});

    // ── Overall attendance rate (present + half*0.5 out of working emp-days) ──
    var totPresent=empStats.reduce(function(s,e){return s+e.p;},0);
    var totAbsent=empStats.reduce(function(s,e){return s+e.a;},0);
    var totHalf=empStats.reduce(function(s,e){return s+e.h;},0);
    var totLeave=empStats.reduce(function(s,e){return s+e.l;},0);
    var totalEmpWorkingDays=totalWorkingDays*totalEmps;
    var overallRate=totalEmpWorkingDays>0?Math.round((totPresent+totHalf*0.5)*100/totalEmpWorkingDays):0;

    // For today: rate = present / total employees
    var todayRate=totalEmps>0?Math.round(gr_present.length*100/totalEmps):0;
    var displayRate=range.single?todayRate:overallRate;
    var rateColor=displayRate>=95?"#10B981":displayRate>=80?AMB:RED;

    // ── Big Donut ──
    function bigDonut(rate,color){
      var r=52,cx=70,cy=70,circ=2*Math.PI*r;
      var dash=circ*rate/100;
      var bg=circ*(1-rate/100);
      return h("svg",{width:140,height:140,viewBox:"0 0 140 140"},
        h("circle",{cx:cx,cy:cy,r:r,fill:"none",stroke:BDR,strokeWidth:12}),
        rate>0?h("circle",{cx:cx,cy:cy,r:r,fill:"none",stroke:color,strokeWidth:12,
          strokeDasharray:dash+" "+bg,
          strokeDashoffset:circ/4,strokeLinecap:"round"}):null
      );
    }

    function empRow(e,badge,badgeColor,sub){
      return h("div",{key:e.id,style:{display:"flex",alignItems:"center",gap:9,padding:"7px 0",borderBottom:"1px solid "+BDR}},
        h("div",{style:{width:30,height:30,borderRadius:"50%",background:NVY+"15",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:NVY,flexShrink:0}},
          (e.name||"?").charAt(0).toUpperCase()),
        h("div",{style:{flex:1,minWidth:0}},
          h("div",{style:{fontSize:12,fontWeight:600,color:NVY,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}},e.name),
          h("div",{style:{fontSize:10,color:GRY}},e.dept+(sub?" — "+sub:""))
        ),
        h("div",{style:{fontSize:11,fontWeight:700,color:badgeColor,background:badgeColor+"12",borderRadius:8,padding:"2px 9px",flexShrink:0}},badge)
      );
    }

    function section(title,icon,color,rows,badgeFn,subFn){
      if(!rows||rows.length===0)return null;
      return h("div",{style:{background:CARD,borderRadius:14,padding:"12px 14px",marginBottom:10,border:"1px solid "+BDR}},
        h("div",{style:{display:"flex",alignItems:"center",gap:6,marginBottom:8,paddingBottom:8,borderBottom:"1px solid "+BDR}},
          ic(icon,color,15),
          h("div",{style:{fontSize:12,fontWeight:700,color:NVY}},title),
          h("div",{style:{marginLeft:"auto",background:color+"12",borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:700,color:color}},rows.length)
        ),
        rows.slice(0,10).map(function(e){return empRow(e,badgeFn(e),color,subFn?subFn(e):null);}),
        rows.length>10?h("div",{style:{textAlign:"center",padding:"5px 0",fontSize:11,color:GRY}},"+"+( rows.length-10)+" more"):null
      );
    }

    function shareWA(){
      var num=(waOfficial||"").replace(/[^0-9]/g,"");
      if(!num){showT("Set higher official WhatsApp number in Settings > Account","err");return;}
      var lines=[
        (org.name||"Company")+" — Attendance Report",
        range.label,
        "Total Employees: "+totalEmps,
        "Working Days: "+totalWorkingDays+(holidayDays>0?"  |  Holidays: "+holidayDays+"  ("+holidayPct+"%)":""),
        "Overall Attendance Rate: "+displayRate+"%",
        "---"
      ];
      if(range.single){
        lines.push("Present: "+gr_present.length+" / "+totalEmps);
        lines.push("Absent: "+gr_absent.length+" / "+totalEmps);
        if(gr_half.length)lines.push("Half Day: "+gr_half.length);
        if(gr_leave.length)lines.push("On Leave: "+gr_leave.length);
        if(gr_unmarked.length)lines.push("Not Marked: "+gr_unmarked.length);
        if(gr_absent.length)lines.push("Absent: "+gr_absent.map(function(e){return e.name;}).join(", "));
      } else {
        lines.push("Total Present Days: "+totPresent);
        lines.push("Total Absent Days: "+totAbsent);
        if(totLeave)lines.push("Leave Days: "+totLeave);
        if(sorted_absent.length)lines.push("Highest Absence:"+sorted_absent.slice(0,5).map(function(e){return " "+e.name+" ("+e.a+"d)";}));
        if(sorted_low.length)lines.push("Below 80%: "+sorted_low.map(function(e){return e.name+" ("+e.attRate+"%)";}).join(", "));
      }
      lines.push("---");
      lines.push("Sent via Admin HR");
      window.open("https://wa.me/"+num+"?text="+encodeURIComponent(lines.join("\n")),"_blank");
    }

    return h("div",{className:"fd"},

      // ── Range tabs ──
      h("div",{style:{display:"flex",background:SFT,borderRadius:10,padding:3,marginBottom:14,gap:3}},
        [["day","Today"],["week","Week"],["month","Month"],["year","Year"]].map(function(item){
          var on=rng===item[0];
          return h("button",{key:item[0],onClick:function(){setAttRptRange(item[0]);},
            style:{flex:1,background:on?CARD:"transparent",border:on?"1px solid "+BDR:"none",
              borderRadius:8,padding:"7px 4px",fontSize:11,fontWeight:on?700:500,
              color:on?NVY:GRY,cursor:"pointer"}},item[1]);
        })
      ),

      // ── Big Donut + Summary ──
      h("div",{style:{background:CARD,borderRadius:16,border:"1px solid "+BDR,padding:"16px 14px",marginBottom:12,display:"flex",alignItems:"center",gap:14}},
        // Donut
        h("div",{style:{position:"relative",flexShrink:0}},
          bigDonut(displayRate,rateColor),
          h("div",{style:{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}},
            h("div",{style:{fontSize:26,fontWeight:900,color:rateColor,letterSpacing:-1}},displayRate+"%"),
            h("div",{style:{fontSize:9,color:GRY,fontWeight:600,letterSpacing:.5}},"ATTENDANCE")
          )
        ),
        // Right side stats
        h("div",{style:{flex:1,minWidth:0}},
          h("div",{style:{fontSize:10,color:GRY,fontWeight:600,marginBottom:6}},range.label),
          // Stats grid
          h("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px 10px"}},
            h("div",null,
              h("div",{style:{fontSize:16,fontWeight:800,color:"#10B981"}},range.single?gr_present.length:totPresent),
              h("div",{style:{fontSize:9,color:GRY}},range.single?"Present":"Present Days")
            ),
            h("div",null,
              h("div",{style:{fontSize:16,fontWeight:800,color:RED}},range.single?gr_absent.length:totAbsent),
              h("div",{style:{fontSize:9,color:GRY}},range.single?"Absent":"Absent Days")
            ),
            h("div",null,
              h("div",{style:{fontSize:16,fontWeight:800,color:AMB}},range.single?gr_half.length:totHalf),
              h("div",{style:{fontSize:9,color:GRY}},"Half Day")
            ),
            h("div",null,
              h("div",{style:{fontSize:16,fontWeight:800,color:"#8B5CF6"}},range.single?gr_leave.length:totLeave),
              h("div",{style:{fontSize:9,color:GRY}},"On Leave")
            )
          ),
          // Working days + holidays note
          h("div",{style:{marginTop:8,padding:"5px 8px",background:SFT,borderRadius:8,fontSize:10,color:GRY}},
            "Working days: "+totalWorkingDays+
            (holidayDays>0?"  |  Holidays: "+holidayDays+" ("+holidayPct+"%)":"")+
            (range.single?"  |  Total: "+totalEmps+" emp":"")
          )
        )
      ),

      // ── Low attendance alert ──
      sorted_low.length>0?h("div",{style:{background:RED+"08",borderRadius:12,padding:"10px 14px",marginBottom:10,border:"1px solid "+RED+"22"}},
        h("div",{style:{fontSize:11,fontWeight:700,color:RED,marginBottom:6,display:"flex",alignItems:"center",gap:5}},
          ic("warning",RED,14),"Attendance Concern — Below 80% (based on working days)"
        ),
        sorted_low.map(function(e){
          return h("div",{key:e.id,style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 0",borderBottom:"1px solid "+RED+"15",fontSize:11}},
            h("span",{style:{color:NVY,fontWeight:600}},e.name),
            h("span",{style:{color:RED,fontWeight:700}},e.attRate+"% ("+e.a+"d absent / "+totalWorkingDays+"d working)")
          );
        })
      ):null,

      // ── Employee breakdown ──
      range.single?(
        h("div",null,
          section("Present","task_alt","#10B981",gr_present,function(){return "Present";},null),
          section("Absent","cancel",RED,gr_absent,function(){return "Absent";},null),
          gr_half.length?section("Half Day","schedule",AMB,gr_half,function(){return "Half Day";},null):null,
          gr_leave.length?section("On Leave","event_busy","#8B5CF6",gr_leave,function(){return "Leave";},null):null,
          gr_unmarked.length>0?h("div",{style:{background:CARD,borderRadius:14,padding:"12px 14px",marginBottom:10,border:"1px solid "+BDR}},
            h("div",{style:{display:"flex",alignItems:"center",gap:6,marginBottom:8,paddingBottom:8,borderBottom:"1px solid "+BDR}},
              ic("help",GRY,14),
              h("div",{style:{fontSize:12,fontWeight:700,color:NVY}},"Not Marked Yet"),
              h("div",{style:{marginLeft:"auto",background:GRY+"12",borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:700,color:GRY}},gr_unmarked.length)
            ),
            gr_unmarked.map(function(e){return empRow(e,"Unmarked",GRY,e.dept);})
          ):null
        )
      ):(
        h("div",null,
          section("Best Attendance","workspace_premium","#10B981",sorted_present,
            function(e){return e.p+"d present";},
            function(e){return e.attRate+"% rate";}
          ),
          section("Highest Absence","cancel",RED,sorted_absent,
            function(e){return e.a+"d absent";},
            function(e){return e.attRate+"% rate  |  "+totalWorkingDays+"d working";}
          )
        )
      ),

      // ── WA Share — disabled for now (Higher Official WhatsApp number feature removed) ──
      null
    );
  }


  function getMonthlyLoanDeduction(empId){
    var a=(loans||[]).find(function(l){return (l.employeeId===empId||l.employee_id===empId)&&l.status==="active";});
    return a?(a.monthlyDeduction||a.monthly_deduction||0):0;
  }

  function renderLoanSection(emp){
    if(!emp)return null;
    var empId=String(emp.id);
    var allRec=(loans||[]).filter(function(l){return String(l.employeeId)===empId||String(l.employee_id)===empId;});
    var activeRec=allRec.filter(function(l){return l.status==="active";});
    var closedRec=allRec.filter(function(l){return l.status!=="active";}).sort(function(a,b){return (b.date||"").localeCompare(a.date||"");});

    var LTYPES={personal:"Personal Loan",emergency:"Emergency Loan",medical:"Medical Loan",vehicle:"Vehicle Loan",education:"Education Loan",office:"Office Loan"};
    var ATYPES={salary:"Salary Advance",festival:"Festival Advance",travel:"Travel Advance",other:"Other Advance"};

    function getLabel(l){
      if(l.kind==="advance")return ATYPES[l.advanceType||l.loanType]||"Advance";
      return LTYPES[l.loanType]||"Loan";
    }

    function removeLoan(l){
      if(!window.confirm("Remove this record? It will be marked as Cancelled and kept in history."))return;
      setLoans(function(p){return (p||[]).map(function(r){
        return r.id===l.id?Object.assign({},r,{status:"cancelled",closedDate:new Date().toISOString().split("T")[0]}):r;
      });});
      _sb.from("loans").update({status:"cancelled",closed_date:new Date().toISOString().split("T")[0]}).eq("id",String(l.id)).then(function(r){if(r&&r.error)showT("Cancel failed to save: "+r.error.message,"err");});
      showT("Record cancelled and moved to history");
    }

    function settleExternal(l){
      if(!window.confirm("Mark this as settled externally (paid outside salary)?"))return;
      var today=new Date().toISOString().split("T")[0];
      setLoans(function(p){return (p||[]).map(function(r){
        return r.id===l.id?Object.assign({},r,{status:"settled",closedDate:today}):r;
      });});
      _sb.from("loans").update({status:"settled",closed_date:today}).eq("id",String(l.id)).then(function(r){if(r&&r.error)showT("Settle failed to save: "+r.error.message,"err");});
      showT("Marked as settled");
    }

    function activeCard(l){
      var isAdv=l.kind==="advance";
      var clr=isAdv?AMB:"#2563EB";
      var emi=l.emi||l.monthlyDeduction||l.monthly_deduction||0;
      var tenure=l.tenure||0;
      var paid=l.paidInstallments||0;
      var balance=tenure>0?Math.max(0,Math.round((tenure-paid)*emi)):Math.max(0,(l.amount||0)-(l.paidAmount||l.paid_amount||0));
      var pct=tenure>0?Math.round((paid/tenure)*100):0;
      var monthsLeft=tenure>0?Math.max(0,tenure-paid):null;
      var totalInterest=(!isAdv&&l.interestRate>0&&tenure&&emi)?Math.round(emi*tenure-l.amount):0;
      var startFmt=(function(){if(!l.startDate)return"—";var p=l.startDate.split("-");if(p.length<2)return l.startDate;var ms=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];return ms[Number(p[1])-1]+" "+p[0];})();
      var endFmt=(function(){
        if(!l.startDate||!tenure)return "—";
        var d=new Date(l.startDate+"T00:00:00");d.setMonth(d.getMonth()+tenure-1);
        return ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getMonth()]+" "+d.getFullYear();
      })();

      return h("div",{key:l.id,style:{background:CARD,borderRadius:12,border:"1px solid "+BDR,marginBottom:8,overflow:"hidden"}},
        /* Color header */
        h("div",{style:{background:clr,padding:"8px 12px",display:"flex",justifyContent:"space-between",alignItems:"center"}},
          h("div",{style:{display:"flex",alignItems:"center",gap:6}},
            ic(isAdv?"account_balance_wallet":"account_balance","rgba(255,255,255,0.9)",14),
            h("span",{style:{fontSize:12,fontWeight:800,color:"#fff"}},getLabel(l)),
            l.purpose?h("span",{style:{fontSize:9,color:"rgba(255,255,255,0.6)"}},"· "+l.purpose):null
          ),
          h("button",{onClick:function(){removeLoan(l);},
            style:{background:"rgba(255,255,255,0.15)",border:"none",borderRadius:6,padding:"2px 8px",fontSize:9,fontWeight:700,color:"rgba(255,255,255,0.85)",cursor:"pointer"}},
            "Remove")
        ),
        h("div",{style:{padding:"10px 12px"}},
          /* Progress bar */
          tenure>0?h("div",{style:{marginBottom:10}},
            h("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:3}},
              h("span",{style:{fontSize:9,color:GRY}},paid+" of "+tenure+" installments"),
              h("span",{style:{fontSize:9,fontWeight:700,color:clr}},pct+"%")
            ),
            h("div",{style:{background:BDR,borderRadius:99,height:5,overflow:"hidden"}},
              h("div",{style:{width:pct+"%",height:"100%",background:clr,borderRadius:99}}))
          ):null,
          /* Key stats */
          h("div",{style:{display:"flex",gap:8,marginBottom:8}},
            h("div",{style:{flex:1,background:SFT,borderRadius:9,padding:"8px",textAlign:"center"}},
              h("div",{style:{fontSize:8,color:GRY,marginBottom:2}},"OUTSTANDING"),
              h("div",{style:{fontSize:16,fontWeight:900,color:balance>0?RED:GRN}},fmt(balance))
            ),
            h("div",{style:{flex:1,background:SFT,borderRadius:9,padding:"8px",textAlign:"center"}},
              h("div",{style:{fontSize:8,color:GRY,marginBottom:2}},"EMI / MONTH"),
              h("div",{style:{fontSize:16,fontWeight:800,color:NVY}},fmt(emi))
            ),
            monthsLeft!==null?h("div",{style:{flex:1,background:SFT,borderRadius:9,padding:"8px",textAlign:"center"}},
              h("div",{style:{fontSize:8,color:GRY,marginBottom:2}},"MONTHS LEFT"),
              h("div",{style:{fontSize:16,fontWeight:800,color:monthsLeft<=3&&monthsLeft>0?RED:NVY}},
                monthsLeft===0?"Done":monthsLeft+" mo")
            ):null
          ),
          /* Details row */
          h("div",{style:{background:SFT,borderRadius:8,padding:"7px 10px",marginBottom:!isAdv&&l.interestRate>0?6:8}},
            h("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:2}},
              h("span",{style:{fontSize:9,color:GRY}},"Principal"),
              h("span",{style:{fontSize:9,fontWeight:700,color:NVY}},fmt(l.amount||0))
            ),
            tenure>0?h("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:2}},
              h("span",{style:{fontSize:9,color:GRY}},"Period"),
              h("span",{style:{fontSize:9,fontWeight:700,color:NVY}},startFmt+" → "+endFmt)
            ):null,
            l.endDate?h("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:2}},
              h("span",{style:{fontSize:9,color:GRY}},"Last Deduction"),
              h("span",{style:{fontSize:9,fontWeight:700,color:RED},
              },new Date(l.endDate+"T00:00:00").toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"}))
            ):null,
            !isAdv&&l.interestRate>0?h("div",{style:{display:"flex",justifyContent:"space-between"}},
              h("span",{style:{fontSize:9,color:GRY}},"Interest rate"),
              h("span",{style:{fontSize:9,fontWeight:700,color:RED}},l.interestRate+"% p.a.")
            ):null
          ),
          /* Interest summary for loans */
          !isAdv&&l.interestRate>0?h("div",{style:{background:RED+"08",borderRadius:8,padding:"6px 10px",marginBottom:8,border:"1px solid "+RED+"15"}},
            h("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:2}},
              h("span",{style:{fontSize:9,color:GRY}},"Total interest"),
              h("span",{style:{fontSize:9,fontWeight:700,color:RED}},fmt(totalInterest))
            ),
            h("div",{style:{display:"flex",justifyContent:"space-between"}},
              h("span",{style:{fontSize:9,color:GRY}},"Total payable"),
              h("span",{style:{fontSize:9,fontWeight:700,color:NVY}},fmt(Math.round(emi*tenure)))
            )
          ):null,
          /* Auto deduct note + Settle external option */
          h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"}},
            h("div",{style:{fontSize:9,color:GRN,display:"flex",alignItems:"center",gap:3}},
              ic("check_circle",GRN,9),"Auto-deducted from salary"
            ),
            h("button",{onClick:function(){settleExternal(l);},
              style:{background:SFT,border:"1px solid "+BDR,borderRadius:6,padding:"3px 8px",fontSize:9,fontWeight:600,color:GRY,cursor:"pointer"}},
              "Mark Settled")
          )
        )
      );
    }

    return h("div",null,
      /* Centered Add button */
      h("div",{style:{textAlign:"center",marginBottom:10}},
        h("button",{onClick:function(){setShowLoanForm(!showLoanForm);},
          style:{background:showLoanForm?SFT:"#2563EB",border:showLoanForm?"1px solid "+BDR:"none",borderRadius:8,padding:"7px 20px",fontSize:12,fontWeight:700,color:showLoanForm?NVY:"#fff",cursor:"pointer"}},
          showLoanForm?"\u2715 Cancel":"+ Add Loan / Advance")
      ),

      /* Add form */
      showLoanForm?h("div",{style:{background:SFT,borderRadius:12,padding:12,border:"1px solid "+BDR,marginBottom:10}},
        /* Loan / Advance toggle */
        h("div",{style:{display:"flex",background:CARD,borderRadius:9,padding:3,marginBottom:10,gap:3}},
          h("button",{onClick:function(){setLoanKind("loan");},style:{flex:1,background:loanKind==="loan"?CARD:"transparent",border:loanKind==="loan"?"1px solid "+BDR:"1px solid transparent",borderRadius:7,padding:"8px",fontSize:12,fontWeight:700,color:loanKind==="loan"?NVY:GRY,boxShadow:loanKind==="loan"?T.SHADOW:"none",cursor:"pointer"}},"Loan"),
          h("button",{onClick:function(){setLoanKind("advance");},style:{flex:1,background:loanKind==="advance"?CARD:"transparent",border:loanKind==="advance"?"1px solid "+BDR:"1px solid transparent",borderRadius:7,padding:"8px",fontSize:12,fontWeight:700,color:loanKind==="advance"?NVY:GRY,boxShadow:loanKind==="advance"?T.SHADOW:"none",cursor:"pointer"}},"Advance")
        ),
        /* Type */
        lbl("TYPE"),
        h("div",{style:{marginBottom:8}},chipSelect(loanType,function(v){setLoanType(v);},Object.entries(loanKind==="loan"?LTYPES:ATYPES).map(function(t){return {v:t[0],l:t[1]};}),{question:"Choose the type"})),
        /* Amount + Date */
        h("div",{style:{display:"flex",gap:8,marginBottom:8}},
          h("div",{style:{flex:1}},lbl("AMOUNT"),
            h("input",{type:"number",value:loanAmt,onChange:function(e){setLoanAmt(e.target.value);},placeholder:"e.g. 10000",style:{width:"100%",background:CARD,border:"1px solid "+BDR,borderRadius:8,padding:"9px 10px",fontSize:12,color:NVY,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}})
          ),
          h("div",{style:{flex:1}},lbl("START DATE"),
            datePick(loanDate,function(v){setLoanDate(v);},{question:"Loan/advance date",wrapStyle:{marginBottom:0}})
          )
        ),
        /* Tenure + Interest (loan only) */
        h("div",{style:{display:"flex",gap:8,marginBottom:8}},
          h("div",{style:{flex:1}},lbl("TENURE (MONTHS)"),
            h("input",{type:"number",value:loanMon,onChange:function(e){setLoanMon(e.target.value);},placeholder:"e.g. 12",style:{width:"100%",background:CARD,border:"1px solid "+BDR,borderRadius:8,padding:"9px 10px",fontSize:12,color:NVY,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}})
          ),
          loanKind==="loan"?h("div",{style:{flex:1}},lbl("INTEREST % P.A. (0 = NONE)"),
            h("input",{type:"number",value:loanInterest,onChange:function(e){setLoanInterest(e.target.value);},placeholder:"0",style:{width:"100%",background:CARD,border:"1px solid "+BDR,borderRadius:8,padding:"9px 10px",fontSize:12,color:NVY,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}})
          ):null
        ),
        /* Live EMI preview */
        loanAmt&&loanMon?(function(){
          var p=Number(loanAmt)||0,n=Number(loanMon)||0;
          var r=loanKind==="loan"?Number(loanInterest||0):0;
          var emi=calcEMI(p,r,n);
          var total=Math.round(emi*n);
          var interest=total-p;
          var endStr=(function(){
            if(!loanDate||!n)return "";
            var d=new Date(loanDate+"T00:00:00");d.setMonth(d.getMonth()+n-1);
            return ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getMonth()]+" "+d.getFullYear();
          })();
          return h("div",{style:{background:"#2563EB10",border:"1px solid #2563EB25",borderRadius:9,padding:"10px 12px",marginBottom:8}},
            h("div",{style:{fontSize:9,fontWeight:700,color:"#2563EB",letterSpacing:.5,marginBottom:6}},"EMI PREVIEW"),
            h("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:3}},
              h("span",{style:{fontSize:11,color:GRY}},"Monthly EMI"),
              h("span",{style:{fontSize:13,fontWeight:900,color:"#2563EB"}},fmt(emi)+"/mo")
            ),
            r>0?h("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:3}},
              h("span",{style:{fontSize:10,color:GRY}},"Total interest"),
              h("span",{style:{fontSize:10,fontWeight:700,color:RED}},fmt(interest))
            ):null,
            h("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:endStr?3:0}},
              h("span",{style:{fontSize:10,color:GRY}},"Total payable"),
              h("span",{style:{fontSize:10,fontWeight:700,color:NVY}},fmt(total))
            ),
            endStr?h("div",{style:{display:"flex",justifyContent:"space-between"}},
              h("span",{style:{fontSize:10,color:GRY}},"Last deduction"),
              h("span",{style:{fontSize:10,fontWeight:700,color:NVY}},endStr)
            ):null
          );
        })():null,
        /* Purpose */
        lbl("PURPOSE (OPTIONAL)"),
        h("input",{type:"text",value:loanPurpose,onChange:function(e){setLoanPurpose(e.target.value);},placeholder:loanKind==="loan"?"e.g. Medical emergency":"e.g. Diwali advance",style:{width:"100%",background:CARD,border:"1px solid "+BDR,borderRadius:8,padding:"9px 10px",fontSize:12,color:NVY,outline:"none",fontFamily:"inherit",marginBottom:10,boxSizing:"border-box"}}),
        /* Save */
        h("button",{onClick:function(){
          if(!loanAmt||!loanMon||!loanDate)return showT("Enter amount, tenure and start date","err");
          var p=Number(loanAmt),n=Number(loanMon);
          var r=loanKind==="loan"?Number(loanInterest||0):0;
          var emi=calcEMI(p,r,n);
          var endDate=(function(){if(!loanDate)return "";var parts=loanDate.split("-");var d=new Date(Number(parts[0]),Number(parts[1])-1+n-1,1);return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-01";}());
          var rec={
            id:Date.now(),employerEmail:gUser.email,
            employeeId:empId,employee_id:empId,employeeName:emp.name,
            amount:p,kind:loanKind,
            loanType:loanKind==="loan"?loanType:"",
            advanceType:loanKind==="advance"?loanType:"",
            interestRate:r,tenure:n,emi:emi,
            startDate:loanDate,endDate:endDate,
            paidInstallments:0,totalPaid:0,
            status:"active",date:loanDate,purpose:loanPurpose,
            monthlyDeduction:emi,monthly_deduction:emi,
            paidAmount:0,paid_amount:0
          };
          setLoans(function(p2){return [rec].concat(p2||[]);});
          _sb.from("loans").insert({
            id:String(rec.id),employer_email:gUser.email,
            employee_id:empId,employee_name:emp.name,
            amount:p,kind:loanKind,loan_type:rec.loanType,advance_type:rec.advanceType,
            interest_rate:r,tenure:n,emi:emi,
            start_date:loanDate||null,end_date:endDate||null,
            paid_installments:0,total_paid:0,
            monthly_deduction:emi,paid_amount:0,
            status:"active",date:loanDate||null,purpose:loanPurpose
          }).then(function(r){if(r&&r.error){showT("Could not save to server: "+r.error.message,"err");setLoans(function(p2){return (p2||[]).filter(function(x){return x.id!==rec.id;});});}});
          setLoanAmt("");setLoanMon("");setLoanInterest("");setLoanDate("");setLoanPurpose("");setShowLoanForm(false);
          showT((loanKind==="loan"?"Loan":"Advance")+" added — EMI: "+fmt(emi)+"/mo");
        },style:{width:"100%",background:NVY,border:"none",borderRadius:9,padding:"11px",fontSize:12,fontWeight:700,color:CARD,cursor:"pointer"}},
          "Save "+(loanKind==="loan"?"Loan":"Advance"))
      ):null,

      /* Active records */
      activeRec.length===0&&!showLoanForm?h("div",{style:{fontSize:10,color:GRY,textAlign:"center",padding:"8px 0"}},"No active loans or advances"):null,
      activeRec.map(function(l){return activeCard(l);}),

      /* History */
      closedRec.length>0?h("div",{style:{marginTop:8}},
        h("div",{style:{fontSize:9,fontWeight:700,color:GRY,letterSpacing:1,marginBottom:6}},"HISTORY"),
        closedRec.map(function(l,i){
          var statusColor=l.status==="settled"||l.status==="closed"||l.status==="cleared"?GRN:l.status==="cancelled"?RED:GRY;
          var statusLabel=l.status==="settled"?"Settled":l.status==="cancelled"?"Cancelled":l.status==="cleared"?"Cleared":"Closed";
          return h("div",{key:l.id,style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderTop:"1px solid "+BDR}},
            h("div",null,
              h("div",{style:{display:"flex",alignItems:"center",gap:5,marginBottom:2}},
                h("span",{style:{fontSize:11,fontWeight:700,color:NVY}},getLabel(l)),
                h("span",{style:{fontSize:8,background:statusColor+"15",color:statusColor,borderRadius:10,padding:"1px 6px",fontWeight:700}},statusLabel)
              ),
              h("div",{style:{fontSize:9,color:GRY}},fmt(l.amount||0)+(l.tenure?" · "+l.tenure+" months":"")+(l.closedDate?" · "+new Date((l.closedDate||"")+"T00:00:00").toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}):""))
            ),
            l.interestRate>0?h("div",{style:{fontSize:9,color:GRY}},l.interestRate+"%"):null
          );
        })
      ):null
    );
  }

  // Probation completion status — used for the Confirmation Letter manual button + auto-reminder banner
  function getProbationInfo(emp){
    if(!emp||!emp.joined)return null;
    var pm=Number((policies&&policies.probation&&policies.probation.fields&&policies.probation.fields.probationMonths)||3);
    var joinDate=new Date(emp.joined+"T00:00:00");
    var endDate=new Date(joinDate);endDate.setMonth(endDate.getMonth()+pm);
    var daysLeft=Math.ceil((endDate-new Date())/86400000);
    return {endDate:endDate,probationMonths:pm,daysLeft:daysLeft,due:daysLeft<=7,overdue:daysLeft<0,confirmed:!!emp.confirmed};
  }

  function renderGratuityCard(emp){
    if(!emp||!emp.joined)return null;
    var ms=(new Date()-new Date(emp.joined));
    var totalMonths=Math.floor(ms/(1000*60*60*24*30.44));
    var years=Math.floor(totalMonths/12),months=totalMonths%12;
    var eligible=years>=5;
    // Gratuity must use the LAST DRAWN (i.e. current, revision-aware) basic salary — not whatever
    // was on the employee record at hire time. getEffectiveEmp resolves any salary revision that
    // applies as of this month, the same way the rest of the app (payroll, payslips) does.
    var nowD=new Date();
    var eEff=getEffectiveEmp(emp,nowD.getFullYear(),nowD.getMonth());
    var basic=eEff.salaryType==="fixed"?Number(eEff.fixedSalary||eEff.monthlyCTC||0):Number(eEff.basic||0);
    // Payment of Gratuity Act, 1972: a final part-year of 6 months or more rounds UP to a full year;
    // less than 6 months is dropped. (e.g. 5 years 7 months -> 6 years; 5 years 4 months -> 5 years.)
    var roundedYears=months>=6?years+1:years;
    var gratuity=eligible?Math.round(basic*15*roundedYears/26):0;
    return h("div",null,
      h("div",{style:{display:"flex",gap:8,marginBottom:10}},
        h("div",{style:{flex:1,background:SFT,borderRadius:8,padding:"7px 8px",textAlign:"center"}},h("div",{style:{fontSize:12,fontWeight:700,color:NVY}},years+"y "+months+"m"),h("div",{style:{fontSize:8,color:GRY,marginTop:1}},"SERVICE")),
        h("div",{style:{flex:1,background:SFT,borderRadius:8,padding:"7px 8px",textAlign:"center"}},h("div",{style:{fontSize:12,fontWeight:700,color:NVY}},fmt(basic)),h("div",{style:{fontSize:8,color:GRY,marginTop:1}},"BASIC (CURRENT)")),
        h("div",{style:{flex:1,background:eligible?"#8B5CF610":SFT,borderRadius:8,padding:"7px 8px",textAlign:"center",border:eligible?"1px solid #8B5CF625":"1px solid "+BDR}},h("div",{style:{fontSize:12,fontWeight:700,color:eligible?"#8B5CF6":GRY}},eligible?fmt(gratuity):"—"),h("div",{style:{fontSize:8,color:GRY,marginTop:1}},"GRATUITY"))
      ),
      !eligible?h("div",{style:{background:AMB+"10",borderRadius:10,padding:"8px 12px",border:"1px solid "+AMB+"33",fontSize:11,color:AMB}},
        "Eligible after 5 years. "+(5-years)+" year(s) remaining."
      ):h("div",{style:{background:"#8B5CF610",borderRadius:10,padding:"8px 12px",border:"1px solid #8B5CF633",fontSize:11,color:"#8B5CF6"}},
        "Eligible - Basic x15x"+roundedYears+" yrs/26 = "+fmt(gratuity)+(roundedYears!==years?" (rounded up from "+years+"y "+months+"m)":""))
    );
  }

  function generateWarningPDF(warn,emp){
    loadJsPDFGlobal(function(JsPDF){
      var doc=new JsPDF({orientation:"portrait",unit:"mm",format:"a4"});
      var W=210,mg=22,ry=18;
      var NVYC=[15,23,42],MUT=[71,85,105],RULE=[210,218,230];
      var wType=(warn.warningType||"written");
      var isShowCause=wType==="show_cause";
      var wTypeLabel=isShowCause?"Show Cause":wType.charAt(0).toUpperCase()+wType.slice(1);
      var sevColor=isShowCause?[160,40,40]:wType==="verbal"?[180,130,20]:wType==="final"?[180,30,30]:[200,90,20]; // amber / red / orange by severity

      // Letterhead — logo (if set) + org name/address/contact, matching Offer/Experience/Relieving letters
      var logoW=0;
      if(org.logo&&String(org.logo).indexOf("data:")===0){
        try{doc.setFillColor(255,255,255);doc.roundedRect(mg,ry-6,18,18,3,3,"F");doc.addImage(org.logo,"PNG",mg,ry-6,18,18,undefined,"FAST");logoW=22;}catch(e){}
      }
      doc.setFontSize(16);doc.setFont("helvetica","bold");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);doc.text(org.name||"Company",mg+logoW,ry);
      doc.setFontSize(8.5);doc.setFont("helvetica","normal");doc.setTextColor(MUT[0],MUT[1],MUT[2]);
      var addrShown=false;
      if(org.address){var addrL=org.address.split("\n")[0];doc.text(addrL,mg+logoW,ry+5.5);addrShown=true;}
      var contactLine=orgContactLine(org);
      if(contactLine)doc.text(contactLine,mg+logoW,ry+(addrShown?10:5.5));
      doc.setFontSize(9);doc.text(new Date().toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"}),W-mg,ry,{align:"right"});
      ry+=(addrShown&&contactLine?15.5:(addrShown||contactLine?11:6));doc.setDrawColor(RULE[0],RULE[1],RULE[2]);doc.setLineWidth(0.6);doc.line(mg,ry,W-mg,ry);ry+=12;

      // Title + severity tag
      doc.setFontSize(14);doc.setFont("helvetica","bold");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);doc.text(isShowCause?"SHOW CAUSE NOTICE":(wTypeLabel.toUpperCase()+" WARNING LETTER"),W/2,ry,{align:"center"});ry+=2;
      doc.setDrawColor(sevColor[0],sevColor[1],sevColor[2]);doc.setLineWidth(0.8);doc.line(W/2-26,ry+2,W/2+26,ry+2);ry+=13;

      doc.setFontSize(11);doc.setFont("helvetica","normal");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);doc.text("Dear "+(emp.name||"Employee")+",",mg,ry);ry+=9;

      var incidentDateFmt=warn.incidentDate?new Date(warn.incidentDate+"T00:00:00").toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"}):"-";
      var openBody=isShowCause
        ?"You are hereby called upon to show cause as to why disciplinary action, including but not limited to termination of employment, should not be initiated against you in respect of the conduct described below, pertaining to an incident on "+incidentDateFmt+"."
        :"This letter serves as a formal "+wType+" warning concerning an incident on "+incidentDateFmt+" that does not meet the standards of conduct expected at "+(org.name||"our organization")+".";
      doc.setFontSize(10.5);doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);
      var openLines=doc.splitTextToSize(openBody,W-mg*2);doc.text(openLines,mg,ry);ry+=openLines.length*5.5+8;

      // Employee / incident details box, matching the "TERMS OF EMPLOYMENT" table style used elsewhere
      var rows2=[["Employee",emp.name||"-"],["Employee ID",emp.eid||"-"],["Department",emp.dept||"-"],[isShowCause?"Notice Type":"Warning Type",wTypeLabel],["Incident Date",incidentDateFmt],["Date Issued",new Date().toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})]];
      doc.setFontSize(8.5);doc.setFont("helvetica","bold");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);doc.text("DETAILS",mg,ry);ry+=2;
      doc.setDrawColor(RULE[0],RULE[1],RULE[2]);doc.setLineWidth(0.4);doc.line(mg,ry+1.5,W-mg,ry+1.5);ry+=7;
      rows2.forEach(function(row){doc.setFont("helvetica","normal");doc.setTextColor(MUT[0],MUT[1],MUT[2]);doc.setFontSize(8.5);doc.text(row[0],mg,ry+3.5);doc.setFont("helvetica","bold");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);doc.text(String(row[1]),mg+85,ry+3.5);doc.setDrawColor(235,239,245);doc.setLineWidth(0.3);doc.line(mg,ry+6.5,W-mg,ry+6.5);ry+=7;});
      ry+=8;

      doc.setFontSize(8.5);doc.setFont("helvetica","bold");doc.setTextColor(sevColor[0],sevColor[1],sevColor[2]);doc.text(isShowCause?"ALLEGED MISCONDUCT":"DESCRIPTION OF INCIDENT",mg,ry);ry+=5;
      doc.setFontSize(10.5);doc.setFont("helvetica","normal");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);
      var incLines=doc.splitTextToSize(warn.incident||"-",W-mg*2);doc.text(incLines,mg,ry);ry+=incLines.length*5.5+8;

      doc.setFontSize(8.5);doc.setFont("helvetica","bold");doc.setTextColor(sevColor[0],sevColor[1],sevColor[2]);doc.text(isShowCause?"RESPONSE REQUIRED":"ACTION REQUIRED",mg,ry);ry+=5;
      doc.setFontSize(10.5);doc.setFont("helvetica","normal");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);
      var actBody=isShowCause
        ?"You are required to submit your written explanation within "+(warn.actionRequired||"7 days")+" of receipt of this notice, failing which it will be presumed that you have no explanation to offer and appropriate action will be taken without further reference to you."
        :(warn.actionRequired||"Immediate improvement in conduct is expected.");
      var actLines=doc.splitTextToSize(actBody,W-mg*2);doc.text(actLines,mg,ry);ry+=actLines.length*5.5+8;

      var closeBody=isShowCause
        ?"Please treat this notice with the seriousness it deserves and respond within the stipulated time."
        :"Please treat this matter with the seriousness it deserves. Failure to show the required improvement may result in further disciplinary action, up to and including termination of employment, in line with company policy.";
      var closeLines=doc.splitTextToSize(closeBody,W-mg*2);doc.text(closeLines,mg,ry);ry+=closeLines.length*5.5+18;

      // Signature blocks: Authorised Signatory (left) + Employee Acknowledgement (right)
      var sigY=Math.max(ry,228);
      doc.setDrawColor(180,188,202);doc.setLineWidth(0.4);
      doc.line(mg,sigY,mg+62,sigY);doc.line(W-mg-62,sigY,W-mg,sigY);
      doc.setFontSize(8.5);doc.setFont("helvetica","bold");doc.setTextColor(NVYC[0],NVYC[1],NVYC[2]);
      doc.text(authSign||"Authorised Signatory",mg,sigY+5);doc.text(emp.name||"Employee",W-mg-62,sigY+5);
      doc.setFont("helvetica","normal");doc.setTextColor(MUT[0],MUT[1],MUT[2]);
      doc.text(authPos||"Authorised Signatory",mg,sigY+9);doc.text("Employee Acknowledgement",W-mg-62,sigY+9);

      doc.setDrawColor(RULE[0],RULE[1],RULE[2]);doc.setLineWidth(0.4);doc.line(mg,283,W-mg,283);
      doc.setFontSize(7.5);doc.setTextColor(MUT[0],MUT[1],MUT[2]);doc.text((org.name||""),mg,288);doc.text("Generated by Admin HR",W-mg,288,{align:"right"});

      downloadPDF(doc.output("blob"),(isShowCause?"Show-Cause-Notice-":"Warning-")+(emp.name||"Employee").replace(/\s/g,"-")+"-"+(warn.incidentDate||"")+".pdf");
      showT((isShowCause?"Show cause notice":"Warning letter")+" downloaded");
    },function(){showT("PDF error","err");});
  }

  function renderWarningSection(emp){
    if(!emp)return null;
    var empWarnings=(warnings||[]).filter(function(w){return w.employeeId===emp.id||w.employee_id===emp.id;});
    function issueWarning(){
      if(!warnIncident||!warnDate)return showT("Fill incident details","err");
      var warn={id:Date.now(),employerEmail:gUser.email,employeeId:emp.id,employee_id:emp.id,
        employeeName:emp.name,incidentDate:warnDate,incident:warnIncident,
        actionRequired:warnAction,warningType:warnType,acknowledged:false};
      setWarnings(function(p){return [warn].concat(p||[]);});
      _sb.from("warnings").insert({id:String(warn.id),employer_email:gUser.email,employee_id:emp.id,
        employee_name:emp.name,incident_date:warnDate,incident:warnIncident,
        action_required:warnAction,warning_type:warnType,acknowledged:false}).then(function(){});
      generateWarningPDF(warn,emp);
      setShowWarnForm(false);setWarnIncident("");setWarnDate("");setWarnAction("");
      showT("Warning issued");
    }
    return h("div",null,
      h("div",{style:{textAlign:"center",marginBottom:10}},
        h("button",{onClick:function(){setShowWarnForm(!showWarnForm);},style:{background:showWarnForm?SFT:RED+"12",border:"1px solid "+RED+"33",borderRadius:8,padding:"7px 20px",fontSize:12,fontWeight:700,color:showWarnForm?GRY:RED,cursor:"pointer"}},showWarnForm?"\u2715 Cancel":"+ Issue Warning / Notice")
      ),
      showWarnForm?h("div",{style:{background:SFT,borderRadius:12,padding:12,border:"1px solid "+BDR,marginBottom:10}},
        h("div",{style:{display:"flex",gap:8,marginBottom:8}},
          h("div",{style:{flex:1}},lbl("INCIDENT DATE"),datePick(warnDate,function(v){setWarnDate(v);},{question:"Incident date"})),
          h("div",{style:{flex:1}},lbl("TYPE"),chipSelect(warnType,function(v){setWarnType(v);},[{v:"verbal",l:"Verbal"},{v:"written",l:"Written"},{v:"final",l:"Final"},{v:"show_cause",l:"Show Cause"}],{question:"Choose the notice type"}))
        ),
        lbl(warnType==="show_cause"?"ALLEGED MISCONDUCT":"INCIDENT DESCRIPTION"),
        h("textarea",{value:warnIncident,onChange:function(e){setWarnIncident(e.target.value);},placeholder:warnType==="show_cause"?"Describe the conduct/allegation requiring explanation...":"Describe the incident...",rows:3,style:{width:"100%",background:CARD,border:"1px solid "+BDR,borderRadius:8,padding:"9px 11px",fontSize:12,color:NVY,outline:"none",fontFamily:"inherit",resize:"vertical",marginBottom:8,boxSizing:"border-box"}}),
        lbl(warnType==="show_cause"?"RESPONSE DEADLINE":"ACTION REQUIRED"),
        h("input",{value:warnAction,onChange:function(e){setWarnAction(e.target.value);},placeholder:warnType==="show_cause"?"e.g. 7 days from receipt of this notice":"e.g. Improve punctuality",style:{width:"100%",background:CARD,border:"1px solid "+BDR,borderRadius:8,padding:"9px 11px",fontSize:12,color:NVY,outline:"none",fontFamily:"inherit",marginBottom:10,boxSizing:"border-box"}}),
        h("button",{onClick:issueWarning,style:{width:"100%",background:RED,border:"none",borderRadius:9,padding:"10px",fontSize:12,fontWeight:700,color:"#fff",cursor:"pointer"}},warnType==="show_cause"?"Issue Show Cause Notice & Download PDF":"Issue Warning & Download PDF")
      ):null,
      empWarnings.length>0?h("div",null,
        empWarnings.map(function(w){return h("div",{key:w.id,style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderTop:"1px solid "+BDR}},
          h("div",null,h("div",{style:{fontSize:11,fontWeight:600,color:NVY}},w.warningType==="show_cause"?"Show Cause Notice":(w.warningType||"Written").charAt(0).toUpperCase()+(w.warningType||"Written").slice(1)+" Warning"),h("div",{style:{fontSize:10,color:GRY}},w.incidentDate)),
          h("button",{onClick:function(){generateWarningPDF(w,emp);},style:{background:SFT,border:"1px solid "+BDR,borderRadius:7,padding:"4px 10px",fontSize:10,fontWeight:600,color:NVY,cursor:"pointer",display:"flex",alignItems:"center",gap:4}},ic("download",NVY,11),"PDF")
        );})
      ):null
    );
  }

  function renderAnnualStatement(){
    var curFY=new Date().getMonth()>=3?new Date().getFullYear():new Date().getFullYear()-1;
    function generate(emp,fy){
      try{
        var doc=new window.jspdf.jsPDF();
        doc.setFontSize(13);doc.setFont(undefined,"bold");doc.text(org.name||"Company",105,16,{align:"center"});
        doc.setFontSize(10);doc.text("ANNUAL SALARY STATEMENT - FY "+fy+"-"+(fy+1),105,23,{align:"center"});
        doc.setDrawColor(180,195,215);doc.setLineWidth(0.3);doc.line(10,27,200,27);
        doc.setFontSize(9);doc.setFont(undefined,"normal");
        doc.text("Employee: "+emp.name,12,33);doc.text("ID: "+(emp.eid||"-"),80,33);
        doc.text("Dept: "+(emp.dept||"-"),12,39);doc.text("Role: "+(emp.role||"-"),80,39);
        doc.line(10,43,200,43);
        var cols=["Month","Gross","Absent Ded.","Tax/Ded.","Net Pay"];
        var cx2=[12,60,100,140,170];
        doc.setFont(undefined,"bold");doc.setTextColor(71,85,105);
        cols.forEach(function(c,i){doc.text(c,cx2[i],49);});
        doc.setFont(undefined,"normal");doc.setTextColor(15,23,42);doc.line(10,51,200,51);
        var months=["April","May","June","July","August","September","October","November","December","January","February","March"];
        var tG=0,tA=0,tT=0,tN=0,y2=56;
        months.forEach(function(mn,mi){
          var mo=mi+3>11?mi+3-12:mi+3,yr=mi<9?fy:fy+1;
          var ma2=mAtt(emp.id,yr,mo),inc2=getInc(emp.id,yr,mo),wD2=getWorkingDays(att,emp.id,yr,mo);
          var pr2=empActiveRangeInMonth(emp,yr,mo),effEmp2=getEffectiveEmp(emp,yr,mo);var d2=(pr2.notYetJoined||pr2.alreadyLeft)?calcPay(effEmp2,0,0,0,0,0,wD2,0,1):calcPay(effEmp2,ma2.absent,ma2.half,ma2.unpaid,inc2,0,wD2,pr2.activeDays,pr2.fullDays);
          var isFixed2=emp.salaryType==="fixed";
          var gr2=isFixed2?Number(effEmp2.fixedSalary||effEmp2.monthlyCTC||0):(Number(effEmp2.basic||0)+Number(effEmp2.hra||0)+Number(effEmp2.allow||0));
          var att2=d2.ad+d2.hd+d2.ud,tax2=d2.pfE+d2.esiE+d2.pt+d2.tds;
          var bon2=(bonuses||[]).filter(function(b){return b.employeeId===String(emp.id)&&b.payMonth===mo&&b.payYear===yr;}).reduce(function(s,b){return s+(b.amount||0);},0);
          var clm2=(claims||[]).filter(function(c){return c.employeeId===String(emp.id)&&c.status==="approved"&&c.month===mo&&c.year===yr;}).reduce(function(s,c){return s+(c.amount||0);},0);
          var netM=d2.net+bon2+clm2;
          tG+=gr2+bon2+clm2;tA+=att2;tT+=tax2;tN+=netM;
          if(mi%2===0){doc.setFillColor(247,249,252);doc.rect(10,y2-4,190,6,"F");}
          doc.text(mn,cx2[0],y2);doc.text(fmtIN(gr2),cx2[1],y2);
          doc.setTextColor(att2>0?200:150,att2>0?40:160,att2>0?40:150);doc.text(att2>0?"-"+fmtIN(att2):"-",cx2[2],y2);
          doc.setTextColor(tax2>0?200:150,tax2>0?40:160,tax2>0?40:150);doc.text(tax2>0?"-"+fmtIN(tax2):"-",cx2[3],y2);
          doc.setTextColor(5,120,80);doc.setFont(undefined,"bold");doc.text(fmtIN(netM),cx2[4],y2);doc.setFont(undefined,"normal");doc.setTextColor(15,23,42);
          y2+=6;
        });
        doc.line(10,y2,200,y2);y2+=5;
        doc.setFont(undefined,"bold");
        doc.text("TOTAL",cx2[0],y2);doc.text(fmtIN(tG),cx2[1],y2);
        doc.setTextColor(200,40,40);doc.text("-"+fmtIN(tA),cx2[2],y2);doc.text("-"+fmtIN(tT),cx2[3],y2);
        doc.setTextColor(5,120,80);doc.text(fmtIN(tN),cx2[4],y2);
        doc.setFont(undefined,"normal");doc.setTextColor(15,23,42);y2+=12;
        doc.setDrawColor(180,195,215);doc.line(10,y2+8,65,y2+8);
        doc.text(authSign||org.position||"",10,y2+12);
        doc.text(authPos?"Authorised Signatory - "+authPos:"Authorised Signatory",10,y2+17);
        doc.line(10,287,200,287);doc.setFontSize(7.5);doc.setTextColor(71,85,105);
        doc.text(org.name||"",10,292);
        doc.text("Not a Form 16 - For CA/ITR reference only",200,292,{align:"right"});
        doc.save("Salary-Statement-"+emp.name.replace(/\s/g,"-")+"-FY"+fy+"-"+(fy+1)+".pdf");
        showT("Annual statement downloaded");
      }catch(e){showT("PDF error","err");}
    }
    return card(h("div",null,
      h("div",{style:{display:"flex",alignItems:"center",gap:8,marginBottom:12}},
        h("div",{style:{width:34,height:34,borderRadius:9,background:ACCENT+"12",display:"flex",alignItems:"center",justifyContent:"center"}},ic("receipt_long",ACCENT,17)),
        h("div",null,h("div",{style:{fontSize:13,fontWeight:700,color:NVY}},"Annual Salary Statement"),h("div",{style:{fontSize:10,color:GRY}},"For CA/ITR filing reference"))
      ),
      h("div",{style:{background:ACCENT+"08",borderRadius:10,padding:"9px 12px",marginBottom:12,fontSize:11,color:GRY,border:"1px solid "+ACCENT+"22"}},
        "Not a Form 16. Use as salary reference for income tax filing (ITR)."),
      lbl("SELECT EMPLOYEE"),
      h("div",{style:{marginBottom:10}},chipSelect(annEmpId,function(v){setAnnEmpId(v);},emps.filter(function(e){return e.status==="active";}).map(function(e){return {v:String(e.id),l:e.name+(e.eid?" ("+e.eid+")":"")};}),{question:"Choose the employee",btnLabel:"Okay",placeholder:"-- Choose Employee --"})),
      lbl("FINANCIAL YEAR"),
      h("div",{style:{marginBottom:14}},chipSelect(annFY,function(v){setAnnFY(Number(v));},[curFY,curFY-1,curFY-2].map(function(fy){return {v:fy,l:"FY "+fy+"-"+(fy+1)+" (Apr "+fy+" - Mar "+(fy+1)+")"};}),{question:"Choose the financial year",btnLabel:"Okay"})),
      h("button",{onClick:function(){
        if(!annEmpId)return showT("Select an employee","err");
        var emp=emps.find(function(e){return String(e.id)===annEmpId;});
        if(!emp)return showT("Not found","err");
        generate(emp,annFY);
      },style:{width:"100%",background:NVY,border:"none",borderRadius:12,padding:"13px",color:CARD,fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}},
        ic("download",CARD,16),"Generate & Download PDF")
    ));
  }

  function renderAttendanceWithReport(){
    return h("div",{className:"fd"},
      h("div",{style:{display:"flex",background:SFT,borderRadius:10,padding:3,marginBottom:10,gap:3}},
        [["calendar","Calendar"],["report","Report"]].map(function(item){
          var on=attRptRange==="calendar"?item[0]==="calendar":item[0]==="report";
          return h("button",{key:item[0],onClick:function(){setAttRptRange(item[0]==="calendar"?"calendar_view":"report");},
            style:{flex:1,background:on?CARD:"transparent",border:on?"1px solid "+BDR:"none",
              borderRadius:8,padding:"8px 4px",fontSize:11,fontWeight:on?700:500,color:on?NVY:GRY,cursor:"pointer"}},item[1]);
        })
      ),
      attRptRange==="calendar_view"||attRptRange==="calendar"?renderAttendance():renderAttendanceReport()
    );
  }

  function renderComplianceCard(){
    var today2=new Date(),m=today2.getMonth(),y=today2.getFullYear();
    var nm=m===11?0:m+1,ny=m===11?y+1:y;
    function dl(day,mo,yr){return Math.round((new Date(yr,mo,day)-today2)/86400000);}
    var items=[
      {name:"PF Payment",day:15,m:m,y:y,desc:"EPF monthly contribution"},
      {name:"ESI Payment",day:15,m:m,y:y,desc:"ESIC monthly contribution"},
      {name:"TDS Payment",day:7,m:nm,y:ny,desc:"Tax deducted at source"},
      {name:"PT Payment",day:20,m:m,y:y,desc:"Professional tax"},
    ];
    return h("div",{style:{marginTop:16}},
      h("div",{style:{fontSize:13,fontWeight:700,color:NVY,marginBottom:8,display:"flex",alignItems:"center",gap:6}},
        ic("event_note",ACCENT,16),"Compliance Due Dates"),
      h("div",{style:{background:CARD,borderRadius:14,border:"1px solid "+BDR,overflow:"hidden"}},
        items.map(function(item,i){
          var d=dl(item.day,item.m,item.y);
          var color=d<0?RED:d<=3?RED:d<=7?AMB:GRN;
          var label=d<0?"Overdue "+Math.abs(d)+"d":d===0?"Due TODAY":d+"d left";
          return h("div",{key:i,style:{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderBottom:i<items.length-1?"1px solid "+BDR:"none"}},
            h("div",{style:{width:38,height:38,borderRadius:10,background:color+"12",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0}},
              h("div",{style:{fontSize:13,fontWeight:800,color:color}},item.day),
              h("div",{style:{fontSize:7,color:color,fontWeight:600}},["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"][item.m])
            ),
            h("div",{style:{flex:1}},h("div",{style:{fontSize:12,fontWeight:700,color:NVY}},item.name),h("div",{style:{fontSize:10,color:GRY}},item.desc)),
            h("div",{style:{fontSize:10,fontWeight:700,color:color,background:color+"12",borderRadius:10,padding:"3px 8px",flexShrink:0}},label)
          );
        })
      ),
      h("div",{style:{fontSize:9,color:GRY,marginTop:5,textAlign:"center"}},"Verify exact dates with your CA")
    );
  }

  function renderHolidayCalendar(){
    var todayStr2=new Date().toISOString().split("T")[0];
    function addHoliday(){
      if(!holName||!holDate)return showT("Enter name and date","err");
      if((holidays2||[]).some(function(h){return h.date===holDate;}))return showT("Holiday already exists","err");
      var hol={id:Date.now(),name:holName,date:holDate};
      setHolidays2(function(p){return [hol].concat(p||[]).sort(function(a,b){return a.date.localeCompare(b.date);});});
      _sb.from("holidays").insert({id:String(hol.id),employer_email:gUser.email,name:holName,date:holDate}).then(function(){});
      var newAtt=Object.assign({},att);actEmps.forEach(function(e){newAtt[holDate+"_"+e.id]="holiday";});setAtt(newAtt);
      setHolName("");setHolDate("");setShowHolForm(false);showT("Holiday added for all employees");
    }
    function deleteHoliday(hol){
      if(!window.confirm("Delete "+hol.name+"?"))return;
      setHolidays2(function(p){return (p||[]).filter(function(h){return h.id!==hol.id;});});
      _sb.from("holidays").delete().eq("id",String(hol.id)).then(function(){});
      var newAtt=Object.assign({},att);actEmps.forEach(function(e){var k=hol.date+"_"+e.id;if(newAtt[k]==="holiday")delete newAtt[k];});setAtt(newAtt);showT("Holiday removed");
    }
    var sorted=(holidays2||[]).slice().sort(function(a,b){return a.date.localeCompare(b.date);});
    var upcoming=sorted.filter(function(h){return h.date>=todayStr2;});
    var past=sorted.filter(function(h){return h.date<todayStr2;});
    return h("div",{className:"fd"},
      h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}},
        h("div",null,h("div",{style:{display:"flex",alignItems:"center",gap:6}},ic("event_available",ACCENT,18),h("div",{style:{fontSize:14,fontWeight:700,color:NVY}},"Holiday Calendar")),h("div",{style:{fontSize:10,color:GRY,marginTop:2}},sorted.length+" holidays set")),
        h("button",{onClick:function(){setShowHolForm(!showHolForm);},style:{background:showHolForm?SFT:ACCENT,border:showHolForm?"1.5px solid "+BDR:"none",borderRadius:9,padding:"7px 14px",fontSize:11,fontWeight:700,color:showHolForm?NVY:ACCENT_FG,cursor:"pointer"}},showHolForm?"Cancel":"+ Add Holiday")
      ),
      showHolForm?h("div",{style:{background:SFT,borderRadius:14,padding:14,border:"1px solid "+BDR,marginBottom:14}},
        h("div",{style:{fontSize:11,fontWeight:700,color:NVY,marginBottom:10}},"Add Company Holiday"),
        lbl("HOLIDAY NAME"),h("input",{type:"text",value:holName,onChange:function(e){setHolName(e.target.value);},placeholder:"e.g. Pongal, Diwali",style:{width:"100%",background:CARD,border:"1px solid "+BDR,borderRadius:9,padding:"10px 12px",fontSize:12,color:NVY,outline:"none",fontFamily:"inherit",marginBottom:10,boxSizing:"border-box"}}),
        lbl("DATE"),datePick(holDate,function(v){setHolDate(v);},{question:"Holiday date",wrapStyle:{marginBottom:10}}),
        h("div",{style:{background:ACCENT+"08",borderRadius:8,padding:"8px 10px",marginBottom:12,fontSize:10,color:GRY,border:"1px solid "+ACCENT+"22"}},"All active employees will be marked Holiday on this date automatically."),
        h("button",{onClick:addHoliday,style:{width:"100%",background:NVY,border:"none",borderRadius:10,padding:"11px",fontSize:12,fontWeight:700,color:CARD,cursor:"pointer"}},"Add Holiday")
      ):null,
      upcoming.length>0?h("div",{style:{marginBottom:12}},
        h("div",{style:{fontSize:10,fontWeight:700,color:GRY,letterSpacing:1,marginBottom:6}},"UPCOMING"),
        upcoming.map(function(hol){
          var d=new Date(hol.date+"T00:00:00");var dl=Math.round((d-new Date(todayStr2+"T00:00:00"))/86400000);
          return h("div",{key:hol.id,style:{background:CARD,borderRadius:12,padding:"11px 14px",marginBottom:6,border:"1px solid "+BDR,display:"flex",alignItems:"center",gap:10}},
            h("div",{style:{width:40,height:40,borderRadius:10,background:ACCENT+"12",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0,border:"1px solid "+ACCENT+"22"}},h("div",{style:{fontSize:14,fontWeight:800,color:ACCENT}},d.getDate()),h("div",{style:{fontSize:7,fontWeight:700,color:ACCENT}},["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"][d.getMonth()])),
            h("div",{style:{flex:1}},h("div",{style:{fontSize:13,fontWeight:700,color:NVY}},hol.name),h("div",{style:{fontSize:10,color:GRY,marginTop:2}},d.toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long",year:"numeric"})),h("div",{style:{fontSize:10,color:ACCENT,fontWeight:600,marginTop:2}},dl===0?"Today":dl===1?"Tomorrow":dl+" days away")),
            h("button",{onClick:function(){deleteHoliday(hol);},style:{background:RED+"10",border:"1px solid "+RED+"22",borderRadius:8,padding:"5px 8px",cursor:"pointer",display:"flex",alignItems:"center",gap:3,fontSize:10,fontWeight:600,color:RED}},ic("delete",RED,13),"Remove")
          );
        })
      ):h("div",{style:{background:SFT,borderRadius:12,padding:"16px",marginBottom:12,textAlign:"center"}},ic("event_available",GRY,28),h("div",{style:{fontSize:12,fontWeight:600,color:NVY,marginTop:8}},"No upcoming holidays"),h("div",{style:{fontSize:10,color:GRY,marginTop:4}},"Add holidays to auto-mark all employees")),
      past.length>0?h("div",null,h("div",{style:{fontSize:10,fontWeight:700,color:GRY,letterSpacing:1,marginBottom:6}},"PAST"),past.slice().reverse().map(function(hol){var d=new Date(hol.date+"T00:00:00");return h("div",{key:hol.id,style:{background:CARD,borderRadius:10,padding:"8px 14px",marginBottom:5,border:"1px solid "+BDR,display:"flex",alignItems:"center",gap:10,opacity:.65}},h("div",{style:{flex:1}},h("div",{style:{fontSize:12,fontWeight:600,color:NVY}},hol.name),h("div",{style:{fontSize:10,color:GRY}},d.toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}))),h("button",{onClick:function(){deleteHoliday(hol);},style:{background:"none",border:"none",cursor:"pointer",color:GRY,padding:4}},ic("delete",GRY,14)));})):null
    );
  }


  function renderOnboarding(){
    var hasEmp=actEmps.length>0;
    var hasAtt=Object.keys(att).some(function(k){return att[k]==="present"||att[k]==="absent";});
    var hasPay=actEmps.length>0&&emps.some(function(e){return Number(e.monthlyCTC||e.fixedSalary||0)>0;});
    var steps=[
      {id:"emp",done:hasEmp,title:"Add your first employee",desc:"Enter details, salary and compliance info",icon:"group",color:"#2563EB",action:function(){setTab("employees");setOnboardDone(true);lsSet("hr_onboard_done",true);}},
      {id:"att",done:hasAtt,title:"Mark today's attendance",desc:"Tap the status badge beside each employee",icon:"calendar_month",color:"#059669",action:function(){setTab("attendance");setOnboardDone(true);lsSet("hr_onboard_done",true);}},
      {id:"pay",done:hasPay,title:"Set up payroll",desc:"Ensure salary is entered for payslip generation",icon:"payments",color:"#7C3AED",action:function(){setTab("payroll");setOnboardDone(true);lsSet("hr_onboard_done",true);}},
    ];
    var doneCount=steps.filter(function(s){return s.done;}).length;
    if(doneCount===steps.length){setTimeout(function(){setOnboardDone(true);lsSet("hr_onboard_done",true);},500);return null;}
    return h("div",{style:{background:"linear-gradient(135deg,#1E3A8A,#2563EB)",borderRadius:18,padding:"16px",marginBottom:14,position:"relative",overflow:"hidden"}},
      h("div",{style:{position:"absolute",top:-20,right:-20,width:80,height:80,borderRadius:"50%",background:"rgba(255,255,255,.06)"}}),
      h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}},
        h("div",null,
          h("div",{style:{fontSize:14,fontWeight:800,color:"#fff",marginBottom:2}},"Welcome to Admin HR!"),
          h("div",{style:{fontSize:10,color:"rgba(255,255,255,.6)"}},doneCount+" of "+steps.length+" steps complete")
        ),
        h("button",{onClick:function(){setOnboardDone(true);lsSet("hr_onboard_done",true);},style:{background:"rgba(255,255,255,.12)",border:"none",borderRadius:8,padding:"3px 10px",fontSize:10,color:"rgba(255,255,255,.8)",cursor:"pointer",fontWeight:600}},"Skip")
      ),
      h("div",{style:{background:"rgba(255,255,255,.2)",borderRadius:99,height:4,marginBottom:12,overflow:"hidden"}},
        h("div",{style:{width:(doneCount/steps.length*100)+"%",height:"100%",background:"#fff",borderRadius:99}})
      ),
      steps.map(function(step,i){
        return h("div",{key:step.id,onClick:step.done?null:step.action,
          style:{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",borderRadius:10,
            background:step.done?"rgba(255,255,255,.06)":"rgba(255,255,255,.10)",
            marginBottom:i<steps.length-1?6:0,cursor:step.done?"default":"pointer",
            border:step.done?"1px solid rgba(255,255,255,.08)":"1px solid rgba(255,255,255,.2)"}},
          h("div",{style:{width:32,height:32,borderRadius:9,background:step.done?"rgba(255,255,255,.1)":step.color,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}},
            step.done?ic("task_alt","#4ADE80",16):ic(step.icon,"#fff",15)),
          h("div",{style:{flex:1}},
            h("div",{style:{fontSize:11,fontWeight:700,color:step.done?"rgba(255,255,255,.4)":"#fff",textDecoration:step.done?"line-through":"none"}},step.title),
            !step.done?h("div",{style:{fontSize:9,color:"rgba(255,255,255,.55)",marginTop:1}},step.desc):null
          ),
          !step.done?h("span",{style:{color:"rgba(255,255,255,.5)",fontSize:14}},"›"):null
        );
      })
    );
  }

  function renderSalaryRevisionCard(emp){
    if(!emp)return null;
    var empRevs=(salRevisions||[]).filter(function(r){return r.employeeId===String(emp.id);}).sort(function(a,b){return (b.effectiveDate||"").localeCompare(a.effectiveDate||"");});
    function saveRevEdit(r){
      if(!editRevDate)return showT("Enter date","err");
      var fixedDate=editRevDate.length===7?editRevDate+"-01":editRevDate; // normalize legacy "YYYY-MM" values too
      setSalRevisions(function(p){return (p||[]).map(function(x){return x.id===r.id?Object.assign({},x,{effectiveDate:fixedDate,reason:editRevReason}):x;});});
      _sb.from("salary_revisions").update({effective_date:fixedDate,reason:editRevReason}).eq("id",String(r.id)).then(function(){});
      setEditRevId(null);showT("Revision updated");
    }
    function deleteRev(r){
      if(!window.confirm("Delete this revision record?"))return;
      setSalRevisions(function(p){return (p||[]).filter(function(x){return x.id!==r.id;});});
      _sb.from("salary_revisions").delete().eq("id",String(r.id)).then(function(){});
      showT("Deleted");
    }
    function addRevision(){
      if(!revNewDate||!revNewCtc)return showT("Enter date and new salary","err");
      var oldC=Number(revNewOldCtc)||Number(emp.monthlyCTC||emp.fixedSalary||0);
      var newC=Number(revNewCtc);
      var rev={id:Date.now(),employeeId:String(emp.id),employeeName:emp.name,effectiveDate:revNewDate,oldCtc:oldC,newCtc:newC,reason:revNewReason};
      setSalRevisions(function(p){return [rev].concat(p||[]);});
      _sb.from("salary_revisions").insert({id:String(rev.id),employer_email:gUser.email,employee_id:String(emp.id),employee_name:emp.name,effective_date:revNewDate,old_ctc:oldC,new_ctc:newC,reason:revNewReason}).then(function(){});
      setRevNewDate("");setRevNewOldCtc("");setRevNewCtc("");setRevNewReason("");setShowRevForm(false);
      showT("Revision added");
    }
    return h("div",null,
      h("div",{style:{display:"flex",alignItems:"center",gap:8,marginBottom:12}},
        h("div",{style:{width:34,height:34,borderRadius:9,background:"#2563EB15",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}},ic("trending_up","#2563EB",17)),
        h("div",{style:{flex:1}},h("div",{style:{fontSize:13,fontWeight:700,color:NVY}},"Salary History"),h("div",{style:{fontSize:10,color:GRY}},empRevs.length+" revision"+(empRevs.length>1?"s":""))),
        h("button",{onClick:function(){setShowRevForm(!showRevForm);setRevNewOldCtc(String(emp.monthlyCTC||emp.fixedSalary||""));},
          style:{background:showRevForm?SFT:"#2563EB",border:showRevForm?"1px solid "+BDR:"none",borderRadius:8,padding:"5px 11px",fontSize:11,fontWeight:700,color:showRevForm?NVY:"#fff",cursor:"pointer"}},
          showRevForm?"Cancel":"+ Add")
      ),
      showRevForm?h("div",{style:{background:SFT,borderRadius:11,padding:10,border:"1px solid "+BDR,marginBottom:10}},
        h("div",{style:{display:"flex",gap:8,marginBottom:8}},
          h("div",{style:{flex:1}},lbl("OLD CTC / MO"),h("input",{type:"number",value:revNewOldCtc,onChange:function(e){setRevNewOldCtc(e.target.value);},placeholder:"Previous salary",style:{width:"100%",background:CARD,border:"1px solid "+BDR,borderRadius:7,padding:"7px 9px",fontSize:11,color:NVY,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}})),
          h("div",{style:{flex:1}},lbl("NEW CTC / MO"),h("input",{type:"number",value:revNewCtc,onChange:function(e){setRevNewCtc(e.target.value);},placeholder:"Revised salary",style:{width:"100%",background:CARD,border:"1px solid "+BDR,borderRadius:7,padding:"7px 9px",fontSize:11,color:NVY,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}))
        ),
        h("div",{style:{display:"flex",gap:8,marginBottom:8}},
          h("div",{style:{flex:1}},lbl("EFFECTIVE DATE"),datePick(revNewDate,function(v){setRevNewDate(v);},{question:"Effective date",triggerStyle:{borderRadius:7,padding:"7px 9px",fontSize:11}})),
          h("div",{style:{flex:1}},lbl("REASON"),h("input",{type:"text",value:revNewReason,onChange:function(e){setRevNewReason(e.target.value);},placeholder:"e.g. Annual increment",style:{width:"100%",background:CARD,border:"1px solid "+BDR,borderRadius:7,padding:"7px 9px",fontSize:11,color:NVY,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}))
        ),
        revNewOldCtc&&revNewCtc?h("div",{style:{background:"#2563EB10",borderRadius:8,padding:"6px 10px",marginBottom:8,border:"1px solid #2563EB25",display:"flex",justifyContent:"space-between",alignItems:"center"}},
          h("span",{style:{fontSize:10,color:GRY}},"Change"),
          h("span",{style:{fontSize:12,fontWeight:800,color:Number(revNewCtc)>Number(revNewOldCtc)?"#10B981":RED}},
            fmt(Number(revNewOldCtc))+" \u2192 "+fmt(Number(revNewCtc))+
            " ("+(Number(revNewOldCtc)>0?(Number(revNewCtc)>Number(revNewOldCtc)?"+":"")+Math.round((Number(revNewCtc)-Number(revNewOldCtc))*100/Number(revNewOldCtc))+"%":"")+")"
          )
        ):null,
        h("button",{onClick:addRevision,style:{width:"100%",background:NVY,border:"none",borderRadius:8,padding:"9px",fontSize:12,fontWeight:700,color:CARD,cursor:"pointer"}},"Save Revision")
      ):null,
      empRevs.length===0?h("div",{style:{fontSize:11,color:GRY,textAlign:"center",padding:"8px 0"}},"No revisions yet. Tap + Add to record one."):null,
      empRevs.map(function(r,i){
        var diff=r.newCtc-r.oldCtc,pct=r.oldCtc>0?Math.round(Math.abs(diff)*100/r.oldCtc):0,isHike=diff>0;
        var isEditing=editRevId===r.id;
        return h("div",{key:r.id,style:{padding:"8px 0",borderBottom:i<empRevs.length-1?"1px solid "+BDR:"none"}},
          h("div",{style:{display:"flex",alignItems:"center",gap:8}},
            h("div",{style:{flex:1}},
              h("div",{style:{display:"flex",alignItems:"center",gap:6,marginBottom:2}},
                h("div",{style:{fontSize:11,fontWeight:700,color:NVY}},fmt(r.oldCtc)+" → "+fmt(r.newCtc)),
                h("div",{style:{fontSize:9,fontWeight:700,background:isHike?"#10B98115":RED+"15",color:isHike?"#10B981":RED,borderRadius:20,padding:"1px 6px"}},(isHike?"+":"-")+pct+"%")
              ),
              !isEditing?h("div",{style:{fontSize:9,color:GRY}},new Date((r.effectiveDate||"")+"T00:00:00").toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})+(r.reason?" • "+r.reason:"")):null
            ),
            !isEditing?h("div",{style:{display:"flex",gap:4}},
              h("button",{onClick:function(){setEditRevId(r.id);setEditRevDate(r.effectiveDate||"");setEditRevReason(r.reason||"");},style:{background:SFT,border:"1px solid "+BDR,borderRadius:6,padding:"3px 8px",fontSize:9,fontWeight:700,color:NVY,cursor:"pointer"}},"Edit"),
              h("button",{onClick:function(){deleteRev(r);},style:{background:RED+"10",border:"1px solid "+RED+"22",borderRadius:6,padding:"3px 8px",fontSize:9,fontWeight:700,color:RED,cursor:"pointer"}},"Del")
            ):null
          ),
          isEditing?h("div",{style:{background:SFT,borderRadius:9,padding:10,marginTop:6,border:"1px solid "+BDR}},
            lbl("EFFECTIVE DATE"),
            datePick(editRevDate,function(v){setEditRevDate(v);},{question:"Effective date",triggerStyle:{borderRadius:7,padding:"7px 9px",fontSize:11},wrapStyle:{marginBottom:8}}),
            lbl("REASON"),
            h("input",{type:"text",value:editRevReason,onChange:function(e){setEditRevReason(e.target.value);},placeholder:"e.g. Annual increment",style:{width:"100%",background:CARD,border:"1px solid "+BDR,borderRadius:7,padding:"7px 9px",fontSize:11,color:NVY,outline:"none",fontFamily:"inherit",marginBottom:8,boxSizing:"border-box"}}),
            h("div",{style:{display:"flex",gap:6}},
              h("button",{onClick:function(){saveRevEdit(r);},style:{flex:1,background:NVY,border:"none",borderRadius:7,padding:"8px",fontSize:11,fontWeight:700,color:CARD,cursor:"pointer"}},"Save"),
              h("button",{onClick:function(){setEditRevId(null);},style:{flex:1,background:SFT,border:"1px solid "+BDR,borderRadius:7,padding:"8px",fontSize:11,fontWeight:600,color:NVY,cursor:"pointer"}},"Cancel")
            )
          ):null
        );
      })
    );
  }


  function renderBonusSection(emp){
    if(!emp)return null;
    var empBonuses=(bonuses||[]).filter(function(b){return b.employeeId===String(emp.id);}).sort(function(a,b){return (b.date||"").localeCompare(a.date||"");});
    var bonusTypes={festival:"Festival Bonus",performance:"Performance Bonus",annual:"Annual Bonus",advance:"Advance Payment",other:"Other"};
    function saveBonus(){
      if(!bonusAmt||!bonusDate)return showT("Enter amount and date","err");
      var b={id:Date.now(),employeeId:String(emp.id),employeeName:emp.name,amount:Number(bonusAmt),type:bonusType,note:bonusNote,date:bonusDate};
      setBonuses(function(p){return [b].concat(p||[]);});
      _sb.from("bonuses").insert({id:String(b.id),employer_email:gUser.email,employee_id:String(emp.id),employee_name:emp.name,amount:b.amount,type:b.type,note:b.note,date:b.date}).then(function(){});
      setBonusAmt("");setBonusNote("");setBonusDate("");setShowBonusForm(false);
      showT("Bonus recorded");
    }
    return h("div",null,
      h("div",{style:{background:ACCENT_SOFT,borderRadius:8,padding:"8px 10px",marginBottom:10,fontSize:10,color:"#4F46E5",display:"flex",alignItems:"center",gap:5}},
        ic("info","#4F46E5",11)," Bonuses are added from the Payroll tab. This shows history."
      ),
      empBonuses.length===0?h("div",{style:{textAlign:"center",padding:"12px 0",fontSize:10,color:GRY}},"No bonuses recorded yet. Add from Payroll tab."):null,
      empBonuses.map(function(b,i){
        var typeColors={festival:AMB,performance:"#2563EB",annual:"#10B981",advance:"#7C3AED",other:"#64748B"};
        var clr=typeColors[b.type]||GRY;
        var ms=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        var payLabel=b.payMonth>=0&&b.payYear>0?"Payroll: "+ms[b.payMonth]+" "+b.payYear:"Record only";
        return h("div",{key:b.id,style:{background:CARD,borderRadius:10,border:"1px solid "+BDR,marginBottom:6,overflow:"hidden"}},
          h("div",{style:{background:clr,padding:"6px 12px",display:"flex",justifyContent:"space-between",alignItems:"center"}},
            h("div",{style:{fontSize:11,fontWeight:700,color:"#fff"}},b.note||bonusTypes[b.type]||b.type),
            h("div",{style:{fontSize:13,fontWeight:900,color:"#fff"}},fmt(b.amount||0))
          ),
          h("div",{style:{padding:"6px 12px",display:"flex",justifyContent:"space-between",alignItems:"center"}},
            h("div",null,
              h("div",{style:{fontSize:10,color:GRY}},new Date((b.date||"")+"T00:00:00").toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})),
              b.note?h("div",{style:{fontSize:9,color:GRY,fontStyle:"italic"}},b.note):null
            ),
            h("div",{style:{display:"flex",alignItems:"center",gap:6}},
              h("div",{style:{fontSize:9,fontWeight:700,background:b.payMonth>=0?"#10B98110":SFT,color:b.payMonth>=0?"#10B981":GRY,borderRadius:5,padding:"2px 6px",border:"1px solid "+(b.payMonth>=0?"#10B98125":BDR)}},payLabel),
              h("button",{onClick:function(){if(!window.confirm("Delete this bonus?"))return;setBonuses(function(p){return p.filter(function(x){return x.id!==b.id;});});_sb.from("bonuses").delete().eq("id",String(b.id)).then(function(){});showT("Deleted");},style:{background:RED+"10",border:"1px solid "+RED+"22",borderRadius:5,width:20,height:20,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}},ic("delete",RED,10))
            )
          )
        );
      })
    );
  }
  function renderAdminPanel(){
    var now=new Date(); // triggers re-render each second via parent now state
    function inactiveDays(t){if(!t)return 9999;return Math.floor((new Date()-new Date(t))/86400000);}
    function planExpired(u){return u.expires_on&&new Date(u.expires_on)<new Date();}

    var filtered=adminUsers.filter(function(u){
      if(!adminSearch)return true;
      var q=adminSearch.toLowerCase();
      return u.email.toLowerCase().includes(q)||(u.full_name||"").toLowerCase().includes(q)||(u.org_name||"").toLowerCase().includes(q);
    }).slice().sort(function(a,b){
      if(adminSort==="az")return (a.email||"").localeCompare(b.email||"");
      if(adminSort==="za")return (b.email||"").localeCompare(a.email||"");
      if(adminSort==="plan")return (a.plan==="paid"?0:1)-(b.plan==="paid"?0:1);
      if(adminSort==="oldest")return new Date(a.joined_at||0)-new Date(b.joined_at||0);
      if(adminSort==="inactive")return inactiveDays(a.last_sign_in_at)-inactiveDays(b.last_sign_in_at);
      return new Date(b.joined_at||0)-new Date(a.joined_at||0);
    });

    return h("div",{style:{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:400,display:"flex",alignItems:"flex-end",justifyContent:"center"},
      onClick:function(e){if(e.target===e.currentTarget){setShowAdmin(false);setAdminSearch("");setAdminSort("newest");setAdminExpanded(null);}}},
      h("div",{style:{background:T.BG,borderRadius:"20px 20px 0 0",width:"100%",maxWidth:430,height:"92vh",display:"flex",flexDirection:"column"}},

        // ── Header ──
        h("div",{style:{background:"#0F172A",borderRadius:"20px 20px 0 0",padding:"14px 16px 12px",flexShrink:0}},
          h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}},
            h("div",null,
              h("div",{style:{fontSize:16,fontWeight:800,color:"#fff"}},"Admin Panel"),
              h("div",{style:{fontSize:10,color:"rgba(255,255,255,.5)",marginTop:1}},
                adminUsers.length+" employers \u2022 "+
                adminUsers.filter(function(u){return u.plan==="paid";}).length+" paid \u2022 "+
                adminUsers.filter(function(u){return u.is_blocked;}).length+" blocked"
              )
            ),
            h("div",{style:{display:"flex",gap:8,alignItems:"center"}},
              h("button",{onClick:function(){loadAdminUsers();showT("Refreshed");},
                style:{background:"rgba(255,255,255,.15)",border:"none",borderRadius:8,padding:"6px 10px",fontSize:11,fontWeight:700,color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",gap:4}},
                ic("refresh","#fff",15),"Refresh"),
              h("button",{onClick:function(){setShowAdmin(false);setAdminSearch("");setAdminSort("newest");setAdminExpanded(null);},
                style:{background:"rgba(255,255,255,.12)",border:"none",borderRadius:8,width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:18,color:"rgba(255,255,255,.8)",lineHeight:1}},"\u00d7")
            )
          ),
          // Search
          h("input",{value:adminSearch,onChange:function(e){setAdminSearch(e.target.value);},placeholder:"Search employer, name or org...",
            style:{width:"100%",background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.2)",borderRadius:9,padding:"8px 12px",fontSize:12,color:"#fff",outline:"none",fontFamily:"inherit",boxSizing:"border-box",marginBottom:8,
            "::placeholder":{color:"rgba(255,255,255,.4)"}}}),
          // Sort chips
          h("div",{style:{display:"flex",gap:5,overflowX:"auto",paddingBottom:2}},
            [["newest","Newest"],["oldest","Oldest"],["plan","Paid First"],["inactive","Inactive"],["az","A\u2013Z"]].map(function(item){
              var on=adminSort===item[0];
              return h("button",{key:item[0],onClick:function(){setAdminSort(item[0]);},
                style:{flexShrink:0,background:on?"rgba(255,255,255,.9)":"rgba(255,255,255,.1)",
                  border:"none",borderRadius:15,padding:"4px 10px",fontSize:10,fontWeight:on?700:500,
                  color:on?NVY:"rgba(255,255,255,.7)",cursor:"pointer",whiteSpace:"nowrap"}},item[1]);
            })
          )
        ),

        // ── List ──
        h("div",{style:{overflowY:"auto",flex:1,padding:"10px 12px"}},
          filtered.length===0?h("div",{style:{textAlign:"center",padding:40,color:GRY}},
            ic("manage_accounts",GRY,40),
            h("div",{style:{marginTop:10,fontSize:13}},"No employers found")
          ):
          filtered.map(function(u){
            var isOwner=u.email===OWNER_EMAIL;
            var isExpanded=adminExpanded===u.email;
            var isBlocking=adminBlocking===u.email;
            var isEditingExp=editExpEmail===u.email;
            var blocked=u.is_blocked||false;
            var paid=u.plan==="paid";
            var expired=planExpired(u);
            var days=inactiveDays(u.last_sign_in_at);
            var actColor=days===9999?GRY:days===0?"#10B981":days<=7?"#10B981":days<=30?AMB:RED;
            var actLabel=days===9999?"Never":days===0?"Today":days<=1?"Yesterday":days+" days ago";

            return h("div",{key:u.email,style:{
              background:CARD,borderRadius:14,marginBottom:10,overflow:"hidden",
              border:"1px solid "+(blocked?RED+"44":paid&&!expired?GRN+"44":BDR),
              boxShadow:"0 1px 6px rgba(0,0,0,.06)"
            }},
              // ── Card top: tap to expand ──
              h("div",{onClick:function(){setAdminExpanded(isExpanded?null:u.email);},
                style:{padding:"12px 14px",cursor:"pointer"}},
                // Row 1: org name + plan badge
                h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}},
                  h("div",{style:{flex:1,marginRight:8}},
                    h("div",{style:{fontSize:13,fontWeight:700,color:NVY,marginBottom:2}},
                      u.org_name||u.full_name||u.email.split("@")[0]
                    ),
                    h("div",{style:{fontSize:11,color:GRY}},u.email)
                  ),
                  h("div",{style:{display:"flex",gap:5,alignItems:"center",flexShrink:0}},
                    h("div",{style:{fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:20,
                      background:blocked?RED+"15":paid&&!expired?GRN+"15":SFT,
                      color:blocked?RED:paid&&!expired?GRN:GRY,
                      border:"1px solid "+(blocked?RED+"33":paid&&!expired?GRN+"33":BDR)}},
                      blocked?"BLOCKED":paid&&!expired?"PAID":paid&&expired?"EXPIRED":"FREE"
                    ),
                    ic(isExpanded?"expand_less":"expand_more",GRY,18)
                  )
                ),
                // Row 2: stats + last active + expiry countdown
                h("div",{style:{display:"flex",gap:6,alignItems:"center"}},
                  // Limit
                  h("div",{style:{background:SFT,borderRadius:8,padding:"5px 8px",textAlign:"center",minWidth:44}},
                    h("div",{style:{fontSize:13,fontWeight:800,color:NVY}},u.emp_limit!=null?u.emp_limit:(paid?"\u221e":"5")),
                    h("div",{style:{fontSize:8,color:GRY,marginTop:1}},"LIMIT")
                  ),
                  h("div",{style:{flex:1,background:SFT,borderRadius:8,padding:"5px 8px",display:"flex",alignItems:"center",gap:5}},
                    h("div",{style:{width:6,height:6,borderRadius:"50%",background:actColor,flexShrink:0}}),
                    h("div",null,
                      h("div",{style:{fontSize:8,color:GRY}},"LAST LOGIN"),
                      h("div",{style:{fontSize:10,fontWeight:600,color:actColor}},actLabel)
                    )
                  ),
                  u.expires_on&&paid?(function(){
                    var expDate=new Date(u.expires_on);
                    expDate.setHours(23,59,59,999);
                    var diff=expDate-now;
                    if(diff<=0)return h("div",{style:{background:RED+"12",border:"1px solid "+RED+"33",borderRadius:8,padding:"5px 8px",textAlign:"center",flexShrink:0}},
                      h("div",{style:{fontSize:9,fontWeight:800,color:RED,fontFamily:"monospace"}},"EXPIRED"),
                      h("div",{style:{fontSize:8,color:GRY,marginTop:1}},"EXPIRY")
                    );
                    var dd=Math.floor(diff/86400000);
                    var hh=Math.floor((diff%86400000)/3600000);
                    var mm=Math.floor((diff%3600000)/60000);
                    var ss=Math.floor((diff%60000)/1000);
                    var countdown=String(dd).padStart(2,"0")+":"+String(hh).padStart(2,"0")+":"+String(mm).padStart(2,"0")+":"+String(ss).padStart(2,"0");
                    var expColor=dd<=3?RED:dd<=7?AMB:GRN;
                    return h("div",{style:{background:expColor+"12",border:"1px solid "+expColor+"33",borderRadius:8,padding:"5px 8px",textAlign:"center",flexShrink:0}},
                      h("div",{style:{fontSize:9,fontWeight:800,color:expColor,fontFamily:"monospace",letterSpacing:.5}},countdown),
                      h("div",{style:{fontSize:8,color:GRY,marginTop:1}},"DD:HH:MM:SS")
                    );
                  })():null
                )
              ),

              // ── Expanded section ──
              isExpanded?h("div",{style:{borderTop:"1px solid "+BDR}},

                // Plan actions row
                h("div",{style:{padding:"10px 14px",background:SFT,display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}},
                  h("div",{style:{flex:1,display:"flex",gap:5}},
                    paid?h("button",{onClick:function(){setUserPlan(u.email,"free");},
                      style:{flex:1,background:GRY,border:"none",borderRadius:8,padding:"8px 6px",fontSize:11,fontWeight:700,color:"#fff",cursor:"pointer"}},"Set Free"):
                    h("button",{onClick:function(){setUserPlan(u.email,"paid",{activated_on:new Date().toISOString().split("T")[0]});},
                      style:{flex:1,background:GRN,border:"none",borderRadius:8,padding:"8px 6px",fontSize:11,fontWeight:700,color:"#fff",cursor:"pointer"}},"Set Paid"),
                    h("button",{onClick:function(){setEditExpEmail(isEditingExp?null:u.email);setExpInput(u.expires_on||"");},
                      style:{flex:1,background:CARD,border:"1px solid "+BDR,borderRadius:8,padding:"8px 6px",fontSize:11,fontWeight:600,color:NVY,cursor:"pointer"}},"Expiry"),
                    h("button",{onClick:function(){
                      askForm("Set Employee Limit",[{key:"lim",label:"Employee limit",type:"number",def:u.emp_limit||"",placeholder:"Blank = unlimited"}],function(vals){
                        var lim=vals.lim;
                        var n=lim&&String(lim).trim()?parseInt(lim)||999:null;
                        setUserPlan(u.email,u.plan,{emp_limit:n});
                        setTimeout(function(){loadAdminUsers();},400);
                      },{submitLabel:"Set Limit"});
                    },style:{flex:1,background:CARD,border:"1px solid "+BDR,borderRadius:8,padding:"8px 6px",fontSize:11,fontWeight:600,color:NVY,cursor:"pointer"}},"Limit"),
                    !isOwner?h("button",{
                      onClick:function(){if(!window.confirm((blocked?"Unblock":"Block")+" "+u.email+"?"))return;blockUser(u.email,!blocked);},
                      disabled:isBlocking,
                      style:{flex:1,background:blocked?GRN+"12":RED+"10",border:"1px solid "+(blocked?GRN+"44":RED+"33"),
                        borderRadius:8,padding:"8px 6px",fontSize:11,fontWeight:700,
                        color:blocked?GRN:RED,cursor:"pointer"}
                    },isBlocking?"\u23f3":(blocked?"Unblock":"Block")):null
                  )
                ),

                // Expiry date picker
                isEditingExp?h("div",{style:{padding:"8px 14px",display:"flex",gap:6,borderBottom:"1px solid "+BDR}},
                  datePick(expInput,function(v){setExpInput(v);},{question:"Subscription expiry date",wrapStyle:{flex:1,marginBottom:0},triggerStyle:{borderRadius:8,padding:"6px 10px",fontSize:12}}),
                  h("button",{onClick:function(){
                    if(!expInput)return showT("Select a date","err");
                    setUserPlan(u.email,"paid",{expires_on:expInput,activated_on:u.activated_on||new Date().toISOString().split("T")[0]});
                    loadAdminUsers();setEditExpEmail(null);setExpInput("");
                  },style:{background:GRN,border:"none",borderRadius:8,padding:"6px 12px",fontSize:11,fontWeight:700,color:"#fff",cursor:"pointer"}},"Save"),
                  h("button",{onClick:function(){setEditExpEmail(null);setExpInput("");},
                    style:{background:SFT,border:"1px solid "+BDR,borderRadius:8,padding:"6px 10px",fontSize:11,color:GRY,cursor:"pointer"}},"×")
                ):null,

                // Account details
                h("div",{style:{padding:"10px 14px"}},
                  h("div",{style:{fontSize:9,fontWeight:700,color:GRY,letterSpacing:1,marginBottom:6}},"ACCOUNT DETAILS"),
                  [
                    ["Joined",u.joined_at?new Date(u.joined_at).toLocaleDateString("en-IN"):"—"],
                    ["Last login",u.last_sign_in_at?new Date(u.last_sign_in_at).toLocaleDateString("en-IN"):"Never"],
                    ["Email",u.email_confirmed_at?"Verified":"Not verified"],
                    u.expires_on?["Plan Expiry",new Date(u.expires_on).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})+(planExpired(u)?" — EXPIRED":"")]:null,
                    u.org_type?["Org type",u.org_type]:null,
                  ].filter(Boolean).map(function(item){
                    return h("div",{key:item[0],style:{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid "+BDR+"66"}},
                      h("span",{style:{fontSize:11,color:GRY}},item[0]),
                      h("span",{style:{fontSize:11,fontWeight:600,color:NVY}},item[1])
                    );
                  })
                ),



                // Delete — bottom, intentional
                !isOwner?h("div",{style:{padding:"0 14px 12px"}},
                  h("button",{onClick:function(){
                    if(!window.confirm("DELETE: "+u.email+"\n\nRemoves all HR data, attendance, payroll, org profile.\nAuth account must be deleted from Supabase dashboard separately."))return;
                    Promise.all([
                      _sb.from("user_plans").delete().eq("email",u.email),
                      _sb.from("user_orgs").delete().eq("email",u.email),
                      _sb.from("user_data").delete().eq("email",u.email),
                      _sb.from("invite_codes").delete().eq("employer_email",u.email)
                    ]).then(function(){showT("Deleted. Remove auth from Supabase.");loadAdminUsers();setAdminExpanded(null);});
                  },style:{width:"100%",background:"none",border:"1.5px solid "+RED+"44",borderRadius:10,padding:"9px",fontSize:12,fontWeight:700,color:RED,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}},
                  ic("delete_forever",RED,14),"Delete Account Permanently")
                ):null
              ):null
            );
          })
        )
      )
    );
  }
  function renderPFDlPicker(){
    if(!showPFDl)return null;
    return h(Modal,{title:"PF / ESI Summary Report",onClose:function(){setShowPFDl(false);}},
        h("div",{style:{fontSize:11,color:GRY,marginBottom:10}},"Select month to generate PF/ESI challan summary"),
        h("div",{style:{display:"flex",gap:8,marginBottom:20}},
          chipSelect(payDlM,function(v){setPayDlM(Number(v));},MOS.map(function(mo,i){return {v:i,l:mo};}),{question:"Choose month",wrapStyle:{flex:2,marginBottom:0}}),
          chipSelect(payDlY,function(v){setPayDlY(Number(v));},pastYears(),{question:"Choose year",wrapStyle:{flex:1,marginBottom:0}})
        ),
        h("button",{onClick:function(){setShowPFDl(false);makePFESIPDF(actEmps,payDlM,payDlY,getMonthPay,org.name,org.contactEmail||org.email,org.position,LOGO_SRC,org.address||"",org.logo||"",authPos,authSign,org.phone,org.website);},style:{width:"100%",background:"#4F46E5",border:"none",borderRadius:12,padding:"14px",color:CARD,fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}},
          ic(ICONS.dl,CARD,18),"Download PF/ESI Report")
    );
  }

  function renderSalRegPicker(){
    if(!showSalRegDl)return null;
    return h(Modal,{title:"Salary Register",onClose:function(){setShowSalRegDl(false);}},
        h("div",{style:{fontSize:11,color:GRY,marginBottom:10}},"Statutory salary register — Payment of Wages Act format"),
        h("div",{style:{display:"flex",gap:8,marginBottom:20}},
          chipSelect(payDlM,function(v){setPayDlM(Number(v));},MOS.map(function(mo,i){return {v:i,l:mo};}),{question:"Choose month",wrapStyle:{flex:2,marginBottom:0}}),
          chipSelect(payDlY,function(v){setPayDlY(Number(v));},pastYears(),{question:"Choose year",wrapStyle:{flex:1,marginBottom:0}})
        ),
        h("button",{onClick:function(){setShowSalRegDl(false);makeSalaryRegisterPDF(actEmps,payDlM,payDlY,getMonthPay,org.name,org.contactEmail||org.email,org.position,LOGO_SRC,org.address||"",org.logo||"",authPos,authSign,org.phone,org.website);},style:{width:"100%",background:"#059669",border:"none",borderRadius:12,padding:"14px",color:CARD,fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}},
          ic(ICONS.dl,CARD,18),"Download Salary Register")
    );
  }

  function renderECRPicker(){
    if(!showECRDl)return null;
    return h(Modal,{title:"EPF ECR File",onClose:function(){setShowECRDl(false);}},
        h("div",{style:{background:AMB+"18",border:"1px solid "+AMB+"44",borderRadius:10,padding:"10px 12px",marginBottom:14}},
          h("div",{style:{fontSize:12,fontWeight:700,color:AMB,marginBottom:4}},"Important — UAN Required"),
          h("div",{style:{fontSize:11,color:NVY,marginBottom:4}},(function(){var n=actEmps.filter(function(e){return e.pf&&e.uan;}).length;var t=actEmps.filter(function(e){return e.pf;}).length;return n+"/"+t+" PF employees have UAN entered";}())),
          actEmps.filter(function(e){return e.pf&&!e.uan;}).length>0?h("div",{style:{fontSize:10,color:RED}},"Missing UAN: "+actEmps.filter(function(e){return e.pf&&!e.uan;}).map(function(e){return e.name;}).join(", ")):null,
          h("div",{style:{fontSize:10,color:GRY,marginTop:4}},"Edit employees to add their UAN. Employees without UAN will be skipped.")
        ),
        h("div",{style:{display:"flex",gap:8,marginBottom:20}},
          chipSelect(payDlM,function(v){setPayDlM(Number(v));},MOS.map(function(mo,i){return {v:i,l:mo};}),{question:"Choose month",wrapStyle:{flex:2,marginBottom:0}}),
          chipSelect(payDlY,function(v){setPayDlY(Number(v));},pastYears(),{question:"Choose year",wrapStyle:{flex:1,marginBottom:0}})
        ),
        h("button",{onClick:function(){
          var count=generateECR(actEmps,payDlM,payDlY,getMonthPay);
          if(count){setShowECRDl(false);showT("ECR downloaded — "+count+" employees");}
        },style:{width:"100%",background:"#D97706",border:"none",borderRadius:12,padding:"14px",color:CARD,fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}},
          ic(ICONS.dl,CARD,18),"Download ECR File")
    );
  }

  function renderPayDlPicker(){
    if(!showPayDl)return null;
    return h(Modal,{title:"Download Payroll Report",onClose:function(){setShowPayDl(false);}},
        h("div",{style:{fontSize:11,color:GRY,marginBottom:10,fontWeight:600,letterSpacing:.5}},"REPORT TYPE"),
        h("div",{style:{display:"flex",gap:8,marginBottom:16}},
          h("button",{onClick:function(){setPayDlType("emp");},style:{flex:1,background:payDlType==="emp"?NVY:SFT,border:"1px solid "+BDR,borderRadius:10,padding:"10px",color:payDlType==="emp"?CARD:GRY,fontSize:12,fontWeight:700,cursor:"pointer"}},
            "Employee Copy",h("div",{style:{fontSize:9,fontWeight:400,marginTop:2,opacity:.7}},"No CTC/employer costs")
          ),
          h("button",{onClick:function(){setPayDlType("er");},style:{flex:1,background:payDlType==="er"?NVY:SFT,border:"1px solid "+BDR,borderRadius:10,padding:"10px",color:payDlType==="er"?CARD:GRY,fontSize:12,fontWeight:700,cursor:"pointer"}},
            "Employer Copy",h("div",{style:{fontSize:9,fontWeight:400,marginTop:2,opacity:.7}},"With CTC breakdown")
          )
        ),
        h("div",{style:{fontSize:11,color:GRY,marginBottom:10,fontWeight:600,letterSpacing:.5}},"SELECT MONTH"),
        h("div",{style:{display:"flex",gap:8,marginBottom:20}},
          chipSelect(payDlM,function(v){setPayDlM(Number(v));},MOS.map(function(mo,i){return {v:i,l:mo};}),{question:"Choose month",wrapStyle:{flex:2,marginBottom:0}}),
          chipSelect(payDlY,function(v){setPayDlY(Number(v));},pastYears(),{question:"Choose year",wrapStyle:{flex:1,marginBottom:0}})
        ),
        h("div",{style:{fontSize:11,color:GRY,marginBottom:16,textAlign:"center"}},
          (payDlType==="emp"?"Employee copy":"Employer copy")+" — "+MOS[payDlM]+" "+payDlY
        ),
        h("button",{onClick:function(){
          setShowPayDl(false);
          makePayrollPDF(actEmps,payDlM,payDlY,getMonthPay,org.name,org.contactEmail||org.email,org.position,LOGO_SRC,payDlType==="er",org.address||"",org.logo||"",authPos,authSign,org.phone,org.website);
        },style:{width:"100%",background:NVY,border:"none",borderRadius:12,padding:"14px",color:CARD,fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}},
          ic(ICONS.dl,CARD,18),"Download PDF")
    );
  }

  function renderAttDlPicker(){
    if(!showAttDl)return null;
    return h(Modal,{title:"Download Attendance Report",onClose:function(){setShowAttDl(false);}},
        h("div",{style:{display:"flex",gap:8,marginBottom:16}},
          h("button",{onClick:function(){setAttDlAll(false);},style:{flex:1,background:!attDlAll?NVY:SFT,border:"1px solid "+BDR,borderRadius:10,padding:"10px",color:!attDlAll?CARD:GRY,fontSize:12,fontWeight:700,cursor:"pointer"}},"By Month"),
          h("button",{onClick:function(){setAttDlAll(true);},style:{flex:1,background:attDlAll?NVY:SFT,border:"1px solid "+BDR,borderRadius:10,padding:"10px",color:attDlAll?CARD:GRY,fontSize:12,fontWeight:700,cursor:"pointer"}},"Entire Year")
        ),
        h("div",{style:{display:"flex",gap:8,marginBottom:20}},
          !attDlAll?chipSelect(attDlM,function(v){setAttDlM(Number(v));},MOS.map(function(mo,i){return {v:i,l:mo};}),{question:"Choose month",wrapStyle:{flex:2,marginBottom:0}}):null,
          chipSelect(attDlY,function(v){setAttDlY(Number(v));},pastYears(),{question:"Choose year",wrapStyle:{flex:1,marginBottom:0}})
        ),
        h("div",{style:{fontSize:11,color:GRY,marginBottom:16,textAlign:"center"}},
          attDlAll
            ?"Downloading all 12 months of "+attDlY+" as one PDF"
            :"Downloading "+MOS[attDlM]+" "+attDlY+" attendance summary"
        ),
        h("button",{onClick:function(){
          setShowAttDl(false);
          if(attDlAll){
            try{makeAttSummaryYearPDF(actEmps,att,attDlY,org.name,org.contactEmail||org.email,org.position,LOGO_SRC,org.address||"",org.logo||"",authPos,authSign,org.phone,org.website);}catch(ex){showT("PDF error: "+ex.message,"err");}
          } else {
            try{makeAttSummaryPDF(actEmps,att,attDlM,attDlY,org.name,org.contactEmail||org.email,org.position,LOGO_SRC,org.address||"",org.logo||"",authPos,authSign,org.phone,org.website);}catch(ex){showT("PDF error: "+ex.message,"err");}
          }
        },style:{width:"100%",background:NVY,border:"none",borderRadius:12,padding:"14px",color:CARD,fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}},
          ic(ICONS.dl,CARD,18),"Download PDF")
    );
  }

  // Unified popup that replaces window.prompt() everywhere — one themed modal for any text/number/date/textarea question.
  function renderAskModal(){
    if(!askModal)return null;
    function fieldChange(k,v){setAskModal(function(p){if(!p)return p;var nv=Object.assign({},p.values);nv[k]=v;return Object.assign({},p,{values:nv});});}
    function submit(){
      // Required-field guard
      var missing=(askModal.fields||[]).find(function(f){return f.required&&!String(askModal.values[f.key]||"").trim();});
      if(missing){showT("Please fill: "+missing.label,"err");return;}
      var vals=askModal.values,onSubmit=askModal.onSubmit;
      setAskModal(null);
      onSubmit(vals);
    }
    function cancel(){setAskModal(null);}
    return h(Modal,{title:askModal.question,onClose:cancel,zIndex:700,footer:h("div",{style:{display:"flex",gap:8}},
        h("button",{type:"button",onClick:cancel,style:{flex:1,background:SFT,border:"1px solid "+BDR,borderRadius:10,padding:"11px",color:GRY,fontSize:12.5,fontWeight:600,cursor:"pointer"}},"Cancel"),
        h("button",{type:"button",onClick:submit,style:{flex:2,background:ACCENT,border:"none",borderRadius:10,padding:"11px",color:ACCENT_FG,fontSize:12.5,fontWeight:700,cursor:"pointer"}},askModal.submitLabel||"Continue")
      )},
      (askModal.fields||[]).map(function(f,i){
        return h("div",{key:f.key,style:{marginBottom:i<askModal.fields.length-1?12:0}},
          lbl(f.label.toUpperCase()+(f.required?" *":"")),
          f.type==="date"?datePick(askModal.values[f.key],function(v){fieldChange(f.key,v);},{question:"Choose "+f.label,placeholder:f.placeholder})
          :f.type==="buttons"?h("div",{style:{display:"flex",gap:8}},(f.opts||[]).map(function(o){var sel=askModal.values[f.key]===o.v;return h("button",{key:o.v,type:"button",onClick:function(){fieldChange(f.key,o.v);},style:{flex:1,background:sel?ACCENT:SFT,border:"1.5px solid "+(sel?ACCENT:BDR),borderRadius:10,padding:"10px",color:sel?ACCENT_FG:NVY,fontSize:11.5,fontWeight:600,cursor:"pointer"}},o.l);}))
          :f.type==="textarea"?h("textarea",{value:askModal.values[f.key]||"",onChange:function(e){fieldChange(f.key,e.target.value);},placeholder:f.placeholder||"",rows:3,autoFocus:i===0,style:{width:"100%",background:SFT,border:"1.5px solid "+BDR,borderRadius:10,padding:"10px 12px",fontSize:13,color:NVY,outline:"none",fontFamily:"inherit",resize:"vertical",boxSizing:"border-box"}})
          :f.type==="choice"?chipSelect(askModal.values[f.key],function(v){fieldChange(f.key,v);},f.opts||[],{question:f.question||("Choose "+f.label),wrapStyle:{marginBottom:0}})
          :h("input",{type:f.type==="number"?"number":"text",value:askModal.values[f.key]||"",onChange:function(e){fieldChange(f.key,e.target.value);},placeholder:f.placeholder||"",autoFocus:i===0,style:{width:"100%",background:SFT,border:"1.5px solid "+BDR,borderRadius:10,padding:"10px 12px",fontSize:13,color:NVY,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}})
        );
      })
    );
  }

  return h("div",{style:{fontFamily:"Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",background:PAGE,minHeight:"100vh",display:"flex",justifyContent:"center",transition:"background .25s"}},
    h("style",{dangerouslySetInnerHTML:{__html:CSS_SPIN+CSS_LIVE}}),
    h("div",{style:{width:"100%",maxWidth:430,minHeight:"100vh",position:"relative",display:"flex",flexDirection:"column"}},
      showUpdate?h("div",{style:{position:"fixed",top:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,zIndex:9999,background:"#0F172A",padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,boxShadow:"0 2px 12px rgba(0,0,0,.3)"}},
        h("div",{style:{fontSize:12,color:CARD,fontWeight:600}},"\u2728 New update available!"),
        h("button",{onClick:function(){
          // Belt-and-braces update: wipe every Cache Storage entry and unregister the old service
          // worker before reloading, so the new version is guaranteed to load fresh — this is what
          // used to require clearing all browsing data by hand; now "Update Now" does the same thing.
          var done=function(){window.location.reload(true);};
          if("caches" in window){
            caches.keys().then(function(keys){return Promise.all(keys.map(function(k){return caches.delete(k);}));}).catch(function(){}).then(function(){
              if("serviceWorker" in navigator){
                navigator.serviceWorker.getRegistrations().then(function(regs){
                  Promise.all(regs.map(function(r){return r.unregister();})).catch(function(){}).then(done);
                }).catch(done);
              }else{done();}
            });
          }else{done();}
        },style:{background:"#FCD34D",border:"none",borderRadius:8,padding:"6px 14px",fontSize:12,fontWeight:700,color:"#0F172A",cursor:"pointer",flexShrink:0}},"Update Now")
      ):null,
      // admin panel handled via screen routing below
      renderPFDlPicker(),
      renderSalRegPicker(),
      renderECRPicker(),
      renderPayDlPicker(),
      renderAttDlPicker(),
      appContent,
      renderNotifPanel(),
      renderInviteModal(),
      renderAskModal()
    )
  );
}
