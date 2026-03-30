CREATE DATABASE social_pg_test
    WITH 
    OWNER = pguser
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.utf8'
    LC_CTYPE = 'en_US.utf8'
    TEMPLATE = template0;

\c social_pg_test;

CREATE DATABASE social_pg_users
    WITH 
    OWNER = pguser
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.utf8'
    LC_CTYPE = 'en_US.utf8'
    TEMPLATE = template0;

\c social_pg_users;

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_name TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now(),
    UNIQUE(user_name)
);

CREATE TABLE IF NOT EXISTS user_page_attributes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    attribute_name TEXT NOT NULL,
    attribute_value TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now(),
    UNIQUE(user_id, attribute_name)
);

BEGIN;
WITH new_user AS (
    INSERT INTO users (user_name)
    VALUES ('mikolaj')
    RETURNING id
)
INSERT INTO user_page_attributes (user_id, attribute_name, attribute_value)
SELECT id, attr_name, attr_value
FROM new_user,
     (VALUES 
        ('theme', 'dark'),
        ('language', 'pl'),
        ('timezone', 'CET')
     ) AS attrs(attr_name, attr_value);

COMMIT;

CREATE DATABASE social_pg_ads
    WITH 
    OWNER = pguser
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.utf8'
    LC_CTYPE = 'en_US.utf8'
    TEMPLATE = template0;

\c social_pg_ads;

CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    description TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

BEGIN;

INSERT INTO categories (description) VALUES ('Motoryzacja');
INSERT INTO categories (description) VALUES ('Nieruchomości');
INSERT INTO categories (description) VALUES ('Elektronika');
INSERT INTO categories (description) VALUES ('Moda');
INSERT INTO categories (description) VALUES ('Dom i ogród');

COMMIT;