'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';

import { ChangePasswordTab } from './components/ChangePasswordTab';
import { FamilyProfileTab } from './components/FamilyProfileTab';
import { ProfileHeader } from './components/ProfileHeader';
import { ProfileInfoTab } from './components/ProfileInfoTab';
import { ProfileOverview } from './components/ProfileOverview';
import { ProfileSidebarColumn } from './components/ProfileSidebarColumn';
import styles from './profile.module.css';

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!token || !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router, token]);

  if (!token || !isAuthenticated) {
    return (
      <div className={styles.page}>
        <div style={{ padding: '40px', textAlign: 'center' }}>Đang kiểm tra đăng nhập...</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <ProfileHeader />
      <div className={styles.layout}>
        <ProfileSidebarColumn />
        <div className={styles.mainColumn}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className={styles.tabs}>
            <TabsList className={styles.tabsList}>
              <TabsTrigger value="overview">Tổng quan</TabsTrigger>
              <TabsTrigger value="info">Thông tin cá nhân</TabsTrigger>
              <TabsTrigger value="family">Hồ sơ gia đình</TabsTrigger>
              <TabsTrigger value="password">Đổi mật khẩu</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className={styles.tabContent}>
              <ProfileOverview />
            </TabsContent>

            <TabsContent value="info" className={styles.tabContent}>
              <ProfileInfoTab />
            </TabsContent>

            <TabsContent value="family" className={styles.tabContent}>
              <FamilyProfileTab />
            </TabsContent>

            <TabsContent value="password" className={styles.tabContent}>
              <ChangePasswordTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
