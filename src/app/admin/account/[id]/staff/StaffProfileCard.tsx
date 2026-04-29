'use client';

import {
    Award,
    Briefcase,
    Calendar,
    CheckCircle,
    ExternalLink,
    Mail,
    MapPin,
    Phone,
    ShieldCheck,
    TrendingUp,
    User as UserIcon,
    XCircle,
} from 'lucide-react';
import Image from 'next/image';
import React from 'react';

import familyProfileService from '@/services/family-profile.service';
import type { Account } from '@/types/account';
import type { FamilyProfile } from '@/types/family-profile';

import styles from './staff-profile-card.module.css';

interface StaffProfileCardProps {
    account: Account | null;
    staffProfile: FamilyProfile | null;
    loading?: boolean;
    onProfileUpdated?: (updated: FamilyProfile) => void;
}

/** Minimum days between experience upgrades (1 year) */
const UPGRADE_COOLDOWN_DAYS = 365;

function canUpgradeExperience(staffProfile: FamilyProfile | null): { allowed: boolean; daysLeft: number } {
    if (!staffProfile?.updatedAt) return { allowed: true, daysLeft: 0 };
    const lastUpdate = new Date(staffProfile.updatedAt);
    const now = new Date();
    const daysSince = Math.floor((now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));
    const daysLeft = Math.max(0, UPGRADE_COOLDOWN_DAYS - daysSince);
    return { allowed: daysLeft === 0, daysLeft };
}

function mapMemberTypeLabel(memberType: string): string {
    switch (memberType.toLowerCase().trim()) {
        case 'nurse': return 'Điều dưỡng';
        case 'home nurse': return 'Điều dưỡng tại nhà';
        case 'consultant': return 'Tư vấn viên';
        case 'amenity manager': return 'Quản lý tiện ích';
        default: return memberType;
    }
}

function mapRoleLabel(roleName: string | null | undefined): string {
    switch ((roleName ?? '').toLowerCase().trim()) {
        // account roles
        case 'staff': return 'Nhân viên';
        case 'manager': return 'Quản lý';
        case 'admin': return 'Quản trị viên';
        case 'amenity_manager':
        case 'amenity manager':
        case 'amenity-manager': return 'Quản lý tiện ích';
        // member types (staff sub-types)
        case 'nurse': return 'Điều dưỡng';
        case 'home nurse': return 'Điều dưỡng tại nhà';
        case 'consultant': return 'Tư vấn viên';
        case 'amenity manager staff': return 'Quản lý tiện ích';
        default: return roleName || 'Nhân viên';
    }
}

