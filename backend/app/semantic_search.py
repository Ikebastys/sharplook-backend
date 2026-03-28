from __future__ import annotations

import hashlib
import math
from typing import Iterable, List, Sequence, Tuple

from sqlalchemy.orm import Session

from app.models.product import Product

EMBED_DIM = 64  # небольшой размер, чтобы быстро считать и хранить в SQLite


def _hash_token(token: str, dim: int = EMBED_DIM) -> List[float]:
    # Детеминированное псевдо-эмбеддинг токена по его хэшу
    h = hashlib.sha256(token.encode("utf-8")).digest()
    # берём пары байт и превращаем в числа
    vals = []
    for i in range(dim):
        byte_val = h[i % len(h)]
        vals.append((byte_val - 128) / 128.0)  # нормируем в -1..1
    return vals


def get_embedding(text: str) -> List[float]:
    """
    Заглушка эмбеддингов: детерминированно хэшируем токены.
    Позже сюда можно подставить реальный провайдер (OpenAI, Яндекс и т.д.).
    """
    tokens = text.lower().split()
    if not tokens:
        return [0.0] * EMBED_DIM

    vec = [0.0] * EMBED_DIM
    for tok in tokens:
        tvec = _hash_token(tok)
        for i in range(EMBED_DIM):
            vec[i] += tvec[i]
    # усредняем
    return [v / len(tokens) for v in vec]


def _cosine(a: Sequence[float], b: Sequence[float]) -> float:
    if not a or not b:
        return 0.0
    if len(a) != len(b):
        return 0.0
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(y * y for y in b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)


def index_products(session: Session, batch_size: int = 200) -> int:
    """
    Пересчитывает эмбеддинги для всех товаров.
    Возвращает количество обработанных записей.
    """
    total = 0
    batch = 0
    products: Iterable[Product] = session.query(Product).all()
    for product in products:
        text = f"{product.title or ''} {product.description or ''}".strip()
        embedding = get_embedding(text)
        product.embedding = embedding
        total += 1
        batch += 1
        if batch >= batch_size:
            session.commit()
            batch = 0
    if batch:
        session.commit()
    return total


def semantic_search(session: Session, query: str, limit: int = 10) -> List[Product]:
    """
    Возвращает top-N товаров по косинусному сходству с запросом.
    """
    query = (query or "").strip()
    if not query:
        return []
    q_emb = get_embedding(query)

    products: Iterable[Product] = session.query(Product).all()
    scored: List[Tuple[Product, float]] = []
    for product in products:
        emb = product.embedding
        if not emb:
            # если нет эмбеддинга, пропустим; при желании можно посчитать на лету
            continue
        score = _cosine(q_emb, emb)
        scored.append((product, score))

    scored.sort(key=lambda x: x[1], reverse=True)
    top_products = [p for p, _ in scored[:limit]]
    return top_products
