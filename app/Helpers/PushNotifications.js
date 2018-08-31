'use strict'

const admin = require('firebase-admin')

const serviceAccount = require('../../langsungjalan_firebase.json')

class PushNotification {
  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: 'https://langsungjalan-213303.firebaseio.com'
    })
  }

  async sendToMobile(topic, data) {
    const message = {
      data,
      topic
    }

    // Send a message to devices subscribed to the provided topic.
    admin
      .messaging()
      .send(message)
      .then(response => {
        // Response is a message ID string.
        console.log('Successfully sent message:', response) //eslint-disable-line
      })
      .catch(error => {
        console.log('Error sending message:', error) //eslint-disable-line
      })
  }
}

module.exports = new PushNotification()
