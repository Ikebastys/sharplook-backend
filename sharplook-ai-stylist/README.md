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
