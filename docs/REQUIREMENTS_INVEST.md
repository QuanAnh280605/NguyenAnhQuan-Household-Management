# ResidentHub — Agile Requirements Dossier (INVEST Framework)
## Comprehensive User Stories, Acceptance Criteria (Gherkin) & INVEST Verification Matrix

> **Status:** Approved Architectural Baseline  
> **Audience:** Product Owners, Agile Development Teams, QA/SDET, Solution Architects, System Auditors  
> **Methodology:** Agile User Stories, INVEST Best Practices, BDD Gherkin (*Given - When - Then*)  
> **Traceability Links:**  
> - 📋 [USE_CASES.md](USE_CASES.md) (UML Functional Catalog & Fully-Dressed Use Cases)  
> - 🏛️ [ARCHITECTURE_C4.md](ARCHITECTURE_C4.md) (Context, Container, Components & Runtime View)  
> - 🖥️ [UI_UX_SPECIFICATION.md](UI_UX_SPECIFICATION.md) (Information Architecture & Screens Hierarchy)  
> - 🔗 [UI_DATABASE_MAPPING.md](UI_DATABASE_MAPPING.md) (UI Components to PostgreSQL Schema Mapping)  
> - 🗄️ [schema.sql](../schema.sql) (18-Table 3NF Normalized Relational Database Schema)

---

## 📑 Mục lục Tài liệu

