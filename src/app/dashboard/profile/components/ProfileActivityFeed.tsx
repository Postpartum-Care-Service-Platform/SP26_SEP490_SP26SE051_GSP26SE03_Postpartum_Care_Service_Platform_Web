'use client';

import { MessageSquare, GitCommit, Users, Upload, Award, UserPlus, Paperclip } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import styles from './profile-activity-feed.module.css';
import { ProfileSettings } from './ProfileSettings';

const activityTabs = ['Activity', 'Teams', 'Projects', 'Settings'];

const mockActivity = [
  {
    time: '08:45',
    icon: MessageSquare,
    title: 'Commented on a Post',
    details: 'Shared feedback on the new UI design proposal posted in the design team channel.',
    tags: ['#Design'],
  },
  {
    time: '10:20',
    icon: GitCommit,
    title: 'Pushed Code to Repository',
    details: 'Committed v2.3.1 update to the Project Management App, fixing bugs and improving API performance.',
    tags: ['Code Review', 'API'],
  },
  {
    time: '12:00',
    icon: Users,
    title: 'Joined Team Discussion',
    details: 'Participated in Sprint Planning with the development team to align on goals and deadlines.',
    avatars: ['/images/sample-avatar-1.png', '/images/sample-avatar-2.png', '/images/sample-avatar-3.png', '/images/sample-avatar-4.png'],
  },
  {
    time: '15:30',
    icon: Upload,
    title: 'Uploaded Project Files',
    details: 'Shared updated wireframes for the Admin Dashboard in the shared drive for review.',
    attachments: [
      { name: 'Project Report', type: '.docx' },
      { name: 'Client Feedback', type: '.xlsx' },
    ],
  },
  {
    time: '18:10',
    icon: Award,
    title: 'Received Achievement',
    details: 'Earned the "Top Contributor" badge for completing 10+ tasks this week.',
    images: ['/images/placeholder-image-1.png', '/images/placeholder-image-2.png'],
  },
  {
    time: '15:45',
    icon: UserPlus,
    title: 'New Team Member Joined',
    details: 'Michael Scott joined the Design Team along with developers Jim Halpert and Pam Beesly.',
    members: [
      { role: 'Designer', avatar: '/images/sample-avatar-5.png' },
      { role: 'developers', avatar: '/images/sample-avatar-6.png' },
      { role: 'developers', avatar: '/images/sample-avatar-7.png' },
    ],
  },
];

export function ProfileActivityFeed() {
  const [activeTab, setActiveTab] = useState('Activity');

  return (
    <section className={styles.card}>
      <header className={styles.cardHeader}>
        <nav className={styles.tabs}>
          {activityTabs.map((tab) => (
            <button
              key={tab}
              className={`${styles.tabButton} ${activeTab === tab ? styles.active : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>
      </header>
      <div className={styles.cardBody}>
        {activeTab === 'Activity' && (
          <div className={styles.timeline}>
            {mockActivity.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className={styles.timelineItem}>
                  <div className={styles.timelineMeta}>
                    <div className={styles.timestamp}>{item.time}</div>
                    <div className={styles.timelineConnector}>
                      <div className={styles.connectorIcon}>
                        <Icon size={16} />
                      </div>
                      <div className={styles.connectorLine} />
                    </div>
                  </div>
                  <div className={styles.timelineContent}>
                    <div className={styles.contentHeader}>
                      <span className={styles.title}>{item.title}</span>
                      {item.tags && (
                        <div className={styles.tags}>
                          {item.tags.map((tag) => (
                            <span key={tag} className={styles.tag}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className={styles.details}>{item.details}</p>
                    {item.avatars && (
                      <div className={styles.avatarGroup}>
                        {item.avatars.map((src) => (
                          <div key={src} className={styles.avatar}>
                            <Image src={src} alt="" width={28} height={28} />
                          </div>
                        ))}
                         <div className={styles.avatarMore}>+4</div>
                      </div>
                    )}
                    {item.attachments && (
                      <div className={styles.attachments}>
                        {item.attachments.map((file) => (
                          <div key={file.name} className={styles.attachment}>
                            <Paperclip size={14} />
                            <span>{file.name}</span>
                            <span className={styles.fileType}>{file.type}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {item.images && (
                      <div className={styles.images}>
                        {item.images.map((src) => (
                          <div key={src} className={styles.imageWrapper}>
                            <Image src={src} alt="" layout="fill" objectFit="cover" />
                          </div>
                        ))}
                      </div>
                    )}
                    {item.members && (
                      <div className={styles.members}>
                        {item.members.map((member, i) => (
                          <div key={i} className={styles.member}>
                            <span>{member.role}:</span>
                            <div className={styles.avatarSmall}>
                               <Image src={member.avatar} alt="" width={24} height={24} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {activeTab === 'Settings' && <ProfileSettings />}
                {(activeTab === 'Teams' || activeTab === 'Projects') && (
          <div className={styles.placeholder}>
            <p>{activeTab} content is coming soon.</p>
          </div>
        )}
      </div>
    </section>
  );
}
