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
  public currentUserName: string = '';

  @ViewChild('currentUserVideo') currentUserVideo: ElementRef | undefined;
  @ViewChild('remoteUserVideo') remoteUserVideo: ElementRef | undefined;

  ngOnInit(): void {
    this.peer.on('open', (id: string) => {
      this.currentUserPeerId = id;
    });

    this.peer.on('call', (mediaConnection: any) => {
      mediaConnection.answer(this.currentUserMediaStream);
      console.log(this.currentUserName);
      mediaConnection.on('stream', (remoteMediaStream: any) => {
        navigator.mediaDevices
          .getUserMedia({ video: { height: 400, width: 500 }, audio: true })
          .then((mediaStream) => {
            this.remoteUserMediaStream = remoteMediaStream;
            if (this.remoteUserVideo && this.remoteUserVideo.nativeElement) {
              this.remoteUserVideo.nativeElement.srcObject =
                this.remoteUserMediaStream;
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
    var conn = this.peer.connect(this.remoteUserPeerId);
    // on open will be launch when you successfully connect to PeerServer
    conn.on('open', function () {
      // here you have conn.id
      conn.send('hi!');
    });

    call.on('stream', (remoteMediaStream: any) => {
      navigator.mediaDevices
        .getUserMedia({ video: { height: 400, width: 500 }, audio: true })
        .then((mediaStream) => {
          this.remoteUserMediaStream = remoteMediaStream;
          if (this.remoteUserVideo && this.remoteUserVideo.nativeElement) {
            this.remoteUserVideo.nativeElement.srcObject =
              this.remoteUserMediaStream;
          } else {
            // this.currentUserVideo.nativeElement. = undefined;
          }
        });

      // `stream` is the MediaStream of the remote peer.
      // Here you'd add it to an HTML video/canvas element.
    });
  }

  toggleCamera() {
    this.currentUserCameraOn = !this.currentUserCameraOn;
    navigator.mediaDevices
      .getUserMedia({ video: { height: 400, width: 500 }, audio: true })
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

  copyInviteLink() {
    navigator.clipboard.writeText(environment.app_url  + this.currentUserPeerId);
  }
}
