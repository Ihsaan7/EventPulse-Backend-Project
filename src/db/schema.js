const schema= `
    CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT CHECK(role IN('ATTENDEE' , 'ORGANIZER' , 'ADMIN')) DEFUALT 'ATTENDEE',
        refresh_token TEXT,
        created_at DATETIME DEFUALT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS events(
        id INTEGERS PRIMARY KEY INCREMENT,
        organizer_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        venue TEXT NOT NULL,
        start_time  DATATIME NOT NULL,
        status TEXT CHECK(status IN ('DRAFT','PUBLISHED','CANCELLED')) DEFAULT 'DRAFT'
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FORIENGN KEY (organizer_id) REFRENECE users(id) ON DELETE CASCADE 
    );

    CREATE TABLE IF NO EXISTS ticket_tiers(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_id INTEGER NOT NULL,
        tier_name TEXT NOT NULL,
        price REAL NOT NULL CHECK (price >=0),
        available_seats INTEGER NOT NULL,
        FOREIGN KEY (event_id) REFRENCE events(id) ON DELETE CASCADE
    )

    CREATE TABLE IF NO EXISTS bookings(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        attendee_id INTEGER NOT NULL,
        tier_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        total_price REAL NOT NULL,
        booking_status TEXT CHECK (booking_status IN ('PENDING_LOCK' , 'PAID' , 'CANCELLED' , 'EXPIRED')) DEFUALT 'PENDING_LOCK',
        seat_lock_expires_at DATETIME;
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (attendee_id) REFRENCE users(id)
        FOREIGN KEY (tier_id) REFRENCE ticket_tiers(id)

    )

    CREATE TABLE IF NOT EXISTS checkins(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        booking_id INTEGER UNIQUE NOT NULL,
        qr_code INTEGER UNIQUE NOT NULL,
        verified_by_organizer_id INTEGER NOT NULL,
        checked_in_at DATETIME DEFAULR CURRENT_TIMESTAMP,
        FOREIGN KEY (booking_id) REFRENCE bookings(id)
        FOREIGN KEY (verified_by_oraganizer_id) REFRENCE users(id)
    )
`


export const initSchema = (db)=>
    {
        return new Promise((resolve , reject)=>
            {
                db.run("PRAGMA foreign_keys = ON;", (err)=>
                    {
                        if(err) return reject(errr)

                        db.exec(schema , (execError)=>
                            {
                                if (execErr) { console.error("❌ Failed to initialize database schema:", execErr.message); 
                                    return reject(execErr); 
                                } 
                                console.log("📑 Database schema &amp; tables initialized successfully!"); 
                                resolve(); 
                            })
                    })
            })
    }