-- ==============================================================================
-- ResidentHub - Initial Development & Demo Seed Data
-- Standard PostgreSQL (v13+) script populating all 18 tables
-- ==============================================================================

-- 1. TÒA NHÀ (BUILDINGS)
INSERT INTO buildings (id, code, name, total_floors, address)
VALUES 
    ('b0000000-0000-0000-0000-000000000001', 'TOW-A', 'Tòa Parkview A', 25, 'Số 1 Mai Dịch, Cầu Giấy, Hà Nội'),
    ('b0000000-0000-0000-0000-000000000002', 'TOW-B', 'Tòa Parkview B', 25, 'Số 1 Mai Dịch, Cầu Giấy, Hà Nội')
ON CONFLICT (code) DO UPDATE 
SET name = EXCLUDED.name, total_floors = EXCLUDED.total_floors, address = EXCLUDED.address;

-- 2. CĂN HỘ (APARTMENTS)
INSERT INTO apartments (id, building_id, room_number, floor, area, bedroom_count, bathroom_count, status)
VALUES
    ('a0000000-0000-0000-0000-000000001205', 'b0000000-0000-0000-0000-000000000001', 'A-1205', 12, 86.00, 2, 2, 'OWNER_OCCUPIED'),
    ('a0000000-0000-0000-0000-000000001206', 'b0000000-0000-0000-0000-000000000001', 'A-1206', 12, 72.50, 2, 1, 'RENTED'),
    ('a0000000-0000-0000-0000-000000001001', 'b0000000-0000-0000-0000-000000000001', 'A-1001', 10, 95.00, 3, 2, 'OWNER_OCCUPIED'),
    ('a0000000-0000-0000-0000-000000000502', 'b0000000-0000-0000-0000-000000000001', 'A-0502', 5, 68.00, 2, 1, 'EMPTY'),
    ('a0000000-0000-0000-0000-000000000801', 'b0000000-0000-0000-0000-000000000002', 'B-0801', 8, 85.00, 2, 2, 'OWNER_OCCUPIED'),
    ('a0000000-0000-0000-0000-000000001403', 'b0000000-0000-0000-0000-000000000002', 'B-1403', 14, 110.00, 3, 2, 'RENTED')
ON CONFLICT (building_id, room_number) DO UPDATE 
SET area = EXCLUDED.area, status = EXCLUDED.status;

-- 3. CHỦ SỞ HỮU (OWNERS)
INSERT INTO owners (id, full_name, citizen_id, phone, email, address)
VALUES
    ('o0000000-0000-0000-0000-000000000001', 'Trần Hoàng Nam', '001090012345', '0912345678', 'nam.tran@email.com', 'A-1205 Parkview Tower, Hà Nội'),
    ('o0000000-0000-0000-0000-000000000002', 'Lê Minh Tâm', '001085002233', '0988112233', 'tam.le@email.com', 'Hai Bà Trưng, Hà Nội'),
    ('o0000000-0000-0000-0000-000000000003', 'Nguyễn Văn An', '001085006789', '0903456789', 'an.nguyen@email.com', 'A-1001 Parkview Tower, Hà Nội'),
    ('o0000000-0000-0000-0000-000000000004', 'Vũ Thị Hạnh', '001188009988', '0977889900', 'hanh.vu@email.com', 'B-0801 Parkview Tower, Hà Nội')
ON CONFLICT (citizen_id) DO UPDATE 
SET full_name = EXCLUDED.full_name, phone = EXCLUDED.phone, email = EXCLUDED.email;

-- 4. HỢP ĐỒNG SỞ HỮU CĂN HỘ (APARTMENT_OWNERS)
INSERT INTO apartment_owners (id, apartment_id, owner_id, ownership_type, start_date, is_current)
VALUES
    ('ao000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000001205', 'o0000000-0000-0000-0000-000000000001', 'SOLE', '2023-01-15', TRUE),
    ('ao000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000001206', 'o0000000-0000-0000-0000-000000000002', 'SOLE', '2023-02-01', TRUE),
    ('ao000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000001001', 'o0000000-0000-0000-0000-000000000003', 'SOLE', '2022-11-20', TRUE),
    ('ao000000-0000-0000-0000-000000000801', 'a0000000-0000-0000-0000-000000000801', 'o0000000-0000-0000-0000-000000000004', 'SOLE', '2023-03-10', TRUE)
