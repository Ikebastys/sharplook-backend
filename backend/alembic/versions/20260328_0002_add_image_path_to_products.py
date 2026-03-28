"""add image_path column to products"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "20260328_0002"
down_revision = "20260326_0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("products", sa.Column("image_path", sa.String(), nullable=True))


def downgrade() -> None:
    op.drop_column("products", "image_path")
