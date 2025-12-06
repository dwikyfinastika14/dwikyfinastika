import { Component, HostListener, Renderer2 } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { GsapRevealDirective } from '../../../directives/gsap-reveal.directive';
import { CommonModule } from '@angular/common';
import { ClassManagerService } from '../../../services/classmanaer.service';
import { ScrollToModule, ScrollToService } from '@nicky-lenaers/ngx-scroll-to'
import aos from 'aos';
import { CounterDirective } from '../../../directives/counter.directive';

@Component({
  selector: 'app-sidebar',
  imports: [
    GsapRevealDirective,
    CounterDirective,
    CommonModule,
    RouterOutlet,
    ScrollToModule,
    RouterLink,
  ],
  templateUrl: './sidebar.component.html',
  styles: ``,
  providers: [ScrollToService],
})
export class SidebarComponent {
  currentSection = 'list-item-1';
  year = new Date().getFullYear();
  isModelOpen: boolean = false;
  sectionIds = [
    'list-item-1',
    'list-item-2',
    'list-item-3',
    'list-item-4',
    'list-item-5',
    'list-item-6',
    'list-item-7',
    'list-item-8',
  ];

  constructor(
    private renderer: Renderer2,
    public classManager: ClassManagerService
  ) {}
  ngOnInit() {
    aos.init();
  }

  openModel() {
    this.isModelOpen = true;
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    this.checkActiveSection();
  }

  checkActiveSection(): void {
    for (let id of this.sectionIds) {
      const section = document.getElementById(id);
      if (section) {
        const rect = section.getBoundingClientRect();
        if (rect.top >= 0 && rect.top <= window.innerHeight / 3) {
          this.currentSection = id;
          break; // Stop checking once we find the first visible section
        }
      }
    }
  }

  closeModel() {
    this.isModelOpen = false;
  }

  setActiveLink(sectionId: string): void {
    this.currentSection = sectionId;
  }
}
