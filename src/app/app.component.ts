import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  signal,
} from '@angular/core';
import { flush } from '@angular/core/testing';

declare const Peer: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'angular-video-call';
  public peer = new Peer();
  public currentUserPeerId: string = '';
  public remoteUserPeerId: string = '';
  public currentUserMediaStream: MediaStream | null | Promise<MediaStream> =
    null;
  public remoteUserMediaStream: MediaStream | null = null;
  public currentUserCameraOn: boolean = false;

  @ViewChild('currentUserVideo') currentUserVideo: ElementRef | undefined;
  @ViewChild('remoteUserVideo') remoteUserVideo: ElementRef | undefined;

  ngAfterViewInit(): void {
    console.log(this.currentUserVideo, this.currentUserMediaStream);
  }

  ngOnInit(): void {
    this.peer.on('open', (id: string) => {
      this.currentUserPeerId = id;
      console.log('My peer ID is: ' + this.currentUserPeerId);
    });
    this.peer.on('call', (mediaConnection: any) => {
      console.log('code to receve call');

      mediaConnection.answer(this.currentUserMediaStream);
      console.log('answer called');

      mediaConnection.on('stream', (remoteMediaStream: any) => {
        console.log('stream code here');
        console.log(remoteMediaStream)
        navigator.mediaDevices
          .getUserMedia({ video: { height: 200, width: 200 }, audio: true })
          .then((mediaStream) => {
            this.remoteUserMediaStream = remoteMediaStream;
            if (this.remoteUserVideo && this.remoteUserVideo.nativeElement) {
              this.remoteUserVideo.nativeElement.srcObject = this.remoteUserMediaStream;
            } else {
              // this.currentUserVideo.nativeElement. = undefined;
            }
          });
        // `stream` is the MediaStream of the remote peer.
        // Here you'd add it to an HTML video/canvas element.
      });
    });
  }

  setCurrentUserVideo(mediaStream: MediaStream) {}

  call() {
    var call = this.peer.call(
      this.remoteUserPeerId,
      this.currentUserMediaStream
    );
    call.on('stream', function () {
      console.log('code of stream');
      // `stream` is the MediaStream of the remote peer.
      // Here you'd add it to an HTML video/canvas element.
    });
  }

  toggleCamera() {
    this.currentUserCameraOn = !this.currentUserCameraOn;
    navigator.mediaDevices
      .getUserMedia({ video: { height: 200, width: 200 }, audio: true })
      .then((mediaStream) => {
        this.currentUserMediaStream = mediaStream;
        if (this.currentUserVideo && this.currentUserVideo.nativeElement) {
          this.currentUserVideo.nativeElement.srcObject =
            this.currentUserMediaStream;
        } else {
          // this.currentUserVideo.nativeElement. = undefined;
        }
      });
  }
}
