-- 用户认证系统数据库表结构
-- 支持多种登录方式：OAuth、手机号+密码、手机号+验证码

-- 1. 用户主表 - 存储用户核心信息
CREATE TABLE `users` (
  `id` CHAR(36) NOT NULL COMMENT '用户UUID',
  `phone` VARCHAR(20) NULL COMMENT '手机号',
  `email` VARCHAR(255) NULL COMMENT '邮箱',
  `nickname` VARCHAR(100) NOT NULL DEFAULT '' COMMENT '昵称',
  `avatar` VARCHAR(500) NOT NULL DEFAULT '' COMMENT '头像',
  `status` ENUM('active', 'inactive', 'suspended', 'deleted') NOT NULL DEFAULT 'active' COMMENT '用户状态',
  `login_count` INT NOT NULL DEFAULT 0 COMMENT '登录次数',
  `last_login_at` DATETIME NULL COMMENT '最后登录时间',
  `last_login_ip` VARCHAR(45) NULL COMMENT '最后登录IP',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idx_users_phone` (`phone`) WHERE `phone` IS NOT NULL,
  UNIQUE INDEX `idx_users_email` (`email`) WHERE `email` IS NOT NULL,
  INDEX `idx_users_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户主表';

-- 2. 密码认证表 - 存储手机号+密码登录凭证
CREATE TABLE `user_passwords` (
  `id` CHAR(36) NOT NULL COMMENT 'UUID',
  `user_id` CHAR(36) NOT NULL COMMENT '用户ID',
  `phone` VARCHAR(20) NOT NULL COMMENT '手机号',
  `password_hash` VARCHAR(255) NOT NULL COMMENT '密码哈希',
  `salt` VARCHAR(50) NOT NULL COMMENT '盐值',
  `failed_attempts` INT NOT NULL DEFAULT 0 COMMENT '失败尝试次数',
  `last_failed_at` DATETIME NULL COMMENT '最后失败时间',
  `locked_until` DATETIME NULL COMMENT '锁定截止时间',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否激活',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idx_user_passwords_phone` (`phone`),
  UNIQUE INDEX `idx_user_passwords_user_phone` (`user_id`, `phone`),
  INDEX `idx_user_passwords_user_id` (`user_id`),
  CONSTRAINT `fk_user_passwords_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户密码表';

-- 3. OAuth认证表 - 存储第三方登录关联信息
CREATE TABLE `user_oauth_providers` (
  `id` CHAR(36) NOT NULL COMMENT 'UUID',
  `user_id` CHAR(36) NOT NULL COMMENT '用户ID',
  `provider` ENUM('github', 'google', 'wechat', 'apple') NOT NULL COMMENT 'OAuth提供商',
  `provider_user_id` VARCHAR(255) NOT NULL COMMENT '提供商用户ID',
  `email` VARCHAR(255) NULL COMMENT '邮箱',
  `display_name` VARCHAR(255) NULL COMMENT '显示名称',
  `profile_data` JSON NULL COMMENT '用户资料数据',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否激活',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idx_user_oauth_provider_user` (`user_id`, `provider`),
  UNIQUE INDEX `idx_user_oauth_provider_id` (`provider`, `provider_user_id`),
  INDEX `idx_user_oauth_user_id` (`user_id`),
  CONSTRAINT `fk_user_oauth_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户OAuth认证表';

-- 4. 用户会话表 - 存储登录会话信息
CREATE TABLE `user_sessions` (
  `id` CHAR(36) NOT NULL COMMENT 'UUID',
  `user_id` CHAR(36) NOT NULL COMMENT '用户ID',
  `access_token` VARCHAR(500) NOT NULL COMMENT '访问令牌',
  `refresh_token` VARCHAR(500) NOT NULL COMMENT '刷新令牌',
  `device_id` VARCHAR(255) NOT NULL COMMENT '设备ID',
  `device_name` VARCHAR(255) NULL COMMENT '设备名称',
  `device_type` VARCHAR(50) NULL COMMENT '设备类型',
  `ip_address` VARCHAR(45) NULL COMMENT 'IP地址',
  `user_agent` TEXT NULL COMMENT '用户代理',
  `expires_at` DATETIME NOT NULL COMMENT '过期时间',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否激活',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idx_user_sessions_access_token` (`access_token`),
  UNIQUE INDEX `idx_user_sessions_refresh` (`user_id`, `refresh_token`),
  INDEX `idx_user_sessions_user_id` (`user_id`),
  INDEX `idx_user_sessions_expires` (`expires_at`),
  CONSTRAINT `fk_user_sessions_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户会话表';

-- 5. 验证码表 - 存储手机验证码
CREATE TABLE `verification_codes` (
  `id` CHAR(36) NOT NULL COMMENT 'UUID',
  `phone` VARCHAR(20) NOT NULL COMMENT '手机号',
  `code` VARCHAR(10) NOT NULL COMMENT '验证码',
  `type` ENUM('login', 'register', 'reset_password', 'bind_phone') NOT NULL COMMENT '验证码类型',
  `status` ENUM('pending', 'verified', 'expired', 'used') NOT NULL DEFAULT 'pending' COMMENT '验证码状态',
  `attempt_count` INT NOT NULL DEFAULT 0 COMMENT '尝试次数',
  `expires_at` DATETIME NOT NULL COMMENT '过期时间',
  `verified_at` DATETIME NULL COMMENT '验证时间',
  `user_id` CHAR(36) NULL COMMENT '用户ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `ip_address` VARCHAR(45) NULL COMMENT 'IP地址',
  `user_agent` TEXT NULL COMMENT '用户代理',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idx_verification_codes_code` (`code`),
  INDEX `idx_verification_codes_phone_type` (`phone`, `type`, `status`),
  INDEX `idx_verification_codes_expires` (`expires_at`),
  INDEX `idx_verification_codes_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='验证码表';

-- 6. 安全审计表 - 记录安全相关操作
CREATE TABLE `security_audit_logs` (
  `id` CHAR(36) NOT NULL COMMENT 'UUID',
  `user_id` CHAR(36) NULL COMMENT '用户ID',
  `action_type` ENUM(
    'login_success', 'login_failed', 'logout', 'password_change', 
    'profile_update', 'oauth_link', 'oauth_unlink', 'verification_code_sent', 
    'verification_code_verified', 'suspicious_activity'
  ) NOT NULL COMMENT '操作类型',
  `result` ENUM('success', 'failure', 'warning') NOT NULL COMMENT '操作结果',
  `description` TEXT NULL COMMENT '描述',
  `metadata` JSON NULL COMMENT '元数据',
  `ip_address` VARCHAR(45) NULL COMMENT 'IP地址',
  `user_agent` TEXT NULL COMMENT '用户代理',
  `device_id` VARCHAR(255) NULL COMMENT '设备ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `related_entity_id` CHAR(36) NULL COMMENT '关联实体ID',
  `related_entity_type` VARCHAR(50) NULL COMMENT '关联实体类型',
  PRIMARY KEY (`id`),
  INDEX `idx_audit_logs_user_action` (`user_id`, `action_type`),
  INDEX `idx_audit_logs_ip` (`ip_address`),
  INDEX `idx_audit_logs_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='安全审计日志表';

-- 索引优化
ALTER TABLE `users` ADD INDEX `idx_users_created_at` (`created_at`);
ALTER TABLE `user_sessions` ADD INDEX `idx_sessions_created_at` (`created_at`);
ALTER TABLE `verification_codes` ADD INDEX `idx_codes_created_at` (`created_at`);
ALTER TABLE `security_audit_logs` ADD INDEX `idx_audit_created_at` (`created_at`);

-- 注释说明
-- 1. 所有表使用UTF8MB4字符集支持emoji和特殊字符
-- 2. 使用UUID作为主键，避免自增ID的安全问题
-- 3. 外键约束确保数据完整性
-- 4. 适当的索引优化查询性能
-- 5. 详细的字段注释便于维护