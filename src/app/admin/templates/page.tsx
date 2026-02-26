'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
    FileText,
    Mail,
    Plus,
    Save,
    Trash2,
    ChevronDown,
    ChevronRight,
    FileEdit,
    X,
    Variable,
} from 'lucide-react';
import contractTemplateService, {
    ContractTemplate,
    CreateContractTemplateRequest,
    UpdateContractTemplateRequest,
} from '@/services/contract-template.service';
import emailTemplateService, {
    EmailTemplate,
    CreateEmailTemplateRequest,
    UpdateEmailTemplateRequest,
} from '@/services/email-template.service';
import placeholderService, { PlaceholderItem } from '@/services/placeholder.service';
import RichTextEditor from '@/components/ui/rich-text-editor/RichTextEditor';
import { insertPlaceholder, convertPlaceholdersToChips, convertChipsToPlaceholders } from '@/components/ui/rich-text-editor/PlaceholderChip';
import styles from './templates.module.css';

type TemplateType = 'contract' | 'email';

interface SelectedTemplate {
    type: TemplateType;
    id: number;
}

// ── Placeholder Dropdown ───────────────────────────────────────────────────────
function PlaceholderDropdown({
    placeholders,
    searchText,
    onSelect,
    onClose,
}: {
    placeholders: PlaceholderItem[];
    searchText: string;
    onSelect: (p: PlaceholderItem) => void;
    onClose: () => void;
}) {
    const filtered = useMemo(() => {
        if (!searchText) return placeholders.slice(0, 20);
        const q = searchText.toLowerCase();
        return placeholders.filter(
            (p) => p.key.toLowerCase().includes(q) || p.label.toLowerCase().includes(q)
        ).slice(0, 20);
    }, [placeholders, searchText]);

    const grouped = useMemo(() => {
        const groups: Record<string, PlaceholderItem[]> = {};
        filtered.forEach((p) => {
            const table = p.table || 'Other';
            if (!groups[table]) groups[table] = [];
            groups[table].push(p);
        });
        return groups;
    }, [filtered]);

    return (
        <div className={styles.placeholderDropdown}>
            <div className={styles.placeholderDropdownHeader}>
                <span className={styles.placeholderSearchLabel}>Chọn trường dữ liệu</span>
                <button className={styles.placeholderCloseBtn} onClick={onClose}><X size={14} /></button>
            </div>
            <div className={styles.placeholderDropdownList}>
                {Object.keys(grouped).length === 0 ? (
                    <div className={styles.placeholderEmpty}>Không tìm thấy</div>
                ) : (
                    Object.entries(grouped).map(([table, items]) => (
                        <div key={table} className={styles.placeholderGroup}>
                            <div className={styles.placeholderGroupTitle}>{table}</div>
                            {items.map((p) => (
                                <button key={p.key} className={styles.placeholderItem} onClick={() => onSelect(p)}>
                                    <span className={styles.placeholderItemKey}>{p.key}</span>
                                    <span className={styles.placeholderItemLabel}>{p.label}</span>
                                </button>
                            ))}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

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
                <p className={styles.confirmText}>Bạn có chắc muốn xóa mẫu <strong>"{name}"</strong>?</p>
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
    const [contractTemplates, setContractTemplates] = useState<ContractTemplate[]>([]);
    const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
    const [placeholders, setPlaceholders] = useState<PlaceholderItem[]>([]);
    const [loadingList, setLoadingList] = useState(true);
    const editorRef = useRef<any>(null);
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

    const [showPlaceholderPicker, setShowPlaceholderPicker] = useState(false);

    // ── Fetch data ──
    const fetchAll = useCallback(async () => {
        setLoadingList(true);
        try {
            const [contracts, emails, placeholderData] = await Promise.all([
                contractTemplateService.getAll().catch(() => [] as ContractTemplate[]),
                emailTemplateService.getAll().catch(() => [] as EmailTemplate[]),
                placeholderService.getAll().catch(() => [] as any),
            ]);
            setContractTemplates(Array.isArray(contracts) ? contracts.filter((t: any) => t.isActive !== false) : []);
            setEmailTemplates(Array.isArray(emails) ? emails.filter((t: any) => t.isActive !== false) : []);

            // Filter placeholders by type
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
                // Neu la full HTML document, luu wrapper de wrap lai khi save
                const body = data.body || '';
                const bm = body.match(/([\s\S]*?<body[^>]*>)([\s\S]*?)(<\/body>[\s\S]*)/i);
                htmlWrapperRef.current = bm ? { before: bm[1], after: bm[3] } : null;
                setEditorContent(convertPlaceholdersToChips(body, placeholders));
            }
        } catch (err) { console.error('Error loading template:', err); }
        finally { setLoadingDetail(false); }
    }, [selected]);

    // Handle editor content change
    const handleEditorChange = useCallback((html: string) => {
        setEditorContent(html);
    }, []);

    // Insert placeholder chip vao editor
    const handlePlaceholderSelect = useCallback((p: PlaceholderItem) => {
        insertPlaceholder(editorRef.current, p.key, p.label);
        setShowPlaceholderPicker(false);
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
                // Neu content goc la full HTML document, wrap lai truoc khi save
                let bodyToSave = convertChipsToPlaceholders(editorContent);
                if (htmlWrapperRef.current) {
                    bodyToSave = htmlWrapperRef.current.before + bodyToSave + htmlWrapperRef.current.after;
                }
                const payload: UpdateEmailTemplateRequest = { name: editName, subject: editSubject, body: bodyToSave };
                const updated = await emailTemplateService.update(selected.id, payload);
                setActiveEmail(updated);
                setEmailTemplates((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
            }
        } catch (err) { console.error('Error saving:', err); }
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
        } catch (err) { console.error('Error deleting:', err); }
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

    // Filter placeholders by template type
    const filteredPlaceholders = useMemo(() => {
        const typeValue = selected?.type === 'contract' ? 1 : 2;
        return placeholders.filter(p => p.isActive && (p.templateType === typeValue || p.templateType === 0));
    }, [placeholders, selected]);

    return (
        <div className={styles.pageContainer}>
            {/* ── Sidebar ── */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <p className={styles.sidebarTitle}>Quản lý mẫu</p>
                    <p className={styles.sidebarSubtitle}>Mẫu hợp đồng & email hệ thống</p>
                </div>
                <div className={styles.sidebarScroll}>
                    {loadingList ? (
                        <div className={styles.sidebarLoading}>Đang tải...</div>
                    ) : (
                        <>
                            <div className={styles.section}>
                                <div className={styles.sectionHeader}>
                                    <span className={styles.sectionLabel} onClick={() => setContractOpen((v) => !v)}>
                                        {contractOpen ? <ChevronDown size={13} className={styles.sectionIcon} /> : <ChevronRight size={13} className={styles.sectionIcon} />}
                                        <FileText size={13} className={styles.sectionIcon} />
                                        Mẫu hợp đồng
                                        <span className={styles.sectionCount}>{contractTemplates.length}</span>
                                    </span>
                                    <button className={styles.sectionAddBtn} title="Tạo mẫu hợp đồng mới" onClick={() => setNewModal('contract')}><Plus size={14} /></button>
                                </div>
                                {contractOpen && (
                                    <div className={styles.templateList}>
                                        {contractTemplates.length === 0 && <div className={styles.sidebarLoading}>Chưa có mẫu nào</div>}
                                        {contractTemplates.map((t) => (
                                            <button key={t.id} className={`${styles.templateItem} ${selected?.type === 'contract' && selected.id === t.id ? styles.active : ''}`} onClick={() => handleSelect('contract', t.id)}>
                                                <FileEdit size={14} className={styles.templateItemIcon} />
                                                <span className={styles.templateName}>{t.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className={styles.section}>
                                <div className={styles.sectionHeader}>
                                    <span className={styles.sectionLabel} onClick={() => setEmailOpen((v) => !v)}>
                                        {emailOpen ? <ChevronDown size={13} className={styles.sectionIcon} /> : <ChevronRight size={13} className={styles.sectionIcon} />}
                                        <Mail size={13} className={styles.sectionIcon} />
                                        Mẫu email
                                        <span className={styles.sectionCount}>{emailTemplates.length}</span>
                                    </span>
                                    <button className={styles.sectionAddBtn} title="Tạo mẫu email mới" onClick={() => setNewModal('email')}><Plus size={14} /></button>
                                </div>
                                {emailOpen && (
                                    <div className={styles.templateList}>
                                        {emailTemplates.length === 0 && <div className={styles.sidebarLoading}>Chưa có mẫu nào</div>}
                                        {emailTemplates.map((t) => (
                                            <button key={t.id} className={`${styles.templateItem} ${selected?.type === 'email' && selected.id === t.id ? styles.active : ''}`} onClick={() => handleSelect('email', t.id)}>
                                                <Mail size={14} className={styles.templateItemIcon} />
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
                {!selected ? (
                    <div className={styles.emptyState}>
                        <FileText size={56} className={styles.emptyStateIcon} />
                        <p className={styles.emptyStateText}>Chọn một mẫu để bắt đầu chỉnh sửa</p>
                    </div>
                ) : (
                    <div className={styles.editorCard} style={{ position: 'relative' }}>
                        {loadingDetail && <div className={styles.loadingOverlay}><div className={styles.spinner} /></div>}

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

                        <div className={styles.editorContent}>
                            <RichTextEditor
                                content={editorContent}
                                onChange={handleEditorChange}
                                placeholder="Nhập nội dung mẫu..."
                                editorRef={editorRef}
                                placeholders={filteredPlaceholders}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* ── Modals ── */}
            {newModal && <NewTemplateModal type={newModal} onClose={() => setNewModal(null)} onCreate={handleCreate} />}
            {deleteModal && currentName && <ConfirmDeleteModal name={currentName} onClose={() => setDeleteModal(false)} onConfirm={handleDelete} />}
        </div>
    );
}
