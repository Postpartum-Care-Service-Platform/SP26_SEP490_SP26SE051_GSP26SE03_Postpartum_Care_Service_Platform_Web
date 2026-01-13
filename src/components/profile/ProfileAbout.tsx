import React from 'react';

type AboutRowProps = {
  label: string;
  value?: string;
};

function AboutRow({ label, value }: AboutRowProps) {
  return (
    <div className="profile-about__row">
      <div className="profile-about__label">{label}</div>
      <div className="profile-about__value">{value ?? '—'}</div>
    </div>
  );
}

type ProfileAboutProps = {
  jobTitle?: string;
  department?: string;
  organization?: string;
  location?: string;
  contactEmail?: string;
};

export function ProfileAbout(props: ProfileAboutProps) {
  const { jobTitle, department, organization, location, contactEmail } = props;

  return (
    <section className="profile-about" aria-label="About">
      <h2 className="profile-about__title">About</h2>
      <div className="profile-about__card">
        <AboutRow label="Your job title" value={jobTitle} />
        <AboutRow label="Your department" value={department} />
        <AboutRow label="Your organization" value={organization} />
        <AboutRow label="Your location" value={location} />

        <div className="profile-about__divider" />

        <div className="profile-about__contactTitle">Contact</div>
        <AboutRow label="Email" value={contactEmail} />
      </div>
    </section>
  );
}

