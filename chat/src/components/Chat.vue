<template>
  <!-- chat-box -->
    <div class="chat-box">
        <!-- chat-box__header -->
        <div class="chat-box__header">
            <a href="#" class="back"><i class="icon icon-left"></i></a>
            <h1 class="main-title">Добро пожаловать в онлаин-чат службы поддержки</h1>
            <div style="width: 12px;" class=""></div>
        </div>
        <!-- /chat-box__header -->
        <!-- chat-box__messages -->
        <div class="chat-box__messages" ref="chatBox">
            <div class="chat-box__separator">
                {{currentDate()}}
            </div>
            <div v-for="messageItem in history" v-bind:key="messageItem.time" class="chat-box__message" :class="!messageItem.fromServer ? 'own' : ''" >
              <div v-if="messageItem.fromServer" class="name">Служба поддержки</div>
              <div class="message">
                  {{messageItem.message}}
                  <div class="time">{{convertTime(messageItem.time)}}</div>
                  <div class="clear"></div>
              </div>
            </div>
            <div class="clear"></div>
        </div>
        <!-- /chat-box__messages -->
        <!-- chat-box__form -->
        <form class="chat-box__form main-form" v-on:submit.prevent="sendMessage">
            <textarea class="input-style" rows="7" v-model="message"></textarea>
            <div class="row">
                <label class="main-form__item file-field">
                </label>
                <div class="main-form__submit">
                    <button type="submit" :disabled="message.length === 0" class="radius-button standart rounded">Отправить</button>
                </div>
            </div>
        </form>
        <!-- /chat-box__form -->
    </div>
    <!-- /chat-box -->
</template>

<script>
import moment from 'moment';

const NAME = 'Viktor';
const SERVER_ADRESS = 'ws://localhost:9000';

export default {
  name: 'Chat',  
  data() {
    return {
        webSocketConnector: {},
        message: '',
        history: [],
    }
  },
  created() {
    this.connect();
  },
  methods: {
    connect() {
      this.webSocketConnector = new WebSocket(SERVER_ADRESS); // Открываем соединение
      this.webSocketConnector.onopen = () => {
        console.log('Connected');
      };
      this.webSocketConnector.onclose = () => { // Если соединение закрылось, пробуем еще раз через 1с
        console.log('Reconnect');
        setTimeout(() => {
          this.connect();
        }, 1000);
      };
      this.webSocketConnector.onmessage = (message) => {  // Событие на получение сообщения
        const messageReceived = {
          name: NAME,
          message: message.data,
          time: Date.now(),
          fromServer: true 
        }
        this.history.push(messageReceived)
      };
    },
    sendMessage() { // Отправка сообщение и запись его в ленту
      let msg = {name: NAME, message: this.message}
      this.webSocketConnector.send(JSON.stringify(msg));
      this.addMessageToStory(msg, Date.now(), false)
      this.message = '';
    },
    addMessageToStory(messageResponse, timeStamp, fromServer) { // Запись сообщение я ленту
      const message = {
        name: NAME,
        message: messageResponse.message,
        time: timeStamp,
        fromServer // Флаг - пришло ли сообщение с сервера или отправлено наклиентом
      }
      this.history.push(message);
      setTimeout(() => this.$refs.chatBox.scrollTop = this.$refs.chatBox.scrollHeight, 500); // Скролл окна вниз
    },
    convertTime(timeStamp) { // Конвертируем время 
      return moment(timeStamp).format('HH:mm:ss');
    },
    currentDate() {   // Текущая дата
      moment().locale('ru');
      return moment().format('DD.MM.YYYY');
    }
  },
}
</script>


<style scoped>
.chat-box {
  position: relative;
  font-family: 'ish-open', sans-serif;
  font-size: 16px;
}

.chat-box__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 60px;
}

.chat-box__header .main-title {
  margin-bottom: 0;
}

.chat-box__header .back {
  font-size: 30px;
  line-height: 1.15em;
  opacity: 0.5;
}

.chat-box__header .back:hover {
  color: #fff;
  opacity: 1;
}

.chat-box__messages {
  max-height: 500px;
  margin-bottom: 40px;
  overflow-y: scroll;
}

.chat-box__separator {
  text-align: center;
  opacity: 0.5;
  margin: 25px 0;
}

.chat-box__separator + .chat-box__message {
  margin-top: 0;
}

.chat-box__separator:first-child {
  margin-top: 0;
}

.chat-box__message {
  width: 88%;
  margin-bottom: 50px;
  margin-top: -16px;
  clear: both;
}

