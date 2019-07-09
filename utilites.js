const Counter = require('./models/Counter');

async function getNextSequenceValue(sequenceName) {
  const sequenceDocument = await Counter.findOneAndUpdate({_id: sequenceName}, { $inc: {sequence_value: 1}}, { new: true}); 
  await sequenceDocument.save();
  return sequenceDocument.sequence_value;
};

module.exports.getNextSequenceValue = getNextSequenceValue;