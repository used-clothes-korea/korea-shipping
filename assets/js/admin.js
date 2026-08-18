(()=>{
  const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
  const base=structuredClone(window.SITE_CONFIG||{});
  const draftKey='ksg-admin-draft-v1';
  const pageLabels={home:'ホーム',step0:'STEP0 KakaoTalk追加',step1:'STEP1 荷物ラベル',step2:'STEP2 ラベルの貼り方',step3:'STEP3 集荷予約',step4:'STEP4 お届け先情報',step5:'STEP5 集荷当日の流れ'};
  const imageDefinitions=[
    ['kakaoQr','KakaoTalk QRコード','assets/images/kakao-qr-placeholder.svg'],
    ['singleLabel','STEP1 一人用ラベル例','assets/images/label-on-bag-hq.jpg'],
    ['multiLabel','STEP1 複数人用ラベル例','assets/images/multi-label-example.jpg'],
    ['step2Bags','STEP2 ラベルを貼った荷物','assets/images/bags-photo.jpg'],
    ['hotelCard','ホテル名刺の参考画像','assets/images/hotel-business-card-example.png'],
    ['referenceGuide','荷物写真の良い例・悪い例','assets/images/reference-guide.png']
  ];
  let state=structuredClone(base);
  const value=id=>document.getElementById(id)?.value??'';
  const setValue=(id,v)=>{const el=document.getElementById(id);if(el)el.value=v??'';};
  const populateHours=()=>{for(const id of ['pickupStartHour','pickupEndHour']){const select=document.getElementById(id);select.innerHTML='';for(let h=0;h<=23;h++){const option=document.createElement('option');option.value=h;option.textContent=`${h}時`;select.appendChild(option);}}};
  const buildTextFields=()=>{$('#pageTextFields').innerHTML=Object.entries(pageLabels).map(([key,label])=>`<div class="form"><label for="pageText_${key}">${label}</label><textarea id="pageText_${key}" data-page-text="${key}"></textarea></div>`).join('');};
  const buildImageFields=()=>{$('#imageFields').innerHTML=imageDefinitions.map(([key,label,fallback])=>`<article class="image-admin-item"><div class="admin-image-preview"><img data-image-preview="${key}" src="${state.images?.[key]||fallback}" alt="${label}"></div><div><h3>${label}</h3><label class="btn outline file-button">画像を選択<input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" data-image-input="${key}"></label><button class="btn light image-reset" type="button" data-image-reset="${key}">元の画像へ戻す</button><p class="hint" data-image-status="${key}">変更なし</p></div></article>`).join('');};
  const readForm=()=>{
    state.password=value('sitePassword').trim()||base.password;
    state.adminPassword=value('adminPassword').trim()||base.adminPassword;
    state.kakaoId=value('kakaoIdAdmin').trim();state.carrierName=value('carrierName').trim();state.carrierContact=value('carrierContact').trim();state.judressUrl=value('judressUrl').trim();
    state.pickupStartHour=Number(value('pickupStartHour'));state.pickupEndHour=Number(value('pickupEndHour'));
    state.pickupPrefix=value('pickupPrefix');state.pickupSuffix=value('pickupSuffix');state.shippingPrefix=value('shippingPrefix');state.shippingSuffix=value('shippingSuffix');
    state.announcement={enabled:$('#announcementEnabled').checked,text:value('announcementText')};
    state.pageText={};$$('[data-page-text]').forEach(el=>state.pageText[el.dataset.pageText]=el.value);
    return state;
  };
  const writeForm=cfg=>{
    state=structuredClone(cfg);state.images=state.images||{};state.pageText={...base.pageText,...(state.pageText||{})};state.announcement={...base.announcement,...(state.announcement||{})};
    setValue('sitePassword',state.password);setValue('adminPassword',state.adminPassword);setValue('kakaoIdAdmin',state.kakaoId);setValue('carrierName',state.carrierName);setValue('carrierContact',state.carrierContact);setValue('judressUrl',state.judressUrl);
    setValue('pickupStartHour',state.pickupStartHour);setValue('pickupEndHour',state.pickupEndHour);setValue('pickupPrefix',state.pickupPrefix);setValue('pickupSuffix',state.pickupSuffix);setValue('shippingPrefix',state.shippingPrefix);setValue('shippingSuffix',state.shippingSuffix);
    $('#announcementEnabled').checked=!!state.announcement.enabled;setValue('announcementText',state.announcement.text);
    $$('[data-page-text]').forEach(el=>el.value=state.pageText[el.dataset.pageText]||'');buildImageFields();bindImageEvents();updatePreviews();
  };
  const joinMessage=(before,body,after)=>[before.trim(),body.trim(),after.trim()].filter(Boolean).join('\n\n');
  const updatePreviews=()=>{
    const start=Number(value('pickupStartHour')),end=Number(value('pickupEndHour'));$('#timeRangePreview').textContent=start<=end?`STEP3には ${start}時〜${end}時 を表示します。`:'終了時間は開始時間以降に設定してください。';
    $('#pickupMessagePreview').textContent=joinMessage(value('pickupPrefix'),`안녕하세요.\n호텔에서 짐 수거를 예약하고 싶습니다.\n희망 날짜: 2026-08-20\n희망 시간: ${start}시\n호텔 명함 사진과 짐 사진을 함께 보내드리겠습니다.\n감사합니다.`,value('pickupSuffix'));
    $('#shippingMessagePreview').textContent=joinMessage(value('shippingPrefix'),`[일본 배송 요청]\n\n성명: TARO YAMADA\n우편번호: 100-0001\n주소: Tokyo, Japan\n전화번호: 090-1234-5678\n\n일본으로 배송 부탁드립니다.`,value('shippingSuffix'));
  };
  const bindImageEvents=()=>{
    $$('[data-image-input]').forEach(input=>input.addEventListener('change',()=>{const file=input.files?.[0];if(!file)return;if(file.size>8*1024*1024){alert('画像は8MB以下にしてください。');input.value='';return;}const reader=new FileReader();reader.onload=()=>{state.images[input.dataset.imageInput]=reader.result;document.querySelector(`[data-image-preview="${input.dataset.imageInput}"]`).src=reader.result;document.querySelector(`[data-image-status="${input.dataset.imageInput}"]`).textContent=`選択済み：${file.name}`;};reader.readAsDataURL(file);}));
    $$('[data-image-reset]').forEach(button=>button.addEventListener('click',()=>{delete state.images[button.dataset.imageReset];const def=imageDefinitions.find(x=>x[0]===button.dataset.imageReset);document.querySelector(`[data-image-preview="${button.dataset.imageReset}"]`).src=def[2];document.querySelector(`[data-image-status="${button.dataset.imageReset}"]`).textContent='元の画像を使用';}));
  };
  const serialize=cfg=>`window.SITE_CONFIG=${JSON.stringify(cfg,null,2)};\n`;
  const download=(name,text,type='application/javascript;charset=utf-8')=>{const blob=new Blob([text],{type}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
  const validate=()=>{readForm();if(state.pickupStartHour>state.pickupEndHour){alert('集荷希望時間の終了時間は、開始時間以降に設定してください。');return false}if(!state.password||!state.adminPassword){alert('パスワードを入力してください。');return false}return true;};
  const bindImageConfig=()=>{state.kakaoQr=state.images.kakaoQr||'assets/images/kakao-qr-placeholder.svg';};
  document.addEventListener('DOMContentLoaded',()=>{
    populateHours();buildTextFields();buildImageFields();bindImageEvents();writeForm(base);
    $('#adminLoginForm').addEventListener('submit',e=>{e.preventDefault();if(value('adminLoginPassword')===(window.SITE_CONFIG.adminPassword||'')){sessionStorage.setItem('ksg-admin-auth','1');$('#adminLogin').classList.add('hide');$('#adminApp').classList.remove('hide');}else $('#adminError').textContent='管理者パスワードが違います。';});
    if(sessionStorage.getItem('ksg-admin-auth')==='1'){$('#adminLogin').classList.add('hide');$('#adminApp').classList.remove('hide');}
    $('#adminLogout').addEventListener('click',()=>{sessionStorage.removeItem('ksg-admin-auth');location.reload();});
    $$('[data-admin-tab]').forEach(button=>button.addEventListener('click',()=>{$$('[data-admin-tab]').forEach(b=>b.classList.toggle('active',b===button));$$('[data-admin-panel]').forEach(p=>p.classList.toggle('hide',p.dataset.adminPanel!==button.dataset.adminTab));}));
    $('#adminForm').addEventListener('input',updatePreviews);$('#adminForm').addEventListener('change',updatePreviews);
    $('#saveDraft').addEventListener('click',()=>{if(!validate())return;bindImageConfig();localStorage.setItem(draftKey,JSON.stringify(state));$('#saveStatus').textContent='この端末に保存しました。';$('#saveStatus').classList.remove('hide');});
    $('#downloadConfig').addEventListener('click',()=>{if(!validate())return;bindImageConfig();download('config.js',serialize(state));});
    $('#downloadBackup').addEventListener('click',()=>{if(!validate())return;bindImageConfig();download(`korea-shipping-guide-backup-${new Date().toISOString().slice(0,10)}.json`,JSON.stringify(state,null,2),'application/json;charset=utf-8');});
    $('#restoreBackup').addEventListener('change',()=>{const file=$('#restoreBackup').files?.[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{try{writeForm(JSON.parse(reader.result));alert('バックアップを読み込みました。');}catch{alert('バックアップファイルを読み込めませんでした。');}};reader.readAsText(file);});
    $('#previewSite').addEventListener('click',()=>{if(!validate())return;bindImageConfig();localStorage.setItem('ksg-preview-config',JSON.stringify(state));window.open('home.html?adminPreview=1','_blank','noopener');});
    const saved=localStorage.getItem(draftKey);if(saved){try{writeForm(JSON.parse(saved));}catch{}}
  });
})();
