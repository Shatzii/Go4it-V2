// ----- File Upload Handler -----
document.getElementById('uploadForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];
  if (!file) return alert('Please select a file.');

  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await fetch('upload.php', {
      method: 'POST',
      body: formData
    });
    const data = await res.text();
    alert('Upload Complete: ' + data);
  } catch (err) {
    alert('Upload Failed: ' + err);
  }
});

// ----- Command Execution -----
function runCommand() {
  const cmd = document.getElementById('commandInput').value;
  const output = document.getElementById('commandOutput');
  output.textContent = 'Running...';

  fetch('/api/run_command.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ command: cmd })
  })
    .then(res => res.text())
    .then(data => {
      output.textContent = data;
    })
    .catch(err => {
      output.textContent = 'Error: ' + err;
    });
}

// ----- StarCoder Task Buttons -----
function runTask(task) {
  const output = document.getElementById('commandOutput');
  output.textContent = `Running ${task} task...`;

  fetch(`/api/starcoder_task.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: task })
  })
    .then(res => res.text())
    .then(data => {
      output.textContent = data;
    })
    .catch(err => {
      output.textContent = 'Error: ' + err;
    });
}