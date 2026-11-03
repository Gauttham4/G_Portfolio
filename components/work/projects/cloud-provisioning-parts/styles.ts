// CloudDesk console styles. Everything is prefixed `cd-`. Animates transform/opacity only.
export const CSS = `
.cd-root{--dim:#9FB0CE;--line:rgba(148,170,210,.18);--ok:#34D399;--warn:#FBBF24;--bad:#F87171;
  --mono:var(--font-jetbrains),ui-monospace,monospace;--space:var(--font-space),'Space Grotesk',system-ui,sans-serif;
  background:var(--bg);color:var(--text);font-family:var(--space);overflow-x:clip;position:relative}
.cd-root *{box-sizing:border-box}
.cd-mono{font-family:var(--mono)}
.cd-eyebrow{font-family:var(--mono);font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:var(--aq)}
.cd-h2{font-family:var(--space);font-weight:700;letter-spacing:-.025em;line-height:1.05;font-size:clamp(1.9rem,6vw,3.25rem);margin:.6rem 0 0}
.cd-panel{background:linear-gradient(180deg,rgba(255,255,255,.04),rgba(255,255,255,.01)),var(--panel);border:1px solid var(--line);border-radius:16px}
.cd-gridbg{background-image:linear-gradient(var(--line) 1px,transparent 1px),linear-gradient(90deg,var(--line) 1px,transparent 1px);background-size:44px 44px}
.cd-focus:focus-visible,.cd-root button:focus-visible{outline:2px solid var(--aq);outline-offset:2px}

/* scroll reveal */
[data-cd]{opacity:0;transform:translateY(16px);transition:opacity .6s cubic-bezier(.16,1,.3,1) var(--d,0ms),transform .6s cubic-bezier(.16,1,.3,1) var(--d,0ms)}
[data-cd].is-in{opacity:1;transform:none}

/* resource state: spinner -> running */
.cd-state{display:inline-grid;font-family:var(--mono);font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;min-width:112px}
.cd-state>*{grid-area:1/1;display:inline-flex;align-items:center;gap:8px;align-self:center}
.cd-pend{color:var(--aq);transition:opacity .3s}
.cd-ok{color:var(--ok);opacity:0;transition:opacity .45s}
.cd-spin{width:14px;height:14px;border-radius:50%;border:2px solid rgba(34,227,255,.25);border-top-color:var(--aq);animation:cd-rot .8s linear infinite}
.cd-dot{position:relative;width:8px;height:8px;border-radius:50%;background:var(--dc,var(--ok))}
.cd-dot::after{content:'';position:absolute;inset:0;border-radius:50%;background:var(--dc,var(--ok));animation:cd-ring 2s ease-out infinite}
.cd-rc.run .cd-pend,.cd-rc.cd-auto.is-in .cd-pend{opacity:0}
.cd-rc.run .cd-ok,.cd-rc.cd-auto.is-in .cd-ok{opacity:1}
.cd-auto .cd-pend,.cd-auto .cd-ok,.cd-auto .cd-bar i{transition-delay:calc(var(--d,0ms) + 900ms)}
.cd-bar{height:4px;border-radius:4px;background:rgba(148,170,210,.16);overflow:hidden}
.cd-bar i{display:block;height:100%;width:100%;border-radius:4px;background:linear-gradient(90deg,var(--blue),var(--aq));transform-origin:left;transform:scaleX(.04);transition:transform 1.2s cubic-bezier(.65,0,.35,1)}
.cd-rc.run .cd-bar i,.cd-rc.cd-auto.is-in .cd-bar i{transform:scaleX(var(--w,1))}
.cd-rc{transition:transform .25s cubic-bezier(.16,1,.3,1),border-color .25s}
@media (hover:hover){.cd-rc:hover{border-color:rgba(34,227,255,.5)}}

/* terminal */
.cd-term{white-space:pre-wrap;overflow-wrap:anywhere;font-family:var(--mono);font-size:12.5px;line-height:1.7}
.cd-cur{display:inline-block;width:.6em;height:1.05em;vertical-align:-.15em;background:var(--aq);animation:cd-blink 1s steps(1) infinite}

/* gauge */
.cd-arc{animation:cd-arc 1.5s cubic-bezier(.65,0,.35,1) both}
.cd-spinring{transform-box:fill-box;transform-origin:center;animation:cd-rot 40s linear infinite}

/* region map */
.cd-ring{transform-box:fill-box;transform-origin:center;animation:cd-node 2.4s ease-out infinite;animation-delay:var(--d,0s)}

/* marquee */
.cd-marq{display:flex;width:max-content;animation:cd-marq 38s linear infinite}

/* architecture flow */
.cd-vl{width:2px;height:28px;margin:0 auto;background:linear-gradient(var(--aq),var(--blue));transform-origin:top;transform:scaleY(0);transition:transform .6s ease var(--d,0ms)}
.cd-hl{height:2px;background:linear-gradient(90deg,var(--blue),var(--aq),var(--blue));transform:scaleX(0);transition:transform .8s ease var(--d,0ms)}
.cd-flow.is-in .cd-vl{transform:scaleY(1)}
.cd-flow.is-in .cd-hl{transform:scaleX(1)}
.cd-tab-in{animation:cd-fade .5s cubic-bezier(.16,1,.3,1) both}

@keyframes cd-rot{to{transform:rotate(360deg)}}
@keyframes cd-ring{from{transform:scale(1);opacity:.55}to{transform:scale(3);opacity:0}}
@keyframes cd-node{from{transform:scale(1);opacity:.7}to{transform:scale(3.2);opacity:0}}
@keyframes cd-blink{50%{opacity:0}}
@keyframes cd-arc{from{stroke-dashoffset:100}}
@keyframes cd-marq{to{transform:translateX(-50%)}}
@keyframes cd-fade{from{opacity:0;transform:translateY(10px)}}

@media (prefers-reduced-motion:reduce){
  .cd-root *,.cd-root *::before,.cd-root *::after{animation:none!important;transition:none!important}
  [data-cd]{opacity:1;transform:none}
  .cd-pend{display:none}.cd-ok{opacity:1}
  .cd-bar i{transform:scaleX(var(--w,1))}
  .cd-vl{transform:scaleY(1)}.cd-hl{transform:scaleX(1)}
  .cd-cur{display:none}
}
`;
