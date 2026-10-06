import { useState, useMemo } from 'react';
import { useTodo } from '../context/TodoContext';
import { IconPicker } from '../components/IconPicker';
import { encryptText, decryptText } from '../utils/crypto';
import {
  Plus,
  Search,
  Lock,
  Unlock,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  KeyRound,
  FileText,
  Calendar,
  X,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';

export const NotesPage = () => {
  const { notes, addNote, updateNote, removeNote } = useTodo();

  const [searchQuery, setSearchQuery] = useState('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formIcon, setFormIcon] = useState('📝');
  const [formIsLocked, setFormIsLocked] = useState(false);
  const [formPassword, setFormPassword] = useState('');
  const [formConfirmPassword, setFormConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Unlock Modal State
  const [unlockTargetNote, setUnlockTargetNote] = useState(null);
  const [unlockPassword, setUnlockPassword] = useState('');
  const [unlockError, setUnlockError] = useState('');
  const [showUnlockPassword, setShowUnlockPassword] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);

  // View / Detail Modal State (Decrypted or Unlocked Note)
  const [viewingNote, setViewingNote] = useState(null);

  // Filter notes based on search query
  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes;
    const query = searchQuery.toLowerCase();
    return notes.filter(note => {
      const matchTitle = note.title?.toLowerCase().includes(query);
      // Only search inside content if note is not locked
      const matchContent = !note.isLocked && note.content?.toLowerCase().includes(query);
      return matchTitle || matchContent;
    });
  }, [notes, searchQuery]);

  // Open editor for new note
  const handleOpenCreate = () => {
    setEditingNoteId(null);
    setFormTitle('');
    setFormContent('');
    setFormIcon('📝');
    setFormIsLocked(false);
    setFormPassword('');
    setFormConfirmPassword('');
    setFormError('');
    setShowPassword(false);
    setIsEditorOpen(true);
  };

  // Open editor for an unlocked note
  const handleOpenEdit = (note, decryptedContent = null) => {
    setEditingNoteId(note.id);
    setFormTitle(note.title || '');
    setFormContent(decryptedContent !== null ? decryptedContent : (note.content || ''));
    setFormIcon(note.icon || '📝');
    setFormIsLocked(note.isLocked || false);
    setFormPassword('');
    setFormConfirmPassword('');
    setFormError('');
    setShowPassword(false);
    setIsEditorOpen(true);
    setViewingNote(null);
  };

  // Handle Save Note
  const handleSaveNote = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formTitle.trim()) {
      setFormError('Judul catatan wajib diisi.');
      return;
    }

    if (formIsLocked) {
      if (!formPassword) {
        setFormError('Password diperlukan untuk mengunci catatan.');
        return;
      }
      if (formPassword !== formConfirmPassword) {
        setFormError('Konfirmasi password tidak cocok.');
        return;
      }
      if (formPassword.length < 3) {
        setFormError('Password minimal 3 karakter.');
        return;
      }
    }

    setIsProcessing(true);

    try {
      if (formIsLocked) {
        // Encrypt content with user password using AES-256-GCM + PBKDF2
        const encrypted = await encryptText(formContent, formPassword);
        const notePayload = {
          title: formTitle.trim(),
          icon: formIcon || '📝',
          isLocked: true,
          content: '', // Plaintext is NOT stored
          cipherText: encrypted.cipherText,
          salt: encrypted.salt,
          iv: encrypted.iv
        };

        if (editingNoteId) {
          updateNote(editingNoteId, notePayload);
        } else {
          addNote(notePayload);
        }
      } else {
        // Unlocked note
        const notePayload = {
          title: formTitle.trim(),
          icon: formIcon || '📝',
          isLocked: false,
          content: formContent,
          cipherText: null,
          salt: null,
          iv: null
        };

        if (editingNoteId) {
          updateNote(editingNoteId, notePayload);
        } else {
          addNote(notePayload);
        }
      }

      setIsEditorOpen(false);
    } catch (err) {
      setFormError('Gagal menyimpan catatan: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Clicking on a Note Card
  const handleCardClick = (note) => {
    if (note.isLocked) {
      // Prompt password
      setUnlockTargetNote(note);
      setUnlockPassword('');
      setUnlockError('');
      setShowUnlockPassword(false);
    } else {
      // Direct view/read
      setViewingNote({
        ...note,
        decryptedContent: note.content
      });
    }
  };

  // Handle Unlock Verification
  const handleUnlockSubmit = async (e) => {
    e.preventDefault();
    if (!unlockPassword) {
      setUnlockError('Masukkan password!');
      return;
    }

    setIsUnlocking(true);
    setUnlockError('');

    try {
      const decrypted = await decryptText(
        unlockTargetNote.cipherText,
        unlockTargetNote.salt,
        unlockTargetNote.iv,
        unlockPassword
      );

      // Successfully decrypted!
      setViewingNote({
        ...unlockTargetNote,
        decryptedContent: decrypted
      });
      setUnlockTargetNote(null);
      setUnlockPassword('');
    } catch (err) {
      setUnlockError(err.message || 'Password salah!');
    } finally {
      setIsUnlocking(false);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '30px' }}>
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={28} color="var(--accent-color)" /> Catatan
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Simpan catatan penting secara aman dengan perlindungan enkripsi kata sandi.
          </p>
        </div>
        <button
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          onClick={handleOpenCreate}
        >
          <Plus size={20} /> Tambah Catatan
        </button>
      </div>

      {/* Search & Info Bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            type="text"
            placeholder="Cari judul catatan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', paddingLeft: '38px' }}
          />
        </div>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.05)', padding: '8px 14px', borderRadius: '8px' }}>
          Total: {filteredNotes.length} Catatan
        </span>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="glass" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
          <FileText size={48} style={{ opacity: 0.3, marginBottom: '14px' }} />
          <p style={{ fontSize: '1.05rem', fontWeight: '500', marginBottom: '6px' }}>
            {searchQuery ? 'Catatan tidak ditemukan.' : 'Belum ada catatan yang disimpan.'}
          </p>
          <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>
            {searchQuery ? 'Coba gunakan kata kunci pencarian yang lain.' : 'Klik tombol "+ Tambah Catatan" untuk mulai menulis.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {filteredNotes.map((note) => {
            const isLocked = note.isLocked;

            return (
              <div
                key={note.id}
                className="glass card-hover"
                style={{
                  padding: '18px',
                  borderRadius: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  position: 'relative',
                  border: isLocked ? '1px solid rgba(239, 68, 68, 0.25)' : '1px solid rgba(255, 255, 255, 0.08)',
                  background: isLocked ? 'rgba(239, 68, 68, 0.03)' : 'rgba(255, 255, 255, 0.03)',
                  transition: 'all 0.25s ease'
                }}
                onClick={() => handleCardClick(note)}
              >
                {/* Top: Icon, Title, Lock status */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>{note.icon || '📝'}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{
                      fontSize: '1.05rem',
                      fontWeight: '600',
                      marginBottom: '4px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {note.title}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      <Calendar size={12} />
                      <span>{formatDate(note.createdAt)}</span>
                    </div>
                  </div>

                  {/* Lock Indicator Badge */}
                  {isLocked ? (
                    <span
                      title="Catatan Terenkripsi"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        background: 'rgba(239, 68, 68, 0.15)',
                        color: 'var(--danger-color)',
                        border: '1px solid rgba(239, 68, 68, 0.3)'
                      }}
                    >
                      <Lock size={12} /> Terkunci
                    </span>
                  ) : (
                    <span
                      title="Catatan Biasa"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        color: 'var(--text-secondary)',
                        background: 'rgba(255, 255, 255, 0.05)'
                      }}
                    >
                      <Unlock size={12} /> Terbuka
                    </span>
                  )}
                </div>

                {/* Content Snippet / Mask */}
                <div style={{ flex: 1, marginBottom: '16px' }}>
                  {isLocked ? (
                    <div style={{
                      padding: '12px',
                      borderRadius: '8px',
                      background: 'rgba(0,0,0,0.15)',
                      border: '1px dashed rgba(239, 68, 68, 0.3)',
                      textAlign: 'center',
                      color: 'var(--text-secondary)'
                    }}>
                      <KeyRound size={20} style={{ margin: '0 auto 6px', color: 'var(--danger-color)', opacity: 0.8 }} />
                      <p style={{ fontSize: '0.82rem', fontWeight: '500' }}>Isi catatan disembunyikan</p>
                      <p style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '2px' }}>Klik untuk memasukkan password</p>
                    </div>
                  ) : (
                    <p style={{
                      fontSize: '0.88rem',
                      color: 'var(--text-secondary)',
                      lineHeight: '1.5',
                      whiteSpace: 'pre-line',
                      display: '-webkit-box',
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {note.content || <span style={{ fontStyle: 'italic', opacity: 0.6 }}>(Catatan kosong)</span>}
                    </p>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div
                  style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {!isLocked && (
                    <button
                      className="btn-icon"
                      onClick={() => handleOpenEdit(note)}
                      title="Edit Catatan"
                      style={{ padding: '6px' }}
                    >
                      <Edit2 size={16} />
                    </button>
                  )}
                  <button
                    className="btn-icon danger"
                    onClick={() => {
                      if (window.confirm(`Hapus catatan "${note.title}"?`)) {
                        removeNote(note.id);
                      }
                    }}
                    title="Hapus Catatan"
                    style={{ padding: '6px' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: Editor (Tambah / Edit Catatan) */}
      {isEditorOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            padding: '16px'
          }}
          onClick={() => !isProcessing && setIsEditorOpen(false)}
        >
          <div
            className="glass animate-fade-in"
            style={{
              width: '100%',
              maxWidth: '1160px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '24px',
              borderRadius: '16px',
              background: 'var(--card-bg, rgba(25, 25, 35, 0.95))',
              border: '1px solid rgba(255,255,255,0.1)',
              marginTop: '100px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={22} color="var(--accent-color)" />
                {editingNoteId ? 'Edit Catatan' : 'Catatan Baru'}
              </h2>
              <button
                className="btn-icon"
                onClick={() => setIsEditorOpen(false)}
                disabled={isProcessing}
                style={{ padding: '6px' }}
              >
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div style={{
                padding: '10px 14px',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.15)',
                color: 'var(--danger-color)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px'
              }}>
                <AlertCircle size={16} flexShrink={0} />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveNote} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Icon & Title */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <IconPicker value={formIcon} onChange={setFormIcon} />
                <input
                  type="text"
                  placeholder="Judul catatan..."
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  style={{ flex: 1, fontSize: '1rem', fontWeight: '600' }}
                  autoFocus
                />
              </div>

              {/* Content Textarea */}
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                  Isi Catatan
                </label>
                <textarea
                  placeholder="Tuliskan isi catatan Anda di sini..."
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  style={{
                    width: '100%',
                    minHeight: '180px',
                    fontSize: '1.2rem',
                    lineHeight: '1.6',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Lock Toggle Section */}
              <div style={{
                padding: '14px',
                borderRadius: '10px',
                background: formIsLocked ? 'rgba(239, 68, 68, 0.08)' : 'rgba(255,255,255,0.02)',
                border: formIsLocked ? '1px solid rgba(239, 68, 68, 0.25)' : '1px solid rgba(255,255,255,0.06)',
                transition: 'all 0.3s ease'
              }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', userSelect: 'none' }}>
                  <input
                    type="checkbox"
                    checked={formIsLocked}
                    onChange={(e) => {
                      setFormIsLocked(e.target.checked);
                      if (!e.target.checked) {
                        setFormPassword('');
                        setFormConfirmPassword('');
                      }
                    }}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--danger-color)' }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {formIsLocked ? <Lock size={18} color="var(--danger-color)" /> : <Unlock size={18} color="var(--text-secondary)" />}
                    <span style={{ fontWeight: '600', fontSize: '0.92rem', color: formIsLocked ? 'var(--danger-color)' : 'var(--text-primary)' }}>
                      Kunci Catatan ini (Enkripsi Kuat)
                    </span>
                  </div>
                </label>

                {formIsLocked && (
                  <div className="animate-fade-in" style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      <ShieldCheck size={14} color="#10b981" />
                      <span>Dienkripsi dengan standar militer AES-256-GCM. Catatan tidak dapat dibaca tanpa password.</span>
                    </div>

                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password catatan..."
                        value={formPassword}
                        onChange={(e) => setFormPassword(e.target.value)}
                        style={{ width: '100%', paddingRight: '40px' }}
                      />
                      <button
                        type="button"
                        className="btn-icon"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', padding: '4px' }}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>

                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Konfirmasi password..."
                      value={formConfirmPassword}
                      onChange={(e) => setFormConfirmPassword(e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  className="btn-icon"
                  onClick={() => setIsEditorOpen(false)}
                  disabled={isProcessing}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isProcessing}
                  style={{ minWidth: '110px' }}
                >
                  {isProcessing ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Masukkan Password untuk Membuka Catatan Terkunci */}
      {unlockTargetNote && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px'
          }}
          onClick={() => !isUnlocking && setUnlockTargetNote(null)}
        >
          <div
            className="glass animate-fade-in"
            style={{
              width: '100%',
              maxWidth: '420px',
              padding: '24px',
              borderRadius: '16px',
              background: 'var(--card-bg, rgba(25, 25, 35, 0.95))',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              textAlign: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.15)',
              color: 'var(--danger-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <Lock size={28} />
            </div>

            <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '6px' }}>
              Catatan Terkunci
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Masukkan password untuk membuka dan mendekripsi <br />
              <strong style={{ color: 'var(--text-primary)' }}>"{unlockTargetNote.title}"</strong>
            </p>

            {unlockError && (
              <div style={{
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.15)',
                color: 'var(--danger-color)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                fontSize: '0.82rem',
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                justifyContent: 'center'
              }}>
                <AlertCircle size={15} />
                <span>{unlockError}</span>
              </div>
            )}

            <form onSubmit={handleUnlockSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ position: 'relative' }}>
                <input
                  type={showUnlockPassword ? 'text' : 'password'}
                  placeholder="Masukkan password catatan..."
                  value={unlockPassword}
                  onChange={(e) => setUnlockPassword(e.target.value)}
                  style={{ width: '100%', paddingRight: '40px' }}
                  autoFocus
                />
                <button
                  type="button"
                  className="btn-icon"
                  onClick={() => setShowUnlockPassword(!showUnlockPassword)}
                  style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', padding: '4px' }}
                >
                  {showUnlockPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '6px' }}>
                <button
                  type="button"
                  className="btn-icon"
                  onClick={() => setUnlockTargetNote(null)}
                  disabled={isUnlocking}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isUnlocking}
                  style={{ minWidth: '120px' }}
                >
                  {isUnlocking ? 'Mendekripsi...' : 'Buka Catatan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Tampilan Detail Catatan Lengkap */}
      {viewingNote && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px'
          }}
          onClick={() => setViewingNote(null)}
        >
          <div
            className="glass animate-fade-in"
            style={{
              width: '100%',
              maxWidth: '620px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '28px',
              borderRadius: '16px',
              background: 'var(--card-bg, rgba(25, 25, 35, 0.95))',
              border: viewingNote.isLocked ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(255,255,255,0.1)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header detail */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '2rem' }}>{viewingNote.icon || '📝'}</span>
                <div>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '4px' }}>
                    {viewingNote.title}
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <span>{formatDate(viewingNote.createdAt)}</span>
                    {viewingNote.isLocked && (
                      <span style={{ color: 'var(--danger-color)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Lock size={12} /> Terenkripsi
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                className="btn-icon"
                onClick={() => setViewingNote(null)}
                style={{ padding: '6px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Content area */}
            <div style={{
              padding: '18px',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              minHeight: '160px',
              maxHeight: '50vh',
              overflowY: 'auto',
              marginBottom: '20px'
            }}>
              <p style={{ fontSize: '0.95rem', lineHeight: '1.7', whiteSpace: 'pre-wrap', color: 'var(--text-primary)' }}>
                {viewingNote.decryptedContent || <span style={{ fontStyle: 'italic', opacity: 0.6 }}>(Catatan kosong)</span>}
              </p>
            </div>

            {/* Actions footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                className="btn-icon danger"
                onClick={() => {
                  if (window.confirm(`Hapus catatan "${viewingNote.title}"?`)) {
                    removeNote(viewingNote.id);
                    setViewingNote(null);
                  }
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Trash2 size={16} /> Hapus
              </button>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  className="btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  onClick={() => handleOpenEdit(viewingNote, viewingNote.decryptedContent)}
                >
                  <Edit2 size={16} /> Edit Catatan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
