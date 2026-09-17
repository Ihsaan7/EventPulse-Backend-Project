const schema= `
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT CHECK(role IN('ATTENDEE' , 'ORGANIZER' , 'ADMIN')) DEFAULT 'ATTENDEE',
        refresh_token TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS events(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        organizer_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        venue TEXT NOT NULL,
        start_time  TEXT NOT NULL,
        status TEXT CHECK(status IN ('DRAFT','PUBLISHED','CANCELLED','COMPLETED')) DEFAULT 'DRAFT',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE CASCADE 
    );

    CREATE TABLE IF NOT EXISTS ticket_tiers(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_id INTEGER NOT NULL,
        tier_name TEXT NOT NULL,
        price REAL NOT NULL CHECK (price >=0),
        available_seats INTEGER NOT NULL,
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS bookings(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        attendee_id INTEGER NOT NULL,
        tier_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        total_price REAL NOT NULL,
        booking_status TEXT CHECK (booking_status IN ('PENDING_LOCK' , 'PAID' , 'CANCELLED' , 'EXPIRED')) DEFAULT 'PENDING_LOCK',
        seat_lock_expires_at TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (attendee_id) REFERENCES users(id),
        FOREIGN KEY (tier_id) REFERENCES ticket_tiers(id)

    );

    CREATE TABLE IF NOT EXISTS checkins(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        booking_id INTEGER UNIQUE NOT NULL,
        qr_code TEXT UNIQUE NOT NULL,
        verified_by_organizer_id INTEGER NOT NULL,
        checked_in_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (booking_id) REFERENCES bookings(id),
        FOREIGN KEY (verified_by_organizer_id) REFERENCES users(id)
    )
`


export const initSchema = (db)=>
    {
        return new Promise((resolve , reject)=>
            {
                db.exec(schema , (err)=>
                    {
                        if(err) return reject(err)
                        console.log("📑 Database schema &amp; tables initialized successfully!");
                        resolve();
                    })
            })
    }