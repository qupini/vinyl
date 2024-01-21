//_______________________________________________ОТОБРАЖЕНИЕ ПЛАСТИНОК НА ГЛАВНОЙ СТРАНИЦЕ____________________________________________//
let isSelectMode = false;
document.addEventListener('DOMContentLoaded', function() {

  const textarea = document.getElementById('vinyl-comments');

    textarea.addEventListener('input', function() {
        if (this.scrollHeight > this.clientHeight) {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        }
        if (this.scrollWidth > this.clientWidth) {
            this.style.width = 'auto';
            this.style.width = (this.scrollWidth + 1) + 'px';
        }
    });

  document.getElementById('select-vinyl-button').addEventListener('click', function() {
  isSelectMode = !isSelectMode;

  const gridItems = document.querySelectorAll('.grid-item'); // Assuming '.grid-item' is your vinyl container class
  
  gridItems.forEach(item => {
    const imgLink = item.querySelector('.image-link'); // Assuming '.image-link' contains the image
    if (isSelectMode) {
      imgLink.classList.add('dimmed');
    } else {
      imgLink.classList.remove('dimmed');
    }
  });

  document.querySelectorAll('.image-link').forEach(img => {
    if (img.classList.contains('selected-image')) {
      img.classList.remove('selected-image');
    } else {
      return;
    }
  });

  const addButton = document.getElementById('add-vinyl-button');
  if (isSelectMode) {
    addButton.classList.add('disabled');
  } else {
    addButton.classList.remove('disabled');
  }


  // Получаем кнопку "Удалить"
  const deleteButton = document.getElementById('delete-vinyl-button');
  
  // Если режим выбора активен, показываем кнопку "Удалить"
  if (isSelectMode) {
    deleteButton.classList.remove('hidden');
  } else {
    // Если режим выбора не активен, скрываем кнопку "Удалить"
    deleteButton.classList.add('hidden');
  }
});

  document.getElementById('search-vinyl').addEventListener('input', function(e) {
  const searchQuery = e.target.value.toLowerCase();
  console.log(searchQuery)

  // Добавляем задержку для оптимизации количества запросов к серверу
  if (this.searchTimeout) {
    clearTimeout(this.searchTimeout);
  }

  this.searchTimeout = setTimeout(() => {
    fetch('/vinyls?search=' + searchQuery)
      .then(response => response.json())
      .then(data => {
        const grid = document.getElementById('vinyl-grid');
        grid.innerHTML = '';

        data.forEach(vinyl => {
  const gridItem = document.createElement('div');
  gridItem.className = 'grid-item';
  gridItem.setAttribute('data-id', vinyl.vinyl_id); // Добавление атрибута data-id

  const imageLink = document.createElement('div');
  imageLink.className = 'image-link';
  
  imageLink.addEventListener('click', function() {
    if (isSelectMode) {
      // В режиме выбора просто переключаем класс 'selected-image'
      this.classList.toggle('selected-image');
    } else {
      // Если не в режиме выбора, осуществляем переход на страницу пластинки
      window.location.href = `/vinyl/${vinyl.vinyl_id}`;
    }
  });


  const image = document.createElement('img');
  image.src = vinyl.vinyl_img || 'https://i.ibb.co/7NfrgGH/2112-q703-032-F-m004-c7-vinyl-record-covers-mockup-realistic-removebg.png';

  // const titleDiv = document.createElement('div');
  // titleDiv.className = 'title';

  const title = document.createElement('p');
  title.innerText = vinyl.vinyl_title;
  title.className = 'vinyl-title';
  
  imageLink.appendChild(image);
  imageLink.appendChild(title);
  gridItem.appendChild(imageLink);
  // gridItem.appendChild(titleDiv);

  document.getElementById('vinyl-grid').appendChild(gridItem);

  const gridItems = document.querySelectorAll('.grid-item'); // Assuming '.grid-item' is your vinyl container class
  
  gridItems.forEach(item => {
    const imgLink = item.querySelector('.image-link'); // Assuming '.image-link' contains the image
    if (isSelectMode) {
      imgLink.classList.add('dimmed');
    } else {
      imgLink.classList.remove('dimmed');
    }
  });
});

      })
      .catch(error => console.error('Error:', error));
  }, 300); // задержка 300 мс
});

  fetch('/vinyls')
    .then(response => response.json())
    .then(data => {
      const grid = document.getElementById('vinyl-grid');
      grid.innerHTML = '';

      data.forEach(vinyl => {
  const gridItem = document.createElement('div');
  gridItem.className = 'grid-item';
  gridItem.setAttribute('data-id', vinyl.vinyl_id); // Добавление атрибута data-id

  const imageLink = document.createElement('div');
  imageLink.className = 'image-link';

  imageLink.addEventListener('click', function() {
    if (isSelectMode) {
      // В режиме выбора просто переключаем класс 'selected-image'
      this.classList.toggle('selected-image');
    } else {
      // Если не в режиме выбора, осуществляем переход на страницу пластинки
      window.location.href = `/vinyl/${vinyl.vinyl_id}`;
    }
  });

    const image = document.createElement('img');
    // Set the path to the image or use a placeholder if the image is missing
    image.src = vinyl.vinyl_img || 'https://i.ibb.co/7NfrgGH/2112-q703-032-F-m004-c7-vinyl-record-covers-mockup-realistic-removebg.png';
    image.alt = 'Vinyl Image';

    // Create a new div for the title
      // const titleDiv = document.createElement('div');
  // titleDiv.className = 'title';

  const title = document.createElement('p');
  title.innerText = vinyl.vinyl_title;
  title.className = 'vinyl-title';
  
  imageLink.appendChild(image);
  imageLink.appendChild(title);
  gridItem.appendChild(imageLink);
  // gridItem.appendChild(titleDiv);

    const gearIcon = document.createElement('i');
    gearIcon.className = 'fa fa-gear gear-icon';
    gearIcon.onclick = function() { openTrackModal(vinyl.vinyl_id); };
    gridItem.appendChild(gearIcon);
    grid.appendChild(gridItem);
      });
    })
    .catch(error => console.error('Error:', error));
});
//____________________________________________________________________________________________________________________________________//

