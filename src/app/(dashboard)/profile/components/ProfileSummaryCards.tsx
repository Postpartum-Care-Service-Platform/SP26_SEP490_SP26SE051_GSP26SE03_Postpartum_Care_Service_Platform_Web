'use client';

import styles from './profile-summary-cards.module.css';

const bioText = `Hi, I'm Charlie Stone, a Mobile Application Developer. Over the course of my career, I have successfully contributed to 120+ projects for 48 clients across a diverse range of industries, including e-commerce, healthcare, finance, and education.`;

const progressItems = [
  { label: 'Flutter Development', value: 85 },
  { label: 'React Native Apps', value: 75 },
  { label: 'Android Studio IDE', value: 90 },
  { label: 'Figma Design Tool', value: 80 },
  { label: 'Swift iOS Apps', value: 70 },
];

const projects = [
  {
    title: 'Portfolio Website',
    description: 'A personal website showcasing recent design work.',
    avatars: ['CS', 'JG', 'MN'],
    count: 3,
  },
  {
    title: 'Task Manager App',
    description: 'Productivity app with task tracking and reminders.',
    avatars: ['AL', 'PK'],
    count: 2,
  },
  {
    title: 'E-commerce Platform',
    description: 'Online shopping platform with multi-vendor support.',
    avatars: ['JR', 'MT', 'HB', 'CK'],
    count: 4,
  },
];

export function ProfileSummaryCards() {
  return (
    <div className={styles.cardsGrid}>
      <section className={styles.card} aria-labelledby="profile-bio">
        <header className={styles.cardHeader}>
          <span className={styles.cardTitle} id="profile-bio">
            Bio
          </span>
        </header>
        <div className={styles.cardBody}>
          <p className={styles.bioText}>{bioText}</p>
        </div>
      </section>

      <section className={styles.card} aria-labelledby="profile-progress">
        <header className={styles.cardHeader}>
          <span className={styles.cardTitle} id="profile-progress">
            Progress
          </span>
          <span className={styles.progressPercent}>74%</span>
        </header>
        <div className={styles.cardBody}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: '74%' }} />
          </div>
          <ul className={styles.progressList}>
            {progressItems.map((item) => (
              <li key={item.label} className={styles.progressItem}>
                <span>{item.label}</span>
                <span className={styles.progressValue}>{item.value}%</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.card} aria-labelledby="profile-projects">
        <header className={styles.cardHeader}>
          <span className={styles.cardTitle} id="profile-projects">
            Projects
          </span>
        </header>
        <div className={styles.cardBody}>
          <ul className={styles.projectsList}>
            {projects.map((project) => (
              <li key={project.title} className={styles.projectItem}>
                <div>
                  <div className={styles.projectTitle}>{project.title}</div>
                  <div className={styles.projectDescription}>{project.description}</div>
                </div>
                <div className={styles.projectMeta}>
                  <div className={styles.avatarGroup}>
                    {project.avatars.slice(0, 3).map((initials) => (
                      <div key={initials} className={styles.avatar}>
                        {initials}
                      </div>
                    ))}
                  </div>
                  <span className={styles.projectCount}>+{project.count}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