.chat-box__message.own {
  margin-top: 0;
  float: right;
}

.chat-box__message.own .name {
  display: none;
}

.chat-box__message.own .message {
  color: #fff;
  background: #242279;
  background: linear-gradient(90deg, #242279 0%, #1dacec 100%);
}

.chat-box__message .name {
  font-size: 0.95rem;
  opacity: 0.5;
  white-space: nowrap;
  margin-bottom: 8px;
}

.chat-box__message .message {
  background: #fff;
  color: #000;
  padding: 24px;
  border-radius: 10px;
}

.chat-box__message .time {
  float: right;
  margin-right: -5px;
  margin-left: 15px;
  opacity: 0.5;
}

.chat-box__form {
  max-width: 100% !important;
}

.chat-box__form .separator {
  max-width: 280px;
}

.chat-box__form .row {
  display: flex;
  justify-content: space-between;
}

.chat-box__form .main-form__submit {
  margin-top: 0;
}

.chat-box__form textarea {
  width: 100%;
  box-sizing: border-box;
  border: 2px solid #9b9b9b;
  margin-bottom: 25px;
}

.main-form textarea {
  width: 100%;
  box-sizing: border-box;
  border: 2px solid #9b9b9b;
  margin-bottom: 25px;
}

.main-form textarea:focus {
  border: 2px solid #1ab4ed;
}

.chat-box__form textarea:focus {
  border: 2px solid #1ab4ed;
}
.input-style:focus {
  border: none;
  outline: 3px solid #1ab4ed;
  box-shadow: none;
}

.radius-button {
  letter-spacing: 0.04em;
  font-family: 'ish-exo', sans-serif;
  color: #fff;
  border-radius: 2em;
  text-transform: uppercase;
  background: #1ab4ed;
  background: linear-gradient(90deg, #1ab4ed 0%, #0956c6 100%);
  box-sizing: border-box;
  font-weight: 400;
  display: inline-block;
  border: none;
  cursor: pointer;
}

.radius-button:disabled {
  opacity: 0.3;
}

.radius-button:focus {
  border: none;
  outline: none;
}

.radius-button:hover {
  color: #fff;
  box-shadow: rgba(23, 189, 236, 0.5) 0 0 1.5em;
}

.radius-button.standart {
  padding: 12px 40px;
  font-size: .85rem;
}

.radius-button.standart.dotted {
  padding: 11px 31px;
}

.radius-button.standart.dotted:hover {
  padding: 12px 40px;
}

.radius-button.outlined {
  background: none;
  color: #1ab4ed;
  border: 1px solid #1ab4ed;
}

.radius-button.outlined:hover {
  color: #fff;
  box-shadow: none;
  background: #1ab4ed;
}

.radius-button.dotted {
  background: rgba(26, 180, 237, 0);
  background: linear-gradient(90deg, rgba(26, 180, 237, 0) 0%, rgba(9, 86, 198, 0) 100%);
  color: #1ab4ed;
  border: 1px dashed #1ab4ed;
  transition: none;
}

.radius-button.dotted:hover {
  color: #fff;
  border: none;
  background: #1ab4ed;
  background: linear-gradient(90deg, #1ab4ed 0%, #0956c6 100%);
}

.radius-button.rounded {
  border-radius: 5px;
}

.radius-button.break {
  text-transform: none;
  background: none;
  border: 2px solid transparent;
  -o-border-image: linear-gradient(90deg, #EF513C 0%, #701010 100%);
  border-image: linear-gradient(90deg, #EF513C 0%, #701010 100%);
  border-image-slice: 1;
  background: linear-gradient(90deg, #EF513C 0%, #701010 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: #EF513C;
  transition: none;
}

.radius-button.break:hover {
  -o-border-image: linear-gradient(90deg, #f59083 0%, #b31a1a 100%);
  border-image: linear-gradient(90deg, #f59083 0%, #b31a1a 100%);
  border-image-slice: 1;
  background: linear-gradient(90deg, #f59083 0%, #b31a1a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: #f59083;
  box-shadow: none;
}

.main-title {
  text-align: center;
  margin-bottom: 2.2em;
  font-weight: 400;
  font-family: 'ish-exo', sans-serif;
}

.main-title + .subtitle {
  text-align: center;
  opacity: .5;
  font-size: .95rem;
  margin-bottom: 50px;
}

h1.main-title + .subtitle {
  margin-top: -40px;
}


</style>
