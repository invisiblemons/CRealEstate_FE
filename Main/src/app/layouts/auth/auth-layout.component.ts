import { Component, OnInit } from '@angular/core';
import Headroom from 'headroom.js';

@Component({
  selector: 'app-layout',
  templateUrl: './auth-layout.component.html',
})
export class AuthLayoutComponent implements OnInit {
  isLogin: boolean;
  ngOnInit() {
    var headroom = new Headroom(document.querySelector('#navbar-main'), {
      offset: 300,
      tolerance: {
        up: 30,
        down: 30,
      },
    });
    headroom.init();
  }

  getIsLogin(value) {
    this.isLogin = value;
  }
}
