"""add is_admin flag to users"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "20260328_0004"
down_revision = "20260328_0003"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    cols = [c["name"] for c in inspector.get_columns("users")]
    if "is_admin" not in cols:
        op.add_column("users", sa.Column("is_admin", sa.Boolean(), nullable=False, server_default=sa.false()))
        op.execute("UPDATE users SET is_admin = 0 WHERE is_admin IS NULL")


def downgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    cols = [c["name"] for c in inspector.get_columns("users")]
    if "is_admin" in cols:
        op.drop_column("users", "is_admin")
