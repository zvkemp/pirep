import*as e from"fs";var t="default"in e?e.default:e;var r="undefined"!==typeof globalThis?globalThis:"undefined"!==typeof self?self:global;var a={};var s;(function(){
/**
   * Typo constructor.
   *
   * @param {String} [dictionary] The locale code of the dictionary being used. e.g.,
   *                              "en_US". This is only used to auto-load dictionaries.
   * @param {String} [affData]    The data from the dictionary's .aff file. If omitted
   *                              and Typo.js is being used in a Chrome extension, the .aff
   *                              file will be loaded automatically from
   *                              lib/typo/dictionaries/[dictionary]/[dictionary].aff
   *                              In other environments, it will be loaded from
   *                              [settings.dictionaryPath]/dictionaries/[dictionary]/[dictionary].aff
   * @param {String} [wordsData]  The data from the dictionary's .dic file. If omitted
   *                              and Typo.js is being used in a Chrome extension, the .dic
   *                              file will be loaded automatically from
   *                              lib/typo/dictionaries/[dictionary]/[dictionary].dic
   *                              In other environments, it will be loaded from
   *                              [settings.dictionaryPath]/dictionaries/[dictionary]/[dictionary].dic
   * @param {Object} [settings]   Constructor settings. Available properties are:
   *                              {String} [dictionaryPath]: path to load dictionary from in non-chrome
   *                              environment.
   *                              {Object} [flags]: flag information.
   *                              {Boolean} [asyncLoad]: If true, affData and wordsData will be loaded
   *                              asynchronously.
   *                              {Function} [loadedCallback]: Called when both affData and wordsData
   *                              have been loaded. Only used if asyncLoad is set to true. The parameter
   *                              is the instantiated Typo object.
   *
   * @returns {Typo} A Typo object.
   */
s=function(e,t,a,s){s=s||{};(this||r).dictionary=null;(this||r).rules={};(this||r).dictionaryTable={};(this||r).compoundRules=[];(this||r).compoundRuleCodes={};(this||r).replacementTable=[];(this||r).flags=s.flags||{};(this||r).memoized={};(this||r).loaded=false;var i=this||r;var n;var o,l,u,f;if(e){i.dictionary=e;if(t&&a)setup();else if("undefined"!==typeof window&&"chrome"in window&&"extension"in window.chrome&&"getURL"in window.chrome.extension){n=s.dictionaryPath?s.dictionaryPath:"typo/dictionaries";t||readDataFile(chrome.extension.getURL(n+"/"+e+"/"+e+".aff"),setAffData);a||readDataFile(chrome.extension.getURL(n+"/"+e+"/"+e+".dic"),setWordsData)}else{n=s.dictionaryPath?s.dictionaryPath:"undefined"!==typeof new URL(import.meta.url.slice(0,import.meta.url.lastIndexOf("/"))).pathname?new URL(import.meta.url.slice(0,import.meta.url.lastIndexOf("/"))).pathname+"/dictionaries":"./dictionaries";t||readDataFile(n+"/"+e+"/"+e+".aff",setAffData);a||readDataFile(n+"/"+e+"/"+e+".dic",setWordsData)}}function readDataFile(e,t){var r=i._readFile(e,null,s.asyncLoad);s.asyncLoad?r.then((function(e){t(e)})):t(r)}function setAffData(e){t=e;a&&setup()}function setWordsData(e){a=e;t&&setup()}function setup(){i.rules=i._parseAFF(t);i.compoundRuleCodes={};for(o=0,u=i.compoundRules.length;o<u;o++){var e=i.compoundRules[o];for(l=0,f=e.length;l<f;l++)i.compoundRuleCodes[e[l]]=[]}"ONLYINCOMPOUND"in i.flags&&(i.compoundRuleCodes[i.flags.ONLYINCOMPOUND]=[]);i.dictionaryTable=i._parseDIC(a);for(o in i.compoundRuleCodes)0===i.compoundRuleCodes[o].length&&delete i.compoundRuleCodes[o];for(o=0,u=i.compoundRules.length;o<u;o++){var r=i.compoundRules[o];var n="";for(l=0,f=r.length;l<f;l++){var c=r[l];c in i.compoundRuleCodes?n+="("+i.compoundRuleCodes[c].join("|")+")":n+=c}i.compoundRules[o]=new RegExp(n,"i")}i.loaded=true;s.asyncLoad&&s.loadedCallback&&s.loadedCallback(i)}return this||r};s.prototype={
/**
     * Loads a Typo instance from a hash of all of the Typo properties.
     *
     * @param object obj A hash of Typo properties, probably gotten from a JSON.parse(JSON.stringify(typo_instance)).
     */
load:function(e){for(var t in e)e.hasOwnProperty(t)&&((this||r)[t]=e[t]);return this||r},
/**
     * Read the contents of a file.
     * 
     * @param {String} path The path (relative) to the file.
     * @param {String} [charset="ISO8859-1"] The expected charset of the file
     * @param {Boolean} async If true, the file will be read asynchronously. For node.js this does nothing, all
     *        files are read synchronously.
     * @returns {String} The file data if async is false, otherwise a promise object. If running node.js, the data is
     *          always returned.
     */
_readFile:function(e,r,a){r=r||"utf8";if("undefined"!==typeof XMLHttpRequest){var s;var i=new XMLHttpRequest;i.open("GET",e,a);a&&(s=new Promise((function(e,t){i.onload=function(){200===i.status?e(i.responseText):t(i.statusText)};i.onerror=function(){t(i.statusText)}})));i.overrideMimeType&&i.overrideMimeType("text/plain; charset="+r);i.send(null);return a?s:i.responseText}var n=t;try{if(n.existsSync(e))return n.readFileSync(e,r);console.log("Path "+e+" does not exist.")}catch(e){console.log(e);return""}},
/**
     * Parse the rules out from a .aff file.
     *
     * @param {String} data The contents of the affix file.
     * @returns object The rules from the file.
     */
_parseAFF:function(e){var t={};var a,s,i,n;var o,l,u,f;var c=e.split(/\r?\n/);for(o=0,u=c.length;o<u;o++){a=this._removeAffixComments(c[o]);a=a.trim();if(a){var d=a.split(/\s+/);var h=d[0];if("PFX"==h||"SFX"==h){var p=d[1];var v=d[2];i=parseInt(d[3],10);var m=[];for(l=o+1,f=o+1+i;l<f;l++){s=c[l];n=s.split(/\s+/);var g=n[2];var y=n[3].split("/");var C=y[0];"0"===C&&(C="");var b=this.parseRuleCodes(y[1]);var R=n[4];var w={};w.add=C;b.length>0&&(w.continuationClasses=b);"."!==R&&(w.match="SFX"===h?new RegExp(R+"$"):new RegExp("^"+R));"0"!=g&&(w.remove="SFX"===h?new RegExp(g+"$"):g);m.push(w)}t[p]={type:h,combineable:"Y"==v,entries:m};o+=i}else if("COMPOUNDRULE"===h){i=parseInt(d[1],10);for(l=o+1,f=o+1+i;l<f;l++){a=c[l];n=a.split(/\s+/);(this||r).compoundRules.push(n[1])}o+=i}else if("REP"===h){n=a.split(/\s+/);3===n.length&&(this||r).replacementTable.push([n[1],n[2]])}else(this||r).flags[h]=d[1]}}return t},
/**
     * Removes comments.
     *
     * @param {String} data A line from an affix file.
     * @return {String} The cleaned-up line.
     */
_removeAffixComments:function(e){return e.match(/^\s*#/,"")?"":e},
/**
     * Parses the words out from the .dic file.
     *
     * @param {String} data The data from the dictionary file.
     * @returns object The lookup table containing all of the words and
     *                 word forms from the dictionary.
     */
_parseDIC:function(e){e=this._removeDicComments(e);var t=e.split(/\r?\n/);var a={};function addWord(e,t){a.hasOwnProperty(e)||(a[e]=null);if(t.length>0){null===a[e]&&(a[e]=[]);a[e].push(t)}}for(var s=1,i=t.length;s<i;s++){var n=t[s];if(n){var o=n.split("/",2);var l=o[0];if(o.length>1){var u=this.parseRuleCodes(o[1]);"NEEDAFFIX"in(this||r).flags&&-1!=u.indexOf((this||r).flags.NEEDAFFIX)||addWord(l,u);for(var f=0,c=u.length;f<c;f++){var d=u[f];var h=(this||r).rules[d];if(h){var p=this._applyRule(l,h);for(var v=0,m=p.length;v<m;v++){var g=p[v];addWord(g,[]);if(h.combineable)for(var y=f+1;y<c;y++){var C=u[y];var b=(this||r).rules[C];if(b&&b.combineable&&h.type!=b.type){var R=this._applyRule(g,b);for(var w=0,x=R.length;w<x;w++){var F=R[w];addWord(F,[])}}}}}d in(this||r).compoundRuleCodes&&(this||r).compoundRuleCodes[d].push(l)}}else addWord(l.trim(),[])}}return a},
/**
     * Removes comment lines and then cleans up blank lines and trailing whitespace.
     *
     * @param {String} data The data from a .dic file.
     * @return {String} The cleaned-up data.
     */
_removeDicComments:function(e){e=e.replace(/^\t.*$/gm,"");return e},parseRuleCodes:function(e){if(!e)return[];if(!("FLAG"in(this||r).flags))return e.split("");if("long"===(this||r).flags.FLAG){var t=[];for(var a=0,s=e.length;a<s;a+=2)t.push(e.substr(a,2));return t}return"num"===(this||r).flags.FLAG?e.split(","):void 0},
/**
     * Applies an affix rule to a word.
     *
     * @param {String} word The base word.
     * @param {Object} rule The affix rule.
     * @returns {String[]} The new words generated by the rule.
     */
_applyRule:function(e,t){var a=t.entries;var s=[];for(var i=0,n=a.length;i<n;i++){var o=a[i];if(!o.match||e.match(o.match)){var l=e;o.remove&&(l=l.replace(o.remove,""));"SFX"===t.type?l+=o.add:l=o.add+l;s.push(l);if("continuationClasses"in o)for(var u=0,f=o.continuationClasses.length;u<f;u++){var c=(this||r).rules[o.continuationClasses[u]];c&&(s=s.concat(this._applyRule(l,c)))}}}return s},
/**
     * Checks whether a word or a capitalization variant exists in the current dictionary.
     * The word is trimmed and several variations of capitalizations are checked.
     * If you want to check a word without any changes made to it, call checkExact()
     *
     * @see http://blog.stevenlevithan.com/archives/faster-trim-javascript re:trimming function
     *
     * @param {String} aWord The word to check.
     * @returns {Boolean}
     */
check:function(e){if(!(this||r).loaded)throw"Dictionary not loaded.";var t=e.replace(/^\s\s*/,"").replace(/\s\s*$/,"");if(this.checkExact(t))return true;if(t.toUpperCase()===t){var a=t[0]+t.substring(1).toLowerCase();if(this.hasFlag(a,"KEEPCASE"))return false;if(this.checkExact(a))return true;if(this.checkExact(t.toLowerCase()))return true}var s=t[0].toLowerCase()+t.substring(1);if(s!==t){if(this.hasFlag(s,"KEEPCASE"))return false;if(this.checkExact(s))return true}return false},
/**
     * Checks whether a word exists in the current dictionary.
     *
     * @param {String} word The word to check.
     * @returns {Boolean}
     */
checkExact:function(e){if(!(this||r).loaded)throw"Dictionary not loaded.";var t=(this||r).dictionaryTable[e];var a,s;if("undefined"===typeof t){if("COMPOUNDMIN"in(this||r).flags&&e.length>=(this||r).flags.COMPOUNDMIN)for(a=0,s=(this||r).compoundRules.length;a<s;a++)if(e.match((this||r).compoundRules[a]))return true}else{if(null===t)return true;if("object"===typeof t)for(a=0,s=t.length;a<s;a++)if(!this.hasFlag(e,"ONLYINCOMPOUND",t[a]))return true}return false},
/**
     * Looks up whether a given word is flagged with a given flag.
     *
     * @param {String} word The word in question.
     * @param {String} flag The flag in question.
     * @return {Boolean}
     */
hasFlag:function(e,t,a){if(!(this||r).loaded)throw"Dictionary not loaded.";if(t in(this||r).flags){"undefined"===typeof a&&(a=Array.prototype.concat.apply([],(this||r).dictionaryTable[e]));if(a&&-1!==a.indexOf((this||r).flags[t]))return true}return false},
/**
     * Returns a list of suggestions for a misspelled word.
     *
     * @see http://www.norvig.com/spell-correct.html for the basis of this suggestor.
     * This suggestor is primitive, but it works.
     *
     * @param {String} word The misspelling.
     * @param {Number} [limit=5] The maximum number of suggestions to return.
     * @returns {String[]} The array of suggestions.
     */
alphabet:"",suggest:function(e,t){if(!(this||r).loaded)throw"Dictionary not loaded.";t=t||5;if((this||r).memoized.hasOwnProperty(e)){var a=(this||r).memoized[e].limit;if(t<=a||(this||r).memoized[e].suggestions.length<a)return(this||r).memoized[e].suggestions.slice(0,t)}if(this.check(e))return[];for(var s=0,i=(this||r).replacementTable.length;s<i;s++){var n=(this||r).replacementTable[s];if(-1!==e.indexOf(n[0])){var o=e.replace(n[0],n[1]);if(this.check(o))return[o]}}var l=this||r;l.alphabet="abcdefghijklmnopqrstuvwxyz";function edits1(e,t){var r={};var a,s,i,n;var o=l.alphabet.length;if("string"==typeof e){var u=e;e={};e[u]=true}for(var u in e)for(a=0,i=u.length+1;a<i;a++){var f=[u.substring(0,a),u.substring(a)];if(f[1]){n=f[0]+f[1].substring(1);t&&!l.check(n)||(n in r?r[n]+=1:r[n]=1)}if(f[1].length>1&&f[1][1]!==f[1][0]){n=f[0]+f[1][1]+f[1][0]+f[1].substring(2);t&&!l.check(n)||(n in r?r[n]+=1:r[n]=1)}if(f[1]){var c=f[1].substring(0,1).toUpperCase()===f[1].substring(0,1)?"uppercase":"lowercase";for(s=0;s<o;s++){var d=l.alphabet[s];"uppercase"===c&&(d=d.toUpperCase());if(d!=f[1].substring(0,1)){n=f[0]+d+f[1].substring(1);t&&!l.check(n)||(n in r?r[n]+=1:r[n]=1)}}}if(f[1])for(s=0;s<o;s++){c=f[0].substring(-1).toUpperCase()===f[0].substring(-1)&&f[1].substring(0,1).toUpperCase()===f[1].substring(0,1)?"uppercase":"lowercase";d=l.alphabet[s];"uppercase"===c&&(d=d.toUpperCase());n=f[0]+d+f[1];t&&!l.check(n)||(n in r?r[n]+=1:r[n]=1)}}return r}function correct(e){var r=edits1(e);var a=edits1(r,true);var s=a;for(var i in r)l.check(i)&&(i in s?s[i]+=r[i]:s[i]=r[i]);var n;var o=[];for(n in s)s.hasOwnProperty(n)&&o.push([n,s[n]]);function sorter(e,t){var r=e[1];var a=t[1];return r<a?-1:r>a?1:t[0].localeCompare(e[0])}o.sort(sorter).reverse();var u=[];var f="lowercase";e.toUpperCase()===e?f="uppercase":e.substr(0,1).toUpperCase()+e.substr(1).toLowerCase()===e&&(f="capitalized");var c=t;for(n=0;n<Math.min(c,o.length);n++){"uppercase"===f?o[n][0]=o[n][0].toUpperCase():"capitalized"===f&&(o[n][0]=o[n][0].substr(0,1).toUpperCase()+o[n][0].substr(1));l.hasFlag(o[n][0],"NOSUGGEST")||-1!=u.indexOf(o[n][0])?c++:u.push(o[n][0])}return u}(this||r).memoized[e]={suggestions:correct(e),limit:t};return(this||r).memoized[e].suggestions}}})();a=s;var i=a;export{i as default};

