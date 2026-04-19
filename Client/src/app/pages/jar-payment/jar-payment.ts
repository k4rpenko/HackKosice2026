import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { JARS_STORAGE_KEY, SavedJar } from '../../../components/jar/jar.component';

@Component({
  selector: 'app-jar-payment',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './jar-payment.html',
  styleUrls: ['./jar-payment.scss'],
})
export class JarPaymentComponent implements OnInit {
  jar: SavedJar | null = null;
  notFound = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const rawId = this.route.snapshot.paramMap.get('jarId');
    if (!rawId) {
      this.notFound = true;
      return;
    }
    const jarId = decodeURIComponent(rawId);
    const raw = localStorage.getItem(JARS_STORAGE_KEY);
    if (!raw) {
      this.notFound = true;
      return;
    }
    try {
      const list: SavedJar[] = JSON.parse(raw);
      this.jar = list.find((j) => j.id === jarId) ?? null;
      this.notFound = !this.jar;
    } catch {
      this.notFound = true;
    }
  }

  /** Сума вже внесених оплат (позначені paid). */
  get collectedAmount(): number {
    if (!this.jar) return 0;
    return this.jar.members.filter((m) => m.paid).reduce((s, m) => s + m.payAmount, 0);
  }

  get progressPct(): number {
    if (!this.jar || this.jar.totalAmount <= 0) return 0;
    return Math.min(100, Math.round((this.collectedAmount / this.jar.totalAmount) * 1000) / 10);
  }

  get remainingAmount(): number {
    if (!this.jar) return 0;
    return Math.max(0, Math.round((this.jar.totalAmount - this.collectedAmount) * 100) / 100);
  }

  initials(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase() || '?';
  }

  goHome(): void {
    void this.router.navigate(['/home']);
  }

  payMember(index: number): void {
    if (!this.jar || index < 0 || index >= this.jar.members.length) return;
    const cur = this.jar.members[index];
    if (cur.paid) return;

    const nextMembers = this.jar.members.map((mem, i) =>
      i === index ? { ...mem, paid: true } : mem,
    );
    this.jar = { ...this.jar, members: nextMembers };
    this.persistJar();
  }

  private persistJar(): void {
    if (!this.jar) return;
    const raw = localStorage.getItem(JARS_STORAGE_KEY);
    if (!raw) return;
    try {
      const list: SavedJar[] = JSON.parse(raw);
      const idx = list.findIndex((j) => j.id === this.jar!.id);
      if (idx < 0) return;
      list[idx] = { ...this.jar };
      localStorage.setItem(JARS_STORAGE_KEY, JSON.stringify(list));
    } catch {
      // ignore
    }
  }
}
