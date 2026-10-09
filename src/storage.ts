import { openDB } from 'idb';
import {seed,type Data} from './model';
// A single storage boundary allows a future encryption codec and encrypted backup adapter.
// Prototype records are currently stored as plaintext. Never use real student information.
const database=openDB('ot-command-center',1,{upgrade(db){db.createObjectStore('workspace');}});
export async function loadData():Promise<Data>{const db=await database;const existing=await db.get('workspace','data');if(existing)return existing;const data=seed();await db.put('workspace',data,'data');return data;}
export async function saveData(data:Data){await (await database).put('workspace',data,'data');}
