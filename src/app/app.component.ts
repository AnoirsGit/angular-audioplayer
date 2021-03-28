import { Component } from '@angular/core';
import * as moment from 'moment/moment';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  audioObj = new Audio();
  player: boolean = false;
  seek: number = 0;
  durationNum: number = 0;
  audioVolume: number = 0.5;
  audioState: string = "";
  duration: number | string = '00:00';
  currenTime: number | string = '00:00';
  audioEvents = [
    'ended',
    'error',
    'play',
    'playing',
    'pause',
    'timeupdate',
    'canplay',
    'loadmetadata',
    'loadstart'
  ];
  openAudio(url) {
    this.streamObserver(url).subscribe();
  }

  play() {
    this.audioObj.play();
    this.audioState = 'playing';
  };

  pause() {
    this.audioObj.pause();
    this.audioState = 'pause';
  }

  stop() {
    this.audioObj.pause();
    this.audioState = 'stopped';
    this.audioObj.currentTime = 0;
  }

  setVolume(vol) {
    this.audioObj.volume = this.audioVolume;
  }

  setTime(time) {
    this.audioObj.currentTime = time;
  }

  streamObserver(url) {
    return new Observable(obs => {
      this.player = true;
      this.audioObj.src = url;
      this.audioObj.load();
      this.audioObj.play();
      this.audioState = 'playing';
      const handler = (event: Event) => {
        this.seek = this.audioObj.currentTime;
        this.durationNum = this.audioObj.duration;
        this.duration = this.audioTimeFormatter(this.audioObj.duration);
        this.currenTime = this.audioTimeFormatter(this.audioObj.currentTime);
      }

      this.addEvent(this.audioObj, this.audioEvents, handler);

      return () => {
        this.audioObj.pause();
        this.audioObj.currentTime = 0;
        this.removeEvent(this.audioObj, this.audioEvents, handler);
      }
    });
  }

  addEvent(obj, events, handler) {
    events.forEach(event => {
      obj.addEventListener(event, handler);
    });
  }

  removeEvent(obj, events, handler) {
    events.forEach(event => {
      obj.removeEventListener(event, handler)
    });
  }

  audioTimeFormatter(time, format = "mm:ss") {
    return moment.utc(time * 1000).format(format);
  }
}
