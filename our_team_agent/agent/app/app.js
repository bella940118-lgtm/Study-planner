const $ = selector => document.querySelector(selector);
const storageKey = 'nextstep-study-draft-v2';
const planStorageKey = 'nextstep-saved-plan-v1';
const today = localDate(new Date());
const initial = { tasks: [], date: today, time: '16:00', minutes: 60, energy: 'medium' };
const priorities = [
  { id: 'urgent-important', label: 'High urgency · High importance', badge: 'Urgent' },
  { id: 'urgent-less-important', label: 'High urgency · Low importance', badge: 'Time-sensitive' },
  { id: 'less-urgent-important', label: 'Low urgency · High importance', badge: 'Important' },
  { id: 'less-urgent-less-important', label: 'Low urgency · Low importance', badge: 'Flexible' }
];
const willingnessOptions = [
  { id: 'ready', label: 'Ready to start' },
  { id: 'unsure', label: 'Not sure' },
  { id: 'unwilling', label: 'Not willing yet' }
];

function localDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function dateFrom(value) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function readDraft() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (saved && Array.isArray(saved.tasks)) return {
      tasks: saved.tasks.filter(task => task && typeof task === 'object').map(task => ({
        id: String(task.id || makeId()), title: String(task.title || ''), detail: String(task.detail || ''),
        estimate: Number(task.estimate) || 60, due: String(task.due || ''), breakdown: String(task.breakdown || ''),
        priority: priorities.some(option => option.id === task.priority) ? task.priority : '',
        willingness: willingnessOptions.some(option => option.id === task.willingness) ? task.willingness : ''
      })),
      date: /^\d{4}-\d{2}-\d{2}$/.test(saved.date) ? saved.date : today,
      time: /^\d{2}:\d{2}$/.test(saved.time) ? saved.time : '16:00',
      minutes: [25, 45, 60, 90, 120, 180, 240, 480].includes(Number(saved.minutes)) ? Number(saved.minutes) : 60,
      energy: ['low', 'medium', 'high'].includes(saved.energy) ? saved.energy : 'medium'
    };
  } catch (_) { /* A blocked or stale browser store should not prevent editing. */ }
  return initial;
}

