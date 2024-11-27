import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"notes-8da1a","appId":"1:131685614663:web:d353ebfc34a2a5b3f31d62","storageBucket":"notes-8da1a.firebasestorage.app","apiKey":"AIzaSyALSmDNsCgq_cx5F8s2chMHl_WTAt60Q9g","authDomain":"notes-8da1a.firebaseapp.com","messagingSenderId":"131685614663"}))), importProvidersFrom(provideFirestore(() => getFirestore()))]
};
