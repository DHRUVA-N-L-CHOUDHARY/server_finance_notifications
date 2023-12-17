const express = require('express');
const admin = require('firebase-admin');
const cron = require('node-cron');

const app = express();
const port = 3000;

// Initialize Firebase
const serviceAccount = require('./finance_firebase_key.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://financeapp-1ec88.firebaseio.com',
});

// Firestore reference
const db = admin.firestore();

// Function to retrieve upcoming bills
async function getUpcomingBills() {
  const now = new Date();
  const snapshot = await db
    .collection('bills')
    .where('dueDate', '>=', now)
    .orderBy('dueDate')
    .get();

  return snapshot.docs.map(doc => doc.data());
}

// Function to schedule notifications
function scheduleNotifications(bills) {
  for (const bill of bills) {
    const dueDate = bill.dueDate.toDate();
    const billTitle = bill.title;

    // Add your logic to send notifications here
    console.log(`Schedule notification for bill "${billTitle}" on ${dueDate}`);
  }
}

// Automation logic using cron
cron.schedule('0 12 * * *', async () => {
  try {
    const upcomingBills = await getUpcomingBills();
    scheduleNotifications(upcomingBills);
    let message = {
      notification: {
        title: "You have notification from Bll Due",
        body: body,
      },
      token: bill.fcm_token,
    }; 
    FCM.send(message, function (err, resp) {
      if (err) {
        console.log(err);
      } else {
        console.log("NOtficat");
      }
    });
  console.log("hello i working yahooooo.....");
  } catch (error) {
    console.error('Error retrieving or scheduling notifications:', error);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
