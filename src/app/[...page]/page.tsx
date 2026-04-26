'use client';

import { builder, BuilderComponent } from '@builder.io/react';
import React, { useEffect, useState } from 'react';
import '@/lib/builder-config';
import '@/components/builder/CustomComponents';

interface BuilderPageProps {
  params: Promise<{ page: string[] }>;
}

export default function BuilderPage({ params }: BuilderPageProps) {
  const [content, setContent] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);
  const [resolvedParams, setResolvedParams] = useState<{ page: string[] } | null>(null);

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  useEffect(() => {
    if (!resolvedParams) return;

    async function fetchContent() {
      const urlPath = '/' + (resolvedParams?.page?.join('/') || '');
      const builderContent = await builder
        .get('page', {
          url: urlPath,
        })
        .promise();

      setContent(builderContent);
      if (!builderContent) {
        setNotFound(true);
      }
    }
    fetchContent();
  }, [resolvedParams]);

  if (notFound) {
    return <div style={{ padding: '100px', textAlign: 'center' }}>Trang không tồn tại (404)</div>;
  }

  return (
    <>
      {/* Hiển thị nội dung được build từ Builder.io */}
      <BuilderComponent model="page" content={content} />
    </>
  );
}
