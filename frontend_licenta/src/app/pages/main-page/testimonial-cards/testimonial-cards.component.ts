import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-testimonial-cards',
  standalone: false,
  templateUrl: './testimonial-cards.component.html',
  styleUrls: ['./testimonial-cards.component.scss']
})
export class TestimonialCardsComponent {
  @Input() name: string = '';
  @Input() text: string = '';
  @Input() stars: number = 0;
}
