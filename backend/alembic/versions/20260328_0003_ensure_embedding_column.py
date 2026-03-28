"""ensure embedding column exists on products"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "20260328_0003"
down_revision = "20260328_0002"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    cols = [c["name"] for c in inspector.get_columns("products")]
    if "embedding" not in cols:
        op.add_column("products", sa.Column("embedding", sa.JSON(), nullable=True))


def downgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    cols = [c["name"] for c in inspector.get_columns("products")]
    if "embedding" in cols:
        op.drop_column("products", "embedding")
