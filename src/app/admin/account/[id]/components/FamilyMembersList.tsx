'use client';

import {
  ReactFlow,
  Background,
  Controls,
  Panel,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  MarkerType,
  Handle,
  Position,
  Node,
  BackgroundVariant,
  SelectionMode,
  ReactFlowProvider
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { format } from 'date-fns';
import {
  UserPlus,
  Heart,
  Baby,
  Users,
  Phone,
  Calendar as CalendarIcon,
  Trash2,
  Copy,
  PlusCircle,
  X,
  Upload,
  User,
  MapPin,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Venus,
  Mars,
  Camera,
  CheckCircle2
} from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React, { useCallback, useEffect, useState, useRef } from 'react';

import { DatePicker } from '@/app/admin/work-schedule/components/DatePicker';
import familyProfileService from '@/services/family-profile.service';
import type { FamilyProfile, CreateFamilyProfileRequest } from '@/types/family-profile';
import { cn } from '@/lib/utils';

import styles from './family-members-list.module.css';

interface FamilyMembersListProps {
  familyProfiles: FamilyProfile[];
  loading?: boolean;
}

// ── Custom Node Component ──
const FamilyMemberNode = ({ data }: { data: { profile: FamilyProfile } }) => {
  const profile = data.profile;
  const isHead = profile.memberTypeName === 'Head of Family';
  const fullName = profile.fullName || 'Chưa cập nhật';
  const avatarUrl = profile.avatarUrl;

  const getIcon = () => {
    switch (profile.memberTypeName) {
      case 'Head of Family': return <Users size={16} color="#6d28d9" />;
      case 'Mom': return <Heart size={16} color="#ec4899" />;
      case 'Baby': return <Baby size={16} color="#3b82f6" />;
      default: return <Users size={16} color="#6b7280" />;
    }
  };

  const color = isHead ? '#6d28d9' : (profile.memberTypeName === 'Mom' ? '#ec4899' : '#3b82f6');

  return (
    <div className={styles.flowNode} style={{ borderColor: color }}>
      <Handle type="target" position={Position.Top} id="t-1" style={{ left: '20%' }} className={styles.multiHandle} />
      <Handle type="target" position={Position.Top} id="t-2" style={{ left: '50%' }} className={styles.multiHandle} />
      <Handle type="target" position={Position.Top} id="t-3" style={{ left: '80%' }} className={styles.multiHandle} />

      <Handle type="source" position={Position.Bottom} id="b-1" style={{ left: '20%' }} className={styles.multiHandle} />
      <Handle type="source" position={Position.Bottom} id="b-2" style={{ left: '50%' }} className={styles.multiHandle} />
      <Handle type="source" position={Position.Bottom} id="b-3" style={{ left: '80%' }} className={styles.multiHandle} />

      <Handle type="target" position={Position.Left} id="l-1" style={{ top: '30%' }} className={styles.multiHandle} />
      <Handle type="target" position={Position.Left} id="l-2" style={{ top: '70%' }} className={styles.multiHandle} />

      <Handle type="source" position={Position.Right} id="r-1" style={{ top: '30%' }} className={styles.multiHandle} />
      <Handle type="source" position={Position.Right} id="r-2" style={{ top: '70%' }} className={styles.multiHandle} />

      <div className={styles.flowNodeHeader}>
        {avatarUrl ? (
          <Image src={avatarUrl} alt={fullName} width={40} height={40} className={styles.flowNodeAvatar} unoptimized />
        ) : (
          <div className={styles.flowNodeIcon} style={{ backgroundColor: `${color}15` }}>
            {getIcon()}
          </div>
        )}
        <div className={styles.flowNodeInfo}>
          <span className={styles.flowNodeType} style={{ color }}>{profile.memberTypeName === 'Head of Family' ? 'Chủ hộ' : (profile.memberTypeName === 'Mom' ? 'Mẹ' : (profile.memberTypeName === 'Baby' ? 'Bé' : 'Thành viên'))}</span>
          <h4 className={styles.flowNodeName}>{fullName}</h4>
        </div>
      </div>

      <div className={styles.flowNodeBody}>
        <div className={styles.flowNodeDetail}>
          <Phone size={10} />
          <span>{profile.phoneNumber || 'N/A'}</span>
        </div>
        <div className={styles.flowNodeDetail}>
          <CalendarIcon size={10} />
          <span>{profile.dateOfBirth || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
};

const nodeTypes = {
  familyMember: FamilyMemberNode,
};

// ── Custom Dropdown Component ──
const CustomSelect = <T extends string | number>({
  options,
  value,
  onChange,
  label,
  icon,
  className,
  required
}: {
  options: { value: T, label: string, icon?: React.ReactNode }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
  icon?: React.ReactNode;
  className?: string;
  required?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as HTMLElement)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={cn(styles.customSelectOuter, className)} ref={containerRef}>
      {label && (
        <label className={styles.formGroupLabel}>
          {label} {required && <span className={styles.requiredAsterisk}>*</span>}
        </label>
      )}
      <div
        className={`${styles.customSelectHeader} ${isOpen ? styles.open : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={styles.selectSelectedInfo}>
          {icon && <span className={styles.selectIcon}>{icon}</span>}
          <span>{selectedOption?.label || 'Chọn...'}</span>
        </div>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </div>

      {isOpen && (
        <div className={styles.customSelectOptions}>
          {options.map((opt) => (
            <div
              key={opt.value}
              className={`${styles.customSelectOption} ${opt.value === value ? styles.active : ''}`}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
            >
              {opt.icon && <span className={styles.optIcon}>{opt.icon}</span>}
              <span>{opt.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Custom Date Picker Component ──
const CustomDatePicker = ({
  label,
  value,
  onChange,
  required
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) => {
  const [open, setOpen] = useState(false);

  const dateValue = React.useMemo(() => {
    if (!value) return null;
    const [y, m, d] = value.split('-').map(Number);
    return new Date(y, m - 1, d);
  }, [value]);

  const displayValue = React.useMemo(() => {
    if (!dateValue) return 'Chọn ngày sinh...';
    return format(dateValue, 'dd/MM/yyyy');
  }, [dateValue]);

  return (
    <div className={styles.formGroup}>
      <label>{label} {required && <span className={styles.requiredAsterisk}>*</span>}</label>
      <div className={styles.datePickerRelative}>
        <div
          className={cn(styles.inputWrapper, styles.dateTrigger, open && styles.dateTriggerOpen)}
          onClick={(e) => {
            e.stopPropagation();
            setOpen(!open);
          }}
        >
          <CalendarIcon size={16} />
          <span className={cn(styles.dateText, !value && styles.placeholder)}>
            {displayValue}
          </span>
        </div>

        {open && (
          <div className={styles.sharedDatePickerWrapper}>
            <DatePicker
              value={dateValue}
              title=""
              side="bottom"
              onChange={(d) => {
                if (d) {
                  const y = d.getFullYear();
                  const m = String(d.getMonth() + 1).padStart(2, '0');
                  const day = String(d.getDate()).padStart(2, '0');
                  onChange(`${y}-${m}-${day}`);
                } else {
                  onChange('');
                }
                setOpen(false);
              }}
              onClose={() => setOpen(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// ── Circular Avatar Upload Component ──
const AvatarUpload = ({
  file,
  onFileChange,
  memberName,
  memberTypeName
}: {
  file: File | null;
  onFileChange: (f: File | null) => void;
  memberName?: string;
  memberTypeName?: string;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const previewRef = useRef<string | null>(null);

  useEffect(() => {
    if (!file) {
      if (previewRef.current !== null) {
        queueMicrotask(() => {
          setPreview(null);
          previewRef.current = null;
        });
      }
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    queueMicrotask(() => {
      setPreview(objectUrl);
      previewRef.current = objectUrl;
    });
    return () => {
      URL.revokeObjectURL(objectUrl);
      previewRef.current = null;
    };
  }, [file]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setIsDragging(true);
    else if (e.type === 'dragleave') setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileChange(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className={styles.avatarSidebarSection}>
      <div
        className={cn(
          styles.avatarSidebarCircle,
          isDragging && styles.isDragging,
          preview && styles.hasPreview
        )}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {preview ? (
          <Image src={preview} alt="Avatar Preview" width={100} height={100} className={styles.avatarPreviewImg} unoptimized />
        ) : (
          <div className={styles.avatarPlaceholder}>
            <Camera size={28} strokeWidth={1.5} />
            <span>Kéo thả ảnh</span>
          </div>
        )}

        <div className={styles.avatarOverlay}>
          <Upload size={14} />
          <span>Sửa ảnh</span>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className={styles.hiddenInput}
          onChange={(e) => onFileChange(e.target.files?.[0] || null)}
        />
      </div>
      <div className={styles.sidebarInfo}>
        <h4 className={styles.sidebarNamePreview}>{memberName || 'Đang cập nhật...'}</h4>
        <div className={styles.sidebarRoleBadge}>
          {memberTypeName}
        </div>
      </div>
    </div>
  );
};

// ── Create Member Modal Component ──
const CreateMemberModal = ({
  isOpen,
  onClose,
  accountId,
  onCreated
}: {
  isOpen: boolean;
  onClose: () => void;
  accountId: string;
  onCreated: (newProfile: FamilyProfile) => void;
}) => {
  const [formData, setFormData] = useState<CreateFamilyProfileRequest>({
    accountId: accountId,
    memberTypeId: 1,
    fullName: '',
    dateOfBirth: '',
    gender: 'Male',
    address: '',
    phoneNumber: '',
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // CRITICAL: Source of truth for accountId is the prop (which comes from URL params)
  useEffect(() => {
    if (accountId) {
      setFormData(prev => ({ ...prev, accountId: accountId }));
    }
  }, [accountId, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await familyProfileService.createFamilyProfile({
        ...formData,
        avatar: avatarFile || undefined
      });
      onCreated(result);
      setFormData(prev => ({
        ...prev,
        fullName: '',
        dateOfBirth: '',
        gender: 'Male',
        address: '',
        phoneNumber: '',
      }));
      setAvatarFile(null);
      onClose();
    } catch (error) {
      console.error('Lỗi khi tạo thành viên:', error);
      alert('Không thể tạo thành viên. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  const memberTypeOptions = [
    { value: 1, label: 'Chủ hộ (Head of Family)', icon: <ShieldCheck size={14} color="#6d28d9" /> },
    { value: 2, label: 'Mẹ (Mom)', icon: <Heart size={14} color="#ec4899" /> },
    { value: 3, label: 'Bé (Baby)', icon: <Baby size={14} color="#3b82f6" /> },
  ];

  const genderOptions = [
    { value: 'Male', label: 'Nam', icon: <Mars size={14} color="#3b82f6" /> },
    { value: 'Female', label: 'Nữ', icon: <Venus size={14} color="#ec4899" /> },
  ];

  const selectedTypeName = memberTypeOptions.find(opt => opt.value === formData.memberTypeId)?.label.split('(')[0].trim() || 'Thành viên';

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.sidebarModalContent} onClick={(e) => e.stopPropagation()}>
        {/* Left Sidebar */}
        <div className={styles.modalSidebar}>
          <div className={styles.sidebarHeader}>
            <UserPlus size={18} color="#fa8314" />
            <span>Hồ sơ mới</span>
          </div>

          <AvatarUpload
            file={avatarFile}
            onFileChange={setAvatarFile}
            memberName={formData.fullName}
            memberTypeName={selectedTypeName}
          />

          <div className={styles.sidebarStatusNote}>
            <CheckCircle2 size={12} /> Thông tin được bảo mật
          </div>
        </div>

        {/* Right Content */}
        <div className={styles.modalMainContent}>
          <div className={styles.modalStaticHeader}>
            <h3>Thêm thành viên mới</h3>
            <button className={styles.modalCloseIconBtn} onClick={onClose} title="Đóng">
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className={styles.createFormBase}>
            <div className={styles.formGrid}>
              <div className={styles.formGroupFull}>
                <CustomSelect
                  label="Loại thành viên"
                  required
                  options={memberTypeOptions}
                  value={formData.memberTypeId}
                  onChange={(v) => setFormData({ ...formData, memberTypeId: v })}
                  icon={<ShieldCheck size={14} />}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Họ và tên <span className={styles.requiredAsterisk}>*</span></label>
                <div className={styles.inputWrapper}>
                  <User size={14} />
                  <input
                    type="text"
                    placeholder="Nhập tên đầy đủ"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <CustomSelect
                  label="Giới tính"
                  required
                  options={genderOptions}
                  value={formData.gender}
                  onChange={(v) => setFormData({ ...formData, gender: v })}
                  icon={<User size={14} />}
                />
              </div>

              <div className={styles.formGroup}>
                <CustomDatePicker
                  label="Ngày sinh"
                  required
                  value={formData.dateOfBirth}
                  onChange={(v) => setFormData({ ...formData, dateOfBirth: v })}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Số điện thoại <span className={styles.requiredAsterisk}>*</span></label>
                <div className={styles.inputWrapper}>
                  <Phone size={14} />
                  <input
                    type="tel"
                    placeholder="Ví dụ: 0987xxx"
                    required
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  />
                </div>
              </div>

              <div className={styles.formGroupFull}>
                <label>Địa chỉ <span className={styles.requiredAsterisk}>*</span></label>
                <div className={styles.inputWrapper}>
                  <MapPin size={14} />
                  <input
                    type="text"
                    placeholder="Nhập địa chỉ liên lạc"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className={styles.formActionsFixed}>
              <button type="button" className={styles.cancelBtn} onClick={onClose}>Hủy bỏ</button>
              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? 'Đang lưu...' : 'Lưu thành viên'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// ── Context Menu Component ──
const ContextMenu = ({
  top,
  left,
  onClose,
  actions,
  node
}: {
  top: number;
  left: number;
  onClose: () => void;
  actions: {
    onDelete: (n: Node) => void;
    onDuplicate: (n: Node) => void;
    onAddDependent: (n: Node) => void;
  };
  node: Node;
}) => {
  return (
    <div className={styles.contextMenu} style={{ top, left }} onClick={(e) => e.stopPropagation()}>
      <div className={styles.contextMenuItem} onClick={() => { actions.onAddDependent(node); onClose(); }}>
        <PlusCircle size={14} /> <span>Thêm người thân</span>
      </div>
      <div className={styles.contextMenuDivider} />
      <div className={styles.contextMenuItem} onClick={() => { actions.onDuplicate(node); onClose(); }}>
        <Copy size={14} /> <span>Sao chép Node</span>
      </div>
      <div className={styles.contextMenuDivider} />
      <div className={`${styles.contextMenuItem} ${styles.danger}`} onClick={() => { actions.onDelete(node); onClose(); }}>
        <Trash2 size={14} /> <span>Xóa thành viên</span>
      </div>
    </div>
  );
};

const MindmapContent: React.FC<FamilyMembersListProps> = ({ familyProfiles, loading }) => {
  const params = useParams();
  const coreAccountId = params.id as string;

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [copiedNodes, setCopiedNodes] = useState<Node[]>([]);
  const [menu, setMenu] = useState<{ top: number; left: number; node: Node } | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const historyRef = useRef<{ nodes: Node[], edges: Edge[] }[]>([]);

  // Initialize
  useEffect(() => {
    if (familyProfiles.length > 0 && nodes.length === 0) {
      const initialNodes: Node[] = familyProfiles.map((profile, index) => ({
        id: String(profile.id),
        type: 'familyMember',
        data: { profile },
        position: { x: 250 * (index % 3), y: 150 * Math.floor(index / 3) },
      }));

      const initialEdges: Edge[] = [];
      const head = familyProfiles.find((p: FamilyProfile) => p.memberTypeName === 'Head of Family');

      if (head) {
        familyProfiles.forEach((p: FamilyProfile) => {
          if (p.memberTypeName !== 'Head of Family') {
            initialEdges.push({
              id: `e-${head.id}-${p.id}`,
              source: String(head.id),
              sourceHandle: 'b-2',
              target: String(p.id),
              targetHandle: 't-2',
              animated: true,
              style: { stroke: '#fa8314', strokeWidth: 2 },
              markerEnd: { type: MarkerType.ArrowClosed, color: '#fa8314' },
            });
          }
        });
      }

      setNodes(initialNodes);
      setEdges(initialEdges);
      historyRef.current = [{ nodes: initialNodes, edges: initialEdges }];
    }
  }, [familyProfiles, setNodes, setEdges, nodes.length]);

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.preventDefault();
      setMenu({
        top: event.clientY,
        left: event.clientX,
        node: node,
      });
    },
    []
  );

  const onClick = useCallback(() => setMenu(null), []);

  const handleCreated = (newProfile: FamilyProfile) => {
    const newNode: Node = {
      id: String(newProfile.id),
      type: 'familyMember',
      data: { profile: newProfile },
      position: { x: 150, y: 150 },
    };

    setNodes((nds) => [...nds, newNode]);

    // AUTO-CONNECT: If not Head of Family, connect to existing Head
    if (newProfile.memberTypeName !== 'Head of Family') {
      const headNode = nodes.find(n => (n.data.profile as FamilyProfile).memberTypeName === 'Head of Family');
      if (headNode) {
        setEdges((eds) => [
          ...eds,
          {
            id: `e-${headNode.id}-${newNode.id}`,
            source: headNode.id,
            sourceHandle: 'b-2',
            target: newNode.id,
            targetHandle: 't-2',
            animated: true,
            style: { stroke: '#fa8314', strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#fa8314' },
          }
        ]);
      }
    }
  };

  const handleDelete = async (node: Node) => {
    if (confirm('Bạn có chắc chắn muốn xóa thành viên này?')) {
      try {
        await familyProfileService.deleteFamilyProfile(Number(node.id));
        setNodes((nds) => nds.filter((n) => n.id !== node.id));
        setEdges((eds) => eds.filter((e) => e.source !== node.id && e.target !== node.id));
      } catch (error) {
        alert('Lỗi khi xóa thành viên. Vui lòng thử lại sau.');
        console.error('Lỗi khi xóa:', error);
      }
    }
  };

  const handleDuplicate = (node: Node) => {
    historyRef.current.push({ nodes: [...nodes], edges: [...edges] });
    const newNodeId = `node-${Date.now()}`;
    setNodes((nds) => [
      ...nds,
      { ...node, id: newNodeId, position: { x: node.position.x + 40, y: node.position.y + 40 }, selected: false }
    ]);
  };

  const handleAddDependent = (_node: Node) => {
    setIsCreateModalOpen(true);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'c') {
        const selected = nodes.filter((node) => node.selected);
        if (selected.length > 0) setCopiedNodes(selected);
      }
      if (event.ctrlKey && event.key === 'v') {
        if (copiedNodes.length > 0) {
          historyRef.current.push({ nodes: [...nodes], edges: [...edges] });
          const newNodes = copiedNodes.map(node => ({
            ...node,
            id: `node-${Date.now()}-${Math.random()}`,
            position: { x: node.position.x + 30, y: node.position.y + 30 },
            selected: false,
          }));
          setNodes((nds) => [...nds, ...newNodes]);
        }
      }
      if (event.ctrlKey && event.key === 'z') {
        if (historyRef.current.length > 0) {
          const prevState = historyRef.current.pop();
          if (prevState) {
            setNodes(prevState.nodes);
            setEdges(prevState.edges);
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nodes, edges, copiedNodes, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => {
      historyRef.current.push({ nodes: [...nodes], edges: [...edges] });
      setEdges((eds) => addEdge({
        ...params,
        animated: true,
        style: { stroke: '#fa8314', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#fa8314' }
      }, eds));
    },
    [setEdges, nodes, edges]
  );

  if (loading) return <div className={styles.loadingArea}>Đang tải sơ đồ mindmap...</div>;

  return (
    <div className={styles.flowWrapper} onClick={onClick}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeContextMenu={onNodeContextMenu}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
        selectionMode={SelectionMode.Full}
        multiSelectionKeyCode="Shift"
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={2} color="#94a3b8" bgColor="#fcfcfd" />
        <Controls />
        <Panel position="top-right">
          <div className={styles.flowPanel}>
            <button className={styles.panelBtn} onClick={(e) => {
              e.stopPropagation();
              setIsCreateModalOpen(true);
            }}>
              <UserPlus size={14} /> <span>Thêm ô mới</span>
            </button>
          </div>
        </Panel>
        <Panel position="top-left">
          <div className={styles.flowTitle}>Sơ đồ mối quan hệ</div>
        </Panel>
        {menu && (
          <ContextMenu
            {...menu}
            onClose={() => setMenu(null)}
            actions={{
              onDelete: handleDelete,
              onDuplicate: handleDuplicate,
              onAddDependent: handleAddDependent
            }}
          />
        )}
      </ReactFlow>

      {/* Create Member Modal */}
      <CreateMemberModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        accountId={coreAccountId}
        onCreated={handleCreated}
      />
    </div>
  );
};

export const FamilyMembersList: React.FC<FamilyMembersListProps> = (props) => (
  <ReactFlowProvider>
    <MindmapContent {...props} />
  </ReactFlowProvider>
);
