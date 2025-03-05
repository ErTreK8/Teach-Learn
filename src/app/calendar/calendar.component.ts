import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, AfterViewInit {
  currentYear: number = new Date().getFullYear();
  currentMonth: number = new Date().getMonth();
  calendarDays: number[] = [];
  monthNamesFull: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  monthNamesAbbr: string[] = ['En', 'Feb', 'Mzo', 'Abr', 'My', 'Jun', 'Jul', 'Ag', 'Set', 'Oct', 'Nov', 'Dic'];
  showMonthList: boolean = false;
  currentDate: Date = new Date();

  @ViewChild('monthPicker') monthPicker!: ElementRef;
  @ViewChild('dayTextFormate') dayTextFormate!: ElementRef;
  @ViewChild('timeFormate') timeFormate!: ElementRef;
  @ViewChild('dateFormate') dateFormate!: ElementRef;
  @ViewChild('monthList') monthList!: ElementRef;
  @ViewChild('calendarDays') calendarDaysContainer!: ElementRef;
  @ViewChild('calendarHeaderYear') calendarHeaderYear!: ElementRef;

  ngOnInit() {
    this.updateCalendar();
    this.updateDateFormate();
  }

  isLeapYear(year: number): boolean {
    return (
      (year % 4 === 0 && year % 100 !== 0 && year % 400 !== 0) ||
      (year % 100 === 0 && year % 400 === 0)
    );
  }

  getFebDays(year: number): number {
    return this.isLeapYear(year) ? 29 : 28;
  }

  prevYear() {
    this.currentYear--;
    this.updateCalendar();
  }

  nextYear() {
    this.currentYear++;
    this.updateCalendar();
  }

  selectMonth(index: number) {
    this.currentMonth = index;
    this.showMonthList = false;
    this.updateCalendar();
  }

  toggleMonthList() {
    this.showMonthList = !this.showMonthList;
  }

  updateCalendar() {
    const daysOfMonth = [31, this.getFebDays(this.currentYear), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const daysInMonth = daysOfMonth[this.currentMonth];
    this.calendarDays = [];

    // Fill the array with the days of the month
    for (let i = 0; i < firstDay; i++) {
      this.calendarDays.push(0); // Empty days before the first day of the month
    }
    for (let i = 1; i <= daysInMonth; i++) {
      this.calendarDays.push(i);
    }
  }

  updateDateFormate() {
    const today = new Date();
    const day = today.getDate();
    const month = this.monthNamesFull[today.getMonth()];
    const year = today.getFullYear();
    this.dateFormate.nativeElement.innerHTML = `${day} - ${month} ${year}`;
  }

  generateCalendar(month: number, year: number) {
    const calendarDays = this.calendarDaysContainer.nativeElement;
    calendarDays.innerHTML = '';
    const calendarHeaderYear = this.calendarHeaderYear.nativeElement;
    const daysOfMonth = [31, this.getFebDays(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const currentDate = new Date();

    this.monthPicker.nativeElement.innerHTML = this.monthNamesFull[month];
    calendarHeaderYear.innerHTML = year;
    const firstDay = new Date(year, month).getDay();

    for (let i = 0; i <= daysOfMonth[month] + firstDay - 1; i++) {
      const day = document.createElement('div');
      if (i >= firstDay) {
        day.innerHTML = (i - firstDay + 1).toString();
        if (
          i - firstDay + 1 === currentDate.getDate() &&
          year === currentDate.getFullYear() &&
          month === currentDate.getMonth()
        ) {
          day.classList.add('current-date');
        }
      }
      calendarDays.appendChild(day);
    }
  }

  ngAfterViewInit() {
    this.monthPicker.nativeElement.onclick = () => {
      this.toggleMonthList();
    };

    this.monthNamesAbbr.forEach((e, index) => {
      const month = document.createElement('div');
      month.innerHTML = `<div>${e}</div>`;
      this.monthList.nativeElement.append(month);
      month.onclick = () => {
        this.selectMonth(index);
      };
    });

    document.querySelector('#pre-year')!.addEventListener('click', () => {
      this.prevYear();
    });

    document.querySelector('#next-year')!.addEventListener('click', () => {
      this.nextYear();
    });

    const currentDate = new Date();
    this.currentMonth = currentDate.getMonth();
    this.currentYear = currentDate.getFullYear();
    this.generateCalendar(this.currentMonth, this.currentYear);
  }
}
