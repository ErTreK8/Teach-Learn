import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root'
})
export class ServeiLogService {
  bdLog = '/log/';

  constructor(private bd: AngularFireDatabase) { }

  
}
    
