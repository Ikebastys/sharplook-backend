"""initial schema for SharpLook MVP"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "20260326_0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("email", sa.String(), nullable=False, unique=True),
        sa.Column("password_hash", sa.String(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )

    op.create_table(
        "products",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("image_url", sa.String(), nullable=True),
        sa.Column("price", sa.Numeric(10, 2), nullable=True),
        sa.Column("shop_name", sa.String(), nullable=True),
        sa.Column("url", sa.String(), nullable=True),
        sa.Column("color", sa.String(), nullable=True),
        sa.Column("category", sa.String(), nullable=True),
        sa.Column("size", sa.String(), nullable=True),
        sa.Column("embedding", sa.JSON(), nullable=True),
    )

    op.create_table(
        "favorites",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("product_id", sa.Integer(), sa.ForeignKey("products.id"), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )

    op.create_table(
        "search_events",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=True),
        sa.Column("query_text", sa.String(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )

    op.create_table(
        "click_events",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=True),
        sa.Column("product_id", sa.Integer(), sa.ForeignKey("products.id"), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("click_events")
    op.drop_table("search_events")
    op.drop_table("favorites")
    op.drop_table("products")
    op.drop_table("users")
