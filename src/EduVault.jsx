import { useState, useRef } from "react";

const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');
    *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
    :root {
      --navy:#0d1b2a; --navy3:#1e2d42; --amber:#e8a020; --amber2:#f5b942;
      --cream:#faf6ef; --muted:#7a8a9a; --shadow:0 4px 24px rgba(13,27,42,0.10);
    }
    body { font-family:'DM Sans',sans-serif; background:var(--cream); color:#1a2535; }
    h1,h2,h3 { font-family:'Playfair Display',serif; }
    input,select,textarea,button { font-family:'DM Sans',sans-serif; }
    @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
    @keyframes fadeIn { from{opacity:0} to{opacity:1} }
    @keyframes spin   { to{transform:rotate(360deg)} }
    .fu { animation:fadeUp 0.45s ease both; }
    .card { background:#fff; border-radius:14px; box-shadow:var(--shadow); overflow:hidden; transition:transform 0.2s,box-shadow 0.2s; }
    .card:hover { transform:translateY(-4px); box-shadow:0 12px 36px rgba(13,27,42,0.14); }
    .btn { display:inline-flex; align-items:center; gap:8px; padding:11px 24px; border-radius:50px; border:none; font-size:14px; font-weight:600; cursor:pointer; transition:all 0.2s; }
    .bp { background:var(--amber); color:var(--navy); }
    .bp:hover { background:var(--amber2); transform:translateY(-2px); box-shadow:0 6px 20px rgba(232,160,32,0.4); }
    .bg { background:transparent; color:var(--muted); padding:8px 14px; }
    .bg:hover { color:var(--amber); background:rgba(232,160,32,0.08); }
    .ig { margin-bottom:16px; }
    .ig label { display:block; font-size:12px; font-weight:600; color:var(--muted); margin-bottom:6px; text-transform:uppercase; letter-spacing:0.05em; }
    .ig input,.ig select,.ig textarea { width:100%; padding:12px 16px; border-radius:10px; border:1.5px solid #dde3ea; font-size:15px; color:#1a2535; background:#fafafa; outline:none; transition:border 0.2s; }
    .ig input:focus,.ig select:focus,.ig textarea:focus { border-color:var(--amber); box-shadow:0 0 0 3px rgba(232,160,32,0.15); background:#fff; }
    .ig textarea { resize:vertical; min-height:88px; }
    .ov { position:fixed; inset:0; background:rgba(13,27,42,0.6); backdrop-filter:blur(4px); z-index:300; display:flex; align-items:center; justify-content:center; animation:fadeIn 0.2s; }
    .mo { background:#fff; border-radius:20px; padding:36px; width:92%; max-width:500px; max-height:90vh; overflow-y:auto; box-shadow:0 20px 60px rgba(0,0,0,0.25); animation:fadeUp 0.3s; }
    .sp { display:inline-block; width:18px; height:18px; border:2.5px solid #0d1b2a; border-top-color:transparent; border-radius:50%; animation:spin 0.7s linear infinite; }
    .bdg { display:inline-block; padding:3px 11px; border-radius:50px; font-size:11px; font-weight:700; }
    ::-webkit-scrollbar{width:6px} ::-webkit-scrollbar-thumb{background:var(--amber);border-radius:8px}
  `}</style>
);

const RESOURCES = [
  { id:1, title:"Data Structures and Algorithms — Complete Notes", subject:"Computer Science", type:"Notes",  uploader:"Arjun M.",  uploadedAt:"2 days ago",  downloads:142, description:"Full semester notes covering arrays, trees, graphs and DP with examples.", size:"3.2 MB" },
  { id:2, title:"Operating Systems — Galvin Textbook 7th Ed.",     subject:"Computer Science", type:"Book",   uploader:"Priya K.",  uploadedAt:"1 week ago",  downloads:310, description:"Classic OS textbook covering processes, memory management, file systems.", size:"18.5 MB" },
  { id:3, title:"Machine Learning — Andrew Ng Lecture Slides",     subject:"AI/ML",            type:"Slides", uploader:"Rahul S.",  uploadedAt:"3 days ago",  downloads:287, description:"All slides from the famous Coursera ML course by Andrew Ng.", size:"8.1 MB" },
  { id:4, title:"DBMS — SQL and Relational Algebra Paper",         subject:"Database",         type:"Paper",  uploader:"Sneha T.",  uploadedAt:"5 days ago",  downloads:95,  description:"Research paper on query optimization and relational algebra.", size:"1.4 MB" },
  { id:5, title:"Computer Networks — Tanenbaum Notes",             subject:"Networking",       type:"Notes",  uploader:"Dev R.",    uploadedAt:"1 day ago",   downloads:78,  description:"Summarized notes from Tanenbaum Computer Networks 5th edition.", size:"4.8 MB" },
  { id:6, title:"Linear Algebra — MIT OpenCourseWare Slides",      subject:"Mathematics",      type:"Slides", uploader:"Aisha B.",  uploadedAt:"2 weeks ago", downloads:198, description:"Gilbert Strang slides on eigenvectors, matrices and transformations.", size:"6.2 MB" },
  { id:7, title:"Software Engineering — Design Patterns Book",     subject:"Software Eng.",    type:"Book",   uploader:"Kiran P.",  uploadedAt:"4 days ago",  downloads:155, description:"Gang of Four design patterns explained with real-world examples.", size:"9.3 MB" },
  { id:8, title:"Cybersecurity Fundamentals — Video Guide",        subject:"Security",         type:"Video",  uploader:"Tanya V.",  uploadedAt:"3 days ago",  downloads:63,  description:"Intro to ethical hacking, encryption and network security.", size:"210 MB" },
];

const SUBJECTS = ["All Subjects","Computer Science","AI/ML","Database","Networking","Mathematics","Software Eng.","Security"];
const TYPES = ["All Types","Notes","Book","Paper","Slides","Video","Other"];

function badgeStyle(type) {
  if (type === "Notes")  return { background:"#e8f5e9", color:"#2e7d32" };
  if (type === "Book")   return { background:"#e3f2fd", color:"#1565c0" };
  if (type === "Paper")  return { background:"#fce4ec", color:"#c62828" };
  if (type === "Slides") return { background:"#fff3e0", color:"#e65100" };
  if (type === "Video")  return { background:"#f3e5f5", color:"#6a1b9a" };
  return { background:"#eceff1", color:"#37474f" };
}

function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function submit() {
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    if (mode === "signup" && !name) { setError("Please enter your name."); return; }
    if (mode === "signup" && password !== confirm) { setError("Passwords do not match."); return; }
    setBusy(true);
    setTimeout(function() {
      setBusy(false);
      onLogin({ name: name || email.split("@")[0], email: email });
    }, 1100);
  }

  return (
    <div style={{ minHeight:"100vh", display:"flex" }}>
      <div style={{ width:"46%", background:"linear-gradient(145deg,#0d1b2a,#1e2d42)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"48px", position:"relative", overflow:"hidden" }}>
        {[0,1,2,3,4].map(function(i) {
          return <div key={i} style={{ position:"absolute", borderRadius:"50%", border:"1.5px solid rgba(232,160,32,0.08)", width:160+i*110, height:160+i*110, top:"50%", left:"50%", transform:"translate(-50%,-50%)" }} />;
        })}
        <div style={{ position:"relative", textAlign:"center", animation:"fadeUp 0.6s ease" }}>
          <div style={{ fontSize:52, marginBottom:14 }}>📚</div>
          <h1 style={{ fontSize:44, fontWeight:900, color:"#fff", lineHeight:1.1, marginBottom:14 }}>
            Edu<span style={{ color:"#e8a020" }}>Vault</span>
          </h1>
          <p style={{ fontSize:15, color:"rgba(255,255,255,0.6)", maxWidth:280, lineHeight:1.8, margin:"0 auto" }}>
            Your academic library — upload, discover, and share study resources with your peers.
          </p>
          <div style={{ marginTop:44, display:"flex", gap:32, justifyContent:"center" }}>
            {[["500+","Resources"],["2.4k","Students"],["50+","Subjects"]].map(function(item) {
              return (
                <div key={item[1]} style={{ textAlign:"center" }}>
                  <div style={{ fontSize:26, fontWeight:900, color:"#e8a020", fontFamily:"Playfair Display,serif" }}>{item[0]}</div>
                  <div style={{ fontSize:12, color:"rgba(255,255,255,0.45)", marginTop:2 }}>{item[1]}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"48px", background:"#faf6ef" }}>
        <div style={{ width:"100%", maxWidth:400, animation:"fadeUp 0.5s ease 0.1s both" }}>
          <h2 style={{ fontSize:30, marginBottom:8 }}>{mode === "login" ? "Welcome back" : "Create account"}</h2>
          <p style={{ color:"#7a8a9a", marginBottom:28, fontSize:15 }}>
            {mode === "login" ? "Sign in to access your resources" : "Join thousands of students sharing knowledge"}
          </p>

          <div style={{ display:"flex", background:"#e8e2d8", borderRadius:50, padding:4, marginBottom:26 }}>
            {["login","signup"].map(function(m) {
              return (
                <button key={m} onClick={function() { setMode(m); }} style={{ flex:1, padding:"10px", borderRadius:50, border:"none", cursor:"pointer", fontSize:14, fontWeight:600, transition:"all 0.2s", background:mode===m?"#fff":"transparent", color:mode===m?"#0d1b2a":"#7a8a9a", boxShadow:mode===m?"0 2px 8px rgba(0,0,0,0.1)":"none" }}>
                  {m === "login" ? "Sign In" : "Sign Up"}
                </button>
              );
            })}
          </div>

          {mode === "signup" && (
            <div className="ig">
              <label>Full Name</label>
              <input placeholder="Vamsi Krishna" value={name} onChange={function(e) { setName(e.target.value); }} />
            </div>
          )}
          <div className="ig">
            <label>Email Address</label>
            <input type="email" placeholder="you@example.com" value={email} onChange={function(e) { setEmail(e.target.value); }} />
          </div>
          <div className="ig">
            <label>Password</label>
            <input type="password" placeholder="........" value={password} onChange={function(e) { setPassword(e.target.value); }} />
          </div>
          {mode === "signup" && (
            <div className="ig">
              <label>Confirm Password</label>
              <input type="password" placeholder="........" value={confirm} onChange={function(e) { setConfirm(e.target.value); }} />
            </div>
          )}

          {error && (
            <div style={{ background:"#fdecea", color:"#c62828", padding:"10px 16px", borderRadius:10, fontSize:14, marginBottom:14 }}>
              {error}
            </div>
          )}

          <button className="btn bp" style={{ width:"100%", justifyContent:"center", padding:"14px", fontSize:16 }} onClick={submit} disabled={busy}>
            {busy ? <span className="sp" /> : (mode === "login" ? "Sign In" : "Create Account")}
          </button>
        </div>
      </div>
    </div>
  );
}

function UploadModal({ onClose, onUpload }) {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [type, setType] = useState("Notes");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const ref = useRef();

  function submit() {
    if (!title || !subject) { alert("Please fill in Title and Subject."); return; }
    setBusy(true);
    setTimeout(function() { setBusy(false); setDone(true); }, 1400);
  }

  if (done) {
    return (
      <div className="ov" onClick={onClose}>
        <div className="mo" onClick={function(e) { e.stopPropagation(); }} style={{ textAlign:"center" }}>
          <div style={{ fontSize:52, marginBottom:14 }}>✅</div>
          <h2 style={{ marginBottom:10 }}>Upload Successful!</h2>
          <p style={{ color:"#7a8a9a", marginBottom:28 }}>
            <strong>{title}</strong> is now available to the community.
          </p>
          <button className="btn bp" style={{ width:"100%", justifyContent:"center" }} onClick={function() { onUpload({ title, subject, type, description }, file); onClose(); }}>
            View Resources
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ov" onClick={onClose}>
      <div className="mo" onClick={function(e) { e.stopPropagation(); }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
          <h2 style={{ fontSize:22 }}>Upload Resource</h2>
          <button className="btn bg" style={{ padding:8, fontSize:18 }} onClick={onClose}>✕</button>
        </div>

        <div className="ig">
          <label>Resource Title</label>
          <input placeholder="e.g. Data Structures Complete Notes" value={title} onChange={function(e) { setTitle(e.target.value); }} />
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          <div className="ig">
            <label>Subject</label>
            <select value={subject} onChange={function(e) { setSubject(e.target.value); }}>
              <option value="">Select subject</option>
              {SUBJECTS.slice(1).map(function(s) { return <option key={s} value={s}>{s}</option>; })}
            </select>
          </div>
          <div className="ig">
            <label>Type</label>
            <select value={type} onChange={function(e) { setType(e.target.value); }}>
              {TYPES.slice(1).map(function(t) { return <option key={t} value={t}>{t}</option>; })}
            </select>
          </div>
        </div>

        <div className="ig">
          <label>Description</label>
          <textarea placeholder="Briefly describe what this covers..." value={description} onChange={function(e) { setDescription(e.target.value); }} />
        </div>

        <div
          onClick={function() { ref.current.click(); }}
          onDragOver={function(e) { e.preventDefault(); }}
          onDrop={function(e) { e.preventDefault(); setFile(e.dataTransfer.files[0]); }}
          style={{ border:"2px dashed " + (file ? "#2ecc71" : "#dde3ea"), borderRadius:12, padding:"26px", textAlign:"center", cursor:"pointer", background:file?"#f0fff4":"#fafafa", marginBottom:20 }}
        >
          <input ref={ref} type="file" style={{ display:"none" }} onChange={function(e) { setFile(e.target.files[0]); }} />
          {file
            ? <p style={{ fontWeight:700, color:"#2e7d32" }}>✅ {file.name}</p>
            : <div>
                <p style={{ fontSize:28, marginBottom:8 }}>📁</p>
                <p style={{ fontWeight:600 }}>Drop file here or click to browse</p>
                <p style={{ fontSize:13, color:"#7a8a9a", marginTop:4 }}>PDF, DOCX, PPT, MP4 up to 250MB</p>
              </div>
          }
        </div>

        <button className="btn bp" style={{ width:"100%", justifyContent:"center", padding:"14px", fontSize:15 }} onClick={submit} disabled={busy}>
          {busy ? <span className="sp" /> : "Upload Resource"}
        </button>
      </div>
    </div>
  );
}

function ResourceCard({ res, view }) {
  const [saved, setSaved] = useState(false);
  var bs = badgeStyle(res.type);

  if (view === "list") {
    return (
      <div className="card" style={{ padding:"16px 22px", display:"flex", alignItems:"center", gap:18 }}>
        <div style={{ width:46, height:46, borderRadius:12, background:"#faf6ef", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:22 }}>📄</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontWeight:700, fontSize:15, marginBottom:5, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{res.title}</div>
          <div style={{ display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" }}>
            <span className="bdg" style={bs}>{res.type}</span>
            <span style={{ fontSize:13, color:"#7a8a9a" }}>{res.subject}</span>
            <span style={{ fontSize:13, color:"#7a8a9a" }}>· {res.uploader}</span>
            <span style={{ fontSize:13, color:"#7a8a9a" }}>· {res.uploadedAt}</span>
          </div>
        </div>
        <div style={{ display:"flex", gap:10, flexShrink:0, alignItems:"center" }}>
          <span style={{ fontSize:13, color:"#7a8a9a" }}>{res.downloads} downloads</span>
          <button className="btn bp" style={{ padding:"8px 18px", fontSize:13 }}>Download</button>
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ display:"flex", flexDirection:"column" }}>
      <div style={{ background:"linear-gradient(135deg,#0d1b2a,#1e2d42)", padding:"20px 20px 16px", position:"relative" }}>
        <span className="bdg" style={bs}>{res.type}</span>
        <button onClick={function() { setSaved(function(s) { return !s; }); }} style={{ position:"absolute", top:14, right:14, background:"rgba(255,255,255,0.1)", border:"none", borderRadius:"50%", width:32, height:32, cursor:"pointer", fontSize:16 }}>
          {saved ? "❤️" : "🤍"}
        </button>
        <h3 style={{ color:"#fff", fontSize:15, fontWeight:700, marginTop:10, lineHeight:1.45, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
          {res.title}
        </h3>
        <p style={{ color:"rgba(255,255,255,0.5)", fontSize:13, marginTop:4 }}>{res.subject}</p>
      </div>
      <div style={{ padding:"16px 20px", flex:1, display:"flex", flexDirection:"column" }}>
        <p style={{ fontSize:13, color:"#7a8a9a", lineHeight:1.65, flex:1, marginBottom:14, display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
          {res.description}
        </p>
        <div style={{ display:"flex", justifyContent:"space-between", paddingTop:12, borderTop:"1px solid #f0ead8", marginBottom:14 }}>
          <span style={{ fontSize:13, color:"#7a8a9a" }}>👤 {res.uploader}</span>
          <span style={{ fontSize:13, color:"#7a8a9a" }}>{res.size}</span>
        </div>
        <button className="btn bp" style={{ width:"100%", justifyContent:"center", padding:"10px" }}>
          ⬇️ Download
        </button>
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:10 }}>
          <span style={{ fontSize:12, color:"#7a8a9a" }}>{res.downloads} downloads</span>
          <span style={{ fontSize:12, color:"#7a8a9a" }}>{res.uploadedAt}</span>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ user, onLogout }) {
  const [resources, setResources] = useState(RESOURCES);
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("All Subjects");
  const [type, setType] = useState("All Types");
  const [view, setView] = useState("grid");
  const [showUpload, setShowUpload] = useState(false);

  var filtered = resources.filter(function(r) {
    var q = search.toLowerCase();
    var mQ = !q || r.title.toLowerCase().includes(q) || r.subject.toLowerCase().includes(q) || r.description.toLowerCase().includes(q);
    var mS = subject === "All Subjects" || r.subject === subject;
    var mT = type === "All Types" || r.type === type;
    return mQ && mS && mT;
  });

  function handleUpload(form, file) {
    setResources(function(prev) {
      return [{ id:prev.length+1, title:form.title, subject:form.subject||"General", type:form.type, description:form.description||"Newly uploaded resource.", uploader:user.name, uploadedAt:"just now", downloads:0, size:file?(file.size/1048576).toFixed(1)+" MB":"—" }].concat(prev);
    });
  }

  var totalDownloads = resources.reduce(function(a,r) { return a+r.downloads; }, 0);

  return (
    <div style={{ minHeight:"100vh", background:"#faf6ef" }}>
      <nav style={{ background:"#0d1b2a", padding:"0 32px", height:64, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100, boxShadow:"0 2px 20px rgba(0,0,0,0.2)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:22 }}>📚</span>
          <span style={{ color:"#fff", fontFamily:"Playfair Display,serif", fontSize:22, fontWeight:700 }}>
            Edu<span style={{ color:"#e8a020" }}>Vault</span>
          </span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <button className="btn bp" style={{ padding:"9px 20px", fontSize:14 }} onClick={function() { setShowUpload(true); }}>
            ⬆️ Upload
          </button>
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:"6px 14px", background:"rgba(255,255,255,0.08)", borderRadius:50 }}>
            <div style={{ width:30, height:30, borderRadius:"50%", background:"#e8a020", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:13, color:"#0d1b2a" }}>
              {user.name[0].toUpperCase()}
            </div>
            <span style={{ color:"rgba(255,255,255,0.85)", fontSize:14 }}>{user.name}</span>
          </div>
          <button className="btn bg" style={{ padding:"8px 14px", color:"rgba(255,255,255,0.6)", fontSize:13 }} onClick={onLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div style={{ background:"linear-gradient(135deg,#0d1b2a,#1a3a5c)", padding:"48px", position:"relative", overflow:"hidden" }}>
        {[0,1,2].map(function(i) {
          return <div key={i} style={{ position:"absolute", borderRadius:"50%", background:"rgba(232,160,32,0.05)", width:300+i*200, height:300+i*200, top:"50%", right:-100+i*60, transform:"translateY(-50%)" }} />;
        })}
        <div style={{ maxWidth:900, margin:"0 auto", position:"relative" }}>
          <h1 style={{ color:"#fff", fontSize:36, fontWeight:900, marginBottom:10 }}>Discover and Share Knowledge</h1>
          <p style={{ color:"rgba(255,255,255,0.55)", fontSize:15, marginBottom:30 }}>{filtered.length} resources available</p>
          <div style={{ display:"flex", alignItems:"center", gap:12, background:"rgba(255,255,255,0.1)", borderRadius:50, padding:"10px 20px", border:"1px solid rgba(255,255,255,0.15)", maxWidth:600 }}>
            <span style={{ color:"rgba(255,255,255,0.5)" }}>🔍</span>
            <input value={search} onChange={function(e) { setSearch(e.target.value); }} placeholder="Search resources, subjects, topics..." style={{ background:"none", border:"none", outline:"none", color:"#fff", fontSize:15, flex:1, fontFamily:"DM Sans,sans-serif" }} />
            {search && <button style={{ background:"none", border:"none", cursor:"pointer", color:"rgba(255,255,255,0.4)", fontSize:16 }} onClick={function() { setSearch(""); }}>✕</button>}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1200, margin:"0 auto", padding:"30px 24px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:28 }}>
          {[
            { emoji:"📄", label:"Total Resources", val:String(resources.length), bg:"#e3f2fd" },
            { emoji:"⬇️", label:"Total Downloads", val:totalDownloads.toLocaleString(), bg:"#e8f5e9" },
            { emoji:"👥", label:"Contributors", val:"48", bg:"#fff3e0" },
            { emoji:"⭐", label:"Saved by You", val:"12", bg:"#fce4ec" },
          ].map(function(item) {
            return (
              <div key={item.label} className="card" style={{ padding:"16px 20px", display:"flex", alignItems:"center", gap:14 }}>
                <div style={{ width:44, height:44, borderRadius:12, background:item.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{item.emoji}</div>
                <div>
                  <div style={{ fontSize:22, fontWeight:800, fontFamily:"Playfair Display,serif" }}>{item.val}</div>
                  <div style={{ fontSize:12, color:"#7a8a9a" }}>{item.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12, marginBottom:24 }}>
          <div style={{ display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" }}>
            <select value={subject} onChange={function(e) { setSubject(e.target.value); }} style={{ padding:"9px 16px", borderRadius:50, border:"1.5px solid #dde3ea", background:"#fff", fontSize:14, cursor:"pointer", outline:"none" }}>
              {SUBJECTS.map(function(s) { return <option key={s} value={s}>{s}</option>; })}
            </select>
            <select value={type} onChange={function(e) { setType(e.target.value); }} style={{ padding:"9px 16px", borderRadius:50, border:"1.5px solid #dde3ea", background:"#fff", fontSize:14, cursor:"pointer", outline:"none" }}>
              {TYPES.map(function(t) { return <option key={t} value={t}>{t}</option>; })}
            </select>
            {(subject !== "All Subjects" || type !== "All Types" || search) && (
              <button className="btn bg" onClick={function() { setSubject("All Subjects"); setType("All Types"); setSearch(""); }}>✕ Clear</button>
            )}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:14, color:"#7a8a9a" }}>{filtered.length} results</span>
            <div style={{ display:"flex", background:"#fff", borderRadius:10, border:"1.5px solid #dde3ea", overflow:"hidden" }}>
              {["grid","list"].map(function(v) {
                return <button key={v} onClick={function() { setView(v); }} style={{ padding:"8px 14px", border:"none", cursor:"pointer", background:view===v?"#0d1b2a":"transparent", color:view===v?"#fff":"#7a8a9a", fontSize:13, fontWeight:600 }}>{v === "grid" ? "Grid" : "List"}</button>;
              })}
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign:"center", padding:"60px 0" }}>
            <div style={{ fontSize:48, marginBottom:14 }}>🔍</div>
            <h3 style={{ marginBottom:8 }}>No resources found</h3>
            <p style={{ color:"#7a8a9a", marginBottom:20 }}>Try adjusting your search or filters</p>
            <button className="btn bp" onClick={function() { setSubject("All Subjects"); setType("All Types"); setSearch(""); }}>Clear All Filters</button>
          </div>
        ) : (
          <div style={view === "grid" ? { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))", gap:20 } : { display:"flex", flexDirection:"column", gap:12 }}>
            {filtered.map(function(res, i) {
              return (
                <div key={res.id} className="fu" style={{ animationDelay:i*0.04+"s" }}>
                  <ResourceCard res={res} view={view} />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showUpload && <UploadModal onClose={function() { setShowUpload(false); }} onUpload={handleUpload} />}

      <footer style={{ background:"#0d1b2a", color:"rgba(255,255,255,0.4)", textAlign:"center", padding:"22px", marginTop:48, fontSize:14 }}>
        EduVault 2025 · Made for students, by students 📚
      </footer>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  return (
    <>
      <G />
      {user
        ? <Dashboard user={user} onLogout={function() { setUser(null); }} />
        : <AuthPage onLogin={setUser} />
      }
    </>
  );
}