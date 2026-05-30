import { useState, useRef, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════
//  CONSTANTS
// ═══════════════════════════════════════════════════════════════
const BLOOD_TYPES = ["A+","A-","B+","B-","AB+","AB-","O+","O-"];
const WEIGHT_CATS = ["49kg","55kg","59kg","64kg","71kg","76kg","81kg","87kg","96kg","102kg","109kg","+109kg"];
const ROLES = [
  {id:"Athlete",en:"Athlete",ar:"لاعب"},
  {id:"Coach",en:"Coach",ar:"مدرب"},
  {id:"Ass. Coach",en:"Ass. Coach",ar:"مساعد مدرب"},
  {id:"HPD",en:"HPD",ar:"مدير الأداء العالي"},
  {id:"HPM",en:"HPM",ar:"مدير الأداء"},
  {id:"Referee",en:"Referee",ar:"حكم"},
  {id:"Team",en:"Team",ar:"فريق"},
];
const GENDERS = ["Male","Female"];
const SA_BANKS = [
  "Al Rajhi Bank","Saudi National Bank (SNB)","Riyad Bank","Banque Saudi Fransi (BSF)",
  "Arab National Bank (ANB)","Saudi British Bank (SABB)","Alinma Bank","Al Bilad Bank",
  "Bank AlJazira","Saudi Investment Bank (SAIB)","Gulf International Bank (GIB)",
  "Citibank Saudi Arabia","HSBC Saudi Arabia","First Abu Dhabi Bank (FAB)",
  "Emirates NBD Saudi Arabia","Kuwait Finance House (KFH)","Other (اكتب يدوياً)"
];
const SOCIAL_PLATFORMS = [
  {id:"instagram",label:"Instagram",icon:"ti-brand-instagram"},
  {id:"twitter",label:"X (Twitter)",icon:"ti-brand-x"},
  {id:"snapchat",label:"Snapchat",icon:"ti-brand-snapchat"},
  {id:"tiktok",label:"TikTok",icon:"ti-brand-tiktok"},
  {id:"facebook",label:"Facebook",icon:"ti-brand-facebook"},
  {id:"youtube",label:"YouTube",icon:"ti-brand-youtube"},
];
const VIOLATION_TYPES = [
  {en:"Disciplinary",ar:"تأديبية"},{en:"Technical",ar:"فنية"},{en:"Financial",ar:"مالية"},
  {en:"Attendance",ar:"غياب وحضور"},{en:"Code of Conduct",ar:"مخالفة السلوك"},
  {en:"Anti-Doping",ar:"مكافحة المنشطات"},{en:"Social Media Misuse",ar:"إساءة التواصل"},{en:"Other",ar:"أخرى"},
];
const PUNISHMENT_TYPES = [
  {en:"Warning",ar:"إنذار"},{en:"Fine",ar:"غرامة مالية"},{en:"Suspension (games)",ar:"إيقاف مباريات"},
  {en:"Suspension (period)",ar:"إيقاف مدة"},{en:"Training Exclusion",ar:"إقصاء من التدريب"},
  {en:"Contract Termination",ar:"إنهاء العقد"},{en:"Other",ar:"أخرى"},
];
const TOURNAMENT_TYPES = [
  {en:"Local",ar:"محلي"},{en:"Regional",ar:"إقليمي"},{en:"International",ar:"دولي"},
  {en:"World Championship",ar:"بطولة عالمية"},{en:"Olympic Games",ar:"أولمبياد"},
  {en:"Asian Championship",ar:"بطولة آسيوية"},{en:"Arab Championship",ar:"بطولة عربية"},
  {en:"Gulf Championship",ar:"بطولة خليجية"},{en:"Cup",ar:"كأس"},{en:"Other",ar:"أخرى"},
];
const INJURY_TYPES = [
  "Muscle strain / شد عضلي","Ligament tear / تمزق رباط","Fracture / كسر","Dislocation / خلع",
  "Concussion / ارتجاج","Tendonitis / التهاب وتر","Back injury / ظهر","Knee injury / ركبة",
  "Shoulder injury / كتف","Other / أخرى"
];
const ATTACHMENTS = [
  {key:"photo",label:"Personal Photograph",labelAr:"صورة شخصية",icon:"ti-camera",required:true,accept:"image/*",maxMB:5},
  {key:"national_id",label:"National ID Copy",labelAr:"نسخة الهوية",icon:"ti-id-badge",required:true,accept:"image/*,application/pdf",maxMB:10},
  {key:"passport",label:"Passport Copy",labelAr:"نسخة الجواز",icon:"ti-world",required:true,accept:"image/*,application/pdf",maxMB:10},
  {key:"drivers_license",label:"Driver's License",labelAr:"رخصة القيادة",icon:"ti-car",required:false,accept:"image/*,application/pdf",maxMB:10},
  {key:"address_doc",label:"Address Verification",labelAr:"وثيقة العنوان",icon:"ti-map-pin",required:true,accept:"image/*,application/pdf",maxMB:10},
  {key:"iban_cert",label:"IBAN Certificate",labelAr:"شهادة الآيبان",icon:"ti-building-bank",required:true,accept:"image/*,application/pdf",maxMB:10},
];
const ROLE_COLORS = {
  "Athlete":{bg:"#E6F1FB",text:"#185FA5",border:"#B5D4F4"},
  "Coach":{bg:"#EAF3DE",text:"#3B6D11",border:"#A8D57A"},
  "Ass. Coach":{bg:"#E1F5EE",text:"#0F6E56",border:"#7BCFB3"},
  "HPD":{bg:"#EEEDFE",text:"#534AB7",border:"#BCB9F5"},
  "HPM":{bg:"#FAEEDA",text:"#854F0B",border:"#F5C87A"},
  "Referee":{bg:"#FCEBEB",text:"#A32D2D",border:"#F5ABAB"},
  "Team":{bg:"#F1EFE8",text:"#444441",border:"#D4D0C4"},
};
const GENDER_COLORS = {"Male":{bg:"#E6F1FB",text:"#185FA5"},"Female":{bg:"#FBEAF0",text:"#993556"}};

// ═══════════════════════════════════════════════════════════════
//  UTILS
// ═══════════════════════════════════════════════════════════════
const fmtDate = (d) => {
  if (!d) return "—";
  try { return new Date(d+"T00:00:00").toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}); }
  catch { return d; }
};
const monthsUntil = (d) => {
  if (!d) return null;
  const diff = new Date(d+"T00:00:00") - new Date();
  return Math.floor(diff / (1000*60*60*24*30.44));
};
const iS = (err) => ({
  width:"100%",padding:"9px 12px",fontSize:13,borderRadius:8,boxSizing:"border-box",
  border:`1px solid ${err?"#E24B4A":"var(--color-border-secondary)"}`,
  background:err?"rgba(252,91,91,0.04)":"rgba(255,255,255,0.55)",
  color:"var(--color-text-primary)",outline:"none",fontFamily:"inherit",
});
const sS = (err) => ({...iS(err),cursor:"pointer"});

// ═══════════════════════════════════════════════════════════════
//  SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════
function Badge({children,style}){
  return <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:500,...style}}>{children}</span>;
}
function Avatar({name,role,photoUrl,size=44}){
  const rc=ROLE_COLORS[role]||{bg:"#F1EFE8",text:"#444441"};
  if(photoUrl) return <img src={photoUrl} alt={name||""} style={{width:size,height:size,borderRadius:"50%",objectFit:"cover",flexShrink:0,border:"2px solid rgba(255,255,255,0.8)"}}/>;
  const ini=(name||"?").split(" ").slice(0,2).map(n=>n[0]).join("").toUpperCase();
  return <div style={{width:size,height:size,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.3,fontWeight:700,background:rc.bg,color:rc.text,flexShrink:0,border:"2px solid rgba(255,255,255,0.8)"}}>{ini}</div>;
}
function FL({en,ar,required}){
  return <label style={{fontSize:12,fontWeight:500,color:"var(--color-text-secondary)",display:"block",marginBottom:4}}>
    {en} {ar&&<span style={{fontSize:10,color:"var(--color-text-tertiary)"}}>/ {ar}</span>}
    {required&&<span style={{color:"#E24B4A"}}> *</span>}
  </label>;
}
function ST({en,ar}){
  return <p style={{fontSize:11,fontWeight:700,color:"var(--color-text-tertiary)",margin:"0 0 10px",textTransform:"uppercase",letterSpacing:1.2}}>
    {en} <span style={{fontWeight:400,fontSize:10,textTransform:"none"}}>/ {ar}</span>
  </p>;
}
function Err({msg}){return msg?<p style={{margin:"3px 0 0",fontSize:11,color:"#E24B4A"}}>{msg}</p>:null;}

