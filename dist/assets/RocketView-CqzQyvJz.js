import{_ as d,i as a,c as n,b as r,t as o,F as m,r as p,n as c,x as v,g as M,q as b,v as y,s as f,e as g,f as u}from"./index-BrsEyug6.js";const x={setup(){return{user:a()}},data(){return{bet:null,isPlaying:!1,currentMultiplier:1,crashMultiplier:1,result:null,intervalId:null}},computed:{rocketPosition(){return{bottom:`${Math.min(this.currentMultiplier/20*100,100)}%`}},resultMessage(){return this.result==="cashout"?`💰 Успешно! Вы забрали ${(this.bet*this.currentMultiplier).toFixed(2)}₽ - ${this.currentMultiplier.toFixed(2)}x`:this.result==="crash"?`💥 Краш! Ракета рухнула на ${this.currentMultiplier.toFixed(2)}x`:""}},methods:{handleBetInput(){this.$refs.betInput.blur()},resetFormPosition(){window.scrollTo({top:0,behavior:"smooth"})},startGame(){const e=a();this.bet>e.money||this.bet<=0||(e.minusMoney(this.bet),this.isPlaying=!0,this.result=null,this.currentMultiplier=1,this.crashMultiplier=this.generateCrashPoint(),this.intervalId=setInterval(()=>{this.currentMultiplier+=.01,this.currentMultiplier>=this.crashMultiplier&&this.gameCrash()},90))},generateCrashPoint(){const e=Math.random();return e<.7?1+Math.pow(e/.55,1.5)*.5:e<.95?1.5+Math.pow((e-.7)/.45,2)*.5:2+Math.pow((e-.95)/.1,1.5)*998},cashOut(){const e=a();if(!this.isPlaying)return;this.result="cashout",this.isPlaying=!1;const t=this.bet*this.currentMultiplier;e.addMoney(t),clearInterval(this.intervalId)},gameCrash(){this.result="crash",this.isPlaying=!1,clearInterval(this.intervalId)}}},_={class:"container"},P={class:"game-area"},k={class:"multiplier-display"},I={class:"current-multiplier"},w={class:"scale-markers"},F={class:"flight-area"},C={key:0,class:"controls"},B=["max"],V=["disabled"],A={key:1,class:"controls"};function G(e,t,N,h,i,l){return u(),n("div",_,[r("div",P,[r("div",k,[r("div",I,o(i.currentMultiplier.toFixed(2))+"x",1),r("div",w,[(u(),n(m,null,p(5,s=>r("span",{key:s},o(s)+"x",1)),64))])]),r("div",F,[r("div",{class:c(["rocket",{crashed:!i.isPlaying&&i.result==="crash"}]),style:v(l.rocketPosition)},t[5]||(t[5]=[r("div",{class:"flame"},null,-1),M(" 🚀 ")]),6),t[6]||(t[6]=r("div",{class:"dotted-line"},null,-1))])]),i.isPlaying?(u(),n("div",A,[r("button",{onClick:t[4]||(t[4]=(...s)=>l.cashOut&&l.cashOut(...s)),class:"cash-out"},"ЗАБРАТЬ "+o((i.bet*i.currentMultiplier).toFixed(2)),1)])):(u(),n("div",C,[b(r("input",{ref:"betInput","onUpdate:modelValue":t[0]||(t[0]=s=>i.bet=s),type:"number",min:"1",max:h.user.money,placeholder:"Сумма ставки",onBlur:t[1]||(t[1]=(...s)=>l.resetFormPosition&&l.resetFormPosition(...s)),onKeyup:t[2]||(t[2]=f((...s)=>l.handleBetInput&&l.handleBetInput(...s),["enter"]))},null,40,B),[[y,i.bet,void 0,{number:!0}]]),r("button",{onClick:t[3]||(t[3]=(...s)=>l.startGame&&l.startGame(...s)),disabled:!i.bet},"Старт",8,V)])),i.result?(u(),n("div",{key:2,class:c(["result",i.result])},o(l.resultMessage),3)):g("",!0)])}const S=d(x,[["render",G],["__scopeId","data-v-ea181297"]]);export{S as default};
