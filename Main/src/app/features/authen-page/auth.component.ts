import { Component, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  isLogin: boolean;
  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isLogin'].currentValue) {
      this.isLogin = changes['isLogin'].currentValue;
    }
  }
}
