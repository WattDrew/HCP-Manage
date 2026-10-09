const baseRefinedTasks=window.renderTasks;
window.renderTasks=function(){
  baseRefinedTasks();
  const subtitle=app.querySelector('.task-heading small');
  if(subtitle) subtitle.textContent='情景演练';
};
const baseRefinedDetail=window.renderDetail;
window.renderDetail=function(){
  baseRefinedDetail();
  const metrics=app.querySelector('.detail-metrics'),pill=app.querySelector('.detail-flow .pill');
  const completed=records.some(r=>r.stage==='final_approved');
  if(metrics) metrics.remove();
  if(pill){
    if(completed){pill.textContent='已完成';pill.classList.add('task-completed')}
    else pill.remove();
  }
};
const baseRefinedVoice=window.renderVoice;
window.renderVoice=function(){
  baseRefinedVoice();
  const name=app.querySelector('.voice-profile p'),role=app.querySelector('.voice-profile small');
  if(name) name.textContent='张三';
  if(role) role.textContent='医药代表';
};