// ═══════════════════════════════════════════════════════════════
//  FILE UPLOAD
// ═══════════════════════════════════════════════════════════════
function FileUploadZone({attachment,value,onChange}){
  const[dragging,setDragging]=useState(false);
  const[error,setError]=useState("");
  const ref=useRef();
  const validate=(f)=>{
    if(!f)return"No file";
    if(f.size>attachment.maxMB*1024*1024)return`Max ${attachment.maxMB}MB`;
    const ext=f.name.split(".").pop().toLowerCase();
    if(!["jpg","jpeg","png","gif","webp","pdf"].includes(ext))return"JPG/PNG/PDF only";
    return null;
  };
  const handle=(f)=>{
    const e=validate(f);if(e){setError(e);return;}setError("");
    const r=new FileReader();r.onload=(ev)=>onChange({file:f,url:ev.target.result,name:f.name,size:f.size});r.readAsDataURL(f);
  };
  const sz=value?(value.size>1024*1024?(value.size/1024/1024).toFixed(1)+" MB":Math.round(value.size/1024)+" KB"):"";
  return <div>
    <div onClick={()=>ref.current.click()}
      onDragOver={e=>{e.preventDefault();setDragging(true);}} onDragLeave={()=>setDragging(false)}
      onDrop={e=>{e.preventDefault();setDragging(false);handle(e.dataTransfer.files[0]);}}
      style={{border:`1.5px dashed ${dragging?"#378ADD":value?"#639922":error?"#E24B4A":"var(--color-border-secondary)"}`,
        borderRadius:10,padding:"11px",cursor:"pointer",
        background:dragging?"rgba(55,138,221,0.05)":value?"rgba(99,153,34,0.05)":"rgba(255,255,255,0.45)",
        transition:"all 0.15s",display:"flex",alignItems:"center",gap:10}}>
      <i className={`ti ${attachment.icon}`} style={{fontSize:19,color:value?"#3B6D11":"var(--color-text-secondary)"}}/>
      <div style={{flex:1,minWidth:0}}>
        <p style={{margin:0,fontSize:13,fontWeight:500,color:"var(--color-text-primary)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
          {value?value.name:attachment.label}</p>
        <p style={{margin:0,fontSize:10,color:"var(--color-text-tertiary)"}}>
          {attachment.labelAr||""} {value?`· ${sz} · ✓ Accepted`:`· Max ${attachment.maxMB}MB · JPG/PNG/PDF`}
          {!attachment.required&&!value?" · Optional":""}
        </p>
      </div>
      {value?<i className="ti ti-circle-check" style={{fontSize:17,color:"#639922"}}/>
            :<i className="ti ti-upload" style={{fontSize:14,color:"var(--color-text-tertiary)"}}/>}
    </div>
    {error&&<p style={{margin:"3px 0 0",fontSize:11,color:"#E24B4A"}}>{error}</p>}
    <input ref={ref} type="file" accept={attachment.accept||"*"} style={{display:"none"}} onChange={e=>handle(e.target.files[0])}/>
  </div>;
}
function SimpleUpload({label,labelAr="",icon="ti-file",accept="image/*,application/pdf",maxMB=10,value,onChange}){
  return <FileUploadZone attachment={{label,labelAr,icon,accept,maxMB,required:false}} value={value} onChange={onChange}/>;
}

// ═══════════════════════════════════════════════════════════════
//  SIGNATURE PAD
// ═══════════════════════════════════════════════════════════════
function SignaturePad({value,onChange}){
  const ref=useRef();const drawing=useRef(false);
  const gp=(e,c)=>{const r=c.getBoundingClientRect(),s=e.touches?e.touches[0]:e;return{x:s.clientX-r.left,y:s.clientY-r.top};};
  const start=e=>{e.preventDefault();drawing.current=true;const c=ref.current,ctx=c.getContext("2d"),p=gp(e,c);ctx.beginPath();ctx.moveTo(p.x,p.y);};
  const draw=e=>{e.preventDefault();if(!drawing.current)return;const c=ref.current,ctx=c.getContext("2d"),p=gp(e,c);ctx.lineWidth=2;ctx.lineCap="round";ctx.strokeStyle="#042C53";ctx.lineTo(p.x,p.y);ctx.stroke();ctx.beginPath();ctx.moveTo(p.x,p.y);};
  const stop=()=>{if(!drawing.current)return;drawing.current=false;onChange(ref.current.toDataURL());};
  const clear=()=>{ref.current.getContext("2d").clearRect(0,0,ref.current.width,ref.current.height);onChange(null);};
  return <div>
    <FL en="Player Signature" ar="توقيع اللاعب"/>
    <div style={{border:"1px solid var(--color-border-secondary)",borderRadius:10,overflow:"hidden",background:"#FAFAFA",position:"relative"}}>
      <canvas ref={ref} width={600} height={110} style={{display:"block",width:"100%",height:110,cursor:"crosshair",touchAction:"none"}}
        onMouseDown={start} onMouseMove={draw} onMouseUp={stop} onMouseLeave={stop}
        onTouchStart={start} onTouchMove={draw} onTouchEnd={stop}/>
      <button onClick={clear} style={{position:"absolute",top:6,right:8,fontSize:11,padding:"3px 10px",borderRadius:6,border:"0.5px solid var(--color-border-secondary)",background:"rgba(255,255,255,0.9)",cursor:"pointer",color:"var(--color-text-secondary)",fontFamily:"inherit"}}>
        Clear / مسح</button>
      {!value&&<p style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",margin:0,fontSize:12,color:"#ccc",pointerEvents:"none",whiteSpace:"nowrap"}}>Sign here / وقّع هنا</p>}
    </div>
    {value&&<p style={{margin:"4px 0 0",fontSize:11,color:"#3B6D11"}}>✓ Signature captured / تم التوقيع</p>}
  </div>;
}

// ═══════════════════════════════════════════════════════════════
//  PRINT ENGINE
// ═══════════════════════════════════════════════════════════════
const CSS = `
@media print{body>*:not(#pr){display:none!important}#pr{display:block!important}}
@page{margin:14mm;size:A4}
.pp{font-family:'Segoe UI',Arial,sans-serif;color:#111}
.ph{background:#042C53;color:#fff;padding:20px 28px;display:flex;align-items:center;gap:18px}
.pphoto{width:70px;height:70px;border-radius:50%;object-fit:cover;border:3px solid rgba(255,255,255,0.35)}
.pph-pl{width:70px;height:70px;border-radius:50%;background:rgba(255,255,255,0.15);display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700;color:#fff;border:3px solid rgba(255,255,255,0.25)}
.ptitle{font-size:19px;font-weight:700;margin:0 0 3px}
.psub{font-size:11px;opacity:.65;margin:0}
.pbdg{display:inline-flex;align-items:center;gap:4px;background:rgba(255,255,255,0.14);color:#fff;padding:3px 10px;border-radius:20px;font-size:11px;margin:2px 3px 0 0}
.psec{padding:14px 28px;border-bottom:1px solid #eee}
.pst{font-size:9px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:1.5px;margin:0 0 10px}
.pg3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}
.pg2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.pfl{font-size:10px;color:#999;margin:0 0 2px}
.pfv{font-size:12px;font-weight:500;margin:0;word-break:break-all}
.ptbl{width:100%;border-collapse:collapse;font-size:11px;margin-top:6px}
.ptbl th{background:#F4F6FA;padding:7px 9px;text-align:left;font-size:9px;font-weight:700;color:#555;border:1px solid #ddd;letter-spacing:.5px;text-transform:uppercase}
.ptbl td{padding:7px 9px;border:1px solid #ddd;vertical-align:top}
.ptbl tr:nth-child(even) td{background:#FAFAFA}
.pvb{display:inline-block;padding:2px 8px;border-radius:10px;font-size:10px;background:#FCEBEB;color:#A32D2D}
.pab{display:inline-block;padding:2px 8px;border-radius:10px;font-size:10px;background:#EAF3DE;color:#3B6D11}
.psig{max-width:150px;height:44px;object-fit:contain;border:1px solid #eee;border-radius:5px}
.pft{padding:12px 28px;text-align:center;font-size:9px;color:#bbb;border-top:1px solid #eee}
.vrph{background:linear-gradient(135deg,#042C53,#0A4A80);color:#fff;padding:22px 30px}
.vrpt{font-size:20px;font-weight:700;margin:0 0 3px}
.vrps{font-size:11px;opacity:.6;margin:0}
.arph{background:linear-gradient(135deg,#0F6E56,#1D9E75);color:#fff;padding:22px 30px}
.arp-card{border:1px solid #e0e0e0;border-radius:10px;padding:14px;margin-bottom:10px;page-break-inside:avoid}
.vpr{display:flex;align-items:center;gap:8px}
.vpa{width:34px;height:34px;border-radius:50%;object-fit:cover}
.vpa-ph{width:34px;height:34px;border-radius:50%;background:#E6F1FB;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#185FA5}
`;
const injectCSS=()=>{if(document.getElementById("tm-css"))return;const s=document.createElement("style");s.id="tm-css";s.textContent=CSS;document.head.appendChild(s);};
function printHTML(html){
  injectCSS();
  let r=document.getElementById("pr");
  if(!r){r=document.createElement("div");r.id="pr";document.body.appendChild(r);}
  r.innerHTML=html;window.print();setTimeout(()=>{r.innerHTML="";},1200);
}

function memberPrint(member,viols,achvs){
  const rc=ROLE_COLORS[member.role]||{};
  const ph=member.files?.photo?.url
    ?`<img class="pphoto" src="${member.files.photo.url}"/>`
    :`<div class="pph-pl">${(member.fullName||"?").split(" ").slice(0,2).map(n=>n[0]).join("").toUpperCase()}</div>`;
  const rf=(l,v)=>`<div><p class="pfl">${l}</p><p class="pfv">${v||"—"}</p></div>`;
  const vrows=viols.length?viols.map(v=>`<tr>
    <td>${fmtDate(v.date)}</td><td><span class="pvb">${v.violationType||"—"}</span></td>
    <td>${v.punishmentType||"—"}</td><td>${v.campName||"—"}</td><td style="font-size:10px">${v.description||"—"}</td>
    <td>${v.signature?`<img class="psig" src="${v.signature}"/>`:"—"}</td>
  </tr>`).join(""):`<tr><td colspan="6" style="text-align:center;color:#bbb;padding:14px">No violations</td></tr>`;
  const arows=achvs.length?achvs.map(a=>`<tr>
    <td style="font-weight:600">${a.tournamentName||"—"}</td><td>${a.tournamentType||"—"}</td>
    <td>${a.location||"—"}</td><td>${fmtDate(a.startDate)}${a.endDate?" → "+fmtDate(a.endDate):""}</td>
    <td style="font-weight:600">${a.overallRank||"—"}</td>
    <td>${[a.snatchResult?"S:"+a.snatchResult+"kg":"",a.cleanResult?"C&J:"+a.cleanResult+"kg":"",a.totalResult?"T:"+a.totalResult+"kg":""].filter(Boolean).join(" | ")||"—"}</td>
    <td>${[a.goldMedals&&a.goldMedals!="0"?"🥇"+a.goldMedals:"",a.silverMedals&&a.silverMedals!="0"?"🥈"+a.silverMedals:"",a.bronzeMedals&&a.bronzeMedals!="0"?"🥉"+a.bronzeMedals:""].filter(Boolean).join(" ")||"—"}</td>
  </tr>`).join(""):`<tr><td colspan="7" style="text-align:center;color:#bbb;padding:14px">No achievements</td></tr>`;
  const injrows=(member.injuries||[]).length?(member.injuries||[]).map(i=>`<tr>
    <td>${fmtDate(i.date)}</td><td>${i.injuryType||"—"}</td><td>${i.details||"—"}</td><td>${i.status||"Active"}</td>
  </tr>`).join(""):`<tr><td colspan="4" style="text-align:center;color:#bbb;padding:14px">No injuries</td></tr>`;
  const docrows=ATTACHMENTS.map(a=>{
    const f=member.files?.[a.key];
    return `<tr><td>${a.label}</td><td>${a.labelAr}</td><td style="color:${f?"#3B6D11":"#A32D2D"};font-weight:600">${f?"✓ Uploaded":"✗ Missing"}</td></tr>`;
  }).join("");
  return `<div class="pp">
  <div class="ph">${ph}<div style="flex:1">
    <p class="ptitle">${member.fullName||"—"} &nbsp;|&nbsp; <span style="font-weight:400;opacity:.8">${member.fullNameAr||"—"}</span></p>
    <p class="psub">ID: ${member.nationalId||"—"} · Registered: ${fmtDate((member.registeredAt||"").substring(0,10))}</p>
    <div style="margin-top:6px">
      <span class="pbdg">${member.role||"—"}</span>
      <span class="pbdg">${member.squad||"—"}</span>
      ${member.bloodType?`<span class="pbdg">🩸 ${member.bloodType}</span>`:""}
      ${member.weightCategory?`<span class="pbdg">⚖️ ${member.weightCategory}</span>`:""}
      ${member.athleteType?`<span class="pbdg">${member.athleteType}${member.athleteGrade?" · "+member.athleteGrade:""}</span>`:""}
    </div>
  </div>
  <div style="text-align:right;font-size:10px;opacity:.6"><p style="margin:0">Generated</p><p style="margin:2px 0 0;font-size:12px;font-weight:600">${new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})}</p></div>
  </div>
  <div class="psec"><p class="pst">Personal & Contact / الشخصي</p><div class="pg3">
    ${rf("Full Name EN",member.fullName)}${rf("Full Name AR",member.fullNameAr)}${rf("Blood Type",member.bloodType)}
    ${rf("Email",member.email)}${rf("Phone",member.phone||"—")}${rf("Address",member.address||"—")}
  </div></div>
  <div class="psec"><p class="pst">National ID & Passport / الهوية والجواز</p><div class="pg3">
    ${rf("National ID",member.nationalId)}${rf("ID Issue",fmtDate(member.idIssue))}${rf("ID Expiry",fmtDate(member.idExpiry))}
    ${rf("Passport",member.passport)}${rf("Passport Issue",fmtDate(member.passportIssue))}${rf("Passport Expiry",fmtDate(member.passportExpiry))}
  </div></div>
  <div class="psec"><p class="pst">Banking / البنك</p><div class="pg3">
    ${rf("Bank",member.bankName)}${rf("IBAN",member.iban)}${rf("SWIFT",member.swift)}
  </div></div>
  <div class="psec"><p class="pst">Documents / المستندات</p>
    <table class="ptbl"><thead><tr><th>Document</th><th>المستند</th><th>Status</th></tr></thead><tbody>${docrows}</tbody></table>
  </div>
  <div class="psec"><p class="pst">Violations / المخالفات (${viols.length})</p>
    <table class="ptbl"><thead><tr><th>Date</th><th>Type</th><th>Punishment</th><th>Camp</th><th>Description</th><th>Signature</th></tr></thead><tbody>${vrows}</tbody></table>
  </div>
  <div class="psec"><p class="pst">Achievements / الإنجازات (${achvs.length})</p>
    <table class="ptbl"><thead><tr><th>Tournament</th><th>Type</th><th>Location</th><th>Period</th><th>Rank</th><th>Results</th><th>Medals</th></tr></thead><tbody>${arows}</tbody></table>
  </div>
  <div class="psec"><p class="pst">Injuries / الإصابات (${(member.injuries||[]).length})</p>
    <table class="ptbl"><thead><tr><th>Date</th><th>Injury Type</th><th>Details</th><th>Status</th></tr></thead><tbody>${injrows}</tbody></table>
  </div>
  <div class="pft">Team Management System &nbsp;·&nbsp; Full Member Record &nbsp;·&nbsp; ${new Date().toLocaleString("en-GB")}</div>
</div>`;
}

function violPrint(viols,members,camp){
  const fl=camp?viols.filter(v=>v.campName===camp):viols;
  const rows=fl.map(v=>{
    const m=members.find(x=>String(x.id)===String(v.memberId));
    const av=m?.files?.photo?.url?`<img class="vpa" src="${m.files.photo.url}"/>`:`<div class="vpa-ph">${(m?.fullName||"?").split(" ").slice(0,2).map(n=>n[0]).join("").toUpperCase()}</div>`;
    return `<tr>
      <td><div class="vpr">${av}<div><strong style="font-size:12px">${m?.fullName||"Unknown"}</strong><br/><span style="font-size:10px;color:#888">${m?.role||""}</span></div></div></td>
      <td>${fmtDate(v.date)}</td>
      <td><span class="pvb">${v.violationType||"—"}</span></td>
      <td><span style="background:#FAEEDA;color:#854F0B;padding:2px 7px;border-radius:10px;font-size:10px">${v.punishmentType||"—"}</span></td>
      <td>${v.campName||"—"}</td>
      <td style="font-size:10px;color:#555;max-width:160px">${v.description||"—"}</td>
      <td>${v.signature?`<img class="psig" src="${v.signature}"/>`:"—"}</td>
    </tr>`;
  }).join("")||`<tr><td colspan="7" style="text-align:center;color:#bbb;padding:18px">No violations</td></tr>`;
  return `<div class="pp"><div class="vrph">
    <p class="vrpt">Violations Report / تقرير المخالفات</p>
    <p class="vrps">${camp?"Camp: "+camp+" · ":""}Total: ${fl.length} violations · Generated ${new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})}</p>
  </div><div style="padding:18px 26px">
    <table class="ptbl"><thead><tr><th>Player</th><th>Date</th><th>Violation</th><th>Punishment</th><th>Camp</th><th>Description</th><th>Signature</th></tr></thead><tbody>${rows}</tbody></table>
  </div><div class="pft">Team Management System · Violations Report · ${new Date().toLocaleString("en-GB")}</div></div>`;
}

function achvPrint(achvs,members,from,to){
  let fl=achvs;
  if(from)fl=fl.filter(a=>a.startDate>=from);
  if(to)fl=fl.filter(a=>a.startDate<=to);
  const cards=fl.map(a=>{
    const m=members.find(x=>String(x.id)===String(a.memberId));
    const av=m?.files?.photo?.url?`<img style="width:42px;height:42px;border-radius:50%;object-fit:cover;border:2px solid #e0e0e0" src="${m.files.photo.url}"/>`:`<div style="width:42px;height:42px;border-radius:50%;background:#EAF3DE;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#3B6D11">${(m?.fullName||"?").split(" ").slice(0,2).map(n=>n[0]).join("").toUpperCase()}</div>`;
    const medals=[a.goldMedals&&a.goldMedals!="0"?"🥇 Gold: "+a.goldMedals:"",a.silverMedals&&a.silverMedals!="0"?"🥈 Silver: "+a.silverMedals:"",a.bronzeMedals&&a.bronzeMedals!="0"?"🥉 Bronze: "+a.bronzeMedals:""].filter(Boolean).join("  ");
    return `<div class="arp-card">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
        ${av}
        <div style="flex:1"><p style="margin:0;font-size:14px;font-weight:700">${a.tournamentName||"—"}</p>
          <p style="margin:2px 0 0;font-size:10px;color:#888">${m?.fullName||"?"} · ${a.location||"—"} · ${fmtDate(a.startDate)}${a.endDate?" → "+fmtDate(a.endDate):""}</p></div>
        <div style="text-align:right">
          <span style="background:#E6F1FB;color:#185FA5;padding:2px 9px;border-radius:10px;font-size:10px">${a.tournamentType||"—"}</span>
          ${a.overallRank?`<br/><span style="background:#EAF3DE;color:#3B6D11;padding:2px 9px;border-radius:10px;font-size:11px;font-weight:700;margin-top:4px;display:inline-block">🏆 ${a.overallRank}</span>`:""}
        </div>
      </div>
      <table class="ptbl" style="margin:0">
        <thead><tr><th>Snatch / الخطف</th><th>Clean & Jerk / النتر</th><th>Total / المجموع</th><th>Best Snatch</th><th>Best C&J</th><th>Best Total</th></tr></thead>
        <tbody><tr>
          <td style="font-weight:700;color:#185FA5">${a.snatchResult||"—"}${a.snatchResult?" kg":""}</td>
          <td style="font-weight:700;color:#534AB7">${a.cleanResult||"—"}${a.cleanResult?" kg":""}</td>
          <td style="font-weight:700;font-size:13px">${a.totalResult||"—"}${a.totalResult?" kg":""}</td>
          <td style="color:#BA7517">${a.bestSnatch||"—"}${a.bestSnatch?" kg":""}</td>
          <td style="color:#888780">${a.bestClean||"—"}${a.bestClean?" kg":""}</td>
          <td style="color:#0F6E56;font-weight:700">${a.bestTotal||"—"}${a.bestTotal?" kg":""}</td>
        </tr></tbody>
      </table>
      ${medals?`<p style="margin:8px 0 0;font-size:11px;color:#555">${medals}</p>`:""}
    </div>`;
  }).join("")||`<p style="text-align:center;color:#bbb;padding:24px">No achievements in this period</p>`;
  return `<div class="pp"><div class="arph">
    <p class="vrpt">Achievements Report / تقرير الإنجازات</p>
    <p class="vrps">${from||to?`Period: ${from?fmtDate(from):"—"} → ${to?fmtDate(to):"—"} · `:""}Total: ${fl.length} achievements · Generated ${new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})}</p>
  </div><div style="padding:18px 26px">${cards}</div>
  <div class="pft">Team Management System · Achievements Report · ${new Date().toLocaleString("en-GB")}</div></div>`;
}

// ═══════════════════════════════════════════════════════════════
//  REGISTRATION FORM
// ═══════════════════════════════════════════════════════════════
const initSocial=()=>Object.fromEntries(SOCIAL_PLATFORMS.map(p=>[p.id,{active:false,handle:""}]));
const initReg=()=>({
  fullName:"",fullNameAr:"",nationalId:"",idIssue:"",idExpiry:"",
  passport:"",passportIssue:"",passportExpiry:"",
  bloodType:"",address:"",iban:"",bankName:"",bankNameCustom:"",swift:"",
  role:"",roleDescription:"",squad:"",email:"",phone:"",
  weightCategory:"",athleteType:"",athleteGrade:"",
  social:initSocial(),
});

function RegistrationForm({onSuccess}){
  const[step,setStep]=useState(1);
  const[form,setForm]=useState(initReg());
  const[files,setFiles]=useState({});
  const[errors,setErrors]=useState({});
  const[submitting,setSubmitting]=useState(false);
  const set=(k,v)=>{setForm(f=>({...f,[k]:v}));setErrors(e=>({...e,[k]:""}));};
  const setSoc=(pid,field,val)=>setForm(f=>({...f,social:{...f.social,[pid]:{...f.social[pid],[field]:val}}}));

  const v1=()=>{
    const e={};
    if(!form.role)e.role="Select role";if(!form.squad)e.squad="Select squad";
    if(!form.fullName.trim())e.fullName="Required";if(!form.fullNameAr.trim())e.fullNameAr="Required";
    if(!form.email.trim())e.email="Required";if(!form.nationalId.trim())e.nationalId="Required";
    if(!form.idIssue)e.idIssue="Required";if(!form.idExpiry)e.idExpiry="Required";
    if(!form.bloodType)e.bloodType="Required";
    if(form.role==="Athlete"&&!form.weightCategory)e.weightCategory="Required for athletes";
    if(form.role==="Team"&&!form.roleDescription.trim())e.roleDescription="Required";
    return e;
  };
  const v2=()=>{
    const e={};
    if(!form.passport.trim())e.passport="Required";if(!form.passportIssue)e.passportIssue="Required";
    if(!form.passportExpiry)e.passportExpiry="Required";if(!form.address.trim())e.address="Required";
    if(!form.iban.trim())e.iban="Required";if(!form.bankName)e.bankName="Required";
    if(form.bankName==="Other (اكتب يدوياً)"&&!form.bankNameCustom.trim())e.bankNameCustom="Required";
    if(!form.swift.trim())e.swift="Required";return e;
  };
  const v3=()=>{const e={};ATTACHMENTS.filter(a=>a.required).forEach(a=>{if(!files[a.key])e[a.key]="Required";});return e;};

  const next=()=>{
    const e=step===1?v1():step===2?v2():step===3?v3():{};
    if(Object.keys(e).length){setErrors(e);return;}setStep(s=>s+1);
  };
  const submit=()=>{
    const e=v3();if(Object.keys(e).length){setErrors(e);return;}
    setSubmitting(true);
    setTimeout(()=>{
      const bank=form.bankName==="Other (اكتب يدوياً)"?form.bankNameCustom:form.bankName;
      onSuccess({...form,bankName:bank,files,id:Date.now(),registeredAt:new Date().toISOString(),
        violations:[],achievements:[],injuries:[],customFiles:[]});
    },1000);
  };

  const steps=[{en:"Identity",ar:"الهوية"},{en:"Passport & Banking",ar:"الجواز والبنك"},{en:"Documents",ar:"المستندات"},{en:"Review",ar:"مراجعة"}];

  return <div>
    {/* Stepper */}
    <div style={{display:"flex",marginBottom:28,position:"relative"}}>
      {steps.map((s,i)=>{
        const n=i+1,done=step>n,active=step===n;
        return <div key={s.en} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:5,position:"relative"}}>
          {i<steps.length-1&&<div style={{position:"absolute",top:13,left:"50%",right:"-50%",height:2,background:done?"#378ADD":"var(--color-border-tertiary)",zIndex:0}}/>}
          <div style={{width:26,height:26,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:600,zIndex:1,
            background:done?"#378ADD":active?"#042C53":"var(--color-background-secondary)",
            color:(done||active)?"#fff":"var(--color-text-secondary)",border:active?"2px solid #378ADD":"none"}}>
            {done?<i className="ti ti-check" style={{fontSize:12}}/>:n}
          </div>
          <span style={{fontSize:10,color:active?"var(--color-text-primary)":"var(--color-text-tertiary)",fontWeight:active?500:400,textAlign:"center"}}>{s.en}<br/><span style={{fontSize:9}}>{s.ar}</span></span>
        </div>;
      })}
    </div>

    {/* STEP 1 */}
    {step===1&&<div style={{display:"grid",gap:16}}>

      {/* ── Section card: Role & Gender ── */}
      <div style={{border:"1px solid #D4E6F7",borderRadius:12,padding:"16px 18px",background:"rgba(230,241,251,0.18)"}}>
        <p style={{margin:"0 0 12px",fontSize:11,fontWeight:700,color:"#185FA5",textTransform:"uppercase",letterSpacing:1.2,display:"flex",alignItems:"center",gap:6}}>
          <i className="ti ti-id-badge-2" style={{fontSize:13}}/>Role & Classification <span style={{fontWeight:400,opacity:.65}}>/ الدور والتصنيف</span>
        </p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div>
            <FL en="Role" ar="الدور" required/>
            <select value={form.role} onChange={e=>set("role",e.target.value)} style={sS(errors.role)}>
              <option value="">Select role / اختر</option>
              {ROLES.map(r=><option key={r.id} value={r.id}>{r.en} / {r.ar}</option>)}
            </select><Err msg={errors.role}/>
          </div>
          <div>
            <FL en="Gender" ar="الجنس" required/>
            <select value={form.squad} onChange={e=>set("squad",e.target.value)} style={sS(errors.squad)}>
              <option value="">Select gender / اختر</option>
              {GENDERS.map(g=><option key={g}>{g}</option>)}
            </select><Err msg={errors.squad}/>
          </div>
        </div>

        {form.role==="Team"&&<div style={{marginTop:12}}>
          <FL en="Job title / description" ar="المسمى الوظيفي" required/>
          <textarea value={form.roleDescription} onChange={e=>set("roleDescription",e.target.value)} rows={3}
            style={{...iS(errors.roleDescription),resize:"vertical"}}/><Err msg={errors.roleDescription}/>
        </div>}

        {form.role==="Athlete"&&<>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:12}}>
            <div>
              <FL en="Athlete type" ar="نوع اللاعب" required/>
              <select value={form.athleteType} onChange={e=>set("athleteType",e.target.value)} style={sS(false)}>
                <option value="">Select...</option>
                <option value="National Team">National Team / منتخب وطني</option>
                <option value="SOTC">SOTC</option>
              </select>
            </div>
            {form.athleteType==="SOTC"&&<div>
              <FL en="Grade" ar="الدرجة"/>
              <select value={form.athleteGrade} onChange={e=>set("athleteGrade",e.target.value)} style={sS(false)}>
                <option value="">Select grade...</option>
                {["Grade A","Grade B","Grade C","Grade D"].map(g=><option key={g}>{g}</option>)}
              </select>
            </div>}
          </div>
          <div style={{marginTop:12}}>
            <FL en="Weight category" ar="الفئة الوزنية" required/>
            <div style={{display:"flex",gap:7,flexWrap:"wrap",marginTop:4}}>
              {WEIGHT_CATS.map(w=><button key={w} onClick={()=>set("weightCategory",w)} style={{
                padding:"5px 12px",borderRadius:20,fontSize:12,fontWeight:500,cursor:"pointer",border:"1px solid",fontFamily:"inherit",
                background:form.weightCategory===w?"#042C53":"rgba(255,255,255,0.55)",
                color:form.weightCategory===w?"#fff":"var(--color-text-secondary)",
                borderColor:form.weightCategory===w?"#042C53":"var(--color-border-secondary)"}}>{w}</button>)}
            </div><Err msg={errors.weightCategory}/>
          </div>
        </>}
      </div>

      {/* ── Section card: Personal Info ── */}
      <div style={{border:"1px solid #D4DFF7",borderRadius:12,padding:"16px 18px",background:"rgba(238,237,254,0.15)"}}>
        <p style={{margin:"0 0 12px",fontSize:11,fontWeight:700,color:"#534AB7",textTransform:"uppercase",letterSpacing:1.2,display:"flex",alignItems:"center",gap:6}}>
          <i className="ti ti-user" style={{fontSize:13}}/>Personal Information <span style={{fontWeight:400,opacity:.65}}>/ المعلومات الشخصية</span>
        </p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
          <div>
            <FL en="Full name (English)" ar="الاسم بالإنجليزية" required/>
            <input type="text" value={form.fullName} onChange={e=>set("fullName",e.target.value)} style={iS(errors.fullName)}/><Err msg={errors.fullName}/>
          </div>
          <div>
            <FL en="Full name (Arabic)" ar="الاسم بالعربية" required/>
            <input type="text" value={form.fullNameAr} onChange={e=>set("fullNameAr",e.target.value)} style={{...iS(errors.fullNameAr),direction:"rtl"}}/><Err msg={errors.fullNameAr}/>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div><FL en="Email" ar="البريد" required/><input type="email" value={form.email} onChange={e=>set("email",e.target.value)} style={iS(errors.email)}/><Err msg={errors.email}/></div>
          <div><FL en="Phone" ar="الجوال"/><input type="tel" value={form.phone} onChange={e=>set("phone",e.target.value)} style={iS(false)}/></div>
        </div>
      </div>

      {/* ── Section card: National ID ── */}
      <div style={{border:"1px solid #F5D4D4",borderRadius:12,padding:"16px 18px",background:"rgba(252,235,235,0.18)"}}>
        <p style={{margin:"0 0 12px",fontSize:11,fontWeight:700,color:"#A32D2D",textTransform:"uppercase",letterSpacing:1.2,display:"flex",alignItems:"center",gap:6}}>
          <i className="ti ti-id-badge" style={{fontSize:13}}/>National ID / الهوية الوطنية
        </p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:12}}>
          <div><FL en="ID number" ar="رقم الهوية" required/><input type="text" value={form.nationalId} onChange={e=>set("nationalId",e.target.value)} style={iS(errors.nationalId)}/><Err msg={errors.nationalId}/></div>
          <div><FL en="Issue date" ar="تاريخ الإصدار" required/><input type="date" value={form.idIssue} onChange={e=>set("idIssue",e.target.value)} style={iS(errors.idIssue)}/><Err msg={errors.idIssue}/></div>
          <div><FL en="Expiry date" ar="تاريخ الانتهاء" required/><input type="date" value={form.idExpiry} onChange={e=>set("idExpiry",e.target.value)} style={iS(errors.idExpiry)}/><Err msg={errors.idExpiry}/></div>
        </div>
        <div>
          <FL en="Blood type" ar="فصيلة الدم" required/>
          <div style={{display:"flex",gap:7,flexWrap:"wrap",marginTop:4}}>
            {BLOOD_TYPES.map(bt=><button key={bt} onClick={()=>set("bloodType",bt)} style={{
              padding:"5px 12px",borderRadius:20,fontSize:12,fontWeight:500,cursor:"pointer",border:"1px solid",fontFamily:"inherit",
              background:form.bloodType===bt?"#042C53":"rgba(255,255,255,0.55)",
              color:form.bloodType===bt?"#fff":"var(--color-text-secondary)",
              borderColor:form.bloodType===bt?"#042C53":"var(--color-border-secondary)"}}>{bt}</button>)}
          </div><Err msg={errors.bloodType}/>
        </div>
      </div>

      {/* ── Section card: Social Media ── */}
      <div style={{border:"1px solid #D4EFE8",borderRadius:12,padding:"16px 18px",background:"rgba(225,245,238,0.18)"}}>
        <p style={{margin:"0 0 12px",fontSize:11,fontWeight:700,color:"#0F6E56",textTransform:"uppercase",letterSpacing:1.2,display:"flex",alignItems:"center",gap:6}}>
          <i className="ti ti-share" style={{fontSize:13}}/>Social Media <span style={{fontWeight:400,opacity:.65}}>/ وسائل التواصل الاجتماعي</span>
        </p>
        <div style={{display:"grid",gap:8}}>
          {SOCIAL_PLATFORMS.map(p=>{
            const sv=form.social[p.id];
            return <div key={p.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",borderRadius:9,background:"rgba(255,255,255,0.55)",border:"0.5px solid var(--color-border-tertiary)"}}>
              <i className={`ti ${p.icon}`} style={{fontSize:17,color:"var(--color-text-secondary)",width:18,flexShrink:0}}/>
              <span style={{fontSize:12,fontWeight:500,width:90,color:"var(--color-text-primary)",flexShrink:0}}>{p.label}</span>
              <div style={{display:"flex",gap:6,flexShrink:0}}>
                {[{v:true,l:"Yes / نعم"},{v:false,l:"No / لا"}].map(({v,l})=><button key={String(v)} onClick={()=>setSoc(p.id,"active",v)} style={{
                  padding:"3px 12px",borderRadius:20,fontSize:11,cursor:"pointer",border:"1px solid",fontFamily:"inherit",
                  background:sv.active===v?(v?"rgba(55,138,221,0.12)":"rgba(200,200,200,0.2)"):"transparent",
                  color:sv.active===v?(v?"#185FA5":"var(--color-text-primary)"):"var(--color-text-tertiary)",
                  borderColor:sv.active===v?(v?"#378ADD":"var(--color-border-secondary)"):"transparent"}}>{l}</button>)}
              </div>
              {sv.active&&<input type="text" value={sv.handle} onChange={e=>setSoc(p.id,"handle",e.target.value)}
                placeholder="@username" style={{flex:1,padding:"6px 10px",borderRadius:7,border:"1px solid var(--color-border-secondary)",background:"rgba(255,255,255,0.8)",fontSize:12,fontFamily:"inherit",color:"var(--color-text-primary)",outline:"none"}}/>}
            </div>;
          })}
        </div>
      </div>
    </div>}

    {/* STEP 2 */}
    {step===2&&<div style={{display:"grid",gap:16}}>

      {/* ── Section card: Passport ── */}
      <div style={{border:"1px solid #D4DFF7",borderRadius:12,padding:"16px 18px",background:"rgba(238,237,254,0.15)"}}>
        <p style={{margin:"0 0 12px",fontSize:11,fontWeight:700,color:"#534AB7",textTransform:"uppercase",letterSpacing:1.2,display:"flex",alignItems:"center",gap:6}}>
          <i className="ti ti-world" style={{fontSize:13}}/>Passport / جواز السفر
        </p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
          <div><FL en="Passport number" ar="رقم الجواز" required/><input type="text" value={form.passport} onChange={e=>set("passport",e.target.value)} style={iS(errors.passport)}/><Err msg={errors.passport}/></div>
          <div><FL en="Issue date" ar="تاريخ الإصدار" required/><input type="date" value={form.passportIssue} onChange={e=>set("passportIssue",e.target.value)} style={iS(errors.passportIssue)}/><Err msg={errors.passportIssue}/></div>
          <div><FL en="Expiry date" ar="تاريخ الانتهاء" required/><input type="date" value={form.passportExpiry} onChange={e=>set("passportExpiry",e.target.value)} style={iS(errors.passportExpiry)}/><Err msg={errors.passportExpiry}/></div>
        </div>
      </div>

      {/* ── Section card: Address ── */}
      <div style={{border:"1px solid #D4EFE8",borderRadius:12,padding:"16px 18px",background:"rgba(225,245,238,0.15)"}}>
        <p style={{margin:"0 0 12px",fontSize:11,fontWeight:700,color:"#0F6E56",textTransform:"uppercase",letterSpacing:1.2,display:"flex",alignItems:"center",gap:6}}>
          <i className="ti ti-map-pin" style={{fontSize:13}}/>National Address / العنوان الوطني
        </p>
        <div><FL en="National address" ar="العنوان الوطني" required/><textarea value={form.address} onChange={e=>set("address",e.target.value)} rows={3} style={{...iS(errors.address),resize:"vertical"}}/><Err msg={errors.address}/></div>
      </div>

      {/* ── Section card: Banking ── */}
      <div style={{border:"1px solid #F5E8D4",borderRadius:12,padding:"16px 18px",background:"rgba(250,238,218,0.18)"}}>
        <p style={{margin:"0 0 12px",fontSize:11,fontWeight:700,color:"#854F0B",textTransform:"uppercase",letterSpacing:1.2,display:"flex",alignItems:"center",gap:6}}>
          <i className="ti ti-building-bank" style={{fontSize:13}}/>Banking Information / البيانات البنكية
        </p>
        <div style={{display:"grid",gap:12}}>
          <div><FL en="IBAN" ar="رقم الآيبان" required/><input type="text" value={form.iban} onChange={e=>set("iban",e.target.value)} style={iS(errors.iban)}/><Err msg={errors.iban}/></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div>
              <FL en="Bank name" ar="اسم البنك" required/>
              <select value={form.bankName} onChange={e=>set("bankName",e.target.value)} style={sS(errors.bankName)}>
                <option value="">Select bank / اختر البنك</option>
                {SA_BANKS.map(b=><option key={b} value={b}>{b}</option>)}
              </select><Err msg={errors.bankName}/>
            </div>
            <div><FL en="SWIFT code" ar="رمز السويفت" required/><input type="text" value={form.swift} onChange={e=>set("swift",e.target.value)} style={iS(errors.swift)}/><Err msg={errors.swift}/></div>
          </div>
          {form.bankName==="Other (اكتب يدوياً)"&&<div><FL en="Bank name (manual)" ar="اسم البنك يدوياً" required/><input type="text" value={form.bankNameCustom} onChange={e=>set("bankNameCustom",e.target.value)} style={iS(errors.bankNameCustom)}/><Err msg={errors.bankNameCustom}/></div>}
        </div>
      </div>
    </div>}

    {/* STEP 3 */}
    {step===3&&<div style={{display:"grid",gap:11}}>
      <p style={{margin:"0 0 4px",fontSize:13,color:"var(--color-text-secondary)"}}>Upload clear files / ارفع مستندات واضحة</p>
      {ATTACHMENTS.map(att=><div key={att.key}>
        <FileUploadZone attachment={att} value={files[att.key]} onChange={v=>{setFiles(f=>({...f,[att.key]:v}));setErrors(e=>({...e,[att.key]:""}));}}/>
        <Err msg={errors[att.key]}/>
      </div>)}
    </div>}

    {/* STEP 4 */}
    {step===4&&<div>
      <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:18,padding:16,background:"rgba(255,255,255,0.5)",borderRadius:12,border:"0.5px solid var(--color-border-tertiary)"}}>
        <Avatar name={form.fullName} role={form.role} photoUrl={files.photo?.url} size={64}/>
        <div>
          <p style={{margin:0,fontSize:17,fontWeight:700,color:"var(--color-text-primary)"}}>{form.fullName||"—"}</p>
          <p style={{margin:"1px 0 5px",fontSize:13,color:"var(--color-text-secondary)",direction:"rtl"}}>{form.fullNameAr||"—"}</p>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {form.role&&<Badge style={{background:ROLE_COLORS[form.role]?.bg,color:ROLE_COLORS[form.role]?.text}}>{form.role}</Badge>}
            {form.squad&&<Badge style={{background:GENDER_COLORS[form.squad]?.bg,color:GENDER_COLORS[form.squad]?.text}}>{form.squad}</Badge>}
            {form.bloodType&&<Badge style={{background:"#FCEBEB",color:"#A32D2D"}}>🩸 {form.bloodType}</Badge>}
            {form.weightCategory&&<Badge style={{background:"#FAEEDA",color:"#854F0B"}}>⚖️ {form.weightCategory}</Badge>}
          </div>
        </div>
      </div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        {ATTACHMENTS.map(att=><Badge key={att.key} style={{background:files[att.key]?"#EAF3DE":"#FCEBEB",color:files[att.key]?"#3B6D11":"#A32D2D"}}>
          <i className={`ti ${files[att.key]?"ti-circle-check":"ti-circle-x"}`} style={{fontSize:11}}/>{att.label}
        </Badge>)}
      </div>
    </div>}

    <div style={{display:"flex",justifyContent:"space-between",marginTop:24,paddingTop:16,borderTop:"0.5px solid var(--color-border-tertiary)"}}>
      {step>1?<button onClick={()=>setStep(s=>s-1)} style={{padding:"9px 20px",borderRadius:8,border:"1px solid var(--color-border-secondary)",background:"transparent",cursor:"pointer",fontSize:13,color:"var(--color-text-primary)",fontFamily:"inherit"}}>
        <i className="ti ti-arrow-left" style={{fontSize:13,marginRight:5}}/>Back
      </button>:<div/>}
      {step<4?<button onClick={next} style={{padding:"9px 24px",borderRadius:8,border:"none",background:"#042C53",cursor:"pointer",fontSize:13,fontWeight:500,color:"#fff",fontFamily:"inherit"}}>
        Continue <i className="ti ti-arrow-right" style={{fontSize:13}}/>
      </button>:<button onClick={submit} disabled={submitting} style={{padding:"9px 24px",borderRadius:8,border:"none",background:submitting?"#9FE1CB":"#0F6E56",cursor:submitting?"default":"pointer",fontSize:13,fontWeight:500,color:"#fff",fontFamily:"inherit"}}>
        {submitting?"Registering…":<><i className="ti ti-check" style={{fontSize:13,marginRight:5}}/>Complete Registration</>}
      </button>}
    </div>
  </div>;
}