function formatDate(dateStr: string | null | undefined): string {
    if (!dateStr) return 'Chưa cập nhật';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'Chưa cập nhật';
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatGender(gender: string | null | undefined): string {
    if (!gender) return 'Chưa cập nhật';
    const g = gender.toLowerCase().trim();
    if (g === 'male' || g === 'nam') return 'Nam';
    if (g === 'female' || g === 'nu' || g === 'nữ') return 'Nữ';
    return gender;
}

function isImageUrl(url: string): boolean {
    return /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(url) || url.includes('cloudinary.com');
}

interface InfoRowProps {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
}

function InfoRow({ icon, label, value }: InfoRowProps) {
    return (
        <div className={styles.infoRow}>
            <span className={styles.infoIcon}>{icon}</span>
            <div className={styles.infoContent}>
                <span className={styles.infoLabel}>{label}</span>
                <span className={styles.infoValue}>{value}</span>
            </div>
        </div>
    );
}

export const StaffProfileCard: React.FC<StaffProfileCardProps> = ({
    account,
    staffProfile,
    loading,
    onProfileUpdated,
}) => {
    const [upgrading, setUpgrading] = React.useState(false);
    const [upgradeError, setUpgradeError] = React.useState<string | null>(null);

    const handleUpgradeExperience = async () => {
        if (!staffProfile?.id) return;
        const { allowed, daysLeft } = canUpgradeExperience(staffProfile);
        if (!allowed) {
            setUpgradeError(`Chưa đủ điều kiện tăng kinh nghiệm. Còn ${daysLeft} ngày nữa.`);
            setTimeout(() => setUpgradeError(null), 4000);
            return;
        }
        setUpgrading(true);
        setUpgradeError(null);
        try {
            const updated = await familyProfileService.updateStaffLevel(staffProfile.id, {
                certificate: staffProfile.certificate ?? null,
                experience: (staffProfile.experience ?? 0) + 1,
            });
            onProfileUpdated?.(updated);
        } catch {
            setUpgradeError('Không thể cập nhật kinh nghiệm. Vui lòng thử lại.');
            setTimeout(() => setUpgradeError(null), 4000);
        } finally {
            setUpgrading(false);
        }
    };
    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.profileHeader}>
                    <div className={`${styles.placeholderAvatar} ${styles.skeleton}`} />
                    <div className={styles.headerInfo}>
                        <div className={styles.skeleton} style={{ width: 180, height: 22, borderRadius: 4 }} />
                        <div className={styles.skeleton} style={{ width: 90, height: 16, borderRadius: 4, marginTop: 8 }} />
                    </div>
                </div>
                <div className={styles.bodyGrid}>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className={styles.infoRow}>
                            <div className={styles.skeleton} style={{ width: 16, height: 16, borderRadius: 4 }} />
                            <div className={styles.skeleton} style={{ width: '65%', height: 14, borderRadius: 4 }} />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const name = staffProfile?.fullName || account?.username || account?.email || 'Chưa cập nhật';
    const avatarUrl = staffProfile?.avatarUrl || account?.avatarUrl;
    const initials = name.substring(0, 2).toUpperCase();
    const role = mapRoleLabel(account?.roleName);
    const memberType = staffProfile?.memberTypeName
        ? mapMemberTypeLabel(staffProfile.memberTypeName)
        : undefined;
    const isActive = account?.isActive ?? false;
    const isEmailVerified = account?.isEmailVerified ?? false;

    const certificate = staffProfile?.certificate;
    const experience = staffProfile?.experience;

    return (
        <div className={styles.container}>
            {/* ── Header ── */}
            <div className={styles.profileHeader}>
                {avatarUrl ? (
                    <Image
                        src={avatarUrl}
                        alt={name}
                        width={88}
                        height={88}
                        className={styles.avatar}
                        unoptimized
                    />
                ) : (
                    <div className={styles.placeholderAvatar}>{initials}</div>
                )}

                <div className={styles.headerInfo}>
                    <h3 className={styles.name}>{name}</h3>
                    <div className={styles.badgeRow}>
                        <span className={styles.roleBadge}>{role}</span>
                        {memberType && <span className={styles.memberTypeBadge}>{memberType}</span>}
                        <span className={isActive ? styles.statusActive : styles.statusInactive}>
                            <span className={`${styles.statusDot} ${isActive ? styles.statusDotActive : styles.statusDotInactive}`} />
                            {isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                        </span>
                    </div>
                    {account?.username && (
                        <span className={styles.usernameHint}>@{account.username}</span>
                    )}
                </div>
            </div>

            {/* ── Body: 2-column grid ── */}
            <div className={styles.bodyGrid}>

                {/* ── LEFT: Liên hệ ── */}
                <div className={styles.section}>
                    <span className={styles.sectionTitle}>Liên hệ</span>

                    <InfoRow
                        icon={<Mail size={14} />}
                        label="Email"
                        value={account?.email || 'Chưa cập nhật'}
                    />
                    <InfoRow
                        icon={<Phone size={14} />}
                        label="Số điện thoại"
                        value={staffProfile?.phoneNumber || account?.phone || 'Chưa cập nhật'}
                    />
                    <InfoRow
                        icon={<MapPin size={14} />}
                        label="Địa chỉ"
                        value={
                            <span className={staffProfile?.address ? undefined : styles.muted}>
                                {staffProfile?.address || 'Chưa cập nhật'}
                            </span>
                        }
                    />
                </div>

                {/* ── RIGHT: Tài khoản ── */}
                <div className={styles.section}>
                    <span className={styles.sectionTitle}>Tài khoản</span>

                    <InfoRow
                        icon={<UserIcon size={14} />}
                        label="Tên đăng nhập"
                        value={account?.username || 'Chưa cập nhật'}
                    />
                    <InfoRow
                        icon={<ShieldCheck size={14} />}
                        label="Xác thực email"
                        value={
                            isEmailVerified ? (
                                <span className={styles.verifiedBadge}>
                                    <CheckCircle size={13} /> Đã xác thực
                                </span>
                            ) : (
                                <span className={styles.unverifiedBadge}>
                                    <XCircle size={13} /> Chưa xác thực
                                </span>
                            )
                        }
                    />
                    <InfoRow
                        icon={<Calendar size={14} />}
                        label="Ngày tạo tài khoản"
                        value={formatDate(account?.createdAt)}
                    />
                </div>

                {/* ── LEFT: Thông tin cá nhân ── */}
                <div className={styles.section}>
                    <span className={styles.sectionTitle}>Thông tin cá nhân</span>

                    <InfoRow
                        icon={<UserIcon size={14} />}
                        label="Giới tính"
                        value={formatGender(staffProfile?.gender)}
                    />
                    <InfoRow
                        icon={<Calendar size={14} />}
                        label="Ngày sinh"
                        value={
                            <span className={staffProfile?.dateOfBirth ? undefined : styles.muted}>
                                {formatDate(staffProfile?.dateOfBirth)}
                            </span>
                        }
                    />
                </div>

                {/* ── RIGHT: Chuyên môn ── */}
                <div className={styles.section}>
                    <span className={styles.sectionTitle}>Chuyên môn</span>

                    {/* Experience row with upgrade button */}
                    <div className={styles.infoRow}>
                        <span className={styles.infoIcon}><Briefcase size={14} /></span>
                        <div className={styles.infoContent}>
                            <span className={styles.infoLabel}>Kinh nghiệm</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                {experience != null ? (
                                    <span className={styles.experienceBadge}>{experience} năm</span>
                                ) : (
                                    <span className={styles.muted}>Chưa cập nhật</span>
                                )}
                                <button
                                    onClick={handleUpgradeExperience}
                                    disabled={upgrading}
                                    title={
                                        canUpgradeExperience(staffProfile).allowed
                                            ? 'Tăng 1 năm kinh nghiệm'
                                            : `Còn ${canUpgradeExperience(staffProfile).daysLeft} ngày nữa mới được tăng`
                                    }
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 3,
                                        padding: '2px 8px',
                                        borderRadius: 6,
                                        border: '1px solid #bbf7d0',
                                        background: canUpgradeExperience(staffProfile).allowed ? '#f0fdf4' : '#f9fafb',
                                        color: canUpgradeExperience(staffProfile).allowed ? '#15803d' : '#9ca3af',
                                        fontSize: 11,
                                        fontWeight: 600,
                                        cursor: upgrading ? 'wait' : canUpgradeExperience(staffProfile).allowed ? 'pointer' : 'not-allowed',
                                        transition: 'all 0.15s',
                                    }}
                                >
                                    <TrendingUp size={12} />
                                    {upgrading ? '...' : '+1 năm'}
                                </button>
                            </div>
                            {upgradeError && (
                                <span style={{ fontSize: 11, color: '#b91c1c', marginTop: 4, display: 'block' }}>
                                    {upgradeError}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className={styles.infoRow}>
                        <span className={styles.infoIcon}><Award size={14} /></span>
                        <div className={styles.infoContent}>
                            <span className={styles.infoLabel}>Chứng chỉ</span>
                            {certificate ? (
                                isImageUrl(certificate) ? (
                                    <a
                                        href={certificate}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.certificateWrapper}
                                    >
                                        <Image
                                            src={certificate}
                                            alt="Chứng chỉ"
                                            width={280}
                                            height={180}
                                            className={styles.certificateImage}
                                            unoptimized
                                        />
                                        <span className={styles.certificateOverlay}>
                                            <ExternalLink size={16} /> Xem đầy đủ
                                        </span>
                                    </a>
                                ) : (
                                    <a
                                        href={certificate}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.certificateLink}
                                    >
                                        <ExternalLink size={13} /> Xem chứng chỉ
                                    </a>
                                )
                            ) : (
                                <span className={styles.muted}>Chưa cập nhật</span>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
