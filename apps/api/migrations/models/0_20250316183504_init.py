from tortoise import BaseDBAsyncClient


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        CREATE TABLE IF NOT EXISTS `users` (
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `hashed_password` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
) CHARACTER SET utf8mb4;
CREATE TABLE IF NOT EXISTS `stocks` (
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `symbol` VARCHAR(10) NOT NULL UNIQUE,
    `name` VARCHAR(50) NOT NULL,
    `price_in_cents` INT NOT NULL,
    `price_last_updated_at` DATETIME(6) NOT NULL,
    `currency` VARCHAR(3) NOT NULL COMMENT 'USD: USD\nEUR: EUR\nGBP: GBP' DEFAULT 'USD',
    `logo_url` VARCHAR(255),
    KEY `idx_stocks_symbol_56854b` (`symbol`)
) CHARACTER SET utf8mb4;
CREATE TABLE IF NOT EXISTS `orders` (
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `status` VARCHAR(8) NOT NULL COMMENT 'complete: complete\npending: pending' DEFAULT 'pending',
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `user_id` INT NOT NULL,
    CONSTRAINT `fk_orders_users_411bb784` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) CHARACTER SET utf8mb4;
CREATE TABLE IF NOT EXISTS `order_items` (
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `status` VARCHAR(8) NOT NULL COMMENT 'complete: complete\npending: pending' DEFAULT 'pending',
    `order_type` VARCHAR(6) NOT NULL COMMENT 'market: market\nlimit: limit',
    `quantity` INT NOT NULL,
    `limit_price_in_cents` INT,
    `executed_price_in_cents` INT,
    `currency` VARCHAR(3) NOT NULL COMMENT 'USD: USD\nEUR: EUR\nGBP: GBP' DEFAULT 'USD',
    `order_id` INT NOT NULL,
    `stock_id` INT NOT NULL,
    CONSTRAINT `fk_order_it_orders_b892ad0e` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_order_it_stocks_91364e59` FOREIGN KEY (`stock_id`) REFERENCES `stocks` (`id`) ON DELETE CASCADE
) CHARACTER SET utf8mb4;
CREATE TABLE IF NOT EXISTS `aerich` (
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `version` VARCHAR(255) NOT NULL,
    `app` VARCHAR(100) NOT NULL,
    `content` JSON NOT NULL
) CHARACTER SET utf8mb4;"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        """
