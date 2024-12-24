import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import {FormsModule} from '@angular/forms'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9) translateY(20px)' }),
        animate('500ms cubic-bezier(0.4, 0.0, 0.2, 1)', 
          style({ opacity: 1, transform: 'scale(1) translateY(0)' })
        ),
      ]),
      transition(':leave', [
        animate('500ms cubic-bezier(0.4, 0.0, 0.2, 1)', 
          style({ opacity: 0, transform: 'scale(0.9) translateY(20px)' })
        ),
      ]),
    ]),
    trigger('pulse', [
      transition('* => *', [
        animate('1s ease-in-out', keyframes([
          style({ transform: 'scale(1)', offset: 0 }),
          style({ transform: 'scale(1.05)', offset: 0.5 }),
          style({ transform: 'scale(1)', offset: 1 }),
        ])),
      ]),
    ]),
  ],

})
export class AppComponent implements OnInit{
  @ViewChild('snowCanvas', { static: true }) snowCanvas!: ElementRef<HTMLCanvasElement>;

  currentStep: number = 0;
  relationshipStatus: string = '';
  partnerName: string = '';
  programmingAnswer: string = '';
  hint1: string = 'Look behind your Monitor!';
  hint2: string = 'Check Backside Ports Of Your Computer!';
  showCongrats: boolean = false;
  showTryAgain: boolean = false;
  showChristmasWish: boolean = false;

  ngOnInit() {
    this.createSnowAnimation();
  }

  setRelationshipStatus(status: string) {
    this.relationshipStatus = status;
    if (status === 'prefer') {
      this.currentStep = 1;
    } else if (status === 'single') {
      this.currentStep = 2;
    } else {
      this.currentStep = 3;
    }
  }

  submitPartnerName() {
    if (this.partnerName.trim() !== '') {
      this.currentStep = 4;
    }
  }

  checkProgrammingAnswer(isCorrect: boolean) {
    if (isCorrect) {
      this.showCongrats = true;
      setTimeout(() => {
        this.showCongrats = false;
        this.currentStep = this.currentStep === 2 ? 4 : 6;
      }, 3000);
    } else {
      this.showTryAgain = true;
      setTimeout(() => {
        this.showTryAgain = false;
      }, 3000);
    }
  }

  nextHint() {
    this.currentStep = 5;
  }

  showChristmasMessage() {
    this.showChristmasWish = true;
    setTimeout(() => {
      this.showChristmasWish = false;
    }, 5000);
  }

  private createSnowAnimation() {
    const canvas = this.snowCanvas.nativeElement;
    const ctx = canvas.getContext('2d')!;
    const particlesArray: any[] = [];

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 5 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 1 + 1;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.y + this.size > canvas.height) {
          this.y = 0 - this.size;
          this.x = Math.random() * canvas.width;
        }
      }

      draw() {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function init() {
      for (let i = 0; i < 100; i++) {
        particlesArray.push(new Particle());
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      requestAnimationFrame(animate);
    }

    init();
    animate();

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    });
  }

}

