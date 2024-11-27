import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc , collectionData , onSnapshot} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Note } from '../interfaces/note.interface'

@Injectable({
  providedIn: 'root'
})
export class NoteListService {

  trashNotes: Note[] = [];
  normalNotes: Note[] = [];
  items$;

  // unsubList;
  // unsubSingle;

  firestore: Firestore = inject(Firestore);

  constructor() { 
    this.items$ = collectionData(this.getNotesRef());


    // this.unsubList = onSnapshot(this.getNotesRef(), (list)=>{                
    //   list.forEach(element => { console.log(element)})
    // });

    // this.unsubSingle = onSnapshot(this.getSingleDocRef('notes', 'saldfhfbds3423'), (element)=>{
      
    // });

    // this.unsubSingle();
    // this.unsubList();          // Nicht wirklich verstanden was dieses onSnapshot macht , oder ausließt?
  }

  getTrashRef(){ 
    return collection(this.firestore, 'trash')   // --> zugriff auf collection trash
  }

  getNotesRef(){
    return collection(this.firestore, 'notes') // --> zugriff auf Sammlung "notes"
  }

  getSingleDocRef(collId:string, docID:string){
    return doc(collection(this.firestore, collId), docID)   // --> Zugriff auf einzeles dokument in der sammlung
  }
}