function makeId() { return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`; }
const state = readDraft();
let visibleMonth = new Date(dateFrom(state.date).getFullYear(), dateFrom(state.date).getMonth(), 1);
let currentPlan = null;
let completedSteps = [];

function save() {
  try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch (_) { /* Editing still works without storage. */ }
}

function draftFingerprint() { return JSON.stringify(state); }

function saveCurrentPlan() {
  if (!currentPlan) return;
  try { localStorage.setItem(planStorageKey, JSON.stringify({ draft: draftFingerprint(), plan: currentPlan, completed: completedSteps })); }
  catch (_) { /* The plan remains usable in this tab when storage is blocked. */ }
}

function node(tag, className, content) {
  const item = document.createElement(tag);
  if (className) item.className = className;
  if (content !== undefined) item.textContent = content;
  return item;
}

function field(labelText, fieldNode) {
  const wrap = node('label', 'field');
  wrap.append(node('span', '', labelText), fieldNode);
  return wrap;
}

function taskCard(task, index) {
  const card = node('article', 'task-card'); card.dataset.id = task.id;
  if (task.priority) card.classList.add(`priority-${task.priority}`);
  const head = node('div', 'task-card-head');
  const number = node('span', 'task-number', `TASK ${String(index + 1).padStart(2, '0')}`);
  const badge = node('span', 'priority-badge', priorities.find(option => option.id === task.priority)?.badge || 'Choose priority');
  const remove = node('button', 'remove-task', 'Remove'); remove.type = 'button'; remove.dataset.action = 'remove'; remove.setAttribute('aria-label', `Remove task ${index + 1}`);
  const headLabels = node('div', 'task-head-labels'); headLabels.append(number, badge);
  head.append(headLabels, remove);

  const title = node('input'); title.type = 'text'; title.placeholder = 'e.g. Biology chapter review'; title.maxLength = 160; title.value = task.title; title.dataset.field = 'title'; title.setAttribute('aria-label', `Task ${index + 1} title`);
  title.className = 'task-title';
  const detail = node('textarea'); detail.placeholder = 'What needs doing? Add a deadline, blocker, or requirement if you know it.'; detail.rows = 2; detail.maxLength = 900; detail.value = task.detail; detail.dataset.field = 'detail'; detail.setAttribute('aria-label', `Task ${index + 1} details`);
  const estimate = node('input'); estimate.type = 'number'; estimate.min = '10'; estimate.max = '1440'; estimate.step = '5'; estimate.value = task.estimate; estimate.dataset.field = 'estimate'; estimate.setAttribute('aria-label', `Task ${index + 1} estimated minutes`);
  const due = node('input'); due.type = 'date'; due.value = task.due; due.dataset.field = 'due'; due.setAttribute('aria-label', `Task ${index + 1} due date`);
  const breakdown = node('textarea'); breakdown.placeholder = 'One action per line\ne.g. Skim the chapter headings\nMake 10 flashcards\nTry practice questions'; breakdown.rows = 4; breakdown.maxLength = 1400; breakdown.value = task.breakdown; breakdown.dataset.field = 'breakdown'; breakdown.setAttribute('aria-label', `Task ${index + 1} breakdown, one action per line`);
  const row = node('div', 'field-grid'); row.append(field('Estimated time (min)', estimate), field('Due date (optional)', due));
  const priority = node('div', 'priority-picker'); priority.setAttribute('role', 'group'); priority.setAttribute('aria-label', `Task ${index + 1} urgency and importance`);
  priority.append(node('strong', 'priority-title', 'Urgency × importance'));
  const options = node('div', 'priority-options');
  priorities.forEach(option => {
    const button = node('button', `priority-option priority-${option.id}`, option.label);
    button.type = 'button'; button.dataset.priority = option.id;
    button.setAttribute('aria-pressed', String(task.priority === option.id));
    options.append(button);
  });
  priority.append(options);
  const willingness = node('div', 'willingness-picker'); willingness.setAttribute('role', 'group'); willingness.setAttribute('aria-label', `Task ${index + 1} willingness to start`);
  willingness.append(node('strong', 'willingness-title', 'How willing are you to start this task?'));
  const willingnessChoices = node('div', 'willingness-options');
  willingnessOptions.forEach(option => {
    const button = node('button', 'willingness-option', option.label);
    button.type = 'button'; button.dataset.willingness = option.id;
    button.setAttribute('aria-pressed', String(task.willingness === option.id));
    willingnessChoices.append(button);
  });
  willingness.append(willingnessChoices, node('small', 'willingness-hint', 'The planner can make a hesitant task easier to begin.'));
  card.append(head, title, detail, row, priority, willingness, field('Work breakdown · one step per line', breakdown));
  return card;
}

function renderTasks() {
  const list = $('#task-list'); list.replaceChildren();
  if (!state.tasks.length) {
    const empty = node('div', 'task-empty'); empty.append(node('span', '', '✎'), node('strong', '', 'Start with one big task.'), node('p', '', 'Add an assignment, exam, or study goal. You can break it down underneath.'));
    list.append(empty);
  } else state.tasks.forEach((task, index) => list.append(taskCard(task, index)));
  renderOverview(); renderCalendar();
}

function stepsFor(task) { return task.breakdown.split(/\r?\n/).map(line => line.trim()).filter(Boolean); }
function formatMinutes(minutes) { const hours = Math.floor(minutes / 60); const rest = minutes % 60; return hours ? `${hours}h${rest ? ` ${rest}m` : ''}` : `${rest}m`; }
function formatPlanMinutes(minutes) { const hours = Math.floor(minutes / 60); const rest = minutes % 60; return hours ? `${hours} hr${rest ? ` ${rest} min` : ''}` : `${rest} min`; }

function renderOverview() {
  const titled = state.tasks.filter(task => task.title.trim());
  $('#task-count').textContent = String(titled.length);
  $('#estimate-total').textContent = formatMinutes(titled.reduce((sum, task) => sum + (Number(task.estimate) || 0), 0));
  $('#breakdown-count').textContent = String(titled.reduce((sum, task) => sum + stepsFor(task).length, 0));
}

function renderCalendar() {
  $('#month-label').textContent = visibleMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const grid = $('#calendar-grid'); grid.replaceChildren();
  const first = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
  const offset = (first.getDay() + 6) % 7;
  const days = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0).getDate();
  for (let i = 0; i < offset; i++) grid.append(node('span', 'calendar-spacer'));
  for (let day = 1; day <= days; day++) {
    const value = localDate(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), day));
    const button = node('button', 'calendar-day', String(day)); button.type = 'button'; button.dataset.date = value;
    button.setAttribute('aria-label', new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), day).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }));
    if (value === today) button.classList.add('today');
    if (value === state.date) { button.classList.add('selected'); button.setAttribute('aria-pressed', 'true'); }
    if (state.tasks.some(task => task.due === value && task.title.trim())) button.classList.add('has-due');
    if (value === state.date) button.classList.add('has-study');
    grid.append(button);
  }
  const selected = dateFrom(state.date);
  $('#selected-date-label').textContent = selected.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const start = new Date(selected.getFullYear(), selected.getMonth(), selected.getDate(), ...state.time.split(':').map(Number));
  const end = new Date(start.getTime() + Number(state.minutes) * 60000);
  const timeFormat = { hour: 'numeric', minute: '2-digit' };
  $('#session-summary').textContent = `${start.toLocaleTimeString('en-US', timeFormat)}–${end.toLocaleTimeString('en-US', timeFormat)}${end.getDate() !== start.getDate() ? ' next day' : ''} · ${formatMinutes(Number(state.minutes))} reserved`;
  const due = state.tasks.filter(task => task.due === state.date && task.title.trim());
  const dayDue = $('#day-due'); dayDue.replaceChildren();
  dayDue.append(node('strong', '', due.length ? `Due this day · ${due.length}` : 'No tasks due this day'));
  due.forEach(task => dayDue.append(node('span', '', task.title)));
}

function invalidatePlan() {
  currentPlan = null; completedSteps = [];
  try { localStorage.removeItem(planStorageKey); } catch (_) { /* Draft editing still works without storage. */ }
  if (!$('#output').hidden) {
    $('#output').hidden = true; $('#output').replaceChildren(); $('#empty').hidden = false;
    $('#empty strong').textContent = 'Your draft changed.';
    $('#empty p').textContent = 'Generate again to make a plan for these details.';
  }
  $('#error').hidden = true;
}

function setDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(dateFrom(value).getTime())) return;
  state.date = value; visibleMonth = new Date(dateFrom(value).getFullYear(), dateFrom(value).getMonth(), 1);
  $('#study-date').value = value; save(); renderCalendar(); invalidatePlan();
}

$('#add-task').addEventListener('click', () => {
  state.tasks.push({ id: makeId(), title: '', detail: '', estimate: 60, due: '', breakdown: '', priority: '', willingness: '' });
  save(); renderTasks(); invalidatePlan();
  $('#task-list .task-card:last-child .task-title').focus();
});

$('#task-list').addEventListener('click', event => {
  const willingnessButton = event.target.closest('[data-willingness]');
  if (willingnessButton) {
    const card = willingnessButton.closest('.task-card');
    const task = state.tasks.find(item => item.id === card.dataset.id);
    if (!task) return;
    task.willingness = willingnessButton.dataset.willingness;
    card.querySelectorAll('[data-willingness]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.willingness === task.willingness)));
    save(); invalidatePlan(); return;
  }
  const priorityButton = event.target.closest('[data-priority]');
  if (priorityButton) {
    const card = priorityButton.closest('.task-card');
    const task = state.tasks.find(item => item.id === card.dataset.id);
    if (!task) return;
    task.priority = priorityButton.dataset.priority;
    card.className = `task-card priority-${task.priority}`;
    card.querySelector('.priority-badge').textContent = priorities.find(option => option.id === task.priority).badge;
    card.querySelectorAll('[data-priority]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.priority === task.priority)));
    save(); invalidatePlan(); return;
  }
  const button = event.target.closest('[data-action="remove"]'); if (!button) return;
  state.tasks = state.tasks.filter(task => task.id !== button.closest('.task-card').dataset.id);
  save(); renderTasks(); invalidatePlan();
});

$('#task-list').addEventListener('input', event => {
  const fieldName = event.target.dataset.field; if (!fieldName) return;
  const task = state.tasks.find(item => item.id === event.target.closest('.task-card').dataset.id); if (!task) return;
  task[fieldName] = fieldName === 'estimate' ? Number(event.target.value) : event.target.value;
  save(); renderOverview(); if (fieldName === 'due' || fieldName === 'title') renderCalendar(); invalidatePlan();
});

$('#calendar-grid').addEventListener('click', event => { const day = event.target.closest('[data-date]'); if (day) setDate(day.dataset.date); });
$('#prev-month').addEventListener('click', () => { visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1); renderCalendar(); });
$('#next-month').addEventListener('click', () => { visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1); renderCalendar(); });
$('#study-date').addEventListener('change', event => setDate(event.target.value));
for (const [id, property] of [['start-time', 'time'], ['minutes', 'minutes'], ['energy', 'energy']]) {
  $(`#${id}`).addEventListener('change', event => {
    state[property] = property === 'minutes' ? Number(event.target.value) : event.target.value;
    save(); renderCalendar(); invalidatePlan();
  });
}

