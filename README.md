
## О проекте


Этот проект является серверным решением для управления коллекцией виниловых пластинок. Он предоставляет сервер на Node.js, который подключается к базе данных PostgreSQL и обслуживает клиентский интерфейс для взаимодействия.

Используемые технологии:
- Backend: Node.js
- Frontend: HTML, CSS, EJS
- База данных: PostgreSQL
- Туннелирование: ngrok

## Установка

Перед началом необходимо установить:

- Node.js
- npm (Node Package Manager)
- PostgreSQL
- DBeaver (или любой другой инструмент управления базами данных)
- ngrok (для демонстрации в мобильном формате)

А также нобходимые пакеты:
- express
- pg
- qrcode
- ejs
- iconv-lite

Установка пакетов: 

`npm install`


## Начало работы

Чтобы настроить проект, необходимо выполнить следующие шаги:

#### 1. Склонировать репозиторий
#### 2. Перейти в директорию проекта
#### 3. Настроить базу данных PostgreSQL<br>

Сначала необходимо создать новую базу данных:

`createdb -U postgres vinyl`

Затем восстановить базу данных из дампа:

`psql -U postgres -d vinyl -f vinyl_database.sql`<br>

#### 4. Для запуска сервера выполнить:
`node main.js`

#### 5. Использование ngrok

Перед использованием `ngrok` необходимо, чтобы локальный сервер уже был запущен

Запуск:
`ngrok http 3000`

После запуска ngrok появится статусный экран в терминале, который показывает статус туннеля и предоставляет URL-адреса, через которые получается доступ к локальному серверу. Это будет что-то вроде `http://12345.ngrok.io`.
