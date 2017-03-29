import Dexie from 'dexie';

const db = new Dexie('RobInDaHood');
//db.version(1).stores({ todos: '++id' });
db.version(1).stores({ instruments: "++id, min_tick_size, splits, margin_initial_ratio, url, quote, symbol, bloomberg_unique, list_date, fundamentals, state, country, day_trade_ratio, tradeable, maintenance_ratio, id, market, name" });


export default db;