function updatePlanProgress() {
  if (!currentPlan) return;
  const done = completedSteps.filter(Boolean).length;
  const minutes = currentPlan.steps.reduce((sum, step, index) => sum + (completedSteps[index] ? step.minutes : 0), 0);
  $('#plan-progress').textContent = `${done} of ${currentPlan.steps.length} items complete · ${formatPlanMinutes(minutes)} done`;
}

function renderPlan(plan, completed = []) {
  currentPlan = plan;
  completedSteps = plan.steps.map((_, index) => Boolean(completed[index]));
  const output = $('#output'); output.replaceChildren();
  const lead = node('div', 'plan-lead'); lead.append(node('span', 'section-kicker', 'START HERE'), node('h3', '', plan.first_step), node('p', '', plan.headline)); output.append(lead);
  const summary = node('div', 'plan-time-summary');
  for (const [label, value, className] of [
    ['Total planned', formatPlanMinutes(plan.total), 'planned-time'],
    ['Study block', formatPlanMinutes(state.minutes), ''],
    ['Unallocated', formatPlanMinutes(Math.max(0, state.minutes - plan.total)), '']
  ]) {
    const metric = node('div', `plan-time-metric ${className}`); metric.append(node('span', '', label), node('strong', '', value)); summary.append(metric);
  }
  const progress = node('p', 'plan-progress'); progress.id = 'plan-progress';
  output.append(summary, node('h3', 'checklist-title', 'Your timed to-do list'), progress);
  const checklist = node('div', 'checklist');
  let elapsed = 0;
  const studyStart = new Date(`${state.date}T${state.time}:00`);
  const clock = date => date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  plan.steps.forEach((step, index) => {
    const isBreak = step.kind === 'break';
    const row = node('label', `plan-step${isBreak ? ' break-step' : ''}`); const checkbox = node('input'); checkbox.type = 'checkbox'; checkbox.dataset.stepIndex = String(index); checkbox.checked = completedSteps[index]; checkbox.setAttribute('aria-label', `Complete ${isBreak ? 'break' : 'step'} ${index + 1}`);
    const body = node('span', 'step-body'); body.append(node('strong', '', `${index + 1}. ${step.title}`), node('small', '', `${step.task} · ${step.why}`));
    if (isBreak) body.prepend(node('span', 'break-label', 'SHORT BREAK'));
    const timing = node('span', 'step-timing');
    timing.append(node('strong', 'step-time', `${step.minutes} min`), node('small', 'step-window', `${clock(new Date(studyStart.getTime() + elapsed * 60000))}–${clock(new Date(studyStart.getTime() + (elapsed + step.minutes) * 60000))}`));
    elapsed += step.minutes;
    row.append(checkbox, body, timing); checklist.append(row);
  });
  output.append(checklist);
  if (plan.later?.length) output.append(node('p', 'plan-after', `Later: ${plan.later.join(' · ')}`));
  if (plan.clarifying_question) output.append(node('p', 'plan-after', `Check: ${plan.clarifying_question}`));
  $('#empty').hidden = true; output.hidden = false; $('#error').hidden = true;
  updatePlanProgress();
}