// ═══════════════════════════════════════════════════════════════
//  VIOLATION FORM
// ═══════════════════════════════════════════════════════════════
function ViolationForm({members,onSuccess}){
  const init={memberId:"",violationType:"",punishmentType:"",date:"",description:"",witness:"",fineAmount:"",suspensionValue:"",notes:"",campName:"",signature:null,attachFile:null};
  const[form,setForm]=useState(init);
  const[errors,setErrors]=useState({});
  const[sub,setSub]=useState(false);
  const set=(k,v)=>{setForm(f=>({...f,[k]:v}));setErrors(e=>({...e,[k]:""}));};
  const validate=()=>{
    const e={};
    if(!form.memberId)e.memberId="Select member";if(!form.violationType)e.violationType="Required";
    if(!form.punishmentType)e.punishmentType="Required";if(!form.date)e.date="Required";
    if(!form.description.trim())e.description="Required";return e;
  };
  const submit=()=>{
    const e=validate();if(Object.keys(e).length){setErrors(e);return;}
    setSub(true);setTimeout(()=>{onSuccess({...form,id:Date.now(),recordedAt:new Date().toISOString()});setSub(false);setForm(init);},800);
  };
  return <div style={{display:"grid",gap:13}}>
    <div>
      <FL en="Member" ar="العضو" required/>
      <select value={form.memberId} onChange={e=>set("memberId",e.target.value)} style={sS(errors.memberId)}>
        <option value="">Select member...</option>
        {members.map(m=><option key={m.id} value={m.id}>{m.fullName} — {m.role}</option>)}
      </select><Err msg={errors.memberId}/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
      <div>
        <FL en="Violation type" ar="نوع المخالفة" required/>
        <select value={form.violationType} onChange={e=>set("violationType",e.target.value)} style={sS(errors.violationType)}>
          <option value="">Select...</option>
          {VIOLATION_TYPES.map(v=><option key={v.en} value={v.en}>{v.en} / {v.ar}</option>)}
        </select><Err msg={errors.violationType}/>
      </div>
      <div>
        <FL en="Punishment" ar="العقوبة" required/>
        <select value={form.punishmentType} onChange={e=>set("punishmentType",e.target.value)} style={sS(errors.punishmentType)}>
          <option value="">Select...</option>
          {PUNISHMENT_TYPES.map(p=><option key={p.en} value={p.en}>{p.en} / {p.ar}</option>)}
        </select><Err msg={errors.punishmentType}/>
      </div>
    </div>
    {form.punishmentType==="Fine"&&<div><FL en="Fine amount (SAR)" ar="مبلغ الغرامة"/><input type="number" value={form.fineAmount} onChange={e=>set("fineAmount",e.target.value)} style={iS(false)}/></div>}
    {(form.punishmentType==="Suspension (games)"||form.punishmentType==="Suspension (period)")&&<div>
      <FL en={form.punishmentType==="Suspension (games)"?"Number of games":"Duration (days)"} ar="القيمة"/>
      <input type="number" value={form.suspensionValue} onChange={e=>set("suspensionValue",e.target.value)} style={iS(false)}/>
    </div>}
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
      <div><FL en="Date" ar="التاريخ" required/><input type="date" value={form.date} onChange={e=>set("date",e.target.value)} style={iS(errors.date)}/><Err msg={errors.date}/></div>
      <div><FL en="Camp name" ar="اسم المعسكر"/><input type="text" value={form.campName} onChange={e=>set("campName",e.target.value)} placeholder="e.g. Winter Camp 2025" style={iS(false)}/></div>
    </div>
    <div><FL en="Witness" ar="الشاهد"/><input type="text" value={form.witness} onChange={e=>set("witness",e.target.value)} style={iS(false)}/></div>
    <div><FL en="Description" ar="وصف المخالفة" required/><textarea value={form.description} onChange={e=>set("description",e.target.value)} rows={3} style={{...iS(errors.description),resize:"vertical"}}/><Err msg={errors.description}/></div>
    <div><FL en="Notes" ar="ملاحظات"/><textarea value={form.notes} onChange={e=>set("notes",e.target.value)} rows={2} style={{...iS(false),resize:"vertical"}}/></div>
    <SimpleUpload label="Attach file / إرفاق ملف" labelAr="مرفق" icon="ti-paperclip" value={form.attachFile} onChange={v=>set("attachFile",v)}/>
    <div style={{borderTop:"0.5px solid var(--color-border-tertiary)",paddingTop:14}}>
      <SignaturePad value={form.signature} onChange={v=>set("signature",v)}/>
    </div>
    <div style={{display:"flex",justifyContent:"flex-end"}}>
      <button onClick={submit} disabled={sub} style={{padding:"10px 26px",borderRadius:10,border:"none",background:sub?"#9FE1CB":"#A32D2D",cursor:sub?"default":"pointer",fontSize:13,fontWeight:600,color:"#fff",fontFamily:"inherit"}}>
        {sub?"Recording…":<><i className="ti ti-alert-triangle" style={{fontSize:13,marginRight:6}}/>Record Violation / تسجيل المخالفة</>}
      </button>
    </div>
  </div>;
}

