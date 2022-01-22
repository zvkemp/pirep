import t from"../../lib/codemirror.js";var e="undefined"!==typeof globalThis?globalThis:"undefined"!==typeof self?self:global;(function(e){e(t)})((function(t){var r={autoSelfClosers:{area:true,base:true,br:true,col:true,command:true,embed:true,frame:true,hr:true,img:true,input:true,keygen:true,link:true,meta:true,param:true,source:true,track:true,wbr:true,menuitem:true},implicitlyClosed:{dd:true,li:true,optgroup:true,option:true,p:true,rp:true,rt:true,tbody:true,td:true,tfoot:true,th:true,tr:true},contextGrabbers:{dd:{dd:true,dt:true},dt:{dd:true,dt:true},li:{li:true},option:{option:true,optgroup:true},optgroup:{optgroup:true},p:{address:true,article:true,aside:true,blockquote:true,dir:true,div:true,dl:true,fieldset:true,footer:true,form:true,h1:true,h2:true,h3:true,h4:true,h5:true,h6:true,header:true,hgroup:true,hr:true,menu:true,nav:true,ol:true,p:true,pre:true,section:true,table:true,ul:true},rp:{rp:true,rt:true},rt:{rp:true,rt:true},tbody:{tbody:true,tfoot:true},td:{td:true,th:true},tfoot:{tbody:true},th:{td:true,th:true},thead:{tbody:true,tfoot:true},tr:{tr:true}},doNotIndent:{pre:true},allowUnquoted:true,allowMissing:true,caseFold:true};var n={autoSelfClosers:{},implicitlyClosed:{},contextGrabbers:{},doNotIndent:{},allowUnquoted:false,allowMissing:false,allowMissingTagName:false,caseFold:false};t.defineMode("xml",(function(a,o){var u=a.indentUnit;var i={};var l=o.htmlMode?r:n;for(var s in l)i[s]=l[s];for(var s in o)i[s]=o[s];var c,f;function inText(t,e){function chain(r){e.tokenize=r;return r(t,e)}var r=t.next();if("<"==r){if(t.eat("!")){if(t.eat("["))return t.match("CDATA[")?chain(inBlock("atom","]]>")):null;if(t.match("--"))return chain(inBlock("comment","--\x3e"));if(t.match("DOCTYPE",true,true)){t.eatWhile(/[\w\._\-]/);return chain(doctype(1))}return null}if(t.eat("?")){t.eatWhile(/[\w\._\-]/);e.tokenize=inBlock("meta","?>");return"meta"}c=t.eat("/")?"closeTag":"openTag";e.tokenize=inTag;return"tag bracket"}if("&"==r){var n;n=t.eat("#")?t.eat("x")?t.eatWhile(/[a-fA-F\d]/)&&t.eat(";"):t.eatWhile(/[\d]/)&&t.eat(";"):t.eatWhile(/[\w\.\-:]/)&&t.eat(";");return n?"atom":"error"}t.eatWhile(/[^&<]/);return null}inText.isInText=true;function inTag(t,e){var r=t.next();if(">"==r||"/"==r&&t.eat(">")){e.tokenize=inText;c=">"==r?"endTag":"selfcloseTag";return"tag bracket"}if("="==r){c="equals";return null}if("<"==r){e.tokenize=inText;e.state=baseState;e.tagName=e.tagStart=null;var n=e.tokenize(t,e);return n?n+" tag error":"tag error"}if(/[\'\"]/.test(r)){e.tokenize=inAttribute(r);e.stringStartCol=t.column();return e.tokenize(t,e)}t.match(/^[^\s\u00a0=<>\"\']*[^\s\u00a0=<>\"\'\/]/);return"word"}function inAttribute(t){var closure=function(e,r){while(!e.eol())if(e.next()==t){r.tokenize=inTag;break}return"string"};closure.isInAttribute=true;return closure}function inBlock(t,e){return function(r,n){while(!r.eol()){if(r.match(e)){n.tokenize=inText;break}r.next()}return t}}function doctype(t){return function(e,r){var n;while(null!=(n=e.next())){if("<"==n){r.tokenize=doctype(t+1);return r.tokenize(e,r)}if(">"==n){if(1==t){r.tokenize=inText;break}r.tokenize=doctype(t-1);return r.tokenize(e,r)}}return"meta"}}function lower(t){return t&&t.toLowerCase()}function Context(t,r,n){(this||e).prev=t.context;(this||e).tagName=r||"";(this||e).indent=t.indented;(this||e).startOfLine=n;(i.doNotIndent.hasOwnProperty(r)||t.context&&t.context.noIndent)&&((this||e).noIndent=true)}function popContext(t){t.context&&(t.context=t.context.prev)}function maybePopContext(t,e){var r;while(true){if(!t.context)return;r=t.context.tagName;if(!i.contextGrabbers.hasOwnProperty(lower(r))||!i.contextGrabbers[lower(r)].hasOwnProperty(lower(e)))return;popContext(t)}}function baseState(t,e,r){if("openTag"==t){r.tagStart=e.column();return tagNameState}return"closeTag"==t?closeTagNameState:baseState}function tagNameState(t,e,r){if("word"==t){r.tagName=e.current();f="tag";return attrState}if(i.allowMissingTagName&&"endTag"==t){f="tag bracket";return attrState(t,e,r)}f="error";return tagNameState}function closeTagNameState(t,e,r){if("word"==t){var n=e.current();r.context&&r.context.tagName!=n&&i.implicitlyClosed.hasOwnProperty(lower(r.context.tagName))&&popContext(r);if(r.context&&r.context.tagName==n||false===i.matchClosing){f="tag";return closeState}f="tag error";return closeStateErr}if(i.allowMissingTagName&&"endTag"==t){f="tag bracket";return closeState(t,e,r)}f="error";return closeStateErr}function closeState(t,e,r){if("endTag"!=t){f="error";return closeState}popContext(r);return baseState}function closeStateErr(t,e,r){f="error";return closeState(t,e,r)}function attrState(t,e,r){if("word"==t){f="attribute";return attrEqState}if("endTag"==t||"selfcloseTag"==t){var n=r.tagName,a=r.tagStart;r.tagName=r.tagStart=null;if("selfcloseTag"==t||i.autoSelfClosers.hasOwnProperty(lower(n)))maybePopContext(r,n);else{maybePopContext(r,n);r.context=new Context(r,n,a==r.indented)}return baseState}f="error";return attrState}function attrEqState(t,e,r){if("equals"==t)return attrValueState;i.allowMissing||(f="error");return attrState(t,e,r)}function attrValueState(t,e,r){if("string"==t)return attrContinuedState;if("word"==t&&i.allowUnquoted){f="string";return attrState}f="error";return attrState(t,e,r)}function attrContinuedState(t,e,r){return"string"==t?attrContinuedState:attrState(t,e,r)}return{startState:function(t){var e={tokenize:inText,state:baseState,indented:t||0,tagName:null,tagStart:null,context:null};null!=t&&(e.baseIndent=t);return e},token:function(t,e){!e.tagName&&t.sol()&&(e.indented=t.indentation());if(t.eatSpace())return null;c=null;var r=e.tokenize(t,e);if((r||c)&&"comment"!=r){f=null;e.state=e.state(c||r,t,e);f&&(r="error"==f?r+" error":f)}return r},indent:function(e,r,n){var a=e.context;if(e.tokenize.isInAttribute)return e.tagStart==e.indented?e.stringStartCol+1:e.indented+u;if(a&&a.noIndent)return t.Pass;if(e.tokenize!=inTag&&e.tokenize!=inText)return n?n.match(/^(\s*)/)[0].length:0;if(e.tagName)return false!==i.multilineTagIndentPastTag?e.tagStart+e.tagName.length+2:e.tagStart+u*(i.multilineTagIndentFactor||1);if(i.alignCDATA&&/<!\[CDATA\[/.test(r))return 0;var o=r&&/^<(\/)?([\w_:\.-]*)/.exec(r);if(o&&o[1])while(a){if(a.tagName==o[2]){a=a.prev;break}if(!i.implicitlyClosed.hasOwnProperty(lower(a.tagName)))break;a=a.prev}else if(o)while(a){var l=i.contextGrabbers[lower(a.tagName)];if(!l||!l.hasOwnProperty(lower(o[2])))break;a=a.prev}while(a&&a.prev&&!a.startOfLine)a=a.prev;return a?a.indent+u:e.baseIndent||0},electricInput:/<\/[\s\w:]+>$/,blockCommentStart:"\x3c!--",blockCommentEnd:"--\x3e",configuration:i.htmlMode?"html":"xml",helperType:i.htmlMode?"html":"xml",skipAttribute:function(t){t.state==attrValueState&&(t.state=attrState)},xmlCurrentTag:function(t){return t.tagName?{name:t.tagName,close:"closeTag"==t.type}:null},xmlCurrentContext:function(t){var e=[];for(var r=t.context;r;r=r.prev)e.push(r.tagName);return e.reverse()}}}));t.defineMIME("text/xml","xml");t.defineMIME("application/xml","xml");t.mimeModes.hasOwnProperty("text/html")||t.defineMIME("text/html",{name:"xml",htmlMode:true})}));var r={};export{r as default};

