const form = document.querySelector('#plan-form');
const submit = document.querySelector('#submit');
const empty = document.querySelector('#empty');
const output = document.querySelector('#output');
const errorBox = document.querySelector('#error');
const resultTime = document.querySelector('#result-time');

function element(tag, className, value) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (value !== undefined) node.textContent = value;
  return node;
}

function render(plan) {
  output.replaceChildren();
  const head = element('div', 'plan-head');
  head.append(element('div', 'label', 'START HERE'), element('h3', '', plan.first_step), element('p', '', plan.headline));
  output.append(head);
  plan.steps.forEach((step, index) => {
    const row = element('label', 'step');
    const checkbox = document.createElement('input'); checkbox.type = 'checkbox'; checkbox.setAttribute('aria-label', `Complete step ${index + 1}`);
    const detail = element('main');
    detail.append(element('strong', '', `${index + 1}. ${step.title}`), element('small', '', `${step.task} · ${step.why}`));
    row.append(checkbox, detail, element('span', 'time', `${step.minutes} min`));
    output.append(row);
  });
  if (plan.later.length) output.append(element('p', 'later', `Later: ${plan.later.join(' · ')}`));
  if (plan.clarifying_question) output.append(element('p', 'question', `Check: ${plan.clarifying_question}`));
  resultTime.textContent = `${plan.total} min planned`;
  empty.hidden = true; output.hidden = false; errorBox.hidden = true;
}

form.addEventListener('submit', async event => {
  event.preventDefault(); submit.disabled = true; submit.firstChild.textContent = 'Making your plan ';
  errorBox.hidden = true;
  try {
    const response = await fetch('/api/plan', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tasks: document.querySelector('#tasks').value, minutes: Number(document.querySelector('#minutes').value), energy: document.querySelector('#energy').value }) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Could not make a plan.');
    render(data);
  } catch (error) { errorBox.textContent = error.message; errorBox.hidden = false; }
  finally { submit.disabled = false; submit.firstChild.textContent = 'Make my plan '; }
});
