-- ALEM database schema
-- InnoDB + utf8mb4 throughout; foreign keys enforce referential integrity;
-- no column ever stores a plaintext password.

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS users (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username        VARCHAR(64)  NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,        -- password_hash() output (Argon2id), never raw
    role            ENUM('military', 'authority', 'admin') NOT NULL DEFAULT 'military',
    totp_secret     VARCHAR(64)  NULL,             -- base32 secret, only if 2FA enabled
    is_active       TINYINT(1)   NOT NULL DEFAULT 1,
    failed_attempts INT UNSIGNED NOT NULL DEFAULT 0,
    locked_until    DATETIME     NULL,
    last_login_at   DATETIME     NULL,
    created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS equipment (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    reference_code  VARCHAR(32)  NOT NULL UNIQUE,
    name            VARCHAR(160) NOT NULL,
    category        VARCHAR(80)  NOT NULL,
    status          ENUM('available', 'in_transit', 'maintenance', 'retired') NOT NULL DEFAULT 'available',
    description     TEXT         NULL,
    updated_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_equipment_category (category),
    INDEX idx_equipment_updated (updated_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS documents (
    id                 INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title              VARCHAR(200) NOT NULL,
    category           VARCHAR(80)  NOT NULL,
    cleared_roles      VARCHAR(100) NOT NULL DEFAULT 'military,authority',
    storage_filename   VARCHAR(255) NOT NULL,
    updated_at         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_documents_category (category)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS inquiries (
    id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id       INT UNSIGNED NULL,
    name          VARCHAR(120) NOT NULL,
    email         VARCHAR(160) NULL,
    organization  VARCHAR(160) NULL,
    subject       VARCHAR(140) NOT NULL,
    message       TEXT         NOT NULL,
    source        ENUM('public', 'portal') NOT NULL,
    status        ENUM('open', 'in_progress', 'closed') NOT NULL DEFAULT 'open',
    created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_inquiries_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_inquiries_user (user_id),
    INDEX idx_inquiries_created (created_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS audit_log (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id     INT UNSIGNED NULL,
    action      VARCHAR(64)  NOT NULL,
    context     JSON         NULL,
    ip_address  VARCHAR(45)  NOT NULL,
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_audit_action (action),
    INDEX idx_audit_created (created_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS rate_limit_hits (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    rate_key    VARCHAR(160) NOT NULL,
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_rate_key_time (rate_key, created_at)
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS = 1;

-- Example: creating the first admin user. Generate the hash with PHP:
--   php -r "echo password_hash('a-long-random-password', PASSWORD_ARGON2ID);"
-- Never insert a plaintext password into this table.
-- INSERT INTO users (username, password_hash, role) VALUES
--   ('admin', '$argon2id$...paste-generated-hash-here...', 'admin');