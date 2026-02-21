'use client';

import Image from 'next/image';

interface Food {
    id: number;
    name: string;
    foodType: string;
    description: string;
    imageUrl: string;
    isActive: boolean;
}

export function FoodCard({ food, tags }: { food: Food; tags: string[] }) {
    return (
        <article
            className="group flex-shrink-0 w-[18rem] md:w-[20rem] lg:w-full lg:max-w-[22rem] flex flex-col bg-white rounded-[1rem] overflow-hidden border border-[rgba(30,30,30,0.05)] hover:border-[#fa8314]/20 hover:shadow-[0_30px_60px_-15px_rgba(250,131,20,0.1)] transition-all duration-700 snap-center"
        >
            <div className="relative w-full h-[18rem] overflow-hidden">
                <Image
                    src={food.imageUrl}
                    alt={food.name}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </div>

            <div className="flex flex-col p-8 lg:p-9 flex-grow text-center">
                <h3
                    className="text-base lg:text-lg font-semibold text-[var(--color-text-primary)] mb-2 line-clamp-1"
                    style={{ fontFamily: 'var(--font-display)' }}
                >
                    {food.name}
                </h3>

                <div className="mb-4 flex justify-center">
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[rgba(30,30,30,0.45)]">
                        {food.foodType}
                    </span>
                </div>

                <p className="text-[15px] text-[rgba(30,30,30,0.62)] leading-relaxed mb-8 line-clamp-3 font-light italic">
                    {food.description}
                </p>

                <div className="mt-auto pt-6 border-t border-[rgba(30,30,30,0.04)] flex flex-col items-center gap-5">
                    <div className="flex flex-wrap justify-center gap-2">
                        {tags.length > 0 ? (
                            tags.map((t) => (
                                <span
                                    key={t}
                                    className="text-[10px] font-bold uppercase tracking-widest text-[#fa8314] bg-[#fffbf4] px-4 py-1.5 rounded-lg border border-[#fa8314]/10"
                                >
                                    ✦ {t}
                                </span>
                            ))
                        ) : (
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[rgba(30,30,30,0.3)]">
                                ✦ Balanced Nutrients
                            </span>
                        )}
                    </div>
                    <div className="text-[11px] font-black uppercase tracking-[0.3em] text-[#fa8314]/40 group-hover:text-[#fa8314] transition-colors duration-500">
                        Premium Choice
                    </div>
                </div>
            </div>
        </article>
    );
}
