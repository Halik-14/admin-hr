import React, { useState, useRef, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
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
  dark:{GRY:"#9a9a9a",BDR:"#3a3939",NVY:"#FFFFFF",SFT:"#2a2929",CARD:"#2e2d2d",PAGE:"#242323",MUTED:"#8a8a8a",HOVER:"#3a3939",ACCENT:"#FFFFFF",ACCENT_FG:"#1a1a1a",ACCENT_SOFT:"#3a3a3a",
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
function buildCSS(){return "*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:0}@keyframes fU{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}@keyframes sU{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}@keyframes blinkBorder{0%,100%{border-color:#FCD34D;box-shadow:0 0 0 2px #FCD34D44}50%{border-color:#F59E0B;box-shadow:0 0 0 4px #F59E0B33}}@keyframes blinkBg{0%,100%{background:rgba(253,211,77,.12)}50%{background:rgba(253,211,77,.22)}}@keyframes ticker{0%{transform:translateX(0%)}100%{transform:translateX(-50%)}}.fd{animation:fU .25s ease}.rh:hover{background:"+T.HOVER+"!important}input{color:"+T.NVY+"!important}textarea{color:"+T.NVY+"!important}select{background:"+T.CARD+";border:1.5px solid "+T.BDR+";border-radius:10px;padding:10px 12px;font-size:13px;color:"+T.NVY+";width:100%;font-family:inherit;outline:none;margin-bottom:10px}select option{background:"+T.CARD+";color:"+T.NVY+"}input::placeholder{color:"+T.MUTED+"}textarea::placeholder{color:"+T.MUTED+"}";}var CSS=buildCSS();
var SVG_ICONS={
"group":"M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z",
"check_circle":"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z",
"currency_rupee":"M17 8H7V6h10zm-5 9l-5-5h3.5c1.93 0 3.5-1.57 3.5-3.5S13.43 5 11.5 5H7v2h4.5C12.88 7 14 8.12 14 9.5S12.88 12 11.5 12H9l5 5z",
"trending_up":"M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z",
"calendar_month":"M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z",
"download":"M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z",
"chat":"M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z",
"edit":"M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",
"delete":"M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z",
"account_circle":"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z",
"add":"M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z",
"chevron_right":"M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z",
"lock":"M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z",
"light_mode":"M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-12.37l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0zM7.05 18.36l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0z",
"dark_mode":"M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z",
"dashboard":"M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z",
"settings":"M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z",
"payments":"M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z",
"save":"M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z",
"search":"M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z",
"close":"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z",
"notifications":"M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z",
"cake":"M12 6c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3L12 1l-1.5 1.7c-.3.3-.5.8-.5 1.3 0 1.1.9 2 2 2zm6 4H6C4.9 10 4 10.9 4 12v.8c0 1.1.6 2.1 1.5 2.6.4.2.9.3 1.4.2.4-.1.7-.2 1-.5l2-2 2 2c.6.6 1.5.8 2.3.5.2-.1.5-.2.7-.3.9-.5 1.6-1.5 1.6-2.5V12c0-1.1-.9-2-2-2zM5 19h14v2H5zm0-3h14v2H5z",
"workspace_premium":"M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93-2.67-1.14-5-4.43-5-7.93V7.18L12 5zm-1.41 7.41L9 11l-1.41 1.41L10.59 15 16 9.59 14.59 8.17z",
"delete_forever":"M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z",
"expand_more":"M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z",
"expand_less":"M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z",
"table_view":"M4 5v13h17V5H4zm3 11H6v-2h1v2zm0-4H6v-2h1v2zm0-4H6V6h1v2zm11 8H8v-2h10v2zm0-4H8v-2h10v2zm0-4H8V6h10v2z",
"check":"M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
};
var ICONS={
  team:"group",check:"check_circle",rupee:"currency_rupee",trend:"trending_up",
  cal:"calendar_month",dl:"download",wa:"chat",mail:"chat",edit:"edit",
  del:"delete",user:"account_circle",plus:"add",chev:"chevron_right",
  lock:"lock",sun:"light_mode",grid:"dashboard",set:"settings",
  pay:"payments",save:"save"
};
function ic(name,color,size){
  var s=size||20;
  var path=SVG_ICONS[name]||SVG_ICONS["check"];
  return h("svg",{viewBox:"0 0 24 24",width:s,height:s,style:{display:"inline-block",verticalAlign:"middle",flexShrink:0},fill:color||"currentColor"},
    h("path",{d:path})
  );
}

function calcTax(annual){
  var sl=[{a:0,b:400000,r:0},{a:400000,b:800000,r:.05},{a:800000,b:1200000,r:.10},{a:1200000,b:1600000,r:.15},{a:1600000,b:2000000,r:.20},{a:2000000,b:2400000,r:.25},{a:2400000,b:Infinity,r:.30}];
  var t=Math.max(0,annual-75000),x=0;
  for(var i=0;i<sl.length;i++){var s=sl[i];if(t>s.a)x+=(Math.min(t,s.b)-s.a)*s.r;}
  if(t<=1200000)x=Math.max(0,x-Math.min(x,60000));
  return Math.round((x>0?x*1.04:0)/12);
}
function brkSal(ctc){var basic=Math.round(ctc*.5),hra=Math.round(ctc*.2);return{basic:basic,hra:hra,allow:ctc-basic-hra};}
function calcPay(e,absent,half,unpaid,inc,shiftAllow){
  absent=absent||0;half=half||0;unpaid=unpaid||0;inc=inc||0;shiftAllow=shiftAllow||0;
  var pd=(e.basic||0)/26,ad=absent*pd,hd=half*(pd/2),ud=unpaid*pd;
  var eb=Math.max(0,(e.basic||0)-ad-hd-ud),gr=eb+(e.hra||0)+(e.allow||0)+inc+shiftAllow;
  var pfB=e.pf?(e.pfMode==="actual"?eb:Math.min(eb,15000)):0;
  var pfE=Math.round(pfB*.12),pfR=Math.round(pfB*.12);
  var esiE=(e.esi&&gr<=21000)?Math.round(gr*.0075):0,esiR=(e.esi&&gr<=21000)?Math.round(gr*.0325):0;
  var pt2=e.pt?(gr>=15000?200:0):0,tds=e.tds!==false?calcTax(gr*12):0,hi=e.hi||0;
  var cd=(e.customs||[]).reduce(function(a,c){return a+(Number(c.amt)||0);},0);
  return{gr:Math.round(gr),eb:Math.round(eb),ad:Math.round(ad),hd:Math.round(hd),ud:Math.round(ud),pfE:pfE,pfR:pfR,esiE:esiE,esiR:esiR,pt:pt2,tds:tds,hi:hi,cd:cd,net:Math.round(gr-pfE-esiE-pt2-tds-hi-cd),pfMode:e.pfMode||"capped",inc:inc,shiftAllow:shiftAllow};
}
function esc(s){return(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
function openHTML(html,filename){
  var win=window.open("","_blank");
  if(win){win.document.write(html);win.document.close();}
  else{
    var blob=new Blob([html],{type:"text/html"});
    var a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=filename.replace(/[^a-z0-9]/gi,"-")+".html";document.body.appendChild(a);a.click();document.body.removeChild(a);
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
  +"<table class='tbl'><tr><td class='tbl-head' colspan='2'>DEDUCTIONS</td></tr>"+(d.ad>0?tr("Absent","-"+R(d.ad),"#DC2626"):"")+(d.hd>0?tr("Half Day","-"+R(d.hd),"#D97706"):"")+(d.ud>0?tr("Unpaid Leave","-"+R(d.ud),"#DC2626"):"")+(d.pfE>0?tr("PF (Employee 12%)","-"+R(d.pfE)):"")+(d.esiE>0?tr("ESI (Emp 0.75%)","-"+R(d.esiE),"#0D9488"):"")+(d.pt>0?tr("Professional Tax","-"+R(d.pt),"#D97706"):"")+(d.tds>0?tr("TDS","-"+R(d.tds),"#DC2626"):"")+(d.hi>0?tr("Health Insurance","-"+R(d.hi),"#EC4899"):"")+(d.cd>0?tr("Custom","-"+R(d.cd)):"")+tr("Total Deductions","-"+R(deductTotal),"#DC2626","#FEF2F2",true)+"</table></div>"
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
function makePayslipPDF(emp,d,m,y,orgName,orgEmail,orgPos,logoSrc){
  loadJsPDFGlobal(function(JsPDF){
    var doc=new JsPDF({orientation:"portrait",unit:"mm",format:"a4"});
    var W=210,mg=14,x=mg,cw=W-mg*2;
    function R(n){return fmtIN(n);}
    var th=6;
    doc.setFillColor(15,23,42);doc.rect(0,0,W,22,"F");
    try{if(logoSrc&&logoSrc.startsWith("data:"))doc.addImage(logoSrc,"PNG",x,2,10,10,undefined,"FAST");}catch(e){}
    doc.setFontSize(9);doc.setTextColor(252,211,77);doc.setFont("helvetica","bold");doc.text("AdminHR",x+12,8);
    doc.setTextColor(255,255,255);doc.setFont("helvetica","normal");
    doc.setFontSize(7.5);doc.text(orgName||"",x,14);doc.text((orgPos||"")+" | "+(orgEmail||""),x,18.5);
    doc.setFontSize(10);doc.setFont("helvetica","bold");doc.text("SALARY PAYSLIP",W-mg,9,{align:"right"});
    doc.setFontSize(7.5);doc.setFont("helvetica","normal");
    var nd=new Date();doc.text(MOS[m]+" "+y+" | "+(nd.getDate()+"/"+(nd.getMonth()+1)+"/"+nd.getFullYear()),W-mg,14,{align:"right"});
    var ey=28;
    doc.setFillColor(248,250,255);doc.roundedRect(mg,ey,cw,14,2,2,"F");
    doc.setDrawColor(226,232,240);doc.roundedRect(mg,ey,cw,14,2,2,"S");
    doc.setFontSize(11);doc.setFont("helvetica","bold");doc.setTextColor(15,23,42);doc.text(emp.name,x+3,ey+5.5);
    doc.setFontSize(8);doc.setFont("helvetica","normal");doc.setTextColor(100,116,139);
    doc.text((emp.role||"")+(emp.dept?" | "+emp.dept:""),x+3,ey+10);
    if(emp.eid)doc.text("EMP: "+emp.eid,W-mg-3,ey+5.5,{align:"right"});
    if(emp.pan)doc.text("PAN: "+emp.pan,W-mg-3,ey+10,{align:"right"});
    var ty=48,col1x=mg,col2x=mg+cw/2+1,colw=cw/2-1;
    function tblHead(lx,ly,lw,label){doc.setFillColor(15,23,42);doc.rect(lx,ly,lw,th,"F");doc.setFontSize(7.5);doc.setFont("helvetica","bold");doc.setTextColor(255,255,255);doc.text(label,lx+2,ly+4.2);}
    function tblRow(lx,ly,lw,label,val,vc,bg){
      if(bg){doc.setFillColor(bg[0],bg[1],bg[2]);doc.rect(lx,ly,lw,th,"F");}
      doc.setFontSize(7.5);doc.setFont("helvetica","normal");doc.setTextColor(100,116,139);doc.text(label,lx+2,ly+4.2);
      if(vc)doc.setTextColor(vc[0],vc[1],vc[2]);else doc.setTextColor(15,23,42);
      doc.setFont("helvetica","bold");doc.text(val,lx+lw-2,ly+4.2,{align:"right"});
    }
    tblHead(col1x,ty,colw,"EARNINGS");
    var ey2=ty+th;
    var earns=[["Basic Salary",R(d.eb)],["HRA",R(emp.hra||0)],["Allowances",R(emp.allow||0)]];
    if(d.shiftAllow>0)earns.push(["Shift Allow.",R(d.shiftAllow)]);
    if(d.inc>0)earns.push(["Incentive",R(d.inc)]);
    earns.forEach(function(r,i){tblRow(col1x,ey2+i*th,colw,r[0],r[1]);});
    var gry=ey2+earns.length*th;
    tblRow(col1x,gry,colw,"Gross Earnings",R(d.gr),[5,150,105],[240,253,244]);
    tblHead(col2x,ty,colw,"DEDUCTIONS");
    var dy2=ty+th,deds=[];
    if(d.ad>0)deds.push(["Absent","-"+R(d.ad)]);if(d.hd>0)deds.push(["Half Day","-"+R(d.hd)]);if(d.ud>0)deds.push(["Unpaid Lv","-"+R(d.ud)]);if(d.pfE>0)deds.push(["PF (Emp 12%)","-"+R(d.pfE)]);if(d.esiE>0)deds.push(["ESI (0.75%)","-"+R(d.esiE)]);if(d.pt>0)deds.push(["Prof. Tax","-"+R(d.pt)]);if(d.tds>0)deds.push(["TDS","-"+R(d.tds)]);if(d.hi>0)deds.push(["Health Ins","-"+R(d.hi)]);if(d.cd>0)deds.push(["Custom","-"+R(d.cd)]);
    deds.forEach(function(r,i){tblRow(col2x,dy2+i*th,colw,r[0],r[1],[220,38,38]);});
    var deductTotal=d.pfE+d.esiE+d.pt+d.tds+d.hi+d.cd+d.ad+d.hd+d.ud;
    var dtoty=dy2+deds.length*th;
    tblRow(col2x,dtoty,colw,"Total Deductions","-"+R(deductTotal),[220,38,38],[254,242,242]);
    var nety=Math.max(gry,dtoty)+th+4;
    doc.setFillColor(15,23,42);doc.roundedRect(mg,nety,cw,14,2,2,"F");
    doc.setFontSize(9);doc.setFont("helvetica","normal");doc.setTextColor(200,200,200);
    doc.text("NET TAKE HOME | "+MOS[m]+" "+y,x+3,nety+6);
    doc.setFontSize(14);doc.setFont("helvetica","bold");doc.setTextColor(74,222,128);
    doc.text(R(d.net),W-mg-3,nety+9.5,{align:"right"});
    var ery=nety+18;
    tblHead(mg,ery,cw,"EMPLOYER CONTRIBUTIONS (not deducted from salary)");
    tblRow(mg,ery+th,cw,"PF (Employer 12%)",R(d.pfR));
    tblRow(mg,ery+th*2,cw,"ESI (Employer 3.25%)",R(d.esiR));
    tblRow(mg,ery+th*3,cw,"Total CTC",R(d.gr+d.pfR+d.esiR),[217,119,6],[255,251,235]);
    var fy=285;
    doc.setDrawColor(226,232,240);doc.line(mg,fy,W-mg,fy);
    doc.setFontSize(7);doc.setFont("helvetica","normal");doc.setTextColor(148,163,184);
    doc.text((orgName||"")+" | "+(orgEmail||""),mg,fy+4);
    doc.text("Generated by AdminHR",W-mg,fy+4,{align:"right"});
    downloadPDF(doc.output("blob"),"Payslip-"+emp.name.replace(/\s+/g,"-")+"-"+MOS[m]+"-"+y+".pdf");
  },function(){alert("Failed to load PDF library. Check internet connection.");});
}

function makePayrollPDF(emps,m,y,mAttFn,incFn,orgName,orgEmail,orgPos,logoSrc){
  loadJsPDFGlobal(function(JsPDF){
    var doc=new JsPDF({orientation:"landscape",unit:"mm",format:"a4"});
    var W=297,H=210,mg=14,x=mg,cw=W-mg*2;
    var th=7;
    doc.setFillColor(15,23,42);doc.rect(0,0,W,22,"F");
    try{if(logoSrc&&logoSrc.startsWith("data:"))doc.addImage(logoSrc,"PNG",x,2,10,10,undefined,"FAST");}catch(e){}
    doc.setFontSize(9);doc.setTextColor(252,211,77);doc.setFont("helvetica","bold");doc.text("AdminHR",x+12,8);
    doc.setTextColor(255,255,255);doc.setFont("helvetica","normal");
    doc.setFontSize(7.5);doc.text(orgName||"",x,14);doc.text((orgPos||"")+" | "+(orgEmail||""),x,18.5);
    doc.setFontSize(11);doc.setFont("helvetica","bold");doc.text("PAYROLL REPORT",W-mg,9,{align:"right"});
    var nd=new Date();
    doc.setFontSize(7.5);doc.setFont("helvetica","normal");doc.text(MOS[m]+" "+y+" | "+(nd.getDate()+"/"+(nd.getMonth()+1)+"/"+nd.getFullYear()),W-mg,14,{align:"right"});
    var ry=28;
    var cols=["EMPLOYEE","DEPT","GROSS","DEDUCTIONS","NET PAY","CTC"];
    var cws=[55,35,30,30,30,30];
    var cx=[mg];for(var ci=0;ci<cws.length-1;ci++)cx.push(cx[ci]+cws[ci]);
    doc.setFillColor(15,23,42);doc.rect(mg,ry,cw,th,"F");
    doc.setFontSize(7.5);doc.setFont("helvetica","bold");doc.setTextColor(255,255,255);
    cols.forEach(function(col,i){doc.text(col,cx[i]+2,ry+4.8);});
    ry+=th;
    var tG=0,tN=0,tP=0,tE=0,tD=0;
    emps.forEach(function(emp,ei){
      var ma=mAttFn(emp.id,y,m),inc=incFn(emp.id,y,m),d=calcPay(emp,ma.absent,ma.half,ma.unpaid,inc);
      tG+=d.gr;tN+=d.net;tP+=d.pfR;tE+=d.esiR;tD+=(d.gr-d.net);
      if(ei%2===0){doc.setFillColor(248,250,252);doc.rect(mg,ry,cw,th,"F");}
      doc.setFontSize(8);doc.setFont("helvetica","bold");doc.setTextColor(15,23,42);doc.text(emp.name,cx[0]+2,ry+4.8);
      doc.setFont("helvetica","normal");doc.setTextColor(100,116,139);doc.text(emp.dept||"",cx[1]+2,ry+4.8);
      doc.setTextColor(79,70,229);doc.text(fmtIN(d.gr),cx[2]+cws[2]-2,ry+4.8,{align:"right"});
      doc.setTextColor(220,38,38);doc.text(fmtIN(d.gr-d.net),cx[3]+cws[3]-2,ry+4.8,{align:"right"});
      doc.setTextColor(5,150,105);doc.setFont("helvetica","bold");doc.text(fmtIN(d.net),cx[4]+cws[4]-2,ry+4.8,{align:"right"});
      doc.setTextColor(217,119,6);doc.setFont("helvetica","normal");doc.text(fmtIN(d.gr+d.pfR+d.esiR),cx[5]+cws[5]-2,ry+4.8,{align:"right"});
      ry+=th;
      if(ry>H-30){doc.addPage();ry=14;}
    });
    var nety=ry+4;
    doc.setFillColor(15,23,42);doc.roundedRect(mg,nety,cw,16,2,2,"F");
    doc.setFontSize(8);doc.setFont("helvetica","normal");doc.setTextColor(180,180,180);doc.text("Total Net Payable",x+4,nety+6);
    doc.setFontSize(14);doc.setFont("helvetica","bold");doc.setTextColor(74,222,128);doc.text(fmtIN(tN),x+4,nety+13);
    doc.setFontSize(8);doc.setFont("helvetica","normal");doc.setTextColor(252,211,77);
    doc.text("Gross: "+fmtIN(tG)+"  |  Ded: "+fmtIN(tD)+"  |  CTC: "+fmtIN(tG+tP+tE),W-mg-4,nety+10,{align:"right"});
    var fy=H-6;
    doc.setDrawColor(226,232,240);doc.line(mg,fy-4,W-mg,fy-4);
    doc.setFontSize(7);doc.setTextColor(148,163,184);
    doc.text((orgName||"")+" | "+(orgEmail||""),mg,fy);doc.text("Generated by AdminHR",W-mg,fy,{align:"right"});
    downloadPDF(doc.output("blob"),"Payroll-"+MOS[m]+"-"+y+".pdf");
  },function(){alert("Failed to load PDF library.");});
}

function makeAttPDF(name,y,m,recs,orgName,orgEmail,orgPos,logoSrc){
  loadJsPDFGlobal(function(JsPDF){
    var doc=new JsPDF({orientation:"portrait",unit:"mm",format:"a4"});
    var W=210,mg=14,x=mg,cw=W-mg*2;
    var ATColors2={present:[5,150,105],absent:[220,38,38],half:[217,119,6],paid:[124,58,237],unpaid:[79,70,229],holiday:[14,165,233],unmarked:[148,163,184]};
    var counts={present:0,absent:0,half:0,paid:0,unpaid:0,holiday:0};
    Object.values(recs).forEach(function(v){if(counts[v]!==undefined)counts[v]++;});
    doc.setFillColor(15,23,42);doc.rect(0,0,W,22,"F");
    try{if(logoSrc&&logoSrc.startsWith("data:"))doc.addImage(logoSrc,"PNG",x,2,10,10,undefined,"FAST");}catch(e){}
    doc.setFontSize(9);doc.setTextColor(252,211,77);doc.setFont("helvetica","bold");doc.text("AdminHR",x+12,8);
    doc.setTextColor(255,255,255);doc.setFont("helvetica","normal");
    doc.setFontSize(7.5);doc.text(orgName||"",x,14);doc.text((orgPos||"")+" | "+(orgEmail||""),x,18.5);
    doc.setFontSize(10);doc.setFont("helvetica","bold");doc.text("ATTENDANCE RECORD",W-mg,9,{align:"right"});
    doc.setFontSize(7.5);doc.setFont("helvetica","normal");doc.text(name+" | "+MOS[m]+" "+y,W-mg,14,{align:"right"});
    var sy=28,chipW=26,chipH=14,gap=4;
    var chips=[["Present",counts.present,[5,150,105]],["Absent",counts.absent,[220,38,38]],["Half Day",counts.half,[217,119,6]],["Paid Lv",counts.paid,[124,58,237]],["Unpaid",counts.unpaid,[79,70,229]],["Holiday",counts.holiday,[14,165,233]]];
    chips.forEach(function(c,i){
      var cx=mg+i*(chipW+gap);
      doc.setFillColor(c[2][0],c[2][1],c[2][2]);
      doc.setGState(new doc.GState({opacity:0.12}));doc.roundedRect(cx,sy,chipW,chipH,2,2,"F");
      doc.setGState(new doc.GState({opacity:1}));
      doc.setFontSize(11);doc.setFont("helvetica","bold");doc.setTextColor(c[2][0],c[2][1],c[2][2]);
      doc.text(String(c[1]),cx+chipW/2,sy+6.5,{align:"center"});
      doc.setFontSize(6.5);doc.setFont("helvetica","normal");doc.setTextColor(100,116,139);
      doc.text(c[0],cx+chipW/2,sy+11.5,{align:"center"});
    });
    var ry=sy+chipH+6;
    doc.setFillColor(15,23,42);doc.rect(mg,ry,cw,6,"F");
    doc.setFontSize(7.5);doc.setFont("helvetica","bold");doc.setTextColor(255,255,255);
    doc.text("DATE",x+2,ry+4.2);doc.text("STATUS",W-mg-2,ry+4.2,{align:"right"});
    ry+=6;
    Object.entries(recs).sort().forEach(function(kv,i){
      var s=kv[1],col=ATColors2[s]||[148,163,184];
      if(i%2===0){doc.setFillColor(248,250,252);doc.rect(mg,ry,cw,6,"F");}
      doc.setFontSize(8);doc.setFont("helvetica","normal");doc.setTextColor(15,23,42);doc.text(kv[0],x+2,ry+4.2);
      doc.setTextColor(col[0],col[1],col[2]);doc.setFont("helvetica","bold");
      doc.text(ATL[s]||s,W-mg-2,ry+4.2,{align:"right"});
      ry+=6;if(ry>280){doc.addPage();ry=14;}
    });
    doc.setDrawColor(226,232,240);doc.line(mg,287,W-mg,287);
    doc.setFontSize(7);doc.setFont("helvetica","normal");doc.setTextColor(148,163,184);
    doc.text((orgName||"")+" | "+(orgEmail||""),mg,291);doc.text("Generated by AdminHR",W-mg,291,{align:"right"});
    downloadPDF(doc.output("blob"),"Attendance-"+name.replace(/\s+/g,"-")+"-"+MOS[m]+"-"+y+".pdf");
  },function(){alert("Failed to load PDF library.");});
}

function makeEmpPDF(emps,orgName,orgEmail,orgPos,logoSrc){
  loadJsPDFGlobal(function(JsPDF){
    var doc=new JsPDF({orientation:"landscape",unit:"mm",format:"a4"});
    var W=297,H=210,mg=14,cw=W-mg*2,th=7;
    doc.setFillColor(15,23,42);doc.rect(0,0,W,22,"F");
    try{if(logoSrc&&logoSrc.startsWith("data:"))doc.addImage(logoSrc,"PNG",mg,2,10,10,undefined,"FAST");}catch(e){}
    doc.setFontSize(9);doc.setTextColor(252,211,77);doc.setFont("helvetica","bold");doc.text("AdminHR",mg+12,8);
    doc.setTextColor(255,255,255);doc.setFont("helvetica","normal");
    doc.setFontSize(7.5);doc.text(orgName||"",mg,14);doc.text((orgPos||"")+" | "+(orgEmail||""),mg,18.5);
    doc.setFontSize(11);doc.setFont("helvetica","bold");doc.text("EMPLOYEE RECORDS",W-mg,9,{align:"right"});
    var nd=new Date();doc.setFontSize(7.5);doc.setFont("helvetica","normal");
    doc.text(emps.length+" employees | "+(nd.getDate()+"/"+(nd.getMonth()+1)+"/"+nd.getFullYear()),W-mg,14,{align:"right"});
    var ry=28;
    var cols=["NAME","EMP ID","ROLE","DEPT","MOBILE","MONTHLY CTC","STATUS"];
    var cws=[45,22,38,30,28,28,20];
    var cx=[mg];for(var i=0;i<cws.length-1;i++)cx.push(cx[i]+cws[i]);
    doc.setFillColor(15,23,42);doc.rect(mg,ry,cw,th,"F");
    doc.setFontSize(7);doc.setFont("helvetica","bold");doc.setTextColor(255,255,255);
    cols.forEach(function(col,i){doc.text(col,cx[i]+2,ry+4.5);});
    ry+=th;
    emps.forEach(function(emp,ei){
      if(ei%2===0){doc.setFillColor(248,250,252);doc.rect(mg,ry,cw,th,"F");}
      doc.setFontSize(7.5);doc.setFont("helvetica","bold");doc.setTextColor(15,23,42);doc.text(emp.name||"",cx[0]+2,ry+4.5);
      doc.setFont("helvetica","normal");doc.setTextColor(100,116,139);
      doc.text(emp.eid||"",cx[1]+2,ry+4.5);
      doc.text((emp.role||"").substring(0,20),cx[2]+2,ry+4.5);
      doc.text(emp.dept||"",cx[3]+2,ry+4.5);
      doc.text(emp.mob||"",cx[4]+2,ry+4.5);
      doc.setTextColor(5,150,105);doc.setFont("helvetica","bold");
      doc.text(fmtIN(emp.monthlyCTC),cx[5]+cws[5]-2,ry+4.5,{align:"right"});
      var statusCol=emp.status==="active"?[5,150,105]:[220,38,38];
      doc.setTextColor(statusCol[0],statusCol[1],statusCol[2]);
      doc.text(emp.status==="active"?"Active":"Offboarded",cx[6]+2,ry+4.5);
      ry+=th;
      if(ry>H-16){doc.addPage();ry=14;}
    });
    doc.setDrawColor(226,232,240);doc.line(mg,H-8,W-mg,H-8);
    doc.setFontSize(7);doc.setFont("helvetica","normal");doc.setTextColor(148,163,184);
    doc.text((orgName||"")+" | "+(orgEmail||""),mg,H-4);
    doc.text("Generated by AdminHR",W-mg,H-4,{align:"right"});
    downloadPDF(doc.output("blob"),"Employees-"+nd.getFullYear()+".pdf");
  },function(){alert("Failed to load PDF library.");});
}
function makeAttSummaryPDF(emps,att,m,y,orgName,orgEmail,orgPos,logoSrc){
  loadJsPDFGlobal(function(JsPDF){
    var doc=new JsPDF({orientation:"landscape",unit:"mm",format:"a4"});
    var W=297,H=210,mg=14,cw=W-mg*2,th=7;
    doc.setFillColor(15,23,42);doc.rect(0,0,W,22,"F");
    try{if(logoSrc&&logoSrc.startsWith("data:"))doc.addImage(logoSrc,"PNG",mg,2,10,10,undefined,"FAST");}catch(e){}
    doc.setFontSize(9);doc.setTextColor(252,211,77);doc.setFont("helvetica","bold");doc.text("AdminHR",mg+12,8);
    doc.setTextColor(255,255,255);doc.setFont("helvetica","normal");
    doc.setFontSize(7.5);doc.text(orgName||"",mg,14);doc.text((orgPos||"")+" | "+(orgEmail||""),mg,18.5);
    doc.setFontSize(11);doc.setFont("helvetica","bold");doc.text("ATTENDANCE SUMMARY",W-mg,9,{align:"right"});
    var nd=new Date();doc.setFontSize(7.5);doc.setFont("helvetica","normal");
    doc.text(MOS[m]+" "+y+" | "+(nd.getDate()+"/"+(nd.getMonth()+1)+"/"+nd.getFullYear()),W-mg,14,{align:"right"});
    var ry=28;
    var cols=["EMPLOYEE","PRESENT","ABSENT","HALF DAY","PAID LV","UNPAID LV","HOLIDAY","DEDUCTION"];
    var cws=[50,22,22,22,22,22,22,30];
    var cx=[mg];for(var i=0;i<cws.length-1;i++)cx.push(cx[i]+cws[i]);
    doc.setFillColor(15,23,42);doc.rect(mg,ry,cw,th,"F");
    doc.setFontSize(7);doc.setFont("helvetica","bold");doc.setTextColor(255,255,255);
    cols.forEach(function(col,i){doc.text(col,cx[i]+2,ry+4.5);});
    ry+=th;
    var prefix=y+"-"+String(m+1).padStart(2,"0");
    emps.filter(function(e){return e.status==="active";}).forEach(function(emp,ei){
      var counts={present:0,absent:0,half:0,paid:0,unpaid:0,holiday:0};
      Object.entries(att).forEach(function(kv){
        if(kv[0].endsWith("_"+emp.id)&&kv[0].startsWith(prefix)){
          if(counts[kv[1]]!==undefined)counts[kv[1]]++;
        }
      });
      var d=calcPay(emp,counts.absent,counts.half,counts.unpaid);
      if(ei%2===0){doc.setFillColor(248,250,252);doc.rect(mg,ry,cw,th,"F");}
      doc.setFontSize(7.5);doc.setFont("helvetica","bold");doc.setTextColor(15,23,42);doc.text(emp.name||"",cx[0]+2,ry+4.5);
      doc.setFont("helvetica","normal");
      doc.setTextColor(5,150,105);doc.text(String(counts.present),cx[1]+cws[1]/2,ry+4.5,{align:"center"});
      doc.setTextColor(220,38,38);doc.text(String(counts.absent),cx[2]+cws[2]/2,ry+4.5,{align:"center"});
      doc.setTextColor(217,119,6);doc.text(String(counts.half),cx[3]+cws[3]/2,ry+4.5,{align:"center"});
      doc.setTextColor(124,58,237);doc.text(String(counts.paid),cx[4]+cws[4]/2,ry+4.5,{align:"center"});
      doc.setTextColor(79,70,229);doc.text(String(counts.unpaid),cx[5]+cws[5]/2,ry+4.5,{align:"center"});
      doc.setTextColor(14,165,233);doc.text(String(counts.holiday),cx[6]+cws[6]/2,ry+4.5,{align:"center"});
      doc.setTextColor(d.ad+d.hd+d.ud>0?[220,38,38]:[5,150,105]);
      doc.setFont("helvetica","bold");doc.text(d.ad+d.hd+d.ud>0?"-"+fmtIN(d.ad+d.hd+d.ud):"Nil",cx[7]+cws[7]-2,ry+4.5,{align:"right"});
      ry+=th;
      if(ry>H-16){doc.addPage();ry=14;}
    });
    doc.setDrawColor(226,232,240);doc.line(mg,H-8,W-mg,H-8);
    doc.setFontSize(7);doc.setFont("helvetica","normal");doc.setTextColor(148,163,184);
    doc.text((orgName||"")+" | "+(orgEmail||""),mg,H-4);
    doc.text("Generated by AdminHR",W-mg,H-4,{align:"right"});
    downloadPDF(doc.output("blob"),"Attendance-Summary-"+MOS[m]+"-"+y+".pdf");
  },function(){alert("Failed to load PDF library.");});
}
function makePayrollCSV(emps,m,y,mAttFn,incFn){
  var header=["Name","Dept","Gross","Absent Ded","Half Ded","Unpaid Ded","PF Emp","ESI Emp","Prof Tax","TDS","Health Ins","Custom","Net Pay","Er PF","Er ESI","Total CTC"];
  var rows=emps.map(function(emp){
    var ma=mAttFn(emp.id,y,m),inc=incFn(emp.id,y,m),d=calcPay(emp,ma.absent,ma.half,ma.unpaid,inc);
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
  var a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=filename;document.body.appendChild(a);a.click();document.body.removeChild(a);
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

function lsGet(key,def){try{var v=localStorage.getItem(key);return v!==null?JSON.parse(v):def;}catch(e){return def;}}
function lsSet(key,val){try{localStorage.setItem(key,JSON.stringify(val));}catch(e){}}
function loadJsPDFGlobal(cb,onErr){
  if(window.jspdf&&window.jspdf.jsPDF){cb(window.jspdf.jsPDF);return;}
  var s=document.getElementById("jspdf-script");
  if(!s){
    s=document.createElement("script");
    s.id="jspdf-script";
    s.src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    document.head.appendChild(s);
  }
  s.addEventListener("load",function(){cb(window.jspdf.jsPDF);},{once:true});
  s.addEventListener("error",function(){if(onErr)onErr();},{once:true});
  if(s.dataset.loaded==="1")cb(window.jspdf.jsPDF);
  s.onload=function(){s.dataset.loaded="1";};
}
function downloadPDF(blob,filename){
  var url=URL.createObjectURL(blob);
  var a=document.createElement("a");
  a.href=url;a.download=filename;
  document.body.appendChild(a);a.click();document.body.removeChild(a);
  setTimeout(function(){URL.revokeObjectURL(url);},30000);
}
function fmtIN(n){var v=Math.round(Number(n||0));if(v<1000)return "Rs."+v;var s=String(v);var last3=s.slice(-3);var rest=s.slice(0,-3);var grouped=rest.replace(/\B(?=(\d{2})+(?!\d))/g,",");return "Rs."+(grouped?grouped+","+last3:last3);}

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
function row(l,v,vc){return h("div",{key:l,style:{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid "+BDR}},h("span",{style:{fontSize:12,color:GRY}},l),h("span",{style:{fontSize:12,fontWeight:600,color:vc||NVY}},v));}
function lbl(t){return h("div",{style:{fontSize:11,color:GRY,marginBottom:4,fontWeight:600,letterSpacing:.4}},t);}
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
  var today=new Date(),todayStr=today.toISOString().split("T")[0];
  var curY=today.getFullYear(),curM=today.getMonth();
  var st=useState,sr=useRef,se=useEffect,uc=useCallback;



  // Theme — load from localStorage, default to light
  var initTheme="light";try{var saved=localStorage.getItem("hr_theme");if(saved==="dark"||saved==="light")initTheme=saved;}catch(e){}
  var sTh=st(initTheme),themeMode=sTh[0],setThemeMode=sTh[1];
  applyTheme(themeMode);  // Sync module-level colors to current theme on every render
  var CSS_LIVE=buildCSS(); // Rebuild CSS string for current theme

  var sS=st(function(){var gu=lsGet("hr_guser",null);return gu&&gu.email?"app":"login";}),screen=sS[0],setScreen=sS[1];
  var sUPD=st(false),showUpdate=sUPD[0],setShowUpdate=sUPD[1];
  var sADM=st(false),isAdmin=sADM[0],setIsAdmin=sADM[1];
  var sADMUSERS=st([]),adminUsers=sADMUSERS[0],setAdminUsers=sADMUSERS[1];
  var sADMTAB=st("users"),adminTab=sADMTAB[0],setAdminTab=sADMTAB[1];
  var sShowAdmin=st(false),showAdmin=sShowAdmin[0],setShowAdmin=sShowAdmin[1];
  se(function(){
    if(!("serviceWorker" in navigator))return;
    navigator.serviceWorker.addEventListener("message",function(e){
      if(e.data&&e.data.type==="NEW_VERSION")setShowUpdate(true);
    });
    window.addEventListener("focus",function(){
      navigator.serviceWorker.getRegistrations().then(function(regs){
        regs.forEach(function(reg){reg.update();});
      });
    });
  },[]);
  var sT=st("dashboard"),tab=sT[0],setTab=sT[1];
  var sE=st(function(){return lsGet("hr_emps",EMPS);}),emps=sE[0],setEmps=sE[1];
  var sA=st(function(){return lsGet("hr_att",{});}),att=sA[0],setAtt=sA[1];
  var sI=st(function(){return lsGet("hr_inc",{});}),incentives=sI[0],setIncentives=sI[1];
  var sSE=st(null),selE=sSE[0],setSelE=sSE[1];
  var sEE=st(null),editE=sEE[0],setEditE=sEE[1];
  var sEP=st(null),editPayE=sEP[0],setEditPayE=sEP[1];
  var sPM=st(curM),payM=sPM[0],setPayM=sPM[1];
  var sPY=st(curY),payY=sPY[0],setPayY=sPY[1];
  var sAM=st(curM),attM=sAM[0],setAttM=sAM[1];
  var sAY=st(curY),attY=sAY[0],setAttY=sAY[1];
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
  var sSTab=st("profile"),settTab=sSTab[0],setSettTab=sSTab[1];
  var sET=st("active"),empTab=sET[0],setEmpTab=sET[1];
  var sOE=st(null),offE=sOE[0],setOffE=sOE[1];
  var sOS=st(1),offStep=sOS[0],setOffStep=sOS[1];
  var sOD=st({reason:"",type:"resigned",handover:[],note:"",resignDate:""}),offData=sOD[0],setOffData=sOD[1];
  var sNW=st(new Date()),now=sNW[0],setNow=sNW[1];
  var sBR=st([]),bRemind=sBR[0],setBRemind=sBR[1];
  var sSB=st([]),skipB=sSB[0],setSkipB=sSB[1];
  var sOR=st(function(){return lsGet("hr_org",{name:"",type:"",email:"",position:"",plan:"free"});}),org=sOR[0],setOrg=sOR[1];
  var sSQ=st(""),searchQ=sSQ[0],setSearchQ=sSQ[1];
  var sPW=st(""),pwd=sPW[0],setPwd=sPW[1];
  var sPW2=st(""),pwd2=sPW2[0],setPwd2=sPW2[1];
  var sDept=st(""),dept=sDept[0],setDept=sDept[1];
  var sPF=st(true),pf=sPF[0],setPf=sPF[1];
  var sPFM=st("capped"),pfMode=sPFM[0],setPfMode=sPFM[1];
  var sESI=st(false),esi=sESI[0],setEsi=sESI[1];
  var sPT=st(true),pt=sPT[0],setPt=sPT[1];
  var sTDS=st(true),tds=sTDS[0],setTds=sTDS[1];
  var sCU=st([]),customs=sCU[0],setCustoms=sCU[1];
  var sED=st(""),eDept=sED[0],setEDept=sED[1];
  var sEPF=st(true),ePf=sEPF[0],setEPf=sEPF[1];
  var sEPM=st("capped"),ePfM=sEPM[0],setEPfM=sEPM[1];
  var sEES=st(false),eEsi=sEES[0],setEEsi=sEES[1];
  var sEPT=st(true),ePt=sEPT[0],setEPt=sEPT[1];
  var sETD=st(true),eTds=sETD[0],setETds=sETD[1];
  var sGU=st(function(){return lsGet("hr_guser",null);}),gUser=sGU[0],setGUser=sGU[1];
  var sAEM=st(""),authEmail=sAEM[0],setAuthEmail=sAEM[1];
  var sAPW=st(""),authPwd=sAPW[0],setAuthPwd=sAPW[1];
  var sAPW2=st(""),authPwd2=sAPW2[0],setAuthPwd2=sAPW2[1];
  var sAMD=st("signin"),authMode=sAMD[0],setAuthMode=sAMD[1];
  var sAER=st(""),authErr=sAER[0],setAuthErr=sAER[1];
  var sALD=st(false),authLoading=sALD[0],setAuthLoading=sALD[1];
  var sShowPw=st(false),showPw=sShowPw[0],setShowPw=sShowPw[1];
  var sSetup=st(false),setupDone=sSetup[0],setSetupDone=sSetup[1];
  var sCN=st(""),setupCompany=sCN[0],setSetupCompany=sCN[1];
  var sPOS=st(""),setupPosition=sPOS[0],setSetupPosition=sPOS[1];
  var sSOT=st(""),setupOrgType=sSOT[0],setSetupOrgType=sSOT[1];
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
  var sPayFilt=st("all"),payFilt=sPayFilt[0],setPayFilt=sPayFilt[1];
  var sPayDept=st(""),payDept=sPayDept[0],setPayDept=sPayDept[1];
  var sSHIFTS=st(function(){return lsGet("hr_shifts",{});}),shifts=sSHIFTS[0],setShifts=sSHIFTS[1];
  var sShiftTab=st("list"),shiftTab=sShiftTab[0],setShiftTab=sShiftTab[1];
  var sShiftOpen=st(false),shiftOpen=sShiftOpen[0],setShiftOpen=sShiftOpen[1];


  var n1=sr(""),n2=sr(""),n3=sr(""),n4=sr(""),n5=sr("");
  var e1=sr(""),e2=sr(""),e3=sr("");
  var id1=sr(""),id2=sr(""),id3=sr("");
  var hiR=sr(""),cnR=sr(null),caR=sr(null);
  var revCtcR=sr(null),revDateR=sr(null),revNoteR=sr(null);
  var edn=sr(null),edm=sr(null),edem=sr(null),edei=sr(null),edro=sr(null),edctc=sr(null),edhi=sr(null),edpa=sr(null),edua=sr(null);

  se(function(){if(screen!=="app")return;var t=setInterval(function(){setNow(new Date());},1000);return function(){clearInterval(t);};},[screen]);
  se(function(){
    // Restore Supabase session on load (handles email confirmation redirect)
    _sb.auth.getSession().then(function(res){
      if(res.data&&res.data.session&&res.data.session.user){
        var user=res.data.session.user;
        var gu={name:user.email.split("@")[0],email:user.email,photo:""};
        setGUser(gu);lsSet("hr_guser",gu);
        var savedOrg=lsGet("hr_org_"+user.email,null);
        if(savedOrg&&savedOrg.name){setOrg(savedOrg);setScreen("app");}
        else if(screen==="login")setScreen("setup");
      }
    });
    // Listen for auth changes (email confirmation)
    var sub=_sb.auth.onAuthStateChange(function(event,session){
      if(event==="SIGNED_IN"&&session){
        var user=session.user;
        var gu={name:user.email.split("@")[0],email:user.email,photo:""};
        setGUser(gu);lsSet("hr_guser",gu);
        var savedOrg=lsGet("hr_org_"+user.email,null);
        if(savedOrg&&savedOrg.name){setOrg(savedOrg);setScreen("app");showT("Welcome back!");}
        else setScreen("setup");
      }
    });
    return function(){sub.data&&sub.data.subscription&&sub.data.subscription.unsubscribe();};
  },[]);

  // ── Supabase session verification on app load ──────────────────────────────
  // Checks with Supabase if the session is still valid on every app open.
  // If user was deleted from Supabase, this forces logout automatically.
  se(function(){
    _sb.auth.getSession().then(function(res){
      var session=res.data&&res.data.session;
      if(!session){
        // No valid Supabase session — force logout regardless of localStorage
        if(lsGet("hr_guser",null)){
          lsSet("hr_guser",null);
          setGUser(null);
          setScreen("login");
        }
        return;
      }
      // Valid session — ensure localStorage is in sync
      var email=session.user.email;
      var gu={name:email.split("@")[0],email:email,photo:""};
      setGUser(gu);
      var savedOrg=lsGet("hr_org_"+email,null);
      if(screen==="login"){
        if(savedOrg&&savedOrg.name){setOrg(savedOrg);setScreen("app");}
        else setScreen("setup");
      }
    });
    // Listen for auth state changes (logout from another tab, token expiry, user deleted)
    var sub=_sb.auth.onAuthStateChange(function(event,session){
      if(event==="SIGNED_OUT"||!session){
        lsSet("hr_guser",null);
        setGUser(null);
        setScreen("login");
      }
    });
    return function(){sub.data&&sub.data.subscription&&sub.data.subscription.unsubscribe();};
  },[]);
  se(function(){lsSet("hr_emps",emps);},[emps]);
  se(function(){lsSet("hr_att",att);},[att]);
  se(function(){lsSet("hr_inc",incentives);},[incentives]);
  se(function(){lsSet("hr_org",org);},[org]);
  se(function(){lsSet("hr_revisions",revisions);},[revisions]);
  se(function(){lsSet("hr_notices",notices);},[notices]);
  se(function(){lsSet("hr_reminders",reminders);},[reminders]);
  se(function(){lsSet("hr_shifts",shifts);},[shifts]);
  se(function(){
    var td=new Date(),tdDate=new Date(td.getFullYear(),td.getMonth(),td.getDate());
    var upcoming=emps.filter(function(e){return e.status==="active"&&e.dob&&!skipB.includes(e.id);}).filter(function(e){
      var dob=new Date(e.dob),bday=new Date(td.getFullYear(),dob.getMonth(),dob.getDate());
      if(bday<tdDate)bday.setFullYear(td.getFullYear()+1);
      var diff=Math.ceil((bday-tdDate)/86400000);
      return diff<=30;
    });
    setBRemind(upcoming);
  },[emps,skipB]);


  function showT(msg,type){setToast({msg:msg,type:type||"ok"});setTimeout(function(){setToast(null);},2500);}
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

  var getInc=uc(function(id,y,m2){return incentives[id+"_"+y+"_"+m2]||0;},[incentives]);

  var OWNER_EMAIL="authorhalik@gmail.com";
  var isPaid=org.plan==="paid"||(gUser&&gUser.email===OWNER_EMAIL);
  var isFree=!isPaid;
  var EMP_LIMIT=org.emp_limit||(isPaid?org.emp_limit||999:5); // free=5, paid=set by admin
  var isAdmin=(gUser&&gUser.email===OWNER_EMAIL)||false;
  function needPaid(){showT("This feature requires Paid Plan. Upgrade to access.","err");}
  var actEmps=emps.filter(function(e){return e.status==="active";});
  var trmEmps=emps.filter(function(e){return e.status==="terminated"||e.status==="resigned";});
  var tGross=actEmps.reduce(function(a,e){var ma=mAtt(e.id,curY,curM),inc=getInc(e.id,curY,curM);return a+calcPay(e,ma.absent,ma.half,ma.unpaid,inc,getShiftAllow(e.id,curY,curM)).gr;},0);
  var tNet=actEmps.reduce(function(a,e){var ma=mAtt(e.id,curY,curM),inc=getInc(e.id,curY,curM);return a+calcPay(e,ma.absent,ma.half,ma.unpaid,inc,getShiftAllow(e.id,curY,curM)).net;},0);

  function cycleAtt(date,id){
    var cur=getAtt(date,id),nxt=ATO[(ATO.indexOf(cur)+1)%ATO.length];
    setAtt(function(v){var o=Object.assign({},v);o[ak(date,id)]=nxt;return o;});
    var emp=emps.find(function(e){return e.id===id;});
    showT((emp?emp.name:"")+": "+ATL[nxt]);
  }
  function markHolidayAll(date){
    setAtt(function(v){var o=Object.assign({},v);actEmps.forEach(function(e){o[ak(date,e.id)]="holiday";});return o;});
    showT("Holiday marked for all");
  }

  function checkEmpLimit(){
    if(gUser&&gUser.email===OWNER_EMAIL)return true; // owner unlimited
    var limit=org.emp_limit||(isPaid?999:5);
    if(actEmps.length>=limit){showT("Employee limit reached ("+limit+"). "+(isPaid?"Contact support to increase.":"Upgrade to Paid for more."),"err");return false;}
    return true;
  }
  function saveEmp(){
    if(!checkEmpLimit())return;
    var name=(n1.current&&n1.current.value)||"";if(!name)return showT("Name required","err");
    var ctc=Number(e3.current&&e3.current.value)||0;if(!ctc)return showT("Monthly CTC required","err");
    var bd=brkSal(ctc);
    var emp={id:Date.now(),name:name,dob:(n2.current&&n2.current.value)||"",mob:(n3.current&&n3.current.value)||"",email:(n4.current&&n4.current.value)||"",eid:(e1.current&&e1.current.value)||"",role:(e2.current&&e2.current.value)||"",dept:dept,monthlyCTC:ctc,basic:bd.basic,hra:bd.hra,allow:bd.allow,joined:(n5.current&&n5.current.value)||todayStr,pan:(id2.current&&id2.current.value)||"",uan:(id3.current&&id3.current.value)||"",aadhar:(id1.current&&id1.current.value)||"",pf:pf,pfMode:pfMode,esi:esi,pt:pt,tds:tds,hi:Number((hiR.current&&hiR.current.value))||0,customs:customs,av:name.split(" ").map(function(w){return w[0];}).join("").slice(0,2).toUpperCase(),col:COLS[emps.length%COLS.length],status:"active"};
    setEmps(function(p){return p.concat([emp]);});
    [n1,n2,n3,n4,n5,e1,e2,e3,id1,id2,id3,hiR].forEach(function(r){if(r&&r.current)r.current.value="";});
    setDept("");setPf(true);setPfMode("capped");setEsi(false);setPt(true);setTds(true);setCustoms([]);
    setStep(1);setAddOpen(false);showT(name+" added!");
  }
  function openEdit(emp){
    setEditE(Object.assign({},emp));setEDept(emp.dept||"");setEPf(emp.pf);setEPfM(emp.pfMode||"capped");setEEsi(emp.esi);setEPt(emp.pt);setETds(emp.tds!==false);
    setTimeout(function(){
      if(edn.current)edn.current.value=emp.name||"";if(edm.current)edm.current.value=emp.mob||"";
      if(edem.current)edem.current.value=emp.email||"";if(edei.current)edei.current.value=emp.eid||"";
      if(edro.current)edro.current.value=emp.role||"";if(edctc.current)edctc.current.value=String(emp.monthlyCTC||"");
      if(edhi.current)edhi.current.value=String(emp.hi||"");if(edpa.current)edpa.current.value=emp.pan||"";
      if(edua.current)edua.current.value=emp.uan||"";
    },60);
  }
  function saveEdit(){
    var ctc=Number(edctc.current?edctc.current.value:"")||editE.monthlyCTC,bd=brkSal(ctc);
    setEmps(function(p){return p.map(function(e){if(e.id!==editE.id)return e;return Object.assign({},e,{name:edn.current?edn.current.value||e.name:e.name,mob:edm.current?edm.current.value:e.mob,email:edem.current?edem.current.value:e.email,eid:edei.current?edei.current.value:e.eid,role:edro.current?edro.current.value:e.role,dept:eDept||e.dept,monthlyCTC:ctc,basic:bd.basic,hra:bd.hra,allow:bd.allow,hi:Number(edhi.current?edhi.current.value:"")||e.hi,pf:ePf,pfMode:ePfM,esi:eEsi,pt:ePt,tds:eTds});});});
    setEditE(null);setSelE(null);showT("Employee updated!");
  }
  function confirmOff(){
    if(!offData.reason)return showT("Enter reason","err");
    setEmps(function(p){return p.map(function(e){return e.id===offE.id?Object.assign({},e,{status:offData.type,terminatedOn:todayStr,resignDate:offData.resignDate,terminationData:Object.assign({},offData)}):e;});});
    setOffE(null);setOffStep(1);setOffData({reason:"",type:"resigned",handover:[],note:"",resignDate:""});setSelE(null);showT("Offboarded.");
  }
  function loadAdminUsers(){
    _sb.from("admin_user_overview").select("email,plan,is_admin,activated_on,expires_on,notes,joined_at,last_sign_in_at,email_confirmed_at,emp_limit")
    .then(function(res){
      if(res.data)setAdminUsers(res.data);
      else if(res.error)showT("Error loading users: "+res.error.message,"err");
    });
  }
  function setUserPlan(email,plan){
    _sb.from("user_plans").upsert({email:email,plan:plan,activated_on:plan==="paid"?new Date().toISOString().split("T")[0]:null},{onConflict:"email"})
    .then(function(){loadAdminUsers();showT(email.split("@")[0]+" set to "+plan);});
  }
  function removeEmp(id){setEmps(function(p){return p.filter(function(e){return e.id!==id;});});showT("Deleted.");}

  function sharePayslip(emp,d,m2,y){
    if(!emp.mob){showT("No mobile number saved","err");return;}
    var text=org.name+" | Payslip for "+emp.name+" - "+MOS[m2]+" "+y+"\nNet Take Home: "+fmtIN(d.net)+"\n\nKindly find the payslip PDF shared separately.";
    window.open("https://wa.me/91"+emp.mob+"?text="+encodeURIComponent(text),"_blank");
  }
  function shareAtt(emp){
    if(!emp.mob){showT("No mobile number saved","err");return;}
    var ma=mAtt(emp.id,attY,attM);
    var text=org.name+" | Attendance for "+emp.name+" - "+MOS[attM]+" "+attY+"\nPresent: "+ma.present+" | Absent: "+ma.absent+" | Half Day: "+ma.half;
    window.open("https://wa.me/91"+emp.mob+"?text="+encodeURIComponent(text),"_blank");
  }

  var timeStr=now.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",second:"2-digit"});
  function getShiftAllow(empId,y,m){
    var es=shifts[empId];if(!es)return 0;
    var key=y+"-"+(m+1<10?"0":"")+(m+1);
    var entry=(es.log||[]).find(function(l){return l.month===key;});
    return Number((entry?entry.allowance:es.allowance)||0);
  }
  var darkGrad="linear-gradient(155deg,#0F172A 0%,#1E1B4B 55%,#312E81 100%)";

  // ── RENDER - pure createElement, zero JSX ──────────────────────
  // Brand logo - actual image embedded as base64
  var LOGO_SRC="data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAYbBhsDASIAAhEBAxEB/8QAHQABAQADAQEBAQEAAAAAAAAAAAgGBwkFBAMBAv/EAFQQAQABAwICBAcMBgYJAgUFAAABAgMEBQYIEQcSITcTMUFRYXXBFBUYMlZxdIGVsbPTIkJSYpGhFiNygpKTJTM0Q1VjorLRCXMkU6PC8ERkg8Ph/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AJqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/2Q==";
  var logoSVG=function(size){var s=size||64;return h("img",{src:LOGO_SRC,alt:"Logo",width:s,height:s,style:{display:"block",borderRadius:Math.round(s*0.22)}});};

  // Simple password hash (djb2) — good enough for localStorage auth
  function hashPwd(str){var h=5381;for(var i=0;i<str.length;i++)h=((h<<5)+h)^str.charCodeAt(i);return String(h>>>0);}

  function handleSignIn(){
    if(!authEmail.trim())return setAuthErr("Enter your email");
    if(!authPwd)return setAuthErr("Enter your password");
    setAuthLoading(true);setAuthErr("");
    _sb.auth.signInWithPassword({email:authEmail.trim().toLowerCase(),password:authPwd})
    .then(function(res){
      if(res.error){setAuthErr(res.error.message);setAuthLoading(false);return;}
      var email=res.data.user.email;
      var gu={name:email.split("@")[0],email:email,photo:""};
      setGUser(gu);lsSet("hr_guser",gu);
      var savedOrg=lsGet("hr_org_"+email,null)||{};
      // Fetch plan from Supabase user_plans table
      _sb.from("user_plans").select("plan,is_admin,expires_on").eq("email",email).maybeSingle()
      .then(function(planRes){
        var plan=(planRes.data&&planRes.data.plan)||"free";
        var admin=(planRes.data&&planRes.data.is_admin)||false;
        var empLimit=(planRes.data&&planRes.data.emp_limit)||null;
        var expiresOn=(planRes.data&&planRes.data.expires_on)||null;
        setIsAdmin(admin);
        var updatedOrg=Object.assign({},savedOrg,{plan:plan,expires_on:expiresOn});
        lsSet("hr_org_"+email,updatedOrg);
        if(updatedOrg.name){setOrg(updatedOrg);setScreen("app");showT("Welcome back!");}
        else setScreen("setup");
        setAuthLoading(false);
      }).catch(function(){
        if(savedOrg.name){setOrg(savedOrg);setScreen("app");showT("Welcome back!");}
        else setScreen("setup");
        setAuthLoading(false);
      });
    }).catch(function(e){setAuthErr(e.message||"Sign in failed");setAuthLoading(false);});
  }

  function handleSignUp(){
    if(!authEmail.trim())return setAuthErr("Enter your email");
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authEmail.trim()))return setAuthErr("Enter a valid email address");
    if(!authPwd)return setAuthErr("Enter a password");
    if(authPwd.length<6)return setAuthErr("Password must be at least 6 characters");
    if(authPwd!==authPwd2)return setAuthErr("Passwords do not match");
    setAuthLoading(true);setAuthErr("");
    _sb.auth.signUp({email:authEmail.trim().toLowerCase(),password:authPwd})
    .then(function(res){
      if(res.error){setAuthErr(res.error.message);setAuthLoading(false);return;}
      // Check if email confirmation is required
      var user=res.data.user;
      var confirmed=user&&user.email_confirmed_at;
      var identities=user&&user.identities;
      // If identities is empty, email already exists
      if(identities&&identities.length===0){
        setAuthErr("An account already exists with this email. Please sign in.");
        setAuthLoading(false);return;
      }
      if(!confirmed){
        // Email confirmation required - show message
        setAuthErr("");
        setAuthLoading(false);
        showT("Check your email to confirm your account!");
        setAuthMode("signin");
        return;
      }
      var email=user.email;
      var gu={name:email.split("@")[0],email:email,photo:""};
      setGUser(gu);lsSet("hr_guser",gu);
      setScreen("setup");
      setAuthLoading(false);
    }).catch(function(e){setAuthErr(e.message||"Sign up failed");setAuthLoading(false);});
  }

  var makeInIndiaBadge=h("div",{style:{textAlign:"center",padding:"0 0 20px",marginTop:"auto"}},
    h("div",{style:{fontSize:9,color:T.AUTH_LABEL,letterSpacing:.8}},"Proudly built in India • Made for Indian Businesses")
  );
  var authWrap=function(inner){return h("div",{style:{minHeight:"100vh",background:T.AUTH_BG,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px 24px 0"}},
    h("div",{style:{width:"100%",maxWidth:380,flex:1,display:"flex",flexDirection:"column",justifyContent:"center"}},inner),
    h("div",{style:{width:"100%",maxWidth:380}},makeInIndiaBadge)
  );};

  var loginScreen=authWrap(h("div",{key:"login"},
    h("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",marginBottom:32}},
      logoSVG(64),
      h("div",{style:{fontSize:26,fontWeight:800,color:T.AUTH_TEXT,marginTop:16,letterSpacing:-.5}},"Welcome back"),
      h("div",{style:{fontSize:13,color:T.AUTH_LABEL,marginTop:4}},"Sign in to your Admin HR workspace")
    ),
    h("div",{style:{fontSize:11,color:T.AUTH_LABEL,letterSpacing:1,marginBottom:5,fontWeight:600}},"EMAIL"),
    h("input",{type:"email",value:authEmail,onChange:function(e){setAuthEmail(e.target.value);setAuthErr("");},placeholder:"you@company.com",autoComplete:"email",style:{width:"100%",background:T.AUTH_INPUT_BG,border:"1.5px solid "+(authErr&&!authEmail?RED:T.AUTH_INPUT_BDR),borderRadius:12,padding:"13px 14px",fontSize:13,color:T.AUTH_TEXT,outline:"none",fontFamily:"inherit",marginBottom:10}}),
    h("div",{style:{fontSize:11,color:T.AUTH_LABEL,letterSpacing:1,marginBottom:5,fontWeight:600}},"PASSWORD"),
    h("div",{style:{position:"relative",marginBottom:0}},
      h("input",{type:showPw?"text":"password",value:authPwd,onChange:function(e){setAuthPwd(e.target.value);setAuthErr("");},onKeyDown:function(e){if(e.key==="Enter")handleSignIn();},placeholder:"Enter your password",autoComplete:"current-password",style:{width:"100%",background:T.AUTH_INPUT_BG,border:"1.5px solid "+T.AUTH_INPUT_BDR,borderRadius:12,padding:"13px 44px 13px 14px",fontSize:13,color:T.AUTH_TEXT,outline:"none",fontFamily:"inherit"}}),
      h("button",{onClick:function(){setShowPw(function(v){return !v;});},style:{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:T.AUTH_LABEL,fontSize:11,padding:2}},showPw?"Hide":"Show")
    ),
    authErr?h("div",{style:{background:RED+"15",border:"1px solid "+RED+"44",borderRadius:8,padding:"8px 12px",marginTop:10,fontSize:12,color:RED,fontWeight:500}},authErr):null,
    h("button",{onClick:handleSignIn,disabled:authLoading,style:{width:"100%",background:authLoading?T.AUTH_LABEL:T.AUTH_BTN_BG,border:"none",borderRadius:12,padding:"14px",color:T.AUTH_BTN_TEXT,fontSize:14,fontWeight:700,cursor:authLoading?"not-allowed":"pointer",marginTop:16,opacity:authLoading?.7:1}},
      authLoading?"Signing in...":"Sign In"
    ),
    h("div",{style:{textAlign:"center",marginTop:18,fontSize:12,color:T.AUTH_LABEL}},
      "Forgot password? ",
      h("span",{style:{color:T.AUTH_TEXT,cursor:"pointer",fontWeight:600},onClick:function(){showT("Contact support to reset your password");}},
        "Contact Support"
      )
    ),
    h("div",{style:{borderTop:"1px solid "+T.AUTH_INPUT_BDR,marginTop:20,paddingTop:18,textAlign:"center"}},
      h("div",{style:{fontSize:12,color:T.AUTH_LABEL,marginBottom:10}},"Don't have an account?"),
      h("button",{onClick:function(){setAuthMode("signup");setAuthErr("");setAuthPwd("");setAuthPwd2("");},style:{width:"100%",background:"transparent",border:"1.5px solid "+T.AUTH_INPUT_BDR,borderRadius:12,padding:"12px",color:T.AUTH_TEXT,fontSize:13,fontWeight:600,cursor:"pointer"}},"Create Account")
    )
  ));

  var signupScreen=authWrap(h("div",{key:"signup"},
    h("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",marginBottom:28}},
      logoSVG(52),
      h("div",{style:{fontSize:22,fontWeight:800,color:T.AUTH_TEXT,marginTop:14,letterSpacing:-.5}},"Create Account"),
      h("div",{style:{fontSize:12,color:T.AUTH_LABEL,marginTop:3}},"Set up your Admin HR account")
    ),
    h("div",{style:{fontSize:11,color:T.AUTH_LABEL,letterSpacing:1,marginBottom:5,fontWeight:600}},"EMAIL"),
    h("input",{type:"email",value:authEmail,onChange:function(e){setAuthEmail(e.target.value);setAuthErr("");},placeholder:"you@company.com",autoComplete:"email",style:{width:"100%",background:T.AUTH_INPUT_BG,border:"1.5px solid "+(authErr&&!authEmail?RED:T.AUTH_INPUT_BDR),borderRadius:12,padding:"13px 14px",fontSize:13,color:T.AUTH_TEXT,outline:"none",fontFamily:"inherit",marginBottom:10}}),
    h("div",{style:{fontSize:11,color:T.AUTH_LABEL,letterSpacing:1,marginBottom:5,fontWeight:600}},"PASSWORD"),
    h("div",{style:{position:"relative",marginBottom:10}},
      h("input",{type:showPw?"text":"password",value:authPwd,onChange:function(e){setAuthPwd(e.target.value);setAuthErr("");},placeholder:"Min. 6 characters",autoComplete:"new-password",style:{width:"100%",background:T.AUTH_INPUT_BG,border:"1.5px solid "+T.AUTH_INPUT_BDR,borderRadius:12,padding:"13px 44px 13px 14px",fontSize:13,color:T.AUTH_TEXT,outline:"none",fontFamily:"inherit"}}),
      h("button",{onClick:function(){setShowPw(function(v){return !v;});},style:{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:T.AUTH_LABEL,fontSize:11,padding:2}},showPw?"Hide":"Show")
    ),
    h("div",{style:{fontSize:11,color:T.AUTH_LABEL,letterSpacing:1,marginBottom:5,fontWeight:600}},"CONFIRM PASSWORD"),
    h("input",{type:showPw?"text":"password",value:authPwd2,onChange:function(e){setAuthPwd2(e.target.value);setAuthErr("");},placeholder:"Re-enter password",autoComplete:"new-password",style:{width:"100%",background:T.AUTH_INPUT_BG,border:"1.5px solid "+(authErr&&authPwd!==authPwd2?RED:T.AUTH_INPUT_BDR),borderRadius:12,padding:"13px 14px",fontSize:13,color:T.AUTH_TEXT,outline:"none",fontFamily:"inherit"}}),
    authErr?h("div",{style:{background:RED+"15",border:"1px solid "+RED+"44",borderRadius:8,padding:"8px 12px",marginTop:10,fontSize:12,color:RED,fontWeight:500}},authErr):null,
    h("button",{onClick:handleSignUp,disabled:authLoading,style:{width:"100%",background:authLoading?T.AUTH_LABEL:T.AUTH_BTN_BG,border:"none",borderRadius:12,padding:"14px",color:T.AUTH_BTN_TEXT,fontSize:14,fontWeight:700,cursor:authLoading?"not-allowed":"pointer",marginTop:16,opacity:authLoading?.7:1}},
      authLoading?"Creating account...":"Create Account"
    ),
    h("div",{style:{textAlign:"center",marginTop:18,fontSize:12,color:T.AUTH_LABEL}},
      "Already have an account? ",
      h("span",{style:{color:T.AUTH_TEXT,cursor:"pointer",fontWeight:700},onClick:function(){setAuthMode("signin");setAuthErr("");setAuthPwd("");setAuthPwd2("");}},
        "Sign In"
      )
    )
  ));

  var setupScreen=authWrap(h("div",{key:"setup"},
    h("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",marginBottom:28}},
      gUser&&gUser.photo?h("img",{src:gUser.photo,width:60,height:60,style:{borderRadius:"50%",marginBottom:12}}):h("div",{style:{width:60,height:60,borderRadius:"50%",background:ACCENT,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,color:"#fff",fontWeight:700,marginBottom:12}},gUser?(gUser.name||"U").charAt(0).toUpperCase():"U"),
      h("div",{style:{fontSize:18,fontWeight:700,color:T.AUTH_TEXT}},"Welcome, "+(gUser?gUser.name.split("@")[0]:"")+"!"),
      h("div",{style:{fontSize:12,color:T.AUTH_LABEL,marginTop:3}},"Set up your workspace — this is permanent")
    ),
    h("div",{style:{background:T.AUTH_INPUT_BG,border:"1px solid "+T.AUTH_INPUT_BDR,borderRadius:11,padding:"10px 14px",marginBottom:16,display:"flex",alignItems:"center",gap:8}},
      ic("lock",T.AUTH_LABEL,14),
      h("div",null,
        h("div",{style:{fontSize:10,color:T.AUTH_LABEL}},"Email (permanent — cannot be changed)"),
        h("div",{style:{fontWeight:700,color:T.AUTH_TEXT,fontSize:13}},gUser?gUser.email:""),
        h("div",{style:{fontSize:9,color:T.AUTH_LABEL,marginTop:2}},"This email is your permanent account identity")
      )
    ),
    h("div",{style:{fontSize:11,color:T.AUTH_LABEL,letterSpacing:1,marginBottom:6,fontWeight:600}},"COMPANY NAME *"),
    h("div",{style:{position:"relative"}},
      h("input",{value:setupCompany,onChange:function(e){setSetupCompany(e.target.value);},placeholder:"e.g. Acme Technologies Pvt Ltd",style:{width:"100%",background:T.AUTH_INPUT_BG,border:"1.5px solid "+T.AUTH_INPUT_BDR,borderRadius:12,padding:"13px 44px 13px 14px",fontSize:13,color:T.AUTH_TEXT,outline:"none",fontFamily:"inherit",marginBottom:4}}),
      h("div",{style:{position:"absolute",right:14,top:"50%",transform:"translateY(-60%)",display:"flex",alignItems:"center"}},ic("lock",T.AUTH_LABEL,15))
    ),
    h("div",{style:{fontSize:10,color:T.AUTH_LABEL,marginBottom:14,paddingLeft:2}},"Appears on all payslips — cannot be changed after setup"),
    h("div",{style:{fontSize:11,color:T.AUTH_LABEL,letterSpacing:1,marginBottom:6,fontWeight:600}},"ORGANISATION TYPE *"),
    h("select",{value:setupOrgType,onChange:function(e){setSetupOrgType(e.target.value);},style:{width:"100%",background:T.AUTH_INPUT_BG,border:"1.5px solid "+T.AUTH_INPUT_BDR,borderRadius:12,padding:"13px 14px",fontSize:13,color:setupOrgType?T.AUTH_TEXT:T.AUTH_LABEL,fontFamily:"inherit",outline:"none",marginBottom:14}},
      h("option",{value:""},"Select organisation type"),
      ["IT / Software","Institute / Education","Manufacturing","Healthcare","Retail","Finance","Logistics","NGO","Other"].map(function(t){return h("option",{key:t,value:t},t);})
    ),
    h("div",{style:{fontSize:11,color:T.AUTH_LABEL,letterSpacing:1,marginBottom:6,fontWeight:600}},"YOUR ROLE IN THE COMPANY *"),
    h("select",{value:setupPosition,onChange:function(e){setSetupPosition(e.target.value);},style:{width:"100%",background:T.AUTH_INPUT_BG,border:"1.5px solid "+T.AUTH_INPUT_BDR,borderRadius:12,padding:"13px 14px",fontSize:13,color:setupPosition?T.AUTH_TEXT:T.AUTH_LABEL,fontFamily:"inherit",outline:"none",marginBottom:4}},
      h("option",{value:""},"Select your role"),
      ["Owner","MD / Director","CEO","HR Manager","HR Executive","Admin Manager","Finance Manager","Accounts Manager","Operations Manager","General Manager"].map(function(t){return h("option",{key:t,value:t},t);})
    ),
    h("div",{style:{fontSize:10,color:T.AUTH_LABEL,marginBottom:20,paddingLeft:2}},"Your role shown on payslips — cannot be changed after setup"),
    h("button",{onClick:function(){
      if(!setupCompany.trim())return showT("Enter company name","err");
      if(!setupOrgType)return showT("Select organisation type","err");
      if(!setupPosition)return showT("Select your position","err");
      var newOrg={name:setupCompany.trim(),email:gUser?gUser.email:"",position:setupPosition,type:setupOrgType,plan:"free"};
      setOrg(newOrg);
      lsSet("hr_org_"+(gUser?gUser.email:"demo"),newOrg);
      setScreen("app");
      showT("Welcome to Admin HR!");
    },style:{width:"100%",background:T.AUTH_BTN_BG,border:"none",borderRadius:12,padding:"14px",color:T.AUTH_BTN_TEXT,fontSize:14,fontWeight:700,cursor:"pointer"}},"Get Started")
  ));

  var confirmScreen=authWrap(h("div",{key:"confirm",style:{textAlign:"center"}},
    h("div",{style:{width:72,height:72,borderRadius:"50%",background:GRN+"18",border:"2px solid "+GRN+"44",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}},
      ic("mail",GRN,32)
    ),
    h("div",{style:{fontSize:22,fontWeight:800,color:T.AUTH_TEXT,marginBottom:8}},"Check your email"),
    h("div",{style:{fontSize:13,color:T.AUTH_LABEL,marginBottom:6,lineHeight:1.6}},"We sent a confirmation link to"),
    h("div",{style:{fontSize:14,fontWeight:700,color:T.AUTH_TEXT,marginBottom:20}}),
    h("div",{style:{background:SFT||T.AUTH_INPUT_BG,border:"1px solid "+T.AUTH_INPUT_BDR,borderRadius:12,padding:"14px",marginBottom:20,fontSize:12,color:T.AUTH_LABEL,lineHeight:1.7}},
      h("div",{style:{fontWeight:600,color:T.AUTH_TEXT,marginBottom:4}},"Next steps:"),
      "1. Open your email inbox",h("br",null),
      "2. Click the confirmation link",h("br",null),
      "3. Come back here and Sign In"
    ),
    h("button",{onClick:function(){setAuthMode("signin");setAuthErr("");setAuthPwd("");setAuthPwd2("");},style:{width:"100%",background:T.AUTH_BTN_BG,border:"none",borderRadius:12,padding:"14px",color:T.AUTH_BTN_TEXT,fontSize:14,fontWeight:700,cursor:"pointer",marginBottom:12}},"Go to Sign In"),
    h("div",{style:{fontSize:12,color:T.AUTH_LABEL}},"Didn't receive? Check spam folder or ",
      h("span",{style:{color:T.AUTH_TEXT,fontWeight:600,cursor:"pointer"},onClick:function(){setAuthMode("signup");setAuthErr("");}},"try again")
    )
  ));

  function renderDashboard(){
    // Live countdown ticker for expiry
    var sDTick=st(0),setDTick=sDTick[1];
    se(function(){
      if(!org.expires_on)return;
      var t=setInterval(function(){setDTick(function(v){return v+1;});},1000);
      return function(){clearInterval(t);};
    },[org.expires_on]);

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

    var statCards=[
      {l:"Total Team",v:actEmps.length,ico:"group",c:NVY,s:trmEmps.length+" offboarded"},
      {l:"Present Today",v:actEmps.filter(function(e){return getTAtt(e.id)==="present";}).length,ico:"check_circle",c:GRN,s:actEmps.filter(function(e){return getTAtt(e.id)==="absent";}).length+" absent"},
      {l:"Gross Payroll",v:fmt(tGross),ico:"currency_rupee",c:AMB,s:MOS[curM]+" "+curY},
      {l:"Net Payable",v:fmt(tNet),ico:"trending_up",c:TEL,s:"after deductions"},
    ];
    var hr=now.getHours(),greet=hr<12?"Good Morning":hr<17?"Good Afternoon":"Good Evening";
    // Pre-compute reminder urgency
    var activeRems=reminders.filter(function(r){return !r.done;});
    var doneRems=reminders.filter(function(r){return r.done;});
    var urgentRems=activeRems.filter(function(r){if(!r.date)return false;var diff=Math.ceil((new Date(r.date)-now)/86400000);return diff<=1;});
    var bdayUrgent=bRemind.some(function(e){var dob=new Date(e.dob),tdDate=new Date(now.getFullYear(),now.getMonth(),now.getDate()),bday=new Date(now.getFullYear(),dob.getMonth(),dob.getDate());if(bday<tdDate)bday.setFullYear(now.getFullYear()+1);return Math.ceil((bday-tdDate)/86400000)<=1;});
    var showRemSection=true; // Always show reminder card so user can add reminders
    return h("div",{className:"fd"},
      h("div",{style:{background:NVY,borderRadius:18,padding:"18px 18px 20px",marginBottom:14,position:"relative",overflow:"hidden",boxShadow:T.SHADOW_LG}},
        h("div",{style:{position:"absolute",right:-30,top:-30,width:120,height:120,borderRadius:"50%",background:themeMode==="light"?"rgba(255,255,255,.05)":"rgba(0,0,0,.10)"}}),
        h("div",{style:{position:"absolute",right:30,bottom:-40,width:80,height:80,borderRadius:"50%",background:themeMode==="light"?"rgba(255,255,255,.04)":"rgba(0,0,0,.08)"}}),
        h("div",{style:{position:"absolute",top:14,right:16,fontSize:11,fontWeight:600,color:CARD,opacity:.75,letterSpacing:.5,fontVariantNumeric:"tabular-nums"}},timeStr),
        h("div",{style:{fontSize:11,color:CARD,opacity:.65,marginBottom:3,fontWeight:500}},now.toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long"})),
        h("div",{style:{fontSize:22,fontWeight:600,color:CARD,letterSpacing:-.3}},greet),
        h("div",{style:{fontSize:11,color:CARD,opacity:.7,marginTop:3,fontWeight:500}},org.position+" \u2022 "+org.name)
      ),
      expiryCountdown(),
      h("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}},
        statCards.map(function(s,i){
          return h("div",{key:i,style:{
            background:CARD,
            border:"1px solid "+BDR,
            borderRadius:14,
            padding:"13px 13px 12px",
            boxShadow:themeMode==="light"?"0 2px 12px rgba(15,23,42,.08)":"0 2px 12px rgba(0,0,0,.35)"
          }},
            h("div",{style:{
              width:38,height:38,borderRadius:11,
              background:themeMode==="light"?"#F1F5F9":"#383737",
              boxShadow:themeMode==="light"?"0 1px 4px rgba(15,23,42,.12)":"0 1px 4px rgba(0,0,0,.4)",
              display:"flex",alignItems:"center",justifyContent:"center",
              marginBottom:10
            }},ic(s.ico,GRY,20)),
            h("div",{style:{fontSize:String(s.v).length>8?13:20,fontWeight:800,color:NVY,letterSpacing:-.5,lineHeight:1.1}},s.v),
            h("div",{style:{fontSize:11,fontWeight:600,color:NVY,marginTop:5,opacity:.8}},s.l),
            h("div",{style:{fontSize:10,color:GRY,marginTop:2}},s.s)
          );
        })
      ),
      h("button",{onClick:function(){setTab("attendance");},style:{width:"100%",background:CARD,border:"1px solid "+BDR,borderRadius:13,padding:"13px 14px",display:"flex",alignItems:"center",gap:11,cursor:"pointer",marginBottom:12,boxShadow:T.SHADOW}},
        h("div",{style:{width:38,height:38,borderRadius:10,background:SFT,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}},ic(ICONS.cal,NVY,20)),
        h("div",{style:{flex:1,textAlign:"left"}},
          h("div",{style:{fontSize:13,fontWeight:600,color:NVY}},"Mark Attendance"),
          h("div",{style:{fontSize:11,color:GRY,marginTop:1}},actEmps.filter(function(e){return getTAtt(e.id)==="unmarked";}).length+" not yet marked")
        ),
        ic(ICONS.chev,GRY,18)
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
              h("input",{type:"date",value:remDate,onChange:function(e){setRemDate(e.target.value);},style:{flex:1,background:CARD,border:"1.5px solid "+BDR,borderRadius:8,padding:"8px 10px",fontSize:12,color:NVY,outline:"none",fontFamily:"inherit"}}),
              h("button",{onClick:function(){
                if(!remTxt.trim())return showT("Enter reminder text","err");
                setReminders(function(p){return p.concat([{id:Date.now(),text:remTxt.trim(),date:remDate||"",done:false}]);});
                setRemTxt("");setRemDate("");setRemOpen(false);showT("Reminder added!");
              },style:{background:NVY,border:"none",borderRadius:8,padding:"8px 14px",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer"}},"Add")
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
          h("div",{style:{fontSize:12,fontWeight:700,color:NVY}},"Attendance Snapshot"),
          h("button",{onClick:function(){setTab("attendance");},style:{fontSize:11,color:NVY,background:SFT,border:"1px solid "+BDR,borderRadius:6,padding:"3px 8px",cursor:"pointer",fontWeight:600}},"Mark All")
        ),
        actEmps.slice(0,4).map(function(e,i){
          var s=getTAtt(e.id);
          return h("div",{key:e.id,onClick:function(){cycleAtt(todayStr,e.id);},className:"rh",style:{display:"flex",alignItems:"center",gap:8,padding:"6px 3px",borderBottom:i<3?"1px solid "+BDR:"none",cursor:"pointer",borderRadius:6}},
            av(e,30),
            h("div",{style:{flex:1}},h("div",{style:{fontSize:12,fontWeight:600,color:NVY}},e.name),h("div",{style:{fontSize:10,color:GRY}},e.role)),
            h("div",{style:{fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:16,background:ATC[s]+"18",color:ATC[s]}},ATL[s])
          );
        })
      )),
      card(h("div",null,
        h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:9}},
          h("div",{style:{fontSize:12,fontWeight:700,color:NVY}},"Statutory Summary"),
          h("button",{onClick:function(){setTab("settings");setSettTab("tax");},style:{fontSize:11,color:NVY,background:SFT,border:"1px solid "+BDR,borderRadius:6,padding:"3px 8px",cursor:"pointer",fontWeight:600}},"Tax Slabs")
        ),
        (function(){var tot=actEmps.reduce(function(a,e){var ma=mAtt(e.id,curY,curM),inc=getInc(e.id,curY,curM),d=calcPay(e,ma.absent,ma.half,ma.unpaid,inc,getShiftAllow(e.id,curY,curM));a.pf+=d.pfE+d.pfR;a.esi+=d.esiE+d.esiR;a.pt+=d.pt;a.td+=d.tds;return a;},{pf:0,esi:0,pt:0,td:0});
          var eligCount=actEmps.filter(function(e){return calcGratuity(e).eligible;}).length;
          var totalGrat=actEmps.reduce(function(a,e){return a+calcGratuity(e).amount;},0);
          return[["PF (Emp+Er)",fmt(tot.pf),NVY],["ESI (Emp+Er)",fmt(tot.esi),TEL],["Prof. Tax",fmt(tot.pt),AMB],["TDS",fmt(tot.td),RED],["Gratuity Accrued",fmt(totalGrat)+(eligCount>0?" ("+eligCount+" eligible)":""),GRN]].map(function(item){return row(item[0],item[1],item[2]);});
        })()
      ),0)
    );
  }

  function renderEmployees(){
    if(selE&&!editE&&!offE)return renderEmpDetail();
    if(editE)return renderEditEmp();
    if(offE)return renderOffboard();
    var q=searchQ.trim().toLowerCase();
    var filteredEmps=q?actEmps.filter(function(e){return(e.name||"").toLowerCase().includes(q)||(e.role||"").toLowerCase().includes(q)||(e.dept||"").toLowerCase().includes(q)||(e.eid||"").toLowerCase().includes(q);}):actEmps;
    var empCountLabel=filteredEmps.length+(q?" found":" MEMBERS");
    return h("div",{className:"fd"},
      h("div",{style:{background:CARD,border:"1px solid "+BDR,borderRadius:11,padding:3,display:"flex",gap:3,marginBottom:11}},
        [["active","Active"],["terminated","Offboarded"]].map(function(item){return h("button",{key:item[0],onClick:function(){setEmpTab(item[0]);},style:{flex:1,background:empTab===item[0]?ACCENT:"transparent",border:"none",borderRadius:9,padding:"8px",color:empTab===item[0]?ACCENT_FG:GRY,fontSize:12,fontWeight:600,cursor:"pointer"}},item[1]);})
      ),
      empTab==="active"?h("div",null,
        h("div",{style:{display:"flex",gap:9,marginBottom:11}},
          h("div",{style:{flex:1,background:CARD,border:"1px solid "+BDR,borderRadius:12,padding:"11px 14px",display:"flex",gap:8,alignItems:"center",boxShadow:T.SHADOW}},
            ic("search",GRY,16),
            h("input",{value:searchQ,onChange:function(ev){setSearchQ(ev.target.value);},placeholder:"Search by name, role, dept...",style:{flex:1,fontSize:13,color:NVY,border:"none",background:"transparent",outline:"none",fontFamily:"inherit"}}),
            searchQ?h("button",{onClick:function(){setSearchQ("");},style:{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",padding:0}},ic("close",GRY,16)):null
          ),
          h("button",{onClick:function(){setAddOpen(true);setStep(1);},style:{background:NVY,border:"none",borderRadius:12,padding:"0 14px",color:CARD,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}},ic(ICONS.plus,CARD,22))
        ),
        h("div",{style:{fontSize:11,color:GRY,marginBottom:9,fontWeight:500,letterSpacing:.3}},empCountLabel),
        q&&filteredEmps.length===0?h("div",{style:{textAlign:"center",padding:32,color:GRY,fontSize:13}},'No results for "'+searchQ+'"'):null,
        filteredEmps.map(function(e){
          var ma=mAtt(e.id,curY,curM),inc=getInc(e.id,curY,curM),d=calcPay(e,ma.absent,ma.half,ma.unpaid,inc,getShiftAllow(e.id,curY,curM));
          return h("div",{key:e.id,className:"rh",onClick:function(){setSelE(e);},style:{background:CARD,border:"1px solid "+BDR,borderRadius:14,padding:"13px 14px",display:"flex",gap:12,alignItems:"center",marginBottom:9,boxShadow:T.SHADOW,cursor:"pointer"}},
            av(e,44),
            h("div",{style:{flex:1,minWidth:0}},
              h("div",{style:{fontSize:14,fontWeight:600,color:NVY,letterSpacing:-.1}},e.name),
              h("div",{style:{fontSize:11,color:GRY,marginTop:1}},e.role+" \u2022 "+e.dept),
              h("div",{style:{fontSize:10,color:GRY,marginTop:1,opacity:.8}},e.eid+" \u2022 Joined "+e.joined),
              h("div",{style:{fontSize:11,color:TEL,fontWeight:600,marginTop:4}},"Net "+fmt(d.net)+" / mo")
            ),
            ic(ICONS.chev,GRY,16)
          );
        })
      ):h("div",null,
        h("div",{style:{fontSize:11,color:GRY,marginBottom:8}},trmEmps.length+" offboarded"),
        trmEmps.length===0?h("div",{style:{textAlign:"center",padding:28,color:GRY,fontSize:13}},"No offboarded employees"):null,
        trmEmps.map(function(e){
          return h("div",{key:e.id,style:{background:CARD,border:"1px solid "+BDR,borderRadius:13,padding:"12px 13px",marginBottom:8}},
            h("div",{style:{display:"flex",gap:10,alignItems:"center",marginBottom:7}},
              av(e),
              h("div",{style:{flex:1}},h("div",{style:{fontSize:13,fontWeight:700,color:NVY}},e.name),h("div",{style:{fontSize:11,color:GRY}},e.role+" | "+e.dept),h("div",{style:{fontSize:10,color:RED,marginTop:1}},(e.status==="resigned"?"Resigned":"Terminated")+" - "+e.terminatedOn),e.resignDate?h("div",{style:{fontSize:10,color:GRY}},"Last day: "+e.resignDate):null),
              h("div",{style:{fontSize:9,fontWeight:700,padding:"3px 8px",borderRadius:14,background:e.status==="resigned"?T.PILL_WARN_BG:T.PILL_DANGER_BG,color:e.status==="resigned"?AMB:RED}},e.status)
            ),
            e.terminationData?h("div",{style:{background:SFT,borderRadius:8,padding:"7px 10px",marginBottom:8,fontSize:11,color:GRY}},h("div",null,h("b",null,"Reason: "),e.terminationData.reason),e.terminationData.note?h("div",null,h("b",null,"Note: "),e.terminationData.note):null,e.terminationData.handover&&e.terminationData.handover.length>0?h("div",null,h("b",null,"Handover: "),e.terminationData.handover.join(", ")):null):null,
            h("button",{onClick:function(){if(window.confirm("Delete permanently?"))removeEmp(e.id);},style:{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:5,background:T.PILL_DANGER_BG,border:"1px solid "+RED,borderRadius:8,padding:"7px",color:RED,fontSize:12,fontWeight:700,cursor:"pointer"}},ic(ICONS.del,RED,13),"Delete Record")
          );
        })
      )
    );
  }

  function renderEmpDetail(){
    var ma=mAtt(selE.id,curY,curM),inc=getInc(selE.id,curY,curM),d=calcPay(selE,ma.absent,ma.half,ma.unpaid,inc);
    var hasDeduct=ma.absent>0||ma.half>0||ma.unpaid>0;
    return h("div",{className:"fd"},
      h("button",{onClick:function(){setSelE(null);},style:{background:SFT,border:"1px solid "+BDR,borderRadius:7,padding:"5px 10px",color:NVY,fontSize:11,fontWeight:600,cursor:"pointer",marginBottom:10}},"Back"),
      h("div",{style:{background:NVY,borderRadius:15,padding:15,marginBottom:10,position:"relative",overflow:"hidden"}},
        h("div",{style:{position:"absolute",right:-7,top:-7,width:60,height:60,borderRadius:"50%",background:themeMode==="light"?"rgba(255,255,255,.04)":"rgba(0,0,0,.15)"}}),
        h("div",{style:{width:44,height:44,borderRadius:12,background:themeMode==="light"?"rgba(255,255,255,.12)":"rgba(255,255,255,.10)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:600,color:CARD,marginBottom:8}},selE.av),
        h("div",{style:{fontSize:16,fontWeight:700,color:CARD}},selE.name),
        h("div",{style:{fontSize:11,color:CARD,opacity:.7}},selE.role+" - "+selE.dept),
        h("div",{style:{fontSize:10,color:CARD,opacity:.55,marginTop:2}},"Joined: "+selE.joined)
      ),
      h("div",{style:{display:"flex",gap:7,marginBottom:10}},
        h("button",{onClick:function(){openEdit(selE);},style:{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:5,background:NVY,border:"none",borderRadius:9,padding:"9px",color:CARD,fontSize:12,fontWeight:600,cursor:"pointer"}},ic(ICONS.edit,CARD,13),"Edit"),
        h("button",{onClick:function(){setOffE(selE);setOffStep(1);setOffData({reason:"",type:"resigned",handover:[],note:"",resignDate:""});},style:{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:5,background:CARD,border:"1px solid "+RED,borderRadius:9,padding:"9px",color:RED,fontSize:12,fontWeight:600,cursor:"pointer"}},ic(ICONS.del,RED,13),"Offboard")
      ),
      card(h("div",null,h("div",{style:{fontSize:12,fontWeight:700,color:NVY,marginBottom:7}},"Personal Info"),[["Mobile",selE.mob],["Email",selE.email],["PAN",selE.pan],["UAN",selE.uan]].filter(function(i){return i[1];}).map(function(i){return row(i[0],i[1]);}))),
      card(h("div",null,h("div",{style:{fontSize:12,fontWeight:700,color:NVY,marginBottom:7}},"Salary (50/20/30)"),[["Monthly CTC",fmt(selE.monthlyCTC)],["Basic 50%",fmt(selE.basic)],["HRA 20%",fmt(selE.hra)],["Allowance 30%",fmt(selE.allow)],["Gross",fmt(d.gr)]].map(function(i){return row(i[0],i[1],i[0]==="Gross"?GRN:NVY);}))),
      card(h("div",null,
        h("div",{style:{fontSize:12,fontWeight:700,color:NVY,marginBottom:7}},"This Month Attendance"),
        h("div",{style:{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:5,marginBottom:7}},
          [["P",ma.present,GRN],["A",ma.absent,RED],["H",ma.half,AMB],["PL",ma.paid,PUR],["UL",ma.unpaid,IND]].map(function(item){return h("div",{key:item[0],style:{background:item[2]+"12",borderRadius:8,padding:"7px 3px",textAlign:"center"}},h("div",{style:{fontSize:15,fontWeight:800,color:item[2]}},item[1]),h("div",{style:{fontSize:8,color:GRY}},item[0]));})
        ),
        hasDeduct?h("div",{style:{background:T.PILL_DANGER_SOFT,borderRadius:7,padding:"5px 9px",fontSize:11,color:RED,marginBottom:7}},"Deducted: "+fmt(d.ad+d.hd+d.ud)):null,
        shareRow(function(){shareAtt(selE);})
      )),
      card(h("div",null,
        h("div",{style:{fontSize:12,fontWeight:700,color:NVY,marginBottom:7}},"Deductions"),
        [["PF Emp",fmt(d.pfE),NVY],["PF Er",fmt(d.pfR),"#374151"],["ESI Emp",fmt(d.esiE),TEL],["ESI Er",fmt(d.esiR),"#2DD4BF"],["Prof. Tax",fmt(d.pt),AMB],["TDS",fmt(d.tds),RED],["Health Ins.",fmt(d.hi),"#EC4899"],["Custom",fmt(d.cd),GRY]].map(function(i){return row(i[0],i[1],i[2]);}),
        h("div",{style:{display:"flex",justifyContent:"space-between",padding:"9px 0 0"}},h("span",{style:{fontSize:13,fontWeight:800,color:NVY}},"Net Take Home"),h("span",{style:{fontSize:14,fontWeight:800,color:GRN}},fmt(d.net)))
      )),
      (function(){
        var empRevs=(revisions[selE.id]||[]).slice().sort(function(a,b){return b.date.localeCompare(a.date);});
        return card(h("div",null,
          h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:revOpen?12:0}},
            h("div",{style:{fontSize:12,fontWeight:700,color:NVY}},"Salary Revisions"+(empRevs.length>0?" ("+empRevs.length+")":"")),
            h("button",{onClick:function(){setRevOpen(function(v){return !v;});},style:{background:revOpen?ACCENT:SFT,border:"1px solid "+BDR,borderRadius:7,padding:"4px 10px",fontSize:11,color:revOpen?ACCENT_FG:NVY,fontWeight:600,cursor:"pointer"}},revOpen?"Cancel":"+ Add")
          ),
          revOpen?h("div",{style:{marginBottom:12}},
            lbl("NEW MONTHLY CTC (Rs.)"),
            h("input",{ref:revCtcR,type:"number",placeholder:"e.g. 60000",style:{width:"100%",background:SFT,border:"1.5px solid "+BDR,borderRadius:11,padding:"11px 13px",fontSize:13,color:NVY,outline:"none",fontFamily:"inherit",marginBottom:8}}),
            lbl("EFFECTIVE DATE"),
            h("input",{ref:revDateR,type:"date",defaultValue:todayStr,style:{width:"100%",background:SFT,border:"1.5px solid "+BDR,borderRadius:11,padding:"11px 13px",fontSize:13,color:NVY,outline:"none",fontFamily:"inherit",marginBottom:8}}),
            lbl("NOTE (optional)"),
            h("input",{ref:revNoteR,type:"text",placeholder:"e.g. Annual increment",style:{width:"100%",background:SFT,border:"1.5px solid "+BDR,borderRadius:11,padding:"11px 13px",fontSize:13,color:NVY,outline:"none",fontFamily:"inherit",marginBottom:10}}),
            h("button",{onClick:function(){
              var newCtc=Number(revCtcR.current&&revCtcR.current.value);
              if(!newCtc)return showT("Enter new CTC","err");
              var effDate=(revDateR.current&&revDateR.current.value)||todayStr;
              var note=(revNoteR.current&&revNoteR.current.value)||"";
              var bd=brkSal(newCtc);
              var rev={id:Date.now(),date:effDate,oldCtc:selE.monthlyCTC,newCtc:newCtc,note:note};
              setRevisions(function(p){var o=Object.assign({},p);o[selE.id]=(o[selE.id]||[]).concat([rev]);return o;});
              setEmps(function(p){return p.map(function(e){return e.id===selE.id?Object.assign({},e,{monthlyCTC:newCtc,basic:bd.basic,hra:bd.hra,allow:bd.allow}):e;});});
              setSelE(function(prev){return Object.assign({},prev,{monthlyCTC:newCtc,basic:bd.basic,hra:bd.hra,allow:bd.allow});});
              if(revCtcR.current)revCtcR.current.value="";
              if(revNoteR.current)revNoteR.current.value="";
              setRevOpen(false);showT("Salary revised to "+fmt(newCtc));
            },style:{width:"100%",background:GRN,border:"none",borderRadius:10,padding:"11px",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer"}},"Apply Revision")
          ):null,
          empRevs.length===0&&!revOpen?h("div",{style:{textAlign:"center",padding:"10px 0",color:GRY,fontSize:12}},"No revisions logged"):null,
          empRevs.map(function(r,i){
            var pct=r.oldCtc?Math.round(((r.newCtc-r.oldCtc)/r.oldCtc)*100):0;
            return h("div",{key:r.id,style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderTop:"1px solid "+BDR}},
              h("div",null,
                h("div",{style:{fontSize:12,fontWeight:600,color:NVY}},fmt(r.oldCtc)+" → "+fmt(r.newCtc)),
                h("div",{style:{fontSize:10,color:GRY,marginTop:2}},r.date+(r.note?" · "+r.note:""))
              ),
              h("div",{style:{fontSize:12,fontWeight:800,color:pct>=0?GRN:RED,background:(pct>=0?GRN:RED)+"14",borderRadius:6,padding:"3px 8px"}},pct>=0?"+"+pct+"%":pct+"%")
            );
          })
        ),12);
      })(),
      (function(){
        // ── Gratuity Card ──
        var g=calcGratuity(selE);
        var pct=Math.min(100,Math.round((g.totalMonths/(5*12))*100));
        return card(h("div",null,
          h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}},
            h("div",{style:{fontSize:12,fontWeight:700,color:NVY}},"Gratuity"),
            g.eligible?h("div",{style:{background:GRN+"18",border:"1px solid "+GRN+"44",borderRadius:6,padding:"2px 8px",fontSize:10,fontWeight:700,color:GRN}},"ELIGIBLE"):
              h("div",{style:{background:AMB+"18",border:"1px solid "+AMB+"44",borderRadius:6,padding:"2px 8px",fontSize:10,fontWeight:700,color:AMB}},"NOT YET")
          ),
          h("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:6}},
            h("div",{style:{fontSize:11,color:GRY}},g.years+"y "+g.months+"m service"+(g.eligible?" \u2022 Eligible":":" +" "+Math.max(0,60-g.totalMonths)+"m to go")),
            h("div",{style:{fontSize:13,fontWeight:800,color:g.eligible?GRN:NVY}},fmt(g.amount))
          ),
          h("div",{style:{background:BDR,borderRadius:4,height:6,marginBottom:6,overflow:"hidden"}},
            h("div",{style:{height:"100%",width:pct+"%",background:g.eligible?GRN:AMB,borderRadius:4,transition:"width .4s"}})
          ),
          h("div",{style:{fontSize:9,color:GRY}},"Formula: Basic x 15/26 x years \u2022 Tax-free up to Rs.20L \u2022 Payable after 5 years")
        ),12);
      })(),
      (function(){
        // ── Shift Card ──
        var empShift=shifts[selE.id]||{type:"General",allowance:0,log:[]};
        var curKey=curY+"-"+(curM+1<10?"0":"")+(curM+1);
        var curLog=empShift.log||[];
        var curEntry=curLog.find(function(l){return l.month===curKey;})||{month:curKey,shift:empShift.type,allowance:empShift.allowance||0};
        return card(h("div",null,
          h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}},
            h("div",{style:{fontSize:12,fontWeight:700,color:NVY}},"Shift"),
            h("button",{onClick:function(){setShiftOpen(function(v){return !v;});},style:{background:shiftOpen?ACCENT:SFT,border:"1px solid "+BDR,borderRadius:7,padding:"3px 9px",fontSize:11,color:shiftOpen?ACCENT_FG:NVY,fontWeight:600,cursor:"pointer"}},shiftOpen?"Cancel":"Edit")
          ),
          h("div",{style:{display:"flex",gap:10,marginBottom:shiftOpen?10:0}},
            h("div",{style:{flex:1,background:SFT,borderRadius:9,padding:"9px 12px"}},
              h("div",{style:{fontSize:9,color:GRY,marginBottom:2}},"CURRENT SHIFT"),
              h("div",{style:{fontSize:14,fontWeight:700,color:NVY}},curEntry.shift||empShift.type||"General")
            ),
            h("div",{style:{flex:1,background:SFT,borderRadius:9,padding:"9px 12px"}},
              h("div",{style:{fontSize:9,color:GRY,marginBottom:2}},"SHIFT ALLOWANCE"),
              h("div",{style:{fontSize:14,fontWeight:700,color:TEL}},fmt(curEntry.allowance||0)+"/mo")
            )
          ),
          shiftOpen?h("div",{style:{background:SFT,borderRadius:10,padding:11,border:"1px solid "+BDR}},
            lbl("SHIFT TYPE - "+MOS[curM]+" "+curY),
            h("div",{style:{display:"flex",flexWrap:"wrap",gap:6,marginBottom:10}},
              SHIFT_TYPES.map(function(s){
                var sel=(curEntry.shift||empShift.type)===s;
                return h("button",{key:s,onClick:function(){
                  var newEntry=Object.assign({},curEntry,{shift:s,month:curKey});
                  var newLog=(empShift.log||[]).filter(function(l){return l.month!==curKey;}).concat([newEntry]);
                  setShifts(function(p){var o=Object.assign({},p);o[selE.id]=Object.assign({},empShift,{type:s,log:newLog});return o;});
                },style:{background:sel?ACCENT:CARD,border:"1.5px solid "+(sel?ACCENT:BDR),borderRadius:18,padding:"5px 12px",fontSize:11,fontWeight:600,color:sel?ACCENT_FG:GRY,cursor:"pointer"}},s);
              })
            ),
            lbl("SHIFT ALLOWANCE (Rs./mo)"),
            h("div",{style:{display:"flex",gap:7}},
              h("input",{type:"number",defaultValue:curEntry.allowance||0,id:"shiftAllowInp",placeholder:"0",style:{flex:1,background:CARD,border:"1.5px solid "+BDR,borderRadius:9,padding:"9px 11px",fontSize:13,color:NVY,outline:"none",fontFamily:"inherit"}}),
              h("button",{onClick:function(){
                var inp=document.getElementById("shiftAllowInp");
                var allow=Number(inp?inp.value:0)||0;
                var newEntry=Object.assign({},curEntry,{allowance:allow,month:curKey});
                var newLog=(empShift.log||[]).filter(function(l){return l.month!==curKey;}).concat([newEntry]);
                setShifts(function(p){var o=Object.assign({},p);o[selE.id]=Object.assign({},empShift,{allowance:allow,log:newLog});return o;});
                setShiftOpen(false);showT("Shift updated!");
              },style:{background:GRN,border:"none",borderRadius:9,padding:"9px 13px",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer"}},"Save")
            ),
            curLog.length>0?h("div",{style:{marginTop:10}},
              h("div",{style:{fontSize:9,color:GRY,fontWeight:600,marginBottom:5,letterSpacing:.5}},"SHIFT HISTORY"),
              curLog.slice().sort(function(a,b){return b.month.localeCompare(a.month);}).slice(0,4).map(function(l){
                return h("div",{key:l.month,style:{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid "+BDR}},
                  h("span",{style:{fontSize:11,color:GRY}},l.month),
                  h("span",{style:{fontSize:11,fontWeight:600,color:NVY}},l.shift+(l.allowance>0?" + "+fmt(l.allowance):""))
                );
              })
            ):null
          ):null
        ),0);
      })()
    );
  }

  function renderEditEmp(){
    return h("div",{className:"fd"},
      h("button",{onClick:function(){setEditE(null);},style:{background:SFT,border:"1px solid "+BDR,borderRadius:7,padding:"5px 10px",color:NVY,fontSize:11,fontWeight:600,cursor:"pointer",marginBottom:10}},"Cancel"),
      h("div",{style:{fontSize:14,fontWeight:800,color:NVY,marginBottom:13}},"Edit - "+editE.name),
      card(h("div",null,
        h("div",{style:{fontSize:11,fontWeight:700,color:NVY,marginBottom:9}},"Personal"),
        [["FULL NAME",edn],["MOBILE",edm,"tel"],["EMAIL",edem,"email"],["EMPLOYEE ID",edei],["ROLE",edro]].map(function(f){return h("div",{key:f[0]},lbl(f[0]),inpEl(f[1],"",f[2]||"text"));})
      )),
      card(h("div",null,
        h("div",{style:{fontSize:11,fontWeight:700,color:NVY,marginBottom:9}},"Salary"),
        lbl("MONTHLY CTC (Rs.)"),inpEl(edctc,"e.g. 50000","number"),
        h("div",{style:{background:SFT,borderRadius:8,padding:"7px 10px",marginBottom:10,fontSize:11,color:GRY}},"Auto-split: 50% Basic, 20% HRA, 30% Allow"),
        lbl("HEALTH INS. (Rs./mo)"),inpEl(edhi,"","number")
      )),
      card(h("div",null,
        h("div",{style:{fontSize:11,fontWeight:700,color:NVY,marginBottom:9}},"Tax"),
        togEl("EPF/PF","12% emp+employer",ePf,setEPf),
        ePf?h("div",{style:{padding:"8px 0",borderBottom:"1px solid "+BDR}},lbl("PF Mode"),h("div",{style:{display:"flex",gap:7}},[["capped","Capped Rs.1800"],["actual","Actual Basic"]].map(function(item){return h("button",{key:item[0],onClick:function(){setEPfM(item[0]);},style:{flex:1,background:ePfM===item[0]?ACCENT:SFT,border:"1.5px solid "+(ePfM===item[0]?ACCENT:BDR),borderRadius:9,padding:"8px",color:ePfM===item[0]?ACCENT_FG:GRY,fontSize:11,fontWeight:600,cursor:"pointer"}},item[1]);}))
        ):null,
        togEl("ESI","0.75% if gross up to Rs.21K",eEsi,setEEsi),
        togEl("Professional Tax","Rs.200/mo if above Rs.15K",ePt,setEPt),
        togEl("TDS","FY 2025-26 new regime",eTds,setETds)
      ),0),
      h("div",{style:{height:10}}),
      gradBtn("Save Changes",saveEdit,GRN,"#16A34A")
    );
  }

  function renderOffboard(){
    return h("div",{className:"fd"},
      h("button",{onClick:function(){setOffE(null);},style:{background:T.PILL_DANGER_BG,border:"none",borderRadius:7,padding:"5px 10px",color:RED,fontSize:11,fontWeight:600,cursor:"pointer",marginBottom:10}},"Cancel"),
      h("div",{style:{fontSize:14,fontWeight:800,color:NVY,marginBottom:3}},"Offboard Employee"),
      h("div",{style:{fontSize:11,color:GRY,marginBottom:12}},offE.name+" - "+offE.role),
      h("div",{style:{display:"flex",alignItems:"center",gap:5,marginBottom:14}},
        [1,2,3].map(function(s){return h("div",{key:s,style:{display:"flex",alignItems:"center",gap:5,flex:s<3?1:"auto"}},h("div",{style:{width:24,height:24,borderRadius:12,background:offStep>=s?RED:BDR,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:offStep>=s?"#fff":GRY,flexShrink:0}},s),s<3?h("div",{style:{flex:1,height:2,background:offStep>s?RED:BDR,borderRadius:1}}):null);})
      ),
      offStep===1?card(h("div",null,
        h("div",{style:{fontSize:12,fontWeight:700,color:NVY,marginBottom:10}},"Step 1: Type and Reason"),
        h("div",{style:{marginBottom:11}},
          lbl("TYPE"),
          h("div",{style:{display:"flex",gap:7}},[["resigned","Resigned"],["terminated","Terminated"]].map(function(item){return h("button",{key:item[0],onClick:function(){setOffData(function(p){return Object.assign({},p,{type:item[0]});});},style:{flex:1,background:offData.type===item[0]?RED:SFT,border:"1.5px solid "+(offData.type===item[0]?RED:BDR),borderRadius:9,padding:"9px",color:offData.type===item[0]?"#fff":GRY,fontSize:12,fontWeight:600,cursor:"pointer"}},item[1]);}))
        ),
        lbl("REASON *"),
        h("textarea",{value:offData.reason,onChange:function(e){setOffData(function(p){return Object.assign({},p,{reason:e.target.value});});},placeholder:"Enter reason...",rows:3,style:{width:"100%",background:SFT,border:"1.5px solid "+BDR,borderRadius:10,padding:"10px 12px",fontSize:12,color:NVY,outline:"none",fontFamily:"inherit",resize:"none",marginBottom:9}}),
        lbl("LAST WORKING DATE"),
        h("input",{type:"date",value:offData.resignDate,onChange:function(e){setOffData(function(p){return Object.assign({},p,{resignDate:e.target.value});});},style:{width:"100%",background:SFT,border:"1.5px solid "+BDR,borderRadius:11,padding:"11px 13px",fontSize:13,color:NVY,outline:"none",fontFamily:"inherit",marginBottom:9}}),
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
          var g=calcGratuity(offE,offData.resignDate||todayStr);
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
      h("div",{style:{display:"flex",gap:7,marginBottom:10,alignItems:"center"}},
        h("select",{value:attY,onChange:function(e){var y=Number(e.target.value);setAttY(y);if(y===curY&&attM>curM)setAttM(curM);},style:{flex:0,width:"auto",marginBottom:0,padding:"7px 10px",fontSize:12}},
          pastYears().reverse().map(function(y){return h("option",{key:y,value:y},y);})
        ),
        h("div",{style:{display:"flex",gap:5,flex:1,overflowX:"auto"}},
          pastMonths(attY).map(function(m2){return h("button",{key:m2,onClick:function(){setAttM(m2);},style:{flexShrink:0,background:attM===m2?ACCENT:CARD,border:"1px solid "+(attM===m2?ACCENT:BDR),borderRadius:15,padding:"4px 10px",color:attM===m2?ACCENT_FG:GRY,fontSize:11,fontWeight:600,cursor:"pointer"}},MOS[m2]);})
        )
      ),
      h("div",{style:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:6}},
        [["Present",GRN,"present"],["Absent",RED,"absent"],["Half Day",AMB,"half"],["Paid Leave",PUR,"paid"],["Unpaid",IND,"unpaid"],["Holiday",SKY,"holiday"]].map(function(item){return h("div",{key:item[0],style:{background:CARD,border:"1px solid "+BDR,borderRadius:10,padding:"8px 4px",textAlign:"center"}},h("div",{style:{fontSize:16,fontWeight:800,color:item[1]}},actEmps.filter(function(e){return getAtt(todayDate,e.id)===item[2];}).length),h("div",{style:{fontSize:9,color:GRY,marginTop:1}},item[0]));})
      ),
      h("div",{style:{background:SFT,border:"1px solid "+BDR,borderRadius:9,padding:"7px 10px",marginBottom:10,fontSize:11,color:GRY}},"Tap to cycle status. Paid Leave = no deduction."),
      h("div",{style:{display:"flex",gap:7,marginBottom:9}},
        h("button",{onClick:function(){setAtt(function(v){var o=Object.assign({},v);actEmps.forEach(function(e){o[todayDate+"_"+e.id]="present";});return o;});showT("All marked Present");},style:{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,background:GRN+"14",border:"1px solid "+GRN+"55",borderRadius:10,padding:"9px",color:GRN,fontSize:12,fontWeight:700,cursor:"pointer"}},ic("check_circle",GRN,15),"Mark All Present"),
        h("button",{onClick:function(){markHolidayAll(todayDate);},style:{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,background:AMB+"14",border:"1px solid "+AMB+"55",borderRadius:10,padding:"9px",color:AMB,fontSize:12,fontWeight:700,cursor:"pointer"}},ic(ICONS.sun,AMB,15),"Mark All Holiday")
      ),
      isPaid?dlPair("Attendance Report",function(){makeAttPDF(null,attY,attM,function(){var allRecs={};emps.forEach(function(e){Object.entries(att).filter(function(kv){return kv[0].endsWith("_"+e.id)&&kv[0].startsWith(attY+"-"+String(attM+1).padStart(2,"0"));}).forEach(function(kv){allRecs[kv[0].split("_")[0]+"_"+e.name]=kv[1];});});return allRecs;}(),org.name,org.email,org.position,LOGO_SRC);},function(){makeAttCSV(att,emps);}):h("button",{onClick:needPaid,style:{display:"flex",alignItems:"center",justifyContent:"center",gap:6,width:"100%",background:GRY,border:"none",borderRadius:12,padding:"12px",color:CARD,fontSize:12,fontWeight:600,cursor:"pointer",marginBottom:10}},ic("lock",CARD,16),"Attendance PDF — Paid Plan Only"),
      card(h("div",null,
        h("div",{style:{fontSize:12,fontWeight:700,color:NVY,marginBottom:10}},new Date(attY,attM,1).toLocaleDateString("en-IN",{month:"long",year:"numeric"})),
        actEmps.map(function(e,i){
          var s=getAtt(todayDate,e.id),ma=mAtt(e.id,attY,attM);
          return h("div",{key:e.id,style:{borderBottom:i<actEmps.length-1?"1px solid "+BDR:"none",paddingBottom:7,marginBottom:7}},
            h("div",{onClick:function(){cycleAtt(todayDate,e.id);},className:"rh",style:{display:"flex",alignItems:"center",gap:9,cursor:"pointer",borderRadius:6,padding:"2px 2px"}},
              av(e,36),
              h("div",{style:{flex:1}},h("div",{style:{fontSize:12,fontWeight:600,color:NVY}},e.name),h("div",{style:{fontSize:10,color:GRY}},e.role)),
              h("div",{style:{fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:15,background:ATC[s]+"14",color:ATC[s],border:"1px solid "+ATC[s]+"35",flexShrink:0}},ATL[s])
            ),
            h("div",{style:{display:"flex",gap:5,marginTop:5,marginLeft:45}},
              h("button",{onClick:function(){setSheetE(e);},style:{background:SFT,border:"1px solid "+BDR,borderRadius:6,padding:"2px 9px",fontSize:10,color:NVY,fontWeight:600,cursor:"pointer"}},"Sheet"),
              h("button",{onClick:function(){shareAtt(e);},style:{display:"flex",alignItems:"center",gap:3,background:SFT,border:"1px solid "+BDR,borderRadius:6,padding:"2px 9px",fontSize:10,color:NVY,fontWeight:600,cursor:"pointer"}},ic(ICONS.wa,NVY,11),"WA")
            )
          );
        })
      ),0)
    );
  }

  function renderAttSheet(){
    var ma=mAtt(sheetE.id,attY,attM),d=calcPay(sheetE,ma.absent,ma.half,ma.unpaid);
    var yr=attY,mo=attM;
    var hasDeduct=ma.absent>0||ma.half>0||ma.unpaid>0;
    return h("div",{className:"fd"},
      h("button",{onClick:function(){setSheetE(null);},style:{background:SFT,border:"1px solid "+BDR,borderRadius:7,padding:"5px 10px",color:NVY,fontSize:11,fontWeight:600,cursor:"pointer",marginBottom:10}},"Back"),
      h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}},
        h("div",null,h("div",{style:{fontSize:14,fontWeight:800,color:NVY}},sheetE.name),h("div",{style:{fontSize:11,color:GRY}},MOS[mo]+" "+yr)),
        h("div",{style:{display:"flex",gap:5}},
          h("button",{onClick:isPaid?function(){var recs={};Object.entries(att).filter(function(kv){return kv[0].endsWith("_"+sheetE.id)&&kv[0].startsWith(yr+"-"+String(mo+1).padStart(2,"0"));}).forEach(function(kv){recs[kv[0].split("_")[0]]=kv[1];});makeAttPDF(sheetE.name,yr,mo,recs,org.name,org.email,org.position,LOGO_SRC);}:needPaid,style:{display:"flex",alignItems:"center",gap:4,background:isPaid?NVY:GRY,border:"none",borderRadius:7,padding:"6px 10px",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer"}},ic(isPaid?ICONS.dl:"lock","#fff",13),isPaid?"PDF":"PDF"),
          h("button",{onClick:function(){shareAtt(sheetE);},style:{display:"flex",alignItems:"center",gap:4,background:SFT,border:"1px solid "+BDR,borderRadius:7,padding:"6px 10px",fontSize:11,color:NVY,fontWeight:700,cursor:"pointer"}},ic(ICONS.wa,NVY,13),"WA")
        )
      ),
      h("div",{style:{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:5,marginBottom:10}},
        [["P",ma.present,GRN],["A",ma.absent,RED],["H",ma.half,AMB],["PL",ma.paid,PUR],["UL",ma.unpaid,IND]].map(function(item){return h("div",{key:item[0],style:{background:item[2]+"12",borderRadius:8,padding:"7px 3px",textAlign:"center"}},h("div",{style:{fontSize:15,fontWeight:800,color:item[2]}},item[1]),h("div",{style:{fontSize:8,color:GRY}},item[0]));})
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
              cells.push(h("div",{key:day,onClick:(function(kk){return function(){var cur=att[kk]||"unmarked",nxt=ATO[(ATO.indexOf(cur)+1)%ATO.length];setAtt(function(p){var o=Object.assign({},p);o[kk]=nxt;return o;});};})(k2),style:{aspectRatio:"1",borderRadius:6,background:s==="unmarked"?SFT:ATC[s]+"1C",border:isTd?"2px solid "+NVY:"1px solid "+(s==="unmarked"?BDR:ATC[s]+"35"),display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer"}},h("div",{style:{fontSize:11,fontWeight:isTd?800:500,color:s==="unmarked"?NVY:ATC[s]}},dayNum),s!=="unmarked"?h("div",{style:{fontSize:6,color:ATC[s],fontWeight:700}},ATL[s].slice(0,2)):null));
            }
            return cells;
          })()
        ),
        h("div",{style:{display:"flex",flexWrap:"wrap",gap:6,marginTop:9}},
          Object.entries(ATL).filter(function(kv){return kv[0]!=="unmarked";}).map(function(kv){return h("div",{key:kv[0],style:{display:"flex",alignItems:"center",gap:3}},h("div",{style:{width:8,height:8,borderRadius:2,background:ATC[kv[0]]}}),h("span",{style:{fontSize:9,color:GRY}},kv[1]));})
        )
      ),0)
    );
  }

  function renderPayroll(){
    var depts=[""].concat(getDepts(org.type).filter(function(d){return actEmps.some(function(e){return e.dept===d;});}));
    var filtEmps=payFilt==="dept"&&payDept?actEmps.filter(function(e){return e.dept===payDept;}):actEmps;
    var filtGross=filtEmps.reduce(function(a,e){var ma=mAtt(e.id,payY,payM),inc=getInc(e.id,payY,payM);return a+calcPay(e,ma.absent,ma.half,ma.unpaid,inc,getShiftAllow(e.id,payY,payM)).gr;},0);
    var filtNet=filtEmps.reduce(function(a,e){var ma=mAtt(e.id,payY,payM),inc=getInc(e.id,payY,payM);return a+calcPay(e,ma.absent,ma.half,ma.unpaid,inc,getShiftAllow(e.id,payY,payM)).net;},0);
    return h("div",{className:"fd"},
      h("div",{style:{display:"flex",gap:7,marginBottom:10,alignItems:"center"}},
        h("select",{value:payY,onChange:function(e){var y=Number(e.target.value);setPayY(y);if(y===curY&&payM>curM)setPayM(curM);},style:{flex:0,width:"auto",marginBottom:0,padding:"7px 10px",fontSize:12}},
          pastYears().reverse().map(function(y){return h("option",{key:y,value:y},y);})
        ),
        h("div",{style:{display:"flex",gap:5,flex:1,overflowX:"auto"}},
          pastMonths(payY).map(function(m2){return h("button",{key:m2,onClick:function(){setPayM(m2);},style:{flexShrink:0,background:payM===m2?ACCENT:CARD,border:"1px solid "+(payM===m2?ACCENT:BDR),borderRadius:15,padding:"4px 10px",color:payM===m2?ACCENT_FG:GRY,fontSize:11,fontWeight:600,cursor:"pointer"}},MOS[m2]);})
        )
      ),
      h("div",{style:{background:NVY,borderRadius:16,padding:16,marginBottom:11}},
        h("div",{style:{fontSize:11,color:CARD,opacity:.65,marginBottom:2}},MOS[payM]+" "+payY+(payFilt==="dept"&&payDept?" \u2022 "+payDept:" \u2022 All Employees")),
        h("div",{style:{fontSize:26,fontWeight:700,color:CARD}},fmt(filtGross)),
        h("div",{style:{display:"flex",gap:16,marginTop:7}},
          h("div",null,h("div",{style:{fontSize:9,color:CARD,opacity:.65}},"Net"),h("div",{style:{fontSize:13,fontWeight:600,color:CARD}},fmt(filtNet))),
          h("div",null,h("div",{style:{fontSize:9,color:CARD,opacity:.65}},"Deductions"),h("div",{style:{fontSize:13,fontWeight:600,color:"#FCA5A5"}},fmt(filtGross-filtNet)))
        )
      ),
      h("div",{style:{background:CARD,border:"1px solid "+BDR,borderRadius:11,padding:3,display:"flex",gap:3,marginBottom:8}},
        [["emp","Employee"],["dept","Department"],["er","Employer"]].map(function(item){return h("button",{key:item[0],onClick:function(){setRepV(item[0]);},style:{flex:1,background:repV===item[0]?ACCENT:"transparent",border:"none",borderRadius:9,padding:"7px",color:repV===item[0]?ACCENT_FG:GRY,fontSize:11,fontWeight:600,cursor:"pointer"}},item[1]);})
      ),
      repV==="dept"?h("div",null,
        h("div",{style:{display:"flex",gap:7,marginBottom:11,alignItems:"center"}},
          h("select",{value:payDept,onChange:function(e){setPayDept(e.target.value);},style:{flex:1,marginBottom:0,fontSize:12,padding:"8px 10px"}},
            h("option",{value:""},"All Departments"),
            getDepts(org.type).filter(function(d){return actEmps.some(function(e){return e.dept===d;});}).map(function(d){return h("option",{key:d,value:d},d);})
          )
        ),
        (function(){
          var deptList=payDept?[payDept]:getDepts(org.type).filter(function(d){return actEmps.some(function(e){return e.dept===d;});});
          return h("div",null,deptList.map(function(dept){
            var dEmps=actEmps.filter(function(e){return e.dept===dept;});
            var dTot=dEmps.reduce(function(a,e){var ma=mAtt(e.id,payY,payM),inc=getInc(e.id,payY,payM),d2=calcPay(e,ma.absent,ma.half,ma.unpaid,inc,getShiftAllow(e.id,payY,payM));a.gr+=d2.gr;a.net+=d2.net;a.ded+=d2.gr-d2.net;return a;},{gr:0,net:0,ded:0});
            return card(h("div",null,
              h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:9}},
                h("div",{style:{fontSize:13,fontWeight:700,color:NVY}},dept),
                h("div",{style:{textAlign:"right"}},h("div",{style:{fontSize:13,fontWeight:800,color:GRN}},fmt(dTot.net)),h("div",{style:{fontSize:9,color:GRY}},dEmps.length+" employees"))
              ),
              h("div",{style:{display:"flex",gap:8,marginBottom:10}},
                h("div",{style:{flex:1,background:ACCENT_SOFT,borderRadius:8,padding:"6px 10px"}},h("div",{style:{fontSize:10,color:GRY}},"Gross"),h("div",{style:{fontSize:12,fontWeight:700,color:NVY}},fmt(dTot.gr))),
                h("div",{style:{flex:1,background:RED+"12",borderRadius:8,padding:"6px 10px"}},h("div",{style:{fontSize:10,color:GRY}},"Deductions"),h("div",{style:{fontSize:12,fontWeight:700,color:RED}},fmt(dTot.ded)))
              ),
              dEmps.map(function(e,i){var ma=mAtt(e.id,payY,payM),inc=getInc(e.id,payY,payM),d2=calcPay(e,ma.absent,ma.half,ma.unpaid,inc,getShiftAllow(e.id,payY,payM));return h("div",{key:e.id,style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderTop:"1px solid "+BDR}},
                h("div",{style:{display:"flex",alignItems:"center",gap:7}},av(e,28),h("div",null,h("div",{style:{fontSize:11,fontWeight:600,color:NVY}},e.name),h("div",{style:{fontSize:9,color:GRY}},e.role))),
                h("div",{style:{textAlign:"right"}},h("div",{style:{fontSize:11,fontWeight:700,color:GRN}},fmt(d2.net)),h("div",{style:{fontSize:9,color:RED}},"-"+fmt(d2.gr-d2.net)))
              );})
            ));
          }));
        })()
      ):repV==="emp"?card(h("div",null,
        h("div",{style:{fontSize:12,fontWeight:700,color:NVY,marginBottom:11}},"Individual Payslips"),
        actEmps.map(function(e){
          var ma=mAtt(e.id,payY,payM),inc=getInc(e.id,payY,payM),d=calcPay(e,ma.absent,ma.half,ma.unpaid,inc,getShiftAllow(e.id,payY,payM)),isO=editPayE&&editPayE.id===e.id;
          var totalDeduct=d.ad+d.hd+d.ud+d.pfE+d.esiE+d.pt+d.tds+d.hi+d.cd;
          return h("div",{key:e.id,style:{borderBottom:"1px solid "+BDR,paddingBottom:10,marginBottom:10}},
            h("div",{style:{display:"flex",alignItems:"center",gap:9,padding:"6px 0"}},
              av(e,36),
              h("div",{style:{flex:1}},
                h("div",{style:{fontSize:13,fontWeight:600,color:NVY}},e.name),
                h("div",{style:{fontSize:10,color:GRY}},e.dept),
                h("div",{style:{display:"flex",gap:8,marginTop:3}},
                  h("span",{style:{fontSize:11,fontWeight:700,color:GRN}},"Net "+fmt(d.net)),
                  totalDeduct>0?h("span",{style:{fontSize:11,fontWeight:600,color:RED}},"-"+fmt(totalDeduct)+" ded."):null
                )
              )
            ),
            h("div",{style:{display:"flex",gap:5,marginBottom:6}},
              h("button",{onClick:isPaid?function(){makePayslipPDF(e,d,payM,payY,org.name,org.email,org.position,LOGO_SRC);}:needPaid,style:{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:4,background:isPaid?NVY:GRY,border:"none",borderRadius:8,padding:"7px",color:CARD,fontSize:11,fontWeight:600,cursor:"pointer"}},ic(isPaid?ICONS.dl:"lock",CARD,13),isPaid?"PDF":"PDF"),
              h("button",{onClick:function(){sharePayslip(e,d,payM,payY);},style:{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:4,background:SFT,border:"1px solid "+BDR,borderRadius:8,padding:"7px",color:NVY,fontSize:11,fontWeight:700,cursor:"pointer"}},ic(ICONS.wa,NVY,13),"WA"),
              h("button",{onClick:function(){setEditPayE(isO?null:e);setEditPayInc(String(getInc(e.id,payY,payM)));},style:{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:4,background:isO?ACCENT:SFT,border:"1px solid "+BDR,borderRadius:8,padding:"7px",color:isO?ACCENT_FG:NVY,fontSize:11,fontWeight:700,cursor:"pointer"}},ic(isO?"expand_less":"expand_more",isO?"#fff":NVY,13),isO?"Hide":"Details")
            ),
            isO?h("div",{style:{background:SFT,borderRadius:12,padding:12,border:"1px solid "+BDR}},
              lbl("INCENTIVE (Rs.)"),
              h("div",{style:{display:"flex",gap:6,marginBottom:8}},
                h("input",{type:"number",value:editPayInc,onChange:function(ev){setEditPayInc(ev.target.value);},placeholder:"0",style:{flex:1,background:CARD,border:"1.5px solid "+BDR,borderRadius:9,padding:"9px 11px",fontSize:13,color:NVY,outline:"none",fontFamily:"inherit"}}),
                h("button",{onClick:function(){var k=e.id+"_"+payY+"_"+payM;setIncentives(function(p){var o=Object.assign({},p);o[k]=Number(editPayInc)||0;return o;});showT("Saved!");},style:{display:"flex",alignItems:"center",gap:4,background:GRN,border:"none",borderRadius:9,padding:"9px 13px",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer"}},ic(ICONS.save,"#fff",13),"Save")
              ),
              [["Gross",fmt(d.gr),NVY,true],["Incentive",fmt(d.inc),GRN,false],["Shift Allow.",fmt(d.shiftAllow),TEL,false],["Absent Ded.","-"+fmt(d.ad),RED,false],["Half Ded.","-"+fmt(d.hd),AMB,false],["Unpaid Ded.","-"+fmt(d.ud),RED,false],["PF (Emp)","-"+fmt(d.pfE),NVY,false],["ESI (Emp)","-"+fmt(d.esiE),TEL,false],["Prof.Tax","-"+fmt(d.pt),AMB,false],["TDS","-"+fmt(d.tds),RED,false],["Health Ins","-"+fmt(d.hi),"#EC4899",false],["Custom","-"+fmt(d.cd),GRY,false]].map(function(item){return h("div",{key:item[0],style:{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px dashed "+BDR}},h("span",{style:{fontSize:11,color:item[3]?NVY:GRY,fontWeight:item[3]?700:400}},item[0]),h("span",{style:{fontSize:11,fontWeight:700,color:item[2]}},item[1]));}),
              h("div",{style:{display:"flex",justifyContent:"space-between",padding:"8px 0 0"}},h("span",{style:{fontSize:13,fontWeight:800,color:NVY}},"Net Take Home"),h("span",{style:{fontSize:14,fontWeight:800,color:GRN}},fmt(d.net)))
            ):null
          );
        })
      ),0):h("div",null,
        card(h("div",null,
          h("div",{style:{fontSize:12,fontWeight:700,color:NVY,marginBottom:10}},"Employer Cost - "+MOS[payM]+" "+payY),
          actEmps.map(function(e,i){var ma=mAtt(e.id,payY,payM),inc=getInc(e.id,payY,payM),d=calcPay(e,ma.absent,ma.half,ma.unpaid,inc,getShiftAllow(e.id,payY,payM));return h("div",{key:e.id,style:{padding:"9px 0",borderBottom:i<actEmps.length-1?"1px solid "+BDR:"none"}},
            h("div",{style:{display:"flex",alignItems:"center",gap:8,marginBottom:5}},av(e,31),h("div",{style:{flex:1}},h("div",{style:{fontSize:12,fontWeight:700,color:NVY}},e.name),h("div",{style:{fontSize:10,color:GRY}},e.dept)),h("div",{style:{textAlign:"right"}},h("div",{style:{fontSize:12,fontWeight:800,color:AMB}},fmt(d.gr+d.pfR+d.esiR)),h("div",{style:{fontSize:9,color:GRY}},"CTC/mo"))),
            h("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:5}},
              [["Gross",fmt(d.gr),NVY],["Er PF",fmt(d.pfR),"#374151"],["Er ESI",fmt(d.esiR),TEL]].map(function(item){return h("div",{key:item[0],style:{background:item[2]+"18",borderRadius:7,padding:"6px",textAlign:"center"}},h("div",{style:{fontSize:11,fontWeight:700,color:item[2]}},item[1]),h("div",{style:{fontSize:9,color:GRY}},item[0]));})
            )
          );}),
          (function(){var tot=actEmps.reduce(function(a,e){var ma=mAtt(e.id,payY,payM),inc=getInc(e.id,payY,payM),d=calcPay(e,ma.absent,ma.half,ma.unpaid,inc,getShiftAllow(e.id,payY,payM));a.g+=d.gr;a.p+=d.pfR;a.e+=d.esiR;return a;},{g:0,p:0,e:0});return h("div",{style:{background:AMB+"14",border:"1px solid "+AMB+"38",borderRadius:11,padding:11,marginTop:9}},[["Total Gross",fmt(tot.g),false],["Employer PF",fmt(tot.p),false],["Employer ESI",fmt(tot.e),false],["Total CTC",fmt(tot.g+tot.p+tot.e),true]].map(function(item){return h("div",{key:item[0],style:{display:"flex",justifyContent:"space-between",padding:"3px 0",borderBottom:"1px dashed "+BDR}},h("span",{style:{fontSize:11,color:GRY}},item[0]),h("span",{style:{fontSize:11,fontWeight:700,color:item[2]?AMB:NVY}},item[1]));}))})())) , 
        isPaid?dlBtn("Download Payroll Report (PDF)",function(){makePayrollPDF(actEmps,payM,payY,mAtt,getInc,org.name,org.email,org.position,LOGO_SRC);}):h("button",{onClick:needPaid,style:{display:"flex",alignItems:"center",justifyContent:"center",gap:6,width:"100%",background:GRY,border:"none",borderRadius:12,padding:"12px",color:CARD,fontSize:13,fontWeight:600,cursor:"pointer",marginBottom:10}},ic("lock",CARD,16),"Payroll PDF — Paid Plan Only")
      )
    );
  }

  function renderSettings(){
    return h("div",{className:"fd"},
      h("div",{style:{background:CARD,border:"1px solid "+BDR,borderRadius:11,padding:3,display:"flex",gap:3,marginBottom:13}},
        [["profile","Profile"],["appearance","Theme"],["tax","Tax Slabs"]].map(function(item){return h("button",{key:item[0],onClick:function(){setSettTab(item[0]);},style:{flex:1,background:settTab===item[0]?ACCENT:"transparent",border:"none",borderRadius:9,padding:"8px",color:settTab===item[0]?ACCENT_FG:GRY,fontSize:12,fontWeight:600,cursor:"pointer"}},item[1]);})
      ),
      settTab==="appearance"?h("div",null,
        card(h("div",null,
          h("div",{style:{fontSize:12,fontWeight:700,color:NVY,marginBottom:4}},"Theme"),
          h("div",{style:{fontSize:11,color:GRY,marginBottom:14}},"Choose how the app looks. Saved on this device."),
          h("div",{style:{display:"flex",gap:10}},
            [["light","Light","light_mode"],["dark","Dark","dark_mode"]].map(function(item){
              var on=themeMode===item[0];
              return h("button",{key:item[0],onClick:function(){setThemeMode(item[0]);showT(item[1]+" mode");},style:{flex:1,background:on?NVY:SFT,border:"1.5px solid "+(on?NVY:BDR),borderRadius:11,padding:"14px 10px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:6,transition:"all .15s"}},
                ic(item[2],on?"#fff":NVY,22),
                h("div",{style:{fontSize:12,fontWeight:700,color:on?"#fff":NVY}},item[1])
              );
            })
          )
        ))
      ):settTab==="profile"?h("div",null,
        card(h("div",null,
          h("div",{style:{fontSize:12,fontWeight:700,color:NVY,marginBottom:10}},"Admin Profile"),
          h("div",{style:{display:"flex",alignItems:"center",gap:11,marginBottom:14}},
            h("div",{style:{width:48,height:48,borderRadius:13,background:NVY,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:600,color:CARD}},(org.position||"HR").slice(0,2).toUpperCase()),
            h("div",null,h("div",{style:{fontSize:14,fontWeight:700,color:NVY}},org.position),h("div",{style:{fontSize:11,color:GRY}},org.name))
          ),
          lbl("YOUR POSITION / ROLE (locked at registration)"),
          h("div",{style:{width:"100%",background:SFT,border:"1.5px solid "+BDR,borderRadius:11,padding:"11px 13px",fontSize:13,color:GRY,marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}},h("span",null,org.position),ic("lock",GRY,13)),
          lbl("ORGANISATION NAME (locked at registration)"),
          h("div",{style:{width:"100%",background:SFT,border:"1.5px solid "+BDR,borderRadius:11,padding:"11px 13px",fontSize:13,color:GRY,marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}},h("span",null,org.name),ic("lock",GRY,13)),
          row("Email (not editable)",org.email)
        )),
        card(h("div",null,
          h("div",{style:{fontSize:12,fontWeight:700,color:NVY,marginBottom:12}},"Account"),
          h("div",{style:{display:"flex",alignItems:"center",gap:12,background:SFT,borderRadius:11,padding:"12px 14px",marginBottom:10}},
            gUser&&gUser.photo
              ?h("img",{src:gUser.photo,width:42,height:42,style:{borderRadius:"50%",flexShrink:0}})
              :h("div",{style:{width:42,height:42,borderRadius:"50%",background:ACCENT,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:700,color:ACCENT_FG,flexShrink:0}},gUser?(gUser.name||"U").charAt(0).toUpperCase():"U"),
            h("div",null,
              h("div",{style:{fontSize:13,fontWeight:700,color:NVY}},gUser?gUser.name:""),
              h("div",{style:{fontSize:11,color:GRY,marginTop:2}},gUser?gUser.email:"")
            )
          ),
          h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderTop:"1px solid "+BDR}},
            h("div",{style:{fontSize:11,color:GRY}},"Signed in"),
            h("button",{onClick:function(){_sb.auth.signOut();setGUser(null);lsSet("hr_guser",null);setScreen("login");setProf(false);},style:{background:T.PILL_DANGER_BG,border:"1px solid "+RED+"44",borderRadius:8,padding:"5px 12px",fontSize:11,fontWeight:700,color:RED,cursor:"pointer"}},"Sign Out")
          )
        )),
        isFree?card(h("div",null,
          h("div",{style:{fontSize:12,fontWeight:700,color:NVY,marginBottom:4}},"Upgrade to Paid Plan"),
          h("div",{style:{fontSize:11,color:GRY,marginBottom:12}},"Unlock PDF downloads, CSV exports and all reports"),
          h("div",{style:{position:"relative",overflow:"hidden",borderRadius:13,padding:2,background:"linear-gradient(120deg,#7C5C00,#FCD34D,#B8860B,#FCD34D,#7C5C00)",backgroundSize:"300% 100%",animation:"goldShine 3s linear infinite"}},
            h("style",{dangerouslySetInnerHTML:{__html:"@keyframes goldShine{0%{background-position:200% center}100%{background-position:-200% center}}"}}),
            h("button",{onClick:function(){window.open("https://wa.me/918072293384?text="+encodeURIComponent("Hi, I want to upgrade Admin HR to Paid Plan."),"_blank");},style:{width:"100%",background:"#0F172A",border:"none",borderRadius:11,padding:"14px",color:"#FCD34D",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3}},
              h("div",{style:{display:"flex",alignItems:"center",gap:8,fontSize:15,fontWeight:800}},ic("workspace_premium","#FCD34D",18),"Upgrade Now \u2014 \u20B9999/month"),
              h("div",{style:{fontSize:11,color:"rgba(252,211,77,.75)"}},"Contact us on WhatsApp to activate")
            )
          )
        )):card(h("div",null,
          h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"}}),
          h("div",{style:{fontSize:12,fontWeight:700,color:NVY,marginBottom:4}},"Active Subscription"),
          h("div",{style:{display:"flex",alignItems:"center",gap:6,background:GRN+"18",border:"1px solid "+GRN+"44",borderRadius:8,padding:"8px 12px"}},
            h("div",{style:{width:8,height:8,borderRadius:"50%",background:GRN}}),
            h("div",{style:{fontSize:12,fontWeight:700,color:GRN}},"Paid Plan Active"),
            h("div",{style:{fontSize:11,color:GRY,marginLeft:"auto"}},"All features unlocked")
          )
        )),
        
        card(h("div",null,
          h("div",{style:{fontSize:12,fontWeight:700,color:NVY,marginBottom:4}},"Data Management"),
          h("div",{style:{fontSize:11,color:GRY,marginBottom:12}},"Export your data or reset the app."),
          h("div",{style:{display:"flex",flexDirection:"column",gap:7,marginBottom:12}},
            h("div",{style:{background:SFT,border:"1px solid "+BDR,borderRadius:10,padding:"10px 13px"}},
              h("div",{style:{display:"flex",alignItems:"center",gap:8,marginBottom:8}},
                h("div",{style:{width:30,height:30,borderRadius:8,background:NVY,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}},ic("group",CARD,15)),
                h("div",null,h("div",{style:{fontSize:12,fontWeight:600,color:NVY}},"Employee Records"),h("div",{style:{fontSize:10,color:GRY,fontWeight:400,marginTop:1}},emps.length+" employees"))
              ),
              h("div",{style:{display:"flex",gap:6}},
                h("button",{onClick:isPaid?function(){makeEmpPDF(emps,org.name,org.email,org.position,LOGO_SRC);}:needPaid,style:{flex:1,background:isPaid?NVY:GRY,border:"none",borderRadius:7,padding:"7px",color:CARD,fontSize:11,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:4}},ic(isPaid?ICONS.dl:"lock",CARD,13),"PDF"),
                h("button",{onClick:isPaid?function(){makeEmpCSV(emps);}:needPaid,style:{flex:1,background:SFT,border:"1px solid "+BDR,borderRadius:7,padding:"7px",color:isPaid?NVY:GRY,fontSize:11,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:4}},ic(isPaid?"table_view":"lock",isPaid?NVY:GRY,13),"CSV")
              )
            ),
            h("div",{style:{background:SFT,border:"1px solid "+BDR,borderRadius:10,padding:"10px 13px"}},
              h("div",{style:{display:"flex",alignItems:"center",gap:8,marginBottom:8}},
                h("div",{style:{width:30,height:30,borderRadius:8,background:TEL,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}},ic("calendar_month","#fff",15)),
                h("div",null,h("div",{style:{fontSize:12,fontWeight:600,color:NVY}},"Attendance Records"),h("div",{style:{fontSize:10,color:GRY,fontWeight:400,marginTop:1}},"All months"))
              ),
              h("div",{style:{display:"flex",gap:6}},
                h("button",{onClick:isPaid?function(){makeAttSummaryPDF(emps,att,curM,curY,org.name,org.email,org.position,LOGO_SRC);}:needPaid,style:{flex:1,background:isPaid?NVY:GRY,border:"none",borderRadius:7,padding:"7px",color:CARD,fontSize:11,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:4}},ic(isPaid?ICONS.dl:"lock",CARD,13),"PDF"),
                h("button",{onClick:isPaid?function(){makeAttCSV(att,emps);}:needPaid,style:{flex:1,background:SFT,border:"1px solid "+BDR,borderRadius:7,padding:"7px",color:isPaid?NVY:GRY,fontSize:11,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:4}},ic(isPaid?"table_view":"lock",isPaid?NVY:GRY,13),"CSV")
              )
            ),
            h("div",{style:{background:SFT,border:"1px solid "+BDR,borderRadius:10,padding:"10px 13px"}},
              h("div",{style:{display:"flex",alignItems:"center",gap:8,marginBottom:8}},
                h("div",{style:{width:30,height:30,borderRadius:8,background:AMB,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}},ic("payments","#fff",15)),
                h("div",null,h("div",{style:{fontSize:12,fontWeight:600,color:NVY}},"Payroll — "+MOS[curM]+" "+curY),h("div",{style:{fontSize:10,color:GRY,fontWeight:400,marginTop:1}},"Current month"))
              ),
              h("div",{style:{display:"flex",gap:6}},
                h("button",{onClick:isPaid?function(){makePayrollPDF(actEmps,curM,curY,mAtt,getInc,org.name,org.email,org.position,LOGO_SRC);}:needPaid,style:{flex:1,background:isPaid?NVY:GRY,border:"none",borderRadius:7,padding:"7px",color:CARD,fontSize:11,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:4}},ic(isPaid?ICONS.dl:"lock",CARD,13),"PDF"),
                h("button",{onClick:isPaid?function(){makePayrollCSV(actEmps,curM,curY,mAtt,getInc);}:needPaid,style:{flex:1,background:SFT,border:"1px solid "+BDR,borderRadius:7,padding:"7px",color:isPaid?NVY:GRY,fontSize:11,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:4}},ic(isPaid?"table_view":"lock",isPaid?NVY:GRY,13),"CSV")
              )
            )
          ),
          h("button",{onClick:function(){if(window.confirm("RESET ALL DATA?\n\nThis will permanently delete all employees, attendance, payroll and revision records. This cannot be undone.")){
            // Clear all localStorage keys
            var keys=["hr_emps","hr_att","hr_inc","hr_revisions","hr_reminders","hr_shifts","hr_notices","hr_bkup_dismissed"];
            keys.forEach(function(k){try{localStorage.removeItem(k);}catch(e){}});
            // Reset all React state
            setEmps([]);setAtt({});setIncentives({});setRevisions({});setReminders([]);setShifts({});setNotices([]);
            showT("All data cleared!");
          }},style:{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:T.PILL_DANGER_BG,border:"1.5px solid "+RED+"55",borderRadius:10,padding:"11px",fontSize:12,fontWeight:700,color:RED,cursor:"pointer"}},
            ic("delete_forever",RED,16),"Clear All Data (Cannot be undone)"
          )
        ),0)
      ):h("div",null,
        card(h("div",null,
          h("div",{style:{fontSize:13,fontWeight:800,color:NVY,marginBottom:2}},"Tax Config - FY 2025-26"),
          h("div",{style:{fontSize:11,color:GRY,marginBottom:11}},"New Regime - Budget 2025"),
          [["PF (Employee)","12% / capped Rs.15K"],["PF (Employer)","12% / capped Rs.15K"],["ESI (Employee)","0.75% if gross up to Rs.21K"],["ESI (Employer)","3.25% if gross up to Rs.21K"],["Professional Tax","Rs.0 or Rs.200/mo"],["Standard Deduction","Rs.75,000/yr"],["Rebate u/s 87A","Zero tax if taxable up to Rs.12L"],["Health and Edu Cess","4% on tax"]].map(function(item){return row(item[0],item[1],NVY);})
        )),
        card(h("div",null,
          h("div",{style:{fontSize:13,fontWeight:800,color:NVY,marginBottom:2}},"Income Tax Slabs"),
          h("div",{style:{fontSize:11,color:GRY,marginBottom:11}},"New Regime - FY 2025-26"),
          [["Up to Rs.4L","Nil"],["Rs.4L to Rs.8L","5%"],["Rs.8L to Rs.12L","10%"],["Rs.12L to Rs.16L","15%"],["Rs.16L to Rs.20L","20%"],["Rs.20L to Rs.24L","25%"],["Above Rs.24L","30%"]].map(function(item){return row(item[0],item[1],item[1]==="Nil"?GRN:NVY);}),
          h("div",{style:{background:SFT,borderRadius:7,padding:"7px 9px",marginTop:9,fontSize:11,color:GRY}},"+ 4% Cess - Std. Deduction Rs.75K - 87A rebate if taxable up to Rs.12L")
        ),0)
      )
    );
  }

  function renderAddModal(){
    if(!addOpen)return null;
    return h("div",{style:{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:200,display:"flex",alignItems:"flex-end"}},
      h("div",{style:{background:CARD,borderRadius:"20px 20px 0 0",padding:20,width:"100%",maxWidth:430,margin:"0 auto",maxHeight:"91vh",overflowY:"auto"}},
        h("div",{style:{display:"flex",alignItems:"center",gap:5,marginBottom:14}},
          [1,2,3,4].map(function(s){return h("div",{key:s,style:{display:"flex",alignItems:"center",gap:5,flex:s<4?1:"auto"}},h("div",{style:{width:24,height:24,borderRadius:12,background:step>=s?NVY:BDR,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:step>=s?"#fff":GRY,flexShrink:0}},s),s<4?h("div",{style:{flex:1,height:2,background:step>s?NVY:BDR,borderRadius:1}}):null);})
        ),
        h("div",{style:{fontSize:14,fontWeight:800,color:NVY,marginBottom:1}},step===1?"Personal":step===2?"Employment":step===3?"Identity":"Tax and Deductions"),
        h("div",{style:{fontSize:11,color:GRY,marginBottom:13}},"Step "+step+" of 4"),
        step===1?h("div",null,lbl("FULL NAME *"),inpEl(n1,"e.g. Priya Sharma"),lbl("DATE OF BIRTH"),inpEl(n2,"","date"),lbl("MOBILE"),inpEl(n3,"10-digit","tel"),lbl("EMAIL"),inpEl(n4,"emp@company.com","email"),lbl("JOINING DATE"),inpEl(n5,"","date")):null,
        step===2?h("div",null,
          lbl("EMPLOYEE ID"),inpEl(e1,"e.g. EMP006"),
          lbl("ROLE / DESIGNATION *"),
          h("select",{ref:e2,defaultValue:"",style:{width:"100%",background:SFT,border:"1.5px solid "+BDR,borderRadius:11,padding:"11px 13px",fontSize:13,color:NVY,fontFamily:"inherit",outline:"none",marginBottom:10}},
            h("option",{value:""},"Select role"),
            getRoles(org.type).map(function(r){return h("option",{key:r,value:r},r);})
          ),
          lbl("DEPARTMENT"),
          h("select",{value:dept,onChange:function(ev){setDept(ev.target.value);}},
            h("option",{value:""},"Select department"),
            getDepts(org.type).map(function(d2){return h("option",{key:d2},d2);})
          ),
          lbl("MONTHLY CTC (Rs.) *"),inpEl(e3,"e.g. 50000","number"),
          h("div",{style:{background:SFT,borderRadius:8,padding:"7px 10px",marginBottom:10,fontSize:11,color:GRY}},"Auto-split: 50% Basic, 20% HRA, 30% Allowance")
        ):null,
        step===3?h("div",null,lbl("PAN"),inpEl(id2,"ABCDE1234F"),lbl("UAN (PF Account)"),inpEl(id3,"Universal Account No."),lbl("AADHAR"),inpEl(id1,"XXXX-XXXX-XXXX")):null,
        step===4?h("div",null,
          togEl("EPF / PF","12% emp + 12% employer",pf,setPf),
          pf?h("div",{style:{padding:"8px 0",borderBottom:"1px solid "+BDR}},lbl("PF Mode"),h("div",{style:{display:"flex",gap:7}},[["capped","Capped Rs.1800"],["actual","Actual Basic"]].map(function(item){return h("button",{key:item[0],onClick:function(){setPfMode(item[0]);},style:{flex:1,background:pfMode===item[0]?NVY:SFT,border:"1.5px solid "+(pfMode===item[0]?NVY:BDR),borderRadius:9,padding:"8px",color:pfMode===item[0]?"#fff":GRY,fontSize:11,fontWeight:600,cursor:"pointer"}},item[1]);}))):null,
          togEl("ESI","0.75% emp if gross up to Rs.21K",esi,setEsi),
          togEl("Professional Tax","Rs.200/mo if above Rs.15K",pt,setPt),
          togEl("TDS","FY 2025-26 new regime",tds,setTds),
          h("div",{style:{marginTop:11}},lbl("HEALTH INSURANCE (Rs./mo)"),inpEl(hiR,"e.g. 500","number")),
          h("div",null,
            h("div",{style:{fontSize:11,color:GRY,marginBottom:6,fontWeight:600}},"CUSTOM DEDUCTIONS"),
            customs.map(function(c2,i){return h("div",{key:i,style:{display:"flex",justifyContent:"space-between",alignItems:"center",background:SFT,borderRadius:7,padding:"5px 9px",marginBottom:5}},h("span",{style:{fontSize:12,color:NVY}},c2.name),h("div",{style:{display:"flex",gap:7,alignItems:"center"}},h("span",{style:{fontSize:12,fontWeight:600,color:RED}},fmt(c2.amt)),h("button",{onClick:function(){setCustoms(function(p){return p.filter(function(_,j){return j!==i;});});},style:{background:T.PILL_DANGER_BG,border:"none",borderRadius:5,padding:"2px 6px",color:RED,fontSize:10,cursor:"pointer"}},"X")));})  ,
            h("div",{style:{display:"flex",gap:7,marginTop:3}},
              h("input",{ref:cnR,placeholder:"Name e.g. Loan EMI",autoComplete:"off",style:{flex:2,background:SFT,border:"1.5px solid "+BDR,borderRadius:8,padding:"9px 10px",fontSize:13,color:NVY,outline:"none",fontFamily:"inherit"}}),
              h("input",{ref:caR,placeholder:"Rs.",type:"number",style:{flex:1,background:SFT,border:"1.5px solid "+BDR,borderRadius:8,padding:"9px 8px",fontSize:13,color:NVY,outline:"none",fontFamily:"inherit"}}),
              h("button",{onClick:function(){if(!cnR.current||!cnR.current.value||!caR.current||!caR.current.value)return;setCustoms(function(p){return p.concat([{name:cnR.current.value,amt:Number(caR.current.value)}]);});cnR.current.value="";caR.current.value="";},style:{background:NVY,border:"none",borderRadius:8,padding:"9px 10px",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer"}},"Add")
            )
          )
        ):null,
        h("div",{style:{display:"flex",gap:8,marginTop:14}},
          h("button",{onClick:function(){if(step>1)setStep(function(s){return s-1;});else{setAddOpen(false);setStep(1);}},style:{flex:1,background:SFT,border:"1px solid "+BDR,borderRadius:10,padding:11,color:GRY,fontSize:12,cursor:"pointer"}},step===1?"Cancel":"Back"),
          h("button",{onClick:function(){if(step===1&&!n1.current)return showT("Name required","err");if(step===2&&!e3.current)return showT("CTC required","err");if(step<4)setStep(function(s){return s+1;});else saveEmp();},style:{flex:2,background:NVY,border:"none",borderRadius:10,padding:11,color:CARD,fontSize:12,fontWeight:600,cursor:"pointer"}},step===4?"Save Employee":"Next")
        )
      )
    );
  }

  var appContent;
  if(screen==="login")appContent=authMode==="signup"?signupScreen:authMode==="confirm"?confirmScreen:loginScreen;
  else if(screen==="setup")appContent=setupScreen;
  else{
    var tabContent;
    if(tab==="dashboard")tabContent=renderDashboard();
    else if(tab==="employees")tabContent=renderEmployees();
    else if(tab==="attendance")tabContent=renderAttendance();
    else if(tab==="payroll")tabContent=renderPayroll();
    else tabContent=renderSettings();

    appContent=h("div",null,
      h("div",{style:{background:CARD,padding:"44px 18px 14px",borderBottom:"1px solid "+BDR,position:"sticky",top:0,zIndex:50}},
        h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"}},
          h("div",{style:{display:"flex",alignItems:"center",gap:11}},
            h("div",{onClick:function(){
              var OWNER_EMAIL="authorhalik@gmail.com";
              if(gUser&&gUser.email===OWNER_EMAIL){
                setShowAdmin(true);loadAdminUsers();
              }
            },style:{cursor:"pointer"}},logoSVG(38)),
            h("div",null,
              h("div",{style:{fontSize:9,color:GRY,letterSpacing:1.8,textTransform:"uppercase",fontWeight:600}},"Admin HR"),
              h("div",{style:{fontSize:18,fontWeight:700,color:NVY,marginTop:1,letterSpacing:-.2}},tab==="dashboard"?"Dashboard":tab==="employees"?"Team":tab==="attendance"?"Attendance":tab==="payroll"?"Payroll":"Settings")
            )
          ),
          h("div",{style:{display:"flex",alignItems:"center",gap:8,position:"relative"}},
            h("button",{onClick:function(){var nx=themeMode==="light"?"dark":"light";setThemeMode(nx);showT(nx==="light"?"Light mode":"Dark mode");},style:{width:38,height:38,borderRadius:11,background:SFT,border:"1px solid "+BDR,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"all .15s"},title:"Toggle theme"},ic(themeMode==="light"?"dark_mode":"light_mode",NVY,19)),
            h("button",{onClick:function(){setProf(function(v){return !v;});},style:{width:38,height:38,borderRadius:11,background:NVY,border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",overflow:"hidden",padding:0}},gUser&&gUser.photo?h("img",{src:gUser.photo,width:38,height:38,style:{borderRadius:11,display:"block"}}):ic(ICONS.user,CARD,19)),
            prof?h("div",{style:{position:"absolute",top:42,right:0,background:CARD,border:"1px solid "+BDR,borderRadius:13,padding:6,minWidth:185,boxShadow:T.SHADOW_LG,zIndex:200}},
              h("div",{style:{padding:"7px 11px",borderBottom:"1px solid "+BDR,marginBottom:3}},h("div",{style:{fontSize:12,fontWeight:700,color:NVY}},gUser?gUser.name:org.position),h("div",{style:{fontSize:11,color:GRY}},org.name),h("div",{style:{fontSize:10,color:GRY}},gUser?gUser.email:"")),
              [["Settings",function(){setTab("settings");setSettTab("profile");setProf(false);}]].map(function(item){return h("button",{key:item[0],onClick:item[1],style:{width:"100%",background:"none",border:"none",borderRadius:7,padding:"7px 11px",textAlign:"left",fontSize:12,fontWeight:500,color:NVY,cursor:"pointer"}},item[0]);}),
              isAdmin?h("button",{onClick:function(){setShowAdmin(true);setProf(false);loadAdminUsers();},style:{width:"100%",background:"none",border:"none",borderRadius:7,padding:"7px 11px",textAlign:"left",fontSize:12,fontWeight:700,color:AMB,cursor:"pointer"}},"Admin Panel"):null,
              h("div",{style:{borderTop:"1px solid "+BDR,marginTop:3,paddingTop:3}},
                h("button",{onClick:function(){_sb.auth.signOut();setGUser(null);lsSet("hr_guser",null);setScreen("login");setProf(false);},style:{width:"100%",background:"none",border:"none",borderRadius:7,padding:"7px 11px",textAlign:"left",fontSize:12,fontWeight:500,color:RED,cursor:"pointer"}},"Sign Out")
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
        navBtn2("settings","Settings","set",tab,setTab,setSelE,setEditE,setSheetE,setOffE,setEditPayE)
      ),
      toast?h("div",{style:{position:"fixed",top:18,left:"50%",transform:"translateX(-50%)",background:toast.type==="err"?RED:(themeMode==="light"?"#0F172A":"#fff"),color:toast.type==="err"?"#fff":(themeMode==="light"?"#fff":"#0F172A"),padding:"10px 20px",borderRadius:30,fontSize:13,fontWeight:600,zIndex:999,whiteSpace:"nowrap",boxShadow:T.SHADOW_LG,animation:"fU .2s ease"}},toast.msg):null,
      showBkup?h("div",{style:{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:"24px"}},
        h("div",{style:{background:CARD,borderRadius:18,padding:22,width:"100%",maxWidth:360,boxShadow:"0 20px 60px rgba(0,0,0,.35)",animation:"sU .3s ease"}},
          h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}},
            h("div",{style:{display:"flex",alignItems:"center",gap:10}},
              h("div",{style:{width:42,height:42,borderRadius:12,background:"#FEF3C7",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}},"Backup"),
              h("div",null,
                h("div",{style:{fontSize:16,fontWeight:800,color:NVY}},"Monthly Backup"),
                h("div",{style:{fontSize:11,color:GRY,marginTop:1}},"Start of month reminder")
              )
            ),
            h("button",{onClick:function(){
              var thisMonth=new Date().getFullYear()+"-"+(new Date().getMonth()+1);
              lsSet("hr_bkup_dismissed",thisMonth);setShowBkup(false);
            },style:{background:"none",border:"none",cursor:"pointer",padding:4}},ic("close",GRY,18))
          ),
          h("div",{style:{background:themeMode==="light"?"#FFFBEB":"#3a3322",border:"1px solid #FCD34D66",borderRadius:10,padding:"11px 13px",marginBottom:14,display:"flex",alignItems:"center",gap:10}},
            h("span",{style:{fontSize:20}},"App"),
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
            makePayrollCSV(actEmps,curM,curY,mAtt,getInc);
            setShowBkup(false);
            showT("Downloading all 3 reports...");
          },style:{width:"100%",background:NVY,border:"none",borderRadius:12,padding:"13px",color:CARD,fontSize:13,fontWeight:700,cursor:"pointer",marginBottom:8,display:"flex",alignItems:"center",justifyContent:"center",gap:7}},
            ic("download",CARD,15),"Download All Reports Now"
          ),
          h("button",{onClick:function(){
            var thisMonth=new Date().getFullYear()+"-"+(new Date().getMonth()+1);
            lsSet("hr_bkup_dismissed",thisMonth);setShowBkup(false);
          },style:{width:"100%",background:"none",border:"1px solid "+BDR,borderRadius:12,padding:"10px",color:GRY,fontSize:12,cursor:"pointer"}},"Remind me next month")
        )
      ):null,
      renderAddModal()
    );
  }

  function renderAdminPanel(){
    var sSearch=st(""),adminSearch=sSearch[0],setAdminSearch=sSearch[1];
    var sEditExp=st(null),editExpEmail=sEditExp[0],setEditExpEmail=sEditExp[1];
    var sExpInput=st(""),expInput=sExpInput[0],setExpInput=sExpInput[1];

    function countdown(expiresOn){
      if(!expiresOn)return null;
      var now=new Date();
      var end=new Date(expiresOn);
      end.setHours(23,59,59,999);
      var diff=end-now;
      if(diff<=0)return h("div",{style:{fontSize:10,color:RED,fontWeight:700}},"EXPIRED");
      var dd=Math.floor(diff/86400000);
      var hh=Math.floor((diff%86400000)/3600000);
      var mm=Math.floor((diff%3600000)/60000);
      var ss=Math.floor((diff%60000)/1000);
      var color=dd<=3?RED:dd<=7?AMB:GRN;
      return h("div",{style:{fontSize:10,fontWeight:700,color:color,fontFamily:"monospace",letterSpacing:.5}},
        String(dd).padStart(2,"0")+"d "+String(hh).padStart(2,"0")+"h "+String(mm).padStart(2,"0")+"m "+String(ss).padStart(2,"0")+"s"
      );
    }

    // Live countdown tick
    var sTick=st(0),setTick=sTick[1];
    se(function(){
      var t=setInterval(function(){setTick(function(v){return v+1;});},1000);
      return function(){clearInterval(t);};
    },[]);

    var filtered=adminUsers.filter(function(u){
      if(!adminSearch)return true;
      return u.email.toLowerCase().includes(adminSearch.toLowerCase());
    });

    return h("div",{style:{position:"fixed",inset:0,background:"rgba(0,0,0,.7)",zIndex:500,display:"flex",alignItems:"flex-end",justifyContent:"center"},onClick:function(e){if(e.target===e.currentTarget){setShowAdmin(false);setAdminSearch("");}}},
      h("div",{style:{width:"100%",maxWidth:430,background:CARD,borderRadius:"20px 20px 0 0",maxHeight:"88vh",display:"flex",flexDirection:"column"}},
        // Header
        h("div",{style:{padding:"16px 16px 12px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid "+BDR,flexShrink:0}},
          h("div",null,
            h("div",{style:{fontSize:14,fontWeight:700,color:NVY}},"Admin Panel"),
            h("div",{style:{fontSize:10,color:GRY,marginTop:2}},adminUsers.length+" total users")
          ),
          h("div",{style:{display:"flex",gap:8,alignItems:"center"}},
            h("button",{onClick:function(){loadAdminUsers();showT("Refreshed");},style:{background:SFT,border:"1px solid "+BDR,borderRadius:8,padding:"5px 12px",fontSize:11,fontWeight:700,color:NVY,cursor:"pointer"}},"Refresh"),
            h("button",{onClick:function(){setShowAdmin(false);setAdminSearch("");},style:{background:"none",border:"none",fontSize:20,cursor:"pointer",color:GRY}},"×")
          )
        ),
        // Search
        h("div",{style:{padding:"10px 14px",borderBottom:"1px solid "+BDR,flexShrink:0}},
          h("input",{value:adminSearch,onChange:function(e){setAdminSearch(e.target.value);},placeholder:"Search by email...",style:{width:"100%",background:SFT,border:"1.5px solid "+BDR,borderRadius:10,padding:"9px 12px",fontSize:13,color:NVY,outline:"none",fontFamily:"inherit"}})
        ),
        // Users list
        h("div",{style:{overflowY:"auto",padding:14,flex:1}},
          filtered.length===0?h("div",{style:{textAlign:"center",padding:24,color:GRY}},adminUsers.length===0?"No users yet. Click Refresh.":"No users match your search."):
          filtered.map(function(u){
            var joined=u.joined_at?new Date(u.joined_at).toLocaleDateString("en-IN"):"";
            var lastLogin=u.last_sign_in_at?new Date(u.last_sign_in_at).toLocaleDateString("en-IN"):"Never";
            var confirmed=!!u.email_confirmed_at;
            var isOwner=u.email===OWNER_EMAIL;
            var isEditingExp=editExpEmail===u.email;
            return h("div",{key:u.email,style:{background:SFT,borderRadius:12,padding:"11px 12px",marginBottom:10,border:"1px solid "+(u.plan==="paid"?GRN+"44":BDR)}},
              // Email + plan badge
              h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:5}},
                h("div",{style:{fontSize:12,fontWeight:700,color:NVY,flex:1,marginRight:8,wordBreak:"break-all"}},u.email,isOwner?h("span",{style:{fontSize:9,color:AMB,fontWeight:600,marginLeft:6}},"OWNER"):null),
                h("div",{style:{fontSize:10,fontWeight:700,color:u.plan==="paid"?GRN:GRY,background:(u.plan==="paid"?GRN:GRY)+"18",borderRadius:20,padding:"2px 8px",flexShrink:0}},u.plan==="paid"?"PAID":"FREE")
              ),
              // Meta info
              h("div",{style:{display:"flex",gap:6,marginBottom:6,flexWrap:"wrap"}},
                h("div",{style:{fontSize:9,color:confirmed?GRN:AMB,background:(confirmed?GRN:AMB)+"18",borderRadius:4,padding:"1px 6px"}},confirmed?"✓ Verified":"⚠ Unverified"),
                h("div",{style:{fontSize:9,color:GRY}},"Joined: "+joined),
                h("div",{style:{fontSize:9,color:GRY}},"Last: "+lastLogin),
                h("div",{style:{fontSize:9,color:TEL,background:TEL+"15",borderRadius:4,padding:"1px 6px"}},"Emp: "+(u.emp_limit||(u.plan==="paid"?"Unlimited":"5")))
              ),
              // Expiry countdown
              u.plan==="paid"?h("div",{style:{background:CARD,borderRadius:8,padding:"7px 10px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}},
                h("div",null,
                  h("div",{style:{fontSize:9,color:GRY,marginBottom:2}},"EXPIRES"),
                  u.expires_on
                    ?h("div",{style:{fontSize:10,color:GRY}},new Date(u.expires_on).toLocaleDateString("en-IN"))
                    :h("div",{style:{fontSize:10,color:GRY}},"No expiry set")
                ),
                u.expires_on?(function(){var now=new Date(),end=new Date(u.expires_on);end.setHours(23,59,59,999);var diff=end-now;var isExp=diff<=0;var dd2=Math.max(0,Math.floor(diff/86400000));var hh2=Math.max(0,Math.floor((diff%86400000)/3600000));var mm2=Math.max(0,Math.floor((diff%3600000)/60000));var ss2=Math.max(0,Math.floor((diff%60000)/1000));var col2=isExp?RED:dd2<=3?RED:dd2<=7?AMB:GRN;return h("div",{style:{textAlign:"right"}},h("div",{style:{fontFamily:"monospace",fontSize:12,fontWeight:800,color:col2,letterSpacing:1}},isExp?"EXPIRED":String(dd2).padStart(2,"0")+":"+String(hh2).padStart(2,"0")+":"+String(mm2).padStart(2,"0")+":"+String(ss2).padStart(2,"0")),h("div",{style:{fontSize:8,color:col2,letterSpacing:.5}},"DD:HH:MM:SS"));}()):h("div",{style:{fontSize:10,color:GRN,fontWeight:700}},"Lifetime")
              ):null,
              // Set expiry input
              isEditingExp?h("div",{style:{display:"flex",gap:6,marginBottom:8}},
                h("input",{type:"date",value:expInput,onChange:function(e){setExpInput(e.target.value);},style:{flex:1,background:CARD,border:"1.5px solid "+BDR,borderRadius:8,padding:"6px 10px",fontSize:12,color:NVY,outline:"none",fontFamily:"inherit"}}),
                h("button",{onClick:function(){
                  if(!expInput)return showT("Select a date","err");
                  _sb.from("user_plans").upsert({email:u.email,plan:"paid",expires_on:expInput,activated_on:u.activated_on||new Date().toISOString().split("T")[0]},{onConflict:"email"})
                  .then(function(){loadAdminUsers();setEditExpEmail(null);setExpInput("");showT("Expiry set for "+u.email.split("@")[0]);});
                },style:{background:GRN,border:"none",borderRadius:8,padding:"6px 12px",fontSize:11,fontWeight:700,color:"#fff",cursor:"pointer"}},"Save"),
                h("button",{onClick:function(){setEditExpEmail(null);setExpInput("");},style:{background:SFT,border:"1px solid "+BDR,borderRadius:8,padding:"6px 10px",fontSize:11,color:GRY,cursor:"pointer"}},"Cancel")
              ):null,
              // Action buttons
              h("div",{style:{display:"flex",gap:6}},
                u.plan!=="paid"
                  ?h("button",{onClick:function(){setUserPlan(u.email,"paid");},style:{flex:1,background:GRN,border:"none",borderRadius:7,padding:"7px",fontSize:11,fontWeight:700,color:"#fff",cursor:"pointer"}},"Set Paid")
                  :h("button",{onClick:function(){setUserPlan(u.email,"free");},style:{flex:1,background:GRY,border:"none",borderRadius:7,padding:"7px",fontSize:11,fontWeight:700,color:"#fff",cursor:"pointer"}},"Set Free"),
                h("button",{onClick:function(){setEditExpEmail(isEditingExp?null:u.email);setExpInput(u.expires_on||"");},style:{background:SFT,border:"1px solid "+BDR,borderRadius:7,padding:"7px 10px",fontSize:11,fontWeight:700,color:NVY,cursor:"pointer"}},isEditingExp?"Cancel Exp":"Set Expiry"),
                h("button",{onClick:function(){var lim=window.prompt("Employee limit for "+u.email.split("@")[0]+" (leave blank = unlimited):",u.emp_limit||"");if(lim===null)return;var limNum=lim?parseInt(lim)||999:null;_sb.from("user_plans").upsert({email:u.email,plan:u.plan,emp_limit:limNum},{onConflict:"email"}).then(function(){loadAdminUsers();showT("Limit set: "+(limNum||"unlimited"));});},style:{background:SFT,border:"1px solid "+BDR,borderRadius:7,padding:"7px 10px",fontSize:11,fontWeight:700,color:NVY,cursor:"pointer"}},"Emp Limit")
              )
            );
          })
        )
      )
    );
  }

  return h("div",{style:{fontFamily:"Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",background:PAGE,minHeight:"100vh",display:"flex",justifyContent:"center",transition:"background .25s"}},
    h("style",{dangerouslySetInnerHTML:{__html:CSS_LIVE}}),
    h("div",{style:{width:"100%",maxWidth:430,minHeight:"100vh",position:"relative",display:"flex",flexDirection:"column"}},
      showUpdate?h("div",{style:{position:"fixed",top:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,zIndex:9999,background:"#0F172A",padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,boxShadow:"0 2px 12px rgba(0,0,0,.3)"}},
        h("div",{style:{fontSize:12,color:"#fff",fontWeight:600}},"\u2728 New update available!"),
        h("button",{onClick:function(){window.location.reload(true);},style:{background:"#FCD34D",border:"none",borderRadius:8,padding:"6px 14px",fontSize:12,fontWeight:700,color:"#0F172A",cursor:"pointer",flexShrink:0}},"Update Now")
      ):null,
      showAdmin?renderAdminPanel():null,
      appContent
    )
  );
}