//___________________________________________________РАБОТА С МОДАЛЬНЫМИ ОКНАМИ_______________________________________________________//
// Функция для открытия модального окна по id
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Отключить прокрутку на body
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('show');
    document.body.style.overflow = ''; // Вернуть прокрутку на body

    // Check if the modal being closed is the add-vinyl-form
    if (modalId === 'add-vinyl-form') {
        // Reset the size of the vinyl-comments textarea
        const textarea = document.getElementById('vinyl-comments');
        textarea.style.height = '80px'; // Set this to the default height of the textarea
        textarea.style.width = ''; // Set this to the default width or just clear the inline style
        textarea.value = "";
    }
}



// Функция для закрытия модального окна при нажатии на ×
document.querySelectorAll('.close-button').forEach(button => {
  button.onclick = function() {
    closeModal(button.closest('.modal').id);
  }
});

// Функция для закрытия модального окна при клике вне  
window.onclick = function(event) {
  if (event.target.classList.contains('modal')) {
    closeModal(event.target.id);
    document.getElementById('new-vinyl').reset();
  }
};
//_______________________________________ОТПРАВКА ДАННЫХ НА СЕРВЕР + ДОБАВЛЕНИЕ ПЕСЕН ____________________________________________________//



// Функция для добавления новых полей для песнюов
function addTrackEntry() {
  const container = document.getElementById('tracks-container');
  const newTrackDiv = document.createElement('div');
  newTrackDiv.className = 'track-entry';
  newTrackDiv.innerHTML = `
    <input type="hidden" class="new-track-input" id="track-vinyl-id" name="vinyl_id">
    <input type="text" class="new-track-input" id="track-title" name="track_title" placeholder="Название песни" required><br>
    <input type="text" class="new-track-input" id="track-author" name="track_author" placeholder="Автор песни"><br>
    <input type="text" class="new-track-input" id="track-performer" name="track_performer" placeholder="Исполнитель песни"><br>
    <input type="text" class="new-track-input" id="track-duration" name="track_duration" placeholder="Длительность песни"><br>
    <button type="button" class="remove-track"><i class="fa fa-trash-o"></i></button>
  `;
  container.appendChild(newTrackDiv);

  newTrackDiv.querySelector('.remove-track').addEventListener('click', function() {
    this.parentElement.remove(); // Remove the track entry
  });
}

// Добавление обработчика события для кнопки добавления новых полей песнюов
document.getElementById('add-more-tracks').addEventListener('click', addTrackEntry);

document.getElementById('add-vinyl-button').onclick = function() {
  openModal('add-vinyl-form');
};

document.getElementById('delete-vinyl-button').addEventListener('click', function() {
  const selectedImages = document.querySelectorAll('.image-link.selected-image');
  const idsToDelete = Array.from(selectedImages).map(imgLink => imgLink.parentElement.getAttribute('data-id'));

  if (idsToDelete.length > 0) {
    if (confirm('Вы уверены, что хотите удалить выбранные пластинки?')) {
      // Здесь добавьте логику отправки запроса на удаление на сервер
      // Например:
      fetch('/delete-vinyls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: idsToDelete }),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Произошла ошибка при удалении');
        }
        return response.json();
      })
      .then(data => {
        // Удаление элементов из DOM
        idsToDelete.forEach(id => {
          document.querySelector(`.grid-item[data-id="${id}"]`).remove();
        });
        console.log(data.message);
      })
      .catch(error => {
        console.error('Ошибка:', error);
      });
    }
    this.classList.add('hidden');
    isSelectMode = !isSelectMode;
  } else {
    alert('Выберите пластинки для удаления.');
  }

  const imgLinks = document.querySelectorAll('.image-link');
  imgLinks.forEach(imgLink => imgLink.classList.remove('dimmed'));

  const addButton = document.getElementById('add-vinyl-button');
  addButton.classList.remove('disabled');
});