ON CONFLICT (id) DO NOTHING;

-- 5. CƯ DÂN (RESIDENTS)
INSERT INTO residents (id, full_name, citizen_id, date_of_birth, gender, phone, email, hometown, resident_status, avatar_url)
VALUES
    ('r0000000-0000-0000-0000-000000000001', 'Trần Hoàng Nam', '001090012345', '1985-05-14', 'MALE', '0912345678', 'nam.tran@email.com', 'Nam Định', 'PERMANENT', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
    ('r0000000-0000-0000-0000-000000000002', 'Lê Thị Mai', '001192023456', '1988-08-22', 'FEMALE', '0988123456', 'mai.le@email.com', 'Hà Nội', 'PERMANENT', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'),
    ('r0000000-0000-0000-0000-000000000003', 'Trần Hoàng Quân', '001215034567', '2014-11-10', 'MALE', NULL, NULL, 'Hà Nội', 'PERMANENT', NULL),
    ('r0000000-0000-0000-0000-000000000004', 'Đặng Quốc Huy', '034095018899', '1995-03-12', 'MALE', '0934567890', 'huy.dang@email.com', 'Hải Phòng', 'TEMPORARY', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'),
    ('r0000000-0000-0000-0000-000000000005', 'Nguyễn Văn An', '001085006789', '1980-01-25', 'MALE', '0903456789', 'an.nguyen@email.com', 'Bắc Ninh', 'PERMANENT', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'),
    ('r0000000-0000-0000-0000-000000000006', 'Phạm Thu Hương', '001190008899', '1984-06-18', 'FEMALE', '0912888999', 'huong.pham@email.com', 'Hà Nội', 'PERMANENT', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150')
ON CONFLICT (citizen_id) DO UPDATE 
SET full_name = EXCLUDED.full_name, phone = EXCLUDED.phone, resident_status = EXCLUDED.resident_status;

-- 6. HỘ DÂN (HOUSEHOLDS)
INSERT INTO households (id, apartment_id, head_resident_id, household_code, registration_date, status)
VALUES
    ('h0000000-0000-0000-0000-000000001205', 'a0000000-0000-0000-0000-000000001205', 'r0000000-0000-0000-0000-000000000001', 'HK-1205', '2023-01-20', 'ACTIVE'),
    ('h0000000-0000-0000-0000-000000001206', 'a0000000-0000-0000-0000-000000001206', 'r0000000-0000-0000-0000-000000000004', 'HK-1206', '2023-02-15', 'ACTIVE'),
    ('h0000000-0000-0000-0000-000000001001', 'a0000000-0000-0000-0000-000000001001', 'r0000000-0000-0000-0000-000000000005', 'HK-1001', '2022-12-01', 'ACTIVE')
ON CONFLICT (household_code) DO UPDATE 
SET status = EXCLUDED.status;

-- 7. THÀNH VIÊN HỘ DÂN (HOUSEHOLD_MEMBERS)
INSERT INTO household_members (id, household_id, resident_id, relationship_to_head, joined_date, is_head)
VALUES
    ('hm000000-0000-0000-0000-000000000001', 'h0000000-0000-0000-0000-000000001205', 'r0000000-0000-0000-0000-000000000001', 'CHỦ HỘ', '2023-01-20', TRUE),
    ('hm000000-0000-0000-0000-000000000002', 'h0000000-0000-0000-0000-000000001205', 'r0000000-0000-0000-0000-000000000002', 'VỢ', '2023-01-20', FALSE),
    ('hm000000-0000-0000-0000-000000000003', 'h0000000-0000-0000-0000-000000001205', 'r0000000-0000-0000-0000-000000000003', 'CON', '2023-01-20', FALSE),
    ('hm000000-0000-0000-0000-000000000004', 'h0000000-0000-0000-0000-000000001206', 'r0000000-0000-0000-0000-000000000004', 'CHỦ HỘ', '2023-02-15', TRUE),
    ('hm000000-0000-0000-0000-000000000005', 'h0000000-0000-0000-0000-000000001001', 'r0000000-0000-0000-0000-000000000005', 'CHỦ HỘ', '2022-12-01', TRUE),
    ('hm000000-0000-0000-0000-000000000006', 'h0000000-0000-0000-0000-000000001001', 'r0000000-0000-0000-0000-000000000006', 'VỢ', '2022-12-01', FALSE)
ON CONFLICT (household_id, resident_id) DO NOTHING;

-- 8. BIẾN ĐỘNG CƯ TRÚ (RESIDENCE_RECORDS)
INSERT INTO residence_records (id, resident_id, apartment_id, record_type, start_date, end_date, reason, police_verified_code, status)
VALUES
    ('rec00000-0000-0000-0000-000000000001', 'r0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000001206', 'TAM_TRU', '2023-02-15', '2024-02-15', 'Thuê nhà công tác dài hạn', 'XN-TT-2023-0891', 'APPROVED'),
    ('rec00000-0000-0000-0000-000000000002', 'r0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000001205', 'TAM_VANG', '2025-06-01', '2025-07-01', 'Đi tu nghiệp nước ngoài ngắn hạn', 'XN-TV-2025-0144', 'APPROVED')
ON CONFLICT (id) DO NOTHING;

-- 9. VỊ TRÍ ĐỖ XE (PARKING_SLOTS)
INSERT INTO parking_slots (id, building_id, slot_code, floor, allowed_type, status)
VALUES
    ('p0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'B1-01', 'B1', 'CAR', 'OCCUPIED'),
    ('p0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'B1-02', 'B1', 'CAR', 'OCCUPIED'),
    ('p0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'B1-03', 'B1', 'CAR', 'AVAILABLE'),
    ('p0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000001', 'B2-01', 'B2', 'MOTORBIKE', 'OCCUPIED'),
    ('p0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000001', 'B2-02', 'B2', 'MOTORBIKE', 'AVAILABLE')
ON CONFLICT (building_id, slot_code) DO NOTHING;

-- 10. PHƯƠNG TIỆN (VEHICLES)
INSERT INTO vehicles (id, resident_id, apartment_id, parking_slot_id, license_plate, vehicle_type, brand_model, color, rfid_card_number, status, registration_date)
VALUES
    ('v0000000-0000-0000-0000-000000000001', 'r0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000001205', 'p0000000-0000-0000-0000-000000000001', '29A-888.99', 'CAR', 'Mazda CX-5', 'Trắng', 'RFID-C-88899', 'ACTIVE', '2023-01-25'),
    ('v0000000-0000-0000-0000-000000000002', 'r0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000001205', 'p0000000-0000-0000-0000-000000000004', '29-S1 234.56', 'MOTORBIKE', 'Honda SH 150i', 'Đen nhám', 'RFID-M-23456', 'ACTIVE', '2023-01-25'),
    ('v0000000-0000-0000-0000-000000000003', 'r0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000001001', 'p0000000-0000-0000-0000-000000000002', '30F-999.88', 'CAR', 'Toyota Camry', 'Đen', 'RFID-C-99988', 'ACTIVE', '2022-12-05')
ON CONFLICT (id) DO NOTHING;

-- 11. DANH MỤC BIỂU PHÍ (FEE_TYPES)
INSERT INTO fee_types (id, code, name, unit, unit_price, is_mandatory)
VALUES
    ('f0000000-0000-0000-0000-000000000001', 'MANAGEMENT', 'Phí dịch vụ quản lý vận hành', 'm2', 12000.00, TRUE),
    ('f0000000-0000-0000-0000-000000000002', 'PARKING_CAR', 'Phí trông giữ ô tô tầng hầm', 'xe/tháng', 1200000.00, FALSE),
    ('f0000000-0000-0000-0000-000000000003', 'PARKING_MOTO', 'Phí trông giữ xe máy tầng hầm', 'xe/tháng', 80000.00, FALSE),
    ('f0000000-0000-0000-0000-000000000004', 'WATER', 'Phí nước sinh hoạt căn hộ', 'm3', 14500.00, TRUE),
    ('f0000000-0000-0000-0000-000000000005', 'ELECTRICITY', 'Phí điện sinh hoạt (6 bậc EVN)', 'kWh', 2150.00, TRUE)
ON CONFLICT (code) DO UPDATE 
SET unit_price = EXCLUDED.unit_price, name = EXCLUDED.name;

-- 12. CHỈ SỐ ĐIỆN NƯỚC (METER_READINGS)
INSERT INTO meter_readings (id, apartment_id, meter_type, billing_period, previous_reading, current_reading)
VALUES
    ('m0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000001205', 'WATER', '10-2025', 145.00, 163.00),
    ('m0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000001205', 'ELECTRICITY', '10-2025', 1280.00, 1560.00),
    ('m0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000001206', 'WATER', '10-2025', 88.00, 98.00),
    ('m0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000001206', 'ELECTRICITY', '10-2025', 640.00, 810.00)
ON CONFLICT (apartment_id, meter_type, billing_period) DO UPDATE 
SET current_reading = EXCLUDED.current_reading, previous_reading = EXCLUDED.previous_reading;

-- 13. HÓA ĐƠN THÁNG (INVOICES)
INSERT INTO invoices (id, apartment_id, household_id, invoice_code, billing_month, total_amount, paid_amount, due_date, status)
VALUES
    ('inv00000-0000-0000-0000-000000001205', 'a0000000-0000-0000-0000-000000001205', 'h0000000-0000-0000-0000-000000001205', 'INV-202510-1205', '10/2025', 2914000.00, 2914000.00, '2025-11-10', 'PAID'),
    ('inv00000-0000-0000-0000-000000001206', 'a0000000-0000-0000-0000-000000001206', 'h0000000-0000-0000-0000-000000001206', 'INV-202510-1206', '10/2025', 1375000.00, 0.00, '2025-11-10', 'UNPAID'),
    ('inv00000-0000-0000-0000-000000000801', 'a0000000-0000-0000-0000-000000000801', NULL, 'INV-202510-0801', '10/2025', 1020000.00, 0.00, '2025-10-10', 'OVERDUE')
ON CONFLICT (invoice_code) DO UPDATE 
SET total_amount = EXCLUDED.total_amount, paid_amount = EXCLUDED.paid_amount, status = EXCLUDED.status;

-- 14. CHI TIẾT HÓA ĐƠN (INVOICE_ITEMS)
INSERT INTO invoice_items (id, invoice_id, fee_type_id, item_name, quantity, unit_price, amount)
VALUES
    ('ii000000-0000-0000-0000-000000000001', 'inv00000-0000-0000-0000-000000001205', 'f0000000-0000-0000-0000-000000000001', 'Phí quản lý căn hộ 86m2', 86.00, 12000.00, 1032000.00),
    ('ii000000-0000-0000-0000-000000000002', 'inv00000-0000-0000-0000-000000001205', 'f0000000-0000-0000-0000-000000000002', 'Phí gửi ô tô (29A-888.99)', 1.00, 1200000.00, 1200000.00),
    ('ii000000-0000-0000-0000-000000000003', 'inv00000-0000-0000-0000-000000001205', 'f0000000-0000-0000-0000-000000000003', 'Phí gửi xe máy (29-S1 234.56)', 1.00, 80000.00, 80000.00),
    ('ii000000-0000-0000-0000-000000000004', 'inv00000-0000-0000-0000-000000001205', 'f0000000-0000-0000-0000-000000000004', 'Tiền nước sinh hoạt (18 m3)', 18.00, 14500.00, 261000.00),
    ('ii000000-0000-0000-0000-000000000005', 'inv00000-0000-0000-0000-000000001205', 'f0000000-0000-0000-0000-000000000005', 'Tiền điện sinh hoạt (280 kWh)', 280.00, 1217.86, 341000.00)
ON CONFLICT (id) DO NOTHING;

-- 15. GIAO DỊCH THANH TOÁN (PAYMENT_TRANSACTIONS)
INSERT INTO payment_transactions (id, invoice_id, amount, payment_method, transaction_code, note, paid_at)
VALUES
    ('pt000000-0000-0000-0000-000000000001', 'inv00000-0000-0000-0000-000000001205', 2914000.00, 'BANK_TRANSFER', 'TXN-VIETQR-20251025-092811', 'Thanh toan VietQR qua Napas 247', '2025-10-25 09:28:11+07')
ON CONFLICT (transaction_code) DO NOTHING;

-- 16. NGƯỜI DÙNG & PHÂN QUYỀN (USERS)
-- Mật khẩu mặc định demo cho tất cả tài khoản: 'Admin@123'
-- Password Hash: $2b$12$e8YnJSmxP7G0n1sPzE9i0.XvN7WfP4i7B2F1O2C.J2qL3yZ4a5b6c (bcrypt)
INSERT INTO users (id, resident_id, username, password_hash, role, full_name, email, phone, is_active)
VALUES
    ('u0000000-0000-0000-0000-000000000001', NULL, 'admin', '$2b$12$e8YnJSmxP7G0n1sPzE9i0.XvN7WfP4i7B2F1O2C.J2qL3yZ4a5b6c', 'ADMIN', 'Quản Trị Viên Hệ Thống', 'admin@residenthub.vn', '0901000001', TRUE),
    ('u0000000-0000-0000-0000-000000000002', NULL, 'manager1', '$2b$12$e8YnJSmxP7G0n1sPzE9i0.XvN7WfP4i7B2F1O2C.J2qL3yZ4a5b6c', 'MANAGER', 'Trần Văn Bình (Trưởng BQL)', 'binh.bql@residenthub.vn', '0901000002', TRUE),
    ('u0000000-0000-0000-0000-000000000003', NULL, 'tech1', '$2b$12$e8YnJSmxP7G0n1sPzE9i0.XvN7WfP4i7B2F1O2C.J2qL3yZ4a5b6c', 'TECHNICIAN', 'Nguyễn Kỹ Thuật', 'tech.nguyen@residenthub.vn', '0901000003', TRUE),
    ('u0000000-0000-0000-0000-000000000004', 'r0000000-0000-0000-0000-000000000001', 'resident1205', '$2b$12$e8YnJSmxP7G0n1sPzE9i0.XvN7WfP4i7B2F1O2C.J2qL3yZ4a5b6c', 'RESIDENT', 'Trần Hoàng Nam', 'nam.tran@email.com', '0912345678', TRUE)
ON CONFLICT (username) DO UPDATE 
SET role = EXCLUDED.role, is_active = EXCLUDED.is_active;

-- 17. PHẢN ÁNH & KHIẾU NẠI (FEEDBACKS)
INSERT INTO feedbacks (id, resident_id, apartment_id, assigned_to, title, category, content, priority, status, created_at, resolved_at)
VALUES
    ('fb000000-0000-0000-0000-000000000001', 'r0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000001205', 'u0000000-0000-0000-0000-000000000003', 'Hỏng vòi nước ban công thoát sàn', 'REPAIR', 'Vòi cấp nước máy giặt ngoài lô gia bị rò rỉ nước liên tục làm ẩm tường.', 'MEDIUM', 'IN_PROGRESS', CURRENT_TIMESTAMP - INTERVAL '1 day', NULL),
    ('fb000000-0000-0000-0000-000000000002', 'r0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000001001', 'u0000000-0000-0000-0000-000000000003', 'Thang máy tháp A số 03 rung giật khi qua tầng 15', 'SECURITY', 'Thang máy số 3 có tiếng kêu rít cơ khí và giật mạnh khi di chuyển xuống tầng 15.', 'URGENT', 'RESOLVED', CURRENT_TIMESTAMP - INTERVAL '3 days', CURRENT_TIMESTAMP - INTERVAL '1 day'),
    ('fb000000-0000-0000-0000-000000000003', 'r0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000001206', NULL, 'Vệ sinh sảnh hành lang tầng 12', 'CLEANING', 'Hành lang tầng 12 có vết bẩn sau khi vận chuyển đồ đạc cuối tuần qua.', 'LOW', 'OPEN', CURRENT_TIMESTAMP - INTERVAL '4 hours', NULL)
ON CONFLICT (id) DO NOTHING;

-- 18. NHẬT KÝ TIẾN ĐỘ PHẢN ÁNH (FEEDBACK_UPDATES)
INSERT INTO feedback_updates (id, feedback_id, updated_by_user_id, message, previous_status, new_status, created_at)
VALUES
    ('fbu00000-0000-0000-0000-000000000001', 'fb000000-0000-0000-0000-000000000001', 'u0000000-0000-0000-0000-000000000002', 'BQL tiếp nhận yêu cầu và điều phối kỹ thuật viên phụ trách.', 'OPEN', 'IN_PROGRESS', CURRENT_TIMESTAMP - INTERVAL '20 hours'),
    ('fbu00000-0000-0000-0000-000000000002', 'fb000000-0000-0000-0000-000000000002', 'u0000000-0000-0000-0000-000000000003', 'Đã bảo trì pully và căn chỉnh ray dẫn hướng thang số 3. Thang hoạt động êm ái.', 'IN_PROGRESS', 'RESOLVED', CURRENT_TIMESTAMP - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- Hoàn tất nạp dữ liệu mẫu
