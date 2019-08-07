const addToDeck = (state, object) => {
  state.deck.push(object);
}
const deleteFromDeck = (state, index) => {
  state.deck.splice(index, 1);
}
export default {
  addToDeck,
  deleteFromDeck
};
