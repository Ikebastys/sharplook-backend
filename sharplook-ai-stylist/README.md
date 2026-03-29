# SharpLook — умный поиск одежды

## Локальный запуск
1. Запустите бэкенд: `cd backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`
2. Запустите фронтенд: `cd sharplook-ai-stylist && npm install && npm run dev` (по умолчанию `http://localhost:8080` или `http://localhost:5173`)

## Админка
- Залогиньтесь под пользователем с `is_admin=True` в БД.
- После логина в навбаре появится ссылка **Admin** (иконка щита).
- Переход на `/admin` открывает iframe со статистикой `http://localhost:8000/admin/stats`; токен передаётся через query `?token=...`.

### Требования к бэкенду
- Эндпоинт `GET /v1/me` должен отдавать `{ id, email, is_admin }` по текущему JWT.
- Страница `/admin/stats` должна уметь принимать `?token=...` (или cookie) для авторизации.

## MVP v1
1. Запуск фронта (dev):
   ```
   cd sharplook-ai-stylist
   npm install
   npm run dev -- --host --port 8080
   ```
2. Бэкенд (должен идти параллельно):
   ```
   cd backend
   .\.venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```
3. Открыть в браузере:
   - Фронт: http://localhost:8080
   - Админка (вкладка Admin в навбаре, нужен токен админа): iframe на http://localhost:8000/admin/stats
   - Картинки подставляются из бэка: пример http://localhost:8000/images/1163.jpg
4. Должно работать:
   - Текстовый поиск по товарам с учётом цвета
   - Отображение реальных фото из `backend/images` по полю `image_path`
   - Логин/регистрация, определение админа через /v1/me, избранное
   - Админ-статистика внутри страницы /admin
