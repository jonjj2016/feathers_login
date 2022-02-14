// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    const { data } = context;
    if (!data.text) {
      throw new Error('Message must have text')
    }
    const {user} = context.params;
    console.log(user._id);
    const text = data.text.substring(0,400);
    const message = {
      text,
      userId: user._id,
      createdAt: new Date().getDate()
    }
    context.data = message
    // console.log(context.data);
    return context;
  };
};
