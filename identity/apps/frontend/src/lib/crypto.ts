/**
 * Client-side Ed25519 crypto for DID authentication.
 *
 * Derives keypairs from 24-word seed phrases (simplified BIP-39-like).
 * Signs auth challenges to produce W3C Verifiable Presentations.
 */

// @noble/ed25519 for Ed25519 — uses async operations only (browser-compatible)
import * as ed from '@noble/ed25519'

// ---------------------------------------------------------------------------
// Keypair derivation from seed phrase
// ---------------------------------------------------------------------------

/**
 * Derive an Ed25519 keypair from a 24-word seed phrase.
 * Uses SHA-512 of the seed phrase to produce 32 bytes for the private key.
 */
export async function deriveKeypairFromSeed(seedPhrase: string): Promise<{
  privateKey: string  // hex
  publicKey: string   // hex
}> {
  // Hash the seed phrase to get deterministic 32 bytes
  const encoder = new TextEncoder()
  const seedBytes = encoder.encode(seedPhrase.trim().toLowerCase())
  const hashBuffer = await crypto.subtle.digest('SHA-256', seedBytes)
  const privateKeyBytes = new Uint8Array(hashBuffer)

  const publicKeyBytes = await ed.getPublicKeyAsync(privateKeyBytes)

  return {
    privateKey: bytesToHex(privateKeyBytes),
    publicKey: bytesToHex(publicKeyBytes),
  }
}

/**
 * Generate a fresh random Ed25519 keypair (for onboarding).
 */
export async function generateKeypair(): Promise<{
  privateKey: string  // hex
  publicKey: string   // hex
}> {
  const privateKeyBytes = ed.utils.randomSecretKey()
  const publicKeyBytes = await ed.getPublicKeyAsync(privateKeyBytes)

  return {
    privateKey: bytesToHex(privateKeyBytes),
    publicKey: bytesToHex(publicKeyBytes),
  }
}

// ---------------------------------------------------------------------------
// Verifiable Presentation signing
// ---------------------------------------------------------------------------

/**
 * Create a signed W3C Verifiable Presentation for DID auth.
 */
export async function createPresentation(params: {
  did: string
  nonce: string
  privateKey: string  // hex
}): Promise<Record<string, unknown>> {
  const presentation = {
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    type: ['VerifiablePresentation'],
    holder: params.did,
  }

  // Create detached JWS: base64url(header)..base64url(signature)
  const header = { alg: 'EdDSA', b64: false, crit: ['b64'] }
  const headerB64 = btoa(JSON.stringify(header))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

  const payloadB64 = btoa(JSON.stringify(presentation))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

  const signingInput = `${headerB64}.${payloadB64}`
  const signingBytes = new TextEncoder().encode(signingInput)
  const privateKeyBytes = hexToBytes(params.privateKey)

  const signature = await ed.signAsync(signingBytes, privateKeyBytes)
  const sigB64 = uint8ToBase64url(signature)

  const jws = `${headerB64}..${sigB64}`

  return {
    ...presentation,
    proof: {
      type: 'Ed25519Signature2020',
      created: new Date().toISOString(),
      challenge: params.nonce,
      proofPurpose: 'authentication',
      verificationMethod: `${params.did}#key-1`,
      jws,
    },
  }
}

// ---------------------------------------------------------------------------
// Seed phrase generation (simplified — not full BIP-39)
// ---------------------------------------------------------------------------

const WORDLIST = [
  'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract',
  'absurd', 'abuse', 'access', 'accident', 'account', 'accuse', 'achieve', 'acid',
  'acoustic', 'acquire', 'across', 'act', 'action', 'actor', 'actress', 'actual',
  'adapt', 'add', 'addict', 'address', 'adjust', 'admit', 'adult', 'advance',
  'advice', 'aerobic', 'affair', 'afford', 'afraid', 'again', 'age', 'agent',
  'agree', 'ahead', 'aim', 'air', 'airport', 'aisle', 'alarm', 'album',
  'alcohol', 'alert', 'alien', 'all', 'alley', 'allow', 'almost', 'alone',
  'alpha', 'already', 'also', 'alter', 'always', 'amateur', 'amazing', 'among',
  'amount', 'amused', 'analyst', 'anchor', 'ancient', 'anger', 'angle', 'angry',
  'animal', 'ankle', 'announce', 'annual', 'another', 'answer', 'antenna', 'antique',
  'anxiety', 'any', 'apart', 'apology', 'appear', 'apple', 'approve', 'april',
  'arch', 'arctic', 'area', 'arena', 'argue', 'arm', 'armed', 'armor',
  'army', 'around', 'arrange', 'arrest', 'arrive', 'arrow', 'art', 'artefact',
  'artist', 'artwork', 'ask', 'aspect', 'assault', 'asset', 'assist', 'assume',
  'asthma', 'athlete', 'atom', 'attack', 'attend', 'attitude', 'attract', 'auction',
  'audit', 'august', 'aunt', 'author', 'auto', 'autumn', 'average', 'avocado',
  'avoid', 'awake', 'aware', 'awesome', 'awful', 'awkward', 'axis', 'baby',
  'bachelor', 'bacon', 'badge', 'bag', 'balance', 'balcony', 'ball', 'bamboo',
  'banana', 'banner', 'bar', 'barely', 'bargain', 'barrel', 'base', 'basic',
  'basket', 'battle', 'beach', 'bean', 'beauty', 'because', 'become', 'beef',
  'before', 'begin', 'behave', 'behind', 'believe', 'below', 'belt', 'bench',
  'benefit', 'best', 'betray', 'better', 'between', 'beyond', 'bicycle', 'bid',
  'bike', 'bind', 'biology', 'bird', 'birth', 'bitter', 'black', 'blade',
  'blame', 'blanket', 'blast', 'bleak', 'bless', 'blind', 'blood', 'blossom',
  'blow', 'blue', 'blur', 'blush', 'board', 'boat', 'body', 'boil',
  'bomb', 'bone', 'bonus', 'book', 'boost', 'border', 'boring', 'borrow',
  'boss', 'bottom', 'bounce', 'box', 'boy', 'bracket', 'brain', 'brand',
  'brass', 'brave', 'bread', 'breeze', 'brick', 'bridge', 'brief', 'bright',
  'bring', 'brisk', 'broccoli', 'broken', 'bronze', 'broom', 'brother', 'brown',
  'brush', 'bubble', 'buddy', 'budget', 'buffalo', 'build', 'bulb', 'bulk',
]

/**
 * Generate a 24-word seed phrase from random entropy.
 */
export function generateSeedPhrase(): string {
  const words: string[] = []
  for (let i = 0; i < 24; i++) {
    const index = Math.floor(Math.random() * WORDLIST.length)
    words.push(WORDLIST[index]!)
  }
  return words.join(' ')
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16)
  }
  return bytes
}

function uint8ToBase64url(bytes: Uint8Array): string {
  const binary = String.fromCharCode(...bytes)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}
