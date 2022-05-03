import { Component, OnDestroy, OnInit } from '@angular/core';
import { DeviceOrientationCompassHeading } from '@awesome-cordova-plugins/device-orientation';
import { DeviceOrientation } from '@awesome-cordova-plugins/device-orientation/ngx';
import { Subscription } from 'rxjs';
import {
  DeviceMotion,
  DeviceMotionAccelerationData,
} from '@awesome-cordova-plugins/device-motion/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  subscription: Subscription[] = [];
  magnetometerData: DeviceOrientationCompassHeading;
  direction: string;
  constructor(
    private deviceOrientation: DeviceOrientation,
    private deviceMotion: DeviceMotion
  ) {}

  ngOnInit(): void {
    // Get the device current compass heading
    this.deviceOrientation.getCurrentHeading().then(
      (data: DeviceOrientationCompassHeading) => console.log(data),
      (error: any) => console.log(error)
    );
    // Watch the device compass heading change
    this.subscription.push(
      this.deviceOrientation
        .watchHeading()
        .subscribe((data: DeviceOrientationCompassHeading) => {
          this.magnetometerData = data;
          this.direction=this.cardinalDirection(this.magnetometerData);
        })
    );

    // Get the device current acceleration
    this.deviceMotion
      .getCurrentAcceleration()
      .then((acceleration: DeviceMotionAccelerationData) => {
        console.log(acceleration), (error: any) => console.log(error);
      });

    // Watch device acceleration
    this.subscription.push(
      this.deviceMotion
        .watchAcceleration()
        .subscribe((acceleration: DeviceMotionAccelerationData) => {
          console.log(acceleration);
        })
    );
  }
  cardinalDirection(magnetometerData) {
    const SECTOR = 360 / 8; // = 45
    const HALF_SECTOR = SECTOR / 2; // = 22.5

    // 337.5 - 360 && 0 - 22.5
    const isN =
      (magnetometerData.magneticHeading >= 360 - HALF_SECTOR &&
        magnetometerData.magneticHeading <= 360) ||
      (magnetometerData.magneticHeading >= 0 &&
        magnetometerData.magneticHeading < HALF_SECTOR);
    // 22.5 - 67.5
    const isNE =
      magnetometerData.magneticHeading >= HALF_SECTOR &&
      magnetometerData.magneticHeading < HALF_SECTOR + SECTOR;
    // 67.5 - 112.5
    const isE =
      magnetometerData.magneticHeading >= HALF_SECTOR + SECTOR &&
      magnetometerData.magneticHeading < HALF_SECTOR + SECTOR * 2;
    // 112.5 - 157.5
    const isSE =
      magnetometerData.magneticHeading >= HALF_SECTOR + SECTOR * 2 &&
      magnetometerData.magneticHeading < HALF_SECTOR + SECTOR * 3;
    // 157.5 - 202.5
    const isS =
      magnetometerData.magneticHeading >= HALF_SECTOR + SECTOR * 3 &&
      magnetometerData.magneticHeading < HALF_SECTOR + SECTOR * 4;
    // 202.5 - 247.5
    const isSW =
      magnetometerData.magneticHeading >= HALF_SECTOR + SECTOR * 4 &&
      magnetometerData.magneticHeading < HALF_SECTOR + SECTOR * 5;
    // 247.5 - 292.5
    const isW =
      magnetometerData.magneticHeading >= HALF_SECTOR + SECTOR * 5 &&
      magnetometerData.magneticHeading < HALF_SECTOR + SECTOR * 6;
    // 292.5 - 337.5
    const isNW =
      magnetometerData.magneticHeading >= HALF_SECTOR + SECTOR * 6 &&
      magnetometerData.magneticHeading < HALF_SECTOR + SECTOR * 7;

    if (isN) {
      return 'North';
    } else if (isNE) {
      return 'North East';
    } else if (isE) {
      return 'East';
    } else if (isSE) {
      return 'South East';
    } else if (isS) {
      return 'South';
    } else if (isSW) {
      return 'South West';
    } else if (isW) {
      return 'West';
    } else if (isNW) {
      return 'North West';
    }
  }
  ngOnDestroy(): void {
    // Stop watching heading change
    this.subscription.map((s) => {
      s.unsubscribe();
    });
  }
}