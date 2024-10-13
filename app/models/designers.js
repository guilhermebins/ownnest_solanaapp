import mongoose from 'mongoose';

const DesignSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  title: { type: String, required: true },
  color: { type: String, required: true },
  fabric: { type: String, required: true },
  buttons: { type: String, required: true },
  imageUrl: { type: String, required: true }
});

export default mongoose.models.Design || mongoose.model('Design', DesignSchema);
