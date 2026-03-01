'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import familyProfileService from '@/services/family-profile.service';
import type { CreateFamilyProfileRequest, FamilyProfile } from '@/types/family-profile';

import styles from './family-profile-tab.module.css';

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error) {
    return error.message || fallback;
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    const maybeMessage = (error as { message?: unknown }).message;
    if (typeof maybeMessage === 'string') return maybeMessage;
  }

  return fallback;
};

export function FamilyProfileTab() {
  const [profiles, setProfiles] = useState<FamilyProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProfile, setEditingProfile] = useState<FamilyProfile | null>(null);

  const [formData, setFormData] = useState<CreateFamilyProfileRequest>({
    memberTypeId: 1,
    fullName: '',
    dateOfBirth: '',
    gender: 'Male',
    address: '',
    phoneNumber: '',
    avatar: null,
  });

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Vui lòng đăng nhập để xem hồ sơ gia đình');
          setLoading(false);
          return;
        }
      }

      setLoading(true);
      const data = await familyProfileService.getMyFamilyProfiles();
      setProfiles(data);
    } catch (err: unknown) {
      const message = getErrorMessage(err, 'Không thể tải danh sách hồ sơ gia đình');
      if (
        typeof err === 'object' &&
        err !== null &&
        'status' in err &&
        typeof (err as { status?: unknown }).status === 'number' &&
        (err as { status: number }).status === 401
      ) {
        setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (profile: FamilyProfile) => {
    setEditingProfile(profile);
    setFormData({
      memberTypeId: profile.memberTypeId,
      fullName: profile.fullName,
      dateOfBirth: profile.dateOfBirth,
      gender: profile.gender,
      address: profile.address,
      phoneNumber: profile.phoneNumber,
      avatar: null,
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProfile(null);
    setFormData({
      memberTypeId: 1,
      fullName: '',
      dateOfBirth: '',
      gender: 'Male',
      address: '',
      phoneNumber: '',
      avatar: null,
    });
  };

  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      if (editingProfile) {
        await familyProfileService.updateFamilyProfile(editingProfile.id, formData);
        setSuccess('Cập nhật hồ sơ gia đình thành công!');
      } else {
        await familyProfileService.createFamilyProfile(formData);
        setSuccess('Tạo hồ sơ gia đình thành công!');
      }

      handleCancel();
      await loadProfiles();
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Không thể lưu hồ sơ gia đình'));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, avatar: file }));
    }
  };

  if (loading) {
    return <div className={styles.loading}>Đang tải...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Hồ sơ gia đình</h3>
        {!showForm && <Button onClick={() => setShowForm(true)}>Thêm hồ sơ mới</Button>}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formSection}>
            <h4 className={styles.formTitle}>{editingProfile ? 'Cập nhật hồ sơ' : 'Thêm hồ sơ mới'}</h4>

            <div className={styles.field}>
              <label htmlFor="fullName" className={styles.label}>
                Họ và tên *
              </label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                variant="profile"
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="dateOfBirth" className={styles.label}>
                Ngày sinh *
              </label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                variant="profile"
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="gender" className={styles.label}>
                Giới tính *
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className={styles.select}
              >
                <option value="Male">Nam</option>
                <option value="Female">Nữ</option>
                <option value="Other">Khác</option>
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="phoneNumber" className={styles.label}>
                Số điện thoại *
              </label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                variant="profile"
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="address" className={styles.label}>
                Địa chỉ *
              </label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                variant="profile"
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="avatar" className={styles.label}>
                Avatar
              </label>
              <Input
                id="avatar"
                name="avatar"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className={styles.input}
              />
            </div>

            {error && <div className={styles.error}>{error}</div>}
            {success && <div className={styles.success}>{success}</div>}

            <div className={styles.formActions}>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Hủy
              </Button>
              <Button type="submit">{editingProfile ? 'Cập nhật' : 'Tạo mới'}</Button>
            </div>
          </div>
        </form>
      )}

      <div className={styles.profilesList}>
        {profiles.length === 0 ? (
          <div className={styles.empty}>
            <p>Chưa có hồ sơ gia đình nào. Hãy thêm hồ sơ mới!</p>
          </div>
        ) : (
          profiles.map((profile) => (
            <div key={profile.id} className={styles.profileCard}>
              <div className={styles.profileHeader}>
                {profile.avatarUrl ? (
                  <Image
                    src={profile.avatarUrl}
                    alt={profile.fullName}
                    width={60}
                    height={60}
                    className={styles.avatar}
                  />
                ) : (
                  <div className={styles.avatarPlaceholder}>{profile.fullName.charAt(0).toUpperCase()}</div>
                )}
                <div className={styles.profileInfo}>
                  <h4 className={styles.profileName}>{profile.fullName}</h4>
                  <p className={styles.profileType}>{profile.memberTypeName}</p>
                </div>
              </div>
              <div className={styles.profileDetails}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Ngày sinh:</span>
                  <span className={styles.detailValue}>
                    {new Date(profile.dateOfBirth).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Giới tính:</span>
                  <span className={styles.detailValue}>{profile.gender}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>SĐT:</span>
                  <span className={styles.detailValue}>{profile.phoneNumber}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Địa chỉ:</span>
                  <span className={styles.detailValue}>{profile.address}</span>
                </div>
              </div>
              <div className={styles.profileActions}>
                <Button variant="outline" size="sm" onClick={() => handleEdit(profile)}>
                  Chỉnh sửa
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
