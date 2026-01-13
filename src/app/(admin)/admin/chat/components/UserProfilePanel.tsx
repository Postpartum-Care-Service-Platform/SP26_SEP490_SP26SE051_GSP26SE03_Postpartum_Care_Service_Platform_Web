'use client';

import Image from 'next/image';
import { User, Phone, Video, MoreVertical, Mail, Briefcase, Download, FileText } from 'lucide-react';

import styles from './user-profile-panel.module.css';

type Document = {
  id: string;
  name: string;
  size: string;
  url: string;
};

type UserProfile = {
  id: string;
  name: string;
  avatar: string | null;
  title: string;
  isOnline: boolean;
  email: string;
  phone: string;
  role: string;
  description: string;
  documents?: Document[];
};

type Props = {
  profile: UserProfile | null;
  onClose?: () => void;
  onCall?: () => void;
  onVideoCall?: () => void;
  onMore?: () => void;
};

export function UserProfilePanel({ profile, onClose, onCall, onVideoCall, onMore }: Props) {
  if (!profile) {
    return null;
  }

  const handleDownload = (url: string, name: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.avatarSection}>
          <div className={styles.avatarWrapper}>
            {profile.avatar ? (
              <Image src={profile.avatar} alt={profile.name} width={80} height={80} className={styles.avatar} />
            ) : (
              <div className={styles.avatarPlaceholder}>
                <User size={40} />
              </div>
            )}
            {profile.isOnline && <span className={styles.onlineIndicator} />}
          </div>
          <div className={styles.nameSection}>
            <h3 className={styles.name}>{profile.name}</h3>
            <p className={styles.title}>{profile.title}</p>
          </div>
        </div>
        <div className={styles.actionButtons}>
          <button type="button" className={styles.actionButton} onClick={onCall} aria-label="Call">
            <Phone size={18} />
          </button>
          <button type="button" className={styles.actionButton} onClick={onVideoCall} aria-label="Video call">
            <Video size={18} />
          </button>
          <button type="button" className={styles.actionButton} onClick={onMore} aria-label="More options">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Personal Information :</h4>
          <div className={styles.infoList}>
            <div className={styles.infoItem}>
              <Mail size={16} className={styles.infoIcon} />
              <span className={styles.infoText}>{profile.email}</span>
            </div>
            <div className={styles.infoItem}>
              <Phone size={16} className={styles.infoIcon} />
              <span className={styles.infoText}>{profile.phone}</span>
            </div>
            <div className={styles.infoItem}>
              <Briefcase size={16} className={styles.infoIcon} />
              <span className={styles.infoText}>{profile.role}</span>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Description :</h4>
          <p className={styles.description}>{profile.description}</p>
        </div>

        {profile.documents && profile.documents.length > 0 && (
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Documents:</h4>
            <div className={styles.documentsList}>
              {profile.documents.map((doc) => (
                <div key={doc.id} className={styles.documentItem}>
                  <div className={styles.documentInfo}>
                    <FileText size={20} className={styles.documentIcon} />
                    <div className={styles.documentDetails}>
                      <span className={styles.documentName}>{doc.name}</span>
                      <span className={styles.documentSize}>{doc.size}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className={styles.downloadButton}
                    onClick={() => handleDownload(doc.url, doc.name)}
                    aria-label={`Download ${doc.name}`}
                  >
                    <Download size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

