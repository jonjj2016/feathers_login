const socket = io()
const client = feathers();

client.configure(feathers.socketio(socket));

client.configure(feathers.authentication());

const login = async (credentials) => {
  try {
    if(!credentials) {
      await client.reAuthenticate()
    } else {
      await client.authenticate({
        strategy:'local',
        ...credentials
      })
    }
    // show chat messages
    console.log('Signup login success go to chat window');
    showChat()
  } catch (error) {
    showLogin(error)
}
}
const main = async () => {
  const auth = await login();
  console.log('User is authenticated', auth);
//   await client.logout()
}
main()

const loginHtml =`
<main class="login container">
    <div class="row">
        <div class="col-12 col-6-tablet push-3-tablet text-center heading">
            <h1 class="font-100">
                Login or Sign Up
            </h1>
        </div>
    </div>
    <div class="row">
      <div class="col-12 col-6-tablet push-3-tablet col-4-desktop push-4-desktop">
        <form  class="form">
          <fieldset>
            <input type="email" name="email" class="block" placeholder="email"/>
          </fieldset>
          <fieldset>
            <input type="password" name="password" class="block" placeholder="password"/>
          </fieldset>
          <button type="button" id="login" class="buttoon button-primary block signup">Log In</button>
          <button type="button" id="signup" class="buttoon button-primary block signup">Sign up and Log In</button>
          <a href="" class="button button-primary block" href="/oauth/github">
          Login with GitHub
          </a>

        </form>
      </div>
    </div>
</main>
`;

const chatHtml = `
<main class="flex flex-column">
<header class="title-bar flex flex-row flex-center">
  <div class="title-wrapper block center-element">
    <img src="http://feathersjs.com/img/feathers-logo-wide.png" alt="Feathers logo" class="logo">
    <span class="title">
      Chat
    </span>
  </div>
</header>
<div class="flex flex-row flex-1 clear">
       <aside class="sidebar col col-3 flex-column flex-space-between">
         <header class="flex flex-row flex-center">
           <h4 class="font-300 text-center">
                <span class="font-600 online-count">0</span>
                Users
            </h4>
         </header>
         <ul class="flex flex-column flex-1 list-unstyled user-list"></ul>
        <footer class="flex flex-row flex-center">
            <a href="#" class="button button-primary" id="logout"> Sign Out</a>
        </footer>
       </aside>
       <div class="flex flex-column col col-9">
       <main class="chat flex flex-column flex-1 clear"></main>
       <form action="" class="flex flex-space-betweenflex-row" id="send-message">
         <input type="text" name="text" class="flex flex-1">
         <button class="button-primary">Send</button>
       </form>
     </div>
     </div>
</main>
`
const addMessage = (message) => {
  const {user = {}} = message;
  const chat = document.querySelector('.chat');
  const text = message.text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
  if(chat) {
    chat.innerHTML+=`
      <div class="message flex flex-row">
         <img src="${user.avatar}" alt="${user.email}" class="avatar">
         <div class="message-wrapper">
           <p class="message-header">
             <span class="username font-600">${user.email}</span>
             <span class="sent-date font-300">${moment(message.createdAt).format('MMM DD, hh:mm:ss')}</span>
            
          </p>
          <p class="message-content font-300">
            ${text}
          </p>
         </div>
        </div>
    `;
    chat.scrollTop= chat.scrollHeight-chat.clientHeight;
  }
}

const addUser = (user) => {
  const userList = document.querySelector('.user-list');
  if(userList) {
    userList.innerHTML+=`
        <li>
          <a href="#" class="block relative">
            <img src="${user.avatar}" alt="${user.email}" class="avatar">
            <span class="absolute username">${user.email}</span>
          </a>
        </li>
        `;
    const userCount = document.querySelectorAll('.user-list li').length;
    document.querySelector('.online-count').innerHTML=userCount

  }
}

const showLogin =(err)=>{
  if(document.querySelectorAll('.login').length && err) {
    document.querySelector('.heading').insertAdjacentHTML('beforeend',`<p>There was an Error: ${err.message}</p>`)
  }else {
      document.getElementById('app').innerHTML=loginHtml;
  }
}
const showChat = async () => {
  document.getElementById('app').innerHTML=chatHtml
  const messages = await client.service('messages-2').find({
    $sort: { createdAt: -1 },
    $limit: 25
  });
  console.log(messages);
  messages.data.reverse().forEach(addMessage)
  const users = await client.service('users').find({})
  console.log(users);
  users.data.forEach(addUser)

}
const getCredentials = () =>{
  const user = {
    email: document.querySelector('[name="email"]').value,
    password: String(document.querySelector('[name="password"]').value),
    
  }
  return user
}
const addEventListener = (selector, event, handler) =>{
  document.addEventListener(event,async ev=>{
    if(ev.target.closest(selector)) {
      handler(ev)
    }
  })
}
addEventListener('#signup','click', async()=>{
  const credentials = getCredentials();
  await client.service('users').create(credentials)
  await login(credentials)
})
addEventListener('#logout','click', async () => {
  await client.logout()
  document.getElementById('app').innerHTML= loginHtml
})
addEventListener('#login','click', async()=>{
    const credentials = getCredentials();
    await login(credentials)
})
addEventListener('#send-message','submit',async ev=>{
  ev.preventDefault()
  const input = document.querySelector('[name="text"]');
    await client.service('messages-2').create({
        text:input.value
    });
    input.value=''
})
client.service('messages-2').on('created', addMessage)