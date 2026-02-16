'use client';

import { useEffect, useMemo, useState } from 'react';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import apiClient from '@/services/apiClient';
import { MenuSection } from './_components/MenuSection';

interface Food {
    id: number;
    name: string;
    foodType: string;
    description: string;
    imageUrl: string;
    isActive: boolean;
}

interface Menu {
    id: number;
    menuTypeId: number;
    menuTypeName: string;
    menuName: string;
    description: string;
    isActive: boolean;
    foods: Food[];
}

type MealTab = 'Sáng' | 'Trưa' | 'Tối';

const MEAL_TABS: MealTab[] = ['Sáng', 'Trưa', 'Tối'];

const TAB_LABEL: Record<MealTab, string> = {
    'Sáng': 'Bữa sáng',
    'Trưa': 'Bữa trưa',
    'Tối': 'Bữa tối',
};

export default function AmThucPage() {
    const [activeTab, setActiveTab] = useState<MealTab>('Sáng');
    const [menus, setMenus] = useState<Menu[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const fetchMenus = async () => {
            try {
                setLoading(true);
                const response: any = await apiClient.get('/Menu');
                const activeMenus = (response || []).filter((m: Menu) => m.isActive);

                if (cancelled) return;
                setMenus(activeMenus);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch menus:', err);
                if (cancelled) return;
                setError('Không thể tải thực đơn. Vui lòng thử lại sau.');
            } finally {
                if (cancelled) return;
                setLoading(false);
            }
        };

        fetchMenus();

        return () => {
            cancelled = true;
        };
    }, []);

    const filteredMenus = useMemo(() => {
        return menus.filter((menu) => menu.menuTypeName === activeTab);
    }, [activeTab, menus]);

    return (
        <div className="flex flex-col min-h-screen bg-[#fffbf4]">
            <Header />

            <main className="flex-grow">
                <div className="container mx-auto px-4 lg:px-8 max-w-7xl py-12 flex flex-col items-center">
                    <div className="w-full text-center mb-16">
                        <div className="inline-flex items-center gap-3 text-[10px] font-black tracking-[0.4em] uppercase text-[#fa8314] mb-4">
                            <span className="h-[1px] w-8 bg-[#fa8314]/40" />
                            <span>Experience Fine Dining</span>
                            <span className="h-[1px] w-8 bg-[#fa8314]/40" />
                        </div>
                        <h1
                            className="text-5xl lg:text-6xl font-normal text-[#1e1e1e] mb-6"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            Thực Đơn Resort<span className="text-[#fa8314]">.</span>
                        </h1>
                        <p className="text-sm text-[rgba(30,30,30,0.5)] max-w-xl mx-auto leading-relaxed italic">
                            Sự kết hợp hoàn hảo giữa dinh dưỡng y khoa và nghệ thuật ẩm thực cao cấp, được tinh chế riêng cho hành trình
                            phục hồi của mẹ.
                        </p>
                    </div>

                    <div className="flex justify-center mb-16">
                        <div className="inline-flex p-1.5 bg-white rounded-2xl border border-[rgba(30,30,30,0.06)] shadow-sm">
                            {MEAL_TABS.map((tab) => {
                                const isActive = activeTab === tab;
                                return (
                                    <button
                                        key={tab}
                                        type="button"
                                        onClick={() => setActiveTab(tab)}
                                        className={
                                            'px-10 py-3.5 rounded-xl transition-all duration-500 font-bold text-xs uppercase tracking-[0.15em] ' +
                                            (isActive
                                                ? 'bg-[#fa8314] text-white shadow-lg shadow-[#fa8314]/20'
                                                : 'text-[rgba(30,30,30,0.4)] hover:text-[#fa8314] hover:bg-[#fa8314]/5')
                                        }
                                    >
                                        {TAB_LABEL[tab]}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="min-h-[400px] w-full">
                        {loading ? (
                            <div className="flex flex-col md:flex-row md:flex-wrap lg:flex-nowrap gap-8 justify-center">
                                {[1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        className="h-[30rem] w-full max-w-[22rem] bg-white rounded-[2.5rem] animate-pulse border border-[rgba(30,30,30,0.05)] shadow-sm"
                                    />
                                ))}
                            </div>
                        ) : error ? (
                            <div className="max-w-md mx-auto text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-[#fa8314]/20">
                                <p className="text-[#fa8314] font-medium text-sm">{error}</p>
                                <button
                                    type="button"
                                    onClick={() => window.location.reload()}
                                    className="mt-6 px-8 py-3 bg-[#fa8314] text-white rounded-full text-[11px] font-black uppercase tracking-widest shadow-md hover:bg-[#e67310] transition-all"
                                >
                                    Thử tải lại
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-40 w-full">
                                {filteredMenus.map((menu) => (
                                    <MenuSection key={menu.id} menu={menu} />
                                ))}

                                {filteredMenus.length === 0 && (
                                    <div className="py-32 text-center bg-white rounded-[3.5rem] border border-[rgba(30,30,30,0.04)] shadow-inner">
                                        <span className="text-6xl block mb-8 grayscale opacity-20">🍲</span>
                                        <h3
                                            className="text-2xl font-normal text-[rgba(30,30,30,0.25)]"
                                            style={{ fontFamily: 'var(--font-display)' }}
                                        >
                                            Thực đơn {activeTab} đang được chế tác...
                                        </h3>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />

            <style jsx global>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
                }
            `}</style>
        </div>
    );
}
