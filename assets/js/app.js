const $=s=>document.querySelector(s);
document.addEventListener('DOMContentLoaded',()=>{
  const menu=$('.menu'),nav=$('.nav'); if(menu&&nav) menu.onclick=()=>nav.classList.toggle('open');
  const showLogin=$('#showLogin'),passwordModal=$('#passwordModal'); if(showLogin&&passwordModal){const openLogin=()=>{passwordModal.classList.remove('hide');passwordModal.setAttribute('aria-hidden','false');showLogin.setAttribute('aria-expanded','true');document.body.classList.add('modal-open');setTimeout(()=>$('#password')?.focus(),120)};const closeLogin=()=>{passwordModal.classList.add('hide');passwordModal.setAttribute('aria-hidden','true');showLogin.setAttribute('aria-expanded','false');document.body.classList.remove('modal-open')};showLogin.addEventListener('click',openLogin);document.querySelectorAll('[data-close-login]').forEach(el=>el.addEventListener('click',closeLogin));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!passwordModal.classList.contains('hide'))closeLogin()});}
  const login=$('#loginForm'); if(login) login.addEventListener('submit',e=>{e.preventDefault(); const p=$('#password').value; if(p==='tnf0125'){sessionStorage.setItem('ksg-auth','1');location.href='home.html'}else $('#error').textContent='パスワードが違います。'});
  if(document.body.dataset.protected==='true'&&!sessionStorage.getItem('ksg-auth')) location.replace('index.html');
  document.querySelectorAll('[data-shipping-mode]').forEach(el=>el.addEventListener('click',()=>localStorage.setItem('ksg-shipping-mode',el.dataset.shippingMode)));
  document.querySelectorAll('[data-copy]').forEach(b=>b.onclick=async()=>{const t=document.querySelector(b.dataset.copy)?.innerText||'';await navigator.clipboard.writeText(t);const old=b.textContent;b.textContent='コピーしました';setTimeout(()=>b.textContent=old,1300)});
  const reserve=$('#reserveForm'); if(reserve) reserve.addEventListener('submit',e=>{e.preventDefault();const d=$('#pickupDate').value,h=$('#pickupHour').value;$('#reserveMessage').textContent=`안녕하세요.
호텔에서 짐 수거를 예약하고 싶습니다.
희망 날짜: ${d}
희망 시간: ${h}시
호텔 명함 사진과 짐 사진을 함께 보내드리겠습니다.
감사합니다.`;$('#reserveResult').classList.remove('hide');});

  const modeNotice=$('#modeNotice'), singleCard=$('#singleFormCard'), multiCard=$('#multiFormCard');
  const circled=n=>n<=20?String.fromCodePoint(0x2460+n-1):`(${n})`;
  let personCount=0;
  const addPerson=()=>{personCount++;const n=personCount, mark=circled(n);const wrap=document.createElement('section');wrap.className='person-card';wrap.dataset.person=n;wrap.innerHTML=`<div class="person-heading"><span>${mark}</span><h3>${mark}の発送情報</h3></div><p class="label-sync">荷物のラベル：<strong>${mark}<span class="live-label-name">名前</span></strong></p><div class="form"><label for="labelName${n}">ラベルに書いた名前</label><input id="labelName${n}" class="label-name" placeholder="YAMADA" required><p class="hint">ラベルと同じローマ字の名前を入力してください。</p></div><div class="form"><label for="fullName${n}">お名前</label><input id="fullName${n}" placeholder="TARO YAMADA" required></div><div class="form"><label for="zip${n}">郵便番号</label><input id="zip${n}" placeholder="861-1234" required></div><div class="form"><label for="address${n}">英語に変換した住所</label><textarea id="address${n}" placeholder="変換した英語住所を貼り付けてください" required></textarea></div><div class="form"><label for="phone${n}">電話番号</label><input id="phone${n}" inputmode="tel" placeholder="090-1234-5678" required></div>${n>2?'<button class="remove-person" type="button">この人を削除</button>':''}`;$('#peopleFields').appendChild(wrap);wrap.querySelector('.label-name').addEventListener('input',e=>wrap.querySelector('.live-label-name').textContent=e.target.value.trim().toUpperCase()||'名前');wrap.querySelector('.remove-person')?.addEventListener('click',()=>{wrap.remove();renumberPeople();});};
  const renumberPeople=()=>{const cards=[...document.querySelectorAll('.person-card')];personCount=cards.length;cards.forEach((card,i)=>{const mark=circled(i+1);card.dataset.person=i+1;card.querySelector('.person-heading span').textContent=mark;card.querySelector('.person-heading h3').textContent=`${mark}の発送情報`;card.querySelector('.label-sync').firstChild.textContent='荷物のラベル：';card.querySelector('.label-sync strong').firstChild.textContent=mark;});};
  const showMode=mode=>{localStorage.setItem('ksg-shipping-mode',mode);modeNotice?.classList.add('hide');singleCard?.classList.toggle('hide',mode!=='single');multiCard?.classList.toggle('hide',mode!=='multi');$('#shipResult')?.classList.add('hide');if(mode==='multi'&&personCount===0){addPerson();addPerson();}};
  if(modeNotice){const saved=localStorage.getItem('ksg-shipping-mode');if(saved==='single'||saved==='multi')showMode(saved);else modeNotice.classList.remove('hide');document.querySelectorAll('[data-set-mode]').forEach(b=>b.addEventListener('click',()=>showMode(b.dataset.setMode)));}
  $('#addPerson')?.addEventListener('click',addPerson);
  $('#shipFormSingle')?.addEventListener('submit',e=>{e.preventDefault();const v=id=>$(id).value.trim();$('#shipMessage').textContent=`[일본 배송 요청]

성명: ${v('#singleName')}
우편번호: ${v('#singleZip')}
주소: ${v('#singleAddress')}
전화번호: ${v('#singlePhone')}

일본으로 배송 부탁드립니다.`;$('#shipResult').classList.remove('hide');$('#shipResult').scrollIntoView({behavior:'smooth'});});
  $('#shipFormMulti')?.addEventListener('submit',e=>{e.preventDefault();const cards=[...document.querySelectorAll('.person-card')];const blocks=cards.map((card,i)=>{const mark=circled(i+1),q=s=>card.querySelector(s).value.trim();return `[${mark}${q('.label-name').toUpperCase()}]
성명: ${q('[id^="fullName"]')}
우편번호: ${q('[id^="zip"]')}
주소: ${q('[id^="address"]')}
전화번호: ${q('[id^="phone"]')}`;});$('#shipMessage').textContent=`[일본 배송 요청 - 여러 명]

${blocks.join('\n\n')}

일본으로 배송 부탁드립니다.`;$('#shipResult').classList.remove('hide');$('#shipResult').scrollIntoView({behavior:'smooth'});});
});