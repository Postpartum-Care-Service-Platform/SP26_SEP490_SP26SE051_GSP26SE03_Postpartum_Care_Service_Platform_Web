'use client';

import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div>
      <header className="bg-white shadow-sm rounded-lg mb-6">
        <div className="px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <Link className="text-sm text-blue-600 hover:underline" href="/">
            Về trang chủ
          </Link>
        </div>
      </header>

      <main>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900">Người dùng mới</h3>
            <p className="mt-2 text-3xl font-bold">12</p>
          </div>
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900">Lượt truy cập</h3>
            <p className="mt-2 text-3xl font-bold">1,204</p>
          </div>
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900">Đơn hàng</h3>
            <p className="mt-2 text-3xl font-bold">45</p>
          </div>
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900">Doanh thu</h3>
            <p className="mt-2 text-3xl font-bold">$1,500</p>
          </div>
        </div>
      </main>
    </div>
  );
}

