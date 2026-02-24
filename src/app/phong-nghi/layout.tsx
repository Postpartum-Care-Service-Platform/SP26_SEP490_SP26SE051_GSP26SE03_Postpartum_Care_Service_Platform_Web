import React from 'react';

export default function PhongNghiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <link rel="stylesheet" href="/Interactive3DMallMap/css/normalize.css" />
      <link rel="stylesheet" href="/Interactive3DMallMap/css/style.css" />
      {children}
    </>
  );
}
