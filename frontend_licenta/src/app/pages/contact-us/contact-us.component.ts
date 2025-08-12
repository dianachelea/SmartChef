import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FeedbackService } from '../../core/services/feedback.service';
import { FeedbackDto, FeedbackCategory } from '../../core/models/feedback.model';

@Component({
  selector: 'app-contact-us',
  standalone: false,
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent {
  contact: FeedbackDto = {
    Name: '',
    Email: '',
    Title: '',
    Content: '',
    Stars: 0,
    IsAnonymus: false,
    Category: undefined
  };

  hats = Array(5).fill(0);
  hoverRating = 0;

  categories = [
    { label: 'Content Quality', value: FeedbackCategory.ContentQuality },
    { label: 'User Experience', value: FeedbackCategory.UserExperience },
    { label: 'Technical Performance', value: FeedbackCategory.TechnicalPerformance },
    { label: 'Cooking Tools', value: FeedbackCategory.CookingTools },
    { label: 'Recipes and Feedback', value: FeedbackCategory.RecipesAndFeedback }
  ];

  constructor(
    private feedbackService: FeedbackService,
    private router: Router
  ) {}

  submitContact(): void {
    this.feedbackService.submitFeedback(this.contact).subscribe({
      next: (result) => {
        if (result) {
          alert('Feedback submitted successfully!');
          this.router.navigateByUrl('/thanks');
        }
      },
      error: (error) => {
        alert('Something went wrong: ' + error.message);
      }
    });
  }
}
