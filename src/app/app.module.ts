import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { DeviceOrientation } from '@awesome-cordova-plugins/device-orientation/ngx';
import { DeviceMotion } from '@awesome-cordova-plugins/device-motion/ngx';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    DeviceOrientation,
    DeviceMotion,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