$('#output').addEventListener('change', event => {
  const index = Number(event.target.dataset.stepIndex);
  if (!currentPlan || !Number.isInteger(index) || index < 0 || index >= completedSteps.length) return;
  completedSteps[index] = event.target.checked;
  updatePlanProgress(); saveCurrentPlan();
});

function restorePlan() {
  try {
    const saved = JSON.parse(localStorage.getItem(planStorageKey));
    if (saved?.draft === draftFingerprint() && Array.isArray(saved.plan?.steps) &&
        saved.plan.steps.length && Number.isInteger(saved.plan.total) && Array.isArray(saved.completed)) {
      renderPlan(saved.plan, saved.completed);
    }
  } catch (_) { /* A stale saved plan should not prevent the page from loading. */ }
}

function workloadText() {
  return state.tasks.filter(task => task.title.trim()).map((task, index) => {
    const parts = [`Task ${index + 1}: ${task.title.trim()}`, `Estimated full task: ${task.estimate} minutes`];
    if (task.priority) parts.push(`Student-selected priority: ${priorities.find(option => option.id === task.priority).label}`);
    if (task.willingness) parts.push(`Willingness to start: ${willingnessOptions.find(option => option.id === task.willingness).label}`);
    if (task.due) parts.push(`Due: ${task.due}`);
    if (task.detail.trim()) parts.push(`Details: ${task.detail.trim()}`);
    if (stepsFor(task).length) parts.push(`Known work breakdown: ${stepsFor(task).join('; ')}`);
    return parts.join('\n');
  }).join('\n\n') + `\n\nStudy block: ${state.date} at ${state.time}`;
}

