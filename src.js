(()=>{ // v1.0.2
  if (window.CCMP && window.CCMP.destroy) { try{ window.CCMP.destroy(); }catch(e){} }
  const NS='ccmp';

  function rid(n){ return Math.random().toString(36).slice(2,2+n); }
  function LS(k,v){ if(v===undefined){ try{return JSON.parse(localStorage.getItem(k)||'null');}catch(e){return null;} } localStorage.setItem(k,JSON.stringify(v)); return v; }
  const safe=(fn)=>{ try{ return fn(); }catch(e){} };
  const shortId=(id)=>String(id||'').slice(0,6);

  const PLAYER_ID = LS(`${NS}:playerId`) || LS(`${NS}:playerId`, ('p'+rid(6)+rid(6)));
  const OWNER_ID='kittenasy12';
  const isOwnerPid=(pid)=> String(pid).toLowerCase()===OWNER_ID.toLowerCase();
  const IS_OWNER = isOwnerPid(PLAYER_ID);
  const DNAME_KEY=`${NS}:dname`;
  const DEFAULT_DNAME='Player '+shortId(PLAYER_ID);

  const Names={ map:new Map(),
    sanitize(s){ let t=String(s||'').trim(); t=t.replace(/[\u0000-\u001F<>]/g,''); if(t.length>24) t=t.slice(0,24); return t; },
    set(pid,name){ if(!pid) return ''; const n=this.sanitize(name); this.map.set(pid,n); return n; },
    get(pid){ return this.map.get(pid)||''; },
  };

  const KEY_GBAN=`${NS}:gban:list`;
  const GlobalBan={
    set:new Set(Array.isArray(LS(KEY_GBAN))?LS(KEY_GBAN):[]),
    save(){ LS(KEY_GBAN, Array.from(this.set)); },
    add(pid){ if(!pid || isOwnerPid(pid)) return; this.set.add(String(pid)); this.save(); },
    remove(pid){ this.set.delete(String(pid)); this.save(); },
    has(pid){ return this.set.has(String(pid)); },
    export(){ return Array.from(this.set); },
    importMerge(list){ if(Array.isArray(list)){ list.forEach(p=>{ if(!isOwnerPid(p)) this.set.add(String(p)); }); this.save(); } }
  };

  const css=`:root{--c-bg:#0a0f18;--c-elev:#0e1522;--c-line:#1f2a3a;--c-soft:#0b1220;--c-txt:#e5e7eb;--c-dim:#9ca3af;--c-ac:#7dd3fc;--c-ac2:#a78bfa;--c-ok:#10b981;}
  #${NS}-btn{position:fixed;right:18px;bottom:18px;z-index:2147483646;font-family:Inter,system-ui,Segoe UI,sans-serif;font-size:13px;padding:10px 12px;border-radius:12px;background:linear-gradient(135deg,var(--c-ac),var(--c-ac2));color:#0b1020;font-weight:700;box-shadow:0 8px 28px rgba(0,0,0,.35), inset 0 0 0 1px rgba(255,255,255,.2);cursor:pointer;border:0}
  #${NS}-panel{position:fixed;right:18px;bottom:70px;z-index:2147483646;width:740px;max-width:95vw;background:var(--c-bg);color:var(--c-txt);border:1px solid var(--c-line);border-radius:16px;box-shadow:0 18px 40px rgba(0,0,0,.5);font-family:Inter,system-ui,Segoe UI,sans-serif;display:none;overflow:hidden}
  #${NS}-panel.${NS}-open{display:block}
  #${NS}-head{display:flex;align-items:center;gap:10px;padding:12px 14px;background:linear-gradient(180deg,rgba(255,255,255,.03),rgba(255,255,255,0));border-bottom:1px solid var(--c-line)}
  #${NS}-title{font-weight:800;font-size:14px;letter-spacing:.3px}
  #${NS}-badge{margin-left:auto;padding:4px 8px;border-radius:999px;border:1px solid #223048;color:#cbd5e1;font-size:11px;text-transform:uppercase}
  #${NS}-pid{margin-left:8px;padding:4px 8px;border-radius:999px;border:1px dashed #334155;color:#9ca3af;font-size:11px}
  #${NS}-tabs{display:flex;gap:6px;padding:10px;border-bottom:1px solid var(--c-line);background:var(--c-elev);flex-wrap:wrap}
  .${NS}-tabbtn{flex:1;background:var(--c-soft);border:1px solid var(--c-line);color:var(--c-txt);padding:8px 10px;border-radius:10px;cursor:pointer;font-size:12px;min-width:110px}
  .${NS}-tabbtn[aria-selected="true"]{background:linear-gradient(135deg,rgba(125,211,252,.15),rgba(167,139,250,.15));border-color:#2b3b55}
  .${NS}-tab{display:none !important}
  .${NS}-tab[data-active="1"]{display:block !important}
  #${NS}-body{padding:12px}
  .${NS}-row{display:flex;gap:8px;align-items:center;margin-bottom:8px}
  .${NS}-row input[type="text"], .${NS}-row input[type="number"], .${NS}-row textarea, .${NS}-row select{flex:1;background:var(--c-soft);color:var(--c-txt);border:1px solid var(--c-line);border-radius:10px;padding:10px 12px;outline:none}
  .${NS}-check{display:flex;align-items:center;gap:8px;background:var(--c-soft);border:1px solid var(--c-line);border-radius:999px;padding:6px 10px;font-size:12px}
  .${NS}-sec{border:1px dashed var(--c-line);border-radius:12px;padding:10px;margin:10px 0;background:rgba(255,255,255,.02)}
  .${NS}-secHead{display:flex;justify-content:space-between;align-items:center;cursor:pointer;user-select:none;margin-bottom:6px}
  .${NS}-secHead .ttl{font-size:12px;color:#9ca3af}
  .${NS}-secHead .arrow{font-size:14px;color:#9ca3af;transition:transform .18s ease}
  .${NS}-sec[data-collapsed="1"] .${NS}-secBody{display:none}
  .${NS}-sec[data-collapsed="1"] .${NS}-secHead .arrow{transform:rotate(-90deg)}
  #${NS}-peers{font-size:12px;color:#cbd5e1;background:var(--c-soft);border:1px solid var(--c-line);border-radius:10px;padding:8px}
  #${NS}-status{font-size:12px;color:#9ca3af;min-height:16px;margin-top:6px}
  #${NS}-footer{display:flex;gap:8px;justify-content:space-between;margin-top:8px}
  .btn{padding:10px 12px;border-radius:12px;border:1px solid var(--c-line);cursor:pointer;font-weight:600}
  .btn-primary{background:linear-gradient(135deg,var(--c-ac),var(--c-ac2));color:#0b1020;border:0}
  .btn-ghost{background:var(--c-soft);color:#e5e7eb}
  .btn-danger{background:linear-gradient(135deg,#fca5a5,#f87171);color:#0b1020;border:0}
  .btn-ok{background:linear-gradient(135deg,#6ee7b7,#34d399);color:#0b1020;border:0}
  .btn-slim{padding:6px 8px;border-radius:10px}
  .${NS}-hostOnly{display:none}
  .${NS}-isHost .${NS}-hostOnly{display:block}
  .${NS}-isAdmin .${NS}-hostOnly{display:block}
  #${NS}-peerList{display:flex;flex-direction:column;gap:6px}
  .${NS}-peerItem{display:flex;align-items:center;justify-content:space-between;background:var(--c-soft);border:1px solid var(--c-line);border-radius:10px;padding:6px 8px}
  .${NS}-roleTag{margin-left:8px;font-size:10px;border:1px solid #334155;border-radius:999px;padding:2px 6px;color:#9ca3af}
  #${NS}-roster{position:fixed;left:18px;bottom:18px;z-index:2147483646;display:flex;flex-direction:column;gap:6px}
  .${NS}-roCard{background:var(--c-bg);color:#e5e7eb;border:1px solid var(--c-line);border-radius:12px;box-shadow:0 6px 22px rgba(0,0,0,.28);padding:8px 10px;font-size:12px;min-width:210px}
  .${NS}-roHead{display:flex;justify-content:space-between;align-items:center;margin-bottom:4px}
  .${NS}-dot{display:inline-block;width:8px;height:8px;border-radius:50%}
  .${NS}-dot.host{background:#10b981}
  .${NS}-dot.admin{background:#a78bfa}
  .${NS}-dot.client{background:#60a5fa}
  .${NS}-dot.owner{background:#fbbf24}
  .${NS}-pillSmall{font-size:11px;border:1px solid #334155;border-radius:999px;padding:1px 6px;color:#9ca3af}
  #${NS}-toasts{position:fixed;top:14px;right:14px;z-index:2147483647;display:flex;flex-direction:column;gap:10px;max-width:46vw;pointer-events:none}
  .${NS}-toast{background:#0f172a;border:2px solid #1f2a44;border-radius:12px;padding:10px 14px;color:#e5e7eb;font-size:13px;font-weight:700;box-shadow:0 18px 48px rgba(0,0,0,.6);opacity:0;transform:translateY(-6px);transition:opacity .18s ease, transform .18s ease}
  .${NS}-toast.show{opacity:1;transform:translateY(0)}
  .${NS}-toast.ok{border-color:#0b4a3f;background:#0b3a33}
  .${NS}-toast.warn{border-color:#7c2d12;background:#3b1d13}
  #${NS}-cursors{position:fixed;inset:0;pointer-events:none;z-index:2147483647}
  .${NS}-cursor{position:fixed;transform:translate(-50%,-50%);display:flex;align-items:center;gap:6px}
  .${NS}-cursor .dot{width:10px;height:10px;border-radius:50%;background:#7dd3fc;box-shadow:0 0 0 2px rgba(125,211,252,.4),0 0 8px rgba(125,211,252,.6)}
  .${NS}-cursor .tag{background:rgba(2,6,23,.8);border:1px solid #1f2a44;color:#e5e7eb;padding:2px 6px;border-radius:8px;font-size:11px}
  #${NS}-chatList{display:flex;flex-direction:column;gap:6px;height:220px;max-height:36vh;overflow:auto;background:var(--c-soft);border:1px solid var(--c-line);border-radius:12px;padding:8px}
  .${NS}-chatMsg{background:rgba(255,255,255,.03);border:1px solid var(--c-line);border-radius:10px;padding:6px 8px}
  .${NS}-chatMsg.me{background:rgba(125,211,252,.10);border-color:#2b3b55}
  .${NS}-chatWho{font-size:11px;color:#9ca3af;margin-bottom:2px}
  .${NS}-chatTxt{font-size:13px;white-space:pre-wrap;word-break:break-word}
  #${NS}-typing{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px;min-height:18px}
  .${NS}-typingChip{display:inline-flex;align-items:center;gap:8px;background:rgba(125,211,252,.08);border:1px solid #2b3b55;border-radius:999px;padding:4px 8px;color:#cbd5e1;font-size:12px}
  .${NS}-typingDots{display:inline-flex;gap:4px;align-items:center}
  .${NS}-typingDots span{width:6px;height:6px;border-radius:50%;background:#cbd5e1;opacity:.25;animation:${NS}-blink 1s infinite}
  .${NS}-typingDots span:nth-child(2){animation-delay:.2s}
  .${NS}-typingDots span:nth-child(3){animation-delay:.4s}
  @keyframes ${NS}-blink{0%,80%,100%{opacity:.25}40%{opacity:1}}

  /* Voice UI + meters */
  #${NS}-voicePeers{display:flex;flex-direction:column;gap:6px;max-height:220px;overflow:auto;background:var(--c-soft);border:1px solid var(--c-line);border-radius:12px;padding:8px}
  .${NS}-vrow{display:flex;align-items:center;justify-content:space-between;border:1px solid var(--c-line);border-radius:10px;padding:6px 8px;background:rgba(255,255,255,.03)}
  .${NS}-vleft{display:flex;align-items:center;gap:8px}
  .${NS}-vmic{width:10px;height:10px;border-radius:50%;background:#475569;box-shadow:0 0 0 1px #1f2937}
  .${NS}-vmic.live{background:#10b981;box-shadow:0 0 0 1px #064e3b,0 0 8px rgba(16,185,129,.6)}
  .${NS}-vname{font-size:12px;color:#e2e8f0}
  .${NS}-vright{display:flex;align-items:center;gap:10px}
  .${NS}-vbar{width:140px;height:8px;border-radius:999px;background:#1f2937;overflow:hidden;border:1px solid #334155}
  .${NS}-vbar .fill{height:100%;width:0;background:linear-gradient(90deg,#60a5fa,#34d399)}
  .${NS}-badgeSmall{font-size:10px;padding:2px 6px;border:1px solid #334155;border-radius:999px;color:#9ca3af}
  `;
  const html=`
    <button id="${NS}-btn" title="Cookie Clicker Multiplayer">CC-MP</button>
    <div id="${NS}-panel" role="dialog" aria-label="Cookie Clicker Multiplayer">
      <div id="${NS}-head">
        <div id="${NS}-title">Cookie Clicker — Multiplayer</div>
        <div id="${NS}-badge">client</div>
        <div id="${NS}-pid">${shortId(PLAYER_ID)}</div>
      </div>

      <div id="${NS}-tabs" role="tablist">
        <button class="${NS}-tabbtn" id="${NS}-tabbtn-connect" role="tab" aria-controls="${NS}-tab-connect" aria-selected="true">Connect</button>
        <button class="${NS}-tabbtn ${NS}-hostOnly" id="${NS}-tabbtn-host" role="tab" aria-controls="${NS}-tab-host" aria-selected="false">Host Tools</button>
        <button class="${NS}-tabbtn ${NS}-hostOnly" id="${NS}-tabbtn-perms" role="tab" aria-controls="${NS}-tab-perms" aria-selected="false">Permissions</button>
        <button class="${NS}-tabbtn ${NS}-hostOnly" id="${NS}-tabbtn-peers" role="tab" aria-controls="${NS}-tab-peers" aria-selected="false">Peers</button>
        <button class="${NS}-tabbtn" id="${NS}-tabbtn-chat" role="tab" aria-controls="${NS}-tab-chat" aria-selected="false">Chat</button>
        <button class="${NS}-tabbtn" id="${NS}-tabbtn-voice" role="tab" aria-controls="${NS}-tab-voice" aria-selected="false">Voice</button>
        <button class="${NS}-tabbtn" id="${NS}-tabbtn-notify" role="tab" aria-controls="${NS}-tab-notify" aria-selected="false">Notifications</button>
        <button class="${NS}-tabbtn" id="${NS}-tabbtn-about" role="tab" aria-controls="${NS}-tab-about" aria-selected="false">About</button>
      </div>

      <div id="${NS}-body">
        <!-- Connect -->
        <div class="${NS}-tab" id="${NS}-tab-connect" role="tabpanel" data-active="1">
          <div class="${NS}-sec" data-title="Identity">
            <div class="${NS}-row">
              <input id="${NS}-dname" type="text" placeholder="Display name (shown in player list)"/>
              <button id="${NS}-dname-save" class="btn btn-ghost btn-slim">Save name</button>
            </div>
            <div style="font-size:12px;color:#9ca3af">Your ID: <b>${shortId(PLAYER_ID)}</b>${IS_OWNER? ' • <b>OWNER</b>':''}</div>
          </div>

          <div class="${NS}-sec" data-title="Room">
            <div class="${NS}-row">
              <input id="${NS}-room" type="text" placeholder="Room ID (share with friends)"/>
              <button id="${NS}-make" class="btn btn-ghost btn-slim">Random</button>
              <button id="${NS}-copy" class="btn btn-ghost btn-slim">Copy</button>
            </div>
            <div class="${NS}-row">
              <button id="${NS}-host" class="btn btn-primary">Host</button>
              <button id="${NS}-join" class="btn btn-ok">Join</button>
              <button id="${NS}-disconnect" class="btn btn-danger">Disconnect</button>
            </div>
          </div>

          <div class="${NS}-sec" data-title="Status">
            <div id="${NS}-peers">No peers connected.</div>
            <div id="${NS}-status">Idle.</div>
          </div>

          <div id="${NS}-footer">
            <button id="${NS}-min" class="btn btn-ghost">Minimize</button>
            <button id="${NS}-close" class="btn btn-ghost">Close UI</button>
          </div>
        </div>

        <!-- Host Tools -->
        <div class="${NS}-tab ${NS}-hostOnly" id="${NS}-tab-host" role="tabpanel" data-active="0">
          <div class="${NS}-sec" data-title="Sync (authoritative)">
            <div class="${NS}-row">
              <label class="${NS}-check"><input id="${NS}-t-cookies" type="checkbox" checked> <span>Broadcast Cookies</span></label>
              <label class="${NS}-check"><input id="${NS}-t-buildings" type="checkbox" checked> <span>Broadcast Buildings</span></label>
            </div>
            <div class="${NS}-row">
              <label class="${NS}-check"><input id="${NS}-t-upgrades" type="checkbox" checked> <span>Grant Upgrades</span></label>
              <label class="${NS}-check"><input id="${NS}-t-ach" type="checkbox" checked> <span>Grant Achievements</span></label>
            </div>
            <div class="${NS}-row">
              <label class="${NS}-check"><input id="${NS}-t-buffs" type="checkbox" checked> <span>Sync Buffs</span></label>
              <label class="${NS}-check"><input id="${NS}-t-lumps" type="checkbox" checked> <span>Sync Sugar Lumps</span></label>
            </div>
            <div class="${NS}-row">
              <label class="${NS}-check"><input id="${NS}-t-minisaves" type="checkbox" checked> <span>Soft Minigame Saves</span></label>
            </div>
          </div>

          <div class="${NS}-sec" data-title="Specials (experimental)">
            <div class="${NS}-row">
              <label class="${NS}-check"><input id="${NS}-t-specWrink" type="checkbox" checked> <span>Wrinklers</span></label>
              <label class="${NS}-check"><input id="${NS}-t-specPrestige" type="checkbox"> <span>Prestige/Heavenly (increase-only)</span></label>
            </div>
          </div>

          <div class="${NS}-sec" data-title="Room / Limits / Pulses">
            <div class="${NS}-row">
              <label class="${NS}-check" style="flex:1;justify-content:space-between;">
                <span>Max clients</span>
                <input id="${NS}-maxClients" type="number" min="1" max="24" step="1" style="width:90px" />
              </label>
              <label class="${NS}-check"><input id="${NS}-lockRoom" type="checkbox"> <span>Lock room (reject new)</span></label>
            </div>
            <div class="${NS}-row">
              <label class="${NS}-check"><input id="${NS}-autoSyncAll" type="checkbox" checked> <span>Auto soft sync to <b>all</b> on join</span></label>
              <label class="${NS}-check"><input id="${NS}-autoSaveOnJoin" type="checkbox"> <span>Also send FULL SAVE on join</span></label>
            </div>
            <div class="${NS}-row" style="opacity:.9">
              Periodic soft sync: <b>every 10s</b> · Forced full sync: <b>every 30s</b>
            </div>
            <div class="${NS}-row">
              <label class="${NS}-check"><input id="${NS}-autoFull30" type="checkbox" checked> <span>Force Full Sync every 30s</span></label>
              <label class="${NS}-check"><input id="${NS}-forceHybrid" type="checkbox"> <span>Use Hybrid Full (no ImportSave)</span></label>
            </div>
            <div class="${NS}-row">
              <button id="${NS}-syncAllNow" class="btn btn-ghost">Soft Sync All Now</button>
              <button id="${NS}-saveAll" class="btn btn-primary">Full Save Re-sync</button>
            </div>
          </div>

          <div class="${NS}-sec" data-title="Visuals">
            <div class="${NS}-row">
              <label class="${NS}-check"><input id="${NS}-t-cursors" type="checkbox"> <span>Show mouse cursors (everyone)</span></label>
            </div>
            <div class="${NS}-row">
              <button id="${NS}-spawnGolden" class="btn btn-ok">Spawn Golden</button>
              <button id="${NS}-spawnReindeer" class="btn btn-ok">Spawn Reindeer</button>
            </div>
          </div>

          <div class="${NS}-sec" data-title="Anti-cheat">
            <div class="${NS}-row">
              <label class="${NS}-check"><input id="${NS}-ac-enf" type="checkbox" checked> <span>Enforce anti-DevTools on clients</span></label>
              <label class="${NS}-check"><input id="${NS}-ac-ban" type="checkbox" checked> <span>Auto-ban on detection</span></label>
              <label class="${NS}-check" style="flex:1;justify-content:space-between;">
                <span>Grace (s)</span>
                <input id="${NS}-ac-grace" type="number" min="0" max="60" step="1" style="width:90px" />
              </label>
            </div>
          </div>
        </div>

        <!-- Permissions -->
        <div class="${NS}-tab ${NS}-hostOnly" id="${NS}-tab-perms" role="tabpanel" data-active="0">
          <div class="${NS}-sec" data-title="Client permissions">
            <div class="${NS}-row">
              <label class="${NS}-check"><input id="${NS}-perm-clicks" type="checkbox" checked> <span>Allow client cookie clicks</span></label>
              <label class="${NS}-check"><input id="${NS}-perm-buyBld" type="checkbox" checked> <span>Allow client building buys</span></label>
            </div>
            <div class="${NS}-row">
              <label class="${NS}-check"><input id="${NS}-perm-buyUpg" type="checkbox" checked> <span>Allow client upgrade buys</span></label>
              <label class="${NS}-check"><input id="${NS}-perm-shim" type="checkbox" checked> <span>Allow golden/reindeer clicks</span></label>
            </div>
            <div class="${NS}-row">
              <label class="${NS}-check"><input id="${NS}-perm-mini" type="checkbox" checked> <span>Allow client <b>minigame</b> actions</span></label>
              <label class="${NS}-check"><input id="${NS}-perm-lumps" type="checkbox" checked> <span>Allow client sugar lump harvest / level-up</span></label>
            </div>
            <div class="${NS}-row">
              <label class="${NS}-check"><input id="${NS}-perm-log" type="checkbox"> <span>Verbose log</span></label>
            </div>
          </div>
        </div>

        <!-- Peers -->
        <div class="${NS}-tab ${NS}-hostOnly" id="${NS}-tab-peers" role="tabpanel" data-active="0">
          <div class="${NS}-sec" data-title="Peers (kick/ban/admin)">
            <div id="${NS}-peerList"></div>
          </div>
        </div>

        <!-- Chat -->
        <div class="${NS}-tab" id="${NS}-tab-chat" role="tabpanel" data-active="0">
          <div class="${NS}-sec" data-title="Room chat">
            <div id="${NS}-chatList" aria-live="polite"></div>
            <div id="${NS}-typing" aria-live="polite"></div>
            <div class="${NS}-row" style="margin-top:8px">
              <input id="${NS}-chatInput" type="text" placeholder="Type a message… (Enter to send, Shift+Enter = newline)" />
              <button id="${NS}-chatSend" class="btn btn-primary btn-slim">Send</button>
            </div>
            <div class="${NS}-row" style="margin-top:-6px">
              <label class="${NS}-check"><input id="${NS}-nf-chat" type="checkbox"> <span>Show chat pop-ups</span></label>
            </div>
          </div>
        </div>

        <!-- Voice -->
        <div class="${NS}-tab" id="${NS}-tab-voice" role="tabpanel" data-active="0">
          <div class="${NS}-sec" data-title="Voice controls">
            <div class="${NS}-row">
              <button id="${NS}-v-enable" class="btn btn-primary">Enable Mic</button>
              <button id="${NS}-v-mute" class="btn btn-ghost">Mute</button>
              <button id="${NS}-v-deafen" class="btn btn-ghost">Deafen</button>
              <label class="${NS}-check"><input id="${NS}-v-ptt" type="checkbox"> <span>Push-To-Talk (hold <b>V</b>)</span></label>
            </div>
            <div class="${NS}-row">
              <select id="${NS}-v-input"></select>
              <button id="${NS}-v-refresh" class="btn btn-ghost btn-slim">Refresh devices</button>
              <label class="${NS}-check" style="max-width:260px;"><span>Volume</span><input id="${NS}-v-vol" type="range" min="0" max="1" step="0.01" value="1"></label>
            </div>
          </div>
          <div class="${NS}-sec" data-title="Voice peers (green = speaking)">
            <div id="${NS}-voicePeers"></div>
          </div>
        </div>

        <!-- Notifications -->
        <div class="${NS}-tab" id="${NS}-tab-notify" role="tabpanel" data-active="0">
          <div class="${NS}-sec" data-title="Choose notifications">
            <div class="${NS}-row">
              <label class="${NS}-check"><input id="${NS}-nf-joins" type="checkbox" checked> <span>Show join / leave</span></label>
              <label class="${NS}-check"><input id="${NS}-nf-buys" type="checkbox" checked> <span>Show purchases</span></label>
            </div>
            <div class="${NS}-row">
              <label class="${NS}-check"><input id="${NS}-nf-shims" type="checkbox" checked> <span>Show golden/wrath/reindeer clicks</span></label>
              <label class="${NS}-check"><input id="${NS}-nf-sound" type="checkbox"> <span>Play ping sound</span></label>
            </div>
            <div class="${NS}-row">
              <label class="${NS}-check"><input id="${NS}-nf-chat2" type="checkbox"> <span>Show chat pop-ups (same as in Chat tab)</span></label>
            </div>
          </div>
        </div>

        <!-- About -->
        <div class="${NS}-tab" id="${NS}-tab-about" role="tabpanel" data-active="0">
          <div class="${NS}-sec" data-title="Info">
            <div><b>CCMP</b> v1.0.2 — Owner: kittenasy12. Owner cannot be kicked/banned, can bypass room limits, can issue <b>Global Bans</b>. Voice chat uses WebRTC via PeerJS.</div>
            <div style="font-size:12px;color:#9ca3af;margin-top:6px;">Your ID: <code id="${NS}-aboutPid">${shortId(PLAYER_ID)}</code></div>
          </div>
        </div>
      </div>
    </div>

    <div id="${NS}-roster">
      <div class="${NS}-roCard">
        <div class="${NS}-roHead"><div>Players</div><div class="${NS}-pillSmall" id="${NS}-roCount">0</div></div>
        <div id="${NS}-roList"></div>
      </div>
    </div>

    <div id="${NS}-toasts" aria-live="polite" aria-atomic="false"></div>
    <div id="${NS}-cursors"></div>
  `;
  const style=document.createElement('style');style.textContent=css;document.head.appendChild(style);
  const wrap=document.createElement('div');wrap.innerHTML=html;document.body.appendChild(wrap);

  function enhanceSections(){
    const secs=[...document.querySelectorAll(`#${NS}-panel .${NS}-sec`)];
    secs.forEach(sec=>{
      if(sec.__enhanced) return;
      const kids=[...sec.children];
      const title=(sec.getAttribute('data-title')||'Section');
      const head=document.createElement('div'); head.className=`${NS}-secHead`;
      const ttl=document.createElement('div'); ttl.className='ttl'; ttl.textContent=title;
      const arrow=document.createElement('div'); arrow.className='arrow'; arrow.textContent='▸';
      head.appendChild(ttl); head.appendChild(arrow);
      const body=document.createElement('div'); body.className=`${NS}-secBody`;
      kids.forEach(ch=>body.appendChild(ch));
      sec.innerHTML=''; sec.appendChild(head); sec.appendChild(body);
      sec.setAttribute('data-collapsed','0');
      head.addEventListener('click',()=>{ const c=sec.getAttribute('data-collapsed')==='1'?'0':'1'; sec.setAttribute('data-collapsed',c); });
      sec.__enhanced=true;
    });
  }
  const TAB_KEYS=['connect','host','perms','peers','chat','voice','notify','about'];
  function switchTab(name){ TAB_KEYS.forEach(k=>{ const b=document.getElementById(`${NS}-tabbtn-${k}`), t=document.getElementById(`${NS}-tab-${k}`); if(b) b.setAttribute('aria-selected', String(k===name)); if(t) t.setAttribute('data-active', k===name? '1':'0'); }); enhanceSections(); }
  TAB_KEYS.forEach(k=>{ document.getElementById(`${NS}-tabbtn-${k}`)?.addEventListener('click',()=>switchTab(k)); });
  switchTab('connect');

  const el=(id)=>document.getElementById(id);
  function setStatus(m){ const n=el(`${NS}-status`); if(n) n.textContent=m; }
  function setPeers(list){ const n=el(`${NS}-peers`); if(n) n.textContent=(list&&list.length)?('Peers: '+list.join(', ')):'No peers connected.'; }
  let audioCtx=null; function beep(){ try{ audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)(); const o=audioCtx.createOscillator(), g=audioCtx.createGain(); o.type='sine'; o.frequency.value=1180; g.gain.value=0.035; o.connect(g); g.connect(audioCtx.destination); o.start(); setTimeout(()=>o.stop(),120);}catch(e){} }
  const KEY_NF_J=`${NS}:nf:joins`, KEY_NF_B=`${NS}:nf:buys`, KEY_NF_S=`${NS}:nf:shims`, KEY_NF_A=`${NS}:nf:sound`, KEY_NF_C=`${NS}:nf:chat`;
  let nfJoins = LS(KEY_NF_J); if(nfJoins==null) nfJoins=true;
  let nfBuys  = LS(KEY_NF_B); if(nfBuys==null) nfBuys=true;
  let nfShims = LS(KEY_NF_S); if(nfShims==null) nfShims=true;
  let nfSound = !!LS(KEY_NF_A);
  let nfChat  = !!LS(KEY_NF_C);
  function notify(text, tone='info'){
    const box=el(`${NS}-toasts`); if(!box) return;
    const d=document.createElement('div'); d.className=`${NS}-toast ${tone==='ok'?'ok':''} ${tone==='warn'?'warn':''}`; d.setAttribute('role','status'); d.textContent=text;
    box.appendChild(d); while(box.childNodes.length>6){ box.removeChild(box.firstChild); }
    requestAnimationFrame(()=>d.classList.add('show'));
    setTimeout(()=>{ d.classList.remove('show'); setTimeout(()=>d.remove(), 220); }, 4200);
    if(nfSound) beep();
  }

  function setRoleUI(role){
    const p=el(`${NS}-panel`);
    if(p){
      p.classList.toggle(`${NS}-isHost`, role==='host');
      p.classList.toggle(`${NS}-isAdmin`, role!=='host' && (Admin.isAdmin || IS_OWNER));
    }
    const b=el(`${NS}-badge`);
    if(b){
      b.textContent = IS_OWNER ? 'owner' : (role==='host' ? 'host' : (Admin.isAdmin ? 'admin' : 'client'));
    }
  }

  const isGameReady=()=>!!(window.Game && Game.ObjectsById && Game.UpgradesById && Game.AchievementsById);
  const waitForGameReady=(t=15000)=>new Promise((resolve)=>{ const t0=Date.now(); (function loop(){ if(isGameReady() || Date.now()-t0>t){ resolve(); return; } setTimeout(loop, 60); })(); });

  const DEF={ host:'0.peerjs.com', port:443, path:'/', tls:true, keepAlive:true, iceServers:['stun:stun.l.google.com:19302','stun:stun1.l.google.com:19302'] };
  const KEY_CFG=`${NS}:cfg`; const cfg=Object.assign({},DEF,LS(KEY_CFG)||{});
  const readForm=()=>LS(KEY_CFG,cfg);
  const PEERJS_URL='https://unpkg.com/peerjs@1.5.5/dist/peerjs.min.js';
  const loadPeerJS=()=>new Promise((res,rej)=>{ if(window.Peer) return res(); const s=document.createElement('script'); s.src=PEERJS_URL; s.onload=()=>res(); s.onerror=rej; document.head.appendChild(s); });

  const KEY_MAX=`${NS}:maxClients`, KEY_LOCK=`${NS}:lockRoom`, KEY_ASYNC=`${NS}:autoSyncAll`, KEY_ASAVE=`${NS}:autoSaveOnJoin`, KEY_AFULL30=`${NS}:autoFull30`, KEY_FHYB=`${NS}:forceHybrid`;
  let maxClients = LS(KEY_MAX); if(typeof maxClients!=='number' || !isFinite(maxClients) || maxClients<1) maxClients=8;
  let lockRoom = !!LS(KEY_LOCK);
  let autoSyncAllOnJoin = LS(KEY_ASYNC); if(autoSyncAllOnJoin==null) autoSyncAllOnJoin=true;
  let autoSaveOnJoin = LS(KEY_ASAVE); if(autoSaveOnJoin==null) autoSaveOnJoin=false;
  let autoFull30 = LS(KEY_AFULL30); if(autoFull30==null) autoFull30=true;
  let forceHybrid = !!LS(KEY_FHYB);

  const Admin={ set:new Set(), isAdmin:false,
    key(room){ return `${NS}:admins:${room||'default'}`; },
    load(room){ const arr=LS(this.key(room))||[]; this.set=new Set(Array.isArray(arr)?arr:[]); },
    save(room){ LS(this.key(room), Array.from(this.set)); },
  };

  const getBakeryName=()=> String(safe(()=>Game.bakeryName) || '');
  function applyBakeryName(name){
    if(!window.Game || typeof name!=='string') return;
    try{ Game.bakeryName=name; if(Game.bakeryNameL) Game.bakeryNameL.textContent=name; safe(()=>Game.UpdateMenu&&Game.UpdateMenu()); safe(()=>Game.Draw&&Game.Draw()); }catch(e){}
  }
  let lastBakerySent='';

  const KEY_SPEC_WRK=`${NS}:spec:wrink`, KEY_SPEC_PRE=`${NS}:spec:prestige`;
  let optSpecWrk = LS(KEY_SPEC_WRK); if(optSpecWrk==null) optSpecWrk=true;
  let optSpecPre = !!LS(KEY_SPEC_PRE);

  const getSaveSafe=()=>{ try{ if(typeof Game?.WriteSave==='function') return Game.WriteSave(1); }catch(e){} try{ for(const k of Object.keys(localStorage)) if(/CookieClicker.*Save/i.test(k)) return localStorage.getItem(k); }catch(e){} return ''; };
  function importSaveSafe(save){
    if(!save) return false;
    try{
      if(typeof Game?.ImportSaveCode==='function'){ Game.ImportSaveCode(save); }
      else if(typeof Game?.ImportSave==='function'){ Game.ImportSave(save); }
      else if(typeof Game?.LoadSave==='function'){ Game.LoadSave(save); }
      else { for(const k of Object.keys(localStorage)) if(/CookieClicker.*Save/i.test(k)){ localStorage.setItem(k,save); location.reload(); return true; } }
    }catch(e){}
    return true;
  }
  const hashStr=(s)=>{ let h=5381; for(let i=0;i<s.length;i++){ h=((h<<5)+h) + s.charCodeAt(i); h|=0; } return String(h>>>0); };

  function deepRefreshUI(){
    for(let i=0;i<2;i++){
      safe(()=>typeof Game.CalculateGains==='function' && Game.CalculateGains());
      safe(()=>typeof Game.recalculateGains==='function' && Game.recalculateGains());
      safe(()=>typeof Game.RebuildUpgrades==='function' && Game.RebuildUpgrades());
      safe(()=>typeof Game.RebuildStore==='function' && Game.RebuildStore());
      safe(()=>typeof Game.RefreshStore==='function' && Game.RefreshStore());
      safe(()=>typeof Game.Draw==='function' && Game.Draw());
    }
    if(window.Game){ Game.storeToRefresh=1; Game.upgradesToRebuild=1; }
  }

  function eachList(list, fn){
    if(!list) return;
    if(Array.isArray(list)){ for(let i=0;i<list.length;i++) fn(list[i], i); }
    else if(typeof list==='object'){ const keys=Object.keys(list).sort((a,b)=>(+a)-(+b)); for(const k of keys){ const i=+k; fn(list[k], i); } }
  }
  const mapList=(list, fn)=>{ const out=[]; eachList(list,(item,i)=>{ out[i]=fn(item,i); }); return out; };

  function captureBuffs(){
    const out=[]; const buffs=safe(()=>Game.buffs)||{};
    for(const k in buffs){ const b=buffs[k]; if(!b) continue;
      const name=String(b.name||k), time=Math.max(0, Math.floor(+b.time||0)), mtime=Math.max(time, Math.floor(+b.maxTime||+b.time||0));
      const pow=('pow' in b)? b.pow : (('power' in b)? b.power : (('mult' in b)? b.mult : 1));
      const arg=('arg' in b)? b.arg : null;
      out.push({n:name, t:time, m:mtime, p:pow, a:arg});
    }
    return {fps: (safe(()=>Game.fps)||30), items: out};
  }
  function applyBuffs(bstate){
    if(!bstate || !Array.isArray(bstate.items)) return;
    const hostFps=Math.max(1, +bstate.fps||30), myFps=Math.max(1, (safe(()=>Game.fps)||30));
    const items=bstate.items; const wantNames=new Set(items.map(it=>String(it.n)));
    const cur=safe(()=>Game.buffs)||{}; for(const k in cur){ const b=cur[k]; const name=String(b?.name||k); if(!wantNames.has(name)){ try{ b.time=1; }catch(e){} } }
    items.forEach(it=>{
      const name=String(it.n); const secs=Math.max(1, Math.round((+it.t||0)/hostFps));
      let b=(safe(()=>Game.hasBuff) && Game.hasBuff(name)) || (safe(()=>Game.buffs)&&Game.buffs[name]);
      if(!b){ try{ if(typeof Game.gainBuff==='function'){ b=Game.gainBuff(name, secs, it.p, it.a); } }catch(e){} if(!b){ try{ b=Game.gainBuff(name, secs, it.p); }catch(e){} } if(!b){ try{ b=Game.gainBuff(name, secs); }catch(e){} } }
      if(b){ try{
        b.time=Math.max(1, Math.round(secs*myFps));
        const maxFrames=Math.max(b.time, Math.round((+it.m||+it.t||0)/hostFps*myFps)); if(Number.isFinite(maxFrames)) b.maxTime=maxFrames;
        if('p' in it){ if('pow' in b) b.pow=it.p; if('power' in b) b.power=it.p; if('mult' in b) b.mult=it.p; if('multCpS' in b) b.multCpS=it.p; if('multClick' in b) b.multClick=it.p; }
        if('a' in it && it.a!=null) b.arg = it.a;
      }catch(e){} }
    });
    safe(()=>Game.recalculateGains&&Game.recalculateGains()); safe(()=>Game.Draw&&Game.Draw());
  }

  function captureLumps(){ return { n: Math.max(0, +safe(()=>Game.lumps)||0), t: +safe(()=>Game.lumpT)||0, type: (safe(()=>Game.lumpCurrentType)!=null ? +Game.lumpCurrentType : null) }; }
  function applyLumps(L){
    if(!L || !window.Game) return;
    try{
      if(typeof L.n==='number') Game.lumps = Math.max(0, L.n|0);
      if(typeof L.t==='number') Game.lumpT = +L.t;
      if(L.type!=null && typeof Game.lumpCurrentType!=='undefined') Game.lumpCurrentType = +L.type;
      if(Game.recalculateGains) Game.recalculateGains();
      if(Game.Draw) Game.Draw();
    }catch(e){}
  }

  function captureSpecials(opts){
    const o={};
    if(opts?.wrink){
      const ws=safe(()=>Game.wrinklers)||[]; o.wrinklers=[];
      for(let i=0;i<ws.length;i++){ const w=ws[i]; if(!w) continue;
        if((w.phase|0)>0){ o.wrinklers.push({t: (w.type|0)||0, s: Math.max(0, +w.sucked||0)}); }
      }
    }
    if(opts?.prestige){
      o.prestige = +safe(()=>Game.prestige)||0;
      o.heavenlyChips = +safe(()=>Game.heavenlyChips)||0;
    }
    return o;
  }
  function applySpecials(s, opts){
    if(!s || !window.Game) return;
    try{
      if(opts?.wrink){
        const ws = safe(()=>Game.wrinklers)||[];
        const want = Array.isArray(s.wrinklers)? s.wrinklers.length : 0;
        function spawn(){ try{ if(typeof Game.SpawnWrinkler==='function') Game.SpawnWrinkler(); else if(Game.wrinklers) Game.wrinklers.push({}); }catch(e){} }
        while((ws.filter(w=>w&&w.phase>0).length) < want && (ws.length<12)){ spawn(); }
        let idx=0;
        for(let i=0;i<ws.length && idx<want;i++){
          const w=ws[i]; if(!w) continue; if((w.phase|0)===0) continue;
          const src=s.wrinklers[idx++]; w.type = (src.t|0)||0; w.sucked = Math.max(0, +src.s||0);
        }
      }
      if(opts?.prestige){
        if(typeof s.prestige==='number'){ Game.prestige = Math.max(Game.prestige|0, s.prestige|0); }
        if(typeof s.heavenlyChips==='number'){ Game.heavenlyChips = Math.max(+Game.heavenlyChips||0, +s.heavenlyChips||0); }
      }
      safe(()=>Game.recalculateGains&&Game.recalculateGains());
      safe(()=>Game.RefreshStore&&Game.RefreshStore());
      safe(()=>Game.Draw&&Game.Draw());
    }catch(e){}
  }

  function captureMiniSaves(){ const out=[]; eachList(safe(()=>Game.ObjectsById)||[], (o,i)=>{ const mg=o && o.minigame; if(mg && typeof mg.save==='function'){ let s=''; try{ s=mg.save(); }catch(e){} if(s) out.push({i, s}); } }); return out; }
  function applyMiniSaves(list){
    if(!Array.isArray(list)) return;
    list.forEach(it=>{ try{ const obj = Game?.ObjectsById?.[it.i]; const mg=obj && obj.minigame; if(mg && typeof mg.load==='function'){ mg.load(it.s); } }catch(e){} });
    deepRefreshUI();
  }

  function captureState(opts){
    const withCookies=!!(opts?.cookies ?? true), withBuildings=!!(opts?.buildings ?? true), withUpg=!!(opts?.upgrades ?? true), withAch=!!(opts?.achievements ?? true), withBuffs=!!(opts?.buffs ?? false), withLumps=!!(opts?.lumps ?? true), withSpecs=!!(opts?.specs ?? false), specOpts=opts?.specOpts||{};
    const o={ v:'14', gameVersion:String(safe(()=>Game.version)||''), ts:Date.now(),
      flags:{cookies:withCookies,buildings:withBuildings,upgrades:withUpg,achievements:withAch,buffs:withBuffs,lumps:withLumps,specials:withSpecs} };
    o.name=getBakeryName();
    o.anti=hostPolicy();
    if(withCookies){
      o.cookies = +safe(()=>Game.cookies)||0;
      o.cookiesPs = +safe(()=>Game.cookiesPs)||0;
    }
    if(withBuildings) o.buildings = mapList(safe(()=>Game.ObjectsById)||[], (x)=> (x && x.amount|0) );
    if(withUpg) o.upgrades = mapList(safe(()=>Game.UpgradesById)||[], (u)=> (u && u.bought?1:0) );
    if(withAch) o.achievements = mapList(safe(()=>Game.AchievementsById)||[], (a)=> (a && a.won?1:0) );
    if(withBuffs) o.buffs=captureBuffs();
    if(withLumps) o.lumps=captureLumps();
    if(withSpecs) o.specials=captureSpecials(specOpts);
    return o;
  }
  const fullStateNow=()=> captureState({
    cookies:true,buildings:true,upgrades:true,achievements:true,buffs:true,lumps:true,
    specs:(optSpecWrk||optSpecPre), specOpts:{ wrink:optSpecWrk, prestige:optSpecPre }
  });
  const liteStateOf=(st)=>({ ts: st.ts, name: st.name, cookies: st.cookies, cookiesPs: st.cookiesPs });

  function applyCookiesSmart(baseCookies, cps, ts){
    if(!window.Game) return;
    const now=Date.now(); const dt=Math.max(0,(now-(+ts||now))/1000);
    const target = (+baseCookies||0) + Math.max(0,(+cps||0))*dt;
    Game.cookies = target;
  }
  function forceSetBuildings(arr){ if(!window.Game || !arr) return; let owned=0; eachList(Game.ObjectsById,(o,i)=>{ const amt=Math.max(0,(arr[i]|0)); if(o){ o.amount=amt; o.bought=amt; o.free=0; } owned+=amt; }); Game.BuildingsOwned=owned|0; }
  function grantUpgrades(bits){ if(!window.Game || !bits) return; eachList(Game.UpgradesById,(u,i)=>{ if(u && bits[i] && !u.bought){ if(typeof u.earn==='function') safe(()=>u.earn()); else if(typeof u.buy==='function') safe(()=>u.buy()); } }); }
  function grantAchievements(bits){ if(!window.Game || !bits) return; eachList(Game.AchievementsById,(a,i)=>{ if(a && bits[i] && !a.won && typeof Game.Win==='function') safe(()=>Game.Win(a.name)); }); }

  const Shim={ known:new Map(), cMap:new Map() };
  function mkSid(){ return 'S'+(Date.now()%1e9).toString(36)+rid(3); }
  function currentShimmerSet(){
    const cur=new Set(); const arr=safe(()=>Game.shimmers)||[];
    for(let i=0;i<arr.length;i++){ const s=arr[i]; if(!s) continue; if(!s.__ccmpSid){ s.__ccmpSid=mkSid(); }
      cur.add(s.__ccmpSid); Net.broadcast({type:'shimSpawn', sid:s.__ccmpSid, kind:String(s.type||'golden'), x:Math.floor(s.x||0), y:Math.floor(s.y||0)}); }
    for(const sid of Array.from(Shim.known.keys())){ if(!cur.has(sid)){ Shim.known.delete(sid); Net.broadcast({type:'shimGone', sid}); } }
    Shim.known.clear(); cur.forEach(k=>Shim.known.set(k,true));
  }
  const hostSpawnGolden=()=>safe(()=>new Game.shimmer('golden'));
  const hostSpawnReindeer=()=>safe(()=>new Game.shimmer('reindeer'));
  function clientSpawnShim(msg){
    const sid=msg.sid; if(Shim.cMap.has(sid)) return;
    const s = safe(()=>new Game.shimmer(msg.kind||'golden')); if(!s) return;
    s.__ccmpSid=sid; if(typeof msg.x==='number') s.x=msg.x; if(typeof msg.y==='number') s.y=msg.y; s.forcePos=1;
    const allowShim=!!(el(`${NS}-perm-shim`)?.checked);
    const orig=s.pop; s.pop=function(){ if(Net.role==='client'){ if(allowShim){ Net.sendToHost({type:'shimClick', sid}); } removeClientShim(sid); return; } return orig.apply(this,arguments); };
    Shim.cMap.set(sid,s);
  }
  function hostPopShimBySid(sid){
    const arr=safe(()=>Game.shimmers)||[];
    for(let i=0;i<arr.length;i++){
      const s=arr[i]; if(s && s.__ccmpSid===sid){
        try{ s.pop(); }catch(e){}
        return true;
      }
    }
    return false;
  }
  function removeClientShim(sid){
    const s=Shim.cMap.get(sid);
    if(s){ if(typeof s.die==='function'){ safe(()=>s.die()); } safe(()=>s.l && s.l.parentNode && s.l.parentNode.removeChild(s.l));
      const arr=safe(()=>Game.shimmers)||[]; const idx=arr.indexOf(s); if(idx>=0) arr.splice(idx,1); Shim.cMap.delete(sid);
    }else{ const arr=safe(()=>Game.shimmers)||[]; for(let i=arr.length-1;i>=0;i--){ if(arr[i]?.__ccmpSid===sid){ const t=arr[i]; if(typeof t.die==='function'){ safe(()=>t.die()); } safe(()=>t.l && t.l.parentNode && t.l.parentNode.removeChild(t.l)); arr.splice(i,1);} } }
    safe(()=>Game.Draw && Game.Draw());
  }

  let lastRoster=[];
  const nameFor=(pid)=> (Net.role==='host' ? (Names.get(pid)||'') : ((lastRoster.find(x=>x.id===pid)||{}).name||''));
  const labelFromPid=(pid)=>{ const nm=nameFor(pid); return nm ? `${nm} (${shortId(pid)})` : shortId(pid); };
  function onEvt(pkt){
    const who = pkt.pid ? labelFromPid(pkt.pid) : '';
    if(pkt.kind==='join'){ if(nfJoins) notify(`${who} joined`, 'ok'); }
    else if(pkt.kind==='leave'){ if(nfJoins) notify(`${who} left`, 'warn'); }
    else if(pkt.kind==='buyBld'){ if(nfBuys) notify(`${who} bought ${pkt.name||('Building '+pkt.id)}`,'ok'); }
    else if(pkt.kind==='buyUpg'){ if(nfBuys) notify(`${who} bought upgrade ${pkt.name||('Upgrade '+pkt.id)}`,'ok'); }
    else if(pkt.kind==='shimPop'){ if(nfShims) notify(`${who} clicked ${pkt.shim||'golden'} cookie`,'ok'); }
    else if(pkt.kind==='bakeryName'){ notify(`Host renamed bakery to “${pkt.name||''}”`,'ok'); }
  }

  function buildRoster(){
    const roleFor=(pid, defRole)=> (isOwnerPid(pid) ? 'owner' : (Admin.set.has(pid)?'admin':defRole));
    const arr=[{id:PLAYER_ID, role: roleFor(PLAYER_ID,'host'), name: Names.get(PLAYER_ID)||Names.sanitize(LS(DNAME_KEY)||DEFAULT_DNAME), call: (Net.peer && Net.peer.id)||''}];
    Net.conns.forEach(c=>{ if(c._pid){ arr.push({id:c._pid, role: roleFor(c._pid,'client'), name: Names.get(c._pid)||'', call: (c.peer||'')}); } });
    return arr;
  }
  function renderRoster(list){
    const box=el(`${NS}-roList`), cnt=el(`${NS}-roCount`); if(!box||!cnt) return;
    const arr=Array.isArray(list)?list:[]; box.innerHTML=''; cnt.textContent=String(arr.length);
    arr.forEach(it=>{
      const role=it.role||'client';
      const row=document.createElement('div');
      const dot=document.createElement('span'); dot.className=`${NS}-dot ${role==='owner'?'owner':(role==='host'?'host':(role==='admin'?'admin':'client'))}`; dot.style.marginRight='6px';
      const prefix = role==='owner' ? 'Owner ' : (role==='host' ? 'Host ' : (role==='admin' ? 'Admin ' : ''));
      const tx=document.createElement('span'); tx.textContent= prefix + (it.name?`${it.name} (${shortId(it.id)})`:shortId(it.id));
      row.appendChild(dot); row.appendChild(tx); box.appendChild(row);
    });
  }

  const KEY_AC_ENF=`${NS}:ac:enf`, KEY_AC_BAN=`${NS}:ac:ban`, KEY_AC_GRACE=`${NS}:ac:grace`;
  let acEnforceClients = LS(KEY_AC_ENF); if(acEnforceClients==null) acEnforceClients=true;
  let acBan = LS(KEY_AC_BAN); if(acBan==null) acBan=true;
  let acGrace = LS(KEY_AC_GRACE); if(typeof acGrace!=='number' || !isFinite(acGrace)) acGrace=5;

  const ANTI={ policy:{enforce:true,ban:true,grace:5}, connectedAt:0, timer:null,
    isOpen(){ const t=160; return !!(((window.outerWidth - window.innerWidth) > t) || ((window.outerHeight - window.innerHeight) > t)); },
    start(){ if(this.timer) return; this.timer=setInterval(()=>{ if(Net.role==='client' && this.policy.enforce){ const armed=this.connectedAt && (Date.now()-this.connectedAt>(this.policy.grace*1000)); if(this.isOpen() && armed){ try{ Net.sendToHost({type:'cheat', reason:'devtools', wantBan: !!this.policy.ban}); }catch(e){} notify('DevTools detected — removing CC-MP','warn'); try{ window.CCMP.destroy(); }catch(e){} } } }, 700); },
    stop(){ if(this.timer){ clearInterval(this.timer); this.timer=null; } },
    setPolicy(p){ if(!p) return; this.policy={enforce:!!p.enforce, ban:!!p.ban, grace:Math.max(0,p.grace|0)}; }
  };
  const hostPolicy=()=> ({ enforce: !!acEnforceClients, ban: !!acBan, grace: Math.max(0, Math.round(acGrace||0)) });

  const MINI_METHODS=['castSpell','clickTile','plant','harvest','harvestAll','buy','sell','buyGood','sellGood','assign','swap','dragOnSlot','slot','choose','use','refill','click'];
  let minigameSaveTimer=null;
  function jsonifyArg(v, depth=0){
    if(depth>2) return null;
    if(v==null) return null;
    const t=typeof v;
    if(t==='number' || t==='string' || t==='boolean') return v;
    if(Array.isArray(v)) return v.slice(0,6).map(x=>jsonifyArg(x,depth+1));
    if(t==='object'){
      const out={}; let n=0;
      for(const k in v){ if(n>8) break; const val=v[k]; const tv=typeof val;
        if(tv==='number' || tv==='string' || tv==='boolean'){ out[k]=val; n++; }
      }
      return out;
    }
    return null;
  }
  function ensureMiniggameWrapOn(obj, idx, isClientSide){
    const mg = obj && obj.minigame;
    if(!mg || mg.__ccmp_wrapped) return;
    MINI_METHODS.forEach(fn=>{
      if(typeof mg[fn]==='function' && !mg[`__ccmp_wrap_${fn}`]){
        const orig = mg[fn];
        mg[fn] = function(){
          if(Net.role==='client' && isClientSide){
            const allowMini = !!(el(`${NS}-perm-mini`)?.checked);
            if(allowMini){ const args=Array.prototype.slice.call(arguments,0,6).map(a=>jsonifyArg(a)); Net.sendToHost({type:'miniRpc', bld:idx, fn, args}); }
            return;
          }
          const r=orig.apply(this,arguments);
          minigameDirty(); scheduleBroadcast();
          return r;
        };
        mg[`__ccmp_wrap_${fn}`]=true;
      }
    });
    mg.__ccmp_wrapped=true;
  }
  function ensureMinigameHooks(isClientSide){
    if(!window.Game || !Game.ObjectsById) return;
    eachList(Game.ObjectsById,(obj,idx)=>ensureMiniggameWrapOn(obj,idx,isClientSide));
  }
  function minigameDirty(){ if(minigameSaveTimer) return; minigameSaveTimer=setTimeout(()=>{ minigameSaveTimer=null; broadcastMiniSaves(); }, 300); }

  const BUFFER_HIGH=400000;
  function connBuffered(c){ try{ return (c._dc && c._dc.bufferedAmount) || (c.dc && c.dc.bufferedAmount) || 0; }catch(e){ return 0; } }

  const Net={ role:'idle', peer:null, conns:[], room:null, banned:new Set(),
    peersList(){ return this.conns.map(c=>c._pid || c.peer).filter(Boolean); },
    broadcast(o){ const s=JSON.stringify(o); this.conns.forEach(c=>{ try{ c.send(s); }catch(e){} }); },
    broadcastAdaptive(stateObj){
      const heavy = JSON.stringify({type:'state', payload:stateObj});
      const lite  = JSON.stringify({type:'stateLite', payload:liteStateOf(stateObj)});
      this.conns.forEach(c=>{
        try{
          const b=connBuffered(c);
          if(b>BUFFER_HIGH) c.send(lite);
          else c.send(heavy);
        }catch(e){}
      });
    },
    sendToHost(o){ const s=JSON.stringify(o); const c=this.conns[0]; if(c && c.open) try{ c.send(s); }catch(e){} },
    kick(pid){ if(isOwnerPid(pid)){ notify('Cannot kick owner','warn'); return; } const c=this.conns.find(x=>x._pid===pid || x.peer===pid); if(c){ try{c.close();}catch(e){} } renderPeers(); sendRoster(); },
    ban(pid){ if(isOwnerPid(pid)){ notify('Cannot ban owner','warn'); return; } this.banned.add(pid); this.kick(pid); setStatus('Banned '+shortId(pid)); },
    disconnect(){
      cleanupClientInputs(); try{ if(tick) clearInterval(tick); }catch(e){}
      try{ if(pingTick) clearInterval(pingTick); }catch(e){}
      try{ if(fullSyncTick) clearInterval(fullSyncTick); }catch(e){}
      try{ if(forceSaveTick) clearInterval(forceSaveTick); }catch(e){}
      try{ if(cursorSendTimer) cancelAnimationFrame(cursorSendTimer); }catch(e){}
      try{ if(shimmerScanTick) clearInterval(shimmerScanTick); }catch(e){}
      try{ ANTI.stop(); }catch(e){}
      Voice.destroy();
      tick=pingTick=fullSyncTick=forceSaveTick=null; cursorSendTimer=null; shimmerScanTick=null;
      this.conns.forEach(c=>{ try{c.close();}catch(e){} }); this.conns=[];
      if(this.peer){ try{this.peer.destroy();}catch(e){} this.peer=null; }
      this.role='idle'; this.room=null; setPeers([]); setStatus('Disconnected.'); setRoleUI('client'); renderPeers(); sendRoster();
      clearCursors();
    }
  };
  function createPeer(idOrNull){
    const primary={ host: cfg.host, port: cfg.port, secure: !!cfg.tls, path: cfg.path||'/', pingInterval: cfg.keepAlive?5000:0,
      config:{ iceServers:(cfg.iceServers||[]).map(u=>({urls:u})) } };
    const legacy={ host:'peerjs.com', port:443, secure:true, path:'/peerjs', pingInterval:5000,
      config:{ iceServers:[{urls:'stun:stun.l.google.com:19302'}] } };
    let peer=new Peer(idOrNull==null?undefined:idOrNull,primary); let settled=false;
    function swap(){ if(settled) return; try{peer.destroy();}catch(e){} peer=new Peer(idOrNull==null?undefined:idOrNull, legacy); }
    peer.once('error',swap); peer.once('open',()=>{ settled=true; }); return peer;
  }

  let lastKey=null, debounceTimer=null;
  function keyOf(st){
    const k={c:st.cookies, cps:st.cookiesPs, b:st.buildings, u:st.upgrades, a:st.achievements, n:st.name||'', L:st.lumps};
    if(st.buffs && st.buffs.items){ const fps=st.buffs.fps||30; k.f = st.buffs.items.map(x=>[x.n, Math.floor((x.t||0)/fps), x.p||0, (x.a==null?0:1)]); }
    const A=st.anti||{}; k.ap=[A.enforce?1:0,A.ban?1:0, A.grace|0];
    if(st.specials){ const s=st.specials; k.sp=[(Array.isArray(s.wrinklers)?s.wrinklers.length:0), s.prestige|0]; }
    return JSON.stringify(k);
  }
  function debouncedBroadcastNow(){ if(Net.role!=='host') return; const s=hostStateNow(); const k=keyOf(s); if(k===lastKey) return; lastKey=k; Net.broadcastAdaptive(s); }
  function scheduleBroadcast(){
    if(Net.role!=='host') return;
    if(debounceTimer) return;
    const congested = Net.conns.some(c=>connBuffered(c)>BUFFER_HIGH);
    const delay = congested ? 600 : 200;
    debounceTimer=setTimeout(()=>{ debounceTimer=null; debouncedBroadcastNow(); }, delay);
  }
  function hostStateNow(){
    const tc=el(`${NS}-t-cookies`), tb=el(`${NS}-t-buildings`), tu=el(`${NS}-t-upgrades`), ta=el(`${NS}-t-ach`), tf=el(`${NS}-t-buffs`), tl=el(`${NS}-t-lumps`);
    const specialsOn=(optSpecWrk||optSpecPre);
    return captureState({
      cookies: !!(tc&&tc.checked), buildings: !!(tb&&tb.checked), upgrades: !!(tu&&tu.checked), achievements: !!(ta&&ta.checked),
      buffs: !!(tf&&tf.checked), lumps: !!(tl&&tl.checked),
      specs: specialsOn, specOpts:{ wrink:optSpecWrk, prestige:optSpecPre }
    });
  }

  let tick=null, pingTick=null, fullSyncTick=null, forceSaveTick=null, shimmerScanTick=null;
  const PERIODIC_MS = 10000;
  const FORCE_SAVE_MS = 30000;
  function setupForceTick(){
    if(forceSaveTick) clearInterval(forceSaveTick);
    if(Net.role==='host' && autoFull30){
      forceSaveTick=setInterval(()=>{ if(forceHybrid){ broadcastHybrid(null,true); } else { broadcastFullSave(null,true); } }, FORCE_SAVE_MS);
    }
  }
  function startHostTicker(){
    if(tick) clearInterval(tick);
    tick=setInterval(()=>{
      if(Net.role!=='host') return;
      ensureHostPatches(); ensureMinigameHooks(false);
      const curName=getBakeryName();
      if(curName!==lastBakerySent){ lastBakerySent=curName; Net.broadcast({type:'bakery', n:curName}); Net.broadcast({type:'evt',kind:'bakeryName',name:curName,pid:PLAYER_ID}); }
      scheduleBroadcast();
      setStatus('Broadcasting to '+Net.peersList().length+' peer(s)…'); setPeers(Net.peersList().map(shortId));
    }, 350);

    if(shimmerScanTick) clearInterval(shimmerScanTick);
    shimmerScanTick=setInterval(()=>{ if(Net.role==='host') currentShimmerSet(); }, 1000);

    if(pingTick) clearInterval(pingTick);
    pingTick=setInterval(()=>{ if(Net.role!=='host') return; const now=Date.now(); Net.conns.forEach(c=>{ try{ c.__pingT=now; c.send(JSON.stringify({type:'ping', t:now})); }catch(e){} }); }, 5000);

    if(fullSyncTick) clearInterval(fullSyncTick);
    fullSyncTick=setInterval(()=>{
      if(Net.role!=='host' || Net.conns.length===0) return;
      syncAll();
      broadcastMiniSaves();
      broadcastUpgrades();
    }, PERIODIC_MS);

    setupForceTick();
  }

  function sendRoster(){ if(Net.role!=='host') return; const r=buildRoster(); Net.broadcast({type:'roster', list:r}); renderRoster(r); lastRoster=r; Voice.onRoster(r); }
  function renderPeers(){
    const box=el(`${NS}-peerList`); if(!box) return;
    const canControl = (Net.role==='host') || Admin.isAdmin || IS_OWNER;
    box.innerHTML='';
    if(!canControl){ box.innerHTML='<div style="font-size:12px;color:#9ca3af;">Host-only.</div>'; return; }

    const rows = (Net.role==='host')
      ? Net.conns.map(c=>({id:(c._pid||c.peer), role:(isOwnerPid(c._pid||c.peer)?'owner':(Admin.set.has(c._pid||c.peer)?'admin':'client'))}))
      : (lastRoster||[]).filter(x=>x.id && x.id!==PLAYER_ID).map(x=>({id:x.id, role:x.role||'client'}));

    if(rows.length===0){ box.innerHTML='<div style="font-size:12px;color:#9ca3af;">No connected peers.</div>'; return; }

    rows.forEach(({id,role})=>{
      const nm=nameFor(id)||'';
      const row=document.createElement('div'); row.className=NS+'-peerItem';
      const left=document.createElement('div'); left.textContent= nm ? `${nm} — ${shortId(id)}` : shortId(id);
      const tag=document.createElement('span'); tag.className=NS+'-roleTag'; tag.textContent=role; left.appendChild(tag);
      const btns=document.createElement('div'); btns.className=NS+'-peerBtns';

      const bAdmin=document.createElement('button'); bAdmin.textContent=(role==='admin'?'Revoke admin':'Grant admin'); bAdmin.className='btn btn-ghost btn-slim';
      bAdmin.addEventListener('click',()=>{
        if(Net.role==='host'){ if(Admin.set.has(id)) Admin.set.delete(id); else Admin.set.add(id); Admin.save(Net.room); renderPeers(); sendRoster(); broadcastRoles(); }
        else { Net.sendToHost({type:'adminAct', name:(role==='admin'?'revokeAdmin':'grantAdmin'), args:{pid:id}}); }
      });

      const bKick=document.createElement('button'); bKick.textContent='Kick'; bKick.className='btn btn-ghost btn-slim';
      bKick.addEventListener('click',()=>{ if(isOwnerPid(id)){ notify('Cannot kick owner','warn'); return; } if(Net.role==='host'){ Net.kick(id); } else { Net.sendToHost({type:'adminAct', name:'kick', args:{pid:id}}); } });

      const bBan=document.createElement('button'); bBan.textContent='Ban'; bBan.className='btn btn-danger btn-slim';
      bBan.addEventListener('click',()=>{ if(isOwnerPid(id)){ notify('Cannot ban owner','warn'); return; } if(Net.role==='host'){ Net.ban(id); } else { Net.sendToHost({type:'adminAct', name:'ban', args:{pid:id}}); } });

      if(IS_OWNER){
        const bGB=document.createElement('button'); bGB.textContent= GlobalBan.has(id)?'Un-Global Ban':'Global Ban'; bGB.className='btn btn-danger btn-slim';
        bGB.addEventListener('click',()=>{
          if(GlobalBan.has(id)){ GlobalBan.remove(id); notify('Removed from global ban','ok'); if(Net.role==='host'){ broadcastGbanPush(); } else { Net.sendToHost({type:'adminAct', name:'globalUnban', args:{pid:id}}); } }
          else { if(isOwnerPid(id)){ notify('Cannot global-ban owner','warn'); return; } GlobalBan.add(id); notify('Globally banned','warn'); if(Net.role==='host'){ Net.ban(id); broadcastGbanPush(); } else { Net.sendToHost({type:'adminAct', name:'globalBan', args:{pid:id}}); } }
          renderPeers();
        });
        btns.appendChild(bGB);
      }

      if(!isOwnerPid(id)) btns.appendChild(bAdmin);
      if(!isOwnerPid(id)) btns.appendChild(bKick);
      if(!isOwnerPid(id)) btns.appendChild(bBan);
      row.appendChild(left); row.appendChild(btns); box.appendChild(row);
    });
  }
  function broadcastRoles(){ if(Net.role!=='host') return; try { Net.broadcast({type:'roles', admins: Array.from(Admin.set)}); } catch(e){} }

  const Cursors={ on:false, els:new Map(), lastSeen:new Map() };
  function setCursorsOn(on){
    Cursors.on=!!on;
    if(!on){ clearCursors(); stopCursorSend(); }
    else { startCursorSend(); }
  }
  function clearCursors(){ const box=el(`${NS}-cursors`); if(box) box.innerHTML=''; Cursors.els.clear(); Cursors.lastSeen.clear(); }
  function renderCursor(pid, x01, y01){
    const box=el(`${NS}-cursors`); if(!box) return;
    const x=Math.round(x01*window.innerWidth), y=Math.round(y01*window.innerHeight);
    let d=Cursors.els.get(pid);
    if(!d){
      d=document.createElement('div'); d.className=`${NS}-cursor`;
      const dot=document.createElement('div'); dot.className='dot';
      const tag=document.createElement('div'); tag.className='tag'; tag.textContent=nameFor(pid) || shortId(pid);
      d.appendChild(dot); d.appendChild(tag); box.appendChild(d);
      Cursors.els.set(pid,d);
    }
    d.style.left=x+'px'; d.style.top=y+'px';
    Cursors.lastSeen.set(pid, Date.now());
  }
  let cursorSendTimer=null, lastMouse={x:0,y:0}, lastSent=0;
  function onMouseMove(e){
    lastMouse.x = Math.max(0, Math.min(1, e.clientX / window.innerWidth));
    lastMouse.y = Math.max(0, Math.min(1, e.clientY / window.innerHeight));
  }
  function loopSendCursor(){
    if(!Cursors.on || Net.role==='idle') return;
    const now=performance.now();
    if(now-lastSent>45){
      lastSent=now;
      const msg={type:'cursor', pid:PLAYER_ID, x:lastMouse.x, y:lastMouse.y};
      if(Net.role==='host'){ Net.broadcast(msg); renderCursor(PLAYER_ID, msg.x, msg.y); }
      else { Net.sendToHost(msg); renderCursor(PLAYER_ID, msg.x, msg.y); }
    }
    const cutoff=Date.now()-3000; for(const [pid,t] of Cursors.lastSeen){ if(t<cutoff){ const elp=Cursors.els.get(pid); if(elp){ elp.remove(); } Cursors.els.delete(pid); Cursors.lastSeen.delete(pid); } }
    cursorSendTimer=requestAnimationFrame(loopSendCursor);
  }
  function startCursorSend(){ window.addEventListener('mousemove', onMouseMove, true); if(!cursorSendTimer) cursorSendTimer=requestAnimationFrame(loopSendCursor); }
  function stopCursorSend(){ window.removeEventListener('mousemove', onMouseMove, true); if(cursorSendTimer){ cancelAnimationFrame(cursorSendTimer); cursorSendTimer=null; } }
  function broadcastCursorPolicy(){ if(Net.role!=='host') return; try{ Net.broadcast({type:'cursorPolicy', on: !!cursorsEnabled}); }catch(e){} }
  const KEY_CURSOR=`${NS}:vis:cursors`; let cursorsEnabled = !!LS(KEY_CURSOR);

  function captureUpgradesBits(){ return mapList(safe(()=>Game.UpgradesById)||[], (u)=> (u && u.bought?1:0) ); }
  function broadcastUpgrades(toConn){
    const bits=captureUpgradesBits();
    const msg={type:'upgBits', bits};
    if(toConn){ try{ toConn.send(JSON.stringify(msg)); }catch(e){} } else { Net.broadcast(msg); }
  }

  function syncAll(toConn){
    const st=fullStateNow();
    if(toConn){ try{ toConn.send(JSON.stringify({type:'state', payload:st, force:true})); }catch(e){} }
    else { Net.broadcastAdaptive(st); }
    broadcastMiniSaves(toConn||null);
    broadcastUpgrades(toConn||null);
    broadcastShimmerSnapshot(toConn||null);
  }
  function broadcastMiniSaves(toConn){
    if(!el(`${NS}-t-minisaves`)?.checked) return;
    const list=captureMiniSaves(); if(!list.length) return;
    const msg={type:'miniSaves', list};
    if(toConn){ try{ toConn.send(JSON.stringify(msg)); }catch(e){} } else{ Net.broadcast(msg); }
  }
  let lastSaveHashSent='';
  function broadcastFullSave(toConn, force){
    const code=getSaveSafe(); if(!code) return; const h=hashStr(code);
    if(!force){ if(h===lastSaveHashSent && !toConn) return; lastSaveHashSent=h; }
    const msg={type:'saveFull', code, h, force: !!force};
    if(toConn){ try{ toConn.send(JSON.stringify(msg)); }catch(e){} } else { Net.broadcast(msg); }
  }
  function broadcastHybrid(toConn, force){ const st=fullStateNow(); const msg={type:'state', payload:st, force:true};
    if(toConn){ try{ toConn.send(JSON.stringify(msg)); }catch(e){} } else{ Net.broadcastAdaptive(st); }
    broadcastMiniSaves(toConn||null); broadcastUpgrades(toConn||null); broadcastShimmerSnapshot(toConn||null);
  }

  const logv=(...a)=>{ const v=el(`${NS}-perm-log`); if(v && v.checked){ console.log('[CCMP]', ...a); } };

  function ensureHostPatches(){
    if(Net.role!=='host' || !window.Game) return;
    eachList(Game.ObjectsById,(o,i)=>{
      if(!o || typeof o.buy!=='function' || o.__ccmp_wrappedBuy) return;
      const orig=o.buy;
      o.buy=function(n){ const before=this.amount|0; const r=orig.apply(this,arguments); const after=this.amount|0;
        if(after>before){ Net.broadcast({type:'evt',kind:'buyBld',pid:PLAYER_ID,id:i,name:String(this.name||('Building '+i))}); }
        scheduleBroadcast(); return r;
      };
      o.__ccmp_wrappedBuy=true;
      if(typeof o.levelUp==='function' && !o.__ccmp_wrappedLevelUp){
        const origLU=o.levelUp;
        o.levelUp=function(){
          const prevL=+this.level||0, prevLumps=+Game.lumps||0;
          const r=origLU.apply(this,arguments);
          if((+this.level||0)>prevL || (+Game.lumps||0)!==prevLumps){
            Net.broadcast({type:'evt',kind:'levelUp',pid:PLAYER_ID,id:i,name:String(this.name||('Building '+i))});
            scheduleBroadcast();
          }
          return r;
        };
        o.__ccmp_wrappedLevelUp=true;
      }
    });
    eachList(Game.UpgradesById,(u,i)=>{
      if(!u) return;
      function wrapOnce(fnName){
        if(typeof u[fnName]!=='function' || u[`__ccmp_${fnName}`]) return;
        const orig=u[fnName];
        u[fnName]=function(){ const was=this.bought?1:0; const r=orig.apply(this,arguments); const now=this.bought?1:0;
          if(now && !was){ Net.broadcast({type:'evt',kind:'buyUpg',pid:PLAYER_ID,id:i,name:String(this.name||('Upgrade '+i))}); broadcastUpgrades(); }
          scheduleBroadcast(); return r;
        };
        u[`__ccmp_${fnName}`]=true;
      }
      wrapOnce('buy'); wrapOnce('earn');
    });
    (function(){
      const fns=['bakeryNamePrompt','PromptBakeryName','RenameBakery'];
      fns.forEach(fn=>{ try{ const f=Game[fn]; if(typeof f==='function' && !Game[`__ccmp_wrap_${fn}`]){ const orig=f; Game[fn]=function(){ const prev=getBakeryName(); const r=orig.apply(Game,arguments); const cur=getBakeryName(); if(prev!==cur){ lastBakerySent=cur; Net.broadcast({type:'bakery', n:cur}); Net.broadcast({type:'evt',kind:'bakeryName',name:cur,pid:PLAYER_ID}); } return r; }; Game[`__ccmp_wrap_${fn}`]=true; } }catch(e){} });
    })();
    if(Game.shimmer && Game.shimmer.prototype && !Game.shimmer.prototype.__ccmp_wrapPop){
      const op=Game.shimmer.prototype.pop;
      Game.shimmer.prototype.pop=function(){ const kind=String(this.type||'golden'); const r=op.apply(this,arguments);
        if(Net.role==='host'){ Net.broadcast({type:'evt',kind:'shimPop',pid:PLAYER_ID,shim:kind}); }
        return r;
      };
      Game.shimmer.prototype.__ccmp_wrapPop=true;
    }
    if(typeof Game.clickLump==='function' && !Game.__ccmp_wrap_clickLump){
      const orig=Game.clickLump;
      Game.clickLump=function(){
        const prev=+Game.lumps||0; const r=orig.apply(Game,arguments);
        if((+Game.lumps||0)>prev){ Net.broadcast({type:'evt',kind:'lumpHarvest',pid:PLAYER_ID}); scheduleBroadcast(); }
        return r;
      };
      Game.__ccmp_wrap_clickLump=true;
    }
    ensureMinigameHooks(false);
  }

  let detachFns=[];
  function installClientInputs(){
    detachFns.forEach(f=>{try{f();}catch(e){}}); detachFns=[];
    if (window.Game && typeof Game.ClickCookie==='function' && !Game.__ccmp_origClick){ Game.__ccmp_origClick = Game.ClickCookie; Game.ClickCookie = function(){}; }
    let burst=0, t=null;
    const storeHandler=(e)=>{
      let node=e.target;
      while(node && node!==document.body){
        const id=node.id||'', cls=node.className||'';
        if(id==='bigCookie'){ e.stopImmediatePropagation(); e.stopPropagation(); e.preventDefault(); burst++; if(t) clearTimeout(t); t=setTimeout(()=>{ if(burst>0){ Net.sendToHost({type:'click', count:burst}); burst=0; } },50); return; }
        if(/^product\d+$/.test(id)){ const idx=parseInt(id.replace('product',''),10); Net.sendToHost({type:'buyBld', id:idx}); e.stopImmediatePropagation(); e.preventDefault(); return; }
        if(/^upgrade\d+$/.test(id)){ const slot=parseInt(id.replace('upgrade',''),10); Net.sendToHost({type:'buyUpgSlot', slot}); e.stopImmediatePropagation(); e.preventDefault(); return; }
        if(id==='lump' || id==='lumps'){ Net.sendToHost({type:'lump', action:'harvest'}); e.stopImmediatePropagation(); e.preventDefault(); return; }
        if(/^levelUp\d+$/.test(id) || (typeof cls==='string' && /\blevelUp\b/.test(cls))){ const idx=(/^levelUp(\d+)$/.exec(id)||[])[1]; const idNum=idx?parseInt(idx,10):null; Net.sendToHost({type:'lump', action:'levelUp', id:idNum}); e.stopImmediatePropagation(); e.preventDefault(); return; }
        node=node.parentElement;
      }
    };
    document.addEventListener('click', storeHandler, true);
    detachFns.push(()=>document.removeEventListener('click', storeHandler, true));

    const keyHandler=(ev)=>{
      const tag = (ev.target && ev.target.tagName) ? ev.target.tagName.toLowerCase() : '';
      const editing = tag==='input' || tag==='textarea' || (ev.target && ev.target.isContentEditable);
      if(editing) return;
      if(ev.code==='Enter'){ ev.preventDefault(); Net.sendToHost({type:'click', count:1}); }
    };
    window.addEventListener('keydown', keyHandler, true);
    detachFns.push(()=>window.removeEventListener('keydown', keyHandler, true));

    ensureMinigameHooks(true);
  }
  function lockClientRename(){
    if(!window.Game) return; const msg=()=>notify('Host controls bakery name','warn');
    ['bakeryNamePrompt','PromptBakeryName','RenameBakery'].forEach(fn=>{ try{ if(typeof Game[fn]==='function' && !Game[`__ccmp_lock_${fn}`]){ Game[`__ccmp_lock_${fn}`]=true; Game[fn]=function(){ msg(); return; }; } }catch(e){} });
    try{ const n=safe(()=>Game.bakeryNameL);
      if(n && !n.__ccmp_click_block){ const handler=(e)=>{ e.stopImmediatePropagation(); e.preventDefault(); msg(); };
        n.addEventListener('click', handler, true); n.__ccmp_click_block=true; detachFns.push(()=>{ try{ n.removeEventListener('click', handler, true); }catch(e){} }); }
    }catch(e){}
  }
  function cleanupClientInputs(){
    detachFns.forEach(f=>{ try{f();}catch(e){} }); detachFns=[];
    if(window.Game && Game.__ccmp_origClick){ try{ Game.ClickCookie = Game.__ccmp_origClick; }catch(e){} delete Game.__ccmp_origClick; }
  }

  function broadcastShimmerSnapshot(targetConn){
    const arr=safe(()=>Game.shimmers)||[];
    for(let i=0;i<arr.length;i++){ const s=arr[i]; if(!s) continue; if(!s.__ccmpSid) s.__ccmpSid=mkSid();
      const msg={type:'shimSpawn', sid:s.__ccmpSid, kind:String(s.type||'golden'), x:Math.floor(s.x||0), y:Math.floor(s.y||0)};
      if(targetConn) { try{ targetConn.send(JSON.stringify(msg)); }catch(e){} } else { Net.broadcast(msg); } }
  }

  const Chat=(function(){
    const listElId=`${NS}-chatList`, inpId=`${NS}-chatInput`, typingBoxId=`${NS}-typing`;
    const maxKeep=200;
    function sanitizeText(t){ t=String(t||'').replace(/[\u0000-\u001F]/g,'').trim(); if(t.length>500) t=t.slice(0,500); return t; }
    function who(pid,name){ return (name && String(name).trim()) || nameFor(pid) || shortId(pid); }
    function addDom({pid,name,text,ts,sys}){
      const box=el(listElId); if(!box) return;
      const wrap=document.createElement('div'); wrap.className=`${NS}-chatMsg ${pid===PLAYER_ID && !sys?'me':''}`;
      const w=document.createElement('div'); w.className=`${NS}-chatWho`;
      w.textContent = sys ? 'System' : `${who(pid,name)} • ${shortId(pid)}`;
      const t=document.createElement('div'); t.className=`${NS}-chatTxt`; t.textContent=String(text||'');
      wrap.appendChild(w); wrap.appendChild(t); box.appendChild(wrap);
      while(box.childNodes.length>maxKeep){ box.removeChild(box.firstChild); }
      box.scrollTop=box.scrollHeight+9999;
    }

    const Typing={
      map:new Map(), lastSent:0,
      show(pid,name){
        if(pid===PLAYER_ID) return;
        const box=el(typingBoxId); if(!box) return;
        let rec=this.map.get(pid);
        if(!rec){
          const el=document.createElement('div'); el.className=`${NS}-typingChip`;
          const label=document.createElement('span'); label.className='lbl';
          const dots=document.createElement('div'); dots.className=`${NS}-typingDots`; dots.innerHTML='<span></span><span></span><span></span>';
          el.appendChild(label); el.appendChild(dots); box.appendChild(el);
          rec={el,label,timer:null};
          this.map.set(pid,rec);
        }
        rec.label.textContent=`${(name && String(name).trim()) || nameFor(pid) || shortId(pid)} is typing`;
        if(rec.timer) clearTimeout(rec.timer);
        rec.timer=setTimeout(()=>{ this.hide(pid); }, 3000);
      },
      hide(pid){
        const rec=this.map.get(pid); if(!rec) return;
        if(rec.timer) clearTimeout(rec.timer);
        if(rec.el && rec.el.parentNode) rec.el.parentNode.removeChild(rec.el);
        this.map.delete(pid);
      },
      clearAll(){
        const box=el(typingBoxId); if(box) box.innerHTML='';
        this.map.clear();
      },
      pingLocal(){
        const now=Date.now(); if(now-this.lastSent<900) return; this.lastSent=now;
        const nm=Names.sanitize(LS(DNAME_KEY)||DEFAULT_DNAME);
        const pkt={type:'typing', pid:PLAYER_ID, name:nm, on:true};
        if(Net.role==='host'){ Net.broadcast(pkt); }
        else if(Net.role==='client'){ Net.sendToHost(pkt); }
      },
      offLocal(){
        const pkt={type:'typing', pid:PLAYER_ID, on:false};
        if(Net.role==='host'){ Net.broadcast(pkt); }
        else if(Net.role==='client'){ Net.sendToHost(pkt); }
      }
    };

    return {
      add(msg){ addDom(msg||{}); },
      sys(text){ addDom({pid:'sys', name:'', text, ts:Date.now(), sys:true}); },
      send(text){
        const clean=sanitizeText(text);
        if(!clean) return;
        const nm=Names.sanitize(LS(DNAME_KEY)||DEFAULT_DNAME);
        if(Net.role==='host'){
          addDom({pid:PLAYER_ID, name:nm, text:clean, ts:Date.now()});
          Net.broadcast({type:'chat', pid:PLAYER_ID, name:nm, text:clean, ts:Date.now()});
        }else if(Net.role==='client'){
          Net.sendToHost({type:'chat', pid:PLAYER_ID, name:nm, text:clean, ts:Date.now()});
          addDom({pid:PLAYER_ID, name:nm, text:clean, ts:Date.now()});
        } else {
          addDom({pid:PLAYER_ID, name:nm, text:clean, ts:Date.now()});
        }
        Typing.offLocal();
      },
      typingPing(){ Typing.pingLocal(); },
      typingRemote(pid,name,on){ if(on) Typing.show(pid,name); else Typing.hide(pid); },
      typingClear(){ Typing.clearAll(); }
    };
  })();

  const VOICE_KEY_IN=`${NS}:voice:in`;
  const VOICE_KEY_VOL=`${NS}:voice:vol`;
  const Voice=(function(){
    let enabled=false, muted=false, deaf=false, ptt=false, pttHeld=false;
    let localStream=null, analyser=null, sourceNode=null, ac=null;
    let calls=new Map();
    let masterVol=typeof LS(VOICE_KEY_VOL)==='number' ? LS(VOICE_KEY_VOL) : 1;
    let meterRAF=null, selfMeterEl=null, selfDotEl=null;

    let audioUnlocked=false;
    function attachAudioUnlock(){
      if(audioUnlocked) return;
      const handler=()=>{ audioUnlocked=true;
        try{
          ac = ac || audioCtx || new (window.AudioContext||window.webkitAudioContext)();
          if(ac?.state==='suspended'){ ac.resume().catch(()=>{}); }
          const a=new Audio(); a.srcObject=null; a.muted=true; a.play().catch(()=>{});
        }catch(e){}
        calls.forEach(rec=>{ try{ rec.audio.muted=false; rec.audio.play().catch(()=>{}); }catch(e){} });
        document.removeEventListener('click',handler,true);
        document.removeEventListener('keydown',handler,true);
      };
      document.addEventListener('click',handler,true);
      document.addEventListener('keydown',handler,true);
    }
    attachAudioUnlock();

    function peersToCall(){
      const myId = Net?.peer?.id || '';
      const out=[];
      const r = (Net.role==='host') ? buildRoster() : (lastRoster||[]);
      r.forEach(p=>{ if(p.call && p.call!==myId){ out.push(p.call); } });
      return out;
    }

    function renderPeerList(){
      const box=el(`${NS}-voicePeers`); if(!box) return;
      box.innerHTML='';
      const myId = Net?.peer?.id || '';
      const r = (Net.role==='host') ? buildRoster() : (lastRoster||[]);
      r.forEach(p=>{
        const row=document.createElement('div'); row.className=`${NS}-vrow`; row.dataset.call=p.call||'';
        const left=document.createElement('div'); left.className=`${NS}-vleft`;
        const mic=document.createElement('div'); mic.className=`${NS}-vmic`;
        const name=document.createElement('div'); name.className=`${NS}-vname`; name.textContent=(p.name||shortId(p.id)) + (p.call===myId?' (you)':'');
        left.appendChild(mic); left.appendChild(name);
        const right=document.createElement('div'); right.className=`${NS}-vright`;
        const bar=document.createElement('div'); bar.className=`${NS}-vbar`; const fill=document.createElement('div'); fill.className='fill'; bar.appendChild(fill);
        const tag=document.createElement('div'); tag.className=`${NS}-badgeSmall`; tag.textContent=p.role||'client';
        right.appendChild(bar); right.appendChild(tag);
        row.appendChild(left); row.appendChild(right);
        box.appendChild(row);
      });

      calls.forEach((rec,cid)=>{
        const row=box.querySelector(`[data-call="${cid}"]`);
        if(row){ rec.micDot = row.querySelector(`.${NS}-vmic`); rec.meterEl = row.querySelector(`.${NS}-vbar .fill`); }
      });

      const selfRow=box.querySelector(`[data-call="${myId}"]`);
      selfDotEl = selfRow ? selfRow.querySelector(`.${NS}-vmic`) : null;
      selfMeterEl = selfRow ? selfRow.querySelector(`.${NS}-vbar .fill`) : null;
    }

    function paintLive(callId, live){
      const rec=calls.get(callId);
      if(rec && rec.micDot) rec.micDot.classList.toggle('live', !!live);
    }

    function updateVolumes(){
      LS(VOICE_KEY_VOL, masterVol);
      calls.forEach(rec=>{ if(rec.audio) rec.audio.volume = deaf ? 0 : masterVol; });
    }

    function stopLocal(){
      try{ if(localStream){ localStream.getTracks().forEach(t=>t.stop()); } }catch(e){}
      localStream=null;
      try{ if(sourceNode) sourceNode.disconnect(); }catch(e){}
      try{ if(analyser) analyser.disconnect(); }catch(e){}
      sourceNode=null; analyser=null;
    }

    function closeAllCalls(){
      calls.forEach(({call,audio})=>{
        try{ call.close(); }catch(e){}
        try{ if(audio) audio.remove(); }catch(e){}
      });
      calls.clear();
      renderPeerList();
    }

    function destroy(){
      disablePTT();
      stopLocal();
      closeAllCalls();
      if(meterRAF){ cancelAnimationFrame(meterRAF); meterRAF=null; }
      enabled=false;
    }

    function listMics(){
      return navigator.mediaDevices.enumerateDevices().then(list=>{
        return list.filter(d=>d.kind==='audioinput');
      });
    }

    async function refreshDevices(){
      const sel=el(`${NS}-v-input`); if(!sel) return;
      sel.innerHTML='';
      let devs=[];
      try{ devs = await listMics(); }catch(e){}
      devs.forEach(d=>{
        const opt=document.createElement('option');
        opt.value=d.deviceId; opt.textContent=d.label || ('Microphone '+shortId(d.deviceId));
        sel.appendChild(opt);
      });
      const saved=LS(VOICE_KEY_IN)||'';
      if(saved){ [...sel.options].forEach(o=>{ if(o.value===saved) sel.value=saved; }); }
    }

    function constraintFor(deviceId){
      const base={echoCancellation:true, noiseSuppression:true, autoGainControl:true};
      return deviceId ? Object.assign({deviceId:{exact:deviceId}}, base) : base;
    }

    async function enable(){
      try{
        await refreshDevices();
        const sel=el(`${NS}-v-input`);
        const devId = (sel && sel.value) ? sel.value : (LS(VOICE_KEY_IN)||'');
        localStream = await navigator.mediaDevices.getUserMedia({audio: constraintFor(devId)});
        enabled=true; muted=false;

        try{
          ac = audioCtx || new (window.AudioContext||window.webkitAudioContext)();
          sourceNode = ac.createMediaStreamSource(localStream);
          analyser = ac.createAnalyser(); analyser.fftSize=512;
          const gain=ac.createGain(); gain.gain.value = 0.00001;
          sourceNode.connect(analyser); analyser.connect(gain); gain.connect(ac.destination);
        }catch(e){}

        applyMuteState();
        attachAudioUnlock();
        callTargets();
        startMeters();
        notify('Voice enabled','ok');
        return true;
      }catch(e){
        notify('Microphone blocked/failed','warn'); return false;
      }
    }

    function disable(){
      destroy();
      notify('Voice disabled','warn');
    }

    function applyMuteState(){
      if(!localStream) return;
      const on = (!muted) && (!ptt || (ptt && pttHeld));
      localStream.getAudioTracks().forEach(t=>{ t.enabled = on; });
      const btn=el(`${NS}-v-mute`); if(btn) btn.textContent = muted ? 'Unmute' : 'Mute';
    }

    function setMute(m){ muted=!!m; applyMuteState(); }
    function toggleMute(){ setMute(!muted); }
    function setDeafen(d){ deaf=!!d; updateVolumes(); const b=el(`${NS}-v-deafen`); if(b) b.textContent=deaf?'Undeafen':'Deafen'; }

    function pttKey(e){
      if(e.repeat) return;
      if(e.code==='KeyV'){ pttHeld = (e.type==='keydown'); applyMuteState(); e.preventDefault(); }
    }
    function enablePTT(){ if(ptt){ window.addEventListener('keydown', pttKey, true); window.addEventListener('keyup', pttKey, true); } }
    function disablePTT(){ window.removeEventListener('keydown', pttKey, true); window.removeEventListener('keyup', pttKey, true); pttHeld=false; applyMuteState(); }
    function setPTT(on){ ptt=!!on; if(ptt){ enablePTT(); } else { disablePTT(); } }

    function onIncomingCall(call){
      try{ call.answer(localStream || undefined); }catch(e){}
      wireCall(call);
      attachAudioUnlock();
      startMeters();
    }

    function levelFromAnalyser(an){
      if(!an) return 0;
      const N=an.fftSize; const buf=new Uint8Array(N);
      try{ an.getByteTimeDomainData(buf); }catch(e){ return 0; }
      let sum=0; for(let i=0;i<N;i++){ const v=(buf[i]-128)/128; sum+=v*v; }
      const rms=Math.sqrt(sum/N);
      return Math.min(1, rms*3);
    }

    function wireCall(call){
      const id=call.peer;
      let rec=calls.get(id);
      if(rec){ try{ rec.call.close(); }catch(e){} try{ if(rec.audio) rec.audio.remove(); }catch(e){} }
      const audio=new Audio(); audio.autoplay=true; audio.playsInline=true; audio.muted=false; audio.volume = deaf ? 0 : masterVol;

      const tryPlay=()=>{ audio.play().catch(()=>{ attachAudioUnlock(); }); };
      audio.addEventListener('canplay', tryPlay);
      audio.addEventListener('loadedmetadata', tryPlay);

      call.on('stream', stream=>{
        audio.srcObject=stream;
        tryPlay();
        paintLive(id,true);
        try{
          ac = ac || audioCtx || new (window.AudioContext||window.webkitAudioContext)();
          const src = ac.createMediaStreamSource(stream);
          const an = ac.createAnalyser(); an.fftSize=512;
          src.connect(an);
          rec.analyser = an;
        }catch(e){}
      });
      call.on('close',()=>{ paintLive(id,false); try{ audio.remove(); }catch(e){} calls.delete(id); renderPeerList(); });
      call.on('error',()=>{ paintLive(id,false); try{ audio.remove(); }catch(e){} calls.delete(id); renderPeerList(); });

      calls.set(id,{call,audio,micDot:null,meterEl:null, analyser:null});
      renderPeerList();
      startMeters();
    }

    function callTargets(){
      if(!Net.peer) return;
      const myId=Net.peer.id;
      const targets = peersToCall();
      targets.forEach(cid=>{
        if(!cid || cid===myId) return;
        if(calls.has(cid)) return;
        try{
          const call = Net.peer.call(cid, localStream || undefined, {metadata:{pid:PLAYER_ID, name: Names.sanitize(LS(DNAME_KEY)||DEFAULT_DNAME)}});
          wireCall(call);
        }catch(e){}
      });
      calls.forEach((rec,cid)=>{
        if(!targets.includes(cid)){ try{ rec.call.close(); }catch(e){} try{ if(rec.audio) rec.audio.remove(); }catch(e){} calls.delete(cid); }
      });
      renderPeerList();
      attachAudioUnlock();
      startMeters();
    }

    function startMeters(){
      if(meterRAF) return;
      const thr=0.08;
      const loop=()=>{
        calls.forEach((rec,cid)=>{
          const v = levelFromAnalyser(rec.analyser);
          if(rec.meterEl){ rec.meterEl.style.width = (Math.min(1,v)*100)+'%'; }
          if(rec.micDot){ rec.micDot.classList.toggle('live', v>thr); }
        });
        if(analyser){
          const v = levelFromAnalyser(analyser);
          if(selfMeterEl){ selfMeterEl.style.width = (Math.min(1,v)*100)+'%'; }
          if(selfDotEl){ selfDotEl.classList.toggle('live', v>thr && (!muted) && (!deaf)); }
        }
        meterRAF = requestAnimationFrame(loop);
      };
      meterRAF = requestAnimationFrame(loop);
    }

    function onRoster(r){
      callTargets();
      renderPeerList();
      attachAudioUnlock();
      startMeters();
    }

    return {
      enable, disable, destroy,
      onIncomingCall, onRoster,
      setMute, toggleMute, setDeafen, setPTT,
      setVolume(v){ masterVol=Math.max(0,Math.min(1, +v||0)); updateVolumes(); },
      refreshDevices,
      whenPeerOpen(){ callTargets(); renderPeerList(); attachAudioUnlock(); startMeters(); },
      whenConnOpen(){ callTargets(); }
    };
  })();

  function hostAction(name,args){
    if(Net.role==='host'){
      switch(name){
        case 'syncAllNow': syncAll(); Net.broadcast({type:'evt',kind:'syncAll'}); setStatus('Soft synced to all.'); break;
        case 'saveAll': broadcastFullSave(null,true); setStatus('Full save sent.'); notify('Full save sent','ok'); break;
        case 'spawnGolden': hostSpawnGolden(); setStatus('Spawned golden cookie'); break;
        case 'spawnReindeer': hostSpawnReindeer(); setStatus('Spawned reindeer'); break;
        case 'setLockRoom': lockRoom=!!(args&&args.value); LS(KEY_LOCK,lockRoom); setStatus(lockRoom?'Room locked.':'Room unlocked.'); break;
        case 'setMaxClients': { const v=Math.max(1,Math.min(24,parseInt(args&&args.value||8,10))); maxClients=v; LS(KEY_MAX,v); setStatus('Max clients set to '+v); break; }
        case 'setPolicy': { const p=args||{}; acEnforceClients=!!p.enforce; acBan=!!p.ban; acGrace=Math.max(0, p.grace|0); LS(KEY_AC_ENF,acEnforceClients); LS(KEY_AC_BAN,acBan); LS(KEY_AC_GRACE,acGrace); broadcastPolicy(); break; }
        case 'setAutoFull': { autoFull30=!!(args&&args.value); LS(KEY_AFULL30,autoFull30); setupForceTick(); setStatus(autoFull30?'Auto full sync ON (30s)':'Auto full sync OFF'); break; }
        case 'setHybrid': { forceHybrid=!!(args&&args.value); LS(KEY_FHYB,forceHybrid); setupForceTick(); setStatus(forceHybrid?'Hybrid full ON':'Hybrid full OFF'); break; }
        case 'setCursors': { cursorsEnabled=!!(args&&args.value); LS(KEY_CURSOR,cursorsEnabled); setCursorsOn(cursorsEnabled); broadcastCursorPolicy(); setStatus(cursorsEnabled?'Cursors ON':'Cursors OFF'); break; }
      }
      return;
    }
    if(Admin.isAdmin || IS_OWNER){
      Net.sendToHost({type:'adminAct', name, args});
      notify('Requested host: '+name,'ok');
    }else{
      notify('Host-only','warn');
    }
  }
  function setHostCheck(id,val){ try{ const n=el(`${NS}-${id}`); if(!n) return false; if(n.type==='checkbox'){ n.checked=!!val; n.dispatchEvent(new Event('change')); return true; } if(n.tagName==='INPUT'){ n.value = val; n.dispatchEvent(new Event('change')); return true; } }catch(e){} return false; }
  function wireToggleForward(ids){
    ids.forEach(k=>{
      const n=el(`${NS}-${k}`); if(!n) return;
      n.addEventListener('change',()=>{
        if(Net.role==='host') return;
        if(!(Admin.isAdmin || IS_OWNER)) return;
        const value = (n.type==='checkbox') ? n.checked : n.value;
        Net.sendToHost({type:'adminAct', name:'toggle', args:{id:k, value}});
      });
    });
  }
  wireToggleForward(['t-cookies','t-buildings','t-upgrades','t-ach','t-buffs','t-lumps','t-minisaves','t-specWrink','t-specPrestige','autoSyncAll','autoSaveOnJoin','autoFull30','forceHybrid','t-cursors','perm-clicks','perm-buyBld','perm-buyUpg','perm-shim','perm-mini','perm-lumps','perm-log']);

  function broadcastGbanPush(){ if(Net.role!=='host') return; const list=GlobalBan.export(); try{ Net.broadcast({type:'gbanPush', list}); }catch(e){} }

  let lastSaveHashSeen='';
  function onData(raw,conn){
    let msg=null; try{ msg=JSON.parse(raw); }catch(e){ return; }
    if(!msg || typeof msg!=='object') return;

    if(msg.type==='adminAct' && Net.role==='host'){
      const pid=conn._pid||conn.peer;
      const allowed = isOwnerPid(pid) || Admin.set.has(pid);
      if(!allowed) return;
      const {name,args}=msg;
      if(name==='kick' && args?.pid){ if(!isOwnerPid(args.pid)) Net.kick(args.pid); }
      else if(name==='ban' && args?.pid){ if(!isOwnerPid(args.pid)) Net.ban(args.pid); }
      else if(name==='grantAdmin' && args?.pid){ Admin.set.add(args.pid); Admin.save(Net.room); broadcastRoles(); sendRoster(); renderPeers(); }
      else if(name==='revokeAdmin' && args?.pid){ Admin.set.delete(args.pid); Admin.save(Net.room); broadcastRoles(); sendRoster(); renderPeers(); }
      else if(name==='toggle' && args?.id!==undefined){ setHostCheck(args.id, args.value); }
      else if(name==='globalBan' && args?.pid && isOwnerPid(pid)){ if(!isOwnerPid(args.pid)){ GlobalBan.add(args.pid); broadcastGbanPush(); Net.ban(args.pid); } }
      else if(name==='globalUnban' && args?.pid && isOwnerPid(pid)){ GlobalBan.remove(args.pid); broadcastGbanPush(); }
      else { hostAction(name,args); }
      return;
    }

    if(msg.type==='hello' && Net.role==='host'){
      const candidate = msg.playerId || ('anon-'+shortId(conn.peer));
      const nm = (typeof msg.name==='string') ? Names.sanitize(msg.name) : '';
      if(!isOwnerPid(candidate) && GlobalBan.has(candidate)){
        try{ conn.send(JSON.stringify({type:'reject', reason:'global ban'})); }catch(e){} try{conn.close();}catch(e){} return;
      }
      if(!isOwnerPid(candidate) && (lockRoom || Net.conns.length >= maxClients)){
        try{ conn.send(JSON.stringify({type:'reject', reason: lockRoom?'locked':'server full'})); }catch(e){} try{conn.close();}catch(e){} return;
      }
      conn._pid = candidate;
      if(Net.banned.has(conn._pid)){ try{conn.send(JSON.stringify({type:'reject', reason:'banned'})); }catch(e){} try{conn.close();}catch(e){} return; }
      if(typeof nm==='string'){ Names.set(conn._pid, nm||''); }
      if(isOwnerPid(conn._pid)){ Admin.set.add(conn._pid); Admin.save(Net.room); }
      Net.conns.push(conn); setPeers(Net.peersList().map(shortId)); renderPeers(); sendRoster();

      try{ conn.send(JSON.stringify({type:'roles', admins: Array.from(Admin.set)})); }catch(e){}
      try{ conn.send(JSON.stringify({type:'welcome',room:Net.room})); }catch(e){}
      broadcastPolicy();
      try{ conn.send(JSON.stringify({type:'cursorPolicy', on: !!cursorsEnabled})); }catch(e){}
      if(isOwnerPid(conn._pid)){ try{ conn.send(JSON.stringify({type:'gbanSyncReq'})); }catch(e){} }
      syncAll(conn); if(autoSaveOnJoin){ const code=getSaveSafe(); if(code){ try{conn.send(JSON.stringify({type:'saveFull', code, h:hashStr(code), force:true})); }catch(e){} } }
      Net.broadcast({type:'evt',kind:'join',pid:conn._pid});
      return;
    }
    if(Net.role==='host' && (Net.banned.has(conn._pid||'') || Net.banned.has(conn.peer))){ try{conn.close();}catch(e){} return; }

    if(msg.type==='gbanSyncReq' && Net.role==='client' && IS_OWNER){
      Net.sendToHost({type:'gbanPush', list: GlobalBan.export()});
      return;
    }
    if(msg.type==='gbanPush'){
      if(Net.role==='host'){ if(isOwnerPid(conn._pid||conn.peer)){ GlobalBan.importMerge(msg.list||[]); broadcastGbanPush(); } }
      else { GlobalBan.importMerge(msg.list||[]); }
      return;
    }

    if(msg.type==='myName' && Net.role==='host'){ const pid=conn._pid||conn.peer; const nm=Names.set(pid, msg.name||''); sendRoster(); Net.broadcast({type:'evt',kind:'nameChange',pid, name:nm}); return; }

    if(msg.type==='click' && Net.role==='host'){
      const allow=el(`${NS}-perm-clicks`); if(!(allow&&allow.checked)) return;
      const n = Math.max(1, msg.count|0);
      for(let i=0;i<n;i++){
        if (window.Game && typeof Game.ClickCookie==='function') { safe(()=>Game.ClickCookie()); }
        else if(window.Game){
          const cp = (typeof Game.computedMouseCps==='number' ? Game.computedMouseCps :
                      (typeof Game.mouseCps==='number' ? Game.mouseCps : 1));
          Game.cookies = (+Game.cookies||0) + Math.max(1, +cp||1);
        }
      }
      scheduleBroadcast();
    }
    else if(msg.type==='buyBld' && Net.role==='host'){
      const allow=el(`${NS}-perm-buyBld`); if(!(allow&&allow.checked)) return;
      const id = msg.id|0; const obj = window.Game && Game.ObjectsById && Game.ObjectsById[id];
      if(obj && typeof obj.buy==='function'){
        const before=obj.amount|0; safe(()=>obj.buy(1)); const after=obj.amount|0;
        if(after>before){ Net.broadcast({type:'evt',kind:'buyBld',pid:(conn._pid||conn.peer),id,name:String(obj.name||('Building '+id))}); }
        scheduleBroadcast();
      }
    }
    else if(msg.type==='buyUpgSlot' && Net.role==='host'){
      const allow=el(`${NS}-perm-buyUpg`); if(!(allow&&allow.checked)) return;
      const slot = msg.slot|0; const list = window.Game && Game.UpgradesInStore; const up = (list && list[slot]) ? list[slot] : null;
      if(up && !up.bought){
        const pre=up.bought?1:0; safe(()=>up.buy()); const post=up.bought?1:0;
        if(post && !pre){ Net.broadcast({type:'evt',kind:'buyUpg',pid:(conn._pid||conn.peer),id:(up.id|0),name:String(up.name||('Upgrade '+(up.id|0)))}); broadcastUpgrades(); }
        scheduleBroadcast();
      }
    }
    else if(msg.type==='buyUpg' && Net.role==='host'){
      const allow=el(`${NS}-perm-buyUpg`); if(!(allow&&allow.checked)) return;
      const id = msg.id|0; const up = window.Game && Game.UpgradesById && Game.UpgradesById[id];
      if(up && !up.bought){
        const pre=up.bought?1:0; if(typeof up.buy==='function') safe(()=>up.buy()); else if(typeof up.earn==='function') safe(()=>up.earn());
        const post=up.bought?1:0; if(post && !pre){ Net.broadcast({type:'evt',kind:'buyUpg',pid:(conn._pid||conn.peer),id,name:String(up.name||('Upgrade '+id))}); broadcastUpgrades(); }
        scheduleBroadcast();
      }
    }
    else if(msg.type==='lump' && Net.role==='host'){
      const allow=el(`${NS}-perm-lumps`); if(!(allow&&allow.checked)) return;
      const act=msg.action;
      if(act==='harvest'){
        if(typeof Game.clickLump==='function'){ safe(()=>Game.clickLump()); scheduleBroadcast(); Net.broadcast({type:'evt',kind:'lumpHarvest',pid:(conn._pid||conn.peer)}); }
      } else if(act==='levelUp'){
        const id=msg.id|0; const obj=Game?.ObjectsById?.[id];
        if(obj && typeof obj.levelUp==='function'){ const prev=obj.level|0; safe(()=>obj.levelUp()); if((obj.level|0)>prev){ Net.broadcast({type:'evt',kind:'levelUp',pid:(conn._pid||conn.peer),id,name:String(obj.name||('Building '+id))}); } scheduleBroadcast(); }
      }
    }
    else if(msg.type==='miniRpc' && Net.role==='host'){
      const allowMini=el(`${NS}-perm-mini`); if(!(allowMini&&allowMini.checked)) return;
      const id=msg.bld|0; const fn=String(msg.fn||''); const args=Array.isArray(msg.args)?msg.args:[];
      const obj=window.Game && Game.ObjectsById && Game.ObjectsById[id]; const mg=obj && obj.minigame;
      if(mg && typeof mg[fn]==='function'){ try{ mg[fn].apply(mg, args.map(x=> (x && typeof x==='object') ? x : x )); minigameDirty(); scheduleBroadcast(); }catch(e){} }
    }
    else if(msg.type==='pull' && Net.role==='host'){ syncAll(conn); if(el(`${NS}-autoSaveOnJoin`)?.checked){ if(forceHybrid) broadcastHybrid(conn,true); else broadcastFullSave(conn,true); } }
    else if(msg.type==='shimClick' && Net.role==='host'){
      const allow=el(`${NS}-perm-shim`); if(!(allow&&allow.checked)) return;
      if(hostPopShimBySid(msg.sid)){ Net.broadcast({type:'evt',kind:'shimPop',pid:(conn._pid||conn.peer),shim:'golden'}); scheduleBroadcast(); }
    }
    else if(msg.type==='ping' && Net.role==='client'){ try{ conn.send(JSON.stringify({type:'pong', t:msg.t})); }catch(e){} }
    else if(msg.type==='evt'){ onEvt(msg); }
    else if(msg.type==='bakery' && Net.role==='client'){ if(typeof msg.n==='string'){ applyBakeryName(msg.n); onEvt({type:'evt',kind:'bakeryName',name:msg.n}); } }
    else if(msg.type==='state' && Net.role==='client' && msg.payload){
      const p=msg.payload||{}; if(p.anti) ANTI.setPolicy(p.anti);
      if(typeof p.name==='string') applyBakeryName(p.name);
      if(p.flags?.cookies && ('cookies' in p)){ applyCookiesSmart(p.cookies, p.cookiesPs||0, p.ts||Date.now()); }
      if(p.flags?.buildings && 'buildings' in p) forceSetBuildings(p.buildings);
      if(p.flags?.upgrades && 'upgrades' in p) grantUpgrades(p.upgrades);
      if(p.flags?.achievements && 'achievements' in p) grantAchievements(p.achievements);
      if(p.flags?.buffs && p.buffs) applyBuffs(p.buffs);
      if(p.flags?.lumps && p.lumps) applyLumps(p.lumps);
      if(p.flags?.specials && p.specials){ applySpecials(p.specials, { wrink:optSpecWrk, prestige:optSpecPre }); }
      deepRefreshUI(); setStatus('Synced from host.');
    }
    else if(msg.type==='stateLite' && Net.role==='client' && msg.payload){
      const p=msg.payload||{};
      if(typeof p.name==='string') applyBakeryName(p.name);
      if('cookies' in p){ applyCookiesSmart(p.cookies, p.cookiesPs||0, p.ts||Date.now()); deepRefreshUI(); }
    }
    else if(msg.type==='miniSaves' && Net.role==='client'){ applyMiniSaves(msg.list||[]); }
    else if(msg.type==='saveFull' && Net.role==='client' && msg.code){
      if(msg.force || msg.h !== lastSaveHashSeen){ importSaveSafe(msg.code); lastSaveHashSeen = msg.h||hashStr(msg.code); deepRefreshUI(); }
    }
    else if(msg.type==='shimSpawn' && Net.role==='client'){ clientSpawnShim(msg); }
    else if(msg.type==='shimGone' && Net.role==='client'){ removeClientShim(msg.sid); }
    else if(msg.type==='roster'){ lastRoster=Array.isArray(msg.list)? msg.list : []; renderRoster(lastRoster); renderPeers(); Voice.onRoster(lastRoster); }
    else if(msg.type==='reject' && Net.role==='client'){ setStatus('Join rejected: '+(msg.reason||'unknown')); notify('Join rejected: '+(msg.reason||'unknown'),'warn'); }
    else if(msg.type==='policy' && Net.role==='client' && msg.anti){ ANTI.setPolicy(msg.anti); }
    else if(msg.type==='roles'){ const lst=Array.isArray(msg.admins)? msg.admins : []; Admin.isAdmin = lst.includes(PLAYER_ID) || IS_OWNER; setRoleUI(Net.role==='host'?'host':'client'); renderPeers(); if(Admin.isAdmin && IS_OWNER) notify('Owner privileges active','ok'); }
    else if(msg.type==='cheat' && Net.role==='host'){
      const pid=conn._pid||conn.peer; const wantBan=!!msg.wantBan;
      if(isOwnerPid(pid)) return;
      if(wantBan){ Net.banned.add(pid); Admin.set.delete(pid); Admin.save(Net.room); }
      try{ conn.close(); }catch(e){} Net.conns=Net.conns.filter(c=>c!==conn); renderPeers(); sendRoster(); broadcastRoles();
      Net.broadcast({type:'evt',kind:'cheat',pid,banned:wantBan});
    }
    else if(msg.type==='cursorPolicy'){
      setCursorsOn(!!msg.on);
      if(Net.role==='client'){ if(msg.on){ startCursorSend(); } else { stopCursorSend(); clearCursors(); } }
    }
    else if(msg.type==='cursor'){
      const pid = msg.pid||'?', x = +msg.x||0, y=+msg.y||0;
      if(Cursors.on){ renderCursor(pid, x, y); }
      if(Net.role==='host'){ try{ Net.broadcast({type:'cursor', pid, x, y}); }catch(e){} }
    }
    else if(msg.type==='upgBits' && Net.role==='client'){
      if(Array.isArray(msg.bits)){ grantUpgrades(msg.bits); deepRefreshUI(); }
    }
    else if(msg.type==='pong' && Net.role==='host'){ /* rtt unused */ }
    else if(msg.type==='chat' && Net.role==='host'){
      const pid=conn._pid||conn.peer; const nm=Names.get(pid) || String(msg.name||''); const txt=String(msg.text||'').slice(0,500);
      Chat.add({pid, name:nm, text:txt, ts:Date.now()});
      try{ Net.broadcast({type:'chat', pid, name:nm, text:txt, ts:Date.now()}); }catch(e){}
    }
    else if(msg.type==='chat'){
      const pid=msg.pid||'?', nm=String(msg.name||''), txt=String(msg.text||'');
      if(pid===PLAYER_ID) return;
      Chat.add({pid, name:nm, text:txt, ts:msg.ts||Date.now()});
      if(nfChat){ notify((nm||shortId(pid))+': '+txt.slice(0,80),'ok'); }
    }
    else if(msg.type==='typing'){
      if(Net.role==='host'){
        const pid=conn._pid||conn.peer; const nm=Names.get(pid)||String(msg.name||'');
        Chat.typingRemote(pid,nm,!!msg.on);
        const pkt={type:'typing', pid, name:nm, on:!!msg.on};
        Net.conns.forEach(c=>{ if(c!==conn){ try{ c.send(JSON.stringify(pkt)); }catch(e){} } });
      }else if(Net.role==='client'){
        if(msg.pid!==PLAYER_ID){ Chat.typingRemote(msg.pid, msg.name||'', !!msg.on); }
      }
    }
  }

  function backupSave(){ try{ const key='CookieClickerGame'; const cur=localStorage.getItem(key); if(cur) localStorage.setItem(NS+':backup:'+Date.now(), cur); }catch(e){} }
  const hardReset=()=> safe(()=>Game&&typeof Game.HardReset==='function'&&Game.HardReset(1));

  const roomInput=el(`${NS}-room`); if(roomInput){ const saved=LS(`${NS}:room`); roomInput.value=saved||roomInput.value||('room-'+rid(6)); roomInput.addEventListener('input',e=>LS(`${NS}:room`,e.target.value||'')); }
  el(`${NS}-make`)?.addEventListener('click',()=>{ const r='room-'+rid(6); if(roomInput){ roomInput.value=r; LS(`${NS}:room`,r);} });
  el(`${NS}-copy`)?.addEventListener('click',()=>{ const v=roomInput?roomInput.value:''; if(!v){ setStatus('Enter a room ID first.'); notify('Enter a room ID to join','warn'); return; } navigator.clipboard.writeText(v).then(()=>setStatus('Copied.')).catch(()=>setStatus('Copy failed.')); });

  const dnameInp=el(`${NS}-dname`), dnameSave=el(`${NS}-dname-save`);
  if(dnameInp){ const nm=Names.sanitize(LS(DNAME_KEY)||DEFAULT_DNAME); dnameInp.value=nm; }
  function setMyDisplayName(name){
    const nm=Names.sanitize(name); LS(DNAME_KEY,nm); if(dnameInp) dnameInp.value=nm;
    if(Net.role==='host'){ Names.set(PLAYER_ID,nm); sendRoster(); Net.broadcast({type:'evt',kind:'nameChange',pid:PLAYER_ID,name:nm}); }
    else if(Net.role==='client'){ Net.sendToHost({type:'myName', name:nm}); }
    notify(`Display name set to “${nm}”`,'ok');
  }
  dnameSave?.addEventListener('click',()=>setMyDisplayName(dnameInp?.value||'')); dnameInp?.addEventListener('keydown',(e)=>{ if(e.key==='Enter'){ setMyDisplayName(dnameInp.value||''); } });

  function broadcastPolicy(){ if(Net.role!=='host') return; try{ Net.broadcast({type:'policy', anti:hostPolicy()}); }catch(e){} scheduleBroadcast(); }

  async function host(roomId){
    await loadPeerJS(); Net.disconnect();
    setRoleUI('host'); setStatus('Preparing host… (no wipe)');
    await waitForGameReady(); deepRefreshUI();

    Net.role='host'; Net.room=roomId; Admin.load(roomId);
    Names.set(PLAYER_ID, Names.sanitize(LS(DNAME_KEY)||DEFAULT_DNAME));
    const peer=Net.peer=createPeer(NS+'-'+roomId);
    peer.on('open',id=>{
      setStatus('Hosting as '+id+' (you: '+shortId(PLAYER_ID)+'). Waiting for peers…');
      setPeers([]); renderPeers(); renderRoster([{id:PLAYER_ID, role: (IS_OWNER?'owner':'host'), name: Names.get(PLAYER_ID)||'', call:id}]);
      lastBakerySent=getBakeryName(); ensureHostPatches(); ensureMinigameHooks(false); switchTab('host'); enhanceSections();
      startHostTicker(); debouncedBroadcastNow(); sendRoster(); broadcastPolicy(); broadcastRoles(); broadcastCursorPolicy();
      if(cursorsEnabled) setCursorsOn(true);
      notify(`Host started room ${roomId}`,'ok');
      Voice.whenPeerOpen();
    });
    peer.on('connection',conn=>{
      conn.on('data',d=>onData(d,conn));
      conn.on('open',()=>{ try{ conn.send(JSON.stringify({type:'welcome',room:roomId})); }catch(e){} });
      conn.on('close',()=>{ if(conn._pid){ Net.broadcast({type:'evt',kind:'leave',pid:conn._pid}); } Net.conns=Net.conns.filter(c=>c!==conn); setPeers(Net.peersList().map(shortId)); renderPeers(); sendRoster(); });
    });
    peer.on('call', (call)=>Voice.onIncomingCall(call));
    peer.on('error',err=>{ setStatus('Peer error: '+err.message); notify('Peer error: '+err.message,'warn'); });
  }

  async function join(roomId){
    await loadPeerJS(); Net.disconnect();
    Net.role='client'; Net.room=roomId; setRoleUI('client'); setStatus('Joining… (will wipe local to sync)');
    try{ backupSave(); hardReset(); }catch(e){}
    await waitForGameReady();

    const peer=Net.peer=createPeer(null);
    peer.on('open',()=>{
      const hostId=NS+'-'+roomId;
      const conn=peer.connect(hostId,{reliable:true});
      conn.on('open',()=>{ 
        Net.conns=[conn]; setPeers(Net.peersList().map(shortId)); setStatus('Connected to host '+hostId);
        conn.send(JSON.stringify({type:'hello', playerId: PLAYER_ID, name: Names.sanitize(LS(DNAME_KEY)||DEFAULT_DNAME)}));
        if(IS_OWNER){ try{ conn.send(JSON.stringify({type:'gbanPush', list: GlobalBan.export()})); }catch(e){} }
        installClientInputs(); lockClientRename(); ensureMinigameHooks(true); switchTab('connect'); enhanceSections();
        ANTI.connectedAt=Date.now(); ANTI.start();
        notify(`Connected to host ${roomId}`,'ok');
        Voice.whenPeerOpen();
      });
      conn.on('data',d=>onData(d,conn));
      conn.on('close',()=>{ setPeers([]); setStatus('Disconnected from host.'); renderRoster([]); cleanupClientInputs(); notify('Disconnected from host','warn'); ANTI.stop(); Admin.isAdmin=false; setRoleUI('client'); clearCursors(); Chat.typingClear(); Voice.destroy(); });
    });
    peer.on('call', (call)=>Voice.onIncomingCall(call));
    peer.on('error',err=>{ setStatus('Peer error: '+err.message); notify('Peer error: '+err.message,'warn'); });
  }

  el(`${NS}-btn`)?.addEventListener('click',()=>{ const p=el(`${NS}-panel`); if(p) p.classList.toggle(`${NS}-open`); });
  el(`${NS}-min`)?.addEventListener('click',()=>{ el(`${NS}-panel`)?.classList.remove(`${NS}-open`); });
  el(`${NS}-close`)?.addEventListener('click',()=>{ el(`${NS}-panel`)?.remove(); el(`${NS}-btn`)?.remove(); });

  el(`${NS}-host`)?.addEventListener('click',()=>{ readForm(); const r=(roomInput&&roomInput.value?roomInput.value.trim():'')||('room-'+rid(6)); if(roomInput) roomInput.value=r; LS(`${NS}:room`,r); host(r); });
  el(`${NS}-join`)?.addEventListener('click',()=>{ readForm(); const r=(roomInput&&roomInput.value)?roomInput.value.trim():''; if(!r){ setStatus('Enter a room ID to join.'); notify('Enter a room ID to join','warn'); return; } join(r); });
  el(`${NS}-disconnect`)?.addEventListener('click',()=>Net.disconnect());

  el(`${NS}-syncAllNow`)?.addEventListener('click',()=>hostAction('syncAllNow'));
  el(`${NS}-saveAll`)?.addEventListener('click',()=>hostAction('saveAll'));
  el(`${NS}-spawnGolden`)?.addEventListener('click',()=>hostAction('spawnGolden'));
  el(`${NS}-spawnReindeer`)?.addEventListener('click',()=>hostAction('spawnReindeer'));

  (function(){
    const n=el(`${NS}-maxClients`); if(n){ n.value=String(maxClients); n.addEventListener('change',()=>hostAction('setMaxClients',{value:n.value})); }
    const l=el(`${NS}-lockRoom`); if(l){ l.checked=!!lockRoom; l.addEventListener('change',()=>hostAction('setLockRoom',{value:l.checked})); }
    const a1=el(`${NS}-autoSyncAll`); if(a1){ a1.checked=!!autoSyncAllOnJoin; a1.addEventListener('change',()=>{ autoSyncAllOnJoin=!!a1.checked; LS(KEY_ASYNC,autoSyncAllOnJoin); if(!(Net.role==='host')) Net.sendToHost({type:'adminAct', name:'toggle', args:{id:'autoSyncAll', value:a1.checked}}); }); }
    const a2=el(`${NS}-autoSaveOnJoin`); if(a2){ a2.checked=!!autoSaveOnJoin; a2.addEventListener('change',()=>{ autoSaveOnJoin=!!a2.checked; LS(KEY_ASAVE,autoSaveOnJoin); if(!(Net.role==='host')) Net.sendToHost({type:'adminAct', name:'toggle', args:{id:'autoSaveOnJoin', value:a2.checked}}); }); }
    const af=el(`${NS}-autoFull30`); if(af){ af.checked=!!autoFull30; af.addEventListener('change',()=>hostAction('setAutoFull',{value:af.checked})); }
    const hy=el(`${NS}-forceHybrid`); if(hy){ hy.checked=!!forceHybrid; hy.addEventListener('change',()=>hostAction('setHybrid',{value:hy.checked})); }
    const swr=el(`${NS}-t-specWrink`); if(swr){ swr.checked=!!optSpecWrk; swr.addEventListener('change',()=>{ optSpecWrk=!!swr.checked; LS(KEY_SPEC_WRK,optSpecWrk); if(!(Net.role==='host')) Net.sendToHost({type:'adminAct', name:'toggle', args:{id:'t-specWrink', value:swr.checked}}); }); }
    const spr=el(`${NS}-t-specPrestige`); if(spr){ spr.checked=!!optSpecPre; spr.addEventListener('change',()=>{ optSpecPre=!!spr.checked; LS(KEY_SPEC_PRE,optSpecPre); if(!(Net.role==='host')) Net.sendToHost({type:'adminAct', name:'toggle', args:{id:'t-specPrestige', value:spr.checked}}); }); }
    const cur=el(`${NS}-t-cursors`); if(cur){ cur.checked=!!cursorsEnabled; cur.addEventListener('change',()=>hostAction('setCursors',{value:cur.checked})); }

    const nfj=el(`${NS}-nf-joins`), nfb=el(`${NS}-nf-buys`), nfs=el(`${NS}-nf-shims`), nfa=el(`${NS}-nf-sound`), nfc=el(`${NS}-nf-chat`), nfc2=el(`${NS}-nf-chat2`);
    if(nfj){ nfj.checked=!!nfJoins; nfj.addEventListener('change',()=>{ nfJoins=!!nfj.checked; LS(KEY_NF_J,nfJoins); }); }
    if(nfb){ nfb.checked=!!nfBuys;  nfb.addEventListener('change',()=>{ nfBuys=!!nfb.checked;  LS(KEY_NF_B,nfBuys);  }); }
    if(nfs){ nfs.checked=!!nfShims; nfs.addEventListener('change',()=>{ nfShims=!!nfs.checked; LS(KEY_NF_S,nfShims); }); }
    if(nfa){ nfa.checked=!!nfSound; nfa.addEventListener('change',()=>{ nfSound=!!nfa.checked; LS(KEY_NF_A,nfSound); }); }
    if(nfc){ nfc.checked=!!nfChat;  nfc.addEventListener('change',()=>{ nfChat=!!nfc.checked;  LS(KEY_NF_C,nfChat);  }); }
    if(nfc2){ nfc2.checked=!!nfChat; nfc2.addEventListener('change',()=>{ nfChat=!!nfc2.checked; LS(KEY_NF_C,nfChat); }); }
  })();

  (function(){
    const input=el(`${NS}-chatInput`), send=el(`${NS}-chatSend`);
    function doSend(){ if(!input) return; const v=input.value; input.value=''; Chat.send(v); }
    if(send) send.addEventListener('click',doSend);
    if(input){
      input.addEventListener('keydown',(e)=>{
        if(e.key==='Enter' && !e.shiftKey){
          e.preventDefault(); doSend();
        }else{
          Chat.typingPing();
        }
      });
      input.addEventListener('input',()=>Chat.typingPing());
      input.addEventListener('blur',()=>Chat.typingRemote(PLAYER_ID,'',false) || Chat.typingPing() || 0);
      input.addEventListener('blur',()=>{
        const pkt={type:'typing', pid:PLAYER_ID, on:false};
        if(Net.role==='host'){ Net.broadcast(pkt); } else if(Net.role==='client'){ Net.sendToHost(pkt); }
      });
    }
  })();

  (function(){
    const btnE=el(`${NS}-v-enable`);
    const btnM=el(`${NS}-v-mute`);
    const btnD=el(`${NS}-v-deafen`);
    const ptt=el(`${NS}-v-ptt`);
    const vol=el(`${NS}-v-vol`);
    const sel=el(`${NS}-v-input`);
    const ref=el(`${NS}-v-refresh`);

    if(vol){ vol.value=String(typeof LS(VOICE_KEY_VOL)==='number'? LS(VOICE_KEY_VOL): 1); vol.addEventListener('input',()=>Voice.setVolume(vol.value)); }
    if(ref){ ref.addEventListener('click',()=>Voice.refreshDevices()); }
    if(sel){ sel.addEventListener('change',()=>{ LS(VOICE_KEY_IN, sel.value||''); }); }
    if(btnE){
      btnE.addEventListener('click',async()=>{
        if(btnE.dataset.on==='1'){ Voice.disable(); btnE.dataset.on='0'; btnE.textContent='Enable Mic'; }
        else{
          const ok = await Voice.enable();
          if(ok){ btnE.dataset.on='1'; btnE.textContent='Disable Mic'; }
        }
      });
    }
    if(btnM){ btnM.addEventListener('click',()=>Voice.toggleMute()); }
    if(btnD){ btnD.addEventListener('click',()=>Voice.setDeafen(!(btnD.textContent==='Deafen'))); }
    if(ptt){ ptt.addEventListener('change',()=>Voice.setPTT(!!ptt.checked)); }
  })();

  const pidBadge=el(`${NS}-pid`); if(pidBadge) pidBadge.textContent=shortId(PLAYER_ID);
  const aboutPid=el(`${NS}-aboutPid`); if(aboutPid) aboutPid.textContent=shortId(PLAYER_ID);

  setRoleUI('client');
  switchTab('connect');
  enhanceSections();
  setStatus('Ready. Set your name, then Host or Join.');
  renderRoster([{id:PLAYER_ID, role:(IS_OWNER?'owner':'client'), name: Names.sanitize(LS(DNAME_KEY)||DEFAULT_DNAME), call:''}]);

  window.CCMP={ version:'1.0.2',
    get role(){return Net.role;}, get peers(){return Net.peersList();},
    isAdmin(){ return Admin.isAdmin || IS_OWNER; },
    gban:{ list(){ return GlobalBan.export(); }, add(pid){ if(IS_OWNER){ GlobalBan.add(pid); if(Net.role==='host'){ broadcastGbanPush(); Net.ban(pid);} else if(Net.role==='client'){ Net.sendToHost({type:'adminAct', name:'globalBan', args:{pid}}); } } }, remove(pid){ if(IS_OWNER){ GlobalBan.remove(pid); if(Net.role==='host'){ broadcastGbanPush(); } else if(Net.role==='client'){ Net.sendToHost({type:'adminAct', name:'globalUnban', args:{pid}}); } } } },
    ban(pid){ if(Net.role==='host') Net.ban(pid); else Net.sendToHost({type:'adminAct', name:'ban', args:{pid}}); },
    kick(pid){ if(Net.role==='host') Net.kick(pid); else Net.sendToHost({type:'adminAct', name:'kick', args:{pid}}); },
    grantAdmin(pid){ if(Net.role==='host') { Admin.set.add(pid); Admin.save(Net.room); broadcastRoles(); sendRoster(); } else Net.sendToHost({type:'adminAct', name:'grantAdmin', args:{pid}}); },
    revokeAdmin(pid){ if(Net.role==='host') { Admin.set.delete(pid); Admin.save(Net.room); broadcastRoles(); sendRoster(); } else Net.sendToHost({type:'adminAct', name:'revokeAdmin', args:{pid}}); },
    roster(){ return Net.role==='host'? buildRoster() : (lastRoster||[]); },
    snapshot(){ return captureState({cookies:true,buildings:true,upgrades:true,achievements:true,buffs:true,lumps:true,specs:(optSpecWrk||optSpecPre),specOpts:{wrink:optSpecWrk,prestige:optSpecPre}}); },
    setMyDisplayName(name){ const nm=Names.sanitize(name); LS(DNAME_KEY,nm); if(Net.role==='host'){ Names.set(PLAYER_ID,nm); sendRoster(); Net.broadcast({type:'evt',kind:'nameChange',pid:PLAYER_ID,name:nm}); } else { Net.sendToHost({type:'myName', name:nm}); } },
    destroy(){ Net.disconnect(); try{ ANTI.stop(); }catch(e){} clearCursors(); const p=el(`${NS}-panel`); if(p) p.remove(); const b=el(`${NS}-btn`); if(b) b.remove(); if(style&&style.parentNode) style.parentNode.removeChild(style); delete window.CCMP; }
  };

  if(IS_OWNER){ notify('Owner mode active — full host permissions + global ban','ok'); }
})();
