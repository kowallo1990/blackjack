const addToDeck = (state, object) => {
  state.deck.push(object);
}
const deleteFromDeck = (state, index) => {
  state.deck.splice(index, 1);
}
const resetDeck = (state) => {
  state.deck = [];
}
export default {
  addToDeck,
  deleteFromDeck,
  resetDeck
};
