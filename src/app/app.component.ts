import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  signal,
} from '@angular/core';
import { flush } from '@angular/core/testing';
import { environment } from '../environment/environment';

declare const Peer: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
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

  ngOnInit(): void {
    this.peer.on('open', (id: string) => {
      this.currentUserPeerId = id;
    });

    this.peer.on('call', (mediaConnection: any) => {
      mediaConnection.answer(this.currentUserMediaStream);
      mediaConnection.on('stream', (remoteMediaStream: any) => {
        navigator.mediaDevices
          .getUserMedia({ video: { height: 400, width: 500 }, audio: true })
          .then((mediaStream) => {
            this.remoteUserMediaStream = remoteMediaStream;
            if (this.remoteUserVideo && this.remoteUserVideo.nativeElement) {
              this.remoteUserVideo.nativeElement.srcObject =
                this.remoteUserMediaStream;
            }
          });
        // `stream` is the MediaStream of the remote peer.
        // Here you'd add it to an HTML video/canvas element.
      });
    });
  }

  call() {
    var call = this.peer.call(
      this.remoteUserPeerId,
      this.currentUserMediaStream
    );
    var conn = this.peer.connect(this.remoteUserPeerId);

    call.on('stream', (remoteMediaStream: any) => {
      navigator.mediaDevices
        .getUserMedia({ video: { height: 400, width: 500 }, audio: true })
        .then((mediaStream) => {
          this.remoteUserMediaStream = remoteMediaStream;
          if (this.remoteUserVideo && this.remoteUserVideo.nativeElement) {
            this.remoteUserVideo.nativeElement.srcObject =
              this.remoteUserMediaStream;
          }
        });
    });
  }

  openCamera() {
    this.currentUserCameraOn = !this.currentUserCameraOn;
    navigator.mediaDevices
      .getUserMedia({ video: { height: 400, width: 500 }, audio: true })
      .then((mediaStream) => {
        this.currentUserMediaStream = mediaStream;
        if (this.currentUserVideo && this.currentUserVideo.nativeElement) {
          this.currentUserVideo.nativeElement.srcObject = this.currentUserMediaStream;
        }
      });
  }

  copyInviteCode() {
    navigator.clipboard.writeText(this.currentUserPeerId);
  }
}
