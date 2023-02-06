import { Component, OnInit } from '@angular/core';
import Headroom from 'headroom.js';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-auth-layout.component.html',
})
export class MainAuthLayoutComponent implements OnInit {
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
}
