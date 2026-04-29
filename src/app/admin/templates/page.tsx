"use client";

import {
    FileText,
    Mail,
    Plus,
    Save,
    Trash2,
    ChevronDown,
    ChevronRight,
    FileEdit,
    PanelLeftClose,
    PanelLeftOpen,
    Minus,
    BookOpen,
    Globe,
} from "lucide-react";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { AdminPageLayout } from "@/components/layout/admin/AdminPageLayout";

import { convertPlaceholdersToChips, convertChipsToPlaceholders } from "@/components/ui/rich-text-editor/PlaceholderChip";
import RichTextEditor from "@/components/ui/rich-text-editor/RichTextEditor";
import contractTemplateService, {
    ContractTemplate,
    CreateContractTemplateRequest,
    UpdateContractTemplateRequest,
} from "@/services/contract-template.service";
import emailTemplateService, {
    EmailTemplate,
    CreateEmailTemplateRequest,
    UpdateEmailTemplateRequest,
} from "@/services/email-template.service";
import placeholderService, { PlaceholderItem } from "@/services/placeholder.service";

import { useToast } from "@/components/ui/toast/use-toast";

import styles from "./templates.module.css";

type TemplateType = 'contract' | 'email';

interface SelectedTemplate {
    type: TemplateType;
    id: number;
}

// Internal Premium Skeleton Component
const SkeletonBone = ({ width, height, circle = false, margin = '0' }: { width?: string | number, height?: string | number, circle?: boolean, margin?: string }) => (
  <div 
    style={{ 
      width: width || '100%', 
      height: height || '20px', 
      backgroundColor: '#f1f5f9',
      borderRadius: circle ? '50%' : '4px',
      position: 'relative',
      overflow: 'hidden',
      margin: margin
    }}
  >
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
      animation: 'skeleton-shimmer-run 1.8s infinite linear',
      transform: 'translateX(-100%)'
    }} />
  </div>
);

// ── New template modal ─────────────────────────────────────────────────────────
function NewTemplateModal({
    type,
    onClose,
    onCreate,
}: {
    type: TemplateType;
    onClose: () => void;
    onCreate: (name: string, code?: string) => void;
}) {
    const [name, setName] = useState('');
    const [code, setCode] = useState('');

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <p className={styles.modalTitle}>
                    {type === 'contract' ? 'Tạo mẫu hợp đồng mới' : 'Tạo mẫu email mới'}
                </p>
                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Tên mẫu</label>
                    <input className={styles.formInput} placeholder="Nhập tên mẫu..." value={name} onChange={(e) => setName(e.target.value)} autoFocus />
                </div>
                {type === 'email' && (
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Mã code</label>
                        <input className={styles.formInput} placeholder="VD: WELCOME_EMAIL" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} />
                    </div>
                )}
                <div className={styles.modalActions}>
                    <button className={styles.btnCancel} onClick={onClose}>Hủy</button>
                    <button className={styles.btnSave} disabled={!name.trim() || (type === 'email' && !code.trim())} onClick={() => onCreate(name.trim(), code.trim() || undefined)}>Tạo mẫu</button>
                </div>
            </div>
        </div>
    );
}

