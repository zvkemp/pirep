import e from"../../lib/codemirror.js";(function(a){a(e)})((function(e){e.overlayMode=function(a,r,o){return{startState:function(){return{base:e.startState(a),overlay:e.startState(r),basePos:0,baseCur:null,overlayPos:0,overlayCur:null,streamSeen:null}},copyState:function(o){return{base:e.copyState(a,o.base),overlay:e.copyState(r,o.overlay),basePos:o.basePos,baseCur:null,overlayPos:o.overlayPos,overlayCur:null}},token:function(e,n){if(e!=n.streamSeen||Math.min(n.basePos,n.overlayPos)<e.start){n.streamSeen=e;n.basePos=n.overlayPos=e.start}if(e.start==n.basePos){n.baseCur=a.token(e,n.base);n.basePos=e.pos}if(e.start==n.overlayPos){e.pos=e.start;n.overlayCur=r.token(e,n.overlay);n.overlayPos=e.pos}e.pos=Math.min(n.basePos,n.overlayPos);return null==n.overlayCur?n.baseCur:null!=n.baseCur&&n.overlay.combineTokens||o&&null==n.overlay.combineTokens?n.baseCur+" "+n.overlayCur:n.overlayCur},indent:a.indent&&function(e,r,o){return a.indent(e.base,r,o)},electricChars:a.electricChars,innerMode:function(e){return{state:e.base,mode:a}},blankLine:function(e){var n,t;a.blankLine&&(n=a.blankLine(e.base));r.blankLine&&(t=r.blankLine(e.overlay));return null==t?n:o&&null!=n?n+" "+t:t}}}}));var a={};export{a as default};

