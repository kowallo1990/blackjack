<template>
  <div class="blackjack">
    <div
      class="blackjack__lostGame"
      v-if="gameOver"
      @click="restartGame"
    >
      <div
        class="blackjack__lostGame-info"
      >
        {{gameResult}}
      </div>
    </div>
    <div class="blackjack__your-cards">
      <div
        class="blackjack_card"
        v-for="card in enemyCard"
      >
        <div class="blackjack_card-color">
          <div v-if="card.color==='hearts'" class="blackjack_card-color-red">♥</div>
          <div v-if="card.color==='diamond'" class="blackjack_card-color-red">♦</div>
          <div v-if="card.color==='spades'" class="blackjack_card-color-black">♠</div>
          <div v-if="card.color==='clubs'" class="blackjack_card-color-black">♣</div>
        </div>
        <div class="blackjack_card-figure">
          {{card.figure}}
        </div>
      </div>
    </div>


    <div class="blackjack__console">
      <div class="blackjack__elements">
        <div class="blackjack__buttons-container">
          <div
            class="blackjack__button"
            @click="newGame"
            v-if="canNewGame && yourMoney > 0"
          >
            NewGame
          </div>
          <div
            v-if="yourPoints<21"
            class="blackjack__button"
            @click="() => {
              if (!stopGettingCard && bet !==0 && myCards.length >=2) {
                getCard(myCards);
                sumPoints(yourPoints);
              }
            }"
          >
            Get Card
          </div>
          <div
            class="blackjack__button"
            @click="stay"
          >
            Stay
          </div>
        </div>
        <div class="blackjack__info">
          <div>
            Your Points: {{playerPoints}}
          </div>
          <div>
            Money: {{money}} $
          </div>
          <div>
            Bet: {{ bet }}
          </div>
        </div>
      </div>
      <input
        v-if="!cardTaken"
        type="text"
        v-model="bet"
      >
      </input>
    </div>


    <div class="blackjack__your-cards">
      <div
        class="blackjack_card"
        v-for="card in myCards"
      >
        <div class="blackjack_card-color">
          <div v-if="card.color==='hearts'" class="blackjack_card-color-red">♥</div>
          <div v-if="card.color==='diamond'" class="blackjack_card-color-red">♦</div>
          <div v-if="card.color==='spades'" class="blackjack_card-color-black">♠</div>
          <div v-if="card.color==='clubs'" class="blackjack_card-color-black">♣</div>
        </div>
        <div class="blackjack_card-figure">
          {{card.figure}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from '../store/index.js'

export default {
  name: 'BlackJack',
  data() {
    return {
      figures: store.state.figures,
      bet: 0,
      myCards: [],
      yourPoints: 0,
      enemyCard: [],
      enemyPoint: 0,
      yourMoney: 100,
      pointResult: '',
      cardTaken: false,
      index: 12,
      stopGettingCard: false,
      canNewGame: true,
      gameOver: false
    }
  },
  props: {
    msg: String
  },
  computed: {
    playerPoints() {
      return this.yourPoints;
    },
    money() {
      return this.yourMoney;
    },
    gameResult() {
      return this.pointResult;
    }
  },
  methods: {
    makeDeck() {
      store.dispatch('resetDeck');
      function Card(figure, value, color) {
        this.figure = figure;
        this.value = value;
        this.color = color
      };
      for (let i=2; this.index>i; i++) {
        store.state.colors.forEach(function(el){
          if (i<=10) {
            let card = new Card(i, i, el);
            store.dispatch('addToDeck', card);
          } else {
            store.state.figures.forEach(function(fig){
              let card = new Card(fig, 10, el);
              if (card.figure === "A") {
                card.value = 11;
              }
              store.dispatch('addToDeck', card);
            })
          }
        })
      }
    },
    getCard(where) {
      this.cardTaken = true;
      let cardDeck = store.state.deck;
      let cardInDeck =  cardDeck.length;
      let singleCardNumber = Math.floor(Math.random()*cardInDeck);
      where.push(store.state.deck[singleCardNumber]);
      store.dispatch('deleteFromDeck', singleCardNumber);
    },
    sumPoints() {
      if (this.yourPoints < 21) {
        this.yourPoints = 0;
        let points = 0;
        let myCards = this.myCards;
        myCards.forEach(function(el){
          if (points + el.value > 21 && el.value === 11) {
            points += 1;
          } else if (myCards.length === 2 && points + el.value === 22) {
            points = 21;
          }
          else {
            points += el.value;
          }
        })
        this.yourPoints = points;
      }
    },
    sumEnemyPoints() {
      if (this.enemyPoint < 21) {
        this.enemyPoint = 0;
        let points = 0;
        let enemyCard = this.enemyCard;
        enemyCard.forEach(function(el){
          if (points + el.value > 21 && el.value === 11) {
            points += 1;
          } else if (enemyCard.length === 2 && points + el.value === 22) {
            points = 21;
          }
          else {
            points += el.value;
          }
        })
        this.enemyPoint = points;
      }
    },
    getEnemyCards() {
      while(this.enemyPoint < 17){
        this.getCard(this.enemyCard);
        this.sumEnemyPoints();
      }
    },
    stay() {
      this.stopGettingCard = true;
      this.getEnemyCards();
      this.result();
      this.togglePopUp();
    },
    togglePopUp() {
      this.gameOver = !this.gameOver;
    },
    newGame() {
      if (this.bet !== 0) {
        this.stopGettingCard = false;
        this.myCards = [];
        this.enemyCard = [];
        this.yourPoints = 0;
        this.enemyPoint = 0;
        this.canNewGame = false;
        this.makeDeck();
        this.getCard(this.myCards);
        this.getCard(this.myCards);
        this.sumPoints(this.yourPoints);
      } else (
        alert("Najpierw postaaw troche $$")
      )
    },
    restartGame() {
      this.bet = 0;
      this.canNewGame = true;
      this.togglePopUp();
    },
    result() {
      if (this.yourPoints > 21) {
        this.pointResult = "Przegrałeś";
        if (this.yourMoney < parseInt(this.bet)) {
          this.yourMoney = 0;
        } else {
          this.yourMoney -= parseInt(this.bet);
        }
      } else if ( this.yourPoints < this.enemyPoint && this.enemyPoint <= 21) {
        this.pointResult = "Przegrałeś";
        if (this.yourMoney < parseInt(this.bet)) {
          this.yourMoney = 0;
        } else {
          this.yourMoney -= parseInt(this.bet);
        }
      } else {
        this.pointResult = "wygrałeś";
        this.yourMoney += parseInt(this.bet);
      }
      this.cardTaken = false;
    }
  },
  mounted() {
  },
  watch: {
    yourPoints: function(val) {
      if (val >= 21) {
        this.result();
        this.togglePopUp();
      }
    }
  }
}
</script>

<style scoped>
  .blackjack {
    color: black;
  }
  .blackjack__console {
    display: flex;
  }
  .blackjack__elements {
    width: 70%;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .blackjack__buttons-container {
    display: flex;
    width: 30%;
    justify-content: space-between;
    align-items: center;
  }
  .blackjack__button {
    width: 100px;
    height: 50px;
    border: 1px solid black;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    background-color: #fff;
  }
  .blackjack__info {
    display: flex;
    width: 30%;
    justify-content: space-between;
    align-items: center;
  }
  .blackjack__lostGame {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(0,0,0,0.3);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .blackjack__lostGame-info {
    background-color: #fff;
    font-size: 45px;
    width: 300px;
    height: 150px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 20px;
  }
  .blackjack__your-cards {
    display: flex;
    justify-content: center;
    height: 200px;
    align-items: center;
  }
  .blackjack_card {
    background-color: #fff;
    border: 1px solid black;
    width: 100px;
    height: 150px;
    margin-right: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 20px;
    font-size: 40px;
  }
  .blackjack_card-color-red {
    color: red;
  }
  .blackjack_card-color-black {
    color: black;
  }
</style>
