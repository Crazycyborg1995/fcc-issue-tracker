let url = window.location.href + 'api/issues/:project';
let closeBtn = document.querySelector('.close');

function variables() {
  let id = document.querySelector('#id').value;
  let id2 = document.querySelector('#id2').value;
  let title = document.querySelector('#title').value;
  let text = document.querySelector('#text').value;
  let creator = document.querySelector('#creator').value;
  let assigned = document.querySelector('#assigned').value || '';
  let status = document.querySelector('#status').value || '';
  let open = document.querySelector("input[type='checkbox']").checked;
  console.log('title', document.querySelector('#title').value);
  return { id, id2, title, text, creator, assigned, status, open };
}

function variables2() {
  let id = document.querySelector('#id').value;
  let title = document.querySelector('#title2').value;
  let text = document.querySelector('#text2').value || '';
  let creator = document.querySelector('#creator2').value || '';
  let assigned = document.querySelector('#assigned2').value || '';
  let status = document.querySelector('#status2').value || '';
  let open = document.querySelector("input[type='checkbox']").checked;
  return { id, title, text, creator, assigned, status, open };
}

// Open modal
function openModal(data) {
  if (data._id) {
    let { _id, title, text, creator, assigned, status } = data;
    console.log(id, text, creator, title);
    document.querySelector('.output').innerHTML = `<p>ID: ${_id}</p>
    <p>Title: ${title}</p>
    <p>Text: ${text}</p>
    <p>Creator: ${creator}</p>
    <p>Assigned: ${assigned || null}</p>
    <p>Status: ${status || null}</p>`;
  } else {
    document.querySelector('.output').innerHTML = `<p>${data.msg}</p>`;
  }
  document.querySelector('.myModal').classList.add('open');
}

// Close modal
if (closeBtn)
  closeBtn.addEventListener('click', () => {
    document.querySelector('.myModal').classList.remove('open');
  });

// clear all fields
function clearFix() {
  let inputs = document.querySelectorAll('input[type="text"]');
  for (let input of inputs) {
    input.value = '';
  }
  let textareas = document.querySelectorAll('textarea');
  for (let textarea of textareas) {
    textarea.value = '';
  }
}

// POST request
document.querySelector('#post').addEventListener('submit', e => {
  e.preventDefault();
  let { title, text, creator, assigned, status } = variables();
  if (!title || !text || !creator) {
    alert('please fill in all details');
  } else {
    let data = {
      title,
      text,
      creator,
      assigned,
      status
    };
    clearFix();
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => openModal(data));
  }
});

// UPDATE request
document.querySelector('#update').addEventListener('submit', e => {
  e.preventDefault();
  let { id, title, text, creator, assigned, status, open } = variables2();
  if (!id) {
    alert('please give an id');
  }
  let data = {
    id,
    title,
    text,
    creator,
    assigned,
    status,
    open
  };
  clearFix();

  console.log('title', title);
  fetch(url, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(data => openModal(data));
});

// DELETE request
document.querySelector('#delete').addEventListener('submit', e => {
  e.preventDefault();
  let { id2: id } = variables();
  let data = { id };
  fetch(url, {
    method: 'DELETE',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    } // header is a must
  })
    .then(res => res.json())
    .then(data => openModal(data));
});
