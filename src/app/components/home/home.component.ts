import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(private service: AuthService) {}

  demo?: any;

  ngOnInit(): void {
    this.service.getDemo().subscribe((demoText) => {
      this.demo = demoText;
      console.log('demoText');
    });
    console.log(this.demo);
  }
}
