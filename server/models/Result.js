import mongoose from 'mongoose';

const ResultSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  test: { type: mongoose.Schema.Types.ObjectId, ref: 'Test' },
  answers: [
    {
      questionId: mongoose.Schema.Types.ObjectId,
      selectedAnswer: String,
    },
  ],
  score: { type: Number },
});

export default mongoose.model('Result', ResultSchema);
