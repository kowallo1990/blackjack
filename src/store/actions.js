const addToDeck = (context, object) => {
  context.commit('addToDeck', object);
};

const deleteFromDeck = (context, index) => {
  context.commit('deleteFromDeck', index);
};

export default {
  addToDeck,
  deleteFromDeck
};
