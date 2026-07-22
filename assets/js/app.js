const $=s=>document.querySelector(s);
document.addEventListener('DOMContentLoaded',()=>{
  const menu=$('.menu'),nav=$('.nav'); if(menu&&nav) menu.onclick=()=>nav.classList.toggle('open');
  const login=$('#loginForm'); if(login) login.addEventListener('submit',e=>{e.preventDefault(); const p=$('#password').value; if(p==='TNF0125'){sessionStorage.setItem('ksg-auth','1');location.href='home.html'}else $('#error').textContent='パスワードが違います。'});
  if(document.body.dataset.protected==='true'&&!sessionStorage.getItem('ksg-auth')) location.replace('index.html');
  document.querySelectorAll('[data-copy]').forEach(b=>b.onclick=async()=>{const t=document.querySelector(b.dataset.copy)?.innerText||'';await navigator.clipboard.writeText(t);const old=b.textContent;b.textContent='コピーしました';setTimeout(()=>b.textContent=old,1300)});
  const reserve=$('#reserveForm'); if(reserve) reserve.addEventListener('submit',e=>{e.preventDefault();const d=$('#pickupDate').value,h=$('#pickupHour').value;$('#reserveMessage').textContent=`안녕하세요.\n호텔에서 짐 수거를 예약하고 싶습니다.\n희망 날짜: ${d}\n희망 시간: ${h}시\n호텔 명함 사진과 짐 사진을 함께 보내드리겠습니다.\n감사합니다.`;$('#reserveResult').classList.remove('hide');});
  const ship=$('#shipForm'); if(ship) ship.addEventListener('submit',e=>{e.preventDefault();const v=id=>document.querySelector(id).value.trim();$('#shipMessage').textContent=`[일본 배송 요청]\n\n성명: ${v('#name')}\n우편번호: ${v('#zip')}\n주소: ${v('#address')}\n전화번호: ${v('#phone')}\n\n일본으로 배송 부탁드립니다.`;$('#shipResult').classList.remove('hide');});
});
