window.confirmSubmit=function(){
  modal.classList.remove('success');
  modal.querySelector('#modal-title').textContent='确认提交对话？';
  modal.querySelector('.sheet p').textContent='提交后将进入采集记录，暂不可继续编辑。';
  const confirm=document.querySelector('#endNow'),cancel=document.querySelector('#continue');
  confirm.textContent='确认提交';
  cancel.textContent='取消';
  cancel.style.display='';
  modal.classList.add('open');
  cancel.onclick=()=>modal.classList.remove('open');
  confirm.onclick=()=>{
    records[selected].stage='pending_initial_review';
    modal.classList.add('success');
    modal.querySelector('#modal-title').textContent='提交成功';
    modal.querySelector('.sheet p').textContent='本次对话已成功提交。';
    confirm.textContent='完成';
    cancel.style.display='none';
    confirm.onclick=()=>{modal.classList.remove('open','success');go('records')};
  };
};
const baseSubmitReview=window.renderReview;
window.renderReview=function(){
  baseSubmitReview();
  const submit=app.querySelector('.review-actions .primary');
  if(submit) submit.onclick=window.confirmSubmit;
};
