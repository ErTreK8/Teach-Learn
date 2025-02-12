import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})

export class CalendarComponent implements OnInit {
  monthNamesAbbr = ["En", "Feb", "Mzo", "Abr", "My", "Jun", "Jul", "Ag", "Set", "Oct", "Nov", "Dic"];
  monthNamesFull = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  
  currentMonth: number;
  currentYear: number;
  daysOfMonth: number[] = [];
  calendarDays: number[] = [];

  constructor() {
    const today = new Date();
    this.currentMonth = today.getMonth();
    this.currentYear = today.getFullYear();
  }

  ngOnInit(): void {
    this.generateCalendar(this.currentMonth, this.currentYear);
  }

  isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  }

  getFebDays(year: number): number {
    return this.isLeapYear(year) ? 29 : 28;
  }

  generateCalendar(month: number, year: number): void {
    this.daysOfMonth = [31, this.getFebDays(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    this.calendarDays = [];

    const firstDay = new Date(year, month, 1).getDay();
    for (let i = 0; i < firstDay; i++) {
      this.calendarDays.push(0); // Empty spaces before the first day
    }

    for (let i = 1; i <= this.daysOfMonth[month]; i++) {
      this.calendarDays.push(i);
    }
  }

  prevYear(): void {
    this.currentYear--;
    this.generateCalendar(this.currentMonth, this.currentYear);
  }

  nextYear(): void {
    this.currentYear++;
    this.generateCalendar(this.currentMonth, this.currentYear);
  }

  selectMonth(index: number): void {
    this.currentMonth = index;
    this.generateCalendar(this.currentMonth, this.currentYear);
  }
}
