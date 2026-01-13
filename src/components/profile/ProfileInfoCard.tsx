import React from 'react';

type ProfileInfoCardProps = {
  title: string;
  children?: React.ReactNode;
};

export function ProfileInfoCard({ title, children }: ProfileInfoCardProps) {
  return (
    <section className="profile-card" aria-label={title}>
      <h2 className="profile-card__title">{title}</h2>
      <div className="profile-card__body">{children}</div>
    </section>
  );
}

