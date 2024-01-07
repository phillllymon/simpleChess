(()=>{"use strict";const e={p:"&#9817",r:"&#9814",n:"&#9816",b:"&#9815",q:"&#9813",k:"&#9812",P:"&#9823",R:"&#9820",N:"&#9822",B:"&#9821",Q:"&#9819",K:"&#9818"};function t(e){const t=[],n=e.split("");for(let e=7;e>-1;e--)t.push(n.slice(8*e,8*e+8));return t}function n(e){let t=function(e){let t="";for(let n=7;n>-1;n--)t+=e[n].join("");return t}(e.grid);return t+=e.turn,t+=e.canCastle.join(""),e.enPassant&&(t+=e.enPassant.join("")),t}function d(){document.playerControl=!0}function a(){document.playerControl=!1}function s(t,n=!0){const d=document.getElementById("board"),a=d.children,s=[];for(let e=0;e<a.length;e++)s.push(""+a[e].innerHTML);d.innerHTML="",t.forEach(((t,d)=>{t.forEach(((t,a)=>{const m=document.createElement("div");m.id=""+d+a,m.classList.add("space"),(d+a)%2==0?m.classList.add("white_space"):m.classList.add("black_space"),"-"!==t&&(m.innerHTML=function(t){return e[t]}(t),m.classList.add("piece"),m.addEventListener("mousedown",(e=>{!function(e){document.dragging=!0,document.dragOrigin=e,e.style.color="rgba(0, 0, 0, 0.5)";const t=document.getElementById("dragging_piece");t.innerHTML=e.innerHTML,t.style.top=`${e.getBoundingClientRect().top}px`,t.style.left=`${e.getBoundingClientRect().left}px`}(e.target)}))),s.length>0&&n&&s[8*d+a]!==m.innerHTML&&m.classList.add("highlighted_space"),m.addEventListener("mouseup",(e=>{!function(e){const t=document.getElementById("dragging_piece");document.dragging&&document.dragOrigin.id===e.id?(t.innerHTML="",document.dragOrigin.style.color="black",document.dragging=!1,document.dragOrigin=!1,o(e)):document.dragging?(c(document.dragOrigin,e),t.innerHTML="",document.dragOrigin.style.color="black",document.dragging=!1,document.dragOrigin=!1):o(e)}(e.target)})),[d,a]===document.game.selectedSpace?.id?.split("")&&m.classList.add("selected"),document.getElementById("board").appendChild(m)}))}))}function o(e){console.log(document.playerControl),document.playerControl&&(document.game.selectedSpace?e.id===document.game.selectedSpace.id?(document.game.selectedSpace=!1,e.classList.remove("selected")):c(document.game.selectedSpace,e).then((t=>{t?document.game.selectedSpace=!1:(document.game.selectedSpace.classList.remove("selected"),document.game.selectedSpace=e,e.classList.add("selected"))})):(document.game.selectedSpace=e,e.classList.add("selected")))}function c(e,t){return a(),new Promise((a=>{const o=function(e,t){const n=i(e),d=i(t),a=[n,d],s=document.game.grid[e[0]][e[1]];return"k"!==s&&"K"!==s||(t[1]-e[1]>1||e[1]-t[1]>1)&&a.push("castle"),"p"!==s&&"P"!==s||d[1]!==n[1]&&"-"===document.game.grid[t[0]][t[1]]&&a.push("enPassant"),"p"!==s&&"P"!==s||0!==d[0]&&7!==d[0]||a.push("p"===s?"q":"Q"),a}(e.id.split("").map((e=>parseInt(e))),t.id.split("").map((e=>parseInt(e))));(function(e){return new Promise((t=>{console.log(document.game.players),"human"===document.game.players[document.game.turn]?fetch("https://airbackend.com/chessMove/api.php",{method:"POST",body:JSON.stringify({request:"checkMove",gameState:n(document.game),move:e})}).then((e=>{e.json().then((e=>{console.log("---------------"),console.log(e),console.log("---------------"),t(e.moveValid)}))})):(console.log("it's not your turn!"),t(!1))}))})(o).then((e=>{if(e){!function(e,t){const n=i(t[0]),d=i(t[1]),a=e[n[0]][n[1]];if("castle"===t[2]&&(d[1]>n[1]?(e[d[0]][(n[1]+d[1])/2]=e[d[0]][7],e[d[0]][7]="-"):(e[d[0]][(n[1]+d[1])/2]=e[d[0]][0],e[d[0]][0]="-")),document.game.enPassant){if("p"===a&&d[1]===document.game.enPassant[1]){const t=i(document.game.enPassant);d[0]===t[0]-1&&(e[t[0]][t[1]]="-")}if("P"===a&&d[1]===document.game.enPassant[1]){const t=i(document.game.enPassant);d[0]===t[0]+1&&(e[t[0]][t[1]]="-")}}"p"===a&&(n[0]-d[0]>1?document.game.enPassant=i(d):document.game.enPassant=!1),"P"===a&&(d[0]-n[0]>1?document.game.enPassant=i(d):document.game.enPassant=!1),e[d[0]][d[1]]=e[n[0]][n[1]],e[n[0]][n[1]]="-"}(document.game.grid,o),s(document.game.grid);const e="b"===document.game.turn?"black":"white";if(document.getElementById(`${e}_turn`).classList.add("hidden"),document.game.turn="w"===document.game.turn?"b":"w","ai"===document.game.players[document.game.turn]){m();const e="b"===document.game.turn?"white":"black";document.getElementById(`${e}_turn`).classList.add("hidden")}else{d();const e="w"===document.game.turn?"white":"black";document.getElementById(`${e}_turn`).classList.remove("hidden")}a(!0)}else d(),a(!1)}))}))}function m(){a();const e="w"===document.game.turn?"white":"black",o="b"===document.game.turn?"white":"black",c=document.getElementById(`${o}_turn`);c.classList.add("hidden");const i=document.getElementById(`${e}_message`);i.classList.remove("hidden"),new Promise((e=>{(function(e=3){return console.log(n(document.game)),new Promise((t=>{fetch("https://airbackend.com/chessMove/api.php",{method:"POST",body:JSON.stringify({request:"nextMove",gameState:n(document.game),level:e})}).then((e=>{e.json().then((e=>{console.log("---------------"),console.log(e),console.log("---------------"),e.gameOver?t(e.gameOver):t(e.next)}))}))}))})(document.game.aiLevels[document.game.turn]).then((n=>{if(n.length<64)alert(n);else if(document.rejectAiMove)document.rejectAiMove=!1;else{const a={grid:t(d=n),turn:d[64],canCastle:d.split("").slice(65,69),enPassant:d.length>69?d.split("").slice(69,71):void 0};console.log(a),document.game.grid=a.grid,document.game.canCastle=a.canCastle,document.game.turn=a.turn,a.enPassant&&(document.game.enPassant=a.enPassant),s(a.grid),e(!0)}var d})).catch((t=>{console.log("ERROR "+t.message),e(!1)}))})).then((e=>{e&&(i.classList.add("hidden"),"ai"===document.game.players[document.game.turn]?m():(d(),c.classList.remove("hidden")))}))}function i(e){return[7-e[0],e[1]]}function l(){const e="w"===document.game.turn?"b":"w";"human"===document.game.players[document.game.turn]&&"ai"===document.game.players[e]&&m(),"ai"===document.game.players[document.game.turn]&&"human"===document.game.players[e]&&(document.rejectAiMove=!0,document.playerControl=!0);const t={player:document.game.players.w,aiLevel:document.game.aiLevels.w};document.game.players.w=document.game.players.b,document.game.aiLevels.w=document.game.aiLevels.b,document.game.players.b=t.player,document.game.aiLevels.b=t.aiLevel,u(),["black","white"].forEach((e=>{const t="white"===e?"w":"b",n=document.getElementById(`${e}_human_button`),d=document.getElementById(`${e}_ai_button`),a=document.getElementById(`${e}_human`),s=document.getElementById(`${e}_select_level`),o=document.getElementById(`${e}_turn`),c=document.getElementById(`${e}_ai_levels_1`),m=document.getElementById(`${e}_ai_levels_2`);"human"===document.game.players[t]?(n.classList.add("control_button_selected"),d.classList.remove("control_button_selected"),a.classList.remove("hidden"),document.game.turn===t?o.classList.remove("hidden"):o.classList.add("hidden"),s.classList.add("hidden"),c.classList.add("hidden"),m.classList.add("hidden"),console.log("poooooooop")):(n.classList.remove("control_button_selected"),d.classList.add("control_button_selected"),a.classList.add("hidden"),s.classList.remove("hidden"),o.classList.add("hidden"),c.classList.remove("hidden"),m.classList.remove("hidden"),console.log("hiding "+e+" yourTurn")),document.getElementById(`${e}_message`).classList.add("hidden")}))}function u(){const e=document.getElementById("board"),t=document.getElementById("board_controls");e.classList.contains("board_flipped")?(e.classList.remove("board_flipped"),t.classList.remove("board_controls_flipped")):(e.classList.add("board_flipped"),t.classList.add("board_controls_flipped"))}function r(e,t,n){e.forEach((e=>{document.getElementById(e).classList.remove("control_button_selected")})),document.getElementById(t).classList.add("control_button_selected"),n()}!function(){const e=document.getElementById("play_tab"),t=document.getElementById("api_tab"),n=document.getElementById("play_section"),d=document.getElementById("api_section");t.addEventListener("click",(()=>{n.classList.add("hidden"),d.classList.remove("hidden"),e.classList.add("inactive_tab"),t.classList.remove("inactive_tab")})),e.addEventListener("click",(()=>{n.classList.remove("hidden"),d.classList.add("hidden"),e.classList.remove("inactive_tab"),t.classList.add("inactive_tab")}))}(),document.game={grid:[["R","N","B","Q","K","B","N","R"],["P","P","P","P","P","P","P","P"],["-","-","-","-","-","-","-","-"],["-","-","-","-","-","-","-","-"],["-","-","-","-","-","-","-","-"],["-","-","-","-","-","-","-","-"],["p","p","p","p","p","p","p","p"],["r","n","b","q","k","b","n","r"]],turn:"w",canCastle:[1,1,1,1],enPassant:!1,gameOver:!1,players:{w:"human",b:"ai"},aiLevels:{w:3,b:3},selectedSpace:!1},s(document.game.grid),"human"===document.game.players[document.game.turn]?document.playerControl=!0:document.playerControl=!1,["white","black"].forEach((e=>{const t=document.getElementById(`${e}_ai_button`),n=document.getElementById(`${e}_human_button`),d=[`${e}_ai_button`,`${e}_human_button`],a="white"===e?"w":"b";t.addEventListener("click",(()=>{document.game.turn===a&&"ai"!==document.game.players[a]&&m(),r(d,`${e}_ai_button`,(()=>{"white"===e?document.game.players.w="ai":document.game.players.b="ai"})),[`${e}_human`,`${e}_turn`].forEach((e=>{document.getElementById(e).classList.add("hidden")})),[`${e}_select_level`,`${e}_ai_levels_1`,`${e}_ai_levels_2`].forEach((e=>{document.getElementById(e).classList.remove("hidden")}))})),n.addEventListener("click",(()=>{r(d,`${e}_human_button`,(()=>{"white"===e?document.game.players.w="human":document.game.players.b="human"})),[`${e}_select_level`,`${e}_ai_levels_1`,`${e}_ai_levels_2`,`${e}_message`].forEach((e=>{document.getElementById(e).classList.add("hidden")})),[`${e}_human`].forEach((e=>{document.getElementById(e).classList.remove("hidden")})),document.game.turn===a&&document.getElementById(`${e}_turn`).classList.remove("hidden")}))})),["white","black"].forEach((e=>{const t=[`${e}_0_button`,`${e}_1_button`,`${e}_2_button`,`${e}_3_button`,`${e}_4_button`,`${e}_5_button`];for(let n=0;n<6;n++){const d=`${e}_${n}_button`;document.getElementById(d).addEventListener("click",(()=>{r(t,d,(()=>{"white"===e?document.game.aiLevels.w=n:document.game.aiLevels.b=n}))}))}})),function(){const e=document.getElementById("neutral_button_message"),t=document.getElementById("turn_board_button"),n=document.getElementById("switch_sides_button");n.addEventListener("mouseenter",(()=>{e.innerHTML="switch sides"})),n.addEventListener("mouseleave",(()=>{e.innerHTML=""})),t.addEventListener("mouseenter",(()=>{e.innerHTML="flip perspective"})),t.addEventListener("mouseleave",(()=>{e.innerHTML=""})),t.addEventListener("click",u),n.addEventListener("click",l)}(),document.getElementById("restart_button").addEventListener("click",(()=>{document.game={grid:[["R","N","B","Q","K","B","N","R"],["P","P","P","P","P","P","P","P"],["-","-","-","-","-","-","-","-"],["-","-","-","-","-","-","-","-"],["-","-","-","-","-","-","-","-"],["-","-","-","-","-","-","-","-"],["p","p","p","p","p","p","p","p"],["r","n","b","q","k","b","n","r"]],turn:"w",canCastle:[1,1,1,1],enPassant:!1,gameOver:!1,players:{w:document.game.players.w,b:document.game.players.b},aiLevels:{w:document.game.aiLevels.w,b:document.game.aiLevels.b},selectedSpace:!1},document.selectedPieces={dragging:!1,selected:!1},s(document.game.grid,!1),"human"===document.game.players[document.game.turn]?document.playerControl=!0:(document.playerControl=!1,m())})),document.rejectAiMove=!1,document.dragging=!1,document.dragOrigin=!1;const g=document.getElementById("board"),p=document.getElementById("dragging_piece");g.addEventListener("mousemove",(e=>{document.dragging&&(console.log(p),console.log(e.clientX),p.style.left=e.clientX-40+"px",p.style.top=e.clientY-40+"px")})),g.addEventListener("mouseleave",(e=>{document.dragOrigin.style.color="black",document.dragging=!1,document.dragOrigin=!1,p.innerHTML=""}));const h=["thinking&nbsp;&nbsp;&nbsp;&nbsp;","thinking.&nbsp;&nbsp;&nbsp;","thinking..&nbsp;&nbsp;","thinking...&nbsp;","thinking...."];let _=0;setInterval((()=>{_+=1,_>h.length-1&&(_=0),["black","white"].forEach((e=>{document.getElementById(`${e}_message`).innerHTML=h[_]}))}),750)})();