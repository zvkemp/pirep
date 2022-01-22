import e from"../../lib/codemirror.js";(function(t){t(e)})((function(e){e.defineOption("styleSelectedText",false,(function(t,r,n){var o=n&&n!=e.Init;if(r&&!o){t.state.markedSelection=[];t.state.markedSelectionStyle="string"==typeof r?r:"CodeMirror-selectedtext";reset(t);t.on("cursorActivity",onCursorActivity);t.on("change",onChange)}else if(!r&&o){t.off("cursorActivity",onCursorActivity);t.off("change",onChange);clear(t);t.state.markedSelection=t.state.markedSelectionStyle=null}}));function onCursorActivity(e){e.state.markedSelection&&e.operation((function(){update(e)}))}function onChange(e){e.state.markedSelection&&e.state.markedSelection.length&&e.operation((function(){clear(e)}))}var t=8;var r=e.Pos;var n=e.cmpPos;function coverRange(e,o,i,a){if(0!=n(o,i)){var l=e.state.markedSelection;var c=e.state.markedSelectionStyle;for(var f=o.line;;){var s=f==o.line?o:r(f,0);var v=f+t,u=v>=i.line;var d=u?i:r(v,0);var m=e.markText(s,d,{className:c});null==a?l.push(m):l.splice(a++,0,m);if(u)break;f=v}}}function clear(e){var t=e.state.markedSelection;for(var r=0;r<t.length;++r)t[r].clear();t.length=0}function reset(e){clear(e);var t=e.listSelections();for(var r=0;r<t.length;r++)coverRange(e,t[r].from(),t[r].to())}function update(e){if(!e.somethingSelected())return clear(e);if(e.listSelections().length>1)return reset(e);var r=e.getCursor("start"),o=e.getCursor("end");var i=e.state.markedSelection;if(!i.length)return coverRange(e,r,o);var a=i[0].find(),l=i[i.length-1].find();if(!a||!l||o.line-r.line<=t||n(r,l.to)>=0||n(o,a.from)<=0)return reset(e);while(n(r,a.from)>0){i.shift().clear();a=i[0].find()}if(n(r,a.from)<0)if(a.to.line-r.line<t){i.shift().clear();coverRange(e,r,a.to,0)}else coverRange(e,r,a.from,0);while(n(o,l.to)<0){i.pop().clear();l=i[i.length-1].find()}if(n(o,l.to)>0)if(o.line-l.from.line<t){i.pop().clear();coverRange(e,l.from,o)}else coverRange(e,l.to,o)}}));var t={};export{t as default};