// ═══════════════════════════════════════════════════════════════
//  ACHIEVEMENT FORM
// ═══════════════════════════════════════════════════════════════
function AchievementForm({members,onSuccess}){
  const init={memberId:"",tournamentName:"",tournamentType:"",location:"",startDate:"",endDate:"",overallRank:"",
    snatchResult:"",snatchGold:"",snatchSilver:"",snatchBronze:"",snatchOther:"",
    cleanResult:"",cleanGold:"",cleanSilver:"",cleanBronze:"",cleanOther:"",
    totalResult:"",goldMedals:"",silverMedals:"",bronzeMedals:"",otherMedals:"",
    bestSnatch:"",bestClean:"",bestTotal:"",notes:"",proofFile:null,photoFile:null};
  const[form,setForm]=useState(init);
  const[errors,setErrors]=useState({});
  const[sub,setSub]=useState(false);
  const set=(k,v)=>{setForm(f=>({...f,[k]:v}));setErrors(e=>({...e,[k]:""}));};
  const validate=()=>{
    const e={};
    if(!form.memberId)e.memberId="Select member";if(!form.tournamentName.trim())e.tournamentName="Required";
    if(!form.tournamentType)e.tournamentType="Required";if(!form.location.trim())e.location="Required";
    if(!form.startDate)e.startDate="Required";return e;
  };
  const submit=()=>{
    const e=validate();if(Object.keys(e).length){setErrors(e);return;}
    setSub(true);setTimeout(()=>{onSuccess({...form,id:Date.now(),recordedAt:new Date().toISOString()});setSub(false);setForm(init);},800);
  };

  const MRow=({label,ar,rk,gk,sk,bk,ok})=>(
    <div style={{padding:"11px 13px",background:"rgba(255,255,255,0.5)",borderRadius:9,border:"0.5px solid var(--color-border-tertiary)"}}>
      <p style={{margin:"0 0 9px",fontSize:12,fontWeight:600,color:"var(--color-text-secondary)"}}>{label} <span style={{fontSize:10,color:"var(--color-text-tertiary)"}}>/ {ar}</span></p>
      <div style={{display:"grid",gridTemplateColumns:"1.3fr 1fr 1fr 1fr 1fr",gap:8}}>
        <div><FL en="Result (kg)" ar="النتيجة"/><input type="text" value={form[rk]} onChange={e=>set(rk,e.target.value)} placeholder="e.g. 145" style={{...iS(false),fontSize:13}}/></div>
        {[{k:gk,l:"🥇 Gold",c:"#BA7517"},{k:sk,l:"🥈 Silver",c:"#888780"},{k:bk,l:"🥉 Bronze",c:"#854F0B"},{k:ok,l:"Other",c:"#444441"}].map(({k,l,c})=>(
          <div key={k}><FL en={l} ar=""/><input type="number" min="0" value={form[k]} onChange={e=>set(k,e.target.value)} placeholder="0" style={{...iS(false),fontSize:13,color:c,fontWeight:600}}/></div>
        ))}
      </div>
    </div>
  );

  return <div style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:16,padding:"20px 22px"}}>
    <div style={{display:"grid",gap:13}}>
      <div>
        <FL en="Member" ar="العضو" required/>
        <select value={form.memberId} onChange={e=>set("memberId",e.target.value)} style={sS(errors.memberId)}>
          <option value="">Select member...</option>
          {members.map(m=><option key={m.id} value={m.id}>{m.fullName} — {m.role}</option>)}
        </select><Err msg={errors.memberId}/>
      </div>
      <div style={{borderTop:"0.5px solid var(--color-border-tertiary)",paddingTop:12}}>
        <ST en="Tournament Information" ar="معلومات البطولة"/>
        <div style={{display:"grid",gap:11}}>
          <div><FL en="Tournament name" ar="اسم البطولة" required/><input type="text" value={form.tournamentName} onChange={e=>set("tournamentName",e.target.value)} style={iS(errors.tournamentName)}/><Err msg={errors.tournamentName}/></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div>
              <FL en="Tournament type" ar="نوع البطولة" required/>
              <select value={form.tournamentType} onChange={e=>set("tournamentType",e.target.value)} style={sS(errors.tournamentType)}>
                <option value="">Select...</option>
                {TOURNAMENT_TYPES.map(t=><option key={t.en} value={t.en}>{t.en} / {t.ar}</option>)}
              </select><Err msg={errors.tournamentType}/>
            </div>
            <div><FL en="Location" ar="المكان" required/><input type="text" value={form.location} onChange={e=>set("location",e.target.value)} placeholder="City, Country" style={iS(errors.location)}/><Err msg={errors.location}/></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
            <div><FL en="Start date" ar="تاريخ البدء" required/><input type="date" value={form.startDate} onChange={e=>set("startDate",e.target.value)} style={iS(errors.startDate)}/><Err msg={errors.startDate}/></div>
            <div><FL en="End date" ar="تاريخ الانتهاء"/><input type="date" value={form.endDate} onChange={e=>set("endDate",e.target.value)} style={iS(false)}/></div>
            <div><FL en="Overall rank" ar="المركز العام"/><input type="text" value={form.overallRank} onChange={e=>set("overallRank",e.target.value)} placeholder="1st, Champion..." style={iS(false)}/></div>
          </div>
        </div>
      </div>
      <div style={{borderTop:"0.5px solid var(--color-border-tertiary)",paddingTop:12}}>
        <ST en="Results & Medals" ar="النتائج والميداليات"/>
        <div style={{display:"grid",gap:9}}>
          <MRow label="Snatch" ar="الخطف" rk="snatchResult" gk="snatchGold" sk="snatchSilver" bk="snatchBronze" ok="snatchOther"/>
          <MRow label="Clean & Jerk" ar="الكلين آند جيرك" rk="cleanResult" gk="cleanGold" sk="cleanSilver" bk="cleanBronze" ok="cleanOther"/>
          <div style={{padding:"11px 13px",background:"rgba(4,44,83,0.04)",borderRadius:9,border:"0.5px solid #B5D4F4"}}>
            <p style={{margin:"0 0 9px",fontSize:12,fontWeight:600,color:"#185FA5"}}>Total / المجموع</p>
            <div style={{display:"grid",gridTemplateColumns:"1.3fr 1fr 1fr 1fr 1fr",gap:8}}>
              <div><FL en="Total (kg)" ar="المجموع"/><input type="text" value={form.totalResult} onChange={e=>set("totalResult",e.target.value)} placeholder="e.g. 310" style={{...iS(false),fontWeight:700}}/></div>
              {[{k:"goldMedals",l:"🥇",c:"#BA7517"},{k:"silverMedals",l:"🥈",c:"#888780"},{k:"bronzeMedals",l:"🥉",c:"#854F0B"},{k:"otherMedals",l:"Other",c:"#444"}].map(({k,l,c})=>(
                <div key={k}><FL en={l} ar=""/><input type="number" min="0" value={form[k]} onChange={e=>set(k,e.target.value)} placeholder="0" style={{...iS(false),color:c,fontWeight:700}}/></div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div style={{borderTop:"0.5px solid var(--color-border-tertiary)",paddingTop:12}}>
        <ST en="Best Lifts" ar="أفضل الرفعات"/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
          <div><FL en="Best Snatch (kg)" ar="أفضل خطف"/><input type="text" value={form.bestSnatch} onChange={e=>set("bestSnatch",e.target.value)} placeholder="148" style={iS(false)}/></div>
          <div><FL en="Best C&J (kg)" ar="أفضل نتر"/><input type="text" value={form.bestClean} onChange={e=>set("bestClean",e.target.value)} placeholder="182" style={iS(false)}/></div>
          <div><FL en="Best Total (kg)" ar="أفضل مجموع"/><input type="text" value={form.bestTotal} onChange={e=>set("bestTotal",e.target.value)} placeholder="330" style={iS(false)}/></div>
        </div>
      </div>
      <div style={{borderTop:"0.5px solid var(--color-border-tertiary)",paddingTop:12}}>
        <ST en="Attachments" ar="المرفقات"/>
        <div style={{display:"grid",gap:9}}>
          <SimpleUpload label="Proof documents / أوراق الإثبات" labelAr="إثبات" icon="ti-file-certificate" value={form.proofFile} onChange={v=>set("proofFile",v)}/>
          <SimpleUpload label="Achievement photo / صورة الإنجاز" labelAr="صورة" icon="ti-camera" accept="image/*" maxMB={5} value={form.photoFile} onChange={v=>set("photoFile",v)}/>
        </div>
      </div>
      <div><FL en="Notes" ar="ملاحظات"/><textarea value={form.notes} onChange={e=>set("notes",e.target.value)} rows={2} style={{...iS(false),resize:"vertical"}}/></div>
      <div style={{display:"flex",justifyContent:"flex-end"}}>
        <button onClick={submit} disabled={sub} style={{padding:"10px 26px",borderRadius:10,border:"none",background:sub?"#9FE1CB":"#185FA5",cursor:sub?"default":"pointer",fontSize:13,fontWeight:600,color:"#fff",fontFamily:"inherit"}}>
          {sub?"Saving…":<><i className="ti ti-trophy" style={{fontSize:13,marginRight:6}}/>Record Achievement / تسجيل الإنجاز</>}
        </button>
      </div>
    </div>
  </div>;
}

// ═══════════════════════════════════════════════════════════════
//  MEMBER CARD
// ═══════════════════════════════════════════════════════════════
function MemberCard({member,mViol=[],mAchv=[],selected,onSelect,onClick}){
  const rc=ROLE_COLORS[member.role]||{};
  const sc=GENDER_COLORS[member.squad]||{};
  const docCount=ATTACHMENTS.filter(a=>member.files?.[a.key]).length;
  const expM=[monthsUntil(member.idExpiry),monthsUntil(member.passportExpiry)].filter(x=>x!==null&&x<=8&&x>=0);
  const hasExp=expM.length>0;
  const minExp=hasExp?Math.min(...expM):null;
  return <div style={{position:"relative",background:"var(--color-background-primary)",
    border:`1.5px solid ${selected?"#378ADD":hasExp?"#EF9F27":"var(--color-border-tertiary)"}`,
    borderRadius:14,padding:"14px",cursor:"pointer",transition:"all 0.15s",
    boxShadow:selected?"0 0 0 3px rgba(55,138,221,0.1)":hasExp?"0 0 0 2px rgba(239,159,39,0.12)":"none"}}
    onMouseEnter={e=>{if(!selected)e.currentTarget.style.borderColor="#B5D4F4";}}
    onMouseLeave={e=>{if(!selected)e.currentTarget.style.borderColor=hasExp?"#EF9F27":"var(--color-border-tertiary)";}}>
    {hasExp&&<div style={{position:"absolute",top:-9,left:12,background:"#EF9F27",color:"#fff",fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:10,letterSpacing:.5}}>
      ⚠ EXPIRY {minExp}mo
    </div>}
    <div style={{position:"absolute",top:10,right:10}} onClick={e=>{e.stopPropagation();onSelect(member.id);}}>
      <div style={{width:18,height:18,borderRadius:4,border:`1.5px solid ${selected?"#378ADD":"var(--color-border-secondary)"}`,
        background:selected?"#378ADD":"rgba(255,255,255,0.7)",display:"flex",alignItems:"center",justifyContent:"center"}}>
        {selected&&<i className="ti ti-check" style={{fontSize:11,color:"#fff"}}/>}
      </div>
    </div>
    <div onClick={onClick} style={{display:"flex",alignItems:"center",gap:10,marginBottom:9}}>
      <Avatar name={member.fullName} role={member.role} photoUrl={member.files?.photo?.url} size={50}/>
      <div style={{flex:1,minWidth:0,paddingRight:24}}>
        <p style={{margin:0,fontWeight:700,fontSize:13,color:"var(--color-text-primary)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{member.fullName}</p>
        <p style={{margin:"1px 0 0",fontSize:10,color:"var(--color-text-tertiary)",direction:"rtl",textAlign:"right",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{member.fullNameAr||""}</p>
      </div>
    </div>
    <div onClick={onClick}>
      <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:7}}>
        <Badge style={{background:rc.bg,color:rc.text,fontSize:10}}>{member.role}</Badge>
        <Badge style={{background:sc.bg,color:sc.text,fontSize:10}}>{member.squad}</Badge>
        {member.bloodType&&<Badge style={{background:"#FCEBEB",color:"#A32D2D",fontSize:10}}>🩸{member.bloodType}</Badge>}
        {member.weightCategory&&<Badge style={{background:"#FAEEDA",color:"#854F0B",fontSize:10}}>⚖️{member.weightCategory}</Badge>}
      </div>
      <div style={{display:"flex",gap:7,marginBottom:7}}>
        {mViol.length>0&&<Badge style={{background:"#FCEBEB",color:"#A32D2D",fontSize:10}}><i className="ti ti-alert-triangle" style={{fontSize:9}}/>{mViol.length}</Badge>}
        {mAchv.length>0&&<Badge style={{background:"#EAF3DE",color:"#3B6D11",fontSize:10}}><i className="ti ti-trophy" style={{fontSize:9}}/>{mAchv.length}</Badge>}
        {(member.injuries||[]).length>0&&<Badge style={{background:"#EEEDFE",color:"#534AB7",fontSize:10}}><i className="ti ti-heartbeat" style={{fontSize:9}}/>{(member.injuries||[]).length}</Badge>}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:7}}>
        <div style={{flex:1,height:3,borderRadius:2,background:"var(--color-background-secondary)",overflow:"hidden"}}>
          <div style={{height:"100%",width:`${(docCount/ATTACHMENTS.length)*100}%`,background:docCount===ATTACHMENTS.length?"#1D9E75":"#EF9F27",borderRadius:2}}/>
        </div>
        <span style={{fontSize:10,color:"var(--color-text-tertiary)"}}>{docCount}/{ATTACHMENTS.length}</span>
      </div>
    </div>
  </div>;
}

// ═══════════════════════════════════════════════════════════════
//  MEMBER DETAIL
// ═══════════════════════════════════════════════════════════════
function MemberDetail({member,mViol,mAchv,onBack,onUpdate}){
  const[tab,setTab]=useState("profile");
  const[previewDoc,setPreviewDoc]=useState(null);
  const[showInjForm,setShowInjForm]=useState(false);
  const[injForm,setInjForm]=useState({date:"",injuryType:"",details:"",status:"Active",attachFile:null});
  const[showFileForm,setShowFileForm]=useState(false);
  const[fileForm,setFileForm]=useState({label:"",file:null});

  const addInjury=()=>{
    if(!injForm.date||!injForm.injuryType)return;
    onUpdate({...member,injuries:[...(member.injuries||[]),{...injForm,id:Date.now()}]});
    setInjForm({date:"",injuryType:"",details:"",status:"Active",attachFile:null});setShowInjForm(false);
  };
  const addFile=()=>{
    if(!fileForm.label.trim()||!fileForm.file)return;
    onUpdate({...member,customFiles:[...(member.customFiles||[]),{...fileForm,id:Date.now()}]});
    setFileForm({label:"",file:null});setShowFileForm(false);
  };

  const expAlert=(d,lbl)=>{
    const m=monthsUntil(d);
    if(m===null||m>8)return null;
    const crit=m<=2;
    return <div style={{display:"flex",alignItems:"center",gap:8,padding:"7px 12px",background:crit?"#FCEBEB":"#FFF5E0",borderRadius:8,marginBottom:6}}>
      <i className={`ti ${crit?"ti-alert-octagon":"ti-alert-triangle"}`} style={{color:crit?"#A32D2D":"#854F0B",fontSize:14}}/>
      <span style={{fontSize:12,color:crit?"#A32D2D":"#854F0B",fontWeight:500}}>
        {lbl} expires in <strong>{m} month{m!==1?"s":""}</strong> — {fmtDate(d)}
      </span>
    </div>;
  };

  const TABS=[
    {id:"profile",en:"Profile",ar:"الملف",icon:"ti-user"},
    {id:"documents",en:"Documents",ar:"المستندات",icon:"ti-files"},
    {id:"violations",en:"Violations",ar:"المخالفات",icon:"ti-alert-triangle",count:mViol.length},
    {id:"achievements",en:"Achievements",ar:"الإنجازات",icon:"ti-trophy",count:mAchv.length},
    {id:"medical",en:"Medical",ar:"الطبي",icon:"ti-heartbeat",count:(member.injuries||[]).length},
    {id:"files",en:"Files",ar:"الملفات",icon:"ti-folder",count:(member.customFiles||[]).length},
  ];

  return <div>
    <button onClick={onBack} style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"none",cursor:"pointer",color:"var(--color-text-secondary)",fontSize:13,padding:"0 0 16px",fontFamily:"inherit"}}>
      <i className="ti ti-arrow-left" style={{fontSize:14}}/> Back to roster / العودة
    </button>

    {/* Hero header */}
    <div style={{display:"flex",alignItems:"flex-start",gap:18,marginBottom:12,padding:20,background:"linear-gradient(135deg,#042C53 0%,#0A4A80 100%)",borderRadius:16,color:"white"}}>
      <Avatar name={member.fullName} role={member.role} photoUrl={member.files?.photo?.url} size={88}/>
      <div style={{flex:1}}>
        <p style={{margin:0,fontSize:21,fontWeight:700,color:"#fff"}}>{member.fullName}</p>
        <p style={{margin:"2px 0 8px",fontSize:14,color:"rgba(255,255,255,0.65)",direction:"rtl",textAlign:"right"}}>{member.fullNameAr||""}</p>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          <Badge style={{background:"rgba(255,255,255,0.14)",color:"#fff"}}>{member.role}</Badge>
          <Badge style={{background:"rgba(255,255,255,0.14)",color:"#fff"}}>{member.squad}</Badge>
          {member.bloodType&&<Badge style={{background:"rgba(255,255,255,0.14)",color:"#fff"}}>🩸 {member.bloodType}</Badge>}
          {member.weightCategory&&<Badge style={{background:"rgba(255,255,255,0.14)",color:"#fff"}}>⚖️ {member.weightCategory}</Badge>}
          {member.athleteType&&<Badge style={{background:"rgba(255,255,255,0.14)",color:"#fff"}}>{member.athleteType}{member.athleteGrade?" · "+member.athleteGrade:""}</Badge>}
          {mViol.length>0&&<Badge style={{background:"rgba(252,91,91,0.3)",color:"#FFB3B3"}}><i className="ti ti-alert-triangle" style={{fontSize:9}}/>{mViol.length} violations</Badge>}
          {mAchv.length>0&&<Badge style={{background:"rgba(29,158,117,0.3)",color:"#7DECCC"}}><i className="ti ti-trophy" style={{fontSize:9}}/>{mAchv.length} achievements</Badge>}
        </div>
        {member.roleDescription&&<p style={{margin:"6px 0 0",fontSize:12,color:"rgba(255,255,255,0.55)",fontStyle:"italic"}}>{member.roleDescription}</p>}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:6,alignItems:"flex-end",flexShrink:0}}>
        <button onClick={()=>printHTML(memberPrint(member,mViol,mAchv))}
          style={{display:"flex",alignItems:"center",gap:5,padding:"7px 14px",borderRadius:8,background:"rgba(255,255,255,0.14)",border:"1px solid rgba(255,255,255,0.18)",cursor:"pointer",color:"#fff",fontSize:12,fontFamily:"inherit"}}>
          <i className="ti ti-printer" style={{fontSize:12}}/> Print full record
        </button>
        <p style={{margin:0,fontSize:10,color:"rgba(255,255,255,0.4)"}}>Reg. {fmtDate((member.registeredAt||"").substring(0,10))}</p>
      </div>
    </div>

    {expAlert(member.idExpiry,"National ID")}{expAlert(member.passportExpiry,"Passport")}

    {/* Tabs */}
    <div style={{display:"flex",borderBottom:"0.5px solid var(--color-border-tertiary)",marginBottom:18,marginTop:10,overflowX:"auto"}}>
      {TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{
        padding:"9px 15px",border:"none",borderBottom:`2px solid ${tab===t.id?"#042C53":"transparent"}`,
        background:"none",cursor:"pointer",fontSize:12,fontWeight:tab===t.id?600:400,
        color:tab===t.id?"var(--color-text-primary)":"var(--color-text-secondary)",
        fontFamily:"inherit",display:"flex",alignItems:"center",gap:5,whiteSpace:"nowrap"}}>
        <i className={`ti ${t.icon}`} style={{fontSize:13}}/>{t.en}
        {t.count>0&&<span style={{background:tab===t.id?"#042C53":"var(--color-background-secondary)",color:tab===t.id?"#fff":"var(--color-text-secondary)",padding:"1px 6px",borderRadius:10,fontSize:10,fontWeight:600}}>{t.count}</span>}
        <span style={{fontSize:9,opacity:.55}}>/ {t.ar}</span>
      </button>)}
    </div>

    {/* PROFILE */}
    {tab==="profile"&&<div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
        {[
          {s:"Contact",ar:"التواصل",f:[["Full Name EN","الإنجليزية",member.fullName],["Full Name AR","العربية",member.fullNameAr],["Email","البريد",member.email],["Phone","الجوال",member.phone||"—"]]},
          {s:"National ID",ar:"الهوية",f:[["Number","الرقم",member.nationalId],["Issue","الإصدار",fmtDate(member.idIssue)],["Expiry","الانتهاء",fmtDate(member.idExpiry)]]},
          {s:"Passport",ar:"الجواز",f:[["Number","الرقم",member.passport],["Issue","الإصدار",fmtDate(member.passportIssue)],["Expiry","الانتهاء",fmtDate(member.passportExpiry)]]},
          {s:"Banking",ar:"البنك",f:[["Bank","البنك",member.bankName],["IBAN","الآيبان",member.iban],["SWIFT","السويفت",member.swift]]},
        ].map(({s,ar,f})=><div key={s} style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:12,padding:"12px 14px"}}>
          <p style={{margin:"0 0 8px",fontSize:10,fontWeight:700,color:"var(--color-text-tertiary)",textTransform:"uppercase",letterSpacing:1}}>{s} / {ar}</p>
          {f.map(([l,ar2,v])=><div key={l} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"0.5px solid var(--color-border-tertiary)"}}>
            <span style={{fontSize:11,color:"var(--color-text-secondary)"}}>{l}<span style={{fontSize:9,color:"var(--color-text-tertiary)",marginLeft:3}}>/{ar2}</span></span>
            <span style={{fontSize:11,fontWeight:500,color:"var(--color-text-primary)",textAlign:"right",maxWidth:"60%",wordBreak:"break-all"}}>{v||"—"}</span>
          </div>)}
        </div>)}
      </div>

      {SOCIAL_PLATFORMS.some(p=>member.social?.[p.id]?.active)&&<div style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:12,padding:"12px 14px",marginBottom:14}}>
        <p style={{margin:"0 0 10px",fontSize:10,fontWeight:700,color:"var(--color-text-tertiary)",textTransform:"uppercase",letterSpacing:1}}>Social Media / وسائل التواصل</p>
        <div style={{display:"flex",gap:9,flexWrap:"wrap"}}>
          {SOCIAL_PLATFORMS.filter(p=>member.social?.[p.id]?.active).map(p=><div key={p.id} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 12px",background:"var(--color-background-secondary)",borderRadius:20}}>
            <i className={`ti ${p.icon}`} style={{fontSize:14,color:"var(--color-text-secondary)"}}/>
            <span style={{fontSize:12,fontWeight:500,color:"var(--color-text-primary)"}}>{p.label}:</span>
            <span style={{fontSize:12,color:"#185FA5"}}>@{member.social[p.id].handle||"—"}</span>
          </div>)}
        </div>
      </div>}

      {/* Rankings */}
      <div style={{background:"linear-gradient(135deg,#042C53,#0A4A80)",borderRadius:12,padding:"16px 18px",color:"white"}}>
        <p style={{margin:"0 0 12px",fontSize:11,fontWeight:700,letterSpacing:1,opacity:.65,textTransform:"uppercase"}}>Rankings / التصنيفات · IWF</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
          {[{l:"World Ranking",ar:"التصنيف العالمي",icon:"ti-world"},{l:"Asian Ranking",ar:"التصنيف الآسيوي",icon:"ti-map"},{l:"Arab Ranking",ar:"التصنيف العربي",icon:"ti-building-mosque"}].map(({l,ar,icon})=>(
            <div key={l} style={{background:"rgba(255,255,255,0.08)",borderRadius:10,padding:"12px",textAlign:"center"}}>
              <i className={`ti ${icon}`} style={{fontSize:20,display:"block",marginBottom:6,opacity:.7}}/>
              <p style={{margin:0,fontSize:10,opacity:.6}}>{l}</p><p style={{margin:"1px 0 0",fontSize:9,opacity:.45}}>{ar}</p>
              <p style={{margin:"8px 0 2px",fontSize:22,fontWeight:700}}>—</p>
              <p style={{margin:0,fontSize:9,opacity:.45}}>Per IWF website</p>
            </div>
          ))}
        </div>
        <p style={{margin:"10px 0 0",fontSize:10,opacity:.4,textAlign:"center"}}>Live rankings available at iwfnet.net · يُحدَّث دورياً</p>
      </div>
    </div>}

    {/* DOCUMENTS */}
    {tab==="documents"&&<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
      {ATTACHMENTS.map(att=>{
        const f=member.files?.[att.key];
        return <div key={att.key} onClick={()=>f&&setPreviewDoc(f)}
          style={{border:`0.5px solid ${f?"var(--color-border-tertiary)":"#FCEBEB"}`,borderRadius:10,padding:"12px",
            cursor:f?"pointer":"default",background:f?"var(--color-background-primary)":"rgba(252,91,91,0.03)",transition:"all 0.15s"}}
          onMouseEnter={e=>f&&(e.currentTarget.style.borderColor="#378ADD")}
          onMouseLeave={e=>e.currentTarget.style.borderColor=f?"var(--color-border-tertiary)":"#FCEBEB"}>
          <i className={`ti ${att.icon}`} style={{fontSize:22,display:"block",marginBottom:6,color:f?"#1D9E75":"#E24B4A"}}/>
          <p style={{margin:0,fontSize:12,fontWeight:500,color:"var(--color-text-primary)"}}>{att.label}</p>
          <p style={{margin:"2px 0 0",fontSize:10,color:"var(--color-text-tertiary)"}}>{att.labelAr}</p>
          <p style={{margin:"5px 0 0",fontSize:11,color:f?"#1D9E75":"#A32D2D",display:"flex",alignItems:"center",gap:3}}>
            {f?<><i className="ti ti-circle-check" style={{fontSize:11}}/>Uploaded · preview</>:att.required?"✗ Missing":"Optional"}
          </p>
        </div>;
      })}
    </div>}

    {/* VIOLATIONS */}
    {tab==="violations"&&<div>
      {mViol.length===0
        ?<div style={{textAlign:"center",padding:40,color:"var(--color-text-tertiary)"}}>
          <i className="ti ti-shield-check" style={{fontSize:40,display:"block",marginBottom:10}}/><p style={{margin:0,fontSize:14}}>No violations / لا توجد مخالفات</p>
        </div>
        :<div style={{display:"grid",gap:10}}>
          {mViol.map(v=><div key={v.id} style={{border:"0.5px solid var(--color-border-tertiary)",borderRadius:12,padding:"14px",background:"var(--color-background-primary)"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <div><p style={{margin:0,fontSize:13,fontWeight:600,color:"var(--color-text-primary)"}}>{v.violationType}</p>
                <p style={{margin:"2px 0 0",fontSize:11,color:"var(--color-text-tertiary)"}}>{fmtDate(v.date)}{v.campName?" · Camp: "+v.campName:""}</p>
              </div>
              <div style={{display:"flex",gap:5,flexDirection:"column",alignItems:"flex-end"}}>
                <Badge style={{background:"#FCEBEB",color:"#A32D2D",fontSize:10}}>{v.punishmentType}</Badge>
                {v.fineAmount&&<Badge style={{background:"#FAEEDA",color:"#854F0B",fontSize:10}}>SAR {v.fineAmount}</Badge>}
              </div>
            </div>
            <p style={{margin:0,fontSize:12,color:"var(--color-text-secondary)",borderTop:"0.5px solid var(--color-border-tertiary)",paddingTop:8}}>{v.description}</p>
            {v.witness&&<p style={{margin:"4px 0 0",fontSize:11,color:"var(--color-text-tertiary)"}}>Witness: {v.witness}</p>}
            {v.signature&&<div style={{marginTop:8}}>
              <p style={{margin:"0 0 4px",fontSize:10,color:"var(--color-text-tertiary)",fontWeight:600,textTransform:"uppercase"}}>Signature / التوقيع</p>
              <img src={v.signature} alt="sig" style={{maxWidth:180,height:55,objectFit:"contain",border:"0.5px solid var(--color-border-tertiary)",borderRadius:6,background:"#FAFAFA"}}/>
            </div>}
          </div>)}
        </div>}
    </div>}

    {/* ACHIEVEMENTS */}
    {tab==="achievements"&&<div>
      {mAchv.length===0
        ?<div style={{textAlign:"center",padding:40,color:"var(--color-text-tertiary)"}}>
          <i className="ti ti-trophy" style={{fontSize:40,display:"block",marginBottom:10}}/><p style={{margin:0,fontSize:14}}>No achievements / لا توجد إنجازات</p>
        </div>
        :<div style={{display:"grid",gap:12}}>
          {mAchv.map(a=><div key={a.id} style={{border:"0.5px solid var(--color-border-tertiary)",borderRadius:13,padding:"15px",background:"var(--color-background-primary)"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
              <div><p style={{margin:0,fontSize:15,fontWeight:700,color:"var(--color-text-primary)"}}>{a.tournamentName}</p>
                <p style={{margin:"3px 0 0",fontSize:11,color:"var(--color-text-tertiary)"}}>{a.location} · {fmtDate(a.startDate)}{a.endDate?" → "+fmtDate(a.endDate):""}</p>
              </div>
              <div style={{display:"flex",gap:5,flexDirection:"column",alignItems:"flex-end"}}>
                <Badge style={{background:"#E6F1FB",color:"#185FA5",fontSize:10}}>{a.tournamentType}</Badge>
                {a.overallRank&&<Badge style={{background:"#EAF3DE",color:"#3B6D11",fontSize:11}}>🏆 {a.overallRank}</Badge>}
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,borderTop:"0.5px solid var(--color-border-tertiary)",paddingTop:10}}>
              {[{l:"Snatch / الخطف",r:a.snatchResult,g:a.snatchGold,s:a.snatchSilver,b:a.snatchBronze},
                {l:"C&J / النتر",r:a.cleanResult,g:a.cleanGold,s:a.cleanSilver,b:a.cleanBronze},
                {l:"Total / المجموع",r:a.totalResult,g:a.goldMedals,s:a.silverMedals,b:a.bronzeMedals}].map(({l,r,g,s,b})=>(
                <div key={l} style={{textAlign:"center",padding:"8px",background:"var(--color-background-secondary)",borderRadius:8}}>
                  <p style={{margin:"0 0 4px",fontSize:10,color:"var(--color-text-tertiary)"}}>{l}</p>
                  <p style={{margin:"0 0 5px",fontSize:18,fontWeight:700,color:"var(--color-text-primary)"}}>{r||"—"}{r&&<span style={{fontSize:11,fontWeight:400}}> kg</span>}</p>
                  <div style={{display:"flex",justifyContent:"center",gap:5}}>
                    {g&&g!="0"&&<span style={{fontSize:11,color:"#BA7517",fontWeight:700}}>🥇{g}</span>}
                    {s&&s!="0"&&<span style={{fontSize:11,color:"#888780",fontWeight:700}}>🥈{s}</span>}
                    {b&&b!="0"&&<span style={{fontSize:11,color:"#854F0B",fontWeight:700}}>🥉{b}</span>}
                  </div>
                </div>
              ))}
            </div>
            {(a.bestSnatch||a.bestClean||a.bestTotal)&&<div style={{marginTop:8,padding:"7px 11px",background:"rgba(4,44,83,0.04)",borderRadius:8,display:"flex",gap:14,flexWrap:"wrap"}}>
              {a.bestSnatch&&<span style={{fontSize:11,color:"var(--color-text-secondary)"}}>Best Snatch: <strong>{a.bestSnatch}kg</strong></span>}
              {a.bestClean&&<span style={{fontSize:11,color:"var(--color-text-secondary)"}}>Best C&J: <strong>{a.bestClean}kg</strong></span>}
              {a.bestTotal&&<span style={{fontSize:11,color:"var(--color-text-secondary)"}}>Best Total: <strong>{a.bestTotal}kg</strong></span>}
            </div>}
          </div>)}
        </div>}
    </div>}

    {/* MEDICAL */}
    {tab==="medical"&&<div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <p style={{margin:0,fontSize:14,fontWeight:600,color:"var(--color-text-primary)"}}>Injury History <span style={{fontSize:11,color:"var(--color-text-tertiary)",fontWeight:400}}>/ سجل الإصابات</span></p>
        <button onClick={()=>setShowInjForm(!showInjForm)} style={{display:"flex",alignItems:"center",gap:5,padding:"8px 14px",borderRadius:8,background:"#042C53",border:"none",cursor:"pointer",color:"#fff",fontSize:12,fontFamily:"inherit"}}>
          <i className="ti ti-plus" style={{fontSize:12}}/>Add injury / إضافة إصابة
        </button>
      </div>
      {showInjForm&&<div style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:12,padding:"15px",marginBottom:14}}>
        <div style={{display:"grid",gap:11}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div><FL en="Date" ar="التاريخ" required/><input type="date" value={injForm.date} onChange={e=>setInjForm(f=>({...f,date:e.target.value}))} style={iS(false)}/></div>
            <div><FL en="Injury type" ar="نوع الإصابة" required/>
              <select value={injForm.injuryType} onChange={e=>setInjForm(f=>({...f,injuryType:e.target.value}))} style={sS(false)}>
                <option value="">Select...</option>
                {INJURY_TYPES.map(t=><option key={t}>{t}</option>)}
              </select></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div><FL en="Status" ar="الحالة"/><select value={injForm.status} onChange={e=>setInjForm(f=>({...f,status:e.target.value}))} style={sS(false)}><option>Active</option><option>Recovering</option><option>Recovered</option></select></div>
            <div><FL en="Details" ar="التفاصيل"/><input type="text" value={injForm.details} onChange={e=>setInjForm(f=>({...f,details:e.target.value}))} style={iS(false)}/></div>
          </div>
          <SimpleUpload label="Medical report / تقرير طبي" labelAr="مرفق" icon="ti-report-medical" value={injForm.attachFile} onChange={v=>setInjForm(f=>({...f,attachFile:v}))}/>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
            <button onClick={()=>setShowInjForm(false)} style={{padding:"7px 14px",borderRadius:8,border:"1px solid var(--color-border-secondary)",background:"transparent",cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>Cancel</button>
            <button onClick={addInjury} style={{padding:"7px 16px",borderRadius:8,background:"#042C53",border:"none",cursor:"pointer",color:"#fff",fontSize:12,fontFamily:"inherit"}}>Save / حفظ</button>
          </div>
        </div>
      </div>}
      {(member.injuries||[]).length===0&&!showInjForm
        ?<div style={{textAlign:"center",padding:40,color:"var(--color-text-tertiary)"}}>
          <i className="ti ti-heartbeat" style={{fontSize:40,display:"block",marginBottom:10}}/><p style={{margin:0,fontSize:14}}>No injuries recorded</p>
        </div>
        :<div style={{display:"grid",gap:8}}>
          {(member.injuries||[]).map(inj=><div key={inj.id} style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:12,padding:"12px 14px"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
              <div><p style={{margin:0,fontSize:13,fontWeight:600,color:"var(--color-text-primary)"}}>{inj.injuryType}</p>
                <p style={{margin:"2px 0 0",fontSize:11,color:"var(--color-text-tertiary)"}}>{fmtDate(inj.date)}</p>
              </div>
              <Badge style={{background:inj.status==="Active"?"#FCEBEB":inj.status==="Recovering"?"#FAEEDA":"#EAF3DE",
                color:inj.status==="Active"?"#A32D2D":inj.status==="Recovering"?"#854F0B":"#3B6D11",fontSize:11}}>{inj.status}</Badge>
            </div>
            {inj.details&&<p style={{margin:0,fontSize:12,color:"var(--color-text-secondary)"}}>{inj.details}</p>}
            {inj.attachFile&&<button onClick={()=>setPreviewDoc(inj.attachFile)} style={{marginTop:6,background:"none",border:"0.5px solid var(--color-border-secondary)",borderRadius:6,padding:"3px 10px",cursor:"pointer",fontSize:11,color:"var(--color-text-secondary)",fontFamily:"inherit"}}>
              <i className="ti ti-file-medical" style={{fontSize:11,marginRight:3}}/>View report
            </button>}
          </div>)}
        </div>}
    </div>}

    {/* FILES */}
    {tab==="files"&&<div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <p style={{margin:0,fontSize:14,fontWeight:600,color:"var(--color-text-primary)"}}>Custom Files <span style={{fontSize:11,color:"var(--color-text-tertiary)",fontWeight:400}}>/ ملفات خاصة</span></p>
        <button onClick={()=>setShowFileForm(!showFileForm)} style={{display:"flex",alignItems:"center",gap:5,padding:"8px 14px",borderRadius:8,background:"#042C53",border:"none",cursor:"pointer",color:"#fff",fontSize:12,fontFamily:"inherit"}}>
          <i className="ti ti-upload" style={{fontSize:12}}/>Upload file / رفع ملف
        </button>
      </div>
      {showFileForm&&<div style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:12,padding:"15px",marginBottom:14}}>
        <div style={{display:"grid",gap:10}}>
          <div><FL en="File label / name" ar="اسم الملف" required/><input type="text" value={fileForm.label} onChange={e=>setFileForm(f=>({...f,label:e.target.value}))} placeholder="e.g. Medical Checkup, Contract..." style={iS(false)}/></div>
          <SimpleUpload label="Select file" labelAr="اختر ملف" icon="ti-file-upload" value={fileForm.file} onChange={v=>setFileForm(f=>({...f,file:v}))}/>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
            <button onClick={()=>setShowFileForm(false)} style={{padding:"7px 14px",borderRadius:8,border:"1px solid var(--color-border-secondary)",background:"transparent",cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>Cancel</button>
            <button onClick={addFile} style={{padding:"7px 16px",borderRadius:8,background:"#042C53",border:"none",cursor:"pointer",color:"#fff",fontSize:12,fontFamily:"inherit"}}>Upload / رفع</button>
          </div>
        </div>
      </div>}
      {(member.customFiles||[]).length===0&&!showFileForm
        ?<div style={{textAlign:"center",padding:40,color:"var(--color-text-tertiary)"}}>
          <i className="ti ti-folder-open" style={{fontSize:40,display:"block",marginBottom:10}}/><p style={{margin:0,fontSize:14}}>No custom files / لا توجد ملفات</p>
        </div>
        :<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:10}}>
          {(member.customFiles||[]).map(cf=><div key={cf.id} onClick={()=>cf.file&&setPreviewDoc(cf.file)} style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:10,padding:"12px",cursor:"pointer",transition:"all .15s"}}
            onMouseEnter={e=>e.currentTarget.style.borderColor="#378ADD"}
            onMouseLeave={e=>e.currentTarget.style.borderColor="var(--color-border-tertiary)"}>
            <i className="ti ti-file-description" style={{fontSize:22,display:"block",marginBottom:6,color:"#185FA5"}}/>
            <p style={{margin:0,fontSize:12,fontWeight:600,color:"var(--color-text-primary)"}}>{cf.label}</p>
            <p style={{margin:"2px 0 0",fontSize:10,color:"var(--color-text-tertiary)"}}>{cf.file?.name||"—"}</p>
            <p style={{margin:"4px 0 0",fontSize:10,color:"#185FA5"}}>Click to preview</p>
          </div>)}
        </div>}
    </div>}

    {/* Preview modal */}
    {previewDoc&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.72)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}
      onClick={()=>setPreviewDoc(null)}>
      <div style={{background:"var(--color-background-primary)",borderRadius:16,padding:20,maxWidth:560,width:"100%",maxHeight:"85vh",overflow:"auto"}}
        onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <p style={{margin:0,fontWeight:600,fontSize:14}}>{previewDoc.name}</p>
          <button onClick={()=>setPreviewDoc(null)} style={{background:"none",border:"none",cursor:"pointer",color:"var(--color-text-secondary)"}}><i className="ti ti-x" style={{fontSize:18}}/></button>
        </div>
        {previewDoc.url?.startsWith("data:image")
          ?<img src={previewDoc.url} alt="" style={{width:"100%",borderRadius:10,objectFit:"contain"}}/>
          :<div style={{padding:28,background:"var(--color-background-secondary)",borderRadius:10,textAlign:"center"}}>
            <i className="ti ti-file-description" style={{fontSize:40,color:"var(--color-text-tertiary)",display:"block",marginBottom:8}}/>
            <p style={{margin:0,fontSize:13,color:"var(--color-text-secondary)"}}>PDF · {previewDoc.name}</p>
          </div>}
      </div>
    </div>}
  </div>;
}

