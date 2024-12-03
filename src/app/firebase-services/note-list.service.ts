import { Injectable, inject, OnDestroy } from '@angular/core';
import { Firestore, collection, doc , collectionData , onSnapshot, addDoc, updateDoc, deleteDoc, orderBy, limit, query, where} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Note } from '../interfaces/note.interface'

@Injectable({
  providedIn: 'root'
})
export class NoteListService {

  trashNotes: Note[] = [];
  normalNotes: Note[] = [];
  favNotes:Note[] = [];

  // items$;
  // items;

  unsubNotes;
  unsubTrash;
  unsubNotesList;

  firestore: Firestore = inject(Firestore);

  constructor() { 

    this.unsubNotes = this.subNotesList();
    this.unsubTrash = this.subTrashList();
    this.unsubNotesList = this.subNotesMarkedList();
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
    this.unsubNotesList();
    // this.items.unsubscribe();
  }

  subTrashList(){
    return onSnapshot(this.getTrashRef(), (list)=>{  
      this.trashNotes = [] ;     
      list.forEach(element => {
        this.trashNotes.push(this.setNoteObject(element.data(),element.id))
      });
    });
  }

  // um auf eine Subref zu kommen (Sammlung in einer sammlung)
  // collection(doc(collection(this.firestore,"notes"), subsammlingsIdhier ), "namederSubsammlung");   <--- anstelle hier unten getNotesRef()
  // oder 
  // collection(this.firestore,"notes/subsammlingsIdhier/namederSubsammlung"); <--als "pfad"

  subNotesList(){
    const q = query(this.getNotesRef(),orderBy('title'),  limit(50)); // orderBy() und where arbeiten nicht zusammen! --> error /,orderBy('title')
    return onSnapshot(q, (list)=>{ 
      this.normalNotes = [] ;                
      list.forEach(element => {
        this.normalNotes.push(this.setNoteObject(element.data(),element.id))
      });
    });
  }

  subNotesMarkedList(){
    const q = query(this.getNotesRef(),where("marked","==",true),  limit(50)); 
    return onSnapshot(q, (list)=>{ 
      this.favNotes = [] ;                
      list.forEach(element => {
        this.favNotes.push(this.setNoteObject(element.data(),element.id) )
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

  async addNote(item:Note, colId: "notes"|"trash"){
    if (colId == "notes") {
      await addDoc(this.getNotesRef(),item).catch(
        (err) => {console.error(err)}
        )
    } else {
      await addDoc(this.getTrashRef(),item).catch(
        (err) => {console.error(err)}
        )
    }  
      //.then(
    //   (test) => { console.log("Document written with ID: ", test?.id); }
    // )  
  }

  async delteNote(collId:"notes"|"trash",docID:string){
    await deleteDoc(this.getSingleDocRef(collId,docID)).catch(
      (err) => {console.error(err)})
  }

  async updateNote(note: Note){
    if (note.id) {
      let docRef = this.getColIdfromNote(note);
      let item =  this.getCleanJson(note);
      await updateDoc(this.getSingleDocRef(docRef ,note.id),item).catch(
        (err) => {console.error(err)}
      )
    }
  }

  getCleanJson(note:Note):{} {
    return {
      type: note.type,
      title: note.title,
      content: note.content,
      marked: note.marked,
    }
  }

  getColIdfromNote(note:Note):string{
    if (note.type == 'note') {
      return 'notes'
    } else {
      return 'trash'
    }
  }

}
