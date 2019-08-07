<template>
  <div class="blackjack">
    <div
      class="blackjack__lostGame"
      v-if="gameOver"
    >
      <div
        class="blackjack__lostGame-info"
        @click="restartGame"
      >
        Przegrałeś
      </div>
    </div>
    <div
      v-if="yourPoints<21"
      class="blackjack__getCard"
      @click="() => {getCard(myCards); sumPoints()}"
    >
      Get Card
    </div>
    <div>
      {{playerPoints}}
    </div>
  </div>
</template>

<script>
import store from '../store/index.js'

export default {
  name: 'HelloWorld',
  data() {
    return {
      figures: store.state.figures,
      myCards: [],
      yourPoints: 0,
      index: 12,
      gameOver: false
    }
  },
  props: {
    msg: String
  },
  computed: {
    playerPoints() {
      return this.yourPoints;
    }
  },
  methods: {
    makeDeck() {
      store.state.deck = [];
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
      let cardDeck = store.state.deck;
      let cardInDeck =  cardDeck.length;
      let singleCardNumber = Math.floor(Math.random()*cardInDeck);
      where.push(store.state.deck[singleCardNumber]);
      store.dispatch('deleteFromDeck', singleCardNumber);
      console.log(this.myCards)
    },
    sumPoints() {
      if (this.yourPoints < 21) {
        let points = 0;
        this.myCards.forEach(function(el){
          points += el.value;
        })
        this.yourPoints = points;
      }
    },
    togglePopUp() {
      this.gameOver = !this.gameOver;
    },
    newGame() {
      this.makeDeck();
      this.getCard(this.myCards);
      this.getCard(this.myCards);
      this.sumPoints();
    },
    restartGame() {
      this.newGame();
      this.togglePopUp();
    }
  },
  mounted() {
    this.newGame();
  },
  watch: {
    yourPoints: function(val) {
      if (val > 21) {
        this.togglePopUp();
      }
    }
  }
}
</script>

<style scoped>
  .blackjack__getCard {
    width: 100px;
    height: 50px;
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
</style>
