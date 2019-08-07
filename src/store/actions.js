const addToDeck = (context, object) => {
  context.commit('addToDeck', object);
};
const deleteFromDeck = (context, index) => {
  context.commit('deleteFromDeck', index);
};
const resetDeck= (context) => {
  context.commit('resetDeck');
}
export default {
  addToDeck,
  deleteFromDeck,
  resetDeck
};