// ── Confirm delete modal ───────────────────────────────────────────────────────
function ConfirmDeleteModal({ name, onClose, onConfirm }: { name: string; onClose: () => void; onConfirm: () => void }) {
    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <p className={styles.modalTitle}>Xóa mẫu</p>
                <p className={styles.confirmText}>Bạn có chắc muốn xóa mẫu <strong>&quot;{name}&quot;</strong>?</p>
                <p className={styles.confirmSub}>Hành động này không thể hoàn tác.</p>
                <div className={styles.modalActions}>
                    <button className={styles.btnCancel} onClick={onClose}>Hủy</button>
                    <button className={styles.btnDeleteConfirm} onClick={onConfirm}>Xóa</button>
                </div>
            </div>
        </div>
    );
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function AdminTemplatesPage() {
    const { toast } = useToast();
    const [contractTemplates, setContractTemplates] = useState<ContractTemplate[]>([]);
    const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
    const [placeholders, setPlaceholders] = useState<PlaceholderItem[]>([]);
    const [loadingList, setLoadingList] = useState(true);
    const editorRef = useRef<unknown | null>(null);
    // Luu lai phan html/body wrapper neu content goc la full HTML document
    const htmlWrapperRef = useRef<{ before: string; after: string } | null>(null);

    const [selected, setSelected] = useState<SelectedTemplate | null>(null);
    const [activeContract, setActiveContract] = useState<ContractTemplate | null>(null);
    const [activeEmail, setActiveEmail] = useState<EmailTemplate | null>(null);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [saving, setSaving] = useState(false);

    const [contractOpen, setContractOpen] = useState(true);
    const [emailOpen, setEmailOpen] = useState(true);

    const [editName, setEditName] = useState('');
    const [editSubject, setEditSubject] = useState('');
    const [editorContent, setEditorContent] = useState('');

    const [newModal, setNewModal] = useState<TemplateType | null>(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [tooltipData, setTooltipData] = useState<{ text: string; top: number; left: number } | null>(null);
    const [zoomLevel, setZoomLevel] = useState(100);
    const [viewMode, setViewMode] = useState<'print' | 'read' | 'web'>('print');

    const handleFetchPlaceholders = useCallback(() => placeholderService.getAll(), []);

    // ── Fetch data ──
    const fetchAll = useCallback(async () => {
        setLoadingList(true);
        try {
            // Premium 2s delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            const [contracts, emails, placeholderData] = await Promise.all([
                contractTemplateService.getAll().catch(() => [] as ContractTemplate[]),
                emailTemplateService.getAll().catch(() => [] as EmailTemplate[]),
                placeholderService.getAll().catch(() => [] as PlaceholderItem[]),
            ]);
            setContractTemplates(Array.isArray(contracts) ? contracts.filter((t) => t.isActive !== false) : []);
            setEmailTemplates(Array.isArray(emails) ? emails.filter((t) => t.isActive !== false) : []);

            const allPlaceholders = Array.isArray(placeholderData) ? placeholderData : [];
            setPlaceholders(allPlaceholders);
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoadingList(false);
        }
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    // ── Select template ──
    const handleSelect = useCallback(async (type: TemplateType, id: number) => {
        if (selected?.type === type && selected?.id === id) return;
        setSelected({ type, id });
        setLoadingDetail(true);
        try {
            if (type === 'contract') {
                const data = await contractTemplateService.getById(id);
                setActiveContract(data);
                setActiveEmail(null);
                setEditName(data.name);
                setEditSubject('');
                setEditorContent(convertPlaceholdersToChips(data.content || '', placeholders));
            } else {
                const data = await emailTemplateService.getById(id);
                setActiveEmail(data);
                setActiveContract(null);
                setEditName(data.name);
                setEditSubject(data.subject || '');
                const body = data.body || '';
                const bm = body.match(/([\s\S]*?<body[^>]*>)([\s\S]*?)(<\/body>[\s\S]*)/i);
                htmlWrapperRef.current = bm ? { before: bm[1], after: bm[3] } : null;
                setEditorContent(convertPlaceholdersToChips(body, placeholders));
            }
        } catch (err) { console.error('Error loading template:', err); }
        finally { setLoadingDetail(false); }
    }, [placeholders, selected]);

    // Handle editor content change
    const handleEditorChange = useCallback((html: string) => {
        setEditorContent(html);
    }, []);

    // ── Save ──
    const handleSave = async () => {
        if (!selected || saving) return;
        setSaving(true);
        try {
            if (selected.type === 'contract' && activeContract) {
                const payload: UpdateContractTemplateRequest = { name: editName, content: convertChipsToPlaceholders(editorContent) };
                const updated = await contractTemplateService.update(selected.id, payload);
                setActiveContract(updated);
                setContractTemplates((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
            } else if (selected.type === 'email' && activeEmail) {
                let bodyToSave = convertChipsToPlaceholders(editorContent);
                if (htmlWrapperRef.current) {
                    bodyToSave = htmlWrapperRef.current.before + bodyToSave + htmlWrapperRef.current.after;
                }
                const payload: UpdateEmailTemplateRequest = { name: editName, subject: editSubject, body: bodyToSave };
                const updated = await emailTemplateService.update(selected.id, payload);
                setActiveEmail(updated);
                setEmailTemplates((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
            }
            toast({ title: 'Đã lưu thay đổi thành công', variant: 'success' });
        } catch (err) { 
            console.error('Error saving:', err);
            toast({ title: 'Lỗi khi lưu mẫu', variant: 'error' });
        }
        finally { setSaving(false); }
    };

    // ── Delete ──
    const handleDelete = async () => {
        if (!selected) return;
        try {
            if (selected.type === 'contract') {
                await contractTemplateService.delete(selected.id);
                setContractTemplates((prev) => prev.filter((t) => t.id !== selected.id));
            } else {
                await emailTemplateService.delete(selected.id);
                setEmailTemplates((prev) => prev.filter((t) => t.id !== selected.id));
            }
            setSelected(null);
            setActiveContract(null);
            setActiveEmail(null);
            toast({ title: 'Đã xóa mẫu thành công', variant: 'success' });
        } catch (err) { 
            console.error('Error deleting:', err);
            toast({ title: 'Lỗi khi xóa mẫu', variant: 'error' });
        }
        finally { setDeleteModal(false); }
    };

    // ── Create ──
    const handleCreate = async (name: string, code?: string) => {
        if (!newModal) return;
        const defaultEmailBody = [
            '<html>',
            '<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">',
            '    <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">',
            '        <h2 style="color: #333; margin-bottom: 20px;">' + name + '</h2>',
            '        <p style="color: #555;">Nội dung email...</p>',
            '        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;"/>',
            '        <p style="color: #aaa; font-size: 12px;">Trân trọng,<br/>{{team_name}}</p>',
            '    </div>',
            '</body>',
            '</html>',
        ].join('\n');
        try {
            if (newModal === 'contract') {
                const payload: CreateContractTemplateRequest = { name, content: '<p>Nội dung hợp đồng...</p>' };
                const created = await contractTemplateService.create(payload);
                setContractTemplates((prev) => [...prev, created]);
                setNewModal(null);
                handleSelect('contract', created.id);
            } else {
                const payload: CreateEmailTemplateRequest = { name, code: code!, subject: name, body: defaultEmailBody };
                const created = await emailTemplateService.create(payload);
                setEmailTemplates((prev) => [...prev, created]);
                setNewModal(null);
                handleSelect('email', created.id);
            }
        } catch (err) { console.error('Error creating:', err); }
    };

    const currentName = selected?.type === 'contract' ? activeContract?.name : activeEmail?.name;

    const filteredPlaceholders = useMemo(() => {
        const typeValue = selected?.type === 'contract' ? 1 : 2;
        return placeholders.filter(p => p.isActive && (p.templateType === typeValue || p.templateType === 0));
    }, [placeholders, selected]);

    const breadcrumbItems = useMemo(() => {
        const items = [{ label: 'Soạn thảo mẫu' }];
        if (selected && currentName) {
            items.push({ label: currentName });
        }
        return items;
    }, [selected, currentName]);

    const handleMouseEnter = (e: React.MouseEvent, text: string) => {
        if (!isSidebarCollapsed) return;
        const rect = e.currentTarget.getBoundingClientRect();
        setTooltipData({
            text,
            top: rect.top + rect.height / 2,
            left: rect.left + rect.width + 12
        });
    };

    const handleMouseLeave = () => {
        setTooltipData(null);
    };

    return (
        <AdminPageLayout
            header={
                <Breadcrumbs
                    items={breadcrumbItems}
                    homeHref="/admin"
                />
            }
            noScroll={true}
        >
            <style>{`
                @keyframes skeleton-shimmer-run {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
            <div className={styles.pageContainer}>
                {/* ── Sidebar ── */}
                <aside className={`${styles.sidebar} ${isSidebarCollapsed ? styles.collapsed : ''}`}>
                    <div className={styles.sidebarHeader}>
                        <div>
                            <p className={styles.sidebarTitle}>Danh sách mẫu</p>
                            <p className={styles.sidebarSubtitle}>Mẫu hợp đồng & email hệ thống</p>
                        </div>
                        <button className={styles.toggleSidebarBtn} onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}>
                            {isSidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
                        </button>
                    </div>
                    <div className={styles.sidebarScroll}>
                        {loadingList ? (
                            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <SkeletonBone width={140} height={16} />
                                    {[...Array(5)].map((_, i) => <SkeletonBone key={i} width="90%" height={32} />)}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
                                    <SkeletonBone width={120} height={16} />
                                    {[...Array(4)].map((_, i) => <SkeletonBone key={i} width="90%" height={32} />)}
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className={styles.section}>
                                    <div className={styles.sectionHeader}>
                                        <span className={styles.sectionLabel} onClick={() => setContractOpen((v) => !v)} onMouseEnter={(e) => handleMouseEnter(e, 'Mẫu hợp đồng')} onMouseLeave={handleMouseLeave}>
                                            <div className={styles.tooltipWrapper}>
                                                <FileText size={isSidebarCollapsed ? 20 : 13} className={styles.sectionIcon} />
                                            </div>
                                            <span className={styles.sectionText}>Mẫu hợp đồng</span>
                                            <span className={styles.sectionCount}>{contractTemplates.length}</span>
                                        </span>
                                        <button className={styles.sectionAddBtn} onClick={() => setNewModal('contract')}><Plus size={14} /></button>
                                    </div>
                                    {contractOpen && (
                                        <div className={styles.templateList}>
                                            {contractTemplates.length === 0 && <div className={styles.sidebarLoading}>Chưa có mẫu nào</div>}
                                            {contractTemplates.map((t) => (
                                                <button key={t.id} className={`${styles.templateItem} ${selected?.type === 'contract' && selected.id === t.id ? styles.active : ''}`} onClick={() => handleSelect('contract', t.id)} onMouseEnter={(e) => handleMouseEnter(e, t.name)} onMouseLeave={handleMouseLeave}>
                                                    <div className={styles.tooltipWrapper}>
                                                        <FileEdit size={isSidebarCollapsed ? 20 : 14} className={styles.templateItemIcon} />
                                                    </div>
                                                    <span className={styles.templateName}>{t.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className={styles.section}>
                                    <div className={styles.sectionHeader}>
                                        <span className={styles.sectionLabel} onClick={() => setEmailOpen((v) => !v)} onMouseEnter={(e) => handleMouseEnter(e, 'Mẫu email')} onMouseLeave={handleMouseLeave}>
                                            <div className={styles.tooltipWrapper}>
                                                <Mail size={isSidebarCollapsed ? 20 : 13} className={styles.sectionIcon} />
                                            </div>
                                            <span className={styles.sectionText}>Mẫu email</span>
                                            <span className={styles.sectionCount}>{emailTemplates.length}</span>
                                        </span>
                                        <button className={styles.sectionAddBtn} onClick={() => setNewModal('email')}><Plus size={14} /></button>
                                    </div>
                                    {emailOpen && (
                                        <div className={styles.templateList}>
                                            {emailTemplates.length === 0 && <div className={styles.sidebarLoading}>Chưa có mẫu nào</div>}
                                            {emailTemplates.map((t) => (
                                                <button key={t.id} className={`${styles.templateItem} ${selected?.type === 'email' && selected.id === t.id ? styles.active : ''}`} onClick={() => handleSelect('email', t.id)} onMouseEnter={(e) => handleMouseEnter(e, t.name)} onMouseLeave={handleMouseLeave}>
                                                    <div className={styles.tooltipWrapper}>
                                                        <Mail size={isSidebarCollapsed ? 20 : 14} className={styles.templateItemIcon} />
                                                    </div>
                                                    <span className={styles.templateName}>{t.name}</span>
                                                    {t.code && <span className={styles.templateMeta}>{t.code}</span>}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </aside>

                {/* ── Editor area ── */}
                <div className={styles.editorArea}>
                    {loadingList ? (
                        <div className={styles.editorCard} style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <SkeletonBone width={80} height={24} />
                                    <SkeletonBone width={300} height={32} />
                                </div>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <SkeletonBone width={80} height={36} />
                                    <SkeletonBone width={100} height={36} />
                                </div>
                             </div>
                             <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, marginTop: '20px' }}>
                                <SkeletonBone width="100%" height={400} />
                             </div>
                        </div>
                    ) : !selected ? (
                        <div className={styles.emptyState}>
                            <FileText size={56} className={styles.emptyStateIcon} />
                            <p className={styles.emptyStateText}>Chọn một mẫu để bắt đầu chỉnh sửa</p>
                        </div>
                    ) : (
                        <div className={styles.editorCard} style={{ position: 'relative' }}>
                            {loadingDetail && <div className={styles.loadingOverlay}><div className={styles.spinner} /></div>}

                        <div className={styles.stickyHeader}>
                            <div className={styles.editorCardHeader}>
                                <div className={styles.editorCardHeaderLeft}>
                                    <span className={`${styles.editorTypeBadge} ${selected.type === 'contract' ? styles.contract : styles.email}`}>
                                        {selected.type === 'contract' ? <><FileText size={11} /> Hợp đồng</> : <><Mail size={11} /> Email</>}
                                    </span>
                                    <input className={styles.editorNameInput} value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Tên mẫu..." />
                                </div>
                                <div className={styles.editorCardHeaderRight}>
                                    <button className={styles.btnDelete} onClick={() => setDeleteModal(true)}><Trash2 size={14} /> Xóa</button>
                                    <button className={styles.btnSave} onClick={handleSave} disabled={saving}><Save size={14} /> {saving ? 'Đang lưu...' : 'Lưu'}</button>
                                </div>
                            </div>

                            {selected.type === 'email' && (
                                <div className={styles.subjectRow}>
                                    <span className={styles.subjectLabel}>Tiêu đề</span>
                                    <input className={styles.subjectInput} value={editSubject} onChange={(e) => setEditSubject(e.target.value)} placeholder="Nhập tiêu đề email..." />
                                </div>
                            )}
                        </div>

                            <div className={styles.editorContent}>
                                <RichTextEditor
                                    content={editorContent}
                                    onChange={handleEditorChange}
                                    placeholder="Nhập nội dung mẫu..."
                                    editorRef={editorRef}
                                    placeholders={filteredPlaceholders}
                                    fetchPlaceholders={handleFetchPlaceholders}
                                    onPlaceholderSelect={(key, label) => {
                                        console.log('Selected placeholder:', key, label);
                                    }}
                                    zoom={zoomLevel / 100}
                                />
                            </div>

                            {/* ── Status Bar ── */}
                            <div className={styles.statusBar}>
                                <div className={styles.viewModes}>
                                    <button className={`${styles.viewBtn} ${viewMode === 'read' ? styles.active : ''}`} onClick={() => setViewMode('read')}>
                                        <BookOpen size={15} />
                                    </button>
                                    <button className={`${styles.viewBtn} ${viewMode === 'print' ? styles.active : ''}`} onClick={() => setViewMode('print')}>
                                        <FileText size={15} />
                                    </button>
                                    <button className={`${styles.viewBtn} ${viewMode === 'web' ? styles.active : ''}`} onClick={() => setViewMode('web')}>
                                        <Globe size={15} />
                                    </button>
                                </div>
                                <div className={styles.zoomControls}>
                                    <button className={styles.zoomBtn} onClick={() => setZoomLevel(prev => Math.max(10, prev - 10))}>
                                        <Minus size={14} />
                                    </button>
                                    <div className={styles.zoomSliderContainer}>
                                        <input
                                            type="range"
                                            min="10"
                                            max="500"
                                            value={zoomLevel}
                                            onChange={(e) => setZoomLevel(parseInt(e.target.value))}
                                            className={styles.zoomSlider}
                                        />
                                        <div className={styles.zoomMark} style={{ left: '18%' }} />
                                    </div>
                                    <button className={styles.zoomBtn} onClick={() => setZoomLevel(prev => Math.min(500, prev + 10))}>
                                        <Plus size={14} />
                                    </button>
                                    <span className={styles.zoomValue} onClick={() => setZoomLevel(100)}>{zoomLevel}%</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Modals ── */}
                {newModal && <NewTemplateModal type={newModal} onClose={() => setNewModal(null)} onCreate={handleCreate} />}
                {deleteModal && currentName && <ConfirmDeleteModal name={currentName} onClose={() => setDeleteModal(false)} onConfirm={handleDelete} />}

                {tooltipData && (
                    <div className={styles.fixedTooltip} style={{ top: tooltipData.top, left: tooltipData.left }}>
                        <span className={styles.tooltipArrow} />
                        {tooltipData.text}
                    </div>
                )}
            </div>
        </AdminPageLayout>
    );
}
