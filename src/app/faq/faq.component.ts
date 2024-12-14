import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})
export class FaqComponent {
  toggleAnswer(event: Event) {
    const question = event.currentTarget as HTMLElement;
    const answer = question.nextElementSibling as HTMLElement;

    if (answer.style.maxHeight) {
      // Collapse the answer
      answer.style.maxHeight = '';
    } else {
      // Expand the answer
      answer.style.maxHeight = `${answer.scrollHeight}px`;
    }
  }
}