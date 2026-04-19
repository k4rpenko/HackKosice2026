import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

export interface SavedJar {
  id: string;
  title: string;
  totalAmount: number;
  members: { name: string; payAmount: number }[];
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

  private readonly jarsStorageKey = 'splitpay_jars';

  ngOnInit(): void {
    const raw = localStorage.getItem(this.jarsStorageKey);
    if (raw) {
      try {
        this.jars = JSON.parse(raw);
      } catch {
        this.jars = [];
      }
    }
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

  createJar(): void {
    const title = this.jarTitle.trim();
    const total = this.jarTotal;
    if (!title || total === null || total === undefined || !Number.isFinite(total) || total <= 0) {
      return;
    }

    let members: { name: string; payAmount: number }[];
    if (this.jarParticipants.length === 0) {
      members = [{ name: 'Just Me', payAmount: Math.round(total * 100) / 100 }];
    } else {
      const n = this.jarParticipants.length;
      const each = Math.floor((total / n) * 100) / 100;
      const remainder = Math.round((total - each * n) * 100) / 100;
      members = this.jarParticipants.map((p, i) => ({
        name: p.name,
        payAmount: i === 0 ? Math.round((each + remainder) * 100) / 100 : each,
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
    localStorage.setItem(this.jarsStorageKey, JSON.stringify(this.jars));
    this.closeJarModal();
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


  deleteJar(id: string, event: Event): void {
    event.stopPropagation();
    this.jars = this.jars.filter((j) => j.id !== id);
    localStorage.setItem(this.jarsStorageKey, JSON.stringify(this.jars));
  }
}
