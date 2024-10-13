import connectToDatabase from '../../lib/mongodb';
import Design from '../../models/designers';

/**
 * @function handler
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @description API endpoint handler for managing design submissions.
 * Supports both POST and GET requests:
 * - POST: Saves a new design to the database.
 * - GET: Retrieves designs for a specific user based on user_id.
 */
export default function handler(req, res) {
  connectToDatabase().then(() => {
    if (req.method === 'POST') {
      console.log('Received data:', req.body);

      const { user_id, title, color, fabric, buttons, imageUrl } = req.body;

      if (!user_id || !title || !color || !fabric || !buttons || !imageUrl) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      const newDesign = new Design({ user_id, title, color, fabric, buttons, imageUrl });
      newDesign.save()
        .then(() => {
          res.status(201).json({ message: 'Design saved successfully!' });
        })
        .catch((error) => {
          console.error('Error saving design:', error);
          res.status(500).json({ message: 'Error saving design', error });
        });

    } else if (req.method === 'GET') {
      const { user_id } = req.query;
      if (!user_id) {
        return res.status(400).json({ message: 'user_id is required' });
      }

      Design.find({ user_id })
        .then((designs) => {
          res.status(200).json({ designs });
        })
        .catch((error) => {
          res.status(500).json({ message: 'Error fetching designs', error });
        });

    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  }).catch((error) => {
    console.error('Database connection error:', error);
    res.status(500).json({ message: 'Database connection error', error });
  });
}
