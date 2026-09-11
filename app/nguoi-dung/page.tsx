'use client';

export default function NguoiDungPage() {
  const users = [
    {
      id: 'usr-1',
      name: 'Nguyễn Văn An',
      email: 'an.nguyen@residenthub.vn',
      role: 'Trưởng ban Quản lý',
      status: 'Đang hoạt động',
      lastLogin: 'Hôm nay, 08:15',
    },
    {
      id: 'usr-2',
      name: 'Lê Thị Thu',
      email: 'thu.le@residenthub.vn',
      role: 'Kế toán trưởng',
      status: 'Đang hoạt động',
      lastLogin: 'Hôm nay, 08:30',
    },
    {
      id: 'usr-3',
      name: 'Trần Văn Mạnh',
      email: 'manh.tran@residenthub.vn',
      role: 'Kỹ thuật viên tòa nhà',
      status: 'Đang hoạt động',
      lastLogin: 'Hôm qua, 17:40',
    },
  ];

  return (
    <div className="flex flex-col w-full space-y-space-lg max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-space-md">
        <div className="space-y-1">
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
            Tài khoản Người dùng Hệ thống
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Phân quyền ban quản lý, kế toán, kỹ thuật viên và nhân viên an ninh.
          </p>
        </div>

        <button
          onClick={() => alert('Thêm người dùng mới')}
          className="inline-flex items-center gap-space-xs px-space-md py-2 rounded-lg bg-primary-container text-white shadow-sm hover:bg-primary transition-colors font-label-md text-label-md font-semibold self-start sm:self-auto"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          <span>Tạo tài khoản mới</span>
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-surface-container-low/60 border-b border-outline-variant/20 text-xs font-semibold uppercase tracking-wider text-outline">
                <th className="py-3.5 px-4">Tên nhân sự</th>
                <th className="py-3.5 px-4">Email đăng nhập</th>
                <th className="py-3.5 px-4">Vai trò / Bộ phận</th>
                <th className="py-3.5 px-4">Đăng nhập gần nhất</th>
                <th className="py-3.5 px-4 text-right">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-surface-container-low/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-on-surface">{u.name}</td>
                  <td className="py-3.5 px-4 text-xs font-mono text-primary">{u.email}</td>
                  <td className="py-3.5 px-4 text-on-surface-variant">{u.role}</td>
                  <td className="py-3.5 px-4 text-xs text-on-surface-variant">{u.lastLogin}</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-tertiary-fixed/40 text-tertiary">
                      {u.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
