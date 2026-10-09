const baseRefinedTasks=window.renderTasks;
window.renderTasks=function(){
  baseRefinedTasks();
  const subtitle=app.querySelector('.task-heading small');
  if(subtitle) subtitle.textContent='情景演练';
};
const baseRefinedDetail=window.renderDetail;
window.renderDetail=function(){
  baseRefinedDetail();
  const metrics=app.querySelector('.detail-metrics'),pill=app.querySelector('.detail-flow .pill'),heading=app.querySelector('.detail-flow h1');
  const selectedTask=collectorTasks[selectedCollectorTask]||collectorTasks[0];
  const meta=collectorTaskStatusMeta[selectedTask.state]||collectorTaskStatusMeta.invalid;
  if(metrics) metrics.remove();
  if(heading) heading.textContent=selectedTask.name;
  if(pill){
    pill.textContent=meta.label;
    pill.className=`pill task-status ${meta.className}`;
  }
};
const baseRefinedVoice=window.renderVoice;
window.renderVoice=function(){
  baseRefinedVoice();
  const name=app.querySelector('.voice-profile p'),role=app.querySelector('.voice-profile small');
  if(name) name.textContent='张三';
  if(role) role.textContent='医药代表';
};
