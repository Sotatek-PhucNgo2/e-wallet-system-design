const { Client } = require('pg');
const { faker } = require('@faker-js/faker');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

// Thông tin kết nối PostgreSQL từ file .env
const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
};

// Số lượng bản ghi
const numUsers = 50000000; // Dùng số nhỏ hơn để thử nghiệm trước
const numWallets = 10000000; // Dùng số nhỏ hơn để thử nghiệm trước
const numTransactions = 10000000; // Dùng số nhỏ hơn để thử nghiệm trước

// Kích thước mỗi đợt chèn
const batchSize = 100000;

async function insertUsers(client, numRecords, batchSize) {
    const sql = "INSERT INTO users (username, email) VALUES ";
    for (let i = 0; i < numRecords; i += batchSize) {
        const batch = [];
        for (let j = 0; j < Math.min(batchSize, numRecords - i); j++) {
            const emailWithUUID = `${uuidv4().replace(/-/g, '')}${faker.internet.email()}`;
            batch.push(`('${faker.internet.userName()}', '${emailWithUUID}')`);
        }
        await client.query(sql + batch.join(","));
        console.log(`Inserted ${i + batch.length} / ${numRecords} users`);
    }
}

async function insertWallets(client, numRecords, validUserIds, batchSize) {
    const sql = "INSERT INTO wallets (user_id, balance) VALUES ";
    for (let i = 0; i < numRecords; i += batchSize) {
        const batch = [];
        for (let j = 0; j < Math.min(batchSize, numRecords - i); j++) {
            const userId = validUserIds[Math.floor(Math.random() * validUserIds.length)];
            batch.push(`(${userId}, ${(Math.random() * 10000).toFixed(2)})`);
        }
        await client.query(sql + batch.join(","));
        console.log(`Inserted ${i + batch.length} / ${numRecords} wallets`);
    }
}

async function insertTransactions(client, numRecords, walletIds, batchSize) {
    const sql = "INSERT INTO transactions (from_wallet, to_wallet, amount, nonce) VALUES ";
    for (let i = 0; i < numRecords; i += batchSize) {
        const batch = [];
        for (let j = 0; j < Math.min(batchSize, numRecords - i); j++) {
            let fromWallet = walletIds[Math.floor(Math.random() * walletIds.length)];
            let toWallet;
            do {
                toWallet = walletIds[Math.floor(Math.random() * walletIds.length)];
            } while (toWallet === fromWallet);
            const amount = (Math.random() * 1000).toFixed(2);
            const nonce = Math.floor(Math.random() * 1000000);
            batch.push(`(${fromWallet}, ${toWallet}, ${amount}, ${nonce})`);
        }
        await client.query(sql + batch.join(","));
        console.log(`Inserted ${i + batch.length} / ${numRecords} transactions`);
    }
}

(async () => {
    const client = new Client(config);
    await client.connect();
    console.log("Connected to PostgreSQL");

    await client.query("BEGIN");
    try {
        console.log("Disabling indexes and constraints...");
       // await client.query("ALTER TABLE users DISABLE TRIGGER ALL");
        await client.query("ALTER TABLE wallets DISABLE TRIGGER ALL");
       // await client.query("ALTER TABLE transactions DISABLE TRIGGER ALL");

        console.log("Inserting users...");
        // await insertUsers(client, numUsers, batchSize);

        // Get valid user IDs 

        console.log("Inserting wallets...");
        //await insertWallets(client, numWallets, validUserIds, batchSize);
        const res = await client.query("SELECT wallet_id FROM wallets");
        const walletIds = res.rows.map(row => row.wallet_id);
        console.log("Inserting transactions...");
        await insertTransactions(client, numTransactions, walletIds, batchSize);

        console.log("Re-enabling indexes and constraints...");
       // await client.query("ALTER TABLE users ENABLE TRIGGER ALL");
        await client.query("ALTER TABLE wallets ENABLE TRIGGER ALL");
       // await client.query("ALTER TABLE transactions ENABLE TRIGGER ALL");

        await client.query("COMMIT");
    } catch (error) {
        console.error("Error occurred, rolling back transaction...", error);
        await client.query("ROLLBACK");
    } finally {
        await client.end();
        console.log("Data insertion completed and connection closed.");
    }
})();
