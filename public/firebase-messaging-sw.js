// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js')

// Initialize the Firebase app in the service worker
// "Default" Firebase configuration (prevents errors)
const firebaseConfig = {
    apiKey: 'AIzaSyCYUJZPP6-ZhNwFvOz5-hvl2uCut4EcHfc',
    authDomain: 'pushcalls.firebaseapp.com',
    projectId: 'pushcalls',
    storageBucket: 'pushcalls.firebasestorage.app',
    messagingSenderId: '746981175271',
    appId: '1:746981175271:web:a8fd97ad76b2c258301742',
    measurementId: 'G-Z2ZRYYR56F'
}

firebase.initializeApp(firebaseConfig)

// Retrieve firebase messaging
const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
    console.log('lol')
    console.log(payload)
    if (payload.data.type !== 'clear_message') {
        const notificationTitle = payload.notification.title
        const notificationOptions = {
            body: payload.notification.body || '',
            icon: payload.notification?.image
        }

        self.registration.showNotification(notificationTitle, notificationOptions)
    }
})
