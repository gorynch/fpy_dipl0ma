# Приложение Cloud Storage (выполнил Игорь Головин)

--------

Задание к проекту [здесь](https://github.com/netology-code/fpy-diplom/blob/main/README.md).

Ссылка на [github](https://github.com/gorynch/fpy_dipl0ma).

Ссылка на [сайт](http://89.104.68.81) с выполненной работой доступна до 23.05.2025

--------

Большинство нижеприведённых команд действительны для ОС на базе Linux (Debian или Ubuntu, например)

Для суперпользователя, созданного при deploy проекта, доступна административная панель Джанго по адресу server_name/admin/

### Развёртывание серверной части приложения

Для удобства можно открыть два терминала, чтобы один из них использовать для команд виртуального окружения

1. На сервисе [reg.ru](https://www.reg.ru/vps/) или подобном необходимо арендовать виртуальный сервер VPS с ОС Ubuntu.
2. Настраиваем SSH ключ для безопасного подключения к серверу и для подтверждения своей идентичности. Либо используем SSH клиент, который сам генерирует ключи
Вводим в терминале:
```bash
ssh-keygen
```
для копирования ssh ключа:
```bash
cat ~/.ssh/id_rsa.pub
```
3. В личном кабинете сервиса REG.RU выбираем настройку SSL, где применяем ранее скопированный SSH ключ.
4. Используя терминал  и логин / пароль, которые пришли на почту после аренды сервера,
заходим на сервер через терминал:
```bash
ssh root@ip_adress_server  
```
5. Создаем нового пользователя (можно заменить имя на удобное Вам, но в этом случае необходимо заменять это имя и в дальнейших командах):
```bash
adduser admin 
 ```
где admin это имя нового пользователя и подтверждаем паролем.

6. Предоставляем права новому пользователю: 
```bash
usermod admin -aG sudo
```
7. Переключаем на пользователя:
```bash
su admin
```
8. Переходим в его домашнюю директорию:
```bash
cd ~
```
9. Обновляем пакетный менеджер командой:
```bash
sudo apt update
```
10. Устанавливаем пакеты для нашего приложения:
```bash
sudo apt install python3-pip postgresql python3-venv nginx nodejs npm
 ```
11. Переключаемся на пользователя Postgres:
```bash
sudo su postgres
```
12. Заходим в консоль postgres:
```sql
psql
```
13. Cоздаём пользователя БД:
```sql
CREATE USER admin WITH PASSWORD 'password';
```
14. Присваиваем права суперпользователя:
```sql
ALTER USER admin WITH SUPERUSER; 
```
15. Cоздаем БД с таким же именем как пользователь:
```sql
CREATE DATABASE admin;
```
16. Выходим из системы postgres и из пользователя postgres:
```sql
\q
```
```bash
Exit
```
17. Заходим в систему postgres под своим именем (admin):
```sql
psql
```
18. Создаем БД и выходим (если использовать имя БД отличное от cloud_storage, нужно будет его заменить в .env файле переменных окружения):
```sql
CREATE DATABASE cloud_storage WITH ENCODING 'UTF8';
```
```sql
\q
```
19. Клонируем проект с github:
```bash
git clone https://github.com/gorynch/fpy_dipl0ma.git
```
20. Переходим в папку проекта:
```bash
cd fpy_dipl0ma/backend
```
21. Создаем виртуальные окружение:
```bash
python3 -m venv env
```
22. Активируем виртуальные окружение:
```bash
source env/bin/activate
```
23. Устанавливаем все зависимости из проекта:
```bash
pip install -r requirements.txt
```
24. Создаем файл .env:
```bash
nano .env
```
25. Записываем в файле данные для работы приложения:
```
SECRET_KEY=0j-ig45lr!4drofxpojlwqb63ng#08=+a(*6^-qq7j7!vhyfis
DEBUG=False
ALLOWED_HOSTS=89.104.68.81
DB_ENGINE=django.db.backends.postgresql
DB_NAME=cloud_storage
DB_USER=admin
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432
```
где SECRET_KEY произвольный набор символов. Можно сгенерировать на [сервисе](https://djecrety.ir/)
!! Необходимо указать IP адрес ***Вашего*** сервера !!.

26. В активированном виртуальном окружении применяем миграции из проекта: 
```bash
python manage.py migrate
```
27. Создаем суперпользователя для панели администрирования Django:
```bash
python manage.py createsuperuser
```
28. Собираем статику: 
```bash
python manage.py collectstatic
```
29. Выходим из виртуального окружения и запускаем nginx:
```bash
sudo systemctl start nginx
```
30. Настраиваем конфигурационные файлы для управления nginx:
```bash
sudo nano /etc/nginx/sites-available/cloud
```
где вместо cloud может быть любое имя (если используете не cloud, измените пути в файле в соответствии с выбранным именем).

Содержимое файла:
```nginx
server {
    listen 80;
    # !!! заменить на IP адрес Вашего сервера
    server_name 89.104.68.81;

    location / {
        root /home/admin/fpy_dipl0ma/frontend/dist/;
        try_files $uri $uri/ /index.html;
    }

    # Обслуживание статических файлов
    location /static/ {
        alias /home/admin/fpy_dipl0ma/backend/static/;
        try_files $uri $uri/ =404;
    }
    # Проксирование запросов к /admin/ на Django-сервер
    location /admin/ {
        proxy_pass http://unix:/home/admin/fpy_dipl0ma/backend/app/cloud.sock;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    # Проксирование запросов к /api/ на Django-сервер
    location /api/ {
        proxy_pass http://unix:/home/admin/fpy_dipl0ma/backend/app/cloud.sock;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    # Проксирование запросов к /storage/ на Django-сервер
    location /storage/ {
        proxy_pass http://unix:/home/admin/fpy_dipl0ma/backend/app/cloud.sock;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    # Проксирование запросов к /users/ на Django-сервер
    location /users/ {
        proxy_pass http://unix:/home/admin/fpy_dipl0ma/backend/app/cloud.sock;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

}

```

31. Открываем файл настроек nginx для редактирования: 
```bash
sudo nano /etc/nginx/nginx.conf
``` 
и добавляем в раздел http:

```nginx
        upstream backend {
            server unix:/home/admin/fpy_dipl0ma/backend/app/cloud.sock;
        }   
        # увеличиваем ограничение на размер файлов, допустимого для пользователей.
        client_max_body_size 10000M;  
```
32. Создаем ссылку:
```bash
sudo ln -s /etc/nginx/sites-available/cloud /etc/nginx/sites-enabled/
```
33. Устанавливаем wsgi сервер для взаимодействия веб-сервера и python приложением. Будем устанавливать gunicorn.

    Активируем виртуальное окружение и устанавливаем 
```bash
pip install gunicorn
```
35. Указываем как подключать gunicorn: 
```bash
gunicorn app.wsgi --bind 0.0.0.0:8000
 ```
где app - это основное python приложение, а порт это то, к чему привязываем gunicorn.

35. Настраиваем, чтобы gunicorn был всегда запущен. 

    Выходим из виртуального окружения и открываем конфигурационный файл gunicorn:
```bash
sudo nano /etc/systemd/system/gunicorn.service
```
Содержимое файла (если использовали не имя cloud, нужно внести изменения):
```
[Unit]
Description=service for wsgi
After=network.target

[Service]
User=admin
Group=www-data
WorkingDirectory=/home/admin/fpy_dipl0ma/backend
ExecStart=/home/admin/fpy_dipl0ma/backend/env/bin/gunicorn --access-logfile -\
                --workers 3 --bind unix:/home/admin/fpy_dipl0ma/backend/app/cloud.sock \
                app.wsgi:application

[Install]
WantedBy=multi-user.target
```
36. Активируем gunicorn:
```bash
sudo systemctl start gunicorn
```
```
sudo systemctl enable gunicorn
```
37. Перезапускаем nginx:
```bash
sudo systemctl restart nginx
```
Если при запуске сервера будет ошибка 500 и в логах ```sudo tail -n 50 /var/log/nginx/error.log```
сообщение Permission denied необходимо предоставить права доступа nginx к 
```/home/admin/fpy_dipl0ma/frontend/dist/```
```bash
sudo chmod 755 /home/admin
```
```bash
sudo chown -R admin:www-data /home/admin/fpy_dipl0ma/backend
```
```bash
sudo chown -R admin:www-data /home/admin/fpy_dipl0ma/frontend
```
```bash
sudo systemctl restart nginx
```
```bash
sudo systemctl restart gunicorn
```

-------------------------------------------
### Deploy react приложения (сборка и настройка frontend)

38. Перейдите в папку frontend проекта 
```bash
cd /home/admin/fpy_dipl0ma/frontend
```
39. Создайте файл .env
```bash
nano .env
```
40. Со следующим содержимым (замените текущий IP на IP ***Вашего*** сервера)
```
VITE_SERVER=http://89.104.68.81
```
41. Установите необходимые зависимости для React:
```bash
npm install
```
Если в процессе установки появятся предупреждения (Warnings), лучше их исправить в соответствии с рекомендациями в консоли

42. Выполните команду сборки:
```bash
npm run build
```
