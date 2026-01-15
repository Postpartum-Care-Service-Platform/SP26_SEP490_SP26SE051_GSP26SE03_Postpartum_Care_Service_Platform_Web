'use client';

import Image from 'next/image';
import { Briefcase, Users, UserPlus, Mail, User, Info, Clock, Phone } from 'lucide-react';

import { useProfile } from '../ProfileContext';

import styles from './profile-sidebar-column.module.css';

const stats = [
  { label: 'Projects', value: '120', icon: Briefcase },
  { label: 'Clients', value: '48', icon: Users },
  { label: 'Followers', value: '24k', icon: UserPlus },
];

const skills = ['Java', 'Kotlin', 'Swift', 'Dart', 'JavaScript', 'TypeScript', 'Objective-C', 'C#', 'Python'];

export function ProfileSidebarColumn() {
  const { profile } = useProfile();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.profileCard}>
        <div className={styles.cover}>
          <div className={styles.status}>
            <span className={styles.statusCheck}>✓</span>
            Active
          </div>
        </div>
        <div className={styles.profileMain}>
          <div className={styles.avatarWrapper}>
            {profile?.avatarUrl ? (
              <Image src={profile.avatarUrl} alt={profile.fullName} width={80} height={80} className={styles.avatar} />
            ) : (
              <div className={styles.avatarFallback} />
            )}
          </div>
          <div className={styles.info}>
            <div className={styles.name}>{profile?.fullName || 'Chưa có thông tin'}</div>
            <div className={styles.role}>{profile?.phoneNumber || 'Mobile Application Developer'}</div>
          </div>
        </div>
        <div className={styles.metrics}>
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className={styles.metric}>
                <Icon className={styles.metricIcon} size={18} />
                <div className={styles.metricContent}>
                  <div className={styles.metricValue}>{item.value}</div>
                  <div className={styles.metricLabel}>{item.label}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div className={styles.actions}>
          <button className={styles.secondaryButton}>
            <span>+</span> Follow
          </button>
          <button className={styles.primaryButton}>
            <Mail size={16} />
            Contact Us
          </button>
        </div>
      </div>

      <div className={styles.detailCard}>
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <User size={16} />
            Skills
          </div>
          <div className={styles.tags}>
            {skills.map((skill) => (
              <span key={skill} className={styles.tag}>
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <Info size={16} />
            General Info
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Rate</span>
            <span className={styles.value}>$60/h</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Joined</span>
            <span className={styles.value}>12 Jan, 2022</span>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <Clock size={16} />
            Availability
          </div>
          <div className={styles.badges}>
            <span className={styles.badgePurple}>Remote Yes</span>
            <span className={styles.badgeGreen}>Hours/week 30</span>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <Phone size={16} />
            Contact
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Phone</span>
            <span className={styles.value}>{profile?.phoneNumber || '+1 345 678 9012'}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Email</span>
            <span className={styles.value}>charlie.stone@gamil.com</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Location</span>
            <span className={styles.value}>San Francisco, CA, USA</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

