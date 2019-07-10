const Counter = require('./models/Counter');

async function getNextSequenceValue(sequenceName) {
  const sequenceDocument = await Counter.findOneAndUpdate({_id: sequenceName}, { $inc: {sequence_value: 1}}, { new: true}); 
  const result = await sequenceDocument.save();
  console.log("Result of saving sequence docuemnt", result);
  return result.sequence_value;
};

module.exports.getNextSequenceValue = getNextSequenceValue;