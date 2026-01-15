'use client';

import React from 'react';
import type { PackageData } from '@/services/chat.service';

function formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(price);
}

type ChatPackagesTableProps = {
    packages: PackageData[];
    introText?: string;
};

export function ChatPackagesTable({ packages, introText }: ChatPackagesTableProps) {
    return (
        <div className="chat-packages">
            {introText && <p className="chat-packages__intro">{introText}</p>}
            <div className="chat-packages__table-wrapper">
                <table className="chat-packages__table">
                    <thead>
                        <tr>
                            <th>Gói dịch vụ</th>
                            <th>Thời gian</th>
                            <th>Giá</th>
                        </tr>
                    </thead>
                    <tbody>
                        {packages.map((pkg) => (
                            <tr key={pkg.id}>
                                <td>
                                    <strong>{pkg.name}</strong>
                                    {pkg.description && (
                                        <span className="chat-packages__desc">{pkg.description}</span>
                                    )}
                                </td>
                                <td>{pkg.duration_days} ngày</td>
                                <td className="chat-packages__price">{formatPrice(pkg.price)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
