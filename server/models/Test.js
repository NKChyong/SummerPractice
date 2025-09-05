import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String }],
  correctAnswer: { type: String },
  answerType: { type: String, enum: ['multiple', 'open'], required: true },
});

const TestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  questions: [QuestionSchema],
  url: { type: String, unique: true },
  duration: { type: Number, required: false, default: 0 }, // время в минутах, 0 = без ограничения
});


export default mongoose.model('Test', TestSchema);
