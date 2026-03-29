# SharpLook Backend

## MVP v1
1. Запуск:
   ```
   cd backend
   .\.venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```
2. Открыть в браузере:
   - API docs: http://localhost:8000/docs
   - Проверка здоровья: http://localhost:8000/health
   - Картинки: http://localhost:8000/images/1163.jpg (пример)
   - Админка (нужен токен админа): http://localhost:8000/admin/stats?token=YOUR_JWT
3. Должно работать:
   - Поиск /v1/search/text c семантикой и фильтром по цвету
   - Реальные картинки из `backend/images` по полю `image_path`
   - Авторизация (register/login, JWT)
   - Избранное, клики, логирование поиска
   - Админ-статистика /admin/stats

## Статические изображения
- Складывайте датасет картинок в папку `backend/images/` (пути в БД вида `images/123.jpg`).
- Бэкенд раздаёт их по `http://localhost:8000/images/<file>`.
