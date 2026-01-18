'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileHeader } from './components/ProfileHeader';
import { ProfileSidebarColumn } from './components/ProfileSidebarColumn';
import { ProfileInfoTab } from './components/ProfileInfoTab';
import { ChangePasswordTab } from './components/ChangePasswordTab';
import { FamilyProfileTab } from './components/FamilyProfileTab';
import { ProfileOverview } from './components/ProfileOverview';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import styles from './profile.module.css';

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Kiểm tra authentication
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token || !isAuthenticated) {
        router.push('/auth/login');
        return;
      }
      setCheckingAuth(false);
    }
  }, [isAuthenticated, router]);

  if (checkingAuth) {
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
