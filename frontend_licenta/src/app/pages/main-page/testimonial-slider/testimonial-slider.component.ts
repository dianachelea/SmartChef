import { Component, HostListener, OnInit } from '@angular/core';
import { FeedbackService } from '../../../core/services/feedback.service';
import { FeedbackDto, FeedbackCategory } from '../../../core/models/feedback.model';
import { TestimonialCardsComponent } from '../testimonial-cards/testimonial-cards.component';
@Component({
  selector: 'app-testimonial-slider',
  templateUrl: './testimonial-slider.component.html',
  styleUrls: ['./testimonial-slider.component.scss'],
  standalone: false
})
export class TestimonialSliderComponent implements OnInit {
  testimonials: FeedbackDto[] = [];
  currentSlide = 0;
  itemsPerSlide = 2;

  selectedSort = 'Name';
  selectedCategory: FeedbackCategory | 'all' = 'all';
  selectedStars: number | 'all' = 'all';

  constructor(private feedbackService: FeedbackService) {}

  ngOnInit() {
    this.updateItemsPerSlide();
    this.loadFilteredFeedback();
  }

  @HostListener('window:resize')
  onResize() {
    this.updateItemsPerSlide();
  }

  updateItemsPerSlide() {
    this.itemsPerSlide = window.innerWidth < 768 ? 1 : 2;
  }

  loadFilteredFeedback() {
    const filters: any = {};

    if (this.selectedCategory !== 'all') {
      filters.byCategories = [this.selectedCategory];
    }

    if (this.selectedStars !== 'all') {
      filters.stars = [this.selectedStars];
    }

    this.feedbackService.getFeedback(filters).subscribe({
      next: (result: any[]) => {
        const normalized: FeedbackDto[] = result.map(r => ({
          Name: r.name ?? '',
          Email: r.email ?? '',
          Title: r.title ?? '',
          Content: r.content ?? '',
          Stars: r.stars ?? 0,
          IsAnonymus: r.isAnonymous ?? false,
          Category: r.category ?? undefined
        }));
        this.testimonials = this.sortFeedback(normalized);
        this.currentSlide = 0;
      },
      error: (err) => console.error('Failed to load feedback', err)
    });
  }

  sortFeedback(data: FeedbackDto[]): FeedbackDto[] {
    if (this.selectedSort === 'Name') {
      return [...data].sort((a, b) => (a?.Name ?? '').localeCompare(b?.Name ?? ''));
    }
    if (this.selectedSort === 'Stars') {
      return [...data].sort((a, b) => (b?.Stars ?? 0) - (a?.Stars ?? 0));
    }
    return data;
  }

  get visibleTestimonials() {
    return this.testimonials?.slice(this.currentSlide, this.currentSlide + this.itemsPerSlide) ?? [];
  }

  prevSlide() {
    const max = this.testimonials.length - this.itemsPerSlide;
    if (max <= 0) return;
    this.currentSlide = (this.currentSlide - 1 + max + 1) % (max + 1);
  }

  nextSlide() {
    const max = this.testimonials.length - this.itemsPerSlide;
    if (max <= 0) return;
    this.currentSlide = (this.currentSlide + 1) % (max + 1);
  }

  get totalSlides() {
    const total = this.testimonials.length - this.itemsPerSlide + 1;
    return total > 0 ? total : 0;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }
}