1. [Phương pháp luận INVEST & Chuẩn mực BDD Gherkin](#1-phương-pháp-luận-invest--chuẩn-mực-bdd-gherkin)
2. [Hồ sơ Chân dung Người dùng & Mã định danh Actor](#2-hồ-sơ-chân-dung-người-dùng--mã-định-danh-actor)
3. [EPIC-01: Quản lý Tòa nhà, Căn hộ & Hồ sơ Chủ quyền (Apartments & Ownership)](#3-epic-01-quản-lý-tòa-nhà-căn-hộ--hồ-sơ-chủ-quyền)
4. [EPIC-02: Quản lý Hộ dân, Cư dân & Khai báo Cư trú (Residents & Civil Registry)](#4-epic-02-quản-lý-hộ-dân-cư-dân--khai-báo-cư-trú)
5. [EPIC-03: Quản lý Phương tiện & Bãi đỗ xe Tầng hầm (Vehicles & Parking Quota)](#5-epic-03-quản-lý-phương-tiện--bãi-đỗ-xe-tầng-hầm)
6. [EPIC-04: Điện nước, Động cơ Tính phí & Quyết toán VietQR (Billing & Payments)](#6-epic-04-điện-nước-động-cơ-tính-phí--quyết-toán-vietqr)
7. [EPIC-05: Tiếp nhận Phản ánh & Xử lý Kỹ thuật SLA (Tickets & Maintenance)](#7-epic-05-tiếp-nhận-phản-ánh--xử-lý-kỹ-thuật-sla)
8. [EPIC-06: Quản trị Hệ thống, Phân quyền RBAC & Biểu phí (Admin & Security)](#8-epic-06-quản-trị-hệ-thống-phân-quyền-rbac--biểu-phí)
9. [Ma trận Đánh giá Tiêu chuẩn INVEST Toàn diện](#9-ma-trận-đánh-giá-tiêu-chuẩn-invest-toàn-diện)
10. [Ma trận Truy vết Hai chiều (Requirements Traceability Matrix)](#10-ma-trận-truy-vết-hai-chiều-requirements-traceability-matrix)

---

## 1. Phương pháp luận INVEST & Chuẩn mực BDD Gherkin

Toàn bộ các yêu cầu chức năng của hệ thống **ResidentHub** được chuẩn hóa theo bộ nguyên tắc **INVEST** (Bill Wake):

| Tiêu chí | Diễn giải Chuẩn mực trong Dự án ResidentHub |
| :--- | :--- |
| **I — Independent** | Mỗi User Story được thiết kế độc lập tối đa với các câu chuyện khác, cho phép nhóm phát triển có thể ưu tiên, lập trình và đưa vào phát hành (Release) mà không bị phụ thuộc nghẽn mạch (*blocking dependency*). |
| **N — Negotiable** | Câu chuyện không phải hợp đồng đóng kín bất biến mà là lời mời thảo luận nghiệp vụ (*invitation to conversation*), cho phép Product Owner và Kỹ sư linh hoạt tối ưu hóa giải pháp kỹ thuật trong quá trình Sprint Planning. |
| **V — Valuable** | Mỗi câu chuyện bắt buộc phải mang lại giá trị trực tiếp, đo lường được cho người dùng cuối (Cư dân, Ban Quản lý, Kỹ thuật viên) hoặc tối ưu hóa hiệu quả vận hành doanh nghiệp tòa nhà. |
| **E — Estimable** | Phạm vi câu chuyện được mô tả tường minh, có tiêu chí kỹ thuật rõ ràng để nhóm kỹ thuật có thể ước lượng độ phức tạp bằng Story Points (dãy Fibonacci 1, 2, 3, 5, 8). |
| **S — Small** | Kích thước câu chuyện được chia nhỏ vừa vặn, đảm bảo có thể hoàn thành trọn vẹn (Dev + Test) trong vòng từ 1 đến 3 ngày làm việc (không vượt quá 1 sprint 2 tuần). |
| **T — Testable** | Mọi câu chuyện đều có bộ Tiêu chí Nghiệm thu (**Acceptance Criteria - AC**) chi tiết, viết theo chuẩn **Given - When - Then** (Behavior-Driven Development / Gherkin) bao quát cả luồng thành công (*Happy Path*) và luồng ngoại lệ/lỗi (*Edge Cases & Negative Paths*). |

---

## 2. Hồ sơ Chân dung Người dùng & Mã định danh Actor

| Mã Actor | Tên Vai trò | Mô tả Chân dung Người dùng & Mục tiêu Trọng tâm |
| :--- | :--- | :--- |
| **`ACT-RES`** | **Cư dân / Chủ hộ** | Người sinh sống trong chung cư: Cần theo dõi thông tin căn hộ, thanh toán phí sinh hoạt tiện lợi qua mã QR, khai báo lưu trú online và gửi phản ánh khi gặp sự cố. |
| **`ACT-MGR`** | **Ban Quản lý / Kế toán** | Cán bộ điều hành vận hành tòa nhà: Cần giám sát danh bạ căn hộ, xét duyệt hồ sơ cư trú, kiểm soát nốt đỗ xe tầng hầm, chốt chỉ số điện nước và phát hành hóa đơn định kỳ. |
| **`ACT-TECH`**| **Kỹ thuật viên Tòa nhà** | Nhân viên cơ điện/bảo trì: Cần tiếp nhận phiếu sửa chữa theo đúng chuyên môn, ghi nhận hiện trường bằng ảnh chụp, hoàn tất công việc theo đúng cam kết thời gian SLA. |
| **`ACT-ADM`** | **Quản trị viên Hệ thống** | Cán bộ quản trị CNTT: Cần phân quyền tài khoản chặt chẽ theo vai trò (RBAC), cấu hình định mức phí và bảng giá dịch vụ, giám sát an toàn hệ thống qua nhật ký kiểm toán. |

---

## 3. EPIC-01: Quản lý Tòa nhà, Căn hộ & Hồ sơ Chủ quyền

Quản lý cấu trúc phân tầng vật lý của tòa nhà, danh mục từng căn hộ, diện tích tim tường/thông thủy, hồ sơ quyền sở hữu và chu kỳ cư trú của căn hộ.

### US-APT-01: Tra cứu Danh bạ Căn hộ & Bộ lọc Đa Tiêu chí
- **Mô tả:**  
  *Là một* **Ban Quản lý (`ACT-MGR`)**,  
  *Tôi muốn* tìm kiếm và lọc danh bạ căn hộ theo tòa, tầng, diện tích và trạng thái cư trú (*Trống, Đã cho thuê, Đang ở*),  
  *Để* nắm bắt nhanh chóng tỷ lệ lấp đầy căn hộ và cung cấp thông tin chính xác khi tiếp nhận yêu cầu hành chính.
- **Ước lượng:** 3 Story Points (Small)
- **Đánh giá INVEST:**
  - `I`: Độc lập với việc tạo mới hay chỉnh sửa hợp đồng sở hữu.
  - `N`: Cho phép thỏa thuận thêm các bộ lọc phụ (theo số phòng ngủ/phòng tắm).
  - `V`: Tăng tốc độ tra cứu hồ sơ căn hộ từ vài phút xuống dưới 2 giây.
  - `E`: Sử dụng truy vấn SQL có Index trên `building_id`, `floor`, `status`.
  - `S`: Hoàn thành trong 2 ngày phát triển.
  - `T`: Kiểm thử tự động bằng bộ AC Gherkin.
- **Tiêu chí Nghiệm thu (Acceptance Criteria):**
  ```gherkin
  Scenario: Lọc căn hộ theo trạng thái cư trú thành công (Happy Path)
    Given Ban Quản lý đang đăng nhập tại trang "/can-ho"
    When Ban Quản lý chọn bộ lọc Tòa nhà là "Tòa A" và Trạng thái là "Trống (EMPTY)"
    Then Hệ thống hiển thị danh sách các căn hộ thuộc Tòa A có trạng thái "EMPTY"
    And Số lượng kết quả hiển thị trên bảng trùng khớp với tổng số lượng trong cơ sở dữ liệu
    And Mỗi dòng căn hộ hiển thị rõ Mã phòng, Tầng, Diện tích m², Số phòng ngủ

  Scenario: Tìm kiếm căn hộ theo từ khóa số phòng
    Given Ban Quản lý đang ở trang danh mục căn hộ
    When Ban Quản lý nhập từ khóa "1205" vào ô tìm kiếm nhanh
    Then Hệ thống hiển thị căn hộ phòng "1205" của tòa nhà tương ứng
    And Nếu không tìm thấy kết quả, hệ thống hiển thị Empty State "Không tìm thấy căn hộ phù hợp"
  ```
- **Traceability:** `UC-RES-04` | `apartments`, `buildings` | `/can-ho`

---

### US-APT-02: Tiếp nhận Căn hộ Mới & Thiết lập Hồ sơ Chủ sở hữu Ban đầu
- **Mô tả:**  
  *Là một* **Ban Quản lý (`ACT-MGR`)**,  
  *Tôi muốn* tạo mới hồ sơ căn hộ và gán thông tin chủ sở hữu hợp pháp (*Họ tên, CCCD, SĐT, Ngày nhận bàn giao*),  
  *Để* thiết lập quyền tài sản ban đầu và phục vụ công tác thu phí quản lý vận hành.
- **Ước lượng:** 5 Story Points (Medium)
- **Đánh giá INVEST:** `I`: Có | `N`: Có | `V`: Có | `E`: Có | `S`: Có | `T`: Có
- **Tiêu chí Nghiệm thu (Acceptance Criteria):**
  ```gherkin
  Scenario: Tạo mới căn hộ kèm hồ sơ chủ sở hữu hợp lệ (Happy Path)
    Given Ban Quản lý mở form "Thêm căn hộ mới"
    When Ban Quản lý nhập mã phòng "1508", Tòa "A", Tầng 15, Diện tích 85.5 m²
    And Nhập thông tin chủ sở hữu: Tên "Nguyễn Văn An", CCCD "001099012345", SĐT "0987654321"
    And Bấm nút "Lưu hồ sơ"
    Then Hệ thống tạo bản ghi mới trong bảng "apartments" với trạng thái "OWNER_OCCUPIED"
    And Tạo liên kết chủ sở hữu trong bảng "apartment_owners" với is_current = TRUE
    And Hiển thị thông báo Toast "Thiết lập hồ sơ căn hộ 1508 thành công"

  Scenario: Báo lỗi khi tạo trùng mã căn hộ trong cùng một tòa (Negative Path)
    Given Tòa nhà "A" đã tồn tại căn hộ mang mã "1508"
    When Ban Quản lý cố gắng tạo thêm một căn hộ mang mã "1508" tại Tòa "A"
    Then Hệ thống ngăn chặn việc lưu dữ liệu
    And Trả về mã lỗi RFC 7807 với thông điệp "Mã căn hộ 1508 đã tồn tại trong Tòa A"
  ```
- **Traceability:** `UC-RES-04` | `apartments`, `owners`, `apartment_owners` | `/can-ho`

---

### US-APT-03: Bàn giao Căn hộ & Chuyển dịch Chủ quyền Pháp lý
- **Mô tả:**  
  *Là một* **Ban Quản lý (`ACT-MGR`)**,  
  *Tôi muốn* ghi nhận việc chuyển nhượng căn hộ sang chủ sở hữu mới và lưu vết lịch sử sở hữu cũ,  
  *Để* bảo đảm tính chính xác pháp lý của người chịu trách nhiệm chi trả các nghĩa vụ tài chính.
- **Ước lượng:** 5 Story Points (Medium)
- **Đánh giá INVEST:** `I`: Có | `N`: Có | `V`: Có | `E`: Có | `S`: Có | `T`: Có
- **Tiêu chí Nghiệm thu (Acceptance Criteria):**
  ```gherkin
  Scenario: Chuyển nhượng căn hộ thành công kèm đóng quyền chủ cũ (Happy Path)
    Given Căn hộ "1002" đang có chủ sở hữu hiện tại là "Trần Đình C"
    When Ban Quản lý thực hiện thao tác "Chuyển giao quyền sở hữu" sang "Lê Thị D", CCCD "034199008877"
    And Xác nhận ngày chuyển nhượng là ngày hiện tại
    Then Hệ thống cập nhật bản ghi cũ trong "apartment_owners" với is_current = FALSE và end_date = CURRENT_DATE
    And Tạo bản ghi mới trong "apartment_owners" cho chủ "Lê Thị D" với is_current = TRUE
    And Toàn bộ lịch sử sở hữu của căn hộ 1002 vẫn được bảo tồn đầy đủ trong bảng lịch sử
  ```
- **Traceability:** `UC-RES-05` | `apartment_owners`, `apartments` | `/can-ho/[roomNumber]`

---

## 4. EPIC-02: Quản lý Hộ dân, Cư dân & Khai báo Cư trú

Quản lý Sổ hộ khẩu chung cư, danh sách nhân khẩu theo từng căn hộ, xác thực nhân thân CCCD và xử lý thủ tục khai báo biến động cư trú (Tạm trú / Tạm vắng / Chuyển khẩu).

### US-RES-01: Đăng ký Nhân khẩu vào Sổ Hộ khẩu & Xác thực CCCD 12 Số
- **Mô tả:**  
  *Là một* **Ban Quản lý (`ACT-MGR`)**,  
  *Tôi muốn* thêm thông tin cư dân mới vào sổ hộ khẩu của căn hộ kèm số CCCD hợp lệ và quan hệ với chủ hộ,  
  *Để* cập nhật chính xác danh sách nhân khẩu thực tế phục vụ an ninh trật tự và tính phí rác thải/dịch vụ theo đầu người.
- **Ước lượng:** 5 Story Points (Medium)
- **Đánh giá INVEST:** `I`: Độc lập | `N`: Có | `V`: Giá trị cao | `E`: Rõ ràng | `S`: 2 ngày | `T`: Viết được Gherkin
- **Tiêu chí Nghiệm thu (Acceptance Criteria):**
  ```gherkin
  Scenario: Thêm nhân khẩu mới thành công với CCCD 12 số hợp lệ (Happy Path)
    Given Hộ dân "HK-1205" đã được tạo lập trong hệ thống
    When Ban Quản lý thêm nhân khẩu: Họ tên "Nguyễn Văn Bình", CCCD "001202005678", Ngày sinh "15/08/2002", Quan hệ "Con"
    Then Hệ thống lưu bản ghi cư dân vào bảng "residents"
    And Tạo liên kết trong "household_members" với is_head = FALSE
    And Tăng tổng số nhân khẩu hiển thị của hộ HK-1205 lên thêm 1 người

  Scenario: Từ chối số định danh CCCD sai định dạng hoặc trùng lặp (Edge Case)
    Given Ban Quản lý nhập thông tin cư dân mới
    When Số CCCD nhập vào không đúng 12 chữ số (ví dụ: "01234") hoặc đã tồn tại trên một cư dân khác đang sinh sống
    Then Hệ thống báo lỗi Validation màu đỏ tại trường CCCD: "Số CCCD phải đúng 12 số và không được trùng lặp"
    And Nút "Xác nhận lưu" bị vô hiệu hóa
  ```
- **Traceability:** `UC-RES-03`, `UC-RES-01` | `residents`, `household_members` | `/cu-dan`

---

### US-RES-02: Chuyển giao Vai trò Chủ hộ Đảm bảo Duy nhất Một Chủ hộ
- **Mô tả:**  
  *Là một* **Ban Quản lý (`ACT-MGR`)**,  
  *Tôi muốn* chuyển giao vai trò Chủ hộ (*Head of Household*) từ thành viên cũ sang thành viên mới đủ điều kiện pháp lý,  
  *Để* xác lập người đại diện hợp pháp duy nhất của hộ gia đình nhận thông báo và hóa đơn của căn hộ.
- **Ước lượng:** 5 Story Points (Medium)
- **Đánh giá INVEST:** `I`: Độc lập | `N`: Thỏa thuận được | `V`: Tránh xung đột quyền | `E`: Dễ ước tính | `S`: Vừa vặn | `T`: Có
- **Tiêu chí Nghiệm thu (Acceptance Criteria):**
  ```gherkin
  Scenario: Chuyển chủ hộ trong cùng hộ gia đình thành công (Happy Path)
    Given Hộ gia đình "HK-0803" có chủ hộ hiện tại là "Phạm Văn E"
    When Ban Quản lý chỉ định thành viên "Phạm Thị F" (vợ) làm chủ hộ mới
    Then Trong cùng một Transaction DB, hệ thống cập nhật `is_head = FALSE` cho "Phạm Văn E"
    And Cập nhật `is_head = TRUE` cho "Phạm Thị F"
    And Cập nhật cột `head_resident_id` của bảng "households" trỏ đến ID của "Phạm Thị F"
    And Đảm bảo tại mọi thời điểm, mỗi hộ gia đình chỉ tồn tại duy nhất 1 chủ hộ (Invariant)
  ```
- **Traceability:** `UC-RES-02` | `households`, `household_members` | `/cu-dan`

---

### US-RES-03: Khai báo Biến động Cư trú Trực tuyến (Tạm trú / Tạm vắng)
- **Mô tả:**  
  *Là một* **Cư dân (`ACT-RES`)**,  
  *Tôi muốn* khai báo hồ sơ tạm trú hoặc tạm vắng trực tuyến qua giao diện web,  
  *Để* thực hiện nghĩa vụ khai báo lưu trú theo quy định pháp luật mà không cần xếp hàng tại văn phòng Ban Quản lý.
- **Ước lượng:** 3 Story Points (Small)
- **Đánh giá INVEST:** `I`: Có | `N`: Có | `V`: Tiết kiệm thời gian | `E`: Có | `S`: 1.5 ngày | `T`: Có
- **Tiêu chí Nghiệm thu (Acceptance Criteria):**
  ```gherkin
  Scenario: Cư dân nộp hồ sơ khai báo tạm trú thành công (Happy Path)
    Given Cư dân đã đăng nhập và thuộc căn hộ "0901"
    When Cư dân truy cập trang "/cu-tru", chọn loại "Tạm trú (TAM_TRU)"
    And Chọn khoảng thời gian từ "01/10/2026" đến "31/12/2026", lý do "Lưu trú làm việc dự án"
    And Bấm "Gửi hồ sơ khai báo"
    Then Hệ thống tạo bản ghi mới trong bảng "residence_records" với trạng thái "PENDING"
    And Sinh mã tiếp nhận hồ sơ dạng "REC-202610-XXXX"
    And Trạng thái hồ sơ hiển thị trên bảng là "Chờ Ban Quản lý tiếp nhận"

  Scenario: Ngăn chặn ngày kết thúc tạm trú trước ngày bắt đầu (Negative Path)
    Given Cư dân chọn ngày bắt đầu là "10/10/2026"
    When Cư dân chọn ngày kết thúc là "05/10/2026"
    Then Hệ thống báo lỗi "Ngày kết thúc không được nhỏ hơn ngày bắt đầu"
    And Ngăn chặn việc gửi biểu mẫu lên máy chủ
  ```
- **Traceability:** `UC-RES-01` | `residence_records` | `/cu-tru`

---

### US-RES-04: Thẩm định & Xác nhận Hồ sơ Biến động Cư trú
- **Mô tả:**  
  *Là một* **Ban Quản lý (`ACT-MGR`)**,  
  *Tôi muốn* kiểm tra tính hợp lệ của hồ sơ tạm trú/tạm vắng, đối soát với căn cước công dân và xác nhận duyệt hoặc từ chối,  
  *Để* hoàn tất thủ tục lưu trú số hóa và cập nhật báo cáo gửi Công an khu vực.
- **Ước lượng:** 3 Story Points (Small)
- **Đánh giá INVEST:** `I`: Có | `N`: Có | `V`: An ninh tòa nhà | `E`: Có | `S`: 1 ngày | `T`: Có
- **Tiêu chí Nghiệm thu (Acceptance Criteria):**
  ```gherkin
  Scenario: Phê duyệt hồ sơ biến động cư trú hợp lệ (Happy Path)
    Given Ban Quản lý đang xem danh sách hồ sơ tại trang "/lich-su-cu-tru"
    When Ban Quản lý chọn hồ sơ mã "REC-202610-0012" có trạng thái "PENDING"
    And Nhập mã hồ sơ Công an tiếp nhận "CA-P05-9981" và bấm "Phê duyệt"
    Then Trạng thái hồ sơ trong "residence_records" chuyển thành "APPROVED"
    And Hệ thống ghi nhận ID người duyệt (`approved_by`) và thời điểm duyệt (`approved_at`)
    And Hệ thống gửi thông báo xác nhận thành công tới tài khoản cư dân
  ```
- **Traceability:** `UC-RES-06`, `UC-RES-07` | `residence_records` | `/lich-su-cu-tru`

---

## 5. EPIC-03: Quản lý Phương tiện & Bãi đỗ xe Tầng hầm

Quản lý hạn mức phương tiện của từng căn hộ, cấp phát nốt đỗ định danh chống xung đột, gắn mã thẻ từ RFID và giải phóng mặt bằng khi phương tiện hủy đăng ký.

### US-VEH-01: Đăng ký Phương tiện Mới & Kiểm soát Hạn ngạch (Quota Control)
- **Mô tả:**  
  *Là một* **Cư dân / Ban Quản lý (`ACT-RES`, `ACT-MGR`)**,  
  *Tôi muốn* đăng ký phương tiện mới (Ô tô, Xe máy) cho căn hộ kèm biển số và hình ảnh đăng ký xe,  
  *Để* hệ thống tự động kiểm soát hạn ngạch định mức (*Tối đa 1 Ô tô và 2 Xe máy cho mỗi căn hộ*).
- **Ước lượng:** 5 Story Points (Medium)
- **Đánh giá INVEST:** `I`: Có | `N`: Có | `V`: Công bằng hạ tầng | `E`: Có | `S`: 2 ngày | `T`: Có
- **Tiêu chí Nghiệm thu (Acceptance Criteria):**
  ```gherkin
  Scenario: Đăng ký xe máy trong hạn mức định ngạch thành công (Happy Path)
    Given Căn hộ "1104" hiện đang có 1 xe máy và 0 ô tô đã đăng ký
    When Cư dân nộp đơn đăng ký xe máy thứ 2: Biển số "29A1-999.88", Nhãn hiệu "Honda SH"
    Then Hệ thống kiểm tra căn hộ vẫn còn định mức xe máy (1/2)
    And Lưu thông tin phương tiện vào bảng "vehicles" với trạng thái "ACTIVE"
    And Hiển thị mức phí gửi xe hàng tháng dự kiến (ví dụ: 100.000 VNĐ/tháng)

  Scenario: Từ chối đăng ký khi căn hộ đã vượt quá hạn mức ô tô (Quota Exceeded)
    Given Căn hộ "1104" đã đăng ký đủ hạn ngạch 1 xe ô tô (1/1)
    When Cư dân cố gắng đăng ký thêm chiếc ô tô thứ 2 cho căn hộ này
    Then Hệ thống từ chối cho phép gửi yêu cầu
    And Hiển thị thông báo: "Căn hộ 1104 đã đạt hạn mức tối đa 1 xe ô tô. Vui lòng đăng ký vào danh sách chờ suất vãng lai"
  ```
- **Traceability:** `UC-VEH-01` | `vehicles`, `apartments` | `/phuong-tien-va-bai-do`

---

### US-VEH-02: Cấp phát Nốt đỗ Tầng hầm Định danh bằng Khóa Bi quan (Pessimistic Lock)
- **Mô tả:**  
  *Là một* **Ban Quản lý (`ACT-MGR`)**,  
  *Tôi muốn* phân bổ một vị trí nốt đỗ cụ thể tại tầng hầm (B1/B2) cho xe ô tô đã được duyệt,  
  *Để* bảo đảm không xảy ra tình trạng cấp trùng lặp một nốt đỗ cho hai phương tiện khác nhau khi nhiều quản trị viên cùng thao tác đồng thời.
- **Ước lượng:** 5 Story Points (Medium)
- **Đánh giá INVEST:** `I`: Có | `N`: Có | `V`: Tránh tranh chấp chỗ | `E`: Có | `S`: 2 ngày | `T`: Có
- **Tiêu chí Nghiệm thu (Acceptance Criteria):**
  ```gherkin
  Scenario: Cấp phát nốt đỗ còn trống thành công (Happy Path)
    Given Vị trí nốt đỗ "B1-C12" có trạng thái là "AVAILABLE"
    When Ban Quản lý chọn gán nốt "B1-C12" cho xe ô tô mang biển "30E-123.45"
    Then Hệ thống thực hiện lệnh SQL `SELECT ... FOR UPDATE` để khóa hàng nốt đỗ
    And Cập nhật trạng thái nốt đỗ thành "OCCUPIED" và gán `vehicle_id`
    And Cập nhật `parking_slot_id` trên phương tiện tương ứng
    And Sơ đồ bãi đỗ chuyển màu nốt B1-C12 từ Xanh lá (Trống) sang Đỏ (Đã có xe)

  Scenario: Ngăn ngừa cấp trùng nốt đỗ khi có tranh chấp đồng thời (Concurrency Twin)
    Given Hai nhân viên quản lý A và B cùng mở form cấp nốt "B1-C12" tại cùng một giây
    When Quản lý A bấm xác nhận trước và Transaction của A hoàn tất thành công
    And Quản lý B bấm xác nhận ngay sau đó 200ms
    Then Transaction của Quản lý B bị chặn lại do kiểm tra trạng thái thấy đã thành "OCCUPIED"
    And Hệ thống Rollback giao dịch của Quản lý B và thông báo "Nốt đỗ B1-C12 vừa được người khác gán. Vui lòng chọn nốt khác"
  ```
- **Traceability:** `UC-VEH-02`, `UC-VEH-05` | `parking_slots`, `vehicles` | `/phuong-tien-va-bai-do`

---

### US-VEH-03: Kích hoạt Thẻ từ RFID Ra Vào Bãi Đỗ Xe
- **Mô tả:**  
  *Là một* **Ban Quản lý (`ACT-MGR`)**,  
  *Tôi muốn* nhập mã thẻ từ RFID và kích hoạt liên kết với phương tiện đã đăng ký,  
  *Để* cư dân có thể sử dụng thẻ quẹt qua barrier kiểm soát tại cổng tầng hầm.
- **Ước lượng:** 3 Story Points (Small)
- **Đánh giá INVEST:** `I`: Có | `N`: Có | `V`: Đồng bộ vật lý | `E`: Có | `S`: 1 ngày | `T`: Có
- **Tiêu chí Nghiệm thu (Acceptance Criteria):**
  ```gherkin
  Scenario: Kích hoạt thẻ RFID hợp lệ thành công (Happy Path)
    Given Phương tiện "30E-123.45" đã được cấp nốt đỗ và chưa có mã thẻ từ
    When Ban Quản lý nhập mã thẻ RFID "RFID-99882211" và bấm "Kích hoạt thẻ"
    Then Hệ thống kiểm tra mã thẻ "RFID-99882211" chưa từng được gán cho phương tiện nào khác
    And Cập nhật cột `rfid_card_code` của phương tiện và chuyển trạng thái thẻ sang "ACTIVE"
    And Ghi nhận sự kiện kích hoạt vào nhật ký vận hành bãi xe
  ```
- **Traceability:** `UC-VEH-03` | `vehicles` | `/phuong-tien-va-bai-do`

---

### US-VEH-04: Hủy Đăng ký Xe & Giải phóng Nốt đỗ Tự động
- **Mô tả:**  
  *Là một* **Ban Quản lý (`ACT-MGR`)**,  
  *Tôi muốn* thực hiện thủ tục hủy đăng ký xe khi cư dân chuyển nhà hoặc bán xe,  
  *Để* hệ thống tự động giải phóng nốt đỗ về trạng thái trống và ngừng tính phí gửi xe trong kỳ hóa đơn tiếp theo.
- **Ước lượng:** 3 Story Points (Small)
- **Đánh giá INVEST:** `I`: Có | `N`: Có | `V`: Tối ưu công suất đỗ | `E`: Có | `S`: 1.5 ngày | `T`: Có
- **Tiêu chí Nghiệm thu (Acceptance Criteria):**
  ```gherkin
  Scenario: Hủy xe và giải phóng nốt đỗ thành công (Happy Path)
    Given Xe ô tô "30E-123.45" đang chiếm nốt đỗ "B1-C12"
    When Ban Quản lý bấm "Hủy đăng ký phương tiện" và chọn lý do "Cư dân chuyển đi"
    Then Hệ thống chuyển trạng thái phương tiện sang "REVOKED"
    And Hủy kích hoạt thẻ RFID tương ứng
    And Trong cùng Transaction, cập nhật nốt đỗ "B1-C12" thành `status = 'AVAILABLE'` và `vehicle_id = NULL`
    And Nốt đỗ B1-C12 lập tức hiển thị lại màu Xanh lá trên sơ đồ để người khác đăng ký
  ```
- **Traceability:** `UC-VEH-04` | `vehicles`, `parking_slots` | `/phuong-tien-va-bai-do`

---

## 6. EPIC-04: Điện nước, Động cơ Tính phí & Quyết toán VietQR

Quản lý đo lường chỉ số tiêu thụ điện nước, tính toán biểu phí lũy tiến bậc thang, chốt phát hành hóa đơn tự động hàng tháng, tạo mã VietQR động và tiếp nhận Webhook ngân hàng tức thời.

### US-BIL-01: Ghi nhận Chỉ số Tiêu thụ & Cảnh báo Bất thường (Anomaly Detection)
- **Mô tả:**  
  *Là một* **Kỹ thuật viên / Kế toán (`ACT-TECH`, `ACT-MGR`)**,  
  *Tôi muốn* nhập chỉ số đồng hồ điện nước cuối tháng kèm hình ảnh đối chiếu,  
  *Để* hệ thống tự động phát hiện số liệu tiêu thụ tăng/giảm bất thường vượt quá ngưỡng cảnh báo (ví dụ tăng gấp 3 lần so với tháng trước).
- **Ước lượng:** 5 Story Points (Medium)
- **Đánh giá INVEST:** `I`: Có | `N`: Có | `V`: Ngăn ngừa sai sót | `E`: Có | `S`: 2 ngày | `T`: Có
- **Tiêu chí Nghiệm thu (Acceptance Criteria):**
  ```gherkin
  Scenario: Ghi nhận chỉ số điện hợp lệ bình thường (Happy Path)
    Given Căn hộ "1205" có chỉ số điện tháng 08/2026 là 1250 kWh
    When Kỹ thuật viên nhập chỉ số tháng 09/2026 là 1450 kWh kèm ảnh chụp đồng hồ
    Then Hệ thống tính toán lượng điện tiêu thụ là 200 kWh (tăng hợp lý trong mức bình thường)
    And Lưu bản ghi vào bảng "meter_readings" với trạng thái "AUDITED"
    And Cho phép đưa chỉ số vào đợt tính hóa đơn tháng 9

  Scenario: Cảnh báo bất thường khi chỉ số mới nhỏ hơn chỉ số cũ (Negative Case)
    Given Chỉ số điện tháng trước là 1250 kWh
    When Kỹ thuật viên nhập chỉ số tháng này là 1100 kWh
    Then Hệ thống chặn lưu và báo lỗi: "Chỉ số mới không được nhỏ hơn chỉ số kỳ trước (1250 kWh)"

  Scenario: Kích hoạt cờ cảnh báo rò rỉ khi lượng tiêu thụ tăng đột biến (Anomaly Twin)
    Given Lượng nước tiêu thụ trung bình 3 tháng gần nhất của căn hộ 1205 là 15 m³
    When Kỹ thuật viên nhập chỉ số nước tháng này với sản lượng tính ra là 75 m³ (tăng > 300%)
    Then Hệ thống hiển thị cảnh báo Pop-up màu vàng: "Tiêu thụ tăng đột biến 500% so với trung bình"
    And Đánh dấu trạng thái bản ghi là "ANOMALY_PENDING_REVIEW" để Trưởng ban quản lý kiểm tra lại trước khi chốt
  ```
- **Traceability:** `UC-FIN-01` | `meter_readings`, `apartments` | `/phi-chung-cu`

---

### US-BIL-02: Chốt Sổ & Tự động Phát hành Đợt Hóa đơn Hàng tháng (Batch Invoicing Engine)
- **Mô tả:**  
  *Là một* **Kế toán Tòa nhà (`ACT-MGR`)**,  
  *Tôi muốn* kích hoạt chạy lô tổng hợp hóa đơn tự động vào ngày 25 hàng tháng cho toàn bộ các căn hộ,  
  *Để* kết xuất các mục chi phí: Phí quản lý (theo diện tích m²), Phí gửi xe (theo loại xe), và Phí điện nước (theo biểu phí lũy tiến bậc thang).
- **Ước lượng:** 8 Story Points (Large - Core Engine)
- **Đánh giá INVEST:** `I`: Độc lập | `N`: Có | `V`: Cốt lõi tài chính | `E`: Có thuật toán | `S`: Tách nhỏ batch | `T`: Rõ ràng
- **Tiêu chí Nghiệm thu (Acceptance Criteria):**
  ```gherkin
  Scenario: Chạy đợt phát hành hóa đơn tự động thành công (Happy Path)
    Given Đã hoàn tất việc chốt chỉ số điện nước kỳ tháng 09/2026 cho toàn bộ tòa nhà
    When Kế toán bấm nút "Chạy phát hành hóa đơn Batch Tháng 09/2026"
    Then Động cơ tính phí duyệt qua từng căn hộ đang có hộ dân sinh sống
    And Tính toán chính xác từng dòng chi phí trong bảng "invoice_items":
      | Loại phí | Công thức tính toán |
      | Phí quản lý | Diện tích m² x 12.000 VNĐ/m² |
      | Phí gửi xe | Tổng phí theo số lượng xe máy + ô tô đang active |
      | Phí nước sạch | Áp dụng bậc thang 1 (0-10m³), bậc thang 2 (10-20m³), bậc thang 3 (>20m³) |
    And Tạo bản ghi hóa đơn cha trong bảng "invoices" với trạng thái "UNPAID"
    And Hạn nộp tiền tự động đặt là ngày 10 của tháng kế tiếp (10/10/2026)
    And Đảm bảo quá trình chạy theo cơ chế Idempotency: nếu bấm lại cùng kỳ sẽ không sinh trùng hóa đơn
  ```
- **Traceability:** `UC-FIN-02` | `invoices`, `invoice_items`, `fee_types` | `/phi-chung-cu`

---

### US-BIL-03: Khởi tạo Phiên Thanh toán & Tạo Mã VietQR Động Chuẩn Napas 247
- **Mô tả:**  
  *Là một* **Cư dân (`ACT-RES`)**,  
  *Tôi muốn* mở hóa đơn cần thanh toán và xem mã QR ngân hàng VietQR động chứa sẵn số tiền và nội dung chuyển khoản,  
  *Để* thanh toán chính xác 100% qua App ngân hàng cá nhân chỉ với một thao tác quét camera mà không cần nhập tay số tài khoản.
- **Ước lượng:** 5 Story Points (Medium)
- **Đánh giá INVEST:** `I`: Có | `N`: Có | `V`: Trải nghiệm tuyệt vời | `E`: Tích hợp chuẩn VietQR | `S`: 2 ngày | `T`: Có
- **Tiêu chí Nghiệm thu (Acceptance Criteria):**
  ```gherkin
  Scenario: Tạo mã VietQR động thành công kèm thông tin chi tiết (Happy Path)
    Given Hóa đơn "INV-202609-1205" có tổng số tiền còn nợ là 2.350.000 VNĐ
    When Cư dân bấm nút "Thanh toán VietQR" tại màn hình hóa đơn
    Then Hệ thống hiển thị Modal Thanh toán chứa mã QR động chuẩn Napas 247
    And Mã QR đã mã hóa sẵn:
      | Trường thông tin | Giá trị hiển thị |
      | Ngân hàng thụ hưởng | MB Bank (Ngân hàng Quân Đội) |
      | Số tài khoản BQL | 098765432199 |
      | Số tiền thanh toán | 2,350,000 VNĐ (chính xác từng đồng) |
      | Nội dung chuyển khoản | INV-202609-1205 CANHO 1205 |
    And Hệ thống bật đồng hồ đếm ngược 15 phút cho phiên thanh toán
    And Kích hoạt cơ chế Polling / WebSocket chờ tín hiệu gạch nợ từ ngân hàng
  ```
- **Traceability:** `UC-FIN-03`, `UC-FIN-04` | `invoices`, `payment_transactions` | `/phi-chung-cu`

---

### US-BIL-04: Xử lý Webhook IPN Ngân hàng, Gạch nợ Tức thời & Xuất Biên lai
- **Mô tả:**  
  *Là một* **Hệ thống Backend (`SYS-CRON` / Gateway)**,  
  *Tôi muốn* tiếp nhận Webhook IPN từ VietQR / Napas 247, xác thực chữ ký bảo mật HMAC-SHA256 và gạch nợ hóa đơn ngay trong 500ms,  
  *Để* cập nhật trạng thái đã thanh toán tức thì cho cư dân và loại trừ rủi ro gạch nợ trùng lặp.
- **Ước lượng:** 5 Story Points (Medium)
- **Đánh giá INVEST:** `I`: Có | `N`: Có | `V`: Tự động hóa kế toán | `E`: Có | `S`: 2 ngày | `T`: Có
- **Tiêu chí Nghiệm thu (Acceptance Criteria):**
  ```gherkin
  Scenario: Tiếp nhận IPN hợp lệ và gạch nợ thành công (Happy Path)
    Given Hóa đơn "INV-202609-1205" đang ở trạng thái "UNPAID"
    When Cổng thanh toán gọi API POST "/api/webhooks/vietqr" với chữ ký HMAC hợp lệ
    And Payload chứa mã tham chiếu "INV-202609-1205" và số tiền chuyển 2.350.000 VNĐ
    Then Hệ thống kiểm tra giao dịch chưa từng xử lý (Idempotency Key duy nhất)
    And Cập nhật trạng thái hóa đơn thành "PAID" và lưu `paid_at = NOW()`
    And Tạo bản ghi giao dịch trong "payment_transactions" với phương thức "VIETQR"
    And Màn hình thanh toán của cư dân đang mở tự động chuyển sang trạng thái "Thanh toán thành công"
    And Trả về HTTP 200 OK cho Gateway trong vòng dưới 500ms

  Scenario: Bỏ qua Webhook bị gửi lại (Duplicate Webhook Defense)
    Given Giao dịch thanh toán mã "TXN-998811" đã được xử lý gạch nợ thành công trước đó
    When Gateway phát lại gói tin Webhook mang cùng mã "TXN-998811"
    Then Hệ thống nhận diện giao dịch đã tồn tại trong CSDL
    And Bỏ qua việc cộng trừ tiền lần thứ hai
    And Vẫn trả về HTTP 200 OK để Gateway ngừng gửi lại
  ```
- **Traceability:** `UC-FIN-04` | `payment_transactions`, `invoices` | API Webhook

---

### US-BIL-05: Quét Tự động Hóa đơn Quá hạn & Tính Phí Phạt Chậm Nộp
- **Mô tả:**  
  *Là một* **Ban Quản lý (`ACT-MGR`)**,  
  *Tôi muốn* hệ thống tự động quét các hóa đơn chưa thanh toán sau ngày 10 hàng tháng,  
  *Để* chuyển trạng thái thành "Quá hạn (OVERDUE)" và tự động gửi thông báo nhắc nợ đợt 1 tới ứng dụng cư dân.
- **Ước lượng:** 3 Story Points (Small)
- **Đánh giá INVEST:** `I`: Có | `N`: Có | `V`: Thu hồi công nợ | `E`: Cron job chuẩn | `S`: 1 ngày | `T`: Có
- **Tiêu chí Nghiệm thu (Acceptance Criteria):**
  ```gherkin
  Scenario: Tự động chuyển trạng thái quá hạn khi hết hạn thanh toán (Happy Path)
    Given Hóa đơn "INV-202609-0504" có hạn nộp là ngày "10/10/2026" và trạng thái vẫn là "UNPAID"
    When Đồng hồ hệ thống bước sang 00:01 ngày 11/10/2026 và Cron Worker kích hoạt
    Then Hệ thống tự động cập nhật trạng thái hóa đơn thành "OVERDUE"
    And Ghi nhận sự kiện quá hạn vào lịch sử tài khoản căn hộ
    And Gửi thông báo nhắc nợ màu đỏ tới tài khoản của chủ hộ căn hộ 0504
  ```
- **Traceability:** `UC-FIN-06` | `invoices` | Worker Daemon

---

## 7. EPIC-05: Tiếp nhận Phản ánh & Xử lý Kỹ thuật SLA

Quy trình khép kín từ khi cư dân gửi phản ánh hỏng hóc, điều phối kỹ thuật viên chuyên ngành, nghiệm thu hiện trường bằng ảnh chụp, cho đến cơ chế tự động leo thang cảnh báo khi vi phạm thời gian cam kết SLA.

### US-TKT-01: Cư dân Gửi Phản ánh Sự cố kèm Hình ảnh Hiện trường
- **Mô tả:**  
  *Là một* **Cư dân (`ACT-RES`)**,  
  *Tôi muốn* gửi phiếu yêu cầu sửa chữa (điện, nước, thang máy, vệ sinh) kèm tiêu đề, mô tả và tối đa 3 ảnh chụp thực tế,  
  *Để* Ban Quản lý nắm bắt trực quan mức độ khẩn cấp và cử kỹ thuật viên xử lý kịp thời.
- **Ước lượng:** 5 Story Points (Medium)
- **Đánh giá INVEST:** `I`: Có | `N`: Có | `V`: Phục vụ trực tiếp cư dân | `E`: Có | `S`: 2 ngày | `T`: Có
- **Tiêu chí Nghiệm thu (Acceptance Criteria):**
  ```gherkin
  Scenario: Cư dân gửi phiếu báo hỏng thành công (Happy Path)
    Given Cư dân đã đăng nhập và đang mở form "Gửi phản ánh mới" tại "/phan-anh-va-yeu-cau"
    When Cư dân chọn khu vực "Trong căn hộ", Loại sự cố "Điện (ELECTRICAL)"
    And Nhập tiêu đề "Chập attomat phòng khách", Mô tả chi tiết "Bật cầu dao bị nhảy liên tục kèm mùi khét"
    And Tải lên 2 ảnh chụp vị trí bảng điện
    And Bấm nút "Gửi phản ánh"
    Then Hệ thống lưu bản ghi mới vào bảng "feedbacks" với trạng thái "PENDING"
    And Đặt mức độ ưu tiên mặc định là "HIGH" do có nguy cơ chập cháy
    And Tính toán hạn hoàn thành SLA mục tiêu (Target SLA = Thời điểm nộp + 4 giờ)
    And Hiển thị thông báo "Phiếu sự cố đã được gửi thành công, mã phiếu #TKT-1082"
  ```
- **Traceability:** `UC-SRV-01` | `feedbacks`, `feedback_updates` | `/phan-anh-va-yeu-cau`

---

### US-TKT-02: Phân công Kỹ thuật viên & Tiếp nhận Hiện trường
- **Mô tả:**  
  *Là một* **Ban Quản lý (`ACT-MGR`)**,  
  *Tôi muốn* chuyển giao phiếu sự cố cho Kỹ thuật viên có chuyên môn phù hợp (Điện / Nước / Mộc / Sơn),  
  *Để* kỹ thuật viên nhận thông báo và di chuyển tới hiện trường xử lý.
- **Ước lượng:** 3 Story Points (Small)
- **Đánh giá INVEST:** `I`: Có | `N`: Có | `V`: Tối ưu phân công | `E`: Có | `S`: 1 ngày | `T`: Có
- **Tiêu chí Nghiệm thu (Acceptance Criteria):**
  ```gherkin
  Scenario: Phân công kỹ thuật viên tiếp nhận phiếu (Happy Path)
    Given Phiếu sự cố "#TKT-1082" đang ở trạng thái "PENDING"
    When Ban Quản lý chọn kỹ thuật viên "Trần Văn Thợ" (chuyên ngành Điện) và bấm "Giao việc"
    Then Trạng thái phiếu chuyển thành "PROCESSING"
    And Gán `assigned_to` trỏ đến ID người dùng của "Trần Văn Thợ"
    And Tạo một dòng cập nhật trong bảng "feedback_updates" ghi nhận lịch sử điều phối
    And Kỹ thuật viên nhận được thông báo đẩy trên thiết bị làm việc
  ```
- **Traceability:** `UC-SRV-02` | `feedbacks`, `feedback_updates` | `/phan-anh-va-yeu-cau`

---

### US-TKT-03: Kỹ thuật viên Nghiệm thu, Chụp ảnh Hoàn thành & Đóng Phiếu
- **Mô tả:**  
  *Là một* **Kỹ thuật viên (`ACT-TECH`)**,  
  *Tôi muốn* cập nhật kết quả xử lý thực tế, tải lên ảnh chụp sau khi sửa chữa và gửi nghiệm thu đóng phiếu,  
  *Để* hoàn tất công việc, minh bạch vật tư thay thế và lưu hồ sơ bảo hành kỹ thuật.
- **Ước lượng:** 5 Story Points (Medium)
- **Đánh giá INVEST:** `I`: Có | `N`: Có | `V`: Minh bạch chất lượng | `E`: Có | `S`: 2 ngày | `T`: Có
- **Tiêu chí Nghiệm thu (Acceptance Criteria):**
  ```gherkin
  Scenario: Kỹ thuật viên hoàn tất sửa chữa và đóng phiếu (Happy Path)
    Given Kỹ thuật viên đang xử lý phiếu sự cố "#TKT-1082"
    When Kỹ thuật viên nhập ghi chú xử lý: "Đã thay mới attomat tép Panasonic 32A"
    And Tải lên 1 ảnh chụp attomat mới đã hoạt động bình thường
    And Bấm nút "Hoàn thành xử lý"
    Then Trạng thái phiếu trong "feedbacks" chuyển thành "RESOLVED"
    And Lưu `resolved_at = NOW()`
    And Cư dân nhận được thông báo yêu cầu đánh giá độ hài lòng (1 đến 5 sao)
  ```
- **Traceability:** `UC-SRV-03`, `UC-SRV-05` | `feedbacks`, `feedback_updates` | `/phan-anh-va-yeu-cau`

---

### US-TKT-04: Giám sát Hạn xử lý & Tự động Leo thang Vi phạm SLA (SLA Escalation)
- **Mô tả:**  
  *Là một* **Trưởng Ban Quản lý (`ACT-MGR`)**,  
  *Tôi muốn* hệ thống tự động phát hiện các phiếu sự cố chưa được tiếp nhận quá 2 giờ hoặc chưa giải quyết xong quá thời hạn cam kết SLA,  
  *Để* tự động gửi cảnh báo khẩn cấp (Escalation Alert) cho Trưởng bộ phận can thiệp điều phối bổ sung.
- **Ước lượng:** 3 Story Points (Small)
- **Đánh giá INVEST:** `I`: Có | `N`: Có | `V`: Giữ chuẩn chất lượng | `E`: Có | `S`: 1 ngày | `T`: Có
- **Tiêu chí Nghiệm thu (Acceptance Criteria):**
  ```gherkin
  Scenario: Tự động cảnh báo leo thang khi quá hạn tiếp nhận xử lý (SLA Escalation)
    Given Phiếu sự cố mức ưu tiên "URGENT" được tạo lúc 08:00 với cam kết SLA tiếp nhận là 60 phút
    When Đến 09:05 trạng thái phiếu vẫn đang là "PENDING" (chưa ai tiếp nhận)
    Then Cron Watchdog phát hiện vi phạm SLA
    And Đổi cờ cảnh báo của phiếu sang "SLA_BREACHED"
    And Đẩy thông báo khẩn cấp tới điện thoại của Trưởng ban quản lý
    And Thẻ phiếu trên bảng Kanban tự động nhấp nháy viền đỏ kèm icon cảnh báo nguy hiểm
  ```
- **Traceability:** `UC-SRV-04` | `feedbacks` | Cron Watchdog

---

## 8. EPIC-06: Quản trị Hệ thống, Phân quyền RBAC & Biểu phí

Quản trị người dùng, phân quyền truy cập 4 cấp độ bảo mật, cấu hình biểu phí dịch vụ và bảo đảm an toàn dữ liệu thông qua nhật ký kiểm toán bất biến.

### US-ADM-01: Quản lý Tài khoản & Phân quyền Truy cập 4 Cấp (RBAC Enforcement)
- **Mô tả:**  
  *Là một* **Quản trị viên Hệ thống (`ACT-ADM`)**,  
  *Tôi muốn* tạo tài khoản và phân bổ chính xác vai trò hệ thống (`ADMIN`, `MANAGER`, `TECHNICIAN`, `RESIDENT`),  
  *Để* bảo đảm mỗi người dùng chỉ có thể truy cập đúng dữ liệu và thực thi đúng quyền hạn chức năng được giao.
- **Ước lượng:** 5 Story Points (Medium)
- **Đánh giá INVEST:** `I`: Có | `N`: Có | `V`: An ninh tối cao | `E`: Có | `S`: 2 ngày | `T`: Có
- **Tiêu chí Nghiệm thu (Acceptance Criteria):**
  ```gherkin
  Scenario: Chặn người dùng có vai trò RESIDENT truy cập trang kế toán (RBAC Guard)
    Given Người dùng đăng nhập bằng tài khoản có vai trò "RESIDENT"
    When Người dùng cố tình gõ trực tiếp URL "/cai-dat/bieu-phi" trên thanh địa chỉ trình duyệt
    Then Next.js Middleware chặn đứng yêu cầu trước khi render
    And Chuyển hướng người dùng về trang báo lỗi 403 Forbidden kèm thông báo: "Bạn không có quyền truy cập khu vực quản trị cấu hình"
  ```
- **Traceability:** `UC-ADM-01` | `users` | Middleware Security

---

### US-ADM-02: Cấu hình Biểu phí Lũy tiến Điện, Nước & Đơn giá Dịch vụ
- **Mô tả:**  
  *Là một* **Quản trị viên Hệ thống (`ACT-ADM`)**,  
  *Tôi muốn* cập nhật bảng giá định mức dịch vụ chung cư và các bậc thang lũy tiến điện nước,  
  *Để* hệ thống tính toán chính xác số tiền phải thu khi Nhà nước hoặc Hội nghị nhà chung cư thay đổi đơn giá.
- **Ước lượng:** 5 Story Points (Medium)
- **Đánh giá INVEST:** `I`: Có | `N`: Có | `V`: Tính linh hoạt biểu phí | `E`: Có | `S`: 2 ngày | `T`: Có
- **Tiêu chí Nghiệm thu (Acceptance Criteria):**
  ```gherkin
  Scenario: Cập nhật đơn giá phí dịch vụ quản lý căn hộ (Happy Path)
    Given Đơn giá phí quản lý hiện tại là 12.000 VNĐ/m²/tháng
    When Quản trị viên cập nhật đơn giá mới là 13.500 VNĐ/m²/tháng có hiệu lực từ ngày "01/10/2026"
    Then Hệ thống lưu đơn giá mới vào bảng "fee_types" kèm ngày áp dụng `effective_from`
    And Các hóa đơn của kỳ tháng 9 (trước ngày 01/10) vẫn giữ nguyên đơn giá cũ 12.000 VNĐ/m²
    And Đợt phát hành hóa đơn kỳ tháng 10 trở đi sẽ tự động nhân theo đơn giá mới 13.500 VNĐ/m²
  ```
- **Traceability:** `UC-ADM-03` | `fee_types` | `/cai-dat`

---

### US-ADM-03: Nhật ký Kiểm toán Hệ thống (Audit Trail) & Truy vết Rủi ro
- **Mô tả:**  
  *Là một* **Quản trị viên Hệ thống (`ACT-ADM`)**,  
  *Tôi muốn* xem nhật ký kiểm toán ghi nhận mọi thao tác nhạy cảm (xóa cư dân, đổi chủ hộ, duyệt miễn giảm tiền, sửa nốt đỗ xe),  
  *Để* phát hiện kịp thời các hành vi gian lận và phục vụ công tác thanh tra khi có sự cố dữ liệu.
- **Ước lượng:** 3 Story Points (Small)
- **Đánh giá INVEST:** `I`: Có | `N`: Có | `V`: Tuân thủ an toàn thông tin | `E`: Có | `S`: 1 ngày | `T`: Có
- **Tiêu chí Nghiệm thu (Acceptance Criteria):**
  ```gherkin
  Scenario: Tự động ghi nhật ký kiểm toán khi thay đổi thông tin quan trọng
    Given Cán bộ Ban Quản lý thực hiện thao tác xóa một phương tiện khỏi hệ thống
    When Thao tác được lưu thành công vào CSDL
    Then Hệ thống tự động chèn một bản ghi Audit Log bất biến:
      | Trường dữ liệu | Giá trị ghi nhận |
      | Actor ID | ID của Cán bộ thực hiện |
      | Hành động | DELETE_VEHICLE |
      | Đối tượng tác động | Biển số xe "30E-123.45" |
      | Địa chỉ IP | IP của người dùng gửi yêu cầu |
      | Thời điểm | Timestamp chính xác đến millisecond |
  ```
- **Traceability:** `UC-ADM-04` | Audit Log / DB Trigger | `/cai-dat`

---

## 9. Ma trận Đánh giá Tiêu chuẩn INVEST Toàn diện

Bảng đánh giá kiểm chứng 100% các User Stories thỏa mãn trọn vẹn 6 tiêu chí **INVEST**:

| Mã User Story | Tiêu đề Tóm tắt | I (Độc lập) | N (Thương lượng) | V (Giá trị) | E (Ước tính) | S (Quy mô) | T (Kiểm thử) | Điểm Story Points | Kết luận Đạt chuẩn |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `US-APT-01` | Tra cứu danh bạ căn hộ | ✅ | ✅ | ✅ | ✅ | ✅ (3d) | ✅ | **3 SP** | **ĐẠT CHUẨN** |
| `US-APT-02` | Tiếp nhận căn hộ & chủ mới | ✅ | ✅ | ✅ | ✅ | ✅ (2d) | ✅ | **5 SP** | **ĐẠT CHUẨN** |
| `US-APT-03` | Chuyển giao quyền sở hữu | ✅ | ✅ | ✅ | ✅ | ✅ (2d) | ✅ | **5 SP** | **ĐẠT CHUẨN** |
| `US-RES-01` | Thêm nhân khẩu & xác minh CCCD | ✅ | ✅ | ✅ | ✅ | ✅ (2d) | ✅ | **5 SP** | **ĐẠT CHUẨN** |
| `US-RES-02` | Chuyển giao vai trò chủ hộ | ✅ | ✅ | ✅ | ✅ | ✅ (2d) | ✅ | **5 SP** | **ĐẠT CHUẨN** |
| `US-RES-03` | Khai báo tạm trú/tạm vắng online | ✅ | ✅ | ✅ | ✅ | ✅ (1.5d) | ✅ | **3 SP** | **ĐẠT CHUẨN** |
| `US-RES-04` | Duyệt hồ sơ cư trú số hóa | ✅ | ✅ | ✅ | ✅ | ✅ (1d) | ✅ | **3 SP** | **ĐẠT CHUẨN** |
| `US-VEH-01` | Đăng ký xe & kiểm tra Quota | ✅ | ✅ | ✅ | ✅ | ✅ (2d) | ✅ | **5 SP** | **ĐẠT CHUẨN** |
| `US-VEH-02` | Cấp nốt đỗ xe bằng Pessimistic Lock | ✅ | ✅ | ✅ | ✅ | ✅ (2d) | ✅ | **5 SP** | **ĐẠT CHUẨN** |
| `US-VEH-03` | Kích hoạt thẻ từ RFID bãi xe | ✅ | ✅ | ✅ | ✅ | ✅ (1d) | ✅ | **3 SP** | **ĐẠT CHUẨN** |
| `US-VEH-04` | Hủy xe & giải phóng nốt đỗ | ✅ | ✅ | ✅ | ✅ | ✅ (1.5d) | ✅ | **3 SP** | **ĐẠT CHUẨN** |
| `US-BIL-01` | Ghi chỉ số & cảnh báo bất thường | ✅ | ✅ | ✅ | ✅ | ✅ (2d) | ✅ | **5 SP** | **ĐẠT CHUẨN** |
| `US-BIL-02` | Động cơ chốt hóa đơn hàng tháng | ✅ | ✅ | ✅ | ✅ | ✅ (3d) | ✅ | **8 SP** | **ĐẠT CHUẨN** |
| `US-BIL-03` | Tạo mã VietQR động Napas 247 | ✅ | ✅ | ✅ | ✅ | ✅ (2d) | ✅ | **5 SP** | **ĐẠT CHUẨN** |
| `US-BIL-04` | Webhook IPN & gạch nợ tức thời | ✅ | ✅ | ✅ | ✅ | ✅ (2d) | ✅ | **5 SP** | **ĐẠT CHUẨN** |
| `US-BIL-05` | Quét hóa đơn quá hạn tự động | ✅ | ✅ | ✅ | ✅ | ✅ (1d) | ✅ | **3 SP** | **ĐẠT CHUẨN** |
| `US-TKT-01` | Cư dân gửi phản ánh kèm ảnh | ✅ | ✅ | ✅ | ✅ | ✅ (2d) | ✅ | **5 SP** | **ĐẠT CHUẨN** |
| `US-TKT-02` | Điều phối kỹ thuật viên tiếp nhận | ✅ | ✅ | ✅ | ✅ | ✅ (1d) | ✅ | **3 SP** | **ĐẠT CHUẨN** |
| `US-TKT-03` | Kỹ thuật nghiệm thu & đóng phiếu | ✅ | ✅ | ✅ | ✅ | ✅ (2d) | ✅ | **5 SP** | **ĐẠT CHUẨN** |
| `US-TKT-04` | Cảnh báo vi phạm cam kết SLA | ✅ | ✅ | ✅ | ✅ | ✅ (1d) | ✅ | **3 SP** | **ĐẠT CHUẨN** |
| `US-ADM-01` | Quản lý người dùng & phân quyền RBAC | ✅ | ✅ | ✅ | ✅ | ✅ (2d) | ✅ | **5 SP** | **ĐẠT CHUẨN** |
| `US-ADM-02` | Cấu hình biểu phí & định mức | ✅ | ✅ | ✅ | ✅ | ✅ (2d) | ✅ | **5 SP** | **ĐẠT CHUẨN** |
| `US-ADM-03` | Nhật ký kiểm toán an toàn hệ thống | ✅ | ✅ | ✅ | ✅ | ✅ (1d) | ✅ | **3 SP** | **ĐẠT CHUẨN** |

---

## 10. Ma trận Truy vết Hai chiều (Requirements Traceability Matrix)

| User Story ID | Use Case Tương ứng | Bảng Cơ sở Dữ liệu Chính (3NF) | Giao diện UI Phục vụ | Thành phần C4 Component Tương tác |
| :--- | :--- | :--- | :--- | :--- |
| `US-APT-01` | `UC-RES-04` | `apartments`, `buildings` | `/can-ho` | `ApartmentDirectoryView` $\rightarrow$ `ApartmentService` |
| `US-APT-02` | `UC-RES-04` | `apartments`, `owners` | `/can-ho` | `ApartmentCreateModal` $\rightarrow$ `ApartmentService` |
| `US-APT-03` | `UC-RES-05` | `apartment_owners` | `/can-ho/[roomNumber]` | `OwnershipTransferDrawer` $\rightarrow$ `ApartmentService` |
| `US-RES-01` | `UC-RES-03` | `residents`, `household_members` | `/cu-dan` | `ResidentRegisterModal` $\rightarrow$ `ResidentService` |
| `US-RES-02` | `UC-RES-02` | `households`, `household_members` | `/cu-dan` | `HouseholdHeadTransferModal` $\rightarrow$ `ResidentService` |
| `US-RES-03` | `UC-RES-01` | `residence_records` | `/cu-tru` | `StayDeclarationForm` $\rightarrow$ `ResidentService` |
| `US-RES-04` | `UC-RES-06` | `residence_records` | `/lich-su-cu-tru` | `DossierApprovalAction` $\rightarrow$ `ResidentService` |
| `US-VEH-01` | `UC-VEH-01` | `vehicles`, `apartments` | `/phuong-tien-va-bai-do` | `VehicleRegisterModal` $\rightarrow$ `ParkingService` |
| `US-VEH-02` | `UC-VEH-02` | `parking_slots`, `vehicles` | `/phuong-tien-va-bai-do` | `SlotAllocationGrid` $\rightarrow$ `ParkingService` |
| `US-VEH-03` | `UC-VEH-03` | `vehicles` | `/phuong-tien-va-bai-do` | `RfidActivationCard` $\rightarrow$ `ParkingService` |
| `US-VEH-04` | `UC-VEH-04` | `vehicles`, `parking_slots` | `/phuong-tien-va-bai-do` | `VehicleRevokeDialog` $\rightarrow$ `ParkingService` |
| `US-BIL-01` | `UC-FIN-01` | `meter_readings` | `/phi-chung-cu` | `MeterReadingBatchTable` $\rightarrow$ `BillingService` |
| `US-BIL-02` | `UC-FIN-02` | `invoices`, `invoice_items` | `/phi-chung-cu` | `MonthlyBillingAction` $\rightarrow$ `BillingService` |
| `US-BIL-03` | `UC-FIN-03` | `invoices`, `payment_transactions` | `/phi-chung-cu` | `VietQrPaymentModal` $\rightarrow$ `BillingService` |
| `US-BIL-04` | `UC-FIN-04` | `payment_transactions`, `invoices` | `/api/webhooks/vietqr` | `VietQrIpnWebhookHandler` $\rightarrow$ `BillingService` |
| `US-BIL-05` | `UC-FIN-06` | `invoices` | Background Worker | `OverdueScanDaemon` $\rightarrow$ `BillingService` |
| `US-TKT-01` | `UC-SRV-01` | `feedbacks` | `/phan-anh-va-yeu-cau` | `TicketSubmitDrawer` $\rightarrow$ `MaintenanceService` |
| `US-TKT-02` | `UC-SRV-02` | `feedback_updates` | `/phan-anh-va-yeu-cau` | `TicketDispatchModal` $\rightarrow$ `MaintenanceService` |
| `US-TKT-03` | `UC-SRV-03` | `feedbacks`, `feedback_updates` | `/phan-anh-va-yeu-cau` | `TicketResolveDrawer` $\rightarrow$ `MaintenanceService` |
| `US-TKT-04` | `UC-SRV-04` | `feedbacks` | Cron Watchdog | `SlaEscalationDaemon` $\rightarrow$ `MaintenanceService` |
| `US-ADM-01` | `UC-ADM-01` | `users` | `/nguoi-dung` | `UserManagementConsole` $\rightarrow$ `SecurityAuthService` |
| `US-ADM-02` | `UC-ADM-03` | `fee_types` | `/cai-dat` | `FeeTariffConfigTable` $\rightarrow$ `BillingService` |
| `US-ADM-03` | `UC-ADM-04` | `audit_logs` | `/cai-dat` | `AuditLogAuditViewer` $\rightarrow$ `SecurityAuthService` |
