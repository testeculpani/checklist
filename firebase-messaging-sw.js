/* Studio Thiago Hair - Push em segundo plano (Firebase Cloud Messaging) */
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey:'AIzaSyBMY_HP2McL-j5cMC3nsw9N53eEgZxE4_U',
  authDomain:'studio-74a7d.firebaseapp.com',
  projectId:'studio-74a7d',
  storageBucket:'studio-74a7d.firebasestorage.app',
  messagingSenderId:'981811079541',
  appId:'1:981811079541:web:fda182c23ac45089bf0b3c'
});

const messaging=firebase.messaging();
messaging.onBackgroundMessage(payload=>{
  // Usar envio FCM com dados (data-only) no backend; assim não duplica notificações.
  const title=payload?.data?.title||'Studio Thiago Hair';
  const body=payload?.data?.body||'Você tem um atendimento se aproximando.';
  const url=new URL('./',self.registration.scope).href;
  return self.registration.showNotification(title,{
    body,icon:'./icon-192.png',badge:'./icon-192.png',tag:payload?.data?.tag||'studio-thiago-hair',
    data:{url}
  });
});

self.addEventListener('notificationclick',event=>{
  event.notification.close();
  const url=event.notification.data?.url||new URL('./',self.registration.scope).href;
  event.waitUntil((async()=>{
    const clientsList=await clients.matchAll({type:'window',includeUncontrolled:true});
    for(const client of clientsList){
      if(client.url.startsWith(self.registration.scope)){
        await client.focus();
        return;
      }
    }
    await clients.openWindow(url);
  })());
});
