import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/** Ключ localStorage для списку банок (спільний зі сторінкою оплати за посиланням). */
export const JARS_STORAGE_KEY = 'splitpay_jars';

export interface JarCirclePerson {
  id: number;
  name: string;
  initials: string;
  role: string;
}

interface JarParticipantDraft {
  personId: number;
  name: string;
  initials: string;
  amount: number | null;
}

/** Збережена банка: хто скільки має сплатити (payAmount), personId — якщо з кола. */
export interface SavedJar {
  id: string;
  title: string;
  totalAmount: number;
  members: { name: string; payAmount: number; personId?: number; paid?: boolean }[];
  createdAt: string;
}

@Component({
  selector: 'app-jar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './jar.component.html',
  styleUrl: './jar.component.scss',
})
export class JarComponent implements OnInit {
  @Input() circlePeople: JarCirclePerson[] = [];

  jars: SavedJar[] = [];

  showJarModal = false;
  jarStep: 1 | 2 | 3 = 1;
  jarTitle = '';
  jarTotal: number | null = null;
  jarParticipants: JarParticipantDraft[] = [];

  copiedJarId: string | null = null;
  private copyReset?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    const raw = localStorage.getItem(JARS_STORAGE_KEY);
    if (raw) {
      try {
        this.jars = JSON.parse(raw);
      } catch {
        this.jars = [];
      }
    }
  }

  get explicitShareTotal(): number {
    return this.jarParticipants.reduce((s, r) => {
      const a = r.amount;
      if (a !== null && a !== undefined && a > 0) return s + a;
      return s;
    }, 0);
  }

  get remainingForAutoSplit(): number {
    const t = this.jarTotal;
    if (t === null || t === undefined || !Number.isFinite(t)) return 0;
    return Math.round((t - this.explicitShareTotal) * 100) / 100;
  }

  maxAmountForPerson(personId: number): number {
    const total = this.jarTotal;
    if (total === null || total === undefined || !Number.isFinite(total) || total <= 0) return 0;
    const others = this.jarParticipants
      .filter((r) => r.personId !== personId)
      .reduce((s, r) => {
        const a = r.amount;
        if (a !== null && a !== undefined && a > 0) return s + a;
        return s;
      }, 0);
    return Math.max(0, Math.round((total - others) * 100) / 100);
  }

  openJarModal(): void {
    this.showJarModal = true;
    this.jarStep = 1;
    this.jarTitle = '';
    this.jarTotal = null;
    this.jarParticipants = [];
  }

  closeJarModal(): void {
    this.showJarModal = false;
  }

  isPersonInJar(personId: number): boolean {
    return this.jarParticipants.some((p) => p.personId === personId);
  }

  togglePersonInJar(p: JarCirclePerson): void {
    const idx = this.jarParticipants.findIndex((x) => x.personId === p.id);
    if (idx >= 0) {
      this.jarParticipants = this.jarParticipants.filter((x) => x.personId !== p.id);
    } else {
      this.jarParticipants = [
        ...this.jarParticipants,
        { personId: p.id, name: p.name, initials: p.initials, amount: null },
      ];
    }
  }

  participantAmountInput(personId: number): string {
    const row = this.jarParticipants.find((p) => p.personId === personId);
    if (!row || row.amount === null || row.amount === undefined) return '';
    return String(row.amount);
  }

  onParticipantAmountInput(event: Event, personId: number): void {
    const row = this.jarParticipants.find((p) => p.personId === personId);
    if (!row) return;
    const input = event.target as HTMLInputElement;
    const v = input.value.trim();
    if (v === '') {
      row.amount = null;
      return;
    }
    let n = Number(v);
    if (!Number.isFinite(n) || n < 0) n = 0;
    const max = this.maxAmountForPerson(personId);
    if (n > max) n = max;
    row.amount = Math.round(n * 100) / 100;
    const display = row.amount === null ? '' : String(row.amount);
    if (input.value !== display) input.value = display;
  }

  canCreateJar(): boolean {
    const title = this.jarTitle?.trim();
    const total = this.jarTotal;
    if (!title || total === null || total === undefined || !Number.isFinite(total) || total <= 0) {
      return false;
    }
    if (this.jarParticipants.length === 0) return true;
    return this.explicitShareTotal <= total + 0.001;
  }

  createJar(): void {
    if (!this.canCreateJar()) return;
    const title = this.jarTitle.trim();
    const total = this.jarTotal as number;

    let members: { name: string; payAmount: number; personId?: number }[];

    if (this.jarParticipants.length === 0) {
      members = [{ name: 'Just Me', payAmount: Math.round(total * 100) / 100 }];
    } else {
      const resolved = this.resolveParticipantAmounts(total, this.jarParticipants);
      const sumFixed = resolved.reduce((s, m) => s + m.payAmount, 0);
      if (sumFixed > total + 0.01) {
        alert('The sum of shares cannot exceed the jar total.');
        return;
      }
      let adjusted = resolved.map((m) => ({ ...m }));
      const sum = adjusted.reduce((s, m) => s + m.payAmount, 0);
      const diff = Math.round((total - sum) * 100) / 100;
      if (Math.abs(diff) > 0.001 && adjusted.length > 0) {
        adjusted[0] = {
          ...adjusted[0],
          payAmount: Math.round((adjusted[0].payAmount + diff) * 100) / 100,
        };
      }
      members = adjusted.map((m) => ({
        name: m.name,
        payAmount: m.payAmount,
        personId: m.personId,
      }));
    }

    const jar: SavedJar = {
      id: 'jar-' + Date.now(),
      title,
      totalAmount: Math.round(total * 100) / 100,
      members,
      createdAt: new Date().toISOString(),
    };
    this.jars = [...this.jars, jar];
    localStorage.setItem(JARS_STORAGE_KEY, JSON.stringify(this.jars));
    this.closeJarModal();
  }

  private resolveParticipantAmounts(
    total: number,
    rows: JarParticipantDraft[],
  ): { name: string; payAmount: number; personId: number }[] {
    const explicit = rows.map((r) => ({
      personId: r.personId,
      name: r.name,
      amount: r.amount !== null && r.amount !== undefined && r.amount > 0 ? r.amount : null,
    }));
    const fixedSum = explicit.filter((e) => e.amount !== null).reduce((s, e) => s + (e.amount as number), 0);
    const flexible = explicit.filter((e) => e.amount === null);
    const remainder = Math.max(0, total - fixedSum);
    const eachAuto = flexible.length ? remainder / flexible.length : 0;

    return explicit.map((e) => ({
      personId: e.personId,
      name: e.name,
      payAmount:
        e.amount !== null
          ? Math.round((e.amount as number) * 100) / 100
          : Math.round(eachAuto * 100) / 100,
    }));
  }

  nextJarStep(): void {
    if (this.jarStep === 1) {
      if (!this.jarTitle.trim()) return;
      this.jarStep = 2;
      return;
    }
    if (this.jarStep === 2) {
      const t = this.jarTotal;
      if (t === null || t === undefined || !Number.isFinite(t) || t <= 0) return;
      this.jarStep = 3;
    }
  }

  paymentUrl(jar: SavedJar): string {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/jar/payment/${encodeURIComponent(jar.id)}`;
  }

  copyJarLink(jar: SavedJar, event: Event): void {
    event.stopPropagation();
    const url = this.paymentUrl(jar);
    const done = () => {
      this.copiedJarId = jar.id;
      clearTimeout(this.copyReset);
      this.copyReset = setTimeout(() => {
        this.copiedJarId = null;
      }, 2200);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(done).catch(() => this.fallbackCopy(url, done));
    } else {
      this.fallbackCopy(url, done);
    }
  }

  private fallbackCopy(text: string, done: () => void): void {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      done();
    } finally {
      document.body.removeChild(ta);
    }
  }

  deleteJar(id: string, event: Event): void {
    event.stopPropagation();
    this.jars = this.jars.filter((j) => j.id !== id);
    localStorage.setItem(JARS_STORAGE_KEY, JSON.stringify(this.jars));
  }
}
