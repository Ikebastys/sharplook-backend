from app.db import Base

# Ensure models are imported so Alembic sees them
from app.models.product import Product  # noqa: F401
from app.models.user import User  # noqa: F401
from app.models.favorite import Favorite  # noqa: F401
from app.models.search_event import SearchEvent  # noqa: F401
from app.models.click_event import ClickEvent  # noqa: F401
