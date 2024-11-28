import { Injectable, inject, OnDestroy } from '@angular/core';
import { Firestore, collection, doc , collectionData , onSnapshot, addDoc, updateDoc} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Note } from '../interfaces/note.interface'

@Injectable({
  providedIn: 'root'
})
export class NoteListService {

  trashNotes: Note[] = [];
  normalNotes: Note[] = [];

  // items$;
  // items;

  unsubNotes;
  unsubTrash;
  

  firestore: Firestore = inject(Firestore);

  constructor() { 

    this.unsubNotes = this.subNotesList();
    this.unsubTrash = this.subTrashList();

    //oben auslesen per snapshot ---> gibt ganze liste aus --> z.b element.id --> die id / oder den data() <-- achtung ist ein function! geben wert aus wie collectionData!
    // unten mit collectionData --> gibt nur das Object aus

    // this.items$ = collectionData(this.getNotesRef())
    // this.items = this.items$.subscribe((list) => {
    //   list.forEach(element => {
    //     console.log(element)
    //   });
    // });

  }

  ngonDestroy(){
    this.unsubNotes();
    this.unsubTrash();
    // this.items.unsubscribe();
  }

  subTrashList(){
    return onSnapshot(this.getTrashRef(), (list)=>{         
      list.forEach(element => {
        this.trashNotes.push(this.setNoteObject(element.data(),element.id))
      });
    });
  }

  subNotesList(){
    return onSnapshot(this.getNotesRef(), (list)=>{                
      list.forEach(element => {
        this.normalNotes.push(this.setNoteObject(element.data(),element.id) )
      });
    });
  }

  // ---> setzt das gegebene object auf den vorgegeben classen standard , ebenfalls kann man so die ID mitgeben bei onSnapshot
  setNoteObject(obj:any, id:string):Note {
    return {
      id: id,
      type: obj.type || 'note',
      title: obj.title || '',
      content: obj.content || '',
      marked: obj.marked || false
    }
  }

  getTrashRef(){ 
    return collection(this.firestore, 'trash')   // --> zugriff auf collection trash
  }

  getNotesRef(){
    return collection(this.firestore, 'notes') // --> zugriff auf Sammlung "notes"
  }

  getSingleDocRef(collId:string, docID:string){
    return doc(collection(this.firestore, collId), docID)   // --> Zugriff auf einzeles dokument in der sammlung , varriante von collectionData
  }

  async addNote(item:{}){
    await addDoc(this.getNotesRef(),item).catch(
      (err) => {console.error(err)}
      ) //.then(
    //   (test) => { console.log("Document written with ID: ", test?.id); }
    // )  
  }

  async updateNote(colId:string,dovId:string,item: {}){
    await updateDoc(this.getSingleDocRef(colId,dovId),item).catch(
      (err) => {console.error(err)}
    )
  }

}
