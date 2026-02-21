'use client';

import { FoodCard } from './FoodCard';

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

export function MenuSection({ menu }: { menu: Menu }) {
    return (
        <section className="animate-fadeIn">
            <div className="flex items-center gap-6 mb-12">
                <h2
                    className="text-2xl lg:text-3xl font-normal text-[#1e1e1e] whitespace-nowrap"
                    style={{ fontFamily: 'var(--font-display)' }}
                >
                    {menu.menuName}
                </h2>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-[rgba(30,30,30,0.1)] to-transparent" />
            </div>

            <div className="w-full flex flex-nowrap gap-8 overflow-x-auto pb-10 no-scrollbar snap-x justify-start items-stretch lg:mx-auto lg:max-w-7xl lg:flex-nowrap lg:justify-center lg:overflow-x-hidden lg:snap-none lg:pb-0 lg:gap-12">
                {menu.foods.map((food) => {
                    const desc = (food.description || '').toLowerCase();
                    const tags: string[] = [];
                    if (desc.includes('sữa')) tags.push('Lợi sữa');
                    if (desc.includes('bổ')) tags.push('Bồi bổ');
                    if (desc.includes('tiêu hóa') || desc.includes('táo bón')) tags.push('Dễ tiêu');

                    return <FoodCard key={food.id} food={food} tags={tags} />;
                })}
            </div>
        </section>
    );
}