function openTrackModal(vinylId) {
  // Очистите контейнер песен перед открытием модального окна
  const tracksContainer = document.getElementById('tracks-container');
  tracksContainer.innerHTML = '';
  addTrackEntry(); // Добавляем одно поле ввода при открытии модального окна

  document.getElementById('track-vinyl-id').value = vinylId;
  openModal('add-track-modal');
}

// Отправка данных о новой пластинке на сервер + обновление интерфейса 
document.getElementById('new-vinyl').addEventListener('submit', function(event) {
  event.preventDefault(); // Предотвратить стандартное поведение отправки формы

  // Получите значения из полей формы
  const formData = {
    vinyl_title: document.getElementById('vinyl-title').value.toUpperCase(),
    vinyl_releaseyear: document.getElementById('vinyl-releaseyear').value,
    vinyl_catalog_num: document.getElementById('vinyl-catalog-num').value,
    vinyl_rpm: document.getElementById('vinyl-rpm').value,
    vinyl_manufacturer: document.getElementById('vinyl-manufacturer').value,
    vinyl_comments: document.getElementById('vinyl-comments').value,
    vinyl_type: document.getElementById('vinyl-type').value
  };

  // Отправьте данные на сервер
  fetch('/vinyls', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  })
  .then(response => response.json())
  .then(vinyl => {
    const grid = document.getElementById('vinyl-grid');
    const gridItem = document.createElement('div');
    gridItem.className = 'grid-item';
    gridItem.setAttribute('data-id', vinyl.vinyl_id); // Добавление атрибута data-id

    const imageLink = document.createElement('div');
  imageLink.className = 'image-link';

  imageLink.addEventListener('click', function() {
    if (isSelectMode) {
      // В режиме выбора просто переключаем класс 'selected-image'
      this.classList.toggle('selected-image');
    } else {
      // Если не в режиме выбора, осуществляем переход на страницу пластинки
      window.location.href = `/vinyl/${vinyl.vinyl_id}`;
    }
  });

    const image = document.createElement('img');
    image.src = vinyl.vinyl_img || 'https://i.ibb.co/7NfrgGH/2112-q703-032-F-m004-c7-vinyl-record-covers-mockup-realistic-removebg.png';
    image.alt = 'Vinyl Image';

    // Create a new div for the title
      // const titleDiv = document.createElement('div');
  // titleDiv.className = 'title';

  const title = document.createElement('p');
  title.innerText = vinyl.vinyl_title;
  title.className = 'vinyl-title';
  
  imageLink.appendChild(image);
  imageLink.appendChild(title);
  gridItem.appendChild(imageLink);
  // gridItem.appendChild(titleDiv);
    

    const gearIcon = document.createElement('span');
    gearIcon.classList.add('gear-icon');
    gearIcon.innerHTML = ' &#9881'; // Используйте желаемый символ шестеренки
    gearIcon.onclick = function() { openTrackModal(vinyl.vinyl_id); };
    gridItem.appendChild(gearIcon);
    if (grid.firstChild) {
    grid.insertBefore(gridItem, grid.firstChild);
  } else {
    grid.appendChild(gridItem);
  }

    openTrackModal(vinyl.vinyl_id);
    
    // Закрыть модальное окно
    closeModal('add-vinyl-form');
    document.getElementById('new-vinyl').reset();
  })
  .catch(error => console.error('Error:', error));
});

// Отправка данных о песне на сервер
document.getElementById('add-tracks-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const vinylId = document.getElementById('track-vinyl-id').value;
  const trackEntries = document.querySelectorAll('.track-entry');
  
  const tracks = Array.from(trackEntries).map(entry => {
    return {
      vinyl_id: vinylId,
      track_title: entry.querySelector('input[name="track_title"]').value,
      track_author: entry.querySelector('input[name="track_author"]').value,
      track_performer: entry.querySelector('input[name="track_performer"]').value,
      track_duration: entry.querySelector('input[name="track_duration"]').value,
    };
  });

  fetch('/tracks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(tracks),
  })
  .then(response => response.json())
  .then(data => {
    console.log(data.message); // Правильно обрабатываем и выводим сообщение от сервера
    closeModal('add-track-modal');
    document.getElementById('add-tracks-form').reset();
    // Обновите список песен на странице, если необходимо
  })
  .catch(error => {
    console.error('Ошибка при добавлении песен:', error);
  });
});