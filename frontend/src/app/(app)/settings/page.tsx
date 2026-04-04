'use client'

import { useState, useEffect, useRef } from 'react'
import { DashboardTopBar } from '@/components/app/DashboardTopBar'
import { Switch } from '@/components/ui/switch'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog'
import {
  User,
  Shield,
  Bell,
  Settings as SettingsIcon,
  Download,
  AlertTriangle,
  Camera,
  Copy,
  Check,
  Smartphone,
  Laptop,
  Globe,
  ChevronDown,
  FileDown,
  Key,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { api } from '@/lib/api'
import { useAuth } from '@/lib/auth'
import type { UserPreferences } from '@/types/api'

// ─── Types ────────────────────────────────────────────────────────────────────

type TabType = 'profile' | 'security' | 'notifications' | 'preferences' | 'export' | 'danger'

// ─── Profile Panel ────────────────────────────────────────────────────────────

function ProfilePanel() {
  const { user } = useAuth()
  const [copied, setCopied] = useState(false)
  const [displayName, setDisplayName] = useState(user?.displayName ?? '')
  const [bio, setBio] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle')

  const did = user?.did ?? 'did:solidus:mainnet:—'

  const handleCopy = () => {
    navigator.clipboard.writeText(did)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSave = async () => {
    setSaving(true)
    setSaveStatus('idle')
    try {
      await api.patch('/v1/settings/profile', { displayName, bio })
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } catch {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-[#1A1A2E] rounded-[8px] p-6">
      <h3 className="font-sans font-semibold text-[18px] text-white mb-8">Profile</h3>

      <div className="flex flex-col gap-8">
        {/* Avatar */}
        <div className="flex flex-col items-start gap-3">
          <div className="relative group cursor-pointer w-20 h-20 rounded-full bg-[#242438] flex items-center justify-center overflow-hidden border border-[#2A2A42]">
            <span className="font-sans font-semibold text-[24px] text-[#8E8E93]">
              {displayName ? displayName.slice(0, 2).toUpperCase() : 'AC'}
            </span>
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>
          <button className="font-sans font-medium text-[12px] text-[#0066FF] hover:underline">
            Change Photo
          </button>
        </div>

        {/* Display Name */}
        <div className="flex flex-col gap-2 max-w-md">
          <label className="font-sans font-medium text-[13px] text-[#8E8E93]">Display Name</label>
          <input
            type="text"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            className="h-10 bg-[#242438] border border-[#2A2A42] rounded-[4px] px-3 font-sans font-normal text-[14px] text-white focus:outline-none focus:border-[#0066FF] transition-colors"
          />
        </div>

        {/* DID (Read only) */}
        <div className="flex flex-col gap-2 max-w-md">
          <label className="font-sans font-medium text-[13px] text-[#8E8E93]">
            Decentralized Identifier (DID)
          </label>
          <div className="relative flex items-center h-10 bg-[#151525] border border-[#2A2A42] rounded-[4px] px-3 group">
            <span className="font-mono font-normal text-[12px] text-white truncate mr-8">{did}</span>
            <button
              onClick={handleCopy}
              className="absolute right-3 text-[#8E8E93] hover:text-white transition-colors"
            >
              {copied ? (
                <Check className="w-4 h-4 text-[#34C759]" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
          <p className="font-sans font-normal text-[11px] text-[#48484F] mt-1">
            Your DID is permanent and cannot be changed.
          </p>
        </div>

        {/* Bio */}
        <div className="flex flex-col gap-2 max-w-md">
          <label className="font-sans font-medium text-[13px] text-[#8E8E93]">Bio</label>
          <textarea
            rows={3}
            value={bio}
            onChange={e => setBio(e.target.value)}
            placeholder="Tell others about yourself..."
            className="bg-[#242438] border border-[#2A2A42] rounded-[4px] p-3 font-sans font-normal text-[14px] text-white focus:outline-none focus:border-[#0066FF] transition-colors resize-none"
          />
        </div>

        {/* Save */}
        <div className="flex items-center gap-4 max-w-md justify-end">
          {saveStatus === 'saved' && (
            <span className="font-sans font-normal text-[13px] text-[#34C759]">Profile saved.</span>
          )}
          {saveStatus === 'error' && (
            <span className="font-sans font-normal text-[13px] text-[#FF3B30]">Failed to save.</span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="h-10 px-6 bg-[#0066FF] hover:bg-[#0055D4] rounded-md font-sans font-medium text-[14px] text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving…' : 'Save Profile'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Security Panel ───────────────────────────────────────────────────────────

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <span className="font-sans font-normal text-[14px] text-white">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  )
}

function SessionRow({
  icon: Icon,
  device,
  browser,
  location,
  active,
  isCurrent,
}: {
  icon: React.ElementType
  device: string
  browser: string
  location: string
  active: string
  isCurrent: boolean
}) {
  return (
    <div className="flex items-start justify-between bg-[#242438] p-4 rounded-lg border border-[#2A2A42]">
      <div className="flex gap-4">
        <div className="w-10 h-10 rounded-full bg-[#1A1A2E] flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-[#00D4FF]" />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-sans font-medium text-[14px] text-white">{device}</span>
            {isCurrent && (
              <span className="bg-[#34C759]/15 text-[#34C759] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">
                Current
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 font-sans font-normal text-[12px] text-[#8E8E93]">
            <span>{browser}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3" /> {location}
            </span>
          </div>
          <span className="font-sans font-normal text-[11px] text-[#48484F] mt-1">
            Last active: {active}
          </span>
        </div>
      </div>
      {!isCurrent && (
        <button className="font-sans font-medium text-[13px] text-[#FF3B30] hover:underline">
          Revoke
        </button>
      )}
    </div>
  )
}

function SecurityPanel() {
  const [useBiometrics, setUseBiometrics] = useState(true)
  const [requireBiometricsForShare, setRequireBiometricsForShare] = useState(true)
  const [sessionMsg, setSessionMsg] = useState('')

  const handleRevokeOtherSessions = () => {
    setSessionMsg('Session management coming soon.')
    setTimeout(() => setSessionMsg(''), 4000)
  }

  return (
    <div className="bg-[#1A1A2E] rounded-[8px] p-6">
      <h3 className="font-sans font-semibold text-[18px] text-white mb-8">Security</h3>

      <div className="flex flex-col gap-8">
        {/* PIN / Password */}
        <div className="flex flex-col gap-4 border-b border-[#2A2A42] pb-8">
          <div>
            <h4 className="font-sans font-medium text-[15px] text-white mb-1">PIN / Password</h4>
            <p className="font-sans font-normal text-[13px] text-[#8E8E93]">Last changed 2026-01-15.</p>
          </div>
          <button className="h-10 px-4 rounded-md border border-[#2A2A42] font-sans font-medium text-[14px] text-white hover:bg-[#242438] transition-colors self-start">
            Change PIN
          </button>
        </div>

        {/* Biometrics */}
        <div className="flex flex-col gap-6 border-b border-[#2A2A42] pb-8">
          <div>
            <h4 className="font-sans font-medium text-[15px] text-white mb-1">
              Biometric Authentication
            </h4>
            <p className="font-sans font-normal text-[13px] text-[#8E8E93]">
              Use local device biometrics for quick access and authorization.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <ToggleRow
              label="Use Face ID / Fingerprint to unlock app"
              checked={useBiometrics}
              onChange={() => setUseBiometrics(v => !v)}
            />
            <ToggleRow
              label="Require biometric to share credentials"
              checked={requireBiometricsForShare}
              onChange={() => setRequireBiometricsForShare(v => !v)}
            />
          </div>
        </div>

        {/* Active Sessions */}
        <div className="flex flex-col gap-4 border-b border-[#2A2A42] pb-8">
          <div>
            <h4 className="font-sans font-medium text-[15px] text-white mb-1">Active Sessions</h4>
            <p className="font-sans font-normal text-[13px] text-[#8E8E93]">
              Manage devices currently logged into your account.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <SessionRow
              icon={Laptop}
              device="This device"
              browser="Active now"
              location="—"
              active="Current Session"
              isCurrent={true}
            />
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={handleRevokeOtherSessions}
              className="h-10 px-4 rounded-md border border-[#FF3B30] text-[#FF3B30] font-sans font-medium text-[14px] hover:bg-[#FF3B30]/10 transition-colors self-start mt-2"
            >
              Revoke All Other Sessions
            </button>
            {sessionMsg && (
              <span className="font-sans font-normal text-[13px] text-[#8E8E93]">{sessionMsg}</span>
            )}
          </div>
        </div>

        {/* Two-Factor (Backup) */}
        <div className="flex flex-col gap-4">
          <div>
            <h4 className="font-sans font-medium text-[15px] text-white mb-1">
              Backup Two-Factor (2FA)
            </h4>
            <p className="font-sans font-normal text-[13px] text-[#8E8E93]">
              Add a backup method in case you lose access to your primary authenticator.
            </p>
          </div>
          <button className="h-10 px-4 rounded-md border border-[#0066FF] text-[#0066FF] font-sans font-medium text-[14px] hover:bg-[#0066FF]/10 transition-colors self-start">
            Add backup 2FA method
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Notifications Panel ──────────────────────────────────────────────────────

function NotificationsPanel() {
  const [settings, setSettings] = useState({
    expiry: true,
    requests: true,
    suspicious: true,
    issuance: false,
    digest: false,
  })
  const loaded = useRef(false)

  useEffect(() => {
    api.get<UserPreferences>('/v1/settings/preferences')
      .then(prefs => {
        setSettings({
          expiry: prefs.notifExpiry,
          requests: prefs.notifRequests,
          suspicious: prefs.notifSuspicious,
          issuance: prefs.notifIssuance,
          digest: prefs.notifDigest,
        })
        loaded.current = true
      })
      .catch(() => {
        loaded.current = true
      })
  }, [])

  const toggle = async (key: keyof typeof settings) => {
    const newVal = !settings[key]
    setSettings(prev => ({ ...prev, [key]: newVal }))

    const apiKey: Record<keyof typeof settings, keyof UserPreferences> = {
      expiry: 'notifExpiry',
      requests: 'notifRequests',
      suspicious: 'notifSuspicious',
      issuance: 'notifIssuance',
      digest: 'notifDigest',
    }

    try {
      await api.put('/v1/settings/preferences', { [apiKey[key]]: newVal })
    } catch {
      // Revert on error
      setSettings(prev => ({ ...prev, [key]: !newVal }))
    }
  }

  return (
    <div className="bg-[#1A1A2E] rounded-[8px] p-6">
      <h3 className="font-sans font-semibold text-[18px] text-white mb-8">Notifications</h3>

      <div className="flex flex-col gap-6">
        <ToggleRow
          label="Credential expiry reminders"
          checked={settings.expiry}
          onChange={() => toggle('expiry')}
        />
        <ToggleRow
          label="New access requests"
          checked={settings.requests}
          onChange={() => toggle('requests')}
        />
        <ToggleRow
          label="Suspicious sign-in attempts"
          checked={settings.suspicious}
          onChange={() => toggle('suspicious')}
        />
        <ToggleRow
          label="Credential issuance updates"
          checked={settings.issuance}
          onChange={() => toggle('issuance')}
        />
        <ToggleRow
          label="Weekly digest"
          checked={settings.digest}
          onChange={() => toggle('digest')}
        />
      </div>
    </div>
  )
}

// ─── Preferences Panel ────────────────────────────────────────────────────────

const LANGUAGES = ['EN 🇬🇧', 'TR 🇹🇷', 'DE 🇩🇪', 'FR 🇫🇷', 'ES 🇪🇸', 'JA 🇯🇵', 'KO 🇰🇷', 'ZH 🇨🇳']

// Map display label → API value
const LANG_TO_CODE: Record<string, string> = {
  'EN 🇬🇧': 'en',
  'TR 🇹🇷': 'tr',
  'DE 🇩🇪': 'de',
  'FR 🇫🇷': 'fr',
  'ES 🇪🇸': 'es',
  'JA 🇯🇵': 'ja',
  'KO 🇰🇷': 'ko',
  'ZH 🇨🇳': 'zh',
}

const CODE_TO_LANG: Record<string, string> = Object.fromEntries(
  Object.entries(LANG_TO_CODE).map(([k, v]) => [v, k])
)

function PreferencesPanel() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [langOpen, setLangOpen] = useState(false)
  const [lang, setLang] = useState('EN 🇬🇧')

  useEffect(() => {
    api.get<UserPreferences>('/v1/settings/preferences')
      .then(prefs => {
        setTheme(prefs.theme === 'light' ? 'light' : 'dark')
        setLang(CODE_TO_LANG[prefs.language] ?? 'EN 🇬🇧')
      })
      .catch(() => {})
  }, [])

  const handleLangChange = async (selectedLabel: string) => {
    setLang(selectedLabel)
    setLangOpen(false)
    try {
      await api.put('/v1/settings/preferences', { language: LANG_TO_CODE[selectedLabel] ?? 'en' })
    } catch {
      // ignore — UI already updated
    }
  }

  const handleThemeChange = async (selectedTheme: 'dark' | 'light') => {
    setTheme(selectedTheme)
    try {
      await api.put('/v1/settings/preferences', { theme: selectedTheme })
    } catch {
      // ignore
    }
  }

  return (
    <div className="bg-[#1A1A2E] rounded-[8px] p-6">
      <h3 className="font-sans font-semibold text-[18px] text-white mb-6">Preferences</h3>

      <div className="flex flex-col">
        {/* Language */}
        <div className="flex items-center justify-between h-[56px] border-b border-[#242438]">
          <div className="flex flex-col justify-center">
            <span className="font-sans font-normal text-[14px] text-white leading-tight">
              Display Language
            </span>
            <span className="font-sans font-normal text-[12px] text-[#8E8E93]">Interface language</span>
          </div>

          <div className="relative">
            <button
              onClick={() => setLangOpen(v => !v)}
              className="h-9 px-3 bg-[#242438] border border-[#2A2A42] rounded-md flex items-center justify-between gap-3 min-w-[100px] hover:border-[#48484F] transition-colors"
            >
              <span className="font-sans font-medium text-[13px] text-white">{lang}</span>
              <ChevronDown className="w-4 h-4 text-[#8E8E93]" />
            </button>

            {langOpen && (
              <div className="absolute right-0 top-[calc(100%+4px)] w-[120px] bg-[#242438] border border-[#2A2A42] rounded-md shadow-lg py-1 z-10">
                {LANGUAGES.map(l => (
                  <button
                    key={l}
                    onClick={() => handleLangChange(l)}
                    className={`w-full text-left px-3 py-2 font-sans text-[13px] hover:bg-[#1A1A2E] transition-colors ${
                      lang === l ? 'text-[#00D4FF] font-medium' : 'text-white'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Theme */}
        <div className="flex items-center justify-between h-[56px]">
          <div className="flex flex-col justify-center">
            <span className="font-sans font-normal text-[14px] text-white leading-tight">
              Interface Theme
            </span>
            <span className="font-sans font-normal text-[12px] text-[#8E8E93]">
              Choose light or dark mode
            </span>
          </div>

          <div className="flex p-1 bg-[#151525] rounded-lg border border-[#2A2A42] w-[120px]">
            <button
              onClick={() => handleThemeChange('dark')}
              className={`flex-1 h-7 rounded-[4px] font-sans font-medium text-[12px] transition-colors ${
                theme === 'dark' ? 'bg-[#0066FF] text-white shadow-sm' : 'text-[#8E8E93] hover:text-white'
              }`}
            >
              Dark
            </button>
            <button
              onClick={() => handleThemeChange('light')}
              className={`flex-1 h-7 rounded-[4px] font-sans font-medium text-[12px] transition-colors ${
                theme === 'light' ? 'bg-[#242438] text-white shadow-sm' : 'text-[#8E8E93] hover:text-white'
              }`}
            >
              Light
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Export Panel ─────────────────────────────────────────────────────────────

function ExportPanel() {
  return (
    <div className="bg-[#1A1A2E] rounded-[8px] p-6">
      <h3 className="font-sans font-semibold text-[18px] text-white mb-6">Export &amp; Backup</h3>

      <div className="flex items-start gap-3 bg-[#FF9500]/10 border border-[#FF9500]/20 rounded-lg p-4 mb-8">
        <AlertTriangle className="w-4 h-4 text-[#FF9500] mt-0.5 shrink-0" />
        <p className="font-sans font-normal text-[13px] text-[#FF9500] leading-relaxed">
          Keep your export file secure. It contains your full identity data including private key material.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <button className="flex items-center justify-center gap-2 h-10 px-6 bg-[#0066FF] hover:bg-[#0055D4] rounded-md font-sans font-medium text-[14px] text-white transition-colors w-full sm:w-auto self-start">
            <Download className="w-4 h-4" />
            Export All Credentials
          </button>
          <span className="font-sans font-normal text-[12px] text-[#8E8E93]">
            Downloads a .vcb file (Verifiable Credential Backup).
          </span>
        </div>

        <div className="h-px w-full bg-[#2A2A42]" />

        <button className="flex items-center justify-center gap-2 h-10 px-6 border border-[#2A2A42] hover:bg-[#242438] rounded-md font-sans font-medium text-[14px] text-white transition-colors w-full sm:w-auto self-start">
          <FileDown className="w-4 h-4" />
          Export DID Document
        </button>

        <button className="flex items-center justify-center gap-2 h-10 px-6 border border-[#2A2A42] hover:bg-[#242438] rounded-md font-sans font-medium text-[14px] text-white transition-colors w-full sm:w-auto self-start">
          <Key className="w-4 h-4" />
          Export Seed Phrase
        </button>
      </div>
    </div>
  )
}

// ─── Danger Zone Panel ────────────────────────────────────────────────────────

function ConfirmationModal({
  type,
  onClose,
}: {
  type: 'revoke' | 'delete'
  onClose: () => void
}) {
  const [confirmText, setConfirmText] = useState('')

  const title = type === 'revoke' ? 'Revoke All Connections' : 'Delete Account'
  const buttonText =
    type === 'revoke' ? 'Confirm Revoke All' : 'Permanently Delete Account'
  const isEnabled = confirmText === 'DELETE'

  return (
    <AlertDialog open onOpenChange={open => { if (!open) onClose() }}>
      <AlertDialogContent className="bg-[#1A1A2E] border border-[#2A2A42] rounded-xl w-full max-w-[440px] shadow-2xl p-0 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-[#2A2A42]">
          <div className="flex items-center gap-2 text-[#FF3B30]">
            <AlertTriangle className="w-5 h-5" />
            <AlertDialogTitle className="font-sans font-semibold text-[16px] text-[#FF3B30]">
              {title}
            </AlertDialogTitle>
          </div>
          <button onClick={onClose} className="text-[#8E8E93] hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5">
          <p className="font-sans font-normal text-[14px] text-[#E0E0E5] leading-relaxed">
            Are you absolutely sure? This action cannot be undone. To verify, please type{' '}
            <strong>DELETE</strong> below.
          </p>

          <input
            type="text"
            placeholder="Type DELETE to confirm"
            value={confirmText}
            onChange={e => setConfirmText(e.target.value)}
            className="w-full h-11 bg-[#151525] border border-[#2A2A42] rounded-lg px-4 font-sans font-medium text-[14px] text-white focus:outline-none focus:border-[#FF3B30] transition-colors"
          />

          <div className="bg-[#242438] rounded-lg p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#151525] flex items-center justify-center shrink-0">
              <span className="text-[16px]">👋</span>
            </div>
            <p className="font-sans font-normal text-[12px] text-[#8E8E93]">
              Biometric confirmation will be required in the next step to complete this action.
            </p>
          </div>
        </div>

        <AlertDialogFooter className="p-5 border-t border-[#2A2A42] flex justify-end gap-3 bg-[#151525]">
          <button
            onClick={onClose}
            className="h-10 px-5 rounded-md border border-[#2A2A42] font-sans font-medium text-[14px] text-white hover:bg-[#242438] transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={!isEnabled}
            className={cn(
              'h-10 px-5 rounded-md font-sans font-medium text-[14px] text-white transition-colors',
              isEnabled ? 'bg-[#FF3B30] hover:bg-[#D92D20]' : 'bg-[#FF3B30]/30 cursor-not-allowed text-white/50'
            )}
          >
            {buttonText}
          </button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function DangerZonePanel() {
  const [modalType, setModalType] = useState<'revoke' | 'delete' | null>(null)

  return (
    <>
      <div className="bg-[#FF3B30]/[0.05] border border-[#FF3B30]/20 rounded-[8px] p-6">
        <h3 className="font-sans font-semibold text-[16px] text-[#FF3B30] mb-6">Danger Zone</h3>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col gap-1 pr-4">
              <span className="font-sans font-medium text-[14px] text-white">
                Revoke All Active Connections
              </span>
              <span className="font-sans font-normal text-[13px] text-[#8E8E93]">
                Immediately revokes all apps&apos; access to your credentials.
              </span>
            </div>
            <button
              onClick={() => setModalType('revoke')}
              className="h-10 px-4 whitespace-nowrap rounded-md border border-[#FF3B30] text-[#FF3B30] font-sans font-medium text-[13px] hover:bg-[#FF3B30]/10 transition-colors shrink-0"
            >
              Revoke All Connections
            </button>
          </div>

          <div className="h-px w-full bg-[#FF3B30]/20" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col gap-1 pr-4">
              <span className="font-sans font-medium text-[14px] text-white">Delete Account</span>
              <span className="font-sans font-normal text-[13px] text-[#8E8E93]">
                Permanently deletes your Solidus account. Your DID remains on-chain but is abandoned.
                This cannot be undone.
              </span>
            </div>
            <button
              onClick={() => setModalType('delete')}
              className="h-10 px-4 whitespace-nowrap rounded-md border border-[#FF3B30] text-[#FF3B30] font-sans font-medium text-[13px] hover:bg-[#FF3B30]/10 transition-colors shrink-0"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {modalType && (
        <ConfirmationModal type={modalType} onClose={() => setModalType(null)} />
      )}
    </>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const TABS: Array<{ id: TabType; label: string; icon: React.ElementType; isDanger?: boolean }> = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'preferences', label: 'Preferences', icon: SettingsIcon },
  { id: 'export', label: 'Export & Backup', icon: Download },
  { id: 'danger', label: 'Danger Zone', icon: AlertTriangle, isDanger: true },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('profile')

  return (
    <>
      <DashboardTopBar title="Settings" />
      <main className="flex-1 p-6 md:p-8">
        <div className="max-w-[1000px] w-full mx-auto pb-16">

          <div className="flex gap-8">
            {/* Settings Nav */}
            <div className="w-[200px] shrink-0">
              <div className="bg-[#1A1A2E] rounded-[8px] overflow-hidden border border-[#2A2A42] flex flex-col py-2">
                {TABS.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 font-sans text-[13px] transition-colors border-l-2',
                      activeTab === tab.id
                        ? tab.isDanger
                          ? 'bg-[#FF3B30]/10 text-[#FF3B30] border-l-[#FF3B30]'
                          : 'bg-[#242438] text-white border-l-[#0066FF]'
                        : tab.isDanger
                        ? 'text-[#FF3B30]/70 hover:text-[#FF3B30] hover:bg-[#FF3B30]/5 border-l-transparent'
                        : 'text-[#8E8E93] hover:text-white hover:bg-[#242438] border-l-transparent'
                    )}
                  >
                    <tab.icon className="w-4 h-4 shrink-0" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 min-w-0">
              {activeTab === 'profile' && <ProfilePanel />}
              {activeTab === 'security' && <SecurityPanel />}
              {activeTab === 'notifications' && <NotificationsPanel />}
              {activeTab === 'preferences' && <PreferencesPanel />}
              {activeTab === 'export' && <ExportPanel />}
              {activeTab === 'danger' && <DangerZonePanel />}
            </div>
          </div>

        </div>
      </main>
    </>
  )
}