// ═══════════════════════════════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════════════════════════════
export default function App(){
  const[view,setView]=useState("roster");
  const[members,setMembers]=useState([]);
  const[violations,setViolations]=useState([]);
  const[achievements,setAchievements]=useState([]);
  const[selMember,setSelMember]=useState(null);
  const[search,setSearch]=useState("");
  const[fRole,setFRole]=useState("All");
  const[fSquad,setFSquad]=useState("All");
  const[sortBy,setSortBy]=useState("name");
  const[toast,setToast]=useState("");
  const[selIds,setSelIds]=useState(new Set());
  const[vCamp,setVCamp]=useState("");
  const[achFrom,setAchFrom]=useState("");
  const[achTo,setAchTo]=useState("");

  const flash=msg=>{setToast(msg);setTimeout(()=>setToast(""),4000);};

  const handleReg=m=>{setMembers(ms=>[m,...ms]);flash(`${m.fullName} registered / تم التسجيل`);setView("roster");};
  const handleViol=v=>{setViolations(vs=>[v,...vs]);flash("Violation recorded / تم تسجيل المخالفة");};
  const handleAchv=a=>{setAchievements(as=>[a,...as]);flash("Achievement recorded / تم تسجيل الإنجاز");};
  const handleUpdate=u=>{setMembers(ms=>ms.map(m=>m.id===u.id?u:m));if(selMember?.id===u.id)setSelMember(u);};

  const togSel=id=>setSelIds(p=>{const s=new Set(p);s.has(id)?s.delete(id):s.add(id);return s;});

  const filtered=members
    .filter(m=>{
      const q=search.toLowerCase();
      return(!q||m.fullName.toLowerCase().includes(q)||(m.fullNameAr||"").includes(q)||m.nationalId.includes(q)||m.role.toLowerCase().includes(q))
        &&(fRole==="All"||m.role===fRole)&&(fSquad==="All"||m.squad===fSquad);
    })
    .sort((a,b)=>sortBy==="name"?a.fullName.localeCompare(b.fullName):sortBy==="role"?a.role.localeCompare(b.role):new Date(b.registeredAt)-new Date(a.registeredAt));

  const selAll=()=>{if(selIds.size===filtered.length)setSelIds(new Set());else setSelIds(new Set(filtered.map(m=>m.id)));};
  const dlFiles=()=>{
    const sel=members.filter(m=>selIds.has(m.id));
    const all=sel.flatMap(m=>ATTACHMENTS.map(a=>m.files?.[a.key]?{...m.files[a.key],_name:`${m.fullName}_${a.label}`}:null).filter(Boolean));
    if(!all.length){flash("No uploaded files / لا توجد ملفات");return;}
    all.forEach((f,i)=>setTimeout(()=>{const a=document.createElement("a");a.href=f.url;a.download=f._name;a.click();},i*280));
    flash(`Downloading ${all.length} files...`);
  };

  const expAlerts=members.filter(m=>[monthsUntil(m.idExpiry),monthsUntil(m.passportExpiry)].some(x=>x!==null&&x<=8&&x>=0));
  const allCamps=[...new Set(violations.map(v=>v.campName).filter(Boolean))];
  const filteredV=vCamp?violations.filter(v=>v.campName===vCamp):violations;
  const filteredA=achievements.filter(a=>(!achFrom||a.startDate>=achFrom)&&(!achTo||a.startDate<=achTo));

  const stats={total:members.length,mens:members.filter(m=>m.squad==="Male").length,womens:members.filter(m=>m.squad==="Female").length,violations:violations.length,achievements:achievements.length};

  const navBtn=(v,lbl,ar,icon)=><button onClick={()=>setView(v)} style={{
    padding:"8px 15px",borderRadius:"8px 8px 0 0",border:"none",cursor:"pointer",fontSize:12,
    fontWeight:view===v?600:400,background:view===v?"rgba(255,255,255,0.12)":"transparent",
    color:"#fff",fontFamily:"inherit",display:"flex",alignItems:"center",gap:5,
    borderBottom:view===v?"2px solid #5DCAA5":"2px solid transparent",whiteSpace:"nowrap"}}>
    <i className={`ti ${icon}`} style={{fontSize:13}}/>{lbl} <span style={{fontSize:10,opacity:.5}}>/ {ar}</span>
  </button>;

  if(view==="register") return <div style={{minHeight:"100vh",background:"var(--color-background-tertiary)"}}>
    <div style={{maxWidth:720,margin:"0 auto",paddingBottom:40}}>
      <div style={{background:"#042C53",padding:"20px 32px"}}>
        <button onClick={()=>setView("roster")} style={{background:"none",border:"none",color:"rgba(255,255,255,0.55)",cursor:"pointer",fontSize:12,padding:0,fontFamily:"inherit",marginBottom:9}}>
          <i className="ti ti-arrow-left" style={{fontSize:12}}/> Back
        </button>
        <p style={{margin:0,fontSize:19,fontWeight:700,color:"#fff"}}>Register member <span style={{fontSize:12,fontWeight:400,opacity:.5}}>/ تسجيل عضو</span></p>
      </div>
      <div style={{background:"var(--color-background-primary)",padding:"26px 30px",borderRadius:"0 0 16px 16px",border:"0.5px solid var(--color-border-tertiary)",borderTop:"none"}}>
        <RegistrationForm onSuccess={handleReg}/>
      </div>
    </div>
  </div>;

  if(view==="member"&&selMember){
    const mem=members.find(m=>m.id===selMember.id)||selMember;
    const mV=violations.filter(v=>String(v.memberId)===String(mem.id));
    const mA=achievements.filter(a=>String(a.memberId)===String(mem.id));
    return <div style={{minHeight:"100vh",background:"var(--color-background-tertiary)"}}>
      <div style={{maxWidth:820,margin:"0 auto",paddingBottom:40}}>
        <div style={{background:"#042C53",padding:"14px 32px"}}>
          <p style={{margin:0,fontSize:10,fontWeight:600,color:"rgba(255,255,255,0.35)",letterSpacing:3,textTransform:"uppercase"}}>Team Management System / نظام إدارة الفريق</p>
        </div>
        <div style={{background:"var(--color-background-primary)",padding:"22px 30px",borderRadius:"0 0 16px 16px",border:"0.5px solid var(--color-border-tertiary)",borderTop:"none"}}>
          <MemberDetail member={mem} mViol={mV} mAchv={mA} onBack={()=>setView("roster")} onUpdate={handleUpdate}/>
        </div>
      </div>
    </div>;
  }

  return <div style={{minHeight:"100vh",background:"var(--color-background-tertiary)"}}>
    {/* HEADER */}
    <div style={{background:"#042C53",padding:"0 32px"}}>
      <div style={{maxWidth:1000,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:16,paddingBottom:12}}>
          <div>
            <p style={{margin:0,fontSize:9,fontWeight:600,color:"rgba(255,255,255,0.33)",letterSpacing:3,textTransform:"uppercase"}}>Sports Club / النادي الرياضي</p>
            <p style={{margin:"2px 0 0",fontSize:18,fontWeight:700,color:"#fff"}}>Team Management <span style={{fontSize:11,opacity:.38,fontWeight:400}}>/ نظام إدارة الفريق</span></p>
          </div>
          <button onClick={()=>setView("register")} style={{padding:"8px 16px",borderRadius:9,background:"#1D9E75",border:"none",cursor:"pointer",fontSize:12,fontWeight:600,color:"#fff",fontFamily:"inherit",display:"flex",alignItems:"center",gap:5}}>
            <i className="ti ti-user-plus" style={{fontSize:13}}/> Register / تسجيل
          </button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:7,paddingBottom:12}}>
          {[{l:"Total",ar:"الإجمالي",v:stats.total,ic:"ti-users"},{l:"Male",ar:"ذكر",v:stats.mens,ic:"ti-user"},
            {l:"Female",ar:"أنثى",v:stats.womens,ic:"ti-user"},{l:"Violations",ar:"مخالفات",v:stats.violations,ic:"ti-alert-triangle"},
            {l:"Achievements",ar:"إنجازات",v:stats.achievements,ic:"ti-trophy"}].map(({l,ar,v,ic})=>(
            <div key={l} style={{background:"rgba(255,255,255,0.06)",borderRadius:9,padding:"8px 12px",border:"0.5px solid rgba(255,255,255,0.08)"}}>
              <p style={{margin:0,fontSize:9,color:"rgba(255,255,255,0.38)",display:"flex",alignItems:"center",gap:4}}>
                <i className={`ti ${ic}`} style={{fontSize:9}}/>{l} / {ar}</p>
              <p style={{margin:"2px 0 0",fontSize:19,fontWeight:700,color:"#fff"}}>{v}</p>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:2}}>
          {navBtn("roster","Roster","الكشف","ti-users")}
          {navBtn("violations","Violations","المخالفات","ti-alert-triangle")}
          {navBtn("achievements","Achievements","الإنجازات","ti-trophy")}
        </div>
      </div>
    </div>

    {/* CONTENT */}
    <div style={{maxWidth:1000,margin:"0 auto",padding:"18px 32px 48px"}}>
      {toast&&<div style={{padding:"10px 16px",background:"#EAF3DE",border:"1px solid #97C459",borderRadius:9,marginBottom:12,display:"flex",alignItems:"center",gap:7}}>
        <i className="ti ti-circle-check" style={{fontSize:15,color:"#3B6D11"}}/><p style={{margin:0,fontSize:12,color:"#3B6D11",fontWeight:500}}>{toast}</p>
      </div>}

      {/* Expiry alert */}
      {expAlerts.length>0&&<div style={{padding:"11px 15px",background:"#FFF5E0",border:"1px solid #F5C878",borderRadius:9,marginBottom:12}}>
        <p style={{margin:"0 0 7px",fontSize:12,fontWeight:700,color:"#854F0B",display:"flex",alignItems:"center",gap:5}}>
          <i className="ti ti-alert-triangle" style={{fontSize:14}}/> Document Expiry Alerts / تنبيهات انتهاء الوثائق ({expAlerts.length})
        </p>
        <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
          {expAlerts.map(m=>{
            const idM=monthsUntil(m.idExpiry),ppM=monthsUntil(m.passportExpiry);
            return <button key={m.id} onClick={()=>{setSelMember(m);setView("member");}} style={{
              display:"flex",alignItems:"center",gap:6,padding:"4px 11px",borderRadius:20,
              border:"1px solid #F5C878",background:"rgba(255,255,255,0.7)",cursor:"pointer",fontFamily:"inherit",fontSize:11,color:"#854F0B"}}>
              <Avatar name={m.fullName} role={m.role} photoUrl={m.files?.photo?.url} size={20}/>
              {m.fullName}
              {idM!==null&&idM<=8&&<span style={{fontWeight:700}}>· ID:{idM}mo</span>}
              {ppM!==null&&ppM<=8&&<span style={{fontWeight:700}}>· PP:{ppM}mo</span>}
            </button>;
          })}
        </div>
      </div>}

      {/* ROSTER */}
      {view==="roster"&&<>
        <div style={{display:"flex",gap:8,marginBottom:13,flexWrap:"wrap"}}>
          <div style={{flex:1,minWidth:180,position:"relative"}}>
            <i className="ti ti-search" style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",fontSize:13,color:"var(--color-text-tertiary)"}}/>
            <input placeholder="Search name / ID / role..." value={search} onChange={e=>setSearch(e.target.value)}
              style={{width:"100%",padding:"9px 12px 9px 30px",borderRadius:10,border:"0.5px solid var(--color-border-secondary)",background:"rgba(255,255,255,0.65)",color:"var(--color-text-primary)",fontSize:12,fontFamily:"inherit",boxSizing:"border-box"}}/>
          </div>
          {[{val:fRole,set:setFRole,opts:["All",...ROLES.map(r=>r.id)],lbl:v=>v==="All"?"All roles":v},{val:fSquad,set:setFSquad,opts:["All",...GENDERS],lbl:v=>v==="All"?"All genders / الكل":v},
            {val:sortBy,set:setSortBy,opts:["name","role","recent"],lbl:v=>({name:"Sort: Name",role:"Sort: Role",recent:"Sort: Newest"})[v]}].map((s,i)=>(
            <select key={i} value={s.val} onChange={e=>s.set(e.target.value)} style={{padding:"9px 11px",borderRadius:10,border:"0.5px solid var(--color-border-secondary)",background:"rgba(255,255,255,0.65)",color:"var(--color-text-primary)",fontSize:11,fontFamily:"inherit"}}>
              {s.opts.map(o=><option key={o} value={o}>{s.lbl(o)}</option>)}
            </select>
          ))}
        </div>

        {filtered.length>0&&<div style={{display:"flex",alignItems:"center",gap:9,marginBottom:11,padding:"8px 13px",background:"rgba(255,255,255,0.6)",borderRadius:9,border:"0.5px solid var(--color-border-tertiary)",flexWrap:"wrap"}}>
          <button onClick={selAll} style={{background:"none",border:"none",cursor:"pointer",fontSize:11,color:"var(--color-text-secondary)",fontFamily:"inherit",padding:0}}>
            {selIds.size===filtered.length?"Deselect all":"Select all / تحديد الكل"}
          </button>
          {selIds.size>0&&<><span style={{fontSize:12,color:"var(--color-text-tertiary)"}}>·</span>
            <span style={{fontSize:11,color:"var(--color-text-secondary)"}}>{selIds.size} selected</span>
            <span style={{fontSize:12,color:"var(--color-text-tertiary)"}}>·</span>
            <button onClick={dlFiles} style={{background:"#042C53",border:"none",cursor:"pointer",fontSize:11,color:"#fff",fontFamily:"inherit",padding:"5px 13px",borderRadius:7,display:"flex",alignItems:"center",gap:4}}>
              <i className="ti ti-files" style={{fontSize:12}}/>Download all files / تنزيل الملفات
            </button>
            <button onClick={()=>{
              const sel=members.filter(m=>selIds.has(m.id));
              const lines=sel.map(m=>{
                const docs=ATTACHMENTS.map(a=>m.files?.[a.key]?`  ✓ ${a.label}: ${m.files[a.key].name}`:`  ✗ ${a.label}: missing`).join("\n");
                return `=== ${m.fullName} (${m.role}) ===\n${docs}`;
              }).join("\n\n");
              const blob=new Blob([`ATTACHMENT MANIFEST\n${new Date().toLocaleString()}\n\n${lines}`],{type:"text/plain"});
              const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="manifest.txt";a.click();URL.revokeObjectURL(url);
              flash("Manifest downloaded");
            }} style={{background:"rgba(255,255,255,0.8)",border:"1px solid var(--color-border-secondary)",cursor:"pointer",fontSize:11,color:"var(--color-text-primary)",fontFamily:"inherit",padding:"5px 13px",borderRadius:7,display:"flex",alignItems:"center",gap:4}}>
              <i className="ti ti-download" style={{fontSize:12}}/>Manifest
            </button>
          </>}
        </div>}

        {members.length===0
          ?<div style={{textAlign:"center",padding:"56px 24px",background:"rgba(255,255,255,0.5)",borderRadius:16,border:"0.5px solid var(--color-border-tertiary)"}}>
            <i className="ti ti-users" style={{fontSize:44,color:"var(--color-text-tertiary)",display:"block",marginBottom:10}}/>
            <p style={{margin:0,fontSize:15,fontWeight:600,color:"var(--color-text-secondary)"}}>No members yet / لا يوجد أعضاء</p>
            <p style={{margin:"5px 0 16px",fontSize:12,color:"var(--color-text-tertiary)"}}>Register the first member to get started</p>
            <button onClick={()=>setView("register")} style={{padding:"9px 20px",borderRadius:9,background:"#042C53",border:"none",cursor:"pointer",fontSize:12,fontWeight:600,color:"#fff",fontFamily:"inherit"}}>
              Register first member / سجّل أول عضو
            </button>
          </div>
          :filtered.length===0
            ?<div style={{textAlign:"center",padding:"38px",color:"var(--color-text-tertiary)"}}><i className="ti ti-search-off" style={{fontSize:36,display:"block",marginBottom:8}}/><p style={{margin:0}}>No results / لا توجد نتائج</p></div>
            :<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(215px,1fr))",gap:11}}>
              {filtered.map(m=>{
                const mV=violations.filter(v=>String(v.memberId)===String(m.id));
                const mA=achievements.filter(a=>String(a.memberId)===String(m.id));
                return <MemberCard key={m.id} member={m} mViol={mV} mAchv={mA}
                  selected={selIds.has(m.id)} onSelect={togSel}
                  onClick={()=>{setSelMember(m);setView("member");}}/>;
              })}
            </div>}
      </>}

      {/* VIOLATIONS */}
      {view==="violations"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1.2fr",gap:20,alignItems:"start"}}>
        <div>
          <p style={{margin:"0 0 11px",fontSize:14,fontWeight:600,color:"var(--color-text-primary)"}}>Record violation <span style={{fontSize:11,color:"var(--color-text-tertiary)",fontWeight:400}}>/ تسجيل مخالفة</span></p>
          {members.length===0
            ?<div style={{padding:26,background:"rgba(255,255,255,0.5)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:16,textAlign:"center"}}>
              <i className="ti ti-users-group" style={{fontSize:30,color:"var(--color-text-tertiary)",display:"block",marginBottom:7}}/><p style={{margin:0,fontSize:12,color:"var(--color-text-secondary)"}}>Register members first</p>
            </div>
            :<div style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:16,padding:"20px 20px"}}>
              <ViolationForm members={members} onSuccess={handleViol}/>
            </div>}
        </div>
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:11,flexWrap:"wrap",gap:7}}>
            <p style={{margin:0,fontSize:14,fontWeight:600,color:"var(--color-text-primary)"}}>Violation log <span style={{fontSize:11,color:"var(--color-text-tertiary)",fontWeight:400}}>({filteredV.length})</span></p>
            <div style={{display:"flex",gap:7,alignItems:"center"}}>
              <select value={vCamp} onChange={e=>setVCamp(e.target.value)} style={{padding:"5px 9px",borderRadius:7,border:"0.5px solid var(--color-border-secondary)",background:"rgba(255,255,255,0.7)",fontSize:11,fontFamily:"inherit",color:"var(--color-text-primary)"}}>
                <option value="">All camps / الكل</option>
                {allCamps.map(c=><option key={c}>{c}</option>)}
              </select>
              <button onClick={()=>printHTML(violPrint(filteredV,members,vCamp))}
                style={{display:"flex",alignItems:"center",gap:4,padding:"5px 13px",borderRadius:7,background:"#042C53",border:"none",cursor:"pointer",color:"#fff",fontSize:11,fontFamily:"inherit"}}>
                <i className="ti ti-printer" style={{fontSize:11}}/>Print report
              </button>
            </div>
          </div>
          {filteredV.length===0
            ?<div style={{padding:26,background:"rgba(255,255,255,0.5)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:16,textAlign:"center"}}>
              <i className="ti ti-clipboard-check" style={{fontSize:30,color:"var(--color-text-tertiary)",display:"block",marginBottom:7}}/><p style={{margin:0,fontSize:12,color:"var(--color-text-secondary)"}}>No violations / لا توجد مخالفات</p>
            </div>
            :<div style={{display:"grid",gap:8,maxHeight:580,overflowY:"auto"}}>
              {filteredV.map(v=>{
                const mem=members.find(m=>String(m.id)===String(v.memberId));
                return <div key={v.id} style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:11,padding:"11px 13px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                    <div style={{display:"flex",alignItems:"center",gap:7}}>
                      <Avatar name={mem?.fullName||"?"} role={mem?.role} photoUrl={mem?.files?.photo?.url} size={30}/>
                      <div>
                        <p style={{margin:0,fontSize:12,fontWeight:600,color:"var(--color-text-primary)"}}>{mem?.fullName||"Unknown"}</p>
                        <p style={{margin:0,fontSize:10,color:"var(--color-text-tertiary)"}}>{fmtDate(v.date)}{v.campName?" · "+v.campName:""}</p>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:4,flexDirection:"column",alignItems:"flex-end"}}>
                      <Badge style={{background:"#FCEBEB",color:"#A32D2D",fontSize:10}}>{v.violationType}</Badge>
                      <Badge style={{background:"#FAEEDA",color:"#854F0B",fontSize:10}}>{v.punishmentType}</Badge>
                    </div>
                  </div>
                  <p style={{margin:0,fontSize:11,color:"var(--color-text-secondary)",borderTop:"0.5px solid var(--color-border-tertiary)",paddingTop:5}}>{v.description}</p>
                  {v.signature&&<p style={{margin:"3px 0 0",fontSize:10,color:"#3B6D11"}}>✓ Signed</p>}
                </div>;
              })}
            </div>}
        </div>
      </div>}

      {/* ACHIEVEMENTS */}
      {view==="achievements"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1.2fr",gap:20,alignItems:"start"}}>
        <div>
          <p style={{margin:"0 0 11px",fontSize:14,fontWeight:600,color:"var(--color-text-primary)"}}>Record achievement <span style={{fontSize:11,color:"var(--color-text-tertiary)",fontWeight:400}}>/ تسجيل إنجاز</span></p>
          {members.length===0
            ?<div style={{padding:26,background:"rgba(255,255,255,0.5)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:16,textAlign:"center"}}>
              <i className="ti ti-users-group" style={{fontSize:30,color:"var(--color-text-tertiary)",display:"block",marginBottom:7}}/><p style={{margin:0,fontSize:12,color:"var(--color-text-secondary)"}}>Register members first</p>
            </div>
            :<AchievementForm members={members} onSuccess={handleAchv}/>}
        </div>
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:11,flexWrap:"wrap",gap:7}}>
            <p style={{margin:0,fontSize:14,fontWeight:600,color:"var(--color-text-primary)"}}>Achievements <span style={{fontSize:11,color:"var(--color-text-tertiary)",fontWeight:400}}>({filteredA.length})</span></p>
            <div style={{display:"flex",gap:7,alignItems:"center",flexWrap:"wrap"}}>
              {[{label:"From:",val:achFrom,set:setAchFrom},{label:"To:",val:achTo,set:setAchTo}].map(({label,val,set:setV})=>(
                <div key={label} style={{display:"flex",alignItems:"center",gap:4}}>
                  <span style={{fontSize:11,color:"var(--color-text-tertiary)"}}>{label}</span>
                  <input type="date" value={val} onChange={e=>setV(e.target.value)} style={{padding:"5px 8px",borderRadius:7,border:"0.5px solid var(--color-border-secondary)",background:"rgba(255,255,255,0.7)",fontSize:11,fontFamily:"inherit"}}/>
                </div>
              ))}
              <button onClick={()=>printHTML(achvPrint(filteredA,members,achFrom,achTo))}
                style={{display:"flex",alignItems:"center",gap:4,padding:"5px 13px",borderRadius:7,background:"#0F6E56",border:"none",cursor:"pointer",color:"#fff",fontSize:11,fontFamily:"inherit"}}>
                <i className="ti ti-printer" style={{fontSize:11}}/>Print report
              </button>
            </div>
          </div>
          {filteredA.length===0
            ?<div style={{padding:26,background:"rgba(255,255,255,0.5)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:16,textAlign:"center"}}>
              <i className="ti ti-trophy" style={{fontSize:30,color:"var(--color-text-tertiary)",display:"block",marginBottom:7}}/><p style={{margin:0,fontSize:12,color:"var(--color-text-secondary)"}}>No achievements / لا توجد إنجازات</p>
            </div>
            :<div style={{display:"grid",gap:8,maxHeight:640,overflowY:"auto"}}>
              {filteredA.map(a=>{
                const mem=members.find(m=>String(m.id)===String(a.memberId));
                return <div key={a.id} style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:11,padding:"11px 13px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                    <div style={{display:"flex",alignItems:"center",gap:7}}>
                      <Avatar name={mem?.fullName||"?"} role={mem?.role} photoUrl={mem?.files?.photo?.url} size={30}/>
                      <div>
                        <p style={{margin:0,fontSize:12,fontWeight:700,color:"var(--color-text-primary)"}}>{a.tournamentName}</p>
                        <p style={{margin:0,fontSize:10,color:"var(--color-text-tertiary)"}}>{mem?.fullName||"?"} · {a.location} · {fmtDate(a.startDate)}</p>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:4,flexDirection:"column",alignItems:"flex-end"}}>
                      <Badge style={{background:"#E6F1FB",color:"#185FA5",fontSize:10}}>{a.tournamentType}</Badge>
                      {a.overallRank&&<Badge style={{background:"#EAF3DE",color:"#3B6D11",fontSize:10}}>🏆 {a.overallRank}</Badge>}
                    </div>
                  </div>
                  <div style={{display:"flex",gap:7,borderTop:"0.5px solid var(--color-border-tertiary)",paddingTop:5,flexWrap:"wrap"}}>
                    {a.totalResult&&<Badge style={{background:"#FAEEDA",color:"#854F0B",fontSize:10}}>Total: {a.totalResult}kg</Badge>}
                    {a.snatchResult&&<Badge style={{background:"#E6F1FB",color:"#185FA5",fontSize:10}}>S: {a.snatchResult}kg</Badge>}
                    {a.cleanResult&&<Badge style={{background:"#EEEDFE",color:"#534AB7",fontSize:10}}>C&J: {a.cleanResult}kg</Badge>}
                    {[a.goldMedals&&a.goldMedals!="0"&&`🥇${a.goldMedals}`,a.silverMedals&&a.silverMedals!="0"&&`🥈${a.silverMedals}`,a.bronzeMedals&&a.bronzeMedals!="0"&&`🥉${a.bronzeMedals}`].filter(Boolean).map((x,i)=>(
                      <Badge key={i} style={{background:"#F1EFE8",color:"#444",fontSize:10}}>{x}</Badge>
                    ))}
                  </div>
                </div>;
              })}
            </div>}
        </div>
      </div>}
    </div>
  </div>;
}
