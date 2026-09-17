-- ==============================================================================
-- ResidentHub - Hệ Thống Quản Lý Chung Cư & Hộ Dân
-- Database Schema for PostgreSQL (v13+)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- ENUM TYPES
-- ==============================================================================

DO $$ BEGIN
    CREATE TYPE apartment_status AS ENUM ('EMPTY', 'RENTED', 'OWNER_OCCUPIED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE ownership_type AS ENUM ('SOLE', 'CO_OWNER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE gender_type AS ENUM ('MALE', 'FEMALE', 'OTHER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE resident_status AS ENUM ('PERMANENT', 'TEMPORARY', 'ABSENT', 'MOVED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE household_status AS ENUM ('ACTIVE', 'MOVED_OUT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE residence_record_type AS ENUM ('TAM_TRU', 'TAM_VANG', 'NHAP_HO', 'CHUYEN_DI');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE residence_record_status AS ENUM ('PENDING', 'APPROVED', 'EXPIRED', 'REJECTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE parking_slot_status AS ENUM ('AVAILABLE', 'OCCUPIED', 'RESERVED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE vehicle_type AS ENUM ('CAR', 'MOTORBIKE', 'ELECTRIC_BIKE', 'BICYCLE', 'OTHER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE vehicle_status AS ENUM ('ACTIVE', 'INACTIVE', 'REVOKED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE meter_type AS ENUM ('WATER', 'ELECTRICITY');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE invoice_status AS ENUM ('UNPAID', 'PARTIAL', 'PAID', 'OVERDUE', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_method AS ENUM ('BANK_TRANSFER', 'CASH', 'VNPAY', 'MOMO');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE feedback_category AS ENUM ('NOISE', 'REPAIR', 'CLEANING', 'SECURITY', 'OTHER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE feedback_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE feedback_status AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('ADMIN', 'MANAGER', 'TECHNICIAN', 'RESIDENT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ==============================================================================
-- 1. BUILDINGS & APARTMENTS (TÒA NHÀ & CĂN HỘ)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS buildings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    total_floors INT NOT NULL,
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS apartments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    building_id UUID NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
    room_number VARCHAR(50) NOT NULL,
    floor INT NOT NULL,
    area NUMERIC(8, 2) NOT NULL, -- Diện tích m2
    bedroom_count INT DEFAULT 1,
    bathroom_count INT DEFAULT 1,
    status apartment_status DEFAULT 'EMPTY',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_building_room UNIQUE (building_id, room_number)
);

CREATE TABLE IF NOT EXISTS owners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    citizen_id VARCHAR(50) UNIQUE NOT NULL, -- CCCD/Hộ chiếu
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS apartment_owners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    apartment_id UUID NOT NULL REFERENCES apartments(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES owners(id) ON DELETE CASCADE,
    ownership_type ownership_type DEFAULT 'SOLE',
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 2. RESIDENTS & HOUSEHOLDS (CƯ DÂN & HỘ DÂN)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS residents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    citizen_id VARCHAR(50) UNIQUE,
    date_of_birth DATE,
    gender gender_type DEFAULT 'OTHER',
    phone VARCHAR(20),
    email VARCHAR(255),
    hometown TEXT,
    resident_status resident_status DEFAULT 'PERMANENT',
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS households (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    apartment_id UUID NOT NULL REFERENCES apartments(id) ON DELETE RESTRICT,
    head_resident_id UUID NOT NULL REFERENCES residents(id) ON DELETE RESTRICT,
    household_code VARCHAR(50) UNIQUE NOT NULL, -- Sổ hộ khẩu: HK-1205
    registration_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status household_status DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS household_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
    resident_id UUID NOT NULL REFERENCES residents(id) ON DELETE CASCADE,
    relationship_to_head VARCHAR(100) NOT NULL, -- CHỦ HỘ, VỢ, CHỒNG, CON, BỐ MẸ, NGƯỜI THUÊ...
    joined_date DATE NOT NULL DEFAULT CURRENT_DATE,
    is_head BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_household_resident UNIQUE (household_id, resident_id)
);

-- ==============================================================================
-- 3. RESIDENCE RECORDS (BIẾN ĐỘNG CƯ TRÚ)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS residence_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resident_id UUID NOT NULL REFERENCES residents(id) ON DELETE CASCADE,
    apartment_id UUID NOT NULL REFERENCES apartments(id) ON DELETE CASCADE,
    record_type residence_record_type NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    reason TEXT,
    police_verified_code VARCHAR(100), -- Số xác nhận công an
    status residence_record_status DEFAULT 'PENDING',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 4. VEHICLES & PARKING (PHƯƠNG TIỆN & BÃI ĐỖ)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS parking_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    building_id UUID NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
    slot_code VARCHAR(50) NOT NULL, -- B1-01, B2-15
    floor VARCHAR(20) NOT NULL,     -- B1, B2
    allowed_type vehicle_type NOT NULL,
    status parking_slot_status DEFAULT 'AVAILABLE',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_building_slot UNIQUE (building_id, slot_code)
);

CREATE TABLE IF NOT EXISTS vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resident_id UUID NOT NULL REFERENCES residents(id) ON DELETE CASCADE,
    apartment_id UUID NOT NULL REFERENCES apartments(id) ON DELETE CASCADE,
    parking_slot_id UUID UNIQUE REFERENCES parking_slots(id) ON DELETE SET NULL,
    license_plate VARCHAR(30) NOT NULL,
    vehicle_type vehicle_type NOT NULL,
    brand_model VARCHAR(100),
    color VARCHAR(50),
    rfid_card_number VARCHAR(100) UNIQUE,
    status vehicle_status DEFAULT 'ACTIVE',
    registration_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 5. BILLS & PAYMENTS (PHÍ & HÓA ĐƠN)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS fee_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL, -- MANAGEMENT, PARKING_CAR, WATER, ELEC...
    name VARCHAR(255) NOT NULL,
    unit VARCHAR(50) NOT NULL,        -- m2, vehicle, m3, kWh, month
    unit_price NUMERIC(12, 2) NOT NULL,
    is_mandatory BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS meter_readings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    apartment_id UUID NOT NULL REFERENCES apartments(id) ON DELETE CASCADE,
    meter_type meter_type NOT NULL,
    billing_period VARCHAR(20) NOT NULL, -- '10-2025'
    previous_reading NUMERIC(10, 2) NOT NULL,
    current_reading NUMERIC(10, 2) NOT NULL,
    consumption NUMERIC(10, 2) GENERATED ALWAYS AS (current_reading - previous_reading) STORED,
    recorded_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_apt_meter_period UNIQUE (apartment_id, meter_type, billing_period)
);

CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    apartment_id UUID NOT NULL REFERENCES apartments(id) ON DELETE RESTRICT,
    household_id UUID REFERENCES households(id) ON DELETE SET NULL,
    invoice_code VARCHAR(100) UNIQUE NOT NULL, -- INV-202510-1205
    billing_month VARCHAR(20) NOT NULL,        -- '10/2025'
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    paid_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    due_date DATE NOT NULL,
    status invoice_status DEFAULT 'UNPAID',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    fee_type_id UUID NOT NULL REFERENCES fee_types(id) ON DELETE RESTRICT,
    item_name VARCHAR(255) NOT NULL,
    quantity NUMERIC(10, 2) NOT NULL,
    unit_price NUMERIC(12, 2) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    amount NUMERIC(12, 2) NOT NULL,
    payment_method payment_method NOT NULL,
    transaction_code VARCHAR(100) UNIQUE,
    note TEXT,
    paid_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 6. USERS & ACCOUNTS (NGƯỜI DÙNG & TÀI KHOẢN)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resident_id UUID UNIQUE REFERENCES residents(id) ON DELETE SET NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'RESIDENT',
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 7. FEEDBACK & MAINTENANCE (PHẢN ÁNH & KHIẾU NẠI)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS feedbacks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resident_id UUID NOT NULL REFERENCES residents(id) ON DELETE CASCADE,
    apartment_id UUID NOT NULL REFERENCES apartments(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    category feedback_category NOT NULL DEFAULT 'OTHER',
    content TEXT NOT NULL,
    priority feedback_priority DEFAULT 'MEDIUM',
    status feedback_status DEFAULT 'OPEN',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS feedback_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feedback_id UUID NOT NULL REFERENCES feedbacks(id) ON DELETE CASCADE,
    updated_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    previous_status feedback_status,
    new_status feedback_status,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- INDEXES FOR QUERY OPTIMIZATION
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_apartments_building_id ON apartments(building_id);
CREATE INDEX IF NOT EXISTS idx_apartments_status ON apartments(status);
CREATE INDEX IF NOT EXISTS idx_households_apartment_id ON households(apartment_id);
CREATE INDEX IF NOT EXISTS idx_households_head_id ON households(head_resident_id);
CREATE INDEX IF NOT EXISTS idx_residents_citizen_id ON residents(citizen_id);
CREATE INDEX IF NOT EXISTS idx_residents_phone ON residents(phone);
CREATE INDEX IF NOT EXISTS idx_household_members_household ON household_members(household_id);
CREATE INDEX IF NOT EXISTS idx_household_members_resident ON household_members(resident_id);
CREATE INDEX IF NOT EXISTS idx_residence_records_resident ON residence_records(resident_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_apartment ON vehicles(apartment_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_license_plate ON vehicles(license_plate);
CREATE INDEX IF NOT EXISTS idx_invoices_apartment_status ON invoices(apartment_id, status);
CREATE INDEX IF NOT EXISTS idx_invoices_billing_month ON invoices(billing_month);
CREATE INDEX IF NOT EXISTS idx_feedbacks_status ON feedbacks(status);
CREATE INDEX IF NOT EXISTS idx_feedbacks_resident ON feedbacks(resident_id);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
