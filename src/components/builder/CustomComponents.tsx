'use client';

import React from 'react';
import { Builder } from '@builder.io/react';

// 1. Hero Component
export const Hero = (props: { title: string; description: string; buttonText: string; image?: string }) => (
  <section style={{ padding: '80px 20px', textAlign: 'center', background: 'linear-gradient(135deg, #fff5f0 0%, #fff 100%)' }}>
    <h1 style={{ fontSize: '48px', fontWeight: 800, color: '#1e293b', marginBottom: '20px' }}>{props.title}</h1>
    <p style={{ fontSize: '18px', color: '#64748b', maxWidth: '600px', margin: '0 auto 32px' }}>{props.description}</p>
    <button style={{ padding: '14px 32px', background: '#f97316', color: 'white', borderRadius: '30px', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
      {props.buttonText}
    </button>
  </section>
);

// 2. FAQ Component
export const FAQ = (props: { items: { question: string; answer: string }[] }) => (
  <section style={{ padding: '60px 20px', maxWidth: '800px', margin: '0 auto' }}>
    <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>Câu hỏi thường gặp</h2>
    {props.items?.map((item, i) => (
      <div key={i} style={{ marginBottom: '24px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
        <h3 style={{ fontSize: '18px', color: '#0f172a', marginBottom: '8px' }}>{item.question}</h3>
        <p style={{ color: '#64748b' }}>{item.answer}</p>
      </div>
    ))}
  </section>
);

// ĐĂNG KÝ VỚI BUILDER.IO
Builder.registerComponent(Hero, {
  name: 'Hero Section',
  inputs: [
    { name: 'title', type: 'text', defaultValue: 'Chăm sóc mẹ và bé tại nhà' },
    { name: 'description', type: 'text', defaultValue: 'Dịch vụ chuyên nghiệp từ các chuyên gia hàng đầu.' },
    { name: 'buttonText', type: 'text', defaultValue: 'Khám phá ngay' },
  ],
});

Builder.registerComponent(FAQ, {
  name: 'FAQ Section',
  inputs: [
    {
      name: 'items',
      type: 'list',
      subFields: [
        { name: 'question', type: 'text' },
        { name: 'answer', type: 'longText' },
      ],
    },
  ],
});
