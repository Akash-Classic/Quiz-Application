import { QuestionService } from './../service/question.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { interval } from 'rxjs';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {

  public name: string = "";
  questionsList: any = [];
  currentQuestion: number = 0;
  points: number = 0;
  counter = 30;
  currectAnswers: number = 0;
  incorrectAnswers: number = 0;
  interval$ : any;
  val: number = 0;
  res!: boolean ;

  constructor(private questionService: QuestionService) { }

  ngOnInit(): void {
    this.name = localStorage.getItem("name")!;
    this.getAllQuestions();
    this.startCounter();
  }

  getAllQuestions(){
    this.questionService.getQuestionJson().subscribe(
      res => {
        this.questionsList = res.questions;
      }
    )
  }

  nextQuestion(){
    if(this.currentQuestion<9){
      this.currentQuestion++;
      this.val +=10;
      this.counter = 30;
    }else{
      this.res = true;
    }
      
      }

  previousQuestion(){
    
          this.currentQuestion--;
          this.val-=10;
          this.counter = 30;
         
  }

  answer(queNo: number, opt: any){
    
    if(opt.correct){
      if(this.currentQuestion<9){
        this.points+=10;
        this.currectAnswers+=1;
        setTimeout(()=> {
          this.currentQuestion++;
        this.val+=10;
        this.counter = 30;
        }, 500)
      }else{
        this.points+=10
        this.val+=10;
        this.currectAnswers+=1;
        this.res = true;
        this.stopCounter();
      }
    }else{
      if(this.currentQuestion<9){
        this.points-=5;
        setTimeout(()=> {
          this.currentQuestion++;
          this.incorrectAnswers++;
          this.val+=10;
          this.counter = 30;
        }, 500)
      }else{
        this.points-=5;
        this.val+=10;
        this.incorrectAnswers++;
        this.res = true;
        this.stopCounter();
      }
    }
  }
   

  startCounter(){
         this.interval$ = interval(1000).subscribe(val => {
           this.counter--;
           if(this.counter===0){
             if(this.currentQuestion<9){
              this.currentQuestion++;
              this.counter = 30;
              this.val+=10;
             }else{
               this.val+=10;
              this.res = true;
              this.stopCounter();
             }
             
             }
           
         });
         setTimeout(() => {
              this.interval$.unsubscribe();
         }, 600000)
  }

  stopCounter(){
      this.interval$.unsubscribe();
      this.counter = 0;
  }

  resetCounter(){
       this.stopCounter();
       this.counter = 30;
       this.startCounter();
  }

  onRefreshQuiz(){
    this.resetCounter();
    this.getAllQuestions();
    this.points = 0;
    this.currentQuestion = 0;
    this.val = 10;
  }
   
  onBack(){
    this.res = false;
    this.currentQuestion = 0;
    this.points = 0;
    this.counter = 30;
    this.val = 0;
    this.incorrectAnswers = 0;
    this.currectAnswers = 0;
   this.startCounter();
  }
 
}
