'use client';

import React from 'react';

import type { CreateFamilyProfileRequest, FamilyProfile } from '@/types/family-profile';
import familyProfileService from '@/services/family-profile.service';
import { useToast } from '@/components/ui/toast/use-toast';
import { useProfile } from '@/app/dashboard/profile/ProfileContext';

function toForm(profile: FamilyProfile): CreateFamilyProfileRequest {
  return {
    memberTypeId: profile.memberTypeId,
    fullName: profile.fullName ?? '',
    dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : '', // Format date for input
    gender: profile.gender ?? 'male',
    address: profile.address ?? '',
    phoneNumber: profile.phoneNumber ?? '',
  };
}

export function PersonalInfoForm() {
  const { toast } = useToast();
  const { profile, setProfile } = useProfile();

  const [isLoading, setIsLoading] = React.useState(false);

  const [form, setForm] = React.useState<CreateFamilyProfileRequest>({
    memberTypeId: 4, // Default or from a selection
    fullName: '',
    dateOfBirth: '',
    gender: 'male',
    address: '',
    phoneNumber: '',
  });

  React.useEffect(() => {
    if (profile) {
      setForm(toForm(profile));
    }
  }, [profile]);

  const handleChange = <K extends keyof CreateFamilyProfileRequest>(key: K, value: CreateFamilyProfileRequest[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      // NOTE: This should be an UPDATE call if profile exists
      const updatedProfile = await familyProfileService.createFamilyProfile(form);
      setProfile(updatedProfile);
      toast({ title: 'Cập nhật thông tin thành công', variant: 'success' });
    } catch (err: any) {
      toast({ title: err?.message || 'Cập nhật thất bại', variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid var(--color-border-default)',
        borderRadius: 5,
        padding: 18,
      }}
    >
      <h2 style={{ margin: 0, fontSize: 18, fontFamily: 'var(--font-display)', fontWeight: 400 }}>Thông tin cá nhân</h2>

      <form onSubmit={handleSubmit} style={{ marginTop: 16, display: 'grid', gap: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <label style={{ display: 'grid', gap: 6 }}>
            Họ và tên
            <input
              value={form.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              style={{ height: 44, padding: '0 12px', border: '1px solid rgba(0,0,0,0.2)', borderRadius: 5 }}
            />
          </label>

          <label style={{ display: 'grid', gap: 6 }}>
            Số điện thoại
            <input
              value={form.phoneNumber}
              onChange={(e) => handleChange('phoneNumber', e.target.value.replace(/\D/g, ''))}
              style={{ height: 44, padding: '0 12px', border: '1px solid rgba(0,0,0,0.2)', borderRadius: 5 }}
            />
          </label>

          <label style={{ display: 'grid', gap: 6 }}>
            Ngày sinh
            <input
              type="date"
              value={form.dateOfBirth}
              onChange={(e) => handleChange('dateOfBirth', e.target.value)}
              style={{ height: 44, padding: '0 12px', border: '1px solid rgba(0,0,0,0.2)', borderRadius: 5 }}
            />
          </label>

          <label style={{ display: 'grid', gap: 6 }}>
            Giới tính
            <select
              value={form.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
              style={{ height: 44, padding: '0 12px', border: '1px solid rgba(0,0,0,0.2)', borderRadius: 5 }}
            >
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </label>

          <label style={{ display: 'grid', gap: 6, gridColumn: '1 / -1' }}>
            Địa chỉ
            <input
              value={form.address}
              onChange={(e) => handleChange('address', e.target.value)}
              style={{ height: 44, padding: '0 12px', border: '1px solid rgba(0,0,0,0.2)', borderRadius: 5 }}
            />
          </label>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            disabled={isLoading}
            style={{
              height: 44,
              border: 'none',
              background: '#F28C00',
              color: '#fff',
              cursor: 'pointer',
              borderRadius: 5,
              padding: '0 24px',
            }}
          >
            {isLoading ? 'Đang xử lý...' : 'Lưu thay đổi'}
          </button>
        </div>
      </form>
    </div>
  );
}
