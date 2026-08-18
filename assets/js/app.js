const $=s=>document.querySelector(s);
document.addEventListener('DOMContentLoaded',()=>{
  const menu=$('.menu'),nav=$('.nav'); if(menu&&nav) menu.onclick=()=>nav.classList.toggle('open');
  if(nav&&!nav.querySelector('a[href="step5.html"]')){const step5=document.createElement('a');step5.href='step5.html';step5.textContent='STEP5';const reference=nav.querySelector('a[href="reference.html"]');nav.insertBefore(step5,reference);}
  const kakaoId=$('#kakaoId');if(kakaoId&&window.SITE_CONFIG?.kakaoId)kakaoId.textContent=window.SITE_CONFIG.kakaoId;
  const kakaoQr=document.querySelector('img[alt="KakaoTalk QRコード"]');if(kakaoQr&&window.SITE_CONFIG?.kakaoQr)kakaoQr.src=window.SITE_CONFIG.kakaoQr;
  document.querySelectorAll('.finish-box p').forEach(p=>{if(p.textContent.includes('韓国古着仕入れツアーへご参加いただき、ありがとうございました。'))p.remove();});
  document.querySelectorAll('.label-size-note').forEach(note=>{
    note.innerHTML=note.innerHTML
      .replace('、荷物の目立つ場所に貼ってください。','。')
      .replace('書き、目立つ場所に貼ってください。','書いてください。');
  });
  document.querySelectorAll('#single-label-guide .row').forEach(row=>{if(row.textContent.includes('荷物の見やすい場所へ貼る'))row.remove();});
  document.querySelectorAll('.card h2').forEach(heading=>{
    if(heading.textContent.trim()==='正しい例・間違った例'&&!heading.parentElement.querySelector('.step2-preview-note')){
      const note=document.createElement('div');
      note.className='note step2-preview-note';
      note.innerHTML='<strong>ラベルの貼り方は、次のSTEP2で説明します。</strong><br>ここでは、複数人で発送する場合の番号と名前の付け方をご確認ください。';
      heading.parentElement.insertBefore(note,heading);
    }
  });
  const showLogin=$('#showLogin'),passwordModal=$('#passwordModal'); if(showLogin&&passwordModal){const openLogin=()=>{passwordModal.classList.remove('hide');passwordModal.setAttribute('aria-hidden','false');showLogin.setAttribute('aria-expanded','true');document.body.classList.add('modal-open');setTimeout(()=>$('#password')?.focus(),120)};const closeLogin=()=>{passwordModal.classList.add('hide');passwordModal.setAttribute('aria-hidden','true');showLogin.setAttribute('aria-expanded','false');document.body.classList.remove('modal-open')};showLogin.addEventListener('click',openLogin);document.querySelectorAll('[data-close-login]').forEach(el=>el.addEventListener('click',closeLogin));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!passwordModal.classList.contains('hide'))closeLogin()});}
  const login=$('#loginForm'); if(login) login.addEventListener('submit',e=>{e.preventDefault(); const p=$('#password').value; if(p===(window.SITE_CONFIG?.password||'tnf0125')){sessionStorage.setItem('ksg-auth','1');sessionStorage.removeItem('ksg-consent');location.href='consent.html'}else $('#error').textContent='パスワードが違います。'});
  if(document.body.dataset.protected==='true'&&!sessionStorage.getItem('ksg-auth')) location.replace('index.html');
  if(document.body.dataset.protected==='true'&&!location.pathname.endsWith('/consent.html')&&!sessionStorage.getItem('ksg-consent')) location.replace('consent.html');
  const consentForm=$('#consentForm'),consentCheck=$('#consentCheck'),consentButton=$('#consentButton');
  if(consentForm&&consentCheck&&consentButton){consentCheck.addEventListener('change',()=>consentButton.disabled=!consentCheck.checked);consentForm.addEventListener('submit',e=>{e.preventDefault();if(!consentCheck.checked)return;sessionStorage.setItem('ksg-consent','1');location.href='home.html';});}
  document.querySelectorAll('[data-shipping-mode]').forEach(el=>el.addEventListener('click',()=>localStorage.setItem('ksg-shipping-mode',el.dataset.shippingMode)));
  const shippingChoice=$('.choice-card'),singleGuide=$('#single-label-guide'),singleChoice=document.querySelector('[data-shipping-mode="single"]');
  if(shippingChoice&&singleGuide&&singleChoice){
    localStorage.removeItem('ksg-shipping-mode');
    singleGuide.classList.add('hide');
    singleChoice.classList.remove('primary');
    singleChoice.classList.add('outline');
    singleChoice.setAttribute('aria-pressed','false');
    singleChoice.addEventListener('click',()=>{
      singleGuide.classList.remove('hide');
      singleChoice.classList.remove('outline');
      singleChoice.classList.add('primary');
      singleChoice.setAttribute('aria-pressed','true');
      setTimeout(()=>singleGuide.scrollIntoView({behavior:'smooth',block:'start'}),0);
    });
  }
  document.querySelectorAll('[data-copy]').forEach(b=>b.onclick=async()=>{const t=document.querySelector(b.dataset.copy)?.innerText||'';await navigator.clipboard.writeText(t);const old=b.textContent;b.textContent='コピーしました';setTimeout(()=>b.textContent=old,1300)});
  const reserve=$('#reserveForm'); if(reserve) reserve.addEventListener('submit',e=>{e.preventDefault();const d=$('#pickupDate').value,h=$('#pickupHour').value;$('#reserveMessage').textContent=`안녕하세요.
호텔에서 짐 수거를 예약하고 싶습니다.
희망 날짜: ${d}
희망 시간: ${h}시
호텔 명함 사진과 짐 사진을 함께 보내드리겠습니다.
감사합니다.`;$('#reserveResult').classList.remove('hide');});

  const modeNotice=$('#modeNotice'), singleCard=$('#singleFormCard'), multiCard=$('#multiFormCard');
  const singleNumberNote=singleCard?.querySelector('.note');if(singleNumberNote?.textContent.includes('一人発送の場合、番号は必要ありません。'))singleNumberNote.remove();
  const multiWarn=multiCard?.querySelector('.warn');if(multiWarn)multiWarn.innerHTML='<strong>ラベルと入力欄の番号を一致させてください。</strong><br>ラベルが「①YAMADA」の荷物は、①のお届け先情報へ入力してください。';
  const circled=n=>n<=20?String.fromCodePoint(0x2460+n-1):`(${n})`;
  let personCount=0;
  const addPerson=()=>{personCount++;const n=personCount, mark=circled(n);const wrap=document.createElement('section');wrap.className='person-card';wrap.dataset.person=n;wrap.innerHTML=`<div class="person-heading"><span>${mark}</span><h3>${mark}の発送情報</h3></div><p class="label-sync"><strong>ラベルと入力欄の番号を一致させてください。</strong><br>ラベルが「${mark}YAMADA」の荷物は、この${mark}のお届け先情報へ入力します。</p><div class="form"><label for="fullName${n}">お名前</label><input id="fullName${n}" placeholder="TARO YAMADA" required></div><div class="form"><label for="zip${n}">郵便番号</label><input id="zip${n}" placeholder="861-1234" required></div><div class="form"><label for="address${n}">英語に変換した住所</label><textarea id="address${n}" placeholder="変換した英語住所を貼り付けてください" required></textarea></div><div class="form"><label for="phone${n}">電話番号</label><input id="phone${n}" inputmode="tel" placeholder="090-1234-5678" required></div>${n>2?'<button class="remove-person" type="button">この人を削除</button>':''}`;$('#peopleFields').appendChild(wrap);wrap.querySelector('.remove-person')?.addEventListener('click',()=>{wrap.remove();renumberPeople();});};
  const renumberPeople=()=>{const cards=[...document.querySelectorAll('.person-card')];personCount=cards.length;cards.forEach((card,i)=>{const mark=circled(i+1);card.dataset.person=i+1;card.querySelector('.person-heading span').textContent=mark;card.querySelector('.person-heading h3').textContent=`${mark}の発送情報`;card.querySelector('.label-sync').innerHTML=`<strong>ラベルと入力欄の番号を一致させてください。</strong><br>ラベルが「${mark}YAMADA」の荷物は、この${mark}のお届け先情報へ入力します。`;});};
  const showMode=mode=>{localStorage.setItem('ksg-shipping-mode',mode);modeNotice?.classList.add('hide');singleCard?.classList.toggle('hide',mode!=='single');multiCard?.classList.toggle('hide',mode!=='multi');$('#shipResult')?.classList.add('hide');if(mode==='multi'&&personCount===0){addPerson();addPerson();}};
  if(modeNotice){const saved=localStorage.getItem('ksg-shipping-mode');if(saved==='single'||saved==='multi')showMode(saved);else modeNotice.classList.remove('hide');document.querySelectorAll('[data-set-mode]').forEach(b=>b.addEventListener('click',()=>showMode(b.dataset.setMode)));}
  $('#addPerson')?.addEventListener('click',addPerson);
  $('#shipFormSingle')?.addEventListener('submit',e=>{e.preventDefault();const v=id=>$(id).value.trim();$('#shipMessage').textContent=`[일본 배송 요청]

성명: ${v('#singleName')}
우편번호: ${v('#singleZip')}
주소: ${v('#singleAddress')}
전화번호: ${v('#singlePhone')}

일본으로 배송 부탁드립니다.`;$('#shipResult').classList.remove('hide');$('#shipResult').scrollIntoView({behavior:'smooth'});});
  $('#shipFormMulti')?.addEventListener('submit',e=>{e.preventDefault();const cards=[...document.querySelectorAll('.person-card')];const blocks=cards.map((card,i)=>{const mark=circled(i+1),q=s=>card.querySelector(s).value.trim();return `[${mark}]
성명: ${q('[id^="fullName"]')}
우편번호: ${q('[id^="zip"]')}
주소: ${q('[id^="address"]')}
전화번호: ${q('[id^="phone"]')}`;});$('#shipMessage').textContent=`[일본 배송 요청 - 여러 명]

${blocks.join('\n\n')}

일본으로 배송 부탁드립니다.`;$('#shipResult').classList.remove('hide');$('#shipResult').scrollIntoView({behavior:'smooth'});});
});