$('#submit').addEventListener('click', async () => {
  const error = $('#error'); const button = $('#submit');
  const tasks = state.tasks.filter(task => task.title.trim());
  if (!tasks.length) { error.textContent = 'Add at least one task title before generating a plan.'; error.hidden = false; return; }
  if (tasks.some(task => !Number.isInteger(Number(task.estimate)) || Number(task.estimate) < 10 || Number(task.estimate) > 1440)) {
    error.textContent = 'Each task estimate must be between 10 and 1,440 minutes.'; error.hidden = false; return;
  }
  const workload = workloadText();
  if (workload.length > 6000) { error.textContent = 'Your workload is too long. Shorten some task details or breakdown steps.'; error.hidden = false; return; }
  const requestedDraft = draftFingerprint();
  button.disabled = true; button.firstChild.textContent = 'Generating… '; error.hidden = true;
  try {
    const response = await fetch('/api/plan', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tasks: workload, minutes: state.minutes, energy: state.energy }) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'The plan could not be generated.');
    if (draftFingerprint() !== requestedDraft) throw new Error('Your workload changed while the plan was generating. Please generate it again.');
    renderPlan(data); saveCurrentPlan();
  } catch (failure) {
    error.textContent = failure instanceof TypeError ? 'Cannot reach the local planner server. Check that it is running, then try again.' : failure.message;
    error.hidden = false;
  } finally { button.disabled = false; button.firstChild.textContent = 'Generate with AI '; }
});

$('#study-date').value = state.date; $('#start-time').value = state.time;
$('#minutes').value = String(state.minutes); $('#energy').value = state.energy;
renderTasks();
restorePlan();
