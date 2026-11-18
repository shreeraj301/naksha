/* Fits a page title to its measure. Plain script, run from the page head; see components/Fit.tsx. */
export const FIT_SCRIPT = `window.nkFit=function(el,again){
var reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
var w=function(x){el.style.fontVariationSettings='"wdth" '+x+', "wght" 800';return el.getBoundingClientRect().width};
var solve=function(){el.classList.remove("go");el.style.fontSize="";var cw=el.parentElement.clientWidth,fs=parseFloat(getComputedStyle(el).fontSize);
if(w(62)>cw){el.style.fontSize=fs*cw/w(62)+"px";return 62}
if(w(125)<cw){el.style.fontSize=Math.min(fs*cw/w(125),innerHeight*.4)+"px";return 125}
var lo=62,hi=125;for(var k=0;k<14;k++){var m=(lo+hi)/2;if(w(m)>cw)hi=m;else lo=m}return lo};
var run=function(){var t=solve();el.style.visibility="visible";el.dataset.fitted="";
if(again||reduce){w(t);return}w(62);el.getBoundingClientRect();el.classList.add("go");requestAnimationFrame(function(){w(t)})};
if(again)return run();
(document.fonts&&document.fonts.load?document.fonts.load('800 1em "Archivo Flex"').catch(function(){}):Promise.resolve()).then(run)};`;
